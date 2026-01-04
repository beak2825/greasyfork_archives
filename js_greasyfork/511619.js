// ==UserScript==
// @name          c.AI Search Sort
// @author        EnergoStalin
// @description   Sort search so cards with public definition stays on top and marked with a star
// @license       AGPL-3.0-only
// @version       1.1.1
// @namespace     https://c.ai
// @match         https://character.ai/*
// @run-at        document-body
// @icon          https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant         GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/511619/cAI%20Search%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/511619/cAI%20Search%20Sort.meta.js
// ==/UserScript==

(async () => {
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/util.ts
async function waitNotNull(func, timeout = 1e4, interval = 1e3) {
  return new Promise((res, rej) => {
    let time = timeout;
    const i = setInterval(async () => {
      const c = await func();
      time -= interval;
      if (time <= 0) {
        clearInterval(i);
        rej();
      }
      if (!c) return;
      clearInterval(i);
      res(c);
    }, interval);
  });
}
__name(waitNotNull, "waitNotNull");
function injectNavigationHook(callback) {
  let old = unsafeWindow.location.href;
  new MutationObserver(() => {
    if (old === unsafeWindow.location.href) return;
    old = unsafeWindow.location.href;
    callback(old);
  }).observe(unsafeWindow.document.body, {
    subtree: true,
    childList: true
  });
  callback(old);
}
__name(injectNavigationHook, "injectNavigationHook");

// src/api.ts
var pageProps = await waitNotNull(() => document.querySelector("#__NEXT_DATA__")?.textContent).then((e) => JSON.parse(e).props.pageProps);
var token = pageProps.token;
async function getCharacterInfo(id) {
  return await fetch(`https://plus.character.ai/chat/character/info/`, {
    headers: {
      Authorization: `Token ${token}`,
      Origin: "https://character.ai/",
      Referer: "https://character.ai/",
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      external_id: id
    })
  }).then((e) => e.json()).then((e) => e.character);
}
__name(getCharacterInfo, "getCharacterInfo");

// src/styles/tooltip.css
GM.addStyle(`
.tooltip {
  position: relative;
  cursor: pointer;
}
.tooltip .tooltip-text {
  visibility: hidden;
  text-align: left;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.7em;
  color: #a6a6a6;
  text-wrap: nowrap;
}
.tooltip .tooltip-head {
  text-align: center;
  font-size: 1.3em;
  color: #a6a6a6;
}
.tooltip .tooltip-even {
  flex-basis: 50%;
}
.tooltip .tooltip-number {
  color: #b0a676;
  text-align: right;
}
.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
`);

// src/styles/bootstrap.css
GM.addStyle(`
.align-items-start {
  align-items: flex-start;
}
`);

// src/icons.ts
var starredIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#75FB4C"><path d="M371.01-324 480-390.22 589-324l-29-124 97-84-127-11-50-117-50 117-127 11 96.89 83.95L371.01-324ZM480-72 360-192H192v-168L72-480l120-120v-168h168l120-120 120 120h168v168l120 120-120 120v168H600L480-72Zm0-102 90-90h126v-126l90-90-90-90v-126H570l-90-90-90 90H264v126l-90 90 90 90v126h126l90 90Zm0-306Z"/></svg>';
var pendingIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5985E1"><path d="M288-420q25 0 42.5-17.5T348-480q0-25-17.5-42.5T288-540q-25 0-42.5 17.5T228-480q0 25 17.5 42.5T288-420Zm192 0q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Zm192 0q25 0 42.5-17.5T732-480q0-25-17.5-42.5T672-540q-25 0-42.5 17.5T612-480q0 25 17.5 42.5T672-420ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>';

// src/statuses.ts
function clearStatus(card) {
  card.querySelector("div[data-status]")?.remove();
}
__name(clearStatus, "clearStatus");
function statusWrapper(card, status) {
  const d = document.createElement("div");
  d.dataset.status = status;
  d.classList.add("flex", "flex-col", "tooltip");
  card.classList.add("align-items-start");
  card.append(d);
  return d;
}
__name(statusWrapper, "statusWrapper");
function isStarred(card) {
  return Boolean(card.querySelector('div[data-status="starred"]'));
}
__name(isStarred, "isStarred");
function setStarredStatus(card, descriptionLength) {
  statusWrapper(card, "starred").innerHTML = `
		<div class="flex grow-0 shrink-0 justify-center">
			${starredIcon}
		</div>
		<div class="flex flex-row gap-1 tooltip-text">
			<span class="tooltip-even">Description</span>
			<span class="tooltip-even tooltip-number">${descriptionLength}</span>
		</div>
	`;
}
__name(setStarredStatus, "setStarredStatus");
function setPendingStatus(card) {
  statusWrapper(card, "pending").innerHTML = `
		<div class="flex flex-row grow-0 shrink-0 w-full items-center justify-center">
			${pendingIcon}
		</div>
	`;
}
__name(setPendingStatus, "setPendingStatus");

// src/sorting/definition.ts
async function _sort(container) {
  const nodes = Array.from(container.childNodes);
  const promises = nodes.map(async (card) => {
    if (isStarred(card)) return [];
    setPendingStatus(card);
    const info = await getCharacterInfo(card.href.split("/").pop());
    clearStatus(card);
    if (info.description?.length > 0) {
      setStarredStatus(card, info.description.length);
    } else {
      container.append(card);
    }
    return [
      card,
      info.description?.length
    ];
  });
  return Promise.all(promises);
}
__name(_sort, "_sort");
function sortByDefinitionLength(entries, container) {
  const sorted = entries.filter(([_, dl]) => dl).sort(([_c1, dl1], [_c2, dl2]) => dl1 > dl2 ? 1 : -1);
  for (const [c] of sorted) {
    container.insertBefore(c, container.firstChild);
  }
}
__name(sortByDefinitionLength, "sortByDefinitionLength");
async function sort(observer, container) {
  observer.disconnect();
  const entries = await _sort(container);
  sortByDefinitionLength(entries, container);
  observer.observe(container, {
    attributes: false,
    childList: true,
    subtree: false
  });
}
__name(sort, "sort");

// src/index.ts
injectNavigationHook(async () => {
  console.log(unsafeWindow.location);
  if (unsafeWindow.location.pathname !== "/search") return;
  const cardsContainer = await waitNotNull(() => document.evaluate("/html/body/div[1]/div/main/div/div/div/main/div/div[2]", document).iterateNext());
  const sortSearches = /* @__PURE__ */ __name((_, observer) => sort(observer, cardsContainer), "sortSearches");
  sortSearches([], new MutationObserver(sortSearches));
});
})()