// ==UserScript==
// @name        Быстрое снятие меток
// @author      Gusev
// @description Метки снимаются по двойному клику на них
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/chairs
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Lightbox
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Stiker
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Charge
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Rug
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Dkvu
// @version     0.2
// @grant       none
// @namespace   https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/374110/%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BD%D1%8F%D1%82%D0%B8%D0%B5%20%D0%BC%D0%B5%D1%82%D0%BE%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374110/%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BD%D1%8F%D1%82%D0%B8%D0%B5%20%D0%BC%D0%B5%D1%82%D0%BE%D0%BA.meta.js
// ==/UserScript==
$(document).on('dblclick','.js-tag-label.dkk-tag',function(){
	switch($(this).text()){
		case 'Не подтверждаем 5 дн':
			document.querySelector('input[value="5d"]').parentNode.click();
			break
		case 'Ситимобил':
			document.querySelector('input[value="citymobil"]').parentNode.click();
			break
		case 'Старый брендинг':
			document.querySelector('input[value="oldbrand"]').parentNode.click();
			break
		case 'Поддельное брендирование':
			document.querySelector('input[value="poddelnoe_brandirovanie"]').parentNode.click();
			break
		case 'Сторонний бренд':
			document.querySelector('input[value="storonniy_brand"]').parentNode.click();
			break
		case 'Бизнес':
			document.querySelector('input[value="business"]').parentNode.click();
			break
		case 'Комфорт+':
			document.querySelector('input[value="comfort_plus"]').parentNode.click();
			break
		case 'Убер':
			document.querySelector('input[value="uber"]').parentNode.click();
			break
		case 'УберСтарт':
			document.querySelector('input[value="uberstart"]').parentNode.click();
			break
		case 'Ультима':
			document.querySelector('input[value="ultima"]').parentNode.click();
			break
		case 'Яндекс':
			document.querySelector('input[value="yandex"]').parentNode.click();
			break
		case 'Эмулятор':
			document.querySelector('input[value="emulator"]').parentNode.click();
			break
		case 'Есть в базе ГИБДД':
			document.querySelector('input[value="est_v_gibdd"]').parentNode.click();
			break
		case 'Есть справка (о нелишении)':
			document.querySelector('input[value="spravka_o_nelishenii"]').parentNode.click();
			break
		case 'Стаж есть':
			document.querySelector('input[value="staj_est"]').parentNode.click();
			break
		case 'Год выпуска ТС':
			document.querySelector('input[value="god_vypuska"]').parentNode.click();
			break
		case 'на кузове есть пыль/загрязнения':
			document.querySelector('input[value="gryaz"]').parentNode.click();
			break
		case 'Магниты':
			document.querySelector('input[value="magnity"]').parentNode.click();
			break
		case 'Не проходит по классификатору':
			document.querySelector('input[value="ne_prohodyat_po_classifikatoru"]').parentNode.click();
			break
		case 'на кузове есть вмятины/повреждения/царапины':
			document.querySelector('input[value="vmyatina"]').parentNode.click();
			break
		case 'в салоне есть мелкие посторонние предметы':
			document.querySelector('input[value="melkie_predmety"]').parentNode.click();
			break
		case 'в салоне есть крупные посторонние предметы':
			document.querySelector('input[value="predmety"]').parentNode.click();
			break
		case 'в салоне есть загрязнения/пятна':
			document.querySelector('input[value="salon_gryaz"]').parentNode.click();
			break
		case 'на сиденьях есть накидки/покрывала':
			document.querySelector('input[value="sidenya"]').parentNode.click();
			break		
		case 'Шашечки на кузове':
			document.querySelector('input[value="checkers_car"]').parentNode.click();
			break	
		case 'Шашечки на крыше':
			document.querySelector('input[value="checkers_roof"]').parentNode.click();
			break	
	};
});