// ==UserScript==
// @name         PreventStealerV2
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Enhanced security addon to detect and block malicious password reset attempts
// @author       Simon, Zpayer
// @match        https://www.kogama.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kogama.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544424/PreventStealerV2.user.js
// @updateURL https://update.greasyfork.org/scripts/544424/PreventStealerV2.meta.js
// ==/UserScript==

(function() {
    'use strict';
   const ALLOWED_PATTERNS = [
        /^\/api\/product\/subscription\/?$/,
        /^\/api\/product\/subscription\/promote-free\/?$/,
        /^\/api\/product\/gold\/?$/,
        /^\/api\/report\/types\/?$/,
        /^\/api\/report\/\d+\/\w+\/?$/,
        /^\/game\/\d+\/?$/,
        /^\/game\/published\/?$/,
        /^\/game\/\d+\/publish\/?$/,
        /^\/game\/gs-archive\/\?kogama_id=\d+&gs_id=\w+&title=[^&]+$/,
        /^\/user\/\d+\/?$/,
        /^\/user\/\d+\/game\/?$/,
        /^\/user\/\d+\/friend\/?$/,
        /^\/user\/\d+\/invitations\/?$/,
        /^\/user\/\d+\/password\/?$/,
        /^\/user\/\d+\/avatar\/\w+\/?$/,
        /^\/user\/\d+\/avatar\/?$/,
        /^\/user\/\d+\/username\/?$/,
        /^\/user\/\d+\/username\/\?username=\w+$/,
        /^\/user\/username\/\?username=\w+$/,
        /^\/user\/\d+\/email\/?$/,
        /^\/user\/\d+\/password-reset\/?$/,
        /^\/user\/\d+\/policy-accepted\/?$/,
        /^\/user\/\d+\/claim-daily-gold\/?$/,
        /^\/user\/\d+\/password-reset-required\/?$/,
        /^\/\d+badge\/\w+\/?$/,
        /^\/\d+badge\/\w+\/read\/?$/,
        /^\/api\/feed\/\d+\/?$/,
        /^\/api\/emote\/\d+\/?$/,
        /^\/api\/emote\/\d+\/\w+\/?$/,
        /^\/api\/emote\/emote-set\/?$/,
        /^\/api\/emote\/emote-set\/\d+\/?$/,
        /^\/api\/emote\/emote-set-emote\/?$/,
        /^\?emote-set-id=\d+$/,
        /^\/api\/emote\/emote-set-emote\/\d+\/?$/,
        /^\/api\/emote\/emote-set-transfer\/?$/,
        /^\/api\/app\/regions\/?$/,
        /^\/api\/spin\/data\/?$/,
        /^\/api\/news\/\d+\/?$/,
        /^\/api\/news\/unread\/?$/,
        /^\/model\/market\/?$/,
        /^\/model\/market\/\d+\/?$/,
        /^\/api\/shop\/\d+\/?$/,
        /^\/\d+\/comment\/?$/,
        /^\/api\/feed\/\d+\/comment\/?$/,
        /^\/game\/\d+\/comment\/?$/,
        /^\/server\/game\/?$/,
        /^\/server\/project\/?$/,
        /^\/server\/character\/?$/,
        /^\/locator\/session\/?$/,
        /^\/locator\/session\/\d+\/ping\/?$/,
        /^\/locator\/session\/\d+\/leave\/?$/,
        /^\/locator\/session\/\d+\/?$/,
        /^\/locator\/session\/\d+\/reauth\/?$/,
        /^\/api\/reward\/game-play\/?$/,
        /^\/v1\/api\/reward\/game-play\/?$/,
        /^\/v1\/api\/reward\/game-data\/?$/,
        /^\/v1\/api\/reward\/published\/?$/,
        /^\/chat\/\w+\/?$/,
        /^\/chat\/\d+\/history\/\w+\/?$/,
        /^\/user\/\d+\/friend\/chat\/?$/,
        /^\/user\/\d+\/friend\/chat\/\w+\/?$/,
        /^\/v1\/user\/\d+\/ping\/?$/,
        /^\/user\/\d+\/pulse\/?$/,
        /^\/v1\/stat\/p\/?$/,
        /^\/api\/onboarding\/\d+\/?$/,
        /^\/v1\/notify\/c\/\?token=\d+&generation=[^&]+$/,
        /^\/v1\/notify\/c\/seen\/\?token=\d+&generation=[^&]+$/,
        /^\/v1\/payment\/stripe\/charge\/?$/,
        /^\/help\/install\/chrome-help-sections\/?$/,
        /^\?version=\d+$/,
        /^\/help\/install\/other-help-sections\/?$/,
        /^\/profile\/\d+\/?$/,
        /^\/games\/profile\/\d+\/?$/,
        /^\/games\/play\/\d+\/?$/,
        /^\?local=1$/,
        /^\/games\/?$/,
        /^\/build\/\d+\/project\/?$/,
        /^\/build\/\d+\/project\/\w+\/?$/,
        /^\/build\/\d+\/project\/\w+\/edit\/?$/,
        /^\/purchase\/?$/,
        /^\/login\/\?next=[^&]+$/,
        /^\/register\/?$/,
        /^\/register\/\?xp=\d+&signature=\w+$/,
        /^\/auth\/logout\/?$/,
        /^\/page\/disconnected\/\?reason=idle$/,
        /^\/page\/embed\/disconnected\/\?reason=idle$/,
        /^\/page\/disconnected\/?$/,
        /^\/page\/webgl-frame\/?$/,
        /^\/help\/install\/kogama-launcher-windows\/?$/,
        /^\/page\/new-plugin-installed-reward\/?$/,
        /^\/news\/\w+\/?$/,
        /^\/subscription\/subscribe\/?$/,
        /^\/payment\/options\/?$/,
        /^\/payment\/billing-information\/?$/,
        /^\/payment\/thank-you\/?$/,
        /^\/payment\/addons\/?$/,
        /^\/subscription\/manage\/?$/,
        /^\/marketplace\/?$/,
        /^\/locator\/session\/\?objectID=\d+&profileID=\d+&lang=\w+_\w+&type=\w+&referrer=\w+$/
    ];

    const PASSWORD_PROTECTION = {
        PROTECTED_ENDPOINTS: [
            /\/password-reset\/?$/,
            /\/password-reset-required\/?$/,
            /\/password\/?$/
        ],
        BLOCKED_METHODS: ['PUT', 'POST'],
        SUSPICIOUS_HEADERS: ['authorization', 'x-csrf-token', 'x-requested-with']
    };

    function isAllowed(url) {
        if (!url.startsWith('http')) return true;
        const path = new URL(url).pathname + new URL(url).search;
        return ALLOWED_PATTERNS.some(pattern => pattern.test(path));
    }

    function isPasswordEndpoint(url) {
        return PASSWORD_PROTECTION.PROTECTED_ENDPOINTS.some(pattern => pattern.test(url));
    }

    function isSuspiciousPasswordRequest(init) {
        if (!init) return false;
        if (PASSWORD_PROTECTION.BLOCKED_METHODS.includes(init.method?.toUpperCase())) {
            return true;
        }
        if (init.headers) {
            const headers = init.headers instanceof Headers ?
                Object.fromEntries(init.headers.entries()) :
                init.headers;

            return PASSWORD_PROTECTION.SUSPICIOUS_HEADERS.some(
                header => headers[header] && (headers[header].includes('Bearer') || headers[header].includes('Token'))
            );
        }

        return false;
    }

function logBlockedRequest(type, url, details = null) {
    console.warn(`[Security] Blocked ${type} to:`, url, details);

    const notification = document.createElement('div');
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: '#2d2d2d',
        color: '#e0e0e0',
        padding: '8px 12px',
        borderRadius: '4px',
        borderLeft: '3px solid #ff4444',
        fontSize: '13px',
        zIndex: '9999',
        maxWidth: '280px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    });

    notification.innerHTML = `
        <div style="font-weight:500;margin-bottom:4px;">Blocked ${type}</div>
        <div style="color:#aaa;font-size:12px;word-break:break-word;">${url}</div>
        ${details ? `<div style="margin-top:4px;color:#888;font-size:11px;">${details}</div>` : ''}
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (!isAllowed(url)) {
            logBlockedRequest('fetch', url);
            return Promise.reject(new Error(`Request to ${url} blocked by security policy`));
        }
        if (isPasswordEndpoint(url)) {
            if (isSuspiciousPasswordRequest(init)) {
                logBlockedRequest('fetch', url, 'Suspicious password change attempt blocked');
                return Promise.reject(new Error('Suspicious password change attempt blocked'));
            }
        }

        if (url.includes('discord.com/api/webhooks')) {
            logBlockedRequest('fetch', url, 'Webhook requests are blocked');
            return Promise.reject(new Error('Webhook requests are blocked'));
        }

        return originalFetch.apply(this, arguments);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (!isAllowed(url)) {
            logBlockedRequest('XHR', url);
            throw new Error(`Request to ${url} blocked by security policy`);
        }
        return originalOpen.apply(this, arguments);
    };

    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        if (!isAllowed(url)) {
            logBlockedRequest('WebSocket', url);
            throw new Error(`WebSocket connection to ${url} blocked by security policy`);
        }
        return new originalWebSocket(url, protocols);
    };

    console.log('%c[ PREVENTSTEALERV2 ] Monitoring for any suspicious traffic. . . ', 'color: #856F81; font-weight: bold;');
})();