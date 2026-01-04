// ==UserScript==
// @name          小妖怪分享|兴趣使然的资源搬运Blog
// @description   焦点图标题高度不一bug。
// @version       1.0.0
// @namespace     焦点图标题高度不一bug
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *xyg688.com/*
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/540699/%E5%B0%8F%E5%A6%96%E6%80%AA%E5%88%86%E4%BA%AB%7C%E5%85%B4%E8%B6%A3%E4%BD%BF%E7%84%B6%E7%9A%84%E8%B5%84%E6%BA%90%E6%90%AC%E8%BF%90Blog.user.js
// @updateURL https://update.greasyfork.org/scripts/540699/%E5%B0%8F%E5%A6%96%E6%80%AA%E5%88%86%E4%BA%AB%7C%E5%85%B4%E8%B6%A3%E4%BD%BF%E7%84%B6%E7%9A%84%E8%B5%84%E6%BA%90%E6%90%AC%E8%BF%90Blog.meta.js
// ==/UserScript==

(function () {
	// 'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        try {
            // DOM 加载完成的代码
            console.log('DOM 加载完成！');

            var styles = {
                height: "1.4em",
                background: "rgba(255, 255, 0, .3)",
                overflow: "hidden",
            };

            document.querySelectorAll('.featured .post-title').forEach(function(element) {
                for (var prop in styles) {
                    element.style[prop] = styles[prop];
                }
            });
        } catch (error) {
            console.log(error)
            alert('代码没有正常执行')
        }
    });
})();
