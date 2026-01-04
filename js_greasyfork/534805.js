// ==UserScript==
// @name         1xbit2 - přepsání domény
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Michal
// @description  Změní defaultní hodnotu promptu z 1xstavka.ru na 1xbit2.com
// @match        https://1xbit2.com/*
// @match        https://1xbit1.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534805/1xbit2%20-%20p%C5%99eps%C3%A1n%C3%AD%20dom%C3%A9ny.user.js
// @updateURL https://update.greasyfork.org/scripts/534805/1xbit2%20-%20p%C5%99eps%C3%A1n%C3%AD%20dom%C3%A9ny.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalPrompt = window.prompt;

    window.prompt = function(message, defaultValue) {
        if (typeof defaultValue === 'string' && defaultValue === '1xstavka.ru') {
            console.log('🛠️ Změněna výchozí hodnota promptu na 1xbit2.com');
            return originalPrompt.call(this, message, '1xbit2.com');
        }
        return originalPrompt.apply(this, arguments);
    };
})();
