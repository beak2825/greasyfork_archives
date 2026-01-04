// ==UserScript==
// @name         [HWM] Item sets for AP
// @namespace    https://greasyfork.org/en/users/242258
// @description  Finds cheapest item sets with given total AP
// @version      0.2
// @author       Alex_2oo8
// @match        https://daily.heroeswm.ru/n/dressroom_arts
// @downloadURL https://update.greasyfork.org/scripts/409459/%5BHWM%5D%20Item%20sets%20for%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/409459/%5BHWM%5D%20Item%20sets%20for%20AP.meta.js
// ==/UserScript==

/* global $ arts ch parview lvlp lvln getArtCost urlart pars urlimg */

var container = $("#tb-main-c .text");
container.append($("<hr>"));
container.append($("<br>"));

var controlDiv = $("<div class='set-controls'>Очки амуниции:</div>");
var controlAP = $("<input type='number' min='1' value='10' style='width: 3em;'>");
var controlCnt = $("<input type='number' min='1' value='10' style='width: 5em;'>");
var controlSz = $("<input type='number' min='1' max='9' value='9' style='width: 3em;'>");
var controlBtn = $("<button>Найти</button>");
controlBtn.click(function() { doit(controlAP.val(), controlSz.val(), controlCnt.val()); });

controlDiv.append(controlAP);
controlDiv.append(document.createTextNode("Максимальное количество артефактов:"));
controlDiv.append(controlSz);
controlDiv.append(document.createTextNode("Количество наборов:"));
controlDiv.append(controlCnt);
controlDiv.append(controlBtn);

container.append(controlDiv);
container.append($("<br>"));

$('<style type="text/css">.set-controls input, .set-controls button { margin: 0 1em 0 1em; padding: 0.2em 0.5em; } .set-results { width: 100%; text-align: center; } .set-results th { background-color: #C8C8C8; padding: 1em 0.2em; } .set-results td { padding: 0.3em; } .set-results tbody tr:nth-child(odd) { background: #ECF2F6; } .set-results tbody tr:nth-child(even) { background: #F5F3EA; } .set-results a img { margin: 0.2em; }</style>').appendTo('head');

function doit(ap, maxSz, cnt) {
    cnt *= 2; // sets with different rings will be counted twice

    var i, j, k, s;
    const itemCategories = 9, categoryOrder = { 6: [1], 8: [2], 4: [3], 2: [4], 7: [5], 5: [6], 3: [7], 1: [8, 9] };

    var items = new Array(itemCategories + 1);
    for (i = 1; i <= itemCategories; i++) {
        items[i] = [{ id: [], cost: 0, ap: 0 }];
    }

    for (i in arts) {
        if (categoryOrder.hasOwnProperty(arts[i].tp) && ((ch.g == 1 && arts[i].ta == 'g') || (ch.p == 1 && arts[i].ta == 'p') || (ch.o == 1 && arts[i].ta == 'o') || (ch.v == 1 && arts[i].ta == 'v') || (ch.s == 1 && arts[i].ta == 's') || (ch.r == 1 && arts[i].ta == 'r') || (ch.m == 1 && arts[i].ta == 'm')) && ch[arts[i].tp] == 1 && (arts[i].lv >= lvlp && arts[i].lv <= lvln)) {
            var cost = getItemCostPerBattle(i);

            if (cost == 0 || isNaN(cost)) continue;

            for (j in categoryOrder[arts[i].tp]) {
                items[categoryOrder[arts[i].tp][j]].push({ id: [i], cost: cost, ap: arts[i].oa });
            }
        }
    }

    var maxAPinCategory = [];
    for (i = 1; i <= itemCategories; i++) {
        var maxHere = 0;
        for (j in items[i]) {
            maxHere = Math.max(items[i][j].ap, maxHere);
        }

        maxAPinCategory.push(maxHere);
    }

    maxAPinCategory.sort();
    var maxAP = 0;
    for (i = 0; i < maxSz; i++) maxAP += maxAPinCategory[i];

    if (maxAP < ap) {
        alert("Используя только выбранные артефакты невозможно набрать " + ap + " ОА. Максимум: " + maxAP);

        return;
    }

    // dp[item_categories_processed][total_AP][item_count][set_number] = { min_cost, [ item_set ... ] }

    var dp = new Array(itemCategories + 1);
    for (i = 0; i <= itemCategories; i++) {
        dp[i] = new Array(maxAP + 1);
        for (j = 0; j <= maxAP; j++) {
            dp[i][j] = new Array(maxSz + 1);
            for (s = 0; s <= maxSz; s++) {
                dp[i][j][s] = new Array(cnt);
                for (k = 0; k < cnt; k++) {
                    dp[i][j][s][k] = { cost: Infinity, set: [] };
                }
            }
        }
    }

    dp[0][0][0][0].cost = 0;

    for (i = 1; i <= itemCategories; i++) {
        for (j = 0; j <= maxAP; j++) {
            for (s = 0; s <= maxSz; s++) {
                if (dp[i - 1][j][s][0].cost == Infinity) continue;

                for (k in items[i]) {
                    var newAP = j + items[i][k].ap, newSz = s + items[i][k].id.length;

                    if (newAP > maxAP || newSz > maxSz || dp[i - 1][j][s][0].cost + items[i][k].cost >= dp[i][newAP][newSz][cnt - 1].cost) continue;

                    var oldDP = dp[i][newAP][newSz].slice();

                    for (var p = 0, q = 0, r = 0; r < cnt; r++) {
                        var costP = dp[i - 1][j][s][p].cost + items[i][k].cost;
                        if (costP < oldDP[q].cost) {
                            dp[i][newAP][newSz][r] = { cost: costP, set: dp[i - 1][j][s][p].set.concat(items[i][k].id) };
                            p++;
                        }
                        else {
                            dp[i][newAP][newSz][r] = oldDP[q];
                            q++;
                        }
                    }
                }
            }
        }
    }

    var sets = [];
    for (j = ap; j <= maxAP; j++) {
        for (s = 1; s <= maxSz; s++) {
            for (k = 0; k < cnt; k++) {
                sets.push(dp[itemCategories][j][s][k]);
            }
        }
    }

    sets.sort(function(a, b) {
        if (a.cost == b.cost) return 0;
        return a.cost > b.cost ? 1 : -1;
    });

    cnt /= 2; // Restore the actual value

    clearResults();

    for (k = 0; k < cnt; k++) {
        if (sets[k].cost == Infinity) break;
        if (k > 0 && sameSets(sets[k].set, sets[k - 1].set)) {
            cnt++;
            continue;
        }

        showSet(sets[k].set);
    }
}

