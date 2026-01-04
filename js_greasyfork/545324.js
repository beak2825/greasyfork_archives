// ==UserScript==
// @name         QuickCSS [Pre-Alpha]
// @namespace    http://tampermonkey.net/
// @version      0.0.1.1
// @description  Userscript recreation of the fan-favorite QuickCSS. Modify CSS on any website on a per-URL (or domain/wildcard) basis.
// @author       Setnour6
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/545324/QuickCSS%20%5BPre-Alpha%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/545324/QuickCSS%20%5BPre-Alpha%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** Data Model ***/
    let config = GM_getValue('quickCssConfig', null);
    if (!config || typeof config !== 'object' || !Array.isArray(config.rules)) {
        config = { rules: [] };
        GM_setValue('quickCssConfig', config);
    }

    if (!config.shortcuts || typeof config.shortcuts !== 'object') {
        config.shortcuts = { enabled: true, showHints: true };
        GM_setValue('quickCssConfig', config);
    }

    /*** Utility: URL Matcher ***/
    function matchPattern(url, pattern, scope) {
        if (!pattern) return false;
        try {
            let u = new URL(url);
            let host = u.host; // includes port if present
            if (scope === 'exact' && url === pattern) return true;
            if (scope === 'exactDomain' && host === pattern) return true;
            if (scope === 'subdomain' && (host === pattern || host.endsWith('.' + pattern))) return true;
            if (scope === 'wildcard') {
                // transform pattern with * to regex (applies to whole URL). escape everything but '*' then replace '*' with '.*'
                let parts = pattern.split('*').map(escapeRE);
                let regex = new RegExp('^' + parts.join('.*') + '$');
                return regex.test(url);
            }
        } catch (e) {
            console.warn('QuickCSS: matchPattern error', e);
        }
        return false;
    }
    function escapeRE(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

    /*** Inject matched CSS ***/
    function removeInjectedStyles(root) {
        try {
            const styles = root.querySelectorAll && root.querySelectorAll('style[data-quick-css]');
            if (styles && styles.length) {
                styles.forEach(s => s.remove());
            }
        } catch (e) {
            // ignore
        }
    }

    function injectCSS(css, root) {
        try {
            const docForCreate = (root && root.ownerDocument) ? root.ownerDocument : root;
            if (!docForCreate || typeof docForCreate.createElement !== 'function') return;

            try { removeInjectedStyles(root); } catch (e) {}

            const style = docForCreate.createElement('style');
            style.setAttribute('data-quick-css', 'true');
            style.textContent = css;
            if (root instanceof ShadowRoot) {
                root.appendChild(style);
            } else if (root.head) {
                root.head.appendChild(style);
            } else {
                (docForCreate.documentElement || docForCreate).appendChild(style);
            }
        } catch (err) {
            console.error('QuickCSS: Failed to inject CSS:', err);
        }
    }

    function walkAndInjectShadowRoots(root, cssText) {
        try {
            const walkerRoot = root.body || root;
            const walker = (walkerRoot && walkerRoot.ownerDocument) ? walkerRoot.ownerDocument.createTreeWalker(walkerRoot, NodeFilter.SHOW_ELEMENT, null, false) : document.createTreeWalker(walkerRoot, NodeFilter.SHOW_ELEMENT, null, false);
            while (walker.nextNode()) {
                const el = walker.currentNode;
                if (el && el.shadowRoot) {
                    injectCSS(cssText, el.shadowRoot);
                    walkAndInjectShadowRoots(el.shadowRoot, cssText);
                }
            }
        } catch (e) {
            // fallback silent
        }
    }

    function injectIntoDocument(doc, cssText) {
        try {
            injectCSS(cssText, doc);
            walkAndInjectShadowRoots(doc, cssText);
        } catch (err) {
            console.error('QuickCSS: injectIntoDocument error', err);
        }
    }

    function applyCustomCSS() {
        const url = location.href;
        const cssText = (config.rules || [])
        .filter(rule => matchPattern(url, rule.pattern, rule.scope))
        .map(rule => `/* rule ${rule.id} (${rule.pattern} [${rule.scope}]) */\n${rule.css}`)
        .join('\n');

        try { removeInjectedStyles(document); } catch(e){}
        if (cssText) {
            injectIntoDocument(document, cssText);
        }

        document.querySelectorAll('iframe').forEach(iframe => handleIframeInjection(iframe, cssText));
    }

    function handleIframeInjection(iframe, cssText) {
        try {
            if (!iframe.contentDocument || !iframe.contentWindow) {
                iframe.addEventListener('load', function tryInject() {
                    iframe.removeEventListener('load', tryInject);
                    try {
                        injectIntoDocument(iframe.contentDocument, cssText);
                    } catch (e) {
                        console.warn('QuickCSS: cannot inject into iframe after load (likely cross-origin).');
                    }
                }, { once: true });
                return;
            }
            injectIntoDocument(iframe.contentDocument, cssText);
        } catch (e) {
            // console.warn('QuickCSS: Skipping cross-origin iframe.');
        }
    }

    /*** Live DOM watcher for future iframes & shadow roots ***/
    const domObserver = new MutationObserver(mutations => {
        const url = location.href;
        const cssText = (config.rules || [])
        .filter(rule => matchPattern(url, rule.pattern, rule.scope))
        .map(rule => `/* rule ${rule.id} (${rule.pattern} [${rule.scope}]) */\n${rule.css}`)
        .join('\n');

        mutations.forEach(m => {
            m.addedNodes && m.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                if (node.tagName === 'IFRAME') {
                    handleIframeInjection(node, cssText);
                }
                if (node.shadowRoot) {
                    try { injectCSS(cssText, node.shadowRoot); walkAndInjectShadowRoots(node.shadowRoot, cssText); } catch(e){}
                }
                node.querySelectorAll && node.querySelectorAll('iframe').forEach(f => handleIframeInjection(f, cssText));
                node.querySelectorAll && node.querySelectorAll('*').forEach(el => {
                    if (el.shadowRoot) {
                        try { injectCSS(cssText, el.shadowRoot); walkAndInjectShadowRoots(el.shadowRoot, cssText); } catch(e){}
                    }
                });
            });
        });
    });

    try {
        domObserver.observe(document, { childList: true, subtree: true });
    } catch (e) {
        // ignore if cannot observe
    }

    /*** UI Overlay ***/
    function openEditor() {
        if (document.getElementById('quick-css-editor')) return; // Prevent multiple overlays

        let overlay = document.createElement('div');
        overlay.id = 'quick-css-editor';
        Object.assign(overlay.style, {
            position:'fixed',top:0,left:0,width:'100%',height:'100%',
            background:'rgba(0,0,0,0.6)',zIndex:9999999,
            display:'flex',alignItems:'center',justifyContent:'center'
        });

        let modal = document.createElement('div');
        Object.assign(modal.style, {
            width:'600px',maxHeight:'90%',overflowY:'auto',
            background:'#1e1e1e',borderRadius:'8px',padding:'20px',
            boxShadow:'0 4px 20px rgba(0,0,0,0.5)',color:'#fff',
            fontFamily:'Segoe UI, sans-serif'
        });

        modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2 style="margin:0;font-size:1.3em">Quick CSS Editor</h2>
        <button id="qce-close" style="background:none;border:none;color:#fff;font-size:1.2em;cursor:pointer">✕</button>
      </div>
      <div id="qce-list" style="margin-top:10px"></div>
      <div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap">
        <button id="qce-add" style="padding:8px 12px;border:none;border-radius:4px;background:#007acc;cursor:pointer">+ Add Rule</button>
        <button id="qce-export" style="padding:8px 12px;border:none;border-radius:4px;background:#6f42c1;cursor:pointer">Export</button>
        <button id="qce-import" style="padding:8px 12px;border:none;border-radius:4px;background:#17a2b8;cursor:pointer">Import</button>
      </div>
    `;
      overlay.appendChild(modal);
        function updateShortcutHints(modal) {
            const hintMap = {
                '#qce-close': 'Alt+Shift+Q',
                '#qce-save': 'Alt+Shift+S',
                '#qce-cancel': 'Alt+Shift+C',
                '#qce-add': 'Alt+Shift+N',
                '#qce-export': 'Alt+Shift+X',
                '#qce-import': 'Alt+Shift+I'
            };
            const show = !!(config && config.shortcuts && config.shortcuts.showHints);

            Object.keys(hintMap).forEach(sel => {
                const btn = (modal && modal.querySelector(sel)) || document.querySelector(sel);
                if (!btn) return;

                const existing = btn.parentNode && btn.parentNode.querySelector('.qce-shortcut-hint[data-for="' + sel + '"]');
                if (existing) existing.remove();

                if (show) {
                    const span = document.createElement('span');
                    span.className = 'qce-shortcut-hint';
                    span.setAttribute('data-for', sel);
                    span.textContent = ' (' + hintMap[sel] + ')';
                    span.style.cssText = 'margin-left:6px;color:#9ecbff;font-size:0.85em;font-weight:500';
                    try { btn.insertAdjacentElement('afterend', span); } catch (e) { btn.parentNode && btn.parentNode.appendChild(span); }
                }
            });
        }

        const settingsContainer = document.createElement('div');
        settingsContainer.style.cssText = 'margin-top:12px;padding:8px;border-top:1px solid #333;color:#ddd;font-size:0.95em;display:flex;flex-direction:column;gap:6px;';

        settingsContainer.innerHTML = `
  <label style="display:flex;align-items:center;gap:8px">
    <input type="checkbox" id="qce-shortcuts-enabled-checkbox"> Enable keyboard shortcuts (functionality)
  </label>
  <label style="display:flex;align-items:center;gap:8px">
    <input type="checkbox" id="qce-shortcuts-show-checkbox"> Show keyboard shortcut hints in the UI
  </label>
  <div style="color:#9aa; font-size:0.85em">Tip: Open editor — <strong>Alt+Shift+E</strong>. When enabled, other shortcuts: Save (<strong>Alt+Shift+S</strong>), Cancel (<strong>Alt+Shift+C/X</strong>), Close (<strong>Alt+Shift+Q</strong>).</div>
`;
        modal.appendChild(settingsContainer);

        const shortcutsEnabledCheckbox = modal.querySelector('#qce-shortcuts-enabled-checkbox');
        const shortcutsShowCheckbox = modal.querySelector('#qce-shortcuts-show-checkbox');
        shortcutsEnabledCheckbox.checked = !!(config && config.shortcuts && config.shortcuts.enabled);
        shortcutsShowCheckbox.checked = !!(config && config.shortcuts && config.shortcuts.showHints);

        shortcutsEnabledCheckbox.addEventListener('change', () => {
            config.shortcuts = config.shortcuts || {};
            config.shortcuts.enabled = !!shortcutsEnabledCheckbox.checked;
            GM_setValue('quickCssConfig', config);
            // no further UI changes necessary; handler reads config directly
        });

        shortcutsShowCheckbox.addEventListener('change', () => {
            config.shortcuts = config.shortcuts || {};
            config.shortcuts.showHints = !!shortcutsShowCheckbox.checked;
            GM_setValue('quickCssConfig', config);
            updateShortcutHints(modal);
        });
        updateShortcutHints(modal);

        const _origRenderRules = renderRules;
        renderRules = function() {
            _origRenderRules();
            setTimeout(()=>updateShortcutHints(modal), 0.01);
        };
      document.body.appendChild(overlay);

      document.getElementById('qce-close').onclick = () => overlay.remove();
      document.getElementById('qce-add').onclick = () => renderRuleForm();

      const listEl = modal.querySelector('#qce-list');

      function renderRules() {
          listEl.innerHTML = '';
          (config.rules || []).forEach(rule => {
              let item = document.createElement('div');
              Object.assign(item.style, {padding:'8px',borderBottom:'1px solid #333',display:'flex',justifyContent:'space-between',alignItems:'center'});
              item.innerHTML = `
          <div style="max-width:70%;word-break:break-word">
            <strong>${escapeHtml(rule.pattern)}</strong> <span style="color:#aaa">[${escapeHtml(rule.scope)}]</span>
            <div style="color:#9a9a9a;font-size:0.9em;margin-top:6px;white-space:pre-wrap;max-height:4.5em;overflow:hidden">${escapeHtml(rule.css)}</div>
          </div>
          <div style="flex-shrink:0">
            <button data-id="${rule.id}" class="qce-edit" style="margin-right:8px">Edit</button>
            <button data-id="${rule.id}" class="qce-del">Delete</button>
          </div>`;
          listEl.appendChild(item);
      });
        listEl.querySelectorAll('.qce-edit').forEach(btn=>{
            btn.onclick = () => renderRuleForm(btn.dataset.id);
        });
        listEl.querySelectorAll('.qce-del').forEach(btn=>{
            btn.onclick = () => {
                if(confirm('Delete this rule?')) {
                    config.rules = config.rules.filter(r=>r.id!==btn.dataset.id);
                    GM_setValue('quickCssConfig', config);
                    renderRules();
                    applyCustomCSS();
                }
            };
        });

        document.getElementById('qce-export').onclick = () => {
            const json = JSON.stringify(config, null, 2);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(json).then(() => {
                    alert('QuickCSS: Config copied to clipboard.');
                }, () => {
                    prompt('Copy this JSON manually:', json);
                });
            } else {
                prompt('Copy this JSON:', json);
            }
        };

        document.getElementById('qce-import').onclick = () => {
            const input = prompt('Paste your exported QuickCSS JSON:');
            if (!input) return;
            try {
                const parsed = JSON.parse(input);
                if (parsed && parsed.rules && Array.isArray(parsed.rules)) {
                    config = parsed;
                    GM_setValue('quickCssConfig', config);
                    alert('QuickCSS: Config imported.');
                    overlay.remove();
                    openEditor();
                    applyCustomCSS();
                } else {
                    throw new Error();
                }
            } catch {
                alert('QuickCSS: Invalid JSON.');
            }
        };
    }

      function renderRuleForm(editId) {
          let existing = document.getElementById('qce-form');
          if (existing) existing.remove();

          let rule = editId ? (config.rules.find(r=>r.id===editId) || { id: editId, pattern:'', scope:'exactDomain', css:'' }) : { id: Date.now().toString(), pattern:'', scope:'exactDomain', css:'' };

          let form = document.createElement('div');
          form.id = 'qce-form';
          Object.assign(form.style, {marginTop:'20px',padding:'10px',background:'#2b2b2b',borderRadius:'6px'});
          form.innerHTML = `
        <label>URL/Domain Pattern:</label><br>
        <input id="qce-pattern" value="${escapeHtmlAttr(rule.pattern)}" style="width:100%;padding:6px;margin-top:4px;background:#1e1e1e;border:1px solid #444;color:#fff;"><br><br>
        <label>Scope:</label><br>
        <select id="qce-scope" style="width:100%;padding:6px;background:#1e1e1e;border:1px solid #444;color:#fff;margin-top:4px;">
          <option value="exact" ${rule.scope==='exact'?'selected':''}>Exact URL</option>
          <option value="exactDomain" ${rule.scope==='exactDomain'?'selected':''}>Exact Domain</option>
          <option value="subdomain" ${rule.scope==='subdomain'?'selected':''}>Include Subdomains</option>
          <option value="wildcard" ${rule.scope==='wildcard'?'selected':''}>Wildcard (*)</option>
        </select><br><br>
        <label>Custom CSS:</label><br>
        <textarea id="qce-css" rows="6" style="width:100%;padding:6px;background:#1e1e1e;border:1px solid #444;color:#fff;">${escapeHtmlAttr(rule.css)}</textarea><br><br>
        <button id="qce-save" style="padding:8px 12px;border:none;border-radius:4px;background:#28a745;cursor:pointer">Save</button>
        <button id="qce-cancel" style="padding:8px 12px;border:none;border-radius:4px;background:#dc3545;cursor:pointer;margin-left:8px">Cancel</button>
      `;
        listEl.prepend(form);

        modal.querySelector('#qce-cancel').onclick = () => form.remove();
        modal.querySelector('#qce-save').onclick = () => {
            rule.pattern = form.querySelector('#qce-pattern').value.trim();
            rule.scope = form.querySelector('#qce-scope').value;
            rule.css = form.querySelector('#qce-css').value;
            let idx = config.rules.findIndex(r=>r.id===rule.id);
            if (idx>=0) config.rules[idx] = rule;
            else config.rules.push(rule);
            GM_setValue('quickCssConfig', config);
            form.remove();
            renderRules();
            applyCustomCSS();
        };
    }

      renderRules();
  }

    document.removeEventListener && document.removeEventListener('keydown', window.__qce_key_handler);
    window.__qce_key_handler = function (e) {
        if (!e.altKey || !e.shiftKey) return;
        if (!config || !config.shortcuts || !config.shortcuts.enabled) return; // Respect the enable/disable toggle

        const k = (e.key || '').toLowerCase();

        // Alt+Shift+E -> toggle editor (global)
        if (k === 'e') {
            e.preventDefault();
            const existing = document.getElementById('quick-css-editor');
            if (existing) existing.remove();
            else openEditor();
            return;
        }

        // If editor isn't open, other shortcuts do nothing
        const overlay = document.getElementById('quick-css-editor');
        if (!overlay) return;

        // Alt+Shift+S -> Save (click the Save button if present)
        if (k === 's') {
            e.preventDefault();
            const saveBtn = overlay.querySelector('#qce-save');
            if (saveBtn) saveBtn.click();
            return;
        }

        // Alt+Shift+C or Alt+Shift+X -> Cancel (click the Cancel button if present)
        if (k === 'c' || k === 'x') {
            e.preventDefault();
            const cancelBtn = overlay.querySelector('#qce-cancel');
            if (cancelBtn) cancelBtn.click();
            return;
        }

        // Alt+Shift+Q -> Close overlay
        if (k === 'q') {
            e.preventDefault();
            overlay.remove();
            return;
        }

        // Alt+Shift+N -> Add new rule
        if (k === 'n') {
            e.preventDefault();
            const addBtn = overlay.querySelector('#qce-add');
            if (addBtn) addBtn.click();
            return;
        }

        // Alt+Shift+X -> Export
        if (k === 'x' && e.altKey && e.shiftKey && overlay) {
            // prefer the explicit export button if present
            const expBtn = overlay.querySelector('#qce-export');
            if (expBtn) { e.preventDefault(); expBtn.click(); }
            return;
        }

        // Alt+Shift+I -> Import
        if (k === 'i' && overlay) {
            const impBtn = overlay.querySelector('#qce-import');
            if (impBtn) { e.preventDefault(); impBtn.click(); }
            return;
        }
    };
    document.addEventListener('keydown', window.__qce_key_handler);

    /*** Register menu command ***/
    try {
        GM_registerMenuCommand && GM_registerMenuCommand('Quick CSS Editor…', openEditor);
    } catch (e) {
        console.warn('QuickCSS: failed to register menu command', e);
    }

    function updateShortcutHints(modal) {
        const hintMap = {
            '#qce-close': 'Alt+Shift+Q',
            '#qce-save': 'Alt+Shift+S',
            '#qce-cancel': 'Alt+Shift+C',
            '#qce-add': 'Alt+Shift+N',
            '#qce-export': 'Alt+Shift+X',
            '#qce-import': 'Alt+Shift+I'
        };
        const show = !!(config && config.shortcuts && config.shortcuts.showHints);

        Object.keys(hintMap).forEach(sel => {
            const btn = (modal && modal.querySelector(sel)) || document.querySelector(sel);
            if (!btn) return;

            const existing = btn.parentNode && btn.parentNode.querySelector('.qce-shortcut-hint[data-for="' + sel + '"]');
            if (existing) existing.remove();

            if (show) {
                const span = document.createElement('span');
                span.className = 'qce-shortcut-hint';
                span.setAttribute('data-for', sel);
                span.textContent = ' (' + hintMap[sel] + ')';
                span.style.cssText = 'margin-left:6px;color:#9ecbff;font-size:0.85em;font-weight:500';
                try { btn.insertAdjacentElement('afterend', span); } catch (e) { btn.parentNode && btn.parentNode.appendChild(span); } // works for most layouts
            }
        });
    }

    /*** Helpers ***/
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]); });
    }
    function escapeHtmlAttr(str) {
        return escapeHtml(str).replace(/\n/g, '&#10;'); // preserve newlines in textarea by escaping attributes, but for safety
    }

    try { applyCustomCSS(); } catch (e) {} // Apply CSS right away when script runs (Hot Reload)

    try { window.__quickCss = { config, applyCustomCSS }; } catch (e) {} // Expose for debugging on `window` (Optional?)

})();
