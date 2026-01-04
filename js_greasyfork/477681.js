// ==UserScript==
// @name         Racer Leaderboard for Nitro Type
// @version      0.4
// @description  Displays the Racer Leaderboard along with Last 7 days.
// @author       Silas Davis
// @match        *://*.nitrotype.com/leaderboards
// @grant        none
// @namespace    https://singdev.wixisite.com/sing-developments
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477681/Racer%20Leaderboard%20for%20Nitro%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/477681/Racer%20Leaderboard%20for%20Nitro%20Type.meta.js
// ==/UserScript==

const leaderboardCard = document.querySelector("main.structure-content section.card"),
  leaderboardTableContainer = leaderboardCard?.querySelector(".well--p"),
  leaderboardObj = leaderboardTableContainer ? findReact(leaderboardTableContainer) : null;

if (!leaderboardCard || !leaderboardTableContainer || !leaderboardObj) {
  return;
}

const style = document.createElement("style");
style.appendChild(
  document.createTextNode(`
    .nt-new-lb { margin-bottom: 1rem }
    .nt-new-lb .tabs-container { display: flex; }
    .nt-new-lb .tabs-container .btn { flex: 1; text-align: center; }
    .nt-new-lb .btn { margin-right: 15px }
  `)
);
document.head.appendChild(style);

fetch("https://www.nitrotype.com/api/v2/leaderboards?time=racer")
  .then((resp) => resp.json())
  .then((resp) => {
    leaderboardObj.props.leaderboard.points.teams.season = {
      scores: resp.results.scores,
      timeSinceCache: resp.results.timeSinceCache,
    };
    leaderboardCard.querySelector(".split-cell.tar").remove();

    const tabContainer = document.createElement("div");
    tabContainer.classList.add("nt-new-lb", "tabs-container");
    tabContainer.innerHTML = `
      <button type="button" class="btn btn--dark btn--outline btn--thin is-active is-frozen" data-tabindex="0">Team</button>
      <button type="button" class="btn btn--dark btn--outline btn--thin" data-tabindex="1">Racer</button>`;

    tabContainer.addEventListener("click", (e) => {
      const target = e.target.closest(".btn");
      if (!target) {
        return;
      }
      tabContainer.querySelectorAll(".btn").forEach((elm) => {
        elm.classList.remove("is-active", "is-frozen");
      });
      target.classList.add("is-active");
      if (target.dataset.tabindex === "1") {
        // When the "Racer" tab is clicked, create an iframe that fills the leaderboard section
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "750px";
        iframe.src = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdD5xW31QXh8eJA9VVPwu2HQVTpXdiF-0whuJnOniQ58zK0fZ6d-PiERSlfHrvy9IBdnuzPbNE322Y/pubhtml?widget=true&amp;headers=false"; // Replace with your desired URL
        leaderboardTableContainer.innerHTML = '';
        leaderboardTableContainer.appendChild(iframe);
      } else if (target.dataset.tabindex === "0") {
        // When the "Last 7 Days" tab is clicked, simply reload the page
        location.reload();
      }
    });

    leaderboardCard.prepend(tabContainer);
  });

// Source: https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging/39165137#39165137
function findReact(dom, traverseUp = 0) {
  const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"));
  const domFiber = dom[key];
  if (domFiber == null) return null;
  const getCompFiber = (fiber) => {
    let parentFiber = fiber?.return;
    while (typeof parentFiber?.type == "string") {
      parentFiber = parentFiber?.return;
    }
    return parentFiber;
  }
  let compFiber = getCompFiber(domFiber);
  for (let i = 0; i < traverseUp && compFiber; i++) {
    compFiber = getCompFiber(compFiber);
  }
  return compFiber?.stateNode;
}
