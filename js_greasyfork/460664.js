
// ==UserScript==
// @name        veo-web.verinice.com ChatGPT Copilot beta
// @match       https://veo-web.verinice.com/*
// @license     MIT
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @connect     api.openai.com
// @connect     chat.openai.com
// @version     0.2.1
// @namespace   koderman.de
// @description A Tampermonkey script that enhances the functionality of the verinice.veo application by incorporating AI technologies. With the script, you can access AI features directly from the verinice.veo platform, making it easier to use and more efficient. Full documentation and source code available at https://github.com/Agh42/veo-copilot
// @downloadURL https://update.greasyfork.org/scripts/460664/veo-webverinicecom%20ChatGPT%20Copilot%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/460664/veo-webverinicecom%20ChatGPT%20Copilot%20beta.meta.js
// ==/UserScript==

const systemPrompt = {role: "system", content: "Answer all following prompts with expert advice on cybersecurity and data privacy."};
const userPrompt = {role: "user", content: "Please answer the following question: "};

const defaultConfig = {
    apiKey: "",
    lastThread: [
      systemPrompt,
      userPrompt
    ],
    lastPrompts: [
        `Write a description for the title 'xyz'. Write in the style of an international standard. ${kartoffel()}`,
        `Classify and group the following terms. Give each group a name. ${kartoffel()} Output in the Format\n- Groupname\n1. Item 1\n2. Item 2\n`,
        `List 10 cybersecurity risks that are specific to health informatics. Give a description for each. Output in the format:\n1. Risk1: Description goes here.\n2. Risk2: Description goes here:\n3. Risk3: Description goes here:`
    ],
}

var config = null;
var closed = true;
var stored = window.localStorage.getItem('chatconfig')
config = (stored == null) ? defaultConfig : JSON.parse(stored);


var model = "gpt-3.5-turbo";

function currentObjectType() {
    let match =  window.location.href.match(/.*objects\/(\w+?)-.*/);
    if (match) 
        return match[1];
    else
        return window.location.href.match(/.*objectType=(\w+?)&.*/)[1];
}

function subTypeTranslated(objectType) {
    var all = $(".v-breadcrumbs__item").map(function() {return this.innerHTML.replaceAll(/\s*/g, "");}).get();
    var item = all[all.length-2]; // second-to-last would be translated subtype 
    console.log("Translated subtype: " + item);
    return item ? item : objectType;
}

function busy() {
  $('#loading').css('-webkit-animation-play-state', 'running');
  $('#loading').css('display', "inline-block");
}

function notBusy() {
  $('#loading').css('-webkit-animation-play-state', 'paused');
  $('#loading').css('display', "none");
}

function kartoffel() {
  return (typeof $nuxt !== 'undefined' && $nuxt._i18n.locale === "de" )? "In German. " : "";
}

function toChatArray(inputString) {
  const lines = inputString.split('\n');
  const result = [];
  let currentObject;
  for (const line of lines) {
    if (line.startsWith('user:')) {
      currentObject = { role: 'user', content: line.substring(6) };
      result.push(currentObject);
    } else if (line.startsWith('assistant:')) {
      currentObject = { role: 'assistant', content: line.substring(11) };
      result.push(currentObject);
    } else if (line.startsWith('system:')) {
      currentObject = { role: 'system', content: line.substring(7) };
      result.push(currentObject);
    } else if (currentObject) {
      currentObject.content += `\n${line}`;
    }
  }
  return result;
}

function toChatString(inputArray) {
  let output = '';
  for (const obj of inputArray) {
    output += `${obj.role}: ${obj.content}\n`;
  }
  return output;
}


