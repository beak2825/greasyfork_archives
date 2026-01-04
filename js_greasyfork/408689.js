// ==UserScript==
// @name         動畫瘋-自動跳過廣告
// @namespace    https://shinoharahare.github.io/
// @version      1.7.1
// @description  自動跳過動畫瘋廣告
// @author       Hare
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.addValueChangeListener
// @grant        GM.info
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @connect      api.gamer.com.tw
// @downloadURL https://update.greasyfork.org/scripts/408689/%E5%8B%95%E7%95%AB%E7%98%8B-%E8%87%AA%E5%8B%95%E8%B7%B3%E9%81%8E%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408689/%E5%8B%95%E7%95%AB%E7%98%8B-%E8%87%AA%E5%8B%95%E8%B7%B3%E9%81%8E%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    toastr.options = { positionClass: 'toast-top-center' }

    await loadConfig()
    setupMenu()

    hookAjax('/ajax/token.php', async (ajax, opts) => {
        let token = await get(opts.url)
        token.time = 1
        opts.success(JSON.stringify(token))
    })

    if (config.useMobileAPI) {
        mobile()
    } else {
        web()
    }

    HTMLElement.prototype._appendChild = HTMLElement.prototype.appendChild
    HTMLElement.prototype.appendChild = function(node) {
        if (!node.src || !node.src.includes('smil:gamer_ad/90426')) {
            return this._appendChild(node)
        }
    }
})();


function web() {
    hookAjax('/ajax/m3u8.php', async (_, opts) => {
        let src = (await get(opts.url)).src
        if (!src) {
            let s = getAd()[2]
            await fetch(`/ajax/videoCastcishu.php?s=${s}&sn=${animefun.videoSn}`)
            await showSkipping(config.skipTime)
            await fetch(`/ajax/videoCastcishu.php?s=${s}&sn=${animefun.videoSn}&ad=end`)
            src = (await get(opts.url)).src
        }
        if (!src) {
            toastr.error('請嘗試增加等待時間後重試', '跳過廣告失敗')
        } else {
            opts.success(JSON.stringify({ src }))
        }
    })
}


function mobile() {
    hookAjax('/ajax/m3u8.php', async (_, opts) => {
        let src = (await get(`https://api.gamer.com.tw/mobile_app/anime/v2/m3u8.php?sn=${animefun.videoSn}&device=${animefun.getdeviceid()}`)).src
        if (!src) {
            await get(`https://api.gamer.com.tw/mobile_app/anime/v1/stat_ad.php?sn=${animefun.videoSn}`)
            await showSkipping(config.skipTime)
            await get(`https://api.gamer.com.tw/mobile_app/anime/v1/stat_ad.php?sn=${animefun.videoSn}&ad=end`)
            src = (await get(`https://api.gamer.com.tw/mobile_app/anime/v2/m3u8.php?sn=${animefun.videoSn}&device=${animefun.getdeviceid()}`)).src
        }
        if (!src) {
            toastr.error('請切換為網頁版API後重試', '跳過廣告失敗')
        } else {
            opts.success(JSON.stringify({ src }))
        }
    })

    hookAjax('/ajax/elapse.php', async (ajax, opts) => {
        opts.success = () => {}
        return ajax(opts)
    })

    async function get(url) {
        const { response } = await GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: 'json',
            headers: {
                'User-Agent': 'Bahadroid (https://www.gamer.com.tw/)',
                'X-Bahamut-App-InstanceId': 'cIAk-QlPYbw',
                'X-Bahamut-App-Android': 'tw.com.gamer.android.animad',
                'X-Bahamut-App-Version': '167',
                'Host': 'api.gamer.com.tw'
            }
        })
        return response
    }
}


function setupMenu() {
    let ids = []

    registerMenu()

    GM.addValueChangeListener('useMobileAPI', () => registerMenu())

    async function registerMenu() {
        for (let id of ids) {
            GM.unregisterMenuCommand(id)
        }
        ids = []

        if (config.useMobileAPI) {
            registerMenuCommand('使用網頁版API', () => {
                config.useMobileAPI = false
                swal.fire({
                    title: '修改成功',
                    icon: 'success',
                    timer: 800
                })
            }, 'M')
        } else {
            registerMenuCommand('使用手機版API', () => {
                config.useMobileAPI = true
                swal.fire({
                    title: '修改成功',
                    icon: 'success',
                    timer: 800
                })
            }, 'M')
        }

        registerMenuCommand ('設定跳過秒數', async () => {
                const { isConfirmed, value } = await swal.fire({
                    title: '設定跳過秒數',
                    input: 'number',
                    inputValue: config.skipTime,
                    showCancelButton: true,
                })
                if (isConfirmed) {
                    config.skipTime = value
                    swal.fire({
                        title: '修改成功',
                        icon: 'success',
                        timer: 800
                    })
                }
            }, 'D')
    }

    async function registerMenuCommand(...args) {
        const id = await GM.registerMenuCommand(...args)
        ids.push(id)
    }
}


async function loadConfig() {
    window.config = new Proxy({
        skipTime: 25,
        useMobileAPI: true,
        version: '1.3.0'
    }, {
        get(target, key) {
            if (key in target) {
                return target[key]
            } else {
                throw 'Unknown Config'
            }
        },
        set(target, key, value) {
            if (key in target) {
                target[key] = value
                GM.setValue(key, value)
                return true
            } else {
                throw 'Unknown Config'
            }
        }
    })

    for (let [key, value] of Object.entries(config)) {
        let stored = await GM.getValue(key, null)
        config[key] = stored === null ? config[key] : stored
    }

    if (config.version != GM.info.script.version) {
        if (config.version == '1.3.0') {
            await GM.deleteValue('use experimental')
        } else if (config.version == '1.6.1') {
            await GM.deleteValue('duration')
        }
        config.version = GM.info.script.version
    }
}

async function showSkipping(duration) {
    let el = toastr.warning('', `正在跳過廣告... ${duration}(秒)`, { timeOut: duration * 1000, extendedTimeOut: 0, progressBar: true }).css('pointer-events', 'none')
    let title = el.find('.toast-title')
    while (duration > 0) {
        await sleep(1000)
        title.text(`正在跳過廣告... ${--duration}(秒)`)
    }
}

function hookAjax(match, hooker) {
    let ajax = $.ajax
    $.ajax = opts => {
        if (opts.url.includes(match)) {
            hooker(ajax, opts)
        } else {
            return ajax(opts)
        }
    }
}

async function get(url) {
    let res = await fetch(url)
    let json = await res.json()
    return json
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}