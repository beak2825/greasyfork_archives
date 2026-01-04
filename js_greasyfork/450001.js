// ==UserScript==
// @name         Subeta Quester
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate most standard Subeta quests (might not work on the one that makes you do other quests? or the Battledome ones?)
// @author       pokemon
// @match        https://subeta.net/quests.php/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subeta.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450001/Subeta%20Quester.user.js
// @updateURL https://update.greasyfork.org/scripts/450001/Subeta%20Quester.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const START_TIMEOUT = 1000;
    const SHOP_TIMEOUT_BASE = 5000;
    const SHOP_TIMEOUT_RAND = 1000;
    const SUBMIT_TIMEOUT = 500;
    if (window.location.href.match(/https:\/\/subeta.net\/quests.php\/.*$/)) {
        const startButton = document.querySelector('.ui.button.teal');
        const shopButtons = document.querySelectorAll('.btn.btn-outline-info.btn-md');
        if (startButton) {
            startButton.click();
        } else if (window.location.href.indexOf('finish') != -1) {
            setTimeout(() => {
                document.querySelector('.ui.button.large').click();
            }, Math.random() * START_TIMEOUT);
        } else if (shopButtons) {
            let callbacks = shopButtons.length;
            shopButtons.forEach((e, i) => {
                let frame = document.createElement('iframe');
                frame.src = e.href;
                frame.onload = ((i) => {
                    return () => {
                        setTimeout(() => {
                            frame.contentDocument.querySelector('.quick-buy').click();
                            if (--callbacks == 0) {
                                setTimeout(() => {
                                    document.querySelector('.btn.btn-lg.btn-success').click();
                                }, SUBMIT_TIMEOUT);
                            }
                        }, i * SHOP_TIMEOUT_BASE + Math.random() * SHOP_TIMEOUT_RAND);
                    }
                })(i);
                document.body.appendChild(frame);
            });
        }
    }
})();