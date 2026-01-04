// ==UserScript==
// @name         无限暖暖网页活动-快速跳过
// @namespace    http://tampermonkey.net/
// @version      2025.12.17
// @description  支持: 1.9家园合成小游戏, 2.0果园消消乐
// @author       浩劫者12345
// @match        https://infinitynikki.nuanpaper.com/proj/*
// @icon         https://assets.papegames.com/resources/cdn/20240412/8bea8d0de8e91973.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547503/%E6%97%A0%E9%99%90%E6%9A%96%E6%9A%96%E7%BD%91%E9%A1%B5%E6%B4%BB%E5%8A%A8-%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/547503/%E6%97%A0%E9%99%90%E6%9A%96%E6%9A%96%E7%BD%91%E9%A1%B5%E6%B4%BB%E5%8A%A8-%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addMenu(innerHTML) {
        const menu = document.createElement('div')
        document.body.appendChild(menu)
        menu.outerHTML = /*html*/`
            <div style="position: fixed; top: 8px; right: 8px; z-index: 99999;">
                ${innerHTML}
            </div>
        `
    }

    // 判断活动页面
    if (location.href.includes('NikkiHome')) {
        let gameId
        let verifyCode
        let source

        function checkInfo() {
            if (gameId == null) {
                console.log('`game_id` is not present')
            }
            if (!verifyCode) {
                console.log('`verify_code` is not present')
            }
            if (!source) {
                console.log('`__source` is not present')
            }

            if (gameId != null && verifyCode && source) {
                return true
            } else {
                window.alert('你还没有进入游戏')
                return false
            }
        }

        // Hook XHR send, 截获游戏id
        const origSend = XMLHttpRequest.prototype.send
        XMLHttpRequest.prototype.send = function (body) {
            origSend.apply(this, arguments)

            let r
            try {
                r = JSON.parse(body)
            } catch (e) {
                return
            }

            // console.log('Intercepted XHR payload:', r)

            const id = r?.game_id  // 游戏id
            if (id) {
                gameId = id
                console.log('Intercepted `game_id`:', gameId)
            }
        }

        // Hook XHR open, 截获验证码
        const origOpen = XMLHttpRequest.prototype.open
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            const xhr = this

            xhr.addEventListener('load', () => {
                let r
                try {
                    r = JSON.parse(xhr.response)
                } catch (e) {
                    return
                }

                // console.log('Intercepted XHR response:', r)

                const code = r?.data?.verify_code  // 验证码
                if (code) {
                    verifyCode = code
                    console.log('Intercepted `verify_code`:', verifyCode)
                }
            })

            origOpen.apply(this, arguments)
        }

        // 监听 message 事件截获 __source
        window.addEventListener('message', e => {
            const src = e.data?.__source
            if (src) {
                source = src
                console.log('Intercepted `__source`:', source)
            }
        })

        window.skipGame = () => {
            if (!checkInfo()) return

            // 发送游戏过关事件
            window.postMessage({
                "name": "game-cocos",
                "type": 9,  // 9=过关
                "value": {
                    "ret": 0,
                    "msg": "cocos->游戏过关数据",
                    "data": {
                        "score": 1206,  // 得分
                        "game_id": gameId,  // 游戏id
                        "verify_code": verifyCode,  // 验证码
                        "status": 3
                    }
                },
                "__source": source
            })
        }

        window.unlockEgg = () => {
            if (!checkInfo()) return

            // 发送彩蛋触发事件
            window.postMessage({
                "name": "game-cocos",
                "type": 6,  // 6=彩蛋
                "value": {
                    "ret": 0,
                    "msg": "触发彩蛋了",
                    "data": {
                        "game_id": gameId,  // 游戏id
                        "verify_code": verifyCode,  // 验证码
                    }
                },
                "__source": source
            })

            window.alert('解锁成功')
        }

        addMenu(/*html*/`
            <button style="background-color: #0ff;" onclick="unlockEgg()">解锁彩蛋</button>
            <button style="background-color: #0f0;" onclick="skipGame()">一键跳关</button>
        `)
    }

    else if (location.href.includes('NikkiOrchard')) {
        window.skipGame = () => {
            window.postMessage({
                "name": "game-cocos",
                "type": 2,
                "value": {
                    "ret": 0,
                    "msg": "",
                    "data": {
                        "saveArray": [
                            {
                                "id": 1,
                                "num": 1206
                            }
                        ]
                    }
                }
            })
        }

        addMenu(/*html*/`
            <button style="background-color: #0f0;" onclick="skipGame()">一键完成当前关卡</button>
        `)
    }
})();