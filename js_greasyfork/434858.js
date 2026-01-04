// ==UserScript==
// @name 滚动条,字体
// @description 自定义滚动条,编码字体"Cascadia Code",  "Microsoft YaHei", emoji;
// @author Dawn
// @version 0.1.1
// @match *://*/*
// @run-at document-start
// @namespace https://greasyfork.org/users/714473
// @downloadURL https://update.greasyfork.org/scripts/434858/%E6%BB%9A%E5%8A%A8%E6%9D%A1%2C%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/434858/%E6%BB%9A%E5%8A%A8%E6%9D%A1%2C%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function () {
  let css = `
  ::-webkit-scrollbar {width: 6px; height: 6px; }
  ::-webkit-scrollbar-track {width: 6px; background: rgba(123,123,123, 0.1); -webkit-border-radius: 2em; -moz-border-radius: 2em; border-radius: 2em; }
  ::-webkit-scrollbar-thumb {background-color: rgba(123,123,123, 0.5); background-clip: padding-box; min-height: 28px; -webkit-border-radius: 2em; -moz-border-radius: 2em; border-radius: 2em; }
  ::-webkit-scrollbar-thumb:hover {background-color: rgba(123,123,123, 1); }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body *{
    font-family:"Cascadia Code",  "Microsoft YaHei", emoji!important;
  }
  `

  let styleNode = document.createElement("style")
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector("head") || document.documentElement).appendChild(styleNode)
})()