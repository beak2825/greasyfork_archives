// ==UserScript==
// @name         WaniKani Dashboard Kanji Sorting
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a sorting button to the kanji on the WaniKani dashboard
// @author       Torbam
// @license      MIT
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @match        wanikani.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/449173/WaniKani%20Dashboard%20Kanji%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/449173/WaniKani%20Dashboard%20Kanji%20Sorting.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  let srsSorting = true;

  function toggleSorting() {
    srsSorting = !srsSorting;

    document.querySelectorAll(".sortingBtn")[0].setAttribute("data-expanded", !srsSorting)

    sortCards(srsSorting);
  }

  function sortCards(isSRS) {
    if (isSRS) {
      // sort by SRS level
      const kanjiList = document.querySelectorAll(".level-progress-dashboard__items")[1];
      const sortedItems = Array.from(kanjiList.children).sort(function (a, b) {
        if (a.children[0].getAttribute("title").includes("Locked!")) return 999;
        return (
          a.children[0].querySelectorAll(".subject-srs-progress__stage--complete").length -
          b.children[0].querySelectorAll(".subject-srs-progress__stage--complete").length
        );
      });

      kanjiList.innerHTML = "";

      sortedItems.forEach(function (element) {
        kanjiList.appendChild(element);
      });
    } else {
      // sort by time
      const kanjiList = document.querySelectorAll(".level-progress-dashboard__items")[1];

      if (!("nextreview" in kanjiList.children[0])) {
        Array.from(kanjiList.children).forEach(function (element) {
          let hourCount = 999;
          let title = element.children[0].getAttribute("title");

          if (title.includes("right now") || title.includes("Unlocked")) {
            hourCount = 0;
          } else if (title.includes("minute")) {
            title = title.slice(0, title.indexOf(" minute"));
            hourCount =
              parseFloat(title.slice(title.lastIndexOf(" ") + 1)) / 60;
          } else if (title.includes("hour")) {
            title = title.slice(0, title.indexOf(" hour"));
            hourCount = parseFloat(title.slice(title.lastIndexOf(" ") + 1));
          } else if (title.includes("day")) {
            title = title.slice(0, title.indexOf(" day"));
            hourCount =
              parseFloat(title.slice(title.lastIndexOf(" ") + 1)) * 24;
          }
          element.setAttribute("nextreview", hourCount);
        });
      }

      const sortedItems = Array.from(kanjiList.children).sort(function (a, b) {
        return a.getAttribute("nextreview") - b.getAttribute("nextreview");
      });

      kanjiList.innerHTML = "";

      sortedItems.forEach(function (element) {
        kanjiList.appendChild(element);
      });
    }
  }

  window.addEventListener(
    "load",
    function () {
      srsSorting = true;

      let progressTitle = document.querySelectorAll(".level-progress-dashboard__content-title")[1]
      let kanjiBtn = document.querySelector("[aria-controls=sitemap__kanji")

      // add button
      let sortingBtn = kanjiBtn.cloneNode(true)
      progressTitle.style.display = "flex"
      progressTitle.children[0].classList.remove("wk-title--underlined")
      sortingBtn.classList.add("sortingBtn")
      sortingBtn.style = "width: auto; left: 8px; top: -1px"
      sortingBtn.children[0].style = "top: 9px; position: relative"
      sortingBtn.children[1].style = "top: 13px; position: relative"
      sortingBtn.children[0].innerHTML = "Time"
      sortingBtn.children[1].innerHTML = "SRS"

      progressTitle.appendChild(sortingBtn)

      // add button functionality
      sortingBtn.addEventListener("click", toggleSorting);

      // first sort after page load
      sortCards(!srsSorting);
      sortCards(srsSorting);
    },
    false
  );
})();
