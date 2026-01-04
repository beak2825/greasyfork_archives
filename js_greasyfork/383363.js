// ==UserScript==
// @name         yuketang print fucker.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This tool can remove all the useless element from the print page, which makes it nice to read the pdf online.
// @author       You
// @match        https://www.yuketang.cn/web/print
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383363/yuketang%20print%20fucker.user.js
// @updateURL https://update.greasyfork.org/scripts/383363/yuketang%20print%20fucker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body > div > div.controls-panel.noprint').remove();
    $('body > div > div').removeClass("cards-panel");

})();