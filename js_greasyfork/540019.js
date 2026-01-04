// ==UserScript==
// @name         Copy-as-LaTeX for ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Copies any selection containing KaTeX or MathJax as clean LaTeX (plain-text + HTML). Shortcut: ⌃/⌘+C or floating "Copy" button.
// @author       yazanzaid00
// @match        *://*.chatgpt.com/*
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540019/Copy-as-LaTeX%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/540019/Copy-as-LaTeX%20for%20ChatGPT.meta.js
// ==/UserScript==

function decodeHTMLEntities(text) {
    const parser = new DOMParser();
    return parser.parseFromString(text, 'text/html').documentElement.textContent;
}

function isEditable(node) {
    if (!node) return false;
    for (let n = node; n; n = n.parentNode) {
        if (n.nodeType === Node.ELEMENT_NODE &&
            n.matches('input, textarea, [contenteditable]')) {
            return true;
        }
    }
    return false;
}

const defaultCopyDelimiters = { inline: ['\\(', '\\)'], display: ['\\[', '\\]'] }; // alternative: inline: ['$', '$'], display: ['$$', '$$']
function katexReplaceWithTex(fragment, copyDelimiters = defaultCopyDelimiters) {
    fragment.querySelectorAll('.katex-mathml + .katex-html')
        .forEach(node => node.remove?.() || node.parentNode?.removeChild(node));
    fragment.querySelectorAll('.katex-mathml').forEach(el => {
        const ann = el.querySelector('annotation');
        if (!ann) return;
        el.replaceWith?.(ann) || el.parentNode?.replaceChild(ann, el);
        ann.innerHTML = copyDelimiters.inline[0] + ann.innerHTML + copyDelimiters.inline[1];
    });
    fragment.querySelectorAll('.katex-display annotation').forEach(ann => {
        const { inline, display } = copyDelimiters;
        const body = ann.innerHTML.slice(inline[0].length, -inline[1].length);
        ann.innerHTML = display[0] + body + display[1];
    });
    return fragment;
}

function closestKatex(node) {
    const el = node instanceof Element ? node : node.parentElement;
    return el?.closest('.katex') || null;
}

function mathjaxReplaceWithTex(fragment) {
    // Remove preview & Assistive MathML duplicates
    fragment.querySelectorAll('.MathJax_Preview, mjx-assistive-mathml')
        .forEach(n => n.remove());

    // Replace rendered MathJax blocks with their LaTeX annotation
    fragment.querySelectorAll('annotation[encoding="application/x-tex"], annotation[encoding="LaTeX"]')
        .forEach(ann => {
            const tex = ann.textContent.trim();
            const math = ann.closest('math');
            if (!math) return;
            // display="block" is set either on <math> or on its outer container
            const isDisplay = math.getAttribute('display') === 'block' ||
                ann.closest('mjx-container')?.getAttribute('display') === 'block';
            const node = document.createTextNode(
                (isDisplay ? defaultCopyDelimiters.display[0] : defaultCopyDelimiters.inline[0]) + tex + (isDisplay ? defaultCopyDelimiters.display[1] : defaultCopyDelimiters.inline[1])
            );
            math.replaceWith(node);
        });

    // Remove leftover rendered output
    fragment.querySelectorAll('mjx-container, .MathJax').forEach(el => el.remove());
    return fragment;
}

function replaceMathWithTex(fragment) {
    katexReplaceWithTex(fragment);
    mathjaxReplaceWithTex(fragment);
    return fragment;
}

function getTextContentWithReplacements(node) {
    let text = '';
    if (node && node.childNodes) {
        node.childNodes.forEach(child => {
            let replaced = false;
            if (child.nodeType === Node.TEXT_NODE) text += child.textContent;
            if (child.nodeType === Node.ELEMENT_NODE) {
                const nodeName = child.nodeName.toLowerCase();
                if (nodeName === 'span' &&
                    child.getElementsByTagName('annotation').length > 0) {
                    replaced = true;
                    text += defaultCopyDelimiters.inline[0] + child.getElementsByTagName('annotation')[0].textContent + defaultCopyDelimiters.inline[1];
                }
            }
            if (!replaced &&
                child.nodeType === Node.ELEMENT_NODE &&
                !['script', 'math', 'img'].includes(child.nodeName.toLowerCase())) {
                text += getTextContentWithReplacements(child);
            }
        });
    }
    return text.replace(/\n+/g, '\n').trim();
}

