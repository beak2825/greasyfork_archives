// ==UserScript==
// @name           Virtonomica: форум без значков
// @version        1.00
// @namespace      virtonomica_clean_forum
// @description    Небольшая визуальная очистка форума
// @include        http*://*virtonomic*.*/*/forum/forum_new/*/topic/*/view*
// @downloadURL https://update.greasyfork.org/scripts/369491/Virtonomica%3A%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20%D0%B1%D0%B5%D0%B7%20%D0%B7%D0%BD%D0%B0%D1%87%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/369491/Virtonomica%3A%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20%D0%B1%D0%B5%D0%B7%20%D0%B7%D0%BD%D0%B0%D1%87%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
	$('.forum_message_userinfo').each(function() { //в этой строке ищутся все элементы с классом forum_message_userinfo. По коду страницы легко можно определить, что именно с этим классом связаны все награды и подарки.
		$('noindex > div', this).remove(); //Далее по коду видно, что внутри этого класса, в элементе noindex и находятся сами награды, разбитые на множество элементов div. Поэтому мы просто берём и удаляем их методом remove()
	});
})(unsafeWindow);