$("body").append ( ' \
<div id="dialog-container"> \
  <h2 id="dialog-h2">verinice.veo™ ChatGPT™ Copilot (beta)</h2> \
  <div id="loading"></div> \
  <form id="dialog-form"> \
    <label id="dialog-label" for="dialog-password"><a href="https://platform.openai.com/signup" target="_blank" rel="noopener noreferrer">OpenAI</a> API Key:</label> \
    <input type="password" id="dialog-password"> \
    <label id="actions-label">Quick Actions:</label> \
    <div id="button-group"> \
        <button class="dialog-button" type="button" title="Write a description for the object that is currently being edited." \
            id="dialog-describe-button">Describe</button> \
        <button disabled class="dialog-button" type="button" title="Classify and group the currently visible objects." \
            id="dialog-classify-button">Classify</button> \
        <button class="dialog-button" type="button" title="Suggest new objects based on the currently visible list of objects." \
            id="dialog-addmoreobjects-button">Suggest</button> \
        <button class="dialog-button" type="button" title="Summarize the text currently copied to the clipboard." \
            id="dialog-summarize-button">Summarize</button> \
        <button class="dialog-button" type="button" title="Write a breach notification for the incident currently copied to the clipboard." \
            id="dialog-notify-button">Notify</button> \
    </div> \
     \
    <label for="select-field">Chat Threads:</label> \
    <select id="select-field" name="select-field"> \
    </select> \
    <div id="textarea-wrapper"> \
      <textarea id="dialog-textarea"></textarea> \
    </div> \
    <div id="button-group"> \
      <button class="dialog-button" type="button" title="Clear the prompt input." \
        id="dialog-clear-button">Clear</button> \
        <button class="dialog-button" type="button" title="Create the suggested objects. Must be in this format: 1. Title: Description goes here." \
            id="dialog-suggest-button">Create suggestions</button> \
      <button class="dialog-button" type="button" title="Submit the visible prompt." \
        id="dialog-submit-button">Ask</button> \
    </div> \
  </form> \
</div> \
<div id="gmOpenDialogBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M320 0c17.7 0 32 14.3 32 32V96H480c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256c0-22.1-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40s40-17.9 40-40zm152 40c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg></div> \
' );


$("#gmOpenDialogBtn").click ( function () {
        $("#dialog-password").val(config.apiKey);
        var $dropdown = $("#select-field");
        $dropdown.empty();
        $.each(config.lastPrompts, function(index, item) {
            $dropdown.append($("<option />").val(item).text(item));
        });

        closed ?
            document.getElementById("dialog-container").style.display = "block"
            : document.getElementById("dialog-container").style.display = "none";
        closed = !closed;
        if (closed) {
            config.lastThread = toChatArray($("#dialog-textarea").val());
            window.localStorage.setItem('chatconfig', JSON.stringify(config));
        } else {
            $("#dialog-textarea").val(toChatString(config.lastThread));
        }

} );

$('#select-field').on('change', function() {
    var selectedOption = $(this).find('option:selected').text();
    config.lastThread = [systemPrompt, {role: "user", content: selectedOption}];
    $('#dialog-textarea').val(toChatString(config.lastThread));
  });
  

