// ==UserScript==
// @name         🚫🔞 防沉迷终结者 🕺🎮

// @description  [❤️支持全面] 支持 4399 (部分网页游戏到点不踢)，7k7k，17yy，37，9377，游戏狗，u7u9，7724，07073，4366 [😱别怕大人] 大人来了就按"大人键" [🕶 手动破解] 防沉迷破解不成功? 对着防沉迷弹窗按快捷键 [😵‍💫万能规则] 误杀率高, 几乎没卵用的功能

// @namespace    https://fcmsb250.github.io/
// @version      5.0.0
// @icon         https://dsy4567.github.io/logo.svg
// @author       dsy4567 https://greasyfork.org/zh-CN/users/822325 | https://github.com/dsy4567
// @run-at       document-start
// @license      GPL-3.0

// @compatible   firefox firefox + tampermonkey 测试通过
// @compatible   chrome  chrome/360安全浏览器 + tampermonkey 测试通过
// @compatible   edge    edge + tampermonkey 测试通过

// @match        *://*.17yy.com/*
// @match        *://*.4399.com/*
// @match        *://*.7k7k.com/*
// @match        *://*.aiwan4399.com/*
// @match        *://*.iwan4399.com/*
// @match        *://*.zxwyouxi.com/*
// @match        *://*.5054399.net/*
// @match        *://*.5054399.com/*
// @match        *://h5.07073.com/*
// @match        *://*.7724.com/*
// @match        *://*.u7u9.com/*
// @match        *://*.9377.com/*
// @match        *://*.37.com/*
// @match        *://*.4366.com/*

// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow

// @homepageURL  https://fcmsb250.github.io/
// @supportURL   https://github.com/dsy4567/Fucking-Anti-Indulgence/

// @downloadURL https://update.greasyfork.org/scripts/437233/%F0%9F%9A%AB%F0%9F%94%9E%20%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%20%F0%9F%95%BA%F0%9F%8E%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/437233/%F0%9F%9A%AB%F0%9F%94%9E%20%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%20%F0%9F%95%BA%F0%9F%8E%AE.meta.js
// ==/UserScript==

"use strict";
let D = new Date();

function setValue(value, defaultValue, callback) {
    if (GM_getValue(value, defaultValue) == "1") {
        GM_setValue(value, "0");
    } else if (GM_getValue(value, defaultValue) == "0") {
        GM_setValue(value, "1");
    } else {
        GM_setValue(value, defaultValue);
    }
    if (callback) {
        callback();
    }
}
function initStorage(value, defaultValue, callback) {
    if (GM_getValue(value, null) == null) {
        GM_setValue(value, defaultValue);
    }
    if (callback) {
        callback();
    }
}
function checkValue(value) {
    if (GM_getValue(value) == "1") {
        return "✅已启用 ";
    } else if (GM_getValue(value) == "0") {
        return "❌已停用 ";
    } else {
        return "⚠️配置错误 ";
    }
}
/** @returns {HTMLCanvasElement | HTMLScriptElement | HTMLIFrameElement} */
function qs(selector) {
    return document.querySelector(selector);
}
/** @returns {(HTMLCanvasElement | HTMLScriptElement | HTMLIFrameElement)[]} */
function qsa(selector) {
    return document.querySelectorAll(selector);
}

initStorage("安装日期", String(Math.floor(D.getTime() / 1000 / 60 / 60 / 24)));
initStorage("停用快捷键", "0");
initStorage("开发环境", "0");

var daysUsed =
    Math.ceil(D.getTime() / 1000 / 60 / 60 / 24) -
    Number(GM_getValue("安装日期"));
let pageLoaded = false;
let popupStyle = { remove: () => {} };
let lastMenuId = 0;
let realAddress_17yy = "";
/** @type {Function} */
let _playLoading;
let devConfig = {};
let succeeded = false;
let gamePlatform = "";

const locationHref = location.href;
const host = location.host;
const pathname = location.pathname;
const U = new URL(location.href);

