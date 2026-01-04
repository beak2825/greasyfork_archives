// ==UserScript==
// @name        AliExpress Improve
// @description Разные мелкие улучшения AliExpress: подсчёт общей цены, возвращение breadcrumb на верх
// @version     1.9.4
// @author      BaNru
// @run-at      document-end
// @include     https://*.aliexpress.com/*
// @match       https://*.aliexpress.com/*
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/374664
// @downloadURL https://update.greasyfork.org/scripts/390388/AliExpress%20Improve.user.js
// @updateURL https://update.greasyfork.org/scripts/390388/AliExpress%20Improve.meta.js
// ==/UserScript==


// Глобавльная переменная URLSearchParams
var url = new URLSearchParams(document.location.search);


/* Страница товара */
if(~document.location.href.indexOf('/item/')){


// Регулярка получения цен из строки
var REGEXP = new RegExp(/[\d\s]+(?:\.|,)\d+/),
	REGEXP2 = new RegExp(/\d+/),
	TOTALPRICE = 0;

// Вытаскиваем цены из строки и преобразуем в числа
function normaliseInt(str){
	return parseFloat(
		( str.match(REGEXP) && str.match(REGEXP)[0] || str.match(REGEXP2) && str.match(REGEXP2)[0] || 0	).replace(/\s/,'').replace(',', '.')
	);
}

// Основная функция подсчёта
function RunTotalPrise() {

	// Основная цена
	var price = document.querySelector('.product-price-value[itemprop="price"]');
	if (price && (price.textContent.match(REGEXP) || price.textContent.match(REGEXP2))) {
		price = normaliseInt(price.textContent);
	} else {
		price = 0;
	}

	// Доставка
	var shippingPrice = document.querySelector('.product-shipping-price .bold');
	if (shippingPrice && (shippingPrice.textContent.match(REGEXP) || shippingPrice.textContent.match(REGEXP2))) {
		shippingPrice = normaliseInt(shippingPrice.textContent);
	} else {
		shippingPrice = 0;
	}

	// Высчитываем
	if (price) {
		var INPUT_ = document.querySelector('.product-number-picker input').value;
		if (shippingPrice) {
			return (price * INPUT_ + shippingPrice).toFixed(2);
		} else {
			return (price * INPUT_).toFixed(2);
		}
	}
	return 0;
}

// Функция вывода цен на страницу
function ReloadTotalPrise() {
	TOTALPRICE = RunTotalPrise();
	document.querySelector('.USER_totalPrice').textContent = 'Общая сумма: ' + TOTALPRICE;
}

// Отрисовываем блок для вывода цены и кнопку "Пересчитать"
document.querySelector('.product-action').insertAdjacentHTML('beforebegin',
	'<span class="USER_totalPrice" style="color:#FF4747;font:bold 1.2em/2em serif;padding-right:20px;">Общая сумма: ' + RunTotalPrise() + '</span><span class="USER_RunTotalPrice" style="background:#FF4747;color:#FFF;cursor:pointer;padding:2px 10px;">Пересчитать</span>');
// Создаём блок для подсчёта за единицу
document.querySelector('.product-sku').insertAdjacentHTML('afterend','<small class="USER_SiglePrice" style="top:-6px;position:relative;"></small>');


// Клик по кнопки "Пересчитать"
document.querySelector('.USER_RunTotalPrice').addEventListener('click', ReloadTotalPrise);
// Инициализация скрипта подсчёта при выборе характеристик товара и количества
// Отслеживание изменения доставки пользователем не предусмотрено
document.querySelectorAll('.product-quantity button,.sku-property-item').forEach(item => {
	item.addEventListener('click', e=>{
		setTimeout(()=>{
			ReloadTotalPrise();
			// Подсчёт за единицу. Пока оставим тут.
			if(e.target.textContent.match(REGEXP2)){
				document.querySelector('.USER_SiglePrice').textContent = parseFloat( TOTALPRICE / e.target.textContent.match(REGEXP2)[0] ).toFixed(2);
			}
		}, 500); // Увеличить цифру 2+ раза, если не будет успевать считать
	});
});


// Возавращение breadcrumb (хлебные крошек, категорий) в верх страницы
var breadcrumb = document.querySelector('.breadcrumb'),
	productMain = document.querySelector('.product-main');
if(breadcrumb && productMain){
	productMain.insertAdjacentHTML('afterbegin', '<style>.breadcrumb_ {text-align: center; margin: -15px 0 15px;}.breadcrumb_ a {padding: 0 5px;color:#666;font-size:0.8em;} .breadcrumb_ a:hover {color:#ff4747}</style><div class="breadcrumb_"></div>');
	var breadcrumb_ = document.querySelector('.breadcrumb_');
	breadcrumb.querySelectorAll('a').forEach( function(element) {
	let el = element.cloneNode(true);
		breadcrumb_.append(el);
	});
}


// Показать оригинальное (на английском) название
// ?isOrigTitle=true
if(!document.querySelector('.product-title-switch')){
	url.set("isOrigTitle", "true");
	// Отрисовываем ссылку переключения
	document.querySelector('.product-title').insertAdjacentHTML('afterend','<div class="product-title-switch"><a href="'+ window.location.pathname + '?' + url.toString() +'"><svg class="svg-icon m product-title-icon" aria-hidden="true"><use xlink:href="#icon-translate"></use></svg>Посмотреть оригинальное название</a></div>');
}


}
/* / Страница товара */


