// ==UserScript==
// @name         Copy ASF Code Button
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Adds a button to copy ASF code to clipboard
// @author       祈之羽
// @match        https://keylol.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493253/Copy%20ASF%20Code%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/493253/Copy%20ASF%20Code%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hasSteamAppPaths = Array.from(document.querySelectorAll('a[href]')).some(link => link.href.includes('store.steampowered.com/app/'));
    if (hasSteamAppPaths) {
        var copyButton = document.createElement('button');
        copyButton.innerHTML = 'Copy ASF Code';
        copyButton.style.position = 'fixed';
        copyButton.style.top = '20px';
        copyButton.style.left = '20px';
        copyButton.style.zIndex = '9999';
        copyButton.addEventListener('click', function() {
            var links = document.querySelectorAll('a[href]');
            var numbers = new Set();
            links.forEach(function(link) {
                var match = link.href.match(/store\.steampowered\.com\/app\/(\d+)/);
                if (match) {
                    numbers.add(match[1]);
                }
            });
            var asfCode = '!addlicense asf ' + Array.from(numbers).map(number => 'a/' + number).join(',');
            GM_setClipboard(asfCode);
            alert('ASF code copied to clipboard!');
        });
        document.body.appendChild(copyButton);
    }
})();