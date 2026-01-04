// ==UserScript==
// @name         vjudge++
// @namespace    vjudge-plus-v2
// @version      1.8.4b12.6
// @description  为vJudge设置背景，并汉化部分界面
// @author       axototl (original by Suntra)
// @match        https://vjudge.net/*
// @noframes
// @icon         https://vjudge.net/favicon.ico
// @license      AGPLv3 or later
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473126/vjudge%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/473126/vjudge%2B%2B.meta.js
// ==/UserScript==

'use strict';

// license text: https://www.gnu.org/licenses/agpl-3.0.txt
(() => {
    // 在基于 Blink 浏览器上检测是否为正常返回
    if (GM_info.platform.browserName == "chrome" && performance.getEntries()[0].responseStatus != 200) return;

    let config = {};

    function dbgopt(...txt) {
        if (config.debug) console.debug(txt.join(' '));
    }


    function reloader() {
        alert("设置成功，刷新生效");
        if (!navigator.onLine) {
            alert("离线状态，无法重加载。\n修改无法即刻生效");
            return;
        }
        location.reload();
    }


    // 初始化Getter / Setter
    (() => {
        const def_props = {
            experimental: false,
            debug: true,
            ads: true,
            enable_style: true,
            back: "https://cdn.luogu.com.cn/images/bg/fe/Day_And_Night_1.jpg",
            col: "#fff",
            collink: "#ff4c8c"
        }

        function getVal(key) {
            let gg = GM_getValue(key);
            if ('' === gg || undefined === gg) {
                let def = def_props[key];
                GM_setValue(key, def);
                gg = def;
            }
            return gg;
        }
        for (let prop in def_props) {
            Object.defineProperty(config, prop, {
                get: () => getVal(prop),
                set: val => GM_setValue(prop, val)
            });
        }
    })();


    // 获取环境配置（不得异步处理） -Begin-
    (() => {
        function reg_command(name, prompts, need_reload = true) {
            let flag = true;
            GM_registerMenuCommand(prompts[config[name] | 0], () => {
                if (flag) {
                    config[name] = !config[name];
                    flag = false;
                }
                if (need_reload) reloader();
            })
        }
        // 设置实验性功能
        reg_command("experimental", ["× 点击启用实验性功能（界面汉化等）", "✔ 点击关闭实验性功能"]);
        // 设置debug
        reg_command("debug", ["已禁用 debug 输出", "已启用debug输出"], false);
        reg_command("ads", ["× 屏蔽广告（点击启用）", "✔ 屏蔽广告（点击禁用）"]);
        reg_command("enable_style", ["✖ 点击开启美化功能", '✔ 点击关闭美化功能']);
        // 禁用美化功能
        if (!config.enable_style) return;
        // 设置背景
        GM_registerMenuCommand("设置背景URL", () => {
            let tmp = window.prompt("请输入背景URL", config.back);
            if (null === tmp) {
                alert("未更改背景图片URL");
                return;
            }
            config.back = tmp;
            GM_setValue("background", config.back);
            reloader();
        });

        // 设置文字颜色
        const tester = /^#([0-9a-f]{3,6})$/i;

        function getColor(t) {
            let tmp;
            do {
                tmp = window.prompt("请输入颜色的Hexcode\n(比如#b93e3e)\n建议选择背景主色调的反差色", t);
            } while (null !== tmp && !tester.test(tmp) && '' !== tmp);
            if (null === tmp) tmp = t;
            return tmp;
        }
        GM_registerMenuCommand("设置文字颜色", () => {
            config.col = getColor(config.col);
            reloader();
        });
        GM_registerMenuCommand("设置链接背景颜色", () => {
            config.collink = getColor(config.collink);
            reloader();
        });
    })();
    // 获取环境配置 -End-

    // 界面美化程序 -Begin-
    (async () => {
        if (!config.enable_style) return;
        document.body.innerHTML = "<div style='height: 60px'></div>" + document.body.innerHTML; // 防止顶栏和页面内容重叠
        // User defined style
        GM_addStyle("body {background: url(" + config.back + ") no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;color: " + config.col + ";}" +
            "a:focus, a:hover, .active {&:not(.nav-link){color: " + config.collink + " !important;text-decoration: underline;}}");
        // Global Style
        GM_addStyle(
            ".navbar {border-radius:0rem;background-color: rgba(0,0,0,65%) !important;position: fixed;top: 0;left: 0;z-index: 1000;width: 100%;}" +
            "scrollbar-width: none" +
            ".modal-content {background-color: rgba(255,255,255,90%);}" +
            ".form-control {background-color: rgba(255,255,255,50%);}" +
            ".tab-content {background-color: rgba(255,255,255,50%);border: 2px solid #eceeef;border-radius: 0.25rem;padding: 20px;}" +
            "table {background-color: rgba(255,255,255,70%);border-radius: 0.25rem;color: #000;}"
        );
        GM_addStyle(".card-block, .card, .list-group-item, .btn-secondary, .page-link, .page-item.disabled .page-link, .dropdown-menu {background-color: rgba(255,255,255,0%) !important;}");
        document.querySelector("body > div.body-footer").innerHTML += '<p style="color: #3fb98b">Theme powered by vjudge++ (original <a href="https://greasyfork.org/scripts/448801">vjudge+</a>)</p>';
    })();
    // 界面美化程序 -End-

    (async () => {
        if (!config.ads) return;
        let arr = document.querySelectorAll(".social, #prob-ads, #img-support");
        for (let x of arr) x.remove();
    })(); // 广告移除

    // 界面汉化程序 -Begin-
    (async () => {
        if (!config.experimental) return;
        console.warn("未来版本将分离JSON文件，请注意");
        const basicTranslateTable = {
            "#nav-problem > a": "问题列表",
            "#nav-status > a": "提交记录",
            "#nav-contest > a": "比赛",
            "#nav-workbook > a": "题单",
            "#nav-user > a": "用户",
            "#nav-group > a": "小组",
            "#nav-comment > a": "留言板",
            ".login": "登录",
            ".register": "注册",
            ".logout": "登出",
            ".user-dropdown > a:nth-child(1)": "个人主页",
            ".update-profile": "更新个人信息",
            ".message": "消息"
        };

        const basicDynTransTable = {
            ".previous > a": "上一页",
            ".next > a": "下一页",
            "#filter": "应用过滤器", // 无法工作
            "#reset": "重置过滤器", // 无法工作
        };
        const loginBoxTranslate = {
            "#loginModalLabel": "登录",
            "#btn-forget-password": "忘记密码",
            "#btn-login": "登录",
            ".btn[data-dismiss]": "取消"
        };

        const registerBoxTrans = {
            "#registerModalLabel": "注册",
            "[for=register-username]": "用户名\n（必填）",
            "[for=register-password]": "密码\n（必填）",
            "[for=register-repeat-password]": "重复密码\n(必填)",
            "[for=register-nickname]": "昵称\n(可修改)",
            "[for=register-school]": "学校",
            "[for=register-email]": "邮箱\n(必填)",
            "[for=register-introduction]": "自我介绍",
            "[for=register-captcha]": "验证码\n(必填)",
            "#btn-register": "注册",
            ".btn[data-dismiss]": "取消"
        };

        const updateProfileTrans = {
            "#updateModalLabel": "更新个人信息",
            "[for=update-username]": "用户名",
            "[for=update-orig-password]": "原密码（必填）",
            "[for=update-password]": "新密码\n（可选）",
            "[for=update-repeat-password]": "重复新密码",
            "[for=update-nickname]": "昵称",
            "[for=update-school]": "学校",
            "[for=update-captcha]": "验证码",
            "[for=update-email]": "邮箱",
            "[for=update-introduction]": "个人简介",
            "#btn-update-profile": "更新",
            ".btn[data-dismiss]": "取消"
        };

        function upd_trans(tr, flag = false) {
            for (let prop in tr) {
                let k = document.querySelector(prop);
                if (null != k)
                    if (flag && k.childNodes.length >= 1) k.childNodes[0].data = tr[prop];
                    else {
                        k.innerText = tr[prop];
                    }
                else dbgopt(prop, "is null");
            }
        }

        function dynamic_trans(table, triggerDOM = null) {
            let ev = "click";
            if (null == triggerDOM)
                ev = "load", triggerDOM = window;
            triggerDOM.addEventListener(ev, () => setTimeout(() => upd_trans(table), 200));
        }

        function reg_box_trans(triggerElem_selector, table) {
            let s = document.querySelector(triggerElem_selector);
            if (null != s) dynamic_trans(table, s);
            else dbgopt(triggerElem_selector, "is null");
        }

        (async () => {
            document.querySelector(".navbar-brand").childNodes[2].data = " 首页";
            upd_trans(basicTranslateTable);
            reg_box_trans(".login", loginBoxTranslate);
            reg_box_trans(".register", registerBoxTrans);
            reg_box_trans(".update-profile", updateProfileTrans);
            dynamic_trans(basicDynTransTable);
        })(); //基本汉化

        // 静态内容汉化
        /* -Begin- */
        const staticTransTable = {
            "/": [{
                "#index-intro > div > div > p": "Vritual Judge（以下简称vj）并不是一个真实的在线评测网站（以下简称OJ），\
而是整合了各大OJ平台的题目形成的虚拟OJ平台。你提交的所有代码都会被发回原平台进行评测。\n\
vj可以让你轻松开展比赛，不再为测试数据发愁\n\n\
目前我们支持以下平台的题库："
            }, 0],
            "/problem": [{
                "[data-category=all]": "全部问题",
                "[data-category=solved]": "已解决问题",
                '[data-category=favorites]': "收藏的问题",
                "[data-category=attempted]": "未通过/正在评测的问题"
            }, 1],
            "/status": [{
                "[data-owner=all]": "所有提交",
                "[data-owner=mine]": "我的提交",
                ".username": "用户名",
                ".oj": "测评平台",
                ".prob_num": "问题编号",
                ".status": "状态",
                ".runtime": "运行时长",
                ".memory": "运行内存",
                ".length": "代码长度",
                ".language": "语言",
                ".date": "提交时间"
            }, 1],
        };
        (async () => {
            for (const path in staticTransTable) {
                if (path == location.pathname) {
                    const tr = staticTransTable[path]
                    upd_trans(tr[0], tr[1]);
                    break;
                }
            }
        })();
        /* -End- */
    })();
    // 界面汉化程序 -End-
})();
