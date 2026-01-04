// ==UserScript==
// @name         v2ex-topic-tooltip
// @namespace    npm/vite-plugin-monkey
// @version      0.0.3
// @author       monkey
// @description  show v2ex topic tooltip
// @license      MIT
// @icon         https://www.v2ex.com/static/favicon.ico
// @match        *://v2ex.com/*
// @match        *://*.v2ex.com/*
// @downloadURL https://update.greasyfork.org/scripts/459936/v2ex-topic-tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/459936/v2ex-topic-tooltip.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function isDarkMode() {
    return !!document.querySelector(".Night");
  }
  const tooltipEl = document.createElement("div");
  tooltipEl.setAttribute("id", "tooltipEl");
  const loadingEl = document.createElement("div");
  loadingEl.innerHTML = "Fetching...";
  loadingEl.style.cssText = `
    text-align: center;
    margin-top: 40px;
    color: #666;
`;
  tooltipEl.appendChild(loadingEl);
  const CLOSE_TIMEOUT = 300;
  const OPEN_TIMEOUT = 500;
  let closeTimer = 0;
  let openTimer = 0;
  let isTooltipShow = false;
  function createTooltip() {
    tooltipEl.style.cssText = `
    position: absolute;
    width: 400px;
    min-height: 100px;
    max-height: 300px;
    background: ${isDarkMode() ? "#25303e" : "#fff"};
    padding: 20px;
    border: 1px solid ${isDarkMode() ? "#1f2227" : "#e4e7ed"};
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    overflow: auto;
    z-index: 100;
    border-radius: 4px;
    top: 0;
    display: none;
    align-items: center;
  `;
    tooltipEl.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
    });
    tooltipEl.addEventListener("mouseleave", () => {
      hideTooltip();
    });
    document.body.appendChild(tooltipEl);
  }
  function hideTooltip() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      tooltipEl.style.display = "none";
      isTooltipShow = false;
    }, CLOSE_TIMEOUT);
  }
  function showTooltip() {
    openTimer = setTimeout(() => {
      tooltipEl.style.display = "block";
      isTooltipShow = true;
    }, OPEN_TIMEOUT);
  }
  async function getContent(tid) {
    try {
      tooltipEl.innerHTML = "";
      tooltipEl.appendChild(loadingEl);
      let domString = "";
      if (sessionStorage.getItem(`v2ex-${tid}`)) {
        domString = JSON.parse(JSON.stringify(sessionStorage.getItem(`v2ex-${tid}`)));
      } else {
        const response = await fetch(`https://www.v2ex.com/t/${tid}`);
        domString = await response.text();
        sessionStorage.setItem(`v2ex-${tid}`, domString);
      }
      const domParser = new DOMParser();
      const dom = domParser.parseFromString(domString, "text/html");
      const content = dom.querySelector("#Main > .box");
      tooltipEl.innerHTML = "";
      tooltipEl.append(content);
      setTimeout(() => {
        document.querySelector("#tooltipEl").scrollTop = 0;
      }, 500);
    } catch (error) {
      console.log("🚀 v2ex-topic-tooltip error", error);
    }
  }
  function main() {
    document.querySelectorAll(".item_title,.item_hot_topic_title").forEach((el) => {
      el.addEventListener("mouseenter", (event) => {
        var _a;
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
        if (!isTooltipShow) {
          const pageX = event.pageX;
          const pageY = event.pageY;
          tooltipEl.style.transform = `translate(${pageX - 300}px, ${pageY}px)`;
          const href = (_a = el.querySelector("a")) == null ? void 0 : _a.getAttribute("href");
          const tid = href == null ? void 0 : href.match(/\d+/g)[0];
          showTooltip();
          if (tid)
            getContent(tid);
        }
      });
      el.addEventListener("mouseleave", () => {
        clearTimeout(openTimer);
        hideTooltip();
      });
    });
    createTooltip();
  }
  main();
})();
