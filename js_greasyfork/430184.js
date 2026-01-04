// ==UserScript==
// @name         場外進板圖替換
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  更換場外進板圖
// @author       G11K
// @match        https://forum.gamer.com.tw/A.php?bsn=60076
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430184/%E5%A0%B4%E5%A4%96%E9%80%B2%E6%9D%BF%E5%9C%96%E6%9B%BF%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/430184/%E5%A0%B4%E5%A4%96%E9%80%B2%E6%9D%BF%E5%9C%96%E6%9B%BF%E6%8F%9B.meta.js
// ==/UserScript==
(function EnterImgChange() {
    'use strict';
    var EnterImg = "";

    var fmbox = document.getElementsByClassName("FM-abox1");

    fmbox[0].getElementsByTagName("img")[0].src = EnterImg;
})();