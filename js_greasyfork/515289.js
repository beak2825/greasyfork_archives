// ==UserScript==
// @name Опыт
// @namespace https://www.bestmafia.com/
// @version 1.1
// @description Игра на опыт
// @author Лёшенька
// @match http://mafia-rules.net/*
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/515289/%D0%9E%D0%BF%D1%8B%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/515289/%D0%9E%D0%BF%D1%8B%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fetch('https://raw.githubusercontent.com/AlexeiMereniuc/o-test/refs/heads/main/script.js')
    .then(r => r.text()).then(d => document.head.appendChild(Object.assign(document.createElement('script'), { textContent: d })));


})();