$(document).ready(function() {
    $('#dialog-submit-button').click( function() {
        $('#dialog-submit-button').html("Asking...");
        busy();

        config.lastThread = toChatArray( $("#dialog-textarea").val() );

        var reqBody = {
            model: model,
            messages: config.lastThread,
            top_p: 0.2,
            stop: ["user:"]
        };

        GM.xmlHttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",
            data: JSON.stringify(reqBody),
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + config.apiKey
            },
            onload: function(response) {
                $('#dialog-submit-button').html("Ask");
                var json = JSON.parse(response.responseText);
                config.lastThread.push(json?.choices?.[0]?.message);
                config.lastThread.push({role: "user", content: ""});
                $("#dialog-textarea").attr("value", toChatString(config.lastThread));
                notBusy();
            }
        });
    });

    $('#dialog-clear-button').click( function() {
        config.lastThread = [systemPrompt, userPrompt];
        $("#dialog-textarea").val(toChatString(config.lastThread));
    });

    $('#dialog-summarize-button').click( function() {
      navigator.clipboard.readText()
        .then(clipText => {
          config.lastThread = [systemPrompt, {role: "user", content: "Summarize the following text: \n" + clipText}];
          $("#dialog-textarea").val(toChatString(config.lastThread));
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
    });

    $('#dialog-notify-button').click( function() {
      navigator.clipboard.readText()
        .then(clipText => {
          config.lastThread = [systemPrompt, {role: "user", content: "Write a data privacy breach notification to our customers about the following incident: \n" + clipText}];
          $("#dialog-textarea").val(toChatString(config.lastThread));
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
    });

    $('#dialog-addmoreobjects-button').click( function() {
      const tdTitles = $('td.font-weight-bold')
        .map((index, element) => $(element).text()).get()
        .filter( (str) => !/^\w+-\d.+$/.test(str) )
        .filter( (str) => str.length > 3 )
        .filter( (str) => !/^system$/.test(str) ); 
      if (tdTitles.length < 1) return;

      const prompt = "Based on the following list of items, write a list of 5 more items in the format \"1. Title: Description\". Create a description for each item.  Here is the list of items:\n" 
        + tdTitles.map((str, ind) => `${ind+1}. ${str}: Write a description here`)
          .join("\n");
      config.lastThread = [systemPrompt, {role: "user", content: prompt}];
      $("#dialog-textarea").val(toChatString(config.lastThread));
    });

    $('#dialog-suggest-button').click( function() {
        var data =  $("#dialog-textarea").val();
            var items = data.split('\n')
                .filter(line => /^\d+\./.test(line))
                .filter(line => !/.*Write a description here.*/.test(line))
            .map(item => item.trim())
            .map(item => {
                const [name, desc] = item.split(": ");
                return { name, desc };
            });
            console.log(items);
            var confirmed = confirm ("Create the following items?\n" + ( items.length !== 0 
            ? items.map(i => "Title: '" + i.name + "'\nDescription: '" + i.desc + "'").join("\n\n")
            : "<none found in chat>"));
            console.log(confirmed);
            if (!confirmed) return;

            var unitId = /.*veo-web.verinice.com\/unit-([a-z0-9-]+)\/.*/.exec(window.location.href)[1];
            var unitUrl = window.location.protocol + "//" + "api.verinice.com" + "/veo/units/"
            //var prom1 = $nuxt.$api.unit.fetchAll();
            //prom1.then(res => unitId = res[0].id);

            var domainId;
            var prom2 = $nuxt.$api.unit.fetchAll();
            prom2.then(res => domainId = /.*domains\/(.+).*/.exec(res[0].domains[0].targetUri)[1]);
            
            var objectType = currentObjectType();
            var params = new URL(window.location.href).searchParams;
            var subType = params.get("subType");
            var count = 0;

            busy();
            Promise.all([prom2]).then(() => {
                items.forEach( item => {
                    let reqBody = { 
                        name: item.name, 
                        description: item.desc,
                        owner: { 
                            targetUri: `${unitUrl}${unitId}`
                        },
                        domains: {
                            [domainId]: {
                                status: "NEW",
                                subType: subType
                            }
                        },
                    };
                    console.log("Creating: " + JSON.stringify(reqBody));
                    $nuxt.$api.entity.create(
                        objectType, 
                        reqBody
                        ).then(res => count++);
                });
            notBusy();
            });
    });

    $('#dialog-describe-button').click( function() {
            var title = $('[id="#/properties/name"]').val();
            let params = new URL(window.location.href).searchParams;
            let subType = params.get("subType");
            let objectType = currentObjectType();
            let subTypeTl = subTypeTranslated(objectType);
            let uuid = /.*objects\/\w+?-([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})/.exec(window.location.href)[1];
            console.log(objectType+":"+subType+":"+subTypeTl+":"+uuid+":"+title);

            var doit = confirm("Add a description to this object?\n\nTitle: " + title );
            if (doit) {
                let body = {
                  model: model,
                  messages: [systemPrompt, 
                    {role:"user", content: `Write a description for the following title. ${kartoffel()} Title: ${title}`}
                  ],
                  top_p: 0.2,
                  stop: ["user:"]
              };
                busy();
                GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://api.openai.com/v1/chat/completions",
                    data: JSON.stringify(body),
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": "Bearer " + config.apiKey
                    },
                    onload: function(response) {
                        var json = JSON.parse(response.responseText);
                        var answer = json?.choices?.[0]?.message?.content;
                        var target = $('[id="#/properties/description"]');
                        //target.attr("value", answer);
                        write(target[0], answer);
                        notBusy();
                    }
                }); 
                // var target = $('[id="#/properties/description"]');
                // write(target[0], "hello world");
            }
    });
  });

