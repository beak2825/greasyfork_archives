// ==UserScript==
// @name         紳士漫畫下拉最大寬度50%、去下拉廣告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  [-]紳士漫畫下拉寬度50%、去下拉廣告
// @author       貓咪不作戰
// @match        https://www.wnacg.com/photos-slide*
// @match        https://www.wnacg.com/photos-slidelow*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.com
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467203/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%E4%B8%8B%E6%8B%89%E6%9C%80%E5%A4%A7%E5%AF%AC%E5%BA%A650%25%E3%80%81%E5%8E%BB%E4%B8%8B%E6%8B%89%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/467203/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%E4%B8%8B%E6%8B%89%E6%9C%80%E5%A4%A7%E5%AF%AC%E5%BA%A650%25%E3%80%81%E5%8E%BB%E4%B8%8B%E6%8B%89%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function change(w){
        var a=document.querySelectorAll("div img")
        if(a.length>=2){
            //clearInterval(id);
        }
        for (let i = 0; i < a.length; i++) {
            a[i].style.maxWidth= w+"%"
        }
        var ad=document.querySelectorAll("iframe")
        for (let i = 0; i < ad.length; i++) {
            ad[i].remove()
        }
        document.querySelector("#control_block").remove()
    }
    var id= setInterval(()=>{change(50);},100);

    GM_registerMenuCommand('100%', ()=>{change(100);
    }, 'X');
    GM_registerMenuCommand('75%', ()=>{change(75);
    }, 'C');
    GM_registerMenuCommand('50%', ()=>{change(50);
    }, 'V');
})();