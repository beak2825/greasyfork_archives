// ==UserScript==
// @name         ET Summary Timer
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Displays crafting timers in Summary menu. Settings available in console via window.et_summaryTimer
// @author       Aes Sedai
// @match        http*://*.eternitytower.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35107/ET%20Summary%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/35107/ET%20Summary%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings, use window.et_summaryTimer in console to change settings
    // showCrafting: BOOLEAN, default: true; if true, shows a timer for crafting in summary list
    // showInscription: BOOLEAN, default: true; if true, shows a timer for inscription in summary list
    // showAdventure: BOOLEAN, default: true; if true, shows a timer for adventures in summary list
    // showReforging: BOOLEAN, default: true; if true, shows a timer for reforging in summary list
    // interval: INTEGER, default: 1000; time in millisecons to wait before refreshing timer
    window.et_summaryTimer = {
        showCrafting: true,
        showInscription: true,
        showAdventure: true,
        showReforging: true,
        interval: 1000
    };

    if(localStorage.getItem('et_summaryTimer')) window.et_summaryTimer = Object.assign({}, window.et_summaryTimer, JSON.parse(localStorage.getItem('et_summaryTimer')));

    $(window).on("beforeunload", function() {
        localStorage.setItem('et_summaryTimer', JSON.stringify(window.et_summaryTimer));
    });

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date());
        let seconds = Math.floor( (t/1000) % 60 );
        let minutes = Math.floor( (t/1000/60) % 60 );
        let hours = Math.floor( (t/(1000*60*60)) % 24 );
        let days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours.toString().padStart(2, '0'),
            'minutes': minutes.toString().padStart(2, '0'),
            'seconds': seconds.toString().padStart(2, '0')
        };
    }

    function formatTimeRemaining(time) {
        if(time.days > 0) return time.days + ":" + time.hours + ":" + time.minutes + ":" + time.seconds;
        if(time.hours > 0) return time.hours + ":" + time.minutes + ":" + time.seconds;
        if(time.minutes > 0) return time.minutes + ":" + time.seconds;
        if(time.seconds > 0) return "00:" + time.seconds;
    }

    function cleanup(summary) {
        if($(summary.classSelector).length > 0) $(summary.classSelector).remove();
    }

    let summaries = [
        {classSelector: ".crafting-timer", type: 'crafting', redis: Meteor.connection._mongo_livedata_collections.crafting.find(), rowSelector: ".summary-crafting", active: window.et_summaryTimer.showCrafting},
        {classSelector: ".inscription-timer", type: 'crafting', redis: Meteor.connection._mongo_livedata_collections.inscription.find(), rowSelector: ".summary-inscription", active: window.et_summaryTimer.showInscription},
        {classSelector: ".adventures-timer", type: 'adventure', redis: Meteor.connection._mongo_livedata_collections.adventures.find(), rowSelector: ".summary-adventures", active: window.et_summaryTimer.showAdventure},
        {classSelector: ".reforging-timer", type: 'reforging', redis: Meteor.connection._mongo_livedata_collections.crafting.find(), rowSelector: ".summary-reforging", active: window.et_summaryTimer.showReforging},
    ];

    let interval = setInterval(function() {
        summaries.forEach(function(summary) {
            if(!summary.active) return;
            let elems = null;
            if(summary.type == 'crafting') {
                let fetch = summary.redis.fetch();
                if(fetch.length === 0) {
                    cleanup(summary);
                    return;
                }
                let currentlyCrafting = fetch[0].currentlyCrafting;
                if (currentlyCrafting.length === 0) {
                    cleanup(summary);
                    return;
                }
                let firstCraft = currentlyCrafting[0];
                if(!firstCraft.hasOwnProperty('endDate')) {
                    cleanup(summary);
                    return;
                }
                elems = currentlyCrafting;
            } else if(summary.type == 'adventure') {
                let fetch = summary.redis.fetch();
                if(fetch.length === 0) {
                    cleanup(summary);
                    return;
                }
                elems = fetch[0].adventures.filter((a) => !!a.startDate && !a.hasOwnProperty('win'));
                if(elems.length === 0) {
                    cleanup(summary);
                    return;
                }
            } else if(summary.type == 'reforging') {
                let fetch = summary.redis.fetch();
                if(fetch.length === 0) {
                    cleanup(summary);
                    return;
                }
                let currentlyReforging = fetch[0].currentlyReforging;
                if (currentlyReforging.length === 0) {
                    cleanup(summary);
                    return;
                }
                let firstReforge = currentlyReforging[0];
                if(!firstReforge.hasOwnProperty('endDate')) {
                    cleanup(summary);
                    return;
                }
                elems = currentlyReforging;
            }

            if($(summary.classSelector).length > 0) {
                if(elems.length > 1) {
                    $(summary.classSelector).html(formatTimeRemaining(getTimeRemaining(elems[0].endDate)) + " (" + formatTimeRemaining(getTimeRemaining(elems[elems.length - 1].endDate)) + ")");
                } else if(elems.length == 1) {
                    $(summary.classSelector).html(formatTimeRemaining(getTimeRemaining(elems[0].endDate)));
                }
            } else if($(summary.rowSelector).length > 0) {
                let row = $(summary.rowSelector);
                let timeContainer = document.createElement("span");
                timeContainer.className = summary.classSelector.replace('.', '');
                timeContainer.style.cssText = 'padding-left: 6px;';
                if(elems.length > 1) {
                    timeContainer.innerHTML = formatTimeRemaining(getTimeRemaining(elems[0].endDate) + " (" + formatTimeRemaining(getTimeRemaining(elems[elems.length - 1].endDate)) + ")");
                } else if(elems.length == 1) {
                    timeContainer.innerHTML = formatTimeRemaining(getTimeRemaining(elems[0].endDate));
                }

                row.after(timeContainer);
            }
        });
    }, window.et_summaryTimer.interval);
})();