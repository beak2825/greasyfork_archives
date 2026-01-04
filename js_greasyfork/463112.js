// ==UserScript==
// @name         网页滚动条美化V2
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  网页美化
// @author       Eliauk
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDExNy4yOSAxMDAuNCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJlNmM2YzNkZi04OTIzLTQyZTMtYWI5NS03OWRhZWQzNWVlYmIiIHgxPSIyNi40MiIgeTE9Ijg2Ljk4IiB4Mj0iOTYuOCIgeTI9IjE2LjYxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIC0xLCAwLCAxMDIuMDUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZiMmMyIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjg1ZThhIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHRpdGxlPjc2MDg8L3RpdGxlPjxnIGlkPSJiNmU5YjlmZi05NTU5LTQyMTQtOWQxMi0zODQ2YWViNmQxM2UiPjxnIGlkPSJhMjM3NmQ3ZC04MDgwLTQwYjMtYjAyZi03OWYxYWMzZWJlYzAiPjxwYXRoIGQ9Ik01OS4zNiw0N0M1My4yOSw0OCw1Mi4yNiw1Ny4xLDYyLjc0LDU5Ljg0czI2LjQyLjQ1LDI2Ljg4LTIwUzUzLjE4LDYuMywzNy40NiwzMC4yMiwzNS4xMSw4MS42Nyw1OS43OCw4My43NmMyMC4yOCwxLjcxLDMxLjQ0LTUuNywzNi40NS05LjExczEyLjA3LS4yMywyLDkuMzQtNDQuNDIsMjMuOTMtNzMtMi40Qy0xLjUxLDU2LjkzLDYsMTYuMjIsNDcuODIsNiw5NC41NC01LjQxLDEyMC40NywzNy4yNCwxMDEsNjEuNzgsODMuODIsODMuNDIsNDUuODgsNzAuMzIsNDkuMDcsNDguOSw1MiwyOS40OCw3Mi43NywzMC4yMiw3My4yMiw0MCw3My41MSw0Ni4yNyw2NS4yOCw0NS45Myw1OS4zNiw0N1oiIGZpbGw9InVybCgjZTZjNmMzZGYtODkyMy00MmUzLWFiOTUtNzlkYWVkMzVlZWJiKSI+PC9wYXRoPjxwYXRoIGQ9Ik04Mi42MSw5NS44OWMtMS41Mi0uNDUtMy4xNy0uODgtNC45Mi0xLjM0LTEyLjU5LTMuMzItMzAuMzgtNy43OC00MS0yMy43MS03LjYzLTEwLjY4LTguNjUtMjYuMjkuNzYtNDAuNjIsOS4xNS0xMy45MiwyNS40Ny0xNS4zNCwzNy40My0xMC0xMi4wNy03LjM2LTQ4LjI4LTQuNzgtNTIsMzcuMDhBMzcuMzUsMzcuMzUsMCwwLDAsMzcuMDUsOTAuMTJDNDYsOTcuMjgsNTguNzYsMTAxLjM3LDc0LjM3LDEwMC4yLDg2LjY1LDk5LjI3LDg3LjI5LDk3LjI2LDgyLjYxLDk1Ljg5Wm0tMjYuODguM2E1Myw1MywwLDAsMS01LjI5LS45NEE0OS40Nyw0OS40NywwLDAsMSw0NS4xLDkzLjdhNTIuNzgsNTIuNzgsMCwwLDEtNS4zNy0yLjIsNTIuNzgsNTIuNzgsMCwwLDAsNS4zNywyLjIsNDkuNDcsNDkuNDcsMCwwLDAsNS4zNCwxLjU1LDUzLDUzLDAsMCwwLDUuMjkuOTRjMS43NS4yMiwzLjQ4LjM1LDUuMTguNEM1OS4yMSw5Ni41NCw1Ny40OCw5Ni40MSw1NS43Myw5Ni4xOVoiIGZpbGw9IiMzYzIyOTkiIG9wYWNpdHk9IjAuNSIgc3R5bGU9Imlzb2xhdGlvbjppc29sYXRlIj48L3BhdGg+PHBhdGggZD0iTTEwNC4zMywxOS42N0MxMDEuMjYuMSw3OS40Ni0zLjUzLDYwLjEzLDQuMTcsNDAuMjEsMTIuMTEsMjIuOTIsMzIuMDksMzEuNDgsNTljLTItOC45Mi0uMzYtMTkuMTYsNi0yOC44MiwxNS43LTIzLjksNTIuNi0xMC45MSw1Mi4xNCw5LjU5cy0xNi40LDIyLjc4LTI2Ljg4LDIwUzUzLjI5LDQ4LDU5LjM2LDQ3YzUuOTItMSwxNC4xNS0uNjksMTMuODYtNi45NEM3Mi43NywzMC4yMiw1MiwyOS40OCw0OS4wNyw0OC45YTE2LjYzLDE2LjYzLDAsMCwwLDIuMDcsMTAuODdjOS4xNywxNS43Miw1Mi44NSw5LDUzLjkyLTI5LjRBNTksNTksMCwwLDAsMTA0LjMzLDE5LjY3WiIgZmlsbD0iI2ZmM2UyNCIgb3BhY2l0eT0iMC41Ij48L3BhdGg+PHBhdGggZD0iTTMyLjExLDEyQzE4LjU3LDE0LjEyLDYuNzcsMTkuNzksMi4yNywyOC40MWMtNS40NSwxMC40NC0uNzIsMjQsMTAuMzEsMzUuMDlTNDEsODMuMjgsNjAuOCw4My44NGwtMS0uMDhjLTI0LjY3LTIuMDktMzgtMjkuNjItMjIuMzItNTMuNTQsMTEuOTMtMTguMTUsMzYuMDctMTUsNDYuODEtMy41M0M3My44OCwxMy4zNyw1MS4yNiw5LjEsMzIuMTEsMTJaIiBmaWxsPSIjZmYwMDk4IiBvcGFjaXR5PSIwLjYiPjwvcGF0aD48cGF0aCBkPSJNMTAzLjQxLDcxLjM1Yy44MywyLjE1LDE1LjU1LTEsMTMuNzItNS44M1MxMDIuNTcsNjkuMiwxMDMuNDEsNzEuMzVaTTM0LjcsOGMyLjMuMTcsNC45NC03LjQ3LS4xNy04UzMyLjQxLDcuNzYsMzQuNyw4WiIgZmlsbD0iI2Y3NTdhZiI+PC9wYXRoPjxwYXRoIGQ9Ik0xMDIuNDUsNjZjLjQ0LDIuNTUsNi0yLDQuMzItNC4wNlMxMDIuMTcsNjQuMzcsMTAyLjQ1LDY2Wk05LjU4LDY1Yy00LjM1Ljc0LTIuMTEsNi4yOSwxLjMyLDMuNUMxMi44NSw2Ni45MywxMiw2NC42MSw5LjU4LDY1WiIgZmlsbD0iI2FiOGVlYiI+PC9wYXRoPjxwYXRoIGQ9Ik0zMS44Myw4LjYxYy0uNDktMi40NS0zLjE0LTYuNDctNi40Ni03LjA5LTIuNzktLjUtNy44Niw1LjMyLDEuNzUsOC4zNEMzMi42MywxMS41OSwzMi4wNiw5Ljc5LDMxLjgzLDguNjFaIiBmaWxsPSIjZmZiZDg4Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=
// @license      GPL-3.0
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_notification
// @resource     ArcoDesignStyle      https://gitee.com/lzyws739307453/scrollbar-beautify/raw/master/arcodesign.min.css
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463112/%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96V2.user.js
// @updateURL https://update.greasyfork.org/scripts/463112/%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96V2.meta.js
// ==/UserScript==
const isdebug = false; // 调试日志用
const isLocalDebug = false; // 加载本地资源用
const debug = isdebug ? console.log.bind(console) : () => {};
let nodes, scrollbarX, scrollbarY, ruleTitles, ruleConfig;
let data = {};
const DefaultConfig = {
    scrollbar: {
        height: 10,
        width: 10,
        radius: 10,
        background: "linear-gradient(45deg, #000000 0%, #ff0000 100%) content-box;",
        color: {
            default: "#f2f3f5",
            solid: "#f2f3f5",
            gradient: {
                direction: 45,
                length: 1,
                steps: {
                    "0": "#000000",
                    "1": "#ff0000"
                }
            }
        }
    },
    rule: {
        default: ["^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+"],
        titles: ["^https?:\\/\\/(.+\\.)?bilibili\\.[a-z]{2,6}/?"],
        config: {
            "^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+": {
                enable: true,
                style: "::-webkit-scrollbar{width:10px;height:10px;}::-webkit-scrollbar-thumb{border-radius:10px;border:2px solid transparent;background:linear-gradient(45deg, #000000 0%, #ff0000 100%) content-box;}::-webkit-scrollbar-track{box-shadow:none;}html{overflow-y:overlay;}"
            },
            "^https?:\\/\\/(.+\\.)?bilibili\\.[a-z]{2,6}/?": {
                enable: true,
                style: "html{overflow-y:inherit;}body{overflow-y:overlay;}"
            }
        }
    }
}

