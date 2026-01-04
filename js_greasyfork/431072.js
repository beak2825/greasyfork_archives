// ==UserScript==
// @name Sun-Asterisk Alert Custom Styles
// @namespace Sun-Asterisk Alert
// @description Sun-Asterisk Alert Custom Styles: font-size
// @run-at document-end
// @match        *://*/*
// @grant none
// @version 1.0.1
// @downloadURL https://update.greasyfork.org/scripts/431072/Sun-Asterisk%20Alert%20Custom%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/431072/Sun-Asterisk%20Alert%20Custom%20Styles.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) return;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Default styling
addGlobalStyle('#sun-asterisk-alert-message { font-size: 16px; height: 32px; }');

// Domains where the alert should be hidden completely
const hiddenDomains = [
    'wsm.sun-asterisk.vn',
    'asset.sun-asterisk.vn',
    'club.sun-asterisk.vn',
    'expense.sun-asterisk.vn',
    'review.sun-asterisk.vn',
    'goal.sun-asterisk.vn',
    'kudo.sun-asterisk.vn',
    'sun-asterisk.wsm.vn'
];

if (hiddenDomains.includes(location.host)) {
    addGlobalStyle('#sun-asterisk-alert-message { display: none !important; }');
}
