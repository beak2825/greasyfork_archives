// ==UserScript==
// @name         知乎简洁版
// @author       74sharlock
// @namespace    none
// @version      0.0.5
// @description  知乎简洁版!
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376200/%E7%9F%A5%E4%B9%8E%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/376200/%E7%9F%A5%E4%B9%8E%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.type = "text/css";
    style.innerHTML = `.QuestionHeader{min-width: initial; }.TopstoryPageHeader {    width: initial; padding: 0 16px;}
.AppHeader-inner{width: initial;}
.Topstory-container,.Question-main{padding: 0;}
.AppHeader { min-width: initial; }
.GlobalSideBar,
.Question-sideColumn {
display: none !important;
}
.Topstory-container,
.Topstory-mainColumn,
.Question-mainColumn,
.Question-main {
width: 100% !important;
}
.RichText-video {
display: flex;
justify-content: center;
}
.VideoCard {
width: 800px;
}
.ArticleItem-image {
 max-width: 800px;
}
.Topstory-mainColumn .Card.TopstoryItem--advertCard {
display: none;
}
.QuestionHeader-content {
width: initial;
}`;
    document.head.appendChild(style);
})();