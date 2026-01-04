// ==UserScript==
// @name        BetterYoutubeTheaterMode
// @description Increases the video player div in the theater view and hides unessesary object.
// @namespace   https://github.com/ArcticOwl-Dev/UserScript_BetterYoutubeTheaterMode
// @homepage    https://github.com/ArcticOwl-Dev/UserScript_BetterYoutubeTheaterMode
// @supportURL  https://github.com/ArcticOwl-Dev/UserScript_BetterYoutubeTheaterMode/issues
// @match       *://www.youtube.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      ArcticOwl
// @license     MIT
// @description 26/03/2025, 10:22:3
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/532016/BetterYoutubeTheaterMode.user.js
// @updateURL https://update.greasyfork.org/scripts/532016/BetterYoutubeTheaterMode.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
        /* Hides Youtube header*/
        #masthead-container.ytd-app.minUI-theater {
            opacity: 0;
            top: calc(var(--ytd-toolbar-height) / -1.4);
            transform: translateY(0);
            transition: transform 0.3s ease, opacity 0.2s ease;
        }
        /* Show Youtube header, when have class showMasthead or when focused in the searchbar */
        #masthead-container.ytd-app.minUI-theater.showMasthead,
        #masthead-container.ytd-app.minUI-theater:focus-within {
          opacity: 1;
          transform: translateY(calc(var(--ytd-toolbar-height) / 1.4));
        }
        /* move content up to the top */
        #page-manager.ytd-app.minUI-theater {
          margin-top: 0px;
        }
        /*full size youtube player */
        ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
          max-height: 100vh;
        }


        /*Hides scrollbar*/
        html.miniUI-theater {
            scrollbar-width: none;  /* For Firefox */
        }

    `);

  let mouseleaveTimer;
  let mastheadDiv;

  function handleMouseEnter() {
    clearTimeout(mouseleaveTimer); /*clear timer when mouse moves back in*/
    mastheadDiv.classList.add("showMasthead");
  }

  function handleMouseLeave() {
    mouseleaveTimer = setTimeout(() => {
      mastheadDiv.classList.remove("showMasthead");
    }, 1000);
  }

  // Function to add the custom class when navigating to a new page
  function addCustomStyle() {
    document.documentElement.classList.add("miniUI-theater");

    const pagemanager = document.querySelector("#page-manager.ytd-app");
    if (pagemanager) {
      pagemanager.classList.add("minUI-theater");
    }

    mastheadDiv = document.querySelector("#masthead-container.ytd-app");
    if (mastheadDiv) {
      mastheadDiv.classList.add("minUI-theater");
      /* hides masthead at start */
      mastheadDiv.classList.remove("showMasthead");
      /* show Youtube header when mouse enter the hidden header div (better then :hover)*/
      mastheadDiv.addEventListener("mouseenter", handleMouseEnter);
      mastheadDiv.addEventListener("mouseleave", handleMouseLeave);
    }
  }

  // Function to remove the class when navigating to a new page
  function removeCustomStyle() {
    document.documentElement.classList.remove("miniUI-theater");

    const pagemanager = document.querySelector("#page-manager.ytd-app");
    if (pagemanager) {
      pagemanager.classList.remove("minUI-theater");
    }

    mastheadDiv = document.querySelector("#masthead-container.ytd-app");
    if (mastheadDiv) {
      mastheadDiv.classList.remove("minUI-theater");
      mastheadDiv.removeEventListener("mouseenter", handleMouseEnter);
      mastheadDiv.removeEventListener("mouseleave", handleMouseLeave);
    }
  }

  // Function to check if <ytd-watch-flexy> tag has the 'theater' and not the 'hidden' attribute
  function checkTheaterAttribute() {
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    if (
      watchFlexy &&
      watchFlexy.hasAttribute("theater") &&
      !watchFlexy.hasAttribute("hidden")
    ) {
      addCustomStyle();
    } else {
      removeCustomStyle();
    }
  }

  // Function to start observing the <ytd-watch-flexy> element for 'theater' attribute changes
  function setupTheaterObserver(watchFlexy) {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        // Check if the 'theater' attribute or the 'hidden' has been added or removed
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "theater" ||
            mutation.attributeName === "hidden")
        ) {
          checkTheaterAttribute();
        }
      });
    });

    // Start observing the <ytd-watch-flexy> element for changes to its attributes
    observer.observe(watchFlexy, { attributes: true });
  }

  // Set up a MutationObserver to watch for the addition of the <ytd-watch-flexy> element
  const initialObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // Look for the addition of the <ytd-watch-flexy> element to the DOM
      if (mutation.type === "childList") {
        const watchFlexy = document.querySelector("ytd-watch-flexy");
        if (watchFlexy) {
          // Once <ytd-watch-flexy> is found, stop observing and start watching its attributes
          initialObserver.disconnect();
          setupTheaterObserver(watchFlexy);
          checkTheaterAttribute(); // Initial check in case the 'theater' attribute is already present
          return; // Stop execution once found
        }
      }
    }
  });

  // Start observing the body for the addition of the <ytd-watch-flexy> element
  initialObserver.observe(document.body, { childList: true, subtree: true });
})();
