// ==UserScript==
// @name         Modify Footer Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the specified footer element on the page.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471005/Modify%20Footer%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/471005/Modify%20Footer%20Element.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the footer element
    function modifyFooter() {
        var footerDiv = document.getElementById("footer");
        if (footerDiv) {
            footerDiv.innerHTML = `
                <div class="ctr-p" data-jiis="bp" id="footer">
                    <div id="footcnt">
                        <style>
                            /* Add the CSS styles for the new footer content here */
                            /* ... */
                        </style>
                        <div class="_dQc _E2" id="fbar">
                            <div class="fbar">
                                <span id="fsr">
                                    <a class="_Gs" href="//www.google.com/intl/en/policies/privacy/?fg=1">Privacy</a>
                                    <a class="_Gs" href="//www.google.com/intl/en/policies/terms/?fg=1">Terms</a>
                                    <span style="display:inline-block;position:relative">
                                        <a class="_Gs" href="https://www.google.com/preferences?hl=en" id="fsettl" aria-controls="fsett" aria-expanded="false" role="button" jsaction="foot.cst">Settings</a>
                                        <span id="fsett" style="display:none">
                                            <a href="https://www.google.com/preferences?hl=en&amp;fg=1">Search settings</a>
                                            <span data-jibp="h" data-jiis="uc" id="advsl">
                                                <a href="/advanced_search?hl=en&amp;fg=1">Advanced search</a>
                                            </span>
                                            <a href="/history/optout?hl=en&amp;fg=1">  History </a>
                                            <a href="//support.google.com/websearch/?p=ws_results_help&amp;hl=en&amp;fg=1">Search Help</a>
                                            <a href="javascript:void(0)" data-bucket="websearch" id="_Yvd" target="_blank" jsaction="gf.sf" data-ved="0CAoQLmoVChMIrpSVkfrPxwIVgnU-Ch02ig9E">  Send feedback </a>
                                        </span>
                                    </span>
                                </span>
                                <span id="fsl">
                                    <a class="_Gs" href="//www.google.com/intl/en/ads/?fg=1">Advertising</a>
                                    <a class="_Gs" href="//www.google.com/services/?fg=1">Business</a>
                                    <a class="_Gs" href="//www.google.com/intl/en/about.html?fg=1">About</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Run the function once the DOM is ready
    document.addEventListener("DOMContentLoaded", modifyFooter);
})();
