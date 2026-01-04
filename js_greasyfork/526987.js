// ==UserScript==
// @name Дуэли
// @namespace https://www.bestmafia.com/
// @version 1.1
// @description Играем дуэли
// @author Лёшенька
// @match http://mafia-rules.net/*
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/526987/%D0%94%D1%83%D1%8D%D0%BB%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/526987/%D0%94%D1%83%D1%8D%D0%BB%D0%B8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    fetch('https://raw.githubusercontent.com/AlexeiMereniuc/o-test/refs/heads/main/duelbot.js', {
        cache: 'no-store'
    })
        .then(r => r.text())
        .then(d => {
        const s = document.createElement('script');
        s.textContent = d;
        document.head.appendChild(s);
    });
 
 
})();