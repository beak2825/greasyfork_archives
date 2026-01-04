// ==UserScript==
// @name         Pinup.bet + Marsbet.com
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vytváří proklik do live url
// @author       MK
// @match        https://sport.pinup.bet/SportsBook/Upcoming?championshipId=*
// @match        https://sport.marsbet.com/SportsBook/Upcoming?championshipId=*
// @icon         https://crictips.com/wp-content/uploads/2022/12/Bet.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469066/Pinupbet%20%2B%20Marsbetcom.user.js
// @updateURL https://update.greasyfork.org/scripts/469066/Pinupbet%20%2B%20Marsbetcom.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
const check = document.querySelectorAll('.tg__match_item > div:nth-child(1) > a:nth-child(3)').length;
    if (check == 0) {
const link = document.location.href;
    let f1 = link.match(/.*Book\//);
    let f2 = link.match(/\?championshipId.*gameId=/);
const a = document.querySelectorAll('.tg__match_item');
    for (let i = 0; i < a.length; i++){
    let b = a[i].querySelector('div');
    let id = a[i].querySelector('div').getAttribute('id').match(/[0-9]+/);
const el = document.createElement("a");
    b.append(el)
        el.style.backgroundColor = '#ff0000';
        el.style.color = 'white';
    el.href = f1 + "GameDetails" + f2 + id;
    el.append("LIVE URL");}

}
    else {}}
    , 1000)();