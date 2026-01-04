// ==UserScript==
// @name               哔哩哔哩（B站）自动回到旧版页面
// @namespace          让我们对新版页面使用炎拳吧
// @description        （2024/04/09 失效）通过比较、更改、删除 Cookie 和自动刷新来使哔哩哔哩快速自动回到旧版页面
// @version            1.5.8
// @author             Tinhone
// @license            GPL-3.0
// @run-at             document-start
// @match              *://*.bilibili.com/*
// @exclude            *://www.bilibili.com/list/watchlater*
// @exclude            *://www.bilibili.com/v/game/*
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_registerMenuCommand
// @grant              GM_addStyle
// @compatible         firefox V50+
// @compatible         edge V50+
// @compatible         chrome V50+
// @icon               data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/455571/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/455571/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict'

    //先赋值，运行速度更快
    const tempDocCookie = document.cookie

    const getRegExp = {
        forMatch: (str) => {
            return new RegExp(String.raw`(?<=\; |^)${str}=[\S]*?(?=\; |$)`)
        },
        forTest: (str) => {
            return new RegExp(String.raw`${str};?`)
        },
    }

    const cookie = {
        setup: (nameAndValue) => {
            document.cookie = `${nameAndValue}; expires=Fri, 01 Jan 2077 00:00:00 GMT; domain=bilibili.com; path=/; secure`
        },
        del: (nameAndValue) => {
            document.cookie = `${nameAndValue}; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=bilibili.com; path=/; secure`
        },
        test: (nameAndValue) => {
            return getRegExp.forTest(nameAndValue).test(tempDocCookie)
        },
    }



    if (!(
        true //这个 true 的用途是占位，不含有任何意义
        && cookie.test("blackside_state=0")
        // && cookie.test("buvid_fp=0")
        // && cookie.test("buvid_fp_plain=0")
        && cookie.test("i-wanna-go-back=2")
        // && cookie.test("FEED_LIVE_VERSION=V_LIVE_2")
        // && cookie.test("innersign=1")
        && cookie.test("i-wanna-go-channel-back=2")
        && cookie.test("is-2022-channel=0")
        && cookie.test("go_old_video=1")
        && cookie.test("nostalgia_conf=2")
        && cookie.test("ogv_channel_version=v1")
        && cookie.test("go-back-dyn=1")
        && cookie.test("opus-goback=1")
    )) {
        // *.bilibili.com/*
        // 全站灰度控制？
        cookie.setup("blackside_state=0")

        // *.bilibili.com/*
        // 用户的固定值
        // cookie.setup("buvid_fp=0")

        // *.bilibili.com/*
        // 用户的固定值？
        // cookie.setup("buvid_fp_plain=0")

        // www.bilibili.com
        // 主站首页
        cookie.setup("i-wanna-go-back=2")

        // www.bilibili.com
        // 主站首页？
        // cookie.setup("FEED_LIVE_VERSION=V_LIVE_2")

        // www.bilibili.com
        // 主站首页灰度控制？
        // cookie.setup("innersign=1")

        // www.bilibili.com/v/channel/*
        // 频道？
        cookie.setup("i-wanna-go-channel-back=2")

        // www.bilibili.com/video/*
        // 普通视频灰度控制？
        cookie.setup("is-2022-channel=0")

        // www.bilibili.com/video/*
        // 普通视频
        cookie.setup("go_old_video=1")

        // search.bilibili.com/*
        // 搜索
        cookie.setup("nostalgia_conf=2")

        // www.bilibili.com/*/*
        // 二级页面(分区)
        cookie.setup("ogv_channel_version=v1")

        // t.bilibili.com
        // 动态首页
        cookie.setup("go-back-dyn=1")

        // www.bilibili.com/opus/*
        // OPUS页面(专栏+动态)？这个Cookie没有被正常应用，还不好说
        cookie.setup("opus-goback=1")

        location.reload()
    }



    function normalizationDeleteRemoteControlCookies() {
        // *.bilibili.com/*
        // 全站灰度控制
        cookie.del("buvid3=")

        // *.bilibili.com/*
        // 全站灰度控制
        cookie.del("buvid4=")

        if (sessionStorage.getItem("normalizationDeleteRemoteControlCookiesExecuted") === "true") {
            sessionStorage.setItem("normalizationDeleteRemoteControlCookiesExecuted", "false")
            // GM_addStyle(`
            //     /*字体更新*/
            //     *{
            //         font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif !important;
            //     }
            // `)
            return
        }

        sessionStorage.setItem("normalizationDeleteRemoteControlCookiesExecuted", "true")
        location.reload()
    }

    normalizationDeleteRemoteControlCookies()



    // let remoteControlCookies = {
    //     buvid3: undefined,
    //     buvid4: undefined,
    // }

    // function backupRemoteControlCookies() {
    //     remoteControlCookies.buvid3 = document.cookie.match(getRegExp.forMatch("buvid3"))[0]
    //     remoteControlCookies.buvid4 = document.cookie.match(getRegExp.forMatch("buvid4"))[0]
    //     GM_setValue("remoteControlCookies", remoteControlCookies)
    // }

    // function deleteRemoteControlCookies() {
    //     backupRemoteControlCookies()

    //     // *.bilibili.com/*
    //     // 全站灰度控制
    //     cookie.del("buvid3=")

    //     // *.bilibili.com/*
    //     // 全站灰度控制
    //     cookie.del("buvid4=")

    //     location.reload()
    // }

    // function rollbackRemoteControlCookies() {
    //     remoteControlCookies = GM_getValue("remoteControlCookies")
    //     if (!remoteControlCookies) { return }

    //     // *.bilibili.com/*
    //     // 全站灰度控制
    //     cookie.setup(remoteControlCookies.buvid3)

    //     // *.bilibili.com/*
    //     // 全站灰度控制
    //     cookie.setup(remoteControlCookies.buvid4)

    //     location.reload()
    // }

    // function trickExecute() {
    //     alert("这个选项的用途是注释，不是用来按的。按了也只会弹出这个弹窗，并不会执行其他的东西")
    // }

    function deleteOutdatedStorage() {
        GM_deleteValue("AllRemoteControlCookies")
    }

    // GM_registerMenuCommand("删除所有受远控的 Cookie", deleteRemoteControlCookies)
    // GM_registerMenuCommand("↑ 请当页面仍是新版时前往首页尝试", trickExecute)
    // GM_registerMenuCommand("↑ 原 Cookie 将自动备份", trickExecute)
    // GM_registerMenuCommand("回退所有受远控的 Cookie", rollbackRemoteControlCookies)
    // GM_registerMenuCommand("↑ 将回退到上一个备份", trickExecute)

    deleteOutdatedStorage()
})()