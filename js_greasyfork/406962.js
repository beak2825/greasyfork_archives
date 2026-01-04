// ==UserScript==
// @name         新式双低转债轮动评分
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从kirk91的双低转债轮动评分复制过来修改的新式双低评分。按照 转股溢价 + 纯债溢价 = 转债价格*2-转股价值-纯债价值 计算评分, 并将结果渲染在已有的数据表格上, 并支持按照评分字段进行排序
// @author       kirk91
// @match        *://www.jisilu.cn/data/cbnew/
// @match        *://jisilu.cn/data/cbnew/
// @match        *://www.jisilu.cn/data/cbnew/#cb
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/406962/%E6%96%B0%E5%BC%8F%E5%8F%8C%E4%BD%8E%E8%BD%AC%E5%80%BA%E8%BD%AE%E5%8A%A8%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/406962/%E6%96%B0%E5%BC%8F%E5%8F%8C%E4%BD%8E%E8%BD%AC%E5%80%BA%E8%BD%AE%E5%8A%A8%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

function insertScoreHeader() {
    var header_html = '<th style="width: 70px; white-space: nowrap;" title="新式双低=转股溢价+纯债溢价=转债价格*2-转股价值-纯债价值" class="header sticky">新式双低</th>';
    $('#flex_cb thead th:last-child').before(header_html);
}

function insertScoreData() {
    $("#flex_cb tbody tr").each(function(index){
        var bond_id = $(this).find("td[data-name|=bond_id] a").text()
        var bond_name = $(this).find("td[data-name|=bond_nm]").text()
        var price_text = $(this).find("td[data-name|=price]").text();
        var convert_value = $(this).find("td[data-name|=convert_value]").text();
        var bond_value = $(this).find("td[data-name|=bond_value]").text();
        var score = (parseFloat(price_text) * 2 - parseFloat(bond_value) - parseFloat(convert_value)).toFixed(2);
        var score_html = '<td data-name="score" style="width:40px;white-space: nowrap">' + score + '</td>';
        $(this).find("td[data-name|=cbOpt]").before(score_html);
    });
}

function insertIdHeader() {
    var header_html = '<th style="width: 30px; white-space: nowrap;" title="自增id" class="header sticky" sorter=false>序号</th>';
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
    }, 6000);

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