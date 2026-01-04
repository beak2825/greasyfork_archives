// ==UserScript==
// @name         影视网页标题清理
// @version      15
// @description  从疑似影视网页的标题中提取片名与集数重新显示
// @author       Lemon399
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/465160/%E5%BD%B1%E8%A7%86%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/465160/%E5%BD%B1%E8%A7%86%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
  function matcher(title) {
    let result = "",
      ji = NaN,
      temp = title;
    /* 匹配 [数字]集 */
    const ji1 = title.match(/(\d+)集/);
    /* 如果存在 */
    if (ji1) {
      /* 取 [数字] 为集数 */
      ji = ji1[1];
      /* 删除 [数字]集 以及后面所有内容 */
      temp = title.split(ji + "集")[0];
      /* 如果末尾是 第，删除 第 */
      if (temp.match(/第$/)) {
        temp = temp.replace(/第$/, "");
      }
    }
    /* 如果上面没有得到集数，匹配 》[空格][数字] 为集数 */
    const ji2 = title.match(/》\s*(\d+)/);
    if (!ji && ji2) ji = ji2[1];
    /* 删除 《 以及前面内容 和 》以及后面内容，清理多余空格 */
    temp = temp.replace(/^.*《/, "").replace(/》.*$/, "").trim();
    result = temp + (ji ? " " + ji.padStart(2, "0") : "");
    return result ? result : title;
  }

  function updateTitle() {
    document.title = matcher(document.title);
  }

  // 初始执行 - 延迟0.3秒执行
  setTimeout(updateTitle, 300);

  // 网页加载完成后立即执行
  window.addEventListener('load', updateTitle);
})();