// ==UserScript==
// @name         强制使用微软雅黑
// @name:en      Force sites to use Microsoft Yahei
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      2.0.1
// @description  我就是喜欢微软雅黑！【解决显示方框问题】
// @description:en Microsoft Yahei is my only love! [Fix square issues]
// @author       BackRunner
// @include      *
// @exclude      *.seedr.cc*
// @exclude      *console.cloud.google.com/cloudshell*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @require      https://greasyfork.org/scripts/29500-%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E5%AD%97%E4%BD%93-%E6%A0%B8%E5%BF%83/code/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E5%AD%97%E4%BD%93%20-%20%E6%A0%B8%E5%BF%83.js
// @downloadURL https://update.greasyfork.org/scripts/24437/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/24437/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91.meta.js
// ==/UserScript==

// ===============
// 遇到显示方框请手动添加排除或反馈
// ===============
(function() {
	changeFont("Microsoft Yahei",2);
})();