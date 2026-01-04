// ==UserScript==
// @name         哔哩哔哩主页 IP 属地
// @namespace    https://maxchang.me
// @version      0.0.5
// @description  在哔哩哔哩主页显示 IP 属地。仅支持显示个人主页。为了获得完整体验，建议配合「哔哩哔哩网页版显示 IP 属地」（https://greasyfork.org/scripts/466815）使用。
// @author       maxchang3
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM.registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @require      https://update.greasyfork.org/scripts/400945/1055319/libBilibiliToken.js
// @require      https://fastly.jsdelivr.net/npm/gm-extra@0.0.1
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534807/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%BB%E9%A1%B5%20IP%20%E5%B1%9E%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/534807/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%BB%E9%A1%B5%20IP%20%E5%B1%9E%E5%9C%B0.meta.js
// ==/UserScript==
/// <reference path="./types/global.d.ts" />
// @ts-check
/**
 * @typedef {'log' | 'error'} LogLevel
 */

// biome-ignore format: keep type annotation
const logger = (/*** @returns {Record<LogLevel, (...args: unknown[]) => void>} */() => {
    const { name: scriptname, version: scriptversion } = GM_info.script
    /**
     * @param {LogLevel} logMethod
     * @param {string} tag
     * @param {unknown[]} args
     */
    const log = (logMethod, tag, ...args) => {
        const colors = {
            log: '#2c3e50',
            error: '#ff4500',
        }
        const fontFamily =
            "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;"

        console[logMethod](
            `%c ${scriptname} %c v${scriptversion} %c ${tag} `,
            `padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold; ${fontFamily}`,
            `padding: 2px 6px; color: #fff; background: #FF9999; font-weight: bold; ${fontFamily}`,
            `padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: ${colors[logMethod]}; font-weight: bold; ${fontFamily}`,
            ...args
        )
    }
    return {
        log: (...args) => log('log', 'LOG', ...args),
        error: (...args) => log('error', 'ERROR', ...args),
    }
})()

const tokenClient = new BilibiliToken()

const updateAccessKey = async () => {
    const tokenData = await tokenClient.getToken()
    if (tokenData) {
        GM_setValue('aceess_key', tokenData.access_token)
        return true
    }
    logger.error('获取 token 失败')
    return false
}

const queryStringify = (/** @type {Record<string, string>} */ data) =>
    Object.entries(data)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')

const getLocation = async (/** @type {string} */ vmid) => {
    if (!hasToken) {
        logger.error('请先获取 Access Key')
        return null
    }
    const params = BilibiliToken.signQuery(
        queryStringify({
            access_key: accessKey,
            appkey: BilibiliToken.appKey,
            build: tokenClient.build,
            mobi_app: tokenClient.mobiApp,
            vmid,
        })
    )

    try {
        const data = await BilibiliToken.XHR({
            GM: true,
            anonymous: true,
            method: 'GET',
            url: `https://app.bilibili.com/x/v2/space?${params}`,
            responseType: 'json',
            headers: tokenClient.headers,
        })

        if (!data?.body) {
            logger.error('获取数据失败', data)
            return null
        }

        /**
         * @type {import('./types/space').SpaceResponse}
         */
        const spaceResponse = data.body
        if (spaceResponse.code !== 0) {
            logger.error('获取数据失败', spaceResponse)
            return null
        }

        const locationCards = spaceResponse.data.card.space_tag.filter(
            (tag) => tag.type === 'location'
        )
        if (locationCards.length === 0) {
            logger.error('该 UP 主无 IP 属地')
            return null
        }

        return locationCards[0].title
    } catch (error) {
        logger.error('请求出错', error)
        return null
    }
}

logger.log('脚本加载完成')

const acquireAccessKey = async () => {
    try {
        const success = await updateAccessKey()
        if (success) {
            alert('获取 Access Key 成功')
        } else {
            alert(
                '获取 Access Key 失败。若首次使用，可能会导致账号下线，请刷新后尝试重新登录后刷新重新获取。'
            )
            window.location.reload()
        }
        return success
    } catch (err) {
        logger.error('获取 Access Key 出错', err)
        alert('获取过程出错，请稍后重试')
        return false
    }
}

const accessKey = GM_getValue('aceess_key')
const hasToken = Boolean(accessKey)

const requireAccessKey = async () => {
    if (!unsafeWindow.__BiliUser__.isLogin) {
        logger.error('未登录，无法获取 Access Key')
    } else {
        const confirmMessage =
            `[${GM_info.script.name}] 未获取 Access Key，需要获取才能正常使用\n\n` +
            '首次获取可能会导致账号下线，需要登录后再次获取\n' +
            '是否立即获取？'
        if (confirm(confirmMessage)) {
            acquireAccessKey().then((success) => {
                if (success) window.location.reload()
            })
        }
    }
}

const injectLocation = (
    /** @type {string} */ location,
    /** @type {HTMLDivElement} */ upInfoMainElement,
    /** @type {string} */ upInfoSelector,
    /** @type {Record< string, string>} */ overrideStyle = {}
) => {
    const upInfoTopElement = upInfoMainElement.querySelector(upInfoSelector)
    if (!upInfoTopElement) {
        logger.error('未找到 UP 主信息元素')
        return
    }

    const locationElement = document.createElement('div')

    Object.assign(locationElement.style, {
        color: '#fff',
        fontSize: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '4px',
        padding: '.4em',
        marginLeft: '.4em',
        verticalAlign: 'middle',
        display: 'inline-block',
        ...overrideStyle,
    })

    locationElement.className = 'location'
    locationElement.innerText = location
    upInfoTopElement.appendChild(locationElement)
}

if (hasToken)
    logger.log(
        '已获取 Access Key',
        accessKey.substring(0, 4) + '****' + accessKey.substring(accessKey.length - 4)
    )

GM.registerMenuCommand(
    `${hasToken ? '【✅ 已获取】' : '【❌ 未获取】'}获取 Access Key`,
    async () => {
        await acquireAccessKey()
    }
)
const main = async () => {
    const biliMainHeader = await GmExtra.querySelector(document.body, '#biliMainHeader')
    const isFreshSpace = biliMainHeader?.tagName === 'HEADER'

    const appElement = await GmExtra.querySelector(document.body, '#app')

    if (!appElement) {
        logger.error('未找到 #app 元素')
        return
    }

    const upInfoMainSelector = isFreshSpace ? '.upinfo__main' : '.h-inner'
    const upInfoSelector = isFreshSpace ? '.upinfo-detail__top' : '.h-basic div'

    // 等待 Header 中的信息加载出来
    const upInfoMainElement = await GmExtra.querySelector(appElement, upInfoMainSelector)

    if (!hasToken) {
        requireAccessKey()
        return
    }

    if (!upInfoMainElement) {
        logger.error('未找到 UP 主信息元素')
        return
    }

    const URLWithoutQuery = window.location.origin + window.location.pathname
    const vmidMatch = URLWithoutQuery.match(/space\.bilibili\.com\/(\d+)(?:\/|$)/)

    if (!vmidMatch || vmidMatch.length < 2) {
        logger.error('未找到 vmid', window.location.href)
        return
    }

    const vmid = vmidMatch[1]

    const location = await getLocation(vmid)

    if (!location) return

    logger.log(`获取 ${vmid}  IP 属地成功`, location)

    injectLocation(
        location,
        /** @type {HTMLDivElement} */ (upInfoMainElement),
        upInfoSelector,
        isFreshSpace
            ? {}
            : {
                  padding: '0 5px',
                  marginLeft: '5px',
              }
    )
}

main()