// 增加了一个css的缓冲层，保证多次CSS操作不导致页面卡顿，减少重排的次数
class FlushDomFragment {
    constructor() {
        this.init()
    }

    init() {
        this.length = 0

        this.fragmentHead = document.createDocumentFragment();
        this.fragmentBody = document.createDocumentFragment();
        this.fragmentDOM = document.createDocumentFragment();

        this.reloadList = [] // 所有需要动态刷新的都在这里面
    }

    _removeReload() {
        this.reloadList.map(selector => {
            safeRemove(selector)
        })
    }

    _singleInsert(node, toDom, checkDom) {
        if (!node) return;
        const {
            dataset: {
                xclass: selector = ''
            } = {},
            tagName = ''
        } = node
        if (tagName.toLowerCase() === 'style') {
            if (selector) {
                // 已经存在，不用添加
                if (checkDom.querySelector(selector)) return
            } else {
                console.error('出现没有样式的节点', node)
            }
        }
        // 添加
        toDom.appendChild(node)

        this.length += 1
        debug('增加节点', node)
        debug('长度变化', this.length)
    }

    // 如果CSS已经存在了，那么就不再添加了
    _dropMultiCSS(fragment) {
        const newFrag = document.createDocumentFragment();
        [...fragment.childNodes].map(node => {
            this._singleInsert(node, newFrag, document)
        })
        return newFrag
    }

    flush() {
        // 有数据, 才进行flush, 否则没有必要
        if (this.length <= 0) return
        this._removeReload()

        // MARK 保证线程安全, 将现有数据暂存, 然后生成新的节点, 避免其他js插入后丢失
        const curBodyFrag = this.fragmentBody
        const curHeadFrag = this.fragmentHead
        const curDomFrag = this.fragmentDOM

        this.init()

        // 数据清除
        const newBodyFrag = this._dropMultiCSS(curBodyFrag)
        const newHeadFrag = this._dropMultiCSS(curHeadFrag)
        const newDomFrag = this._dropMultiCSS(curDomFrag)

        debug('数据flush1', newBodyFrag.children.length)
        debug('数据flush2', newHeadFrag.children.length)
        debug('数据flush3', newDomFrag.children.length)

        safeWaitFunc("body", () => {
            document.body.appendChild(newBodyFrag)
        })
        safeWaitFunc("head", () => {
            document.head.appendChild(newHeadFrag)
        })
        document.insertBefore(newDomFrag, document.documentElement)
    }

    appendChild(node, to = 'head', config = {
        isReload: false
    }) {
        return this.insert(node, to, config)
    }
    /**
     *
     * @param { 子节点 } node
     * @param { 父节点 } to
     * @param { 配置信息, isReload: 是否加入定时器刷新重新加载 } config
     * @returns
     */
    insert(node, to = 'head', config = {
        isReload: false
    }) {
        if ('body' === to) {
            this._singleInsert(node, this.fragmentBody, this.fragmentBody)
        } else if ('head' === to) {
            this._singleInsert(node, this.fragmentHead, this.fragmentHead)
        } else if ('DOM' === to) {
            this._singleInsert(node, this.fragmentDOM, this.fragmentDOM)
        } else {
            console.error('不支持的节点操作')
            return
        }

        const {
            isReload
        } = config
        if (isReload) {
            const {
                classList = []
            } = node
            if (classList.length) {
                this.reloadList.push('.' + [...(classList || [])].join('.'))
            } else {
                console.error('异常的reload参数, 没有classList', node)
            }
        }
        return this
    }
}
function $one(selector, element = document) {
    return element.querySelector(selector)
}

function $all(selector, element = document) {
    return element.querySelectorAll(selector)
}
function parseBoolean(val) {
    if (["yes", "y", "true", "1", "on"].indexOf(String(val).toLowerCase()) !== -1) return true;
    if (["no", "n", "false", "0", "off"].indexOf(String(val).toLowerCase()) !== -1) return false;
    return Boolean(val);
}
ruleConfigSwitch = function (e) {
    const enable = parseBoolean(e.getAttribute("aria-checked"));
    const data_v = e.dataset.v;
    const titleComp = $one(`.arco-collapse-item-header-title[data-v="${data_v}"]`, ruleConfig);
    const title = titleComp.innerText;
    if (!data.rule.config[title]) {
        data.rule.config[title] = {};
    }
    debug('ruleConfigSwitch', data.rule.config[title]);
    debug('ruleConfigSwitch', data);
    data.rule.config[title].enable = enable;
}
// 渐变长度更改事件
gradientLenghtChange = function (e) {
    // debug("gradientLenghtChange");
    // debug(e.value);
    nodes.color.gradient.step
    nodes.color.gradient.step.comp.setAttribute("max", `${e.value}`);
    // 重置
    resetGradientStep("0");
    data.scrollbar.color.gradient.steps = {};
    data.scrollbar.color.gradient.length = e.value;
    resetGradientColor(data.scrollbar.color.default);
    resetPreviewBackground(data.scrollbar.color.default);
    redrawSliderStyle(nodes.color.gradient.step.comp);
}
// 纯色、渐变选择按钮事件
colorSelect = function (e) {
    // debug(e);
    const select = $one("#eliauk-container .arco-radio-checked .arco-radio-target", e).value;
    if ('GradientColor' === select) {
        $one("#solid-color-page").style.display = 'none';
        $one("#gradient-color-page").style.display = 'block';
        reloadGradientPage();
    } else {
        $one("#gradient-color-page").style.display = 'none';
        $one("#solid-color-page").style.display = 'block';
        reloadSolidPage();
    }
};
// 滑动输入条绘制
function redrawSliderStyle(ele) {
    let total = ele.max - ele.min;
    let effset = Math.round((ele.value * 100) / total);
    ele.style.background =
        `linear-gradient(to right, rgb(var(--primary-6)) ${effset}%, var(--color-fill-3) ${effset}%)`;
};

