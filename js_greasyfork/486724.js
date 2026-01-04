// ==UserScript==
// @name         Knuddels Fake Checker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Checks for fake profile pictures
// @author       Maxhem2
// @match        https://app.knuddels.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=knuddels.de
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486724/Knuddels%20Fake%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/486724/Knuddels%20Fake%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastSrcValue = null;

    function checkForMatches(link, callback) {
        const yandexLink = `https://yandex.com/images/search?rpt=imageview&url=${link}`;
        console.log('SCRIPT: Yandex link:', yandexLink);

        GM_xmlhttpRequest({
            method: 'GET',
            url: yandexLink,
            onload: function (response) {
                const match = response.responseText.includes('No matching images found');
                callback(match);
            }
        });
    }


    function checkUserProfile() {
        const currentSrcValue = document.querySelector('.Knu-FlexCol.position-absolute.insetX-none.bottom-none.bg-transparentDark.content-is-dark')?.parentElement?.parentElement?.querySelector('[src]')?.getAttribute('src');

        if (currentSrcValue !== lastSrcValue) {
            lastSrcValue = currentSrcValue;

            const userIndicator = document.querySelector('[data-user-voting-indicator]');
            if (userIndicator) {
                userIndicator.textContent = 'Searching...';
                userIndicator.style.backgroundColor = 'grey';
                userIndicator.style.color = 'white';
            }

            const yandexLink = `https://yandex.com/images/search?rpt=imageview&url=${currentSrcValue}`;

            let match;
            checkForMatches(currentSrcValue, function(result) {
                match = result;
                if (match) {
                    userIndicator.textContent = 'Real';
                    userIndicator.style.backgroundColor = 'green';
                    userIndicator.setAttribute('data-link', yandexLink);
                } else {
                    userIndicator.textContent = 'Fake';
                    userIndicator.style.backgroundColor = 'red';
                    userIndicator.setAttribute('data-link', yandexLink);
                }
            });
        }
    }

    function handleUrlVotingChange() {
            function checkForElement() {
                const element = document.querySelector('.Knu-Flex.flex-1.overflow-visible.placeItems-center.alignSelf-stretch.position-relative');

                if (element) {

                    const existingElement = document.querySelector('.Knu-FlexCol.flex-1.overflow-visible.position-relative');

                    const userIndicator = document.createElement('div');
                    userIndicator.textContent = 'Searching...';
                    userIndicator.style.backgroundColor = 'grey';
                    userIndicator.style.color = 'white';
                    userIndicator.style.textAlign = 'center';
                    userIndicator.style.borderRadius = '8px';
                    userIndicator.setAttribute('data-user-voting-indicator', 'true');
                    userIndicator.setAttribute('data-link', 'https://example.com');

                    userIndicator.style.cursor = 'pointer';
                    userIndicator.addEventListener('click', function() {
                        const link = userIndicator.getAttribute('data-link');
                        window.open(link, '_blank');
                    });

                    existingElement.parentNode.insertBefore(userIndicator, existingElement.parentNode.firstChild);

                    lastSrcValue = null;
                    checkUserProfile();

                    const observer = new MutationObserver(() => {
                        checkUserProfile();
                    });

                    const observerConfig = {
                        childList: true,
                        subtree: true
                    };

                    observer.observe(element, observerConfig);

                    clearInterval(intervalId);
                }
            }

            const intervalId = setInterval(checkForElement, 1);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                if (window.location.href !== observer.lastHref) {
                    observer.lastHref = window.location.href;
                    if (window.location.href.includes('voting')) {
                        const userIndicator = document.querySelector('[data-user-voting-indicator]');
                        if (!userIndicator) {
                            handleUrlVotingChange();
                        }
                    }
                }
            }
        });
    });

    const observerConfig = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, observerConfig);
})();