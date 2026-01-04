// ==UserScript==
// @name         Netflix Douban Rating
// @namespace    http://tampermonkey.net/
// @version      2024-07-07
// @description  Add Douban rating to Netflix.com
// @author       You
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499928/Netflix%20Douban%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/499928/Netflix%20Douban%20Rating.meta.js
// ==/UserScript==

const NETFLIX_TITLE_SUFFIX = "— Netflix";
const BASE_URL = "https://www.google.com/search?q=site:douban.com ";
const RATING_KEYWORDS = "豆瓣评分：";

const isPreview = () => {
  if (location.search.startsWith("?jbv")) {
    return true;
  }
  if (location.pathname.startsWith("/title")) {
    return true;
  }
  return false;
};

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const getRating = (name) => {
  const url = BASE_URL + name + " 豆瓣评分";
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url,
      onload: function (response) {
        const text = response.responseText;
        if (text.includes(RATING_KEYWORDS)) {
          const index = text.indexOf(RATING_KEYWORDS);
          const rating = text.slice(
            index + RATING_KEYWORDS.length,
            index + RATING_KEYWORDS.length + 3
          );
          resolve(rating);
        }
      },
    });
  });
};

const addRating = debounce(async (title = document.title) => {
  if (title.includes(NETFLIX_TITLE_SUFFIX) && isPreview()) {
    const name = title
      .slice(0, title.length - NETFLIX_TITLE_SUFFIX.length)
      .replace(/[《》]/g, "");
    const rating = await getRating(name);
    const dialog = document.querySelector('[role="dialog"]');
    const maturityElement = dialog.getElementsByClassName("maturity-rating")[0];
    if (maturityElement) {
      const parentElement = maturityElement.parentElement;
      const ratingElement = document.createElement("span");
      ratingElement.innerText = "豆瓣 " + rating;
      ratingElement.style =
        "color: #f1c40f; font-weight: bold; margin-right: 1rem;";
      parentElement.insertBefore(ratingElement, maturityElement);
    }
  }
}, 500);

(function () {
  "use strict";
  const observer = new MutationObserver((mutations) => {
    const title = mutations[0].target.text;
    addRating(title);
  });

  observer.observe(document.querySelector("title"), {
    subtree: true,
    characterData: true,
    childList: true,
  });
  addRating();
})();
