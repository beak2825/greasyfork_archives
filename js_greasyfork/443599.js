// ==UserScript==
// @name         微博复制url、下载文字+链接
// @namespace    67373tools
// @description  微博复制url（去掉个人信息）
// @version      0.0.3
// @author       旅行
// @match        *://*.weibo.com/*
// @match        *://*.sinaimg.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443599/%E5%BE%AE%E5%8D%9A%E5%A4%8D%E5%88%B6url%E3%80%81%E4%B8%8B%E8%BD%BD%E6%96%87%E5%AD%97%2B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/443599/%E5%BE%AE%E5%8D%9A%E5%A4%8D%E5%88%B6url%E3%80%81%E4%B8%8B%E8%BD%BD%E6%96%87%E5%AD%97%2B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("复制优化链接", () => GM_setClipboard(document.URL.split("?")[0]));
    setTimeout(()=>{
      var author = document.querySelectorAll('[suda-uatrack="key=noload_singlepage&value=user_name"]')[0].innerText
      var contentText = document.querySelectorAll('.WB_text.W_f14')[0].innerText.replace("陈一发儿超话","").replace("陈一发儿超话","").trim()
      var urlContentFilename = contentText.substring(0,40).replace("\n","")+".url"
      var urlContentText = "[" + urlContentFilename + "]\nURL=" + document.URL.split("?")[0]

      GM_registerMenuCommand("下载文字及链接", () => downloadText());
      function downloadText(){
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contentText));
        element.setAttribute('download', author);
        element.click();
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(urlContentText));
        element.setAttribute('download', urlContentFilename);
        element.click();
      }
    },5000)
})();

// element.style.display = 'none';
// document.body.appendChild(element);
// element.click();
// document.body.removeChild(element);
