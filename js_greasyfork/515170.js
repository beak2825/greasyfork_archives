// ==UserScript==
// @name         Haluwean Theme
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Returns the best theme eveer
// @author       Bebr0Nuh
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515170/Haluwean%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/515170/Haluwean%20Theme.meta.js
// ==/UserScript==

document.querySelectorAll("head > link[href*='css.php?']").forEach((el) => {
    let url = el.href;
    let [path, query] = url.split("?");
    query = new URLSearchParams(query);
    query.set("style", "39");
    el.href = `${path}?${query}`;
});
