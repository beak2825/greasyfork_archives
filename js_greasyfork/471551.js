// ==UserScript==
// @name        GGn Torrent history gold/day/gb
// @namespace   http://tampermonkey.net/
// @version     0.21
// @license     MIT
// @description Calculate Gold per Day per GB for your seeded torrents
// @author      drlivog modified from ZeDoCaixao
// @match       https://gazellegames.net/torrents.php?*type=viewseed*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/471551/GGn%20Torrent%20history%20golddaygb.user.js
// @updateURL https://update.greasyfork.org/scripts/471551/GGn%20Torrent%20history%20golddaygb.meta.js
// ==/UserScript==
/* globals $ */

let block=false;

function sizeToGB(size) {
    'use strict';
    var number, unit;
    [number, unit] = size.split(' ');
    switch(unit) {
        case 'B': return number / 1024 / 1024 / 1024;
        case 'KB': return number / 1024 / 1024;
        case 'MB': return number / 1024;
        case 'TB': return number * 1024;
        default: return number;
    }
}

function numberToColor(num) {
    if (num < 3) {
        return "red";
    } else if (num > 8) {
        return "green";
    }
    return "orange";
}

(function() {
    'use strict';
    $('div.torrent_history > table > tbody > tr:nth-child(1)')
        .append('<td><a href="#0" id="gperdaypergb">g/d/GB</a></td>');
    let sizeIndex = $('div.torrent_history > table > tbody > tr:nth-child(1) td a:contains("Size")').parent().index()+1; //css index starts at 1
    let goldIndex = $('div.torrent_history > table > tbody > tr:nth-child(1) td a:contains("Gold")').parent().index()+1;
    $('div.torrent_history > table > tbody > tr').slice(1).each(function(i,e) {
        var size = sizeToGB($(e).children(`td:nth-child(${sizeIndex})`).text());
        var gold = $(e).children(`td:nth-child(${goldIndex})`)
            .children('span:nth-child(1)').text();
        var goldPerGB = gold * 24 / size;
        $(e).append('<td>'+goldPerGB.toFixed(5)+'<br><img src="static/styles/game_room/images/icons/coins.png" title="Gold" alt="Gold">/d/GB</td>');
        $(e).children('td:last-child').css('color', numberToColor(goldPerGB));
    });
    $('#gperdaypergb').click(function(event){
        updateTable();
        let sort = $(this).data("sort");
        tableSort(sort,$(this).parent().index(), "float");
        $(this).data("sort", !sort);
        event.preventDefault();
    });
    var mutationObserver = new MutationObserver(updateBlocker);
    mutationObserver.observe( document.querySelector('#torrent_history_table'), { childList:true, subtree:true });
})();

function updateBlocker() {
    if (block) {
        return;
    } else {
        setTimeout(function() {
            block = false;
            updateTable();
        }, 1000);
    }
}

function updateTable() {
    if (block) return;
    console.log("Updating Table");
    let sizeIndex = $('div.torrent_history > table > tbody > tr:nth-child(1) td a:contains("Size")').parent().index()+1; //css index starts at 1
    let goldIndex = $('div.torrent_history > table > tbody > tr:nth-child(1) td a:contains("Gold")').parent().index()+1;
    let gpdbIndex = $('div.torrent_history > table > tbody > tr:nth-child(1) td a:contains("g/d/GB")').parent().index()+1;
    $('div.torrent_history > table > tbody > tr').slice(1).each(function(i,e) {
        var size = sizeToGB($(e).children(`td:nth-child(${sizeIndex})`).text());
        var gold = $(e).children(`td:nth-child(${goldIndex})`)
                  .children('span:nth-child(1)').text();
        var goldPerGB = gold * 24 / size;
        if (gpdbIndex>0 && $(e).children().length>=gpdbIndex) {
            $(e).children(`td:nth-child(${gpdbIndex})`).html(goldPerGB.toFixed(3)+'<br><img src="static/styles/game_room/images/icons/coins.png" title="Gold" alt="Gold">/d/GB');
            $(e).children('td:last-child').css('color', numberToColor(goldPerGB));
        } else {
            $(e).append('<td>'+goldPerGB.toFixed(5)+'<br><img src="static/styles/game_room/images/icons/coins.png" title="Gold" alt="Gold">/d/GB</td>');
            $(e).children('td:last-child').css('color', numberToColor(goldPerGB));
        }
    });
}

function tableSort(descending, idx, sortType) {
    let rows = $('div.torrent_history > table > tbody > tr').get();
    let header = rows.shift();
    rows.sort(function(a,b) {
        let A,B;
        if (sortType === "float") {
            A = parseFloat($(a).children('td').eq(idx).text());
            B = parseFloat($(b).children('td').eq(idx).text());
        } else {
            A = $(a).children('td').eq(idx).text();
            B = $(b).children('td').eq(idx).text();
        }
        if (descending) {
            return B-A;
        } else {
            return A-B;
        }
    });
    rows.unshift(header);
    $.each(rows, function(index, row) {
	    $('div.torrent_history > table').children('tbody').append(row);
	  });
}