// ==UserScript==
// @name         WOW Cross Link : Raider.IO, WoWProgress, Warcraft Logs (Characters & Guilds)
// @namespace    https://tampermonkey.net/
// @version      3.1
// @description  Ajoute liens croisés entre Raider.IO, WoWProgress, Warcraft Logs pour personnages et guildes, avec support SPA Raider.IO et bouton stylé Warcraft Logs guild.
// @match        https://raider.io/characters/*
// @match        https://raider.io/guilds/*
// @match        https://www.wowprogress.com/character/*
// @match        https://www.wowprogress.com/guild/*
// @match        https://www.warcraftlogs.com/character/*
// @match        https://www.warcraftlogs.com/guild/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539215/WOW%20Cross%20Link%20%3A%20RaiderIO%2C%20WoWProgress%2C%20Warcraft%20Logs%20%28Characters%20%20Guilds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539215/WOW%20Cross%20Link%20%3A%20RaiderIO%2C%20WoWProgress%2C%20Warcraft%20Logs%20%28Characters%20%20Guilds%29.meta.js
// ==/UserScript==

// Script 1: Raider.IO → WoWProgress
(function () {
    'use strict';

    function formatRealm(realm) {
        return realm
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/([a-zA-Z])(\d)/g, '$1-$2')
            .toLowerCase();
    }

    function createIconLink(url, title) {
        const link = document.createElement('a');
        link.href = url;
        link.title = title;
        link.target = '_blank';
        link.rel = 'noopener';
        link.className = 'slds-avatar slds-avatar--small slds-m-left--large rio-profile-links wowprogress';

        const icon = document.createElement('img');
        icon.src = 'https://www.wowprogress.com/favicon.ico';
        icon.alt = 'WoWProgress';
        icon.style.width = '100%';
        icon.style.height = '100%';
        icon.style.borderRadius = '50%';

        link.appendChild(icon);
        return link;
    }

    const interval = setInterval(() => {
        const path = window.location.pathname;
        const parts = path.split('/');
        const type = parts[1];
        const region = parts[2];
        const rawRealm = parts[3];
        const name = parts[4];
        const realm = formatRealm(rawRealm);

        let container = null;
        let targetSelector = '';

        if (type === 'characters') {
            targetSelector = 'header.slds-clearfix .slds-float--right';
        } else if (type === 'guilds') {
            targetSelector = 'th.slds-clearfix .slds-float--right';
        } else {
            return;
        }

        container = document.querySelector(targetSelector);
        if (!container) return;

        clearInterval(interval);

        const wpURL =
            type === 'characters'
                ? `https://www.wowprogress.com/character/${region}/${realm}/${name}`
                : `https://www.wowprogress.com/guild/${region}/${realm}/${name}`;

        const wpIcon = createIconLink(wpURL, 'Voir sur WoWProgress');
        container.appendChild(wpIcon);
    }, 300);
})();

// Script 2: WarcraftLogs → WoWProgress
(function () {
    'use strict';

    const WOWPROGRESS_ICON = 'https://www.wowprogress.com/favicon.ico';

    const capitalizeFirst = str => str ? str[0].toUpperCase() + str.slice(1) : '';

    const createLink = (url, imgClass, textClass, text) => {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.src = WOWPROGRESS_ICON;
        img.alt = 'WoWProgress';
        img.className = imgClass;

        a.appendChild(img);
        if (text) {
            const span = document.createElement('span');
            span.textContent = text;
            span.className = textClass;
            a.appendChild(span);
        }

        return a;
    };

    const addCharLink = () => {
        const charLink = document.querySelector('#character-name a.character-name-link');
        const serverLink = document.querySelector('#guild-and-server a#server-link');
        const container = document.querySelector('#gear-box-external-links');
        if (!charLink || !serverLink || !container) return;

        const charName = encodeURIComponent(capitalizeFirst(charLink.textContent.trim()));
        const match = serverLink.textContent.trim().match(/^(.+)\s+\((.+)\)$/);
        if (!match) return;

        const server = match[1].toLowerCase().replace(/\s+/g, '-');
        const region = match[2].toLowerCase();
        const url = `https://www.wowprogress.com/character/${region}/${server}/${charName}`;

        if (!container.querySelector(`a[href="${url}"]`)) {
            const a = createLink(url, 'external-icon');
            a.style.marginLeft = '6px';
            a.style.width = '20px';
            a.style.height = '20px';
            container.appendChild(a);
        }
    };

    const addGuildLink = () => {
        const waitFor = (selectors, callback, timeout = 10000) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const els = selectors.map(s => document.querySelector(s));
                if (els.every(Boolean)) {
                    clearInterval(interval);
                    callback(...els);
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                }
            }, 300);
        };

        const getNavMenu = () =>
            document.querySelector('.navigation ul.filter-bar-menu') ||
            document.querySelector('.guild-header__child-guilds .navigation ul.filter-bar-menu');

        waitFor(['.guild-header__name', '.guild-header__region-and-server a'], (nameEl, regionEl) => {
            const nav = getNavMenu();
            if (!nav || [...nav.querySelectorAll('a')].some(a => a.href.includes('wowprogress.com'))) return;

            const guild = nameEl.textContent.trim().replace(/\s+/g, ' ');
            const match = regionEl.textContent.trim().match(/^([A-Z]{2})\s*-\s*(.+)$/i);
            if (!match) return;

            const region = match[1].toLowerCase();
            const server = match[2].trim().toLowerCase().replace(/[\s']/g, '-');
            const guildUrl = guild.replace(/ /g, '+');
            const url = `https://www.wowprogress.com/guild/${region}/${server}/${guildUrl}`;

            const armoryLi = [...nav.querySelectorAll('li')].find(li =>
                li.textContent.includes('Armory') &&
                li.querySelector('a')?.href.includes('worldofwarcraft.com')
            );
            if (!armoryLi) return;

            const li = document.createElement('li');
            li.className = 'navigation__end-link';
            const link = createLink(url, 'guild-navigation__related-link-icon', 'guild-navigation__related-link-text', 'WowProgress');
            link.className = 'guild-navigation__related-link';
            li.appendChild(link);
            armoryLi.after(li);
        });
    };

    if (location.pathname.startsWith('/character/')) addCharLink();
    if (location.pathname.startsWith('/guild/')) addGuildLink();
})();

