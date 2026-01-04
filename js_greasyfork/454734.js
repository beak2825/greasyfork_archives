// ==UserScript==
// @name 知乎手机阅读2
// @namespace h-style-hh22
// @version 1.2.23
// @description 知乎手机阅读22
// @author h
// @grant GM_addStyle
// @run-at document-start
// @match *://*.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/454734/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E9%98%85%E8%AF%BB2.user.js
// @updateURL https://update.greasyfork.org/scripts/454734/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E9%98%85%E8%AF%BB2.meta.js
// ==/UserScript==

(function() {
let css = `


// 问题列表

// app header
ul.AppHeader-Tabs { 
	/* 这个css 有防护，display: none 会导致样式删除 */
}

ul.AppHeader-Tabs>.Tabs-item {
	display: none;
}

div.SearchBar {
	display: none;
}

header.AppHeader,
div.AppHeader-inner {
	min-width: unset !important;
}

// 右边栏
div.Topstory-mainColumn + div {
	/* 这个css 有防护，任何样式都无效 */
	width: 10px;
	display: none;
}

// 问题页时间线
div.Topstory-container,
div.Topstory-mainColumn {
	width: unset;
}

#TopstoryContent {
	width: 95vw;
	max-width: 40em;
}

.ContentItem-actions .VoteButton {
	font-size: 10px;
	line-height: unset !important;
	padding: 0.2em 1em !important;
}

.ContentItem-actions .ContentItem-action {
	font-size: 10px;
	margin-left: 1em;
}


.Question-mainColumn {
	max-width: 40em;
}
.Comments-container {
	min-width: 40em;	
}

// 问题页
div.ztext.AuthorInfo-badgeText {
	width: unset;
}

div.Question-main {
	width: unset;
}
div.ListShortcut {
	margin-right: 1em;
}
.QuestionHeader-main {
	width: 90vw;
    max-width: 36em;
}
.QuestionHeader-footer-main {
	font-size: 10px;
	padding-left: 0;
}
.QuestionHeader-footer-main .Button {
	font-size: 10px;
    line-height: unset;
    padding: 3px 6px;
    min-width: unset;
}

// 评论弹窗
div.css-1aq8hf9 {
	width: 95vw;
}
.Button.css-169m58j {
	background: #555;
    right: 47%;
    padding: 2px;
}


`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
