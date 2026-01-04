// ==UserScript==
// @name         change ldna iframe to integration
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://my.staging.livingdna.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374373/change%20ldna%20iframe%20to%20integration.user.js
// @updateURL https://update.greasyfork.org/scripts/374373/change%20ldna%20iframe%20to%20integration.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function(event) {
        var p = document.createElement("button");
        p.innerText = "swap to integration";
        p.style.position = 'absolute';
        p.style.top = 0;
        p.onclick = () => {document.querySelector('.link-account__frame').src = document.querySelector('.link-account__frame').src.replace('www', 'integration');};
        document.body.appendChild(p);

    });


})();