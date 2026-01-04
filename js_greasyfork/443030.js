// ==UserScript==
// @name         Hook.js
// @namespace    https://github.com/invobzvr
// @version      0.1
// @description  Javascript function hook
// @author       invobzvr
// @homepageURL  https://github.com/invobzvr/invotoys.js/tree/main/hook.js
// @supportURL   https://github.com/invobzvr/invotoys.js/issues
// @license      GPL-3.0
// ==/UserScript==

(function () {
    const ORI = {};

    Function.prototype.hook = function (params) {
        typeof params === 'function' && (params = {
            scope: window,
            before: params,
        });
        !params.scope && (params.scope = window);
        const that = this,
            name = that.name;
        ORI[name] = that;
        params.scope[name] = function () {
            if (typeof params.before === 'function') {
                const ret = params.before.apply(this, arguments);
                if (ret !== undefined) {
                    return ret;
                }
            }
            let val = that.apply(this, arguments);
            if (typeof params.after === 'function') {
                const ret = params.after.apply(this, [val, arguments]);
                if (ret !== undefined) {
                    val = ret;
                }
            }
            return val;
        }
    }
})();