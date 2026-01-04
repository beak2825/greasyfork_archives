// ==UserScript==
// @name         miro.com translate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  enable google translate for miro.com
// @author       CVR
// @match        https://miro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450604/mirocom%20translate.user.js
// @updateURL https://update.greasyfork.org/scripts/450604/mirocom%20translate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("[content='notranslate']").remove();
    document.body.classList.remove("notranslate");
})();