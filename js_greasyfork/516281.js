// ==UserScript==
// @name Дуэли (2)
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Играем дуэли
// @author Лёшенька
// @match http://mafia-rules.net/*
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/516281/%D0%94%D1%83%D1%8D%D0%BB%D0%B8%20%282%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516281/%D0%94%D1%83%D1%8D%D0%BB%D0%B8%20%282%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    fetch('https://raw.githubusercontent.com/AlexeiMereniuc/o-test/refs/heads/main/duels.js')
    .then(r => r.text()).then(d => document.head.appendChild(Object.assign(document.createElement('script'), { textContent: d })));
 
 
})();