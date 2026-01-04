// ==UserScript==
// @name         给本地文件添加行号
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  用于给本地代码文件添加行号，如果存在行号锚点，转到此位置并高亮
// @author       qiuchi
// @match       file:///*.java
// @match       file:///*.cpp
// @match       file:///*.c
// @match       file:///*.py
// @match       file:///*.cc
// @match       file:///*.hpp
// @match       file:///*.h
// @match       file:///*.cxx
// @match       file:///*.cpp


// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467054/%E7%BB%99%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E8%A1%8C%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/467054/%E7%BB%99%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E8%A1%8C%E5%8F%B7.meta.js
// ==/UserScript==

function escapeHtml(string) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  return String(string).replace(/[&<>"'/]/g, function (s) {
    return entityMap[s];
  });
}


(function() {
    'use strict';

    // 创建样式元素并将 CSS 规则添加到其中
    var styleElement = document.createElement('style');
    styleElement.innerHTML = `
    pre {
      padding: 0;
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    pre code {
      display: inline-block;
      position: relative;
    }
    .codeNumber {
      display: inline-block;
      user-select: none;
      text-align: right;
      top: 0;
      width: 30px;
      padding-right: 30px;
      color: gray;
    }
    `;
    document.head.appendChild(styleElement);

    // 获取所有<pre>标签
    var codeBlocks = document.getElementsByTagName("pre");

    // 遍历所有<pre>标签
    for (var i = 0; i < codeBlocks.length; i++) {
        var codeBlock = codeBlocks[i];

        // 获取代码块的文本内容
        var code = codeBlock.textContent;

        // 将代码按行分割
        var lines = code.split("\n");

        // 为每行代码添加行号
        var numberedCode = "";
        for (var j = 0; j < lines.length; j++) {
            var escapedLine = escapeHtml(lines[j]);
            var lineNumber = j + 1;
            numberedCode += "<span id='line-" + lineNumber + "'><span class= 'codeNumber'>"+lineNumber+"</span><code>" + escapedLine + "</code>\n</span>";
        }

        // 替换原始代码块的内容为带行号的代码
        codeBlock.innerHTML = numberedCode;
    }

    // 获取 URL 中的锚点
    var hash = window.location.hash;

    // 检查是否存在锚点
    if (hash) {
        // 去除锚点中的 #
        var targetNumber = hash.substring(1);

        // 设置页面滚动到指定行
        var targetElement = document.getElementById("line-" + targetNumber);
        if (targetElement) {
            targetElement.scrollIntoView();
            targetElement.style.backgroundColor = "yellow"; // 添加高亮样式
        }
    }
})();