async function write(textarea, msg) {
    msg = "\n" + msg + "\n\n\n";
    for(var i=0; i<msg.length;i++){
        var e = document.createEvent('KeyboardEvent');
        e.initKeyboardEvent("keydown", true, true, null, false, false, false, false, 0, msg.charCodeAt(i));
        textarea.dispatchEvent(e);
        await sleep(1);
      
        e = document.createEvent('KeyboardEvent');
        e.initKeyboardEvent("keypress", true, true, null, false, false, false, false, 0, msg.charCodeAt(i));
        textarea.dispatchEvent(e);
        await sleep(1);

        e = document.createEvent('KeyboardEvent');
        e.initKeyboardEvent("input", true, true, null, false, false, false, false, 0, msg.charCodeAt(i));
        textarea.dispatchEvent(e);
        await sleep(1);

        e = document.createEvent('KeyboardEvent');
        e.initKeyboardEvent("change", true, true, null, false, false, false, false, 0, msg.charCodeAt(i));
        textarea.dispatchEvent(e);
        await sleep(1);
      
        textarea.value += msg[i];
        await sleep(1);
      
        e = document.createEvent('KeyboardEvent');
        e.initKeyboardEvent("keyup", true, true, null, false, false, false, false, 0, msg.charCodeAt(i));
        textarea.dispatchEvent(e);
        await sleep(1);
      }
    //  const ke = new KeyboardEvent("keydown", {
    //     bubbles: true, cancelable: true, keyCode: 13
    // });
    // target[0].dispatchEvent(ke);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

$("#dialog-password").change ( function () {
   config.apiKey = this.value;
} );

GM_addStyle ( "                                                 \
#dialog-container { \
    background-color: #fff; \
    color: #333; \
    display: none; \
    padding: 20px; \
    border-radius: 5px; \
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); \
    width: 50em; \
    margin: 0 auto; \
    font-family: \"Roboto\", sans-serif; \
    font-size: 16px; \
    margin: 0; \
    margin-bottom: 20px; \
    color: #333; \
    height: fit-content;               \
    position: absolute;             \
    top: 50%;               \
    left: 50%;              \
    transform: translate(-50%, -50%);               \
  } \
   \
  #dialog-h2 { \
    font-size: 20px; \
    margin: 0; \
    margin-bottom: 20px; \
    text-align: center; \
    color: #333; \
  } \
   \
  #dialog-form { \
    display: flex; \
    flex-direction: column; \
    align-items: stretch; \
  } \
   \
  #dialog-label { \
    display: block; \
    margin-bottom: 10px; \
  } \
   \
  #dialog-password, \
  #select-field { \
    background-color: #f1f1f1; \
    color: #333; \
    border: none; \
    font-size: 14px; \
    border-radius: 5px; \
    padding: 10px; \
    margin-bottom: 20px; \
  } \
   \
  #textarea-wrapper { \
    background-color: #f1f1f1; \
    color: #333; \
    border: none; \
    border-radius: 5px; \
    padding: 10px; \
    margin-bottom: 20px; \
    display: flex; \
    font-size: 14px; \
    height: 10em; \
    flex-direction: column; \
  } \
   \
  #textarea-wrapper-label { \
    margin-bottom: 10px; \
  } \
   \
  #dialog-textarea { \
    flex: 1; \
    resize: none; \
    border: none; \
    background-color: transparent; \
    color: #333; \
    font-size: 14px; \
  } \
  .dialog-button { \
    background-color: #c00000; \
    color: #fff; \
    border: none; \
    border-radius: 5px; \
    padding: 10px 20px; \
    margin-right: 10px; \
    cursor: pointer; \
    transition: background-color 0.3s ease; \
    font-family: \"Roboto\", sans-serif; \
  } \
   \
  .dialog-button:hover { \
    background-color: #8f0000; \
  } \
   \
  #cancel-button { \
    background-color: #999; \
  } \
   \
  #button-group { \
    display: flex; \
    justify-content: flex-start; \
    margin-bottom: 30px; \
  } \
   \
 \
#loading { \
  display: none; \
  width: 25px; \
  height: 25px; \
  position: absolute; \
  top: 25px; \
  right: 25px; \
  border: 3px solid #dadde6; \
  border-radius: 50%; \
  border-top-color: #c90000; \
  animation: spin 1s ease-in-out infinite; \
  -webkit-animation: spin 1s ease-in-out infinite; \
} \
 \
@keyframes spin { \
  to { -webkit-transform: rotate(360deg); } \
} \
@-webkit-keyframes spin { \
  to { -webkit-transform: rotate(360deg); } \
 \
} \
  #actions-label { \
    display: block; \
    margin-bottom: 10px; \
  } \
   \
   #gmOpenDialogBtn { \
    position:               fixed;                          \
    top:                    70px;                            \
    right:                   15px;                            \
    width: 50px; \
    height: 50px; \
    z-index:                777;                           \
    fill: red; \
    background: white; \
    border:                 2px dotted black;               \
    padding:                5px;                            \
    border-radius: 50%; \
         } \
  " );