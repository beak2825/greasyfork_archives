// ==UserScript==
// @name         FMP Time Show
// @name:zh-CN   FMP Time Show
// @version      0.5
// @description:zh-CN  显示FMP时间
// @description  Show FMP Time
// @match        https://footballmanagerproject.com/*
// @match        https://www.footballmanagerproject.com/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/534987/FMP%20Time%20Show.user.js
// @updateURL https://update.greasyfork.org/scripts/534987/FMP%20Time%20Show.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let seasonTime = document.getElementsByClassName("navbar-season");
    const time = Math.floor(FMP.Date.Today());
    const dayDiv = document.createElement('span');
    dayDiv.className = 'week';
    dayDiv.innerHTML = '第 '+ (time%84%7+1) +' 日';
    seasonTime[0].appendChild(dayDiv);
    const seasonEndDiv = document.createElement('span');
    seasonEndDiv.className = 'week';
    seasonEndDiv.innerHTML = '距赛季结束 '+ (84-time%84) +' 日';
    seasonTime[0].appendChild(seasonEndDiv);
    const totalDayDiv = document.createElement('span');
    totalDayDiv.className = 'week';
    totalDayDiv.innerHTML = '总计 第 '+ time +' 日';
    seasonTime[0].appendChild(totalDayDiv);
    const totalWeekDiv = document.createElement('span');
    totalWeekDiv.className = 'week';
    totalWeekDiv.innerHTML = '第 '+ Math.floor(time/7) +' 周';
    seasonTime[0].appendChild(totalWeekDiv);
})();
