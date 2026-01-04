// ==UserScript==
// @name         语雀评论目录导航
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       logeast
// @match        https://www.yuque.com/logeast/dots/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406628/%E8%AF%AD%E9%9B%80%E8%AF%84%E8%AE%BA%E7%9B%AE%E5%BD%95%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/406628/%E8%AF%AD%E9%9B%80%E8%AF%84%E8%AE%BA%E7%9B%AE%E5%BD%95%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  window.onload = () => {
    const header = document.querySelector(".header");
    header.setAttribute("style", "position: fixed; top: 0;");
    header.parentNode.setAttribute("style", "height: 60px");

    const getTargetName = () => {
      let _h4List = [];
      const parent = document.querySelector(".ant-list-items");
      const floors =
        parent && parent.querySelectorAll(".comment-list-item-inner");
      Array.from(floors).map((item, index) => {
        _h4List.push(item.querySelector("h4").innerText);
      });
      return _h4List;
    };

    const renderSidebarDom = () => {
      const ul = document.createElement("ul");
      ul.setAttribute(
        "class",
        "ant-menu aside-container menu-site ant-menu-light ant-menu-root ant-menu-inline"
      );
      ul.setAttribute(
        "style",
        "padding-top: 80px;height: 100%; overflow-y: auto"
      );

      const fragment = document.createDocumentFragment();
      getTargetName().forEach((item, index) => {
        const li = document.createElement("li");
        li.setAttribute("class", `ant-menu-item ant-menu-item-only-child`);
        li.setAttribute("style", "padding-left: 24px;");
        li.innerHTML = `<a href="#floor-${
          index + 1
        }" title="${item}" style="overflow: hidden;text-overflow: ellipsis;">${item}</a>`;
        fragment.appendChild(li);
      });
      ul.appendChild(fragment);

      const container = document.createElement("div");
      container.setAttribute(
        "style",
        "overflow: hidden; position: fixed; top: 0; left: 0; width: 240px; height: 100%; max-height: 100vh; z-index: 998;"
      );
      container.appendChild(ul);

      document.body.appendChild(container);
    };

    renderSidebarDom();
  };
})();
