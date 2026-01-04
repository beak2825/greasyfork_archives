// ==UserScript==
// @name         EH – Page Scrobbler
// @namespace    fabulous.cupcake.jp.net
// @version      2022.11.03.1
// @description  Visualize GID and add the ability to easily jump or scrobble
// @author       FabulousCupcake
// @license      MIT
// @runat        document-start
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @downloadURL https://update.greasyfork.org/scripts/454169/EH%20%E2%80%93%20Page%20Scrobbler.user.js
// @updateURL https://update.greasyfork.org/scripts/454169/EH%20%E2%80%93%20Page%20Scrobbler.meta.js
// ==/UserScript==

const stylesheet = `

.search-scrobbler {
  width: 800px;
  outline: 1px cyan dashed;
  margin: 0 auto;
  padding: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.search-scrobbler .bar {
  display: block;
  width: 800px;
  height: 25px;
  border: 1px solid red;
  box-sizing: border-box;
  position: relative;
}

.search-scrobbler .bar .bar-cursor {
  width: 1px;
  height: 100%;
  background: #0f0;
}

.search-scrobbler .bar-wrapper {
  display: flex;
  flex-direction: column;
}

.search-scrobbler .bar-labels {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.search-scrobbler .bar-hover {
  display: block;
  width: 1px;
  height: 100%;
  background: #f0f;
  position: absolute;
}

.search-scrobbler .bar-hovertext {
  position: absolute;
  outline: 1px solid #f0f;
  top: -1.5em;
}

.search-scrobbler,
.search-scrobbler * {
  outline: 0px none !important;
}

`;

const injectStylesheet = () => {
    const stylesheetEl = document.createElement("style");
    stylesheetEl.innerHTML = stylesheet;
    document.body.appendChild(stylesheetEl);
}

const hasGalleryListTable = () => {
  return !!document.querySelector(".itg.gltm");
}

const tryUpdateKnownMaxGID = GID => {
  const url = new URL(location.href);
  if (url.pathname !== "/") return;
  if (url.search !== "") return;

  const maxGID = document.querySelector(".itg tr:nth-child(2) .glname a").href.match(/\/(\d+)\//)?.[1];
  localStorage.setItem("EHPS-maxGID", maxGID);
}

const addPageScrobbler = () => {
  const insertInitialElement = () => {
    const hook = document.querySelector(".searchnav");

    const maxGID = localStorage.getItem("EHPS-maxGID");
    let cursorGID = new URL(location.href).searchParams.get("next");
    if (!cursorGID) {
      // No searchparams, use last row in page
      cursorGID = document.querySelector(".itg tr:last-child .glname a").href.match(/\/(\d+)\//)?.[1];
    }

    const cursorLeftMargin = cursorGID / maxGID * 100;

    const el = `
<div class="search-scrobbler">
  <div class="bar-wrapper bar-full">
    <div class="bar">
      <div class="bar-cursor" style="margin-left: ${cursorLeftMargin}%">${cursorGID}</div>
    </div>
    <div class="bar-labels">
      <div class="bar-min">1</div>
      <div class="bar-max">${maxGID}</div>
    </div>
  </div>
</div>`;
    hook.insertAdjacentHTML("beforebegin", el);
  }

  const addEventListeners = () => {
    const addHoverElement = offset => {
      /* This may happen because bar-hover kinda blocking and screws up the offsetX value */
      /* We need it for the link though */
      if (offset <2) return;

      document.querySelector(".bar-hover")?.remove();

      const maxGID = localStorage.getItem("EHPS-maxGID");
      const width = 800;
      const hoverGID = (offset / 800 * maxGID).toFixed(0);

      const url = new URL(location.href);
      url.searchParams.set("next", hoverGID);

      const hook = document.querySelector(".bar-full .bar");
      const el = `
<a class="bar-hover" href="${url}" style="left: ${offset}px;">
  <div class="bar-hovertext">${hoverGID}</div>
</a>`;
      
      hook.insertAdjacentHTML("afterbegin", el);
    }

    const handler = e => {
      addHoverElement(e.offsetX);
    }

    const el = document.querySelector(".bar-full .bar");
    el.addEventListener("mousemove", handler);
  }

  insertInitialElement();
  addEventListeners();
}

const main = () => {
  if (!hasGalleryListTable()) return;
  tryUpdateKnownMaxGID();
  injectStylesheet();
  addPageScrobbler();
}

main();