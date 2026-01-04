// ==UserScript==
// @name         decency
// @namespace    http://tampermonkey.net/
// @version      2024-09-13
// @description  comment decency
// @author       You
// @match        https://saidit.net/s/all/comments*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=saidit.net
// @grant        none
// @license      AGPL 3.1
// @downloadURL https://update.greasyfork.org/scripts/506661/decency.user.js
// @updateURL https://update.greasyfork.org/scripts/506661/decency.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.entries(document.querySelectorAll(".usertext-body")).reduce(function(res, item) {
        console.log(item);
        let text = item[1].childNodes[0].childNodes[0].innerText.toLowerCase();
        if (text.indexOf("dick") >= 0) {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if(text.indexOf("nigger") >= 0) {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if(text.indexOf("cunt") >= 0) {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "YoMamma") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "Oyveygoyim") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "TheBlackSun") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText.indexOf("kys") >= 0) {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "GuyWhite") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "TotalAnon1337") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "WoodyWoodPecker") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "NastyWetSmear") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if (item[1].parentNode.parentNode.querySelector(".author").innerText == "LarrySwinger2") {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if(text.indexOf(" ") < 0) {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        } else if(text.indexOf("sexy") >= 0) {
            item[1].parentNode.parentNode.parentNode.remove();
            return false;
        }


        return true;

    }, true);


})();