// ==UserScript==
// @name         Warcraft Logs Enhancement
// @namespace    https://github.com/icyblade/warcraftlogs_enhancement
// @version      1.1.3
// @description  Some Enhancement Scripts of Warcraft Logs
// @author       swqsldz, kingofpowers, icyblade
// @match        http://*.warcraftlogs.com/*
// @match        https://*.warcraftlogs.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/31439/Warcraft%20Logs%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/31439/Warcraft%20Logs%20Enhancement.meta.js
// ==/UserScript==
const columnNames = ['MainStat', 'Crit', 'Haste', 'Mastery', 'Versatility'];
const attributes = ['MainStat', 'Crit', 'Haste', 'Mastery', 'Versatility'];
const regex = /\/reports\/([\S\s]+?)#fight=([0-9]+)/;
var loadListFight = new Array();
var loadListSummary = new Array();
var loadVersion = 0;


const HOST = 'https://' + window.location.hostname;


var PlayerList = new Array();

function initialize() {
    'use strict';

    // initialize attribute columns
    for (let i = 0; i < columnNames.length; i++) {
        $('<th class="sorting ui-state-default">' + columnNames[i] + '</th>').insertBefore('th.zmdi.zmdi-flag.sorting.ui-state-default');
    }
    for (let i = 0; i < columnNames.length; i++) {
        $('<td class="' + columnNames[i] + '"></td>').insertBefore('td.zmdi.zmdi-flag');
    }

    // extract fights from ranking page
    $('td.unique-gear').parent().each(function() {
        var player = new Object();

        player.rowID = $(this).attr('id');
        player.name = $(this).find('.players-table-name .main-table-player').text();

        var href = $(this).find('.players-table-name .main-table-player').attr('href');
        if (typeof(href) == 'undefined') {
            return;
        }
        player.logID = href.match(regex)[1];
        player.fightID = href.match(regex)[2];

        PlayerList.push(player);
    });
}

function loadPlayerSummary(index, currentVersion) {
    if (currentVersion != loadVersion) {
        return;
    }
    loadListSummary[index] = $.ajax({
        type: 'GET',
        url: HOST + '/reports/summary/' + PlayerList[index].logID + '/' + PlayerList[index].fightID + '/' + PlayerList[index].timestamp + '/' + (PlayerList[index].timestamp + 3000) + '/' + PlayerList[index].sourceID + '/0/Any/0/-1.0.-1/0',
        dataType: 'text',
        success: function(data) {
            callback_playerSummary(data, index);
        }
    });
}

function callback_playerSummary(data, index) {
    var summary = new Array();

    // handle main and enhancement attributes
    var regex_attr = /<span class="composition-entry">([a-zA-Z]+): <span class=estimate>([0-9\,]+)<\/span>/g;

    while ((stat = regex_attr.exec(data)) != null) {
        switch (stat[1]) {
            case 'Strength':
            case 'Agility':
            case 'Intellect':
                summary['MainStat'] = stat[2];
                break;
            case 'Crit':
                summary['Crit'] = stat[2];
                break;
            case 'Haste':
                summary['Haste'] = stat[2];
                break;
            case 'Mastery':
                summary['Mastery'] = stat[2];
                break;
            case 'Versatility':
                summary['Versatility'] = stat[2];
                break;
            case 'Stamina':
                break;
            default:
                break;
        }
    }

    // handle items
    var regex_item = /<td class="primary rank">([0-9]+)<\/td[^<]+<td nowrap class="num">Trinket\s*<td [^<]+<a target="_blank" href="\/\/www.wowhead.com\/item=([0-9]+)" rel="(?:(?:[^"]+|)bonus=([0-9:]+);|)"/g;

    var trinketnum = 0;
    while ((item = regex_item.exec(data)) != null) {
        trinketnum++;
        summary['Trinket' + trinketnum] = {
            'id': item[2],
            'level': item[1],
            'bonus': item[3] || ""
        };
    }
    PlayerList[index].summary = summary;
    updateRowSummary(index);
}