// Дополнительный поиск
var breadcrumb_search = document.querySelector('.product-container .nav-breadcrumb');
if (breadcrumb_search) {
	breadcrumb_search.insertAdjacentHTML('afterend', '<div class="next-input next-small""><input placeholder="Дополнить" autocomplete="off" value="" class="AEsearch"></div>')
	var AEsearch = document.querySelector('.AEsearch');
	AEsearch.addEventListener('keyup', e => {
		if (e.keyCode == 13) {
			let oldS = url.get("SearchText");
			oldS = oldS ? oldS + "+" : "";
			url.delete("SearchText");
			var u = window.location.pathname;
			if (~document.location.href.indexOf('w/wholesale')) {
				oldS = u.replace('/w/wholesale-', '').replace('.html', '') + '+';
				u = '/wholesale';
			}
			url.set("SearchText", oldS + e.target.value);
			window.location.href = u + '?' + url.toString();
		}
	})
}


// Переключение на старый дизайн
var navtop = document.querySelector('#nav-global');
url.delete("switch_new_app");
url.set("switch_new_app", 'n');
navtop.insertAdjacentHTML('afterbegin', `<style>
.ng-item-wrap.oldD a {
	background: #ff4747;
	color:#fff;
	margin: 0px 5px;
	display: inline-block;
	padding: 0 10px;
	font-weight: bold;
}
.ng-item-wrap.oldD a:hover {
	background: #a63c24;
	color:#fff;
}
</style>
<div class="ng-item-wrap oldD"><div class="ng-item"><a href="${window.location.pathname}?${url.toString()}">&#8822; старый дизайна</a></div></div>
`);


// Скрытие надоедливой Евы
document.querySelector('body').insertAdjacentHTML('afterend', `<style>
#J_xiaomi_dialog {visibility: hidden;bottom: 20px!important;}
#J_xiaomi_dialog .J_weak, #J_xiaomi_dialog .J_weak:hover {
	width: auto;
	height: auto;
	background: transparent;
	box-shadow: none;
}
#J_xiaomi_dialog .J_weak .alime-avatar {
	width: 32px !important;
	height: auto;
	opacity: 0.5;
	transition: all;
	position:relative;
	top:0;
}
#J_xiaomi_dialog .J_weak .alime-avatar:hover {
	opacity: 1;
}
#J_xiaomi_dialog .J_weak .alime-text {
	display:none;
}
</style>`);
window.onload = function() {
	var eva = document.querySelector('#J_xiaomi_dialog');
	if (eva) {
		var eva2 = eva.querySelector('.close-icon');
		if (eva2) {
			eva2.click();
			setTimeout(() => { eva.style.visibility = "visible"; }, 2000);
		}
	}
}


