// ==UserScript==
// @name         bilibili 显示 av 号
// @namespace    https://github.com/8qwe24657913
// @version      0.3
// @description  在视频播放页面显示视频的 av 号
// @author       8q
// @match        http://www.bilibili.com/*
// @match        https://www.bilibili.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398542/bilibili%20%E6%98%BE%E7%A4%BA%20av%20%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/398542/bilibili%20%E6%98%BE%E7%A4%BA%20av%20%E5%8F%B7.meta.js
// ==/UserScript==

// eslint-disable-next-line no-extra-semi
;(function () {
    'use strict'
    let aid, link, anchor
    const setData = () => {
        link.href = `//www.bilibili.com/video/av${aid}/`
        link.textContent = `av${aid}`
    }
    const run = () => {
        // aid 应为全数字
        if (!/^\d+$/.test(aid)) {
            console.error('bilibili 显示 av 号: aid 格式错误', 'aid=', aid)
            return
        }
        // 已插入链接且未被 vue 删除，常见于通过 pushState + ajax 实现的无刷新跳页
        if (link && anchor && document.contains(anchor)) {
            setData()
            return
        }
        anchor = document.querySelector('.video-data span:not([title]):not([class]), .pub-info')
        if (!anchor) {
            console.error('bilibili 显示 av 号: 未能找到元素插入点', 'aid=', aid)
            return
        }
        link = document.createElement('a')
        link.target = '_blank'
        link.className = 'show-bili-aid'
        setData()
        // vue 你赢了，我用 shadow dom 你总碰不着了吧？
        if (!anchor.shadowRoot) {
            const clone = anchor.cloneNode(true)
            anchor.attachShadow({ mode: 'open' })
            anchor.shadowRoot.appendChild(clone)
        }
        const style = document.createElement('style')
        if (!anchor.classList.contains('pub-info')) {
            // 普通视频
            style.textContent = `
                a.show-bili-aid {
                    margin-left: 16px;
                    color: #999;
                    text-decoration: none;
                }
            `
        } else {
            // 番剧，使用 .av-link 的样式
            style.textContent = `
               .pub-info {
                   display: block;
                   float: left;
                   height: 16px;
                   line-height: 16px;
                   margin-right: 10px;
               }
               a.show-bili-aid {
                   display: block;
                   float: left;
                   height: 16px;
                   line-height: 16px;
                   color: #212121;
                   text-decoration: none;
               }
               a.show-bili-aid:hover {
                   color: #03a0d6;
               }
            `
        }
        anchor.shadowRoot.appendChild(style)
        anchor.shadowRoot.appendChild(link)
    }
    const target = window.__INITIAL_STATE__ && 'aid' in window.__INITIAL_STATE__ ? window.__INITIAL_STATE__ : window
    if (target === window && !('aid' in window)) window.aid = ''
    aid = target.aid
    // 我可能比 vue hook 得早，也可能比它晚
    // 如果我比 vue 早，vue 的 hook 触发时会自动触发我的 hook
    // 如果我比 vue 晚，我的 hook 触发时就需要触发 vue 的 hook
    const desc = Object.getOwnPropertyDescriptor(target, 'aid')
    const vueHook = desc.set
    Object.defineProperty(target, 'aid', {
        get: desc.get || (() => aid),
        set(id) {
            aid = id
            setTimeout(run)
            if (vueHook) vueHook.call(this, id)
        },
        enumerable: true,
        configurable: true,
    })
    // 如果已经有 aid 了就开始第一次运行
    if (aid) run()
})()