function resetGradientStep(value) {
    const step = nodes.color.gradient.step.comp;
    step.value = value;
    let total = step.max - step.min;
    let effset = Math.round((value * 100) / total);
    nodes.color.gradient.step.text.value = `${effset}%`;
    redrawSliderStyle(nodes.color.gradient.step.comp);
    reloadGradientPreviewBackground();
}

function resetGradientColor(value) {
    nodes.color.gradient.color.comp.value = value;
    nodes.color.gradient.color.text.value = value;
}

function resetPreviewBackground(background) {
    data.scrollbar.background = background;
    $all("#eliauk-container .context div").forEach(ele => {
        ele.style.background = background;
    })
}

function resetPreviewBasicSettings(width, height, radius) {
    $all("#eliauk-container .context div").forEach(ele => {
        ele.style.borderRadius = radius;
    })
    scrollbarY.style.width = `${width}px`;
    scrollbarX.style.height = `${height}px`;
}

function reloadBasicSettingsPage() {
    const {
        width, height, radius
    } = data.scrollbar;
    nodes.scrollbar.width.comp.value = width;
    nodes.scrollbar.width.text.value = width;
    nodes.scrollbar.height.comp.value = height;
    nodes.scrollbar.height.text.value = height;
    nodes.scrollbar.radius.comp.value = radius;
    nodes.scrollbar.radius.text.value = radius;
    resetPreviewBasicSettings(width, height, radius);
}

function reloadSolidPage() {
    nodes.color.solid.color.comp.value = data.scrollbar.color.solid;
    nodes.color.solid.color.text.value = data.scrollbar.color.solid;
    resetPreviewBackground(data.scrollbar.color.solid);
}

function reloadGradientDirection() {
    nodes.color.gradient.direction.comp.value = data.scrollbar.color.gradient.direction;
    nodes.color.gradient.direction.text.value = `${data.scrollbar.color.gradient.direction}deg`;
}

// 渐变背景修改预览
function reloadGradientPreviewBackground() {
    const gradientDirection = nodes.color.gradient.direction.text.value;
    const keys = Object.keys(data.scrollbar.color.gradient.steps);
    // .sort((a, b) => a.match(/^(\d+)%$/)[1] - b.match(/^(\d+)%$/)[1])
    const style = `linear-gradient(${gradientDirection}, ${keys.map((key) => {
        let total = data.scrollbar.color.gradient.length;
        let effset = Math.round((key * 100) / total);
        return `${data.scrollbar.color.gradient.steps[key]} ${effset}%`
    }).join(", ")})`
    // debug(style);
    resetPreviewBackground(style);
}
function reloadRules() {
    ruleTitles.value = data.rule.titles.join(";\n");
}
function reloadGradientPage() {
    nodes.color.gradient.length.text.value = data.scrollbar.color.gradient.length;
    nodes.color.gradient.step.comp.max = data.scrollbar.color.gradient.length;
    nodes.color.gradient.direction.comp.value = data.scrollbar.color.gradient.direction;
    nodes.color.gradient.direction.text.value = `${data.scrollbar.color.gradient.direction}deg`;
    redrawSliderStyle(nodes.color.gradient.direction.comp);
    const steps = data.scrollbar.color.gradient.steps;
    const keys = Object.keys(steps);
    if (keys && keys.length > 0) {
        resetGradientStep(keys[0]);
        resetGradientColor(steps[keys[0]]);
    } else {
        resetGradientStep("0");
        resetGradientColor(data.scrollbar.color.default);
    }
};
/**
     *
     * @param { css选择器 } selector
     * @param { 是否绑定消失动画 } withAni
     */
function safeRemove(selector, withAni = false) {
    safeFunction(() => {
        let removeNodes = document.querySelectorAll(selector);
        for (let i = 0; i < removeNodes.length; i++) {
            aniRemove(removeNodes[i], withAni)
        }
    })
}
/**
 *
 * @param { 节点 } node
 * @param { 是否绑定消失动画 } withAni
 */
function aniRemove(node, withAni) {
    if (withAni) {
        node.classList.add('aniDelete')
        setTimeout(() => {
            node.remove();
        }, 200)
    } else {
        node.remove();
    }
}

function safeFunction(func, failCb) {
    try {
        func();
    } catch (e) {
        failCb && failCb(e)
    }
}

function retryInterval(callback, period = 50, now = false, count = -1) {
    if (now && count-- != 0) {
        if (callback()) return;
    }
    const inter = setInterval(() => {
        if (count-- === 0) {
            return clearInterval(inter);
        }
        callback() && clearInterval(inter);
    }, period);
}

function safeWaitFunc(selector, callbackFunc, time = 60, notClear) {
    notClear = notClear || false;
    let doClear = !notClear;
    retryInterval(() => {
        if ((typeof (selector) === "string" && document.querySelector(selector) != null)) {
            callbackFunc(document.querySelector(selector));
            if (doClear) return true;
        } else if (typeof (selector) === "function" && (selector() != null || (selector() || []).length > 0)) {
            callbackFunc(selector()[0]);
            if (doClear) return true;
        }
    }, time, true);
}

/**
 *
 * @param {
 * 回调函数, 需要返回是否, True: 结束、False: 相当于定时器
 * callback return:
 *     true  = 倒计时
 *     false = 计时器
 * } callback
 * @param { 周期，如: 200ms } period
 * @param { 立即执行 } now
 * @param { 次数, -1: Infinity } count
 */
