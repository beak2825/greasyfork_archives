// ==UserScript==
// @name         IQRPG Header + animation remover
// @namespace    https://www.iqrpg.com/
// @version      0.4
// @description  remove the header graphic and the auto animation
// @author       euphone
// @match        https://www.iqrpg.com/game.html
// @match        http://www.iqrpg.com/*
// @match        https://iqrpg.com/*
// @match        http://iqrpg.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @include      *iqrpg.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396943/IQRPG%20Header%20%2B%20animation%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/396943/IQRPG%20Header%20%2B%20animation%20remover.meta.js
// ==/UserScript==

$(document).ready(() => {
    setTimeout(() => {
        $('.header').remove();
        $('.action-timer__overlay').remove();
    }, 200);
});