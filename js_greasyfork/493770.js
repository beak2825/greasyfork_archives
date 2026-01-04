// ==UserScript==
// @name         ByBit Tooltip Creator
// @namespace    CryptOf
// @license      MIT
// @version      1.0
// @description  Создание подсказки к заблокированным средствам по ордерам при наведении на сообщение о блокировке
// @author       Евгений Мухин
// @match        https://www.bybit.com/fiat/trade/otc/orderList/?orderType*
// @grant        none
// @icon         https://static.tildacdn.com/tild6138-6464-4437-b737-633632613034/ByBit_.svg
// @icon64       https://static.tildacdn.com/tild6138-6464-4437-b737-633632613034/ByBit_.svg
// @downloadURL https://update.greasyfork.org/scripts/493770/ByBit%20Tooltip%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/493770/ByBit%20Tooltip%20Creator.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Создание элемента для всплывающей подсказки
	const tooltip = document.createElement('div');
	tooltip.style.position = 'absolute';
	tooltip.style.padding = '10px';
	tooltip.style.background = '#333';
	tooltip.style.color = '#fff';
	tooltip.style.borderRadius = '5px';
	tooltip.style.display = 'none';
	tooltip.style.transition = 'opacity 0.3s';
	tooltip.style.zIndex = '1000';
	tooltip.style.lineHeight = '140%';
	document.body.appendChild(tooltip);

	let unlockDate;

	// Функция для создания всплывающих подсказок
	function createTooltip(element, text) {
		const splitText = text.split(' до ');
		unlockDate = new Date(splitText[1]);
		tooltip.style.opacity = '1';
		tooltip.style.display = 'block';
		const rect = element.getBoundingClientRect();
		tooltip.style.left = window.scrollX + rect.left + 'px';
		tooltip.style.top = window.scrollY + rect.top - tooltip.offsetHeight - 10 + 'px';
		updateTooltip(); // Обновляем подсказку сразу же при создании
	}

	// Функция для обновления всплывающих подсказок
	function updateTooltip() {
		if (tooltip.style.display !== 'none') {
			const now = new Date();
			const diffMs = unlockDate - now;
			const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
			const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
			const diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000);
			const unlockDateString = ('0' + unlockDate.getDate()).slice(-2) + '.' + ('0' + (unlockDate.getMonth() + 1)).slice(-2) + '.' + (unlockDate.getFullYear() % 100) + ' ' + ('0' + unlockDate.getHours()).slice(-2) + ':' + ('0' + unlockDate.getMinutes()).slice(-2) + ':' + ('0' + unlockDate.getSeconds()).slice(-2) + ' (GMT+' + (unlockDate.getTimezoneOffset() / -60) + ')';
			tooltip.innerHTML = 'Монеты заблокированы до<br>' + unlockDateString + '<br>Осталось ' + diffHrs.toString().padStart(2, '0') + ':' + diffMins.toString().padStart(2, '0') + ':' + diffSecs.toString().padStart(2, '0');
		}
	}

	// Отслеживание наведения мыши на элементы
	document.body.addEventListener('mouseover', function (event) {
		if (event.target.matches('.withdrawTips, .withdrawTipsText')) {
			const withdrawTipsElement = event.target.closest('.withdrawTips');
			if (withdrawTipsElement) {
				const textElement = withdrawTipsElement.querySelector('.withdrawTipsText');
				if (textElement) {
					createTooltip(withdrawTipsElement, textElement.textContent);
				}
			}
		}
	});

	// Отслеживание ухода мыши с элемента для скрытия всплывающей подсказки
	document.body.addEventListener('mouseout', function (event) {
		if (event.target.matches('.withdrawTips, .withdrawTipsText')) {
			tooltip.style.opacity = '0';
			setTimeout(function () {
				tooltip.style.display = 'none';
			}, 300);
		}
	});

	// Обновление всплывающей подсказки каждую секунду
	setInterval(updateTooltip, 1000);
})();
