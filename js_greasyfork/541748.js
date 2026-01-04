// ==UserScript==
// @name         Anilist + Расширенный поиск на MAL
// @version      1.1.0
// @namespace    MALanilist
// @description  добавляет ссылки Anilist, livechart.me и кнопку поиска «Найти аниме» по русскоязычным сайтам
// @author       Alistair1231 + доработал kotaytqee
// @match        https://myanimelist.net/anime/*
// @icon         https://icons.duckduckgo.com/ip2/myanimelist.net.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541748/Anilist%20%2B%20%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BD%D0%B0%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/541748/Anilist%20%2B%20%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BD%D0%B0%20MAL.meta.js
// ==/UserScript==

function createButton(href, icon, textContent) {
    var link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.className = "link ga-click";

    var img = document.createElement("img");
    img.src = icon;
    img.className = "link_icon";
    img.alt = textContent;

    link.appendChild(img);

    var div = document.createElement("div");
    div.className = "caption";
    div.textContent = textContent;

    link.appendChild(div);

    return link;
}

(function (window, undefined) {
    // 1. Получаем название аниме
    var title = document
      .querySelector(".title-name.h1_bold_none strong")
      .innerText;
    // 2. Ссылки Anilist и livechart.me через DuckDuckGo
    var anilistLink = `https://duckduckgo.com/?q=!anilist+${encodeURIComponent(title)}`;
    var livechartLink = `https://duckduckgo.com/?q=!livec+${encodeURIComponent(title)}`;
    // 3. Новый комбинированный Google-поиск по трём сайтам
    var searchLink =
      "https://www.google.com/search?q=" +
      encodeURIComponent(
        "site:animego.me OR site:jut.su OR site:site.yummyani.me OR site:dreamerscast.com " + title
      );
    // Иконка Google
    var googleIcon = "https://www.google.com/favicon.ico";

    // 4. Находим контейнер external_links и вставляем кнопки
    var container = [...document.querySelectorAll("div.external_links")]
      .splice(-1)[0]
      .firstChild;

    container.before(
        createButton(anilistLink, "https://icons.duckduckgo.com/ip2/anilist.co.ico", "Anilist"),
        createButton(livechartLink, "https://icons.duckduckgo.com/ip2/livechart.me.ico", "livechart.me"),
        createButton(searchLink, googleIcon, "Найти аниме")
    );
})(window);
