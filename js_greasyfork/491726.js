// ==UserScript==
// @name         XIAOE-MENU
// @namespace    https://zosah.gitee.io/
// @version      1.2.3
// @description  一键代理、获取Token、H5直接扫码登录、H5调试模式、H5直达B端、coding内容自动展开、快速复制直播链接、GitLab快捷入口、默认进添加讲师页、管理台新旧切换等
// @author       Zosah
// @match        https://bbs.tampermonkey.net.cn/thread-271-1-1.html
// @icon         https://commonresource-1252524126.cdn.xiaoeknow.com/image/lhyaurs50zil.ico
// @match        *://*.h5.xiaoeknow.com/*/course/alive/*
// @match        *://*.xet.xiaoetong.com/*/course/alive/*
// @match        *://*.h5.inside.xiaoeknow.com/*/course/alive/*
// @match        *://*.h5.test.xiaoeknow.com/*/course/alive/*
// @match        *://*.pc.xiaoe-tech.com/live_pc/*
// @match        *://*.pc.test.xiaoe-tech.com/live_pc/*
// @match        *://*.pc.inside.xiaoe-tech.com/live_pc/*
// @match        *://*.pc.inside.xiaoecloud.com/live_pc/*
// @match        *://talkcheap.xiaoeknow.com/*
// @match        *://*.h5.xiaoeknow.com/p/t/free/v1/*
// @match        *://*.h5.inside.xiaoeknow.com/p/t/free/v1/*
// @match        *://*.xiaoeknow.com/*/course/alive/*
// @match        *://admin.xiaoe-tech.com/*
// @match        *://admin.inside.xiaoe-tech.com/*
// @match        *://admin.test.xiaoe-tech.com/*
// @match        *://pc.xiaoecloud.com/live_pc/*
// @match        *://pc.inside.xiaoecloud.com/live_pc/*
// @match        *://pc.test.xiaoecloud.com/live_pc/*
// @match        *://*.pc.inside.xiaoe-tech.com/live_pc/*
// @match        *://*.pc.test.xiaoe-tech.com/live_pc/*
// @match        *://*.h5.xiaoeknow.com/content_page/*
// @match        *://*.h5.inside.xiaoeknow.com/content_page/*
// @match        *://*.h5.test.xiaoeknow.com/content_page/*
// @match        *://ops.xiaoe-tools.com/*
// @match        *://xiaoe.coding.net/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// @connect      qyapi.weixin.qq.com
// @require      https://update.greasyfork.org/scripts/490343/1354721/Mini_Toast.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491726/XIAOE-MENU.user.js
// @updateURL https://update.greasyfork.org/scripts/491726/XIAOE-MENU.meta.js
// ==/UserScript==

// @require      file://E:\program-profile\greasy-fork-snippet\src\core\xiaoe-menu.js


const MENU_NAME = {
    AGENT: 'menu_agent',
    GITLAB: 'menu_gitlab',
    SWITCH_UA: 'menu_switch_ua',
    COMMON_TOKEN_SEND: 'menu_common_token_send',
    H5_DEBUG: 'menu_h5_debug',
    CODING_AUTO_EXTEND: 'menu_coding_auto_extend',
    CHANGE_ADMIN_VERSION: 'menu_change_admin_version',
    H5_TO_ADMIN: 'menu_h5_to_admin',
    COPY_LIVE_URL: 'menu_copy_live_url',
    OPT_WARNING: 'menu_opt_warning',
    ADMIN_TEACHER_PAGE: 'menu_admin_teacher_page',
    PLAN_BIG_WORD: 'menu_plan_big_word',
};
// 菜单MAP
const MENU = [
    [MENU_NAME.AGENT, 'H5/PC一键代理', true],
    [MENU_NAME.COMMON_TOKEN_SEND, '推送TOKEN', false],
    [MENU_NAME.SWITCH_UA, 'H5扫码登录', false],
    [MENU_NAME.H5_DEBUG, 'H5调试模式', true],
    [MENU_NAME.CODING_AUTO_EXTEND, 'coding自动展开描述', true],
    [MENU_NAME.CHANGE_ADMIN_VERSION, '新/旧管理台切换', true],
    [MENU_NAME.H5_TO_ADMIN, 'H5直达B端', true],
    [MENU_NAME.COPY_LIVE_URL, '快速复制直播链接', true],
    [MENU_NAME.GITLAB, 'GitLab快捷入口', true],
    [MENU_NAME.ADMIN_TEACHER_PAGE, 'B端直达添加讲师页', true],
    [MENU_NAME.OPT_WARNING, 'B端变身优化警示框', true],
    [MENU_NAME.PLAN_BIG_WORD, '计划列表大字提示', false],
]

