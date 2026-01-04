// ==UserScript==
// @name         Redirect twitch clip to minbird
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lol
// @author       fienestar
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460521/Redirect%20twitch%20clip%20to%20minbird.user.js
// @updateURL https://update.greasyfork.org/scripts/460521/Redirect%20twitch%20clip%20to%20minbird.meta.js
// ==/UserScript==

(function() {
    'use strict';

    open_old = window.open
    window.open = function open(){
        return new Proxy(
            open_old.apply(this, arguments), {
                get(target, prop, receiver) {
                    if (prop === "location") {
                        return new Proxy(target[prop], {
                            set(target, prop, value) {
                                if(prop === 'href' && value === 'https://clips.twitch.tv/clips/channel_not_clippable')
                                    value = 'https://minbird.kr/clipmaker' + window.location.pathname
                                return target[prop] = value
                            }
                        })
                    }
                    return target[prop];
                },
            }
        );
    }
})();