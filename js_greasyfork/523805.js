// ==UserScript==
// @name         Gooboo展示光实时获取（不计算蜡烛收益）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  煤渣活动展示当前光获取速度
// @author       Thamior
// @match        *://*/gooboo/
// @match        *://gooboo.g8hh.com.cn/
// @match        https://gooboo.g8hh.com.cn/1.4.2/
// @match        *://gooboo.tkfm.online/
// @icon         https://tendsty.github.io/gooboo/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523805/Gooboo%E5%B1%95%E7%A4%BA%E5%85%89%E5%AE%9E%E6%97%B6%E8%8E%B7%E5%8F%96%EF%BC%88%E4%B8%8D%E8%AE%A1%E7%AE%97%E8%9C%A1%E7%83%9B%E6%94%B6%E7%9B%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/523805/Gooboo%E5%B1%95%E7%A4%BA%E5%85%89%E5%AE%9E%E6%97%B6%E8%8E%B7%E5%8F%96%EF%BC%88%E4%B8%8D%E8%AE%A1%E7%AE%97%E8%9C%A1%E7%83%9B%E6%94%B6%E7%9B%8A%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const intervalId = setInterval(() => {
        getPerSecond()
    }, 1000);
    //格式化数据
    function formatNumber(num) {
        if (num < 1000) return num; // 小于1000的数字直接返回
        const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N', 'D'];
        let unitIndex = 0;
        while (num >= 1000 && unitIndex < units.length) {
            num /= 1000;
            unitIndex++;
        }
        return num.toFixed(2) + (unitIndex > 0 ? units[unitIndex - 1] : '');
    }
    function getPerSecond() {
        //获取数据
        const store = document.getElementsByClassName("primary")[0].__vue__.$store
        const base = store.getters['cinders/totalProduction']
        const globalEventLevel = store.getters['meta/globalEventLevel']
        const moonLevel = store.state.upgrade.item.event_moonglow.level
        //计算
        const totalGain = base * Math.pow(1.01, globalEventLevel) * Math.pow(3, moonLevel)
        const text = '---' + formatNumber(totalGain) + '/s'
        //dom操作
        if (document.querySelector('.balloon-text-dynamic.currency-text.text-center.thamior-light-perSecond')) {
            const perSecondDom = document.querySelector('.balloon-text-dynamic.currency-text.text-center.thamior-light-perSecond')
            perSecondDom.textContent = text
        } else {
            const totalDom = document.querySelector('.currency-container.rounded.d-flex.flex-nowrap.pa-2.yellow.ma-1.render-currency-small .v-icon.notranslate.mr-2.mdi.mdi-lightbulb-on+div .balloon-text-dynamic.currency-text.text-center')
            if(totalDom) {
                const perSecondDom = document.createElement('span')
                // 添加类名
                perSecondDom.classList.add('balloon-text-dynamic', 'currency-text', 'text-center', 'thamior-light-perSecond');
                // 设置内容
                perSecondDom.textContent = text;
                //添加
                totalDom.after(perSecondDom)
            }
        }
    }
})();