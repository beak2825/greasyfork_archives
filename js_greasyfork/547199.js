// ==UserScript==
// @name         SkipCut PowerTools
// @name:en      SkipCut PowerTools
// @name:nl      SkipCut PowerTools
// @name:es      Herramientas Avanzadas de SkipCut
// @name:fr      Outils Avancés SkipCut
// @name:de      SkipCut PowerTools
// @name:zh-CN   SkipCut 高级工具
// @name:ja      SkipCut パワーツール
// @name:ru      Инструменты SkipCut
// @name:pt      Ferramentas Avançadas SkipCut
// @name:it      Strumenti Avanzati SkipCut
// @name:ko      SkipCut 파워툴
// @namespace    https://greasyfork.org/users/1197317-opus-x
// @version      1.08
// @description  SkipCut PowerTools – Minimal/Full UI + Fast Invidious Buttons
// @description:en SkipCut PowerTools – Minimal/Full UI + Fast Invidious Buttons
// @description:nl SkipCut PowerTools – Minimale/Volledige UI + Snelle Invidious Knoppen
// @description:es Herramientas Avanzadas de SkipCut – Interfaz Mínima/Completa + Botones Rápidos para Invidious
// @description:fr Outils Avancés SkipCut – Interface Minimale/Complète + Boutons Rapides pour Invidious
// @description:de SkipCut PowerTools – Minimales/Volles UI + Schnelle Invidious-Schaltflächen
// @description:zh-CN SkipCut 高级工具 - 极简/完整用户界面 + 快速 Invidious 按钮
// @description:ja SkipCut パワーツール - ミニマル/フル UI + 高速 Invidious ボタン
// @description:ru Инструменты SkipCut – Минимальный/Полный интерфейс + Быстрые кнопки для Invidious
// @description:pt Ferramentas Avançadas SkipCut – Interface Mínima/Completa + Botões Rápidos para Invidious
// @description:it Strumenti Avanzati SkipCut – Interfaccia Minimale/Completa + Pulsanti Rapidi per Invidious
// @description:ko SkipCut 파워툴 - 최소/완전 UI + 빠른 Invidious 버튼
// @author       Opus-X
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAn1BMVEVHcEz/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr5KDn7KDnWKDX/KTr////+KTr+IjTxJjf5KDjtpKnrFCn98/T+Gi/pJjX+9/fbIjHiQ0/iIDDCEiLPHi22CBzFSlP8UV3z29y4Mjz9O0r0Fiv8p639i5L5ZW/85efswMPJGCjfn6P+z9L+a3XHY2nNgofWanHTKjevBBkSa/ywAAAAD3RSTlMA1eJM8G8ZywLEjK/Ky+Vq/rygAAABGklEQVQokcWSV3PDMAiAlcRJ7YwzGq1XvGPH8cho+/9/W0Ee59zlpQ+98iA4PoEQwNi/iLna7qy3J7F225VJbLOwX8pig3FLbYrBJcRElyZb99aN994scye6ZhYpt4JrgV5eOFBN1GIGqfIMUF9cW2Q+wHlMbTCOJy/fAcCvXHF00LgWPeU9/CCIMaWGft0/zJk9g9BoCODcNH2GkPuDcRG/g006pP0MFcF5Qd33ScM8jQjOq/UfSaQjm1MUSE7QGGF9T+LgiG92SRtIpZtgadhBjtc9iV95JHFIcdQ+ajyXX3dKpVSYpknsKT40nkbGZdDidWUrL26DkeHI9LCV9DxdgkI9MBr2sCb7g96Pw14b05ogfblZf7e0P1C8J9ljbAzmAAAAAElFTkSuQmCC
// @match        https://skipcut.com/*
// @match        https://www.skipcut.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/547199/SkipCut%20PowerTools.user.js
// @updateURL https://update.greasyfork.org/scripts/547199/SkipCut%20PowerTools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------
    // Prevent sponsorship modal by removing the Buy Me a Coffee widget script
    // ---------------------------
    const preventSponsorshipModal = () => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT' && (node.src.includes('buymeacoffee') || node.src.includes('crisp.chat'))) {
                        node.remove();
                    }
                }
            }
        });
        observer.observe(document.head || document.documentElement, { childList: true, subtree: true }); // Optimized to observe head primarily
    };
    preventSponsorshipModal();

    // ---------------------------
    // Localization
    // ---------------------------
    const translations = {
        'en': {
            openInvidious: 'Open Invidious',
            refreshMirrors: 'Refresh mirrors',
            minimalUI: 'Minimal UI',
            fullUI: 'Full UI',
            checkingMirrors: 'Checking mirrors…',
            reChecking: 'Re-checking…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'No mirrors available'
        },
        'nl': {
            openInvidious: 'Open Invidious',
            refreshMirrors: 'Spiegels vernieuwen',
            minimalUI: 'Minimale UI',
            fullUI: 'Volledige UI',
            checkingMirrors: 'Spiegels controleren…',
            reChecking: 'Opnieuw controleren…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'Geen spiegels beschikbaar'
        },
        'es': {
            openInvidious: 'Abrir Invidious',
            refreshMirrors: 'Actualizar espejos',
            minimalUI: 'Interfaz Mínima',
            fullUI: 'Interfaz Completa',
            checkingMirrors: 'Comprobando espejos…',
            reChecking: 'Volviendo a comprobar…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'No hay espejos disponibles'
        },
        'fr': {
            openInvidious: 'Ouvrir Invidious',
            refreshMirrors: 'Actualiser les miroirs',
            minimalUI: 'Interface Minimale',
            fullUI: 'Interface Complète',
            checkingMirrors: 'Vérification des miroirs…',
            reChecking: 'Vérification en cours…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'Aucun miroir disponible'
        },
        'de': {
            openInvidious: 'Invidious öffnen',
            refreshMirrors: 'Spiegel aktualisieren',
            minimalUI: 'Minimales UI',
            fullUI: 'Volles UI',
            checkingMirrors: 'Spiegel werden überprüft…',
            reChecking: 'Erneute Überprüfung…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'Keine Spiegel verfügbar'
        },
        'zh-CN': {
            openInvidious: '打开 Invidious',
            refreshMirrors: '刷新镜像',
            minimalUI: '极简界面',
            fullUI: '完整界面',
            checkingMirrors: '正在检查镜像…',
            reChecking: '正在重新检查…',
            invidiousOK: 'Invidious 正常',
            noMirrors: '没有可用的镜像'
        },
        'ja': {
            openInvidious: 'Invidious を開く',
            refreshMirrors: 'ミラーを更新',
            minimalUI: 'ミニマル UI',
            fullUI: 'フル UI',
            checkingMirrors: 'ミラーを確認中…',
            reChecking: '再確認中…',
            invidiousOK: 'Invidious OK',
            noMirrors: '利用可能なミラーがありません'
        },
        'ru': {
            openInvidious: 'Открыть Invidious',
            refreshMirrors: 'Обновить зеркала',
            minimalUI: 'Минимальный интерфейс',
            fullUI: 'Полный интерфейс',
            checkingMirrors: 'Проверка зеркал…',
            reChecking: 'Повторная проверка…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'Зеркала недоступны'
        },
        'pt': {
            openInvidious: 'Abrir Invidious',
            refreshMirrors: 'Atualizar espelhos',
            minimalUI: 'Interface Mínima',
            fullUI: 'Interface Completa',
            checkingMirrors: 'Verificando espelhos…',
            reChecking: 'Verificando novamente…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'Nenhum espelho disponível'
        },
        'it': {
            openInvidious: 'Apri Invidious',
            refreshMirrors: 'Aggiorna mirror',
            minimalUI: 'Interfaccia Minimale',
            fullUI: 'Interfaccia Completa',
            checkingMirrors: 'Controllo dei mirror…',
            reChecking: 'Ricontrollo in corso…',
            invidiousOK: 'Invidious OK',
            noMirrors: 'Nessun mirror disponibile'
        },
        'ko': {
            openInvidious: 'Invidious 열기',
            refreshMirrors: '미러 새로고침',
            minimalUI: '최소 UI',
            fullUI: '완전 UI',
            checkingMirrors: '미러 확인 중…',
            reChecking: '다시 확인 중…',
            invidiousOK: 'Invidious OK',
            noMirrors: '사용 가능한 미러 없음'
        }
    };

    // Determine user language (fallback to English)
    const userLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
    const lang = translations[userLang] ? userLang : 'en';
    const t = translations[lang];

    // ---------------------------
    // Mirror lists
    // ---------------------------
    const INVIDIOUS_MIRRORS = [
        "https://yewtu.be",
        "https://inv.tux.pizza",
        "https://invidious.privacydev.net",
        "https://invidious.protokolla.fi",
        "https://inv.nadeko.net",
        "https://invidious.nerdvpn.de",
        "https://invidious.f5.si",
        "https://inv.perditum.com"
    ];

    // ---------------------------
    // Config
    // ---------------------------
    const PING_TIMEOUT_MS = 2500;
    const MIRROR_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

    const urlParams = new URLSearchParams(location.search);
    const hasVideo = urlParams.has('v');
    const videoId = urlParams.get('v');

    // ---------------------------
    // Minimal Layout Toggle
    // ---------------------------
    const MINIMAL_KEY = 'sc_minimal_layout';
    let minimalMode = GM_getValue(MINIMAL_KEY, true);

    function applyMinimalLayout(enable) {
        if (!hasVideo) return;
        document.body.classList.toggle('sc-minimal', enable); // Use class toggle for efficient layout switch
    }

    // Apply the layout immediately on start
    applyMinimalLayout(minimalMode);

    // ---------------------------
    // Styles (combined and optimized for class-based toggling)
    // ---------------------------
    GM_addStyle(`
        #sc-powertools {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            margin: 5px 0;
            gap: 10px;
            flex-wrap: wrap;
        }
        #sc-powertools .sc-left {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }
        #sc-powertools .sc-btn {
            background: #222;
            color: #fff;
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 13px;
            text-decoration: none;
            transition: background 0.2s ease-in-out;
        }
        #sc-powertools .sc-btn:hover { background: #444; }
        #sc-powertools .sc-btn[disabled] { opacity: 0.55; cursor: not-allowed; }
        #sc-profile-select {
            background:#333;
            color:#fff;
            padding:6px 10px;
            border-radius:6px;
            border:none;
            cursor:pointer;
            font-size:13px;
            margin-left:auto;
        }
        .sc-status {
            font-size: 13px;
            color: #777;
            margin-left: 5px;
        }

        /* Minimal mode styles applied via class */
        body.sc-minimal .nav-menu, body.sc-minimal .hero-section, body.sc-minimal .input-section,
        body.sc-minimal #bmc-wbtn, body.sc-minimal .trending-container, body.sc-minimal .trending-header,
        body.sc-minimal .trending-content, body.sc-minimal #ta-ad-container,
        body.sc-minimal .features-highlight, body.sc-minimal .testimonials-section,
        body.sc-minimal .infographic-section, body.sc-minimal .faq-section, body.sc-minimal .comparison-grid,
        body.sc-minimal .featured-section, body.sc-minimal .footer-container, body.sc-minimal .savings-highlight,
        body.sc-minimal .mobile-menu-toggle, body.sc-minimal .mob-nav-link, body.sc-minimal .features-infographic,
        body.sc-minimal .infographic-cta, body.sc-minimal .ybug-launcher--active, body.sc-minimal .footer,
        body.sc-minimal .history-section, body.sc-minimal .notification-bell, body.sc-minimal .dj-section,
        body.sc-minimal .notification-dropdown, body.sc-minimal .extension-cta-section,
        body.sc-minimal .crisp-client, body.sc-minimal #crisp-chatbox,
        body.sc-minimal #emojiSwitcheroptions, body.sc-minimal #emojiSwitcherContainer,
        body.sc-minimal #emojiSwitcherButton, body.sc-minimal #emojiSets, body.sc-minimal #disableButton,
        body.sc-minimal #gotoOptionsPage, body.sc-minimal #readHelp, body.sc-minimal #emojiSwitcherWarning,
        body.sc-minimal #previewWrapper, body.sc-minimal #emojiSwitcherClose, body.sc-minimal .info-container,
        body.sc-minimal #buttonContainer, body.sc-minimal #closeButton, body.sc-minimal #switchSidesButton,
        body.sc-minimal .footer, body.sc-minimal .footer-container, body.sc-minimal .footer-bottom,
        body.sc-minimal .footer-section, body.sc-minimal .footer-bottom-content, body.sc-minimal .modal-body,
        body.sc-minimal .footer-legal, body.sc-minimal #modal-overlay, body.sc-minimal #emojiSwitcheroptions,
        body.sc-minimal #whatsNewModal, body.sc-minimal #howItWorksModal, body.sc-minimal #privacyModal,
        body.sc-minimal #featuresModal, body.sc-minimal #chromeExtensionModal, body.sc-minimal .onesignal-slidedown-dialog,
        body.sc-minimal #lazy-loading-sentinel, body.sc-minimal #onesignal-slidedown-container,
        body.sc-minimal .hero-section, body.sc-minimal .ai-badge, body.sc-minimal .hero-title,
        body.sc-minimal .subtitle, body.sc-minimal .powered-by, body.sc-minimal .input-section,
        body.sc-minimal #buttonContainer, body.sc-minimal #dgfm-notification-root-container {
            display: none !important;
        }

        body.sc-minimal .container {
            width: 100% !important;
            min-height: auto !important;
            padding: 2rem !important; /* Further reduced padding for minimal margin */
        }

        body.sc-minimal {
            padding-top: 0px !important;
            margin-top: 0 !important;
        }

        body.sc-minimal .embed-responsive, body.sc-minimal .video-player, body.sc-minimal #youtube-iframe,
        body.sc-minimal .video-info, body.sc-minimal #sc-powertools {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }

        body.sc-minimal #sc-powertools {
            margin: px 0 !important;
        }
    `);

    // ---------------------------
    // Fastest mirror detection
    // ---------------------------
    function pingMirror(baseUrl) {
        return new Promise(resolve => {
            const started = performance.now();
            GM_xmlhttpRequest({
                method: "HEAD",
                url: baseUrl.replace(/\/+$/, "") + "/favicon.ico",
                timeout: PING_TIMEOUT_MS,
                onload: (res) => resolve(res.status === 200 ? { url: baseUrl, time: performance.now() - started } : null),
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    async function pickFastestMirror(kind, list) {
        const cacheKey = `scpt_fastest_${kind}`;
        const tsKey = `${cacheKey}_ts`;
        const now = Date.now();
        const cached = GM_getValue(cacheKey);
        const cachedTs = GM_getValue(tsKey, 0);

        if (cached && (now - cachedTs) < MIRROR_CACHE_TTL_MS) return cached;

        const checks = await Promise.all(list.map(pingMirror));
        const working = checks.filter(Boolean).sort((a, b) => a.time - b.time);
        const fastest = working[0]?.url || null;

        GM_setValue(cacheKey, fastest);
        GM_setValue(tsKey, now);
        return fastest;
    }

    // ---------------------------
    // Main container creation
    // ---------------------------
    function insertMirrorButtonsContainer() {
        if (!hasVideo || document.getElementById('sc-powertools')) return null;
        const videoInfo = document.querySelector('.video-info');
        if (!videoInfo) return null;

        const container = document.createElement('div');
        container.id = 'sc-powertools';

        const leftContainer = document.createElement('div');
        leftContainer.className = 'sc-left';
        container.appendChild(leftContainer);

        videoInfo.parentNode.insertBefore(container, videoInfo);
        return container;
    }

    // ---------------------------
    // Fill buttons & dropdown
    // ---------------------------
    async function fillMirrorButtons(container) {
        const leftContainer = container.querySelector('.sc-left');
        leftContainer.innerHTML = ''; // Reset buttons on refresh

        // Status text
        let status = container.querySelector('.sc-status');
        if (!status) {
            status = document.createElement('span');
            status.className = 'sc-status';
            leftContainer.appendChild(status);
        }
        status.textContent = t.checkingMirrors;

        const fastestInv = await pickFastestMirror('invidious', INVIDIOUS_MIRRORS);

        const makeBtn = (label, href) => {
            const a = document.createElement('a');
            a.className = 'sc-btn sc-mirror-btn';
            a.textContent = label;
            if (href) a.href = href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            return a;
        };

        if (fastestInv) leftContainer.appendChild(makeBtn(t.openInvidious, `${fastestInv}/watch?v=${videoId}`));

        // Refresh button
        let refresh = container.querySelector('.sc-refresh-btn');
        if (!refresh) {
            refresh = document.createElement('button');
            refresh.className = 'sc-btn sc-mirror-btn sc-refresh-btn';
            refresh.textContent = t.refreshMirrors;
            refresh.addEventListener('click', async () => {
                GM_setValue('scpt_fastest_invidious', null);
                GM_setValue('scpt_fastest_invidious_ts', 0);
                status.textContent = t.reChecking;
                await fillMirrorButtons(container);
            });
        }
        leftContainer.appendChild(refresh);

        // Profile selector
        let profileSelect = container.querySelector('#sc-profile-select');
        if (!profileSelect) {
            profileSelect = document.createElement('select');
            profileSelect.id = 'sc-profile-select';
            [t.minimalUI, t.fullUI].forEach((p, i) => {
                const o = document.createElement('option');
                o.value = i;
                o.textContent = p;
                profileSelect.appendChild(o);
            });
            profileSelect.value = minimalMode ? '0' : '1';
            profileSelect.addEventListener('change', e => {
                minimalMode = e.target.value === '0';
                GM_setValue(MINIMAL_KEY, minimalMode);
                applyMinimalLayout(minimalMode);
            });
            container.appendChild(profileSelect);
        }

        // Update status text
        status.textContent = fastestInv ? t.invidiousOK : t.noMirrors;
    }

    // ---------------------------
    // Bootstrap when ready
    // ---------------------------
    function bootWhenReady() {
        if (!hasVideo) return;
        const tryInit = () => {
            if (document.getElementById('sc-powertools')) return false;
            const container = insertMirrorButtonsContainer();
            if (container) { fillMirrorButtons(container); return true; }
            return false;
        };
        if (tryInit()) return;
        const mo = new MutationObserver(() => { if (tryInit()) mo.disconnect(); });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (hasVideo) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootWhenReady, { once: true });
        } else {
            bootWhenReady();
        }
    }
})();
