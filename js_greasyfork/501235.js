// ==UserScript==
// @name         MapLibreApiContentShow
// @namespace    http://tampermonkey.net/
// @version      2024-07-19
// @description  显示MapLibre安卓api文档内容
// @author       You
// @match        *://*.maplibre.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maplibre.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501235/MapLibreApiContentShow.user.js
// @updateURL https://update.greasyfork.org/scripts/501235/MapLibreApiContentShow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let _observer = null
    const mainContent = window.document.querySelector('.main-content')
    if (mainContent) {
        _observer = new window.MutationObserver((list, observer) => {
            if (list.length) {
                if (list[0].attributeName === 'style') {
                    if (mainContent[list[0].attributeName].display) {
                        mainContent[list[0].attributeName].display = ''
                    }
                }
            }
        })
        _observer.observe(mainContent, { attributes: true })
    }
    window.onbeforeunload = () => {
        if (_observer) {
            _observer.disconnect()
            _observer = null
        }
    }
})();