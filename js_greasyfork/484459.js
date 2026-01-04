// ==UserScript==
// @name               自研 - 多个站点 - 自动签到
// @name:en_US         Self-made - Multi-site - Auto Check-in
// @description        自动完成周期性签到。目前已适配中图网、阿里云开发者社区和母带吧音乐论坛。
// @description:en_US  Automatically complete periodic check-ins. Currently compatible with options BooksChina, Alibaba Cloud Developer BBS, and MuDaiBa MUSIC BBS.
// @version            1.0.3
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.bookschina.com/vieworder/default.aspx
// @match              https://link.bilibili.com/p/center/index
// @match              https://live.bilibili.com/*
// @match              https://developer.aliyun.com/
// @match              https://developer.aliyun.com/?accounttraceid=*
// @match              https://developer.aliyun.com/live/251214
// @match              https://developer.aliyun.com/score
// @match              https://mudaiba.com/
// @exclude            https://mudaiba.com/user-login.htm
// @icon               data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant              GM_openInTab
// @grant              window.close
// @run-at             document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484459/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484459/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
/*
        {
            "name": "[站点名称]( - 签到项)",
            "enable": ["true 启用", "false 禁用"],
            "url": /页面正则/,
            "checks": {
                "login": { // 登录状态检测
                    "enable": ["true 启用", "false 禁用"],
                    "mode": ["elm 元素存在", "text 元素内文本", "attribute 元素属性"],
                    "elm": "元素选择器",
                    "data": ["元素内文本或元素属性键", "元素属性值"]
                },
                "signIn": { // 签到检测
                    "mode": ["elm 元素存在", "text 元素内文本", "attribute 元素属性"],
                    "elm": "元素选择器",
                    "data": ["元素内文本或元素属性键", "元素属性值"]
                },
            },
            "actions": {
                "signIn": [
                    {
                        "name": "行动名称",
                        "mode": ["click 点击元素", "open 新建页面", "openSelf 当前页面跳转", "reload 重载页面", "close 关闭页面", "script 脚本"],
                        "data": "元素选择器或页面链接",
                        "sleep": "执行前等待(单位为秒)"
                    }
                ],
                "unLogin": [],
                "hasSignIn": [
                    {
                        "name": "关闭页面",
                        "mode": "close",
                        "data": "",
                        "sleep": 1
                    }
                ]
            }
        },
*/


