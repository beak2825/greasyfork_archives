// ==UserScript==
// @name         快速打开百度网盘分享链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过选中的文字快速打开百度网盘链接和提取码
// @author       蜻蜓
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491271/%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/491271/%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
var altKeyDown = false;

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 18) {
    // Alt 键按下
    altKeyDown = true;
  } else if (event.keyCode === 86 && altKeyDown) {
    // v 键按下且 Alt 键已按下
    // 用户按下了 Alt+v 键
    altKeyDown = false;
    // 执行操作
            let text = window.getSelection().toString();
            if (text) {
                let linkMatch = text.match(/\s*(https:\/\/pan\.baidu\.com\/s\/[a-zA-Z0-9-_]+)/);
                let codeMatch = text.match(/\s*提取码:?\s*([a-zA-Z0-9]{4})/); // 确保“提取码”和代码匹配更加准确
                if (linkMatch && codeMatch) {
                    let newUrl = `${linkMatch[1]}?pwd=${codeMatch[1]}`;
                    //window.open(newUrl, '_blank');
                    function openLinkInNewTab(url) {
                        var a = document.createElement('a');
                        a.href = url;
                        a.target = '_blank';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                    openLinkInNewTab(newUrl)
                } else {
                    console.log("无法解析链接或提取码，请确认选中的文本格式正确。");
                }
            }
  }
});

document.addEventListener('keyup', function(event) {
  if (event.keyCode === 18) {
    // Alt 键松开
    altKeyDown = false;
  }
});


})();
