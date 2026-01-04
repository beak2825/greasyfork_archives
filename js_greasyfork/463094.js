// ==UserScript==
// @name         自关
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  关注
// @author       tdtt369
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463094/%E8%87%AA%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/463094/%E8%87%AA%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const usersToFollow = [
        'https://twitter.com/NikolayShkilev',
        'https://twitter.com/FlameCryptos'
    ];

    const websitesToOpen = [
        'https://daomaker.com/launchpad-community'
    ];

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            if (document.querySelector(selector)) {
                callback();
                observer.disconnect();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function autoFollow() {
        if (usersToFollow.indexOf(window.location.href) !== -1) {
            waitForElement('div[data-testid="primaryColumn"] div[data-testid="UserCell"]', followUser);
        }
    }

    function followUser() {
        const followButton = document.evaluate(
            '//div[contains(@aria-label, "Follow") and contains(@aria-label, "@") and @role="button"]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (followButton) {
            const buttonText = followButton.textContent.trim();
            if (buttonText === "关注" || buttonText === "跟隨" || buttonText === "Follow") {
                followButton.click();
                usersToFollow.shift();
                if (usersToFollow.length > 0) {
                    const randomWaitTime = Math.floor(Math.random() * 120000);
                    setTimeout(() => {
                        window.location.href = usersToFollow[0];
                    }, randomWaitTime);
                }
            }
        }
    }

    function openWebsitesAndFollow() {
        return new Promise((resolve) => {
            websitesToOpen.forEach((website, index) => {
                window.open(website, '_blank');
                if (index === websitesToOpen.length - 1) {
                    resolve();
                }
            });
        });
    }

    function createStartButton() {
        const startButton = document.createElement('button');
        startButton.textContent = '开始自动关注';
        startButton.style.position = 'fixed';
        startButton.style.top = '10px';
        startButton.style.right = '10px';
        startButton.style.zIndex = 9999;
        startButton.style.padding = '10px 20px';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.backgroundColor = '#1da1f2';
        startButton.style.color = 'white';
        startButton.style.cursor = 'pointer';
        startButton.style.fontWeight = 'bold';
        startButton.style.fontSize = '14px';
        startButton.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)';
        startButton.onmouseover = () => {
            startButton.style.backgroundColor = '#0c7abf';
        };
        startButton.onmouseout = () => {
            startButton.style.backgroundColor = '#1da1f2';
        };
        startButton.onclick = async () => {
            if (usersToFollow.length > 0) {
                await openWebsitesAndFollow();
                window.location.href = usersToFollow[0];
            }
        };
        document.body.appendChild(startButton);
    }

    createStartButton();

    window.onload = function() {
        autoFollow();
    };

})();
