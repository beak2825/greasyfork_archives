// ==UserScript==
// @name         Weibo.com(新浪微博) Thumbnail-InNewWindow Auto Larger
// @description  新浪微博-缩略图-在新窗口打开时-自动跳转大图
// @version      1.0.17012102
// @author       DanoR
// @namespace    https://danor.top/
// @grant        none
// @include      *://*.sinaimg.cn/*
// @downloadURL https://update.greasyfork.org/scripts/4796/Weibocom%28%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%29%20Thumbnail-InNewWindow%20Auto%20Larger.user.js
// @updateURL https://update.greasyfork.org/scripts/4796/Weibocom%28%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%29%20Thumbnail-InNewWindow%20Auto%20Larger.meta.js
// ==/UserScript==

if (!/sinaimg\.cn\/large\//.test(location.href))
	location.href = location.href.replace(/sinaimg\.cn\/.*?\//, 'sinaimg.cn/large/');