// ==UserScript==
// @name         Intercept and Copy window.open URLs (DeepSeek)
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  Intercept window.open calls and copy the URL to clipboard on chat.deepseek.
// @match        *://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527424/Intercept%20and%20Copy%20windowopen%20URLs%20%28DeepSeek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527424/Intercept%20and%20Copy%20windowopen%20URLs%20%28DeepSeek%29.meta.js
// ==/UserScript==

window.open = url => (navigator.clipboard.writeText(url), null);
