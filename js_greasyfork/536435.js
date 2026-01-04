// ==UserScript==
// @name         AnimeStars Clan Highlighter
// @namespace    animestars
// @author       Allystark
// @version      1.7
// @description  Shows a clan icon next to any username on the site that belongs to your clan
// @match        https://astars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://as1.astars.club/*
// @match        https://asstars.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536435/AnimeStars%20Clan%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/536435/AnimeStars%20Clan%20Highlighter.meta.js
// ==/UserScript==

;(async function() {
    'use strict';

    const STORAGE_KEY = 'myClanData';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day
    const DEFAULT_ICON = '🐇';

    async function getClanData() {
        let raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                if (Date.now() - data.fetched < CACHE_DURATION) {
                    return data;
                }
            } catch {}
        }
        const menu = document.querySelector('.lgn__menus .lgn__menu');
        const clubA = menu?.querySelector('a[href^="/clubs/"]');
        if (!clubA) return { members: [], icon: null, fetched: Date.now() };

        const res = await fetch(clubA.href, { credentials: 'include' });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const members = Array.from(doc.querySelectorAll('.club__member-name'))
        .map(el => el.textContent.trim());
        const iconEl = doc.querySelector('.nclub-enter__main-name img');
        const icon = iconEl ? iconEl.src : null;

        const clanData = { members, icon, fetched: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clanData));
        return clanData;
    }

    function annotateEl(container, iconUrl, offsetBottom=-4, offsetLeft=-4) {
        // avoid double-annotation
        if (container.querySelector('.clan-marker')) return;
        container.style.position = container.style.position || 'relative';

        const marker = iconUrl
        ? document.createElement('img')
        : document.createElement('span');

        marker.className = 'clan-marker';
        Object.assign(marker.style, {
            position: 'absolute',
            bottom: `${offsetBottom}px`,
            left:   `${offsetLeft}px`,
            width:  iconUrl ? '16px' : 'auto',
            height: iconUrl ? '16px' : 'auto',
            fontSize: iconUrl ? '' : '16px',
            lineHeight: iconUrl ? '' : '1',
            borderRadius: '0px'
        });

        if (iconUrl) {
            marker.src = iconUrl;
            marker.alt = 'Clan icon';
        } else {
            marker.textContent = DEFAULT_ICON;
        }
        container.append(marker);
    }

    function scanAndAnnotate(members, icon) {
        // 1) card owners
        document.querySelectorAll('a.card-show__owner').forEach(a => {
            const name = a.querySelector('.card-show__owner-name')?.textContent.trim();
            if (name && members.includes(name)) annotateEl(a, icon);
        });

        // 2) wishlisted/not needed
        document.querySelectorAll('a.profile__friends-item').forEach(a => {
            const name = a.querySelector('.profile__friends-name')?.textContent.trim();
            if (name && members.includes(name)) annotateEl(a, icon);
        });

        // 3) card author
        document.querySelectorAll('a.ncard__meta-item.ncard__user-name').forEach(a => {
            const name = Array.from(a.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim()).join('');
            if (name && members.includes(name)) annotateEl(a, icon, 10, 12);
        });

        // 4) dropdown notifications
        document.querySelectorAll('div.dropdown-item').forEach(div => {
            const link = div.querySelector('span.font-weight-bold a[href^="/user/"]');
            const name = link?.textContent.trim();
            if (name && members.includes(name)) annotateEl(div, icon, 26, 8);
        });

        // 5) trade list items
        document.querySelectorAll('a.trade__list-item').forEach(el => {
            const txt = el.querySelector('.trade__list-name')?.textContent.trim() || '';
            const avatar = el.querySelector('div.trade__list-image');
            const name = txt.replace(/^от |^для /, '').trim();
            if (name && members.includes(name)) annotateEl(avatar, icon);
        });

        // 6) notification blocks
        document.querySelectorAll('div.notification').forEach(el => {
            const link = el.querySelector('.notification__text a[href^="/user/"]');
            const name = link?.textContent.trim();
            if (name && members.includes(name)) annotateEl(el, icon, 8, 8);
        });

        // 7) trade header
        document.querySelectorAll('div.trade__header').forEach(div => {
            const name = div.querySelector('a.trade__header-name')?.textContent.trim() || '';
            const avatar = div.querySelector('a.trade__header-avatar');
            if (name && members.includes(name)) annotateEl(avatar, icon, -8, -8);
        });

        // 8) trade history names
        document.querySelectorAll('div.history__name a[href^="/user/"]')
            .forEach(a => {
            const name = a.textContent.trim();
            if (name && members.includes(name)) annotateEl(a.parentElement.parentElement, icon, 0, 0);
        });

        // 9) PMs list
        document.querySelectorAll('a.dpm-users-profile').forEach(a => {
            const match = a.href.match(/\/pm\/([^\/]+)\//);
            const name = match ? match[1] : null;
            const avatar = a.querySelector('div.dpm-users-left');
            if (name && members.includes(name)) annotateEl(avatar, icon);
        });

        // 10) PM header profile
        document.querySelectorAll('a.dpm-header-profile').forEach(a => {
            let match = a.href.match(/\/user\/([^\/]+)\//);
            let name = match ? match[1] : null;
            if (name && members.includes(name)) annotateEl(a.parentElement, icon, 16, 16);
        });

        // 11) exchange offer
        document.querySelectorAll('div.noffer__tech-row b').forEach(b => {
            let name = b.textContent;
            if (name && members.includes(name)) annotateEl(b, icon, 2, -20);
        });

        // 12) user's collection
        document.querySelectorAll('h1.ncard__main-title a[href^="/user/"]').forEach(a => {
            const name = a.textContent.trim();
            if (name && members.includes(name)) annotateEl(a, icon, -8, 0);
        });

        // 13) users' top
        document.querySelectorAll('div.ncard__users-toplist a.card-inline').forEach(a => {
            const name = a.querySelector('.card-inline__name')?.textContent.trim();
            if (name && members.includes(name)) annotateEl(a, icon, 0, 0);
        });

        // 14) friends list
        document.querySelectorAll('div.usn-fr-list div.card-inline').forEach(el => {
            const a = el.querySelector('a.pc_gs');
            const name = a?.textContent.trim();
            if (name && members.includes(name)) annotateEl(el, icon, 0, 0);
        });

    }

    const { members, icon } = await getClanData();
    scanAndAnnotate(members, icon);

    new MutationObserver(() => scanAndAnnotate(members, icon))
        .observe(document.body, { childList: true, subtree: true });
})();
