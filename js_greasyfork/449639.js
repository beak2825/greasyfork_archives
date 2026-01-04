// ==UserScript==
// @name            Feedly Auto Refresh
// @namespace       https://github.com/SlashNephy
// @version         0.2.4
// @author          SlashNephy
// @description     Auto refresh feeds when there are no unread articles in Feedly.
// @description:ja  Feedly で未読記事がないとき、フィードを自動リフレッシュします。
// @homepage        https://scrapbox.io/slashnephy/Feedly_%E3%81%A7%E6%9C%AA%E8%AA%AD%E8%A8%98%E4%BA%8B%E3%81%8C%E3%81%AA%E3%81%84%E3%81%A8%E3%81%8D%E3%80%81%E3%83%95%E3%82%A3%E3%83%BC%E3%83%89%E3%82%92%E8%87%AA%E5%8B%95%E3%83%AA%E3%83%95%E3%83%AC%E3%83%83%E3%82%B7%E3%83%A5%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/Feedly_%E3%81%A7%E6%9C%AA%E8%AA%AD%E8%A8%98%E4%BA%8B%E3%81%8C%E3%81%AA%E3%81%84%E3%81%A8%E3%81%8D%E3%80%81%E3%83%95%E3%82%A3%E3%83%BC%E3%83%89%E3%82%92%E8%87%AA%E5%8B%95%E3%83%AA%E3%83%95%E3%83%AC%E3%83%83%E3%82%B7%E3%83%A5%E3%81%99%E3%82%8B_UserScript
// @icon            https://www.google.com/s2/favicons?sz=64&domain=feedly.com
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://feedly.com/i/collection/*
// @grant           none
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/449639/Feedly%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/449639/Feedly%20Auto%20Refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(() => {
        const element = document.querySelector('button.icon-toolbar-refresh-secondary');
        if (!element) {
            return;
        }
        if (element.classList.contains('update-available') && document.querySelector('.empty-state') !== null) {
            element.click();
        }
    }, 30000);

})();
