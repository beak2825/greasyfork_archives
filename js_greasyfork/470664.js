// ==UserScript==
// @name         豆瓣过滤低分电视剧
// @namespace    https://movie.douban.com/
// @version      0.1.2
// @description  豆瓣自动过滤低分电视剧
// @author       xiaolin
// @match        https://movie.douban.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470664/%E8%B1%86%E7%93%A3%E8%BF%87%E6%BB%A4%E4%BD%8E%E5%88%86%E7%94%B5%E8%A7%86%E5%89%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/470664/%E8%B1%86%E7%93%A3%E8%BF%87%E6%BB%A4%E4%BD%8E%E5%88%86%E7%94%B5%E8%A7%86%E5%89%A7.meta.js
// ==/UserScript==
;(function() {
    setInterval(() => {
	$('ul.explore-list li').each((idx, obj) => {
	    const $obj = $(obj)
            const text = $obj.find('.drc-rating-num').text()
		if (text < 7.5 || text === '暂无评分') {
			$obj.hide()
		}
	})
    }, 100)
})();

