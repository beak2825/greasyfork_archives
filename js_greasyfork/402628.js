// ==UserScript==
// @name         Google Rezka
// @namespace    http://alamote.pp.ua/
// @match        https://www.google.com/search*
// @grant        none
// @version      2.1
// @namespace    AlaMote
// @description  Add a link to rezka.ag to the google search
// @icon         http://alamote.pp.ua/staff/alamote-logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402628/Google%20Rezka.user.js
// @updateURL https://update.greasyfork.org/scripts/402628/Google%20Rezka.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    const logo = document.querySelector('.logo');
    const searchContainer = document.querySelector('.logo + div');
    const searchButton = document.querySelector('.logo + div button[aria-label="Поиск в Google"]');
    if (logo) {
        // const container = logo.parentElement;
        // container.style.display = 'flex';
        // container.style.alignItems = 'center';

        const img = document.createElement('img');
        img.src = 'https://apkresult.com/Logos/hdrezka-apkresult.jpg';
        img.style.height = '24px';
        img.style.width = '24px';

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q').replace(' ', '+');

        const hdBtn = document.createElement('a');
        hdBtn.style.display = 'flex';'';
        hdBtn.style.alignItems = 'center';
        hdBtn.style.paddingRight = '13px';
        const rtBtn = hdBtn.cloneNode(true);
        hdBtn.append(img);
        hdBtn.href = 'https://rezka.ag/search?do=search&subaction=search&q=' + query;
        const rtImg = img.cloneNode(true);
        rtImg.src = 'https://pbs.twimg.com/media/DL7t7bOXkAEWq-n.jpg';
        rtBtn.href = 'https://rutracker.org/forum/tracker.php?nm=' + query;
        rtBtn.append(rtImg);

        searchButton.parentNode.insertBefore(hdBtn, searchButton.nextSibling);
        hdBtn.parentNode.insertBefore(rtBtn, hdBtn.nextSibling);
    }

})();