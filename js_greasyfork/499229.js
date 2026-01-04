// ==UserScript==
// @name         Gandi Plugins
// @namespace    http://tampermonkey.net/
// @version      release-1.3
// @description  使用 YUEN 开发中的 Gandi Plugins
// @author       en5991@outlook.com
// @match        https://*.cocrea.world/*
// @match        https://cocrea.world/*
// @match        https://*.ccw.site/*
// @match        https://ccw.site/*
// @license     MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjciIGhlaWdodD0iNjciIHZpZXdCb3g9IjAgMCA2NyA2NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSByPSIzMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMzMuNjc5NyAzMy42NDQ1KSIgZmlsbD0iIzVDRkY2RCIvPgo8cGF0aCBkPSJNMzMuNjc4OSAyMy42NDQ1TDMzLjY3ODkgNDMuNjQ0NU0yMy42Nzk3IDMzLjY0MjdINDMuNjc5NyIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499229/Gandi%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/499229/Gandi%20Plugins.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _bind = Function.prototype.bind;
    Function.prototype.bind = function () {
        if (Function.prototype.bind === _bind) {
            return _bind.apply(this, arguments);
        } else if (arguments[0] && Object.prototype.hasOwnProperty.call(arguments[0], "runtime")) {
            window.postMessage({ name: "plugins-inject", path: "https://static.appinnov.cn/gandi-plugins-dev-yuentesting/static/js/main.js" }, "*");
            Function.prototype.bind = _bind;
            return _bind.apply(this, arguments);
        } else {
            return _bind.apply(this, arguments);
        }
    }
})();