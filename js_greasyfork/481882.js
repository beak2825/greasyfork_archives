

    // ==UserScript==
    // @name         FileDM Bypass
    // @namespace    dagidin
    // @version      1.2
    // @description  Bypass annoying FileDM download managers!
    // @author       dagidin
    // @match        *https://filedm.com/*
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481882/FileDM%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/481882/FileDM%20Bypass.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        if (window.location.hostname === "filedm.com") {
            const downloadButton = document.querySelector('a#dlbutton');
            if (downloadButton) {
                const hrefValue = downloadButton.getAttribute('href');
                if (hrefValue) {
                    const popupWindow = window.open(`https://filedm.com/${hrefValue}`, '_blank');
                    setTimeout(function() {
                        const userInput = prompt("Enter the 5-digit number before the .exe in the file which was just downloaded");
                        if (userInput !== null) {
                            alert("FileDM Bypassed!")
                            window.location.replace(`http://cdn.directfiledl.com/getfile?id=${userInput}`)
                        } else {
                            alert("You cancelled.");
                        }
                    }, 2000);
                } else {
                    alert("Refresh the page.")
                }
            }
        }
    })();

