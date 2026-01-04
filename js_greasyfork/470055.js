// ==UserScript==
// @name         去掉飞书虚拟滚动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉飞书虚拟滚动，连接整个网页
// @author       You
// @match        https://*.feishu.cn/docx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470055/%E5%8E%BB%E6%8E%89%E9%A3%9E%E4%B9%A6%E8%99%9A%E6%8B%9F%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/470055/%E5%8E%BB%E6%8E%89%E9%A3%9E%E4%B9%A6%E8%99%9A%E6%8B%9F%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  async function accumulate() {
    const scrollContainer = document.querySelector(".bear-web-x-container");
    const contentContainer = document.querySelector(".render-unit-wrapper");
    await setScrollTop();
    const frag = await scroll(scrollContainer, contentContainer);
    return frag;
  }

  function appendFragment(frag) {
    document.body.innerHTML = "";
    document.body.appendChild(frag);
    document.body.style.cssText = `
        width: 80%;
        padding: 0 100px;
        margin: auto;
        height: auto;
        overflow: auto;
    `;
  }

  function scroll(el, container, options) {
    let resolve;
    const promise = new Promise((r) => (resolve = r));
    const fragment = observe(container);
    const { scrollGap, scrollInterval } = Object.assign(
      {
        scrollGap: 300,
        scrollInterval: 200,
      },
      options
    );

    let lastScrollHeight = -1;

    const end = (window.stop = () => {
      clearInterval(interval);
      resolve(fragment);
    });
    const interval = setInterval(() => {
      if (el.scrollTop === lastScrollHeight) {
        end();
        return;
      }
      lastScrollHeight = el.scrollTop;
      el.scrollBy(0, scrollGap);
    }, scrollInterval);

    return promise;
  }

  function observe(target, callback) {
    const fragment = (window.f = document.createDocumentFragment());

    appendNodes(target.childNodes);

    function appendNodes(nodes) {
      for (let node of [...nodes]) {
        if (
          node.hasAttribute("data-block-id") &&
          !node.classList.contains("isEmpty")
        ) {
          fragment.appendChild(node.cloneNode(true));
        }
      }
    }

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          setTimeout(() => {
            appendNodes(mutation.addedNodes);
          }, 2000);
        }
      }

      if (callback) {
        callback(fragment);
      }
    });

    observer.observe(target, {
      childList: true,
    });

    return fragment;
  }

  async function setScrollTop() {
    const els = document.querySelectorAll(".catalogue__item-title");
    let anchor;
    for (let i = 0; i < els.length; i++) {
      let el = els[i];
      if (el.innerText.includes("上课")) {
        anchor = el;
      }
    }
    anchor.click();
    await wait(2000);
  }

  async function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  async function waitPageLoad() {
    return new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      window.addEventListener("load", async (event) => {
        await wait(1000);
        resolve();
      });
    });
  }

  async function main() {
    await waitPageLoad();
    const frag = await accumulate();
    appendFragment(frag);
  }

  main();
})();
