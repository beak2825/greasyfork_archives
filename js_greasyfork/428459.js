// ==UserScript==
// @name         publink-open-vue-devtools
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  publink开启vue开发工具
// @author       HuangBaoCheng
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428459/publink-open-vue-devtools.user.js
// @updateURL https://update.greasyfork.org/scripts/428459/publink-open-vue-devtools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    try {

        setTimeout(function() {
            const all = document.querySelectorAll('*');
            let el
            for (let i = 0; i < all.length; i++) {
                if (all[i].__vue__) {
                    el = all[i]
                    break
                }
            }
            if (el) {
                console.log('use vue', el);
                var Vue = Object.getPrototypeOf(el.__vue__).constructor
                while (Vue.super) {
                    Vue = Vue.super
                }
                Vue.config.devtools = true;
                window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue;
                console.log(Vue.version);
            }
            else {
                console.log('not use vue');
        }
        }, 5000)

    } catch (error) {
        console.warn('publink-open-vue-devtools -> ', error)
    }
})();