// ==UserScript==
// @name        哔哩哔哩（bilibili）内嵌播放器替换
// @namespace   Bilibili Embedded Player Replace
// @run-at      start
// @match       *://player.bilibili.com/player.html?*
// @version     1.3
// @author      uJZk
// @description 替换哔哩哔哩（bilibili）内嵌播放器以支持 1080P 及更高分辨率。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/421931/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%EF%BC%89%E5%86%85%E5%B5%8C%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/421931/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%EF%BC%89%E5%86%85%E5%B5%8C%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

window.location.replace(document.location.href.replace(/player\.bilibili\.com\/player\.html\?(.*)(cid=.*)?&?(.*)/,"www.bilibili.com/blackboard/html5mobileplayer.html?$1$3"));
