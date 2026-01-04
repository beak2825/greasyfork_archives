// ==UserScript==
// @name         Disney plus plus plus
// @namespace    https://github.com/schelmo
// @version      0.5
// @description  Overlay for movie/series tiles with some information (title, year, brief description and genres)
// @author       schelmo
// @license      MIT
// @homepageURL  https://github.com/schelmo/userscript-disney-plus-plus-plus
// @supportURL   https://github.com/schelmo/userscript-disney-plus-plus-plus
// @match        https://www.disneyplus.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/477777/Disney%20plus%20plus%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/477777/Disney%20plus%20plus%20plus.meta.js
// ==/UserScript==

const items = new Map();

const getTitleWithYear = (item) => {
  const title = item.visuals.title;
  let year;
  const releaseYearRange = item.visuals.metastringParts?.releaseYearRange;
  if (releaseYearRange?.startYear) {
    year = releaseYearRange.startYear;
    if (releaseYearRange.endYear) year += ` - ${releaseYearRange.endYear}`;
    // else console.log(releaseYearRange)
  }
  return year ? `${title} <small>(${year})</small>` : title;
};

const getDescription = async (item) => {
  if (item.description) return item.description;

  if (item.visuals?.description) {
    if (item.visuals.description.medium)
      return (item.description = item.visuals.description.medium);
    if (item.visuals.description.brief)
      return (item.description = item.visuals.description.brief);
    if (item.visuals.description.full)
      return (item.description = item.visuals.description.full);
  }
};

const overlay = document.createElement("div");
const overlayH1 = document.createElement("h1");
overlay.appendChild(overlayH1);
const overlayInner = document.createElement("div");
overlay.appendChild(overlayInner);
const overlayBottom = document.createElement("footer");
overlay.appendChild(overlayBottom);

document.addEventListener(
  "pointerenter",
  async (evt) => {
    if (evt.target?.nodeName !== "A") return;
    const data = evt.target.dataset;
    let id = data.itemId;
    if (!items.has(id)) id = evt.target.href?.replace(/.*\/browse\//, "");
    if (!items.has(id)) return;
    const item = items.get(id);
    let hovered = true;
    evt.target.addEventListener(
      "pointerleave",
      () => {
        hovered = false;
        overlay.classList.add("hidden");
      },
      { once: true },
    );

    if (!hovered) return;
    const setContents = () => {
      if (!hovered) return;
      overlayH1.innerHTML = getTitleWithYear(item);
      const bottom = [];

      if (item.visuals.metastringParts?.genres?.values?.length)
        bottom.push(item.visuals.metastringParts.genres.values.join(", "));

      overlayBottom.textContent = bottom.join(" – ");

      overlayInner.textContent = item.description;
    };
    setContents();

    overlay.classList.remove("hidden");
    evt.target.appendChild(overlay);

    if (item.description) return;

    const description = await getDescription(item);
    if (description) setContents();
  },
  { capture: true },
);

const collect = (data, url, byFetch) => {
  let setItems = data.set?.items;
  if (!setItems && data.page?.containers?.length)
    setItems = data.page.containers
      .filter((c) => c.type === "set")
      .map((c) => c.items)
      .flat();

  setItems?.forEach((item) => {
    if (!item.visuals?.description)
      return console.log(
        "Add no collection to items",
        item.visuals?.title,
        item,
      );
    items.set(item.id, item);
    if (item.actions?.[0]?.deeplinkId)
      items.set(item.actions?.[0]?.deeplinkId, item);
  });
};

const urlMatchers = [
  "/svc/search/disney/",
  /\/explore\/v1.\d+\/set\//,
  "/search?query=",
];

unsafeWindow.fetch = async (url, ...args) => {
  const response = await fetch(url, ...args);
  const r = response.clone();
  // r.json().then((d) => console.log(url, d));
  if (urlMatchers.some((matcher) => url.match(matcher))) {
    const res = response.clone();
    requestIdleCallback(() => {
      res.json().then((json) => json.data && collect(json.data, url, true));
    });
  }
  return response;
};

var origOpen = unsafeWindow.XMLHttpRequest.prototype.open;
unsafeWindow.XMLHttpRequest.prototype.open = function (...args) {
  const url = args[1];
  if (urlMatchers?.some((matcher) => url.match(matcher))) {
    this.addEventListener(
      "load",
      function () {
        const responseText = this.responseText;
        requestIdleCallback(() => {
          const json = JSON.parse(responseText);
          if (json.data) collect(json.data, url);
        });
      },
      { once: true },
    );
  }
  origOpen.apply(this, args);
};

const id =
  "_" + (Math.random() + 1).toString(36).substring(7) + String(Date.now());
overlay.id = id;
overlay.setAttribute("id", id);
overlay.classList.add("hidden");
document.body.appendChild(overlay);
const style = document.createElement("style");
document.body.appendChild(style);
style.type = "text/css";
style.textContent = `
#${id} {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0,0,0,0.8);
    color: #ffffff;
    min-height: 100%;
    min-width: 100%;
    position: absolute !important;
    top: 0;
    left: 0;
    inset: 0;
    padding: 12px;
}
#${id} h1 {
    text-align: center;
    font-size: 18px;
}
#${id} small {
    font-size: 13px;
}
#${id} > div {
    text-align: center;
    overflow: auto;
    max-width: 400px;
}
#${id} footer {
    text-align: center;
    font-size: 15px;
    font-style: italic;
}
#${id}.hidden {
    display: none;
}
`;
