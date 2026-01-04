// ==UserScript==
// @name         gying去广告
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  gying去广告,需要在加载页面手动刷新
// @author       M&W
// @match        https://www.btnull.org/*
// @match        https://www.gying.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @include      *//www.gying.*
// @include      *//www.btnull.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451493/gying%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/451493/gying%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
    console.log("开始运行脚本！")
    for (var i = 0; i < 3; i++){
      setTimeout(function(){
         document.querySelectorAll("div[id$=right]").forEach(item=>{
             if(item.id != 'play_right'){
                 item.remove();
             }
         })
        if (document.querySelector("div[id$=left]")) {
            console.log("删除左边广告")
            document.querySelector("div[id$=left]").remove();
        }
      },100);
    }
     console.log("定时器设置完毕！")
    // Your code here...
};