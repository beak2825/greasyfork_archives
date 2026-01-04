// ==UserScript==
// @name CSDN 博客文章页面简化
// @description CSDN 博客页面简化脚本，自动展开全文和评论列表，去除无用内容，调整了文章内容样式，调整代码着色风格。
// @run-at document-start
// @version 0.7.0
// @namespace Violentmonkey Scripts
// @match https://blog.csdn.net/*/article/details/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/374820/CSDN%20%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/374820/CSDN%20%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = 'text/css';
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

addCss(`
.recommend-right {
    display: none;
}

.recommend-box {
    display: none;
}

.comment-list-container .comment-list-box {
  max-height: initial !important;
}

.comment-list-container .opt-box {
  display: none !important;
}

aside {
    float: none;
    width: 100%;
    max-width: 860px;
    margin: 0px auto;
    position: static !important;
}

main {
    width: 100% !important;
    float: none;
    max-width: 860px;
    margin: 2rem auto 1rem auto;
}

p > span[style] {
    font-family: inherit !important;
    font-size: inherit !important;
}

.pulllog-box {
    display: none !important;
}

#article_content {
  height: auto !important;
  overflow: visible !important;
}

.tool-box,
.login-mark,
#passportbox,
.hide-article-box,
#asideNewArticle,
#asideColumn,
#asideCategory,
#asideArchive,
#asideHotArticle,
#asideNewComments,
#asideFooter,
#csdn-toolbar li a[title="活动"],
#csdn-toolbar li a[title="商城"],
#csdn-toolbar li a[title="APP"],
#csdn-toolbar li a[title="学院"],
#csdn-toolbar li a[title="VIP会员"] {
    display: none;
}
`);

document.addEventListener('DOMContentLoaded', function () {
  // 有些用户会无脑加粗一长段文本，影响阅读体验，所以把这些文本改用 p 标签呈现
  document.querySelectorAll('h2,h3').forEach(function (el) {
    var p;

    if (el.textContent.length > 32) {
      p = document.createElement('p');
      p.textContent = el.textContent;
      el.parentNode.insertBefore(p, el);
      el.parentNode.removeChild(el);
    }
  });
  
  // 暗色风格的代码着色看起来有点费劲，所以改用亮一点的风格
  document.querySelectorAll('link').forEach(function (link) {
    var href = link.attributes.href;

    if (href && href.value.indexOf('atom-one-dark.css') > 0) {
      href.value = href.value.replace('atom-one-dark.css', 'github.css');
    }
  })
}, false);
