// ==UserScript==
// @name         Twitter in Comic Sans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Twitter use Comic Sans!
// @license      Unlicense
// @author       hazysu
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440273/Twitter%20in%20Comic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/440273/Twitter%20in%20Comic%20Sans.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElem = document.createElement('style')
    styleElem.innerHTML = `
    @import url('https://hazy.su/comicsans/stylesheet.css');
    * {
        font-family: 'Comic Sans MS', sans-serif !important;
    }`
    document.body.appendChild(styleElem)
})();