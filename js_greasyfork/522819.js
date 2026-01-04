// ==UserScript==
// @name         vidhub去广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  vidhub去广告,需要在加载页面手动刷新
// @author       M&W
// @match        https://vidhub*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @include      *//vidhub*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522819/vidhub%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/522819/vidhub%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
    console.log("开始运行脚本！")
        for (var i = 0; i < 3; i++){
      setTimeout(function(){
         if (document.querySelector("divz")) {
            console.log("删除首页广告")
            document.querySelector("divz").remove();
         }
        if (document.querySelector("div[id$=right]")) {
            console.log("删除右边广告")
            document.querySelector("div[id$=right]").remove();
        }
        if (document.querySelector("div[id$=left]")) {
            console.log("删除左边广告")
            document.querySelector("div[id$=left]").remove();
        }
      },100);
    }
     console.log("定时器设置完毕！")
    // Your code here...
};