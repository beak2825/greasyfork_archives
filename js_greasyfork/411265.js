// ==UserScript==
// @name         [HWM] Cost per battle calculator
// @namespace    https://greasyfork.org/en/users/242258
// @description  Adds cost per battle caluclator to item info page.
// @version      0.2
// @author       Alex_2oo8
// @match        https://www.heroeswm.ru/art_info.php*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/411265/%5BHWM%5D%20Cost%20per%20battle%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/411265/%5BHWM%5D%20Cost%20per%20battle%20calculator.meta.js
// ==/UserScript==

/* global $ */

$('<style type="text/css">.blacksmith-enabled .enable-link, .blacksmith-enabled .disabled-text, .blacksmith-disabled .disable-link { display: none; }</style>').appendTo('head');

let searchParams = new URLSearchParams(window.location.search);

var itemInfo = $(".wb");

var price = 1, durability = 1, repairPrice = -1;

var infoCells = $(".wblight", itemInfo);
for (var i = 0; i < infoCells.length; i++) {
    var children = infoCells[i].childNodes;
    for (var j = 0; j + 1 < children.length; j++) {
        if (children[j].tagName == "B") {
            if (children[j].innerText == "Стоимость:") {
                price = parsePrice(children[j + 1]);
            }
            else if (children[j].innerText == "Прочность:") {
                durability = parseInt(children[j + 1].textContent);
            }
            else if (children[j].innerText == "Стоимость ремонта:") {
                repairPrice = parsePrice(children[j + 1]);
            }
        }
    }
}

var blacksmithId = 0;
var blacksmithMap = { };

var optionId = 0;
var optionMap = { };

if (repairPrice != -1) {
    var calcTable = $('<table align="center" width="100%" border="0" cellspacing="0" cellpadding="8" class="wb" style="margin-top: 16px;"><tr><td class="wbwhite" colspan="2"><b>Калькулятор стоимости боя</b></td></tr><tr><td class="wblight" style="width: 320px"></td><td class="wblight" style="vertical-align: top;"></td></tr></table>');

    var controlPrice = $("<input type='number' min='1' value='" + price + "' style='width: 100px;'>");
    var controlBattl = $("<input type='number' min='1' max='99' value='" + durability + "' style='width: 45px;'>");
    var controlDurab = $("<input type='number' min='1' max='99' value='" + durability + "' style='width: 45px;'>");
    var calcBtn = $("<button>Рассчитать</button>");

    calcBtn.click(calc);
    controlBattl.change(function() { var bat = parseInt(controlBattl.val()); if (bat > parseInt(controlDurab.val())) controlDurab.val(bat); });
    controlDurab.change(function() { var dur = parseInt(controlDurab.val()); if (dur < parseInt(controlBattl.val())) controlBattl.val(dur); });

    var controlTable = $('<table cellspacing="8" style="width: 100%;">');
    var priceTr = $("<tr>");
    priceTr.append($("<td>Цена покупки артефакта:</td>"));
    priceTr.append($('<td style="width: 100px;">').append(controlPrice));
    controlTable.append(priceTr);

    var durabTr = $("<tr>");
    durabTr.append($("<td>Начальная прочность артефакта:</td>"));
    durabTr.append($("<td>").append(controlBattl).append($('<div style="display: inline-block; width: 10px; text-align: center;">/</div>')).append(controlDurab));
    controlTable.append(durabTr);

    controlTable.append('<tr><td colspan="2"></td></tr>');
    controlTable.append('<tr><td colspan="2">Доступные кузнецы:</td></tr>');

    var addBlacksmithTr = $("<tr>").append($('<td colspan="2" style="padding-left: 45px;">').append($('<a href="#">Добавить кузнеца</a></td>').click(function() { addBlacksmith(); })));
    controlTable.append(addBlacksmithTr);
    controlTable.append('<tr><td colspan="2"></td></tr>');
    controlTable.append($("<tr>").append($('<td colspan="2" style="text-align: center;">').append(calcBtn)));

    var saved = localStorage.getItem("CostPerBattle_blacksmith_list");
    if (saved === null) {
        addBlacksmith();
    }
    else {
        saved = JSON.parse(saved);
        for (var id in saved) {
            addBlacksmith(saved[id].efficiency, saved[id].price, saved[id].enabled);
        }
    }

    var artId = searchParams.get("id");
    var optionTable = $('<table cellspacing="8" style="width: 100%;">');
    optionTable.append('<tr><td>Сохраненные варианты:</td></tr>');
    optionTable.append('<tr><td></td></tr>');

    var addOptionTr = $('<tr><td></td></tr>');
    optionTable.append(addOptionTr);
    optionTable.append($("<tr>").append($('<td style="padding-left: 45px;">').append($('<a href="#">Добавить вариант</a></td>').click(function() { addOption(); }))));

    saved = localStorage.getItem("CostPerBattle_item_options_" + artId);
    if (saved !== null) {
        saved = JSON.parse(saved);
        for (var optId in saved) {
            addOption(saved[optId].price, saved[optId].battles, saved[optId].durability, saved[optId].note);
        }
    }

    var resultWrapper = $('<div style="display: none; position: relative; width: 100%; height: 100%;"></div>');
    var resultContainer = $("<div>");
    var closeResultBtn = $('<div style="position: absolute; right: -8px; top: -8px; border-left: 1px #5D413A solid; border-bottom: 1px #5D413A solid; width: 32px; height: 32px; text-align: center; line-height: 32px; font-size: 24px; cursor: pointer; user-select: none;">&#10799;</div>');
    closeResultBtn.click(function() { resultWrapper.css("display", "none"); optionTable.css("display", ""); });

    $(".wblight", calcTable).eq(0).append(controlTable);
    $(".wblight", calcTable).eq(1).append(optionTable);
    $(".wblight", calcTable).eq(1).append(resultWrapper.append(closeResultBtn).append(resultContainer));

    itemInfo.after(calcTable);
}