// 可执行菜单ID
const MENU_ID = [];
const COMMON_TOKEN_URL = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4b6f2188-7e9d-4ba2-b697-35005b3a2ca5"

const version = GM_info.script.version;
// 工具类
const utils = {
    // 判断是否为H5直播间
    isLiveH5: window.location.href.indexOf('course/alive') !== -1,
    isLivePc: window.location.href.indexOf('live_pc') !== -1,
    isLiveRoomTeacher: window.location.href.indexOf('content_page') !== -1,
    isGitlab: window.location.href.indexOf('talkcheap.xiaoeknow.com') !== -1,
    isH5Login: window.location.href.indexOf('p/t/free/v1') !== -1,
    // isAdmin: typeof window.GlobalState !== 'undefined',
    isCoding: window.location.href.indexOf('xiaoe.coding.net'),
    isAdmin: window.location.href.indexOf('xiaoe-tech.com/t/live') !== -1 || window.location.href.indexOf('xiaoe-tech.com/t/merchant') !== -1 || unsafeWindow.GlobalState,
    isOps: window.location.href.indexOf('ops.xiaoe-tools.com') !== -1,
    // 获得对应的token
    getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
        }
        return null;
    },
    // 包装推送内容
    getMarkdownContent(type, data) {
        const tempArr = []
        Object.keys(data).forEach(item => {
            tempArr.push(`${item}："${data[item]}"`);
        })
        const formattedTime = moment().format('YYYY-MM-DD HH:mm:ss');
        tempArr.unshift(`【${type}】` + formattedTime)
        const content = tempArr.join("\n");
        let params = {
            "msgtype": "text",
            "text": {
                "content": content
            }
        }
        return params;
    },
    // 管理台获得token对应的key
    getAdminTokenKey() {
        const target = window.location.origin;
        let tokenName = "b_user_token";
        if (target.indexOf(".inside.") !== -1) {
            tokenName = "b_user_token_inside";
        } else if (target.indexOf(".test.") !== -1) {
            tokenName = "b_user_token_test";
        }
        return tokenName
    },
    // 调用推送
    requestApi(url, data) {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    url,
                    method: "POST",
                    data: JSON.stringify(data),
                    onload: function (xhr) {
                        resolve(xhr)
                    }
                });
            } catch (err) {
                reject(err)
            }
        })
    },
    // 获取当前环境
    getEnv(url) {
        if (url.indexOf(".inside.") !== -1) {
            return "inside"
        } else if (url.indexOf(".test.") !== -1) {
            return "test"
        } else {
            return "prod"
        }
    },
    getTimeAgo(dateString) {
        const target = new Date(dateString);
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        const todayHours = today.getHours();
        const givenYear = target.getFullYear();
        const givenMonth = target.getMonth();
        const givenDate = target.getDate();
        const givenHours = target.getHours();
        const timeDiff = today.getTime() - target.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (givenYear === todayYear && givenMonth === todayMonth && givenDate === todayDate) {
            return '（今天）';
        } else if (daysDiff === 1 && todayHours >= givenHours) {
            return '（昨天）';
        } else {
            return `（${daysDiff}天前）`;
        }
    }
}

// 初始化缓存菜单状态
function initCacheMenuState() {
    for (let i = 0; i < MENU.length; i++) {
        if (GM_getValue(MENU[i][0]) == null) {
            GM_setValue(MENU[i][0], MENU[i][3])
        }
    }
}

