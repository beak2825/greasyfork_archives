// ==UserScript==
// @name 复制分享链接
// @name:en Copy share link
// @namespace       https://github.com/zaaack/tools/
// @description     在右键菜单中添加复制分享链接按钮，点击之后自动复制页面标题和链接
// @description:en     Add share link button to context menu, auto copy page title and link after click
// @version         1.0
// @author          zaaack
// @include         *
// @grant           GM_setClipboard
// @run-at            context-menu
// @homepageURL       https://github.com/zaaack/tools/blob/master/tampermonkey/share-link/README.md
// @supportURL        https://github.com/zaaack/tools/issues
// @downloadURL https://update.greasyfork.org/scripts/425382/%E5%A4%8D%E5%88%B6%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/425382/%E5%A4%8D%E5%88%B6%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

;(() => {
    GM_setClipboard(`${document.title} ${location.href}`, 'text')
    console.log('[TM][share-link] 复制页面链接和标题成功')
})()
