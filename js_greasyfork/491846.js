// ==UserScript==
// @name                 fix-image-error at inoreader
// @name:zh-CN           修复inoreader图片异常
// @version              0.5.0
// @namespace            https://github.com/mengtao-code
// @description          Fix image load error caused by CSP(Content Security Policy), included support for card view
// @description:zh-CN    修复inoreader的图片加载问题，添加了对卡片模式的支持
// @author               Mengtao Xin
// @contributor          Ne0
// @license              MIT
// @include              http*://*.inoreader.com/*
// @icon                 http://www.inoreader.com/favicon.ico
// @grant                GM_xmlhttpRequest
// @connect              *
// @downloadURL https://update.greasyfork.org/scripts/491846/fix-image-error%20at%20inoreader.user.js
// @updateURL https://update.greasyfork.org/scripts/491846/fix-image-error%20at%20inoreader.meta.js
// ==/UserScript==

const LOADING_PROMPT = 'Loading...'

const config = {
    name: 'fix-image-error',
    data: [
        // weibo images prefix
        {
            imageServer: 'sinaimg.cn',
            mockHeader: {
                Referer: 'https://weibo.com'
            }
        },
        {
            imageServer: 'imagecloud.thepaper.cn',
            mockHeader: {
                Referer: 'https://www.thepaper.cn'
            }
        }
    ]
}

/**
 *
 * @link https://stackoverflow.com/questions/8778863/downloading-an-image-using-xmlhttprequest-in-a-userscript
 * @param {string} input
 * @returns {string}
 */
function toBase64(input) {
    var bbLen = 3,
        enCharLen = 4,
        inpLen = input.length,
        inx = 0,
        jnx,
        keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' + '0123456789+/=',
        output = '',
        paddingBytes = 0
    var bytebuffer = new Array(bbLen),
        encodedCharIndexes = new Array(enCharLen)

    while (inx < inpLen) {
        for (jnx = 0; jnx < bbLen; ++jnx) {
            if (inx < inpLen) bytebuffer[jnx] = input.charCodeAt(inx++) & 0xff
            else bytebuffer[jnx] = 0
        }
        encodedCharIndexes[0] = bytebuffer[0] >> 2
        encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4)
        encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6)
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f
        paddingBytes = inx - (inpLen - 1)
        switch (paddingBytes) {
            case 1:
                // Set last character to padding char
                encodedCharIndexes[3] = 64
                break
            case 2:
                // Set last 2 characters to padding char
                encodedCharIndexes[3] = 64
                encodedCharIndexes[2] = 64
                break
            default:
                break // No padding - proceed
        }
        for (jnx = 0; jnx < enCharLen; ++jnx) output += keyStr.charAt(encodedCharIndexes[jnx])
    }
    return output
}

/**
 *
 * @param responseData data from http request
 * @returns {string}
 */
const getImageUrl = responseData => {
    const binResp = toBase64(responseData.responseText)
    return `data:image/jpeg;base64,${binResp}`
}

/**
 * send get http request
 * @param {string}url
 * @param customHeader
 * @returns {Promise<unknown>}
 */
const httpGetRequest = (url, customHeader) => {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: {
                Accept: '*/*',
                referrerPolicy: 'no-referrer',
                ...customHeader
            },
            onload: resolve,
            onerror: reject,
            overrideMimeType: 'text/plain; charset=x-user-defined'
        })
    })
}

/**
 * 
 * @param {Element} dom 
 * @param {*} mockHeader 
 */
const processDetailImage = (dom, mockHeader) => {
    if (dom.getAttribute('process-tag') !== 'doing' && dom.getAttribute('process-tag') !== 'done') {
        dom.setAttribute('process-tag', 'doing')
        dom.setAttribute('alt', LOADING_PROMPT)
        const originUrl = dom.getAttribute('src')
        httpGetRequest(originUrl, mockHeader)
            .then(responseData => {
                const goodUrl = getImageUrl(responseData)
                dom.setAttribute('src', goodUrl)
            })
            .catch(e => console.error(`${config.name} load image failed! ${e}`))
            .finally(() => dom.setAttribute('process-tag', 'done'))
    }
}

const processListImage = (dom, mockHeader) => {
    if (dom.getAttribute('process-tag') !== 'doing' && dom.getAttribute('process-tag') !== 'done') {
        dom.setAttribute('process-tag', 'doing')
        const style = dom.getAttribute('style')
        const originUrl = style.substring(style.indexOf('https')).replace("')", '')
        console.log(`originUrl:${originUrl}`)
        httpGetRequest(originUrl, mockHeader)
            .then(responseData => {
                const goodUrl = getImageUrl(responseData)
                dom.setAttribute('style', `background-image:url('${goodUrl}')`)
            })
            .catch(e => console.error(`${config.name} load image failed! ${e}`))
            .finally(() => dom.setAttribute('process-tag', 'done'))
    }
}

const processCardImage = (dom, mockHeader) => {
    if (dom.getAttribute('process-tag') !== 'doing' && dom.getAttribute('process-tag') !== 'done') {
        dom.setAttribute('process-tag', 'doing');
        // 从style属性中提取图片URL
        const bgImgStyle = dom.style.backgroundImage;
        const originUrl = bgImgStyle.slice(5, -2); // 去除"url('"和"')"
        httpGetRequest(originUrl, mockHeader)
            .then(responseData => {
                const goodUrl = getImageUrl(responseData);
                dom.style.backgroundImage = `url('${goodUrl}')`;
            })
            .catch(e => console.error(`${config.name} load image failed! ${e}`))
            .finally(() => dom.setAttribute('process-tag', 'done'));
    }
}


/**
 * 检测到有异常图片，就调整成正常的图片
 */
const main = () => {
    config.data.forEach(({ imageServer, mockHeader }) => {
        // 1. detail pages
        Array.from(document.querySelectorAll(`.article_content img[src*='${imageServer}']`)).forEach(image => processDetailImage(image, mockHeader))

        // 2. list pages
        Array.from(document.querySelectorAll(`.article_magazine_picture`))
            .filter(dom => dom.getAttribute('style').includes(imageServer))
            .forEach(image => processListImage(image, mockHeader))

        // 3. card view
                Array.from(document.querySelectorAll(`.article_tile_picture`))
            .filter(dom => dom.style.backgroundImage.includes(imageServer))
            .forEach(image => processCardImage(image, mockHeader));
    })
}

setInterval(main, 3000)
