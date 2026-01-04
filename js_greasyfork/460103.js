// ==UserScript==
// @name         百度首页简洁优化
// @version      1.2.14
// @license      MIT
// @author       初晓
// @namespace    https://github.com/zhChuXiao
// @match        *://*.baidu.com/*
// @run-at       document-start

// @description:zh-cn 去除百度首页的推荐广告，简洁优化界面，集成多搜索引擎切换功能
// @description  去除百度首页的推荐广告，简洁优化界面，集成多搜索引擎切换功能
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460103/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460103/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // 配置选项
    const config = {
        // 页面元素
        elements: {
            logo: '#s_lg_img_new',
            searchInput: '#kw',
            searchWrapper: '#s_form_wrapper',
            removeElements: [
                '#s_wrap',
                '#s-top-left',
                '#s_new_search_guide',
                '.operate-wrapper',
                '.s-weather-wrapper',
                '.s-bottom-layer-content'
            ]
        }
    }

    // 注入隐藏元素的CSS样式
    function hideElements() {
        const selectors = config.elements.removeElements.join(', ')
        const css = `
      ${selectors} {
        display: none !important;
      }
    `
    GM_addStyle(css)
  }

    // 注入自定义样式
    function injectStyles() {
        const css = `

    `
    GM_addStyle(css)
  }

    // 初始化函数
    function initialize() {
        // 检查我们是否在百度首页
        if (
            window.location.href.includes('www.baidu.com') &&
            (window.location.pathname === '/' || window.location.pathname === '/index.html')
        ) {
            console.log(
                '%c 百度首页简洁优化脚本已加载 %c 呢喃Ninc %c blog.ninc.top ',
                'background:#4e6ef2; color:#fff; border-radius:3px 0 0 3px; padding:2px; font-weight:bold',
                'background:#606060; color:#fff; padding:2px; font-weight:bold',
                'background:#42c02e; color:#fff; border-radius:0 3px 3px 0; padding:2px'
            )
        }
    }

    // 立即执行隐藏元素和样式注入
    hideElements()
    injectStyles()

    // 页面加载完成后执行其他初始化
    if (document.readyState === 'complete') {
        initialize()
    } else {
        window.addEventListener('DOMContentLoaded', initialize)
    }
})()
