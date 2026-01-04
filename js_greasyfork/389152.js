// ==UserScript==
// @name         CrowdCompute scroll bug fix
// @version      0.5
// @description  Fixes annoying behaviour of CrowdCompute
// @author       You
// @match        https://crowdsource.google.com/*cc/*Answers/*
// @grant        none
// @namespace https://greasyfork.org/users/166154
// @downloadURL https://update.greasyfork.org/scripts/389152/CrowdCompute%20scroll%20bug%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/389152/CrowdCompute%20scroll%20bug%20fix.meta.js
// ==/UserScript==

var elements = document.querySelectorAll(".MpErf");
for (var i=0; i<elements.length; i++) {
elements[i].style.overflow = "unset";
}

function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

addStyleString('.MpErf { overflow: unset !important }');
addStyleString('iframe { min-height: 1000px !important }');
