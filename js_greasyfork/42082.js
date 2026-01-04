// ==UserScript==
// @name        WaniKani Zero Zero what's this
// @namespace   FelixNemis.scripts
// @author      FelixNemis
// @description Notices when you have 0 lessons and reviews and adds a little visual flair
// @match       http://www.wanikani.com/
// @match       http://www.wanikani.com/dashboard*
// @match       https://www.wanikani.com/
// @match       https://www.wanikani.com/dashboard*
// @version     0.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/42082/WaniKani%20Zero%20Zero%20what%27s%20this.user.js
// @updateURL https://update.greasyfork.org/scripts/42082/WaniKani%20Zero%20Zero%20what%27s%20this.meta.js
// ==/UserScript==

function main() {
    var numberReviews = document.getElementsByClassName('reviews')[0].getElementsByTagName('span')[0].textContent;
    var numberLessons = document.getElementsByClassName('lessons')[0].getElementsByTagName('span')[0].textContent;
    if (numberReviews === '0' && numberLessons === '0') {
        var owo = document.createElement('span');
        owo.textContent = 'W';
        owo.style.position = "absolute";
        owo.style.left = "7.6em";
        owo.style.top = "2.8em";
        owo.className = "owo";
        var lessons = document.getElementsByClassName('lessons')[0];
        lessons.style.position = "relative";
        lessons.appendChild(owo);

        var style = document.createElement('style');
        style.innerHTML = ".navbar.scrolled .owo { display:none; }";
        style.type='text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}
window.addEventListener('load', main, false);