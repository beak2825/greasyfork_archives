// ==UserScript==
// @name          AB - Interactive Search Categories
// @namespace     TalkingJello@animebytes.tv
// @version       1.2.0
// @author        TalkingJello
// @description   Highlights the current categories. And preserves your search, along side any filters you might have set, when switching between "Anime" and "Music" or their subcategories on AB search.
// @icon          http://animebytes.tv/favicon.ico
// @license       MIT
// @match         *://animebytes.tv/torrents.php*
// @match         *://animebytes.tv/torrents2.php*
// @match         *://animebytes.tv/user.php?action=edit*
// @grant         GM_getValue
// @grant         GM_setValue
// @require       https://greasyfork.org/scripts/456220-delicious-userscript-library/code/Delicious%20Userscript%20Library.js?version=1125927
// @downloadURL https://update.greasyfork.org/scripts/455876/AB%20-%20Interactive%20Search%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/455876/AB%20-%20Interactive%20Search%20Categories.meta.js
// ==/UserScript==

function categoryKeyFromLink(link) {
    for (const key of [...(new URL(link).searchParams.keys())]) {
        if (key.startsWith('filter_cat[')) {
            return key;
        }
    }

    return '';
}

function deliciousSettings() {
    delicious.settings.init('animeMusicActiveColor', "#0090ff");
    delicious.settings.init('subcategoriesActiveColor', "#fe2a73");

    if (delicious.settings.ensureSettingsInserted()) {
        const section = delicious.settings.createCollapsibleSection('Interactive Search Categories');
        const s = section.querySelector('.settings_section_body');

        s.appendChild(delicious.settings.createColourSetting(
            'animeMusicActiveColor',
            'Anime/Music Active Color', 'Color for the active link from the Anime/Music links.',
            {default: '#0090ff'}));

        s.appendChild(delicious.settings.createColourSetting(
            'subcategoriesActiveColor',
            'Subcategories Active Color', 'Color for the active filtered subcategory link (such as the "Anime" and "Printed Media" or "PV" and "DVD" links).',
            {default: '#fe2a73'}));

        delicious.settings.insertSection(section);
    }

    return {
        animeMusicActiveColor: delicious.settings.get('animeMusicActiveColor', "#0090ff"),
        subcategoriesActiveColor: delicious.settings.get('subcategoriesActiveColor', "#fe2a73")
    };
}

(function() {
    'use strict';

    const settings = deliciousSettings();

    // Only run in search page
    if (window.location.pathname === "/user.php") {
        return;
    }

    // Prep work
    const currentCategory = categoryKeyFromLink(window.location.href);
    const categoryNumber = parseInt(currentCategory.slice(11, -1));

    // Move inside Anime or inside Music between categories
    $('#categories > li > a').each(function () {
        const thisLinkCategory = categoryKeyFromLink($(this).prop('href'));

        // Make url without category filter
        const targetUrl = new URL(window.location.href);
        if(currentCategory) {
            targetUrl.searchParams.delete(currentCategory);
        }

        // Uncategory search
        if (thisLinkCategory === currentCategory) {
            $(this).css('color', settings.subcategoriesActiveColor);
            $(this).prop('href', targetUrl.toString())
            return;
        }

        // intentionally not editing search params to avoid encoding the "[]"
        if (targetUrl.search) {
            targetUrl.search += `&${thisLinkCategory}=1`;
        } else {
            targetUrl.search = `?${thisLinkCategory}=1`;
        }
        $(this).prop('href', targetUrl.toString());
    });

    // Move between Anime and Music
    const animeLink = $('#browse_nav_sections > h2 > a[href="/torrents.php"]');
    const musicLink = $('#browse_nav_sections > h2 > a[href="/torrents2.php"]');

    // highlight active
    const isMusic = window.location.pathname.startsWith('/torrents2.php');
    const activeLink = isMusic ? musicLink : animeLink;
    activeLink.css('color', settings.animeMusicActiveColor);
    activeLink.css('cursor', 'default');
    activeLink.attr('href', 'javascript:void(0);');

    // Hide category specific filters for filtered out categories
    if (!isMusic && categoryNumber) {
        $(`#accordion > h3:not(#ui-id-${categoryNumber*2+1}):not(#ui-id-1)`).hide();
    }

    // Patch href
    const ANIME_MUSIC_SHARED_PARAMS = ['year', 'year2', 'tags', 'sort', 'way', 'showhidden', 'freeleech'];
    const params = new URL(window.location.href).searchParams;
    for (const [key, value] of [...params.entries()]) {
        if (isMusic && key === 'groupname') {
            params.set('searchstr', value)
        }
        if (!isMusic && key === 'searchstr') {
            params.set('groupname', value)
        }

        if (!ANIME_MUSIC_SHARED_PARAMS.includes(key)) {
            params.delete(key);
        }
    }

    if (isMusic) {
        animeLink.attr('href', `/torrents.php?${params.toString()}`);
    } else {
        musicLink.attr('href', `/torrents2.php?${params.toString()}`)
    }
})();