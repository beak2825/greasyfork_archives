// ==UserScript==
// @name        Page Flood
// @namespace   snomiao@gmail.com
// @match       http://*/*
// @match       https://*/*
// @grant       none
// @version     2.1.2
// @author      snomiao@gmail.com
// @description Press Shift+Alt+Q to batch open links in the main list in a page. Handy when you want to quick explore all google search results or visit all details pages in a list page.
// @downloadURL https://update.greasyfork.org/scripts/528027/Page%20Flood.user.js
// @updateURL https://update.greasyfork.org/scripts/528027/Page%20Flood.meta.js
// ==/UserScript==

// - get all links
// - get features for each link
// - group similar links
// - get score for groups
// - sort groups by score
// - pick the best group
// - open links in the best group

let listIndex = 0
main();
document.addEventListener("DOMContentLoaded", () => {
  console.debug(getNextListLinks());
});

function main() {
  globalThis.PageFloodController?.abort();
  const ac = (globalThis.PageFloodController = new AbortController());
  addEventListener(
    "keydown",
    async (e) => {
      if (e.shiftKey && e.altKey && e.code == "KeyQ") await openLinksInList();
    },
    { signal: ac.signal }
  );
}
async function openLinksInList() {
  return await openLinks(getNextListLinks());
}

async function openLinks(links) {
  // max 8 page on 1 origin once batch
  // max 16 page on all origin once batch
  const urlss = Object.values(
    Object.groupBy(links, (url, i) => String(Math.floor(i / 8)))
  );
  for await (const urls of urlss) {
    const urlList = urls.join("\n");
    const confirmMsg = `confirm to open ${urls.length} pages?\n\n${urlList}`;
    if (!confirm(confirmMsg)) throw alert("cancelled by user");
    urls.toReversed().map(openDeduplicatedUrl);
    await new Promise((r) => setTimeout(r, 1e3)); // 1s cd
    await new Promise((r) =>
      document.addEventListener("visibilitychange", r, { once: true })
    ); // wait for page visible
  }
}

function openDeduplicatedUrl(url) {
  const opened = (globalThis.openDeduplicatedUrl_opened ??= new Set());
  return opened.has(url) || (open(url, "_blank") && opened.add(url));
}
// robust open, works when window.open is blocked
function open(href, target){
  Object.assign(document.createElement('a'), {href, target}).click()
}

function BagOfWordsModel() {
  const wordSet = new Set();
  return {
    wordSet,
    fit: (texts) => {
      texts.forEach((text) =>
        text
          .toLowerCase()
          .split(/\W+/)
          .forEach((word) => wordSet.add(word))
      );
    },
    transform: (text) => {
      const words = text.toLowerCase().split(/\W+/);
      const vec = Array.from(wordSet).map((word) =>
        words.includes(word) ? 1 : 0
      );
      return vec;
    },
  };
}

function getNextListLinks() {
  const ls =  getAllListLinks()
  console.log(ls)
  return ls.at(listIndex++)
}
function getAllListLinks(){
  // groupBy words and then return map
  return (
    [{ sel: "a" }]
      .map((e) => ({ ...e, list: [...document.querySelectorAll(e.sel)] }))
      .map((e) => ({
        ...e,
        bow: BagOfWordsModel(),
      }))
      .map((e) => ({
        ...e,
        _: e.bow.fit(
          e.list.map((el) => el.className + " " + getElementAttributeNames(el))
        ),
      }))
      .map((e) => ({
        ...e,
        vec: e.list.map((el, i) => [
          elementDepth(el),
          area(el.parentElement?.getBoundingClientRect()),
          el.parentElement?.getBoundingClientRect().width,
          el.parentElement?.getBoundingClientRect().height,
          ...e.bow.transform(el.className + " " + getElementAttributeNames(el)),
        ]),
      }))
      .map((e) => ({ ...e, nor: normalize(e.vec) }))
      .map((e) => ({ ...e, vecGrp: groupByCosineSimilarity(e.nor, 0.99) }))
      .map((e) => ({ ...e, grp: e.vecGrp.map((g) => g.map((i) => e.list[i])) }))
      .map((e) => ({
        ...e,
        rank: e.grp
          .map((g) => ({
            links: g,
            area: area(maxRect(g.map((el) => el.getBoundingClientRect()))),
            areaSum: g
              .map((el) => area(el.getBoundingClientRect()))
              .reduce((a, b) => a + b, 0),
          }))
          .map((g) => ({ ...g, score: Math.log(g.area * g.areaSum) }))
          .toSorted(compareBy((g) => -g.score)),
      }))
      .map((e) => ({
        ...e,
        _: e.rank
          .slice(0, 1)
          .map((grp, i, a) =>
            grp.links.map((el) =>
              flashBorder(
                el,
                getOklch(i / a.length),
                500 + (a.length - i) * 500
              )
            )
          ),
      }))
      // debug
      .map((e) => (console.log(e), { ...e }))
      // link lists
      .map((e) => e.rank.map(({links})=>links.map((a) => a.href)))
      .at(0)
  );
}

function getOklch(t) {
  const l = 0.9 - 0.5 * t;
  const c = 0.2 + 0.3 * t;
  const h = 360 * t;
  return `oklch(${l} ${c} ${h})`;
}
function flashBorder(el, color, duration = 1000) {
  const orig = el.style.outline;
  el.style.outline = `3px solid ${color}`;
  return setTimeout(() => (el.style.outline = orig), duration);
}
function compareBy(fn) {
  return (a, b) => fn(a) - fn(b);
}
function maxRect(rects) {
  return {
    left: Math.min(...rects.map((e) => e.left)),
    top: Math.min(...rects.map((e) => e.top)),
    right: Math.max(...rects.map((e) => e.right)),
    bottom: Math.max(...rects.map((e) => e.bottom)),
  };
}
function area({ left, right, top, bottom }) {
  return (right - left) * (bottom - top);
}
function elementDepth(e) {
  return !e ? 0 : 1 + elementDepth(e.parentElement);
}
function normalize(arr) {
  const maxs = arr.reduce(
    (a, b) => a.map((e, i) => Math.max(e, b[i])),
    Array(arr[0].length).fill(-Infinity)
  );
  return arr.map((e) => e.map((v, i) => v / maxs[i]));
}
function dot(a, b) {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}
function magnitude(a) {
  return Math.sqrt(dot(a, a));
}
function cosineSimilarity(a, b) {
  return dot(a, b) / (magnitude(a) * magnitude(b));
}
function groupByCosineSimilarity(arr, threshold = 0.99) {
  const groups = [];
  const visited = new Set();
  arr.forEach((vec, i) => {
    if (visited.has(i)) return;
    const group = [i];
    visited.add(i);
    for (let j = i + 1; j < arr.length; j++) {
      if (cosineSimilarity(vec, arr[j]) > threshold) {
        group.push(j);
        visited.add(j);
      }
    }
    groups.push(group);
  });
  return groups;
}

function getElementAttributeNames(el) {
  if (!el) return "";
  const attrs = Array.from(el.attributes || [])
    .map((attr) => attr.name)
    .join(" ");
  return attrs;
}
