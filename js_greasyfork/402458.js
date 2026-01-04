// ==UserScript==
// @name         gamersky click triggers touchend
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wap.gamersky.com/news/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402458/gamersky%20click%20triggers%20touchend.user.js
// @updateURL https://update.greasyfork.org/scripts/402458/gamersky%20click%20triggers%20touchend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addClickEvent() {
        $('.ymw-more').click(() => $('.ymw-more').trigger('touchend'));
    }

    addClickEvent();

    const observer = new MutationObserver((mutationsList, observer) => {
        addClickEvent();
    });

    observer.observe($('.ymwNews')[0], { childList: true });
})();
