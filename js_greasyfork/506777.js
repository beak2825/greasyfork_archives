// ==UserScript==
// @name         YU多开
// @namespace    http://detechment.org
// @version      1.1
// @description  用于烟草网络学院多开、长时间播放自动检查、同一个课程快速打开多个页面
// @author       Yu
// @match        *://mooc.ctt.cn/*
// @license      GPL-3.0-or-later
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506777/YU%E5%A4%9A%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/506777/YU%E5%A4%9A%E5%BC%80.meta.js
// ==/UserScript==

if (window.location.hash.startsWith("#/study/course/detail/")) {
  window.onload = function () {
    // 创建弹框的HTML内容
    const modalHtml = `
            <div id="customModal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                <div style="background-color: white; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 300px; text-align: center; border-radius: 10px;">
                    <p>是否继续打开新页面</p>
                    <button id="confirmBtn" class="niceButton4" style="margin-right: 10px;">确定</button>
                    <button id="cancelBtn" class="niceButton4">取消</button>
                </div>
            </div>
        `;

    // 插入弹框的HTML到页面中
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // 添加按钮的CSS样式
    const style = document.createElement("style");
    style.textContent = `
            .niceButton4 {
                background-color: skyblue;
                border: none;
                border-radius: 12px;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                transition-duration: 0.4s;
                -webkit-transition-duration: 0.4s;
                line-height: 1;  /* 使文本垂直居中 */
                vertical-align: middle;  /* 垂直对齐中间 */
            }

            .niceButton4:hover {
                box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
                0 17px 50px 0 rgba(0, 0, 0, 0.19);
            }
        `;
    document.head.appendChild(style);

    // 显示弹框
    const modal = document.getElementById("customModal");
    modal.style.display = "block";

    // 确定按钮事件
    document.getElementById("confirmBtn").onclick = function () {
      window.open(window.location.href, "_blank"); // 以新标签页的形式打开相同的URL
      modal.style.display = "none"; // 关闭弹框
    };

    // 取消按钮事件
    document.getElementById("cancelBtn").onclick = function () {
      modal.style.display = "none"; // 关闭弹框
    };
  };
}
(function () {
  "use strict";
  if (window.location.hash.startsWith("#/study/course/detail/")) {
    // 延时1秒后移除hashchange事件监听器
    setTimeout(() => {
      try {
        window.app = {};
        console.log("hashchange事件监听器已移除");
      } catch (error) {
        console.error("无法移除hashchange事件监听器:", error);
      }
    }, 1000);
    // 循环检查并点击ID为'D398btn-ok'的按钮，用于自动跳过在看检查事件
    setInterval(() => {
      const button = document.getElementById("D398btn-ok");
      if (button) {
        button.click();
        console.log("按钮已点击");
      }
    }, 2000);
  }
})();
