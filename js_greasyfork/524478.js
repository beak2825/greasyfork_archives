// ==UserScript==
// @name         BibTex-Tool
// @name:zh-CN      BibTex搜索工具
// @namespace    com.jw23.overleaf
// @version      2.7.3
// @description  Fetch BibTeX/GB7714 from Google Scholar on any site. Support custom JS formatting.
// @description:zh-CN 在任意网站获取Google学术的BibTeX，支持悬停显示、自定义JS脚本格式化文献。
// @author       jw23
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/@floating-ui/core@1.6.8
// @require      https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.12
// @require      https://cdn.jsdelivr.net/npm/simple-notify@1.0.6/dist/simple-notify.min.js
// @require      https://cdn.jsdelivr.net/npm/bibtex-parse-js@0.0.24/bibtexParse.min.js
// @resource     notifycss https://cdn.jsdelivr.net/npm/simple-notify/dist/simple-notify.css
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524478/BibTex-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/524478/BibTex-Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // 1. Constants & Default Scripts
    // =========================================================================
    
    // Default Script 1: Raw BibTeX
    const SCRIPT_BIBTEX = `// 直接返回原始 BibTeX 字符串
// rawBibTeX 是从 Google Scholar 获取的原始数据
return rawBibTeX;`;

    // Default Script 2: GB/T 7714
