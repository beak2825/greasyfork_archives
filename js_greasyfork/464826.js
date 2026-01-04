// ==UserScript==
// @name         Unsplash fullscreen
// @namespace    https://github.com/nomyfan/unsplash-fullscreen
// @version      0.3.2
// @description  Add a fullscreen button to Unsplash to view photos in fullscreen mode
// @author       nomyfan(Kim Chan)
// @match        https://unsplash.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464826/Unsplash%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/464826/Unsplash%20fullscreen.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const buttonID = "unsplash-fullscreen-button";

  function run() {
    if (
      !document.querySelector(
        '[data-testid="client-side-hydration-complete"]',
      ) ||
      !window.location.pathname.startsWith("/photos/")
    ) {
      return;
    }

    document
      .querySelectorAll('[data-testid="photos-route"]')
      .forEach((route) => {
        /**
         * @type {HTMLHeadElement | null}
         */
        const headerElement = route.querySelector("div:first-child>header");
        if (
          !headerElement ||
          route.querySelector(`[data-test="${buttonID}"]`)
        ) {
          return;
        }

        const style = document.createElement("style");
        style.textContent = `
.unsplash-fullscreen-button {
  color: white;
  background-color: #fec25a;
  border: 1px solid #0000;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  transition: all 0.1s ease-in-out;
  user-select: none;
  height: 32px;
  line-height: 30px;
  padding: 0 11px;
}

.unsplash-fullscreen-button > svg {
  height: 16px;
  width: 16px;
  display: block;
  fill: #fff;
}

.unsplash-fullscreen-button:hover {
  background-color: #f7ad2a;
}
`;

        const button = document.createElement("button");
        button.setAttribute("data-test", buttonID);
        button.setAttribute("class", "unsplash-fullscreen-button");
        button.innerHTML = `
<svg viewBox="0 0 24 24" aria-hidden="false">
 <path d="M10 21v-2H6.4l4.5-4.5-1.4-1.4L5 17.6V14H3v7h7Zm4.5-10.1L19 6.4V10h2V3h-7v2h3.6l-4.5 4.5 1.4 1.4Z"></path>
</svg>`;
        button.addEventListener("click", () => {
          /**
           * @type {HTMLImageElement}
           */
          const imageElement = route.querySelector(
            "button[type=button] img[srcset]",
          );
          if (!imageElement) return;
          imageElement.requestFullscreen().catch(() => {
            alert("fullscreen not supported");
          });
        });

        const rootElement = document.createElement("div");
        rootElement.appendChild(style);
        rootElement.appendChild(button);

        headerElement.lastElementChild.append(rootElement);
      });
  }

  run();
  setInterval(function () {
    run();
  }, 500);
})();
