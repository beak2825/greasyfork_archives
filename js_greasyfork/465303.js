// ==UserScript==
// @name             [SNOLAB] Alt + 123... Searching Results Links List Batch Open
// @name:zh          [雪星实验室] Alt + 123... 一键批量打开谷歌必应搜索的前2的n次方项搜索结果
// @namespace        https://userscript.snomiao.com/
// @version          1.1.0
// @description      To quickly understand a field, press Alt+1 ...2,3,4...Alt+5 on the search page of Google or Bing to open the search results of the first 2 nth power items and copy the opened ones link. Currently supports: Google, Bing, Zhihu.
// @description:zh   快速了解一个领域用，在谷歌或必应的搜索页面 按 Alt+1 ...2,3,4... Alt+5  将会打开前2的n次方项的搜索结果，并复制打开的链接。目前支持：谷歌、必应、知乎。
// @author           snomiao@gmail.com
// @match            *://google.com/*
// @match            *://bing.com/*
// @match            *://youtube.com/*
// @match            *://zhihu.com/*
// @match            *://and-all-searching-results.com/*
// @match            *://*/*
// @grant            none
// @contributionURL  https://snomiao.com/donate
// @supportURL       https://github.com/snomiao/userscript.js/issues
// @downloadURL https://update.greasyfork.org/scripts/465303/%5BSNOLAB%5D%20Alt%20%2B%20123%20Searching%20Results%20Links%20List%20Batch%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/465303/%5BSNOLAB%5D%20Alt%20%2B%20123%20Searching%20Results%20Links%20List%20Batch%20Open.meta.js
// ==/UserScript==
"use strict";
(() => {
  // ../node_modules/hotkey-mapper/dist/index.mjs
  var { keys } = Object;
  function mapObject(fn, obj) {
    if (arguments.length === 1) {
      return (_obj) => mapObject(fn, _obj);
    }
    let index = 0;
    const objKeys = keys(obj);
    const len = objKeys.length;
    const willReturn = {};
    while (index < len) {
      const key = objKeys[index];
      willReturn[key] = fn(
        obj[key],
        key,
        obj
      );
      index++;
    }
    return willReturn;
  }
  var mapObjIndexed = mapObject;
  function hotkeyMapper(mapping, options) {
    const handler = (event) => {
      if (!event.key)
        throw new Error("Invalid KeyboardEvent");
      if (!event.code)
        throw new Error("Invalid KeyboardEvent");
      const key = event.key?.toLowerCase();
      const code = event.code?.toLowerCase();
      const simp = event.code?.replace(/^(?:Key|Digit|Numpad)/, "").toLowerCase();
      const map = new Proxy(event, {
        get: (target2, p) => Boolean(
          {
            [`${key}Key`]: true,
            [`${code}Key`]: true,
            [`${simp}Key`]: true
          }[p] ?? target2[p]
        )
      });
      const mods = "meta+alt+shift+ctrl";
      mapObjIndexed((fn, hotkey) => {
        const conds = `${mods}+${hotkey.toLowerCase()}`.replace(/win|command|search/, "meta").replace(/control/, "ctrl").split("+").map((key2) => key2.toLowerCase().trim()).map((k, i) => [k, i >= 4 === map[`${k}Key`]]);
        if (!Object.entries(Object.fromEntries(conds)).every(([, ok]) => ok))
          return;
        event.stopPropagation?.();
        event.preventDefault?.();
        return fn(event);
      }, mapping);
    };
    const target = options?.target ?? globalThis;
    target.addEventListener(options?.on ?? "keydown", handler, options);
    return function unload() {
      target.removeEventListener(options?.on ?? "keydown", handler, options);
    };
  }

  // ../ts/$$.ts
  function $$(sel, el = document) {
    return [...el.querySelectorAll(sel)];
  }

  // ../ts/LinksListBatchOpen.user.ts
  globalThis.llboUnload?.();
  globalThis.llboUnload = main();
  function main() {
    console.log("[Links List Batch Open] LOADED");
    const linkAlreadyOpened = /* @__PURE__ */ new Set();
    return hotkeyMapper(
      {
        "alt+1": () => openLinkByCount(2 ** 1),
        "alt+2": () => openLinkByCount(2 ** 2),
        "alt+3": () => openLinkByCount(2 ** 3),
        "alt+4": () => openLinkByCount(2 ** 4),
        "alt+5": () => openLinkByCount(2 ** 5),
        "alt+6": () => openLinkByCount(2 ** 6),
        "alt+7": () => openLinkByCount(2 ** 7),
        "alt+8": () => openLinkByCount(2 ** 8),
        "alt+9": () => openLinkByCount(2 ** 9),
        "alt+shift+1": () => tryCopyLinkByCount(2 ** 1),
        "alt+shift+2": () => tryCopyLinkByCount(2 ** 2),
        "alt+shift+3": () => tryCopyLinkByCount(2 ** 3),
        "alt+shift+4": () => tryCopyLinkByCount(2 ** 4),
        "alt+shift+5": () => tryCopyLinkByCount(2 ** 5),
        "alt+shift+6": () => tryCopyLinkByCount(2 ** 6),
        "alt+shift+7": () => tryCopyLinkByCount(2 ** 7),
        "alt+shift+8": () => tryCopyLinkByCount(2 ** 8),
        "alt+shi  ft+9": () => tryCopyLinkByCount(2 ** 9)
      },
      { capture: true, on: "keydown" }
    );
    function linkOpen(link) {
      if (!linkAlreadyOpened.has(link)) {
        window.open(link);
      }
      linkAlreadyOpened.add(link);
    }
    function openLinkByCount(count = 1) {
      console.log("openLinkByCount", count);
      const links = getLinks(count);
      copyLinks(links);
      links.map((e) => e.link).reverse().map(linkOpen);
    }
  }
  function tryCopyLinkByCount(count = 1) {
    const links = getLinks(count);
    copyLinks(links);
    return links;
  }
  async function copyLinks(links) {
    const md = links.map(markdownLinksGenerate).join("\n\n");
    alert("copied links: " + md);
    await navigator.clipboard.writeText(md);
  }
  function longestCommonSequenceMatrix(m, a, b, x, y) {
    const lcs = longestCommonSequenceMatrix;
    return !x || !y ? "" : a[x - 1] === b[y - 1] ? lcs(m, a, b, x - 1, y - 1) + a[x - 1] : m[y][x - 1] > m[y - 1][x] ? lcs(m, a, b, x - 1, y) : lcs(m, a, b, x, y - 1);
  }
  function longestCommonSequence(a, b) {
    const w = a.length, h = b.length;
    const m = Array(1 + h).fill(0).map(() => Array(1 + w).fill(0));
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        m[1 + y][1 + x] = a[x] === b[y] ? m[y][x] + 1 : Math.max(m[y][1 + x], m[1 + y][x]);
    return longestCommonSequenceMatrix(m, a, b, w, h);
  }
  function elementFeatureList(ele) {
    return [...ele.querySelectorAll("*")].map((e) => e?.tagName + e?.className);
  }
  function featureElementAsk(ele) {
    return !"style script span".toUpperCase().split(" ").includes(ele.tagName);
  }
  function elementListStrengh(ele) {
    return Math.log(1 + (ele.textContent || "").length) * (ele.children.length - 1) * [...ele.children].filter(featureElementAsk).map(elementFeatureList).map((_, i, a) => longestCommonSequence(a[i], a[i + 1] || [])).reduce((\u524D, \u540E) => \u524D + \u540E.length, 0);
  }
  function listElementList() {
    const elements = $$("div,dl,ul,ol,tbody,table,td");
    const sorted = elements.filter((e) => e.children.length > 1).map((element) => {
      const children = [...element.children];
      return {
        element,
        strength: elementListStrengh(element),
        featureList: children.filter(featureElementAsk).map(elementFeatureList)
      };
    });
    return sortBy((a) => -a.strength, sorted);
  }
  function titleLinkElementExtract(e) {
    return e?.querySelector("dd,dt,h1,h2,h3,h4,h5,h6")?.querySelector("a") || [...e?.querySelectorAll("a")]?.filter(
      (e2) => e2.querySelector("dd,dt,h1,h2,h3,h4,h5,h6")
    )?.[0] || e?.querySelector("a");
  }
  function titleLinkExtract(element) {
    return {
      element,
      title: element?.textContent?.replace(/\s+/g, " ").trim(),
      link: element?.href
    };
  }
  function pageMainTitleLinkListExtract() {
    const list = listElementList();
    const filteredList = list.flatMap(
      (father, i, a) => a.some(
        (son, j) => i != j && father.element.contains(son.element) && son.strength > father.strength
      ) ? [] : [father]
    ).flatMap((e, _i, a) => e.strength > a[0].strength * 0.1 ? [e] : []);
    const sortedList = sortBy(
      (a) => a.element.offsetTop * window.outerWidth + a.element.offsetLeft,
      filteredList
    );
    const result = sortedList.map(({ element }) => element).flatMap((e) => [...e?.children]?.map?.(titleLinkElementExtract) || []).flatMap((e) => e ? [e] : []).map(titleLinkExtract).flatMap((e) => e.title ? [e] : []).flatMap((e) => e.link?.match?.(/^http/) ? [e] : []);
    return result;
  }
  function getLinks(\u6570\u91CF = Infinity) {
    return pageMainTitleLinkListExtract().slice(0, \u6570\u91CF);
  }
  function markdownLinksGenerate({ title, link }) {
    return `- [${title}](${link})`;
  }
  function sortBy(sortFn, list) {
    if (arguments.length === 1)
      return (_list) => sortBy(sortFn, _list);
    const clone = [...list];
    return clone.sort((a, b) => {
      const aSortResult = sortFn(a);
      const bSortResult = sortFn(b);
      if (aSortResult === bSortResult)
        return 0;
      return aSortResult < bSortResult ? -1 : 1;
    });
  }
})();
