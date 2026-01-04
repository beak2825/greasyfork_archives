// ==UserScript==
// @name         AtCoder Participants Display
// @namespace    http://tampermonkey.net/
// @version      2025-08-11-2
// @description  AtCoderの順位表に種類別の参加人数を表示する。
// @author       Tamiji153
// @match        https://atcoder.jp/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523852/AtCoder%20Participants%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/523852/AtCoder%20Participants%20Display.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    let url = location.pathname;
    if (url[url.length - 1] != '/') {
        url += '/';
    }
    let urls = url.split('/');
    if (urls[1] == 'contests' && urls[3] == 'standings') {
        let data = (await (await fetch(url + 'json')).json()).StandingsData;
        let team = 0;
        let rated = 0;
        let unr = 0;
        data.forEach((e) => {
            if (e.IsTeam) {
                team++;
            } else if (e.IsRated) {
                rated++;
            } else {
                unr++;
            }
        })
        let dis = document.createElement('h4');
        dis.innerHTML = `Participants: ${data.length} (Teams: ${team}, Rated: ${rated}, Unrated: ${unr})`;
        document.querySelector('#vue-standings>div>.text-center').after(dis);
    }
})();