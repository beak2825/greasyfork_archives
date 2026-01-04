// ==UserScript==
// @name         Torn - Racing Reminder
// @namespace    duck.wowow
// @version      0.1.1
// @description  Checks the torn icons to see if you are not racing and not in hospital/flying, and displays a message to remind you to join a race
// @author       Baccy
// @match        https://www.torn.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545845/Torn%20-%20Racing%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/545845/Torn%20-%20Racing%20Reminder.meta.js
// ==/UserScript==

const showInHospital = false; // Change to true if you want it to display the reminder even in hospital

(function () {
    'use strict';

    function racing() {
        const header = document.querySelector('#header-root');
        if (!header) return;

        const icons = document.querySelector('[class*="status-icons___"]');

        const iconObserver = new MutationObserver(() => {
            const existingReminder = document.querySelector('#racing-reminder-odung');
            if (existingReminder) {
                if (
                    icons.querySelector('[class*="icon17"]') ||
                    icons.querySelector('[class*="icon71"]') ||
                    (!showInHospital && (
                        icons.querySelector('[class*="icon15"]') ||
                        icons.querySelector('[class*="icon82"]')
                    ))
                ) existingReminder.remove();
            } else {
                addReminder();
            }
        });
        iconObserver.observe(icons, { childList: true });

        addReminder();

        function addReminder() {
            if (
                icons.querySelector('[class*="icon17"]') ||
                icons.querySelector('[class*="icon71"]') ||
                (!showInHospital && (
                    icons.querySelector('[class*="icon15"]') ||
                    icons.querySelector('[class*="icon82"]')
                ))
            ) return; // Don't show when racing, traveling, or in hospital if showInHospital is false

            const reminder = document.createElement('div');
            reminder.id = 'racing-reminder-odung';
            reminder.style.cssText = 'padding: 10px;background-color: #331a1a;color: #fff;border: 1px solid #aa4444;border-radius: 8px;margin: 10px auto;display: flex;gap: 8px;align-items: center;flex-wrap: wrap;justify-content: center;max-width: 956px;'

            const text = document.createElement('span');
            text.textContent = `You are not currently in a race`;
            text.setAttribute('style', 'white-space: nowrap;');

            const anchor = document.createElement('a');
            anchor.textContent = 'LINK';
            anchor.href = 'https://www.torn.com/loader.php?sid=racing';
            anchor.style.cssText = 'background-color: #aa4444;color: #fff;border: 1px solid #666;padding: 5px 10px;border-radius: 4px;cursor: pointer;';

            const remove = document.createElement('button');
            remove.textContent = 'Remove';
            remove.style.cssText = 'background-color: #aa4444;color: #fff;border: 1px solid #666;padding: 5px 10px;border-radius: 4px;cursor: pointer;';
            remove.addEventListener('click', () => {
               reminder.remove();
            });

            reminder.appendChild(text);
            reminder.appendChild(anchor);
            reminder.appendChild(remove);
            if (!document.querySelector('#racing-reminder-odung')) header.appendChild(reminder);
        }
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('[class*="status-icons___"]')?.children.length > 0) {
            observer.disconnect();
            racing();
        }
    });
    observer.observe(document.body, { subtree: true, childList: true });
})();
