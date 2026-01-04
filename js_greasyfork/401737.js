// ==UserScript==
// @name         BT YM
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        https://market.yandex.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401737/BT%20YM.user.js
// @updateURL https://update.greasyfork.org/scripts/401737/BT%20YM.meta.js
// ==/UserScript==

(function() {
    var bt_link = $( "a:contains('Best-Tyres')" )
    $(bt_link.parentsUntil("#n-snippet-card")[6]).css("background-color","#dfd")
    var tyre_title = bt_link.closest(".snippet-card__row").siblings().find("span")
    $('<br><a class="button button-bt button_to_shop button_theme_action" href="https://www.best-tyres.ru/search?text_win=' + tyre_title.text().split('шины ').pop() + '" target=_blank>НА БТ </a>').insertAfter(tyre_title.parent())
})();