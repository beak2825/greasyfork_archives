// ==UserScript==
// @name              URLCleaner - Link Purifier & Tracker Remover
// @name:zh-CN        链接净化 (URLCleaner) - 移除跟踪参数，直达目标页
// @name:zh-TW        鏈接淨化 (URLCleaner) - 移除跟蹤參數，直達目標頁
// @name:de           URLCleaner - Sicher & Schnell: Links bereinigen, Tracker entfernen
// @name:es           URLCleaner - Purificador de Enlaces y Eliminador de Rastreadores
// @name:fr           URLCleaner - Purificateur de Liens & Suppresseur de Traqueurs
// @name:ja           URLCleaner - リンク浄化 & トラッカー削除
// @name:ko           URLCleaner - 링크 정화 & 추적기 제거
// @name:ru           URLCleaner - Очиститель ссылок и удаление трекеров
// @name:pt           URLCleaner - Purificador de Links & Removedor de Rastreadores
// @namespace         You Boy
// @version           1.4.5
// @description       Automatically removes tracking parameters (e.g., fbclid, utm_source) from URLs and skips intermediate redirect pages. For a faster, safer, and cleaner browsing experience. Take back control of your links!
// @description:zh-CN 自动移除网址中的跟踪参数(如 spm_id_from, utm_source)，并智能跳过中转页面。让你的每一次点击都更快、更安全。告别冗长网址，回归纯净浏览。
// @description:zh-TW 自動移除網址中的跟蹤參數(如 spm_id_from, utm_source)，並智能跳過中轉頁面。讓你的每一次點擊都更快、更安全。告別冗長網址，回歸純淨瀏覽。
// @description:de    Bereinigt automatisch URLs von Tracking-Parametern (z.B. gclid, utm_source) und überspringt Zwischenseiten. Für schnelleres, sichereres und privates Surfen. Holen Sie sich die Kontrolle über Ihre Links zurück!
// @description:es    Elimina automáticamente los parámetros de seguimiento (p. ej., fbclid, utm_source) de las URL y omite las páginas de redirección intermedias. Para una navegación más rápida, segura y limpia.
// @description:fr    Supprime automatiquement les paramètres de suivi (par ex. fbclid, utm_source) des URL et contourne les pages de redirection intermédiaires. Pour une navigation plus rapide, plus sûre et plus propre.
// @description:ja    リンクの追跡パラメータ(例: utm_campaign, igshid)を自動で削除し、不要なリダイレクトページをスキップします。より速く、より安全なブラウジング体験を実現。長くて汚いURLから解放され、ストレスフリーなネットサーフィンを！
// @description:ko    URL에서 추적 매개변수(예: fbclid, utm_source)를 자동으로 제거하고 중간 리디렉션 페이지를 건너뜁니다. 더 빠르고, 안전하며, 깨끗한 브라우징 경험을 위해.
// @description:ru    Автоматически удаляет параметры отслеживания (например, fbclid, utm_source) из URL-адресов и пропускает промежуточные страницы перенаправления. Для более быстрого, безопасного и чистого просмотра веб-страниц.
// @description:pt    Remove automaticamente parâmetros de rastreamento (ex: fbclid, utm_source) dos URLs e pula páginas de redirecionamento intermediárias. Para uma navegação mais rápida, segura e limpa.
// @author            You Boy
// @match             *://*/*
// @exclude           *://localhost*
// @exclude           *://127.0.0.1*
// @exclude           *://192.168.*
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_addValueChangeListener
// @grant             unsafeWindow
// @run-at            document-start
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/542922/URLCleaner%20-%20Link%20Purifier%20%20Tracker%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/542922/URLCleaner%20-%20Link%20Purifier%20%20Tracker%20Remover.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const IS_DEBUG = false;

  if (window.self !== window.top) {
    if (IS_DEBUG) {
      console.log(
        "%cURLCleaner%c[Sandbox]%c Skipped in iframe: %s",
        "background:#00a1d6;color:white;border-radius:3px;padding:2px 6px;",
        "background:#7f8c8d;color:white;border-radius:3px;padding:1px 4px;font-size:0.8em;margin-left:4px;",
        "color:grey;",
        window.location.href
      );
    }
    return;
  }

  const I18nManager = {
    DEFAULT_LANG: "en",

    locales: {
      "zh-CN": {
        menu: {
          settings: "设置",
        },
        ui: {
          titles: {
            generalList: "通用参数列表",
            addRule: "新增净化规则",
            editRule: "编辑净化规则",
            configText: "配置文本",
          },
          tabs: {
            general: "通用规则",
          },
          buttons: {
            add: "添加",
            save: "保存",
            saveRule: "保存规则",
            cancel: "取消",
            delete: "删除此规则",
            reset: "重置为默认",
            addRule: "新增规则",
            configText: "配置文本",
            confirm: "确认?",
            confirmReset: "确认重置?",
            confirmDelete: "确认删除?",
          },
          labels: {
            ruleName: "规则名称",
            matchAddress: "匹配地址 (每行一个)",
            matchAddressShort: "匹配地址",
            transformKeys: "跳转参数 (可选, 每行一个)",
            applyGeneral: "应用通用规则",
            enableRule: "启用规则",
            compatibilityMode: "兼容模式",
          },
          placeholders: {
            ruleName: "规则名称",
            matchAddress:
              "www.example.com\n*example.com\nhttps://www.youtube.com/watch*",
            transformKeys: "例如: target\nurl\nto",
            addParam:
              "输入参数，可英文逗号分隔批量添加，或输入一个链接自动提取",
            search: "搜索规则",
          },
          hints: {
            matchAddress: `<b class="ulc-hint-title">常用示例:</b><div class="ulc-hint-line"><code>www.example.com</code><span>仅匹配指定子域名 (推荐)</span></div><div class="ulc-hint-line"><code>*example.com</code><span>匹配主域名及其所有子域名</span></div><b class="ulc-hint-title">进阶示例:</b><div class="ulc-hint-line"><code>https://www.youtube.com/watch*</code><span>匹配特定开头的路径</span></div><div class="ulc-hint-line"><code>re:[^/]+\\.example\\.com/path/</code><span>使用正则表达式</span></div>`,
            transform:
              "部分网站跳转外链的时候会跳转到一个确认网页，配置参数会把对应参数内的外链直接转换为可点击链接。",
            compatibilityMode:
              "默认情况可能会导致某些网站功能异常，启用此功能可能有助于解决某些网站的点击兼容性问题。",
          },
          misc: {
            noParams: "未添加参数",
            transformTitle: "跳转参数",
          },
        },
        toasts: {
          paramsAdded: "成功添加 {count} 个新参数",
          paramsExist: "未添加新参数，因为它们已存在",
          allEmpty: "规则名称和匹配地址不能为空。",
          nameReserved: "错误：“general”是保留名称，请使用其他名称。",
          nameExists: "错误：已存在同名规则，请使用其他名称。",
          ruleSaved: "规则 “{ruleName}” 已保存",
          ruleDeleted: "已删除",
          configSaved: "配置已成功保存",
          configReset: "通用参数已重置为默认",
          jsonInvalid:
            "JSON 格式无效。请检查是否存在多余的逗号、缺失的括号等语法错误。\n技术错误: {error}",
          configInvalid: "配置内容验证失败：\n{error}",
          configNotAnObject: "配置文本必须是一个JSON对象。",
          configMissingRules: '配置对象必须包含一个名为 "rules" 的数组。',
          configInvalidContent:
            "配置中包含无法复制的内容，导入失败。\n错误: {error}",
        },
        prompts: {
          deleteRule: "确定要删除规则 “{ruleName}” 吗？此操作不可撤销。",
          resetGeneral: "确定要将通用参数重置为默认值吗？此操作不可撤销。",
        },
      },
      en: {
        menu: {
          settings: "Settings",
        },
        ui: {
          titles: {
            generalList: "General Parameters List",
            addRule: "Add New Rule",
            editRule: "Edit Rule",
            configText: "Configuration Text",
          },
          tabs: {
            general: "General Rules",
          },
          buttons: {
            add: "Add",
            save: "Save",
            saveRule: "Save Rule",
            cancel: "Cancel",
            delete: "Delete This Rule",
            reset: "Reset to Default",
            addRule: "New Rule",
            configText: "Config Text",
            confirm: "Confirm?",
            confirmReset: "Confirm Reset?",
            confirmDelete: "Confirm Delete?",
          },
          labels: {
            ruleName: "Rule Name",
            matchAddress: "Match URLs (one per line)",
            matchAddressShort: "Match URLs",
            transformKeys: "Redirect Keys (optional, one per line)",
            applyGeneral: "Apply general rules",
            enableRule: "Enable Rule",
            compatibilityMode: "Compatibility Mode",
          },
          placeholders: {
            ruleName: "Rule Name",
            matchAddress:
              "www.example.com\n*example.com\nhttps://www.youtube.com/watch*",
            transformKeys: "e.g., target\nurl\nto",
            addParam: "Enter parameter(s), or paste a URL to extract from",
            search: "Search rules",
          },
          hints: {
            matchAddress: `<b class="ulc-hint-title">Common Examples:</b><div class="ulc-hint-line"><code>www.example.com</code><span>Matches specific subdomain (recommended)</span></div><div class="ulc-hint-line"><code>*example.com</code><span>Matches main domain and all subdomains</span></div><b class="ulc-hint-title">Advanced Examples:</b><div class="ulc-hint-line"><code>https://www.youtube.com/watch*</code><span>Matches a specific path prefix</span></div><div class="ulc-hint-line"><code>re:[^/]+\\.example\\.com/path/</code><span>Use a regular expression</span></div>`,
            transform:
              "For redirect pages that encode the destination URL in a parameter. This will convert the link directly to the destination.",
            compatibilityMode:
              "The default setting may cause issues on some websites. Enabling this mode can help resolve click compatibility problems.",
          },
          misc: {
            noParams: "No parameters added",
            transformTitle: "Redirect Keys",
          },
        },
        toasts: {
          paramsAdded: "Successfully added {count} new parameter(s)",
          paramsExist: "No new parameters were added as they already exist.",
          allEmpty: "Rule Name and Match URLs cannot be empty.",
          nameReserved:
            'Error: "general" is a reserved name. Please use another name.',
          nameExists:
            "Error: A rule with the same name already exists. Please use another name.",
          ruleSaved: 'Rule "{ruleName}" has been saved',
          ruleDeleted: "Deleted",
          configSaved: "Configuration saved successfully",
          configReset: "General parameters have been reset to default",
          jsonInvalid:
            "Invalid JSON format. Please check for syntax errors like trailing commas or missing brackets.\nTechnical error: {error}",
          configInvalid: "Configuration content validation failed:\n{error}",
          configNotAnObject: "Configuration must be a JSON object.",
          configMissingRules:
            'Configuration object must provide a "rules" array.',
          configInvalidContent:
            "Configuration contains non-cloneable content and could not be imported.\nError: {error}",
        },
        prompts: {
          deleteRule:
            'Are you sure you want to delete the rule "{ruleName}"? This action cannot be undone.',
          resetGeneral:
            "Are you sure you want to reset general parameters to default? This action cannot be undone.",
        },
      },
    },

    detectLanguage() {
      const lang = navigator.language;
      if (this.locales[lang]) {
        return lang;
      }
      const baseLang = lang.split("-")[0];
      const matchedLang = Object.keys(this.locales).find((l) =>
        l.startsWith(baseLang)
      );
      return matchedLang || this.DEFAULT_LANG;
    },

    getActiveLocale() {
      const langKey = this.detectLanguage();
      return this.locales[langKey];
    },

    getDefaultLocale() {
      return this.locales[this.DEFAULT_LANG];
    },
  };

  // --- 沙箱环境 ---
  const Sandbox = {
    DEFAULT_CONFIG: {
      general: {
        params: [
          "_ga",
          "_hsenc",
          "_hsmi",
          "_ke",
          "dclid",
          "fbclid",
          "gclid",
          "igshid",
          "mc_cid",
          "mc_eid",
          "spm_id_from",
          "utm_campaign",
          "utm_content",
          "utm_medium",
          "utm_source",
          "utm_term",
        ],
      },
      rules: [],
    },

    config: null,

    loadConfig() {
      const configFromStorage = GM_getValue("ulcConfig");
      this.config = configFromStorage || structuredClone(this.DEFAULT_CONFIG);
    },

    init(locale) {
      window.addEventListener("ulc-save-config", (event) => {
        GM_setValue("ulcConfig", event.detail);
      });

      GM_registerMenuCommand(locale.menu.settings, () => {
        window.dispatchEvent(new CustomEvent("ulc-open-settings"));
      });

      GM_addValueChangeListener(
        "ulcConfig",
        (name, old_value, new_value, remote) => {
          if (remote) {
            this.config = new_value;

            // 通知更新
            window.dispatchEvent(
              new CustomEvent("ulc-config-updated", {
                detail: new_value,
              })
            );
          }
        }
      );
    },
  };

  const StyleInjector = {
    inject(PANEL_ID) {
      const containerID = `#${PANEL_ID}`;
      GM_addStyle(`
        ${containerID} {
          --ulc-bg-primary: #fff;
          --ulc-bg-secondary: #f9f9f9;
          --ulc-bg-input: #fff;
          --ulc-bg-param: #eef0f2;
          --ulc-bg-param-transform: #fceeee;
          --ulc-bg-code: #e9e9e9;
          --ulc-bg-code-hint: #f5f5f5;
          --ulc-bg-tab-hover: #f5f5f5;
          --ulc-bg-add-rule-btn: #fafafa;
          --ulc-bg-add-rule-btn-hover: #f0f0f0;
          --ulc-bg-secondary-btn: #fff;
          --ulc-bg-secondary-btn-hover: #e0e0e0;
          --ulc-bg-danger-btn-hover: #ff4d4d;
          --ulc-bg-confirm-tooltip: #333;
          --ulc-bg-mobile-add-btn: #fff;
          --ulc-text-primary: #333;
          --ulc-text-secondary: #666;
          --ulc-text-tertiary: #999;
          --ulc-text-placeholder: #888;
          --ulc-text-param: #333;
          --ulc-text-param-transform: #333;
          --ulc-text-code: #c7254e;
          --ulc-text-add-rule-btn: #333;
          --ulc-text-close-btn: #999;
          --ulc-text-close-btn-hover: #333;
          --ulc-text-delete-icon: #999;
          --ulc-text-delete-icon-hover: #ff4d4d;
          --ulc-text-secondary-btn: #767676;
          --ulc-text-danger: #ff4d4d;
          --ulc-text-danger-btn-hover: white;
          --ulc-border-primary: #eee;
          --ulc-border-secondary: #e3e3e3;
          --ulc-border-input: #ccc;
          --ulc-border-checkbox: #ccc;
          --ulc-border-danger-btn: #ff4d4d;
          --ulc-border-mobile-add-btn: #ddd;
          --ulc-accent-primary: #00a1d6;
          --ulc-accent-hover: #00b5e5;
          --ulc-accent-static: #00a1d6;
          --ulc-scrollbar-bg: #f0f2f5;
          --ulc-scrollbar-thumb-bg: #c1c1c1;
          --ulc-scrollbar-thumb-hover-bg: #a8a8a8;
          --ulc-bg-param-new: #adfdc1;
          --ulc-text-param-new: #555;
        }
        ${containerID}.theme-dark {
          --ulc-bg-primary: #2c2c2c;
          --ulc-bg-secondary: #3a3a3a;
          --ulc-bg-input: #252525;
          --ulc-bg-param: #444;
          --ulc-bg-param-transform: #6c3838;
          --ulc-bg-code: #444;
          --ulc-bg-code-hint: #444;
          --ulc-bg-tab-hover: #383838;
          --ulc-bg-add-rule-btn: #333;
          --ulc-bg-add-rule-btn-hover: #404040;
          --ulc-bg-secondary-btn: #4f4f4f;
          --ulc-bg-secondary-btn-hover: #5a5a5a;
          --ulc-bg-danger-btn-hover: #e53935;
          --ulc-text-primary: #dcdcdc;
          --ulc-text-secondary: #bbb;
          --ulc-text-tertiary: #aaa;
          --ulc-text-placeholder: #888;
          --ulc-text-param: #eee;
          --ulc-text-param-transform: #e0c7c7;
          --ulc-text-code: #ff8a65;
          --ulc-text-add-rule-btn: #bbb;
          --ulc-text-close-btn: #aaa;
          --ulc-text-close-btn-hover: #fff;
          --ulc-text-delete-icon: #aaa;
          --ulc-text-delete-icon-hover: #e53935;
          --ulc-text-secondary-btn: #dcdcdc;
          --ulc-text-danger: #e53935;
          --ulc-text-danger-btn-hover: #fff;
          --ulc-border-primary: #4a4a4a;
          --ulc-border-secondary: #666;
          --ulc-border-input: #555;
          --ulc-border-checkbox: #888;
          --ulc-border-danger-btn: #e53935;
          --ulc-border-mobile-add-btn: #555;
          --ulc-accent-primary: #008fbf;
          --ulc-accent-hover: #00a1d6;
          --ulc-accent-static: #00a1d6;
          --ulc-scrollbar-bg: #2c2c2c;
          --ulc-scrollbar-thumb-bg: #555;
          --ulc-scrollbar-thumb-hover-bg: #777;
          --ulc-bg-param-new: #3a4c58;
          --ulc-text-param-new: var(--ulc-text-primary);
        }
        ${containerID} { all: initial; display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2147483647; width: 90vw; min-width: 600px; max-width: 800px; height: 500px; max-height: 80vh; background: var(--ulc-bg-primary); border-radius: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.2); display: flex; flex-direction: row; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: var(--ulc-text-primary); font-size: 14px; }
        ${containerID}.theme-dark { border: 1px solid var(--ulc-border-primary); }
        ${containerID} *, ${containerID} *::before, ${containerID} *::after { box-sizing: border-box; margin: 0; padding: 0; border: 0; font: inherit; vertical-align: baseline; background: transparent; color: inherit; text-align: left; line-height: 1.5; }
        ${containerID} div, ${containerID} span, ${containerID} ul, ${containerID} li, ${containerID} label { all: unset; box-sizing: border-box; }
        ${containerID} h3 { all: unset; box-sizing: border-box; display: block; font-size: 16px; font-weight: 600; }
        ${containerID} button { all: unset; box-sizing: border-box; display: inline-block; text-align: center; cursor: pointer; border-radius: 4px; padding: 8px 15px; font-size: 14px; transition: background-color 0.2s, color 0.2s; line-height: 1; white-space: nowrap; }
        ${containerID} input, ${containerID} textarea { all: unset; box-sizing: border-box; display: block; width: 100%; border: 1px solid var(--ulc-border-input); border-radius: 4px; padding: 10px; font-size: 14px; margin-bottom: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: var(--ulc-bg-input); line-height: 1.4; color: var(--ulc-text-primary); }
        ${containerID} input::placeholder, ${containerID} textarea::placeholder { color: var(--ulc-text-placeholder); }
        ${containerID} textarea { min-height: 80px; resize: vertical; }
        ${containerID} textarea::placeholder { white-space: pre-wrap; word-wrap: break-word; }
        ${containerID} code { width: initial; height: initial; display: initial; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; }
        ${containerID} button.ulc-btn-primary { background-color: var(--ulc-accent-primary); color: #fff; padding-block: 12px; }
        ${containerID} button.ulc-btn-secondary { background-color: var(--ulc-bg-secondary-btn); color: var(--ulc-text-secondary-btn); border: 1px solid var(--ulc-border-secondary); }
        ${containerID} button.ulc-btn-danger { border: 1px solid var(--ulc-border-danger-btn); color: var(--ulc-text-danger); }
        ${containerID} .ulc-sidebar { display:flex; width: 180px; border-right: 1px solid var(--ulc-border-primary); flex-shrink: 0; flex-direction: column; }
        ${containerID} .ulc-search-container { padding: 10px 15px 0; }
        ${containerID} .ulc-search-container input[type="search"] { all: unset; box-sizing: border-box; width: 100%; border: 1px solid var(--ulc-border-input); border-radius: 4px; padding: 6px 10px; font-size: 13px; background-color: var(--ulc-bg-input); }
        ${containerID} .ulc-tabs { display: block; list-style: none; padding: 13px 0 10px; flex-grow: 1; overflow-y: auto; }
        ${containerID} .ulc-tab { position: relative; display: flex; align-items: center; height: 40px; padding: 0 18px; cursor: pointer; contain: strict; content-visibility: auto; contain-intrinsic-size: auto 40px; min-width: 0; }
        ${containerID} .ulc-tab::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 50%; background-color: transparent; transition: background-color 0.2s; }
        ${containerID} .ulc-tab.active { font-weight: 600; color: var(--ulc-accent-static); }
        ${containerID} .ulc-tab.active::before { background-color: var(--ulc-accent-static); }
        ${containerID} .ulc-tab > span { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        ${containerID} #ulc-add-rule-btn { display: block; text-align: center; padding: 12px; cursor: pointer; background: var(--ulc-bg-add-rule-btn); border-top: 1px solid var(--ulc-border-primary); color: var(--ulc-text-add-rule-btn); font-size: 14px; flex-shrink: 0; }
        ${containerID} #ulc-add-rule-btn::after { content: attr(data-locale); }
        ${containerID} .ulc-main-content { display:flex; flex-grow: 1; flex-direction: column; overflow: hidden; }
        ${containerID} .ulc-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 15px; min-height: 55px; border-bottom: 1px solid var(--ulc-border-primary); flex-shrink: 0; }
        ${containerID} .ulc-title-container { display: flex; align-items: center; flex-grow: 1; max-width: 80%; }
        ${containerID} .ulc-title-container > h3 { max-width: 80%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        ${containerID} .ulc-edit-icon { display: none; cursor: pointer; margin-left: 8px; width: 16px; height: 16px; vertical-align: middle; }
        ${containerID} .ulc-title-container:hover .ulc-edit-icon { display: inline-block; }
        ${containerID} #ulc-close-btn { font-size: 24px; cursor: pointer; color: var(--ulc-text-close-btn); padding: 5px; line-height: 1; flex-shrink: 0; }
        ${containerID} .ulc-sub-header { display: flex; align-items: flex-start; justify-content: flex-start; padding: 8px 15px; background: var(--ulc-bg-secondary); border-bottom: 1px solid var(--ulc-border-primary); font-size: 12px; color: var(--ulc-text-secondary); flex-shrink: 0; }
        ${containerID} .ulc-sub-header > span { display: inline; flex-shrink: 0; margin-right: 8px; line-height: 22px; }
        ${containerID} .ulc-match-tags { display: flex; flex-wrap: wrap; gap: 6px; max-height: 26px; overflow: hidden; transition: max-height 0.3s ease; flex-grow: 1; }
        ${containerID} .ulc-match-tags:hover { max-height: 200px; }
        ${containerID} .ulc-match-tags code { display: inline; background: var(--ulc-bg-code); color: var(--ulc-text-code); padding: 2px 6px; border-radius: 4px; font-size: 12px; white-space: nowrap; }
        ${containerID} .ulc-add { display: flex; align-items: center; padding: 10px 15px; border-bottom: 1px solid var(--ulc-border-primary); flex-shrink: 0; }
        ${containerID} #ulc-new-param { margin-right: 10px; padding: 8px; margin-bottom: 0; }
        ${containerID} .ulc-list { display: flex; padding: 10px; overflow-y: auto; flex-grow: 1; flex-wrap: wrap; align-content: flex-start; }
        ${containerID} .ulc-list:empty::before { content: attr(data-locale); display: block; width: 100%; text-align: center; color: var(--ulc-text-placeholder); font-size: 14px; padding: 20px; }
        ${containerID} .ulc-list-transform { position: relative; max-height: 100px; }
        ${containerID} .ulc-list-transform::before { content: attr(data-locale); display: inline-block; background: var(--ulc-bg-primary); position: absolute; top: -10px; left: 10px; padding: 0 5px; font-size: 12px; color: var(--ulc-text-tertiary); }
        ${containerID} .ulc-list-transform .ulc-list-transform-content { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; border-top: 1px solid var(--ulc-border-primary); flex-shrink: 0; overflow-y: auto; height: 100%; }
        ${containerID} .ulc-list-transform .ulc-list-transform-content > span { display: inline-block; background: var(--ulc-bg-param-transform); color: var(--ulc-text-param-transform); padding: 3px 6px; border-radius: 3px; margin: 0; font-size: 14px; }
        ${containerID} .ulc-param { display: inline-flex; align-items: center; background: var(--ulc-bg-param); color: var(--ulc-text-param); padding: 5px 10px; border-radius: 6px; margin: 5px; font-size: 14px; }
        ${containerID} .ulc-param span { display: inline; margin-right: 8px; }
        ${containerID} .ulc-delete { color: var(--ulc-text-delete-icon); cursor: pointer; font-weight: bold; font-size: 16px; line-height: 1; padding: 4px 8px; margin: -4px -8px; border-radius: 6px; }
        ${containerID} .ulc-rule-settings-footer { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-top: 1px solid var(--ulc-border-primary); font-size: 13px; color: #555; flex-shrink: 0; }
        ${containerID} .ulc-rule-settings-footer label { display: flex; align-items: center; cursor: pointer; }
        ${containerID} .ulc-rule-settings-footer #ulc-config-text-btn { border-style: dashed; }
        ${containerID} .ulc-form-content { display: block; padding: 8px; flex-grow: 1; overflow-y: auto; }
        ${containerID} .ulc-form-content label { display: block; margin-bottom: 8px; font-weight: 500; margin-top: 3em; }
        ${containerID} .ulc-form-content label:first-child { margin-top: 0; }
        ${containerID} .ulc-form-content p { font-size: 12px; display: block; color: #999; }
        ${containerID} .ulc-form-actions { display: flex; padding: 15px; border-top: 1px solid var(--ulc-border-primary); justify-content: flex-end; gap: 10px; flex-shrink: 0; }
        ${containerID} .ulc-form-hint { display: block; font-size: 12px; color: var(--ulc-text-secondary); margin-top: -5px; margin-bottom: 15px; }
        ${containerID} .ulc-hint-title { display: block; font-weight: bold; margin-top: 8px; }
        ${containerID} .ulc-hint-line { display: flex; align-items: center; margin-top: 4px; }
        ${containerID} .ulc-hint-line code { display: inline-block; flex-shrink: 0; background: var(--ulc-bg-code-hint); color: var(--ulc-text-code); padding: 2px 6px; border-radius: 4px; font-size: 12px; }
        ${containerID} .ulc-hint-line span { display: inline; margin-left: 8px; }
        ${containerID} #ulc-config-textarea { height: 100%; min-height: 100px; resize: vertical; margin-bottom: 0; }
        ${containerID} #ulc-toast { all: initial; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; position: absolute; top: 60px; left: calc( 50% + 90px ); transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.75); color: white; padding: 10px 20px; border-radius: 20px; font-size: 14px; z-index: 10; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; white-space: pre-wrap; line-height: 1.4; display: inline-block; max-width: 560px; pointer-events: none; }
        ${containerID} #ulc-toast.show { opacity: 1; visibility: visible; }
        ${containerID} .ulc-tabs, ${containerID} .ulc-list, ${containerID} .ulc-form-content, ${containerID} .ulc-list-transform .ulc-list-transform-content, ${containerID} textarea { overscroll-behavior: contain; }
        ${containerID} .ulc-confirming-action { background-color: var(--ulc-bg-danger-btn-hover) !important; border-color: var(--ulc-border-danger-btn) !important; color: var(--ulc-text-danger-btn-hover) !important; }
        ${containerID} .ulc-confirming-action:hover { background-color: #e60000 !important; }
        ${containerID}.theme-dark .ulc-confirming-action:hover { background-color: #e60000 !important; }
        ${containerID} .ulc-confirming-action, ${containerID} .ulc-confirmation-activating { position: relative; }
        ${containerID} .ulc-confirming-action::before { content: attr(data-locale); position: absolute; bottom: 100%; right: 0;  margin-bottom: 8px; background: var(--ulc-bg-confirm-tooltip); color: white; padding: 8px 12px; border-radius: 4px; font-size: 13px; z-index: 1; pointer-events: none; max-width: 300px; min-width: 220px; white-space: normal; text-align: left; line-height: 1.4; }
        ${containerID} .ulc-confirming-action::after { content: ''; position: absolute; bottom: 100%; right: 50%; transform: translateX(-50%); margin-bottom: -4px; border: 6px solid transparent; border-top-color: var(--ulc-bg-confirm-tooltip); z-index: 1; pointer-events: none; }
        ${containerID} .ulc-confirmation-activating { cursor: wait; animation: ulc-pulse 0.5s ease-out; }
        ${containerID} .ulc-footer-switches { display: flex; align-items: center; gap: 20px; }
        ${containerID} .ulc-switch-container { display: flex; align-items: center; cursor: pointer; font-size: 13px; color: var(--ulc-text-secondary); }
        ${containerID} .ulc-switch-label { margin-right: 8px; }
        ${containerID} .ulc-switch-container input[type="checkbox"] { all: unset; box-sizing: border-box; appearance: none; -webkit-appearance: none; position: relative; width: 38px; height: 20px; border-radius: 10px; background-color: var(--ulc-border-secondary); transition: background-color 0.2s; flex-shrink: 0; border: none; margin: 0; }
        ${containerID} .ulc-switch-container input[type="checkbox"]::after { all: unset; box-sizing: border-box; content: ''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; border-radius: 50%; background-color: white; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); border-width: 0; transform: none; }
        ${containerID} .ulc-switch-container input[type="checkbox"]:checked { background-color: var(--ulc-accent-static); border-color: transparent; }
        ${containerID} .ulc-switch-container input[type="checkbox"]:checked::after { transform: translateX(18px); }
        @keyframes ulc-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.7); } 50% { transform: scale(1.02); box-shadow: 0 0 0 8px rgba(255, 77, 77, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 77, 0); } }
        ${containerID} .ulc-param-new { background-color: var(--ulc-bg-param-new) !important; color: var(--ulc-text-param-new) !important; }
        ${containerID} .ulc-param-new span::before { content: '✨'; display: inline-block; margin-right: 6px; }
        :is(${containerID} .ulc-tabs, ${containerID} .ulc-list, ${containerID} .ulc-form-content, ${containerID} textarea, ${containerID} .ulc-list-transform .ulc-list-transform-content)::-webkit-scrollbar { width: 10px; height: 10px; }
        :is(${containerID} .ulc-tabs, ${containerID} .ulc-list, ${containerID} .ulc-form-content, ${containerID} textarea, ${containerID} .ulc-list-transform .ulc-list-transform-content)::-webkit-scrollbar-track { background: var(--ulc-scrollbar-bg); }
        :is(${containerID} .ulc-tabs, ${containerID} .ulc-list, ${containerID} .ulc-form-content, ${containerID} textarea, ${containerID} .ulc-list-transform .ulc-list-transform-content)::-webkit-scrollbar-thumb { background-color: var(--ulc-scrollbar-thumb-bg); border-radius: 5px; border: 2px solid var(--ulc-scrollbar-bg); }
        :is(${containerID} .ulc-tabs, ${containerID} .ulc-list, ${containerID} .ulc-form-content, ${containerID} textarea, ${containerID} .ulc-list-transform .ulc-list-transform-content)::-webkit-scrollbar-thumb:hover { background-color: var(--ulc-scrollbar-thumb-hover-bg); }
        @media (max-width: 600px) {
          ${containerID} { width: 100vw; height: 100vh; max-height: 100vh; min-width: 0; border-radius: 0; flex-direction: column; }
          ${containerID} .ulc-sidebar { width: 100%; height: auto; flex-direction: row; flex-wrap: wrap; align-items: center; border-right: 0; border-bottom: 1px solid var(--ulc-border-primary); flex-shrink: 0; padding: 12px 12px 0; gap: 10px; }
          ${containerID} .ulc-search-container { order: 1; flex-grow: 1; padding: 0; }
          ${containerID} .ulc-search-container input[type="search"] { font-size: 15px; padding: 10px 12px; }
          ${containerID} #ulc-add-rule-btn { order: 2; flex-shrink: 0; padding: 0; margin: 0; border: 1px solid var(--ulc-border-mobile-add-btn); font-size: 0; line-height: 1; background: var(--ulc-bg-mobile-add-btn); position: relative; display: flex; justify-content: center; align-items: center; height: 39px; width: 39px; }
          ${containerID} #ulc-add-rule-btn::after { font-size: 20px; content: '+'; }
          ${containerID} .ulc-tabs { order: 3; flex-basis: 100%; height: auto; display: flex; flex-direction: row; overflow-x: auto; white-space: nowrap; padding: 0; margin-top: 10px; border-top: 1px solid var(--ulc-border-primary); scrollbar-width: none; -ms-overflow-style: none; }
          ${containerID} .ulc-tabs::-webkit-scrollbar { display: none; }
          ${containerID} .ulc-tab { display: flex; justify-content: center; align-items: center; width: 100px; height: 40px; padding: 0 15px; border-left: 0; border-bottom: 3px solid transparent; font-size: 15px; flex-shrink: 0; contain: strict; content-visibility: auto; contain-intrinsic-size: 100px 40px; min-width: 0; }
          ${containerID} .ulc-tab::before { display: none; }
          ${containerID} .ulc-tab.active { border-bottom-color: var(--ulc-accent-static); color: var(--ulc-accent-static); background-color: transparent; }
          ${containerID} .ulc-param { padding: 8px 12px; font-size: 15px; }
          ${containerID} .ulc-delete { padding: 8px; }
          ${containerID} .ulc-edit-icon { display:inline-block; }
          ${containerID} #ulc-toast { left: 50%; }
        }
        @media (hover: hover) {
            ${containerID} button.ulc-btn-primary:hover { background-color: var(--ulc-accent-hover); }
            ${containerID} button.ulc-btn-secondary:hover { background-color: var(--ulc-bg-secondary-btn-hover); }
            ${containerID} button.ulc-btn-danger:hover { background-color: var(--ulc-bg-danger-btn-hover); color: var(--ulc-text-danger-btn-hover); }
            ${containerID} .ulc-tab:hover { background: var(--ulc-bg-tab-hover); }
            ${containerID} #ulc-add-rule-btn:hover { background: var(--ulc-bg-add-rule-btn-hover); }
            ${containerID} #ulc-close-btn:hover { color: var(--ulc-text-close-btn-hover); }
            ${containerID} .ulc-delete:hover { color: var(--ulc-text-delete-icon-hover); }
        }
      `);
    },
  };

  const CodeInjector = {
    injectedCode: function (injectedConfig) {
      (() => {
        const {
          IS_DEBUG,
          PANEL_ID,
          locale,
          defaultLocale,
          sandboxConfig,
          isFallbackMode = false,
          sandboxUnsafeWindow,
        } = injectedConfig;
        window.dispatchEvent(new CustomEvent("ulc-injection-success"));

        const GENERAL_TAB_ID = "general";

        const Logger = {
          _styles: {
            brand:
              "background: #00a1d6; color: white; border-radius: 3px; padding: 2px 6px;",
            tagBase:
              "color: white; border-radius: 3px; padding: 1px 5px; font-size: 0.8em; margin-left: 4px;",
            get INFO() {
              return `background: #3498db; ${this.tagBase}`;
            },
            get WARN() {
              return `background: #f39c12; ${this.tagBase}`;
            },
            get ERROR() {
              return `background: #e74c3c; ${this.tagBase}`;
            },
            get GROUP() {
              return `background: #95a5a6; ${this.tagBase}`;
            },
            title: "font-weight: bold;",
          },

          _createLog(type, isGrouped, ...args) {
            if (!IS_DEBUG) return;

            const brand = "%cURLCleaner";
            const tag = `%c${type.toUpperCase()}`;
            const brandStyle = this._styles.brand;
            const tagStyle = this._styles[type];

            if (!isGrouped) {
              console.log(brand + tag, brandStyle, tagStyle, ...args);
            } else {
              const [title, ...content] = args;
              const titleStyle = `${this._styles.title} color: ${
                tagStyle.match(/background: (#\w+);/)[1] || "inherit"
              };`;

              console.groupCollapsed(
                brand + tag + `%c ${title}`,
                brandStyle,
                tagStyle,
                titleStyle
              );
              if (content.length > 0) {
                const consoleMethod =
                  type === "INFO" ? "log" : type.toLowerCase();
                content.forEach((item) => console[consoleMethod](item));
              }
              console.groupEnd();
            }
          },

          log(...args) {
            this._createLog("INFO", false, ...args);
          },
          warnLine(...args) {
            this._createLog("WARN", false, ...args);
          },
          warn(title, ...content) {
            this._createLog("WARN", true, title, ...content);
          },
          error(title, ...content) {
            this._createLog("ERROR", true, title, ...content);
          },

          group(title) {
            if (IS_DEBUG) {
              console.groupCollapsed(
                `%cURLCleaner%cGROUP%c ${title}`,
                this._styles.brand,
                this._styles.GROUP,
                this._styles.title
              );
            }
          },
          groupEnd() {
            if (IS_DEBUG) {
              console.groupEnd();
            }
          },
          info(...args) {
            if (IS_DEBUG) {
              console.log(...args);
            }
          },
        };

        if (isFallbackMode) {
          Logger.log("Fallback mode activated due to CSP.");
        } else {
          Logger.log("Script injected and running in standard mode.");
        }

        // --- Utils (工具函数) ---
        const Utils = {
          // 翻译函数
          t(key, replacements = {}) {
            const path = key.split(".");

            const findValueByPath = (obj, pathArray) => {
              let current = obj;
              for (const p of pathArray) {
                current = current?.[p];
                if (current === undefined) return undefined;
              }
              return current;
            };

            let result = findValueByPath(locale, path);

            if (result === undefined) {
              result = findValueByPath(defaultLocale, path);

              if (result === undefined) {
                Logger.warnLine(
                  `[i18n] Missing translation for key in ALL locales: ${key}`
                );
                return `[${key}]`;
              }
            }

            if (typeof result !== "string") {
              Logger.warnLine(
                `[i18n] Translation for key "${key}" is not a string, but a(n) "${typeof result}".`
              );
              return `[INVALID_KEY_TYPE: ${key}]`;
            }

            return result.replace(/\{(\w+)\}/g, (match, RKey) => {
              return replacements[RKey] !== undefined
                ? String(replacements[RKey])
                : match;
            });
          },

          escapeHTML(str) {
            if (typeof str !== "string") return "";
            return str.replace(/[&<>"']/g, (match) => {
              switch (match) {
                case "&":
                  return "&amp;";
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case '"':
                  return "&quot;";
                case "'":
                  return "&#039;";
              }
            });
          },

          debounce(func, delay = 250) {
            let timeoutId;
            return function (...args) {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                func.apply(this, args);
              }, delay);
            };
          },

          // 字符串转为正则表达式对象
          wildcardToRegex(pattern) {
            try {
              if (pattern.startsWith("re:")) {
                return new RegExp(pattern.substring(3));
              }
              let protocol = "*";
              let host = pattern;
              let path = "/*";
              if (host.includes("://")) {
                const parts = host.split("://");
                protocol = parts[0];
                host = parts[1];
              }
              if (host.includes("/")) {
                const hostParts = host.split("/");
                host = hostParts.shift();
                path = "/" + hostParts.join("/");
                if (!path.endsWith("*")) {
                  path += "*";
                }
              }
              const protocolRegex = protocol.replace(/\*/g, "https?");
              const hostRegex = host
                .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                .replace(/\*/g, "[^/]*");
              const pathRegex = path
                .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                .replace(/\*/g, ".*");
              const finalRegexString = `^${protocolRegex}://${hostRegex}${pathRegex}$`;
              return new RegExp(finalRegexString);
            } catch (e) {
              Logger.warn(
                `Invalid regex pattern provided, falling back to non-matching pattern.`,
                { pattern, error: e.message }
              );
              return new RegExp("$.");
            }
          },

          // 严格检查是否是有效的URL
          isValidAbsoluteURL(str) {
            if (typeof str !== "string" || str.trim() === "") return false;
            try {
              const url = new URL(str);
              return ["http:", "https:", "ftp:", "ftps:"].includes(
                url.protocol
              );
            } catch (e) {
              return false;
            }
          },

          // 宽松地尝试解析URL
          tryParseURL(str) {
            if (typeof str !== "string" || str.trim() === "") return null;
            try {
              if (
                str.includes("://") ||
                str.startsWith("/") ||
                str.startsWith("?") ||
                str.startsWith("#")
              ) {
                return new URL(str, window.location.href);
              }
              return null;
            } catch (e) {
              return null;
            }
          },

          // 尝试所有解码方式
          tryAllDecodes(value) {
            if (!value) return null;

            // 解码函数
            const decoders = [
              (val) => atob(val),
              (val) => decodeURIComponent(val),
              (val) => decodeURIComponent(decodeURIComponent(val)),
            ];
            const applyDecoders = (input) => {
              if (Utils.isValidAbsoluteURL(input)) return input;
              for (const decoder of decoders) {
                try {
                  const decoded = decoder(input);
                  if (decoded && Utils.isValidAbsoluteURL(decoded)) {
                    return decoded;
                  }
                } catch (error) {
                  /* Silently ignore decoding errors */
                }
              }
              return null;
            };
            const variants = [
              value, // 原始值
              value.split("").reverse().join(""), // 反转字符串
            ];
            for (const variant of variants) {
              const decoded = applyDecoders(variant);
              if (decoded) return decoded;
            }
            return null;
          },

          // 从奇怪的参数中提取URL
          extractUrlFromWeirdParam(input) {
            try {
              const url = input instanceof URL ? input : new URL(input);
              const [key] = url.searchParams.entries().next().value || [];
              if (
                url.searchParams.size === 1 &&
                key &&
                !url.searchParams.get(key)
              ) {
                const decoded = Utils.tryAllDecodes(key);
                if (decoded) return decoded;
              }
            } catch (_) {
              /* Silently ignore parsing errors */
            }
            return null;
          },

          // 生成规则的唯一ID
          getRuleTabId(ruleOrName) {
            if (
              typeof ruleOrName === "string" &&
              ruleOrName === GENERAL_TAB_ID
            ) {
              return GENERAL_TAB_ID;
            }
            const name =
              typeof ruleOrName === "object" && ruleOrName.name
                ? ruleOrName.name
                : ruleOrName;
            if (
              name === GENERAL_TAB_ID ||
              typeof name !== "string" ||
              name.trim() === ""
            ) {
              return GENERAL_TAB_ID;
            }
            try {
              const encoder = new TextEncoder();
              const data = encoder.encode(name);
              const binaryString = String.fromCodePoint(...data);
              let base64 = btoa(binaryString);
              base64 = base64
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");

              return `rule-${base64}`;
            } catch (e) {
              Logger.error(
                `Failed to generate a safe ID for rule name: ${name}`,
                e
              );
              return `rule-error-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`;
            }
          },

          isValidHttpLink(linkElement) {
            if (!linkElement || linkElement.tagName !== "A") return false;
            const hrefAttr = linkElement.getAttribute("href");
            if (
              !hrefAttr ||
              hrefAttr.trim().startsWith("#") ||
              hrefAttr.trim().startsWith("javascript:")
            )
              return false;
            try {
              const url = new URL(linkElement.href);
              return ["http:", "https:"].includes(url.protocol);
            } catch (error) {
              return false;
            }
          },

          randomString() {
            const length = Math.floor(Math.random() * 7) + 6;
            let result = "";
            while (result.length < length)
              result += Math.random().toString(36).substring(2);
            result = result.substring(0, length);
            if (/^[0-9]/.test(result)) result = "p" + result.substring(1);
            return result;
          },

          // 规范化配置对象
          _normalizeAndValidate(configObject, performValidation = false) {
            if (
              typeof configObject !== "object" ||
              configObject === null ||
              Array.isArray(configObject)
            ) {
              if (IS_DEBUG)
                Logger.warn(
                  "Invalid top-level config format. Expected an object.",
                  { received: configObject }
                );
              const errorResult = { error: "配置顶层必须是一个对象。" };
              const safeConfig = {
                config: { general: { params: [] }, rules: [] },
              };
              return performValidation ? errorResult : safeConfig;
            }

            let newConfig;
            try {
              newConfig = structuredClone(configObject);
            } catch (e) {
              const errorMsg = `配置无法被复制，可能包含无效内容（如函数）。错误: ${e.message}`;
              if (IS_DEBUG) Logger.error(errorMsg, { received: configObject });
              return { error: errorMsg };
            }

            const validationErrors = [];
            const ruleNames = new Set();

            if (
              typeof newConfig.general !== "object" ||
              newConfig.general === null ||
              Array.isArray(newConfig.general)
            ) {
              newConfig.general = { params: [] };
            }
            if (!Array.isArray(newConfig.general.params)) {
              newConfig.general.params = [];
            }

            newConfig.general.params = newConfig.general.params
              .filter((p) => typeof p === "string" && p.trim())
              .map((p) => p.trim());

            if (!Array.isArray(newConfig.rules)) {
              newConfig.rules = [];
            }
            newConfig.rules = newConfig.rules
              .map((rule, index) => {
                if (
                  typeof rule !== "object" ||
                  rule === null ||
                  Array.isArray(rule)
                ) {
                  if (performValidation)
                    validationErrors.push(
                      `规则 #${index + 1} 不是一个有效的对象，已被忽略。`
                    );
                  return null;
                }

                rule.name =
                  typeof rule.name === "string" ? rule.name.trim() : "";
                const rawMatch = Array.isArray(rule.match)
                  ? rule.match
                  : typeof rule.match === "string"
                  ? [rule.match]
                  : [];
                rule.match = rawMatch
                  .filter((m) => typeof m === "string" && m.trim())
                  .map((m) => m.trim());

                rule.params = Array.isArray(rule.params)
                  ? rule.params
                      .filter((p) => typeof p === "string" && p.trim())
                      .map((p) => p.trim())
                  : [];
                rule.transform = Array.isArray(rule.transform)
                  ? rule.transform
                      .filter((t) => typeof t === "string" && t.trim())
                      .map((t) => t.trim())
                  : [];

                rule.enabled = rule.enabled !== false;
                rule.applyGeneral = rule.applyGeneral !== false;
                rule.compatibilityMode = !!rule.compatibilityMode;

                if (performValidation) {
                  if (!rule.name) {
                    validationErrors.push(
                      `规则 #${index + 1} (匿名) 缺少有效的名称。`
                    );
                  } else {
                    const lowerCaseName = rule.name.toLowerCase();
                    if (lowerCaseName === "general") {
                      validationErrors.push(
                        `规则名称 "${rule.name}" 是保留字。`
                      );
                    } else if (ruleNames.has(lowerCaseName)) {
                      validationErrors.push(
                        `配置中存在重复的规则名称: "${rule.name}"`
                      );
                    }
                    ruleNames.add(lowerCaseName);
                  }
                  if (rule.match.length === 0) {
                    validationErrors.push(
                      `规则 "${
                        rule.name || `#${index + 1}`
                      }" 缺少有效的匹配地址。`
                    );
                  }
                }

                return rule;
              })
              .filter(Boolean);

            if (performValidation && validationErrors.length > 0) {
              return { error: validationErrors.join("\n") };
            }

            return { config: newConfig };
          },

          validateAndNormalizeConfig(configObject) {
            return this._normalizeAndValidate(configObject, true);
          },

          normalizeConfig(configObject) {
            return this._normalizeAndValidate(configObject, false).config;
          },

          findLinkInEvent(event) {
            const closestLink = event.target.closest?.("a[href]");
            if (closestLink) {
              return closestLink;
            }

            const path = event.composedPath?.() || [];
            for (let i = 0; i < path.length; i++) {
              const element = path[i];
              if (element?.tagName === "A" && element.href) {
                return element;
              }
            }

            return null;
          },
        };

        // --- State (状态管理) ---
        const State = {
          config: null,
          DEFAULT_CONFIG: null,
          ruleCache: new Map(),
          cleanedAttrName: "",
          invalidAttrName: "",
          ui: {
            activeTab: GENERAL_TAB_ID,
            activeRuleIndex: -1,
            view: "list", // 'list', 'add', 'edit', 'config-text'
            searchQuery: "",
            ACTIVATION_DELAY: 600, // confirmation activation delay
            isDarkMode: false,
            highlightedParams: new Set(),
          },
          dom: {
            settingsPanel: null,
            sidebarContainer: null,
            mainContentContainer: null,
            panelId: PANEL_ID,
          },
          toastTimer: null,

          init(config, defaultConfig) {
            this.config = config;
            this.DEFAULT_CONFIG = defaultConfig;
          },
        };

        // --- Core (核心净化与转换逻辑) ---
        const Core = {
          MAX_RECURSION_DEPTH: 5,

          saveConfig() {
            window.dispatchEvent(
              new CustomEvent("ulc-save-config", { detail: State.config })
            );
            State.ruleCache.clear();
            Logger.log(
              "[Cache] Rules cache cleared due to local configuration change."
            );
          },

          // 计算最终规则集
          _calculateFinalRules(absoluteUrl, relevantRules, generalConfig) {
            for (const rule of relevantRules) {
              if (
                rule &&
                rule.enabled === false &&
                rule.applyGeneral === false
              ) {
                for (const match of rule.match) {
                  if (Utils.wildcardToRegex(match).test(absoluteUrl.href)) {
                    Logger.log(
                      `Cleaning explicitly disabled for ${absoluteUrl.href} by rule: "${rule.name}"`
                    );
                    return {
                      params: new Set(),
                      transforms: new Set(),
                      compatibilityMode: false,
                    };
                  }
                }
              }
            }

            const finalParams = new Set();
            const finalTransforms = new Set();
            let compatibilityMode;
            const matchingRules = [];

            // 精确匹配
            for (const rule of relevantRules) {
              if (!rule || !rule.transform) continue;
              if (!rule.enabled) continue;
              for (const match of rule.match) {
                if (Utils.wildcardToRegex(match).test(absoluteUrl.href)) {
                  matchingRules.push(rule);
                  break;
                }
              }
            }

            // 规则合并
            if (matchingRules.length > 0) {
              compatibilityMode = false;
              let shouldApplyGeneral = false;
              matchingRules.forEach((rule) => {
                rule.params.forEach((p) => finalParams.add(p));
                rule.transform.forEach((t) => finalTransforms.add(t));
                if (rule.applyGeneral) {
                  shouldApplyGeneral = true;
                }
                if (rule.compatibilityMode) {
                  compatibilityMode = true;
                }
              });
              if (shouldApplyGeneral) {
                (generalConfig.params || []).forEach((p) => finalParams.add(p));
              }
            } else {
              // 不存在任何特定规则，只应用通用规则
              (generalConfig.params || []).forEach((p) => finalParams.add(p));
              compatibilityMode = true; // 在这种情况下，默认值为 true (兼容模式)
            }

            return {
              params: finalParams,
              transforms: finalTransforms,
              compatibilityMode,
            };
          },

          // 获取与URL相关的规则
          getRulesForUrl(urlString) {
            let hostname;
            let absoluteUrl;
            try {
              absoluteUrl = new URL(urlString, window.location.href);
              hostname = absoluteUrl.hostname;
            } catch (e) {
              return {
                params: new Set(),
                transforms: new Set(),
                compatibilityMode: false,
              };
            }

            if (State.ruleCache.has(hostname)) {
              return State.ruleCache.get(hostname);
            }

            const relevantRules = State.config.rules.filter((rule) =>
              rule.match.some((matchPattern) => {
                const domain = (matchPattern.split("://")[1] || matchPattern)
                  .split("/")[0]
                  .replace(/\*|^\./g, "");
                return hostname.endsWith(domain);
              })
            );

            const finalRuleSet = this._calculateFinalRules(
              absoluteUrl,
              relevantRules,
              State.config.general
            );
            State.ruleCache.set(hostname, finalRuleSet);
            return finalRuleSet;
          },

          cleanUrl(urlString, recursionDepth = 0) {
            if (recursionDepth > this.MAX_RECURSION_DEPTH) {
              Logger.warnLine(
                `[Core] Max recursion depth reached for URL: ${urlString}`
              );
              return urlString;
            }
            if (!urlString || typeof urlString !== "string") return urlString;

            const originalUrlString = urlString;

            let urlObject;
            try {
              urlObject = new URL(originalUrlString, window.location.href);
            } catch (e) {
              return originalUrlString;
            }

            const { params: paramsToRemove, transforms: transformKeysToUse } =
              this.getRulesForUrl(urlObject.href);

            if (transformKeysToUse.size > 0) {
              if (urlObject.searchParams.size === 1) {
                const weirdUrl = Utils.extractUrlFromWeirdParam(urlObject.href);
                if (weirdUrl)
                  return this.cleanUrl(weirdUrl, recursionDepth + 1);
              }
              for (const key of transformKeysToUse) {
                if (urlObject.searchParams.has(key)) {
                  const value = urlObject.searchParams.get(key);
                  const transformedUrl = Utils.tryAllDecodes(value);
                  if (transformedUrl) {
                    Logger.log("Link transformed based on a specific rule:", {
                      from: originalUrlString,
                      to: transformedUrl,
                    });
                    return this.cleanUrl(transformedUrl, recursionDepth + 1);
                  }
                }
              }
            }

            let modified = false;

            if (paramsToRemove.size > 0) {
              const paramsToDelete = [];
              for (const key of urlObject.searchParams.keys()) {
                if (paramsToRemove.has(key)) {
                  paramsToDelete.push(key);
                }
              }
              if (paramsToDelete.length > 0) {
                paramsToDelete.forEach((key) =>
                  urlObject.searchParams.delete(key)
                );
                modified = true;
              }
            }

            for (const [key, value] of urlObject.searchParams.entries()) {
              try {
                const decodedValue = decodeURIComponent(value);
                if (Utils.isValidAbsoluteURL(decodedValue)) {
                  const cleanedInnerUrl = this.cleanUrl(
                    decodedValue,
                    recursionDepth + 1
                  );
                  if (cleanedInnerUrl !== decodedValue) {
                    urlObject.searchParams.set(
                      key,
                      encodeURIComponent(cleanedInnerUrl)
                    );
                    modified = true;
                    Logger.log(`Nested URL in parameter "${key}" purified.`, {
                      from: decodedValue,
                      to: cleanedInnerUrl,
                    });
                  }
                }
              } catch (e) {
                /* Silently ignore decoding errors */
              }
            }

            if (!modified) return originalUrlString;

            const isOriginalRelative = !/^(https?:)?\/\//.test(
              originalUrlString
            );
            if (isOriginalRelative) {
              return urlObject.pathname + urlObject.search + urlObject.hash;
            } else {
              return urlObject.href;
            }
          },
        };

        // --- UI (界面渲染) ---
        const UI = {
          _policy: null,
          _currentDetailView: null,

          setSafelyInnerHTML(element, htmlString) {
            if (this._policy === null) {
              this._policy = false;

              if (window.trustedTypes && window.trustedTypes.createPolicy) {
                try {
                  this._policy = window.trustedTypes.createPolicy(
                    "URLCleanerPolicy#html",
                    {
                      createHTML: (s) => s,
                    }
                  );
                } catch (e) {
                  if (window.trustedTypes.defaultPolicy) {
                    this._policy = window.trustedTypes.defaultPolicy;
                    Logger.log(
                      "Using host page default Trusted Types policy as a fallback."
                    );
                  }
                }
              }
            }

            if (this._policy) {
              try {
                element.innerHTML = this._policy.createHTML(htmlString);
              } catch (e) {
                Logger.error(
                  "UI Rendering failed even with a Trusted Types policy.",
                  `Policy in use: ${this._policy.name}`,
                  `Error: ${e.message}`
                );
              }
            } else {
              try {
                element.innerHTML = htmlString;
              } catch (e) {
                Logger.error(
                  "UI Rendering blocked by CSP.",
                  `Error: ${e.message}`
                );
              }
            }
          },

          showToast(message, duration = 2000) {
            const toast = document.getElementById("ulc-toast");
            if (!toast) return;
            toast.textContent = message;
            toast.classList.add("show");
            if (State.toastTimer) clearTimeout(State.toastTimer);
            State.toastTimer = setTimeout(() => {
              toast.classList.remove("show");
              State.toastTimer = null;
            }, duration);
          },

          createSettingsPanel() {
            if (State.dom.settingsPanel) return;
            const panel = document.createElement("div");
            panel.id = State.dom.panelId;
            this.setSafelyInnerHTML(
              panel,
              `
              <div class="ulc-sidebar"></div>
              <div class="ulc-main-content"></div>
              <div id="ulc-toast"></div>
            `
            );
            document.body.appendChild(panel);
            State.dom.settingsPanel = panel;
            State.dom.sidebarContainer = panel.querySelector(".ulc-sidebar");
            State.dom.mainContentContainer =
              panel.querySelector(".ulc-main-content");
            panel.addEventListener("click", Events.handlePanelClick);
            panel.addEventListener("keydown", (e) => {
              if (e.key === "Enter" && e.target.id === "ulc-new-param")
                Events.addParamsFromInput();
            });
          },

          renderPanel() {
            if (!State.dom.settingsPanel) return;
            this.renderSidebar();
            this.renderMainContent();
            const input =
              document.getElementById("ulc-new-param") ||
              document.getElementById("ulc-rule-name");
            if (input) input.focus();
          },

          updateRuleList() {
            const tabsContainer =
              State.dom.sidebarContainer.querySelector(".ulc-tabs");
            if (!tabsContainer) return;

            const searchQuery = (State.ui.searchQuery || "").toLowerCase();
            const fragment = document.createDocumentFragment();

            const generalTab = document.createElement("li");
            generalTab.className = "ulc-tab";
            generalTab.dataset.action = "openTab";
            generalTab.dataset.tabId = GENERAL_TAB_ID;
            generalTab.dataset.ruleIndex = "-1";
            generalTab.textContent = Utils.t("ui.tabs.general");
            if (State.ui.activeTab === GENERAL_TAB_ID) {
              generalTab.classList.add("active");
            }
            fragment.appendChild(generalTab);

            State.config.rules.forEach((rule, index) => {
              const li = document.createElement("li");
              li.className = "ulc-tab";
              li.dataset.action = "openTab";
              li.dataset.tabId = Utils.getRuleTabId(rule);
              li.dataset.ruleIndex = index.toString();
              li.title = `${rule.name}\n${rule.match.join("\n")}`;
              const textSpan = document.createElement("span");
              textSpan.textContent = rule.name;
              li.appendChild(textSpan);

              const isVisible = searchQuery
                ? rule.name.toLowerCase().includes(searchQuery)
                : true;
              if (!isVisible) {
                li.style.display = "none";
              }
              if (State.ui.activeTab === Utils.getRuleTabId(rule)) {
                li.classList.add("active");
              }
              fragment.appendChild(li);
            });

            this.setSafelyInnerHTML(tabsContainer, "");
            tabsContainer.appendChild(fragment);

            const activeTabEl = tabsContainer.querySelector(".ulc-tab.active");
            if (activeTabEl) {
              requestAnimationFrame(() =>
                activeTabEl.scrollIntoView({
                  block: "nearest",
                  behavior: "auto",
                })
              );
            }
          },

          renderSidebar() {
            if (!State.dom.sidebarContainer) return;

            const sidebarHtml = `
              <div class="ulc-search-container">
                <input type="search" id="ulc-rule-search" placeholder="${Utils.t(
                  "ui.placeholders.search"
                )}">
              </div>
              <ul class="ulc-tabs"></ul>
              <div id="ulc-add-rule-btn" data-action="openAddRuleForm" data-locale=" ${Utils.escapeHTML(
                Utils.t("ui.buttons.addRule")
              )}">+</div>
            `;
            this.setSafelyInnerHTML(State.dom.sidebarContainer, sidebarHtml);

            // 绑定事件到稳定的搜索框
            const searchInput =
              State.dom.sidebarContainer.querySelector("#ulc-rule-search");
            if (searchInput) {
              searchInput.value = State.ui.searchQuery || "";
              if (Events.onSearchInputDebounced) {
                searchInput.addEventListener(
                  "input",
                  Events.onSearchInputDebounced
                );
              }
              const isMobile = window.innerWidth <= 600;
              if (!isMobile && document.activeElement !== searchInput) {
                searchInput.focus();
                searchInput.selectionStart = searchInput.selectionEnd =
                  searchInput.value.length;
              }
            }

            // 列表渲染
            this.updateRuleList();
          },

          _createDetailView() {
            const mainContentContainer = State.dom.mainContentContainer;
            mainContentContainer.innerHTML = "";

            const template = `
                <div class="ulc-header">
                    <div class="ulc-title-container">
                        <h3></h3>
                    </div>
                    <button data-action="closePanel" id="ulc-close-btn">×</button>
                </div>
                <div class="ulc-sub-header">
                    <span>${Utils.t("ui.labels.matchAddressShort")}:</span>
                    <div class="ulc-match-tags"></div>
                </div>
                <div class="ulc-add">
                    <input type="text" id="ulc-new-param" placeholder="${Utils.t(
                      "ui.placeholders.addParam"
                    )}"/>
                    <button id="ulc-add-btn" data-action="addParam" class="ulc-btn-primary">${Utils.t(
                      "ui.buttons.add"
                    )}</button>
                </div>
                <div class="ulc-list" data-locale="${Utils.escapeHTML(
                  Utils.t("ui.misc.noParams")
                )}"></div>
                <div class="ulc-list-transform" data-locale="${Utils.escapeHTML(
                  Utils.t("ui.misc.transformTitle")
                )}">
                    <div class="ulc-list-transform-content"></div>
                </div>
                <div class="ulc-rule-settings-footer"></div>
            `;
            this.setSafelyInnerHTML(mainContentContainer, template);

            this._currentDetailView = {
              container: mainContentContainer,
              titleContainer: mainContentContainer.querySelector(
                ".ulc-title-container"
              ),
              title: mainContentContainer.querySelector("h3"),
              subHeader: mainContentContainer.querySelector(".ulc-sub-header"),
              matchTags: mainContentContainer.querySelector(".ulc-match-tags"),
              paramsList: mainContentContainer.querySelector(".ulc-list"),
              transformContainer: mainContentContainer.querySelector(
                ".ulc-list-transform"
              ),
              transformContent: mainContentContainer.querySelector(
                ".ulc-list-transform-content"
              ),
              footer: mainContentContainer.querySelector(
                ".ulc-rule-settings-footer"
              ),
            };
          },

          _updateDetailView() {
            const highlightedParams = State.ui.highlightedParams;
            const view = this._currentDetailView;
            if (!view) return;

            const isGeneral = State.ui.activeTab === GENERAL_TAB_ID;
            const rule = isGeneral
              ? null
              : State.config.rules[State.ui.activeRuleIndex];

            const params = isGeneral
              ? State.config.general.params
              : rule.params || [];
            const transform = isGeneral ? [] : rule.transform || [];
            const titleText = isGeneral
              ? Utils.t("ui.titles.generalList")
              : rule.name;

            view.titleContainer.querySelector(".ulc-edit-icon")?.remove();
            view.matchTags.innerHTML = "";
            view.paramsList.innerHTML = "";
            view.transformContent.innerHTML = "";
            view.footer.innerHTML = "";

            view.title.textContent = titleText;
            view.title.title = titleText;

            if (isGeneral) {
              view.subHeader.style.display = "none";
              const footerHtml = `
              <div><button id="ulc-config-text-btn" data-action="openConfigText" class="ulc-btn-secondary">${Utils.t(
                "ui.buttons.configText"
              )}</button></div>
              <button id="ulc-reset-btn" data-action="resetGeneral" class="ulc-btn-secondary" data-locale="${Utils.escapeHTML(
                Utils.t("prompts.resetGeneral")
              )}">${Utils.t("ui.buttons.reset")}</button>`;
              this.setSafelyInnerHTML(view.footer, footerHtml);
            } else {
              view.subHeader.style.display = "flex";

              const editIconSvg = `<svg data-action="openEditRuleForm" class="ulc-edit-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M832 512a32 32 0 1 1 64 0v352a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V160a96 96 0 0 1 96-96h352a32 32 0 0 1 0 64H160a32 32 0 0 0-32 32v704a32 32 0 0 0 32 32h704a32 32 0 0 0 32-32V512zm-101.056-405.504a32 32 0 0 1 45.248 0L904.96 235.264a32 32 0 0 1 0 45.248L583.424 601.984a32 32 0 0 1-18.112 9.088L400 640l28.928-165.312a32 32 0 0 1 9.088-18.112l321.536-321.536zM855.04 256l-45.248-45.248L704.96 315.648l45.248 45.248L855.04 256zm-45.248 45.248L588.224 522.816 542.976 477.568 764.544 256l45.248 45.248z"/></svg>`;
              view.title.insertAdjacentHTML("afterend", editIconSvg);

              rule.match.forEach((m) => {
                const codeEl = document.createElement("code");
                codeEl.textContent = m;
                view.matchTags.appendChild(codeEl);
              });

              const footerHtml = `
              <div class="ulc-footer-switches">
                  <label class="ulc-switch-container">
                      <span class="ulc-switch-label">${Utils.t(
                        "ui.labels.enableRule"
                      )}</span>
                      <input type="checkbox" data-action="toggleRuleEnabled">
                  </label>
                  <label class="ulc-switch-container">
                      <span class="ulc-switch-label">${Utils.t(
                        "ui.labels.applyGeneral"
                      )}</span>
                      <input type="checkbox" data-action="toggleApplyGeneral">
                  </label>
              </div>
              <button id="ulc-delete-rule-btn" data-action="deleteRule" class="ulc-btn-danger" data-locale="${Utils.escapeHTML(
                Utils.t("prompts.deleteRule", { ruleName: rule.name })
              )}">${Utils.t("ui.buttons.delete")}</button>`;
              this.setSafelyInnerHTML(view.footer, footerHtml);
              view.footer.querySelector(
                '[data-action="toggleRuleEnabled"]'
              ).checked = rule.enabled;
              view.footer.querySelector(
                '[data-action="toggleApplyGeneral"]'
              ).checked = rule.applyGeneral;
            }

            [...params].sort().forEach((p) => {
              const paramEl = document.createElement("div");
              paramEl.className = "ulc-param";
              if (highlightedParams.has(p)) {
                paramEl.classList.add("ulc-param-new");
              }
              const span = document.createElement("span");
              span.textContent = p;
              const del = document.createElement("div");
              del.className = "ulc-delete";
              del.textContent = "×";
              del.dataset.action = "deleteParam";
              del.dataset.param = p;
              paramEl.append(span, del);
              view.paramsList.appendChild(paramEl);
            });

            view.transformContainer.style.display =
              transform.length > 0 ? "block" : "none";
            if (transform.length > 0) {
              transform.forEach((t) => {
                const span = document.createElement("span");
                span.textContent = t;
                view.transformContent.appendChild(span);
              });
            }
          },

          renderMainContent() {
            if (!State.dom.mainContentContainer) return;

            if (State.ui.view === "list") {
              const isGeneral = State.ui.activeTab === GENERAL_TAB_ID;
              const rule = isGeneral
                ? null
                : State.config.rules[State.ui.activeRuleIndex];

              if (!isGeneral && !rule) {
                Logger.warnLine(
                  `Active rule not found, falling back to general view.`
                );
                State.ui.activeTab = GENERAL_TAB_ID;
                State.ui.activeRuleIndex = -1;
              }

              if (
                !this._currentDetailView ||
                !this._currentDetailView.container.isConnected
              ) {
                this._createDetailView();
              }
              this._updateDetailView();
            } else {
              this._currentDetailView = null;

              State.dom.mainContentContainer.innerHTML = "";
              let contentHtml = "";
              if (State.ui.view === "add" || State.ui.view === "edit") {
                contentHtml = this.renderRuleForm();
              } else if (State.ui.view === "config-text") {
                contentHtml = this.renderConfigTextForm();
              }
              this.setSafelyInnerHTML(
                State.dom.mainContentContainer,
                contentHtml
              );
            }

            const input =
              document.getElementById("ulc-new-param") ||
              document.getElementById("ulc-rule-name") ||
              document.getElementById("ulc-config-textarea");
            if (input) input.focus();
          },

          renderRuleForm() {
            const isEdit = State.ui.view === "edit";
            const rule = isEdit
              ? State.config.rules[State.ui.activeRuleIndex]
              : null;
            const title = isEdit
              ? Utils.t("ui.titles.editRule")
              : Utils.t("ui.titles.addRule");
            let ruleName = "",
              matchPatterns = "",
              transformKeys = "",
              compatibilityMode = false;
            if (isEdit && rule) {
              ruleName = rule.name;
              matchPatterns = rule.match.join("\n");
              transformKeys = Array.isArray(rule.transform)
                ? rule.transform.join("\n")
                : "";
              compatibilityMode = !!rule.compatibilityMode;
            } else {
              try {
                const hostname = window.location.hostname;
                if (hostname && hostname !== "localhost") {
                  const parts = hostname.split(".").filter((p) => p);
                  ruleName =
                    parts.length > 1 ? parts.slice(-2).join(".") : hostname;
                  matchPatterns = hostname;
                }
              } catch (e) {
                Logger.warn(
                  "Failed to get default rule name from hostname.",
                  e.message
                );
              }
            }
            return `
              <div class="ulc-main-content">
                  <div class="ulc-header"><h3>${title}</h3></div>
                  <div class="ulc-form-content">
                  <label for="ulc-rule-name">${Utils.t(
                    "ui.labels.ruleName"
                  )}</label>
                  <input type="text" id="ulc-rule-name" placeholder="${Utils.t(
                    "ui.placeholders.ruleName"
                  )}" maxlength="30" value="${ruleName}">
                  <label for="ulc-rule-match">${Utils.t(
                    "ui.labels.matchAddress"
                  )}</label>
                  <textarea id="ulc-rule-match" placeholder="${Utils.t(
                    "ui.placeholders.matchAddress"
                  )}">${matchPatterns}</textarea>
                  <div class="ulc-form-hint">${Utils.t(
                    "ui.hints.matchAddress"
                  )}</div>
                  <label for="ulc-transform-keys">${Utils.t(
                    "ui.labels.transformKeys"
                  )}</label>
                  <textarea id="ulc-transform-keys" placeholder="${Utils.t(
                    "ui.placeholders.transformKeys"
                  )}">${transformKeys}</textarea>
                  <p>${Utils.t("ui.hints.transform")}</p>
                  <label for="ulc-compatibility-mode">${Utils.t(
                    "ui.labels.compatibilityMode"
                  )}</label> 
                  <div class="ulc-switch-container" style="gap: 10px;">
                      <input type="checkbox" id="ulc-compatibility-mode" ${
                        compatibilityMode ? "checked" : ""
                      }>
                      <p>${Utils.t("ui.hints.compatibilityMode")}</p>
                  </div>
                  </div>
                  <div class="ulc-form-actions">
                  <button id="ulc-cancel-add-rule-btn" data-action="cancelRuleForm" class="ulc-btn-secondary">${Utils.t(
                    "ui.buttons.cancel"
                  )}</button>
                  <button id="ulc-save-rule-btn" data-action="saveRule" class="ulc-btn-primary">${Utils.t(
                    "ui.buttons.saveRule"
                  )}</button>
                  </div>
              </div>`;
          },

          renderConfigTextForm() {
            const configToExport = structuredClone(State.config);
            delete configToExport.general;

            if (Array.isArray(configToExport.rules)) {
              configToExport.rules.forEach((rule) => {
                if (rule.params && rule.params.length === 0) {
                  delete rule.params;
                }
                if (rule.transform && rule.transform.length === 0) {
                  delete rule.transform;
                }
                if (rule.enabled === true) {
                  delete rule.enabled;
                }
                if (rule.applyGeneral === true) {
                  delete rule.applyGeneral;
                }
                if (rule.compatibilityMode === false) {
                  delete rule.compatibilityMode;
                }
              });
            }

            const configString = JSON.stringify(configToExport, null, 2);

            return `
            <div class="ulc-main-content">
                <div class="ulc-header"><h3>${Utils.t(
                  "ui.titles.configText"
                )}</h3></div>
                <div class="ulc-form-content">
                <textarea id="ulc-config-textarea">${configString}</textarea>
                </div>
                <div class="ulc-form-actions">
                <button id="ulc-cancel-config-text-btn" data-action="cancelConfigText" class="ulc-btn-secondary">${Utils.t(
                  "ui.buttons.cancel"
                )}</button>
                <button id="ulc-save-config-text-btn" data-action="saveConfigText" class="ulc-btn-primary">${Utils.t(
                  "ui.buttons.save"
                )}</button>
                </div>
            </div>`;
          },
        };

        // --- Events (事件处理与数据逻辑) ---
        const Events = {
          _getCurrentContext() {
            const isGeneral = State.ui.activeTab === GENERAL_TAB_ID;
            if (isGeneral) {
              return {
                isGeneral: true,
                params: State.config.general.params || [],
                rule: null,
              };
            }
            const rule = State.config.rules[State.ui.activeRuleIndex];
            return {
              isGeneral: false,
              params: rule ? rule.params || [] : [],
              rule: rule,
            };
          },

          _confirmingAction: {
            el: null,
            onConfirm: null,
            originalText: "",
            isActivating: false,
            timer: null,
          },

          _resetConfirmation() {
            if (this._confirmingAction.el) {
              clearTimeout(this._confirmingAction.timer);
              this._confirmingAction.el.classList.remove(
                "ulc-confirming-action",
                "ulc-confirmation-activating"
              );
              this._confirmingAction.el.textContent =
                this._confirmingAction.originalText;
              this._confirmingAction = {
                el: null,
                onConfirm: null,
                originalText: "",
              };
            }
          },

          requestConfirmation(
            buttonElement,
            onConfirmCallback,
            confirmText = Utils.t("ui.buttons.confirm")
          ) {
            this._resetConfirmation();

            this._confirmingAction = {
              el: buttonElement,
              onConfirm: onConfirmCallback,
              originalText: buttonElement.textContent,
              isActivating: true,
              timer: setTimeout(() => {
                this._confirmingAction.isActivating = false;
                if (this._confirmingAction.el) {
                  this._confirmingAction.el.classList.remove(
                    "ulc-confirmation-activating"
                  );
                }
              }, State.ui.ACTIVATION_DELAY),
            };
            buttonElement.classList.add(
              "ulc-confirming-action",
              "ulc-confirmation-activating"
            );
            buttonElement.textContent = confirmText;
          },

          addParamsFromInput() {
            const input = document.getElementById("ulc-new-param");
            if (!input || !input.value) return false;

            const inputValue = input.value.trim().replace(/['"]/g, "");
            let newParams = [];
            const parsedUrl = Utils.tryParseURL(inputValue);

            if (parsedUrl) {
              if (parsedUrl.searchParams.size === 0) {
                input.value = "";
                return false;
              }
              newParams = [...parsedUrl.searchParams.keys()];
            } else {
              newParams = inputValue
                .split(",")
                .map((p) => p.trim())
                .filter((p) => p);
            }

            if (newParams.length === 0) {
              input.value = "";
              return false;
            }

            const context = this._getCurrentContext();
            if (!context.isGeneral && !context.rule) {
              return false;
            }

            const paramsList = context.params;
            const paramsSet = new Set(paramsList);
            const addedParams = new Set();

            newParams.forEach((p) => {
              if (!paramsSet.has(p)) {
                paramsSet.add(p);
                addedParams.add(p);
              }
            });

            if (addedParams.size > 0) {
              const sortedParams = Array.from(paramsSet).sort();
              if (context.isGeneral) {
                State.config.general.params = sortedParams;
              } else {
                context.rule.params = sortedParams;
              }
              Logger.log(`Added ${addedParams.size} parameter(s)...`);
            }

            input.value = "";
            return addedParams;
          },

          deleteParam(paramToDelete) {
            const context = this._getCurrentContext();
            const params = context.params;

            if ((!context.isGeneral && !context.rule) || !params) {
              return false;
            }

            const index = params.indexOf(paramToDelete);
            if (index > -1) {
              params.splice(index, 1);

              const contextName = context.isGeneral
                ? "General Rules"
                : context.rule.name;
              Logger.log(
                `Parameter "${paramToDelete}" deleted from "${contextName}".`
              );
              return true;
            }
            return false;
          },

          saveRule() {
            const nameInput = document.getElementById("ulc-rule-name");
            const matchInput = document.getElementById("ulc-rule-match");
            const transformInput =
              document.getElementById("ulc-transform-keys");
            const compatibilityModeInput = document.getElementById(
              "ulc-compatibility-mode"
            );
            const newName = nameInput.value.trim();
            const newMatches = [
              ...new Set(
                matchInput.value
                  .split("\n")
                  .map((m) => m.trim())
                  .filter((m) => m)
              ),
            ];
            const newTransformKeys = [
              ...new Set(
                transformInput.value
                  .split("\n")
                  .map((k) => k.trim())
                  .filter((k) => k)
              ),
            ];
            const newCompatibilityMode = compatibilityModeInput.checked;

            if (!newName || newMatches.length === 0) {
              UI.showToast(Utils.t("toasts.allEmpty"));
              return false;
            }
            if (newName.toLowerCase() === GENERAL_TAB_ID) {
              UI.showToast(Utils.t("toasts.nameReserved"));
              return false;
            }

            const isEdit = State.ui.view === "edit";
            const ruleIndex = isEdit ? State.ui.activeRuleIndex : -1;

            if (
              State.config.rules.some(
                (r, i) =>
                  r.name.toLowerCase() === newName.toLowerCase() &&
                  i !== ruleIndex
              )
            ) {
              Logger.warn(
                "Save failed: Duplicate rule name detected.",
                newName
              );
              UI.showToast(Utils.t("toasts.nameExists"));
              return false;
            }

            const ruleData = {
              name: newName,
              match: newMatches,
              transform: newTransformKeys,
              compatibilityMode: newCompatibilityMode,
            };

            if (isEdit) {
              Object.assign(State.config.rules[ruleIndex], ruleData);
            } else {
              const newRule = {
                ...ruleData,
                params: [],
                enabled: true,
                applyGeneral: true,
              };
              State.config.rules.push(newRule);
              State.ui.activeRuleIndex = State.config.rules.length - 1;
              State.ui.activeTab = Utils.getRuleTabId(newRule);
            }

            Logger.log(
              `Rule "${newName}" has been saved (${
                isEdit ? "edited" : "newly created"
              }).`
            );
            UI.showToast(Utils.t("toasts.ruleSaved", { ruleName: newName }));
            return true;
          },

          deleteCurrentRule() {
            const rule = State.config.rules[State.ui.activeRuleIndex];
            if (State.ui.activeTab === GENERAL_TAB_ID || !rule) return false;
            State.config.rules.splice(State.ui.activeRuleIndex, 1);
            Logger.log(`Rule "${rule.name}" has been deleted.`);
            UI.showToast(Utils.t("toasts.ruleDeleted"));
            return true;
          },

          saveConfigFromText() {
            const textarea = document.getElementById("ulc-config-textarea");
            if (!textarea) return false;

            let parsedJson;
            try {
              parsedJson = JSON.parse(textarea.value);
            } catch (e) {
              UI.showToast(Utils.t("toasts.jsonInvalid", { error: e.message }));
              return false;
            }

            if (
              typeof parsedJson !== "object" ||
              parsedJson === null ||
              Array.isArray(parsedJson)
            ) {
              UI.showToast(Utils.t("toasts.configNotAnObject"));
              return false;
            }

            let newConfig;
            try {
              newConfig = structuredClone(parsedJson);
            } catch (e) {
              UI.showToast(
                Utils.t("toasts.configInvalidContent", { error: e.message })
              );
              return false;
            }

            newConfig.general = structuredClone(State.config.general);

            if (!Array.isArray(newConfig.rules)) {
              UI.showToast(Utils.t("toasts.configMissingRules"));
              return false;
            }

            const validationResult =
              Utils.validateAndNormalizeConfig(newConfig);

            if (validationResult.error) {
              UI.showToast(
                Utils.t("toasts.configInvalid", {
                  error: validationResult.error,
                })
              );
              return false;
            }

            State.config = validationResult.config;

            Core.saveConfig();
            UI.showToast(Utils.t("toasts.configSaved"));

            return true;
          },

          resetConfig() {
            State.config.general.params = structuredClone(
              State.DEFAULT_CONFIG.general.params
            );
            Logger.warn("General rules have been reset to default.");
            UI.showToast(Utils.t("toasts.configReset"));
            return true;
          },

          onSearchInputDebounced: null, // 防抖处理的 input 事件处理器
          _performSearch(query) {
            if (query !== State.ui.searchQuery) {
              State.ui.searchQuery = query;
              UI.updateRuleList();
            }
          },

          // 动作字典
          actions: {
            closePanel() {
              if (State.dom.settingsPanel) {
                State.dom.settingsPanel.remove();
                State.dom.settingsPanel = null;
              }
            },
            openTab(target) {
              const tabId = target.dataset.tabId;
              if (State.ui.activeTab === tabId) return;

              State.ui.highlightedParams.clear();
              State.ui.activeTab = tabId;
              State.ui.activeRuleIndex = parseInt(target.dataset.ruleIndex, 10);
              State.ui.view = "list";

              UI.renderPanel();
            },
            addParam() {
              const newlyAddedParams = Events.addParamsFromInput();
              if (newlyAddedParams === false) {
                return;
              }

              if (newlyAddedParams.size > 0) {
                UI.showToast(
                  Utils.t("toasts.paramsAdded", {
                    count: newlyAddedParams.size,
                  })
                );
                State.ui.highlightedParams = newlyAddedParams;
                Core.saveConfig();
                UI.renderMainContent();
              } else {
                UI.showToast(Utils.t("toasts.paramsExist"));
              }
            },
            deleteParam(target) {
              if (Events.deleteParam(target.dataset.param)) {
                Core.saveConfig();
                UI.renderMainContent();
              }
            },
            openAddRuleForm() {
              State.ui.view = "add";
              UI.renderMainContent();
            },
            openEditRuleForm() {
              State.ui.view = "edit";
              UI.renderMainContent();
            },
            deleteRule(target) {
              Events.requestConfirmation(
                target,
                () => {
                  const originalIndex = State.ui.activeRuleIndex;
                  if (Events.deleteCurrentRule()) {
                    const newIndex = originalIndex - 1;

                    if (State.config.rules.length === 0) {
                      State.ui.activeRuleIndex = -1;
                      State.ui.activeTab = GENERAL_TAB_ID;
                    } else {
                      const newSafeIndex = Math.max(
                        -1,
                        Math.min(newIndex, State.config.rules.length - 1)
                      );
                      State.ui.activeRuleIndex = newSafeIndex;
                      if (newSafeIndex === -1) {
                        State.ui.activeTab = GENERAL_TAB_ID;
                      } else {
                        const newActiveRule = State.config.rules[newSafeIndex];
                        State.ui.activeTab = Utils.getRuleTabId(newActiveRule);
                      }
                    }
                    Core.saveConfig();
                    UI.renderPanel();
                  }
                },
                Utils.t("ui.buttons.confirmDelete")
              );
            },
            resetGeneral(target) {
              Events.requestConfirmation(
                target,
                () => {
                  if (Events.resetConfig()) {
                    Core.saveConfig();
                    UI.renderMainContent();
                  }
                },
                Utils.t("ui.buttons.confirmReset")
              );
            },
            toggleRuleEnabled(target) {
              const rule = State.config.rules[State.ui.activeRuleIndex];
              if (rule) rule.enabled = target.checked;
              Core.saveConfig();
            },
            toggleApplyGeneral(target) {
              const rule = State.config.rules[State.ui.activeRuleIndex];
              if (rule) rule.applyGeneral = target.checked;
              Core.saveConfig();
            },
            saveRule() {
              if (Events.saveRule()) {
                State.ui.view = "list";
                Core.saveConfig();
                UI.renderPanel();
              }
            },
            cancelRuleForm() {
              State.ui.view = "list";
              UI.renderMainContent();
            },
            openConfigText() {
              State.ui.view = "config-text";
              UI.renderMainContent();
            },
            saveConfigText() {
              if (Events.saveConfigFromText()) {
                State.ui.view = "list";
                State.ui.activeTab = GENERAL_TAB_ID;
                State.ui.activeRuleIndex = -1;
                Core.saveConfig();
                UI.renderPanel();
              }
            },
            cancelConfigText() {
              State.ui.view = "list";
              UI.renderMainContent();
            },
          },

          // 核心事件处理器
          handlePanelClick(e) {
            const target = e.target;
            const actionTarget = target.closest("[data-action]");

            if (!actionTarget) {
              if (this._confirmingAction.el) {
                this._resetConfirmation();
              }
              return;
            }

            if (this._confirmingAction.el === actionTarget) {
              if (this._confirmingAction.isActivating) {
                return;
              } else {
                this._confirmingAction.onConfirm();
                this._resetConfirmation();
                return;
              }
            }

            if (this._confirmingAction.el) {
              this._resetConfirmation();
            }

            const action = actionTarget.dataset.action;
            if (this.actions[action]) {
              this.actions[action](actionTarget, e);
            }
          },

          initEventListeners() {
            const preCleanLink = (e) => {
              if (e.target.closest(`#${State.dom.panelId}`)) return;
              const link = Utils.findLinkInEvent(e);
              if (
                link &&
                !link.dataset[State.cleanedAttrName] &&
                !link.dataset[State.invalidAttrName]
              ) {
                if (Utils.isValidHttpLink(link)) {
                  const cleanedHref = Core.cleanUrl(link.href);
                  if (link.href !== cleanedHref) {
                    Logger.log("Link purified on hover:", {
                      from: link.href,
                      to: cleanedHref,
                    });
                    link.href = cleanedHref;
                  }
                  link.dataset[State.cleanedAttrName] = cleanedHref;
                  if (link.hostname !== window.location.hostname) {
                    link.setAttribute("referrerpolicy", "no-referrer");
                  }
                } else {
                  link.dataset[State.invalidAttrName] = "true";
                }
              }
            };

            document.addEventListener("mouseover", preCleanLink, true);

            const finalClickFix = (e) => {
              if (e.target.closest(`#${State.dom.panelId}`)) return;
              const link = Utils.findLinkInEvent(e);
              if (
                link &&
                typeof link.dataset[State.invalidAttrName] === "undefined"
              ) {
                const finalRules = Core.getRulesForUrl(link.href);
                const cleanedHref =
                  link.dataset[State.cleanedAttrName] ||
                  Core.cleanUrl(link.href);
                if (link.href !== cleanedHref) {
                  Logger.warn("Link purified on click (final fix):", {
                    from: link.href,
                    to: cleanedHref,
                  });
                  link.href = cleanedHref;
                }
                if (link.hostname !== window.location.hostname) {
                  link.setAttribute("referrerpolicy", "no-referrer");
                }
                if (!finalRules.compatibilityMode) {
                  e.stopImmediatePropagation();
                }
              }
            };
            ["mousedown", "click", "contextmenu"].forEach((evt) =>
              document.addEventListener(evt, finalClickFix, true)
            );

            const wrapHistoryMethod = (method) => {
              const original = history[method];
              history[method] = function (state, title, url, ...rest) {
                const originalUrl = url ? url.toString() : "";
                const cleanedUrl = Core.cleanUrl(originalUrl);

                if (originalUrl !== cleanedUrl) {
                  Logger.log(
                    `history.${method} intercepted and URL purified.`,
                    {
                      from: originalUrl,
                      to: cleanedUrl,
                      state: state,
                    }
                  );
                }

                return original.apply(this, [
                  state,
                  title,
                  cleanedUrl,
                  ...rest,
                ]);
              };
            };

            wrapHistoryMethod("pushState");
            wrapHistoryMethod("replaceState");

            // 沙盒模式下window.open无法正确拦截，所以需要使用unsafeWindow
            const openContext = isFallbackMode ? sandboxUnsafeWindow : window;
            if (openContext) {
              const originalOpen = openContext.open;
              if (typeof originalOpen === "function") {
                openContext.open = function (url, ...args) {
                  const originalUrl = url ? url.toString() : "";
                  const cleanedUrl = Core.cleanUrl(originalUrl);

                  if (originalUrl !== cleanedUrl) {
                    Logger.log(
                      "window.open call intercepted and URL purified.",
                      {
                        from: originalUrl,
                        to: cleanedUrl,
                        target: args[0] || "_blank",
                      }
                    );
                  }
                  return originalOpen.apply(openContext, [cleanedUrl, ...args]);
                };
              } else {
                Logger.warn(
                  "window.open is not a function and could not be patched."
                );
              }
            } else {
              Logger.warn(
                "window context is not available for patching window.open."
              );
            }

            window.addEventListener("ulc-open-settings", () => {
              if (State.dom.settingsPanel) {
                State.dom.settingsPanel.remove();
                State.dom.settingsPanel = null;
                return;
              }
              const open = () => {
                UI.createSettingsPanel();

                State.ui.isDarkMode = window.matchMedia(
                  "(prefers-color-scheme: dark)"
                ).matches;
                if (State.ui.isDarkMode) {
                  State.dom.settingsPanel.classList.add("theme-dark");
                }
                State.ui.view = "list";
                State.ui.activeTab = GENERAL_TAB_ID;
                State.ui.activeRuleIndex = -1;
                UI.renderPanel();
                State.dom.settingsPanel.style.display = "flex";
              };
              document.body
                ? open()
                : document.addEventListener("DOMContentLoaded", open);
            });

            window.addEventListener("ulc-config-updated", (event) => {
              Logger.log(
                "Configuration synced from another tab. Updating state..."
              );
              const newRawConfig = event.detail;

              // 更新配置
              State.config = newRawConfig;
              State.ruleCache.clear();
              Logger.log("[Cache] Rules cache cleared due to cross-tab sync.");

              if (State.dom.settingsPanel) {
                State.ui.view = "list";
                if (State.ui.activeTab !== GENERAL_TAB_ID) {
                  const ruleIndex = State.config.rules.findIndex(
                    (r) => Utils.getRuleTabId(r) === State.ui.activeTab
                  );
                  if (ruleIndex === -1) {
                    State.ui.activeTab = GENERAL_TAB_ID;
                    State.ui.activeRuleIndex = -1;
                  } else {
                    State.ui.activeRuleIndex = ruleIndex;
                  }
                }
                UI.renderPanel();
              }
            });
          },
        };

        // --- 初始化 ---
        function main() {
          const normalizedConfig = Utils.normalizeConfig(sandboxConfig.config);
          const normalizedDefaultConfig = Utils.normalizeConfig(
            sandboxConfig.defaultConfig
          );
          State.init(normalizedConfig, normalizedDefaultConfig);

          Events.onSearchInputDebounced = Utils.debounce((e) => {
            Events._performSearch(e.target.value);
          }, 250);

          State.cleanedAttrName = Utils.randomString();
          State.invalidAttrName = Utils.randomString();

          const cleanedPageUrl = Core.cleanUrl(window.location.href);
          if (window.location.href !== cleanedPageUrl) {
            history.replaceState(history.state, "", cleanedPageUrl);
          }
          Events.handlePanelClick = Events.handlePanelClick.bind(Events);
          Events.initEventListeners();
        }

        main();
      })();
    },

    inject(injectedConfig = {}) {
      const nonce =
        document.querySelector("script[nonce]")?.nonce ||
        document.querySelector("style[nonce]")?.nonce;
      const injectedScript = document.createElement("script");
      injectedScript.id = "ulc-injected-script";
      injectedScript.nonce = nonce;
      const scriptContent = `
            ((injectedCode) => {
                const injectedOptions = ${JSON.stringify(injectedConfig)};
                injectedCode(injectedOptions);
            })(${this.injectedCode.toString()});
        `;

      if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
          const policy = window.trustedTypes.createPolicy(
            "UniversalLinkCleanerPolicy",
            { createScript: (s) => s }
          );
          injectedScript.textContent = policy.createScript(scriptContent);
        } catch (e) {
          injectedScript.textContent = scriptContent;
        }
      } else {
        injectedScript.textContent = scriptContent;
      }

      (document.head || document.documentElement).appendChild(injectedScript);
      injectedScript.remove();
    },
  };

  // --- 主执行流程 ---
  function main() {
    const PANEL_ID = "p" + Math.random().toString(36).substring(2, 10);

    const activeLocale = I18nManager.getActiveLocale();
    const defaultLocale = I18nManager.getDefaultLocale();

    Sandbox.loadConfig();
    Sandbox.init(activeLocale);
    StyleInjector.inject(PANEL_ID);
    let injectionSuccessful = false;

    const successListener = () => {
      injectionSuccessful = true;
      window.removeEventListener("ulc-injection-success", successListener);
    };
    window.addEventListener("ulc-injection-success", successListener);

    // 注入配置项
    const INJECT_CONFIG = {
      sandboxConfig: {
        config: Sandbox.config,
        defaultConfig: Sandbox.DEFAULT_CONFIG,
      },
      IS_DEBUG,
      PANEL_ID,
      locale: activeLocale,
      defaultLocale: defaultLocale,
    };

    // 注入模式
    CodeInjector.inject(INJECT_CONFIG);

    setTimeout(() => {
      if (!injectionSuccessful) {
        // 注入失败，降级为沙盒模式
        window.removeEventListener("ulc-injection-success", successListener);
        CodeInjector.injectedCode({
          ...INJECT_CONFIG,
          isFallbackMode: true,
          sandboxUnsafeWindow: unsafeWindow,
        });
      }
    }, 0);
  }

  main();
})();
