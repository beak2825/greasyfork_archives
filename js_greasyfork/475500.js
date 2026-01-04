// ==UserScript==
// @name         MojaCoder Submission User Colorizer (by AtCoder Rating)
// @namespace    https://mojacoder.app/
// @version      0.2
// @description  MojaCoder のユーザーのリンクに AtCoder のレーティングを紐つけます（ AtCoder のユーザー名と同じ場合のみ）
// @author       magurofly
// @license      CC0-1.0 Universal
// @match        https://mojacoder.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mojacoder.app
// @grant        none
// @require      https://unpkg.com/lscache/lscache.min.js
// @downloadURL https://update.greasyfork.org/scripts/475500/MojaCoder%20Submission%20User%20Colorizer%20%28by%20AtCoder%20Rating%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475500/MojaCoder%20Submission%20User%20Colorizer%20%28by%20AtCoder%20Rating%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    document.head.insertAdjacentHTML("afterbegin", `
<style>
.user-red {color:#FF0000;}
.user-orange {color:#FF8000;}
.user-yellow {color:#C0C000;}
.user-blue {color:#0000FF;}
.user-cyan {color:#00C0C0;}
.user-green {color:#008000;}
.user-brown {color:#804000;}
.user-gray {color:#808080;}
.user-unrated {color:#000000;}
.user-admin {color:#C000C0;}

.crown-gold {color: #fb0;}
.crown-silver {color: #aaa;}
</style>
    `);

    // もりを (morio_prog) 様の AtCoder Submission User Colorizer を改変して使用しています

    const lastUpdateKey = 'user-colorizer-ranking-last-update';
    const rankingKey = 'user-colorizer-ranking';
    const OUT_OF_RANK = Number.MAX_VALUE;   // > 100
    const UPDATE_INTERVAL = 3 * 60; // 更新周期 [min]

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
        /* */if (ranking <=   1) u.insertAdjacentHTML('beforebegin', '<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_champion.png">&nbsp;');
        else if (ranking <=  10) u.insertAdjacentHTML('beforebegin', '<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_gold.png">&nbsp;');
        else if (ranking <=  30) u.insertAdjacentHTML('beforebegin', '<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_silver.png">&nbsp;');
        else if (ranking <= 100) u.insertAdjacentHTML('beforebegin', '<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown_bronze.png">&nbsp;');
        else if (rating > 0) {
            const color = getColor(rating);
            const achRate = getAchRate(rating);
            u.insertAdjacentHTML('beforebegin', `
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
        u.classList.add(getColorClass(rating));
    }

    async function getRankingMap() {
        const currentTime = new Date().getTime();
        const lastUpdateTime = localStorage.getItem(lastUpdateKey);
        if (lastUpdateTime && currentTime < Number(lastUpdateTime) + UPDATE_INTERVAL * 60 * 1000) {
            return JSON.parse(localStorage.getItem(rankingKey));
        } else {
            let ranking = {};
            const data = await fetch("https://corsproxy.io/?https://atcoder.jp/ranking", { mode: "cors", }).then(response => response.text());
            const doc = new DOMParser().parseFromString(data, "text/html");
            doc.querySelectorAll(".username > span").forEach((elem, idx) => {
                const userName = elem.textContent;
                ranking[userName] = idx + 1;
            });
            localStorage.setItem(lastUpdateKey, currentTime);
            localStorage.setItem(rankingKey, JSON.stringify(ranking));
            return ranking;
        }
    }

    function getRanking(rankingMap, userName) {
        if (userName in rankingMap) return rankingMap[userName];
        return OUT_OF_RANK;
    }

    async function colorizeAll(root) {
        for (const u of root.querySelectorAll('a[href*="/users/"]')) {
            const userName = u.getAttribute('href').slice(7);
            if (encodeURIComponent(u.textContent) !== userName) continue; // URL とユーザー名が一致しない場合も弾く
            const lskey = "rating-" + userName;
            const ranking = getRanking(rankingMap, userName);
            let rating = lscache.get(lskey);
            if (rating === null) {
                const data = await fetch(`https://corsproxy.io/?https://atcoder.jp/users/${encodeURIComponent(userName)}/history/json`, { mode: 'cors', }).then(response => response.json());
                const ratedCount = data.length;
                if (ratedCount === 0) {
                    rating = 0;
                } else {
                    rating = data[ratedCount - 1]["NewRating"];
                }
                lscache.set(lskey, rating, UPDATE_INTERVAL);
            }
            colorize(u, ranking, rating);
        }
    }

    lscache.flushExpired();
    const rankingMap = await getRankingMap();

    colorizeAll(document);
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                colorizeAll(addedNode);
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();