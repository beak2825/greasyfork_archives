// ==UserScript==
// @name 电子科大信软学院 - 修正附件下载文件名
// @description 让电子科大信软学院网站里的附件在下载时显示正确的文件名
// @version 4
// @match http://www.is.uestc.edu.cn/news.do
// @match http://www.is.uestc.edu.cn/notice.do
// @grant none
// @supportURL https://github.com/whtsky/userscripts/issues
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/382337/%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E4%BF%A1%E8%BD%AF%E5%AD%A6%E9%99%A2%20-%20%E4%BF%AE%E6%AD%A3%E9%99%84%E4%BB%B6%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/382337/%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E4%BF%A1%E8%BD%AF%E5%AD%A6%E9%99%A2%20-%20%E4%BF%AE%E6%AD%A3%E9%99%84%E4%BB%B6%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==

const attachmentRe = /附件\d+[-：](.+)$/

document.querySelectorAll('.text a').forEach(anchor => {
  const match = anchor.innerText.match(attachmentRe)
  if (match) {
    anchor.download = match.pop().trim()
  }
})
