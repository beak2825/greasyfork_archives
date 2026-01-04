// ==UserScript==
// @name         Duolingo Pro Beta (Support)
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2024-04-09
// @description  Fixi the Listening only mode from the original extension.
// @author       Zensud
// @match        https://www.duolingo.com/*
// @icon         https://imgs.search.brave.com/V03bRmemSGDlrBy5Iq1IdnhmfODnqNAC0L6F7si5F6w/rs:fit:32:32:1/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvY2NjMzk1YmM5/Y2ZhZTFkYTg3ZTlm/NjNhZjZiYjY3M2Yy/NTZmMmUyNDQwYzkx/MTY2MjJjMWRmYWRi/Mjc4NzQxMy93d3cu/ZHVvbGluZ28uY29t/Lw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503004/Duolingo%20Pro%20Beta%20%28Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503004/Duolingo%20Pro%20Beta%20%28Support%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const listeningPage = "https://www.duolingo.com/practice-hub/listening-practice"; //Listening url
    let buttonClicked = false;

    function navigateTolisteningPage() {
        window.location.href = listeningPage;
    }

    //click Solve all button automaticlly
    function clickButtonOnce() {
        if (!buttonClicked) {
            const button = document.getElementById("solveAllButton");
            if (button) {
                button.click();
                buttonClicked = true;
            }
        }
    }

    // Check if the current page is the practice-hub
    if (window.location.href === "https://www.duolingo.com/practice-hub") { 
        // If on the practice-hub, navigate to the listening page
        navigateTolisteningPage();
    } else if (window.location.href === listeningPage) {
        // If on the listening, click the button
        clickButtonOnce();
    }

    // Continuously check if the current page is the practice-hub or the listening page, and navigate/click button accordingly
    setInterval(function() {
        if (window.location.href === "https://www.duolingo.com/practice-hub") { 
            navigateTolisteningPage();
        } else if (window.location.href === listeningPage) {
            clickButtonOnce();
        }
    }, 5000); // Adjust the interval 
})();