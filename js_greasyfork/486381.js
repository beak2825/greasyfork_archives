// ==UserScript==
// @name         Randomize font!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Клоунский скрипт
// @author       Fenion
// @match        https://anichat.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anichat.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486381/Randomize%20font%21.user.js
// @updateURL https://update.greasyfork.org/scripts/486381/Randomize%20font%21.meta.js
// ==/UserScript==

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const boldNames = ['bold', 'heavybold', 'ital', 'boldital', 'heavyital', ''];

const injectToSendMessage = () => {
    const origin = window.processChatPost;
    window.processChatPost = (...args) => {
        const colorInt = randomInt(0, 32);
        const fontInt = randomInt(0, 7);
        const boldInt = randomInt(0, 5);
        fetch('/system/action_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:  new URLSearchParams({
                save_color: !colorInt ? '': 'bcolor' + colorInt,
                save_bold: boldNames[randomInt(0, boldNames.length - 1)],
                save_font:  !fontInt ? '': 'bfont' + fontInt,
                token: window.utk,
            })
        })
            .catch(console.error)
            .finally(() => origin(...args));
    };
};

(function () {
    'use strict';

    injectToSendMessage();
})();
