// ==UserScript==
// @name         Mobile Wikipedia Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Redirect mobile Wikipedia to the desktop version
// @author       aubymori
// @match        *.wikipedia.org/*
// @icon         https://en.wikipedia.org/static/favicon/wikipedia.ico
// @grant        none
// @run-at       document-start
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/520261/Mobile%20Wikipedia%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/520261/Mobile%20Wikipedia%20Redirect.meta.js
// ==/UserScript==

if (window.location.host.includes("m."))
{
    window.location = window.location.protocol + "//" +
        window.location.host.replace('m.', '') + window.location.pathname + window.location.search;
}