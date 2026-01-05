// ==UserScript==
// @name         KG Last Wishes and Suggestions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add few features, described on forum http://klavogonki.ru/forum/wishes/110/page1/#write
// @author       chikaldirick
// @match        http://klavogonki.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27956/KG%20Last%20Wishes%20and%20Suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/27956/KG%20Last%20Wishes%20and%20Suggestions.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//alert(1);
	function addUserResultsLink() {
		if(window.location.href.indexOf("klavogonki.ru/top") > -1) {
			var username = document.getElementsByClassName('name')[0].children[1].innerHTML;
			var userResultsLink = document.createElement('a');
			userResultsLink.href = '?s=' + username;
			userResultsLink.innerHTML = 'Где же здесь ' + username + '?';
			userResultsLink.style.cssText = 'float: left; font-size: 14px; margin-top: 2px;';
			/*
			userResultsLink.css({
				"float": "left",
				"font-size": "14px",
				"margin-top": "2px"
			});
			*/
			document.getElementsByClassName('content-col')[0].insertBefore(userResultsLink, document.getElementsByClassName('search')[0]);
		}

	}

	function addBonusesPointsDividers() {
		var pointsBlock = document.getElementById('userpanel-scores');
		var pointsDivided = divideNumber(pointsBlock.innerHTML, '&thinsp;');
		pointsBlock.innerHTML = pointsDivided;

		var bonusesBlock = document.getElementById('userpanel-dailybonus');
		if(parseInt(bonusesBlock.innerHTML) > 999) {
			var bonusesDivided = divideNumber(bonusesBlock.innerHTML, '&thinsp;');
			bonusesBlock.innerHTML = bonusesDivided;
		}
	}

	function divideNumber(str, divider) {
		return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, divider);
	}

	function removeProfileLink() {
		// Удалить большую синюю кнопку "Перейти к профилю" слева. Оставить ссылку "Сводка"
		document.querySelector('.user-dropdown .col1 ul > li:first-child').remove();
		// Удалить ссылку "Сводка" справа. Оставить большую синюю кнопку "Перейти к профилю" слева
		//document.querySelector('.user-dropdown .col2 ul > li:first-child').remove();
	}

	function addVocLinkInStats() {
		var vocName = document.querySelector('.profile-stats-details');
		// Can't find div when script's executing maybe because details block loading after page load
		console.log(vocName.innerHTML);
	}

	function increazePagesLinksSize() {
		var selectedPages = document.querySelectorAll('.page.selected');
		for (var i = 0; i < selectedPages.length; i++) {
			selectedPages[i].className += ' btn btn-default';
			selectedPages[i].style.padding = '6px 12px';
		}

		var pages = document.querySelectorAll('.page a');
		for (i = 0; i < pages.length; i++) {
			pages[i].parentElement.style.padding = '0';
			pages[i].style.textDecoration = 'none';
			pages[i].className += ' btn btn-default';
		}

		document.getElementsByClassName('pages')[0].style.marginBottom = '10px';
	}

	addUserResultsLink();
	addBonusesPointsDividers();
	removeProfileLink();
	//addVocLinkInStats();
	increazePagesLinksSize();
})();