// ==UserScript==
// @name         javdb优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  javdb优化方便跳转不同网站
// @author       gl
// @match        https://javdb.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/486124/javdb%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/486124/javdb%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const javlibrary = "https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=";
  const wuq = "https://wuqianyu.top/search?keyword=";
  const jable = "https://jable.tv/search/";
  const missav = "https://missav.com/cn/search/";
  const websites = [
    {
      name: "javlibrary",
      link: javlibrary,
      class: "is-link",
    },
    {
      name: "吴签",
      link: wuq,
      class: "is-info",
    },

    {
      name: "jable",
      link: jable,
      class: "is-success",
    },
    {
      name: "missav",
      link: missav,
      class: "is-danger",
    },
  ];

  let css = `
    .jav-container{
      max-width: 100% !important;
    }
    .jav-small{
      font-size: .7rem !important;
      color: #fff !important;
    }
  `;
  // workaround for various GreaseMonkey engines
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }
  // 100% 宽度
  const container = document.querySelector(".section .container");
  container.classList.add("jav-container");

  const movieListItem = document.querySelectorAll("div.movie-list div.item a");
  const movieInfo = document.querySelector(".movie-panel-info");
  if (movieListItem.length) {
    movieListItem.forEach((el) => {
      el.setAttribute("target", "_blank");
      const title = el.querySelector("div.video-title strong").textContent;
      let newAddons = document.createElement("div");
      newAddons.setAttribute("class", "tags has-addons jav-btn");

      websites.forEach((item) => {
        let href = document.createElement("a");
        href.textContent = item.name;
        href.setAttribute("class", `tag ${item.class} jav-small`);
        // href.setAttribute('class', 'is-links')
        href.setAttribute("target", "_blank");
        href.setAttribute("href", item.link + title + "/");
        newAddons.append(href);
      });

      el.append(newAddons);
    });
  } else if (movieInfo) {
    const title = movieInfo.querySelector(".copy-to-clipboard").getAttribute('data-clipboard-text');
    const panelList = movieInfo.querySelectorAll(".panel-block");
    let panelLast = panelList[panelList.length - 1];

    websites.forEach((item) => {
      let href = document.createElement("a");
      href.textContent = item.name;
      href.setAttribute("class", `tag ${item.class} jav-small`);
      // href.setAttribute('class', 'is-links')
      href.setAttribute("target", "_blank");
      href.setAttribute("href", item.link + title + "/");

      panelLast.append(href)
    });
  } else {
    return;
  }

  ///////////////////////////////////////////////////////////

  // Your code here...
})();
