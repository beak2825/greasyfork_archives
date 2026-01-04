// ==UserScript==
// @name              Web Page Accelerator
// @namespace      instant.page
// @version           v1.0.5.2.0
// @author            OB_BUFF
// @description       Automatically accelerates hyperlinks on web pages to improve loading speed. Integrates the latest instant.page v5.2.0 features with multi-language support (default: English) and removes store link redirection functionality.
// @license           GPL-v3
// @require           https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.min.js
// @resource          swalStyle https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.min.css
// @match             *://*/*
// @noframes
// @run-at            document-idle
// @grant             GM_openInTab
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMCA3OWMwLTM1LjQgMjguNS02NCA2My45LTY0LjFzNjQuMSAyOC42IDY0LjEgNjRjMCA5LjQtMi4xIDE4LjQtNS43IDI2LjUtMSAyLjMtMi4zIDQuNi0zLjYgNi43LS40LjYtMSAxLTEuNyAxSDExYy0uNyAwLTEuMy0uNC0xLjctMS0xLjMtMi4yLTIuNS00LjQtMy42LTYuN0MyLjEgOTcuNCAwIDg4LjQgMCA3OXptMjQuNC0zOS43Yy01LjIgNS4xLTkuMiAxMS4xLTEyIDE3LjgtMyA2LjktNC41IDE0LjItNC41IDIxLjhhNTUuODYgNTUuODYgMCAwIDAgNC40IDIxLjhjLjcgMS42IDEuNCAzLjIgMi4yIDQuN2g5OC44Yy44LTEuNSAxLjYtMy4xIDIuMi00LjdhNTUuODYgNTUuODYgMCAwIDAgNC40LTIxLjggNTUuODYgNTUuODYgMCAwIDAtNC40LTIxLjhjLTIuOC02LjctNi45LTEyLjctMTItMTcuOC01LjEtNS4yLTExLjEtOS4yLTE3LjgtMTJhNTUuODYgNTUuODYgMCAwIDAtMjEuOC00LjQgNTUuODYgNTUuODYgMCAwIDAtMjEuOCA0LjRjLTYuNiAyLjgtMTIuNiA2LjgtMTcuNyAxMnoiIGZpbGw9IiM0NDQiLz48cGF0aCBkPSJNMTIuNCA1Ny4xYzIuOC02LjcgNi45LTEyLjcgMTItMTcuOCA1LjEtNS4yIDExLjEtOS4yIDE3LjgtMTJBNTUuODYgNTUuODYgMCAwIDEgNjQgMjIuOWE1NS44NiA1NS44NiAwIDAgMSAyMS44IDQuNGM2LjcgMi44IDEyLjcgNi45IDE3LjggMTIgNS4yIDUuMSA5LjIgMTEuMSAxMiAxNy44YTU1Ljg2IDU1Ljg2IDAgMCAxIDQuNCAyMS44IDU1Ljg2IDU1Ljg2IDAgMCAxLTQuNCAyMS44Yy0uNyAxLjYtMS40IDMuMi0yLjIgNC43SDE0LjZjLS44LTEuNS0xLjYtMy4xLTIuMi00LjdBNTUuODYgNTUuODYgMCAwIDEgOCA3OC45Yy0uMS03LjYgMS40LTE0LjkgNC40LTIxLjh6IiBmaWxsPSIjNjQ5OTUwIi8+PHBhdGggZD0iTTc3LjUgNjAuOUM2OCA4MS4yIDY0LjkgODQuNiA2NC42IDg1Yy0xLjUgMS41LTMuNSAyLjMtNS42IDIuM3MtNC4xLS44LTUuNi0yLjNhNy45MSA3LjkxIDAgMCAxIDAtMTEuMmMuMy0uNCAzLjgtMy40IDI0LjEtMTIuOXptMC04Yy0xLjEgMC0yLjMuMi0zLjQuOEM2My4yIDU4LjggNTEgNjQuOSA0Ny44IDY4LjFjLTYuMiA2LjItNi4yIDE2LjMgMCAyMi41IDMuMSAzLjEgNy4yIDQuNyAxMS4yIDQuN3M4LjEtMS42IDExLjItNC43YzMuMi0zLjIgOS4zLTE1LjQgMTQuNC0yNi4zIDIuNi01LjYtMS43LTExLjQtNy4xLTExLjR6TTYzLjkgMjkuOGMtMjcuMiAwLTQ5LjUgMjIuNi00OS4xIDQ5LjggMCAzLjYuNSA3LjIgMS4zIDEwLjYuNCAxLjggMiAzLjEgMy45IDMuMSAyLjYgMCA0LjQtMi40IDMuOS00LjktLjctMy0xLjEtNi4yLTEuMS05LjNBNDIuMDQgNDIuMDQgMCAwIDEgMjYgNjNjMi01IDUtOS40IDguOC0xMy4yUzQzIDQzLjEgNDcuOSA0MWE0Mi4wNCA0Mi4wNCAwIDAgMSAzMi4yIDBjNC45IDIuMSA5LjMgNS4xIDEzLjEgOC45Qzk3IDUzLjYgOTkuOSA1OCAxMDIgNjNhNDIuMDQgNDIuMDQgMCAwIDEgMy4yIDE2LjFjMCAzLjItLjQgNi4zLTEuMSA5LjMtLjYgMi41IDEuMyA0LjkgMy45IDQuOSAxLjggMCAzLjUtMS4zIDMuOS0zLjEuOC0zLjYgMS4zLTcuMyAxLjMtMTEuMSAwLTI3LjMtMjIuMS00OS4zLTQ5LjMtNDkuM3oiIGZpbGw9IiM0NDQiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/526323/Web%20Page%20Accelerator.user.js
// @updateURL https://update.greasyfork.org/scripts/526323/Web%20Page%20Accelerator.meta.js
// ==/UserScript==

