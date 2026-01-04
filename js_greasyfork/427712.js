// ==UserScript==
// @name         找色差辅助
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  找色差辅助,自动选择颜色不同的方块
// @author       PwnCicada
// @match        *://www.zhaosecha.com/
// @match        *://zhaosecha.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427712/%E6%89%BE%E8%89%B2%E5%B7%AE%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/427712/%E6%89%BE%E8%89%B2%E5%B7%AE%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
     
    var s = 1;// 时间间隔，默认1秒
    // Your code here...
    function doit(){

        var boxs = document.querySelector("#box").getElementsByTagName("span");
        var temp = boxs[0].style.backgroundColor;
        for (var i = boxs.length - 1; i >= 0; i--) {
            if (temp != boxs[i].style.backgroundColor) {
                boxs[i].click();
            }
            boxs[i].click();
        }

    }

     window.setInterval(doit, s * 1000);


})();