// ==UserScript==
// @name         Steam FACEIT links
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Show FACEIT links on Steam profile
// @author       ultraviewer
// @license      MIT
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      www.faceit.com
// @downloadURL https://update.greasyfork.org/scripts/475384/Steam%20FACEIT%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/475384/Steam%20FACEIT%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let id = unsafeWindow.g_rgProfileData.steamid;

    let links = [
        {title: 'FACEIT', url: `https://www.faceit.com/en/search/overview/${id}`},
        {title: 'FaceitFinder', url: `https://faceitfinder.com/stats/${id}/matches`},
        {title: 'CSStats', url: `https://csstats.gg/player/${id}?platforms=FACEIT#/matches`}
    ];

    let profile = document.querySelector('.profile_item_links') ?? document.querySelector('.profile_rightcol');
    profile.innerHTML += '<div id="faceit-links"></div><div style="clear: left;"></div>';
    let anchor = document.getElementById('faceit-links');
    for (let l of links) {
        anchor.innerHTML += `<div class="profile_count_link ellipsis"></div>`;
        anchor.lastChild.innerHTML += `<a href="${l.url}" target="_blank" style="color: orange;"></a>`;
        anchor.lastChild.lastChild.innerHTML += `<span class="count_link_label">${l.title}</span>`;
        anchor.lastChild.lastChild.innerHTML += ' ';
        anchor.lastChild.lastChild.innerHTML += `<span class="profile_count_link_total"> </span>`;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.faceit.com/api/searcher/v1/players?game_id=${id}`,
        responseType: 'json',
        onload: search => {
            for (let r of search.response.payload) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://www.faceit.com/api/users/v1/nicknames/${r.nickname}`,
                    responseType: 'json',
                    onload: user => {
                        let p = user.response.payload;
                        if (p.games.cs2) {
                            let a = anchor.firstChild.firstChild;
                            a.href = `https://www.faceit.com/players/${r.nickname}/stats/cs2`;
                            a.firstChild.innerHTML = r.nickname;
                            a.lastChild.innerHTML = p.games.cs2.faceit_elo;
                            a.lastChild.innerHTML += ` <img src="https://www.hltv.org/img/static/badges/faceit${p.games.cs2.skill_level}.svg" height="30" style="vertical-align: bottom;" />`;
                            for (let m of p.memberships) {
                                if (m == 'plus' || m == 'premium') {
                                    a.lastChild.innerHTML += ` <img src="https://www.hltv.org/img/static/badges/faceit_${m}.svg" height="30" style="vertical-align: bottom;" />`;
                                }
                            }
                        }
                    }
                });
            }
        }
    });
})();