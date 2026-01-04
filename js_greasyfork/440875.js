// ==UserScript==
// @name         和谐3614
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.2
// @description  摸了;屏蔽热词，关键词屏蔽
// @author       shadowdreamer
// @match        https://cc.163.com/361433*
// @match         https://cc.163.com/20/5863183/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440875/%E5%92%8C%E8%B0%903614.user.js
// @updateURL https://update.greasyfork.org/scripts/440875/%E5%92%8C%E8%B0%903614.meta.js
// ==/UserScript==

(function () {
  let blockList = (window.localStorage.getItem("blockList") || "").split(",").filter(i => i);
  const localState = window.localStorage.getItem("harmony-3614-config");
  const config = {
    hideRepeat: true,
    noCommentColor:true,
    noHotComment:true,
    noCommentIcon:true,
    noSamllWindow:true,
    commentOpacity:0.8,
    commentSize:22,
  };
  if(localState){
    Object.assign(config,JSON.parse(localState));
  }else{
    window.localStorage.setItem("harmony-3614-config",JSON.stringify(config));
  }
  function saveConfig(){
    window.localStorage.setItem("harmony-3614-config",JSON.stringify(config));
    addStyle()
  }  
  function fireCommnt(node) {
    node.style.display = "none";
  }
  function initCommentObs() {
    const targetNode = document.querySelector(".comment-canvas");
    const obsConfig = { childList: true };
    const callback = function (mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if(typeof node === 'string')return;
              let html = node.innerHTML;              
              // 屏蔽热词
              if (html.indexOf('<img class="storm_bulletScreen_icon"') !== -1) {
                fireCommnt(node);
                return;
              };
              // 屏蔽图标人
              if(config.noCommentIcon){
                let child = node.querySelector('.activity_bulletScreen');
                if(child){
                  node.innerHTML = child.innerText;
                  html = node.innerHTML;
                }
              }
              // 屏蔽复读
              if(config.hideRepeat && html.length>5){
                let same = [...targetNode.querySelectorAll('.cmt')].filter(el=>el.innerHTML===html);
                if(same.indexOf(node) > 3){
                  console.log('屏蔽复读',node);
                  fireCommnt(node);
                  return
                }
              }
              // 屏蔽关键词
              blockList.forEach(str => {
                if (html.indexOf(str) !== -1) {
                  fireCommnt(node);
                  return;
                }
              });
            });
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, obsConfig);
  }

  function findCommentLayer() {
    const targetNode = document.querySelector(".main-area");
    const config = { attributes: false, childList: true, subtree: true };
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          if (mutation.target.className.includes("comment-canvas")) {
            initCommentObs();
            createDialog();
            addStyle();
            observer.disconnect();
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
  findCommentLayer();
  createDialog();

  function createDialog() {
    if (document.querySelector("#block-btn-3614")) return;
    let warp = document.querySelector(".tool-wrap");
    let btn = document.createElement("div");
    btn.id = "block-btn-3614";
    btn.className = "chat-tool";
    btn.innerText = "🚫";
    btn.title = "屏蔽词";
    btn.addEventListener("click", () => {
      const dialog = document.createElement("div");
      dialog.className = "dialog";
      dialog.innerHTML = /*html*/ `
        <div class="dialog-content">
          <h2>屏蔽列表</h2>
          <textarea id="dialog-input-blocklist">${blockList.join(",")}</textarea>
          <p>”,“分隔屏蔽词</p>
          
          <div class="mb-1">
            <label >弹幕透明度(0~1小数)</label>
            <input type="number" id="commentOpacity-config" value="${config.commentOpacity}">
          </div>
          <div class="mb-1">
            <label >弹幕字号(22左右吧)</label>
            <input type="number" id="commentSize-config" value="${config.commentSize}">
          </div>
          <div class="mb-1">
            <input type="checkbox" id="hideRepeat-config" ${config.hideRepeat&&'checked'}>
            <label >减少复读机</label>
          </div>
          <div class="mb-1">
            <input type="checkbox" id="noCommentColor-config" ${config.noCommentColor&&'checked'}>
            <label >彩色弹幕变白</label>
          </div>
          <div class="mb-1">
            <input type="checkbox" id="noHotComment-config" ${config.noHotComment&&'checked'}>
            <label >去掉热词</label>
          </div>
          <div class="mb-1">
            <input type="checkbox" id="noCommentIcon-config" ${config.noCommentIcon&&'checked'}>
            <label >图标弹幕变普通</label>
          </div>
          <div class="mb-1">
            <input type="checkbox" id="noSamllWindow-config" ${config.noSamllWindow&&'checked'}>
            <label >去掉小窗播放按钮</label>
          </div>
          <button id="dialog-btn-confirm">确定</button>
          <button id="dialog-btn-cancel">取消</button>
        </div>
      `;
      document.body.appendChild(dialog);
      ['commentOpacity','commentSize'].forEach(id=>{
        const input = document.querySelector(`#${id}-config`);
        input.addEventListener("change",()=>{
          config[id] = input.value;
          saveConfig();
        })
      });
      ['hideRepeat','noCommentColor','noHotComment','noCommentIcon','noSamllWindow'].forEach(id=>{
        const input = document.querySelector(`#${id}-config`);
        input.addEventListener("change",()=>{
          config[id] = input.checked;
          saveConfig();
        })
      });
      const btnConfirm = document.querySelector("#dialog-btn-confirm");
      btnConfirm.addEventListener("click", () => {
        const input = document.querySelector("#dialog-input-blocklist");
        let blockListValue = input.value;
        window.localStorage.setItem("blockList", blockListValue);
        blockList = blockListValue.split(",").filter(i => i);
        dialog.remove();
      });
      const btnCancel = document.querySelector("#dialog-btn-cancel");
      btnCancel.addEventListener("click", () => {
        console.log("cancel");
        dialog.remove();
      });
    });
    warp.appendChild(btn);
  }
  function addStyle() {
    let style  = document.querySelector('#block-style-3614');
    if(!style){
      style = document.createElement("style");
      style.id = "block-style-3614";
      document.querySelector("head").append(style);
    }
    style.innerText = /*css*/ `
  .cmt
  {
    font-size: ${config.commentSize}px !important;
    font-weight: 400 !important;
    pointer-events: none;
    opacity: ${config.commentOpacity} !important;
    ${config.noCommentColor?'color: #fff !important;':''}
  }
  .video-watermark{
    display: none !important;
  }
  #new-player-banner
  {
    display: none !important;
  }

  .gift-banner
  {
    display: none;
  }

  #room-tabs
  {
    display: none;
  }

  #chat-list-con
  {
    height: 100%;
  }
  ${config.noSamllWindow?`#pic-in-pic-btn{
      display: none  !important;
    }`:''}
  .dialog{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 9999999;
  }
  .dialog-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    min-height: 400px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px #000;
    padding:15px;
  }
  .dialog-content textarea{
    width: 100%;
    min-height: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-height: 223px;
    max-width: 98%;
  }
  .dialog-content input[type="number"]{
    border: 1px solid #ccc;
  }
  .dialog-content .mb-1{
    margin-bottom: 2px;
  }
  .dialog-content button{
    width: 100px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-left: 10px;
    margin-top: 10px;
  }
  `;
  }
})();
