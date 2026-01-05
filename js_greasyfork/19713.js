// ==UserScript==
// @name           移除Google的搜索结果重定向，包括其图片搜索
// @namespace      google.com.xinggsf
// @description    Remove all link redirection on Google Search Results,and Google image Search!
// @homepageURL    https://greasyfork.org/scripts/19713
// @include        https://www.google.*
// @include        https://prism-kangaroo.glitch.me/search?*
// @grant          none
// @version        2019.11.11
// @downloadURL https://update.greasyfork.org/scripts/19713/%E7%A7%BB%E9%99%A4Google%E7%9A%84%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%8C%E5%8C%85%E6%8B%AC%E5%85%B6%E5%9B%BE%E7%89%87%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/19713/%E7%A7%BB%E9%99%A4Google%E7%9A%84%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%8C%E5%8C%85%E6%8B%AC%E5%85%B6%E5%9B%BE%E7%89%87%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

main.addEventListener('mousedown', ev => {//图片搜索
	if (ev.target.closest('a[jsaction^="mousedown:irc."] > img')) ev.stopPropagation();
});
Object.defineProperty(window, 'rwt', { writable: false });