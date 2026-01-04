// ==UserScript==
// @name         Fix HTTP Issue
// @namespace    https://drwho-online.co.uk
// @version      3
// @description  now with substrings!
// @author       rook
// @match        http://forums.drwho-online.co.uk/*
// @icon         https://www.google.com/s2/favicons?domain=drwho-online.co.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432657/Fix%20HTTP%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/432657/Fix%20HTTP%20Issue.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.substring(0,5) != "https"){
        window.location.href = ("https:"+window.location.href.substring(5,window.location.href.length))
    }
})();