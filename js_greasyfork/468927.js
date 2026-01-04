// ==UserScript==
// @name         Steam advance Downloads links in store
// @namespace    Wizzergod
// @description  Steam advance Downloads links in store to search and download for free ;)
// @version      3.2.5
// @license      MIT
// @match        *://store.steampowered.*/app/*
// @exclude      *://steamcommunity.*/*
// @match        *://www.gog.com/*/game/*
// @match        *://store.steampowered.*/*
// @match        *://*.steampowered.*/*
// @exclude      *://*.steampowered.com/bundle/*
// @icon         https://bit.ly/3Jj2YMu
// @grant        GM_addStyle
// @credits      Wizzergod
// @downloadURL https://update.greasyfork.org/scripts/468927/Steam%20advance%20Downloads%20links%20in%20store.user.js
// @updateURL https://update.greasyfork.org/scripts/468927/Steam%20advance%20Downloads%20links%20in%20store.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(`
    .custom_game_purchase_action_bg {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: stretch;
        gap: 4px;
        width: 100%;
        padding: 4px 0 10px 0;
    }
    .custom_demoGameBtn {
        flex: 1 1 auto;
        display: flex;
        margin: 1px;
    }
    .custom_btn_green_steamui,
    .custom_btnv6_lightblue_blue,
    .custom_btn_blue_steamui,
    .custom_btnv6_blue_hoverfade,
    .pcgamewiki,
    .Ccyan,
    .Corange,
    .Cdarkorange,
    .Cgog {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: white;
        text-decoration: none;
        text-transform: uppercase;
        padding: 10px 15px;
        border-radius: 3px;
        box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.4);
        transition: background .3s ease,transform .3s ease,box-shadow .3s ease;
      /*
        transition: background 0.3s;
        transition: background .2s ease,transform .2s ease,box-shadow .2s ease;
      */
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
        line-height: 1.2;
        white-space: nowrap;
    }
    .custom_btn_green_steamui:hover,
    .custom_btnv6_lightblue_blue:hover,
    .custom_btn_blue_steamui:hover,
    .custom_btnv6_blue_hoverfade:hover,
    .pcgamewiki:hover,
    .Ccyan:hover,
    .Corange:hover,
    .Cdarkorange:hover,
    .Cgog:hover {
        filter: blur(0.5px) brightness(0.7);
        z-index: 0;
    }
    /* for buttons can use radial-gradient colors if need   background-image: radial-gradient(ellipse at top left, #5c7e10, #5c7e11); */
    .custom_btn_green_steamui { background-color: #5c7e10; }
    .custom_btn_green_steamui:hover { background-color: #4b670d; }
    .custom_btnv6_lightblue_blue { background-color: #417a9b; }
    .custom_btnv6_lightblue_blue:hover { background-color: #35637a; }
    .custom_btn_blue_steamui { background-color: #1b2838; }
    .custom_btn_blue_steamui:hover { background-color: #16202d; }
    .custom_btnv6_blue_hoverfade { background-color: #176aa6; }
    .custom_btnv6_blue_hoverfade:hover { background-color: #0f4a73; }
    .pcgamewiki { background-color: #556db3; }
    .pcgamewiki:hover { background-color: #495e9b; }
    .Ccyan { background-color: #008669; }
    .Ccyan:hover { background-color: #008064; }
    .Corange { background-color: #e68a00 !important; }
    .Corange:hover { background-color: #c87801 !important; }
    .Cdarkorange { background-color: #d84a00; }
    .Cdarkorange:hover { background-color: #c44706; }
    .Cgog { background-color: rgb(109, 11, 171); }
    .Cgog:hover { background-color: rgba(109, 11, 171, 0.64); }
`);


    function createGameLink(url, label, className) {
        var linkContainer = document.createElement('div');
        linkContainer.className = 'custom_demoGameBtn custom_btn_addtocart';

        var link = document.createElement('a');
        link.target = '_blank';
        link.className = className;
        link.href = url;
        link.rel = 'noopener noreferrer';

        var linkText = document.createElement('span');
        linkText.textContent = label;

        link.appendChild(linkText);
        linkContainer.appendChild(link);

        return linkContainer;
    }

    var gameTitle = document.createElement('h1');
    gameTitle.textContent = 'Free download from torrents.';

    var discountCountdown = document.createElement('p');
    discountCountdown.textContent = 'These links lead to the search feature on specified websites, and remember piracy is bad if you downloaded, played and liked the game, then buy it, so you will thank the developers!';

    var gamePurchaseAction = document.createElement('div');
    gamePurchaseAction.className = 'custom_game_purchase_action';

    var gamePurchaseActionBg = document.createElement('div');
    gamePurchaseActionBg.className = 'custom_game_purchase_action_bg';

    function sanitizeTitle(title) {
        return title
            .replace(/™|®|©/g, '')
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .trim();
    }

    var titleElement = document.querySelector('#appHubAppName .apphub_AppName, span[itemprop="name"]');
    var gameTitleText = titleElement ? sanitizeTitle(titleElement.textContent) : '';

    //gameappid
    var appidElement = document.querySelector('[data-appid]');
    var gameappid = appidElement ? appidElement.getAttribute('data-appid') : '';
    //or
    var gsidElement = document.querySelector('[data-miniprofile-appid]');
    var gsid = gsidElement ? gsidElement.getAttribute('data-miniprofile-appid') : '';
    if (!gsid) {
        gsidElement = document.querySelector('[data-appid]');
        gsid = gsidElement ? gsidElement.getAttribute('data-appid') : '';
    }
    //gameappid

    var links = [
        { url: 'https://rutracker.org/forum/tracker.php?nm=' + encodeURIComponent(gameTitleText), label: 'rutracker', className: 'custom_btn_green_steamui' },
        { url: 'https://thelastgame.club/?do=search&subaction=search&story=' + encodeURIComponent(gameTitleText), label: 'thelastgame.(club)', className: 'custom_btn_green_steamui' },
        { url: 'https://thelastgame.ru/?s=' + encodeURIComponent(gameTitleText), label: 'thelastgame.(ru)', className: 'custom_btn_green_steamui' },
        { url: 'https://thelastgame.org/?do=search&subaction=search&story=' + encodeURIComponent(gameTitleText), label: 'thelastgame.org', className: 'custom_btn_green_steamui' },
        { url: 'https://www.limetorrents.lol/search/games/' + encodeURIComponent(gameTitleText), label: 'limetorrents', className: 'custom_btn_green_steamui' },
        { url: 'https://1337x.to/search/' + encodeURIComponent(gameTitleText) + '/1/', label: '1337x', className: 'custom_btn_green_steamui' },
        { url: 'https://thepiratebay.org/search.php?cat=401&q=' + encodeURIComponent(gameTitleText), label: 'thepiratebay', className: 'custom_btn_green_steamui' },
        { url: 'https://igrovaya.org/?do=search&subaction=search&story=' + encodeURIComponent(gameTitleText), label: 'igrovaya', className: 'custom_btn_green_steamui' },
        { url: 'https://www.torrentdownloads.pro/search/?search=' + encodeURIComponent(gameTitleText), label: 'torrentdownloads.(pro)', className: 'custom_btn_green_steamui' },
        { url: 'https://www.torrentdownload.info/search?q=' + encodeURIComponent(gameTitleText), label: 'torrentdownload.(info)', className: 'custom_btn_green_steamui' },
        { url: 'https://catorrent.org/index.php?do=search&subaction=search&story=' + encodeURIComponent(gameTitleText), label: 'catorrent', className: 'custom_btn_green_steamui' },
        { url: 'https://repack-games.ru/index.php?do=search&subaction=search&story=' + encodeURIComponent(gameTitleText), label: 'repack-games', className: 'custom_btn_green_steamui' },
        { url: 'https://gamestracker.org/search/?q=' + encodeURIComponent(gameTitleText), label: 'gamestracker', className: 'custom_btn_green_steamui' },
        { url: 'https://nnmclub.to/forum/tracker.php?nm=' + encodeURIComponent(gameTitleText), label: 'nnmclub', className: 'custom_btn_green_steamui' },
        { url: 'https://thebyrut.org/?do=search&subaction=search&story=' + encodeURIComponent(gameTitleText), label: 'byrut', className: 'custom_btn_green_steamui' },
        { url: 'https://pcgamestorrents.com/?s=' + encodeURIComponent(gameTitleText), label: 'pcgamestorrents.(com)', className: 'custom_btn_green_steamui' },
        { url: 'https://hisgames.org/search?searchphrase=all&searchword=' + encodeURIComponent(gameTitleText), label: 'hisgames', className: 'custom_btn_green_steamui' },
        { url: 'https://freegogpcgames.com/?s=' + encodeURIComponent(gameTitleText), label: 'Gog:freegogpcgames', className: 'Cgog' },
        { url: 'https://gogunlocked.com/?s=' + encodeURIComponent(gameTitleText), label: 'Gog:gogunlocked', className: 'Cgog' },
        { url: 'https://gog-games.to/?q=' + encodeURIComponent(gameTitleText), label: 'Gog:gog-games', className: 'Cgog' },
        { url: 'https://small-games.info/?go=search&search_text=' + encodeURIComponent(gameTitleText), label: 'small-games.(info)', className: 'custom_btnv6_lightblue_blue' },
        { url: 'https://www.old-games.ru/catalog/?gamename=' + encodeURIComponent(gameTitleText), label: 'old-games', className: 'custom_btnv6_lightblue_blue' },
        { url: 'https://www.pcgamingwiki.com/api/appid.php?appid=' + encodeURIComponent(gameappid), label: 'PCGamingWiki', className: 'pcgamewiki' },
        { url: 'https://f95zone.to/search/search?keywords=' + encodeURIComponent(gameTitleText), label: 'Forum: f95zone', className: 'custom_btnv6_blue_hoverfade' },
        { url: 'https://cs.rin.ru/forum//search.php?st=0&sk=t&sd=d&sr=topics&terms=any&sf=titleonly&keywords=' + encodeURIComponent(gameTitleText), label: 'cs.(rin)', className: 'custom_btnv6_blue_hoverfade' },
        { url: 'https://www.gogdb.org/products?search=' + encodeURIComponent(gameTitleText), label: 'View on GogDB', className: 'custom_btnv6_blue_hoverfade' },
        { url: 'https://steamdb.info/app/' + encodeURIComponent(gameappid), label: 'STEAMDB', className: 'custom_btnv6_blue_hoverfade' }
    ];

    var row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexWrap = 'wrap';

    links.forEach(function(linkInfo) {
        var link = createGameLink(linkInfo.url, linkInfo.label, linkInfo.className);
        row.appendChild(link);
    });

    var gameLinksDiv = document.createElement('div');
    gameLinksDiv.className = 'custom_game_area_purchase_game';

    gamePurchaseActionBg.appendChild(row);
    gamePurchaseAction.appendChild(gamePurchaseActionBg);
    gameLinksDiv.appendChild(gameTitle);
    gameLinksDiv.appendChild(discountCountdown);
    gameLinksDiv.appendChild(gamePurchaseAction);

    var targetElement = document.querySelector('.game_area_purchase');
    if (targetElement) {
        targetElement.parentNode.insertBefore(gameLinksDiv, targetElement);
    }

    var elements = document.getElementsByClassName('early_access_header');
    Array.from(elements).forEach(function(element) {
        element.parentNode.removeChild(element);
    });
})();