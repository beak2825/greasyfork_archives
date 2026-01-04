// ==UserScript==
// @name         tencent_live_review
// @namespace    https://github.com/rejerry/nba-game-replay-live
// @version      0.0.1
// @description  以实时直播的形式观看腾讯NBA视频比赛 Watch Tencent NBA video games in real-time live broadcast [https://github.com/rejerry/nba-game-replay-live]
// @author       rejerry
// @match        https://nba.stats.qq.com/schedule
// @match        https://nba.stats.qq.com/schedule/
// @match        https://kbs.sports.qq.com/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/427923/tencent_live_review.user.js
// @updateURL https://update.greasyfork.org/scripts/427923/tencent_live_review.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const url = window.location.href;

    let nStat = 0;
    const stat = function () {
        nStat = nStat + 1;

        const a1 = $("div.goal");
        if (a1.length != 0) {
            a1.children().hide();
            console.log("done. stat page try time cost: " + nStat + " ms");
            clearInterval(intervalStat);
        }
    }
    let intervalStat;
    const bStat = url.indexOf("nba.stats.qq.com/schedule");
    if (bStat >= 0) {
        intervalStat = window.setInterval(stat, 1);
    }


    let nRecord = 0;
    const record = function () {
        nRecord = nRecord + 1;

        const a1 = $("div.info > div.inner");
        if (a1.length != 0) {
            a1.hide();
            console.log("done. record page try time cost: " + nRecord + " ms");
            clearInterval(intervalRecord);
        }
    }
    let intervalRecord;
    const bRecord = url.indexOf("kbs.sports.qq.com");
    if (bRecord >= 0) {
        intervalRecord = window.setInterval(record, 1);
    }


    let nKbs = 0;
    const kbs = function () {
        nKbs = nKbs + 1;

        const kbs = $("div.left-data-tabs > div.kbs-tabs-wrapper");
        if (kbs.length != 0) {
            kbs.hide();
            console.log("done. record page 'kbs' try time cost: " + nKbs + " ms");
            clearInterval(intervalKbs);
        }
    }
    let intervalKbs;
    if (bRecord >= 0) {
        intervalKbs = window.setInterval(kbs, 1);
    }
})();