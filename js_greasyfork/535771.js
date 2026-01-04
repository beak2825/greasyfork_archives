// ==UserScript==
// @name               Vue devtools enabler
// @name:zh-CN         启用 Vue devtools
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.1.2
// @description        Enable Vue devtools on all websites
// @description:zh-CN  为所有网站启用 Vue devtools
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              http*://*/*
// @icon               https://cn.vuejs.org/logo.svg
// @grant              GM_log
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/535771/Vue%20devtools%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/535771/Vue%20devtools%20enabler.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

(async function __MAIN__() {
    'use strict';

    // 获取window
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // 监听和修改window.__VUE_DEVTOOLS_GLOBAL_HOOK__
    const VueDevtoolsGlobalHook = await (function() {
        const { promise, resolve } = Promise.withResolvers();
        check();
        return promise;

        function check() {
            if (win.hasOwnProperty('__VUE_DEVTOOLS_GLOBAL_HOOK__')) {
                const VHook = win.__VUE_DEVTOOLS_GLOBAL_HOOK__;
                VHook.enabled = true;
                resolve(VHook);
            } else {
                setTimeout(check);
            }
        }
    }) ();

    // Vue实例处理器
    const VueDealer = {
        roots: new Set(),

        vue2: {
            connect(app) {
                const root = app.$root;
                if (VueDealer.roots.has(root)) { return; }

                let Vue = root.constructor;
                while (Vue.super) { Vue = Vue.super; }
                Vue.config.devtools = true;
                VueDevtoolsGlobalHook.emit("init", Vue);

                VueDealer.roots.add(root);
            },
        },

        vue3: {
            connect(app) {
                if (VueDealer.roots.has(app)) { return; }
                if (!Array.isArray(VueDevtoolsGlobalHook.apps)) { return; }
                if (VueDevtoolsGlobalHook.apps.includes(app)) { return; }

                const version = app.version;
                const types = {
                    Fragment: undefined,
                    Text: undefined,
                    Comment: undefined,
                    Static: undefined
                };
                VueDevtoolsGlobalHook.emit("app:init", app, version, types);
                const unmount = app.unmount;
                app.unmount = function() {
                    VueDevtoolsGlobalHook.emit("app:unmount", app);
                    unmount.call(app);
                };

                VueDealer.roots.add(app);
            }
        }
    };

    // 每当DOM变化时，都遍历所有元素，寻找Vue实例
    const observer = new MutationObserver(() => {
        for (const element of document.querySelectorAll('*')) {
            if (element.__vue__?._isVue) {
                VueDealer.vue2.connect(element.__vue__);
            }
            if (element.__vue_app__?.version) {
                VueDealer.vue3.connect(element.__vue_app__);
            }
        }
    });
    observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
    });
}) ();