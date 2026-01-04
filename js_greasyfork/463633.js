// ==UserScript==
// @name         Markdown editor
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2
// @description  Add toolbar to reply area
// @author       Milan
// @match        https://lue.websight.blue/thread/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     css https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css
// @require      https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js
// @downloadURL https://update.greasyfork.org/scripts/463633/Markdown%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/463633/Markdown%20editor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("css"));
    const mde = new SimpleMDE({ element: document.getElementById("reply-content") });
})();