function onCopy(event) {
    /* Skip everything when the focus is in an editable control */
    if (isEditable(event.target || document.activeElement)) return;

    const sel = window.getSelection();
    if (sel.isCollapsed || !event.clipboardData) return;
    const range = sel.getRangeAt(0);
    // Expand selection to whole KaTeX block
    const sK = closestKatex(range.startContainer);
    if (sK) range.setStartBefore(sK);
    const eK = closestKatex(range.endContainer);
    if (eK) range.setEndAfter(eK);

    const frag = range.cloneContents();
    if (!frag.querySelector('.katex-mathml') &&
        !frag.querySelector('annotation[encoding="application/x-tex"], annotation[encoding="LaTeX"]')) {
        return;
    }

    /* HTML clipboard data – remove hidden math markup to avoid duplicates */
    const htmlClone = frag.cloneNode(true);
    htmlClone.querySelectorAll('.katex-mathml, .MathJax_MathML, mjx-assistive-mathml')
        .forEach(el => el.remove());
    htmlClone.querySelectorAll('.MathJax_Preview, script[type*="math/tex"]')
        .forEach(el => el.remove());
    const tmp = document.createElement('div');
    tmp.appendChild(htmlClone);
    event.clipboardData.setData('text/html', tmp.innerHTML);

    /* Plain-text clipboard data – KaTeX + MathJax → TeX */
    const plain = decodeHTMLEntities(replaceMathWithTex(frag).textContent)
        .replace(/\u00A0/g, ' ');
    event.clipboardData.setData('text/plain', plain);

    event.preventDefault();
    event.stopImmediatePropagation();
}

(function () {
    'use strict';

    if (!window.__LaTeXCopierInstalled) {
        // light DOM first
        document.addEventListener('copy', onCopy, true);

        // monkey-patch attachShadow so future roots inherit the listener
        const orig = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function (init = {}) {
            const root = orig.call(this, { ...init, mode: 'open' });
            root.addEventListener('copy', onCopy, true);
            return root;
        };

        // hook all *existing* open shadow roots (rare on ChatGPT but safe)
        document.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) el.shadowRoot.addEventListener('copy', onCopy, true);
        });

        window.__LaTeXCopierInstalled = true;
    }

    if (!document.getElementById('__latexCopyStyle')) {
        const css = `
      :root{--latex-bg:var(--background-secondary,#fff);--latex-fg:var(--text-primary,#000);--latex-hover:rgba(0,0,0,.05)}
      html.dark{--latex-bg:var(--background-secondary,#2c2c2e);--latex-fg:var(--text-primary,#eee);--latex-hover:rgba(255,255,255,.10)}
      .latex-copy-btn{all:unset;position:absolute;z-index:2147483647;display:none;visibility:visible;padding:4px 10px;border-radius:8px;cursor:pointer;background:var(--latex-bg);color:var(--latex-fg);backdrop-filter:blur(8px);border:1px solid rgba(0,0,0,.14);box-shadow:0 1px 3px rgba(0,0,0,.08);transition:background .15s}
      .latex-copy-btn:hover{background:var(--latex-hover)}`;
        const style = Object.assign(document.createElement('style'), { id: '__latexCopyStyle', textContent: css });
        document.head.appendChild(style);
    }

    const button = Object.assign(document.createElement('button'), {
        textContent: 'Copy', className: 'latex-copy-btn'
    });
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        const sel = window.getSelection();
        if (sel) copySelection(sel);
        button.style.display = 'none';
    });

    let last = '';
    document.addEventListener('mouseup', e => {
        const s = window.getSelection().toString().trim();
        /* Do NOT show the button if the mouse-up happened in an editable area */
        if (s && s !== last && !isEditable(e.target)) {
            button.style.left = `${e.pageX + 5}px`;
            button.style.top = `${e.pageY + 5}px`;
            button.style.display = 'block';
            last = s;
        } else {
            button.style.display = 'none';
            last = '';
        }
    });

    function copySelection(selection) {
        const range = selection.getRangeAt(0);
        const sK = closestKatex(range.startContainer);
        if (sK) range.setStartBefore(sK);
        const eK = closestKatex(range.endContainer);
        if (eK) range.setEndAfter(eK);

        const frag = range.cloneContents();
        let text;
        if (frag.querySelector('.katex-mathml') ||
            frag.querySelector('annotation[encoding="application/x-tex"], annotation[encoding="LaTeX"]')) {
            text = replaceMathWithTex(frag).textContent;
        } else {
            text = getTextContentWithReplacements(frag);
        }

        text = text.replace(/\\bm\{([^}]+)\}/g, '\\mathbf{$1}')
                   .replace(/\\bigg\{\\\|\}/g, '\\Bigl|')
                   .replace(/\\big\{\\\|\}/g, '\\big|')
                   .replace(/\u00A0/g, ' ');
        navigator.clipboard.writeText(decodeHTMLEntities(text));
    }

    document.addEventListener('keydown', e => {
        if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'c') return;

        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || isEditable(sel.anchorNode)) return;

        /* Intercept only when the fragment actually contains math */
        const frag = sel.getRangeAt(0).cloneContents();
        const hasMath = frag.querySelector('.katex-mathml') ||
                        frag.querySelector('annotation[encoding="application/x-tex"], annotation[encoding="LaTeX"]');
        if (!hasMath) return;            // plain text → let the browser handle it

        e.preventDefault();              // math present → use custom copier
        copySelection(sel);
    }, true);
})();