// ==UserScript==
// @name         JavBus 添加跳转在线观看
// @namespace    https://greasyfork.org/users/58790
// @version      0.30.4
// @author       mission522
// @description  在影片详情页添加跳转到在线观看网站的按钮，并检查对应是否存在资源，如果对应网站上存在该资源则为绿色，否则显示红色，顺便检测有无中文字幕。
// @license      MIT
// @icon         https://www.javbus.com/favicon.ico
// @include      /^https:\/\/(\w*\.)?JavBus(\d)*\.com.*$/
// @match        *://*.javbus.com/*
// @connect      jable.tv
// @connect      missav.com
// @connect      javhhh.com
// @connect      netflav.com
// @connect      avgle.com
// @connect      bestjavporn.com
// @connect      jav.guru
// @connect      javmost.cx
// @connect      hpjav.tv
// @connect      av01.tv
// @connect      javbus.com
// @connect      javmenu.com
// @connect      javfc2.net
// @connect      paipancon.com
// @connect      ggjav.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/446704/JavBus%20%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446704/JavBus%20%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
  var _a, _b, _c, _d;
  "use strict";
  var r = (_a = Reflect.get(document, "__monkeyWindow")) != null ? _a : window;
  r.GM;
  r.unsafeWindow = (_b = r.unsafeWindow) != null ? _b : window;
  r.unsafeWindow;
  r.GM_info;
  r.GM_cookie;
  var l = (...e) => r.GM_addStyle(...e), b = (...e) => r.GM_xmlhttpRequest(...e);
  const jbusStyle = `
  .panel-block{
    word-break: break-all;
    line-height: 30px;
    font-size: 14px;
  }
  // .panel-block::before{
  //   line-height: 40px;
  //   content:"\u8D44\u6E90\uFF1A";
  //   font-weight: bold;
  // }
  .has-subtitle::before {
    content: "\u5B57\u5E55 | ";
    font-size:12px;
  }
  .has-leakage::after {
    content: " | \u65E0\u7801";
    font-size:12px;
  }
  .label {
    position: relative !important;
    font-size: 100%;
    color: white !important;
  }
  
`;
  const temp = () => {
  };
  const siteList = [
    {
      name: "Jable",
      hostname: "jable.tv",
      url: "https://jable.tv/videos/{{code}}/",
      fetcher: "get",
      domQuery: { subQuery: ".header-right>h6" },
      method: temp
    },
    {
      name: "MISSAV",
      hostname: "missav.com",
      url: "https://missav.com/{{code}}/",
      fetcher: "get",
      domQuery: {
        subQuery: '.space-y-2 a.text-nord13[href="https://missav.com/chinese-subtitle"]',
        leakQuery: ".order-first div.rounded-md a[href]:last-child"
      },
      method: temp
    },
    {
      name: "NETFLAV",
      hostname: "netflav.com",
      url: "https://netflav.com/search?type=title&keyword={{code}}",
      fetcher: "parser",
      domQuery: { linkQuery: ".grid_cell>a", titleQuery: ".grid_cell>a>.grid_title" },
      method: temp
    },
    {
      name: "Avgle",
      hostname: "avgle.com",
      url: "https://avgle.com/search/videos?search_query={{code}}&search_type=videos",
      fetcher: "parser",
      domQuery: {
        linkQuery: ".container>.row .row .well>a[href]",
        titleQuery: ".container>.row .row .well .video-title"
      },
      method: temp
    },
    {
      name: "JAVHHH",
      hostname: "javhhh.com",
      url: "https://javhhh.com/v/?wd={{code}}",
      fetcher: "parser",
      domQuery: {
        linkQuery: ".typelist>.i-container>a[href]",
        titleQuery: ".typelist>.i-container>a[href]"
      },
      method: temp
    },
    {
      name: "BestJavPorn",
      hostname: "bestjavporn.com",
      url: "https://www3.bestjavporn.com/search/{{code}}",
      fetcher: "parser",
      domQuery: { linkQuery: "article.thumb-block>a", titleQuery: "article.thumb-block>a" },
      method: temp
    },
    {
      name: "JAVMENU",
      hostname: "javmenu.com",
      url: "https://javmenu.com/{{code}}",
      fetcher: "get",
      domQuery: {
        videoQuery: "a.nav-link[aria-controls='pills-0']"
      },
      method: temp
    },
    {
      name: "Jav.Guru",
      hostname: "jav.guru",
      url: "https://jav.guru/?s={{code}}",
      fetcher: "parser",
      domQuery: { linkQuery: ".imgg>a[href]", titleQuery: ".inside-article>.grid1 a[title]" },
      method: temp
    },
    {
      name: "JAVMOST",
      hostname: "javmost.cx",
      url: "https://javmost.cx/search/{{code}}/",
      fetcher: "parser",
      domQuery: {
        linkQuery: "#content .card a#MyImage",
        titleQuery: "#content .card-block .card-title"
      },
      method: temp
    },
    {
      name: "JAVFC2",
      hostname: "javfc2.net",
      url: "https://javfc2.net/?s={{code}}",
      fetcher: "parser",
      domQuery: {
        linkQuery: "article.loop-video>a[href]",
        titleQuery: "article.loop-video .entry-header"
      },
      method: temp
    },
    {
      name: "baihuse",
      hostname: "paipancon.com",
      url: "https://paipancon.com/search/{{code}}",
      fetcher: "parser",
      domQuery: {
        linkQuery: "div.col>div.card>a[href]",
        titleQuery: "div.card img.card-img-top"
      },
      method: temp
    },
    {
      name: "GGJAV",
      hostname: "ggjav.com",
      url: "https://ggjav.com/main/search?string={{code}}",
      fetcher: "parser",
      domQuery: {
        listIndex: 1,
        spaceCode: true,
        titleQuery: "div.columns.large-3.medium-6.small-12.item.float-left>div.item_title>a.gray_a",
        linkQuery: "div.columns.large-3.medium-6.small-12.item.float-left>div.item_title>a.gray_a"
      },
      method: temp
    },
    {
      name: "AV01",
      hostname: "av01.tv",
      url: "https://www.av01.tv/search/videos?search_query={{code}}",
      fetcher: "parser",
      domQuery: { linkQuery: "div[id].well-sm>a", titleQuery: ".video-views>.pull-left" },
      method: temp
    },
    {
      name: "JavBus",
      disable: "jbus",
      hostname: "javbus.com",
      url: "https://javbus.com/{{code}}",
      fetcher: "get",
      domQuery: {},
      method: temp
    }
  ];
  window.location.hostname.match(/^.*?\.?(.*)\.com$/)[1] === "javdb" ? "jdb" : "jbus";
  const ENV = "jbus";
  (_c = document.querySelector(`[data-clipboard-text]`)) == null ? void 0 : _c.dataset.clipboardText;
  const jbusCode = (_d = document.querySelector(`span[style="color:#CC0000;"]`)) == null ? void 0 : _d.innerText.replace("\u590D\u5236", "");
  const envCode = jbusCode;
  function videoPageParser(responseText, { subQuery, leakQuery, videoQuery }) {
    const doc = new DOMParser().parseFromString(responseText, "text/html");
    const subNode = subQuery ? doc.querySelector(subQuery) : "";
    const subNodeText = subNode ? subNode.innerHTML : "";
    const leakNode = leakQuery ? doc.querySelector(leakQuery) : null;
    const videoNode = videoQuery ? doc.querySelector(videoQuery) : true;
    return {
      isSuccess: !!videoNode,
      hasSubtitle: subNodeText.includes("\u5B57\u5E55") || subNodeText.includes("subtitle"),
      hasLeakage: !!leakNode
    };
  }
  function serachPageParser(responseText, { linkQuery, titleQuery, listIndex = 0, spaceCode = false }, siteHostName) {
    const doc = new DOMParser().parseFromString(responseText, "text/html");
    const linkNode = linkQuery ? doc.querySelectorAll(linkQuery)[listIndex] : null;
    const titleNode = titleQuery ? doc.querySelectorAll(titleQuery)[listIndex] : null;
    const titleNodeText = titleNode ? titleNode == null ? void 0 : titleNode.outerHTML : "";
    function query() {
      const envCodeWithSpace = spaceCode ? envCode.replace("-", " ") : envCode;
      const condition = linkNode && titleNode && (titleNodeText.includes(envCodeWithSpace) || titleNodeText.includes(envCode));
      if (condition) {
        return {
          isSuccess: true,
          targetLink: linkNode.href.replace(linkNode.hostname, siteHostName),
          hasLeakage: titleNodeText.includes("\u65E0\u7801") || titleNodeText.includes("Uncensored"),
          hasSubtitle: titleNodeText.includes("\u5B57\u5E55") || titleNodeText.includes("subtitle")
        };
      } else {
        return { targetLink: "", isSuccess: false };
      }
    }
    return query();
  }
  async function xhr(siteItem, siteUrl) {
    const xhrPromise = new Promise((resolve) => {
      b({
        method: "GET",
        url: siteUrl,
        onload: (response) => {
          if (siteItem.fetcher === "get") {
            if (response.status === 404) {
              resolve({
                isSuccess: false,
                targetLink: siteUrl,
                name: siteItem.name,
                msg: "\u5E94\u8BE5\u662F\u6CA1\u6709\u8D44\u6E90"
              });
            } else {
              const { hasSubtitle, hasLeakage, isSuccess } = videoPageParser(
                response.responseText,
                siteItem.domQuery
              );
              resolve({
                isSuccess,
                targetLink: siteUrl,
                name: siteItem.name,
                hasSubtitle,
                hasLeakage,
                msg: "[get]\uFF0C\u5B58\u5728\u8D44\u6E90"
              });
            }
          } else if (siteItem.fetcher === "parser") {
            const { targetLink, isSuccess, hasLeakage, hasSubtitle } = serachPageParser(
              response.responseText,
              siteItem.domQuery,
              siteItem.hostname
            );
            resolve({
              name: siteItem.name,
              isSuccess,
              targetLink: isSuccess ? targetLink : siteUrl,
              hasSubtitle,
              hasLeakage,
              msg: "[parser]\u5B58\u5728\u8D44\u6E90"
            });
          }
        },
        onerror: (error) => {
          resolve({
            isSuccess: false,
            targetLink: siteUrl,
            name: siteItem.name,
            msg: error.error
          });
        }
      });
    });
    return xhrPromise;
  }
  function createPanelNode() {
    const parentNodeQueryString = `.row.movie .info`;
    const parentNode = document.querySelector(parentNodeQueryString);
    const panelNode = document.createElement("div");
    parentNode && parentNode.appendChild(panelNode);
    panelNode.classList.add("panel-block", "column");
    return panelNode;
  }
  function createButtonNode(panelNode, siteItemName, siteUrl) {
    const buttonNode = document.createElement("a");
    buttonNode.setAttribute("target", "_blank");
    panelNode.appendChild(buttonNode);
    const buttonClassList = ["label", "label-default"];
    buttonClassList.forEach((item) => {
      buttonNode.classList.add(item, "button-g");
    });
    buttonNode.innerHTML = siteItemName;
    buttonNode.href = siteUrl;
    return {
      buttonNode,
      setButtonStatus: (targetLink, color, hasLeakage = false, hasSubtitle = false) => {
        buttonNode.href = targetLink;
        buttonNode.style.color = buttonNode.style.color;
        buttonNode.style.borderColor = buttonNode.style.borderColor;
        buttonNode.style.backgroundColor = color;
        hasLeakage && buttonNode.classList.add("has-leakage");
        hasSubtitle && buttonNode.classList.add("has-subtitle");
      }
    };
  }
  (function main() {
    l(jbusStyle);
    const panelNode = createPanelNode();
    const envSiteList = siteList.filter((item) => {
      return item.disable !== ENV;
    });
    envSiteList.forEach(async (item) => {
      const siteUrl = item.url.replace("{{code}}", envCode);
      const { setButtonStatus } = createButtonNode(panelNode, item.name, siteUrl);
      const { isSuccess, hasLeakage, hasSubtitle, targetLink } = await xhr(item, siteUrl);
      setButtonStatus(targetLink, isSuccess ? "green" : "red", hasLeakage, hasSubtitle);
    });
  })();
})();
