// ==UserScript==
// @name        Vkontakte - Logo
// @namespace   scriptomatika
// @description Заменяет логотип VK. Влияет на [BadComedian], The Nafig, Hell Yeah
// @include     https://vk.com/*
// @include     http://*ozvs4y3pnu.cmle.ru/*
// @include     http://*ozvs4y3pnu.nblz.ru/*
// @noframes
// @icon        http://static.scriptomatika.ru/stylish/134972/vk-icon.png
// @author      mouse-karaganda
// @version     1.39.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24921/Vkontakte%20-%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/24921/Vkontakte%20-%20Logo.meta.js
// ==/UserScript==

var paramWindow = (typeof unsafeWindow == 'object') ? unsafeWindow : window;

(function(unsafeWindow) {
	var console = unsafeWindow.console;

	var page = {
		/**
		 * Определить, принадлежит ли открытая страница человеку
		 */
		isUser: function(id, alias) {
			var result = false;
			result = result || new RegExp('\\/' + alias + '\\b').test(location.href);
			result = result || new RegExp('\\/\\w+' + id).test(location.href);
			result = result || new RegExp('=' + id + '\\b').test(location.href);
			return result;
		},
		/**
		 * Определить, принадлежит ли открытая страница сообществу
		 */
		isCommunity: function(id, alias) {
			var communityId = '-?' + String(id);
			return this.isUser(communityId, alias);
		},
		/**
		 * Сообщество [BadComedian]
		 */
		isBadComedian: function() {
			return this.isCommunity(25557243, 'badcomedian');
		},
		/**
		 * Евгений Баженов
		 */
		isEvgenComedian: function() {
			return this.isUser(3664185, 'evgencomedian');
		},
		/**
		 * Сообщество TheNafig или Игорь Горбань
		 */
		isNafig: function() {
			var result = false;
			result = result || this.isCommunity(70470762, 'nafignefig');
			result = result || this.isUser(3312714, 'thenafig');
			return result;
		},
		/**
		 * Сообщество Hell Yeah! или Сергей Беляков
		 */
		isHellYeah: function() {
			var result = false;
			result = result || this.isCommunity(29927978, 'hell_yeah_covers');
			result = result || this.isCommunity(35559317, 'hellyeahcovers');
			result = result || this.isCommunity(69934966, 'hellyeahplay');
			result = result || this.isUser(142244404, 'hell_yeah_xd');
			return result;
		}
	};

	var doc = {
		/**
		 * Взять элемент по CSS-селектору
		 */
		get: function(selector) {
			return document.querySelector(selector);
		},
		/**
		 * Взять начальную часть URL открытой страницы,
		 * включая протокол и доменное имя
		 */
		getDomain: function() {
			return location.href.match(/^https?:\/\/.+?\//);
		},
		/**
		 * Отрисовать тег style
		 */
		renderStyle: function() {
			var content = Array.prototype.join.call(arguments, '\n');
		
			var style = document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = content;
			document.body.appendChild(style);
		}
	};

	var logo = {
		/**
		 * CSS-селектор для иконки и логотипа
		 */
		favicon: ('link[rel="shortcut icon"]'),
		topHome: ('.top_home_link .top_home_logo'),
		/**
		 * Стандартный логотип VK
		 */
		defaultIcon: ('images/icons/favicons/fav_logo.ico'),
		/**
		 * Логотип на замену стандартному
		 */
		getSource: function(user, ext) {
			if (typeof ext !== 'string') {
				ext = 'png';
			}
			return ('http://static.scriptomatika.ru/stylish/134972/' + user + '.' + ext);
		},
		/**
		 * CSS-класс по имени пользователя
		 */
		getClass: function(user) {
			var source = (' { ' + this.getRule(user) + ' }');
			return ('body[comedian="' + user + '"] ' + this.topHome + source);
		},
		getRule: function(user, ext) {
			return ('background-image: url(' + this.getSource(user, ext) + ');');
		},
		/**
		 * Установить свой логотип и иконку
		 */
		setIcon: function(user) {
			document.body.setAttribute('comedian', user);

			var favicon = doc.get(this.favicon);
			// Проверим, отображается ли стандартная иконка
			var isDefault = true;
			if (favicon.href.indexOf(doc.getDomain()) === 0) {
				isDefault = /\/fav_logo\.ico/.test(favicon.href);
			}
			if (isDefault) {
				favicon.href = this.getSource(user);
			}
		},
		/**
		 * Убрать свой логотип и иконку и вернуть стандартные
		 */
		deleteIcon: function() {
			document.body.removeAttribute('comedian');

			var favicon = doc.get(this.favicon);
			favicon.href = (doc.getDomain() + this.defaultIcon);
		}
	};

	var background = {
		hellyeah: logo.getRule('hellyeah_bg', 'jpg')
	};

	doc.renderStyle(
		'body[comedian] ' + logo.topHome + ' { width: 28px;  height: 28px; margin-top: 7px; background-position: 0 0; background-size: 100%; border-radius: 15%; }',
		'body[comedian] #page_wrap { background-attachment: fixed; background-size: 100%; }',
		'body[comedian] #side_bar_inner { background-color: #EDEEF0; margin-left: -30px !important; padding-left: 15px; padding-right: 15px; margin-top: calc(42px + 15px) !important; }',
		'body[comedian] #side_bar_inner, body[comedian] #side_bar .left_settings { background-color: #EDEEF0; border-radius: 2px; box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8; }',
		'body[comedian="hellyeah"] #page_wrap { ' + background.hellyeah + ' }',
		logo.getClass('badcomedian'),
		logo.getClass('evgencomedian'),
		logo.getClass('nafig'),
		logo.getClass('hellyeah')
	);

	var title = {
		/**
		 * Добавить в заголовок окна название сообщества
		 * или имя владельца, если открыта стена в отдельной вкладке
		 */
		setWall: function() {
			if (!/\/wall-?\d+/.test(location.href))
				return;

			var owner = doc.get('#wall_rmenu .ui_ownblock_label');
			if (!!owner ) {
				document.title = (owner.innerText + ' | Стена');
			}
		},
		/**
		 * Добавить в заголовок окна имя собеседника,
		 * если открыт диалог
		 */
		setMessenger: function() {
			if (!/\/im\b.+\bsel=/.test(location.href))
				return;

			var peerName = doc.get('.im-page .im-page--peer._im_page_peer_name');
			if (!!peerName ) {
				document.title = (peerName.innerText + ' | Диалоги');
			}
		}
	};

	/**
	 * Определить, какая страница открыта, затем
	 * установить или удалить с неё свой логотип и иконку
	 */
	var changeLogo = function() {
		if (page.isBadComedian()) {
			logo.setIcon('badcomedian');
		} else if (page.isEvgenComedian()) {
			logo.setIcon('evgencomedian');
		} else if (page.isNafig()) {
			logo.setIcon('nafig');
		} else if (page.isHellYeah()) {
			logo.setIcon('hellyeah');
		} else {
			logo.deleteIcon();
		}
		title.setWall();
		title.setMessenger();
	};

	changeLogo();
	unsafeWindow.setInterval(changeLogo, 600);
})(paramWindow);