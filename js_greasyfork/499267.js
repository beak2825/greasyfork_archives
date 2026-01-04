// ==UserScript==
// @name         tonghuashun screener assistant
// @namespace    http://tampermonkey.net/
// @version      2024-09-25
// @description  同花顺i问财股票助手，多股同列页面上增加复制按钮、打开详情按钮、批量复制选中按钮
// @author       goodzhuwang
// @match        https://www.iwencai.com/unifiedwap/result?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499267/tonghuashun%20screener%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/499267/tonghuashun%20screener%20assistant.meta.js
// ==/UserScript==
(function () {
  "use strict";

  function insertStyleNode() {
    let style_node_id = "__thsext_style";

    // 获取具有ID为myDiv的节点
    var el = document.getElementById(style_node_id);

    // 从body中删除myDiv节点
    if (el) {
      document.body.removeChild(el);
    }

    // 创建一个style元素
    var style = document.createElement("style");

    style.id = style_node_id;
    // 设置style元素的内容为CSS代码
    style.innerHTML = `
    .__thsext-button {
      padding: 3px 5px;
      background-color: #fff;
      border-radius: 2px;
      cursor: pointer;
      font-size: 10px;
      border: 1px solid #cecece;
      margin-right: 5px;
    }
    .__thsext-button:hover {
      background-color: #0056b34f;
    }

    .__thsext-button:active {
      background-color: #0033664f;
    }
  `;

    // 将style元素添加到body中
    document.body.appendChild(style);
  }
  async function copyClipboard(text) {
    if (!text) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast(`已复制代码: ${text}`);
    } catch (err) {
      showToast(`复制失败: ${err.message}`);
    }
  }

  // 显示Toast消息
  function showToast(message) {
    // 创建一个div元素作为Toast消息容器
    var toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.top = "5%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    toast.style.color = "#fff";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";

    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      document.body.removeChild(toast);
    }, 2000);
  }
  function openWindow(url) {
    window.open(url, "_blank");
  }

  // 插入按钮通用方法
  function insertButton(container, label, className, cb) {
    let btn = container.querySelector(`.${className}`);
    if (btn) {
      btn.parentNode.removeChild(btn);
    }

    btn = document.createElement("button");
    btn.innerText = label;
    btn.classList.add("__thsext-button");
    btn.classList.add(className);

    btn.addEventListener("click", function (event) {
      event.preventDefault(); // 阻止默认行为 (例如，阻止链接跳转)
      event.stopPropagation(); // 阻止事件传播
      cb && cb();
    });
    container.appendChild(btn);
  }

  function insert_item_inner_button() {
    let els = document.querySelectorAll(".stock-item .code");

    // 在每个元素上添加复制按钮和打开按钮
    els.forEach((el) => {
      let code = el.innerText;

      insertButton(
        el.parentNode,
        "复制代码",
        copy_button_class_name,
        function () {
          copyClipboard(code);
        }
      );

      insertButton(
        el.parentNode,
        "打开详情",
        open_button_class_name,
        function () {
          openWindow(`https://stockpage.10jqka.com.cn/${code}/`);
        }
      );
    });
  }

  function getNextTdSibling(currentNode) {
    let nextSibling = currentNode.nextElementSibling;

    while (nextSibling && nextSibling.nodeName !== "TD") {
      nextSibling = nextSibling.nextElementSibling;
    }

    return nextSibling;
  }
  function insert_batch_button() {
    let batch_copy_btn = document.querySelector(
      `.${batch_copy_button_class_name}`
    );
    if (batch_copy_btn) {
      batch_copy_btn.parentNode.removeChild(batch_copy_btn);
    }
    batch_copy_btn = document.createElement("button");

    batch_copy_btn.textContent = "批量复制选中";
    batch_copy_btn.classList.add("__thsext-button");
    batch_copy_btn.classList.add(batch_copy_button_class_name);

    batch_copy_btn.addEventListener("click", function (event) {
      event.preventDefault(); // 阻止默认行为 (例如，阻止链接跳转)
      event.stopPropagation(); // 阻止事件传播

      let codes = [];

      // 支持股票列表和多股同列两种情况

      // 股票列表
      let gupiaoliebiao_el = document.querySelector(
        ".iwc-table-body-inner.scroll-style2"
      );
      // 多股同列
      let duogutonglie_el = document.querySelector(".stock-chart");

      if (gupiaoliebiao_el) {
        let els = gupiaoliebiao_el.querySelectorAll(".tr-selected");

        els.forEach((el) => {
          let code_td_el = getNextTdSibling(el.closest("td"));
          if (!code_td_el) return;

          let code_el = code_td_el.querySelector(".td-cell-box");
          if (!code_el) return;
          let code = code_el.innerText;
          codes.push(code);
        });
      } else if (duogutonglie_el) {
        let els = duogutonglie_el.querySelectorAll(".stock-item .chose");
        els.forEach((el) => {
          let img_el = el.querySelector("img");
          if (!img_el) return;

          if (img_el.style.display == "none") return;

          let code_el = el.parentNode.querySelector(".code");
          if (!code_el) return;
          let code = code_el.innerText;

          codes.push(code);
        });
      }

      if (codes.length) {
        copyClipboard(codes.join(","));
      } else {
        showToast(`没有选中内容`);
      }
    });
    const referenceElement = document.querySelector(".table-export");
    if (!referenceElement) return;
    referenceElement.parentNode.insertBefore(batch_copy_btn, referenceElement);
  }

  let copy_button_class_name = "__thsext_copy_code_button";
  let open_button_class_name = "__thsext_open_code_button";
  let batch_copy_button_class_name = "__thsext_batch_copy_button";
  // 定时监测
  setInterval(function () {
    if (!document.querySelector(`.${copy_button_class_name}`)) {
      insertStyleNode();
      insert_item_inner_button();
    }
    if (!document.querySelector(`.${batch_copy_button_class_name}`)) {
      insert_batch_button();
    }
  }, 2000);

  console.log("thsext userscript loaded");
})();
