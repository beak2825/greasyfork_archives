// ==UserScript==
// @name   Vietphrase converter
// @name:vi  convert kiểu Vietphrase
// @namespace  VP
// @version  1.1
// @description The userscript converts chinese novel webpage to Vietphrase format to read on web browser 
// @description:vi convert kiểu Vietphrase để đọc truyện trực tiếp trên web
// @author you
// @match  http*://*/*
// @grant  GM_setValue
// @grant  GM_getValue
// @run-at   document-idle
// @downloadURL https://update.greasyfork.org/scripts/498499/Vietphrase%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/498499/Vietphrase%20converter.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let Options = GM_getValue('Options', {
    Ngoac: false,
    Motnghia: true,
    daucach: ';',
    DichLieu: true,
    useSP: false,
    font: 'Roboto',
    whiteList: {},   //{host<string>:noButton<boolean>}
    blackList:'',
  });

  //Early return if match blackList
  if( Options.blackList.split(/[,;]/g).some( e=>!!e.trim()?location.host.includes( e.trim() ):false ) ) return;
  if (window !== window.top) return;

  // --- Utility: human-friendly dict format ---
  function importDict(text) {
    const dict = {};
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) continue;
      const [chinese, english] = trimmed.split("=").map(s => s.trim());
      if (chinese && english) dict[chinese] = english;
    }
    return dict;
  }

  // Create worker from inline script
  const workerCode = `
  self.onmessage = function(e) {
    const { dicts } = e.data;

    function buildTrie(dicts) {
      const root = { children: Object.create(null), value: null, priority: 0 };
      const sorted = Object.values(dicts).sort((a, b) => b.priority - a.priority);

      for (const {dict, priority} of sorted) {
        for (const key in dict) {
          let node = root;
          for (const char of key) {
            if (!node.children[char]) node.children[char] = { children: {}, value: null, priority: 0 };
            node = node.children[char];
          }
          if (priority >= node.priority) {
            node.value = dict[key];
            node.priority = priority;
          }
        }
      }
      return root;
    }

  const trie = buildTrie(dicts);
  self.postMessage({ trie });
  };
  `;
  const worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: "application/javascript" })));

  let dictsCache = {}; //{dictName:{dictData, priority}}
  let trieCache = null;

  function rebuildTrie() { worker.postMessage({ dicts: dictsCache }); }
  function updateTrie(newDicts) {
    worker.onmessage = function(e) {
      trieCache = e.data.trie;
      GM_setValue("dicts", newDicts);
      GM_setValue("trie", trieCache);
    };
    rebuildTrie();
  }

  const observer=new MutationObserver(mL => {
      for (const mo of mL)
        for (const addNode of mo.addedNodes) addNode.nodeValue= translate(addNode.nodeValue);
    });