// Script 3: WoWProgress → Raider.IO & WarcraftLogs
(function() {
    'use strict';

    const raiderIOFavicon = 'https://raider.io/favicon.ico';
    const wclFavicon = 'https://blzgdapipro-a.akamaihd.net/favicon/wow.ico';

    function createLink(href, text, favicon, id) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.marginLeft = '6px';
        a.style.color = 'inherit';
        a.style.textDecoration = 'none';
        if (id) a.id = id;

        const img = document.createElement('img');
        img.src = favicon;
        img.width = 16;
        img.height = 16;
        img.style.marginRight = '4px';
        img.style.verticalAlign = 'middle';

        a.appendChild(img);
        a.appendChild(document.createTextNode(text));
        return a;
    }

    function formatServer(s) {
        return s.toLowerCase();
    }

    function formatGuildForUrl(guildRaw) {
        let decoded = decodeURIComponent(guildRaw.replace(/\+/g, ' '));
        return encodeURIComponent(decoded);
    }

    function formatGuildForWcl(guildRaw) {
        let decoded = decodeURIComponent(guildRaw.replace(/\+/g, ' '));
        return encodeURIComponent(decoded.toLowerCase());
    }

    function findArmoryLink() {
        const links = Array.from(document.querySelectorAll('a'));
        return links.find(a => a.textContent.trim().toLowerCase() === '(armory)');
    }

    function injectLinksCharacter() {
        const path = location.pathname.split('/');
        if(path.length < 5) return;

        const region = path[2];
        const rawServer = path[3];
        const character = path[4];

        const server = formatServer(rawServer);

        if(document.getElementById('extra-links-character')) return;

        const armoryLink = findArmoryLink();
        if(!armoryLink) return;

        const parent = armoryLink.parentNode;

        const raiderLink = createLink(`https://raider.io/characters/${region}/${server}/${character}`, 'Raider.IO', raiderIOFavicon);
        const wclLink = createLink(`https://www.warcraftlogs.com/character/${region}/${server}/${character.toLowerCase()}`, 'WarcraftLogs', wclFavicon);

        const container = document.createElement('span');
        container.id = 'extra-links-character';
        container.style.whiteSpace = 'nowrap';
        container.style.fontSize = '0.9em';
        container.style.marginLeft = '8px';

        container.appendChild(document.createTextNode(' | '));
        container.appendChild(raiderLink);
        container.appendChild(document.createTextNode(' | '));
        container.appendChild(wclLink);

        parent.insertBefore(container, armoryLink.nextSibling);
    }

    function injectLinksGuild() {
        const path = location.pathname.split('/');
        if(path.length < 5) return;

        const region = path[2];
        const rawServer = path[3];
        const rawGuild = decodeURIComponent(location.pathname.substring(location.pathname.indexOf(rawServer) + rawServer.length + 1)).replace(/^\/+/, '');

        const server = formatServer(rawServer);
        const guildForRaid = formatGuildForUrl(rawGuild);
        const guildForWcl = formatGuildForWcl(rawGuild);

        if(document.getElementById('extra-links-guild')) return;

        const armoryLink = findArmoryLink();
        if(!armoryLink) return;

        const parent = armoryLink.parentNode;

        const raiderLink = createLink(`https://raider.io/guilds/${region}/${server}/${guildForRaid}`, 'Raider.IO', raiderIOFavicon);
        const wclLink = createLink(`https://www.warcraftlogs.com/guild/${region}/${server}/${guildForWcl}`, 'WarcraftLogs', wclFavicon);

        const container = document.createElement('span');
        container.id = 'extra-links-guild';
        container.style.whiteSpace = 'nowrap';
        container.style.fontSize = '0.9em';
        container.style.marginLeft = '8px';

        container.appendChild(document.createTextNode(' | '));
        container.appendChild(raiderLink);
        container.appendChild(document.createTextNode(' | '));
        container.appendChild(wclLink);

        parent.insertBefore(container, armoryLink.nextSibling);
    }

    if(location.pathname.startsWith('/character/')) {
        injectLinksCharacter();
    } else if(location.pathname.startsWith('/guild/')) {
        injectLinksGuild();
    }
})();
