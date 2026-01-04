// ==UserScript==
// @name         获取拼朵朵选品库 SKU
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jinbao.pinduoduo.com/promotion/favorites*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422184/%E8%8E%B7%E5%8F%96%E6%8B%BC%E6%9C%B5%E6%9C%B5%E9%80%89%E5%93%81%E5%BA%93%20SKU.user.js
// @updateURL https://update.greasyfork.org/scripts/422184/%E8%8E%B7%E5%8F%96%E6%8B%BC%E6%9C%B5%E6%9C%B5%E9%80%89%E5%93%81%E5%BA%93%20SKU.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var originOpen = XMLHttpRequest.prototype.open;
	var originSend = XMLHttpRequest.prototype.send;
	var originLoadStart = XMLHttpRequest.prototype.loadstart;
	var list = [];
	var listMap = {};

	// 重写open
	XMLHttpRequest.prototype.open = function() {
		this.addEventListener('load', function(obj) {
			var url = obj.target.responseURL; // obj.target -> this
			if (url === 'https://jinbao.pinduoduo.com/network/api/collect/queryAll') {
				let result = JSON.parse(this.response).result;
				result.goodsList.forEach(item => {
					console.log(item);
					let goodsSign = item.goodsDetailVo.goodsSign;
					let name = item.goodsDetailVo.categoryName;
					if (!listMap[name]) {
						listMap[name] = [];
					}
					if (list.findIndex(sign => sign === goodsSign) === -1) {
						listMap[name].push(goodsSign);
					}
				});
			}
		});
		originOpen.apply(this, arguments);
	};
	
	// 重写send
	XMLHttpRequest.prototype.send = function(e) {
		// console.log(arguments);
		originSend.apply(this, arguments);
	};

	setTimeout(() => {
		let generating = false;
		let btnGroups = document.getElementsByClassName('btn-block')[0];
		let newButton = document.createElement('button');
		newButton.id = 'custom-button-copy';
		newButton.className = 'BTN_outerWrapper_-815794578 BTN_primary_-815794578 BTN_medium_-815794578 BTN_outerWrapperBtn_-815794578';
		newButton.onclick = copySkuId;
		newButton.innerHTML = '获取 sku id';
		btnGroups.appendChild(newButton);

		async function copySkuId() {
			if (generating) return;
			generating = true;
            document.getElementById('custom-button-copy').innerText = '获取成功！请复制下方数字';
			let wrap = document.createElement('div');
			let innerList = [];
			for (var key in listMap) {
				innerList.push(key);
				innerList = innerList.concat(listMap[key]);
			}
			wrap.innerHTML = innerList.map(x => x).join('<br />');
			wrap.style.position = 'absolute';
            wrap.style.right = 0;
            wrap.style.zIndex = 999;
            wrap.style.padding = '24px';
            wrap.style.boxShadow = '-1px -1px 4px 6px rgba(0, 0, 0, 0.1)';
            wrap.style.backgroundColor = 'white';
			btnGroups.appendChild(wrap);
			generating = false;
		}
	}, 2000)
})();