// --- Translate with numeric priority rules ---
  function translate(str, bracket = true, oneMean = true, sep = ';', DichLieu = false) {
    if(!/\p{sc=Han}/u.test(str)) return str;
    const root = trieCache || {};
    const parts = [];

    str.split(/([^\p{sc=Han}]+)/ug).forEach( (text,index) => {
      if (index%2==1) return parts.push(text);
      let i = 0;
      while (i < text.length) {
        let node = root, j = i;
        let lastMatch = null, lastPos = i, lastPriority = 0;

        while (j < text.length && node?.children && node?.children[text[j]]) {
          node = node.children[text[j]];
          j++;
          if (node.value) {
            // Update if higher priority OR longer match of same priority
            if (node.priority > lastPriority ||
                (node.priority === lastPriority && j > lastPos)) {
              lastMatch = node.value;
              if (node.priority==2) {
                if (oneMean) lastMatch=lastMatch.split(sep)[0];
                if (bracket) lastMatch=`[${lastMatch}]`; }
              lastPos = j;
              lastPriority = node.priority;
            }
          }
        }

        if (lastMatch) {
          parts.push(lastMatch);
          i = lastPos;
        } else {
          if ( !(DichLieu && '的了着'.includes(text[i])) ) parts.push(text[i]);
          i++;
        }
      }
    });

    const punctMap = { "。": ".", "！": "!", "？": "?", "，": ",", "：": ":", "；": ";" };
    let output = parts.join(" ").replace(/[。！？，：；]/g, c => punctMap[c]);
    output = output.replace(/(^[\s\[]*\p{L}|[.!?]\s*\p{L})/ug, m => m.toUpperCase());
    output = output.replace(/(\s+?[.!?,:;])/g,m=>m.trim());
    // output = output.replace(/\s+/,' ');
    return output;
  }

  trieCache = GM_getValue("trie", {});

  // --- Toggle Translation ---
  const originalTitle = document.title;
  const originalBodyFont=getComputedStyle(document.body).getPropertyValue('font-family')??'';
  const originalTexts = new Map();
  const skipTags=['META', 'LINK', 'SCRIPT', 'STYLE', 'TEXTAREA', 'IMG', 'SVG', 'BR', 'NOSCRIPT', 'AREA', 'BASE', 'CANVAS', 'CODE', 'EMBED', 'MAP', 'PARAM', 'SOURCE', 'VIDEO', 'PICTURE', 'INPUT'];

  function applyTranslation() {
    document.title = translate(originalTitle);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parentTag = node.parentNode?.tagName;
        if (skipTags.includes(parentTag)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    observer.disconnect();

    let node;
    while ((node = walker.nextNode())) {
      if (!originalTexts.has(node)) originalTexts.set(node, node.textContent);
      node.textContent = translate(node.textContent);
    }
    document.body.style.setProperty('font-family', Options.font, 'important');

    // resume mutation observer
    observer.takeRecords();
    observer.observe(document.body,{ childList: true, subtree: true });
  }

  function restoreOriginal() {
    document.title = originalTitle;
    if (originalBodyFont) document.body.style.fontFamily = originalBodyFont;
    for (const [node, text] of originalTexts.entries()) node.textContent = text;
    observer.disconnect();
  }

  const uiHTML=`
  <style>
    .panel{
      position: fixed;
      top: 5px;
      right: 6px;
      z-index: 9999;
      background: white;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 1px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      overflow-y: auto;
    }
  </style>

  <div class="panel">
    <label id="translateBtn">Convert</label><label id="optionsBtn"> ↓</label>
  </div>

  <style>
  .modal {
      width: 500px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      background: white;
      margin: auto;
    }

  .tab-header {
      display: flex;
      border-bottom: 1px solid #ddd;
      gap: 3px;
    }

  .tab-btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      cursor: pointer;
      background: none;
      font-weight: bold;
      transition: 0.3s;
    }

  .tab-btn.active {
      color: darkblue;
      border: 1px solid blue;
    }

  .tab-content {
      display: none;
      padding: 20px;
      min-height: 300px;
    }

  .tab-content.active {
      display: block;
    }

  .form-row {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

  .modal label {
      min-width: 100px;
      font-size: 14px;
    }

  .modal input[type="text"],
  .modal textarea {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

  #dynamic-container {
    height:clamp(5rem,8rem,12rem);
    overflow-y: auto;
    }

  .dynamic-row {
      margin-bottom: 8px;
    }

  .large-textarea {
      width: 100%;
      height: auto;
      margin-top: 15px;
      resize: none;
      overflow-y: auto;
    }

  .modal-footer {
      padding: 20px;
      border-top: 1px solid gray;
      display: flex;
      flex-direction: row;
      gap: 40px;
      align-items: center;
    }

  .btn-cancel {
      flex: 1 40;
      background: #e2e8f0;
      color: #475569;
    }

  .btn-cancel:hover {
      background: #cbd5e1;
    }

  .btn-ok {
      flex: 1 40;
      background: rgb(17, 61, 255);
      color: white;
  }

  .btn-ok:hover {
      background: #1d4ed8;
    }

  .modal hr {
      border: 0;
      border-top: 1px solid #eee;
      margin: 15px 0;
    }
  </style>

  <dialog class="modal">
    <div class="tab-header">
      <button class="tab-btn active">Từ điển</button>
      <button class="tab-btn">Dịch</button>
      <button class="tab-btn">Tự động</button>
    </div>

    <div id="tab1" class="tab-content active">
      <div class="form-row"><label>Phiên âm</label><input id="PhienAm" prior="1" type="file"></div>
      <div class="form-row"><label>Vietphrase</label><input id="Vietphrase" prior="2" type="file"></div>
      <div class="form-row"><label>Names</label><input id="Names" prior="3" type="file"></div>
<!--       <div class="form-row"><label>Strucphrase</label><input type="file"></div> -->
    </div>

    <div id="tab2" class="tab-content">
      <div class="form-row"><input type="checkbox" id="Ngoac"> <label>Dùng [ngoặc]</label></div>
      <div class="form-row">
        <input type="checkbox" id="Motnghia"> <label>Một nghĩa</label>
        Dấu cách:<input type="text" maxlength="2" placeholder="Max 2" style="width: 50px;" id="daucach">
      </div>
      <div class="form-row"><input type="checkbox" id="DichLieu"> <label>Xóa đích, liễu, trứ</label></div>
      <div class="form-row" style="display:none"><input type="checkbox" id="useSP"> <label>Dùng Strucphrase</label></div>
    </div>

    <div id="tab3" class="tab-content">
      <div class="form-row">
        <label>Font thay thế:</label>
        <input type="text" placeholder="Nhập tên font..." id="font">
      </div>
      <hr>
      <div id="dynamic-container">
        Các site tự chạy:
      </div>
      <hr>
      <label>Các site không chạy(vd: .vn không cần chạy), cách nhau bằng dấu "," hoặc ";"</label>
      <textarea class="large-textarea" placeholder="Nhập text dài...">.vn,</textarea>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ok" onclick="saveData()">OK</button>
      <button class="btn btn-cancel">Cancel</button>
    </div>
  </dialog>`;


  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "open" });

  function prepareUI() {
    shadow.innerHTML=uiHTML;
    document.body.appendChild(host);

    //header button
    shadow.querySelectorAll('.tab-btn').forEach((tabBtn,i)=> tabBtn.addEventListener('click', event => {
      shadow.querySelectorAll('.tab-btn').forEach(btn=> btn.classList.remove('active') );
      shadow.querySelectorAll('.tab-content').forEach(btn=> btn.classList.remove('active') );
      event.target.classList.toggle('active');
      shadow.getElementById(`tab${i+1}`).classList.toggle('active');
    }));

    let newDicts={};
    shadow.querySelectorAll('input[type="file"]').forEach(f=> f.addEventListener('change',event=> {
      const file = event.target.files[0];
      if (!file) return;

      const dictName= event.target.getAttribute('id');
      const dictPriority=event.target.getAttribute('prior');

      const reader = new FileReader();
      reader.onload = () => {
        const dictData = importDict(reader.result);
        newDicts[dictName] = { dict: dictData, priority:dictPriority };
      };
      reader.readAsText(file);
    }) )

    function addNewRow(){
      shadow.getElementById('dynamic-container').insertAdjacentHTML('beforeend',`
      <div class="form-row dynamic-row">
        <input type="text" class="dynamic-input"><input type="checkbox"> <label>Xóa nút Translate</label>
      </div>`);

      let lastInput= shadow.querySelector('.dynamic-row:last-child input');
      lastInput.oninput=onInput;
      lastInput.onblur=onBlur;
      return lastInput;
    }

    function onInput(event){
      if(event.target.parentElement==shadow.querySelector('.dynamic-row:last-child'))
        addNewRow();
    }

    function onBlur(event) {
      const rows = shadow.querySelectorAll('.dynamic-row');
      if (event.target.value.trim()!=='' && event.target === shadow.querySelector('.dynamic-row:last-child input') )
        addNewRow();

      if (rows.length > 1 && event.target.value.trim() === "") {
        const parentRow = event.target.parentElement;
        if (event.target !== shadow.querySelector('.dynamic-row:last-child input')) parentRow.remove();
      }
    }

    // Buttons
    shadow.getElementById(`translateBtn`)?.addEventListener("click", event=>{
      let start= performance.now();
      if (event.target.textContent.trim()=='Convert') {event.target.textContent='Nguyên gốc'; applyTranslation();}
      else {event.target.textContent='Convert'; restoreOriginal();}
      console.error(performance.now()-start);
    });

    shadow.getElementById(`optionsBtn`)?.addEventListener("click", (e)=>{
      //load option into ui
      newDicts={};
      shadow.querySelectorAll('input[type="file"').forEach(f=>f.value=null);
      shadow.querySelector(`.modal`)?.showModal();
    });

    shadow.getElementById('Ngoac').checked = !!Options.Ngoac;
    shadow.getElementById('Motnghia').checked = !!Options.Motnghia;
    shadow.getElementById('daucach').value = Options.daucach??';';
    shadow.getElementById('DichLieu').checked = !!Options.DichLieu;
    shadow.getElementById('useSP').checked = !!Options.useSP;
    shadow.getElementById('font').value=Options.font??'Roboto';

    for (const [host, noButton] of Object.entries(Options.whiteList ||{}) ) {
      if ( !host.trim() ) continue;
      let domain=addNewRow();
      domain.value=host.trim();
      domain.nextElementSibling.checked=noButton;
    }
    addNewRow();

    //white list event
    shadow.querySelectorAll('.dynamic-input').forEach(row=>{
      row.oninput = onInput;
      row.onblur = onBlur;  });

    shadow.querySelector(`.btn-cancel`).onclick= () =>{shadow.querySelector(`.modal`)?.close()};
    shadow.querySelector(`.btn-ok`).onclick= () =>{
      //Save upload Dict
      if (Object.keys(newDicts).length>0) {
        dictsCache=GM_getValue('dicts',{});
        for (const [dictName,dictData] of Object.entries(newDicts)) dictsCache[dictName]=dictData
        updateTrie(dictsCache); //dictsCache saved also by GM_setValue
      }

      //save options from ui
      Options.Ngoac = !!shadow.getElementById('Ngoac').checked;
      Options.Motnghia = !!shadow.getElementById('Motnghia').checked;
      Options.daucach = shadow.getElementById('daucach').value.trim().slice(0,2) ?? ';';
      Options.DichLieu = !!shadow.getElementById('DichLieu').checked;
      // Options.useSP = !!shadow.getElementById('useSP').checked;
      Options.font = shadow.getElementById('font').value.trim();

      Options.whiteList={};
      shadow.querySelectorAll('.dynamic-input').forEach(e =>{
        if (e.value.trim()) Options.whiteList[e.value.trim()]=e.nextElementSibling.checked; } );

      Options.blackList=shadow.querySelector('.large-textarea').value.replace(/\r?\n/g,', ');

      GM_setValue('Options',Options);
      shadow.querySelector(`.modal`)?.close()
    };
  }

  for (const [host,noButton] of Object.entries(Options.whiteList)) {
    if (location.host.includes(host.toLowerCase()) ) {
      if (noButton) return applyTranslation();
      prepareUI();
      return shadow.getElementById(`translateBtn`).click(); }
  }
  prepareUI();
})();