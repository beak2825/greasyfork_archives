// ==UserScript==
// @name         ShikiLink
// @version      0.2
// @description  Добавляет кнопки на сайте Shikimori для поиска аниме на Anime365 и AnimeGO или манги на MangaLib.me
// @author       vuchaev2015
// @match        https://shikimori.me/animes/*
// @match        https://shikimori.me/mangas/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.me
// @grant        none
// @namespace Добавляет кнопки на сайте Shikimori для поиска аниме на Anime365 и AnimeGO или манги на MangaLib.me
// @downloadURL https://update.greasyfork.org/scripts/464641/ShikiLink.user.js
// @updateURL https://update.greasyfork.org/scripts/464641/ShikiLink.meta.js
// ==/UserScript==

function addAnimeLinks() {
  if (document.querySelector("#animes_show") && document.querySelector("#animes_show > section > div > header > meta")) {
    const bDbEntryDivs = document.querySelectorAll(".b-db_entry");
    bDbEntryDivs.forEach((div) => {
      const cImageDiv = div.querySelector(".c-image");
      const animename = document.querySelector("#animes_show > section > div > header > meta").getAttribute("content");

      // Проверяем, существует ли элемент #answer_is_forty_two
      if (cImageDiv.querySelector("#answer_is_forty_two")) {
        return; // Если элемент существует - выходим из функции
      }

      const newDiv = document.createElement("div");
      newDiv.innerHTML = `
        <div id="answer_is_forty_two">
          <a target="_blank" class="b-link_button" title="Anime365" href="https://smotret-anime.com/catalog/search?q=${encodeURIComponent(animename)}" rel="nofollow noopener noreferrer">Anime365</a>
          <a target="_blank" class="b-link_button" title="AnimeGo.org" href="https://animego.org/search/anime?q=${encodeURIComponent(animename)}" rel="nofollow noopener noreferrer">AnimeGo.org</a>
        </div>`;
      cImageDiv.appendChild(newDiv);
    });
  }
}

function addMangaLinks() {
  if (document.querySelector("#mangas_show") && document.querySelector("#mangas_show > section > div > header > meta")) {
    const bDbEntryDivs = document.querySelectorAll(".b-db_entry");
    bDbEntryDivs.forEach((div) => {
      const cImageDiv = div.querySelector(".c-image");
      const animename = document.querySelector("#mangas_show > section > div > header > meta").getAttribute("content");

      // Проверяем, существует ли элемент #answer_is_forty_two
      if (cImageDiv.querySelector("#answer_is_forty_two")) {
        return; // Если элемент существует - выходим из функции
      }

      const newDiv = document.createElement("div");
      newDiv.innerHTML = `
        <div id="answer_is_forty_two">
          <a target="_blank" class="b-link_button" title="MangaLib.me" href="https://mangalib.me/manga-list?sort=rate&dir=desc&page=1&name=${encodeURIComponent(animename)}" rel="nofollow noopener noreferrer">MangaLib.me</a>
        </div>`;
      cImageDiv.appendChild(newDiv);
    });
  }
}

setInterval(function() {
  addAnimeLinks();
  addMangaLinks();
});