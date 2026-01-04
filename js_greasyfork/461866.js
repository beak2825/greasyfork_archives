// ==UserScript==
// @name        测试键
// @namespace    http://tampermonkey.net/
// @version      1.4
// @match        *://*/*
// @description  try to take over the world!
// @author       You
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461866/%E6%B5%8B%E8%AF%95%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/461866/%E6%B5%8B%E8%AF%95%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("keydown",keydown);
//键盘监听，注意：在非ie浏览器和非ie内核的浏览器
//参数1：表示事件，keydown:键盘向下按；参数2：表示要触发的事件
function keydown(event){
    //表示键盘监听所触发的事件，同时传递参数event
        if(event.keyCode==13){
            document.getElementsByClassName("art-control-fullscreen")[0].click()
        }

}

    // Your code here...
})();