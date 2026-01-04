// ==UserScript==
// @name         gitee tuning
// @namespace    gitee
// @version      0.2.0
// @description  Gitee 魔改计划
// @author       BlindingDark
// @match        https://gitee.com/oschina/dashboard*
// @match        https://*.oschina.net/*tweet*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374934/gitee%20tuning.user.js
// @updateURL https://update.greasyfork.org/scripts/374934/gitee%20tuning.meta.js
// ==/UserScript==

// 目前实现
// 1. 点击 issues 复制井号标识而不是链接
// 2. 类似 SCP 网站上效果的黑条拉灰特效

(function() {
    'use strict';

    // Tools
    // 复制字符串到剪贴板
    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    // https://stackoverflow.com/questions/27078285/simple-throttle-in-js
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = Date.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    // 类似 SCP 网站上效果的黑条拉灰特效
    function block() {
        $('.blocked-cover-tip').remove();
        let elements = $('.tweet-item.blocked, .comment.blocked');

        elements.removeClass('blocked');
        elements.children('div').map((i, e) => {
            let text = e.innerText;
            let length = text.length;

            if (length > 0) {
                e.innerText = text.replace(/[^\s]/g, '▇');
            } else {
                e.innerText = '▇';
            }
        });
    }

    // 一秒内不重复请求
    let throttledBlock = throttle(block, 1000);
    $('#tweetCommentsList, #tweetList').bind('DOMNodeInserted', function(e) {
        throttledBlock();
    });

    // 点击 issues 复制井号标识而不是链接
    $("body").on("click", ".issue-number-button", (e) => {
        window.setTimeout(() => copyToClipboard(e.target.textContent.trim()), 100);
    });
})();
