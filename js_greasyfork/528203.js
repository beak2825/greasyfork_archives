// ==UserScript==
// <code>@name</code>  将浏览器时间改成ip时间
// @name  将浏览器时间改成ip时间
// @match https://ip8.com
// <code>@description</code> 将浏览器时间改成ip时间
// @description 将浏览器时间改成ip时间cccc
// @version 0.0.1.20250227060029
// @namespace https://greasyfork.org/users/715846
// @downloadURL https://update.greasyfork.org/scripts/528203/%E5%B0%86%E6%B5%8F%E8%A7%88%E5%99%A8%E6%97%B6%E9%97%B4%E6%94%B9%E6%88%90ip%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/528203/%E5%B0%86%E6%B5%8F%E8%A7%88%E5%99%A8%E6%97%B6%E9%97%B4%E6%94%B9%E6%88%90ip%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

// 从页面中提取 IP 时间（需根据实际页面结构修改选择器）
function extractIPTime() {
  const timeElement = document.querySelector('table td[data-test="IP Time-ip-details"]'); // 假设页面中显示时间的元素 ID
  return timeElement?.textContent?.trim();
}

// 覆盖 Date 对象以模拟时间
function overrideDate(ipTime) {
  const originalDate = Date;
  const targetTime = new Date(ipTime).getTime();

  // 重写 Date 构造函数
  window.Date = class extends Date {
    constructor(...args) {
      if (args.length === 0) {
        return new originalDate(targetTime); // 返回模拟时间
      }
      return new originalDate(...args);
    }
    static now() {
      return targetTime; // 覆盖 Date.now()
    }
  };
}

// 主逻辑
(async () => {
  const ipTime = extractIPTime();
  if (!ipTime) return;

  const browserTime = new Date();
  const ipTimeDate = new Date(ipTime);

  // 比对时间（允许误差 1 秒）
  if (Math.abs(ipTimeDate - browserTime) > 1000) {
    overrideDate(ipTime);
    console.log('已模拟浏览器时间为 IP 时间:', ipTime);
  }
})();