// 注册脚本菜单
function registerMenuCommand() {
    // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
    for (let i = 0; i < MENU_ID.length; i++) {
        GM_unregisterMenuCommand(MENU_ID[i]);
    }
    // 循环注册脚本菜单
    for (let i = 0; i < MENU.length; i++) {
        // 缓存中读取菜单值
        MENU[i][2] = GM_getValue(MENU[i][0]);
        if (MENU[i][0] === MENU_NAME.AGENT) {
            MENU_ID[i] = GM_registerMenuCommand(`✅ ${MENU[i][1]}`, function () {
                menuSwitch(`${MENU[i][2]}`, `${MENU[i][0]}`, `${MENU[i][1]}`, menuCoreFunc[MENU[i][0]], false)
            });
        } else {
            MENU_ID[i] = GM_registerMenuCommand(`${MENU[i][2] ? '✅' : '❌'} ${MENU[i][1]}`, function () {
                menuSwitch(`${MENU[i][2]}`, `${MENU[i][0]}`, `${MENU[i][1]}`, menuCoreFunc[MENU[i][0]], true)
            });
        }
    }
}

// 菜单开关
function menuSwitch(state, Name, Tips, runner, showToast = true) {
    console.log(`[xiaoe-menu] [v${version}] menuSwitch ${Name} ${Tips}`)
    runner();
    if (showToast) {
        if (state === 'true') {
            GM_setValue(`${Name}`, false);
            toastHandler.showToast(`已关闭 [${Tips}] 功能`, 2500)
        } else {
            GM_setValue(`${Name}`, true);
            toastHandler.showToast(`已开启 [${Tips}] 功能`, 2500)
        }
    }
    registerMenuCommand(); // 重新注册脚本菜单
}

