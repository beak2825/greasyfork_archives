// ==UserScript==
// @name        乘车记录查询
// @description 从“铁路畅行”常旅客会员网站上导出乘车记录
// @author      Arnie97
// @namespace   https://github.com/Arnie97
// @homepageURL https://github.com/Arnie97/travel-log
// @match       https://cx.12306.cn/tlcx/jfinformation.html
// @require     https://cdn.staticfile.org/FileSaver.js/1.3.3/FileSaver.min.js
// @grant       none
// @version     2018.02.19
// @downloadURL https://update.greasyfork.org/scripts/38659/%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/38659/%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

var results = [];
var remainingTasks = 0;
var seatTypeNames = createIndex(seatTypes, ':', 0, 1);
var stations = createIndex(station_names, '|', 2, 1);
addButton();

function createIndex(database, delimiter, key, value) {
    var index = {};
    database.split('@').forEach(function(i) {
        var row = i.split(delimiter);
        index[row[key]] = row[value];
    });
    return index;
}

function getFormDate(name) {
    return $('#data' + name).val().replace(/-/g, '');
}

function addButton() {
    var button = $('<a>').addClass('btn btn-primary').text('导出');
    button.click(listTrades);
    $('.dataDouble').width(600);
    $('.dataDouble>ul>li>input').width(80);
    $('<li>').append(button).appendTo('.dataDouble>ul');
}

function listTrades() {
    var data = {
        'queryType': 0,
        'queryStartDate': getFormDate('Start'),
        'queryEndDate':   getFormDate('End'),
        'pageIndex': 1,
        'pageSize': 1000
    };
    $.post(url.pointSimpleQuery, data, function(response) {
        if (response.status) {
            remainingTasks = response.data.length;
            response.data.forEach(getTradeDetail);
        }
    });
    showLoading();
}

function getTradeDetail(trade) {
    results = [];
    var data = {
        'queryType': trade.trade_type,
        'trade_id':  trade.trade_id
    };
    $.post(url.PointDetailQuery, data, function(response) {
        if (response.status && response.data.length) {
            collect(response.data[0]);
        }
        if (--remainingTasks === 0) {
            hideLoading();
            exportCsv(results);
        }
    });
}

function collect(x) {
    x.ticket_price = (x.ticket_price / 10).toFixed(1);
    x.seat_type_name = seatTypeNames[x.seat_type_code];
    x.arrive_station_name = stations[x.arrive_station_telecode];
    x. board_station_name = stations[x. board_station_telecode];
    for (var key in x) {
        if (key.slice(0, 4) === 'flag') {
            delete x[key];
        }
    }
    results.push(x);
}

function jsonToCsv(array) {
    var fields = Object.keys(array[0]);
    var csv = array.map(function(row) {
        return fields.map(function(fieldName) {
            return row[fieldName];
        }).join(',\t');
        // the tab character here for Microsoft Excel
        // https://stackoverflow.com/a/15107122/5072722
    });
    csv.unshift(fields.join(','));  // add the header
    return csv.join('\n');
}

function exportCsv(array) {
    var mimeType = 'text/csv;charset=utf-8';
    var blob = new Blob([jsonToCsv(array)], {type: mimeType});
    var fileName = getFormDate('Start') + '-' + getFormDate('End') + '.csv';
    saveAs(blob, fileName);
}
