// ==UserScript==
// @name 让新窗口打开都去见鬼(强制所有链接在当前页打开)
// @namespace undefined
// @version 0.1
// @description 强制所有链接在本标签页打开，禁止新窗口打开页面
// @match https://*/*
// @match http://*/*
// @grant none
// @author JiGuang
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/435736/%E8%AE%A9%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E9%83%BD%E5%8E%BB%E8%A7%81%E9%AC%BC%28%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435736/%E8%AE%A9%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E9%83%BD%E5%8E%BB%E8%A7%81%E9%AC%BC%28%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80%29.meta.js
// ==/UserScript==
document.body.addEventListener('mousedown', function (e) {
	e.target.target = '_self';
    e.target.parentNode.target='_self';
	e.target.parentNode.parentNode.target='_self';
	e.target.parentNode.parentNode.parentNode.target='_self';
	e.target.parentNode.parentNode.parentNode.parentNode.target='_self';
})
console.log('【旧标签页打开】已经运行成功');