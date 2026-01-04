// ==UserScript==
// @name        i The Old Reader
// @namespace   https://greasyfork.org/users/756764
// @version     2025.3.13
// @author      ivysrono
// @license     MIT
// @description 优化 TheOldReader
// @match       *://theoldreader.com/*
// @grant       GM.addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424771/i%20The%20Old%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/424771/i%20The%20Old%20Reader.meta.js
// ==/UserScript==

const reader_pane_observer = new MutationObserver(() => {
  const articles = document.querySelectorAll('.posts > div[id^="postca"]');
  for (let article of articles) {
    const hue = 120 * article.querySelector('.name > .label').textContent.length;
    if (article.className.includes(' unread')) {
      article.querySelector(
        'div[data-list-toggle=".list-post"]'
      ).style.cssText = `background-color: hsla(${hue}, 70%, 80%, 0.6) !important;`;
    } else {
      article.querySelector(
        'div[data-list-toggle=".list-post"]'
      ).style.cssText = `background-color: hsla(${hue}, 70%, 80%, 0.3) !important;`;
    }
  }
});
reader_pane_observer.observe(document, {
  childList: true,
  subtree: true,
});

const css = `

/**
 * 2021.7.31
 * 官方加入了隔条样式
 * 一条 .dm-post-0 保持原样
 * 一条 .dm-post-1 有模糊背景色
 * */
.dm-post-1 {background-color: inherit !important;}

/* 正文 部分固定行间距导致字符重叠 */
.posts .content-body p {line-height: inherit !important;}

/* The Old Reader 官方新闻写死正文行高 18px */
.posts .content-body > p {line-height: inherit !important;}

/* 图片换行显示，去除默认环绕 */
.responsive-img-wrapper {display: flex !important;}

/* 标题 */
.posts .list-header > strong {font-size: x-large !important;}

/* 摘要 */
.posts .list-header > span {font-size: large !important;}

/* 正文 官方的放大字号设置需要包在 <p> 标签中 */
.posts .content-body {font-size: x-large !important;}

/* 转发内容字号稍小些 */
blockquote, blockquote > p {font-size: large !important;}

/* blogspot(电脑玩物)开头空白区域 */
.content-body > .responsive-embed-wrapper {display: none !important;}
`;

GM.addStyle(css);
