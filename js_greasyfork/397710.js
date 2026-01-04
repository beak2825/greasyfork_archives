// ==UserScript==
// @name         AtCoder Submission User Colorizer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  提出一覧のユーザ名を色付けします
// @author       morio_prog
// @match        https://atcoder.jp/contests/*/submissions*
// @grant        none
// @license      CC0
// @require      https://unpkg.com/lscache/lscache.min.js
// @downloadURL https://update.greasyfork.org/scripts/397710/AtCoder%20Submission%20User%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/397710/AtCoder%20Submission%20User%20Colorizer.meta.js
// ==/UserScript==

$(function() {
    'use strict';

    const lastUpdateKey = 'user-colorizer-ranking-last-update';
    const rankingKey = 'user-colorizer-ranking';
    const OUT_OF_RANK = Number.MAX_VALUE;   // > 100

    function getColor(rating) {
        if (rating >= 2800) return '#FF0000';
        if (rating >= 2400) return '#FF8000';
        if (rating >= 2000) return '#C0C000';
        if (rating >= 1600) return '#0000FF';
        if (rating >= 1200) return '#00C0C0';
        if (rating >=  800) return '#008000';
        if (rating >=  400) return '#804000';
        if (rating >     0) return '#808080';
        return '#000000';
    }

    function getColorClass(rating) {
        if (rating >= 2800) return 'user-red';
        if (rating >= 2400) return 'user-orange';
        if (rating >= 2000) return 'user-yellow';
        if (rating >= 1600) return 'user-blue';
        if (rating >= 1200) return 'user-cyan';
        if (rating >=  800) return 'user-green';
        if (rating >=  400) return 'user-brown';
        if (rating >     0) return 'user-gray';
        return 'user-unrated';
    }

    function getAchRate(rating) {
        const base = Math.floor(rating / 400) * 400;
        return ((rating - base) / 400) * 100;
    }

    function colorize(u, ranking, rating) {
        /* */if (ranking <=   1) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_champion.png">&nbsp;');
        else if (ranking <=  10) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_gold.png">&nbsp;');
        else if (ranking <=  30) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_silver.png">&nbsp;');
        else if (ranking <= 100) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_bronze.png">&nbsp;');
        else if (rating > 0) {
            const color = getColor(rating);
            const achRate = getAchRate(rating);
            $(u).before(`
                <span style="
                    display: inline-block;
                    height: 12px;
                    width: 12px;
                    vertical-align: center;
                    border-radius: 50%;
                    border: solid 1px ${color};
                    background: -webkit-linear-gradient(
                        bottom,
                        ${color} 0%,
                        ${color} ${achRate}%,
                        rgba(255, 255, 255, 0.0) ${achRate}%,
                        rgba(255, 255, 255, 0.0) 100%);
                "></span>
            `);
        }
        $(u).addClass(getColorClass(rating));
    }

    function getRankingMap() {
        return new Promise(function(callback) {
            const currentTime = new Date().getTime();
            const lastUpdateTime = localStorage.getItem(lastUpdateKey);
            // Update every 3 hours
            if (lastUpdateTime && currentTime < Number(lastUpdateTime) + 3 * 60 * 60 * 1000) {
                callback(JSON.parse(localStorage.getItem(rankingKey)));
            } else {
                let ranking = {};
                $.ajax({
                    url: "https://atcoder.jp/ranking",
                    type: 'GET',
                    dataType: 'html'
                })
                .done(function(data) {
                    $($.parseHTML(data)).find('.username > span').each(function(idx) {
                        const userName = $(this).text();
                        ranking[userName] = idx + 1;
                    });
                })
                .then(function() {
                    localStorage.setItem(lastUpdateKey, currentTime);
                    localStorage.setItem(rankingKey, JSON.stringify(ranking));
                    callback(ranking);
                });
            }
        });
    }

    function getRanking(rankingMap, userName) {
        if (userName in rankingMap) return rankingMap[userName];
        return OUT_OF_RANK;
    }

    lscache.flushExpired();
    getRankingMap().then((rankingMap) => {
        let index = 0;
        $('a[href*="/users"]').each(function(_, u) {
            // Skip "My Profile"
            if ($(u).find('span').length) return true;
            const partUri = $(this).attr('href');
            const userName = partUri.slice(7);
            const lskey = "rating-" + userName;
            const ranking = getRanking(rankingMap, userName);
            let rating = lscache.get(lskey);

            if (rating !== null) {
                colorize(u, ranking, rating);
                return;
            }

            index += 1;
            setTimeout(function() {
                $.ajax({
                    url: "https://atcoder.jp" + partUri + "/history/json",
                    type: 'GET',
                    dataType: 'json'
                })
                .done(function(data) {
                    const ratedCount = data.length;
                    if (ratedCount == 0) {
                        rating = 0;
                    } else {
                        rating = data[ratedCount - 1]["NewRating"];
                    }
                    // Update every 3 hours
                    lscache.set(lskey, rating, 3 * 60);
                })
                .then(function() {
                    colorize(u, ranking, rating);
                });
            }, index * 300);
        });
    });

});
