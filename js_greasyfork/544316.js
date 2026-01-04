// ==UserScript==
// @name         YouTubeコメント欄を拡大・縮小 🎥
// @name:ja      YouTubeコメント欄を拡大・縮小 🎥
// @name:en      Zoom Controls for YouTube Comments 🎥
// @name:zh-CN   YouTube评论区缩放控制 🎥
// @name:zh-TW   YouTube留言區縮放控制 🎥
// @name:ko      YouTube 댓글 확대/축소 제어 🎥
// @name:fr      Contrôle du zoom pour les commentaires YouTube 🎥
// @name:es      Control de zoom en comentarios de YouTube 🎥
// @name:de      Zoom-Steuerung für YouTube-Kommentare 🎥
// @name:pt-BR   Controle de zoom nos comentários do YouTube 🎥
// @name:ru      Управление масштабом комментариев на YouTube 🎥
// @version      2.2.0
// @description         YouTubeのコメント欄を拡大・縮小するUIを追加！ホイールでズーム、クリックでリセット。状態は保存されます。
// @description:ja      YouTubeのコメント欄を拡大・縮小するUIを追加！ホイールでズーム、クリックでリセット。状態は保存されます。
// @description:en      Adds zoom controls to YouTube comments! Scroll to zoom in/out, click to reset. Zoom level is saved.
// @description:zh-CN   为YouTube评论区添加缩放控件！滚轮缩放，点击重置，缩放等级会被保存。
// @description:zh-TW   為YouTube留言區新增縮放控制！滾輪縮放，點擊重設，縮放設定會被儲存。
// @description:ko      YouTube 댓글에 확대/축소 UI 추가! 스크롤로 조절, 클릭으로 리셋. 설정은 저장됩니다.
// @description:fr      Ajoute un contrôle de zoom aux commentaires YouTube ! Molette pour zoomer, clic pour réinitialiser. Niveau de zoom sauvegardé.
// @description:es      Agrega controles de zoom a los comentarios de YouTube. Rueda para ampliar/reducir, clic para restablecer. El nivel se guarda.
// @description:de      Fügt Zoomsteuerung für YouTube-Kommentare hinzu! Scrollen zum Zoomen, Klick zum Zurücksetzen. Zoom-Level wird gespeichert.
// @description:pt-BR   Adiciona controles de zoom aos comentários do YouTube! Role para ajustar, clique para redefinir. Nível salvo.
// @description:ru      Добавляет управление масштабом к комментариям на YouTube. Прокрутка — зум, клик — сброс. Уровень сохраняется.
// @namespace    https://github.com/koyasi777/youtube-comment-zoom-control
// @author       koyasi777
// @match        *://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @compatible   firefox
// @homepageURL  https://github.com/koyasi777/youtube-comment-zoom-control
// @supportURL   https://github.com/koyasi777/youtube-comment-zoom-control/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/544316/YouTube%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%AC%84%E3%82%92%E6%8B%A1%E5%A4%A7%E3%83%BB%E7%B8%AE%E5%B0%8F%20%F0%9F%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/544316/YouTube%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%AC%84%E3%82%92%E6%8B%A1%E5%A4%A7%E3%83%BB%E7%B8%AE%E5%B0%8F%20%F0%9F%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class CommentZoomManager {
        // --- 1. 設定 (Configuration) ---
        constructor() {
            this.pageType = this.getPageType();
            this.containerSelector = '';
            this.injectionTargetSelector = '';
            this.zoomTargetSelector = '';

            this.SCRIPT_ID = 'youtube-comment-zoom-controls-container';
            this.STYLE_ID = 'youtube-comment-zoom-style-sheet';
            this.ZOOM_STORAGE_KEY = 'yt-comment-zoom-level';
            this.DEFAULT_ZOOM = 100;
            this.MIN_ZOOM = 50;
            this.MAX_ZOOM = 200;
            this.ZOOM_STEP = 5;

            // ツールチップの文言を定義
            this.tooltips = {
                ja: 'スクロールで拡大縮小 / クリックでリセット',
                en: 'Scroll to zoom / Click to reset'
            };

            this.setSelectors();
            this.currentZoom = this.DEFAULT_ZOOM;
            this.uiObserver = null;
        }

        // --- 2. 初期化と破棄 (Initialization & Destruction) ---
        async init() {
            if (!this.pageType) {
                console.log('[CommentZoom] Not a watch or shorts page. Skipping initialization.');
                return;
            }
            await this.loadZoomState();
            this.injectStyles();
            this.observeHeader();
            console.log(`[CommentZoom] Initialized for ${this.pageType} page with zoom: ${this.currentZoom}%`);
        }

        stop() {
            if (this.uiObserver) {
                this.uiObserver.disconnect();
                this.uiObserver = null;
                console.log('[CommentZoom] Observer stopped.');
            }
        }

        getPageType() {
            if (location.pathname.startsWith('/watch')) return 'watch';
            if (location.pathname.startsWith('/shorts')) return 'shorts';
            return null;
        }

        setSelectors() {
            switch (this.pageType) {
                case 'watch':
                    this.containerSelector = 'ytd-comments#comments';
                    this.injectionTargetSelector = 'ytd-comments-header-renderer #sort-menu';
                    this.zoomTargetSelector = 'ytd-comment-thread-renderer:not([is-sub-thread])';
                    break;
                case 'shorts':
                    this.containerSelector = 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]';
                    this.injectionTargetSelector = 'ytd-engagement-panel-title-header-renderer #menu';
                    this.zoomTargetSelector = 'ytd-comment-thread-renderer:not([is-sub-thread])';
                    break;
            }
        }

        // --- 3. 状態管理 (State Management) ---
        async loadZoomState() {
            let storedZoom = await GM_getValue(this.ZOOM_STORAGE_KEY, this.DEFAULT_ZOOM);
            if (typeof storedZoom !== 'number' || isNaN(storedZoom)) {
                storedZoom = this.DEFAULT_ZOOM;
            }
            this.currentZoom = storedZoom;
        }

        async saveZoomState() {
            await GM_setValue(this.ZOOM_STORAGE_KEY, this.currentZoom);
        }

        // --- 4. スタイル管理 (Style Management) ---
        injectStyles() {
            if (document.getElementById(this.STYLE_ID)) {
                this.updateZoomStyle();
                return;
            }
            const styleElement = document.createElement('style');
            styleElement.id = this.STYLE_ID;
            (document.head || document.documentElement).appendChild(styleElement);
            this.updateZoomStyle();
        }

        updateZoomStyle() {
            const styleElement = document.getElementById(this.STYLE_ID);
            if (!styleElement) return;

            const staticStyles = `
                ytd-comments-header-renderer #sort-menu #icon-label,
                ytd-engagement-panel-title-header-renderer #menu #label { font-size: 10.5px !important; }
                ytd-comments-header-renderer h2#count yt-formatted-string.count-text { font-size: 1.48rem !important; }
            `;
            const dynamicZoomStyle = this.currentZoom === 100 ? '' :
                `${this.zoomTargetSelector} { zoom: ${this.currentZoom}%; }`;
            styleElement.textContent = staticStyles + dynamicZoomStyle;
        }

        // --- 5. UIの生成とイベントハンドリング (UI Creation & Event Handling) ---
        createZoomControls() {
            const container = document.createElement('div');
            container.id = this.SCRIPT_ID;
            Object.assign(container.style, {
                position: 'relative', // ツールチップの基準点として必要
                display: 'flex', alignItems: 'center', marginLeft: '8px', padding: '4px 8px',
                borderRadius: '8px', transition: 'background-color 0.2s', cursor: 'pointer', userSelect: 'none'
            });

            // ツールチップをYT標準コンポーネントで作成
            const tooltip = document.createElement('tp-yt-paper-tooltip');
            tooltip.setAttribute('role', 'tooltip');
            const tooltipText = document.createElement('div');
            tooltipText.id = 'tooltip';
            tooltipText.className = 'style-scope tp-yt-paper-tooltip';
            const lang = document.documentElement.lang.startsWith('ja') ? 'ja' : 'en';
            tooltipText.textContent = this.tooltips[lang];
            tooltip.appendChild(tooltipText);

            const zoomIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            zoomIcon.setAttribute('viewBox', '0 0 24 24');
            Object.assign(zoomIcon.style, {
                width: '18px', height: '18px', marginRight: '6px',
                fill: 'var(--yt-spec-text-secondary)', transition: 'fill 0.2s',
            });
            zoomIcon.innerHTML = `<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>`;

            const zoomDisplay = document.createElement('div');
            Object.assign(zoomDisplay.style, {
                color: 'var(--yt-spec-text-secondary)', fontSize: '14px', fontWeight: '500',
                fontVariantNumeric: 'tabular-nums', transition: 'color 0.2s',
            });

            const updateDisplay = () => { zoomDisplay.textContent = `${this.currentZoom}%`; };
            updateDisplay();

            const handleZoomUpdate = () => {
                this.saveZoomState();
                this.updateZoomStyle();
                updateDisplay();
            };

            container.onmouseenter = () => {
                container.style.backgroundColor = 'var(--yt-spec-badge-chip-background-hover)';
                zoomIcon.style.fill = 'var(--yt-spec-text-primary)';
                zoomDisplay.style.color = 'var(--yt-spec-text-primary)';
            };
            container.onmouseleave = () => {
                container.style.backgroundColor = 'transparent';
                zoomIcon.style.fill = 'var(--yt-spec-text-secondary)';
                zoomDisplay.style.color = 'var(--yt-spec-text-secondary)';
            };

            container.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const oldZoom = this.currentZoom;
                if (e.deltaY < 0) {
                    this.currentZoom = Math.min(this.MAX_ZOOM, this.currentZoom + this.ZOOM_STEP);
                } else {
                    this.currentZoom = Math.max(this.MIN_ZOOM, this.currentZoom - this.ZOOM_STEP);
                }
                if (oldZoom !== this.currentZoom) handleZoomUpdate();
            }, { passive: false });

            container.addEventListener('click', () => {
                if (this.currentZoom !== this.DEFAULT_ZOOM) {
                    this.currentZoom = this.DEFAULT_ZOOM;
                    handleZoomUpdate();
                }
            });

            container.append(zoomIcon, zoomDisplay, tooltip);
            return container;
        }

        // --- 6. DOM監視 (DOM Observation) ---
        observeHeader() {
            const commentsElement = document.querySelector(this.containerSelector);
            if (!commentsElement) {
                if (this.pageType === 'shorts') {
                    setTimeout(() => this.observeHeader(), 500);
                }
                return;
            }

            this.uiObserver = new MutationObserver(() => this.updateHeaderUI());
            this.uiObserver.observe(commentsElement, { childList: true, subtree: true });
            this.updateHeaderUI();
        }

        updateHeaderUI() {
            if (document.getElementById(this.SCRIPT_ID)) return;

            const injectionTarget = document.querySelector(this.injectionTargetSelector);

            if (injectionTarget) {
                const zoomControls = this.createZoomControls();
                if (this.pageType === 'shorts') {
                    injectionTarget.insertAdjacentElement('afterend', zoomControls);
                } else {
                    injectionTarget.parentElement.insertBefore(zoomControls, injectionTarget.nextSibling);
                }
                console.log(`[CommentZoom] UI injected for ${this.pageType}.`);
            }
        }
    }

    // --- 実行制御 (Execution Control) ---
    let zoomManager = null;

    function main() {
        if (zoomManager) {
            zoomManager.stop();
            zoomManager = null;
        }

        (async () => {
            zoomManager = new CommentZoomManager();
            await zoomManager.init();
        })();
    }

    window.addEventListener('yt-navigate-finish', main);
    main();

})();
