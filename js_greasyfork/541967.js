// ==UserScript==
// @name         Clipboard Manager
// @namespace    https://**/*
// @version      2025-07-07
// @description  Quick copy
// @author       You
// @match        https://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541967/Clipboard%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/541967/Clipboard%20Manager.meta.js
// ==/UserScript==

// Usage Notes

// Windows/Linux
// Alt+L, Ctrl-C copies LinkedIn to clipboard
// Alt+M, Ctrl-C copies email to clipboard

// Mac?
// Meta+L, Cmd-C copies LinkedIn to clipboard
// Meta+M, Cmd-C copies email to clipboard

(function() {
    'use strict';

    function checkType(e) {
        if (e.key === "l") {
            console.log("send LinkedIn to clipboard")
            document.addEventListener("copy", linkedinClippy, { once: true })
        } else if (e.key === "m") {
            console.log("send email to clipboard")
            document.addEventListener("copy", emailClippy, { once: true })
        }
    }

    function checkAltUp(e) {
        if (e.key === "Alt" || e.key === "Meta") { // Check Alt/Meta up
            document.removeEventListener("keydown", checkType);
        }
    }

    function listenAltMeta(e) {
        if (e.key === "Alt" || e.key === "Meta") {
            // add event listener for email/LinkedIn
            document.addEventListener("keydown", checkType);
        }
    }

    function linkedinClippy(e) {
        e.clipboardData.setData('text/plain', "https://www.linkedin.com/in/yourprofile/");
        e.preventDefault();
    }

    function emailClippy(e) {
        e.clipboardData.setData('text/plain', "youremail@gmail.com");
        e.preventDefault();
    }

    document.addEventListener("keydown", listenAltMeta);
    document.addEventListener("keyup", checkAltUp);

})();