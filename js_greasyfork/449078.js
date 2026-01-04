// ==UserScript==
// @name         pornhub video fix
// @description  pornhub video window fixer
// @match        https://jp.pornhub.com/view_video.php?viewkey=*
// @run-at       document-idle
// @version      2024-11-27T0:53
// @namespace https://greasyfork.org/users/943793
// @downloadURL https://update.greasyfork.org/scripts/449078/pornhub%20video%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/449078/pornhub%20video%20fix.meta.js
// ==/UserScript==

// jshint esversion: 6

(function () {
  "use strict";

  const clearStyle = (e) => (e ? (e.style = "") : undefined);
  const displayNone = (e) => (e ? (e.style.display = "none") : undefined);
  const maxHeightNone = (e) => (e ? (e.style.maxHeight = "none") : undefined);
  const maxWSNM = (e) => (e ? (e.style.whiteSpace = "normal") : undefined);

  const d = document;
  const dqs = (q) => d.querySelector(q);

  /* コンテナの修正 */
  const container = dqs("div.container");
  container.style.minWidth = "100%";
  dqs("#vpContentContainer").style.display = "block";

  /* ヘッダーの修正 */
  const headw = dqs("#headerWrapper");
  headw.style.minWidth = "90vw";
  const headc = dqs("#headerContainer");
  headc.style.minWidth = "90vw";
  headc.style.maxWidth = "90vw";
  displayNone(dqs("#headerContainer > span"));
  displayNone(dqs("#headerMenuContainer"));
  displayNone(dqs("#js-abContainterMain"));

  /* 不要コンテンツの削除 & 修正 */
  displayNone(dqs("body > div.footerContentWrapper"));
  displayNone(dqs("body > div.wrapper").nextElementSibling);
  displayNone(dqs("#recommendedVideosVPage > a"));

  /* コンテンツの移動 */
  const lcol = d.getElementById("hd-leftColVideoPage");
  const recomend = dqs("#recommendedVideosVPage");
  const comments = d.getElementById("under-player-comments");
  lcol.insertBefore(recomend, lcol.lastElementChild);
  lcol.style.width = "-webkit-fill-available";
  lcol.appendChild(comments);
  comments.style.position = "revert";
  dqs("#recommendedVideos").style.float = "none";

  /* 広告の削除 */
  displayNone(lcol.nextElementSibling);
  displayNone(dqs("#player")?.nextElementSibling?.nextElementSibling);

  /* 動画の表示調整 */
  const vwrap = document.querySelector("#player");
  const video = vwrap.querySelector("video");
  vwrap.style.width = "100%";
  vwrap.style.height = "100vh";
  vwrap.style.position = "relative";
  vwrap.style.padding = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.top = "50%";
  video.style.left = "50%";
  video.style.transform = "translateX(-50%) translateY(-50%)";
  video.style.minWidth = "100%";
  video.style.minHeight = "100%";
  video.style.padding = "0";

  /* 動画の下の表示の調整 */
  const rec = dqs("#recommendedVideos");
  const recqsa = (q) => rec.querySelectorAll(q);
  const vpl = dqs("#videoPlayList");
  if (vpl != null) rec.classList = vpl.classList;
  rec.classList.add("allRecommendedVideos");
  rec.style.overflowX = "auto";
  rec.style.whiteSpace = "nowrap";
  Array.from(recqsa("div.wrap"), clearStyle);
  Array.from(recqsa("div.phimage"), clearStyle);
  Array.from(recqsa("span.title"), (e) => {
    maxHeightNone(e);
    maxWSNM(e);
  });
  Array.from(recqsa(".thumbnail-info-wrapper.clearfix"), clearStyle);
  window.setTimeout(() => {
    const vwrap = document.querySelector("#player");
    const video = vwrap.querySelector("video");
    vwrap.style.width = "100%";
    vwrap.style.height = "100vh";
    vwrap.style.position = "relative";
    vwrap.style.padding = "0";
    video.style.width = "100vw";
    video.style.height = "100vh";
    video.style.top = "50%";
    video.style.left = "50%";
    video.style.transform = "translateX(-50%) translateY(-50%)";
    video.style.minWidth = "100%";
    video.style.minHeight = "100%";
    video.style.padding = "0";
    vwrap.scrollIntoView();
  }, 500);
})();