function sameSets(one, two) {
    if (one.length != two.length) return false;

    one = one.slice().sort();
    two = two.slice().sort();
    for (var i = 0; i < one.length; i++) {
        if (one[i] != two[i]) return false;
    }

    return true;
}

var resultTable = null;

function clearResults() {
    if (resultTable == null) {
        container.append($("<hr>"));
        container.append($("<br>"));

        var table = $("<table class='set-results'><thead><tr><th>#</th><th>Артефакты</th><th>ОА</th><th>Стоимость боя</th><th>Параметры</th></tr></thead></table>");
        resultTable = $("<tbody>");
        table.append(resultTable);
        container.append(table);
    }

    resultTable.empty();
}

function showSet(set) {
    var tr = $("<tr><td>" + (resultTable.children().length + 1) + "</td></tr>");
    var setTd = $("<td>");
    var ap = 0, cost = 0, par;
    var params = { };
    for (var i in set) {
        var id = set[i];

        ap += arts[id].oa;
        cost += getItemCostPerBattle(id);

        for (par in arts[id].p) {
            if (params.hasOwnProperty(par) == false) {
                params[par] = 0;
            }

            params[par] += arts[id].p[par];
        }

        var a = $("<a href='http://www.heroeswm.ru/art_info.php?id=" + (arts[id].tn ? arts[id].tn : id) + "' target='_blank'><img src='" + urlart + ((arts[id].ts && arts[id].ts != "") ? arts[id].ts + "/" : "") + arts[id].tf + (arts[id].png != 1 ? "_s.jpg" : ".png") + "' title='" + arts[id].tt + "'></a>");
        setTd.append(a);
    }

    var paramTd = $("<td>");
    for (par in pars) {
        if (params.hasOwnProperty(par) == false) continue;
        paramTd.append($("<img src='" + urlimg + pars[par].img + "' align='absmiddle' style='margin-left: 0.3em; width: 24px; height: 24px;' title='" + pars[par].c + "'>"));
        paramTd.append(document.createTextNode(params[par] + (pars[par].hasOwnProperty("t") ? (pars[par].t) : "")));
    }

    tr.append(setTd);
    tr.append($("<td>" + ap + "</td>"));
    tr.append($("<td><img align='absmiddle' width='24' height='24' src='https://dcdn3.heroeswm.ru/i/gold.gif' border='0' title='Золото' alt=''>" + Math.round(cost * 100) / 100 + "</td>"));
    tr.append(paramTd);

    resultTable.append(tr);
}

function getItemCostPerBattle(i) {
    var cost;
    if (arts[i].hasOwnProperty("cp")) {
        cost = arts[i].cp;
    }
    else {
        cost = getArtCost(i);
    }

    cost /= arts[i].st;

    return cost;
}
