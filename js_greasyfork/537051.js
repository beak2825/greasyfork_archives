// ==UserScript==
// @name         Sillydev Renewal View
// @namespace    https://discopika.tk
// @version      2025-05-24
// @description  See the renewal time in panel
// @author       You
// @match        https://panel.sillydev.co.uk/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sillydev.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537051/Sillydev%20Renewal%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/537051/Sillydev%20Renewal%20View.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("load", () => {
    setTimeout(() => {
      fetch("https://panel.sillydev.co.uk/api/client", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.object !== "list") return;
          const servers = data.data.filter((d) => d.object === "server");
          for (const server of servers) {
            const svg = document.querySelector(
              `a[href='/server/${server.attributes.identifier}'] .ServerRow___StyledDiv9-sc-1d3rgpy-16 .ServerRow___StyledDiv16-sc-1d3rgpy-26 .ServerRow___StyledDiv17-sc-1d3rgpy-27 svg`
            );
            svg.remove();
            const selector = `a[href='/server/${server.attributes.identifier}'] .ServerRow___StyledDiv9-sc-1d3rgpy-16 .ServerRow___StyledDiv16-sc-1d3rgpy-26 .ServerRow___StyledDiv17-sc-1d3rgpy-27 p`;
            waitForElement(selector, (p) => {
              const d = server.attributes.renewal;
              p.innerText = `${d} day${d !== 1 ? "s" : ""}`;
            });
          }
        })
        .catch((err) => console.error("Manual fetch failed:", err));
    }, 2000);
  });
})();
function waitForElement(selector, callback, retries = 10, interval = 200) {
  const el = document.querySelector(selector);
  if (el) return callback(el);
  if (retries <= 0) return;
  setTimeout(
    () => waitForElement(selector, callback, retries - 1, interval),
    interval
  );
}
