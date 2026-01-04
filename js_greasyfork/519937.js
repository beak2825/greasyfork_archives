// ==UserScript==
// @name             HiMovies Theatre Mode
// @namespace        butterflies.himoviesTheatreMode
// @author           ✨ Butterflies ✨
// @description      Gives HiMovies a widescreen theatre mode inspired by sites like youtube. Press `t` to toggle.
// @license          unlicense
// @match            https://himovies.sx/*
// @version          1.0
// @downloadURL https://update.greasyfork.org/scripts/519937/HiMovies%20Theatre%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/519937/HiMovies%20Theatre%20Mode.meta.js
// ==/UserScript==

const toggleTheatre = (theatreMode) => {
  const container = document.querySelector("#main-wrapper div.container");
  if (!theatreMode) {
    container.style.maxWidth = "none";
    container.style.width = "90%";
  }
  else {
    container.style.maxWidth = "1200px";
    container.style.width = "100%";
  }
};


(() => {
  let theatreMode = false;
  document.addEventListener('keydown', keyEvent => {
    if (keyEvent.key === 't') {
      toggleTheatre(theatreMode);
      theatreMode = !theatreMode;
    }
  });
})();