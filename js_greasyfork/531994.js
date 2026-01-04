// ==UserScript==
// @name         Instagram 免登陆（玩具版）
// @version      1.8
// @namespace   https://greasyfork.org/users/1171320
// @description  登录状态 => 不受影响；未登录状态：自动跳转到批奶（pixnoy），查看帖子内容。
// @match1       https://www.instagram.com/*    如用首页，会一直刷新。不加上，用户搜不到，就这样吧。
// @match       https://www.instagram.com/accounts/login/*
// @author        yzcjd
// @author2      ChatGPT4 辅助
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531994/Instagram%20%E5%85%8D%E7%99%BB%E9%99%86%EF%BC%88%E7%8E%A9%E5%85%B7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531994/Instagram%20%E5%85%8D%E7%99%BB%E9%99%86%EF%BC%88%E7%8E%A9%E5%85%B7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(location.href);

    // 检查是否是 Instagram 登录页
    if (url.hostname === 'www.instagram.com' && url.pathname === '/accounts/login/') {
        const next = url.searchParams.get('next'); // 获取 next 参数

        // 确保 next 参数存在，并且指向 Instagram 用户页面
        if (next && next.includes('instagram.com')) {
            try {
                // 从 next 中提取用户 ID（通过正则匹配 Instagram 用户名）
                const nextUrl = new URL(next, location.origin);
                const match = nextUrl.pathname.match(/^\/([^\/?#]+)\/?$/);
                const username = match?.[1];

                // 确保 username 存在并且有效
                if (username) {
                    // 跳转到 Pixnoy 用户页面
                    location.replace(`https://www.pixnoy.com/profile/${encodeURIComponent(username)}`);
                }
            } catch (e) {
                console.warn('跳转失败：', e);
            }
        }
    }
})();