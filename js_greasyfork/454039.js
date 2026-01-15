// ==UserScript==
// @name         京东审核助手
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      4.8.5
// @description  一键查询京东剩余量、送审量、审核量、不一致、人员审核量；工作区美化，去除无关元素；各板块添加审核组件，协助审核！
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzZweCIgaGVpZ2h0PSIzNnB4IiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5SZWN0YW5nbGUgMzwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IueUu+advyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4NC4wMDAwMDAsIC0xOC4wMDAwMDApIiBmaWxsPSIjMzg2NUVBIj4KICAgICAgICAgICAgPGcgaWQ9IuWIhue7hC00IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxODQuMDAwMDAwLCAxOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04Ljc0ODY5NzcyLDEuOTg0Njk3NjEgTDE5LjgwMTYxNzEsMC4wMTkyMTE5MjY5IEMyMC40NzQzMDEyLC0wLjEwMDQwODEzOCAyMS4xMTYwNTE3LDAuMzUwOTg2MDczIDIxLjIzNTAwNzEsMS4wMjc0MjkxMiBDMjEuMzE4MjgzNywxLjUwMDk4Mzk0IDIxLjEyMjYyODMsMS45ODAzODM5NyAyMC43MzI1NDIyLDIuMjU4NTgyMjggTDEyLjIxMjI5NjcsOC4zMzQ5NzgxNyBDMTEuNjU1MDgzNCw4LjczMjM2NjgyIDEwLjg4MzAxNTcsOC42MDAyNzkxNSAxMC40ODc4MzUzLDguMDM5OTUyMSBDMTAuNDcyOTkyOSw4LjAxODkwNjk1IDEwLjQ1ODgwNTIsNy45OTc0MDI1IDEwLjQ0NTI5MjksNy45NzU0Njk5NyBMNy45MTI2MTg5NSwzLjg2NDU1OTc3IEM3LjU1Mjg1MzE2LDMuMjgwNjA1ODYgNy43MzE5NjI5NSwyLjUxMzk0MDE3IDguMzEyNjcxODUsMi4xNTIxNjQwMSBDOC40NDYxMjgwNywyLjA2OTAyMjA0IDguNTk0MTA0MTIsMi4wMTIxODgyMiA4Ljc0ODY5NzcyLDEuOTg0Njk3NjEgWiBNMjQuNDgwMDE4OSwwLjM2NTYzOTM0OCBMMzIuOTU0ODI3Niw3Ljc2NjQ1MDI0IEMzMy40NzA2MDcxLDguMjE2ODY1ODcgMzMuNTI1NjI0LDkuMDAyNDU4MjMgMzMuMDc3NzExMyw5LjUyMTExOTg4IEMzMi43NjQxNDI4LDkuODg0MjE3MyAzMi4yNzA1MTk0LDEwLjAzMzAxMTEgMzEuODEwMDMxLDkuOTAzMjM5MDYgTDIxLjc1MjA2MTYsNy4wNjg3NjM3MyBDMjEuMDk0MjgzLDYuODgzMzkyNiAyMC43MTA0ODYxLDYuMTk2OTA1MDIgMjAuODk0ODI3MSw1LjUzNTQ1MDc5IEMyMC45MDE3NTA3LDUuNTEwNjA3NDQgMjAuOTA5NDQxMyw1LjQ4NTk4Njc0IDIwLjkxNzg4NzgsNS40NjE2MjQ0MSBMMjIuNTAxMDQ4NSwwLjg5NTI4ODg1MyBDMjIuNzI1OTM2MSwwLjI0NjY0MTg3NCAyMy40MzExNTM4LC0wLjA5NTg2NDIxNDggMjQuMDc2MTk2MywwLjEzMDI4MDA5MiBDMjQuMjI0NDM3NCwwLjE4MjI1MTY4NCAyNC4zNjE0ODQ1LDAuMjYyMTI2NjA1IDI0LjQ4MDAxODksMC4zNjU2MzkzNDggWiBNMzUuNjU1MjI4MiwxMS43NDA2NzMxIEwzNS4wNzMzMzA1LDIzLjAxMjYyNTcgQzM1LjAzNzkxNjEsMjMuNjk4NjQwMiAzNC40NTYxNzI3LDI0LjIyNTg5NTMgMzMuNzczOTcwMywyNC4xOTAyODMgQzMzLjI5NjM4MzYsMjQuMTY1MzUyIDMyLjg3NTg3OTIsMjMuODY1ODA0NCAzMi42OTQwNjc3LDIzLjQyMTAxMTIgTDI4LjcyMjk0ODQsMTMuNzA1ODU2NSBDMjguNDYzMjQyMiwxMy4wNzA0OTc2IDI4Ljc2NDkwNjcsMTIuMzQzNzI3NSAyOS4zOTY3MzUsMTIuMDgyNTcwMSBDMjkuNDIwNDY1NiwxMi4wNzI3NjE0IDI5LjQ0NDQ5NCwxMi4wNjM2OTc1IDI5LjQ2ODc4NTMsMTIuMDU1MzkxNyBMMzQuMDIxODAyMSwxMC40OTg1OTM3IEMzNC42Njg1NTcyLDEwLjI3NzQ1MDkgMzUuMzcxMTMxMiwxMC42MjU0MDc2IDM1LjU5MTA0NTIsMTEuMjc1Nzc2NyBDMzUuNjQxNTg0OSwxMS40MjUyNDIgMzUuNjYzMzY3LDExLjU4MzAxNiAzNS42NTUyMjgyLDExLjc0MDY3MzEgWiBNMzMuNzExOTk5NCwyNy41MzE4OTQgTDI0LjYzNDUyNTYsMzQuMTcwODE3MiBDMjQuMDgyMDY3NywzNC41NzQ4NjQxIDIzLjMwODQ4NzYsMzQuNDUyMDUwNyAyMi45MDY2ODU5LDMzLjg5NjUwNTcgQzIyLjYyNTM5ODIsMzMuNTA3NTg3NSAyMi41OTIyNjQ3LDMyLjk5MDQ1NjYgMjIuODIxNTk1NCwzMi41Njg0NTU2IEwyNy44MzA2MjY4LDIzLjM1MTEyNiBDMjguMTU4MjExMiwyMi43NDgzMjQyIDI4LjkwOTcyMjcsMjIuNTI2NzAwNCAyOS41MDkxNzQ3LDIyLjg1NjExNTMgQzI5LjUzMTY4OTMsMjIuODY4NDg3NyAyOS41NTM4MTU3LDIyLjg4MTU2MTUgMjkuNTc1NTIxNiwyMi44OTUzMTc4IEwzMy42NDM5NjQxLDI1LjQ3MzcyNDIgQzM0LjIyMTg4NTUsMjUuODM5OTg2MiAzNC4zOTUxMTkyLDI2LjYwODAxNjEgMzQuMDMwODkyNCwyNy4xODkxNjY5IEMzMy45NDcxODcyLDI3LjMyMjcyNDcgMzMuODM4OTYzMSwyNy40MzkwMzc1IDMzLjcxMTk5OTQsMjcuNTMxODk0IFogTTIwLjE4MjYxNjUsMzUuOTUxOTg2MiBMOS4zOTE0OTQxNiwzMi44NDYxOTY2IEM4LjczNDc0MzEyLDMyLjY1NzE3NzMgOC4zNTQ3MjAxNSwzMS45Njg1Njk5IDguNTQyNjg5MDksMzEuMzA4MTQ4OSBDOC42NzQyNzk3NiwzMC44NDU4MTA2IDkuMDU5MTIwOTMsMzAuNTAxMTc3NyA5LjUzMTAwNDQ3LDMwLjQyMzA5MjcgTDE5LjgzNzg2NDgsMjguNzE3NTY1NCBDMjAuNTExOTIwNSwyOC42MDYwMjYxIDIxLjE0ODI2ODcsMjkuMDY1MDg5MiAyMS4yNTkxODgyLDI5Ljc0MjkxMTUgQzIxLjI2MzM1NDIsMjkuNzY4MzY5NiAyMS4yNjY3MzE1LDI5Ljc5Mzk1MTkgMjEuMjY5MzE1MSwyOS44MTk2MjEzIEwyMS43NTM1NzcxLDM0LjYzMDkzODEgQzIxLjgyMjM2NjUsMzUuMzE0Mzg0NyAyMS4zMjcxNjcxLDM1LjkyNDUwMzkgMjAuNjQ3NTE4NSwzNS45OTM2Nzc2IEMyMC40OTEzMjQzLDM2LjAwOTU3NDggMjAuMzMzNTQ4NSwzNS45OTU0MjU4IDIwLjE4MjYxNjUsMzUuOTUxOTg2MiBaIE01LjI5OTk3NzM0LDMwLjUxOTAxNDEgTDAuOTA5MTQzMjQ0LDIwLjEzMTMzNzcgQzAuNjQxOTE1NzI3LDE5LjQ5OTE0MDUgMC45MzQ5MzQxODQsMTguNzY4ODAyMSAxLjU2MzYxODI5LDE4LjUwMDA4MTQgQzIuMDAzNzM4NywxOC4zMTE5NTkxIDIuNTEyMjY4ODgsMTguMzk1ODIzNSAyLjg2OTU4MDk3LDE4LjcxNTQ1NDcgTDEwLjY3Mzk3NjYsMjUuNjk2ODI2MSBDMTEuMTg0Mzc0MywyNi4xNTMzOTkgMTEuMjMwMDY0NiwyNi45Mzk1OTU2IDEwLjc3NjAyODksMjcuNDUyODQ1NCBDMTAuNzU4OTc1OSwyNy40NzIxMjIzIDEwLjc0MTMzMDYsMjcuNDkwODYxMSAxMC43MjMxMTg1LDI3LjUwOTAzNDQgTDcuMzA5NTU2OTksMzAuOTE1MzM5NSBDNi44MjQ2NjEzMSwzMS4zOTkyMDQ0IDYuMDQxNTA1NDEsMzEuMzk2MTcyMyA1LjU2MDMyOTMyLDMwLjkwODU2NyBDNS40NDk3NDczMywzMC43OTY1MDc1IDUuMzYxMzkwNTIsMzAuNjY0MzAzMiA1LjI5OTk3NzM0LDMwLjUxOTAxNDEgWiBNMC4xNTQ5MTkzMiwxNS4zNjgzNjgxIEw1LjU5MTc2NTY3LDUuNDkzNzE2NzQgQzUuOTIyNjUzODEsNC44OTI3NDI0MSA2LjY3NTM3MDMzLDQuNjc1MjkzMjIgNy4yNzMwMDUwNyw1LjAwODAzMDM3IEM3LjY5MTM4ODg4LDUuMjQwOTY4MzYgNy45Mzg3NTI0Niw1LjY5NTU2Njk5IDcuOTA4MjYyNTcsNi4xNzU0OTA3NyBMNy4yNDIzMDM2LDE2LjY1Nzk2NTggQzcuMTk4NzUwNzIsMTcuMzQzNTA2NSA2LjYxMDc5MTgyLDE3Ljg2Mzc0MzEgNS45MjkwNjA2NSwxNy44MTk5NDY5IEM1LjkwMzQ1NTczLDE3LjgxODMwMTkgNS44Nzc5MDc5LDE3LjgxNTg1NjMgNS44NTI0NTQyNSwxNy44MTI2MTM0IEwxLjA4MTU2Njg3LDE3LjIwNDc4OTcgQzAuNDAzODYzMzU0LDE3LjExODQ0ODUgLTAuMDc1OTE5NDU5NCwxNi40OTU5OTc5IDAuMDA5OTQxOTY3MjEsMTUuODE0NTA3NCBDMC4wMjk2NzQzMDE0LDE1LjY1Nzg4OTkgMC4wNzg4NzU5MTI3LDE1LjUwNjQ4MTYgMC4xNTQ5MTkzMiwxNS4zNjgzNjgxIFoiIGlkPSJSZWN0YW5nbGUtMyI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @match        https://docs.qq.com/scenario/link.html*
// @match        *://alidocs.dingtalk.com/*
// @connect      jd.hk
// @connect      jd.com
// @connect      yiyaojd.com
// @connect      jingdonghealth.cn
// @connect      talenttagbff.m.jd.com
// @connect      docs.qq.com
// @connect      www.cdzero.cn
// @connect      greasyfork.org
// @connect      sbi.ccloli.com
// @connect      so.com
// @connect      sogou.com
// @connect      localhost
// @connect      10.10.0.150
// @require      https://unpkg.com/vue@2.7.15/dist/vue.min.js
// @require      https://unpkg.com/xlsx@0.16.0/dist/xlsx.full.min.js
// @require      https://unpkg.com/element-ui@2.15.10/lib/index.js
// @require      https://unpkg.com/clipboard@2.0.10/dist/clipboard.min.js
// @require      https://unpkg.com/@zumer/snapdom@1.9.9/dist/snapdom.min.js
// @require      https://unpkg.com/codemirror@5.65.2/lib/codemirror.js
// @require      https://unpkg.com/codemirror@5.65.2/mode/css/css.js
// @require      https://unpkg.com/codemirror@5.65.2/mode/javascript/javascript.js
// @resource     codemirrorCSS https://unpkg.com/codemirror@5.65.2/lib/codemirror.css
// @resource     codemirrorTheme https://unpkg.com/codemirror@5.65.2/theme/dracula.css
// @resource     elementCSS https://unpkg.com/element-ui@2.15.10/lib/theme-chalk/index.css
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454039/%E4%BA%AC%E4%B8%9C%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454039/%E4%BA%AC%E4%B8%9C%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // 重写GM_addStyle函数
    const newGM_addStyle = GM_addStyle;
    GM_addStyle = function (css) {
        const allStyles = document.querySelectorAll("style");
        for (const styleDom of allStyles) {
            if (styleDom.textContent === css) {
                return false;
            }
        }
        newGM_addStyle(css);
    }
    CSS_mainPage();
    plugSetting();
    const host = window.location.host; // 获取host
    const href = window.location.href; // 获取href
    const search = window.location.search; // 获取search
    const pathName = window.location.pathname; // 获取pathname
    const hostPathName = host + window.location.pathname; // 获取host + pathname
    const { GetQueryString, WaylayHTTP, HTTP_XHR, AddDOM, SwitchRead, WaylaySetTimeOut, AwaitSelectorShow, SET_DATA, SwitchWrite } = Plug_fnClass();
    unsafeWindow.ymfApiOrigin = "http://10.10.0.150:6080";

    // 腾讯文档跳转页
    if (hostPathName === "docs.qq.com/scenario/link.html") {
        const url = GetQueryString("url");
        window.open(url, "_self");
        return false;
    }

    // 钉钉文档
    if (host === "alidocs.dingtalk.com") {
        Plug_dingTalk();
        return false;
    }

    // 频权验证页面
    Plug_FrequentAuth(host, href);

    // 函数暴露
    const ApiExport = SwitchRead("Api-Export");
    if (ApiExport.state) {
        unsafeWindow.Plug_fnClass = Plug_fnClass;
    }

    // 加载网络代码
    Plug_OtherFunction();

    // 京东视频详情页
    if (hostPathName === "h5.m.jd.com/active/faxian/video/index.html") {
        Plug_VideoExtract();
        return false;
    }

    // 数据榜
    if (host === "pro.m.jd.com" || host === "h5.m.jd.com") {
        Plug_DataRanking(host, href);
        return false;
    }

    // 原创审核
    if (host === "eco.cms.jd.com" && href.includes("tagTypeManager")) {
        Plug_TagTypeManager();
        return false;
    }

    // 审核页面
    if (host === "ver.jd.com") {
        // 避免水印异常、删除水印
        WaylaySetTimeOut([{
            callString: "changeCcoWatermarkState()",
            callback: (params) => {
                params.config.reScore();
                AwaitSelectorShow("#cco-watermark").then((div) => {
                    unsafeWindow.ccoWatermarkDraw = () => { };
                    div.remove();
                });
            }
        }]);
        if (!search && search.length === 0) {
            Plug_homePage();
            Plug_homeInnerQcPage();
        }
        if (!!search && search.length > 90) {
            Plug_workPage();
        }
        // Token获取
        const runConfig = {
            user: "",
            token: "",
        }
        WaylayHTTP([{
            url: /api\/user\/getWebSocketUrl|liveapi\/live\/opt\/buildWebSocketUrl/i,
            callback: (params) => {
                const content = JSON.parse(params.data.responseText).content;
                if (content.webSocketUrl) {
                    const regex = /\/([^/]+)\/([^/]+)\/[^/]+$/;
                    const match = content.webSocketUrl.match(regex);
                    if (match) {
                        const user = match[1];
                        const token = match[2];
                        if (user && token) {
                            runConfig.user = user;
                            runConfig.token = token;
                        }
                    }
                }
                params.stop();
            }
        }, {
            url: /api\/user\/getUserInfo/i,
            callback(params) {
                const content = JSON.parse(params.data.responseText).content;
                if (content.pin) {
                    runConfig.user = content.pin;
                }
                params.stop();
            }
        }]);
        AwaitSelectorShow(() => {
            const nick = document.querySelector(".avatar span")?.innerText;
            if (nick && nick !== "登录") {
                return nick;
            }
        }).then((nick) => {
            if (!nick) {
                return false;
            }
            console.log("当前用户昵称：" + nick);
            setTimeout(async () => {
                if (!runConfig.user) {
                    console.log("Token未拦截，尝试获取pin");
                    await HTTP_XHR({ url: "/api/user/getUserInfo" });
                }
                setTimeout(() => setInfo({ user: runConfig.user, token: runConfig.token, nick: nick }), 0);
            }, 1000);
        });
        function setInfo(params) {
            if (!params.user && !params.token) {
                console.log("Token未获取成功");
                return false;
            }
            const { user, token, nick } = params;
            const pluginKey = SwitchRead("Plugin-Key");
            if (pluginKey.user !== user || pluginKey.token !== token) {
                const data = { ...pluginKey, user: user, token: token, nick: nick };
                if (token && token !== data.oldToken) {
                    data.oldToken = token;
                }
                SwitchWrite("Plugin-Key", data);
                // 存储一份到localStorage
                SET_DATA("GM_CONFIG", {
                    userInfo: {
                        pin: user,
                        nick: nick
                    }
                })
            }
        }
        GM_addValueChangeListener("switchConfig", (name, oldValue, newValue, remote) => {
            const oldKey = oldValue["Plugin-Key"] || {};
            const newKey = newValue["Plugin-Key"] || {};
            if (oldKey.oldToken !== newKey.oldToken || oldKey.user !== newKey.user) {
                location.reload();
            }
        })
        return false;
    }

    // 种草秀
    if (hostPathName.includes("eco.m.jd.com/content/dr_home")) {
        Plug_grassShow();
        return false;
    }

    // erp主页
    if (host === "erp.jd.com") {
        Plug_erpHome();
        return false;
    }

    // 商卡页面
    if (/^\/(\d+)\.html$/.test(pathName)) {
        Plug_skuItem();
        return false;
    }

    // 移动商卡页面
    if (/^\/product\/(\d+)\.html$/.test(pathName)) {
        Plug_skuMJD();
        return false;
    }

    // 其它
    if (host === "eco.cms.jd.com") {
        WaylayHTTP([{
            method: "POST",
            url: "managesupport.jd.com/article/edit",
            callback: (params) => {
                const { result } = params.data.responseText && JSON.parse(params.data.responseText);
                const { operator, auditTime, createTime } = result || {};
                if (operator && auditTime) {
                    AddDOM({
                        addData: [{
                            name: "p",
                            className: "byAndSource",
                            innerHTML: "<b>创建时间：</b>" + createTime
                        }, {
                            name: "p",
                            className: "byAndSource",
                            innerHTML: "<b>审核时间：</b>" + auditTime
                        }, {
                            name: "p",
                            className: "byAndSource",
                            innerHTML: "<b>审核员：</b>" + operator
                        }]
                    }, true).then((element) => {
                        for (const p of element) {
                            const byAndSource = document.querySelector(".byAndSource");
                            Object.keys(byAndSource.dataset).forEach((item) => { p.dataset[item] = byAndSource.dataset[item] });
                            byAndSource.parentNode.insertBefore(p, byAndSource);
                        }
                    })
                }
                params.stop();
            }
        }, {
            method: "POST",
            url: "contentexamination.jd.com/article/edit",
            body: /^(?!.*"operateType":"C").*$/,
            stop: true,
            callback: (p) => {
                GM_addStyle(`
                    .audit-content h2>*:not(p) {
                        display: none !important;
                    }
                `)
            }
        }])
        return false;
    }
})();

function plugSetting() {
    if (window.self !== window.top) {
        return false;
    }
    const configArr = [{
        name: "通用",
        input: [{
            label: "秘钥",
            key: "Plugin-Key",
            value: "",
            info: "必须设置秘钥才能使用一些高级功能"
        }],
        switch: [{
            label: "快捷切换倍速",
            key: "Video-Rate-Fast",
            state: true,
            value: [4, 3, 2, 1.5, 1, 0.5],
            info: "在主视频旁边显示快捷切换倍速的按钮",
            switch: [{
                label: "记忆倍速",
                key: "Save-Rate",
                state: false, // false
                info: "记忆上一次操作时的倍速，在下个素材依旧有效"
            }]
        }, {
            label: "修改标签大小",
            key: "Label-Size-Change",
            state: true,
            info: "修改右侧标签选择按钮的大小",
            value: [{
                name: "默认",
                active: true
            }, {
                name: "大",
                height: "35px",
                fontSize: "15px",
                padding: "2px 12px"
            }, {
                name: "大大",
                height: "40px",
                fontSize: "15px",
                padding: "2px 14px"
            }, {
                name: "大大大",
                height: "45px",
                fontSize: "16px",
                padding: "2px 16px"
            }],
        }, {
            label: "页面美化",
            key: "Page-Beautify",
            state: true,
            info: "调整审核平台的样式，隐藏一些不必要的元素"
        }, {
            label: "以图搜图",
            key: "Recognize-Images",
            state: true,
            info: "截图或复制图片到剪贴板，在审核页面按下【Ctrl + V】（或触发粘贴事件）即可以图搜图",
            valueIndex: 0,
            hashStore: [],
            freeValue: [{
                name: "百度",
                url: "https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image={%s}"
            }, {
                name: "搜狗",
                url: "https://ris.sogou.com/ris?flag=1&from=pic_result_list&query={%s}"
            }, {
                name: "360",
                url: "https://st.so.com/r?src=st&submittype=imgurl&img_url={%s}"
            }]
        }, {
            label: "SKU图片预览",
            key: "SKU-Preview",
            state: true,
            info: "鼠标放在SKU图片上方即可使用放大镜模式查看细节"
        }, {
            label: "作者PIN",
            key: "Show-UserPin",
            state: true,
            info: "在素材上方用户信息处展示“作者PIN”"
        }, {
            label: "质检信息",
            key: "Show-UserQc",
            state: true,
            info: "在素材上方用户信息处展示质检人ERP信息、质检时间"
        }, {
            label: "聚焦页播放媒体",
            key: "One-Playback",
            state: true,
            info: "审核页面中只允许聚焦的网页播放媒体文件，自动暂停其它网页播放的媒体文件"
        }, {
            label: "视频滚轮事件",
            key: "Video-Scroll",
            state: false, // false
            info: "按下【Shift】并【滚动滚轮】可调整进度，按下【Shift + Ctrl】并【滚动滚轮】可调整音量"
        }, {
            label: "自动播放",
            key: "Video-Auto",
            state: false, // false
            info: "视频出现在视口50%以上触发播放（可能由于浏览器策略导致失败，失败后任意位置按下鼠标、键盘即可播放）"
        }]
    }, {
        name: "视频",
        switch: [{
            label: "VPN查重",
            key: "Repeat-VPN",
            state: true,
            info: "重写查重列表，使用VPN通道获取查重视频数据",
            switch: [{
                label: "自动加载",
                key: "Repeat-Auto-Video",
                state: true,
                info: "滚动到查重列表位置时，自动加载第一个抄袭视频"
            }, {
                label: "查重列表SKU",
                key: "Repeat-Sku-Show",
                state: false,
                info: "在查重列表中展示SKU信息，点击可跳转商详"
            }]
        }, {
            label: "SKU信息获取",
            key: "SKU-Get-Info",
            state: true,
            info: "获取SKU信息展示在审核页面",
            switch: [{
                label: "加载SKU列表",
                key: "SKU-List-Show",
                state: true,
                info: "如果有更多的SKU，则加载SKU列表，否则不展示",
                switch: [{
                    label: "自动展开SKU列表",
                    key: "SKU-List-Expand",
                    state: false,
                    info: "如果有更多的SKU，自动展开所有（不建议开启，列表太多会有明显卡顿感）"
                }]
            }]
        }, {
            label: "原创声明高亮",
            key: "Original-Hlight",
            state: true,
            info: "如果用户勾选“原创声明”则高亮声明"
        }, {
            label: "话题高亮 & 折叠打标",
            key: "Light-TalkLabel",
            state: true,
            info: "高亮话题审核元素，自动折叠打标内容（不包括打标板块）"
        }, {
            label: "视频比例标注",
            key: "Video-Scale",
            state: true,
            info: "标注视频宽高比例，如：竖版视频，根据宽高比例推算旋转后的高度"
        }, {
            label: "突出机审结果",
            key: "Machine-Only",
            state: true,
            info: "突出显示机审有问题的选项，隐藏机审无问题的内容",
        }, {
            label: "自动展开机审结果",
            key: "Machine-Auto-Show",
            state: true,
            info: "页面加载后，自动展开机审结果"
        }, {
            label: "显示打标标签",
            key: "Block-Tags",
            state: true,
            info: "在页面中显示内容标签、低俗标签、负向体感标签"
        }, {
            label: "查重列表提示",
            key: "Tip-Repeat",
            state: true,
            info: "存在查重列表，但列表不在视口中，则在页面增加提示按钮"
        }]
    }, {
        name: "标签",
        switch: [{
            label: "标签速切",
            key: "Label-Fast",
            state: true,
            info: "解决原页面标签切换慢的问题，并增加跳过空标签、跳过已完成标签、跳过自定义标签",
            textarea: ["语速", "视频商卡", "封面饱和度", "封面是否黑花边", "视频是否黑花边"],
            placeholder: "输入需要跳过的标签名，一行算一个"
        }, {
            label: "自动切换质量结果",
            key: "Label-Auto-Qc",
            state: true,
            info: "质量标自动识别低质标签，勾选/取消低质标签时同步修改【质量结果】",
            textarea: ["商卡视频不符", "标题总评级差", "封面清晰度低", "画面清晰度低", "视频美感低", "字幕质量低", "拍摄剪辑水平低"],
        }, {
            label: "隐藏2、3封面",
            key: "Hide-Cover",
            state: true,
            info: "隐藏第二、三张封面图"
        }, {
            label: "预览标签规则",
            key: "Label-Rule",
            state: false, // false
            info: "鼠标放置在对应标签位置可快速预览标签规则"
        }, {
            label: "无历史禁打标",
            key: "Audit-Personify",
            state: true,
            info: "人格化审核无历史素材时，禁止点击风格鲜明度、选品人设贴合度标签，以免误打"
        }, {
            label: "文本禁止选中",
            key: "Label-Ban-Pick",
            state: true,
            info: "打标按钮文本禁止选中，以获取更好的打标体验"
        }, {
            label: "空标签禁止保存",
            key: "Label-None-Stop",
            state: true,
            info: "内容标、质量标无标签时，不能保存"
        }, {
            label: "标签保存后自动关闭",
            key: "Label-Save-Close",
            state: true,
            info: "内容标、质量标保存成功后，自动关闭当前页面，按下键盘【Ctrl + Shift + T】可回看刚刚的素材"
        }]
    }, {
        name: "直播监看",
        switch: [{
            label: "监看时段跳转",
            key: "Live-Time-Jump",
            state: true,
            diffCutoff: true,
            autoPlay: true,
            info: "根据“中断时间”计算实际“监看时段”，点击可跳转到指定时段，进度条指示片段范围，自动续播放"
        }, {
            label: "显示内容来源",
            key: "Live-Source",
            state: true,
            info: "获取审核页面直播的“内容来源”"
        }, {
            label: "显示质检历史结果",
            key: "Live-QC-Record",
            state: true,
            info: "获取质检对于当前直播间的“违规处理”结果，最多展示50条"
        }, {
            label: "显示直播字幕",
            key: "Live-QC-Text",
            state: true,
            info: "获取直播开始时的字幕，ASR最开始的几条",
            switch: [{
                label: "自动加载",
                key: "Live-QC-Text-Open",
                state: false,
                info: "加载页面时自动加载字幕",
            }]
        }, {
            label: "直播截图",
            key: "Live-Screenshot",
            state: true,
            info: "右侧抽屉页加载直播截图，时间字体为红色，表示当前素材的截图"
        }, {
            label: "匹配前端验证",
            key: "Live-Do-Verify",
            state: false,
            info: "使用【实时直播Time】下载时，可输入前端验证数据，在下载时自动匹配"
        }]
    }, {
        name: "其它设置",
        switch: [{
            label: "提取视频",
            key: "Pick-Video",
            state: true,
            info: "将域名“h5.m.jd.com”中浏览的视频提取出来"
        }, {
            label: "频权自动刷新",
            key: "Verify-Auto",
            state: true,
            info: "触发频权验证并验证通过时，自动刷新其它需要验证的页面，无需手动刷新"
        }, {
            label: "原创权益下载",
            key: "Tag-Manager-Down",
            state: true,
            info: "可以把“原创权益”审核平台的数据下载到Excel表格"
        }, {
            label: "数据榜组件",
            key: "Rank-Use",
            state: true,
            info: "适配宽屏页面，优化页面跳转逻辑（跳转到电脑版商详），增加商卡ID复制按钮"
        }, {
            label: "种草秀（获取类目）",
            key: "Recomm-Category",
            state: true,
            info: "获取素材三级类目，展示在右侧"
        }, {
            label: "种草秀-打标（人格化）",
            key: "Recomm-Personify",
            state: true,
            info: "在页面中嵌入人格化审核页面，无需二次跳转"
        }, {
            label: "私域-文章（字数提示）",
            key: "Private-Wenzhang",
            state: true,
            info: "获取素材文本内容的字数，展示在右侧"
        }, {
            label: "质检管理复审优化",
            key: "Qc-Review-Open",
            state: true,
            info: "解决【质检管理复审】批量打开时，部分板块不显示操作按钮的问题"
        }, {
            label: "使用旧质检页面",
            key: "Old-Qc-Page",
            state: true,
            info: "打个单个素材时使用旧的链接，【/audit-detail】替换为【/Recheck/Detail】"
        }, {
            label: "阻止商卡跳转",
            key: "Stop-Sku-Skip",
            state: false,
            info: "由于获取价格、促销等信息失败，将导致商卡跳转403（开启则阻止跳转）"
        }, {
            label: "复制面板数据",
            key: "Copy-Board",
            state: false,
            info: "“数据面板”每次查询数据成功时，复制一份到剪贴板"
        }, {
            label: "合并私域、高热",
            key: "Siyu-Add-Board",
            state: false,
            info: "“数据面板”将【私域视频、私域其它】合并到一起，【高热巡检、先后-高热】合并到一起"
        }, {
            label: "素材转换",
            key: "Data-Convert",
            state: false,
            info: "在页面显示转换按钮，可将当前素材转换为私有素材格式"
        }, {
            label: "快捷申诉理由列表",
            key: "Appeal-Fast-Reason",
            state: true,
            info: "在处理审核申诉时，加载快捷列表，方便填写申诉理由"
        }, {
            label: "函数暴露💥",
            key: "Api-Export",
            state: false,
            info: "（危险）暴露插件函数给网页，会挂载到window下。暴露插件函数存在风险，除非你知道在干什么"
        }]
    }, {
        name: "文字高亮",
        type: "highlight",
        config: {
            value: [],
            color: "#ff0000",
            state: true
        },
        longConfig: {
            default: [{
                name: "第三方",
                value: ["PDD", "DOU", "淘宝", "抖音", "快手", "小红书", "小红署", "薯队长", "穿搭薯", "李佳琦", "拼多多"]
            }]
        }
    }, {
        name: "禁止驳回",
        type: "disable-reject",
        config: {
            value: [],
            lower: true,
            state: true
        }
    }, {
        name: "额外样式",
        type: "other-style",
        config: {
            code: "",
            state: true,
            auto: true
        },
        longConfig: {
            default: ""
        }
    }, {
        name: "调试模式",
        type: "debug",
        config: {
            key: "",
            code: "",
            auto: false
        },
        nodeConfig: {
            id: "debug",
        }
    }]
    const version = GM_info.script.version;
    const switchConfigTest = GM_getValue("switchConfig", {});
    if (switchConfigTest.version !== version) {
        setConfig(configArr);
    }
    function setConfig(configData) {
        const switchConfig = GM_getValue("switchConfig", {});
        for (const listObj of configData) {
            if (listObj.switch) {
                markSwitch(listObj.switch);
            }
            if (listObj.input) {
                for (const list of listObj.input) {
                    const oldValue = switchConfig[list.key] || {};
                    switchConfig[list.key] = {
                        ...oldValue,
                        value: oldValue.value || list.value,
                        version: version
                    }
                }
            }
            if (!!listObj.type) {
                if (listObj.type === "highlight") {
                    const oldData = switchConfig[listObj.type];
                    if (oldData && Array.isArray(oldData.value) && typeof oldData.value[0] !== "object") {
                        oldData.value = [{ name: "未命名分组", value: oldData.value }];
                    }
                }
                switchConfig[listObj.type] = {
                    ...listObj.config,
                    ...switchConfig[listObj.type],
                    ...listObj.longConfig,
                    version: version
                }
            }
        }
        function markSwitch(params) {
            for (const list of params) {
                if (list.switch) {
                    markSwitch(list.switch);
                }
                const minList = { ...list };
                delete minList.label;
                delete minList.info;
                delete minList.key;
                delete minList.switch;
                if (!switchConfig[list.key] || switchConfig[list.key].default === switchConfig[list.key].state) {
                    switchConfig[list.key] = {
                        ...minList,
                        ...switchConfig[list.key],
                        freeValue: list.freeValue,
                        state: list.state,
                        default: list.state,
                        version: version
                    }
                } else {
                    switchConfig[list.key] = {
                        ...minList,
                        ...switchConfig[list.key],
                        freeValue: list.freeValue,
                        version: version
                    }
                }
            }
        }
        function filterObjectByKey(obj, key) {
            const filteredObj = Object.fromEntries(Object.entries(obj).filter(([v, k]) => k.version === key));
            return filteredObj;
        }
        const overConfig = filterObjectByKey(switchConfig, version);
        GM_setValue("switchConfig", { ...overConfig, version: version });
    }
    GM_registerMenuCommand("🏀 设置", () => {
        CSS_settingPage();
        plugSettingPage(configArr);
    })
}

// 设置模态框
async function plugSettingPage(configArr) {
    const { AddDOM, RemoveDom, ThrottleOver, InputAuth, MessageTip, MessageBox, RunFrame, ObjectProperty, closeDialog } = Plug_fnClass();
    const isDialog = closeDialog("plug-setting");
    if (isDialog) {
        return false;
    }
    const passwdIco = Plug_ICO().passwdIco();
    const { Tooltip, SwitchBox } = Plug_Components();
    const plugName = GM_info.script.name;
    const switchConfig = GM_getValue("switchConfig", {});
    const debugConfig = switchConfig["debug"];
    const styleConfig = switchConfig["other-style"];
    const highlightConfig = switchConfig["highlight"];
    const disableRejectConfig = switchConfig["disable-reject"];
    const { menuNodeList, pageNodeList } = markPage(configArr);
    const { element: settingDom, close: closeBox } = await MessageBox({
        id: "plug-setting",
        title: plugName,
        body: [{
            name: "div",
            id: "menu",
            add: [{
                name: "div",
                id: "menu-list",
                add: menuNodeList
            }, {
                name: "div",
                id: "page",
                add: pageNodeList
            }]
        }],
        footer: [Tooltip({
            style: "margin-left: auto;",
            text: "手动刷新脚本第三方配置\n默认间隔30分钟刷新一次\n注：手动刷新将不带缓存",
            open: () => settingDom,
            node: [{
                name: "button",
                style: "margin-left: 0;",
                className: "gm-button danger",
                innerHTML: "刷新",
                click: () => {
                    // GM_CONFIG 插件的配置
                    // GM_SKU_BIZ_INFO 从京东获取的
                    // GM_SKU_CATEGORY 从京东获取的
                    [
                        "GM_HIGHLIGHT",
                        "GM_LABEL_RULES",
                        "GM_OTHER_JS",
                        "GM_OTHER_STYLE",
                        "GM_REPORT_INFO",
                        "GM_SUPER_USER",
                        "JD-INNER-QC-USER", // 内检权限
                        "JD-KPI-EXPRES", // KPI配置
                        "JD-PIN-USER", // 账号映射
                        "JD-QUERY-SOURCE" // 查询的配置
                    ].forEach((item) => localStorage.removeItem(item));
                    location.reload(true);
                }
            }]
        }), {
            name: "button",
            className: "gm-button danger",
            innerHTML: "保存",
            click: () => {
                GM_setValue("switchConfig", switchConfig);
                location.reload();
            }
        }, {
            name: "button",
            className: "gm-button",
            innerHTML: "关闭",
            click: () => closeBox()
        }],
        closeback: () => {
            window.removeEventListener("resize", throttleAutoShadow);
        }
    }, 0)
    const throttleAutoShadow = ThrottleOver(autoShadow, 100);
    // 自动阴影
    autoShadow();
    window.addEventListener("resize", throttleAutoShadow);
    function autoShadow(element = {}) {
        element = element.tagName || settingDom.querySelector("#page-list.active");
        const parentNode = element.parentNode;
        const isTop = element.scrollTop === 0;
        const isBottom = element.scrollTop + element.clientHeight + 1 >= element.scrollHeight;
        parentNode.classList.toggle("shadow-top", !isTop);
        parentNode.classList.toggle("shadow-bottom", !isBottom);
    }
    // 制作设置页面
    function markPage(configArr) {
        const arrNode = { menuNodeList: [], pageNodeList: [] };
        configArr.forEach((list, index) => {
            const { pageNode, callbackBlock } = pageList(list, index);
            const menuNode = menuList(list, index, callbackBlock);
            arrNode.pageNodeList.push(pageNode);
            arrNode.menuNodeList.push(menuNode);
        });
        return arrNode;
        function menuList(keyArr, i, callbackBlock) {
            function toClick(event) {
                const active = settingDom.querySelectorAll("#menu-list>div");
                addActive(active);
                const activePage = settingDom.querySelectorAll("#page>div");
                addActive(activePage);
                function addActive(activeArr) {
                    activeArr.forEach((item, index) => {
                        item.className = "";
                        if (i === index) {
                            item.className = "active";
                            autoShadow();
                            if (callbackBlock.length > 0) {
                                for (const callback of callbackBlock) {
                                    callback(event);
                                }
                                callbackBlock = [];
                            }
                        }
                    })
                }
            }
            return {
                name: "div",
                className: i === 0 ? "active" : "",
                innerHTML: keyArr.name,
                click: toClick,
                ...keyArr.nodeConfig
            }
        }
        function pageList(keyArr, i) {
            const { pageNode, callbackBlock } = addThis(keyArr);
            return {
                callbackBlock,
                pageNode: {
                    name: "div",
                    id: "page-list",
                    className: i === 0 ? "active" : "",
                    add: pageNode,
                    function: (element) => {
                        element.addEventListener("scroll", ThrottleOver(autoShadow, 100));
                    }
                }
            }
        }
        // 页面生成函数选择器
        function addThis(params) {
            const pageNode = [];
            const callbackBlock = [];
            if (params.input) {
                const nodeArr = pageInputList({ inputArr: params.input });
                pageNode.push(...nodeArr);
            }
            if (params.switch) {
                const nodeArr = pageSwitchList({ switchArr: params.switch });
                pageNode.push(...nodeArr);
            }
            if (params.type === "highlight") {
                const nodeArr = pageHighlight(params);
                pageNode.push(...nodeArr);
            }
            if (params.type === "disable-reject") {
                const nodeArr = disableReject(params);
                pageNode.push(...nodeArr);
            }
            if (params.type === "other-style") {
                pageNode.push({
                    name: "div",
                    id: "other-style",
                    className: "gm-code-page"
                });
                callbackBlock.push(pageOtherStyle);
            }
            if (params.type === "debug") {
                // 有鸡
                InputAuth("IKUN", () => {
                    const debug = settingDom.querySelector("#menu-list #debug");
                    debug.style.display = "block";
                    debug._isShow = true;
                    debug.click();
                })
                pageNode.push({
                    name: "div",
                    id: "debug-page",
                    className: "gm-code-page"
                });
                callbackBlock.push(pageDebugList);
            }
            return { pageNode, callbackBlock };
        }
    }
    // 输入框生成器
    function pageInputList({ inputArr, nodeConfig }) {
        return inputArr.map(key => ({
            name: "div",
            id: "page-item",
            ...nodeConfig,
            add: [{
                name: "div",
                className: "plug-center",
                add: [{
                    name: "span",
                    id: "label",
                    innerHTML: key.label + "："
                }, {
                    name: "div",
                    id: "password",
                    add: [{
                        name: "input",
                        type: "password",
                        style: "width: 250px;",
                        readonly: "true",
                        placeholder: "秘钥为空",
                        value: switchConfig[key.key].value
                    }, {
                        name: "span",
                        innerHTML: passwdIco.none,
                        click: (_, elem) => {
                            const input = elem.parentNode.querySelector("input");
                            if (input.type === "password") {
                                input.type = "text";
                                elem.innerHTML = passwdIco.block;
                            } else {
                                input.type = "password";
                                elem.innerHTML = passwdIco.none;
                            }
                        }
                    }]
                }, (() => {
                    const state = switchConfig[key.key].state;
                    return {
                        name: "span",
                        style: `margin-left: 10px;color: ${state ? "#388e3c" : "#ff0000"};`,
                        innerHTML: state ? "有效" : "无效"
                    }
                })(), {
                    name: "button",
                    className: "gm-button small",
                    innerHTML: "修改",
                    style: "margin-left: 10px;",
                    click: () => {
                        PluginKeyTest("open");
                    }
                }]
            }, {
                name: "span",
                id: "info",
                innerHTML: key.info
            }]
        }))
    }
    // 开关类型生成器
    function pageSwitchList({ switchArr, switchType, switchChange, nodeConfig }) {
        return switchArr.map(list => ({
            name: "div",
            id: "page-item",
            ...nodeConfig,
            add: [{
                name: "div",
                className: "plug-center",
                add: [SwitchBox({
                    checked: switchType !== undefined ? switchType : switchConfig[list.key].state,
                    function: (event) => {
                        event.addEventListener("change", () => {
                            if (switchChange) {
                                switchChange(event);
                            } else {
                                switchConfig[list.key].state = event.checked;
                            }
                        })
                    }
                }), {
                    name: "span",
                    id: "label",
                    innerHTML: list.label
                }]
            }, {
                name: "span",
                id: "info",
                innerHTML: list.info
            }, otherSwitch(list)]
        }))
    }
    // 开关其它嵌入组件
    function otherSwitch(list) {
        function heightAnimation(element, switchObj, defHeight) {
            const isAuto = defHeight === "auto" || !defHeight;
            element.style.transition = "height 0.25s";
            element.style.overflow = "hidden";
            RunFrame(() => ObjectProperty(switchObj, "state", setHeight));
            function setHeight(params) {
                if (isAuto) {
                    if (params.value) {
                        element.style.overflow = "auto";
                        element.style.height = "auto";
                        const height = element.clientHeight;
                        element.style.overflow = "hidden";
                        element.style.height = 0;
                        element.clientHeight;
                        element.style.height = `${height}px`;
                        setTimeout(() => {
                            if (switchObj.state) {
                                element.style.height = "auto";
                            }
                        }, 250)
                    } else {
                        element.style.height = "auto";
                        const height = element.clientHeight;
                        element.style.height = `${height}px`;
                        element.clientHeight;
                        element.style.height = 0;
                    }
                } else {
                    if (params.value) {
                        element.style.height = defHeight;
                    } else {
                        element.style.height = 0;
                    }
                }
            }
        }
        const otherDom = [];
        if (list.key === "Label-Fast" || list.key === "Label-Auto-Qc") {
            const openState = {
                textarea: switchConfig[list.key].textarea.join("\n")
            }
            otherDom.push({
                name: "div",
                className: "plug-center",
                style: "height: 135px",
                add: [{
                    name: "textarea",
                    className: "gm-textarea",
                    style: "width: 50%;height: 100%",
                    value: [openState, "textarea"],
                    placeholder: list.placeholder || "",
                    function: (element) => {
                        const ThrottleBcak = ThrottleOver(() => openState.textarea = element.value, 200);
                        element.addEventListener("input", ThrottleBcak);
                        ObjectProperty(openState, "textarea", (params) => {
                            if (params.value !== undefined) {
                                const valueArr = params.value.split("\n").filter((item) => item !== "");
                                switchConfig[list.key].textarea = valueArr;
                            }
                        })
                    }
                }, {
                    name: "button",
                    className: "gm-button small danger",
                    style: "margin-left: 15px;",
                    innerHTML: "重置",
                    click: () => openState.textarea = list.textarea.join("\n")
                }]
            });
        }
        if (list.key === "Video-Rate-Fast") {
            function chunkArray(size) {
                const arr = Array.from({ length: 8 }, (_, i) => (i * 0.5 + 0.5));
                const result = [];
                for (let i = 0; i < arr.length; i += size) {
                    result.push(arr.slice(i, i + size));
                }
                return result;
            }
            const rateArr = chunkArray(4);
            const rateObj = {};
            const valueArr = switchConfig[list.key];
            function setSwitch() {
                const data = Object.entries(rateObj).filter((i) => i[1] === true).map((k) => Number(k[0])).sort((a, b) => b - a);
                valueArr.value = data;
            }
            otherDom.push({
                name: "div",
                style: "gap: 15px;height: auto;",
                className: "plug-center",
                add: [{
                    name: "div",
                    className: "switch-video-rate-list",
                    add: rateArr.map((itemArr) => ({
                        name: "div",
                        className: "switch-video-rate-item",
                        add: itemArr.map((item) => {
                            rateObj[item] = valueArr.value.includes(item);
                            return {
                                name: "span",
                                className: [rateObj, item.toString()],
                                innerHTML: item.toFixed(1),
                                click() {
                                    const editType = !rateObj[item];
                                    if (valueArr.value.length >= 8 && editType) {
                                        return MessageTip("❌", "最多设置8个", 3).open(settingDom);
                                    }
                                    rateObj[item] = editType;
                                    setSwitch();
                                }
                            }
                        })
                    }))
                }, {
                    name: "button",
                    className: "gm-button small danger",
                    style: "margin-left: 0;",
                    innerHTML: "重置",
                    click: () => {
                        const oldRate = [4, 3, 2, 1.5, 1, 0.5];
                        for (const key in rateObj) {
                            if (Object.hasOwnProperty.call(rateObj, key)) {
                                if (oldRate.includes(Number(key))) {
                                    rateObj[key] = true;
                                } else {
                                    rateObj[key] = false;
                                }
                            }
                        }
                        setSwitch();
                    }
                }]
            });
        }
        if (list.key === "Label-Size-Change") {
            const data = switchConfig[list.key];
            otherDom.push({
                name: "div",
                style: "gap: 15px;height: auto;",
                className: "plug-center",
                add: [{
                    name: "div",
                    className: "switch-label-size-item",
                    add: data.value.map((item) => {
                        !item.active && (item.active = false);
                        return {
                            name: "span",
                            className: [item, "active"],
                            innerHTML: item.name,
                            click() {
                                data.value.forEach((i) => i.active = false);
                                item.active = true;
                            }
                        }
                    })
                }]
            })
        }
        if (list.switch) {
            otherDom.push(...pageSwitchList({ switchArr: list.switch, nodeConfig: { style: "padding: 0;margin-top: 20px;" } }));
        }
        return {
            name: "div",
            style: "display: flex;",
            function: (element) => switchConfig[list.key] && heightAnimation(element, switchConfig[list.key]),
            add: [{
                name: "div",
                style: "height: auto;margin-right: 10px;box-shadow: 0 0 10px 3px #cccccc;"
            }, {
                name: "div",
                style: "width: calc(100% - 10px);",
                add: otherDom
            }]
        };
    }
    // 启用代码着色
    function codeColor({ element, mode }, callback) {
        const editCode = CodeMirror.fromTextArea(element, {
            mode: mode, // 编辑器模式，比如 JavaScript, HTML, CSS 等
            theme: "dracula", // 使用的主题样式
            lineNumbers: true,  // 是否显示行号
            indentUnit: 4, // 缩进单位
            smartIndent: true, // 智能缩进
            readOnly: false, // 是否只读
            extraKeys: {
                Tab: (event) => {
                    // 使用空格缩进
                    const spaces = Array(event.getOption("indentUnit") + 1).join(" ");
                    event.replaceSelection(spaces, "end", "+input");
                }
            }
        });
        editCode.on("changes", callback);
        return editCode;
    }
    // 额外样式
    function pageOtherStyle() {
        const Mirror = settingDom.querySelector("#style-code .CodeMirror");
        if (Mirror) {
            return false;
        }
        let editCode = null;
        // 添加页面
        const configPage = settingDom.querySelector("#other-style");
        AddDOM({
            addNode: configPage,
            addData: [{
                name: "div",
                id: "page-item",
                style: "margin-bottom: 5px;",
                add: [{
                    name: "div",
                    className: "plug-center",
                    add: [{
                        name: "span",
                        id: "label",
                        style: "margin-right: 5px;",
                        innerHTML: "额外样式"
                    }, SwitchBox({
                        checked: styleConfig.state,
                        function: (event) => {
                            event.addEventListener("change", () => {
                                styleConfig.state = event.checked;
                            })
                        }
                    }), {
                        name: "span",
                        style: "margin-right: 10px;height: 75%;border: 1px solid #aaaaaa;",
                    }, {
                        name: "span",
                        id: "label",
                        style: "margin-right: 5px;",
                        innerHTML: "自动获取"
                    }, SwitchBox({
                        checked: styleConfig.auto,
                        function: (event) => {
                            event.addEventListener("change", () => {
                                styleConfig.auto = event.checked;
                                isRead();
                            })
                        }
                    })]
                }, {
                    name: "span",
                    id: "info",
                    innerHTML: "在审核页面中添加额外的样式代码，以优化显示效果"
                }]
            }, {
                name: "div",
                id: "style-code",
                style: "padding-left: 10px;",
                className: "gm-code",
                add: [{
                    name: "textarea"
                }],
            }]
        }).then(() => {
            const textarea = configPage.querySelector("textarea");
            editCode = codeColor({
                element: textarea,
                mode: "css"
            }, (instance) => {
                if (!instance.options.readOnly) {
                    styleConfig.code = instance.getValue();
                }
            })
            isRead();
        })
        function isRead() {
            if (styleConfig.auto) {
                editCode.setOption("readOnly", true);
                editCode.setValue(styleConfig.default || "/* 自动获取样式代码 */\n");
            } else {
                editCode.setOption("readOnly", false);
                editCode.setValue(styleConfig.code || "/* 请输入样式代码 */\n");
            }
        }
    }
    // DeBug 页面生成器，出现才渲染编辑器，避免提前渲染导致的错位
    function pageDebugList({ target }) {
        const Mirror = settingDom.querySelector("#debug-code .CodeMirror");
        if (Mirror) {
            return false;
        }
        if (target.id !== "debug" || target._isShow !== true || target.style.display !== "block") {
            return false;
        }
        // 添加页面
        const debugPage = settingDom.querySelector("#debug-page");
        AddDOM({
            addNode: debugPage,
            addData: [{
                name: "div",
                id: "debug-code",
                style: "padding-left: 10px;",
                className: "gm-code",
                add: [{
                    name: "textarea",
                    value: debugConfig.code || "// 请输入调试代码\n",
                }]
            }, {
                name: "div",
                id: "page-item",
                style: "margin-top: 5px;",
                add: [{
                    name: "div",
                    className: "plug-center",
                    add: [{
                        name: "span",
                        id: "label",
                        style: "margin-right: 5px;",
                        innerHTML: "自动调试"
                    }, SwitchBox({
                        style: "margin-right: 0;",
                        checked: debugConfig.auto,
                        function: (event) => {
                            event.addEventListener("change", () => {
                                debugConfig.auto = event.checked;
                            })
                        }
                    }), Tooltip({
                        place: "bottom",
                        style: "margin: 0 10px;",
                        open: () => settingDom,
                        text: "1. 调试代码报错时，则暂停自动调试，手动触发后恢复自动\n2. 一小时内未触发，则暂停自动调试，手动触发后恢复自动\n3. 触发后再次触发，则暂停自动调试，手动触发后恢复自动",
                    }), {
                        name: "span",
                        id: "label",
                        style: "margin-right: 5px;",
                        innerHTML: "触发按键"
                    }, {
                        name: "input",
                        type: "text",
                        className: "gm-input",
                        style: "width: 100px;",
                        placeholder: "输入按键",
                        value: debugConfig.key,
                        function: (event) => {
                            event.addEventListener("input", (e) => {
                                event.value = e.data;
                                debugConfig.key = e.data;
                            })
                        }
                    }]
                }]
            }]
        }).then(() => {
            const debugCode = debugPage.querySelector("#debug-code textarea");
            codeColor({
                element: debugCode,
                mode: "javascript"
            }, (instance) => {
                debugConfig.code = instance.getValue();
            })
        })
    }
    // 禁止驳回
    function disableReject() {
        return [{
            name: "div",
            style: "height: 100%;width: 100%;display: flex;flex-direction: column;",
            add: [{
                name: "div",
                id: "page-item",
                style: "margin-bottom: 5px;",
                add: [{
                    name: "div",
                    className: "plug-center",
                    add: [{
                        name: "span",
                        id: "label",
                        style: "margin-right: 5px;",
                        innerHTML: "禁止驳回"
                    }, SwitchBox({
                        checked: disableRejectConfig.state,
                        function: (event) => {
                            event.addEventListener("change", () => {
                                disableRejectConfig.state = event.checked;
                            })
                        }
                    }), {
                        name: "span",
                        style: "margin-right: 10px;height: 75%;border: 1px solid #aaaaaa;",
                    }, {
                        name: "span",
                        id: "label",
                        style: "margin-right: 5px;",
                        innerHTML: "禁止低质"
                    }, SwitchBox({
                        checked: disableRejectConfig.lower,
                        function: (event) => {
                            event.addEventListener("change", () => {
                                disableRejectConfig.lower = event.checked;
                            })
                        }
                    })]
                }, {
                    name: "span",
                    id: "info",
                    innerHTML: "指定内容ID，将在处理阶段阻止驳回 / 低质"
                }]
            }, {
                name: "div",
                id: "page-textarea",
                add: [{
                    name: "textarea",
                    className: "gm-textarea",
                    placeholder: "输入内容ID，一行算一个",
                    value: disableRejectConfig.value.join("\n"),
                    function: (event) => {
                        const ThrottleBcak = ThrottleOver(() => {
                            const valueArr = event.value.replace(/ /g, "").split("\n").filter((item) => item !== "");
                            disableRejectConfig.value = valueArr;
                        }, 200);
                        event.addEventListener("input", ThrottleBcak);
                    }
                }]
            }]
        }]
    }
    // 文字高亮
    function pageHighlight(params) {
        const { config } = params;
        let addGroupBack = () => { };
        GM_addStyle(`
            #page-highlight .highlight-config {
                gap: 10px;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                overflow-y: auto;
                padding: 0 0 0 10px;
            }
            #page-highlight .highlight-config>div {
                border: 1px solid #bbbbbb;
                border-radius: 8px;
                padding: 5px;
                display: flex;
                flex-direction: column;
                width: calc(33.3% - 7px);
            }
            #page-highlight .highlight-config>div .highlight-delete {
                width: 0;
                height: 24px;
                border-radius: 5px;
                padding: 0;
                overflow: hidden;
                transition: 0.2s;
            }
            #page-highlight .highlight-config>div:hover .highlight-delete {
                width: 24px;
            }
            #page-highlight .highlight-config .highlight-config-group-list label:hover {
                width: 32px !important;
                color: #ffffff !important;
            }
        `)
        return [{
            name: "div",
            id: "page-highlight",
            add: [...pageSwitchList({
                switchArr: [{
                    label: "高亮开关",
                    info: "高亮指定关键字，仅高亮审核页面"
                }],
                switchType: highlightConfig.state,
                switchChange: (event) => {
                    highlightConfig.state = event.checked;
                },
                nodeConfig: {
                    style: "margin-bottom: 5px;"
                }
            }), {
                name: "div",
                id: "page-item",
                style: "margin-bottom: 5px",
                add: [{
                    name: "div",
                    style: "gap: 10px",
                    className: "plug-center",
                    add: [Tooltip({
                        text: "修改高亮颜色",
                        open: () => settingDom,
                        node: [{
                            name: "label",
                            style: "margin-right: 0;position: relative;display: block;cursor: pointer;",
                            add: [{
                                name: "span",
                                className: "gm-highlight-light test-highlight-span",
                                style: `background: ${highlightConfig.color || ""}`,
                                innerHTML: "示例文本"
                            }, {
                                name: "input",
                                type: "color",
                                className: "test-highlight-input",
                                value: highlightConfig.color || "",
                                style: "position: absolute;left: 0;bottom: -6px;visibility: hidden;width: 0;height: 0;",
                                function: (event) => {
                                    event.addEventListener("input", () => {
                                        const span = document.querySelector(".test-highlight-span");
                                        span.style.background = event.value;
                                        highlightConfig.color = event.value;
                                        const groupList = document.querySelectorAll(".highlight-config-group-list");
                                        groupList.forEach((group) => group._updateColor(event.value));
                                    })
                                }
                            }]
                        }]
                    }), Tooltip({
                        text: "重置颜色",
                        open: () => settingDom,
                        node: [{
                            name: "button",
                            className: "gm-button small",
                            style: "margin-left: 0;",
                            innerHTML: "重置",
                            click: () => {
                                const span = document.querySelector(".test-highlight-span");
                                const input = document.querySelector(".test-highlight-input");
                                input.value = config.color;
                                span.style.background = config.color;
                                highlightConfig.color = config.color;
                                const groupList = document.querySelectorAll(".highlight-config-group-list");
                                groupList.forEach((group) => group._updateColor(config.color));
                            }
                        }]
                    }), Tooltip({
                        text: "添加新分组",
                        open: () => settingDom,
                        node: [{
                            name: "button",
                            className: "gm-button small",
                            style: "margin-left: 0;",
                            innerHTML: "添加",
                            click: () => addGroupBack()
                        }]
                    })]
                }]
            }, {
                name: "div",
                className: "highlight-config",
                function(element) {
                    const groupDefault = highlightConfig.default;
                    for (let index = groupDefault.length - 1; index >= 0; index--) {
                        const data = groupDefault[index];
                        addGroup(data, true);
                    }
                    const groupValue = highlightConfig.value || [];
                    for (const data of groupValue) {
                        addGroup(data);
                    }
                    addGroupBack = () => {
                        const newData = { name: "未命名分组", value: [] };
                        highlightConfig.value.push(newData);
                        addGroup(newData);
                    };
                    async function addGroup(data, isDef) {
                        if (!data.value) {
                            console.error("高亮关键字的数据结构不正确")
                            return false;
                        }
                        const groupDom = await AddDOM({
                            addData: [{
                                name: "div",
                                className: "highlight-config-group-list",
                                style: isDef ? "background: #f8f8f8;" : "",
                                add: [{
                                    name: "div",
                                    style: "gap: 5px;display: flex;align-items: center;",
                                    add: [Tooltip({
                                        text: "自定义颜色(右键重置)",
                                        open: () => settingDom,
                                        node: [{
                                            name: "label",
                                            className: "gm-button small",
                                            style: "padding: 0 2px;position: relative;transition: width 0.2s;white-space: nowrap;overflow: hidden;display: block;height: 19px;line-height: 19px;width: 8px;",
                                            add: [{
                                                name: "span",
                                                innerText: "示例"
                                            }, {
                                                name: "input",
                                                type: "color",
                                                style: "position: absolute;left: 0;bottom: -4px;visibility: hidden;width: 0;height: 0;",
                                                function: (element) => {
                                                    const labelDom = element.parentNode;
                                                    const throttle = ThrottleOver((value) => {
                                                        labelDom.style.color = value;
                                                        labelDom.style.width = "8px";
                                                    }, 1000);
                                                    const updateColor = (value, isChange) => {
                                                        if (data.isFree && !isChange) {
                                                            return false;
                                                        }
                                                        labelDom.style.background = value;
                                                        element.value = value;
                                                        data.color = value;
                                                        labelDom.style.color = "#ffffff";
                                                        labelDom.style.width = "32px";
                                                        throttle(value);
                                                    };
                                                    updateColor(data.color || highlightConfig.color || "", true);
                                                    RunFrame(() => groupDom._updateColor = updateColor);
                                                    element.addEventListener("input", () => (data.isFree = true) && updateColor(element.value, true));
                                                    labelDom.addEventListener("contextmenu", (e) => {
                                                        e.preventDefault();
                                                        data.isFree = false;
                                                        updateColor(highlightConfig.color);
                                                        MessageTip("✔️", "颜色已重置", 3).open(settingDom);
                                                    });
                                                }
                                            }]
                                        }]
                                    }), {
                                        name: "input",
                                        type: "text",
                                        className: "gm-input",
                                        style: "width: 100%;padding: 3px 0;border: none;border-bottom: 1px dashed #bbbbbb;border-radius: 0;",
                                        disabled: !!isDef,
                                        placeholder: "输入分组名称",
                                        value: data.name,
                                        function(element) {
                                            element.addEventListener("input", () => {
                                                data.name = element.value;
                                            })
                                        }
                                    }, !isDef && Tooltip({
                                        text: "删除",
                                        open: () => settingDom,
                                        node: [{
                                            name: "button",
                                            className: "gm-button danger small highlight-delete",
                                            innerText: "X",
                                            click: () => {
                                                const newGroup = highlightConfig.value.filter((item) => item !== data);
                                                if (highlightConfig.value.length - newGroup.length === 1) {
                                                    highlightConfig.value = newGroup;
                                                    RemoveDom(groupDom, "all");
                                                }
                                            }
                                        }]
                                    })]
                                }, {
                                    name: "textarea",
                                    className: "gm-textarea",
                                    style: "height: 170px;border: none;",
                                    disabled: !!isDef,
                                    placeholder: "关键字，一行一个或空格隔开",
                                    value: data.value.join("\n"),
                                    function(element) {
                                        const ThrottleBcak = ThrottleOver(() => {
                                            const valueArr = element.value.split(/\n|\s+/).filter((item) => item !== "");
                                            data.value = valueArr;
                                        }, 200);
                                        element.addEventListener("input", ThrottleBcak);
                                    }
                                }]
                            }]
                        }).then((div) => {
                            element.insertBefore(div, element.firstChild);
                            return div;
                        });
                    }
                }
            }]
        }]
    }
}

// 秘钥弹窗
async function PluginKeyTest(params) {
    const { GM_XHR, SwitchRead, SwitchWrite, MessageTip, MessageBox, FormatTime, ObjectProperty, closeDialog } = Plug_fnClass();
    const isDialog = closeDialog("plug-key");
    if (isDialog) {
        return false;
    }
    const { SwitchBox } = Plug_Components();
    const time = FormatTime();
    const pluginKey = SwitchRead("Plugin-Key");
    const isRemind = pluginKey.remind === time;
    if (isRemind && params !== "open") {
        return false;
    }
    if (pluginKey.value && pluginKey.state && params !== "open") {
        return false;
    }
    const plugName = GM_info.script.name;
    const { element: settingDom, close: closeBox } = await MessageBox({
        id: "plug-key",
        title: plugName,
        body: [{
            name: "div",
            style: "display: flex;align-items: center;font-weight: bold;white-space: nowrap;",
            add: [{
                name: "span",
                innerHTML: "秘钥："
            }, {
                name: "input",
                type: "text",
                style: "width: 100%;",
                className: "gm-input",
                value: pluginKey.value,
                placeholder: "输入秘钥",
                function: (elem) => {
                    ObjectProperty(pluginKey, "value", (params) => {
                        elem.value = params.value;
                    })
                    elem.addEventListener("input", () => {
                        pluginKey.value = elem.value;
                    })
                }
            }]
        }, {
            name: "div",
            style: "margin-top: 15px;color: rgba(0,0,0,0.65);",
            innerHTML: "验证秘钥以获取完整功能，无秘钥则无法使用“AB级达人匹配”、“质量标行业显示”、“质量标规则预览”、“获取关键字”等功能"
        }, {
            name: "div",
            style: "margin: 15px 0;display: flex;gap: 10px;align-items: center;",
            add: [SwitchBox({
                checked: false,
                function: (elem) => {
                    elem.checked = isRemind;
                    elem.addEventListener("change", () => {
                        const checked = elem.checked;
                        if (!pluginKey.state) {
                            pluginKey.value = "";
                        }
                        if (checked) {
                            pluginKey.remind = time;
                            SwitchWrite("Plugin-Key", pluginKey);
                        } else {
                            pluginKey.remind = "";
                            SwitchWrite("Plugin-Key", pluginKey);
                        }
                    })
                }
            }), {
                name: "div",
                style: "color: rgba(0,0,0,0.65);",
                innerHTML: "今日不再提醒（秘钥无效时）"
            }]
        }],
        footer: [{
            name: "button",
            className: "gm-button danger",
            innerHTML: "关闭",
            click: () => {
                closeBox();
            }
        }, {
            name: "button",
            className: "gm-button",
            innerHTML: "验证",
            click: async () => {
                const isKey = await getJdData("class");
                if (isKey === 200) {
                    SwitchWrite("Plugin-Key", { ...pluginKey, state: true });
                    MessageTip("✔️", "验证通过", 3).open(settingDom);
                    setTimeout(() => {
                        closeBox();
                        location.reload();
                    }, 1500)
                } else if (isKey === 403) {
                    pluginKey.state = false;
                    pluginKey.value = "";
                    SwitchWrite("Plugin-Key", pluginKey);
                    MessageTip("❌", "验证失败，秘钥无效", 3).open(settingDom);
                } else if (isKey === 401) {
                    MessageTip("❌", "请输入秘钥", 3).open(settingDom);
                } else {
                    MessageTip("❌", "验证中...", 3).open(settingDom);
                }
            }
        }],
    })
    // 获取京东数据
    let isRun = false;
    async function getJdData(name) {
        if (!pluginKey.value) {
            return 401;
        }
        if (isRun) {
            return false;
        }
        isRun = true;
        try {
            const { responseText, status } = await GM_XHR({
                method: "GET",
                url: `https://www.cdzero.cn/api/jd/get-data?type=${name}&token=${pluginKey.value}`
            });
            if (!!responseText && status === 200) {
                return 200;
            }
        } catch (error) {
            console.error(error);
        }
        isRun = false;
        return 403;
    }
}

// 图标
function Plug_ICO() {
    class ico {
        constructor() {
            // 复制图标
            this.redCopyIco = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="32" height="32"><path fill="%23fa7679" d="m658.5 719.5v19.6c0 16.1-13.1 29.2-29.3 29.2h-307.6c-16.2 0-29.3-13.1-29.3-29.2v-380.9c0-16.2 13.1-29.3 29.3-29.3h19.5v361.3c0 16.2 13.1 29.3 29.3 29.3z"/><path fill="%23fa7679" d="m731.7 388.3v277.5c0 16.2-13.1 29.3-29.3 29.3h-307.6c-16.2 0-29.3-13.1-29.3-29.3v-380.9c0-16.1 13.1-29.2 29.3-29.2h204.3c2.6 0 5.1 1 6.9 2.8l122.9 122.9c1.8 1.8 2.8 4.3 2.8 6.9z"/><path fill="%23fde8e8" d="m593.4 374.5v-109.1l128.6 128.6h-109.1c-10.8 0-19.5-8.8-19.5-19.5z"/></svg>';
            // 白点图标
            this.whiteDropIco = 'data:image/svg+xml;utf8,<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="white" /></svg>';
            // 时间图标
            this.blackTimeIco = 'data:image/svg+xml;utf8,<svg viewBox="60 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" style="fill:hsla(0, 0%, 0%, 0.62)"></path></svg>';
            // 时间图标
            this.whiteTimeIco = 'data:image/svg+xml;utf8,<svg viewBox="60 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" style="fill:hsl(0, 0%, 100%)"></path></svg>';
            // 问题图标
            this.questionIco = '<svg viewBox="64 64 896 896" xmlns="http://www.w3.org/2000/svg"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/><path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"/></svg>';
            // 左箭头图标
            this.leftArrowIco = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M783.36 1003.52c30.72-30.72 30.72-76.8 0-107.52L404.48 512l378.88-378.88c30.72-30.72 30.72-76.8 0-107.52-30.72-30.72-76.8-30.72-107.52 0L240.64 455.68c-30.72 30.72-30.72 76.8 0 107.52l435.2 435.2c30.72 30.72 76.8 30.72 107.52 5.12z"/></svg>';
            // 分享图标
            this.shareAltIco = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M204.8 1023.931733a204.8 204.8 0 0 1-204.8-204.8v-614.4a204.8 204.8 0 0 1 204.8-204.8h136.533333a68.266667 68.266667 0 1 1 0 136.533334H204.8a68.266667 68.266667 0 0 0-68.266667 68.266666v614.4a68.266667 68.266667 0 0 0 68.266667 68.266667h614.4a68.266667 68.266667 0 0 0 68.266667-68.266667v-136.533333a68.266667 68.266667 0 0 1 136.533333 0v136.533333a204.8 204.8 0 0 1-204.8 204.8z m88.2688-292.864a68.266667 68.266667 0 0 1 0-96.6656l497.8688-497.595733H614.4a68.266667 68.266667 0 0 1 0-136.533333h341.333333a68.266667 68.266667 0 0 1 68.266667 68.266666v341.333334a68.266667 68.266667 0 0 1-136.533333 0V233.198933l-497.8688 498.346667a68.744533 68.744533 0 0 1-96.529067 0z"/></svg>';
        }
        // 密码小眼睛图标
        passwdIco() {
            const icoObj = {
                none: '<svg viewBox="64 64 896 896" width="14px" height="14px" fill="currentColor"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"></path></svg>',
                block: '<svg viewBox="64 64 896 896" width="14px" height="14px" fill="currentColor"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>'
            }
            return icoObj;
        }
    }
    const plug = new ico();
    Plug_ICO = () => plug;
    return plug;
}

// 组件
function Plug_Components() {
    const { AddDOM, RemoveDom, RunFrame } = Plug_fnClass();
    const { questionIco } = Plug_ICO();
    class Components {
        constructor() {
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(name => name !== "constructor" && typeof this[name] === "function")
                .forEach(methodName => this[methodName] = this[methodName].bind(this));
        }

        /**
         * 开关组件
         * @param {object} params - 配置对象
         * @param {string} [params.style] - 样式
         * @param {boolean} params.checked - checked 状态
         * @param {function} params.function - 元素被创建的回调
         * @param {boolean} [params.loading] - 是否加载中
         * @param {boolean} [params.disabled] - 是否禁用
         * @returns 返回节点信息，用于 AddDOM 注入
         */
        SwitchBox(params = {}) {
            return {
                "msg-tip": params["msg-tip"] || "",
                name: "label",
                style: params.style || "",
                className: "gm-switch",
                add: [{
                    name: "input",
                    loading: !!params.loading,
                    checked: !!params.checked,
                    disabled: !!params.disabled,
                    type: "checkbox",
                    function(event) {
                        params.function && params.function(event, async (callback) => {
                            if (!event._isLoading) {
                                event._isLoading = true;
                                event.checked = !event.checked;
                                event.setAttribute("loading", true);
                                event.setAttribute("disabled", true);
                                await callback();
                                event._isLoading = false;
                                event.setAttribute("loading", false);
                                event.removeAttribute("disabled")
                            }
                        });
                    }

                }, {
                    name: "span",
                    className: "gm-slider",
                }]
            }
        }

        /**
         * Tooltip创建器
         * @param {object} params - 文本，内部dom {text,node,style,place:top|bottom,open}
         * @param {string} params.text - tooltip 文本内容
         * @param {HTMLElement} params.node - 需要显示 tooltip 的元素
         * @param {string} [params.style] - 样式
         * @param {'top'|'bottom'} [params.place] - 位置，默认top
         * @param {HTMLElement|function} [params.open] - 元素挂载的位置，默认挂载到 body 上
         * @returns {object} 返回节点信息，用于 AddDOM 注入
         */
        Tooltip(params = {}) {
            if (params.node instanceof HTMLElement) {
                _run(params.node);
            } else {
                return {
                    name: "span",
                    className: "gm-tooltip",
                    add: params.node,
                    style: params.style || "",
                    function: _run
                }
            }
            function _run(element) {
                if (!params.node) {
                    element.classList.add("question");
                    element.innerHTML = questionIco;
                }
                let isMouseOver = false;
                let mouseX = 0;
                let mouseY = 0;
                let messageBox = null;
                let tipInterval = null;
                function tipSetpage() {
                    let place = ["top", "bottom"].includes(params.place) ? params.place : "top";
                    // 获取位置
                    const rect = element.getBoundingClientRect();
                    // 计算Tooltip的位置
                    const Width = () => messageBox.offsetWidth;
                    const Height = () => messageBox.offsetHeight;
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    // 箭头信息
                    const arrowSize = 8;
                    const rWidth = rect.width / 2;
                    // 位置信息
                    const bubble = {
                        top: rect.top + rect.height + arrowSize,
                        left: rect.left + rWidth - Width() / 2,
                        bottom: screenHeight - rect.top + arrowSize,
                        arrowX: Width() / 2 - arrowSize,
                    };
                    // 左边不够
                    if (bubble.left < 0) {
                        bubble.arrowX = Width() / 2 - arrowSize + bubble.left - 5;
                        bubble.left = 5;
                        setPage(bubble);
                    }
                    // 右边不够
                    if (bubble.left + Width() > screenWidth) {
                        bubble.arrowX = Width() / 2 - arrowSize + (bubble.left + Width()) - screenWidth + 5;
                        bubble.left = screenWidth - Width() - 5;
                        setPage(bubble);
                    }
                    if (place === "top") {
                        // 上不够，设置下
                        if (rect.top - Height() - arrowSize < 0) {
                            place = "bottom";
                            setPage(bubble);
                        }
                    }
                    if (place === "bottom") {
                        // 下不够，设置上
                        if (bubble.top + Height() > screenHeight) {
                            place = "top";
                            setPage(bubble);
                        }
                    }
                    setPage(bubble);
                    function setPage(placeData) {
                        const { top, left, bottom, arrowX } = placeData;
                        messageBox.style.setProperty("--tooltip-top", place === "bottom" ? -arrowSize + "px" : "none");
                        messageBox.style.setProperty("--tooltip-bottom", place === "top" ? -arrowSize + "px" : "none");
                        messageBox.style.setProperty("--tooltip-left", arrowX + "px");
                        messageBox.style.setProperty("--tooltip-rotate", (place === "top" ? 180 : 0) + "deg");
                        // 更新Tooltip的位置和内容
                        if (place === "bottom") {
                            messageBox.style.top = top + "px";
                            messageBox.style.left = left + "px";
                            messageBox.style.bottom = "auto";
                        } else {
                            messageBox.style.top = "auto";
                            messageBox.style.left = left + "px";
                            messageBox.style.bottom = bottom + "px";
                        }
                    }
                }
                // 移除Tip
                function tipClose() {
                    RemoveDom(messageBox, "all");
                    messageBox = null;
                    isMouseOver = false;
                    clearInterval(tipInterval);
                }
                // 循环监听元素是否存在
                function tipLoopRun() {
                    clearInterval(tipInterval);
                    tipInterval = setInterval(() => {
                        if (isMouseOver) {
                            const rect = element.getBoundingClientRect();
                            const isOver =
                                mouseY + 2 < rect.top ||
                                mouseX + 2 < rect.left ||
                                mouseX > rect.right + 2 ||
                                mouseY > rect.bottom + 2;
                            if (isOver || element.offsetWidth === 0 || element.offsetHeight === 0) {
                                tipClose();
                            } else {
                                tipSetpage();
                            }
                        }
                    }, 50)
                }
                // 鼠标进入元素时处理title属性
                element.addEventListener("mousemove", async (e) => {
                    if (!isMouseOver) {
                        mouseX = e.clientX;
                        mouseY = e.clientY;
                        isMouseOver = true;
                        messageBox = await AddDOM({
                            addNode: document.body,
                            addData: [{
                                name: "div",
                                className: "gm-tooltip-info",
                                innerText: Array.isArray(params.text) ? "" : params.text || "无",
                                add: !Array.isArray(params.text) ? "" : params.text || [],
                                function: params.function || function () { }
                            }]
                        }).then((tipDiv) => {
                            if (params.open instanceof HTMLElement) {
                                params.open.appendChild(tipDiv);
                            } else if (typeof params.open === "function") {
                                params.open().appendChild(tipDiv);
                            }
                            return tipDiv;
                        });
                        tipSetpage();
                        // 循环监听元素
                        tipLoopRun();
                    }
                });
                // 鼠标离开元素
                document.addEventListener("mouseout", () => {
                    if (isMouseOver) {
                        tipClose();
                    }
                });
            }
        }

        /**
         * 图片懒加载
         * @param {object} params - 配置对象
         * @param {string} params.src - 图片元素数组
         * @param {string} params.style - 图片样式
         * @param {number} [params.threshold] - 图片出现在屏幕的比例，默认0.3才加载
         * @returns {object} 图片元素对象，用于 AddDOM 注入
         */
        lazyLoadImg(params = {}) {
            function observerImg(element) {
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const target = entry.target;
                            target.src = target.dataset.src;
                            observer.unobserve(target);
                        }
                    });
                }, {
                    threshold: params.threshold || 0.3
                });
                observer.observe(element);
            }
            return {
                name: "img",
                style: params.style && params.style || "",
                "data-src": params.src,
                function: observerImg
            };
        }

        /**
         * 创建右侧卡片
         * @param {object} param - 配置对象
         * @param {HTMLElement} param.addNode - 注入页面的父元素
         * @param {string} param.title - 卡片标题
         * @param {object} param.body - 卡片内容，AddDOM 的 addData 格式
         * @returns {HTMLElement} 卡片元素
         */
        antcapCard({ addNode, title, body }) {
            return AddDOM({
                addNode,
                addData: [{
                    name: "div",
                    className: "ant-card antcap-card",
                    add: [{
                        name: "div",
                        className: "ant-card-head antcap-card-head",
                        add: [{
                            name: "div",
                            className: "ant-card-head-wrapper antcap-card-head-wrapper",
                            add: [{
                                name: "div",
                                className: "ant-card-head-title antcap-card-head-title",
                                ...title
                            }]
                        }]
                    }, {
                        name: "div",
                        className: "ant-card-body antcap-card-body",
                        ...body
                    }]
                }]
            });
        }

        /**
         * 直播监看折叠卡片
         * @returns {{setCardName:function, setCardNameStyle:function, setBody:function, setPage:function, open:function}} 操作方法
         * - setCardName(string) 设置卡片名称
         * - setCardNameStyle(string) 设置卡片名称样式
         * - setBody(addData) 设置卡片内容，AddDOM 的 addData 格式
         * - setPage(callback(element)) 元素创建成功后的回调，由该回调决定注入页面的方式
         * - open(boolean) 打开/关闭卡片
         */
        collapseCard() {
            const cardConfig = {
                cardName: "",
                cardStyle: "",
                bodyElement: null,
                item: "antcap-collapse-item",
                content: "antcap-collapse-content antcap-collapse-content-inactive",
            };
            const cardPage = AddDOM({
                addData: [{
                    name: "div",
                    className: [cardConfig, "item"],
                    add: [{
                        name: "div",
                        className: "antcap-collapse-header",
                        innerHTML: `<i aria-label="图标: right" class="anticon anticon-right antcap-collapse-arrow"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true" style=""><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></i>`,
                        add: [{
                            name: "span",
                            style: [cardConfig, "cardStyle"],
                            innerHTML: [cardConfig, "cardName"],
                        }],
                        function(element) {
                            cardConfig.open = (isOpen) => {
                                const isInactive = typeof isOpen === "boolean" ? isOpen : cardConfig.content.includes("inactive");
                                element.querySelector("svg").style = isInactive ? "transform: rotate(90deg);" : "";
                                cardConfig.content = `antcap-collapse-content antcap-collapse-content-${isInactive ? "active" : "inactive"}`;
                            }
                        },
                        click: () => cardConfig.open()
                    }, {
                        name: "div",
                        className: [cardConfig, "content"],
                        add: [{
                            name: "div",
                            className: "antcap-collapse-content-box",
                            style: "display: flex;flex-direction: column;gap: 15px;",
                            function(element) {
                                cardConfig.bodyElement = element;
                            }
                        }]
                    }]
                }]
            })
            return {
                setCardName: (params) => cardConfig.cardName = params,
                setCardNameStyle: (params) => cardConfig.cardStyle = params,
                setBody: (params) => RunFrame(() => {
                    RemoveDom(cardConfig.bodyElement);
                    AddDOM({
                        addNode: cardConfig.bodyElement,
                        addData: params
                    })
                }),
                setPage: (params) => cardPage.then((element) => params(element)),
                open: (params) => RunFrame(() => cardConfig.open(params))
            }
        }
    }
    GM_addStyle(`
        .gm-tooltip.question {
            height: 20px;
            width: 20px;
            border: 1px solid #cccccc;
            border-radius: 50%;
            cursor: help;
        }
        .gm-tooltip.question svg {
            fill: #888888;
        }
        .gm-tooltip.question:hover svg {
            fill: #666666;
        }
        .gm-tooltip-info {
            position: fixed;
            transition: top 50ms, left 50ms, bottom 50ms;
            color: #ffffff;
            z-index: 2000000;
            padding: 6px 8px !important;
            font-size: 14px;
            font-weight: initial;
            line-height: 1.4;
            max-width: 450px;
            text-align: left;
            border-radius: 5px;
            pointer-events: none;
            background: rgba(0,0,0,0.75);
            box-shadow: 0 2px 8px rgba(0,0,0,.15);
        }
        .gm-tooltip-info::before {
            content: "";
            position: absolute;
            top: var(--tooltip-top, -8px);
            bottom: var(--tooltip-bottom, -8px);
            left: var(--tooltip-left, 10px);
            transform: rotate(var(--tooltip-rotate, 0deg));
            height: 8px;
            width: 16px;
            background: inherit;
            clip-path: path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z');
        }
    `)
    const plug = new Components();
    // 捕获msg-tip属性
    document.addEventListener("mouseenter", (e) => {
        const target = e.target;
        if (target && target instanceof HTMLElement) {
            const title = target.getAttribute("msg-tip");
            if (title && !target._isTooltipRun) {
                target._isTooltipRun = true;
                const place = target.getAttribute("msg-place");
                plug.Tooltip({ text: title, node: target, place: place });
            }
        }
    }, true);
    Plug_Components = () => plug;
    return plug;
}

// 常用方法
function Plug_fnClass() {
    class Plug_Plug {
        constructor() {
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(name => name !== "constructor" && typeof this[name] === "function")
                .forEach(methodName => this[methodName] = this[methodName].bind(this));
        }

        /**
         * 插件开关设置
         * @param {string | object} name - 开关名称
         * @param {string} saveName - 开关键名（key）
         * @param {number} initial - 默认开、关，不设置为1（开）
         * @param {boolean} click - 点击标识，反转开关（不可传参）
         * @returns {boolean} 返回当前开关状态
         */
        SwitchPrompt(name, saveName, initial = true, click) {
            const state = ["❌ ", "✔️ "];
            const isOpen = GM_getValue(saveName, initial);
            let configName = state[Number(isOpen)] + name;
            if (typeof name === "object") {
                configName = name[Number(isOpen)];
            }
            GM_registerMenuCommand(configName, () => { this.SwitchPrompt(name, saveName, isOpen, true) });
            if (!!click) {
                GM_setValue(saveName, !initial);
                location.reload();
            }
            return isOpen;
        }

        /**
         * 读取开关设置
         * @param {string} name - 开关名称
         * @returns {{state: boolean}} 返回当前开关状态
         */
        SwitchRead(name) {
            const switchConfig = GM_getValue("switchConfig", {});
            return switchConfig[name] || {};
        }

        /**
         * 修改开关设置
         * @param {string} name - 开关名称
         * @param {object} config - 开关配置
         * @returns {{state: boolean}} 返回当前开关状态
         */
        SwitchWrite(name, config) {
            const switchConfig = GM_getValue("switchConfig", {});
            if (typeof config === "object") {
                switchConfig[name] = config;
                GM_setValue("switchConfig", switchConfig);
            }
            return switchConfig[name] || {};
        }

        /**
         * 读取存储
         * @param {string} name - 存储的键名
         * @param {string|object} def - 为空的默认返回内容，不填返回undefined
         * @returns {string|object} 返回GET的值
         */
        GET_DATA(name, def = undefined) {
            if (!name) {
                return def;
            }
            return JSON.parse(localStorage.getItem(name)) || def;
        }

        /**
         * 存储写入
         * @param {string} name - 存储的键名，GM_CONFIG 特殊处理，只更新内部字段，不会完整替换
         * @param {string|object} data - 存储的内容
         * @returns {string|object} 返回写入的值
         */
        SET_DATA(name, data) {
            if (!name) {
                return data;
            }
            if (name === "GM_CONFIG") {
                const oldData = this.GET_DATA(name);
                data = { ...oldData, ...data };
            }
            localStorage.setItem(name, JSON.stringify(data));
            return data;
        }

        /**
         * JavaScript代码压缩
         * @param {string} code - JavaScript的代码
         * @returns {string} 压缩后的代码
         */
        CompressCode(code) {
            // 首先转义字符串中的内容，避免误删
            const stringList = [];
            const protectedCode = code.replace(/'(.*?)'|"(.*?)"|`(.*?)`/g, (match) => {
                stringList.push(match);
                return `__STRING__${stringList.length - 1}__`;
            });
            // 删除单行注释
            const noCommentsCode = protectedCode.replace(/\/\/.*?[\r\n]/g, "\n").replace(/\/\*[\s\S]*?\*\//g, "");
            // 恢复字符串内容
            const finalCode = noCommentsCode.replace(/__STRING__(\d+)__/g, (_, index) => stringList[index]);
            // 删除多余的空格和换行符
            return finalCode.replace(/\s+/g, " ").trim();
        }

        /**
         * 复制数据到剪贴板
         * @param {string|HTMLElement} content - 需要复制的数据
         * @returns {Promise<boolean>} 返回复制函数的异步结果
         */
        CopyText(content) {
            return new Promise((resolve, reject) => {
                if (typeof content === "string") {
                    handleCopy(content);
                } else if (content instanceof HTMLElement) {
                    handleCopy(content.innerText);
                } else {
                    reject("不支持的数据格式，仅支持字符串和HTML元素");
                }
                function handleCopy(textToCopy) {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            resolve(true);
                        }).catch((error) => {
                            console.error("现代复制失败，使用旧方法");
                            fallbackCopy(textToCopy);
                        });
                    } else {
                        fallbackCopy(textToCopy);
                    }
                }
                function fallbackCopy(textToCopy) {
                    try {
                        const input = document.createElement("textarea");
                        input.value = textToCopy;
                        input.style.position = "fixed";
                        document.body.appendChild(input);
                        input.focus();
                        input.select();
                        document.execCommand("copy");
                        document.body.removeChild(input);
                        resolve(true);
                    } catch (error) {
                        reject(error);
                        console.error("旧复制方法失败", error);
                    }
                }
            })
        }

        /**
         * 格式化时间
         * @param {string} format - 时间格式，默认YYYY-MM-DD
         * @param {Date} date - 可选，传入一个时间对象
         * @returns {string} 返回格式化后的时间格式
         */
        FormatTime(format = "YYYY-MM-DD", date) {
            const time = date && new Date(date) || new Date();
            const year = time.getFullYear();
            const month = (time.getMonth() + 1).toString().padStart(2, "0");
            const day = time.getDate().toString().padStart(2, "0");
            const hour = time.getHours().toString().padStart(2, "0");
            const minute = time.getMinutes().toString().padStart(2, "0");
            const second = time.getSeconds().toString().padStart(2, "0");
            const formattedDate = format
                .replace("YYYY", year)
                .replace("MM", month)
                .replace("DD", day)
                .replace("HH", hour)
                .replace("hh", hour)
                .replace("mm", minute)
                .replace("ss", second);
            return formattedDate;
        }

        /**
         * 天数加减法
         * @param {string|Date} date - 需要运算的时间
         * @param {number} day - 需要减去的天数
         * @param {string} [format] - 时间格式，默认YYYY-MM-DD
         * @returns {string} 返回格式化后的时间格式
         */
        DiffDay(date, day, format = "YYYY-MM-DD") {
            const oldTime = new Date(date);
            oldTime.setDate(oldTime.getDate() - day);
            return this.FormatTime(format, oldTime);
        }

        /**
         * 分割时间范围为多个区间
         * @param {array} timeArr 时间范围数组，格式为 ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm:ss"]
         * @param {number} parts 要分割的区间数量
         * @returns 包含多个区间的数组，每个区间为 ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm:ss"] 格式
         */
        TimeRange(timeArr, parts) {
            const [startTime, endTime] = timeArr;
            const startSeconds = new Date(startTime).getTime() / 1000;
            const endSeconds = new Date(endTime).getTime() / 1000;
            const interval = Math.ceil((endSeconds - startSeconds) / parts); // 每个区间的秒数
            const result = [];
            for (let i = 0; i < parts; i++) {
                const rangeStart = Math.min(startSeconds + i * interval, endSeconds);
                const rangeEnd = Math.min(rangeStart + interval - 1, endSeconds);
                result.push([
                    this.FormatTime("YYYY-MM-DD HH:mm:ss", rangeStart * 1000),
                    this.FormatTime("YYYY-MM-DD HH:mm:ss", rangeEnd * 1000)
                ]);
            }
            return result;
        }

        /**
         * 获取Cookie
         * @param {string} cookieName - Cookie键名
         * @returns {string} 返回对应键值的名称
         */
        GetCookie(cookieName) {
            const cookieRegex = new RegExp("(?:(?:^|.*;\\s*)" + cookieName + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            const cookieValue = document.cookie.replace(cookieRegex, "$1");
            return cookieValue;
        }

        /**
         * 复制dom元素为图片
         * @param {string|HTMLElement} element - 节点选择器字符串 或 dom元素
         * @returns {Promise<boolean>} 返回一个Promise，成功为True
         */
        CopyHtml2Img(element) {
            return new Promise(function (resolve, reject) {
                if (typeof element === "string") {
                    element = document.querySelector(element);
                }
                snapdom.toBlob(element, {
                    scale: 2, // 缩放比例,默认为1
                    type: "png"
                }).then((blob) => {
                    try {
                        const blobIMG = new ClipboardItem({ [blob.type]: blob });
                        navigator.clipboard.write([blobIMG]).then(() => {
                            resolve(true);
                        }).catch((error) => {
                            console.error("无法复制：", error);
                            reject("leave");
                        })
                    } catch (error) {
                        console.error("无法复制：", error);
                        reject(false);
                    }
                });
            })
        }

        /**
         * 跨域的网络请求
         * @param {object} config 请求配置
         * @param {string} config.url 请求地址（必选）
         * @param {string} [config.method] 请求方法（可选，如 "GET", "POST" 等）
         * @param {string|object} [config.data] 请求数据（可选，GET 通常不需要）
         * @param {object} [config.header] 请求头配置（可选，默认会带基础头信息）
         * @param {number} [config.timeout=10000] 超时时间（可选，单位 ms，默认 5000ms）
         * @param {string} [config.cookie] 携带的 Cookie 信息（可选）
         * @param {boolean} [config.anonymous=false] 是否匿名请求（可选，默认 false）
         * @param {function} [config.onprogress] 请求取得了一些进展，则执行
         * @param {function} callback 请求的回调
         * @returns {Promise<object>} 使用then方法获取结果或者await
         */
        GM_XHR({ method, url, data, header, timeout = 10000, cookie = "", anonymous = false, onprogress = () => { } }, callback = () => { }) {
            const headers = {}
            headers["Content-Type"] = "application/json";
            for (const head in header) {
                if (header.hasOwnProperty(head)) {
                    headers[head] = header[head];
                }
            }
            if (
                !!data &&
                typeof data === "object" &&
                !(data instanceof ArrayBuffer) &&
                !(data instanceof FormData) &&
                !(data instanceof URLSearchParams) &&
                !(data instanceof Blob)
            ) {
                data = JSON.stringify(data);
            }
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: method || "GET",
                    url: url,
                    data: data,
                    headers: header,
                    timeout: timeout,
                    cookie: cookie,
                    anonymous: anonymous,
                    onprogress,
                    onload: function (data) {
                        if (data.readyState == 4) {
                            callback(data);
                            resolve(data);
                        }
                    },
                    onerror: function (error) {
                        callback(error);
                        reject(error);
                    },
                    ontimeout: function (out) {
                        callback(out);
                        reject(out);
                    }
                })
            })
        }

        /**
         * XMLHttpRequest方法
         * @param {object} config - 请求配置
         * @param {string} config.url - 请求地址
         * @param {string} [config.method] - 可选，请求方法，默认GET（如 "GET", "POST" 等）
         * @param {string|object} [config.data] - 可选，请求数据（GET 通常不需要）
         * @param {object} [config.header] - 可选，请求头配置（默认会带基础头信息）
         * @param {boolean} [config.isWith=false] - 可选，是否携带 Cookie 信息（默认 false）
         * @param {function} callback - 请求的回调
         * @returns {Promise<XMLHttpRequest>} 使用then方法获取结果或者await
         */
        HTTP_XHR({ method, url, data = null, header, isWith = false, controller = () => { } }, callback = () => { }) {
            return new Promise(function (resolve, reject) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.withCredentials = isWith;
                    xhr.open(method || "GET", url, true);
                    for (const headKey in header) {
                        if (header.hasOwnProperty(headKey)) {
                            xhr.setRequestHeader(headKey, header[headKey]);
                        }
                    }
                    // 添加信号到xhr请求
                    xhr.upload.onabort = () => {
                        reject("请求被用户取消");
                        callback("请求被取消");
                    };
                    xhr.upload.onerror = (e) => {
                        reject(e);
                        callback(e);
                    };
                    xhr.onload = function () {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.readyState === 4) {
                            resolve(xhr);
                        } else {
                            reject(xhr);
                        }
                        callback(xhr);
                    }
                    xhr.onerror = function () {
                        reject(xhr);
                        callback(xhr);
                    };
                    xhr.send(typeof data === "object" ? JSON.stringify(data) : data);
                    controller(xhr);
                } catch (err) {
                    console.error(err);
                    callback(err);
                    reject({ msg: "失败" });
                }
            })
        }

        /**
         * 从网络请求数据并缓存到浏览器，缓存时间30分钟
         * @param {object} webConfig - 网络请求的配置，和GM_XHR一致
         * @param {string} lsName - 缓存的key字段
         * @returns {Promise<object>} 返回的数据
         */
        async GetApiCache(webConfig, lsName) {
            const cachedData = this.GET_DATA(lsName) || {};
            const currentTime = Date.now();
            // 30 分钟
            const thirtyMinutes = 30 * 60 * 1000;
            // 检查缓存数据是否存在，并且小于 30 分钟
            if (cachedData && cachedData.data && cachedData.time && currentTime - parseInt(cachedData.time) < thirtyMinutes) {
                return Promise.resolve(cachedData.data);
            }
            // 如果不满足条件，发起网络请求
            return this.GM_XHR(webConfig).then((xhr) => {
                const data = JSON.parse(xhr.response);
                if (data.code === 200) {
                    this.SET_DATA(lsName, {
                        data: data.data,
                        time: currentTime
                    });
                    return data.data;
                }
                return cachedData.data || {};
            }).catch((error) => {
                console.error(error);
                return cachedData.data || {};
            });
        }

        /**
         * 获取JD-PIN-USER的内容，并返回数据和getPinUser的方法
         * @returns {Promise<{pinUser: object, getPinUser: function}>} 返回 { pinUser, getPinUser }
         * - pinUser 京东PIN-USER的配置数据
         * - getPinUser(name) 获取京东PIN-USER的方法
         */
        async JDPinUserClass() {
            const pinUser = await this.GetApiCache({
                method: "POST",
                timeout: 2000,
                url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/config`,
                data: {
                    name: "jd-user",
                    type: "GET",
                }
            }, "JD-PIN-USER");
            return {
                pinUser,
                getPinUser(name) {
                    const config = pinUser && pinUser.config || {};
                    const isChinese = /^[\u4e00-\u9fa5]/.test(name);
                    const indexParam = isChinese ? "user" : "pin";
                    const configParam = isChinese ? "pin" : "user";
                    const index = config[indexParam] && config[indexParam].indexOf(name);
                    if (index >= 0) {
                        return config[configParam] ? config[configParam][index] || name : name;
                    }
                    return name;
                }
            }
        }

        /**
         * 从百川获取数据
         * @param {string} cid - 内容ID
         * @returns {Promise<object>} 返回结果
         */
        async Contentexamination(cid) {
            const Encode = this.Encode;
            const GM_XHR = this.GM_XHR;
            const UpdateUrlParam = this.UpdateUrlParam;
            async function getCmsCookie() {
                const url = UpdateUrlParam("http://ssa.jd.com/oidc/authorize", {
                    oauth2ParamPrefixPolicy: "Default",
                    scope: "openid",
                    response_type: "code",
                    redirect_uri: "http://erp.jd.com/?redirect_uri=" + Encode(location.href).run(),
                    client_id: "content-manage-support",
                    hideUriCodeAndState: "hidden"
                })
                return GM_XHR({
                    method: "GET",
                    url: url,
                    header: {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    timeout: 2000
                }).then(async (xhr) => {
                    const { data } = JSON.parse(xhr.responseText) || {};
                    if (data.value && /^http/.test(data.value)) {
                        return window.open(data.value, "_self");
                    }
                    if (data.type === "OIDC_CODE") {
                        await JD_OIDC_CODE(data.value);
                    }
                }).catch((error) => {
                    console.error(error);
                })
            }
            return GM_XHR({
                method: "POST",
                url: "http://contentexamination.jd.com/article/edit",
                data: `{"id": ${cid},"operateType":"C"}`,
                header: { "Content-Type": "application/json;charset=UTF-8" },
                timeout: 2000
            }).then(async (xhr) => {
                if (xhr.status !== 200 || !xhr.responseText || !xhr.responseText.includes(cid)) {
                    await getCmsCookie();
                }
                return xhr;
            })
        }

        /**
         * 获取京东任务详情数据
         * @param {number} [optType] - 可选，操作类型，默认 2
         * @returns {Promise<object>} 返回任务详情数据
         */
        GetTaskDetailData(optType = 2) {
            if (unsafeWindow.getTaskDetailData) {
                return unsafeWindow.getTaskDetailData(optType);
            }
            const optMap = {};
            const lineMap = {
                32: 7
            };
            const { bizLine, taskId, contentId } = this.GetQueryString(null);
            const getContent = async (optTypeNum) => {
                const typeId = lineMap[bizLine] || 0;
                const taskUrl = `/api/workbench/getTaskDetailData?opt_type=${optTypeNum}&type=${typeId}&task_id=${taskId}&content_id=${contentId}`;
                return this.HTTP_XHR({ method: "GET", url: taskUrl }).then((xhr) => JSON.parse(xhr.responseText).content);
            };
            unsafeWindow.getTaskDetailData = async (optType = 2) => {
                if (!optMap[optType]) {
                    optMap[optType] = getContent(optType);
                }
                return optMap[optType].then((content) => JSON.parse(JSON.stringify(content)));
            };
            return unsafeWindow.getTaskDetailData(optType);
        }

        /**
         * 等待元素出现在页面中
         * @param {string|function} nodeData - 选择器元素的名称，或者函数
         * @param {boolean} showType - 可选，是否启用窗口在前台才继续？默认关闭
         * @param {function} callback - 可选，由函数控制元素是否应该加载，无法保证返回元素，返回一个结束函数，传入true则完成等待
         * @returns {Promise<HTMLElement|null>} 返回Promise，成功则返回等待的元素
         */
        AwaitSelectorShow(nodeData, showType, callback) {
            const ObserverDOM = this.ObserverDOM;
            const config = {
                type: !showType,
                node: undefined,
                observer: null,
                over: false,
                callback: null
            }
            callback && (config.callback = callback);
            return new Promise(function (resolve, reject) {
                function _over(params) {
                    config.over = true;
                    config.node = params || null;
                    return _backRun();
                }
                queryNode();
                async function queryNode() {
                    const node = typeof nodeData === "function" ? await nodeData() : document.querySelector(nodeData);
                    if (node) {
                        if (config.callback) {
                            return config.callback(_over, node);
                        }
                        _over(node);
                    } else if (!config.observer) {
                        config.observer = ObserverDOM(queryNode).observe(document, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });
                    }
                }
                showNode();
                function showNode() {
                    const visible = document.visibilityState === "visible";
                    if (visible) {
                        document.removeEventListener("visibilitychange", showNode);
                        config.type = visible;
                        return _backRun();
                    } else if (!config.typeEvent) {
                        config.typeEvent = true;
                        document.addEventListener("visibilitychange", showNode);
                    }
                }
                function _backRun() {
                    if (!!config.over && !!config.type) {
                        config.observer && config.observer.stop();
                        resolve(config.node);
                    }
                }
            })
        }

        /**
         * 等待img加载完成
         * @param {number} time - 时间参数，单位ms，不管图片是否完成加载
         * @returns {Promise<boolean>} 返回Promise，成功则返回true
         */
        AwaitImgLoaded(time) {
            return new Promise(function (resolve, reject) {
                if (time) {
                    setTimeout(() => resolve(true), time)
                }
                const images = document.querySelectorAll("img");
                const loadedCount = [];
                for (const img of images) {
                    if (img.complete) {
                        loadedCount.push(0);
                    } else {
                        img.onload = () => {
                            loadedCount.push(0);
                            if (loadedCount.length === images.length) {
                                resolve(true);
                            }
                        }
                    }
                }
                if (loadedCount.length === images.length) {
                    resolve(true);
                }
            })
        }

        /**
         * 进行编码
         * @param {string} data - 需要编码的内容
         * @returns {{run: function, decode: function}} 返回转换的方法
         * - run() 编码
         * - decode() 解码
         */
        Encode(data) {
            return {
                run: () => {
                    const ascii = btoa(data);
                    data = encodeURIComponent(ascii);
                    return data;
                },
                decode: () => {
                    const ascii = decodeURIComponent(data);
                    data = atob(ascii);
                    return data;
                },
            }
        }

        /**
         * 获取当前网页url参数值
         * @param {null|string} name - 键值的名称 null 全部数据，string 全部字符数据
         * @param {string} text - （可选）从自定义参数结构
         * @returns {object|string|null}返回键值
         */
        GetQueryString(name, text) {
            const search = (text || window.location.href).match(/\?(.*)/);
            if (!!search && search.length > 1) {
                const urlParams = new URLSearchParams(search[1]);
                return _run(urlParams);
            }
            if (text) {
                const urlParams = new URLSearchParams(text);
                return _run(urlParams);
            }
            function _run(urlParams) {
                if (name === "string") {
                    return toData(urlParams, "str");
                }
                if (name === null || name === "null") {
                    return toData(urlParams);
                }
                return toData(urlParams)[name];
            }
            function toData(urlParams, type) {
                let urlParamsStr = "";
                const urlParamsObj = {};
                urlParams.forEach((value, key) => {
                    urlParamsObj[key] = value;
                    if (type === "str") {
                        urlParamsStr && (urlParamsStr += "&");
                        urlParamsStr += `${key}=${value}`;
                    }
                });
                return urlParamsStr || urlParamsObj;
            }
            return null;
        }

        /**
         * 更新链接参数
         * @param {string} url - 需要更新的链接
         * @param {object} params - 需要更新的数据，写成对象
         * @returns {string} 返回修改后的链接
         */
        UpdateUrlParam(url, params) {
            const urlObj = new URL(url);
            const searchParams = urlObj.searchParams;
            for (const key in params) {
                if (Object.hasOwnProperty.call(params, key)) {
                    searchParams.set(key, params[key]);
                }
            }
            urlObj.search = searchParams.toString();
            return urlObj.href;
        }

        /**
         * 气泡提示
         * @param {string} ico - 提示气泡的emoji
         * @param {string} text - 提示文字
         * @param {number} time - 气泡显示时间
         * @param {number} place - 气泡的位置，默认1，中间
         * @returns {function|{ node: HTMLElement, remove: function, open: function, text: function, ico: function}} - 返回创建的气泡，以及修改气泡位置的回调函数
         * - node 气泡元素
         * - remove(time) 移除气泡，单位秒
         * - open(element) 打开气泡到某个元素中
         * - text(data) 修改气泡文字
         * - ico(data) 修改气泡图标
         */
        MessageTip(ico, text, time, place = 1) {
            const RemoveDom = this.RemoveDom;
            if (ico === undefined) {
                let msgTip = null;
                return (ico, text, time, place) => {
                    if (msgTip && msgTip.ico) {
                        msgTip.ico(ico);
                        msgTip.text(text);
                    } else {
                        msgTip = this.MessageTip(ico, text, null, place);
                    }
                    msgTip.remove(time);
                    return msgTip;
                }
            }
            const openEnd = [
                "margin-left: 0;margin-top: 0;",//左上
                "margin-top: 0;margin-top: 0;",//居中
                "margin-right: 0;",//右上
                "margin-right: 0;margin-bottom: 0;",//右下
                "margin-left: 0;margin-bottom: 0;",//左下
            ][place];
            const middle = [
                "margin-left: 30px;margin-top: 15px;",//左上
                "margin-top: 15px;",//居中
                "margin-right: 30px;margin-top: 15px;",//右上
                "margin-right: 30px;margin-bottom: 15px;",//右下
                "margin-left: 30px;margin-bottom: 15px;",//左下
            ][place];
            const inRunFrame = this.RunFrame;
            const createTip = async (addNode) => {
                const className = "gm-message-place-" + place;
                const tipDom = addNode.querySelector(`:scope>.${className}`);
                if (tipDom) { return tipDom };
                return this.AddDOM({
                    addNode: addNode,
                    addData: [{
                        name: "div",
                        className: "gm-message " + className
                    }]
                });
            }
            const createBody = async (addNode, body) => {
                return createTip(addNode).then(tipDiv => {
                    if (body instanceof HTMLElement) {
                        tipDiv.appendChild(body);
                        display(body);
                        return body;
                    } else {
                        return this.AddDOM({
                            addNode: tipDiv,
                            addData: body
                        }).then(div => {
                            display(div);
                            return div;
                        })
                    }
                })
            }
            const msgDem = createBody(document.body, [{
                name: "div",
                className: "gm-message-main",
                style: "opacity: 1;height: 30px;",
                add: [{
                    name: "div",
                    className: "gm-message-body",
                    add: [{
                        name: "div",
                        className: "gm-message-ico",
                        innerHTML: ico
                    }, {
                        name: "div",
                        className: "gm-message-text",
                        innerHTML: typeof text === "string" ? text : "",
                        add: Array.isArray(text) ? text : [],
                    }]
                }]
            }])
            const callObj = {
                node: msgDem,
                remove: (time) => remove(time),
                open: (element) => msgDem.then(div => createBody(element, div)),
                text: (data) => editDom(data, ".gm-message-text"),
                ico: (data) => editDom(data, ".gm-message-ico")
            };
            let clearTime = null;
            time && remove(time);
            function display(div) {
                div.style = "height: auto;";
                const height = div.clientHeight;
                div.style = `opacity: 0;${openEnd}`;
                inRunFrame(() => {
                    div.style = `opacity: 1;height: ${height}px;${middle}`;
                })
            }
            async function remove(reTime = 0.6) {
                const fadeTime = 300; // 淡出动画时间
                const totalTime = reTime * 1000; // 总延迟转换为毫秒
                const fadeOutDelay = totalTime > fadeTime ? totalTime - fadeTime : 0;
                const div = await msgDem;
                clearTimeout(clearTime);
                clearTime = setTimeout(() => {
                    div.style = `opacity: 0;${openEnd}`;
                    RemoveDom(div, "all", fadeTime + 50);
                    Object.keys(callObj).forEach((key) => delete callObj[key]);
                }, fadeOutDelay);
            }
            function editDom(params, className) {
                msgDem.then(div => {
                    const textDom = div.querySelector(className);
                    if (Array.isArray(params)) {
                        textDom.innerHTML = "";
                        this.AddDOM({
                            addNode: textDom,
                            addData: params
                        })
                    } else {
                        textDom.innerHTML = params;
                    }
                })
            }
            return callObj;
        }

        /**
         * 只允许一个插件弹窗
         * @param {string} idName - 弹窗的id
         * @returns {boolean} - 是否有弹窗打开
         */
        closeDialog(idName) {
            const dialog = document.querySelectorAll("dialog");
            let isOpen = false;
            for (const item of dialog) {
                if (item.id !== idName && item.className === "gm-plug-message-box") {
                    item.close && item.close();
                } else if (item.id === idName) {
                    isOpen = true;
                }
            }
            return isOpen;
        }

        /**
         * 弹窗
         * @param {object} params -必须{ id, title, body, footer }，可选{ closeback }
         * @param {string} params.id - 弹窗的id
         * @param {string} params.title - 弹窗的标题
         * @param {object} params.body - 弹窗的内容，AddDOM的addData格式
         * @param {object} params.footer - 弹窗的底部，AddDOM的addData格式
         * @param {string} [params.style] - 弹窗的样式
         * @param {string} [params.isAutoClose] - 是否自动关闭已存在的弹窗，且有同id弹窗已打开会阻止当前弹窗，默认true
         * @param {function(HTMLElement)} params.closeback - 弹窗关闭时的回调函数，返回弹窗元素
         * @returns {Promise<{ element: HTMLElement, close: function}>} - 返回生成的元素和关闭方法
         * - element - 弹窗元素
         * - close() - 关闭弹窗
         */
        async MessageBox(params) {
            const { id, style, title, body, footer, isAutoClose = true, closeback } = params;
            if (isAutoClose && this.closeDialog(id)) {
                return false;
            };
            for (const key of ["id", "title", "body", "footer"]) {
                if (!params[key]) {
                    return console.error(`MessageBox: ${key}字段是必须的`);
                }
            }
            const AddDOM = this.AddDOM;
            const RemoveDom = this.RemoveDom;
            return AddDOM({
                addNode: document.body,
                addData: [{
                    name: "dialog",
                    id: id,
                    className: "gm-plug-message-box",
                    style: style,
                    add: [{
                        name: "div",
                        className: "title",
                        innerHTML: title
                    }, {
                        name: "div",
                        className: "body",
                        add: body
                    }, {
                        name: "div",
                        className: "footer",
                        add: footer
                    }]
                }]
            }).then((element) => {
                element.showModal && element.showModal();
                element.addEventListener("cancel", closeDdialog);
                // 关闭弹窗
                function closeDdialog() {
                    element.removeEventListener("cancel", closeDdialog);
                    RemoveDom(element, "all");
                    closeback && closeback(element);
                }
                element.close = closeDdialog;
                return { element, close: closeDdialog };
            })
        }

        /**
         * 
         * 窗口移动函数
         * @param {HTMLElement} dome - 触发的dom元素
         * @param {HTMLElement} frame - 需要变化位置的元素
         * @param {function({top, bottom, left, right})} callback - 各方向的回调事件
         * - top 顶部距离
         * - bottom 底部距离
         * - left 左侧距离
         * - right 右侧距离
         */
        WindowMove(dome, frame, callback) {
            dome.addEventListener("mousedown", function (down) {
                const diffLeft = down.clientX - frame.offsetLeft;
                const diffTop = down.clientY - frame.offsetTop;
                const innerWidth = frame.offsetParent.clientWidth;
                const innerHeight = frame.offsetParent.clientHeight;
                document.addEventListener("mousemove", setMove);
                document.addEventListener("mouseup", setOver);
                function setMove(move) {
                    const factorHeight = innerHeight - frame.offsetHeight;
                    const factorWidth = innerWidth - frame.offsetWidth;
                    const top = check(move.clientY - diffTop, factorHeight);
                    const bottom = check(factorHeight - move.clientY + diffTop, factorHeight);
                    const left = check(move.clientX - diffLeft, factorWidth);
                    const right = check(factorWidth - move.clientX + diffLeft, factorWidth);
                    function check(value, factor) {
                        if (value < 0) {
                            value = 0;
                        } else if (value > factor) {
                            value = factor;
                        }
                        return value;
                    }
                    if (move.preventDefault) {
                        move.preventDefault();
                    }
                    if (callback) {
                        callback({
                            top, bottom, left, right
                        })
                    }
                }
                function setOver() {
                    document.removeEventListener("mousemove", setMove);
                    document.removeEventListener("mouseup", setOver);
                }
            })
        }

        /**
         * 节点创建函数
         * @param {object} nodeObject - 需要创建的元素结构 { addNode, addData }
         * @param {object[]} nodeObject.addData - 元素结构，值中传入数组可解析成动态数据 [对象, 对象索引, 自定义函数]
         * @param {HTMLElement} [nodeObject.addNode] - 可选，添加到对应元素内部
         * @param {number} [index] - 可选，返回元素的配置，默认返回第一个元素，传入下标则返回指定元素，"true"为所有元素
         * @returns {Promise<HTMLElement|HTMLElement[]>} - 返回指定下标的元素（或全部）
         */
        async AddDOM({ addNode, addData }, index = 0) {
            const ObjectProperty = this.ObjectProperty;
            const All = [];
            for (const node of addData) {
                if (typeof node === "object" && node.name) {
                    const removeBackArr = [];
                    const elem = document.createElement(node.name); // 创建元素
                    elem._remove = () => {
                        removeBackArr.forEach((callback) => callback());
                        elem.remove();
                    }
                    if (!!addNode) {
                        addNode.appendChild(elem);
                    }
                    const setRule = {
                        function: async (key) => {
                            await node[key](elem);
                        },
                        click: (key) => {
                            const callback = (e) => { node[key](e, elem) };
                            elem.addEventListener("click", callback, false);
                        },
                        default: (key) => {
                            if (key !== "add") {
                                const values = node[key];
                                if (Array.isArray(values) && typeof values[0] === "object") {
                                    if (!Array.isArray(values[1])) {
                                        values[1] = [values[1]];
                                    }
                                    for (const item of values[1]) {
                                        let isAddRemove = false;
                                        ObjectProperty(values[0], item, (params) => {
                                            if (!isAddRemove) {
                                                isAddRemove = true;
                                                removeBackArr.push(params.stop);
                                            }
                                            if (typeof values[2] === "function") {
                                                return values[2](params.value, setValue);
                                            }
                                            if (params.value !== undefined && params.value !== null) {
                                                setValue(params.value);
                                            } else {
                                                setValue("");
                                            }
                                        })
                                    }
                                } else {
                                    setValue(values);
                                }
                            }
                            function setValue(value) {
                                if (elem[key] === undefined) {
                                    elem.setAttribute(key, value);
                                } else {
                                    elem[key] = value;
                                }
                            }
                        }
                    }
                    const keys = Object.keys(node);
                    for (const key of keys) {
                        if (key !== "name") {
                            const ruleBack = setRule[key];
                            if (ruleBack) {
                                await ruleBack(key);
                            } else {
                                setRule.default(key);
                            }
                        }
                    }
                    // 递归创建子元素
                    if (!!node.add && node.add.length > 0) {
                        await this.AddDOM({
                            addNode: elem,
                            addData: node.add
                        });
                    }
                    All.push(elem);
                }
            }
            if (index === true) {
                return All;
            }
            return All[index];
        }

        /**
         * 节点清除器
         * @param {HTMLElement} element - 需求移除的元素
         * @param {'all'|'child'} [type] - 可选，需要移除的选项(默认child)
         * - all 移除当前+子元素
         * - child 仅移除子元素
         * @param {number} [reTime] - 可选，延迟删除，单位ms
         */
        RemoveDom(element, type = "child", reTime) {
            if (!element) {
                return false;
            }
            function removeList(list) {
                if (list && list.children) {
                    Array.from(list.children).forEach((item) => {
                        removeList(item);
                        item._remove ? item._remove() : item.remove();
                    })
                }
            }
            function run() {
                removeList(element);
                if (type.toLowerCase() === "all") {
                    element._remove ? element._remove() : element.remove();
                }
                element = null;
            }
            if (!reTime) {
                run();
            } else {
                setTimeout(run, reTime);
            }
        }

        /**
         * 点击任意位置隐藏元素
         * @param {HTMLElement[]} domArr - 排除元素被点击不能隐藏
         * @param {HTMLElement} children - 需要隐藏的元素
         */
        DisplayWindow(domArr, children) {
            document.addEventListener("mousedown", (event) => {
                if (!event.isTrusted) {
                    return false;
                }
                const isContains = domArr.filter((list) => {
                    if (list) {
                        const isWork = list.contains(event.target);
                        return isWork;
                    }
                })
                const rect = children.getBoundingClientRect();
                const x = event.clientX;
                const y = event.clientY;
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    return false;
                } else if (isContains.length <= 0) {
                    children.style.display = "none";
                }
            });
        }

        /**
         * 对象变化监听
         * @param {object} obj - 需要监听的对象
         * @param {string} property - 监听的键名
         * @param {function({name: string, value: any, stop: function()})} callback - 变化时的回调
         * - name 变化的键名
         * - value 变化后的值
         * - stop() 停止监听该属性变化
         */
        ObjectProperty(obj, property, callback) {
            if (typeof property === "string") {
                property = [property];
            }
            const objArr = property.map((objKey) => {
                // 如果还没有为该属性创建回调数组，则初始化为空数组
                const callbacksKey = `__${objKey}_callbacks`;
                if (!obj.hasOwnProperty(callbacksKey)) {
                    Object.defineProperty(obj, callbacksKey, {
                        value: [],
                        enumerable: false,
                        writable: true
                    })
                    let value = obj[objKey];
                    Object.defineProperty(obj, objKey, {
                        get: function () {
                            return value;
                        },
                        set: function (newValue) {
                            value = newValue;
                            // 当属性值改变时，遍历并执行所有回调函数
                            obj[callbacksKey].forEach((callObj) => {
                                callObj.callback({
                                    name: objKey,
                                    value: newValue,
                                    stop: () => stop(callObj.uuid)
                                })
                            })
                        }
                    })
                }
                function stop(uuid) {
                    const taskObj = obj[callbacksKey].filter(item => item.uuid !== uuid);
                    obj[callbacksKey] = taskObj;
                }
                const callObj = { callback, uuid: crypto.randomUUID() };
                // 将新的回调添加到回调数组中
                obj[callbacksKey].push(callObj);
                // 立即执行回调函数
                callback({
                    name: objKey,
                    value: obj[objKey],
                    stop: () => stop(callObj.uuid)
                });
                // 返回当前的属性值
                return {
                    name: objKey,
                    value: obj[objKey]
                }
            })
            return objArr;
        }

        /**
         * 节流器，指定时间内频繁触发，只运行最后一次
         * @param {function} callback - 节流的回调函数
         * @param {number} delay - 节流时间
         * @returns {{time:function}|function} - 返回节流器的触发函数
         * - time(time): 更新 delay 节流时间
         */
        ThrottleOver(callback, delay) {
            let timer = null;
            function runCallback() {
                if (delay === undefined) {
                    return false;
                }
                const context = this;
                const args = arguments;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    callback.apply(context, args);
                    timer = null;
                }, delay || 300);
            }
            runCallback.time = (time) => {
                delay = time;
            }
            return runCallback;
        }

        /**
         * 网络请求监听器
         * @param {WaylayHTTPConfig|WaylayHTTPConfig[]} params - 拦截配置数组，每个元素为一个配置对象
         * @example
         * WaylayHTTP([{
         *     method: string, // 可选，请求类型
         *     url: RegExp|string|function, // 拦截的url字符、正则、或回调函数
         *     body: RegExp|string|function, // 可选，拦截的body字符、正则、或回调函数
         *     stop: boolean, // 可选，是否拦截请求
         *     callback: function // 触发拦截/数据响应的回调
         * }]);
         * @typedef {object} WaylayHTTPConfig - 拦截配置项
         * @property {string} [method] - 可选，请求类型
         * @property {RegExp|string|function} url - 拦截的url字符、正则、或回调函数
         * @property {RegExp|string|function} [body] - 可选，拦截的body字符、正则、或回调函数
         * @property {boolean} [stop] - 可选，是否拦截请求
         * @property {function(WaylayHTTPCallback): void} callback - 触发拦截/数据响应的回调
         * @typedef {object} WaylayHTTPCallback - 回调函数参数列表
         * @property {string} type - 拦截的类型
         * @property {string} sendBody - 发送的body数据
         * @property {object} data - 响应数据
         * @property {object} openParam - open参数
         * @property {function} stop - 停止监听
         * @property {function(boolean, string): Promise<WaylayHTTPCallbackBack>} send - 手动发送请求
         * - arg0 是否允许发起方触发响应，false时，必须使用back返回数据
         * - arg1 自定义发送的body数据
         * @property {function(WaylayHTTPCallbackBack): void} back - 返回自定义数据
         * @typedef {object} WaylayHTTPCallbackBack - 返回自定义数据
         * @property {string} response - 响应数据
         */
        WaylayHTTP(params) {
            const win = unsafeWindow;
            if (!win.waylayHTTPConfig) {
                win.waylayHTTPConfig = [];
                rewriteXMLHttpRequest();
            }
            for (const list of params) {
                win.waylayHTTPConfig.push({ ...list, uuid: crypto.randomUUID() });
            }
            function rewriteXMLHttpRequest() {
                // 保存并重写xhr原型
                const xhrProto = win.XMLHttpRequest.prototype;
                const originalOpen = xhrProto.open;
                const originalSend = xhrProto.send;
                // 重写open
                xhrProto.open = function () {
                    this._waylay_openParam = [...arguments];
                    originalOpen.apply(this, arguments);
                }
                // 重写send
                xhrProto.send = function (sendBody) {
                    try {
                        const self = this;
                        const config = win.waylayHTTPConfig;
                        const stopList = [];
                        const sendConfig = { isSend: false, isOnchange: false };
                        const sendWork = () => {
                            if (self._waylay_readyState === 4) {
                                self.dispatchEvent(new Event("load"));
                            }
                            // 如果有一个onchange是false就不要复原
                            if (stopList.every(item => item.onchange) && !sendConfig.isOnchange) {
                                sendConfig.isOnchange = true;
                                if (self._waylay_onreadystatechange) {
                                    self._waylay_onreadystatechange();
                                    self._waylay_set_onreadystatechange(self._waylay_onreadystatechange)
                                }
                            }
                            // 如果有一个send是false就不要发送
                            if (stopList.every(item => item.send) && !sendConfig.isSend) {
                                sendConfig.isSend = true;
                                originalSend.apply(self, arguments);
                            }
                        };
                        for (let index = 0; index < config.length; index++) {
                            const list = config[index];
                            if (!list.method || list.method === "*" || list.method === self._waylay_openParam[0]) {
                                if (isWaylay(list, self._waylay_openParam[1], sendBody)) {
                                    const stopObj = {
                                        send: false,
                                        onchange: false,
                                    };
                                    const backData = {
                                        type: "stop",
                                        sendBody: sendBody,
                                        data: self,
                                        openParam: self._waylay_openParam,
                                        stop: () => stop(list),
                                        back: (data) => {
                                            if (list.stop) {
                                                self._waylay_backFreeData(data);
                                                stopObj.onchange = true;
                                                sendWork();
                                            }
                                        },
                                        send: (onchange) => {
                                            if (list.stop) {
                                                stopObj.send = true;
                                                stopObj.onchange = onchange === undefined ? true : onchange;
                                                sendWork();
                                                return new Promise((resolve, reject) => addLoad(resolve));
                                            }
                                        }
                                    }
                                    if (!!list.stop) {
                                        stopObj.callback = () => list.callback.bind(self)(backData);
                                        stopList.push(stopObj);
                                        continue;
                                    }
                                    addLoad(list.callback);
                                    function addLoad(callback) {
                                        function loadOver() {
                                            callback.bind(self)({ ...backData, data: self });
                                            self.removeEventListener("load", loadOver);
                                        }
                                        self.addEventListener("load", loadOver);
                                    }
                                }
                            }
                        }
                        for (let index = 0; index < stopList.length; index++) {
                            const list = stopList[index];
                            list.callback && list.callback();
                            delete list.callback;
                        }
                        sendWork();
                    } catch (error) {
                        console.error(error);
                    }
                }
                // 重写返回值
                xhrProto._waylay_backFreeData = function (backObj = {}) {
                    const xhrObj = {
                        readyState: backObj.readyState || 4,
                        status: backObj.status || 200,
                        statusText: backObj.statusText || "OK",
                        response: backObj.response || backObj.responseText || "",
                        responseText: backObj.responseText || backObj.response || "",
                    };
                    Object.keys(xhrObj).forEach((key) => {
                        this[`_waylay_${key}`] = typeof xhrObj[key] === "object" ? JSON.stringify(xhrObj[key]) : xhrObj[key];
                    });
                }
                // 对原型字段监听get set
                for (const prop of ["readyState", "status", "statusText", "response", "responseText", "onreadystatechange"]) {
                    const originalDes = Object.getOwnPropertyDescriptor(xhrProto, prop); // 原属性的描述符
                    if (!originalDes) return; // 跳过不存在的属性
                    Object.defineProperty(xhrProto, prop, {
                        get: function () {
                            if (!/^_waylay_/.test(prop) && this[`_waylay_${prop}`] && prop !== "onreadystatechange") {
                                return this[`_waylay_${prop}`];
                            }
                            return originalDes.get.call(this);
                        },
                        set: function (value) {
                            if (originalDes.set) {
                                if (prop === "onreadystatechange") {
                                    this[`_waylay_set_${prop}`] = (onValue) => {
                                        originalDes.set.call(this, onValue);
                                    };
                                    return this[`_waylay_${prop}`] = value;
                                }
                                return originalDes.set.call(this, value);
                            }
                        },
                        configurable: originalDes.configurable,
                        enumerable: originalDes.enumerable
                    });
                }
            }
            // 停止监听
            function stop(list) {
                const taskObj = win.waylayHTTPConfig.filter(item => item.uuid !== list.uuid);
                win.waylayHTTPConfig = taskObj;
            }
            // 判断是否需要拦截
            function isWaylay(obj, urlStr, bodyStr) {
                const { url, body } = obj;
                const testUrl = paramTest(url, urlStr);
                const testBody = paramTest(body, bodyStr);
                return !!testUrl && !!testBody;
            }
            function paramTest(value, data) {
                if (!value || !data) {
                    return true;
                }
                if (typeof value === "string") {
                    return data.includes(value);
                }
                if (value instanceof RegExp) {
                    return value.test(data);
                }
                if (typeof value === "function") {
                    try {
                        return value(data);
                    } catch (error) {
                        console.error(error);
                    }
                }
                return false;
            }
        }

        /**
         * setTimeOut监听器
         * @param {object[]} params - 传入一个配置对象，键名：[{ callString: function.string(), delay, callback }]
         * @param {string} params.callString - 函数字符串
         * @param {number} params.delay - 延迟时间
         * @param {function} params.callback - 回调函数
         */
        WaylaySetTimeOut(params) {
            const win = unsafeWindow;
            if (!win.waylayTimeOutConfig) {
                win.waylayTimeOutConfig = [];
                const originalSetTimeout = unsafeWindow.setTimeout;
                unsafeWindow.setTimeout = function (funback, delay) {
                    const configArr = win.waylayTimeOutConfig;
                    for (const list of configArr) {
                        if (funback.toString().includes(list.callString) && (list.delay === undefined || list.delay === delay)) {
                            function reScore() {
                                const newConfigArr = configArr.filter(item => item.delay !== list.delay && item.callString !== list.callString);
                                win.waylayTimeOutConfig = newConfigArr;
                            }
                            const config = {
                                list: configArr,
                                score: list,
                                reScore
                            }
                            list.callback({ funback, delay, config });
                            return false;
                        }
                    }
                    return originalSetTimeout(funback, delay);
                };
            }
            win.waylayTimeOutConfig.push(...params);
        }

        /**
         * JSON.parse监听器
         * @param {object} params - 配置参数
         * @param {RegExp} params.match - 正则匹配字符串
         * @param {'array'|'object'} params.type-  匹配类型
         * @param {function} params.callback - 回调函数，需要 return 返回数据（不返回则使用原数据）
         * - data 命中规则的数据
         * - config 监听的配置
         * - stop() 停止监听
         */
        WaylayJsonParse(params) {
            const parse = unsafeWindow.JSON.parse;
            unsafeWindow.JSON.parse = function (...args) {
                const data = parse(...args);
                const list = params;
                if (list.type === "array" && !Array.isArray(data)) {
                    return data;
                }
                if (list.type === "object" && typeof data !== "object") {
                    return data;
                }
                if (!list.match || list.match.test(args)) {
                    const config = {
                        waylay: list
                    };
                    return list.callback({
                        data, config,
                        stop() {
                            unsafeWindow.JSON.parse = parse;
                        }
                    }) || data;
                }
                return data;
            };
        }

        /**
         * 导出为EXCEl文件
         * @param {string} excelName - 文件名称
         * @returns {{play:function, sheet:function}} - 回调方法 { play, sheet }
         * - play(data, sheetName) 开始执行导出
         * - sheet([{ sheetData, sheetName }]) 多Sheet导出
         */
        ExportToExcel(excelName) {
            // 创建工作簿对象
            const workbook = XLSX.utils.book_new();
            // 添加数据到表
            function pushData(data, sheetName = "数据") {
                // 创建一个工作表
                const worksheet = XLSX.utils.json_to_sheet(data);
                // 将工作表添加到工作簿
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            }
            // 导出Excel文件
            function download(downName = excelName) {
                const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                const excelData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(excelData);
                link.download = downName || "data.xlsx";
                link.click();
                link.remove();
            }
            /**
             * 下载数据
             * @param {object} data 表数据
             * @param {string} sheetName Sheet名称
             */
            function play(data, sheetName) {
                pushData(data, sheetName);
                download();
            }
            /**
             * 多Sheet下载
             * @param {object[]} params 表数据参数[{ sheetData, sheetName }]
             */
            function sheet(params) {
                for (const list of params) {
                    const { sheetData, sheetName } = list;
                    pushData(sheetData, sheetName);
                }
                download();
            }
            return { play, sheet }
        }

        /**
         * 异步队列并发管理器
         * @param {number} maxRun - 并发数量，默认1个
         * @param {number} maxRetry - 错误最大运行次数，默认1次，使用catch捕获的错误，请在函数抛出错误
         * @returns {{push:function, stop:function, play:function, endBack:function, errorBack:function}} - 回调方法 { push, stop, play, endBack, errorBack }
         * - push(task) 添加任务，task为异步函数，返回Promise
         * - stop() 停止运行
         * - play() 继续运行
         * - endBack(callback) 设置完成后的回调
         * - errorBack(callback) 设置错误后的回调
         */
        QueueTaskRunner(maxRun = 1, maxRetry = 1) {
            const params = {
                isRun: false, // 是否运行
                isStop: false, // 终止
                maxRun, // 最大并发数
                maxRetry, // 最大并发数
                running: 0, // 当前正在执行的请求数
                runCallback: [], // 请求的数据，队列
                endCallback: () => { }, // 完成后的回调
                errCallback: () => { } // 执行中途错误的回调
            }
            const RunFrame = this.RunFrame;
            async function _run() {
                while (!params.isStop && params.running < params.maxRun && params.runCallback.length > 0) {
                    const task = params.runCallback.shift();
                    params.running++;
                    _executeTask(task);
                }
            }
            async function _executeTask(task, attempt = 1) {
                const { callback, resolve, reject } = task;
                callback().then(result => {
                    resolve(result);
                    _taskCompleted();
                }).catch(error => {
                    if (attempt < params.maxRetry) {
                        console.error("队列重试:", attempt, error);
                        _executeTask(task, attempt + 1);
                    } else {
                        console.error("Task Error:", error);
                        params.errCallback(error);
                        reject(error);
                        _taskCompleted();
                    }
                });
            }
            function _taskCompleted() {
                params.running--;
                _run();
                RunFrame(_runEnd);
            }
            async function _runEnd() {
                if (params.isRun && !params.isStop && params.running === 0 && params.runCallback.length === 0) {
                    params.isRun = false;
                    params.endCallback();
                }
            }
            const functionAll = {
                /**
                 * 添加队列函数
                 * @param {function} callback 函数
                 * @returns 返回执行结果 - Promise
                 */
                push(callback) {
                    params.isRun = true;
                    return new Promise((resolve, reject) => {
                        params.runCallback.push({ callback, resolve, reject });
                        _run();
                    });
                },
                /**
                 * 终止队列
                 */
                stop() {
                    params.isStop = true;
                },
                /**
                 * 开始队列
                 */
                play() {
                    params.isStop = false;
                    _run();
                },
                /**
                 * 队列完成的回调
                 * @param {function} callback 函数
                 * @returns 返回所有方法
                 */
                endBack(callback) {
                    params.endCallback = callback;
                    _runEnd();
                    return functionAll;
                },
                /**
                 * 队列错误的回调
                 * @param {function} callback 函数
                 * @returns 返回所有方法
                 */
                error(callback) {
                    params.errCallback = callback;
                    return functionAll;
                }
            }
            return functionAll;
        }

        /**
         * 页面渲染时运行函数
         * @param {function} callback - 回调函数
         * @param {number} index - 运行帧，默认直接（0）
         */
        RunFrame(callback, index = 0) {
            return new Promise((resolve, reject) => {
                let count = 0;
                function frame() {
                    if (count === index || index < 0) {
                        resolve(callback());
                    } else if (count < index) {
                        count++;
                        requestAnimationFrame(frame);
                    } else {
                        reject(new Error("Index超过帧数"));
                    }
                }
                requestAnimationFrame(frame);
            })
        }

        /**
         * 输入文本验证器
         * @param {string} text - 需要匹配的按键
         * @param {function} callback - 成功的回调函数
         * @param {boolean} isMany - 是否允许多次触发？默认只触发一次
         */
        InputAuth(text, callback, isMany) {
            text = text.toUpperCase();
            let input = "";
            document.addEventListener("keydown", isText);
            function isText({ key, target }) {
                if (["input", "textarea", "select"].includes(target.tagName.toLowerCase())) {
                    return false;
                }
                if (!key || key.length !== 1) {
                    return false;
                }
                const strUp = key.toUpperCase();
                if (strUp === text[input.length]) {
                    input += strUp;
                } else {
                    input = strUp === text[0] ? strUp : "";
                }
                if (input === text) {
                    callback();
                    if (!isMany) {
                        document.removeEventListener("keydown", isText);
                    }
                }
            }
        }

        /**
         * 同域跨标签通信
         * @param {string} cName - 频道名称
         * @returns {{postMessage:function, callback:function, callbackError:function, close:function}} - 上下文方法
         * - postMessage(params) 发送消息
         * - callback(callback) 接收消息
         * - callbackError(callback) 接收错误消息
         * - close() 关闭频道
         */
        WebLocalMessage(cName) {
            const channel = new BroadcastChannel(cName);
            const backModel = {
                postMessage: (params) => {
                    channel.postMessage(params);
                    return backModel;
                },
                callback: (callback) => {
                    channel.addEventListener("message", callback);
                    return backModel;
                },
                callbackError: (callback) => {
                    channel.addEventListener("messageerror", callback);
                    return backModel;
                },
                close: () => {
                    channel.close();
                }
            }
            return backModel;
        }

        /**
         * 元素变化观察器         * 
         * @param {function} runback 需要运行的回调（mutation）
         * @returns {{observe:ObserveMethod, stop:function, callback:function}} - 返回实例功能
         * - observe(element, config) 开始观察
         * - stop() 停止观察
         * - callback(callback) 回调函数
         * @typedef {(element: HTMLElement, config: ObserveConfig) => void} ObserveMethod
         * @typedef {object} ObserveConfig
         * @property {boolean} config.attributes - 监视属性的变化
         * @property {boolean} config.childList - 监视子节点的变化
         * @property {boolean} config.subtree - 监视整个子树
         * @property {boolean} config.characterData - 监视节点内容或文本的变化
         * @property {boolean} config.attributeOldValue - 记录属性变化前的值
         * @property {boolean} config.characterDataOldValue - 记录文本内容变化前的值
         */
        ObserverDOM(runback = () => { }) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(runback);
            })
            const result = {
                /**
                 * 开始观察元素变化
                 * @param {*} element 观察的元素
                 * @param {*} config 观察配置
                 * @returns 返回实例功能
                 */
                observe: (element, config) => {
                    observer.observe(element, config);
                    return result;
                },
                stop: () => {
                    observer.disconnect();
                    return result;
                },
                callback: (callback) => {
                    runback = callback;
                    return result;
                }
            }
            return result;
        }

        /**
         * 下载数据
         * @returns {{isRun:function, run:function}} - 返回实例功能
         * - isRun() 返回下载状态
         * - run(downloadUrl, callback, isMsg) 开始下载数据
         */
        downloadUrlExcel() {
            let isRun = false;
            const HTTP_XHR = this.HTTP_XHR;
            const MessageTip = this.MessageTip;
            const UpdateUrlParam = this.UpdateUrlParam;
            return {
                /**
                 * 返回下载状态
                 * @returns false为未下载，true下载中
                 */
                isRun: () => isRun,
                /**
                 * 开始下载数据
                 * @param {string} downloadUrl 下载数据的URL
                 * @param {function} callback 完成处理的回调函数
                 * @param {boolean} [isMsg] 是否开启消息提示，默认打开
                 */
                run: (downloadUrl, callback = () => { }, isMsg = true) => {
                    isRun = true;
                    const trueMsg = !isMsg && {
                        ico: () => { },
                        text: () => { },
                        remove: () => { }
                    }
                    const msgDom = trueMsg || MessageTip("📥", "下载数据");
                    fetch(downloadUrl).then(res => res.arrayBuffer()).then(arrayBuffer => {
                        const data = new Uint8Array(arrayBuffer);
                        const workbook = XLSX.read(data, { type: "array" });
                        const worksheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[worksheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        return OutExcel(jsonData);
                    }).catch((error) => {
                        runOver();
                        msgDom.ico("❌");
                        msgDom.text("下载或解析文件失败");
                        console.error(error);
                    });
                    function runOver() {
                        msgDom.remove(3);
                        isRun = false;
                    }
                    async function getContent(params) {
                        const { url, field } = params;
                        return HTTP_XHR({ method: "GET", url: url }).then((xhr) => {
                            const responseText = xhr.responseText;
                            const content = JSON.parse(responseText).content;
                            return field ? content[field] : content;
                        });
                    }
                    async function OutExcel(xlsx) {
                        if (xlsx.length === 0) {
                            runOver();
                            callback({});
                            return isMsg && MessageTip("❌", "导出列表为空", 3);
                        }
                        return getContent({
                            url: "/api/common/getLoginBizLineInfo",
                            msg: "获取“查询列表”失败，请重试",
                            field: "biz"
                        }).then((biz) => {
                            const urlData = [];
                            const xlsxDataUrl = [];
                            xlsx.forEach((row) => {
                                const bizLine = biz.find((item) => item.label === row["业务线"]) || {};
                                const subLine = bizLine.sub_line.find((item) => item.label === row["子渠道"]) || {};
                                const contentType = bizLine.content_type.find((item) => item.label === row["内容样式"]) || {};
                                const contentSource = bizLine.content_source.find((item) => item.label === row["内容来源"]) || {};
                                const dataUrl = UpdateUrlParam("https://ver.jd.com/Recheck/Detail", {
                                    taskId: row["任务id"],
                                    contentType: contentType.value,
                                    bizLine: bizLine.value,
                                    optType: 3,
                                    contentId: row["内容id"],
                                    subLine: subLine.value,
                                    contentSource: contentSource.value,
                                    manualState: undefined,
                                });
                                urlData.push(dataUrl);
                                xlsxDataUrl.push({ "链接": dataUrl, ...row });
                            })
                            msgDom.ico("✔️");
                            msgDom.text("下载成功");
                            runOver();
                            callback({ urlData, xlsxData: xlsx, xlsxDataUrl });
                        })
                    }
                }
            }
        }
    }
    // uuid函数覆盖
    crypto.randomUUID = crypto.randomUUID || (() => {
        // RFC4122 version 4 form
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
    })
    // 气泡消息
    GM_addStyle(`
        .gm-message {
            position: fixed;
            display: flex;
            z-index: 2000000;
            pointer-events: none;
            font-size: 16px;
        }
        .gm-message-place-0,
        .gm-message-place-2 {
            top: 0;
            left: 0;
            flex-direction: column;
        }
        .gm-message-place-2 {
            right: 0;
        }
        .gm-message-place-3,
        .gm-message-place-4 {
            bottom: 0;
            left: 0;
            flex-direction: column-reverse;
            margin-bottom: 30px;
        }
        .gm-message-place-3 {
            right: 0;
        }
        .gm-message-place-1 {
            top: 0;
            left: 0;
            right: 0;
            align-items: center;
            flex-direction: column;
        }
        .gm-message-main {
            opacity: 0;
            margin: auto;
            height: 0;
            transition: 0.3s;
            overflow: hidden;
            border-radius: 6px;
            box-shadow: 0 1px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
        }
        .gm-message-body {
            display: flex;
            padding: 12px 12px;
            text-align: center;
            line-height: 1;
            color: #000000;
            background: #ffffff;
            pointer-events: auto;
            user-select: text;
        }
        .gm-message-ico,
        .gm-message-text {
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0 5px;
        }
        .gm-message-text {
            font-size: 16px;
            line-height: 1.2;
        }
    `)
    // 弹窗
    GM_addStyle(`
        .gm-plug-message-box {
            width: 500px;
            border-radius: 10px;
            border-width: 1px;
            border-color: #bbbbbb;
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            overflow: hidden;
            color: rgba(0,0,0,0.9);
            padding: 20px;
            outline: none;
            margin: auto;
            font-size: 14px;
            min-height: 50px;
        }
        .gm-plug-message-box::backdrop {
            background: rgba(0,0,0,0.2);
        }
        .gm-plug-message-box .title {
            width: 100%;
            font-size: 20px;
            text-align: center;
            font-weight: bold;
            min-height: 50px;
        }
        .gm-plug-message-box .body {
            width: 100%;
            height: calc(100% - 50px - 40px);
        }
        .gm-plug-message-box .footer {
            width: 100%;
            min-height: 40px;
            gap: 30px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
        }
        /*滚动条样式*/
        .gm-plug-message-box ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        .gm-plug-message-box ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: rgba(160,169,173,0.45);
        }
        .gm-plug-message-box ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(160,169,173,0.8);
        }
    `)
    const plug = new Plug_Plug();
    Plug_fnClass = () => plug;
    return plug;
}

// 主页
async function Plug_homePage() {
    // 初始化实例
    CSS_homePage();
    const config = {
        fastConfig: {
            repair: true,
            fixedOrder: true,
            xlsxData: []
        },
        queryConfig: {
            queryList: {},
            queryGetUrl: [],
        },
        queryFastDownload: "",
        bizLineInfo: []
    }, { fastConfig, queryConfig } = config;
    const { leftArrowIco } = Plug_ICO();
    const { Tooltip, SwitchBox } = Plug_Components();
    const { GM_XHR, HTTP_XHR, GET_DATA, SET_DATA, WaylayHTTP, JDPinUserClass, downloadUrlExcel, ObjectProperty, AddDOM, RunFrame, MessageTip, MessageBox, UpdateUrlParam, FormatTime, DiffDay, TimeRange, SwitchRead, SwitchWrite, WindowMove, CopyText, QueueTaskRunner, CopyHtml2Img, ThrottleOver, AwaitSelectorShow, DisplayWindow, GetQueryString, ExportToExcel } = Plug_fnClass();

    // 页面美化
    const pageBeautify = SwitchRead("Page-Beautify").state;
    if (pageBeautify) {
        CSS_homeBeautify();
    }

    // 复审使用optType=9打开
    const qcReviewOpen = SwitchRead("Qc-Review-Open").state;
    if (qcReviewOpen) {
        const oldOpen = unsafeWindow.open;
        unsafeWindow.open = function (...args) {
            const rechecklist3 = document.querySelector(".Rechecklist3");
            if (args[0] && rechecklist3 && !args[3]) {
                args[0] = args[0].replace(/optType=(\d)/i, "optType=9");
            }
            return oldOpen(...args);
        }
    }

    // 重写open方法
    (async () => {
        const oldQcPage = SwitchRead("Old-Qc-Page");
        const oldOpen = unsafeWindow.open;
        unsafeWindow.open = (...args) => {
            if (!!args[0] && !args[3] && oldQcPage.state) {
                args[0] = args[0].replace(/\/audit-detail\?pageType=Recheck&/i, "/Recheck/Detail?");
            }
            return oldOpen(...args);
        }
        const headerWrapper = await AwaitSelectorShow(".header .header-biz-tip-wrapper");
        headerWrapper.style.gap = "3px";
        headerWrapper.style.display = "flex";
        headerWrapper.style.alignItems = "center";
        AddDOM({
            addData: [{
                name: "div",
                style: "float: right;margin-right: 16px;height: 100%;display: flex;align-items: center;",
                add: [SwitchBox({
                    "msg-tip": "使用旧质检页面",
                    checked: oldQcPage.state,
                    function(element) {
                        element.addEventListener("change", () => {
                            oldQcPage.state = !!element.checked;
                            SwitchWrite("Old-Qc-Page", oldQcPage);
                        })
                    }
                })]
            }]
        }).then((div) => {
            headerWrapper.parentNode.insertBefore(div, headerWrapper);
        })
    })();

    (() => {
        WaylayHTTP([{
            method: "GET",
            url: "/api/biz/audit/machine/querylist",
            callback: (params) => queryCallback(params)
        }, {
            method: "GET",
            url: /(\/api\/biz\/review\/|\/liveapi\/live\/review\/)(qc|reviewQcManage|arbitration)\/list/,
            callback: (params) => {
                getTableUserName(params);
                queryCallback(params);
            }
        }, {
            method: "GET",
            url: "/api/common/getLoginBizLineInfo",
            callback: (params) => {
                const responseText = params.data.responseText;
                if (!responseText) {
                    return false;
                }
                params.stop();
                const content = JSON.parse(responseText).content;
                config.bizLineInfo = content && content.biz || [];
            }
        }])
        const downloadExcel = downloadUrlExcel();
        function getDownloadUrl(callback) {
            if (downloadExcel.isRun()) {
                return MessageTip("❌", "正在下载，请稍后", 3);
            }
            const taskPool = document.querySelector(".TaskPool") && "/api/download/taskPoolRecord?";
            const recheck = document.querySelector(".Rechecklist0,.Rechecklist3") && "/api/download/qcRecord?";
            const downloadUrl = taskPool || recheck || undefined;
            if (!downloadUrl) {
                return MessageTip("❌", "不是支持的页面", 3);
            }
            downloadExcel.run(downloadUrl + config.queryFastDownload, (params) => {
                if (params.urlData) {
                    callback(params);
                }
            });
        }
        async function queryCallback(params) {
            // 判断是否为平台发起的请求
            if (params.data.timeout === 30000) {
                await AwaitSelectorShow(".homeContent button[type=button].ant5-btn-primary");
                const buttonAll = document.querySelectorAll(".homeContent button[type=button].ant5-btn-primary");
                buttonAll.forEach((button) => {
                    if (button.innerText.replace(/\s+/g, "") === "下载") {
                        AddMenu(button, params.data.responseURL);
                    }
                })
            }
            function AddMenu(button, responseURL) {
                config.queryFastDownload = GetQueryString("string", responseURL);
                if (button.isFastDownload) {
                    return false;
                }
                button.isFastDownload = true;
                DropdownMenu({
                    openElem: button,
                    mouse: "r",
                    node: [{
                        name: "div",
                        innerHTML: "普通数据",
                        click: () => button.click()
                    }, {
                        name: "div",
                        innerHTML: "包含链接",
                        click: () => {
                            getDownloadUrl(({ xlsxDataUrl }) => {
                                const time = FormatTime("YYYYMMDDHHmmss");
                                ExportToExcel("qcLink_" + time + ".xlsx").play(xlsxDataUrl, "复审中心-质检");
                            })
                        }
                    }, {
                        name: "div",
                        innerHTML: "复审数据",
                        click: (_, element) => reviewDownload(element)
                    }, {
                        name: "div",
                        innerHTML: "数据快查",
                        click: () => {
                            getDownloadUrl(({ urlData, xlsxData }) => {
                                queryFastData(null, { urlData: urlData.join("\n"), xlsxData });
                            })
                        }
                    }, {
                        name: "div",
                        innerHTML: "直播视频",
                        click: (_, element) => liveDownload(element, false, 19)
                    }, {
                        name: "div",
                        innerHTML: "实时直播",
                        click: (_, element) => liveDownload(element, false, 24)
                    }, Tooltip({
                        place: "bottom",
                        text: "包含“审核分配时间”但下载慢",
                        node: [{
                            name: "div",
                            innerHTML: "实时直播Time",
                            click: (_, element) => liveDownload(element, true, 24)
                        }]
                    }), {
                        name: "div",
                        innerHTML: "复制内容ID",
                        click: () => {
                            getDownloadUrl(({ xlsxData }) => {
                                const contentIds = xlsxData.map((item) => item["内容id"]);
                                if (contentIds.length > 0) {
                                    const idText = contentIds.join("、");
                                    CopyText(idText)
                                        .then(() => MessageTip("✔️", `已复制到剪贴板，共${contentIds.length}条`, 3))
                                        .catch(() => MessageTip("❌", "复制失败", 3));
                                    console.log(idText);
                                } else {
                                    MessageTip("❌", "数据为空", 3);
                                }
                            })
                        }
                    }],
                    clickBack: (({ rect, setLeft }) => setLeft(rect.left + rect.width + 1))
                })
            }
        }
        async function getTableUserName(params) {
            if (params.data.timeout === 30000) {
                await AwaitSelectorShow(".ant5-table-wrapper table tr td");
                const { getPinUser } = await JDPinUserClass();
                const table = document.querySelector(".ant5-table-wrapper table");
                const thead = table.querySelectorAll(".ant5-table-wrapper thead th");
                const index = [...thead].findIndex((item) => item.innerText.includes("质检初判操作人员"));
                const index1 = [...thead].findIndex((item) => item.innerText.includes("质检管理复审操作人员"));
                const userTdArr = table.querySelectorAll(`.ant5-table-wrapper tbody tr td:nth-child(${index + 1})`);
                const userTdArr1 = table.querySelectorAll(`.ant5-table-wrapper tbody tr td:nth-child(${index1 + 1})`);
                for (const userDom of [...userTdArr, ...userTdArr1]) {
                    const userName = getPinUser(userDom.innerText);
                    if (userName !== userDom.innerText) {
                        userDom.style.position = "relative";
                        userDom.style.userSelect = "none";
                        userDom.innerHTML = `<div style="opacity: 0;">${userDom.innerText}</div>`;
                        AddDOM({
                            addNode: userDom,
                            addData: [{
                                name: "div",
                                style: "position: absolute;top: 0;height: 100%;display: flex;flex-direction: column;justify-content: center;",
                                add: [{
                                    name: "span",
                                    style: "user-select: all;",
                                    innerText: userName
                                }, {
                                    name: "span",
                                    style: "user-select: all;",
                                    innerText: userDom.innerText
                                }]
                            }]
                        })
                    } else {
                        userDom.style.userSelect = "all";
                    }
                }
            }
        }
    })();

    // 等待元素加载
    const homeLayout = await AwaitSelectorShow(".antcap-layout-sider-children", true);
    homeLayout.style.overflow = "auto";

    // 状态列表
    const showState = {
        // 任务池素材状态
        taskpool: [{
            alias: "MACHINEWAIT",
            text: "机审待审核",
            value: 0
        }, {
            alias: "MACHINEFAIL",
            text: "机审失败",
            value: 1
        }, {
            alias: "MACHINEDENY",
            text: "机审驳回",
            value: 2
        }, {
            alias: "MACHINEPASS",
            text: "机审通过",
            value: 3
        }, {
            alias: "MANUALWAITALLOCATION",
            text: "人审待分配",
            value: 4
        }, {
            alias: "MANUALWAIT",
            text: "人审待审核",
            value: 5
        }, {
            alias: "MANUALPASS",
            text: "人审通过",
            value: 6
        }, {
            alias: "MANUALDENY",
            text: "人审驳回",
            value: 7
        }, {
            alias: "SELFOFFLINE",
            text: "自行下线",
            value: 8
        }, {
            alias: "ADMINOFFLINE",
            text: "管理者下线",
            value: 9
        }, {
            alias: "DELETE",
            text: "删除",
            value: 10
        }, {
            alias: "PRIVATENOTPASS",
            text: "私域审核未过",
            value: 11
        }, {
            alias: "MACHINEDOING",
            text: "机审中",
            value: 12
        }, {
            alias: "NOREVIEW",
            text: "无需审核",
            value: 13
        }, {
            alias: "XFHSSX",
            text: "先发后审上线",
            value: 14
        }],
        serviceState: [{
            alias: "WAIT",
            text: "待审核",
            value: 1
        }, {
            alias: "ONLINE",
            text: "上线",
            value: 2
        }, {
            alias: "NOTPASS",
            text: "审核未过",
            value: 3
        }, {
            alias: "SELFOFFLINE",
            text: "自行下线",
            value: 4
        }, {
            alias: "ADMINOFFLINE",
            text: "管理者下线",
            value: 5
        }, {
            alias: "DELETE",
            text: "删除",
            value: 6
        }, {
            alias: "PRIVATENOTPASS",
            text: "私域审核未过",
            value: 7
        }, {
            alias: "XFHSSX",
            text: "先发后审上线",
            value: 8
        }, {
            alias: "XFHS_AUDITING",
            text: "先发后审机审中",
            value: 9
        }],
        // 质检素材状态
        review: [{
            alias: "NOHANDLE",
            text: "无需处理",
            value: 0
        }, {
            alias: "WAITQUALITY",
            text: "待质检",
            value: 1
        }, {
            alias: "QUALITYHANDLE",
            text: "质检待处理",
            value: 2
        }, {
            alias: "ACCEPTQUALITY",
            text: "已接受质检结果",
            value: 3
        }, {
            alias: "APPEALHANDLE",
            text: "运营仲裁-待处理",
            value: 4
        }, {
            alias: "APPEALPASS",
            text: "运营仲裁-同意审核结果",
            value: 5
        }, {
            alias: "APPEALDENY",
            text: "运营仲裁-同意质检结果",
            value: 6
        }, {
            alias: "SUSPEND",
            text: "复审中断",
            value: 7
        }, {
            alias: "TO_QC_MANAGE",
            text: "质检管理-待处理",
            value: 30
        }, {
            alias: "QC_MANAGE_ACCEPT_AUDIT",
            text: "质检管理-同意审核结果",
            value: 32
        }, {
            alias: "QC_MANAGE_REJECT_ALL",
            text: "质检管理-均错",
            value: 36
        }, {
            alias: "QC_MANAGE_UNCLEAR",
            text: "质检管理-模糊",
            value: 38
        }, {
            alias: "TO_AUDIT_MANAGE",
            text: "审核管理-待处理",
            value: 40
        }, {
            alias: "AUDIT_MANAGE_ACCEPT_QC",
            text: "审核管理-同意质检结果",
            value: 44
        }, {
            alias: "AUDIT_MANAGE_REJECT_ALL",
            text: "审核管理-均错",
            value: 46
        }, {
            alias: "AUDIT_MANAGE_UNCLEAR",
            text: "审核管理-模糊",
            value: 48
        }, {
            alias: "ARBITRATE_REJECT_ALL",
            text: "运营仲裁-均错",
            value: 56
        }, {
            alias: "ARBITRATE_UNCLEAR",
            text: "运营仲裁-模糊",
            value: 58
        }],
        // 质检直播状态
        qcStateLive: [{
            alias: "Wait",
            text: "待审核",
            value: 1
        }, {
            alias: "Has_Operation",
            text: "有操作",
            value: 2
        }, {
            alias: "No_Operation",
            text: "无操作",
            value: 3
        }],
        // 质检操作状态
        qcState: [{
            alias: "NOQUALITY",
            text: "无需处理",
            value: 0
        }, {
            alias: "WAIT",
            text: "待审核",
            value: 1
        }, {
            alias: "PASS",
            text: "质检通过",
            value: 2
        }, {
            alias: "DENY",
            text: "质检驳回",
            value: 3
        }],
        // 申诉状态
        appealState: [{
            alias: "NOQUALITY",
            text: "无需处理",
            value: 0
        }, {
            alias: "WAIT",
            text: "待处理",
            value: 1
        }, {
            alias: "PASS",
            text: "已接受质检结果",
            value: 2
        }, {
            alias: "DENY",
            text: "提起申诉",
            value: 3
        }],
        // 质检管理状态
        qcManageReviewState: [{
            alias: "NO_NEED",
            text: "无需处理",
            value: 0
        }, {
            alias: "TO_DO",
            text: "待处理",
            value: 1
        }, {
            alias: "AGREE_AUDIT_RES",
            text: "质检管理-同意审核结果",
            value: 2
        }, {
            alias: "AGREE_QC_RES",
            text: "质检管理-同意质检结果",
            value: 3
        }, {
            alias: "REJECT_ALL",
            text: "质检管理-均错",
            value: 4
        }, {
            alias: "UNCLEAR",
            text: "质检管理-模糊",
            value: 5
        }],
        // 审核管理状态
        auditManageReviewState: [{
            alias: "NO_NEED",
            text: "无需处理",
            value: 0
        }, {
            alias: "TO_DO",
            text: "待处理",
            value: 1
        }, {
            alias: "AGREE_AUDIT_RES",
            text: "审核管理-同意审核结果",
            value: 2
        }, {
            alias: "AGREE_QC_RES",
            text: "审核管理-同意质检结果",
            value: 3
        }, {
            alias: "REJECT_ALL",
            text: "审核管理-均错",
            value: 4
        }, {
            alias: "UNCLEAR",
            text: "审核管理-模糊",
            value: 5
        }],
        // 运营仲裁状态
        arbitrationState: [{
            alias: "NOQUALITY",
            text: "无需处理",
            value: 0
        }, {
            alias: "WAIT",
            text: "待处理",
            value: 1
        }, {
            alias: "PASS",
            text: "运营仲裁-同意审核结果",
            value: 2
        }, {
            alias: "DENY",
            text: "运营仲裁-同意质检结果",
            value: 3
        }, {
            alias: "REJECT_ALL",
            text: "运营仲裁-均错",
            value: 4
        }, {
            alias: "UNCLEAR",
            text: "运营仲裁-模糊",
            value: 5
        }]
    }

    /**
     * 菜单创建函数
     * @param {object} params 配置参数
     */
    async function DropdownMenu({ mouse = "l", openElem, node, style, clickBack = () => { } }) {
        const listener = { l: "click", r: "contextmenu" };
        mouse = Array.isArray(mouse) ? mouse : [mouse];
        function displayMenu(event, menuElem) {
            event.preventDefault();
            document.body.appendChild(menuElem);
            const rect = openElem.getBoundingClientRect();
            menuElem.style.display = "block";
            setPlace(menuElem, "top", rect.top);
            setPlace(menuElem, "left", rect.left);
            document.addEventListener("click", _removeMenu, true);
            document.addEventListener("contextmenu", _removeMenu, true);
            function _removeMenu() {
                menuElem.remove();
                document.removeEventListener("click", _removeMenu);
                document.removeEventListener("contextmenu", _removeMenu);
            }
            clickBack({
                rect: openElem.getBoundingClientRect(),
                setTop: (value) => setPlace(menuElem, "top", value),
                setLeft: (value) => setPlace(menuElem, "left", value),
            })
        }
        function setPlace(element, place, value) {
            const w2h = { top: "Height", left: "Width" };
            element.style[place] = Math.min(value, window["inner" + w2h[place]] - element["client" + w2h[place]]) + "px";
        }
        return AddDOM({
            addData: [{
                name: "div",
                id: "board-menu-list",
                style: style || "",
                add: node
            }]
        }).then((div) => {
            for (const item of mouse) {
                openElem.addEventListener(listener[item] || "click", (event) => displayMenu(event, div));
            }
        })
    }

    /**
     * 滚动监听器
     * @param {object} params 配置：{ element, time } 监听元素、节流时间
     * @param {function} callback 回调函数
     */
    function RollingListen({ element, time = 100 }, callback) {
        function ThrottleSpace(func, limit) {
            let inThrottle;
            return async function () {
                if (!inThrottle) {
                    inThrottle = true;
                    try {
                        setTimeout(() => { inThrottle = false; }, limit);
                        const result = await func.apply(this, arguments);
                        return result;
                    } catch (error) {
                        throw error;
                    }
                }
            }
        };
        const ThrottleBack = ThrottleSpace(({ deltaY, deltaX }) => {
            const down = deltaY > 0 || deltaX < 0;
            const up = deltaY < 0 || deltaX > 0;
            callback({ down, up, deltaY, deltaX });
        }, time)
        element.addEventListener("wheel", (event) => {
            event.preventDefault();
            ThrottleBack(event);
        }, { passive: false });
        return ThrottleBack;
    }

    async function queryGroupData(queryUrl, msgDom, callback) {
        let runTotal = 0;
        let maxTotal = 0;
        const dataArr = [];
        /**
         * 循环获取数据1000条一页
         * @param {string} url api的url
         * @param {array} qcTime 时间数组 ["2025-10-1 00:00:00","2025-10-1 23:59:59"]
         * @param {string} timeKey 循环查询的时间KEY
         * @param {number} [page] 可选，首次调用可不填，页数
         */
        async function queryQcReview(url, qcTime, timeKey, page = 1) {
            const pageSize = 1000;
            const maxPageSize = 10000;
            const newUrl = UpdateUrlParam(url, {
                page_num: page,
                page_size: pageSize,
                [`${timeKey}_start`]: qcTime[0],
                [`${timeKey}_end`]: qcTime[1]
            });
            if (qcTime[0] === qcTime[1]) {
                MessageTip("❌", "最小时区超过1W，无法全部导出", 3);
                return false;
            }
            const content = await getData(newUrl);
            if (content.total === undefined || content.total === 0) {
                MessageTip("❌", "获取数据失败", 3);
                return false;
            }
            const total = content.total;
            maxTotal = Math.max(maxTotal, total);
            if (total > maxPageSize) {
                const timeAllArr = TimeRange(qcTime, Math.ceil(total / maxPageSize));
                for (let index = 0; index < timeAllArr.length; index++) {
                    await queryQcReview(url, timeAllArr[index], timeKey, 1);
                }
            } else {
                const taskList = content.taskList || [];
                if (taskList.length > 0) {
                    dataArr.push(...taskList);
                    callback(taskList, setPercentage);
                }
                if (page < Math.ceil(total / pageSize)) {
                    await queryQcReview(url, qcTime, timeKey, page + 1);
                }
            }
        }
        /**
         * 设置进度
         * @param {number} length 新增数量
         */
        function setPercentage(length) {
            runTotal += length;
            const percentage = (runTotal / maxTotal) * 100;
            msgDom.text(`共 ${maxTotal} 条数据：${runTotal}/${maxTotal} = ${percentage.toFixed(2)}%`);
        }
        /**
         * 获取数据
         * @param {string} url api的url
         * @param {number} retry 重试次数
         * @returns {object} 解析后的JSON数据
         */
        async function getData(url, retry = 3) {
            for (let attempt = 0; attempt < retry; attempt++) {
                try {
                    const response = await HTTP_XHR({ method: "GET", url: url });
                    const responseText = response.responseText;
                    return JSON.parse(responseText).content || {};
                } catch (error) {
                    console.error(`url: ${url}`, error);
                }
            }
            return {}; // 所有尝试失败后返回null
        }
        function getTimeKey(params) {
            const keys = Object.keys(params);
            for (const key of keys) {
                if (/_start$/i.test(key) && params[key]) {
                    return key.replace("_start", "");
                }
            }
        }
        const params = GetQueryString(null, queryUrl);
        const timeKey = getTimeKey(params);
        if (timeKey) {
            await queryQcReview(queryUrl, [params[`${timeKey}_start`], params[`${timeKey}_end`]], timeKey);
        } else {
            msgDom.ico("❌");
            msgDom.text("时间参数错误");
        }
        return dataArr;
    }

    // 下载实时直播的数据
    async function liveDownload(element, getTime, bizId) {
        if (!document.querySelector(".Rechecklist0")) {
            return MessageTip("❌", "需要在“复审中心-质检”使用", 3);
        }
        const queryUrl = location.origin + "/api/biz/review/qc/list?" + config.queryFastDownload;
        const bizLine = GetQueryString("biz_line", queryUrl);
        if (bizLine != bizId && bizId === 19) {
            return MessageTip("❌", "不是直播视频", 3);
        }
        if (bizLine != bizId && bizId === 24) {
            return MessageTip("❌", "不是实时直播间", 3);
        }
        if (bizLine == 19 && getTime) {
            return MessageTip("❌", "直播视频不含时间字段", 3);
        }
        if (element._downloadRun === true) {
            return MessageTip("❌", "正在下载中", 3);
        }
        // 实时直播Time时弹出前端验证
        const verifyData = [];
        const liveDoVerify = SwitchRead("Live-Do-Verify");
        const isDoVerify = bizLine == 24 && getTime && liveDoVerify.state;
        if (isDoVerify) {
            let isClose = true;
            let numback = () => { };
            await new Promise(async (resolve, reject) => {
                const { element: elementBox, close: closeBox } = await MessageBox({
                    id: "verify-box",
                    title: "前端验证数据",
                    style: "height: 75%;min-height: 600px;width: 50%;min-width: 800px;",
                    body: [{
                        name: "div",
                        style: "height: 100%;display: flex;flex-direction: column;",
                        add: [{
                            name: "div",
                            innerText: "数据结构：监看任务id、直播间id、操作行为、驳回理由、操作时间"
                        }, {
                            name: "div",
                            innerText: "数据数量：0",
                            function(element) {
                                numback = (len) => {
                                    element.innerText = "数据数量：" + len;
                                }
                            }
                        }, {
                            name: "textarea",
                            className: "gm-textarea",
                            placeholder: "输入前端验证表格的内容",
                            function: (event) => {
                                const ThrottleBcak = ThrottleOver(() => {
                                    if (!event.value) {
                                        numback(0);
                                        return false;
                                    }
                                    try {
                                        const valueArr = event.value.split(/\n/).map((item) => {
                                            const [taskId, liveId, type, info, time] = item.split(/\t/);
                                            if (/^(\d{4})([-/])(\d{2})\2(\d{2})[T\s+](\d{2}):(\d{2}):(\d{2})(\.\d+)?$/.test(time)) {
                                                return { taskId, liveId, type, info, time };
                                            }
                                        }).filter((item) => item);
                                        numback(valueArr.length);
                                        if (valueArr.length <= 0) {
                                            throw "输入内容无效";
                                        }
                                        verifyData.push(...valueArr);
                                    } catch (error) {
                                        event.value = "";
                                        console.error(error);
                                        return MessageTip("❌", "输入内容无效", 3).open(elementBox);
                                    }
                                }, 200);
                                event.addEventListener("input", ThrottleBcak);
                            }
                        }]
                    }],
                    footer: [{
                        name: "button",
                        className: "gm-button danger",
                        innerHTML: "取消",
                        click: () => closeBox()
                    }, {
                        name: "button",
                        className: "gm-button",
                        innerHTML: "继续",
                        click: () => {
                            isClose = false;
                            closeBox();
                        }
                    }],
                    closeback: () => resolve()
                });
            })
            if (isClose) {
                return MessageTip("❌", "取消下载", 3);
            }
        }
        let listNumber = 0;
        const excelDate = [];
        const getTaskBack = QueueTaskRunner(5);
        // 入口函数
        (async () => {
            element._downloadRun = true;
            const msgDom = MessageTip("📥", "开始下载");
            const dataList = await queryGroupData(queryUrl, msgDom, (taskList, setPercentage) => {
                listNumber += taskList.length;
                // 制作数据
                for (const list of taskList) {
                    if (bizLine == 24) {
                        if (getTime) {
                            getTaskBack.push(() => realTimeGetLiveData(list).then((liveList) => {
                                setPercentage(1);
                                realTimeMarkExcelData(list, liveList);
                            }));
                        } else {
                            setPercentage(1);
                            realTimeMarkExcelData(list);
                        }
                    } else if (bizLine == 19) {
                        setPercentage(1);
                        videoLive(list);
                    }
                }
            });
            if (dataList.length === 0) {
                MessageTip("❌", "没有数据", 3);
            } else {
                await new Promise((resolve, reject) => {
                    if (bizLine == 24 && getTime) {
                        getTaskBack.endBack(() => {
                            if (listNumber === excelDate.length) {
                                resolve()
                            }
                        });
                    } else {
                        resolve();
                    }
                })
            }
            exportData();
            element._downloadRun = false;
            msgDom && msgDom.remove(2);
        })();
        // 导出数据
        function exportData() {
            const time = FormatTime("YYYYMMDDHHmmss");
            ExportToExcel("qcLink_" + time + ".xlsx").play(excelDate, "复审中心-质检");
            MessageTip("✔️", "导出Excel", 3);
        }
        /**
         * 获取状态名称
         * @param {string} showName 状态名称
         * @param {number} index 状态值
         * @returns {string} 状态名称
         */
        function getState(showName, index) {
            const showObj = showState[showName].find(item => item.value === index) || {};
            return showObj && showObj.text || "";
        }
        /**
         * 直播视频入口函数
         * @param {Array} taskList 数据
         */
        function videoLive(taskList) {
            excelDate.push({
                "链接": videoLiveMarkUrl(taskList),
                "任务id": taskList.taskId,
                "内容id": taskList.contentId,
                "直播间id": taskList.liveId,
                "业务线": taskList.bizLine,
                "内容来源": taskList.contentSource,
                "主播pin": taskList.authorPin,
                "直播间开始时间": taskList.showBeginTime,
                "任务分配时间": "",
                "复审状态": getState("review", taskList.reviewState),
                "质检分配时间": taskList.qcAssignTime,
                "质检操作时间": taskList.qcTime,
                "质检人员": taskList.qcPerson,
                "质检操作状态": getState("qcState", taskList.qcState),
                "质检内容质量": taskList.qcContentQualityScore,
                "审核操作时间": taskList.appealTime,
                "审核操作状态": getState("appealState", taskList.appealState),
                "运营操作时间": taskList.arbitrationTime,
                "运营操作状态": getState("arbitrationState", taskList.arbitrationState),
            })
        }
        function videoLiveMarkUrl(params) {
            const urlParams = {
                taskId: params.taskId,
                contentType: params.contentTypeId,
                bizLine: params.bizLineId,
                optType: 3,
                contentId: params.contentId,
                subLine: params.subLine ? params.subLineId : "",
                contentSource: params.contentSourceId,
                manualState: "undefined",
                liveId: params.liveId,
                recheck: 0,
            }
            return UpdateUrlParam(location.origin + "/Recheck/Detail?", urlParams);
        }
        function realTimeMarkUrl(params) {
            const urlParams = {
                taskId: params.taskId,
                contentType: "",
                bizLine: params.bizLineId,
                optType: 3,
                contentId: "null",
                subLine: params.subLineId,
                contentSource: params.contentSourceId,
                manualState: "undefined",
                qcTaskId: params.qcTaskId,
                liveId: params.liveId,
                recheck: 0,
            }
            return UpdateUrlParam(location.origin + "/Recheck/Detail?", urlParams);
        }
        async function realTimeMarkExcelData(taskList, liveList) {
            let verifyType = "";
            let verifyInfo = "";
            if (liveList && isDoVerify) {
                const timeArr = liveList.watchTime.firstAuditAllocationTimeFrame.split("-");
                const startTime = new Date(timeArr[0]).getTime();
                const stopTime = new Date(`${timeArr[0].split(" ")[0]} ${timeArr[1]}`).getTime();
                const verifyFind = verifyData.filter(({ taskId, liveId, time }) => {
                    if (taskId === taskList.taskId && liveId === taskList.liveId) {
                        const itemTime = new Date(time).getTime();
                        if (!isNaN(itemTime) && itemTime >= startTime && itemTime <= stopTime) {
                            return true;
                        }
                    }
                });
                verifyType = verifyFind.map((item) => item.type).join("\n") || "";
                verifyInfo = verifyFind.map((item) => item.info).join("\n") || "";
            }
            const verifyExcel = isDoVerify ? {
                "验证状态": verifyType,
                "验证原因": verifyInfo,
            } : {};
            excelDate.push({
                "链接": realTimeMarkUrl(taskList),
                "任务id": taskList.taskId,
                "质检id": taskList.qcTaskId,
                "直播间id": taskList.liveId,
                "业务线": taskList.bizLine,
                "内容来源": taskList.contentSource,
                "主播pin": taskList.authorPin,
                "直播间开始时间": taskList.showBeginTime,
                "任务分配时间": liveList && liveList.watchTime.firstAuditAllocationTimeFrame || "",
                "复审状态": getState("review", taskList.reviewState),
                "质检分配时间": taskList.qcAssignTime,
                "质检操作时间": taskList.qcTime,
                "质检人员": taskList.qcPerson,
                "质检操作状态": getState("qcStateLive", taskList.qcState),
                "质检内容质量": taskList.qcContentQualityScore,
                "审核人员": taskList.manualPerson,
                "审核操作时间": taskList.appealTime,
                "审核操作状态": getState("appealState", taskList.appealState),
                "运营操作时间": taskList.arbitrationTime,
                "运营操作状态": getState("arbitrationState", taskList.arbitrationState),
                ...verifyExcel,
            })
        }
        async function realTimeGetLiveData(taskList) {
            return HTTP_XHR({
                method: "GET",
                url: `/liveapi/live/review/getWatchTimeAndAuditDetail?task_id=${taskList.taskId}&live_id=${taskList.liveId}&qc_task_id=${taskList.qcTaskId}`
            }).then((xhr) => {
                const responseText = xhr.responseText;
                return JSON.parse(responseText).content;
            })
        }
    }

    // 下载复审数据
    async function reviewDownload(element) {
        const listDom = document.querySelector(".Rechecklist2,.Rechecklist3");
        if (!listDom) {
            return MessageTip("❌", "需要在“复审中心-质检管理复审”使用", 3);
        }
        const pathname = listDom.classList.contains("Rechecklist2") ? "arbitration" : "reviewQcManage";
        const queryUrl = location.origin + `/api/biz/review/${pathname}/list?` + config.queryFastDownload;
        if (element._downloadRun === true) {
            return MessageTip("❌", "正在下载中", 3);
        }
        const excelDate = [];
        // 入口函数
        (async () => {
            element._downloadRun = true;
            const msgDom = MessageTip("📥", "开始下载");
            const dataList = await queryGroupData(queryUrl, msgDom, (taskList, setPercentage) => {
                // 制作数据
                for (const list of taskList) {
                    setPercentage(1);
                    markExcelData(list);
                }
            });
            if (dataList.length === 0) {
                MessageTip("❌", "没有数据", 3);
            }
            exportData();
            element._downloadRun = false;
            msgDom && msgDom.remove(2);
        })();
        // 导出数据
        function exportData() {
            const time = FormatTime("YYYYMMDDHHmmss");
            ExportToExcel("qcReview_" + time + ".xlsx").play(excelDate, "复审中心-质检");
            MessageTip("✔️", "导出Excel", 3);
        }
        /**
         * 获取状态名称
         * @param {string} showName 状态名称
         * @param {number} index 状态值
         * @returns {string} 状态名称
         */
        function getState(showName, index) {
            const showObj = showState[showName].find(item => item.value === index) || {};
            return showObj && showObj.text || "";
        }
        /**
         * 数据制作入口函数
         * @param {Array} taskList 数据
         */
        function markExcelData(taskList) {
            // 直播监看单独处理
            const isLive = taskList.bizLine === 24;
            excelDate.push({
                "链接": isLive ? realTimeLiveMarkUrl(taskList) : videoLiveMarkUrl(taskList),
                "任务id": taskList.taskId,
                "内容id": taskList.contentId,
                "直播间id": taskList.liveId,
                "业务线": taskList.bizLine,
                "子渠道": taskList.subLine,
                "内容来源": taskList.contentSource,
                "内容样式": taskList.contentType,
                "标题": taskList.title,
                "作者PIN": taskList.authorPin || "未知",
                "业务状态": getState("serviceState", taskList.qcState),
                "质检分配时间": taskList.qcAssignTime,
                "质检操作时间": taskList.qcTime,
                "质检操作人员": taskList.qcPerson,
                "质检操作状态": getState(isLive ? "qcStateLive" : "qcState", taskList.qcState),
                "审核操作时间": taskList.manualTime,
                "审核操作人员": taskList.manualPerson,
                "审核操作状态": getState("appealState", taskList.appealState),
                "质检管理-操作时间": taskList.qcManageReviewTime,
                "质检管理-操作人员": taskList.qcManageReviewPerson,
                "质检管理-操作状态": getState("qcManageReviewState", taskList.qcManageReviewState),
                "审核管理-操作时间": taskList.auditManageReviewTime,
                "审核管理-操作人员": taskList.auditManageReviewPerson,
                "审核管理-操作状态": getState("auditManageReviewState", taskList.auditManageReviewState),
                "运营操作时间": taskList.arbitrationTime,
                "运营操作人员": taskList.arbitrationPerson,
                "运营操作状态": getState("arbitrationState", taskList.arbitrationState),
            })
        }
        function videoLiveMarkUrl(params) {
            const urlParams = {
                taskId: params.taskId,
                contentType: params.contentTypeId,
                bizLine: params.bizLineId,
                optType: 9,
                contentId: params.contentId,
                subLine: params.subLine ? params.subLineId : "",
                contentSource: params.contentSourceId,
                manualState: "undefined",
                liveId: params.liveId,
                recheck: 0,
            }
            return UpdateUrlParam(location.origin + "/Recheck/Detail?", urlParams);
        }
        function realTimeLiveMarkUrl(params) {
            const urlParams = {
                taskId: params.taskId,
                contentType: "",
                bizLine: params.bizLineId,
                optType: 9,
                contentId: "null",
                subLine: params.subLineId,
                contentSource: params.contentSourceId,
                manualState: "undefined",
                qcTaskId: params.qcTaskId,
                liveId: params.liveId,
                recheck: 0,
            }
            return UpdateUrlParam(location.origin + "/Recheck/Detail?", urlParams);
        }
    }

    // 主函数
    const siyuAdd = SwitchRead("Siyu-Add-Board");
    homeMain(homeLayout);
    async function homeMain(children) {
        const jdData = [
            {
                qc_name: "黄金流程",
                params: [
                    "biz_line=17&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=17&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=17&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=17&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=17&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=17&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=17&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=17&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=17&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "私域-视频",
                style: siyuAdd.state ? "display: none;" : "",
                xhrStop: siyuAdd.state,
                params: [
                    "biz_line=1&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=1&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=1&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=1&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=1&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=1&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=1&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=1&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=1&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "私域-其它",
                style: siyuAdd.state ? "display: none;" : "",
                xhrStop: siyuAdd.state,
                params: [
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=1&content_type=3,5,4,6,8,7,10,9,12,28,11&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "京东私域",
                style: !siyuAdd.state ? "display: none;" : "",
                xhrStop: !siyuAdd.state,
                params: [
                    "biz_line=1&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=1&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=1&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=1&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=1&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=1&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=1&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=1&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "种草秀",
                params: [
                    "biz_line=32&content_source=25&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=32&content_source=25&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=32&content_source=25&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=32&content_source=25&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=7&biz_line=32&content_source=25&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=32&content_source=25&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=32&content_source=25&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=32&content_source=25&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=32&content_source=25&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "图文",
                params: [
                    "biz_line=39&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=39&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=39&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=39&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=39&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=39&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=39&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=39&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=39&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "图文标签",
                params: [
                    "biz_line=39&content_source=99339,9931,99321&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=39&content_source=99339,9931,99321&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=39&content_source=99339,9931,99321&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=39&content_source=99339,9931,99321&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=39&content_source=99339,9931,99321&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=39&content_source=99339,9931,99321&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=39&content_source=99339,9931,99321&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=39&content_source=99339,9931,99321&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=39&content_source=99339,9931,99321&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "测评内容",
                params: [
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=38,99338,11138,11311138,99311138,99011138&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "TOP巡检",
                params: [
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=11438,11411138,1141111,11411121,1141,11421&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "商品视频",
                params: [
                    "biz_line=34&content_source=1,26,27&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=34&content_source=1,26,27&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=34&content_source=1,26,27&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=34&content_source=1,26,27&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=34&content_source=1,26,27&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=34&content_source=1,26,27&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=34&content_source=1,26,27&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=34&content_source=1,26,27&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=34&content_source=1,26,27&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "先后-商品",
                params: [
                    "biz_line=34&content_source=1111,11126,1131111,11311126&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=34&content_source=1111,11126,1131111,11311126&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=34&content_source=1111,11126,1131111,11311126&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=34&content_source=1111,11126,1131111,11311126&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=34&content_source=1111,11126,1131111,11311126&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=34&content_source=1111,11126,1131111,11311126&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=34&content_source=1111,11126,1131111,11311126&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=34&content_source=1111,11126,1131111,11311126&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=34&content_source=1111,11126,1131111,11311126&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "直播监看",
                params: [
                    "biz_line=24&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=24&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=24&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=24&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=3&biz_line=24&sort_by=1",
                    "biz_line=24&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=24&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=24&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=24&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "主图视频",
                params: [
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=45,11145,11245,11311145&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "高热巡检",
                style: siyuAdd.state ? "display: none;" : "",
                xhrStop: siyuAdd.state,
                params: [
                    "biz_line=7&content_source=1121,11221&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=1121,11221&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "先后-高热",
                style: siyuAdd.state ? "display: none;" : "",
                xhrStop: siyuAdd.state,
                params: [
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=11311121,1131111&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=11311121,1131111&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "全部-高热",
                style: !siyuAdd.state ? "display: none;" : "",
                xhrStop: !siyuAdd.state,
                params: [
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1121,11221,11311121,1131111&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "先后-视频",
                params: [
                    "biz_line=7&content_source=1111,11121&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1111,11121&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1111,11121&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1111,11121&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=1111,11121&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=1111,11121&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1111,11121&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1111,11121&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1111,11121&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "先后-热点",
                params: [
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=99011121,9901111&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=99011121,9901111&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "先后-标签",
                params: [
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=99311121,9931111&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=99311121,9931111&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "旧线路视频",
                params: [
                    "biz_line=7&content_source=1,21,27&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,21,27&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,21,27&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,21,27&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=1,21,27&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,21,27&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,21,27&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,21,27&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,21,27&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "质量标签",
                params: [
                    "biz_line=7&content_source=9931,99321&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=9931,99321&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=9931,99321&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=9931,99321&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=9931,99321&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=9931,99321&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=9931,99321&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=9931,99321&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=9931,99321&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ]
            }, {
                qc_name: "合计",
                tag: "th",
                inputBcak: inputFront,
                params: [
                    "review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ],
                callback: ({ content, element }) => {
                    const totalSum = Object.keys(content).reduce((sum, value) => sum + content[value], 0);
                    element.children[1].innerHTML = totalSum;
                }
            }, {
                qc_name: "京东视频All",
                tag: "th",
                inputBcak: inputFront,
                params: [
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&review_state=1&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&qc_assign_end=endTime 23:59:59&qc_assign_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&appeal_state=1,2,3&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "type=0&biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&manual_people=userName&manual_end=endTime 23:59:59&manual_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&appeal_state=3&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&qc_manage_review_state=1&review_state=30&appeal_end=endTime 23:59:59&appeal_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&qc_person=userName&qc_manage_review_state=2,4&qc_end=endTime 23:59:59&qc_start=startTime 00:00:00",
                    "biz_line=7&content_source=1,27,21,1111,11121,1121,11221,11311121,1131111&content_type=1,2&qc_manage_review_people=userName&qc_manage_review_state=2,3,4,5&qc_manage_review_end=endTime 23:59:59&qc_manage_review_start=startTime 00:00:00",
                ],
                callback: ({ content, element }) => {
                    const sumArr = ["主图视频", "高热巡检", "先后-视频", "先后-高热", "全部-高热", "旧线路视频"];
                    const totalSum = Object.keys(content).reduce((sum, value) => {
                        if (sumArr.includes(value)) {
                            return sum + content[value];
                        }
                        return sum;
                    }, 0);
                    if (!element.children[1]._sumDom) {
                        AddDOM({
                            addNode: element.children[1],
                            addData: [Tooltip({
                                text: sumArr.join(" + "),
                                node: [{
                                    name: "span",
                                    innerHTML: totalSum,
                                    function(elem) {
                                        element.children[1]._sumDom = elem;
                                    }
                                }]
                            })]
                        })
                    } else {
                        element.children[1]._sumDom.innerHTML = totalSum;
                    }
                }
            }
        ];
        const board = await AddDOM({
            addNode: children,
            addData: [{
                name: "div",
                id: "jd-board-main",
                add: [{
                    name: "div",
                    id: "jd-board-collapse",
                    innerHTML: leftArrowIco,
                    function: (event) => {
                        event.addEventListener("click", () => {
                            if (event.className) {
                                event.className = "";
                                boardOpen("open");
                            } else {
                                event.className = "active";
                                boardOpen("close");
                            }
                        });
                    }
                }, {
                    name: "div",
                    id: "jd-board",
                    add: [{
                        name: "div",
                        id: "title",
                        add: [{
                            name: "span",
                            id: "menu",
                            innerHTML: "功能",
                            function: homeUse
                        }, {
                            name: "span",
                            innerHTML: "京东审核助手"
                        }, {
                            name: "span",
                            id: "tip",
                            innerHTML: "查询",
                            click: copyDataImg,
                            function: copyDataMenu
                        }]
                    }, {
                        name: "div",
                        id: "query",
                        function: queryDoc
                    }, {
                        name: "table",
                        cellpadding: 0,
                        add: [{
                            name: "tbody",
                            function: addLabel
                        }],
                    }, {
                        name: "div",
                        id: "tabs",
                        function: addTabs
                    }, {
                        name: "div",
                        id: "foot",
                        function: versionPlug
                    }]
                }]
            }]
        }, 0)
        async function queryDoc(element) {
            await AddDOM({
                addNode: element,
                addData: [{
                    name: "div",
                    id: "time",
                    add: [{
                        name: "input",
                        type: "date",
                        autocomplete: "off",
                        value: FormatTime()
                    }, {
                        name: "button",
                        className: "gm-button small",
                        innerHTML: "今天",
                        click: () => {
                            const input = element.querySelector("#time input");
                            input.value = FormatTime();
                        }
                    }, {
                        name: "button",
                        className: "gm-button small",
                        innerHTML: "查询",
                        click: () => queryData()
                    }],
                    function: (timeElem) => {
                        RollingListen({ element: timeElem, time: 20 }, (params) => {
                            const input = timeElem.querySelector("input");
                            const oldValue = new Date(FormatTime()).getTime();
                            const nowValue = input.valueAsNumber;
                            if (params.up && nowValue < oldValue) {
                                input.stepUp();
                            } else if (params.down) {
                                input.stepDown();
                            }
                        })
                    }
                }, {
                    name: "div",
                    id: "user",
                    style: "display: none;",
                    add: [{
                        name: "input",
                        type: "text",
                        style: "padding-left: 5px;",
                        autocomplete: "off",
                        placeholder: "ext.jd_all",
                    }, {
                        name: "button",
                        className: "gm-button warning small",
                        innerHTML: "自己",
                        click: async () => {
                            const userInfo = GET_DATA("GM_CONFIG").userInfo || {};
                            const input = element.querySelector("#user input");
                            input.value = userInfo.pin;
                        }
                    }, {
                        name: "button",
                        className: "gm-button warning small",
                        innerHTML: "清除",
                        click: () => {
                            const input = element.querySelector("#user input");
                            input.value = "";
                        }
                    }]
                }]
            })
        }
        async function addLabel(element) {
            function getReact(element) {
                return element[Object.keys(element).filter((key) => key.includes("reactInternalInstance"))].memoizedProps;
            }
            // 输入内容
            function setInput(params) {
                const { element, values } = params;
                getReact(element).onChange({ target: { value: values } });
            }
            // 选择选择框
            function setSelect(params) {
                const { element, values } = params;
                const selectId = element.getAttribute("aria-controls");
                const valueList = values.split(",");
                let selectDom = null;
                for (const value of valueList) {
                    setInput({ element, values: value });
                    const controlsDom = document.getElementById(selectId);
                    selectDom = controlsDom.parentElement.parentElement.parentElement;
                    selectDom.style.opacity = "0";
                    const holderList = controlsDom.parentElement.querySelector(".rc-virtual-list-holder-inner");
                    const index = getReact(holderList).children[0].findIndex((item) => item && item.key.replace(/\D/g, "") == value);
                    const menuItme = holderList.querySelectorAll(".ant5-select-item");
                    if (index !== -1) {
                        menuItme[index].click();
                    }
                }
                element.dispatchEvent(new MouseEvent("blur", {
                    bubbles: true, // 允许事件冒泡
                    cancelable: true, // 允许事件被取消
                }));
                setTimeout(() => {
                    selectDom.style.opacity = "";
                }, 1000);
            }
            // 选择时间
            function setDataTime(params) {
                const { element, values } = params;
                if (!element) {
                    return false;
                }
                getReact(element.lastElementChild).onClick();
                const timeDom = document.querySelector(".antcap-calendar-time");
                timeDom.style.opacity = "0";
                const input = timeDom.querySelectorAll("input");
                const select = timeDom.querySelector("table td");
                select.click();
                select.click();
                const start = getReact(input[0]);
                const end = getReact(input[1]);
                start.onChange({ target: { value: values["start"] } });
                end.onChange({ target: { value: values["end"] } });
                start.onChange({ target: { value: values["start"] } });
                const okBut = timeDom.querySelector(".antcap-calendar-ok-btn");
                okBut.click();
                setTimeout(() => {
                    timeDom.style.opacity = "";
                }, 1000);
            }
            // 选择启动器
            async function setSearchPage(params) {
                return new Promise(async (resolve, reject) => {
                    const { idName, values } = params;
                    const element = document.getElementById(idName);
                    if (!element) {
                        return resolve();
                    }
                    const oldText = element.innerText;
                    if (element.classList.contains("ant5-input")) {
                        setInput({ element, values });
                    }
                    if (element.classList.contains("ant5-select-selection-search-input")) {
                        setSelect({ element, values });
                    }
                    if (element.classList.contains("antcap-calendar-picker")) {
                        setDataTime({ element, values });
                    }
                    // 兼容任务池
                    if (queryConfig.queryList.awaitMove && idName === "biz_line" && oldText !== element.innerText) {
                        AwaitSelectorShow(".antcap-btn-link .anticon-down").then((awayBtn) => {
                            awayBtn && awayBtn.click();
                            reMoveSearch();
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                })
            }
            // 清除选项
            function reMoveSearch(isSubmit = false) {
                function remove() {
                    const reSelect = document.querySelectorAll(".ant5-select-clear");
                    for (const list of reSelect) {
                        list.dispatchEvent(new MouseEvent("mousedown", {
                            bubbles: true, // 允许事件冒泡
                            cancelable: true, // 允许事件被取消
                        }));
                    }
                    const reChoice = document.querySelectorAll(".ant5-select-selection-item-remove");
                    for (const list of reChoice) {
                        list.click();
                    }
                    const reInput = document.querySelectorAll("input[type=text].ant5-input");
                    for (const list of reInput) {
                        list.value = "";
                        getReact(list).onChange({ target: { value: "" } });
                    }
                    const reCalendar = document.querySelectorAll(".antcap-calendar-picker-clear");
                    for (const list of reCalendar) {
                        list.click();
                    }
                }
                remove();
                if (isSubmit) {
                    setDataTime({
                        element: document.getElementById("qcAssignData") || document.getElementById("submitDate"),
                        values: {
                            end: FormatTime("YYYY-MM-DD hh:mm:ss"),
                            start: FormatTime("YYYY-MM-DD hh:mm:ss")
                        }
                    });
                    const submit = document.querySelector("button[type=submit].ant5-btn-primary");
                    submit && submit.click();
                    remove();
                }
            }
            await AddDOM({
                addNode: element,
                addData: [{
                    name: "tr",
                    add: [{
                        name: "th",
                        innerHTML: "频道"
                    }, {
                        name: "th",
                        innerHTML: "待质检"
                    }, {
                        name: "th",
                        click: () => {
                            const frontValue = board.querySelectorAll("table input");
                            for (const list of frontValue) {
                                list.value = "";
                            }
                        },
                        add: [Tooltip({
                            style: "transition: none;",
                            text: "清除往前",
                            node: [{
                                name: "span",
                                style: "transition: none;",
                                innerHTML: "往前"
                            }]
                        })]
                    }]
                }]
            })
            const pushSearch = AddDOM({
                addNode: document.body,
                addData: [{
                    name: "div",
                    className: "push-search",
                    innerHTML: "搜索",
                    click: ({ target }) => {
                        if (!queryConfig.queryList.fastQueryClass) {
                            return MessageTip("❌", "该渠道不支持快捷搜索", 3);
                        }
                        if (!queryConfig.queryList.fastQueryClass || !queryConfig.queryList.fastQueryClass.some((item) => !!document.querySelector(item))) {
                            return MessageTip("❌", queryConfig.queryList.fastQueryMsg, 3);
                        }
                        if (target._runSearch) {
                            return false;
                        }
                        target._runSearch = true;
                        const searchText = target._searchList;
                        const searchList = GetQueryString(null, searchText);
                        const listKeys = Object.keys(searchList);
                        WaylayHTTP([{
                            method: "GET",
                            url: (url) => queryConfig.queryList.fastQueryApi.some((item) => url.includes(item)),
                            stop: true,
                            callback: async (params) => {
                                params.stop();
                                params.data.abort();
                                const awayBtn = document.querySelector(".ant5-btn-link .anticon-down");
                                awayBtn && awayBtn.click();
                                const timeArr = { values: {} };
                                for (const key of listKeys) {
                                    if (key === "sort_by") {
                                        continue;
                                    }
                                    const timeIdArr = {
                                        qcData: ["qc_end", "qc_start"],
                                        appealData: ["appeal_end", "appeal_start"],
                                        qc_manage_review_time: ["qc_manage_review_end", "qc_manage_review_start"],
                                        qcAssignData: ["qc_assign_end", "qc_assign_start"],
                                        manualDate: ["manual_end", "manual_start"],
                                    }
                                    const timeId = Object.keys(timeIdArr).map((i) => ({ n: i, v: timeIdArr[i].includes(key) })).find((i) => i.v === true) || {};
                                    try {
                                        if (timeId.n) {
                                            timeArr.idName = timeId.n;
                                            const timeType = key.includes("end") ? "end" : "start";
                                            timeArr.values[timeType] = searchList[key];
                                            if (Object.keys(timeArr.values).length === 2) {
                                                await setSearchPage(timeArr);
                                            }
                                        } else {
                                            await setSearchPage({
                                                idName: key,
                                                values: searchList[key]
                                            })
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        target._runSearch = false;
                                    }
                                }
                                WaylayHTTP([{
                                    method: "GET",
                                    url: (url) => queryConfig.queryList.fastQueryApi.some((item) => url.includes(item)),
                                    stop: true,
                                    callback: async (subParams) => {
                                        subParams.stop();
                                        subParams.send();
                                        target._runSearch = false;
                                    }
                                }])
                                setTimeout(() => {
                                    target._runSearch = false;
                                }, 5000)
                                const runStep = searchList.biz_line == "24" ? 15 : 2;
                                RunFrame(() => {
                                    const submit = document.querySelector("button[type=submit].ant5-btn-primary");
                                    submit && submit.click();
                                }, runStep)
                            }
                        }])
                        reMoveSearch(true);
                    }
                }]
            })
            pushSearch.then((div) => {
                const { top } = element.getBoundingClientRect();
                div.style.top = `${top}px`;
            })
            for (const list of jdData) {
                await AddDOM({
                    addNode: element,
                    addData: [{
                        name: "tr",
                        style: list.style,
                        add: [{
                            name: list.tag || "td",
                            innerHTML: list.qc_name,
                            click: (_, elem) => window.open(queryConfig.queryList.download + elem.parentNode._searchList, "", "", true),
                            function: (elem) => {
                                const downloadExcel = downloadUrlExcel();
                                DropdownMenu({
                                    openElem: elem,
                                    mouse: "r",
                                    node: [{
                                        name: "div",
                                        innerHTML: "普通数据",
                                        click: () => window.open(queryConfig.queryList.download + elem.parentNode._searchList, "", "", true),
                                    }, {
                                        name: "div",
                                        innerHTML: "包含链接",
                                        click: () => {
                                            if (downloadExcel.isRun()) {
                                                return MessageTip("❌", "正在下载，请稍后", 3);
                                            }
                                            const downloadUrl = queryConfig.queryList.download + elem.parentNode._searchList;
                                            downloadExcel.run(downloadUrl, ({ xlsxDataUrl }) => {
                                                if (xlsxDataUrl) {
                                                    const time = FormatTime("YYYYMMDDHHmmss");
                                                    ExportToExcel("qcLink_" + time + ".xlsx").play(xlsxDataUrl, "复审中心-质检");
                                                }
                                            })
                                        }
                                    }, {
                                        name: "div",
                                        innerHTML: "数据快查",
                                        click: () => {
                                            if (downloadExcel.isRun()) {
                                                return MessageTip("❌", "正在下载，请稍后", 3);
                                            }
                                            const downloadUrl = queryConfig.queryList.download + elem.parentNode._searchList;
                                            downloadExcel.run(downloadUrl, ({ urlData, xlsxData }) => {
                                                if (urlData) {
                                                    queryFastData(null, { urlData: urlData.join("\n"), xlsxData });
                                                }
                                            })
                                        }
                                    }],
                                    clickBack: (({ rect, setLeft }) => setLeft(rect.left + rect.width + 1))
                                })
                            }
                        }, {
                            name: list.tag || "td"
                        }, {
                            name: list.tag || "td",
                            add: [{
                                name: "input",
                                type: "number",
                                min: "0",
                                function: (input) => {
                                    input.addEventListener("change", () => {
                                        if (input.value == 0) {
                                            input.value = "";
                                        }
                                    })
                                    list.inputBcak && list.inputBcak(input);
                                }
                            }]
                        }],
                        function: (trElem) => {
                            pushSearch.then((div) => {
                                RunFrame(() => {
                                    const jdBoard = board.querySelector("#jd-board");
                                    trElem.addEventListener("mouseenter", ({ target }) => {
                                        clearTimeout(div._timeout);
                                        div._searchList = trElem._searchList;
                                        const { top, height } = target.getBoundingClientRect();
                                        const isBlock = jdBoard.style.height;
                                        if (!isBlock || isBlock === "auto") {
                                            div.style.top = `${top}px`;
                                            div.style.left = "200px";
                                            div.style.height = `${height}px`;
                                            div.style.lineHeight = `${height}px`;
                                        }
                                    })
                                    trElem.addEventListener("mouseleave", () => {
                                        div._timeout = setTimeout(() => {
                                            div.style.left = "-50px";
                                        }, 300)
                                    })
                                })
                            })
                        }
                    }]
                }, 0).then((trDom) => {
                    list.element = trDom;
                })
            }
        }
        function inputFront(input) {
            input.addEventListener("input", () => {
                const frontValue = board.querySelectorAll("table input");
                for (const list of frontValue) {
                    if (input.value == 0) {
                        list.value = "";
                    } else {
                        list.value = input.value;
                    }
                }
            })
        }
        async function addTabs(element) {
            element.setAttribute("tabindex", "-1"); // 元素可聚焦
            element.style.height = "20px";
            const queryApi = {
                qc: {
                    getApi(key, qc_name) {
                        let api = "/api/biz/review/";
                        if (qc_name === "直播监看") {
                            api = "/liveapi/live/review/";
                        }
                        if (["已复审"].includes(key)) {
                            api += "reviewQcManage/list?";
                        } else {
                            api += "qc/list?";
                        }
                        return api;
                    },
                    download: "/api/download/qcRecord?",
                    fastQueryApi: ["/api/biz/review/qc/list?", "/api/biz/review/reviewQcManage/list?"],
                    fastQueryClass: [".Rechecklist0", ".Rechecklist3"],
                    fastQueryMsg: "需要在“复审中心-质检”使用"
                },
                machine: {
                    getApi: "/api/biz/audit/machine/querylist?",
                    download: "/api/download/taskPoolRecord?",
                    fastQueryApi: ["/api/biz/audit/machine/querylist?"],
                    fastQueryClass: [".TaskPool"],
                    fastQueryMsg: "需要在“任务池”使用",
                    awaitMove: true
                }
            }
            const labelTH = [{
                key: "待质检",
                ...queryApi.qc
            }, {
                key: "送审量",
                ...queryApi.qc
            }, {
                key: "已质检",
                ...queryApi.qc
            }, {
                key: "不一致",
                ...queryApi.qc
            }, {
                key: "审核量",
                ...queryApi.machine
            }, {
                key: "申诉量",
                ...queryApi.qc
            }, {
                key: "待复审",
                ...queryApi.qc
            }, {
                key: "质检错",
                ...queryApi.qc
            }, {
                key: "已复审",
                ...queryApi.qc,
            }];
            queryConfig.queryList = { index: 0, ...labelTH[0] };
            const maxScrollNum = (num) => {
                const scrollNum = labelTH.length / num;
                if (Number.isInteger(scrollNum) || scrollNum === 1) {
                    return num;
                }
                return maxScrollNum(num - 1);
            }
            const scrollObj = {
                step: 0,
                scroll: 0,
                scrollMax: 0,
                scrollNum: maxScrollNum(4),
                scrollDom: null
            };
            // 滚动监听，并节流
            RollingListen({ element, time: 300 }, setScrollBack);
            element.addEventListener("mouseover", function () {
                this.focus();
                hideRolling();
            });
            element.addEventListener("mouseout", function () {
                this.blur();
                hideRolling(true);
            });
            element.addEventListener("keydown", ({ key }) => {
                const direction = (["ArrowLeft", "ArrowUp"].includes(key) && -1) || (["ArrowRight", "ArrowDown"].includes(key) && 1) || 0;
                setScrollBack({ deltaY: direction });
            });
            function setScrollBack({ deltaY, deltaX }) {
                scrollObj.scroll += ((deltaY > 0 || deltaX > 0) ? -scrollObj.step : (deltaY < 0 || deltaX < 0) ? scrollObj.step : 0) * scrollObj.scrollNum;
                scrollObj.scroll = Math.min(0, Math.max(scrollObj.scroll, scrollObj.scrollMax));
                scrollObj.scrollDom && (scrollObj.scrollDom.style.left = scrollObj.scroll + "px");
                hideRolling();
            }
            function hideRolling(isHide) {
                const rollingAll = element.querySelectorAll(".rolling");
                rollingAll.forEach((elem) => {
                    elem.style.width = isHide ? 0 : "15px";
                })
                if (!isHide && scrollObj.scroll === 0) {
                    rollingAll[0].style.width = 0;
                }
                if (!isHide && scrollObj.scroll === scrollObj.scrollMax) {
                    rollingAll[1].style.width = 0;
                }
            }
            await AddDOM({
                addNode: element,
                addData: [{
                    name: "span",
                    className: "rolling",
                    style: "left: 0;",
                    innerHTML: leftArrowIco,
                    click: () => setScrollBack({ deltaY: -1 })
                }, {
                    name: "div",
                    className: "tabs-body",
                    style: "position: absolute;width: 100%;left: 0;transition: 0.2s ease-in, left 0.3s linear",
                    function: (e) => {
                        scrollObj.scrollDom = e;
                    },
                    add: labelTH.map((params, index) => ({
                        name: "div",
                        className: "tabs-list",
                        innerHTML: params.key,
                        click: (e) => {
                            // 设置选中颜色
                            const allDiv = element.querySelectorAll(".tabs-body>div");
                            for (const div of allDiv) {
                                div.id = "";
                            }
                            e.target.id = "active";
                            // 修改表格标题
                            const tabelName = board.querySelector("table tr th:nth-child(2)");
                            tabelName.innerHTML = params.key;
                            // 隐藏 || 显示用户input
                            const user = board.querySelector("#user");
                            if (["已质检", "不一致", "审核量", "申诉量", "待复审", "质检错", "已复审"].includes(params.key)) {
                                user.style = "";
                            } else {
                                user.style = "display: none;";
                            }
                            // 查询 && 设置不同tab的时间
                            const time = queryConfig.queryTime[index] || FormatTime();
                            const input = board.querySelector("#time input");
                            input.value = time;
                            queryConfig.queryTime[index] = time;
                            queryConfig.queryList = { index, ...params };
                            queryData(true);
                        },
                        function: (e) => {
                            if (index === 0) {
                                e.id = "active";
                                queryConfig.queryTime = [];
                                scrollObj.step = e.clientWidth;
                                scrollObj.scrollMax = -scrollObj.step * (labelTH.length - 4);
                            }
                        }
                    }))
                }, {
                    name: "span",
                    className: "rolling",
                    style: "right: 0;transform: rotate(180deg);",
                    innerHTML: leftArrowIco,
                    click: () => setScrollBack({ deltaY: 1 })
                }]
            }, 0)
        }
        // 查询数据
        const getTotalArr = {};
        const xhrAbort = [];
        queryData();
        function queryData(type) {
            return new Promise(function (resolve, reject) {
                const endTime = board.querySelector("#time input").value;
                if (!endTime) {
                    MessageTip("❌", "时间不能为空", 3);
                    return reject();
                }
                const { key, index, getApi } = queryConfig.queryList;
                const frontValue = board.querySelectorAll("table input");
                const userName = board.querySelector("#user input").value || "";
                const getUrl = [];
                for (let i = 0; i < jdData.length; i++) {
                    const { qc_name, params, element } = jdData[i];
                    const startTime = DiffDay(endTime, (frontValue[i].value || 0));
                    const markUrl = params[index].replace("startTime", startTime).replace("endTime", endTime).replace("userName", userName);
                    element._searchList = markUrl;
                    getUrl.push(getApi(key, qc_name) + markUrl);
                }
                if (type || JSON.stringify(queryConfig.queryGetUrl) !== JSON.stringify(getUrl)) {
                    xhrAbort.forEach((xhr) => xhr.abort());
                    xhrAbort.splice(0, xhrAbort.length);
                } else if (!!queryConfig.queryRun) {
                    MessageTip("❌", "查询中...", 3);
                    return reject();
                }
                clearTimeout(queryConfig.clearTime || null);
                const tip = board.querySelector("#title #tip");
                tip.innerHTML = "查询";
                tip.style.background = "#ff0000";
                tip.style.color = "#ffffff";
                queryConfig.queryRun = true;
                queryConfig.queryGetUrl = getUrl;
                queryConfig.queryTime[index] = endTime;
                const getTaskBack = QueueTaskRunner(20);
                jdData.forEach((list, i) => {
                    const { tag, qc_name, element, xhrStop } = list;
                    if (tag !== "th" && !xhrStop) {
                        getTaskBack.push(async () => {
                            return HTTP_XHR({
                                method: "GET",
                                url: getUrl[i],
                                controller: (xhr) => {
                                    xhrAbort.push(xhr);
                                }
                            }).then((xhr) => {
                                let total = 0;
                                try {
                                    const data = JSON.parse(xhr.responseText);
                                    if (data.msg && data.code !== 0) {
                                        throw data;
                                    }
                                    total = data.content.total || 0;
                                    element.children[1].innerHTML = total;
                                } catch (error) {
                                    element.children[1].innerHTML = "N/A";
                                }
                                if (total >= 300) {
                                    element.children[1].style = "color: #f5222d;font-weight: bolder;";
                                } else if (total === 0) {
                                    element.children[1].style = "color: #bbbbbb;";
                                } else {
                                    element.children[1].style = "";
                                }
                                getTotalArr[qc_name] = total;
                            })
                        })
                    }
                });
                getTaskBack.endBack(runEnd);
                function runEnd() {
                    jdData.filter(list => list.callback).forEach((list) => {
                        list.callback({ content: getTotalArr, element: list.element });
                    });
                    queryConfig.queryRun = false;
                    tip.innerHTML = "复制";
                    tip.style.background = "#faad14";
                    if (type === "copy") {
                        resolve(true);
                        return true;
                    }
                    // 查询结束时复制一份文本结果
                    const CopyBoard = SwitchRead("Copy-Board");
                    if (CopyBoard.state) {
                        CopyText(board.querySelector("table"));
                    }
                    queryConfig.clearTime = setTimeout(() => {
                        tip.style.background = "";
                        tip.style.color = "";
                    }, 1000)
                }
            })
        }
        function copyDataMenu(clickDom) {
            const menuArr = {
                "复制图片": copyDataImg,
                "复制文本": copyDataText,
            };
            DropdownMenu({
                mouse: "r",
                openElem: clickDom,
                node: Object.keys(menuArr).map((key) => ({
                    name: "div",
                    innerHTML: key,
                    click: menuArr[key]
                })),
                clickBack: (({ rect, setTop }) => setTop(rect.top + rect.height))
            })
        }
        const { isCopuRun, copyOk, copyFinally } = {
            isCopuRun: (e) => {
                if (!!queryConfig.copyIsRun) {
                    const html = e.target.innerHTML;
                    return MessageTip("❌", html + "中...", 3);
                }
                clearTimeout(queryConfig.clearTime || null);
                queryConfig.copyIsRun = true;
            },
            copyOk: (tip) => {
                tip.innerHTML = "成功";
                tip.style.background = "#52c41a";
                MessageTip("✔️", "已复制到剪贴板", 3);
            },
            copyFinally: (tip) => {
                queryConfig.copyIsRun = false;
                queryConfig.clearTime = setTimeout(() => {
                    tip.innerHTML = "复制";
                    tip.style.background = "";
                    tip.style.color = "";
                }, 1000)
            }
        }
        function copyDataText(e) {
            if (isCopuRun(e)) {
                return false;
            }
            CopyText(" ").finally(() => {
                const tip = board.querySelector("#title #tip");
                queryData("copy").then(() => {
                    CopyText(board.querySelector("table")).then(() => {
                        copyOk(tip)
                    }).catch(() => {
                        MessageTip("❌", "复制失败", 3);
                    }).finally(() => {
                        copyFinally(tip);
                    })
                })
            })
        }
        function copyDataImg(e) {
            if (isCopuRun(e)) {
                return false;
            }
            CopyText(" ").finally(() => {
                const tip = board.querySelector("#title #tip");
                queryData("copy").then(() => {
                    tip.innerHTML = "制作";
                    RunFrame(() => {
                        CopyHtml2Img("#jd-board table").then(() => {
                            copyOk(tip)
                        }).catch((err) => {
                            tip.innerHTML = "失败";
                            tip.style.background = "#ff0000";
                            if (err === "leave") {
                                const msg = confirm("复制时请不要离开此页面！点击“确定”重新复制！");
                                if (msg === true) {
                                    setTimeout(() => copyDataImg(e));
                                }
                            } else {
                                MessageTip("❌", "复制失败", 3);
                            }
                        }).finally(() => {
                            copyFinally(tip);
                        })
                    }, 1)
                }).catch(() => {
                    queryConfig.copyIsRun = false;
                })
            })
        }
        boardOpen("open");
        function boardOpen(params) {
            const boardDom = board.querySelector("#jd-board");
            if (params === "open") {
                expandElement(boardDom);
            } else {
                collapseElement(boardDom);
            }
            // 显示面板
            function expandElement(element) {
                board.style.overflow = "hidden";
                element.style.height = "auto";
                const height = element.scrollHeight;
                element.style.height = 0;
                element.scrollHeight;
                element.style.height = height + "px";
                setTimeout(() => {
                    if (element.scrollHeight !== 0) {
                        element.style.height = "auto";
                    }
                }, 300)
            }
            // 隐藏面板
            function collapseElement(element) {
                board.style.overflow = "unset";
                const height = element.scrollHeight;
                element.style.height = height + "px";
                element.scrollHeight;
                element.style.height = 0;
            }
        }
    }

    // 功能菜单
    async function homeUse(clickDom) {
        const menuArr = {
            "批量工具": batchUrl,
            "数据快查": queryFastData,
            "账号信息": queryUserInfo,
        };
        DropdownMenu({
            mouse: ["l", "r"],
            openElem: clickDom,
            node: Object.keys(menuArr).map((key) => ({
                name: "div",
                innerHTML: key,
                click: menuArr[key]
            })),
            clickBack: (({ rect, setTop }) => setTop(rect.top + rect.height))
        })
    }
    // 功能窗口
    async function AddFloatWindow(params) {
        const floatWindow = await AddDOM({
            addNode: params.addNode,
            addData: [{
                name: "div",
                className: "gm-float-window",
                add: [{
                    name: "div",
                    id: "gm-float-move-bar"
                },
                ...params.addData
                ],
                ...params.otherData
            }]
        }, 0)
        const moveBar = floatWindow.querySelector("#gm-float-move-bar");
        WindowMove(moveBar, moveBar.parentNode, (place) => {
            moveBar.parentNode.style.left = place.left + "px";
            moveBar.parentNode.style.bottom = place.bottom + "px";
        })
        return floatWindow;
    }

    // 批量打开网页
    function batchUrl(work) {
        const batchConfig = {
            expand: false,
            isDropdown: "display: none;",
            taskList: []
        };
        const children = document.querySelector("#root");
        const batch = children.querySelector("#batch-url");
        if (!!batch) {
            batch.style.display = "";
            return false;
        }
        const plateBatch = [
            { plate: "自动", biz_line: "", content_source: "", content_type: "" },
            { plate: "视频ALL", biz_line: 7, content_source: "", content_type: "" },
            { plate: "TOP巡检", biz_line: 7, content_source: "1141,11421,11438,1141111,11411121", content_type: "" },
            { plate: "质量标ALL", biz_line: 7, content_source: "9931,99321,99311121,9931111", content_type: "" },
            { plate: "内容标ALL", biz_line: 7, content_source: "9921,99221,9901111,99011121", content_type: "" },
            { plate: "商品视频", biz_line: 34, content_source: "1,26,27,1111,11126,1131111,11311126", content_type: "" },
            { plate: "基础-视频", biz_line: 7, content_source: "1,21,27", content_type: "" },
            { plate: "视频-标签", biz_line: 7, content_source: "9931,99321", content_type: "" },
            { plate: "先后-视频", biz_line: 7, content_source: "1111,11121", content_type: "" },
            { plate: "全部-高热", biz_line: 7, content_source: "1121,11221,11311121,1131111", content_type: "" },
            { plate: "先后-标签", biz_line: 7, content_source: "99311121,9931111", content_type: "" },
            { plate: "京东私域", biz_line: 1, content_source: "", content_type: "" },
            { plate: "全部图文", biz_line: 39, content_source: "1,21,99339,9931,99321", content_type: "" },
            { plate: "测评内容", biz_line: 7, content_source: "38", content_type: "" },
            { plate: "黄金流程", biz_line: 17, content_source: "", content_type: "" },
            { plate: "种草秀", biz_line: 32, content_source: 25, content_type: "" },
        ]
        AddFloatWindow({
            addNode: children,
            otherData: {
                id: "batch-url",
            },
            addData: [{
                name: "div",
                id: "left",
                add: [{
                    name: "div",
                    id: "query",
                    function: addQuery,
                }, {
                    name: "div",
                    id: "batch-web",
                    style: "height: 32px;line-height: 32px;",
                    add: [{
                        name: "a",
                        target: "_blank",
                        innerHTML: "零零网络-批量工具",
                        href: "https://www.cdzero.cn/tool/batch/"
                    }]
                }]
            }, {
                name: "div",
                id: "text",
                function: addText
            }, {
                name: "div",
                id: "info",
                add: [{
                    name: "div",
                    id: "info-main",
                    add: [{
                        name: "div",
                        id: "info-title",
                        add: [{
                            name: "span",
                            innerHTML: "操作信息："
                        }, {
                            name: "a",
                            innerHTML: "清空信息",
                            style: "user-select: none;",
                            click: () => {
                                const info = document.querySelector("#batch-url #info-body");
                                info.innerHTML = "";
                            }
                        }]
                    }, {
                        name: "div",
                        id: "info-body",
                    }]
                }]
            }]
        }).then((workWindow) => {
            DisplayWindow([workWindow, work.target], workWindow);
        })
        async function addQuery(e) {
            const year = FormatTime("YYYY");
            const yearArr = Array.from({ length: 5 }, (_, i) => Number(year) - i);
            function changeOption() {
                const selected = e.querySelectorAll("#query-list");
                const option = selected[0].querySelector("select").value;
                if (option === "链接") {
                    selected[1].style.display = "none";
                    selected[2].style.display = "none";
                    selected[4].style.display = "none";
                }
                if (option === "内容ID") {
                    selected[1].style.display = "";
                    selected[2].style.display = "";
                    selected[4].style.display = "none";
                }
                if (option === "内容ID（任务池）") {
                    selected[1].style.display = "";
                    selected[2].style.display = "";
                    selected[4].style.display = "";
                }
                batchConfig.expand = false;
            }
            const queryDom = [{
                innerHTML: "来源",
                add: [{
                    name: "select",
                    id: "source",
                    add: ["链接", "内容ID", "内容ID（任务池）"].map((list) => ({
                        name: "option",
                        innerHTML: list,
                    })),
                    function: (c) => {
                        c.addEventListener("change", changeOption);
                    }
                }]
            }, {
                innerHTML: "板块",
                add: [{
                    name: "select",
                    id: "plate",
                    add: plateBatch.map((list) => ({
                        name: "option",
                        innerHTML: list.plate
                    }))
                }]
            }, {
                innerHTML: "时间",
                add: [{
                    name: "select",
                    id: "time",
                    add: yearArr.map((list) => ({
                        name: "option",
                        innerHTML: list
                    }))
                }]
            }, {
                innerHTML: "参数（非必填）",
                style: "display: none;",
                add: [{
                    name: "input",
                    type: "number",
                    min: "0",
                    id: "url-param"
                }]
            }, {
                innerHTML: "膨胀搜索",
                add: [{
                    name: "div",
                    style: "display: flex;",
                    add: [Tooltip({
                        text: "膨胀搜索ID中所有任务数据",
                        node: [SwitchBox({
                            checked: batchConfig.expand,
                            function: (event) => {
                                ObjectProperty(batchConfig, "expand", (params) => {
                                    event.checked = params.value;
                                })
                                event.addEventListener("change", () => {
                                    batchConfig.expand = event.checked;
                                })
                            }
                        })]
                    })]
                }]
            }, {
                innerHTML: "数量",
                add: [{
                    name: "span",
                    innerHTML: 0,
                    id: "url-number"
                }]
            }]
            for (const list of queryDom) {
                await AddDOM({
                    addNode: e,
                    addData: [{
                        name: "div",
                        id: "query-list",
                        style: list.style || "",
                        innerHTML: list.innerHTML + "：",
                        add: list.add,
                    }]
                })
            }
            changeOption();
        }
        function addText(e) {
            AddDOM({
                addNode: e,
                addData: [{
                    name: "textarea",
                    placeholder: "输入指定数据，一行算一条数据",
                    onfocus: ({ target }) => { // 获得焦点
                        target.style.color = "#000000";
                    },
                    onblur: ({ target }) => { // 失去焦点
                        target.style.color = "";
                    },
                    function: (event) => {
                        const urlThrottle = ThrottleOver(urlAllArr, 200);
                        event.addEventListener("input", urlThrottle);
                    }
                }, {
                    name: "div",
                    add: [{
                        name: "div",
                        add: [{
                            name: "button",
                            className: "gm-button danger",
                            innerHTML: "清除内容",
                            click: () => {
                                urlAllArr("");
                                batchConfig.taskList = [];
                                outInfo("清除内容");
                            }
                        }]
                    }, {
                        name: "div",
                        add: [{
                            name: "button",
                            className: "gm-button",
                            style: [batchConfig, "isDropdown"],
                            innerHTML: "下载",
                            click: () => {
                                downloadData(batchConfig.taskList);
                            }
                        }, {
                            name: "button",
                            className: "gm-button",
                            style: "margin-left: 10px;",
                            innerHTML: "转链接",
                            click: openUrl,
                            function: (element) => {
                                DropdownMenu({
                                    openElem: element,
                                    style: "z-index: 220;",
                                    mouse: "r",
                                    node: [{
                                        name: "div",
                                        innerHTML: "转链接",
                                        click: openUrl
                                    }, {
                                        name: "div",
                                        innerHTML: "下载数据",
                                        click: () => downloadData(batchConfig.taskList)
                                    }],
                                    clickBack: (({ rect, setLeft }) => setLeft(rect.left + rect.width + 1))
                                })
                            }
                        }, {
                            name: "button",
                            className: "gm-button",
                            style: "margin-left: 10px;",
                            innerHTML: "全部打开",
                            click: openUrl
                        }]
                    }]
                }]
            })
        }
        function urlAllArr(content = null) {
            const text = document.querySelector("#batch-url textarea");
            if (!text) {
                return [];
            }
            if (content !== null && typeof content === "string") {
                text.value = content;
            }
            const urlArr = text.value.split("\n").filter((item) => item !== "");
            const outNum = document.querySelector("#batch-url #url-number");
            outNum.innerHTML = urlArr.length;
            return urlArr;
        }
        // 有数据时显示下载按钮
        ObjectProperty(batchConfig, "taskList", () => {
            if (batchConfig.taskList.length > 0) {
                batchConfig.isDropdown = "display: block;";
            } else {
                batchConfig.isDropdown = "display: none;";
            }
        })
        // 下载数据
        function downloadData(taskList) {
            const bizLineInfo = config.bizLineInfo;
            const excelData = taskList.map((list) => {
                // 基本信息
                const bizLine = bizLineInfo.find(obj => obj.value === list.bizLineId) || {};
                const subLine = bizLine.sub_line && bizLine.sub_line.find(obj => obj.value === list.subLineId) || {};
                const contentSource = bizLine.content_source && bizLine.content_source.find(obj => obj.value === list.contentSourceId) || {};
                const contentType = bizLine.content_type && bizLine.content_type.find(obj => obj.value === list.contentTypeId) || {};
                return {
                    "链接": list.url,
                    "任务id": list.taskId,
                    "内容id": list.contentId,
                    "业务线": bizLine.label || "",
                    "子渠道": subLine.label || "",
                    "内容来源": contentSource.label || "",
                    "内容样式": contentType.label || "",
                    "标题": list.title || "",
                    "作者PIN": list.authorPin || "未知",
                    "达人等级": list.talentLevel || "未知等级",
                    "提交时间": list.publishTime || "",
                    "送审时间": list.submitTime || "",
                    "机审时间": list.machineTime || "",
                    "人审时间": list.manualTime || "",
                    "人审人员": list.manualPeople || "",
                    "一级类目": list.cate1 || "",
                    "二级类目": list.cate2 || "",
                    "三级类目": list.cate3 || "",
                }
            });
            const time = FormatTime("YYYYMMDDHHmmss");
            ExportToExcel("qcLink_" + time + ".xlsx").play(excelData, "数据");
        }
        let isRun = false;
        async function openUrl(children) {
            if (isRun) {
                return MessageTip("❌", "正在处理...", 3);
            }
            isRun = true;
            const clickName = children.target.innerText;
            const selectArr = document.querySelectorAll("#batch-url #query select");
            const queryConfig = {};
            for (const list of selectArr) {
                queryConfig[list.id] = list.value;
            }
            const param = document.querySelector("#batch-url #query #url-param");
            queryConfig.openType = param.value;
            const textArr = urlAllArr();
            // 判断启动器
            if (queryConfig.source === "链接") {
                isRun = false;
                if (clickName === "全部打开") {
                    _open(textArr, queryConfig.openType);
                } else {
                    linkConvert();
                }
            }
            if (queryConfig.source === "内容ID") {
                if (isLink()) {
                    return false;
                }
                if (clickName === "下载数据") {
                    isRun = false;
                    if (batchConfig.expand) {
                        return MessageTip("❌", "“膨胀搜索”不支持下载数据", 3);
                    }
                }
                batchFor({
                    queryConfig,
                    textArr: textArr,
                    timeText: "qc_assign",
                    urlRoute: "/api/biz/review/qc/list?",
                    callback: ({ all, single, taskList = [] }) => {
                        isRun = false;
                        batchConfig.taskList = taskList;
                        if (single.length === 0 && all.length === 0) {
                            return MessageTip("❌", "无数据", 3);
                        }
                        if (clickName === "全部打开") {
                            _open(single, queryConfig.openType);
                        }
                        if (clickName === "转链接") {
                            urlAllArr(all.join("\n"));
                        }
                        if (clickName === "下载数据") {
                            downloadData(taskList);
                        }
                    },
                    markUrlBack: (task) => toRecheckRul(task)
                });
            }
            if (queryConfig.source === "内容ID（任务池）") {
                if (isLink()) {
                    return false;
                }
                if (queryConfig.plate === "自动") {
                    isRun = false;
                    return outInfo("板块不能为自动");
                }
                if (clickName === "下载数据") {
                    isRun = false;
                    if (batchConfig.expand) {
                        return MessageTip("❌", "“膨胀搜索”不支持下载数据", 3);
                    }
                }
                batchFor({
                    queryConfig,
                    textArr: textArr,
                    timeText: "publish",
                    urlRoute: "/api/biz/audit/machine/querylist?type=0&",
                    callback: ({ all, single, taskList = [] }) => {
                        isRun = false;
                        batchConfig.taskList = taskList;
                        if (single.length === 0 && all.length === 0) {
                            return MessageTip("❌", "无数据", 3);
                        }
                        if (clickName === "全部打开") {
                            _open(single, queryConfig.openType);
                        }
                        if (clickName === "转链接") {
                            urlAllArr(all.join("\n"));
                        }
                        if (clickName === "下载数据") {
                            downloadData(taskList);
                        }
                    },
                    markUrlBack: (task) => toTaskPoolRul(task)
                });
            }
            // 是否为链接
            function isLink() {
                if (/([\w-]+\.)+[\w-]+(\/[\w\-.\/?%&=]*)?/.test(textArr[0])) {
                    if (clickName === "全部打开") {
                        _open(textArr, queryConfig.openType);
                    }
                    if (clickName === "转链接") {
                        linkConvert();
                    }
                    isRun = false;
                    return true;
                }
            }
            // 链接转换
            function linkConvert() {
                if (textArr.length === 0) {
                    isRun = false;
                    return MessageTip("❌", "无数据", 3);
                }
                const newText = [];
                for (const text of textArr) {
                    const task = {
                        taskId: "taskId",
                        contentTypeId: "contentType",
                        bizLineId: "bizLine",
                        contentId: "contentId",
                        subLineId: "subLine",
                        contentSourceId: "contentSource"
                    };
                    for (const key in task) {
                        if (Object.hasOwnProperty.call(task, key)) {
                            task[key] = GetQueryString(task[key], text);
                        }
                    }
                    if (text.includes("TaskPoolDetail")) {
                        newText.push(toRecheckRul(task));
                    } else if (text.includes("Recheck/Detail")) {
                        newText.push(toTaskPoolRul(task));
                    } else {
                        outInfo("非链接：" + text);
                    }
                }
                isRun = false;
                if (newText.length > 0) {
                    urlAllArr(newText.join("\n"));
                    outInfo("链接转换完成");
                } else {
                    outInfo("无效链接，未更改");
                }
            }
            // 转为质检链接
            function toRecheckRul(params) {
                const optType = queryConfig.openType || 3;
                const { taskId, contentTypeId, bizLineId, contentId, subLineId, contentSourceId } = params;
                const urlParams = `taskId=${taskId}&contentType=${contentTypeId}&bizLine=${bizLineId}&optType=${optType}&contentId=${contentId}&subLine=${subLineId}&contentSource=${contentSourceId}&manualState=undefined`;
                return "https://ver.jd.com/Recheck/Detail?" + urlParams;
            }
            // 转为任务池链接
            function toTaskPoolRul(params) {
                const { taskId, contentTypeId, bizLineId, contentId, subLineId, contentSourceId } = params;
                const urlParams = `bizLine=${bizLineId}&subLine=${subLineId}&contentSource=${contentSourceId}&contentType=${contentTypeId}&taskId=${taskId}&contentId=${contentId}&liveId=`;
                return "https://ver.jd.com/TaskPoolDetail?" + urlParams;
            }
            // 打开数据
            function _open(urlArr, openType) {
                const overUrl = [];
                for (let i = 0; i < urlArr.length; i++) {
                    let url = urlArr[i];
                    if (!!openType) {
                        url = url.replace(/optType=[0-9]/g, `optType=${openType}`);
                    }
                    if (/([\w-]+\.)+[\w-]+(\/[\w\-.\/?%&=]*)?/.test(url)) {
                        try {
                            if (url.substring(0, 4) === "http") {
                                window.open(url, "", "", true);
                            } else {
                                window.open("//" + url, "", "", true);
                            }
                            overUrl.push(url);
                        } catch (error) {
                            console.error(error);
                            outInfo(`第${i + 1}条报错：${url}`);
                        }
                    } else {
                        outInfo(`第${i + 1}条无效：${url}`);
                    }
                }
                outInfo(`已打开${overUrl.length}条`);
            }
        }
        // 循环搜索
        function batchFor(params) {
            const { queryConfig, textArr, timeText, urlRoute, callback, markUrlBack } = params;
            let isOK = 0;
            const urlArr = {
                all: [],
                single: [],
                taskList: []
            };
            if (textArr.length === 0) {
                isRun = false;
                return false;
            }
            const runInfo = outInfo("查询中...", true);
            const plate = plateBatch.find((list) => list.plate === queryConfig.plate);
            const getTaskBack = QueueTaskRunner(10);
            for (let i = 0; i < textArr.length; i++) {
                const list = textArr[i];
                const textId = list.match(/\d{5,}/g);
                if (textId && /^[0-9]*$/.test(textId[0])) {
                    const getUrl = markGetUrl({ queryConfig, plate, textId: textId[0] }).replace(/is_time/g, timeText);
                    getTaskBack.push(() => queryTask(urlRoute + getUrl, textId[0], markUrlBack)).then((taskData) => {
                        if (taskData && taskData.length > 0) {
                            if (taskData.length === 1) {
                                urlArr.single[i] = taskData[0].url;
                            }
                            urlArr.all[i] = [];
                            urlArr.taskList[i] = [];
                            for (let index = 0; index < taskData.length; index++) {
                                urlArr.all[i].push(taskData[index].url);
                                urlArr.taskList[i].push({
                                    url: taskData[index].url,
                                    ...taskData[index].task
                                });
                            }
                        }
                        addRun();
                    });
                } else {
                    addRun();
                    outInfo(`第${i + 1}未发现内容ID`);
                }
            }
            function addRun() {
                isOK++;
                const percentage = isOK / textArr.length * 100;
                runInfo(`完成：${isOK}/${textArr.length} = ${percentage.toFixed(2)}%`);
                if (isOK === textArr.length) {
                    RunFrame(() => {
                        urlArr.all = urlArr.all.flat();
                        urlArr.taskList = urlArr.taskList.flat();
                        callback(urlArr);
                    });
                }
            }
        }
        // 创建请求链接
        function markGetUrl(params) {
            const { queryConfig, plate, textId } = params;
            const content_id = `content_id=${textId}`;
            const biz_line = `biz_line=${plate.biz_line}`;
            const content_source = `content_source=${plate.content_source}`;
            const content_type = `content_type=${plate.content_type}`;
            const time_start = `is_time_start=${queryConfig.time}-01-01 00:00:00`;
            const time_end = `is_time_end=${queryConfig.time}-12-31 23:59:59`;
            return `${content_id}&${biz_line}&${content_source}&${content_type}&${time_start}&${time_end}`;
        }
        // 搜索数据
        async function queryTask(getUrl, textId, markUrlBack) {
            return HTTP_XHR({ method: "GET", url: getUrl }).then((xhr) => {
                const responseText = JSON.parse(xhr.responseText);
                if (responseText.msg !== "success") {
                    outInfo(responseText.msg);
                    return false;
                }
                const taskList = responseText.content.taskList || responseText.content.auditList;
                if (!taskList) { throw "空列表" };
                const taskUrlArr = [];
                for (const task of taskList) {
                    taskUrlArr.push({
                        id: task.contentId,
                        url: markUrlBack(task),
                        name: `${task.bizLine}-${task.contentSource}`,
                        task: task
                    });
                }
                if (taskUrlArr.length === 0) {
                    outInfo(`${textId}下没有数据`);
                    return false;
                }
                if (taskUrlArr.length > 1) {
                    const domUrlArr = [];
                    for (const urlInfo of taskUrlArr) {
                        domUrlArr.push(`<a class="base_jd href_zero" target="_blank" href="${urlInfo.url}">${urlInfo.name}</a>`);
                    }
                    outInfo(`${textId}有多个结果：${domUrlArr.join("、")}`);
                }
                return taskUrlArr;
            }).then((taskUrlArr) => {
                if (!batchConfig.expand || !taskUrlArr) {
                    return taskUrlArr;
                }
                // 膨胀搜索
                return new Promise((resolve, reject) => {
                    const expandUrlArr = [];
                    const getTaskBack = QueueTaskRunner(10);
                    getTaskBack.push(() => getLog(taskUrlArr[0]));
                    getTaskBack.endBack(() => resolve(expandUrlArr));
                    // 获取日志
                    async function getLog(urlList, page_num = 1, page_size = 50) {
                        const bizLine = GetQueryString("bizLine", urlList.url);
                        return HTTP_XHR({
                            method: "GET",
                            url: `/api/biz/audit/machine/log?page_num=${page_num}&page_size=${page_size}&content_id=${urlList.id}&bizLineId=${bizLine}`
                        }).then((xhr) => {
                            const { logList, total } = JSON.parse(xhr.responseText).content;
                            for (const list of logList) {
                                const newUrl = UpdateUrlParam(urlList.url, { taskId: list.taskId });
                                const isHave = expandUrlArr.find(item => item.url === newUrl);
                                if (!isHave && urlList.url === newUrl) {
                                    expandUrlArr.push({ ...urlList, url: newUrl });
                                } else if (!isHave) {
                                    expandUrlArr.push({ ...urlList, task: { taskId: list.taskId, contentId: list.taskId }, url: newUrl });
                                }
                            }
                            if (total > page_num * page_size) {
                                getTaskBack.push(() => getLog(urlList, page_num + 1));
                            }
                        })
                    }
                })
            }).catch((error) => {
                console.error(error);
                outInfo("获取数据失败");
                return false;
            });
        }
        function outInfo(msg, isTop) {
            const info = document.querySelector("#batch-url #info-body");
            const span = document.createElement("span");
            if (isTop) { span.id = "info-top" };
            span.innerHTML = msg + "<br>";
            info.appendChild(span);
            info.scrollTop = info.scrollHeight;
            return (newMsg) => {
                span.innerHTML = newMsg + "<br>";
            };
        }
    }

    // 用户信息
    function queryUserInfo(work) {
        const children = document.querySelector("#root");
        const userInfo = children.querySelector("#user-info");
        if (!!userInfo) {
            userInfo.style.display = "";
            return false;
        }
        AddFloatWindow({
            addNode: children,
            otherData: {
                id: "user-info",
            },
            addData: [{
                name: "div",
                id: "title",
                innerHTML: "账号信息"
            }, {
                name: "hr",
            }, {
                name: "div",
                id: "erp-main",
                add: [{
                    name: "div",
                    id: "erp-info"
                }, {
                    name: "div",
                    id: "erp-query",
                    add: [{
                        name: "button",
                        id: "rest",
                        className: "gm-button",
                        innerHTML: "刷新",
                        click: getUserInfoERP
                    }, {
                        name: "button",
                        id: "copy",
                        className: "gm-button",
                        innerHTML: "复制信息",
                        function: getUserInfoERP,
                        click: copyUserInfo
                    }]
                }]
            }]
        }).then((workWindow) => {
            DisplayWindow([workWindow, work.target], workWindow);
        })
        function getUserInfoERP() {
            if (config.getUserInfoERP) {
                return MessageTip("❌", "数据查询中...", 3);
            }
            config.getUserInfoERP = true;
            const info = document.querySelector("#user-info #erp-info");
            info.innerHTML = "<b>数据查询中...</b>";
            GM_XHR(
                {
                    method: "GET",
                    url: "http://jasc.jd.com/jasc/getUserInfo",
                    timeout: 5000
                }, (xhr) => {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        getVPN(JSON.parse(xhr.response));
                    } else {
                        config.getUserInfoERP = false;
                        info.innerHTML = "<b>数据获取失败！</b><br>请检查网络连接！<br>本操作需要连接VPN！";
                    }
                }
            )
            function getVPN(e) {
                info.innerHTML = `<b>ERP：</b>${e.body.erp}<br>`;
                info.innerHTML += `<b>账号名称：</b>${e.body.name}<br>`;
                info.innerHTML += `<b>绑定手机：</b>${e.body.mobile}<br>`;
                info.innerHTML += `<b>账号邮箱：</b>${e.body.mailbox}<br>`;
                info.innerHTML += `<b>ERP到期时间：</b>${(e.body.erpExpiryDate).replace(/-/g, "/")}<br>`;
                info.innerHTML += "<b>VPN到期时间：</b>";
                // const url = `https://jdit.jd.com/api/vpnNetwork/GetUserVpn?ERP=${e.body.erp}&Email=${e.body.mailbox}`;
                const url = "https://eit-api.jd.com/vpnApply/getUserVpnInfo";
                GM_XHR({
                    method: "GET",
                    url: url,
                    timeout: 5000
                }).then((xhr) => {
                    const { endTime, status, message } = JSON.parse(xhr.response);
                    const nowTime = new Date().getTime();
                    const vpnTime = new Date(endTime).getTime();
                    if (status === 200 && !isNaN(vpnTime) && vpnTime - nowTime > 0) {
                        if (vpnTime - nowTime < 1000 * 60 * 60 * 24 * 30) {
                            info.innerHTML += `<span style="color: #ff0000;">${FormatTime("YYYY/MM/DD", endTime)}</span>`;
                        } else {
                            info.innerHTML += FormatTime("YYYY/MM/DD", endTime);
                        }
                    } else {
                        info.innerHTML += `<a onclick="window.open('${url}', '', '', true)">${message || "未知错误"}</a>`;
                    }
                }).catch((error) => {
                    console.error(error);
                    info.innerHTML += `<a onclick="window.open('${url}', '', '', true)">获取失败</a>`;
                }).finally(() => {
                    config.getUserInfoERP = false;
                })
            }
        }
        function copyUserInfo() {
            const info = document.querySelector("#user-info #erp-info").innerText;
            navigator.clipboard.writeText(info)
                .then(function () {
                    MessageTip("✔️", "已复制到剪贴板", 3);
                })
                .catch(function () {
                    MessageTip("❌", "复制失败", 3);
                });
        }
    }

    // 数据快查
    function queryFastData(work, params) {
        if (params && !(params instanceof Node)) {
            const { repair, source, urlData, xlsxData, isRun, fixedOrder } = params;
            urlData && (fastConfig.urlData = urlData);
            xlsxData && (fastConfig.xlsxData = xlsxData);
            repair && (fastConfig.repair = repair);
            source && (fastConfig.source = source);
            fixedOrder && (fastConfig.fixedOrder = fixedOrder);
            if (isRun) {
                RunFrame(() => fastConfig.isRun = new Date().getTime());
            }
        }
        const children = document.querySelector("#root");
        const userInfo = children.querySelector("#fast-query");
        if (!!userInfo) {
            userInfo.style.display = "";
            return false;
        }
        const queryDom = [{
            innerHTML: "来源",
            add: [{
                name: "select",
                id: "source",
                add: ["链接", "链接（任务池）"].map((list) => ({
                    name: "option",
                    innerHTML: list,
                })),
                function: (element) => {
                    ObjectProperty(fastConfig, "source", (params) => {
                        if (params.value) {
                            element.value = params.value;
                        }
                    })
                }
            }]
        }, {
            innerHTML: "修正参数",
            add: [{
                name: "div",
                style: "display: flex;",
                add: [Tooltip({
                    text: "修正链接参数为查询结果的参数",
                    node: [SwitchBox({
                        checked: fastConfig.repair,
                        function: (element) => {
                            ObjectProperty(fastConfig, "repair", (params) => {
                                if (params.value) {
                                    element.checked = params.value;
                                }
                            })
                            element.addEventListener("change", () => {
                                fastConfig.repair = element.checked;
                            })
                        }
                    })]
                })]
            }]
        }, {
            innerHTML: "固定顺序",
            add: [{
                name: "div",
                style: "display: flex;",
                add: [Tooltip({
                    text: "保持数据顺序不变，失败数据将保留空行",
                    node: [SwitchBox({
                        checked: fastConfig.fixedOrder,
                        function: (element) => {
                            ObjectProperty(fastConfig, "fixedOrder", (params) => {
                                if (params.value) {
                                    element.checked = params.value;
                                }
                            })
                            element.addEventListener("change", () => {
                                fastConfig.fixedOrder = element.checked;
                            })
                        }
                    })]
                })]
            }]
        }, {
            innerHTML: "数量",
            add: [{
                name: "span",
                innerHTML: 0,
                id: "url-number"
            }]
        }]
        AddFloatWindow({
            addNode: children,
            otherData: {
                id: "fast-query",
            },
            addData: [{
                name: "div",
                id: "left",
                add: [{
                    name: "div",
                    id: "query",
                    add: queryDom.map((list) => {
                        return {
                            name: "div",
                            id: "query-list",
                            style: list.style || "",
                            innerHTML: list.innerHTML + "：",
                            add: list.add
                        }
                    })
                }, {
                    name: "div",
                    style: "height: 32px;text-align: center;display: flex;align-items: center;",
                    innerHTML: "如果需要导出标签<br>请使用“任务池”模式"
                }]
            }, {
                name: "div",
                id: "text",
                add: [{
                    name: "textarea",
                    placeholder: "输入素材链接，一行算一条数据",
                    onfocus: ({ target }) => { // 获得焦点
                        target.style.color = "#000000";
                    },
                    onblur: ({ target }) => { // 失去焦点
                        target.style.color = "";
                    },
                    function: (element) => {
                        const urlThrottle = ThrottleOver(urlAllArr, 200);
                        element.addEventListener("input", urlThrottle);
                        ObjectProperty(fastConfig, "urlData", (params) => {
                            urlAllArr(params.value || null);
                        })
                    }
                }, {
                    name: "div",
                    add: [{
                        name: "button",
                        className: "gm-button danger",
                        innerHTML: "清除内容",
                        click: () => {
                            urlAllArr("");
                            outInfo("清除内容");
                        }
                    }, {
                        name: "button",
                        className: "gm-button",
                        innerHTML: "开始查询",
                        click: queryUrl,
                        function: () => ObjectProperty(fastConfig, "isRun", (params) => {
                            if (params.value) {
                                queryUrl();
                            }
                        })
                    }]
                }]
            }, {
                name: "div",
                id: "info",
                add: [{
                    name: "div",
                    id: "info-main",
                    add: [{
                        name: "div",
                        id: "info-title",
                        add: [{
                            name: "span",
                            innerHTML: "操作信息："
                        }, {
                            name: "a",
                            innerHTML: "清空信息",
                            style: "user-select: none;",
                            click: () => {
                                const info = document.querySelector("#fast-query #info-body");
                                info.innerHTML = "";
                            }
                        }]
                    }, {
                        name: "div",
                        id: "info-body",
                    }]
                }]
            }]
        }).then((workWindow) => {
            DisplayWindow([workWindow, work && work.target], workWindow);
        })
        function urlAllArr(content = null) {
            const text = children.querySelector("#fast-query textarea");
            if (content !== null && typeof content === "string") {
                text.value = content;
            }
            const urlArr = text.value.split("\n").filter((item) => item !== "");
            const outNum = children.querySelector("#fast-query #url-number");
            outNum.innerHTML = urlArr.length;
            return urlArr;
        }
        function outInfo(msg, isTop) {
            const info = children.querySelector("#fast-query #info-body");
            const div = document.createElement("div");
            if (isTop) { div.id = "info-top" };
            div.innerHTML = msg;
            info.appendChild(div);
            info.scrollTop = info.scrollHeight;
            return (newMsg) => {
                div.innerHTML = newMsg;
            };
        }
        let isRun = false;
        async function queryUrl() {
            if (isRun) {
                return MessageTip("❌", "数据正在处理", 3);
            }
            const urlArr = urlAllArr();
            if (urlArr.length === 0) {
                return outInfo("请输入数据");
            }
            isRun = true;
            const selectArr = document.querySelectorAll("#fast-query #query select");
            const queryConfig = {};
            for (const list of selectArr) {
                queryConfig[list.id] = list.value;
            }
            if (queryConfig.source === "链接") {
                markData({ urlArr, optType: 3 });
            }
            if (queryConfig.source === "链接（任务池）") {
                markData({ urlArr, optType: 2 });
            }
        }
        async function getContent(params) {
            const { url, msg, field } = params;
            return HTTP_XHR({ method: "GET", url: url }).then((xhr) => {
                const responseText = xhr.responseText;
                const content = JSON.parse(responseText).content;
                return field ? content[field] : content;
            }).catch((error) => {
                console.error(error);
                isRun = false;
                outInfo(msg);
            });
        }
        async function markData(params) {
            const biz = await getContent({
                url: "/api/common/getLoginBizLineInfo",
                msg: "获取“查询列表”失败，请重试",
                field: "biz"
            })
            const category = await getContent({
                url: "/api/biz/audit/manual/category",
                msg: "获取“三级类目”失败，请重试"
            })
            if (biz && category.length > 0) {
                getData({ ...params, biz, category });
            } else {
                isRun = false;
                outInfo("关键参数缺失");
            }
        }
        function getData(params) {
            const { biz, category, optType, urlArr } = params;
            let isNull = true;
            const overData = [];
            const overOldData = [];
            let overIsOldData = false;
            const overDom = outInfo("查询中...", true);
            const getTaskBack = QueueTaskRunner(10);
            let index = 0;
            for (let i = 0; i < urlArr.length; i++) {
                let url = urlArr[i];
                const lineMap = {
                    32: 7
                };
                const typeId = lineMap[GetQueryString("bizLine", url)] || 0;
                const taskId = GetQueryString("taskId", url);
                const contentId = GetQueryString("contentId", url);
                if (/([\w-]+\.)+[\w-]+(\/[\w\-.\/?%&=]*)?/.test(url) && taskId && contentId) {
                    getTaskBack.push(() => HTTP_XHR({
                        method: "GET",
                        url: `/api/biz/task/detail?task_id=${taskId}&opt_type=${optType}&content_id=${contentId}&type=${typeId}`
                    })).then((xhr) => {
                        const responseText = xhr.responseText;
                        const content = JSON.parse(responseText).content;
                        if (!content) {
                            if (fastConfig.fixedOrder) {
                                overData[i] = { "链接": url, "封面图": "" };
                                overOldData[i] = { "链接": url, "封面图": "" };
                            }
                            throw "空数据";
                        }
                        const { objData, oldData } = objExcel({ ...content, url: url }, biz, optType, category);
                        if (fastConfig.fixedOrder) {
                            overData[i] = objData;
                            overOldData[i] = oldData;
                        } else {
                            overData.push(objData);
                            overOldData.push(oldData);
                        }
                        isNull = false;
                        !overIsOldData && oldData["业务线"] && (overIsOldData = true);
                    }).catch((error) => {
                        console.error(error);
                        outInfo(`第${i + 1}条报错：${url}`);
                        isRun = false;
                    }).finally(() => {
                        schedule();
                    })
                } else {
                    schedule();
                    outInfo(`第${i + 1}条无效：${url}`);
                    isRun = false;
                }
                function schedule() {
                    index++;
                    const percentage = index / urlArr.length * 100;
                    overDom(`进度：${index}/${urlArr.length} = ${percentage.toFixed(2)}%`);
                }
            }
            getTaskBack.endBack(() => {
                isRun = false;
                fastConfig.xlsxData = [];
                if (overData.length > 0 && !isNull) {
                    outInfo("导出数据");
                    const time = FormatTime("YYYYMMDDHHmmss");
                    const xlsxExport = [{
                        sheetData: overData
                    }];
                    overIsOldData && xlsxExport.push({
                        sheetData: overOldData,
                        sheetName: "原始数据"
                    })
                    setTimeout(() => {
                        ExportToExcel("qcFast_" + time + ".xlsx").sheet(xlsxExport)
                    }, 100)
                } else {
                    return outInfo("导出列表为空");
                }
            })
        }
        function reduceTime(list, subType) {
            const listObj = list.reduce((latest, current) => {
                if (current.subType === subType && (!latest.updateTime || new Date(current.updateTime) > new Date(latest.updateTime))) {
                    return current;
                } else {
                    return latest;
                }
            }, {});
            const objData = listObj.value && JSON.parse(listObj.value) || {};
            !objData.qualityTagList && (objData.qualityTagList = []);
            !objData.classifyTagList && (objData.classifyTagList = []);
            return objData;
        }
        function objExcel(list, biz, optType, category) {
            const { auditInfoList, machineAuditInfo, fourKey, qualityDetailList, topicInfo } = list;
            const Audit = auditInfoList && auditInfoList.find(item => item.auditType === 0) || {};
            const Quality = auditInfoList && auditInfoList.find(item => [1, 3].includes(item.auditType)) || {};
            // 机审结果
            const machineAuditList = machineAuditInfo && machineAuditInfo.machineAuditList || [];
            const MachineList = [];
            machineAuditList.filter(item => item.auditResult !== 1).forEach(({ auditItem, reason }) => {
                MachineList.push(`${auditItem}：${reason.replace(/\n/g, "").replace(/\t/g, " ")}`);
            });
            // const MachineList = {};
            // machineAuditList.filter(item => item.auditResult !== 1)
            //     .sort((a, b) => a.auditResult - b.auditResult)
            //     .forEach(({ auditResult, auditItem, reason }) => {
            //         const nameObj = {
            //             2: "驳回",
            //             3: "存疑",
            //             5: "疑似"
            //         };
            //         const machineName = nameObj[auditResult] || auditResult;
            //         const machineData = MachineList[machineName] || (MachineList[machineName] = []);
            //         machineData.push(`${auditItem}：${reason.replace(/\n/g, "").replace(/\t/g, " ")}`);
            //     });
            // 质量机审结果
            const detailList = qualityDetailList && qualityDetailList.filter(item => item.qualityState !== "PASS").map(({ name, result }) => (
                `${name}：${result}`
            )) || [];
            const AuditInfoObj = resoluData(Audit);
            const QualityInfoObj = resoluData(Quality);
            function resoluData(params) {
                const qcType = {
                    text: "文本",
                    picture: "图片",
                    video: "视频",
                    radio: "音频",
                    sku: "SKU",
                    carInfo: "CARINFO",
                    pair: "穿搭",
                    custom: "订制",
                    other: "整体",
                    ad: "广告",
                };
                const rejectArr = {
                    returnType: "通过",
                    returnInfo: [],
                    rejectDesc: [],
                    attachDesc: params.attachDesc
                };
                if (params.auditType === undefined) {
                    rejectArr.returnType = "未知";
                }
                const rejectListArr = params.rejectList || [];
                for (const rejectList of rejectListArr) {
                    addInfo("整体", rejectList.reason, params.rejectDesc);
                }
                const AuditList = params.manualAuditList || [];
                for (const item of AuditList) {
                    for (const rejectList of item.rejectList) {
                        addInfo(qcType[item.elementType], rejectList.reason, item.rejectDesc);
                    }
                }
                function addInfo(typeName, reason, rejectDesc) {
                    rejectArr.returnInfo.push(`${typeName}：${reason}`);
                    if (rejectDesc) {
                        rejectArr.rejectDesc.push(`${typeName}：${rejectDesc}`);
                    }
                }
                if (rejectArr.returnInfo.length > 0) {
                    rejectArr.returnType = "驳回";
                }
                return rejectArr;
            }
            const talentText = ["无等级", "G1萌新", "G2进阶", "G3新秀", "G4资深", "G5精英", "G6大咖", "G7知名"];
            // 获取显示状态
            const showStateText = showState[optType === 3 ? "review" : "taskpool"].find(item => item.value == list.showState) || {};
            // 获取SKU
            const allSku = list.auditList.filter(item => item.elementType === "sku") || [];
            const allSkuParse = allSku.map((item) => item.value && JSON.parse(item.value) || {});
            const allSkuOut = allSkuParse.map((item) => ({
                title: item.title && item.title.replace(/\n/g, "").replace(/\t/g, " "),
                id: item.id,
                img: item.pitureurl
            }));
            // 获取类目
            const { firstCateCd } = allSkuParse[0] || {};
            const customInfo = list.auditList.find(item => item.elementType === "custom") || {};
            const { categoryOneId } = customInfo.value && JSON.parse(customInfo.value) || {};
            const { categoryName } = category.find(item => item.categoryId == (categoryOneId || firstCateCd)) || {};
            // 获取视频
            const videoInfo = list.auditList.find(item => item.elementType === "video") || {};
            const videoList = videoInfo.value && JSON.parse(videoInfo.value) || {};
            // 基本信息
            const bizLine = biz.find(obj => obj.value === list.fourKey.bizLineId);
            const subLine = bizLine.sub_line.find(obj => obj.value === list.fourKey.subLineId);
            const contentSource = bizLine.content_source.find(obj => obj.value === list.fourKey.contentSourceId);
            const contentType = bizLine.content_type.find(obj => obj.value === list.fourKey.contentTypeId);
            const { labelInfo } = list.videoLabels && list.videoLabels.find(obj => obj.labelInfo && obj.labelInfo.length > 0) || {};
            // 属性标签
            const qcClassifyList = reduceTime(list.auditList, "qcLabel");
            const qcClassifySpace = readLabel({ tagList: qcClassifyList.classifyTagList, tagTreeResult: qcClassifyList.classifyTagTreeResult });
            const classifyList = reduceTime(list.auditList, "label");
            const classifySpace = readLabel({ tagList: classifyList.classifyTagList, tagTreeResult: classifyList.classifyTagTreeResult });
            // 打标标签
            const qcLabelList = reduceTime(list.auditList, "qcLabel").qualityTagList.map((item) => item.tagName);
            const labelList = reduceTime(list.auditList, "label").qualityTagList.map((item) => item.tagName);
            // 读取标签分类
            function readLabel({ tagList = [], tagTreeResult = { children: [] }, findLabel = [] }) {
                const labelData = {};
                tagList.forEach(({ tagName }) => {
                    tagTreeResult.children.find((item) => {
                        if (!findLabel || findLabel.length === 0 || findLabel.includes(item.name)) {
                            const findLabel = item.children.find(({ contentTagBdsResultList }) => {
                                return contentTagBdsResultList.find((list) => list.name === tagName);
                            })
                            if (findLabel) {
                                !labelData[item.name] && (labelData[item.name] = []);
                                labelData[item.name].push(tagName);
                            }
                        }
                    })
                })
                return labelData;
            }
            // 修正链接参数
            if (fastConfig.repair) {
                list.url = UpdateUrlParam(list.url, {
                    bizLine: fourKey.bizLineId,
                    contentSource: fourKey.contentSourceId,
                    contentType: fourKey.contentTypeId,
                    subLine: fourKey.subLineId
                })
            }
            // 质量结果
            const quality = {
                1: "通过",
                3: "低质",
            }
            const [qualityManual, qcQualityManual] = [
                quality[list.qualityManualState] || list.qualityManualState,
                quality[list.qcQualityManualState] || list.qcQualityManualState
            ];
            // 添加数据
            const objData = {
                "链接": list.url,
                "封面图": list.converUrl && list.converUrl[0] && list.converUrl[0].url || "",
                "视频链接": videoList.url,
                "视频vid": videoList.id,
                "任务id": list.taskId,
                "内容id": list.contentId,
                "业务线": bizLine.label,
                "子渠道": subLine.label,
                "内容来源": contentSource.label,
                "内容样式": contentType.label,
                "标题": list.mainTitle || "",
                "作者": list.author || "未知",
                "作者PIN": list.authorPin || "未知",
                "达人等级": talentText[list.talentLevel] || "未知等级",
                "类目": categoryName || "未知",
                "显示状态": showStateText.text || "未知",
                "SKU数量": allSkuOut.length,
                "SKU信息": JSON.stringify(allSkuOut),
                "话题ID": topicInfo && topicInfo.topicId,
                "话题名称": topicInfo && topicInfo.topicName,
                "话题要求": topicInfo && topicInfo.topicRequirement,
                "机审结果": JSON.stringify(MachineList),
                "质量机审": JSON.stringify(detailList),
                "抄袭数量": labelInfo && labelInfo.length || "",
                "抄袭列表": JSON.stringify(labelInfo),
                "质检时间": Quality.auditTime || "",
                "质检人员（基础）": Quality.auditPerson || "",
                "质检状态": QualityInfoObj.returnType,
                "质检质量": qcQualityManual || "",
                "质检属性标签": JSON.stringify(qcClassifySpace),
                "质检质量标签": JSON.stringify(qcLabelList),
                "质检结果": JSON.stringify(QualityInfoObj.returnInfo),
                "质检描述": JSON.stringify(QualityInfoObj.rejectDesc),
                "送审时间": list.submitTime || "",
                "审核时间": Audit.auditTime || "",
                "审核人员（基础）": Audit.auditPerson || "",
                "审核状态": AuditInfoObj.returnType,
                "审核质量": qualityManual || "",
                "审核属性标签": JSON.stringify(classifySpace),
                "审核质量标签": JSON.stringify(labelList),
                "审核结果": JSON.stringify(AuditInfoObj.returnInfo),
                "审核描述": JSON.stringify(AuditInfoObj.rejectDesc),
                "申诉理由": AuditInfoObj.attachDesc || "",
            };
            const xlsxDefault = fastConfig.xlsxData.find((item) => item["任务id"] === list.taskId && item["内容id"] === list.contentId) || {};
            return {
                objData, oldData: {
                    "任务id": list.taskId,
                    "内容id": list.contentId,
                    ...xlsxDefault
                }
            }
        }
    }

    // 版本控制器
    function versionPlug(children) {
        const gmConfig = GET_DATA("GM_CONFIG", {});
        const plugName = GM_info.script.name;
        const version = GM_info.script.version;
        const plugId = "454039";
        const getMetaUrl = `https://www.cdzero.cn/greasyfork/${plugId}/${plugName}.meta.js`;
        const plugUpDateUrl = `https://www.cdzero.cn/greasyfork/${plugId}/${plugName}.user.js`;
        const plugVersionsUrl = `https://www.cdzero.cn/greasyfork/versions/${plugId}-${plugName}`;
        AddDOM({
            addNode: children,
            addData: [{
                name: "div",
                id: "MyPlugVer",
                add: [{
                    name: "span",
                    innerHTML: `V${version}`
                }, {
                    name: "span",
                    id: "click",
                    innerHTML: "初始化",
                    function: (element) => {
                        clickPlug(element);
                    },
                    click: (e) => {
                        clickPlug(e.target, true);
                    }
                }, {
                    name: "a",
                    href: plugVersionsUrl,
                    target: "_blank",
                    innerHTML: "版本信息"
                }]
            }]
        })
        let loading = null;
        document.upDatePlug = () => {
            if (!!loading) {
                return MessageTip("❌", "新版插件下载中，请稍后...", 3);
            }
            const toTime = (new Date()).getTime();
            loading = window.open(plugUpDateUrl + "?time=" + toTime, "", "", true);
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible") {
                    location.reload();
                }
            })
        }
        function clickPlug(element, click) {
            if (element.innerText === "有更新") {
                return document.upDatePlug();
            }
            if (element.innerText === "检测中") {
                return MessageTip("❌", "正在检测中，请稍后...", 3);
            }
            element.style = "color: red;";
            element.innerText = "检测中";
            return updatesPlug(element, click);
        }
        function checkPlug(element, obj, click) {
            if (!obj) {
                isNew();
                return MessageTip("❌", `${plugName}检测更新失败！`, 3);
            }
            const oldVer = Number(version.replace(/[\s.]+/g, ""));
            const newVer = Number(obj.plugver.replace(/[\s.]+/g, ""));
            if (!!obj.plugver && newVer > oldVer) {
                isUpdata();
                MessageTip("❌", `${plugName}发现新的版本：${obj.plugver} <a onclick="document.upDatePlug();">更新助手</a>`, 6);
            } else if (!!obj.plugver) {
                isNew();
                !!click && MessageTip("✔️", `${plugName}已经是最新版本！`, 3);
            }
            function isNew() {
                element.style = "";
                element.innerText = "最新版";
            }
            function isUpdata() {
                element.style = "color: red;";
                element.innerText = "有更新";
            }
        }
        function updatesPlug(element, click) {
            const toTime = (new Date()).getTime();
            if (!gmConfig.plugver || toTime - gmConfig.plugtime >= 1000 * 60 * 60 * 12 || !!click) {
                GM_XHR({
                    method: "GET",
                    url: getMetaUrl + "?time=" + toTime,
                    timeout: 10000
                }).then((xhr) => {
                    const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                    const newVer = regex.exec(xhr.responseText)[1];
                    gmConfig.plugtime = toTime;
                    gmConfig.plugver = newVer;
                    checkPlug(element, gmConfig, true);
                }).catch(() => {
                    checkPlug(element, null, true);
                }).finally(() => {
                    SET_DATA("GM_CONFIG", gmConfig);
                })
            } else {
                checkPlug(element, gmConfig);
            }
        }
    }
}
function CSS_homePage() {
    const { blackTimeIco, whiteTimeIco } = Plug_ICO();
    // 量级查询样式
    GM_addStyle(`
        #jd-board-main {
            position: absolute;
            bottom: 0;
            width: 100%;
            z-index: 15;
        }
        #jd-board {
            width: 100%;
            background: #eef0f3;
            border-radius: 10px 10px 0 0;
            overflow: hidden;
            transition: height 0.3s ease;
        }
        #jd-board div,
        #jd-board span,
        #jd-board th,
        #jd-board td {
            transition: ease-in 0.2s;
        }
        #jd-board #title {
            text-align: center;
            font-weight: bold;
            padding: 2px 0;
        }
        #jd-board #title #tip,
        #jd-board #title #menu {
            padding: 0 0.4rem;
            border-radius: 4px;
            color: #2090ff;
            cursor: pointer;
            user-select: none;
        }
        #jd-board #title #tip:hover,
        #jd-board #title #menu:hover {
            background: #ff0000;
            color: #ffffff;
        }
        #jd-board table {
            border: 0.1px solid #000000;
            width: 100%;
            background: #ffffff;
        }
        #jd-board table th,
        #jd-board table td {
            text-align: center;
        }
        #jd-board table th {
            font-weight: bold;
        }
        #jd-board #query div {
            display: flex;
            justify-content: space-between;
            padding-bottom: 2px;
        }
        #jd-board #query input {
            width: 55%;
            border: 1px solid #767676;
            border-radius: 3px;
            outline: none;
            font-size: 14px;
        }
        #jd-board #query input:hover {
            border: 1px solid #40a9ff;
        }
        #jd-board #query input:focus-visible {
            border: 1px solid #ff0000;
        }
        #jd-board #query input::placeholder {
            color: rgba(153,153,153,0.5);
        }

        /*表格样式*/
        #jd-board th {
            background: #6bbbff;
            border: 0.1px solid #000000;
            height: 25px;
            color: rgba(0,0,0,0.9);
            font-size: 14.5px;
            font-family: "微软雅黑";
        }
        #jd-board td {
            border: 0.1px solid #000000;
            color: rgba(0,0,0,0.9);
            font-family: "微软雅黑";
            height: 21px;
            line-height: 20px;
        }
        #jd-board tr input {
            width: 97%;
            border: 0;
            text-align: center;
            background: rgba(0,0,0,0);
        }
        #jd-board tr input:focus-visible{
            outline: none;
        }
        #jd-board tr th:nth-child(1),
        #jd-board tr td:nth-child(1) {
            width: 47%;
        }
        #jd-board tr th:nth-child(2),
        #jd-board tr td:nth-child(2) {
            width: 30%;
        }
        #jd-board tr th:nth-child(3),
        #jd-board tr td:nth-child(4) {
            width: 23%;
        }

        /*tabs样式*/
        #jd-board #tabs {
            width: 100%;
            position: relative;
            white-space: nowrap;
            margin: 0.2em 0;
            font-size: 12px;
            color: rgba(0,0,0,0.85);
        }
        #jd-board #tabs .tabs-list {
            display: inline-block;
            border-radius: 3px;
            width: 25%;
            text-align: center;
            cursor: pointer;
            user-select: none;
        }
        #jd-board #tabs #active {
            background: #6bbbff;
        }
        #jd-board #tabs .tabs-list:hover {
            background: #ff0000;
            color: #ffffff;
        }
        #jd-board #tabs .rolling {
            top: 0;
            width: 0;
            z-index: 1;
            height: 18px;
            position: absolute;
            cursor: pointer;
            border-radius: 3px;
            user-select: none;
            display: flex;
            align-items: center;
            background-image: linear-gradient(to right, #bbbbbb 50%, rgba(0, 0, 0, 0) 100%);
        }
        #jd-board #tabs .rolling:hover {
            background-image: linear-gradient(to right, #ff0000 50%, rgba(0, 0, 0, 0) 100%);
        }
        #jd-board #tabs .rolling svg {
            height: 10px;
            fill: #ffffff;
        }

        /*表格Hover*/
        #jd-board table tr:nth-child(1) th:hover,
        #jd-board table tr td:nth-child(1):hover,
        #jd-board table tr th:nth-child(1):hover {
            cursor: pointer;
            color: #ffffff;
            background: #ff0000;
        }
        #jd-board table tr:nth-child(1) th:active,
        #jd-board table tr td:nth-child(1):active,
        #jd-board table tr th:nth-child(1):active {
            color: #ffffff;
            background: #d80000;
            transition: background ease-in 0s,color ease-in 0s;
        }

        /*按钮*/
        #jd-board button {
            padding: 0;
            min-width: 21%;
        }

        /*折叠按钮*/
        #jd-board-collapse {
            position: absolute;
            overflow: hidden;
            left: 50%;
            top: 0;
            width: 70px;
            height: 20px;
            cursor: pointer;
            user-select: none;
            text-align: center;
            background: rgba(0,0,0,0);
            transform: translate(-50%);
            border-radius: 0 0 6px 6px;
            transition: 0.3s;
            display: flex;
            justify-content: center;
            padding: 2px;
        }
        #jd-board-collapse.active {
            top: -20px;
            border-radius: 6px 6px 0 0;
        }
        #jd-board-collapse svg {
            fill: rgba(0,0,0,0);
            transform: rotate(270deg);
        }
        #jd-board-collapse.active svg {
            fill: #ffffff;
            transform: rotate(90deg);
        }
        #jd-board-collapse:hover svg {
            fill: #ffffff;
        }
        #jd-board-collapse:hover {
            background: #1890ff;
        }
        #jd-board-collapse:active {
            background: #096dd9;
            transition: all ease-in 0.1s;
        }
        #jd-board-collapse:active svg {
            fill: #ffffff;
        }

        /*date时间输入框样式*/
        #jd-board #query input::-webkit-datetime-edit-year-field,
        #jd-board #query input::-webkit-datetime-edit-month-field,
        #jd-board #query input::-webkit-datetime-edit-day-field {
            cursor: pointer;
            border-radius: 3px;
            transition: background-color ease-in 0.2s, color ease-in 0.2s;
        }
        #jd-board #query input::-webkit-datetime-edit-year-field:hover,
        #jd-board #query input::-webkit-datetime-edit-month-field:hover,
        #jd-board #query input::-webkit-datetime-edit-day-field:hover{
            color: #ffffff;
            background-color: #faad14;
        }
        #jd-board #query input::-webkit-calendar-picker-indicator {
            cursor: pointer;
            width: 14px;
            height: 14px;
            margin-right: 2px;
            border-radius: 3px;
            transition: background-color ease-in 0.2s;
            background-image: url('${blackTimeIco}');
        }
        #jd-board #query input::-webkit-calendar-picker-indicator:hover {
            background-color: #faad14;
            background-image: url('${whiteTimeIco}');
        }

        /*搜索按钮*/
        .push-search {
            z-index: 11;
            user-select: none;
            position: absolute;
            left: -50px;
            cursor: pointer;
            overflow: hidden;
            transition: top 0.1s, left 0.25s cubic-bezier(1, 0, 0, 1), background 0.25s;
            padding: 0 5px;
            color: #ffffff;
            background: rgba(150,150,150,0.5);
            border-radius: 0 4px 4px 0;
        }
        .push-search:hover {
            left: 200px !important;
            background: #49adff;
        }
    `)
    // 批量工具
    GM_addStyle(`
        .gm-float-window {
            position: absolute;
            background: #fafafa;
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 1px 6px rgb(0,0,0,0.5);
            bottom: 10px;
            left: 10px;
            z-index: 220;
        }
        #gm-float-move-bar {
            position: absolute;
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 15%;
            min-width: 60px;
            max-width: 90px;
            height: 7px;
            padding: 0 !important;
            border-radius: 9px;
            background: #cccccc;
            transition: ease-in 0.2s;
            user-select: none;
            cursor: grab;
        }
        #gm-float-move-bar:hover {
            background: #aaaaaa;
        }
        #gm-float-move-bar:active {
            cursor: grabbing;
            background: #888888;
            transition: all ease-in 0.1s;
        }
        #board-menu-list {
            display: none;
            top: 22px;
            left: 18px;
            z-index: 16;
            position: absolute;
            background: #ffffff;
            color: rgba(0,0,0,.65);
            padding: 3px 0;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(0,0,0,.5);
        }
        #board-menu-list div {
            padding: 2px 10px;
            cursor: pointer;
        }
        #board-menu-list div:hover{
            background: #e6f7ff;
            color: #1890ff;
        }

        /*批量窗口*/
        #fast-query,
        #batch-url {
            height: 580px;
            min-height: 300px;
            max-height: 80%;
            display: flex;
        }
        #fast-query>*,
        #batch-url>*{
            padding: 5px;
        }
        .gm-float-window #left {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }
        .gm-float-window #query {
            width: 180px;
            position: relative;
        }
        .gm-float-window #query>*{
            margin-bottom: 10px;
        }
        .gm-float-window #query-list>*{
            width: 100%;
        }
        .gm-float-window #query-list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: bold;
            height: 33px;
            white-space: nowrap;
        }
        .gm-float-window #query-list select {
            padding: 5px;
            cursor: pointer;
        }
        .gm-float-window #query-list input {
            padding: 5px 9px;
        }
        .gm-float-window #query-list select,
        .gm-float-window #query-list input {
            outline: none;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        /*内容框*/
        .gm-float-window #text {
            width: 550px;
            display: flex;
            flex-direction: column;
        }
        .gm-float-window #text textarea {
            height: 100%;
            width: 100%;
            padding: 2px;
            outline: none;
            border-radius: 5px;
            resize: none;
            border: 1px solid #ccc;
        }
        .gm-float-window #text div {
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
        }

        /*消息框*/
        .gm-float-window #info {
            width: 220px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .gm-float-window #info-main {
            width: 100%;
            height: 100%;
            padding: 0 2px 2px 2px;
            color: #00acac;
            background-color: #004b58;
            overflow-y: auto;
            outline: none;
            border-radius: 5px;
            resize: none;
            border: 1px solid #007e77;
            word-wrap: break-word;
            display: flex;
            flex-direction: column;
        }
        .gm-float-window #info-body {
            position: relative;
            overflow-y: auto;
        }
        .gm-float-window #info-top {
            top: 0;
            position: sticky;
            background-color: #004b58;
            display: block;
        }
        .gm-float-window #info-title {
            font-weight: bold;
            height: 24px;
            position: sticky;
            top: 0;
            background-color: #004b58;
        }
        .gm-float-window #info-title:before {
            z-index: -1;
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-bottom: 1px solid #007e77;
        }
    `)
    // 用户信息
    GM_addStyle(`
        #user-info {
            width: 300px;
            height: 350px;
            padding: 20px;
            color: rgba(0,0,0,0.8);
        }
        #user-info #title {
            font-size: large;
            font-weight: bold;
            text-align: center;
        }
        #user-info #erp-main {
            height: 265px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        #user-info #erp-query {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 5px;
        }
        #user-info #erp-query button {
            width: 100px;
        }
    `)
    // 插件信息
    GM_addStyle(`
        #MyPlugVer {
            padding-bottom: 3px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #MyPlugVer #click {
            cursor: pointer;
            color: green;
        }
        #MyPlugVer a,
        #MyPlugVer span {
            border-radius: 3px;
            padding: 2px 3px;
            line-height: 1;
            transition: 0.3s ease-in-out;
        }
        #MyPlugVer a:hover,
        #MyPlugVer #click:hover {
            background: #F44336 !important;
            color: #fff !important;
            user-select: none;
        }
    `)
}
function CSS_homeBeautify() {
    // 美化页面样式
    GM_addStyle(`
        /* * {
            scroll-behavior: smooth !important;
        } */
        /*滚动条样式*/
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: rgba(160,169,173,0.45);
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(160,169,173,0.8);
        }
        /*页码始终可见*/
        .ant5-pagination.ant5-table-pagination {
            z-index: 10;
            position: sticky !important;
            bottom: -16px !important;
            background: #ffffff !important;
            width: 100% !important;
            height: 36px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
        }
        .ant5-table-content {
            scrollbar-color: initial;
        }
    `)
}
// 内部质检主页
async function Plug_homeInnerQcPage() {
    const { GM_XHR, AddDOM, MessageTip, FormatTime, UpdateUrlParam, SwitchRead, AwaitSelectorShow, GetApiCache, JDPinUserClass } = Plug_fnClass();
    const homeLayoutMenu = await AwaitSelectorShow(".antcap-layout-sider-children", true);
    // 获取Token
    const { token, user } = SwitchRead("Plugin-Key") || {};
    const getToken = () => token || user;
    if (!getToken()) {
        return false;
    }

    const [source, innerQcUser, kpiConfig] = await Promise.all([
        GetApiCache({
            method: "GET",
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/source`
        }, "JD-QUERY-SOURCE"),
        GetApiCache({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/config`,
            data: {
                name: "jd-inner-qc",
                type: "GET",
            }
        }, "JD-INNER-QC-USER"),
        GetApiCache({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/config`,
            data: {
                name: "jd-kpi-accuracy",
                type: "GET",
            }
        }, "JD-KPI-ACCURACY")
    ]);

    let isInnerQcUser = false;
    const { pinUser, getPinUser } = await JDPinUserClass();

    function getKpiAccuracy(params) {
        const data = new Function("params", kpiConfig)(params) || {};
        return {
            kpi: data.kpi || 0,
            kpiLow: data.kpiLow || 0,
            accuracy: data.accuracy || 0,
            accuracyText: data.accuracyText || "0%",
            getInfo: data.getInfo || (() => { }),
        }
    }

    function diffRateCount(diff, total) {
        if (diff === 0 || total === 0) {
            return 0;
        }
        return ((diff / total || 0) * 100).toFixed(2);
    }

    function returnDataUrl(params) {
        const markUrl = ({ taskId, contentTypeId, bizLineId, contentId, subLineId, contentSourceId, manualState, qcManageReviewState, isQcManage }) => ({
            taskId: taskId,
            contentType: contentTypeId || "",
            bizLine: bizLineId,
            optType: qcManageReviewState === 1 && (isInnerQcUser || isQcManage) ? 9 : 3,
            contentId: contentId,
            subLine: subLineId || "",
            contentSource: contentSourceId,
            manualState: manualState,
        });
        const openConfig = {
            // 直播切片
            19: (list) => {
                return UpdateUrlParam("https://ver.jd.com/Recheck/Detail", {
                    ...markUrl(list),
                    liveId: list.liveId,
                    recheck: 0,
                    innerQc: true,
                });
            },
            // 直播监看
            24: (list) => {
                return UpdateUrlParam("https://ver.jd.com/Recheck/Detail", {
                    ...markUrl(list),
                    qcTaskId: list.qcTaskId,
                    liveId: list.liveId,
                    recheck: 0,
                    innerQc: true,
                });
            },
            // 其它
            default: (list) => {
                return UpdateUrlParam("https://ver.jd.com/Recheck/Detail", {
                    ...markUrl(list),
                    innerQc: true,
                });
            },
        };
        return (openConfig[params.bizLineId] || openConfig.default)(params);
    }

    GM_addStyle(`
        .el-table th {
            background: #f4f5f8 !important;
        }
        .el-table td, .el-table th {
            color: #222222 !important;
        }
    `)
    AddDOM({
        addNode: await AwaitSelectorShow(".header"),
        addData: [{
            name: "div",
            style: "color: #ff0000;margin: 0 15px;font-weight: bold;font-size: 20px;float: left;",
            innerHTML: getPinUser(user)
        }, {
            name: "div",
            style: "float: left;height: 100%;gap: 10px;display: flex;align-items: center;",
            innerHTML: `
                <el-button v-if="!appealTotal.isBlock" size="medium" :type="type" @click="openPage">{{title}}</el-button>
                <el-button v-if="appealTotal.isBlock" size="medium" :type="type" @click="openPage" class="el-double-button" style="padding: 10px 15px;">
                    <div class="el-double-button-div">
                        <div>
                            <span style="font-size: 10px;">待处理</span>
                            <span>{{appealTotal.total}}</span>
                        </div>
                        <div>
                            <span style="font-size: 10px;">申诉中</span>
                            <span>{{appealTotal.appeal}}</span>
                        </div>
                        <div>
                            <span style="font-size: 10px;">已处理</span>
                            <span>{{appealTotal.today}}</span>
                        </div>
                    </div>
                </el-button>

                <el-popover
                    placement="bottom"
                    width="730"
                    class="acc-kpi-popover"
                    trigger="click">
                    <div style="display: flex;">
                        <div style="margin-right: auto;display: flex;align-items: center;">
                            <el-button v-if="isBoard" style="height: 32px" size="small" type="primary" icon="el-icon-s-data" @click="showBoard"></el-button>
                            <el-button v-if="!isBoard" style="height: 32px" size="small" type="danger" icon="el-icon-close" @click="showBoard"></el-button>
                            <div v-if="!isBoard" style="font-size: 16px;margin-left: 15px;">KPI/准确率说明</div>
                        </div>
                        <div v-if="isBoard" style="gap: 10px;display: flex;justify-content: center;margin-right: auto;">
                            <el-date-picker
                                v-model="qcTime"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                size="small"
                                style="width: 240px;"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                :picker-options="pickerOptions"
                                >
                            </el-date-picker>
                            <el-select v-model="qcPerson" style="width: 100px;" size="small" :filter-method="qcPersonFilter"  @visible-change="qcPersonVisibleChange" filterable placeholder="请选择">
                                <el-option
                                    v-for="item in filteredUserArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" size="small" :disabled="boardLoading" @click="getBoard">查 询</el-button>
                            <el-button v-if="!isSelf" style="margin-left: 0;" type="info" size="small" :disabled="boardLoading" @click="getSelf">自 己</el-button>
                        </div>
                    </div>
                    <div v-loading="boardLoading" v-if="isBoard">
                        <el-empty v-if="dataTableList.length <= 0" image-size="100" description="暂无数据"></el-empty>
                        <el-table
                            v-if="dataTableList.length > 0"
                            :data="dataTableList"
                            border
                            show-summary
                            :summary-method="getSummaries"
                            :default-sort="{prop: 'kpi', order: 'descending'}"
                            class="acc-kpi-table"
                            size="mini"
                            style="width: 100%">
                            <el-table-column
                                :resizable="false"
                                prop="name"
                                label="板块"
                                min-width="130">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                prop="qcTotal"
                                label="质检量"
                                min-width="70">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                prop="qcDiff"
                                label="不一致"
                                min-width="70">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                :sort-method="diffRateNum"
                                prop="diffRate"
                                label="不一致率"
                                min-width="80">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                prop="qcNumber"
                                label="内检量"
                                min-width="70">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                prop="qcError"
                                label="错误数"
                                min-width="70">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                prop="qcLow"
                                label="低级错"
                                min-width="70">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                :sort-method="accuracyNum"
                                prop="accuracy"
                                label="准确率"
                                min-width="70">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                sortable
                                :sort-orders="['descending', 'ascending']"
                                prop="kpi"
                                label="KPI"
                                min-width="70">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="!isBoard" style="margin-top: 10px;">
                        <div v-if="kpiAccInfo" v-html="kpiAccInfo"></div>
                        <el-empty v-else image-size="100" description="暂无说明"></el-empty>
                    </div>
                    <el-button size="medium" :type="boardType" class="el-double-button" slot="reference">
                        <span v-if="!sumList.accuracy">{{boardTitle}}</span>
                        <div v-if="sumList.accuracy" class="el-double-button-div">
                            <div>
                                <span style="font-size: 10px;">准确率</span>
                                <span>{{sumList.accuracy}}</span>
                            </div>
                            <div>
                                <span style="font-size: 10px;">KPI</span>
                                <span>{{sumList.kpi}}</span>
                            </div>
                        </div>
                    </el-button>
                </el-popover>

                <div>
                    <el-button style="width: 36px;height: 36px;" v-if="!isInnerQcUser && (!isShowQueryPage || loading)" size="medium" :loading="loading" icon="el-icon-search" circle @click="clickQuery"></el-button>
                    <el-button style="width: 36px;height: 36px;" v-if="isShowQueryPage && !loading" size="medium" type="danger" icon="el-icon-close" plain circle @click="closePege"></el-button>
                </div>
            `,
            function(div) {
                GM_addStyle(`
                    .acc-kpi-popover .el-popover__reference-wrapper {
                        display: flex;
                        align-items: center;
                    }
                    .acc-kpi-table {
                        margin-top: 10px;
                    }
                    .acc-kpi-table th {
                        padding: 0 !important;
                    }
                    .acc-kpi-table td {
                        padding: 3px 0 !important;
                    }
                    .acc-kpi-table .el-table__footer-wrapper td {
                        font-weight: bold;
                    }
                    .acc-kpi-table .cell {
                        padding: 0 !important;
                        text-align: center;
                    }
                    .el-double-button {
                        height: 36px;
                    }
                    .el-double-button-div {
                        height: 100%;
                        gap: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .el-double-button-div>div {
                        gap: 2px;
                        display: flex;
                        flex-direction: column;
                    }
                    .el-double-button-div>div {
                        gap: 2px;
                        display: flex;
                        flex-direction: column;
                    }
                    .convert-slider {
                        margin: 20px 0;
                    }
                    .convert-slider .el-slider__input {
                        float: left;
                    }
                    .convert-slider .el-slider__runway {
                        margin-left: 145px;
                        margin-right: 20px;
                    }
                    .convert-slider .el-slider__runway .el-slider__marks {
                        white-space: nowrap;
                    }
                `)
                const userConfig = pinUser && pinUser.config || { pin: [], user: [] };
                new Vue({
                    el: div,
                    data() {
                        const userArr = userConfig.pin.map((pin, index) => ({
                            label: userConfig.user[index] || pin,
                            value: pin
                        }));
                        const convertMarks = {};
                        for (let i = 0; i <= 10; i++) {
                            const index = 0 + i * 10;
                            convertMarks[index] = index + "%";
                        }
                        return {
                            convertValue: 100,
                            convertData: {
                                kpi: 0,
                                ratio: 0,
                                accuracy: 0,
                                formula: ""
                            },
                            convertMarks: convertMarks,
                            isBoard: true,
                            title: "获取中",
                            type: "primary",
                            boardTitle: "获取中",
                            boardType: "primary",
                            boardLoading: false,
                            qcTime: [
                                FormatTime("YYYY-MM-01 00:00:00"),
                                FormatTime("YYYY-MM-DD 23:59:59"),
                            ],
                            qcPerson: user,
                            userArr: userArr,
                            filteredUserArr: userArr,
                            isSelf: true,
                            sumList: {},
                            appealTotal: {},
                            dataTableList: [],
                            loading: false,
                            isShowQueryPage: false,
                            isInnerQcUser: false,
                            pickerOptions: {
                                shortcuts: Array.from({ length: 6 }, (_, index) => {
                                    const currentDate = new Date();
                                    const start = new Date(currentDate.setMonth(currentDate.getMonth() - index, 1));
                                    const end = new Date(currentDate.setMonth(currentDate.getMonth() + 1, 0));
                                    return {
                                        text: FormatTime("YYYY年MM月", start),
                                        onClick(picker) {
                                            picker.$emit("pick", [start, end]);
                                        }
                                    }
                                })
                            },
                            kpiAccInfo: null
                        }
                    },
                    mounted() {
                        this.kpiAccInfo = getKpiAccuracy({}).getInfo();
                        // 点击左侧菜单，关闭内检面板
                        homeLayoutMenu.addEventListener("click", ({ target }) => {
                            if (target.nodeName.toLowerCase() === "a" && target.parentNode.nodeName.toLowerCase() === "li") {
                                this.isShowQueryPage = openQueryPage(true);
                            }
                        });
                        // 聚焦时查询待处理数据
                        const loopGet = async () => {
                            if (this.loading) {
                                return false;
                            }
                            const visible = document.visibilityState === "visible";
                            const sider = document.querySelector(".antcap-layout-sider-children");
                            if (visible && sider) {
                                await this.getAppeal().then((data) => {
                                    if (data && data.isInnerQcUser && !data.total) {
                                        isInnerQcUser = data.isInnerQcUser;
                                        this.isInnerQcUser = data.isInnerQcUser;
                                        this.type = "primary";
                                        this.title = "内检面板";
                                        document.removeEventListener("visibilitychange", loopGet);
                                        return false;
                                    }
                                    this.appealTotal = {};
                                    if (data === null) {
                                        this.type = "danger";
                                        this.title = "获取失败";
                                    } else {
                                        this.appealTotal = {
                                            isBlock: true, // 是否显示
                                            total: data.total || 0, // 待处理
                                            appeal: data.appeal || 0, // 申诉中
                                            today: data.today || 0, // 已处理
                                        };
                                        if (data.total) {
                                            this.type = "danger";
                                        } else {
                                            this.type = "success";
                                        }
                                    }
                                }).catch((err) => {
                                    console.error(err);
                                });
                            }
                        }
                        loopGet();
                        this.getBoard();
                        document.addEventListener("visibilitychange", loopGet);
                    },
                    watch: {
                        qcTime() {
                            this.getBoard();
                        },
                        qcPerson(newValue, oldValue) {
                            this.isSelf = newValue === user;
                            this.getBoard();
                        }
                    },
                    methods: {
                        getKpiColor(value) {
                            const conicColors = {
                                0: "danger",
                                80: "warning",
                                90: "success",
                            };
                            const keys = Object.keys(conicColors);
                            for (let index = keys.length - 1; index >= 0; index--) {
                                const key = keys[index];
                                if (value >= key) {
                                    return conicColors[key];
                                }
                            }
                            return "primary";
                        },
                        qcPersonFilter(query) {
                            if (!query) {
                                this.filteredUserArr = this.userArr;
                            } else {
                                this.filteredUserArr = this.userArr.filter((item) => item.label.includes(query) || item.value.includes(query));
                            }
                        },
                        qcPersonVisibleChange(visible) {
                            if (visible) {
                                this.filteredUserArr = this.userArr;
                            }
                        },
                        getSelf() {
                            this.qcPerson = user;
                        },
                        showBoard() {
                            this.isBoard = !this.isBoard;
                        },
                        changeConvertValue(value) {
                            this.convertValue = value;
                            let kpi1 = 100;
                            let ratio = "N/A";
                            for (const { type, expres, kpi } of kpiConfig) {
                                if (type === "ratio" && new Function("value", "return (" + expres + ")")(value)) {
                                    const countKpi = 100 - ((98 - value) / 98) * 100 * kpi;
                                    kpi1 = Math.min(Math.max(0, countKpi), kpi1);
                                    ratio = kpi;
                                }
                            }
                            this.convertData.kpi = Number(kpi1.toFixed(2));
                            this.convertData.accuracy = value + "%";
                            this.convertData.ratio = ratio;
                            this.convertData.formula = `100-(98%-${value + "%"})/98%*100*${ratio} = ${Number(kpi1.toFixed(2))}`;
                        },
                        clickQuery() {
                            if (this.loading) {
                                return false;
                            }
                            this.getBoard();
                            this.getAppeal();
                        },
                        async getBoard() {
                            const qcTime = this.qcTime;
                            const qcPerson = this.qcPerson;
                            if (!qcTime || qcTime.length <= 0) {
                                return MessageTip("❌", "必须填写时间", 3, 1);
                            }
                            if (!qcPerson) {
                                return MessageTip("❌", "必须填写姓名", 3, 1);
                            }
                            const query = { qcPerson };
                            query.qcTime = qcTime.map((item, index) => FormatTime(`YYYY-MM-DD ${index === 0 ? "00:00:00" : "23:59:59"}`, item));
                            if (!this.boardLoading) {
                                this.boardLoading = true;
                                return getDataBoard(query).then((data) => {
                                    if (!data) {
                                        this.sumList = {};
                                        this.dataTableList = [];
                                        this.boardType = "danger";
                                        this.boardTitle = "获取失败";
                                        return false;
                                    }
                                    const list = data && data.length > 0 ? data[0] : {};
                                    if (!list.data) {
                                        this.sumList = {};
                                        this.dataTableList = [];
                                        this.boardType = "success";
                                        this.boardTitle = "无数据";
                                        return false;
                                    }
                                    const sumKpi = {
                                        got: 0,
                                        kpiLow: 0,
                                    };
                                    this.dataTableList = list.data.map((item) => {
                                        if (item.name === "先后-基础视频 + 全部-高热巡检") {
                                            item.name = "先后-视频 + 全部-高热";
                                        }
                                        const diffRateNum = diffRateCount(item.qcDiff, item.qcTotal);
                                        const kpiAcc = getKpiAccuracy(item);
                                        sumKpi.got += item.qcTotal * (kpiAcc.kpiLow / 100);
                                        return {
                                            name: item.name,
                                            qcTotal: item.qcTotal,
                                            qcDiff: item.qcDiff,
                                            diffRate: `${diffRateNum}%`,
                                            diffRateNum: diffRateNum,
                                            qcNumber: item.qcNumber,
                                            qcError: item.qcError,
                                            qcLow: item.qcLow,
                                            accuracy: kpiAcc.accuracyText,
                                            accuracyNum: kpiAcc.accuracy,
                                            kpi: kpiAcc.kpiLow,
                                        }
                                    });
                                    const diffRateNum = diffRateCount(list.diff, list.total);
                                    const kpiAcc = getKpiAccuracy({
                                        qcTotal: list.total,
                                        qcNumber: list.qcNumber,
                                        qcError: list.qcError,
                                        qcLow: list.qcLow,
                                    });
                                    sumKpi.kpiLow = (sumKpi.got / list.total * 100).toFixed(2) * 1;
                                    this.sumList = {
                                        name: "合计",
                                        qcTotal: list.total,
                                        qcDiff: list.diff,
                                        diffRate: `${diffRateNum}%`,
                                        diffRateNum: diffRateNum,
                                        qcNumber: list.qcNumber,
                                        qcError: list.qcError,
                                        qcLow: list.qcLow,
                                        accuracy: kpiAcc.accuracyText,
                                        accuracyNum: kpiAcc.accuracy,
                                        kpi: sumKpi.kpiLow,
                                    };
                                    this.changeConvertValue(Number(kpiAcc.accuracy));
                                    this.boardType = this.getKpiColor(sumKpi.kpiLow);
                                }).finally(() => {
                                    this.boardLoading = false;
                                })
                            }
                        },
                        diffRateNum: (a, b) => a.diffRateNum - b.diffRateNum,
                        accuracyNum: (a, b) => a.accuracyNum - b.accuracyNum,
                        getSummaries(param) {
                            const { columns } = param;
                            const sums = [];
                            columns.forEach((column, index) => {
                                const { property } = column;
                                const data = this.sumList[property];
                                if (data !== undefined) {
                                    sums[index] = data;
                                } else {
                                    sums[index] = "N/A";
                                }
                            });
                            return sums;
                        },
                        async getAppeal() {
                            if (!this.loading) {
                                this.loading = true;
                                return getWarnTotal().finally(() => {
                                    this.loading = false;
                                })
                            }
                        },
                        openPage() {
                            this.isShowQueryPage = openQueryPage();
                        },
                        closePege() {
                            this.isShowQueryPage = openQueryPage(true);
                        }
                    }
                })
            }
        }]
    })

    const main = document.querySelector(".antcap-layout main");
    main.style.position = "relative";
    GM_addStyle(`
        .inner-query-page {
            position: absolute;
            top: 0;
            background: #ffffff;
            height: 100%;
            width: 100%;
            z-index: 16;
            padding: 10px 10px 0 10px;
            border: 10px solid #f1f3f6;
            overflow: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    `)

    function getPage() {
        return AddDOM({
            addNode: main,
            addData: [{
                name: "div",
                className: "inner-query-page",
                innerHTML: `
                    <div>
                        <el-form :inline="true" :model="formList" :rules="rules" ref="ruleForm" size="small">
                            <el-form-item label="内检时间" prop="innerQcTime">
                                <el-date-picker
                                    style="width: 330px;"
                                    v-model="formList.innerQcTime"
                                    type="datetimerange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="质检时间" prop="qcTime">
                                <el-date-picker
                                    style="width: 330px;"
                                    v-model="formList.qcTime"
                                    type="datetimerange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="来源">
                                <el-select v-model="formList.source" clearable placeholder="请选择" style="width: 140px;">
                                    <el-option-group
                                        v-for="group in sourceList"
                                        :key="group.label"
                                        :label="group.label">
                                        <el-option
                                            v-for="item in group.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="申诉状态">
                                <el-select v-model="formList.innerAppealState" placeholder="请选择" style="width: 160px;" clearable multiple collapse-tags>
                                    <el-option
                                        v-for="item in innerAppealState"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="内检状态">
                                <el-select v-model="formList.innerQcState" placeholder="请选择" style="width: 160px;" clearable multiple collapse-tags>
                                    <el-option
                                        v-for="item in innerQcState"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="内检人">
                                <el-select v-model="formList.qcUser" placeholder="请选择" style="width: 140px;" clearable collapse-tags>
                                    <el-option
                                        v-for="item in qcUserArr"
                                        :key="item"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="内容ID">
                                <el-input
                                    style="width: 140px;"
                                    placeholder="请输入内容"
                                    v-model="formList.contentId"
                                    clearable>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="直播ID">
                                <el-input
                                    style="width: 140px;"
                                    placeholder="请输入内容"
                                    v-model="formList.liveId"
                                    clearable>
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" size="small" :disabled="loading" @click="onSubmit">查 询</el-button>
                            </el-form-item>

                            <el-form-item v-if="!loading && tableData.length > 0">
                                <el-popconfirm
                                    confirm-button-text="继续"
                                    cancel-button-text="取消"
                                    :title="openTitle"
                                    @confirm="openAllPage">
                                    <el-button slot="reference" type="primary" size="small">全部打开</el-button>
                                </el-popconfirm>
                            </el-form-item>
                        </el-form>
                        <el-table
                            border
                            v-loading="loading"
                            size="small"
                            :data="tableData"
                            style="width: 100%"
                            >
                            <el-table-column
                                :resizable="false"
                                prop="qcTime"
                                label="质检时间"
                                min-width="135">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="qcPerson"
                                label="质检人"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="innerQcTime"
                                label="内检时间"
                                min-width="135">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="innerQcUser"
                                label="内检人"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="innerQcState"
                                label="内检状态"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="appealQcState"
                                label="申诉状态"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="ID"
                                label="直播/内容ID"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="bizLine"
                                label="业务线"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="contentSource"
                                label="内容来源"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                prop="contentType"
                                label="内容样式"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                :resizable="false"
                                label="操作"
                                width="80">
                                <template slot-scope="scope">
                                    <a :href="scope.row.url" target="_blank">查看</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-pagination
                        style="position: sticky;bottom: 0;background: #ffffff;padding: 2px 5px 10px 5px;z-index: 1;display: flex;justify-content: flex-end;"
                        background
                        @size-change="pageSizeChange"
                        @current-change="pageChange"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="page"
                        :total="total">
                    </el-pagination>
                `,
                function(div) {
                    new Vue({
                        el: div,
                        data() {
                            const currentDate = new Date();
                            const day = 24 * 60 * 60 * 1000;
                            const validatorDate = (rule, value, callback) => {
                                let isTime = false;
                                for (const key of ["qcTime", "innerQcTime"]) {
                                    !isTime && (isTime = this.formList[key] && this.formList[key][1] && this.formList[key].length === 2);
                                }
                                if (!isTime) {
                                    callback(new Error("必填任意一个日期时间范围"));
                                } else {
                                    callback();
                                }
                            };
                            return {
                                loading: false,
                                formList: {
                                    innerQcTime: [
                                        FormatTime("YYYY-MM-DD 00:00:00", new Date(currentDate.getTime() - 30 * day)),
                                        FormatTime("YYYY-MM-DD 23:59:59"),
                                    ],
                                    qcTime: [],
                                    source: "",
                                    innerAppealState: ["未申诉", "申诉驳回"],
                                    innerQcState: ["质检错", "双方错", "低级错误", "建议质检错"],
                                    qcUser: "",
                                    contentId: "",
                                    liveId: "",
                                },
                                rules: {
                                    innerQcTime: [{ validator: validatorDate, trigger: "change" }],
                                    qcTime: [{ validator: validatorDate, trigger: "change" }],
                                },
                                qcUserArr: innerQcUser.map((item) => ({
                                    value: item.pin,
                                    label: getPinUser(item.pin)
                                })),
                                sourceList: source.map((list) => ({
                                    ...list,
                                    options: list.options.map((item) => ({
                                        ...item,
                                        value: JSON.stringify(item.value),
                                    }))
                                })),
                                innerAppealState: ["未申诉", "提起申诉", "申诉通过", "申诉驳回", "接受质检"],
                                innerQcState: ["未内检", "审核错", "质检错", "双方错", "低级错误", "建议质检错", "不计双方错", "新人成长错", "存疑案例"],
                                tableData: [],
                                pageSize: 20,
                                page: 1,
                                total: 0,
                                pickerOptions: {
                                    shortcuts: [30, 60, 90].map((day) => ({
                                        text: `最近${day}天`,
                                        onClick(picker) {
                                            const currentDate = new Date();
                                            const start = FormatTime("YYYY-MM-DD 00:00:00", currentDate.setDate(currentDate.getDate() - day));
                                            picker.$emit("pick", [start, FormatTime("YYYY-MM-DD 23:59:59")]);
                                        }
                                    }))
                                }
                            }
                        },
                        watch: {
                            "formList.qcTime"() {
                                this.$refs["ruleForm"].validateField("innerQcTime");
                            },
                            "formList.innerQcTime"() {
                                this.$refs["ruleForm"].validateField("qcTime");
                            },
                        },
                        mounted() {
                            this.onSubmit();
                        },
                        methods: {
                            async getData() {
                                this.loading = true;
                                const querObj = {
                                    ...this.formList,
                                    qcTime: this.formList.qcTime?.map((time) => FormatTime("YYYY-MM-DD hh:mm:ss", time)),
                                    innerQcTime: this.formList.innerQcTime?.map((time) => FormatTime("YYYY-MM-DD hh:mm:ss", time)),
                                    pageSize: this.pageSize,
                                    page: this.page,
                                    qcPerson: user,
                                };
                                getDataList(querObj).then((data) => {
                                    this.total = data.total;
                                    const tabelList = data.list.map((list) => ({
                                        qcTime: list.qcTime || "---",
                                        qcPerson: getPinUser(list.qcPerson) || "---",
                                        innerQcTime: list.innerQcInfo && list.innerQcInfo.time || "---",
                                        innerQcUser: list.innerQcInfo && getPinUser(list.innerQcInfo.qcUser) || "---",
                                        innerQcState: list.innerQcInfo && list.innerQcInfo.state || "---",
                                        appealQcState: list.innerQcInfo && list.innerQcInfo.appealState || "---",
                                        ID: list.contentId || list.liveId || "---",
                                        bizLine: list.bizLine,
                                        contentSource: list.contentSource,
                                        contentType: list.contentType,
                                        qcManageReviewState: list.qcManageReviewState,
                                        url: returnDataUrl(list),
                                    }))
                                    this.tableData = tabelList;
                                    this.openTitle = `共 ${tabelList.length} 条数据，是否继续打开？`
                                }).finally(() => {
                                    this.loading = false;
                                });
                            },
                            onSubmit() {
                                this.$refs["ruleForm"].validate((valid) => {
                                    if (valid) {
                                        this.getData();
                                    }
                                });
                            },
                            openAllPage() {
                                this.tableData.forEach(({ url }) => {
                                    window.open(url, "", "", true);
                                })
                            },
                            pageSizeChange(param) {
                                this.pageSize = param;
                                this.onSubmit();
                            },
                            pageChange(param) {
                                this.page = param;
                                this.onSubmit();
                            }
                        }
                    })
                }
            }]
        })
    }

    function openQueryPage(close) {
        const queryPage = document.querySelector(".inner-query-page");
        if (queryPage) {
            if (!queryPage._close || close) {
                queryPage._close = true;
                queryPage.style.display = "none";
                return false;
            }
            queryPage._close = false;
            queryPage.style.display = "flex";
            return true;
        }
        if (!close) {
            getPage();
            return true;
        }
        return false;
    }
    async function getDataList(data) {
        return GM_XHR({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/list`,
            data: { ...data, token: getToken() }
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            MessageTip("❌", "数据获取失败", 3, 1);
            return null;
        })
    }
    async function getWarnTotal() {
        return GM_XHR({
            method: "GET",
            timeout: 3000,
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/warn-info?token=${getToken()}`
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                GM_setValue("allowConfig", { isSubmit: !!data.data.isSubmit, isError: false });
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            GM_setValue("allowConfig", { isError: true });
            return null;
        })
    }
    async function getDataBoard(data) {
        return GM_XHR({
            method: "POST",
            timeout: 3000,
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/board`,
            data: { ...data, token: getToken() }
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            return null;
        })
    }
}

// 获取京东数据
async function getServerData(apiName, cacheName, callback = () => { }) {
    const { GET_DATA, SET_DATA, SwitchRead, SwitchWrite, HTTP_XHR, CompressCode } = Plug_fnClass();
    const cacheData = GET_DATA(cacheName, {});
    if (cacheData.time) {
        callback(cacheData);
        if (cacheData.data) {
            callback = () => { };
        }
    }
    const time = new Date().getTime();
    // 时间为空or时间间隔大于30分钟时重新获取
    const timeOut30 = !cacheData.time || (time - cacheData.time) > 30 * 60 * 1000;
    // 如果列表为空并且大于10分钟没有获取，则获取一次数据
    const nullTime10 = !cacheData.data && (time - cacheData.time) > 10 * 60 * 1000;
    if (timeOut30 || nullTime10) {
        cacheData.time = time;
        SET_DATA(cacheName, cacheData);
        if (typeof apiName === "object") {
            await _runRelax();
            callback(cacheData);
            SET_DATA(cacheName, cacheData);
            return cacheData;
        }
        await _runStrict();
        callback(cacheData);
        SET_DATA(cacheName, cacheData);
        return cacheData;
    }
    async function _runStrict(index = 0) {
        const pluginKey = SwitchRead("Plugin-Key");
        if (index >= 3) {
            PluginKeyTest();
            return cacheData;
        }
        try {
            const gmv = window.GM_info?.script.version;
            const search = `gmv=${gmv}&version=1&type=${apiName}&token=${pluginKey.value}&sso=${pluginKey.token}&user=${pluginKey.user}`;
            const xhr = await HTTP_XHR({ method: "GET", url: `https://www.cdzero.cn/api/jd/get-data?${search}` });
            const responseText = xhr.responseText;
            if (xhr.status === 403) {
                SwitchWrite("Plugin-Key", { ...pluginKey, state: false, value: "" });
            }
            if (!!responseText && xhr.status === 200) {
                const content = JSON.parse(responseText);
                if (apiName === "jd-other-js") {
                    content.data = CompressCode(content.data);
                }
                SwitchWrite("Plugin-Key", { ...pluginKey, state: true, value: content.token });
                cacheData.data = content.data;
                return cacheData;
            }
        } catch (error) {
            console.error(error);
        }
        await _runStrict(index + 1);
    }
    async function _runRelax(index = 0) {
        if (index >= 3) {
            return cacheData;
        }
        try {
            const xhr = await HTTP_XHR({ method: apiName.method, url: apiName.url });
            const responseText = xhr.responseText;
            if (!!responseText && xhr.status === 200) {
                const content = JSON.parse(responseText);
                if (content.code === 0) {
                    cacheData.data = content;
                    return cacheData;
                }
            }
        } catch (error) {
            console.error(error);
        }
        await _runRelax(index + 1);
    }
    return cacheData;
}

// 工作页
async function Plug_workPage() {
    // 初始化实例
    CSS_workPage();
    const config = {
        dataContent: null,
        userFrom: {},
        sku: {},
        allSku: [],
        videoList: {
            type: true,
            list: []
        },
        labelAll: [],
        qcList: {},
        talentText: ["无等级", "G1萌新", "G2进阶", "G3新秀", "G4资深", "G5精英", "G6大咖", "G7知名"],
        videoRepeat: {},
        liveWatchTime: null,
        rejectReason: {}
    };
    const special = ["医药", "医疗保健", "营养保健", "传统滋补", "非药健康", "健康服务", "院端医疗器械", "中西成药（药房经营）", "宠物健康"];
    const { GM_XHR, HTTP_XHR, GET_DATA, SET_DATA, AddDOM, RemoveDom, MessageTip, MessageBox, FormatTime, JDPinUserClass, UpdateUrlParam, Contentexamination, GetTaskDetailData, QueueTaskRunner, ObserverDOM, WebLocalMessage, GetQueryString, RunFrame, SwitchRead, SwitchWrite, ObjectProperty, WindowMove, ThrottleOver, WaylayHTTP, WaylaySetTimeOut, AwaitSelectorShow, AwaitImgLoaded, CopyText } = Plug_fnClass();
    const { leftArrowIco, shareAltIco } = Plug_ICO();
    const { Tooltip, SwitchBox, lazyLoadImg, antcapCard, collapseCard } = Plug_Components();

    // 页面美化
    const pageBeautify = SwitchRead("Page-Beautify").state;
    if (pageBeautify) {
        CSS_workBeautify();
    }

    // 拦截网络请求
    WaylayHTTP([{
        method: "GET",
        url: /^(?=.*\/api\/biz\/task\/detail\?task_id)(?!.*reRun=true).*$/,
        callback: (params) => {
            const data = JSON.parse(params.data.responseText).content || {};
            unsafeWindow.jdPageContentData = data;
            config.dataContent = data;
            // 获取标签列表
            if (data.auditList) {
                // 任务池
                const label = data.auditList.find(list => list.elementType === "custom" && list.subType === "label");
                if (label) {
                    const labelAll = label.value && JSON.parse(label.value) || {};
                    config.labelAll = labelAll;
                }
                // 质检侧
                const qcLabel = data.auditList.find(list => list.elementType === "custom" && list.subType === "qcLabel");
                if (qcLabel) {
                    const labelAll = qcLabel.value && JSON.parse(qcLabel.value) || {};
                    config.labelAll = labelAll;
                }
                // 获取SKU列表
                const allSku = data.auditList.filter(item => item.elementType === "sku") || [];
                const allSkuParse = allSku.map((item) => item.value && JSON.parse(item.value) || {});
                config.allSku = allSkuParse;
                // 第一个商卡ID
                const { firstCateCd, secondCateCd, thirdCateCd } = allSkuParse.length ? allSkuParse[0] : {};
                // customInfo 获取类目
                const customInfo = data.auditList && data.auditList.find(list => list.elementType === "custom") || {};
                const { categoryOneId, categoryTwoId, categoryThreeId } = customInfo.value && JSON.parse(customInfo.value) || {};
                config.sku.skuId = {
                    categoryOneId: categoryOneId || firstCateCd,
                    categoryTwoId: categoryTwoId || secondCateCd,
                    categoryThreeId: categoryThreeId || thirdCateCd
                };
            }
            // 获取达人等级
            config.userFrom.talentLevel = data.talentLevel;
            // 获取查重
            const { videoLabels, audioLabels } = data;
            if (videoLabels && audioLabels) {
                const videoInfo = videoLabels[0] && videoLabels[0].labelInfo || [];
                const audioInfo = audioLabels[0] && audioLabels[0].labelInfo || [];
                config.videoList.list.push(...videoInfo, ...audioInfo);
                config.videoList.type = true;
            }
            // 获取头像
            if (data.pinUrl) {
                config.userFrom.userImg = data.pinUrl;
            }
            // 达人Pin
            config.userFrom.authorPin = data.authorPin;
            // 素材ID
            config.userFrom.contentId = data.contentId;
            config.showState = data.showState;
            // 判断数据是否被质检
            if (data.showState !== 1) {
                // 获取质检信息
                const qcInfo = {};
                if (data.auditInfoList) {
                    const auditInfoList = data.auditInfoList || [];
                    const qcList = auditInfoList.find(item => [1, 3].includes(item.auditType));
                    qcInfo.qcList = qcList || {};
                }
                config.qcList = {
                    getTask: {
                        taskId: GetQueryString("taskId"),
                        contentId: GetQueryString("contentId"),
                    },
                    ...qcInfo.qcList
                };
            }
            params.stop();
        }
    }, {
        method: "GET",
        url: /(api\/live|liveapi\/live\/review)\/getWatchTimeAndAuditDetail/i,
        callback: (params) => {
            // 直播监控时间
            const data = JSON.parse(params.data.responseText).content || {};
            config.liveWatchTime = data;
            params.stop();
        }
    }, {
        method: "GET",
        url: /(api\/live|liveapi\/live\/query)\/detail/i,
        callback: (params) => {
            // 直播基本信息
            const data = JSON.parse(params.data.responseText).content || {};
            config.liveDetail = data;
            params.stop();
        }
    }, {
        method: "GET",
        url: "api/biz/audit/manual/getElementRejectReason",
        callback: (params) => {
            // 拒绝原因
            const data = JSON.parse(params.data.responseText).content || {};
            config.rejectReason = data;
            params.stop();
        }
    }, {
        url: /\/api\/biz\/review\/qc\/(block|pass|labelSave|live\/submit)/,
        stop: true,
        callback: (params) => {
            const isReject = dataDisableReject(params);
            if (isReject) {
                return false;
            }
            // 质检驳回 block
            // 质检通过 pass
            // 保存标签 labelSave
            // 保存直播 live/submit
            // const allowConfig = {
            //     isSubmit: true,
            //     isError: true,
            // }
            const allowConfig = GM_getValue("allowConfig", {});
            // 判断isError和isSubmit
            if (allowConfig.isError === true || allowConfig.isSubmit === true) {
                return params.send().then(serverLabel);
            }
            function serverLabel(data) {
                const saveClose = SwitchRead("Label-Save-Close");
                if (!saveClose.state) {
                    return false;
                }
                try {
                    if (/\/api\/biz\/review\/qc\/(labelSave)/.test(data.openParam[1])) {
                        const { status, response } = data.data;
                        const responseJson = JSON.parse(response);
                        if (status === 200 && responseJson.code === 0) {
                            setTimeout(() => window.close(), (typeof saveClose.delay === "number" ? saveClose.delay : 0) * 1000);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            MessageTip("❌", [{
                name: "span",
                style: "margin-right: 5px;",
                innerText: "你有未处理的内检错"
            }, {
                name: "a",
                href: "/Recheck/list/0",
                target: "_blank",
                innerText: "前往处理"
            }], 6, 2);
        }
    }, {
        stop: true,
        url: /api\.m\.jd\.com\/client\.action/,
        callback: (params) => {
            AwaitSelectorShow("div", true).then(() => {
                params.send();
                params.stop();
            });
        }
    }]);

    // 加载质检页面
    Plug_innerQcPage(config);

    // 等待元素加载
    await AwaitSelectorShow("#root main img,#root main video", true);

    // 拦截失败，手动获取
    setTimeout(() => {
        if (!config.userFrom.contentId) {
            const lineMap = {
                32: 7
            };
            const bizLine = GetQueryString("bizLine");
            const typeId = lineMap[bizLine] || 0;
            const optType = GetQueryString("optType") || 3;
            const taskId = GetQueryString("taskId");
            const contentId = GetQueryString("contentId");
            const taskUrl = `/api/biz/task/detail?task_id=${taskId}&opt_type=${optType}&content_id=${contentId}&type=${typeId}`;
            if (contentId && contentId !== "null") {
                HTTP_XHR({ method: "GET", url: taskUrl });
            }
        }
    }, 1000);

    // 初始化样式
    (() => {
        const styleConfig = SwitchRead("other-style");
        if (!styleConfig.state) {
            return false;
        }
        getServerData("other-style", "GM_OTHER_STYLE", (content) => {
            if (content.data) {
                styleConfig.default = content.data;
                // 保存配置
                SwitchWrite("other-style", styleConfig);
            }
            if (styleConfig.auto) {
                GM_addStyle(styleConfig.default);
            } else {
                GM_addStyle(styleConfig.code);
            }
        })
    })();

    // 高亮用户信息
    (async () => {
        const userFromArr = document.querySelectorAll(".content-top .content-from>span");
        for (const list of userFromArr) {
            const userFrom = config.userFrom;
            if (list.textContent.includes("作者")) {
                const img = list.querySelector("img");
                if (img) {
                    img.style.marginRight = "4px";
                }
                const span = list.querySelector("span");
                userFrom.user = span.textContent;
                if (/旗舰店$|自营店$|专营店$|京东创作者/.test(span.textContent)) {
                    span.className = "gm-text-light";
                    span.style.background = "#ff4444";
                    userFrom.user = {
                        value: span.textContent,
                        color: "#ffffff",
                        background: "#ff4444"
                    };
                }
            }
            if (list.textContent.includes("账号类型")) {
                const span = list.querySelector("span");
                const typeColor = {
                    "达人": "#52c41a",
                    "商家": "#faad14",
                    "供应商": "#52c41a"
                }
                const keys = Object.keys(typeColor);
                const isKey = keys.find(key => span.textContent.includes(key));
                const color = typeColor[isKey] || "#389fff";
                span.className = "gm-text-light";
                span.style.background = color;
                userFrom.userType = {
                    value: span.textContent,
                    color: "#ffffff",
                    background: color
                };
            }
            if (list.textContent.includes("达人等级")) {
                const span = list.querySelector("span");
                userFrom.grade = span.textContent;
                if (["G5", "G6", "G7"].some(str => span.textContent.includes(str))) {
                    span.className = "gm-text-light";
                    span.style.background = "#ff4444";
                }
            }
        }
        // 设置达人Pin
        const ShowUserPin = SwitchRead("Show-UserPin");
        if (ShowUserPin.state) {
            ObjectProperty(config.userFrom, "authorPin", (params) => {
                if (!params.value) {
                    return false;
                }
                params.stop();
                const contentFrom = document.querySelector(".content-top .content-from");
                AddDOM({
                    addNode: contentFrom,
                    addData: [{
                        name: "span",
                        className: "item",
                        innerHTML: "作者PIN:",
                        add: [{
                            name: "span",
                            className: "from",
                            innerHTML: params.value,
                        }]
                    }]
                })
            })
        }
        // 设置质检人
        const ShowUserQc = SwitchRead("Show-UserQc");
        if (ShowUserQc.state) {
            const { getPinUser } = await JDPinUserClass();
            ObjectProperty(config, "qcList", (params) => {
                const { auditPerson, auditTime, getTask } = params.value;
                if (auditPerson && auditTime) {
                    params.stop();
                    contentFrom("质检员:", `${getPinUser(auditPerson)}(${auditPerson})`);
                    contentFrom("质检时间:", auditTime);
                } else if (getTask) {
                    params.stop();
                    const contentFrom = document.querySelector(".content-top .content-from");
                    AddDOM({
                        addNode: contentFrom,
                        addData: [{
                            name: "button",
                            className: "gm-button small item",
                            innerHTML: "质检信息",
                            click: getQcInfo
                        }]
                    })
                }
                let isRun = false;
                function getQcInfo(event) {
                    if (isRun) {
                        return MessageTip("❌", "获取中...", 3, 2);
                    }
                    isRun = true;
                    HTTP_XHR({
                        method: "GET",
                        url: `/api/biz/review/qc/list?task_id=${getTask.taskId}&content_id=${getTask.contentId}`
                    }).then(xhr => {
                        const { content } = JSON.parse(xhr.responseText);
                        const taskList = content.taskList;
                        contentFrom("质检员:", `${getPinUser(taskList[0].qcPerson)}(${taskList[0].qcPerson})`);
                        contentFrom("质检时间:", taskList[0].qcTime);
                        event.target.remove();
                    }).catch(error => {
                        console.error(error);
                        isRun = false;
                        MessageTip("❌", "获取质检信息失败", 3, 2);
                    })
                }
                function contentFrom(fromName, fromValue) {
                    const contentFrom = document.querySelector(".content-top .content-from");
                    AddDOM({
                        addNode: contentFrom,
                        addData: [{
                            name: "span",
                            className: "item",
                            innerHTML: fromName,
                            add: [{
                                name: "span",
                                className: "from",
                                innerHTML: fromValue,
                            }]
                        }]
                    })
                }
            })
        }
    })();

    // 文字高亮
    (async () => {
        // 从接口获取关键字表单
        const lightConfig = SwitchRead("highlight");
        if (!lightConfig.state) {
            return false;
        }
        getServerData("highlight-default", "GM_HIGHLIGHT", (content) => {
            if (content.data) {
                const colorObj = Array.isArray(lightConfig.default) ? Object.fromEntries(lightConfig.default.map(item => [item.name, { color: item.color, isFree: !!item.isFree }])) : {};
                lightConfig.default = content.data.map((item) => ({ ...item, color: colorObj[item.name]?.color || lightConfig.color, isFree: !!colorObj[item.name]?.isFree }));
                // 保存配置
                SwitchWrite("highlight", lightConfig);
            }
            const auto = lightConfig.default || [];
            const value = lightConfig.value || [];
            // 构建键值对映射（忽略大小写）
            const keyMap = {};
            [...auto, ...value].forEach((item) => {
                item.value && item.value.forEach((key) => {
                    const lowerKey = key.toLowerCase();
                    if (!keyMap[lowerKey]) {
                        keyMap[lowerKey] = { name: item.name, color: item.color };
                    }
                });
            });
            const valueKey = Object.keys(keyMap);
            if (valueKey.length <= 0) {
                return false;
            }
            valueKey.sort((a, b) => b.length - a.length); // 优先匹配长字符
            const joinText = "gm-highlight" + crypto.randomUUID();
            const regexText = valueKey.join(joinText).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(new RegExp(joinText, "g"), "|");
            const regex = new RegExp(regexText, "gi"); // 构建正则表达式
            function highlightKeywords() {
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                const excluDom = [
                    document.body.querySelector(".gm-tooltip-info"),
                    document.body.querySelector("#plug-setting"),
                    ...document.body.querySelectorAll(".video-react"),
                    ...document.body.querySelectorAll("script"),
                    ...document.body.querySelectorAll("style")
                ];
                function isChildOfAny(parents, child) {
                    return parents.some(parent => parent && parent !== child && parent.contains(child));
                }
                function mergeTextNodes(node, index = 0) {
                    while (index < node.childNodes.length - 1) {
                        const current = node.childNodes[index];
                        const next = node.childNodes[index + 1];
                        if (current.nodeType === Node.TEXT_NODE && next.nodeType === Node.TEXT_NODE) {
                            current.textContent += next.textContent;
                            node.removeChild(next);
                        } else {
                            index++;
                        }
                    }
                }
                let textNode = null;
                while ((textNode = walker.nextNode()) !== null) {
                    const originalText = textNode.nodeValue;
                    if (originalText === textNode["_lightValue"] || isChildOfAny(excluDom, textNode) || originalText === "") {
                        continue;
                    }
                    const parentNode = textNode.parentNode || { insertBefore() { } };
                    const classList = parentNode.classList || [];
                    const isHighlight = classList.contains("gm-highlight");
                    // 使用 replace() 方法，在匹配到的关键字前后添加 <span> 元素并设置样式
                    const highlightText = originalText.replace(regex, function (match) {
                        return `<em class="gm-highlight" msg-tip="${keyMap[match.toLowerCase()].name}" style="background: ${keyMap[match.toLowerCase()].color || lightConfig.color}">${match}</em>`;
                    });
                    textNode["_lightValue"] = originalText;
                    if (highlightText === originalText && isHighlight) {
                        const parent = parentNode.parentNode;
                        const text = document.createTextNode(originalText);
                        parent && parent.replaceChild(text, parentNode);
                        parent && mergeTextNodes(parent);
                    }
                    if (highlightText !== originalText && !isHighlight) {
                        textNode.nodeValue = "";
                        const newNode = document.createElement("span");
                        newNode.innerHTML = highlightText;
                        while (newNode.firstChild) {
                            parentNode.insertBefore(newNode.firstChild, textNode);
                        }
                        newNode.remove();
                    }
                }
            }
            const highlightThrottleOver = ThrottleOver(highlightKeywords, 100);
            // MutationObserver监视器
            const observer = ObserverDOM((mutation) => {
                if (mutation.type === "childList") {
                    highlightThrottleOver();
                }
            })
            const container = document.body;
            // 配置观察器选项
            const config = { childList: true, subtree: true };
            observer.observe(container, config);
            // 初始时调用高亮函数
            highlightKeywords();
            setInterval(highlightThrottleOver, 2000);
        })
    })();

    // 置顶标题
    async function topTitle(superType) {
        const spanId = ["title", "user", "userImg", "userType", "result", "category", "class", "super"];
        const topDom = await AddDOM({
            addNode: document.querySelector("#root"),
            addData: [{
                name: "div",
                id: "top-title",
                add: spanId.map(key => ({
                    name: "span",
                    id: key,
                    function: (e) => {
                        ObjectProperty(config.userFrom, key, overRun);
                        async function overRun(params) {
                            if (!params.value) {
                                return false;
                            }
                            if (params.name === "userImg") {
                                const imgDom = await AddDOM({
                                    addData: [{
                                        name: "img",
                                        src: params.value
                                    }]
                                }, 0)
                                if (document.contains(e)) {
                                    e.parentNode.replaceChild(imgDom, e);
                                }
                                return false;
                            }
                            if (typeof params.value !== "object") {
                                params.value = {
                                    value: params.value
                                }
                            }
                            const content = params.value;
                            e.innerHTML = content.value;
                            e.className = content.className || "";
                            e.style.color = content.color || "";
                            e.style.background = content.background || "";
                            if (params.name === "category") {
                                e.innerHTML = "类目：" + content.value;
                                if (special.includes(content.value)) {
                                    e.style.background = "#faad14";
                                }
                            }
                            if (params.name === "class") {
                                e.innerHTML = "行业：" + content.value;
                            }
                            e.style.display = "block";
                        }
                    }
                }))
            }]
        }, 0)
        // 获取标题
        const getInfoArr = [{
            key: "title",
            query: ".title-wrap .title",
        }, {
            key: "result",
            query: ".title-wrap .result",
        }]
        for (const list of getInfoArr) {
            const span = document.querySelector(list.query);
            if (!!span) {
                config.userFrom[list.key] = span.textContent;
            }
        }
        // 获取类目、行业
        categoryInfo();
        async function categoryInfo() {
            getServerData({
                method: "GET", url: "/api/biz/audit/manual/category"
            }, "GM_SKU_CATEGORY", (params) => {
                const { content } = params.data || {};
                if (!content) {
                    return false;
                }
                ObjectProperty(config.sku, "skuId", _run);
                async function _run(params) {
                    if (!params.value) {
                        return false;
                    }
                    const { categoryName } = content.find(item => item.categoryId == params.value.categoryOneId) || {};
                    if (!categoryName) {
                        return false;
                    }
                    config.userFrom.category = categoryName;
                    // 获取行业划分
                    getServerData("class", "GM_SKU_CLASS", (skuClass) => {
                        if (!skuClass.data) {
                            return false;
                        }
                        const classObj = skuClass.data.find(item => item.trade.includes(categoryName));
                        if (!classObj) {
                            config.userFrom.class = {
                                value: "匹配失败",
                                color: "red"
                            };
                        } else {
                            config.userFrom.class = classObj.class;
                        }
                    })
                }
            })
        }
        if (superType) {
            // if (config.userFrom.grade) {
            //     if (config.userFrom.grade.includes("G5")) {
            //         config.userFrom.super = "B级达人";
            //     }
            //     if (config.userFrom.grade.includes("G6")) {
            //         config.userFrom.super = "A级达人";
            //     }
            //     return false;
            // }
            ObjectProperty(config.userFrom, "authorPin", _run);
            async function _run(params) {
                if (!params.value) {
                    return false;
                }
                getServerData("super-user", "GM_SUPER_USER", (superClass) => {
                    if (!superClass.data) {
                        return false;
                    }
                    const obj = superClass.data.find(item => item.user.includes(params.value));
                    if (obj) {
                        config.userFrom.super = obj.name;
                    }
                })
            }
        }
        // 下滑显示
        const leftContent = document.querySelector(".detail-content");
        const topGap = topDom.offsetHeight + 50;
        topDom.style.top = `-${topGap}px`;
        const upTop = ThrottleOver((e) => {
            if (e.target.scrollTop > 50) {
                topDom.style.top = "5px";
            } else {
                topDom.style.top = `-${topGap}px`;
            }
        }, 200);
        leftContent.onscroll = upTop;
    }

    // 禁止驳回、低质
    function dataDisableReject(params) {
        if (!params.sendBody) {
            return false;
        }
        const disableReject = SwitchRead("disable-reject");
        const noneStop = SwitchRead("Label-None-Stop");
        const sendBody = JSON.parse(params.sendBody);
        const url = params.openParam[1];
        // 素材驳回的请求
        if (/\/api\/biz\/review\/qc\/(block)/.test(url)) {
            if (!window.temporaryPass && disableReject.state && isContentId()) {
                setMsg("禁止驳回");
                return true;
            }
        }
        // 素材通过的请求
        if (/\/api\/biz\/review\/qc\/(pass)/.test(url)) {
            if (isLower()) {
                setMsg("禁止低质");
                return true;
            }
        }
        // 标签保存的请求
        if (/\/api\/biz\/review\/qc\/(labelSave)/.test(url)) {
            if (isLower()) {
                setMsg("禁止低质");
                return true;
            }
            if (!window.temporaryPass && noneStop.state) {
                const { qualityTagList, classifyTagList } = sendBody.qcLabelCustomizedInfo || {};
                const isNone = (qualityTagList || []).length <= 0 && (classifyTagList || []).length <= 0;
                if (isNone) {
                    setMsg("空标签");
                    return true;
                }
            }
        }
        function isLower() {
            if (!window.temporaryPass && disableReject.lower && isContentId()) {
                if (sendBody.qcQualityManualState === 3 || sendBody.qualityManualState === 3) {
                    return true;
                }
            }
        }
        function setMsg(text) {
            const tipMsg = MessageTip("❌", [{
                name: "span",
                innerHTML: text
            }, {
                name: "a",
                style: "margin-left: 5px;",
                innerHTML: "允许",
                click() {
                    tipMsg.remove();
                    MessageTip("✔️", "已临时允许", 2, 2);
                    window.temporaryPass = true;
                }
            }], 5, 2);
        }
        // 判断是否是设置的id
        function isContentId() {
            if (typeof window.temporaryIsID === "boolean") {
                return window.temporaryIsID;
            }
            const contentId = GetQueryString("contentId");
            if (disableReject.value.includes(contentId)) {
                window.temporaryIsID = true;
            } else {
                window.temporaryIsID = false;
            }
            return window.temporaryIsID;
        }
    }

    // 商卡图片预览
    function sukImgDisplay() {
        const SKUPreview = SwitchRead("SKU-Preview");
        if (!SKUPreview.state) {
            return false;
        }
        const skuListArr = document.querySelectorAll(".antcap-list-item-meta");
        for (const list of skuListArr) {
            list.style.position = "relative";
            const skuAvatarArr = list.querySelectorAll(".antcap-list-item-meta-avatar");
            for (const skuImg of skuAvatarArr) {
                const img = skuImg.querySelector("img");
                skuImg.style.position = "relative";
                if (img.complete) {
                    imgLoaded();
                } else {
                    img.addEventListener("load", imgLoaded);
                }
                // 图片加载完成后执行的操作
                async function imgLoaded() {
                    const skuBigDom = await AddDOM({
                        addNode: list,
                        addData: [{
                            name: "div",
                            className: "sku-big-img",
                            style: `left: ${skuImg.offsetLeft + img.offsetWidth + 10}px;`,
                            add: [{
                                name: "img",
                                src: img.src
                            }]
                        }]
                    }, 0);
                    const skuMask = await AddDOM({
                        addNode: skuImg,
                        addData: [{
                            name: "div",
                            className: "sku-mask"
                        }]
                    }, 0);
                    const skuBigImg = skuBigDom.querySelector("img");
                    PreviewImg(skuImg, skuMask, skuBigDom, skuBigImg);
                }
            }
        }
        function PreviewImg(skuImg, skuMask, skuBigDom, skuBigImg) {
            // 当在左边块内移动的时候
            skuImg.onmousemove = function (e) {
                // 设置小块不能移出左边大块，设置最大可移动的宽度值和最高高度值
                const maskMaxL = skuImg.offsetWidth - skuMask.offsetWidth;
                const maskMaxT = skuImg.offsetHeight - skuMask.offsetHeight;

                // 设置鼠标移动的时候，鼠标指针会处于在小块中间
                const top = Math.min(Math.max(e.offsetY - skuMask.offsetHeight / 2, 0), maskMaxT);
                const left = Math.min(Math.max(e.offsetX - skuMask.offsetWidth / 2, 0), maskMaxL);

                // 设置移动时小块的移动位置
                skuMask.style.top = top + "px";
                skuMask.style.left = left + "px";

                // 设置右边大图移动位置
                const rightImgL = -left / skuImg.offsetWidth * 100 + "%";
                const rightImgT = -top / skuImg.offsetHeight * 100 + "%";

                // 设置右边大图的动画
                skuBigImg.style.transform = "translate(" + rightImgL + "," + rightImgT + ")";
            }
            skuImg.onmouseenter = function () {
                // 显示预览图
                skuMask.style.display = "block";
                skuBigDom.style.display = "block";

                // 设置预览区动态高度
                skuBigDom.style.width = `${(skuImg.offsetWidth <= 100 ? skuImg.offsetWidth * 2 : skuImg.offsetWidth) + 60}px`;
                skuBigDom.style.height = `${(skuImg.offsetHeight <= 100 ? skuImg.offsetHeight * 2 : skuImg.offsetHeight) + 60}px`;
                skuBigDom.style.top = `${-(skuBigDom.offsetHeight - skuImg.offsetHeight) / 2}px`;

                // 获取右边块与右边大图的比例
                const mW = skuBigDom.offsetWidth / skuBigImg.offsetWidth;
                const mH = skuBigDom.offsetHeight / skuBigImg.offsetHeight;

                // 将左边块的大小乘以比例，求出小块的大小
                const mnW = skuImg.offsetWidth * mW;
                const mnH = skuImg.offsetHeight * mH;

                // 设置小块的大小
                skuMask.style.width = mnW + "px";
                skuMask.style.height = mnH + "px";
            }
            skuImg.onmouseleave = function () {
                skuMask.style.display = "none";
                skuBigDom.style.display = "none";
            }
            skuMask.style.display = "none";
            skuBigDom.style.display = "none";
        }
    }

    // 视频出现在视口时，自动播放
    async function videoInWindowAuto() {
        const VideoAuto = SwitchRead("Video-Auto");
        if (!VideoAuto.state) {
            return false;
        }
        await AwaitImgLoaded(2000);
        const observer = new IntersectionObserver(onIntersection, { threshold: [0.5] });
        function onIntersection(entries) {
            entries.forEach(({ target, intersectionRatio }) => {
                if (intersectionRatio >= 0.5) {
                    videoPlay(target);
                    observer.unobserve(target);
                }
            })
        }
        function videoPlay(video) {
            const retryPlay = ThrottleOver(autoPlay, 200);
            function autoPlay() {
                document.removeEventListener("click", retryPlay);
                document.removeEventListener("keydown", retryPlay);
                if (video.readyState >= 2) {
                    _play();
                } else {
                    video.addEventListener("canplay", _play);
                }
                function _play() {
                    video.removeEventListener("canplay", _play);
                    video.play().catch(error => {
                        console.error("自动播放被阻止", error);
                        document.addEventListener("click", retryPlay);
                        document.addEventListener("keydown", retryPlay);
                    });
                }
            }
            autoPlay();
        }
        const videoAll = document.querySelectorAll(".detail-content video");
        videoAll.forEach((video) => observer.observe(video));
    }

    // 视频比例标注
    async function videoSmallHeight() {
        const VideoScale = SwitchRead("Video-Scale");
        if (!VideoScale.state) {
            return false;
        }
        const videoDivArr = document.querySelectorAll(".detail-content .audit-list-content-video>div");
        for (const videoDiv of videoDivArr) {
            makeVideo(videoDiv);
        }
        async function makeVideo(videoDiv) {
            const videoHeight = await AddDOM({
                addNode: videoDiv,
                addData: [{
                    name: "div",
                    id: "video-scale",
                    add: [{
                        name: "span",
                    }]
                }]
            }, 0)
            const vh = videoHeight.offsetParent.clientHeight;
            const vw = videoHeight.offsetParent.clientWidth;
            const scale = Math.min((vh * vh) / (vw * vw), (vw * vw) / (vh * vh)) * 100;
            if (vh > vw) {
                videoHeight.className = "scale-left";
                videoHeight.style.height = scale + "%";
                videoHeight.style.top = (100 - scale) / 2 + "%";
                WindowMove(videoHeight, videoHeight, (place) => {
                    videoHeight.style.top = (place.top / videoHeight.offsetParent.clientHeight) * 100 + "%";
                })
            } else {
                videoHeight.className = "scale-top";
                videoHeight.style.width = scale + "%";
                videoHeight.style.left = (100 - scale) / 2 + "%";
                WindowMove(videoHeight, videoHeight, (place) => {
                    videoHeight.style.left = (place.left / videoHeight.offsetParent.clientWidth) * 100 + "%";
                })
            }
            const span = videoHeight.querySelector("span");
            span.innerText = markScale(vw, vh);
            const cm1 = getPx("1cm");
            const wh = [(cm1 / 360) * 100, (cm1 / 640) * 100];
            AddDOM({
                addNode: videoDiv,
                addData: [{
                    name: "div",
                    id: "video-scale",
                    className: "scale-left",
                    style: `height: ${vh < vw ? wh[0] : wh[1]}%;top: 0;`,
                    function(element) {
                        WindowMove(element, element, (place) => {
                            element.style.top = (place.top / videoHeight.offsetParent.clientHeight) * 100 + "%";
                        })
                    },
                    add: [{
                        name: "span",
                        innerText: "1CM",
                    }]
                }, {
                    name: "div",
                    id: "video-scale",
                    className: "scale-top",
                    style: `width: ${vh > vw ? wh[0] : wh[1]}%;left: 0;`,
                    function(element) {
                        WindowMove(element, element, (place) => {
                            element.style.left = (place.left / videoHeight.offsetParent.clientWidth) * 100 + "%";
                        })
                    },
                    add: [{
                        name: "span",
                        innerText: "1CM",
                    }]
                }]
            });
            // 绘制视频尺寸
            const videoDom = videoDiv.querySelector("video");
            if (videoDom) {
                const setVideoSize = () => {
                    const isLowVideo = Math.min(videoDom.videoWidth, videoDom.videoHeight) < 720;
                    AddDOM({
                        addNode: videoDiv,
                        addData: [{
                            name: "div",
                            "msg-tip": isLowVideo ? "视频尺寸低于720P" : "",
                            className: `gm-video-size ${isLowVideo ? "active" : ""}`,
                            innerText: `${videoDom.videoWidth}x${videoDom.videoHeight}`,
                        }]
                    });
                    videoDom.removeEventListener("loadedmetadata", setVideoSize);
                };
                if (videoDom.videoWidth + videoDom.videoHeight === 0) {
                    videoDom.addEventListener("loadedmetadata", setVideoSize);
                } else {
                    setVideoSize();
                }
                GM_addStyle(`
                    .gm-video-size {
                        position: absolute;
                        top: 0;
                        left: calc(100% + 3px);
                        font-size: 12px;
                        user-select: text;
                        color: #a3acb0;
                    }
                    .gm-video-size.active {
                        padding: 2px;
                        border-radius: 3px;
                        color: #ffffff;
                        background: #ff0000;
                    }
                    .newDetailWrapper .gm-video-size {
                        top: auto;
                        right: 0;
                        left: auto;
                        bottom: calc(100% + 2px);
                    }
                `);
            }
        }
        function markScale(width, height) {
            if (height > width) {
                return "9:16";
            }
            return "16:9";
        }
        function getPx(params) {
            const div = document.createElement("div");
            div.style.width = params;
            document.body.appendChild(div);
            const cmWidthInPx = div.offsetWidth;
            document.body.removeChild(div);
            return cmWidthInPx;
        }
        GM_addStyle(`
            #video-scale {
                position: absolute;
                width: 18px;
                height: 18px;
                cursor: grab;
                transition: background 0.25s, border-color 0.25s, color 0.25s;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #a3acb0;
                font-size: 14px;
                z-index: 1;
            }
            #video-scale.scale-top {
                top: -18px;
                border-left: 2px solid #a0a9ad;
                border-right: 2px solid #a0a9ad;
            }
            #video-scale.scale-left {
                left: -18px;
                border-top: 2px solid #a0a9ad;
                border-bottom: 2px solid #a0a9ad;
            }
            #video-scale.scale-left span {
                transform: rotate(90deg);
            }
            #video-scale:active {
                cursor: grabbing;
            }
            #video-scale:hover,
            #video-scale:active {
                color: #ff0000;
                border-color: #ff0000;
                background: rgba(255,0,0,0.1);
            }
        `)
    }

    // 优化进度条位置
    function videoProgressBar() {
        GM_addStyle(`
            /*视频*/
            .detail-content .audit-list-content-video {
                margin-bottom: 10px !important;
            }
            .detail-content .video-react .video-react-control-bar {
                position: absolute !important;
                bottom: -30px !important;
                background: linear-gradient(to top, rgba(0,0,0,0), rgba(43,51,63,0.4)) !important;
            }
            .detail-content .video-react-fullscreen .video-react-control-bar {
                position: absolute !important;
                bottom: 0 !important;
                background-color: rgba(43,51,63,0.5) !important;
            }
            /*新质检页面*/
            .newDetailWrapper .detail-content .audit-list-content-video {
                margin-bottom: 20px !important;
            }
        `)
    }

    // 快捷切换倍速
    async function videoRateFast() {
        const rateFastConfig = SwitchRead("Video-Rate-Fast");
        if (!rateFastConfig.state) {
            return false;
        }
        const videoArr = await AwaitSelectorShow(() => {
            const videoAll = document.querySelectorAll(".detail-content .video-react-video");
            if (videoAll.length) {
                return videoAll;
            }
        });
        for (const video of videoArr) {
            const videoDiv = video && video.parentNode;
            if (!videoDiv && !video) {
                return false;
            }
            const SaveRate = SwitchRead("Save-Rate");
            if (!!SaveRate.state) {
                video.playbackRate = GET_DATA("GM_CONFIG", {}).videoRate || 1;
            }
            const Rate = rateFastConfig.value.filter((item) => item <= 4); // [4, 3, 2, 1.5, 1, 0.5]
            const videoRate = await AddDOM({
                addNode: videoDiv,
                addData: [{
                    name: "div",
                    id: "video-rate"
                }]
            }, 0);
            for (const num of Rate) {
                await AddDOM({
                    addNode: videoRate,
                    addData: [{
                        name: "span",
                        className: num === video.playbackRate ? "active" : "",
                        id: "Rate" + Rate.indexOf(num),
                        innerHTML: num.toFixed(1),
                        click: () => {
                            video.play();
                            restRate(num);
                        }
                    }]
                })
            }
            video.style.transition = "transform 0.25s";
            const videoMsg = MessageTip();
            await AddDOM({
                addNode: videoRate,
                addData: [{
                    name: "span",
                    style: "position: relative;display: flex;align-items: center;justify-content: center;",
                    add: [{
                        name: "span",
                        style: "position: absolute;width: 2px;height: 60%;background: #ffffff;"
                    }, {
                        name: "span",
                        style: "width: 28px;height: 60%;border: 2px solid #ffffff;border-radius: 3px;"
                    }],
                    click: (_, element) => {
                        if (video._videoMirror) {
                            element.style.background = "";
                            video.style.transform = "scaleX(1)";
                            videoMsg("✔️", "视频已还原", 3, 2);
                        } else {
                            element.style.background = "rgba(255,0,0,0.7)";
                            video.style.transform = "scaleX(-1)";
                            videoMsg("✔️", "视频已镜像", 3, 2);
                        }
                        video._videoMirror = !video._videoMirror;
                    }
                }]
            }, 0);
            video.addEventListener("ratechange", () => restRate(video.playbackRate));
            async function restRate(index) {
                const active = videoRate.querySelector(".active");
                active && active.classList.remove("active");
                const spanRate = videoRate.querySelector("#Rate" + Rate.indexOf(index));
                spanRate && spanRate.classList.add("active");
                video.playbackRate = index;
                SET_DATA("GM_CONFIG", { videoRate: index });
            }
        }
    }

    // 视频滚轮事件
    function videoScrollEvent() {
        const VideoScroll = SwitchRead("Video-Scroll");
        if (!VideoScroll.state) {
            return false;
        }
        const volumeMsg = MessageTip();
        function handleScroll(event) {
            const target = event.target;
            if (!(target instanceof HTMLVideoElement)) {
                return false;
            }
            if (event.shiftKey && event.ctrlKey) {
                event.preventDefault();
                const scrollAmount = event.deltaY > 0 ? target.volume - 0.05 : target.volume + 0.05;
                const volume = Math.min(1, Math.max(0, scrollAmount));
                const volumeNum = (volume * 100).toFixed(0);
                target.volume = volumeNum * 0.01;
                const volumeIco = volumeNum <= 0 ? "🔇" : volumeNum <= 20 ? "🔈" : volumeNum <= 60 ? "🔉" : "🔊";
                volumeMsg(volumeIco, "音量：" + volumeNum, 2, 2);
            } else if (event.shiftKey) {
                event.preventDefault();
                const scrollAmount = event.deltaY > 0 ? 0.5 : -0.5;
                target.currentTime += scrollAmount;
            }
        }
        window.addEventListener("wheel", handleScroll, { passive: false });
    }

    // 优化标签切换速度，自动跳过空标签
    function labelFastNext() {
        const LabelFast = SwitchRead("Label-Fast");
        if (!LabelFast.state) {
            return false;
        }
        const wrapArr = document.querySelectorAll(".antcap-tabs-nav-wrap");
        for (const elem of wrapArr) {
            elem.addEventListener("click", () => RunFrame(RunFast, 1));
        }
        RunFrame(RunFast, 1);
        function RunFast() {
            const switcher = document.querySelectorAll(".antcap-tree-icon-hide>li");
            switcher.forEach((elem) => {
                if (elem._isRunFast) {
                    return false;
                }
                elem._isRunFast = true;
                const fastConfig = {
                    index: 0,
                    parent: [],
                    classNode: elem
                };
                elem.addEventListener("click", (event) => {
                    const target = event.target;
                    fastConfig.parent = elem.querySelectorAll(".tree-node-title.leaf-parent-node");
                    if (target.id && target.className === "tree-node-title leaf-parent-node") {
                        const index = Array.from(fastConfig.parent).indexOf(target);
                        fastConfig.index = Math.max(index, 0);
                    }
                    if (target.id && target.className === "tree-leaf-node-title") {
                        WaylaySetTimeOut([{
                            delay: 500,
                            callString: "click()",
                            callback: ({ config }) => {
                                config.reScore();
                            }
                        }])
                        if (labelPersonify(event)) {
                            return false;
                        }
                        FastNext(fastConfig);
                    }
                })
            })
        }
        function FastNext(params) {
            const { parent, index, classNode } = params;
            const nextNode = parent[index + 1];
            if (index >= parent.length || !nextNode) {
                return false;
            }
            RunFrame(() => {
                const leafNode = classNode.querySelectorAll(".tree-leaf-node-title"); // 总标签数
                const treeNode = classNode.querySelectorAll(".antcap-tree-node-selected"); // 已选中的标签数
                if (leafNode.length === 0 || treeNode.length === 1 || LabelFast.textarea.includes(parent[index].textContent)) {
                    nextNode.click();
                    FastNext({ ...params, index: index + 1 }, false);
                }
            })
        }
    }

    // 自动切换质量结果
    async function labelAutoQc() {
        const LabelAuto = SwitchRead("Label-Auto-Qc");
        if (!LabelAuto.state) {
            return false;
        }
        const detailMachine = await AwaitSelectorShow(".detail-machine");
        const infoResult = await AwaitSelectorShow(".detail-machine .info-result");
        // 如果存在打标对比，则不执行
        const markingList = document.querySelector(".detail-opinion .marking-list");
        if (markingList) {
            return false;
        }
        ObjectProperty(config.labelAll, "qualityTagTreeResult", _run);
        function _run(params) {
            if (!params.value) {
                return false;
            }
            const { children } = params.value;
            const lowList = children.find((list) => list.name === "低质特征");
            const lowLabelArr = lowList.children.map((list) => list.contentTagBdsResultList.map((item) => item.name)).flat();
            lowLabelArr.push(...LabelAuto.textarea);
            const autoQr = ThrottleOver(() => {
                const tagArr = infoResult.querySelectorAll(".antcap-tag");
                const pass = detailMachine.querySelector("#qcQualityManualState input[value='1'],#qualityManualState input[value='1']");
                const passLow = detailMachine.querySelector("#qcQualityManualState input[value='3'],#qualityManualState input[value='3']");
                for (const list of tagArr) {
                    if (lowLabelArr.includes(list.innerText)) {
                        return passLow && passLow.click();
                    }
                }
                pass && pass.click();
            }, 10);
            autoQr();
            ObserverDOM(autoQr).observe(infoResult, {
                childList: true,
                subtree: true,
            });
        }
    }

    // 无历史素材禁止打风格、鲜明度
    function labelPersonify(event) {
        const AuditPersonify = SwitchRead("Audit-Personify");
        if (!AuditPersonify.state) {
            return false;
        }
        const labelID = event.target.id;
        const personify = document.querySelector(".personify-audit .value-videos");
        const labelClass = ["444_5303", "444_5306", "444_5310", "444_8132", "444_5308", "444_5309", "444_5302"];
        const idMate = /(\d+_?\d+)/;
        const match = labelID.match(idMate);
        if (match) {
            const isLabel = labelClass.includes(match[0]);
            if (isLabel && !personify) {
                event.stopPropagation();
                MessageTip("❌", "无历史素材，禁止打标", 3, 2);
                return true;
            }
        }
    }

    // 显示标签规则
    async function labelRulesPlay() {
        const LabelRule = SwitchRead("Label-Rule");
        if (!LabelRule.state) {
            return false;
        }
        let rulesArr = {};
        getServerData("video-label", "GM_LABEL_RULES", (labelObj) => {
            rulesArr = labelObj;
        })
        const list = document.querySelectorAll(".antcap-card-body .audit-list-content-custom");
        list.forEach(function (ele) {
            ele.addEventListener("mouseover", displayTip);
        })
        function displayTip(event) {
            const id = event.target.id;
            if (!!id && !!rulesArr.data && !event.target._isTooltipRun) {
                const rulesObj = rulesArr.data.find(key => key.id.startsWith(id));
                if (!!rulesObj) {
                    let text = null;
                    const skuClass = config.userFrom.class;
                    if (!!skuClass && !!rulesObj[skuClass]) {
                        text = rulesObj[skuClass];
                    } else {
                        text = rulesObj.default;
                    }
                    Tooltip({ text, node: event.target, place: "bottom" });
                    event.target._isTooltipRun = true;
                }
            }
            return false;
        }
    }

    // 打标按钮禁止选中文本
    function labelBanPick() {
        const LabelBanPick = SwitchRead("Label-Ban-Pick");
        if (!LabelBanPick.state) {
            return false;
        }
        GM_addStyle(`
            .leaf-parent-node,
            .tree-leaf-node-title {
                user-select: none !important;
            }
        `)
    }

    // 话题高亮 & 标签自动隐藏
    function lightTalkLabel() {
        const talkLabel = SwitchRead("Light-TalkLabel");
        if (!talkLabel.state) {
            return false;
        }
        const talkContentArr = document.querySelectorAll(".antcap-tabs-content>div");
        const talkTabArr = document.querySelectorAll(".antcap-tabs-tab");
        talkTabArr.forEach((list, index) => {
            if (list.textContent.includes("话题审核")) {
                RunFrame(() => {
                    list.click();
                    talkContentArr[index].style = "background: #e9f5ff;border-radius: 8px;padding: 0 8px;";
                }, 1)
            }
            list.addEventListener("click", () => {
                displayLabel(talkContentArr[index]);
            });
        })
        // 没有话题审核时隐藏标签
        const animated = document.querySelector(".antcap-tabs-nav-animated");
        if (!!animated && !animated.textContent.includes("话题审核")) {
            displayLabel(talkContentArr[0]);
        }
        function displayLabel(dom) {
            RunFrame(() => {
                const switcher = dom.querySelectorAll(".antcap-tree-block-node>li>span:nth-child(1)");
                for (const span of switcher) {
                    if (span.className.includes("open")) {
                        RunFrame(() => {
                            span.click();
                        })
                    }
                }
            })
        }
    }

    // 视频查重
    async function videoRepeatTest() {
        const VPNRepeat = SwitchRead("Repeat-VPN");
        if (!VPNRepeat.state) {
            return false;
        }
        const collapse = document.querySelectorAll(".antcap-collapse-item");
        const talentText = config.talentText;
        const drHomeUrl = "https://eco.m.jd.com/content/dr_home/index.html?channel=shenhepingtai&authorId=";
        ObjectProperty(config.userFrom, "talentLevel", async (params) => {
            if (!params.value) {
                return false;
            }
            params.stop();
            const userType = config.userFrom.userType;
            const talentLevel = config.userFrom.talentLevel;
            for (const list of collapse) {
                const extra = list.querySelector(".antcap-collapse-extra");
                if (!extra) {
                    continue;
                }
                const tag = await AddDOM({
                    addData: [{
                        name: "span",
                        add: [Tooltip({
                            text: "当前素材用户主页",
                            node: [{
                                name: "span",
                                className: "antcap-tag",
                                style: "cursor: pointer;",
                                innerHTML: talentText[talentLevel] || "未知等级",
                                click: (event) => {
                                    event.stopPropagation();
                                    userHome(list);
                                },
                                function: (element) => {
                                    if (["G5", "G6", "G7"].some(str => talentText[talentLevel].includes(str))) {
                                        element.style.color = "#ffffff";
                                        element.style.background = "#ff6666";
                                        element.classList.add("antcap-tag-has-color");
                                    }
                                }
                            }]
                        }), {
                            name: "span",
                            className: "antcap-tag antcap-tag-has-color",
                            style: `background: ${userType.background};`,
                            innerHTML: userType.value
                        }]
                    }]
                }, 0)
                extra.insertBefore(tag, extra.firstChild);
                const { childNodes = [] } = list.querySelector(".antcap-collapse-header") || {};
                childNodes.forEach((node, index) => {
                    if (index === 0 || index === childNodes.length - 1) {
                        return false;
                    }
                    if (index === 1) {
                        return node.innerHTML && (node.innerHTML = " ") || (node.textContent = " ");
                    }
                    node.textContent = "";
                })
                markHigInfo(list);
            }
        })
        function markHigInfo(params) {
            const labelSpan = params.querySelector(".antcap-collapse-content-box label>span:nth-child(2)");
            if (labelSpan) {
                const str = labelSpan.innerText;
                const regex = /:([^)]+)/;
                const match = str.match(regex);
                if (match && match[1]) {
                    let infoText = str;
                    const result = match[1].trim();
                    result.split("-").filter((item) => !item.includes("非")).forEach((item) => {
                        infoText = infoText.replace(item, `<span class="gm-text-light" style="background: #ff4444;line-height: 1.5;">${item}</span>`);
                    });
                    labelSpan.innerHTML = infoText;
                }
            }
        }
        function userHome(params) {
            const content = params.querySelector(".antcap-collapse-content-box");
            const userHome = params.querySelector(".antcap-collapse-content-box #user-home-iframe");
            if (!userHome) {
                const userHomeDom = AddDOM({
                    addData: [{
                        name: "div",
                        id: "user-home-iframe",
                        style: "display: flex;align-items: center;justify-content: center;border-radius: 6px;box-shadow: inset 0 0 0 1px #d9d9d9;",
                        add: [{
                            name: "div",
                            style: "width: 100%;height: 100%;",
                            add: [{
                                name: "iframe",
                                frameborder: 0,
                                allowfullscreen: true,
                                style: "border-radius: 6px;border: solid 1px #d8d8d8;",
                            }, {
                                name: "div",
                                id: "open",
                                innerHTML: shareAltIco,
                            }]
                        }, {
                            name: "div",
                            id: "video-loading"
                        }, {
                            name: "div",
                            id: "video-msg",
                            style: "text-align: center;",
                            add: [{
                                name: "div",
                                innerHTML: "获取失败，请检查VPN状态、网络"
                            }, {
                                name: "button",
                                className: "gm-button",
                                style: "margin-top: 20px;",
                                innerHTML: "重试",
                                click: () => {
                                    userHomeDom.then(getUserHome);
                                }
                            }]
                        }]
                    }]
                }, 0).then((div) => {
                    content.insertBefore(div, content.firstChild);
                    getUserHome(div);
                    return div;
                })
            } else if (userHome.style.height !== userHome.setHeight) {
                scrollToOld(userHome, userHome.setHeight);
            } else if (userHome.style.height === userHome.setHeight) {
                return userHome.style.height = 0;
            }
        }
        function getUserHome(userHome) {
            userHome.setHeight = "180px";
            userHome.style.height = "180px";
            blockDom(1, userHome.childNodes);
            const contentId = GetQueryString("contentId");
            const iframe = userHome.querySelector("iframe");
            const open = userHome.querySelector("#open");
            Contentexamination(contentId).then((xhr) => {
                const authorId = JSON.parse(xhr.responseText).result.authorId;
                const openUrl = drHomeUrl + authorId;
                iframe.src = openUrl + "&page=ver.jd.com";
                open.onclick = () => {
                    window.open(openUrl);
                }
                userHome.setHeight = "640px";
                scrollToOld(userHome, "640px");
                blockDom(0, userHome.childNodes);
            }).catch((error) => {
                userHome.setHeight = "180px";
                userHome.style.height = "180px";
                blockDom(2, userHome.childNodes);
                console.error(error);
            })
        }
        function blockDom(index, children) {
            for (let i = 0; i < children.length; i++) {
                children[i].style.display = "none";
                if (index === i) {
                    children[i].style.display = "block";
                }
            }
        }
        ObjectProperty(config.videoList, "type", rewriteList);
        function rewriteList() {
            const groupArr = document.querySelectorAll(".antcap-radio-group-outline>div>div");
            const videoList = config.videoList.list;
            if (videoList.length !== groupArr.length) {
                return false;
            }
            groupArr[0] && tipOut(groupArr[0]);
            for (const list of groupArr) {
                editDom(list, videoList);
            }
        }
        async function tipOut(element) {
            const AutoVideo = SwitchRead("Repeat-Auto-Video");
            if (config.videoRepeat.tipOutRun) {
                return false;
            }
            config.videoRepeat.tipOutRun = true;
            const tipRepeat = SwitchRead("Tip-Repeat");
            if (!tipRepeat.state) {
                return false;
            }
            const tipDiv = await AddDOM({
                addNode: document.querySelector(".detail-machine"),
                addData: [{
                    name: "div",
                    className: "jd-tip-affix",
                    add: [{
                        name: "button",
                        className: "gm-button danger",
                        innerHTML: "查↓重"
                    }]
                }]
            }).then((div) => {
                const button = div.querySelector("button");
                return {
                    block: () => button.style.display = "block",
                    none: () => {
                        button.style.display = "none";
                        if (!element._videoRun && AutoVideo.state) {
                            element.click();
                            element._videoRun = true;
                        }
                    },
                    click: (callback) => button.addEventListener("click", callback)
                }
            })
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.boundingClientRect.y > 0) {
                        if (entry.isIntersecting) {
                            tipDiv.none();
                        } else {
                            tipDiv.block();
                        }
                    }
                });
            });
            observer.observe(element);
            tipDiv.click(() => {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                })
            })
        }
        function editDom(divElement, videoList) {
            divElement.id = "repeat-list";
            const aDom = divElement.querySelector("a");
            const videoObj = videoList.find(item => item.cid === aDom.textContent);
            divElement.innerHTML = "";
            // 注册事件
            divElement.addEventListener("click", () => {
                getVideo(divElement, videoObj);
                divElement._videoRun = true;
            });
            AddDOM({
                addNode: divElement,
                addData: [{
                    name: "span",
                    function: (element) => {
                        ObjectProperty(config.userFrom, "authorPin", (params) => {
                            if (!params.value) {
                                return false;
                            }
                            params.stop();
                            if (videoObj.pin === params.value) {
                                const style = "transition: left 0.25s;margin-top: 15px;left: 4px;";
                                const styleRed = "padding: 8px 4px;background: #ff0000;";
                                element.id = "repeat-pin-info";
                                element.style = style + styleRed;
                                divElement.addEventListener("mouseover", () => {
                                    element.innerHTML = "作者相同";
                                    element.style = style + "margin-top: 4px;left: -60px;transition: none;";
                                });
                                divElement.addEventListener("mouseout", () => {
                                    element.innerHTML = "";
                                    element.style = style + styleRed;
                                });
                            }
                        })
                    }
                }, {
                    name: "span",
                    innerHTML: "内容ID："
                }, Tooltip({
                    text: "点击复制",
                    node: [{
                        name: "span",
                        id: "repeat-light",
                        className: "gm-text-light contentId",
                        innerHTML: videoObj.cid,
                        click: (e) => {
                            e.stopPropagation();
                            CopyText(videoObj.cid)
                                .then(() => {
                                    MessageTip("✔️", "已复制内容ID", 3, 2);
                                })
                                .catch(() => {
                                    MessageTip("❌", "复制失败", 3, 2);
                                })
                        }
                    }]
                }), Tooltip({
                    text: "用户主页",
                    node: [{
                        name: "span",
                        id: "repeat-light",
                        className: "gm-text-light",
                        innerHTML: talentText[videoObj.talentLevel] || "未知等级",
                        click: (e) => {
                            e.stopPropagation();
                            goUserPage(divElement, videoObj);
                        },
                    }]
                }), {
                    name: "span",
                    function: (element) => {
                        ObjectProperty(config.userFrom, "contentId", (params) => {
                            if (!params.value) {
                                return false;
                            }
                            params.stop();
                            const cid = config.userFrom.contentId;
                            const idDiff = videoObj.cid - cid;
                            const index = Math.max(0, Math.min(1, idDiff));
                            const textObj = [{
                                text: "更早",
                                info: "比审核素材更“早”发布"
                            }, {
                                text: "更晚",
                                info: "比审核素材更“晚”发布"
                            }];
                            AddDOM({
                                addNode: element,
                                addData: [Tooltip({
                                    text: textObj[index].info,
                                    node: [{
                                        name: "span",
                                        id: "repeat-light",
                                        className: "gm-text-light",
                                        innerHTML: textObj[index].text,
                                        click: (e) => {
                                            e.stopPropagation();
                                            window.open(aDom.href)
                                        }
                                    }]
                                })]
                            })
                        })
                    }
                }, {
                    name: "span",
                    innerHTML: "、相似度："
                }, {
                    name: "span",
                    innerHTML: videoObj.radio
                }, {
                    name: "span",
                    innerHTML: "、重复帧："
                }, (() => {
                    const ratio = Number(videoObj.repeat);
                    return {
                        name: "span",
                        className: "gm-text-light",
                        innerHTML: videoObj.repeat,
                        style: `background: rgb(255, ${230 - ratio * 230} ,${230 - ratio * 230});`
                    }
                })(), {
                    name: "span",
                    innerHTML: "、"
                }, (() => {
                    const typeColor = {
                        "达人": "#52c41a",
                        "商家": "#faad14",
                        "供应商": "#52c41a"
                    }
                    const keys = Object.keys(typeColor);
                    const isKey = keys.find(key => videoObj.talentTagName.includes(key));
                    const color = typeColor[isKey] || "#389fff";
                    return {
                        name: "span",
                        className: "gm-text-light",
                        innerHTML: videoObj.talentTagName,
                        style: `background: ${color};`
                    }
                })(), {
                    name: "span",
                    innerHTML: "、"
                }, (() => {
                    if (/旗舰店$|自营店$|专营店$|京东创作者/.test(videoObj.pin)) {
                        return {
                            name: "span",
                            className: "gm-text-light",
                            innerHTML: videoObj.pin,
                            style: "background: #ff4444;"
                        }
                    }
                    return {
                        name: "span",
                        innerHTML: videoObj.pin
                    }
                })(), (() => {
                    if (!videoObj.videoCopyProtectInfo) {
                        return {};
                    }
                    const { message } = videoObj.videoCopyProtectInfo;
                    let infoText = message;
                    message.split("-").filter((item) => !item.includes("非")).forEach((item) => {
                        infoText = infoText.replace(item, `<span class="gm-text-light" style="background: #ff4444;">${item}</span>`);
                    });
                    return {
                        name: "span",
                        add: [{
                            name: "span",
                            innerHTML: "、"
                        }, {
                            name: "span",
                            innerHTML: infoText
                        }]
                    };
                })(), (() => {
                    const skuShow = SwitchRead("Repeat-Sku-Show");
                    if (!skuShow.state) {
                        return {};
                    }
                    function setSku(params, elem) {
                        AddDOM({
                            addNode: elem,
                            addData: params.map((item) => ({
                                name: "div",
                                style: "border-radius: 4px;display: flex;justify-content: space-between;",
                                id: "repeat-light",
                                click(e) {
                                    e.stopPropagation();
                                    window.open(`https://item.jd.com/${item.content.skuId}.html`)
                                },
                                add: [{
                                    name: "span",
                                    innerHTML: item.content.skuId,
                                }, {
                                    name: "span",
                                    innerHTML: config.allSku.some((obj) => obj.id === item.content.skuId) ? "SKU相同" : "",
                                }]
                            }))
                        })
                    }
                    return {
                        name: "div",
                        function(elem) {
                            Contentexamination(videoObj.cid).then((xhr) => {
                                const { result } = JSON.parse(xhr.responseText);
                                const description = JSON.parse(result.description);
                                const skuArr = description.filter((item) => item.type == 3);
                                if (skuArr.length <= 0) {
                                    return AddDOM({
                                        addNode: elem,
                                        addData: [{
                                            name: "span",
                                            innerHTML: "无SKU"
                                        }]
                                    })
                                }
                                setSku(skuArr, elem);
                            }).catch((error) => {
                                console.error(error);
                                AddDOM({
                                    addNode: elem,
                                    addData: [{
                                        name: "span",
                                        innerHTML: "获取SKU失败"
                                    }]
                                })
                            })
                        }
                    }
                })()]
            })
        }
        async function removeVideo(idName) {
            const videoRadioAll = document.querySelectorAll(idName);
            for (const item of videoRadioAll) {
                item.httpStop = true;
                const video = item.querySelector("video");
                if (video) {
                    video.pause();
                }
                item.style.height = "0";
            }
        }
        function scrollToOld(divDom, height) {
            divDom.style.height = typeof height === "number" ? height + "px" : height;
            setTimeout(() => {
                divDom.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                })
            }, 250)
        }
        async function goUserPage(videoItem, videoObj) {
            const userIframe = videoItem.querySelector("#user-iframe");
            const domWidth = videoItem.clientWidth / (9 / 16);
            const domHeight = userIframe && userIframe.clientHeight;
            removeVideo("#user-iframe");
            removeVideo("#video-radio");
            if (userIframe) {
                if (domHeight === 0) {
                    scrollToOld(userIframe, domWidth);
                }
                return false;
            }
            const openUrl = drHomeUrl + videoObj.authorId;
            const videoDom = await AddDOM({
                addNode: videoItem,
                addData: [{
                    name: "div",
                    id: "user-iframe",
                    click: (e) => {
                        e.stopPropagation();
                    },
                    add: [{
                        name: "iframe",
                        frameborder: 0,
                        allowfullscreen: true,
                        src: openUrl + "&page=ver.jd.com"
                    }, {
                        name: "div",
                        id: "open",
                        innerHTML: shareAltIco,
                        click: () => {
                            window.open(openUrl);
                        }
                    }]
                }]
            }, 0)
            setTimeout(() => scrollToOld(videoDom, domWidth));
        }
        async function getVideo(videoItem, videoObj) {
            const videoRadio = videoItem.querySelector("#video-radio");
            const domHeight = videoRadio && videoRadio.clientHeight;
            removeVideo("#user-iframe");
            removeVideo("#video-radio");
            if (videoRadio) {
                if (domHeight === 0) {
                    videoRadio.httpStop = false;
                    const children = videoRadio.children;
                    if (children[0].src) {
                        blockDom(0, children);
                        const height = children[0].offsetHeight;
                        scrollToOld(videoRadio, height);
                        children[0].currentTime = 0;
                        children[0].play();
                        return false;
                    }
                    _runGet(videoRadio);
                }
                return false;
            }
            // 视频获取函数
            async function getData(videoDom, retry = 3) {
                if (!videoDom || !!videoDom.httpStop) {
                    return false;
                }
                if (retry === 0) {
                    return {
                        msg: "获取视频失败，请检查VPN状态、网络"
                    };
                }
                const contentId = videoObj.cid;
                return new Promise((resolve, reject) => {
                    Contentexamination(contentId).then((xhr) => {
                        const data = JSON.parse(xhr.responseText);
                        const description = JSON.parse(data.result.description);
                        const mp4Obj = description.find(list => list.content.mp4Url !== undefined);
                        if (mp4Obj) {
                            resolve({ src: mp4Obj.content.mp4Url });
                        } else {
                            resolve({
                                msg: "没有找到视频"
                            });
                        }
                    }).catch((error) => {
                        console.error(error);
                        resolve(getData(videoDom, retry - 1));
                    })
                });
            }
            const videoDom = await AddDOM({
                addNode: videoItem,
                addData: [{
                    name: "div",
                    id: "video-radio",
                    click: (e) => {
                        e.stopPropagation();
                    },
                    add: [{
                        name: "video",
                        preload: "none",
                        controls: "controls",
                        autoplay: "autoplay",
                    }, {
                        name: "div",
                        id: "video-loading"
                    }, {
                        name: "div",
                        id: "video-msg",
                        add: [{
                            name: "div",
                            innerHTML: "获取视频失败，请检查VPN状态、网络"
                        }, {
                            name: "button",
                            className: "gm-button",
                            innerHTML: "重试",
                            click: () => {
                                _runGet();
                            }
                        }]
                    }]
                }]
            }, 0)
            setTimeout(_runGet);
            async function _runGet(divDom = videoDom) {
                const children = divDom.children;
                blockDom(1, children);
                divDom.style.height = "180px";
                const videoInfo = await getData(divDom);
                if (videoInfo === false) {
                    return false;
                }
                if (!!videoInfo.src) {
                    blockDom(0, children);
                    children[0].src = videoInfo.src;
                    children[0].addEventListener("loadeddata", function (e) {
                        const height = e.target.offsetHeight;
                        scrollToOld(divDom, height);
                    });
                } else {
                    blockDom(2, children);
                    scrollToOld(divDom, "180");
                    children[2].children[0].innerHTML = videoInfo.msg;
                    MessageTip("❌", "获取视频失败", 3, 2);
                }
            }
        }
    }

    // 是否私域露出提示文字
    function sphereCheckDisplay() {
        AwaitSelectorShow(".reject-content-wrapper").then((wrapper) => {
            const check = wrapper.querySelectorAll(".re-list label");
            if (!!check[0] && check[0].innerText === "否") {
                RunFrame(() => check[0].click());
                function editP(element, index = 3) {
                    if (index <= 0) { return false };
                    const parentP = element.parentNode.querySelector("p");
                    if (parentP && parentP.innerText.includes("私域露出")) {
                        parentP.style = "color: #ff0000;";
                        parentP.innerHTML = "所有驳回操作，都需要选“否”";
                    } else {
                        editP(element.parentNode, index - 1);
                    }
                }
                editP(check[0]);
            }
        });
    }

    // 隐藏2,3封面
    function imgDisplayClose() {
        const HideCover = SwitchRead("Hide-Cover");
        if (!!HideCover.state) {
            const auditList = document.querySelectorAll(".content-down .audit-list");
            for (const dom of auditList) {
                const img = dom.querySelector(".audit-list-content-picture img");
                if (!!img) {
                    dom.style.display = "none";
                }
            }
        }
    }

    // 高亮医疗保健
    async function medicineHlight() {
        const selected = await AwaitSelectorShow(".antcap-select-selection-selected-value");
        const _runTime = ThrottleOver(_run, 100);
        const observer = ObserverDOM((mutation) => {
            if (mutation.type === "attributes") {
                _runTime();
            }
        })
        observer.observe(selected, { attributes: true });
        _runTime();
        function _run() {
            const { title, style, parentNode } = selected;
            if (!title) {
                return false;
            }
            if (special.includes(title)) {
                parentNode.parentNode.style.background = "#faad14";
                style.color = "#ffffff";
                style.fontWeight = "bold";
            } else {
                parentNode.parentNode.style.background = "";
                style.color = "";
                style.fontWeight = "";
            }
        }
    }

    // 种草秀类目
    async function recommCategory() {
        const recomm = SwitchRead("Recomm-Category");
        if (!recomm.state) {
            return false;
        }
        ObjectProperty(config.userFrom, "category", overRun);
        async function overRun(params) {
            if (!params.value) {
                return false;
            }
            params.stop();
            const categoryText = [{
                name: "一级类目",
                value: params.value
            }, {
                name: "二级类目"
            }, {
                name: "三级类目"
            }];
            const skuId = config.sku.skuId;
            const queryID = [skuId.categoryOneId, skuId.categoryTwoId];
            for (let index = 0; index < queryID.length; index++) {
                const id = queryID[index];
                const findId = index === 0 ? skuId.categoryTwoId : skuId.categoryThreeId;
                try {
                    const xhr = await HTTP_XHR({
                        method: "GET",
                        url: "/api/biz/audit/manual/getSubCategories?categoryId=" + id
                    });
                    const { content } = JSON.parse(xhr.responseText);
                    const data = content.find(item => item.categoryId == findId);
                    categoryText[index + 1].value = data.categoryName;
                } catch (error) {
                    console.error(error);
                }
            }
            antcapCard({
                title: {
                    innerHTML: "商卡类目",
                    add: [{
                        name: "span",
                        innerHTML: "（第一个商卡的类目）"
                    }]
                },
                body: {
                    style: "padding: 10px",
                    add: [{
                        name: "div",
                        style: "display: flex;justify-content: space-around;",
                        add: categoryText.map((text) => ({
                            name: "div",
                            add: [{
                                name: "div",
                                style: "text-align: center;font-size: 12px;",
                                innerHTML: text.name
                            }, {
                                name: "div",
                                style: "text-align: center;font-size: 16px;",
                                innerHTML: text.value || "无"
                            }]
                        }))
                    }]
                }
            }).then((element) => {
                const detailMachine = document.querySelector(".detail-machine");
                const firstChild = detailMachine.firstElementChild;
                detailMachine.insertBefore(element, firstChild.nextSibling);
            })
        }
    }

    // 种草秀打标
    async function recommPersonify() {
        const recomm = SwitchRead("Recomm-Personify");
        const personify = document.querySelector(".personify-audit");
        if (!recomm.state || !personify) {
            return false;
        }
        const defaultConfig = { height: 500, width: 400 };
        const personConfig = GET_DATA("GM_CONFIG", {}).person || defaultConfig;
        const content = personify.querySelector(".item-content");
        content.style.display = "none";
        const iframeDom = personify.querySelector("#iframe-personify");
        if (iframeDom) {
            iframeDom.remove();
        }
        const href = personify.querySelector("a").href;
        const setConfig = ThrottleOver((params) => {
            personConfig.height = params.height || personConfig.height;
            personConfig.width = params.width || personConfig.width;
            SET_DATA("GM_CONFIG", {
                person: personConfig
            });
        }, 200);
        AddDOM({
            addNode: personify,
            addData: [{
                name: "div",
                id: "iframe-personify",
                add: [{
                    name: "div",
                    id: "title",
                    add: [{
                        name: "a",
                        href: href,
                        target: "_blank",
                        innerHTML: "素材页面"
                    }, {
                        name: "a",
                        innerHTML: "刷新",
                        click: () => {
                            recommPersonify();
                        }
                    }, {
                        name: "span",
                        innerHTML: "高x宽：",
                        add: [{
                            name: "input",
                            type: "number",
                            id: "height",
                            min: "0",
                            value: personConfig.height,
                            function: (input) => {
                                input.addEventListener("input", () => {
                                    const iframe = personify.querySelector("iframe");
                                    iframe.style.height = input.value + "px";
                                    setConfig({ height: input.value });
                                })
                            }
                        }, {
                            name: "input",
                            type: "number",
                            id: "width",
                            min: "0",
                            style: "margin-left: 3px;",
                            value: personConfig.width,
                            function: (input) => {
                                input.addEventListener("input", () => {
                                    const iframe = personify.querySelector("iframe");
                                    iframe.style.width = input.value + "px";
                                    setConfig({ width: input.value });
                                })
                            }
                        }]
                    }, {
                        name: "a",
                        innerHTML: "默认",
                        click: () => {
                            const height = personify.querySelector("#height");
                            height.value = defaultConfig.height;
                            const width = personify.querySelector("#width");
                            width.value = defaultConfig.width;
                            const iframe = personify.querySelector("iframe");
                            iframe.style.height = defaultConfig.height + "px";
                            iframe.style.width = defaultConfig.width + "px";
                            setConfig(defaultConfig);
                        }
                    }]
                }, {
                    name: "div",
                    id: "body",
                    add: [{
                        name: "div",
                        innerHTML: leftArrowIco,
                        click: () => {
                            window.history.back();
                        }
                    }, {
                        name: "iframe",
                        src: href,
                        frameborder: 0,
                        allowfullscreen: true,
                        style: `height: ${personConfig.height}px;width: ${personConfig.width}px;`,
                    }, {
                        name: "div",
                        innerHTML: leftArrowIco,
                        click: () => {
                            window.history.forward();
                        }
                    }]
                }]
            }]
        })
    }

    // 私域 - 文章
    function privateWenzhang() {
        const private = SwitchRead("Private-Wenzhang");
        if (!private.state) {
            return false;
        }
        ObjectProperty(config.userFrom, "userType", (params) => {
            if (!params.value) {
                return false;
            }
            params.stop();
            const contentText = document.querySelectorAll(".audit-list-content-text");
            let textNumber = 0;
            for (const text of contentText) {
                textNumber += text.innerText.length;
            }
            const span = {
                name: "span",
                style: "margin-left: 0;",
                className: `detail-result ${textNumber >= 60 ? "green" : "red"}`,
                innerText: textNumber
            };
            antcapCard({
                title: {
                    innerText: "复审信息"
                },
                body: {
                    add: [{
                        name: "p",
                        className: "detail-inst",
                        style: "font-size: 14px;",
                        innerText: "总字数：",
                        add: [span]
                    }]
                }
            }).then((element) => {
                const detailMachine = document.querySelector(".detail-machine");
                const firstChild = detailMachine.firstElementChild;
                detailMachine.insertBefore(element, firstChild.nextSibling);
            })
        })
    }

    // 原创声明高亮
    function originalHlight() {
        const Original = SwitchRead("Original-Hlight");
        if (!Original.state) {
            return false;
        }
        addClick("#qcClaimType");
        addClick("#currentClaimType");
        function addClick(idName) {
            const element = document.querySelector(idName);
            if (!element) {
                return false;
            }
            element.style = "border-radius: 5px;transition: 0.25s;";
            const isOriginal = ThrottleOver((params) => {
                const isChecked = params.classList.contains("antcap-radio-wrapper-checked");
                if (params.innerText === "原创声明" && isChecked) {
                    element.style.background = "#fbdddd";
                } else {
                    element.style.background = "";
                }
            }, 100);
            const label = element.querySelectorAll("label");
            for (const list of label) {
                list.addEventListener("click", () => {
                    isOriginal(list);
                })
                isOriginal(list);
            }
        }
    }

    // 只允许一个页面播放媒体
    function onePagePlayback() {
        const OnePlay = SwitchRead("One-Playback");
        if (!OnePlay.state) {
            return false;
        }
        const playMedia = [];
        const { postMessage } = WebLocalMessage("one-play-media").callback((event) => {
            if (event.data && playMedia.length && document.visibilityState !== "visible") {
                console.error("其它页面正在播放媒体");
                playMedia.forEach((media) => media.pause());
            }
        })
        const mediaElements = document.querySelectorAll("audio, video");
        for (const media of mediaElements) {
            media.addEventListener("play", () => {
                playMedia.push(media);
                postMessage(true);
            });
            media.addEventListener("pause", () => removePlay(media));
        }
        function removePlay(media) {
            const index = playMedia.indexOf(media);
            if (index !== -1) {
                playMedia.splice(index, 1);
            }
        }
    }

    // 显示标签
    function blockContentTags(showBack = 1, isDisplay = false) {
        const BlockTags = SwitchRead("Block-Tags");
        if (!BlockTags.state) {
            return false;
        }
        const cardArr = document.querySelectorAll(".ant-card,.antcap-card");
        const cardQc = [...cardArr].find((list) => list.querySelector(".ant-card-head,.antcap-card-head").innerText === "审核操作");
        if (!cardQc) {
            return MessageTip("❌", "显示审核标签失败", 5, 2);
        }
        const { isBlock, forceDisplay } = {
            isBlock(showState) {
                if (typeof showBack === "function") {
                    return showBack(showState);
                }
                return showState === showBack;
            },
            forceDisplay() {
                if (typeof isDisplay === "function") {
                    return isDisplay();
                }
                return isDisplay;
            }
        }
        const labelInfos = cardQc.querySelector(".custom-label-wrapper .label-infos");
        if (labelInfos) {
            if (forceDisplay()) {
                labelInfos.remove();
                function findClass(element, className, endClass) {
                    if (!element) {
                        return null;
                    }
                    if (element.classList && element.classList.contains(endClass)) {
                        return null;
                    }
                    if (element.classList && element.classList.contains(className)) {
                        return element;
                    }
                    return findClass(element.parentElement, className);
                }
                cardQc.querySelector(".antcap-tabs-content").addEventListener("click", (event) => {
                    if (findClass(event.target, "tree-leaf-node-title", "antcap-tabs-content")) {
                        event.stopPropagation(); // 阻止事件向上冒泡
                        MessageTip("❌", "禁止打标", 3, 2);
                    }
                });
            } else {
                return false;
            }
        }
        GetTaskDetailData().then((content) => {
            const tagList = [];
            const labelTag = content.auditList.find(list => list.subType === "label") || {};
            const { classifyTagList = [], qualityTagList = [], qualityTagTreeResult = {} } = (labelTag.value && JSON.parse(labelTag.value) || {});
            const qualityTagArr = qualityTagTreeResult.children || [];
            const lowTagList = (() => {
                const { children = [] } = qualityTagArr.find((item) => item.name === "低质特征") || {};
                const lowTagArr = children.flatMap((item) => item.contentTagBdsResultList);
                return lowTagArr.filter((list) => qualityTagList.find((item) => item.tagName === list.name)) || [];
            })();
            const negative = qualityTagList.find(item => item.tagName === "负向体感") || {};
            tagList.push(...classifyTagList, negative);
            ObjectProperty(config, "showState", (params) => {
                if (typeof params.value !== "number") {
                    return false;
                }
                params.stop();
                addTagPage(tagList, lowTagList, params.value);
            })
        }).catch((error) => {
            console.error(error);
            MessageTip("❌", "获取分类标签失败，请刷新", 5, 2);
        });
        function addTagPage(tagList, lowTagList, showState) {
            const lowTag = lowTagList.filter((item) => item.name);
            const antcapTag = tagList.filter((item) => item.tagName);
            [lowTag, antcapTag].forEach((list) => {
                if (list.length === 0) {
                    return list.push({
                        name: "span",
                        innerHTML: "空"
                    })
                }
                list.forEach((item, index, array) => {
                    array[index] = {
                        name: "span",
                        className: "antcap-tag",
                        innerHTML: item.tagName || item.name
                    }
                })
            })
            const tagDom = [{
                name: "div",
                className: "label-infos is-single",
                add: [{
                    name: "div",
                    className: "info-title",
                    innerHTML: "审核打标"
                }, {
                    name: "div",
                    className: "info-result",
                    add: [{
                        name: "span",
                        className: "info-label",
                        innerHTML: "打标结果："
                    }, ...antcapTag],
                }, isBlock(showState) ? {} : {
                    name: "div",
                    className: "info-result",
                    add: [{
                        name: "span",
                        className: "info-label",
                        innerHTML: "低质标签："
                    }, ...lowTag],
                }]
            }]
            const wrapper = cardQc.querySelector(".custom-label-wrapper");
            if (wrapper) {
                AddDOM({
                    addNode: wrapper,
                    addData: tagDom
                }).then((element) => {
                    wrapper.insertBefore(element, wrapper.firstChild);
                })
            } else {
                AddDOM({
                    addData: [{
                        name: "div",
                        className: "custom-label-wrapper",
                        style: "border-bottom: 1px solid #dfdfdf;",
                        add: tagDom
                    }]
                }).then((element) => {
                    const cardBody = cardQc.querySelector(".antcap-card-body");
                    cardBody.insertBefore(element, cardBody.firstChild);
                })
            }
        }
    }

    // 突出机审结果
    function machineOnlyBlock() {
        const MachineOnly = SwitchRead("Machine-Only");
        const MachineShow = SwitchRead("Machine-Auto-Show");
        const cardArr = document.querySelectorAll(".antcap-card");
        cardArr.forEach((element) => {
            if (/^机审详情/.test(element.textContent)) {
                machineRun(element);
            }
        })
        function machineRun(element) {
            const title = element.querySelector(".antcap-card-head-title");
            title.style = "display: flex;align-items: center;gap: 5px;";
            title.innerHTML = "";
            AddDOM({
                addNode: title,
                addData: [Tooltip({
                    text: "仅显示机审存疑的内容",
                    node: [SwitchBox({
                        checked: MachineOnly.state,
                        function: (event) => {
                            event.addEventListener("change", () => {
                                MachineOnly.state = event.checked;
                                SwitchWrite("Machine-Only", MachineOnly);
                                runBlock(element);
                            })
                        }
                    })]
                }), Tooltip({
                    text: "自动展开机审结果",
                    node: [SwitchBox({
                        checked: MachineShow.state,
                        function: (event) => {
                            event.addEventListener("change", () => {
                                MachineShow.state = event.checked;
                                SwitchWrite("Machine-Auto-Show", MachineShow);
                                showList(event.checked);
                                runBlock(element);
                            })
                        }
                    })]
                }), {
                    name: "div",
                    innerHTML: "机审详情<span>（驳回状态，点击驳回理由，可查看对应关系）</span>",
                }]
            })
            const textInst = element.querySelectorAll(".text-inst");
            textInst.forEach((elem) => {
                elem.addEventListener("click", () => runBlock(element));
            });
            function showList(isOpen) {
                if (textInst.length) {
                    const listType = /收起/.test(textInst[0].innerText);
                    if (isOpen && !listType) {
                        textInst[0].click();
                    }
                    if (!isOpen && listType) {
                        textInst[0].click();
                    }
                }
            }
            if (MachineShow.state) {
                showList(true);
            }
        }
        function runBlock(element) {
            const isBlock = !MachineOnly.state ? "" : "none";
            RunFrame(() => {
                const tableAll = element.querySelectorAll(".machine-table-with-bg");
                tableAll.forEach((elem) => {
                    const textContent = elem.textContent;
                    if (!textContent.includes("类型审核项机审结果")) {
                        return false;
                    }
                    const tbodyTr = elem.querySelectorAll("tbody tr");
                    const bordered = elem.querySelector(".antcap-table-bordered");
                    tbodyTr.forEach((list, index) => {
                        const span = list.querySelector(".reason-detail");
                        if (span && !span.style.color) {
                            list.style.display = isBlock;
                            bordered.style.borderBottom = isBlock;
                        }
                        if (span && span.style.color && tbodyTr.length === index + 1) {
                            bordered.style.borderBottom = "";
                        }
                    })
                })
            })
        }
    }

    // 实时直播间-自动计算观看时间
    function liveTimeJump() {
        const LiveJump = SwitchRead("Live-Time-Jump");
        if (!LiveJump.state) {
            return false;
        }
        const videoDom = document.querySelector(".detail-content video");
        const videoBar = addVideoBar();
        async function addVideoBar() {
            const videoProgress = await AwaitSelectorShow(".detail-content .video-react-progress-holder");
            // 在进度条加载片段
            return AddDOM({
                addNode: videoProgress,
                addData: [{
                    name: "div",
                    className: "live-timt-bar",
                }]
            })
        }
        // 数据
        const liveConfig = {
            intervalCallback: [],
            estimateBar: {},
        };
        setInterval(() => {
            if (!videoDom) {
                return false;
            }
            let inTime = false;
            const { intervalCallback } = liveConfig;
            const currentTime = videoDom.currentTime;
            const duration = videoDom.duration;
            // 判断是否在范围内
            for (const item of intervalCallback) {
                const [startTime, endTime, callback] = item;
                callback(currentTime, duration);
                // 减1s是为了短间隔的连贯性
                if (startTime - 1 <= currentTime && currentTime <= endTime) {
                    inTime = true;
                }
            }
            if (!LiveJump.autoPlay || inTime) {
                return false;
            }
            if (videoDom._isOver && !videoDom.paused) {
                videoDom._isOver = false;
                return videoDom.currentTime = intervalCallback[0][0];
            }
            if (!videoDom.paused) {
                const videoTime = intervalCallback.find(i => i[0] > currentTime);
                if (videoTime) {
                    return videoDom.currentTime = videoTime[0];
                } else {
                    videoDom._isOver = true;
                    videoDom.pause();
                }
            }
        }, 200);
        // 元素存在再载入
        const isRunMain = runMain();
        if (!isRunMain) {
            const observer = ObserverDOM(() => {
                if (observer.isRun) {
                    return observer.stop();
                }
                runMain(observer);
            });
            observer.observe(document.querySelector(".detail-right"), {
                childList: true,
                subtree: true,
            });
        }
        function runMain(observer = {}) {
            const itemBold = document.querySelectorAll(".detail-right .item-line.weight-bold");
            for (const item of itemBold) {
                if (item.textContent.includes("一审有效监看时段")) {
                    item.style.display = "flex";
                    observer.isRun = true;
                    AddDOM({
                        addNode: item,
                        addData: [Tooltip({
                            text: "根据“中断时间”计算“监看时段”",
                            node: [SwitchBox({
                                checked: LiveJump.diffCutoff,
                                function: (event) => {
                                    event.addEventListener("change", () => {
                                        LiveJump.diffCutoff = event.checked;
                                        SwitchWrite("Live-Time-Jump", LiveJump);
                                        markTime();
                                    })
                                }
                            })]
                        })]
                    })
                    AddDOM({
                        addData: [{
                            name: "div",
                            style: "display: flex;",
                            className: "item-line",
                            add: [{
                                name: "span",
                                className: "weight-bold",
                                innerHTML: "预估时间自动续播："
                            }, Tooltip({
                                text: "自动跳过非“预估视频时间”的片段（注意区分跳帧）",
                                node: [SwitchBox({
                                    checked: LiveJump.autoPlay,
                                    function: (event) => {
                                        event.addEventListener("change", () => {
                                            LiveJump.autoPlay = event.checked;
                                            SwitchWrite("Live-Time-Jump", LiveJump);
                                        })
                                    }
                                })]
                            })]
                        }]
                    }).then((div) => {
                        item.parentNode.insertBefore(div, item.nextSibling);
                    })
                    markTime();
                    return true;
                }
            }
        }
        function markTime() {
            ObjectProperty(config, "liveWatchTime", (params) => {
                if (!params.value) {
                    return false;
                }
                params.stop();
                const watchTime = params.value.watchTime;
                const stopTime = watchTime.interruptSituation.filter((item) => item.recoverTime !== null).map((item) => {
                    const timeObj = {
                        start: new Date(item.interruptTime).getTime(),
                        end: new Date(item.recoverTime).getTime()
                    }
                    return {
                        ...timeObj,
                        diff: timeObj.end - timeObj.start
                    }
                });
                const tableAll = document.querySelectorAll(".detail-right table");
                for (const table of tableAll) {
                    if (table.textContent.includes("序号预估视频时间自然时间")) {
                        const tr = table.querySelectorAll("tbody tr");
                        if (tr.length > 0) {
                            _run({
                                element: tr,
                                stopTime: stopTime,
                                watchTime: watchTime.firstAuditValidWatchTimeFrame || [],
                            });
                        }
                    }
                }
            })
            function _run(params) {
                const { element, stopTime, watchTime } = params;
                watchTime.forEach((item, index) => {
                    const natureTime = item.natureTime;
                    const dfTime = LiveJump.diffCutoff ? diffTime(natureTime, stopTime) / 1000 : 0;
                    const videoTime = item.estimateVideoTime.split("-").map((i) => Math.max(0, timeToSeconds(i) - dfTime));
                    const oldVideoTime = item.estimateVideoTime.split("-").map((i) => timeToSeconds(i) - dfTime);
                    const isNull = liveConfig.estimateBar[index];
                    !isNull && (liveConfig.estimateBar[index] = {});
                    liveConfig.estimateBar[index].videoTime = videoTime;
                    liveConfig.estimateBar[index].oldVideoTime = oldVideoTime;
                    !isNull && setPage({ index, element: element[index] });
                });
            }
        }
        function setPage(params) {
            const { index, element } = params;
            const estimateBar = liveConfig.estimateBar[index];
            const td2 = element.querySelector("td:nth-child(2)");
            td2.style.position = "relative";
            ObjectProperty(estimateBar, "oldVideoTime", (params) => {
                if (!Array.isArray(params.value)) {
                    return false;
                }
                if (params.value[0] < 0) {
                    td2.style.color = "#ff0000";
                } else {
                    td2.style.color = "";
                }
            })
            AddDOM({
                addNode: td2,
                addData: [{
                    name: "div",
                    className: "gm-live-video-time",
                    click() {
                        if (!videoDom) {
                            return MessageTip("❌", "没有找到视频", 3);
                        }
                        videoDom.currentTime = estimateBar.videoTime[0];
                        videoDom.play();
                    },
                    add: [{
                        name: "div",
                        add: [{
                            name: "div",
                            style: "position: relative;z-index: 1;",
                            innerHTML: [estimateBar, "videoTime", (value, setValue) => {
                                value && setValue(`${secondsToTime(value[0])}-${secondsToTime(value[1])}`);
                            }],
                        }, {
                            name: "span",
                        }]
                    }]
                }]
            }).then((div) => {
                const span = div.querySelector("span");
                const reActive = ThrottleOver(() => {
                    div.classList.remove("active");
                }, 1000)
                videoBar.then((barDom) => {
                    return AddDOM({
                        addNode: barDom,
                        addData: [{
                            name: "div",
                            className: "live-timt-range"
                        }]
                    })
                }).then((rangeDom) => {
                    const minToMax = (data, max = 100) => Math.min(Math.max(data, 0), max);
                    ObjectProperty(estimateBar, "videoTime", (params) => {
                        if (!Array.isArray(params.value)) {
                            return false;
                        }
                        const videoTime = params.value;
                        const timeLong = videoTime[1] - videoTime[0];
                        liveConfig.intervalCallback[index] = [...videoTime, (currentTime, duration) => {
                            try {
                                rangeDom.style.left = minToMax(videoTime[0] / duration * 100) + "%";
                                rangeDom.style.width = (minToMax(videoTime[1], duration) - videoTime[0]) / duration * 100 + "%";
                            } catch (error) {
                                console.error(error);
                            }
                            if (currentTime < videoTime[0]) {
                                return span.style.width = 0;
                            }
                            if (currentTime > videoTime[1]) {
                                return span.style.width = "100%";
                            }
                            if (currentTime > videoTime[0]) {
                                div.classList.add("active");
                                reActive();
                                const diff = currentTime - videoTime[0];
                                return span.style.width = diff / timeLong * 100 + "%";
                            }
                        }]
                    })
                })
                liveConfig.intervalCallback.sort((a, b) => a[0] - b[0]);
            })
        }
        function timeToSeconds(timeString) {
            const [hours, minutes, seconds] = timeString.split(":").map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        }
        function secondsToTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            const pad = (num) => (num < 10 ? "0" : "") + num;
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        }
        function diffTime(natureTime, stopTime, timeLong = 0) {
            const timeArr = natureTime.split("-");
            const timeDate = timeArr[0].split(" ")[0];
            if (!timeArr[1].includes(" ")) {
                timeArr[1] = `${timeDate} ${timeArr[1]}`;
            }
            const timeStart = new Date(timeArr[0]).getTime();
            const timeEnd = new Date(timeArr[1]).getTime();
            for (const item of stopTime) {
                if (timeEnd <= item.start) {
                    continue;
                }
                if (timeStart > item.start && timeStart < item.end) {
                    if (timeEnd <= item.end) {
                        timeLong = timeLong + item.diff;
                    }
                    if (timeEnd > item.end) {
                        timeLong = timeLong + (timeStart - item.start);
                    }
                    continue;
                }
                if (timeStart >= item.end) {
                    timeLong = timeLong + item.diff;
                    continue;
                }
            }
            return timeLong;
        }
        GM_addStyle(`
            .gm-live-video-time {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 8px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.25s;
            }
            .gm-live-video-time.active {
                opacity: 1;
            }
            .gm-live-video-time:hover {
                opacity: 1;
            }
            .gm-live-video-time>div {
                position: relative;
                background: #d0eaff;
                border-radius: 4px;
            }
            .gm-live-video-time span {
                background: #90caf9;
                border-radius: 4px;
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 100%;
                transition: width 0.2s linear;
            }
            .live-timt-bar {
                position: absolute;
                display: block;
                height: .3em;
                margin: 0;
                padding: 0;
                width: 100%;
                left: 0;
                top: 0;
                background: rgba(0,0,0,0);
            }
            .live-timt-range {
                position: absolute;
                height: .3em;
                background: #ff0000;
            }
        `)
    }

    // 直播时长
    function liveMaintainTime() {
        function secondsToTime(seconds) {
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds / 3600) % 24);
            const minutes = Math.floor((seconds / 60) % 60);
            const secs = Math.floor(seconds % 60);
            const pad = (num) => (num < 10 ? "0" : "") + num;
            const dayText = days && `${days}天` || "";
            return `${dayText}${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        }
        ObjectProperty(config, "liveWatchTime", (params) => {
            if (!params.value) {
                return false;
            }
            params.stop();
            const watchTime = params.value.watchTime;
            if (watchTime.startTime) {
                return _run(watchTime);
            }
            ObjectProperty(config, "liveDetail", (data) => {
                if (!data.value) {
                    return false;
                }
                data.stop();
                watchTime.startTime = data.value.liveInfo && data.value.liveInfo.startTime;
                _run(watchTime);
            })
        })
        function formatTime(timeFrame, startTime) {
            // 2024/5-20 05:20:00-13:14:00
            const parts = timeFrame.split("-");
            const start = new Date(parts[0]).getTime();
            let end = new Date(parts[1]).getTime();
            if (isNaN(end)) {
                const partsDate = parts[0].split(" ");
                end = new Date(`${partsDate[0]} ${parts[1]}`).getTime();
            }
            return {
                startDay: Math.floor((start - startTime) / 1000 / 86400),
                endDay: Math.floor((end - startTime) / 1000 / 86400),
                startTime: secondsToTime((start - startTime) / 1000),
                endTime: secondsToTime((end - startTime) / 1000)
            }
        }
        function _run(params) {
            const startTime = params.startTime;
            const timeData = {
                timeObj: null,
                isDayOut: false
            }
            if (startTime) {
                const timeFrame = params.firstAuditAllocationTimeFrame;
                const timeObj = formatTime(timeFrame, new Date(startTime).getTime());
                timeData.timeObj = timeObj;
                timeData.isDayOut = timeObj.startDay >= 3 || timeObj.endDay >= 3;
            }
            const isSetPage = setPage();
            if (!isSetPage) {
                const observer = ObserverDOM(() => {
                    if (observer.isRun) {
                        return observer.stop();
                    }
                    setPage(observer);
                });
                observer.observe(document.querySelector(".detail-right"), {
                    childList: true,
                    subtree: true,
                });
            }
            function setPage(observer = {}) {
                const itemBold = document.querySelectorAll(".detail-right .item-line");
                for (const item of itemBold) {
                    if (item.textContent.includes("一审任务分配时段")) {
                        observer.isRun = true;
                        return AddDOM({
                            addData: [{
                                name: "div",
                                className: "item-line",
                                add: [{
                                    name: "span",
                                    className: "weight-bold",
                                    innerHTML: "一审任务处理时间："
                                }, {
                                    name: "span",
                                    style: (!timeData.timeObj || timeData.isDayOut) && "color: #ff0000" || "",
                                    innerHTML: timeData.timeObj ? `${timeData.timeObj.startTime} - ${timeData.timeObj.endTime}` : "未获取到开始时间，请自行计算"
                                }]
                            }]
                        }).then((div) => {
                            item.parentNode.insertBefore(div, item.nextSibling);
                        })
                    }
                }
            }
        }
    }

    // 实时直播间-获取内容来源
    function liveContentSource() {
        const LiveSourceSwitch = SwitchRead("Live-Source");
        if (!LiveSourceSwitch.state) {
            return false;
        }
        let isRun = false;
        const contentSource = GetQueryString("contentSource");
        getServerData({ method: "GET", url: "/api/common/getLoginBizLineInfo" }, "GM_SKU_BIZ_INFO", ({ data }) => {
            const biz = data && data.content && data.content.biz || [];
            const liveBiz = biz.find(item => item.value === 24) || {};
            const liveSource = liveBiz.content_source || [];
            const liveSourceInfo = liveSource.find(item => item.value == contentSource) || {};
            if (liveSourceInfo.label && !isRun) {
                isRun = true;
                AddDOM({
                    addData: [{
                        name: "tr",
                        className: "antcap-descriptions-row",
                        add: [{
                            name: "td",
                            colspan: "1",
                            className: "antcap-descriptions-item",
                            add: [{
                                name: "span",
                                className: "antcap-descriptions-item-label antcap-descriptions-item-colon",
                                innerHTML: "内容来源"
                            }, {
                                name: "span",
                                className: "antcap-descriptions-item-content",
                                innerHTML: liveSourceInfo.label
                            }]
                        }]
                    }]
                }).then((div) => {
                    const tbody = document.querySelector(".detail-left .liveroom-tabs-content tbody");
                    tbody && tbody.insertBefore(div, tbody.firstChild);
                })
            }
        })
    }

    // 展示历史违规记录
    function liveHistoryRecord() {
        const LiveQCRecord = SwitchRead("Live-QC-Record");
        if (!LiveQCRecord.state) {
            return false;
        }
        const foldCardBack = collapseCard();
        foldCardBack.setCardName("质检处理记录：加载中");
        foldCardBack.setBody([{
            name: "div",
            innerHTML: "数据加载中"
        }]);
        foldCardBack.setPage(async (element) => {
            const rightDom = await AwaitSelectorShow(".gm-live-qc-record");
            rightDom.parentNode.replaceChild(element, rightDom);
        });
        (async () => {
            const pageSize = 50;
            const taskList = [];
            const data = await getLiveList();
            if (data) {
                if (data.total <= pageSize) {
                    taskList.push(...data.taskList);
                } else {
                    const pageMax = Math.ceil(data.total / pageSize)
                    for (let page = 1; page <= pageMax; page++) {
                        await getLiveList(page, pageSize).then((data) => {
                            taskList.push(...data.taskList);
                        });
                    }
                }
            }
            _run(taskList);
        })();
        function _run(taskList = []) {
            if (taskList.length <= 0) {
                return setPage(taskList);
            }
            let getNum = 0;
            const qcResult = [];
            const getTaskBack = QueueTaskRunner(10);
            for (let index = 0; index < taskList.length; index++) {
                const list = taskList[index];
                if (/^xnshenhe|^ext/i.test(list.qcPerson)) {
                    getNum++;
                    if (getNum > 50) {
                        break;
                    }
                    getTaskBack.push(async () => HTTP_XHR({
                        method: "GET",
                        url: `/liveapi/live/review/getWatchTimeAndAuditDetail?task_id=${list.taskId}&live_id=${list.liveId}&qc_task_id=${list.qcTaskId}`
                    }).then((xhr) => {
                        const { content } = JSON.parse(xhr.responseText);
                        qcResult.push({ ...content, qcList: list });
                    }))
                }
            }
            if (getNum > 0) {
                return getTaskBack.endBack(() => setPage(qcResult));
            }
            setPage(qcResult);
        }
        async function getLiveList(page = 1, pageSize = 50) {
            const queryUrl = {
                page_num: page,
                page_size: pageSize,
                biz_line: 24,
                qc_state: 2,
                live_id: GetQueryString("liveId"),
            }
            const getUrl = UpdateUrlParam(location.origin + "/liveapi/live/review/qc/list?", queryUrl);
            return HTTP_XHR({
                method: "GET",
                url: getUrl,
            }).then((xhr) => {
                const { content, code } = JSON.parse(xhr.responseText);
                if (code === 0 && content && content.taskList) {
                    return content;
                }
            }).catch((error) => {
                console.error(error);
            });
        }
        function setPage(contentList) {
            GM_addStyle(`
                .live-history-record {
                    width: 100%;
                    border-collapse: collapse;
                }
                .live-history-record td {
                    border: 1px solid #e8e8e8;
                    padding: 8px;
                }
                .live-history-record .open {
                    width: 120px;
                    cursor: pointer;
                }
                .live-history-record .open:hover {
                    color: #2196F3;
                }
            `)
            // 时间升序
            contentList.sort((a, b) => {
                const aSplit = a.watchTime.firstAuditAllocationTimeFrame.split("-");
                const bSplit = b.watchTime.firstAuditAllocationTimeFrame.split("-");
                const aTime = new Date(aSplit[0]).getTime();
                const bTime = new Date(bSplit[0]).getTime();
                return aTime - bTime;
            });
            const tableDom = contentList.map((list) => {
                if (!list.qcAndManualAuditDetail) {
                    return false;
                }
                return {
                    name: "div",
                    add: [{
                        name: "table",
                        className: "live-history-record",
                        add: [{
                            name: "tbody",
                            add: [{
                                name: "tr",
                                add: [{
                                    name: "td",
                                    colspan: 3,
                                    style: "padding: 0 8px;",
                                    innerHTML: "任务分配时间：" + list.watchTime.firstAuditAllocationTimeFrame
                                }]
                            }, ...list.qcAndManualAuditDetail.qcResult.map((item, index, all) => {
                                const openUrl = UpdateUrlParam(location.href, {
                                    bizLine: list.qcList.bizLineId || 0,
                                    subLine: list.qcList.subLineId || 0,
                                    contentSource: list.qcList.contentSourceId || 0,
                                    taskId: list.qcList.taskId,
                                    liveId: list.qcList.liveId,
                                    qcTaskId: list.qcList.qcTaskId
                                });
                                const { liveId, taskId, qcTaskId } = GetQueryString(null, location.href);
                                const isNowUrl = liveId === list.qcList.liveId && taskId === list.qcList.taskId && qcTaskId === list.qcList.qcTaskId;
                                const isNeed = item.punishType !== "无需操作";
                                const trDom = [{
                                    name: "tr",
                                    add: [{
                                        name: "td",
                                        style: "width: 148px;padding: 2px 8px;",
                                        innerHTML: list.qcList.qcTime
                                    }, {
                                        name: "td",
                                        rowspan: 2,
                                        style: "padding: 2px 8px;",
                                        add: (() => {
                                            if (item.relatedInfo) {
                                                try {
                                                    const reasonArr = JSON.parse(item.relatedInfo.reason).map((t) => t.reason);
                                                    return reasonArr.map((reason) => ({
                                                        name: "div",
                                                        style: "color: #ff0000;",
                                                        innerHTML: reason
                                                    }))
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }
                                            return [{ name: "div", innerText: "无" }];
                                        })()
                                    }, (() => {
                                        if (index === 0) {
                                            return {
                                                name: "td",
                                                rowspan: all.length * 2,
                                                style: "width: 70px;padding: 0;user-select: none;text-align: center;",
                                                className: "open",
                                                innerHTML: isNowUrl ? "当前素材" : "查看",
                                                click() {
                                                    if (isNowUrl) {
                                                        return MessageTip("❌", "已经在该素材", 3);
                                                    }
                                                    window.open(openUrl);
                                                }
                                            }
                                        }
                                    })()],
                                }, {
                                    name: "tr",
                                    add: [{
                                        name: "td",
                                        style: (isNeed && "color: #ff0000;" || "") + "padding: 2px 8px;",
                                        innerHTML: item.punishType
                                    }],
                                }]
                                return trDom;
                            }).flat()
                            ]
                        }]
                    }]
                }
            }).filter((item) => item);
            const nullDom = [{
                name: "div",
                innerHTML: "无历史记录"
            }];
            const isHave = tableDom.length > 0;
            foldCardBack.setCardName(`质检处理记录：${tableDom.length}`);
            foldCardBack.setCardNameStyle(isHave && "color: #ff0000" || "");
            foldCardBack.setBody(isHave ? tableDom : nullDom);
            foldCardBack.open(isHave);
        }
    }

    // 展示直播字幕
    function liveHistoryText() {
        const LiveQCText = SwitchRead("Live-QC-Text");
        if (!LiveQCText.state) {
            return false;
        }
        const LiveQCOpen = SwitchRead("Live-QC-Text-Open");
        const foldCardBack = collapseCard();
        foldCardBack.setCardName("直播字幕（ASR开始）");
        foldCardBack.setBody([{
            name: "div",
            innerHTML: "数据加载中...",
            function: bodyInit
        }]);
        foldCardBack.setPage(async (element) => {
            const rightDom = await AwaitSelectorShow(".gm-live-qc-text");
            rightDom.parentNode.replaceChild(element, rightDom);
            element.querySelector(".antcap-collapse-content-box").style.gap = "8px";
        })
        function bodyInit(element) {
            let isInit = false;
            ObjectProperty(config, "liveDetail", (data) => {
                if (!data.value) {
                    return false;
                }
                data.stop();
                const startTime = data.value.liveInfo && data.value.liveInfo.startTime;
                if (startTime) {
                    if (LiveQCOpen.state) {
                        getLiveList(startTime);
                    } else {
                        observerDom(startTime);
                    }
                }
            })
            function observerDom(startTime) {
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            !isInit && getLiveList(startTime);
                            isInit = true;
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.3
                });
                observer.observe(element);
            }
        }
        function getLiveList(startTime, page = 1, data = []) {
            const startDate = new Date(startTime);
            const endDate = startDate.setHours(startDate.getHours() + 1);
            const queryUrl = {
                page_num: page,
                page_size: 20,
                biz_line: 0,
                roleType: 1,
                live_id: GetQueryString("liveId"),
                send_time_start: startTime,
                send_time_end: FormatTime("YYYY-MM-DD hh:mm:ss", endDate),
            }
            const getUrl = UpdateUrlParam(location.origin + "/liveapi/live/subtitle/getPageSubtitles?", queryUrl);
            HTTP_XHR({
                method: "GET",
                url: getUrl,
            }).then((xhr) => {
                const { content } = JSON.parse(xhr.responseText);
                if (content && content.total && content.total > 0) {
                    const { subtitlesList } = content;
                    const pageMax = Math.ceil(content.total / 20);
                    if (page === 1 && pageMax === 1) {
                        return _run(subtitlesList);
                    }
                    if (page === 1 && pageMax > page) {
                        return getLiveList(startTime, page = pageMax);
                    }
                    if (page === pageMax) {
                        if (subtitlesList.length > 3) {
                            return _run(subtitlesList);
                        }
                        return getLiveList(startTime, page = pageMax - 1, subtitlesList);
                    }
                    return _run([...subtitlesList, ...data]);
                }
                _run();
            })
        }
        function _run(subtitlesList = []) {
            if (subtitlesList.length <= 0) {
                return setPage(subtitlesList);
            }
            // 去重
            const uniqueArr = [...new Map(subtitlesList.map(item => [item.sendTime + item.startEndTime, item])).values()];
            // 时间升序
            uniqueArr.sort((a, b) => {
                const aTime = new Date(a.sendTime).getTime();
                const bTime = new Date(b.sendTime).getTime();
                return aTime - bTime;
            });
            // 只要前5句
            const dataList = uniqueArr.slice(0, 3);
            setPage(dataList);
        }
        function setPage(contentList) {
            const tableDom = contentList.map((list) => {
                return {
                    name: "div",
                    add: [{
                        name: "div",
                        style: "display: flex;gap: 10px;",
                        add: [{
                            name: "div",
                            style: "font-weight: bold;",
                            innerText: list.sendTime
                        }, {
                            name: "div",
                            innerText: list.startEndTime.replace(/-/g, "").replace(/(\d{3})(\d{2})/, "$1-$2")
                        }]
                    }, {
                        name: "div",
                        innerText: list.subtitles
                    }]
                }
            })
            const nullDom = [{
                name: "div",
                innerHTML: "无字幕"
            }];
            const isHave = tableDom.length > 0;
            foldCardBack.setBody(isHave ? tableDom : nullDom);
            foldCardBack.open(isHave);
        }
    }

    // 直播截图
    function liveScreenshot() {
        const Screenshot = SwitchRead("Live-Screenshot");
        if (!Screenshot.state) {
            return false;
        }
        const liveConfig = {
            total: 0,
            pageNum: 0,
            pageSize: 20,
            pageMin: 1,
            pageMax: 1,
            isRun: false,
            element: null,
            isInit: false
        };
        AddDOM({
            addNode: document.body,
            addData: [{
                name: "div",
                className: "live-image-main",
                add: [{
                    name: "div",
                    className: "live-image-hover",
                    add: [{
                        name: "div",
                        className: "live-image-title",
                        innerHTML: "直播截图",
                    }]
                }, {
                    name: "div",
                    className: "live-image-list",
                    add: [{
                        name: "div",
                        className: "live-image-itme",
                        innerHTML: "数据加载中...",
                        function(element) {
                            ObjectProperty(config, "liveWatchTime", (params) => {
                                if (!params.value) {
                                    return false;
                                }
                                params.stop();
                                const watchTime = params.value.watchTime.firstAuditAllocationTimeFrame;
                                const parts = watchTime.split("-");
                                let endTime = new Date(parts[1]).getTime();
                                if (isNaN(endTime)) {
                                    const partsDate = parts[0].split(" ");
                                    endTime = new Date(`${partsDate[0]} ${parts[1]}`).getTime();
                                }
                                liveConfig.startTime = new Date(parts[0]).getTime();
                                liveConfig.endTime = endTime;
                                liveConfig.element = element;
                                observerDom();
                            })
                            function observerDom() {
                                const observer = new IntersectionObserver((entries, observer) => {
                                    entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                            initFun();
                                            observer.unobserve(entry.target);
                                        }
                                    });
                                }, {
                                    threshold: 0.3
                                });
                                observer.observe(element);
                            }
                            function initFun() {
                                if (!liveConfig.isInit) {
                                    liveConfig.isInit = true;
                                    initImages();
                                }
                            }
                        }
                    }, {
                        name: "div",
                        className: "live-image-skip",
                        add: [{
                            name: "span",
                            add: [{
                                name: "span",
                                innerHTML: "共",
                            }, {
                                name: "span",
                                innerHTML: [liveConfig, "total"],
                            }, {
                                name: "span",
                                innerHTML: "条",
                            }]
                        }, {
                            name: "span",
                            add: [{
                                name: "span",
                                innerHTML: [liveConfig, "pageNum"],
                            }, {
                                name: "span",
                                innerHTML: "/",
                            }, {
                                name: "span",
                                innerHTML: [liveConfig, "pageMax"],
                            }]
                        }, {
                            name: "div",
                            innerHTML: "上一页",
                            click() {
                                if (liveConfig.isRun) {
                                    return MessageTip("❌", "查询中", 3);
                                }
                                const pageNum = liveConfig.pageNum;
                                setPage(Math.max(pageNum - 1, 1));
                            }
                        }, {
                            name: "input",
                            type: "number",
                            min: [liveConfig, "pageMin"],
                            max: [liveConfig, "pageMax"],
                            value: [liveConfig, "pageNum"],
                            function(element) {
                                element.addEventListener("keyup", (event) => {
                                    if (event.key === "Enter") {
                                        if (liveConfig.isRun) {
                                            return MessageTip("❌", "查询中", 3);
                                        }
                                        const pageMin = liveConfig.pageMin;
                                        const maxPage = liveConfig.pageMax;
                                        const pageNum = Math.max(Math.min(element.value, maxPage), pageMin);
                                        setPage(pageNum);
                                    }
                                });
                            },
                        }, {
                            name: "div",
                            innerHTML: "下一页",
                            click() {
                                if (liveConfig.isRun) {
                                    return MessageTip("❌", "查询中", 3);
                                }
                                const pageNum = liveConfig.pageNum;
                                const maxPage = Math.ceil(liveConfig.total / liveConfig.pageSize) || 1;
                                setPage(Math.min(pageNum + 1, maxPage));
                            }
                        }]
                    }]
                }]
            }]
        })
        function initImages() {
            getImage(1).then((res) => {
                const pageMax = Math.ceil(res.total / liveConfig.pageSize);
                binarySearch(pageMax).then(({ index, data }) => {
                    setPage(index, data);
                }).catch((error) => {
                    MessageTip("❌", "二分查询失败，数据被清理/目标超过1W条", 3);
                    console.error(error?.error ? error.error : error);
                    if (error?.data.data) {
                        setPage(error.data.index, error.data.data);
                    }
                });
            });
        }
        async function binarySearch(pageMax) {
            let left = 1;
            let right = pageMax;
            const data = {
                index: 1,
                data: null
            };
            try {
                while (left <= right) {
                    const mid = Math.floor((left + right) / 2);
                    const res = await getImage(mid)
                    const auditList = res.auditList;
                    if (auditList.length <= 0) {
                        break;
                    }
                    const time0 = new Date(auditList[0].createTime).getTime();
                    const time1 = new Date(auditList[auditList.length - 1].createTime).getTime();
                    const inTime = time0 >= liveConfig.endTime && time1 <= liveConfig.endTime;
                    if (inTime) {
                        return { index: mid, data: res };
                    } else if (time0 < liveConfig.endTime) {
                        right = mid - 1; // 目标值在左半部分
                    } else {
                        left = mid + 1; // 目标值在右半部分
                    }
                    data.index = mid;
                    data.data = res;
                }
                return { index: 1 }; // 未找到目标值
            } catch (error) {
                throw {
                    data,
                    error,
                };
            }
        }
        function setPage(index, data) {
            const pageNum = liveConfig.pageNum;
            if (pageNum === index) {
                return MessageTip("❌", "已经在这一页了", 3);
            }
            const element = liveConfig.element;
            liveConfig.pageNum = index;
            liveConfig.isRun = true;
            element.innerHTML = "数据加载中...";
            if (data) {
                getPageAndImage(data);
                liveConfig.isRun = false;
            } else {
                getImage(index).then(getPageAndImage).catch(() => {
                    liveConfig.pageNum = pageNum;
                    element.innerHTML = "加载失败";
                    MessageTip("❌", "查询失败", 3);
                }).finally(() => liveConfig.isRun = false)
            }
        }
        function getPageAndImage(res) {
            const element = liveConfig.element;
            liveConfig.total = res.total;
            liveConfig.pageMax = Math.ceil(res.total / liveConfig.pageSize);
            element.innerHTML = "";
            setImage(element, res.auditList);
        }
        function setImage(element, auditList) {
            if (auditList.length <= 0) {
                return element.innerHTML = "没有直播截图";
            }
            const endTime = liveConfig.endTime;
            const startTime = liveConfig.startTime;
            for (const list of auditList) {
                const createTime = new Date(list.createTime).getTime();
                const inTime = endTime >= createTime && startTime <= createTime;
                AddDOM({
                    addNode: element,
                    addData: [{
                        name: "div",
                        className: "item-image",
                        add: [lazyLoadImg({
                            src: list.url
                        }), {
                            name: "span",
                            style: inTime ? "color: #ff0000" : "",
                            innerHTML: list.createTime
                        }]
                    }]
                })
            }
        }
        async function getImage(pageNum = 1) {
            const liveId = GetQueryString("liveId");
            const taskId = GetQueryString("taskId");
            const url = UpdateUrlParam(location.origin + "/liveapi/live/query/getFrames?", {
                live_id: liveId,
                task_id: taskId,
                sort_by: 1,
                page_size: liveConfig.pageSize,
                page_num: pageNum
            });
            return HTTP_XHR({ method: "GET", url: url }).then((res) => {
                const data = JSON.parse(res.responseText).content;
                return data;
            })
        }
        GM_addStyle(`
            .live-image-main {
                z-index: 100;
                position: absolute;
                top: 0;
                right: 0;
                height: 100%;
                display: flex;
                --image-list-width: 0;
                --image-list-hover-width: 600px;
                --image-list--shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
            }
            .live-image-main:hover {
                --image-list-width: var(--image-list-hover-width);
                --image-list--shadow: 0 0 12px -2px rgba(0, 0, 0, 0.3);
            }
            .live-image-hover {
                width: 5px;
                height: 100%;
                position: relative;
            }
            .live-image-title {
                position: absolute;
                right: 0;
                top: 40%;
                writing-mode: vertical-rl;
                background: #4999f2;
                color: #ffffff;
                padding: 10px 0 10px 5px;
                border-radius: 5px 0 0 5px;
            }
            .live-image-list {
                background: #ffffff;
                height: 100%;
                transition: width 0.25s,box-shadow 0.25s;
                width: var(--image-list-width);
                box-shadow: var(--image-list--shadow);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .live-image-skip {
                padding: 15px 0;
                gap: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                white-space: nowrap;
            }
            .live-image-skip div {
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                cursor: pointer;
                user-select: none;
                font-weight: 500;
                outline: none;
                padding: 5px 10px;
                background: #fcfcfc;
                transition: background 0.25s;
            }
            .live-image-skip div:hover {
                background: #f8f8f8;
            }
            .live-image-skip div:active {
                background: #eeeeee;
            }
            .live-image-skip input {
                width: 80px;
                text-align: center;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                user-select: none;
                outline: none;
                padding: 5px 10px;
                background: #fcfcfc;
                transition: border-color 0.25s;
            }
            .live-image-skip input:hover {
                border-color: #1890ff;
            }
            .live-image-skip input:focus {
                border-color: #1890ff;
            }
            .live-image-skip input::-webkit-inner-spin-button,
            .live-image-skip input::-webkit-outer-spin-button {
                -webkit-appearance: none;
            }
            .live-image-itme {
                display: grid;
                justify-items: center;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                overflow-y: auto;
                padding: 10px;
                min-width: var(--image-list-hover-width);
            }
            .item-image {
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: space-between;
            }
            .item-image img {
                width: 100%;
                min-height: 120px;
                object-fit: cover;
            }
        `)
    }

    // 获取商卡信息
    function getSkuInfo() {
        const SKUGetInfo = SwitchRead("SKU-Get-Info");
        if (!SKUGetInfo.state) {
            return false;
        }
        const skuAll = document.querySelectorAll(".audit-list-content-sku");
        const observer = new IntersectionObserver(onIntersection, { threshold: [0.5] });
        function onIntersection(entries) {
            entries.forEach(({ target, intersectionRatio }) => {
                if (intersectionRatio >= 0.5) {
                    runBack(target);
                    observer.unobserve(target);
                }
            })
        }
        skuAll.forEach((element) => {
            const description = element.querySelector(".antcap-list-item-meta-description");
            if (description) {
                const changeStyle = ThrottleOver(() => {
                    const children = description.children;
                    if (children.length > 2) {
                        [...children].forEach((elem) => elem.style.marginBottom = 0);
                    }
                }, 200);
                const observer = ObserverDOM(changeStyle);
                observer.observe(description, { childList: true });
                changeStyle();
            }
            observer.observe(element);
        });
        // 限制并发
        let isGetSku = false;
        const getSkuTasksList = [];
        async function getSkuTasks(params) {
            getSkuTasksList.push(params);
            if (!isGetSku) {
                isGetSku = true;
                while (getSkuTasksList.length > 0) {
                    const callback = getSkuTasksList.shift();
                    await callback();
                }
                isGetSku = false;
            }
        }
        // 解析HTML
        function markHtml(htmlString) {
            const bodyRegex = /<body[^>]*>([\s\S]*)<\/body>/i;
            const match = htmlString.match(bodyRegex);
            if (match && match[1]) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(match[1], "text/html");
                return doc;
            } else {
                return null;
            }
        }
        function runBack(skuDom) {
            if (skuDom._getSkuRun) {
                return false;
            }
            skuDom._getSkuRun = true;
            const skuInfo = {
                setBack(element, backName) {
                    skuInfo[backName] = (params) => skuInfo.isDisplay(element, params, backName);
                },
                isDisplay(element, params = [], backName) {
                    if (params[0] && params[0].replace(/" "/g, "")) {
                        element.innerText = params[0];
                        element.style.display = "block";
                    } else {
                        element.style.display = "none";
                    }
                    if (params[1]) {
                        element.style.background = params[1];
                        if (backName === "info1" && params[1] === "#ff0000") {
                            skuDom.style.background = "#f0e4e5";
                            const item = skuDom.querySelector(".antcap-list-item");
                            item && (item.style.border = "1px solid #ff0000");
                        }
                    }
                }
            }
            const itemMeta = skuDom.querySelector(".antcap-list-item-meta");
            itemMeta.style.position = "relative";
            AddDOM({
                addNode: itemMeta,
                addData: [{
                    name: "div",
                    id: "gm-sku-info",
                    add: [{
                        name: "div",
                        style: "display: none;",
                        function: (element) => skuInfo.setBack(element, "info2")
                    }, {
                        name: "div",
                        innerText: "加载",
                        function: (element) => skuInfo.setBack(element, "info1")
                    }]
                }]
            });
            const { href } = skuDom.querySelector("a") || {};
            const textId = href && href.match(/\d+/g) || [];
            const toTime = new Date().getTime();
            const getUrl = href + (href.indexOf("?") === -1 ? "?" : "&") + "time=" + toTime;
            getSkuTasks(() => GM_XHR({
                url: getUrl,
            }).then((xhr) => {
                const data = xhr.responseText;
                if (data.includes("ipaas-floor-app") && data.includes("cfe.m.jd.com/privatedomain")) {
                    skuInfo.info1(["需要验证", "#ff0000"]);
                    return false;
                }
                if (data.includes("忘记密码") && data.includes("登录")) {
                    skuInfo.info1(["需要登录", "#ff0000"]);
                    return false;
                }
                const isSkuId = data.includes(textId[0]);
                if (data.includes("该商品已下柜，欢迎挑选") || !isSkuId) {
                    skuInfo.info1(["失效", "#ff0000"]);
                    setPage(data);
                    return false;
                }
                if (isSkuId) {
                    skuInfo.info1(["有效", "#52c41a"]);
                    setPage(data);
                    return false;
                }
                throw "请求结果不满足条件";
            }).catch((error) => {
                console.error(error);
                skuInfo.info1(["解析失败", "#ff0000"]);
            }));
            function setPage(params) {
                const SKUListShow = SwitchRead("SKU-List-Show");
                if (!SKUListShow.state) {
                    return false;
                }
                const bodyHtml = markHtml(params);
                const shopInfo = bodyHtml.querySelectorAll(".crumb-wrap .shieldShopInfo .name");
                if (shopInfo.length >= 2) {
                    skuInfo.info2([shopInfo[0].innerText.trim(), "#ff0000"]);
                }
                const skuItem = [];
                const skuItemImg = [];
                [...bodyHtml.querySelectorAll("#choose-attrs .item")].forEach((item) => item.querySelector("img") ? skuItemImg.push(item) : skuItem.push(item));
                if (skuItem.length <= 0 && skuItemImg.length <= 0) {
                    return false;
                }
                const content = skuDom.querySelector(".antcap-list-item");
                content.style.flexDirection = "column";
                const autoExpand = SwitchRead("SKU-List-Expand").state;
                const expand = {
                    state: false,
                    display: "none",
                    height: 42,
                    maxHeight: 42
                }
                // 设置商卡图片tip显示
                const imgTipConfig = {
                    imgDom: null,
                    imgSrc: "",
                    state: "",
                    removeDom: ThrottleOver(() => {
                        if (imgTipConfig.state === "remove") {
                            imgTipConfig.imgDom && imgTipConfig.imgDom.remove();
                            imgTipConfig.imgDom = null;
                        }
                    }, 200),
                };
                async function addImgToPage(imgSrc, rect) {
                    imgTipConfig.state = "add";
                    imgTipConfig.imgSrc = imgSrc;
                    if (!imgTipConfig.imgDom) {
                        imgTipConfig.imgDom = await AddDOM({
                            addNode: document.body,
                            addData: [{
                                name: "div",
                                className: "gm-sku-list-tip",
                                add: [{
                                    name: "img",
                                    style: "height: 100%;width: 100%;object-fit: contain;",
                                    src: [imgTipConfig, "imgSrc"],
                                }]
                            }]
                        })
                    }
                    const imgDom = imgTipConfig.imgDom;
                    imgDom.style.top = rect.top - 237 + "px";
                    imgDom.style.left = rect.left + rect.width / 2 - 110 + "px";
                    imgDom.style.transition = "0.2s";
                    imgDom.style.opacity = 1;
                }
                function removeImgToPage() {
                    imgTipConfig.state = "remove";
                    imgTipConfig.imgDom.style.opacity = 0;
                    imgTipConfig.removeDom();
                }
                function markSkuItem(item) {
                    const skuId = item.dataset.sku;
                    const title = item.dataset.value;
                    const img = item.querySelector("img") || {};
                    const selected = item.classList.contains("selected");
                    let imgSrc = img.src && img.src.replace(/^.*jfs\/t1/, "//m.360buyimg.com/ceco/jfs/t1");
                    // 处理无法修改域名的链接
                    imgSrc = imgSrc && imgSrc.replace(/\/s(\d+)x(\d+)_/, "/s800x800_");
                    return {
                        name: "div",
                        className: "gm-sku-item" + (selected ? " selected" : ""),
                        add: [{
                            name: "a",
                            target: "_blank",
                            href: `https://item.jd.com/${skuId}.html`,
                            style: "height: 100%;display: flex;align-items: center;",
                            add: [imgSrc && lazyLoadImg({
                                src: imgSrc
                            }), {
                                name: "span",
                                className: "gm-sku-title",
                                innerText: title
                            }],
                            function: (element) => {
                                if (!imgSrc) {
                                    return false;
                                }
                                element.addEventListener("mouseover", () => {
                                    const rect = element.getBoundingClientRect();
                                    addImgToPage(imgSrc, rect);
                                });
                                element.addEventListener("mouseout", () => removeImgToPage());
                            }
                        }]
                    };
                }
                AddDOM({
                    addNode: content,
                    addData: [{
                        name: "div",
                        style: "width: 100%;height: 1px;margin: 6px 0;background: #cecece;"
                    }, {
                        name: "div",
                        style: [expand, ["state", "height"], (_, setValue) => {
                            if (autoExpand) {
                                return setValue("height: aotu;");
                            }
                            setValue(`height: ${!expand.state ? expand.height : expand.maxHeight}px;`);
                        }],
                        className: "gm-sku-content",
                        add: [skuItemImg.length && {
                            name: "div",
                            className: "gm-sku-list",
                            add: skuItemImg.map((item) => markSkuItem(item))
                        }, skuItemImg.length && skuItem.length && {
                            name: "div",
                            style: "border-top: 1px dashed #cecece;"
                        }, skuItem.length && {
                            name: "div",
                            className: "gm-sku-list",
                            add: skuItem.map((item) => markSkuItem(item))
                        }]
                    }, {
                        name: "div",
                        style: [expand, "display", (value, setValue) => setValue(`display: ${value};`)],
                        className: "gm-sku-expand",
                        innerHTML: leftArrowIco,
                        add: [{
                            name: "span",
                            innerText: [expand, "state", (value, setValue) => {
                                setValue(!value ? "展开更多" : "收起");
                                const svg = content.querySelector(".gm-sku-expand svg");
                                svg.style.transform = `rotate(${!value ? 270 : 90}deg)`;
                            }]
                        }],
                        click: () => {
                            expand.state = !expand.state;
                        }
                    }]
                }).then(() => {
                    const contentDom = content.querySelector(".gm-sku-content");
                    const itemDom = contentDom.querySelector(".gm-sku-item");
                    expand.maxHeight = "auto";
                    const resizeThrottle = ThrottleOver(resizeHeight, 50);
                    window.addEventListener("resize", resizeThrottle);
                    resizeThrottle();
                    function resizeHeight() {
                        expand.height = itemDom.offsetHeight;
                        if (contentDom.scrollHeight !== expand.height && !autoExpand) {
                            expand.display = "flex";
                        } else {
                            expand.display = "none";
                        }
                    }
                })
            }
        }
        GM_addStyle(`
            #gm-sku-info {
                position: absolute;
                right: 6px;
                bottom: 6px;
                gap: 10px;
                display: flex;
                align-items: center;
            }
            #gm-sku-info>div {
                color: #ffffff;
                padding: 2px 6px;
                font-size: 14px;
                font-weight: initial;
                line-height: 1.4;
                border-radius: 4px;
                background: #a2a2a2;
                box-shadow: 0 2px 8px rgba(0,0,0,.05);
            }
            .gm-sku-content {
                overflow: hidden;
                width: 100%;
                gap: 6px;
                display: flex;
                flex-direction: column;
            }
            .gm-sku-list {
                gap: 6px;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }
            .gm-sku-list .gm-sku-item {
                cursor: pointer;
                border: 1px solid #cecece;
                border-radius: 3px;
                min-height: 30px;
            }
            .gm-sku-list .selected,
            .gm-sku-list .gm-sku-item:hover {
                border: 1px solid #e3393c;
            }
            .gm-sku-list img {
                width: 40px;
                height: 40px;
                border-radius: 3px !important;
                object-fit: contain;
                background: rgba(255,255,255,0.85);
            }
            .gm-sku-list .gm-sku-title {
                font-size: 12px;
                padding: 0 5px;
            }
            .gm-sku-expand {
                margin-top: 10px;
                font-size: 14px;
                cursor: pointer;
                line-height: 1.4;
                fill: rgba(0,0,0,.65);
                gap: 5px;
                display: flex;
                align-items: center;
            }
            .gm-sku-expand svg {
                height: 12px;
                transform: rotate(270deg);
            }
            .gm-sku-expand:hover {
                color: #ff0000;
                fill: #ff0000;
            }
            .gm-sku-list-tip {
                width: 230px;
                height: 230px;
                border-radius: 10px;
                position: absolute;
                pointer-events: none;
                background: rgba(255,255,255,0.85);
                border: 5px solid rgba(255,255,255,0.85);
            }
        `)
    }

    // 素材转换
    function qcDataConvert() {
        const DataConvert = SwitchRead("Data-Convert");
        if (!DataConvert.state) {
            return false;
        }
        const root = document.querySelector("#root");
        AddDOM({
            addNode: root,
            addData: [{
                name: "div",
                style: "position: absolute;top: 50%;right: 0;color: #ffff;z-index: 20;",
                add: [{
                    name: "button",
                    className: "gm-button",
                    style: "padding: 0 10px;border-radius: 5px 0 0 5px;",
                    innerHTML: "转换",
                    click: outExam
                }]
            }]
        })
        function reduceAuditList(list, subType) {
            const listObj = list.reduce((latest, current) => {
                if (current.subType === subType && (!latest.updateTime || new Date(current.updateTime) > new Date(latest.updateTime))) {
                    return current;
                } else {
                    return latest;
                }
            }, {});
            const objData = listObj.value && JSON.parse(listObj.value) || {};
            return objData;
        }
        function outExam() {
            const { contentId, mainTitle, fourKey, converUrl, auditList } = config.dataContent || {};
            const video = reduceAuditList(auditList, "normalVideo");
            const skuArr = auditList.filter((item) => item.elementType === "sku").map((item) => {
                const objData = item.value && JSON.parse(item.value) || {};
                return {
                    id: objData.id,
                    title: encodeURIComponent(objData.title),
                    image: encodeURIComponent(objData.pitureurl[0])
                }
            });
            const data = {
                cid: contentId,
                title: mainTitle,
                image: converUrl && converUrl[0] && converUrl[0].url || "",
                video: video.url,
                // "video-image": list.converUrl && list.converUrl[0] && list.converUrl[0].url || "",
                sku: JSON.stringify(skuArr),
                style: fourKey.contentTypeId === 1 ? 7 : 24, // 7横版，其它竖版
            }
            CopyText(UpdateUrlParam("http://10.10.0.150:6020/jd/page", data))
                .then(() => {
                    MessageTip("✔️", "已复链接到剪贴板", 3, 2);
                })
                .catch(() => {
                    MessageTip("❌", "复制失败", 3, 2);
                })
        }
    }

    async function labelSizeChange() {
        const SizeChange = SwitchRead("Label-Size-Change");
        if (!SizeChange.state) {
            return false;
        }
        const styleData = SizeChange.value.find((item) => item.active);
        if (!styleData || styleData.name === "默认") {
            return false;
        }
        GM_addStyle(`
            .info-result .antcap-tag i {
                font-size: ${styleData.fontSize} !important;
            }
            .info-result .antcap-tag {
                display: inline-flex;
                align-items: center;
                height: ${styleData.height};
                font-size: ${styleData.fontSize};
                padding: ${styleData.padding} !important;
            }
            .leaf-parent-node {
                display: inline-flex;
                align-items: center;
                height: ${styleData.height};
                border-radius: ${styleData.height};
                font-size: ${styleData.fontSize};
                padding: ${styleData.padding} !important;
            }
            .leaf-parent-node, .tree-leaf-node-title {
                height: ${styleData.height};
                font-size: ${styleData.fontSize};
                padding: ${styleData.padding} !important;
            }
        `)
    }

    // 打标保存后自动关闭
    async function labelSaveClose() {
        const operation = await AwaitSelectorShow(".detail-opinion .detail-operation", true);
        operation._runLabelSaveClose = true;
        operation.style.position = "relative";
        operation.style.display = "flex";
        operation.style.alignItems = "center";
        const saveClose = SwitchRead("Label-Save-Close");
        const labelConfig = {
            stateChange: () => { },
            checkedChange: () => { },
            delay: typeof saveClose.delay === "number" ? saveClose.delay : 0
        }
        let labelStyle = `.label-save-close {
                gap: 10px;
                display: flex;
                align-items: center;
                left: 20px;
                cursor: pointer;
                font-size: 12px;
                position: absolute;
                margin-bottom: 10px;
            }`;
        if (operation.children.length >= 4) {
            labelStyle = `.label-save-close {
                gap: 5px;
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 12px;
                margin-right: 12px;
                flex-direction: column;
            }`;
        }
        GM_addStyle(`
            ${labelStyle}
            .label-save-close .el-input-number--mini {
                width: 90px;
                line-height: 22px;
            }
            .label-save-close .el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase {
                width: 24px;
            }
            .label-save-close .el-input--mini .el-input__inner {
                height: 24px;
                line-height: 24px;
            }
            .label-save-close .el-input-number--mini .el-input__inner {
                padding-left: 26px;
                padding-right: 26px;
            }
        `)
        const saveSwitch = ThrottleOver(() => {
            SwitchWrite("Label-Save-Close", saveClose);
        }, 200);
        AddDOM({
            addData: [{
                name: "div",
                className: "label-save-close",
                add: [SwitchBox({
                    "msg-tip": "保存后关闭",
                    checked: saveClose.state,
                    function: (event) => {
                        event.addEventListener("change", () => {
                            saveClose.state = event.checked;
                            labelConfig.stateChange(event.checked);
                            labelConfig.checkedChange(event.checked);
                            saveSwitch();
                        })
                    }
                }), Tooltip({
                    text: [{
                        name: "span",
                        innerText: [labelConfig, "delay", (value, setValue) => setValue(`延迟${value.toFixed(1)}秒关闭`)]
                    }],
                    node: [{
                        name: "div",
                        innerHTML: `<el-input-number v-if="show" size="mini" v-model="value" :min="0" :max="8" :step="0.1" label="秒" @change="inputChange"></el-input-number>`,
                        function(div) {
                            new Vue({
                                el: div,
                                data() {
                                    return {
                                        value: labelConfig.delay,
                                        show: saveClose.state,
                                    }
                                },
                                mounted() {
                                    labelConfig.stateChange = this.stateChange;
                                },
                                methods: {
                                    inputChange(params) {
                                        this.value = params;
                                        labelConfig.delay = params;
                                        saveClose.delay = params;
                                        saveSwitch();
                                    },
                                    stateChange(params) {
                                        this.show = params;
                                    }
                                }
                            })
                        }
                    }]
                })]
            }]
        }).then((div) => {
            operation.insertBefore(div, operation.firstChild);
            labelConfig.checkedChange = (checked) => {
                if (operation.children.length >= 4) {
                    div.style.gap = checked ? "5px" : "10px";
                }
            }
            labelConfig.checkedChange(saveClose.state);
        })
    }

    // 快捷申诉理由
    function appealFastReason() {
        const appealConfig = SwitchRead("Appeal-Fast-Reason");
        if (!appealConfig.state) {
            return false;
        }
        const runConfig = {
            textareaElement: null
        };
        AwaitSelectorShow(".antcap-modal-centered[aria-labelledby=rcDialogTitle0] .antcap-modal .antcap-modal-content").then((centered) => {
            if (!/^请填写理由/.test(centered.innerText)) {
                return false;
            }
            AddDOM({
                addNode: centered.querySelector(".antcap-form-item-control-wrapper"),
                addData: [{
                    name: "div",
                    className: "appeal-fast-reason-list",
                }]
            }).then((listDom) => {
                const input = centered.querySelector(".antcap-input");
                const searchItem = (value, isAll) => {
                    listDom.style.display = "flex";
                    RemoveDom(listDom);
                    const elementList = [];
                    const elementListAll = [];
                    const addList = (text, isScore) => {
                        const isActive = !isAll && text === value;
                        isActive && (isAll = true);
                        const domObj = {
                            name: "div",
                            className: "appeal-fast-reason-item" + (isActive ? " active" : ""),
                            innerText: text,
                            function(element) {
                                element.addEventListener("mousedown", () => {
                                    input._clickValue = text;
                                    input.dispatchEvent(new Event("input"));
                                });
                                if (text === value) {
                                    RunFrame(() => element.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center"
                                    }));
                                }
                            }
                        }
                        elementListAll.push(domObj);
                        isScore && elementList.push(domObj);
                    };
                    for (const text of (appealConfig.textarea || [])) {
                        if (text.includes(value)) {
                            addList(text, true);
                        } else {
                            addList(text);
                        }
                    }
                    (!isAll && elementList.length) && (elementList[0].className += " active");
                    AddDOM({
                        addNode: listDom,
                        addData: elementList.length ? isAll ? elementListAll : elementList : [!input.value ? {
                            name: "div",
                            className: "appeal-fast-reason-item-not",
                            add: [{
                                name: "span",
                                innerText: "无数据...",
                            }]
                        } : {
                            name: "div",
                            className: "appeal-fast-reason-item-not",
                            add: [{
                                name: "span",
                                innerText: "未搜索到理由...",
                            }, {
                                name: "a",
                                style: "margin-left: 10px;",
                                innerText: "点击添加",
                                function(element) {
                                    element.addEventListener("mousedown", () => runConfig.setReason(input.value));
                                }
                            }]
                        }]
                    });
                }
                const selectReason = (event, direction) => {
                    event.preventDefault();
                    const active = listDom.querySelector(".appeal-fast-reason-item.active");
                    if (direction === "click") {
                        active && active.dispatchEvent(new Event("mousedown"));
                        active && input.blur();
                        return false;
                    }
                    const maxIndex = listDom.children.length - 1;
                    const index = ([...listDom.children].indexOf(active) || 0) + direction;
                    active && active.classList.remove("active");
                    const newActive = listDom.children[index < 0 ? maxIndex : index > maxIndex ? 0 : index];
                    newActive.classList.add("active");
                    newActive.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
                input.addEventListener("keydown", (event) => {
                    if (event.key === "ArrowUp") {
                        selectReason(event, -1);
                    } else if (event.key === "ArrowDown") {
                        selectReason(event, 1);
                    } else if (event.key === "Enter") {
                        selectReason(event, "click");
                    }
                });
                input.addEventListener("input", (event) => {
                    if (input._clickValue) {
                        const oldValue = input.value;
                        const react = input[Object.keys(input).filter((key) => key.includes("reactEventHandlers"))];
                        try {
                            input.value = input._clickValue;
                            react.onChange(event);
                        } catch (error) {
                            input.value = oldValue;
                            MessageTip("❌", "选择申诉理由失败", 3, 2);
                            console.error(error);
                        }
                        input._clickValue = "";
                    }
                    searchItem(input.value);
                });
                input.addEventListener("focus", () => searchItem(input.value));
                input.addEventListener("blur", () => listDom.style.display = "none");
            });
            AddDOM({
                addNode: centered,
                addData: [{
                    name: "div",
                    className: "appeal-fast-reason",
                    add: [{
                        name: "div",
                        className: "title",
                        style: "padding: 5px;width: 100%;text-align: center;font-size: 20px;font-weight: bold;",
                        innerText: "申诉理由列表",
                    }, {
                        name: "div",
                        className: "gm-textarea",
                        style: "height: calc(100% - 50px);padding: 2px 3px;",
                        innerHTML: appealConfig.textarea ? JSON.parse(JSON.stringify(appealConfig.textarea)).map((item) => `<div>${item}</div>`).join("") : "",
                        contenteditable: true,
                        placeholder: "记录申诉理由，一行一条",
                        function(textarea) {
                            const throttleInput = ThrottleOver(() => {
                                const valueAll = textarea.innerText.split("\n").filter((item) => item);
                                if (valueAll.length === 0) {
                                    textarea.innerText = "";
                                }
                                appealConfig.textarea = valueAll;
                                SwitchWrite("Appeal-Fast-Reason", appealConfig);
                            }, 50);
                            runConfig.setReason = (value) => {
                                textarea.innerHTML += `<div>${value}</div>`;
                                throttleInput();
                            };
                            textarea.addEventListener("input", throttleInput);
                        }
                    }],
                }]
            }).then((div) => {
                const blankWidth = Math.max(440, Math.min(600, (window.innerWidth - centered.offsetWidth) / 2 - 20));
                div.style.left = -blankWidth + "px";
                div.style.width = blankWidth - 20 + "px";
            });
        });
        GM_addStyle(`
            .appeal-fast-reason .gm-textarea:empty:before {
                content: attr(placeholder);
                color: #757575;
                pointer-events: none;
            }
            .appeal-fast-reason .gm-textarea>div {
                border-top: 1px dashed rgba(0, 0, 0, 0);
                border-bottom: 1px dashed #cccccc;
                position: relative;
                padding-left: 7px;
            }
            .appeal-fast-reason .gm-textarea>div::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: #2395fe;
                    width: 4px;
                    height: calc(100% - 2px);
            }
            @keyframes appeal-fast-reason-enter {
                0% {
                    height: 100%;
                }
                100% {
                    height: 90vh;
                }
            }
            @keyframes appeal-fast-reason-leave {
                0% {
                    height: 90vh;
                }
                100% {
                    height: 100%;
                }
            }
            .zoom-leave-active .appeal-fast-reason {
                animation: appeal-fast-reason-leave 0.1s forwards;
            }
            .appeal-fast-reason {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: -440px;
                width: 420px;
                padding: 0 10px;
                overflow: hidden;
                border-radius: 4px;
                background: #ffffff;
                align-items: flex-start;
                animation: appeal-fast-reason-enter 0.3s forwards;
            }
            .appeal-fast-reason-list {
                display: none;
                flex-direction: column;
                position: absolute;
                background: #ffffff;
                border-radius: 4px;
                width: 100%;
                z-index: 10;
                padding: 4px;
                max-height: 240px;
                overflow-y: auto;
                box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.12);
            }
            .appeal-fast-reason-item {
                padding: 4px 7px;
                cursor: pointer;
                border-radius: 3px;
                min-height: 29px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .appeal-fast-reason-item.active {
                background: #e6f4ff;
            }
            .appeal-fast-reason-item:hover {
                background: #f5f5f5;
            }
            .appeal-fast-reason-item-not {
                line-height: 29px;
                text-align: center;
            }
        `)
    }

    // 图像识别
    function recognizeImages() {
        const recognize = SwitchRead("Recognize-Images");
        if (!recognize.state) {
            return false;
        }
        // 监听整个文档的 paste 事件
        window.addEventListener("paste", async (e) => {
            const activeElement = document.activeElement;
            if (["INPUT", "TEXTAREA"].includes(activeElement.tagName) || activeElement.isContentEditable) {
                return false;
            }
            e.preventDefault();
            try {
                const imgUrl = await readImage(e.clipboardData);
                recognizeRun(imgUrl);
            } catch (err) {
                console.error("读取剪切板失败：", err);
            }
        });
        // 读取图片
        async function readImage(clipboardData) {
            if (!clipboardData) return null;
            for (const item of clipboardData.items) {
                const file = await item.getAsFile();
                if (file && file.type.startsWith("image/")) {
                    return URL.createObjectURL(file);
                }
            }
            return null;
        }
        async function recognizeRun(imgUrl) {
            if (!imgUrl) {
                return MessageTip("❌", "识图：剪贴板无图像", 3, 2);
            }
            let isClose = null;
            let [imgBlob, imgBase64, imgHash] = [null, null, null];
            const { element: settingDom, close: closeBox } = await MessageBox({
                id: "box-recognize-images",
                style: "width: 800px;height: 600px;",
                title: "以图搜图",
                body: [{
                    name: "canvas",
                    style: "cursor: crosshair;",
                    function(canvas) {
                        canvas.parentNode.style.border = "1px solid #bbbbbb";
                        canvas.parentNode.style.borderRadius = "5px";
                        const ctx = canvas.getContext("2d");
                        let [drawX, drawY, drawScale, drawWidth, drawHeight] = [0, 0, 0, 0, 0];
                        const image = new Image();
                        image.src = imgUrl;
                        image.onload = () => {
                            canvas.width = 756;
                            canvas.height = 466;
                            drawScale = Math.min(canvas.width / image.width, canvas.height / image.height);
                            [drawWidth, drawHeight] = [image.width * drawScale, image.height * drawScale];
                            [drawX, drawY] = [(canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2];
                            ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
                            exportImg();
                        };
                        // 框选变量
                        let isSelecting = false;
                        let [startX, startY, currentX, currentY] = [0, 0, 0, 0];
                        let [selection, oldSelection] = [null, null];
                        // 鼠标按下
                        canvas.addEventListener("mousedown", (e) => {
                            if (e.button !== 0) return;
                            const rect = canvas.getBoundingClientRect();
                            startX = Math.max(drawX, Math.min(drawX + drawWidth, e.clientX - rect.left));
                            startY = Math.max(drawY, Math.min(drawY + drawHeight, e.clientY - rect.top));
                            [currentX, currentY] = [startX, startY];
                            isSelecting = true;
                            document.addEventListener("mousemove", handleMouseMove);
                        });
                        // 鼠标在文档内松开 - 结束选择
                        document.addEventListener("mouseup", (e) => {
                            if (!isSelecting || e.button !== 0) return;
                            isSelecting = false;
                            document.removeEventListener("mousemove", handleMouseMove);
                            if (selection && (selection.width < 20 || selection.height < 20)) {
                                MessageTip("❌", "选区小于20像素", 3).open(settingDom);
                                selection = oldSelection;
                            } else {
                                oldSelection = selection;
                            }
                            redraw();
                            exportImg();
                        });
                        // 处理鼠标移动（带边界限制）
                        function handleMouseMove(e) {
                            if (!isSelecting) return;
                            const rect = canvas.getBoundingClientRect();
                            // 计算当前坐标并限制在Canvas内（核心：边界限制）
                            currentX = Math.max(drawX, Math.min(drawX + drawWidth, e.clientX - rect.left));
                            currentY = Math.max(drawY, Math.min(drawY + drawHeight, e.clientY - rect.top));
                            redraw();
                        }
                        // 导出选框区域为图片
                        async function exportImg() {
                            const { x, y, width, height } = selection ? selection : {
                                x: drawX, y: drawY, width: drawWidth, height: drawHeight
                            };
                            // 创建临时Canvas用于绘制选框区域
                            const tempCanvas = document.createElement("canvas");
                            tempCanvas.width = width;
                            tempCanvas.height = height;
                            tempCanvas.getContext("2d").drawImage(
                                image,
                                (x - drawX) / drawScale, (y - drawY) / drawScale, width / drawScale, height / drawScale,
                                0, 0, width, height
                            );
                            await getImageHash(tempCanvas).then((hash) => imgHash = hash);
                            tempCanvas.toBlob((blob) => imgBlob = blob);
                            imgBase64 = tempCanvas.toDataURL("image/png");
                            tempCanvas.remove();
                        }
                        // 重绘Canvas
                        function redraw() {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
                            if (isSelecting || selection) {
                                ctx.save();
                                ctx.strokeStyle = "red";
                                ctx.lineWidth = 1;
                                ctx.setLineDash([5, 3]);
                                const { x, y, width, height } = isSelecting
                                    ? (() => {
                                        const x1 = Math.min(startX, currentX);
                                        const y1 = Math.min(startY, currentY);
                                        const x2 = Math.min(Math.max(startX, currentX), canvas.width);
                                        const y2 = Math.min(Math.max(startY, currentY), canvas.height);
                                        return (selection = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
                                    })()
                                    : selection;
                                ctx.strokeRect(x, y, width, height);
                                ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                                ctx.fillRect(x, y, width, height);
                                ctx.restore();
                            }
                        }
                    }
                }],
                footer: [{
                    name: "select",
                    style: "outline: none;border-radius: 5px;border: 1px solid #cccccc;padding: 0 5px;cursor: pointer;height: 32px;width: 80px;",
                    add: recognize.freeValue.map((list, index) => ({
                        name: "option",
                        value: index,
                        selected: index === recognize.valueIndex,
                        innerText: list.name
                    })),
                    function(element) {
                        element.addEventListener("change", function () {
                            recognize.valueIndex = Number(this.value);
                            SwitchWrite("Recognize-Images", recognize);
                        });
                    }
                }, {
                    name: "button",
                    className: "gm-button danger",
                    innerHTML: "关闭",
                    click: () => {
                        isClose = true;
                        URL.revokeObjectURL(imgUrl);
                        closeBox();
                    }
                }, {
                    name: "button",
                    className: "gm-button",
                    innerHTML: "识别",
                    click: async (_, element) => {
                        if (element._postRun) {
                            MessageTip("❌", "图像上传中", 3).open(settingDom);
                            return false;
                        }
                        element._postRun = true;
                        element.innerText = "识别中...";
                        element.classList.add("disabled", true);
                        getHashStore(imgHash).catch(() =>
                            uploadSogou(imgBlob).catch(() =>
                                upload360(imgBase64).catch(() => uploadCcloli(imgBase64))
                            ).then((imgSrc) => setHashStore(imgHash, imgSrc))
                        ).then((uploadImg) => {
                            if (isClose) {
                                return false;
                            }
                            const valueObj = recognize.freeValue[recognize.valueIndex] || recognize.freeValue[0];
                            if (/ris.sogou.com/i.test(valueObj.url) && !/sogoucdn.com/.test(uploadImg)) {
                                uploadImg = encodeURIComponent("https://img.sogoucdn.com/v2/thumb/?appid=122&url=" + uploadImg);
                            }
                            const openUrl = valueObj.url.replace(/{%s}/, uploadImg);
                            window.open(openUrl, "_blank");
                            URL.revokeObjectURL(imgUrl);
                            closeBox();
                        }).catch((error) => {
                            console.error(error);
                            MessageTip("❌", "上传图像失败", 3).open(settingDom);
                        }).finally(() => {
                            element._postRun = false;
                            element.innerText = "识别";
                            element.classList.remove("disabled");
                        });
                    }
                }],
            })
        }
        async function uploadSogou(blob) {
            if (!blob) {
                throw new Error("搜狗图片，上传失败：空图像");
            }
            const formData = new FormData();
            formData.append("pic_path", blob);
            return GM_XHR({
                url: "https://pic.sogou.com/pic/upload_pic.jsp",
                method: "POST",
                data: formData
            }).then((data) => {
                if (!data.response || !/^http/.test(data.response)) {
                    const error = new Error(`搜狗图片，上传失败：${data.response}`);
                    console.error(error);
                    throw error;
                }
                return data.response.replace(/^http:/i, "https:");
            })
        }
        async function upload360(imgBase64) {
            if (!imgBase64) {
                throw new Error("360图片，上传失败：空图像");
            }
            const time = new Date().getTime();
            const formData = new FormData();
            formData.append("upload", `${time}.png`);
            formData.append("src", "st");
            formData.append("img_url", "");
            formData.append("submittype", "upload");
            formData.append("img_buf", imgBase64);
            return GM_XHR({
                url: "https://st.so.com/r?src=st&srcsp=home",
                method: "POST",
                data: formData
            }).then((data) => {
                const regex = /<script\s+id="imgdata"[^>]*?data-imgurl="(.*?)"/;
                const match = data.response.match(regex);
                if (match && match[1] && /^http/.test(match[1])) {
                    return match[1];
                } else {
                    const error = new Error(`360图片，上传/解析失败：${data.response}`);
                    console.error(error);
                    throw error;
                }
            })
        }
        async function uploadCcloli(imgBase64) {
            if (!imgBase64) {
                throw new Error("Ccloli图片，上传失败：空图像");
            }
            const formData = new FormData();
            formData.append("imgdata", imgBase64);
            return GM_XHR({
                url: "https://sbi.ccloli.com/img/upload.php",
                method: "POST",
                data: formData
            }).then((data) => {
                if (!data.response || !/^http/.test(data.response)) {
                    const error = new Error(`Ccloli图片，上传失败：${data.response}`);
                    console.error(error);
                    throw error;
                }
                return data.response;
            })
        }
        async function getImageHash(canvas) {
            const [width, height] = [9, 8];
            const smallCanvas = document.createElement("canvas");
            smallCanvas.width = width
            smallCanvas.height = height;
            smallCanvas.getContext("2d").drawImage(canvas, 0, 0, width, height);
            const data = smallCanvas.getContext("2d").getImageData(0, 0, width, height).data;
            let hexHash = "";
            let binary = "";
            for (let i = 0; i < data.length; i += 4) {
                // 计算灰度值
                const gray = (data[i] + data[i + 1] + data[i + 2]) >> 2; // 等价于除以3（近似）
                const pos = i >> 2; // 转换为像素索引（i/4取整）
                // 每行前8个像素才需要比较（第9个是下一次比较的左值）
                if (pos % 9 < 8) {
                    binary += gray > ((data[i + 4] + data[i + 5] + data[i + 6]) >> 2) ? "1" : "0";
                }
                // 每4位二进制转换为1位十六进制
                if (binary.length === 4) {
                    hexHash += parseInt(binary, 2).toString(16);
                    binary = "";
                }
            }
            smallCanvas.remove();
            return hexHash;
        }
        async function getHashStore(hash) {
            const find = recognize.hashStore.find((item) => item.hash === hash);
            if (!find) {
                throw new Error(`哈希不存在，上传图片：${hash}`);
            }
            const time = new Date().getTime();
            // 哈希过期时间30分钟
            if (time - find.time > 1000 * 60 * 30) {
                recognize.hashStore = recognize.hashStore.filter((item) => item.hash !== hash);
                SwitchWrite("Recognize-Images", recognize);
                throw new Error(`哈希过期，上传图片：${hash}`);
            }
            return find.imgSrc;
        }
        async function setHashStore(hash, imgSrc) {
            const time = new Date().getTime();
            recognize.hashStore.push({ hash, imgSrc, time });
            if (recognize.hashStore.length > 5) {
                recognize.hashStore = recognize.hashStore.slice(-5);
            }
            SwitchWrite("Recognize-Images", recognize);
            return imgSrc;
        }
    }
    // console.log(config)

    //开启指定插件,分析板块来源
    const bizLineId = GetQueryString("bizLine");
    const contentTypeId = GetQueryString("contentType");
    const contentSourceId = GetQueryString("contentSource");
    console.log("板块信息", bizLineId, contentTypeId, contentSourceId);
    // 通用启动器
    (() => {
        topTitle(true);
        sukImgDisplay();
        videoRateFast();
        videoRepeatTest();
        videoScrollEvent();
        medicineHlight();
        originalHlight();
        videoInWindowAuto();
        onePagePlayback();
        videoProgressBar();
        getSkuInfo();
        appealFastReason();
        recognizeImages();
    })();
    const openConfig = [{
        name: "京东视频",
        bizLineId: 7,
        contentTypeId: [1, 2],
        contentSourceId: [1, 21, 27, 38, 1111, 11121], // 达人平台、内容助手、负反馈、测评内容、先后-达人平台、先后-内容助手
        function: () => {
            lightTalkLabel();
            sphereCheckDisplay();
            videoSmallHeight();
            blockContentTags((showState) => {
                // if (isCover([1, 21, 27, 38], contentSourceId)) {
                //     return false;
                // }
                return showState === 1;
            }, () => {
                if (isCover([1, 21, 27, 38], contentSourceId)) {
                    return true;
                }
                return false;
            });
            machineOnlyBlock();
            qcDataConvert();
        }
    }, {
        name: "主图视频",
        bizLineId: 7,
        contentTypeId: [1, 2],
        contentSourceId: [45, 11145, 11245, 11311145], // 主图视频、先发-主图、高热主图、高热-先后-主图
        function: () => {
            lightTalkLabel();
            sphereCheckDisplay();
            videoSmallHeight();
            blockContentTags((showState) => {
                // if (isCover([1, 21, 27, 38], contentSourceId)) {
                //     return false;
                // }
                return showState === 1;
            }, () => {
                if (isCover([1, 21, 27, 38], contentSourceId)) {
                    return true;
                }
                return false;
            });
            machineOnlyBlock();
            qcDataConvert();
        }
    }, {
        name: "京东视频-高热",
        bizLineId: 7,
        contentTypeId: [1, 2],
        contentSourceId: [1121, 11221, 11311121, 1131111], // 高热-达人平台、高热-内容助手、高热-先后-达人平台、高热-先后-内容助手
        function: () => {
            labelBanPick();
            labelRulesPlay();
            sphereCheckDisplay();
            videoSmallHeight();
            machineOnlyBlock();
            qcDataConvert();
            labelSizeChange();
        }
    }, {
        name: "商品视频",
        bizLineId: 34,
        contentTypeId: [1, 2],
        contentSourceId: [1, 26, 27, 1111, 11126, 1131111, 11311126], // 达人平台、商品视频、视频负反馈、先后-达人平台、先后-商品视频、高热-先后-达人平台、高热-先后-商品视频
        function: () => {
            lightTalkLabel();
            sphereCheckDisplay();
            videoSmallHeight();
            blockContentTags();
            qcDataConvert();
        }
    }, {
        name: "视频标签",
        bizLineId: 7,
        contentSourceId: [9931, 99321, 9931111, 99311121], // 达人平台、内容助手、先后-达人平台、先后-内容助手
        function: () => {
            labelBanPick();
            labelFastNext();
            labelRulesPlay();
            imgDisplayClose();
            qcDataConvert();
            labelSizeChange();
            videoSmallHeight();
            labelSaveClose();
            labelAutoQc();
        }
    }, {
        name: "京东视频-先后热点",
        bizLineId: 7,
        contentSourceId: [99011121, 9901111], // 先后-内容助手、先后-达人平台
        function: () => {
            labelBanPick();
            labelFastNext();
            imgDisplayClose();
            qcDataConvert();
            labelSizeChange();
            labelSaveClose();
        }
    }, {
        name: "种草秀",
        bizLineId: 32,
        contentTypeId: 19,
        contentSourceId: 25,
        function: () => {
            recommCategory();
        }
    }, {
        name: "种草秀打标",
        bizLineId: 32,
        contentTypeId: 19,
        contentSourceId: 99325,
        function: () => {
            recommPersonify();
        }
    }, {
        name: "黄金流程",
        bizLineId: 17,
        function: () => {
            lightTalkLabel();
        }
    }, {
        name: "私域-文章",
        bizLineId: 1,
        contentTypeId: 5,
        contentSourceId: 1,
        function: () => {
            lightTalkLabel();
            privateWenzhang();
        }
    }, {
        name: "私域-其它",
        bizLineId: 1,
        contentTypeId: [1, 2, 7, 10, 11, 12], // 视频、竖版视频、清单、搭配、买家秀、上新
        contentSourceId: 1,
        function: () => {
            lightTalkLabel();
        }
    }, {
        name: "图文",
        bizLineId: 39,
        contentTypeId: 28,
        function: () => {
            labelFastNext();
            sphereCheckDisplay();
            blockContentTags();
        }
    }, {
        name: "直播视频",
        bizLineId: 19,
        function: () => {
            // recommCategory();
        }
    }, {
        name: "实时直播间",
        bizLineId: 24,
        function: () => {
            GM_addStyle(`
                .detail-content {
                    min-width: 480px !important;
                }
                .detail-operation {
                    margin: 0 !important;
                }
                .detail-operation button {
                    margin: 30px 6px 0 6px !important;
                }
                .detail-left .liveroom-tabs-content {
                    max-height: calc(100vh - 72px) !important;
                }
                .liveroom-tabs-content .antcap-descriptions-row>td,
                .liveroom-tabs-content .antcap-descriptions-row>th {
                    padding-bottom: 8px;
                }
            `)
            liveTimeJump();
            liveMaintainTime();
            liveContentSource();
            liveHistoryRecord();
            liveHistoryText();
            liveScreenshot();
            AddDOM({
                addData: [{
                    name: "div",
                    className: "gm-live-qc-record"
                }, {
                    name: "div",
                    className: "gm-inner-qc-main"
                }, {
                    name: "div",
                    className: "gm-live-qc-text"
                }]
            }, true).then(async (divArr) => {
                const rightDom = await AwaitSelectorShow(".detail-right .antcap-collapse");
                for (let i = divArr.length - 1; i >= 0; i--) {
                    const div = divArr[i];
                    rightDom && rightDom.insertBefore(div, rightDom.firstChild);
                }
            })
        }
    }]
    for (const list of openConfig) {
        if (isCover(list.bizLineId, bizLineId)) {
            if (isCover(list.contentTypeId, contentTypeId)) {
                if (isCover(list.contentSourceId, contentSourceId)) {
                    list.function(list);
                    console.log("板块：" + list.name);
                    break;
                }
            }
        }
    }
    function isCover(openId, nowId) {
        if (!openId || openId === nowId * 1) {
            return true;
        }
        if (typeof openId === "object" && openId.indexOf(nowId * 1) !== -1) {
            return true;
        }
    }
}
// 加载其它函数
function Plug_OtherFunction() {
    const { SwitchRead, SwitchWrite, MessageTip, AwaitSelectorShow } = Plug_fnClass();
    // HTTP_XHR({
    //     method: "GET", url: "http://127.0.0.1:5500/other.js"
    // }).then((content) => {
    //     return {
    //         data: content.responseText
    //     }
    // }).then(async (content) => {
    //     // content.data = CompressCode(content.data);
    //     // console.log(content.data)
    // 获取网络中的执行代码
    let isRunWebCode = false;
    getServerData("jd-other-1.1", "GM_OTHER_JS", async (content) => {
        if (content.data && !isRunWebCode) {
            try {
                isRunWebCode = true;
                const runOtherJs = new Function("Plug_fnClass", `return async ()=>{${content.data}}`);
                await runOtherJs(Plug_fnClass)();
            } catch (error) {
                console.error("动态函数执行时出错", error);
            }
        }
        const host = window.location.host; // 获取host
        const search = window.location.search; // 获取search
        if (host === "ver.jd.com") {
            if (!!search && search.length > 90) {
                runDebugCode();
            }
        }
    })

    // 初始化调试
    async function runDebugCode() {
        await AwaitSelectorShow("div", true);
        const debugConfig = SwitchRead("debug");
        if (!debugConfig.key) {
            return false;
        }
        let isRun = false;
        const time = new Date().getTime();
        document.addEventListener("keydown", runDeubg);
        if (isAuto()) {
            setTimeout(() => {
                runDeubg({ autoDeubg: true });
            }, 200)
        }
        function isAuto() {
            if (!debugConfig.auto) {
                return false;
            }
            if (debugConfig.autoError) {
                return false;
            }
            if (!debugConfig.time || time - debugConfig.time >= 1000 * 60 * 60) {
                return false;
            }
            return true;
        }
        // 判断是不是输入框
        function isInputElement(element) {
            if (!element) {
                return false;
            }
            return ["input", "textarea", "select"].includes(element.tagName.toLowerCase());
        }
        function runDeubg(event) {
            if (isInputElement(event.target)) {
                return false;
            }
            // 判断是不是组合键
            if (event.ctrlKey || event.altKey || event.shiftKey) {
                return false;
            }
            if (event.key === debugConfig.key || event.autoDeubg) {
                if (isRun) {
                    SwitchWrite("debug", { ...debugConfig, autoError: true });
                    return MessageTip("✔️", "调试已关闭", 3, 2);
                }
                const deBugFun = new Function("Plug_fnClass", `(async()=>{${debugConfig.code}})()`);
                try {
                    isRun = true;
                    deBugFun(Plug_fnClass);
                    SwitchWrite("debug", { ...debugConfig, time: time, autoError: false });
                } catch (error) {
                    SwitchWrite("debug", { ...debugConfig, autoError: true });
                    MessageTip("❌", "调试代码错误，代码存在问题", 3, 2);
                    console.error(error);
                }
            }
        }
    }
}
// 加载内检页面
async function Plug_innerQcPage(paramsConfig) {
    const { GM_XHR, HTTP_XHR, AddDOM, MessageTip, FormatTime, JDPinUserClass, UpdateUrlParam, GetQueryString, SwitchRead, ObjectProperty, AwaitSelectorShow, GetApiCache, ThrottleOver, ObserverDOM } = Plug_fnClass();
    const { antcapCard, collapseCard, SwitchBox } = Plug_Components();
    // 获取Token
    const { token, user } = SwitchRead("Plugin-Key") || {};
    const getToken = () => token || user;
    if (!getToken()) {
        return false;
    }

    const urlParams = GetQueryString(null);
    urlParams.bizLineId = urlParams.bizLine;
    urlParams.contentTypeId = urlParams.contentType;
    urlParams.contentSourceId = urlParams.contentSource;

    if (!urlParams.innerQc) {
        console.log("不是内检");
        return false;
    }

    const [qcData] = await Promise.all([
        getQcData(),
        new Promise((resolve, reject) => {
            ["dataContent", "liveWatchTime"].forEach((item) => {
                ObjectProperty(paramsConfig, item, (params) => {
                    if (params.value) {
                        params.stop();
                        resolve();
                    }
                })
            })
        }),
        (() => {
            if (urlParams.bizLine == 24) {
                return HTTP_XHR({
                    url: UpdateUrlParam("https://ver.jd.com//api/biz/audit/manual/getRejectReason", {
                        bizLine: urlParams.bizLine,
                        subLine: urlParams.subLine,
                        contentSource: urlParams.contentSource,
                        contentType: urlParams.contentType,
                    })
                }).then((xhr) => {
                    const data = JSON.parse(xhr.responseText).content || [];
                    paramsConfig.liveRejectReason = data;
                })
            }
        })()
    ]).catch((error) => {
        console.error(error);
        MessageTip("❌", "获取内检数据失败", 3, 2);
    });

    if (!qcData.data) {
        console.error("内检无数据");
        return false;
    }
    const { getPinUser } = await JDPinUserClass();
    const { dataContent, liveWatchTime } = paramsConfig;
    const qcDataInfo = qcData.data || {};
    const { innerQcInfo = {}, isInnerQcUser } = qcDataInfo;

    if (urlParams.bizLine == 24) {
        isLivePage();
    } else {
        notLivePage();
    }

    const stateColorList = {
        "审核错": "#42A5F5",
        "质检错": "#EF5350",
        "双方错": "#EF5350",
        "低级错误": "#EF5350",
        "建议质检错": "#FFA726",
        "新人成长错": "#FFA726",
        "不计双方错": "#66BB6A",
        "存疑案例": "#FFA726",
    };
    const appealStateColor = {
        "接受质检": "#FFA726",
        "提起申诉": "#42A5F5",
        "申诉通过": "#66BB6A",
        "申诉驳回": "#EF5350",
    };
    // 直播监看
    async function isLivePage() {
        const collapse = collapseCard();
        collapse.setCardName("内部质检");
        collapse.setBody([{
            name: "div",
            function: (element) => {
                if (isInnerQcUser) {
                    addInnerQcPage(element);
                } else {
                    addPlainPage(element);
                }
            }
        }]);
        collapse.setPage(async (element) => {
            const rightDom = await AwaitSelectorShow(".gm-inner-qc-main");
            rightDom.parentNode.replaceChild(element, rightDom);
        })
        collapse.open(true);
    }

    // 非直播直播
    async function notLivePage() {
        const detailContent = await AwaitSelectorShow(".detailContent");
        const detailWrapper = await AwaitSelectorShow(".detailWrapper");
        detailContent.style.maxWidth = "none";
        detailWrapper.style.padding = "0 20px";
        detailWrapper.style.gap = "10px";
        const firstChild = detailWrapper.firstElementChild;
        firstChild.style.marginRight = 0;
        firstChild.style.minWidth = "570px";
        AddDOM({
            addNode: detailWrapper,
            addData: [{
                name: "div",
                style: "max-width: 450px;",
                className: "detail-opinion",
                add: [{
                    name: "div",
                    className: "detail-machine",
                    function(element) {
                        antcapCard({
                            addNode: element,
                            title: {
                                innerText: "内部质检"
                            },
                            body: {
                                style: "padding: 20px 15px;",
                                function: (element) => {
                                    if (isInnerQcUser) {
                                        addInnerQcPage(element);
                                    } else {
                                        addPlainPage(element);
                                    }
                                }
                            }
                        })
                    }
                }]
            }]
        })
        // 动态尺寸的视频
        const videoAll = firstChild.querySelectorAll("video");
        videoAll.forEach((element) => {
            const parentNode = element.parentNode;
            if (parentNode.offsetWidth > 360) {
                parentNode.style.margin = 0;
                window.addEventListener("resize", () => resizeVideo(parentNode));
                resizeVideo(parentNode);
            }
        })
        function resizeVideo(element) {
            const width = firstChild.offsetWidth - 110;
            const height = (width * 9) / 16; // 假设目标比例为 16:9
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
        }
        GM_addStyle(`
            .detailWrapper .detail-opinion {
                min-width: 470px;
                max-width: 560px;
            }
        `)
    }

    GM_addStyle(`
        .el-select-dropdown__wrap {
            max-height: 300px;
        }

        .inner-plain-list {
            display: flex;
            flex-direction: column;
        }
        .inner-plain-list .el-tag--dark {
            border-color: rgba(0, 0, 0, 0);
        }
        .inner-plain-list .qc-state {
            text-align: center;
        }
        .inner-plain-list .appeal {
            border: 1px solid #d7dae2;
            padding: 5px;
            border-radius: 5px;
            gap: 5px;
            display: flex;
            flex-direction: column;
        }
        .inner-plain-list .appeal-post {
            gap: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .inner-plain-list th,
        .inner-appeal-list th {
            width: 60px;
        }
        .inner-appeal-list .el-select input {
            padding: 0 20px 0 6px;
        }
        .inner-appeal-list .el-select .el-input__icon {
            width: 15px;
        }
        .inner-appeal-list .el-tag--dark {
            border-color: rgba(0, 0, 0, 0);
        }

        .inner-plain-list .qc-item,
        .inner-plain-list .appeal-info,
        .inner-appeal-list,
        .inner-qc-list,
        .inner-qc-list>div {
            gap: 10px;
            display: flex;
            flex-direction: column;
        }
        .inner-qc-list>div {
            gap: 5px;
            padding: 5px;
            border-radius: 8px;
            border: 1px solid #cecece;
        }
        .inner-qc-list .select {
            display: flex;
            gap: 5px;
        }
        .inner-qc-list .select input {
            padding: 0 20px 0 6px;
        }
        .inner-qc-list .select .el-input__icon {
            width: 15px;
        }

        .inner-info th {
            width: auto;
        }
    `)
    async function addPlainPage(element) {
        const qcInfo = innerQcInfo.qcInfo || (innerQcInfo.qcInfo = []);
        const appeals = innerQcInfo.appeal || (innerQcInfo.appeal = []);
        AddDOM({
            addNode: element,
            addData: [{
                name: "div",
                class: "inner-plain-list",
                innerHTML: `
                    <el-descriptions column="2" size="small" border class="inner-info">
                        <el-descriptions-item label="质检人" :label-style="{ 'width': '100px' }">{{qcUserInfo.qcUser}}</el-descriptions-item>
                        <el-descriptions-item label="时间">{{qcUserInfo.qcTime}}</el-descriptions-item>
                        <el-descriptions-item label="内检人">{{qcUserInfo.innerQcUser}}</el-descriptions-item>
                        <el-descriptions-item label="时间">{{qcUserInfo.innerQcTime}}</el-descriptions-item>
                        <template v-if="qcUserInfo.qcManageReviewPerson">
                            <el-descriptions-item label="质检管理复审">{{qcUserInfo.qcManageReviewPerson}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.qcManageReviewTime}}</el-descriptions-item>
                        </template>
                        <template v-if="qcUserInfo.auditManageReviewPerson">
                            <el-descriptions-item label="审核管理复审">{{qcUserInfo.auditManageReviewPerson}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.auditManageReviewTime}}</el-descriptions-item>
                        </template>
                        <template v-if="qcUserInfo.arbitrationPerson">
                            <el-descriptions-item label="运营仲裁人">{{qcUserInfo.arbitrationPerson}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.arbitrationTime}}</el-descriptions-item>
                        </template>
                        <template v-if="qcUserInfo.appealUser && qcUserInfo.appealTime">
                            <el-descriptions-item label="申诉处理人">{{qcUserInfo.appealUser}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.appealTime}}</el-descriptions-item>
                        </template>
                    </el-descriptions>
                    <el-divider>内检明细</el-divider>
                    <el-empty description="无内部质检" image-size="100" v-if="!isEmpty"></el-empty>
                    <div v-if="isEmpty" class="qc-item">
                        <el-descriptions column="2" size="small" border v-for="item in qcInfo" :key="item.state">
                            <el-descriptions-item label="状态">
                                <el-tag effect="dark" size="mini" :color="item.color">{{item.state}}</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="类型" :content-style="{ width: '35%' }">{{item.auditType}}</el-descriptions-item>
                            <el-descriptions-item label="说明" span="2">{{item.auditItem}}</el-descriptions-item>
                            <el-descriptions-item label="备注" span="2">{{item.reason || "无"}}</el-descriptions-item>
                        </el-descriptions>
                        <div class="qc-state">
                            <span>整体判罚:</span>
                            <el-tag effect="dark" :color="color">{{state}}</el-tag>
                        </div>
                    </div>
                    <el-divider v-if="isEmpty && (isAppeal || appealInfo.length)">操作</el-divider>

                    <div class="appeal-info" v-if="isEmpty">
                        <el-descriptions column="2" size="small" border v-for="item in appealInfo" :key="item.state">
                            <el-descriptions-item label="状态" :label-style="{'white-space': 'nowrap'}" :content-style="{'white-space': 'nowrap'}">
                                <el-tag effect="dark" size="mini" :color="item.color" style="margin-right: 5px;">{{item.state}}</el-tag>
                                <el-tag v-if="item.stateType" effect="dark" size="mini" :color="item.stateColor">{{item.stateType}}</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="时间" :label-style="{'white-space': 'nowrap'}" :content-style="{
                                'max-width': '125px',
                                'overflow': 'hidden',
                                'white-space': 'nowrap',
                                'text-overflow': 'ellipsis'
                            }">
                                {{item.time}}
                            </el-descriptions-item>
                            <el-descriptions-item label="申诉" span="2" v-if="item.info">{{item.info}}</el-descriptions-item>
                            <el-descriptions-item label="结论" span="2" v-if="item.backInfo">{{item.backInfo}}</el-descriptions-item>
                        </el-descriptions>
                        <div v-if="isAppeal" class="appeal">
                            <el-input
                                v-if="isTextarea"
                                type="textarea"
                                size="small"
                                autosize
                                placeholder="请输入内容"
                                v-model="textarea"
                                maxlength="200"
                                :autosize="{ minRows: 4 }"
                                show-word-limit>
                            </el-input>
                            <div class="appeal-post">
                                <span>操作: </span>
                                <el-select
                                    v-model="value"
                                    style="width: 115px;"
                                    filterable
                                    placeholder="请选择"
                                    size="small"
                                    class="state"
                                    @change="stateChange"
                                    ref="valueRef">
                                    <el-option v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select
                                    v-show="isTextarea"
                                    v-model="valueType"
                                    style="width: 115px;"
                                    filterable
                                    placeholder="请选择"
                                    size="small"
                                    class="state"
                                    @change="stateChangeType"
                                    ref="valueTypeRef">
                                    <el-option v-for="item in valueTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button style="height: 32px;" type="primary" size="small" @click="serverData" :loading="loading">提 交</el-button>
                            </div>
                        </div>
                    </div>
                `,
                function(div) {
                    new Vue({
                        el: div,
                        data() {
                            const options = ["接受质检", "提起申诉"];
                            const valueTypeOptions = ["审核错", "不计双方错", "双方错"];
                            return {
                                isEmpty: !!innerQcInfo.qcUser,
                                qcInfo: qcInfo.map((item) => ({
                                    ...item,
                                    color: stateColorList[item.state]
                                })),
                                state: innerQcInfo.state,
                                color: stateColorList[innerQcInfo.state],
                                options: options.map((item) => ({
                                    label: item,
                                    value: item
                                })),
                                value: options.includes(innerQcInfo.appealState) ? innerQcInfo.appealState : "接受质检",
                                valueType: valueTypeOptions[0],
                                valueTypeOptions: valueTypeOptions.map((item) => ({
                                    label: item,
                                    value: item
                                })),
                                textarea: "",
                                isTextarea: false,
                                isAppeal: innerQcInfo.isWarn,
                                appealInfo: appeals.map((item) => ({
                                    ...item,
                                    color: appealStateColor[item.state],
                                    stateColor: stateColorList[item.stateType]
                                })),
                                qcUserInfo: {
                                    qcUser: getPinUser(qcDataInfo.qcPerson),
                                    qcTime: qcDataInfo.qcTime,
                                    innerQcUser: getPinUser(innerQcInfo.qcUser) || "无",
                                    innerQcTime: innerQcInfo.time || "无",
                                    appealUser: getPinUser(innerQcInfo.appealUser),
                                    appealTime: innerQcInfo.appealTime,
                                    qcManageReviewPerson: getPinUser(qcDataInfo.qcManageReviewPerson),
                                    qcManageReviewTime: qcDataInfo.qcManageReviewTime,
                                    auditManageReviewPerson: getPinUser(qcDataInfo.auditManageReviewPerson),
                                    auditManageReviewTime: qcDataInfo.auditManageReviewTime,
                                    arbitrationPerson: getPinUser(qcDataInfo.arbitrationPerson),
                                    arbitrationTime: qcDataInfo.arbitrationTime,
                                },
                                loading: false
                            }
                        },
                        mounted() {
                            this.stateChange(this.value);
                            this.setColor(this.valueType, "valueTypeRef");
                        },
                        methods: {
                            setColor(params, refName) {
                                const stateEle = this.$refs[refName] ? this.$refs[refName].$el.querySelector("input") : {};
                                const color = stateColorList[params] || appealStateColor[params];
                                if (color) {
                                    stateEle.style = `background: ${color};border-color: ${color};color: #ffffff;transition: none;`;
                                }
                            },
                            stateChangeType(params) {
                                this.setColor(params, "valueTypeRef");
                            },
                            stateChange(params) {
                                if (params === "提起申诉") {
                                    this.isTextarea = true;
                                } else {
                                    this.isTextarea = false;
                                }
                                innerQcInfo.appealState = params;
                                this.setColor(params, "valueRef");
                            },
                            async serverData() {
                                if (!this.loading) {
                                    if (user !== qcDataInfo.qcPerson) {
                                        return MessageTip("❌", "不能处理Ta人的内部质检", 3, 2);
                                    }
                                    if (!this.textarea && this.value === "提起申诉") {
                                        return MessageTip("❌", "请填写申诉理由", 3, 2);
                                    }
                                    if (!this.value) {
                                        return MessageTip("❌", "请选择质检状态", 3, 2);
                                    }
                                    this.loading = true;
                                    await postQcData({
                                        ...innerQcInfo,
                                        appeal: [
                                            ...appeals,
                                            {
                                                state: this.value,
                                                stateType: this.valueType,
                                                time: FormatTime("YYYY-MM-DD hh:mm:ss"),
                                                info: this.textarea
                                            }
                                        ]
                                    });
                                    this.loading = false;
                                }
                            }
                        }
                    })
                }
            }]
        })
    }

    async function addInnerQcPage(element) {
        const stateList = Object.keys(stateColorList).map((key) => ({
            label: key,
            value: key,
            color: stateColorList[key]
        }));
        const rejectKey = {
            text: "标题/文本",
            picture: "图片",
            video: "视频",
            audio: "音频",
            sku: "商卡",
            other: "整体",
            quality: "质量"
        };
        const rejectQuality = [{
            reason: "低质"
        }, {
            reason: "优质"
        }];
        const { auditInfoList, qualityManualState, qcQualityManualState, fourKey, auditList } = dataContent || {};

        const qcInfo = innerQcInfo.qcInfo || (innerQcInfo.qcInfo = []);
        const appeals = innerQcInfo.appeal || (innerQcInfo.appeal = []);
        let qcListOptions = {};

        // 自动获取基本信息
        const runAutoConfig = [{
            name: "京东视频-先后热点",
            bizLineId: 7,
            contentSourceId: [99011121, 9901111], // 先后-内容助手、先后-达人平台
            function() {
                labelMark("classifyTagTreeResult", "classifyTagList");
            }
        }, {
            name: "视频标签",
            bizLineId: 7,
            contentSourceId: [9931, 99321, 9931111, 99311121], // 达人平台、内容助手、先后-达人平台、先后-内容助手
            function() {
                labelMark("qualityTagTreeResult", "qualityTagList");
            }
        }, {
            name: "实时直播间",
            bizLineId: 24,
            function() {
                const rejectKey = {
                    "无需操作": "无需操作",
                    "警告操作": "警告",
                    "去浮现权操作": "去浮现",
                    "结束直播操作(断流)": "结束直播",
                }
                qcListOptions = {
                    // 设置错误类型
                    stateOptions: stateList,
                    // 设置素材类型
                    auditTypeOptions: Object.values(rejectKey).map((value) => ({
                        value: value,
                        label: value
                    })),
                    // 设置错误理由
                    auditItemOptions: [{
                        label: "原因",
                        options: paramsConfig.liveRejectReason.map(({ reason }) => ({
                            value: reason,
                            label: reason
                        }))
                    }]
                };
                liveAuto(rejectKey);
            }
        }, {
            name: "其他",
            async function() {
                await new Promise((resolve, reject) => {
                    ObjectProperty(paramsConfig, "rejectReason", (params) => {
                        const { rejectReason } = paramsConfig;
                        if (Object.keys(rejectReason).length) {
                            resolve();
                            params.stop();
                            rejectReason.quality = rejectQuality;
                            const keys = Object.keys(rejectReason);
                            keys.forEach((item) => rejectKey[item] || (rejectKey[item] = item));
                            const auditItemSort = Object.values(rejectKey);
                            // 设置错误类型
                            qcListOptions.stateOptions = stateList;
                            // 设置素材类型
                            qcListOptions.auditTypeOptions = Object.keys(rejectKey).map((item) => ({
                                value: rejectKey[item],
                                label: rejectKey[item]
                            }));
                            // 设置错误理由
                            qcListOptions.auditItemOptions = keys.map((key) => ({
                                label: rejectKey[key],
                                options: rejectReason[key].map(({ reason }) => ({
                                    value: reason,
                                    label: reason
                                }))
                            })).sort((a, b) => {
                                return auditItemSort.indexOf(a.label) - auditItemSort.indexOf(b.label);
                            });
                        }
                    })
                })
                basicAuto();
            }
        }]
        function labelMark(tagTreeResult, tagList) {
            function reduceTime(list, subType) {
                const listObj = list.reduce((latest, current) => {
                    if (current.subType === subType && (!latest.updateTime || new Date(current.updateTime) > new Date(latest.updateTime))) {
                        return current;
                    } else {
                        return latest;
                    }
                }, {});
                const objData = listObj.value && JSON.parse(listObj.value) || {};
                !objData.qualityTagList && (objData.qualityTagList = []);
                !objData.classifyTagList && (objData.classifyTagList = []);
                return objData;
            }
            qcListOptions = {
                // 设置错误类型
                stateOptions: stateList,
                // 设置素材类型
                auditTypeOptions: [],
                // 设置错误理由
                auditItemOptions: []
            };

            if (auditList) {
                const labelObj = {};
                const qcLabelList = reduceTime(auditList, "qcLabel");
                const labelList = reduceTime(auditList, "label");
                labelList[tagTreeResult].children.forEach(({ name, children }) => {
                    qcListOptions.auditTypeOptions.push({
                        label: name,
                        value: name
                    });
                    const auditItemOptions = {
                        label: name,
                        options: []
                    };
                    children.forEach(({ contentTagBdsResultList }) => {
                        contentTagBdsResultList.forEach((item) => {
                            auditItemOptions.options.push({
                                label: item.name,
                                value: item.name
                            })
                            labelObj[item.id] = name;
                        })
                    })
                    auditItemOptions.options.length && qcListOptions.auditItemOptions.push(auditItemOptions);
                });
                const [labelListSpace, qcLabelListSpace] = [
                    labelList[tagList].filter((itemA) => !qcLabelList[tagList].some((itemB) => itemB.id === itemA.id)),
                    qcLabelList[tagList].filter((itemA) => !labelList[tagList].some((itemB) => itemB.id === itemA.id)),
                ];
                labelAuto(labelObj, labelListSpace, qcLabelListSpace);
            }
        }
        function labelAuto(labelObj, label, qcLabel) {
            if (innerQcInfo.qcUser || innerQcInfo.state) {
                return false;
            }
            label.forEach((item) => pushData("质检错", item));
            qcLabel.forEach((item) => pushData("审核错", item));
            function pushData(state, item) {
                qcInfo.push({
                    state: state,
                    auditType: labelObj[item.id] || "",
                    auditItem: item.tagName || "",
                });
            }
        }
        function liveAuto(params) {
            if (innerQcInfo.qcUser || innerQcInfo.state) {
                return false;
            }
            const { qcResult, manualAuditResult } = liveWatchTime.qcAndManualAuditDetail;
            markAuto(qcResult, "审核错");
            markAuto(manualAuditResult, "质检错");
            function markAuto(resultArr, state) {
                resultArr.forEach(({ punishType, relatedInfo = {} }) => {
                    if (punishType !== "无需操作") {
                        const reasonJosn = JSON.parse(relatedInfo.reason) || [];
                        reasonJosn.forEach(({ reason }) => {
                            qcInfo.push({
                                state: state,
                                auditType: params[punishType] || "",
                                auditItem: reason || "",
                            });
                        })
                    }
                })
            }
        }
        function basicAuto() {
            if (innerQcInfo.qcUser || innerQcInfo.state) {
                return false;
            }
            auditInfoList && auditInfoList.forEach(({ manualAuditList, auditType, rejectList, rejectDesc }) => {
                for (const list of (manualAuditList || [])) {
                    for (const item of list.rejectList) {
                        addQcInfo({
                            state: auditType,
                            auditType: rejectKey[list.elementType] || "",
                            auditItem: item.reason,
                            reason: list.rejectDesc || ""
                        })
                    }
                }
                for (const item of (rejectList || [])) {
                    addQcInfo({
                        state: auditType,
                        auditType: "整体",
                        auditItem: item.reason,
                        reason: rejectDesc || ""
                    })
                }
            })
            function addQcInfo(params) {
                if (params.state === 0) {
                    params.state = "质检错";
                } else {
                    params.state = "审核错";
                }
                qcInfo.push(params);
            }
            // 无驳回 获取低质差异
            if (qcInfo.length === 0) {
                if (qualityManualState !== qcQualityManualState) {
                    const quality = {
                        3: "低质",
                        2: "优质"
                    }
                    const qualityArr = [{
                        state: "质检错",
                        index: qualityManualState
                    }, {
                        state: "审核错",
                        index: qcQualityManualState
                    }]
                    const list = qualityArr.reduce((a, b) => (a.index > b.index ? a : b))
                    qcInfo.push({
                        state: list.state,
                        auditType: "质量",
                        auditItem: quality[list.index] || "",
                    });
                }
            }
        }
        const { bizLineId, contentTypeId, contentSourceId } = fourKey || urlParams;
        for (const list of runAutoConfig) {
            if (isCover(list.bizLineId, bizLineId)) {
                if (isCover(list.contentTypeId, contentTypeId)) {
                    if (isCover(list.contentSourceId, contentSourceId)) {
                        await list.function(list);
                        break;
                    }
                }
            }
        }
        function isCover(openId, nowId) {
            if (!openId || openId === nowId * 1 || (Array.isArray(openId) && openId.includes(nowId * 1))) {
                return true;
            }
        }

        const overStateCallback = [];

        function observeInput(elem) {
            const inputArr = elem.querySelectorAll("input");
            inputArr.forEach((input) => {
                if (input) {
                    const setTabindex = ThrottleOver(() => {
                        if (input.getAttribute("tabindex") !== "-1") {
                            input.setAttribute("tabindex", "-1");
                        }
                    }, 5);
                    ObserverDOM(setTabindex).observe(input, { attributes: true, attributeFilter: ["tabindex"] });
                    setTabindex();
                }
            });
        }
        await AddDOM({
            addNode: element,
            addData: [{
                name: "div",
                style: "display: flex;flex-direction: column;",
                innerHTML: `
                    <el-descriptions column="2" size="small" border>
                        <el-descriptions-item label="质检人" :label-style="{ 'width': '100px' }">{{qcUserInfo.qcUser}}</el-descriptions-item>
                        <el-descriptions-item label="时间">{{qcUserInfo.qcTime}}</el-descriptions-item>
                        <el-descriptions-item label="内检人">{{qcUserInfo.innerQcUser}}</el-descriptions-item>
                        <el-descriptions-item label="时间">{{qcUserInfo.innerQcTime}}</el-descriptions-item>
                        <template v-if="qcUserInfo.qcManageReviewPerson">
                            <el-descriptions-item label="质检管理复审">{{qcUserInfo.qcManageReviewPerson}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.qcManageReviewTime}}</el-descriptions-item>
                        </template>
                        <template v-if="qcUserInfo.auditManageReviewPerson">
                            <el-descriptions-item label="审核管理复审">{{qcUserInfo.auditManageReviewPerson}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.auditManageReviewTime}}</el-descriptions-item>
                        </template>
                        <template v-if="qcUserInfo.arbitrationPerson">
                            <el-descriptions-item label="运营仲裁人">{{qcUserInfo.arbitrationPerson}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.arbitrationTime}}</el-descriptions-item>
                        </template>
                        <template v-if="qcUserInfo.appealUser && qcUserInfo.appealTime">
                            <el-descriptions-item label="申诉处理人">{{qcUserInfo.appealUser}}</el-descriptions-item>
                            <el-descriptions-item label="时间">{{qcUserInfo.appealTime}}</el-descriptions-item>
                        </template>
                    </el-descriptions>
                    <el-divider>内检明细</el-divider>
                `,
                function(div) {
                    new Vue({
                        el: div,
                        data() {
                            return {
                                qcUserInfo: {
                                    qcUser: getPinUser(qcDataInfo.qcPerson),
                                    qcTime: qcDataInfo.qcTime,
                                    innerQcUser: getPinUser(innerQcInfo.qcUser) || "无",
                                    innerQcTime: innerQcInfo.time || "无",
                                    appealUser: getPinUser(innerQcInfo.appealUser),
                                    appealTime: innerQcInfo.appealTime,
                                    qcManageReviewPerson: getPinUser(qcDataInfo.qcManageReviewPerson),
                                    qcManageReviewTime: qcDataInfo.qcManageReviewTime,
                                    auditManageReviewPerson: getPinUser(qcDataInfo.auditManageReviewPerson),
                                    auditManageReviewTime: qcDataInfo.auditManageReviewTime,
                                    arbitrationPerson: getPinUser(qcDataInfo.arbitrationPerson),
                                    arbitrationTime: qcDataInfo.arbitrationTime,
                                }
                            }
                        }
                    })
                }
            }, {
                name: "div",
                className: "inner-qc-list",
            }, {
                name: "div",
                style: "margin-top: 5px;gap: 15px;display: flex;flex-direction: column;",
                innerHTML: `
                    <div style="text-align: center;">
                        <el-button :tabindex="-1" type="success" icon="el-icon-circle-plus-outline" size="mini" plain round @click="addData"></el-button>
                    </div>
                    <div style="gap: 20px;display: flex;align-items: center;justify-content: center;">
                        <div style="display: flex;align-items: center;gap: 5px;">
                            <span>整体:</span>
                            <div class="inner-qc-lockdata"></div>
                            <el-select v-if="ifManage" v-model="isManage" ref="isManage" style="width: 115px;" filterable placeholder="请选择" size="small" @change="manageStateChange">
                                <el-option v-for="item in isManageOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="value" style="width: 115px;" filterable placeholder="请选择" size="small" class="state" @change="stateChange">
                                <el-option v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button style="height: 32px;" type="primary" size="small" @click="serverData" :loading="loading">保 存</el-button>
                    </div>
                `,
                function: (div) => {
                    const isManage = typeof innerQcInfo.isManage === "number" ? innerQcInfo.isManage : null
                    new Vue({
                        el: div,
                        data() {
                            const radio = {};
                            stateList.forEach((item, index) => radio["radio" + index] = item.label)
                            return {
                                value: "",
                                ifManage: isManage !== null,
                                isManage: isManage,
                                options: qcListOptions.stateOptions,
                                isManageOptions: [{
                                    label: "管理已确认",
                                    value: 1,
                                }, {
                                    label: "管理未确认",
                                    value: 0,
                                }],
                                loading: false
                            }
                        },
                        mounted() {
                            AddDOM({
                                addNode: this.$el.querySelector(".inner-qc-lockdata"),
                                addData: [SwitchBox({
                                    "msg-tip": "锁定数据，不会被自动修改",
                                    checked: !!innerQcInfo.isLockdata,
                                    function: (event, loading) => {
                                        event.addEventListener("change", () => loading(() => postLockData(!event.checked).then((isLockdata) => {
                                            if (typeof isLockdata === "boolean") {
                                                event.checked = isLockdata;
                                                innerQcInfo.isLockdata = isLockdata;
                                            }
                                        })))
                                    }
                                })]
                            })
                            overStateCallback.push((params) => {
                                if (this.value !== params) {
                                    this.value = params;
                                    this.stateChange(params);
                                }
                            })
                            this.stateChange(innerQcInfo.state);
                            if (isManage !== null) {
                                this.manageStateChange(isManage);
                            }
                            observeInput(this.$el);
                        },
                        methods: {
                            addData: newQcInfo,
                            stateChange(params) {
                                const rootElement = this.$el;
                                const stateEle = rootElement.querySelector(".state input");
                                const obj = qcListOptions.stateOptions.find((item) => item.label === params) || {};
                                stateEle.style = `background: ${obj.color};border-color: ${obj.color};color: #ffffff;transition: none;`;
                                innerQcInfo.state = params;
                                overStateCallback.forEach((callback) => callback(params));
                            },
                            manageStateChange(params) {
                                innerQcInfo.isManage = params;
                                const colorObj = {
                                    0: "#EF5350",
                                    1: "#66BB6A",
                                }
                                const stateEle = this.$refs["isManage"] ? this.$refs["isManage"].$el.querySelector("input") : {};
                                const color = colorObj[params];
                                stateEle.style = `background: ${color};border-color: ${color};color: ${color && "#ffffff"};transition: none;`;
                            },
                            async serverData() {
                                if (!this.loading) {
                                    if (innerQcInfo.state) {
                                        this.loading = true;
                                        await postQcData(innerQcInfo);
                                        this.loading = false;
                                    } else {
                                        MessageTip("❌", "请选择整体判罚", 3, 2);
                                    }
                                }
                            }
                        }
                    })
                }
            }, {
                name: "div",
                innerHTML: "<el-divider v-if='appeals.length > 0'>申诉</el-divider>",
                function(div) {
                    new Vue({
                        el: div,
                        data() {
                            return {
                                appeals
                            }
                        }
                    });
                }
            }, {
                name: "div",
                class: "inner-appeal-list"
            }]
        })

        appeals.forEach((list) => addAppealList(element.querySelector(".inner-appeal-list"), list));
        if (qcInfo.length) {
            qcInfo.forEach((list) => addQcList(element.querySelector(".inner-qc-list"), list, qcListOptions));
        } else {
            newQcInfo();
        }

        function newQcInfo() {
            const nweObj = {};
            qcInfo.push(nweObj);
            addQcList(element.querySelector(".inner-qc-list"), nweObj, qcListOptions);
        }

        function removeQcInfo(params) {
            const index = qcInfo.indexOf(params);
            if (index > -1) {
                qcInfo.splice(index, 1);
            }
        }

        function testOverState() {
            const countMap = {};
            let maxCount = 0;
            let maxState = "";
            for (const list of qcInfo) {
                const state = list.state;
                if (!state) {
                    continue;
                }
                if (countMap[state]) {
                    countMap[state]++;
                } else {
                    countMap[state] = 1;
                }
                if (countMap[state] > maxCount) {
                    maxCount = countMap[state];
                    maxState = state;
                }
            }
            overStateCallback.forEach((callback) => callback(maxState));
        }

        function addAppealList(element, appeal) {
            const appealStateList = ["申诉通过", "申诉驳回"].map((key) => ({
                label: key,
                value: key,
                color: appealStateColor[key],
            }));
            AddDOM({
                addNode: element,
                addData: [{
                    name: "div",
                    innerHTML: `
                        <el-descriptions column="2" size="small" border>
                            <el-descriptions-item label="状态" :label-style="{'white-space': 'nowrap'}" :content-style="{'white-space': 'nowrap'}">
                                <el-tag effect="dark" size="mini" :color="color" style="margin-right: 5px;">{{appealState}}</el-tag>
                                <el-tag v-if="appealStateType" effect="dark" size="mini" :color="typeColor">{{appealStateType}}</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="时间" :label-style="{'white-space': 'nowrap'}" :content-style="{
                                'max-width': '125px',
                                'overflow': 'hidden',
                                'white-space': 'nowrap',
                                'text-overflow': 'ellipsis'
                            }">{{time}}</el-descriptions-item>
                            <el-descriptions-item label="申诉" span="2" v-if="info">{{info}}</el-descriptions-item>

                            <el-descriptions-item label="结论" span="2" v-if="appealState === '提起申诉'">
                                <el-input v-model="backInfo" size="small" placeholder="请输入内容" @change="innerInputChange"></el-input>
                            </el-descriptions-item>
                            <el-descriptions-item label="结论" span="2" v-if="appealState !== '提起申诉' && backInfo">{{backInfo}}</el-descriptions-item>

                            <el-descriptions-item label="操作" span="2" v-if="appealState === '提起申诉'">
                                <div style="gap: 10px;display: flex;">
                                    <el-select v-model="value" style="width: 95px;" filterable placeholder="请选择" size="small" class="state" @change="innerChange">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="value1" style="width: 95px;" filterable placeholder="请选择" size="small" class="state1" @change="stateChange">
                                        <el-option v-for="item in options1"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-button style="height: 32px;" type="primary" size="small" @click="serverData" :loading="loading">保 存</el-button>
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                    `,
                    function(div) {
                        new Vue({
                            el: div,
                            data() {
                                return {
                                    color: appealStateColor[appeal.state],
                                    appealState: appeal.state,
                                    typeColor: stateColorList[appeal.stateType] || appealStateColor[appeal.stateType],
                                    appealStateType: appeal.stateType,
                                    time: appeal.time,
                                    info: appeal.info,
                                    backInfo: appeal.backInfo,
                                    value: "",
                                    options: appealStateList,
                                    value1: "",
                                    options1: qcListOptions.stateOptions,
                                    loading: false
                                }
                            },
                            mounted() {
                                overStateCallback.push((params) => {
                                    if (this.value1 !== params) {
                                        this.value1 = params;
                                        this.stateChange(params);
                                    }
                                });
                                this.stateChange(innerQcInfo.state);
                                if (appeal.state === "提起申诉") {
                                    this.value = appealStateList[0].label;
                                    this.innerChange(appealStateList[0].label);
                                }
                            },
                            methods: {
                                innerChange(params) {
                                    const rootElement = this.$el;
                                    const stateEle = rootElement.querySelector(".state input") || {};
                                    const color = appealStateColor[params];
                                    stateEle.style = `background: ${color};border-color: ${color};color: #ffffff;transition: none;`;
                                    appeal.state = params;
                                    innerQcInfo.appealState = params;
                                },
                                stateChange(params) {
                                    const rootElement = this.$el;
                                    const stateEle = rootElement.querySelector(".state1 input") || {};
                                    const obj = qcListOptions.stateOptions.find((item) => item.label === params) || {};
                                    stateEle.style = `background: ${obj.color};border-color: ${obj.color};color: #ffffff;transition: none;`;
                                    innerQcInfo.state = params;
                                    overStateCallback.forEach((callback) => callback(params));
                                },
                                innerInputChange(params) {
                                    appeal.backInfo = params;
                                },
                                async serverData() {
                                    if (!this.loading) {
                                        if (appeal.state !== "提起申诉" && appeal.state) {
                                            this.loading = true;
                                            await postQcData(innerQcInfo);
                                            this.loading = false;
                                        } else {
                                            MessageTip("❌", "请选择申诉状态", 3, 2);
                                        }
                                    }
                                }
                            }
                        })
                    }
                }]
            })
        }

        function addQcList(element, qcInfos, { stateOptions, auditTypeOptions, auditItemOptions }) {
            const { state, auditType, auditItem, reason } = qcInfos;
            const qcList = `
                <div class="select">
                    <el-select v-model="value" filterable placeholder="请选择" size="small" style="width: 95px;min-width: 95px;" class="state" @change="stateChange">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="value1" filterable placeholder="请选择" size="small" style="width: 88px;min-width: 88px;" @change="auditTypeChange">
                        <el-option
                            v-for="item in options1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="value2" filterable placeholder="请选择" size="small" style="flex: 1 1 auto;" @change="auditItemChange">
                        <el-option-group
                            v-for="group in options2"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </div>
                <div style="display: flex;align-items: center;gap: 5px;">
                    <el-input v-model="input" size="small" placeholder="请输入内容" @change="reasonChange">
                        <template slot="prepend">备注</template>
                    </el-input>
                    <el-button :tabindex="-1" type="danger" size="small" icon="el-icon-delete" plain round @click="deleteData"></el-button>
                </div>
            `;
            const qcListCallback = (div) => {
                const vm = new Vue({
                    el: div,
                    data() {
                        return {
                            input: reason,
                            value: state,
                            options: stateOptions,
                            value1: auditType,
                            options1: auditTypeOptions,
                            value2: auditItem,
                            options2: auditItemOptions,
                        }
                    },
                    mounted() {
                        this.stateChange(state, innerQcInfo.qcUser);
                        observeInput(this.$el);
                    },
                    methods: {
                        stateChange(params, isAuto) {
                            const rootElement = this.$el;
                            const stateEle = rootElement.querySelector(".state input");
                            const obj = stateOptions.find((item) => item.label === params) || {};
                            stateEle.style = `background: ${obj.color};border-color: ${obj.color};color: #ffffff;transition: none;`;
                            qcInfos.state = params;
                            !isAuto && testOverState();
                        },
                        auditTypeChange(params) {
                            qcInfos.auditType = params;
                        },
                        auditItemChange(params) {
                            qcInfos.auditItem = params;
                        },
                        reasonChange(params) {
                            qcInfos.reason = params;
                        },
                        deleteData() {
                            removeQcInfo(qcInfos);
                            vm.$destroy();
                            this.$el.remove();
                        }
                    }
                })
            }
            AddDOM({
                addNode: element,
                addData: [{
                    name: "div",
                    innerHTML: qcList,
                    function: qcListCallback
                }]
            })
        }
    }
    async function postLockData(params) {
        return GM_XHR({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/set/lockdata`,
            data: {
                token: getToken(),
                taskId: urlParams.taskId || "",
                liveId: urlParams.liveId || "",
                qcTaskId: urlParams.qcTaskId || "",
                contentId: urlParams.contentId || "",
                isLockdata: params
            }
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            return data.data.innerQcInfo.isLockdata;
        }).catch((error) => {
            console.error(error);
            MessageTip("❌", "数据修改失败", 3, 2);
        })
    }
    async function getQcData() {
        return GM_XHR({
            method: "GET",
            url: UpdateUrlParam(`${unsafeWindow.ymfApiOrigin}/api/jd/get/data`, {
                taskId: urlParams.taskId || "",
                liveId: urlParams.liveId || "",
                qcTaskId: urlParams.qcTaskId || "",
                contentId: urlParams.contentId || "",
                token: getToken(),
            }),
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data;
            } else {
                MessageTip("❌", data.msg, 3, 2);
            }
            return data;
        }).catch((error) => {
            console.error(error);
            return {
                code: 404
            }
        })
    }
    async function postQcData(params) {
        return GM_XHR({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/jd/get/data`,
            data: {
                token: getToken(),
                query: {
                    taskId: urlParams.taskId || "",
                    liveId: urlParams.liveId || "",
                    qcTaskId: urlParams.qcTaskId || "",
                    contentId: urlParams.contentId || "",
                },
                innerQcInfo: params
            }
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                if (Number(dataContent.showState) !== 30) {
                    window.close();
                }
            } else {
                MessageTip("❌", data.msg, 3, 2);
            }
            return data;
        }).catch((error) => {
            console.error(error);
            MessageTip("❌", "数据保存失败", 3, 2);
            return {
                code: 404
            }
        })
    }
}

function CSS_workPage() {
    const { whiteDropIco } = Plug_ICO();
    /* 种草秀打标-人格化审核 */
    GM_addStyle(`
        #iframe-personify #title {
            gap: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 0 2px 0;
        }
        #iframe-personify input {
            font-size: 14px;
            height: 25px;
            width: 50px;
            border: 1px solid #ccc;
            border-radius: 5px;
            outline: none;
        }
        #iframe-personify input:hover {
            border: 1px solid #40a9ff;
        }
        #iframe-personify #body {
            gap: 5px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
        }
        #iframe-personify #body div {
            width: 40px;
            height: 40px;
            min-width: 40px;
            padding: 8px;
            fill: #bbbbbb;
            cursor: pointer;
            border-radius: 10px;
            transition: 0.25s;
        }
        #iframe-personify #body div:nth-child(3) {
            transform: rotate(180deg);
        }
        #iframe-personify #body div:hover {
            background: #efefef;
            fill: #999999;
        }
        #iframe-personify #body iframe {
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 8px;
        }
    `)
    /* 查重区域样式 */
    GM_addStyle(`
        #repeat-list:hover {
            cursor: pointer;
            background: #c8e6ff;
            border-radius: 5px;
        }
        #repeat-pin-info {
            position: absolute;
            color: #ffffff;
            z-index: 2;
            padding: 8px;
            line-height: 1.4;
            border-radius: 5px;
            pointer-events: none;
            background-color: rgba(0,0,0,0.75);
        }
        #repeat-light {
            color: #1890ff;
            cursor: pointer;
        }
        #repeat-light:hover {
            color: #ffffff;
            background: #ff4444;
        }
        #video-radio {
            height: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: 0.25s;
            overflow: hidden;
            cursor: auto;
        }
        #video-radio video {
            height: auto;
            width: 100%;
            border-radius: 6px;
        }
        #video-radio #video-msg {
            text-align: center;
        }
        #video-radio #video-msg button {
            margin-top: 10px;
        }
        #video-loading {
            border: 10px solid #f3f3f3;
            border-radius: 50%;
            border-top: 10px solid #389fff;
            width: 70px;
            height: 70px;
            min-width: 70px;
            min-height: 70px;
            animation: loading 1s linear infinite;
        }
        @keyframes loading{
            0%{
                transform: rotate(0deg);
            }
            100%{
                transform: rotate(360deg);
            }
        }
        /*用户主页*/
        #user-iframe,
        #user-home-iframe {
            line-height: 1;
            height: 0;
            width: 100%;
            transition: 0.25s;
            overflow: hidden;
            background: #ffffff;
            position: relative;
            border-radius: 6px;
        }
        #user-iframe iframe,
        #user-home-iframe iframe {
            width: 100%;
            height: 100%;
        }
        #user-iframe #open,
        #user-home-iframe #open {
            position: absolute;
            cursor: pointer;
            top: 5px;
            left: 5px;
            width: 40px;
            height: 30px;
            padding: 7px;
            transition: 0.25s;
            fill: #bbbbbb;
            border-radius: 6px;
            background: rgba(239,239,239,0.6);
            display: flex;
            justify-content: center;
        }
        #user-iframe #open,
        #user-home-iframe #open {
            left: auto;
            right: 5px;
        }
        #user-iframe #open:hover,
        #user-home-iframe #open:hover {
            background: #efefef;
            fill: #999999;
        }
    `)
    // 倍速切换
    GM_addStyle(`
        #video-rate {
            transition: 0.2s ease-in-out;
            position: absolute;
            bottom: 0;
            width: 50px;
            right: -50px;
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-family: -apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        }
        #video-rate>span {
            width: 100%;
            cursor: pointer;
            background: rgba(0,0,0,0.2);
            margin: 6px 0 0 3px;
            border-radius: 5px;
            transition: 0.2s ease-in-out;
            text-align: center;
            height: 32px;
            min-height: 32px;
            line-height: 32px;
        }
        #video-rate>span:hover {
            background: rgba(0,0,0,0.4);
        }
        #video-rate .active {
            background: rgba(0,0,0,0.6) !important;
        }
        .video-react-fullscreen #video-rate {
            bottom: 45px;
            right: 20px;
            width: 70px;
        }
        .video-react-user-inactive.video-react-fullscreen #video-rate {
            right: -100px;
        }
        .video-react-fullscreen #video-rate>span {
            height: 38px;
            min-height: 38px;
            line-height: 38px;
            margin: 10px 3px 0;
            background: rgba(43,51,63,0.5);
        }
        .video-react-fullscreen #video-rate>span:hover {
            color: rgba(43,51,63,0.8);
            background: rgba(255,255,255,0.4);
        }
        .video-react-fullscreen #video-rate .active {
            color: rgba(43,51,63,0.8);
            background: rgba(255,255,255,0.7) !important;
        }
        /*新质检页面*/
        .newDetailWrapper #video-rate {
            width: 45px;
            right: -45px;
        }
        .newDetailWrapper .video-react-fullscreen #video-rate {
            bottom: 45px;
            right: 20px;
            width: 70px;
        }
        .newDetailWrapper .video-react-user-inactive.video-react-fullscreen #video-rate {
            right: -100px;
        }
    `)
    // 标题置顶
    GM_addStyle(`
        #top-title {
            z-index: 20;
            width: 100%;
            top: -1000px;
            font-size: 18px;
            font-weight: bold;
            position: absolute;
            transition: top linear 0.3s;
            pointer-events: none;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: center;
            gap: 5px;
        }
        #top-title>span {
            display: none;
            background: #ffffff;
            padding: 2px 10px;
            border-radius: 5px;
            pointer-events: auto;
            transition: all linear 0.2s;
            box-shadow: 0 0 5px 1px rgba(0,0,0,0.2);
        }
        #top-title>img {
            width: 31px;
            height: 31px;
            cursor: url('${whiteDropIco}') 5 5, auto;
            border-radius: 5px;
            pointer-events: auto;
            transition: all linear 0.2s;
            box-shadow: 0 0 5px 1px rgba(0,0,0,0.2);
        }
        #top-title>img:hover {
            width: 70px;
            height: 70px;
        }
        #top-title #result {
            color: red;
        }
        #top-title #super {
            color: #ffffff;
            background: #ff4444;
        }
        #top-title #class,
        #top-title #category {
            box-shadow: inset 0 0 0 2px rgba(0,0,0,0.6);
        }
        #top-title>span:hover {
            font-size: 20px;
        }
    `)
    // SKU预览
    GM_addStyle(`
        .sku-big-img {
            position: absolute;
            top: -30px;
            width: 280px;
            height: 280px;
            z-index: 5;
            float: left;
            overflow: hidden;
            border-radius: 6px;
        }
        .sku-big-img img {
            width: 600px;
            max-width: 600px;
            min-width: 600px;
        }
        .sku-mask {
            background-color: rgba(255,77,79,0.3);
            position: absolute;
            left: 50px;
            top: 50px;
            pointer-events: none;
            border-radius: 6px;
        }
    `)
    // 作者信息
    GM_addStyle(`
        /*文字高亮*/
        .gm-text-light {
            color: #ffffff;
            border-radius: 4px;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            padding: 0px 4px;
            display: inline-block;
        }
    `)
    // tip信息
    GM_addStyle(`
        .jd-tip-affix {
            position: sticky;
            z-index: 20;
            bottom: 0;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            pointer-events: none;
            font-size: 14px;
        }
        .jd-tip-affix button {
            pointer-events: auto;
            height: 26px;
            line-height: 26px;
            display: none;
            margin-bottom: 5px;
            padding: 0 12px;
            border-radius: 5px 5px 30px 30px;
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.5);
        }
    `)
}
function CSS_workBeautify() {
    // 美化页面样式
    GM_addStyle(`
        * {
            scroll-behavior: smooth !important;
        }
        /*头部*/
        .header,
        .homeContent .breadCrumbContent {
            height: 0 !important;
            z-index: 1 !important;
            border-bottom: none !important;
        }
        .homeContent .content {
            background: none !important;
        }
        .header .header-icon {
            display: none;
        }
        .header .header-antcap-menu {
            opacity: 0 !important;
            margin-top: 5px !important;
            border-radius: 6px !important;
            box-shadow: 0 1px 6px rgb(0 0 0 / 10%) !important;
        }
        .header .header-antcap-menu:hover {
            opacity: 1 !important;
        }
        .homeContent .content.detailContent {
            margin: 0 auto !important;
        }
        /*右侧区域*/
        .antcap-col-6 {
            width: 20% !important;
        }
        .antcap-col-18 {
            width: 80% !important;
        }
        /*主区域*/
        .flex-op-left,
        img {
            border-radius: 6px !important;
        }
        .detailWrapper .content-top img,
        .detailWrapper .audit-list-content-picture img {
            max-width: 500px !important;
        }
        .flex-op-right,
        .relevant_iframe,
        .detailWrapper .content-down .antcap-list-item,
        .detailWrapper .content-down .audit-list-content-picture.border,
        .detailWrapper .cover-img {
            border-radius: 8px !important;
        }
        .ant-card,
        .ant-card-head,
        .antcap-card,
        .antcap-card-head,
        .detail-content-main {
            border-radius: 10px !important;
        }
        .detailWrapper .content-down {
            margin-top: 15px !important;
        }
        .detail-operation {
            border-radius: 8px 8px 0 0 !important;
            margin-right: 5px !important;
        }
        /*商卡*/
        .audit-list-content-sku h4 span {
            word-break: break-all;
        }
        /*新质检页面高度修复*/
        .new-audit-detail-page .newDetailWrapper {
            height: calc(100vh - 40px);
        }
        /*解决部分浏览器不换行的场景*/
        .detail-opinion .antcap-radio-wrapper {
            white-space: wrap;
        }

        /*滚动条样式*/
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: rgba(160,169,173,0.45);
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(160,169,173,0.8);
        }
    `)
}

// 视频提取
async function Plug_VideoExtract() {
    const { SwitchRead, AddDOM, AwaitSelectorShow } = Plug_fnClass();
    const PickVideo = SwitchRead("Pick-Video");
    if (!!PickVideo.state) {
        const video = await AwaitSelectorShow("video");
        if (!video) {
            return false;
        }
        GM_addStyle(`
                body {
                    overflow: hidden !important;
                }
                #videoDiv {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2000000;
                    background: #333333;
                }
            `)
        AddDOM({
            addNode: document.body,
            addData: [{
                name: "div",
                id: "videoDiv",
                add: [{
                    name: "video",
                    src: video.src,
                    controls: "controls",
                    autoplay: "autoplay",
                    style: "height: 100%;width: 100%;"
                }],
            }]
        })
    }
}

// 数据榜
async function Plug_DataRanking(host, href) {
    const { GM_XHR, CopyText, MessageTip, SwitchRead, ObserverDOM, AwaitSelectorShow } = Plug_fnClass();
    const { redCopyIco } = Plug_ICO();
    const RankUse = SwitchRead("Rank-Use");
    if (!RankUse.state) {
        return false;
    }
    await AwaitSelectorShow("body");
    if (window.top === window && host === "pro.m.jd.com") {
        document.body.innerHTML = `<iframe class="gm-iframe" src="${href}" frameborder="0"></iframe>`;
        GM_addStyle(`
            body {
                display: flex;
                justify-content: center;
            }
            .gm-iframe {
                width: 700px;
                height: 100vh;
            }
            #imk2TipsWraper {
                display: none !important;
            }
        `)
        return false;
    }
    if (host === "pro.m.jd.com") {
        const wrapper = await AwaitSelectorShow(".swiper-wrapper");
        wrapper.onclick = (event) => {
            event.stopPropagation();
            openSku(event.target);
        }
        function openSku(target, copy = false) {
            if (target.className === "swiper-wrapper") {
                return false;
            }
            if (target.className === "sku-goto-wrap") {
                openSku(target.parentNode, true);
                return false;
            }
            const skuIdText = target.id.match(/-([0-9]+)-/g);
            if (!!skuIdText) {
                const skuId = skuIdText[0].replace(/-/g, "");
                if (copy) {
                    CopyText(skuId).then(() => {
                        MessageTip("✔️", "已复制到剪贴板", 3);
                    }).catch(() => {
                        MessageTip("❌", "复制失败", 3);
                    })
                } else {
                    window.open(`https://item.jd.com/${skuId}.html`);
                }
            } else {
                openSku(target.parentNode, copy);
            }
        }
        GM_addStyle(`
            .hotrank-head:hover,
            .hotrank-head:hover .card-info-wrap {
                background: #e0e0e0;
                cursor: pointer;
            }
            .hotrank-head .sku-goto-wrap {
                height: 5.3333vw !important;
                background-image: url('${redCopyIco}') !important;
                background-color: #fde8e8;
                border-radius: 50%;
                transition: 0.2s;
                cursor: pointer;
            }
            .hotrank-head .sku-goto-wrap:hover {
                background-color: #ffcdd2;
            }
            .hotrank-head .sku-content-info-wrap div {
                font-size: 16px !important;
                white-space: inherit !important;
                height: auto;
            }
            .hotrank-head .price-tag-view,
            .hotrank-head .price-benefits-view {
                align-items: center !important;
            }
            .hotrank-head .sale-Info-wrap>div {
                margin-top: 2px !important;
            }
            .hotrank-head .sale-Info-wrap div {
                font-size: 14px !important;
            }
            .hotrank-head .sale-Info-wrap .saleInfo-text {
                display: flex;
                align-items: center;
            }
            .backtop {
                bottom: 20px !important;
            }
        `)
    }
    if (host === "h5.m.jd.com") {
        const config = {
            sku: []
        };
        ObserverDOM((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((element) => {
                    if (element.src && element.src.includes("api.m.jd.com/client.action")) {
                        GM_XHR({
                            method: "GET",
                            url: element.src,
                            header: {
                                Referer: "https://h5.m.jd.com"
                            }
                        }, (xhr) => {
                            const responseText = xhr.responseText;
                            const regex = /{(.|\n)*}/g;
                            const match = responseText.match(regex);
                            if (!!match) {
                                const content = JSON.parse(match[0]);
                                if (content.result) {
                                    if (content.result.jdRankArticle) {
                                        const skuArr = content.result.jdRankArticle.products.map((item) => ({
                                            imgPath: item.imgPath,
                                            skuId: item.wareId
                                        }));
                                        config.sku.push(...skuArr || []);
                                    }
                                    if (content.result.products) {
                                        const skuArr = content.result.products.map((item) => ({
                                            imgPath: item.img,
                                            skuId: item.skuId
                                        }));
                                        config.sku.push(...skuArr || []);
                                    }
                                }
                            }
                        })
                    }
                })
            }
        }).observe(document.head, { childList: true, subtree: true, attributes: false });
        const scroll = await AwaitSelectorShow(".scroll-content-container");
        ObserverDOM((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((element) => {
                    const divArr = element.querySelectorAll("div[data-src]");
                    const imgArr = element.querySelectorAll("img[src][placeholder][source]");
                    isSkuCopy(divArr);
                    isSkuCopy(imgArr);
                })
            }
        }).observe(document.head, { childList: true, subtree: true, attributes: false });
        function isSkuCopy(domArr) {
            for (const item of domArr) {
                if (isCard(item)) {
                    item.src = redCopyIco;
                    item.id = "sku-copy";
                }
            }
            function isCard(target, index = 0) {
                const parent = target.parentNode;
                if (parent === document || (index === 0 && !isCopyId(target))) {
                    return false;
                }
                if (parent.hasAttribute("ptag")) {
                    return true;
                }
                return isCard(parent, index + 1);
            }
            function isCopyId(target) {
                if (target.getAttribute("source") && target.getAttribute("source").includes("bAzIjWhdmAAAAABJRU5ErkJggg")) {
                    return true;
                }
                if (target.getAttribute("data-src") && target.getAttribute("data-src").includes("544c523fa4e43852.png")) {
                    return true;
                }
                return false;
            }
        }
        scroll.addEventListener("mouseup", (event) => {
            const skuList = openSku(event.target);
            if (skuList) {
                event.stopPropagation();
                if (event.target.id === "sku-copy") {
                    CopyText(skuList.skuId).then(() => {
                        MessageTip("✔️", "已复制到剪贴板", 3);
                    }).catch(() => {
                        MessageTip("❌", "复制失败", 3);
                    })
                } else {
                    window.open(`https://item.jd.com/${skuList.skuId}.html`);
                }
            }
        })
        scroll.addEventListener("mousedown", (event) => {
            const skuList = openSku(event.target);
            if (skuList) {
                event.stopPropagation();
            }
        })
        function openSku(target, copy = false) {
            if (target === document) {
                return false;
            }
            const isScroll = target.parentNode.className.includes("scroll-content-container");
            if (!isScroll) {
                return openSku(target.parentNode, copy);
            }
            const dataSrc = target.querySelectorAll(`[data-src]:not([data-src=""])`);
            for (const item of dataSrc) {
                const src = item.dataset || {};
                if (!!src.src && src.src.includes("m.360buyimg.com")) {
                    const imgName = src.src.replace(/.*jfs/, "");
                    const skuList = config.sku.find(obj => !!obj.imgPath && obj.imgPath.includes(imgName));
                    return skuList;
                }
            }
            return false;
        }
        GM_addStyle(`
            #sku-copy {
                background-color: #fde8e8;
                border-radius: 50%;
                transition: 0.2s;
            }
            #sku-copy:hover {
                background-color: #ffcdd2;
            }
            div#sku-copy {
                background-image: url('${redCopyIco}') !important;
            }
            div[ptag="138894.1.1"],
            div[ptag="17005.104.1"]>div {
                cursor: pointer;
            }
            div[ptag="138894.1.1"]:hover,
            div[ptag="17005.104.1"]>div:hover {
                background: #e0e0e0 !important;
            }
        `)
    }
}

// 原创审核
async function Plug_TagTypeManager() {
    const { AddDOM, HTTP_XHR, AwaitSelectorShow, WaylayHTTP, ExportToExcel, FormatTime, SwitchRead, GetQueryString, MessageTip, QueueTaskRunner } = Plug_fnClass();
    const Manager = SwitchRead("Tag-Manager-Down");
    if (!Manager.state) {
        return false;
    }
    const queryData = {}
    WaylayHTTP([{
        method: "POST",
        url: "tagApprovalForm/list",
        callback: (xhr) => {
            const { result } = xhr.data.responseText && JSON.parse(xhr.data.responseText) || {};
            const isPush = GetQueryString("isPush", xhr.data.responseURL);
            if (result && xhr.data.status === 200 && !isPush) {
                const load = JSON.parse(xhr.sendBody);
                queryData.query = load;
                queryData.pages = result.pages;
                queryData.total = result.total;
            }
        }
    }])

    const form = await AwaitSelectorShow(".search-container form");
    AddDOM({
        addNode: form,
        addData: [{
            name: "div",
            className: "el-button el-button--primary",
            innerHTML: "下载",
            click: () => {
                queryExcel(queryData);
            }
        }]
    })

    let isRun = false;
    function queryExcel({ query, pages, total }) {
        if (isRun) {
            MessageTip("❌", "下载中，请稍后", 3);
            return false
        }
        if (pages === undefined) {
            MessageTip("❌", "请先查询", 3);
            return false
        }
        if (!total) {
            MessageTip("❌", "没有数据", 3);
            return false
        }
        isRun = true;
        const userData = [];
        const excelData = [];
        const msgDom = MessageTip("📥", "开始下载");
        let isOkIndex = 0;
        const queueTask = QueueTaskRunner(5, 3)
            .endBack(overBack)
            .error(() => {
                queueTask.stop();
                msgDom.ico("❌");
                msgDom.text("数据获取失败");
                overBack(true);
            });
        for (let index = 1; index <= pages; index++) {
            queueTask.push(() => HTTP_XHR({
                method: "POST",
                url: "http://talenttagbff.m.jd.com/tagApprovalForm/list?isPush=OK",
                data: { ...query, pageNo: index },
                isWith: true,
                header: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                }
            }).then(xhr => {
                isOkIndex++;
                const { result } = xhr.responseText && JSON.parse(xhr.responseText) || {};
                if (result && xhr.status === 200) {
                    pages = result.pages;
                    total = result.total;
                    const percentage = isOkIndex / pages * 100;
                    msgDom.text(`共 ${total} 条数据：${isOkIndex}/${pages} = ${percentage.toFixed(2)}%`);
                    formatData(result.data);
                } else {
                    throw "失败";
                }
            }))
        }
        function formatData(params) {
            const status = ["", "通过", "驳回"];
            for (const list of params) {
                const listObj = {
                    "ID": list.id || "",
                    "达人ID": list.talentId || "",
                    "达人昵称": list.talentName || "",
                    "达人PIN": list.pin || "",
                    "创建时间": list.createTime || "",
                    "提交时间": list.modifyTime || "",
                    "处理人": list.modifyName || "",
                    "操作": status[list.status] || "",
                    "理由": list.opinion || "",
                }
                setUserData(list);
                excelData.push(listObj);
            }
        }
        function setUserData(params) {
            const listObj = {
                "提交时间": FormatTime("YYYY-MM-DD", params.modifyTime) || "",
                "处理人": params.modifyName || "未处理",
                "通过": params.status === 1 ? 1 : 0,
                "驳回": params.status === 2 ? 1 : 0,
                "未处理": params.status === 0 ? 1 : 0,
            }
            const newTime = new Date(listObj["提交时间"]).getTime();
            const findObj = userData.find(list => {
                const time = new Date(list["提交时间"]).getTime();
                if (newTime === time && list["处理人"] === listObj["处理人"]) {
                    return true;
                }
            });
            if (findObj) {
                findObj["通过"] += listObj["通过"];
                findObj["驳回"] += listObj["驳回"];
                findObj["未处理"] += listObj["未处理"];
                return false;
            }
            const index = userData.findIndex(list => {
                const time = new Date(list["提交时间"]).getTime();
                if (newTime < time) {
                    return true;
                }
            });
            if (index === -1) {
                userData.push(listObj);
            } else {
                userData.splice(index, 0, listObj);
            }
        }
        function overBack(type) {
            isRun = false;
            msgDom.remove(2);
            if (!type) {
                downloadExcel();
            }
        }
        function downloadExcel() {
            if (userData.length === 0 && excelData.length === 0) {
                return MessageTip("❌", "导出列表为空", 3);
            }
            MessageTip("✔️", "导出Excel", 3);
            const time = FormatTime("YYYYMMDDHHmmss");
            ExportToExcel("msFast_" + time + ".xlsx").sheet([
                {
                    sheetName: "看板",
                    sheetData: userData
                },
                {
                    sheetData: excelData
                }
            ]);
        }
    }
}

// 频权验证
function Plug_FrequentAuth(host, href) {
    const VerifyAuto = GM_getValue("switchConfig")["Verify-Auto"];
    if (!VerifyAuto.state) {
        return false;
    }
    const { GetQueryString, SwitchWrite, AwaitSelectorShow } = Plug_fnClass();
    const isUrl = VerifyAuto.returnurl;
    if (isUrl && decodeURIComponent(isUrl) === href) {
        if (!/cfe\.m\.jd\.com|passport\.jd\.com/i.test(href)) {
            return AwaitSelectorShow("div").then(() => {
                SwitchWrite("Verify-Auto", { ...VerifyAuto, time: new Date().getTime(), returnurl: "" });
            });
        }
    }
    // 频权验证页面
    if (host === "cfe.m.jd.com" || host === "passport.jd.com") {
        const returnurl = GetQueryString("returnurl") || GetQueryString("ReturnUrl");
        if (!returnurl) {
            return false;
        }
        let isChange = false;
        ["unload", "beforeunload"].forEach((listen) => {
            window.addEventListener(listen, () => {
                if (!isChange) {
                    SwitchWrite("Verify-Auto", { ...VerifyAuto, returnurl: returnurl });
                }
            }, { once: true });
        })
        const listenerId = GM_addValueChangeListener("switchConfig", (name, oldValue, newValue, remote) => {
            if (remote) {
                const newTime = newValue["Verify-Auto"].time;
                if (VerifyAuto.time !== newTime && typeof newTime === "number") {
                    isChange = true;
                    location.href = returnurl;
                    GM_removeValueChangeListener(listenerId);
                }
            }
        })
    }
}

// 种草秀
async function Plug_grassShow() {
    const { leftArrowIco } = Plug_ICO();
    const { GetQueryString, WaylayHTTP, AwaitSelectorShow, MessageTip, AddDOM } = Plug_fnClass();
    const pageName = GetQueryString("page");
    if (pageName !== "ver.jd.com") {
        return false;
    }
    const videoList = [];
    WaylayHTTP([{
        method: "POST",
        url: "video_videoDetail",
        callback: (params) => {
            const { list = [] } = params.data.responseText && JSON.parse(params.data.responseText) || {};
            for (const item of list) {
                const isFind = videoList.find(obj => obj.id === item.id);
                if (!isFind) {
                    videoList.push(item);
                }
            }
        }
    }])
    await AwaitSelectorShow(".swiper-wrapper");
    GM_addStyle(`
        .empty-btn,
        .tab-list-item,
        .showcard-imgtags,
        .content-item-info-pic {
            cursor: pointer;
        }
        #m_common_tip {
            display: none;
        }
        .video-main {
            position: fixed;
            width: 100%;
            height: 100vh;
            top: 100vh;
            background: #eeeeee;
            z-index: 1000000;
            transition: top 0.25s;
        }
        .video-main #back {
            z-index: 1;
            position: absolute;
            cursor: pointer;
            top: 4px;
            left: 4px;
            width: 40px;
            height: 30px;
            padding: 7px;
            transition: 0.25s;
            fill: #bbbbbb;
            border-radius: 6px;
            background: rgba(239,239,239,0.6);
            display: flex;
            justify-content: center;
        }
        .video-main #back:hover {
            background: #efefef;
            fill: #999999;
        }
    `)
    // 创建视频播放页面
    const videoConfig = {
        src: "",
        style: "top: 100vh;"
    };
    let timer = null;
    AddDOM({
        addNode: document.body,
        addData: [{
            name: "div",
            style: [videoConfig, "style", (value, setData) => {
                clearTimeout(timer);
                if (value && value.includes("top: 100vh;")) {
                    timer = setTimeout(() => setData(value + "opacity: 0;"), 250);
                }
                setData(value);
            }],
            className: "video-main",
            add: [{
                name: "div",
                id: "back",
                innerHTML: leftArrowIco,
                click: closeVideo
            }, {
                name: "video",
                style: "height: 100%;width: 100%;background: #333333;",
                controls: true,
                autoplay: true,
                src: [videoConfig, "src"]
            }]
        }]
    })
    // 注册点击事件
    const listDom = document.querySelectorAll("[id^=listDomId-]");
    listDom.forEach((element) => element.addEventListener("click", clickVideo));
    // 点击了视频
    function clickVideo(event) {
        if (event.target.className === "empty-btn" || event.target.innerHTML === "重新加载") {
            return MessageTip("✔️", "重新加载", 3);
        }
        event.preventDefault(); // 阻止默认行为
        event.stopPropagation(); // 阻止事件冒泡
        const imgAll = event.target.querySelectorAll("img");
        if (imgAll.length > 2) {
            return false;
        }
        const videoItemAll = [];
        for (const list of imgAll) {
            const imgName = list.src.replace(/.*jfs/, "");
            const videoItem = videoList.find(item => item.indexImage.includes(imgName));
            videoItem && videoItemAll.push(videoItem);
        }
        if (videoItemAll.length <= 0) {
            return MessageTip("❌", "未捕获到视频", 3);
        }
        if (imgAll.length === 1) {
            setPageVideo(videoItemAll[0]);
        }
    }
    // 监听ESC
    window.addEventListener("keyup", (event) => {
        if (event.key === "Escape") {
            closeVideo();
        }
    })
    // 关闭视频页面
    function closeVideo() {
        videoConfig.src = "";
        videoConfig.style = "top: 100vh;";
        document.body.style.overflow = "";
    }
    // 视频加载到页面
    function setPageVideo(videoItem) {
        const { playInfo = {} } = videoItem;
        if (playInfo.videoUrl) {
            videoConfig.style = "top: 0;";
            document.body.style.overflow = "hidden"; // 防止滚动穿透
            videoConfig.src = playInfo.videoUrl;
        } else {
            MessageTip("❌", "没有对应视频", 3);
        }
    }
}

// erpHome
async function Plug_erpHome() {
    const { GetQueryString, Encode } = Plug_fnClass();
    const params = GetQueryString(null);
    if (params.code) {
        await JD_OIDC_CODE(params.code);
    }
    if (params.redirect_uri) {
        window.open(Encode(params.redirect_uri).decode(), "_self");
    }
}
async function JD_OIDC_CODE(code) {
    const { GM_XHR } = Plug_fnClass();
    await GM_XHR({
        method: "GET",
        url: "http://contentexamination.jd.com/rejectReason/getReason?code=" + code,
        timeout: 2000
    }).then((xhr) => {
        console.log(JSON.parse(xhr.responseText));
    }).catch((error) => {
        console.error(error);
    })
}

async function Plug_skuMJD() {
    const { AddDOM, RemoveDom, AwaitSelectorShow, ObserverDOM, ThrottleOver } = Plug_fnClass();
    Object.defineProperty(document.documentElement, "clientWidth", {
        get: function () {
            return 640;
        }
    });
    window.dispatchEvent(new Event("resize"));
    GM_addStyle(`
        body {
            margin: 0 auto !important;
        }
        .bottom_fix_btn.bg_blue,
        .de_btn_wrap.fixed,
        .detail_bottom_blackBar,
        .detail_realName,
        .mod_fix_wrap
        .mod_tab,
        body {
            max-width: 640px !important;
        }
        .m_header .header_content {
            width: 640px;
            margin: 0 auto;
        }
        #loopImgDiv .inner {
            display: none;
        }
        .gm-loop-img-list {
            display: flex;
            overflow-y: auto;
            flex-direction: column;
            height: 100%;
        }
        .gm-loop-img-list img {
            width: 100%;
        }
        /*滚动条样式*/
        .gm-loop-img-list::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            display: block !important;
        }
        .gm-loop-img-list::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: #8B8B8B;
        }
        .gm-loop-img-list::-webkit-scrollbar-thumb:hover {
            background-color: #636363;
        }
    `)
    const loopImg = await AwaitSelectorShow("#loopImgDiv");
    const loopImgUl = loopImg.querySelector("#loopImgUl");
    const gmLoopList = await AddDOM({
        addNode: loopImg,
        addData: [{
            name: "div",
            className: "gm-loop-img-list",
        }]
    });
    const retryBack = ThrottleOver(() => {
        const imgAll = loopImgUl.querySelectorAll("img");
        const srcList = [...imgAll].map((img) => img.getAttribute("back_src") || img.src);
        const bar = loopImg.querySelector("#loopImgBarJx");
        bar ? bar.innerHTML = `<span>${srcList.length}</span>` : null;
        RemoveDom(gmLoopList);
        AddDOM({
            addNode: gmLoopList,
            addData: srcList.map((src) => ({
                name: "img",
                src: src,
            }))
        });
    }, 100)
    ObserverDOM(retryBack).observe(loopImgUl, { childList: true, subtree: true, attributes: true });
}

// 商卡页面
async function Plug_skuItem() {
    const { AwaitSelectorShow, MessageTip, SwitchRead } = Plug_fnClass();
    const skuSkip = SwitchRead("Stop-Sku-Skip");
    if (!skuSkip.state) {
        return false;
    }
    await AwaitSelectorShow("div");
    (function ($) {
        const originalAjax = $.ajax;
        $.ajax = function (options) {
            const errStr = options.error;
            if (/window.location.href/.test(errStr) && /reason=403/.test(errStr)) {
                const regex = /window\.location\.href\s*=\s*["']([^"']+)["']/;
                const match = errStr.toString().match(regex);
                options.error = function (error) {
                    console.error(error);
                    if (match && match[1]) {
                        const url = match[1];
                        MessageTip("❌", "已阻止页面跳转: " + url, 5);
                    } else {
                        MessageTip("❌", "已阻止页面跳转", 5);
                    }
                }
            }
            return originalAjax(options);
        };
    })(jQuery);
}

// 钉钉文档
async function Plug_dingTalk() {
    const { AwaitSelectorShow, AddDOM } = Plug_fnClass();
    const spmAnchor = await AwaitSelectorShow(() => {
        const elements = document.querySelectorAll("div[data-testid=ws-navigation-bar]>div");
        for (const element of elements) {
            if (/layout__Grow/.test(element.className)) {
                element.style.display = "flex";
                element.style.alignItems = "center";
                element.style.flexDirection = "row-reverse";
                return element;
            }
        }
    });
    AddDOM({
        addNode: spmAnchor,
        addData: [{
            name: "button",
            className: "gm-button small",
            innerText: "酷函数",
            click: openScript
        }]
    });
    // 隐藏
    function hideDiv(element) {
        const parentNode = element.parentNode;
        parentNode.style.display = "none";
        setTimeout(() => {
            parentNode.style.display = "";
        }, 1000);
    }
    async function openScript() {
        await AwaitSelectorShow(() => {
            const menus = document.querySelectorAll('div[data-testid="toolbar-menu"]');
            for (const menu of menus) {
                if (menu.innerText === "菜单" && menu.clientHeight > 20) {
                    menu.click();
                    return menu;
                }
            }
        });
        const plugin = await AwaitSelectorShow('div[data-testid="ContextMenuWrap_plugin"]');
        hideDiv(plugin);
        for (const key of Object.keys(plugin)) {
            if (/__reactProps/.test(key)) {
                plugin[key].onMouseEnter();
            }
        }
        const pluginWebide = await AwaitSelectorShow('div[data-testid="ContextMenuWrap__plugin_webide"]');
        for (const key of Object.keys(pluginWebide)) {
            if (/__reactProps/.test(key)) {
                pluginWebide[key].onMouseEnter();
            }
        }
        const script = await AwaitSelectorShow('div[data-testid="menu-item-scripts-menubar-list"]');
        script.click();
    }
}

// 设置样式
function CSS_settingPage() {
    // 设置模态框样式
    GM_addStyle(`
        #plug-setting {
            height: 75%;
            min-height: 600px;
            width: 50%;
            min-width: 800px;
        }
        #plug-setting #menu {
            width: 100%;
            height: 100%;
            display: flex;
        }
        #plug-setting #menu-list {
            width: 110px;
            min-width: 110px;
            padding-right: 10px;
            user-select: none;
        }
        #plug-setting #menu-list div {
            font-size: 14px;
            padding: 15px 0;
            background: #eeeeee;
            border-radius: 5px;
            line-height: 1;
            margin-bottom: 10px;
            text-align: center;
            cursor: pointer;
            transition: 0.25s;
        }
        #plug-setting #menu-list div:hover {
            background: #dddddd;
        }
        #plug-setting #menu-list div:active {
            background: #cccccc;
        }
        #plug-setting #menu-list .active {
            color: #ffffff;
            background: #4296f4 !important;
        }
        #plug-setting #page {
            width: 100%;
            overflow: hidden;
            border-radius: 3px;
            position: relative;
        }
        #plug-setting #page::before,
        #plug-setting #page::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 0px;
            transition: 0.25s;
        }
        #plug-setting #page::before {
            top: 0;
            background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0));
        }
        #plug-setting #page::after {
            bottom: 0;
            background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.1));
        }
        #plug-setting #page.shadow-top::before,
        #plug-setting #page.shadow-bottom::after {
            height: 15px;
            pointer-events: none;
        }
        #plug-setting #page-list {
            height: 100%;
            overflow-x: auto;
            display: none;
            outline: none;
        }
        #plug-setting #page-list.active {
            gap: 20px;
            display: flex;
            flex-direction: column;
        }
        #plug-setting #page-item {
            padding: 0 10px;
            display: flex;
            flex-direction: column;
        }
        #plug-setting #page-item .plug-center {
            display: flex;
            align-items: center;
        }
        #plug-setting #page-item label {
            margin-right: 10px;
        }
        #plug-setting #page-item #label {
            font-size: 16px;
            font-weight: bolder;
        }
        #plug-setting #page-item #info {
            margin-top: 5px;
            color: rgba(0,0,0,0.65);
        }
        #plug-setting #page-item #password {
            padding: 3px 8px;
            border: 1px solid #bbbbbb;
            border-radius: 5px;
            transition: 0.25s;
            display: flex;
            align-items: center;
        }
        #plug-setting #page-item #password:hover {
            border-color: #40a9ff;
        }
        #plug-setting #page-item #password input {
            border: none;
            outline: none;
            padding: 0;
            font-size: 13px;
        }
        #plug-setting #page-item #password span {
            display: flex;
            cursor: pointer;
            margin-left: 5px;
            user-select: none;
        }
        #plug-setting #page-item #password svg {
            fill: #bbbbbb;
            transition: 0.25s;
        }
        #plug-setting #page-item #password svg:hover {
            fill: #40a9ff;
        }
        #plug-setting #debug {
            display: none;
        }
        #page-highlight {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        #page-textarea {
            display: flex;
            justify-content: center;
            height: 100%;
            gap: 10px;
            padding-left: 10px;
        }
    `)
    // 设置代码编辑器样式
    GM_addStyle(`
        .gm-code-page {
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .gm-code {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .gm-code textarea {
            width: 100%;
            height: 100%;
        }
        .gm-code>.CodeMirror {
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }
        .gm-code * {
            scroll-behavior: unset !important;
            font-family: Consolas, "Source Han SerifCN", Georgia, Times, "SimSun" !important;
        }
        .CodeMirror-scrollbar-filler {
            display: none !important;
        }
    `)
    // 倍速选项样式
    GM_addStyle(`
        .switch-video-rate-list {
            gap: 5px;
            display: flex;
            flex-direction: column;
            align-items: flex-start !important;
        }
        .switch-label-size-item,
        .switch-video-rate-item {
            gap: 5px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
        .switch-label-size-item>span,
        .switch-video-rate-item>span {
            width: 45px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            background: #eeeeee;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
            transition: 0.25s;
        }
        .switch-label-size-item>span {
            width: 60px;
            height: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .switch-label-size-item>span:hover,
        .switch-video-rate-item>span:hover {
            background: #dddddd;
        }
        .switch-label-size-item>span:active,
        .switch-video-rate-item>span:active {
            background: #cccccc;
        }
        .switch-label-size-item>span.true,
        .switch-video-rate-item>span.true {
            background: #aaaaaa;
            color: #ffffff;
        }
    `)
    const codemirrorCSS = GM_getResourceText("codemirrorCSS");
    const codemirrorTheme = GM_getResourceText("codemirrorTheme");
    GM_addStyle(codemirrorCSS);
    GM_addStyle(codemirrorTheme);
}

// 全局样式
function CSS_mainPage() {
    const elementCSS = GM_getResourceText("elementCSS");
    const newCss = elementCSS.replace(/fonts\/element-icons/g, "https://unpkg.com/element-ui@2.15.10/lib/theme-chalk/fonts/element-icons");
    GM_addStyle(newCss);
    // 全局高亮
    GM_addStyle(`
        .gm-highlight,
        .gm-highlight-light {
            color: #ffffff;
            border-radius: 4px;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            padding: 0px 2px;
            display: inline-block;
            background: #ffb300;
            text-indent: 0;
            font-style: normal;
        }
    `)
    // 全局input样式
    GM_addStyle(`
        .gm-input {
            padding: 3px 8px;
            border: 1px solid #bbbbbb;
            border-radius: 5px;
            outline: none;
            transition: border-color 0.25s;
            color: #333333;
        }
        .gm-input:hover {
            border-color: #40a9ff;
        }
        .gm-input:focus-visible {
            border-color: #ff0000;
        }
        .gm-input[disabled] {
            cursor: not-allowed;
            background: #f8f8f8;
            color: #888888;
        }
    `);
    // 全局textarea样式
    GM_addStyle(`
        .gm-textarea {
            width: 100%;
            height: 100%;
            padding: 3px;
            border-radius: 5px;
            resize: none;
            font-size: 14px;
            outline: none;
            border: 1px solid #bbbbbb;
            color: #333333;
            transition: 0.25s;
            box-sizing: border-box;
            font-family: sans-serif;
            overflow-y: auto;
        }
        .gm-textarea:hover {
            border-color: #40a9ff;
        }
        .gm-textarea:focus-visible {
            border-color: #ff0000;
        }
        .gm-textarea[disabled] {
            cursor: not-allowed;
            background: #f8f8f8;
            color: #888888;
        }
    `);
    // 全局checkbox样式
    GM_addStyle(`
        .gm-switch {
            --button-width: 40px;
            --button-height: 20px;
            --toggle-diameter: 16px;
            --loading-diameter: 14px;
            --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
            --button-loading-offset: calc((var(--button-height) - var(--loading-diameter)) / 2);
            --toggle-shadow-offset: 10px;
            --toggle-wider: 20px;
            --color-grey: #cccccc;
            --color-green: #4296f4;
        }
        .gm-slider {
            display: inline-block;
            width: var(--button-width);
            height: var(--button-height);
            background-color: var(--color-grey);
            border-radius: calc(var(--button-height) / 2);
            position: relative;
            transition: 0.3s all ease-in-out;
            cursor: pointer;
            display: flex;
        }
        .gm-switch input[type="checkbox"][loading="true"] + .gm-slider::before,
        .gm-slider::after {
            content: "";
            display: inline-block;
            border-radius: calc(var(--toggle-diameter) / 2);
            position: absolute;
            transition: 0.3s all ease-in-out;
        }
        .gm-slider::after {
            width: var(--toggle-diameter);
            height: var(--toggle-diameter);
            background-color: #ffffff;
            top: var(--button-toggle-offset);
            box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.1);
            transform: translateX(var(--button-toggle-offset));
        }
        .gm-switch input[type="checkbox"]:checked + .gm-slider {
            background-color: var(--color-green);
        }
        .gm-switch input[type="checkbox"]:checked + .gm-slider::after {
            box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.1);
            transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)));
        }
        .gm-switch input[type="checkbox"] {
            display: none;
        }
        .gm-switch input[type="checkbox"]:active + .gm-slider::after {
            width: var(--toggle-wider);
        }
        .gm-switch input[type="checkbox"]:checked:active + .gm-slider::after {
            transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)));
        }
        .gm-switch input[type="checkbox"][disabled="true"] + .gm-slider {
            cursor: no-drop;
            background-color: var(--color-grey);
        }
        .gm-switch input[type="checkbox"][loading="true"] + .gm-slider::before {
            z-index: 1;
            width: var(--loading-diameter);
            height: var(--loading-diameter);
            background-color: rgba(0, 0, 0, 0);
            top: var(--button-loading-offset);
            border: 2px solid rgba(0, 0, 0, 0);
            border-top-color: #cacaca;
            --loading-transform: translateX(var(--button-loading-offset));
            transform: var(--loading-transform);
            animation: gm-switch-loading 1s linear infinite;
        }
        .gm-switch input[type="checkbox"][loading="true"]:checked + .gm-slider::before {
            --loading-transform: translateX(calc(var(--button-width) - var(--loading-diameter) - var(--button-loading-offset)));
            transform: var(--loading-transform);
        }
        @keyframes gm-switch-loading {
            0%{
                transform: var(--loading-transform) rotate(0deg);
            }
            100%{
                transform: var(--loading-transform) rotate(360deg);
            }
        }
    `)
    // 全局按钮样式
    GM_addStyle(`
        .gm-button {
            color: #ffffff;
            border: 0 solid rgba(0,0,0,0);
            outline: none;
            cursor: pointer;
            text-align: center;
            transition: ease-in 0.2s;
            user-select: none;
        }
        .gm-button.disabled {
            transition: none;
            cursor: no-drop !important;
            filter: brightness(0.8) !important;
        }
        .gm-button {
            height: 32px;
            line-height: 32px;
            padding: 0 20px;
            border-radius: 5px;
        }
        .gm-button.small {
            height: 24px;
            line-height: 24px;
            padding: 0 7px;
            border-radius: 3px;
        }
        .gm-button.large {
            height: 40px;
            line-height: 40px;
            padding: 0 30px;
            border-radius: 5px;
        }
        .gm-button {
            background: #40a9ff;
        }
        .gm-button:not(.disabled):hover {
            background: #1890ff;
        }
        .gm-button:not(.disabled):active {
            background: #096dd9;
            transition: all ease-in 0.1s;
        }
        .gm-button.warning {
            background: #ffb300;
        }
        .gm-button.warning:not(.disabled):hover {
            background: #ffca28;
        }
        .gm-button.warning:not(.disabled):active {
            background: #ff8f00;
            transition: all ease-in 0.1s;
        }
        .gm-button.danger {
            background: #ff6060;
        }
        .gm-button.danger:not(.disabled):hover {
            background: #ff4d4f;
        }
        .gm-button.danger:not(.disabled):active {
            background: #d9363e;
            transition: all ease-in 0.1s;
        }
    `)
}