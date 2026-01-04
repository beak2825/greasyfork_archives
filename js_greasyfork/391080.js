// ==UserScript==
// @name         双低转债轮动评分
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  按照 转债现价 + 转股溢价率 * 100 计算评分, 并将结果渲染在已有的数据表格上, 并支持按照评分字段进行排序
// @author       kirk91
// @match        *://www.jisilu.cn/data/cbnew/
// @match        *://jisilu.cn/data/cbnew/
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/391080/%E5%8F%8C%E4%BD%8E%E8%BD%AC%E5%80%BA%E8%BD%AE%E5%8A%A8%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/391080/%E5%8F%8C%E4%BD%8E%E8%BD%AC%E5%80%BA%E8%BD%AE%E5%8A%A8%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

function insertScoreHeader() {
    var header_html = '<th style="width: 70px; white-space: nowrap;" title="转债现价 + 转股溢价率 * 100" class="header">轮动评分</th>';
    $('#flex_cb thead th[title|="纯债价值，税前"]').before(header_html);
}

function insertScoreData() {
    $("#flex_cb tbody tr").each(function(index){
        var bond_id = $(this).find("td[data-name|=bond_id] a").text()
        var bond_name = $(this).find("td[data-name|=bond_nm]").text()
        var price_text = $(this).find("td[data-name|=price]").text();
        var premium_rt_text = $(this).find("td[data-name|=premium_rt]").text();
        var score = (parseFloat(price_text) + parseFloat(premium_rt_text)).toFixed(3);
        var score_html = '<td data-name="score" style="width:40px;white-space: nowrap">' + score + '</td>';
        $(this).find("td[data-name|=_bond_value]").before(score_html);
    });
}

function insertIdHeader() {
    var header_html = '<th style="width: 30px; white-space: nowrap;" title="自增id" class="header" sorter=false>序号</th>';
    $('#flex_cb thead tr:last').prepend(header_html);
}

function insertIdData() {
    $("#flex_cb tbody tr").each(function(index){
        var html = '<td data-name="id" style="width:20px;white-space: nowrap">' + (index+1) + '</td>';
        $(this).prepend(html);
    });
}

(function() {
    'use strict';

    // only match #cb page
    if (location.hash != "#cb") {
        return;
    }

    // TODO: replace it with flex_cb table data ready event.
    setTimeout(function(){
        // id
        insertIdHeader();
        insertIdData();

        // score
        insertScoreHeader();
        insertScoreData();

        // attach sorter to the new header
        // unbind the old click event handlers
        $("#flex_cb thead th").unbind("click");
        // rebuild the table sorter
        $('#flex_cb').tablesorter({widgets: ['zebra']});
        // remove the client event handler of id field
        $('#flex_cb thead th:first').unbind("click");
    }, 1500);

    $('#flex_cb').on('sortEnd', function(){
        // keep the id
        $(this).find('tbody tr').each(function(index){
            $(this).find('td:first').text(index+1);
        });
    });
    $('#flex_cb').on("reload", function(){
        insertIdData();
        insertScoreData();
    });
})();
