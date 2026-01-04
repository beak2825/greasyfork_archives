// ==UserScript==
// @name         IQRPG Header + animation remover
// @namespace    https://www.iqrpg.com/
// @version      0.4
// @description  remove the header graphic and the auto animation
// @author       euphone(edit by Tiande)
// @match https://*.iqrpg.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546674/IQRPG%20Header%20%2B%20animation%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/546674/IQRPG%20Header%20%2B%20animation%20remover.meta.js
// ==/UserScript==

$(document).ready(() => {
    setTimeout(() => {
        $('.header').remove();
        //$('.action-timer__overlay').remove();
    }, 2000);
});