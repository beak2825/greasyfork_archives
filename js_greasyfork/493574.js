// ==UserScript==
// @name         XBIZ Awards Voting Automation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automate voting on XBIZ Awards pages.
// @author       Strad
// @match        https://xma.show/voting/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493574/XBIZ%20Awards%20Voting%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/493574/XBIZ%20Awards%20Voting%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleVotingPage() {
        if (window.location.href.includes("XMA25-12.php")) {
            setTimeout(() => {
                const radioInput = document.querySelector('#\\@ShiriAllwoodXXX');
                if (radioInput) {
                    radioInput.click();
                }
                const submitBtn = document.getElementById('vote-form');
                if (submitBtn) {
                    submitBtn.submit();
                }
            }, 2000);
        }
    }

    function handleSuccessPage() {
        if (window.location.href.includes("success.php")) {
            setTimeout(() => {
                window.location.href = "https://xma.show/voting/XMA25-12.php";
            }, 2000); 
        }
    }

    handleVotingPage();
    handleSuccessPage();
})();
