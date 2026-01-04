// ==UserScript==
// @name        AniList - Search Title on TurkAnime and TRAnimeIzle
// @name:tr     AniList - TurkAnime ve TRAnimeIzle 'de Anime Basligini Ara'
// @namespace   https://greasyfork.org/en/users/1286606-huseidon
// @match       https://anilist.co/*
// @match        *://www.turkanime.co/?q=*
// @include     *://*turkanime.co/?q=*
// @run-at      document-end
// @icon        https://anilist.co/img/icons/icon.svg
// @version     1.7
// @author      huseidon
// @license      MIT
// @description adds a button on AniList anime pages to search TurkAnime and TRAnimeizle for the title
// @description:tr AniList anime sayfasına TurkAnime ve TRAnimeIzle sitelerinde arama için buton ekler
// @downloadURL https://update.greasyfork.org/scripts/492186/AniList%20-%20Search%20Title%20on%20TurkAnime%20and%20TRAnimeIzle.user.js
// @updateURL https://update.greasyfork.org/scripts/492186/AniList%20-%20Search%20Title%20on%20TurkAnime%20and%20TRAnimeIzle.meta.js
// ==/UserScript==

(function() {
const pageUrl = window.location.href;
if (pageUrl.search(/https?:\/\/.+turkanime\.co/) >= 0) {
	window.stop();

	let urlParams = new URLSearchParams(window.location.search);
	let postKeyword = urlParams.get('q');

	if (urlParams.get('q') && postKeyword !== '') {
		let postForm = document.createElement("form");
		postForm.setAttribute("method", "post");
		postForm.setAttribute("action", "arama");
		let hiddenField = document.createElement("input");
		hiddenField.setAttribute("name", "arama");
		hiddenField.setAttribute("value", postKeyword);
		hiddenField.setAttribute("type", "hidden");
		postForm.appendChild(hiddenField);
		document.getElementsByTagName('html')[0].appendChild(postForm);
		postForm.submit();
	}
}

})();

(function () {

  function createSearchButton() {
    const navEl = document.querySelector(".content div.nav");
    if (navEl) {
      const lastChild = navEl.children[navEl.children.length - 1];
      const cloned = lastChild.cloneNode(true);
      cloned.innerText = "TRAnimeİzle";
      cloned.href = "#";
      cloned.addEventListener("click", function (e) {
        const seriesName = document.querySelector("h1").innerText;
        const targetUrl =
          "https://www.tranimeizle.co/arama/" +
          encodeURIComponent(seriesName);
        e.preventDefault();
        window.open(targetUrl, "_blank"); // new tab
      });
      cloned.href = navEl.appendChild(cloned);
    } else {
    }

      const navE1 = document.querySelector(".content div.nav");
    if (navE1) {
      const lastChild = navE1.children[navE1.children.length - 1];
      const cloned = lastChild.cloneNode(true);
      cloned.innerText = "TürkAnime";
      cloned.href = "#";
      cloned.addEventListener("click", function (e) {
        const seriesName = document.querySelector("h1").innerText;
        const targetUrl =
          "https://www.turkanime.co/?q=" +
          encodeURIComponent(seriesName);
        e.preventDefault();
        window.open(targetUrl, "_blank"); // new tab
      });
      cloned.href = navE1.appendChild(cloned);
    } else {
      // check every 500ms if the page has loaded, so we can add the button
      setTimeout(() => createSearchButton(), 500);
    }
  }
  createSearchButton();

})();