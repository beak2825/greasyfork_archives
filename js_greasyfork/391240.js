// ==UserScript==
// @name         Vuetify 去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除 Vuetify 开发文档中的广告
// @author       HoPGoldy
// @match        https://vuetifyjs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391240/Vuetify%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/391240/Vuetify%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 移除 html 元素
     * @param {HtmlElement} el 要移除的元素
     */
    const remove = function (el) {
        if (!el) return
        el.parentElement.removeChild(el)
    }

    // 删除所有广告
    const clearAd = () => {
        // 左上角主要赞助商标题
        remove(document.querySelector('.text-center > .title.grey--text.text--darken-2'))
        // 左上角主要赞助商广告
        remove(document.querySelector('.text-center > section.layout.align-center.wrap'))
        // 左上角赞助我们按钮
        remove(document.querySelector('.mb-6.v-btn.v-btn--depressed.v-btn--flat.v-btn--outlined.v-btn--rounded.v-size--default.primary--text'))
        // 右边栏赞助我们按钮
        remove(document.querySelector('.v-navigation-drawer__content > div > div > .my-4'))
        // 右边栏下方广告
        remove(document.querySelector('.mt-auto'))
    }
    setInterval(clearAd, 600)
})();