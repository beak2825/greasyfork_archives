// ==UserScript==
// @name         沈阳理工大学教务系统自动评价
// @namespace    https://github.com/fzf404/tools
// @version      0.1.3
// @description  用于自动完成教师评价，只适配了沈阳理工大学教务系统。
// @author       fzf404
// @homepage     https://tools.fzf404.art/script
// @match        https://jxw.sylu.edu.cn/xspjgl/xspj_cxXspjIndex.html*
// @icon         https://www.sylu.edu.cn/images/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457210/%E6%B2%88%E9%98%B3%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/457210/%E6%B2%88%E9%98%B3%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

setTimeout(alert('请自行点击下方的提交按钮！'), 500)

setInterval(
  () => document.querySelectorAll('.input-xspj:nth-child(1) input').forEach((element) => element.click()),
  1000
)
