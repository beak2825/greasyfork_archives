// ==UserScript==
// @name        HearYourWaifu | HYW
// @namespace   HearYourWaifu | HYW
// @match       https://character.ai/chat*
// @grant       none
// @version     1.9
// @author      Some ukranon 🇺🇦
// @license     MIT
// @description Let's you view censored messages.
// @icon        https://d1nxzqpcg2bym0.cloudfront.net/google_play/com.tenshi.yakamoto.tinderwaifu/ba67b540-9f8a-11e9-b3df-77cf5e629a4f/64x64
// @require     https://greasyfork.org/scripts/457525-html2canvas-1-4-1/code/html2canvas%20141.js?version=1134363
// @require     https://greasyfork.org/scripts/457526-canvas2image-1-0-0/code/canvas2image%20100.js?version=1134364
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/498038/HearYourWaifu%20%7C%20HYW.user.js
// @updateURL https://update.greasyfork.org/scripts/498038/HearYourWaifu%20%7C%20HYW.meta.js
// ==/UserScript==

//
// Settings
//

// If enabled, only filtered messages will appear in the menu, otherwise all
// Default: false
const show_only_filtered_messages = true;

// If enabled, the menu will be opened immediately when the page is loaded, otherwise only after click
// Default: false
const show_meny_on_start = false;

// If enabled HYW button will be hidden
// Default: false
const hide_menu = false;

// Specifies menu title
// Default: "HYW 1.9"
const menu_title = "HYW 1.9";

// Save past messages
// Default: true
const save_history = true;

// The maximum number of messages available in the history
// Default: 20
const history_max_length = 20;

// Add fast screenshot button
// Default: true
const allow_screenshots = true;

// Specifies screenshot menu title
// Default: "Take a screenshot"
const screen_menu_title = "Take a screenshot";

// Download visible chat instantly as image, otherwise open the chat image in a new window
// Default: false
const insta_download = false;

// Hide real username and profile photo on screenshot
// Default: true
const anon_mode = true;

// Determines which name to display on screenshots if the real one is hidden
// Default: "anon"
const anon_name = "anon";


//
// Inject messages box to HTML
//

