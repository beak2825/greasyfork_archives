// ==UserScript==
// @name        Derpibooru - Extra Buttons
// @namespace   Selbi
// @version     3.0.1
// @include     /https?\:\/\/(www\.)?derpiboo(\.ru|ru\.org)\/(tags|search).+/
// @grant       none
// @description Adds multiple buttons to one-click-apply common search/filter options
// @downloadURL https://update.greasyfork.org/scripts/1836/Derpibooru%20-%20Extra%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/1836/Derpibooru%20-%20Extra%20Buttons.meta.js
// ==/UserScript==

(function() {

  // Score Button
  const TARGET_SCORE = "score";
  const TARGET_DESCENDING = "desc";
  let sortButtonIcon = document.createElement("i");
  sortButtonIcon.classList = "fas fa-sort-amount-down";
  Object.assign(sortButtonIcon.style, {
    width: "28px",
    textAlign: "center"
  });
  let sortButton = document.createElement("a");
  sortButton.classList = "header__search__button";
  sortButton.title = "Sort by descending score";
  sortButton.appendChild(sortButtonIcon);
  document.querySelector(".header__search").appendChild(sortButton);
  sortButton.onclick = function() {
    let sortDropdown = document.querySelector("#searchform_sf");
    sortDropdown.selectedIndex = findOptionIndex(sortDropdown, TARGET_SCORE);
    let orderDropdown = document.querySelector("#searchform_sd");
    orderDropdown.selectedIndex = findOptionIndex(orderDropdown, TARGET_DESCENDING);
    document.querySelector(".field > button:first-child").click();
  };

  function findOptionIndex(elem, value) {
    let options = elem.getElementsByTagName("option");
    let index = 0;
    for (o of options) {
      if (o.value == value) {
        return index;
      }
      index++;
    }
    return -1;
  }

  // Safe Button
  var queryBox = document.querySelector("#q");
  const RATINGS = ["-safe", "safe", "suggestive", "questionable", "explicit"];
  let safeButtonIcon = document.createElement("i");
  safeButtonIcon.classList = "fas fa-horse";
  Object.assign(safeButtonIcon.style, {
    width: "28px",
    textAlign: "center"
  });
  let safeButton = document.createElement("a");
  safeButton.classList = "header__search__button";
  safeButton.title = "Go to the next rating";
  safeButton.appendChild(safeButtonIcon);
  sortButton.after(safeButton);
  safeButton.onclick = function() {
    let query = queryBox.value;
    let previousRating = -1;
    for (i = 0; i < RATINGS.length; i++) {
      if (query.includes(RATINGS[i])) {
        previousRating = i;
        break;
      }
    }
    let nextRating = previousRating + 1;
    if (previousRating < 0) {
      // Entry point to "safe" when no rating is set
      query += ", " + RATINGS[nextRating];
    } else if (nextRating >= RATINGS.length) {
      // When we wrap around, remove the rating
      let previousRatingText = RATINGS[previousRating];
      query = query.replace(previousRatingText, "");
    } else {
      // Proceed to the next one
      let previousRatingText = RATINGS[previousRating];
      let nextRatingText = RATINGS[nextRating];
      query = query.replace(previousRatingText, nextRatingText);
    }
    startSearch(query);
  };

  // No-Animation Button
  let noAniButtonIcon = document.createElement("i");
  noAniButtonIcon.classList = "fas fa-video-slash";
  Object.assign(noAniButtonIcon.style, {
    width: "28px",
    textAlign: "center"
  });
  let noAniButton = document.createElement("a");
  noAniButton.classList = "header__search__button";
  noAniButton.title = "Toggle all animated content";
  noAniButton.appendChild(noAniButtonIcon);
  safeButton.after(noAniButton);
  noAniButton.onclick = function() {
    let query = queryBox.value;
    if (query.includes("-animated")) {
      // Remove it
      query = query.replace("-animated", "");
    } else {
      query += ", -animated";
    }
    startSearch(query);
  };

  function startSearch(query) {
    let normalizedQuery = query.replace(/\s+/g, " ").replace(/(^\s*,\s*|\s*,\s*$)/g, "").replace(/\s*,\s*,\s*/g, ", ");
    if (!normalizedQuery) {
      normalizedQuery = RATINGS[0];
    }
    queryBox.value = normalizedQuery;
    document.querySelector("button.header__search__button").click();
  }
})();
