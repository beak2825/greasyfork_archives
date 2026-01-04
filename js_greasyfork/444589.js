// ==UserScript==
// @name         清除 B 站链接路径跟踪标记 spm_id_from - PathNameCleaner
// @namespace    http://zhangmaimai.com/
// @version      0.6
// @description  B 站站内链接很多地方都会强行插入 spm_id_from 等参数 用以标记跟踪用户，但该实现方式是在太污染地址栏且分享链接时有碍观感和隐私嫌疑。本脚本通过重写 window.open 方法与事件监听的方式清理了多项该类参数。
// @author       Max39
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/444589/%E6%B8%85%E9%99%A4%20B%20%E7%AB%99%E9%93%BE%E6%8E%A5%E8%B7%AF%E5%BE%84%E8%B7%9F%E8%B8%AA%E6%A0%87%E8%AE%B0%20spm_id_from%20-%20PathNameCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/444589/%E6%B8%85%E9%99%A4%20B%20%E7%AB%99%E9%93%BE%E6%8E%A5%E8%B7%AF%E5%BE%84%E8%B7%9F%E8%B8%AA%E6%A0%87%E8%AE%B0%20spm_id_from%20-%20PathNameCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const __PARAMS__ = [
        "spm_id_from",
        // 搜索页相关
        "from",
        "seid",
        // 首屏直播相关
        "launch_id",
        "hotRank",
        "session_id"
    ]
    // 替换指定参数
    function urlReplacer(url, param) {
        let s = url.indexOf(`?${param}=`)
        s = !~s ? url.indexOf(`${param}=`) : s
        if(!~s) return url
        let e = url.indexOf(s, "&")
        if(!~e) e = undefined
        let newArgs = url.slice(s, e)
        return url.replace(newArgs, "")
    }
    // 批量替换所有参数
    function urlCleaner(url) {
        __PARAMS__.forEach(param=>{
            url = urlReplacer(url, param)
        })
        return url
    }
    // 重写 window.open
    window.open = ((__open__) => {
        return (url, name, params) => {
            __open__(urlCleaner(url), name, params)
        }
    })(window.open)
    // 拦截 a 标签点击事件
    document.body.addEventListener('click', function (event) {
        let target = event.target
        for (let i = 1; target.tagName != "A" && i <=4 ; i++) {
            target = target.parentElement
        }
        if (target.tagName === "A") {
            event.preventDefault();
            let url = target.getAttribute("href")
            if (target.getAttribute("target") === '_blank') {
                window.open(url)
            } else {
                window.location.href = urlCleaner(url)
            }
        }
    });

})();