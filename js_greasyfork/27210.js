// ==UserScript==
// @name         锁均价
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  锁HB最低均价
// @author       伟大鱼塘
// @include      *
// @include      www.humblebundle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27210/%E9%94%81%E5%9D%87%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/27210/%E9%94%81%E5%9D%87%E4%BB%B7.meta.js
// ==/UserScript==

$(function() {
	var timer1 = setTimeout(function() {
		(function() {
			var result = $('h2.dd-header-headline.s-bta').html();
			var num = /[1-9]\d*\.\d*|0\.\d*[1-9]\d*/g.exec(result);
			if (num) {
				var _bundle = localStorage.getItem('bundle');
				var $bundle = $('#subtab-container').find("a").eq(0).html();
				if (_bundle === null) {
					localStorage.setItem('bundle', $bundle);
				} else if (_bundle !== null && _bundle !== $bundle) {
					localStorage.setItem('bundle', $bundle);
					localStorage.removeItem('price');
					localStorage.removeItem('atleast');
				}
				var _price = localStorage.getItem('price');
				num = parseFloat(num[0]);
				if (_price === null) {
					localStorage.setItem('price', num);
					localStorage.setItem('atleast', "1");
					window.open('https://www.humblebundle.com');
				} else {
					_price = parseFloat(_price);
					if (_price <= num) {
						window.open('https://www.humblebundle.com');
						//至少保留一个最低价格页面
						var _atleast = localStorage.getItem('atleast');
						if (Number(_atleast)) {
							localStorage.setItem('atleast', "0");
						} else {
							window.close();
						}
					} else {
						localStorage.setItem('price', num);
						if (window.opener) {
							window.opener.close();
						}
						console.log('当前最低均价为' + _price);
						window.open('https://www.humblebundle.com');
					}
				}
				setInterval(function() {
					var _price2 = localStorage.getItem('price');
					_price2 = parseFloat(_price2);
					if (num > _price2) {
						window.close();
					}
				}, 30000);
			} else {
				window.open('https://www.humblebundle.com');
			}
		})();
		//修改这个数字可以更改脚本执行延时
	}, 10000);
});