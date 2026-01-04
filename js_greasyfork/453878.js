// ==UserScript==
// @name         KanxueHideTips
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide the Kanxue's Tips view.
// @author       You
// @match        https://bbs.pediy.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bbs.pediy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453878/KanxueHideTips.user.js
// @updateURL https://update.greasyfork.org/scripts/453878/KanxueHideTips.meta.js
// ==/UserScript==

(function() {
    'use strict';
                $(".temporary_member_box_phone").hide();
                $(".temporary_member_box").hide()
})();