function save() {
    localStorage.setItem("CostPerBattle_blacksmith_list", JSON.stringify(blacksmithMap));
}

function addBlacksmith(eff, price, enabled) {
    var id = blacksmithId++;

    if (eff === undefined) eff = 90;
    if (price === undefined) price = 101;
    if (enabled === undefined) enabled = true;

    var priceInput = $('<input type="number" min="1" max="199" value="' + price + '" style="margin: 0 10px; width: 55px;">');
    var efficiencySelect = $('<select style="margin: 0 10px; width: 55px;">');
    for (var i = 1; i <= 9; i++) {
        var option = $('<option value="' + (i * 10) + '" ' + (i * 10 == eff ? "selected" : "") + '>' + (i * 10) + '%</option>');
        efficiencySelect.append(option);
    }

    blacksmithMap[id] = { efficiency: eff, price: price, enabled: enabled };
    save();

    priceInput.change(function() { blacksmithMap[id].price = parseInt(priceInput.val()); save(); });
    efficiencySelect.change(function() { blacksmithMap[id].efficiency = parseInt(efficiencySelect.val()); save(); });

    var tr = $('<tr class="blacksmith-' + (enabled ? "enabled" : "disabled") + '">');

    var removeLink = $('<a href="#" title="Удалить" style="margin: 0 10px;">(x)</a>');
    removeLink.click(function() { delete blacksmithMap[id]; tr.remove(); save(); });

    var disableLink = $('<a href="#" title="Исключить из расчета" class="disable-link">(-)</a>');
    disableLink.click(function() { blacksmithMap[id].enabled = false; tr.toggleClass("blacksmith-enabled blacksmith-disabled"); save(); });

    var enableLink = $('<a href="#" title="Включить в расчет" class="enable-link">(+)</a>');
    enableLink.click(function() { blacksmithMap[id].enabled = true; tr.toggleClass("blacksmith-enabled blacksmith-disabled"); save(); });

    var td = $('<td colspan="2">на</td>');
    td.append(efficiencySelect);
    td.append(document.createTextNode("за"));
    td.append(priceInput);
    td.append(disableLink);
    td.append(enableLink);
    td.append(removeLink);
    td.append($('<span class="disabled-text">[Исключен]</span>'));
    addBlacksmithTr.before(tr.append(td));
}

function saveOptions() {
    localStorage.setItem("CostPerBattle_item_options_" + artId, JSON.stringify(optionMap));
}

