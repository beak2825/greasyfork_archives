// ==UserScript==
// @name         動畫瘋-自動觀看廣告
// @namespace    https://shinoharahare.github.io/
// @version      0.4
// @description  自動觀看動畫瘋廣告
// @author       Hare
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @match        https://imasdk.googleapis.com/js/core/bridge*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addValueChangeListener
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @downloadURL https://update.greasyfork.org/scripts/408643/%E5%8B%95%E7%95%AB%E7%98%8B-%E8%87%AA%E5%8B%95%E8%A7%80%E7%9C%8B%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408643/%E5%8B%95%E7%95%AB%E7%98%8B-%E8%87%AA%E5%8B%95%E8%A7%80%E7%9C%8B%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    window.config = new Proxy({
        skipTime: 30,
        pauseOnSkipped: true,
        muteAd: true
    }, {
        async get(target, key) {
            if (key in target) {
                let type = target[key].constructor
                let val = await GM.getValue(key, target[key])
                return type(val)
            } else {
                throw 'Unknown Config'
            }
        },
        async set(target, key, value) {
            if (key in target) {
                await GM.setValue(key, value)
            } else {
                throw 'Unknown Config'
            }
            return true
        }
    })

    if (location.href.includes('ani.gamer.com.tw')) {
        if (await hasAd()) {
            let btn = await wait(() => document.querySelector('#adult'))
            btn.click()

            if (hasImaAd()) {
                registerMessageHandlerTop()
                let video = document.querySelector('video[title=Advertisement]')
                if (await config.muteAd) {
                    video.addEventListener('play', ({ target }) => target.muted = true)
                }
                await sleep(await config.skipTime * 1000)
                await postMessage2Ima({ type: 'skip' })
            }

            let player = videojs.getPlayer('ani_video')

            if (!skipped()) {
                if (await config.muteAd) {
                    player.muted(true)
                }
                let skipBtn = await wait(() => document.querySelector('div[class*="skip"]'), skipped)
                await wait(() => skipBtn.innerText.includes('跳過'), skipped)
                skipBtn.click()
            }

            if (await config.pauseOnSkipped) {
                const video = document.querySelector('#ani_video_html5_api')
                video.addEventListener('loadeddata', () => {
                    const t = () => video.pause() || video.removeEventListener('play', t)
                    video.addEventListener('play', t)
                })
            }

            if (await config.muteAd) {
                player.muted(false)
            }
        }
    } else if (location.href.includes('imasdk.googleapis.com')) {
        if (window.self != window.top) {
            registerMessageHandlerIma()
        }
    }
})();

(async () => {
    if (window.self === window.top) {
        let ids = []
        let names = ['pauseOnSkipped', 'muteAd']

        async function loadMenu() {
            for (let id of ids) {
                GM.unregisterMenuCommand(id)
            }
            ids = []

            registerMenuCommand('修改跳過秒數', async () => {
                const { isConfirmed, value } = await swal.fire({
                    title: '修改跳過秒數',
                    input: 'number',
                    inputValue: await config.skipTime,
                    showCancelButton: true,
                })
                if (isConfirmed) {
                    config.skipTime = value
                }
            }, 'D')

            registerSwitch('跳過後暫停', 'pauseOnSkipped', 'P')
            registerSwitch('靜音廣告', 'muteAd', 'M')
        }

        async function registerMenuCommand(...args) {
            const id = await GM.registerMenuCommand(...args)
            ids.push(id)
        }

        async function registerSwitch(title, name, accessKey) {
            registerMenuCommand(`[${await config[name] ? '停用' : '啟用'}] ${title}`, async() => config[name] = !await config[name], accessKey)
        }

        for (let name of names) {
            GM.addValueChangeListener(name, () => loadMenu())
        }

        loadMenu()
    }
})();


function hasImaAd() {
    return document.querySelector('video[title=Advertisement]') != null
}

function skipped() {
    return videojs.getPlayer('ani_video').adFinished
}

function registerMessageHandlerTop() {
    window.resolves = {}
    window.addEventListener('message', ({ data }) => {
        const id = data._id
        if (id in window.resolves) {
            window.resolves[id]()
            delete window.resolves[id]
        }
    })
}

function registerMessageHandlerIma() {
    window.addEventListener('message', ({ data, source }) => {
        if (data._id) {
            switch (data.type) {
                case 'skip': {
                    document.querySelector('.videoAdUiSkipButton').click()
                    break
                }
            }
            source.postMessage(data, 'https://ani.gamer.com.tw')
        }
    })
}


function postMessage2Ima(msg) {
    const win = document.querySelector('iframe[src^="https://imasdk.googleapis.com/js/core/"]').contentWindow
    return new Promise(resolve => {
        const id = performance.now()
        window.resolves[id] = resolve
        win.postMessage({
            _id: id,
            ...msg
        }, 'https://imasdk.googleapis.com')
    })
}


async function hasAd() {
    const res = await fetch(`/ajax/token.php?sn=${animefun.videoSn}`)
    const json = await res.json()
    return json.time == 0
}


function wait(condition, canceler, responser, tick=100) {
    return new Promise((resolve) => {
        let i = setInterval(() => {
            let c = condition()
            if (canceler && canceler()) {
                clearInterval(i)
            } else if (c) {
                clearInterval(i)
                resolve(responser ? responser() : c)
            }
        }, tick);
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}