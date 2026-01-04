// ==UserScript==
// @name         removes footbal matches
// @namespace    https://www.betfair.com/exchange/plus/football
// @version      1.0
// @description  excludes/removes footbal matches
// @author       angelo.ndira@gmail.com
// @match        https://www.betfair.com/exchange/plus/football
// @match        https://www.betfair.com/exchange/plus/football?*
// @match        https://www.betfair.com/exchange/plus/football/today
// @match        https://www.betfair.com/exchange/plus/football/inplay
// @match        https://www.betfair.com/exchange/plus/football/today?*
// @match        https://www.betfair.com/exchange/plus/en/football-betting-1
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/32465/removes%20footbal%20matches.user.js
// @updateURL https://update.greasyfork.org/scripts/32465/removes%20footbal%20matches.meta.js
// ==/UserScript==
/*global window jQuery $ console*/
function getMinimumInt(minimumValue, maximumValue, prompMsg) {
    'use strict';
    var value = prompt(prompMsg, minimumValue);
    if (typeof (value) === 'undefined' || value === null) {
        value = minimumValue;
    }
    value = parseInt(value);
    if (value < minimumValue || maximumValue < value) {
        value = minimumValue;
    }
    return value;
}
function getMaximumInt(minimumValue, maximumValue, prompMsg) {
    'use strict';
    var value = prompt(prompMsg, maximumValue);
    if (typeof (value) === 'undefined' || value === null) {
        value = maximumValue;
    }
    value = parseInt(value);
    if (value < minimumValue || maximumValue < value) {
        value = maximumValue;
    }
    return value;
}
function getMinimumFloat(minimumValue, maximumValue, prompMsg) {
    'use strict';
    var value = prompt(prompMsg, minimumValue);
    if (typeof (value) === 'undefined' || value === null) {
        value = minimumValue;
    }
    value = parseFloat(value);
    if (value < minimumValue || maximumValue < value) {
        value = minimumValue;
    }
    return value;
}
function getMaximumFloat(minimumValue, maximumValue, prompMsg) {
    'use strict';
    var value = prompt(prompMsg, maximumValue);
    if (typeof (value) === 'undefined' || value === null) {
        value = maximumValue;
    }
    value = parseFloat(value);
    if (value < minimumValue || maximumValue < value) {
        value = maximumValue;
    }
    return value;
}
function isValidSnapshot(marketDataSnapshot) {
    'use strict';
    if (typeof (marketDataSnapshot.timeInPlay) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.home) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.draw) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.away) === 'undefined') {
        return false;
    }
    return true;
}
function readTimeInPlay(rowNode, marketDataSnapshot) {
    'use strict';
    rowNode.find('div.middle-label').each(function () {
        var divNode = $(this);
        marketDataSnapshot.timeInPlay = divNode.text().replace("'", "");
    });
}
function readPriceAndSize(rowNode, marketDataSnapshot) {
    'use strict';
    rowNode.find('td.coupon-runners > div.coupon-runner').each(function () {
        var divNode = $(this);
        var selection = {};
        divNode.find('button.bf-bet-button.back-button.back-selection-button').each(function () {
            var buttonNode = $(this);
            selection.backPrice = parseFloat(buttonNode.attr("price"));
            selection.backSize = parseFloat(buttonNode.attr("size").replace(",", "").substring(1));
        });
        divNode.find('button.bf-bet-button.lay-button.lay-selection-button').each(function () {
            var buttonNode = $(this);
            selection.layPrice = parseFloat(buttonNode.attr("price"));
            selection.laySize = parseFloat(buttonNode.attr("size").replace(",", "").substring(1));
        });
        if (typeof (marketDataSnapshot.home) === 'undefined') {
            marketDataSnapshot.home = selection;
        } else if (typeof (marketDataSnapshot.draw) === 'undefined') {
            marketDataSnapshot.draw = selection;
        } else if (typeof (marketDataSnapshot.away) === 'undefined') {
            marketDataSnapshot.away = selection;
        }
    });
}
function readTeamNames(rowNode, marketDataSnapshot) {
    'use strict';
    rowNode.find('section.mod-event-line > ul.runners > li').each(function () {
        var liNode = $(this);
        try {
            if (typeof (marketDataSnapshot.home.name) === 'undefined') {
                marketDataSnapshot.home.name = liNode.text();
            } else if (typeof (marketDataSnapshot.away.name) === 'undefined') {
                marketDataSnapshot.away.name = liNode.text();
            }
        } catch (ex) {
            console.log("error occurred while reading team name. liNode.text(): " + liNode.text() + ". " + ex);
        }
    });
}
function readMatchedAmount(rowNode, marketDataSnapshot) {
    'use strict';
    rowNode.find('section.mod-event-line > ul.matched-amount > li.matched-amount-value').each(function () {
        var liNode = $(this);
        marketDataSnapshot.matchedAmount = parseFloat(liNode.text().replace(",", "").substring(1));
    });
}
function readHomeTeamScore(rowNode, marketDataSnapshot) {
    'use strict';
    rowNode.find('div.scores > span.home').each(function () {
        var spanNode = $(this);
        if (typeof (spanNode.text()) !== 'undefined') {
            try {
                marketDataSnapshot.home.score = parseInt(spanNode.text());
            } catch (ex) {
                console.log("error occurred while read home team score. spanNode.text(): " + spanNode.text());
            }
        }
    });
}
function readAwayTeamScore(rowNode, marketDataSnapshot) {
    'use strict';
    rowNode.find('div.scores > span.away').each(function () {
        var spanNode = $(this);
        if (typeof (spanNode.text()) !== 'undefined') {
            try {
                marketDataSnapshot.away.score = parseInt(spanNode.text());
            } catch (ex) {
                console.log("error occurred while read away team score. spanNode.text(): " + spanNode.text());
            }
        }
    });
}
function readMarketDataSnapshot(rowNode) {
    'use strict';
    var marketDataSnapshot = {};
    readTimeInPlay(rowNode, marketDataSnapshot);
    readPriceAndSize(rowNode, marketDataSnapshot);
    readTeamNames(rowNode, marketDataSnapshot);
    readMatchedAmount(rowNode, marketDataSnapshot);
    readHomeTeamScore(rowNode, marketDataSnapshot);
    readAwayTeamScore(rowNode, marketDataSnapshot);
    //console.log(JSON.stringify(marketDataSnapshot, null, 4));
    return marketDataSnapshot;
}
function checkTimeInPlayAndRemove(marketDataSnapshot, rowNode, minimumValue, maximumValue) {
    'use strict';
    if (typeof (marketDataSnapshot.timeInPlay) === 'undefined') {
        return false;
    }
    if (marketDataSnapshot.timeInPlay === "END") {
        console.log('checkTimeInPlayAndRemove. Match ENDED. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + marketDataSnapshot.timeInPlay);
        rowNode.remove();
        return true;
    }
    if (marketDataSnapshot.timeInPlay === "FT") {
        console.log('checkTimeInPlayAndRemove. Match FullTime. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + marketDataSnapshot.timeInPlay);
        rowNode.remove();
        return true;
    }
    if (marketDataSnapshot.timeInPlay === "HT" && (minimumValue > 45 || maximumValue < 45)) {
        console.log('checkTimeInPlayAndRemove. Match HalfTime. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + marketDataSnapshot.timeInPlay);
        rowNode.remove();
        return true;
    }
    var timeInPlay = parseInt(marketDataSnapshot.timeInPlay);
    if (timeInPlay < minimumValue || timeInPlay > maximumValue) {
        console.log('checkTimeInPlayAndRemove. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + marketDataSnapshot.timeInPlay);
        rowNode.remove();
        return true;
    }
    return false;
}
function checkMatchedAmountAndRemove(marketDataSnapshot, rowNode, minimumValue, maximumValue) {
    'use strict';
    if (typeof (marketDataSnapshot.matchedAmount) === 'undefined') {
        return false;
    }
    if (marketDataSnapshot.matchedAmount < minimumValue || maximumValue < marketDataSnapshot.matchedAmount) {
        console.log('checkMatchedAmountAndRemove. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + marketDataSnapshot.matchedAmount);
        rowNode.remove();
        return true;
    }
    return false;
}
function checkFavouriteTeamPriceAndRemove(marketDataSnapshot, rowNode, minimumValue, maximumValue) {
    'use strict';
    if (typeof (marketDataSnapshot.home) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.draw) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.away) === 'undefined') {
        return false;
    }
    var price = marketDataSnapshot.home.backPrice;
    if (price > marketDataSnapshot.draw.backPrice) {
        price = marketDataSnapshot.draw.backPrice;
    }
    if (price > marketDataSnapshot.away.backPrice) {
        price = marketDataSnapshot.away.backPrice;
    }
    if (price < minimumValue || maximumValue < price) {
        console.log('checkFavouriteTeamPriceAndRemove. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + price);
        rowNode.remove();
        return true;
    }
    return false;
}
function checkUnderdogTeamPriceAndRemove(marketDataSnapshot, rowNode, minimumValue, maximumValue) {
    'use strict';
    if (typeof (marketDataSnapshot.home) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.draw) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.away) === 'undefined') {
        return false;
    }
    var price = marketDataSnapshot.home.backPrice;
    if (price < marketDataSnapshot.draw.backPrice) {
        price = marketDataSnapshot.draw.backPrice;
    }
    if (price < marketDataSnapshot.away.backPrice) {
        price = marketDataSnapshot.away.backPrice;
    }
    if (price < minimumValue || maximumValue < price) {
        console.log('checkUnderdogTeamPriceAndRemove. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + price);
        rowNode.remove();
        return true;
    }
    return false;
}
function checkGoalDifferenceAndRemove(marketDataSnapshot, rowNode, minimumValue, maximumValue) {
    'use strict';
    if (typeof (marketDataSnapshot.home) === 'undefined') {
        return false;
    }
    if (typeof (marketDataSnapshot.away) === 'undefined') {
        return false;
    }
    var goalDifference = marketDataSnapshot.away.score - marketDataSnapshot.home.score;
    if (marketDataSnapshot.home.score > marketDataSnapshot.away.score) {
        goalDifference = marketDataSnapshot.home.score - marketDataSnapshot.away.score;
    }
    if (goalDifference < minimumValue || maximumValue < goalDifference) {
        console.log('checkGoalDifferenceAndRemove. minimumValue: ' + minimumValue + ' maximumValue: ' + maximumValue + '. Removed ' + goalDifference);
        rowNode.remove();
        return true;
    }
    return false;
}

function repeatedExecution(count, minimumTimeInPlay, maximumTimeInPlay, minimumMatchedAmount, maximumMatchedAmount, minimumFavouritePrice, maximumFavouritePrice, minimumUnderdogPrice, maximumUnderdogPrice, minimumGoalDifference, maximumGoalDifference) {
    if(count > 3) {
        window.location.reload(false);
        return;
    }
    $(document).find('table.coupon-table > tbody > tr').each(function () {
        var rowNode = $(this);
        var marketDataSnapshot = readMarketDataSnapshot(rowNode);
        var removedTimeInPlay = checkTimeInPlayAndRemove(marketDataSnapshot, rowNode, minimumTimeInPlay, maximumTimeInPlay);
        if (removedTimeInPlay) {
            return;
        }
        var removedMatchedAmount = checkMatchedAmountAndRemove(marketDataSnapshot, rowNode, minimumMatchedAmount, maximumMatchedAmount);
        if (removedMatchedAmount) {
            return;
        }
        var removedFavouriteTeamPrice = checkFavouriteTeamPriceAndRemove(marketDataSnapshot, rowNode, minimumFavouritePrice, maximumFavouritePrice);
        if (removedFavouriteTeamPrice) {
            return;
        }
        var removedUnderdogTeamPrice = checkUnderdogTeamPriceAndRemove(marketDataSnapshot, rowNode, minimumUnderdogPrice, maximumUnderdogPrice);
        if (removedUnderdogTeamPrice) {
            return;
        }
        var removedGoalDifference = checkGoalDifferenceAndRemove(marketDataSnapshot, rowNode, minimumGoalDifference, maximumGoalDifference);
        if (removedGoalDifference) {
            return;
        }
    });
    count++;
    setTimeout(repeatedExecution, 10000, count, minimumTimeInPlay, maximumTimeInPlay, minimumMatchedAmount, maximumMatchedAmount, minimumFavouritePrice, maximumFavouritePrice, minimumUnderdogPrice, maximumUnderdogPrice, minimumGoalDifference, maximumGoalDifference);
}
function start() {
    'use strict';
    var minimumTimeInPlay = 50;
    var maximumTimeInPlay = 70;
    var minimumMatchedAmount = 10000;
    var maximumMatchedAmount = 999999999;
    var minimumFavouritePrice = 1.03;
    var maximumFavouritePrice = 1.30;
    var minimumUnderdogPrice = 2.00;
    var maximumUnderdogPrice = 1000;
    var minimumGoalDifference = 1;
    var maximumGoalDifference = 999;

    var getUserInput = false;
    if (getUserInput) {
        minimumTimeInPlay = getMinimumInt(46, 90, "Choose minimum time in play .... Enter minutes");
        maximumTimeInPlay = getMaximumInt(minimumTimeInPlay, 90, "Choose maximum time in play .... Enter minutes");
        minimumMatchedAmount = getMinimumFloat(0, 999999999, "Choose minimum matched amount .... Enter amount");
        maximumMatchedAmount = getMaximumFloat(minimumMatchedAmount, 999999999, "Choose maximum matched amount .... Enter amount");
        minimumFavouritePrice = getMinimumFloat(1.02, 1000, "Choose minimum back price for favourite team .... Enter price");
        maximumFavouritePrice = getMaximumFloat(minimumFavouritePrice, 1000, "Choose maximum back price for favourite team .... Enter price");
        minimumUnderdogPrice = getMinimumFloat(2.00, 1000, "Choose minimum back price for underdog team .... Enter price");
        maximumUnderdogPrice = getMaximumFloat(minimumUnderdogPrice, 1000, "Choose maximum back price for underdog team .... Enter price");
        minimumGoalDifference = getMinimumInt(1, 999, "Choose minimum goal difference .... Enter goal difference");
        maximumGoalDifference = getMaximumInt(minimumGoalDifference, 999, "Choose maximum goal difference .... Enter goal difference");
    }
    var count = 0;
    setTimeout(repeatedExecution, 0, count, minimumTimeInPlay, maximumTimeInPlay, minimumMatchedAmount, maximumMatchedAmount, minimumFavouritePrice, maximumFavouritePrice, minimumUnderdogPrice, maximumUnderdogPrice, minimumGoalDifference, maximumGoalDifference);
}
(function () {
    'use strict';
    console.log("document loaded(). Filtering will start in 10 seconds");
    setTimeout(start, 10000);
})();