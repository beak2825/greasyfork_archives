// ==UserScript==
// @name         临时style
// @namespace    http://webidea.top/
// @version      2.0.0
// @description  临时在页面添加style，按URL存储，仅保留最新5条
// @author       TamsChan
// @match        *://*/*
// @icon         https://wiki.greasespot.net/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509758/%E4%B8%B4%E6%97%B6style.user.js
// @updateURL https://update.greasyfork.org/scripts/509758/%E4%B8%B4%E6%97%B6style.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 设置最大保留记录数
  const MAX_RECORDS = 5;
  // 获取当前页面URL
  const currentUrl = window.location.href;

  GM_addStyle(`#temporary-style{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-moz-box-orient:horizontal;-moz-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-align-content:center;-ms-flex-line-pack:center;align-content:center;-webkit-box-pack:start;-webkit-justify-content:flex-start;-moz-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;position:fixed;right:0;top:50%;z-index:9999999999;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);-o-transform:translateY(-50%);transform:translateY(-50%);}#temporary-style .left-btn{position:absolute;left:0;-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);-ms-transform:translateX(-100%);-o-transform:translateX(-100%);transform:translateX(-100%);border-top-left-radius:8px;border-bottom-left-radius:8px;background-color:#242685;}#temporary-style .left-btn .icon{display:block;width:30px;height:30px;cursor:pointer;}#temporary-style .left-btn .icon:nth-child(2){display:none;}#temporary-style .right-textarea-box{width:300px;background-color:#ffffff;-webkit-box-shadow:0 0 10px 0 rgba(0,0,0,0.3);box-shadow:0 0 10px 0 rgba(0,0,0,0.3);-webkit-transition:all 0.3s;-o-transition:all 0.3s;-moz-transition:all 0.3s;transition:all 0.3s;border-top-left-radius:5px;border-bottom-left-radius:5px;}#temporary-style .right-textarea-box .right-textarea{padding:5px;}#temporary-style .right-textarea-box .right-textarea #temporary-style-textarea{width:100%;height:200px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:5px;font-size:18px;-webkit-box-shadow:none;box-shadow:none;border:1px solid rgba(0,0,0,0.3);border-radius:5px;}#temporary-style .right-textarea-box .right-textarea #temporary-style-sub{display:block;width:80px;height:40px;border-radius:8px;font-size:18px;color:#ffffff;background-color:#25a178;margin-top:5px;margin-left:auto;cursor:pointer;}`);

  // 从存储中获取样式记录
  let styleRecords = GM_getValue("style_records", []);
  // 查找当前URL对应的样式
  let currentStyle = "";
  const currentRecordIndex = styleRecords.findIndex(record => record.url === currentUrl);
  if (currentRecordIndex !== -1) {
    currentStyle = styleRecords[currentRecordIndex].css;
    // 将当前记录移到最前面（标记为最新使用）
    const currentRecord = styleRecords.splice(currentRecordIndex, 1)[0];
    styleRecords.unshift(currentRecord);
    GM_setValue("style_records", styleRecords);
  }

  // 应用当前URL的样式
  if (currentStyle) {
    let temporary_style_style = document.createElement("style");
    temporary_style_style.id = "temporary-style-style";
    temporary_style_style.innerHTML = currentStyle;
    document.body.appendChild(temporary_style_style);
  }

  // 创建UI
  var pupout_dom = document.createElement("div");
  let _html = `<div id="temporary-style"><div class="left-btn"><svg t="1692849893736"id="temporary-open"class="icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"p-id="1100"width="200"height="200"><path d="M561.92 192a47.36 47.36 0 0 1 0 64l-256 256 256 256a47.36 47.36 0 0 1-64 64L206.08 545.92A50.56 50.56 0 0 1 192 512a47.36 47.36 0 0 1 14.08-33.28L494.72 192a47.36 47.36 0 0 1 67.2 0z"p-id="1101"fill="#ffffff"></path><path d="M817.92 192a47.36 47.36 0 0 1 0 64l-256 256 256 256a47.36 47.36 0 0 1-64 64L462.08 545.92A50.56 50.56 0 0 1 448 512a47.36 47.36 0 0 1 14.08-33.28L750.72 192a47.36 47.36 0 0 1 67.2 0z"p-id="1102"fill="#ffffff"></path></svg><svg t="1692849333938"id="temporary-close"class="icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"p-id="1240"width="200"height="200"><path d="M462.08 192a47.36 47.36 0 0 0 0 64l256 256-256 256a47.36 47.36 0 1 0 64 64l288.64-288.64A50.56 50.56 0 0 0 832 512a47.36 47.36 0 0 0-14.08-33.28L529.28 192a47.36 47.36 0 0 0-67.2 0z"p-id="1241"fill="#ffffff"></path><path d="M206.08 192a47.36 47.36 0 0 0 0 64l256 256-256 256a47.36 47.36 0 1 0 64 64l291.84-286.08A50.56 50.56 0 0 0 576 512a47.36 47.36 0 0 0-14.08-33.28L273.28 192a47.36 47.36 0 0 0-67.2 0z"p-id="1242"fill="#ffffff"></path></svg></div><div class="right-textarea-box"style="width: 0;"><div class="right-textarea"><textarea id="temporary-style-textarea"cols="30"rows="10">${currentStyle}</textarea><button id="temporary-style-sub">生成</button></div></div></div>`;
  pupout_dom.innerHTML = _html
  document.body.appendChild(pupout_dom);

  // 事件监听
  document.addEventListener("click", function (event) {
    let open_list = document.querySelectorAll("#temporary-open *");
    let open_f = false;
    for (let o_item of open_list) {
      if (o_item == event.target){
        open_f = true
        break
      }
    }
    let close_list = document.querySelectorAll("#temporary-close *");
    let close_f = false;
    for (let c_item of close_list) {
      if (c_item == event.target){
        close_f = true
        break
      }
    }
    if (event.target == document.getElementById("temporary-open") || open_f) {
      document.querySelector("#temporary-style .right-textarea-box").style.width = "300px";
      document.getElementById("temporary-open").style.display = "none";
      document.getElementById("temporary-close").style.display = "block";
    }
    if (event.target == document.getElementById("temporary-close") || close_f) {
      document.querySelector("#temporary-style .right-textarea-box").style.width = "0px";
      document.getElementById("temporary-close").style.display = "none";
      document.getElementById("temporary-open").style.display = "block";
    }
    if (event.target == document.getElementById("temporary-style-sub")) {
      let style_text = document.getElementById("temporary-style-textarea").value;
      // 更新样式记录
      let styleRecords = GM_getValue("style_records", []);
      const currentRecordIndex = styleRecords.findIndex(record => record.url === currentUrl);
      // 移除旧记录（如果存在）
      if (currentRecordIndex !== -1) {
        styleRecords.splice(currentRecordIndex, 1);
      }
      // 添加新记录到最前面
      styleRecords.unshift({ url: currentUrl, css: style_text, timestamp: Date.now() });
      // 只保留最新的MAX_RECORDS条
      if (styleRecords.length > MAX_RECORDS) {
        styleRecords = styleRecords.slice(0, MAX_RECORDS);
      }
      GM_setValue("style_records", styleRecords);
      // 更新页面样式
      if(document.getElementById("temporary-style-style")){
        let temporary_style_style = document.getElementById("temporary-style-style");
        temporary_style_style.innerHTML = style_text;
      } else {
        let temporary_style_style = document.createElement("style");
        temporary_style_style.id = "temporary-style-style";
        temporary_style_style.innerHTML = style_text;
        document.body.appendChild(temporary_style_style);
      }
    }
  });
})();