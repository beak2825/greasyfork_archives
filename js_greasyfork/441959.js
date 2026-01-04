// ==UserScript==
// @name         osu beatmap filter
// @name:zh-TW   osu 圖譜過濾器
// @namespace    https://greasyfork.org/zh-TW/users/891293
// @version      1.1.1
// @description  Filter beatmap by favorites (osu! website only)
// @description:zh-TW 依照收藏數過濾 beatmap (僅限 osu! 網站)
// @author       Archer_Wn
// @match        https://osu.ppy.sh/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441959/osu%20beatmap%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/441959/osu%20beatmap%20filter.meta.js
// ==/UserScript==

// Options (選項)
const options = {
  // global options (全域選項)
  global: {
    // enable animation (啟用動畫)
    animation: {
      // enable (啟用)
      enable: true,
      // duration [ms] (持續時間 [毫秒])
      duration: 700,
    },
    // filter method [threshold, percentile] (過濾方法 [門檻, 百分位數])
    filterMethod: "percentile",
    // compare method [less, lessEqual, greater, greaterEqual] (比較方法 [小於, 小於等於, 大於, 大於等於])
    compareMethod: "lessEqual",
    // opacity of filtered beatmap [0~1] (過濾後的 beatmap 透明度 [0~1])
    opacity: 0.15,
  },
  // favorites filter (收藏數過濾)
  favorites: {
    // threshold of favorite count (收藏數門檻)
    threshold: 100,
    // percentile of favorite count (收藏數百分位數)
    percentile: 75,
  },
};

class BeatmapFilter {
  constructor() {
    this.beatmapItems = [];
  }

  addBeatmapItem(beatmapItem) {
    const beatmapInfo = this._parseBeatmapItem(beatmapItem);
    this.beatmapItems.push({ beatmapItem, beatmapInfo });

    this._filter();
  }

  removeBeatmapItem(beatmapItem) {
    const index = this.beatmapItems.findIndex(
      (item) => item.beatmapItem === beatmapItem
    );
    if (index === -1) return;

    this.beatmapItems.splice(index, 1);

    this._filter();
  }

  _filter() {
    if (options.global.animation.enable) {
      for (const { beatmapItem } of this.beatmapItems) {
        beatmapItem.style.transition = `opacity ${options.global.animation.duration}ms`;
      }
    }

    switch (options.global.filterMethod) {
      case "threshold":
        this._filterByThreshold();
        break;
      case "percentile":
        this._filterByPercentile();
        break;
    }
  }

  _filterByThreshold() {
    for (const { beatmapItem, beatmapInfo } of this.beatmapItems) {
      switch (options.global.compareMethod) {
        case "less":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount < options.favorites.threshold
              ? options.global.opacity
              : 1;
          break;
        case "lessEqual":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount <= options.favorites.threshold
              ? options.global.opacity
              : 1;
          break;
        case "greater":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount > options.favorites.threshold
              ? options.global.opacity
              : 1;
          break;
        case "greaterEqual":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount >= options.favorites.threshold
              ? options.global.opacity
              : 1;
          break;
      }
    }
  }

  _filterByPercentile() {
    const favoriteCounts = this.beatmapItems
      .map((item) => item.beatmapInfo.favoriteCount)
      .sort((a, b) => a - b);

    const threshold =
      favoriteCounts[
        Math.floor(
          (options.favorites.percentile / 100) * (favoriteCounts.length - 1)
        )
      ];

    for (const { beatmapItem, beatmapInfo } of this.beatmapItems) {
      switch (options.global.compareMethod) {
        case "less":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount < threshold ? options.global.opacity : 1;
          break;
        case "lessEqual":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount <= threshold ? options.global.opacity : 1;
          break;
        case "greater":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount > threshold ? options.global.opacity : 1;
          break;
        case "greaterEqual":
          beatmapItem.style.opacity =
            beatmapInfo.favoriteCount >= threshold ? options.global.opacity : 1;
          break;
      }
    }
  }

  _convertToNumber(str) {
    const unitMap = {
      K: 1000,
      M: 1000000,
      萬: 10000,
      億: 100000000,
    };

    const regex = new RegExp(`([0-9.]+)(${Object.keys(unitMap).join("|")})?`);
    const result = regex.exec(str);
    if (!result) return 0;

    const number = parseFloat(result[1]);
    const unit = result[2];
    return number * (unit ? unitMap[unit] : 1);
  }

  _parseBeatmapItem(beatmapItem) {
    const beatmapInfo = {};

    // Extract necessary information
    beatmapInfo.favoriteCount = this._convertToNumber(
      beatmapItem.querySelectorAll(
        ".beatmapset-panel__stats-item--favourite-count span"
      )[1].textContent
    );

    return beatmapInfo;
  }
}

(function () {
  "use strict";

  // define BeatmapFilter
  let beatmapFilter;

  // if beatmapList loaded, start main function
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length < 1) return;

      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) return;
        const divs = node.querySelectorAll("div");
        for (const div of divs) {
          if (div.classList.contains("beatmapsets__items")) {

            // create beatmap filter
            beatmapFilter = new BeatmapFilter();

            // start main function
            main();
            return;
          }
        }
      }
    });
  }).observe(document, {
    childList: true,
    subtree: true,
  });

  // main function
  function main() {
    // get beatmap list
    const beatmapList = document.querySelector(".beatmapsets__items");
    if (!beatmapList) {
      console.error("beatmapList not found");
      return;
    }

    // handle beatmap items that already loaded
    const beatmapItems = beatmapList.querySelectorAll(".beatmapsets__item");
    for (const beatmapItem of beatmapItems) {
      beatmapFilter.addBeatmapItem(beatmapItem);
    }

    // observe beatmap list
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList") return;

        // node added
        if (mutation.addedNodes.length >= 1) {
          for (const beatmapItem of mutation.addedNodes[0].querySelectorAll(
            ".beatmapsets__item"
          )) {
            beatmapFilter.addBeatmapItem(beatmapItem);
          }
        }

        // node removed
        if (mutation.removedNodes.length >= 1) {
          for (const beatmapItem of mutation.removedNodes[0].querySelectorAll(
            ".beatmapsets__item"
          )) {
            beatmapFilter.removeBeatmapItem(beatmapItem);
          }
        }
      });
    }).observe(beatmapList, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }
})();