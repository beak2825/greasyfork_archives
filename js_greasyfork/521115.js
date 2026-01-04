// ==UserScript==
// @name         Stage1st/Saraba1st 查成分脚本
// @namespace    https://bbs.saraba1st.com/
// @version      1.1
// @description  要查什么成分自己加。只查回复第一页要不然太卡了。
// @author       YourName
// @match        https://bbs.saraba1st.com/2b/thread-*.html
// @match       https://bbs.saraba1st.com/2b/forum.php?mod=viewthread&tid=*
// @grant        GM_xmlhttpRequest
// @connect      bbs.saraba1st.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521115/Stage1stSaraba1st%20%E6%9F%A5%E6%88%90%E5%88%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521115/Stage1stSaraba1st%20%E6%9F%A5%E6%88%90%E5%88%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 定义字典，key 是 ptid，value 是标注内容
  const ptidDict = {
    2209276: '高达',
    2210399:'百综',
    2210855:  '台长',
    2123779:  '水魔',
    2208921:  '鸡楼',
    2073604:  '推子',
    2208921:  '鸡楼',
    2050404:  '哭友',
    2159415:  '狗楼',
    2130897:  '爱马仕',
    2125702:  '蛰灵',
    // 可以在这里添加更多的 ptid 和对应的标注
    // 例如: 123456: '成分A',
  };

  // 遍历页面中的用户信息
  document.querySelectorAll('.authi a.xw1').forEach((userLink) => {
    const userName = userLink.textContent.trim(); // 用户名
    const userSpaceUrl = userLink.href; // 用户个人主页链接
    const uidMatch = userSpaceUrl.match(/uid-(\d+)\.html/);

    if (uidMatch) {
      const userId = uidMatch[1]; // 提取用户 ID

      // 构造用户回复列表页面的 URL
      const replyListUrl = `https://bbs.saraba1st.com/2b/home.php?mod=space&uid=${userId}&do=thread&view=me&from=space&type=reply`;

      // 使用 GM_xmlhttpRequest 异步请求用户的回复列表页面
      GM_xmlhttpRequest({
        method: 'GET',
        url: replyListUrl,
        onload: function (response) {
          if (response.status === 200) {
            const replyPageHtml = response.responseText;

            // 创建一个 DOMParser 来解析返回的 HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(replyPageHtml, 'text/html');

            // 查找回复列表中的帖子链接，提取 ptid
            const postLinks = doc.querySelectorAll('th a[href*="forum.php?mod=redirect"]');
            postLinks.forEach((link) => {
              const ptidMatch = link.href.match(/ptid=(\d+)/);
              if (ptidMatch) {
                const ptid = ptidMatch[1];

                // 检查 ptid 是否在字典中
                if (ptidDict[ptid]) {
                  // 在用户名后添加标注
                  userLink.textContent += `: ${ptidDict[ptid]}`;
                }
              }
            });
          }
        },
        onerror: function (error) {
          console.error('请求用户回复列表页面失败：', error);
        },
      });
    }
  });
})();
