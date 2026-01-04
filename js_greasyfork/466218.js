// ==UserScript==
// @name         ShortyScript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/shortychannel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/466218/ShortyScript.user.js
// @updateURL https://update.greasyfork.org/scripts/466218/ShortyScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btnSelector = '#channel-points-reward-center-body > div > div > div.Layout-sc-1xcs6mc-0.iXbrq > div > button';
    const hydrateSelector = '#channel-points-reward-center-body > div > div > div:nth-child(8) > div > button';
    const throwSelector = '#channel-points-reward-center-body > div > div > div:nth-child(6) > div > button';
    const chatBtnSelector = '#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.wZVfj.chat-shell.chat-shell__expanded > div > div > section > div > seventv-container > div > div:nth-child(2) > div.Layout-sc-1xcs6mc-0.XTygj.chat-input__buttons-container > div.Layout-sc-1xcs6mc-0.hROlnu > div > div > div > div.Layout-sc-1xcs6mc-0.imLGzh > div.InjectLayout-sc-1i43xsx-0.dVOhMf > button';

    let throwInterval, hydrateInterval, chatInterval;
    let isThrowingEnabled = false;
    let isHydratingEnabled = false;

    const clickChatButton = () => {
        document.querySelector(chatBtnSelector)?.click();
    };

    const clickHydrateButton = () => {
        document.querySelector(hydrateSelector)?.click();
    };

    const clickThrowButton = () => {
        document.querySelector(throwSelector)?.click();
    };

    const clickPointsButton = () => {
        const btn = document.querySelector(btnSelector);
        if (btn && !btn.disabled) {
            btn.click();
        }
    };

    const startThrowing = () => {
        isThrowingEnabled = true;
        throwInterval = setInterval(() => {
            clickChatButton();
            clickThrowButton();
            clickPointsButton();
        }, 1000);
    }

    const stopThrowing = () => {
        isThrowingEnabled = false;
        clearInterval(throwInterval);
    }

    const startHydrating = () => {
        isHydratingEnabled = true;
        hydrateInterval = setInterval(() => {
            clickChatButton();
            clickHydrateButton();
            clickPointsButton();
        }, 65000);
    }

    const stopHydrating = () => {
        isHydratingEnabled = false;
        clearInterval(hydrateInterval);
    }

    GM_registerMenuCommand('Thrower', () => {
        if (isThrowingEnabled) {
            stopThrowing();
        } else {
            startThrowing();
        }
    });

    GM_registerMenuCommand('Hydrator', () => {
        if (isHydratingEnabled) {
            stopHydrating();
        } else {
            startHydrating();
        }
    });

    function isRaffle(t) {
        if (t.contains('The Multi-Raffle for') || t.contains('The Multi-Raffle has begun')) return true;
        return false
    }

    const chatObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type == 'childList') {
                if (mutation.target.matches('div.chat-scrollable-area__message-container')) {
                    mutation.addedNodes.forEach(n => {
                        var textns = n.querySelectorAll('span[class*="-fragment"]');
                        var textn = textns[0];
                        setTimeout(() => {
                            if (textn) {
                                var text = '';
                                textns.forEach(element => { text += element.innerText; });
                                if (isRaffle(text.trim())) {
                                    setTimeout(() => {
                                        console.log('raffle started')
                                        document.querySelector("#WYSIWGChatInputEditor_SkipChat > div > div > div > span > span > span").innerText = "!join"
                                        document.querySelector("#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.wZVfj.chat-shell.chat-shell__expanded > div > div > section > div > seventv-container > div > div:nth-child(2) > div.Layout-sc-1xcs6mc-0.XTygj.chat-input__buttons-container > div.Layout-sc-1xcs6mc-0.hOyRCN > div.Layout-sc-1xcs6mc-0.kaXoQh > div > button").click();
                                    }, 1000);
                                }
                            }
                        });
                    }, 0);
                }
            }
        })
    })

    GM_registerMenuCommand('AutoRaffle', () => {
        chatObserver.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true
        })
    })
})();