(function() {
    'use strict';

    // 定义「配置信息」「网页标题」变量和「元素选择器」「操作执行」函数
    const config = [
        {
            "name": "中图网",
            "enable": true,
            "url": /https:\/\/www.bookschina.com\/vieworder\/default.aspx/,
            "checks": {
                "login": {
                    "enable": true,
                    "mode": "",
                    "elm": "",
                    "data": [""]
                },
                "signIn": {
                    "mode": "text",
                    "elm": ".signBtn a",
                    "data": ["签到送书币"]
                },
            },
            "actions": {
                "signIn": [
                    {
                        "name": "打开签到弹框",
                        "mode": "click",
                        "data": ".signBtn a",
                        "sleep": 2
                    },
                    {
                        "name": "点击签到按钮",
                        "mode": "click",
                        "data": ".flopCon #cover1",
                        "sleep": 2
                    },
                    {
                        "name": "关闭页面",
                        "mode": "close",
                        "data": "",
                        "sleep": 6
                    }
                ],
                "unLogin": [],
                "hasSignIn": [
                    {
                        "name": "关闭页面",
                        "mode": "close",
                        "data": "",
                        "sleep": 1
                    }
                ]
            }
        },
        {
            "name": "阿里云开发者社区 - 签到",
            "enable": true,
            "url": /https:\/\/developer.aliyun.com\/(\?accounttraceid=\w+)?$/,
            "checks": {
                "login": {
                    "enable": true,
                    "mode": "text",
                    "elm": ".aliyun-register",
                    "data": ["登录/注册"]
                },
                "signIn": {
                    "mode": "elm",
                    "elm": ".user-sign-day-box.active .user-sign-day-box-num",
                    "data": [""]
                },
            },
            "actions": {
                "signIn": [
                    {
                        "name": "点击签到按钮",
                        "mode": "click",
                        "data": ".user-sign-day-box.active .user-sign-day-box-num",
                        "sleep": .5
                    },
                    {
                        "name": "打开视频任务页面",
                        "mode": "openSelf",
                        "data": "https://developer.aliyun.com/live/251214",
                        "sleep": .5
                    }
                ],
                "unLogin": [
                    {
                        "name": "访问登录页面",
                        "mode": "click",
                        "data": ".aliyun-register",
                        "sleep": 0
                    }
                ],
                "hasSignIn": [
                    {
                        "name": "关闭页面",
                        "mode": "close",
                        "data": "",
                        "sleep": 1
                    }
                ]
            }
        },
        {
            "name": "阿里云开发者社区 - 视频任务",
            "enable": true,
            "url": /https:\/\/developer.aliyun.com\/live\/251214/,
            "checks": {
                "login": {
                    "enable": true,
                    "mode": "text",
                    "elm": ".aliyun-register",
                    "data": ["登录/注册"]
                },
                "signIn": {
                    "mode": "elm",
                    "elm": "114514",
                    "data": [""]
                },
            },
            "actions": {
                "signIn": [
                    {
                        "name": "将视频静音",
                        "mode": "script",
                        "data": () => {
                            function waitForElm(selector) {
                                // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
                                return new Promise(resolve => {
                                    if (document.querySelector(selector)) {
                                        return resolve(document.querySelector(selector));
                                    }
                                    const observer = new MutationObserver(mutations => {
                                        if (document.querySelector(selector)) {
                                            observer.disconnect();
                                            resolve(document.querySelector(selector));
                                        }
                                    });
                                    observer.observe(document.body, {
                                        childList: true,
                                        subtree: true
                                    });
                                });
                            };

                            waitForElm('video').then((vid) => {
                                document.querySelector('video').muted = true;
                            })
                        },
                        "sleep": 0
                    },
                    {
                        "name": "打开积分领取页面",
                        "mode": "openSelf",
                        "data": "https://developer.aliyun.com/score",
                        "sleep": 120
                    }
                ],
                "unLogin": [
                    {
                        "name": "访问登录页面",
                        "mode": "click",
                        "data": ".aliyun-register",
                        "sleep": 0
                    }
                ],
                "hasSignIn": [
                    {
                        "name": "关闭页面",
                        "mode": "close",
                        "data": "",
                        "sleep": 1
                    }
                ]
            }
        },
        {
            "name": "阿里云开发者社区 - 积分领取",
            "enable": true,
            "url": /https:\/\/developer.aliyun.com\/score/,
            "checks": {
                "login": {
                    "enable": true,
                    "mode": "text",
                    "elm": ".aliyun-register",
                    "data": ["登录/注册"]
                },
                "signIn": {
                    "mode": "elm",
                    "elm": ".user-level-bottom-box-wrapper-button",
                    "data": [""]
                },
            },
            "actions": {
                "signIn": [
                    {
                        "name": "点击签到按钮",
                        "mode": "click",
                        "data": ".user-level-bottom-box-wrapper-button",
                        "sleep": 3
                    },
                ],
                "unLogin": [
                    {
                        "name": "访问登录页面",
                        "mode": "click",
                        "data": ".aliyun-register",
                        "sleep": 0
                    }
                ],
                "hasSignIn": []
            }
        },
        {
            "name": "母带吧音乐论坛",
            "enable": true,
            "url": /https:\/\/mudaiba.com\//,
            "checks": {
                "login": {
                    "enable": true,
                    "mode": "elm",
                    "elm": ".nav-link[href=\"user-login.htm\"]",
                    "data": [""]
                },
                "signIn": {
                    "mode": "text",
                    "elm": "#header .navbar-nav:nth-child(2) li:nth-child(5) a",
                    "data": [" 签到"]
                },
            },
            "actions": {
                "signIn": [
                    {
                        "name": "点击签到按钮",
                        "mode": "click",
                        "data": "#header .navbar-nav:nth-child(2) li:nth-child(5) a",
                        "sleep": 0
                    },
                ],
                "unLogin": [
                    {
                        "name": "访问登录页面",
                        "mode": "click",
                        "data": ".nav-link[href=\"user-login.htm\"]",
                        "sleep": 0
                    }
                ],
                "hasSignIn": []
            }
        }
    ],
          title = document.title;

    function $(elm, node = 0) {
        try {
            return document.querySelectorAll(elm)[node]
        }catch (e) {
            return true
        }
    }
    function action(data) {
        document.title = `[正在执行「${data.name}」中]${title}`
        // 等待指定时间加噪音时间后，正式执行对应操作
        setTimeout(() => {
            if(data.mode === "click" && $(data.data)) {
                $(data.data).click();
            }else if(data.mode === "open") {
                GM_openInTab(data.data, {"active": true})
            }else if(data.mode === "openSelf") {
                window.open(data.data,"_self")
            }else if(data.mode === "reload") {
                location.reload()
            }else if(data.mode === "close") {
                window.close()
            }else if(data.mode === "script") {
                data.data()
            }
        }, (data.sleep + Math.random()) * 1000);
    }

    // 等待 3 秒
    setTimeout(() => {
        // 遍历「配置信息」
        config.forEach((datas) => {
            // 如果匹配且配置启用
            if(datas.url.test(location.href) && datas.enable) {
                document.title = `[已匹配规则「${datas.name}」]${title}`
                // 判断是否登录，如果未登录就执行对应操作
                if(datas.checks.login.enable && datas.checks.login.mode === "elm" && $(datas.checks.login.elm) || datas.checks.login.enable && datas.checks.login.mode === "text" && $(datas.checks.login.elm) && $(datas.checks.login.elm).textContent === datas.checks.login.data[0] || datas.checks.login.enable && datas.checks.login.mode === "attribute" && $(datas.checks.login.elm) && $(datas.checks.login.elm).getAttribute(datas.checks.login.data[0]) === datas.checks.login.data[1]) {
                    document.title = `[未登录]${title}`
                    datas.actions.unLogin.forEach((data) => {
                        action(data)
                    })
                // 判断是否签到，如果未签到就执行对应操作
                }else if(datas.checks.signIn.mode === "elm" && $(datas.checks.signIn.elm) || datas.checks.signIn.mode === "text" && $(datas.checks.signIn.elm) && $(datas.checks.signIn.elm).textContent === datas.checks.signIn.data[0] || datas.checks.signIn.mode === "attribute" && $(datas.checks.signIn.elm) && $(datas.checks.signIn.elm).getAttribute(datas.checks.signIn.data[0]) === datas.checks.signIn.data[1]) {
                    document.title = `[签到中]${title}`
                    datas.actions.signIn.forEach((data) => {
                        action(data)
                    })
                // 否则就执行已签到对应操作
                }else {
                    document.title = `[已签到]${title}`
                    datas.actions.hasSignIn.forEach((data) => {
                        action(data)
                    });
                }
            }
        });
    }, 3000);

})();