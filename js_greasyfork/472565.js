// ==UserScript==
// @name           smithHelperModified
// @author         omne
// @namespace      nexterot
// @homepage       https://greasyfork.org/ru/scripts/472565-smithhelpermodified
// @description    Помощь кузнецу
// @version        0.4
// @include        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/inventory.php/
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/472565/smithHelperModified.user.js
// @updateURL https://update.greasyfork.org/scripts/472565/smithHelperModified.meta.js
// ==/UserScript==

(function() {
    if (/inventory/.test(location.href)) {
        let transfers = document.querySelectorAll(".inv_request_info");
        for (let i = 0; i < transfers.length; i++) {
            if (transfers[i].innerHTML.indexOf("ремонт") > 0) {
                let art_id = transfers[i].innerHTML.match(/art_info.php.id=([^\"]+)/)[1];
                let gold = Number(transfers[i].querySelectorAll("b")[1].innerHTML.replace(",", ""));
                let perc = Number(transfers[i].innerHTML.match(/\(([0-9]+)%\)/)[1]);
                let percColor = perc < 102 ? 'red' : 'green';
                let warning = '<p style="color:' + percColor + '; font-weight:bold; font-size:1.2em; ">ВНИМАНИЕ!  ' + perc + '%</p>';
                let repair_cost = Math.round(gold/perc*100);
                let repair_score = (repair_cost/4000).toFixed(2);
                let date = new Date(Date.now() + Math.round(repair_cost/4*60*60));
                let profit = gold - repair_cost;
                let divs = transfers[i].querySelectorAll("div");
                for (let j = 0; j < divs.length; j++) {
                    if (divs[j].innerHTML.indexOf("Прочноcть:") >= 0) {
                        divs[j].innerHTML += "<BR>+<B>" + repair_score + "</b> ГК, до <b>" + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes():date.getMinutes())
                            + "</b>, прибыль <b style = 'color:" + (profit >= 0 ? "green":"red") + "'>" + profit + "</b>" + warning;
                    }
                }
            }
        }
    }
})();