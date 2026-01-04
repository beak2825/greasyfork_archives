// ==UserScript==
// @name         屏蔽谷歌广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动屏蔽谷歌广告的插件，告别烦恼！！！
// @author       Boen
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=231395.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471358/%E5%B1%8F%E8%94%BD%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/471358/%E5%B1%8F%E8%94%BD%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  /** 配置 */
  const config = {
    containerDom: document.body, // 广告挂载的DOM
    observerConfig: {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      subtree: true, // 观察后代节点，默认为 false
    },
    adSelectArr: ["ins", `[id*="aswift"]`], // ad's selectors
  };

  /**
   * 防抖函数
   * @param {Function} fn 执行函数
   * @param {Number} delay 延迟时间
   * @returns
   */
  function debounce(fn, delay = 100) {
    let timer = null;

    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  /**
   * 删除广告
   */
  function removeADs() {
    const adSelectArr = window?.$adSelectArr || []; // ad's selectors
    for (const el of adSelectArr) {
      const adIns = document.querySelectorAll(el);
      // 如果广告存在
      if (adIns) {
        for (let el of adIns) {
          try {
            el && el.remove();
          } catch (error) {
            console.error(el);
          }
        }
      }
    }
    clearVar();
  }

  /**
   * 清除缓存
   */
  function clearVar() {
    delete window.$adSelectArr;
    window.$observer.disconnect();
    window.$observer = null;
  }

  /**
   * 入口
   * @param {Object} config
   */
  function main(config) {
    try {
      const { containerDom, observerConfig, adSelectArr } = config;
      const debounceRemoveADs = debounce(removeADs, 100);
      const observer = new MutationObserver(() => {
        debounceRemoveADs();
      });
      observer.observe(containerDom, observerConfig);

      window.$adSelectArr = adSelectArr;
      window.$observer = observer;
    } catch (error) {
      console.error(error);
    }
  }

  main(config);
})();
