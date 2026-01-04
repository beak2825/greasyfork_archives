// ==UserScript==
// @name         ZL防网站限制
// @namespace    http://nb.china.com/
// @version      v1.0.0-2024-04-06
// @description  解除网站的各种限制，如复制、粘贴、右键等等。
// @author       执念初心
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/491797/ZL%E9%98%B2%E7%BD%91%E7%AB%99%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491797/ZL%E9%98%B2%E7%BD%91%E7%AB%99%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
  // 移除复制限制
  document.addEventListener('copy', function(e) {
    e.stopImmediatePropagation();
  }, true);

  // 移除粘贴限制
  document.addEventListener('paste', function(e) {
    e.stopImmediatePropagation();
  });

  // 移除剪切限制
  document.addEventListener('cut', function(e) {
    e.stopImmediatePropagation();
  });

  // 移除右键菜单的限制
  document.addEventListener('contextmenu', function(e) {
    e.stopImmediatePropagation();
  });

  // 移除选择文本的限制
  document.addEventListener('selectstart', function(e) {
    e.stopImmediatePropagation();
  });

  // 移除CSS用户选择限制
  var styleElements = document.querySelectorAll('style, [style]');
  styleElements.forEach(function(styleElement) {
    if (styleElement.textContent.includes('user-select: none')) {
      styleElement.textContent = styleElement.textContent.replace(/user-select: none;/gi, 'user-select: text;');
    }
  });

  // 针对内联样式的处理
  var elementsWithInlineStyle = document.querySelectorAll('[style]');
  elementsWithInlineStyle.forEach(function(element) {
    var inlineStyle = element.getAttribute('style');
    if (inlineStyle.includes('user-select: none')) {
      element.setAttribute('style', inlineStyle.replace(/user-select: none;/gi, 'user-select: text;'));
    }
  });

  // 移除body标签上的默认限制
  document.body.removeAttribute('oncopy');
  document.body.removeAttribute('onselectstart');
  document.body.removeAttribute('oncontextmenu');

  // 移除document上的默认限制
  document.removeEventListener('copy', null);
  document.removeEventListener('paste', null);
  document.removeEventListener('cut', null);
  document.removeEventListener('contextmenu', null);
  document.removeEventListener('selectstart', null);

  // 尝试使用主动设置的方式来允许粘贴
  document.execCommand('copy');
  document.execCommand('paste');

  // 移除开发者选项限制
  document.documentElement.removeAttribute('ondeviceready');
  document.documentElement.removeAttribute('onoffline');
  document.documentElement.removeAttribute('ononline');
  document.documentElement.removeAttribute('onpagehide');
  document.documentElement.removeAttribute('onpageshow');
  document.documentElement.removeAttribute('onpause');
  document.documentElement.removeAttribute('onresume');
  document.documentElement.removeAttribute('onvisibilitychange');

  // 解除F12调试器限制
    (function() {
        document.onkeydown = function (event) {
      if (event.keyCode == 123) { // F12键的键码为123
        return false;
    }
  };
    })();


})();