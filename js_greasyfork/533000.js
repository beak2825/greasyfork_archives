// ==UserScript==
// @name         ChatGPT Largescreen Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply Large Chat Style in ChatGPT
// @author       SH3LL
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533000/ChatGPT%20Largescreen%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/533000/ChatGPT%20Largescreen%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
.largescreen {
    .flex.text-base {
        max-width: unset;
    }
}
@media (min-width: 1024px) {
    .largescreen .flex.text-base .lg\\:w-\\[calc\\(100\\%-115px\\)\\] {
        width: calc(100% - 72px);
    }
    .largescreen form.w-full {
        max-width: 85%;
        margin: auto;
    }
}
.largescreen img {
    width: 653px;
}
`;

    GM_addStyle(style);

    document.body.classList.add('largescreen');
})();
