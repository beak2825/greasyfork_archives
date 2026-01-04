// ==UserScript==
// @name         Jitsi always show toolbox
// @namespace    http://artificialworlds.net
// @version      0.2
// @description  Prevent the Jitsi toolbox from sliding away
// @author       Andy Balaam
// @include      https://meet.*.space/*
// @match        https://meet.jit.si/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433491/Jitsi%20always%20show%20toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/433491/Jitsi%20always%20show%20toolbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(css) {
        const style = document.getElementById("GM_addStyleContainer") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleContainer";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    // AndyB: Make toolbox always visible
    addStyle(`
        .new-toolbox {
            bottom: 0;
            height: 42px;
        }
    `);
    addStyle(`
        .toolbox-content-items {
            padding: 0px;
        }
    `);
    addStyle(`
        .toolbox-content {
            margin-bottom: 0px;
        }
    `);
    addStyle(`
        .tile-view {
            align-content: start;
        }
    `);
    addStyle(`
        #videospace {
            height: calc(100% - 24px);
            max-height: calc(100% - 24px);
        }
    `);
    addStyle(`
        .tile-view #filmstripRemoteVideos {
            height: calc(100% - 24px);
        }
    `);
    addStyle(`
        .vertical-filmstrip .filmstrip.reduce-height {
            height: 100%;
        }
    `);
})();
