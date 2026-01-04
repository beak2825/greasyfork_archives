// ==UserScript==
// @name 知乎手机阅读1
// @namespace h-style-hh22
// @version 1.0.2
// @description 知乎手机阅读68
// @author h
// @grant GM_addStyle
// @run-at document-start
// @match *://*.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/492486/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E9%98%85%E8%AF%BB1.user.js
// @updateURL https://update.greasyfork.org/scripts/492486/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E9%98%85%E8%AF%BB1.meta.js
// ==/UserScript==

(function() {
let css = `
 
html > body {
    //font-weight: lighter;
}
 
div.AppHeader-inner > a,
div.css-nxq4uo > a {
    display: none ;
}
 
div.ContentItem-actions {
    //background-color: #111; 
    padding: 0;
    margin-top: 10px;
}
 
html,
body,
div.Post-content {
    //background: black;
    //color: #887;
    margin: 0;
    min-width: unset;
    max-width: 100vw;
}

 
.Modal-wrapper1,
div.Recommendations-Main,
div.ColumnPageHeader-Button,
div.ColumnPageHeader-profile,
div.signQr-leftContainer,
div.css-1ynzxqw {
    display: none ;
}
 
:root,
html {
    overflow: auto !important;
}
 
 
div.Post-RichTextContainer {
    width: 90vw;
    font-size: 20px;
    margin-left: 1em;
}
 
div.ColumnPageHeader-content{
 
}
 
header.Post-Header,
div.Post-NormalMain.Post-Header
div.css-78p1r9{
    margin: 0;
    max-width: calc(98vw - 1em);
}
 
.Button.css-1x9te0t,
button.Modal-closeButton {
    top: revert;
    left: 3em;
    bottom: -3em;
}
 
div.Post-NormalMain .Post-Header,
div.Post-NormalMain>div, 
div.Post-NormalSub>div {
    margin-left: 1em;
    width: 95vw;
}
 
div.css-1cqr2ue {
    width: 95vw;
    height: calc(100vh - 280px);
}
 
div.signFlowModal {
    height: 300px;
}

/* ------------- 知乎首页  */
 
div.Topstory-container {
  padding: 0;
}
div.Topstory-mainColumn {
  max-width: 100vw;
}

 
div.Card.TopstoryItem.TopstoryItem-isFollow {
  border-bottom: 1px solid #333;
  padding: 8px;
}

 
.AnswerItem div.RichContent-inner,
.TopstoryItem div.RichContent-inner {
  font-size: 20px;
}
 
div.Reward,
div.TopstoryItem--advertCard {
  display: none;
}
 
/***************** 问题页 */
 

div.Question-mainColumn,
div.QuestionHeader-main {
  max-width: 100vw;
}
 
div.Question-main {
  padding: 10px;
}
 
div.ContentItem-time {
    font-size: 16px;
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
