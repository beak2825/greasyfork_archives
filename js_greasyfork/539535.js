// ==UserScript==
// @name         Add a "Remove Notification" button to submissions
// @namespace    https://github.com/f1r3w4rr10r/fa-utils
// @version      1.0.2
// @description  This adds a "Remove Notification" button next to the "+Fav" buttons.
// @author       f1r3w4rr10r
// @match        https://www.furaffinity.net/view/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539535/Add%20a%20%22Remove%20Notification%22%20button%20to%20submissions.user.js
// @updateURL https://update.greasyfork.org/scripts/539535/Add%20a%20%22Remove%20Notification%22%20button%20to%20submissions.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const upperFavLink = document.querySelector(".fav > a");
  if (!(upperFavLink instanceof HTMLAnchorElement))
    throw new Error(
      "'upperFavLink' was not an instance of 'HTMLAnchorElement'.",
    );

  const href = upperFavLink.href;
  const urlMatch = href.match(/\/(?:un)?fav\/(\d+)\//);
  if (!urlMatch) {
    console.error("The fav URL did not match.", href);
    throw new Error("The fav URL did not match.");
  }

  const submissionId = urlMatch[1];
  if (!submissionId) throw new Error("Could not extract a submission ID.");

  const lowerFavLink = document.querySelector(
    '.favorite-nav > [href^="/fav/"], .favorite-nav > [href^="/unfav/"]',
  );
  if (!(lowerFavLink instanceof HTMLAnchorElement))
    throw new Error(
      "'lowerFavLink' was not an instance of 'HTMLAnchorElement'.",
    );

  /**
   * @param {string} id the submission ID
   * @returns {HTMLAnchorElement}
   */
  function createNotifRemoveButton(id) {
    const anchor = document.createElement("a");
    anchor.href = "javascript:void(0)";
    anchor.textContent = "- S";

    anchor.addEventListener("click", async () => {
      anchor.textContent = "⟳";

      const result = await fetch("/msg/submissions/old@24/", {
        method: "POST",
        body: new URLSearchParams({
          "messagecenter-action": "remove_checked",
          "submissions[]": id,
        }),
        redirect: "manual",
      });

      if (result.type !== "opaqueredirect") {
        console.error("Could not remove the submission notification.", result);
        anchor.textContent = "☓";
      }

      anchor.textContent = "✓";
    });

    return anchor;
  }

  const upperButton = createNotifRemoveButton(submissionId);

  const upperButtonDiv = document.createElement("div");
  upperButtonDiv.style.flexGrow = "0.5";
  upperButtonDiv.appendChild(upperButton);

  upperFavLink.parentElement?.insertAdjacentElement("afterend", upperButtonDiv);

  const lowerButton = createNotifRemoveButton(submissionId);
  lowerButton.className = "button standard mobile-fix";

  lowerFavLink.insertAdjacentElement("afterend", lowerButton);

  lowerButton.insertAdjacentText("beforebegin", " ");
  lowerButton.insertAdjacentText("afterend", " ");
})();
