// ==UserScript==
// @name         LeetCode Rating Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  LeetCode.com - 显示题目 zerotrac rating，一键跳转国服
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @match        *://leetcode.com/problems/*
// @license      The Unlicense
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/458970/LeetCode%20Rating%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/458970/LeetCode%20Rating%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function waitFor(condition, callback) {
    if (!condition()) {
      window.setTimeout(waitFor.bind(null, condition, callback), 1000);
    } else {
      callback();
    }
  }
  function isLoadFinish() {
    var tag = isCNSite() ? "nav" : "img";
    return document.querySelector(tag) != null;
  }
  function isCNSite() {
    return location.hostname === "leetcode.cn";
  }
  let url = window.location.href;
  url = url.replace("leetcode.com", "leetcode.cn");
  url = url.replace("/description", "/solution");
  let a = url.split("/");
  let titleSlug = a[4];
  waitFor(isLoadFinish, () => {
    console.log(url);
    let assistant = document.createElement("a");
    assistant.href = url;
    assistant.target = "_blank";
    assistant.innerHTML =
      '<div class="flex flex-1 select-none justify-center whitespace-nowrap rounded-t-[5px] px-4 py-[10px] text-xs cursor-pointer text-label-2 dark:text-dark-label-2 px-5">Solutions (CN) ↗</div>';
    let elements = document.querySelector(
      "#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div:nth-child(1) > div > div"
    );
    elements.appendChild(assistant);
    fetch("https://zerotrac.github.io/leetcode_problem_rating/data.json")
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].TitleSlug === titleSlug) {
            let rating = Math.round(data[i].Rating);
            let contestSlug = data[i].ContestSlug;
            let contestLink = "https://leetcode.com/contest/" + contestSlug;
            let contestID_en = data[i].ContestID_en;
            console.log(rating);
            let sel = document.querySelector(
              "#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div > div.w-full.px-5.pt-4 > div > div:nth-child(1) > div.flex-1 > div > div > span"
            );
            let zerotrac = document.createElement("a");
            zerotrac.href = contestLink;
            zerotrac.target = "_blank";
            zerotrac.innerHTML =
              '<div class="flex flex-1 select-none justify-center whitespace-nowrap rounded-t-[5px] px-4 py-[10px] text-xs cursor-pointer text-label-2 dark:text-dark-label-2 px-5">' +
              " Rating: " +
              rating +
              " ↗</div>";
            elements.appendChild(zerotrac);
          }
        }
      });
  });
})();
