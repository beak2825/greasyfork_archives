// ==UserScript==
// @name         Inject Scripts
// @namespace    https://yinr.cc/
// @version      0.10.2
// @description  为网页添加工具脚本，包括 jQuery、eruda、vConsole
// @author       Yinr
// @license      MIT
// @icon         https://images.icon-icons.com/2622/PNG/64/brand_js_icon_158838.png
// @match        http*://*/*
// @require      https://fastly.jsdelivr.net/npm/loadjs@4.2.0/dist/loadjs.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519022/Inject%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/519022/Inject%20Scripts.meta.js
// ==/UserScript==

/* globals loadjs */
/* globals jQuery, VConsole, eruda */

(function() {
    'use strict';

    const CDN = 'https://fastly.jsdelivr.net'

    const jsInfo = [{
        name: 'jQuery',
        urls: 'https://code.jquery.com/jquery-3.7.0.min.js',
        // urls: `${CDN}/npm/jquery/dist/jquery.min.js`,
        action: () => {
            const $ = jQuery.noConflict(true);
            if (unsafeWindow.$ === undefined) {
                unsafeWindow.$ = $
            } else {
                unsafeWindow.jq = $
                console.log('`$` is already exist, use `jq` to call jQuery instead.')
            }
        }
    }, {
        name: 'eruda',
        urls: `${CDN}/npm/eruda/eruda.min.js`,
        action: () => {
            eruda.init()
            unsafeWindow.eruda = eruda
        }
    }, {
        name: 'vConsole',
        urls: `${CDN}/npm/vconsole/dist/vconsole.min.js`,
        action: () => {
            const vConsole = new VConsole()
            unsafeWindow.vConsole = vConsole
        }
    }, {
        name: 'localforage',
        urls: `${CDN}/npm/localforage/dist/localforage.min.js`,
        action: () => {
            // unsafeWindow.localforage = localforage
        }
    }, {
        name: 'CryptoJS',
        urls: `${CDN}/npm/crypto-js/index.min.js`,
        action: () => {
        }
    }]

    const jsInfoGet = (name) => jsInfo.find(info => info.name.toLowerCase() === name.toLowerCase())

    const loadJSOnce = ({name, urls, action}) => {
        if (!loadjs.isDefined(name)) {
            loadjs(urls, name, () => {
                action()
                console.log(`${name} is now loaded.`)
            })
        } else {
            console.log(`${name} is already loaded.`)
        }
    }

    const commands = {}
    jsInfo.forEach((item) => {
        const loadCommandId = GM_registerMenuCommand(`加载 ${item.name}`, () => loadJSOnce(item))
        // const alwaysCommandId = GM_registerMenuCommand(`本站默认加载 ${item.name}`, () => GM_setValue('site', {}))
        // const neverCommandId = GM_registerMenuCommand(`本站取消默认加载 ${item.name}`, () => loadJSOnce(item.name, item.url, item.action))
        commands[item.name] = {
            load: loadCommandId,
            // always: alwaysCommandId,
            // never: neverCommandId,
        }
    })

    // load url
    GM_registerMenuCommand('加载自定义脚本', () => {
        const urls = prompt('输入要加载的脚本链接：')
        if (urls) {
            try {
                loadJSOnce({
                    name: '自定义脚本',
                    urls,
                    action: () => {console.log(`自定义脚本 ${urls} 加载完成`)}
                })
            } catch (e) {
                console.warn('脚本加载出错', {url: urls, error: e})
                alert('脚本加载出错')
            }
        }
    })

    const BAD_COPY_SITE = [
        'blog.csdn.net',
        'www.yuque.com',
        'juejin.cn',
    ]
    const copyToClip = (text, alert = false) => {
        const hostname = document.location.hostname
        const badSite = BAD_COPY_SITE.map(site => hostname.includes(site)).includes(true)
        if (badSite) {
            prompt('本站可能无法自动复制，请手动复制输入框中的内容', text)
        } else {
            GM_setClipboard(text, 'text', () => {
                console.log(text)
            })
            if (alert) alert('已复制：', text)
        }
    }

    // Copy Title
    GM_registerMenuCommand('复制页面标题', () => {
        if (unsafeWindow !== unsafeWindow.top) { return }
        const content = document.title
        copyToClip(content)
    })

    // Copy Url Markdown
    GM_registerMenuCommand('复制网址 Markdown', () => {
        if (unsafeWindow !== unsafeWindow.top) { return }
        const content = `[${document.title}](${document.location.href})`
        copyToClip(content)
    })

    // Copy Url Markdown For Memos
    GM_registerMenuCommand('复制网址 Markdown(Memos)', () => {
        if (unsafeWindow !== unsafeWindow.top) { return }
        const content = `[${document.title.replaceAll('[', '【').replaceAll(']', '】')}](${document.location.href})`
        copyToClip(content)
    })

    const autoload_hostname = ['www.natfrp.com', 'openid.13a.com']
    if (autoload_hostname.includes(document.location.hostname)) {
        loadJSOnce(jsInfoGet('eruda'))
    }
})();