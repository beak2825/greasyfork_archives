// ==UserScript==
// @name              No DisableDevTool
// @name:zh-CN        放飞 disable-devtool
// @name:ja           disable-devtool をぶち壊せ
// @namespace         NoDisableDevTool
// @version           1.1.2
// @description       Break disable-devtool and devtools-detector while keeping the website working perfectly.
// @description:zh-CN 在禁用 disable-devtool 和 devtools-detector 的同时，使网站完美运行。
// @description:ja    disable-devtool と devtools-detector を壊すながら、ウェブサイトに影響を及ぼさず。
// @author            FurryR
// @match             *://*/*
// @license           MIT
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/501270/No%20DisableDevTool.user.js
// @updateURL https://update.greasyfork.org/scripts/501270/No%20DisableDevTool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document instanceof XMLDocument) {
        return;
    }

    const slice = Array.prototype.slice;
    Array.prototype.slice = function (...args) {
        if (args.length === 0 && Array.prototype.every.call(this, v => v && typeof v === 'object' && typeof v.name === 'string' && typeof v.isOpen === 'function' && typeof v.isEnable === 'function')) {
                Array.prototype.slice = slice;
                return [];
        }
        return slice.call(this, args);
    };

    const assign = Object.assign;
    Object.assign = function (...args) {
        if (args.length === 2 && typeof args[0] === 'function' && typeof args[1] === 'object' && args[1] !== null && typeof args[1].isDevToolOpened === 'function' && typeof args[1].version === 'string' && typeof args[1].isRunning === 'boolean' && typeof args[1].isSuspend === 'boolean') {
            Object.assign = assign;
            const result = Object.assign(...args);
            console.log('Detected disable-devtool component', result);
            return Object.assign(function () {
                console.trace('disable-devtool called here');
            }, args[1]);
        }
        return assign.call(this, ...args);
    }
})();