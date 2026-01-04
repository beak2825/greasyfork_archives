// ==UserScript==
// @name         Torn  - Daily/Weekly Reminder Buttons
// @namespace    duck.wowow
// @version      0.6
// @description  Add glowing buttons that appear daily or weekly to the sidebar and are removed once clicked
// @author       Baccy
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license       MIT
// @require https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js
// @downloadURL https://update.greasyfork.org/scripts/529679/Torn%20%20-%20DailyWeekly%20Reminder%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/529679/Torn%20%20-%20DailyWeekly%20Reminder%20Buttons.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    function init(element) {
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
        const dayOffset = (7 - yearStart.getUTCDay()) % 7;
        const firstSunday = new Date(yearStart.getTime() + dayOffset * 86400000);
        const weekNumber = Math.floor((now - firstSunday) / 604800000) + 1;

        const current = {
            year: now.getUTCFullYear(),
            week: weekNumber,
            day: now.getUTCDate(),
        };

        if (!data.Mission || data.Mission !== current.day) addReminder(element, 'Mission', 'https://www.torn.com/loader.php?sid=missions', 'day', current);
        // if (!data.Pharmacy || data.Pharmacy !== current.day) addReminder(element, 'Pharmacy', 'https://www.torn.com/shops.php?step=pharmacy', 'day', current);
        // if (!data.Beer || data.Beer !== current.day) addReminder(element, 'Beer', 'https://www.torn.com/shops.php?step=bitsnbobs', 'day', current);
        // if (!data.Candy || data.Candy !== current.day) addReminder(element, 'Candy', 'https://www.torn.com/shops.php?step=candy', 'day', current);
        if (!data.Lottery || data.Lottery !== current.day) addReminder(element, 'Lottery', 'https://www.torn.com/page.php?sid=lottery', 'day', current);

        // Weekly logic
        //if (!data[type] || current.year !== data.year || current.week !== data[type])
        
        //if (!data.Skimmers || current.year !== data.year || current.week !== data.Skimmers) addReminder(element, 'Skimmers', 'https://www.torn.com/loader.php?sid=crimes#/cardskimming', 'week', current);
    }

    const data = await GM.getValue('data', {});

    const observer = new MutationObserver(mutations => {
        const element = document.querySelector('.delimiter___bIaxE');
        if (element) {
            init(element);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function addReminder(element, label, url, time, current) {
        const button = document.createElement('button');
        button.style.cssText = 'width: 100%; cursor: pointer; padding: 1px; margin-bottom: 5px; background-color: #555; border: 1px solid lightgreen; border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 14px; color: #fff;';
        button.textContent = label;

        gsap.to(button, {
            duration: 2,
            borderColor: '#4ee44e',
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#444';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#555';
        });

        button.addEventListener('mousedown', async (event) => {
            event.preventDefault();

            if (event.button === 0 || event.button === 1) {
                data[label] = current[time];
                if (time === 'week') data.year = current.year;
                await GM.setValue('data', data);
    
                if (event.button === 0) window.location.href = url;
                else if (event.button === 1) window.open(url, '_blank');
    
                button.remove();
            }
        });

        element.parentElement.insertBefore(button, element.nextSibling);
    }
})();