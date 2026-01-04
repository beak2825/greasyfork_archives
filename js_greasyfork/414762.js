// ==UserScript==
// @name         Twitch Points Claimer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Claims twitch bonus points automatically
// @author       willems
// @match        https://www.twitch.tv/*
// @match        https://dashboard.twitch.tv/*
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/414762/Twitch%20Points%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/414762/Twitch%20Points%20Claimer.meta.js
// ==/UserScript==

var checkInterval = 0;

function intervalInit() {
    claimPoints();
    checkInterval = setInterval(function() {
        var targetNode = document.querySelector('.community-points-summary');
        if (targetNode) { clearInterval(checkInterval); initMO(targetNode) }
    }, 1000);
}


function initMO(targetNode) {
    console.log('[AutoPointsClicker] Page loaded!');
    var observer = new MutationObserver(claimPoints);

    observer.observe(targetNode, { childList: true, subtree: true });
}

function claimPoints() {
    var buttonExist = document.querySelector('.claimable-bonus__icon');
    if (buttonExist) {
        setTimeout(function() {
            buttonExist.click();
            console.log('[AutoPointsClicker] Claimed bonus points.')
        }, Math.random() * 1000 + 2000);
    }
}

window.addEventListener('urlchange', function() { clearInterval(checkInterval); intervalInit() });
intervalInit();