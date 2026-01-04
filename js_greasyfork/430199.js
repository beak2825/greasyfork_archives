// ==UserScript==
// @name         場外進板圖替換改
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  更換場外進板圖
// @author       G11K, jtdjdu6868
// @match        https://forum.gamer.com.tw/A.php?bsn=60076
// @match        https://forum.gamer.com.tw/
// @icon         https://forum.gamer.com.tw/favicon.ico
// @grant
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430199/%E5%A0%B4%E5%A4%96%E9%80%B2%E6%9D%BF%E5%9C%96%E6%9B%BF%E6%8F%9B%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/430199/%E5%A0%B4%E5%A4%96%E9%80%B2%E6%9D%BF%E5%9C%96%E6%9B%BF%E6%8F%9B%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //input your welcome img url below
    var welcome_img = "https://pixiv.cat/87066621.jpg";


    var change = () =>
    {
        if(!document.head)
        {
            setTimeout(change);
            return;
        }
        var style = document.createElement("style");
        document.head.appendChild(style);
        style.sheet.insertRule(".FM-abox1 img {display: none}", 0);
        style.sheet.insertRule(`.FM-abox1 {background-image: url("${welcome_img}")!important; background-repeat: no-repeat!important; background-size: cover!important}`, 0);
        style.sheet.insertRule("a[href=\"A.php?bsn=60076\"]>img:first-child {display: none}", 0);
    }
    change();
    if(location.href == "https://forum.gamer.com.tw/")
    {
        window.addEventListener("DOMContentLoaded", () =>
        {
            var img = new Image();
            img.src = welcome_img;
            document.querySelector("a[href=\"A.php?bsn=60076\"]").appendChild(img);
        });
    }
})();