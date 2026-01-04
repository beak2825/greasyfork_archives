// ==UserScript==
// @name 任意网站去黑白
// @namespace http://tampermonkey.net/
// @version 8.5
// @description 去除任意网站的黑白样式
// @author share121
// @match *://*/*
// @match *
// @license MIT
// @grant none
// @homepageURL https://greasyfork.org/zh-CN/scripts/455866
// @supportURL https://greasyfork.org/zh-CN/scripts/455866/feedback
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/455866/%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E5%8E%BB%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455866/%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E5%8E%BB%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

setInterval(function () {
  document.querySelectorAll("*").forEach(function (e) {
    var s = getComputedStyle(e);
    var f = s.filter,
      w = s.webkitFilter;
    /grayscale\(.*?\)/g.test(f) &&
      e.style.setProperty(
        "filter",
        f.replace(/grayscale\(.*?\)/g, "grayscale(0)"),
        "important"
      );
    /grayscale\(.*?\)/g.test(w) &&
      e.style.setProperty(
        "-webkit-filter",
        w.replace(/grayscale\(.*?\)/g, "grayscale(0)"),
        "important"
      );
    /grayscale=(\+|\-)?(\d+\.\d+|\.\d+|\d+\.|\d+)/g.test(f) &&
      e.style.setProperty(
        "filter",
        f.replace(
          /grayscale=(\+|\-)?(\d+\.\d+|\.\d+|\d+\.|\d+)/g,
          "grayscale=0"
        ),
        "important"
      );
  });
}, 0);