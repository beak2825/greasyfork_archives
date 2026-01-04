// ==UserScript==
// @name         Console Tools
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  function tool classes that can run on the console
// @author       jiangweiye
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=developer.mozilla.org
// @require      https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.4/moment.min.js
// @grant        GM_setClipboard
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476913/Console%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/476913/Console%20Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const PREFIX = 'tools';

    class Utils {
        /**
         * @description 拷贝到剪切板
         * @param {string} content
         * @returns boolean
         */
        copyToClipboard(content) {
            try {
                GM_setClipboard(content, 'text');
                return true;
            } catch (error) {
                return false;
            }
        }
    }

    class Tools extends Utils {
        constructor() {
            super();
        }

        /**
         * @description 格式化时间
         * @param {string|Date} date
         * @param {string} fmt
         * @returns {string}
         */
        parseTime(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
            const _date = date instanceof Date ? date : new Date(date);
            return moment(_date).format(fmt);
        }

        /**
         * @description 格式化对象键
         * @param {string} data
         */
        convertKey(data) {
            const key = data.replace(/[^_]+/g, v => v.toUpperCase());
            this.copyToClipboard(`${key}: '${data}',`);
        }
    }

    window[PREFIX] = new Tools();
})();

