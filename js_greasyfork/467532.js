// ==UserScript==
// @name        Sales history sorter - hcpao.org
// @namespace   Violentmonkey Scripts
// @match       *://*.hcpao.org/Search/Parcel/*
// @include     *://hcpao.org/Search/Parcel/*
// @grant       none
// @version     1.3
// @author      Ryan McLean
// @description 5/30/2023, 7:56:47 PM
// @license MIT
// ==/UserScript==

const salesHistoryTable    = $("h3:contains('Sales History')").next().first('table').find('tbody');
const salesHistoryRows     = salesHistoryTable.find("tr");

const extractBookPageValue = (tableRow) => Number($(tableRow).find("td:eq(0):first-child").text() + $(tableRow).find("td:eq(1):first-child").text());

const SortByBookPageDesc = (a, b) => {
     var a_value  = extractBookPageValue(a);
     var b_value  = extractBookPageValue(b);

     if      (a_value  >  b_value)
        return -1;
     else if (a_value  <  b_value)
        return 1;
     else
        return 0;
}

salesHistoryRows.sort(SortByBookPageDesc).appendTo(salesHistoryTable);