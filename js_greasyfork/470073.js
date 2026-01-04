// ==UserScript==
// @name YaAntiAds
// @namespace E11ips0iD_YandexAntiAds
// @description Блокировка рекламы и баннера "Установите yandex" на yandex.ru
// @description:en Block ads and "install yandex" banner on yandex.ru
// @version 0.1
// @author E1ipS0iD
// @license MIT
// @match http*://*.yandex.ru/*
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/470073/YaAntiAds.user.js
// @updateURL https://update.greasyfork.org/scripts/470073/YaAntiAds.meta.js
// ==/UserScript==

(function () {

	var adsFound = false;
	setTimeout(function () {
  
	  var adsFound = false;
	  var elements = document.querySelectorAll('.distr-nav');
  
	  var results = document.getElementById('search-result').querySelectorAll('.serp-item');
	  for (var i=0;i<results.length;i++) {
		  var isAds = results[i].querySelector('.OrganicTextContentSpan span:not(.ExtendedText-Short):not(.ExtendedText-Full):not(.Link):not(.ExtendedText-Toggle)');
		  if (isAds!==null) {
			  adsFound = true;
			  console.log(isAds);
			  isAds = typeof isAds;
			  results[i].style.display = 'none';
			  results[i].style.backgroundColor = '#e8d4d4';
		  }
	  }
  
	  if (adsFound) {
		  elements[0].innerHTML = '<a id="showHiddenAds" style="cursor:pointer"><u>Показать рекламу</u></a>';
		  document.getElementById('showHiddenAds').onclick = showHiddenAds;
	  } else {
		  elements[0].parentNode.removeChild(elements[0]);
	  }
	}, 500);
	
})();

function showHiddenAds() {
	var element = document.getElementById('showHiddenAds');
	element.parentNode.removeChild(element);

	var results = document.getElementById('search-result').querySelectorAll('.serp-item');
	for (var i=0;i<results.length;i++) {
		results[i].style.display = 'block';
	}
}