/* -------------------------------
   Multi-language support (default: English)
   You can extend the translations object to support more languages.
---------------------------------- */
const translations = {
    en: {
        acceleratedCount: "Accelerated: ",
        times: " times",
        resetPrompt: "Are you sure you want to reset the acceleration count?",
        confirm: "OK",
        cancel: "Cancel",
        settingsTitle: "Accelerator Settings",
        accelerateExternal: "Accelerate external links",
        accelerateParams: "Accelerate links with parameters",
        openInSameTab: "Open links in the same tab",
        animationEffect: "Animation effect",
        prefetchDelay: "Prefetch delay (ms)",
        excludeURLs: "Exclude the following URLs (one per line)",
        excludeKeywords: "Exclude the following keywords (one per line)",
        save: "Save",
        usageFooter: "Click here to view the usage instructions. This assistant is free and open-source."
    }
};
const lang = 'en'; // Default language

// -------------------------------
// Utility functions
// -------------------------------
let util = {
    getValue(name) {
        return GM_getValue(name);
    },
    setValue(name, value) {
        GM_setValue(name, value);
    },
    // Check if the given string (after removing '-' and '_') contains any of the keywords (case-insensitive)
    include(str, arr) {
        str = str.replace(/[-_]/ig, '');
        for (let i = 0, l = arr.length; i < l; i++) {
            let val = arr[i].trim();
            if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                return true;
            }
        }
        return false;
    },
    addStyle(id, tag, css) {
        tag = tag || 'style';
        let doc = document, styleDom = doc.getElementById(id);
        if (styleDom) return;
        let style = doc.createElement(tag);
        style.rel = 'stylesheet';
        style.id = id;
        tag === 'style' ? style.innerHTML = css : style.href = css;
        doc.head.appendChild(style);
    },
    // Common regex patterns
    reg: {
        chrome: /^https?:\/\/chrome\.google\.com\/webstore\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
        chromeNew: /^https?:\/\/chromewebstore\.google\.com\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
        edge: /^https?:\/\/microsoftedge\.microsoft\.com\/addons\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
        firefox: /^https?:\/\/(reviewers\.)?(addons\.mozilla\.org|addons(?:-dev)?\.allizom\.org)\/.*?(?:addon|review)\/([^/<>"'?#]+)/,
        microsoft: /^https?:\/\/(?:apps|www)\.microsoft\.com\/(?:store|p)\/.+?\/([a-zA-Z\d]{10,})(?=[\/#?]|$)/,
    }
};

// -------------------------------
// Main logic
// -------------------------------
let main = {
    // Initialize configuration values (store values using GM storage)
    initValue() {
        // Note: The "store link" redirection option has been removed.
        let value = [{
            name: 'setting_success_times',
            value: 0
        }, {
            name: 'allow_external_links',
            value: true
        }, {
            name: 'allow_query_links',
            value: true
        }, {
            name: 'enable_target_self',
            value: false
        }, {
            name: 'enable_animation',
            value: false
        }, {
            name: 'delay_on_hover',
            value: 65
        }, {
            name: 'exclude_list',
            value: ''
        }, {
            name: 'exclude_keyword',
            value: 'login\nlogout\nregister\nsignin\nsignup\nsignout\npay\ncreate\nedit\ndownload\ndel\nreset\nsubmit\ndoubleclick\ngoogleads\nexit'
        }];
        value.forEach((v) => {
            if (util.getValue(v.name) === undefined) {
                util.setValue(v.name, v.value);
            }
        });
    },

    // Register menu commands for the settings panel and reset function
    registerMenuCommand() {
        GM_registerMenuCommand(
            "🚀 " + translations[lang].acceleratedCount + util.getValue('setting_success_times') + translations[lang].times,
            () => {
                Swal.fire({
                    showCancelButton: true,
                    title: translations[lang].resetPrompt,
                    icon: 'warning',
                    confirmButtonText: translations[lang].confirm,
                    cancelButtonText: translations[lang].cancel,
                    customClass: {
                        popup: 'instant-popup',
                    },
                }).then((res) => {
                    if (res.isConfirmed) {
                        util.setValue('setting_success_times', 0);
                        history.go(0);
                    }
                });
            }
        );
        let dom = `<div style="font-size: 1em;">
                      <label class="instant-setting-label">${translations[lang].accelerateExternal}<input type="checkbox" id="S-External" ${util.getValue('allow_external_links') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                      <label class="instant-setting-label"><span>${translations[lang].accelerateParams} (<a href="https://www.youxiaohou.com/tool/install-instantpage.html#%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E" target="_blank">Details</a>)</span><input type="checkbox" id="S-Query" ${util.getValue('allow_query_links') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                      <label class="instant-setting-label">${translations[lang].openInSameTab}<input type="checkbox" id="S-Target" ${util.getValue('enable_target_self') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                      <label class="instant-setting-label">${translations[lang].animationEffect}<input type="checkbox" id="S-Animate" ${util.getValue('enable_animation') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                      <label class="instant-setting-label">${translations[lang].prefetchDelay}<input type="number" min="65" id="S-Delay" value="${util.getValue('delay_on_hover')}" class="instant-setting-input"></label>
                      <label class="instant-setting-label-col">${translations[lang].excludeURLs}<textarea placeholder="One per line, e.g., www.example.com" id="S-Exclude" class="instant-setting-textarea">${util.getValue('exclude_list')}</textarea></label>
                      <label class="instant-setting-label-col">${translations[lang].excludeKeywords}<textarea placeholder="One per line, e.g., logout" id="S-Exclude-Word" class="instant-setting-textarea">${util.getValue('exclude_keyword')}</textarea></label>
                    </div>`;
        GM_registerMenuCommand(translations[lang].settingsTitle, () => {
            Swal.fire({
                title: translations[lang].settingsTitle,
                html: dom,
                showCloseButton: true,
                confirmButtonText: translations[lang].save,
                footer: `<div style="text-align: center;font-size: 1em;">${translations[lang].usageFooter}</div>`,
                customClass: {
                    popup: 'instant-popup',
                },
            }).then((res) => {
                if (res.isConfirmed) {
                    history.go(0);
                }
            });
            document.getElementById('S-External').addEventListener('change', (e) => {
                util.setValue('allow_external_links', e.currentTarget.checked);
            });
            document.getElementById('S-Query').addEventListener('change', (e) => {
                util.setValue('allow_query_links', e.currentTarget.checked);
            });
            document.getElementById('S-Target').addEventListener('change', (e) => {
                util.setValue('enable_target_self', e.currentTarget.checked);
            });
            document.getElementById('S-Animate').addEventListener('change', (e) => {
                util.setValue('enable_animation', e.currentTarget.checked);
            });
            document.getElementById('S-Delay').addEventListener('change', (e) => {
                util.setValue('delay_on_hover', e.currentTarget.value);
            });
            document.getElementById('S-Exclude').addEventListener('change', (e) => {
                util.setValue('exclude_list', e.currentTarget.value);
            });
            document.getElementById('S-Exclude-Word').addEventListener('change', (e) => {
                util.setValue('exclude_keyword', e.currentTarget.value);
            });
        });
    },

    // Check if the current host is in the exclude list
    inExcludeList() {
        let exclude = util.getValue('exclude_list').split('\n').map(s => s.trim());
        let host = location.host;
        return exclude.includes(host);
    },

    // -------------------------------
    // Main prefetch logic integrating instant.page v5.2.0 features
    // -------------------------------
    instantPage() {
        if (window.instantLoaded) return;
        window.instantLoaded = true;

        // Configuration options (some from GM storage, some from data attributes)
        const allowQueryString = ('instantAllowQueryString' in document.body.dataset) || util.getValue('allow_query_links');
        const allowExternalLinks = ('instantAllowExternalLinks' in document.body.dataset) || util.getValue('allow_external_links');
        const _useWhitelist = ('instantWhitelist' in document.body.dataset);
        const enableAnimation = util.getValue('enable_animation');
        const enableTargetSelf = util.getValue('enable_target_self');
        const excludeKeyword = util.getValue('exclude_keyword').split('\n');
        let delayOnHover = parseInt(util.getValue('delay_on_hover'));

        // Internal variables similar to instant.page v5.2.0
        let _chromiumMajorVersionInUserAgent = null;
        let _speculationRulesType = 'none';
        let _delayOnHover = delayOnHover; // in milliseconds
        let _lastTouchstartEvent = null;
        let _mouseoverTimer = null;
        let _preloadedList = new Set();

        // Browser support check: ensure <link rel="prefetch"> is supported
        let supportChecksRelList = document.createElement('link').relList;
        if (!(supportChecksRelList && supportChecksRelList.supports && supportChecksRelList.supports('prefetch'))) {
            return;
        }
        const chromium100Check = ('throwIfAborted' in AbortSignal.prototype); // Chromium 100+
        const firefox115AndSafari17_0Check = supportChecksRelList.supports('modulepreload'); // Firefox 115+, Safari 17.0+
        const safari15_4AndFirefox116Check = (Intl.PluralRules && 'selectRange' in Intl.PluralRules.prototype);
        const firefox115AndSafari15_4Check = firefox115AndSafari17_0Check || safari15_4AndFirefox116Check;
        const isBrowserSupported = chromium100Check && firefox115AndSafari15_4Check;
        if (!isBrowserSupported) return;

        // If the page sets data-instantVaryAccept (e.g. Shopify), check Chromium version
        if (document.body.dataset.instantVaryAccept) {
            const chromiumUserAgentIndex = navigator.userAgent.indexOf('Chrome/');
            if (chromiumUserAgentIndex > -1) {
                _chromiumMajorVersionInUserAgent = parseInt(navigator.userAgent.substring(chromiumUserAgentIndex + 'Chrome/'.length));
            }
            if (_chromiumMajorVersionInUserAgent && _chromiumMajorVersionInUserAgent < 110) {
                return;
            }
        }

        // Set speculation rules if supported (<script type="speculationrules">)
        if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
            const speculationRulesConfig = document.body.dataset.instantSpecrules;
            if (speculationRulesConfig === 'prerender') {
                _speculationRulesType = 'prerender';
            } else if (speculationRulesConfig !== 'no') {
                _speculationRulesType = 'prefetch';
            }
        }

        // Determine trigger method based on data-instantIntensity (default is mouseover)
        let useMousedown = false;
        let useMousedownOnly = false;
        let useViewport = false;
        const mousedownShortcut = ('instantMousedownShortcut' in document.body.dataset);
        if ('instantIntensity' in document.body.dataset) {
            const intensity = document.body.dataset.instantIntensity;
            if (intensity === 'mousedown' && !mousedownShortcut) {
                useMousedown = true;
            }
            if (intensity === 'mousedown-only' && !mousedownShortcut) {
                useMousedown = true;
                useMousedownOnly = true;
            }
            if (intensity === 'viewport' || intensity === 'viewport-all') {
                const isOnSmallScreen = document.documentElement.clientWidth * document.documentElement.clientHeight < 450000;
                const isConnectionAdequate = !(navigator.connection && (navigator.connection.saveData ||
                    (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g'))));
                if (isOnSmallScreen && isConnectionAdequate) {
                    useViewport = true;
                }
                if (intensity === 'viewport-all') {
                    useViewport = true;
                }
            }
            const intensityAsInteger = parseInt(intensity);
            if (!isNaN(intensityAsInteger)) {
                _delayOnHover = intensityAsInteger;
            }
        }

        const eventListenersOptions = {
            capture: true,
            passive: true,
        };

        // Register event listeners based on trigger method
        if (useMousedownOnly) {
            document.addEventListener('touchstart', touchstartEmptyListener, eventListenersOptions);
        } else {
            document.addEventListener('touchstart', touchstartListener, eventListenersOptions);
        }
        if (!useMousedown) {
            document.addEventListener('mouseover', mouseoverListener, eventListenersOptions);
        }
        if (useMousedown) {
            document.addEventListener('mousedown', mousedownListener, eventListenersOptions);
        }
        if (mousedownShortcut) {
            document.addEventListener('mousedown', mousedownShortcutListener, eventListenersOptions);
        }

        // If viewport prefetch is enabled, use IntersectionObserver to preload links in view
        if (useViewport) {
            const requestIdleCallbackOrFallback = window.requestIdleCallback || function(callback) { callback(); };
            requestIdleCallbackOrFallback(function () {
                const intersectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const anchor = entry.target;
                            intersectionObserver.unobserve(anchor);
                            preload(anchor);
                        }
                    });
                });
                document.querySelectorAll('a').forEach((anchor) => {
                    if (isPreloadable(anchor)) {
                        intersectionObserver.observe(anchor);
                    }
                });
            }, { timeout: 1500 });
        }

        // -------------------------------
        // Event handler functions
        // -------------------------------
        function touchstartListener(event) {
            _lastTouchstartEvent = event;
            const anchor = event.target.closest('a');
            if (!isPreloadable(anchor)) return;
            preload(anchor, 'high');
        }
        function touchstartEmptyListener(event) {
            _lastTouchstartEvent = event;
        }
        function mouseoverListener(event) {
            if (isEventLikelyTriggeredByTouch(event)) return;
            if (!('closest' in event.target)) return;
            const anchor = event.target.closest('a');
            if (!isPreloadable(anchor)) return;
            anchor.addEventListener('mouseout', mouseoutListener, { passive: true });
            _mouseoverTimer = setTimeout(() => {
                preload(anchor, 'high');
                _mouseoverTimer = null;
            }, _delayOnHover);
        }
        function mousedownListener(event) {
            if (isEventLikelyTriggeredByTouch(event)) return;
            const anchor = event.target.closest('a');
            if (!isPreloadable(anchor)) return;
            preload(anchor, 'high');
        }
        function mouseoutListener(event) {
            if (event.relatedTarget && event.target.closest('a') === event.relatedTarget.closest('a')) return;
            if (_mouseoverTimer) {
                clearTimeout(_mouseoverTimer);
                _mouseoverTimer = null;
            }
        }
        function mousedownShortcutListener(event) {
            if (isEventLikelyTriggeredByTouch(event)) return;
            const anchor = event.target.closest('a');
            if (event.which > 1 || event.metaKey || event.ctrlKey) return;
            if (!anchor) return;
            anchor.addEventListener('click', function (e) {
                if (e.detail === 1337) return;
                e.preventDefault();
            }, { capture: true, passive: false, once: true });
            const customEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: false,
                detail: 1337
            });
            anchor.dispatchEvent(customEvent);
        }
        // Check if a mouse event is likely triggered by a preceding touch event (avoid duplicate prefetch on touch devices)
        function isEventLikelyTriggeredByTouch(event) {
            if (!_lastTouchstartEvent || !event) return false;
            if (event.target !== _lastTouchstartEvent.target) return false;
            const now = event.timeStamp;
            const duration = now - _lastTouchstartEvent.timeStamp;
            const MAX_DURATION = 2500; // ms
            return duration < MAX_DURATION;
        }
        // Determine whether the link element is preloadable based on various criteria
        function isPreloadable(anchor) {
            if (!anchor || !anchor.href) return false;
            if (_useWhitelist && !('instant' in anchor.dataset)) return false;
            if (anchor.origin !== location.origin) {
                const allowed = allowExternalLinks || ('instant' in anchor.dataset);
                if (!allowed) return false;
            }
            if (!['http:', 'https:'].includes(anchor.protocol)) return false;
            if (anchor.protocol === 'http:' && location.protocol === 'https:') return false;
            if (!allowQueryString && anchor.search && !('instant' in anchor.dataset)) return false;
            if (anchor.hash && (anchor.pathname + anchor.search === location.pathname + location.search)) return false;
            if ('noInstant' in anchor.dataset) return false;
            // Exclude links containing any of the specified keywords
            if (util.include(anchor.href, excludeKeyword)) return false;
            return true;
        }
        // Perform prefetch if the link has not been prefetched yet.
        // Choose between speculation rules (if supported) and <link rel="prefetch">
        function preload(anchor, fetchPriority = 'auto') {
            const url = anchor.href;
            if (_preloadedList.has(url)) return;
            if (_speculationRulesType !== 'none') {
                preloadUsingSpeculationRules(url);
            } else {
                preloadUsingLinkElement(url, fetchPriority);
            }
            _preloadedList.add(url);
            if (enableAnimation) {
                anchor.classList.add("link-instanted");
            }
            if (enableTargetSelf) {
                anchor.target = '_self';
            }
            util.setValue('setting_success_times', util.getValue('setting_success_times') + 1);
        }
        // Prefetch using <script type="speculationrules">
        function preloadUsingSpeculationRules(url) {
            const script = document.createElement('script');
            script.type = 'speculationrules';
            script.textContent = JSON.stringify({
                [_speculationRulesType]: [{
                    source: 'list',
                    urls: [url]
                }]
            });
            document.head.appendChild(script);
        }
        // Prefetch using <link rel="prefetch">
        function preloadUsingLinkElement(url, fetchPriority = 'auto') {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.fetchPriority = fetchPriority;
            link.as = 'document';
            document.head.appendChild(link);
        }
    },

    // Add plugin styles to the page
    addPluginStyle() {
        let style = `
            .instant-popup { font-size: 14px !important; }
            .instant-setting-label { display: flex; align-items: center; justify-content: space-between; padding-top: 15px; }
            .instant-setting-label-col { display: flex; align-items: flex-start; padding-top: 15px; flex-direction: column; }
            .instant-setting-checkbox { width: 16px; height: 16px; }
            .instant-setting-textarea { width: 100%; margin: 14px 0 0; height: 60px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
            .instant-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px; }
            @keyframes instantAnminate { from { opacity: 1; } 50% { opacity: 0.4; } to { opacity: 0.9; } }
            .link-instanted { animation: instantAnminate 0.6s 1; animation-fill-mode: forwards; }
            .link-instanted * { animation: instantAnminate 0.6s 1; animation-fill-mode: forwards; }
        `;
        if (document.head) {
            util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
            util.addStyle('instant-style', 'style', style);
        }
        // Observe changes in the head element and re-add styles if needed
        const headObserver = new MutationObserver(() => {
            util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
            util.addStyle('instant-style', 'style', style);
        });
        headObserver.observe(document.head, { childList: true, subtree: true });
    },

    // Initialize the script
    init() {
        this.initValue();
        this.addPluginStyle();
        this.registerMenuCommand();
        if (this.inExcludeList()) return;
        this.instantPage();
    }
};

main.init();
