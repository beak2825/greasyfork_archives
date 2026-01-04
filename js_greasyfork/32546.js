// ==UserScript==
// @name         create midpoint price
// @namespace    https://www.betfair.com/exchange
// @version      1.5
// @description  Create the midpoint price
// @author       angelo.ndira@gmail.com
// @match        https://www.betfair.com/exchange/plus/*/market/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/32546/create%20midpoint%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/32546/create%20midpoint%20price.meta.js
// ==/UserScript==
var repeatExecutionInterval = 10000;
var pageReloadInterval = 480000;
var smallBolt = "<svg class=\"octicon octicon-zap\" viewBox=\"0 0 10 16\" version=\"1.1\" width=\"10\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M10 7H6l3-7-9 9h4l-3 7z\"></path></svg>";
var tickdata = {
    1000.00: 10.00,
    999.99: 10.00,
    100.00: 10.00,
    99.99: 5.00,
    50.00: 5.00,
    49.99: 2.00,
    30.00: 2.00,
    29.99: 1.00,
    20.00: 1.00,
    19.99: 0.50,
    10.00: 0.50,
    9.99: 0.20,
    6.00: 0.20,
    5.99: 0.10,
    4.00: 0.10,
    3.99: 0.05,
    3.00: 0.05,
    2.99: 0.02,
    2.00: 0.02,
    1.99: 0.01,
    0.00: 0.01
};
function ticksizeRound(unrounded) {
    'use strict';
    var unroundedFloat = parseFloat(unrounded);
    if (unroundedFloat > 1000) {
        return 1000;
    }
    if (unroundedFloat < 1.01) {
        return 1.01;
    }
    var ticksize;
    $.each(tickdata, function (key, value) {
        if (unroundedFloat < key) {
            ticksize = value;
        }
    });
    if (typeof (ticksize) === 'undefined') {
        return unrounded;
    }
    return Math.round(unroundedFloat / ticksize) * ticksize;
}
function readPriceAndSize(rowNode, marketDataSnapshot) {
    'use strict';
    var selection = {};
    selection.pnl = 0;
    rowNode.find('td.bet-buttons.back-cell.last-back-cell > button.back.mv-bet-button.back-button.back-selection-button').each(function () {
        var buttonNode = $(this);
        selection.backPrice = parseFloat(buttonNode.attr("price"));
        selection.backSize = parseFloat(buttonNode.attr("size").replace(",", "").substring(1));
    });
    rowNode.find('td.bet-buttons.lay-cell.first-lay-cell > button.lay.mv-bet-button.lay-button.lay-selection-button').each(function () {
        var buttonNode = $(this);
        selection.layPrice = parseFloat(buttonNode.attr("price"));
        selection.laySize = parseFloat(buttonNode.attr("size").replace(",", "").substring(1));
    });
    rowNode.find('div.runner-elem-pnl.actual-pnl > span.pnl-value-container > span.pnl-value.negative').each(function () {
        var spanNode = $(this);
        selection.pnl = parseFloat("-" + spanNode.text().replace(",", "").substring(2));
    });
    rowNode.find('div.runner-elem-pnl.actual-pnl > span.pnl-value-container > span.pnl-value.positive').each(function () {
        var spanNode = $(this);
        selection.pnl = parseFloat(spanNode.text().replace(",", "").substring(1));
    });
    if (typeof (selection.backPrice) === 'undefined') {
        return;
    }
    if (typeof (selection.backSize) === 'undefined') {
        return;
    }
    if (typeof (selection.layPrice) === 'undefined') {
        return;
    }
    if (typeof (selection.laySize) === 'undefined') {
        return;
    }
    if (selection.backSize === 0) {
        selection.backPrice = 1.01;
        selection.backSize = 100;
    }
    if (selection.laySize === 0) {
        selection.layPrice = 1000;
        selection.laySize = 100;
    }
    selection.backValue = +(selection.backPrice * selection.backSize).toFixed(6);
    selection.layValue = +(selection.layPrice * selection.laySize).toFixed(6);
    selection.totalValue = +(selection.backValue + selection.layValue).toFixed(6);
    selection.layPriceDiff = +(selection.layPrice - selection.backPrice).toFixed(6);
    selection.layValuePercent = +(selection.layValue / selection.totalValue).toFixed(6);
    selection.midPrice = +(ticksizeRound(selection.layPrice - (selection.layValuePercent * selection.layPriceDiff))).toFixed(6);
    selection.midSize = +((selection.totalValue / 2) / selection.midPrice).toFixed(0);
    //selection.backValuePercent = +(selection.backValue/selection.totalValue).toFixed(6);
    //selection.layValuePercent = +(selection.layValue/selection.totalValue).toFixed(6);
    //selection.diffValue =  selection.layValue - selection.backValue;
    //selection.backValueOffset = +(selection.backValuePercent * selection.diffValue).toFixed(6);
    //selection.layValueOffset = +(selection.layValuePercent * selection.diffValue).toFixed(6);
    //selection.midValue = selection.backValue + selection.backValueOffset;
    //selection.backSizePortion = +(selection.layValuePercent * selection.backSize).toFixed(6);
    //selection.laySizePortion = +(selection.backValuePercent * selection.laySize).toFixed(6);
    //selection.midSize = +(selection.backSizePortion + selection.laySizePortion).toFixed(0);
    //selection.midPrice = +(ticksizeRound(selection.midValue / selection.midSize)).toFixed(6);
    selection.probability = +(1 / selection.midPrice).toFixed(6);
    rowNode.find('td.bet-buttons.back-cell.last-back-cell').each(function () {
        var tdNode = $(this);
        selection.selectionId = parseInt(tdNode.attr("bet-selection-id"));
    });
    marketDataSnapshot.totalProbability += selection.probability;
    marketDataSnapshot.runners.push(selection);
    console.log(JSON.stringify(selection, null, 4));
}
function readMarketDataSnapshot(rowNode, marketDataSnapshot) {
    'use strict';
    readPriceAndSize(rowNode, marketDataSnapshot);
    return marketDataSnapshot;
}
function insertOrReplaceHtml(newHtml, rowNode, jquerySelector, jquerySiblingSelector) {
    'use strict';
    var done = false;
    rowNode.find(jquerySelector).each(function () {
        if (done) {
            return;
        }
        var tdNode = $(this);
        tdNode.replaceWith(newHtml);
        done = true;
    });
    rowNode.find(jquerySiblingSelector).each(function () {
        if (done) {
            return;
        }
        var tdNode = $(this);
        tdNode.after(newHtml);
        done = true;
    });
}
function createMidPriceHtml(selectedRunner, iconMarker) {
    'use strict';
    var newHtml = "" +
        "<td id=\"charlieparkerstraat_midpoint\" class=\"bet-buttons\" bet-selection-id=\"" + selectedRunner.selectionId + "\">" +
        "<button class=\"mv-bet-button\" price=\"" + selectedRunner.adjustedMidPrice + "\" size=\"" + selectedRunner.midSize + "\">" +
        "<div class=\"mv-bet-button-info\">";
    if (selectedRunner.adjustedMidPrice < 1.2) {
        newHtml += "<span class=\"bet-button-price\">" + selectedRunner.adjustedMidPrice + " " + iconMarker + "</span>";
    } else {
        newHtml += "<span class=\"bet-button-price\">" + selectedRunner.adjustedMidPrice + "</span>";
    }
    newHtml +=
        "<span class=\"bet-button-size\">" + selectedRunner.midSize + "</span>" +
        "</div>" +
        "</button>" +
        "</td>";
    return newHtml;
}
function createMidPriceColumn(rowNode, marketDataSnapshot) {
    'use strict';
    var selectionId;
    var selectedRunner;
    rowNode.find('td.bet-buttons.back-cell.last-back-cell').each(function () {
        var tdNode = $(this);
        selectionId = parseInt(tdNode.attr("bet-selection-id"));
    });
    $.each(marketDataSnapshot.runners, function (index, runner) {
        if (runner.selectionId === selectionId) {
            selectedRunner = runner;
        }
    });
    var newHtml = createMidPriceHtml(selectedRunner, smallBolt);
    var jquerySelector = 'td#charlieparkerstraat_midpoint';
    var jquerySiblingSelector = 'td.bet-buttons.back-cell.last-back-cell';
    insertOrReplaceHtml(newHtml, rowNode, jquerySelector, jquerySiblingSelector);
    return marketDataSnapshot;
}
function adjustProbability(marketDataSnapshot) {
    'use strict';
    $.each(marketDataSnapshot.runners, function (index, runner) {
        runner.adjustedProbability = +(runner.probability / marketDataSnapshot.totalProbability).toFixed(6);
        runner.adjustedMidPrice = +(ticksizeRound(1 / runner.adjustedProbability)).toFixed(2);
    });
}
function enforceLowerBound(lowerBound, number) {
    'use strict';
    if (number < lowerBound) {
        return lowerBound;
    }
    return number;
}
function display(newHtml, jquerySelector, jquerySiblingSelector, runner) {
    'use strict';
    var done = false;
    $(document).find('table.mv-runner-list > tbody > tr.runner-line').each(function () {
        var rowNode = $(this);
        var selectionId;
        rowNode.find('td.bet-buttons.back-cell.last-back-cell').each(function () {
            var tdNode = $(this);
            selectionId = parseInt(tdNode.attr("bet-selection-id"));
        });
        if (done) {
            return;
        }
        if (runner.selectionId === selectionId) {
            insertOrReplaceHtml(newHtml, rowNode, jquerySelector, jquerySiblingSelector);
            done = true;
        }
    });
}
function spacePad(num, places) {
    var spaces = places - num.toString().length + 1;
    return Array(+(spaces > 0 && spaces)).join(" ") + num;
}
function getCashoutByLaying(fraction, smallestProfit, impliedPrice, impliedSize) {
    var theoCashoutProfit = +(fraction * smallestProfit).toFixed(6);
    var theoSize = +(impliedSize + theoCashoutProfit).toFixed(6);
    var cashoutLayPrice = +(ticksizeRound((impliedSize / theoSize) * impliedPrice)).toFixed(2);
    var cashoutLaySize = +((impliedPrice / cashoutLayPrice) * impliedSize).toFixed(2);
    var cashoutLaySizeAdjusted = +(enforceLowerBound(2, cashoutLaySize)).toFixed(6);
    if (cashoutLaySizeAdjusted !== cashoutLaySize) {
        cashoutLayPrice = +(ticksizeRound((impliedSize / cashoutLaySizeAdjusted) * impliedPrice)).toFixed(2);
        cashoutLaySize = cashoutLaySizeAdjusted;
    }
    var cashoutByLaying = {};
    cashoutByLaying.layPrice = cashoutLayPrice;
    cashoutByLaying.laySize = cashoutLaySize;
    return cashoutByLaying;
}
function getCashoutByBacking(fraction, smallestProfit, impliedPrice, impliedSize) {
    var theoCashoutProfit = +(fraction * smallestProfit).toFixed(6);
    var theoSize = +(enforceLowerBound(2, smallestProfit - theoCashoutProfit)).toFixed(6);
    var cashoutBackPrice = +(ticksizeRound((impliedSize / theoSize) * impliedPrice)).toFixed(2);
    var cashoutBackSize = +((impliedPrice / cashoutBackPrice) * impliedSize).toFixed(2);
    var cashoutBackSizeAdjusted = +(enforceLowerBound(2, cashoutBackSize)).toFixed(6);
    if (cashoutBackSizeAdjusted !== cashoutBackSize) {
        cashoutBackPrice = +(ticksizeRound((impliedSize / cashoutBackSizeAdjusted) * impliedPrice)).toFixed(2);
        cashoutBackSize = cashoutBackSizeAdjusted;
    }
    var cashoutByBacking = {};
    cashoutByBacking.backPrice = cashoutBackPrice;
    cashoutByBacking.backSize = cashoutBackSize;
    return cashoutByBacking;
}
function calcAndDisplayLayCashout(largestLiabilityRunner, smallestProfitRunner) {
    'use strict';
    var largestLiability = largestLiabilityRunner.pnl;
    var smallestProfit = smallestProfitRunner.pnl;
    var impliedPrice = +((smallestProfit / Math.abs(largestLiability)) + 1).toFixed(6);
    var impliedSize = Math.abs(largestLiability);
    var cashout000 = getCashoutByLaying(0.0, smallestProfit, impliedPrice, impliedSize);
    var cashout015 = getCashoutByLaying(0.15, smallestProfit, impliedPrice, impliedSize);
    var cashout030 = getCashoutByLaying(0.3, smallestProfit, impliedPrice, impliedSize);
    var cashout060 = getCashoutByLaying(0.6, smallestProfit, impliedPrice, impliedSize);
    var cashout100 = getCashoutByLaying(1.0, smallestProfit, impliedPrice, impliedSize);
    var newHtml = "" +
        "<div id=\"cashout-local-suggestions-030-060-100\">" +
        "<br>" +
        "<br>" +
        "<div><pre>New Bet   " + spacePad("Price", 7) + " X " + spacePad("Size", 7) + "</pre></div>" +
        "<div><pre>Lay   0%  " + spacePad((cashout000.layPrice).toFixed(2), 7) + " X " + spacePad((cashout000.laySize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Lay  15%  " + spacePad((cashout015.layPrice).toFixed(2), 7) + " X " + spacePad((cashout015.laySize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Lay  30%  " + spacePad((cashout030.layPrice).toFixed(2), 7) + " X " + spacePad((cashout030.laySize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Lay  60%  " + spacePad((cashout060.layPrice).toFixed(2), 7) + " X " + spacePad((cashout060.laySize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Lay 100%  " + spacePad((cashout100.layPrice).toFixed(2), 7) + " X " + spacePad((cashout100.laySize).toFixed(2), 7) + "</pre></div>" +
        "</div>";
    var jquerySelector = 'div#cashout-local-suggestions-030-060-100';
    var jquerySiblingSelector = 'td.new-runner-info > div.runner-info-container > div.pnl.runner-info-elem';
    display(newHtml, jquerySelector, jquerySiblingSelector, smallestProfitRunner);
}
function calcAndDisplayBackCashout(largestLiabilityRunner, smallestProfitRunner) {
    'use strict';
    var largestLiability = largestLiabilityRunner.pnl;
    var smallestProfit = smallestProfitRunner.pnl;
    var impliedBackPrice = +((smallestProfit / Math.abs(largestLiability)) + 1).toFixed(6);
    var impliedPrice = +((1 / (impliedBackPrice - 1)) + 1).toFixed(6);
    var impliedSize = smallestProfit;
    var cashout000 = getCashoutByBacking(0.0, smallestProfit, impliedPrice, impliedSize);
    var cashout015 = getCashoutByBacking(0.15, smallestProfit, impliedPrice, impliedSize);
    var cashout030 = getCashoutByBacking(0.3, smallestProfit, impliedPrice, impliedSize);
    var cashout060 = getCashoutByBacking(0.6, smallestProfit, impliedPrice, impliedSize);
    var cashout100 = getCashoutByBacking(1.0, smallestProfit, impliedPrice, impliedSize);
    var newHtml = "" +
        "<div id=\"cashout-local-suggestions-030-060-100\">" +
        "<br>" +
        "<br>" +
        "<div><pre>New Bet   " + spacePad("Price", 7) + " X " + spacePad("Size", 7) + "</pre></div>" +
        "<div><pre>Back   0% " + spacePad((cashout000.backPrice).toFixed(2), 7) + " X " + spacePad((cashout000.backSize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Back  15% " + spacePad((cashout015.backPrice).toFixed(2), 7) + " X " + spacePad((cashout015.backSize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Back  30% " + spacePad((cashout030.backPrice).toFixed(2), 7) + " X " + spacePad((cashout030.backSize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Back  60% " + spacePad((cashout060.backPrice).toFixed(2), 7) + " X " + spacePad((cashout060.backSize).toFixed(2), 7) + "</pre></div>" +
        "<div><pre>Back 100% " + spacePad((cashout100.backPrice).toFixed(2), 7) + " X " + spacePad((cashout100.backSize).toFixed(2), 7) + "</pre></div>" +
        "</div>";
    var jquerySelector = 'div#cashout-local-suggestions-030-060-100';
    var jquerySiblingSelector = 'td.new-runner-info > div.runner-info-container > div.pnl.runner-info-elem';
    display(newHtml, jquerySelector, jquerySiblingSelector, largestLiabilityRunner);
}
function getLargestLiabilityRunner(marketDataSnapshot) {
    'use strict';
    var largestLiabilityRunner;
    var largestLiability = 0;
    $.each(marketDataSnapshot.runners, function (index, runner) {
        if (runner.pnl < 0 && runner.pnl < largestLiability) {
            largestLiability = runner.pnl;
            largestLiabilityRunner = runner;
        }
    });
    return largestLiabilityRunner;
}
function getSmallestProfitRunner(marketDataSnapshot) {
    'use strict';
    var smallestProfitRunner;
    var smallestProfit = 0;
    $.each(marketDataSnapshot.runners, function (index, runner) {
        if (runner.pnl > 0 && runner.pnl > smallestProfit) {
            smallestProfit = runner.pnl;
            smallestProfitRunner = runner;
        }
    });
    return smallestProfitRunner;
}
function suggestLocalCashout(marketDataSnapshot) {
    'use strict';
    var largestLiabilityRunner = getLargestLiabilityRunner(marketDataSnapshot);
    var smallestProfitRunner = getSmallestProfitRunner(marketDataSnapshot);
    if (typeof (largestLiabilityRunner) === 'undefined') {
        return;
    }
    if (typeof (smallestProfitRunner) === 'undefined') {
        return;
    }
    calcAndDisplayLayCashout(largestLiabilityRunner, smallestProfitRunner);
    calcAndDisplayBackCashout(largestLiabilityRunner, smallestProfitRunner);
}
function adjustHeadingPosition() {
    'use strict';
    $(document).find('tr.rh-line.without-lay > th.rh-select-all-buttons.rh-select-back-all-button > button.rh-back-all').each(function () {
        var buttonNode = $(this);
        try {
            buttonNode.css('marginRight', '91px');
        } catch (ex) {
            console.log("error occurred while adjusting heading position. " + ex);
        }
    });
}
function addMidPriceColumn(marketDataSnapshot) {
    'use strict';
    $(document).find('table.mv-runner-list > tbody > tr.runner-line').each(function () {
        var rowNode = $(this);
        createMidPriceColumn(rowNode, marketDataSnapshot);
    });
}
function repeatedExecution(elapsedTimeMillis) {
    'use strict';
    if (elapsedTimeMillis > pageReloadInterval) {
        window.location.reload(false);
        return;
    }
    var marketDataSnapshot = {};
    marketDataSnapshot.runners = [];
    marketDataSnapshot.totalProbability = 0;
    $(document).find('table.mv-runner-list > tbody > tr.runner-line').each(function () {
        var rowNode = $(this);
        readMarketDataSnapshot(rowNode, marketDataSnapshot);
    });
    adjustProbability(marketDataSnapshot);
    //console.log(JSON.stringify(marketDataSnapshot, null, 4));
    adjustHeadingPosition();
    addMidPriceColumn(marketDataSnapshot);
    suggestLocalCashout(marketDataSnapshot);
    elapsedTimeMillis += repeatExecutionInterval;
    setTimeout(repeatedExecution, repeatExecutionInterval, elapsedTimeMillis);
}
function start() {
    'use strict';
    var elapsedTimeMillis = 0;
    setTimeout(repeatedExecution, 0, elapsedTimeMillis);
}
(function () {
    'use strict';
    console.log("document loaded(). Midpoint creation will start in 10 seconds");
    setTimeout(start, 10000);
})();