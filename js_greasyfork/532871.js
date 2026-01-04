// ==UserScript==
// @name         超星按题目的差异度排序
// @namespace    http://tampermonkey.net/
// @version      2025-12-19-002
// @description  差异度越小的，排在前面。建议（1）当前页显示条目数设置为最大 （2）打开“显示题目详情”选项。
// @author       周利斌
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/qbank/questionlist?courseid=*
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/exam/preFetchQFromExamQuestionBank?paperId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532871/%E8%B6%85%E6%98%9F%E6%8C%89%E9%A2%98%E7%9B%AE%E7%9A%84%E5%B7%AE%E5%BC%82%E5%BA%A6%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/532871/%E8%B6%85%E6%98%9F%E6%8C%89%E9%A2%98%E7%9B%AE%E7%9A%84%E5%B7%AE%E5%BC%82%E5%BA%A6%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

// https://greasyfork.org/zh-CN/scripts/532871-%E8%B6%85%E6%98%9F%E6%8C%89%E9%A2%98%E7%9B%AE%E7%9A%84%E5%B7%AE%E5%BC%82%E5%BA%A6%E6%8E%92%E5%BA%8F
// 立即执行函数表达式，创建一个独立的作用域，防止全局变量污染
(async function () {


    "use strict";
    console.log(111)
    const getValue = window.GM_getValue && typeof GM_getValue !== "undefined" ? GM_getValue : (key, value) => (localStorage.getItem(key) === null ? value : JSON.parse(localStorage.getItem(key)));
    const setValue = window.GM_setValue && typeof GM_setValue !== "undefined" ? GM_setValue : (key, value) => localStorage.setItem(key, JSON.stringify(value));
    const sleep = (ms, val = true) => new Promise(r => setTimeout(() => r(val), ms));
    const delay = (ms, call, ...args) => new Promise((r, j) => setTimeout(async () => { try { r(await (typeof call === 'function' ? call(...args) : call)) } catch (e) { j(e) } }, ms));

    /**
   * Create (or return if exists) a floating control panel with optional font-size controls,
   * draggable handle, and a close button. Position and font-size are persisted by `id`.
   *
   * @param {Object} [options={}] - Panel options
   * @param {string} [options.id='_zlb_root_div_'] - Unique DOM id for the panel container
   * @param {boolean} [options.fontsize=true] - Whether to render font-size controls
   * @param {boolean} [options.drag=true] - Whether to render a draggable handle
   * @param {boolean|function} [options.close=true] - true to show a default close button; a function to run before removal
   * @param {keyof HTMLElementTagNameMap} [options.tagName='button'] - Tag name for interactive controls
   * @returns {HTMLDivElement} The panel DOM element
   */
    function getPanel({
        id = '_zlb_root_div_',
        fontsize = true,
        drag = true,
        close = true,
        tagName = 'button',
        parent = undefined
    } = {}) {
        const closeButtonId = id + '_close_';
        const closeCallBack = []
        const dragButtonId = id + '_drag_';
        const font1ButtonId = id + '_font1_';
        const font2ButtonId = id + '_font2_';
        let panelElement = document.getElementById(id);

        function createCloseButton(host) {
            if (!close) return;
            if (typeof close === 'function') closeCallBack.push(close);
            if (host.querySelector("#" + closeButtonId)) return
            appendTo(
                { parent: host, id: closeButtonId },
                tagName,
                'X关闭X',
                () => {
                    for (const ccb of closeCallBack) ccb()
                    host.remove();
                }
            )
        } // Font-size controls
        function createFontButton(panelElement) {
            if (panelElement.querySelector("#" + font1ButtonId)) return;
            if (fontsize) {
                appendTo(panelElement, tagName, '-字号-', () => {
                    currentFontSize = Math.max(6, currentFontSize * 0.9);
                    setValue(id + ':fs', currentFontSize);
                    updatePanelStyles();
                }, font1ButtonId);
                appendTo(panelElement, tagName, '+字号+', () => {
                    currentFontSize = currentFontSize * 1.1;
                    setValue(id + ':fs', currentFontSize);
                    updatePanelStyles();
                }, font2ButtonId);
            }
        }   // Drag handle
        function createDragButton(host) {
            if (!drag) return
            console.log(host)
            if (host.querySelector("#" + dragButtonId)) return;
            const dragHandleButton = appendTo(panelElement, tagName, '✥拖动✥', "", dragButtonId);
            dragHandleButton.addEventListener('mousedown', (event) => {
                const rect = panelElement.getBoundingClientRect();
                const deltaX = event.clientX - rect.left;
                const deltaY = event.clientY - rect.top;

                const moveHandler = (moveEvent) => {
                    panelElement.style.left = (moveEvent.clientX - deltaX) + 'px';
                    panelElement.style.top = (moveEvent.clientY - deltaY) + 'px';
                };

                const upHandler = () => {
                    document.removeEventListener('mousemove', moveHandler);
                    document.removeEventListener('mouseup', upHandler);

                    const leftInPercent =
                        (parseFloat(panelElement.style.left) / document.documentElement.clientWidth) * 100;
                    const topInPercent =
                        (parseFloat(panelElement.style.top) / document.documentElement.clientHeight) * 100;

                    leftPercent = Math.min(Math.max(leftInPercent, 0), 95);
                    topPercent = Math.min(Math.max(topInPercent, 0), 95);

                    // Persist and reflect
                    panelElement.style.left = leftPercent + '%';
                    panelElement.style.top = topPercent + '%';
                    setValue(id + ':L', leftPercent);
                    setValue(id + ':T', topPercent);
                    updatePanelStyles();
                };

                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', upHandler);
            });

        }


        // If panel already exists, optionally add/refresh close button and return it.
        if (panelElement) {
            createCloseButton(panelElement);
            createDragButton(panelElement);
            createFontButton(panelElement);
            return /** @type {HTMLDivElement} */ (panelElement);
        }

        // Build panel container
        panelElement = document.createElement('div');
        panelElement.id = id;
        panelElement.classList.add('notranslate');
        panelElement.setAttribute('translate', 'no');
        panelElement.onmousedown = panelElement.oncontextmenu = (event) => event.stopPropagation();
        if (parent) { parent.appendChild(panelElement) }
        else document.body.appendChild(panelElement);


        // Persistent state
        let currentFontSize = Number(getValue(id + ':fs', 12));
        let leftPercent = Math.min(Math.max(Number(getValue(id + ':L', 50)), 0), 95);
        let topPercent = Math.min(Math.max(Number(getValue(id + ':T', 50)), 0), 95);

        // Style element
        const styleElement = document.createElement('style');
        panelElement.appendChild(styleElement);
        /**
         * Update the panel CSS rule (initial position, size, look).
         */
        function updatePanelStyles() {
            console.log(currentFontSize)
            styleElement.textContent =
                `div#${id}{
                    position:fixed;
                    z-index:999999;
                    background-color:rgba(187, 180, 180, 0.9);
                    border:1px solid rgba(191, 70, 173, 0.9);
                    max-width:50vw;
                    left:${leftPercent}%;
                    top:${topPercent}%;
                    user-select:none;
                    font-size:${currentFontSize}px;
                    display:flex;
                    flex-wrap:wrap;
                }
                #${id} button{
                    border-radius:${currentFontSize}px;
                    min-width:auto;
                    display: inline-flex;
                    padding:0 4px;
                    font-size:${currentFontSize}px;
                }
                #${id} span{
                    margin:0 2px;
                    font-size:${currentFontSize}px;
                }
                #${id} label{
                    margin:0px 2px;
                    display: inline-flex;
                    border:1px solid rgba(117,70,227,.7);
                    border-radius:${currentFontSize}px;
                    font-size:${currentFontSize}px;
                }`;
        }

        updatePanelStyles();
        createDragButton(panelElement)
        createCloseButton(panelElement);
        createFontButton(panelElement)

        // Optional auto-clean if panel has no interactive children (only <style>)
        setTimeout(() => {
            if (panelElement.children.length <= 1 + !!fontsize * 2 + !!drag + !!close) {
                console.log(panelElement.children, { fontsize: !!fontsize * 2, drag: !!drag * 1, close: !!close * 1 }, "remove")
                panelElement.remove();
            }
        }, 100);

        return /** @type {HTMLDivElement} */ (panelElement);
    }
    /**
  * 创建或复用一个 HTML 元素，并插入到指定位置。
  *
  * 支持三种插入方式（按优先顺序）：
  * 1. `parent`：插入到该元素内部末尾；
  * 2. `afterend`：插入到该元素之后；
  * 3. `beforebegin`：插入到该元素之前。
  *
  * 可设置样式、类名、属性与事件。若指定 id 且元素已存在，则复用原元素。
  *
  * @param {Object|HTMLElement|null} [parentOrOption=null] - 父元素或配置对象。
  * @param {HTMLElement} [parentOrOption.parent] - 插入到该元素内部。
  * @param {HTMLElement} [parentOrOption.afterend] - 插入到该元素之后。
  * @param {HTMLElement} [parentOrOption.beforebegin] - 插入到该元素之前。
  * @param {keyof HTMLElementTagNameMap} [parentOrOption.tagName="a"] - 元素标签名。
  * @param {string} [parentOrOption.textContent=""] - 元素文本内容。
  * @param {Object<string,Function>} [parentOrOption.functions={}] - 事件集合。
  * @param {string|Partial<CSSStyleDeclaration>} [parentOrOption.style] - 内联样式。
  * @param {string|string[]|DOMTokenList} [parentOrOption.className|classList] - 类名。
  * @param {string} [parentOrOption.id] - 元素 ID（复用已有元素）。
  * @param {Object} [parentOrOption.other] - 其他任意属性。
  * @param {string} [tagName] - （简写模式）标签名。
  * @param {string} [textContent] - （简写模式）文本内容。
  * @param {Function} [click] - （简写模式）点击事件。
  * @param {string} [id] - （简写模式）元素 ID。
  * @returns {HTMLElement} 创建或复用的元素。
  */
    function appendTo(parentOrOption = null, tagName = null, textContent = null, click = null, id = null) {
        const isObj = parentOrOption && typeof parentOrOption === "object" && !(parentOrOption instanceof HTMLElement);
        const base = {
            ...(isObj ? parentOrOption : { parent: parentOrOption }),
            ...(tagName && { tagName }),
            ...(textContent && { textContent }),
            ...(click && { click }),
            ...(id && { id }),
        };

        const {
            parent = null,
            afterend = null,
            beforebegin = null,
            tagName: tag = "a",
            textContent: txt = "",
            id: i = "",
            functions = {},
            click: c,
            ...other
        } = base;

        let el = i && document.getElementById(i);
        if (!el) el = document.createElement(tag);

        // ✅ 插入逻辑
        if (parent instanceof HTMLElement && parent !== el.parentElement) parent.appendChild(el);
        else if (afterend instanceof HTMLElement) afterend.insertAdjacentElement("afterend", el);
        else if (beforebegin instanceof HTMLElement) beforebegin.insertAdjacentElement("beforebegin", el);

        if (i) el.id = i;
        if (txt) el.textContent = txt;

        const fns = { ...functions };
        for (const [k, v] of Object.entries(other)) {
            if (!v) continue;
            if (k === "style") typeof v === "string" ? (el.style.cssText = v) : Object.assign(el.style, v);
            else if (k === "className" || k === "classList") {
                const classes = Array.isArray(v) ? v : typeof v === "string" ? v.split(/\s+/) : [...v];
                el.classList.add(...classes.filter(Boolean));
            } else if (typeof v === "function") fns[k] = v;
            else (k in el ? (el[k] = v) : el.setAttribute(k, v));
        }

        if (c) fns.click = c;
        for (const [ev, fn] of Object.entries(fns)) el.addEventListener(ev, e => fn(e, el));

        return el;
    }
    function waitUtil(fn, timeout = 10000, interval = 50, done, ctrl = { cancelled: false }) {
        const start = Date.now();
        const timer = setInterval(() => {
            if (ctrl.cancelled) return clearInterval(timer), done?.(false);
            try {
                const result = fn();
                if (result || Date.now() - start > timeout) {
                    clearInterval(timer);
                    done?.(result || false);
                }
            } catch { clearInterval(timer), done?.(false); }
        }, interval);
        return ctrl;
    }
    function waitUtilAsync(fn, timeout = 10000, interval = 50, ctrl = { cancelled: false }) {
        return new Promise((resolve) => {
            const start = performance.now();
            (async function loop() {
                if (ctrl.cancelled) return resolve(false);
                const result = await fn();
                if (result) return resolve(result);
                if (performance.now() - start > timeout) return resolve(false);
                setTimeout(loop, interval); // ✅ 控制执行节奏，不阻塞主线程
            })();
        });
    }
    /**
     * 创建一个节流函数，该函数在指定时间间隔内最多执行一次。
     * 支持配置是否在节流周期的开始和结束时执行函数。
     *
     * @param {Function} fn - 需要节流的函数。
     * @param {number} [delay=300] - 节流的时间间隔（毫秒）。
     * @param {Object} [options={}] - 配置选项。
     * @param {boolean} [options.leading=true] - 是否在节流周期的开始时立即执行一次。默认为 true。
     * @param {boolean} [options.trailing=true] - 是否在节流周期的结束时再执行一次。默认为 true。
     * @returns {Function} - 一个新的节流函数。
     */
    function throttle(fn, delay = 300, options = {
        leading: true,
        trailing: true
    }) {
        const {
            leading = true, trailing = true
        } = options;
        let last = 0; // 上次执行的时间戳
        let timer = null; // 用于 trailing edge 的定时器
        return function (...args) {
            const now = Date.now();
            // 如果是第一次调用，并且 leading 为 false，则不立即执行
            if (!last && leading === false) {
                last = now;
            }
            const elapsed = now - last;
            // 如果距离上次执行的时间已经超过了 delay
            if (elapsed > delay) {
                // 如果存在 trailing edge 的定时器，清除它
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                // 执行函数
                fn.apply(this, args);
                // 更新 last 时间戳
                last = now;
            }
            // 如果还没到时间，并且需要 trailing edge，且当前没有定时器
            else if (!timer && trailing !== false) {
                // 设置一个定时器，在 delay - elapsed 后执行一次
                timer = setTimeout(() => {
                    timer = null;
                    fn.apply(this, args);
                    // 只有在 leading 为 true 时，才更新 last。否则，last 保持为 0，以便下次 leading 调用可以执行。
                    if (leading !== false) {
                        last = Date.now();
                    }
                }, delay - elapsed);
            }
        };
    }
    /**
     * 创建一个防抖函数。
     *
     * @param {Function} fn - 需要防抖的函数。
     * @param {number} [delay=300] - 延迟时间（毫秒）。
     * @param {Object} [options={}] - 配置选项。
     * @param {boolean} [options.leading=false] - 是否在延迟开始前立即执行一次。默认为 false。
     * @returns {Function & { cancel: Function }} - 一个新的防抖函数，该函数具有一个 `cancel` 方法。
     */
    function debounce(fn, delay = 300, options = {
        leading: false
    }) {
        const {
            leading = false
        } = options;
        let timer = null; // 存储定时器ID
        let isLeadingExecuted = false; // 标记 leading call 是否已执行
        // 定义防抖函数
        const debounced = function (...args) {
            const context = this;
            // 如果存在定时器，清除它
            if (timer) {
                clearTimeout(timer);
                isLeadingExecuted = false; // 重置 leading 标记
            }
            // 如果需要 leading call，并且它尚未执行
            if (leading && !isLeadingExecuted) {
                fn.apply(context, args);
                isLeadingExecuted = true; // 标记为已执行
            }
            // 设置新的定时器
            timer = setTimeout(() => {
                // 在延迟结束后执行函数
                fn.apply(context, args);
                // 重置状态
                timer = null;
                isLeadingExecuted = false;
            }, delay);
        };
        // 为防抖函数添加 cancel 方法
        debounced.cancel = function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
                isLeadingExecuted = false;
            }
        };
        return debounced;
    }
    /**
* 更新 HTML 元素的文本、背景色，并将状态等信息存储到元素对象上。
* 支持传入配置对象 `options` 来定制文本、状态、背景色等。
*
* @param {HTMLElement} el - 目标 HTML 元素（如 button, div, span）。
* @param {number|string} state - 当前状态，可以是数字、字符串或空字符串，表示索引或具体文本。
* @param {Object} [options={}] - 可选配置项
* @param {string} [options.text="计数器"] - 状态文本前缀。
* @param {string[]} [options.status=["已停止", "运行中"]] - 状态数组。
* @param {string[]} [options.bgcolors=[]] - 背景色数组（不足时会使用默认颜色）。
*
* @returns {number} 返回 1，表示成功。
*/
    function toggleText(el, state = "", options = {}) {
        const defaultBgColors = [
            "", "#a8d08d", "#ffb6c1", "#f0e68c", "#add8e6", "#ff6347", "#98fb98", "#7b7070", "#ffd700", "#ff1493", "#90ee90", "#ff4500", "#8a2be2", "#32cd32", "#ff8c00", "#d2691e", "#ff0000", "#b0e0e6", "#dcdcdc", "#c7c7c7"
        ];

        // 1️⃣ 默认值配置
        const { text = "", status = [], bgcolors = [] } = options;

        // 2️⃣ 初始化状态
        if (!Array.isArray(el.status)) el.status = [];
        if (Array.isArray(status) && status.length > 0) {
            for (const s of status) if (!el.status.includes(s)) el.status.push(s);
        }

        if (text) el.pre_text = text;
        else if (el.pre_text === undefined) el.pre_text = ""

        // 3️⃣ 处理 `state` 值，支持数字、字符串及空字符串
        const stateValue = (typeof state === "number" || state === "")
            ? (el.status[state] ?? status[state] ?? String(state))
            : state;

        // 如果状态不在 el.status 中，添加它
        if (!el.status.includes(stateValue)) el.status.push(stateValue);

        // 4️⃣ 获取文本和背景色的索引
        const index = el.status.findIndex(v => v === stateValue);
        const colors = bgcolors.length ? bgcolors : defaultBgColors;

        // 设置文本内容和背景颜色
        el.textContent = `${el.pre_text}${stateValue}`;
        el.style.backgroundColor = colors[index] || defaultBgColors[index] || "";

        // 5️⃣ 保存状态信息
        el.currentState = stateValue;
        el.currentIndex = index;
        el.lastUpdate = new Date();

        return 1;
    }

    /**
 *
 * @param {HTMLElement} parent
 * @param {string} key
 * @param {string[]} status
 * @param {((btn: HTMLElement) => void)[]} funcs - 与状态列表一一对应的回调函数数组
 *                                                切换到对应状态时执行，参数为当前按钮元素
 *                                                若某状态无需回调，可传入 undefined 占位
 */
    function toggleButton(parent, key, status, funcs) {
        let state = getValue(key, status[0])
        let index = status.indexOf(state)
        let btn = appendTo(parent, "button", state, () => {
            index = (index + 1) % status.length
            state = status[index]
            setValue(key, state)
            toggleText(btn, state, { status: status })
            funcs[index]?.(btn)
            btn.dataset.index = index
            btn.dataset.state = state
        })
        toggleText(btn, state, { status: status })
        funcs[index]?.(btn)
        btn.dataset.index = index
        btn.dataset.state = state
        return btn
    }
    /**
     * Toast
     * @param {string} text 提示文本
     * @param {number} [duration=2000] 自动关闭时长（0=仅手动关闭）
     * @param {boolean} [showMask=false] 是否显示遮罩
     */
    function toast(text, duration = 2000, showMask = false) {
        // 创建元素
        const el = document.createElement('div');
        const mask = showMask ? document.createElement('div') : null;

        // 样式批量设置（仅修改font-size为32px）
        el.style.cssText = `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            padding:8px 16px;background:rgba(0,0,0,0.7);color:#fff;border-radius:4px;
            font-size:32px;z-index:99999;pointer-events:auto;transition:opacity 0.3s;
            cursor:pointer
        `;
        mask && (mask.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.3);z-index:99998;pointer-events:auto;transition:opacity 0.3s;
            cursor:pointer
        `);

        // 统一关闭逻辑
        const close = () => {
            el.style.opacity = 0;
            mask && (mask.style.opacity = 0);
            setTimeout(() => {
                el.remove();
                mask && mask.remove();
            }, 300);
        };

        // 内容 + 点击事件 + 插入DOM
        el.textContent = text;
        el.onclick = close; // 点击Toast关闭
        mask && (mask.onclick = close); // 点击遮罩关闭
        mask && document.body.appendChild(mask);
        document.body.appendChild(el);

        // 自动关闭（duration>0生效）
        duration > 0 && setTimeout(close, duration);
    }

    // Your code here...
    console.log(1243)
    // await delay(2000)
    await waitUtilAsync(() => "#qbankTableHead", 3000)
    console.log(1243)

    let sort_type = 0
    let b_span_link = true
    let b_show_detail = true
    let b_show_100 = true
    let sortListByLevenshteinTimer = undefined
    // 超星加载到body上面了。因此只能放在html中
    let panel = getPanel({ parent: document.documentElement })
    toggleButton(panel, "ccc_sort_type", ["按序号排序", "按句子差异排序", '按字符差异排序'], [
        () => {
            sort_type = 0;
            if (sortListByLevenshteinTimer) { clearTimeout(sortListByLevenshteinTimer) }
            sortListByLevenshtein()
        },
        () => {
            sort_type = 1;
            if (sortListByLevenshteinTimer) { clearTimeout(sortListByLevenshteinTimer) }
            sortListByLevenshtein()
        },
        () => {
            sort_type = 2;
            if (sortListByLevenshteinTimer) { clearTimeout(sortListByLevenshteinTimer) }
            sortListByLevenshtein()
        }
    ])

    toggleButton(panel, "ccc_span_link", ["不转链接", '序号转链接'], [
        () => { b_span_link = false },
        () => { b_span_link = true }
    ])

    toggleButton(panel, "ccc_detail", ["不显示详情", '显示题目详情'], [
        () => { b_show_detail = false },
        () => { b_show_detail = true }
    ])
    toggleButton(panel, "ccc_show_100", ["加载默认条", '加载100条'], [
        () => { b_show_100 = false },
        () => { b_show_100 = true }
    ])
    setInterval(async () => {
        const d = document.querySelector(".details-checked input")
        if (d && d.checked != b_show_detail) {
            d.click()
        }
        if (b_show_100) {
            const show_n = document.querySelector(".pageShowNum span")
            if (show_n && show_n.textContent == "30") {
                show_n.click()
                const cs = show_n.nextElementSibling.childNodes
                if (cs.length > 0) cs[cs.length - 1].click()
            }
        }
        // appendTo(getPanel(),"","abc")

    }, 1000)

    /* ---------------- Levenshtein (no maxDist, optimized, workspace reuse) ---------------- */

    function createLevenshteinDistance() {
        let prev = new Int32Array(0);
        let cur = new Int32Array(0);
        let s2c = new Uint16Array(0);

        function ensureSize(n) {
            if (prev.length < n + 1) prev = new Int32Array(n + 1);
            if (cur.length < n + 1) cur = new Int32Array(n + 1);
            if (s2c.length < n) s2c = new Uint16Array(n);
        }

        return function levenshteinDistance(s1, s2) {
            if (s1 === s2) return 0;

            let m = s1.length;
            let n = s2.length;

            if (m === 0) return n;
            if (n === 0) return m;

            // Make s2 shorter
            if (m < n) {
                [s1, s2] = [s2, s1];
                [m, n] = [n, m];
            }

            ensureSize(n);

            // Precompute s2 char codes
            for (let j = 0; j < n; j++) s2c[j] = s2.charCodeAt(j);

            // init prev row
            for (let j = 0; j <= n; j++) prev[j] = j;

            for (let i = 1; i <= m; i++) {
                cur[0] = i;
                const c1 = s1.charCodeAt(i - 1);

                for (let j = 1; j <= n; j++) {
                    const cost = (c1 === s2c[j - 1]) ? 0 : 1;

                    const del = prev[j] + 1;
                    const ins = cur[j - 1] + 1;
                    const sub = prev[j - 1] + cost;

                    let v = del < ins ? del : ins;
                    if (sub < v) v = sub;

                    cur[j] = v;
                }

                // swap
                const tmp = prev;
                prev = cur;
                cur = tmp;
            }

            return prev[n];
        };
    }

    /* ---------------- Distance cache (Map) ---------------- */

    function distFactory(strings, levenshteinDistance) {
        const n = strings.length;
        const cache = new Map();
        const keyOf = (i, j) => (i < j ? i * n + j : j * n + i);

        return function dist(i, j) {
            if (i === j) return 0;

            const key = keyOf(i, j);
            const hit = cache.get(key);
            if (hit !== undefined) return hit;

            const d = levenshteinDistance(strings[i], strings[j]);
            cache.set(key, d);
            return d;
        };
    }

    /* ---------------- Greedy ordering by closeness ---------------- */

    function sortByCloseness(strings) {
        const n = strings.length;
        if (n <= 2) return strings.map((_, i) => i);

        const levenshteinDistance = createLevenshteinDistance();
        const dist = distFactory(strings, levenshteinDistance);

        const remaining = new Array(n).fill(true);

        // 1) closest pair
        let bestD = Infinity;
        let bestI = 0, bestJ = 1;

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const d = dist(i, j);
                if (d < bestD) {
                    bestD = d;
                    bestI = i;
                    bestJ = j;
                    if (bestD === 0) break;
                }
            }
            if (bestD === 0) break;
        }

        const order = [bestI, bestJ];
        remaining[bestI] = false;
        remaining[bestJ] = false;

        // 2) append nearest neighbor repeatedly
        let last = bestJ;
        let left = n - 2;

        while (left > 0) {
            let next = -1;
            let minD = Infinity;

            for (let i = 0; i < n; i++) {
                if (!remaining[i]) continue;

                const d = dist(last, i);
                if (d < minD) {
                    minD = d;
                    next = i;
                    if (minD === 0) break;
                }
            }

            order.push(next);
            remaining[next] = false;
            last = next;
            left--;
        }

        return order; // 返回 index 顺序（你现在的行为）
    }

    // 若你需要返回字符串顺序：
    // const out = sortByCloseness(arr).map(i => arr[i]);


    function getOrder(lis) {
        if (sort_type == 0) {
            return lis.map((li, index) => ({ index, order: (li.querySelector('.order')?.textContent || "0") * 1 })).sort((a, b) => a.order - b.order).map(a => a.index);
        }
        const items = lis.map((li, index) => {
            let text = (li.querySelector('.choose-name')?.textContent.trim() || "");
            const optionLis = li.querySelectorAll(".questions-details .option li")
            let options = Array.from(optionLis).map(a => a.textContent.substring(2))
            if (sort_type == 2) {
                text = text.split('').sort().join('')
                options = options.map(a => a.split('').sort().join(''))
            }
            options.sort()
            return text + options.join(".");
        });
        // console.log(items)
        const newOrder = sortByCloseness(items)
        // console.log(newOrder, items)
        return newOrder;
    }

    /**
     * 根据 Levenshtein 距离对 ul 列表中的 li 元素进行排序
     */
    function sortListByLevenshtein() {


        // 获取页面中 id 为 questionUl 的 ul 元素
        const ul = document.querySelector('ul#questionUl');
        // 如果未找到该 ul 元素，等待 1 秒后重新调用该函数
        if (!ul) {
            if (sortListByLevenshteinTimer) { clearTimeout(sortListByLevenshteinTimer) }
            sortListByLevenshteinTimer = setTimeout(sortListByLevenshtein, 2000);
            return

        }
        // 获取 ul 元素下的所有 li 元素，并将其转换为数组
        const lis = Array.from(ul.children);


        // console.log(items[0], items[1])
        // 创建一个二维数组 distances 用于存储所有元素之间的 Levenshtein 距离
        const newOrder = getOrder(lis);
        // console.log(newOrder)
        // 获取原始元素的索引数组
        const originalOrder = newOrder.map((e, i) => i);

        // 检查排序后的顺序是否与原始顺序不同
        const isOrderChanged = newOrder.some((value, index) => value !== originalOrder[index]);

        // 如果顺序发生了改变
        if (isOrderChanged) {
            newOrder.forEach(index => {
                ul.appendChild(lis[index]);
            });
            console.log("排序完成")
            // toast("排序完成")
        }
        if (sortListByLevenshteinTimer) { clearTimeout(sortListByLevenshteinTimer) }
        sortListByLevenshteinTimer = setTimeout(sortListByLevenshtein, 2000);
        return
    }

    // 调用排序函数


    function addOpenLink() {
        if (!b_span_link) return;
        // 1. 选择所有带 id 和 courseid 属性的 .questionBank 元素
        const questionBankElements = document.querySelectorAll('.questionBank[id][courseid]');

        // 2. 遍历（注意 forEach 首字母大写）
        questionBankElements.forEach(bankEl => {
            // 4. 查找当前 .questionBank 内的唯一 span.order 元素
            const orderSpan = bankEl.querySelector('span.order');
            if (!orderSpan) return; // 无 span.order 则跳过

            // 3. 获取元素上的 id 和 courseid 属性值（核心：从 DOM 元素取属性）
            const questionBankId = bankEl.getAttribute('id'); // 或 bankEl.id（若为原生 id 属性）
            const courseId = bankEl.getAttribute('courseid'); // 自定义属性必须用 getAttribute

            // 5. 创建 a 标签并替换 span
            const link = document.createElement('a');
            link.className = orderSpan.className; // 保留 order 类名
            link.innerHTML = orderSpan.innerHTML; // 继承原内容
            link.style = `color: blue;    border-top: 1px solid blue;    border-radius: 90px;`
            // 6. 拼接跳转链接
            link.href = `/mooc2-ans/qbank/edit-question?courseid=${courseId}&questionBankId=${questionBankId}`;
            link.target = '_blank'; // 新窗口打开

            // 7. 替换原 span 为 a 标签
            orderSpan.parentNode.replaceChild(link, orderSpan);
        });
    }
    setInterval(addOpenLink, 1000)
})();