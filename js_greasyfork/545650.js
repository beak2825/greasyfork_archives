// ==UserScript==
// @name         Upsilon Library
// @namespace    https://upsilon-cloud.uk
// @version      2.8
// @description  Upsilon Library
// @author       Upsilon
// @license      All Rights Reserved
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==
// Library - a script intended to be @require-d from other scripts and not installed directly.

// Copyright (c) 2025 Upsilon
// All rights reserved. No part of this code may be reproduced, modified, or distributed without explicit permission.

(function() {
    'use strict';
    if (window.Ups?.showToast) return;

    window.Ups = window.Ups || {};

    window.Ups.showToast = (message, type = 'info', duration = 5000) => {
        const createToast = () => {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.position = 'fixed';
                container.style.bottom = '5%';
                container.style.right = '5%';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '10px';
                container.style.zIndex = 100000;
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.background = type === 'error' ? '#c0392b' : '#2c3e50';
            toast.style.color = 'white';
            toast.style.padding = '10px 15px';
            toast.style.borderRadius = '5px';
            toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            toast.style.fontFamily = 'monospace';
            toast.style.whiteSpace = 'pre-wrap';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.addEventListener('transitionend', () => toast.remove());
            }, duration);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createToast);
        } else {
            createToast();
        }
    };

    window.Ups.callAPI = function(url, method, requestObject, callback) {
        const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method?.toUpperCase());

        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: isBodyMethod
                ? (typeof requestObject === 'string' ? requestObject : JSON.stringify(requestObject))
                : undefined,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    callback && callback(null, data);
                } catch (e) {
                    console.error("[UpsLib] Error processing JSON:", e);
                    callback && callback(e, null);
                }
            },
            onerror: function (err) {
                console.error("[UpsLib] Error while calling API:", err);
                callback && callback(err, null);
            }
        });
    };
})();