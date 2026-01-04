// ==UserScript==
// @name         问卷星优化(dev)
// @namespace    http://tampermonkey.net/
// @version      0.1.1
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
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457546/%E9%97%AE%E5%8D%B7%E6%98%9F%E4%BC%98%E5%8C%96%28dev%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457546/%E9%97%AE%E5%8D%B7%E6%98%9F%E4%BC%98%E5%8C%96%28dev%29.meta.js
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

    function getActivityId() {
        return location.pathname.match(/\/([a-zA-Z0-9]+).aspx/)[1];
    }

    function getBlanks() {
        return document.querySelectorAll(
            "span.textCont, input:not([type=hidden]), textarea, select"
        );
    }

    function getChoice() {
        return document.querySelectorAll(
            "div > div.ui-controlgroup > div:is(.ui-checkbox, .ui-radio)"
        );
    }

    function fillInTheBlanks(answer) {
        getBlanks().forEach((e, i) => {
            if (answer[i]) {
                if (e.tagName === "SPAN") {
                    e.innerText = answer[i];
                } else {
                    e.value = answer[i];
                }
            }
        });
    }

    function fillInTheChoice(answer) {
        getChoice().forEach((e, i) => {
            answer.includes(i) && e.click();
        });
    }

    function getActivityIdChoice() {
        if (localStorage.getItem(`${getActivityId()} choice`)) {
            return JSON.parse(
                localStorage.getItem(`${getActivityId()} choice`)
            );
        } else {
            return null;
        }
    }

    function getActivityIdBlanks() {
        if (localStorage.getItem(`${getActivityId()} input`)) {
            return JSON.parse(localStorage.getItem(`${getActivityId()} input`));
        } else {
            return null;
        }
    }

    function getBlanksValue() {
        return JSON.stringify(
            [...getBlanks()].map((e) => {
                if (e.tagName === "SPAN") {
                    return e.innerText;
                } else {
                    return e.value;
                }
            })
        );
    }

    function getChoiceValue() {
        let tmp = [];
        [...getChoice()].forEach(
            (e, i) => [...e.classList].includes("checked") && tmp.push(i)
        );
        return JSON.stringify(tmp);
    }

    function setBlanksLastTime() {
        let blanks = getActivityIdBlanks();
        if (blanks) {
            fillInTheBlanks(blanks);
        }
    }

    function setChoiceLastTime() {
        let choice = getActivityIdChoice();
        if (choice) {
            fillInTheChoice(choice);
        }
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

    function bindingUpdates() {
        observe(() => {
            localStorage.setItem(`${getActivityId()} input`, getBlanksValue());
            localStorage.setItem(`${getActivityId()} choice`, getChoiceValue());
        });
    }

    function rmc(configuration) {
        if (
            configuration instanceof Object &&
            configuration?.true &&
            configuration?.false &&
            [true, false].includes(configuration?.default) &&
            configuration?.name
        ) {
            let tmp = () => {
                GM_setValue(
                    configuration.name,
                    !GM_getValue(configuration.name, configuration.default)
                );
                GM_unregisterMenuCommand(tmp2);
                tmp2 = GM_registerMenuCommand(
                    configuration[
                    `${GM_getValue(
                        configuration.name,
                        configuration.default
                    )}`
                    ],
                    tmp
                );
                configuration.action?.(
                    GM_getValue(configuration.name, configuration.default),
                    tmp2
                );
            };
            var tmp2 = GM_registerMenuCommand(
                configuration[
                `${GM_getValue(configuration.name, configuration.default)}`
                ],
                tmp
            );
            return tmp2;
        }
    }
    rmc({
        true: "✔️ 已启用自动记忆回答",
        false: "❌ 已禁用自动记忆回答",
        name: "memoryAnswer",
        default: true,
    });
    if (GM_getValue("memoryAnswer", true)) {
        dcl(() => {
            if (!/activityid=/.test(location.href)) {
                window.addEventListener("load", () => {
                    setChoiceLastTime();
                    setBlanksLastTime();
                    bindingUpdates();
                });
            }
        });
    }
})();
