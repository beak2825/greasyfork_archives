// ==UserScript==
// @name         SkipCut – Minimal Layout
// @name:en      SkipCut – Minimal Layout
// @name:nl      SkipCut – Minimale Lay-out
// @name:es      SkipCut – Diseño Mínimo
// @name:fr      SkipCut – Mise en page minimale
// @name:de      SkipCut – Minimales Layout
// @name:zh-CN   SkipCut – 极简布局
// @name:ja      SkipCut – ミニマルレイアウト
// @name:ru      SkipCut – Минимальная компоновка
// @name:pt      SkipCut – Layout Minimalista
// @name:it      SkipCut – Layout Minimale
// @name:ko      SkipCut – 미니멀 레이아웃
// @namespace    https://greasyfork.org/users/1197317-opus-x
// @version      1.04
// @description  Hide specific sections on SkipCut only if the URL has a 'v' parameter
// @description:en Hide specific sections on SkipCut only if the URL has a 'v' parameter
// @description:nl Verberg specifieke secties op SkipCut alleen als de URL een 'v'-parameter heeft
// @description:es Oculta secciones específicas en SkipCut solo si la URL tiene un parámetro 'v'
// @description:fr Masque des sections spécifiques sur SkipCut uniquement si l'URL contient un paramètre 'v'
// @description:de Blendet bestimmte Abschnitte auf SkipCut aus, wenn die URL einen 'v'-Parameter enthält
// @description:zh-CN 仅当 URL 包含 'v' 参数时隐藏 SkipCut 上的特定部分
// @description:ja URL に 'v' パラメータがある場合にのみ、SkipCut の特定のセクションを非表示にします
// @description:ru Скрывает определённые разделы на SkipCut, только если в URL есть параметр 'v'
// @description:pt Oculta seções específicas no SkipCut apenas se a URL tiver um parâmetro 'v'
// @description:it Nasconde sezioni specifiche su SkipCut solo se l'URL ha un parametro 'v'
// @description:ko URL에 'v' 매개변수가 있을 때만 SkipCut의 특정 섹션을 숨깁니다
// @author       Opus-X
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAn1BMVEVHcEz/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr5KDn7KDnWKDX/KTr////+KTr+IjTxJjf5KDjtpKnrFCn98/T+Gi/pJjX+9/fbIjHiQ0/iIDDCEiLPHi22CBzFSlP8UV3z29y4Mjz9O0r0Fiv8p639i5L5ZW/85efswMPJGCjfn6P+z9L+a3XHY2nNgofWanHTKjevBBkSa/ywAAAAD3RSTlMA1eJM8G8ZywLEjK/Ky+Vq/rygAAABGklEQVQokcWSV3PDMAiAlcRJ7YwzGq1XvGPH8cho+/9/W0Ee59zlpQ+98iA4PoEQwNi/iLna7qy3J7F225VJbLOwX8pig3FLbYrBJcRElyZb99aN994scye6ZhYpt4JrgV5eOFBN1GIGqfIMUF9cW2Q+wHlMbTCOJy/fAcCvXHF00LgWPeU9/CCIMaWGft0/zJk9g9BoCODcNH2GkPuDcRG/g006pP0MFcF5Qd33ScM8jQjOq/UfSaQjm1MUSE7QGGF9T+LgiG92SRtIpZtgadhBjtc9iV95JHFIcdQ+ajyXX3dKpVSYpknsKT40nkbGZdDidWUrL26DkeHI9LCV9DxdgkI9MBr2sCb7g96Pw14b05ogfblZf7e0P1C8J9ljbAzmAAAAAElFTkSuQmCC
// @match        https://skipcut.com/*
// @match        https://www.skipcut.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547081/SkipCut%20%E2%80%93%20Minimal%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/547081/SkipCut%20%E2%80%93%20Minimal%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL contains the 'v' parameter (with or without value)
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('v')) {
        return;
    }

    // Prevent sponsorship modals and chat widgets (e.g., Buy Me a Coffee, Crisp chat)
    const preventPopups = () => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id === 'bmc-wbtn' || node.classList.contains('crisp-client') || node.id === 'crisp-chatbox') {
                            node.remove();
                        }
                        if (node.tagName === 'SCRIPT' && node.src && (node.src.includes('buymeacoffee') || node.src.includes('crisp.chat'))) {
                            node.remove();
                        }
                    }
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    };
    preventPopups();

    // Apply comprehensive minimal layout CSS (covering all elements hidden in reference minimal mode)
    GM_addStyle(`
        /* Hide unnecessary sections and elements in minimal mode */
        .nav-menu,
        .hero-section,
        .input-section,
        #bmc-wbtn,
        .trending-container,
        .trending-header,
        .trending-content,
        #ta-ad-container,
        .features-highlight,
        .testimonials-section,
        .infographic-section,
        .faq-section,
        .comparison-grid,
        .featured-section,
        .footer-container,
        .savings-highlight,
        .mobile-menu-toggle,
        .mob-nav-link,
        .features-infographic,
        .infographic-cta,
        .ybug-launcher--active,
        .footer,
        .history-section,
        .notification-bell,
        .dj-section,
        .notification-dropdown,
        .extension-cta-section,
        .crisp-client,
        #crisp-chatbox,
        .info-container,
        .footer-bottom,
        .footer-section,
        .footer-bottom-content,
        .modal-body,
        .footer-legal,
        #modal-overlay,
        #whatsNewModal,
        #howItWorksModal,
        #privacyModal,
        #featuresModal,
        #chromeExtensionModal,
        .onesignal-slidedown-dialog,
        #onesignal-slidedown-container,
        .ai-badge,
        .hero-title,
        .subtitle,
        .powered-by {
            display: none !important;
        }

        /* Compact container and body adjustments */
        .container {
            width: 100% !important;
            min-height: auto !important;
            padding: 1rem !important;
        }

        body {
            padding-top: 0 !important;
            margin-top: 0 !important;
        }

        /* Ensure video player area is clean */
        .embed-responsive,
        .video-player,
        #youtube-iframe,
        .video-info {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }
    `);
})();