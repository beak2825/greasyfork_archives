// ==UserScript==
// @name         PS Store Subscription Links Locale Fix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This script fixes the issue that the PS Plus and EA Play links on the PS Store subscriptions page do not have a locale set.
// @author       Nathaniel Wu
// @include      *store.playstation.com/*
// @license      Apache-2.0
// @supportURL   https://gist.github.com/Nathaniel-Wu/2ff7fe939acca362d7fdeaf17b4f0d18
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469097/PS%20Store%20Subscription%20Links%20Locale%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/469097/PS%20Store%20Subscription%20Links%20Locale%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const in_iframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    if (!in_iframe()) {
        const onSubscriptionPage = () => {
            return /^https?:\/\/store\.playstation\.com\/[^\/]+\/pages\/subscriptions($|\/)/g.test(window.location.href) || /^https?:\/\/store\.playstation\.com\/[^\/]*\/view\/[^\/]+\/[^\/]+\/?$/.test(window.location.href);
        };
        const fixSubscriptionLinks = () => {
            const locale = window.location.href.replace(/^https?:\/\/store\.playstation\.com\/([^\/]+)\/(.+)?$/g, '$1');
            document.querySelectorAll('.psw-solid-link.psw-button.psw-primary-button.psw-solid-button').forEach(e => {
                if (/(\/|\.)playstation\.com\/ps-plus($|\/)/g.test(e.href)) {
                    // Fix the PS Plus link
                    e.href = e.href.replace(/((\/|\.)playstation\.com\/)ps-plus/g, `$1${locale}/ps-plus`);
                } else if (/(\/|\.)playstation\.com\/eaplay($|\/)/g.test(e.href)) {
                    // Fix the EA Play link
                    e.href = e.href.replace(/((\/|\.)playstation\.com\/)eaplay/g, `$1${locale}/games/ea-play`);
                } else if (/(\/|\.)playstation\.com\/games\/ubisoft-plus-classics($|\/)/g.test(e.href)) {
                    // Fix the Ubisoft Plus Classics link
                    e.href = e.href.replace(/((\/|\.)playstation\.com\/)games\/ubisoft-plus-classics/g, `$1${locale}/games/ubisoft-plus-classics`);
                }
            });
        };
        if (onSubscriptionPage())
            fixSubscriptionLinks()
        let activeTransitions = 0;
        document.addEventListener('transitionend', (e) => {
            activeTransitions++;
            setTimeout(() => {
                activeTransitions--;
                if (activeTransitions == 0 && onSubscriptionPage())
                    fixSubscriptionLinks();
            }, 200);
        });
    }
})();