// 色卡：https://www.chinavid.com/chinese-color.html
// 生成节点相关工具类
const nodeHandler = {
    GITLAB_READER_DOM: [
        {
            name: "live-h5",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-h5",
            bgc: "#1472ff",
            color: "white"
        },
        {
            name: "live-admin",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-admin",
            bgc: "#E0EBFF",
            color: "#000000"
        },
        {
            name: "live-admin-next",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-admin-next",
            bgc: "#abace6",
            color: "#000000"
        },
        {
            name: "live-pc",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-pc",
            bgc: "#f19f47",
            color: "white"
        },
        {
            name: "live_pc_client",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/live_pc_client",
            bgc: "#ffc773",
            color: "white"
        },
        {
            name: "live-room-teacher",
            url: "https://talkcheap.xiaoeknow.com/XiaoeFE/live_room_teacher",
            bgc: "#a07c8c",
            color: "white"
        },
        {
            name: "live-mp",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-mp",
            bgc: "#67372c",
            color: "white"
        },
        {
            name: "live-c-marketing",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-c-marketing",
            bgc: "#16a951",
            color: "white"
        },
        {
            name: "live-marketing",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-marketing",
            bgc: "#59b897",
            color: "white"
        },
        {
            name: "mono",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/live-client-components-mono",
            bgc: "#ef7a82",
            color: "white"
        },
        {
            name: "live-sales",
            url: "https://talkcheap.xiaoeknow.com/AliveDev/LiveFE/live-sales",
            bgc: "#cca4e3",
            color: "white"
        }],
    getGitlabStyle: (bgc, color) => {
        return `
            min-width:150px;
            height:50px;
            line-height:50px;
            text-align:center;
            cursor: pointer;
            font-size: 16px;
            font-family: PingFangSC-Regular,PingFang SC;
            font-weight: 400;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            padding: 0px 10px;
            margin-bottom:10px;
            border-radius:5px;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;background:`
            + bgc + `;color:` + color + ";";
    },
    setGitlabNode: (display, id) => {
        let box = document.getElementsByClassName("layout-page")[0];
        box.style.position = "relative";
        // 大盒子
        let obox = document.createElement('div')
        obox.style = `position:fixed;right:100px;top:250px;display:${display};`
        obox.id = id; // "gitlab-box"
        box.appendChild(obox)
        // 按钮
        const renderDom = nodeHandler.GITLAB_READER_DOM;
        for (let i = 0; i < renderDom.length; i++) {
            let btn = document.createElement('div')
            btn.innerText = renderDom[i].name;
            btn.style = nodeHandler.getGitlabStyle(renderDom[i].bgc, renderDom[i].color);
            obox.appendChild(btn)
            btn.addEventListener('click', (e) => {
                window.location.href = renderDom[i].url;
            })
        }
    },
    setCommonTokenNode: (display, id, onClick) => {
        // 根节点
        let box = document.getElementsByTagName("body")[0]
        // 大盒子
        let obox = document.createElement('div')
        obox.id = id;
        obox.style = `
             position: fixed;
             right: 0px;
             bottom: 0px;
             width: 80px;
             font-size: 14px;
             text-align: center;
             z-index: 9999;
             background: rgb(181, 181, 181);
             padding: 5px;
             box-sizing: border-box;
             border-radius: 5px;
             color: rgb(0, 7, 16);
             cursor: pointer;
             opacity: 0.5;
             display:${display};
            `
        box.appendChild(obox)
        // 按钮
        let btn = document.createElement('div')
        btn.innerText = "推送token";
        obox.appendChild(btn)
        btn.addEventListener('click', (e) => {
            onClick()
        })
    },
    setSwitchAdminNode: (display, id, onClick) => {
        // 根节点
        let box = document.getElementsByTagName("body")[0]
        // 大盒子
        let obox = document.createElement('div')
        obox.id = id;
        obox.style = `
             position: fixed;
             right: 100px;
             bottom: 0px;
             width: 80px;
             font-size: 14px;
             text-align: center;
             z-index: 9999;
             background: rgb(181, 181, 181);
             padding: 5px;
             box-sizing: border-box;
             border-radius: 5px;
             color: rgb(0, 7, 16);
             cursor: pointer;
             opacity: 0.5;
             display:${display};
            `
        box.appendChild(obox)
        // 按钮
        let btn = document.createElement('div')
        btn.innerText = "切换管理台";
        obox.appendChild(btn)
        btn.addEventListener('click', (e) => {
            onClick()
        })
    },
    setH5ToAdminNode: (display, id, onClick) => {
        // 根节点
        let box = document.getElementsByTagName("body")[0]
        // 大盒子
        let obox = document.createElement('div')
        obox.id = id;
        obox.style = `
             position: fixed;
             right: 85px;
             bottom: 0px;
             width: 80px;
             font-size: 14px;
             text-align: center;
             z-index: 9999;
             box-sizing: border-box;
             background: rgb(181, 181, 181);
             padding: 5px;
             border-radius: 5px;
             color: rgb(0, 7, 16);
             cursor: pointer;
             opacity: 0.5;
             display:${display};
            `
        box.appendChild(obox)
        // 按钮
        let btn = document.createElement('div')
        btn.innerText = "跳转B端";
        obox.appendChild(btn)
        btn.addEventListener('click', (e) => {
            onClick()
        })
    },
    // 设置大字模式盒子
    setPlanBigWordNode: (display, id, content) => {
        let pBox = document.getElementsByClassName("standard-page")[0];
        const style = `display: ${display};width:100%;background:#ffffff;box-sizing:border-box;padding:10px;margin-bottom:10px;border-radius: 5px;`
        const box = `<div id="${id}" style="${style}"><div style="width:100%;height:40px;line-height:40px;font-size:26px;color: red;font-weight: bold;">${content}</div></div>`;
        pBox.insertAdjacentHTML('afterbegin', box);
    },
    // 获取基础节点信息
    getNodeSwitchInfo: (fromMenu, menuName, targetName, type = 'id') => {
        const currentSwitchState = fromMenu ? !GM_getValue(menuName) : GM_getValue(menuName);
        const display = currentSwitchState ? "inline-block" : "none";
        let target = null;
        if (type === 'id') {
            target = document.getElementById(targetName);
        } else if (type === 'class') {
            target = document.getElementsByClassName(targetName);
        }
        return { display, target }
    },
    nextTick: (conditionNode = 'body', type = 'tag', cb, config = {
        maxCount: 30,
        interval: 500,
        checkOther: () => {
            return false
        }
    }) => {
        // 保证页面加载完毕后再执行，否则200ms轮询1次，最多10次
        let count = 0;
        const timer = setInterval(() => {
            if (type === 'tag' && document.getElementsByTagName(conditionNode)[0]) {
                console.log(`[xiaoe-menu] [v${version}] nextTick 已完成`)
                clearInterval(timer);
                cb()
            }
            if (type === 'class' && document.getElementsByClassName(conditionNode)[0]) {
                console.log(`[xiaoe-menu] [v${version}] nextTick 已完成`)
                clearInterval(timer);
                cb()
            }
            if (type === 'custom' && document.querySelectorAll(conditionNode)[0]) {
                console.log(`[xiaoe-menu] [v${version}] nextTick 已完成`)
                clearInterval(timer);
                cb()
            }
            if (type === 'other' && config.checkOther()) {
                console.log(`[xiaoe-menu] [v${version}] nextTick 已完成`)
                clearInterval(timer);
                cb()
            }
            if (count >= config.maxCount) {
                console.log(`[xiaoe-menu] [v${version}] nextTick超时，已停止轮询`)
                clearInterval(timer);
            }
            count++;
        }, config.interval)
    },
}

