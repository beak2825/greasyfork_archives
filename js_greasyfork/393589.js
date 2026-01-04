// ==UserScript==
// @name         Interval Get Twitch Channel Points
// @namespace    https://greasyfork.org/pl/users/416294-patrykcholewa
// @version      1.2.2
// @description  If stream time, clicks premium currency button anytime it appears. Is enabled between 8:00 and 4:00. Can be enabled manually.
// @author       PatrykCholewa
// @include      https://www.twitch.tv/*
// @exclude      https://www.twitch.tv/*/videos*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393589/Interval%20Get%20Twitch%20Channel%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/393589/Interval%20Get%20Twitch%20Channel%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var __twitchIntervalGetChannelPoints_EVENING_STREAM_TIME_LIMIT = 8;
    var __twitchIntervalGetChannelPoints_MORNING_STREAM_TIME_LIMIT = 4;


    document.__twitchIntervalGetChannelPoints_checkIsEnabled = function() {
        return new Date().getHours() >= __twitchIntervalGetChannelPoints_EVENING_STREAM_TIME_LIMIT
             || new Date().getHours() <= __twitchIntervalGetChannelPoints_MORNING_STREAM_TIME_LIMIT;
    }

    document.__twitchIntervalGetChannelPoints_enable = function() {
        document.__twitchIntervalGetChannelPoints_checkIsEnabled = function() {
            return true;
        }
    }

    document.__twitchIntervalGetChannelPoints_disable = function() {
        document.__twitchIntervalGetChannelPoints_checkIsEnabled = function() {
            return false;
        }
    }

    var counter = 0;

    console.log('"Interval Get Twitch Channel Points" loaded');

    setInterval(function() {
        if (document.__twitchIntervalGetChannelPoints_checkIsEnabled()) {
            setTimeout(function() {
                var buttons = Array.from(document.querySelectorAll('button') || [])
                                   .filter(but => but.ariaLabel === 'Odbierz bonus');
                if (buttons.length > 1) {
                    console.err('TOO MANY BUTTONS');
                    return;
                }

                var button = buttons[0];

                if (button) {
                    console.debug('TRY CLICK');
                    try {
                        button.click();
                        counter = 0;
                        console.log('BUTTON CLICKED');
                    } catch (ex) {
                        console.error('ERROR CLICKED', ex);
                    }
                    button.click();
                } else {
                    if (counter > 200) {
                        window.location.reload();
                        counter = 0;
                        console.debug('RELOAD');
                    }
                    counter++;
                    console.debug('WAIT BUTTON', 'COUNTER: ' + counter, new Date());
                }
            }, Math.random() * 4000);
        } else {
            console.debug('WAIT TILL STREAM', new Date());
        }

    }, 8000);
})();
