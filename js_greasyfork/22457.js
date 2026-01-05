// ==UserScript==
// @name            Remove ad posts from VK.com
// @version         0.7.20200519.1
// @description	    removes ad posts from feed and walls by keywords
// @match           *://*.vk.com/*
// @grant           none
// @author          StSav012
// @namespace       vkap
// @run-at          document-idle
// @homepageURL     https://github.com/StSav012/adblockrules/blob/master/vkadposts.user.js
// @downloadURL https://update.greasyfork.org/scripts/22457/Remove%20ad%20posts%20from%20VKcom.user.js
// @updateURL https://update.greasyfork.org/scripts/22457/Remove%20ad%20posts%20from%20VKcom.meta.js
// ==/UserScript==

"use strict";

var actualCode = '(' + function() {
	"use strict";
	var keywords = [
		"Партнёрский пост.", "#партн(е|ё)рскийпост", "#партн(е|ё)рский<\/a> пост",
		"РЕПОСТ", "REPOST",
		"д(е|e)л(а|a)ть (|\")(р|p)(е|e)п(о|o)(с|c)т(|\")", "д(е|e)л(а|a)й(т|)(е|e|) (|\")(р|p)(е|e)п(о|o)(с|c)т(|\")",
		"делавшему (|\")(р|p)(е|e)п(о|o)(с|c)т(|\")", "(Р|р|P|p)(е|e)п(о|o)(с|c)т( этой| данной| этoй) з(а|a)пи(с|c)и",
		"(Р|р)епостни( эту|данную|) запись",
		"(П|п)одели(ться|сь)(| этой|этим) (записью|сообщением)",
		"(р|p)(е|e)п(о|o)(с|c)тни этот пост",
		"(а|a)йк(и|)( и|,) (р|p)(е|e)п(о|o)(с|c)т(ы|)",
		"(З|з)абирай(|те)(| себе) на стену", "(С|с)охрани(|ть|те)(| себе) (на стену|этот пост)",
		"(З|з)акрепить( эту запись| ее| её)( у себя|) на стене",
		"озыгрыш по репосту", "репоснет эту запись", "за репост даем", "бонус за репост",
		"ВСТУПАЙ(ТЕ|)", "ВСТУПИТЕ", "(В|в)ступ(и|ить|аем|ите|айте|ай) в(| нашу| эту) (группу|сообщество)",
		"(В|в)ступай(|те)",
		"БЫТЬ ПОДПИСАННЫМ(|И) НА СООБЩЕСТВО", "(та|ы)ть( нашим|) (подписчиком|участником)",
		"(С|с) (В|в)ас репост и (быть|стать) мои другом",
		"ДОБАВЬ", "ДОБАВЛЯЙТЕ", "(Д|д)обавляй(|ся|тесь)(| ко мне) в друзья",
		"Зайди(|те) поглазеть на эти посты", "Заходи(|те) на раздач(у|и)",
		"ОСТАВЬ(|ТЕ) ЗАЯВКУ", "(О|о)ставь(|те) заявку",
		"Регистрация всего за", "Регистрация пока бесплатна", "Успей зарегистрироваться",
		"ЗАПИШИСЬ НА ",
		"БЕСПЛАТН", "бесплатно дадим", "Получить бесплатн", "бесплатно откроем (В|в)ам",
		"качать бесплатно",
		"ПОДАРОК", "получи свой подарок",
		"СКИДК(А|И|ОК|У|ОЙ|Е)", "Выбирай со скидкой", "с нереальными скидками", "дарим скидку", "Скидки на весь ассортимент",
		"(С|с)делать это со скидкой",
		"За репост скидка",
		"Заказ(атъ|ать|ывайте|ывай) со скидкой",
		"ВЫИГРАЙ", "получи шанс выиграть", "Выигрaй",
		"КОНКУРС", "Внимание! Конкурс!",
		"АКЦИ(Я|И|Ю|ЕЙ)", "Мега-Акция", "Акция до конца", "#акция",
		"РОЗЫГРЫШ", "Ссылка на розыгрыш", "в сообществе проходит супер-розыгрыш", "(У|у)частвуй(те|) в (Р|р)озыгрыше",
		"(Р|р)озыгрыш только для подписчиков",
		"(Т|т)олько (для|среди) (подписч|участн)иков(| нашей| этой| нашего| этого) (группы|сообщества)",
		"обедител(и|ь) буд(у|е)т выбран(ы|) случайным образом",
		"РАСПРОДАЖА", "Последняя распродажа топовых", "Ликвидация склада",
		"Успейте оставить заявку", "Успейте забронировать", "Спешите получить", "Успей сделать заказ",
		"СКОРО ОТКРЫТИЕ",
		"ШОК-ПРЕДЛОЖЕНИЕ",
		"Записывайтесь на бесплатное занятие",
		"ПОДПИШИСЬ", "ПОДПИСЫВАЙСЯ", "(П|п)одпишись", "(П|п)одпишитесь (на|-|\\+) ", "(П|п)одписывай(ся|тесь) (на|-|\\+) ",
		"(П|п)одписывайся", "(П|п)одписываемся!",
		"ыть подписчиком", "ыть подписанным", "(П|п)одписался на", "(П|п)одписаться", "(П|п)одпишись и ты",
		"(П|п)одписаться на (группу|паблик|сообщество)", "(П|п)одписаться на канал можно здесь",
		"(П|п)одписаться \\+", "\\+ Подписаться", "Приглашаем подписаться на",
		"(П|п)одписывай на ", "забывайте подписываться на", "\">Подписывайтесь<\\/",
		"КУПИТЬ", "ЗАКАЖИТЕ", "Заказать можно тут", "(С|с)делайте заказ прямо сейчас",
		"Подарок можно забрать", "Вы сможете забрать ваш подарок", "Быстрая доставка",
		"бизнес-(план|проект)",
		"Читать продолжение ", "Читaйтe пoлнocтью здecь", "Смотреть ответ в источнике",
		"Подробн(ее|ости)( акции|) (здесь|на странице)", "Ты должен видеть это", "Ты должен это видеть", "зна(ть|й|вайте) подробн(ее|ости)",
		"(мотрите|ереходите) по ссылке", "Условия акции можно найти здесь", "смотреть дальше", "больше подробностей внутри",
		"Узнай(|,)( как|)(|,) тут", // ← facepalm
		"Заходи на( наш)? сайт",
		"Центр образовательных технологий Advance",
		"«Как развить свою память» или «Секреты эффективного обучения»",
		"Начни играть тут", "начни играть в", "Играй тут", "Качай игру",
		"NovaPizza.ru", "skypeteach.ru", "english4now.com", "advance-club.ru", "sdelano.ru", "edgarkulikov.ru", "citystarwear.com",
		"befree-school.ru", "bright-shopping.ru", ".sale-gooods.ru", "www.kopikot.ru", ".bebetter.guru", "www.in-build.ru",
		"1media-buyer.ru", "itunes.apple.com%2Fapp%2Fapple-store%2Fid695634432", "sale-stop.ru", "offersboard.ru", "artskills.ru",
		"elementaree.ru", "start-mobile.net", ".hitnsale.ru", "вконкурс.рф", "printbar.ru", "tracking.leaddealer.net", "envylab.ru",
		"job.beeline.ru",
		"newstockgeneration.space", "zarabotays.ru", "zarabotoki.ru", "zarabotokgames.ru", ".advertapp.ru",	// suspicious sites
		"class=\"wall_marked_as_ads\"",	"class=\"pi_signed ads_mark\"",// to avoid ads from groups
		//"ads_promoted_post",	// to avoid promoted posts; reused later
		"app_title_"	// that's to avoid ads from games
	];
	var urls = [
		"/domavern", "/businessstrategy", "/virashopru", "/tri10oe", "/kinona5", "/watson_club", "/brutal_kitchen",
		"/vkchydaku", "/brandclubkiiik", "/princapioff", "/illusthigh", "/chestnoeauto", "/otdamdarom"
	];
	var banned_reposts_from = [         // no reposts by these groups and users are shown
		"/rhymesee"
	];
	var selectors = [
		"div.reply",
		"div.feed_row, div.wall_item, div.post_copy, div.post_fixed, div#page_wall_posts>div.page_block"
	];
	var dom_ad = [	// beware: these rules might break the site
        	"div.wall_item.feedAssistance", "div.feed_friends_recomm",    // to hide friends suggestions (arguable)
		"div.ads_ad_box",
		"div[data-ad-block-uid]",
		"a.story_feed_new_item_promo"
	];
	var divs;	// selected tags list
	function cleanAd() {
		for (let s of selectors) {
			divs = document.querySelectorAll(s);
			for (let d of divs) {				// we check it from the very beginning and to the end
				if (d.getAttribute('no_ad') != 'true') {	// from https://greasyfork.org/ru/scripts/1978-vk-com-no-politic-feed/code
					// does it worth checking the post?
					var eliminated = false;
					for (let w of keywords) {
						var pattern = new RegExp(w);
						if (pattern.test(d.innerHTML)) {
							// d.style.backgroundColor = "red"; // ← for debugging purposes
                            // console.log(d); // ← for debugging purposes
							d.parentNode.removeChild(d);
							eliminated = true;
							break;
						}
					}
					if (!eliminated) {
						for (let u of urls) {
							if (!window.location.pathname.includes(u) && d.innerHTML.includes(u)) {
								// d.style.backgroundColor = "red"; // ← for debugging purposes
                                // console.log(d); // ← for debugging purposes
								d.parentNode.removeChild(d);
								eliminated = true;
								break;
							}
						}
					}
                    if (!eliminated) {
                        for (let br of banned_reposts_from) {
                            if (d.innerHTML.includes("<a class=\"author\" href=\"" + br + "\"") &&
                                d.innerHTML.includes("class=\"copy_quote\"")) {
								// d.style.backgroundColor = "red"; // ← for debugging purposes
                                // console.log(d); // ← for debugging purposes
								d.parentNode.removeChild(d);
								eliminated = true;
								break;
							}
                        }
                    }
					if (!eliminated && d.querySelector("span.wall_copy_more") === null) {
						d.setAttribute('no_ad', 'true');
					}
				}
			}
		}
		for (let a of dom_ad) {
			divs = document.querySelectorAll(a);
			for (let ad of divs) {
				ad.parentNode.removeChild(ad);
			}
		}
	}
	cleanAd();
	// see http://stackoverflow.com/a/14570614
	var observeDOM = (function() {
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
			eventListenerSupported = window.addEventListener;

		return function(obj, callback) {
			if (MutationObserver) {
				// define a new observer
				var obs = new MutationObserver(function(mutations) {
					if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
						callback();
					}
				});
				// have the observer observe foo for changes in children
				obs.observe(obj, {childList: true, subtree: true});
			}
			else if (eventListenerSupported) {
				obj.addEventListener('DOMNodeInserted', callback, false);
				obj.addEventListener('DOMNodeRemoved', callback, false);
			}
		};
	})();
	var containers = document.querySelectorAll('body');
	for (let c of containers) {
		observeDOM(c, cleanAd);
	}
} + ')();';
var script = document.createElement('script');
script.textContent = actualCode;
(document.body||document.documentElement).appendChild(script);
