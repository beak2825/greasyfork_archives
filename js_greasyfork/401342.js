// ==UserScript==
// @name        Keyboard shortcuts - letterboxd.com
// @namespace   Violentmonkey Scripts
// @match       https://letterboxd.com/films/*
// @match       https://letterboxd.com/*/list/*
// @grant       none
// @version     1.0
// @author      Yotam
// @description 4/17/2020, 4:06:54 PM
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/401342/Keyboard%20shortcuts%20-%20letterboxdcom.user.js
// @updateURL https://update.greasyfork.org/scripts/401342/Keyboard%20shortcuts%20-%20letterboxdcom.meta.js
// ==/UserScript==
// 

var films = null;
let size = 0;
let currentIndex = -1;

function updateFilms() {
  films = document.querySelectorAll('.linked-film-poster');
  size = films.length;
}

var twipsy = null;

function displayTwipsy(f) {
  if (twipsy == null) {
    twipsy = document.createElement("div");
    twipsy.classList.add("twipsy", "fade", "above", "in");

    twipsyInner = document.createElement("div");
    twipsyInner.classList.add("twipsy-inner");

    twipsy.appendChild(twipsyInner);

    document.querySelector("body").appendChild(twipsy);
  }
  
  filmTitle = f.querySelector(".frame").attributes["data-original-title"].textContent;
  filmPosition = f.getBoundingClientRect();
  
  twipsyInner.innerText = filmTitle;
  twipsyTop = filmPosition.top - 30 + document.documentElement.scrollTop;
  twipsyLeft = filmPosition.left + document.documentElement.scrollLeft + (filmPosition.width / 2) - (twipsyInner.clientWidth / 2);
  twipsyPosition = "top: " + twipsyTop + "px; left: " + twipsyLeft + "px;";
  
  twipsy.style.cssText = "display: block; " + twipsyPosition;

}

function focusFilm(f) {
  f.querySelector(".frame").style["border"] = "3px solid #00e054";
  f.querySelector(".overlay-actions").style["display"] = "inline";
  displayTwipsy(f);
  f.scrollIntoView(false);
} 

function unfocusFilm(f) {
  f.querySelector(".frame").style["border"] = "";
  f.querySelector(".overlay-actions").style["display"] = "none";
}

function selectNext() {
  if (currentIndex + 1 == size) {
    return;
  }
  
  if (currentIndex > -1) {
    unfocusFilm(films[currentIndex]);
  }
  
  currentIndex += 1;
  focusFilm(films[currentIndex]);
}

function selectPrev() {
  if (currentIndex == 0) {
    return;
  }
  
  if (currentIndex == -1) {
    currentIndex = 0;
    focusFilm(films[currentIndex]);
    return;
  }
  
  unfocusFilm(films[currentIndex]);
  currentIndex -= 1;
  if (currentIndex > -1) {
    focusFilm(films[currentIndex]);
  }
}

function likedFilm() {
  // TODO better selection
  films[currentIndex].querySelector(".like-link").querySelector(".ajax-click-action").click();
}

function watchedFilm() {
  // TODO better selection
  films[currentIndex].querySelector(".film-watch-link").querySelector(".ajax-click-action").click();
}

VM.registerShortcut('j', () => {
  updateFilms();
  selectNext();
});

VM.registerShortcut('k', () => {
  updateFilms();
  selectPrev();
});

VM.registerShortcut('l', () => {
  likedFilm();
});

VM.registerShortcut('w', () => {
  watchedFilm();
});