const SCRIPT_GBT7714 = `/**
 * GB/T 7714 
 * 示例: Lipkova J, Chen R J, Chen B, et al. Title[J]. Journal, Year, Vol(Num): Pages.
 */

// --- 1. 内部函数：格式化作者 ---
function formatAuthors(rawAuthor) {
    if (!rawAuthor) return "";
    
    // Google Scholar BibTeX 通常使用 ' and ' 分割作者
    let authors = rawAuthor.split(" and ");
    
    // 格式化单个作者姓名: "Lipkova, Jana" -> "Lipkova J"
    let formattedList = authors.map(name => {
        // 处理 BibTeX 标准格式 "Last, First"
        if (name.includes(",")) {
            let parts = name.split(",");
            let lastName = parts[0].trim(); // Lipkova
            let firstName = parts[1].trim(); // Jana
            
            // 提取名首字母 (Jana -> J; Richard J -> R J)
            let initials = firstName.split(/[\\s.-]+/)
                .filter(s => s) // 过滤空字符串
                .map(s => s[0].toUpperCase())
                .join(" ");
                
            return lastName + " " + initials;
        } 
        // 处理 "First Last" 格式 (兜底)
        else {
            let parts = name.split(" ");
            let lastName = parts.pop();
            let initials = parts.map(s => s[0].toUpperCase()).join(" ");
            return lastName + " " + initials;
        }
    });

    // 超过3人，取前3人并加 ", et al."
    if (formattedList.length > 3) {
        return formattedList.slice(0, 3).join(", ") + ", et al";
    }
    
    // 3人及以下，全部列出
    return formattedList.join(", ");
}

// --- 2. 准备数据 ---
let authorStr = formatAuthors(entry.author);
let title = entry.title || "";
let year = entry.year || "";

let res = "";

// --- 3. 根据文献类型构建字符串 ---
if (entry.type === "article") {
    // 期刊 [J]
    let journal = entry.journal || "";
    let vol = entry.volume || "";
    let num = entry.number ? \`(\${entry.number})\` : "";
    let pages = entry.pages ? \`: \${entry.pages}\` : "";
    
    res = \`\${authorStr}. \${title}[J]. \${journal}, \${year}, \${vol}\${num}\${pages}.\`;

} else if (entry.type === "book" || entry.type === "incollection") {
    // 专著 [M]
    let publisher = entry.publisher || "";
    let address = entry.address || "[S.l.]"; // 出版地未知用 [S.l.]
    
    res = \`\${authorStr}. \${title}[M]. \${address}: \${publisher}, \${year}.\`;

} else if (entry.type === "phdthesis" || entry.type === "mastersthesis") {
    // 学位论文 [D]
    let school = entry.school || "";
    res = \`\${authorStr}. \${title}[D]. \${school}, \${year}.\`;

} else if (entry.type === "proceedings" || entry.type === "inproceedings" || entry.type === "conference") {
    // 会议 [C]
    let booktitle = entry.booktitle || "";
    res = \`\${authorStr}. \${title}[C]//\${booktitle}. \${year}.\`;
    
} else {
    // 默认兜底
    res = \`\${authorStr}. \${title}. \${year}.\`;
}

return res;`;

    // New Script Template
    const SCRIPT_TEMPLATE = `/**
 * 自定义格式化脚本
 * 
 * 可用变量:
 * 1. entry (Object): 解析后的 BibTeX 对象
 *    常用字段: title, author, year, journal, volume, number, pages, publisher, booktitle, key, type
 * 2. rawBibTeX (String): 原始 BibTeX 字符串
 * 
 * 返回值:
 * 请 return 一个字符串，该字符串将被复制到剪贴板。
 */

// 示例：只返回标题和年份
return \`\${entry.title} (\${entry.year})\`;
`;

    const CONSTANTS = {
        Z_INDEX: 2147483647,
        DEFAULT_MIRRORS: [
            "https://scholar.google.com.hk",
            "https://scholar.lanfanshu.cn",
            "https://xs.vygc.top",
            "https://scholar.google.com"
        ],
        DEFAULT_PLUGINS: {
            "BibTeX (Default)": SCRIPT_BIBTEX,
            "GB/T 7714": SCRIPT_GBT7714
        },
        STORAGE_KEYS: {
            ENABLED_HOSTS: 'config_enabled_hosts',
            MIRROR: 'config_mirror',
            MIRROR_LIST: 'config_mirror_list',
            PLUGINS: 'config_custom_plugins', 
            ACTIVE_PLUGIN: 'config_active_plugin',
            BTN_POS_X: 'ui_btn_pos_x',
            BTN_POS_Y: 'ui_btn_pos_y'
        }
    };

    const State = {
        currentHost: window.location.hostname,
        enabledHosts: GM_getValue(CONSTANTS.STORAGE_KEYS.ENABLED_HOSTS, ['www.overleaf.com']),
        
        currentMirror: GM_getValue(CONSTANTS.STORAGE_KEYS.MIRROR, CONSTANTS.DEFAULT_MIRRORS[0]),
        customMirrors: GM_getValue(CONSTANTS.STORAGE_KEYS.MIRROR_LIST, CONSTANTS.DEFAULT_MIRRORS),
        
        // Load plugins (merge defaults to ensure new defaults appear for old users)
        plugins: { ...CONSTANTS.DEFAULT_PLUGINS, ...GM_getValue(CONSTANTS.STORAGE_KEYS.PLUGINS, {}) },
        activePluginName: GM_getValue(CONSTANTS.STORAGE_KEYS.ACTIVE_PLUGIN, "BibTeX (Default)"),
        
        isOverleaf: window.location.hostname === 'www.overleaf.com',
        lang: navigator.language.startsWith('zh') ? 'zh' : 'en',
        
        isDragging: false,
        hoverTimer: null
    };

    State.isSiteEnabled = State.enabledHosts.includes(State.currentHost);

    // =========================================================================
    // 2. I18N
    // =========================================================================
    const Dictionary = {
        zh: {
            title: "学术搜索助手",
            placeholder: "输入论文标题...",
            settings: "设置",
            loading: "加载中...",
            no_result: "未找到相关文章",
            copy_success: "复制成功",
            copy_desc: "内容已复制到剪贴板",
            copy_fail: "复制失败",
            fail_desc: "处理失败或无法获取引用",
            mirror_label: "学术镜像",
            plugin_label: "格式化脚本",
            plugin_new: "新建",
            plugin_save: "保存",
            plugin_del: "删除",
            plugin_name_ph: "脚本名称",
            plugin_hint: "可用参数: entry.{title, author, year, journal, volume, number, pages...}",
            site_on: "当前网站已启用",
            site_off: "当前网站已禁用",
            menu_toggle: "当前网站：启用/禁用",
            verify_needed: "需要人机验证",
            verify_desc: "点击前往验证",
            custom_url: "自定义镜像 (https://...)",
            add: "添加",
            back: "返回"
        },
        en: {
            title: "Scholar Helper",
            placeholder: "Search paper title...",
            settings: "Settings",
            loading: "Loading...",
            no_result: "No articles found",
            copy_success: "Copied",
            copy_desc: "Content copied to clipboard",
            copy_fail: "Failed",
            fail_desc: "Processing failed or network error",
            mirror_label: "Scholar Mirror",
            plugin_label: "Format Script",
            plugin_new: "New",
            plugin_save: "Save",
            plugin_del: "Del",
            plugin_name_ph: "Script Name",
            plugin_hint: "Params: entry.{title, author, year, journal...}, rawBibTeX",
            site_on: "Enabled on this site",
            site_off: "Disabled on this site",
            menu_toggle: "Current Site: On/Off",
            verify_needed: "Captcha Required",
            verify_desc: "Click to verify",
            custom_url: "Custom Mirror (https://...)",
            add: "Add",
            back: "Back"
        }
    };
    const t = (key) => Dictionary[State.lang][key] || key;

    // =========================================================================
    // 3. Logic: Plugin Manager
    // =========================================================================
    class PluginManager {
        static getActiveCode() {
            // Fallback to default if active plugin is missing
            return State.plugins[State.activePluginName] || CONSTANTS.DEFAULT_PLUGINS["BibTeX (Default)"];
        }

        static execute(bibtexString) {
            try {
                // Parse BibTeX
                const parsed = bibtexParse.toJSON(bibtexString);
                if (!parsed || parsed.length === 0) throw new Error("Invalid BibTeX data");

                // Prepare entry object
                const rawEntry = parsed[0];
                const entry = {
                    key: rawEntry.citationKey,
                    type: rawEntry.entryType,
                    ...rawEntry.entryTags
                };

                // Create Function
                const userCode = this.getActiveCode();
                const userFunc = new Function("entry", "rawBibTeX", userCode);

                // Run
                return userFunc(entry, bibtexString);

            } catch (e) {
                console.error("Plugin Execution Error:", e);
                throw new Error("Script Error: " + e.message);
            }
        }

        static savePlugin(name, code) {
            if (!name) return false;
            State.plugins[name] = code;
            GM_setValue(CONSTANTS.STORAGE_KEYS.PLUGINS, State.plugins);
            return true;
        }

        static deletePlugin(name) {
            // Prevent deleting built-in defaults
            if (CONSTANTS.DEFAULT_PLUGINS[name]) return false;
            
            delete State.plugins[name];
            
            // If active plugin was deleted, switch to default
            if (State.activePluginName === name) {
                State.activePluginName = "BibTeX (Default)";
                GM_setValue(CONSTANTS.STORAGE_KEYS.ACTIVE_PLUGIN, State.activePluginName);
            }
            GM_setValue(CONSTANTS.STORAGE_KEYS.PLUGINS, State.plugins);
            return true;
        }
    }

    // =========================================================================
    // 4. Logic: API
    // =========================================================================
    const API = {
        getUrl: (path) => `${State.currentMirror}${path}`,

        async search(query) {
            const url = API.getUrl(`/scholar?hl=${State.lang}&q=${encodeURIComponent(query)}`);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url: url,
                    onload: (res) => {
                        if (res.status !== 200) return reject(new Error("Network Error: " + res.status));
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res.responseText, 'text/html');
                        if (doc.querySelector('#gs_captcha_c') || doc.title.includes("Captcha")) return reject(new Error("CAPTCHA_REQUIRED"));

                        const items = doc.querySelectorAll('div[data-cid]');
                        const results = [];
                        items.forEach((item, idx) => {
                            if (idx > 5) return;
                            const titleEl = item.querySelector("h3");
                            const authorEl = item.querySelector("div.gs_a");
                            if (titleEl && item.getAttribute('data-cid')) {
                                results.push({
                                    id: item.getAttribute('data-cid'),
                                    title: titleEl.innerText,
                                    author: authorEl ? authorEl.innerText : "Unknown"
                                });
                            }
                        });
                        resolve(results);
                    },
                    onerror: (err) => reject(err)
                });
            });
        },

        async getRawBibTeX(cid) {
            const refUrl = API.getUrl(`/scholar?q=info:${cid}:scholar.google.com/&output=cite&scirp=1&hl=${State.lang}`);
            const refPage = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ method: "GET", url: refUrl, onload: (res) => resolve(res.responseText), onerror: reject });
            });
            const parser = new DOMParser();
            const doc = parser.parseFromString(refPage, 'text/html');
            const bibAnchor = doc.querySelector(".gs_citi");
            if (!bibAnchor) throw new Error("BibTeX Link not found");
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ method: "GET", url: bibAnchor.href, onload: (res) => resolve(res.responseText), onerror: reject });
            });
        }
    };

    // =========================================================================
    // 5. DOM Helpers
    // =========================================================================
    function el(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);
        Object.entries(attrs).forEach(([key, val]) => {
            if (key === 'style' && typeof val === 'object') Object.assign(element.style, val);
            else if (key === 'className') element.className = val;
            else if (key.startsWith('on') && typeof val === 'function') element.addEventListener(key.substring(2).toLowerCase(), val);
            else element.setAttribute(key, val);
        });
        children.forEach(child => {
            if (typeof child === 'string') element.appendChild(document.createTextNode(child));
            else if (child instanceof Node) element.appendChild(child);
        });
        return element;
    }

    function icon(pathData, size = 20) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        Object.entries({ viewBox: "0 0 24 24", width: size, height: size, fill: "none", stroke: "currentColor", "stroke-width": "2" })
            .forEach(([k,v]) => svg.setAttribute(k, v));
        (Array.isArray(pathData) ? pathData : [pathData]).forEach(d => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            if(d.includes("M12 3L1")) { path.setAttribute("fill", "currentColor"); path.setAttribute("stroke", "none"); }
            svg.appendChild(path);
        });
        return svg;
    }

    const Icons = {
        scholar: icon("M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z", 24), 
        search: icon(["M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"]),
        settings: icon(["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 01 2-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"]),
        back: icon("M19 12H5M12 19l-7-7 7-7"),
        trash: icon("M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", 16),
        plus: icon("M12 5v14M5 12h14", 16),
        save: icon("M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8", 16)
    };

    // =========================================================================
    // 6. Styles
    // =========================================================================
    const STYLES = `
        .usb-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #333; z-index: ${CONSTANTS.Z_INDEX}; position: relative; }
        .usb-float-btn {
            position: fixed; width: 48px; height: 48px; z-index: ${CONSTANTS.Z_INDEX};
            background: #4285f4; color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: move;
            transition: transform 0.2s, background 0.2s; user-select: none;
        }
        .usb-float-btn:hover { background: #3367d6; transform: scale(1.05); }
        .usb-popup {
            position: fixed; width: 340px; background: white; z-index: ${CONSTANTS.Z_INDEX};
            border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            border: 1px solid #e0e0e0; display: none; flex-direction: column;
            overflow: hidden; font-size: 14px;
        }
        .usb-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: #f8f9fa; border-bottom: 1px solid #eee; }
        .usb-title { font-weight: 600; color: #4285f4; font-size: 15px; }
        .usb-icon-btn { cursor: pointer; padding: 4px; border-radius: 4px; color: #5f6368; display: flex; }
        .usb-icon-btn:hover { background: #e8eaed; color: #333; }
        .usb-content { padding: 12px; max-height: 400px; overflow-y: auto; }

        .usb-search-box { display: flex; align-items: center; margin-bottom: 10px; border: 1px solid #dfe1e5; border-radius: 20px; padding: 4px 12px; transition: box-shadow 0.2s; }
        .usb-search-box:focus-within { box-shadow: 0 1px 6px rgba(32,33,36,0.28); border-color: rgba(223,225,229,0); }
        .usb-search-input { flex: 1; border: none; outline: none; padding: 6px; font-size: 14px; background: transparent; }
        .usb-search-btn { cursor: pointer; color: #4285f4; padding: 4px; }
        .usb-result-item { padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.1s; }
        .usb-result-item:hover { background: #f1f3f4; }
        .usb-res-title { font-weight: 500; margin-bottom: 4px; color: #1a73e8; line-height: 1.4; }
        .usb-res-author { color: #5f6368; font-size: 12px; }

        .usb-settings-view { display: none; flex-direction: column; gap: 10px; }
        .usb-label { font-size: 12px; font-weight: 600; color: #5f6368; margin-bottom: 2px; display: block; }
        .usb-row { display: flex; gap: 8px; align-items: center; }
        .usb-input, .usb-select { flex: 1; padding: 6px 8px; border: 1px solid #dfe1e5; border-radius: 4px; box-sizing: border-box; font-size: 13px; }
        .usb-btn { padding: 6px 12px; background: #f1f3f4; border: 1px solid #dfe1e5; border-radius: 4px; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 4px;}
        .usb-btn:hover { background: #e8eaed; }
        .usb-btn-primary { background: #4285f4; color: white; border: none; }
        .usb-btn-primary:hover { background: #3367d6; }
        .usb-btn-danger { color: #d93025; }
        .usb-btn-danger:hover { background: #fce8e6; }
        .usb-textarea { width: 100%; height: 120px; border: 1px solid #dfe1e5; border-radius: 4px; font-family: monospace; font-size: 12px; padding: 8px; box-sizing: border-box; resize: vertical; }
        
        .usb-hint { font-size: 11px; color: #888; background: #f1f3f4; padding: 4px 6px; border-radius: 4px; font-family: monospace; margin-bottom: 4px; }
        .usb-msg { text-align: center; color: #5f6368; padding: 20px; }
        .usb-error { color: #d93025; }
    `;

    // =========================================================================
    // 7. UI Manager
    // =========================================================================
    class UIManager {
        constructor() {
            this.container = el('div', { className: 'usb-container' });
            document.body.appendChild(this.container);
            GM_addStyle(GM_getResourceText('notifycss'));
            GM_addStyle(STYLES);
            this.floatBtn = null;
            this.popup = null;
            this.els = {};
        }

        init() {
            if (State.isOverleaf) this.injectOverleaf();
            if (!State.isOverleaf) this.createFloatBtn();
            this.createPopup();
        }

        setupInteractions(triggerEl, popupEl) {
            const show = () => {
                if (State.isDragging) return;
                clearTimeout(State.hoverTimer);
                popupEl.style.display = 'flex';
                this.updatePosition(triggerEl, popupEl);
                if (!this.els.searchInput.value) this.els.searchInput.focus();
            };
            const hide = () => {
                clearTimeout(State.hoverTimer);
                State.hoverTimer = setTimeout(() => { popupEl.style.display = 'none'; }, 300);
            };
            triggerEl.addEventListener('mouseenter', show);
            triggerEl.addEventListener('mouseleave', hide);
            popupEl.addEventListener('mouseenter', () => clearTimeout(State.hoverTimer));
            popupEl.addEventListener('mouseleave', hide);
        }

        createFloatBtn() {
            this.floatBtn = el('div', { className: 'usb-float-btn', title: t('title') }, [Icons.scholar.cloneNode(true)]);
            const x = GM_getValue(CONSTANTS.STORAGE_KEYS.BTN_POS_X, 20);
            const y = GM_getValue(CONSTANTS.STORAGE_KEYS.BTN_POS_Y, window.innerHeight - 80);
            Object.assign(this.floatBtn.style, { left: `${x}px`, top: `${y}px` });

            let startX, startY, initialL, initialT;
            const onMove = (e) => {
                if (Math.abs(e.clientX - startX) > 4) State.isDragging = true;
                if (State.isDragging) {
                    this.floatBtn.style.left = `${initialL + e.clientX - startX}px`;
                    this.floatBtn.style.top = `${initialT + e.clientY - startY}px`;
                }
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                if (State.isDragging) {
                    GM_setValue(CONSTANTS.STORAGE_KEYS.BTN_POS_X, parseInt(this.floatBtn.style.left));
                    GM_setValue(CONSTANTS.STORAGE_KEYS.BTN_POS_Y, parseInt(this.floatBtn.style.top));
                    setTimeout(() => { State.isDragging = false; }, 100);
                }
            };
            this.floatBtn.addEventListener('mousedown', (e) => {
                startX = e.clientX; startY = e.clientY;
                initialL = this.floatBtn.offsetLeft; initialT = this.floatBtn.offsetTop;
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
            this.container.appendChild(this.floatBtn);
        }

        injectOverleaf() {
            const obs = new MutationObserver(() => {
                const target = document.querySelector('div.ol-cm-toolbar-button-group.ol-cm-toolbar-end');
                if (target && !document.getElementById('usb-ol-btn')) {
                    const btn = el('div', {
                        id: 'usb-ol-btn',
                        className: 'ol-cm-toolbar-button',
                        style: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
                        title: t('title')
                    }, [Icons.scholar.cloneNode(true)]);
                    target.appendChild(btn);
                    this.setupInteractions(btn, this.popup);
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }

        createPopup() {
            const configBtn = el('div', { className: 'usb-icon-btn', title: t('settings') }, [Icons.settings.cloneNode(true)]);
            const header = el('div', { className: 'usb-header' }, [el('span', { className: 'usb-title' }, [t('title')]), configBtn]);

            // VIEW: Search
            const searchInput = el('input', { className: 'usb-search-input', placeholder: t('placeholder') });
            const searchBtn = el('div', { className: 'usb-search-btn' }, [Icons.search.cloneNode(true)]);
            const resultsBox = el('div', { className: 'usb-results' });
            const searchView = el('div', { id: 'usb-view-search' }, [
                el('div', { className: 'usb-search-box' }, [searchInput, searchBtn]), resultsBox
            ]);

            // VIEW: Settings
            const backBtn = el('div', { style: { marginBottom: '10px', display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#4285f4' } }, 
                [Icons.back.cloneNode(true), el('span', { style: { marginLeft: '4px' } }, [t('back')])]
            );

            // Mirror UI
            const mirrorInput = el('input', { className: 'usb-input', placeholder: t('custom_url') });
            const mirrorSelect = el('select', { className: 'usb-select' });
            const delMirrorBtn = el('button', { className: 'usb-btn usb-btn-danger', title: t('plugin_del') }, [Icons.trash.cloneNode(true)]);

            // Plugin UI
            const pluginSelect = el('select', { className: 'usb-select' });
            const pluginNameInput = el('input', { className: 'usb-input', placeholder: t('plugin_name_ph') });
            const pluginEditor = el('textarea', { className: 'usb-textarea', spellcheck: false });
            
            const newPluginBtn = el('button', { className: 'usb-btn' }, [Icons.plus.cloneNode(true), t('plugin_new')]);
            const savePluginBtn = el('button', { className: 'usb-btn usb-btn-primary' }, [Icons.save.cloneNode(true), t('plugin_save')]);
            const delPluginBtn = el('button', { className: 'usb-btn usb-btn-danger' }, [Icons.trash.cloneNode(true), t('plugin_del')]);

            const settingsView = el('div', { className: 'usb-settings-view' }, [
                backBtn,
                // Mirrors
                el('span', { className: 'usb-label' }, [t('mirror_label')]),
                el('div', { className: 'usb-row' }, [mirrorSelect, delMirrorBtn]),
                el('div', { className: 'usb-row' }, [mirrorInput, el('button', { className: 'usb-btn', onclick: () => this.addMirror() }, [t('add')])]),
                
                // Plugins
                el('div', { style: {borderTop:'1px solid #eee', margin:'10px 0'} }),
                el('span', { className: 'usb-label' }, [t('plugin_label')]),
                el('div', { className: 'usb-row' }, [pluginSelect, newPluginBtn]),
                pluginNameInput,
                el('div', { className: 'usb-hint' }, [t('plugin_hint')]), // HINT ADDED HERE
                pluginEditor,
                el('div', { className: 'usb-row', style: { justifyContent: 'space-between' } }, [delPluginBtn, savePluginBtn])
            ]);

            this.popup = el('div', { className: 'usb-popup' }, [header, el('div', { className: 'usb-content' }, [searchView, settingsView])]);
            this.container.appendChild(this.popup);

            if (this.floatBtn) this.setupInteractions(this.floatBtn, this.popup);

            this.els = { searchInput, searchBtn, resultsBox, searchView, settingsView, mirrorSelect, mirrorInput, pluginSelect, pluginNameInput, pluginEditor, delMirrorBtn };
            this.bindEvents(configBtn, backBtn, searchBtn, searchInput, pluginSelect, savePluginBtn, delPluginBtn, newPluginBtn, mirrorSelect, delMirrorBtn);
        }

        bindEvents(configBtn, backBtn, searchBtn, searchInput, pluginSelect, saveBtn, delBtn, newBtn, mirrorSelect, delMirrorBtn) {
            configBtn.onclick = () => {
                this.els.searchView.style.display = 'none';
                this.els.settingsView.style.display = 'flex';
                this.refreshSettingsUI();
            };
            backBtn.onclick = () => {
                this.els.settingsView.style.display = 'none';
                this.els.searchView.style.display = 'block';
            };
            const doSearch = () => this.handleSearch(searchInput.value);
            searchBtn.onclick = doSearch;
            searchInput.onkeydown = (e) => { if(e.key === 'Enter') doSearch(); };

            // Mirror Logic
            mirrorSelect.onchange = () => {
                State.currentMirror = mirrorSelect.value;
                GM_setValue(CONSTANTS.STORAGE_KEYS.MIRROR, State.currentMirror);
                this.refreshSettingsUI(); // Update delete button state
                new Notify({status: 'success', text: 'Mirror changed', type: 'filled', autoclose: true});
            };
            delMirrorBtn.onclick = () => this.deleteMirror();

            // Plugin Logic
            pluginSelect.onchange = () => {
                State.activePluginName = pluginSelect.value;
                GM_setValue(CONSTANTS.STORAGE_KEYS.ACTIVE_PLUGIN, State.activePluginName);
                this.refreshPluginEditor();
            };
            newBtn.onclick = () => {
                this.els.pluginNameInput.value = "";
                this.els.pluginEditor.value = SCRIPT_TEMPLATE; // Use template
                this.els.pluginNameInput.focus();
            };
            saveBtn.onclick = () => {
                const name = this.els.pluginNameInput.value.trim();
                const code = this.els.pluginEditor.value;
                if(!name) return new Notify({status:'warning', text:'Name required', type:'filled'});
                PluginManager.savePlugin(name, code);
                State.activePluginName = name;
                GM_setValue(CONSTANTS.STORAGE_KEYS.ACTIVE_PLUGIN, name);
                new Notify({status: 'success', text: 'Script saved', type: 'filled', autoclose: true});
                this.refreshSettingsUI();
            };
            delBtn.onclick = () => {
                if(PluginManager.deletePlugin(this.els.pluginNameInput.value)) {
                    new Notify({status: 'success', text: 'Deleted', type: 'filled', autoclose: true});
                    this.refreshSettingsUI();
                } else {
                    new Notify({status: 'warning', text: 'Cannot delete default', type: 'filled'});
                }
            };
        }

        refreshSettingsUI() {
            // Mirrors
            const { mirrorSelect, delMirrorBtn } = this.els;
            mirrorSelect.innerHTML = '';
            State.customMirrors.forEach(m => {
                const opt = el('option', { value: m }, [m]);
                if (m === State.currentMirror) opt.selected = true;
                mirrorSelect.appendChild(opt);
            });
            // Disable delete if it's a default mirror
            delMirrorBtn.disabled = CONSTANTS.DEFAULT_MIRRORS.includes(State.currentMirror);
            delMirrorBtn.style.opacity = delMirrorBtn.disabled ? '0.5' : '1';

            // Plugins
            const { pluginSelect } = this.els;
            pluginSelect.innerHTML = '';
            Object.keys(State.plugins).forEach(name => {
                const opt = el('option', { value: name }, [name]);
                if (name === State.activePluginName) opt.selected = true;
                pluginSelect.appendChild(opt);
            });
            this.refreshPluginEditor();
        }

        refreshPluginEditor() {
            this.els.pluginNameInput.value = State.activePluginName;
            this.els.pluginEditor.value = State.plugins[State.activePluginName];
        }

        addMirror() {
            let url = this.els.mirrorInput.value.trim();
            if (url.endsWith('/')) url = url.slice(0, -1);
            if (!url.startsWith('http')) return new Notify({status: 'warning', text: 'Invalid URL', type: 'filled'});
            if (!State.customMirrors.includes(url)) {
                State.customMirrors.push(url);
                GM_setValue(CONSTANTS.STORAGE_KEYS.MIRROR_LIST, State.customMirrors);
                this.refreshSettingsUI();
                this.els.mirrorInput.value = '';
            }
        }

        deleteMirror() {
            const current = State.currentMirror;
            if (CONSTANTS.DEFAULT_MIRRORS.includes(current)) return;
            
            State.customMirrors = State.customMirrors.filter(m => m !== current);
            // Revert to first default
            State.currentMirror = CONSTANTS.DEFAULT_MIRRORS[0];
            
            GM_setValue(CONSTANTS.STORAGE_KEYS.MIRROR_LIST, State.customMirrors);
            GM_setValue(CONSTANTS.STORAGE_KEYS.MIRROR, State.currentMirror);
            
            new Notify({status: 'success', text: 'Mirror deleted', type: 'filled', autoclose: true});
            this.refreshSettingsUI();
        }

        updatePosition(refEl, popEl) {
            FloatingUIDOM.computePosition(refEl, popEl, {
                placement: 'left-start',
                middleware: [FloatingUICore.offset(10), FloatingUICore.flip(), FloatingUICore.shift({ padding: 10 })]
            }).then(({x, y}) => {
                Object.assign(popEl.style, { left: `${x}px`, top: `${y}px` });
            });
        }

        async handleSearch(query) {
            if (!query) return;
            const { resultsBox } = this.els;
            resultsBox.innerHTML = '';
            resultsBox.appendChild(el('div', { className: 'usb-msg' }, [t('loading')]));

            try {
                const results = await API.search(query);
                resultsBox.innerHTML = '';
                if (results.length === 0) return resultsBox.appendChild(el('div', { className: 'usb-msg' }, [t('no_result')]));

                results.forEach(item => {
                    const row = el('div', { className: 'usb-result-item' }, [
                        el('div', { className: 'usb-res-title' }, [item.title]),
                        el('div', { className: 'usb-res-author' }, [item.author])
                    ]);
                    row.onclick = () => this.handleProcess(item.id, row);
                    resultsBox.appendChild(row);
                });
            } catch (err) {
                resultsBox.innerHTML = '';
                if (err.message === "CAPTCHA_REQUIRED") {
                    const link = el('span', { style: {textDecoration:'underline', cursor:'pointer'}, onclick: () => GM_openInTab(API.getUrl('/'), {active:true}) }, [t('verify_desc')]);
                    resultsBox.appendChild(el('div', { className: 'usb-msg usb-error' }, [el('div', {}, [t('verify_needed')]), link]));
                } else {
                    resultsBox.appendChild(el('div', { className: 'usb-msg usb-error' }, [err.message]));
                }
            }
        }

        async handleProcess(id, rowEl) {
            const originBg = rowEl.style.background;
            rowEl.style.background = "#e8f0fe";
            try {
                const rawBib = await API.getRawBibTeX(id);
                const result = PluginManager.execute(rawBib);
                GM_setClipboard(result);
                new Notify({ status: 'success', title: t('copy_success'), text: t('copy_desc'), type: 'filled', autoclose: true });
            } catch (e) {
                new Notify({ status: 'error', title: t('copy_fail'), text: e.message, type: 'filled' });
            } finally {
                rowEl.style.background = originBg;
            }
        }
    }

    // =========================================================================
    // 8. Initialization
    // =========================================================================
    GM_registerMenuCommand(t('menu_toggle'), () => {
        const hosts = GM_getValue(CONSTANTS.STORAGE_KEYS.ENABLED_HOSTS, ['www.overleaf.com']);
        const idx = hosts.indexOf(window.location.hostname);
        GM_addStyle(GM_getResourceText('notifycss'));
        if (idx > -1) {
            hosts.splice(idx, 1);
            new Notify({ status: 'warning', text: t('site_off'), type: 'filled' });
        } else {
            hosts.push(window.location.hostname);
            new Notify({ status: 'success', text: t('site_on'), type: 'filled' });
        }
        GM_setValue(CONSTANTS.STORAGE_KEYS.ENABLED_HOSTS, hosts);
    });

    if (State.isSiteEnabled) {
        new UIManager().init();
    }
})();