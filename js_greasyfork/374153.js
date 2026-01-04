// ==UserScript==
// @name         生成上线周知
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the node server!
// @author       pujiaxun
// @match        https://km.sankuai.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/374153/%E7%94%9F%E6%88%90%E4%B8%8A%E7%BA%BF%E5%91%A8%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/374153/%E7%94%9F%E6%88%90%E4%B8%8A%E7%BA%BF%E5%91%A8%E7%9F%A5.meta.js
// ==/UserScript==

const BUTTON_ID = "SXZZ-GenDeployNoticeButton";
const PLUGIN_NAME = "[生成上线周知插件]";

(function() {
  "use strict";
  window.addEventListener(
    "load",
    function(e) {
      setTimeout(init, 2000);
    },
    true
  );
})();

/**
 * 监视内容DOM子元素的变化，主要用来判断是否切换页面
 */
function observeIt() {
  const targetNode = document.getElementById("page-wrapper");
  const config = { childList: true, characterData: true };
  const observer = new MutationObserver(mutationList => {
    refresh();
  });

  observer.observe(targetNode, config);
}

/**
 * 初始化，添加页面切换的observer，并refresh按钮
 */
function init() {
  observeIt();
  refresh();
}

/**
 * 清除按钮，并判断是否需要添加按钮
 */
function refresh() {
  flush();
  if (hasDeployPlan()) {
    create();
  }
}

/**
 * 清除按钮
 */
function flush() {
  const existBtn = document.getElementById(BUTTON_ID);
  if (existBtn) {
    existBtn.parentNode.removeChild(existBtn);
  }
}

/**
 * 插入一个按钮，用来一键生成上线周知
 */
function create() {
  const d = document.createElement("div");
  d.innerHTML = `<button style="position: fixed; right: 40px; bottom: 150px" class="ant-btn ant-btn-primary" id="${BUTTON_ID}" title="点击自动复制"><span>生成上线周知</span></button>`;

  d.addEventListener("click", genDeployNotice);
  document.body.appendChild(d);
}

/**
 * 生成上线周知，并复制到系统剪贴板
 */
function genDeployNotice() {
  try {
    const textList = getValidLineDatas();
    const noticeItems = [
      `【上线项目】：${textList[1]}`,
      `【上线内容】：${textList[0]}`,
      `【上线时间】：${textList[6]}`,
      `【影响范围】：${textList[2]}`,
      `【上线计划】：${location.href}`
    ];
    const result = noticeItems.join("\n");
    GM_setClipboard(result, { type: "text" });
    message("上线周知已成功复制到剪贴板", "success");
  } catch (e) {
    message("Something Wrong", "error");
    console.info(PLUGIN_NAME, "报错了，我也不知道咋处理，欢迎帮忙debug");
    console.error(PLUGIN_NAME, e);
  }
}

/**
 * 判断是否为上线方案页面
 */
function hasDeployPlan() {
  return !!document.querySelector('a[title="境外度假终端上线流程规范"]');
}

/**
 * 解析HTML，获取表格最后n行的所有单元格
 */
function parseHtml(lastIndex = 0) {
  const trs = document.querySelectorAll("table tbody tr");
  const tds = trs[trs.length - 1 - lastIndex].querySelectorAll("td");
  const tdContentList = Array.map(tds, td => td.textContent);
  return tdContentList;
}

/**
 * 循环遍历列表，找到最后一条有效数据
 */
function getValidLineDatas() {
  const trs = document.querySelectorAll("table tbody tr");
  let textList = [];
  let lastIndex = 0;
  do {
    textList = parseHtml(lastIndex);
    lastIndex += 1;
    // 数据列表未定义或者仅包含空格则寻找上一条
  } while ((!textList || !textList.join('').trim()) && lastIndex < trs.length);

  return textList;
}

/**
 * 弹出消息提示框
 * @param {string} msg 提示信息内容
 * @param {string} type 提示样式类型：success|warning|error
 */
function message(msg = "", type = "success") {
  const msgEl = document.createElement("div");
  msgEl.innerHTML = `<div data-reactroot="" class="ant-message"><span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-${type}"><i class="anticon anticon-check-circle"></i><span>${msg}</span></div></div></div></span></div>`;
  document.body.appendChild(msgEl);
  setTimeout(() => {
    msgEl.remove();
  }, 3000);
}
