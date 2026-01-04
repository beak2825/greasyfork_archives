// ==UserScript==
// @name         筛选ABDC
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-001
// @description  小工具
// @author       周利斌
// @match        https://so1.imageoss.com/*
// @match        https://so3.cljtscd.com/scholar*
// @match        https://scispace.com/*
// @match        https://scholar.google.com/*
// @match        https://*.webofscience.com/*
// @match        https://*.scopus.com/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scholar.google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533214/%E7%AD%9B%E9%80%89ABDC.user.js
// @updateURL https://update.greasyfork.org/scripts/533214/%E7%AD%9B%E9%80%89ABDC.meta.js
// ==/UserScript==

// 更新网址       https://greasyfork.org/zh-CN/scripts/533214-%E7%AD%9B%E9%80%89abdc
// 更新网址       https://scriptcat.org/zh-CN/script-show-page/3808
(async function () {
    "use strict";
    function getValue(key, value) { const gmGetValueExists = window.GM_getValue && typeof GM_getValue !== "undefined"; return gmGetValueExists ? GM_getValue(key, value) : (localStorage.getItem(key) === null ? value : JSON.parse(localStorage.getItem(key))); }
    function setValue(key, value) { const gmSetValueExists = window.GM_setValue && typeof GM_setValue !== "undefined"; return gmSetValueExists ? GM_setValue(key, value) : localStorage.setItem(key, JSON.stringify(value)); }
    function delay(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
    function throttle(func, interval, immediate) { if (immediate === undefined) immediate = true; let lastExecuteTime = 0, timer = null; return function (...args) { const context = this, currentTime = Date.now(); immediate ? (currentTime - lastExecuteTime >= interval && (func.apply(context, args), lastExecuteTime = currentTime)) : (timer && clearTimeout(timer), (!lastExecuteTime || currentTime - lastExecuteTime >= interval) && (timer = setTimeout(function () { func.apply(context, args); lastExecuteTime = Date.now(); timer = null; }, interval))); }; }
    function debounce(func, wait, immediate) { if (immediate === undefined) immediate = false; let timer = null; return function (...args) { const context = this; if (timer) clearTimeout(timer); immediate ? (!timer && (timer = setTimeout(function () { timer = null; }, wait), func.apply(context, args))) : (timer = setTimeout(function () { func.apply(context, args); timer = null; }, wait)); }; }
    function waitUtilAsync(fn, timeout, interval, ctrl) { if (timeout === undefined) timeout = 10000; if (interval === undefined) interval = 50; if (ctrl === undefined) ctrl = { cancelled: false }; return new Promise(function (resolve) { const start = performance.now(); (async function loop() { if (ctrl.cancelled) return resolve(false); const result = await fn(); if (result) return resolve(result); if (performance.now() - start > timeout) return resolve(false); setTimeout(loop, interval); })(); }); }
    /**
    * Create (or return if exists) a floating control panel with optional font-size controls,
    * draggable handle, and a close button. Position and font-size are persisted by `id`. 
    * @param {Object} [options={}] - Panel options
    * @param {string} [options.id='_zlb_root_div_'] - Unique DOM id for the panel container
    * @param {boolean} [options.fontsize=true] - Whether to render font-size controls
    * @param {boolean} [options.drag=true] - Whether to render a draggable handle
    * @param {boolean|function} [options.close=true] - true to show a default close button; a function to run before removal
    * @param {keyof HTMLElementTagNameMap} [options.tagName='button'] - Tag name for interactive controls
    * @returns {HTMLDivElement} The panel DOM element
    */
    function getPanel({ id = '_zlb_root_div_', fontsize = true, drag = true, close = true, tagName = 'button' } = {}) { const closeButtonId = id + '_close_'; let panelElement = document.getElementById(id); const createCloseButton = (host) => appendTo({ parent: host, id: closeButtonId }, tagName, 'X关闭X', () => { if (typeof close === 'function') close(); host.remove(); }); if (panelElement) { if (close) createCloseButton(panelElement); return/** @type {HTMLDivElement} */(panelElement); } panelElement = document.createElement('div'); panelElement.id = id; panelElement.classList.add('notranslate'); panelElement.setAttribute('translate', 'no'); panelElement.onmousedown = panelElement.oncontextmenu = (event) => event.stopPropagation(); document.body.appendChild(panelElement); let currentFontSize = Number(getValue(id + ':fs', 12)); let leftPercent = Math.min(Math.max(Number(getValue(id + ':L', 50)), 0), 95); let topPercent = Math.min(Math.max(Number(getValue(id + ':T', 50)), 0), 95); const styleElement = document.createElement('style'); panelElement.appendChild(styleElement); const updatePanelStyles = () => { styleElement.textContent = `#${id}{position:fixed;z-index:999999;background-color:rgba(187, 180, 180, 0.9);border:1px solid rgba(191, 70, 173, 0.9);max-width:50vw;left:${leftPercent}%;top:${topPercent}%;user-select:none;font-size:${currentFontSize}px;display:flex;flex-wrap:wrap;}#${id} button{border-radius:${currentFontSize}px;min-width:auto;display: inline-flex;padding:0 4px;font-size:${currentFontSize}px;}#${id} span{margin:0 2px}#${id} label{margin:0px 2px;display: inline-flex;border:1px solid rgba(117,70,227,.7);border-radius:${currentFontSize}px;}`; }; updatePanelStyles(); if (fontsize) { appendTo(panelElement, tagName, '-字号-', () => { currentFontSize = Math.max(6, currentFontSize * 0.9); setValue(id + ':fs', currentFontSize); updatePanelStyles(); }); appendTo(panelElement, tagName, '+字号+', () => { currentFontSize = currentFontSize * 1.1; setValue(id + ':fs', currentFontSize); updatePanelStyles(); }); } if (drag) { const dragHandleButton = appendTo(panelElement, tagName, '✥拖动✥'); dragHandleButton.addEventListener('mousedown', (event) => { const rect = panelElement.getBoundingClientRect(); const deltaX = event.clientX - rect.left; const deltaY = event.clientY - rect.top; const moveHandler = (moveEvent) => { panelElement.style.left = (moveEvent.clientX - deltaX) + 'px'; panelElement.style.top = (moveEvent.clientY - deltaY) + 'px'; }; const upHandler = () => { document.removeEventListener('mousemove', moveHandler); document.removeEventListener('mouseup', upHandler); const leftInPercent = (parseFloat(panelElement.style.left) / document.documentElement.clientWidth) * 100; const topInPercent = (parseFloat(panelElement.style.top) / document.documentElement.clientHeight) * 100; leftPercent = Math.min(Math.max(leftInPercent, 0), 95); topPercent = Math.min(Math.max(topInPercent, 0), 95); panelElement.style.left = leftPercent + '%'; panelElement.style.top = topPercent + '%'; setValue(id + ':L', leftPercent); setValue(id + ':T', topPercent); updatePanelStyles(); }; document.addEventListener('mousemove', moveHandler); document.addEventListener('mouseup', upHandler); }); } if (close) createCloseButton(panelElement); setTimeout(() => { if (panelElement.children.length <= 1 + !!fontsize * 2 + !!drag + !!close) panelElement.remove(); }, 100); return/** @type {HTMLDivElement} */(panelElement); }
    /**
    * 创建或复用一个 HTML 元素，并插入到指定位置。 可以在parentOrOption中写任意属性
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
    function appendTo(parentOrOption = null, tagName = null, textContent = null, click = null, id = null) { const isObj = parentOrOption && typeof parentOrOption === "object" && !(parentOrOption instanceof HTMLElement); const base = { ...(isObj ? parentOrOption : { parent: parentOrOption }), ...(tagName && { tagName }), ...(textContent && { textContent }), ...(click && { click }), ...(id && { id }) }; const { parent = null, afterend = null, beforebegin = null, tagName: tag = "a", textContent: txt = "", id: i = "", functions = {}, click: c, ...other } = base; let el = i && document.getElementById(i); if (!el) el = document.createElement(tag); if (parent instanceof HTMLElement && parent !== el.parentElement) parent.appendChild(el); else if (afterend instanceof HTMLElement) afterend.insertAdjacentElement("afterend", el); else if (beforebegin instanceof HTMLElement) beforebegin.insertAdjacentElement("beforebegin", el); if (i) el.id = i; if (txt) el.textContent = txt; const fns = { ...functions }; for (const [k, v] of Object.entries(other)) { if (!v) continue; if (k === "style") typeof v === "string" ? (el.style.cssText = v) : Object.assign(el.style, v); else if (k === "className" || k === "classList") { const classes = Array.isArray(v) ? v : typeof v === "string" ? v.split(/\s+/) : [...v]; el.classList.add(...classes.filter(Boolean)); } else if (typeof v === "function") fns[k] = v; else (k in el ? (el[k] = v) : el.setAttribute(k, v)); } if (c) fns.click = c; for (const [ev, fn] of Object.entries(fns)) el.addEventListener(ev, e => fn(e, el)); return el; }
    /** 
     * @param {HTMLElement} parent 
     * @param {string} key 
     * @param {string[]} status 
     * @param {((btn: HTMLElement) => void)[]} funcs - 单个函数或者 与状态列表一一对应的回调函数数组 
     */
    function toggleButton(parent, key, status, funcs, bgColors = ["", "#ffb6c1", "#a8d08d", "#f0e68c", "#add8e6", "#ff6347", "#98fb98", "#7b7070", "#ffd700", "#ff1493", "#90ee90", "#ff4500", "#8a2be2", "#32cd32", "#ff8c00", "#d2691e", "#ff0000", "#b0e0e6", "#dcdcdc", "#c7c7c7"]) {
        let state = getValue(key, status[0]);
        let index = status.indexOf(state) || 0;
        function updateBtn(index, state) {
            btn.textContent = `${state}`;
            if (bgColors && bgColors.length > 0)
                btn.style.backgroundColor = bgColors[index % bgColors.length] || "";
            btn.dataset.index = index;
            btn.dataset.state = state;
            (Array.isArray(funcs) && funcs.length > 0 ? (funcs[index % funcs.length]) : funcs)?.(btn, state, index)
        }
        let btn = appendTo(parent, "button", state, () => {
            index = (index + 1) % status.length;
            state = status[index];
            setValue(key, state);
            updateBtn(index, state);
        });
        updateBtn(index, state);
        return btn;
    }

    // Your code here...

    if (document.querySelector("#gs_bdy")) {
        //设置谷歌查询结果的最小高度，让滚动条一直存在
        document.querySelector("#gs_bdy").style.minHeight = "600px";
    }
    waitUtilAsync(() => document.querySelectorAll(".gs_a").length > 0, 1e3).then(() => document.querySelectorAll(".gs_a").forEach(f => (f.classList.add("notranslate"), f.setAttribute("translate", 'no'))));
    await waitUtilAsync(() => document.querySelectorAll(".srankInfo").length > 0, 1e8, 1000)
    await delay(1000);
    const selector = [
        ["谷歌搜索结果", undefined, '#gs_res_ccl_mid', '.gs_or'],
        ["wos分析结果", undefined, ".mdc-data-table__content", '.mdc-data-table__row'],
        ["wos搜索结果", undefined, ".app-records-list", ".Summary-record-view", `input[type="checkbox"]`],
        ["scispace", /scispace/, `[data-slot="sidebar-wrapper"] table tbody`, 'tr'],
        ["scopus的搜索结果", undefined, ".document-results-list-layout tbody", (tbody) => {
            const trs = [...tbody.querySelectorAll("tr")];
            if (trs.length === 0) return [];
            const finalGroups = [];
            let currentGroup = [];
            for (const tr of trs) {
                if (tr.classList.length === 1) {
                    if (currentGroup.length > 0) {
                        finalGroups.push([...currentGroup]);
                    }
                    currentGroup = [];
                }
                currentGroup.push(tr);
            }
            if (currentGroup.length > 0) finalGroups.push([...currentGroup]);
            return finalGroups;
        }]
    ]
    function get_ul_lis(selector) {
        const href = window.location.href

        for (let i = 0; i < selector.length; i++) {
            const [title, url_re, ulSelector, liSelector, checkboxSelector] = selector[i]
            if (url_re && !url_re.test(href)) continue
            const container = document.querySelector(ulSelector)
            if (container) {
                const childList = typeof liSelector === 'function' ? liSelector(container) : container.querySelectorAll(liSelector)
                if (childList.length > 0) {
                    const checkboxs = checkboxSelector ? [...childList].map(group => {
                        const targetItems = Array.isArray(group) ? group : [group];
                        for (let i = 0; i < targetItems.length; i++) {
                            const currentNode = targetItems[i];
                            const checkbox = typeof checkboxSelector === 'function' ? checkboxSelector(currentNode) : currentNode.querySelector(checkboxSelector)
                            if (checkbox) return checkbox
                        }
                    }) : []
                    // console.log(title, container, childList.length,checkboxSelector)
                    return [container, [...childList], checkboxs, title, url_re]
                }
            }
        }
        return []
    }
    async function filterRank(//liSelector = ".gs_r.gs_or.gs_scl", checkSelector = "input[type=checkbox]", n = 1
    ) {
        if (window.filterRankRegisted) {
            return;
        }
        const [ui] = get_ul_lis(selector)
        // console.log(ui)
        if (!ui) return setTimeout(() => filterRank(), 1000);
        const panel = getPanel()
        if (window.filterRankRegisted) {
            return;
        } else {
            window.filterRankRegisted = 1
        }
        if (!window.rankInfoObserver) {
            window.rankInfoObserver =
                new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && (node.classList.contains('srankSpan') || node.classList.contains('srankDiv'))) {
                                // console.log(`.srankdiv 的数量: ${document.querySelectorAll('.srankSpan,.srankDiv').length} 开启查询`);
                                queryFilterThrottle()
                            }
                        });
                    });
                });
            window.rankInfoObserver.observe(document.body, { childList: true, subtree: true });
            // console.log("注册 rankInfoObserver 成功", window.rankInfoObserver, window)
        }
        const divStat = appendTo(panel, "label", "统计信息", "")
        let queryFilterThrottle = undefined;
        let allow_check = 0
        toggleButton(getPanel(), "abdc:allow_check", ["不允许选择", "允许选择"], (btn, state, index) => {
            allow_check = index
            if (queryFilterThrottle) queryFilterThrottle()
        })
        // console.log("allow_check",allow_check)
        const RankFilter = {};
        [["ALL", () => true, ["", "++"]], ["空白", () => true, ["", "--"]],
        ["Top", ms => ms.some(m => m.textContent.includes("Top"))],
        ["ABDC A*/A", ms => ms.some(m => m.textContent.includes("ABDC A"))],
        ["ABDC B", ms => ms.some(m => m.textContent.includes("ABDC B"))],
        ["ABDC", ms => ms.some(m => m.textContent.includes("ABDC"))],
        ["FMS", ms => ms.some(m => m.textContent.includes("FMS"))],
        ["SSCI", ms => ms.some(m => m.textContent.includes("SSCI"))],
        ["SCIE", ms => ms.some(m => m.textContent.includes("SCIE"))],
        ["ESCI", ms => ms.some(m => m.textContent.includes("ESCI"))],
        ["EI", ms => ms.some(m => m.textContent.includes("EI"))],
        ["SCOPUS", ms => ms.some(m => m.classList.contains("scolor-citescore"))],
        [">12", ms => ms.some(m => m.classList.contains("scolor-citescore") && m.getAttribute("val") - 0 > 12)],
        ["IF>1", ms => ms.some(m => m.classList.contains("rimf") && m.getAttribute("val") - 0 > 1)],
        ["IF>2", ms => ms.some(m => m.classList.contains("rimf") && m.getAttribute("val") - 0 > 2)],
        ["IF>8", ms => ms.some(m => m.classList.contains("rimf") && m.getAttribute("val") - 0 > 8)],
        ["JCR Q1", ms => ms.some(m => m.textContent.includes("JCR Q1"))],
        ["JCR Q1、2", ms => ms.some(m => m.textContent.includes("JCR Q1") || m.textContent.includes("JCR Q2"))],
        ["1区", ms => ms.some(m => m.textContent.includes("1区"))],
        ["1、2区", ms => ms.some(m => m.textContent.includes("1区") || m.textContent.includes("2区"))],
        ["4区", ms => ms.some(m => m.textContent.includes("4区"))],
        ["区", ms => ms.some(m => m.textContent.includes("区"))],
        ["JCR Q1Q2", ms => ms.some(m => m.textContent.includes("JCR Q1") || m.textContent.includes("JCR Q2"))],
        ["中信所 Q1", ms => ms.some(m => m.textContent.includes("中信所 Q1"))],
        ["中信所 Q1Q2", ms => ms.some(m => m.textContent.includes("中信所 Q1") || m.textContent.includes("中信所 Q2"))],
        ["中信所 Q4", ms => ms.some(m => m.textContent.includes("中信所 Q4"))],
        ["医学", ms => ms.some(m => m.textContent.includes("医学"))],
        ["材料", ms => ms.some(m => m.textContent.includes("材料"))],
        ["物理", ms => ms.some(m => m.textContent.includes("物理"))],
        ["化学", ms => ms.some(m => m.textContent.includes("化学"))],
        ["生物", ms => ms.some(m => m.textContent.includes("生物"))],
        ["预警", ms => ms.some(m => m.classList.contains("scolor-sos"))]]
            .forEach(([btnTxt, checkFunc, status]) =>
                toggleButton(panel, "RankFilter:" + btnTxt, (status || ["", "++", "--"]).map(pp => `${pp}${btnTxt}${pp}`),
                    (btn, state, index) => {
                        RankFilter[btnTxt] = [checkFunc, index];
                        // console.log("加载", btnTxt, state, index)
                        if (queryFilterThrottle) queryFilterThrottle()
                    }));
        /**
         *   返回值 
         *   0 有条件不符合要求被排除 
         *   1 当前为文献的等级为空白
         *   2 选中了All，等于不进行查询直接返回所有结果
         *   3 没选中All，但是也没返回0，也就是当前所有条件都未启用
         *   大于3 至少有一个条件满足了
         */
        function checkFunc(ranks) {
            if (ranks.filter(f => !f.classList.contains("ryear") && !f.classList.contains("rcited")).length == 0) return 1
            if (RankFilter.ALL && RankFilter.ALL[1] == 1) return 2
            let hit = 3
            for (const k of Object.keys(RankFilter)) {
                if (k != "ALL" && k != "空白") {
                    const [checkFun, q1] = RankFilter[k]
                    if (q1 == 0) continue //无效条件
                    const check = checkFun(ranks)
                    if (q1 == 1 && !check) return 0 // 如果未能满足条件 排除
                    if (q1 == 2 && check) return 0 // 排除所有满足条件的
                    hit += 1
                }
            }
            return hit
        }
        queryFilterThrottle = throttle(queryFilter, 500,)
        function queryFilter() {
            // console.log(Object.entries(RankFilter).filter(f => f[1][1] != 0).flat().flat())
            const [ui, lis, checkboxs] = get_ul_lis(selector)
            if (!ui) return;
            // console.log(lis.length,checkboxs&&checkboxs.length)
            let check = 0, checked = 0;
            // console.log(allow_check)
            for (let i = 0; i < lis.length; i++)
            // for (const i in lis) 
            {
                const row = lis[i]
                // ========== 核心微调：1. 统一row格式，得到rowItems数组 ==========
                const validRowItems = Array.isArray(row) ? row : [row];
                // ========== 核心调整：2. 从整个rowItems（原row集合）中获取rks和ckbox ==========
                // 收集rowItems中所有.srankInfo元素
                const rks = validRowItems.flatMap(currentRow =>
                    [...currentRow.querySelectorAll(".srankInfo")]
                );
                const ckbox = allow_check && checkboxs && checkboxs[i]
                // console.log(checkboxs && checkboxs.length, i, ckbox)
                // 提前计算ck_result（基于整个rowItems的rks集合）
                const ck_result = checkFunc(rks, validRowItems);
                // ========== 3. 遍历单个currentRow，执行原有样式/状态逻辑 ==========
                for (const currentRow of validRowItems) {
                    // 保留日志打印（rks是整个rowItems的集合，按需调整）
                    // if (rks.length < 4)
                    // if (ck_result > 3)
                    //     console.log("ck_result", ck_result, rks, ckbox, currentRow, RankFilter["空白"][1])
                    if (allow_check && ckbox) { // wos 不隐藏未选中的 
                        if (currentRow.style.maxHeight == "1px") {
                            currentRow.style.borderLeft = ""
                            currentRow.style.maxHeight = "";
                            currentRow.style.overflowY = ""
                            currentRow.style.padding = ""
                        }
                        if (currentRow.style.display == "none") currentRow.style.display = ""
                        if (ck_result > 3) { // 只要符合条件的 不要空白
                            ckbox.closest('.number-section').style.backgroundColor =
                                getComputedStyle(currentRow.querySelector(".srankInfo.rjcr") || currentRow.querySelector(".srankInfo.rcas") || currentRow.querySelector(".srankInfo")).backgroundColor;
                            if (ckbox.checked) {
                                checked++;
                            } else {
                                ckbox.click();
                                check++;
                                console.log("点击了", check)
                            }
                        }
                        // console.log(check, checked)
                    } else {//scholar 未选中隐藏
                        // console.log("allow_check",allow_check,ckbox)
                        // currentRow.style.transition = "border-left .5s, max-height .5s, overflow-y .5s, padding .5s";
                        if (ck_result > 1 || (ck_result == 1 && RankFilter["空白"][2] == 0)) {
                            if (currentRow.tagName == "TR") {
                                if (currentRow.style.display == "none") check++
                                else checked++
                                currentRow.style.display = ""
                            } else {
                                if (currentRow.style.maxHeight == "1px") check++
                                else checked++
                                currentRow.style.borderLeft = ""
                                currentRow.style.maxHeight = "";
                                currentRow.style.overflowY = ""
                                currentRow.style.padding = ""
                            }
                        } else {
                            if (currentRow.tagName == "TR") {
                                currentRow.style.display = "none"
                            } else {
                                currentRow.style.transition = '';
                                currentRow.style.minHeight = "1px"
                                currentRow.style.borderLeft = "5px solid #300"
                                currentRow.style.maxHeight = "1px"
                                currentRow.style.overflowY = "hidden"
                                currentRow.style.padding = "0px"
                            }
                        }
                    }
                }
                // ========== 微调结束 ==========
            }
            //统计信息
            stat_info(lis, check, checked);
        }
        function stat_info(qList, check = 0, checked = 0) {
            // console.log("stat_info", check, checked)
            const checkCount = document.querySelector("#snRecListTop .mat-checkbox")?.textContent || "";
            const page = document.querySelector("#snNextPageTop")?.value || "";
            const pageAll = document.querySelector("body > app-wos > main > div > div > div.holder > div > div > div.held > app-input-route > app-base-summary-component > div > div.results.ng-star-inserted > app-page-controls.app-page-controls.ng-star-inserted > div > form > div")?.textContent || "";
            const rankLength =
                [...qList].map(a => a.querySelector(".srankInfo:not(.rcited,.ryear)")).filter(f => f).length;
            const birdLength = document.querySelectorAll(".scicrx-btn .scicrx-svgicon").length;
            const citeLength = document.querySelectorAll(".rcited").length;
            divStat.textContent = `【${check}/${checked}/${qList.length}${checkCount > 0 ? `/${checkCount}` : ""} ${pageAll > 0 ? `/${page}/${pageAll}页` : ""}/引${citeLength}🔖${rankLength}🐦‍⬛${birdLength}】`;
        }
        // queryFilterThrottle()
    }
    filterRank()
    function getGroupValue(group, ...args) {
        // 步骤1：统一group格式，兼容单个DOM/数组（依赖group入参规范，全为HTMLElement）
        const targetItems = Array.isArray(group) ? group : [group];
        // 步骤2：初始化查询结果数组（基于规范args长度）
        const queryResults = args.map(() => undefined);
        const pairCount = args.length;
        // 步骤3：遍历分组元素，执行批量查询（无DOM有效性校验，依赖group规范）
        for (let i = 0; i < targetItems.length; i++) {
            const currentNode = targetItems[i];
            for (let j = 0; j < pairCount; j++) {
                if (queryResults[j] === undefined) {
                    queryResults[j] = args[j][0](currentNode);
                }
            }
            if (!queryResults.some(result => result === undefined)) break;
        }
        // 步骤4：map一行返回，reduce累加汇总（无任何兜底，依赖args规范）
        return queryResults
            .map((queryResult, index) => args[index][1](queryResult))
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }
    async function initSortElements() {
        const getCiteCount = (group) => getGroupValue(group,
            [node => node.querySelector(".rcited"), r => -parseInt(r?.getAttribute("val")) || 0],
            [node => node.querySelectorAll(".srankInfo"), r => -r.length / 100],
            // [node => node.querySelector(".rimf"), r => -parseFloat(r?.getAttribute("val")) || 0],
            // [node => node.querySelector(".scolor-citescore"), r => -parseFloat(r?.textContent.match(/[\d.]+/)) || 0],
            // [node => node.querySelector(".ryear"), r => -parseFloat(r?.getAttribute("val")) * 0 || 0],
            // [node => [...node.querySelectorAll(".srankInfo")].find(f => f.textContent?.startsWith("Self-Citation Rate ")), r => -parseFloat(r?.textContent.match(/[\d.]+/)) || 0],
        )
        const getIfDesc = (group) => getGroupValue(group,
            [node => node.querySelector(".rimf"), r => -parseFloat(r?.getAttribute("val")) || 10000],
            [node => node.querySelectorAll(".srankInfo:not(.ryear):not(.rcited)"), r => -r.length / 100],
        )
        const getIfAsc = (group) => getGroupValue(group,
            [node => node.querySelector(".rimf"), r => parseFloat(r?.getAttribute("val")) || 10000],
            [node => node.querySelectorAll(".srankInfo:not(.ryear):not(.rcited)"), r => -r.length / 100],
        )
        const getYearDesc = (group) => getGroupValue(group,
            [node => node.querySelector(".ryear"), r => -parseFloat(r?.getAttribute("val")) || 10000],
            [node => node.querySelectorAll(".srankInfo:not(.ryear):not(.rcited)"), r => -r.length / 100],
        )
        const getSelfCiteDesc = (group) => getGroupValue(group,
            [node => [...node.querySelectorAll(".srankInfo")].find(f => f.textContent?.startsWith("Self-Citation Rate ")),
            r => -parseFloat(r?.textContent.match(/[\d.]+/)) || 100],
            [node => node.querySelectorAll(".srankInfo:not(.ryear):not(.rcited)"), r => -r.length / 100],
        )
        const getSelfCiteAsc = (group) => getGroupValue(group,
            [node => [...node.querySelectorAll(".srankInfo")].find(f => f.textContent?.startsWith("Self-Citation Rate ")),
            r => parseFloat(r?.textContent.match(/[\d.]+/)) || 100],
            [node => node.querySelectorAll(".srankInfo:not(.ryear):not(.rcited)"), r => -r.length / 100],
        )
        const getOindex = (f) => (Array.isArray(f) ? f[0] : f).dataset.oindex
        const sort_fun = {
            "原生排序": getOindex,
            "引用排序": getCiteCount,
            "因子排序": getIfDesc, // "IF↑排序": getIfAsc,
            "自引排序": getSelfCiteDesc, // "自引率↑排序": getSelfCiteAsc,
            // "年份排序": getYearDesc, // "时间排序↑": getYearAsc,
        }
        let timer = undefined
        let sort_type = getValue("abdc_sort", "原生排序")
        const keys = Object.keys(sort_fun).filter(f => document.querySelector(".rcited") || f != "引用排序")
        function sortElements() {
            const [ul, lis] = get_ul_lis(selector)
            if (!ul) {
                if (timer) clearTimeout(timer)
                setTimeout(sortElements, 1000)
                return;
            }
            const groupElements = lis
                .map(node => ({ node, sort_value: sort_fun[sort_type]?.(node) || 0 }));
            lis.forEach((f, i) => {
                const f0 = Array.isArray(f) ? f[0] : f;
                if (f0.dataset.oindex == undefined) f0.dataset.oindex = i
            })
            const groupElementsSorted = [...groupElements].sort((a, b) => a.sort_value - b.sort_value);
            const needResort = groupElements.some((element, index) => element.node !== groupElementsSorted[index].node);
            if (needResort) {
                // ul.append(...gsOrElementsSorted.map(item => item.node)); // 重新添加排序后的节点
                const sortedNodes = groupElementsSorted
                    .map(item => item.node)
                    .flatMap(group => {
                        return Array.isArray(group) ? group : [group];
                    })
                    .filter(node => node instanceof HTMLElement);
                ul.append(...sortedNodes);
            }
            if (timer) clearTimeout(timer)
            setTimeout(sortElements, 1000);
        }
        await waitUtilAsync(() => get_ul_lis(selector)[0], 1e9, 1000)
        toggleButton(getPanel(), "abdc_sort", keys, (btn, state, index) => {
            sort_type = state
            if (timer) clearTimeout(timer)
            sortElements()
        })
    }
    initSortElements()
    async function initYujing() {
        if (!(await waitUtilAsync(() => document.querySelector("span.scolor-sos"), 1e9, 1000))) {
            return;
        }
        let t = undefined
        toggleButton(getPanel(), "abdc-预警", ["预警图标", "预警文字"], (btn, state, index) => {
            if (t) clearInterval(t); t = undefined
            function setText() {
                if (state == "预警文字") {
                    for (const s of document.querySelectorAll("span.scolor-sos")) {
                        if (!s.dataset.txt) {
                            s.dataset.txt = "预警"
                            var newTextNode = document.createElement("span")
                            newTextNode.style.color = "red"
                            newTextNode.textContent = "预警 " + s.title.split(/《|》|预警/)[1]
                            newTextNode.className = "sos-text"
                            s.appendChild(newTextNode);
                        }
                    }
                } else {
                    [...document.querySelectorAll("span.scolor-sos .sos-text")].forEach(f => {
                        f.parentElement.dataset.txt = "";
                        f.remove()
                    })
                }
                btn.textContent = state + `[${document.querySelectorAll("span.scolor-sos").length}]`
            }
            t = setInterval(setText, 1000)
        })
    }
    setTimeout(initYujing, 1000)
    if (location.href.indexOf("scispace") > -1) {
        let t = undefined
        toggleButton(getPanel(), "Scispace自动加载", ["Scispace手动加载", "Scispace自动加载"],
            [
                () => {
                    if (t) clearInterval(t); t = undefined;
                },
                () => {
                    if (t) clearInterval(t); t = undefined;
                    t = setInterval(() => {
                        document.querySelector(".border-primary [data-icon=files],.border-primary [data-icon=spinner-third]")?.parentElement.click()
                    }, 2000)
                }
            ])
    }
})();
