// ==UserScript==
// @name         X -> Twitter redirect & misc fixes
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Miscellaneous fixes for the Twitter (formerly X) platform.
// @author       BringBackTwitter
// @match        https://x.com/*
// @match        https://www.x.com/*
// @match        https://*.x.com/*
// @match        https://twitter.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497388/X%20-%3E%20Twitter%20redirect%20%20misc%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/497388/X%20-%3E%20Twitter%20redirect%20%20misc%20fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const profileImageOldBase = "https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_";
    const profileImageNewBase = "https://pbs.twimg.com/profile_images/1683698521600565248/_R1r5HsQ_";
    const bannerImageOldPattern = /https:\/\/pbs\.twimg\.com\/profile_banners\/783214\/1690175171\/\d+x\d+/g;
    const bannerImageNewBase = "https://pbs.twimg.com/profile_banners/1799553309180633090/1717881995/";

    function redirectToTwitter() {
        const currentUrl = window.location.href;
        const isLoginPage = currentUrl.includes('/login');
        const isAboutPage = window.location.hostname === 'about.x.com';
        const isOAuthPage = currentUrl.includes('/oauth');
        const isDeveloperPage = window.location.hostname === 'developer.x.com';
        const isDevCommunityPage = window.location.hostname === 'devcommunity.x.com';

        if (!isLoginPage && !isAboutPage && !isOAuthPage && !isDeveloperPage && !isDevCommunityPage) {
            if (window.location.hostname.endsWith('.x.com') || window.location.hostname === 'x.com' || window.location.hostname === 'www.x.com') {
                let newUrl = currentUrl.replace(/(\.|\/)x\.com/, '$1twitter.com');
                if (!newUrl.includes('?mx=1')) {
                    newUrl += newUrl.includes('?') ? '&mx=1' : '?mx=1';
                }
                window.location.replace(newUrl);
            }
        }
    }

    function replaceXcomInTextNodes(element) {
        if (element.nodeType === Node.TEXT_NODE && element.nodeValue.includes('x.com')) {
            element.nodeValue = element.nodeValue.replace(/(\.|\/)x\.com/g, '$1twitter.com');
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            element.childNodes.forEach(childNode => {
                replaceXcomInTextNodes(childNode);
            });
        }
    }

    function replaceImages() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes(profileImageOldBase)) {
                img.src = img.src.replace(profileImageOldBase, profileImageNewBase);
            }
        });

        document.querySelectorAll('[style*="background-image"]').forEach(element => {
            let bgImage = element.style.backgroundImage;
            if (bgImage.includes(profileImageOldBase)) {
                element.style.backgroundImage = bgImage.replace(profileImageOldBase, profileImageNewBase);
            }
            if (bannerImageOldPattern.test(bgImage)) {
                const resolution = bgImage.match(/\d+x\d+/)[0];
                element.style.backgroundImage = bgImage.replace(bannerImageOldPattern, `${bannerImageNewBase}${resolution}`);
            }
        });

        document.querySelectorAll('img').forEach(img => {
            if (bannerImageOldPattern.test(img.src)) {
                const resolution = img.src.match(/\d+x\d+/)[0];
                img.src = img.src.replace(bannerImageOldPattern, `${bannerImageNewBase}${resolution}`);
            }
        });
    }

    function modifyXProfile() {
        if (window.location.pathname === "/X") {
            console.log("Modifying @X profile page...");

            document.querySelectorAll('a[href="/X"]').forEach(node => {
                if (node.textContent.includes('@X')) {
                    node.textContent = '@Twitter';
                }
            });

            let profileNameElement = document.querySelector('div[data-testid="UserName"] span span');
            if (profileNameElement && profileNameElement.textContent === 'X') {
                profileNameElement.textContent = 'Twitter';
            }

            document.querySelectorAll('span').forEach(node => {
                if (node.childNodes.length === 1 && node.textContent === 'X') {
                    node.textContent = 'Twitter';
                } else if (node.childNodes.length === 1 && node.textContent === '@X') {
                    node.textContent = '@Twitter';
                }
            });
        }
    }

    function modifyTitle() {
        if (document.title.includes("X (@X)")) {
            document.title = document.title.replace("X (@X)", "Twitter (@Twitter)");
        }
    }

    function replaceAllXcom() {
        document.body.childNodes.forEach(node => {
            replaceXcomInTextNodes(node);
        });
    }

    function replaceInTweets() {
        document.querySelectorAll('span').forEach(node => {
            if (node.childNodes.length === 1 && node.textContent === 'X') {
                node.textContent = 'Twitter';
            } else if (node.childNodes.length === 1 && node.textContent === '@X') {
                node.textContent = '@Twitter';
            }
        });
    }

    function modifyFooter() {
        document.querySelectorAll('nav[aria-label="Footer"] span').forEach(node => {
            if (node.textContent.includes("©") && node.textContent.includes("X Corp.")) {
                node.textContent = node.textContent.replace("X Corp.", "Twitter, Inc.");
            }
        });
    }

    redirectToTwitter();

    replaceAllXcom();
    replaceInTweets();
    modifyXProfile();
    replaceImages();
    modifyTitle();
    modifyFooter();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                replaceXcomInTextNodes(node);
                replaceInTweets();
                modifyTitle();
                if (window.location.pathname === "/X") {
                    modifyXProfile();
                }
                replaceImages();
                modifyFooter();
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
