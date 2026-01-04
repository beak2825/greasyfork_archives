// ==UserScript==
// @name                 GitHub Releases 浏览优化
// @name:zh-CN           GitHub Releases 浏览优化
// @name:en              GitHub Releases Navigation Enhancer
// @namespace            https://github.com/wha4up
// @icon                 https://raw.githubusercontent.com/wha4up/GitHub-Releases-Navigation-Enhancer/refs/heads/main/GithubFiler.webp
// @version              2.2.0
// @description          解决发布说明过长挤占发布列表空间、发布文件过多难定位目标文件的问题，通过优化说明界面和增加筛选功能，实现需求文件的快速定位，提升浏览体验。
// @description:zh-CN    解决发布说明过长挤占发布列表空间、发布文件过多难定位目标文件的问题，通过优化说明界面和增加筛选功能，实现需求文件的快速定位，提升浏览体验。
// @description:en       Tackles the issues of lengthy release notes taking up too much space and the difficulty of locating specific files among numerous assets. By optimizing the notes interface and adding powerful filtering features, it enables quick location of desired files and enhances the Browse experience.
// @author               eecopilot,wha4up(with assistance from Gemini)
// @match                https://github.com/*/*/releases
// @match                https://github.com/*/*/releases/*
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_deleteValue
// @grant                GM_registerMenuCommand
// @homepage             https://github.com/wha4up/GitHub-Releases-Navigation-Enhancer
// @supportURL           https://github.com/wha4up/GitHub-Releases-Navigation-Enhancer/issues
// @license              MIT
// @downloadURL https://update.greasyfork.org/scripts/539634/GitHub%20Releases%20%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539634/GitHub%20Releases%20%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/*
 * This script is a modified version of 'github-release-platform-filter' (version 0.3.3)
 * Originally created by eecopilot.
 * Original project: https://github.com/eecopilot/github-release-platform-filter
 *
 * Modifications and additions by wha4up and Gemini.
 * Copyright (c) 2025 wha4up.
 *
 * This entire work (including original and modifications) is licensed under the MIT License.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
    'use strict';

    let navigationReInit;

    // =================================================================================
    // [模块] 点击外部关闭处理器 (Click-Outside Handler)
    // =================================================================================
    const ReleaseNotesCollapser = class {
        constructor() {
            this.EXCLUDE_SELECTORS = [
                '.AppHeader',
                '.mb-5',
                '.Box',
                `.${GithubReleaseEnhancer.config.CLASS_NAMES.SETTINGS_OVERLAY}`,
            ].join(',');

            this.activePanel = null;
            this.boundClickHandler = null;
            this.lastTapTime = 0;
            this.timerId = null;
        }

        initForPanel(panel) {
            if (!GithubReleaseEnhancer.store.state.clickOutsideToCollapse || this.activePanel) {
                return;
            }
            this.activePanel = panel;

            if (!this.boundClickHandler) {
                this.boundClickHandler = this.handleDocumentClick.bind(this);
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.timerId = setTimeout(() => {
                    document.addEventListener('click', this.boundClickHandler, { capture: true });
                    document.addEventListener('touchend', this.boundClickHandler, { capture: true });
                    this.timerId = null;
                }, 50);
            }
        }

        handleDocumentClick(event) {
            if (!this.activePanel) return;

            if (event.type === 'touchend') {
                const now = Date.now();
                if (now - this.lastTapTime < 300) {
                    event.preventDefault();
                    return;
                }
                this.lastTapTime = now;
            }

            const target = event.target;

            if (this.activePanel.contains(target) || target.closest(this.EXCLUDE_SELECTORS)) {
                return;
            }

            this.collapsePanel();
        }

        collapsePanel() {
            if (!this.activePanel) return;
            const toggleBtn = this.activePanel.querySelector(`.${GithubReleaseEnhancer.config.CLASS_NAMES.TOGGLE_BUTTON}`);
            if (toggleBtn) {
                toggleBtn.click();
            } else {
                this.activePanel.classList.remove(GithubReleaseEnhancer.config.CLASS_NAMES.EXPANDED);
                this.cleanup();
            }
        }

        cleanup() {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }
            if (this.boundClickHandler) {
                document.removeEventListener('click', this.boundClickHandler, { capture: true });
                document.removeEventListener('touchend', this.boundClickHandler, { capture: true });
                this.boundClickHandler = null;
            }
            this.activePanel = null;
        }
    };

    // =================================================================================
    // [模块] 状态管理器 (State Manager)
    // =================================================================================

    const shallowEqual = (objA, objB) => {
        if (Object.is(objA, objB)) return true;
        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
            return false;
        }
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return false;
        for (let i = 0; i < keysA.length; i++) {
            const key = keysA[i];
            if (!Object.prototype.hasOwnProperty.call(objB, key)) {
                return false;
            }
            const valA = objA[key];
            const valB = objB[key];
            if (valA instanceof Set && valB instanceof Set) {
                if (valA.size !== valB.size) return false;
                for (const item of valA) {
                    if (!valB.has(item)) return false;
                }
                continue;
            }
            if (!Object.is(valA, valB)) return false;
        }
        return true;
    };

    const createStore = (initialState) => {
        let state = { ...initialState };
        const listeners = new Set();
        let isNotifying = false;
        let hasPendingUpdate = false;

        const notify = () => {
            if (isNotifying) {
                hasPendingUpdate = true;
                return;
            }
            isNotifying = true;
            listeners.forEach(listener => listener(state));
            isNotifying = false;
            if (hasPendingUpdate) {
                hasPendingUpdate = false;
                queueMicrotask(notify);
            }
        };

        const setState = (update) => {
            const nextState = { ...state, ...update };
            if (shallowEqual(state, nextState)) {
                return;
            }
            state = nextState;
            notify();
        };

        const subscribe = (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        };

        return {
            get state() { return state; },
            setState,
            subscribe
        };
    };


    const GithubReleaseEnhancer = {
        store: null,
        _observer: null,
        _globalClickHandler: null,
        _unsubscribe: null,
        _isInitialized: false,
        assetCache: new Map(),
        notesCollapser: null,

        // =================================================================================
        // [模块] 配置 (Config)
        // =================================================================================
        config: {
            RELEASE_NOTES_MAX_HEIGHT_DEFAULT: 300,
            DEBOUNCE_DELAY: 200,
            POPUP_LEAVE_CLOSE_DELAY: 300,
            STORAGE_KEY_SETTINGS: 'ghre_user_settings_v3.8',
            texts: {
                filterButton: { zh: '筛选', en: 'Filter' }, expandButton: { zh: '展开 ▾', en: 'Expand ▾' },
                collapseButton: { zh: '收起 ▴', en: 'Collapse ▴' }, settingsPanelTitle: { zh: '脚本设置 - GitHub Releases 优化', en: 'Settings - GitHub Releases Enhancer' },
                settingsSaveButton: { zh: '保存设置', en: 'Save Settings' }, settingsCancelButton: { zh: '取消', en: 'Cancel' },
                settingsBestMatchLabel: { zh: '启用“优胜劣汰” (有完美匹配时隐藏通用/兼容包)', en: 'Enable "Best Match" (Hide generic/compatible assets if perfect match exists)' },
                settingsMaxHeightLabel: { zh: '发布说明默认最大高度 (px):', en: 'Release Notes Default Max Height (px):' },
                settingsHiddenRuleLabel: { zh: "自定义隐藏关键字 (.开头为后缀, 否则为关键词, 词组需加''):", en: "Custom Hidden Keywords (. for suffix, keyword otherwise, use '' for phrases):" },
                settingsHiddenRulePlaceholder: { zh: "例如: .sig, debug, 'source code'", en: "e.g.: .sig, debug, 'source code'" },
                settingsClickOutsideLabel: { zh: '点击页面空白处收起发布说明', en: 'Click outside to collapse release notes' },
                platformFilterTitle: { zh: "平台筛选", en: "Platform Filters" },
                supplementaryFilterTitle: { zh: "补充筛选", en: "Supplementary Filters" }, selectAllLabel: { zh: '全选', en: 'Select All' },
                deselectAllLabel: { zh: '清空', en: 'Clear' }, restoreLabel: { zh: '恢复', en: 'Restore' },
                hiddenAssetCountTitle: { zh: "隐藏的资产数量", en: "Number of hidden assets" },
                activeFilterCountTitle: { zh: '已激活筛选规则数量', en: 'Number of active filters' },
                keywordLabel: { zh: '关键字', en: 'Keywords' },
                archLabel: { zh: '架构', en: 'Architecture' }, allArchLabel: { zh: '所有', en: 'all' },
                langLabel: { zh: '语言', en: 'Language' }, resLabel: { zh: '分辨率', en: 'Resolution' },
                sourceCodeLabel: { zh: '源码', en: 'Source Code' },
                settingsMenuName: { zh: 'GitHub Releases 优化设置', en: 'GitHub Releases Enhancer Settings' },
                filterModeLabel: { zh: '默认筛选模式', en: 'Default Filter Mode' },
                intelligentFilterLabel: { zh: '智能筛选', en: 'Intelligent Filter' },
                preferredFilterLabel: { zh: '偏好筛选', en: 'Preferred Filter' },
                savePrefsButton: { zh: '保存当前筛选为偏好', en: 'Save current filters as preference' },
                prefsSavedAlert: { zh: '偏好已保存！', en: 'Preferences saved!' },
                settingsResetButton: { zh: '重置设置', en: 'Reset Settings' },
                resetConfirmationTitle: { zh: '确认重置', en: 'Confirm Reset' },
                resetConfirmationMessage: { zh: '您确定要将所有设置恢复为默认值吗？此操作不可撤销，并将清空您保存的偏好筛选。', en: 'Are you sure you want to reset all settings to their default values? This action cannot be undone and will clear your saved filter preferences.' },
                resetConfirmButton: { zh: '确认重置', en: 'Confirm Reset' },
            },
            PLATFORMS: [
                { id: 'windows', name: 'Windows', exclusiveFormats: ['.exe', '.msi', '.msix'] },
                { id: 'macos', name: 'MacOS', exclusiveFormats: ['.dmg', '.pkg', '.app.zip', '.app.tar', '.app.tar.gz', '.app.7z'] },
                { id: 'linux', name: 'Linux', exclusiveFormats: ['.deb', '.rpm', '.appimage', '.flatpak', '.snap', '.tar.gz', '.tar', '.gz', '.bz2', '.xz', '.tar.xz', '.tar.bz2', '.tar.lz', '.pkg.zst'] },
                { id: 'android', name: 'Android', exclusiveFormats: ['.apk', '.aab'] },
                { id: 'ios', name: 'iOS', exclusiveFormats: ['.ipa'] },
                { id: 'other_os', name: '未匹配', exclusiveFormats: [] }
            ],
            ARCH_TAGS_CONFIG: [
                { id: 'x64', name: 'x64' },
                { id: 'x86', name: 'x86' },
                { id: 'arm64', name: 'ARM64' },
                { id: 'arm', name: 'ARM' },
                { id: 'oth', name: 'OTH' }
            ],
            SOURCE_CODE_KEYWORDS: ['source code (zip)', 'source code (tar.gz)'],
            HIDDEN_KEYWORDS_DEFAULT: [
                '.blockmap', '.rmp', '.sig', '.asc', '.sha256', '.md5', 'sha1', 'sha512',
                '.pdb', '.sym', '.debug', '.map', '.symbols', '.dSYM', 'vendor'
            ],
            AGNOSTIC_CONTAINERS: ['.zip', '.7z', '.rar'],
            LANGUAGES: {
                'zh-hans': { name: '简体中文', keywords: ['zh-cn', 'zh-hans', 'chinese simplified', 'chs', '简体', '简中'] },
                'zh-hant': { name: '繁體中文', keywords: ['zh-tw', 'zh-hk', 'zh-hant', 'chinese traditional', 'cht', '繁體', '正體', '繁中'] },
                'en': { name: 'English', keywords: ['en', 'english', 'eng'] }, 'fr': { name: 'Français', keywords: ['fr', 'french', 'français', 'fra'] },
                'de': { name: 'Deutsch', keywords: ['de', 'german', 'deutsch', 'ger', 'deu'] }, 'ru': { name: 'Русский', keywords: ['ru', 'russian', 'русский', 'rus'] },
                'ja': { name: '日本語', keywords: ['ja', 'japanese', '日本語', 'jpn', 'nihongo'] }, 'ko': { name: '한국어', keywords: ['ko', 'korean', '한국어', 'kor', 'hanguk'] },
                'it': { name: 'Italiano', keywords: ['it', 'italian', 'italiano', 'ita'] }, 'es': { name: 'Español', keywords: ['es', 'spanish', 'español', 'spa'] },
                'pt': { name: 'Português', keywords: ['pt', 'portuguese', 'português', 'por'] }, 'ar': { name: 'العربية', keywords: ['ar', 'arabic', 'العربية', 'ara'] }
            },
            RESOLUTIONS: {
                'hd': { name: 'HD', keywords: ['hd', '720p', '1080p', '1280x720', '1920x1080', 'fhd', '2k', '1440p', 'qhd', '4k', '2160p', 'uhd'] },
                'sd': { name: '常规', keywords: ['sd', '480p', '360p', 'standard definition'] }
            },
            CLASS_NAMES: {
                MARKDOWN_BODY: 'markdown-body', RELEASE_NOTES_PANEL: 'my-3', TOGGLE_BUTTON: 'toggle-button', EXPANDED: 'expanded', FILTER_CONTAINER: 'ghre-filter-interaction-wrapper',
                FILTER_BUTTON: 'ghre-filter-button', PLATFORM_OPTIONS: 'ghre-platform-options', PLATFORM_OPTIONS_INNER: 'ghre-platform-options-inner',
                PLATFORM_OPTIONS_GRID: 'ghre-platform-options-grid', PLATFORM_OPTIONS_OPEN: 'ghre-dropdown-open', PLATFORM_OPTION: 'ghre-platform-option',
                ARCH_TAG_CONTAINER: 'ghre-arch-tag-container', ARCH_TAG: 'ghre-arch-tag',
                KEYWORD_TOGGLE_OPTION: 'ghre-keyword-toggle-option', OPTIONS_SEPARATOR: 'ghre-options-separator', OPTIONS_TITLE: 'ghre-options-title', SELECTED: 'selected',
                HIDDEN_ASSET: 'hidden-asset', HIDDEN_ASSET_COUNTER: 'ghre-hidden-asset-counter', SUMMARY_MARKER_ICON: 'ghre-summary-marker-icon',
                AVAILABILITY_DOT: 'ghre-availability-dot', ACTION_BUTTON: 'ghre-action-button', SETTINGS_PANEL: 'ghre-settings-panel',
                SETTINGS_OVERLAY: 'ghre-settings-overlay', SETTINGS_TITLE: 'ghre-settings-title', SETTINGS_FORM_GROUP: 'ghre-form-group',
                SETTINGS_LABEL: 'ghre-settings-label', SETTINGS_INPUT: 'ghre-settings-input', SETTINGS_TEXTAREA: 'ghre-settings-textarea',
                SETTINGS_ACTIONS: 'ghre-settings-actions', SETTINGS_BUTTON: 'ghre-settings-button',
                ASSET_LIST_LOADING: 'ghre-assets-loading', POPUP_HEADER: 'ghre-popup-header',
                POPUP_SETTINGS_BTN: 'ghre-popup-settings-btn',
                RESET_CONFIRM_DIALOG: 'ghre-reset-confirm-dialog',
            },
            SELECTORS: {
                ASSET_ROW: '.Box-row, li.Box-row, .release-asset', ASSET_LIST_CONTAINER: '.Box--condensed ul, .release-assets',
                MAIN_CONTENT: 'main#main-content, main', ASSETS_SUMMARY: 'summary[data-target="details-toggle.summaryTarget"]',
                ASSET_DOWNLOAD_LINK: 'a[href*="/download/"]',
                MAIN_REPO_CONTENT: 'main .repository-content', FILTER_COUNTER: '[data-ghre-filter-counter="true"]',
                HIDDEN_ASSET_COUNTER: '.ghre-hidden-asset-counter', MAIN_ASSET_COUNTER: 'span.Counter:not(.ghre-hidden-asset-counter):not([data-ghre-filter-counter="true"])',
                SETTINGS_MAX_HEIGHT_INPUT: '#ghreMaxHeightInput', SETTINGS_HIDDEN_RULES_TEXTAREA: '#ghreHiddenRulesTextarea',
                SETTINGS_CLICK_OUTSIDE_CHECKBOX: '#ghreClickOutsideCheckbox',
                SETTINGS_SAVE_BUTTON: 'button[data-action="save"]', SETTINGS_CANCEL_BUTTON: 'button[data-action="cancel"]',
                SETTINGS_RESET_BUTTON: 'button[data-action="reset"]',
                FIRST_FOCUSABLE_OPTION: '[role="menuitemcheckbox"]',
            },
        },

        // =================================================================================
        // [模块] 图标 (Icons)
        // =================================================================================
        icons: {
            filter: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-filter mr-2"><path d="M.75 3h14.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1 0-1.5ZM3 7.75A.75.75 0 0 1 3.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 7.75Zm3 4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>`,
            checkbox_checked: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
            checkbox_unchecked: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>`,
            disclosure_triangle_right_svg: `<svg class="octicon octicon-triangle-right" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.427 4.427l3.396 3.396a.25.25 0 010 .354l-3.396 3.396A.25.25 0 016 11.396V4.604a.25.25 0 01.427-.177z"></path></svg>`,
            gear: `<svg aria-hidden="true" focusable="false" class="octicon octicon-gear" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;"><path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644-.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815.806c.081-.08.073-.159-.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113-.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path></svg>`,
        },

        // =================================================================================
        // [模块] 规则与定义 (Rules & Definitions)
        // =================================================================================
        platformArchRules: {
            windows: { name: 'Windows', keywords: ['windows', 'win', 'win10', 'win11', 'win32'], arch: { x64: ['win64', 'x64', 'amd64', 'x86_64'], x86: ['win32', 'x86', 'ia32', 'i386', 'i686', '386'], arm64: ['arm64'], oth: ['avx', 'avx2', 'avx512', 'sse', 'sse2', 'sse3', 'ssse3', 'sse4', 'sse4.1', 'sse4.2'] } },
            macos: { name: 'MacOS', keywords: ['mac', 'macos', 'osx', 'darwin', 'universal'], arch: { x64: ['x64', 'amd64', 'intel', 'x86_64'], arm64: ['arm64', 'aarch64', 'apple', 'universal'] } },
            linux: { name: 'Linux', keywords: ['linux', 'alpine'], arch: { x64: ['x64', 'amd64', 'x86_64'], x86: ['x86', 'i386', 'i686', '386'], arm64: ['arm64', 'aarch64'], arm: ['armv7', 'armv6', 'armv5', 'armhf'] , oth:['risc-v', 'riscv', 'riscv64', 'powerpc', 'ppc64le', 'power', 'mips', 'mips64', 'mipsle', 's390x', 'loong64', 'avx', 'avx2', 'avx512', 'sse', 'sse2', 'sse3', 'ssse3'] } },
            android: { name: 'Android', keywords: ['android'], arch: { arm64: ['arm64', 'arm64-v8a', 'aarch64'], arm: ['armeabi', 'armeabi-v7a'], x64: ['x64', 'x86_64', 'amd64'], x86: ['x86'] } },
            ios: { name: 'iOS', keywords: ['ios'], arch: { arm64: ['arm64', 'aarch64'], arm: ['arm'] } },
            other_os: { name: 'Other OS', keywords: ['freebsd', 'netbsd', 'openbsd', 'solaris', 'plan9', 'sunos', 'bsd', 'aix', 'ppc64'] }
        },

        // =================================================================================
        // [模块] 工具函数 (Utils)
        // =================================================================================
        utils: {
            keywordRegexCache: new Map(),
            maxCacheSize: 100,

            createElement(tag, options = {}) {
                try {
                    const el = document.createElement(tag);
                    for (const key in options) {
                        if (key === 'className') { el.className = options[key]; }
                        else if (key === 'textContent') { el.textContent = options[key]; }
                        else if (key === 'style') { Object.assign(el.style, options[key]); }
                        else if (key === 'dataset') { for (const dataKey in options.dataset) { el.dataset[dataKey] = options.dataset[dataKey]; } }
                        else { el.setAttribute(key, options[key]); }
                    }
                    return el;
                } catch (error) {
                    console.error(`[GitHub Filter] Failed to create element <${tag}>:`, error);
                    return null;
                }
            },
            getText(key) {
                const GRE = GithubReleaseEnhancer;
                const textObject = GRE.config.texts[key];
                if (!textObject) return key;
                return textObject[GRE.store.state.isChinese ? 'zh' : 'en'] || textObject.en || key;
            },
            escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            },
            getKeywordRegex(kw) {
                if (kw.length > 100) return /(?!)/;

                let regex = this.keywordRegexCache.get(kw);
                if (regex) return regex;

                regex = new RegExp(`(^|[^a-z0-9])${this.escapeRegExp(kw)}([^a-z0-9]|$)`, 'i');

                if (this.keywordRegexCache.size >= this.maxCacheSize) {
                    const oldestKey = this.keywordRegexCache.keys().next().value;
                    this.keywordRegexCache.delete(oldestKey);
                }
                this.keywordRegexCache.set(kw, regex);
                return regex;
            },
            checkPageType() {
                GithubReleaseEnhancer.store.setState({
                    isMainReleasesPage: /^\/[^/]+\/[^/]+\/releases\/?(?:[?#]|$)/.test(window.location.pathname)
                });
            },
            getCurrentPlatform() {
                try { if (navigator.userAgentData && navigator.userAgentData.platform) { const d = navigator.userAgentData.platform.toLowerCase(); if (d.includes('win')) return 'windows'; if (d.includes('mac')) return 'macos'; if (d.includes('linux')) return 'linux'; if (d.includes('android')) return 'android'; if (d.includes('iphone') || d.includes('ipad') || d.includes('ipod') || d.includes('ios')) return 'ios'; } } catch (e) { /* ignore */ }
                const p = (navigator.platform || '').toLowerCase(); const u = (navigator.userAgent || '').toLowerCase();
                if (p.startsWith('win')) return 'windows'; if (p.startsWith('mac') || p.includes('darwin')) return 'macos'; if (p.startsWith('linux') || p.includes('freebsd')) return 'linux'; if (u.includes('android')) return 'android'; if (u.includes('iphone') || u.includes('ipad') || u.includes('ipod') || p.includes('iphone') || p.includes('ipad') || p.includes('ipod')) return 'ios'; return 'unknown';
            },
            async getCurrentArchitecture() {
                try { if (navigator.userAgentData?.getHighEntropyValues) { const d = await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness']); const a = d.architecture; const b = d.bitness; if (a === 'arm') return b === '64' ? 'arm64' : 'arm'; if (a === 'x86') return b === '64' ? 'x64' : 'x86'; if (a) return a; } } catch (e) { /* ignore */ }
                const p = (navigator.platform || '').toLowerCase(); const u = (navigator.userAgent || '').toLowerCase();
                if (u.includes('arm64') || u.includes('aarch64') || p.includes('arm64') || p.includes('aarch64') || u.includes('armv8')) return 'arm64'; if (u.includes('win64') || u.includes('x64') || u.includes('amd64') || p.includes('64')) return 'x64'; if (u.includes('x86') || p.includes('win32') || p.includes('i386') || p.includes('i686')) { if (!u.includes('x64') && !p.includes('64')) return 'x86'; } if (u.includes('arm') || p.includes('armv7') || p.includes('armhf')) { if (!u.includes('arm64') && !p.includes('arm64')) return 'arm'; } return 'unknown';
            },
            getCurrentLanguage() {
                const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
                for (const langCode in GithubReleaseEnhancer.config.LANGUAGES) {
                    if (GithubReleaseEnhancer.config.LANGUAGES[langCode].keywords.some(kw => lang.startsWith(kw) || lang === kw)) {
                        return langCode;
                    }
                }
                if (lang.startsWith('zh-cn') || lang === 'zh-hans') return 'zh-hans';
                if (lang.startsWith('zh-tw') || lang.startsWith('zh-hk') || lang === 'zh-hant') return 'zh-hant';
                return lang.split('-')[0];
            },
            getCurrentResolutionCategory() {
                const height = window.screen.height;
                if (height >= 720) return 'hd';
                return 'sd';
            },
            parseAssetInfo(text) {
                try {
                    const GRE = GithubReleaseEnhancer;
                    const lowerText = text.replace(/\s+/g, ' ').trim().toLowerCase();
                    const isAgnosticContainer = GRE.config.AGNOSTIC_CONTAINERS.some(ext => lowerText.endsWith(ext));

                    const isSourceCode = GRE.config.SOURCE_CODE_KEYWORDS.includes(lowerText);
                    if (isSourceCode) {
                        return { platform: null, architecture: null, language: null, resolution: null, isSourceCode: true, isByKeyword: false, isAgnosticContainer: false };
                    }

                    const isByKeyword = GRE.core.assetFilter.isHiddenAsset(text, GRE.store.state.hiddenKeywords);
                    let textForDetection = lowerText;
                    if (isByKeyword) {
                        textForDetection = lowerText.replace(/(\.sig|\.asc|\.sha\d+|\.md5|\.blockmap)$/, '');
                    }

                    let detectedPlatform = null, detectedArch = null,
                        detectedLang = null, detectedRes = null;

                    for (const platform of GRE.config.PLATFORMS) {
                        if (platform.exclusiveFormats.some(ext => textForDetection.endsWith(ext))) {
                            detectedPlatform = platform.id;
                            break;
                        }
                    }
                    if (!detectedPlatform) {
                        for (const platformId in GRE.platformArchRules) {
                            const platformRule = GRE.platformArchRules[platformId];
                            if (platformRule.keywords.some(kw => this.getKeywordRegex(kw).test(textForDetection))) {
                                detectedPlatform = platformId;
                                break;
                            }
                        }
                    }

                    const archRules = detectedPlatform ? GRE.platformArchRules[detectedPlatform]?.arch : null;
                    if (archRules) {
                        const archCheckOrder = ['arm64', 'x64', 'x86', 'arm', 'oth'];
                        for (const archKey of archCheckOrder) {
                            if (Object.prototype.hasOwnProperty.call(archRules, archKey)) {
                                const keywords = archRules[archKey];
                                if (keywords.some(kw => {
                                    if (archKey === 'x86' && (this.getKeywordRegex('x64').test(textForDetection) || this.getKeywordRegex('amd64').test(textForDetection) || this.getKeywordRegex('x86_64').test(textForDetection))) return false;
                                    if (archKey === 'arm' && (this.getKeywordRegex('arm64').test(textForDetection) || this.getKeywordRegex('aarch64').test(textForDetection))) return false;
                                    return this.getKeywordRegex(kw).test(textForDetection);
                                })) {
                                    detectedArch = archKey;
                                    break;
                                }
                            }
                        }
                    }

                    if (!detectedArch) {
                        if (!this._cachedGeneralArchMap) {
                            const map = {};
                            const allArchKeys = new Set();
                            Object.values(GRE.platformArchRules).forEach(rule => {
                                if (rule.arch) {
                                    Object.keys(rule.arch).forEach(archKey => {
                                        if (!map[archKey]) map[archKey] = new Set();
                                        rule.arch[archKey].forEach(kw => map[archKey].add(kw));
                                        allArchKeys.add(archKey);
                                    });
                                }
                            });
                            const priorityOrder = ['arm64', 'x64', 'x86', 'arm', 'oth'];
                            const finalMap = {};
                            priorityOrder.forEach(key => { if (map[key]) finalMap[key] = Array.from(map[key]); });
                            allArchKeys.forEach(key => { if (!priorityOrder.includes(key) && map[key]) finalMap[key] = Array.from(map[key]); });

                            this._cachedGeneralArchMap = finalMap;
                            this._cachedArchDetectionOrder = priorityOrder.filter(k => finalMap[k]);
                        }

                        for (const arch of this._cachedArchDetectionOrder) {
                            if (this._cachedGeneralArchMap[arch].some(kw => {
                                const regex = this.getKeywordRegex(kw);
                                if (kw === 'win32' && (this.getKeywordRegex('x64').test(textForDetection) || this.getKeywordRegex('amd64').test(textForDetection))) return false;
                                if (arch === 'x86' && kw !== 'win32' && (this.getKeywordRegex('x64').test(textForDetection) || this.getKeywordRegex('amd64').test(textForDetection))) return false;
                                if (arch === 'arm' && (this.getKeywordRegex('arm64').test(textForDetection) || this.getKeywordRegex('aarch64').test(textForDetection))) return false;
                                return regex.test(textForDetection);
                            })) {
                                detectedArch = arch;
                                break;
                            }
                        }
                    }

                    if (detectedPlatform === 'macos' && (this.getKeywordRegex('apple').test(textForDetection) || this.getKeywordRegex('universal').test(textForDetection))) detectedArch = 'arm64';

                    for (const langCode in GRE.config.LANGUAGES) {
                        if (GRE.config.LANGUAGES[langCode].keywords.some(kw => this.getKeywordRegex(kw).test(textForDetection))) {
                            detectedLang = langCode;
                            break;
                        }
                    }
                    for (const resCode in GRE.config.RESOLUTIONS) {
                        if (GRE.config.RESOLUTIONS[resCode].keywords.some(kw => this.getKeywordRegex(kw).test(textForDetection))) {
                            detectedRes = resCode;
                            break;
                        }
                    }
                    return { platform: detectedPlatform, architecture: detectedArch, language: detectedLang, resolution: detectedRes, isSourceCode: false, isByKeyword: isByKeyword, isAgnosticContainer };
                } catch (error) {
                    console.error(`[GitHub Filter@${location.pathname}] Error parsing asset info:`, error, 'Input text:', text);
                    return { platform: null, architecture: null, language: null, resolution: null, isSourceCode: false, isByKeyword: false, isAgnosticContainer: false };
                }
            },
            getBestMatchScore(info, state) {
                if (state.selectedArchs.size > 0) {
                    if (state.selectedArchs.has(info.architecture)) return 10;
                    return 0;
                }

                if (state.selectedPlatforms.size > 0) {
                    return 10;
                }
                return 0;
            },
            getNormalizedGroupName(name) {
                const GRE = GithubReleaseEnhancer;

                if (!this._cachedGroupingKeywords) {
                    const keywordSet = new Set();

                    Object.values(GRE.platformArchRules).forEach(platform => {
                        platform.keywords.forEach(k => keywordSet.add(k));
                        if (platform.arch) {
                            Object.values(platform.arch).forEach(archList => {
                                archList.forEach(k => keywordSet.add(k));
                            });
                        }
                    });

                    this._cachedGroupingKeywords = Array.from(keywordSet).sort((a, b) => b.length - a.length);
                }

                let lower = name.toLowerCase();

                this._cachedGroupingKeywords.forEach(kw => {
                     const regex = new RegExp(`(^|[^a-z0-9])${GRE.utils.escapeRegExp(kw)}([^a-z0-9]|$)`, 'g');
                     lower = lower.replace(regex, '$1$2').replace(regex, '$1$2');
                });

                lower = lower.replace(/[._-]{2,}/g, '.').replace(/^[._-]+|[._-]+$/g, '');
                return lower;
            },
        },

        // =================================================================================
        // [模块] UI 相关 (UI)
        // =================================================================================
        ui: {
            styles: {
                commonStylesTemplate() {
                    const GRE = GithubReleaseEnhancer; const C = GRE.config; const CN = C.CLASS_NAMES;
                    return `
                        :root { --ghre-notes-max-height: ${GRE.store.state.releaseNotesMaxHeight || C.RELEASE_NOTES_MAX_HEIGHT_DEFAULT}px; }
                        .${CN.FILTER_CONTAINER} { position: relative; display: inline-flex; align-items: center; margin-left: auto; }
                        .${CN.PLATFORM_OPTIONS} { background-color: var(--overlay-bgColor); border: 0; border-radius: var(--borderRadius-large); box-shadow: var(--shadow-floating-small); position: absolute; right: 0; top: 100%; margin-top: 4px; z-index: 100; display: none; width: max-content; min-width: 280px; }
                        .${CN.PLATFORM_OPTIONS_INNER} { max-height: 400px; overflow-y: auto; padding: 4px; display: flex; flex-direction: column; gap: 2px; }
                        .${CN.POPUP_HEADER} { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; }
                        .${CN.POPUP_SETTINGS_BTN} { background: none; border: none; cursor: pointer; color: var(--fgColor-muted); padding: 4px; line-height: 0; border-radius: 4px; }
                        .${CN.POPUP_SETTINGS_BTN}:hover { background-color: var(--bgColor-muted); color: var(--fgColor-default); }
                        .${CN.PLATFORM_OPTIONS_GRID} { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px 8px; }
                        .${CN.FILTER_CONTAINER}.${CN.PLATFORM_OPTIONS_OPEN} .${CN.PLATFORM_OPTIONS} { display: block; }
                        .${CN.OPTIONS_TITLE} { padding: 4px 8px; font-size: 12px; font-weight: bold; color: var(--fgColor-muted); text-transform: uppercase; display: block; pointer-events: none; grid-column: 1 / -1; }
                        .ghre-action-buttons-container { grid-column: 1 / -1; display: flex; gap: 8px; padding: 2px 8px; }
                        .${CN.ACTION_BUTTON} { flex: 1 1 0; padding: 5px; font-size: 12px; }
                        ${C.SELECTORS.ASSETS_SUMMARY} { display: flex !important; align-items: center !important; width: 100%; }
                        .${CN.SUMMARY_MARKER_ICON} { margin-right: 4px; transition: transform 0.15s ease-in-out; flex-shrink: 0; display: inline-flex; align-items: center; color: var(--fgColor-muted); }
                        details[open] > summary .${CN.SUMMARY_MARKER_ICON} { transform: rotate(90deg); }
                        .${CN.HIDDEN_ASSET_COUNTER} { margin-left: 4px; }
                        .${CN.MARKDOWN_BODY}.${CN.RELEASE_NOTES_PANEL} { position: relative; max-height: var(--ghre-notes-max-height); overflow: hidden; transition: max-height 0.3s ease-in-out; padding-bottom: 40px; }
                        .${CN.MARKDOWN_BODY}.${CN.RELEASE_NOTES_PANEL}.${CN.EXPANDED} { max-height: none; padding-bottom: 0; }
                        .${CN.TOGGLE_BUTTON} { position: absolute; bottom: 0; left: 0; right: 0; width: 100%; height: 40px; box-sizing: border-box; padding: 10px; margin: 0; text-align: center; cursor: pointer; font-weight: var(--font-weight-bold, 600); color: var(--fgColor-accent); background: none; border: none; }
                        .${CN.MARKDOWN_BODY}.${CN.RELEASE_NOTES_PANEL}:not(.${CN.EXPANDED}) .${CN.TOGGLE_BUTTON} { background: linear-gradient(to top, var(--bgColor-default), transparent); }
                        .${CN.MARKDOWN_BODY}.${CN.RELEASE_NOTES_PANEL}.${CN.EXPANDED} .${CN.TOGGLE_BUTTON} { position: static; margin-top: 16px; height: auto; padding: 8px 0; border-top: 1px solid var(--borderColor-default); }
                        .${CN.TOGGLE_BUTTON}:hover { text-decoration: underline; }
                        .${CN.PLATFORM_OPTION}, .${CN.KEYWORD_TOGGLE_OPTION} { display: flex; align-items: center; font-size: 13px; color: var(--fgColor-default); white-space: nowrap; cursor: pointer; padding: 4px 8px; gap: 6px; transition: background-color 0.1s ease, color 0.1s ease; border-radius: 4px; }
                        .${CN.PLATFORM_OPTION}:hover, .${CN.KEYWORD_TOGGLE_OPTION}:hover { background-color: var(--bgColor-accent-muted); }
                        .${CN.PLATFORM_OPTION}.${CN.SELECTED}, .${CN.KEYWORD_TOGGLE_OPTION}.${CN.SELECTED} { background-color: var(--bgColor-accent-emphasis); color: var(--fgColor-onEmphasis); font-weight: var(--font-weight-bold, 600); }
                        .${CN.PLATFORM_OPTION} svg, .${CN.KEYWORD_TOGGLE_OPTION} svg { width: 16px; height: 16px; flex-shrink: 0; color: var(--fgColor-muted); }
                        .${CN.PLATFORM_OPTION}.${CN.SELECTED} svg, .${CN.KEYWORD_TOGGLE_OPTION}.${CN.SELECTED} svg { color: var(--fgColor-onEmphasis); }
                        .${CN.AVAILABILITY_DOT} { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-left: auto; }
                        .${CN.AVAILABILITY_DOT}[data-available="true"] { background-color: var(--bgColor-success-emphasis); }
                        .${CN.AVAILABILITY_DOT}[data-available="false"] { background-color: var(--bgColor-danger-emphasis); }
                        .${CN.PLATFORM_OPTION}[data-available="false"], .${CN.KEYWORD_TOGGLE_OPTION}[data-available="false"] { color: var(--fgColor-disabled); cursor: not-allowed; pointer-events: none; opacity: 0.7; }
                        .${CN.PLATFORM_OPTION}[data-available="false"]:hover, .${CN.KEYWORD_TOGGLE_OPTION}[data-available="false"]:hover { background-color: transparent; }
                        .${CN.OPTIONS_SEPARATOR} { border-top: 1px solid var(--borderColor-muted); margin: 4px 0; grid-column: 1 / -1; }
                        .${CN.ARCH_TAG_CONTAINER} { display: flex; flex-wrap: wrap; justify-content: space-around; gap: 6px; padding: 4px 8px 2px 8px; grid-column: 1 / -1; }
                        .${CN.ARCH_TAG} { flex-grow: 1; text-align: center; padding: 4px 8px; border: 1px solid var(--borderColor-muted); border-radius: 20px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; user-select: none; }
                        .${CN.ARCH_TAG}:hover { border-color: var(--fgColor-accent); }
                        .${CN.ARCH_TAG}.${CN.SELECTED} { background-color: var(--bgColor-accent-emphasis); color: var(--fgColor-onEmphasis); border-color: var(--bgColor-accent-emphasis); font-weight: 600; }
                        .${CN.ARCH_TAG}[data-available="false"] { color: var(--fgColor-disabled); border-color: var(--borderColor-default); background-color: var(--bgColor-disabled); cursor: not-allowed; pointer-events: none; opacity: 0.6; }
                        .${CN.HIDDEN_ASSET} { display: none !important; visibility: hidden !important; height: 0 !important; margin:0 !important; padding: 0 !important; border: none !important; opacity:0 !important; overflow: hidden !important; }
                        .${CN.SETTINGS_OVERLAY} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--overlay-backdrop-bgColor, rgba(0,0,0,0.5)); z-index: 2000; display: flex; align-items: center; justify-content: center; }
                        .${CN.SETTINGS_PANEL} { position: relative; background-color: var(--overlay-bgColor); padding: 24px; border: 0; border-radius: 12px; box-shadow: var(--shadow-floating-large); min-width: 300px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
                        .${CN.SETTINGS_TITLE} { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: var(--fgColor-default); }
                        .${CN.SETTINGS_FORM_GROUP} { margin-bottom: 16px; } .${CN.SETTINGS_LABEL} { display: block; margin-bottom: 8px; font-weight: normal; color: var(--fgColor-muted); }
                        .ghre-checkbox-group, .ghre-radio-group { display: flex; align-items: center; gap: 8px; }
                        .ghre-radio-group-container { display: flex; flex-direction: row; align-items: center; gap: 16px; flex-wrap: wrap; }
                        .ghre-pref-group { display: flex; align-items: center; gap: 4px; }
                        .${CN.SETTINGS_INPUT}, .${CN.SETTINGS_TEXTAREA} { width: 100%; padding: 8px 12px; background-color: var(--bgColor-default); border-color: var(--borderColor-default); border-radius: 6px; border-style: solid; border-width: 1px; box-sizing: border-box; color: var(--fgColor-default); }
                        .${CN.SETTINGS_TEXTAREA} { min-height: 60px; resize: vertical; } .${CN.SETTINGS_ACTIONS} { margin-top: 24px; display: flex; justify-content: flex-end; gap: 8px; }
                        .${CN.SETTINGS_BUTTON} { }
                        .${CN.RESET_CONFIRM_DIALOG} { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: var(--bgColor-default); border: 1px solid var(--borderColor-danger); border-radius: 8px; box-shadow: var(--shadow-floating-large); padding: 16px; width: 90%; max-width: 400px; z-index: 2001; display: flex; flex-direction: column; gap: 12px; }
                        .ghre-confirm-title { font-size: 16px; font-weight: 600; color: var(--fgColor-danger); }
                        .ghre-confirm-message { font-size: 14px; color: var(--fgColor-default); }
                        .ghre-confirm-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
                        ${C.SELECTORS.ASSET_LIST_CONTAINER}.${CN.ASSET_LIST_LOADING} { opacity: 0; transition: opacity 0.2s ease-in-out !important; }
                        ${C.SELECTORS.ASSET_LIST_CONTAINER} { opacity: 1; transition: opacity 0.2s ease-in-out !important; }
                        @media (max-width: 768px) { .${CN.SETTINGS_PANEL} { width: 95%; padding: 16px; } }
                    `;
                },
                addStyleElement(id, css) { try { const attr = `data-ghre-style-${id}`; let styleElement = document.head.querySelector(`style[${attr}]`); if (!styleElement) { styleElement = GithubReleaseEnhancer.utils.createElement('style', { 'data-ghre-style-id': id, textContent: css }); document.head.appendChild(styleElement); } else if (styleElement.textContent !== css) { styleElement.textContent = css; } } catch (e) { console.error(`[GitHub Filter@${location.pathname}] Error adding styles:`, e); } },
                addGlobalStyles() { this.addStyleElement('common', this.commonStylesTemplate()); },
                updateMaxHeightVar(height) { document.documentElement.style.setProperty('--ghre-notes-max-height', `${height}px`); }
            },
        },

        // =================================================================================
        // [模块] 核心逻辑 (Core)
        // =================================================================================
        core: {
            releaseNotes: {
                initializeExpansion() {
                    const GRE = GithubReleaseEnhancer;
                    const { releaseNotesMaxHeight } = GRE.store.state;
                    document.querySelectorAll(`.${GRE.config.CLASS_NAMES.MARKDOWN_BODY}.${GRE.config.CLASS_NAMES.RELEASE_NOTES_PANEL}`).forEach(p => {
                        const b = p.querySelector(`.${GRE.config.CLASS_NAMES.TOGGLE_BUTTON}`);
                        if (b) b.remove();
                        if (p.offsetParent !== null && p.scrollHeight > (releaseNotesMaxHeight || GRE.config.RELEASE_NOTES_MAX_HEIGHT_DEFAULT) ) {
                            const tb = this.createToggleButton();
                            this.updateToggleButtonText(p, tb);
                            tb.addEventListener('click', this.handleToggleClick.bind(this));
                            p.appendChild(tb); p.style.position = 'relative';
                        } else {
                            p.classList.remove(GRE.config.CLASS_NAMES.EXPANDED);
                            if (p.style.position === 'relative') p.style.position = '';
                        }
                    });
                },
                handleToggleClick(e) {
                    const b = e.currentTarget;
                    const p = b.closest(`.${GithubReleaseEnhancer.config.CLASS_NAMES.MARKDOWN_BODY}.${GithubReleaseEnhancer.config.CLASS_NAMES.RELEASE_NOTES_PANEL}`);
                    if (p) {
                         p.classList.toggle(GithubReleaseEnhancer.config.CLASS_NAMES.EXPANDED);
                         this.updateToggleButtonText(p, b);
                         const isNowExpanded = p.classList.contains(GithubReleaseEnhancer.config.CLASS_NAMES.EXPANDED);
                         if (isNowExpanded) {
                             GithubReleaseEnhancer.notesCollapser.initForPanel(p);
                         } else {
                             GithubReleaseEnhancer.notesCollapser.cleanup();
                             const releaseContainer = p.closest('div.Box');
                             if(releaseContainer) {
                                releaseContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                             }
                         }
                    }
                },
                createToggleButton() {
                    return GithubReleaseEnhancer.utils.createElement('button', { type: 'button', className: GithubReleaseEnhancer.config.CLASS_NAMES.TOGGLE_BUTTON, 'aria-expanded': 'false' });
                },
                updateToggleButtonText(p, b) {
                    const GRE = GithubReleaseEnhancer;
                    const isExp = p.classList.contains(GRE.config.CLASS_NAMES.EXPANDED);
                    b.textContent = isExp ? GRE.utils.getText('collapseButton') : GRE.utils.getText('expandButton');
                    b.setAttribute('aria-expanded', isExp.toString());
                },
            },
            assetFilter: {
                getParsedAssets() {
                    const GRE = GithubReleaseEnhancer;
                    const cacheKey = window.location.pathname;
                    if (GRE.assetCache.has(cacheKey)) {
                        return GRE.assetCache.get(cacheKey);
                    }

                    try {
                        const S = GRE.config.SELECTORS;
                        const allAssetElements = Array.from(document.querySelectorAll(S.ASSET_ROW));

                        const initialParsedAssets = allAssetElements.map(assetElement => {
                            const assetLink = assetElement.querySelector(S.ASSET_DOWNLOAD_LINK);
                            let assetName;
                            if (assetLink) {
                                assetName = assetLink.textContent;
                            } else {
                                assetName = assetElement.querySelector('a')?.textContent || '';
                            }

                            if (!assetName) return { element: assetElement, name: null, info: {} };

                            const assetInfo = GRE.utils.parseAssetInfo(assetName);
                            return { element: assetElement, name: assetName, info: assetInfo };
                        });

                        const explicitPlatforms = new Set();
                        initialParsedAssets.forEach(({ info }) => {
                            if (info.platform && info.platform !== 'other_os') {
                                explicitPlatforms.add(info.platform);
                            }
                        });

                        let inferredPlatform = null;
                        if (explicitPlatforms.size === 1) {
                            inferredPlatform = explicitPlatforms.values().next().value;
                        }

                        if (inferredPlatform) {
                            const correctedAssets = initialParsedAssets.map(asset => {
                                if (asset.info.platform === null && asset.info.isAgnosticContainer) {
                                    const correctedInfo = { ...asset.info, platform: inferredPlatform };
                                    return { ...asset, info: correctedInfo };
                                }
                                return asset;
                            });

                            GRE.assetCache.set(cacheKey, correctedAssets);
                            return correctedAssets;
                        }

                        GRE.assetCache.set(cacheKey, initialParsedAssets);
                        return initialParsedAssets;

                    } catch (error) {
                         console.error(`[GitHub Filter@${location.pathname}] Error in getParsedAssets:`, error);
                         return [];
                    }
                },
                isHiddenAsset(name, patterns) {
                    const lowerName = name.replace(/\s+/g, ' ').trim().toLowerCase();
                    return patterns.some(pattern => {
                        const lowerPattern = pattern.toLowerCase();
                        if (lowerPattern.startsWith('.')) {
                            return lowerName.endsWith(lowerPattern);
                        }
                        return lowerName.includes(lowerPattern);
                    });
                },
                preScanAssetsForAvailableFilters() {
                    const GRE = GithubReleaseEnhancer;
                    const parsedAssets = this.getParsedAssets();
                    const availableFilters = new Set();
                    const masterAvailableArchs = new Set();
                    let hasAssetsWithoutPlatform = false;

                    parsedAssets.forEach(({ name: assetName, info: assetInfo }) => {
                        if (!assetName) return;
                        if (assetInfo.isSourceCode) {
                             availableFilters.add('source');
                        } else if (this.isHiddenAsset(assetName, GRE.store.state.hiddenKeywords)) {
                            availableFilters.add('keyword');
                        } else if (assetInfo.platform) {
                            availableFilters.add(assetInfo.platform);
                        } else {
                            hasAssetsWithoutPlatform = true;
                        }
                        if (assetInfo.architecture) {
                            masterAvailableArchs.add(assetInfo.architecture);
                        }
                        if (assetInfo.language) availableFilters.add('language');
                        if (assetInfo.resolution) availableFilters.add('resolution');
                    });
                    if (hasAssetsWithoutPlatform) {
                        availableFilters.add('other_os');
                    }
                    GRE.store.setState({ availableFilters, availableArchs: masterAvailableArchs, masterAvailableArchs });
                },
                updateAvailabilityMarkers(state) {
                    const GRE = GithubReleaseEnhancer;
                    const optionsContainer = state.filterUIInstance?.querySelector(`.${GRE.config.CLASS_NAMES.PLATFORM_OPTIONS_GRID}`);
                    if (!optionsContainer) return;
                    optionsContainer.querySelectorAll(`[data-platform-id], [data-filter-type]`).forEach(el => {
                        const id = el.dataset.platformId || el.dataset.filterType;
                        const isAvailable = state.availableFilters.has(id);
                        el.setAttribute('data-available', isAvailable.toString());
                        let dot = el.querySelector(`.${GRE.config.CLASS_NAMES.AVAILABILITY_DOT}`);
                        if (!dot) {
                            dot = GRE.utils.createElement('span', { className: GRE.config.CLASS_NAMES.AVAILABILITY_DOT });
                            el.appendChild(dot);
                        }
                        dot.setAttribute('data-available', isAvailable.toString());
                        dot.title = isAvailable ? (state.isChinese ? "可用" : "Available") : (state.isChinese ? "不可用" : "Unavailable");
                    });
                },
                initialize() {
                    const GRE = GithubReleaseEnhancer;
                    this.ensureUIVisible();
                    const S = GRE.config.SELECTORS;
                    const el = document.querySelector(`${S.ASSET_LIST_CONTAINER}, ${S.ASSETS_SUMMARY}`);
                    if (el) {
                       const assetList = document.querySelector(S.ASSET_LIST_CONTAINER);
                       if (assetList) {
                           assetList.classList.add(GRE.config.CLASS_NAMES.ASSET_LIST_LOADING);
                       }
                       this.handleAssetLoad();
                    } else {
                        const o = new MutationObserver((_, obs) => {
                            if (document.querySelector(`${S.ASSET_LIST_CONTAINER}, ${S.ASSETS_SUMMARY}`)) {
                                this.handleAssetLoad();
                                obs.disconnect();
                            }
                        });
                        o.observe(document.body, { childList: true, subtree: true });
                    }
                },
                handleAssetLoad() {
                    const GRE = GithubReleaseEnhancer;
                    GRE.assetCache.delete(window.location.pathname);
                    this.preScanAssetsForAvailableFilters();
                    GRE.actions.initializeFilterStates();
                },
                ensureUIVisible() {
                    const GRE = GithubReleaseEnhancer;
                    if (GRE.store.state.isMainReleasesPage) return;
                    if (!GRE.store.state.filterUIInstance || !document.body.contains(GRE.store.state.filterUIInstance)) {
                        GRE.store.setState({ filterUIInstance: this.createUI() });
                    }
                },
                summaryCaptureListener: function(event) {
                    const GRE = GithubReleaseEnhancer;
                    if (event.target.closest(`.${GRE.config.CLASS_NAMES.FILTER_CONTAINER}`)) {
                        event.preventDefault();
                    }
                },
                closePopup() {
                    const GRE = GithubReleaseEnhancer;
                    if (!GRE.store.state.isDropdownOpen) return;
                    const wrapper = GRE.store.state.filterUIInstance;
                    if (wrapper) {
                        wrapper.classList.remove(GRE.config.CLASS_NAMES.PLATFORM_OPTIONS_OPEN);
                        const filterButton = wrapper.querySelector(`.${GRE.config.CLASS_NAMES.FILTER_BUTTON}`);
                        if (filterButton) {
                             filterButton.setAttribute('aria-expanded', 'false');
                             filterButton.focus();
                        }
                    }
                    GRE.store.setState({ isDropdownOpen: false });
                },
                handleGlobalClick(event) {
                    const GRE = GithubReleaseEnhancer;
                    if (GRE.store.state.isDropdownOpen && GRE.store.state.filterUIInstance && !GRE.store.state.filterUIInstance.contains(event.target)) {
                        this.closePopup();
                    }
                },
                createUI() {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN, SELECTORS: S } = GRE.config;
                    const { icons } = GRE;
                    const { createElement } = GRE.utils;
                    try {
                        let assetsSummary = document.querySelector(S.ASSETS_SUMMARY);
                        if (!assetsSummary) return null;
                        assetsSummary.querySelector(`.${CN.SUMMARY_MARKER_ICON}`)?.remove();
                        assetsSummary.querySelector(`.${CN.FILTER_CONTAINER}`)?.remove();
                        Object.assign(assetsSummary.style, { display: 'flex', alignItems: 'center' });
                        const newMarkerSvgSpan = createElement('span', { className: CN.SUMMARY_MARKER_ICON });
                        newMarkerSvgSpan.innerHTML = icons.disclosure_triangle_right_svg;
                        assetsSummary.insertBefore(newMarkerSvgSpan, assetsSummary.firstChild);
                        const filterInteractionWrapper = createElement('div', { className: CN.FILTER_CONTAINER, style: { marginLeft: 'auto', display: 'inline-flex' } });
                        filterInteractionWrapper.appendChild(this.createFilterButton());
                        filterInteractionWrapper.appendChild(this.createPlatformOptions());
                        assetsSummary.appendChild(filterInteractionWrapper);
                        let hiddenCounterElement = assetsSummary.querySelector(S.HIDDEN_ASSET_COUNTER);
                        if (!hiddenCounterElement) {
                            hiddenCounterElement = createElement('span', { className: `Counter ml-1 ${CN.HIDDEN_ASSET_COUNTER}`, title: GRE.utils.getText('hiddenAssetCountTitle'), style: { display: 'none' } });
                            assetsSummary.insertBefore(hiddenCounterElement, filterInteractionWrapper);
                        }
                        assetsSummary.removeEventListener('click', GRE.core.assetFilter.summaryCaptureListener, true);
                        assetsSummary.addEventListener('click', GRE.core.assetFilter.summaryCaptureListener, true);
                        return filterInteractionWrapper;
                    } catch (e) { console.error(`[GitHub Filter@${location.pathname}] Error creating filter UI:`, e); return null; }
                },
                createFilterButton() {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN, SELECTORS: S } = GRE.config;
                    const { icons } = GRE;
                    const btn = GRE.utils.createElement('button', {
                        type: 'button', className: `btn btn-sm hx_rsm-trigger ${CN.FILTER_BUTTON}`,
                        style: { paddingLeft: '0.75rem', paddingRight: '0.75rem', marginRight: '0px', display: 'inline-flex', alignItems: 'center' },
                        'aria-haspopup': 'true', 'aria-expanded': 'false',
                    });

                    btn.insertAdjacentHTML('afterbegin', icons.filter);

                    const textSpan = GRE.utils.createElement('span', { textContent: GRE.utils.getText('filterButton') });
                    btn.appendChild(textSpan);

                    const counterSpan = GRE.utils.createElement('span', { className: 'Counter ml-2', textContent: '0', title: GRE.utils.getText('activeFilterCountTitle') });
                    counterSpan.dataset.ghreFilterCounter = "true";
                    btn.appendChild(counterSpan);

                    btn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        GRE.actions.toggleDropdown();
                    });
                    return btn;
                },
                updateFilterCounter(state) {
                    if (!state.filterUIInstance) return;
                    const counterElement = state.filterUIInstance.querySelector(GithubReleaseEnhancer.config.SELECTORS.FILTER_COUNTER);
                    if (counterElement) {
                        let count = 0;
                        state.selectedPlatforms.forEach(p => {
                            if(state.availableFilters.has(p)) count++;
                        });
                        state.selectedArchs.forEach(a => {
                            if (state.masterAvailableArchs.has(a)) count++;
                        });
                        if (state.filterMatchLanguage && state.availableFilters.has('language')) count++;
                        if (state.filterMatchResolution && state.availableFilters.has('resolution')) count++;
                        if (state.hideByKeyword && state.availableFilters.has('keyword')) count++;
                        if (state.hideSourceCode && state.availableFilters.has('source')) count++;
                        counterElement.textContent = count;
                    }
                },
                updateHiddenAssetsCounter(hiddenCount = 0) {
                    const counterEl = document.querySelector(GithubReleaseEnhancer.config.SELECTORS.HIDDEN_ASSET_COUNTER);
                    if (counterEl) {
                        if (hiddenCount > 0) {
                            counterEl.textContent = `(${hiddenCount} ${GithubReleaseEnhancer.store.state.isChinese ? '隐藏' : 'hidden'})`;
                            counterEl.style.display = '';
                        } else {
                            counterEl.style.display = 'none';
                        }
                    }
                },
                _updateOptionVisuals(element, isSelected, isAvailable) {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN } = GRE.config;
                    const { icons } = GRE;
                    element.setAttribute('data-available', isAvailable.toString());
                    const shouldBeSelected = isAvailable ? isSelected : false;
                    element.classList.toggle(CN.SELECTED, shouldBeSelected);
                    element.setAttribute('aria-checked', shouldBeSelected.toString());
                    const iconSpan = element.querySelector('span:first-child');
                    if (iconSpan) {
                        iconSpan.innerHTML = shouldBeSelected ? icons.checkbox_checked : icons.checkbox_unchecked;
                    }
                },
                createSpecificFilterToggle(type, stateKey, initialLabel) {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN } = GRE.config;
                    const { createElement } = GRE.utils;
                    const el = createElement('div', { className: CN.KEYWORD_TOGGLE_OPTION, role: 'menuitemcheckbox', dataset: { filterType: type }, tabindex: '-1' });
                    el.appendChild(createElement('span'));
                    el.appendChild(createElement('span', { textContent: initialLabel }));
                    this.updateSpecificFilterVisualState(type, GRE.store.state[stateKey], el);
                    return el;
                },
                updateSpecificFilterVisualState(type, isActive, elementOrContainer = document) {
                    const GRE = GithubReleaseEnhancer;
                    if (!elementOrContainer && GRE.store.state.filterUIInstance) {
                        elementOrContainer = GRE.store.state.filterUIInstance;
                    } else if (!elementOrContainer) {
                        return;
                    }

                    const selector = `[data-filter-type="${type}"]`;
                    let el = elementOrContainer.matches?.(selector) ? elementOrContainer : elementOrContainer.querySelector?.(selector);

                    if (el) {
                        const isAvailable = GRE.store.state.availableFilters.has(type);
                        this._updateOptionVisuals(el, isActive, isAvailable);
                    }
                },
                createPlatformOptions() {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN } = GRE.config;
                    const { createElement } = GRE.utils;
                    const state = GRE.store.state;
                    const optsCont = createElement('div', { className: `${CN.PLATFORM_OPTIONS}` });

                    if (!state.isTouchDevice) {
                        let popupCloseTimeout;
                        const clearCloseTimeout = () => clearTimeout(popupCloseTimeout);
                        optsCont.addEventListener('mouseleave', () => {
                            clearCloseTimeout();
                            popupCloseTimeout = setTimeout(() => this.closePopup(), GRE.config.POPUP_LEAVE_CLOSE_DELAY);
                        });
                        optsCont.addEventListener('mouseenter', clearCloseTimeout);
                    }

                    const innerCont = createElement('div', { className: CN.PLATFORM_OPTIONS_INNER });

                    const header = createElement('div', { className: CN.POPUP_HEADER });
                    const title = createElement('div', { className: CN.OPTIONS_TITLE, style: { padding: 0, gridColumn: 'auto' }, textContent: GRE.utils.getText('platformFilterTitle') });
                    const settingsBtn = createElement('button', {
                        className: CN.POPUP_SETTINGS_BTN,
                        title: GRE.utils.getText('settingsMenuName'),
                    });
                    settingsBtn.innerHTML = GRE.icons.gear;

                    settingsBtn.addEventListener('click', () => {
                        this.closePopup();
                        GRE.settings.showSettingsPanel();
                    });
                    header.appendChild(title);
                    header.appendChild(settingsBtn);
                    innerCont.appendChild(header);

                    const gridCont = createElement('div', { className: CN.PLATFORM_OPTIONS_GRID });
                    GRE.config.PLATFORMS.forEach(p => gridCont.appendChild(this.createPlatformOptionElement(p)));
                    gridCont.appendChild(createElement('div'));

                    gridCont.appendChild(this.createArchTagContainer());

                    gridCont.appendChild(createElement('div', { className: CN.OPTIONS_SEPARATOR }));
                    gridCont.appendChild(createElement('div', { className: CN.OPTIONS_TITLE, textContent: GRE.utils.getText('supplementaryFilterTitle') }));

                    gridCont.appendChild(this.createSpecificFilterToggle('language', 'filterMatchLanguage', `${GRE.utils.getText('langLabel')} (${GRE.config.LANGUAGES[state.currentUserLanguage]?.name || state.currentUserLanguage})`));
                    const resText = state.currentUserResolutionCategory === 'hd' ? 'HD' : (GRE.config.RESOLUTIONS['sd']?.name || 'SD');
                    gridCont.appendChild(this.createSpecificFilterToggle('resolution', 'filterMatchResolution', `${GRE.utils.getText('resLabel')} (${resText})`));

                    gridCont.appendChild(this.createSpecificFilterToggle('source', 'hideSourceCode', GRE.utils.getText('sourceCodeLabel')));
                    gridCont.appendChild(this.createSpecificFilterToggle('keyword', 'hideByKeyword', GRE.utils.getText('keywordLabel')));

                    const actionsContainer = createElement('div', { className: 'ghre-action-buttons-container' });
                    const selectAllBtn = createElement('button', { textContent: GRE.utils.getText('selectAllLabel'), className: `btn btn-sm ${CN.ACTION_BUTTON} ghre-select-all-btn` });
                    const deselectAllBtn = createElement('button', { textContent: GRE.utils.getText('deselectAllLabel'), className: `btn btn-sm ${CN.ACTION_BUTTON} ghre-deselect-all-btn` });
                    const restoreBtn = createElement('button', {
                        textContent: GRE.utils.getText('restoreLabel'),
                        className: `btn btn-sm btn-primary ${CN.ACTION_BUTTON} ghre-restore-btn`,
                        style: { display: 'none', width: '100%' }
                    });

                    selectAllBtn.addEventListener('click', () => this.toggleAllFilters(true));
                    deselectAllBtn.addEventListener('click', () => this.toggleAllFilters(false));
                    restoreBtn.addEventListener('click', () => GithubReleaseEnhancer.actions.restoreInitialFilters());

                    actionsContainer.appendChild(selectAllBtn);
                    actionsContainer.appendChild(deselectAllBtn);
                    actionsContainer.appendChild(restoreBtn);
                    gridCont.appendChild(actionsContainer);
                    innerCont.appendChild(gridCont);
                    optsCont.appendChild(innerCont);
                    optsCont.addEventListener('click', (e) => {
                        const interactiveTarget = e.target.closest(`.${CN.PLATFORM_OPTION}, .${CN.KEYWORD_TOGGLE_OPTION}, .${CN.ARCH_TAG}`);
                        if (interactiveTarget) {
                            e.stopPropagation();
                            this.handleMenuClick(e, interactiveTarget);
                        } else if (!e.target.closest(`.${CN.ACTION_BUTTON}, .${CN.POPUP_SETTINGS_BTN}`)) {
                            e.stopPropagation();
                        }
                    });
                    return optsCont;
                },
                createArchTagContainer() {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN, ARCH_TAGS_CONFIG } = GRE.config;
                    const { createElement } = GRE.utils;
                    const container = createElement('div', { className: CN.ARCH_TAG_CONTAINER });
                    ARCH_TAGS_CONFIG.forEach(arch => {
                        const tagEl = createElement('div', {
                            className: CN.ARCH_TAG,
                            textContent: arch.name,
                            dataset: { archId: arch.id }
                        });
                        container.appendChild(tagEl);
                    });
                    return container;
                },
                toggleAllFilters(select) {
                    GithubReleaseEnhancer.actions.updateAndSaveAllFilters(select);
                },
                updateActionButtons(state) {
                    const container = state.filterUIInstance;
                    if (!container) return;

                    const actionButtonsContainer = container.querySelector('.ghre-action-buttons-container');
                    if (!actionButtonsContainer) return;

                    const selectAllBtn = actionButtonsContainer.querySelector('.ghre-select-all-btn');
                    const deselectAllBtn = actionButtonsContainer.querySelector('.ghre-deselect-all-btn');
                    const restoreBtn = actionButtonsContainer.querySelector('.ghre-restore-btn');

                    if (selectAllBtn && deselectAllBtn && restoreBtn) {
                        const currentFilters = {
                             selectedPlatforms: state.selectedPlatforms,
                             selectedArchs: state.selectedArchs,
                             filterMatchLanguage: state.filterMatchLanguage,
                             filterMatchResolution: state.filterMatchResolution,
                             hideByKeyword: state.hideByKeyword,
                             hideSourceCode: state.hideSourceCode,
                        };

                        const isDifferentFromInitial = !this.areFiltersEqual(currentFilters, state.initialFilterState);

                        selectAllBtn.style.display = isDifferentFromInitial ? 'none' : '';
                        deselectAllBtn.style.display = isDifferentFromInitial ? 'none' : '';
                        restoreBtn.style.display = isDifferentFromInitial ? '' : 'none';
                    }
                },
                areFiltersEqual(filtersA, filtersB) {
                    if (!filtersA || !filtersB) return false;
                    const keys = ['filterMatchLanguage', 'filterMatchResolution', 'hideByKeyword', 'hideSourceCode'];
                    for (const key of keys) {
                        if (filtersA[key] !== filtersB[key]) return false;
                    }
                    const setKeys = ['selectedPlatforms', 'selectedArchs'];
                     for (const key of setKeys) {
                        const setA = filtersA[key];
                        const setB = filtersB[key];
                        if (setA.size !== setB.size) return false;
                        for (const item of setA) {
                            if (!setB.has(item)) return false;
                        }
                    }
                    return true;
                },
                handleMenuClick(event, target) {
                    const GRE = GithubReleaseEnhancer;
                    const { platformId, filterType, archId } = target.dataset;

                    if (platformId) {
                        GRE.actions.togglePlatform(platformId);
                    } else if (filterType) {
                        GRE.actions.toggleSupplementaryFilter(filterType);
                    } else if (archId) {
                        GRE.actions.toggleArch(archId);
                    }
                },
                createPlatformOptionElement(platform) {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN } = GRE.config;
                    const { createElement } = GRE.utils;
                    const el = createElement('div', {
                        className: CN.PLATFORM_OPTION, role: 'menuitemcheckbox',
                        dataset: { platformId: platform.id }, tabindex: '-1'
                    });
                    el.appendChild(createElement('span'));
                    el.appendChild(createElement('span', { textContent: platform.name }));
                    this.updatePlatformOptionVisualState(el, platform.id, GRE.store.state.selectedPlatforms.has(platform.id));
                    return el;
                },
                 updatePlatformOptionVisualState(el, pId, isSel) {
                    const isAvailable = GithubReleaseEnhancer.store.state.availableFilters.has(pId);
                    this._updateOptionVisuals(el, isSel, isAvailable);
                },
                updateAllPlatformOptionsVisualState(state) {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN } = GRE.config;
                    const container = state.filterUIInstance;
                    if (!container) return;

                    GRE.config.PLATFORMS.forEach(p => {
                        const opt = container.querySelector(`.${CN.PLATFORM_OPTION}[data-platform-id="${p.id}"]`);
                        if (opt) {
                            this.updatePlatformOptionVisualState(opt, p.id, state.selectedPlatforms.has(p.id));
                        }
                    });
                },
                updateAllArchTagsVisualState(state) {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN, ARCH_TAGS_CONFIG } = GRE.config;
                    const container = state.filterUIInstance;
                    if (!container) return;

                    const parsedAssets = this.getParsedAssets();
                    const availableArchsNow = new Set();
                    const assetsToConsider = state.selectedPlatforms.size > 0
                        ? parsedAssets.filter(asset => asset.info.platform && state.selectedPlatforms.has(asset.info.platform))
                        : parsedAssets;

                    assetsToConsider.forEach(asset => {
                        if (asset.info.architecture) {
                            availableArchsNow.add(asset.info.architecture);
                        }
                    });

                    ARCH_TAGS_CONFIG.forEach(arch => {
                        const tagEl = container.querySelector(`.${CN.ARCH_TAG}[data-arch-id="${arch.id}"]`);
                        if (tagEl) {
                            const isAvailable = availableArchsNow.has(arch.id);
                            const isSelected = state.selectedArchs.has(arch.id);
                            tagEl.setAttribute('data-available', isAvailable.toString());
                            tagEl.classList.toggle(CN.SELECTED, isSelected);
                        }
                    });

                    const setsAreEqual = (setA, setB) => setA.size === setB.size && [...setA].every(value => setB.has(value));
                    if (!setsAreEqual(state.availableArchs, availableArchsNow)) {
                        GRE.store.setState({ availableArchs: availableArchsNow });
                    }
                },
                rules: {
                    platform(assetInfo, state) {
                        const { selectedPlatforms } = state;
                        if (selectedPlatforms.size === 0) return true;
                        if (assetInfo.platform) return selectedPlatforms.has(assetInfo.platform);
                        if (assetInfo.isAgnosticContainer) return true;
                        return selectedPlatforms.has('other_os');
                    },
                    arch(assetInfo, state) {
                        const { selectedArchs } = state;
                        if (selectedArchs.size === 0) return true;
                        if (assetInfo.architecture === null) return true;
                        return selectedArchs.has(assetInfo.architecture);
                    },
                    language(assetInfo, state, context) {
                        if (!state.filterMatchLanguage || !context?.hasInfo.language) return true;
                        if (assetInfo.language === null) return !context.hasMatch.language;
                        return assetInfo.language === state.currentUserLanguage;
                    },
                    resolution(assetInfo, state, context) {
                        if (!state.filterMatchResolution || !context?.hasInfo.resolution) return true;
                        if (assetInfo.resolution === null) return !context.hasMatch.resolution;
                        return assetInfo.resolution === state.currentUserResolutionCategory;
                    },
                },
                filterAssets(state) {
                    const GRE = GithubReleaseEnhancer;
                    if (state.isMainReleasesPage) return;

                    const parsedAssets = this.getParsedAssets();
                    if (parsedAssets.length === 0) {
                        this.updateHiddenAssetsCounter(0);
                        return;
                    }

                    const hasActiveFilters = state.selectedPlatforms.size > 0 || state.selectedArchs.size > 0;
                    const shouldRunBestMatch = state.enableBestMatch && hasActiveFilters;

                    const hasMeaningfulPlatformInfo = parsedAssets.some(p => p.info.platform && p.info.platform !== 'other_os');
                    const platformScanResults = parsedAssets.reduce((acc, { info }) => {
                        const platformKey = info.platform || 'unknown';
                        if (!acc[platformKey]) {
                            acc[platformKey] = { hasInfo: { language: false, resolution: false }, hasMatch: { language: false, resolution: false } };
                        }
                        if (info.language) {
                            acc[platformKey].hasInfo.language = true;
                            if (info.language === state.currentUserLanguage) acc[platformKey].hasMatch.language = true;
                        }
                        if (info.resolution) {
                            acc[platformKey].hasInfo.resolution = true;
                            if (info.resolution === state.currentUserResolutionCategory) acc[platformKey].hasMatch.resolution = true;
                        }
                        return acc;
                    }, {});

                    let hiddenCount = 0;
                    const domUpdateTasks = [];
                    const bestMatchCandidates = new Map();

                    parsedAssets.forEach((asset, index) => {
                        const { element: assetElement, name: assetName, info: assetInfo } = asset;
                        if (!assetName) {
                            domUpdateTasks.push({ element: assetElement, show: true });
                            return;
                        }

                        let passesBasicFilters;

                        if (assetInfo.isSourceCode) {
                            passesBasicFilters = !state.hideSourceCode;
                        } else {
                            let keywordAllowed = true;
                            if (assetInfo.isByKeyword) {
                                keywordAllowed = !state.hideByKeyword;
                            }

                            const context = platformScanResults[assetInfo.platform || 'unknown'];
                            let passesPlatformAndArch;

                            if (hasMeaningfulPlatformInfo) {
                                passesPlatformAndArch = this.rules.platform(assetInfo, state) && this.rules.arch(assetInfo, state);
                            } else {
                                passesPlatformAndArch = this.rules.arch(assetInfo, state);
                            }

                            const passesSupplementary = this.rules.language(assetInfo, state, context) &&
                                                        this.rules.resolution(assetInfo, state, context);

                            passesBasicFilters = keywordAllowed && passesPlatformAndArch && passesSupplementary;
                        }

                        if (shouldRunBestMatch && passesBasicFilters && !assetInfo.isSourceCode) {
                            const groupKey = GRE.utils.getNormalizedGroupName(assetName);
                            if (groupKey) {
                                if (!bestMatchCandidates.has(groupKey)) {
                                    bestMatchCandidates.set(groupKey, []);
                                }
                                bestMatchCandidates.get(groupKey).push({
                                    index: index,
                                    score: GRE.utils.getBestMatchScore(assetInfo, state)
                                });
                            }
                        }

                        domUpdateTasks.push({ element: assetElement, show: passesBasicFilters });
                        if (!passesBasicFilters) hiddenCount++;
                    });

                    if (shouldRunBestMatch) {
                        bestMatchCandidates.forEach(candidates => {
                            if (candidates.length <= 1) return;
                            const maxScore = Math.max(...candidates.map(c => c.score));
                            if (maxScore >= 1) {
                                candidates.forEach(candidate => {
                                    if (candidate.score < maxScore) {
                                        const task = domUpdateTasks[candidate.index];
                                        if (task.show) {
                                            task.show = false;
                                            hiddenCount++;
                                        }
                                    }
                                });
                            }
                        });
                    }

                    const assetList = document.querySelector(GRE.config.SELECTORS.ASSET_LIST_CONTAINER);
                    requestAnimationFrame(() => {
                        domUpdateTasks.forEach(task => {
                            task.element.classList.toggle(GRE.config.CLASS_NAMES.HIDDEN_ASSET, !task.show);
                        });
                        if (assetList) {
                            assetList.classList.remove(GRE.config.CLASS_NAMES.ASSET_LIST_LOADING);
                        }
                    });
                    this.updateHiddenAssetsCounter(hiddenCount);
                }
            }
        },

        // =================================================================================
        // [模块] 页面与导航 (Page & Navigation)
        // =================================================================================
        page: {
            observer: {
                start() {
                    try {
                        const GRE = GithubReleaseEnhancer;
                        const mainContent = document.querySelector(GRE.config.SELECTORS.MAIN_CONTENT) || document.body;
                        let domChangeDebounceTimer;
                        const callback = (mutationsList) => {
                            clearTimeout(domChangeDebounceTimer);
                            domChangeDebounceTimer = setTimeout(() => this.handleChanges(mutationsList), GRE.config.DEBOUNCE_DELAY);
                        };
                        const observer = new MutationObserver(callback);
                        observer.observe(mainContent, { childList: true, subtree: true });
                        GRE._observer = observer;

                    } catch (e) { console.error(`[GitHub Filter@${location.pathname}] Error starting DOM observer:`, e); }
                },
                handleChanges(mutations) {
                    const GRE = GithubReleaseEnhancer;
                    const S = GRE.config.SELECTORS;
                    let needsReleaseNotesUpdate = false;
                    let needsAssetFilterUpdate = false;

                    const hasElementNodes = mutations.some(m => m.addedNodes.length > 0 && Array.from(m.addedNodes).some(n => n.nodeType === Node.ELEMENT_NODE));
                    if (!hasElementNodes) return;

                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches(`.${GRE.config.CLASS_NAMES.MARKDOWN_BODY}.${GRE.config.CLASS_NAMES.RELEASE_NOTES_PANEL}`) || node.querySelector(`.${GRE.config.CLASS_NAMES.MARKDOWN_BODY}.${GRE.config.CLASS_NAMES.RELEASE_NOTES_PANEL}`)) {
                                    needsReleaseNotesUpdate = true;
                                }
                                const assetSummarySelector = `${S.ASSET_LIST_CONTAINER}, ${S.ASSETS_SUMMARY}`;
                                if (!GRE.store.state.isMainReleasesPage && (node.matches(assetSummarySelector) || node.querySelector(assetSummarySelector))) {
                                    needsAssetFilterUpdate = true;
                                }
                            }
                        }
                    }

                    if (needsReleaseNotesUpdate) {
                        requestAnimationFrame(() => GRE.core.releaseNotes.initializeExpansion());
                    }
                    if (needsAssetFilterUpdate) {
                        requestAnimationFrame(() => GRE.core.assetFilter.handleAssetLoad());
                    }
                }
            },
            navigation: {
                setupListeners() {
                    try {
                        if (navigationReInit) {
                            document.removeEventListener('turbo:load', navigationReInit);
                            window.removeEventListener('popstate', navigationReInit);
                        }
                        navigationReInit = () => setTimeout(() => GithubReleaseEnhancer.init(), 100);
                        document.addEventListener('turbo:load', navigationReInit);
                        window.addEventListener('popstate', navigationReInit);
                    } catch (e) { console.error(`[GitHub Filter@${location.pathname}] Error setting up navigation listeners:`, e); }
                }
            }
        },

        // =================================================================================
        // [模块] 设置 (Settings)
        // =================================================================================
        settings: {
            parseHiddenKeywords(input) {
                if (!input || typeof input !== 'string') return [];
                const patterns = [];
                const regex = /'([^']*)'|([^,]+)/g;
                let match;
                while ((match = regex.exec(input)) !== null) {
                    const pattern = (match[1] !== undefined ? match[1] : match[2]).trim();
                    if (pattern) {
                        patterns.push(pattern);
                    }
                }
                return patterns;
            },
            loadUserSettings() {
                const GRE = GithubReleaseEnhancer;
                const C = GRE.config;
                const defaults = {
                    releaseNotesMaxHeight: C.RELEASE_NOTES_MAX_HEIGHT_DEFAULT,
                    hiddenKeywords: [...C.HIDDEN_KEYWORDS_DEFAULT],
                    clickOutsideToCollapse: true,
                    filterMode: 'smart',
                    enableBestMatch: true,
                    preferredFilters: {},
                };

                const storedSettings = GM_getValue(C.STORAGE_KEY_SETTINGS, {});

                if (storedSettings.preferredFilters) {
                    if (Array.isArray(storedSettings.preferredFilters.selectedPlatforms)) {
                       storedSettings.preferredFilters.selectedPlatforms = new Set(storedSettings.preferredFilters.selectedPlatforms);
                    }
                     if (Array.isArray(storedSettings.preferredFilters.selectedArchs)) {
                       storedSettings.preferredFilters.selectedArchs = new Set(storedSettings.preferredFilters.selectedArchs);
                    }
                }

                const loadedSettings = { ...defaults, ...storedSettings };
                GRE.store.setState(loadedSettings);
            },
            saveUserSettings(settingsToSave) {
                const GRE = GithubReleaseEnhancer;
                const C = GRE.config;

                GRE.store.setState(settingsToSave);

                const currentSettings = GM_getValue(C.STORAGE_KEY_SETTINGS, {});

                let processedSettings = {...settingsToSave};
                if (processedSettings.preferredFilters) {
                    const prefsToSave = { ...processedSettings.preferredFilters };
                    if (prefsToSave.selectedPlatforms instanceof Set) {
                        prefsToSave.selectedPlatforms = Array.from(prefsToSave.selectedPlatforms);
                    }
                    if (prefsToSave.selectedArchs instanceof Set) {
                        prefsToSave.selectedArchs = Array.from(prefsToSave.selectedArchs);
                    }
                    processedSettings.preferredFilters = prefsToSave;
                }

                const newSettings = { ...currentSettings, ...processedSettings };
                GM_setValue(C.STORAGE_KEY_SETTINGS, newSettings);
                console.log('[GitHub Filter] Settings saved.', newSettings);
            },
            resetAllSettings() {
                const GRE = GithubReleaseEnhancer;
                GM_deleteValue(GRE.config.STORAGE_KEY_SETTINGS);
                location.reload();
            },
            showResetConfirmation(overlay) {
                const GRE = GithubReleaseEnhancer;
                const { createElement, getText } = GRE.utils;
                const { CLASS_NAMES: CN } = GRE.config;

                overlay.querySelector(`.${CN.RESET_CONFIRM_DIALOG}`)?.remove();

                const dialog = createElement('div', { className: CN.RESET_CONFIRM_DIALOG });
                dialog.innerHTML = `
                    <div class="ghre-confirm-title">${getText('resetConfirmationTitle')}</div>
                    <div class="ghre-confirm-message">${getText('resetConfirmationMessage')}</div>
                    <div class="ghre-confirm-actions">
                        <button type="button" class="btn btn-sm" data-action="cancel-reset">${getText('settingsCancelButton')}</button>
                        <button type="button" class="btn btn-sm btn-danger" data-action="confirm-reset">${getText('resetConfirmButton')}</button>
                    </div>
                `;

                dialog.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const btn = e.target.closest('button');
                    if (!btn) return;
                    const action = btn.dataset.action;
                    if (action === 'cancel-reset') {
                        dialog.remove();
                    } else if (action === 'confirm-reset') {
                        this.resetAllSettings();
                    }
                });

                overlay.appendChild(dialog);
            },
            createSettingsPanel() {
                try {
                    const GRE = GithubReleaseEnhancer;
                    const { CLASS_NAMES: CN, SELECTORS: S } = GRE.config;
                    const { createElement } = GRE.utils;
                    const state = GRE.store.state;

                    if (document.querySelector(`.${CN.SETTINGS_OVERLAY}`)) {
                        return;
                    }

                    const settingsOverlayElement = createElement('div', {
                        className: CN.SETTINGS_OVERLAY,
                        style: { display: 'none' }
                    });

                    const settingsPanelElement = createElement('div', {
                        className: CN.SETTINGS_PANEL,
                        role: 'dialog',
                        'aria-modal': 'true',
                        'aria-labelledby': 'ghre-settings-title-id'
                    });

                    const createCheckboxGroup = (id, labelKey, checked) => {
                         return `<div class="ghre-checkbox-group ${CN.SETTINGS_FORM_GROUP}"><input type="checkbox" id="${id}"${checked ? ' checked' : ''}><label for="${id}" class="${CN.SETTINGS_LABEL}" style="margin-bottom:0;">${GRE.utils.getText(labelKey)}</label></div>`;
                    };

                    const createRadioGroup = (name, value, labelKey, checked) => {
                        const id = `ghre-radio-${value}`;
                        return `<div class="ghre-radio-group"><input type="radio" id="${id}" name="${name}" value="${value}"${checked ? ' checked' : ''}><label for="${id}" class="${CN.SETTINGS_LABEL}" style="margin-bottom:0;">${GRE.utils.getText(labelKey)}</label></div>`;
                    };

                    let panelHTML = `<div id="ghre-settings-title-id" class="${CN.SETTINGS_TITLE}">${GRE.utils.getText('settingsPanelTitle')}</div>`;

                    panelHTML += `<div class="${CN.SETTINGS_FORM_GROUP}">
                        <label class="${CN.SETTINGS_LABEL}">${GRE.utils.getText('filterModeLabel')}</label>
                        <div class="ghre-radio-group-container">
                            <div class="ghre-radio-group"><input type="radio" id="ghre-radio-smart" name="filterMode" value="smart"><label for="ghre-radio-smart" class="${CN.SETTINGS_LABEL}" style="margin-bottom:0;">${GRE.utils.getText('intelligentFilterLabel')}</label></div>
                            <div class="ghre-pref-group">
                                <div class="ghre-radio-group"><input type="radio" id="ghre-radio-preferred" name="filterMode" value="preferred"><label for="ghre-radio-preferred" class="${CN.SETTINGS_LABEL}" style="margin-bottom:0;">${GRE.utils.getText('preferredFilterLabel')}</label></div>
                                <button type="button" class="btn btn-sm" id="ghreSavePrefsBtn" style="margin-left: 4px;">${GRE.utils.getText('savePrefsButton')}</button>
                            </div>
                        </div>
                    </div>`;

                    panelHTML += `<div class="${CN.SETTINGS_FORM_GROUP}"><label for="${S.SETTINGS_MAX_HEIGHT_INPUT.substring(1)}" class="${CN.SETTINGS_LABEL}">${GRE.utils.getText('settingsMaxHeightLabel')}</label><input type="number" id="${S.SETTINGS_MAX_HEIGHT_INPUT.substring(1)}" class="${CN.SETTINGS_INPUT}" min="50" step="10"></div>`;
                    panelHTML += `<div class="${CN.SETTINGS_FORM_GROUP}"><label for="${S.SETTINGS_HIDDEN_RULES_TEXTAREA.substring(1)}" class="${CN.SETTINGS_LABEL}">${GRE.utils.getText('settingsHiddenRuleLabel')}</label><textarea id="${S.SETTINGS_HIDDEN_RULES_TEXTAREA.substring(1)}" class="${CN.SETTINGS_TEXTAREA}" placeholder="${GRE.utils.getText('settingsHiddenRulePlaceholder')}"></textarea></div>`;
                    panelHTML += createCheckboxGroup(S.SETTINGS_CLICK_OUTSIDE_CHECKBOX.substring(1), 'settingsClickOutsideLabel', state.clickOutsideToCollapse);
                    panelHTML += createCheckboxGroup('ghreBestMatchCheckbox', 'settingsBestMatchLabel', state.enableBestMatch);

                    const actionsContainer = createElement('div', { className: CN.SETTINGS_ACTIONS });
                    const resetButton = createElement('button', { type: 'button', className: `btn btn-danger ${CN.SETTINGS_BUTTON}`, dataset: { action: 'reset' }, textContent: GRE.utils.getText('settingsResetButton') });
                    const spacer = createElement('div', { style: { flexGrow: '1' } });
                    const cancelButton = createElement('button', { type: 'button', className: `btn ${CN.SETTINGS_BUTTON}`, dataset: { action: 'cancel' }, textContent: GRE.utils.getText('settingsCancelButton') });
                    const saveButton = createElement('button', { type: 'button', className: `btn btn-primary ${CN.SETTINGS_BUTTON}`, dataset: { action: 'save' }, textContent: GRE.utils.getText('settingsSaveButton') });

                    actionsContainer.append(resetButton, spacer, cancelButton, saveButton);
                    settingsPanelElement.innerHTML = panelHTML;
                    settingsPanelElement.appendChild(actionsContainer);

                    settingsOverlayElement.appendChild(settingsPanelElement);
                    document.body.appendChild(settingsOverlayElement);

                    settingsPanelElement.querySelector(`input[name="filterMode"][value="${state.filterMode}"]`).checked = true;
                    settingsPanelElement.querySelector(S.SETTINGS_MAX_HEIGHT_INPUT).value = state.releaseNotesMaxHeight;
                    settingsPanelElement.querySelector(S.SETTINGS_HIDDEN_RULES_TEXTAREA).value = state.hiddenKeywords.map(k => k.includes(' ') ? `'${k}'` : k).join(', ');

                    const savePrefsBtn = settingsPanelElement.querySelector('#ghreSavePrefsBtn');
                    const preferredRadio = settingsPanelElement.querySelector('input[name="filterMode"][value="preferred"]');
                    const smartRadio = settingsPanelElement.querySelector('input[name="filterMode"][value="smart"]');

                    const updateSavePrefsBtnState = () => {
                        savePrefsBtn.disabled = !preferredRadio.checked;
                    };

                    preferredRadio.addEventListener('change', updateSavePrefsBtnState);
                    smartRadio.addEventListener('change', updateSavePrefsBtnState);
                    updateSavePrefsBtnState();

                    savePrefsBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const currentFilters = {
                             selectedPlatforms: GRE.store.state.selectedPlatforms,
                             selectedArchs: GRE.store.state.selectedArchs,
                             filterMatchLanguage: GRE.store.state.filterMatchLanguage,
                             filterMatchResolution: GRE.store.state.filterMatchResolution,
                             hideByKeyword: GRE.store.state.hideByKeyword,
                             hideSourceCode: GRE.store.state.hideSourceCode,
                        };
                        this.saveUserSettings({ preferredFilters: currentFilters });
                        const btn = e.target;
                        const originalText = btn.textContent;
                        btn.textContent = GRE.utils.getText('prefsSavedAlert');
                        btn.disabled = true;
                        setTimeout(() => {
                           btn.textContent = originalText;
                           updateSavePrefsBtnState();
                        }, 2000);
                    });

                    settingsPanelElement.querySelector(S.SETTINGS_RESET_BUTTON).addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showResetConfirmation(settingsOverlayElement);
                    });

                    settingsPanelElement.querySelector(S.SETTINGS_SAVE_BUTTON).addEventListener('click', (e) => {
                        e.preventDefault();
                        const maxHeight = parseInt(settingsPanelElement.querySelector(S.SETTINGS_MAX_HEIGHT_INPUT).value, 10);
                        const hiddenRulesInput = settingsPanelElement.querySelector(S.SETTINGS_HIDDEN_RULES_TEXTAREA).value;
                        const hiddenKeywords = this.parseHiddenKeywords(hiddenRulesInput);
                        const clickOutside = settingsPanelElement.querySelector(S.SETTINGS_CLICK_OUTSIDE_CHECKBOX).checked;
                        const enableBestMatch = settingsPanelElement.querySelector('#ghreBestMatchCheckbox').checked;
                        const filterMode = settingsPanelElement.querySelector('input[name="filterMode"]:checked').value;

                        this.saveUserSettings({
                            releaseNotesMaxHeight: (!isNaN(maxHeight) && maxHeight >= 50) ? Math.min(maxHeight, 2000) : GRE.config.RELEASE_NOTES_MAX_HEIGHT_DEFAULT,
                            hiddenKeywords: hiddenKeywords.length > 0 ? hiddenKeywords : [...GRE.config.HIDDEN_KEYWORDS_DEFAULT],
                            clickOutsideToCollapse: clickOutside,
                            enableBestMatch: enableBestMatch,
                            filterMode: filterMode,
                        });
                        this.hideSettingsPanel();
                        GRE.actions.initializeFilterStates();
                    });

                    settingsPanelElement.querySelector(S.SETTINGS_CANCEL_BUTTON).addEventListener('click', (e) => {
                        e.preventDefault();
                        this.hideSettingsPanel();
                    });
                    settingsOverlayElement.addEventListener('click', (e) => {
                        if (e.target === settingsOverlayElement) {
                            if (!settingsOverlayElement.querySelector(`.${CN.RESET_CONFIRM_DIALOG}`)) {
                                this.hideSettingsPanel();
                            }
                        }
                    });

                    GRE.store.setState({ settingsOverlayElement });
                } catch (error) {
                    console.error(`[GitHub Filter@${location.pathname}] Failed to create settings panel:`, error);
                }
            },
            showSettingsPanel() {
                const GRE = GithubReleaseEnhancer;
                const S = GRE.config.SELECTORS;
                let { settingsOverlayElement } = GRE.store.state;

                if (!settingsOverlayElement || !document.body.contains(settingsOverlayElement)) {
                    this.createSettingsPanel();
                    settingsOverlayElement = GRE.store.state.settingsOverlayElement;
                }

                if (settingsOverlayElement) {
                   const panel = settingsOverlayElement.querySelector(`.${GRE.config.CLASS_NAMES.SETTINGS_PANEL}`);
                   panel.querySelector(`input[name="filterMode"][value="${GRE.store.state.filterMode}"]`).checked = true;
                   panel.querySelector('#ghreSavePrefsBtn').disabled = GRE.store.state.filterMode !== 'preferred';
                   panel.querySelector(S.SETTINGS_MAX_HEIGHT_INPUT).value = GRE.store.state.releaseNotesMaxHeight;
                   panel.querySelector(S.SETTINGS_HIDDEN_RULES_TEXTAREA).value = GRE.store.state.hiddenKeywords.map(k => k.includes(' ') ? `'${k}'` : k).join(', ');
                   panel.querySelector(S.SETTINGS_CLICK_OUTSIDE_CHECKBOX).checked = GRE.store.state.clickOutsideToCollapse;
                   settingsOverlayElement.style.display = 'flex';
                }
            },
            hideSettingsPanel() {
                const { settingsOverlayElement } = GithubReleaseEnhancer.store.state;
                if (settingsOverlayElement) {
                    settingsOverlayElement.style.display = 'none';
                    settingsOverlayElement.querySelector(`.${GithubReleaseEnhancer.config.CLASS_NAMES.RESET_CONFIRM_DIALOG}`)?.remove();
                }
            },
            registerMenu() {
                const menuText = GithubReleaseEnhancer.utils.getText('settingsMenuName');
                GM_registerMenuCommand(menuText, () => GithubReleaseEnhancer.settings.showSettingsPanel());
            }
        },

        // =================================================================================
        // [模块] 用户操作 (Actions)
        // =================================================================================
        actions: {
            togglePlatform(platformId) {
                const { state, setState } = GithubReleaseEnhancer.store;
                const newSelectedPlatforms = new Set(state.selectedPlatforms);
                newSelectedPlatforms.has(platformId) ? newSelectedPlatforms.delete(platformId) : newSelectedPlatforms.add(platformId);

                const parsedAssets = GithubReleaseEnhancer.core.assetFilter.getParsedAssets();
                const availableArchsNow = new Set();
                const assetsToConsider = newSelectedPlatforms.size > 0
                    ? parsedAssets.filter(asset => asset.info.platform && newSelectedPlatforms.has(asset.info.platform))
                    : parsedAssets;
                assetsToConsider.forEach(asset => {
                    if (asset.info.architecture) availableArchsNow.add(asset.info.architecture);
                });

                const newSelectedArchs = new Set(state.selectedArchs);
                for (const selected of newSelectedArchs) {
                    if (!availableArchsNow.has(selected)) {
                        newSelectedArchs.delete(selected);
                    }
                }

                setState({ selectedPlatforms: newSelectedPlatforms, selectedArchs: newSelectedArchs });
            },
            toggleArch(archId) {
                const { state, setState } = GithubReleaseEnhancer.store;
                const newSelectedArchs = new Set(state.selectedArchs);
                if (newSelectedArchs.has(archId)) {
                    newSelectedArchs.delete(archId);
                } else {
                    newSelectedArchs.add(archId);
                }
                setState({ selectedArchs: newSelectedArchs });
            },
            toggleSupplementaryFilter(filterType) {
                const { setState, state } = GithubReleaseEnhancer.store;
                const stateKeyMap = {
                    language: 'filterMatchLanguage',
                    resolution: 'filterMatchResolution',
                    keyword: 'hideByKeyword',
                    source: 'hideSourceCode'
                };
                const stateKey = stateKeyMap[filterType];
                if (stateKey) {
                    setState({ [stateKey]: !state[stateKey] });
                }
            },
            updateAndSaveAllFilters(select) {
                const { state, setState } = GithubReleaseEnhancer.store;
                if (select) {
                    const newSelectedPlatforms = new Set();
                    GithubReleaseEnhancer.config.PLATFORMS.forEach(platform => {
                        if (state.availableFilters.has(platform.id)) {
                            newSelectedPlatforms.add(platform.id);
                        }
                    });

                    const newSelectedArchs = new Set();
                    state.masterAvailableArchs.forEach(arch => newSelectedArchs.add(arch));

                    const newState = { selectedPlatforms: newSelectedPlatforms, selectedArchs: newSelectedArchs };
                    const supplementaryFilters = ['language', 'resolution', 'keyword', 'source'];
                    supplementaryFilters.forEach(type => {
                        if (state.availableFilters.has(type)) {
                            const stateKey = { language: 'filterMatchLanguage', resolution: 'filterMatchResolution', keyword: 'hideByKeyword', source: 'hideSourceCode' }[type];
                            if(stateKey) newState[stateKey] = true;
                        }
                    });
                    setState(newState);
                } else {
                    setState({
                        selectedPlatforms: new Set(),
                        selectedArchs: new Set(),
                        filterMatchLanguage: false,
                        filterMatchResolution: false,
                        hideByKeyword: false,
                        hideSourceCode: false,
                    });
                }
            },
            toggleDropdown() {
                const GRE = GithubReleaseEnhancer;
                const state = GRE.store.state;
                if (state.isDropdownOpen) {
                    GRE.core.assetFilter.closePopup();
                } else {
                    const wrapper = state.filterUIInstance;
                    if (wrapper) {
                        wrapper.classList.add(GRE.config.CLASS_NAMES.PLATFORM_OPTIONS_OPEN);
                        const filterButton = wrapper.querySelector(`.${GRE.config.CLASS_NAMES.FILTER_BUTTON}`);
                        if (filterButton) filterButton.setAttribute('aria-expanded', 'true');
                        GRE.store.setState({ isDropdownOpen: true });
                        requestAnimationFrame(() => {
                            const firstOption = wrapper.querySelector(GRE.config.SELECTORS.FIRST_FOCUSABLE_OPTION);
                            if (firstOption) firstOption.focus();
                        });
                    }
                }
            },
            restoreInitialFilters() {
                const { state, setState } = GithubReleaseEnhancer.store;
                if (state.initialFilterState) {
                    const clonedInitialState = {
                        ...state.initialFilterState,
                        selectedPlatforms: new Set(state.initialFilterState.selectedPlatforms),
                        selectedArchs: new Set(state.initialFilterState.selectedArchs),
                    };
                    setState(clonedInitialState);
                }
            },
            initializeFilterStates() {
                const { state, setState } = GithubReleaseEnhancer.store;
                let newFilterState = {};

                if (state.isMainReleasesPage) {
                     newFilterState = {
                        selectedPlatforms: new Set(),
                        selectedArchs: new Set(),
                        filterMatchLanguage: false,
                        filterMatchResolution: false,
                        hideByKeyword: true,
                        hideSourceCode: false,
                     };
                } else if (state.filterMode === 'preferred' && Object.keys(state.preferredFilters).length > 0) {
                    const { preferredFilters } = state;
                    const validatedSelectedPlatforms = new Set();
                    const validatedSelectedArchs = new Set();

                    if (preferredFilters.selectedPlatforms) {
                        for (const platform of preferredFilters.selectedPlatforms) {
                            if (state.availableFilters.has(platform)) {
                                validatedSelectedPlatforms.add(platform);
                            }
                        }
                    }

                    if (preferredFilters.selectedArchs) {
                        for (const arch of preferredFilters.selectedArchs) {
                            if (state.masterAvailableArchs.has(arch)) {
                                validatedSelectedArchs.add(arch);
                            }
                        }
                    }
                    newFilterState = {
                        ...preferredFilters,
                        selectedPlatforms: validatedSelectedPlatforms,
                        selectedArchs: validatedSelectedArchs,
                    };
                } else {
                    const parsedAssets = GithubReleaseEnhancer.core.assetFilter.getParsedAssets();
                    const hasMeaningfulPlatformInfo = parsedAssets.some(p => p.info.platform && p.info.platform !== 'other_os');

                    const selectedPlatforms = new Set();
                    const selectedArchs = new Set();

                    if (state.availableFilters.has(state.currentUserPlatform)) {
                        selectedPlatforms.add(state.currentUserPlatform);
                    }

                    if (selectedPlatforms.has(state.currentUserPlatform)) {
                        const archsAvailableForCurrentUserPlatformAssets = new Set();
                        parsedAssets.filter(asset =>
                            asset.info.platform === state.currentUserPlatform ||
                            (asset.info.platform === null && asset.info.isAgnosticContainer)
                        ).forEach(asset => {
                            if (asset.info.architecture) {
                                archsAvailableForCurrentUserPlatformAssets.add(asset.info.architecture);
                            }
                        });


                        if (archsAvailableForCurrentUserPlatformAssets.has(state.currentUserArchitecture)) {
                            selectedArchs.add(state.currentUserArchitecture);
                        }
                    } else if (!hasMeaningfulPlatformInfo) {
                        if (state.masterAvailableArchs.has(state.currentUserArchitecture)) {
                            selectedArchs.add(state.currentUserArchitecture);
                        }
                    }

                    newFilterState = {
                        selectedPlatforms,
                        selectedArchs,
                        filterMatchLanguage: state.availableFilters.has('language'),
                        filterMatchResolution: state.availableFilters.has('resolution'),
                        hideByKeyword: true,
                        hideSourceCode: false,
                    };
                }

                const initialSnapshot = {
                    ...newFilterState,
                    selectedPlatforms: new Set(newFilterState.selectedPlatforms),
                    selectedArchs: new Set(newFilterState.selectedArchs)
                };

                setState({
                    ...newFilterState,
                    initialFilterState: initialSnapshot,
                });
            }
        },

        // =================================================================================
        // [模块] 初始化与主函数 (Initialization & Main)
        // =================================================================================
        async init() {
            try {
                if (this._observer) {
                    this._observer.disconnect();
                    this._observer = null;
                }
                if (this._globalClickHandler) {
                    document.removeEventListener('click', this._globalClickHandler);
                    this._globalClickHandler = null;
                }
                if (this._unsubscribe) {
                    this._unsubscribe();
                    this._unsubscribe = null;
                }
                if (this.notesCollapser) {
                    this.notesCollapser.cleanup();
                }
                document.querySelector(`.${this.config.CLASS_NAMES.FILTER_CONTAINER}`)?.closest('summary')?.querySelector(`.${this.config.CLASS_NAMES.SUMMARY_MARKER_ICON}`)?.remove();
                document.querySelector(`.${this.config.CLASS_NAMES.FILTER_CONTAINER}`)?.remove();
                document.querySelector(`.${this.config.CLASS_NAMES.SETTINGS_OVERLAY}`)?.remove();


                this.store = createStore({
                    isChinese: false, isTouchDevice: false,
                    selectedPlatforms: new Set(), selectedArchs: new Set(),
                    masterAvailableArchs: new Set(), availableArchs: new Set(),
                    hideByKeyword: true, hideSourceCode: false,
                    currentUserPlatform: 'unknown',
                    currentUserArchitecture: 'unknown', currentUserLanguage: 'unknown',
                    currentUserResolutionCategory: 'unknown', filterMatchLanguage: false,
                    filterMatchResolution: false, isMainReleasesPage: false,
                    filterUIInstance: null, settingsOverlayElement: null,
                    isDropdownOpen: false, availableFilters: new Set(), releaseNotesMaxHeight: 0,
                    hiddenKeywords: [],
                    clickOutsideToCollapse: true,
                    enableBestMatch: true,
                    initialFilterState: null,
                    filterMode: 'smart',
                    preferredFilters: {},
                });
                const { setState, subscribe } = this.store;
                this.notesCollapser = new ReleaseNotesCollapser();

                setState({
                    isChinese: (navigator.language || navigator.userLanguage).toLowerCase().includes('zh'),
                    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
                });

                this.settings.loadUserSettings();
                this.ui.styles.addGlobalStyles();
                this.utils.checkPageType();

                if (!this.store.state.isMainReleasesPage) {
                    setState({
                        currentUserPlatform: this.utils.getCurrentPlatform(),
                        currentUserArchitecture: await this.utils.getCurrentArchitecture(),
                        currentUserLanguage: this.utils.getCurrentLanguage(),
                        currentUserResolutionCategory: this.utils.getCurrentResolutionCategory()
                    });
                }

                this._unsubscribe = subscribe((currentState) => {
                    this.core.assetFilter.updateAllPlatformOptionsVisualState(currentState);
                    this.core.assetFilter.updateAllArchTagsVisualState(currentState);
                    ['language', 'resolution', 'keyword', 'source'].forEach(type => {
                        const stateKeyMap = { language: 'filterMatchLanguage', resolution: 'filterMatchResolution', keyword: 'hideByKeyword', source: 'hideSourceCode' };
                        this.core.assetFilter.updateSpecificFilterVisualState(type, currentState[stateKeyMap[type]], currentState.filterUIInstance);
                    });
                    this.core.assetFilter.updateActionButtons(currentState);
                    this.core.assetFilter.updateAvailabilityMarkers(currentState);
                    this.ui.styles.updateMaxHeightVar(currentState.releaseNotesMaxHeight);
                    this.core.releaseNotes.initializeExpansion();
                    this.core.assetFilter.filterAssets(currentState);
                    this.core.assetFilter.updateFilterCounter(currentState);
                });

                this.core.releaseNotes.initializeExpansion();

                if (!this.store.state.isMainReleasesPage) {
                    this.core.assetFilter.initialize();
                } else {
                    this.actions.initializeFilterStates();
                }

                this.page.observer.start();

                if (!this._isInitialized) {
                    this.page.navigation.setupListeners();
                    this.settings.registerMenu();
                    this._isInitialized = true;
                }

                this._globalClickHandler = this.core.assetFilter.handleGlobalClick.bind(this.core.assetFilter);
                document.addEventListener('click', this._globalClickHandler);

            } catch (error) {
                console.error(`[GitHub Filter@${location.pathname}] Script initialization error:`, error);
            }
        },
    };

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback();
            return;
        }
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                callback();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function main() {
        waitForElement(GithubReleaseEnhancer.config.SELECTORS.MAIN_REPO_CONTENT, () => {
            GithubReleaseEnhancer.init();
        });
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', main, { once: true });
    }
})();
