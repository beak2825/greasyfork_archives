// ==UserScript==
// @name         Breeding Calendar
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1
// @description  Shows a list of when your dragons can breed on the sidebar, ordered chronologically.
// @author       AyBeCee
// @match        https://www1.flightrising.com/lair/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/395596/Breeding%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/395596/Breeding%20Calendar.meta.js
// ==/UserScript==

let datesArray = $(".lair-page-dragon").map(function(){
    var imageUrl = $(this).find(".lair-page-dragon-tumbnail.lair-dragon-tooltip").html();

    var dragonName = $(this).attr("data-name");

    var americanDate = $(this).find(".common-tooltip-source strong").eq(1).text();
    // convert a date in a string into milliseconds
    var breedDate = Date.parse(americanDate);

    // check if the dragon has a breeding cooldown. if not, return null
    var ready2breed = $(this).find("img.lair-page-dragon-icon[src='/static/layout/lair/icons/breeding-cooldown.png']");

    if ( ready2breed.length ) {
        return [ {
            pic: imageUrl,
            name: dragonName,
            date: breedDate
        } ]

    } else {
        return null;
    }
});

// sorting the dates alphabetically (sort array alphabetically by key value)
function compare( a, b ) {
    if ( a.date < b.date ){
        return -1;
    }
    if ( a.date > b.date ){
        return 1;
    }
    return 0;
}

datesArray.sort( compare );

$(".leftcolumn").prepend('<div id="tableShow" class="breedtitle" style="display:none">Show Breeding Calendar</div><div id="breedTable"><div id="tableHide" class="breedtitle">Hide Breeding Calendar</div><table id="tableData"></table></div><style>#tableData img { width: 30px; }#tableData{background: #ebe7e4; padding: 5px 10px;margin: auto; border: 1px solid #b0aba3;}.breedtitle{text-align: center; color: #e8cc9f; font: bold 7.8pt/30px tahoma; background: #731d08; margin: 1px;cursor:pointer}</style>')

var k = '<table>'
for(i = 0;i < datesArray.length; i++){
    k+= '<tr>';
    k+= '<td>' + datesArray[i].pic + '</td>';
    k+= '<td>' + datesArray[i].name + '</td>';
    // convert a date in milliseconds back to a string
    k+= '<td>' + new Date(datesArray[i].date).toLocaleDateString() + '</td>';
    k+= '</tr>';
}
k+='</table>';
$("#tableData").html(k);

// using .hide() and .show() instead of .toggle() so that I can use GM_setValue/GM_getValue
var toggleStatus;

$("#tableHide").click(function(){
    $("#breedTable").hide();
    $("#tableShow").show();
    GM_setValue(toggleStatus,"hide");
});
$("#tableShow").click(function(){
    $("#breedTable").show();
    $("#tableShow").hide();
    GM_setValue(toggleStatus,"show");
});
if (GM_getValue(toggleStatus,0) === "hide" ) {
    $("#breedTable").hide();
    $("#tableShow").show();
} else if (GM_getValue(toggleStatus,0) === "show" ) {
    $("#breedTable").show();
    $("#tableShow").hide();
}