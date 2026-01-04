// ==UserScript==
// @name         Github添加CND功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Github Code文件列表添加jsDelivr、Statically CND链接，便于CDN引用
// @author       ssyatelandisi
// @match        *://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423943/Github%E6%B7%BB%E5%8A%A0CND%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/423943/Github%E6%B7%BB%E5%8A%A0CND%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  const br = document.createElement("br");
  const TMP_els = document.querySelectorAll(
    "#repo-content-pjax-container > div > div.gutter-condensed.gutter-lg.flex-column.flex-md-row.d-flex > div.flex-shrink-0.col-12.col-md-9.mb-4.mb-md-0 > div.Box.mb-3 > div.js-details-container.Details > div.Details-content--hidden-not-important.js-navigation-container.js-active-navigation-container.d-md-block > div > div.flex-auto.min-width-0.col-md-2.mr-3"
  );
  for (let el of TMP_els) {
    let github_url = el
      .getElementsByTagName("span")[0]
      .getElementsByTagName("a")[0]
      .getAttribute("href");
    const reg =
      "^(https://github.com|http://github.com)?/(.+?)/(.+?)/blob/(.+?)/(.*)$";
    let r = github_url.match(reg);
    if (r) {
      let jsdelivr_cdn_url = `https://cdn.jsdelivr.net/gh/${r[2]}/${r[3]}@${r[4]}/${r[5]}`;
      let a = document.createElement("a");
      a.innerHTML = `🚩jsDelivr CDN`;
      a.setAttribute("href", jsdelivr_cdn_url);
      a.setAttribute("target", "_blank");
      a.setAttribute("style", "color:#ff5627;background-color:#eee;");
      el.appendChild(br);
      el.appendChild(a);
    }
    if (r) {
      let statically_cdn_url = `https://cdn.statically.io/gh/${r[2]}/${r[3]}/${r[4]}/${r[5]}`;
      let a = document.createElement("a");
      a.innerHTML = `🚩Statically CDN`;
      a.setAttribute("href", statically_cdn_url);
      a.setAttribute("target", "_blank");
      a.setAttribute("style", "color:#ff5627;background-color:#eee;");
      el.appendChild(br);
      el.appendChild(a);
    }
  }
})();
