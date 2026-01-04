// ==UserScript==
// @name        显示活动页渠道链接
// @version     1.0.9
// @author      zhuning1@corp.netease.com
// @description 预览弹窗增加渠道链接显示（会员专用）
// @match       *://music-act.hz.netease.com/activity*
// @match       *://*.igame.163.com/activity*
// @namespace   https://g.hz.netease.com/zhuning1
// @license     ISC
// @icon        https://p6.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4899405731/4964/d4f3/be96/7d135ab217ff108da08df26a4dba0926.png
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/446292/%E6%98%BE%E7%A4%BA%E6%B4%BB%E5%8A%A8%E9%A1%B5%E6%B8%A0%E9%81%93%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/446292/%E6%98%BE%E7%A4%BA%E6%B4%BB%E5%8A%A8%E9%A1%B5%E6%B8%A0%E9%81%93%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
    const channelMap = {
        'smzdm': '什么值得买',
        'weibo': '微博',
        'weibo-ad': '微博广告',
        'wxpublic': '微信公众号',
        '163mail': '网易邮箱',
        'godlike': '网易大神',
        '163game': '网易游戏',
        'uu': 'UU加速器',
        'caocao': '曹操出行',
        'douyin': '抖音',
        'kuaishou': '快手',
        'xhs': '小红书',
        'iqiyi': '爱奇艺',
        'xiaomi': '小米',
        'bilibili': 'B站',

        'toutiao': '头条',
        'gdt': '广点通',
        'baidu': '百度',
        'alipay': '支付宝',
        'youdao-dsp': '有道智选',
        'e-uc': '汇川',

        'home-2floor': '首页二楼',
        'home-popup': '首页弹窗',
        'new-home-banner': '新首页banner',

        'corpmail': '员工邮件',
        'popo-music': '多多推荐',

        'sms': '短信',
        'sms-1': '短信1',
        'sms-2': '短信2',
        'sms-3': '短信3',
    }

    const concat = (base, query) => base + (/\?/.test(base) ? '&' : '?') + query

    const render = (url) => {
        const fragment = document.createDocumentFragment()
        const h3 = document.createElement('h3')
        h3.textContent = '渠道链接 (会员专用)：'
        h3.className = 'f-mgt10'
        fragment.appendChild(h3)

        let index = 0
        for (const key in channelMap) {
            const a = document.createElement('a')
            a.target = '_blank'
            a.href = concat(url, `extChannel=${key}`)
            a.textContent = channelMap[key]

            if (index) fragment.appendChild(document.createTextNode(' | '))
            fragment.appendChild(a)
            index += 1
        }


        return fragment
    }

    const insertBefore = (before, base) => base.parentNode.insertBefore(before, base)

    const injectModal = (modalNode) => {
        if (modalNode.inject) return

        const { href } = modalNode.querySelector('.notes a:first-of-type')

        insertBefore(render(href), modalNode.querySelector('.notes h3:nth-of-type(2)'))

        modalNode.inject = true
    }

    const callback = () => {
        document.querySelectorAll('.mui-modal').forEach(node => {
            try { injectModal(node) } catch (error) {}
        })
    }

    try {
        const observer = new MutationObserver(callback)
        observer.observe(document.body, { childList: true, subtree: true })
    } catch (_) {}
})()
