// ==UserScript==
// @name         知乎|简书-直接跳转
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  屏蔽知乎安全中心，直接跳转链接地址。
// @author       zl7261
// @match        https://*.zhihu.com/*
// @match        https://*.jianshu.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/408247/%E7%9F%A5%E4%B9%8E%7C%E7%AE%80%E4%B9%A6-%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/408247/%E7%9F%A5%E4%B9%8E%7C%E7%AE%80%E4%B9%A6-%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

// forked from https://greasyfork.org/zh-CN/scripts/396857
// changelog:
// 2020-08-06：  improve performance
//               直接查询有href属性的a标签 使用observerApi而非监听scroll事件
// 2020-08-06：  code format
//               支持简书 更新 dom selector

(function () {
    'use strict';

    const url = window.location.href
    if (!url.match(/\.zhihu\.|\.jianshu\./)) {
        return
    }

    let zhihuFlag = url.indexOf('.zhihu.') > -1


    const getPrefix = (isZhihu) => {
        if (isZhihu) {
            return "link.zhihu.com"
        } else {
            return "link.jianshu.com"
        }
    }

    const getSplit = (isZhihu) => {
        if (isZhihu) {
            return "target="
        } else {
            return "/?t="
        }
    }
    const getSelector = (isZhihu) => {
        if (isZhihu) {
            return ".ListShortcut a[href]"
        } else {
            return "[role = main] a[href]"
        }
    }

    const prefix = getPrefix(zhihuFlag)
    const split = getSplit(zhihuFlag)
    const selector = getSelector(zhihuFlag)

    // 获取正确的地址用于跳转
    const getOriginHref = () => {
        let documents = document.querySelectorAll(selector)
        for (let i = 0; i < documents.length; i++) {
            if (documents[i].href.indexOf(prefix) === -1) {
                continue;
            }

            documents[i].setAttribute("href", decodeURIComponent(documents[i].href.split(split)[1]))

        }
    }

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            // each entry is an instance of ResizeObserverEntry
            getOriginHref();
        }
    })

    observer.observe(document.querySelector('body'))
})();