/* Отключение aotoplay у карусели при добавление в корзину */
/* Спасибо за помощь Джентльменам */
/*
	НЕ РАБОТАЕТ в Greasemonkey! Он не хочет читать Object.key у элемента.
	Проверена работа в Tampermonkey
*/
function stopSlider() {
	var tI = 0;
	var timerCard = setInterval(() => {
		tI > 20 ? clearInterval(timerCard) : tI++; // Останавливаем таймер, если элемент не найден в течение 10 секунд
		// console.log('Ищем слайдер');
		if (document.querySelector('.next-slick')) {
			setTimeout(()=>{
				document.querySelector('.next-slick')[Object.keys(document.querySelector('.next-slick'))[0]].alternate.memoizedProps.children.props.autoplay = false;
			}, 500); // Хак на дни распродаж. Если не поможет, то увеличить в x2-x4 раза и на медленных компьютерах
			clearInterval(timerCard);
		}
	}, 500);
}
document.querySelector('.product-action').addEventListener('click', (e) => {
	if (e.target.classList.contains('addcart')) {
		if (document.querySelector('.product-action .addcart-wrap:not([aria-expanded]) button')) {
			stopSlider();
		}
	}
	if (e.target.closest('.add-wishlist-wrap')) {
		stopSlider();
	}
});


// Номера треков на странице заказов
// Генерация цветов (на входе 0-255 - яркость цвета)
function randomColor(brightness) {
	function randomChannel(brightness) {
		var r = 255 - brightness;
		var n = 0 | ((Math.random() * r) + brightness);
		var s = n.toString(16);
		return (s.length == 1) ? '0' + s : s;
	}
	return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}
