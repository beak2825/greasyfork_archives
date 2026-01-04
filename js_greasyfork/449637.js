// ==UserScript==
// @name            Google Remove Redirection Warning
// @namespace       https://github.com/SlashNephy
// @version         0.1.4
// @author          SlashNephy
// @description     Remove redirection warning from https://google.com/url
// @description:ja  https://google.com/url のリダイレクト警告をスキップします。
// @homepage        https://scrapbox.io/slashnephy/Google_%E3%82%B9%E3%83%97%E3%83%AC%E3%83%83%E3%83%88%E3%82%B7%E3%83%BC%E3%83%88%E5%86%85%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%B8%8F%E3%82%93%E3%81%A0%E9%9A%9B%E3%81%AE%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88%E8%AD%A6%E5%91%8A%E3%82%92%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/Google_%E3%82%B9%E3%83%97%E3%83%AC%E3%83%83%E3%83%88%E3%82%B7%E3%83%BC%E3%83%88%E5%86%85%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%B8%8F%E3%82%93%E3%81%A0%E9%9A%9B%E3%81%AE%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88%E8%AD%A6%E5%91%8A%E3%82%92%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97%E3%81%99%E3%82%8B_UserScript
// @icon            https://www.google.com/s2/favicons?sz=64&domain=google.com
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://google.com/url?q=*
// @match           https://www.google.com/url?q=*
// @grant           none
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/449637/Google%20Remove%20Redirection%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/449637/Google%20Remove%20Redirection%20Warning.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const anchor = document.querySelector('body > div > a');
    if (anchor) {
        window.location.href = anchor.href;
    }

})();
