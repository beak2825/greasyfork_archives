// ==UserScript==
// @name            tiu_ru_auto_accept
// @description     tiu.ru авто приём заказов
// @version         1.5
// @include         https://my.tiu.ru/cabinet/order_v2*
// @author          Ilia Zykin
// @namespace       https://greasyfork.org/users/12821
// @encoding 	    utf-8
// @downloadURL https://update.greasyfork.org/scripts/21728/tiu_ru_auto_accept.user.js
// @updateURL https://update.greasyfork.org/scripts/21728/tiu_ru_auto_accept.meta.js
// ==/UserScript==

(function() {
// window.onload = function() {
// 	var r_bad_phone = new RegExp('(\\+7|8)(9217407474|9183256389)','i');
// 	if (r_bad_phone.test(document.getElementsByClassName('h-ml-10')[0].getElementsByClassName('h-mt-4')[0].innerHTML)) {
// 		console.log('Нет такого номера');
// 	}
// };
	window.s = false;
    //Выполняем через 0.5 сек после загрузки страницы. Для подгрузки ajax-контента
    setTimeout(function() {
        accept();// Принимаем заявку (если имеется);
    }, 500);

    //Повторяем раз в 10 секунд, вдруг человек не вошёл на страницу "Новые"
    setInterval(function() {
		console.log(window.s);
		if (window.s == false) {
       		accept();// Принимаем заявку (если имеется);
		}
    }, 10000);
})();

//Приём имеющейся заявки
function accept() {
	var r_spam_ban = new RegExp('<h1>Защита от роботов<\\/h1>','i');
	var r_bad_phone = new RegExp('(\\+7|8)(9217407474|9183256389)','i');

    if (window.location == 'https://my.tiu.ru/cabinet/order_v2#novyj') {
        if (document.getElementsByClassName('b-drop-down__list h-width-120 h-break-word js-dropdown')[0] != null) {
            var content_block = document.getElementsByClassName('b-drop-down__list h-width-120 h-break-word js-dropdown')[0];

            if (content_block.getElementsByClassName('b-drop-down__list-item js-item')[0] != null) {
				if (!r_bad_phone.test(document.getElementsByClassName('h-ml-10')[0].getElementsByClassName('h-mt-4')[0].innerHTML)) {
					content_block.getElementsByClassName('b-drop-down__list-item js-item')[0].click();
				}
            } else console.log('Кнопка принять не существует');

			setTimeout(function() {location.reload();}, 300);
        } else if (r_spam_ban.test(document.body.innerHTML)) {
			window.s = true;
			//Повторяем раз в минуту сигнал, если страница остановлена антиботом
			setInterval(function() {
				var signal = new Audio();
				signal.src = 'http://www.flashkit.com/imagesvr_ce/flashkit/soundfx/Interfaces/Beeps/Electro_-S_Bainbr-7955/Electro_-S_Bainbr-7955_hifi.mp3';
				signal.play();
			}, 30000);
		} else {
			console.log('Блок-родитель не существует');
			setTimeout(function() {location.reload();}, 300);
		}
    } else console.log('Не на странице #novyj');
}