const menuCoreFunc = {
    [MENU_NAME.AGENT]: () => {
        agentHandler();
    },
    [MENU_NAME.GITLAB]: () => {
        gitlabHandler(true)
    },
    [MENU_NAME.SWITCH_UA]: () => {
        switchUaHandler(true);
    },
    [MENU_NAME.H5_DEBUG]: () => {
        switchH5DebugModeHandler(true);
    },
    [MENU_NAME.CODING_AUTO_EXTEND]: () => {
        codingAutoExtendHandler(true);
    },
    [MENU_NAME.CHANGE_ADMIN_VERSION]: () => {
        changeAdminVersion(true);
    },
    [MENU_NAME.H5_TO_ADMIN]: () => {
        h5ToAdminHandler(true);
    },
    [MENU_NAME.COMMON_TOKEN_SEND]: () => {
        commonTokenSendHandler(true);
    },
    [MENU_NAME.OPT_WARNING]: () => {
        optimizeWarningHandler(true);
    },
    [MENU_NAME.ADMIN_TEACHER_PAGE]: () => {
        adminTeacherPageHandler(true);
    },
    [MENU_NAME.COPY_LIVE_URL]: () => {
        adminCopyLiveUrlHandler(true);
    },
    [MENU_NAME.PLAN_BIG_WORD]: () => {
        planBigWordHandler(true);
    }
}

// 一键代理
function agentHandler() {
    if (!utils.isLivePc && !utils.isLiveH5) {
        toastHandler.showToast(`非H5或PC，不进行跳转`, 2500)
        return;
    }
    const replaceUrl = utils.isLiveH5 ? 'http://localhost:2929/next' : utils.isLivePc ? 'http://localhost:3939' : window.location.origin;
    toastHandler.showToast(`跳转中...`, 2500)
    GM_setValue(MENU_NAME.AGENT, false);
    setTimeout(() => {
        const originUrl = window.location.href;
        const url = window.location.href.replace(window.location.origin, replaceUrl);
        GM_setClipboard(originUrl)
        window.location.href = url;
    }, 1500)
    console.log(`[xiaoe-menu] [v${version}]一键代理`, 'ok')
}

// gitlab快捷入口
function gitlabHandler(fromMenu = false) {
    if (!utils.isGitlab) return
    const id = "gitlab-box";
    const { target, display } = nodeHandler.getNodeSwitchInfo(fromMenu, MENU_NAME.GITLAB, id)
    if (target) {
        // target样式设置隐藏
        target.style.display = display;
    } else {
        nodeHandler.setGitlabNode(display, id)
    }
    console.log(`[xiaoe-menu] [v${version}] gitlab快捷入口`, display === 'inline-block')
}

// H5扫码登录
function switchUaHandler(fromMenu = false) {
    if (!utils.isH5Login) return;
    const currentSwitchState = fromMenu ? !GM_getValue(MENU_NAME.SWITCH_UA) : GM_getValue(MENU_NAME.SWITCH_UA);
    const UA = {
        pc: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        // wechat: "Mozilla/5.0 (Linux; Android 6.0; NEM-AL10 Build/HONORNEM-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/043906 Mobile Safari/537.36 MicroMessenger/6.6.1.1220(0x26060133) NetType/WIFI Language/zh_CN"
    }
    const change = () => {
        if (currentSwitchState) {
            Object.defineProperty(navigator, 'userAgent', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: UA.pc
            });
            Object.defineProperty(navigator, 'appVersion', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: UA.pc
            });
        }
    }
    if (fromMenu) {
        change();
        setTimeout(() => {
            location.reload();
        }, 2000)
    } else {
        change();
    }
    console.log(`[xiaoe-menu] [v${version}] H5扫码登录`, currentSwitchState)
}

