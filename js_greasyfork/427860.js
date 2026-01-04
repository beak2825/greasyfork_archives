// ==UserScript==
// @name         Imdb bluray search
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Bluray search
// @author       You
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?domain=imdb.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/427860/Imdb%20bluray%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/427860/Imdb%20bluray%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
let blurayObj = {
  title: function () {
    let str = document
      .querySelector(
        "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.TitleBlock__Container-sc-1nlhx7j-0.hglRHk > div.TitleBlock__TitleContainer-sc-1nlhx7j-1.jxsVNt > h1"
      )

      .innerText.trim();
    const r = /\((19|20)[0-9]{2}\)$/g;
    this.title = str.replace(r, "").trim();
  }, //this.title = the title
  links: function () {
    // the url builder (type = dvdmovies || bluraymovies)
    function urlBuild(title, type) {
      return `https://www.blu-ray.com/search/?quicksearch=1&quicksearch_country=all&sortby=title&quicksearch_keyword=${title}&section=${type}`;
    }

    this.dvd = urlBuild(this.title, "dvdmovies");
    this.bluray = urlBuild(this.title, "bluraymovies");
  },
};

blurayObj.title();
blurayObj.links();
console.log(blurayObj);

function addEl(loc, ele) {
  loc.insertAdjacentHTML("beforeend", ele);
}

addEl(
  document.querySelector("#imdbHeader"),
  `
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Blu-ray_Disc.svg/386px-Blu-ray_Disc.svg.png" class = "bluray-search-script" style="height: 24px; width: 52px; cursor:pointer;">
</img><span class="ghost">|</span>

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DVD_logo.svg/512px-DVD_logo.svg.png" class = "dvd-search-script" style="height: 24px; width: 52px; cursor:pointer;">
`
);

// event listener to open blurayobjlinks

document
  .querySelector(".bluray-search-script")
  .addEventListener("click", function () {
    window.open(blurayObj.bluray, "_blank");
  });

document
  .querySelector(".dvd-search-script")
  .addEventListener("click", function () {
    window.open(blurayObj.dvd, "_blank");
  });


})();

