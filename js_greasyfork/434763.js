// ==UserScript==
// @name         LibreFanza Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  LibreFanza Enhancer...
// @author       HappyTreeFriends
// @namespace    https://greasyfork.org/users/317047
// @match        http://www.libredmm.com/movies/*
// @icon         https://www.google.com/s2/favicons?domain=libredmm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434763/LibreFanza%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434763/LibreFanza%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const element = document.querySelector('.container h1');
    const title = element.innerText;
    const button = document.createElement("button");
    const reg1 = /\+\+\+ (\[HD\]|)/g;
    const reg2 = /[\<\>\:\"\/\\\|\?\*]/g;
    let finalTitle = title.replace(reg1, "");
    finalTitle = finalTitle.replace(reg2, "");
    button.innerHTML = 'Copy';
    button.onclick = function(){ copyToClipboard(finalTitle.trim() )} ;
    element.prepend(button);
})();

var copyToClipboard = function(secretInfo) {
    const tempInput = document.createElement('INPUT');
    document.body.appendChild(tempInput);
    tempInput.setAttribute('value', secretInfo)
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}