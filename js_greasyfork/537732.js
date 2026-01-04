// ==UserScript==
// @name                    Search Engine Redirector, Search Engine Manager
// @name:zh-CN              搜索引擎重定向插件，搜索引擎管理助手
// @name:zh-TW              搜尋引擎重定向插件，搜尋引擎管理助手
// @name:en                 Search Engine Redirector, Search Engine Manager
// @name:ja                 検索エンジンリダイレクター・検索エンジン管理
// @name:ko                 검색 엔진 리디렉터, 검색 엔진 관리자
// @name:ru                 Перенаправление поисковых систем, Менеджер поисковых систем
// @name:fr                 Redirection de moteur de recherche, Gestionnaire de moteurs de recherche
// @name:es                 Redireccionador de motores de búsqueda, Gestor de motores de búsqueda
// @name:de                 Suchmaschinen-Umleiter, Suchmaschinen-Manager
// @name:pt-BR              Redirecionador de Mecanismos de Busca, Gerenciador de Mecanismos de Busca
// @name:it                 Reindirizzatore motore di ricerca, Gestore motore di ricerca
// @name:tr                 Arama Motoru Yönlendirici, Arama Motoru Yöneticisi
// @name:vi                 Trình chuyển hướng công cụ tìm kiếm, Trình quản lý công cụ tìm kiếm
// @name:pl                 Przekierowywacz wyszukiwarek, Menedżer wyszukiwarek
// @name:uk                 Перенаправлення пошукових систем, Менеджер пошукових систем
// @name:ar                 معيد توجيه محرك البحث، مدير محرك البحث
// @name:hi                 सर्च इंजन रीडायरेक्टर, सर्च इंजन मैनेजर
// @description             Redirect search requests from one engine to another (supports multiple engines) and manage search engine redirection rules
// @description:zh-CN       将搜索请求从一个搜索引擎重定向到另一个（支持多个搜索引擎），并管理搜索引擎重定向规则
// @description:zh-TW       將搜尋請求從一個搜尋引擎重定向到另一個（支援多個搜尋引擎），並管理搜尋引擎重定向規則
// @description:en          Redirect search requests from one engine to another (supports multiple engines) and manage search engine redirection rules
// @description:ja          検索リクエストを別の検索エンジンにリダイレクト（複数エンジン対応）、リダイレクトルールを管理
// @description:ko          검색 요청을 다른 검색 엔진으로 리디렉션(여러 엔진 지원), 검색 엔진 리디렉션 규칙 관리
// @description:ru          Перенаправляет поисковые запросы с одной системы на другую (поддержка нескольких систем) и управляет правилами перенаправления
// @description:fr          Redirige les requêtes de recherche d'un moteur à un autre (plusieurs moteurs pris en charge) et gère les règles de redirection
// @description:es          Redirige las búsquedas de un motor a otro (soporta múltiples motores) y gestiona reglas de redirección
// @description:de          Leitet Suchanfragen von einer Suchmaschine zu einer anderen um (unterstützt mehrere Suchmaschinen) und verwaltet Umleitungsregeln
// @description:pt-BR       Redireciona buscas de um mecanismo para outro (suporta múltiplos mecanismos) e gerencia regras de redirecionamento
// @description:it          Reindirizza le ricerche da un motore all'altro (supporta più motori) e gestisce le regole di reindirizzamento
// @description:tr          Arama isteklerini bir motordan diğerine yönlendirir (birden fazla motor desteklenir) ve yönlendirme kurallarını yönetir
// @description:vi          Chuyển hướng tìm kiếm từ một công cụ sang công cụ khác (hỗ trợ nhiều công cụ), quản lý quy tắc chuyển hướng
// @description:pl          Przekierowuje zapytania z jednej wyszukiwarki do innej (obsługuje wiele wyszukiwarek) i zarządza regułami przekierowań
// @description:uk          Перенаправляє пошукові запити з однієї системи на іншу (підтримка декількох систем) і керує правилами перенаправлення
// @description:ar          يعيد توجيه طلبات البحث من محرك إلى آخر (يدعم عدة محركات) ويدير قواعد إعادة التوجيه (يدعم الصينية والإنجليزية)
// @description:hi          खोज अनुरोधों को एक इंजन से दूसरे में रीडायरेक्ट करें (कई इंजन समर्थित), रीडायरेक्शन नियम प्रबंधित करें 
// @namespace               https://github.com/r6hk/search-engine-redirect/
// @homepage                https://github.com/r6hk/search-engine-redirect/
// @supportURL              https://github.com/r6hk/search-engine-redirect/
// @version                 1.0.1
// @author                  r6hk
// @match                   *://*/*
// @grant                   GM_registerMenuCommand
// @grant                   GM_setValue
// @grant                   GM_getValue
// @grant                   GM_getResourceText
// @grant                   GM_addStyle
// @run-at                  document-start
// @license                 MIT
// @downloadURL https://update.greasyfork.org/scripts/537732/Search%20Engine%20Redirector%2C%20Search%20Engine%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/537732/Search%20Engine%20Redirector%2C%20Search%20Engine%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 搜索引擎信息
    const SEARCH_ENGINES = {
        Google: {
            prefix: 'https://www.google.com/search',
            param: 'q'
        },
        Bing: {
            prefix: 'https://www.bing.com/search',
            param: 'q'
        },
        DuckDuckGo: {
            prefix: 'https://duckduckgo.com/',
            param: 'q'
        },
        Yandex: {
            prefix: 'https://yandex.com/search',
            param: 'text'
        },
        'Brave Search': {
            prefix: 'https://search.brave.com/search',
            param: 'q'
        },
        Startpage: {
            prefix: 'https://www.startpage.com/do/search',
            param: 'q'
        },
        Ecosia: {
            prefix: 'https://www.ecosia.org/search',
            param: 'q'
        }
    };

    // 存储键名
    const STORAGE_KEYS = {
        REDIRECT_LIST: 'redirect_list',
        RULES: 'rules'
    };

    // 国际化文本
    const i18n = {
        en: {
            title: "Search Engine Redirector Settings",
            redirectLabel: "Search engines I want to redirect:",
            enabledRules: "Enabled Rules",
            disabledRules: "Disabled Rules",
            addButton: "Add",
            name: "Name",
            keyword: "Keyword",
            urlFormat: "URL Format (use %s for query)",
            actions: "Actions",
            setDefault: "Set Default",
            disable: "Disable",
            enable: "Enable",
            delete: "Delete",
            save: "Save",
            cancel: "Cancel",
            addRule: "Add Rule",
            ruleName: "Rule Name",
            ruleKeyword: "Shortcut Keyword",
            ruleUrl: "URL Format",
            required: "Required",
            invalidUrl: "URL must contain '%s'",
            defaultSet: "Default set",
            ruleAdded: "Rule added",
            ruleDeleted: "Rule deleted",
            ruleEnabled: "Rule enabled",
            ruleDisabled: "Rule disabled",
            settingsSaved: "Settings saved"
        },
        zh: {
            title: "搜索引擎重定向设置",
            redirectLabel: "我希望重定向的搜索引擎：",
            enabledRules: "已启用规则",
            disabledRules: "已禁用规则",
            addButton: "添加",
            name: "名称",
            keyword: "快捷字词",
            urlFormat: "网址格式（用\"%s\"代替搜索字词）",
            actions: "操作",
            setDefault: "设为默认",
            disable: "禁用",
            enable: "启用",
            delete: "删除",
            save: "保存",
            cancel: "取消",
            addRule: "添加规则",
            ruleName: "规则名称",
            ruleKeyword: "快捷字词",
            ruleUrl: "网址格式",
            required: "必填",
            invalidUrl: "URL必须包含'%s'",
            defaultSet: "已设为默认",
            ruleAdded: "规则已添加",
            ruleDeleted: "规则已删除",
            ruleEnabled: "规则已启用",
            ruleDisabled: "规则已禁用",
            settingsSaved: "设置已保存"
        }
    };

    // 获取语言
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const text = i18n[lang];

    // 初始化存储
    function initializeStorage() {
        if (GM_getValue(STORAGE_KEYS.REDIRECT_LIST) === undefined) {
            GM_setValue(STORAGE_KEYS.REDIRECT_LIST, []);
        }

        if (GM_getValue(STORAGE_KEYS.RULES) === undefined) {
            GM_setValue(STORAGE_KEYS.RULES, [
                { id: 1, name: "Brave", keyword: "br", url: "https://search.brave.com/search?q=%s&source=desktop", enabled: true, isDefault: false },
                { id: 2, name: "DuckDuckGo", keyword: "d", url: "https://duckduckgo.com/?q=%s&t=brave", enabled: true, isDefault: false }
            ]);
        }
    }

    // 主重定向逻辑
    function performRedirect() {
        const redirectList = GM_getValue(STORAGE_KEYS.REDIRECT_LIST, []);
        const rules = GM_getValue(STORAGE_KEYS.RULES, []);
        const currentUrl = window.location.href;
        if (/([&?])redirect=false(?!\w)/.test(currentUrl)) return;
        let matchedEngine = null;
        for (const engineName of redirectList) {
            const engine = SEARCH_ENGINES[engineName];
            if (engine && currentUrl.startsWith(engine.prefix)) {
                matchedEngine = engine;
                break;
            }
        }

        if (!matchedEngine) return;

        // 提取搜索关键词
        const urlObj = new URL(currentUrl);
        let query = urlObj.searchParams.get(matchedEngine.param);
        if (!query) return;

        // 分割关键词
        const words = query.trim().split(/\s+/);
        const firstWord = words[0];
        let remainingQuery = words.slice(1).join(' ');

        // 查找匹配规则
        let matchedRule = null;
        let defaultRule = null;
        for (const rule of rules) {
            if (!rule.enabled) continue;

            if (rule.keyword === firstWord) {
                matchedRule = rule;
                break;
            }

            if (rule.isDefault) {
                defaultRule = rule;
            }
        }

        // 使用默认规则（如果存在）
        if (!matchedRule && defaultRule) {
            matchedRule = defaultRule;
            remainingQuery = query; // 使用完整查询
        }

        if (matchedRule) {
            let targetUrl = matchedRule.url.replace('%s', encodeURIComponent(remainingQuery));
            if (targetUrl.includes('?')) {
                targetUrl += '&redirect=false';
            } else {
                targetUrl += '?redirect=false';
            }
            window.location.replace(targetUrl);
        }
    }

    // 创建设置UI
    function createSettingsUI() {
        const style = `
            .redirector-settings {
                font-family: system-ui, -apple-system, sans-serif;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                overflow-y: auto;
                padding: 20px;
                box-sizing: border-box;
            }

            .settings-container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                width: 100%;
                max-width: 900px;
                max-height: 90vh;
                overflow-y: auto;
            }

            .settings-header {
                padding: 20px;
                border-bottom: 1px solid #eaeaea;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .settings-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #333;
                margin: 0;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 5px;
            }

            .settings-body {
                padding: 20px;
            }

            .section {
                margin-bottom: 30px;
            }

            .section-title {
                font-size: 1.2rem;
                margin: 0 0 15px 0;
                color: #444;
                font-weight: 600;
            }

            .engines-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 12px;
                margin-bottom: 20px;
            }

            .engine-item {
                display: flex;
                align-items: center;
            }

            .engine-item input {
                margin-right: 8px;
            }

            .rules-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .rules-table {
                width: 100%;
                border-collapse: collapse;
            }

            .rules-table th {
                background: #f8f9fa;
                text-align: left;
                padding: 12px 15px;
                font-weight: 600;
                color: #495057;
                border-bottom: 1px solid #dee2e6;
            }

            .rules-table td {
                padding: 12px 15px;
                border-bottom: 1px solid #eaeaea;
            }

            .rules-table tr:nth-child(even) {
                background-color: #f9f9f9;
            }

            .rules-table tr:hover {
                background-color: #f0f7ff;
            }

            .action-btn {
                background: none;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                padding: 5px 10px;
                margin: 0 3px;
                cursor: pointer;
                font-size: 0.85rem;
                transition: all 0.2s;
            }

            .action-btn:hover {
                background: #f0f7ff;
                border-color: #3b82f6;
                color: #3b82f6;
            }

            .add-btn {
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                cursor: pointer;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 10px;
                transition: background 0.2s;
            }

            .add-btn:hover {
                background: #2563eb;
            }

            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }

            .modal-content {
                background: white;
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
                padding: 25px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .modal-title {
                font-size: 1.3rem;
                font-weight: 600;
                margin: 0;
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #444;
            }

            .form-input {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 1rem;
                box-sizing: border-box;
            }

            .form-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
            }

            .error-message {
                color: #e53e3e;
                font-size: 0.85rem;
                margin-top: 5px;
                display: none;
            }

            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
            }

            .btn {
                padding: 10px 20px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-primary {
                background: #3b82f6;
                color: white;
                border: none;
            }

            .btn-primary:hover {
                background: #2563eb;
            }

            .btn-secondary {
                background: #f3f4f6;
                color: #4b5563;
                border: 1px solid #d1d5db;
            }

            .btn-secondary:hover {
                background: #e5e7eb;
            }

            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10001;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s;
            }

            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;

        GM_addStyle(style);

        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'redirector-settings';
        settingsContainer.innerHTML = `
            <div class="settings-container">
                <div class="settings-header">
                    <h2 class="settings-title">${text.title}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="settings-body">
                    <div class="section">
                        <h3 class="section-title">${text.redirectLabel}</h3>
                        <div class="engines-grid" id="engines-grid"></div>
                    </div>

                    <div class="rules-container">
                        <div class="section">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h3 class="section-title">${text.enabledRules}</h3>
                                <button class="add-btn" id="add-enabled-btn">+ ${text.addButton}</button>
                            </div>
                            <table class="rules-table" id="enabled-table">
                                <thead>
                                    <tr>
                                        <th>${text.name}</th>
                                        <th>${text.keyword}</th>
                                        <th>${text.urlFormat}</th>
                                        <th>${text.actions}</th>
                                    </tr>
                                </thead>
                                <tbody id="enabled-rules-body"></tbody>
                            </table>
                        </div>

                        <div class="section">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h3 class="section-title">${text.disabledRules}</h3>
                                <button class="add-btn" id="add-disabled-btn">+ ${text.addButton}</button>
                            </div>
                            <table class="rules-table" id="disabled-table">
                                <thead>
                                    <tr>
                                        <th>${text.name}</th>
                                        <th>${text.keyword}</th>
                                        <th>${text.urlFormat}</th>
                                        <th>${text.actions}</th>
                                    </tr>
                                </thead>
                                <tbody id="disabled-rules-body"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(settingsContainer);

        // 关闭按钮
        settingsContainer.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(settingsContainer);
        });

        // 渲染设置
        renderSettings();

        // 添加规则按钮
        document.getElementById('add-enabled-btn').addEventListener('click', () => {
            showAddRuleModal(true);
        });

        document.getElementById('add-disabled-btn').addEventListener('click', () => {
            showAddRuleModal(false);
        });
    }

    // 渲染设置
    function renderSettings() {
        const redirectList = GM_getValue(STORAGE_KEYS.REDIRECT_LIST, []);
        const rules = GM_getValue(STORAGE_KEYS.RULES, []);

        // 渲染搜索引擎选择
        const enginesGrid = document.getElementById('engines-grid');
        enginesGrid.innerHTML = '';

        Object.keys(SEARCH_ENGINES).forEach(engine => {
            const isChecked = redirectList.includes(engine);
            const engineItem = document.createElement('label');
            engineItem.className = 'engine-item';
            engineItem.innerHTML = `
                <input type="checkbox" value="${engine}" ${isChecked ? 'checked' : ''}>
                ${engine}
            `;
            enginesGrid.appendChild(engineItem);
        });

        // 为复选框添加事件
        enginesGrid.querySelectorAll('input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const newRedirectList = [...enginesGrid.querySelectorAll('input:checked')].map(cb => cb.value);
                GM_setValue(STORAGE_KEYS.REDIRECT_LIST, newRedirectList);
            });
        });

        // 渲染规则表
        renderRulesTable('enabled-rules-body', rules.filter(r => r.enabled));
        renderRulesTable('disabled-rules-body', rules.filter(r => !r.enabled));
    }

    // 渲染规则表
    function renderRulesTable(tableId, rules) {
        const tableBody = document.getElementById(tableId);
        tableBody.innerHTML = '';

        if (rules.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align: center; padding: 20px; color: #777;">${lang === 'zh' ? '没有规则' : 'No rules'}</td>`;
            tableBody.appendChild(row);
            return;
        }
        rules.forEach(rule => {
            const isDefault = rule.isDefault;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rule.name} ${isDefault ? '<span style="color:#3b82f6;font-size:0.8em;">(默认)</span>' : ''}</td>
                <td>${rule.keyword}</td>
                <td style="max-width: 300px; word-break: break-all;">${rule.url}</td>
                <td>
                    ${rule.enabled ?
                        `<button class="action-btn set-default-btn" data-id="${rule.id}">${text.setDefault}</button>
                         <button class="action-btn disable-btn" data-id="${rule.id}" ${isDefault ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>${text.disable}</button>` :
                        `<button class="action-btn enable-btn" data-id="${rule.id}">${text.enable}</button>`
                    }
                    <button class="action-btn delete-btn" data-id="${rule.id}" ${isDefault ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>${text.delete}</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        // 事件处理
        tableBody.querySelectorAll('.set-default-btn').forEach(btn => {
            btn.addEventListener('click', () => setDefaultRule(btn.dataset.id));
        });

        tableBody.querySelectorAll('.disable-btn').forEach(btn => {
            if (btn.hasAttribute('disabled')) return;
            btn.addEventListener('click', () => toggleRule(btn.dataset.id, false));
        });

        tableBody.querySelectorAll('.enable-btn').forEach(btn => {
            btn.addEventListener('click', () => toggleRule(btn.dataset.id, true));
        });

        tableBody.querySelectorAll('.delete-btn').forEach(btn => {
            if (btn.hasAttribute('disabled')) return;
            btn.addEventListener('click', () => deleteRule(btn.dataset.id));
        });
    }

    // 设置默认规则
    function setDefaultRule(ruleId) {
        const rules = GM_getValue(STORAGE_KEYS.RULES, []);
        const updatedRules = rules.map(rule => ({
            ...rule,
            isDefault: rule.id.toString() === ruleId
        }));

        GM_setValue(STORAGE_KEYS.RULES, updatedRules);
        renderSettings();
        showToast(text.defaultSet);
    }

    // 切换规则状态
    function toggleRule(ruleId, enabled) {
        const rules = GM_getValue(STORAGE_KEYS.RULES, []);
        const updatedRules = rules.map(rule =>
            rule.id.toString() === ruleId ? {...rule, enabled} : rule
        );

        GM_setValue(STORAGE_KEYS.RULES, updatedRules);
        renderSettings();
        showToast(enabled ? text.ruleEnabled : text.ruleDisabled);
    }

    // 删除规则
    function deleteRule(ruleId) {
        const rules = GM_getValue(STORAGE_KEYS.RULES, []);
        const updatedRules = rules.filter(rule => rule.id.toString() !== ruleId);

        GM_setValue(STORAGE_KEYS.RULES, updatedRules);
        renderSettings();
        showToast(text.ruleDeleted);
    }

    // 显示添加规则模态框
    function showAddRuleModal(enabled) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${text.addRule}</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="form-group">
                    <label class="form-label">${text.ruleName} <span style="color:red">*</span></label>
                    <input type="text" class="form-input" id="rule-name">
                    <div class="error-message" id="name-error">${text.required}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">${text.ruleKeyword} <span style="color:red">*</span></label>
                    <input type="text" class="form-input" id="rule-keyword">
                    <div class="error-message" id="keyword-error">${text.required}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">${text.ruleUrl} <span style="color:red">*</span></label>
                    <input type="text" class="form-input" id="rule-url" placeholder="https://example.com/search?q=%s">
                    <div class="error-message" id="url-error">${text.invalidUrl.replace('%s', '%s')}</div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancel-btn">${text.cancel}</button>
                    <button class="btn btn-primary" id="save-btn">${text.save}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 关闭按钮
        modal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // 取消按钮
        modal.querySelector('#cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // 保存按钮
        modal.querySelector('#save-btn').addEventListener('click', () => {
            const name = modal.querySelector('#rule-name').value.trim();
            const keyword = modal.querySelector('#rule-keyword').value.trim();
            const url = modal.querySelector('#rule-url').value.trim();

            // 验证输入
            let valid = true;

            if (!name) {
                modal.querySelector('#name-error').style.display = 'block';
                valid = false;
            } else {
                modal.querySelector('#name-error').style.display = 'none';
            }

            if (!keyword) {
                modal.querySelector('#keyword-error').style.display = 'block';
                valid = false;
            } else {
                modal.querySelector('#keyword-error').style.display = 'none';
            }

            if (!url || !url.includes('%s')) {
                modal.querySelector('#url-error').style.display = 'block';
                valid = false;
            } else {
                modal.querySelector('#url-error').style.display = 'none';
            }

            if (!valid) return;

            // 保存规则
            const rules = GM_getValue(STORAGE_KEYS.RULES, []);
            const newId = rules.length > 0 ? Math.max(...rules.map(r => r.id)) + 1 : 1;

            rules.push({
                id: newId,
                name,
                keyword,
                url,
                enabled,
                isDefault: false
            });

            GM_setValue(STORAGE_KEYS.RULES, rules);
            document.body.removeChild(modal);
            renderSettings();
            showToast(text.ruleAdded);
        });
    }

    // 显示提示消息
    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 初始化
    initializeStorage();

    // 注册菜单命令
    GM_registerMenuCommand(text.title, createSettingsUI);

    // 执行重定向
    performRedirect();
})();
