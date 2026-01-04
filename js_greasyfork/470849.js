// ==UserScript==
// @name        Hospital Refresh
// @description Refresh Hospital page without having to switch pages
// @namespace   finally.torn.HospitalRefresh
// @match       https://www.torn.com/hospitalview.php*
// @run-at      document-end
// @version     1.0
// @author      finally
// @downloadURL https://update.greasyfork.org/scripts/470849/Hospital%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/470849/Hospital%20Refresh.meta.js
// ==/UserScript==

let current = 0;
function handleClick(nodes) {
  if (!nodes || !nodes.length) return;

  Array.from(nodes).forEach(node => {
    let start = ((node.getAttribute("page") || 1) - 1) * 50;
    node.addEventListener("click", () => {
      if (current != start) {
        current = start;
        return;
      }

      window.location.hash = `start=${start}${window.location.hash.indexOf("+") == -1 ? "+" : ""}`;
    });
  });
}

handleClick(document.querySelectorAll(".pagination > a"));
new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    for (const node of mutation.addedNodes) {
      handleClick(node.querySelectorAll && node.querySelectorAll(".pagination > a"));
    }
  });
}).observe(document.querySelector(".content-wrapper"), {childList: true, subtree: true});