// ==UserScript==
// @name         Town of Salem XML Editor
// @namespace    https://kahoot-win.com
// @version      1.2.4
// @icon         https://blankmediagames.com/TownOfSalem/favicon.ico
// @description  Edit the XML files in the web version of Town of Salem
// @author       theusaf
// @copyright    2021, Daniel Lau (https://github.com/theusaf/town-of-salem-edit-xml)
// @match        https://blankmediagames.com/TownOfSalem/
// @match        https://www.blankmediagames.com/TownOfSalem/
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/420353/Town%20of%20Salem%20XML%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/420353/Town%20of%20Salem%20XML%20Editor.meta.js
// ==/UserScript==

/* global TOSXML_Data */

if (window.TOSXML_Loaded || window.parent.TOSXML_Loaded) {
  throw "[TOSXML] - Already loaded";
}
if (!localStorage.TOSXML_Replacements){
  localStorage.TOSXML_Replacements = "{}";
}
if(window.location.hostname === "blankmediagames.com") {
  window.location.hostname = "www.blankmediagames.com";
  throw "[TOSXML] - Redirecting to www.blankmediagames.com";
}
document.write("[TOSXML] - Patching Town of Salem. Please wait. If this screen stays blank for long periods of time, this userscript may not be working properly. Disable it and send a report to theusaf.");
const mainPage = new XMLHttpRequest();
mainPage.open("GET",location.href);
mainPage.send();
mainPage.onload = function(){
  let {responseText} = mainPage;
  const [scriptURL] = responseText.match(/Build\/.*?\.js/m),
    scriptRequest = new XMLHttpRequest();
  responseText = responseText.replace(" src=\"" + scriptURL + "\"","");
  scriptRequest.open("GET",scriptURL);
  scriptRequest.send();
  scriptRequest.onload = function(){
    let {responseText:scriptText} = scriptRequest;
    const code = (data)=>{
        function sanitize(data){
          return data.replace(/</mg,"&lt;").replace(/>/mg,"&gt;");
        }
        if(data.target.result && data.target.result.url && data.target.result.url.match(/TownOfSalem\/Unity\/WebAssets.+?\/XMLData\/StringTable.+?\.xml/)){
          // modify!
          const encoder = new TextEncoder(),
            decoder = new TextDecoder("utf8"),
            XMLParser = new DOMParser,
            TOSXML_Replacements = JSON.parse(localStorage.TOSXML_Replacements),
            warn = [];
          let XMLText = decoder.decode(data.target.result.xhr.response);
          const XMLData = XMLParser.parseFromString(XMLText,"text/xml").documentElement;
          if(!XMLData.querySelector("[key=\"TOSXML_EDITED\"]")) {
            console.warn("[TOSXML] - Saving new original to local storage");
            const thing = document.createElementNS("TOSXML", "Entry");
            thing.setAttribute("key", "TOSXML_EDITED");
            thing.innerHTML = "TRUE";
            XMLData.append(thing);
            const originalData = XMLData.outerHTML;
            localStorage.TOSXML_OriginalData = originalData;
          } else if(localStorage.TOSXML_OriginalData) {
            console.warn("[TOSXML] - Loading original xml from local storage");
            // cached the edited version, restore defaults from localStorage
            XMLData.innerHTML = localStorage.TOSXML_OriginalData
              .replace(/^<StringTable .*>/,"")
              .replace(/<\/StringTable>$/m,"");
            XMLText = XMLData.outerHTML;
          } else {
            console.error("[TOSXML] - Edited XML Detected, but no local version found. Perhaps localStorage was cleared?")
          }
          try{
            window.parent.TOSXML_Data = {
              edited: XMLData,
              original: XMLParser.parseFromString(XMLText,"text/xml").documentElement,
              warn
            };
          }catch(e){
            // meh
          }
          if(TOSXML_Replacements){
            // start modifying
            for(const i in TOSXML_Replacements){
              const item = XMLData.querySelector(`[key="${TOSXML_Replacements[i].key}"]`);
              if(!item){
                warn.push({
                  key: TOSXML_Replacements[i].key,
                  reason: "Key Missing"
                });
                continue;
              }
              try {
                item.innerHTML = TOSXML_Replacements[i].value;
              } catch(err) {
                item.innerHTML = sanitize(TOSXML_Replacements[i].value);
              }
            }
            data.target.result.xhr.response = encoder.encode(XMLData.outerHTML).buffer;
          }
        }
      },
      [replaceText] = scriptText.match(/[a-z]\.target\.result\)}\)/m),
      [replaceLetter] = replaceText.match(/[a-z]/);
    scriptText = scriptText.replace(replaceText,`(()=>{
      (${code.toString()})(${replaceLetter});
      return ${replaceLetter}.target.result})()
    )})`);
    responseText = responseText.replace("<script></script>",`<script>${scriptText}</script>`);
    document.open();
    document.write(`<style>
      body{
        margin: 0;
      }
      iframe{
        border: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <iframe src="about:blank"></iframe>`);
    document.close();
    window.stop();
    const doc = document.querySelector("iframe");
    doc.contentDocument.write(responseText);
    document.title = "Town of Salem";
    const settingsDiv = document.createElement("div");
    settingsDiv.id = "TOSXML_Main";
    settingsDiv.innerHTML = `<style>
      #TOSXML_Main{
        position: fixed;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
      }
      #TOSXML_Main:hover{
        background: black;
      }
      #TOSXML_Hide, #TOSXML_Export, #TOSXML_Import{
        position: fixed;
        right: 1rem;
        font-size: 2rem;
      }
      #TOSXML_Hide{
        top: 1rem;
      }
      #TOSXML_Export{
        top: 4rem;
      }
      #TOSXML_Import{
        top: 7rem;
      }
      #TOSXML_EditWarnings{
        flex: 0.5;
      }
      details>div{
        display: flex;
      }
      details>div>div{
        flex: 1;
        overflow: auto;
        border-radius: 0.5rem;
        border: solid #666 0.25rem;
        height: calc(100vh - 6rem);
      }
      details>div>div>div>div{
        padding: 0.25rem;
      }
      details>div>div>div>div:nth-child(2n){
        background: #444;
      }
      details>div>div>div>div:nth-child(2n+1){
        background: #222;
      }
      code{
        background: black;
        border-radius: 0.5rem;
        padding: 0.25rem;
        line-height: 1.5rem;
      }
    </style>
    <details>
      <summary>TOSXML 1.2.4 @theusaf</summary>
      <p>Here, you can edit keys. However, changes will only take effect on reload. <strong>Also, your changes do get cached, so you may need to clear your cache to restore original text.</strong></p>
      <button id="TOSXML_Hide" title="Closes the editor until you reload the page.">Close</button>
      <button id="TOSXML_Export" title="Generates an xml file">Export</button>
      <button id="TOSXML_Import" title="Loads an xml file">Import</button>
      <div id="TOSXML_Container">
        <div id="TOSXML_AllKeys">
          <span>All Keys</span>
          <input id="TOSXML_Search" placeholder="Search">
          <div></div>
        </div>
        <div id="TOSXML_SavedEdits">
          <span>Your Edits</span>
          <div></div>
          <button>New Edit</button>
        </div>
        <div id="TOSXML_EditWarnings">
          <span>Errors/Warnings</span>
          <div></div>
        </div>
      </div>
    </details>`;
    document.body.append(settingsDiv);
    function sanitize(data){
      return data.replace(/</mg,"&lt;").replace(/>/mg,"&gt;");
    }
    const awaiter = setInterval(()=>{
      if(typeof TOSXML_Data !== "undefined"){
        clearInterval(awaiter);
        const {original,warn} = TOSXML_Data,
          edited = JSON.parse(localStorage.TOSXML_Replacements),
          itemsAll = document.querySelector("#TOSXML_AllKeys>div"),
          itemsEdit = document.querySelector("#TOSXML_SavedEdits>div"),
          warnings = document.querySelector("#TOSXML_EditWarnings>div"),
          addButton = document.querySelector("#TOSXML_SavedEdits>button");
        addButton.onclick = ()=>{
          itemsEdit.append(newEdit());
        };
        for(let i = 0; i < original.children.length; i++){
          const item = original.children[i],
            e = document.createElement("div");
          e.innerHTML = `<code class="TOSXML_key">${item.getAttribute("key")}</code>
 - <code class="TOSXML_value">${sanitize(item.textContent)}</code>`;
          itemsAll.append(e);
        }
        for(const i in edited){
          itemsEdit.append(newEdit(edited[i]));
        }
        for(let i = 0; i < warn.length; i++){
          const item = warn[i],
            e = document.createElement("div");
          e.innerHTML = `<code class="TOSXML_key">${item.key}</code>
 - <code class="TOSXML_value">${item.reason}</code>`;
          warnings.append(e);
        }
      }
    },500);
    function newEdit(info){
      const e = document.createElement("div"),
        v = document.createElement("input"),
        d = document.createElement("button"),
        s = document.createElement("button");
      let k;
      s.innerHTML = "✔️";
      d.innerHTML = "X";
      v.placeholder = "Value";
      function save(){
        const data = JSON.parse(localStorage.TOSXML_Replacements);
        if(k.nodeName === "INPUT"){
          const n = document.createElement("code");
          n.innerHTML = k.value;
          k.replaceWith(n);
          k = n;
        }
        data[k.value || k.textContent] = {
          value: v.value,
          key: k.value || k.textContent
        };
        localStorage.TOSXML_Replacements = JSON.stringify(data);
      }
      function del(){
        e.outerHTML = "";
        const data = JSON.parse(localStorage.TOSXML_Replacements);
        delete data[k.value || k.textContent];
        localStorage.TOSXML_Replacements = JSON.stringify(data);
      }
      if(info){
        k = document.createElement("code");
        k.textContent = info.key;
        v.value = info.value;
      }else{
        k = document.createElement("input");
        k.placeholder = "Key";
      }
      d.onclick = del;
      s.onclick = save;
      e.append(k,v,s,d);
      return e;
    }
    const hideButton = document.querySelector("#TOSXML_Hide"),
      searchInput = document.querySelector("#TOSXML_Search"),
      exportButton = document.querySelector("#TOSXML_Export"),
      importButton = document.querySelector("#TOSXML_Import");
    let searchTimeout;
    hideButton.onclick = function(){
      settingsDiv.style.display = "none";
      delete window.TOSXML_Data;
    };
    searchInput.oninput = function(){
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const all = document.querySelectorAll("#TOSXML_AllKeys > div > div"),
          values = searchInput.value.split(" ");
        for(let i = 0; i < all.length; i++){
          const string = all[i].textContent.toLowerCase();
          let shouldHide = false;
          all[i].style.display = "";
          for(let j = 0; j < values.length; j++){
            const test = values[j].toLowerCase();
            if(string.indexOf(test) === -1){
              shouldHide = true;
              break;
            }
          }
          if(shouldHide){
            all[i].style.display = "none";
          }
        }
      }, 500);
    };
    exportButton.onclick = function() {
      const link = document.createElement("a");
      link.setAttribute("download", "tos-xml-export.xml");
      const XMLParser = new DOMParser,
        original = XMLParser.parseFromString(TOSXML_Data.original.outerHTML,"text/xml").documentElement,
        TOSXML_Replacements = JSON.parse(localStorage.TOSXML_Replacements);
      if(TOSXML_Replacements){
        // start modifying
        for(const i in TOSXML_Replacements){
          const item = original.querySelector(`[key="${TOSXML_Replacements[i].key}"]`);
          if(!item){
            continue;
          }
          item.innerHTML = TOSXML_Replacements[i].value;
        }
      }
      const blob = new Blob([original.outerHTML], {type: "application/xml"}),
        url = URL.createObjectURL(blob);
      link.href = url;
      link.style.display = "none";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    };
    importButton.onclick = function() {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = function() {
        const file = input.files[0];
        file.text().then((text) => {
          const XMLParser = new DOMParser,
            XMLData = XMLParser.parseFromString(text,"text/xml").documentElement,
            TOSXML_Replacements = {},
            original = XMLParser.parseFromString(TOSXML_Data.original.outerHTML,"text/xml").documentElement,
            keys = XMLData.querySelectorAll("Entry");
          for(let i = 0; i < keys.length; i++) {
            const key = keys[i].getAttribute("key"),
              item = original.querySelector(`[key="${key}"]`);
            if(item && (item.innerHTML === keys[i].innerHTML || item.getAttribute("xmlns"))) {
              continue;
            }
            TOSXML_Replacements[key] = {
              key,
              value: keys[i].innerHTML
            };
          }
          localStorage.TOSXML_Replacements = JSON.stringify(TOSXML_Replacements);
          alert("Imported XML File Successfully! Changes will be applied after reloading.");
          input.remove();
          const itemsAll = document.querySelector("#TOSXML_AllKeys>div"),
            itemsEdit = document.querySelector("#TOSXML_SavedEdits>div");
          itemsAll.innerHTML = "";
          itemsEdit.innerHTML = "";
          for(let i = 0; i < original.children.length; i++){
            const item = original.children[i],
              e = document.createElement("div");
            e.innerHTML = `<code class="TOSXML_key">${item.getAttribute("key")}</code>
   - <code class="TOSXML_value">${sanitize(item.textContent)}</code>`;
            itemsAll.append(e);
          }
          for(const i in TOSXML_Replacements){
            itemsEdit.append(newEdit(TOSXML_Replacements[i]));
          }
        });
      };
      input.style.display = "none";
      document.body.append(input);
      input.click();
    };
  };
};
