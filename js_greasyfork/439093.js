// ==UserScript==
// @name         Arch Daily old logo
// @namespace    http://*.archdaily.com/*
// @version      0.1.1
// @description  revert arch daily logo to previous one
// @author       brendxng
// @match        https://*.archdaily.com/*
// @icon         https://i.imgur.com/hQZjnOE.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439093/Arch%20Daily%20old%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/439093/Arch%20Daily%20old%20logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

const collection = document.getElementsByTagName("img");

for(var i = 0; i < collection.length; i++)
{
    if(collection[i].src == "https://assets.adsttc.com/doodles/flat/logo-blue-full.svg" || collection[i].src == "https://assets.adsttc.com/doodles/ukraine-support.svg")
    {
        collection[i].src = "https://ptpimg.me/ov6v03.png";
    }
}
})();