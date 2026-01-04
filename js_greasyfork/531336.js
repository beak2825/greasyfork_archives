// ==UserScript==
// @name         rabbit-and-steel-highlight-jem-name
// @namespace    https://github.com/hotarunw
// @version      1.0.1
// @author       hotarunw
// @description  A userscript to highlight the name of Jem in Rabbit and Steel.
// @license      MIT
// @homepage     https://github.com/hotarunw/rabbit-and-steel-highlight-jem-name
// @homepageURL  https://github.com/hotarunw/rabbit-and-steel-highlight-jem-name
// @match        https://note.com/nonspell1/n/n2419cd914c84
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=3273533065
// @match        https://wikiwiki.jp/rabbit-a-s/*
// @match        https://rns.miraheze.org/wiki/*
// @exclude      https://wikiwiki.jp/rabbit-a-s/::cmd/*
// @downloadURL https://update.greasyfork.org/scripts/531336/rabbit-and-steel-highlight-jem-name.user.js
// @updateURL https://update.greasyfork.org/scripts/531336/rabbit-and-steel-highlight-jem-name.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const keywords = {
    オパール: "#7f5ff2",
    サファイア: "#64b7f8",
    ルビー: "#ff3c5a",
    ガーネット: "#fde6b6",
    エメラルド: "#39feae",
    Opal: "#7f5ff2",
    Sapphire: "#64b7f8",
    Ruby: "#ff3c5a",
    Garnet: "#fde6b6",
    Emerald: "#39feae"
  };
  const highlight = () => {
    var _a, _b, _c;
    const elements = [
      ...document.getElementsByTagName("p"),
      ...document.getElementsByTagName("span"),
      ...document.getElementsByTagName("div"),
      ...document.getElementsByTagName("td"),
      ...document.getElementsByTagName("li"),
      ...document.getElementsByTagName("a")
    ];
    for (const element of elements) {
      if (((_a = element.innerHTML) == null ? void 0 : _a.includes("#Emerald_Lakeside")) || ((_b = element.innerHTML) == null ? void 0 : _b.includes("Emerald_Lakeside.png"))) {
        continue;
      }
      if ([...element.children].some(
        (child) => !["br", "div"].includes(child.tagName.toLowerCase())
      )) {
        continue;
      }
      for (const [keyword, color] of Object.entries(keywords)) {
        if (((_c = element.textContent) == null ? void 0 : _c.toLowerCase().includes(keyword.toLowerCase())) && !element.style.backgroundColor) {
          element.innerHTML = element.innerHTML.replace(
            new RegExp(keyword, "gi"),
            `<span style="font-weight: bold; background-color: ${color}; color: black;">${keyword}</span>`
          );
        }
      }
    }
  };
  (async () => {
    console.log("Hello, world!");
    for (let i = 0; i < 1; i++) {
      highlight();
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
  })();

})();