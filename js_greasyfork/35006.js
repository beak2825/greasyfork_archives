// ==UserScript==
// @name        Reddit styling
// @include     https://www.reddit.com/*
// @description  Remove bullshit
// @version      2019.07.13
// @namespace    greasy
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/35006/Reddit%20styling.user.js
// @updateURL https://update.greasyfork.org/scripts/35006/Reddit%20styling.meta.js
// ==/UserScript==

var link = document.createElement('link');
link.href = 'https://bsk.uk.to:1337/Userscripts/reddit.css';
link.rel = 'stylesheet';
document.documentElement.appendChild(link);

document.addEventListener('readystatechange', (event) => {
    Array.from(document.querySelectorAll('a.expand')).filter((e) => e.textContent === '[+]').forEach((el) => el.click());
});
