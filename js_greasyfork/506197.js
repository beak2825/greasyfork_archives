// ==UserScript==
// @name         银豹商品图片加载工具
// @namespace    https://beta59.pospal.cn/
// @version      v1.0 2024-09-01
// @description  银豹系统商品管理加载图片辅助工具
// @author       EBIC909
// @match        https://beta59.pospal.cn/Product/Manage
// @icon         https://beta59.pospal.cn/images/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/506197/%E9%93%B6%E8%B1%B9%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/506197/%E9%93%B6%E8%B1%B9%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function initBtn(){
		const importButton = document.querySelector('.btnImport');
		const newSpan = document.createElement('span');
		newSpan.className = 'btnAddProduct btnBlue';
		newSpan.textContent = '载入商品图';
		newSpan.addEventListener('click', loadImages);
		importButton.insertAdjacentElement('afterend', newSpan);
	}
	async function loadImages () {
		let dataObject = getEmptyResultArr()
		startLoading()
		for (const id of Object.keys(dataObject)) {
			dataObject[id] = await getProductImage(id);
		}
		stopLoading()
		const rows = getTableTr();
		rows.forEach(row => {
			const trId = row.getAttribute('data');
			let imgPath = dataObject[trId];
			if (imgPath) {
				let firstTd = row.querySelector('td');
				let imgElement = document.createElement('img');
				imgElement.src = imgPath;
				imgElement.style.maxWidth = '300px';
				imgElement.style.maxHeight = '300px';
				imgElement.style.width = 'auto';
				imgElement.style.height = 'auto';
				imgElement.style.display = 'block';
				imgElement.style.margin = '0 auto';
				firstTd.innerHTML = '';
				firstTd.appendChild(imgElement);
			}
		})
	
	}
	function getTableTr () {
		const tbody = document.querySelector('#mainTable tbody');
		const rows = tbody.querySelectorAll('tr');
		return rows;
	}
	function getEmptyResultArr () {
		const rows = getTableTr();
		const dataObject = {};
		rows.forEach(row => {
			const dataValue = row.getAttribute('data');
			if (dataValue) {
				dataObject[dataValue] = "";
			}
		});
		return dataObject;
	}
	async function getProductImage (productId) {
		const responseInfo = await fetchProductById(productId)
		if (!responseInfo.successed) {throw new Error(responseInfo)}
		const productInfo = responseInfo.product
		const defaultproductimage = productInfo.defaultproductimage
		if (!defaultproductimage){throw new Error({productInfo, msg: "不存在商品图"})}
		const path = "https://img.pospal.cn/" + defaultproductimage.path;
		return path;
	}
	async function fetchProductById(productId) {
		const url = 'https://beta59.pospal.cn/Product/FindProduct';
		const postData = new URLSearchParams();
		postData.append('productId', productId);
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: postData.toString(),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const jsonData = await response.json();
			return jsonData;
		} catch (error) {
			console.error('Error fetching product:', error);
			throw error;
		}
	}
	const loadingDiv = document.createElement('div');
	loadingDiv.id = 'loading';
	loadingDiv.style.position = 'fixed';
	loadingDiv.style.top = '0';
	loadingDiv.style.left = '0';
	loadingDiv.style.right = '0';
	loadingDiv.style.bottom = '0';
	loadingDiv.style.background = 'rgba(255, 255, 255, 0.8)';
	loadingDiv.style.display = 'none';
	loadingDiv.style.flexDirection = 'column';
	loadingDiv.style.alignItems = 'center';
	loadingDiv.style.justifyContent = 'center';
	loadingDiv.style.zIndex = '1000';

	const spinner = document.createElement('div');
	spinner.style.border = '8px solid #f3f3f3'; // Light grey
	spinner.style.borderTop = '8px solid #3498db'; // Blue
	spinner.style.borderRadius = '50%';
	spinner.style.width = '50px';
	spinner.style.height = '50px';
	spinner.style.marginTop = '10px';
	spinner.style.animation = 'spin 1s linear infinite';

	loadingDiv.appendChild(spinner);
	loadingDiv.appendChild(document.createTextNode('加载中...'));
	document.body.appendChild(loadingDiv);
	const style = document.createElement('style');
	style.innerHTML = `
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
	`;
	document.head.appendChild(style);
	
	function initLoad () {
		initBtn()
	}
	function startLoading() {
		loadingDiv.style.display = 'flex';
	}
	function stopLoading() {
		loadingDiv.style.display = 'none';
	}
	window.addEventListener('load', function() {
		initLoad()
	})
})();
