// ==UserScript==
// @name:en      Steam Review Comments enabler
// @name         Включатель коммментариев в отзывах Steam
// @description:en  Automatically checks "enable comments" in your new reviews
// @description  Автоматически ставит ☑ в опции "Разрешить комментарии" при публикации нового отзыва
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.0.0
// @author       Титан
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421184/%D0%92%D0%BA%D0%BB%D1%8E%D1%87%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%B2%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D0%B0%D1%85%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/421184/%D0%92%D0%BA%D0%BB%D1%8E%D1%87%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%B2%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D0%B0%D1%85%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';
	window.onload = function() {
		let comCheck = document.getElementsByClassName("controlblock enable_review_comments")[0].firstElementChild;
		comCheck.click();
	}
})();