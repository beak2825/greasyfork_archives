// ==UserScript==
// @name         Amazon 购买数量高亮
// @namespace    https://greasyfork.org/zh-CN/users/your-profile-id
// @version      1.1.0
// @description  [EN] Highlights purchase quantity on Amazon | [CN] 高亮显示Amazon商品购买数量
// @author       再见梵高 <wwxhqq739810171@gmail.com>
// @license      MIT
// @match          *://www.amazon.com/*
// @match          *://www.amazon.ca/*
// @match          *://www.amazon.co.uk/*
// @match          *://www.amazon.de/*
// @match          *://www.amazon.fr/*
// @match          *://www.amazon.it/*
// @match          *://www.amazon.es/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        GM_addStyle
// @supportURL   mailto:wwxhqq739810171@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/532278/Amazon%20%E8%B4%AD%E4%B9%B0%E6%95%B0%E9%87%8F%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/532278/Amazon%20%E8%B4%AD%E4%B9%B0%E6%95%B0%E9%87%8F%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        highlightClass: 'amz-pq-highlight',
        styleRules: {
            color: '#FF4444',
            fontSize: '18px',
            fontWeight: '900',
            textShadow: '0 0 3px rgba(255,68,68,0.4)',
            animation: 'pulse 1s ease-in-out infinite'
        },
        textPatterns: [
            /\d+\+?\s?(?:bought|purchased|sold)/i,
            /multiple\s+times/i,
            /past\s+(?:month|week)/i
        ]
    };

    GM_addStyle(`
        .${CONFIG.highlightClass} {
            color: ${CONFIG.styleRules.color} !important;
            font-size: ${CONFIG.styleRules.fontSize} !important;
            font-weight: ${CONFIG.styleRules.fontWeight} !important;
            text-shadow: ${CONFIG.styleRules.textShadow} !important;
            animation: ${CONFIG.styleRules.animation} !important;
        }
        @keyframes pulse {
            0%,100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .social-proofing-faceout-title-text .${CONFIG.highlightClass} {
            display: inline-block;
        }
    `);

    function checkText(text) {
        return CONFIG.textPatterns.some(p => p.test(text));
    }

    function processElement(el) {
        if (el.classList.contains(CONFIG.highlightClass)) return;
        const text = el.textContent.trim();
        if (!checkText(text)) return;

        const parent = el.closest([
            '.a-row.a-size-base',
            '#socialProofingAsinFaceout_feature_div',
            '.social-proofing-faceout'
        ].join(','));
        if (!parent) return;

        const wrapper = document.createElement('span');
        wrapper.className = CONFIG.highlightClass;
        wrapper.innerHTML = el.innerHTML;
        el.parentNode.replaceChild(wrapper, el);
    }

    function applyHighlight() {
        document.querySelectorAll([
            'span.a-color-secondary',
            'span.a-text-bold',
            'span.social-proofing-faceout-title-text'
        ].join(',')).forEach(processElement);
    }

    applyHighlight();

    const observer = new MutationObserver(mutations => {
        mutations.some(m => m.addedNodes.length && applyHighlight());
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false
    });

    const events = ['page:change', 'spa-navigate', 'DOMContentLoaded'];
    events.forEach(e => window.addEventListener(e, applyHighlight));
})();
