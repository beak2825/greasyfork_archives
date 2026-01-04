// ==UserScript==
// @name         Bilibili VIP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  不给叔叔送钱
// @author       You
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/video/*
// @connect      api.bilibili.com
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/497382/Bilibili%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/497382/Bilibili%20VIP.meta.js
// ==/UserScript==


// 尽早将 __playinfo__ 覆盖, 使 B 站重新请求 playurl API, 不要使用随 HTML 返回的内容
Object.defineProperty(unsafeWindow, '__playinfo__', {
    get: () => undefined
});


(function() {
    'use strict'
    // 虽然未观察到相关的风控行为, 但推荐同时安装 Adblock 类插件屏蔽跟踪器
    const vip_cookie = GM_getValue("vip_cookie")
    console.log("Use Cookie: " + vip_cookie)

    const promptCookieInput = () => {
        const cookie = "buvid3=FE5A8E7B-802F-8DB1-62EC-57833E5A961776031infoc; b_nut=100; _uuid=C5AF82910-6C10D-7212-4C76-83D5E824FC2875728infoc; hit-dyn-v2=1; buvid4=221A35B3-0BD6-3765-4D9E-B343693EC8DE77674-024032703-jcUCk4%2FFDDAs%2FYqabOT04A%3D%3D; LIVE_BUVID=AUTO3917131073523730; enable_web_push=DISABLE; FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW3; header_theme_version=CLOSE; home_feed_column=5; DedeUserID=67979885; DedeUserID__ckMd5=c95869c3da2792dd; CURRENT_FNVAL=4048; buvid_fp_plain=undefined; buvid_fp=e37ffae6004a10087a7c5bd959d67c53; rpdid=|(u))lJYuklm0J'u~uJl|Jm~~; CURRENT_QUALITY=116; fingerprint=b9548a399053c4da5a19ec278f1d6e57; PVID=1; share_source_origin=COPY; bp_t_offset_67979885=939601164925665335; bsource=search_bing; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTg2OTAyNjgsImlhdCI6MTcxODQzMTAwOCwicGx0IjotMX0.g0oIY-PiaWee3ZJMQtGGAoKCMj6VuOkCKJX5SyPu4B0; bili_ticket_expires=1718690208; b_lsid=1653CF710_190242DD450; SESSDATA=b57d1e81%2C1734145925%2C6bbcc%2A62CjCtn4Dlt2roJ00lKrGTrMbMQvHFdReZIpyV4Eio9pvthoVpt2pmgMex9SLEeZnTnQESVmtlaG9JTDBEOXlPWFFyaHpmck9RZzI3eV94Y0VkbnZLVXNQbUxzT2JBam85Vm50MDZuU0p1TDJuWlZmeE1xbXpaUERqMTJkYWltTHBLRnlEQXdiS3F3IIEC; bili_jct=c1d983e0089ff3c21340e00ffc7124be; sid=5kd1j9fi; browser_resolution=1516-1284"
        if (cookie) {
            GM_setValue("vip_cookie", cookie)
        }
        location.reload()
    }

    if (!vip_cookie) {
        promptCookieInput()
        return;
    }

    GM_registerMenuCommand("重设大会员 Cookie", promptCookieInput)

    if (location.href.includes("bangumi/play")) {
        window.onload = () => {
            // 修改用户状态
            if (unsafeWindow.__NEXT_DATA__?.props?.pageProps?.dehydratedState?.queries?.[1]?.queryKey?.[0] === 'season/user/status') {
                unsafeWindow.__NEXT_DATA__.props.pageProps.dehydratedState.queries[1].state.data.userInfo.pay = true
                console.log("Patched userInfo.pay to true")
            }
        }

        // 隐藏 playerPop 遮盖
        setInterval(() => {
            const node = document.querySelector('div[class^="playerPop"]');
            if (node && node.style.display == '') {
                node.style.display = 'none'
                console.log("Patched playerPop display to none")
            }
        }, 2000)

        // 番剧页面多次切换有 bug, 刷新一下清除状态
        window.addEventListener('locationchange', function (event) {
            // 同一页面不再刷新
            if (event.detail?.origin && event.detail?.origin.match(/bangumi\/play\/ep\d+/)?.[0] !== location.href.match(/bangumi\/play\/ep\d+/)?.[0]) {
                console.log("Refresh page")
                location.reload()
            }
        });
    }

    // 替换 XHR, Hook 相关请求
    const oriGetAllResponseHeaders = XMLHttpRequest.prototype.getAllResponseHeaders
    XMLHttpRequest.prototype.getAllResponseHeaders = function(args) {
        return this._headers === undefined ? oriGetAllResponseHeaders.apply(this, args): this._headers
    }

    const oriSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function() {
        if (this._url && this._url.includes("playurl") && this._url.startsWith("https://api.bilibili.com")) {
            // 获取播放地址 API, 需要使用大会员 Cookie 进行请求
            console.log('Hook: playurl request')
            console.log(this)
            GM_xmlhttpRequest({
                method: this._method,
                url: this._url,
                anonymous: true, // 不携带原有 Cookie
                headers: {
                    "Cookie": vip_cookie, // 使用大会员 Cookie
                    "Referer": location.href
                },
                onload: (args) => {
                    console.log("Hooked response: ")
                    console.log(args)
                    // 解锁只有大会员才能选择的清晰度选项
                    console.log("Patched response text: " + args.response.replaceAll('"need_login":true', '"need_login":false').replaceAll('"need_vip":true', '"need_vip":false'))

                    this._headers = args.responseHeaders
                    Object.defineProperty(this, 'readyState', {
                        get: () => args.readyState
                    })
                    Object.defineProperty(this, 'status', {
                        get: () => args.status
                    })
                    Object.defineProperty(this, 'statusText', {
                        get: () => args.statusText
                    })
                    Object.defineProperty(this, 'response', {
                        get: () => args.response.replaceAll('"need_login":true', '"need_login":false').replaceAll('"need_vip":true', '"need_vip":false')
                    })
                    Object.defineProperty(this, 'responseText', {
                        get: () => args.responseText.replaceAll('"need_login":true', '"need_login":false').replaceAll('"need_vip":true', '"need_vip":false')
                    })

                    console.log(this)

                    this.onloadend?.(args); // 新版页面
                    this.onreadystatechange?.(args); // 旧版页面
                }

            })
        } else if (this._url && this._url.includes("x/player/wbi/v2") && this._url.startsWith("https://api.bilibili.com")) {
            // 获取当前用户 vip 状态的接口, 替换 response 中的 status, 否则普通视频页面不能切换清晰度
            console.log('Hook: wbi request')
            console.log(this)

            const oriLoadEnd = this.onloadend;
            this.onloadend = (args) => {
                console.log('Hooked response:')

                let response = JSON.parse(this.response);
                let responseText = JSON.parse(this.responseText);

                response.data.vip.status = 1;
                responseText.data.vip.status = 1;

                response = JSON.stringify(response)
                responseText = JSON.stringify(responseText)
                console.log(response)

                Object.defineProperty(this, 'response', {
                    get: () => response
                })
                Object.defineProperty(this, 'responseText', {
                    get: () => responseText
                })
                console.log(this)

                oriLoadEnd.apply(this, args)
            }
            oriSend.apply(this, arguments);
        } else {
            oriSend.apply(this, arguments);
        }
    };

    const oriOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function() {
        this._method = arguments[0]
        this._url = arguments[1].startsWith("//") ? ("https:" + arguments[1]) : arguments[1]
        oriOpen.apply(this, arguments)
    };
})();

(() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let origin = location.href;
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new CustomEvent('pushstate', { detail: { origin: origin } }));
        window.dispatchEvent(new CustomEvent('locationchange', { detail: { origin: origin } }));
        return ret;
    };

    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let origin = location.href;
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new CustomEvent('replacestate', { detail: { origin: origin } }));
        window.dispatchEvent(new CustomEvent('locationchange', { detail: { origin: origin } }));
        return ret;
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new CustomEvent('locationchange'));
    });
})();
