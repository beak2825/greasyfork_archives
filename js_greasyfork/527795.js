// ==UserScript==
// @name         Blogger HTML Editor Code Prettify 添加器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 Blogger 背景HTML 编辑器中添加代码美化功能
// @author       moran：http://blog.7998888.xyz/
// @match        https://www.blogger.com/blog/themes/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527795/Blogger%20HTML%20Editor%20Code%20Prettify%20%E6%B7%BB%E5%8A%A0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/527795/Blogger%20HTML%20Editor%20Code%20Prettify%20%E6%B7%BB%E5%8A%A0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮，用于插入代码
    const button = document.createElement('button');
    button.textContent = '插入 Code Prettify';
    button.style.position = 'fixed';
    button.style.top = '50px';  // 调整到顶部50px
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#2196F3';  // 改为蓝色
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    // 要插入的 HTML 代码
    const codeToInsert = `<!-- Code Prettify Resources -->
<script src='https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js'></script>
<link href='https://cdn.jsdelivr.net/gh/google/code-prettify@master/styles/sunburst.css' rel='stylesheet' />
<style type='text/css'>
.copy-code-button {
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  font-size: 12px;
  margin: 5px 0 0;
  padding: 3px 8px;
  position: absolute;
  right: 10px;
  top: 10px;
}
.copy-code-button:hover {
  background-color: #ddd;
}
.prettyprint {
  position: relative;
  padding: 20px 10px 10px;
}</style>`;

    const scriptToInsert = `<script>
document.addEventListener('DOMContentLoaded', function() {
  var prettyPrintBlocks = document.querySelectorAll('.prettyprint');
  prettyPrintBlocks.forEach(function(block) {
    // 为每个代码块添加复制按钮
    var copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.textContent = '复制代码';
    block.appendChild(copyButton);
  });

  var copyButtons = document.querySelectorAll('.prettyprint .copy-code-button');
  copyButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var codeBlock = this.parentNode.querySelector('code');
      var codeText = codeBlock.textContent;
      
      var textarea = document.createElement('textarea');
      textarea.value = codeText;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      var originalText = this.textContent;
      this.textContent = '已复制!';
      
      setTimeout(function() {
        button.textContent = originalText;
      }, 2000);
    });
  });
});</script>`;

    // 监听HTML编辑器的出现
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (document.querySelector('.CodeMirror')) {
                observer.disconnect();
                document.body.appendChild(button);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 按钮点击事件
    button.addEventListener('click', function() {
        const editor = document.querySelector('.CodeMirror').CodeMirror;
        if (editor) {
            const currentContent = editor.getValue();
            
            // 检查是否已经插入了代码
            if (currentContent.includes('code-prettify@master')) {
                alert('代码已经插入过了！');
                return;
            }

            // 找到合适的插入位置
            let headStart = currentContent.indexOf('<head>');
            let headEnd = currentContent.indexOf('</head>');
            
            if (headStart === -1 || headEnd === -1) {
                alert('未找到 head 标签，请检查 HTML 结构');
                return;
            }
            
            // 在head标签内的最后插入代码
            let newContent = currentContent.slice(0, headEnd) + 
                           '\n' + codeToInsert + '\n' +
                           currentContent.slice(headEnd);
            
            // 在</body>前插入复制功能脚本
            newContent = newContent.replace('</body>', scriptToInsert + '\n</body>');
            
            // 更新编辑器内容
            editor.setValue(newContent);
            
            // 提示成功
            alert('代码已成功插入！');
        } else {
            alert('未找到编辑器！请确保你在HTML编辑模式。');
        }
    });
})();