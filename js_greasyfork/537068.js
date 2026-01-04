// ==UserScript==
// @name         X.com to Twitter.com Redirect
// @name:zh-CN   重定向X.com到Twitter.com
// @namespace    NTE
// @version      1.6
// @description  Redirects X.com URLs to Twitter.com and ensures the 'mx=1' parameter is present.
// @description:zh-cn 重定向X.com到Twitter.com并确保后面有“mx=1"参数
// @author       NTE
// @match        *://x.com/*
// @match        *://twitter.com/*
// @match        *://mobile.x.com/*
// @match        *://mobile.twitter.com/*
// @match        *://pro.x.com/*
// @match        *://pro.twitter.com/*
// @exclude      *://x.com/i/tweetdeck*
// @exclude      *://x.com/i/oauth*
// @exclude      *://x.com/oauth*
// @run-at       document-start
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/537068/Xcom%20to%20Twittercom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/537068/Xcom%20to%20Twittercom%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script is running. Version 1.4'); // 脚本启动日志

    const currentUrl = new URL(window.location.href);
    let targetHostname = currentUrl.hostname;
    let targetPathname = currentUrl.pathname;
    let targetSearchParams = new URLSearchParams(currentUrl.searchParams); // 复制当前URL的查询参数

    let shouldRedirect = false;

    console.log('Current URL (当前URL):', currentUrl.toString());
    console.log('Current Hostname (当前主机名):', currentUrl.hostname);
    console.log('Current Pathname (当前路径):', currentUrl.pathname);
    console.log('Current Search Params (当前查询参数):', currentUrl.searchParams.toString());


    // 情况1: 如果主机名以 x.com 结尾
    if (currentUrl.hostname.endsWith('x.com')) {
        console.log('Condition met: Hostname ends with x.com (条件满足: 主机名以 x.com 结尾)');

        // 使用新的正则表达式替换主机名。
        // `^(.*?)x\.com$` 会匹配：
        // - `x.com` -> 捕获组 $1 为空字符串，替换为 `twitter.com`
        // - `mobile.x.com` -> 捕获组 $1 为 `mobile.`，替换为 `mobile.twitter.com`
        targetHostname = currentUrl.hostname.replace(/^(.*?)x\.com$/, '$1twitter.com');
        console.log('Target Hostname after replacement (替换后的目标主机名):', targetHostname);

        targetSearchParams.set('mx', '1'); // 设置 mx=1 参数
        console.log('Target Search Params after setting mx=1 (设置mx=1后的目标查询参数):', targetSearchParams.toString());

        // 处理根路径重定向
        if (currentUrl.pathname === '/') {
            targetPathname = ''; // 移除根路径的斜杠
            console.log('Root path detected, target pathname (检测到根路径，目标路径):', targetPathname);
        }
        shouldRedirect = true;
        console.log(`Detected ${currentUrl.hostname}, preparing to redirect to ${targetHostname}. (检测到 ${currentUrl.hostname}，准备重定向到 ${targetHostname}。)`);
    }
    // 情况2: 如果主机名以 twitter.com 结尾且缺少 'mx' 参数
    else if (currentUrl.hostname.endsWith('twitter.com') && !currentUrl.searchParams.has('mx')) {
        console.log('Condition met: Hostname ends with twitter.com and mx is missing. (条件满足: 主机名以 twitter.com 结尾且缺少 mx 参数。)');
        targetSearchParams.set('mx', '1');
        shouldRedirect = true;
        console.log('Target Search Params after setting mx=1 (设置mx=1后的目标查询参数):', targetSearchParams.toString());
    } else {
        console.log('No specific redirection condition met based on hostname/params. (没有满足特定重定向条件，基于主机名/参数。)');
    }

    // 手动构建新的 URL 字符串
    let newUrlString = `${currentUrl.protocol}//${targetHostname}${targetPathname}`;
    if (targetSearchParams.toString()) {
        newUrlString += `?${targetSearchParams.toString()}`;
    }
    // 处理 URL 中的哈希部分（#后面的内容）
    if (currentUrl.hash) {
        newUrlString += currentUrl.hash;
    }


    console.log('shouldRedirect (是否需要重定向):', shouldRedirect);
    console.log('newUrlString (新URL字符串):', newUrlString);
    console.log('currentUrl.toString() (当前URL字符串):', currentUrl.toString());
    console.log('Are URLs different? (URL是否不同?):', newUrlString !== currentUrl.toString());

    // 如果需要重定向且新旧URL不同，则执行重定向
    if (shouldRedirect && newUrlString !== currentUrl.toString()) {
        console.log('Performing redirection... (正在执行重定向...)');
        console.log('Redirecting from (从):', currentUrl.toString());
        console.log('Redirecting to (到):', newUrlString);
        window.location.replace(newUrlString);
    } else {
        console.log('No redirection performed. (未执行重定向。)');
    }

})();
