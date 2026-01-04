// ==UserScript==
// @name         Steam Link Menü
// @namespace    https://violentmonkey.github.io
// @version      1.1
// @description  Links auf Steam anzeigen
// @author       Patrik@Atze
// @license      MIT
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      www.faceit.com
// @downloadURL https://update.greasyfork.org/scripts/538680/Steam%20Link%20Men%C3%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/538680/Steam%20Link%20Men%C3%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS-Stile ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Link-Farben */
        #faceit-links .profile_count_link a {
            color: white !important;
        }
        #faceit-links .profile_count_link a:hover {
            color: red !important;
        }

        /* Styling für die statischen Überschriften */
        #faceit-links .static-header {
            display: flex;
            align-items: center;
            color: white;
            font-weight: bold;
            font-size: 15px;
            padding: 8px 0;
            user-select: none;
            margin-top: 10px;
        }

        /* Styling für die Liniensegmente */
        #faceit-links .summary-line {
            flex-grow: 1;
            height: 1px;
            background-color: white;
        }

        /* Styling für den Text-Container in der Überschrift */
        #faceit-links .summary-text-container {
            display: inline-flex;
            align-items: center;
            padding: 0 10px; /* Wieder etwas Abstand für die Optik */
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);


    if (!unsafeWindow.g_rgProfileData || !unsafeWindow.g_rgProfileData.steamid) {
        console.error("Steam Link Menü: Konnte die SteamID nicht finden.");
        return;
    }
    let id = unsafeWindow.g_rgProfileData.steamid;

    let categories = [
        {
            name: 'FACEIT',
            links: [
                {title: 'FACEIT', url: `https://www.faceit.com/en/search/overview/${id}`, 
				icon: 'https://www.faceit.com/favicon.ico', id: 'faceit-main-link'},
                {title: 'Faceit Finder', url: `https://faceitfinder.com/stats/${id}/matches`, icon: 'https://faceitfinder.com/favicon.ico'},
            ]
        },
        {
            name: 'Steam Allgemein',
            links: [
                {title: 'SteamRep', url: `https://steamrep.com/profiles/${id}`, icon: 'https://steamrep.com/favicon.ico'},
                {title: 'SteamDB', url: `https://steamdb.info/calculator/${id}`, icon: 'https://steamdb.info/favicon.ico'},
                {title: 'Achievement Stats', url: `https://www.achievementstats.com/index.php?action=profile&playerId=${id}`, 
				icon: 'https://www.achievementstats.com/templates/classic/images/favicon.ico'},
                {title: 'Steam Hunters', url: `https://steamhunters.com/id/${id}`, 
				icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwF-NCzUNsWbSEtHEoTXd6mW2vgJI_v_W6Ng&s'},
            ]
        },
        {
            name: 'Statistiken',
            links: [
                {title: 'CSStats', url: `https://csstats.gg/player/${id}`, icon: 'https://static.csstats.gg/images/favicon.ico'},
                {title: 'Leetify', url: `https://leetify.com/app/profile/${id}`, icon: 'https://leetify.com/assets/images/favicon-32x32.png'},
                {title: 'Tracker', url: `https://tracker.gg/cs2/profile/steam/${id}/overview`, icon: 'https://trackercdn.com/cdn/tracker.gg/icon-128.png'},
            ]
        },
        {
            name: 'Inventar',
            links: [
                {title: 'Backpack Inventory', url: `https://csgo.backpack.tf/profiles/${id}`, 
				icon: 'https://i.ibb.co/99406wb2/backpacktf.png'},
                {title: 'Skin Pock Inventory', url: `https://www.skinpock.com/de/inventory/${id}?game=cs2`, icon: 'https://www.skinpock.com/favicon.ico'},
                {title: 'SkinSpy Inventory', url: `https://cs2skinspy.com/?id=${id}`, icon: 'https://cs2skinspy.com/favicon.png'},
                {title: 'Exchange Inventory', url: `https://csgo.exchange/id/${id}`, icon: 'https://csgo.exchange/images/favicon.png'},
                {title: 'Clash Inventory', url: `https://inventory.clash.gg/users/${id}`, icon: 'https://inventory.clash.gg/assets/csgo/favicon.ico'},
            ]
        }
    ];

        let profile = document.querySelector('.profile_item_links') ?? document.querySelector('.profile_rightcol');
    if (!profile) {
        console.error("Steam Link Menü: Konnte keinen Ankerpunkt auf der Profilseite finden.");
        return;
    }
    profile.innerHTML += '<div id="faceit-links"></div><div style="clear: left;"></div>';
    let anchor = document.getElementById('faceit-links');

    for (let category of categories) {
        const header = document.createElement('div');
        header.className = 'static-header';
        header.innerHTML = `
            <span class="summary-line"></span>
            <span class="summary-text-container">
                <span>${category.name}</span>
            </span>
            <span class="summary-line"></span>
        `;
        anchor.appendChild(header);

        for (let l of category.links) {
            const linkContainer = document.createElement('div');
            if (l.id) {
                linkContainer.id = l.id;
            }
            linkContainer.className = 'profile_count_link ellipsis';

            let iconHTML = '';
            if (l.icon) {
                iconHTML = `<img src="${l.icon}" style="height: 16px; width: 16px; margin-right: 5px; vertical-align: middle;">`;
            }

            linkContainer.innerHTML = `
                <a href="${l.url}" target="_blank" style="font-size: 15px; display: flex; align-items: center;">
                    ${iconHTML}
                    <span class="count_link_label">${l.title}</span>
                    <span class="profile_count_link_total"> </span>
                </a>
            `;
            anchor.appendChild(linkContainer);
        }
    }

    // --- FACEIT API-Abfrage ---
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.faceit.com/api/searcher/v1/players?game_id=${id}`,
        responseType: 'json',
        onload: search => {
            if (search.status === 200 && search.response && search.response.payload) {
                for (let r of search.response.payload) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://www.faceit.com/api/users/v1/nicknames/${r.nickname}`,
                        responseType: 'json',
                        onload: user => {
                            if (user.status === 200 && user.response && user.response.payload) {
                                let p = user.response.payload;
                                if (p.games && p.games.cs2) {
                                    let faceitLinkContainer = document.getElementById('faceit-main-link');
                                    if (faceitLinkContainer) {
                                        let a = faceitLinkContainer.querySelector('a');
                                        a.href = `https://www.faceit.com/en/players/${r.nickname}/stats/cs2`;

                                        let label = a.querySelector('.count_link_label');
                                        if(label) {
                                            label.textContent = r.nickname;   /* label.textContent = 'FACEIT: ' + r.nickname; */
                                        }

                                        let total = a.querySelector('.profile_count_link_total');
                                        if(total) {
                                            total.style.cssText = 'position: relative; top: -2px;';
                                            let levelBadge = ` <img src="https://www.hltv.org/img/static/badges/faceit${p.games.cs2.skill_level}.svg" 
											height="15" style="vertical-align: middle;" />`;
                                            let membershipBadges = '';
                                            if (p.memberships) {
                                                for (let m of p.memberships) {
                                                    if (m == 'plus' || m == 'premium') {
                                                        membershipBadges += ` <img src="https://www.hltv.org/img/static/badges/faceit_${m}.svg" 
														height="15" style="vertical-align: middle;" />`;
                                                    }
                                                }
                                            }
                                            total.innerHTML = `&nbsp;${levelBadge}${membershipBadges}`;
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    });
                }
            }
        },
        onerror: e => {
            console.error("Steam Link Menü: Fehler bei der FACEIT API-Abfrage.", e);
        }
    });
})();