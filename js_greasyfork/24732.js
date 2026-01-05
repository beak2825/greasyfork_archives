// ==UserScript==
// @name         coolapk Real Rank
// @namespace    myfreeer
// @version      0.5
// @description  coolapk.com显示真实评分
// @author       myfreeer
// @license      GNU GPL v3
// @match        http://*.coolapk.com/apk/*
// @match        http://*.coolapk.com/game/*
// @match        http://coolapk.com/apk/*
// @match        http://coolapk.com/game/*
// @match        https://*.coolapk.com/apk/*
// @match        https://*.coolapk.com/game/*
// @match        https://coolapk.com/apk/*
// @match        https://coolapk.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24732/coolapk%20Real%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/24732/coolapk%20Real%20Rank.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var rank = 0,
        ranks = [],
        rankScore = document.querySelectorAll('.ex-apk-rank-score'),
        rankStar = document.querySelectorAll('.ex-apk-rank-star > .big-star');
    for (var i = 1; i < 6; i++) {
        var star = document.querySelectorAll('.star-' + i.toString());
        for (var j in star) {
            if (star[j] && star[j].parentNode && star[j].parentNode.lastChild && star[j].parentNode.lastChild.className === "ex-apk-rank-percent" && !isNaN(parseInt(star[j].parentNode.lastChild.innerText))) {
                ranks.push(i * parseInt(star[j].parentNode.lastChild.innerText));
                break;
            }
        }
    }
    if (ranks.length === 5)
        for (var _i in ranks) {
            rank += ranks[_i] / 100;
        }
    if (rank > 0) {
        for (var _i2 in rankScore) {
            if (rankScore[_i2]) {
                rankScore[_i2].title = rankScore[_i2].innerText;
                rankScore[_i2].innerText = rank.toString().length > 3 ? rank.toString().substring(0, 3) : rank;
            }
        }
        for (var _i3 in rankStar) {
            if (rankStar[_i3]) {
                if (rankStar[_i3] && rankStar[_i3].className && rankStar[_i3].className.match(/big-star-(\d+)/) && rankStar[_i3].className.match(/big-star-(\d+)/)[1]) rankStar[_i3].title = rankStar[_i3].className.match(/big-star-(\d+)/)[1];
                rankStar[_i3].className = "big-star big-star-" + (rank >>> 0);
            }
        }
    }
})();