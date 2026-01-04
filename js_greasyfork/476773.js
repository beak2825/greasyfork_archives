// ==UserScript==
// @name         Time Rewinder (written by mot)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  sonic crazy
// @author       You
// @match        https://sonickrazykult.forumotion.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476773/Time%20Rewinder%20%28written%20by%20mot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476773/Time%20Rewinder%20%28written%20by%20mot%29.meta.js
// ==/UserScript==

function recurseTextNodes(node, callback) {
    if (node.nodeType === Node.TEXT_NODE) {
        callback(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
            recurseTextNodes(node.childNodes[i], callback);
        }
    }
}

function rewindClock(inputString) {
    const regexes = [
        [/(\d{4})-(\d{2})-(\d{2})/g, date => date.toISOString().split("T")[0]],
        [/(\w{3})\s(\w{3})\s(\d{2}),\s(\d{4})/g, date => new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).format(date)]
    ];

    for (const [regex, formatFunc] of regexes) {
        if (inputString.match(regex)) {
        return inputString.replace(regex, match => {
            console.log(match);
            const date = new Date(match);
            date.setFullYear(date.getFullYear() - 15);
            return formatFunc(date);


        });
    }}
}

(function() {
    'use strict';
    recurseTextNodes(document.body, node => {
       const updatedText = rewindClock(node.textContent);
        if (updatedText) {
            node.textContent = updatedText;
        }
    });



})();