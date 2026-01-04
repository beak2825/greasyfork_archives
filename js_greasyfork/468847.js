// ==UserScript==
// @name         雪球调仓时输入小数
// @namespace    http://xueqiu.com/
// @version      0.1.4
// @description  雪球调仓时可以输入小数
// @author       xiaolin
// @match        https://xueqiu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468847/%E9%9B%AA%E7%90%83%E8%B0%83%E4%BB%93%E6%97%B6%E8%BE%93%E5%85%A5%E5%B0%8F%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468847/%E9%9B%AA%E7%90%83%E8%B0%83%E4%BB%93%E6%97%B6%E8%BE%93%E5%85%A5%E5%B0%8F%E6%95%B0.meta.js
// ==/UserScript==
;(function() {
	function blurHandler(event) {
		let cash = 10000
        const trs = $('#cube-stock tr.stock')
        const length = trs.length
		for (let i = 0; i < length; i++) {
            const tr = $(trs[i])
			const weight = Number(tr.find('input.weight').val().replace('%', ''))
            const data = SNB.cubeData.find(n => n.stock_id == tr.attr('data-id'))
			if (data && data.weight != weight) {
				data.proactive = true
				data.weight = weight
			}
			cash -= weight * 100
		}
		cash = +(cash / 100).toFixed(2)
		$('.cash .stock-weight input').val(cash)
		$('.cash .stock-weight span.weight').text(cash + '%')
		SNB.cashWeight = cash
		event.stopPropagation()
		return false
	}

	setInterval(function(){
   		$('input.weight').off('blur').blur(blurHandler)
   	}, 50)
})();

