// ==UserScript==
// @name         GOG Claim Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a convenient link to the Privacy & Subscriptions webpage directly from the Claim banner
// @author       You
// @match        https://www.gog.com/en
// @match        https://www.gog.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469019/GOG%20Claim%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/469019/GOG%20Claim%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. if button with class giveaway-banner__button is found, add a second button to
    // https://www.gog.com/en/account/settings/subscriptions
    //
    let giveawayButton = document.getElementsByClassName("giveaway-banner__button");
    if (giveawayButton.length > 0) {
        // document.getElementsByClassName("giveaway-banner__footer")[0];
        let element = document.createElement("button");
        element.id = "SettingsSubscriptionsButtonLink";
        element.style = "border: 1px solid transparent; border-radius: 3px; box-shadow: var(--theme-button-shadow); min-height: 46px; color: var(--theme-button-primary-text); background: var(--theme-button-primary) padding-box,var(--theme-button-primary-border);border-top-color: var(--theme-button-primary-border-top);border-bottom-color: var(--theme-button-primary-border-bottom);flex-shrink: 0;position: relative;padding: 16px 0;cursor: pointer; padding: 5px 10px 5px 10px;";
        element.onclick= function(e) {
            e.preventDefault();
            window.open('https://www.gog.com/en/account/settings/subscriptions');
            e.stopImmediatePropagation();
        };
        // element.classList.add("giveaway-banner__button");
        element.innerHTML= '<span class="giveaway-banner__button-text">Privacy and subscriptions</span>';

        document.getElementsByClassName("giveaway-banner__footer")[0].append(element);
    }
    // 2 if giveaway-banner__success is found,
    // add a button to giveaway-banner__button -> https://www.gog.com/en/account/settings/subscriptions

    // https://www.gog.com/en/account/settings/subscriptions

    var container = document.documentElement || document.body;

    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            if(mutation.target.id == 'giveaway') {
            console.log('new mutation');
            console.log(mutation)
            console.log(typeof mutation.target)
                console.log('giveaway-banner__success has been added');
                let element = document.createElement("button");
                element.id = "SettingsSubscriptionsButton";
                element.style = "border: 1px solid transparent; border-radius: 3px; box-shadow: var(--theme-button-shadow); min-height: 46px; color: var(--theme-button-primary-text); background: var(--theme-button-primary) padding-box,var(--theme-button-primary-border);border-top-color: var(--theme-button-primary-border-top);border-bottom-color: var(--theme-button-primary-border-bottom);flex-shrink: 0;position: relative;padding: 16px 0;width: 100%;cursor: pointer;margin: 5px 0 5px 0 !important; padding: 5px 10px 5px 10px;";
                element.onclick= function(e) {
                    e.preventDefault();
                    window.open('https://www.gog.com/en/account/settings/subscriptions');
                    e.stopImmediatePropagation();
                };
                // element.classList.add("giveaway-banner__button");
                element.innerHTML= '<span>Privacy and subscriptions</span>';

                console.log('giveaway appended 1');
                if(!document.getElementById("SettingsSubscriptionsButton")) {
                    document.getElementsByClassName("giveaway-banner__success-inner")[0].append(element);
                    console.log('giveaway appended');
                }

                // observer.disconnect();
            }
        });
    });
    observer.observe(container, { subtree: true, attributes: true, childList: true, characterData: true });


})();