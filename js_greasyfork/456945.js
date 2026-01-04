// ==UserScript==
// @name         问卷星优化
// @namespace    http://tampermonkey.net/
// @version      5.2.0
// @description  优化问卷星体验
// @author       share121
// @match        https://ks.wjx.top/*/*.aspx
// @match        https://www.wjx.cn/*/*.aspx
// @match        https://ks.wjx.top/wjx/join/completemobile2.aspx?*activityid=*
// @match        https://www.wjx.cn/wjx/join/completemobile2.aspx?*activityid=*
// @icon         https://ks.wjx.top/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/456945/%E9%97%AE%E5%8D%B7%E6%98%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456945/%E9%97%AE%E5%8D%B7%E6%98%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(() => {
    "use strict";
    function dcl(doSomething) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", doSomething);
        } else {
            doSomething();
        }
    }

    function pfl(doSomething) {
        if (["loading", "interactive"].includes(document.readyState)) {
            window.addEventListener("load", doSomething);
        } else {
            doSomething();
        }
    }

    function CancelSwitchScreenTest() {
        ["visibilitychange", "blur", "focus", "focusin", "focusout"].forEach(
            (e) => {
                window.addEventListener(
                    e,
                    (e) => {
                        e.stopImmediatePropagation && e.stopImmediatePropagation();
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    },
                    true
                );
            }
        );
    }

    function resetCookies() {
        document.cookie.match(/actidev_\d+/g)?.forEach((e) => {
            document.cookie = `${e}=0;path=/`;
        });
    }

    function pagingMerge() {
        pfl(() => {
            let fieldset = document.querySelector("fieldset");
            if (!fieldset) {
                return;
            }
            document
                .querySelectorAll("fieldset:not(:first-child) > *")
                .forEach((e) => {
                    fieldset.appendChild(e);
                });
            document.querySelector("#divMultiPage")?.remove();
            if (document.querySelector("#divSubmit")) {
                document.querySelector("#divSubmit").style.display = "block";
            }
        });
    }

    function getActivityId() {
        return location.pathname.match(/\/([a-zA-Z0-9]+).aspx/)[1];
    }

    function enableCopying() {
        document.body.style.userSelect = "auto";
        document.body.style.webkitUserSelect = "auto";
    }

    function enablePaste() {
        window.addEventListener(
            "paste",
            (e) => {
                e.stopImmediatePropagation && e.stopImmediatePropagation();
                e.stopPropagation();
            },
            true
        );
        window.addEventListener(
            "paste",
            (e) => {
                e.stopImmediatePropagation && e.stopImmediatePropagation();
                e.stopPropagation();
            },
            false
        )
    }

    function observe(action) {
        let observe_tmp = new MutationObserver((mutationsList) => {
            action(mutationsList);
        });
        observe_tmp.observe(document.documentElement, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
        });
        return observe_tmp;
    }

    function UAcamouflage() {
        Object.defineProperty(navigator, "userAgent", {
            get() {
                return "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6308011a)";
            },
        });
    }

    function ST_openInTab(url, options) {
        return GM_openInTab(url, options);
    }

    function ST_getValue(name, defaultValue) {
        return GM_getValue(name, defaultValue);
    }

    function ST_setValue(name, value) {
        return GM_setValue(name, value);
    }

    function ST_unregisterMenuCommand(menuCmdId) {
        return GM_unregisterMenuCommand(menuCmdId);
    }

    function ST_registerMenuCommand(name, fn, accessKey) {
        return GM_registerMenuCommand(name, fn, accessKey);
    }

    class Menu {
        constructor(...menus) {
            this.menus = [];
            this.menusId = [];
            this.length = this.menus.length;
            menus
                .filter((e) => {
                    return e instanceof Object && e.name && e.fn;
                })
                .forEach((e) => {
                    this.add(e);
                });
        }
        add(e, i = this.menus.length) {
            if (i > this.menus.length) {
                i = this.menus.length;
            } else if (i < 0) {
                i = this.menus.length + i;
            }
            this.menus.splice(i, 0, e);
            this.refresh(i);
        }
        del(i) {
            if (i >= this.menus.length) {
                i = this.menus.length - 1;
            } else if (i < 0) {
                i = this.menus.length + i;
            }
            this.menus.splice(i, 1);
            this.refresh(i);
        }
        set(e, i) {
            if (i >= this.menus.length) {
                i = this.menus.length - 1;
            } else if (i < 0) {
                i = this.menus.length + i;
            }
            this.menus.splice(i, 1, e);
            this.refresh(i);
        }
        find(obj) {
            return this.menus
                .map((e, i) => {
                    e.index = i;
                    return e;
                })
                .filter((e) => {
                    for (const [key, value] of Object.entries(obj)) {
                        if (e[key] !== value) {
                            return false;
                        }
                    }
                    return true;
                });
        }
        refresh(i) {
            if (this.menus.length < this.length) {
                ST_unregisterMenuCommand(this.menusId.pop());
            }
            for (; i < this.menus.length; i++) {
                if (this.menusId[i] !== undefined) {
                    ST_unregisterMenuCommand(this.menusId[i]);
                }
                this.menusId[i] = ST_registerMenuCommand(
                    this.menus[i].name,
                    this.menus[i].fn,
                    this.menus[i].accessKey
                );
            }
            this.length = this.menus.length;
        }
    }

    class Problem {
        constructor(type, title) {
            this.title = Problem.trim(title);
            this.originalTitle = title;
            this.type = type;
        }
        static trim(title) {
            return title
                .trim()
                .replace(
                    /^\d+[^\w\u4e00-\u9fa5]+?([\w\u4e00-\u9fa5].*?)\*?(【多选题】)?$/gs,
                    "$1"
                )
                .trim();
        }
        static getAllProblems() {
            return document.querySelectorAll(
                "#divQuestion > fieldset > .field.ui-field-contain"
            );
        }
        static getProblem(element) {
            return new Problem(
                Problem,
                element.querySelector(".field-label").textContent
            );
        }
    }

    class InputBox extends Problem {
        constructor(title, values) {
            super(InputBox, title);
            this.values = values;
        }
        static getActionItem(element) {
            return element.querySelectorAll("input:not([type=file]), textarea");
        }
        fill() {
            super.getAllProblems().forEach((e) => {
                if (super.getProblem(e).title === this.title) {
                    InputBox.getActionItem(e).forEach((e, i) => {
                        if (this.values[i]) {
                            e.value = this.values[i];
                        }
                    });
                }
            });
        }
    }

    class MultipleInputBox extends Problem {
        constructor(title, values) {
            super(MultipleInputBox, title);
            this.values = values;
        }
        static getActionItem(element) {
            return element.querySelectorAll(".textCont");
        }
        fill() {
            super.getAllProblems().forEach((e) => {
                if (super.getProblem(e).title === this.title) {
                    MultipleInputBox.getActionItem(e).forEach((e, i) => {
                        if (this.values[i]) {
                            e.innerText = this.values[i];
                        }
                    });
                }
            });
        }
    }

    class ChoiceQuestion extends Problem {
        constructor(title, selecteds) {
            super(ChoiceQuestion, title);
            this.selecteds = selecteds;
        }
        static getActionItem(element) {
            return element.querySelectorAll(".ui-checkbox, .ui-radio");
        }
        fill() {
            super.getAllProblems().forEach((e) => {
                if (super.getProblem(e).title === this.title) {
                    ChoiceQuestion.getActionItem(e).forEach((e) => {
                        if (this.selecteds.includes(e.textContent)) {
                            e.click();
                        }
                    });
                }
            });
        }
    }

    function bindingUpdates() {
        observe(() => { });
    }

    const menus = new Menu({
        name: ["❌ 已禁用自动重置 cookies", "✔️ 已启用自动重置 cookies"][
            +ST_getValue("resetCookies", true)
        ],
        fn: function tmp() {
            ST_setValue("resetCookies", !ST_getValue("resetCookies", true));
            if (ST_getValue("resetCookies", true)) {
                resetCookies();
            }
            menus.set(
                {
                    name: [
                        "❌ 已禁用自动重置 cookies",
                        "✔️ 已启用自动重置 cookies",
                    ][+ST_getValue("resetCookies", true)],
                    fn: tmp,
                    id: "resetCookies",
                },
                menus.find({
                    id: "resetCookies",
                })[0].index
            );
        },
        id: "resetCookies",
    });
    if (/activityid=/.test(location.href)) {
        menus.add({
            name: "重做此问卷",
            fn: () => {
                ST_openInTab(
                    `${location.protocol}//${location.host}/vm/${location.href.match(/activityid=([a-zA-Z0-9]+?)&/)[1]
                    }.aspx`,
                    {
                        active: true,
                        insert: true,
                        setParent: true,
                    }
                );
            },
        });
    } else {
        // menus.add({
        //     name: ["❌ 已禁用自动记忆回答", "✔️ 已启用自动记忆回答"][
        //         +ST_getValue("memoryAnswer", true)
        //     ],
        //     fn: function tmp() {
        //         ST_setValue("memoryAnswer", !ST_getValue("memoryAnswer", true));
        //         menus.set(
        //             {
        //                 name: [
        //                     "❌ 已禁用自动记忆回答",
        //                     "✔️ 已启用自动记忆回答",
        //                 ][+ST_getValue("memoryAnswer", true)],
        //                 fn: tmp,
        //                 id: "memoryAnswer",
        //             },
        //             menus.find({
        //                 id: "memoryAnswer",
        //             })[0].index
        //         );
        //     },
        //     id: "memoryAnswer",
        // });
        menus.add({
            name: ["❌ 已禁用自动分页合并", "✔️ 已启用自动分页合并"][
                +ST_getValue("pagingMerge", true)
            ],
            fn: function tmp() {
                ST_setValue("pagingMerge", !ST_getValue("pagingMerge", true));
                if (ST_getValue("pagingMerge", true)) {
                    pagingMerge();
                }
                menus.set(
                    {
                        name: [
                            "❌ 已禁用自动分页合并",
                            "✔️ 已启用自动分页合并",
                        ][+ST_getValue("pagingMerge", true)],
                        fn: tmp,
                        id: "pagingMerge",
                    },
                    menus.find({
                        id: "pagingMerge",
                    })[0].index
                );
            },
            id: "pagingMerge",
        });
        menus.add({
            name: ["❌ 已禁用复制", "✔️ 已启用复制"][
                +ST_getValue("enableCopying", true)
            ],
            fn: function tmp() {
                ST_setValue(
                    "enableCopying",
                    !ST_getValue("enableCopying", true)
                );
                if (ST_getValue("enableCopying", true)) {
                    enableCopying();
                }
                menus.set(
                    {
                        name: ["❌ 已禁用复制", "✔️ 已启用复制"][
                            +ST_getValue("enableCopying", true)
                        ],
                        fn: tmp,
                        id: "enableCopying",
                    },
                    menus.find({
                        id: "enableCopying",
                    })[0].index
                );
            },
            id: "enableCopying",
        });
        menus.add({
            name: ["❌ 已禁用粘贴", "✔️ 已启用粘贴"][
                +ST_getValue("enablePaste", true)
            ],
            fn: function tmp() {
                ST_setValue(
                    "enablePaste",
                    !ST_getValue("enablePaste", true)
                );
                if (ST_getValue("enablePaste", true)) {
                    enablePaste();
                }
                menus.set(
                    {
                        name: ["❌ 已禁用粘贴", "✔️ 已启用粘贴"][
                            +ST_getValue("enablePaste", true)
                        ],
                        fn: tmp,
                        id: "enablePaste",
                    },
                    menus.find({
                        id: "enablePaste",
                    })[0].index
                );
            },
            id: "enablePaste",
        });
        menus.add({
            name: ["❌ 已禁用防切屏检测", "✔️ 已启用防切屏检测"][
                +ST_getValue("CancelSwitchScreenTest", true)
            ],
            fn: function tmp() {
                ST_setValue(
                    "CancelSwitchScreenTest",
                    !ST_getValue("CancelSwitchScreenTest", true)
                );
                if (ST_getValue("CancelSwitchScreenTest", true)) {
                    CancelSwitchScreenTest();
                }
                menus.set(
                    {
                        name: ["❌ 已禁用防切屏检测", "✔️ 已启用防切屏检测"][
                            +ST_getValue("CancelSwitchScreenTest", true)
                        ],
                        fn: tmp,
                        id: "CancelSwitchScreenTest",
                    },
                    menus.find({
                        id: "CancelSwitchScreenTest",
                    })[0].index
                );
            },
            id: "CancelSwitchScreenTest",
        });
    }
    UAcamouflage();
    if (ST_getValue("resetCookies", true)) {
        resetCookies();
    }
    if (ST_getValue("pagingMerge", true)) {
        pagingMerge();
    }
    if (ST_getValue("memoryAnswer", true)) {
        dcl(() => {
            if (!/activityid=/.test(location.href)) {
                pfl(() => {
                    // setChoiceLastTime();
                    // setBlanksLastTime();
                    bindingUpdates();
                });
            }
        });
    }
    if (ST_getValue("enableCopying", true)) {
        dcl(() => {
            if (!/activityid=/.test(location.href)) {
                enableCopying();
            }
        });
    }
    if (ST_getValue("CancelSwitchScreenTest", true)) {
        if (!/activityid=/.test(location.href)) {
            CancelSwitchScreenTest();
        }
    }
    if (ST_getValue("enablePaste", true)) {
        if (!/activityid=/.test(location.href)) {
            enablePaste();
        }
    }
})();
