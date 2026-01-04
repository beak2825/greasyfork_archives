// ==UserScript==
// @name         LetterBoxd Roulette
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Pick a random movie on any LetterBoxd page. Press R to roll a movie, and Shift+R to exit the roulette. Works for watchlist, any user list, and anywhere you can find a gallery of film posters on the site. Turn on the "Fade watched films" switch (the one already on the vanilla LetterBoxd site) to make the roulette skip watched films.
// @author       Gatleos
// @match        https://letterboxd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475624/LetterBoxd%20Roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/475624/LetterBoxd%20Roulette.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.LETTERBOXD_ROULETTE = {
    filmIndex: -1,
    active: false,
    shuffledIndexList: [],
    shuffledIndexListCounter: 0,
  };
  const ROULETTE_SELECTED_CLASS = "letterboxd-roulette-chosen";

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function isTextInput(el) {
    if (el.tagName != "INPUT") {
      return false;
    }
    const typeAttr = el.attributes.getNamedItem("type");
    return typeAttr && typeAttr.textContent == "text";
  }

  function select(el) {
    el.classList.add(ROULETTE_SELECTED_CLASS);
  }

  function deselect(el) {
    el.classList.remove(ROULETTE_SELECTED_CLASS);
  }

  function injectStylesheet() {
    const css = `
li.poster-container.${ROULETTE_SELECTED_CLASS}>* {
  opacity: 1 !important;
  transition: all .1s linear;
}

li.poster-container.${ROULETTE_SELECTED_CLASS}>.poster .frame .overlay {
  border-width: 3px !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  border-color: rgb(0, 56, 112) !important;
  box-shadow: rgba(16, 19, 22, 0.25) 0px 0px 1px 1px inset !important;
}

li.poster-container:not(.${ROULETTE_SELECTED_CLASS})>* {
  opacity: .2 !important;
  transition: all .1s linear;
}

body.hide-films-seen li.poster-container.film-watched:not(.${ROULETTE_SELECTED_CLASS})>* {
  opacity: 0 !important;
  transition: all .1s linear;
}
`;
    const head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style");
    head.appendChild(style);
    style.type = "text/css";
    style.id = "letterboxd-roulette-style";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  function removeStylesheet() {
    const stylesheet = document.head.querySelector(
      "style#letterboxd-roulette-style"
    );
    if (stylesheet) {
      stylesheet.remove();
    }
  }

  function createShuffledIndexList(size) {
    window.LETTERBOXD_ROULETTE.shuffledIndexList = [];
    for (let i = 0; i < size; i++) {
      window.LETTERBOXD_ROULETTE.shuffledIndexList.push(i);
    }
    shuffle(window.LETTERBOXD_ROULETTE.shuffledIndexList);
    window.LETTERBOXD_ROULETTE.shuffledIndexListCounter = 0;
  }

  function activateRoulette() {
    injectStylesheet();
    window.LETTERBOXD_ROULETTE.active = true;
  }

  function deactivateRoulette() {
    removeStylesheet();
    window.LETTERBOXD_ROULETTE.filmIndex = -1;
    window.LETTERBOXD_ROULETTE.shuffledIndexList = [];
    window.LETTERBOXD_ROULETTE.shuffledIndexListCounter = 0;
    window.LETTERBOXD_ROULETTE.active = false;
  }

  function roulette(scrollToSelection) {
    // run one-time setup
    if (!window.LETTERBOXD_ROULETTE.active) {
      activateRoulette();
    }
    // get list of posters, and filter out watched films if
    // "Fade watched films" switch is on
    let posters = [];
    const hideWatchedFilms =
      document.body.classList.contains("hide-films-seen");
    if (hideWatchedFilms) {
      posters = document.querySelectorAll(
        "li.poster-container.film-not-watched"
      );
    } else {
      posters = document.querySelectorAll("li.poster-container");
    }
    // if our list of shuffled indices doesn't match poster list size, generate it
    if (window.LETTERBOXD_ROULETTE.shuffledIndexList.length != posters.length) {
      createShuffledIndexList(posters.length);
    }
    // deselect existing pick
    let chosen = [...posters].find((el) =>
      el.classList.contains(ROULETTE_SELECTED_CLASS)
    );
    if (chosen) {
      deselect(chosen);
      window.LETTERBOXD_ROULETTE.filmIndex = -1;
    }
    // select a new poster
    const count = posters.length;
    const randomPick =
      window.LETTERBOXD_ROULETTE.shuffledIndexList[
        window.LETTERBOXD_ROULETTE.shuffledIndexListCounter
      ];
    window.LETTERBOXD_ROULETTE.shuffledIndexListCounter += 1;
    if (window.LETTERBOXD_ROULETTE.shuffledIndexListCounter >= posters.length) {
      window.LETTERBOXD_ROULETTE.shuffledIndexListCounter %= posters.length;
    }
    const toWatch = posters[randomPick];
    select(toWatch);
    window.LETTERBOXD_ROULETTE.filmIndex = randomPick;
    // scroll to the selected poster
    if (scrollToSelection) {
      toWatch.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  // run roulette when R is pressed
  window.addEventListener("keydown", (ev) => {
    if (ev.code == "KeyR") {
      const focusedElement = document.activeElement;
      if (
        ev.ctrlKey == true ||
        ev.altKey == true ||
        (ev.metaKey == true && isTextInput(focusedElement))
      ) {
        // only act on keypress without modifiers,
        // and if a text field is not focused
        return;
      }
      if (ev.shiftKey) {
        deactivateRoulette();
      } else {
        const scrollToSelection = true;
        if (!isTextInput(focusedElement)) {
          roulette(scrollToSelection);
        }
      }
    }
  });
})();
