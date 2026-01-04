// ==UserScript==
// @name         GOG additional buttons and downloads
// @description Add GOG DB, GOG Games links to free download
// @version 1.0.5
// @author Wizzergod
// @license MIT
// @namespace GOG additional buttons and downloads
// @icon https://www.google.com/s2/favicons?sz=64&domain=www.gog.com
// @run-at document-end
// @match *://www.gog.com/*/game/*
// @match *://www.gog.com/game/*
// @match *://web.archive.org/web/*
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/470121/GOG%20additional%20buttons%20and%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/470121/GOG%20additional%20buttons%20and%20downloads.meta.js
// ==/UserScript==

(function() {
    var productcardData = unsafeWindow.productcardData;
    var product_title = productcardData.cardProduct.title;

    function sanitizeTitle(title) {
        return title
            .replace(/™|®|©/g, '')
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .trim();
    }

    var sanitized_title = sanitizeTitle(product_title);

    'use strict';

    var newBlock = document.createElement('div');
    newBlock.innerHTML = `
        <div class="title title--no-margin">
            <div class="title__underline-text">
                Free Games Downloads
            </div>
            <div class="title__additional-options"></div>
        </div>
        <div class="why-gog__item" style="background-color: #33333312; margin: 0; box-sizing: border-box;">
            <i>These links lead to the search feature on specified websites, and remember piracy is bad if you downloaded, played and liked the game, then buy it, so you will thank the developers!</i>
        </div>
    `;

    var links = [
        { url: "https://gog-games.to/?q=" + encodeURIComponent(sanitized_title), text: "Gog-games.to", color: "#1ee83a12" },
        { url: "https://gogunlocked.com/?s=" + encodeURIComponent(sanitized_title), text: "GoGUnlocked.com", color: "#1ee83a12" },
        { url: "https://freegogpcgames.com/?s=" + encodeURIComponent(sanitized_title), text: "FreeGogPcGames.com", color: "#1ee83a12" },
        { url: "https://www.torrentdownloads.pro/search/?search=" + encodeURIComponent(sanitized_title), text: "torrentdownloads.pro", color: "#1e7ee812" },
        { url: "https://www.torrentdownload.info/search?q=" + encodeURIComponent(sanitized_title), text: "torrentdownload.info", color: "#1e7ee812" },
        { url: "https://s1.thelastgame.club/?do=search&subaction=search&story=" + encodeURIComponent(sanitized_title), text: "thelastgame.club", color: "#1e7ee812" },
        { url: "https://www.limetorrents.lol/search/games/" + encodeURIComponent(sanitized_title), text: "limetorrents.lol", color: "#1e7ee812" },
        { url: "https://thepiratebay.org/search.php?cat=401&q=" + encodeURIComponent(sanitized_title), text: "thepiratebay.org", color: "#1e7ee812" },
        { url: "https://thelastgame.org/?do=search&subaction=search&story=" + encodeURIComponent(sanitized_title), text: "thelastgame.org", color: "#1e7ee812" },
        { url: "https://thelastgame.ru/?s=" + encodeURIComponent(sanitized_title), text: "thelastgame.ru", color: "#1e7ee812" },
        { url: "https://catorrent.org/index.php?do=search&story=" + encodeURIComponent(sanitized_title), text: "catorrent.org", color: "#1e7ee812" },
        { url: "https://rutracker.org/forum/tracker.php?nm=" + encodeURIComponent(sanitized_title), text: "rutracker.org", color: "#1e7ee812" },
        { url: "https://igrovaya.org/?do=search&story=" + encodeURIComponent(sanitized_title), text: "igrovaya.org", color: "#1e7ee812" },
        { url: "https://nnmclub.to/forum/tracker.php?nm=" + encodeURIComponent(sanitized_title), text: "nnmclub.to", color: "#1e7ee812" },
        { url: "https://byrut.org/?do=search&subaction=search&story=" + encodeURIComponent(sanitized_title), text: "byrut", color: "#1e7ee812" },
        { url: "https://1337x.to/search//1/?search=" + encodeURIComponent(sanitized_title), text: "1337x.to", color: "#1e7ee812" },
        { url: "https://cs.rin.ru/forum//search.php?st=0&sk=t&sd=d&sr=topics&terms=any&sf=titleonly&keywords=" + encodeURIComponent(sanitized_title), text: "cs.rin", color: "#d3e81e12" },
        { url: "https://f95zone.to/search/search?keywords=" + encodeURIComponent(sanitized_title), text: "f95zone", color: "#d3e81e12" },
        { url: "https://www.gogdb.org/products?search=" + encodeURIComponent(sanitized_title), text: "GOGDB", color: "#e8591e12" },
        { url: "https://steamdb.info/search/?a=app&q=" + encodeURIComponent(sanitized_title), text: "SteamDB", color: "#e8591e12" }
    ];

    links.forEach(function(link) {
        var row = document.createElement('div');
        row.classList.add('table__row', 'details__rating', 'details__row', 'details__row--first');
        row.style.backgroundColor = link.color;
        row.innerHTML = `
            <div class="details__category table__row-label">Torrent: Gog</div>
            <div class="details__content table__row-content">
                <a href="${link.url}" class="details__feature ng-scope">
                    <svg class="details__feature-icon details__feature-icon--download" style="width: 16px;"><use xlink:href="#download"></use></svg>
                    ${link.text}
                    <svg class="details__feature-chevron-icon"><use xlink:href="#chevron-right"></use></svg>
                </a>
            </div>
        `;
        newBlock.appendChild(row);
    });

    var productDetailsBlock = document.querySelector('.content-summary-section[content-summary-section-id="productDetails"]');
    if (productDetailsBlock) {
        productDetailsBlock.insertBefore(newBlock, productDetailsBlock.firstChild);
    }
})();
