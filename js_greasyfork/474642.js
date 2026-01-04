// ==UserScript==
// @name         高亮地址指定楼层
// @namespace    https://greasyfork.org/zh-CN/users/764555
// @version      1.2.2
// @description  高亮地址指定楼层,提高管理效率
// @author       冰冻大西瓜
// @license      GPLv3
// @match        https://www.52pojie.cn/thread-*.html
// @match        https://www.52pojie.cn/forum.php?mod=viewthread*
// @grant        none
// @note         更新 license 和 namespace
// run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/474642/%E9%AB%98%E4%BA%AE%E5%9C%B0%E5%9D%80%E6%8C%87%E5%AE%9A%E6%A5%BC%E5%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/474642/%E9%AB%98%E4%BA%AE%E5%9C%B0%E5%9D%80%E6%8C%87%E5%AE%9A%E6%A5%BC%E5%B1%82.meta.js
// ==/UserScript==

// 获取楼层id
const pidMatch = window.location.href.match(/pid(\d+)/)
const pid = pidMatch ? pidMatch[1] : null
if (pid) {
  // 获取需要高亮楼层的地址
  const highlight = document.querySelector(`.plc .pi strong a[id="postnum${pid}"]`)
  // 高亮楼层
  if (highlight) {
    highlight.closest('tbody').style.backgroundColor = 'rgb(255 152 0 / 20%)'
  }
}