// Удаление дубликатов в массиве (треков)
function removeDublicate(tracknumber) {
	return tracknumber.filter((v, i) => tracknumber.indexOf(v) === i);
}
// Получение тректов
function gettrack(el, ordernumber, refresh) {
	return new Promise((resolve, reject) => {
		var inLS = localStorage.getItem(ordernumber);
		if (inLS && !refresh) {
			console.log('local', JSON.parse(inLS));
			return resolve([el, JSON.parse(inLS)]);
		}
		GM_xmlhttpRequest({
			method: "GET",
			url: 'https://track.aliexpress.com/logisticsdetail.htm?tradeId=' + ordernumber,
			withCredentials: true,
			onload: response => {
				var tracknumber = [];
				if (/"logisticsNo":"(.*?)"/.exec(response.responseText)) {
					tracknumber.push(/"logisticsNo":"(.*?)"/.exec(response.responseText)[1]);
				}
				if (/"interMailNo":"(.*?)"/.exec(response.responseText)) {
					tracknumber.push(/"interMailNo":"(.*?)"/.exec(response.responseText)[1]);
				}
				if (/"lgOrderCode":"(.*?)"/.exec(response.responseText)) {
					tracknumber.push(/"lgOrderCode":"(.*?)"/.exec(response.responseText)[1]);
				}
				if (/"realMailNo":"(.*?)"/.exec(response.responseText)) {
					tracknumber.push(/"realMailNo":"(.*?)"/.exec(response.responseText)[1]);
				}
				if (/"mailNo":"(.*?)"/.exec(response.responseText)) {
					tracknumber.push(/"mailNo":"(.*?)"/.exec(response.responseText)[1]);
				}
				if (tracknumber.length > 0) {
					tracknumber = removeDublicate(tracknumber);
					localStorage.setItem(ordernumber, JSON.stringify(tracknumber));
					return resolve([el, tracknumber]);
				} else {
					return resolve([el, []]);
				}
			},
			onerror: error => {
				console.log(error);
				return reject('Ошибка получения страницы отслеживания');
			}
		});

	});
}
// Вставка треков на страницу (с поиском и подсветкой дублей/консолидированных)
function insertTrack(el, track) {
	var thisBTN = el.closest('.order-item-wraper').querySelector('.order-action button');
	track.forEach(c => {
		var color = 'transparent';
		document.querySelectorAll('.inproveTrack').forEach(ie => {
			if (ie.textContent == c) {
				if(color == 'transparent'){color = randomColor(160);}
				ie.style.backgroundColor = color;
			}
		});
		thisBTN.insertAdjacentHTML('afterend', `
<a class="inproveTrack" href="https://gdeposylka.ru/${c}" target="_blank" style="background:${color};">${c}</a>
`);
	});
	var trackrefresh = document.createElement('span');
	trackrefresh.className = 'trackrefresh';
	trackrefresh.textContent = '↺';
	trackrefresh.addEventListener('click', () => {
		el.closest('.order-item-wraper').querySelectorAll('.inproveTrack, .trackrefresh').forEach(r => {
			r.remove();
		});
		gettrack(el, el.textContent.trim(), true).then(e => {
			insertTrack(e[0], e[1]);
		});
	});
	thisBTN.parentNode.insertBefore(trackrefresh, thisBTN.nextSibling);
}
// Запуск скрипта отображения треков
if (~document.location.href.indexOf('orderList.htm')) {
	document.querySelector('body').insertAdjacentHTML('afterend', `<style>
		.inproveTrack {
			font-size: .8em;
			display: inline-block;
			position: relative;top: -6px;
			padding: 1px 5px 2px;
		}
		.trackrefresh {
			float: right;
			font-size: 1.3em;
			cursor: pointer;
			margin-top: -7px;
		}
		.trackrefresh:hover {
			color:#f60;
		}
		</style>`);
	var ordernumbers = [];
	document.querySelectorAll('.order-info .first-row .info-body').forEach(el => {
		//localStorage.clear();
		ordernumbers.push(
			gettrack(el, el.textContent.trim())
			.then(r => {
				return r;
			}).catch(e => {
				return e;
			})
		);
	});
	Promise.all(ordernumbers).then(t => {
		t.forEach(e => {
			if (e[0] && e[1]) {
				insertTrack(e[0], e[1]);
			}
		});
	}, e => {
		console.log(e);
	});
}


/*
 * CHANGELOG
 * 1.0   - Первая версия
 * 1.0.1 - Добавил поддержку разных валют. Были только доллары.
 * 1.1   - Переименовал в AliExpress Improve
 *       - Добавил навигацию по категориям (скопировал с низу в верх)
 * 1.2   - Исправлена ошибка получения цен: теперь извлекаются цены с отбивкой тысячных пробелом "$1 000" или "1 000 рублей"
 * 1.2.1 - Исправлена ошибка получения цен: теперь извлекаются целые цены "$2" или "100 руб."
 * 1.2.2 - Исправлена ошибка получения объекта: TypeError: price/shippingPrice is null
 * 1.3.0 - Добавлен подсчёт цены за единицу товара, если есть возможность выбирать количество товара
 * 1.4.0 - Добавлена ссылка переключения на оригинальный заголовок
 * 1.4.1 - Обновлено получение цены доставки. Теперь снова суммируется.
 * 1.5.0 - Попытка восстановить дополнительный поиск
 * 1.6.0 - Переключение на старый дизайн (переключает не на всех страницах)
 * 1.7.0 - Скрытие надоедливой Евы
 * 1.8.0 - Отключение aotoplay у карусели при добавление в корзину
 * 1.8.1 - Отключение aotoplay у карусели при добавление в избранное
 * 1.9.0 - Добавлены номера треков на странице заказов с ссылкой на гдепосылка
 * 1.9.1 - Удалён дубль кода
 * 1.9.2 - Заменена функция генерации цветов для подсветки консолидированных заказов
 * 1.9.3 - Добавлен хак на остановку карусели во время распродаж
 * 1.9.4 - Исправлены цвета для консолидированных посылок. Теперь все одинаковые треки одного цвета.
 */