if (GM_getValue("开发环境") == "1") {
    devConfig.EnableConsoleOutput = 1;
    devConfig.EnableDebugging = 1;
    // devConfig.DisableAutomaticCracking = 1;
    devConfig.exportVariables = 1;
} else {
    devConfig.EnableConsoleOutput = 0;
    devConfig.EnableDebugging = 0;
    devConfig.DisableAutomaticCracking = 0;
    devConfig.exportVariables = 0;
}

(() => {
    const a = host.split(".");
    for (let i = 0; i < a.length; i++) {
        const ss = a[i];
        if (ss === "com" || ss === "cn") {
            gamePlatform = a[i - 1];
            break;
        }
    }
})();

const /** @type {Record<string, (() => void)[]>} */ rules = {
        4399: [
            // 使防沉迷尝试读取某些全局变量时报错
            // https://www.4399.com/flash/223745_2.htm
            () => {
                Object.defineProperty(unsafeWindow, "smevent", {
                    value: null,
                    writable: false,
                });
                Object.defineProperty(unsafeWindow, "PageWebApiSdk", {
                    value: null,
                    writable: false,
                });
                Object.defineProperty(unsafeWindow, "getBizid", {
                    value: null,
                    writable: false,
                });
            },
            // https://h.4399.com/zzy/236117.htm
            () => {
                if (
                    host !== "h.4399.com" ||
                    (host === "h.4399.com" && !pathname.includes("/play/"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["4399 手机端防沉迷"]);

                const url = unsafeWindow.webServer + unsafeWindow.gameiframe;
                if (url && unsafeWindow.webServer && unsafeWindow.gameiframe) {
                    succeeded = 1;
                    location.href = url;
                }
            },
            // https://www.4399.com/flash/209443.htm
            () => {
                if (
                    host !== "h.api.4399.com" ||
                    (host === "h.api.4399.com" && pathname !== "/g.php")
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["4399 h5页游防沉迷(h.api.4399.com/g.php)"]);

                const gameId = U.searchParams.get("gameId");
                if (!gameId) return;
                fetch("https://h.api.4399.com/intermodal/user/grant2", {
                    method: "POST",
                    body: `gameId=${gameId}&authType=cookie&cookieValue=${getMiddleString(
                        "Pauth=",
                        ";",
                        document.cookie
                    )}`,
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                })
                    .then(res => res.json())
                    .then(resp => {
                        log([resp]);
                        if (resp.data.game.gameUrl)
                            location.href = resp.data.game.gameUrl;
                        else throw new Error("[防沉迷终结者] gameUrl 为空");
                    })
                    .catch(err => console.error(err));
                succeeded = 1;
            },
        ],

        // 4399 在线玩
        zxwyouxi: [
            // https://www.zxwyouxi.com/g/100057159
            () => {
                if (
                    host !== "www.zxwyouxi.com" ||
                    (host === "www.zxwyouxi.com" && !pathname.startsWith("/g/"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["4399 h5页游防沉迷(www.zxwyouxi.com/g/)"]);

                fetch("https://h.api.4399.com/intermodal/user/grant2", {
                    method: "POST",
                    body: `gameId=${getMiddleString(
                        "/g/",
                        "",
                        locationHref,
                        "3"
                    )}&authType=token&userId=${getMiddleString(
                        "4399_HTML5_PREVIEW_USERID=",
                        ";",
                        document.cookie
                    )}&accessToken=${getMiddleString(
                        "HTML5_ACCESS_TOKEN=",
                        ";",
                        document.cookie
                    )}`,
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                })
                    .then(res => res.json())
                    .then(resp => {
                        log([resp]);
                        if (resp.data.game.gameUrl)
                            location.href = resp.data.game.gameUrl;
                        else throw new Error("[防沉迷终结者] gameUrl 为空");
                    })
                    .catch(err => console.error(err));
                succeeded = 1;
            },
        ],
        "7k7k": [
            // http://www.7k7k.com/swf/205652.htm
            () => {
                if (!unsafeWindow.play22) return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["7k7k防沉迷"]);

                unsafeWindow.play22.playLoading();
                if (!_playLoading) {
                    _playLoading = unsafeWindow.play22.playLoading;
                }
                unsafeWindow.play22.playLoading = () => {}; // 防止重复调用
                succeeded = 1;
            },
            // http://m.7k7k.com/flash/205652.htm
            () => {
                if (
                    host !== "m.7k7k.com" ||
                    (host === "m.7k7k.com" &&
                        !pathname.includes("/flash/") &&
                        host === "m.7k7k.com" &&
                        !pathname.includes("/swf/"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["7k7k手机端防沉迷"]);

                unsafeWindow.open = null;
                const f = () => {
                    removeListeners("div.gameInfo_begin.jsbegin");
                    qs("div.gameInfo_begin.jsbegin").addEventListener(
                        "click",
                        () =>
                            fetch(unsafeWindow.gameInfo.gameUrl)
                                .then(res => res.text())
                                .then(html => {
                                    location.href = getMiddleString(
                                        'gameUrl: "',
                                        '",',
                                        html,
                                        "1"
                                    );
                                })
                    );
                };
                pageLoaded ? f() : addEventListener("DOMContentLoaded", f);
                succeeded = 1;
            },
            // http://h5.7k7k.com/mb/mb2/5b5dd7da8ad23b748f9ea32a7a3cedfa.html?gid=f5c4dbf7fb41d89d76a333332f33f853&tid=94606&qs=1
            () => {
                if (
                    host !== "m.7k7k.com" ||
                    (host === "m.7k7k.com" &&
                        !pathname.includes("/web/H5GAMES.html"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["7k7k h5页游防沉迷"]);

                fetch(
                    `//h5.7k7k.com/api_redirect/game/start/?client=0&account=${getMiddleString(
                        "userid=",
                        ";",
                        document.cookie,
                        "2"
                    )}&appkey=${getMiddleString(
                        "gid=",
                        "&",
                        locationHref,
                        "2"
                    )}&uid=${getMiddleString(
                        "userid=",
                        ";",
                        document.cookie,
                        "2"
                    )}&tid=${getMiddleString("tid=", "&", locationHref, "2")}`
                )
                    .then(res => res.json())
                    .then(json => {
                        location.href = json.url;
                    });
                succeeded = 1;
            },
            () => {
                if (
                    !host.includes("h5.7k7k.com") ||
                    (host.includes("h5.7k7k.com") &&
                        !pathname.includes("/game/"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["7k7k h5页游(手机端)防沉迷"]);

                fetch(
                    `//h5.7k7k.com/api_redirect/game/start/?client=0&account=${getMiddleString(
                        "userid=",
                        ";",
                        document.cookie,
                        "2"
                    )}&appkey=${unsafeWindow.gid[0]}&uid=${getMiddleString(
                        "userid=",
                        ";",
                        document.cookie,
                        "2"
                    )}&tid=${unsafeWindow.tid}`
                )
                    .then(res => res.json())
                    .then(json => {
                        location.href = json.url;
                    });
                succeeded = 1;
            },
        ],
        "17yy": [
            // https://www.17yy.com/f/play/246085.html
            // https://www.17yy.com/f/play/246568.html
            () => {
                if (
                    host !== "www.17yy.com" ||
                    (host === "www.17yy.com" && !pathname.startsWith("/f/play"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["17yy防沉迷"]);

                try {
                    if (qs("#flashgame").src === realAddress_17yy) return;
                } catch (e) {}
                try {
                    if (qs("#flash_frame").src === realAddress_17yy) return;
                } catch (e) {}

                fetch("//www.17yy.com/e/payapi/vip_ajax.php", {
                    method: "POST",
                    body: `action=getStatus&id=${getMiddleString(
                        "/f/play/",
                        ".html",
                        locationHref,
                        "3"
                    )}`,
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                })
                    .then(res => res.json())
                    .then(resp => {
                        try {
                            qs("#flashgame").src = realAddress_17yy =
                                "//" +
                                unsafeWindow.server +
                                "/" +
                                unsafeWindow.classes +
                                "/" +
                                unsafeWindow.date +
                                "/" +
                                resp.data.game_path;
                        } catch (e) {}
                        try {
                            qs("#flash_frame").src = realAddress_17yy =
                                "//" +
                                unsafeWindow.server +
                                "/" +
                                unsafeWindow.classes +
                                "/" +
                                unsafeWindow.date +
                                "/" +
                                resp.data.game_path;
                        } catch (e) {}
                    });
                succeeded = 1;
            },
        ],
        7724: [
            // https://www.7724.com/XuanCaiTuXing/
            () => {
                if (
                    host !== "i.7724.com" ||
                    (host === "i.7724.com" &&
                        !locationHref.includes("/user/danjilogin?url="))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["7724防沉迷"]);

                let url = getMiddleString(
                    "danjilogin?url=",
                    undefined,
                    locationHref,
                    "1"
                );
                location.href = url;
                succeeded = 1;
            },
        ],
        4366: [
            // http://wvw.4366.com/game_login.php?game=bscq&server=new
            () => {
                if (
                    !host.includes("wvw.4366.com") ||
                    (host.includes("wvw.4366.com") &&
                        !pathname.includes("/game_login.php"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["4366防沉迷"]);

                fetch(locationHref)
                    .then(res => res.text())
                    .then(html => {
                        let url = getMiddleString(
                            'align="left" id="iframe" src="',
                            '" name="mainFrame" scrolling="auto"',
                            html,
                            "1"
                        );
                        location.href = url;
                    });
                succeeded = 1;
            },
        ],
        37: [
            // https://game.37.com/server_list_901.html
            () => {
                if (
                    !host.includes("game.37.com") ||
                    (host.includes("game.37.com") &&
                        !pathname.includes("/play.php"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["37防沉迷"]);

                fetch(locationHref)
                    .then(res => res.text())
                    .then(html => {
                        let url = getMiddleString(
                            'src="//gameapp.37.com/controller/enter_game.php',
                            '" id="mainFrame"',
                            html,
                            "1",
                            "//gameapp.37.com/controller/enter_game.php"
                        );
                        location.href = url;
                    });
                succeeded = 1;
            },
        ],
        9377: [
            // http://www.9377.com/bscq/
            () => {
                if (
                    !host.includes("wvw.9377.com") ||
                    (host.includes("wvw.9377.com") &&
                        !pathname.includes("/game_login.php"))
                )
                    return;

                if (devConfig.EnableDebugging) {
                    debugger;
                }

                log(["9377防沉迷"]);

                fetch(locationHref)
                    .then(res => res.text())
                    .then(html => {
                        let url = getMiddleString(
                            'id="iframe" src="',
                            '" name="mainFrame" scrolling="auto"',
                            html,
                            "1"
                        );
                        location.href = url;
                    });
                succeeded = 1;
            },
        ],
    };
const blackList = [
    "#addiv",
    "#anti-indulge",
    "#anti-indulge-prompt",
    "#Anti_mask",
    "#Anti_open",
    "#app > div > div.cover.splash",
    "#chCoverDiv",
    "#codepop6",
    "#cover",
    "#div_dialog",
    "#easyDialogBox",
    "#fcmIframe",
    "#Guide",
    "#loginCertify",
    "#messageBox",
    "#overlay",
    "#page_wallpaper > div.xiaowei.xiaowei-orange > div.xw-left > div.xw-game > div.xw-top > div > div",
    "#pop2",
    "#pusher",
    "#shadow",
    "#swfdiv > div.box",
    "#tc100",
    "#yx_log",

    ".codegs",
    ".cmMask",
    ".fixedModal",
    ".mask",
    ".play_load",
    ".popup-c",
    ".realName",
    ".sdkDialog",
    ".toolDialog",
    ".ui-forbidden",
    ".webtipss",

    "body > div.show_box.popup_bg",
    "div[style*='z-index: 99999']",
];

/**
 * 为某个字符串获取两个字符串中间的字符串(不包括那两个字符串)
 * @param {String} begin
 * @param {String} end (可以是空字符串)
 * @param {String} target
 * @param {String | undefined} type "1": 网址, "2": 字母 + 数字, "3": 数字 (可选)
 * @param {String | undefined} append 在匹配到字符串, 判断字符串类型之前, 给匹配到的字符串前面追加指定的字符串 (可选)
 * @returns {String}
 */
function getMiddleString(begin, end, target, type, append) {
    target = target.substring(target.indexOf(begin) + begin.length);
    if (end) {
        target = decodeURI(target.substring(0, target.indexOf(end)));
    }
    if (append) {
        target = append + target;
    }
    switch (type) {
        case "1":
            if (!(/^https?:\/\//gi.test(target) || target.startsWith("//"))) {
                throw new Error("[防沉迷终结者] 不正确的字符串类型");
            }
            break;
        case "2":
            if (!/^[0-9a-zA-Z]*$/g.test(target)) {
                throw new Error("[防沉迷终结者] 不正确的字符串类型");
            }
            break;
        case "3":
            if (isNaN(Number(target))) {
                throw new Error("[防沉迷终结者] 不正确的字符串类型");
            }
            break;

        default:
            break;
    }
    return target;
}

function removeListeners(selector) {
    qsa(selector).forEach(oldElement => {
        const newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement, oldElement);
    });
}

function capitalizeFirstLetter(str) {
    str = str[0].toUpperCase() + str.substring(1, str.length);
    return str;
}

/** @param {any[]} data */
function log(data) {
    if (devConfig.EnableConsoleOutput)
        console.log("[防沉迷终结者]", ...data, locationHref);
}

function useGeneralRules() {
    const idOrClassNameOfGame = [
        "flash",
        "game",
        "play",
        "youxi",
        "swf",
        "flash",
    ];
    const idOrClassNameOfAnti = [
        "anti",
        "fcm",
        "verify",
        "mask",
        "certify",
        "dialog",
        "popup",
        "login",
        "cover",
    ];
    let temp = [];
    let style = "";

    idOrClassNameOfGame.forEach(str => {
        temp.push(
            "iframe[id*='" + str + "'],",
            "iframe[class*='" + str + "'],",
            "iframe[id*='" + str.toUpperCase() + "'],",
            "iframe[class*='" + str.toUpperCase() + "'],",
            "iframe[id*='" + capitalizeFirstLetter(str) + "'],",
            "iframe[class*='" + capitalizeFirstLetter(str) + "'],"
        );
    });
    temp.forEach(str => {
        style += str;
    });
    style += `#qwqawaqaq
            {
                display: block !important;
                left: 0 !important;
                top: 0 !important;
                position: absolute !important;
                z-index: 999999 !important;
            }`;
    temp = [];

    idOrClassNameOfAnti.forEach(str => {
        temp.push(
            "[id*='" + str + "'],",
            "[class*='" + str + "'],",
            "[id*='" + str.toUpperCase() + "'],",
            "[class*='" + str.toUpperCase() + "'],",
            "[id*='" + capitalizeFirstLetter(str) + "'],",
            "[class*='" + capitalizeFirstLetter(str) + "'],"
        );
    });
    temp.forEach(str => {
        style += str;
    });
    style += `#qwqawaqaq
            {
                display: none !important;
                min-width: 0 !important;
                width: 0 !important;
                max-width: 0 !important;
                min-height: 0 !important;
                height: 0 !important;
                max-height: 0 !important;
                z-index: -999 !important;
                font-size: 0 !important;
                overflow: hidden !important;
            }`;
    temp = [];

    GM_addStyle(style);
}

function registerMenuCommand() {
    const menus = [
        [
            "⚠️沉迷于游戏不利于身心健康,请合理安排游戏时间,适度游戏⚠️",
            undefined,
            undefined,
        ],
        ["❤️您已尽情欢乐" + daysUsed + "天", undefined, undefined],
        [
            "👉再次破解(alt +  鼠标中键)",
            () => {
                succeeded = 0;
                if (_playLoading) {
                    unsafeWindow.play22.playLoading = _playLoading;
                }
                crackAnti();
                removeMask();
            },
            undefined,
        ],
        [
            "👉大人来了(shift + 鼠标中键)(解除请使用再次破解)",
            () => {
                hideGame();
            },
            undefined,
        ],
        [
            "👉手动破解(鼠标指向防沉迷弹窗, 然后按 shift + alt + 鼠标右键)",
            () => {
                alert("请将鼠标指向防沉迷弹窗, 然后按 shift + alt + 鼠标右键");
            },
            undefined,
        ],
        [
            "👉万能规则(不保证实用性)",
            () => {
                GM_setValue("使用万能规则", Math.random());
            },
            undefined,
        ],
        [
            checkValue("停用快捷键") + " 停用快捷键",
            () => {
                setValue("停用快捷键", "0", () => {
                    registerMenuCommand();
                });
            },
            undefined,
        ],
        [
            "👍 给个好评/📝 反馈问题",
            () => {
                GM_openInTab(
                    "https://greasyfork.org/zh-CN/scripts/437233/feedback"
                );
            },
            undefined,
        ],
        [
            "⛔解决访问错误",
            () => {
                location.href = location.href;
            },
            undefined,
        ],
        [
            "⛔7k7k强制登录",
            () => {
                location.href =
                    "http://www.7k7k.com/swf/204220.htm#fai-doLogin";
            },
            undefined,
        ],
    ];
    lastMenuId = lastMenuId || 0;

    // TM
    for (
        let menuId = lastMenuId - menus.length * 2;
        menuId < lastMenuId + menus.length * 2;
        menuId++
    ) {
        GM_unregisterMenuCommand(menuId);
    }

    // VM
    menus.forEach(menu => {
        GM_unregisterMenuCommand(menu[0]);
    });
    GM_unregisterMenuCommand("✅已启用 停用快捷键");
    GM_unregisterMenuCommand("❌已停用 停用快捷键");
    GM_unregisterMenuCommand("⚠️配置错误 停用快捷键");

    menus.forEach(menu => {
        const displayName = menu[0];
        const func = menu[1];
        const accessKey = menu[2];

        lastMenuId = GM_registerMenuCommand(displayName, func, accessKey);
    });
}

function hideGame() {
    log(["大人来了"]);
    try {
        popupStyle.remove();
        log(["已去除样式"]);
    } catch (err) {}

    popupStyle = GM_addStyle(
        '*{margin:0;padding:0}ul{list-style:none;}.fl{float:left;}.fr{float:right;}.mysdkDialog{position:absolute;left:50%;top:50vh;margin:-210px 0 0 -309px;width:618px;z-index:20020}.mysdkDialog .myfcmdialog{color:black;position:absolute;left:0;top:0;width:620px;padding-bottom:30px;font-family:"microsoft yahei";font-size:14px;background:#fff;border-radius:8px;}.mysdkDialog .myfcmdialog .close-btn{position:absolute;right:0;top:0;width:40px;height:40px;background-color:red;line-height:40px;cursor:pointer;display:none}.mysdkDialog .myfcmdialog .title{line-height:30px;text-align:center;font-size:22px;font-weight:700;padding:25px 0 0;margin:0 40px;color:#454545;border:0;height:auto;float:none;width:auto;text-indent:0;}.mysdkDialog .myfcmdialog .stitle{text-align:left;line-height:1.6;margin:15px 40px 0;font-size:16px;}.mysdkDialog .myfcmdialog .stitle span{color:#ffa92d;}.mysdkDialog .myfcmdialog .mod-tip{margin:20px 40px 0;background:#F0F0F0;padding:12px 15px;border-radius:4px;color:#333;text-align:left}.mysdkDialog .myfcmdialog .tip-title{font-size:16px;font-weight:400;}.mysdkDialog .myfcmdialog .tip-info{margin-top:5px;line-height:26px;font-size:14px;}.mysdkDialog .myfcmdialog .tip-info li{font-size:16px;line-height:26px}.mysdkDialog .myfcmdialog .tip-info a{color:#FAA61B;text-decoration:underline;margin:0 4px;cursor:pointer;}.mysdkDialog .myfcmdialog .mod-btn{text-align:center;font-size:0;line-height:0;margin:25px 40px 0;}.mysdkDialog .myfcmdialog .mod-btn .btn-fcmprimary{display:inline-block;width:140px;height:38px;line-height:38px;border:1px solid #69bb01;color:#69bb01;font-size:14px;margin:0 15px;border-radius:5px;cursor:pointer;}.mysdkDialog .myfcmdialog .mod-btn .fr,.mysdkDialog .myfcmdialog .mod-btn .fl{width:250px;margin:0;}.mysdkDialog .myfcmdialog .mod-btn .btn-fcmprimary:hover{-webkit-filter:brightness(1);filter:brightness(1)}.mysdkDialog .myfcmdialog .mod-btn .btn-identity{background-color:#69bb01;color:#f8ffef}.fcmIframe{position:absolute;left:50%;top:270px;margin:0 0 0 -309px;width:618px;height:354px;z-index:2019;border:0 none;background-color:#000}.countDown{background:#eee;border-radius:3px;padding:10px;text-align:center;margin:20px 40px 0;font-size:16px;color:#666}.countDown .txt1{font-size:16px;height:28px;line-height:28px;color:#717171;}.countDown .txt2{height:40px;line-height:40px;font-size:26px;font-weight:bold;color:#54ba3d;}.mycmMask{display:none;width:100%;position:absolute;left:0;top:0;background:rgb(0,0,0);}'
    );
    const popup = document.createElement("div");
    popup.className = "mysdkDialog";
    popup.innerHTML +=
        '<div class="myfcmdialog"><span class="close-btn">关闭</span><h2 class="title">未成年限制登录提醒</h2><div class="stitle">您使用的是未成年账号，仅周五、周六、周日及法定节假日晚上8:00-9:00可以游戏！当前已被限制！</div><div class="countDown" style=""><p class="txt1">下次可玩游戏时段</p><p class="txt2">本周五晚上8:00-9:00</p></div><div class="countDown" style="display:none">当前已限制游戏</div><div class="mod-tip" style=""><h3 class="tip-title">温馨提示：</h3><ul class="tip-info">1.如果身份信息有误，请点击<a href="https://u.4399.com/profile/realname-bizId-1199006632.html" target="_blank">》》申请修改《《</a><br>2.如果您身份信息已经变动，可点击<a target="_self" href="#">》》刷新身份《《</a></ul></div><div class="mod-btn" style=""><span class="btn-fcmprimary">更换账号</span><span class="btn-fcmprimary">确定</span></div></div>';
    document.body.appendChild(popup);
    const mask = document.createElement("div");
    mask.className = "mycmMask";
    mask.style.cssText =
        "height: " +
        document.documentElement.offsetHeight +
        "px; z-index: 9999; display: block";
    mask.innerHTML = "";
    document.body.appendChild(mask);
}

function crackAnti() {
    let /** @type {(() => void)[]} */ rule;
    Object.keys(rules).forEach(ruleName => {
        if (gamePlatform.includes(ruleName)) rule = rules[ruleName];
    });
    if (succeeded || !rule) {
        return log(["破解被取消或未匹配规则"]);
    }

    const begin = new Date().getTime();

    for (const func of rule) {
        try {
            func();
            if (succeeded) break;
        } catch (e) {
            console.error(e);
        }
    }

    log(["破解结束, 用时" + (new Date().getTime() - begin) + "ms"]);
}

function removeMask() {
    try {
        for (let i = 0; i < blackList.length; i++) {
            const element = blackList[i];
            qsa(element)?.forEach(el => {
                el.remove();
                log(["-破解成功- " + element]);
            });
        }

        [".mycmMask", ".myfcmdialog", ".mysdkDialog"].forEach(element => {
            qsa(element)?.forEach(el => {
                el.remove();
                log(["-解除大人来了成功- " + element]);
            });
        });

        try {
            popupStyle.remove();
            log(["已去除样式"]);
        } catch (err) {}
    } catch (err) {
        console.error(err);
    }
}

// 添加加样式表
if (!devConfig.DisableAutomaticCracking) {
    let css = "";
    for (let i = 0; i < blackList.length; i++) {
        const element = blackList[i];
        css += element + ",";
    }
    css += `#qwqawaqaq
            {
                display: none !important;
                min-width: 0 !important;
                width: 0 !important;
                max-width: 0 !important;
                min-height: 0 !important;
                height: 0 !important;
                max-height: 0 !important;
                z-index: -999 !important;
                font-size: 0 !important;
                overflow: hidden !important;
            }`;
    GM_addStyle(css);
    log(["添加样式表成功"]);
}

if (devConfig.exportVariables) {
    unsafeWindow.exportVariables = () => {
        // GM_*
        unsafeWindow._GM_addStyle = GM_addStyle;
        unsafeWindow._GM_getValue = GM_getValue;
        unsafeWindow._GM_info = GM_info;
        unsafeWindow._GM_notification = GM_notification;
        unsafeWindow._GM_openInTab = GM_openInTab;
        unsafeWindow._GM_registerMenuCommand = GM_registerMenuCommand;
        unsafeWindow._GM_setValue = GM_setValue;
        unsafeWindow._GM_unregisterMenuCommand = GM_unregisterMenuCommand;

        // 普通变量
        unsafeWindow._D = D;
        unsafeWindow._lastMenuId = lastMenuId;
        unsafeWindow._succeeded = succeeded;
        unsafeWindow._devConfig = devConfig;
        unsafeWindow._blackList = blackList;

        // 自定函数
        unsafeWindow._setValue = setValue;
        unsafeWindow._initStorage = initStorage;
        unsafeWindow._checkValue = checkValue;
        unsafeWindow._registerMenuCommand = registerMenuCommand;
        unsafeWindow._hideGame = hideGame;
        unsafeWindow._crackAnti = crackAnti;
        unsafeWindow._removeMask = removeMask;
        unsafeWindow._popupStyle = popupStyle;
    };
    unsafeWindow.exportVariables();
}

// 一些不着急执行的代码
setTimeout(() => {
    GM_addValueChangeListener("使用万能规则", () => {
        useGeneralRules();
    });

    // 快捷键
    document.addEventListener(
        "mousedown",
        e => {
            if (GM_getValue("停用快捷键") == "0") {
                if (e.button == 1 && e.shiftKey && !e.altKey) {
                    hideGame();
                }
                if (e.button == 2 && e.shiftKey && e.altKey) {
                    let el = document.elementFromPoint(e.x, e.y);
                    log([
                        "-手动破解成功- ." +
                            el.className +
                            " #" +
                            el.id +
                            " <" +
                            el.tagName +
                            ">",
                    ]);
                    el.style.display = "none";
                }
                if (e.button == 1 && e.altKey && !e.shiftKey) {
                    succeeded = 0;
                    crackAnti();
                    removeMask();
                }
            }
        },
        true
    );

    if (location.host === "www.7k7k.com") {
        try {
            document.querySelector("div.login_no").title =
                "✨防沉迷终结者支持7k7k强制登录, 请移步至脚本菜单";
        } catch (e) {}

        if (location.href.includes("fai-doLogin"))
            document
                .querySelector("div.login_no > div.h_login.login_btn > span")
                .click();
    }

    if (qs("script[src*='chpenmljpdpkebnohfbbdpfelabcnlnp']")) {
        GM_registerMenuCommand(
            "⚠️您已经安装了防沉迷终结者浏览器扩展, 不推荐二者同时使用"
        );
    }

    registerMenuCommand();
});

addEventListener("DOMContentLoaded", () => {
    pageLoaded = true;

    setTimeout(() => {
        qsa("canvas").forEach(element => {
            element.addEventListener(
                "mousedown",
                e => {
                    if (GM_getValue("停用快捷键") == "0") {
                        if (e.button == 1 && e.shiftKey) {
                            hideGame();
                        }
                        if (e.button == 1 && e.altKey) {
                            succeeded = 0;
                            crackAnti();
                            removeMask();
                        }
                    }
                },
                true
            );
        });
    }, 5000);
});

addEventListener("load", () => {
    !devConfig.DisableAutomaticCracking && crackAnti();
});
!devConfig.DisableAutomaticCracking && crackAnti();

log(["脚本执行完毕, 用时" + (new Date().getTime() - D.getTime()) + "ms "]);
