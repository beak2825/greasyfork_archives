// ==UserScript==
// @name         FF14国服竞猜中心数据统计
// @namespace    https://unlucky.ninja/
// @version      2024.06.21.1
// @description  在页面上显示数据统计
// @author       UnluckyNinja
// @match        https://actff1.web.sdo.com/20240520_NewJingCai/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sdo.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://update.greasyfork.org/scripts/498113/1395364/waitForKeyElements_mirror.js
// @downloadURL https://update.greasyfork.org/scripts/498478/FF14%E5%9B%BD%E6%9C%8D%E7%AB%9E%E7%8C%9C%E4%B8%AD%E5%BF%83%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/498478/FF14%E5%9B%BD%E6%9C%8D%E7%AB%9E%E7%8C%9C%E4%B8%AD%E5%BF%83%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getStats(node){
        const div = document.createElement('div')
        const totalCosts = node.find('.items.guessit.itw4').map(function(){
            return parseInt(this.textContent)
        }).toArray().reduce((a,b)=>a+b)
        const gains = node.find('.items.guessit.itw6').map(function(){
            return parseInt(this.textContent)
        }).toArray()
        const totalGains = gains.reduce((a,b)=>a+b)
        const ratio = totalCosts === 0 ? 0 : (totalGains-totalCosts)/totalCosts
        const ratioText = (ratio*100).toFixed(2)+'%'
        const ratioStyle = ratio >0 ? 'color: forestgreen' : ratio < 0 ? 'color: crimson' : ''

        const wonGuesses = gains.filter(it=>it>0).length
        const totalGuesses = gains.length
        const correctRates = wonGuesses / totalGuesses

        div.innerHTML = `
        <div>
        获得/花费：
        <span style="color: forestgreen">${totalGains}</span> / <span style="color: crimson">${totalCosts}</span>，
        盈亏：<span style="${ratioStyle}">${ratio > 0 ? '+' : ''}${ratioText}</span>
        </div>
        <div>
        猜中/总数：
        <span>${wonGuesses}</span> / <span>${totalGuesses}</span>，
        正确率：<span>${(correctRates*100).toFixed(2)+'%'}</span>
        </div>`
        div.style.textAlign = 'right'
        div.style.margin = '0.25rem auto'
        return div
    }

    waitForKeyElements('.pageGuesshis div.tabCont.tabContCls:nth-child(1)', (node)=>{
        node.before(getStats(node))
    })
})();