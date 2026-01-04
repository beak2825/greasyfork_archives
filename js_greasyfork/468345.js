// ==UserScript==
// @name         Douban_Monkey
// @name:cn      豆瓣猴
// @namespace    http://tampermonkey.net/
// @version      0.0.52
// @description  douban beautify css injection script
// @author       Sherlock-V
// @match        https://douban.com
// @match        https://*.douban.com/*
// @icon         https://www.douban.com/favicon.ico
// @grant        GM_addStyle
// @supportURL   https://github.com/Ziyueqi-V/Douban_Monkey/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468345/Douban_Monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/468345/Douban_Monkey.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // Your code here...
  const vistopiaCSS = `
  body {
  line-height: 2 !important;
}

.notify-mod,
#db-nav-sns {
  background: #1f1f1f;
}

.base-selector.expand .base-selector-title,
.base-selector-title:hover,
.nav-search .inp.inp input,
.error-highlighter,
textarea {
  background-color: #141414;
  color: rgba(255, 255, 255, 0.65);
}

.meta-header,
.gradient.blue.drc-label,
.gradient.blue.drc-label:active,
.gradient.blue.drc-label:hover,
.gradient.blue.drc-label:link,
.gradient.blue.drc-label:visited,
.gradient.drc-button.blue,
.gradient.drc-button.blue:active,
.gradient.drc-button.blue:hover,
.gradient.drc-button.blue:link,
.gradient.drc-button.blue:visited,
.secondary.blue.drc-label,
.secondary.blue.drc-label:active,
.secondary.blue.drc-label:hover,
.secondary.blue.drc-label:link,
.secondary.blue.drc-label:visited,
.secondary.drc-button.blue,
.secondary.drc-button.blue:active,
.secondary.drc-button.blue:hover,
.secondary.drc-button.blue:link,
.secondary.drc-button.blue:visited,
.expand-card,
.explore-sticky,
#db-nav-movie#db-nav-movie,
.comment-item .author,
.status-item .block,
.nlst,
.nlst h3,
.bg-img-green h4,
.gray_ad,
.list-comm .list-comm .comm-mod.comm-mod,
html {
  background: #121212;
}

.review-list .review-item .main-bd .action .action-btn.action-btn {
  background-color: rgba(240, 247, 249, 0.1294117647);
}

h1,
#content h2 {
  color: rgba(255, 255, 255, 0.85);
}

.explore-uncollect-filter,
.rich-content.rich-content p,
.review-content.review-content p,
.rich-content.rich-content section,
.review-content.review-content section,
.rich-content.rich-content article,
.review-content article,
.rich-content.rich-content blockquote,
.review-content blockquote,
.gaia.gaia-lite .fliter-wp h2 .activate,
.gaia.gaia-lite .tags label.activate:hover,
.rich-content.rich-content p,
.post-content p,
.rich-content.rich-content blockquote,
.post-content blockquote,
.rich-content.rich-content h4,
.topic-richtext h4,
.rich-content.rich-content h3,
.topic-richtext h3,
.rich-content.rich-content h2,
.topic-richtext h2,
.rich-content.rich-content p,
.topic-richtext p,
.rich-content.rich-content blockquote,
.topic-richtext blockquote,
.sidebar-info-wrapper .info-item .info-item-val.info-item-val,
#wrapper#wrapper,
.ep-info li span.all,
.comments-app-wrapper.comments-app-wrapper,
.blockquote-list.blockquote-list figure,
.note.note p,
html {
  color: rgba(255, 255, 255, 0.65);
}

.author-info .author-link .verify.verify,
.drc-subject-info-subtitle,
.gaia.gaia-lite .tags label {
  color: rgba(255, 255, 255, 0.45);
}

.bg-img-green {
  background: rgb(60, 78, 18);
}

#db-isay label {
  color: rgba(255, 255, 255, 0.3);
}

#db-nav-movie .nav-wrap {
  border-color: #141414;
}

.episode_list a:link,
.episode_list a:visited,
.episode_list a:hover,
.form-input-wrapper {
  border: 1px solid #258dcd;
}

.comm-mod,
.top-tab.tabs,
.main-panel-useful,
.review {
  border-bottom: 1px solid #258dcd;
}

#interest_sectl {
  border-left: 1px solid #258dcd;
}

.rating_wrap {
  border-top: none;
}

#subject-doulist li {
  border-bottom: 1px dashed #007722;
}

#subject-doulist ul {
  border-top: 1px dashed #007722;
}

.lnk-doulist-add i {
  background: none !important;
}

.nav-search .inp {
  background-image: none;
}

#celebrities .celebrities-list .info span.name.name a {
  color: rgba(255, 255, 255, 0.45);
}

.nav-search .inp {
  background-image: none !important;
}
.nav-search .inp input {
  color: rgba(255, 255, 255, 0.65);
}

.op-lnks a.comment-source {
  color: rgba(255, 255, 255, 0.3);
}

.item .title.title {
  background: none rgba(240, 247, 249, 0.1294117647);
}

.main .review-content.review-content,
.review-content.review-content p {
  font-size: 18px;
  line-height: 2;
}

#dialog {
  background-color: #1f1f1f;
}
#dialog textarea.comment {
  background: #141414;
}
#dialog textarea {
  height: 150px;
}
  `;
  GM_addStyle(vistopiaCSS);

  const style = document.createElement('style')
  const hides = [
    // 评论来源
    '.comment-source',
    // 正在热映
    '#screening',
    // 热门推荐
    '#gallery-frames',
    // 侧边栏：在哪看
    '#content div.aside > div.gray_ad',
    // 侧边栏上部广告
    '#dale_movie_subject_top_right',
    // 侧边栏中部广告
    '#dale_movie_subject_inner_middle',
    // 侧边栏榜单, 电影榜单
    '#billboard',
    // 畅销图书榜
    '.section.weekly-top',
    // "联系我们"
    '#content div.aside div.contact',
    '#content > div > div.aside > div.contact.mod',
    '#content > div > div.aside > div.rating_answer',
    '#contact-and-cooperation',
    '#doulist',

  ].filter(Boolean)

  style.innerHTML = [
    `${hides.join(',')}{ display: none !important; }`,
  ].join('')

  document.body.appendChild(style)
})();