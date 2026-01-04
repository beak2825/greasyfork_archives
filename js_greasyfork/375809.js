// ==UserScript==
// @name        SteamTrade Matcher Userscript - automatically add cards to trade
// @description Allows quicker trade offers by automatically adding cards as matched by STM
// @match       *://steamcommunity.com/tradeoffer/new/*source=stm*
// @match       *://*.steamtradematcher.com/*
// @connect     steamtradematcher.com
// @version     1.19.1
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM.deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @namespace   http://www.steamtradematcher.com
// @icon        http://www.steamtradematcher.com/res/img/favicon.jpg
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @author      Tithen-Firion
// @downloadURL https://update.greasyfork.org/scripts/375809/SteamTrade%20Matcher%20Userscript%20-%20automatically%20add%20cards%20to%20trade.user.js
// @updateURL https://update.greasyfork.org/scripts/375809/SteamTrade%20Matcher%20Userscript%20-%20automatically%20add%20cards%20to%20trade.meta.js
// ==/UserScript==
 
/*jslint browser:true*/
/*global window,unsafeWindow,GM.*,console */
 
function getRandomInt(min, max) {
    "use strict";
    return Math.floor(Math.random() * (max - min)) + min;
}
 
function mySort(a, b) {
    "use strict";
    return parseInt(b.id) - parseInt(a.id);
}
 
///// Steam functions /////
 
function restoreCookie(oldCookie) {
    "use strict";
    if (oldCookie) {
        var now = new Date();
        var time = now.getTime();
        time += 15 * 24 * 60 * 60 * 1000;
        now.setTime(time);
        document.cookie = 'strTradeLastInventoryContext=' + oldCookie + '; expires=' + now.toUTCString() + '; path=/tradeoffer/';
    }
}
 
function addCards(g_s, g_v) {
    "use strict";
    var tmpCards, inv, index, currentCards;
    var failLater = false;
    var cardTypes = [[], []];
    g_v.Cards.forEach(function (requestedCards, i) {
        tmpCards = {};
        inv = g_v.Users[i].rgContexts[753][6].inventory;
        inv.BuildInventoryDisplayElements();
        inv = inv.rgInventory;
        Object.keys(inv).forEach(function (item) {
            // add all matching cards to temporary dict
            index = requestedCards.indexOf(inv[item].classid);
            if (index > -1) {
                if (tmpCards[inv[item].classid] === undefined) {
                    tmpCards[inv[item].classid] = [];
                }
                tmpCards[inv[item].classid].push({type: inv[item].type, element: inv[item].element, id: inv[item].id});
            }
        });
        if (g_s.ORDER === 'SORT') {
            // sort cards descending by card id for each classid
            Object.keys(tmpCards).forEach(function (classid) {
                tmpCards[classid].sort(mySort);
            });
        }
        // add cards to trade in order given by STM
        requestedCards.forEach(function (classid) {
            currentCards = tmpCards[classid]; // all cards from inventory with requested classid
            if (currentCards.length === 0) {
                failLater = true;
            } else {
                index = 0;
                if (g_s.ORDER === 'RANDOM') {
                    // randomize index
                    index = getRandomInt(0, currentCards.length);
                }
                unsafeWindow.MoveItemToTrade(currentCards[index].element);
                cardTypes[i].push(currentCards[index].type);
                currentCards.splice(index, 1);
            }
        });
    });
    
    if(failLater || document.querySelectorAll('#your_slots .has_item').length != document.querySelectorAll('#their_slots .has_item').length) {
        unsafeWindow.ShowAlertDialog('Items missing', 'Some items are missing and were not added to trade offer. Script aborting.');
        throw ('Cards missing');
    }
    
    // check if item types match
    cardTypes[1].forEach(function (type) {
        index = cardTypes[0].indexOf(type);
        if (index > -1) {
            cardTypes[0].splice(index, 1);
        } else {
            unsafeWindow.ShowAlertDialog('Not 1:1 trade', 'This is not a valid 1:1 trade. Script aborting.');
            throw ('Not 1:1 trade');
        }
    });
    restoreCookie(g_v.oldCookie);
    // inject some JS to do something after trade offer is sent
    if (g_s.DO_AFTER_TRADE !== 'NOTHING') {
        var functionToInject = 'var DO_AFTER_TRADE = "' + g_s.DO_AFTER_TRADE + '";';
        functionToInject += '$J(document).ajaxSuccess(function (event, xhr, settings) {';
        functionToInject += 'if (settings.url === "https://steamcommunity.com/tradeoffer/new/send") {';
        functionToInject += 'if (DO_AFTER_TRADE === "CLOSE_WINDOW") { window.close();';
        functionToInject += '} else if (DO_AFTER_TRADE === "CLICK_OK") {';
        functionToInject += 'document.querySelector("div.newmodal_buttons > div").click(); } } });';
        var script = document.createElement('script');
        script.appendChild(document.createTextNode(functionToInject));
        document.body.appendChild(script);
    }
    // send trade offer
    if (g_s.AUTO_SEND) {
        unsafeWindow.ToggleReady(true);
        unsafeWindow.CTradeOfferStateManager.ConfirmTradeOffer();
    }
}
 
