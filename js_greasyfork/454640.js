// ==UserScript==
// @name         Pikabu Link FavIcons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add favicons to every link on pikabu
// @author       Dimava
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454640/Pikabu%20Link%20FavIcons.user.js
// @updateURL https://update.greasyfork.org/scripts/454640/Pikabu%20Link%20FavIcons.meta.js
// ==/UserScript==

(function() {
    function makeLinkIcons() {
        const selector = 'a[href^=http]:not([href*="pikabu.ru"]):not(.with-favicon)';
        const links = document.querySelectorAll(selector);
        console.log(links);
        for (let link of links) {
            link.classList.add('with-favicon');
            let domain = link.href.split('/')[2];
            let icon = 'https://www.google.com/s2/favicons?domain=' + domain;
            link.style.setProperty('--icon', `url("${icon}")`);
        }
    }
    makeLinkIcons();
    setInterval(makeLinkIcons, 1000);

    function createStyle(s) {
        let el = document.createElement('style');
        document.head.append(el);
        el.innerHTML = s;
    }
	createStyle(`a.with-favicon::before {
		content: "";
		background-image: var(--icon);
		height: 16px;
		width: 16px;
		display: inline-block;
		vertical-align: text-bottom;
		margin-right: 6px;
	}`);
})();