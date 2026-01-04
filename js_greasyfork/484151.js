// ==UserScript==
// @name         Bilibili合集总时长计算
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  计算Bilibili视频合集的总时长
// @author       Xzonn
// @match        https://www.bilibili.com/video/BV*/
// @match        https://www.bilibili.com/video/av*/
// @icon         https://bilibili.com/favicon.ico
// @grant        none
// @license      cc by-nc-sa 4.0
// @downloadURL https://update.greasyfork.org/scripts/484151/Bilibili%E5%90%88%E9%9B%86%E6%80%BB%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/484151/Bilibili%E5%90%88%E9%9B%86%E6%80%BB%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

function calc_duration() {
  let durations = Array.from(
    document
      .querySelector(".video-section-list")
      .querySelectorAll(".video-episode-card__info-duration")
  ).map((x) => x.innerHTML.trim());
  if (!durations.length) return;
  let total_seconds = 0;
  durations.forEach((x) => {
    let match = x.match(/^(?:(\d+):)?(\d+):(\d+)$/);
    if (match) {
      let hours = +(match[1] || "0");
      let minutes = +match[2];
      let seconds = +match[3];
      total_seconds += hours * 3600 + minutes * 60 + seconds;
    }
  });
  let hours = Math.floor(total_seconds / 3600);
  let minutes = Math.floor((total_seconds % 3600) / 60);
  let seconds = total_seconds % 60;
  let time_element = document.createElement("span");
  time_element.innerHTML = `<svg width="14" height="14" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.74286C5.02955 1.74286 1 5.7724 1 10.7429C1 15.7133 5.02955 19.7429 10 19.7429C14.9705 19.7429 19 15.7133 19 10.7429C19 5.7724 14.9705 1.74286 10 1.74286ZM10.0006 3.379C14.0612 3.379 17.3642 6.68282 17.3642 10.7426C17.3642 14.8033 14.0612 18.1063 10.0006 18.1063C5.93996 18.1063 2.63696 14.8033 2.63696 10.7426C2.63696 6.68282 5.93996 3.379 10.0006 3.379Z" fill="currentColor"></path><path d="M9.99985 6.6521V10.743" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path><path d="M12.4545 10.7427H10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path></svg><span>${hours}:${(
    "" + minutes
  ).padStart(2, "0")}:${("" + seconds).padStart(2, "0")}</span>`;
  time_element.title = "总时长";
  time_element.style = `margin-left: 3px; display: flex; align-items: center; gap: 3px;`;
  time_element.className = "video-section-total-time";
  document
    .querySelectorAll(".video-section-total-time")
    .forEach((x) => x.remove());
  document.querySelector(".second-line_left").appendChild(time_element);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    calc_duration();
    let observerOptions = {
      childList: true,
      attributes: true,
      subtree: true,
    };
    let observer = new MutationObserver(calc_duration);
    observer.observe(
      document.querySelector(".video-sections-head_second-line"),
      observerOptions
    );
  }, 2000);
});
