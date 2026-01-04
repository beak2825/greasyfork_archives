// ==UserScript==
// @name         YouTube YCS Sort By Likes
// @namespace    juliSharowYouTubeYCSSortByLikes
// @description  This script is for the YCS Chrome add on. It creates a button next to the search button that will sort the resulting comments in order by likes
// @version      1.0.3 fix 2.5 === 2,7 by using (parseFloat) and replace comma with dot
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467013/YouTube%20YCS%20Sort%20By%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/467013/YouTube%20YCS%20Sort%20By%20Likes.meta.js
// ==/UserScript==

const debug = false;

(async function (_undefined) {
  if (debug) console.debug("YouTube YCS Sort By Likes");
  const buttonId = "ycs_btn_sort_by_likes";

  function getLikesFromTextContent(textContent) {
    if (debug) console.debug("textContent", textContent);
    const likes = parseFloat(textContent.replace(",", "."));
    if (debug) console.debug("parseFloat(textContent).replace(',','.')", likes);
    if (textContent.toUpperCase().includes("K")) {
      if (debug) console.debug("textContent.toUpperCase().includes(K)");
      return likes * 1000;
    }
    return likes;
  }

  function sortResults() {
    const comments = Array.from(
      document.querySelectorAll(".ycs-icon-like + .ycs-like-count")
    );
    if (debug) console.debug("comments", comments);

    comments
      .sort((a, b) => {
        return (
          getLikesFromTextContent(a.textContent) -
          getLikesFromTextContent(b.textContent)
        );
      })
      .forEach((e) =>
        document
          .querySelector("#ycs_wrap_comments")
          .prepend(e.parentNode.parentNode.parentNode.parentNode.parentNode)
      );
  }

  async function getSortButton() {
    if (debug) console.debug("button doesn't exist already");

    const searchButton = document.querySelector("#ycs_btn_search");
    if (!searchButton) {
      if (debug) console.debug("searchButton doesn't exist", searchButton);
      return undefined;
    }
    const sortButton = searchButton.cloneNode(true);
    sortButton.id = buttonId;
    sortButton.textContent = "Sort by Likes";
    searchButton.parentNode.insertBefore(sortButton, searchButton.nextSibling);
    sortButton.addEventListener("click", (e) => {
      if (debug) console.debug("add OnClick to button", sortButton);
      sortResults();
    });

    return sortButton;
  }

  async function setSortButton() {
    if (document.querySelector(`#${buttonId}`)) {
      if (debug) console.debug("button already exists in Doc", buttonId);
      return;
    }
    let sortButton;
    while (sortButton === undefined) {
      sortButton = getSortButton();
      if (debug) console.debug("sortButton", sortButton);
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  setSortButton();
  window.addEventListener("scroll", setSortButton);
})();
