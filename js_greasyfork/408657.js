// ==UserScript==
// @name         ScrubTV cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       joeyism
// @match        https://reboot.tube/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408657/ScrubTV%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/408657/ScrubTV%20cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const remove = (elem) => {
        elem.parentNode.removeChild(elem);
    };
    const removeChat = () => {
        remove(document.getElementById("chatwrap"));
        document.getElementById("videowrap").className = "";
    };
    document.onreadystatechange = function(e)
    {
        if (document.readyState === 'complete')
        {
            removeChat()
        }
    };
})();