function checkContexts(g_s, g_v) {
    "use strict";
    var ready = 0;
    // check if Steam loaded everything needed
    g_v.Users.forEach(function (user) {
        if (user.rgContexts && user.rgContexts[753] && user.rgContexts[753][6]) {
            if (user.cLoadsInFlight === 0) {
                if (user.rgContexts[753][6].inventory) {
                    ready += 1;
                } else {
                    unsafeWindow.document.getElementById('trade_inventory_unavailable').show();
                    unsafeWindow.document.getElementById('trade_inventory_pending').show();
                    user.loadInventory(753, 6);
                }
            }
        }
    });
 
    if (ready === 2) {
        // select your inventory
        unsafeWindow.TradePageSelectInventory(g_v.Users[0], 753, "6");
        // set trade offer message
        document.getElementById('trade_offer_note').value = g_s.MESSAGE;
        try {
            addCards(g_s, g_v);
        } catch (e) {
            // no matter what happens, restore old cookie
            restoreCookie(g_v.oldCookie);
            console.log(e);
        }
    } else {
        window.setTimeout(checkContexts, 500, g_s, g_v);
    }
}
 
function getUrlVars() {
    "use strict";
    var vars = [];
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    hashes.forEach(function (hash) {
        hash = hash.split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    });
    return vars;
}
 
function checkEscrow(myOldEscrow, theirOldEscrow) {
    if(typeof(unsafeWindow.g_daysMyEscrow) !== "number" || typeof(unsafeWindow.g_daysTheirEscrow) !== "number")
        return;
    var myEscrow = (unsafeWindow.g_daysMyEscrow == 0 ? 0 : 1);
    var theirEscrow = (unsafeWindow.g_daysTheirEscrow == 0 ? 0 : 1);
    if(myEscrow != myOldEscrow || theirEscrow != theirOldEscrow) {
        GM.xmlHttpRequest({
            method: "GET",
            // add unsafeWindow.UserYou.strSteamId if needed
            url: "http://www.steamtradematcher.com/ajax/updateEscrowStatus/"+myEscrow+"/"+unsafeWindow.UserThem.strSteamId+"/"+theirEscrow
        });
    }
}
 
///// STM functions /////
 
async function restoreDefaultSettings() {
    if (window.confirm('Are you sure you want to restore default settings?')) {
        Promise.all([
            GM.deleteValue('MESSAGE'),
            GM.deleteValue('DO_AFTER_TRADE'),
            GM.deleteValue('ORDER'),
            GM.deleteValue('CHECK_ESCROW'),
            GM.deleteValue('AUTO_SEND')
        ]).then(()=>{
    	      document.location.reload();
        });
    }
}
function saveSettings() {
    Promise.all([
        GM.setValue('MESSAGE', document.getElementById('trade-message').value),
        GM.setValue('DO_AFTER_TRADE', document.getElementById('after-trade').value),
        GM.setValue('ORDER', document.getElementById('cards-order').value),
        GM.setValue('CHECK_ESCROW', document.getElementById('check-escrow').checked),
        GM.setValue('AUTO_SEND', document.getElementById('auto-send').checked)
    ]).then(()=>{
        document.getElementById('alert').style.display = 'block';
        window.scroll(0, 0);
    });
}
 
