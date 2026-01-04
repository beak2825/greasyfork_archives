// ==UserScript==
// @name         FanPass Btn
// @version      1.4.1
// @author       paradox-sp
// @description  Adds button to redirect OnlyFans,Fansly,Candfans to Coomer with enhancement
// @namespace    https://greasyfork.org/en/users/1333430
// @match        https://onlyfans.com/*
// @match        https://coomer.st/*
// @match        https://fansly.com/*
// @match        https://candfans.jp/*
// @grant        GM_openInTab
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/b3xb48b4ridqrper30mevtkynuku
// @downloadURL https://update.greasyfork.org/scripts/514236/FanPass%20Btn.user.js
// @updateURL https://update.greasyfork.org/scripts/514236/FanPass%20Btn.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Function to handle redirection
  function redirect(username, service) {
    const coomerUrl = `https://coomer.st/${service}/user/${username}`;
    GM_openInTab(coomerUrl, { active: true });
  }

  function createRedirectButton(username, service) {
    const button = document.createElement("button");
    button.innerHTML = `<img src="https://coomer.st/favicon.ico" style="width: 24px; height: 24px; display: block; margin: auto;">`;
    button.className = "redirect-button";
    button.addEventListener("click", () => redirect(username, service));
    document.body.appendChild(button);
  }

  // Add styles for the button and main content adjustment
  const style = document.createElement("style");
  style.textContent = `
          .redirect-button {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 9999;
              border: none;
              border-radius: 50%;
              background-color: rgba(105, 105, 105, 0.7);
              width: 50px;
              height: 50px;
              padding: 10px;
              box-sizing: border-box;
              cursor: pointer;
          }
          .shifted.content-wrapper.full-width {
              width: 100% !important;
              margin-left: 0 !important;
          }
          .post-card {
              border-radius: 10px !important;
              overflow: hidden;
          }
          .post-card__image-container {
              overflow: visible;
          }
          .post-card__image {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .post-card__image-container:hover .post-card__image {
              transform: scale(1.1);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .post-card.post-card--preview {
              transform: scale(1.2);
              margin: 20px;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              backface-visibility: hidden;
              perspective: 1000px;
          }
          .post-card.post-card--preview:hover {
              transform: scale(1.3);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .ad-banner, .ad-container, .banner, .advertisement {
              display: none !important;
          }
          .post__nav-links {
              position: sticky;
              top: 50%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              z-index: 1000;
              transform: translateY(-50%);
          }
          .post__nav-item {
              flex: 1;
              text-align: center;
              font-size: 130%;
          }
          .post__nav-item.subtitle {
              font-size: 130%;
              position: absolute;
              left: 20%;
          }
          .post__nav-item a {
              text-decoration: none;
              color: inherit;
              font-size: 130%;
          }
          .post__nav-item.previous {
              position: absolute;
              left: 20%;
          }
          .post__nav-item.next {
              position: absolute;
              right: 20%;
          }
          .glow {
              animation: glow 1.5s infinite alternate;
          }
          @keyframes glow {
              0% {
                  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00ff, 0 0 25px #ff00ff, 0 0 30px #ff00ff, 0 0 35px #ff00ff;
              }
              50% {
                  text-shadow: 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff, 0 0 25px #ff00ff, 0 0 30px #ff00ff, 0 0 35px #ff00ff, 0 0 40px #ff00ff;
              }
              100% {
                  text-shadow: 0 0 15px #fff, 0 0 25px #fff, 0 0 35px #fff, 0 0 45px #ff00ff, 0 0 55px #ff00ff, 0 0 65px #ff00ff, 0 0 75px #ff00ff;
              }
          }
      `;
  document.head.appendChild(style);

  function closeSidebar() {
    setTimeout(() => {
      const sidebar = document.querySelector(".global-sidebar");
      const closeButton = document.querySelector(
        ".global-sidebar .close-sidebar"
      );

      if (sidebar && sidebar.classList.contains("expanded") && closeButton) {
        closeButton.click();
      }

      setTimeout(() => {
        removeHeader();
      }, 100);
    }, 1000);
  }

  function removeHeader() {
    const header = document.querySelector(".header.sidebar-retracted");

    if (header) {
      header.remove();
    } else {
      const observer = new MutationObserver(() => {
        const header = document.querySelector(".header.sidebar-retracted");
        if (header) {
          header.remove();
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  function removeMatrixBanner() {
    const matrixBanner = document.querySelector(
      'a[href="https://coomer.st/matrix"]'
    );
    if (matrixBanner) {
      matrixBanner.remove();
    }
  }

  function moveNavElement() {
    const navElements = document.querySelectorAll(".post__nav-links");
    const postBodyElement = document.querySelector(".post__body");

    navElements.forEach((navElement) => {
      const previousItem =
        navElement.querySelector(".post__nav-link.prev") ||
        navElement.querySelector(".post__nav-item.subtitle");
      if (previousItem) {
        previousItem.innerHTML = "←";
        previousItem.parentElement.classList.add("previous", "glow");
      }

      const nextItem = navElement.querySelector(".post__nav-link.next");
      if (nextItem) {
        nextItem.innerHTML = "→";
        nextItem.parentElement.classList.add("next", "glow");
      }
    });
  }

  function runScript() {
    if (window.location.href.includes("onlyfans.com")) {
      const profileMatch = window.location.href.match(
        /https:\/\/onlyfans.com\/([^/]+)/
      );
      if (profileMatch) {
        const username = profileMatch[1];
        createRedirectButton(username, "onlyfans");
      }
    }

    if (window.location.href.includes("fansly.com")) {
      (async () => {
        let userID = null;
        const profileMatch = window.location.href.match(
          /https:\/\/fansly.com\/([^/]+)/
        );
        if (profileMatch) {
          const userName = profileMatch[1];
          if (userName) {
            const res = await fetch(
              `https://apiv3.fansly.com/api/v1/account?usernames=${userName}&ngsw-bypass=true`
            );
            const data = await res.json();
            userID = data?.response?.[0]?.id ?? null;
          }
          if (userID) {
            createRedirectButton(userID, "fansly");
          }
        }
      })();
    }

    if (window.location.href.includes("candfans.jp")) {
      const processedUserIds = new Set();
      const observer = new MutationObserver(() => {
        document.querySelectorAll("img[data-src]").forEach((imgElement) => {
          const userID = imgElement
            .getAttribute("data-src")
            ?.match(/user\/(\d+)\//)?.[1];
          if (userID && !processedUserIds.has(userID)) {
            createRedirectButton(userID, "candfans");
            processedUserIds.add(userID);
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (window.location.href.includes("coomer.st")) {
      removeMatrixBanner();
      if (
        window.location.href.includes("coomer.st/onlyfans/user") ||
        window.location.href.includes("coomer.st/fansly/user") ||
        window.location.href.includes("coomer.st/candfans/user")
      ) {
        closeSidebar();
        const mainContent = document.querySelector(".shifted.content-wrapper");
        if (mainContent) {
          mainContent.classList.add("full-width");
        }
        const imageContainers = document.querySelectorAll(
          ".post-card.post-card--preview"
        );
        imageContainers.forEach((container) => {
          container.style.transform = "scale(1.2)";
          container.style.margin = "20px";
          container.style.transition =
            "transform 0.3s ease, box-shadow 0.3s ease";
          container.style.backfaceVisibility = "hidden";
          container.style.perspective = "1000px";
          container.addEventListener("mouseover", () => {
            container.style.transform = "scale(1.3)";
            container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          });
          container.addEventListener("mouseout", () => {
            container.style.transform = "scale(1.2)";
            container.style.boxShadow = "none";
          });
        });
      }
    }

    const links = document.querySelectorAll("a.image-link");
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.open(link.href, "_blank");
      });
    });
    moveNavElement();
  }

  // Debounce function to limit the rate at which a function can fire.
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Initial script run
  document.addEventListener("DOMContentLoaded", runScript);
  window.addEventListener("load", runScript);

  // Observe URL changes
  let lastUrl = location.href;
  const observer = new MutationObserver(
    debounce(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        runScript();
      }
    }, 500)
  );
  observer.observe(document, { subtree: true, childList: true });
})();