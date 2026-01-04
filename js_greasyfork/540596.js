// ==UserScript==
// @name         ios美区共享账号免费获取（弹框清除脚本）
// @namespace    http://tampermonkey.net/
// @version      2025-06-30
// @description  开启脚本，进入网站https://free.mayun.us/，即可选择外区ios商店共享账号。
// @author       sq li
// @match        *
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540596/ios%E7%BE%8E%E5%8C%BA%E5%85%B1%E4%BA%AB%E8%B4%A6%E5%8F%B7%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96%EF%BC%88%E5%BC%B9%E6%A1%86%E6%B8%85%E9%99%A4%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540596/ios%E7%BE%8E%E5%8C%BA%E5%85%B1%E4%BA%AB%E8%B4%A6%E5%8F%B7%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96%EF%BC%88%E5%BC%B9%E6%A1%86%E6%B8%85%E9%99%A4%E8%84%9A%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  /**
   * 检测并清除页面中的各种弹框
   * 支持多种常见弹框类型的检测与清除
   */
  function detectAndRemoveAllModals() {
    console.log("开始检测并清除弹框...");

    // 1. 处理原生的alert/confirm/prompt
    // 重写window.alert, confirm, prompt方法
    window.alert = function () {
      return undefined;
    };
    window.confirm = function () {
      return true;
    };
    window.prompt = function () {
      return "";
    };
    console.log("已屏蔽原生alert/confirm/prompt对话框");

    // 2. 检测并移除可能的模态框/弹出层
    const possibleModalSelectors = [
      // 常见的弹框class名
      ".modal",
      ".dialog",
      ".popup",
      ".overlay",
      ".layer",
      ".alert",
      ".message-box",
      ".dialog-box",
      ".pop",
      ".popover",
      ".toast",
      ".mask",
      ".modal-wrapper",
      ".modal-container",
      // 常见弹框库的class
      ".el-dialog__wrapper",
      ".el-message-box__wrapper", // Element UI
      ".ant-modal-root",
      ".ant-modal-mask", // Ant Design
      ".v-dialog__container",
      ".v-dialog", // Vuetify
      ".MuiDialog-root",
      ".MuiModal-root", // Material UI
      ".modal-backdrop",
      ".modal.show", // Bootstrap
      ".layui-layer",
      ".layui-layer-shade", // LayUI
      ".weui-dialog",
      ".weui-toast", // WeUI
      // 其他常见命名
      '[class*="modal"]',
      '[class*="dialog"]',
      '[class*="popup"]',
      '[id*="modal"]',
      '[id*="dialog"]',
      '[id*="popup"]',
      // 通过z-index和position检测
      'div[style*="z-index"][style*="position: fixed"]',
      'div[style*="z-index"][style*="position:fixed"]',
      'div[style*="z-index"][style*="position: absolute"]',
      'div[style*="z-index"][style*="position:absolute"]',
    ];

    // 合并所有选择器并获取元素
    const allModals = document.querySelectorAll(
      possibleModalSelectors.join(", ")
    );
    console.log(`找到 ${allModals.length} 个可能的弹框元素`);

    // 移除找到的所有弹框元素
    allModals.forEach((modal, index) => {
      try {
        // 1. 尝试使用可能存在的关闭按钮
        const closeButtons = modal.querySelectorAll(
          'button.close, .close-btn, .cancel, .closeBtn, [class*="close"], ' +
            '[aria-label="Close"], [data-dismiss="modal"], .el-dialog__headerbtn, ' +
            ".ant-modal-close, .layui-layer-close"
        );

        let closed = false;
        closeButtons.forEach((btn) => {
          try {
            btn.click();
            closed = true;
            console.log(`通过关闭按钮关闭了弹框 #${index}`);
          } catch (e) {
            console.log(`点击关闭按钮失败: ${e.message}`);
          }
        });

        // 2. 如果没有通过按钮关闭，尝试直接移除元素
        if (!closed) {
          // 保存原始样式，以便检测变化
          const originalDisplay = modal.style.display;
          const originalVisibility = modal.style.visibility;

          // 尝试使用常见的隐藏方法
          modal.style.display = "none";
          modal.style.visibility = "hidden";
          modal.style.opacity = "0";
          modal.style.pointerEvents = "none";

          // 尝试将z-index设为较低值
          if (modal.style.zIndex) {
            modal.style.zIndex = "-1";
          }

          // 检查是否已隐藏，如果没有则尝试移除
          if (
            modal.style.display === originalDisplay &&
            modal.style.visibility === originalVisibility
          ) {
            modal.remove();
            console.log(`已移除弹框元素 #${index}`);
          } else {
            console.log(`已隐藏弹框元素 #${index}`);
          }
        }
      } catch (e) {
        console.error(`处理弹框 #${index} 时出错: ${e.message}`);
      }
    });

    // 3. 移除可能的遮罩层
    const overlays = document.querySelectorAll(
      ".overlay, .mask, .backdrop, .modal-backdrop, " +
        'div[style*="background"][style*="fixed"], ' +
        'div[style*="background-color: rgba"][style*="position: fixed"]'
    );

    overlays.forEach((overlay, index) => {
      try {
        overlay.remove();
        console.log(`已移除遮罩层 #${index}`);
      } catch (e) {
        console.error(`移除遮罩层 #${index} 时出错: ${e.message}`);
      }
    });

    // 4. 恢复页面滚动
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";
    document.body.style.top = "";

    console.log("已尝试恢复页面滚动状态");

    // 5. 移除可能添加的内联样式
    const bodyClasses = document.body.className.split(" ");
    const modalBodyClasses = bodyClasses.filter(
      (cls) =>
        cls.includes("modal") ||
        cls.includes("overflow") ||
        cls.includes("fixed")
    );

    modalBodyClasses.forEach((cls) => {
      document.body.classList.remove(cls);
    });

    console.log("已清除可能的模态框相关body类");

    return {
      modalCount: allModals.length,
      overlayCount: overlays.length,
    };
  }
  let timer = setInterval(() => {
    // 执行函数
    const result = detectAndRemoveAllModals();
    console.log(
      `总共处理了 ${result.modalCount} 个弹框和 ${result.overlayCount} 个遮罩层`
    );
  }, 10000);
  window.addEventListener("beforeunload", function (event) {
    clearInterval(timer);
  });
})();