// H5调试模式
function switchH5DebugModeHandler(fromMenu = false) {
    if (!utils.isLiveH5) return;
    const currentSwitchState = fromMenu ? !GM_getValue(MENU_NAME.H5_DEBUG) : GM_getValue(MENU_NAME.H5_DEBUG);
    // 打开调试
    if (currentSwitchState && window.location.href.indexOf("&showVconsole") === -1) {
        setTimeout(() => {
            if (window.location.href.indexOf("showvconsole") !== -1) {
                window.location.href = window.location.href.replace("showvconsole", "showVconsole");
            } else {
                window.location.href = window.location.href + "&showVconsole";
            }
        }, 2000)
    }
    // 关闭调试
    if (!currentSwitchState && window.location.href.indexOf("&showVconsole") !== -1) {
        GM_setValue(MENU_NAME.H5_DEBUG, currentSwitchState);
        setTimeout(() => {
            window.location.href = window.location.href.replace("&showVconsole", "&showvconsole");
        }, 2000)
    }
    console.log(`[xiaoe-menu] [v${version}] H5调试模式`, currentSwitchState)
}

// coding自动展开描述
function codingAutoExtendHandler(fromMenu = false) {
    if (!utils.isCoding) return;
    const currentSwitchState = fromMenu ? !GM_getValue(MENU_NAME.CODING_AUTO_EXTEND) : GM_getValue(MENU_NAME.CODING_AUTO_EXTEND);
    if (!currentSwitchState) return;
    const className = 'toggle-btn-2NBDWyaTZ1';
    nodeHandler.nextTick(className, 'class', () => {
        document.querySelector(`.${className}`).click();
        toastHandler.showToast('内容已自动展开', 2500)
    }, {
        maxCount: 50,
        interval: 500
    })
}

// 管理台切换版本
function changeAdminVersion(fromMenu = false) {
    if (!utils.isAdmin) return;
    const id = "switch-admin-box";
    const { target, display } = nodeHandler.getNodeSwitchInfo(fromMenu, MENU_NAME.CHANGE_ADMIN_VERSION, id);
    if (target) {
        target.style.display = display;
    } else {
        nodeHandler.setSwitchAdminNode(display, id, () => {
            const currentVersion = unsafeWindow.GlobalState.get('managementVersion');
            const v = currentVersion === 2 ? 1 : 2;
            GM_setClipboard(window.location.href)
            toastHandler.showToast(`切换管理台：${currentVersion}.0 -> ${v}.0，当前链接已复制`, 2500)
            setTimeout(() => {
                GM_setValue(MENU_NAME.CHANGE_ADMIN_VERSION, true);
                unsafeWindow.switchNewManage(v);
            }, 1000)
        })
    }
    console.log(`[xiaoe-menu] [v${version}] 管理台切换版本`, display === 'inline-block')
}

// 发送通用token
function sentCommonToken() {
    let data = null;
    // H5、PC讲师
    if (utils.isLiveH5 || utils.isLiveRoomTeacher) {
        const token = utils.getCookie("ko_token");
        data = utils.getMarkdownContent("live-h5", {
            "url": window.location.origin,
            'app_id': unsafeWindow.APPID,
            'user_id': unsafeWindow.USERID,
            "ko_token": token
        })
    }
    // PC学员
    if (utils.isLivePc) {
        const userInfo = utils.getCookie("userInfo")
        const pc_user_key = (userInfo && JSON.parse(userInfo).pc_user_key);
        data = utils.getMarkdownContent("live-pc", {
            "pc_user_key": pc_user_key
        })
    }
    // 管理台
    if (utils.isAdmin) {
        const adminKey = utils.getAdminTokenKey()
        const adminToken = utils.getCookie(adminKey);
        const app_id = utils.getCookie("with_app_id");
        data = utils.getMarkdownContent("live-admin", {
            "type": 'live-admin',
            "admin_token": adminToken,
            "app_id": app_id,
            "koken_type": adminKey
        })
    }
    utils.requestApi(COMMON_TOKEN_URL, data).then(res => {
        toastHandler.showToast('已推送', 2500)
    }).catch((err) => {
        toastHandler.showToast('推送失败，请检查', 2500)
    })
    console.log(`[xiaoe-menu] [v${version}] 发送通用token`, data)
}

