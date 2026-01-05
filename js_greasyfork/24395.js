// ==UserScript==
// @name        ESPN NBA Old-style Box Scores
// @namespace   driver8.net
// @description Change box score links on ESPN's NBA site to redirect to the old style box scores that show more information.
// @match       *://*.espn.com/*
// @run-at      document-idle
// @version     0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/24395/ESPN%20NBA%20Old-style%20Box%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/24395/ESPN%20NBA%20Old-style%20Box%20Scores.meta.js
// ==/UserScript==

function MouseListen() {
    document.addEventListener('mousedown', function (evt) {
        var tgt = evt.target;
        console.log(tgt);
        if (tgt.nodeName == 'SPAN' && tgt.parentNode.nodeName == 'A') {
            tgt = tgt.parentNode;
        }
        if (tgt.nodeName == 'A' && tgt.href) {
            var ret = true;
            var box_regex = /(https?:\/\/)[^\/]+\.espn\.com(\/nba\/boxscore\?gameId=\d+)/;
            var pbp_regex = /(https?:\/\/)[^\/]+\.espn\.com(\/nba\/playbyplay\?gameId=\d+)/;
            var ins_regex = /(https?:\/\/)insider\.espn\.com(\/nba\/(?:shotchart|matchup|recap|game|conversation)\?gameId=\d+)/;
            if (doBox && tgt.href.match(box_regex)) { // change box score links
                ret = false;
                tgt.href = tgt.href.replace(box_regex, '$1insider.espn.com$2');
            }
            if (doPbp && tgt.href.match(pbp_regex)) { // change play-by-play links and show all quarters
                ret = false;
                tgt.href = tgt.href.replace(pbp_regex, '$1insider.espn.com$2');
                tgt.href = tgt.href.replace(/(playbyplay\?gameId=\d+)$/, '$1&period=0');
            } // change links that are not available on insider
            if (tgt.href.match(ins_regex)) {
                tgt.href = tgt.href.replace(ins_regex, '$1www.espn.com$2');
            }
            return ret;
        }
    });
}

//Set up prefs and menu commands
var DO_BOX = doBox = GM_getValue('dobox', true),
    DO_PBP = doPbp = GM_getValue('dopbp', true);

var box_caption = (DO_BOX ? 'Disable' : 'Enable') + ' box score redirects';
GM_registerMenuCommand(box_caption, function () {
    doBox = !DO_BOX;
    GM_setValue('dobox', doBox);
});

var pbp_caption = (DO_PBP ? 'Disable' : 'Enable') + ' play-by-play redirects';
GM_registerMenuCommand(pbp_caption, function () {
    doPbp = !DO_PBP;
    GM_setValue('dopbp', doPbp);
});

MouseListen();