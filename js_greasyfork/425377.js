// ==UserScript==
// @name         简书美化&&去广告
// @namespace    http://tampermonkey.net/
// @version      5.2.3
// @description  小庄的脚本园
// @author       zjazn
// @match        *://*.jianshu.com/p/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @run-at       document-start
// @match        <$URL$>
// @downloadURL https://update.greasyfork.org/scripts/425377/%E7%AE%80%E4%B9%A6%E7%BE%8E%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/425377/%E7%AE%80%E4%B9%A6%E7%BE%8E%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    var i=0;
    var timeout = setInterval(function() {

         //console.log("查找");
        if(document.getElementsByClassName("_gp-ck")[0]) {
            document.getElementsByClassName("_gp-ck")[0].style="display:block;width:100%;padding:0px 80px;margin:10px auto;background:#ffffff;position:absolute;left:0px;top:56px; right:0px;z-index:1000;opacity:1"
            console.log("99")
        }else {
            //console.log("关闭");
            clearInterval(timeout);
        }
        i++
        if(i>20) {
           clearInterval(timeout);
        }

    },20)



})();