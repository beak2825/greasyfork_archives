// ==UserScript==
// @name         Stock Adobe防误触脚本
// @namespace    Stock Adobe
// @version      20240321.1.0.4
// @description  Stock Adobe避免用户误操作
// @author       L..
// @match        *://stock.adobe.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490420/Stock%20Adobe%E9%98%B2%E8%AF%AF%E8%A7%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/490420/Stock%20Adobe%E9%98%B2%E8%AF%AF%E8%A7%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (window.adobeloaded) return;
  window.adobeloaded = true;
  console.log("执行脚本代码");

  // 限制目标DOM
  function disabled (dom) { 
    dom.style.background = "red";
    dom.style.filter = "opacity(0.3)";
    dom.style.pointerEvents = "none";
  }
  // 校验是否允许授权
  function isAllow (text) { 
    if (!text) return false;
    const numArr = text.match(/\d+/g);
    if (!numArr) return false;
    return Number(numArr.join("")) == 1;
  }
  /**
   * 移除最后一项授权选项
   */
  function removeTargetDOM () { 
    const inputs = document.querySelectorAll('[name="asset-license"]');
    if (inputs?.length) {
      const container = inputs[0].closest(".js-actions-panel-container");
      let count = 0;
      inputs.forEach(input => { 
        // 遍历每个选项，授权成本是'1 點方案點數'以外的选项全部屏蔽
        if (!isAllow(input.closest("label.switch").querySelector(".bh-license-price")?.innerText)) {
          count++;
          disabled(input.closest("label.switch"));
        }
      });
      if (inputs.length == count) {
        // 当所有选项都被屏蔽的时候，授权按钮一起屏蔽
        disabled(container.querySelector('button[data-clicktype="details-buy-license"]'));
      }
    } else {
      // 当没有选项只有label标签时也需要校验授权成本
      const labels = document.querySelectorAll('[role="group"] label.switch');
      if (labels?.length) {
        let count = 0;
        labels.forEach(label => { 
          // 遍历每个选项，成本是'1 點方案點數'以外的选项全部屏蔽
          if (!isAllow(label.querySelector(".bh-license-price")?.innerText)) {
            count++;
            disabled(label);
          }
        });
        if (labels.length == count) {
          disabled(document.querySelector('button[data-clicktype="details-buy-license"]'));
        }
      }
    }

    // 屏蔽鼠标悬浮出现的授权按钮
    document.querySelectorAll(".search-result-cell .hover-buy-button-container").forEach((btn) => { 
      disabled(btn);
    });

  }
  
  /**
   * 监听Body是否有DOM变化
   */
  function observerBody () { 
    var body = document.querySelector("body");
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
      var observer = new MutationObserver(function () {
        // MutationObserver监听: Body中插入了内容
        removeTargetDOM();
      });
      observer.observe(body, { childList: true, subtree: true });
    } else if (body.addEventListener) {
      body.addEventListener("DOMSubtreeModified", function (evt) {
        // DOMSubtreeModified监听: Body中插入了内容
        removeTargetDOM();
      }, false);
    }
  }

  removeTargetDOM();
  observerBody();
})();