// ==UserScript==
// @name         DDG HTML direct links
// @namespace    https://codeberg.org/kiara/ddg-direct
// @version      0.1
// @description  unwrap links on DuckDuckGo HTML version
// @author       Kiara Grouwstra
// @match        https://html.duckduckgo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      BSD0
// @downloadURL https://update.greasyfork.org/scripts/479400/DDG%20HTML%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/479400/DDG%20HTML%20direct%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(document.getElementsByTagName('a')).forEach((link) => { link.href = Array.from(new URLSearchParams(link.href).values())[0]; })
})();