// ==UserScript==
// @name         江苏天地图多时相
// @namespace    JSTDTMulitdate
// @version      0.1
// @description  给江苏天地图多时相增加一点功能，方便截图
// @author       liuxsdev
// @match        http://jiangsu.tianditu.gov.cn/map/mapjs/mulitdate/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianditu.gov.cn
// @run-at       document-end
// @homepage     https://gist.github.com/liuxsdev/5d2eeb6b4520417175e6fd7b8117ec57
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/457612/%E6%B1%9F%E8%8B%8F%E5%A4%A9%E5%9C%B0%E5%9B%BE%E5%A4%9A%E6%97%B6%E7%9B%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/457612/%E6%B1%9F%E8%8B%8F%E5%A4%A9%E5%9C%B0%E5%9B%BE%E5%A4%9A%E6%97%B6%E7%9B%B8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // add button
  const nav = document.querySelector("#pageheadnav");
  nav.style.width = "900px";
  const a_set = document.createElement("a");
  a_set.innerHTML = "设置单列地图";
  a_set.style.marginLeft = "12px";
  a_set.fontWeight = "800";
  a_set.onclick = setOneMap;
  const a_reset = document.createElement("a");
  a_reset.innerHTML = "恢复双列";
  a_reset.style.marginLeft = "12px";
  a_reset.fontWeight = "800";
  a_reset.onclick = reset;

  const a_toogleUI = document.createElement("a");
  a_toogleUI.innerHTML = "隐藏UI";
  a_toogleUI.style.marginLeft = "12px";
  a_toogleUI.fontWeight = "800";
  a_toogleUI.onclick = hiddenUI;

  const a_showUI = document.createElement("a");
  a_showUI.innerHTML = "显示UI";
  a_showUI.style.marginLeft = "12px";
  a_showUI.fontWeight = "800";
  a_showUI.onclick = showUI;

  nav.appendChild(a_set);
  nav.appendChild(a_reset);
  nav.appendChild(a_toogleUI);
  nav.appendChild(a_showUI);
  // get Map
  const leftmap = document.querySelector("div.left-map");
  const rightmap = document.querySelector("div.right-map");

  function setOneMap() {
    leftmap.style.float = "none";
    leftmap.style.width = "99%";
    rightmap.style.display = "none";
  }
  function reset() {
    leftmap.style.float = "left";
    leftmap.style.width = "50%";
    rightmap.style.display = "block";
  }
  function hiddenUI() {
    const widget_zoom = document.querySelectorAll("div.esriSimpleSlider");
    const point = document.querySelectorAll(".Point");
    widget_zoom.forEach((dom) => {
      dom.style.display = "none";
    });
    point.forEach((dom) => {
      dom.style.display = "none";
    });
  }
  function showUI() {
    const widget_zoom = document.querySelectorAll("div.esriSimpleSlider");
    const point = document.querySelectorAll(".Point");
    widget_zoom.forEach((dom) => {
      dom.style.display = "block";
    });
    point.forEach((dom) => {
      dom.style.display = "block";
    });
  }
})();
