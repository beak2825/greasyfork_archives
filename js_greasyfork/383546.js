// ==UserScript==
// @name 借您妈一件复活甲
// @description 借给被拉黑的楼主一件复活甲，让他的亲妈短暂复活，让一楼内容临时显示。
// @namespace you-are-family
// @match *://bbs.saraba1st.com/2b/thread-*
// @grant none
// @run-at document-end
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/383546/%E5%80%9F%E6%82%A8%E5%A6%88%E4%B8%80%E4%BB%B6%E5%A4%8D%E6%B4%BB%E7%94%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/383546/%E5%80%9F%E6%82%A8%E5%A6%88%E4%B8%80%E4%BB%B6%E5%A4%8D%E6%B4%BB%E7%94%B2.meta.js
// ==/UserScript==

if (document.querySelector('[id^=postnum]').textContent.trim() === '楼主') {
  document.querySelector('#postlist > [id^=post_]').style.display = 'inherit';
}