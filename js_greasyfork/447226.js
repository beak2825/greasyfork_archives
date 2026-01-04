// ==UserScript==
// @name         115-rename-enhancer
// @name:zh-CN   115重命名增强
// @name:zh-HK   115重命名增強
// @name:zh-TW   115重命名增強
// @version      0.1.1
// @author       kunki
// @description  優化115網盤文件重命名邏輯，支持修改後綴名。
// @description:zh-CN  優化115網盤文件重命名邏輯，支持修改後綴名。
// @description:zh-HK  優化115網盤文件重命名邏輯，支持修改後綴名。
// @description:zh-TW  優化115網盤文件重命名邏輯，支持修改後綴名。
// @match        https://115.com/*
// @exclude      https://115.com/s/*
// @icon         https://115.com/favicon.ico
// @grant        none
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://greasyfork.org/scripts/447226
// @supportURL   https://gist.github.com/kunki/afc4e69df868266f3eb0ed02fcf0546a
// @homepageURL  https://gist.github.com/kunki/afc4e69df868266f3eb0ed02fcf0546a
// @downloadURL https://update.greasyfork.org/scripts/447226/115-rename-enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/447226/115-rename-enhancer.meta.js
// ==/UserScript==

(function() {
    let _indexOf = String.prototype.indexOf;
    Object.defineProperty(String.prototype, 'indexOf', {
        configurable: true,
        writable: true,
        value: function(search, start) {
            try {
                let me = String.prototype.indexOf;
                // caller is forbidden in strict mode, so try and catch exception simply.
                if (me.caller !== me) {
                    if (me.caller.toString().indexOf('cache.suffix') != -1) {
                        return -1;
                    }
                }
            } catch (e) {}
            return _indexOf.apply(this, [search, start]);
        },
    });
})();