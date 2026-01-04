// ==UserScript==
// @name         Average Reviews Calculator for MAL
// @namespace    Transform MAL into Rotten Tomatoes
// @version      12
// @description  Have a better reviews page with this script that loads all reviews on a single page instead of needing to navigate to the next web pages, and shows the averages of all score categories, if you want to sort the reviews with the same category click on the "Sort Reviews" button.
// @author       Only_Brad
// @include      /^https:\/\/myanimelist\.net\/(?:anime|manga)\/[\d]+\/.*\/reviews\/?(?:#!)?/
// @icon         https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407733/Average%20Reviews%20Calculator%20for%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/407733/Average%20Reviews%20Calculator%20for%20MAL.meta.js
// ==/UserScript==

(function() {
  const
    REVIEW_TAB_SELECTOR = "#content > table > tbody > tr > td:nth-child(2) > div.js-scrollfix-bottom-rel",
    REVIEWS_SELECTOR = `${REVIEW_TAB_SELECTOR} .borderDark`,
    EPISODE_WATCHED_SELECTOR = ".lightLink.spaceit",
    REVIEW_SCORE_TABLE_SELECTOR = ".textReadability tr td:nth-child(2)",
    MORE_REVIEWS_BUTTON_SELECTOR = "div.ml4 > a",
    OPTIONS_SELECTOR = ".reviews-horiznav-nav-sort-block",
    SEPARATOR_SELECTOR = ".reviews-horiznav-nav-sort-block",
    PRELIMINARY_CHECKBOX_SELECTOR = ".mr12.btn-checkbox.js-reviews-chk-preliminary";

  const
    SELECT_ID = "sort-by-select",
    ONLY_PRELIMINARY_REVIEWS_ID = "only-preliminary-reviews-select",
    LOADING_SCREEN_ID = "loading-screen-reviews",
    AVERAGE_SCORES_ID = "average-scores-container";

  const PAGE_REGEX = /(.*)\?p=([\d]*)/;
  const EPISODE_WATCHED_REGEX = /(\d+) of (\d+|\?)/;

  const MAX_CONCURRENT_DOWNLOAD = 10;
  const REVIEWS_PER_PAGE = 20;

  const domparser = new DOMParser();

  /**
   * @typedef AnimeScore
   * @property {number} overall
   * @property {number} story
   * @property {number} animation
   * @property {number} sound
   * @property {number} character
   * @property {number} enjoyment
   * @property {boolean} reviewerHasCompleted

   * @typedef MangaScore
   * @property {number} overall
   * @property {number} story
   * @property {number} art
   * @property {number} character
   * @property {number} enjoyment
   * @property {boolean} reviewerHasCompleted
   */

  /**
   * @return {number}
   */
  function getCurrentPageNumber() {
    const url = window.location.href;
    const match = url.match(PAGE_REGEX);

    if (!match) return 1;
    return parseInt(match[2]);
  }

  /**
   * @return {string}
   */
  function getFirstPageUrl() {
    let url = window.location.href;
    if (url.endsWith("#!")) url = url.slice(0, url.length - 2);
    const match = url.match(PAGE_REGEX);

    if (!match) return url;
    return match[1];
  }

  /**
   *
   * Checks if a specific review page actually contains reviews.
   *
   * @param {Document} document
   * @return {boolean}
   */
  function hasReviews(document) {
    const reviewTab = document.querySelector(REVIEW_TAB_SELECTOR);
    if (!reviewTab) return false;
    const reviewScoreTables = reviewTab.querySelectorAll(REVIEW_SCORE_TABLE_SELECTOR);
    if (reviewScoreTables.length === 0) return false;
    return true;
  }

  /**
   * @return {"anime"|"manga"}
   */
  function getMediaType() {
    const url = window.location.href;
    return url.split("/")[3];
  }

  /**
   * Returns an object containing all the scores of a specific review and whether or not the reviewer has completed this series.
   *
   * Object form:
   * {overall: number, story: number, sound: number, character: number, enjoyment: number, reviewerHasCompleted: boolean}
   *
   * @param {HTMLElement} review
   * @return {AnimeScore|MangaScore}
   */
  function getScoreTable(review) {
    /** @type {AnimeScore | MangaScore} */
    const scores = {};
    const mediaType = getMediaType();
    const scoresValues = [...review.querySelectorAll(REVIEW_SCORE_TABLE_SELECTOR)]
      .map(td => parseInt(td.textContent));

    switch (mediaType) {
      case "anime": {
        scores.overall = scoresValues[0];
        scores.story = scoresValues[1];
        scores.animation = scoresValues[2];
        scores.sound = scoresValues[3];
        scores.character = scoresValues[4];
        scores.enjoyment = scoresValues[5];
        scores.reviewerHasCompleted = getReviewerHasCompleted(review);
        break;
      }
      case "manga": {
        scores.overall = scoresValues[0];
        scores.story = scoresValues[1];
        scores.art = scoresValues[2];
        scores.character = scoresValues[3];
        scores.enjoyment = scoresValues[4];
        scores.reviewerHasCompleted = getReviewerHasCompleted(review);
      }
    }

    return scores;
  }

  /**
   *
   * @param {HTMLElement} review
   */
  function getReviewerHasCompleted(review) {
    const episodeWatched = review.querySelector(EPISODE_WATCHED_SELECTOR).textContent;
    const match = episodeWatched.match(EPISODE_WATCHED_REGEX);

    if (!match) return false

    return match[1] === match[2];
  }

  /**
   * Extract the review html elements from one or more review pages.
   *
   * @param {Document[] | Document} documents
   * @return {HTMLElement[]}
   */
  function getReviews(documents) {
    if (!Array.isArray(documents)) documents = [documents];
    const allReviews = [];

    documents.forEach(document => {
      const reviews = [...document.querySelectorAll(REVIEWS_SELECTOR)];
      allReviews.push(reviews);
    });
    return allReviews.flat();
  }

  /**
   *
   * Get the html page of reviews of a specific anime.
   *
   * @param {number} page
   * @return {Promise<Document>}
   */
  async function fetchReviewsPage(page) {
    //If the program is trying to fetch the page we are currently on, simply return the document.
    if (page === getCurrentPageNumber()) return document;
    const url = `${getFirstPageUrl()}?p=${page}`;
    try {
      const response = await fetch(url);
      const text = await response.text();
      return domparser.parseFromString(text, "text/html");
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get all the html pages of reviews of a specific anime.
   *
   * @param {boolean} skipCurrentPage
   * @return {Promise<Document[]>}
   */
  async function fetchAllReviewsPages() {
    const currentPageNumber = getCurrentPageNumber();
    const reviewDocuments = [];
    let promises = [];

    for (let i = 1;; i++) {
      for (let j = 1; j <= MAX_CONCURRENT_DOWNLOAD * i; j++) {
        if (j === currentPageNumber) continue;
        promises.push(fetchReviewsPage(j));
      }
      try {
        const documents = await Promise.all(promises);
        for (const currentDocument of documents) {
          const bool = hasReviews(currentDocument);
          if (bool) reviewDocuments.push(currentDocument);
          else return reviewDocuments;
        }
        promises = [];
      } catch (err) {
        console.error(err);
        return [];
      }
    }
  }

  /**
   * Insert the reviews into the current reviews document.
   *
   * @param {HTMLElement[]} reviews
   */
  function insertReviews(reviews) {
    const reviewsTab = document.querySelector(REVIEW_TAB_SELECTOR);
    const moreReviewsButton = reviewsTab.querySelector(MORE_REVIEWS_BUTTON_SELECTOR).parentElement;

    moreReviewsButton.remove();
    reviews.forEach(review => reviewsTab.appendChild(review));
    reviewsTab.appendChild(moreReviewsButton);
  }

  function createLoadingScreen() {
    const loadingScreen = document.createElement("div");
    const css = "position: fixed;top: 0;width: 100vw;height: 100vh;background-color: rgba(0,0,0,0.9);color: white;place-items: center;display: grid;z-index: 999; font-size: 20px;"
    loadingScreen.id = LOADING_SCREEN_ID;
    loadingScreen.textContent = "Loading all reviews. Wait a moment...";
    loadingScreen.setAttribute("style", css)
    loadingScreen.style.display = "none";
    document.body.appendChild(loadingScreen);
  }

  function toggleLoadingScreen() {
    const loadingScreen = document.getElementById(LOADING_SCREEN_ID);
    if (loadingScreen.style.display === "none") loadingScreen.style.display = "grid";
    else loadingScreen.style.display = "none";
  }

  /**
   *
   * @param {Function} callback
   */
  function createSortingAndReviewsOptions(sortingCallback, preliminaryCallback) {

    //Sort By Select element
    const mediaType = getMediaType();
    const sortBy = document.createElement("div");
    sortBy.style.float = "left";

    switch (mediaType) {
      case "anime":
        sortBy.innerHTML = `<label for="${SELECT_ID}">Sort By</label> <select id="${SELECT_ID}" name="${SELECT_ID}"><option value="overall">overall</option><option value="story">story</option><option value="animation">animation</option><option value="sound">sound</option><option value="character">character</option><option value="enjoyment">enjoyment</option></select>`;
        break;
      case "manga":
        sortBy.innerHTML = `<label for="${SELECT_ID}">Sort By</label> <select id="${SELECT_ID}" name="${SELECT_ID}"><option value="overall">overall</option><option value="story">story</option><option value="art">art</option><option value="character">character</option><option value="enjoyment">enjoyment</option></select>`;
    }

    sortBy.addEventListener("change", sortingCallback);

    //Only Preliminary Reviews select
    const onlyPreliminaryReviews = document.createElement("div");
    onlyPreliminaryReviews.style.float = "left";
    onlyPreliminaryReviews.style.marginLeft = "20px"

    onlyPreliminaryReviews.innerHTML = `<label for="${ONLY_PRELIMINARY_REVIEWS_ID}">Only Preliminary Reviews</label> <select id="${ONLY_PRELIMINARY_REVIEWS_ID}"><option value="No">No</option><option value="Yes">Yes</option></select>`;
    onlyPreliminaryReviews.addEventListener("change", preliminaryCallback);

    //Sort Reviews button
    const sortButton = document.createElement("button");
    sortButton.style.marginLeft = "20px"
    sortButton.style.float = "left";
    sortButton.type = "button";
    sortButton.textContent = "Sort Reviews";
    sortButton.className = "inputButton btn-middle flat js-anime-update-button";
    sortButton.addEventListener("click", sortingCallback);

    const optionsContainer = document.querySelector(OPTIONS_SELECTOR);
    optionsContainer.prepend(sortButton);
    if (preliminaryIsChecked()) optionsContainer.prepend(onlyPreliminaryReviews);
    optionsContainer.prepend(sortBy);
  }

  function preliminaryIsChecked() {
    const checkbox = document.querySelector(PRELIMINARY_CHECKBOX_SELECTOR);
    return !checkbox ? false : checkbox.classList.contains("on");
  }

  /**
   *
   * @param {Function} callback
   */
  function changeMoreReviewsButton(callback) {
    const moreReviewsButtons = [...document.querySelectorAll(MORE_REVIEWS_BUTTON_SELECTOR)];
    let moreReviewButton;

    //we are on the first page
    if (moreReviewsButtons.length === 2) {
      const reviewsTab = document.querySelector(REVIEW_TAB_SELECTOR);
      moreReviewButton = moreReviewsButtons[1];
      const moreReviewButtonContainer = moreReviewButton.parentElement;

      moreReviewsButtons[0].remove();
      moreReviewButton.parentElement.parentElement.remove();
      reviewsTab.appendChild(moreReviewButtonContainer);
    }
    //we are on page 2 and onwards
    else if (moreReviewsButtons.length === 4) {
      const moreReviewButtonParent1 = moreReviewsButtons[0].parentElement;
      const moreReviewButtonParent2 = moreReviewsButtons[3].parentElement;

      moreReviewButton = moreReviewsButtons[3];
      moreReviewsButtons.forEach(button => button.remove());
      moreReviewButtonParent1.remove();
      moreReviewButtonParent2.innerHTML = "";
      moreReviewButtonParent2.appendChild(moreReviewButton);
    }

    //this will only happen if MAL changes the layout
    else return;

    moreReviewButton.href = "#!";
    moreReviewButton.addEventListener("click", callback);
  }

  /**
   * A function that returns a callback function for Array.prototype.sort to sort the reviews. The arguments passed to this function determine the sorting order.
   * Example: sortBy("overall","character","sound") will return a function that sorts by the "overall" scores, if the overall scores are equal between reviewA and reviewB then compare their "character" scores, if they are also equal then check the "sound" scores. Otherwise, keep the same order.
   *
   * @param  {string[]} category
   */
  function sortBy(...category) {
    return function(reviewA, reviewB) {
      const scoreA = getScoreTable(reviewA)[category[0]];
      const scoreB = getScoreTable(reviewB)[category[0]];
      if (scoreA < scoreB) return 1;
      if (scoreA > scoreB) return -1;
      if (category.length > 1) return sortBy(...category.slice(1))(reviewA, reviewB);
      return 0;
    }
  }

  /**
   * Create the container that will contain the average scores.
   */
  function createAveragesContainer() {
    const separator = document.querySelector(SEPARATOR_SELECTOR);
    const scores = document.createElement("div");
    scores.id = AVERAGE_SCORES_ID;
    scores.style = "padding: 15px 0 15px 10px;";
    scores.textContent = "Calculating total average review score...";
    separator.insertAdjacentElement("afterend", scores);
    return scores;
  }

  /**
   *
   * @param {HTMLElement[]} reviews
   * @param {boolean} onlyPreliminaries
   */
  function setAverages(reviews, onlyPreliminaries) {
    const averageScores = getAverages(reviews, onlyPreliminaries);
    const scoresContainer = document.getElementById(AVERAGE_SCORES_ID);
    scoresContainer.innerHTML = "";

    const h2 = document.createElement("h2");
    h2.textContent = "Average Scores";

    const table = document.createElement("table");

    table.innerHTML = "<thead><tr><th>Category</th><th>Average</th></tr></thead><tbody></tbody>";

    scoresContainer.appendChild(h2);
    scoresContainer.appendChild(table);
    const tbody = table.querySelector("tbody");

    for (let property in averageScores) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td style="padding-right: 30px; padding-top: 5px;">${property}</td><td>${averageScores[property].toFixed(2)}</td>`;
      tbody.appendChild(tr);
    }
  }

  /**
   *
   * @param {HTMLElement[]} reviews
   * @param {boolean} onlyPreliminaries
   * @return {AnimeScore | MangaScore}
   */
  function getAverages(reviews, onlyPreliminaries) {
    /** @type {Array<AnimeScore|MangaScore>} */
    const scores = [];
    const mediaType = getMediaType();
    let averageScores;

    switch (mediaType) {
      case "anime":
        averageScores = {
          overall: 0,
          story: 0,
          animation: 0,
          sound: 0,
          character: 0,
          enjoyment: 0
        };
        break;
      case "manga":
        averageScores = {
          overall: 0,
          story: 0,
          art: 0,
          character: 0,
          enjoyment: 0
        };
    }

    const nonZeroCounter = {
      ...averageScores
    };
    reviews.forEach(review => scores.push(getScoreTable(review)));

    for (let score of scores) {
      if (onlyPreliminaries && score["reviewerHasCompleted"]) continue;
      for (let property in averageScores) {
        averageScores[property] += score[property];
        if (score[property] !== 0) nonZeroCounter[property]++;
      }
    }

    for (let property in averageScores) averageScores[property] /= (nonZeroCounter[property] || 1);

    return averageScores;
  }

  /**
   *
   */

  async function main() {
    function sortReviews() {
      const category = document.getElementById(SELECT_ID).value;
      const reviewsTab = document.querySelector(REVIEW_TAB_SELECTOR);
      const moreReviewsButton = reviewsTab.querySelector(MORE_REVIEWS_BUTTON_SELECTOR)
      moreReviewsButton && moreReviewsButton.parentElement.remove();
      currentPageReviews.sort(sortBy(category));
      currentPageReviews.forEach(review => reviewsTab.appendChild(review));
      moreReviewsButton && reviewsTab.appendChild(moreReviewsButton.parentElement);
    }

    function moreReviews() {
      const lastIndex = Math.min(REVIEWS_PER_PAGE, allReviews.length);
      const nextReviews = allReviews.splice(0, lastIndex);
      insertReviews(nextReviews);
      currentPageReviews = [...currentPageReviews, ...nextReviews];

      if (allReviews.length === 0) {
        const reviewsTab = document.querySelector(REVIEW_TAB_SELECTOR);
        reviewsTab.querySelector(MORE_REVIEWS_BUTTON_SELECTOR).parentElement.remove();
      }
    }

    function showAverages() {
      setAverages([...allReviews, ...currentPageReviews], false);
    }

    function preliminaryCallback() {
      const onlyPreliminaries = document.getElementById(ONLY_PRELIMINARY_REVIEWS_ID).value === "No" ? false : true;
      setAverages([...allReviews, ...currentPageReviews], onlyPreliminaries);

      /**
       * 
       * @param {HTMLElement} review
       */
      function hideReviewIfComplete(review) {
        if (onlyPreliminaries && getReviewerHasCompleted(review)) review.style.display = "none";
        else review.style.display = "block";
      }

      allReviews.forEach(hideReviewIfComplete);
      currentPageReviews.forEach(hideReviewIfComplete);
    }

    createLoadingScreen();
    toggleLoadingScreen();
    createAveragesContainer();

    const allReviews = getReviews(await fetchAllReviewsPages());
    let currentPageReviews = getReviews(document);

    createSortingAndReviewsOptions(sortReviews, preliminaryCallback);
    changeMoreReviewsButton(moreReviews);
    showAverages();
    toggleLoadingScreen();
  }

  if (getCurrentPageNumber() === 1 && !hasReviews(document)) return;
  main();
})();