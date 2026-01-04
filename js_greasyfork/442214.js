// ==UserScript==
// @name         防沉迷终结者 (精简版本)
// @description  不需要任何依赖, 只保留最基本的功能
// @namespace    https://fcmsb250.github.io/
// @version      1.0.1
// @icon         https://dsy4567.github.io/logo.svg
// @author       dsy4567 https://greasyfork.org/zh-CN/users/822325 / dsy4567 https://github.com/dsy4567
// @run-at       document-start
// @license      GPL-3.0

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
// @match        *://*.gamedog.cn/*
// @match        *://*.9377.com/*
// @match        *://*.37.com/*
// @match        *://*.4366.com/*

// @unwrap
// @grant        none
// @homepageURL  https://fcmsb250.github.io/
// @supportURL   https://github.com/dsy4567/Fucking-Anti-Indulgence/
// @downloadURL https://update.greasyfork.org/scripts/442214/%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%20%28%E7%B2%BE%E7%AE%80%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442214/%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%20%28%E7%B2%BE%E7%AE%80%E7%89%88%E6%9C%AC%29.meta.js
// ==/UserScript==

"use strict";
let D = new Date();

/** @returns {HTMLCanvasElement | HTMLScriptElement | HTMLIFrameElement} */
function qs(selector) {
    return document.querySelector(selector);
}
/** @returns {(HTMLCanvasElement | HTMLScriptElement | HTMLIFrameElement)[]} */
function qsa(selector) {
    return document.querySelectorAll(selector);
}

let pageLoaded = false;
let realAddress_17yy = "";
/** @type {Function} */
let _playLoading;
let succeeded = false;
let gamePlatform = "";

const locationHref = location.href;
const host = location.host;
const pathname = location.pathname;
const U = new URL(location.href);

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
    console.log("[防沉迷终结者]", ...data, locationHref);
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

// 添加加样式表
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
(css => {
    let s = document.createElement("style");
    s.innerHTML = css;
    document.head.append(s);
})(css);
log(["添加样式表成功"]);

addEventListener("DOMContentLoaded", () => {
    pageLoaded = true;
});

addEventListener("load", () => {
    crackAnti();
});
crackAnti();

log(["脚本执行完毕, 用时" + (new Date().getTime() - D.getTime()) + "ms "]);
