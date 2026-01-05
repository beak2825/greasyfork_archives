// ==UserScript==
// @name        Панель модератора
// @description Добавляет кнопку, которая вызывает панель модератора(первоапрельская шутка).
// @homepage    https://greasyfork.org/ru/users/36701-6jlokhot
// @version     1.01
// @encoding 	utf-8
// @include     *pikabu.ru/*
// @grant       none
// @namespace https://greasyfork.org/users/36701
// @downloadURL https://update.greasyfork.org/scripts/18447/%D0%9F%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/18447/%D0%9F%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0.meta.js
// ==/UserScript==
(function() {
	"use strict";

	/**
	 * @type {Array.<Sprite>}
	 */
	var renderList = [];

	/**
	 * @type {Array.<Object>}
	 */
	var interrupters = [];

	/**
	 * @type {Object.<Image>}
	 */
	var imgAsset = {};

	/**
	 * @type {number}
	 */
	var lastRenderTime = 0;

	/**
	 * @type {number}
	 */
	var renderFrameDuration = 1000 / 24;

	/**
	 * @type {string}
	 */
	var assetPath = '/images/games/april2016';

	/**
	 * @type {string}
	 */
	var ruLastNames = 'Смирнов,Синкин,Иванов,Кузнецов,Соколов,Попов,Лебедев,Козлов,Новиков,Морозов,Петров,Волков,Соловьёв,Васильев,Зайцев,Павлов,Семёнов,Голубев,Виноградов,Богданов,Воробьёв,Фёдоров,Михайлов,Беляев,Тарасов,Белов,Комаров,Орлов,Киселёв,Макаров,Андреев,Ковалёв,Ильин,Гусев,Титов,Кузьмин,Кудрявцев,Баранов,Куликов,Алексеев,Степанов,Яковлев,Сорокин,Сергеев,Романов,Захаров,Борисов,Королёв,Герасимов,Пономарёв,Григорьев,Лазарев,Медведев,Ершов,Никитин,Соболев,Рябов,Поляков,Цветков,Данилов,Жуков,Фролов,Журавлёв,Николаев,Крылов,Максимов,Сидоров,Осипов,Белоусов,Федотов,Дорофеев,Егоров,Матвеев,Бобров,Дмитриев,Калинин,Анисимов,Петухов,Антонов,Тимофеев,Никифоров,Веселов,Филиппов,Марков,Большаков,Суханов,Миронов,Ширяев,Александров,Коновалов,Шестаков,Казаков,Ефимов,Денисов,Громов,Фомин,Давыдов,Мельников,Щербаков,Блинов,Колесников,Карпов,Афанасьев,Власов,Маслов,Исаков,Тихонов,Аксёнов,Гаврилов,Родионов,Котов,Горбунов,Кудряшов,Быков,Зуев,Третьяков,Савельев,Панов,Рыбаков,Суворов,Абрамов,Воронов,Мухин,Архипов,Трофимов,Мартынов,Емельянов,Горшков,Чернов,Овчинников,Селезнёв,Панфилов,Копылов,Михеев,Галкин,Назаров,Лобанов,Лукин,Беляков,Потапов,Некрасов,Хохлов,Жданов,Наумов,Шилов,Воронцов,Ермаков,Дроздов,Игнатьев,Савин,Логинов,Сафонов,Капустин,Кириллов,Моисеев,Елисеев,Кошелев,Костин,Горбачёв,Орехов,Ефремов,Исаев,Евдокимов,Калашников,Кабанов,Носков,Юдин,Кулагин,Лапин,Прохоров,Нестеров,Харитонов,Агафонов,Муравьёв,Ларионов,Федосеев,Зимин,Пахомов,Шубин,Игнатов,Филатов,Крюков,Рогов,Кулаков,Терентьев,Молчанов,Владимиров,Артемьев,Гурьев,Зиновьев,Гришин,Кононов,Дементьев,Ситников,Симонов,Мишин,Фадеев,Комиссаров,Мамонтов,Носов,Гуляев,Шаров,Устинов,Вишняков,Евсеев,Лаврентьев,Брагин,Константинов,Корнилов,Авдеев,Зыков,Бирюков,Шарапов,Никонов,Щукин,Дьячков,Одинцов,Сазонов,Якушев,Красильников,Гордеев,Самойлов,Князев,Беспалов,Уваров,Шашков,Бобылёв,Доронин,Белозёров,Рожков,Самсонов,Мясников,Лихачёв,Буров,Сысоев,Фомичёв,Русаков,Стрелков,Гущин,Тетерин,Колобов,Субботин,Фокин,Блохин,Селиверстов,Пестов,Кондратьев,Силин,Меркушев,Лыткин,Туров';
	/**
	 * @type {string}
	 */
	var ruFirstNames = 'Аким,*Аксинья,*Алёна,Александр,*Александра,Алексей,*Алина,*Алла,*Анастасия,Анатолий,*Ангелина,Андрей,*Анна,Антон,*Антонина,*Арина,Аркадий,Арсений,Артём,Борис,Борислав,Вадим,Валентин,*Валентина,Валерий,*Валерия,*Варвара,Василий,*Василиса,*Вера,*Вета,Виктор,*Виктория,*Виолетта,Виталий,*Виталия,Влад,Владимир,Владислав,*Владислава,Владлен,Вячеслав,Гавриил,*Галина,Геннадий,Георгий,Герасим,Глеб,Григорий,Даниил,*Дарья,Денис,*Дина,Дмитрий,Евгений,*Евгения,Евдоким,*Евдокия,Егор,*Екатерина,*Елена,*Елизавета,Елисей,Емельян,Еремей,*Есения,Ефим,Захар,*Зинаида,Зиновий,*Зоя,Иван,Игнат,Игорь,Иероним,*Изабелла,Илья,*Инесса,*Инна,Иннокентий,*Иоанна,*Ира,*Ирина,*Карина,Кирилл,Константин,*Кристина,*Ксения,Кузьма,*Лариса,Леонид,*Лера,*Лидия,*Любовь,*Людмила,*Магдалeна,*Майя,Макар,Макарий,Макария,Максим,*Маргарита,*Мария,Мартин,Марфа,Матвей,*Милана,*Милена,Мирослав,Михаил,*Надежда,*Наталья,Никита,Никодим,Николай,*Нина,*Оксана,Олег,*Олеся,*Ольга,Иосиф,Остап,Пётр,Павел,*Полина,Потап,Прохор,Радослав,*Рената,Ренат,Родион,Роман,Ростислав,Руслан,*Светлана,Святослав,Семён,*Серафима,Сергей,Сидор,*Соня,*Софья,Станислав,Степан,Тарас,*Татьяна,Тимофей,Тихон,Трофим,*Ульяна,Фёдор,Федот,Филипп,Фома,*Юлия,Юрий,Яков,Яна,Ярослав';

	/**
	 * @type {string}
	 */
	var cities1 = 'Минск,Киев,Москва,Санкт-Петербург,Новосибирск,Екатеринбург,Нижний Новгород,Казань,Челябинск,Омск,Самара,Ростов-на-Дону';
	/**
	 * @type {string}
	 */
	var cities2 = 'Гродно,Вильнюс,Гомель,Орша,Брест,Витебск,Могилев,Уфа,Красноярск,Пермь,Воронеж,Волгоград,Саратов,Краснодар,Тольятти,Тюмень,Ижевск,Барнаул,Иркутск,Ульяновск,Хабаровск,Владивосток,Ярославль,Махачкала,Томск,Оренбург,Новокузнецк,Кемерово,Рязань,Астрахань,Набережные Челны,Пенза,Липецк,Киров,Тула,Чебоксары,Калининград,Курск,Улан-Удэ,Ставрополь,Магнитогорск,Тверь,Иваново,Брянск,Севастополь,Сочи,Белгород,Нижний Тагил,Владимир,Архангельск,Калуга,Сургут,Чита,Симферополь,Смоленск,Волжский,Курган,Орёл,Череповец,Вологда,Владикавказ,Мурманск,Саранск,Якутск,Тамбов,Грозный,Стерлитамак,Кострома,Петрозаводск,Нижневартовск,Йошкар-Ола,Новороссийск,Балашиха[16],Комсомольск-на-Амуре,Таганрог,Сыктывкар,Нальчик,Шахты,Братск,Нижнекамск,Дзержинск,Орск,Химки,Ангарск,Благовещенск,Подольск,Великий Новгород,Энгельс,Старый Оскол,Королёв,Псков,Бийск,Прокопьевск,Балаково,Рыбинск,Южно-Сахалинск,Армавир,Люберцы,Мытищи,Северодвинск,Петропавловск-Камчатский,Норильск,Абакан,Сызрань,Новочеркасск,Каменск-Уральский,Волгодонск,Златоуст,Уссурийск,Электросталь,Находка,Салават,Железнодорожный,Миасс,Альметьевск,Березники,Керчь,Рубцовск,Пятигорск,Копейск,Коломна,Майкоп,Одинцово,Ковров,Красногорск,Хасавюрт,Кисловодск,Новомосковск,Серпухов,Первоуральск,Нефтеюганск,Нефтекамск,Новочебоксарск,Черкесск,Дербент,Орехово-Зуево,Батайск,Щёлково,Невинномысск,Димитровград,Новый Уренгой,Кызыл,Камышин,Октябрьский,Домодедово,Муром,Обнинск,Назрань,Новошахтинск,Северск,Пушкино,Жуковский,Каспийск,Ноябрьск,Раменское,Евпатория,Ачинск,Сергиев Посад,Елец,Новокуйбышевск,Арзамас,Элиста,Ессентуки,Артём,Бердск,Ногинск';

	/**
	 * @type {Function}
	 */
	var requestAnimFrame = (function(){
		return window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function (callback){
				window.setTimeout(callback, renderFrameDuration);
			};
	})();

	/**
	 * @constructor
	 */
	function Main() {
		var inst = this;
		this._elems = {};
		this._arrowValues = {};
		this._closedStories = {};
		this._textLines = [];
		this._textPull = [];
		this._renderBound = function() {
			inst._render();
		};
		this._loadAssets([
			'blow.png',
			'blow2.png',
			'blow3.png',
			'walls.png',
			'mtboard.png',
			'arrow.png',
			'button1.png',
			'b2.gif',
			'stars.png'
		]);
		document.addEventListener('DOMContentLoaded', function() {
			inst._updateStories();
			if (window.localStorage) {
				if (window.localStorage.getItem('a1msg') != 'y') {
					var $msg;
					$('body').prepend(
						$msg = $('<div>')
							.append(
								$('<i class="fa fa-shield"></i>').css({
									'font-size': '40px',
									'float': 'left',
									'display': 'inline-block',
									'color': '#67bb58',
									'width': '40px'
								})
							)
							.append(
								$('<i class="fa fa-close"></i>').css({
									'font-size': '20px',
									'float': 'right',
									'display': 'inline-block',
									'color': '#888',
									'width': '40px',
									'text-align': 'right',
									'cursor': 'pointer'
								}).click(function() {
									$msg.slideUp();
									window.localStorage.setItem('a1msg', 'y');
								})
							)
							.append('<b>Поздравляем!</b> Путем сложнейшего расчета наша автоматизированная система поиска новых модераторов выделила Вас среди всех претендентов! Вам выданы права модератора ленты постов и персональное устройство модерирования. Успехов Вам в этом нелегком деле!')
							.css({
								'position': 'relative',
								'padding': '10px 20px',
								'font': '14px/18px Arial, Helvetica, Tahoma, Verdana',
								'background-color': '#f4f2b0',
								'border-bottom': '3px solid #67bb58',
								'color': '#444',
								'z-index': 100000
							}).slideDown()
					);
				}
			}
		});
		setInterval(function() {
			inst._updateStories();
		}, 1000);
	}

	Main.prototype = {

		/**
		 * @private
		 * @type {boolean}
		 */
		_isAssetLoaded: false,

		/**
		 * @private
		 * @type {Function}
		 */
		_renderBound: null,

		/**
		 * @private
		 * @type {Object.<HTMLElement>}
		 */
		_elems: null,

		/**
		 * @private
		 * @type {Object.<number>}
		 */
		_arrowValues: null,

		/**
		 * @private
		 * @type {number}
		 */
		_arrowsAnimWait: 4,

		/**
		 * @private
		 * @type {Array.<String>}
		 */
		_textLines: null,

		/**
		 * @private
		 * @type {Array.<String>}
		 */
		_textPull: null,

		/**
		 * @private
		 * @type {number}
		 */
		_storyID: 0,

		/**
		 * @private
		 * @type {number}
		 */
		_timerID: null,

		/**
		 * @private
		 * @type {boolean}
		 */
		_active: false,

		/**
		 * @private
		 * @type {Object}
		 */
		_closedStories: null,

		/**
		 * @private
		 * @param {Array.<string>} files
		 * @returns {void}
		 */
		_loadAssets: function(files) {
			var img, timerID = null, inst = this;
			imgAsset = {};
			this._isAssetLoaded = false;
			var check = function() {
				/** @type {Image} */
				var img;
				for (var fileName in imgAsset) {
					//noinspection JSUnfilteredForInLoop
					img = imgAsset[fileName];
					if (!img.complete) {
						clearTimeout(timerID);
						timerID = setTimeout(check, 100);
						return;
					}
				}
				// all images loaded
				if (!inst._isAssetLoaded) {
					inst._isAssetLoaded = true;
					inst._onReady();
				}
			};
			for (var a = 0, l = files.length; a < l; a++) {
				img = new Image();
				imgAsset[files[a].match(/(^|\/)([a-z0-9_\-.]+)$/i)[2]] = img;
				img.onload = check;
				img.src = assetPath + '/' + files[a];
			}
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_updateStories: function() {
			var inst = this;
			$('div.story:not([data-fmt])').each(function() {
				var $this = $(this);
				var storyID = $this.attr('data-story-id');
				$this.attr('data-fmt', 'y');
				$this.find('.story__header-title a.story__title-link').parent().append(
					$('<a data-role="funny-moder" href="javascript: void(0)"><i class="fa fa-shield" style="vertical-align: middle"></i> промодерировать</a>')
						.on('mouseover mouseout', function(e) {
							$(this).css({
								'text-decoration': e.type == 'mouseover' ? 'underline' : 'none',
								'color': e.type == 'mouseover' ? 'red' : '#777'
							});
						})
						.click(function() {
							inst.show(Number(storyID));
						})
						.css({
							'display': 'inline-block',
							'margin-left': '20px',
							'cursor': 'pointer',
							'color': '#777',
							'text-decoration': 'none',
							'vertical-align': 'middle',
							'font-size': '13px',
							'transition': 'color 0.2s ease-out'
						})
						.fadeIn()
				);
			});
		},

		/**
		 * @public
		 * @param {number} storyID
		 * @returns {void}
		 */
		show: function(storyID) {
			if (this._closedStories[storyID]) {
				return;
			}
			if (this._storyID == storyID) {
				this.hide();
				return;
			}
			if (this._storyID != 0) {
				this._storyID = storyID;
				this._initBoard(true);
			} else {
				this._storyID = storyID;
				this._buildBoard();
			}
			var $wnd = $(window), inst = this,
				initScrollY = $wnd.scrollTop();

			$wnd.on('scroll.fmt', function() {
				if (Math.abs($wnd.scrollTop() - initScrollY) > 200) {
					inst.hide();
				}
			});
		},

		/**
		 * @public
		 * @returns {void}
		 */
		hide: function() {
			this._hideBoard();
			this._storyID = 0;
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_onReady: function() {
			this._render();
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_render: function() {
			var time = (new Date()).getTime();
			if (time - lastRenderTime >= renderFrameDuration) {
				lastRenderTime = time;
				var a, l, list;
				if (interrupters.length > 0) {
					list = interrupters.slice();
					interrupters = [];
					for (a = 0, l = list.length; a < l; a++) {
						list[a].interrupt();
					}
				}
				this._animateArrows();
				if (renderList.length > 0) {
					list = renderList.slice();
					for (a = 0, l = list.length; a < l; a++) {
						list[a].render();
					}
				}
			}
			if (this._textPull.length > 0) {
				this._insertTextLine(this._textPull.shift());
			}
			requestAnimFrame(this._renderBound);
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_explodeStory: function() {
			if (this._closedStories[this._storyID]) {
				return;
			}
			var inst = this, storyID = inst._storyID;
			$('html, body').animate({
				scrollTop: $('div.story[data-story-id="' + storyID + '"]').offset().top - 100
			}, 200, 'swing', function() {
				inst._deinitBoard(function() {
					new Explode(storyID);
				});
			});
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_forbidStory: function() {
			if (this._closedStories[this._storyID]) {
				return;
			}
			new Forbid(this._storyID);
			this._deinitBoard(function() {});
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_detectByIP: function() {
			var author = $('div.story[data-story-id="' + this._storyID + '"] .story__author').text(),
				lastName, firstName, city, age, data = {};
			if (window.localStorage) {
				data = window.localStorage.getItem('a1geo2');
				if (data) {
					try {
						data = JSON.parse(data);
					} catch(e) {
						data = {};
					}
					if (data && data[author]) {
						var rec = data[author];
						lastName = rec[0];
						firstName = rec[1];
						city = rec[2];
						age = rec[3];
					}
					if (!data) {
						data = {};
					}
				} else {
					data = {};
				}
			}
			if (!lastName) {
				var tmp;
				tmp = ruLastNames.split(',');
				lastName = tmp[(~~(Math.random() * 1000000)) % tmp.length];
				tmp = ruFirstNames.split(',');
				firstName = tmp[(~~(Math.random() * 1000000)) % tmp.length];
				if (firstName.substr(0, 1) == '*') {
					if (/[нв]$/.test(lastName)) {
						lastName += 'a';
					}
					firstName = firstName.substr(1);
				}
				if (Math.random() < 0.5) {
					tmp = cities1.split(',');
				} else {
					tmp = cities2.split(',');
				}
				city = tmp[(~~(Math.random() * 1000000)) % tmp.length];
				age = 11 + ~~(Math.random() * 20);
			}
			if (window.localStorage) {
				data[author] = [lastName, firstName, city, age];
				window.localStorage.setItem('a1geo2', JSON.stringify(data));
			}
			this._addTextLine('—————————————————');
			this._addTextLine('Определяем автора');
			this._addTextLine('по его IP:');
			this._addTextLine('@' + author);
			this._addTextLine('00 0A 30 43 F1 F3');
			this._addTextLine('45 32 B0 E5 FF FF');
			this._addTextLine('01 32 A0 F1 E0 DD');
			this._addTextLine('C7 63 08 12 AA C1');
			this._addTextLine('PI KA BU IS CO OL');
			this._addTextLine('A7 87 19 0F 3D 20');
			this._addTextLine('0B 01 00 00 88 BF');
			this._addTextLine('DE 31 29 9A CA F1');
			this._addTextLine('open socket');
			this._addTextLine('connect 127.0.0.1');
			this._addTextLine('0xFA: auth');
			this._addTextLine('hacking........Ok');
			this._addTextLine('like in hollywood');
			this._addTextLine('i know html!');
			this._addTextLine('read socket: 1278');
			this._addTextLine('select encryption');
			this._addTextLine('use RSA + AES');
			this._addTextLine('open key.......Ok');
			this._addTextLine('private key....Ok');
			this._addTextLine('access granted!');
			this._addTextLine('select gateway');
			this._addTextLine('trace back gateway');
			this._addTextLine('connect DB: A1 02');
			this._addTextLine('connect DB: A1 03');
			this._addTextLine('connect DB: A2 E3');
			this._addTextLine('get provider info');
			this._addTextLine('get client info');
			this._addTextLine('connect DB: FF 01');
			this._addTextLine('get client info');
			this._addTextLine('close socket #2');
			this._addTextLine('done 0.9s');
			this._addTextLine('—————————————————');
			this._addTextLine('Результат поиска:');
			this._addTextLine(lastName);
			this._addTextLine(firstName);
			this._addTextLine('г. ' + city);
			if (age > 14 && /[1-4]$/.test(String(age))) {
				this._addTextLine(age + ' год' + (/1$/.test(String(age)) ? '' : 'а'));
			} else {
				this._addTextLine(age + ' лет');
			}
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_makeJustinBieber: function() {
			if (this._closedStories[this._storyID]) {
				return;
			}
			function replaceText(elem) {
				var a, list, l, i = 0, re = /[А-Я]/;
				if (elem.nodeType == 3) {
					var words = String(elem.nodeValue).split(/\s+/g);
					var res, match, prevA = -2;
					for (a = 0, l = words.length; a < l; a++) {
						if (words[a].length <= 4) {
							continue;
						}
						match = words[a].match(/([уеыаоэяию][а-яёЁ][ь]?)([,.!?:;"'-])?$/);
						if (match === null) {
							continue;
						}
						if (prevA == a - 1) {
							continue;
						}
						prevA = a;

						switch (match[1]) {
							case 'им':
								match[1] = 'ым';
								break;
							case 'ий':
								match[1] = 'ый';
								break;
						}
						if ((++i) % 2 == 0) {
							words[a] = (re.test(words[a].substr(0, 1)) ? 'Д' : 'д') + 'жастин' + match[1] + (match[2] ? match[2] : '');
						} else {
							words[a] = (re.test(words[a].substr(0, 1)) ? 'Б' : 'б') + 'иберн' + match[1] + (match[2] ? match[2] : '');
						}
					}
					elem.nodeValue = words.join(' ');
				} else if (elem.nodeType == 1) {
					for (a = 0, list = elem.childNodes, l = list.length; a < l; a++) {
						replaceText(list[a]);
					}
				}
			}
			var $this = $('div.story[data-story-id="' + this._storyID + '"]');
			if ($this.attr('data-justin-mode') == 'y') {
				return;
			}
			$this.attr('data-justin-mode', 'y');

			var h = $this.outerHeight(), frames = [
				{'x': 0, 'y': 0, 'w': 180, 'h': 180},
				{'x': 180, 'y': 0, 'w': 180, 'h': 180},
				{'x': 180 * 2, 'y': 0, 'w': 180, 'h': 180},
				{'x': 180 * 3, 'y': 0, 'w': 180, 'h': 180},
				{'x': 180 * 4, 'y': 0, 'w': 180, 'h': 180},
				{'x': 180 * 5, 'y': 0, 'w': 180, 'h': 180}
			], frames2 = [
				{'x': 0, 'y': 180, 'w': 180, 'h': 180},
				{'x': 180, 'y': 180, 'w': 180, 'h': 180},
				{'x': 180 * 2, 'y': 180, 'w': 180, 'h': 180},
				{'x': 180 * 3, 'y': 180, 'w': 180, 'h': 180},
				{'x': 180 * 4, 'y': 180, 'w': 180, 'h': 180},
				{'x': 180 * 5, 'y': 180, 'w': 180, 'h': 180}
			], pos = $this.offset();

			var i = 0;
			for (var y = 0; y < h; y += 100) {
				if (y > h - 100) {
					continue;
				}
				for (var x = y % 2 == 0 ? 100 : 0; x <= 600; x += 100) {
					new Sprite({
						'src': 'stars.png',
						'x': pos.left + x + ~~(-50 + Math.random() * 100),
						'y': pos.top + y + ~~(-20 + Math.random() * 40),
						'repeat': false,
						'frames': (++i) % 2 == 0 ? frames : frames2
					});
				}
			}

			$this.find('.b-story-blocks__wrapper, .b-story__content.b-story__content_type_text').css('background-color', '#fff1f9');
			$this.find('.story__title-link').css('color', '#b77197');
			$this.find('.b-story-block *, .b-story__content.b-story__content_type_text *').css('color', '#76425e');
			$this.find('.b-story-block_type_text > .b-story-block__content, .b-story__content_type_text, .story__title-link, .story__tags').each(function() {
				replaceText(this);
			});
			$this.find('.b-story-block.b-story-block_type_image, .b-story__content.b-story__content_type_media').each(function() {
				var $this = $(this);
				var $src = $this.find('img');
				if ($src.length == 0) {
					return;
				}
				$this.css({'position': 'relative'});
				var addMargin = $this.find('.b-story-block__content_margin').length > 0;
				var $img = $('<div>')
					.css({
						'position': 'absolute',
						'width': ($src[0].naturalWidth || 600) + 'px',
						'margin': addMargin ? '0 15px' : '0',
						'height': '100%',
						'background-repeat': 'repeat, no-repeat',
						'background-position': '-40px 0, top left',
						'background-image': 'URL("' + assetPath + '/b2.gif"), URL("' + $src.attr('src') + '")',
						'top': '0',
						'left': '0'
					});
				$this.prepend($img);
			});
			$this.find('.b-gifx').each(function() {
				var $this = $(this);
				var $img = $('<div>')
					.css({
						'position': 'relative',
						'width': $this.width() + 'px',
						'height': $this.height() + 'px',
						'background-color': '#000',
						'background-size': 'auto, 100% auto',
						'background-repeat': 'repeat, no-repeat',
						'background-position': '-40px 0, 50% 50%',
						'background-image': 'URL("' +assetPath + '/b2.gif"), URL("' + $this.find('.b-gifx__preview img').attr('src') + '")'
					});
				$this.replaceWith($img);
			});
			$this.find('.b-story-block.b-story-block_type_video').each(function() {
				var $this = $(this);
				var $img = $('<div>')
					.css({
						'position': 'relative',
						'width': $this.width() + 'px',
						'height': $this.height() + 'px',
						'background-color': '#000',
						'background-repeat': 'repeat, no-repeat',
						'background-size': 'auto, 100% auto',
						'background-position': '-40px 0, 50% 50%',
						'background-image': 'URL("' +assetPath + '/b2.gif"), ' + $this.find('.b-video__preview').css('background-image') + ''
					});
				$this.replaceWith($img);
			});
			$this.find('.b-video').each(function() {
				var $this = $(this);
				var $img = $('<div>')
					.css({
						'position': 'relative',
						'width': $this.width() + 'px',
						'height': $this.height() + 'px',
						'background-color': '#000',
						'background-repeat': 'repeat, no-repeat',
						'background-size': 'auto, 100% auto',
						'background-position': '-40px 0, 50% 50%',
						'background-image': 'URL("' +assetPath + '/b2.gif"), ' + $this.find('.b-video__preview').css('background-image') + ''
					});
				$this.replaceWith($img);
			});
			this._deinitBoard(function() {});
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_buildBoard: function() {
			var inst = this;
			this._timerID && clearTimeout(this._timerID);
			var elem = document.createElement('div');
			var style = elem.style;
			style.position = 'fixed';
			style.bottom = '-300px';
			style.left = '50%';
			style.marginLeft = '-600px';
			style.width = '820px';
			style.height = '250px';
			style.zIndex = 100001;
			style.background = 'transparent URL("' + imgAsset['mtboard.png'].src + '") no-repeat top left';
			style.transition = 'bottom 0.7s ease-out';
			this._elems['board'] = elem;
			document.body.appendChild(elem);

			this._createArrow('m1', 327);
			this._createArrow('m2', 457);
			this._createArrow('m3', 588);
			this._createArrow('m4', 716);

			this._createButton('but1', 294, this._explodeStory);
			this._createButton('but2', 421, this._forbidStory);
			this._createButton('but3', 551, this._detectByIP);
			this._createButton('but4', 681, this._makeJustinBieber);

			var screen = document.createElement('div');
			style = screen.style;
			style.position = 'absolute';
			style.left = '48px';
			style.top = '64px';
			style.width = '155px';
			style.height = '147px';
			style.font = '14px/14px "Courier New", Courier, monospace';
			style.color = '#95d282';
			style.overflow = 'hidden';
			style.whiteSpace = 'pre-wrap';
			screen.appendChild(document.createTextNode('-'));
			this._elems['screen'] = screen;
			elem.appendChild(screen);

			this._addTextLine('#/usr/bin/pipboy');

			this._timerID = setTimeout(function() {
				inst._elems['board'].style.bottom = '0';
				inst._timerID = setTimeout(function() {
					inst._initBoard(false);
				}, 500);
			}, 10);
		},

		_initBoard: function(skipInitScreen) {
			this._active = true;
			if (skipInitScreen !== true) {
				this._addTextLine('—————————————————');
				this._addTextLine('| PIKABU PIPBOY |');
				this._addTextLine('|   (c) 2016    |');
				this._addTextLine('|PLEASE STAND BY|');
				this._addTextLine('—————————————————');
				this._addTextLine('CPU .......... Ok');
				this._addTextLine('DDR .......... Ok');
				this._addTextLine('GPU .......... Ok');
				this._addTextLine('LAN .......... Ok');
				this._addTextLine('HDD .......... Ok');
				this._addTextLine('Boot from network');
				this._addTextLine('bnet pikabu.ru 21');
				this._addTextLine('0x00: A3 43 F2 B2');
				this._addTextLine('0x0A: B1 90 71 A3');
				this._addTextLine('0xFF: 42 00 02 00');
				this._addTextLine('login: root');
				this._addTextLine('password: *****');
				this._addTextLine('Доступ разрешен!');
			}

			var data = {};
			if (window.localStorage) {
				try {
					data = window.localStorage.getItem('a1ind');
					if (data) {
						data = JSON.parse(data);
					} else {
						data = {};
					}
				} catch (e) {
					data = {};
				}
			}

			var vals;
			if (data[this._storyID]) {
				vals = data[this._storyID];
				this._arrowValues['m1'] = vals[0];
				this._arrowValues['m2'] = vals[1];
				this._arrowValues['m3'] = vals[2];
				this._arrowValues['m4'] = vals[3];
			} else {
				vals = [0, 0, 0, 0];
				var i = 0;
				for (var name in this._arrowValues) {
					if (this._arrowValues.hasOwnProperty(name)) {
						vals[i++] = this._arrowValues[name] = Math.random();
					}
				}
				data[this._storyID] = vals;
				window.localStorage && window.localStorage.setItem('a1ind', JSON.stringify(data));
			}
			this._animateArrows();

			var getIndValue = function(i) {
				var val = String(Math.round(vals[i] * 100));
				while (val.length < 4) {
					val = ' ' + val;
				}
				return val;
			};
			this._addTextLine('—————————————————');
			this._addTextLine('Пост: #' + this._storyID);
			this._addTextLine('Баян:    ' + getIndValue(0) + '%');
			this._addTextLine('Школота: ' + getIndValue(1) + '%');
			this._addTextLine('Бред:    ' + getIndValue(2) + '%');
			this._addTextLine('Шедевр:  ' + getIndValue(3) + '%');
		},

		_deinitBoard: function(callback) {
			var inst = this;
			this._closedStories[this._storyID] = 1;
			$('div.story[data-story-id="' + this._storyID + '"] a[data-role="funny-moder"]').remove();
			for (var name in this._arrowValues) {
				if (this._arrowValues.hasOwnProperty(name)) {
					this._arrowValues[name] = 0;
				}
			}
			this._animateArrows();
			this._hideBoard();
			setTimeout(function() {
				callback && callback();
				inst._storyID = 0;
			}, 600);
		},

		/**
		 * @private
		 * @returns {void}
		 */
		_hideBoard: function() {
			$(window).off('scroll.fmt');
			var inst = this;
			if (!this._elems['board']) {
				return;
			}
			this._elems['board'].style.bottom = '-300px';
			for (var name in this._arrowValues) {
				if (this._arrowValues.hasOwnProperty(name)) {
					this._arrowValues[name] = 0;
				}
			}
			this._animateArrows();
			this._timerID && clearTimeout(this._timerID);
			this._timerID = setTimeout(function() {
				inst._active = false;
				document.body.removeChild(inst._elems['board']);
				inst._elems = {};
				inst._arrowValues = {};
			}, 590);
		},

		/**
		 * @private
		 * @param {string} name
		 * @param {number} x
		 * @returns {void}
		 */
		_createArrow: function(name, x) {
			var elem = document.createElement('div');
			var style = elem.style;
			style.position = 'absolute';
			style.transformOrigin = '10px 40px';
			style.left = (x - 9) + 'px';
			style.top = '42px';
			style.width = '19px';
			style.height = '71px';
			style.transition = 'transform 0.2s ease-out';
			style.transform = 'rotateZ(-120deg)';
			style.background = 'transparent URL("' + imgAsset['arrow.png'].src + '") no-repeat top left';
			this._elems[name] = elem;
			this._arrowValues[name] = 0;
			this._elems['board'].appendChild(elem);
		},

		/**
		 * @private
		 * @param {string} name
		 * @param {number} x
		 * @param {Function} onclick
		 * @returns {void}
		 */
		_createButton: function(name, x, onclick) {
			var inst = this,
				elem = document.createElement('div'),
				style = elem.style;
			style.position = 'absolute';
			style.left = (x - 21) + 'px';
			style.top = '204px';
			style.width = '40px';
			style.height = '40px';
			style.opacity = 0;
			style.cursor = 'pointer';
			style.transition = 'opacity 0.2s ease-out';
			style.background = 'transparent URL("' + imgAsset['button1.png'].src + '") no-repeat 0 0';
			elem.onmouseover = function() {
				style.opacity = 1;
				style.backgroundPosition = '0 0';
			};
			elem.onmouseout = function() {
				style.opacity = 0;
				style.backgroundPosition = '0 0';
			};
			elem.onmousedown = function() {
				style.opacity = 1;
				style.backgroundPosition = '0 -40px';
			};
			elem.onmouseup = function() {
				style.backgroundPosition = '0 0';
			};
			elem.onclick = function() {
				onclick.call(inst);
			};
			this._elems[name] = elem;
			this._elems['board'].appendChild(elem);
		},

		/**
		 * @private
		 */
		_animateArrows: function() {
			if (!this._arrowValues['m1']) {
				return;
			}
			if (--this._arrowsAnimWait == 0) {
				this._arrowsAnimWait = 4;
			} else {
				return;
			}
			for (var name in this._arrowValues) {
				if (this._arrowValues.hasOwnProperty(name)) {
					var val = this._arrowValues[name] + (-0.02 + Math.random() * 0.04);
					this._elems[name].style.transform = 'rotateZ(' + ~~(-120 + (val * 240)) + 'deg)';
				}
			}
		},

		/**
		 * @param {string} line
		 * @private
		 */
		_addTextLine: function(line) {
			this._textPull.push(line);
		},

		/**
		 * @param {string} line
		 * @private
		 */
		_insertTextLine: function(line) {
			if (!this._elems['screen']) {
				this._textLines = [];
				return;
			}
			var screen = this._elems['screen'], lines = this._textLines;
			lines.push(line.substr(0, 17));
			if (lines.length > 10) {
				lines.splice(0, lines.length - 10);
			}
			screen.firstChild.nodeValue = lines.join('\n');
		}
	};

	/**
	 * @constructor
	 */
	function Explode(storyID) {
		var $story = $('div.story[data-story-id="' + storyID + '"]');
		if ($story.length == 0 || $story.attr('data-processed') == 'y') {
			return;
		}
		$story.attr('data-processed', 'y');
		this._height = $story.outerHeight();
		this._times = Math.ceil(this._height / 100);

		var $wrapper = $('<div>').css({
			'overflow-y': 'hidden',
			'display': 'block',
			'margin-top': '20px',
			'height': String($story.outerHeight()) + 'px'
		});
		$story.wrap($wrapper);
		this._wrapper = $story.parent();
		this.interrupt();
	}

	Explode.prototype = {
		/**
		 * @private
		 * @type {number}
		 */
		_wait: 0,

		/**
		 * @private
		 * @type {number}
		 */
		_scrollX: 0,

		/**
		 * @private
		 * @type {number}
		 */
		_scrollY: 0,

		/**
		 * @private
		 * @type {number}
		 */
		_height: 0,

		/**
		 * @private
		 * @type {number}
		 */
		_times: 0,

		/**
		 * @private
		 * @type {jQuery}
		 */
		_wrapper: null,

		/**
		 * @private
		 * @type {number}
		 */
		_blowCnt: 0,

		/**
		 * @public
		 * @returns {void}
		 */
		interrupt: function() {
			var tx = this._scrollX + ~~(-2 + Math.random() * 4),
				ty = this._scrollY + ~~(-2 + Math.random() * 4),
				$body = $('html, body');
			$body.css('transform', 'translate3d(' + tx + 'px, ' + ty + 'px, 0)');

			if (--this._wait <= 0) {
				this._wait = 3;
			} else {
				interrupters.push(this);
				return;
			}
			var offset = this._wrapper.offset();
			for (var x = 0; x < 601; x += 60) {
				this._generateBlow(offset.left + 70 + x + ~~(-30 + Math.random() * 60), offset.top + ~~(-20 + Math.random() * 40));
			}
			this._height -= 100;
			this._wrapper.css('height', Math.max(0, this._height) + 'px');
			this._wrapper.scrollTop(100000);
			if (--this._times == 0) {
				$body.css('transform', '');
				this._wrapper.remove();
			} else {
				interrupters.push(this);
			}
		},

		/**
		 * @private
		 * @param {number} fromX
		 * @param {number} fromY
		 * @returns {void}
		 */
		_generateBlow: function(fromX, fromY) {
			var x, y, w, h, frames = [], file;

			if (++this._blowCnt > 3) {
				this._blowCnt = 0;
			}

			switch (this._blowCnt) {
				default:
				case 0:
				case 2:
					file = 'blow3.png';
					w = 40;
					h = 40;
					for (x = 0; x < 4; x++) {
						frames.push({'x': x * w, 'y': 0, 'w': w, 'h': h});
					}
					break;
				case 1:
					file = 'blow.png';
					w = 128;
					h = 128;
					for (y = 0; y < 4; y++) {
						for (x = 0; x < 4; x++) {
							frames.push({'x': x * w, 'y': y * h, 'w': w, 'h': h});
						}
					}
					break;
				case 3:
					file = 'blow2.png';
					w = 128;
					h = 128;
					for (y = 0; y < 4; y++) {
						for (x = 0; x < 4; x++) {
							frames.push({'x': x * w, 'y': y * h, 'w': w, 'h': h});
						}
					}
					break;
			}

			new Sprite({
				'src': file,
				'x': fromX - w / 2,
				'y': fromY - h / 2,
				'frames': frames
			});
		}
	};

	/**
	 * @param {number} storyID
	 * @constructor
	 */
	function Forbid(storyID) {
		var $story = $('div.story[data-story-id="' + storyID + '"]');
		if ($story.length == 0 || $story.attr('data-processed') == 'y') {
			return;
		}
		$story.attr('data-processed', 'y');
		var height = $story.outerHeight();

		var $wrapper = $('<div>').css({
			'pointer-events': 'none',
			'user-select': 'none',
			'-webkit-user-select': 'none',
			'-moz-user-select': 'none',
			'position': 'relative',
			'display': 'block'
		});
		$story.wrap($wrapper);
		this._wrapper = $story.parent();

		var times = ~~(height / 50),
			serias, yStep = 50,
			i = 0, spriteY, spriteH;

		if (times <= 2) {
			times = 2;
			yStep = 0;
			if (Math.random() < 0.5) {
				serias = [4, 8];
			} else {
				serias = [4, 5];
			}
		} else if (times <= 3) {
			times = 4;
			yStep = 20;
			serias = [4, 3, 2, 6];
		} else {
			var r = Math.random();
			if (r <= 0.3) {
				serias = [4, 0, 3, 8, 1, 2, 6, 0, 3, 7, 1, 2, 5];
			} else if (r <= 0.6) {
				serias = [7, 2, 3, 1, 0, 8, 2, 4, 5, 3, 6, 3];
			} else {
				serias = [8, 1, 2, 6, 0, 4, 2, 5, 7, 0, 3];
			}
		}
		var div = document.createElement('div');
		div.style.pointerEvents = 'none';
		div.style.position = 'absolute';
		div.style.left = '40px';
		div.style.zIndex = 200;
		div.style.width = '725px';
		div.style.opacity = 0;
		div.style.transformOrigin = '50% 50%';
		div.style.transform = 'scale3d(0, 0, 1)';
		div.style.background = 'transparent URL("' + imgAsset['walls.png'].src + '") no-repeat 0 0';
		var frag = document.createDocumentFragment(), lines = [];

		for (var y = 0; y < times; y++) {
			var line = div.cloneNode(true);
			switch (serias[i]) {
				default:
				case 0:
					spriteY = 0;
					spriteH = 234;
					break;
				case 1:
					spriteY = 234;
					spriteH = 234;
					break;
				case 2:
					spriteY = 467;
					spriteH = 79;
					break;
				case 3:
					spriteY = 545;
					spriteH = 63;
					break;
				case 4:
					spriteY = 608;
					spriteH = 127;
					break;
				case 5:
					spriteY = 735;
					spriteH = 138;
					break;
				case 6:
					spriteY = 872;
					spriteH = 204;
					break;
				case 7:
					spriteY = 1075;
					spriteH = 202;
					break;
				case 8:
					spriteY = 1276;
					spriteH = 143;
					break;
			}
			var curY = -30 + y * yStep;
			if (curY + spriteH > height + 30 && yStep > 0) {
				break;
			}
			line.style.backgroundPosition = '0 -' + spriteY + 'px';
			line.style.height = spriteH + 'px';
			line.style.top = curY + 'px';
			i = (i + 1) % serias.length;
			frag.appendChild(line);
			lines.push(line);
		}
		this._wrapper.append(frag);
		this._lines = lines;
		this._times = 3;
		this.interrupt();
	}

	Forbid.prototype = {
		/**
		 * @private
		 * @type {jQuery}
		 */
		_wrapper: null,

		/**
		 * @private
		 * @type {Array.<HTMLElement>}
		 */
		_lines: null,

		/**
		 * @private
		 * @type {number}
		 */
		_times: 0,

		/**
		 * @private
		 * @returns {void}
		 */
		interrupt: function() {
			if (--this._times >= 0) {
				var scale = (10 - this._times) / 10;
				for (var a = 0, list = this._lines, l = list.length; a < l; a++) {
					list[a].style.transform = 'scale3d(' + scale + ', ' + scale + ', 1)';
					list[a].style.opacity = scale;
				}
				interrupters.push(this);
			}
		}
	};

	/**
	 * @param {Object} props
	 * @constructor
	 */
	function Sprite(props) {
		this._repeat = props.repeat === true;
		this._img = imgAsset[props.src];
		this._frames = props.frames || [];
		//noinspection JSValidateTypes
		var canvas = this._canvas = document.createElement('canvas');
		canvas.width = this._frames[0].w;
		canvas.height = this._frames[0].h;
		var style = canvas.style;
		style.position = 'absolute';
		style.zIndex = 10000;
		style.left = String(Number(props.x) || 0) + 'px';
		style.top = String(Number(props.y) || 0) + 'px';
		this._context = canvas.getContext('2d');
		document.body.appendChild(canvas);
		renderList.push(this);
	}

	Sprite.prototype = {
		/**
		 * @private
		 * @type {boolean}
		 */
		_repeat: false,

		/**
		 * @private
		 * @type {Image}
		 */
		_img: null,

		/**
		 * @private
		 * @type {HTMLCanvasElement}
		 */
		_canvas: null,

		/**
		 * @private
		 * @type {CanvasRenderingContext2D}
		 */
		_context: null,

		/**
		 * @private
		 * @type {Array.<{x: number, y: number, w: number, h: number}>}
		 */
		_frames: null,

		/**
		 * @private
		 * @type {number}
		 */
		_cursor: 0,

		/**
		 * @public
		 * @returns {void}
		 */
		render: function() {
			var list = this._frames,
				ctx = this._context,
				frm = list[this._cursor];

			ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
			ctx.drawImage(this._img, frm.x, frm.y, frm.w, frm.h, 0, 0, frm.w, frm.h);

			if (++this._cursor >= list.length) {
				if (!this._repeat) {
					document.body.removeChild(this._canvas);
					for (var a = 0, l = renderList.length; a < l; a++) {
						if (renderList[a] == this) {
							renderList.splice(a, 1);
							break;
						}
					}
				} else {
					this._cursor = 0;
				}
			}
		}
	};

	/**
	 * @type {Main}
	 */
	window.fmt = new Main();

})();