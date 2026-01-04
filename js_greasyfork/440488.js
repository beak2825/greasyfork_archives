// ==UserScript==
// @name         atcoder-hashtag-setter2
// @namespace    https://github.com/hotarupoyo
// @version      3.0.0
// @author       hotarupoyo
// @description  AtCoder の共有ボタンの埋め込みテキストにハッシュタグを追加して、コンテスト名または問題名を補完して、ハッシュタグを X で検索するボタンを追加します。
// @license      MIT
// @match        https://atcoder.jp/contests/*
// @exclude      https://atcoder.jp/contests/
// @downloadURL https://update.greasyfork.org/scripts/440488/atcoder-hashtag-setter2.user.js
// @updateURL https://update.greasyfork.org/scripts/440488/atcoder-hashtag-setter2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _a;
  const contestId = location.pathname.split("/")[2];
  const contestTitle = (_a = document.querySelector(".contest-title")) == null ? void 0 : _a.innerText;
  const problemId = (() => {
    if (location.pathname.match(/contests\/.+\/tasks\/.+/) != null) {
      return location.pathname.match(/contests\/.+\/tasks\/.+/) != null ? location.pathname.split("/")[4] : void 0;
    }
    if (location.pathname.match(/contests\/.+\/submissions\/\d+/) != null) {
      const trs = Array.from(document.querySelectorAll("tr"));
      const tr = trs.find(
        (element) => ["問題", "Tasks"].includes(element.firstElementChild.innerText ?? "")
      );
      if (tr == null) {
        return void 0;
      }
      return tr.lastElementChild.firstElementChild.pathname.split(
        "/"
      )[4];
    }
    return void 0;
  })();
  const problemTitle = (() => {
    var _a2;
    if (location.pathname.match(/contests\/.+\/tasks\/.+/) != null) {
      return ((_a2 = document.querySelector("meta[property='og:title']")) == null ? void 0 : _a2.getAttribute("content")) ?? void 0;
    }
    if (location.pathname.match(/contests\/.+\/submissions\/\d+/) != null) {
      const trs = Array.from(document.querySelectorAll("tr"));
      const tr = trs.find(
        (element) => ["問題", "Tasks"].includes(element.firstElementChild.innerText ?? "")
      );
      if (tr == null) {
        return void 0;
      }
      return tr.lastElementChild.innerText.trim();
    }
    return void 0;
  })();
  (() => {
    const aElements = document.querySelectorAll("ul > li > ul > li > a");
    for (let i = 0; i < aElements.length; i++) {
      const element = aElements[i];
      if (element != null && ["マイプロフィール", "My Profile"].includes(element.innerText.trim())) {
        return element.pathname.split("/")[2];
      }
    }
    return void 0;
  })();
  const userIdSubmittedBy = (() => {
    if (location.pathname.match(/contests\/.+\/submissions\/\d+/) != null) {
      const trs = Array.from(document.querySelectorAll("tr"));
      const tr = trs.find(
        (element) => ["ユーザ", "User"].includes(element.firstElementChild.innerText ?? "")
      );
      if (tr == null) {
        return void 0;
      }
      return tr.lastElementChild.innerText.trim();
    }
    return void 0;
  })();
  const ConvertIso8601BasicToExtended = (iso8601basic) => {
    const d = iso8601basic;
    return `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 11)}:${d.substring(11, 13)}`;
  };
  const contestDuration = document.querySelectorAll(".contest-duration > a");
  const contestStartTime = new Date(
    ConvertIso8601BasicToExtended(new URLSearchParams(contestDuration.item(0).search).get("iso") ?? "0")
  );
  const contestEndTime = new Date(
    ConvertIso8601BasicToExtended(new URLSearchParams(contestDuration.item(1).search).get("iso") ?? "0")
  );
  const hasContestEnded = /* @__PURE__ */ new Date() >= contestEndTime;
  const IsContestPermanent = contestEndTime.getTime() - contestStartTime.getTime() >= 365 * 24 * 60 * 60 * 1e3;
  (() => {
    var _a2, _b, _c, _d, _e;
    if (!(hasContestEnded || IsContestPermanent)) {
      return;
    }
    const contestHashtag = contestId ? `#AtCoder_${contestId}` : void 0;
    const problemHashtag = problemId ? `#AtCoder_${problemId}` : void 0;
    const userHashtag = userIdSubmittedBy ? `#AtCoder_${userIdSubmittedBy}` : void 0;
    const orgtext = (_a2 = document.querySelector("div.a2a_kit")) == null ? void 0 : _a2.getAttribute("data-a2a-title");
    if (orgtext == null) {
      console.warn("AtCoder HashTag Setter2", "共有ボタンの取得に失敗しました。");
      return;
    }
    const text = (() => {
      if (location.pathname.match(/contests\/.+\/tasks\/.+/) != null) {
        return `${orgtext} - ${contestTitle} ${contestHashtag} ${problemHashtag}`;
      }
      if (location.pathname.match(/contests\/.+\/submissions\/\d+/) != null) {
        return `${orgtext} - ${problemTitle} ${contestHashtag} ${problemHashtag} ${userHashtag}`;
      }
      return `${orgtext} ${contestHashtag}`;
    })();
    (_b = document.querySelector("div.a2a_kit")) == null ? void 0 : _b.setAttribute("data-a2a-title", text);
    if (userHashtag != null) {
      const searchUserUrl = `https://twitter.com/search?q=${encodeURIComponent(userHashtag)}`;
      const searchUserHtml = `<a class="btn btn-danger btn-xs" href="${searchUserUrl}" role="button">${userHashtag}</a>`;
      (_c = document.querySelector("div.a2a_kit")) == null ? void 0 : _c.insertAdjacentHTML("afterbegin", searchUserHtml);
    }
    if (problemHashtag != null) {
      const searchProblemUrl = `https://twitter.com/search?q=${encodeURIComponent(problemHashtag)}`;
      const searchProblemHtml = `<a class="btn btn-primary btn-xs" href="${searchProblemUrl}" role="button">${problemHashtag}</a>`;
      (_d = document.querySelector("div.a2a_kit")) == null ? void 0 : _d.insertAdjacentHTML("afterbegin", searchProblemHtml);
    }
    if (contestHashtag != null) {
      const searchContestUrl = `https://twitter.com/search?q=${encodeURIComponent(contestHashtag)}`;
      const searchContestHtml = `<a class="btn btn-success btn-xs" href="${searchContestUrl}" role="button">${contestHashtag}</a>`;
      (_e = document.querySelector("div.a2a_kit")) == null ? void 0 : _e.insertAdjacentHTML("afterbegin", searchContestHtml);
    }
  })();

})();