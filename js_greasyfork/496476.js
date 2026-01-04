// ==UserScript==
// @name         Jellyfin番号过滤
// @namespace    http://tampermonkey.net/
// @version      2.3.6
// @description  标记所有番号，并添加跳转链接。支持jellyfin、115、手动输入的番号查重。
// @author       Squirtle
// @license      MIT
// @match        https://www.javbus.com/*
// @match        https://www.javlibrary.com/*
// @match        https://javdb.com/*
// @match        https://jinjier.art/*
// @match        https://fc2ppvdb.com/*
// @match        https://www.youtube.com/*
// @match        https://missav123.com/*
// @match        https://missav.ws/*
// @match        https://sukebei.nyaa.si/*
// @match        https://115.com/*
// @match        https://115vod.com/*
// @match        https://dl.115cdn.net/*
// @match        https://sehuatang.net/*
// @require      https://update.greasyfork.org/scripts/516445/1480246/Make%20GM%20xhr%20more%20parallel%20again.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAX+SURBVFhHzVdpbFVFFD4z994WBcQSQNQALhEwBWQt8CiBhmisSiSsSrqAYbEEDKuoQF6KSGkhLhFFoFWJLNJKFEzUxLjWBy00UUDhh8FAAIGIIEGxfXcZv5k7975X2tKHmuhJJvfO+c6c891zzsybR/+1MP28bnm7oDrT42ytw5lwLWNJ0cZhRzR0XfK3CGwt+CbHZWKPY/B2NmcU53TZNmjsog2Rr7RJysL1M2XZVlg9SBDt8Thv54K+P1h7l/iHJfNiA7RZynJdBLY/tu8W8mi3x0kHZ/6AF4z2cWHsjj4Z66LNU5KUCUSjgnPL2Ya63x4GliRkcD0H1s1ON9+JRqMp+03Z8N5j1Ys9xsYk0i6DJxFRA+8Gf+Dy5Ufm62WtCpa1Lu/mfdFHMLMOHZ8eR1DbwGB03OaU9ydw1+LbHIP1kA2pmpJRvc2dgRvKhh/1PbQsrWagclKlQWRU4OvT1RfKlJM4wywxeuHGSGwZhmuI0S7RmSAbKEUbl1vlsmzaTYvSqoFIv7VIMJalG40cItvzxIS5r484oU2o+JXhx5GVidiatioLBkhETjjfzdQmLco1CciuFyRWJddaML5i3pvZ+7RJKGUvZu11iEeDfnBgb3Ox+vFoXSdt0qxck4BhxEuw3zsETl1iNZ0vnVyn4Sby89BBZbDbL209ac9Zxzg3V2m4WWmRQFV+bABSX+gHZyr1DqdZk6smo9y+rJh/YMSyhfsjekpVk5lrMzYTto6fNZkJmpG78mBfbdJEWiTgCW+tyzn3CWBOtH7e5shhDdOKuTUjPfI+s4k+X7z4wAitpoqSQYewFV8LiKN5DWGwUg03kWYJ7Mz78n6kUO95fD2j8w1ufKWG6Zmi6gzibIfcGXLEGdsxa2ldBw2TZxvFWPOrWo8IGLmjSw+N0nAjaT4DzHgejlU3SwcoxQsLtuT8plFKt9LQG8GJqAJ0w6LVGqbta/pdtEmUJDcv6tZsLzQhsGNqdS7SPVQx9xeeOmc3vKFhWj635j5kZ4afHRlcB+E0O+/Z/X20Gd0sMmQZTvt2wA2WPWTdD2M0HEoTAoyL55KZe0yUFW/JqdcwMk8rgRl+UN9GEzE8wwzLtKX4znqclut8zCfhcLFMw6E0IlCVF4tg22WHTonOm7xNhYZp+ZxaeQkZqxwGGdJE5cCv5Ljx0bre2pxwWm6G/kL4MZzlZL58eIiGlTQi4DBvQcIpk7Uvn71p8BUNE5lIPWcswBOB8e4P5nFrhramT5f0/8PmvDz0CRvb4As0rCQksLNgL5qKxgVOHSYEs8zNGlaC2j+cHFgHlbtE6+RcPKTNlXgekwREmDHOJ/RY/31XDScI2J47HZ1vBk7xXjtnQ9ZPGlaCLz2I814EXxMQUTtGDSFAJjwrpNQuzfwRujofV2vSHNMs1HCCgOAsP9kpxicaCmXNS1mTLEt0xok4Er+IOBJxUhIVolEnYWRbrtXp4+X9p2jzUPAz/lHo14+RryH/PrC9YF8/m7sHg99zNZgYv2hj5H1l9Q+l16tHJ6B87+Hiigus79917MwLRX2OqAw4zH1Qp0ezhM7gd6jV/4IIJroHWzGIY6dZuRJTGXhreuwD1OlR9eXytoNnnAsXz63IRKV9gxUrLR18SdqmKn1LDmWItmYEP0xTcHOaihuT4fsNYohdV6b1mqgIVEyPyfT3kylSJPSI6zmuWALb5xTInICDs7bJL+KQ+R1bLB43YcN4GvqiPf4fZMCuK7A74Os2vDMEb+QzLANj3zZMu2egIrDpiVg1WGUnDLEILIN6hU5CXZLTMGNX6xL19nU+Huiwzb+2C3uOgpnsUmMJ6nIq0QOJWvkD70qXNFe6YB7o8Ax12ibU+XN1UWHiJC65T8vYisCc8mE1dlvqCeN8bKtd6IdfGjlJcurvebwnOfUxqbtqHurwkURn8dWVDuNT457V0ym4q1bGBtS8LH2qrrubJno3EN2N9HZHE3VBzTsivTdhfiPS2AbvFuqN9KIXOK7iBrsC/SWk/wJSfc4h7ySex+qZefRCUa/T2vX/SYj+Av6m66t3we/RAAAAAElFTkSuQmCC
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_listValues
// @grant        GM_getValues
// @grant        GM_setValues
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM.cookie
// @grant        unsafeWindow
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/496476/Jellyfin%E7%95%AA%E5%8F%B7%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/496476/Jellyfin%E7%95%AA%E5%8F%B7%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    if (location.host.endsWith('115.com')) {
        if (window === window.top) {
            if (document.querySelector('iframe')) return
        } else {
            if (window.name !== 'wangpan') return
        }
    }

    // 默认设置项
    const defaultSettings = {
        // 是否开启jellyfin功能
        enable: true,
        // 是否开启本地番号填写功能
        localCodeEnable: false,
        // 在其他图标已存在时，是否依然显示本地图标
        forceShowLocalBtn: false,
        // 是否开启标签功能
        labelEnable: true,
        // 从jellyfin 控制台获取
        apiKey: '',
        // 服务器地址
        serverUrl: 'http://127.0.0.1:8096',
        // jellyfin中的用户id，建议填写，否则一些功能不可用，浏览器控制台输入ApiClient._currentUser.Id获取
        userId: '',
        // 设备Id，在jellyfin页面按F12打开控制台，输入ApiClient._deviceId获取
        // 仅在你同时在用 embyToLocalPlayer 插件时需要填写 https://greasyfork.org/zh-CN/scripts/448648-embytolocalplayer/feedback
        // 打开本地播放器时需要该参数
        deviceId: '',
        // 额外的搜索参数，格式为：parentId:xxx;isFavorite:true
        extraSearchParams: '',
        // 若为true，则在页面加载完成后自动触发一次过滤
        triggerOnload: false,
        // 是否显示收藏按钮
        showFavoriteBtn: false,
        // 自定义快捷键，可以是任意长度的字母或数字
        hotKeys: 'ee',
        // 脚本会改变页面的原有结构，此处定义可使页面恢复原状的快捷键
        recoverHotKeys: 'ss',
        // 复制所有磁力链接快捷键
        copyMagnetHotKeys: 'aa',
        // 复制所有ed2k链接快捷键
        copyEd2kHotKeys: 'qq',
        // 复制所有番号快捷键
        copyCodeHotKeys: 'ww',
        // 复制与用户自定义正则匹配的字符串
        copyUserRegHotKeys: 'cc',
        // 在jellyfin的卡片上显示一个心形图标显示
        addFavBtnHotKeys: ';;',
        // 获取jellyfin合集信息
        getCollectionHotKeys: '!!',
        // 随机播放当前页面上的番号
        playRandomCurPageHotKeys: '&&',
        // 随机播放最爱的jellyfin影片
        playRandomFavJellyfinHotKeys: '((',
        // 随机播放最爱的115影片
        playRandomFav115HotKeys: '))',
        // 随机播放最爱影片
        playRandomFavHotKeys: '__',
        // 随机播放任意影片
        playRandomAllHotKeys: '++',
        // 根据标签的order进行排序，仅在jellyfin中生效
        sortLabelHotKeys: ',,',
        // 默认从小到大排序
        sortLabelAsc: true,
        // 获取jellyfin数据快捷键
        fetchItemsHotKeys: '@@',
        // 额外的fetch参数，格式为：limit:200;parentId:xxx
        // limit不填则默认为200，填入0则获取全部数据
        extraFetchParams: 'limit:200',
        // 点击番号时的默认跳转链接，${code}会被替换为真正的番号
        openSite: 'https://www.javbus.com/${code}',
        // 点击番号时按住shift键时的跳转链接
        secondarySite: 'https://javdb.com/search?q=${code}',
        // 若番号被识别为fc2，默认会跳转到的链接
        fc2Site: 'https://sukebei.nyaa.si/user/offkab?q=${code}',
        // 若番号被识别为fc2，按住shift键时跳转的链接
        secondaryFc2Site: 'https://missav.live/search/${code}',
        // 设为true时浏览器控制台会输出log
        debug: false,
        // 定义生成链接的默认颜色
        linkColor: '#236ED0FF',
        // 定义被访问过的链接颜色
        linkVisitedColor: 'brown',
        // 番号在jellyfin/115/本地中存在时显示的链接颜色
        linkExistColor: '#2A7B5FFF',
        // 定义磁力和ed2k链接的颜色
        magnetColor: 'indianred',
        // 高亮卡片边框样式
        emphasisOutlineStyle: '2px solid red',
        // 默认会高亮不存在的番号，设置为true则反之
        reverseEmphasis: false,
        // 是否尽量复用窗口，可以加快打开速度
        openLinkInSameTab: false,
        // 自定义正则，匹配优先级最低
        // \d*[a-z]+\d*[-_]s*\d{2,}
        userRegexp: '',
        // 自定义正则匹配的高亮颜色
        userRegColor: 'orange',
        // 在jellyfin的movies页面是否自动触发过滤
        jellyfinAutoTrigger: false,
        // 在jellyfin页面中是否开启过滤，默认不开启
        enableInJellyfin: false,
        // javdb中欧美列表页面不显示完整番号，需要特殊处理
        // 此处用来定义那些需要特殊处理的页面路径，多个路径用逗号或分号分隔
        javdbOuPath: '/western'
    }

    // 默认115设置项
    const defaultOOFSettings = {
        // 是否开启115相关功能
        enable: false,
        // 115的cookie，可自行输入或点击自动获取，任选其一
        cookie: '',
        // 自定义cookie过期时间，单位为天
        expiresIn: '30',
        // 一个番号如果在jellyfin和115中都存在，默认只显示一个jellyfin图标，若设置为true，则也会显示115图标
        forceShowOOFBtn: false,
        // 115在线观看链接
        openSite: 'https://115vod.com/?pickcode=${pickcode}',
        // 搭配115Master插件使用时，可使用以下链接，按住shift键再点击
        secondarySite: 'https://115.com/web/lixian/master/video/?pick_code=${pickcode}&cid=0',
        // 首次匹配115网盘文件时，需要批次获取全量数据
        // limit定义每次获取条数，根据实际情况谨慎填写，过大可能导致服务器返回缓慢，过小请求次数过多可能触发115风控
        limit: '500',
        // 离线目录id, 留空则115会保存在云下载目录
        offlineCid: '',
        // 获取该目录下的文件来更新缓存，包括点击刷新按钮时
        fetchCid: '0',
        // 将115中某个目录中所有匹配番号规则的视频文件移动到另一个目录
        // 格式为cid对，比如 1111:2222 会将目录1中的文件移动到目录2
        move: '',
        // 移动文件时，若检测到欧美番号就移动到该目录下
        ouTargetCid: ''
    }

    const CONFIG = [
        {
            site: /^https:\/\/(www\.)?javbus\.com(?=\/?$|\/page\/\d+|\/search|\/genre|\/uncensored|\/star|\/label|\/director|\/studio|\/series)/i,
            cb: () => findCode('a.movie-box', 'date')
        },
        {
            site: /^https:\/\/www\.javlibrary\.com\/cn(?!(\/tl_bestreviews.php|\/publicgroups.php|\/publictopic.php))/i,
            cb: () => findCode('.video', '.id')
        },
        {
            site: /^https:\/\/(www\.)?javdb\.com(?!\/v\/)/i,
            cb: () => {
                const searchParams = new URLSearchParams(location.search)
                const paths = settings.javdbOuPath.split(/\s*[,;]\s*/).filter(Boolean)
                if (
                    searchParams.get('t') === 'western' ||
                    searchParams.get('q')?.match(/\d{2}\.\d{2}\.\d{2}/) ||
                    paths.some(path => location.pathname.includes(path))
                ) {
                    return findCode('.movie-list .item', box => {
                        let fakeTitle = box.getAttribute('data-jv-fake-title')
                        if (fakeTitle) return fakeTitle
                        const titleElement = box.querySelector('.video-title strong')
                        const title = titleElement.textContent.trim().replaceAll(' ', '')
                        const date = box.querySelector('.meta').textContent.trim().slice(2).replaceAll('-', '.')
                        fakeTitle = `${title}.${date}`
                        box.setAttribute('data-jv-fake-title', fakeTitle)
                        titleElement.textContent = fakeTitle
                        return fakeTitle
                    })
                } else {
                    return findCode('.movie-list .item', '.video-title strong')
                }
            }
        },
        {
            site: /^https:\/\/jinjier\.art\/sql.*/i,
            cb: () => {
                return findCode('tbody tr', box => {
                    const td = box.querySelector('td:nth-of-type(3)')
                    return td.textContent.split(' ')[0]
                })
            }
        },
        {
            site: /https:\/\/fc2ppvdb\.com/i,
            cb: () => {
                return findCode('.flex section .container .relative', box => {
                    const span = box.querySelector('.lazyload-wrapper + span') || box.querySelector('a.block + span')
                    const code = span?.textContent
                    if (code && !code.startsWith('fc2')) {
                        span.textContent = `fc2-${code}`
                    }
                    return code
                })
            }
        }
    ]

    const REG = {
        magnet: /magnet:\?xt=urn:btih:(?:[\da-f]{40}|[2-7a-z]{32})/,
        ed2k: /ed2k:\/\/(?:\|.+)+\|\//,
        fc2: /(?<![a-z\d])(?:fc2?)\s*[-_]?\s*(?:ppv)?\s*[-_]?\s*(\d{6,8})/,
        ou: /[a-z\d-]+(?:\.\d{2}){3}/,
        num2: /(?<![a-z\d])(\d{4,8})[-_](\d{2,4})(?!-\d{2,})/,
        special:
            /(?<![a-z\d])(s2mbd|t28|t|t38|\d{2}id|mcb3dbd|sm3d2dbd|s2mcr|s2m|91cm|spermmania|fellatiojapan|handjobjapan|cw3d2dbd|mk3d2dbd)[-_](\d{2,6})(?![a-z\d]|\.com)/,
        uncensored: /(?<![a-z\d])([nk])(\d{3,6})(?![a-z\d]|\.com)/,
        censored: /(?<=[\W_]\d{3}|^\d{3}|[\W_]|^)(?!(?:vip|top|com)[^a-z])([a-z]{2,9})\s*[-_]\s*(s*\d{2,6})(?!\d|\.com)/,
        censored2:
            /(?<=[\W_]\d{3}|^\d{3}|[\W_]|^)(?!(?:vip|top|com)[^a-z])([a-z]{3,9})\s*(?:[-_]||0*)?\s*(s*\d{3,6})(hhb\d?|mhb\d?|hd\d?|pl|ps)?(?![a-z\d]|\.com)/
    }

    function isTypeMagnetLike(type) {
        return type === 'magnet' || type === 'ed2k'
    }

    function getCodeByRegType(match, type, fc2Prefix = false) {
        if (!match) return
        if (isTypeMagnetLike(type)) return match[0]
        if (type === 'fc2') return fc2Prefix ? `fc2-${match[1]}` : match[1]
        if (type === 'uncensored') return match[1] + match[2]
        if (type === 'userReg') return match[0]
        if (type === 'num2') {
            // 20210710-001 -> 071021-001
            const num2Match = match[0].match(/20(\d{2})(\d{4})-(\d+)/)
            if (num2Match) {
                return `${num2Match[1]}${num2Match[2]}-${num2Match[3]}`
            }
        }
        if (type === 'ou') return match[0]
        return `${match[1]}-${match[2]}`
    }

    function getRegEntries() {
        const { userRegexp } = settings
        const entries = Object.entries(REG)
        if (userRegexp) {
            entries.push(['userReg', userRegexp])
        }
        return entries
    }

    function getTextRegList() {
        return getRegEntries().map(([type, reg]) => ({ type, reg: new RegExp(reg, 'ig') }))
    }

    function getFileRegList() {
        return getRegEntries()
            .filter(([type]) => !isTypeMagnetLike(type))
            .map(([type, reg]) => ({ type, reg: new RegExp(reg, 'i') }))
    }

    function getLinkRegList() {
        return getRegEntries()
            .filter(([type]) => isTypeMagnetLike(type))
            .map(([type, reg]) => ({ type, reg: new RegExp(reg, 'i') }))
    }

    function getSettings() {
        return {
            ...defaultSettings,
            ...GM_getValue('settings')
        }
    }

    function getOOFSettings() {
        return {
            ...defaultOOFSettings,
            ...GM_getValue('oofSettings')
        }
    }

    function getLocalCodeList() {
        return GM_getValue('localCodeList', [])
    }

    function getLocalNameList() {
        return GM_getValue('localNameList', [])
    }

    function getLabelList() {
        return GM_getValue('labelList', [])
    }

    let settings = getSettings()
    let oofSettings = getOOFSettings()
    let localCodeList = getLocalCodeList()
    let localNameList = getLocalNameList()
    let labelList = getLabelList()

    function noop() {}
    let log = noop

    let myPolicy
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        myPolicy = window.trustedTypes.createPolicy('jvJellyfinPolicy', {
            createHTML: string => string
        })
    }

    function isEnableInJellyfin() {
        const { serverUrl, enable, enableInJellyfin } = settings
        return location.origin === serverUrl ? enable && enableInJellyfin : enable
    }

    function setInnerHTML(element, html) {
        const escapeHtml = myPolicy ? myPolicy.createHTML(html) : html
        element.innerHTML = escapeHtml
    }

    function openTab(url, ctrlKey = false) {
        log(url)
        const { serverUrl, openLinkInSameTab } = settings
        const urlObj = new URL(url)
        if (ctrlKey || !openLinkInSameTab || new URL(serverUrl).origin === urlObj.origin) {
            GM_openInTab(url, { active: !ctrlKey, insert: true, setParent: true })
        } else {
            window.open(url, urlObj.origin)
        }
    }

    const copy = ({ text, desc }) => {
        if (!text) return
        GM_setClipboard(text)
        notify(desc || '复制成功', text)
    }

    function addClickEvent({ element, copyText, copyDesc, withCtrl = false, handler = noop }) {
        const prevent = e => {
            e.stopPropagation()
            e.preventDefault()
        }
        const handleMousedown = e => {
            e.stopPropagation()
            e.preventDefault()
            if (e.button === 0) {
                if (withCtrl && !e.ctrlKey) {
                    notify('请按住ctrl键再点击', '此举是为了防止不小心点错')
                    return
                }
                handler(e)
            } else if (e.button === 2) {
                if (typeof copyText === 'string') {
                    copy({ text: copyText, desc: copyDesc })
                } else if (copyText === null) {
                    // text为null则执行handler，交给handler自己去处理鼠标左右键的情况
                    handler(e)
                }
            }
        }
        element.addEventListener('contextmenu', prevent)
        element.addEventListener('click', prevent)
        element.addEventListener('mousedown', handleMousedown)
        return () => {
            document.removeEventListener('contextmenu', prevent)
            document.removeEventListener('click', prevent)
            document.removeEventListener('mousedown', handleMousedown)
        }
    }

    const ICONS = {
        close: '<svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>',
        jellyfin:
            '<svg class="jv-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="30%" style="stop-color:#AA5CC3;stop-opacity:1" /><stop offset="100%" style="stop-color:#00A4DC;stop-opacity:1" /></linearGradient></defs><path style="fill:url(#grad3)" d="M12 .002C8.826.002-1.398 18.537.16 21.666c1.56 3.129 22.14 3.094 23.682 0C25.384 18.573 15.177 0 12 0zm7.76 18.949c-1.008 2.028-14.493 2.05-15.514 0C3.224 16.9 9.92 4.755 12.003 4.755c2.081 0 8.77 12.166 7.759 14.196zM12 9.198c-1.054 0-4.446 6.15-3.93 7.189.518 1.04 7.348 1.027 7.86 0 .511-1.027-2.874-7.19-3.93-7.19z"/></svg>',
        oof: '<svg class="jv-oof-svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><path fill="#224888" d="M16,0 C24.836556,-1.623249e-15 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 C7.163444,32 1.082166e-15,24.836556 0,16 C-1.082166e-15,7.163444 7.163444,1.623249e-15 16,0 Z"/><path fill="#FFF" d="M21.7114092,7.38461538 C21.6913564,7.38461538 21.6724177,7.38794634 21.654036,7.39294276 C21.6406676,7.39793919 21.6272991,7.40349078 21.6133736,7.4084872 C21.217889,7.55838001 20.644715,7.7204863 20.0097117,7.7204863 C20.0097117,7.7204863 15.0121242,7.7204863 13.9315046,7.7204863 C13.5427043,7.7204863 13.2006937,7.90924021 12.9973813,8.19625717 C12.9957102,8.19958812 10.0769231,13.9971088 10.0769231,13.9971088 C10.0769231,13.9971088 11.5886766,14.1725389 11.6298961,14.1786456 C12.9762145,14.3851646 14.5737491,14.7771065 15.6822198,15.4444071 C17.2752983,16.4037211 18.2706939,17.7977241 18.1698732,19.2944316 C17.974359,22.195135 15.2421737,23.5003127 13.0937458,23.8139773 C11.5853344,24.0227169 10.5838117,23.8139773 10.5838117,23.8139773 C10.5838117,23.8139773 11.8148269,24.5562242 13.588937,24.6106298 C16.6180142,24.7038964 18.9736537,23.4159286 20.2197084,21.5539268 C22.1871046,18.6160278 21.0875463,13.9399274 15.9300939,12.5475898 C14.9408256,12.2805586 13.5672132,12.0279614 13.5672132,12.0279614 L14.3019232,10.5867699 C14.4651302,10.1792835 14.8750972,9.89060104 15.3558059,9.89060104 C15.3780867,9.89060104 15.4003675,9.89171136 15.4226483,9.89282168 L17.8746523,9.89282168 C17.8752093,9.89282168 17.8763234,9.89282168 17.8768804,9.89282168 C17.8774374,9.89282168 17.8785515,9.89282168 17.8802225,9.89282168 L20.0587295,9.89282168 C20.4854071,9.89282168 20.8563828,9.66465151 21.0485548,9.32822544 L21.0691646,9.28825402 L21.8801863,7.70993829 C21.8957829,7.69050774 21.9069233,7.6683014 21.9141646,7.64387442 C21.9197348,7.62610935 21.9230769,7.60778912 21.9230769,7.58835857 C21.9230769,7.47621654 21.8283834,7.38461538 21.7114092,7.38461538 Z"/></g></svg>'
    }

    function getUniqueId() {
        return Math.random().toString(36).slice(2)
    }

    function getIcon(name) {
        if (name === 'jellyfin') {
            const id = getUniqueId()
            return ICONS.jellyfin.replaceAll('grad3', id)
        }
        return ICONS[name]
    }

    function throttle(fn, threshhold = 500, scope) {
        let previous = 0
        return (...args) => {
            const context = scope || this
            const now = Date.now()
            if (now - previous > threshhold) {
                previous = now
                return fn.apply(context, args)
            }
        }
    }

    function notify(title, content, timeout = 3000) {
        log(title, content)
        const element = document.createElement('div')
        element.className = 'jv-notification'
        const texts = [
            timeout && `<span class='jv-close-icon'>${ICONS.close}</span>`,
            title && `<div class='jv-title'>${title}</div>`,
            content && `<div class='jv-content'>${content}</div>`
        ]
        setInnerHTML(element, texts.filter(Boolean).join('\n'))
        const closeIcon = element.querySelector('.jv-close-icon')
        const close = () => {
            element?.remove()
        }
        closeIcon?.addEventListener('click', close)
        document.body.append(element)
        let mouseenter = false
        element.addEventListener('mouseenter', () => {
            mouseenter = true
        })
        let timer = null
        element.addEventListener('mouseleave', () => {
            mouseenter = false
            clearTimeout(timer)
            timer = setTimeout(() => {
                !mouseenter && close()
            }, 500)
        })
        if (timeout > 0) {
            setTimeout(() => {
                !mouseenter && close()
            }, timeout)
        }
        return {
            close,
            element
        }
    }

    function notifyWithConfirm(title, content) {
        return new Promise(resolve => {
            const { close, element } = notify(title, content, 0)
            const confirm = result => () => {
                close()
                resolve(result)
            }
            const footer = document.createElement('div')
            footer.className = 'jv-btn-group'
            const confirmBtn = document.createElement('button')
            const cancelBtn = document.createElement('button')
            confirmBtn.textContent = '确定'
            cancelBtn.textContent = '取消'
            confirmBtn.addEventListener('click', confirm(true))
            cancelBtn.addEventListener('click', confirm(false))
            footer.append(confirmBtn, cancelBtn)
            element.append(footer)
        })
    }

    const throttleNotify = throttle(notify)

    class KeysEvent {
        constructor(eventType = 'keydown', interval = 500) {
            this.interval = interval
            this.inputs = []
            this.eventMap = new Map()

            document.addEventListener(eventType, this.handler)
        }

        handler = e => {
            const now = Date.now()
            const key = e.key.toLowerCase()
            const index = this.inputs.findLastIndex(({ time }) => now - time > this.interval)
            if (index > -1) {
                this.inputs.splice(0, index + 1)
            }
            this.inputs.push({ key, time: now })
            this.trigger()
        }

        trigger = () => {
            const inputKeys = this.inputs.map(input => input.key).join('')
            for (const [keys, listeners] of this.eventMap) {
                const startIndex = inputKeys.indexOf(keys)
                if (startIndex > -1) {
                    try {
                        listeners.forEach(listener => listener())
                        this.inputs.splice(startIndex, keys.length)
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        }

        on = (keys, listener) => {
            if (!keys) return noop
            const listeners = this.eventMap.get(keys)
            if (listeners) {
                // 不允许注册相同的处理函数
                if (!listeners.includes(listener)) {
                    listeners.push(listener)
                }
            } else {
                this.eventMap.set(keys, [listener])
            }
            return () => this.off(keys, listener)
        }

        off = (keys, listener) => {
            const listeners = this.eventMap.get(keys)
            if (!listeners) return
            const index = listeners.findIndex(l => l === listener)
            listeners.splice(index, 1)
        }
    }

    const keysEvent = new KeysEvent()

    class EventEmitter {
        constructor() {
            this.events = {}
        }

        getListeners(eventName) {
            return this.events[eventName] || (this.events[eventName] = [])
        }

        on(eventName, listener) {
            if (typeof listener === 'function') {
                this.getListeners(eventName).push(listener)
            }
        }

        off(eventName, listener) {
            this.events[eventName] = this.getListeners(eventName).filter(item => item !== listener)
        }

        emit(eventName, ...args) {
            this.getListeners(eventName).forEach(cb => {
                try {
                    cb.apply(this, args)
                } catch (error) {
                    log(error)
                }
            })
        }
    }

    const eventEmitter = new EventEmitter()
    const EVENT_Type = {
        clearDom: Symbol(),
        clearEvent: Symbol(),
        startMatch: Symbol()
    }

    class CopySet {
        constructor() {
            this.sets = {}
        }

        getSetByType = type => {
            let innerType = 'code'
            const types = ['magnet', 'ed2k', 'userReg']
            if (types.includes(type)) {
                innerType = type
            }
            return this.sets[innerType] || (this.sets[innerType] = new Set())
        }

        registerCopyEvent = () => {
            const { copyMagnetHotKeys, copyEd2kHotKeys, copyCodeHotKeys, copyUserRegHotKeys } = settings
            const copyEvents = [
                [copyMagnetHotKeys, 'magnet'],
                [copyEd2kHotKeys, 'ed2k'],
                [copyCodeHotKeys, 'code'],
                [copyUserRegHotKeys, 'userReg']
            ]
            const clearEventList = copyEvents.map(([keys, type]) => {
                const set = this.getSetByType(type)
                return keysEvent.on(keys, () => {
                    if (set.size > 0) {
                        const content = Array.from(set.values()).join('\n')
                        GM_setClipboard(content)
                        notify(`成功复制${set.size}条`, content)
                    } else {
                        notify('无内容')
                    }
                })
            })
            eventEmitter.on(EVENT_Type.clearDom, () => {
                Object.values(this.sets).forEach(set => set.clear())
            })
            eventEmitter.on(EVENT_Type.clearEvent, () => {
                clearEventList.forEach(clear => clear())
            })
        }

        setCopySetByType = (type, code) => {
            const set = this.getSetByType(type)
            set.add(code)
        }
    }

    const copySet = new CopySet()

    function compareVersions(version1, version2) {
        const v1 = version1.split('.').map(Number)
        const v2 = version2.split('.').map(Number)

        const maxLength = Math.max(v1.length, v2.length)

        for (let i = 0; i < maxLength; i++) {
            const num1 = v1[i] || 0
            const num2 = v2[i] || 0
            if (num1 > num2) return 1
            if (num1 < num2) return -1
        }
        return 0
    }

    function setStyle(element, styles, isImportant = false) {
        Object.entries(styles).forEach(([key, value]) => {
            element.style.setProperty(key, value, isImportant ? 'important' : '')
        })
    }

    function request(url, { method = 'GET', data, headers = {} } = {}) {
        // log(`请求: ${url}`)
        if (new URL(url).origin === settings.serverUrl) {
            headers['X-Emby-Token'] = settings.apiKey
        }
        const now = Date.now()
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                onload(response) {
                    if (response.status === 200) {
                        try {
                            resolve(JSON.parse(response.responseText))
                            log(`请求成功: ${url}, 耗时: ${Date.now() - now}ms`)
                        } catch (error) {
                            reject(error)
                        }
                    } else {
                        reject(response)
                    }
                },
                onerror: reject
            })
        })
    }

    async function requestWithCookie(url, config = {}) {
        config.headers = { ...config.headers, cookie: oofSettings.cookie }
        const response = await request(url, config)
        if (response.state) {
            return response
        } else {
            notify(response.error || response.error_msg)
            return null
        }
    }

    function getQuery(params) {
        return Object.entries(params)
            .filter(([_, value]) => value != null && value !== '')
            .map(([key, value]) => {
                if (value && typeof value === 'object') {
                    return Object.entries(value)
                        .map(([k, v]) => `${encodeURIComponent(`${key}[${k}]`)}=${encodeURIComponent(v)}`)
                        .join('&')
                } else {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                }
            })
            .join('&')
    }

    function addQuery(base, params) {
        if (!params) return base
        const query = getQuery(params)
        if (!query) return base
        return base.endsWith('?') ? base + query : `${base}?${query}`
    }

    function parseUserPairsToParams(pairs) {
        if (!pairs) return
        return pairs
            .split(/\s*;\s*/)
            .filter(Boolean)
            .map(item => item.split(/\s*[:=]\s*/))
            .reduce((acc, [key, value]) => {
                acc[key] = value
                return acc
            }, {})
    }

    async function searchItems(params) {
        const { serverUrl, userId, extraSearchParams } = settings
        const extraParams = parseUserPairsToParams(extraSearchParams)
        const finalParams = {
            startIndex: 0,
            // fields: 'SortName',
            imageTypeLimit: 1,
            mediaTypes: 'Video',
            includeItemTypes: 'Movie',
            recursive: true,
            sortBy: 'SortName',
            sortOrder: 'Ascending',
            limit: 2,
            enableUserData: true,
            enableImages: false,
            enableTotalRecordCount: false,
            userId,
            ...extraParams,
            ...params
        }
        const url = `${serverUrl}/Items`
        log(params.searchTerm)
        try {
            const response = await request(addQuery(url, finalParams))
            log(response)
            return response.Items
        } catch (error) {
            throttleNotify('请求jellyfin报错', '请检查apiKey与serverUrl是否设置正确', 0)
            console.error(error)
            throw error
        }
    }

    function filterItems(items) {
        const newItems = []
        items.forEach(item => {
            const newItem = { j: item.Id, f: item.UserData?.IsFavorite }
            const localName = localNameList.find(name => item.Name.toLowerCase().startsWith(name))
            if (localName) {
                newItem.c = localName
            } else {
                const { code } = parseFileName({ text: item.Name })
                if (!code) return
                newItem.c = code
            }
            newItems.push(newItem)
        })
        return newItems
    }

    async function fetchItems() {
        const { extraFetchParams } = settings
        const extraParams = parseUserPairsToParams(extraFetchParams)
        const params = {
            sortBy: 'DateCreated',
            sortOrder: 'Descending',
            ...extraParams
        }
        let limit = Number(params.limit)
        if (isNaN(limit)) {
            params.limit = 200
        } else if (limit === 0) {
            params.limit = undefined
        }
        return searchItems(params)
    }

    function chunk(array, process, ...args) {
        return new Promise(resolve => {
            const time = () => {
                if (array.length === 0) {
                    resolve()
                } else {
                    const item = array.shift()
                    process.call(undefined, item, ...args)
                    if (array.length === 0) {
                        resolve()
                    } else {
                        setTimeout(time, 100)
                    }
                }
            }
            time()
        })
    }

    function splitArrayToChunks(array, chunkSize) {
        const chunks = []
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize))
        }
        return chunks
    }

    function saveItemsByKeys(items, keys) {
        if ((items?.length || 0) === 0) return
        const now = Date.now()
        const codeList = items.map(item => item.c)
        const values = GM_getValues(codeList)
        items.forEach(item => {
            const value = values[item.c] || (values[item.c] = {})
            keys.forEach(key => {
                value[key] = item[key]
            })
        })
        GM_setValues(values)
        log(`更新: ${items.length} 个, 用时: ${Date.now() - now}ms`)
    }

    async function asyncSaveItemsByKeys(items, keys) {
        await chunk(splitArrayToChunks(items, 1000), saveItemsByKeys, keys)
    }

    async function saveItems(filteredItems) {
        await asyncSaveItemsByKeys(filteredItems, ['j', 'f'])
    }

    async function saveFiles(filteredFiles) {
        await asyncSaveItemsByKeys(filteredFiles, ['pc'])
    }

    async function initItems() {
        const { close } = notify('正在获取jellyfin条目', '请稍等...', 0)
        try {
            const items = await fetchItems()
            const filteredItems = filterItems(items)
            await saveItems(filteredItems)
            close()
            notify(`已保存${filteredItems.length}个条目`)
        } catch (error) {
            close()
        }
    }

    async function fetchCollectionItems(parentId) {
        const { serverUrl, userId } = settings
        if (serverUrl && userId) {
            try {
                const url = `${serverUrl}/Users/${userId}/Items`
                const res = await request(addQuery(url, { parentId }))
                const items = []
                res.Items.forEach(({ Id, Name, Type }) => {
                    let name, type
                    if (Type === 'Person') {
                        name = Name
                        type = 'person'
                    } else if (Type === 'Movie') {
                        const { code } = parseFileName({ text: Name, fc2Prefix: true })
                        if (code) {
                            name = code
                            type = 'movie'
                        }
                    }
                    if (name) {
                        items.push({ id: Id, name, type })
                    }
                })
                return items
            } catch (error) {
                notify('请求jellyfin报错', '请检查serverUrl、apiKey、userId或parentId是否设置正确')
                console.error(error)
                throw error
            }
        } else {
            notify('请先设置serverUrl、apiKey和userId')
        }
    }

    async function fetchAllCollectionItems() {
        log('fetchAllCollectionItems')
        if (labelList.length === 0) return
        try {
            const promises = labelList.map(async config => {
                if (config.id) {
                    const items = await fetchCollectionItems(config.id)
                    config.items = items
                }
                return config
            })
            const newLabelList = await Promise.all(promises)
            labelList = newLabelList
            GM_setValue('labelList', newLabelList)
            notify('获取集合数据成功')
            return newLabelList
        } catch (error) {
            notify('获取集合数据失败')
            log(error)
        }
    }

    function requireCookie(cb) {
        return (...args) => {
            const { enable, cookie } = oofSettings
            if (enable && !cookie) {
                notify('缺失cookie', '打开115设置, 手动设置cookie; 或者去115登录, 再点击获取cookie')
                return
            }
            return cb.apply(this, args)
        }
    }

    const requiredCookieNames = ['UID', 'CID', 'SEID', 'KID']

    function checkRequiredCookies(cookies) {
        if (!Array.isArray(cookies) || cookies.length === 0) {
            notify('Cookie不存在, 请先登录', '若已登录, 可点击获取Cookie按钮')
            return false
        }
        const lackOfCookieNames = requiredCookieNames.filter(name => !cookies.some(item => item.name === name))
        if (lackOfCookieNames.length > 0) {
            notify(`Cookie缺少: ${lackOfCookieNames.join('、')}`)
            return false
        }
        return true
    }

    function getRequiredCookies(cookies) {
        return cookies.filter(item => requiredCookieNames.includes(item.name))
    }

    function parseCookiesToText(array) {
        return array.map(({ name, value }) => `${name}=${value}`).join(';')
    }

    function parseTextToCookies(text) {
        const cookies = []
        if (!text) return cookies
        text.split(/;\s*/).forEach(item => {
            if (!item) return
            const [name, value] = item.split('=')
            cookies.push({ name, value })
        })
        return cookies
    }

    function parseFileName({ text, fc2Prefix = false }) {
        const fileRegList = getFileRegList()
        for (const { type, reg } of fileRegList) {
            // 排除欧美视频中包含的sample文件
            if (type === 'ou' && text.includes('-sample')) continue
            const match = text.match(reg)
            const code = getCodeByRegType(match, type, fc2Prefix)
            if (code) {
                return { code: code.toLowerCase(), type }
            }
        }
        return {}
    }

    function getStoreKeys() {
        const excludeKeys = ['settings', 'oofSettings', 'localCodeList', 'localNameList', 'labelList', 'versions']
        return GM_listValues().filter(key => !excludeKeys.includes(key))
    }

    async function initOOFFiles(cid, update = false) {
        const storeKeys = getStoreKeys()
        let length = storeKeys.length
        if (storeKeys.includes('oofFiles')) {
            GM_deleteValue('oofFiles')
            length--
        }
        if (length < 10 || update) {
            const files = await getAllOFFFiles({ cid })
            const filteredFiles = filterFiles(files)
            saveFiles(filteredFiles)
        }
    }

    async function sleep(seconds = 1) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000))
    }

    const getAllOFFFiles = requireCookie(async ({ cid = 0 } = {}) => {
        const { close } = notify('正在获取115网盘文件', '请稍等...', 0)
        const limit = parseInt(oofSettings.limit) || parseInt(defaultOOFSettings.limit)
        const baseUrl = 'https://webapi.115.com/files'
        const params = {
            aid: 1,
            cid,
            o: 'user_ptime',
            asc: 0,
            show_dir: 0,
            type: 4,
            format: 'json'
        }
        let files = []
        let count = 1
        let offset = 0
        let pageIndex = 0
        try {
            while (offset < count) {
                const url = addQuery(baseUrl, { ...params, limit, offset })
                const response = await requestWithCookie(url)
                files = files.concat(response.data)
                count = response.count
                offset += limit
                log(`已获取: ${offset}/${count} 条`)
                pageIndex++
                if (offset < count) {
                    await sleep()
                }
            }
            close()
            notify('请求成功', `视频总数量为${count}条, 每次获取${limit}条, 共分了${pageIndex}次请求`)
            log(files)
            return files
        } catch (error) {
            close()
            notify('获取115网盘文件失败')
            console.error(error)
        }
    })

    function getKeyword({ code, text }) {
        const words = [code]
        if (text && text.toLowerCase() !== code.toLowerCase()) {
            words.push(text)
        }
        return words.join('+')
    }

    async function getAndUpdateItem({ item, code, type }) {
        let items = await searchItems({ searchTerm: code, limit: 10 })
        if ((items?.length || 0) === 0 && type === 'num2') {
            items = await searchItems({ searchTerm: code.replaceAll('-', '_'), limit: 10 })
        }
        const filteredItems = filterItems(items || [])
        const filteredItem = filteredItems.find(i => i.c === code)
        if (filteredItem) {
            saveItems([filteredItem])
        } else {
            if (item && item.pc) {
                item.j = null
                item.f = null
                GM_setValue(code, item)
            } else {
                GM_deleteValue(code)
            }
        }

        return filteredItem
    }

    const getAndUpdateFileItem = requireCookie(async ({ item, code, text = '', type }) => {
        const keyword = getKeyword({ code, text, type })
        log(`搜索关键字(${type}): ${keyword}`)
        const params = { search_value: keyword, format: 'json', limit: 30, type: 4 }
        const url = addQuery('https://webapi.115.com/files/search', params)
        const response = await requestWithCookie(url)
        log(response)
        const filteredFiles = filterFiles(response.data)
        log(filteredFiles)
        const filteredItem = filteredFiles.find(f => f.c === code)
        if (filteredItem) {
            saveFiles([filteredItem])
        } else {
            if (item && item.j) {
                item.pc = null
                GM_setValue(code, item)
            } else {
                GM_deleteValue(code)
            }
        }
        return filteredItem
    })

    function filterFiles(files) {
        const newFiles = []
        files.forEach(file => {
            // if (!file.play_long) return
            const localName = localNameList.find(name => file.n.toLowerCase().startsWith(name))
            if (localName) {
                file.c = localName
            } else {
                const { code, type } = parseFileName({ text: file.n })
                if (!code) return
                file.c = code
                file.type = type
            }
            newFiles.push(file)
        })
        return newFiles
    }

    const moveFiles = requireCookie(async (srcId, destId, ouTargetCid) => {
        if (!srcId || !destId) {
            notify('移动失败', '请设置移动源和目标目录')
            return
        }
        const srcFiles = await getAllOFFFiles({ cid: srcId })
        const filteredFiles = filterFiles(srcFiles)
        log(filteredFiles)
        if (filteredFiles.length === 0) {
            notify('源目录为空')
            return
        }
        const commonFidList = []
        const ouFidList = []
        filteredFiles.forEach(file => {
            if (ouTargetCid && file.type === 'ou') {
                ouFidList.push(file.fid)
            } else {
                commonFidList.push(file.fid)
            }
        })
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: getQuery({ pid: destId, fid: commonFidList })
        }
        const ouConfig = {
            ...config,
            data: getQuery({ pid: ouTargetCid, fid: ouFidList })
        }
        try {
            const response = await requestWithCookie('https://webapi.115.com/files/move', config)
            if (ouTargetCid) {
                await requestWithCookie('https://webapi.115.com/files/move', ouConfig)
            }
            log(response)
            notify('移动成功', `共移动了${filteredFiles.length}/${srcFiles.length}个文件`)
            saveFiles(filteredFiles)
        } catch (error) {
            notify('移动失败')
            console.error(error)
        }
    })

    const deleteFile = requireCookie(async ({ code, type, item, text }) => {
        const file = await getAndUpdateFileItem({ code, type, text })
        if (!file) {
            notify('删除失败', '未找到对应的115文件')
            return
        }
        if (file.pc !== item.pc) {
            notify('删除失败', '文件不匹配, 请去115页面手动删除')
            return
        }
        const confirm = await notifyWithConfirm(`确定从115中删除 ${file.n} 吗?`)
        if (!confirm) return
        const url = 'https://webapi.115.com/rb/delete'
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: getQuery({ fid: [file.fid], ignore_warn: 1 })
        }
        try {
            await requestWithCookie(url, config)
            if (item.j) {
                item.pc = null
                GM_setValue(code, item)
            } else {
                GM_deleteValue(code)
            }

            notify('删除成功', file.n)
            return true
        } catch (error) {
            notify('删除失败')
            console.error(error)
            return false
        }
    })

    function convertFormValue(value) {
        const switchMap = new Map([
            ['true', true],
            ['false', false],
            ['undefined', undefined],
            ['null', null]
            // ['', undefined]
        ])
        if (switchMap.has(value)) {
            return switchMap.get(value)
        }
        return value
    }

    class ConfigModal {
        constructor({ title = '设置', getFormData = noop, onSubmit, onShow, extraButtons, defaultData, buildItems }) {
            this.title = title
            this.getFormData = getFormData
            this.onSubmit = onSubmit
            this.onShow = onShow
            this.extraButtons = extraButtons
            this.defaultData = defaultData
            this.buildItems = buildItems
            this.initialized = false
        }

        init = () => {
            this.formData = this.getFormData()

            const modal = this.create()

            const form = modal.querySelector('.jv-form')
            const submitBtn = modal.querySelector('.jv-submit')
            const cancelBtn = modal.querySelector('.jv-cancel')
            const closeIcon = modal.querySelector('.jv-close-icon')

            submitBtn.addEventListener('click', this.submit)
            closeIcon.addEventListener('click', this.hide)
            cancelBtn.addEventListener('click', this.hide)
            this.modal = modal
            this.form = form

            this.buildExtraButtons()
            this.makeDraggable()

            document.body.append(this.modal)
            this.initialized = true
        }

        makeDraggable = () => {
            let offsetX = 0
            let offsetY = 0
            const titleBar = this.modal.querySelector('.jv-title')
            titleBar.draggable = true
            this.modal.addEventListener('mousedown', () => {
                const modals = document.querySelectorAll('.jv-modal')
                modals.forEach(modal => {
                    if (modal !== this.modal) {
                        modal.style.zIndex = 1100
                    }
                })
                this.modal.style.zIndex = 1101
            })
            titleBar.addEventListener('dragstart', e => {
                offsetX = e.clientX - this.modal.offsetLeft
                offsetY = e.clientY - this.modal.offsetTop
                e.dataTransfer.setData('text/plain', '')
                e.dataTransfer.setDragImage(new Image(), 0, 0)
                e.dataTransfer.dropEffect = 'move'
                e.dataTransfer.effectAllowed = 'move'
            })

            document.addEventListener('dragover', e => {
                if (e.target === titleBar) {
                    e.preventDefault()
                    const newX = e.clientX - offsetX
                    const newY = e.clientY - offsetY
                    this.modal.style.left = `${newX}px`
                    this.modal.style.top = `${newY}px`
                }
            })
        }

        buildExtraButtons = () => {
            if (!this.extraButtons) return
            const btnGroup = document.createElement('div')
            btnGroup.className = 'jv-btn-group'
            const btnFragment = document.createDocumentFragment()
            this.extraButtons.forEach(({ withCtrl = true, onclick, ...others }) => {
                const btn = document.createElement('button')
                if (onclick) {
                    addClickEvent({
                        element: btn,
                        withCtrl,
                        handler: onclick.bind(this)
                    })
                }
                Object.entries(others).forEach(([key, value]) => {
                    btn[key] = value
                })
                btnFragment.append(btn)
            })
            btnGroup.append(btnFragment)
            this.form.after(btnGroup)
        }

        buildFormItems = () => {
            if (this.buildItems) return this.buildItems(this.formData)

            return Object.keys(this.defaultData)
                .map(key => {
                    const id = `jv-label-id-${key}`
                    let value = this.formData[key]
                    value = value == null ? '' : value
                    return `
                    <div class='jv-form-item'>
                        <label for='${id}'>${key}: </label>
                        <input type='text' name='${key}' value='${value}' id='${id}'/>
                    </div>
                `
                })
                .join('\n')
        }

        create = () => {
            const modal = document.createElement('div')
            modal.className = 'jv-modal'
            const html = `
            <div class='jv-close-icon'>${ICONS.close}</div>
            <div class='jv-section'>
                <div class='jv-title'>${this.title}</div>
                <form class='jv-form'></form>
                <div class='jv-btn-group'>
                    <button class='jv-submit'>确定</button>
                    <button class='jv-cancel'>取消</button>
                </div>
            </div>`
            setInnerHTML(modal, html)
            return modal
        }

        show = title => {
            if (title) {
                this.title = title
            }
            if (!this.initialized) {
                this.init()
            }
            this.modal.style.display = 'block'
            this.onShow?.()
            this.refresh(this.formData)
        }

        hide = () => {
            this.modal.style.display = 'none'
        }

        refresh = (formData, isUpdate = false) => {
            if (isUpdate) {
                this.formData = {
                    ...this.getRealTimeFormData(),
                    ...formData
                }
            } else {
                this.formData = formData
            }

            const formItems = this.buildFormItems()
            if (typeof formItems === 'string') {
                setInnerHTML(this.form, formItems)
            } else {
                this.form.replaceChildren(formItems)
            }
        }

        getRealTimeFormData = () => {
            const formData = new FormData(this.form)
            const data = {}
            for (const [key, value] of formData) {
                data[key] = convertFormValue(value.trim())
            }
            return data
        }

        submit = async () => {
            const data = this.getRealTimeFormData()
            this.formData = data
            const shouldHide = await this.onSubmit?.(data)
            if (shouldHide !== false) {
                this.hide()
            }
        }
    }

    function getRandomColor() {
        return ((Math.random() * 0x1000000) << 0).toString(16).padStart(7, '#000000')
    }

    function parseLabelData(formData) {
        return Object.entries(formData).reduce((acc, [key, value = '']) => {
            const [prop, index] = key.split('-')
            acc[index] = acc[index] || {}
            acc[index][prop] = value
            acc[index] = {
                ...acc[index],
                [prop]: value
            }
            return acc
        }, [])
    }

    const labelModal = new ConfigModal({
        buildItems() {
            const fragment = document.createDocumentFragment()
            this.formData.forEach((item, index) => {
                const formItem = document.createElement('div')
                formItem.className = 'jv-form-item jv-form-label-item'
                Object.entries(item).forEach(([key, value]) => {
                    if (key === 'items') return
                    const input = document.createElement('input')
                    input.name = `${key}-${index}`
                    input.value = value
                    input.placeholder = key
                    formItem.append(input)
                })
                const deleteIcon = document.createElement('span')
                setStyle(deleteIcon, { cursor: 'pointer' })
                setInnerHTML(deleteIcon, ICONS.close)
                addClickEvent({
                    element: deleteIcon,
                    handler: () => {
                        const realFormData = this.getRealTimeFormData()
                        const newLabelList = parseLabelData(realFormData)
                        newLabelList.splice(index, 1)
                        this.refresh(newLabelList)
                    }
                })
                formItem.append(deleteIcon)
                fragment.append(formItem)
            })
            return fragment
        },
        extraButtons: [
            {
                textContent: '添加标签',
                onclick() {
                    const realFormData = this.getRealTimeFormData()
                    const newLabelList = parseLabelData(realFormData)
                    this.refresh([...newLabelList, { id: '', title: '', color: getRandomColor(), order: '1' }])
                }
            }
        ],
        async onSubmit() {
            const realFormData = this.getRealTimeFormData()
            const realLabelList = parseLabelData(realFormData)

            const newLabelList = realLabelList.map(r => {
                const label = labelList.find(l => l.id === r.id)
                if (label) {
                    return { ...r, items: label.items }
                }
                return r
            })
            log(newLabelList)
            labelList = newLabelList
            GM_setValue('labelList', newLabelList)
        },
        onShow() {
            this.formData = getLabelList()
        }
    })

    const configModal = new ConfigModal({
        defaultData: defaultSettings,
        getFormData: getSettings,
        onSubmit(formData) {
            settings = formData
            GM_setValue('settings', formData)
            notify('设置成功')
            restart()
        }
    })

    const oofModal = new ConfigModal({
        defaultData: defaultOOFSettings,
        getFormData: getOOFSettings,
        async onSubmit(formData) {
            const { cookie, expiresIn, enable } = formData
            if (enable && location.hostname === '115.com') {
                const cookies = parseTextToCookies(cookie)
                const checked = checkRequiredCookies(cookies)
                if (!checked) return false
                const requiredCookies = getRequiredCookies(cookies)
                const expires = parseInt(expiresIn) || 30
                for (const { name, value } of requiredCookies) {
                    try {
                        await GM.cookie.set({
                            name,
                            value,
                            domain: '.115.com',
                            path: '/',
                            secure: false,
                            httpOnly: true,
                            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * expires
                        })
                    } catch (error) {
                        console.error(error)
                        notify('设置Cookie失败')
                        return
                    }
                }
                formData.cookie = parseCookiesToText(requiredCookies)
            }
            oofSettings = formData
            GM_setValue('oofSettings', formData)
            notify('设置成功')
            restart()
        },
        extraButtons: [
            {
                textContent: '获取115Cookie',
                async onclick() {
                    if (location.hostname !== '115.com') {
                        notify('请在115页面上获取Cookie')
                        return
                    }
                    try {
                        const cookies = await GM.cookie.list({ domain: '.115.com' })
                        log(cookies)
                        const checked = checkRequiredCookies(cookies)
                        if (!checked) return
                        const requiredCookies = getRequiredCookies(cookies)
                        const cookieText = parseCookiesToText(requiredCookies)
                        notify('获取Cookie成功')
                        oofModal.refresh({ cookie: cookieText }, true)
                    } catch (error) {
                        console.error(error)
                    }
                }
            },
            {
                textContent: `刷新缓存`,
                async onclick() {
                    const confirm = await notifyWithConfirm('确定刷新115缓存吗?')
                    if (confirm) {
                        const { close } = notify('正在刷新', '请不要离开页面', 0)
                        const { fetchCid } = oofSettings
                        try {
                            await initOOFFiles(fetchCid, true)
                            notify('刷新成功')
                        } catch (error) {
                            log(error)
                            notify('刷新失败')
                        } finally {
                            close()
                        }
                    }
                }
            },
            {
                textContent: '批量移动',
                onclick() {
                    const formData = this.getRealTimeFormData()
                    const [srcId, destId] = formData.move.split(/\s*:\s*/).map(item => item.trim())
                    moveFiles(srcId, destId, formData.ouTargetCid)
                }
            }
        ]
    })

    const localCodeModal = new ConfigModal({
        buildItems(formData) {
            return `
                <textarea name='localCodeList' style='width: 1100px; height: 500px;' id='jv-local-code-textarea'>${formData.localCodeList.join(', ')}</textarea>
            `
        },
        getFormData: () => ({ localCodeList: getLocalCodeList() }),
        onSubmit(formData) {
            const newLocalCodeList = formData.localCodeList
                .split(/[,;\s、]\s*/)
                .map(text => {
                    const { code } = parseFileName({ text })
                    return code
                })
                .filter(Boolean)

            localCodeList = newLocalCodeList
            GM_setValue('localCodeList', newLocalCodeList)
            this.refresh({ localCodeList: newLocalCodeList })
            notify('设置成功', `共设置番号${newLocalCodeList.length}个`)
            restart()
        }
    })

    const localNameModal = new ConfigModal({
        buildItems(formData) {
            return `
                <textarea name='localNameList' style='width: 1100px; height: 500px;' id='jv-local-name-textarea'>${formData.localNameList ? formData.localNameList.join('\n') : ''}</textarea>
            `
        },
        getFormData: () => ({ localNameList: getLocalNameList() }),
        onSubmit(formData) {
            const newLocalNameList = formData.localNameList
                ? formData.localNameList
                      .split('\n')
                      .map(name => name.toLowerCase().trim())
                      .filter(Boolean)
                : []
            localNameList = newLocalNameList
            GM_setValue('localNameList', newLocalNameList)
            this.refresh({ localNameList: newLocalNameList })
            notify('设置成功', `共设置自定义名称${newLocalNameList.length}个`)
            restart()
        }
    })

    function addLocalIcon(link) {
        if (!link) return
        if (link.querySelector('.jv-local-icon')) return
        const icon = document.createElement('span')
        icon.className = 'jv-local-icon'
        icon.textContent = 'L'
        addClickEvent({ element: icon })
        link.append(icon)
    }

    function convertTextToElement(text) {
        const div = document.createElement('div')
        setInnerHTML(div, text)
        return div.firstChild
    }

    async function getItem(itemId) {
        const { serverUrl, userId } = settings
        const url = userId ? `${serverUrl}/Users/${userId}/Items/${itemId}` : `${serverUrl}/Items/${itemId}`
        const response = await request(url)
        log(response)
        return response
    }

    async function getPlaybackInfo(itemId) {
        const { serverUrl } = settings
        const url = `${serverUrl}/Items/${itemId}/PlaybackInfo`
        const response = await request(url, { method: 'POST' })
        log(response)
        return response
    }

    function sendDataToLocalServer(data, path) {
        const url = `http://127.0.0.1:58000/${path}/`
        request(url, { data: JSON.stringify(data), method: 'POST' })
    }

    async function playByItemId(itemId) {
        const { serverUrl, userId, deviceId, apiKey } = settings
        const [detail, playbackData] = await Promise.all([getItem(itemId), getPlaybackInfo(itemId)])
        if (detail && playbackData) {
            const data = {
                ApiClient: {
                    _serverAddress: serverUrl,
                    _serverVersion: '10.10.6'
                },
                playbackData,
                playbackUrl: addQuery(`${serverUrl}/Items/${itemId}/PlaybackInfo`, {
                    StartTimeTicks: 0,
                    UserId: userId
                }),
                request: { headers: { Authorization: `DeviceId=${deviceId},Token=${apiKey}` } },
                mountDiskEnable: true,
                extraData: {
                    mainEpInfo: detail,
                    gmInfo: GM_info,
                    episodesInfo: null,
                    playlistInfo: null
                }
            }
            sendDataToLocalServer(data, 'embyToLocalPlayer')
        }
    }

    function handleIconClick(itemId, url) {
        const { deviceId } = settings
        return async e => {
            if (deviceId) {
                if (e.shiftKey) {
                    openTab(url, e.ctrlKey)
                } else {
                    playByItemId(itemId)
                }
            } else {
                openTab(url, e.ctrlKey)
            }
        }
    }

    let removeCheckIconEvents
    async function checkIcon({ link, code, type, forceCheck, update, item }) {
        const icon = link?.querySelector('.jv-svg')
        const favIcon = link?.querySelector('.jv-favorite-btn')
        if (!forceCheck && icon) return true
        const fetchedItem = forceCheck ? await getAndUpdateItem({ item, code, type }) : item
        const isExist = Boolean(fetchedItem && fetchedItem.j)
        if (!update || !link) return isExist
        if (isExist) {
            const { serverUrl, showFavoriteBtn, userId } = settings
            const svgIcon = getIcon('jellyfin')
            const url = `${serverUrl}/web/index.html#!/details?id=${fetchedItem.j}`
            const bindEvent = (innerIcon, innerFavIcon) => {
                const removeIconEvent = addClickEvent({
                    element: innerIcon,
                    handler: handleIconClick(fetchedItem.j, url),
                    copyText: url
                })
                let removeFavIconEvent
                if (innerFavIcon) {
                    removeFavIconEvent = addClickEvent({
                        element: innerFavIcon,
                        handler: async () => {
                            let favUrl = `${serverUrl}/Users/${userId}/FavoriteItems/${fetchedItem.j}`
                            if (fetchedItem.f) {
                                await request(favUrl, { method: 'DELETE' })
                                innerFavIcon.classList.remove('jv-is-favorite')
                                fetchedItem.f = false
                            } else {
                                await request(favUrl, { method: 'POST' })
                                innerFavIcon.classList.add('jv-is-favorite')
                                fetchedItem.f = true
                            }
                            saveItems([{ j: fetchedItem.j, f: fetchedItem.f, c: code }])
                        }
                    })
                }
                removeCheckIconEvents = () => {
                    removeIconEvent()
                    removeFavIconEvent?.()
                }
            }
            if (icon) {
                removeCheckIconEvents?.()
                bindEvent(icon, favIcon)
            } else {
                const newIcon = convertTextToElement(svgIcon)
                let newFavIcon
                link.append(newIcon)
                if (showFavoriteBtn && userId) {
                    newFavIcon = document.createElement('span')
                    newFavIcon.className = 'jv-favorite-btn'
                    if (fetchedItem.f) {
                        newFavIcon.classList.add('jv-is-favorite')
                    }
                    link.append(newFavIcon)
                }
                bindEvent(newIcon, newFavIcon)
            }
        } else {
            icon?.remove()
            favIcon?.remove()
        }
        return isExist
    }

    async function checkCodeExist({ link, code, text, updateIcon, type }) {
        const { localCodeEnable, forceShowLocalBtn } = settings
        const { enable: oofEnable, forceShowOOFBtn } = oofSettings
        const item = GM_getValue(code, null)
        const conditions = [
            {
                andCondition: isEnableInJellyfin(),
                orCondition: false,
                cb: () => {
                    return checkIcon({ link, code, type, forceCheck: false, update: updateIcon, item })
                }
            },
            {
                andCondition: oofEnable,
                orCondition: oofEnable && forceShowOOFBtn,
                cb: () => {
                    return checkOOFIcon({ item, link, code, text, type, forceCheck: false, update: updateIcon })
                }
            },
            {
                andCondition: localCodeEnable,
                orCondition: localCodeEnable && forceShowLocalBtn,
                cb: () => {
                    let exist = false
                    if (type) {
                        if (type === 'fc2') {
                            code = `fc2-${code}`
                        }
                        exist = localCodeList.includes(code)
                    } else {
                        exist = localCodeList.some(localCode => localCode.includes(code))
                    }
                    if (updateIcon && exist) {
                        addLocalIcon(link)
                    }
                    return exist
                }
            }
        ]
        let isExist = false
        for (const { andCondition, orCondition, cb } of conditions) {
            if ((!isExist && andCondition) || orCondition) {
                const result = await cb()
                isExist = isExist || result
            }
        }
        return isExist
    }

    function findCode(boxSelector, codeSelector) {
        const { apiKey, serverUrl, reverseEmphasis, emphasisOutlineStyle } = settings
        if (isEnableInJellyfin() && (!apiKey || !serverUrl)) {
            notify('缺少必填项', '填写apiKey和serverUrl或者关闭jellyfin功能')
            configModal.show()
            return
        }
        const run = () => {
            const boxes = document.querySelectorAll(boxSelector)
            boxes.forEach(async box => {
                if (box.hasAttribute('data-jv-outline')) return
                let code = typeof codeSelector === 'function' ? codeSelector(box) : box.querySelector(codeSelector)?.textContent
                if (!code) return
                box.setAttribute('data-jv-outline', box.style.outline)
                box.setAttribute('data-jv-outline-priority', box.style.getPropertyPriority('outline'))
                const { code: parsedCode, type } = parseFileName({ text: code })
                code = code.toLowerCase()
                const isExist = await checkCodeExist({ link: null, code: parsedCode || code, text: code, updateIcon: false, type })
                if ((!reverseEmphasis && !isExist) || (reverseEmphasis && isExist)) {
                    setStyle(box, { outline: emphasisOutlineStyle }, true)
                }
            })
        }
        const clear = () => {
            const boxes = document.querySelectorAll(boxSelector)
            boxes.forEach(box => {
                const outline = box.getAttribute('data-jv-outline')
                const priority = box.getAttribute('data-jv-outline-priority')
                box.removeAttribute('data-jv-outline')
                box.removeAttribute('data-jv-outline-priority')
                setStyle(box, { outline }, priority)
            })
        }

        return { run, clear }
    }

    function openSiteByParams(site, params, e) {
        if (!site) return
        const entries = Object.entries(params)
        const url = entries.reduce((acc, [key, value]) => acc.replaceAll(`\${${key}}`, value), site)
        if (e.button === 0) {
            openTab(url, e.ctrlKey)
        } else if (e.button === 2) {
            copy({ text: url })
        }
    }

    function handleOOFIconClick({ item, link, code, type, text }) {
        return async e => {
            if (e.altKey) {
                const success = await deleteFile({ code, type, item, text })
                if (success) {
                    link.querySelector('.jv-oof-svg')?.remove()
                }
            } else {
                const { openSite, secondarySite } = oofSettings
                openSiteByParams(e.shiftKey ? secondarySite : openSite, { pickcode: item.pc }, e)
            }
        }
    }

    let removeOOFIconEvent
    async function checkOOFIcon({ link, code, text, type, forceCheck, update, item }) {
        const oofIcon = link?.querySelector('.jv-oof-svg')
        if (!forceCheck && oofIcon) return true
        const fileItem = forceCheck ? await getAndUpdateFileItem({ item, code, text, type }) : item
        if (!update || !link) return Boolean(fileItem && fileItem.pc)
        if (fileItem && fileItem.pc) {
            const bindEvent = innerOOFIcon => {
                removeOOFIconEvent = addClickEvent({
                    element: innerOOFIcon,
                    handler: handleOOFIconClick({ item: fileItem, link, code, type, text }),
                    copyText: null
                })
            }

            if (oofIcon) {
                removeOOFIconEvent?.()
                bindEvent(oofIcon)
            } else {
                const newOOFIcon = convertTextToElement(ICONS.oof)
                bindEvent(newOOFIcon)
                link.append(newOOFIcon)
            }
            return true
        } else {
            oofIcon?.remove()
            return false
        }
    }

    const getUserId = requireCookie(() => {
        const match = oofSettings.cookie.match(/UID=(\d+)_/)
        const userId = match?.[1]
        log(`userId为: ${userId}`)
        return userId
    })

    const addOfflineTask = requireCookie(async magnet => {
        const userId = getUserId()
        if (!userId) {
            notify('未获取到UID, 请检查Cookie')
            return
        }
        const { close } = notify('正在添加离线任务', magnet, 0)
        try {
            const { offlineCid } = oofSettings
            const data = { url: magnet, uid: userId, wp_path_id: offlineCid || null }
            const response = await requestWithCookie('https://115.com/web/lixian/?ct=lixian&ac=add_task_url', {
                method: 'POST',
                data: getQuery(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            log(response)
            if (response.state) {
                notify('离线任务添加成功', '按住alt并单击对应的番号链接, 即可看到在线观看按钮')
            } else {
                notify('离线任务添加失败', response.error_msg)
            }
        } catch (error) {
            // notify('离线失败')
            console.error(error)
        } finally {
            close()
        }
    })

    function addOfflineBtn(parent, magnet) {
        const { enable } = oofSettings
        if (!enable) return
        if (parent.querySelector('.jv-oof-btn')) return
        const button = document.createElement('button')
        button.className = 'jv-oof-btn'
        button.textContent = '115离线'
        addClickEvent({
            element: button,
            handler: () => addOfflineTask(magnet),
            url: magnet,
            withCtrl: true,
            copyText: magnet
        })
        parent.append(button)
    }

    function getLinkColorByType(type) {
        const { linkColor, magnetColor, userRegColor } = settings
        if (type === 'userReg') return userRegColor
        if (isTypeMagnetLike(type)) return magnetColor
        return linkColor
    }

    function handleLinkClick(text, code, type) {
        return async e => {
            const isMagnetLike = isTypeMagnetLike(type)
            const link = e.target
            const { linkVisitedColor, linkExistColor, openSite, secondarySite, fc2Site, secondaryFc2Site } = settings
            const { enable: oofEnable } = oofSettings
            if (isMagnetLike) {
                if (type === 'magnet') {
                    window.open(code, '_self')
                }
            } else {
                const item = GM_getValue(code, null)
                if (oofEnable && e.altKey) {
                    const isExsit = await checkOOFIcon({ link, code, text, type, forceCheck: true, update: true, item })
                    if (isExsit) {
                        setStyle(link, { color: linkExistColor })
                    } else {
                        notify(`${code}在你的115中不存在`)
                    }
                } else if (e.ctrlKey) {
                    // if (!isEnableInJellyfin()) return
                    const isExsit = await checkIcon({ link, code, type, forceCheck: true, update: true, item })
                    if (isExsit) {
                        setStyle(link, { color: linkExistColor })
                    } else {
                        notify(`${code}在你的jellyfin中不存在`)
                    }
                } else {
                    setStyle(link, { color: linkVisitedColor })
                    if (type === 'fc2') {
                        openSiteByParams(e.shiftKey ? secondaryFc2Site || fc2Site : fc2Site, { code }, e)
                    } else {
                        openSiteByParams(e.shiftKey ? secondarySite || openSite : openSite, { code }, e)
                    }
                }
            }
        }
    }

    function createLink(text, code, type) {
        const link = document.createElement('a')
        link.append(text)
        link.className = 'jv-link'
        link.setAttribute('data-jv-code', code)
        const { linkExistColor } = settings
        const { enable: oofEnable } = oofSettings
        const isMagnetLike = isTypeMagnetLike(type)
        copySet.setCopySetByType(type, code)
        if (oofEnable && isMagnetLike) {
            addOfflineBtn(link, code)
        }
        addClickEvent({
            element: link,
            handler: handleLinkClick(text, code, type),
            copyText: code,
            copyDesc: `复制成功: ${code} ${type}`
        })
        const linkColor = getLinkColorByType(type)
        if (isMagnetLike) {
            setStyle(link, { color: linkColor })
        } else {
            checkCodeExist({ link, code, text, updateIcon: true, type }).then(isExist => {
                const linkColor = getLinkColorByType(type)
                setStyle(link, { color: isExist ? linkExistColor : linkColor })
            })
        }
        return link
    }

    function replaceCodeWithLink(text, regItem) {
        const { type, reg } = regItem
        let match = reg.exec(text)
        if (!match) return null
        const fragment = document.createDocumentFragment()
        let lastIndex = 0
        while (match) {
            const textBeforeMatch = text.slice(lastIndex, match.index)
            if (textBeforeMatch.length > 0) {
                fragment.append(textBeforeMatch)
            }
            let code = getCodeByRegType(match, type)
            code = code.toLowerCase()
            const link = createLink(match[0], code, type)
            fragment.append(link)
            lastIndex = reg.lastIndex
            match = reg.exec(text)
        }
        const remainingText = text.slice(lastIndex)
        if (remainingText.length > 0) {
            fragment.append(remainingText)
        }
        return fragment
    }

    function replaceNameWithLink(text) {
        text = text.toLowerCase()
        const fragment = document.createDocumentFragment()
        let isNull = true
        let lastIndex = 0
        const textLength = text.length
        for (const localName of localNameList) {
            if (lastIndex >= textLength) {
                break
            }
            const matchIndex = text.indexOf(localName, lastIndex)
            if (matchIndex > -1) {
                isNull = false
                const textBeforeMatch = text.slice(lastIndex, matchIndex)
                if (textBeforeMatch.length > 0) {
                    fragment.append(textBeforeMatch)
                }
                const link = createLink(localName, localName, 'localName')
                fragment.append(link)
                lastIndex = matchIndex + localName.length
            }
        }
        const remainingText = text.slice(lastIndex)
        if (remainingText.length > 0) {
            fragment.append(remainingText)
        }
        return isNull ? null : fragment
    }

    function createLabelLink(item, label, matchedText) {
        const link = document.createElement('a')
        link.className = 'jv-label'
        link.setAttribute('data-jv-label-order', label.order)
        const labelLink = document.createElement('a')
        labelLink.className = 'jv-label-link'
        labelLink.textContent = label.title
        setStyle(labelLink, { color: label.color })
        const { serverUrl } = settings
        const labelUrl = `${serverUrl}/web/index.html#/details?id=${label.id}`
        const itemUrl = `${serverUrl}/web/index.html#/details?id=${item.id}`
        addClickEvent({
            element: labelLink,
            handler: e => openTab(labelUrl, e.ctrlKey),
            copyText: labelUrl
        })

        link.append(labelLink)

        if (item.type === 'person') {
            const nameLink = document.createElement('a')
            nameLink.className = 'jv-label-text'
            nameLink.textContent = matchedText
            addClickEvent({
                element: nameLink,
                handler: e => openTab(itemUrl, e.ctrlKey),
                copyText: matchedText
            })
            link.append(nameLink)
        } else {
            const textRegList = getTextRegList()
            for (const regItem of textRegList) {
                const codeFragment = replaceCodeWithLink(matchedText, regItem)
                if (codeFragment) {
                    link.append(codeFragment)
                    break
                }
            }
        }
        addClickEvent({ element: link })
        return link
    }

    function replaceTextWithLabel(text) {
        if (!labelList || labelList.length === 0) return null
        const fragment = document.createDocumentFragment()
        let isNull = true
        let lastIndex = 0
        const textLength = text.length
        for (const label of labelList) {
            for (const item of label.items) {
                if (lastIndex >= textLength) {
                    break
                }
                const matchIndex = text.toLowerCase().indexOf(item.name.toLowerCase(), lastIndex)
                if (matchIndex > -1) {
                    isNull = false
                    const textBeforeMatch = text.slice(lastIndex, matchIndex)
                    if (textBeforeMatch.length > 0) {
                        fragment.append(textBeforeMatch)
                    }
                    const matchedText = text.slice(matchIndex, matchIndex + item.name.length)
                    const link = createLabelLink(item, label, matchedText)
                    fragment.append(link)
                    lastIndex = matchIndex + matchedText.length
                }
            }
        }
        const remainingText = text.slice(lastIndex)
        if (remainingText.length > 0) {
            fragment.append(remainingText)
        }
        return isNull ? null : fragment
    }

    function handleTextNode(node) {
        const { labelEnable } = settings
        const text = node.nodeValue
        if (!text.trim()) return
        const parent = node.parentNode
        if (parent) {
            const textOverflow = getComputedStyle(parent).textOverflow
            if (textOverflow !== 'clip') {
                parent.setAttribute('data-jv-textOverflow', textOverflow)
                setStyle(parent, { 'text-overflow': 'clip' }, true)
            }
        }
        if (labelEnable) {
            const labelFragment = replaceTextWithLabel(text)
            if (labelFragment) {
                node.replaceWith(labelFragment)
            }
        }
        const textRegList = getTextRegList()
        for (const regItem of textRegList) {
            const codeFragment = replaceCodeWithLink(text, regItem)
            if (codeFragment) {
                node.replaceWith(codeFragment)
                break
            }
        }

        const nameFragment = replaceNameWithLink(text)
        if (nameFragment) {
            node.replaceWith(nameFragment)
        }
    }

    function traverseTextNodes(handler) {
        log('开始遍历所有文本')
        const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT, node => {
            const parent = node.parentNode
            if (
                (parent.tagName.toLowerCase() === 'a' && parent.hasAttribute('data-jv-code')) ||
                parent.id === 'jv-local-code-textarea' ||
                parent.id === 'jv-local-name-textarea' ||
                parent.className === 'jv-label-link' ||
                parent.className === 'jv-label-text' ||
                parent.className === 'jv-label'
            ) {
                return NodeFilter.FILTER_SKIP
            }
            return NodeFilter.FILTER_ACCEPT
        })
        let node
        while ((node = iterator.nextNode()) !== null) {
            handler(node)
        }
    }

    function handleLink(node) {
        const href = node.getAttribute('href')
        if (!href) return
        const LinkRegList = getLinkRegList()
        for (const { type, reg } of LinkRegList) {
            const match = href.match(reg)
            if (match) {
                copySet.setCopySetByType(type, match[0])
                addOfflineBtn(node, match[0])
                return
            }
        }
    }

    function traverseLinks(handler) {
        log('开始遍历所有链接')
        const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, node => {
            if (node.tagName.toLowerCase() !== 'a' || node.hasAttribute('data-jv-code')) return NodeFilter.FILTER_SKIP
            return NodeFilter.FILTER_ACCEPT
        })
        let node
        while ((node = iterator.nextNode()) !== null) {
            handler(node)
        }
    }

    function traverse() {
        log('traverse...')
        traverseTextNodes(handleTextNode)
        if (oofSettings.enable) {
            traverseLinks(handleLink)
        }
    }

    function startSpecialMatch() {
        const { hotKeys, triggerOnload } = settings
        for (const config of CONFIG) {
            const { site, cb } = config
            if (!site.test(location.href)) continue
            log('网址匹配路径正则, 将额外显示一个边框')
            const { run, clear } = cb()
            if (triggerOnload) {
                run()
            }
            eventEmitter.on(EVENT_Type.clearDom, clear)
            eventEmitter.on(EVENT_Type.clearEvent, keysEvent.on(hotKeys, run))
        }
    }

    function clearOOFBtns() {
        const btns = document.querySelectorAll('.jv-oof-btn')
        btns.forEach(btn => btn.remove())
    }

    function clearLabels() {
        const labels = document.querySelectorAll('.jv-label')
        labels.forEach(label => {
            const parent = label.parentNode
            const text = label.querySelector('.jv-label-text') || label.querySelector('.jv-link')
            label.replaceWith(text.firstChild)
            parent.normalize()
        })
    }

    function clearCommonMatchDoms() {
        clearLabels()
        const links = document.querySelectorAll('.jv-link')
        links.forEach(link => {
            const parent = link.parentNode
            if (parent.hasAttribute('data-jv-textOverflow')) {
                const textOverflow = parent.getAttribute('data-jv-textOverflow')
                parent.removeAttribute('data-jv-textOverflow')
                setStyle(parent, { 'text-overflow': textOverflow })
            }
            link.replaceWith(link.firstChild)
            parent.normalize()
        })
        clearOOFBtns()
    }

    function startCommonMatch() {
        const { hotKeys, triggerOnload } = settings
        if (triggerOnload) {
            traverse()
        }
        eventEmitter.on(EVENT_Type.clearEvent, keysEvent.on(hotKeys, traverse))
        eventEmitter.on(EVENT_Type.clearDom, clearCommonMatchDoms)
    }

    function sortLabels() {
        const { sortLabelAsc } = settings
        const cards = document.querySelectorAll('.page:not(.hide) .itemsContainer div.card')
        const container = document.querySelector('.page:not(.hide) .itemsContainer')
        const sortedCards = Array.from(cards).sort((a, b) => {
            const aOrder = a.querySelector('.jv-label')?.getAttribute('data-jv-label-order')
            const bOrder = b.querySelector('.jv-label')?.getAttribute('data-jv-label-order')
            if (!aOrder || !bOrder) return 0
            if (sortLabelAsc) {
                return Number(aOrder) - Number(bOrder)
            } else {
                return Number(bOrder) - Number(aOrder)
            }
        })
        container.replaceChildren(...sortedCards)
    }

    function registerKeysEvent() {
        const {
            recoverHotKeys,
            addFavBtnHotKeys,
            serverUrl,
            getCollectionHotKeys,
            sortLabelHotKeys,
            fetchItemsHotKeys,
            playRandomFavHotKeys,
            playRandomFavJellyfinHotKeys,
            playRandomFav115HotKeys,
            playRandomAllHotKeys,
            playRandomCurPageHotKeys
        } = settings
        const events = [
            [
                recoverHotKeys,
                () => {
                    log('清除页面改动')
                    eventEmitter.emit(EVENT_Type.clearDom)
                }
            ],
            [addFavBtnHotKeys, addFavouriteIcon, location.origin === serverUrl],
            [getCollectionHotKeys, fetchAllCollectionItems],
            [sortLabelHotKeys, sortLabels, location.origin === serverUrl],
            [fetchItemsHotKeys, initItems],
            [playRandomFavJellyfinHotKeys, () => playRandom('jellyfin')],
            [playRandomFav115HotKeys, () => playRandom('115')],
            [playRandomFavHotKeys, () => playRandom('fav')],
            [playRandomAllHotKeys, () => playRandom('all')],
            [playRandomCurPageHotKeys, () => playRandom('currentPage')]
        ]
        events.forEach(([keys, cb, condition = true]) => {
            if (condition) {
                eventEmitter.on(EVENT_Type.clearEvent, keysEvent.on(keys, cb))
            }
        })
    }

    function autoTrigger(cb, immediate = false) {
        if (immediate) {
            setTimeout(cb, 500)
        }
        const buttons = document.querySelectorAll('button.btnPreviousPage, button.btnNextPage')
        buttons.forEach(button => {
            const handler = () => {
                setTimeout(() => {
                    cb()
                    autoTrigger(cb, false)
                }, 500)
            }
            button.addEventListener('click', handler)
            eventEmitter.on(EVENT_Type.clearEvent, () => button.removeEventListener('click', handler))
        })
    }

    function registerAutoTriggerEvent() {
        const { jellyfinAutoTrigger, serverUrl } = settings
        const handler = throttle(() => {
            log('viewshow: ', location.hash)
            if (location.hash.startsWith('#/movies')) {
                setTimeout(() => autoTrigger(traverse, true), 1000)
            }
        })
        if (location.origin === serverUrl && jellyfinAutoTrigger) {
            handler()
            document.addEventListener('viewshow', handler)
        }
        eventEmitter.on(EVENT_Type.clearEvent, () => document.removeEventListener('viewshow', handler))
    }

    function addFavouriteIcon() {
        log('addFavouriteIcon')
        if (location.hash.includes('type=Person')) return
        const cards = document.querySelectorAll('.page:not(.hide) .card')
        cards.forEach(card => {
            const favBtn = card.querySelector('.cardOverlayButton-br button:nth-last-of-type(2)')
            if (!favBtn) return
            const isFavorite = favBtn.getAttribute('data-isfavorite') === 'true'
            card.style.position = 'relative'
            let span = card.querySelector('.jellyfin-favorite-span')
            if (span) {
                span.style.color = isFavorite ? 'red' : 'rgba(0,0,0,.5)'
            } else {
                span = document.createElement('span')
                span.className = 'material-icons cardScalableOverlayButtonIcon cardOverlayButtonIcon-hover favorite jellyfin-favorite-span'
                span.style.color = isFavorite ? 'red' : 'rgba(0,0,0,.5)'
                card.append(span)
            }
        })

        eventEmitter.on(EVENT_Type.clearDom, () => {
            const spans = document.querySelectorAll('.jellyfin-favorite-span')
            spans.forEach(span => span.remove())
        })
    }

    async function updateStorageByVersion(version) {
        switch (version) {
            case '2.3.0':
                const process = keys => {
                    if ((keys?.length || 0) === 0) return
                    const now = Date.now()
                    const values = GM_getValues(keys)
                    const newValues = {}
                    keys.forEach(code => {
                        const value = values[code] || {}
                        const newValue = {
                            pc: value.pc,
                            j: value.j,
                            f: value.f
                        }
                        newValues[code] = newValue
                    })
                    GM_setValues(newValues)
                    log(`更新: ${keys.length} 个, 用时: ${Date.now() - now}ms`)
                }
                const storeKeys = getStoreKeys()
                const chunks = splitArrayToChunks(storeKeys, 1000)
                log(`共有 ${storeKeys.length} 个对象, 分成 ${chunks.length} 组进行更新`)
                await chunk(chunks, process)
                break
            default:
                break
        }
    }

    function reconstruct() {
        const versions = GM_getValue('versions', [{ version: '2.3.0', updated: false }])
        versions.forEach(async v => {
            if (compareVersions(GM_info.script.version, v.version) >= 0 && !v.updated) {
                const { close } = notify(`正在更新存储数据到版本 ${v.version}`, '请稍等，不要刷新页面...', 0)
                await updateStorageByVersion(v.version)
                close()
                notify(`版本 ${v.version} 数据更新完成`)
                v.updated = true
            }
        })
        GM_setValue('versions', versions)
    }

    async function restart() {
        const { debug } = settings
        const { enable: oofEnable, fetchCid } = oofSettings
        if (debug) {
            log = console.log.bind(console)
        } else {
            log = noop
        }

        log('jellyfin过滤插件已启动...')
        log(settings)
        log(oofSettings)

        if (oofEnable) {
            await initOOFFiles(fetchCid, false)
        }

        eventEmitter.emit(EVENT_Type.clearDom)
        eventEmitter.emit(EVENT_Type.clearEvent)
        eventEmitter.emit(EVENT_Type.startMatch)
    }

    function removeAD() {
        document.querySelector('#js_common_mini-dialog')?.remove()
        document.querySelector('.vt-headline > div:last-child')?.remove()
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function getCodesOfCurrentPage() {
        const codeSet = copySet.getSetByType('code')
        return Array.from(codeSet).filter(code => GM_getValue(code) !== undefined)
    }

    let cacheStoreKeys = []
    function playRandom(playType) {
        log('playType', playType)
        let codeList, item, code
        if (playType === 'currentPage') {
            codeList = getCodesOfCurrentPage()
        } else {
            if (cacheStoreKeys.length === 0) {
                cacheStoreKeys = getStoreKeys()
            }
            codeList = cacheStoreKeys
        }

        if (codeList.length > 0) {
            while (true) {
                const randomIndex = getRandomNumber(0, codeList.length - 1)
                code = codeList[randomIndex]
                item = GM_getValue(code)
                if (!item) continue
                if (
                    playType === 'currentPage' ||
                    playType === 'all' ||
                    (item?.f && ((playType === '115' && item?.pc) || (playType === 'jellyfin' && item?.j) || playType === 'fav'))
                ) {
                    break
                }
            }
        }

        if (!item) {
            notify('未找到可播放的项目')
            return
        }
        notify(`即将播放: ${code}`, `播放类型: ${playType}`)
        if (item.pc) {
            const { openSite } = oofSettings
            openSiteByParams(openSite, { pickcode: item.pc }, { button: 0, ctrlKey: false, shiftKey: false })
        } else if (item.j) {
            playByItemId(item.j)
        }
    }

    function registerMenuCommand() {
        const events = [
            ['设置', configModal.show],
            ['115设置', oofModal.show],
            ['补充本地番号', localCodeModal.show],
            ['新增匹配名称', localNameModal.show],
            ['标签设置', labelModal.show]
        ]
        events.forEach(([title, cb]) => GM_registerMenuCommand(title, () => cb(title)))
    }

    function registerEvents() {
        const startFuncList = [startSpecialMatch, startCommonMatch, registerKeysEvent, copySet.registerCopyEvent, registerAutoTriggerEvent]
        startFuncList.forEach(cb => eventEmitter.on(EVENT_Type.startMatch, cb))
    }

    function addStyle() {
        const baseColor = () => `
            color: rgba(0, 0, 0, 0.88);
            background: #fff;
            border: 1px solid #d9d9d9;
        `
        const baseContainerStyle = () => `
            ${baseColor()}
            font-size: 14px;
            line-height: 1.5;
            padding: 20px 24px;
            border-radius: 8px;
            box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.08), -2px -2px 2px 1px rgba(0, 0, 0, 0.08);
        `

        const baseBtnStyle = () => `
            ${baseColor()}
            height: 2.2em;
            padding: 0 15px;
            outline: none;
            border-radius: 4px;
            font-size: 13px;
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
            cursor: pointer;
        `

        const focusBtnStyle = () => `
            border: 1px solid #1677ff;
            box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
        `

        const css = `
        .jv-link {
            display: inline-flex !important;
            align-items: center;
            flex-wrap: nowrap;
            cursor: pointer;
            max-width: 100%;
            overflow: auto;
        }
        .jv-svg, .jv-oof-svg {
            margin: 0 2px;
            width: 1.2em;
            max-width: 32px;
            vertical-align: middle;
            cursor: pointer;
            flex-shrink: 0;
            min-width: 12px;
        }
        .jv-local-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 1.4em;
            height: 1.4em;
            min-width: 12px;
            max-width: 32px;
            flex-shrink: 0;
            margin: 0 2px;
            border-radius: 50%;
            background: #243fbf;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            cursor: default;
        }
        .jv-oof-btn {
            ${baseBtnStyle()}
            background: #1677ff;
            color: #fff;
            height: 1.7em;
            line-height: 1.7;
            margin: 0 2px;
            padding: 0 6px;
            font-size: 12px;
            border: none;
        }
        .jv-modal {
            padding: 0;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 1100;
            overflow: auto;
            display: none;
        }
        .jv-section {
            ${baseContainerStyle()}
            padding: 0;
            width: 1100px;
        }
        .jv-section .jv-title {
            font-weight: bold;
            font-size: 22px;
            padding: 20px 0;
            text-align: center;
            cursor: grab;
            user-select: none;
        }
        .jv-form {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0 24px;
            max-width: unset;
            max-height: 700px;
            overflow: auto;
        }
        .jv-form-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0;
            width: 500px;
        }
        .jv-form-item.jv-form-label-item {
           width: 100%;
        }
        .jv-form .jv-form-item.jv-form-label-item input {
           margin: 0 5px;
        }
       .jv-form input, .jv-form textarea {
            ${baseBtnStyle()}
            font-size: 14px;
            box-sizing: border-box;
            width: 300px;
            padding: 0 11px;
            cursor: text;
            height: 2.2em;
            line-height: 2.2;
        }
        .jv-form input:focus, .jv-form textarea:focus {
           ${focusBtnStyle()}
        }
        .jv-btn-group {
            margin-top: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        .jv-btn-group button {
            ${baseBtnStyle()}
            margin-right: 5px;
        }
        .jv-btn-group button:hover {
            ${focusBtnStyle()}
            color: #1677ff;
        }
        .jv-close-icon {
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
            padding: 10px;
        }
        .jv-close-icon:hover {
            color: red;
        }
        .jv-notification {
            ${baseContainerStyle()}
            position: fixed;
            z-index: 100001;
            top: 24px;
            right: 24px;
        }

        .jv-notification .jv-title {
            margin-bottom: 8px;
            font-size: 16px;
            padding-right: 24px;
        }

        .jv-notification .jv-content {
            max-height: 500px;
            overflow: auto;
            white-space: pre;
        }

        .jv-favorite-btn {
            position: relative;
            width: 2em;
            height: 1.6em;
            display: inline-block;
            overflow: hidden;
            margin: 0 -0.2em;
            transform: scale(0.8);
        }

        .jv-favorite-btn::before,
        .jv-favorite-btn::after {
            content: '';
            position: absolute;
            top: 0.1em;
            left: 0;
            width: 1em;
            height: 1.5em;
            background: #ccc;
            cursor: pointer;
        }
        .jv-favorite-btn.jv-is-favorite::before,
        .jv-favorite-btn.jv-is-favorite::after {
            background: #c33;
        }

        .jv-favorite-btn::before {
            left: 1em;
            transform: rotate(-45deg);
            transform-origin: 0 100%;
            border-radius: 50% 50% 50% 0;
        }

        .jv-favorite-btn::after {
            transform: rotate(45deg);
            transform-origin: 100% 100%;
            border-radius: 50% 50% 0 50%;
        }
        
        .jellyfin-favorite-span {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 9999;
        }

        .jv-label-link {
            padding: 0 2px;
            cursor: pointer;
        }
        .jv-label-text {
            cursor: pointer;
        }
    `
        const cssWithoutComment = css
            .split('\n')
            .filter(line => !line.trim().startsWith('//'))
            .join('\n')
        GM_addStyle(cssWithoutComment)
    }

    function start() {
        setTimeout(reconstruct, 1000)
        addStyle()
        registerMenuCommand()
        registerEvents()
        removeAD()
        restart()
    }

    start()
})()
