// ==UserScript==
// @description         adapt the position of content of web page to fit the screen consisting of two monitors
// @match               *://*/*
// @name                fit the screen consisting of two monitors
// @namespace           https://github.com/Freed-Wu
// @author              Wu Zhenyu
// @version             0.0.1
// @copyright           2023, Wu Zhenyu
// @license             GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL         https://github.com/Freed-Wu/fit-the-screen-consisting-of-two-monitors
// @supportURL          https://github.com/Freed-Wu/fit-the-screen-consisting-of-two-monitors/issues
// @contributionURL     https://github.com/Freed-Wu/fit-the-screen-consisting-of-two-monitors
// @downloadURL https://update.greasyfork.org/scripts/475398/fit%20the%20screen%20consisting%20of%20two%20monitors.user.js
// @updateURL https://update.greasyfork.org/scripts/475398/fit%20the%20screen%20consisting%20of%20two%20monitors.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let elements = [];
  function get_elements(elem) {
    // skip empty elements
    if ((elem.offsetWidth || elem.offsetHeight) === 0) return;
    // skip fullscreen elements, search their children
    if (elem.offsetLeft === 0 && elem.offsetWidth === window.innerWidth) {
      for (const child of elem.children) get_elements(child);
      return;
    }
    // get elements spanning center line
    if (
      elem.offsetLeft < window.innerWidth / 2 &&
      elem.offsetLeft + elem.offsetWidth > window.innerWidth / 2 &&
      elem.offsetLeft + elem.offsetWidth < window.innerWidth
    )
      elements.push(elem);
  }
  get_elements(document.getElementsByTagName("body")[0]);

  switch (window.location.host) {
    // specially handle
    case "poe.com":
      elements[0].children[0].children[1].children[0].style.marginLeft =
        "-40rem";
      break;
    default:
      for (const elem of elements) elem.style.marginLeft = "5rem";
  }
})();

// some test websites:
// https://www.zhihu.com/column/frozengene
// https://www.baidu.com/
// https://greasyfork.org/zh-CN/scripts/419081-%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
// https://nodejs.org/api/fs.html
// https://poe.com/
