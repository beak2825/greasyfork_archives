// ==UserScript==
// @name         CSGO Links Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add links on steam and faceit
// @require      https://cdn.bootcss.com/bignumber.js/8.1.1/bignumber.min.js
// @author       maxinimize
// @match        https://www.faceit.com/*/players/*
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383665/CSGO%20Links%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/383665/CSGO%20Links%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SteamToESEA = (steamID) => {
        const steamID3 = BigNumber(steamID).minus('76561197960265728');
        const z = steamID3.dividedToIntegerBy(2);
        const y = BigNumber(steamID).modulo(2);
        const eseaResult = `https://play.esea.net/index.php?s=search&query=1%3A${y.toString()}%3A${z.toString()}`;
        return eseaResult;
    }

    const currentUrl = window.location.href;
    if (currentUrl.includes('faceit')) {
        window.setTimeout(function() {
            const faceitlogin = $('#main-container-height-wrapper > div > div > section.page-title.page-title--with-bg.page-title--with-inset > div.page-title__content > div.page-title__content__title.page-title__content--flexible.page-title__content--dark-bg > h1').text();
            const [url1, url2, url3] = [
                'https://faceitstats.com/player,'+faceitlogin,
                'https://www.faceit-stats.me/?user='+faceitlogin,
                'https://faceitelo.net/player/'+faceitlogin
            ];
            const [faceit1, faceit2, faceit3] = [
                $(`<li class="subpage-nav__list__item"> <a class="subpage-nav__list__link" href="${url1}" target="_blank">facitstats</a></li>`),
                $(`<li class="subpage-nav__list__item"> <a class="subpage-nav__list__link" href="${url2}" target="_blank">facit-stats</a></li>`),
                $(`<li class="subpage-nav__list__item"> <a class="subpage-nav__list__link" href="${url3}" target="_blank">facitelo</a></li>`)
            ]
            for (let faceit of [faceit1, faceit2, faceit3]) {
                $('#main-container-height-wrapper > div > div > nav > ul').append(faceit);
            }
        }, 2000);
    }

    if(currentUrl.includes("steam")) {
        const urlFaceit = `https://www.faceit.com/en/search/overview/${window.g_rgProfileData.steamid}`;
        const urlESEA = SteamToESEA(window.g_rgProfileData.steamid);
        const faceit = $J(`<div class="profile_count_link"><a id="faceit" href="${urlFaceit}" target="_blank"><span class="count_link_label">FACEIT</span></a></div>`);
        const esea = $J(`<div class="profile_count_link"><a id="esea" href="${urlESEA}" target="_blank"><span class="count_link_label">ESEA</span></a></div>`);
        // es_profile_link css
        faceit.css({
           	'display': 'inline-block',
            'margin-top': '10px'
        })
        // add missing div for private profile
        const privateBan = $J('body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page.private_profile > div.profile_content > div > div.profile_rightcol');
        const privateNoBan = $J('body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.no_header.profile_page.private_profile > div.profile_content');
        if(privateBan) {
            privateBan.append($J(`<div class="profile_item_links"></div>`));
        }
        if(!privateBan && privateNoBan) {
            privateNoBan.append($J(`<div><div class="profile_rightcol"><div class="profile_item_links"></div></div></div`))
        }
        $J('div.profile_item_links').append(faceit);
        $J('div.profile_item_links').append(esea);
    }
})();