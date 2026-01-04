// ==UserScript==
// @name         Steam/GOG Game Torrent Search Modal
// @namespace    GPT
// @version      1.1.2
// @author       Wizzergod
// @description  Shows a modal window with buttons for searching games on torrent sites with links to sources of information about games: Steam, GOG, trackers, wikis, etc.
// @description:ru  Показывает модальное окно с кнопками для поиска игр на торрент-сайтах со ссылками на источники информации об играх: Steam, GOG, трекеры, вики и прочее
// @match        *://store.steampowered.*/app/*
// @match        *://www.gog.com/*/game/*
// @match        *://store.steampowered.*/*
// @match        *://*.steampowered.*/*
// @match        *://steamcommunity.com/app/*
// @match        *://steamdb.info/*
// @match        *://www.gogdb.org/*
// @match        *://*.gogdb.org/*
// @match        *://gogdb.org/*
// @match        *://store.epicgames.com/ru/p/*
// @match        *://store.epicgames.com/*/p/*
// @match        *://*.epicgames.com/*/p/*
// @exclude      *://*.steampowered.com/bundle/*
// @exclude      *://steamcommunity.*/*
// @exclude      *://store.steampowered.com/tags/*
// @icon         https://bit.ly/3Jj2YMu
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-body
// @license      MIT
// @resource downloadURL https://update.greasyfork.org/scripts/533684/SteamGOG%20Game%20Torrent%20Search%20Modal.user.js
// @downloadURL https://update.greasyfork.org/scripts/533684/SteamGOG%20Game%20Torrent%20Search%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/533684/SteamGOG%20Game%20Torrent%20Search%20Modal.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const STYLE_PREFIX = 'gls-'; // Game Links Styles prefix

    GM_addStyle(`
        .${STYLE_PREFIX}modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0,0,0,0.75) !important;
            z-index: 9999 !important;
            display: none;
            justify-content: center !important;
            align-items: center !important;
            transform: scale(1.2) !important;
        }
        .${STYLE_PREFIX}modal-content {
            background: #1b1d23f0 !important;
            color: white !important;
            padding: 20px !important;
            border-radius: 12px !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            width: 700px !important;
            box-shadow: 0 0 20px #000 !important;
            position: relative !important;
        }
        .${STYLE_PREFIX}modal-content h2 {
            margin-top: 0 !important;
            font-size: 1.5em !important;
            text-shadow: 0.5px 0.5px 1px black, 0 0 0.5em #cccccc5c, 0 0 0.5em #cccccc78;
        }
        .${STYLE_PREFIX}modal-content h3 {
            text-shadow: 0.5px 0.5px 1px black, 0 0 0.5em #cccccc5c, 0 0 0.5em #cccccc78;
        }
        .${STYLE_PREFIX}section {
            margin-top: 20px !important;
        }
        .${STYLE_PREFIX}section h3 {
            margin: 0 0 10px !important;
            border-bottom: 1px solid #444 !important;
            padding-bottom: 5px !important;
            font-size: 1.2em !important;
        }
        .${STYLE_PREFIX}btn {
            display: inline-block !important;
            padding: 5px 14px !important;
            margin: 2px !important;
            border-radius: 6px !important;
            text-decoration: none !important;
            font-size: 16px !important;
            font-weight: bold !important;
            transition: background 0.3s !important;
            opacity: 0.9 !important;
        }
        .${STYLE_PREFIX}steam {
          background: #5c7e10 !important;
          color: white !important;
          text-shadow: 2px 2px 2px #4b670d, 0 0 0.5em #5c7e10, 0 0 0.5em #5c7e10;
          }
        .${STYLE_PREFIX}steam:hover {
          background: #4b670d !important; }

        .${STYLE_PREFIX}gog {
          background: #0058a3 !important;
          color: white !important;
          text-shadow: 2px 2px 2px #004080, 0 0 0.5em #0058a3, 0 0 0.5em #0058a3;
}
        .${STYLE_PREFIX}gog:hover {
          background: #004080 !important; }

        .${STYLE_PREFIX}torrent {
          background: #6e35a3 !important;
          color: white !important;
          text-shadow: 2px 2px 2px #582980, 0 0 0.5em #6e35a3, 0 0 0.5em #6e35a3;
}
        .${STYLE_PREFIX}torrent:hover {
          background: #582980 !important; }

        .${STYLE_PREFIX}other {
          background: #444 !important;
          color: white !important;
          text-shadow: 2px 2px 2px #333, 0 0 0.5em #444, 0 0 0.5em #444;
}
        .${STYLE_PREFIX}other:hover {
          background: #333 !important; }

        .${STYLE_PREFIX}mods {
          background: #35a375 !important;
          color: white !important;
          text-shadow: 2px 2px 2px #35a37599, 0 0 0.5em #35a375, 0 0 0.5em #35a375;
}
        .${STYLE_PREFIX}mods:hover {
          background: #35a37599 !important; }

        .${STYLE_PREFIX}close {
            float: right !important;
            background: #ffffff12 !important;
            border: none !important;
            color: white !important;
            font-size: 40px !important;
            cursor: pointer !important;
            margin-top: -25px !important;
            margin-right: -5px !important;
            border-radius: 0 0 6px 6px !important;
            padding: 1px 15px !important;
            transition: background 0.3s !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
            text-shadow: 2px 2px 2px black, 0 0 0.5em #cccccc5c, 0 0 0.5em #cccccc78;
        }
        .${STYLE_PREFIX}close:hover { background: #4b670d !important; }
        .${STYLE_PREFIX}open-btn:hover { background: #333 !important; }
        .${STYLE_PREFIX}open-btn:active { background: #4b670d !important; }

        .${STYLE_PREFIX}open-btn {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: #008669 !important;
            color: white !important;
            padding: 12px 16px !important;
            border-radius: 10px !important;
            font-size: 20px !important;
            border: none !important;
            cursor: pointer !important;
            z-index: 9999 !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
            transition: background 0.3s !important;
            text-shadow: 2px 2px 2px black, 0 0 0.5em #cccccc5c, 0 0 0.5em #cccccc78;
        }
    `);

    const modal = document.createElement("div");
    modal.className = `${STYLE_PREFIX}modal`;
    modal.innerHTML = `
        <div class="${STYLE_PREFIX}modal-content">
            <button class="${STYLE_PREFIX}close">&times;</button>
            <h2>🎮 Steam/GOG Game Torrent Search, and more</h2>
            <div id="${STYLE_PREFIX}container"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const openBtn = document.createElement("button");
    openBtn.className = `${STYLE_PREFIX}open-btn`;
    openBtn.textContent = "☰";
    document.body.appendChild(openBtn);

    const closeBtn = modal.querySelector(`.${STYLE_PREFIX}close`);
    const content = modal.querySelector(`.${STYLE_PREFIX}modal-content`);

    closeBtn.onclick = () => modal.style.display = "none";
    modal.addEventListener("click", e => {
        if (!content.contains(e.target)) modal.style.display = "none";
    });

    openBtn.onclick = () => {
        let title = document.querySelector('span[itemprop="name"]')?.innerText?.trim()
                  || document.querySelector('#appHubAppName.apphub_AppName')?.innerText?.trim()
                  || document.querySelector('.productcard-basics__title')?.innerText?.trim()
                  || document.title.split('on Steam')[0].trim();

        title = cleanTitle(title);
        const html = buildLinks(title);
        document.getElementById(`${STYLE_PREFIX}container`).innerHTML = html;
        modal.style.display = "flex";
    };

    function cleanTitle(rawTitle) {
        return rawTitle
            .replace(/\s*\|\s*Загружайте.*Epic Games Store/i, '')
            .replace(/[\u2122\u00AE\u00A9]/g, '')
            .replace(/&/g, ' ')
            .replace(/[:@|&™®©\[\]{}()"“”‘’«»\-–—_+=*~#^%$!?,.<>\\\/]/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\s*·\s*SteamDB\s*/g, '')
            .replace(/\s*GOG\s+Database\s*/g, '')
            .replace(/\s*Price\s+history\s*/gi, '')
            .trim();
    }

    function getColorClass(group) {
        if (group.includes('Steam')) return `${STYLE_PREFIX}steam`;
        if (group.includes('GOG')) return `${STYLE_PREFIX}gog`;
        if (group.includes('Torrent')) return `${STYLE_PREFIX}torrent`;
        if (group.includes('Mods')) return `${STYLE_PREFIX}mods`;
        return `${STYLE_PREFIX}other`;
    }

    function buildLinks(passedTitle) {
        const rawTitle = passedTitle
            || document.querySelector('.pagehead-title h1')?.textContent?.trim()
            || document.querySelector('#appHubAppName.apphub_AppName')?.textContent?.trim()
            || document.querySelector('#page > h1')?.textContent?.trim()
            || '';
        const encTitle = encodeURIComponent(rawTitle);

        const appid = document.querySelector('[data-appid]')?.getAttribute('data-appid')
                    || document.querySelector('[data-miniprofile-appid]')?.getAttribute('data-miniprofile-appid') || '';

//        const searchin = appid ? appid : encTitle;
        const sections = {
            '🔰 Steam': [
                { label: 'STEAMDB (SteamAppID)', url: `https://steamdb.info/app/${appid}` },
                { label: 'STEAMDB (GameTitle)', url: `https://steamdb.info/search/?a=all&q=${encTitle}` },
                { label: 'Card Exchange', url: `https://www.steamcardexchange.net/index.php?gamepage-appid-${appid}` },
            ],
            '💫 GOG': [
                { label: 'Gogdb', url: `https://www.gogdb.org/products?search=${encTitle}` },
                { label: 'Freegogpcgames', url: `https://freegogpcgames.com/?s=${encTitle}` },
                { label: 'Gog-games', url: `https://gog-games.to/?q=${encTitle}&search=${encTitle}` },
                { label: 'Gogunlocked', url: `https://gogunlocked.com/?s=${encTitle}` }
            ],
            '✨ Torrents': [
                { label: '⭐Rutracker', url: `https://rutracker.org/forum/tracker.php?nm=${encTitle}` },
                { label: '⭐Nnmclub', url: `https://nnmclub.to/forum/tracker.php?nm=${encTitle}` },
                { label: '⭐Catorrent', url: `https://catorrent.org/index.php?do=search&subaction=search&story=${encTitle}` },
                { label: '⭐Gamestracker', url: `https://gamestracker.org/search/?q=${encTitle}` },
                { label: '⭐repack-games', url: `https://repack-games.ru/index.php?do=search&subaction=search&story=${encTitle}` },
                { label: '⭐Byrut', url: `https://thebyrut.org/?do=search&subaction=search&story=${encTitle}` },
                { label: '⭐Hisgames', url: `https://hisgames.org/search?searchphrase=all&searchword=${encTitle}` },
                { label: '⭐Igrovaya', url: `https://igrovaya.org/?do=search&subaction=search&story=${encTitle}&todo=igrovuha.org` },
                { label: '⭐Thelastgame.ru', url: `https://thelastgame.ru/?s=${encTitle}` },
                { label: '⭐Thelastgame.org', url: `https://thelastgame.org/?do=search&subaction=search&story=${encTitle}` },
                { label: '⭐GMT-max.info', url: `https://gmt-max.info/?do=search&subaction=search&story=${encTitle}` },
                { label: '⭐PiratBIT', url: `https://pb.wtf/tracker/?ss=${encTitle}` },
                { label: 'Torrentdownloads.pro', url: `https://www.torrentdownloads.pro/search/?search=${encTitle}` },
                { label: 'Torrentdownload.info', url: `https://www.torrentdownload.info/search?q=${encTitle}` },
                { label: '1337x', url: `https://1337x.to/search/${encTitle}/1/` },
                { label: 'Thepiratebay', url: `https://thepiratebay.org/search.php?cat=401&q=${encTitle}` }
            ],
            '🧩 Another': [
                { label: 'PCGamingWiki (SteamAppID)', url: `https://www.pcgamingwiki.com/api/appid.php?appid=${appid}` },
                { label: 'PCGamingWiki (GameTitle)', url: `https://www.pcgamingwiki.com/w/index.php?search=${encTitle}` },
                { label: 'Old-games', url: `https://www.old-games.ru/catalog/?gamename=${encTitle}` },
                { label: 'Small-games.info', url: `https://small-games.info/?go=search&search_text=${encTitle}` },
                { label: 'myabandonware', url: `https://www.myabandonware.com/search/q/${encTitle}` },
                { label: 'Cs.rin', url: `https://cs.rin.ru/forum//search.php?st=0&sk=t&sd=d&sr=topics&terms=any&sf=titleonly&keywords=${encTitle}` },
                { label: 'F95zone - Adult 18+', url: `https://f95zone.to/search/search?keywords=${encTitle}` },
                { label: 'Widescreen Fixes Pack', url: `https://github.com/ThirteenAG/WidescreenFixesPack/releases?q=${encTitle}&expanded=true` },
                { label: 'FlawlessWideScreen', url: `https://flawlesswidescreen.org/#${encTitle}` }
            ],
            '🛠️ Mods': [
                { label: 'NexusMods', url: `https://www.nexusmods.com/search?keyword=${encTitle}` },
                { label: 'MODDB', url: `https://www.moddb.com/search?q=${encTitle}` },
                { label: 'GameBanana', url: `https://gamebanana.com/search?_sSearchString=${encTitle}` },
                { label: 'GameFront', url: `https://www.gamefront.com/search?q=${encTitle}` },
                { label: 'CurseForge', url: `https://www.curseforge.com/games?search=${encTitle}` },
                { label: 'WeMod', url: `https://www.wemod.com/cheats?q=${encTitle}` }
            ]
        };
// #35a375#358fa3#a39535#3ca335
        return Object.entries(sections).map(([group, links]) => {
            const colorClass = getColorClass(group);
            return `
                <div class="${STYLE_PREFIX}section">
                    <h3>${group}</h3>
                    ${links.map(link => `<a class="${STYLE_PREFIX}btn ${colorClass}" target="_blank" rel="noopener noreferrer" href="${link.url}">${link.label}</a>`).join('')}
                </div>
            `;
        }).join('');
    }
})();