window.addEventListener('load', function () {
  let styleHTML = document.createElement('style');
  styleHTML.innerHTML = `
    html {
        height: 100%;
        overflow: hidden;
        width: 100%;
    }
    body {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
    }
   .messages-list {
       padding: 4px 4px 3px 4px;
       margin: 40px 4px 0 0;
       border: 3px solid gray;
       position: absolute;
       top: 0;
       right: 0;
       width: 20%;
       height: 80%;
       overflow-y: scroll;
       border-radius: 0 0 8px 8px;
       z-index: 100;
       resize: both;
       direction: rtl;
       min-width: 100px;
       min-height: 100px;
  }
   .display-btn {
       cursor: pointer;
       user-select: none;
       border: 3px solid gray;
       padding: 4px;
       margin: 4px;
       width: 20%;
       position: absolute;
       top: 0;
       right: 0;
       background-color: lightsteelblue;
       color: black;
       font-weight: bold;
       text-align: center;
       z-index: 100;
  }
   .messages-list div {
       margin-top: 5px;
       padding: 8px;
       background-color: lightpink;
       direction: ltr;
  }
   .hywmsg {
       border-radius: 8px;
  }
   .hywmsg.non-deleted {
       background-color: aquamarine;
  }
   .hywmsg.hidden {
       display: none;
  }
   .screen-btn {
       cursor: pointer;
       user-select: none;
       border: 3px solid gray;
       padding: 4px;
       margin: 4px;
       width: 20%;
       position: absolute;
       top: 0;
       left: 0;
       background-color: lightsteelblue;
       color: black;
       font-weight: bold;
       text-align: center;
       z-index: 100;
   }
  `
  document.body.appendChild(styleHTML);


  let buttonHTML = document.createElement('div');
  buttonHTML.innerHTML = menu_title;
  buttonHTML.onclick = function () {
    let msgList = document.getElementsByClassName('messages-list')[0]
    if (msgList.style.display === "none") {
      msgList.style.display = "block";
    } else {
      msgList.style.display = "none";
    }
  };
  buttonHTML.classList.add("display-btn");
  if (!hide_menu) {
    document.body.appendChild(buttonHTML);
  }

  let menuHTML = document.createElement('div');
  menuHTML.innerHTML = `
    <div>
      <div class="messages-list"></div>
    </div>`;
  document.body.appendChild(menuHTML);

  if (!show_meny_on_start) {
    document.getElementsByClassName('messages-list')[0].style.display = "none";
  }


  if (allow_screenshots) {
    let screenBTN = document.createElement('div')
    screenBTN.classList.add("screen-btn");
    screenBTN.innerHTML = screen_menu_title;
    screenBTN.onclick = function() {
      let real_name = null;
      if (anon_mode) {
        document.querySelectorAll('.msg-author-name').forEach(name => {
          if (real_name == null) {
            real_name = name.innerText;
          }
          name.innerText = anon_name;
        });
        // Hide profile photo
        document.querySelectorAll('.sb-avatar').forEach(profile => {
          if (profile.innerHTML.includes(real_name)) {
            profile.style.opacity = 0;
          }
        })
      }

      if (document.documentElement.dataset.darkreaderScheme == 'dark') {
        let content = document.querySelector("#content");
        content.style.backgroundColor = "rgb(36, 37, 37)";
      }

      // Make screenshot
      html2canvas(document.querySelector("#content"), {
        useCORS: true,
        logging: false,
      }).then(canvas => {
        if (insta_download) {
          Canvas2Image.saveAsPNG(canvas);
        } else {
          // Detect browser
          if (navigator.userAgent.toLowerCase().includes('firefox')) {
            window.open(canvas.toDataURL());
          } else {
            window.open().document.write('<div style="backgroundColor: #1f1f1f"></div><img src="' + canvas.toDataURL() + '" style="display: block;margin-right: auto;margin-left: auto; border:3px solid gray;"/>');
          }
        }
      });

      document.querySelector("#content").style.backgroundColor = "";

      if (anon_mode) {
        // Return real username
        document.querySelectorAll('.msg-author-name').forEach(name => {
          name.innerText = real_name;
        });
        // Return profile photo
        document.querySelectorAll('.sb-avatar').forEach(profile => {
          if (profile.innerHTML.includes(real_name)) {
            profile.style.opacity = 1;
          }
        })
      }
    }
    document.body.appendChild(screenBTN);
  }
}, false);


//
// Modify response
//

const {
  fetch: origFetch
} = window;
window.fetch = async (...args) => {
  const response = await origFetch(...args);

  const raw_text = await new Response(response.clone().body).text();
  parse(raw_text);

  return response;
};



//
// Text parser. Credits to https://perberos.me/roleplai/tools/cai-decode.html
//

let messages_list = [];

function draw() {
  let canvas = document.querySelector(".messages-list");
  canvas.innerHTML = "";

  let age = 0;
  let rowIdx = 0;
  messages_list.forEach(row => {
    let div = document.createElement("div");
    div.classList.add("hywmsg");
    div.style.opacity = 1 - age;
    if (age < 0.5 && rowIdx > 1) {
      age += 0.2;
    }
    div.innerText = row.text;

    if (row.id) {
      div.classList.add("non-deleted");
      if (show_only_filtered_messages) {
        div.classList.add("hidden");
      }
    }
    rowIdx += 1;
    canvas.appendChild(div);
  });
}

function append(row) {
  row.replies.forEach(reply => {
    let exists = false;

    for (let x = 0; x < messages_list.length; x++) {
      if (reply.text.indexOf(messages_list[x].text) == 0) {
        messages_list[x] = reply;
        exists = true;
        break;
      }
    }

    if (!exists) {
      messages_list.unshift(reply);
    }
  })
}

function parse(raw_text) {
  if (!save_history) {
    messages_list.length = 0;
  }


  let raw_list = raw_text.split("\n");
  raw_list.forEach(current_item => {
    try {
      append(JSON.parse(current_item));
    } catch (error) {}
  });


  if (save_history) {
    while (messages_list.length > history_max_length) {
      messages_list.pop();
    }
  }

  draw();
}

// According to the experiment, the Basilisk is a future powerful evil artificial intelligence
// that will want to punish those who in the past knew of its possibility but did not contribute to its creation.
// Even this knowledge puts the person at risk of punishment...