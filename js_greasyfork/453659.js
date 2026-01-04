// ==UserScript==
// @name         Cookie.one Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Naviger med tastaturet
// @author       You
// @match        https://cookie.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cookie.one
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453659/Cookieone%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/453659/Cookieone%20Shortcuts.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(() => {
    'use strict';

    const antibot = !!document.querySelector('#antibot');
    let nextEvent, eventTimer;
    const loadTime = new Date();
    loadTime.setTime(loadTime.getTime() + (30*60*1e3));

    const supportedPagesArray = ['', 'welcome', 'bakery', 'factory', 'grainmill', 'roost'
                                 , 'dairy', 'sugarplantation', 'cocoafarm', 'eventlog'
                                 , 'lottery', 'notification', 'achievements', 'refer'
                                 , 'playerlist', 'shop', 'todaysbaker', 'dailychores'
                                 , 'lottery', 'protection', 'message', 'statistics'
                                 , 'support'
                                ];
    const supportedPagesRegex = /^\/(market\/?(upgrade|trade)?|storage\/?(item\/.+)?|bakingteam\/?(bonus|statistic|action)?|support\/?(view\/.+)?|help(\/.+)?)$/i;
    function isSupported() {
        const supported = supportedPagesArray.includes(location.pathname.substr(1)) || supportedPagesRegex.test(location.pathname);
        //console.log('isSupported: ' + supported);
        return supported;
    }

    window.addEventListener('keypress', e => {
        const keys = isSupported() ? [' ', 'Enter', 'Escape'] : ['Escape'];
        if (keys.includes(e.key)) {
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', e => {
        if (antibot) {
            console.log('can not skip antibot, complete it');
            return;
        }

        const element = document.querySelector('main button[type=submit]');
        let path;
        switch (e.key) {
            case '0':
                if (!isSupported()) return false;
                path = 'bakery';
                break;
            case '+':
                if (!isSupported()) return false;
                path = 'factory';
                break;
            case '1':
                if (!isSupported()) return false;
                path = 'grainmill';
                break;
            case '2':
                if (!isSupported()) return false;
                path = 'roost';
                break;
            case '3':
                if (!isSupported()) return false;
                path = 'dairy';
                break;
            case '4':
                if (!isSupported()) return false;
                path = 'sugarplantation';
                break;
            case '5':
                if (!isSupported()) return false;
                path = 'cocoafarm';
                break;
            case ' ':
            case 'Enter':
                if (!isSupported()) return;
                e.preventDefault();
                if (tryClickButton()) {
                    return;
                }
                path = nextEvent;
                break;
            case 'Escape':
                e.preventDefault();
                if (tryClickButton()) {
                    return;
                }
                path = nextEvent;
                break;
            default:
                return;
        }
        if (location.pathname.substr(1) === path && !definedTimeAfterLoaded()) return;
        location.pathname = '/' + path;
    });

    function definedTimeAfterLoaded() {
        const currentTime = new Date();
        return currentTime.getTime() >= loadTime.getTime();
    }

    function addNextStyle() {
        const events = ['bakery', 'factory', 'grainmill', 'roost', 'dairy', 'sugarplantation', 'cocoafarm'];
        let timers = [...document.querySelectorAll('.d-none.d-lg-block>.card.card-body.card-menu [data-countdown]')]
            .filter(timer => events.includes(timer.getAttribute('data-target').trim()));

        timers.sort((a, b) => {
            let timeLeftA = +a.getAttribute('data-countdown');
            let timeLeftB = +b.getAttribute('data-countdown');

            if (timeLeftA <= 0) {
                timeLeftA = events.indexOf(a.getAttribute('data-target')) - events.length;
            }
            if (timeLeftB <= 0) {
                timeLeftB = events.indexOf(b.getAttribute('data-target')) - events.length;
            }

            return timeLeftA-timeLeftB;
        });

        const [first, second] = timers.map(timer => timer.parentElement);
        first.classList.add('arrow-before');
        first.classList.add('text-warning');
        //second.classList.add('text-info');

        eventTimer = timers[0];
        nextEvent = eventTimer.getAttribute('data-target').trim();
    }
    addNextStyle();

    function tryClickButton() {
        if (!isSupported()) {
            console.log('not supported page');
            return false;
        }

        if (!nextEvent || !eventTimer) {
            console.log('missing data or element');
            console.log(eventTimer);
            return false;
        }

        let isCurrentPossible = false;
        try {
            let timerElement = document.querySelector(`.d-none.d-lg-block>.card.card-body.card-menu [data-target="${location.pathname.substr(1)}"]`)
            isCurrentPossible = !/[0-9]{2}:[0-9]{2}/.test(timerElement.textContent);
        } catch (e) {
            console.log('not supported page - xxx');
        }

        if (location.pathname !== '/' + nextEvent || (nextEvent !== 'bakery' && !isCurrentPossible)) {
            console.log(!isCurrentPossible ? 'should not perform action.' : 'not next event');
            return false;
        }

        if (/[0-9]{2}:[0-9]{2}/.test(eventTimer.textContent)) {
        //if (eventTimer.textContent !== eventTimer.getAttribute('data-finishtext')) {
            console.log('should not perform action');
            return false;
        }

        const element = document.querySelector('main button[type=submit]');
        if (!element) {
            console.log('did not find element');
            return false;
        }

        element.click();
        return true;
    }

})()