// ==UserScript==
// @name         onliner catalog fold feature
// @namespace    http://tampermonkey.net/
// @version      2025-07-16
// @description  fold items in onliner.by catalog automatically
// @author       vp
// @match        https://catalog.onliner.by/*
// @icon         https://gc.onliner.by/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542334/onliner%20catalog%20fold%20feature.user.js
// @updateURL https://update.greasyfork.org/scripts/542334/onliner%20catalog%20fold%20feature.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const exclude = function(value) {
        console.log('script is running');

        if (!value) {
            console.log('nothing to exclude, exiting');
            return;
        }

        const exclusionTerms = value.split(',');

        document.querySelectorAll('.catalog-form__offers-unit').forEach(function(el) {
            exclusionTerms.forEach(function(term) {
                if (el.innerText.includes(term)) {
                    el.style.display = 'none';
                }
            });
        });
    }

    const setup = function() {
        const panel = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const button = document.createElement('button');

        panel.style.margin = '0 0 25px 5px';
        label.innerText = 'Exclude:';
        input.id = 'exclusion-terms';
        button.innerText = 'OK';
        button.onclick = function() { setInterval(exclude, 1000, input.value) };

        panel.append(label);
        panel.append(input);
        panel.append(button);

        document.querySelector('.catalog-form__offers').prepend(panel);
    }

    setup();
})();