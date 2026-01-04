// ==UserScript==
// @name           Cookies to Biscuits
// @namespace      http://www.tampermonkey.net/
// @description    Changes all "cookie" to "biscuit"
// @version        0.2.2
// @author         Tigran
// @match          https://www.gov.uk/*
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/439818/Cookies%20to%20Biscuits.user.js
// @updateURL https://update.greasyfork.org/scripts/439818/Cookies%20to%20Biscuits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("=> Backing up links...");

    const links = document.getElementsByTagName('a');
    let link_clones = [];
    for (let i = 0; i < links.length; i++) {
        link_clones.push(links[i].cloneNode(true));
    }

    console.log("==> OK");


    console.log("=> Replacing cookies with biscuits...");

    document.body.innerHTML = document.body.innerHTML.replace(/cookie/g, "biscuit");
    document.body.innerHTML = document.body.innerHTML.replace(/Cookie/g, "Biscuit");
    document.body.innerHTML = document.body.innerHTML.replace(/COOKIE/g, "BISCUIT");

    console.log("==> OK");


    console.log("=> Restoring link hrefs...");

    for (let i = 0; i < links.length; i++) {
        links[i].href = link_clones[i].href;
    }

    console.log("==> OK");


    console.log("=> Replacing title...");
    
    document.title = document.title.replace(/cookie/g, "biscuit");
    document.title = document.title.replace(/Cookie/g, "Biscuit");
    document.title = document.title.replace(/COOKIE/g, "BISCUIT");
    
    console.log("==> OK");
})();