// 推送通用token
function commonTokenSendHandler(fromMenu = false) {
    if (!utils.isLiveH5 && !utils.isLiveRoomTeacher && !utils.isLivePc && !utils.isAdmin) return;
    const id = "common-token-box";
    const { target, display } = nodeHandler.getNodeSwitchInfo(fromMenu, MENU_NAME.COMMON_TOKEN_SEND, id);
    if (target) {
        target.style.display = display;
    } else {
        nodeHandler.setCommonTokenNode(display, id, sentCommonToken)
    }
    console.log(`[xiaoe-menu] [v${version}] 推送通用token`, display === 'inline-block')
}

// H5直达B端管理台
function h5ToAdminHandler(fromMenu = false) {
    if (!utils.isLiveH5) return;
    const id = "h5-to-admin-box";
    const { target, display } = nodeHandler.getNodeSwitchInfo(fromMenu, MENU_NAME.H5_TO_ADMIN, id);
    if (target) {
        target.style.display = display;
    } else {
        nodeHandler.setH5ToAdminNode(display, id, () => {
            const env = utils.getEnv(window.location.href)
            const baseUrlMap = {
                'prod': 'https://admin.xiaoe-tech.com',
                'inside': 'https://admin.inside.xiaoe-tech.com',
                'test': 'https://admin.test.xiaoe-tech.com',
            }
            const url = `${baseUrlMap[env]}/t/live#/detail?id=${unsafeWindow.ALIVEID}&tab=teacherSettings`
            window.open(url, '_blank')
        })
    }
    console.log(`[xiaoe-menu] [v${version}] H5直达B端管理台`, display === 'inline-block')
}

// 优化警示框
function optimizeWarningHandler(fromMenu) {
    if (!utils.isAdmin) return;
    const currentSwitchState = fromMenu ? !GM_getValue(MENU_NAME.OPT_WARNING) : GM_getValue(MENU_NAME.OPT_WARNING);
    const animationArr = ['glow .4s ease-out infinite alternate;', 'none']
    const borderArr = ['10px solid', '10px solid green']
    nodeHandler.nextTick('base_content', 'class', () => {
        const baseContentDom = document.getElementsByClassName('base_content')[0];
        // 存在这玩意说明是通过O端进的管理台
        if (baseContentDom.classList.contains('flicker')) {
            // 颜色选择器：https://www.sojson.com/web/panel.html
            baseContentDom.style.border = borderArr[+currentSwitchState]
            baseContentDom.style.animation = animationArr[+currentSwitchState]
        }
    })
    console.log(`[xiaoe-menu] [v${version}] 优化警示框`, currentSwitchState)
}

// 管理台直达添加讲师页面
function adminTeacherPageHandler(fromMenu) {
    if (!utils.isAdmin) return;
    const currentSwitchState = fromMenu ? !GM_getValue(MENU_NAME.ADMIN_TEACHER_PAGE) : GM_getValue(MENU_NAME.ADMIN_TEACHER_PAGE);
    if (currentSwitchState && window.location.href.indexOf('tab=basicInfo') !== -1) {
        window.location.href = window.location.href.replace('tab=basicInfo', 'tab=teacherSettings')
    }
    console.log(`[xiaoe-menu] [v${version}] 管理台直达添加讲师页面`, currentSwitchState)
}

