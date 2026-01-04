// ==UserScript==
// @name         lzt coin 1
// @namespace    lzt coin 2
// @version      2.2
// @description  lzt coin 3
// @author       lzt
// @match        https://lolzteam.net/*
// @downloadURL https://update.greasyfork.org/scripts/381385/lzt%20coin%201.user.js
// @updateURL https://update.greasyfork.org/scripts/381385/lzt%20coin%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

	setInterval(function(){
  		$(".discussionListItem--Wrapper").each(function() {
	    	var text = $(this).text().toLowerCase();

	    	if (text.indexOf("vk coin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("коины") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("койнов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("койнов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("коинов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("vk pay coins") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("vkcoin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("vkpaycoins") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("койны") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("coin-в") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("коинсы") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("vk koin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("koin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("koin vk") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("coin vk") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("коинты") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("коинты") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("сoin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("coin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("2.3кк продаю не дорого") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("суицид") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("убили") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("умер") !== -1) {
	    		$(this).remove();
	    	}

	    	if (text.indexOf("1кк - 45 рублей") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("1кк=30р") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("коин") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("коин") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("c o i n") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("стиллер") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("схема") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("халява без депозита") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("pphud") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("bomber") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("gtfobae") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("nvidia bundle") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("автореги") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("bundle nvidia") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("криптокомбайн") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("wish") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("стилер") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("стиллер") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("старлей") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("глазики") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача лайков") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("снюлс") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("самоцветы ") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("разбирайте почты") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача кейсов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздаю кейсы") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов танки онлайн") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("говно кейсы ") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача вещей кс") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача стима") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("идентификации кошельков qiwi") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("raza4a steam Аккаунтов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздаю steam ключи под личный") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("где получить дедик бесплатно") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("бот для ytmonster") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("где взять бота для пиксель батла") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("дам акки вк / инста") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("[psn]") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("pаздача wf") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов стим") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("все топ сайты с халявай") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("халява, рулетка в беседе в вк") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача топовых аккаунтов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("Раздача рандом акков ") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("Раздача @yandex.ru") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов.") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача реф акков и акков с баллансом") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача стим аккаунтов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("Раздача аккаунтов origin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача warface") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов league") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача авторегов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача ключей") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("новый telegram бот для заработка") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("промокоды яндекс денег под хайд") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("дешёвые,бесплатные игры") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("1-50$ за регистрацию / вывод моментальный / верификация не нужна") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("14+|450 рублей (легкие деньги)") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("удаленный доступ к смартфону жертвы") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача вещей в стим! халява") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("закину номер в бомбер") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("[twitch] аккаунты с фолловерами") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздаю warface") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("warface 115 аккаунтов без бана[бесплатно]") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("[раздача] steam|cs:go|бесплатно 50 аккаунтов|") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача steam keys бесплатно!") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("оригин аккаунты!игры! чекер") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("50 деревянных на маркет") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("аккаунты battle.net раздача") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача steam пустышек") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("пустые с выслугой лет :з (брут еси шо)") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов wildberries и ozon.") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача nordvpn") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздам аккаунты облака 100гб") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("vegas - деанон местного бога или как я полюбил tenderlybae.") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаутов от игры года warface.") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("ключи kaspersky") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача blizzard") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов вк (авторег ру!)") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздам premium") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача twitch") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача pornhub") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов фортнайт") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("raza4a steam аккаунтов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("бот телеграмм 4 слова") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("не большая раздача аккантов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("warface раздача") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздам аккаунты стим") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("небольшой заработок для бичей") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("бесплатный steam фон/смайлик") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача мусора стим") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача по 30-100 просмотров на записи") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздам по 1 рандом шмотке") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("накрутка лайков") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("free| быстрые 50-100 глазиков на запись") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("пятнацадь тысяч шесот трицать одна аватарка") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача подарков вконтакте") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("подниму ваше видео в топ instagram") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("бесплатная накрутка") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("поставлю всем по 25+ лайков") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов origin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("[steam] раздача предметов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача аккаунтов warface") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача origin") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("поднимаем скины dota 2") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("халявные 8$") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздам фоны и скидки") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("от 6$ за регу и приложение") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача акков стим autoreg") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("аккаунты стим и почты") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("вещи со стима") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("накручу 10к") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("бесплатный подарок") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача steam") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("бесплатная активация windows") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("рулетка и аукцион") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("конкурс 15000 рублей") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("бесплатно (вместо 6,5к)") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("накину 100 лайкосов") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("[жирный]") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("большая раздача steam") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача steam") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("раздача кейсиков") !== -1) {
	    		$(this).remove();
	    	}
	    	if (text.indexOf("халява на сайте") !== -1) {
	    		$(this).remove();
	    	}

		});
	}, 100);
})();