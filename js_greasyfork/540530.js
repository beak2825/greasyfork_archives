// ==UserScript==
// @name         2ch.hk Full page video fix
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Fix video div to fill page with correct aspect ratio
// @author       vkc
// @match        https://2ch.hk/*/*
// @match        https://2ch.su/*/*
// @match        https://2ch.life/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540530/2chhk%20Full%20page%20video%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/540530/2chhk%20Full%20page%20video%20fix.meta.js
// ==/UserScript==

/* globals Settings, MediaViewer, CFG, Store */

(function() {
    'use strict';

    let hasSettings = typeof Settings === 'object' && Settings !== null;
    let hasMediaViewer = typeof MediaViewer === 'function' && MediaViewer !== null;
    let hasCFG = typeof CFG === 'object' && CFG !== null;
    let hasStore = typeof Store === 'object' && Store !== null;
    let defaultValue = true;

    if (!hasSettings || !hasMediaViewer || !hasCFG || !hasStore) {
        return
    }

    let _BORDER = 8;
    let _HEADER = 48;
    let _STORE_KEY_MEDIA = 'media';
    let _STORE_KEY_MEDIA_FULLSCREEN = 'media.open_fullscreen';
    let _SETTING_TITLE = 'Разворачивать мультимедиа на весь экран';

    Settings.addSetting(_STORE_KEY_MEDIA, _STORE_KEY_MEDIA_FULLSCREEN, {
        label: _SETTING_TITLE,
        default: defaultValue
    });

    MediaViewer.prototype.scale = function() {
        if (this.data.w > CFG.W_WIDTH || this.data.h > CFG.W_HEIGHT || Store.get(_STORE_KEY_MEDIA_FULLSCREEN, defaultValue)) {
            let multW = Math.max(0.1, Math.round((CFG.W_WIDTH - _BORDER * 2) / this.data.w * 100) / 100);
            let multH = Math.max(0.1, Math.round((CFG.W_HEIGHT - _BORDER * 2 - _HEADER) / this.data.h * 100) / 100);
            this.resize(Math.min(multW, multH), true);
        }
    }

})();
