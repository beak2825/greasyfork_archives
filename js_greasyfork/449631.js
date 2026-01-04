// ==UserScript==
// @name         HNGBWLXY
// @namespace    https://greasyfork.org/zh-CN/scripts/449631
// @version      0.2
// @description  Auto Click Confirmation
// @author       CWG
// @match        *://www.hngbwlxy.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hngbwlxy.gov.cn
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/449631/HNGBWLXY.user.js
// @updateURL https://update.greasyfork.org/scripts/449631/HNGBWLXY.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    console.log('AutoClick');
    function foo() {
        var elm = document.querySelector('#msBox > div.msBtn > span');
        var rep = document.querySelector('#myplayer_display_button_replay');
        if(rep) {
            console.log('Play end');
            alert('Play end');
        }
        if(elm) {
    // 实际执行代码
            elm.click();
            console.log('OK');
            window.setTimeout(foo, 10000);
//            alert('OK');
        }else{
            console.log('NO');
            window.setTimeout(foo, 10000);
//            alert('NO');
             // 10000ms 后重新调用 foo （准确地说是将 foo 加入任务队列）
        }
    }
    window.setTimeout(foo, 10000);
})();