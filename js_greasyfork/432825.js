// ==UserScript==
// @match       https://www.rarbgto.org/threat_defence.php*
// @match       https://*rarbg.*/threat_defence.php*
// @name        RARBG threat defence bypasser fix
// @description Automatically fill & submit captcha
// @grant       none
// @version     1.1.0
// @author      KaKi87
// @license     GPL-3.0-or-later
// @namespace   https://git.kaki87.net/KaKi87/userscripts/src/branch/master/rarbgThreatDefenceBypasser
// @require     https://unpkg.com/tesseract.js@2.1.4/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/432825/RARBG%20threat%20defence%20bypasser%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/432825/RARBG%20threat%20defence%20bypasser%20fix.meta.js
// ==/UserScript==

const waitInterval = setInterval(async () => {

    const img = document.querySelector('img[src^="/threat_captcha.php"]');

    if(!img) return;

    clearInterval(waitInterval);

    const { data: { text } } = await Tesseract.recognize(img);

    document.querySelector('#solve_string').setAttribute('value', text.trim());

    document.querySelector('#button_submit').click();

}, 100);