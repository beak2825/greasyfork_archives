// ==UserScript==
// @name            GuruSoft
// @namespace        GuruSoft
// @description        GuruSoft.exe
// @autor            Guru
// @version            1.0
// @include            http://*.grepolis.*/*
// @include            https://*.grepolis.*/*
// @downloadURL https://update.greasyfork.org/scripts/410916/GuruSoft.user.js
// @updateURL https://update.greasyfork.org/scripts/410916/GuruSoft.meta.js
// ==/UserScript==
(function(){
    var script = document.createElement('script'),
        link = document.createElement('link'),
        head = document.getElementsByTagName('head')[0];
    script.type = 'text/javascript';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    //script.src = location.protocol+'//bot.grepobot.com/Autobot.js?=' + Math.random();
    script.src = location.protocol+'//cdn.jsdelivr.net/gh/rubensei/grepobot-cracked@2.3.5/Autobot-Cracked.js';
    link.href = location.protocol+'//bot.grepobot.com/Autobot.css?=' + Math.random();
    head.appendChild(script);
    head.appendChild(link);
    head.setAttribute('xhttps', 1);
})();
