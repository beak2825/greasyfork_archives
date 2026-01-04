// ==UserScript==
// @name Disable Reddit Wiki edit until fully loaded
// @description Disables the "Edit" button when editing a wiki page on Reddit, until the page is fully loaded
// @author qsniyg
// @version 0.0.1
// @namespace Violentmonkey Scripts
// @match https://*.reddit.com/r/*/wiki/edit/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/380893/Disable%20Reddit%20Wiki%20edit%20until%20fully%20loaded.user.js
// @updateURL https://update.greasyfork.org/scripts/380893/Disable%20Reddit%20Wiki%20edit%20until%20fully%20loaded.meta.js
// ==/UserScript==

(function() {
    function finalize() {
        var editbtn = document.getElementById("wiki_save_button");
        editbtn.disabled = false;
        editbtn.value += " | OK";
    }
    
    if (document.readyState !== "complete") {
        var interval = setInterval(function() {
            var editbtn = document.getElementById("wiki_save_button");
            if (editbtn) {
                clearInterval(interval);
                interval = null;
                editbtn.disabled = true;
            }
        }, 10);
        document.onreadystatechange = function() {
            if (document.readyState === "complete") {
                if (interval)
                    clearInterval(interval);
                finalize();
            }
        };
    } else {
        finalize();
    }
})();