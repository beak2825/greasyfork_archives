// ==UserScript==
// @name         强制页面中的元素在新标签页打开
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  点击脚本的菜单「选取模式」，选取你要实现新标签页打开的页面元素（通常是列表里的条目）。使用「规则管理」菜单管理已添加的规则。对于选取的链接，点击过会做红色标记处理，方便你操作。
// @author       Overfly
// @match        http://*/*
// @match        https://*/*
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495934/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%85%83%E7%B4%A0%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/495934/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%85%83%E7%B4%A0%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 核心思路：
    // 1) 从 localStorage 读取用户配置的「CSS 选择器规则」
    // 2) 根据规则定位 DOM（规则对应的元素本身，或其后代中的 <a>）
    // 3) 将匹配到的链接强制设置 target="_blank"，并可选移除原本的 onclick
    // 4) 提供「规则管理」与「选取模式」两种方式维护规则；适配 SPA 路由切换

    // 是否移除原本绑定在 a 标签上面的点击事件
    let removeClickEvent = false;

    // 规则文本（每行一个 CSS 选择器）；在 init() 中从 localStorage 初始化
    let domListText = "";
    let domList = [];

    // [新增] 选取模式：鼠标悬停预览选择器并高亮，左键点击将选择器写入规则列表
    let isPickModeEnabled = false;
    let pickModeDomListTextSnapshot = "";
    let pickModeCurrentSelector = "";
    let pickModeLastHighlighted = [];
    let pickModePanelDom = null;
    let pickModeRafId = null;
    let pickModeLastTarget = null;

    // 对已收集的 DOM（domList）进行处理：
    // - 若元素本身是 <a>，直接处理
    // - 否则处理它内部所有 <a>
    // 处理结果：强制新标签页打开，并在点击后把链接标红便于区分“已点过”
    function hookATag() {
        function processLink(link) {
            // 强制新标签打开
            link.setAttribute("target", "_blank");
            if (removeClickEvent) {
                // 某些站点会在 onclick 内部做“同页跳转/拦截”，移除后更容易被 target 生效
                link.removeAttribute("onclick");
            }
            // 点击后做一次视觉标记，方便操作列表/批量打开时回看
            link.addEventListener("click", function () {
                this.style.color = "darkred";
            });
        }
        console.log("hookATag");
        // 获取页面上的所有链接元素
        for (let domListElement of domList) {
            // 检查是否本身就是 a 标签
            if (domListElement.tagName === "A") {
                processLink(domListElement);
            } else {
                let links = domListElement.getElementsByTagName("a");
                for (let i = 0; i < links.length; i++) {
                    processLink(links[i]);
                }
            }
        }
        domList = [];
    }

    // 兜底：拦截 window.open 并强制以新标签方式打开
    // 注意：此方式会影响页面自身的打开行为（例如弹窗、同页复用窗口等），默认不启用
    function hookWindowOpen() {
        // 保存原始的 unsafeWindow.open 方法的引用
        let originalOpen = unsafeWindow.open;
        // 重写 unsafeWindow.open 方法
        unsafeWindow.open = function (url, target, features) {
            // 在新标签页中打开链接
            originalOpen.call(this, url, "_blank", features);
        };
    }

    // 监听 DOM 节点变化以应对异步刷新的场景
    // 一旦 DOM 发生变化就重新执行 hookATag()（可能较频繁，需谨慎启用）
    function hookPageWhenDomChange() {
        let MutationObserver =
            unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver;
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                hookATag();
            });
        });
        observer.observe(document.body, {
            childList: true, // 观察目标子节点的变化，是否有添加或者删除
            subtree: true, // 观察后代节点，默认为 false
            attributes: false, // 观察属性变动
        });
    }

    // 显示「规则管理」弹窗：
    // - 以可视化列表管理 CSS 选择器规则（添加/删除/去重/保存）
    // - 同时提供“移除点击事件”的开关配置
    function showInputTextarea() {
        const dom = `
  <div id="container-zuc08" style="position: fixed; inset: 0; z-index: 2147483646; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.35);">
    <div style="width: min(860px, calc(100vw - 40px)); max-height: calc(100vh - 80px); background-color: #fff; padding: 16px; border: 1px solid #ccc; border-radius: 12px; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18); display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
        <div style="font-size: 16px; font-weight: 600; color: #111;">规则管理</div>
        <div id="close-btn-zuc08" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; user-select: none; color: #666; background: rgba(0,0,0,0.04);">×</div>
      </div>
      <div style="font-size: 12px; color: #666;">每条规则是一个 CSS 选择器；保存时会自动去空/去重。提示：也可用「📌选取模式」快速生成。</div>
      <div id="rules-list-zuc08" style="display: flex; flex-direction: column; gap: 8px; overflow: auto; padding-right: 4px; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; padding: 10px;"></div>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="padding: 6px 12px; width: max-content; background: #f0f0f0; color: #111; border-radius: 8px; cursor: pointer; user-select: none; border: 1px solid rgba(0,0,0,0.12);" id="add-rule-btn-zuc08">+ 添加规则</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="padding: 6px 14px; width: max-content; background: #1677ff; color: white; border-radius: 8px; cursor: pointer; user-select: none;" id="confirm-btn-zuc08">保存并刷新页面生效</div>
          <div style="padding: 6px 14px; width: max-content; background: dimgray; color: white; border-radius: 8px; cursor: pointer; user-select: none;" id="cancel-btn-zuc08">取消</div>
        </div>
      </div>
      <div style="margin-top: 10px; display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; align-items:center; gap:8px; padding: 6px 10px; background: #f0f0f0; color: #111; border-radius: 8px; user-select: none; border: 1px solid rgba(0,0,0,0.12); width: max-content; max-width: 100%; flex-wrap: wrap;">
          <span style="font-size: 12px; color: #111;">移除点击事件</span>
          <label style="position: relative; display: inline-block; width: 38px; height: 20px; cursor: pointer;">
            <input id="remove-click-event-switch-zuc08" type="checkbox" ${removeClickEvent ? "checked" : ""
            } style="opacity: 0; width: 0; height: 0;">
            <span id="remove-click-event-switch-track-zuc08" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${removeClickEvent ? "#1677ff" : "rgba(0,0,0,0.25)"
            }; transition: 0.18s; border-radius: 999px;"></span>
            <span id="remove-click-event-switch-thumb-zuc08" style="position: absolute; top: 2px; left: ${removeClickEvent ? "20px" : "2px"
            }; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.18s; box-shadow: 0 2px 6px rgba(0,0,0,0.18);"></span>
          </label>
          <span id="remove-click-event-switch-text-zuc08" style="font-size: 12px; color: #555;">${removeClickEvent ? "禁用移除点击事件" : "启用点击事件"
            }</span>
        </div>
        <div style="font-size: 12px; color: #888; line-height: 1.4;">
          默认会移除原本选中的a标签的点击事件以确保生效，如果按钮点击出现问题，则修改配置，启用点击事件即可
        </div>
      </div>
    </div>
  </div>
  `;
        document.body.insertAdjacentHTML("beforeend", dom);
        //绑定事件
        let keydownHandler = null;
        function close() {
            if (keydownHandler) {
                unsafeWindow.document.removeEventListener(
                    "keydown",
                    keydownHandler,
                    true
                );
                keydownHandler = null;
            }
            const container = document.getElementById("container-zuc08");
            if (container && container.parentNode)
                container.parentNode.removeChild(container);
        }

        const container = document.getElementById("container-zuc08");
        const closeBtn = document.getElementById("close-btn-zuc08");
        const rulesListDom = document.getElementById("rules-list-zuc08");
        const addRuleBtnDom = document.getElementById("add-rule-btn-zuc08");
        const removeClickEventSwitchDom = document.getElementById(
            "remove-click-event-switch-zuc08"
        );
        const removeClickEventSwitchTrackDom = document.getElementById(
            "remove-click-event-switch-track-zuc08"
        );
        const removeClickEventSwitchThumbDom = document.getElementById(
            "remove-click-event-switch-thumb-zuc08"
        );
        const removeClickEventSwitchTextDom = document.getElementById(
            "remove-click-event-switch-text-zuc08"
        );

        function setRemoveClickEventSetting(enabled) {
            unsafeWindow.localStorage.setItem(
                "aSpuT_removeClickEvent",
                enabled ? "true" : "false"
            );
            close();
            location.reload();
        }

        function syncRemoveClickEventSwitchUi(checked) {
            const on = Boolean(checked);
            if (removeClickEventSwitchTrackDom) {
                removeClickEventSwitchTrackDom.style.background = on
                    ? "#1677ff"
                    : "rgba(0,0,0,0.25)";
            }
            if (removeClickEventSwitchThumbDom) {
                removeClickEventSwitchThumbDom.style.left = on ? "20px" : "2px";
            }
            if (removeClickEventSwitchTextDom) {
                removeClickEventSwitchTextDom.textContent = on
                    ? "禁用移除点击事件"
                    : "启用点击事件";
            }
        }

        function ensureAtLeastOneRow() {
            const inputs = rulesListDom.querySelectorAll("input[data-role='rule']");
            if (inputs.length > 0) return;
            const row = createRuleRow("");
            rulesListDom.appendChild(row);
            const input = row.querySelector("input[data-role='rule']");
            if (input) input.focus();
        }

        function getNormalizedRulesFromUi() {
            const inputs = rulesListDom.querySelectorAll("input[data-role='rule']");
            const seen = new Set();
            const rules = [];
            for (const input of inputs) {
                const value = (input.value || "").trim();
                if (!value) continue;
                if (seen.has(value)) continue;
                seen.add(value);
                rules.push(value);
            }
            return rules;
        }

        function createRuleRow(value) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.gap = "8px";
            row.style.alignItems = "center";

            const input = document.createElement("input");
            input.type = "text";
            input.value = value || "";
            input.setAttribute("data-role", "rule");
            input.placeholder = "例如：.content a 或 #main a";
            input.style.flex = "1";
            input.style.height = "34px";
            input.style.border = "1px solid rgba(0,0,0,0.18)";
            input.style.borderRadius = "8px";
            input.style.padding = "0 10px";
            input.style.outline = "none";

            const del = document.createElement("div");
            del.textContent = "×";
            del.style.width = "34px";
            del.style.height = "34px";
            del.style.display = "flex";
            del.style.alignItems = "center";
            del.style.justifyContent = "center";
            del.style.borderRadius = "8px";
            del.style.cursor = "pointer";
            del.style.userSelect = "none";
            del.style.border = "1px solid rgba(255, 77, 79, 0.35)";
            del.style.background = "rgba(255, 77, 79, 0.08)";
            del.style.color = "#ff4d4f";

            del.addEventListener("click", function () {
                if (row.parentNode) row.parentNode.removeChild(row);
                ensureAtLeastOneRow();
            });

            row.appendChild(input);
            row.appendChild(del);
            return row;
        }

        function initRules() {
            const rules = (domListText || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);

            if (rules.length === 0) {
                rulesListDom.appendChild(createRuleRow(""));
            } else {
                for (const rule of rules) {
                    rulesListDom.appendChild(createRuleRow(rule));
                }
            }

            const firstInput = rulesListDom.querySelector("input[data-role='rule']");
            if (firstInput) firstInput.focus();
        }

        function onCancel() {
            close();
        }

        function onConfirm() {
            const rules = getNormalizedRulesFromUi();
            domListText = rules.join("\n");
            localStorage.setItem("domListText", domListText);
            close();
            location.reload();
        }

        //确定按钮
        const confirmBtnDom = document.getElementById("confirm-btn-zuc08");
        confirmBtnDom.addEventListener("click", onConfirm);
        //取消按钮
        const cancelBtnDom = document.getElementById("cancel-btn-zuc08");
        cancelBtnDom.addEventListener("click", onCancel);

        if (closeBtn) closeBtn.addEventListener("click", onCancel);
        if (container)
            container.addEventListener("click", function (e) {
                if (e.target === container) onCancel();
            });
        if (addRuleBtnDom)
            addRuleBtnDom.addEventListener("click", function () {
                const row = createRuleRow("");
                rulesListDom.appendChild(row);
                const input = row.querySelector("input[data-role='rule']");
                if (input) input.focus();
            });

        if (removeClickEventSwitchDom) {
            syncRemoveClickEventSwitchUi(removeClickEventSwitchDom.checked);
            removeClickEventSwitchDom.addEventListener("change", function () {
                syncRemoveClickEventSwitchUi(this.checked);
                setRemoveClickEventSetting(this.checked);
            });
        }

        keydownHandler = function (e) {
            if (e.key === "Escape") {
                e.preventDefault();
                onCancel();
            }
        };
        unsafeWindow.document.addEventListener("keydown", keydownHandler, true);

        initRules();
    }

    function hookPage(domStringList) {
        //通过换行符切割 domListText 里的内容
        for (let string of domStringList) {
            const innerDomList = document.querySelectorAll(string);
            for (let innerDomListElement of innerDomList) {
                domList.push(innerDomListElement);
            }
        }
        hookATag();
    }

    // 预留变量：早期版本曾用于循环 hook/延迟 hook；当前主要由 intervalHookPage() 控制
    let isHooking = false;
    function intervalHookPage() {
        return new Promise((resolve) => {
            console.log("intervalHookPage");
            if (domListText) {
                // 防止短时间内重复触发导致重复绑定事件/性能抖动
                if (isHooking) {
                    resolve();
                    return;
                }
                isHooking = true;
                const temp = domListText.split("\n");
                setTimeout(() => {
                    hookPage(temp);
                    isHooking = false;
                    // [修改] 补齐 resolve，避免 Promise 悬空导致后续流程不可控
                    resolve();
                }, 500);
            } else {
                isHooking = false;
                resolve();
            }
        });
    }

    // [新增] CSS 选择器生成：尽量不使用 nth-of-type，优先挑选可批量匹配的选择器
    function escapeCssIdentifier(value) {
        if (unsafeWindow.CSS && typeof unsafeWindow.CSS.escape === "function") {
            return unsafeWindow.CSS.escape(value);
        }
        return String(value)
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/[ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&")
            .replace(/^(\d)/, "\\3$1 ");
    }

    function buildSegment(el, options) {
        const tag = el.tagName.toLowerCase();
        const allowId = !(options && options.ignoreId);
        const id = allowId ? el.getAttribute("id") : null;
        if (id) {
            return `${tag}#${escapeCssIdentifier(id)}`;
        }

        const classList = Array.from(el.classList || []).filter(Boolean);
        const stableClasses = classList
            .filter((c) => !/^((ng|v|jsx|css)-|_|\d{6,}|[a-f0-9]{8,})/i.test(c))
            .slice(0, 3);
        const classPart = stableClasses.length
            ? `.${stableClasses.map(escapeCssIdentifier).join(".")}`
            : "";

        return `${tag}${classPart}`;
    }

    function querySelectorAllSafe(selector) {
        try {
            return unsafeWindow.document.querySelectorAll(selector);
        } catch (e) {
            return null;
        }
    }

    function nodeListContains(nodeList, el) {
        if (!nodeList) return false;
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i] === el) return true;
        }
        return false;
    }

    function scoreSelectorCandidate(candidate) {
        if (!candidate || !candidate.matches || candidate.count <= 0) return -1;
        if (candidate.count > 80) return -1;
        if (candidate.count > 1) return 1000 + candidate.count;
        return candidate.count;
    }

    function pickBestSelectorForElement(el) {
        if (!el || el.nodeType !== 1) return "";

        // [新增] 生成多个候选选择器后评分：匹配数 2~80 的候选优先
        const candidates = [];

        const id = el.getAttribute("id");
        if (id) {
            const idSelector = `#${escapeCssIdentifier(id)}`;
            const idMatches = querySelectorAllSafe(idSelector);
            if (idMatches && nodeListContains(idMatches, el)) {
                candidates.push({
                    selector: idSelector,
                    matches: idMatches,
                    count: idMatches.length,
                });
            }
        }

        const ownSegment = buildSegment(el, { ignoreId: true });
        const ownMatches = querySelectorAllSafe(ownSegment);
        if (ownMatches && nodeListContains(ownMatches, el)) {
            candidates.push({
                selector: ownSegment,
                matches: ownMatches,
                count: ownMatches.length,
            });
        }

        const parts = [ownSegment];
        let current = el.parentElement;
        let depth = 0;
        while (
            current &&
            current !== unsafeWindow.document.documentElement &&
            depth < 7
        ) {
            const segment = buildSegment(current, { ignoreId: false });
            parts.unshift(segment);
            const selectorChild = parts.join(" > ");
            const matchesChild = querySelectorAllSafe(selectorChild);
            if (matchesChild && nodeListContains(matchesChild, el)) {
                candidates.push({
                    selector: selectorChild,
                    matches: matchesChild,
                    count: matchesChild.length,
                });
            }

            const selectorDesc = `${segment} ${ownSegment}`;
            const matchesDesc = querySelectorAllSafe(selectorDesc);
            if (matchesDesc && nodeListContains(matchesDesc, el)) {
                candidates.push({
                    selector: selectorDesc,
                    matches: matchesDesc,
                    count: matchesDesc.length,
                });
            }

            current = current.parentElement;
            depth += 1;
        }

        let best = null;
        let bestScore = -1;
        for (const c of candidates) {
            const score = scoreSelectorCandidate(c);
            if (score > bestScore) {
                bestScore = score;
                best = c;
            }
        }

        return best ? best.selector : "";
    }

    // [新增] 选取模式 UI 与高亮样式
    function ensurePickModeStyle() {
        const styleId = "aSpuT-pick-mode-style";
        if (unsafeWindow.document.getElementById(styleId)) return;
        const style = unsafeWindow.document.createElement("style");
        style.id = styleId;
        style.textContent = `
  .aSpuT-pick-highlight {
    outline: 2px solid #ff4d4f !important;
    outline-offset: 2px !important;
    background-color: rgba(255, 77, 79, 0.08) !important;
  }
  .aSpuT-pick-panel {
    position: fixed;
    right: 12px;
    bottom: 12px;
    z-index: 2147483647;
    width: 420px;
    max-width: calc(100vw - 24px);
    background: rgba(30, 30, 30, 0.92);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 12px;
    line-height: 1.4;
    box-shadow: 0 6px 22px rgba(0,0,0,0.35);
  }
  .aSpuT-pick-panel-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .aSpuT-pick-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .aSpuT-pick-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #52c41a;
    display: inline-block;
  }
  .aSpuT-pick-btn {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.08);
    color: #fff;
    cursor: pointer;
    user-select: none;
  }
  .aSpuT-pick-btn:hover {
    background: rgba(255,255,255,0.12);
  }
  .aSpuT-pick-selector {
    margin-top: 8px;
    padding: 8px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    word-break: break-all;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  .aSpuT-pick-hint {
    margin-top: 8px;
    opacity: 0.92;
  }
  `;
        unsafeWindow.document.documentElement.appendChild(style);
    }

    function clearPickModeHighlight() {
        for (const el of pickModeLastHighlighted) {
            if (el && el.classList) el.classList.remove("aSpuT-pick-highlight");
        }
        pickModeLastHighlighted = [];
    }

    function applyPickModeHighlight(selector) {
        clearPickModeHighlight();
        if (!selector) return { count: 0, ok: false };
        const matches = querySelectorAllSafe(selector);
        if (!matches) return { count: 0, ok: false };
        for (let i = 0; i < matches.length; i++) {
            const el = matches[i];
            if (el && el.classList) el.classList.add("aSpuT-pick-highlight");
            pickModeLastHighlighted.push(el);
        }
        return { count: matches.length, ok: true };
    }

    function isPickModeUiElement(el) {
        if (!el) return false;
        if (el.id === "aSpuT-pick-panel") return true;
        if (el.closest && el.closest("#aSpuT-pick-panel")) return true;
        return false;
    }

    function updatePickModePanel(selector, matchCount) {
        if (!pickModePanelDom) return;
        const selectorDom = pickModePanelDom.querySelector(
            "[data-role='selector']"
        );
        const countDom = pickModePanelDom.querySelector("[data-role='count']");
        if (selectorDom) selectorDom.textContent = selector || "";
        if (countDom) countDom.textContent = String(matchCount);
    }

    function showPickModePanel() {
        if (pickModePanelDom) return;
        ensurePickModeStyle();
        const panel = unsafeWindow.document.createElement("div");
        panel.id = "aSpuT-pick-panel";
        panel.className = "aSpuT-pick-panel";
        panel.innerHTML = `
  <div class="aSpuT-pick-panel-row">
    <div class="aSpuT-pick-badge">
      <span class="aSpuT-pick-dot"></span>
      <span>选取模式已开启</span>
    </div>
    <div style="display:flex; gap:8px; align-items:center;">
      <span style="opacity:0.9;">匹配数：<span data-role="count">0</span></span>
      <span class="aSpuT-pick-btn" data-role="exit">退出</span>
    </div>
  </div>
  <div class="aSpuT-pick-selector" data-role="selector"></div>
  <div class="aSpuT-pick-hint">鼠标移动预览高亮，左键点击添加规则，按 ESC 退出</div>
  `;
        panel.addEventListener("click", function (e) {
            const role =
                e.target && e.target.getAttribute && e.target.getAttribute("data-role");
            if (role === "exit") {
                e.preventDefault();
                e.stopPropagation();
                setPickModeEnabled(false);
            }
        });
        unsafeWindow.document.body.appendChild(panel);
        pickModePanelDom = panel;
    }

    function hidePickModePanel() {
        if (!pickModePanelDom) return;
        if (pickModePanelDom.parentNode)
            pickModePanelDom.parentNode.removeChild(pickModePanelDom);
        pickModePanelDom = null;
    }

    // [新增] 点击选中后把选择器写入 domListText，并立即执行 hook（无需刷新页面）
    function addRuleFromPickMode(selector) {
        const normalized = (selector || "").trim();
        if (!normalized) return false;

        const lines = (domListText || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        if (!lines.includes(normalized)) {
            lines.push(normalized);
            domListText = lines.join("\n");
            localStorage.setItem("domListText", domListText);
            intervalHookPage();
            return true;
        }
        return false;
    }

    // [新增] 选取模式事件：mousemove 预览选择器并高亮（用 rAF 限流降低页面卡顿）
    function onPickModeMouseMove(e) {
        if (!isPickModeEnabled) return;
        if (pickModeRafId) return;
        pickModeRafId = unsafeWindow.requestAnimationFrame(() => {
            pickModeRafId = null;
            const rawTarget = e.target;
            const target =
                rawTarget && rawTarget.nodeType === 1
                    ? rawTarget
                    : rawTarget && rawTarget.parentElement;
            if (!target || target === pickModeLastTarget) return;
            if (isPickModeUiElement(target)) return;
            pickModeLastTarget = target;

            const selector = pickBestSelectorForElement(target);
            pickModeCurrentSelector = selector;
            const result = applyPickModeHighlight(selector);
            updatePickModePanel(selector, result.count);
        });
    }

    // [新增] 选取模式事件：click 拦截默认行为并落库规则
    function onPickModeClick(e) {
        if (!isPickModeEnabled) return;
        if (e.button !== 0) return;
        const target = e.target;
        if (isPickModeUiElement(target)) return;

        e.preventDefault();
        e.stopPropagation();

        const selector =
            pickModeCurrentSelector || pickBestSelectorForElement(target);
        pickModeCurrentSelector = selector;
        const result = applyPickModeHighlight(selector);
        updatePickModePanel(selector, result.count);
        addRuleFromPickMode(selector);
        setPickModeEnabled(false);
        window.alert("添加规则成功");
    }

    // [新增] 选取模式事件：ESC 退出
    function onPickModeKeyDown(e) {
        if (!isPickModeEnabled) return;
        if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            setPickModeEnabled(false);
        }
    }

    // [新增] 选取模式开关：统一挂载/卸载事件与面板
    function setPickModeEnabled(enabled) {
        const next = Boolean(enabled);
        if (next === isPickModeEnabled) return;
        isPickModeEnabled = next;

        if (isPickModeEnabled) {
            pickModeDomListTextSnapshot = domListText || "";
            showPickModePanel();
            clearPickModeHighlight();
            pickModeCurrentSelector = "";
            pickModeLastTarget = null;

            unsafeWindow.document.addEventListener(
                "mousemove",
                onPickModeMouseMove,
                true
            );
            unsafeWindow.document.addEventListener("click", onPickModeClick, true);
            unsafeWindow.document.addEventListener(
                "keydown",
                onPickModeKeyDown,
                true
            );
        } else {
            unsafeWindow.document.removeEventListener(
                "mousemove",
                onPickModeMouseMove,
                true
            );
            unsafeWindow.document.removeEventListener("click", onPickModeClick, true);
            unsafeWindow.document.removeEventListener(
                "keydown",
                onPickModeKeyDown,
                true
            );

            if (pickModeRafId) {
                unsafeWindow.cancelAnimationFrame(pickModeRafId);
                pickModeRafId = null;
            }
            clearPickModeHighlight();
            hidePickModePanel();

            if (pickModeDomListTextSnapshot !== domListText) {
                pickModeDomListTextSnapshot = domListText || "";
            }
        }
    }

    function watchSpaUrlChange() {
        // 监听 SPA 场景下的 URL 变化（history.pushState/replaceState + hashchange/popstate）
        // URL 变化后触发一次 intervalHookPage()，以适配前端路由切页后 DOM 重新渲染的情况
        let lastHref = unsafeWindow.location.href;

        function triggerIfChanged() {
            const href = unsafeWindow.location.href;
            if (href === lastHref) return;
            lastHref = href;
            intervalHookPage();
        }

        // 浏览器原生路由事件：前进/后退、hash 变化
        unsafeWindow.addEventListener("popstate", triggerIfChanged);
        unsafeWindow.addEventListener("hashchange", triggerIfChanged);
        unsafeWindow.addEventListener("pushstate", triggerIfChanged);
        unsafeWindow.addEventListener("replacestate", triggerIfChanged);
        unsafeWindow.addEventListener("urlchange", triggerIfChanged);
        unsafeWindow.addEventListener("Autopage:routechange", triggerIfChanged);

        // 兜底：对 pushState/replaceState 打补丁（很多 SPA 不会触发 popstate）
        function wrapMethod(target, methodName) {
            if (!target) return false;
            const original = target[methodName];
            if (typeof original !== "function") return false;
            if (original.__aSpuT_patched) return true;

            function patched() {
                const result = original.apply(this, arguments);
                // 状态变更后主动检查 URL 是否变化
                triggerIfChanged();
                return result;
            }
            patched.__aSpuT_patched = true;

            try {
                target[methodName] = patched;
                return true;
            } catch (e) {
                return false;
            }
        }

        const historyProto =
            unsafeWindow.History && unsafeWindow.History.prototype
                ? unsafeWindow.History.prototype
                : null;
        const pushOk =
            wrapMethod(historyProto, "pushState") ||
            wrapMethod(unsafeWindow.history, "pushState");
        const replaceOk =
            wrapMethod(historyProto, "replaceState") ||
            wrapMethod(unsafeWindow.history, "replaceState");

        // 某些环境不可写 history 方法时，至少先执行一次检查
        if (!pushOk || !replaceOk) {
            triggerIfChanged();
        }
    }

    // 脚本入口：集中完成所有初始化与启动逻辑，避免零散分布在文件各处
    function init() {
        // 排除 iframe：只在顶层窗口生效
        if (unsafeWindow.self !== unsafeWindow.top) {
            return;
        }

        // 读取用户保存的规则
        domListText = localStorage.getItem("domListText") || "";

        // 读取配置：是否移除原本绑定在 a 标签上的点击事件
        removeClickEvent =
            unsafeWindow.localStorage.getItem("aSpuT_removeClickEvent") === "true";

        // 注册油猴菜单入口
        GM_registerMenuCommand("🛠️规则管理", showInputTextarea);
        GM_registerMenuCommand("📌选取模式", function () {
            setPickModeEnabled(!isPickModeEnabled);
        });

        // 首次执行一次（有规则时）
        if (domListText) intervalHookPage();
        // 监听 SPA 路由变化，URL 变化后重新执行 hook
        watchSpaUrlChange();
    }

    // 启动脚本
    init();
})();
