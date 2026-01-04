// ==UserScript==
// @name         ac-standings-notifier
// @namespace    http://github.com/rsk0315
// @version      0.1.1
// @description  AtCoder のコンテスト中に順位表を開いておくと，順位を自動で通知します．
// @author       rsk0315
// @match        https://beta.atcoder.jp/contests/*/standings
// @match        https://beta.atcoder.jp/contests/*/standings/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372988/ac-standings-notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/372988/ac-standings-notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // My code here...
    if (!('Notification' in window)) return;
    if (startTime === undefined) return;

    var permission = Notification.permission;
    if (permission === 'denied') return;
    Notification.requestPermission().then(function() {
        if (endTime.isBefore()) return;
        var jsonURL = window.location.href.replace(/\/+$/, '')+'/json';
        console.log(jsonURL);

        var id = setInterval(function() {
            if (startTime.isAfter()) return;
            if (endTime.isBefore()) {
                clearInterval(id);
                return;
            }

            $.ajax({
                type: 'GET',
                url: jsonURL,
                cache: false,
            }).done(function(data) {
                var standingsData = data.StandingsData;
                var numContestants = standingsData.length;
                var myRank = undefined;
                var lowestRank = data.StandingsData[numContestants-1].Rank;
                $.each(data.StandingsData, function(i, item) {
                    if (myRank !== undefined) return;
                    if (item.UserScreenName == userScreenName) {
                        myRank = item.Rank;
                    }
                });
                new Notification('current rank: '+myRank+' / '+lowestRank+' ('+numContestants+')');
            });
            // 5 分ごとに現在の順位，最低順位，参加人数を通知します．
        }, 5*60*1000);
    });
})();