// ==UserScript==
// @name         shikimori-ext-old
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  add button
// @author       https://greasyfork.org/ru/users/1065796-kazaev
// @match        https://shikimori.one/animes/*
// @match        https://shikimori.me/animes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.me
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464640/shikimori-ext-old.user.js
// @updateURL https://update.greasyfork.org/scripts/464640/shikimori-ext-old.meta.js
// ==/UserScript==

function showLinks() {
    const animename = document.querySelector("#animes_show > section > div > header > meta").content;
    const watchLinks = document.createElement("div");
    watchLinks.className = "b-watch_links";
    watchLinks.innerHTML = `
        <a class="b-link_button" title="Anime365" href="https://anime365.ru/catalog/search?q=${encodeURIComponent(animename)}" target="_blank">Anime365</a>
        <a class="b-link_button" title="Anime365" href="https://smotret-anime.com/catalog/search?q=${encodeURIComponent(animename)}" target="_blank">Anime365 (mirror)</a>
        <a class="b-link_button" title="Anime365" href="https://hentai365.ru/catalog/search?q=${encodeURIComponent(animename)}" target="_blank">Hentai365</a>
        <a class="b-link_button" title="AnimeGO" href="https://animego.org/search/anime?q=${encodeURIComponent(animename)}" target="_blank" >AnimeGO</a>
    `;
    if (document.querySelector(".b-watch_links") === null) document.querySelector(".c-image").append(watchLinks);
}

function onLoad(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onLoad(showLinks);