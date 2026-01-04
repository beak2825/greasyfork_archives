// ==UserScript==
// @name         Download Pack
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  try to take over the world!
// @author       You
// @match        https://lcrm.xyz/packs/*
// @exclude      https://lcrm.xyz/packs/*/edit

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373594/Download%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/373594/Download%20Pack.meta.js
// ==/UserScript==

(function() {
   function getButtonUrl() {
        let url = window.location.href;
        let parsUrl = url.split('/');
        parsUrl.splice(4, 0, "download");
        let urlToButton = parsUrl.join('/');
        return urlToButton;
    };

    var parentBlock = document.querySelectorAll('.row')[1];
    var newA = document.createElement('a');
    newA.innerHTML = 'Download';
    newA.classList.add("btn", "btn-success", "m-2");
    newA.href = getButtonUrl();
    parentBlock.appendChild(newA);
})();