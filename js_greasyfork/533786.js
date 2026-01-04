// ==UserScript==
// @name        YouTube コメントと返信を自動展開・翻訳・並び替え ✅
// @name:en     YouTube Auto Expand, Translate & Sort Comments ✅
// @name:ja     YouTube コメントと返信を自動展開・翻訳・並び替え ✅
// @name:zh-CN  YouTube 评论自动展开、翻译与排序 ✅
// @name:zh-TW  YouTube 評論自動展開、翻譯與排序 ✅
// @name:ko     YouTube 댓글 자동 확장, 번역 및 정렬 ✅
// @name:fr     Déploiement, traduction et tri automatique des commentaires YouTube ✅
// @name:es     Expansión, traducción y ordenación automática de comentarios de YouTube ✅
// @name:de     Automatische Erweiterung, Übersetzung und Sortierung von YouTube-Kommentaren ✅
// @name:pt-BR  Expansão, tradução e ordenação automática de comentários do YouTube ✅
// @name:ru     Авторазворачивание, перевод и сортировка комментариев YouTube ✅
// @description YouTubeのコメント・返信・他の返信を自動展開し、翻訳ボタンも自動化。並び替え（新しい順）の自動選択も可能です。
// @description:en Automatically expands comments, replies, and "Show more replies". Also auto-translates comments and sorts by "Newest first".
// @description:ja YouTubeのコメント・返信・他の返信を自動展開し、翻訳ボタンも自動化。並び替え（新しい順）の自動選択も可能です。
// @description:zh-CN 自动展开评论、回复和“显示更多回复”，自动点击翻译按钮，并可选择自动按“最新”排序。
// @description:zh-TW 自動展開評論、回覆和「顯示更多回覆」，自動點擊翻譯按鈕，並可選擇自動按「最新」排序。
// @description:ko YouTube 댓글, 답글 및 "답글 더보기"를 자동 확장하고 번역 버튼을 클릭하며, "최신순" 자동 정렬 기능을 제공합니다.
// @description:fr Déploie automatiquement les commentaires et les réponses. Traduit automatiquement et trie par "Les plus récents".
// @description:es Expande automáticamente comentarios y respuestas. Traduce automáticamente y ordena por "Más recientes".
// @description:de Erweitert automatisch Kommentare und Antworten. Übersetzt automatisch und sortiert nach "Neueste zuerst".
// @description:pt-BR Expande automaticamente comentários e respostas. Traduz automaticamente e ordena por "Mais recentes".
// @description:ru Автоматически разворачивает комментарии и ответы. Выполняет автоперевод и сортирует по "Сначала новые".
// @version     6.2.0
// @namespace    https://github.com/koyasi777/youtube-auto-comment-expander
// @author       koyasi777
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @homepageURL  https://github.com/koyasi777/youtube-auto-comment-expander
// @supportURL   https://github.com/koyasi777/youtube-auto-comment-expander/issues
// @downloadURL https://update.greasyfork.org/scripts/533786/YouTube%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%A8%E8%BF%94%E4%BF%A1%E3%82%92%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%83%BB%E7%BF%BB%E8%A8%B3%E3%83%BB%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88%20%E2%9C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/533786/YouTube%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%A8%E8%BF%94%E4%BF%A1%E3%82%92%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%83%BB%E7%BF%BB%E8%A8%B3%E3%83%BB%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88%20%E2%9C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Internationalization (i18n) Manager
     */
    const I18n = {
        languages: [
            { code: 'auto', label: 'Auto' },
            { code: 'ja', label: '日本語' },
            { code: 'en', label: 'English' },
            { code: 'zh-CN', label: '简体中文' },
            { code: 'zh-TW', label: '繁體中文' },
            { code: 'ko', label: '한국어' },
            { code: 'fr', label: 'Français' },
            { code: 'es', label: 'Español' },
            { code: 'de', label: 'Deutsch' },
            { code: 'pt-BR', label: 'Português (BR)' },
            { code: 'ru', label: 'Русский' }
        ],
        messages: {
            'ja': {
                settingsCommand: '⚙️ 設定 (コンソール)',
                resetCommand: '🗑️ 設定をリセット',
                resetConfirm: '本当に全ての設定をリセットしますか？',
                resetComplete: '設定がリセットされました。ページをリロードして反映させてください。',
                updateComplete: '設定が更新されました。ページをリロードして反映させてください。',
                modalTitle: 'Auto Expand 設定',
                lblLanguage: '言語:',
                tooltipOpenSettings: '詳細設定を開く',
                tooltipToggle: '自動展開を有効/無効にする',
                optLongComments: '長いコメントを展開 ("続きを読む")',
                optReplies: '返信を自動展開',
                optNestedReplies: '「他の返信を表示」も展開',
                optAutoTranslate: 'コメントを自動翻訳',
                optHideOriginal: '└ "原文を見る" を非表示',
                optSortByNewest: '自動で「新しい順」に並び替え'
            },
            'en': {
                settingsCommand: '⚙️ Settings (Console)',
                resetCommand: '🗑️ Reset Settings',
                resetConfirm: 'Are you sure you want to reset all settings?',
                resetComplete: 'Settings reset. Please reload the page.',
                updateComplete: 'Settings updated. Please reload the page.',
                modalTitle: 'Auto Expand Settings',
                lblLanguage: 'Language:',
                tooltipOpenSettings: 'Open Detailed Settings',
                tooltipToggle: 'Toggle Auto Expand On/Off',
                optLongComments: 'Expand long comments ("Read more")',
                optReplies: 'Auto expand replies',
                optNestedReplies: 'Expand "Show more replies"',
                optAutoTranslate: 'Auto translate comments',
                optHideOriginal: '└ Hide "Show original"',
                optSortByNewest: 'Auto sort by "Newest first"'
            },
            'zh-CN': {
                settingsCommand: '⚙️ 设置 (控制台)',
                resetCommand: '🗑️ 重置设置',
                resetConfirm: '确定要重置所有设置吗？',
                resetComplete: '设置已重置。请刷新页面。',
                updateComplete: '设置已更新。请刷新页面。',
                modalTitle: '自动展开设置',
                lblLanguage: '语言:',
                tooltipOpenSettings: '打开详细设置',
                tooltipToggle: '开启/关闭自动展开',
                optLongComments: '展开长评论 ("阅读更多")',
                optReplies: '自动展开回复',
                optNestedReplies: '展开 "显示更多回复"',
                optAutoTranslate: '自动翻译评论',
                optHideOriginal: '└ 隐藏 "查看原文"',
                optSortByNewest: '自动按 "最新" 排序'
            },
            'zh-TW': {
                settingsCommand: '⚙️ 設定 (控制台)',
                resetCommand: '🗑️ 重置設定',
                resetConfirm: '確定要重置所有設定嗎？',
                resetComplete: '設定已重置。請重新整理頁面。',
                updateComplete: '設定已更新。請重新整理頁面。',
                modalTitle: '自動展開設定',
                lblLanguage: '語言:',
                tooltipOpenSettings: '開啟詳細設定',
                tooltipToggle: '開啟/關閉自動展開',
                optLongComments: '展開長留言 ("顯示更多")',
                optReplies: '自動展開回覆',
                optNestedReplies: '展開 "顯示更多回覆"',
                optAutoTranslate: '自動翻譯留言',
                optHideOriginal: '└ 隱藏 "查看原文"',
                optSortByNewest: '自動按 "最新" 排序'
            },
            'ko': {
                settingsCommand: '⚙️ 설정 (콘솔)',
                resetCommand: '🗑️ 설정 초기화',
                resetConfirm: '모든 설정을 초기화하시겠습니까?',
                resetComplete: '설정이 초기화되었습니다. 페이지를 새로 고침하세요.',
                updateComplete: '설정이 업데이트되었습니다. 페이지를 새로 고침하세요.',
                modalTitle: '자동 확장 설정',
                lblLanguage: '언어:',
                tooltipOpenSettings: '상세 설정 열기',
                tooltipToggle: '자동 확장 켜기/끄기',
                optLongComments: '긴 댓글 확장 ("자세히 보기")',
                optReplies: '답글 자동 확장',
                optNestedReplies: '"답글 더보기" 확장',
                optAutoTranslate: '댓글 자동 번역',
                optHideOriginal: '└ "원본 보기" 숨기기',
                optSortByNewest: '자동으로 "최신순" 정렬'
            },
            'fr': {
                settingsCommand: '⚙️ Paramètres (Console)',
                resetCommand: '🗑️ Réinitialiser',
                resetConfirm: 'Voulez-vous vraiment réinitialiser tous les paramètres ?',
                resetComplete: 'Paramètres réinitialisés. Veuillez recharger la page.',
                updateComplete: 'Paramètres mis à jour. Veuillez recharger la page.',
                modalTitle: 'Paramètres Auto Expand',
                lblLanguage: 'Langue:',
                tooltipOpenSettings: 'Ouvrir les paramètres détaillés',
                tooltipToggle: 'Activer/Désactiver l\'extension auto',
                optLongComments: 'Développer les longs commentaires',
                optReplies: 'Développer les réponses',
                optNestedReplies: 'Développer "Afficher d\'autres réponses"',
                optAutoTranslate: 'Traduire automatiquement',
                optHideOriginal: '└ Masquer "Voir l\'original"',
                optSortByNewest: 'Trier auto par "Les plus récents"'
            },
            'es': {
                settingsCommand: '⚙️ Configuración (Consola)',
                resetCommand: '🗑️ Restablecer',
                resetConfirm: '¿Estás seguro de que deseas restablecer toda la configuración?',
                resetComplete: 'Configuración restablecida. Por favor, recarga la página.',
                updateComplete: 'Configuración actualizada. Por favor, recarga la página.',
                modalTitle: 'Configuración de Expansión',
                lblLanguage: 'Idioma:',
                tooltipOpenSettings: 'Abrir configuración detallada',
                tooltipToggle: 'Activar/Desactivar expansión automática',
                optLongComments: 'Expandir comentarios largos ("Leer más")',
                optReplies: 'Expandir respuestas automáticamente',
                optNestedReplies: 'Expandir "Mostrar más respuestas"',
                optAutoTranslate: 'Traducir comentarios automáticamente',
                optHideOriginal: '└ Ocultar "Ver original"',
                optSortByNewest: 'Ordenar auto por "Más recientes"'
            },
            'de': {
                settingsCommand: '⚙️ Einstellungen (Konsole)',
                resetCommand: '🗑️ Zurücksetzen',
                resetConfirm: 'Möchten Sie wirklich alle Einstellungen zurücksetzen?',
                resetComplete: 'Einstellungen zurückgesetzt. Bitte laden Sie die Seite neu.',
                updateComplete: 'Einstellungen aktualisiert. Bitte laden Sie die Seite neu.',
                modalTitle: 'Auto Expand Einstellungen',
                lblLanguage: 'Sprache:',
                tooltipOpenSettings: 'Detaillierte Einstellungen öffnen',
                tooltipToggle: 'Autom. Erweitern Ein/Aus',
                optLongComments: 'Lange Kommentare erweitern ("Mehr anzeigen")',
                optReplies: 'Antworten automatisch erweitern',
                optNestedReplies: '"Weitere Antworten" erweitern',
                optAutoTranslate: 'Kommentare automatisch übersetzen',
                optHideOriginal: '└ "Original ansehen" ausblenden',
                optSortByNewest: 'Autom. nach "Neueste zuerst" sortieren'
            },
            'pt-BR': {
                settingsCommand: '⚙️ Configurações (Console)',
                resetCommand: '🗑️ Redefinir',
                resetConfirm: 'Tem certeza que deseja redefinir todas as configurações?',
                resetComplete: 'Configurações redefinidas. Por favor, recarregue a página.',
                updateComplete: 'Configurações atualizadas. Por favor, recarregue a página.',
                modalTitle: 'Configurações de Expansão',
                lblLanguage: 'Idioma:',
                tooltipOpenSettings: 'Abrir configurações detalhadas',
                tooltipToggle: 'Ativar/Desactivar expansão automática',
                optLongComments: 'Expandir comentários longos ("Ler mais")',
                optReplies: 'Expandir respostas automaticamente',
                optNestedReplies: 'Expandir "Mostrar mais respostas"',
                optAutoTranslate: 'Traduzir comentários automaticamente',
                optHideOriginal: '└ Ocultar "Ver original"',
                optSortByNewest: 'Ordenar auto por "Mais recentes"'
            },
            'ru': {
                settingsCommand: '⚙️ Настройки (Консоль)',
                resetCommand: '🗑️ Сбросить настройки',
                resetConfirm: 'Вы уверены, что хотите сбросить все настройки?',
                resetComplete: 'Настройки сброшены. Пожалуйста, перезагрузите страницу.',
                updateComplete: 'Настройки обновлены. Пожалуйста, перезагрузите страницу.',
                modalTitle: 'Настройки авторазворачивания',
                lblLanguage: 'Язык:',
                tooltipOpenSettings: 'Открыть подробные настройки',
                tooltipToggle: 'Вкл/Выкл авторазворачивание',
                optLongComments: 'Разворачивать длинные комментарии ("Читать дальше")',
                optReplies: 'Автоматически разворачивать ответы',
                optNestedReplies: 'Разворачивать "Показать другие ответы"',
                optAutoTranslate: 'Автоперевод комментариев',
                optHideOriginal: '└ Скрыть "Показать оригинал"',
                optSortByNewest: 'Автосортировка "Сначала новые"'
            }
        },
        getCurrentLangCode: function() {
            if (typeof configManager !== 'undefined') {
                const userLang = configManager.get('userLanguage');
                if (userLang && userLang !== 'auto') return userLang;
            }
            return navigator.language || navigator.userLanguage || 'en';
        },
        t: function(key) {
            const code = this.getCurrentLangCode();
            let dict = this.messages[code] || this.messages[code.slice(0, 2)] || this.messages['en'];
            return dict[key] || key;
        }
    };

    class ConfigManager {
        constructor() {
            this.defaults = {
                scriptEnabled: true,
                userLanguage: 'auto',
                debugMode: false,
                initialDelay: 2500,
                clickInterval: 130,
                expandLongComments: true,
                expandReplies: true,
                expandNestedReplies: true,
                autoTranslate: true,
                hideOriginalButton: false,
                sortByNewest: false
            };
            this.config = {};
            this.menuIds = [];
            this.load();
        }
        load() { for (const key in this.defaults) this.config[key] = GM_getValue(key, this.defaults[key]); }
        get(key) { return this.config[key]; }
        set(key, value) { this.config[key] = value; GM_setValue(key, value); }
        reset() { for (const key in this.defaults) this.set(key, this.defaults[key]); }

        registerMenu() {
            if (typeof GM_unregisterMenuCommand === 'function') {
                this.menuIds.forEach(id => GM_unregisterMenuCommand(id));
                this.menuIds = [];
            }
            this.menuIds.push(GM_registerMenuCommand(I18n.t('settingsCommand'), () => this.showSettingsPrompt()));
            this.menuIds.push(GM_registerMenuCommand(I18n.t('resetCommand'), () => {
                if (confirm(I18n.t('resetConfirm'))) {
                    this.reset();
                    alert(I18n.t('resetComplete'));
                    location.reload();
                }
            }));
        }

        showSettingsPrompt() {
            const newSettings = {};
            for (const key in this.defaults) {
                const currentValue = this.get(key), type = typeof this.defaults[key];
                let newValue = prompt(`${key} (${type}) [Default: ${this.defaults[key]}]\nCurrent: ${currentValue}`, currentValue);
                if (newValue === null) return;
                if (type === 'boolean') newSettings[key] = newValue.toLowerCase() === 'true';
                else if (type === 'number') { newSettings[key] = parseInt(newValue, 10); if (isNaN(newSettings[key])) newSettings[key] = this.defaults[key]; }
                else newSettings[key] = newValue;
            }
            for (const key in newSettings) this.set(key, newSettings[key]);
            this.registerMenu();
            if (uiManager) uiManager.updateAllText();
            alert(I18n.t('updateComplete'));
        }
    }

    class YouTubeCommentExpander {
        constructor(config) {
            this.config = config;
            this.mainObserver = null;
            this.actionObserver = null;
            this.readMoreObserver = null;
            this.sortRetryTimer = null;
            this.rules = [
                { name: 'ExpandReplies', selector: '#more-replies, #more-replies-sub-thread', condition: () => this.config.get('expandReplies') },
                { name: 'ExpandNestedReplies', selector: 'ytd-comment-replies-renderer ytd-continuation-item-renderer', condition: () => this.config.get('expandNestedReplies') },
                { name: 'AutoTranslate', selector: 'ytd-comment-view-model .translate-button[state="untoggled"]', condition: () => this.config.get('autoTranslate') }
            ];
        }

        log(level, ...args) { if (!this.config.get('debugMode')) return; console.log(`[YTCE:${level.toUpperCase()}]`, ...args); }

        setupObservers() {
            this.actionObserver = new IntersectionObserver(async (entries, observer) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && this.config.get('scriptEnabled')) {
                        const target = entry.target;
                        observer.unobserve(target);
                        this.log('debug', 'Action target in view, clicking.', target);
                        await new Promise(resolve => setTimeout(resolve, this.config.get('clickInterval')));
                        const clickable = target.querySelector('button, tp-yt-paper-button') || target.querySelector('yt-button-shape') || target;
                        clickable.click();
                    }
                }
            }, { rootMargin: '0px 0px 500px 0px' });

            this.readMoreObserver = new IntersectionObserver(async (entries, observer) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && this.config.get('scriptEnabled') && this.config.get('expandLongComments')) {
                        const button = entry.target;
                        observer.unobserve(button);
                        this.log('debug', 'ReadMore button in view, clicking.', button);
                        await new Promise(resolve => setTimeout(resolve, this.config.get('clickInterval')));
                        button.click();
                        await new Promise(resolve => setTimeout(resolve, 200));
                        const commentViewModel = button.closest('ytd-comment-view-model, ytd-comment-renderer');
                        if (commentViewModel) {
                            const lessButton = commentViewModel.querySelector('.less-button, tp-yt-paper-button#less');
                            if (lessButton) lessButton.style.display = 'none';
                        }
                    }
                }
            }, { threshold: 0.1 });
        }

        observeNewNodes(node) {
            if (!(node instanceof Element)) return;
            for (const rule of this.rules) {
                if (rule.condition()) {
                    if (node.matches(rule.selector)) this.actionObserver.observe(node);
                    node.querySelectorAll(rule.selector).forEach(el => this.actionObserver.observe(el));
                }
            }
            if (this.readMoreObserver) {
                const readMoreSelector = 'ytd-expander tp-yt-paper-button#more, .more-button.ytd-comment-view-model';
                if (node.matches(readMoreSelector)) this.readMoreObserver.observe(node);
                node.querySelectorAll(readMoreSelector).forEach(btn => this.readMoreObserver.observe(btn));
            }
        }

        processExistingNodes(container) {
            this.log('info', 'Settings changed. Re-processing existing nodes...');
            this.observeNewNodes(container);
        }

        // =========================================================================
        //  Enhanced Sort Logic with Retry Mechanism
        // =========================================================================
        initiateSortSequence(container) {
            if (!this.config.get('scriptEnabled') || !this.config.get('sortByNewest')) return;
            // Only applicable on Watch page standard comments
            if (!location.pathname.startsWith('/watch')) return;

            this.log('info', 'Sort sequence initiated. Polling for sort menu...');
            if (this.sortRetryTimer) clearTimeout(this.sortRetryTimer);

            // Retry for up to 20 attempts (approx 10 seconds)
            this.performSortAttempt(container, 0, 20);
        }

        async performSortAttempt(container, attempt, maxAttempts) {
            if (attempt >= maxAttempts) {
                this.log('warn', 'Sort menu never appeared or remained invalid. Giving up.');
                return;
            }

            const sortMenu = container.querySelector('#sort-menu');
            // If sort menu is not found or not visible yet
            if (!sortMenu || sortMenu.offsetParent === null) {
                this.sortRetryTimer = setTimeout(() => this.performSortAttempt(container, attempt + 1, maxAttempts), 500);
                return;
            }

            const trigger = sortMenu.querySelector('yt-sort-filter-sub-menu-renderer tp-yt-dropdown-menu #trigger, #trigger');
            if (!trigger) {
                this.sortRetryTimer = setTimeout(() => this.performSortAttempt(container, attempt + 1, maxAttempts), 500);
                return;
            }

            // Trigger found. Now checking state.
            this.log('debug', `Sort menu found on attempt ${attempt + 1}. Checking state...`);

            // Step 1: Open menu to populate items (essential for YouTube's lazy polymer)
            trigger.click();

            // Step 2: Short wait for DOM to hydrate items
            await new Promise(r => setTimeout(r, 100));

            const menuList = sortMenu.querySelector('tp-yt-paper-listbox#menu');
            if (!menuList) {
                // Should fail gracefully and close if something is wrong
                trigger.click(); // close attempts
                this.sortRetryTimer = setTimeout(() => this.performSortAttempt(container, attempt + 1, maxAttempts), 500);
                return;
            }

            const items = menuList.querySelectorAll('a.yt-simple-endpoint');
            if (items.length >= 2) {
                const newestItem = items[1]; // Usually 2nd option
                const isSelected = newestItem.classList.contains('iron-selected') || newestItem.querySelector('tp-yt-paper-item.iron-selected');

                if (isSelected) {
                    this.log('info', 'Already sorted by Newest. Closing menu.');
                    // Close the menu by clicking the trigger again or background
                    // Clicking trigger again is safer
                    trigger.click();
                } else {
                    this.log('info', 'Sorting by Newest...');
                    newestItem.click(); // This triggers reload.
                    // No further retries needed as page/comments will reload
                }
            } else {
                 // Items not ready? Close and retry.
                 trigger.click();
                 this.sortRetryTimer = setTimeout(() => this.performSortAttempt(container, attempt + 1, maxAttempts), 500);
            }
        }
        // =========================================================================

        start(commentsContainer) {
            if (!this.config.get('scriptEnabled')) {
                this.log('info', 'Script is disabled by toggle, not starting.');
                return false;
            }
            if (!commentsContainer) { this.log('error', 'start() called without a valid container.'); return false; }

            this.stop();
            this.log('info', 'Comment container found. Starting observers.', commentsContainer);

            // Initiate Sort with Retry Logic
            this.initiateSortSequence(commentsContainer);

            this.setupObservers();
            this.observeNewNodes(commentsContainer);
            this.mainObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) this.observeNewNodes(node);
                }
            });
            this.mainObserver.observe(commentsContainer, { childList: true, subtree: true });
            this.log('info', 'All observers started.');
            return true;
        }

        stop() {
            if (this.mainObserver) { this.mainObserver.disconnect(); this.mainObserver = null; }
            if (this.actionObserver) { this.actionObserver.disconnect(); this.actionObserver = null; }
            if (this.readMoreObserver) { this.readMoreObserver.disconnect(); this.readMoreObserver = null; }
            if (this.sortRetryTimer) { clearTimeout(this.sortRetryTimer); this.sortRetryTimer = null; }
            this.log('info', 'All observers stopped and state reset.');
        }
    }

    class UIManager {
        constructor(configManager, expander) {
            this.configManager = configManager;
            this.expander = expander;
            this.toggleContainerId = 'ytce-toggle-container';
            this.modalId = 'ytce-settings-modal';
            this.toggle = null;
            this.modalElements = {};
            this.uiObserver = null;
            this.pendingWait = null; // 待機プロセス管理用
            this.staticIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>`;
            this.injectStyles();
        }

        injectStyles() {
            GM_addStyle(`
                /* Toolbar Toggle Container */
                #${this.toggleContainerId} {
                    position: relative; display: flex; align-items: center; margin-left: 16px;
                    border: 1px solid var(--yt-spec-mono-10, #ccc); border-radius: 16px;
                    padding: 2px 8px; height: 30px; cursor: default;
                    background-color: var(--yt-spec-badge-chip-background, #f2f2f2);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
                    -webkit-tap-highlight-color: transparent;
                }
                /* Shorts specific styles */
                ytd-engagement-panel-title-header-renderer #${this.toggleContainerId} {
                    margin-left: 8px;
                    transform: scale(0.9);
                }
                #${this.toggleContainerId}:hover {
                    background-color: var(--yt-spec-mono-15, #e0e0e0);
                }
                #${this.toggleContainerId}.ytce-active {
                    background-color: var(--yt-spec-badge-chip-background, #f2f2f2);
                    border-color: var(--yt-spec-brand-button-background, #1c62b9);
                }
                .ytce-toggle-icon {
                    width: 20px; height: 20px; margin-right: 8px;
                    display: flex; align-items: center; cursor: pointer;
                    border-radius: 50%; padding: 2px;
                }
                .ytce-toggle-icon:hover {
                    background-color: rgba(0,0,0,0.1);
                }
                .ytce-toggle-icon svg {
                    width: 18px; height: 18px;
                    fill: var(--yt-spec-icon-inactive, #606060);
                    transition: fill 0.2s ease-in-out;
                }
                #${this.toggleContainerId}.ytce-active .ytce-toggle-icon svg {
                    fill: var(--yt-spec-brand-button-background, #065fd4);
                }
                .ytce-toggle-switch {
                    position: relative; display: inline-block; width: 28px; height: 14px; cursor: pointer;
                }
                .ytce-toggle-slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #aaa; transition: .3s; border-radius: 14px;
                }
                .ytce-toggle-slider:before {
                    position: absolute; content: ""; height: 10px; width: 10px;
                    left: 2px; bottom: 2px; background-color: white;
                    transition: .3s; border-radius: 50%;
                }
                input:checked + .ytce-toggle-slider {
                    background-color: var(--yt-spec-call-to-action, #065fd4);
                }
                input:checked + .ytce-toggle-slider:before {
                    transform: translateX(14px);
                }
                #${this.toggleContainerId} .ytce-toggle-switch input {
                    opacity: 0 !important; width: 0 !important; height: 0 !important;
                    position: absolute !important; z-index: -1 !important; pointer-events: none !important;
                }

                /* Modal Styles */
                .ytce-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 99999;
                    display: none;
                    justify-content: center; align-items: center;
                    backdrop-filter: blur(2px);
                }
                .ytce-modal-overlay.visible { display: flex; }

                .ytce-modal {
                    background: var(--yt-spec-base-background, #fff);
                    color: var(--yt-spec-text-primary, #0f0f0f);
                    width: 450px; max-width: 90%;
                    border-radius: 12px;
                    box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
                    display: flex; flex-direction: column;
                    border: 1px solid var(--yt-spec-10-percent-layer, #e5e5e5);
                    animation: ytceFadeIn 0.2s ease-out;
                }
                @keyframes ytceFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .ytce-modal-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 16px 24px;
                    border-bottom: 1px solid var(--yt-spec-10-percent-layer, #e5e5e5);
                }
                .ytce-header-left {
                    display: flex; align-items: center; gap: 12px;
                }
                .ytce-modal-title {
                    font-size: 1.8rem; font-weight: 500;
                    color: var(--yt-spec-text-primary, #0f0f0f);
                    margin-right: 12px;
                }

                /* Language Label */
                .ytce-lang-label {
                    font-size: 1.3rem;
                    color: var(--yt-spec-text-secondary, #606060);
                    margin-right: 4px;
                }

                /* Language Select Fixed */
                .ytce-lang-select {
                    padding: 4px 8px; border-radius: 4px;
                    border: 1px solid var(--yt-spec-10-percent-layer, #ccc);
                    background-color: var(--yt-spec-menu-background, #fff);
                    color: var(--yt-spec-text-primary, #0f0f0f);
                    font-size: 1.2rem; cursor: pointer;
                    outline: none;
                }
                .ytce-lang-select:focus {
                    border-color: var(--yt-spec-call-to-action, #065fd4);
                }
                .ytce-lang-select option {
                    background-color: var(--yt-spec-menu-background, #fff);
                    color: var(--yt-spec-text-primary, #0f0f0f);
                }

                .ytce-close-btn {
                    background: none; border: none; cursor: pointer;
                    width: 36px; height: 36px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    transition: background-color 0.2s;
                }
                .ytce-close-btn:hover {
                    background-color: var(--yt-spec-10-percent-layer, #f2f2f2);
                }
                .ytce-close-btn svg {
                    width: 24px; height: 24px;
                    fill: var(--yt-spec-icon-active-other, #606060);
                }

                .ytce-modal-content {
                    padding: 8px 0;
                    overflow-y: auto; max-height: 70vh;
                }

                .ytce-menu-item {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 12px 24px; cursor: pointer; user-select: none;
                    transition: background-color 0.1s;
                }
                .ytce-menu-item:hover {
                    background-color: var(--yt-spec-10-percent-layer, #f2f2f2);
                }
                .ytce-menu-label { flex: 1; margin-right: 12px; font-size: 1.4rem; }
                .ytce-menu-checkbox {
                    width: 20px; height: 20px; accent-color: var(--yt-spec-call-to-action, #065fd4);
                    cursor: pointer;
                }

                body.ytce-hide-original ytd-tri-state-button-view-model.translate-button[state="toggled"] {
                    display: none !important;
                }
            `);
        }

        createToggleElement() {
            const existingToggle = document.getElementById(this.toggleContainerId);
            if (existingToggle) {
                existingToggle.remove();
            }
            const container = document.createElement('div');
            container.id = this.toggleContainerId;

            const iconDiv = document.createElement('div');
            iconDiv.className = 'ytce-toggle-icon';
            iconDiv.innerHTML = this.staticIcon;
            iconDiv.title = I18n.t('tooltipOpenSettings');
            iconDiv.onclick = (e) => {
                e.stopPropagation();
                this.openModal();
            };
            this.modalElements.iconDiv = iconDiv;

            const switchLabel = document.createElement('label');
            switchLabel.className = 'ytce-toggle-switch';
            switchLabel.title = I18n.t('tooltipToggle');
            this.modalElements.switchLabel = switchLabel;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const slider = document.createElement('span');
            slider.className = 'ytce-toggle-slider';
            switchLabel.append(checkbox, slider);
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                e.target.blur();
                this.onMasterToggleChange(checkbox.checked);
            });

            container.append(iconDiv, switchLabel);
            this.toggle = { container, checkbox, iconDiv };

            const initialState = this.configManager.get('scriptEnabled');
            checkbox.checked = initialState;
            this.updateToggleVisuals(initialState);
            if (this.configManager.get('hideOriginalButton')) {
                document.body.classList.add('ytce-hide-original');
            }

            this.createModal();
            return container;
        }

        createModal() {
            const existingModal = document.getElementById(this.modalId);
            if (existingModal) {
                existingModal.remove();
            }

            const overlay = document.createElement('div');
            overlay.id = this.modalId;
            overlay.className = 'ytce-modal-overlay';
            overlay.onclick = (e) => {
                if (e.target === overlay) this.closeModal();
            };

            const modal = document.createElement('div');
            modal.className = 'ytce-modal';

            // ヘッダー
            const header = document.createElement('div');
            header.className = 'ytce-modal-header';

            const leftGroup = document.createElement('div');
            leftGroup.className = 'ytce-header-left';

            // タイトル
            const title = document.createElement('div');
            title.className = 'ytce-modal-title';
            this.modalElements.title = title;

            // 言語ラベル
            const langLabel = document.createElement('span');
            langLabel.className = 'ytce-lang-label';
            this.modalElements.langLabel = langLabel;

            // 言語選択
            const langSelect = document.createElement('select');
            langSelect.className = 'ytce-lang-select';
            I18n.languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.label;
                langSelect.appendChild(option);
            });
            langSelect.value = this.configManager.get('userLanguage');

            langSelect.onchange = (e) => {
                this.configManager.set('userLanguage', e.target.value);
                this.updateAllText();
                this.configManager.registerMenu();
                this.expander.log('info', `Language changed to: ${e.target.value}`);
            };

            leftGroup.append(title, langLabel, langSelect);

            const closeBtn = document.createElement('button');
            closeBtn.className = 'ytce-close-btn';
            closeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
            closeBtn.onclick = () => this.closeModal();

            header.append(leftGroup, closeBtn);

            // コンテンツ
            const content = document.createElement('div');
            content.className = 'ytce-modal-content';
            this.modalElements.content = content;

            modal.append(header, content);
            overlay.append(modal);
            document.body.appendChild(overlay);

            this.toggle.modalOverlay = overlay;

            this.renderModalContent();
            this.updateAllText();
        }

        renderModalContent() {
            if (!this.modalElements.content) return;
            this.modalElements.content.innerHTML = '';

            const menuItems = [
                { key: 'expandLongComments', label: I18n.t('optLongComments') },
                { key: 'expandReplies', label: I18n.t('optReplies') },
                { key: 'expandNestedReplies', label: I18n.t('optNestedReplies') },
                { key: 'autoTranslate', label: I18n.t('optAutoTranslate') },
                { key: 'hideOriginalButton', label: I18n.t('optHideOriginal'), indent: true },
                { key: 'sortByNewest', label: I18n.t('optSortByNewest') }
            ];

            menuItems.forEach(item => {
                const row = document.createElement('div');
                row.className = 'ytce-menu-item';
                if (item.indent) {
                    row.style.paddingLeft = '48px';
                    row.style.color = 'var(--yt-spec-text-secondary, #606060)';
                }

                const label = document.createElement('span');
                label.className = 'ytce-menu-label';
                label.textContent = item.label;

                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.className = 'ytce-menu-checkbox';
                chk.checked = this.configManager.get(item.key);

                chk.onchange = (e) => {
                    const checked = e.target.checked;
                    this.configManager.set(item.key, checked);
                    if (item.key === 'hideOriginalButton') {
                        document.body.classList.toggle('ytce-hide-original', checked);
                    } else if (checked) {
                        const container = getCurrentCommentsContainer();
                        if (container) {
                            if (item.key === 'sortByNewest') {
                                this.expander.initiateSortSequence(container);
                            } else {
                                this.expander.processExistingNodes(container);
                            }
                        }
                    }
                };

                row.onclick = (e) => {
                    if (e.target !== chk) {
                        chk.checked = !chk.checked;
                        chk.dispatchEvent(new Event('change'));
                    }
                };

                row.append(label, chk);
                this.modalElements.content.append(row);
            });
        }

        updateAllText() {
            if (this.modalElements.title) this.modalElements.title.textContent = I18n.t('modalTitle');
            if (this.modalElements.langLabel) this.modalElements.langLabel.textContent = I18n.t('lblLanguage'); // ラベル更新
            if (this.modalElements.iconDiv) this.modalElements.iconDiv.title = I18n.t('tooltipOpenSettings');
            if (this.modalElements.switchLabel) this.modalElements.switchLabel.title = I18n.t('tooltipToggle');
            this.renderModalContent();
        }

        openModal() {
            if (this.toggle && this.toggle.modalOverlay) {
                this.toggle.modalOverlay.classList.add('visible');
            }
        }

        closeModal() {
            if (this.toggle && this.toggle.modalOverlay) {
                this.toggle.modalOverlay.classList.remove('visible');
            }
        }

        onMasterToggleChange(isEnabled) {
            this.configManager.set('scriptEnabled', isEnabled);
            this.updateToggleVisuals(isEnabled);
            this.expander.log('info', `Script ${isEnabled ? 'enabled' : 'disabled'} by toggle.`);
            if (isEnabled) {
                const commentsContainer = getCurrentCommentsContainer();
                if (commentsContainer) this.expander.start(commentsContainer);
            } else {
                this.expander.stop();
            }
        }

        updateToggleVisuals(isEnabled) {
            if (!this.toggle) return;
            this.toggle.container.classList.toggle('ytce-active', isEnabled);
        }

        observeCommentsHeader(containerSelector, sortMenuSelector, sortMenuLabelSelector, insertMode) {
            // 前の待機処理をキャンセル（重複防止）
            if (this.pendingWait) {
                this.pendingWait.abort();
            }

            // コンテナが出現するのを待機
            this.pendingWait = waitForElement(containerSelector, (container) => {
                this.pendingWait = null;

                // コンテナが見つかったので、ここでExpanderも起動する (Logicの一元化)
                if (this.configManager.get('scriptEnabled')) {
                    this.expander.start(container);
                }

                this.stopUIObserver(); // 既存のUI監視があれば停止

                // UIの注入処理
                const updateUI = () => this.updateCommentsHeaderUI(container, sortMenuSelector, sortMenuLabelSelector, insertMode);
                this.uiObserver = new MutationObserver(updateUI);
                this.uiObserver.observe(container, { childList: true, subtree: true });
                updateUI();
                this.expander.log('info', `UI Observer started for "${containerSelector}".`);
            });
        }

        updateCommentsHeaderUI(container, sortMenuSelector, sortMenuLabelSelector, insertMode) {
            // Find the Sort Menu WITHIN the specific container
            const sortMenu = container.querySelector(sortMenuSelector);
            if (!sortMenu) return;

            if (!document.getElementById(this.toggleContainerId)) {
                const toggleElement = this.createToggleElement();
                if (toggleElement) {
                    if (insertMode === 'append') {
                        sortMenu.parentElement.appendChild(toggleElement);
                    } else if (insertMode === 'after') {
                        sortMenu.insertAdjacentElement('afterend', toggleElement);
                    }
                    this.expander.log('debug', 'Toggle UI injected.');
                }
            }

            // Hide the label if needed (for Watch page mainly)
            if (sortMenuLabelSelector) {
                const label = container.querySelector(sortMenuLabelSelector);
                if (label && label.style.display !== 'none') {
                    label.style.display = 'none';
                    this.expander.log('debug', 'Sort menu label hidden.');
                }
            }
        }

        initForWatchPage() {
            this.observeCommentsHeader(
                'ytd-comments#comments',
                '#sort-menu',
                '#sort-menu #icon-label',
                'append'
            );
        }

        initForShortsPage() {
            // Shorts uses engagement panel
            this.observeCommentsHeader(
                'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]',
                'ytd-engagement-panel-title-header-renderer #menu', // Insert relative to the menu container
                null, // No label to hide in shorts typically or selector is different
                'after' // Insert after the #menu div (between Sort and Close button)
            );
        }

        stopUIObserver() {
            if (this.uiObserver) {
                this.uiObserver.disconnect();
                this.uiObserver = null;
                this.expander.log('info', 'UI Observer stopped.');
            }
        }

        stop() {
            // 待機中の検索を中止 (waitForElementのキャンセル)
            if (this.pendingWait) {
                this.pendingWait.abort();
                this.pendingWait = null;
            }

            this.stopUIObserver();

            const modal = document.getElementById(this.modalId);
            if (modal) modal.remove();

            const toggle = document.getElementById(this.toggleContainerId);
            if (toggle) toggle.remove();
        }
    }

    const configManager = new ConfigManager();
    let expander = null;
    let uiManager = null;
    let currentPath = '';
    let initTimer = null; // Timer ID for debounce/cleanup

    function waitForElement(selector, callback, timeout = 15000) {
        let timeoutId = null;
        let observer = null;
        let isAborted = false;

        const abort = () => {
            if (isAborted) return;
            isAborted = true;
            if (timeoutId) clearTimeout(timeoutId);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };

        // 即時チェック
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return { abort: () => {} };
        }

        observer = new MutationObserver((mutations) => {
            if (isAborted) return;
            const el = document.querySelector(selector);
            if (el) {
                abort();
                callback(el);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        timeoutId = setTimeout(() => {
            if (!isAborted) {
                if (typeof expander !== 'undefined' && expander) {
                    expander.log('warn', `waitForElement timed out for selector: ${selector}`);
                }
                abort();
            }
        }, timeout);

        return { abort };
    }

    function getCurrentCommentsContainer() {
        if (location.pathname.startsWith('/watch')) {
            return document.querySelector('ytd-comments#comments');
        } else if (location.pathname.startsWith('/shorts/')) {
            return document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]');
        }
        return null;
    }

    function initializeScript() {
        const path = location.pathname + location.search;
        if (currentPath === path && expander) return;
        currentPath = path;

        // 前の初期化待機をキャンセル
        if (initTimer) {
            clearTimeout(initTimer);
            initTimer = null;
        }

        // 既存インスタンスの完全破棄
        if (expander) {
            expander.stop();
            expander = null;
        }
        if (uiManager) {
            uiManager.stop(); // ここで waitForElement も abort される
            uiManager = null;
        }

        expander = new YouTubeCommentExpander(configManager);
        uiManager = new UIManager(configManager, expander);

        configManager.registerMenu();

        initTimer = setTimeout(() => {
            initTimer = null;

            if (location.pathname.startsWith('/shorts/')) {
                expander.log('info', 'Shorts page detected. Initializing...');
                // UIManagerに処理を委譲 (内部で waitForElement -> expander.start を実行)
                uiManager.initForShortsPage();
            } else if (location.pathname.startsWith('/watch')) {
                expander.log('info', 'Watch page detected. Initializing...');
                uiManager.initForWatchPage();
            } else {
                expander.log('info', 'Not a watch/shorts page. Script is idle.');
            }
        }, configManager.get('initialDelay'));
    }

    window.addEventListener('yt-navigate-finish', initializeScript, true);
    initializeScript();

})();
