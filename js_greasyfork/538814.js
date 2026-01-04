// ==UserScript==
// @name         Auto-remove notifications on fave
// @namespace    https://github.com/f1r3w4rr10r/fa-utils
// @version      1.0.0
// @description  This automatically removes submission notifications, when faving a submission.
// @author       f1r3w4rr10r
// @match        https://www.furaffinity.net/view/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538814/Auto-remove%20notifications%20on%20fave.user.js
// @updateURL https://update.greasyfork.org/scripts/538814/Auto-remove%20notifications%20on%20fave.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const favLinks = Array.from(
    document.querySelectorAll(
      '.favorite-nav > [href^="/fav/"], .fav > [href^="/fav/"]',
    ),
  );

  for (const favLink of favLinks) {
    if (!(favLink instanceof HTMLAnchorElement))
      throw new Error("'favLink' was not an instance of 'HTMLAnchorElement'.");

    favLink.addEventListener("click", async (event) => {
      event.preventDefault();

      const href = favLink.href;
      const urlMatch = href.match(/\/fav\/(\d+)\//);
      if (!urlMatch) {
        console.error("The fav URL did not match.", href);
        throw new Error("The fav URL did not match.");
      }

      const submissionId = urlMatch[1];
      if (!submissionId) throw new Error("Could not extract a submission ID.");

      const result = await fetch("/msg/submissions/old@24/", {
        method: "POST",
        body: new URLSearchParams({
          "messagecenter-action": "remove_checked",
          "submissions[]": submissionId,
        }),
        redirect: "manual",
      });

      if (result.type !== "opaqueredirect") {
        console.error("Could not remove the submission notification.", result);
        throw new Error("Could not remove the submission notification.");
      }

      window.location.assign(href);
    });
  }
})();
