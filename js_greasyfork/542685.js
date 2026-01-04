// ==UserScript==
// @name        Event Listener Blocker & Focus Lock
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.13
// @author      ShortTimeNoSee
// @description Blocks detection of focus/tab/clipboard events without breaking user behavior; applies globally, incl. iframes/shadow DOMs. MAY break some functions.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542685/Event%20Listener%20Blocker%20%20Focus%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/542685/Event%20Listener%20Blocker%20%20Focus%20Lock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // debug toggle
    const DEBUG = false;

    const isGemini = window.location.hostname.includes('gemini.google.com');

    // expose/modifiable block-list for power users
    // if you want to add/remove events, do it on window.__blockEventList before this script runs
    window.__blockEventList = window.__blockEventList || new Set([
        'blur', 'focus', 'focusin', 'focusout',
        'visibilitychange', 'pagehide', 'pageshow', 'freeze', 'resume',
        'copy', 'cut', 'contextmenu', 'selectstart'
    ]);

    if (isGemini) {
        // Gemini's UI components need this event to function.
        // This removes it from the block list *only* on Gemini.
        window.__blockEventList.delete('focus');
    }

    // now use the global list
    const banned = window.__blockEventList;

    function isTextField(el) {
        return el instanceof HTMLInputElement ||
               el instanceof HTMLTextAreaElement ||
               (el instanceof HTMLElement && el.isContentEditable);
    }

    // avoid re-patching same context
    const patchedContexts = new WeakSet();

    function patchContext(ctx) {
        if (patchedContexts.has(ctx)) return;
        patchedContexts.add(ctx);
        if (DEBUG) console.log('patchContext on', ctx);

        try {
            const ET = ctx.EventTarget.prototype;
            const origAdd = ET.addEventListener;
            const origRemove = ET.removeEventListener;
            const origDispatch = ET.dispatchEvent;

            function patchedAdd(type, listener, opts) {
                const passive = opts && typeof opts === 'object' && opts.passive === true;
                if ((type === 'blur' || type === 'focusout') && isTextField(this)) {
                    return origAdd.call(this, type, listener, opts);
                }
                if (banned.has(type) && !passive) {
                    if (DEBUG) console.log(`blocked addEventListener(${type})`, this);
                    return;
                }
                return origAdd.call(this, type, listener, opts);
            }

            function patchedRemove(type, listener, opts) {
                const passive = opts && typeof opts === 'object' && opts.passive === true;
                if ((type === 'blur' || type === 'focusout') && isTextField(this)) {
                    return origRemove.call(this, type, listener, opts);
                }
                if (banned.has(type) && !passive) {
                    if (DEBUG) console.log(`blocked removeEventListener(${type})`, this);
                    return;
                }
                return origRemove.call(this, type, listener, opts);
            }

            function patchedDispatch(evt) {
                if ((evt.type === 'blur' || evt.type === 'focusout') && isTextField(this)) {
                    return origDispatch.call(this, evt);
                }
                if (banned.has(evt.type)) {
                    if (DEBUG) console.log(`blocked dispatchEvent(${evt.type})`, this);
                    return false;
                }
                return origDispatch.call(this, evt);
            }

            Object.defineProperty(ET, 'addEventListener',   { value: patchedAdd,    configurable: false, writable: false });
            Object.defineProperty(ET, 'removeEventListener',{ value: patchedRemove, configurable: false, writable: false });
            Object.defineProperty(ET, 'dispatchEvent',      { value: patchedDispatch,configurable: false, writable: false });
        } catch (e) {}

        // null out window/document handlers
        try {
            const doc = ctx.document;
            ctx.window.onblur = ctx.window.onfocus = null;
            ['visibilitychange','freeze','resume','pagehide','pageshow']
                .forEach(ev => { doc['on' + ev] = null; });
            ['copy','cut','contextmenu','selectstart']
                .forEach(ev => { doc['on' + ev] = null; });
        } catch (e) {}

        // force visibility and focus
        try {
            const doc = ctx.document;
            Object.defineProperty(doc, 'hidden',          { get: () => false,    configurable: true });
            Object.defineProperty(doc, 'visibilityState', { get: () => 'visible',configurable: true });
            doc.hasFocus = () => true;
        } catch (e) {}

        // clear active element and selection
        try {
            const ae = ctx.document.activeElement;
            if (ae) ae.blur();
            if (ctx.window.getSelection) ctx.window.getSelection().removeAllRanges();
        } catch (e) {}
    }

    // initial patch
    patchContext(window);

    // reapply every second
    setInterval(() => patchContext(window), 1000);

    // patch new iframes
    const obs = new MutationObserver(records => {
        records.forEach(r => r.addedNodes.forEach(node => {
            if (node.tagName === 'IFRAME') {
                if (DEBUG) console.log('patching iframe', node);
                node.addEventListener('load', () => {
                    try { patchContext(node.contentWindow); } catch {}
                });
            }
        }));
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // override after readyState changes
    document.addEventListener('readystatechange', () => {
        try {
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        } catch (e) {}
    });

    // patch new shadow roots
    (function() {
        const origAttach = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function(init) {
            const root = origAttach.call(this, init);
            patchContext(root);
            if (DEBUG) console.log('patched shadow root on', this);
            return root;
        };
    })();

})();