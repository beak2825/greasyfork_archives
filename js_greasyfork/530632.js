// ==UserScript==
// @name         Automatic Login for ÕIS
// @namespace    http://tampermonkey.net/
// @version      2025-03-01
// @description  EST: Skript, mis automaatselt logib kasutaja ÕIS-i. ENG: Userscript, which automatically signs the user into their account.
// @author       Lauri Velner
// @match        https://ois2.ut.ee/*
// @match        https://auth.ut.ee/*
// @match        https://moodle.ut.ee/*
// @match        https://login.microsoftonline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530632/Automatic%20Login%20for%20%C3%95IS.user.js
// @updateURL https://update.greasyfork.org/scripts/530632/Automatic%20Login%20for%20%C3%95IS.meta.js
// ==/UserScript==


// To do: comments + make english logic more robust + make action dependant on current website
// Add saving passwords
// Mention in the readme that people will still have to do the auth thing with the app every 180 days
// Make a clear case why this is a good userscript (being constantly logged off is annoying and frustrating, plus a hinderance to academic productivity as every annoyance like this is)
// Make an extension
// Test for other browsers: chrome, safari, opera, edge, internet explorer
// Possibly make compatible for older versions/browsers
// Possibly add recommendation to update browser if too old

// MutationObservers are optimized for monitoring changes to the DOM. They’re generally lightweight if you scope them to a limited subtree or specific mutations

/*
Look for ways to handle this error:
Content-Security-Policy: (Report-Only policy) The page’s settings would block an inline script (script-src-elem) from being executed because it violates the following directive: “script-src 'self'
'nonce-wyThVuLUmU-bbR3NQmtybg' 'unsafe-inline' 'unsafe-eval' https://*.msauth.net https://*.msftauth.net https://*.msftauthimages.net https://*.msauthimages.net https://*.msidentity.com
https://*.microsoftonline-p.com https://*.microsoftazuread-sso.com https://*.azureedge.net https://*.outlook.com https://*.office.com https://*.office365.com https://*.microsoft.com https://*.bing.com 'report-sample'”

*/
(function() {
    'use strict';

    window.addEventListener('load', () => {
        // ÕIS auth page (https://auth.ut.ee/) accessed after clicking login
        const elementOISAuth = document.querySelector('[data-authsource-name="ut-azure"]');
        if (elementOISAuth != null) {
            elementOISAuth.click();
        }

        // Moodle login
        const elementMoodle = document.querySelector(".mb-0");
        if (elementMoodle != null) {
            elementMoodle.click();
        }
    });

    // ÕIS frontpage; remain logged in
    function addRecursiveListener() {
        window.addEventListener('load', () => {
            waitForElm('.mdc-button__label', "Jätka").then((elm) => {
                elm.click();
                addRecursiveListener();
            });
        });
    }
    addRecursiveListener();

    window.addEventListener('load', () => {
        waitForElm('.mdc-button__label', "Logi sisse").then((elm) => {
            elm.click();
        });
    });

    function waitForClickable(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const check = () => {
                const el = document.querySelector(selector);
                // Check if element exists, is visible, and not disabled
                if (el && el.offsetParent !== null && !el.disabled) {
                    resolve(el);
                } else {
                    elapsed += interval;
                    if (elapsed >= timeout) {
                        reject(new Error("Element not clickable after timeout"));
                    } else {
                        setTimeout(check, interval);
                    }
                }
            };
            check();
        });
    }

    var xpath = "//span[contains(text(),'Logi sisse')]";
    function waitForElm(selector, textSelector) {
        return new Promise(resolve => {
            if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                return resolve(document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
            }

            const observer = new MutationObserver(mutations => {
                if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                    observer.disconnect();
                    resolve(document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function waitForElmBasic(selector) {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) {
                return resolve(el);
            }
            const observer = new MutationObserver(mutations => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    window.addEventListener('load', () => {
        const element = '[data-bind="text: ((session.isSignedIn || session.isSamsungSso) && session.unsafe_fullName) || session.unsafe_displayName"]'; // select account button
        waitForElmBasic(element).then((elm) => {
            elm.click();

            waitForClickable('#idSIButton9') // login button
                .then(el => {
                el.click();
            })
                .catch(err => console.error(err));
        });
    });

})();