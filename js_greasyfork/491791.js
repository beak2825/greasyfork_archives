// ==UserScript==
// @name         哔哩哔哩收藏夹修复
// @namespace    @justorez
// @homepage     https://github.com/justorez
// @version      1.0.1
// @description  修复哔哩哔哩失效的收藏，可查看av号、简介、标题、封面等
// @author       justorez
// @license      GPL-3.0
// @supportURL   https://github.com/justorez/bilibili-favorites-fix/issues
// @match        https://space.bilibili.com/*
// @resource iconError https://cdn.jsdelivr.net/gh/Mr-Po/bilibili-favorites-fix/media/error.png
// @resource iconSuccess https://cdn.jsdelivr.net/gh/Mr-Po/bilibili-favorites-fix/media/success.png
// @resource iconInfo https://cdn.jsdelivr.net/gh/Mr-Po/bilibili-favorites-fix/media/info.png
// @connect      biliplus.com
// @connect      api.bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/491791/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/491791/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    /**
     * 失效收藏标题颜色(默认为灰色)。
     * @type {String}
     */
    const invalidColor = '#999'

    /**
     * 是否启用调试模式。
     * 启用后，浏览器控制台会显示此脚本运行时的调试数据。
     * @type {Boolean}
     */
    const isDebug = false

    /**
     * 重试延迟（秒）
     * @type {Number}
     */
    const retryDelay = 5

    /**
     * 每隔 space 毫秒检查一次，是否有新的收藏被加载出来。
     * 此值越小，检查越快；过小会造成浏览器卡顿。
     * @type {Number}
     */
    const space = 2000

    /******************************************************/

    /**
     * 收藏夹地址正则
     * @type {RegExp}
     */
    const favlistRegex = /https:\/\/space\.bilibili\.com\/\d+\/favlist.*/

    /**
     * 处理收藏
     */
    function handleFavorites() {
        if (!favlistRegex.test(window.location.href)) {
            return
        }

        // 失效收藏节点列表
        const list = document.querySelectorAll(
            'ul.fav-video-list.content li.small-item.disabled'
        )

        if (list.length > 0) {
            console.info(`${list.length}个收藏待修复...`)

            list.forEach((el) => {
                const bv = el.getAttribute('data-aid')
                const aid = bv2aid(bv)

                // 多个超链接
                const alinks = el.querySelectorAll('a')
                alinks.forEach((link) => {
                    link.href = `https://www.biliplus.com/video/av${aid}/`
                    link.target = '_blank'
                    link.classList.remove('disabled') // 移除禁用样式
                })

                fixTitleAndCover(el, alinks[1], aid) // 修复标题和封面
                el.classList.remove('disabled') // 移除禁用样式
                addCopyAVCodeButton(el, aid) // 添加 avid 复制按钮
                addCopyBVCodeButton(el, bv) // 添加 bvid 复制按钮
            })

            showDetail(list)
        }
    }

    /**
     * 扩展收藏项的操作菜单
     *
     * @param {Element} item
     * @param {string} name
     * @param {Function} fn
     */
    function addOperation(item, name, fn) {
        if (item.classList.contains('disabled')) {
            return
        }

        const ul = item.querySelector('.be-dropdown-menu')
        const lastChild = ul.children[ul.children.length - 1]

        // 未添加过扩展
        if (!lastChild.classList.contains('be-dropdown-item-extend')) {
            lastChild.classList.add('be-dropdown-item-delimiter')
        }

        const s = `<li class="be-dropdown-item be-dropdown-item-extend">${name}</li>`
        const li = new DOMParser().parseFromString(s, 'text/html').body.firstChild
        li.onclick = fn

        ul.append(li)
    }

    function addCopyAVCodeButton($item, aid) {
        addOperation($item, '复制AV号', function () {
            GM_setClipboard(`av${aid}`, 'text')
        })
    }

    function addCopyBVCodeButton($item, bv) {
        addOperation($item, '复制BV号', function () {
            GM_setClipboard(bv, 'text')
        })
    }

    function addCopyInfoButton($item, content) {
        addOperation($item, '复制信息', function () {
            GM_setClipboard(content, 'text')
        })
    }

    function addOpenUpSpaceButton($item, mid) {
        addOperation($item, 'UP主页', function () {
            GM_openInTab(`https://space.bilibili.com/${mid}`, {
                active: true,
                insert: true,
                setParent: true
            })
        })
    }

    /**
     * 修改样式：标记失效的收藏
     *
     * @param {Element} item 收藏项
     * @param {HTMLLinkElement} link 标题链接
     */
    function markAsInvalid(item, link) {
        // 增加删除线 + 置灰
        link.setAttribute(
            'style',
            `text-decoration:line-through;color:${invalidColor};`
        )
        // 收藏时间
        const pubdate = item.querySelector('div.meta.pubdate')
        // 增加删除线
        pubdate.setAttribute('style', 'text-decoration:line-through')
    }

    /**
     * 绑定重新加载
     *
     * @param {HTMLLinkElement} link 标题链接
     * @param {Function} fn 重试方法
     */
    function bindReload(link, fn) {
        link.textContent = '-> 手动加载 <-'
        link.onclick = () => {
            link.textContent = '加载中...'
            fn()
        }
    }

    /**
     * 再次尝试加载
     *
     * @param {Element} link 标题链接
     * @param {number} aid AV号
     * @param {boolean}	delay 延迟重试
     * @param {Function} fn 重试方法
     */
    function afterRetry(link, aid, delay, fn) {
        console.warn(`查询：av${aid}，请求过快`)

        if (delay) {
            // 延迟绑定
            link.text(`请求过快，${delay}秒后再试`)
            setTimeout(bindReload, retryDelay * 1000, link, fn)
            countdown(link, retryDelay)
        } else {
            // 首次，立即绑定
            link.href = 'javascript:void(0);'
            bindReload(link, fn)
        }
    }

    /**
     * 重新绑定倒计时
     *
     * @param {HTMLLIElement} link 标题链接
     * @param {number} second
     */
    function countdown(link, second) {
        if (link.textContent.indexOf('请求过快') === 0) {
            link.textContent = `请求过快，${second}秒后再试！`
            if (second > 1) {
                setTimeout(countdown, 1000, link, second - 1)
            }
        }
    }

    /**
     * 修复收藏
     *
     * @param {Element} item 收藏项
     * @param {HTMLLIElement} link 标题链接
     * @param {number|string} aid av号
     * @param {string} title 标题
     * @param {string} cover 封面
     * @param {string} history 历史归档，若无时，使用空字符串
     */
    function fixFavorites(item, link, aid, title, cover, history) {
        history ||= ''

        // 设置新标题
        link.textContent = title
        link.title = title

        // 设置新标题链接
        item.querySelectorAll('a').forEach((a) => {
            a.href = `https://www.biliplus.com/${history}video/av${aid}`
        })

        markAsInvalid(item, link)

        if (cover) {
            const img = item.querySelector('img')
            img.src = cover
            item.querySelectorAll('source').forEach((s) => s.remove())
        }
    }

    /**
     * 请求 BiliPlus 接口获取标题和封面
     *
     * @param {Element} item 收藏项
     * @param {HTMLLinkElement} link 标题链接
     * @param {string|number} aid av号
     */
    function fixTitleAndCover(item, link, aid) {
        link.textContent = '加载中...'

        GM_xmlhttpRequest({
            url: `https://www.biliplus.com/api/view?id=${aid}`,
            method: 'GET',
            responseType: 'json',
            onload: (response) => {
                const res = response.response

                if (isDebug) {
                    console.log('fixTitleAndCover', url, res)
                }
        
                if (res.title) {
                    // 找到了
                    fixFavorites(item, link, aid, res.title, res.pic)
                } else if (res.code == -503) {
                    // 请求过快
                    afterRetry(item, link, true, () => fixTitleAndCover(item, link, aid, true))
                } else {
                    // 未找到
                    fixFavorites(item, link, aid, `未找到（${aid}）`)
                }
            }
        })
    }

    /**
     * 显示详情
     *
     * @param {Element} list 失效收藏节点列表
     */
    async function showDetail(list) {
        const fidRegex = window.location.href.match(/fid=(\d+)/)
        const fid = fidRegex
            ? fidRegex[1]
            : document.querySelector('div.fav-item.cur').getAttribute('fid')

        // 当前页码
        const pn = document.querySelector(
            'ul.be-pager li.be-pager-item.be-pager-item-active'
        ).textContent

        // 该接口已失效：https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=${fid}&pn=${pn}&ps=20&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp
        const url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${fid}&pn=${pn}&ps=20&keyword=&order=mtime&type=0&tid=0&platform=web`
        const response = await fetch(url, { credentials: 'include' })
        const json = await response.json()

        const mediasJson = json.data.medias

        list.forEach((node) => {
            const bv = node.getAttribute('data-aid')
            const media = mediasJson.find((x) => x.bvid === bv)

            let titles = ''
            if (media.pages) {
                titles = media.pages.map((m) => m.title).join('、')
            }

            const content =
                `子P数：${media.page}\n` +
                `子P标题：${titles}\n` +
                `简介：${media.intro}\n` +
                `弹幕数：${media.cnt_info.danmaku}`

            node.querySelector('a').title = content
            // addCopyInfoButton(node, content)
            addOpenUpSpaceButton(node, media.upper.mid)
        })
    }

    /**
     * BV号转AV号
     *
     * 原脚本算法已经失效，新算法引用自链接项目
     *
     * @param {string} bvid
     * @see https://github.com/magicdawn/bilibili-app-recommend
     * @see https://greasyfork.org/zh-CN/scripts/443530
     */
    function bv2aid(bvid) {
        const XOR_CODE = 23442827791579n
        const MASK_CODE = 2251799813685247n
        const BASE = 58n
        const CHAR_TABLE = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf'
        const bvidArr = Array.from(bvid)
        ;[bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]]
        ;[bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]]
        bvidArr.splice(0, 3)
        const tmp = bvidArr.reduce(
            (pre, bvidChar) => pre * BASE + BigInt(CHAR_TABLE.indexOf(bvidChar)),
            0n
        )
        return Number((tmp & MASK_CODE) ^ XOR_CODE)
    }

    function tip(text, iconName) {
        GM_notification({
            text: text,
            image: GM_getResourceURL(iconName)
        })
    }

    function tipInfo(text) {
        tip(text, 'iconInfo')
    }

    function tipError(text) {
        tip(text, 'iconError')
    }

    function tipSuccess(text) {
        tip(text, 'iconSuccess')
    }

    setInterval(handleFavorites, space)
})()
