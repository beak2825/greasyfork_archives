// ==UserScript==
// @name         Crunchy ASS
// @namespace    https://github.com/ownadi/crunchy-ass
// @version      2024-08-13
// @description  drag n' drop external ASS subtitles into Crunchyroll WEB player
// @author       ownadi
// @match        https://static.crunchyroll.com/vilos-v2/web/vilos/player.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license      WTFPL; http://www.wtfpl.net
// @downloadURL https://update.greasyfork.org/scripts/503570/Crunchy%20ASS.user.js
// @updateURL https://update.greasyfork.org/scripts/503570/Crunchy%20ASS.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let currentAss = null;
  const videoEl = document.querySelector("video");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    document.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (eventName === "drop" || eventName === "dragleave") {
          videoEl.parentElement.style.border = "none";
        } else {
          videoEl.parentElement.style.border = "4px #ff640a dashed";
        }
      },
      true
    );
  });

  const videoObserver = new MutationObserver(() => {
    currentAss?.destroy();
  });
  videoObserver.observe(videoEl, {
    attributes: true,
    attributeFilter: ["src"],
  });

  document.addEventListener(
    "drop",
    async (e) => {
      e.stopPropagation();

      const assScript = await e.dataTransfer.files[0].text();

      import("https://cdn.jsdelivr.net/npm/assjs@latest/dist/ass.min.js").then(
        ({ default: ASS }) => {
          currentAss?.destroy();

          currentAss = new ASS(assScript, videoEl);

          videoEl.pause();
          videoEl.play();
        }
      );
    },
    true
  );
})();
