// ==UserScript==
// @id             ptt_R18_click
// @name           ptt_R18_click
// @author         we684123@github, Cojad@github, tasi788@github
// @version        0.12
// @description    auto_click_R18_button PTT自動成人
// @include        https://www.ptt.cc/ask/over18?*
// @include        http://www.ptt.cc/ask/over18?*
// @match          https://www.ptt.cc/ask/over18?*
// @match          http://www.ptt.cc/ask/over18?*
// @grant          none
// @namespace https://greasyfork.org/users/162820
// @downloadURL https://update.greasyfork.org/scripts/36285/ptt_R18_click.user.js
// @updateURL https://update.greasyfork.org/scripts/36285/ptt_R18_click.meta.js
// ==/UserScript==

(function() {
    document.querySelector('.btn-big').click();
})();