// ==UserScript==
// @name         [LOLZ] Rofl
// @namespace    Roft Tyrik
// @version      2024-05-05-3
// @description  Del Rofl Tyrik
// @author       el9in
// @license      el9in
// @match        https://zelenka.guru/*
// @match        https://zelenka.guru
// @match        zelenka.guru
// @match        https://zelenka.market/*
// @match        https://zelenka.market
// @match        zelenka.market
// @match        https://lolz.guru/*
// @match        https://lolz.guru
// @match        lolz.guru
// @match        https://lzt.market/*
// @match        https://lzt.market/
// @match        lzt.market
// @match        https://lolz.market/*
// @match        https://lolz.market/
// @match        lolz.market
// @match        https://lolz.live/*
// @match        https://lolz.live/
// @match        lolz.live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494157/%5BLOLZ%5D%20Rofl.user.js
// @updateURL https://update.greasyfork.org/scripts/494157/%5BLOLZ%5D%20Rofl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const rofl2 = document.querySelector('a[href="/threads/6949117/"]');
    if(rofl2) rofl2.remove();
    const rofl3 = document.querySelector('a[href="/threads/6949117/"]');
    if(rofl3) rofl3.remove();
})();