function prepareSettings(g_s) {
    "use strict";
    var template = '<div class="panel panel-default"><div class="panel-heading">' +
            '<h3 class="panel-title">{T}</h3></div><div class="panel-body">{B}</div></div>';
    var content = document.getElementById('content');
 
    var newHTML = '<div class="alert alert-success" id="alert" style="display:none">Your parameters have been saved.</div>';
    newHTML += template.replace('{T}', 'Script installed!').replace('{B}', '<p>Congratulations! SteamTrade Matcher\'s Userscript is up and running!</p>');
 
    newHTML += template.replace('{T}', 'Trade offer message').replace('{B}', '<p>Custom text that will be included automatically with your trade offers created through STM while using this userscript. To remove this functionality, simply delete the text.</p><div><input type="text" name="trade-message" id="trade-message" class="form-control" value="' + g_s.MESSAGE + '"></div>');
 
    newHTML += template.replace('{T}', 'Action after trade').replace('{B}', '<p>Determines what happens when you complete a trade offer.</p><ul><li><strong>Do nothing</strong>: Will do nothing more than the normal behavior.</li><li><strong>Close window</strong>: Will close the window after the trade offer is sent.</li><li><strong>Click OK</strong>: Will redirect you to the trade offers recap page.</li></ul><div class="option-block"><label for="after-trade">After trade...</label><select class="form-control" name="after-trade" id="after-trade"><option value="NOTHING">Do Nothing</option><option value="CLOSE_WINDOW">Close window</option><option value="CLICK_OK">Click OK</option></select></div>').replace(g_s.DO_AFTER_TRADE, g_s.DO_AFTER_TRADE + '" selected="');
 
    newHTML += template.replace('{T}', 'Cards order').replace('{B}', '<p>Determines which card is added to trade.</p><ul><li><strong>Sorted</strong>: Will sort cards by their IDs before adding to trade. If you make several trade offers with the same card and one of them is accepted, the rest will have message "cards unavilable to trade".</li><li><strong>Random</strong>: Will add cards to trade randomly. If you make several trade offers and one of them is accepted, only some of them will be unavilable for trade.</li><li><strong>As is</strong>: Script doesn\'t change anything in order. Results vary depending on browser, steam servers, weather...</li></ul><div class="option-block"><label for="cards-order">Cards order</label><select class="form-control" name="cards-order" id="cards-order"><option value="SORT">Sorted</option><option value="RANDOM">Random</option><option value="AS_IS">As is</option></select></div>').replace(g_s.ORDER, g_s.ORDER + '" selected="');
 
    newHTML += template.replace('{T}', 'Update users\' escrow status').replace('{B}', '<p>Help STM by sending escrow status of users you are trading with.</p><div class="checkbox"><label for="check-escrow"><input name="check-escrow" id="check-escrow" value="1" type="checkbox"' + (g_s.CHECK_ESCROW
        ? ' checked="checked"'
        : '') + '> Enable</label></div>');
 
    newHTML += template.replace('{T}', 'Auto-send trade offer').replace('{B}', '<p>Makes it possible for the script to automatically send trade offers without any action on your side. This is not recommended as you should always check your trade offers, but, well, this is a possible thing. Please note that incomplete trade offers (missing cards, ...) won\'t be sent automatically even when this parameter is set to true.</p><div class="checkbox"><label for="auto-send"><input name="auto-send" id="auto-send" value="1" type="checkbox"' + (g_s.AUTO_SEND
        ? ' checked="checked"'
        : '') + '> Enable</label></div>');
 
    newHTML += '<div id="save" style="margin-bottom:20px"><input class="btn btn-default btn-block" id="save-button" value="Save" type="submit"></div>';
    newHTML += '<div id="restore" style="margin-bottom:20px"><input class="btn btn-default btn-block" id="restore-button" value="Restore default settings" type="submit"></div>';
 
    content.innerHTML = newHTML + content.innerHTML;
    document.getElementById('save').addEventListener("click", saveSettings, false);
    document.getElementById('restore').addEventListener("click", restoreDefaultSettings, false);
}
 
///// Main function /////
 
async function main() {
    var global_settings = {};
    global_settings.MESSAGE = await GM.getValue('MESSAGE', 'SteamTrade Matcher');
    global_settings.AUTO_SEND = await GM.getValue('AUTO_SEND', false);
    global_settings.DO_AFTER_TRADE = await GM.getValue('DO_AFTER_TRADE', 'NOTHING');
    global_settings.ORDER = await GM.getValue('ORDER', 'AS_IS');
    global_settings.CHECK_ESCROW = await GM.getValue('CHECK_ESCROW', true);

    if (window.location.host === "steamcommunity.com") {
        // get classids from URL
        var vars = getUrlVars();
        if(global_settings.CHECK_ESCROW);
            checkEscrow(vars.myEscrow, vars.theirEscrow);
        
        var Cards = [
            (vars.you
                ? vars.you.split(';')
                : []),
            (vars.them
                ? vars.them.split(';')
                : [])
        ];
 
        if (Cards[0].length !== Cards[1].length) {
            unsafeWindow.ShowAlertDialog(
                'Different items amount',
                'You\'ve requested ' + (Cards[0].length > Cards[1].length
                    ? 'less'
                    : 'more') + ' items than you give. Script aborting.'
            );
            throw ('Different items amount on both sides');
        }
 
        // clear cookie containing last opened inventory tab - prevents unwanted inventory loading (it will be restored later)
        var oldCookie = document.cookie.split('strTradeLastInventoryContext=')[1];
        if (oldCookie) {
            oldCookie = oldCookie.split(';')[0];
        }
        document.cookie = 'strTradeLastInventoryContext=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/tradeoffer/';
 
        var Users = [unsafeWindow.UserYou, unsafeWindow.UserThem];
        var global_vars = {"Users": Users, "oldCookie": oldCookie, "Cards": Cards};
 
        window.setTimeout(checkContexts, 500, global_settings, global_vars);
    } else if (window.location.host === "www.steamtradematcher.com") {
        if(unsafeWindow.USinst == 0)
            GM.xmlHttpRequest({
                method: "GET",
                url: "http://www.steamtradematcher.com/ajax/flagUS/1"
            });
        if(window.location.pathname === "/userscript")
            prepareSettings(global_settings);
    }
}
 
main();