// ==UserScript==
// @name         BigGo 自動點擊下次一定
// @namespace    https://greasyfork.org/scripts/445446
// @version      1.0
// @description  我不想裝插件
// @author       fmnijk
// @match        https://biggo.com.tw/r/transfer_extension_3.php?*
// @icon         https://www.google.com/s2/favicons?domain=biggo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445446/BigGo%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E4%B8%8B%E6%AC%A1%E4%B8%80%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/445446/BigGo%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E4%B8%8B%E6%AC%A1%E4%B8%80%E5%AE%9A.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';
    var stop1 = -100;
    function keeptrying1() {
        if(document.querySelector("a.btn_exit") == null){
            stop1 += 1;
            if(stop1 < 0){
                setTimeout(( () => keeptrying1() ), 20);
            }
        }else{
            document.querySelector("a.btn_exit").click();
        }
    }
    setTimeout(( () => keeptrying1() ), 0);
})();

