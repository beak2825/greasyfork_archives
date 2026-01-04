// ==UserScript==
// @name         Universal Highlight
// @version      3.9
// @description  Grifa com Alt+A. Desbloqueia Ctrl+C. Clica para copiar.
// @author       Rocymar Júnior & Gemini
// @match        *://*/*
// @exclude      *://*.vscode.dev/*
// @exclude      *://*.github.dev/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1464973
// @downloadURL https://update.greasyfork.org/scripts/538808/Universal%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/538808/Universal%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURAÇÕES ---
    const HIGHLIGHT_CLASS = 'custom-highlight-universal';
    const NOTIFICATION_ID = 'custom-highlight-copy-notification-universal';
    const LIGHT_MODE_YELLOW = '#FDEE87';
    const DARK_MODE_YELLOW = '#FDFFB4';

    // --- ESTILOS CSS ---
    GM_addStyle(`
        :root { --highlight-bg-color: ${LIGHT_MODE_YELLOW}; }
        @media (prefers-color-scheme: dark) { :root { --highlight-bg-color: ${DARK_MODE_YELLOW}; } }

        .${HIGHLIGHT_CLASS} {
            background-color: var(--highlight-bg-color) !important;
            color: black !important;
            -webkit-text-fill-color: black !important;
            border-radius: 3px;
            cursor: pointer;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
        }
        .${HIGHLIGHT_CLASS} * {
             background: transparent !important;
             background-image: none !important;
             color: black !important;
             -webkit-text-fill-color: black !important;
        }
    `);

    // --- DESBLOQUEIO DE CÓPIA (SEMPRE ATIVO) ---
    GM_addStyle(`* { user-select: text !important; -webkit-user-select: text !important; }`);
    ['copy', 'cut'].forEach(eventName => {
        document.addEventListener(eventName, event => event.stopImmediatePropagation(), { capture: true });
    });

    // --- LÓGICA DO SCRIPT DE GRIFO ---

    function normalizeHighlights(startNode) {
        if (!startNode || !startNode.parentNode) return;
        const parent = startNode.parentNode;
        const highlights = Array.from(parent.querySelectorAll(`.${HIGHLIGHT_CLASS}`));
        for (let i = highlights.length - 2; i >= 0; i--) {
            const current = highlights[i];
            const next = highlights[i + 1];
            let sibling = current.nextSibling;
            while (sibling && sibling.nodeType === Node.TEXT_NODE && sibling.textContent.trim() === '') {
                sibling = sibling.nextSibling;
            }
            if (sibling === next) {
                while (next.firstChild) {
                    current.appendChild(next.firstChild);
                }
                next.remove();
            }
        }
        parent.normalize();
    }

    function unwrapHighlight(highlightSpan) {
        if (!highlightSpan || !highlightSpan.parentNode) return;
        const parent = highlightSpan.parentNode;
        while (highlightSpan.firstChild) {
            parent.insertBefore(highlightSpan.firstChild, highlightSpan);
        }
        parent.removeChild(highlightSpan);
        parent.normalize();
    }

    // *** FUNÇÃO CORRIGIDA ***
    function addListeners(element) {
        element.addEventListener('click', async function(event) { // Adicionado 'async'
            event.stopPropagation();
            const textToCopy = this.textContent.trim();
            if (textToCopy) {
                try {
                    await GM_setClipboard(textToCopy); // Adicionado 'await'
                    showCopyNotification();
                } catch (err) {
                    console.error("Highlighter: Erro ao copiar para a área de transferência.", err);
                    alert("Falha ao copiar o texto."); // Notificação de erro
                }
            }
        });
        element.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            event.stopPropagation();
            unwrapHighlight(this);
        });
    }

    function highlightSelection() {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        if (range.startContainer.parentElement.closest(`.${HIGHLIGHT_CLASS}`)) {
            selection.removeAllRanges();
            return;
        }
        let firstCreatedSpan = null;
        try {
            const highlightSpan = document.createElement('span');
            highlightSpan.className = HIGHLIGHT_CLASS;
            range.surroundContents(highlightSpan);
            addListeners(highlightSpan);
            firstCreatedSpan = highlightSpan;
        } catch (e) {
            const treeWalker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_TEXT,
                (node) => range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
            );
            const textNodes = [];
            while (treeWalker.nextNode()) textNodes.push(treeWalker.currentNode);
            const createdSpans = [];
            textNodes.forEach(node => {
                const nodeRange = document.createRange();
                nodeRange.selectNode(node);
                if (node === range.startContainer) nodeRange.setStart(node, range.startOffset);
                if (node === range.endContainer) nodeRange.setEnd(node, range.endOffset);
                if (nodeRange.toString().trim() !== '') {
                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = HIGHLIGHT_CLASS;
                    try {
                        nodeRange.surroundContents(highlightSpan);
                        addListeners(highlightSpan);
                        createdSpans.push(highlightSpan);
                    } catch (surroundError) {
                        console.error("Highlighter: Erro final ao envelopar nó de texto.", surroundError);
                    }
                }
            });
            if (createdSpans.length > 0) {
                firstCreatedSpan = createdSpans[0];
            }
        }
        if (firstCreatedSpan) {
            normalizeHighlights(firstCreatedSpan);
        }
        selection.removeAllRanges();
    }

    function showCopyNotification() {
        if (!document.body) return;
        let notification = document.getElementById(NOTIFICATION_ID);
        if (!notification) {
            notification = document.createElement('div');
            notification.id = NOTIFICATION_ID;
            Object.assign(notification.style, {
                position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px 20px',
                borderRadius: '8px', zIndex: '2147483647', fontSize: '14px',
                opacity: '0', transition: 'opacity 0.3s ease-in-out', fontFamily: 'sans-serif'
            });
            document.body.appendChild(notification);
        }
        notification.textContent = 'Texto copiado!';
        notification.style.opacity = '1';
        setTimeout(() => { notification.style.opacity = '0'; }, 1500);
    }

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key.toLowerCase() === 'a') {
            event.preventDefault();
            highlightSelection();
        }
    });

})();