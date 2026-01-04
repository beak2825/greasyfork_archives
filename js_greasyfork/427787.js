// ==UserScript==
// @name         Open Vue devtools
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在检测到Vue.js环境时，打开vue开发工具的开关，便于调试生产环境下的Vue页面
// @author       YUYIDM
// @match        http://*/*
// @match        https://*/*
// @icon         https://cn.vuejs.org/images/logo.svg
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js
// @downloadURL https://update.greasyfork.org/scripts/427787/Open%20Vue%20devtools.user.js
// @updateURL https://update.greasyfork.org/scripts/427787/Open%20Vue%20devtools.meta.js
// ==/UserScript==

(function (g) {
    'use strict';

    Vue.config.productionTip = false

    Object.defineProperty(window, 'Vue', {
        get() {
            return Vue;
        },
    });
})(Window);