function updateRowSummary(index) {
    try {
        relics = '';
        if (typeof(PlayerList[index].summary['relic']) != 'undefined') {
            $.each(PlayerList[index].summary['relic'], function(i, relic) {
                relics += '<a target="_new" href="//www.wowhead.com/spell=' + relic['spellid'] + '"><img src="' + relic['img'] + '" class="tiny-icon"></a>';
            });
        }
        $('#' + PlayerList[index].rowID + ' .Artifact').html('<div style="align-items: center; display: flex;">' + PlayerList[index].summary['WeaponLevel'] + ':' + relics + '</div>');
        for (let i = 0; i < attributes.length; i++) {
            $('#' + PlayerList[index].rowID + ' .' + attributes[i]).html(PlayerList[index].summary[attributes[i]]);
        }

        //Trinket
        var regex_tditem = /wowhead.com\/item=([0-9]+)/;
        for (let trinketid = 1; trinketid <= 2; trinketid++) {
            if (typeof(PlayerList[index].summary['Trinket' + trinketid]) != 'undefined') {
                $('#' + PlayerList[index].rowID + '>.unique-gear>div>a[href$="item=' + PlayerList[index].summary['Trinket' + trinketid]['id'] + '"]').each(
                    function(i, a) {
                        $(a).html($(a).html() + '<span style="position: absolute; bottom: -6px; text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;">' + PlayerList[index].summary['Trinket' + trinketid]['level'] + '</span>');
                        $(a).attr('href', a.href + '&bonus=' + PlayerList[index].summary['Trinket' + trinketid]['bonus']);
                        $(a).css('position', 'relative');
                    }
                );
            }
        }
        $('td.Artifact').css('width', '1%');
    } catch (e) {
        console.error(e);
        console.error(PlayerList[index]);
    }
}

function loadFights(index, currentVersion) {
    if (currentVersion != loadVersion) {
        return;
    }
    loadListFight[index] = $.ajax({
        type: 'GET',
        url: HOST + '/reports/fights-and-participants/' + PlayerList[index].logID + '/0',
        dataType: 'json',
        success: function(data) {
            callback_fights(data, index, currentVersion);
        }
    });
}

function callback_stats(data, rowID, logID, fightID, timestamp, sourceID) {
    for (var key in columnNames) {
        try {
            $('#' + rowID + ' .attr-' + columnNames[key]).html(data.events[0][columnNames[key]]);
        } catch (e) {
            console.error(e);
            console.error(rowID);
            console.error(data);
        }
    }
}

function callback_fights(data, idx, currentVersion) {
    'use strict';
    PlayerList[idx].fight = data;

    for (let j in PlayerList[idx].fight.friendlies) {
        if (PlayerList[idx].fight.friendlies[j].name == PlayerList[idx].name) {
            PlayerList[idx].sourceID = PlayerList[idx].fight.friendlies[j].id;
            break;
        }
    }

    for (let j in PlayerList[idx].fight.fights) {
        if (PlayerList[idx].fight.fights[j].id == PlayerList[idx].fightID) {
            PlayerList[idx].timestamp = PlayerList[idx].fight.fights[j].start_time;
            break;
        }
    }

    loadPlayerSummary(idx, currentVersion);
    idx++;

    if (idx >= PlayerList.length) {
        return;
    }

    loadFights(idx, currentVersion);
}

function clearLoad() {
    $.each(loadListFight, function(i, _ajax) {
        _ajax.abort();
    });
    $.each(loadListSummary, function(i, _ajax) {
        _ajax.abort();
    });
}

function loadAttributes(currentVersion) {
    initialize();
    loadFights(0, currentVersion);
}

function delayLoadAttributes() {
    if ($('.ranking-table tr:eq(1)').length !== 0 && $('.ranking-table tr:eq(1) >.MainStat').length === 0) {
        loadVersion++;
        clearLoad();
        PlayerList = new Array();
        loadAttributes(loadVersion);
        setTimeout(delayLoadAttributes, 10000);
    } else {
        setTimeout(delayLoadAttributes, 1000);
    }
}

// Remove right banner
var rightBanner = document.getElementById('right-vertical-banner');
if (rightBanner){
	rightBanner.parentElement.removeChild(rightBanner);
}
document.getElementById('table-container').style.marginRight = 0;

$('.responsive #content').attr('style', 'max-width: 10000px !important;');
delayLoadAttributes();