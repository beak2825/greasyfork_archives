// ==UserScript==
// @name         Twitter Sensitive Content Viewer
// @namespace    omfgmule@gmail.com
// @version      1.1.1.5
// @description  Simple script to automatically click "Show" on tweets hidden behind the sensitive content warning on Twitter.
// @author       omfgmule
// @match        *://twitter.com/*

// @downloadURL https://update.greasyfork.org/scripts/491990/Twitter%20Sensitive%20Content%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/491990/Twitter%20Sensitive%20Content%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If this script is helpful to you please consider simply retweeting so more people can use it!
    // https://x.com/omfgmule/status/1777623521427894569

    //Supported languages, if you need languages added feel free to contact me at @omfgmule on twitter or post a comment on the greasefork page
    const supportedLanguages = {
        EN: "Show",
        JP: "表示",
        ES: "Mostrar",
		CNS: "显示",
        CNT: "顯示",
        PL: "Pokaż",
        DE: "Anzeigen",
        TH: "แสดง"
    };

    const supportedRemoveButtonLanguages = {
        EN: "Hide",
        JP: "非表示にする",
        ES: "Ocultar",
		CNS: "隐藏",
        CNT: "隱藏",
        PL: "Ukryj",
        DE: "Ausblenden",
        TH: "ซ่อน"
    };

    window.addEventListener('load', function() {
        const revealSensitiveContent = () => {
            const currentUrl = window.location.href;
            if (!currentUrl.includes('/settings/')) {
                document.querySelectorAll('span.css-1qaijid.r-bcqeeo.r-qvutc0').forEach(span => {
                    const foundSupportedLanguage = Object.values(supportedLanguages).includes(span.textContent);
                    if (foundSupportedLanguage) {
                        let clickedAlready = false;
                        let target = span.parentNode;
                        if (target && target.click && !clickedAlready) {
                            target.click();
                            clickedAlready = true;
                        }
                        target = span.parentNode.parentNode
                            if (target && target.click && !clickedAlready) {
                                target.click();
                            }
                    }

                });
            }
        };

        const removeHideButton = () => {
            const currentUrl = window.location.href;
            if (!currentUrl.includes('/settings/')) {
                document.querySelectorAll('span.css-1qaijid.r-bcqeeo.r-qvutc0').forEach(span => {
                    let foundSupportedRemoveButtonLanguage = Object.values(supportedRemoveButtonLanguages).includes(span.textContent);
                    if (foundSupportedRemoveButtonLanguage) {
                        let thirdParentNode = span.parentNode.parentNode.parentNode;
                        if (thirdParentNode.className.includes('css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr')) {
                            thirdParentNode.remove();
                        }
                    }

                });
            }
        };

        revealSensitiveContent();
        removeHideButton();
        setInterval(revealSensitiveContent, 100);
        setInterval(removeHideButton, 100);
    });
})();