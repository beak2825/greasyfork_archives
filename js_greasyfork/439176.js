// ==UserScript==
// @name         Wyze Web View Remove Event Shade
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes the shade on events that is shown until hover.
// @author       james.pike@agilecollab.ca
// @license      MIT
// @match        https://view.wyze.com/*
// @icon         https://wyze.com/media/favicon/stores/1/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439176/Wyze%20Web%20View%20Remove%20Event%20Shade.user.js
// @updateURL https://update.greasyfork.org/scripts/439176/Wyze%20Web%20View%20Remove%20Event%20Shade.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // class may change... possibly we should find this elelment dynamically in the future
    // current class: c-iCWXfF
    const css_class_name = ".c-iCWXfF";
    const style = document.createElement("style");

    style.textContent = `${css_class_name}::before { background: rgba(0, 0, 0, 0.0); }`;
    document.head.appendChild(style);

})();