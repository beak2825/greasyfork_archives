// ==UserScript==
// @name         Azur Lane WIKI hitValue
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可以在wiki上查看舰船命中
// @author       You
// @match        https://wiki.biligame.com/blhx/*
// @icon         https://www.google.com/s2/favicons?domain=biligame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428262/Azur%20Lane%20WIKI%20hitValue.user.js
// @updateURL https://update.greasyfork.org/scripts/428262/Azur%20Lane%20WIKI%20hitValue.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let tableNode = document.getElementById("PNair").parentNode.nextElementSibling

    let hitName = tableNode.children[2]
    hitName.innerHTML = "<b>命中</b>"
    let hitValue = hitName.nextElementSibling
    document.getElementById("PNhit").remove()
    hitValue.setAttribute("id", "PNhit")
})();