// ==UserScript==
// @name         LUOA Utilities
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  -
// @author       -
// @match        http*://luoa.instructure.com/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485162/LUOA%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/485162/LUOA%20Utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (var elementIndex in document.getElementsByClassName('conferences')) {
        const element = document.getElementsByClassName('conferences')[elementIndex];
        element.tagName === 'A' ? element.textContent = 'Conferences' : {};
    }

    const back = document.createElement('a');
    back.href = window.location.href.slice().replace('/take', '');
    back.textContent = '< Leave Assignment';
    back.tabindex = '0';
    back.style.color = 'red';
    const li = document.createElement('li');
    li.class = 'section';
    li.appendChild(back);
    if (/.\/take/.test(window.location.href)) {
        document.getElementById('section-tabs').appendChild(li);
    }
})();