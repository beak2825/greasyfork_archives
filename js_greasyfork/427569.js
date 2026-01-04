// ==UserScript==
// @name         希悦通知esc自动关闭
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在希悦页面打开通知或任务时，按键盘上的Esc即可关闭该通知或任务
// @author       Pikaqian
// @match        https://chalk-c3.seiue.com/*
// @icon         https://chalk-c3.seiue.com/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427569/%E5%B8%8C%E6%82%A6%E9%80%9A%E7%9F%A5esc%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/427569/%E5%B8%8C%E6%82%A6%E9%80%9A%E7%9F%A5esc%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(event){
        if(event.keyCode==27){
            var button=document.getElementsByTagName("button")
            for(var i=0;i<button.length;i++){
                var result=button[i].outerHTML.match("close-modal")
                if(result!=null){
                    break
                }
            }
            button[i].click()
        }
    }
})();