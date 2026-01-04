// ==UserScript==
// @name         DouyuTopicPageCleaner
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  Try to take over the world!
// @author       You
// @match        https://*.douyu.com/topic*
// @icon         https://www.google.com/s2/favicons?domain=douyu.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/431953/DouyuTopicPageCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/431953/DouyuTopicPageCleaner.meta.js
// ==/UserScript==

var timerCheckBC5 = null;
var timerCheckCoinRedPacketPop = null;

(function() {
    'use strict';

    // Your code here...
    var uriCur = window.location.href;
    var shouldReturn = true;
    console.log(1);
    if (uriCur.match(/^.*yskbkb#bc4$/g) != null) shouldReturn = false;
    console.log(2);
    //if (uriCur.match(/^.*ys(\S+)?\d+\??(rid=\d+)?(#bc\d+)?.*$/g) != null) shouldReturn = false; //toDelete
    if (uriCur.match(/^.*\/topic\/.*$/g) != null) shouldReturn = false;
    console.log('shouldReturn = ' + shouldReturn);
    if (shouldReturn === true) return false;

    console.log(3);
    var body = document.getElementsByTagName('body')[0];
    console.log(4);
    if (body === undefined || body === null) {
        console.log('body = ' + body);
        return false;
    }

    console.log(5);
    window.addEventListener('load', function(event) {
        doCheckBC5();
        doCheckCoinRedPacketPop();
    });
})();

function doCheckBC5()
{
    console.log('doCheckBC5');
    if (document.getElementById('bc5') === null || document.getElementById('bc5') === undefined) {
        timerCheckBC5 = window.setTimeout(doCheckBC5, 5000);
    } else {
        window.clearTimeout(timerCheckBC5);
        timerCheckBC5 = null;
        doCleanBC5();
    }
}

function doCleanBC5()
{
    console.log('doCleanBC5');
    var divsMain = document.getElementsByClassName('wm-general');
    for (var i = divsMain.length - 1; i >= 0; i--) {
        var divsPlayer = divsMain[i].getElementsByClassName('layout-Player-video');
        if (divsPlayer.length > 0) {
            divsMain[i].outerHTML = '';
        }
    }

    var divsClose = document.getElementsByClassName('DiamondsFansMatchPromptPop-close');
    for (var j = divsClose.length - 1; j >= 0; j--) {
        var divClose = divsClose[j];
        divClose.click();
    }

    var divToRemove = document.getElementById('js-room-activity');
    if (divToRemove !== null && divToRemove !== undefined) divToRemove.outerHTML = '';
}

function doCheckCoinRedPacketPop()
{
    console.log('doCheckCoinRedPacketPop');
    var divPacket = document.getElementsByClassName('CoinRedPacketPop-wrap');
    if (divPacket === null || divPacket === undefined) {
        timerCheckCoinRedPacketPop = window.setTimeout(doCheckCoinRedPacketPop, 5000);
    } else {
        window.clearTimeout(timerCheckCoinRedPacketPop);
        timerCheckCoinRedPacketPop = null;
        doCleanCoinRedPacketPop();
    }
}

function doCleanCoinRedPacketPop()
{
    console.log('doCleanCoinRedPacketPop');
    var divsCoinRedPacketPop = document.getElementsByClassName('CoinRedPacketPop-wrap');
    for (var i = divsCoinRedPacketPop.length - 1; i >= 0; i--) {
        divsCoinRedPacketPop[i].outerHTML = '';
    }
}