// ==UserScript==
// @name         NicoNico Auto Set Language
// @namespace    https://github.com/PiesP/niconico-auto-set-language
// @version      0.9.2
// @license      MIT
// @description  Automatically set language to Japanese on NicoNico.
// @match        *://*.nicovideo.jp/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/521079/NicoNico%20Auto%20Set%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/521079/NicoNico%20Auto%20Set%20Language.meta.js
// ==/UserScript==
(() => {
    const STORAGE_KEY = 'settings';
    const DEFAULT_SETTINGS = {
        enabled: true,
        showNotification: true,
        language: 'ja-jp',
        debug: false,
    };
    const OBSERVE_TIMEOUT_MS = 5000;
    const CHECK_DEBOUNCE_MS = 100;
    const TOAST_DURATION_MS = 2500;
    const TOAST_BG = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
    };
    const TOAST_STYLE_BASE = 'position:fixed;top:10px;right:10px;color:#fff;padding:10px 12px;border-radius:6px;' +
        'z-index:2147483647;font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
        'box-shadow:0 2px 10px rgba(0,0,0,.18)';
    let settings = loadSettings();
    let observer = null;
    let observeTimeout = null;
    let debounceTimer = null;
    let submitted = false;
    function loadSettings() {
        const raw = GM_getValue(STORAGE_KEY, {});
        const obj = typeof raw === 'object' && raw !== null ? raw : {};
        // Backward compat: older builds stored showNotification under the same key.
        return {
            enabled: typeof obj.enabled === 'boolean' ? obj.enabled : DEFAULT_SETTINGS.enabled,
            showNotification: typeof obj.showNotification === 'boolean'
                ? obj.showNotification
                : DEFAULT_SETTINGS.showNotification,
            language: typeof obj.language === 'string' ? obj.language : DEFAULT_SETTINGS.language,
            debug: typeof obj.debug === 'boolean' ? obj.debug : DEFAULT_SETTINGS.debug,
        };
    }
    function saveSettings() {
        GM_setValue(STORAGE_KEY, settings);
    }
    function debugLog(message, ...args) {
        if (!settings.debug)
            return;
        // console.debug is often filtered; keep it explicit.
        console.log(`[NicoNico Language] ${message}`, ...args);
    }
    function toast(message, type = 'success') {
        if (!settings.showNotification)
            return;
        if (!document.body)
            return;
        const el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = `${TOAST_STYLE_BASE};background:${TOAST_BG[type]}`;
        document.body.appendChild(el);
        window.setTimeout(() => {
            el.style.transition = 'opacity 0.25s';
            el.style.opacity = '0';
            window.setTimeout(() => el.remove(), 300);
        }, TOAST_DURATION_MS);
    }
    function stopWatching() {
        if (debounceTimer !== null) {
            window.clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        if (observeTimeout !== null) {
            window.clearTimeout(observeTimeout);
            observeTimeout = null;
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }
    function isAlreadyTargetLanguage() {
        return document.documentElement.lang === settings.language;
    }
    function findLanguageForm() {
        // NicoNico's language preference is typically set via a form with an input[name="language"].
        const input = document.querySelector('form input[name="language"]');
        if (!input)
            return null;
        const form = input.form ?? input.closest('form');
        if (!(form instanceof HTMLFormElement))
            return null;
        return { form, input };
    }
    function tryChangeLanguage() {
        if (submitted)
            return true;
        if (!settings.enabled)
            return false;
        if (isAlreadyTargetLanguage()) {
            debugLog('Language already matches target.', settings.language);
            return true;
        }
        const found = findLanguageForm();
        if (!found)
            return false;
        try {
            found.input.value = settings.language;
            toast('Changing language to Japanese...', 'info');
            submitted = true;
            stopWatching();
            found.form.submit();
            return true;
        }
        catch (err) {
            console.error('[NicoNico Language] Failed to submit language form:', err);
            toast('Failed to change language.', 'error');
            stopWatching();
            return false;
        }
    }
    function watchForLanguageForm() {
        if (observer)
            return;
        observer = new MutationObserver(() => {
            if (debounceTimer !== null)
                return;
            debounceTimer = window.setTimeout(() => {
                debounceTimer = null;
                if (tryChangeLanguage())
                    stopWatching();
            }, CHECK_DEBOUNCE_MS);
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        observeTimeout = window.setTimeout(() => {
            debugLog('Language form not found within timeout.');
            stopWatching();
        }, OBSERVE_TIMEOUT_MS);
    }
    function run() {
        settings = loadSettings();
        submitted = false;
        if (tryChangeLanguage())
            return;
        watchForLanguageForm();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    }
    else {
        run();
    }
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('Toggle Auto Set Language', () => {
            settings.enabled = !settings.enabled;
            saveSettings();
            toast(`Script ${settings.enabled ? 'enabled' : 'disabled'}.`, settings.enabled ? 'success' : 'info');
            if (settings.enabled) {
                run();
            }
            else {
                stopWatching();
            }
        });
    }
})();
