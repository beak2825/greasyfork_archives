// ==UserScript==
// @name         AnimeBytes Collage Jumper
// @namespace    https://animebytes.tv/
// @version      1.0
// @description  Adds navigation buttons to jump between collages on AnimeBytes
// @author       LightArrowsEXE
// @match        https://animebytes.tv/collage.php*
// @icon         https://animebytes.tv/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539051/AnimeBytes%20Collage%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/539051/AnimeBytes%20Collage%20Jumper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Get current collage ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentId = parseInt(urlParams.get("id"));

  // Create navigation container
  const navContainer = document.createElement("div");
  navContainer.style.cssText = `
        margin: 10px 0;
        text-align: center;
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
    `;

  // Create navigation buttons with AB styling
  const prevButton = document.createElement("a");
  const nextButton = document.createElement("a");

  prevButton.className = nextButton.className = "page-link next-prev";
  prevButton.style.cssText = nextButton.style.cssText = `
        display: inline-block;
        min-width: 150px;
        text-align: center;
        position: relative;
    `;

  // Create loading animation
  const createLoadingSpinner = () => {
    const spinner = document.createElement("div");
    spinner.style.cssText = `
        width: 12px;
        height: 12px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px;
    `;
    return spinner;
  };

  // Add loading animation keyframes
  const style = document.createElement("style");
  style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);

  // Initialize buttons with loading state
  const prevSpinner = createLoadingSpinner();
  const nextSpinner = createLoadingSpinner();

  // Create text nodes and spinners
  const prevArrow = document.createTextNode("← ");
  const prevText = document.createTextNode("Searching");
  const nextText = document.createTextNode("Searching ");
  const nextArrow = document.createTextNode("→");

  // Assemble previous button (← Searching [spinner])
  prevButton.appendChild(prevArrow);
  prevButton.appendChild(prevText);
  prevButton.appendChild(prevSpinner);

  // Assemble next button ([spinner] Searching →)
  nextButton.appendChild(nextSpinner);
  nextButton.appendChild(nextText);
  nextButton.appendChild(nextArrow);

  navContainer.appendChild(prevButton);
  navContainer.appendChild(nextButton);

  // Insert after linkbox
  const linkbox = document.querySelector(".linkbox");
  if (linkbox) {
    linkbox.parentNode.insertBefore(navContainer, linkbox.nextSibling);
  }

  // Function to get collage title
  async function getCollageTitle(id) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://animebytes.tv/collage.php?page=1&id=${id}`,
        onload: function (response) {
          if (response.status === 200) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
              response.responseText,
              "text/html"
            );
            const title = doc
              .querySelector("title")
              .textContent.split("::")[0]
              .trim();
            resolve(title);
          } else {
            resolve(null);
          }
        },
        onerror: function () {
          resolve(null);
        },
      });
    });
  }

  // Function to check if a collage exists
  async function checkCollage(id) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://animebytes.tv/collage.php?page=1&id=${id}`,
        onload: function (response) {
          resolve(response.status === 200 ? response : false);
        },
        onerror: function () {
          resolve(false);
        },
      });
    });
  }

  // Function to find nearest valid collages
  async function findNearestCollages() {
    let prevId = currentId - 1;
    let nextId = currentId + 1;
    let foundPrev = false;
    let foundNext = false;

    while ((!foundPrev || !foundNext) && (prevId > 0 || nextId < 999999)) {
      if (!foundPrev && prevId > 0) {
        const prevResponse = await checkCollage(prevId);
        if (prevResponse) {
          foundPrev = true;
          const prevTitle = await getCollageTitle(prevId);
          prevButton.innerHTML = `← ${prevTitle}`;
          prevButton.href = `/collage.php?page=1&id=${prevId}`;
          prevButton.title = prevTitle;
        } else {
          prevId--;
        }
      }

      if (!foundNext) {
        const nextResponse = await checkCollage(nextId);
        if (nextResponse) {
          foundNext = true;
          const nextTitle = await getCollageTitle(nextId);
          nextButton.innerHTML = `${nextTitle} →`;
          nextButton.href = `/collage.php?page=1&id=${nextId}`;
          nextButton.title = nextTitle;
        } else {
          nextId++;
        }
      }
    }

    // Handle cases where no collages are found
    if (prevId <= 0) {
      prevButton.remove();
    }
    if (!foundNext) {
      nextButton.innerHTML = "No next collage";
      nextButton.style.cursor = "default";
      nextButton.removeAttribute("href");
    }
    if (!foundPrev && !foundNext) {
      navContainer.remove();
    }
  }

  // Start searching for nearest collages
  findNearestCollages();
})();