function createStyleElement(css, className = '', type = "text/css") {
    const element = document.createElement("style");
    if (className) {
        element.className = className
        const xclass = '.' + className.split(' ').join('.')
        element.dataset.xclass = xclass
    }

    element.setAttribute("type", type);
    element.appendChild(document.createTextNode(css))

    return element
};
(function () {
    "use strict";
    const hostname = window.location.href;
    const CURRENT_LIST = "CurrentList";
    const ELCONFIG = "ElConfig";
    let ElConfig = {};
    reloadAllConfig();
    const globalStyle = `
        #eliauk-container .arco-input-wrapper .arco-input.arco-input-size-mini {
            height: 20px;
        }
        #eliauk-container a, #eliauk-container abbr, #eliauk-container address, #eliauk-container blockquote, #eliauk-container caption, #eliauk-container cite, #eliauk-container code, #eliauk-container dd, #eliauk-container del, #eliauk-container dfn, #eliauk-container dl, #eliauk-container dt, #eliauk-container em, #eliauk-container fieldset, #eliauk-container form, #eliauk-container h1, #eliauk-container h2, #eliauk-container h3, #eliauk-container h4, #eliauk-container h5, #eliauk-container h6, #eliauk-container iframe, #eliauk-container img, #eliauk-container ins, #eliauk-container label, #eliauk-container legend, #eliauk-container li, #eliauk-container object, #eliauk-container ol, #eliauk-container p, #eliauk-container pre, #eliauk-container q, #eliauk-container small, #eliauk-container strong, #eliauk-container sub, #eliauk-container sup, #eliauk-container table, #eliauk-container tbody, #eliauk-container td, #eliauk-container tfoot, #eliauk-container th, #eliauk-container thead, #eliauk-container tr, #eliauk-container ul {
            border: 0;
            margin: 0;
            padding: 0;
        }
        #eliauk-container {
            font-family: HarmonyOS Sans SC, Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, noto sans, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
            display: none;
            position: fixed;
            top: 3.9vw;
            right: 12.5vw;
            z-index: 999999;
            box-shadow: -2px 2px 5px rgb(0 0 0 / 30%);
            border-radius: var(--border-radius-medium);
        }

        /* 对话框 */
        #eliauk-container .arco-modal {
            position: static;
            display: block;
            width: 360px;
        }

        #eliauk-container .arco-modal-header {
            border-bottom: none;
        }

        #eliauk-container .arco-modal-body {
            padding-top: 0px;
            overflow: visible;
        }

        #eliauk-container .arco-modal-body .arco-divider-horizontal.arco-divider-with-text:first-child {
            margin-top: 0;
        }

        #eliauk-container .arco-form-item {
            margin-bottom: 10px;
        }

        /* 折叠页相关 */
        #eliauk-container .page-collapse {
            display: block;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
        }
        #eliauk-container .page-one,
        #eliauk-container .page-two {
            padding: 0 2px 0 12px;
            overflow-y: scroll;
        }
        #eliauk-container .page {
            overflow: hidden;
        }
        #eliauk-container .page,
        #eliauk-container .page-one,
        #eliauk-container .page-two {
            height: 435px;
            opacity: 1;
            transition: all .3s;
        }

        #eliauk-container .page-collapse-btn svg {
            transition: all .3s;
        }

        #eliauk-container .page-collapse-btn-collapse svg {
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            transform: rotate(180deg);
        }

        #eliauk-container .page-collapse+div,
        #eliauk-container .page-collapse.page-collapse-collapse {
            height: 0;
            opacity: 0;
        }

        #eliauk-container .page-collapse.page-collapse-collapse+div {
            height: 435px;
            opacity: 1;
        }

        #eliauk-container .page-collapse-btn {
            position: relative;
            left: 0;
            transition: left .2s;
        }

        /* 滑动输入框相关 */
        #eliauk-container .eliauk-slider-context {
            min-height: 24px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }

        #eliauk-container .eliauk-slider {
            -webkit-appearance: none;
            appearance: none;
            outline: none;
            /* 避免点选会有蓝线或虚线 */
            width: 100%;
            height: 2px;
            border-radius: 2px;
            background: linear-gradient(to right,
                    rgb(var(--primary-6)) 100%,
                    var(--color-fill-3) 100%);
            cursor: pointer;
        }

        #eliauk-container .eliauk-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: #fff;
            border: 2px solid rgb(var(--primary-6));
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.3, 1.3, 0.3, 1);
        }

        #eliauk-container .eliauk-slider::-webkit-slider-thumb:hover {
            box-shadow: 0 2px 5px #0000001a;
            transform: scale(1.16666667);
        }

        /* 输入框 */
        #eliauk-container .arco-input-wrapper {
            padding: 0px;
        }

        #eliauk-container .arco-input-wrapper .arco-input {
            text-align: center;
        }

        /* 颜色输入框 */
        #eliauk-container .color {
            border: none;
            outline: none;
            width: 100%;
            border-radius: 0;
            border-top-right-radius: var(--border-radius-small);
            border-bottom-right-radius: var(--border-radius-small);
            background-color: transparent;
            padding: 0;
            margin: 0;
            overflow: hidden;
        }

        #eliauk-container .color::-webkit-color-swatch-wrapper {
            padding: 0;
            margin: 0;
        }

        #eliauk-container .color::-webkit-color-swatch {
            border: none;
        }

        /* 预览区 */
        #eliauk-container .context {
            text-align: left;
        }

        #eliauk-container .context div {
            background: ${data.scrollbar.background};
            border-radius: ${data.scrollbar.radius}px;
            display: inline-block;
        }

        #eliauk-container .context .context-y {
            height: 100px;
            width: ${data.scrollbar.width}px;
        }

        #eliauk-container .context .context-x {
            height: ${data.scrollbar.height}px;
            width: 100px;
        }

        /* 折叠面板 */
        #eliauk-container .arco-collapse-item .arco-collapse-item-content {
            /* display: none; */
            height: 0;
            padding: 0;
            transition: all .2s;
        }

        #eliauk-container .arco-collapse-item-content-box {
            padding: 5px;
            height: 100%;
            box-sizing: border-box;
        }

        #eliauk-container .arco-collapse-item.arco-collapse-item-active .arco-collapse-item-content {
            display: block;
            height: 100px;
        }

        #eliauk-container .arco-collapse-item .arco-collapse-item-header .arco-collapse-item-header-title {
            font-weight: 500;
        }

        #rule-list-title-collapse {
            margin-bottom: 5px;
        }

        #rule-list-title-collapse .arco-collapse-item.arco-collapse-item-active .arco-collapse-item-content {
            height: 380px;
        }

        #rule-list-title-collapse:has(.arco-collapse-item.arco-collapse-item-active)+.arco-collapse {
            height: 0;
            opacity: 0;
        }

        /* 文本域 */
        #eliauk-container .arco-textarea-wrapper {
            display: inline-flex;
            height: 100%;
        }

        #eliauk-container .arco-textarea::-webkit-scrollbar,
        #eliauk-container div::-webkit-scrollbar {
            width: 10px;
            background: transparent;

        }

        #eliauk-container .arco-textarea::-webkit-scrollbar-thumb,
        #eliauk-container div::-webkit-scrollbar-thumb {
            background: var(--color-fill-3) content-box;
            border: 2px solid transparent;
            border-radius: 5px;
        }
    `;
    // 添加 自定义的动画
    const aniStyle = `
        @keyframes ani_leftToright {
            0% {
                transform: translateX(-32px);
                opacity: 0.2;
            }
            20% {
                opacity: 0.5;
            }
            30% {
                opacity: 0.8;
            }
            100% {
                opacity: 1;
            }
        }
        /* ani */
        @keyframes ani_bottomTotop {
            0% {
                transform: translateY(32px);
                opacity: 0.2;
            }
            20% {
                opacity: 0.5;
            }
            30% {
                opacity: 0.8;
            }
            100% {
                opacity: 1;
            }
        }
        @-webkit-keyframes ani_topTobuttom {
            0% {
                transform: translateY(-32px);
                opacity: 0.2;
            }
            20% {
                opacity: 0.5;
            }
            30% {
                opacity: 0.8;
            }
            100% {
                opacity: 1;
            }
        }
        @-webkit-keyframes ani_hideToShow {
            0% {
                display:none;
                opacity: 0.2;
            }
            20% {
                opacity: 0.5;
            }
            30% {
                opacity: 0.8;
            }
            100% {
                opacity: 1;
            }
        }
        @-webkit-keyframes ani_showToHide {
            0% {
                display:none;
                opacity: 1;
            }
            20% {
                opacity: 0.8;
            }
            30% {
                opacity: 0.5;
            }
            100% {
                opacity: 0.3;
            }
        }
        .aniDelete {
            transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
            opacity: 0.1;
        }
    `;

    const context = {
        flushFragment: new FlushDomFragment()
    }
    main();
    function main() {
        reloadScrollbar();
        // 注册菜单项
        registerMenuCommand();
        // 等待body加载完成
        safeWaitFunc("body", () => {
            retryInterval(() => {
                if (!mountSettingModal()) return false;
                reloadNodeParam();
                reloadRules();
                reloadBasicSettingsPage();
                reloadSolidPage();
                addEventListenerAll();
                return true;
            }, 200, true);
            // retryInterval(() => {
            //     context.flushFragment.flush();
            //     debug("reload");
            //     return true;
            // }, 200, true);
            // debug("retry");
            preloadGMStyle();
            context.flushFragment.flush();
        })
    }
    function reloadAllConfig() {
        const res = GM_getValue(ELCONFIG);
        debug(res);
        if (res && (res !== 'undefined' && res !== 'null')) {
            try {
                data = JSON.parse(res);
            } catch (e) {
                data = res;
            }
        } else {
            data = DefaultConfig;
            debug("default", data);
        }
    }
    function reloadScrollbar() {
        debug(data.rule.config);
        const globalConfig = data.rule.config[data.rule.default];
        const isCodeSetting = globalConfig && parseBoolean(globalConfig.enable);
        addCustomStyle(isCodeSetting);
        if (!isCodeSetting) {
            const { width, height, radius, background } = data.scrollbar;
            const style = `
                ::-webkit-scrollbar{width:${width}px;height:${height}px;}::-webkit-scrollbar-thumb{border: 2px solid transparent;border-radius:${radius}px;background:${background} content-box;}::-webkit-scrollbar-track{box-shadow:none;}
            `
            GM_addStyle(style);
            // context.flushFragment.insert(createStyleElement(style, "eliauk-custom-style"), 'head', {
            //     isReload: true
            // });
        }
    }
    function reloadNodeParam() {
        nodes = {
            scrollbar: {
                width: {
                    comp: $one("#scrollbar-width"),
                    text: $one("#scrollbar-width-text")
                },
                height: {
                    comp: $one("#scrollbar-height"),
                    text: $one("#scrollbar-height-text")
                },
                radius: {
                    comp: $one("#scrollbar-radius"),
                    text: $one("#scrollbar-radius-text")
                }
            },
            color: {
                solid: {
                    color: {
                        comp: $one("#solid-color"),
                        text: $one("#solid-color-text")
                    }
                },
                gradient: {
                    color: {
                        comp: $one("#gradient-color"),
                        text: $one("#gradient-color-text")
                    },
                    length: {
                        text: $one("#gradient-lenght")
                    },
                    step: {
                        comp: $one("#gradient-step"),
                        text: $one("#gradient-step-text")
                    },
                    direction: {
                        comp: $one("#gradient-direction"),
                        text: $one("#gradient-direction-text")
                    }
                }
            }
        }

        scrollbarY = $one("#eliauk-container .context .context-y");
        scrollbarX = $one("#eliauk-container .context .context-x");
        ruleTitles = $one("#rule-list-title-collapse .arco-textarea");
        ruleConfig = $one("#rule-list-config-collapse");
    }

    // 添加所有监听器
    function addEventListenerAll() {
        // 渐变方向滑动输入事件
        nodes.color.gradient.direction.comp.addEventListener("input", function () {
            // debug("input", this.value);
            nodes.color.gradient.direction.text.value = `${this.value}deg`;
            data.scrollbar.color.gradient.direction = this.value;
            reloadGradientPreviewBackground();
        })
        // 渐变位置滑动输入事件
        nodes.color.gradient.step.comp.addEventListener("input", function () {
            // debug("input", this.value);
            let total = this.max - this.min;
            let effset = Math.round((this.value * 100) / total);
            nodes.color.gradient.step.text.value = `${effset}%`;
            const color = data.scrollbar.color.gradient.steps[this.value] ?
                  data.scrollbar.color.gradient.steps[this.value] : data.scrollbar.color.default;
            nodes.color.gradient.color.comp.value = color;
            nodes.color.gradient.color.text.value = color;
        })
        // 纯色颜色输入框事件
        nodes.color.solid.color.comp.addEventListener('input', function () {
            // debug(this.value);
            nodes.color.solid.color.text.value = this.value;
            data.scrollbar.color.solid = this.value;
            resetPreviewBackground(this.value);
        })
        // 渐变颜色输入框事件
        nodes.color.gradient.color.comp.addEventListener('input', function () {
            // debug(this.value);
            nodes.color.gradient.color.text.value = this.value;
            const linear = nodes.color.gradient.step.comp.value;
            data.scrollbar.color.gradient.steps[linear] = this.value;
            reloadGradientPreviewBackground();
        });
        $all("#eliauk-container .close-button").forEach((element) => {
            element.addEventListener("click", closePanel);
        });
        $one("#eliauk-container .confirm-button").addEventListener("click", function () {
            debug(data);
            GM_setValue(ELCONFIG, JSON.stringify(data));
            setTimeout(function () {
                window.location.reload();
            }, 200);
        });
        // 按钮数组输入框
        $all("#eliauk-container .arco-input-number-mode-button").forEach(ele => {
            const wrapper_input = $one(".arco-input-wrapper > .arco-input", ele);
            const prepend_button = $one(".arco-input-prepend > .arco-btn", ele);
            const append_button = $one(".arco-input-append > .arco-btn", ele);
            const max = Number(wrapper_input.max) || Infinity;
            const min = Number(wrapper_input.min) || -Infinity;
            const step = Number(wrapper_input.step) || 1;
            prepend_button.addEventListener("click", () => {
                if (Number(wrapper_input.value) > min) {
                    wrapper_input.value = Number(wrapper_input.value) - step;
                    wrapper_input.dispatchEvent(new Event('change'))
                }
            })
            append_button.addEventListener("click", () => {
                if (Number(wrapper_input.value) < max) {
                    wrapper_input.value = Number(wrapper_input.value) + step;
                    wrapper_input.dispatchEvent(new Event('change'))
                }
            })
        })
        // 单选组
        $all("#eliauk-container .arco-radio-group-button").forEach(group => {
            $all(".arco-radio-button", group).forEach(ele => {
                ele.addEventListener('click', function (e) {
                    e.preventDefault();
                    $one(".arco-radio-checked", group).classList.remove("arco-radio-checked");
                    this.classList.add("arco-radio-checked");
                    group.dispatchEvent(new Event('select'));
                })
            })
        })
        // 滑动输入条
        $all("#eliauk-container .eliauk-slider").forEach(ele => {
            redrawSliderStyle(ele);
            ele.addEventListener("input", () => redrawSliderStyle(ele));
            ele.addEventListener("mousewheel", function (e) {
                e.preventDefault();
                const symbol = e.wheelDelta < 0 ? -1 : 1;
                const step = Number(ele.step) || 1;
                this.value = Number(this.value) + (symbol * step);
                this.dispatchEvent(new Event('input'));
            })
        });

        // 滚动条y方向宽度
        nodes.scrollbar.width.comp.addEventListener("input", function () {
            scrollbarY.style.width = `${this.value}px`;
            data.scrollbar.width = this.value;
            nodes.scrollbar.width.text.value = this.value
        })
        // 滚动条x方向高度
        nodes.scrollbar.height.comp.addEventListener("input", function () {
            scrollbarX.style.height = `${this.value}px`;
            data.scrollbar.height = this.value;
            nodes.scrollbar.height.text.value = this.value;
        })
        // 滚动条圆角值
        nodes.scrollbar.radius.comp.addEventListener("input", function () {
            // debug("input", this.value);
            scrollbarX.style.borderRadius = `${this.value}px`;
            scrollbarY.style.borderRadius = `${this.value}px`;
            data.scrollbar.radius = this.value;
            nodes.scrollbar.radius.text.value = this.value
        })
        // 基础、高级切换按钮
        $one("#eliauk-container .page-collapse-btn").addEventListener("click", function () {
            // debug(this);
            // debug(this.classList.value);
            const aside = $one("#eliauk-container .page-collapse");
            if (this.classList.contains("page-collapse-btn-collapse")) {
                this.classList.remove("page-collapse-btn-collapse");
                aside.classList.remove("page-collapse-collapse");
                $one("#page-title").innerText = "高级设置";
            } else {
                this.classList.add("page-collapse-btn-collapse")
                aside.classList.add("page-collapse-collapse");
                $one("#page-title").innerText = "基础设置";
            }
        })
        $all("#eliauk-container .arco-collapse").forEach(coll => {
            // 事件委派
            coll.addEventListener("input", ev => {
                debug(ev);
                const $ev = ev || window.event;
                const target = $ev.target || $ev.srcElement;
                if (target.classList.contains("arco-textarea")) {
                    debug(target);
                    const titleComp = $one(`#rule-list-config-collapse .arco-collapse-item-header-title[data-v="${target.dataset.v}"]`, coll);
                    if (!titleComp) return;
                    const title = titleComp.innerText;
                    debug(title, target.value);
                    if (!data.rule.config[title]) {
                        data.rule.config[title] = {};
                    }
                    data.rule.config[title].style = target.value;
                }
            })
            coll.addEventListener("click", ev => {
                const $ev = ev || window.event;
                const target = $ev.target || $ev.srcElement;
                // debug(target);
                if (isClickSwitch(target)) {
                    arcoSwitchChange(target, coll);
                    return;
                }
                if (isClickCollapseItemHeader(target)) {
                    arcoCollapseItemHeaderClick(target, coll);
                    return;
                }
            })
        });
        ruleTitles.addEventListener("change", () => {
            // debug(JSON.stringify(ruleTitles.value));
            data.rule.titles = ruleTitles.value
                .split(";")
                .map(val => val.trim())
                .filter(val => !!val);
            // debug(new RegExp(data.rule.titles[0]).test("https://.tbilibili.com"));
        })

        $one(`#rule-list-title-collapse .arco-collapse-item.arco-collapse-item-active
            .arco-collapse-item-header`).addEventListener("click", function () {
            clearChilrenNodes(ruleConfig);
            // debug(title);
            const titles = [...data.rule.default, ...data.rule.titles];
            titles.forEach(item => {
                const data_v = generateMixed(6);
                const text_value = data.rule.config[item]?.style || "";
                ruleConfig.insertAdjacentHTML('beforeend', `
                    <div class="arco-collapse-item" data-v="${data_v}">
                        <div role="button" aria-disabled="false" aria-expanded="false" tabindex="0"
                            class="arco-collapse-item-header arco-collapse-item-header-left" data-v="${data_v}">
                            <span class="arco-icon-hover arco-collapse-item-icon-hover">
                                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    stroke="currentColor"
                                    class="arco-icon arco-icon-right arco-collapse-item-expand-icon"
                                    stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"  data-v="${data_v}">
                                    <path d="m16 39.513 15.556-15.557L16 8.4"></path>
                                </svg>
                            </span>
                            <div class="arco-collapse-item-header-title" data-v="${data_v}">${item.trim()}</div>
                            <div class="arco-collapse-item-header-extra">
                                <button type="button" role="switch" onchange="ruleConfigSwitch(this)" aria-checked="${!!data.rule.config[item]?.enable}" class="arco-switch arco-switch-type-circle arco-switch-small${!!data.rule.config[item]?.enable ? " arco-switch-checked" : " "}" data-v="${data_v}">
                                    <span class="arco-switch-handle" data-v="${data_v}">
                                        <span class="arco-switch-handle-icon" data-v="${data_v}"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div role="region" class="arco-collapse-item-content">
                            <div class="arco-collapse-item-content-box">
                                <div class="arco-textarea-wrapper arco-textarea-scroll">
                                    <textarea class="arco-textarea" style="resize: none; overflow: auto;" data-v="${data_v}">${text_value}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });
            // debug(list);
            // $one("#rule-list-config-collapse");
        })
    }

    function mountSettingModal() {
        if (document.body === null) return false;
        if ($one("#eliauk-container") !== null) return true;
        const Container = document.createElement("div");
        Container.id = "eliauk-container";
        Container.innerHTML = `
        <div class="arco-modal">
            <div class="arco-modal-header">
                <div class="arco-modal-title arco-modal-title-align-center">
                    <div class="aside-top">
                        <button type="button"
                            class="page-collapse-btn-collapse arco-btn arco-btn-secondary arco-btn-shape-circle arco-btn-size-large arco-btn-status-normal page-collapse-btn">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                                stroke="currentColor" class="arco-icon arco-icon-up" stroke-width="4"
                                stroke-linecap="butt" stroke-linejoin="miter">
                                <path d="M39.6 30.557 24.043 15 8.487 30.557"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div tabindex="-1" role="button" aria-label="Close" class="close-button arco-modal-close-btn">
                    <span class="arco-icon-hover">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"
                            class="arco-icon arco-icon-close" stroke-width="4" stroke-linecap="butt"
                            stroke-linejoin="miter">
                            <path d="M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142"></path>
                        </svg>
                    </span>
                </div>
            </div>
            <div class="arco-modal-body">
                <div class="arco-divider arco-divider-horizontal arco-divider-with-text">
                    <span id="page-title" class="arco-divider-text arco-divider-text-left">基础设置</span>
                </div>
                <div class="page">
                    <div class="page-one page-collapse page-collapse-collapse">
                        <div id="rule-list-title-collapse" class="arco-collapse">
                            <div class="arco-collapse-item arco-collapse-item-active" data-v="111">
                                <div role="button" aria-disabled="false" aria-expanded="true" tabindex="0"
                                    class="arco-collapse-item-header arco-collapse-item-header-left" data-v="111">
                                    <span class="arco-icon-hover arco-collapse-item-icon-hover">
                                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                                            stroke="currentColor"
                                            class="arco-icon arco-icon-right arco-collapse-item-expand-icon"
                                            stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" data-v="111">
                                            <path d="m16 39.513 15.556-15.557L16 8.4"></path>
                                        </svg>
                                    </span>
                                    <div class="arco-collapse-item-header-title" data-v="111">
                                        域名列表
                                    </div>
                                </div>
                                <div role="region" class="arco-collapse-item-content">
                                    <div class="arco-collapse-item-content-box">
                                        <div class="arco-textarea-wrapper arco-textarea-scroll">
                                            <textarea class="arco-textarea"
                                                style="resize: none; overflow: auto;"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="rule-list-config-collapse" class="arco-collapse"></div>
                    </div>
                    <div class="page-two">
                        <form class="arco-form arco-form-layout-horizontal arco-form-size-mini">
                            <div class="arco-row arco-row-align-start arco-row-justify-start">
                                <div class="arco-col arco-col-24">
                                    <div
                                        class="arco-row arco-row-nowrap arco-row-align-start arco-row-justify-start arco-form-item arco-form-item-layout-horizontal">
                                        <div class="arco-col arco-form-item-label-col" style="flex: 0 0 110px">
                                            <label class="arco-form-item-label">滚动条宽度(px)</label>
                                        </div>
                                        <div class="arco-col arco-form-item-wrapper-col">
                                            <div class="arco-form-item-content-wrapper">
                                                <div class="arco-form-item-content arco-form-item-content-flex">
                                                    <span class="arco-input-wrapper eliauk-input-number"
                                                        style="flex: 0 0 60px;">
                                                        <input id="scrollbar-width-text" type="text" value="6"
                                                            class="arco-input arco-input-size-mini" disabled />
                                                    </span>
                                                    <div class="eliauk-slider-context"
                                                        style="flex: 1; margin-left: 15px;">
                                                        <input id="scrollbar-width" type="range" value="6" min="0"
                                                            max="30" step="1" class="eliauk-slider" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="arco-col arco-col-24">
                                    <div
                                        class="arco-row arco-row-nowrap arco-row-align-start arco-row-justify-start arco-form-item arco-form-item-layout-horizontal">
                                        <div class="arco-col arco-form-item-label-col" style="flex: 0 0 110px">
                                            <label class="arco-form-item-label">滚动条高度(px)</label>
                                        </div>
                                        <div class="arco-col arco-form-item-wrapper-col">
                                            <div class="arco-form-item-content-wrapper">
                                                <div class="arco-form-item-content arco-form-item-content-flex">
                                                    <span class="arco-input-wrapper eliauk-input-number"
                                                        style="flex: 0 0 60px;">
                                                        <input id="scrollbar-height-text" value="6" type="text"
                                                            class="arco-input arco-input-size-mini" disabled />
                                                    </span>
                                                    <div class="eliauk-slider-context"
                                                        style="flex: 1; margin-left: 15px;">
                                                        <input id="scrollbar-height" type="range" value="6" min="0"
                                                            max="30" step="1" class="eliauk-slider" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="arco-col arco-col-24">
                                    <div
                                        class="arco-row arco-row-nowrap arco-row-align-start arco-row-justify-start arco-form-item arco-form-item-layout-horizontal">
                                        <div class="arco-col arco-form-item-label-col" style="flex: 0 0 110px">
                                            <label class="arco-form-item-label">滚动条弧度(px)</label>
                                        </div>
                                        <div class="arco-col arco-form-item-wrapper-col">
                                            <div class="arco-form-item-content-wrapper">
                                                <div class="arco-form-item-content arco-form-item-content-flex">
                                                    <span class="arco-input-wrapper eliauk-input-number"
                                                        style="flex: 0 0 60px;">
                                                        <input id="scrollbar-radius-text" value="10" type="text"
                                                            class="arco-input arco-input-size-mini" disabled />
                                                    </span>
                                                    <div class="eliauk-slider-context"
                                                        style="flex: 1; margin-left: 15px;">
                                                        <input id="scrollbar-radius" type="range" value="10" min="0"
                                                            max="15" step="0.1" class="eliauk-slider" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="arco-divider arco-divider-horizontal arco-divider-with-text">
                                <span class="arco-divider-text arco-divider-text-left">颜色</span>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <span onselect="colorSelect(this)"
                                    class="arco-radio-group-button arco-radio-group-size-mini arco-radio-group-direction-horizontal">
                                    <label class="arco-radio-button arco-radio-checked">
                                        <input type="radio" class="arco-radio-target" value="SolidColor">
                                        <span class="arco-radio-button-content">纯色</span>
                                    </label>
                                    <label class="arco-radio-button">
                                        <input type="radio" class="arco-radio-target" value="GradientColor">
                                        <span class="arco-radio-button-content">渐变色</span>
                                    </label>
                                </span>
                            </div>
                            <div id="solid-color-page" class="arco-row arco-row-align-start arco-row-justify-start">
                                <div class="arco-col arco-col-24">
                                    <div
                                        class="arco-row arco-row-nowrap arco-row-align-start arco-row-justify-start arco-form-item arco-form-item-layout-horizontal">
                                        <div class="arco-col arco-form-item-label-col" style="flex: 0 0 110px">
                                            <label class="arco-form-item-label">滚动条颜色(hex)</label>
                                        </div>
                                        <div class="arco-col arco-form-item-wrapper-col">
                                            <div class="arco-form-item-content-wrapper">
                                                <div class="arco-form-item-content arco-form-item-content-flex">
                                                    <span
                                                        class="arco-input-outer arco-input-outer-size-mini arco-input-search">
                                                        <span class="arco-input-wrapper" style="flex: 0 0 90px;">
                                                            <input class="arco-input arco-input-size-mini" type="text"
                                                                id="solid-color-text" value="#f2f3f5" disabled />
                                                        </span>
                                                        <span class="arco-input-append" style="width:30px">
                                                            <input value="#f2f3f5" type="color" id="solid-color"
                                                                class="color arco-btn-size-mini" />
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="gradient-color-page" class="arco-row arco-row-align-start arco-row-justify-start"
                                style="display: none;">
                                <div class="arco-col arco-col-24">
                                    <div
                                        class="arco-row arco-row-nowrap arco-row-align-start arco-row-justify-start arco-form-item arco-form-item-layout-horizontal">
                                        <div class="arco-col arco-form-item-label-col" style="flex: 0 0 110px">
                                            <label class="arco-form-item-label">滚动条渐变长度</label>
                                        </div>
                                        <div class="arco-col arco-form-item-wrapper-col">
                                            <div class="arco-form-item-content-wrapper">
                                                <div class="arco-form-item-content arco-form-item-content-flex">
                                                    <span style="flex: 0 0 90px"
                                                        class="arco-input-outer arco-input-outer-size-mini arco-input-number arco-input-number-mode-button arco-input-number-size-mini">
                                                        <span class="arco-input-prepend">
                                                            <button type="button"
                                                                class="arco-btn arco-btn-secondary arco-btn-shape-square arco-btn-size-mini arco-btn-status-normal arco-btn-only-icon arco-input-number-step-button">
                                                                <span class="arco-btn-icon">
                                                                    <svg viewBox="0 0 48 48" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        stroke="currentColor"
                                                                        class="arco-icon arco-icon-minus"
                                                                        stroke-width="4" stroke-linecap="butt"
                                                                        stroke-linejoin="miter">
                                                                        <path d="M5 24h38"></path>
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        </span>
                                                        <span class="arco-input-wrapper">
                                                            <input id="gradient-lenght"
                                                                onchange="gradientLenghtChange(this)"
                                                                class="arco-input arco-input-size-mini" value="1"
                                                                type="text" min="1" max="10" disabled />
                                                        </span>
                                                        <span class="arco-input-append">
                                                            <button
                                                                class="arco-btn arco-btn-secondary arco-btn-shape-square arco-btn-size-mini arco-btn-status-normal arco-btn-only-icon arco-input-number-step-button"
                                                                type="button">
                                                                <span class="arco-btn-icon">
                                                                    <svg viewBox="0 0 48 48" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        stroke="currentColor"
                                                                        class="arco-icon arco-icon-plus"
                                                                        stroke-width="4" stroke-linecap="butt"
                                                                        stroke-linejoin="miter">
                                                                        <path d="M5 24h38M24 5v38"></path>
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        </span>
                                                    </span>
                                                    <span style="margin-left: 5px;"
                                                        class="arco-input-outer arco-input-outer-size-mini arco-input-search">
                                                        <span class="arco-input-wrapper">
                                                            <input class="arco-input arco-input-size-mini" type="text"
                                                                id="gradient-color-text" value="#f2f3f5" disabled />
                                                        </span>
                                                        <span class="arco-input-append" style="width:30px">
                                                            <input value="#f2f3f5" type="color" id="gradient-color"
                                                                class="color arco-btn-size-mini" />
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="arco-col arco-col-24">
                                    <div
                                        class="arco-row arco-row-nowrap arco-row-align-start arco-row-justify-start arco-form-item arco-form-item-layout-horizontal">
                                        <div class="arco-col arco-form-item-label-col" style="flex: 0 0 110px">
                                            <label class="arco-form-item-label">滚动条渐变位</label>
                                        </div>
                                        <div class="arco-col arco-form-item-wrapper-col">
                                            <div class="arco-form-item-content-wrapper">
                                                <div class="arco-form-item-content arco-form-item-content-flex">
                                                    <span class="arco-input-wrapper eliauk-input-number"
                                                        style="flex: 0 0 60px;">
                                                        <input id="gradient-step-text" value="0%" type="text"
                                                            class="arco-input arco-input-size-mini" disabled />
                                                    </span>
                                                    <div class="eliauk-slider-context"
                                                        style="flex: 1; margin-left: 15px;">
                                                        <input id="gradient-step" type="range" value="0" min="0" max="1"
                                                            step="1" class="eliauk-slider" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="arco-col arco-col-24">
                                    <div
                                        class="arco-row arco-row-nowrap arco-row-align-start arco-row-justify-start arco-form-item arco-form-item-layout-horizontal">
                                        <div class="arco-col arco-form-item-label-col" style="flex: 0 0 110px">
                                            <label class="arco-form-item-label">滚动条渐变方向</label>
                                        </div>
                                        <div class="arco-col arco-form-item-wrapper-col">
                                            <div class="arco-form-item-content-wrapper">
                                                <div class="arco-form-item-content arco-form-item-content-flex">
                                                    <span class="arco-input-wrapper eliauk-input-number"
                                                        style="flex: 0 0 60px;">
                                                        <input id="gradient-direction-text" value="0deg"
                                                            class="arco-input arco-input-size-mini" type="text"
                                                            disabled />
                                                    </span>
                                                    <div class="eliauk-slider-context"
                                                        style="flex: 1; margin-left: 15px;">
                                                        <input id="gradient-direction" type="range" value="0" min="0"
                                                            max="360" step="1" class="eliauk-slider" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="arco-divider arco-divider-horizontal arco-divider-with-text">
                            <span class="arco-divider-text arco-divider-text-left">预览</span>
                        </div>
                        <div class="context">
                            <div class="context-x"></div>
                            <div class="context-y"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="arco-modal-footer">
                <button type="button"
                    class="close-button arco-btn arco-btn-secondary arco-btn-shape-square arco-btn-size-mini arco-btn-status-normal">
                    取消
                </button>
                <button type="button"
                    class="confirm-button arco-btn arco-btn-primary arco-btn-shape-square arco-btn-size-mini arco-btn-status-normal">
                    确定
                </button>
            </div>
        </div>
        `;
        try {
            document.body.appendChild(Container);
        } catch (e) {
            debug(e);
        }
    }

    function closePanel() {
        debug("触发取消按钮");
        document.querySelector("#eliauk-container").style.display = "none";
    }

    // 注册脚本菜单
    function registerMenuCommand() {
        const currentList = GM_getValue(CURRENT_LIST, []);
        // 清除之前的
        clearCommand(currentList);
        currentList.push(GM_registerMenuCommand(`⚙️网页美化设置`, () => {
            $one("#eliauk-container").style.display = "block";
        }));
        currentList.push(GM_registerMenuCommand(`🔄脚本重置 - 修复脚本`, () => {
            GM_setValue(ELCONFIG, undefined);
            location.reload();
        }))
        GM_setValue(CURRENT_LIST, currentList);
    }

    // 清除所有菜单项
    function clearCommand(list) {
        while (list.length) {
            GM_unregisterMenuCommand(list.shift());
        }
    }

    // 检查是否存在于名单中 返回配置
    function getStyle(configs, url) {
        debug(configs);
        const conf = [];
        Object.entries(configs).forEach(([reg, config]) => {
            debug(reg, config);
            debug(new RegExp(reg), url)
            debug(new RegExp(reg).test(url), parseBoolean(config.enable))
            if (new RegExp(reg).test(url) && parseBoolean(config.enable)) {
                conf.push(config.style);
            }
        });
        const style = conf.join(" ");
        debug(conf);
        return style;
    }

    // 选择开关切换事件
    function arcoSwitchChange(target, element) {
        // debug(target);
        const btn = $one(`.arco-switch[data-v="${target.dataset.v}"]`, element);
        if (!btn) return;
        if (btn.classList.contains("arco-switch-checked")) {
            btn.classList.remove("arco-switch-checked");
            btn.setAttribute("aria-checked", false);
        } else {
            btn.classList.add("arco-switch-checked");
            btn.setAttribute("aria-checked", true);
        }
        btn.dispatchEvent(new Event('change'));
    }

    function isClickSwitch(target) {
        return [
            'arco-switch',
            'arco-switch-handle',
            'arco-switch-handle-icon'
        ].some(item => target.classList.contains(item));
    }
    function isClickCollapseItemHeader(target) {
        return [
            'arco-collapse-item-header',
            'arco-collapse-item-header-title',
            'arco-collapse-item-expand-icon'
        ].some(item => target.classList.contains(item));
    }
    function arcoCollapseItemHeaderClick(target, coll) {
        const header = $one(`.arco-collapse-item[data-v="${target.dataset.v}"]`, coll)
        if (!header) return;
        const isActive = header.classList.contains("arco-collapse-item-active");
        if (isActive) {
            header.classList.remove("arco-collapse-item-active");
        } else {
            const active = $one(".arco-collapse-item.arco-collapse-item-active", coll);
            if (active) {
                active.classList.remove("arco-collapse-item-active");
            }
            header.classList.add("arco-collapse-item-active");
        }
    }

    // debug(data.rule.titles.join(";\n"));

    // 清除子节点
    function clearChilrenNodes(ele) {
        var len = ele.childNodes.length; // 子元素的个数
        for (var i = len - 1; i >= 0; i--) { // 从后往前
            ele.removeChild(ele.childNodes[i]); // 从第一个元素开始删除
        }
    }

    //生成n位数字字母混合字符串
    function generateMixed(n) {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                       'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                       'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                      ];
        let res = "";
        for (let i = 0; i < n; i++) {
            const id = Math.floor(Math.random() * chars.length);
            res += chars[id];
        }
        return res;
    }
    function preloadGMStyle() {
        function loadResource(resourceName) {
            const data = GM_getResourceText(resourceName)
            GM_addStyle(data);
        }
        loadResource("ArcoDesignStyle");
        // 添加全局样式
        GM_addStyle(globalStyle);
    }

    function addCustomStyle(isCodeSetting) {
        if (!isCodeSetting) {
            safeRemove("style[class='eliauk-user-style']");
        } else {
            const customStyle = getStyle(data.rule.config, hostname)
            if (customStyle) {
                context.flushFragment.insert(createStyleElement(customStyle, "eliauk-user-style"), 'head', {
                    isReload: true
                })
            }
        }
        context.flushFragment.insert(createStyleElement(aniStyle, "eliauk-animation-style"))
    }
})();