// 快速复制直播链接
function adminCopyLiveUrlHandler(fromMenu) {
    if (!utils.isAdmin) return;
    const className = 'copy-live-from-admin';
    const pBoxName = '.ss-table__fixed .ss-table__fixed-body-wrapper tbody .ss-table__row .infoImgOptions';
    // 分享弹窗点击
    const shareModalHandle = () => {
        const modalName = 'ss-shareModal';
        nodeHandler.nextTick(modalName, 'class', () => {
            setTimeout(() => {
                const modalDom = document.getElementsByClassName('ss-shareModal')[0]
                const copyBtn = modalDom.querySelector('.ss-change-btn.ss-copyHref');
                copyBtn.click();
                modalDom.click();
            }, 100)
        }, {
            maxCount: 50,
            interval: 100
        })
    }
    // 渲染点击按钮
    const renderCopyBtn = () => {
        nodeHandler.nextTick(pBoxName, 'custom', () => {
            const pboxArr = document.querySelectorAll(pBoxName);
            pboxArr.forEach((pbox, index) => {
                const copyDiv = `<div class="${className}" style="position: absolute; width: 100%; height: 100%;color: white; display:flex; justify-content: center; align-items:center;cursor:pointer;z-index: 9999;">复制链接</div>`;
                pbox.insertAdjacentHTML('beforeend', copyDiv);
                const copyDivElement = pbox.querySelector('.copy-live-from-admin');
                copyDivElement.addEventListener('click', function () {
                    const shareModal = document.querySelectorAll('.ss-table__fixed-right .ss-table__fixed-body-wrapper tbody .ss-table__row')[index].children[10].getElementsByTagName('button')[3]
                    console.log('===> shareModal', shareModal)
                    if (!shareModal) {
                        toastHandler.showToast('这个直播没有分享弹窗！', 1500)
                    } else {
                        shareModal.click();
                        shareModalHandle();
                    }
                });
            });
        });
    }
    // 处理翻页按钮
    const addPageBtnEvent = () => {
        const className = 'ss-pagination-warpper'
        nodeHandler.nextTick(className, 'class', () => {
            const target = document.getElementsByClassName(className)[0];
            // 添加点击事件处理程序
            target.addEventListener('click', function () {
                renderCopyBtn();
            });
        })
    }
    // 开关处理
    const { target, display } = nodeHandler.getNodeSwitchInfo(fromMenu, MENU_NAME.COPY_LIVE_URL, className, 'class');
    if (target.length !== 0) {
        for (let item of target) {
            item.style.display = display === 'inline-block' ? 'flex' : 'none';
        }
    } else {
        renderCopyBtn();
        addPageBtnEvent();
    }
}

// 计划列表大字模式
function planBigWordHandler(fromMenu) {
    if (!utils.isOps) return;
    const id = "big-word-box";
    const { target, display } = nodeHandler.getNodeSwitchInfo(fromMenu, MENU_NAME.PLAN_BIG_WORD, id)
    if (target) {
        // target样式设置隐藏
        target.style.display = display;
    } else {
        nodeHandler.nextTick('', 'other', () => {
            const time = document.querySelectorAll('.base-table .el-table__row')[1].children[1].querySelector('.value').innerHTML;
            const formatTime = utils.getTimeAgo(time);
            const carType = document.querySelectorAll('.base-table .el-table__row')[1].children[3].querySelector('.value').innerHTML;
            const carName = document.querySelectorAll('.base-table .el-table__row')[0].children[1].querySelector('.value').innerHTML;
            const content = `【${carType}】${carName}${formatTime}`;
            nodeHandler.setPlanBigWordNode(display, id, content)
        }, {
            maxCount: 30,
            interval: 500,
            checkOther: () => {
                let check = document.querySelectorAll('.base-table .el-table__row')[0]?.children[1]?.querySelector('.value')?.innerHTML;
                return check && check !== 'plan_name is undefined';
            }
        })
    }
    console.log(`[xiaoe-menu] [v${version}] 计划列表大字提示`, display === 'inline-block')
}

function startAll() {
    switchUaHandler();
    adminTeacherPageHandler();
    nodeHandler.nextTick('body', 'tag', () => {
        toastHandler.create();
        gitlabHandler();
        commonTokenSendHandler();
        h5ToAdminHandler();
        codingAutoExtendHandler();
        changeAdminVersion();
        adminCopyLiveUrlHandler();
        switchH5DebugModeHandler();
        optimizeWarningHandler();
        planBigWordHandler();
    })
}

(function () {
    // 初始化开关
    initCacheMenuState()
    // 注册菜单
    registerMenuCommand();
    // 启动
    startAll()
})();