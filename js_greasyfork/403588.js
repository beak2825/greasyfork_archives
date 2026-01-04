// ==UserScript==
// @name         Make Sinaimg Work
// @namespace    https://gadflysu.com/
// @version      0.1
// @description  I don't know about JS.
// @author       gadflysu
// @match        https://www.inoreader.com/*
// @match        https://bangumi.tv/*
// @match        https://bgm.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403588/Make%20Sinaimg%20Work.user.js
// @updateURL https://update.greasyfork.org/scripts/403588/Make%20Sinaimg%20Work.meta.js
// ==/UserScript==

(function() {
    $('img').each(function(i, e) {
        if(e.src.match(/w[swx][1-4].sinaimg.cn/))
            e.src = e.src.replace(/w[swx][1-4].sinaimg.cn/,'tva1.sinaimg.cn')
    })
})();