// ==UserScript==
// @name         Display Trello Card Number
// @namespace    http://tampermonkey.net/
// @version      2024-07-18
// @description  Display number in the trello card
// @author       Yuexie
// @match        https://trello.com/b/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501024/Display%20Trello%20Card%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/501024/Display%20Trello%20Card%20Number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showCardNumbers() {
        var titleElements = Array.from(document.querySelectorAll('[data-testid="card-name"]'));
        for(var i in titleElements) {
            var titleNode = titleElements[i]
            if (titleNode.getAttribute('card-number')) continue;
            var href = titleNode.href.split('/');
            var id = href[href.length - 1].split('-')[0];
            var pNode = document.createElement('p');
            pNode.textContent = '#' + id;
            pNode.style.backgrounColor = 'gray';
            titleNode.parentElement.insertBefore(pNode, titleNode);
            titleNode.setAttribute('card-number', id);
        }
    }

    window.setInterval(function() {
        showCardNumbers();
    },2000);

})();