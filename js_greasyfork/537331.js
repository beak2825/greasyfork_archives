// ==UserScript==
// @name         ForceAllowLive 强制B站直播允许第三方开播
// @namespace    https://shugen002.github.io/userscript
// @version      0.7
// @description  强制B站直播允许第三方开播。
// @author       shugen
// @match        https://link.bilibili.com/p/center/index
// @match        https://link.bilibili.com/p/center/index?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at       document-start
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537331/ForceAllowLive%20%E5%BC%BA%E5%88%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%81%E8%AE%B8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BC%80%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/537331/ForceAllowLive%20%E5%BC%BA%E5%88%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%81%E8%AE%B8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BC%80%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 你们怕我盗号什么的，还去找B站官方问的，你们最好祈祷叔叔啥都顺着你的意思走。

    // 如果你非要找人去审查代码，请不要找 B 站官方或运营或技术，找其他非B站员工的技术大佬

    const myConsole = new Proxy(console, {
        get(target, prop) {
            if (prop === 'log' || prop === 'info' || prop === 'warn' || prop === 'error') {
                return function (...args) {
                    args.unshift("[ForceAllowLive]")
                    target[prop](...args);
                };
            }
            return target[prop];
        }
    });

    myConsole.log("Force Allow Live is running with document.readyState: " + document.readyState);

    let overrideBxios = false

    let needOverride = true;

    let roomId

    async function main() {
        injectWebpackJsonp()
        injectFetch()
        setupFetchFilter()
    }

    function injectWebpackJsonp() {
        window.webpackJsonp = window.webpackJsonp || []
        window.webpackJsonp._push = window.webpackJsonp.push
        window.webpackJsonp.push = function (...args) {
            let apppack = args.find((pack) => {
                return pack[0].includes("vendors")
            })
            if (apppack) {
                InjectVendorPack(apppack)
            }
            this._push(...args);
        }
        let apppack = window.webpackJsonp.find((e) => {
            return e[0] && e[0].includes("vendors")
        })
        if (apppack) {
            InjectVendorPack(apppack)
        }
    }

    function injectFetch() {
        // 免得和自己其他脚本打架了
        if (!window.$$fetchFilter) {
            window.$$originalFetch = window.fetch;
            window.$$fetchFilter = []
            window.fetch = function (...args) {
                if (typeof args[0] != "string") {
                    return window.$$originalFetch(...args);
                }

                for (const element of window.$$fetchFilter) {
                    try {
                        let result = element(window.$$originalFetch, args)
                        if (result) {
                            return result
                        }
                    } catch (error) {
                        console.log("[Fetch Override]", element, args, error)
                    }
                }
                return window.$$originalFetch(...args)
            }
        }
    }

    function setupFetchFilter() {
        window.$$fetchFilter.push(function (originalFetch, args) {
            if (!needOverride) return
            if (args[1] && args[1].body) {
                if (args[1].body.room_id) {
                    roomId = args[1].body.room_id
                    myConsole.log("GetRoomId from fetch body", args[1].body.room_id)
                }
                if (args[1].body.roomid) {
                    roomId = args[1].body.roomid
                    myConsole.log("GetRoomId from fetch body", args[1].body.roomid)
                }
            }
            if (args[0].startsWith("//api.live.bilibili.com/xlive/app-blink/v1/streaming/WebLiveCenterStartLive")) {
                let url = new URL("https:" + args[0])
                let data = url.searchParams
                data.set("platform", "pc_link")
                args[0] = "//api.live.bilibili.com/room/v1/Room/startLive"
                args[1].body = data
                // if (args[0].transformResponse.toString() == "[object Object]") {
                //     args[0].transformResponse["FixNoQRCode"] = FixNoQRCode
                // } else {
                //     args[0].transformResponse.push(FixNoQRCode)
                // }
                myConsole.log("override start live request success.")
            }
        })
    }

    function ForceLivePermission(res) {
        try {
            myConsole.info(`当前直播权限 ${res.data.allow_live} 粉丝数量要求 ${res.data.fans_threshold} 是否需要提示 ${res.data.need_notice}`)
            if (Object.keys(res.data).includes("allow_live") && typeof res.data.allow_live == 'boolean') {
                if (res.data.allow_live) {
                    needOverride = false
                    window.alert("检测到你当前已经可以直接在网页上开启直播，同时B站也已经修复了无法扫脸的问题，建议您卸载本脚本。感谢您的使用。")
                }
                res.data.allow_live = true;
            }
        } catch (error) {
            myConsole.error("处理直播权限时出错：", error);
        }

        return res
    }

    function TranslateToNew(res) {
        try {
            res.data.addr = res.data.rtmp
            res.data.line = res.data.stream_line
        } catch (error) {
            myConsole.error("新老接口转换时出错：", error);
        }
        return res
    }

    // 选这个注入点是因为我怕和其他脚本打架，后续如果这个注入点失效，那我只好拿回传统注入点了。
    function InjectVendorPack(pack) {
        myConsole.log('Get Vendor Pack')
        let entries = Object.entries(pack[1])
        let apiEntry = entries.find((entry) => {
            return entry[1].toString().includes("getAllResponseHeaders")
        })
        if (apiEntry) {
            myConsole.log('Get Bxios')
            apiEntry[1]._call = apiEntry[1].call
            apiEntry[1].call = function (...args) {
                let result = this._call(...args)
                let real = args[1].exports
                overrideBxios = true;
                myConsole.log('Bxios Get Overrided.')
                args[1].exports = function (...args) {
                    if (!needOverride) {
                        let result = real(...args)
                        return result
                    }
                    if (args[0].params) {
                        if (args[0].params.room_id) {
                            roomId = args[0].params.room_id
                            myConsole.log("GetRoomId from Bxios Params", args[0].params.room_id)

                        }
                        if (args[0].params.roomid) {
                            roomId = args[0].params.roomid
                            myConsole.log("GetRoomId from Bxios Params", args[0].params.roomid)
                        }
                    }

                    if (args[0].url == "//api.live.bilibili.com/xlive/app-blink/v1/live/FetchWebUpStreamAddr") {
                        if (!roomId) {
                            roomId = window.prompt("未能获取到你的房间号，请手动输入您的房间号")
                        }
                        myConsole.log(args[0])
                        args[0].url = "//api.live.bilibili.com/live_stream/v1/StreamList/get_stream_by_roomId"
                        args[0].method = "GET"
                        args[0].params = { room_id: roomId }
                        if (args[0].transformResponse.toString() == "[object Object]") {
                            args[0].transformResponse["TranslateToNew"] = TranslateToNew
                        } else {
                            // args[0].transformResponse.push(FixNoQRCode)
                        }
                        myConsole.log("override start live request success.")
                    }

                    if (args[0].url == "//api.live.bilibili.com/xlive/app-blink/v1/live/GetWebLivePermission") {
                        // 我不知道为什么他是个对象而不是数组，但既然不是，那我瞎来也不是不行？
                        if (args[0].transformResponse.toString() == "[object Object]") {
                            args[0].transformResponse["ForceAllowLive"] = ForceLivePermission
                        } else {
                            args[0].transformResponse.push(ForceLivePermission)
                        }
                    }
                    let result = real(...args)
                    return result
                }
                return result
            }
        }
    }


    main().catch(e => {
        console.log("Force Allow Live Failed", e)
    })
})();
