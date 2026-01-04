// ==UserScript==
// @name         Unicode字符串转中文
// @version      1.5
// @author       ChatGPT
// @description  将网页中所有的Unicode字符串替换为中文（长按页面3秒，左下角点击开关进行转换/恢复）
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @namespace    原作者https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/521124/Unicode%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BD%AC%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/521124/Unicode%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BD%AC%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建悬浮按钮
  var button = document.createElement('button');
  button.innerHTML = '转换 Unicode';
  button.style.position = 'fixed';
  button.style.bottom = '30px';
  button.style.left = '10px';
  button.style.padding = '10px 20px';
  button.style.fontSize = '14px';
  button.style.backgroundColor = '#008CBA';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';
  button.style.display = 'none';  // 初始隐藏按钮

  // 追加按钮到页面
  document.body.appendChild(button);

  // 创建一个标志，表示是否已转换
  var isConverted = false;

  // 保存页面的原始文本内容（每个转换前的节点内容）
  var originalTexts = [];

  // 绑定点击事件，触发转换
  button.addEventListener('click', function() {
    if (isConverted) {
      restoreOriginalText();
      button.innerHTML = '转换 Unicode';
      isConverted = false;
    } else {
      replaceUnicodeWithChinese();
      button.innerHTML = '恢复 Unicode';
      isConverted = true;
    }
  });

  // 监听长按事件，在用户长按屏幕时显示按钮
  var pressTimer;
  document.addEventListener('touchstart', function(e) {
    pressTimer = setTimeout(function() {
      button.style.display = 'block';  // 显示按钮
    }, 3000);  // 3秒长按后显示按钮
  });

  document.addEventListener('touchend', function(e) {
    clearTimeout(pressTimer);  // 如果用户在1秒内松开，取消显示按钮
  });

  function replaceUnicodeWithChinese() {
    var elements = document.getElementsByTagName('*');
    originalTexts = [];

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var nodes = element.childNodes;

      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];

        if (node.nodeType === Node.TEXT_NODE) {
          var text = node.nodeValue;

          if (text.includes("\\u")) {
            var replacedText = text.replace(/\\u([\d\w]{4})/gi, function(match, grp) {
              return String.fromCharCode(parseInt(grp, 16));
            });

            if (replacedText !== text) {
              originalTexts.push({ node: node, originalText: text });
              node.nodeValue = replacedText;
            }
          }
        }
      }
    }
  }

  function restoreOriginalText() {
    for (var i = 0; i < originalTexts.length; i++) {
      var data = originalTexts[i];
      data.node.nodeValue = data.originalText;
    }
    originalTexts = [];
  }
})();
