// ==UserScript==
// @name         github-dark-optimization
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  仅在 Github / appearance 设定为Daek default 时生效
// @author       You
// @license MIT
// @match        https://github.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475441/github-dark-optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/475441/github-dark-optimization.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.innerText = `
    [data-color-mode=light][data-light-theme=dark], [data-color-mode=dark][data-dark-theme=dark]{
        --color-canvas-default:#010409;
        --color-canvas-overlay:#010409;
        --color-neutral-muted:#09040187;
    }
`
    document.body.appendChild(style)
    // Your code here...
})();