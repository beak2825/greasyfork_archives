// ==UserScript==
// @name         Voxiom Adblocker
// @namespace    https://github.com/cqmbo1
// @version      1.1
// @description  Blocks ads, trackers, hidden/sandboxed external iframes, and Google vignette on voxiom.io
// @author       Cqmbo__
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508457/Voxiom%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/508457/Voxiom%20Adblocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const selectors = [
        '#voxiom-io_300X250_1',
        '#voxiom-io_970X250_1',
        'ad_unit',
        '#voxiom-io_300X250_3',
        '#voxiom-io_300X250_2',
        '#mys-wrapper',
        '.default-creative-container',
        '#voxiom-io_728x90_1',
        '#voxiom-io_728x90_2',
        '#voxiom-io_728x90_3',
        '#google_vignette'
    ];

    const isExternalSrc = (url) => {
        if (!url) return false;
        try {
            const u = new URL(url, location.href);
            const host = u.hostname;
            return host !== location.hostname && !host.endsWith('.' + location.hostname);
        } catch {
            return false;
        }
    };

    const hasTrackerHints = (url) => {
        if (!url) return false;
        return /(?:usync|isync|load-cookie|cs-config|headerbid|type=hb|pubcid|criteo|streamrail|yellowblue|sync|cookie)/i.test(url);
    };

    const isHiddenOrZero = (el) => {
        const style = el.getAttribute('style') || '';
        const w = el.getAttribute('width') || '';
        const h = el.getAttribute('height') || '';
        const zeroSize = (w === '0' && h === '0');
        const hiddenStyle = /display\s*:\s*none/i.test(style) ||
                            (/height\s*:\s*0(px)?/i.test(style) && /width\s*:\s*0(px)?/i.test(style));
        return zeroSize || hiddenStyle;
    };

    const isSandboxedScripts = (el) => {
        const sandbox = el.getAttribute('sandbox') || '';
        return /allow-scripts/i.test(sandbox);
    };

    const shouldBlockIframe = (iframe) => {
        const src = iframe.getAttribute('src') || '';
        return (isExternalSrc(src) && (isHiddenOrZero(iframe) || isSandboxedScripts(iframe))) || hasTrackerHints(src);
    };

    const adblocker = () => {
        document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());

        document.querySelectorAll('iframe').forEach(iframe => {
            if (shouldBlockIframe(iframe)) iframe.remove();
        });

        document.querySelectorAll('#google_vignette').forEach(el => el.remove());

        if (location.href.includes('google_vignette')) {
            try { history.replaceState(null, '', location.href.replace(/[#&?]google_vignette(?:=[^&]*)?/i, '')); } catch {}
        }
    };

    const domObserver = new MutationObserver(() => adblocker());
    domObserver.observe(document.documentElement, { childList: true, subtree: true });

    adblocker();
    setInterval(adblocker, 1000);
})();



