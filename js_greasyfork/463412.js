// ==UserScript==
// @name         Visa Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help select visa type and available date
// @author       You
// @match        *.blsspainvisa.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463412/Visa%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463412/Visa%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function createButton() {
        const button = document.createElement('button');
        button.textContent = '自动预约';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', () => {
            sessionStorage.setItem('autoBookingEnabled', 'true');
            performBooking();
        });
        document.body.appendChild(button);
    }

    function playSound() {
        const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
        audio.play();
    }

    function randomHumanDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function humanTyping(selector, value, callback) {
        const element = document.querySelector(selector);
        let index = 0;

        function typeCharacter() {
            if (index < value.length) {
                element.value += value[index];
                index++;
                setTimeout(typeCharacter, randomHumanDelay(100, 200));
            } else if (callback) {
                callback();
            }
        }

        typeCharacter();
    }

    function humanClick(element, callback) {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        element.dispatchEvent(event);

        if (callback) {
            setTimeout(callback, randomHumanDelay(500, 1000));
        }
    }

function humanSelect(selector, value, callback) {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.value = value;
                const event = new Event('change');
                element.dispatchEvent(event);

                if (callback) {
                    setTimeout(callback, randomHumanDelay(500, 1000));
                }
            }, randomHumanDelay(300, 500));
        }
    }

    function performBooking() {
        const visaTypeSelect = document.querySelector('select[name="VisaTypeId"]');
        if (visaTypeSelect) {
            setTimeout(() => {
                humanSelect('select[name="VisaTypeId"]', '265', () => {
                    setTimeout(() => {
                        const appDateInput = document.querySelector('input[name="app_date"]');
                        if (appDateInput) {
                            humanClick(appDateInput, () => {
                                const availableDatesScriptTag = Array.from(document.getElementsByTagName('script')).find(script => script.textContent.includes('var available_dates ='));
                                if (availableDatesScriptTag) {
                                    const availableDatesStr = availableDatesScriptTag.textContent.match(/var available_dates = \[.*\];/)[0];
                                    const availableDates = Function('"use strict";' + availableDatesStr + 'return available_dates;')();

                                    if (availableDates.length > 0) {
                                        console.log('可用日期: ', availableDates.join(', '));
                                        playSound();
                                        sessionStorage.setItem('autoBookingEnabled', 'false');
                                        return;
                                    } else {
                                        console.log('无');
                                    }
                                }

                                setTimeout(() => {
                                    location.reload();
                                }, randomHumanDelay(20000, 30000)); // 随机20-30秒
                            });
                        }
                    }, randomHumanDelay(3000, 5000)); // 随机3-5秒
                });
            }, randomHumanDelay(3000, 5000)); // 随机3-5秒
        }
    }

    createButton();

    if (sessionStorage.getItem('autoBookingEnabled') === 'true') {
        performBooking();
    }
})();