function addOption(price, battles, durability, note) {
    var id = optionId++;

    if (price === undefined) price = parseInt(controlPrice.val());
    if (battles === undefined) battles = parseInt(controlBattl.val());
    if (durability === undefined) durability = parseInt(controlDurab.val());
    if (note === undefined) note = "";

    var priceInput = $("<input type='number' min='1' value='" + price + "' style='width: 100px; margin: 0 10px;'>");
    var battlInput = $("<input type='number' min='1' max='99' value='" + battles + "' style='width: 45px; margin-left: 10px;'>");
    var durabInput = $("<input type='number' min='1' max='99' value='" + durability + "' style='width: 45px;'>");
    var notesInput = $("<input type='text' value='" + note + "' placeholder='Заметка' style='width: 79px; margin: 0 10px;'>");

    optionMap[id] = { price: price, battles: battles, durability: durability, note: note };
    saveOptions();

    priceInput.change(function() { optionMap[id].price = parseInt(priceInput.val()); saveOptions(); });
    battlInput.change(function() { optionMap[id].battles = parseInt(battlInput.val()); saveOptions(); });
    durabInput.change(function() { optionMap[id].durability = parseInt(durabInput.val()); saveOptions(); });
    notesInput.change(function() { optionMap[id].note = parseInt(notesInput.val()); saveOptions(); });

    battlInput.change(function() { var bat = parseInt(battlInput.val()); if (bat > parseInt(durabInput.val())) { durabInput.val(bat); durabInput.change(); } });
    durabInput.change(function() { var dur = parseInt(durabInput.val()); if (dur < parseInt(battlInput.val())) { battlInput.val(dur); battlInput.change(); } });

    var tr = $('<tr>');

    var removeLink = $('<a href="#" title="Удалить" style="margin: 0 10px;">(x)</a>');
    removeLink.click(function() { delete optionMap[id]; tr.remove(); saveOptions(); });

    var applyLink = $('<a href="#">Использовать</a>');
    applyLink.click(function() {
        controlPrice.val(priceInput.val());
        controlBattl.val(battlInput.val());
        controlDurab.val(durabInput.val());

        controlPrice.change();
        controlBattl.change();
        controlDurab.change();
    });

    var td = $('<td>Цена:</td>');
    td.append(priceInput);
    td.append(document.createTextNode("Прочность:"));
    td.append(battlInput);
    td.append($('<div style="display: inline-block; width: 10px; text-align: center;">/</div>'));
    td.append(durabInput);
    td.append(notesInput);
    td.append(applyLink);
    td.append(removeLink);
    addOptionTr.before(tr.append(td));
}

function solve(P) {
    var dur = parseInt(controlDurab.val());
    var opt = [], optCost = [], totalBattles = parseInt(controlBattl.val());
    var S = totalBattles * P - parseInt(controlPrice.val());
    while (dur > 1) {
        var best = -1, bestEff, bestBattles, bestCost;
        for (var id in blacksmithMap) {
            if (blacksmithMap[id].enabled == false) continue;

            var eff = blacksmithMap[id].efficiency;
            var battles = Math.max(Math.floor(dur * eff / 100), 1);
            var cost = Math.ceil(repairPrice * blacksmithMap[id].price / 100);
            cost = Math.ceil(cost * 1.01);

            var here = battles * P - cost;
            if (here > best) {
                best = here;
                bestEff = eff;
                bestBattles = battles;
                bestCost = cost;
            }
        }

        if (best < 0) break;

        S += best;
        opt.push(bestEff);
        optCost.push(bestCost);
        totalBattles += bestBattles;

        dur--;
    }

    return { ok: S > 0, opt: opt, optCost: optCost, battles: totalBattles };
}

function calc() {
    var L = 0, R = 1e6;
    for (var it = 0; it < 100; it++) {
        var C = (L + R) / 2;
        var res = solve(C);
        if (res.ok) R = C;
        else L = C;
    }

    var best = solve(R), dur = parseInt(controlDurab.val());

    var resultTable = $('<table cellspacing="8">');
    resultTable.append($("<tr>").append("<td>Цена за бой:</td>").append($("<td>" + (Math.round(R * 100) / 100) + "</td>")));
    resultTable.append($("<tr>").append("<td>Всего боев:</td>").append($("<td>" + best.battles + "</td>")));
    resultTable.append($("<tr>").append("<td>Конечная прочность:</td>").append($("<td>0/" + (dur - best.opt.length) + "</td>")));

    resultContainer.empty();
    resultContainer.append(resultTable);

    for (var i = 0, j, totalBattles = dur, totalPrice = parseInt(controlPrice.val()); i < best.opt.length; i = j) {
        for (j = i; j < best.opt.length && best.opt[j] == best.opt[i]; j++) {
            var battles = Math.max(Math.floor((dur - j) * best.opt[i] / 100), 1);
            totalBattles += battles;
            totalPrice += best.optCost[j];
        }

        resultContainer.append($("<p>С прочностью от 0/" + (dur - i) + " до " + battles + "/" + (dur - j) + " чинить на " + best.opt[i] + "%. Общее число боев: " + totalBattles + ". Средняя цена за бой: " + (Math.round(totalPrice / totalBattles * 100) / 100) + ".</p>"));
    }

    resultWrapper.css("display", "");
    optionTable.css("display", "none");
}

function parsePrice(container) {
    var resources = $("td", "#top_res_table");
    var resourcePrice = [1, 180, 180, 360, 360, 360, 360];

    var cells = $("td", container), price = 0;
    for (var i = 0, j = 0; i + 1 < cells.length; i += 2) {
        while ($("img", cells[i])[0].src != $("img", resources[2 * j])[0].src) j++;

        var count = parseInt(cells[i + 1].innerText.replace(",", ""));
        price += count * resourcePrice[j];
    }

    return price;
}
