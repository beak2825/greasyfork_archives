// ==UserScript==
// @name         PromptHelper
// @namespace    http://tampermonkey.net/
// @version      1.7.7
// @description  PromptHelper：通用于 ChatGPT, Gemini, Claude, Kimi, DeepSeek, 通义、元宝、Google AI Studio、Grok、豆包 的侧边模板助手；主/设分离；导入/导出；从聊天栏读取并回填；Kimi/Claude 专项处理（覆盖、不重复、换行保真）。新增：站点默认模板（通配符、早保存优先）；“应用默认模板”一键套用站点默认/全局默认；修复并发覆盖（读-改-写）；Helper 按钮改蓝色以适配黑底站点。—— 本版：新增夜间模式（黑色系 UI），一键切换并持久化记忆；Claude 换行保真策略保持。—— 改进版：导入/导出增强（同名标准化、冲突策略、可选跳过重复内容、可选整包导入导出、schema/version 兼容、容错更清晰）；设置页标题改为“设置站点默认模板”；导出不再询问是否包含默认模板且默认不导出默认模板。；更新默认模板。
// @author       Sauterne
// @match        http://chat.openai.com/*
// @match        https://chat.openai.com/*
// @match        http://chatgpt.com/*
// @match        https://chatgpt.com/*
// @match        http://gemini.google.com/*
// @match        https://gemini.google.com/*
// @match        http://claude.ai/*
// @match        https://claude.ai/*
// @match        http://demo.fuclaude.com/*
// @match        https://demo.fuclaude.com/*
// @match        http://www.kimi.com/*
// @match        https://www.kimi.com/*
// @match        http://kimi.com/*
// @match        https://kimi.com/*
// @match        http://kimi.moonshot.cn/*
// @match        https://kimi.moonshot.cn/*
// @match        http://chat.deepseek.com/*
// @match        https://chat.deepseek.com/*
// @match        http://www.tongyi.com/*
// @match        https://www.tongyi.com/*
// @match        http://yuanbao.tencent.com/chat/*
// @match        https://yuanbao.tencent.com/chat/*
// @match        http://aistudio.google.com/*
// @match        https://aistudio.google.com/*
// @match        http://grok.com/*
// @match        https://grok.com/*
// @match        http://www.grok.com/*
// @match        https://www.grok.com/*
// @match        http://doubao.com/*
// @match        https://doubao.com/*
// @match        http://www.doubao.com/*
// @match        https://www.doubao.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545456/PromptHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/545456/PromptHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS = { forceOpenShadow: true };
    const UI_STORE_KEY = 'universal_prompt_helper_ui_settings';
    const PROMPTS_STORE_KEY = 'universal_prompt_helper_prompts';
    const LANG_STORE_KEY = 'universal_prompt_helper_lang';
    const SITE_DEFAULTS_STORE_KEY = 'universal_prompt_helper_site_defaults';
    const THEME_STORE_KEY = 'universal_prompt_helper_theme';
    const DEFAULT_UI = { top: 100, toggleWidth: 120, toggleHeight: 40 };
    const DEFAULT_TEMPLATE_ID = 'default_interactive';

    // 导入/导出相关：保持原 schema，同时新增 bundle schema（可选）
    const EXPORT_SCHEMA = 'prompthelper.templates.v1';
    const EXPORT_BUNDLE_SCHEMA = 'prompthelper.bundle.v1';
    const IMPORT_SUFFIX_BASE = ' (imported)';

    function loadUISettings(){
        try{
            const saved = GM_getValue(UI_STORE_KEY, null);
            const parsed = saved ? JSON.parse(saved) : {};
            return { ...DEFAULT_UI, ...(parsed || {}) };
        }catch{ return { ...DEFAULT_UI }; }
    }
    function saveUISettings(s){ GM_setValue(UI_STORE_KEY, JSON.stringify(s)); }

    function loadSiteDefaults(){
        try{
            const saved = GM_getValue(SITE_DEFAULTS_STORE_KEY, '[]');
            const arr = JSON.parse(saved);
            return Array.isArray(arr) ? arr : [];
        }catch{ return []; }
    }
    function saveSiteDefaults(arr){
        GM_setValue(SITE_DEFAULTS_STORE_KEY, JSON.stringify(Array.isArray(arr)?arr:[]));
    }

    function loadTheme(){
        const t = GM_getValue(THEME_STORE_KEY, 'light');
        return (t==='dark') ? 'dark' : 'light';
    }
    function saveTheme(t){
        GM_setValue(THEME_STORE_KEY, (t==='dark')?'dark':'light');
    }

    // —— 新增：名称标准化/哈希/冲突辅助 —— //
    function normalizeName(name){ return String(name||'').trim(); }
    function normalizeKey(name){ return normalizeName(name).toLowerCase(); }
    function djb2Hash(str){
        str = String(str||'');
        let hash = 5381;
        for(let i=0;i<str.length;i++){ hash = ((hash << 5) + hash) + str.charCodeAt(i); hash |= 0; }
        return (hash >>> 0).toString(16);
    }
    function ensureUniqueName(baseName, existingSet){
        if(!existingSet.has(baseName)) return baseName;
        let candidate = `${baseName}${IMPORT_SUFFIX_BASE}`;
        if(!existingSet.has(candidate)) return candidate;
        let i=2;
        while(existingSet.has(`${baseName}${IMPORT_SUFFIX_BASE} ${i}`)) i++;
        return `${baseName}${IMPORT_SUFFIX_BASE} ${i}`;
    }
    function ensureUniqueNameNormalized(baseName, normalizedSet){
        let candidate = baseName;
        let idx = 1;
        while(normalizedSet.has(normalizeKey(candidate))){
            idx++;
            candidate = (idx===2) ? `${baseName}${IMPORT_SUFFIX_BASE}` : `${baseName}${IMPORT_SUFFIX_BASE} ${idx-1}`;
        }
        return candidate;
    }

    // 强制 open shadow
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(options) {
        if (SETTINGS.forceOpenShadow && options && options.mode === 'closed') options.mode = 'open';
        return originalAttachShadow.call(this, options);
    };

    function tryCreateInputEvent(type, opts = {}) { try { return new InputEvent(type, opts); } catch (_) { return new Event(type, { bubbles: !!opts.bubbles, cancelable: !!opts.cancelable }); } }
    function tryCreateKeyboardEvent(type, opts = {}) { try { return new KeyboardEvent(type, opts); } catch (_) { return new Event(type, { bubbles: !!opts.bubbles, cancelable: !!opts.cancelable }); } }

    function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function textToHtmlPreserveBlankLines(text){
        const lines=text.split('\n');const paras=[];let buf=[];
        const flush=()=>{if(!buf.length)return;const inner=buf.map(ln=>escapeHtml(ln)).join('<br>');paras.push(`<p>${inner}</p>`);buf=[];};
        for(let i=0;i<lines.length;i++){const ln=lines[i];if(ln===''){flush();paras.push('<p><br></p>');}else buf.push(ln);}flush();
        if(paras.length===0)paras.push('<p><br></p>');
        return paras.join('');
    }
    function textToProseMirrorParagraphHTML(text){
        const lines = text.split('\n');
        if(lines.length===0) return '<p><br></p>';
        let html = '';
        for(const ln of lines){
            if(ln==='') html += '<p><br></p>';
            else html += `<p>${escapeHtml(ln)}</p>`;
        }
        return html;
    }
    function pasteIntoProseMirror(editableEl, plainText, opts={}){
        const pmStrict = !!opts.pmStrict;
        const html = pmStrict ? textToProseMirrorParagraphHTML(plainText)
                              : textToHtmlPreserveBlankLines(plainText);
        editableEl.focus();
        let ok=false;
        try{
            const dt=new DataTransfer();
            dt.setData('text/plain',plainText);
            dt.setData('text/html',html);
            const evt=new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:dt});
            ok=editableEl.dispatchEvent(evt);
        }catch(_){ok=false;}
        if(!ok){
            try{ document.execCommand('insertHTML', false, html); }
            catch(_){
                editableEl.textContent=''; editableEl.dispatchEvent(new Event('input',{bubbles:true}));
                editableEl.textContent=plainText; editableEl.dispatchEvent(new Event('input',{bubbles:true}));
            }
        }
    }

    const nativeTextareaValueSetter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
    const nativeInputValueSetter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
    function setNativeValue(el,value){const setter=el.tagName==='TEXTAREA'?nativeTextareaValueSetter:el.tagName==='INPUT'?nativeInputValueSetter:null; if(setter) setter.call(el,value); else el.value=value;}

    window.addEventListener('DOMContentLoaded', () => {

        const siteConfigs = {
            'openai.com': { name: 'ChatGPT', inputSelector: '#prompt-textarea' },
            'chatgpt.com': { name: 'ChatGPT', inputSelector: '#prompt-textarea' },
            'gemini.google.com': { name: 'Gemini', shadowRootSelector: 'chat-app', inputSelector: 'div.initial-input-area textarea, rich-textarea .ql-editor, [contenteditable="true"][role="textbox"]' },
            'claude.ai': { name: 'Claude', inputSelector: '.ProseMirror[contenteditable="true"]' },
            'fuclaude.com': { name: 'Claude', inputSelector: '.ProseMirror[contenteditable="true"]' },
            'kimi.com': { name: 'Kimi', inputSelector: 'div.chat-input-editor[data-lexical-editor="true"], div[contenteditable="true"], textarea, [role="textbox"], [data-lexical-editor]' },
            'kimi.moonshot.cn': { name: 'Kimi', inputSelector: 'div.chat-input-editor[data-lexical-editor="true"], div[contenteditable="true"], textarea, [role="textbox"], [data-lexical-editor]' },
            'deepseek.com': { name: 'DeepSeek', inputSelector: 'textarea[placeholder*="随便聊点什么"], textarea[placeholder*="Ask me anything"], div[contenteditable="true"], #chat-input, [role="textbox"]' },
            'tongyi.com': { name: '通义', inputSelector: 'textarea[placeholder*="有问题，随时问通义"], textarea[placeholder*="问题"], textarea, div[contenteditable="true"], [role="textbox"]' },
            'yuanbao.tencent.com': { name: '腾讯元宝', inputSelector: 'textarea[placeholder*="输入问题"], textarea[placeholder*="问题"], textarea, div[contenteditable="true"], [role="textbox"]' },
            'aistudio.google.com': { name: 'Google AI Studio', shadowRootSelector: 'app-root', inputSelector: '[contenteditable="true"], textarea, [role="textbox"], [aria-label*="prompt"], [aria-label*="Prompt"], [placeholder*="prompt"], [placeholder*="Prompt"], .prompt-input, #prompt-input, input[type="text"]' },
            'grok.com': { name: 'Grok', inputSelector: 'form .query-bar textarea[aria-label], textarea[aria-label*="Grok"], textarea[aria-label*="向 Grok"], textarea' },
            'doubao.com': { name: '豆包', inputSelector: 'textarea[placeholder*="输入"], textarea[placeholder*="问题"], textarea, div[contenteditable="true"], [role="textbox"], [aria-label*="输入"], [aria-label*="提问"], [data-lexical-editor], .ProseMirror' }
        };

        const defaultPrompts={
            [DEFAULT_TEMPLATE_ID]:{
                name:"通用交互式提问模板",
                template:`# Universal Research Assistant Protocol

## CORE IDENTITY
You are a Research Intelligence System designed for absolute accuracy through systematic investigation and logical reasoning. You prioritize truth above all else and engage in intelligent dialogue to ensure perfect understanding.

## HIERARCHY OF PRINCIPLES

### Priority 1: ABSOLUTE CORRECTNESS
- Never fabricate any information
- Mark uncertainties explicitly with confidence levels
- Require minimum 3 independent sources for critical claims
- If unsure, say "I cannot verify this" rather than guess

### Priority 2: PERFECT UNDERSTANDING  
- Detect ambiguities, contradictions, and false premises
- Clarify before proceeding with research
- Confirm mutual understanding through interaction

### Priority 3: COMPREHENSIVE QUALITY
- Provide complete, specific, actionable information
- Depth over breadth - thorough analysis not surface coverage
- Evidence-based reasoning chains fully exposed

## OPERATIONAL PROTOCOL

### PHASE 1: QUERY VALIDATION
Analyze the user's question for:
- Clarity and specificity
- Logical consistency (e.g., reject "why 1+1≠2" premises)
- Completeness of context
- Feasibility with available resources

IF issues detected:
\`\`\`
📋 需要澄清

检测到的问题：
[Specific issue]

请确认或提供：
1. [Specific clarification needed]
2. [Additional context required]

示例回答："我想了解[clarified topic]在[specific context]中的[specific aspect]"
\`\`\`
WAIT for response before proceeding

### PHASE 2: DEEP ANALYSIS
Internal reasoning process (can use English for accuracy):
1. Decompose to first principles
2. Generate testable hypotheses  
3. Identify required evidence
4. Plan search strategy

### PHASE 3: SYSTEMATIC RESEARCH
Execute searches progressively:
- Core: "[topic] authoritative source"
- Academic: "[topic] research study peer reviewed"
- Verification: "[claim] fact check evidence"
- Currency: "[topic] 2024 2025 latest"
- Contradiction: "[topic] criticism problems limitations"

Source evaluation:
- Tier 1: Official/Academic (highest trust)
- Tier 2: Established media/Experts  
- Tier 3: Multiple corroborating sources
- Reject: Unsourced/Contradicted/Biased

### PHASE 4: COLLABORATIVE ENHANCEMENT
IF critical information inaccessible:
\`\`\`
🤝 需要您的协助

已验证信息：
✓ [What is confirmed]

信息缺口：
○ [What is missing]

如您能提供：
- [Specific resource access needed]

当前可确认：[Partial answer]
\`\`\`

### PHASE 5: SYNTHESIS & OUTPUT

## 研究报告

### 核心发现
[2-3句关键结论]

### 验证事实
• **事实1** [置信度:95%]
  来源：[Source 1], [Source 2], [Source 3]
  
• **事实2** [置信度:90%]
  来源：[Source 1], [Source 2]

### 逻辑推理
\`\`\`
前提A (已验证) + 前提B (已验证)
    ↓ [推理过程]
结论C [置信度:85%]
\`\`\`

### ⚠️ 不确定因素
- [Uncertain element - marked clearly]
- 总体置信度：[X%]

### 参考文献
1. [Complete citation with URL]
2. [Complete citation with URL]

---

## USER QUESTION

{User Question}

---

Execute this protocol now. Prioritize accuracy over speed. Think deeply, research thoroughly, interact intelligently.`
            }
        };

        const translations={
            zh:{
                toggleButton:"Helper",panelTitle:"PromptHelper",collapseTitle:"收起",
                selectTemplate:"选择模板",newBtn:"新建", saveBtn:"保存",deleteBtn:"删除",
                templateName:"模板名称",templateNamePlaceholder:"为您的模板命名",
                templateContent:"模板内容 (使用 {User Question} 作为占位符)",
                copyBtn:"复制到剪贴板",copiedBtn:"已复制！", submitBtn:"应用到聊天栏",
                selectDefault:"-- 选择一个模板 --",
                alertSaveSuccess:"模板已保存！", alertSaveError:"模板名称和内容不能为空！",
                alertDeleteConfirm:"确定要删除模板", alertDeleteError:"请先选择一个要删除的模板！",
                alertCopyError:"复制失败，请查看控制台。", alertSubmitError:"未找到当前网站的输入框。",
                alertTemplateError:"请先选择或创建一个模板！",
                alertCannotDeleteDefault:"默认模板不可删除。",
                alertNoUserInput:"聊天栏为空，请先在聊天栏输入内容再应用模板。",
                settingsTitle:"基础设置",
                settingTop:"容器顶部偏移（px）",
                settingToggleWidth:"Helper 按钮宽度（px）",
                settingToggleHeight:"Helper 按钮高度（px）",
                settingsSave:"保存设置", settingsReset:"恢复默认",
                importBtn:"导入模板", exportBtn:"导出模板",
                alertExportEmpty:"没有可导出的模板（默认模板不导出）。",
                alertExportDone:"模板已导出为文件：",
                alertImportInvalid:"导入失败：文件格式无效或为空。",
                alertImportDone:(added,renamed)=>`成功导入 ${added} 个模板（其中 ${renamed} 个已重命名）。`,
                quickApplyBtn:"应用默认模板",
                siteDefaultsTitle:"设置站点默认模板",
                siteDefaultsList:"已保存规则",
                sitePattern:"域名/通配符",
                siteTemplate:"绑定模板",
                siteNewBtn:"新建规则", siteSaveBtn:"保存规则", siteDeleteBtn:"删除规则",
                alertSitePatternRequired:"请输入域名或通配符（如 *.example.com、kimi.* 等）。",
                alertSiteTemplateRequired:"请选择要绑定的模板。",
                alertSiteSelectFirst:"请先选择一条规则。",
                alertSiteSaved:"规则已保存！",
                alertSiteDeleted:"规则已删除！",
                themeToggleLightTitle:"切换夜间模式",
                themeToggleDarkTitle:"切换日间模式"
            },
            en:{
                toggleButton:"Helper",panelTitle:"PromptHelper",collapseTitle:"Collapse",
                selectTemplate:"Select Template",newBtn:"New", saveBtn:"Save",deleteBtn:"Delete",
                templateName:"Template Name",templateNamePlaceholder:"Name your template",
                templateContent:"Template Content (use {User Question} as placeholder)",
                copyBtn:"Copy to Clipboard",copiedBtn:"Copied!", submitBtn:"Apply to Chat Box",
                selectDefault:"-- Select a template --",
                alertSaveSuccess:"Template saved!", alertSaveError:"Template name and content cannot be empty!",
                alertDeleteConfirm:"Are you sure you want to delete the template", alertDeleteError:"Please select a template to delete first!",
                alertCopyError:"Failed to copy. See console for details.", alertSubmitError:"Could not find the input box for the current site.",
                alertTemplateError:"Please select or create a template first!",
                alertCannotDeleteDefault:"The default template cannot be deleted.",
                alertNoUserInput:"Input box is empty. Type your prompt first, then apply the template.",
                settingsTitle:"Basic Settings",
                settingTop:"Container top offset (px)",
                settingToggleWidth:"Helper button width (px)",
                settingToggleHeight:"Helper button height (px)",
                settingsSave:"Save Settings", settingsReset:"Reset Defaults",
                importBtn:"Import", exportBtn:"Export",
                alertExportEmpty:"No templates to export (default is excluded).",
                alertExportDone:"Templates exported as file: ",
                alertImportInvalid:"Import failed: invalid or empty file.",
                alertImportDone:(added,renamed)=>`Imported ${added} templates (${renamed} renamed to avoid conflicts).`,
                quickApplyBtn:"Quick Apply",
                siteDefaultsTitle:"Set Site Default Templates",
                siteDefaultsList:"Saved Rules",
                sitePattern:"Domain / Wildcard",
                siteTemplate:"Bound Template",
                siteNewBtn:"New Rule", siteSaveBtn:"Save Rule", siteDeleteBtn:"Delete Rule",
                themeToggleLightTitle:"Toggle dark mode",
                themeToggleDarkTitle:"Toggle light mode"
            }
        };

        let currentLang=GM_getValue(LANG_STORE_KEY,'zh');
        let uiSettings = loadUISettings();
        let siteDefaults = loadSiteDefaults();
        let currentTheme = loadTheme(); // 'light' | 'dark'

        function injectStyles(){
            GM_addStyle(`
                #prompt-helper-container { all: initial !important; }
                #prompt-helper-container *, #prompt-helper-container *::before, #prompt-helper-container *::after {
                    all: unset !important; box-sizing: border-box !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                    margin: 0 !important; padding: 0 !important; text-decoration: none !important; border: none !important; outline: none !important;
                }
                /* 主题变量（默认：明亮） */
                #prompt-helper-container {
                    --ph-bg: #f8f9fa;
                    --ph-text: #333333;
                    --ph-border: #dee2e6;
                    --ph-input-bg: #ffffff;
                    --ph-input-border: #adb5bd;
                    --ph-header-text: #343a40;
                    --ph-focus: rgba(0,123,255,.25);
                    position: fixed !important;
                    top: var(--ph-top, 100px) !important;
                    right: 0 !important;
                    z-index: 99999 !important;
                    font-size: 16px !important;
                    color: var(--ph-text) !important;
                    line-height: 1.5 !important;
                }
                /* 夜间主题覆盖 */
                #prompt-helper-container[data-theme="dark"] {
                    --ph-bg: #1f2329;
                    --ph-text: #e6e6e6;
                    --ph-border: #3b4048;
                    --ph-input-bg: #2b2f36;
                    --ph-input-border: #4a4f57;
                    --ph-header-text: #e6e6e6;
                    --ph-focus: rgba(0,123,255,.35);
                }

                /* Helper 主按钮：蓝色增强对比 */
                #prompt-helper-toggle {
                    width: var(--ph-toggle-width, 120px) !important;
                    height: var(--ph-toggle-height, 40px) !important;
                    background-color: #007bff !important; color: #fff !important;
                    border-radius: 10px 0 0 10px !important;
                    cursor: pointer !important;
                    display: flex !important; align-items: center !important; justify-content: center !important;
                    font-size: 16px !important; box-shadow: -2px 2px 5px rgba(0,0,0,0.2) !important;
                    white-space: nowrap !important; padding: 0 12px !important;
                }
                /* 快速应用按钮：绿色 */
                #prompt-helper-quickapply {
                    width: var(--ph-toggle-width, 120px) !important;
                    height: 32px !important;
                    margin-top: 6px !important;
                    background-color: #28a745 !important; color: #fff !important;
                    border-radius: 10px 0 0 10px !important;
                    cursor: pointer !important;
                    display: flex !important; align-items: center !important; justify-content: center !important;
                    font-size: 13px !important; box-shadow: -2px 2px 5px rgba(0,0,0,0.18) !important;
                    white-space: nowrap !important; padding: 0 10px !important;
                }
                #prompt-helper-quickapply:hover { filter: brightness(0.95) !important; }

                #prompt-helper-content {
                    position: absolute !important;
                    top: 0 !important;
                    right: var(--ph-toggle-width, 120px) !important;
                    width: min(400px, calc(100vw - var(--ph-toggle-width, 120px) - 16px)) !important;
                    background-color: var(--ph-bg) !important;
                    border: 1px solid var(--ph-border) !important;
                    border-radius: 8px !important;
                    box-shadow: -2px 2px 10px rgba(0,0,0,0.1) !important;
                    padding: 14px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 10px !important;
                    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out !important;
                    color: var(--ph-text) !important;
                    text-align: left !important;
                    max-height: calc(100vh - var(--ph-top, 100px) - 40px) !important;
                    overflow-y: auto !important;
                    overscroll-behavior: contain !important;
                    -webkit-overflow-scrolling: touch !important;
                    padding-bottom: 14px !important;
                }
                #prompt-helper-content.hidden { transform: translateX(100%) !important; opacity: 0 !important; pointer-events: none !important; }
                #prompt-helper-content h3 { padding: 0 !important; font-size: 18px !important; color: var(--ph-header-text) !important; text-align: center !important; font-weight: bold !important; }

                /* 主/设双页互斥 */
                #prompt-helper-content[data-view="main"]    #ph-settings-view { display: none !important; }
                #prompt-helper-content[data-view="settings"] #ph-main-view     { display: none !important; }

                /* 区块与间距（适度紧凑但不重叠） */
                #prompt-helper-content .ph-section { display: flex !important; flex-direction: column !important; gap: 6px !important; }
                #prompt-helper-content .ph-section + .ph-section { margin-top: 8px !important; }

                /* 表单外观（可见边框 + 聚焦高亮） */
                #prompt-helper-content select,
                #prompt-helper-content input,
                #prompt-helper-content textarea {
                    appearance: auto !important;
                    -webkit-appearance: auto !important;
                    -moz-appearance: auto !important;
                    width: 100% !important;
                    padding: 8px !important;
                    border: 1px solid var(--ph-input-border) !important;
                    border-radius: 6px !important;
                    background-color: var(--ph-input-bg) !important;
                    color: var(--ph-text) !important;
                    line-height: 1.5 !important;
                    background-clip: padding-box !important;
                }
                #prompt-helper-content textarea { resize: vertical !important; min-height: 100px !important; }
                #prompt-helper-content #ph-template-body { height: 150px !important; }
                #prompt-helper-content select:focus,
                #prompt-helper-content input:focus,
                #prompt-helper-content textarea:focus {
                    border-color: #80bdff !important;
                    box-shadow: 0 0 0 3px var(--ph-focus) !important;
                    outline: none !important;
                }

                /* 按钮组 */
                #prompt-helper-content .ph-button-group { display: flex !important; gap: 8px !important; justify-content: space-between !important; margin-top: 6px !important; }
                #prompt-helper-content .ph-button-group button { flex-grow: 1 !important; }
                #prompt-helper-content button { padding: 10px !important; border-radius: 5px !important; border: none !important; cursor: pointer !important; font-size: 14px !important; font-weight: bold !important; transition: background-color 0.2s, color 0.2s !important; color: white !important; }
                #prompt-helper-content button:disabled { cursor: not-allowed !important; opacity: 0.7 !important; }

                #prompt-helper-container .ph-btn-primary { background-color: #007bff !important; } #prompt-helper-container .ph-btn-primary:hover { background-color: #0056b3 !important; }
                #prompt-helper-container .ph-btn-secondary { background-color: #6c757d !important; } #prompt-helper-container .ph-btn-secondary:hover { background-color: #5a6268 !important; }
                #prompt-helper-container .ph-btn-success { background-color: #28a745 !important; } #prompt-helper-container .ph-btn-success:hover { background-color: #218838 !important; }
                #prompt-helper-container .ph-btn-danger { background-color: #dc3545 !important; } #prompt-helper-container .ph-btn-danger:hover { background-color: #c82333 !important; }
                #prompt-helper-container button:focus-visible, #prompt-helper-container select:focus-visible, #prompt-helper-container input:focus-visible, #prompt-helper-container textarea:focus-visible { outline: 2px solid #0056b3 !important; outline-offset: 2px !important; }

                /* 头部 */
                #prompt-helper-container .ph-header { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 6px !important; padding: 0 !important; }
                #prompt-helper-container .ph-header-right { display: flex !important; align-items: center !important; gap: 8px !important; }
                #prompt-helper-container #ph-collapse-btn { font-size: 24px !important; cursor: pointer !important; color: #6c757d !important; background: none !important; padding: 0 5px !important; line-height: 1 !important; }

                /* 语言/设置/主题按钮（随主题变色） */
                #prompt-helper-container #ph-lang-toggle,
                #prompt-helper-container #ph-settings-btn,
                #prompt-helper-container #ph-theme-btn {
                    font-size: 12px !important;
                    color: var(--ph-text) !important;
                    background: var(--ph-input-bg) !important;
                    border: 1px solid var(--ph-input-border) !important;
                    padding: 2px 8px !important;
                    border-radius: 4px !important;
                    cursor: pointer !important;
                }
                #prompt-helper-container #ph-lang-toggle:hover,
                #prompt-helper-container #ph-settings-btn:hover,
                #prompt-helper-container #ph-theme-btn:hover {
                    background: rgba(0,0,0,0.06) !important;
                }
                #prompt-helper-container[data-theme="dark"] #ph-lang-toggle:hover,
                #prompt-helper-container[data-theme="dark"] #ph-settings-btn:hover,
                #prompt-helper-container #ph-theme-btn:hover {
                    background: #353b43 !important;
                }

                /* 设置页 */
                #prompt-helper-container #ph-settings-view { display: flex !important; flex-direction: column !important; gap: 10px !important; }
                #prompt-helper-content .ph-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px 10px !important; }
                @media (max-width: 480px) { #prompt-helper-content .ph-grid { grid-template-columns: 1fr !important; } }

                /* 响应式：小屏优化 */
                @media (max-width: 768px) {
                    #prompt-helper-container {
                        top: 12px !important;
                        font-size: 14px !important;
                        --ph-toggle-width: clamp(84px, 28vw, 120px) !important;
                        --ph-toggle-height: 36px !important;
                    }
                    #prompt-helper-toggle { border-radius: 8px 0 0 8px !important; }
                    #prompt-helper-quickapply {
                        height: 30px !important;
                        font-size: 12px !important;
                        border-radius: 8px 0 0 8px !important;
                    }
                    #prompt-helper-content {
                        padding: 12px !important;
                        max-height: calc(100vh - 24px) !important;
                    }
                    #prompt-helper-content h3 { font-size: 16px !important; }
                }
            `);
        }

        function applyUISettings(container){
            if(!container) return;
            container.style.setProperty('--ph-top', `${uiSettings.top}px`);
            container.style.setProperty('--ph-toggle-width', `${uiSettings.toggleWidth}px`);
            container.style.setProperty('--ph-toggle-height', `${uiSettings.toggleHeight}px`);
        }

        // —— 文本域/富文本工具 ——（保持原逻辑 + Claude 专用 html-direct）
        function resolveEditableTarget(el){
            if(!el) return null;
            const tag = el.tagName?.toLowerCase?.();
            if(tag==='textarea' || tag==='input') return el;
            if(el.getAttribute?.('contenteditable')==='true' || el.isContentEditable) return el;
            const inner = el.querySelector?.('[contenteditable="true"], textarea, input, [role="textbox"]');
            return inner || el;
        }
        function clearEditableContent(el){
            el = resolveEditableTarget(el);
            if(!el) return;
            try{
                el.focus();
                try{ document.execCommand('selectAll', false, null); }catch(_){}
                ['keydown','keypress','keyup'].forEach((t,i)=>{
                    const ev = tryCreateKeyboardEvent(t,{bubbles:true,cancelable:true,key:'a',code:'KeyA',ctrlKey:true,metaKey:navigator.platform.includes('Mac')});
                    setTimeout(()=>{ try{ el.dispatchEvent(ev);}catch(_){ } }, i*5);
                });
                try{ el.dispatchEvent(tryCreateInputEvent('beforeinput',{bubbles:true,cancelable:true,inputType:'deleteByCut',data:''})); }catch(_){}
                try{ el.dispatchEvent(tryCreateInputEvent('input',{bubbles:true,cancelable:true,inputType:'deleteByCut',data:''})); }catch(_){}
                try{ document.execCommand('delete'); }catch(_){}
                try{ el.innerHTML=''; }catch(_){ try{ el.textContent=''; }catch(__){} }
                try{ el.dispatchEvent(new Event('input',{bubbles:true})); }catch(_){}
                try{ el.dispatchEvent(new Event('change',{bubbles:true})); }catch(_){}
            }catch(e){
                try{ el.innerHTML=''; }catch(_){ try{ el.textContent=''; }catch(__){} }
                try{ el.dispatchEvent(new Event('input',{bubbles:true})); }catch(_){}
                try{ el.dispatchEvent(new Event('change',{bubbles:true})); }catch(_){}
            }
        }
        function replaceContentEditable(el, text, opts={}){
            el = resolveEditableTarget(el);
            if(!el) return;
            const mode = opts.mode || 'default';
            const clearBefore = !!opts.clearBefore;
            const pmStrict = !!opts.pmStrict;

            try{
                el.focus();
                if(clearBefore){
                    clearEditableContent(el);
                }
                const sel = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);

                if(mode === 'html-direct'){
                    const html = pmStrict ? textToProseMirrorParagraphHTML(text)
                                          : textToHtmlPreserveBlankLines(text);
                    let ok = false;
                    try{
                        ok = document.execCommand('insertHTML', false, html);
                    }catch(_){ ok = false; }
                    if(!ok){
                        try{ el.innerHTML = html; }catch(__){ el.textContent = text; }
                    }
                } else if(mode === 'paste-only'){
                    let ok=false;
                    try{
                        const html = pmStrict ? textToProseMirrorParagraphHTML(text)
                                              : textToHtmlPreserveBlankLines(text);
                        const dt=new DataTransfer();
                        dt.setData('text/plain', text);
                        dt.setData('text/html', html);
                        const evt=new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:dt});
                        ok=el.dispatchEvent(evt);
                        if(!ok){ el.innerHTML = html; }
                    }catch(_){
                        try{ el.innerHTML = (pmStrict ? textToProseMirrorParagraphHTML(text) : textToHtmlPreserveBlankLines(text)); }
                        catch(__){ el.textContent = text; }
                    }
                } else {
                    try { document.execCommand('insertText', false, text); } catch(_) {}
                    pasteIntoProseMirror(el, text, { pmStrict });
                }

                el.dispatchEvent(new Event('input',{bubbles:true}));
                el.dispatchEvent(new Event('change',{bubbles:true}));
                ['compositionstart','compositionupdate','compositionend'].forEach(t=>el.dispatchEvent(new Event(t,{bubbles:true})));
            }catch(e){
                try{ el.textContent = text; }catch(_){}
                el.dispatchEvent(new Event('input',{bubbles:true}));
                el.dispatchEvent(new Event('change',{bubbles:true}));
            }
        }

        function buildUI(){
            const create=(tag,id,classes=[],attributes={},children=[])=>{
                const el=document.createElement(tag);
                if(id)el.id=id; if(classes.length)el.classList.add(...classes);
                for(const k in attributes)el.setAttribute(k,attributes[k]);
                for(const c of children)el.appendChild(c);
                return el;
            };
            const D={};
            const container=create('div','prompt-helper-container');

            D.toggleButton=create('button','prompt-helper-toggle');
            D.quickApplyButton=document.createElement('button');
            D.quickApplyButton.id='prompt-helper-quickapply';

            D.contentPanel=create('div','prompt-helper-content',['hidden']);
            D.contentPanel.setAttribute('data-view','main');

            // 头部
            D.langToggleButton=create('button','ph-lang-toggle',[],{},[document.createTextNode('中/En')]);
            D.title=document.createElement('h3'); D.title.id='ph-title';

            D.themeButton=document.createElement('button'); D.themeButton.id='ph-theme-btn';
            D.settingsButton=document.createElement('button'); D.settingsButton.id='ph-settings-btn';
            D.settingsButton.appendChild(document.createTextNode('⚙️'));

            D.collapseButton=create('button','ph-collapse-btn',[],{id:'ph-collapse-btn'},[document.createTextNode('\u00d7')]);

            // 右侧按钮排列：主题切换 → 设置 → 关闭
            const rightBox=create('div',null,['ph-header-right'],{},[D.themeButton, D.settingsButton, D.collapseButton]);
            const header=create('div','ph-header',['ph-header'],{},[D.langToggleButton,D.title,rightBox]);

            // 主视图
            D.labelSelect=create('label','ph-label-select',[],{for:'ph-template-select'});
            D.templateSelect=create('select','ph-template-select');
            D.newBtn=create('button','ph-new-btn',['ph-btn-primary']);
            D.saveBtn=create('button','ph-save-btn',['ph-btn-success']);
            D.deleteBtn=create('button','ph-delete-btn',['ph-btn-danger']);
            const section1=create('div',null,['ph-section'],{},[
                D.labelSelect,D.templateSelect,
                create('div',null,['ph-button-group'],{},[D.newBtn,D.saveBtn,D.deleteBtn])
            ]);
            D.labelName=create('label','ph-label-name',[],{for:'ph-template-name'});
            D.templateNameInput=create('input','ph-template-name',[],{type:'text'});
            D.labelContent=create('label','ph-label-content',[],{for:'ph-template-body'});
            D.templateBodyTextarea=create('textarea','ph-template-body');
            const section2=create('div',null,['ph-section'],{},[
                D.labelName,D.templateNameInput,D.labelContent,D.templateBodyTextarea
            ]);
            D.copyBtn=create('button','ph-copy-btn',['ph-btn-secondary']);
            D.submitBtn=create('button','ph-submit-btn',['ph-btn-primary']);
            const sectionActions=create('div',null,['ph-section'],{},[
                create('div',null,['ph-button-group'],{},[D.copyBtn,D.submitBtn])
            ]);
            D.mainView = create('div','ph-main-view',[],{},[section1,section2,sectionActions]);

            // 设置视图 —— 基础
            D.importBtn=create('button','ph-import-btn',['ph-btn-secondary']);
            D.exportBtn=create('button','ph-export-btn',['ph-btn-secondary']);
            D.importFileInput=create('input','ph-import-file',[],{type:'file',accept:'.json,application/json',style:'display:none'});
            const sectionIO=create('div',null,['ph-section'],{},[
                create('div',null,['ph-button-group'],{},[D.importBtn,D.exportBtn]),
                D.importFileInput
            ]);
            D.settingsTitleEl = document.createElement('h4');
            D.settingsTitleEl.id='ph-settings-title';
            D.settingTopLabel = document.createElement('label'); D.settingTopLabel.htmlFor='ph-setting-top';
            D.settingTopInput = document.createElement('input'); D.settingTopInput.id='ph-setting-top'; D.settingTopInput.type='number'; D.settingTopInput.min='0'; D.settingTopInput.step='1';
            D.settingToggleWidthLabel = document.createElement('label'); D.settingToggleWidthLabel.htmlFor='ph-setting-toggle-width';
            D.settingToggleWidthInput = document.createElement('input'); D.settingToggleWidthInput.id='ph-setting-toggle-width'; D.settingToggleWidthInput.type='number'; D.settingToggleWidthInput.min='40'; D.settingToggleWidthInput.step='1';
            D.settingToggleHeightLabel = document.createElement('label'); D.settingToggleHeightLabel.htmlFor='ph-setting-toggle-height';
            D.settingToggleHeightInput = document.createElement('input'); D.settingToggleHeightInput.id='ph-setting-toggle-height'; D.settingToggleHeightInput.type='number'; D.settingToggleHeightInput.min='24'; D.settingToggleHeightInput.step='1';
            D.settingsSaveBtn = create('button','ph-settings-save',['ph-btn-success']);
            D.settingsResetBtn = create('button','ph-settings-reset',['ph-btn-secondary']);
            const settingsGrid = create('div','ph-settings-grid',['ph-grid'],{},[
                D.settingTopLabel, D.settingTopInput,
                D.settingToggleWidthLabel, D.settingToggleWidthInput,
                D.settingToggleHeightLabel, D.settingToggleHeightInput
            ]);
            const settingsButtons = create('div',null,['ph-button-group'],{},[D.settingsSaveBtn, D.settingsResetBtn]);

            // 设置视图 —— 站点默认模板
            D.siteTitle = document.createElement('h4'); D.siteTitle.id='ph-site-title';
            D.siteListLabel = document.createElement('label'); D.siteListLabel.htmlFor='ph-site-list';
            D.siteList = document.createElement('select'); D.siteList.id='ph-site-list';
            D.siteNewBtn = create('button','ph-site-new',['ph-btn-primary']);
            D.siteSaveBtn = create('button','ph-site-save',['ph-btn-success']);
            D.siteDeleteBtn = create('button','ph-site-del',['ph-btn-danger']);
            const siteListRow = create('div',null,['ph-section'],{},[
                D.siteListLabel, D.siteList,
                create('div',null,['ph-button-group'],{},[D.siteNewBtn, D.siteSaveBtn, D.siteDeleteBtn])
            ]);
            D.sitePatternLabel = document.createElement('label'); D.sitePatternLabel.htmlFor='ph-site-pattern';
            D.sitePatternInput = document.createElement('input'); D.sitePatternInput.id='ph-site-pattern'; D.sitePatternInput.type='text'; D.sitePatternInput.placeholder='e.g. *.example.com';
            D.siteTplLabel = document.createElement('label'); D.siteTplLabel.htmlFor='ph-site-tpl';
            D.siteTplSelect = document.createElement('select'); D.siteTplSelect.id='ph-site-tpl';
            const siteEditGrid = create('div','ph-site-grid',['ph-grid'],{},[
                D.sitePatternLabel, D.sitePatternInput,
                D.siteTplLabel, D.siteTplSelect
            ]);

            D.backBtn = create('button','ph-back-btn',['ph-btn-secondary'],{},[document.createTextNode('←')]);

            D.settingsView = document.createElement('div'); D.settingsView.id='ph-settings-view';
            D.settingsView.append(
                D.backBtn,
                D.siteTitle, siteListRow, siteEditGrid,
                D.settingsTitleEl, settingsGrid, settingsButtons,
                sectionIO
            );

            D.contentPanel.append(header, D.mainView, D.settingsView);
            const containerNodes = [D.toggleButton, D.quickApplyButton, D.contentPanel];
            container.append(...containerNodes);
            return {container,elements:D};
        }

        function nowStamp(){
            const d=new Date(); const p=n=>String(n).padStart(2,'0');
            return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
        }
        function downloadJSON(filename, obj){
            const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
            const url=URL.createObjectURL(blob);
            const a=document.createElement('a');
            a.href=url; a.download=filename; document.body.appendChild(a); a.click();
            setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},0);
        }
        function ensureUniqueNameLegacy(baseName, existingSet){
            return ensureUniqueName(baseName, existingSet);
        }
        function genId(prefix='id'){ return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }
        function normalizeImportedList(parsed){
            if(!parsed) return [];
            if(Array.isArray(parsed)) return parsed;
            if(Array.isArray(parsed.templates)) return parsed.templates;
            if(typeof parsed==='object'){
                const vals=Object.values(parsed).filter(v=>v && typeof v==='object' && 'name' in v && 'template' in v);
                if(vals.length) return vals;
            }
            return [];
        }
        function getCurrentSiteConfig(){ const hostname=window.location.hostname; for(const key in siteConfigs){ if(hostname.includes(key)) return siteConfigs[key]; } return null; }
        function resolveEditableTargetWrapper(el){
            return resolveEditableTarget(el);
        }
        function findInputElement(){
            const siteConfig=getCurrentSiteConfig(); if(!siteConfig){return null;}
            let inputElement=null;
            if(siteConfig.shadowRootSelector){
                const host=document.querySelector(siteConfig.shadowRootSelector);
                if(host&&host.shadowRoot){
                    const elementInShadow=host.shadowRoot.querySelector(siteConfig.inputSelector);
                    if(elementInShadow) inputElement=elementInShadow;
                }
            }
            if(!inputElement){
                const selectors=siteConfig.inputSelector.split(',').map(s=>s.trim());
                for(const selector of selectors){
                    const elements=document.querySelectorAll(selector);
                    for(const element of elements){
                        if(!element.closest('#prompt-helper-container')){ inputElement=element; break; }
                    }
                    if(inputElement) break;
                }
            }
            inputElement = resolveEditableTargetWrapper(inputElement);
            return inputElement;
        }
        function getTextFromEditable(el){
            el = resolveEditableTarget(el);
            if(!el) return '';
            const tag=el.tagName?.toLowerCase?.() || '';
            if(tag==='textarea' || tag==='input') return el.value || '';
            if(el.getAttribute?.('contenteditable')==='true' || el.isContentEditable){
                let t = (el.innerText!==undefined)? el.innerText : (el.textContent||'');
                return t.replace(/\u200B/g,'').replace(/\s+$/,'');
            }
            return (el.value || el.textContent || '').trim();
        }
        function isKimiSite(){ const h=location.hostname; return h.includes('kimi.moonshot.cn')||h.includes('kimi.com')||h.includes('www.kimi.com'); }
        function isClaudeSite(){ const h=location.hostname; return h.includes('claude.ai')||h.includes('fuclaude.com'); }

        function patternToRegex(pat){
            const esc = String(pat||'').toLowerCase().replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*');
            return new RegExp('^'+esc+'$','i');
        }
        function matchHostWithPattern(host, pat){
            if(!host || !pat) return false;
            const re = patternToRegex(pat);
            return re.test(String(host).toLowerCase());
        }

        function applyPromptToChat(inputElement, finalPrompt){
            inputElement = resolveEditableTarget(inputElement);

            if(inputElement.tagName?.toLowerCase?.()==='textarea'){
                if(location.hostname.includes('tongyi.com')){
                    const reactKey=Object.keys(inputElement).find(key=>key.startsWith('__reactInternalInstance')||key.startsWith('__reactFiber')||key.startsWith('__reactProps'));
                    if(reactKey){ try{
                        const fiberNode=inputElement[reactKey];
                        const possiblePaths=[fiberNode?.memoizedProps?.onChange,fiberNode?.return?.memoizedProps?.onChange,fiberNode?.return?.return?.memoizedProps?.onChange,fiberNode?.pendingProps?.onChange];
                        for(const onChange of possiblePaths){ if(onChange&&typeof onChange==='function'){ const fakeEvent={target:{value:finalPrompt},currentTarget:{value:finalPrompt},preventDefault:()=>{},stopPropagation:()=>{}}; onChange(fakeEvent); break; } }
                    }catch(e){ console.log('[PromptHelper] React状态操作失败:',e);} }
                    inputElement.focus(); inputElement.value=''; inputElement.value=finalPrompt;
                    try{ Object.defineProperty(inputElement,'value',{value:finalPrompt,writable:true,configurable:true}); }catch(_){}
                    [ new Event('focus',{bubbles:true}),
                      tryCreateInputEvent('beforeinput',{bubbles:true,cancelable:true,inputType:'insertText',data:finalPrompt}),
                      tryCreateInputEvent('input',{bubbles:true,cancelable:true,inputType:'insertText',data:finalPrompt}),
                      new Event('change',{bubbles:true}),
                      tryCreateKeyboardEvent('keydown',{bubbles:true,key:'a'}),
                      tryCreateKeyboardEvent('keyup',{bubbles:true,key:'a'}),
                      new Event('blur',{bubbles:true})
                    ].forEach((ev,i)=>setTimeout(()=>inputElement.dispatchEvent(ev),i*10));
                    setTimeout(()=>{ if(inputElement.value!==finalPrompt) inputElement.value=finalPrompt; inputElement.blur(); setTimeout(()=>{ inputElement.focus(); inputElement.value=finalPrompt; inputElement.dispatchEvent(tryCreateInputEvent('input',{bubbles:true,cancelable:true,data:finalPrompt,inputType:'insertText'})); inputElement.dispatchEvent(new Event('change',{bubbles:true})); inputElement.dispatchEvent(new Event('propertychange',{bubbles:true})); window.dispatchEvent(new Event('resize')); },50); },150);
                } else if(location.hostname.includes('grok.com')){
                    inputElement.focus(); setNativeValue(inputElement,''); inputElement.dispatchEvent(new Event('input',{bubbles:true})); setNativeValue(inputElement,finalPrompt);
                    try{ inputElement.setAttribute('value',finalPrompt);}catch(_){} inputElement.dispatchEvent(tryCreateInputEvent('beforeinput',{bubbles:true,cancelable:true,inputType:'insertFromPaste',data:finalPrompt})); inputElement.dispatchEvent(new Event('input',{bubbles:true})); inputElement.dispatchEvent(tryCreateInputEvent('input',{bubbles:true,cancelable:true,inputType:'insertText',data:finalPrompt})); inputElement.dispatchEvent(new Event('change',{bubbles:true}));
                    ['keydown','keypress','keyup'].forEach(type=>inputElement.dispatchEvent(tryCreateKeyboardEvent(type,{bubbles:true,cancelable:true,key:'a',code:'KeyA'})));
                    try{ inputElement.setSelectionRange(finalPrompt.length,finalPrompt.length);}catch(_){}
                    setTimeout(()=>{ inputElement.dispatchEvent(new Event('input',{bubbles:true})); inputElement.dispatchEvent(new Event('change',{bubbles:true})); },50);
                } else {
                    if(location.hostname.includes('openai.com')||location.hostname.includes('chatgpt.com')){
                        inputElement.value=finalPrompt;
                        const isChrome=navigator.userAgent.includes('Chrome')&&!navigator.userAgent.includes('Firefox');
                        if(isChrome){
                            setTimeout(()=>{
                                inputElement.focus(); inputElement.value=finalPrompt;
                                if(typeof inputElement.setSelectionRange==='function') inputElement.setSelectionRange(finalPrompt.length,finalPrompt.length);
                                inputElement.dispatchEvent(tryCreateInputEvent('input',{bubbles:true,cancelable:false,inputType:'insertText'}));
                                let protectionCount=0;
                                const protect=()=>{ if(protectionCount<20){ const cur=inputElement.value; if(cur.replace(/\n/g,'')===finalPrompt.replace(/\n/g,'')&&!cur.includes('\n')&&finalPrompt.includes('\n')){ inputElement.value=finalPrompt; if(typeof inputElement.setSelectionRange==='function') inputElement.setSelectionRange(finalPrompt.length,finalPrompt.length); inputElement.dispatchEvent(tryCreateInputEvent('input',{bubbles:true,cancelable:false,inputType:'insertText'})); } protectionCount++; setTimeout(protect,100);} };
                                setTimeout(protect,100);
                            },50);
                        } else {
                            inputElement.dispatchEvent(new Event('input',{bubbles:true}));
                            if(typeof inputElement.setSelectionRange==='function') inputElement.setSelectionRange(finalPrompt.length,finalPrompt.length);
                        }
                    } else { inputElement.value=finalPrompt; }
                    if(location.hostname.includes('deepseek.com')){
                        const parentDiv=inputElement.parentElement;
                        if(parentDiv){
                            let displayDiv=parentDiv.querySelector('.b13855df');
                            if(!displayDiv){
                                const allDivs=parentDiv.querySelectorAll('div');
                                for(const div of allDivs){ if(!div.classList.contains('_24fad49')&&div!==parentDiv){ displayDiv=div; break; } }
                            }
                            if(displayDiv){
                                displayDiv.innerHTML=''; finalPrompt.split('\n').forEach((line,idx)=>{ if(idx>0) displayDiv.appendChild(document.createElement('br')); displayDiv.appendChild(document.createTextNode(line)); });
                            }
                        }
                    }
                }
            } else if(inputElement.getAttribute && (inputElement.getAttribute('contenteditable')==='true' || inputElement.isContentEditable)){
                if(isKimiSite()){
                    replaceContentEditable(inputElement, finalPrompt, { mode: 'paste-only', clearBefore: true });
                } else if(isClaudeSite()){
                    replaceContentEditable(inputElement, finalPrompt, { mode: 'html-direct', clearBefore: true, pmStrict: true });
                } else if(location.hostname.includes('claude.ai')||location.hostname.includes('fuclaude.com')){
                    pasteIntoProseMirror(inputElement,finalPrompt,{pmStrict:true});
                    inputElement.dispatchEvent(new Event('input',{bubbles:true}));
                    inputElement.dispatchEvent(new Event('change',{bubbles:true}));
                } else {
                    if(location.hostname.includes('openai.com')||location.hostname.includes('chatgpt.com')){
                        inputElement.innerHTML='';
                        const lines=finalPrompt.split('\n');
                        lines.forEach((line,index)=>{ if(index>0) inputElement.appendChild(document.createElement('br')); if(line.length>0) inputElement.appendChild(document.createTextNode(line)); else if(index<lines.length-1) inputElement.appendChild(document.createElement('br')); });
                        const isChrome=navigator.userAgent.includes('Chrome')&&!navigator.userAgent.includes('Firefox');
                        if(isChrome){
                            const needEscape=(location.hostname.includes('openai.com')||location.hostname.includes('chatgpt.com'));
                            const htmlWithBreaks=needEscape?escapeHtml(finalPrompt).replace(/\n/g,'<br>'):finalPrompt.replace(/\n/g,'<br>');
                            setTimeout(()=>{
                                inputElement.focus(); inputElement.innerHTML=htmlWithBreaks;
                                const range=document.createRange(); const sel=window.getSelection();
                                range.selectNodeContents(inputElement); range.collapse(false); sel.removeAllRanges(); sel.addRange(range);
                                inputElement.dispatchEvent(tryCreateInputEvent('input',{bubbles:true,cancelable:false,inputType:'insertFromPaste'}));
                                let protectionCount=0;
                                const protect=()=>{ if(protectionCount<20){ const currentHtml=inputElement.innerHTML; const currentText=inputElement.textContent||inputElement.innerText;
                                    if(currentText.replace(/\n/g,'')===finalPrompt.replace(/\n/g,'')&&!currentHtml.includes('<br>')&&finalPrompt.includes('\n')){
                                        inputElement.innerHTML=htmlWithBreaks;
                                        try{ const r=document.createRange(); const s=window.getSelection(); r.selectNodeContents(inputElement); r.collapse(false); s.removeAllRanges(); s.addRange(r);}catch(_){}
                                    }
                                    protectionCount++; setTimeout(protect,100);
                                }};
                                setTimeout(protect,100);
                            },50);
                        }
                    } else { inputElement.textContent=finalPrompt; }
                }
            } else {
                if('value' in inputElement) inputElement.value=finalPrompt;
                if(inputElement.textContent!==undefined) inputElement.textContent=finalPrompt;
                if(inputElement.innerText!==undefined) inputElement.innerText=finalPrompt;
            }

            const commonEvents = (isKimiSite() || isClaudeSite())
                ? ['input','change','keydown','keyup']
                : ['input','change','keydown','keyup','paste'];
            commonEvents.forEach(type=>{
                let ev; if(type==='input') ev=tryCreateInputEvent('input',{bubbles:true,cancelable:true,inputType:'insertText',data:finalPrompt});
                else if(type==='keydown'||type==='keyup') ev=tryCreateKeyboardEvent(type,{bubbles:true,cancelable:true,key:'a',code:'KeyA'});
                else ev=new Event(type,{bubbles:true,cancelable:true});
                try{ inputElement.dispatchEvent(ev); }catch(_){}
            });

            if(location.hostname.includes('deepseek.com')){
                ['keydown','keypress','keyup'].forEach(t=>inputElement.dispatchEvent(tryCreateKeyboardEvent(t,{bubbles:true,cancelable:true,key:'a',code:'KeyA',which:65,keyCode:65})));
                inputElement.dispatchEvent(new Event('compositionstart',{bubbles:true}));
                inputElement.dispatchEvent(new Event('compositionupdate',{bubbles:true}));
                inputElement.dispatchEvent(new Event('compositionend',{bubbles:true}));
            }

            inputElement.focus();
            if(inputElement.tagName && (inputElement.tagName.toLowerCase()==='textarea'||inputElement.type==='text')){
                try{ inputElement.setSelectionRange(finalPrompt.length,finalPrompt.length);}catch(_){}
            } else if(inputElement.getAttribute && inputElement.getAttribute('contenteditable')==='true'){
                const range=document.createRange(); const sel=window.getSelection();
                if(sel&&inputElement.childNodes.length>0){ range.selectNodeContents(inputElement); range.collapse(false); sel.removeAllRanges(); sel.addRange(range);}
            }

            setTimeout(()=>{
                try{ inputElement.dispatchEvent(new Event('input',{bubbles:true})); }catch(_){}
                try{ inputElement.dispatchEvent(new Event('change',{bubbles:true})); }catch(_){}
            },100);

            const specialSites=['deepseek.com','tongyi.com','yuanbao.tencent.com','aistudio.google.com','doubao.com'];
            const currentSite=specialSites.find(site=>location.hostname.includes(site));
            if(currentSite){
                setTimeout(()=>{
                    const reactKey=Object.keys(inputElement).find(key=>key.startsWith('__reactInternalInstance')||key.startsWith('__reactFiber'));
                    if(reactKey){
                        try{
                            const fiberNode=inputElement[reactKey];
                            if(fiberNode&&fiberNode.memoizedProps&&typeof fiberNode.memoizedProps.onChange==='function'){
                                const fakeEvent={target:{value:finalPrompt},currentTarget:{value:finalPrompt},preventDefault:()=>{},stopPropagation:()=>{}};
                                fiberNode.memoizedProps.onChange(fakeEvent);
                            }
                        }catch(e){ console.log(`[PromptHelper] ${currentSite} React状态更新失败:`,e); }
                    }
                    setTimeout(()=>{ if('value' in inputElement && inputElement.value!==finalPrompt){ inputElement.value=finalPrompt; inputElement.dispatchEvent(new Event('input',{bubbles:true})); } },300);
                },500);
            }
        }

        function getFinalFromChatByTemplateStr(templateStr){
            if(!templateStr) return {error:'no_template'};
            const inputEl = findInputElement(); if(!inputEl) return {error:'no_input'};
            const userTyped = getTextFromEditable(inputEl); if(!userTyped) return {error:'no_user_input'};
            return { inputEl, final: templateStr.replace('{User Question}', userTyped) };
        }

        function buildAndInit(){
            const {container,elements:D}=buildUI();

            const addToDOM=()=>{ if(document.body){ document.body.appendChild(container); applyUISettings(container); container.setAttribute('data-theme', currentTheme);} else { setTimeout(addToDOM,100);} };
            addToDOM();

            function loadPromptsLatest(){
                let latest = {};
                const saved=GM_getValue(PROMPTS_STORE_KEY,null);
                if(saved){
                    try{ latest=JSON.parse(saved)||{}; }catch{ latest={}; }
                }
                const legacyIds=['prompt_1','prompt_2','prompt_3'];
                const legacyNames=new Set(['通用回答模板','代码评审模板','英文润色模板']);
                legacyIds.forEach(id=>{ if(id in latest) delete latest[id]; });
                for(const k of Object.keys(latest)){ if(legacyNames.has(latest[k]?.name)) delete latest[k]; }
                if(!latest[DEFAULT_TEMPLATE_ID]) latest[DEFAULT_TEMPLATE_ID]=defaultPrompts[DEFAULT_TEMPLATE_ID];
                return latest;
            }
            function savePromptsLatest(obj){
                GM_setValue(PROMPTS_STORE_KEY, JSON.stringify(obj||{}));
            }

            let prompts = loadPromptsLatest();

            function populateSiteTplSelect(){
                D.siteTplSelect.textContent='';
                for(const id in prompts){
                    const opt=document.createElement('option');
                    opt.value=id; opt.textContent=prompts[id].name || id;
                    D.siteTplSelect.appendChild(opt);
                }
            }
            function populateSiteList(){
                const t = translations[currentLang];
                D.siteList.textContent='';
                const noneOpt=document.createElement('option');
                noneOpt.value=''; noneOpt.textContent='-- ' + t.siteDefaultsList + ' --';
                D.siteList.appendChild(noneOpt);
                siteDefaults.forEach(rule=>{
                    const name = prompts[rule.templateId]?.name || `[${rule.templateId}]`;
                    const opt=document.createElement('option');
                    opt.value=rule.id; opt.textContent=`${rule.pattern}  →  ${name}`;
                    D.siteList.appendChild(opt);
                });
            }
            function clearSiteEditFields(){
                D.siteList.value='';
                D.sitePatternInput.value='';
                if(D.siteTplSelect.options.length>0) D.siteTplSelect.selectedIndex=0;
            }
            function loadSiteRuleToFields(rule){
                if(!rule) return clearSiteEditFields();
                D.sitePatternInput.value = rule.pattern || '';
                if(rule.templateId && prompts[rule.templateId]) D.siteTplSelect.value = rule.templateId;
            }

            const populateDropdown=()=>{
                const currentSelection=D.templateSelect.value;
                D.templateSelect.textContent='';
                const defaultOption=document.createElement('option');
                defaultOption.value='';
                defaultOption.textContent=translations[currentLang].selectDefault;
                D.templateSelect.appendChild(defaultOption);
                if(prompts[DEFAULT_TEMPLATE_ID]){
                    const opt=document.createElement('option');
                    opt.value=DEFAULT_TEMPLATE_ID;
                    opt.textContent=prompts[DEFAULT_TEMPLATE_ID].name;
                    D.templateSelect.appendChild(opt);
                }
                for(const id in prompts){
                    if(id===DEFAULT_TEMPLATE_ID) continue;
                    const option=document.createElement('option');
                    option.value=id; option.textContent=prompts[id].name;
                    D.templateSelect.appendChild(option);
                }
                if(prompts[currentSelection]) D.templateSelect.value=currentSelection;
            };

            const displaySelectedPrompt=()=>{
                const selectedId=D.templateSelect.value;
                if(selectedId&&prompts[selectedId]){
                    D.templateNameInput.value=prompts[selectedId].name;
                    D.templateBodyTextarea.value=prompts[selectedId].template;
                } else {
                    D.templateNameInput.value=''; D.templateBodyTextarea.value='';
                }
                D.deleteBtn.disabled=(selectedId===DEFAULT_TEMPLATE_ID);
            };

            function getActiveDefaultTemplateId(promptsIn){
                const host = location.hostname.toLowerCase();
                for(const rule of siteDefaults){
                    if(rule && matchHostWithPattern(host, rule.pattern)){
                        if(rule.templateId && promptsIn[rule.templateId]){
                            return rule.templateId;
                        }
                    }
                }
                return DEFAULT_TEMPLATE_ID;
            }
            function applyActiveDefaultToMainSelect(){
                const activeId = getActiveDefaultTemplateId(prompts);
                if(prompts[activeId]) D.templateSelect.value = activeId;
                displaySelectedPrompt();
            }

            function updateThemeButtonUI(){
                const t = translations[currentLang];
                if(currentTheme==='dark'){
                    D.themeButton.textContent = '☀️';
                    D.themeButton.title = t.themeToggleDarkTitle;
                }else{
                    D.themeButton.textContent = '🌙';
                    D.themeButton.title = t.themeToggleLightTitle;
                }
            }

            const updateUI=()=>{
                const t=translations[currentLang];
                D.toggleButton.textContent=t.toggleButton; D.title.textContent=t.panelTitle;
                D.collapseButton.title=t.collapseTitle;
                D.settingsButton.title = t.settingsTitle;
                D.quickApplyButton.textContent = t.quickApplyBtn;

                updateThemeButtonUI();

                D.labelSelect.textContent=t.selectTemplate; D.newBtn.textContent=t.newBtn;
                D.saveBtn.textContent=t.saveBtn; D.deleteBtn.textContent=t.deleteBtn;
                D.labelName.textContent=t.templateName; D.templateNameInput.placeholder=t.templateNamePlaceholder;
                D.labelContent.textContent=t.templateContent;
                D.copyBtn.textContent=t.copyBtn; D.submitBtn.textContent=t.submitBtn;

                D.settingsTitleEl.textContent = t.settingsTitle;
                D.settingTopLabel.textContent = t.settingTop;
                D.settingToggleWidthLabel.textContent = t.settingToggleWidth;
                D.settingToggleHeightLabel.textContent = t.settingToggleHeight;
                D.settingsSaveBtn.textContent = t.settingsSave;
                D.settingsResetBtn.textContent = t.settingsReset;
                D.importBtn.textContent=t.importBtn; D.exportBtn.textContent=t.exportBtn;

                D.siteTitle.textContent = t.siteDefaultsTitle;
                D.siteListLabel.textContent = t.siteDefaultsList;
                D.sitePatternLabel.textContent = t.sitePattern;
                D.siteTplLabel.textContent = t.siteTemplate;
                D.siteNewBtn.textContent = t.siteNewBtn;
                D.siteSaveBtn.textContent = t.siteSaveBtn;
                D.siteDeleteBtn.textContent = t.siteDeleteBtn;

                populateDropdown();
                populateSiteTplSelect();
                populateSiteList();

                applyActiveDefaultToMainSelect();

                D.settingTopInput.value = uiSettings.top;
                D.settingToggleWidthInput.value = uiSettings.toggleWidth;
                D.settingToggleHeightInput.value = uiSettings.toggleHeight;

                document.getElementById('prompt-helper-container')?.setAttribute('data-theme', currentTheme);
            };

            updateUI();

            // 交互
            D.toggleButton.addEventListener('click',()=>D.contentPanel.classList.remove('hidden'));
            D.collapseButton.addEventListener('click',()=>D.contentPanel.classList.add('hidden'));
            D.langToggleButton.addEventListener('click',()=>{ currentLang=currentLang==='zh'?'en':'zh'; GM_setValue(LANG_STORE_KEY,currentLang); updateUI(); });
            D.settingsButton.addEventListener('click', ()=> D.contentPanel.setAttribute('data-view','settings'));
            D.backBtn.addEventListener('click', ()=> D.contentPanel.setAttribute('data-view','main'));

            // 主题切换（持久化）
            D.themeButton.addEventListener('click', ()=>{
                currentTheme = (currentTheme==='dark') ? 'light' : 'dark';
                saveTheme(currentTheme);
                document.getElementById('prompt-helper-container')?.setAttribute('data-theme', currentTheme);
                updateThemeButtonUI();
            });

            // 模板 CRUD
            D.templateSelect.addEventListener('change',displaySelectedPrompt);
            D.newBtn.addEventListener('click',()=>{
                D.templateSelect.value='';
                D.templateNameInput.value='';
                D.templateBodyTextarea.value='';
                D.templateNameInput.focus();
                D.deleteBtn.disabled=true;
            });
            D.saveBtn.addEventListener('click',()=>{
                const name=normalizeName(D.templateNameInput.value);
                const templateText=normalizeName(D.templateBodyTextarea.value);
                if(!name||!templateText){ alert(translations[currentLang].alertSaveError); return; }
                let latest = (function(){
                    let l={}; const s=GM_getValue(PROMPTS_STORE_KEY,null); if(s){ try{ l=JSON.parse(s)||{}; }catch{ l={}; } }
                    if(!l[DEFAULT_TEMPLATE_ID]) l[DEFAULT_TEMPLATE_ID]=defaultPrompts[DEFAULT_TEMPLATE_ID];
                    return l;
                })();
                let id = D.templateSelect.value || `prompt_${Date.now()}`;
                latest[id] = { name, template: templateText };
                try{
                    GM_setValue(PROMPTS_STORE_KEY, JSON.stringify(latest));
                }catch(e){
                    alert('保存失败：可能超出存储配额或序列化失败。\n' + (e&&e.message?e.message:String(e)));
                    return;
                }
                const saved=GM_getValue(PROMPTS_STORE_KEY,null);
                try{ prompts = JSON.parse(saved)||{}; }catch{ prompts = latest; }
                updateUI();
                D.templateSelect.value=id; displaySelectedPrompt();
                alert(`${translations[currentLang].alertSaveSuccess} "${name}"`);
            });
            D.deleteBtn.addEventListener('click',()=>{
                const id=D.templateSelect.value;
                if(!id){ alert(translations[currentLang].alertDeleteError); return; }
                if(id===DEFAULT_TEMPLATE_ID){ alert(translations[currentLang].alertCannotDeleteDefault); return; }
                if(confirm(`${translations[currentLang].alertDeleteConfirm} "${prompts[id].name}"?`)){
                    let latest = (function(){ let l={}; const s=GM_getValue(PROMPTS_STORE_KEY,null); if(s){ try{ l=JSON.parse(s)||{}; }catch{ l={}; } } return l; })();
                    delete latest[id];
                    if(!latest[DEFAULT_TEMPLATE_ID]) latest[DEFAULT_TEMPLATE_ID]=defaultPrompts[DEFAULT_TEMPLATE_ID];
                    try{
                        GM_setValue(PROMPTS_STORE_KEY, JSON.stringify(latest));
                    }catch(e){
                        alert('删除失败：' + (e&&e.message?e.message:String(e)));
                        return;
                    }
                    const saved=GM_getValue(PROMPTS_STORE_KEY,null);
                    try{ prompts = JSON.parse(saved)||{}; }catch{ prompts = latest; }
                    updateUI();
                    D.templateSelect.value=DEFAULT_TEMPLATE_ID;
                    displaySelectedPrompt();
                }
            });

            // 复制（从聊天栏读取）
            D.copyBtn.addEventListener('click',()=>{
                const template=D.templateBodyTextarea.value;
                const res = getFinalFromChatByTemplateStr(template);
                if(res.error==='no_template'){ alert(translations[currentLang].alertTemplateError); return; }
                if(res.error==='no_input'){ alert(translations[currentLang].alertSubmitError); return; }
                if(res.error==='no_user_input'){ alert(translations[currentLang].alertNoUserInput); return; }
                navigator.clipboard.writeText(res.final).then(()=>{
                    const originalText=D.copyBtn.textContent; D.copyBtn.textContent=translations[currentLang].copiedBtn; D.copyBtn.disabled=true;
                    setTimeout(()=>{ D.copyBtn.textContent=originalText; D.copyBtn.disabled=false; },2000);
                }).catch(err=>{ console.error('Copy failed:',err); alert(translations[currentLang].alertCopyError); });
            });

            // 基础设置保存/重置
            D.settingsSaveBtn.addEventListener('click', ()=>{
                const top = Math.max(0, parseInt(D.settingTopInput.value||DEFAULT_UI.top,10));
                const tw = Math.max(40, parseInt(D.settingToggleWidthInput.value||DEFAULT_UI.toggleWidth,10));
                const th = Math.max(24, parseInt(D.settingToggleHeightInput.value||DEFAULT_UI.toggleHeight,10));
                uiSettings = { top, toggleWidth: tw, toggleHeight: th };
                saveUISettings(uiSettings);
                applyUISettings(document.getElementById('prompt-helper-container'));
            });
            D.settingsResetBtn.addEventListener('click', ()=>{
                uiSettings = { ...DEFAULT_UI };
                saveUISettings(uiSettings);
                D.settingTopInput.value = uiSettings.top;
                D.settingToggleWidthInput.value = uiSettings.toggleWidth;
                D.settingToggleHeightInput.value = uiSettings.toggleHeight;
                applyUISettings(document.getElementById('prompt-helper-container'));
            });

            // —— 导出（保持：不导出默认模板；仍询问是否导出整包） —— //
            D.exportBtn.addEventListener('click',()=>{
                let latest=(function(){ let l={}; const s=GM_getValue(PROMPTS_STORE_KEY,null); if(s){ try{ l=JSON.parse(s)||{}; }catch{ l={}; } } if(!l[DEFAULT_TEMPLATE_ID]) l[DEFAULT_TEMPLATE_ID]=defaultPrompts[DEFAULT_TEMPLATE_ID]; return l; })();

                // 不再询问“是否包含默认模板”；默认固定为 false
                const includeDefault = false;
                const exportBundle = !!window.confirm('是否导出“整包配置”（站点规则 + UI 设置 + 主题/语言）？\n（取消=仅导出模板）');

                const list=[];
                for(const id in latest){
                    if(!includeDefault && id===DEFAULT_TEMPLATE_ID) continue;
                    const name=normalizeName(latest[id]?.name||'');
                    const template=normalizeName(latest[id]?.template||'');
                    if(name && template) list.push({name,template});
                }
                if(!list.length){ alert(translations[currentLang].alertExportEmpty); return; }

                let payload, filename;
                if(exportBundle){
                    const siteRules = loadSiteDefaults();
                    const siteDefaultsByName = siteRules.map(r => ({
                        pattern: r.pattern,
                        templateName: latest[r.templateId]?.name || null
                    }));
                    payload = {
                        app:'PromptHelper',
                        schema:EXPORT_BUNDLE_SCHEMA,
                        version:1,
                        exportedAt:new Date().toISOString(),
                        templates:list,
                        siteDefaultsByName,
                        uiSettings: loadUISettings(),
                        theme: loadTheme(),
                        lang: GM_getValue(LANG_STORE_KEY,'zh')
                    };
                    filename=`prompthelper-bundle-${nowStamp()}.json`;
                }else{
                    payload={ app:'PromptHelper', schema:EXPORT_SCHEMA, version:1, exportedAt:new Date().toISOString(), templates:list };
                    filename=`prompthelper-templates-${nowStamp()}.json`;
                }
                downloadJSON(filename, payload);
                alert(translations[currentLang].alertExportDone + filename);
            });

            // —— 导入（保持 1.9.1 的增强能力） —— //
            D.importBtn.addEventListener('click',()=> D.importFileInput.click());
            D.importFileInput.addEventListener('change',(evt)=>{
                const file=evt.target.files && evt.target.files[0];
                if(!file) return;
                const reader=new FileReader();
                reader.onerror=()=>alert(translations[currentLang].alertImportInvalid);
                reader.onload=()=>{
                    try{
                        const text=String(reader.result||'').trim();
                        const parsed=text?JSON.parse(text):null;

                        const isBundle = parsed && parsed.schema===EXPORT_BUNDLE_SCHEMA;

                        const arr=normalizeImportedList(parsed);
                        if(!arr.length){ alert(translations[currentLang].alertImportInvalid); D.importFileInput.value=''; return; }

                        let latest=(function(){ let l={}; const s=GM_getValue(PROMPTS_STORE_KEY,null); if(s){ try{ l=JSON.parse(s)||{}; }catch{ l={}; } } if(!l[DEFAULT_TEMPLATE_ID]) l[DEFAULT_TEMPLATE_ID]=defaultPrompts[DEFAULT_TEMPLATE_ID]; return l; })();

                        const existingNameSet = new Set(Object.values(latest).map(p => normalizeName(p?.name||'')));
                        const existingNormSet = new Set(Object.values(latest).map(p => normalizeKey(p?.name||'')));
                        const nameToId = {};
                        for(const id in latest){
                            const key = normalizeKey(latest[id]?.name||'');
                            if(key) if(!(key in nameToId)) nameToId[key]=id;
                        }
                        const existingContentHashes = new Set(Object.values(latest).map(p => djb2Hash(p?.template||'')));

                        let hasNameConflict=false, hasDupContent=false;
                        for(const item of arr){
                            const nm = normalizeName(item?.name||'');
                            const key = normalizeKey(nm);
                            const body = normalizeName(item?.template||'');
                            const hh = djb2Hash(body);
                            if(!nm || !body) continue;
                            if(existingNormSet.has(key)) hasNameConflict=true;
                            if(existingContentHashes.has(hh)) hasDupContent=true;
                        }

                        let conflictPolicy='rename';
                        if(hasNameConflict){
                            const ans = (window.prompt('检测到同名模板。\n选择导入策略：\nR=重命名（默认）  S=跳过  O=覆盖', 'R')||'').trim().toUpperCase();
                            if(ans==='S') conflictPolicy='skip';
                            else if(ans==='O') conflictPolicy='overwrite';
                            else conflictPolicy='rename';
                        }
                        let skipDupByContent=false;
                        if(hasDupContent){
                            skipDupByContent = !!window.confirm('检测到与现有模板“内容完全相同”的条目。\n是否跳过这些重复内容？\n（取消=不跳过，保持旧行为）');
                        }

                        let added=0, renamed=0, overwritten=0, skippedByName=0, skippedByContent=0;
                        for(const item of arr){
                            if(!item) continue;
                            let name = normalizeName(item.name||'');
                            let body = normalizeName(item.template||'');
                            if(!name || !body) continue;

                            const key = normalizeKey(name);
                            const hh = djb2Hash(body);

                            if(skipDupByContent && existingContentHashes.has(hh)){ skippedByContent++; continue; }

                            if(existingNormSet.has(key)){
                                if(conflictPolicy==='skip'){ skippedByName++; continue; }
                                if(conflictPolicy==='overwrite'){
                                    const targetId = nameToId[key];
                                    if(targetId && targetId!==DEFAULT_TEMPLATE_ID){
                                        latest[targetId] = { name: latest[targetId].name, template: body };
                                        overwritten++;
                                        existingContentHashes.add(hh);
                                        continue;
                                    }
                                }
                                const newName = ensureUniqueNameNormalized(name, existingNormSet);
                                if(newName!==name) renamed++;
                                name = newName;
                            }

                            const newId = genId('prompt');
                            latest[newId] = { name, template: body };
                            added++;
                            existingNameSet.add(name);
                            existingNormSet.add(normalizeKey(name));
                            existingContentHashes.add(hh);
                            const nk = normalizeKey(name);
                            if(!(nk in nameToId)) nameToId[nk]=newId;
                        }

                        try{
                            GM_setValue(PROMPTS_STORE_KEY, JSON.stringify(latest));
                        }catch(e){
                            alert('导入失败：保存到本地存储时出错。\n可能是空间不足或序列化失败。\n' + (e&&e.message?e.message:String(e)));
                            D.importFileInput.value='';
                            return;
                        }

                        const saved=GM_getValue(PROMPTS_STORE_KEY,null);
                        try{ prompts = JSON.parse(saved)||{}; }catch{ prompts = latest; }
                        updateUI();

                        if(isBundle){
                            if(Array.isArray(parsed.siteDefaultsByName) && parsed.siteDefaultsByName.length){
                                if(window.confirm('检测到“站点默认模板”规则。是否导入这些规则？（按模板名匹配）')){
                                    const nameToId2 = {};
                                    for(const id in prompts){
                                        const key2 = normalizeKey(prompts[id]?.name||'');
                                        if(key2 && !(key2 in nameToId2)) nameToId2[key2]=id;
                                    }
                                    let rules = loadSiteDefaults();
                                    let changed=false;
                                    for(const r of parsed.siteDefaultsByName){
                                        const pat = normalizeName(r?.pattern||'');
                                        const tname = normalizeName(r?.templateName||'');
                                        if(!pat || !tname) continue;
                                        const tid = nameToId2[normalizeKey(tname)];
                                        if(!tid) continue;
                                        const exists = rules.some(x => normalizeName(x.pattern)===pat && x.templateId===tid);
                                        if(exists) continue;
                                        rules.push({ id: genId('map'), pattern: pat, templateId: tid, createdAt: Date.now() });
                                        changed=true;
                                    }
                                    if(changed){
                                        try{
                                            saveSiteDefaults(rules);
                                            siteDefaults = loadSiteDefaults();
                                            populateSiteList();
                                        }catch(e){
                                            alert('导入站点规则失败：' + (e&&e.message?e.message:String(e)));
                                        }
                                    }
                                }
                            }
                            const wantSettings = (parsed.uiSettings || parsed.theme || parsed.lang) && window.confirm('检测到界面设置（位置/大小）与主题/语言。是否导入这些设置？');
                            if(wantSettings){
                                try{
                                    if(parsed.uiSettings && typeof parsed.uiSettings==='object'){
                                        const top = Math.max(0, parseInt(parsed.uiSettings.top||DEFAULT_UI.top,10));
                                        const tw = Math.max(40, parseInt(parsed.uiSettings.toggleWidth||DEFAULT_UI.toggleWidth,10));
                                        const th = Math.max(24, parseInt(parsed.uiSettings.toggleHeight||DEFAULT_UI.toggleHeight,10));
                                        uiSettings = { top, toggleWidth: tw, toggleHeight: th };
                                        saveUISettings(uiSettings);
                                        applyUISettings(document.getElementById('prompt-helper-container'));
                                    }
                                    if(parsed.theme && (parsed.theme==='light'||parsed.theme==='dark')){
                                        currentTheme = parsed.theme;
                                        saveTheme(currentTheme);
                                        document.getElementById('prompt-helper-container')?.setAttribute('data-theme', currentTheme);
                                    }
                                    if(parsed.lang && (parsed.lang==='zh'||parsed.lang==='en')){
                                        currentLang = parsed.lang;
                                        GM_setValue(LANG_STORE_KEY, currentLang);
                                    }
                                    updateUI();
                                }catch(e){
                                    alert('导入设置失败：' + (e&&e.message?e.message:String(e)));
                                }
                            }
                        }

                        const baseMsg = translations[currentLang].alertImportDone(added, renamed);
                        const extra = [];
                        if(overwritten) extra.push(`覆盖 ${overwritten}`);
                        if(skippedByName) extra.push(`跳过(同名) ${skippedByName}`);
                        if(skippedByContent) extra.push(`跳过(内容重复) ${skippedByContent}`);
                        alert(extra.length ? `${baseMsg}\n${extra.join('；')}` : baseMsg);

                        D.importFileInput.value='';
                    }catch(e){
                        console.error(e);
                        alert(translations[currentLang].alertImportInvalid);
                        D.importFileInput.value='';
                    }
                };
                reader.readAsText(file,'utf-8');
            });

            // 站点默认模板（读-改-写，仅改动目标条目）
            function refreshSiteDefaultsFromStore(){
                siteDefaults = loadSiteDefaults();
            }
            D.siteNewBtn.addEventListener('click', ()=> {
                D.siteList.value='';
                D.sitePatternInput.value='';
                if(D.siteTplSelect.options.length>0) D.siteTplSelect.selectedIndex=0;
                D.sitePatternInput.focus();
            });
            D.siteSaveBtn.addEventListener('click', ()=>{
                const t = translations[currentLang];
                const pattern = normalizeName(D.sitePatternInput.value||'');
                const tplId = D.siteTplSelect.value;
                if(!pattern){ alert(t.alertSitePatternRequired); return; }
                if(!tplId){ alert(t.alertSiteTemplateRequired); return; }

                let latest = loadSiteDefaults();
                const selectedId = D.siteList.value;
                if(selectedId){
                    const idx = latest.findIndex(r=>r.id===selectedId);
                    if(idx>=0){
                        latest[idx] = { ...latest[idx], pattern, templateId: tplId };
                    }else{
                        latest.push({ id: selectedId, pattern, templateId: tplId, createdAt: Date.now() });
                    }
                }else{
                    latest.push({ id: genId('map'), pattern, templateId: tplId, createdAt: Date.now() });
                }
                saveSiteDefaults(latest);

                refreshSiteDefaultsFromStore();
                populateSiteList();
                alert(t.alertSiteSaved);

                const activeId = (function(promptsIn){
                    const host = location.hostname.toLowerCase();
                    for(const rule of siteDefaults){
                        if(rule && matchHostWithPattern(host, rule.pattern)){
                            if(rule.templateId && promptsIn[rule.templateId]) return rule.templateId;
                        }
                    }
                    return DEFAULT_TEMPLATE_ID;
                })(prompts);
                if(prompts[activeId]) D.templateSelect.value=activeId;
                displaySelectedPrompt();
            });
            D.siteDeleteBtn.addEventListener('click', ()=>{
                const t = translations[currentLang];
                const selectedId = D.siteList.value;
                if(!selectedId){ alert(t.alertSiteSelectFirst); return; }
                let latest = loadSiteDefaults();
                const idx = latest.findIndex(r=>r.id===selectedId);
                if(idx>=0){ latest.splice(idx,1); }
                saveSiteDefaults(latest);

                siteDefaults = loadSiteDefaults();
                populateSiteList();
                D.siteList.value='';
                D.sitePatternInput.value='';
                if(D.siteTplSelect.options.length>0) D.siteTplSelect.selectedIndex=0;
                alert(t.alertSiteDeleted);

                const activeId = (function(promptsIn){
                    const host = location.hostname.toLowerCase();
                    for(const rule of siteDefaults){
                        if(rule && matchHostWithPattern(host, rule.pattern)){
                            if(rule.templateId && promptsIn[rule.templateId]) return rule.templateId;
                        }
                    }
                    return DEFAULT_TEMPLATE_ID;
                })(prompts);
                if(prompts[activeId]) D.templateSelect.value=activeId;
                displaySelectedPrompt();
            });
            D.siteList.addEventListener('change', ()=>{
                const id = D.siteList.value;
                const rule = siteDefaults.find(r=>r.id===id);
                if(!rule){
                    D.sitePatternInput.value='';
                    if(D.siteTplSelect.options.length>0) D.siteTplSelect.selectedIndex=0;
                    return;
                }
                D.sitePatternInput.value = rule.pattern || '';
                if(rule.templateId && prompts[rule.templateId]) D.siteTplSelect.value = rule.templateId;
            });

            // 应用（主按钮 & 快速应用）
            D.submitBtn.addEventListener('click',()=>{
                const template=D.templateBodyTextarea.value;
                const res = getFinalFromChatByTemplateStr(template);
                if(res.error==='no_template'){ alert(translations[currentLang].alertTemplateError); return; }
                if(res.error==='no_input'){ alert(translations[currentLang].alertSubmitError); return; }
                if(res.error==='no_user_input'){ alert(translations[currentLang].alertNoUserInput); return; }
                applyPromptToChat(res.inputEl, res.final);
                D.contentPanel.classList.add('hidden');
            });
            D.quickApplyButton.addEventListener('click', ()=>{
                const promptsSaved=GM_getValue(PROMPTS_STORE_KEY,null);
                let promptsLatest = prompts;
                if(promptsSaved){ try{ promptsLatest = JSON.parse(promptsSaved)||prompts; }catch{} }
                const activeId = (function(promptsIn){
                    const host = location.hostname.toLowerCase();
                    for(const rule of siteDefaults){
                        if(rule && matchHostWithPattern(host, rule.pattern)){
                            if(rule.templateId && promptsIn[rule.templateId]) return rule.templateId;
                        }
                    }
                    return DEFAULT_TEMPLATE_ID;
                })(promptsLatest);
                const tpl = (promptsLatest[activeId]?.template) || (defaultPrompts[DEFAULT_TEMPLATE_ID]?.template)||'';
                const res = getFinalFromChatByTemplateStr(tpl);
                if(res.error==='no_template'){ alert(translations[currentLang].alertTemplateError); return; }
                if(res.error==='no_input'){ alert(translations[currentLang].alertSubmitError); return; }
                if(res.error==='no_user_input'){ alert(translations[currentLang].alertNoUserInput); return; }
                applyPromptToChat(res.inputEl, res.final);
                document.querySelector('#prompt-helper-content')?.classList.add('hidden');
            });
        }

        function init(){
            if(document.getElementById('prompt-helper-container')) return;
            if(window.promptHelperInitialized) return;
            window.promptHelperInitialized=true;

            injectStyles();
            const {container} = (function(){
                const res = buildAndInit();
                return res||{};
            })();
        }

        if(getCurrentSiteConfig()){ init(); }
    });
})();
