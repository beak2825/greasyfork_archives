// ==UserScript==
// @name         Element Selector Tool
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  Press Ctrl+E to get friendly CSS selectors for any element
// @author       jamubc
// @match        *://*/*
// @run-at       document-end
// @inject-into  auto
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/542567/Element%20Selector%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/542567/Element%20Selector%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let active = false, overlay, tooltip, current;
    let initialized = false;
    let controller = null; // AbortController for active listeners
    let ro = null; // ResizeObserver
    let rafToken = null; // rAF throttle for pointermove

    // Settings
    const SETTINGS_KEY = 'est_settings_v1';
    const defaultSettings = {
        richCopy: true,           // text + JSON + HTML clipboard when available
        deepShadow: true,         // traverse open ShadowRoots for uniqueness checks
        spaAware: true,           // patch history to observe SPA navigation
        passiveListeners: true    // use passive where possible
    };

    function getSettings() {
        try {
            const raw = GM_getValue(SETTINGS_KEY, null);
            if (!raw) return { ...defaultSettings };
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch {
            return { ...defaultSettings };
        }
    }

    function saveSettings(s) {
        try { GM_setValue(SETTINGS_KEY, JSON.stringify(s)); } catch {}
    }

    // Small CSS.escape fallback for older engines
    try {
        if (!(window.CSS && typeof CSS.escape === 'function')) {
            const cssEscapeFallback = (s) => String(s).replace(/([!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~\s])/g, '\\$1');
            window.CSS = window.CSS || {};
            window.CSS.escape = cssEscapeFallback;
        }
    } catch {}

    // CSP-safe element creation
    function createElementSafe(tag, styles) {
        let el;
        try {
            // Try GM_addElement if available (CSP-friendly)
            if (typeof GM_addElement !== 'undefined') {
                el = GM_addElement(tag, {});
            } else {
                el = document.createElement(tag);
            }
        } catch (e) {
            el = document.createElement(tag);
        }
        if (styles) {
            el.style.cssText = styles;
        }
        return el;
    }

    // Traverse Shadow DOM to find actual target element
    function getDeepestElement(x, y) {
        let element = document.elementFromPoint(x, y);
        if (!element) return null;

        // Traverse into shadow roots
        while (element && element.shadowRoot) {
            const shadowElement = element.shadowRoot.elementFromPoint(x, y);
            if (!shadowElement || shadowElement === element) break;
            element = shadowElement;
        }

        return element;
    }

    // Build shadow path description (outer → inner) and whether any closed roots encountered
    function describeShadowPath(el) {
        const parts = [];
        let node = el;
        let crossedClosed = false;
        while (node) {
            const root = node.getRootNode();
            if (root && root.host) {
                const host = root.host;
                const mode = root.mode || 'closed';
                if (mode === 'closed') crossedClosed = true;
                parts.unshift(`${host.tagName.toLowerCase()}#${host.id || ''}`.replace(/#$/, ''));
                node = host;
            } else {
                break;
            }
        }
        return { path: parts, crossedClosed };
    }

    // Hotkey configuration with defaults
    const DEFAULT_HOTKEY = {
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        key: 'e'
    };

    // Get stored hotkey or return default
    function getHotkey() {
        try {
            const stored = GM_getValue('hotkey', null);
            return stored ? JSON.parse(stored) : DEFAULT_HOTKEY;
        } catch (e) {
            return DEFAULT_HOTKEY;
        }
    }

    // Save hotkey configuration
    function setHotkey(config) {
        try {
            GM_setValue('hotkey', JSON.stringify(config));
        } catch (e) {
            console.error('Failed to save hotkey:', e);
        }
    }

    // Format hotkey for display
    function formatHotkey(config) {
        const parts = [];
        if (config.ctrlKey) parts.push('Ctrl');
        if (config.shiftKey) parts.push('Shift');
        if (config.altKey) parts.push('Alt');
        if (config.metaKey) parts.push('Cmd');
        parts.push(config.key.toUpperCase());
        return parts.join('+');
    }

    // Check if event matches hotkey config
    function matchesHotkey(event, config) {
        return event.ctrlKey === config.ctrlKey &&
               event.shiftKey === config.shiftKey &&
               event.altKey === config.altKey &&
               event.metaKey === config.metaKey &&
               event.key.toLowerCase() === config.key.toLowerCase();
    }

    // Show toast notification (fast, subtle)
    function showToast(message, type = 'info', duration = 1200) {
        const toast = createElementSafe('div');
        const icons = { success: '✓', error: '✗', info: 'ⓘ' };
        const colors = { success: '#000', error: '#000', info: '#000' };

        toast.textContent = `${icons[type] || ''} ${message}`;
        toast.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 2147483647;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
        `;

        try {
            document.body.appendChild(toast);
        } catch (e) {
            document.documentElement.appendChild(toast);
        }

        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Auto-remove with fade out
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 200);
        }, duration);
    }

    // Show hotkey capture overlay with live preview
    function showHotkeyPrompt() {
        const promptOverlay = createElementSafe('div');
        promptOverlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        const promptBox = createElementSafe('div');
        promptBox.style.cssText = `
            background: white;
            padding: 24px 32px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transform: scale(0.9);
            transition: transform 0.2s ease;
        `;

        const title = createElementSafe('h2');
        title.textContent = 'Set Hotkey';
        title.style.cssText = 'margin: 0 0 8px 0; color: #000; font-size: 18px; font-weight: 600;';

        const instruction = createElementSafe('p');
        instruction.textContent = 'Hold modifiers, then press a key';
        instruction.style.cssText = 'color: #000; margin: 0 0 20px 0; font-size: 13px;';

        const preview = createElementSafe('div');
        const currentHotkey = getHotkey();
        preview.textContent = formatHotkey(currentHotkey);
        preview.style.cssText = `
            background: #000;
            padding: 16px;
            border-radius: 8px;
            font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            font-size: 18px;
            color: white;
            margin-bottom: 16px;
            min-height: 28px;
            font-weight: 500;
            letter-spacing: 1px;
        `;

        const hint = createElementSafe('div');
        hint.textContent = 'Current hotkey shown above';
        hint.style.cssText = 'font-size: 11px; color: #000; margin-bottom: 16px;';

        const cancelBtn = createElementSafe('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            background: #f0f0f0;
            color: #333;
            border: none;
            padding: 8px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: background 0.15s ease;
        `;
        cancelBtn.onmouseover = () => cancelBtn.style.background = '#e0e0e0';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#f0f0f0';

        cancelBtn.onclick = () => {
            document.removeEventListener('keydown', captureKey, true);
            document.removeEventListener('keyup', updatePreview, true);
            promptOverlay.style.opacity = '0';
            setTimeout(() => promptOverlay.remove(), 200);
        };

        promptBox.appendChild(title);
        promptBox.appendChild(instruction);
        promptBox.appendChild(preview);
        promptBox.appendChild(hint);
        promptBox.appendChild(cancelBtn);
        promptOverlay.appendChild(promptBox);

        // Update preview to show currently held modifiers
        const updatePreview = (e) => {
            const parts = [];
            if (e.ctrlKey) parts.push('Ctrl');
            if (e.shiftKey) parts.push('Shift');
            if (e.altKey) parts.push('Alt');
            if (e.metaKey) parts.push('Cmd');

            if (parts.length === 0) {
                preview.textContent = formatHotkey(currentHotkey);
                preview.style.background = '#f5f5f5';
                preview.style.color = '#333';
                hint.textContent = 'Current hotkey shown above';
            } else {
                preview.textContent = parts.join('+') + ' + ...';
                preview.style.background = '#e3f2fd';
                preview.style.color = '#1976d2';
                hint.textContent = 'Now press a key to complete combo';
            }
        };

        // Capture keydown event
        const captureKey = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Ignore modifier-only keys - wait for actual key press
            if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
                updatePreview(e);
                return;
            }

            const newHotkey = {
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                key: e.key.toLowerCase()
            };

            // Save and show confirmation
            setHotkey(newHotkey);
            preview.textContent = formatHotkey(newHotkey);
            preview.style.background = '#4CAF50';
            preview.style.color = '#fff';
            hint.textContent = '✓ Saved!';
            hint.style.color = '#4CAF50';

            document.removeEventListener('keydown', captureKey, true);
            document.removeEventListener('keyup', updatePreview, true);

            setTimeout(() => {
                promptOverlay.style.opacity = '0';
                setTimeout(() => promptOverlay.remove(), 200);
            }, 800);
        };

        document.addEventListener('keydown', captureKey, true);
        document.addEventListener('keyup', updatePreview, true);

        // Safari-safe appending
        try {
            document.body.appendChild(promptOverlay);
        } catch (e) {
            document.documentElement.appendChild(promptOverlay);
        }

        // Trigger animation
        requestAnimationFrame(() => {
            promptOverlay.style.opacity = '1';
            promptBox.style.transform = 'scale(1)';
        });
    }

    function getSelector(el) {
        // Priority 1: ID (most reliable)
        if (el.id) return `#${el.id}`;

        // Priority 2: Data attributes (often used for testing/automation)
        const dataAttrs = Array.from(el.attributes).filter(a => a.name.startsWith('data-'));
        if (dataAttrs.length) {
            const key = dataAttrs.find(a => a.name.includes('test') || a.name.includes('id') || a.name.includes('name')) || dataAttrs[0];
            return `[${key.name}="${key.value}"]`;
        }

        // Priority 3: Unique class combination
        if (el.className && typeof el.className === 'string') {
            const classes = el.className.trim().split(/\s+/).filter(c => c && !c.match(/^(active|hover|focus|disabled)$/));
            if (classes.length) {
                const selector = `${el.tagName.toLowerCase()}.${classes.join('.')}`;
                // Check if selector is unique
                if (document.querySelectorAll(selector).length === 1) return selector;
            }
        }

        // Priority 4: Role or aria-label
        if (el.getAttribute('role')) return `[role="${el.getAttribute('role')}"]`;
        if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;

        // Priority 5: For common elements, use semantic approach
        const tag = el.tagName.toLowerCase();
        if (['button', 'input', 'select', 'textarea'].includes(tag)) {
            if (el.name) return `${tag}[name="${el.name}"]`;
            if (el.type) return `${tag}[type="${el.type}"]`;
        }

        // Last resort: Minimal path from nearest ID
        let path = [];
        let current = el;
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
                path.unshift(`#${current.id}`);
                break;
            }
            const parent = current.parentElement;
            if (parent) {
                const index = Array.from(parent.children).indexOf(current) + 1;
                selector += `:nth-child(${index})`;
            }
            path.unshift(selector);
            current = parent;
        }
        return path.join(' > ');
    }

    // Helper: prefer stable classes (filter hashed/dynamic)
    function stableClasses(el) {
        if (!el.className || typeof el.className !== 'string') return [];
        return el.className.trim().split(/\s+/).filter(c =>
            c &&
            !/^(active|hover|focus|disabled|selected|open|closed|ng-|css-|sc-|is-|has-)$/.test(c) &&
            !/[A-Fa-f0-9]{6,}/.test(c) && // hashed-like
            !/^_[A-Za-z0-9]{5,}$/.test(c)
        );
    }

    // Generate multiple selector flavors + rationale
    function getSelectors(el) {
        const tag = el.tagName.toLowerCase();

        // 1) ID
        if (el.id) {
            return {
                css: `#${CSS.escape(el.id)}`,
                css_fallback: `#${CSS.escape(el.id)}`,
                contextual: null,
                rationale: 'id is unique and most stable'
            };
        }

        // 2) Data-* attributes with testing names
        const dataCandidates = Array.from(el.attributes)
            .filter(a => a.name.startsWith('data-'))
            .sort((a, b) => {
                const score = (n) => /test|cy|qa|id|name|tid/i.test(n) ? 0 : 1;
                return score(a.name) - score(b.name);
            });
        if (dataCandidates.length) {
            const key = dataCandidates[0];
            const css = `[${CSS.escape(key.name)}="${CSS.escape(key.value)}"]`;
            return {
                css,
                css_fallback: css,
                contextual: null,
                rationale: 'preferred data-* attribute for testing'
            };
        }

        // 3) Stable class combination unique in document
        const classes = stableClasses(el);
        if (classes.length) {
            const sel = `${tag}.${classes.map(c => CSS.escape(c)).join('.')}`;
            if (document.querySelectorAll(sel).length === 1) {
                return {
                    css: sel,
                    css_fallback: sel,
                    contextual: null,
                    rationale: 'unique stable class combination'
                };
            }
        }

        // 4) ARIA/role
        if (el.getAttribute('role')) {
            const css = `[role="${CSS.escape(el.getAttribute('role'))}"]`;
            return { css, css_fallback: css, contextual: null, rationale: 'role attribute' };
        }
        if (el.getAttribute('aria-label')) {
            const css = `[aria-label="${CSS.escape(el.getAttribute('aria-label'))}"]`;
            return { css, css_fallback: css, contextual: null, rationale: 'aria-label attribute' };
        }

        // 5) Semantic inputs
        if (['button', 'input', 'select', 'textarea'].includes(tag)) {
            if (el.name) {
                const css = `${tag}[name="${CSS.escape(el.name)}"]`;
                return { css, css_fallback: css, contextual: null, rationale: 'semantic name attribute' };
            }
            if (el.type) {
                const css = `${tag}[type="${CSS.escape(el.type)}"]`;
                return { css, css_fallback: css, contextual: null, rationale: 'semantic type attribute' };
            }
        }

        // 6) Contextual selector using :has() with adjacent label if present
        try {
            const idFor = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
            if (idFor) {
                const contextual = `label[for="${CSS.escape(el.id)}"] + ${tag}`;
                const hasSel = `label[for="${CSS.escape(el.id)}"]:has(+ ${tag})`;
                return {
                    css: contextual,
                    css_fallback: contextual,
                    contextual: hasSel,
                    rationale: ':has() anchor via associated label'
                };
            }
        } catch {}

        // 7) Minimal path from nearest ID, prefer :nth-of-type and sibling-unique class
        const path = [];
        let cur = el;
        const settings = getSettings();
        while (cur && cur !== document.body) {
            if (cur.id) {
                path.unshift(`#${CSS.escape(cur.id)}`);
                break;
            }
            let seg = cur.tagName.toLowerCase();
            const sc = stableClasses(cur);
            if (sc.length) {
                const sibSel = `${seg}.${sc.map(c => CSS.escape(c)).join('.')}`;
                const parent = cur.parentElement;
                if (parent && parent.querySelectorAll(`:scope > ${sibSel}`).length === 1) {
                    seg = sibSel;
                }
            }
            if (!/#|\./.test(seg)) {
                const parent = cur.parentElement;
                if (parent) {
                    const same = Array.from(parent.children).filter(n => n.tagName === cur.tagName);
                    const index = same.indexOf(cur) + 1;
                    seg += `:nth-of-type(${index})`;
                }
            }
            path.unshift(seg);
            if (!settings.deepShadow && cur.getRootNode() instanceof ShadowRoot) {
                const host = cur.getRootNode().host;
                if (host) {
                    path.unshift(host.tagName.toLowerCase());
                    break;
                }
            }
            cur = cur.parentElement || (cur.getRootNode() instanceof ShadowRoot ? cur.getRootNode().host : null);
        }
        const finalSel = path.join(' > ');
        return { css: finalSel, css_fallback: finalSel, contextual: null, rationale: 'structural path from nearest id' };
    }

    function highlight(el) {
        const rect = el.getBoundingClientRect();
        const sels = getSelectors(el);
        const selector = sels.css;

        // Thin precise border
        overlay.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;background:transparent;border:1px solid #0088ff;pointer-events:none;z-index:2147483647;display:block;box-sizing:border-box;outline:1px solid rgba(255,255,255,0.5);outline-offset:-2px`;

        // Build enhanced tree view
        let content = selector;

        // Always build tree view to show element hierarchy with attributes
        const buildTree = () => {
            const elements = [];
            let curr = el;

            // Collect elements up to root or nearest ID
            while (curr && curr !== document.body) {
                const attrs = [];

                // Build comprehensive element description
                const tag = curr.tagName.toLowerCase();
                const parts = [];

                // Always start with tag
                parts.push(`<span style="color:#6db3f2">${tag}</span>`);

                // Add ID if present
                if (curr.id) {
                    parts.push(`<span style="color:#86c1b9">#${curr.id}</span>`);
                }

                // Add classes (first 2-3 meaningful ones)
                if (curr.className && typeof curr.className === 'string') {
                    const classes = curr.className.trim().split(/\s+/)
                        .filter(c => c && !c.match(/^(active|hover|focus|disabled|selected|open|closed|ng-|css-)/))
                        .slice(0, 2);
                    if (classes.length > 0) {
                        parts.push(`<span style="color:#f0c674">.${classes.join('.')}</span>`);
                    }
                }

                // Add key attributes
                if (curr.getAttribute('role')) {
                    parts.push(`<span style="color:#cc99cc">[role=${curr.getAttribute('role')}]</span>`);
                }

                // Show actual data attributes
                const dataAttrs = Array.from(curr.attributes)
                    .filter(attr => attr.name.startsWith('data-'))
                    .slice(0, 2); // Show first 2 data attributes

                dataAttrs.forEach(attr => {
                    let value = attr.value;
                    if (value.length > 12) value = value.substring(0, 10) + '..';
                    parts.push(`<span style="color:#cc99cc">[${attr.name}="${value}"]</span>`);
                });

                // Add text content for leaf nodes
                if (curr.textContent && curr.textContent.trim() && curr.children.length === 0) {
                    const text = curr.textContent.trim().substring(0, 15);
                    parts.push(`<span style="color:#b19cd9">"${text}${curr.textContent.trim().length > 15 ? '...' : ''}"</span>`);
                }

                attrs.push(parts.join(' '));

                elements.unshift({
                    tag: curr.tagName.toLowerCase(),
                    attrs: attrs,
                    element: curr
                });

                if (curr.id) break; // Stop at ID
                curr = curr.parentElement;
            }

            // Build tree display with proper tree characters
            return elements.map((item, i) => {
                const isTarget = i === elements.length - 1;
                const isRoot = i === 0;

                let line = '';

                // Build indent with vertical lines
                for (let j = 0; j < i; j++) {
                    line += j < i - 1 ? '│ ' : '';
                }

                // Add connector
                if (!isRoot) {
                    line += isTarget ? '└─ ' : '├─ ';
                }

                let display = item.attrs.join(' ') || item.tag;

                // Highlight target with better visual distinction
                if (isTarget) {
                    return `<span style="color:#666">${line}</span><span style="background:rgba(0,255,255,0.1);padding:1px 3px;border-radius:2px">${display}</span>`;
                }
                return `<span style="color:#666">${line}</span>${display}`;
            }).join('\n');
        };

        const tree = buildTree();
        const shadowInfo = (function(){ try { return describeShadowPath(el); } catch { return { path: [], crossedClosed: false }; } })();
        const shadowLine = shadowInfo.path && shadowInfo.path.length ? `\n<span style=\"color:#888\">shadow:</span> ${shadowInfo.path.join(' ➜ ')}${shadowInfo.crossedClosed ? ' (closed)' : ''}` : '';

        // Truncate selector for display
        const displaySelector = selector.length > 60 ? selector.substring(0, 57) + '...' : selector;

        // Remove text preview - already shown in tree

        // Only show the selector if it's different from the last item in tree
        const lastTreeItem = tree.split('\n').pop();
        const lastTreeText = lastTreeItem.replace(/<[^>]*>/g, '').trim();
        const selectorDisplay = lastTreeText.includes(selector) || selector === lastTreeText.replace(/[└─\s]/g, '')
            ? ''
            : `\n<div style="margin-top:8px;padding-top:8px;border-top:1px solid #444"><div style="font-size:11px;color:#0ff">${displaySelector}</div></div>`;

        content = `${tree}${shadowLine}${selectorDisplay}`;

        tooltip.innerHTML = content;
        tooltip.style.cssText = 'position:fixed;background:#000;color:#fff;padding:10px 12px;font:11px monospace;border-radius:4px;pointer-events:none;z-index:2147483647;display:block;max-width:500px;box-shadow:0 2px 8px rgba(0,0,0,0.4);line-height:1.5;white-space:pre-wrap';

        // Calculate tooltip dimensions after styling
        const tooltipRect = tooltip.getBoundingClientRect();
        const gap = 5;

        // Find best position (priority: top, bottom, right, left)
        let pos = null;

        // Try above
        if (rect.top - tooltipRect.height - gap > 0) {
            pos = {
                left: Math.min(Math.max(rect.left, gap), window.innerWidth - tooltipRect.width - gap),
                top: rect.top - tooltipRect.height - gap
            };
        }
        // Try below
        else if (rect.bottom + tooltipRect.height + gap < window.innerHeight) {
            pos = {
                left: Math.min(Math.max(rect.left, gap), window.innerWidth - tooltipRect.width - gap),
                top: rect.bottom + gap
            };
        }
        // Try right
        else if (rect.right + tooltipRect.width + gap < window.innerWidth) {
            pos = {
                left: rect.right + gap,
                top: Math.min(Math.max(rect.top, gap), window.innerHeight - tooltipRect.height - gap)
            };
        }
        // Try left
        else if (rect.left - tooltipRect.width - gap > 0) {
            pos = {
                left: rect.left - tooltipRect.width - gap,
                top: Math.min(Math.max(rect.top, gap), window.innerHeight - tooltipRect.height - gap)
            };
        }
        // Fallback: top-right corner of viewport
        else {
            pos = {
                left: window.innerWidth - tooltipRect.width - 20,
                top: 20
            };
        }

        tooltip.style.left = pos.left + 'px';
        tooltip.style.top = pos.top + 'px';
    }

    function cleanupActiveListeners() {
        if (controller) {
            try { controller.abort(); } catch {}
            controller = null;
        }
        if (ro) { try { ro.disconnect(); } catch {} ro = null; }
        if (rafToken) { try { cancelAnimationFrame(rafToken); } catch {} rafToken = null; }
    }

    function toggle() {
        active = !active;
        document.body.style.cursor = active ? 'crosshair' : '';
        const opts = getSettings();
        if (!active) {
            overlay.style.display = 'none';
            tooltip.style.display = 'none';
            cleanupActiveListeners();
        } else {
            controller = new AbortController();
            const signal = controller.signal;

            const pointerMove = (e) => {
                if (rafToken) return; // throttle to 1 per frame
                rafToken = requestAnimationFrame(() => {
                    rafToken = null;
                    if (!active) return;
                    let target = null;
                    const path = typeof e.composedPath === 'function' ? e.composedPath() : null;
                    if (path && path.length) {
                        for (const node of path) {
                            if (node && node.nodeType === 1) { target = node; break; }
                        }
                    }
                    if (!target) target = getDeepestElement(e.clientX, e.clientY);
                    if (!target || target === overlay || target === tooltip) return;
                    current = target;
                    highlight(target);
                });
            };

            const passive = opts.passiveListeners ? { passive: true, signal } : { signal };
            document.addEventListener('pointermove', pointerMove, passive);
            document.addEventListener('pointerover', pointerMove, passive);
            document.addEventListener('scroll', () => { if (active && current) highlight(current); }, { capture: true, ...passive });
            window.addEventListener('resize', () => { if (active && current) highlight(current); }, passive);

            try {
                ro = new ResizeObserver(() => { if (active && current) highlight(current); });
                ro.observe(document.documentElement);
                if (document.body) ro.observe(document.body);
            } catch {}
        }

        const hotkey = getHotkey();
        if (active) {
            showToast(`Selector ON • ${formatHotkey(hotkey)} to exit`, 'success', 1000);
        } else {
            showToast('Selector OFF', 'info', 800);
        }
    }

    // Safari-compatible initialization with CSP handling
    function safariCompatibleInit() {
        return new Promise((resolve) => {
            // Wait for body to be available
            const waitForBody = () => {
                if (document.body) {
                    resolve();
                } else {
                    setTimeout(waitForBody, 10);
                }
            };
            waitForBody();
        });
    }

    // Initialize function
    function init() {
        if (initialized) return;
        initialized = true;

        // Create elements with CSP-safe approach
        overlay = createElementSafe('div');
        tooltip = createElementSafe('div');
        overlay.style.display = 'none';
        tooltip.style.display = 'none';

        // Use safer DOM manipulation for Safari
        try {
            document.body.appendChild(overlay);
            document.body.appendChild(tooltip);
        } catch (e) {
            // Fallback for CSP issues
            document.documentElement.appendChild(overlay);
            document.documentElement.appendChild(tooltip);
        }

        // Register shortcuts with native keyboard events
        document.addEventListener('keydown', (e) => {
            const hotkey = getHotkey();

            // Check if custom hotkey matches
            if (matchesHotkey(e, hotkey)) {
                e.preventDefault();
                toggle();
            }
            // Escape to exit
            if (e.key === 'Escape' && active) {
                e.preventDefault();
                toggle();
            }
        });

        // Active-mode listeners are attached in toggle() using pointer events

        document.addEventListener('click', e => {
            if (active && current) {
                e.preventDefault();
                e.stopPropagation();

                const sels = getSelectors(current);
                const selector = sels.css;

                const meta = buildMeta(current, sels);
                const plain = `${selector}\n---\n${JSON.stringify(meta)}`;

                const copyToClipboard = async () => {
                    const settings = getSettings();
                    if (navigator.clipboard) {
                        try {
                            if (settings.richCopy && navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
                                const html = `<pre>${escapeHtml(JSON.stringify(meta, null, 2))}</pre>`;
                                const item = new ClipboardItem({
                                    'text/plain': new Blob([plain], { type: 'text/plain' }),
                                    'text/html': new Blob([html], { type: 'text/html' })
                                });
                                await navigator.clipboard.write([item]);
                                return true;
                            } else if (navigator.clipboard.writeText) {
                                await navigator.clipboard.writeText(plain);
                                return true;
                            }
                        } catch (err) {
                            // will fallback
                        }
                    }

                    // Legacy fallback
                    const textarea = createElementSafe('textarea');
                    textarea.value = plain;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    textarea.style.pointerEvents = 'none';
                    document.body.appendChild(textarea);
                    textarea.select();
                    textarea.setSelectionRange(0, 99999);
                    let ok = false;
                    try { ok = document.execCommand('copy'); } catch {}
                    try { document.body.removeChild(textarea); } catch {}
                    return ok;
                };

                copyToClipboard().then(success => {
                    if (success) {
                        const displaySel = selector.length > 40 ? selector.substring(0, 37) + '...' : selector;
                        showToast(`Copied: ${displaySel}`, 'success', 1500);
                    } else {
                        showToast('Copy denied by browser policy', 'error', 1500);
                    }
                });
            }
        });

        // Register Tampermonkey menu commands
        const hotkey = getHotkey();
        GM_registerMenuCommand('Toggle Selector Tool', () => {
            toggle();
        }, {
            accessKey: 't',
            autoClose: true,
            title: `Toggle selector mode (Hotkey: ${formatHotkey(hotkey)})`
        });

        GM_registerMenuCommand('Change hotkey...', () => {
            showHotkeyPrompt();
        }, {
            accessKey: 'h',
            autoClose: true,
            title: 'Change the keyboard shortcut for toggling selector mode'
        });

        // Settings toggles for quick control
        GM_registerMenuCommand('Toggle rich copy (text+HTML+JSON)', () => {
            const s = getSettings();
            s.richCopy = !s.richCopy; saveSettings(s);
            showToast(`Rich copy ${s.richCopy ? 'enabled' : 'disabled'}`);
        }, { accessKey: 'r', autoClose: true, title: 'Write both text and HTML to clipboard when possible' });

        GM_registerMenuCommand('Toggle deep shadow traversal', () => {
            const s = getSettings();
            s.deepShadow = !s.deepShadow; saveSettings(s);
            showToast(`Deep shadow ${s.deepShadow ? 'enabled' : 'disabled'}`);
        }, { accessKey: 'd', autoClose: true, title: 'Traverse open shadow roots when generating selectors' });

        GM_registerMenuCommand('Toggle SPA-aware navigation hooks', () => {
            const s = getSettings();
            s.spaAware = !s.spaAware; saveSettings(s);
            showToast(`SPA hooks ${s.spaAware ? 'enabled' : 'disabled'}`);
        }, { accessKey: 's', autoClose: true, title: 'Reinitialize on pushState/replaceState/popstate/hashchange' });
    }

    // Safari-compatible initialization with better CSP handling
    function safariInit() {
        // For Safari, we need to be more careful about timing and CSP
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                safariCompatibleInit().then(init);
            });
        } else {
            // DOM already loaded, but wait for body to be ready
            safariCompatibleInit().then(init);
        }
    }

    // Check if we're in Safari and use appropriate initialization
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
        // Safari-specific initialization
        safariInit();
    } else {
        // Standard initialization for other browsers
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    // SPA-aware navigation hooks: patch history and listen for events
    (function setupSpaHooksOnce() {
        if (window.__est_spa_hooks_installed__) return; // idempotent
        window.__est_spa_hooks_installed__ = true;
        const dispatchNav = () => window.dispatchEvent(new Event('est:navigation'));
        const origPush = history.pushState;
        const origReplace = history.replaceState;
        history.pushState = function() { const r = origPush.apply(this, arguments); dispatchNav(); return r; };
        history.replaceState = function() { const r = origReplace.apply(this, arguments); dispatchNav(); return r; };
        window.addEventListener('popstate', dispatchNav);
        window.addEventListener('hashchange', dispatchNav);
    })();

    const onNav = () => {
        const s = getSettings();
        if (!s.spaAware) return;
        setTimeout(() => {
            if (!initialized || !document.body.contains(overlay)) {
                initialized = false;
                init();
            }
        }, 300);
    };
    window.addEventListener('est:navigation', onNav);

    // Helpers inside IIFE
    function escapeHtml(s) {
        return String(s).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    function stableClassList(el) {
        if (!el.className || typeof el.className !== 'string') return [];
        return el.className.trim().split(/\s+/).filter(Boolean).slice(0, 6);
    }

    function buildMeta(el, sels) {
        const getAttr = (n) => el.getAttribute(n);
        const dataAttrs = {};
        for (const a of Array.from(el.attributes || [])) {
            if (a.name.startsWith('data-')) dataAttrs[a.name] = a.value;
        }
        const role = getAttr('role');
        const aria = getAttr('aria-label');
        const classes = stableClassList(el);
        const name = (el.getAttribute('name') || '').slice(0, 80);
        const id = el.id || '';
        const tag = el.tagName ? el.tagName.toLowerCase() : '';
        const accName = (el.innerText || el.textContent || '').trim().slice(0, 120);
        const { path: shadowPath, crossedClosed } = describeShadowPath(el);

        return {
            selector: sels.css,
            selectors: {
                css: sels.css,
                css_fallback: sels.css_fallback,
                contextual: sels.contextual
            },
            tag, id, classes, data: dataAttrs,
            role: role || null, ariaLabel: aria || null, name: name || null,
            text: accName,
            shadowPath, shadowClosed: crossedClosed,
            rationale: sels.rationale
        };
    }
})();
