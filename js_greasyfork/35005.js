// ==UserScript==
// @name        Trouw paywall fix
// @include     https://www.trouw.nl/*
// @description  Remove bullshit
// @version      2017.11.10
// @namespace    greasy
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35005/Trouw%20paywall%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/35005/Trouw%20paywall%20fix.meta.js
// ==/UserScript==

document.cookie = '';

window.setInterval(() => {
    let dismiss = document.querySelector('.fjs-paywall-notice__dismiss');
    if (dismiss) {
        dismiss.dispatchEvent(new Event('click'));
    }
}, 100);
