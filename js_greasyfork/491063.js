// ==UserScript==
// @name         Royal Road - Automatically Expand Story Details
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  A script to expand the Tags List and the 'Show More' on the description, for a story page
// @author       You
// @match        https://www.royalroad.com/fiction/*
// @exclude      https://www.royalroad.com/fiction/*/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491063/Royal%20Road%20-%20Automatically%20Expand%20Story%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/491063/Royal%20Road%20-%20Automatically%20Expand%20Story%20Details.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('#showTags').checked = true;
    document.querySelector('#showMore').checked = true;
})();