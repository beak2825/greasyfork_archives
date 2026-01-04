// ==UserScript==
// @name         Tyrel_MAL_Sort_by_Score
// @namespace    https://greasyfork.org/de/scripts/30598-tyrel-mal-sort-by-score
// @version      0.2
// @description  Adds MAL scores to animelist and sorts them if you click on the header.
// @author       Ghost
// @match        https://myanimelist.net/animelist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30598/Tyrel_MAL_Sort_by_Score.user.js
// @updateURL https://update.greasyfork.org/scripts/30598/Tyrel_MAL_Sort_by_Score.meta.js
// ==/UserScript==

// Initialize the table header "Rank Score"
$(".header-title.score").after('<th class="header-title ranking"><a href=# class="link sort">Rank Score</a></th>');
// Initialize the cells for "Rank Score"
$(".data.score").each(function(index) {
    $(this).after('<td class="data rank"></td>');
});

$(".list-item .more-info").each(function(index) {
    
    var animeID = $(this).attr("id").replace("more-", "");
    var tableRows = $(".list-item .data.rank");
    var currentScoreCell = tableRows.eq(index);
    
    $.ajax({
        method: "GET",
        url: "https://myanimelist.net/anime/"+animeID,
        dataType: "HTML",
        success: function(text) {
            var rankScore = text.match(/ratingValue\">\d+\.\d+/g)[0].replace('ratingValue">', "");
            
            currentScoreCell.html(rankScore);
        }
        });
});

// Sorter
$('th.header-title.ranking').click(function(){
    var table = $('.list-table');
    var rows = table.find('tbody tr.list-table-data').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc;
    
    if (!this.asc){rows = rows.reverse();}
    for (var i = 0; i < rows.length; i++){
        table.append(rows[i]);
    }
});

function comparer(index) {    
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    };
}

function getCellValue(row, index){
    return $(row).children('td').eq(index).html();
}