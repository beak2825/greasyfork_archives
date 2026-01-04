// ==UserScript==
// @name         切换标题显示
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  切换网页标题、网址和网址域名的显示
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480019/%E5%88%87%E6%8D%A2%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480019/%E5%88%87%E6%8D%A2%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let displayMode = GM_getValue('displayMode') || 'title';
    const originalTitle = document.title;

    function switchDisplayMode() {
        switch (displayMode) {
            case 'title':
                document.title = window.location.href;
                displayMode = 'url';
                break;
            case 'url':
                document.title = getUrl();
                displayMode = 'hostname';
                break;
            case 'hostname':
                document.title = originalTitle;
                displayMode = 'title';
                break;
            default:
                break;
        }
        GM_setValue('displayMode', displayMode);
    }

    function getUrl() {
        try {
            return new URL(window.location.href).hostname;
        } catch (error) {
            console.error('Error getting URL:', error);
            return window.location.href;
        }
    }

    GM_registerMenuCommand('➥切换标题显示', switchDisplayMode);

    window.addEventListener('load', function() {
        switch (displayMode) {
            case 'url':
                document.title = window.location.href;
                break;
            case 'hostname':
                document.title = getUrl();
                break;
            default:
                break;
        }
    });

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.title = originalTitle;
        } else {
            switch (displayMode) {
                case 'url':
                    document.title = window.location.href;
                    break;
                case 'hostname':
                    document.title = getUrl();
                    break;
                default:
                    break;
            }
        }
    });

})();