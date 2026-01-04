// ==UserScript==
// @name         QCoder AC Problem
// @namespace    https://ruku.tellpro.net
// @version      2024-11-04
// @description  QCoderの問題でACのものに色がつきます
// @author       ruku
// @match        https://www.qcoder.jp/*
// @icon         https://www.qcoder.jp/_next/static/media/20231120_logo.5742ea86.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537422/QCoder%20AC%20Problem.user.js
// @updateURL https://update.greasyfork.org/scripts/537422/QCoder%20AC%20Problem.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let prevURL = "";
  let data = new Map();
  setInterval(() => {
    const url = location.href;
    if (!/https:\/\/www\.qcoder\.jp\/ja\/contests\/(.+)/.test(url)) {
      return;
    }
    if (url !== prevURL) {
      prevURL = url;
      const match = url.match(/https:\/\/www\.qcoder\.jp\/ja\/contests\/(.+)/)[1];
      const apiURL = `https://www.qcoder.jp/api/contests/${match.split("/")[0]}/submissions/me`;
      fetch(apiURL)
        .then((e) => {
          return e.json();
        })
        .then((e) => {
          data = new Map();
          e.reverse();
          for (const dat of e) {
            if (data[dat.problemLabel] !== "AC") {
              data[dat.problemLabel] = dat.submissionStatusCode;
            }
          }
        });
    }
    const ATags = document.getElementsByTagName("A");
    const menuItems = Array.from(ATags).filter((a) => a.getAttribute("role") === "menuitem");
    for (const item of menuItems) {
      const AURL = item.href.split("/");
      if (data[AURL[AURL.length - 1]] === "AC") {
        item.style = "background-color: rgb(212, 237, 201);";
      } else if (data[AURL[AURL.length - 1]] !== undefined) {
        item.style = "background-color: rgb(255, 227, 227);";
      }
    }
  }, 1000);
})();
