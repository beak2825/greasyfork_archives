// ==UserScript==
// @name         【B站】稍后再看——筛选已观看视频
// @match         https://www.bilibili.com/watchlater/*
// @grant         none
// @version       1.0
// @license       MIT
// @namespace     LianTianYou
// @author        LianTianYou
// @description   2024/1/22 20:30:44
// @downloadURL https://update.greasyfork.org/scripts/486638/%E3%80%90B%E7%AB%99%E3%80%91%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E2%80%94%E2%80%94%E7%AD%9B%E9%80%89%E5%B7%B2%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/486638/%E3%80%90B%E7%AB%99%E3%80%91%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E2%80%94%E2%80%94%E7%AD%9B%E9%80%89%E5%B7%B2%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(() => {
    /**
     * 筛选或还原已看视频
     */
    function filterLooked() {
        const videoList = document.querySelectorAll(".list-box .av-item");
        videoList.forEach((item) => {
            if (!item.querySelector(".looked")) {
                if (item.style.display !== "none") {
                    item.style.display = "none";
                } else {
                    item.style.display = "block";
                }
            }
        });
    }

    /**
     * 入口函数
     */
    function main() {
        let isFilter = false;
        const filterBtn = document.createElement("a");

        filterBtn.className = "s-btn";
        filterBtn.textContent = "筛选已观看";
        filterBtn.addEventListener("click", () => {
            isFilter = !isFilter;
            filterBtn.textContent = isFilter ? "还原未观看" : "筛选已观看";
            filterLooked();
        });

        document.querySelector(".r-con").append(filterBtn);
    }

    main();
})();
