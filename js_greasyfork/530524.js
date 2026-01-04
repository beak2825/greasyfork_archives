// ==UserScript==
// @name		关闭spine动画
// @namespace	        https://greasyfork.org/zh-CN/scripts/530524
// @version		0.1.1
// @description	        close spine
// @author		f59375443
// @match               *://*/*
// @license		MIT
// @grant		none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/530524/%E5%85%B3%E9%97%ADspine%E5%8A%A8%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/530524/%E5%85%B3%E9%97%ADspine%E5%8A%A8%E7%94%BB.meta.js
// ==/UserScript==
 


// 拦截Spine的初始化方法（例如 spine-core.js）
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
  if (tagName.toLowerCase() === 'canvas') {
    const canvas = originalCreateElement.call(document, tagName);
    Object.defineProperty(canvas, 'getContext', {
      value: () => null // 禁用Canvas渲染
    });
    return canvas;
  }
  return originalCreateElement.call(document, tagName);
};