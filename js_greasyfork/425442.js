// ==UserScript==
// @name         Intra
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  Make it easier to say thanks to all my team
// @author       Ilya Molchanov
// @match        https://intra.t-systems.ru/dash
// @icon         https://simpleicons.org/icons/t-mobile.svg
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425442/Intra.user.js
// @updateURL https://update.greasyfork.org/scripts/425442/Intra.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PEOPLE = [
        //'Pavel Milei',
        'Anna Smal',
        'Aleksandr Popov',
        'Avrora Reikh',
        'Ekaterina Doronina',
        'Михаил Зайцев',
        'Ilia Zakharov',
        //'Родион Ермолин',
        'Daniiar Mukanbetov',
        'Iuliia Makhmutova'
    ];

    const LONG_TIMEOUT = 200;
    const SHORT_TIMEOUT = 50;

    const putFocus = function(el) {
        const eventType = 'onfocusin' in el ? 'focusin' : 'focus';
        const bubbles = 'onfocusin' in el;
        let event;
        if ('createEvent' in document) {
            event = document.createEvent('Event');
            event.initEvent(eventType, bubbles, true);
        }
        else if ('Event' in window) {
            event = new Event(eventType, { bubbles: bubbles, cancelable: true });
        }
        el.focus();
        el.dispatchEvent(event);
    }

    const spinIf = function(condition) {
        const i = document.querySelector('i[class*="AddPeopleIcon"]');
        i.classList.toggle('Icon-spinner', condition);
        i.classList.replace(condition ? 'Icon_user-group' : 'Icon_spinner',
                            condition ? 'Icon_spinner' : 'Icon_user-group');
    }

    let g_p = 0;

    const onAddPeople = function() {
        spinIf(g_p < PEOPLE.length);
        if (g_p >= PEOPLE.length) {
            g_p = 0;
            return;
        }
        const name = PEOPLE[g_p];
        if (document.querySelector('div[class*="UserMention-Chip"] div[title="' + name + '"]')) {
            g_p++;
            window.setTimeout(onAddPeople, SHORT_TIMEOUT);
            return;
        }
        const i = document.querySelector('input[type="text"][class*="LineInput"]');
        putFocus(i);
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(i, name);
        i.dispatchEvent(new Event('input', { bubbles: true }));
        const waitForUser = function() {
            const suggested = document.querySelectorAll('div[class="MentionItem-Data"]');
            if (suggested && suggested.length !== 1) {
                window.setTimeout(waitForUser, LONG_TIMEOUT);
            }
            else {
                if (!document.querySelector('div[title^="' + name + '"]')) {
                    window.setTimeout(waitForUser, LONG_TIMEOUT);
                }
                else {
                    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
                    g_p++;
                    window.setTimeout(onAddPeople, SHORT_TIMEOUT);
                }
            }
        }
        window.setTimeout(waitForUser, LONG_TIMEOUT);
    }

    const insertAddPeopleButton = function() {
        document.querySelectorAll('button[class*="PrnUserInput-Btn"]').forEach((el) => {
            if (document.querySelector('button[class*="AddPeopleButton"]')) {
                return;
            }
            const b = document.createElement('button');
            b.title = 'Добавить ' + PEOPLE.length + ' коллег:\n\n' + PEOPLE.join(',\n');
            b.className = 'Button Button_border Button_background Button_padding_sm Button_borderRadius AddPeopleButton';
            b.style.lineHeight = '18px';
            b.style.marginLeft = '10px';
            const i = document.createElement('i');
            i.className = 'Icon Icon_user-group AddPeopleIcon';
            i.style.color = 'white';
            b.style.backgroundColor = '#E20074';
            b.appendChild(i);
            b.addEventListener('click', onAddPeople);
            el.parentElement.parentElement.appendChild(b);
            const s = document.head.appendChild(document.createElement('style'));
            s.innerHTML = '.Icon-spinner:before {animation: spin 1.5s linear infinite;}';
        });
    }

    document.addEventListener('click', (ev) => {
        if (ev.target.id === '4' || ev.target.id === '23') {
            window.setTimeout(insertAddPeopleButton, SHORT_TIMEOUT);
        }
    });
})();