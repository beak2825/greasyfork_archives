// ==UserScript==
// @name        Lazyfoo Highlight Code
// @namespace   codesthings.com
// @match       *://*.lazyfoo.net/tutorials/*
// @version     1.5
// @license MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/languages/cpp.min.js
// @resource    THEME_DEFAULT https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css
// @resource    THEME_DARK https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/a11y-dark.min.css
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @description Add code highlight to LazyFoo's code snippets in the tutorials section, updated to HLJS 11.6, no jQuery, switchable theme.
// @downloadURL https://update.greasyfork.org/scripts/448215/Lazyfoo%20Highlight%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/448215/Lazyfoo%20Highlight%20Code.meta.js
// ==/UserScript==


// Highlight JS
var hljs = hljs || null;

(function() {
    'use strict';
    const blocks = document.querySelectorAll('div.tutCode');

    if (blocks.length) {
        if (typeof GM_getResourceText === 'function') {
            // Change THEME_DARK to THEME_DEFAULT here for light theme.
            const themeCss = GM_getResourceText("THEME_DARK");
            GM_addStyle(themeCss);
        } else {
            document.head.innerHTML += `<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/a11y-dark.min.css' />`;
        }

        blocks.forEach((block) => {
            block.innerHTML = `<pre><code class="cpp">${block.innerHTML}</code></pre>`;
        });

        if (hljs && typeof hljs.highlightAll === 'function') {
            hljs.highlightAll();
        }
    }
})();
