// ==UserScript==
// @name         Greypal Sort
// @namespace    Sketch2
// date          Dec 23, 2015
// @version      0.2
// @description  Columns click-sort
// @author       DoYouSketch2
//
// @match        http://greypal.el-fd.org/*
//
// @grant      GM_info
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// @grant      GM_registerMenuCommand
//
// @require      http://code.jquery.com/jquery-2.1.4.min.js
//
// @copyright     (c) 2015 USA, DoYouSketch2
// Released under the GNU General Public License, version 3 (GPL-3.0)
// https://gnu.org/licenses/gpl-3.0.txt
//
// Edited basic sort code from  http://stackoverflow.com/questions/3160277/jquery-table-sort
//
// I saw "comma removal" tricks on both these pages, decided to use regex one that grabs 'em all.
//   http://stackoverflow.com/questions/11665884/javascript-parse-a-string-to-a-number
//   http://stackoverflow.com/questions/7802014/remove-commas-with-jquery
//
//   http://stackoverflow.com/questions/4886319/replace-text-in-html-page-with-jquery
//
// ascii-code.com
// @downloadURL https://update.greasyfork.org/scripts/15486/Greypal%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/15486/Greypal%20Sort.meta.js
// ==/UserScript==



//  make it easier to see coin amounts
$("*:contains('gc')") .each(function() {
    var replaced = $(this).html() .replace(/.00gc/g, "·ºº") .replace(/gc/g, "") .replace(/NPC-/g, '');
    $(this) .html(replaced);
});


//  Function to find exact text, disregarding case

$.expr[":"] .exactContain = $.expr .createPseudo(function(arg) {
    return function(elem) {
        if ($(elem) .text() .toLowerCase() .indexOf(arg) >= 0)
            if (String($(elem) .text() .length) == String(arg .length))
                return $(elem);
    };
});


//  Function to iterate through names in lists

function iterate(list, Hue){
    for	(i = 0; i < list.length; i++) {
        $('td:exactContain(' + list[i] + ')')
        .css('color', Hue) .siblings() .andSelf() .not(':lt(-2)') .css('color', Hue);
    };
};


//  Highlight Guild Bots

var GuildBots = ["biker_boy","jeff","morpheus","nathanstenzel"];

for	(i = 0; i < GuildBots.length; i++) {
    $('td:exactContain(' + GuildBots[i] + ')')
    .css('font-weight', 'bold') .css('color', '#191975');
};


//  Bots we also get discounts on
//  Burn owns IWannaRock?

var Discount = ["crannog","faxie","yulin_old","iwannarock"];

iterate(Discount, 'DarkBlue');


//  RedTag bots

var RedTag = ["goldberg","norad","susje"];

iterate(RedTag, 'Chocolate');


//  Sorting algorithm for tables

function getCellValue(row, index){ return $(row) .children('td') .eq(index) .text() }

function compare(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        //  bypass commas, so we can sort numbers 1,000 and up
        var fixA = valA.replace(/,/g, ''), fixB = valB.replace(/,/g, '')
        return $.isNumeric(fixA) && $.isNumeric(fixB) ? fixA - fixB : fixA.localeCompare(fixB)
    }
};


//  Make columns clickable

$('th') .click(function(){
    var table = $(this) .parent() .parent()
    var rows = table.find('tr:gt(0)') .toArray() .sort(compare($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
});


//  Shade background
$('html') .css('background', '#d0ccee');


//  Shrink "How to add bots" & "data collected"
$('html') .css('font-size', '11px');
$('span#second') .css('font-size', '20px');
$('form') .css('font-size', '18px');


//  Put a little space between input and table
$('table:first') .before('<br><br>');
$('table') .css('border-spacing','8px 0px');


//  Highlight hosts
$('td:contains("N/A")') .text('•') .attr('align','center');
$('td:contains("NPC")') .css('font-weight', 'bold') .attr('align','center') .last() .text('•');
$('td:contains("el-services")') .css('font-size', '16px') .css('color', '#443322');


//  Shade C2 items
$('td:contains("(C2)")') .css('color', 'DarkBlue');


//  If bot if buying, you get the green
$('td:contains("Buying")') .css('font-size', '15px') .css('color', 'DarkGreen');
$('th:contains("Buying")') .css('color', 'DarkGreen') .parent() .before('<br>');


//  If bot is selling, you'll burn gc's
$('td:contains("Selling")') .css('font-size', '15px') .css('color', 'DarkRed');
$('th:contains("Selling")') .css('color', 'DarkRed') .parent() .before('<br>');


// center Amount
$('table:first tr td:odd:even') .css('color', '#443322');


//  Highlight Avg prices
$('table:last tr td:odd') .css('color', '#443322');
$('table:last th:odd') .css('color', '#443322');


//  Totals are useless information, remove
$('td:contains("Total"):last') .parent() .after('<br><br>') .remove();
$('td:contains("Total"):first') .parent() .remove();