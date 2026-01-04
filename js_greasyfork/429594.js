// ==UserScript==
// @name         Copy As
// @namespace    https://tagly.cn/
// @version      0.2
// @description  Copy the page url as Org Mode or Markdown style
// @author       Harry Gao
// @match        */*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/429594/Copy%20As.user.js
// @updateURL https://update.greasyfork.org/scripts/429594/Copy%20As.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let title = document.title
    let url = window.location.href
    let orgModeStr = `[[${url}][${title}]]`
    let markdownModeStr = `[${title}](${url})`
    GM_registerMenuCommand("Org Mode", function () {
        GM_setClipboard(orgModeStr, 'text')
    }, "o")
    GM_registerMenuCommand("Markdown", function () {
        GM_setClipboard(markdownModeStr, 'text')
    }, "m")
})();