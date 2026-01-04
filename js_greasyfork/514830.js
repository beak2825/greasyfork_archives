// ==UserScript==
// @name 番茄小说阅读界面美化
// @namespace github.com/fengyinxia
// @version 1.0.8.3
// @description 美化番茅小说阅读界面,支持深色模式和字体调整
// @author fengyinxia
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/514830/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/514830/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `/* ================ 基础样式 ================ */
/* 基础样式重置 */
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}

/* ================ 布局结构 ================ */
/* 阅读容器 */
.custom-reader-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f6f4ef;
    z-index: 9999;
    overflow-y: auto;
    padding: 20px;
    transition: all 0.3s ease;
    display: flex;
    position: relative;
}

/* 阅读内容区 */
.custom-reader-content {
    width: 800px;
    margin: 0 auto;
    background: #fff;
    padding: 40px 80px;
    box-shadow: 0 0 20px rgba(0,0,0,0.05);
    border-radius: 8px;
    min-height: calc(100vh - 80px);
    overflow-y: auto;
    max-height: 100vh;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}

/* ================ 文本样式 ================ */
/* 章节标题 */
.custom-chapter-title {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40px;
    color: #333;
}

/* 正文内容 */
.custom-content {
    font-size: 18px;
    line-height: 1.8;
    color: #333;
    font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
    letter-spacing: 0.5px;
}

.custom-content p {
    margin-bottom: 1em;
    text-indent: 2em;
    word-break: break-all;
}

/* ================ 工具栏样式 ================ */
.custom-toolbar {
    position: fixed;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    padding: 15px 10px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    z-index: 10000;
    transition: left 0.3s ease;
}

.custom-toolbar button {
    display: block;
    width: 40px;
    height: 40px;
    margin: 8px 0;
    border: none;
    background: #f4f4f4;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    color: #666;
}

.custom-toolbar button:hover {
    background: #e6e6e6;
    transform: translateX(2px);
}

/* ================ 侧边栏样式 ================ */
.custom-sidebar {
    width: 250px;
    height: 100vh;
    background: #f5f5f5;
    position: fixed;
    left: -250px;
    top: 0;
    transition: left 0.3s;
    border-right: 1px solid #ddd;
    padding: 20px 0;
}

.show-toc .custom-sidebar {
    left: 0;
}

.toc-header {
    font-size: 18px;
    font-weight: bold;
    padding: 0 20px 10px;
    border-bottom: 1px solid #ddd;
}

.toc-content {
    padding: 10px 20px;
    overflow-y: auto;
    height: calc(100% - 50px);
}

/* ================ 目录样式 ================ */
.volume-title {
    padding: 15px 20px 10px;
    font-weight: bold;
    color: #666;
    font-size: 15px;
    background: #f8f8f8;
    border-bottom: 1px solid #eee;
}

.toc-item {
    display: block;
    padding: 12px 20px;
    color: #333;
    text-decoration: none;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.toc-item:hover {
    background: #f5f5f5;
}

.toc-item.active {
    color: #1890ff;
    background: #e6f7ff;
}

/* ================ 滚动条样式 ================ */
::-webkit-scrollbar,
.custom-reader-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track,
.custom-reader-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb,
.custom-reader-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover,
.custom-reader-content::-webkit-scrollbar-thumb:hover {
    background: #555;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
