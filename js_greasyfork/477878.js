// ==UserScript==
// @name			Torrent/Magnet/TorrServer Кнопки [Rutracker / Kinozal / Rutor]
// @description		Kinozal, Rutracker, Rutor кнопки с разными настройками / Добавляет кнопки "Скачать торрент файл", "Magnet", "Torrserver" в "поисковой системе" и "Раздачи персоны" / Показывает есть ли реклама в раздаче / Изменённый стиль в Кинозале, Rutor / Кнопка в Кинопоиске где искать раздачу
// @version			1.2.7.16
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAMAAAD+iNU2AAAAD1BMVEU7R4CAAAD4+/z9787///8A0Su5AAAASUlEQVR4AXWPAQrEMBACzen/33wdkGILFZQdSFxWkZKoyWBsd5JXvFgMfC6ZLBs0pq8Mtq8f0Bcbw9N3HvuI8i14sAt/e8/73j/4FwHuDyR5AQAAAABJRU5ErkJggg==
// @match			*://rutracker.org/*
// @match			*://rutracker.net/*
// @match			*://rutracker.lib/*
// @match			*://www.kinopoisk.ru/*
// @match			*://rutor.info/*
// @match			*://rutor.is/*
// @match			*://kinozal.me/*
// @match			*://kinozal.tv/*
// @match			*://kinozal.guru/*
// @match			*://kinozal.website/*
// @match			*://kinozal.life/*
// @require			https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
// @require			https://code.jquery.com/jquery-3.1.0.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.32/sweetalert2.min.js
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_addStyle
// @grant			GM_registerMenuCommand
// @grant			GM.xmlHttpRequest
// @run-at		document-end
// @license			GPL-3.0-or-later
// @namespace https://greasyfork.org/users/1031682
// @downloadURL https://update.greasyfork.org/scripts/477878/TorrentMagnetTorrServer%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%5BRutracker%20%20Kinozal%20%20Rutor%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/477878/TorrentMagnetTorrServer%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%5BRutracker%20%20Kinozal%20%20Rutor%5D.meta.js
// ==/UserScript==
(function() {
	'use strict';
	const $ = window.jQuery,
		maxWidth = $(window).width() * 0.6,
		image_arrow = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/arrow_icon.gif",
		no_image = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/no_image.png",
		favIcon = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/yellow_heart.png",
		searchIcon = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/search_icon.png",
		hostname = location.origin;
	var script_version = "v1.2.7.16"

	function MonkeyConfig() {
		var cfg = this,
			data, params, values = {},
			storageKey, displayed, openWin, openLayer, container, overlay;

		function init(newData) {
			data = newData;
			if (data) {
				params = data.parameters || data.params;
				if (data.buttons === undefined) data.buttons = ['save', 'defaults', 'cancel'];
				if (data.width === undefined) data.width = '650px';
				if (data.scriptname === undefined) data.scriptname = 'KinozalCFG';
				if (data.title === undefined)
					if (typeof GM_getMetadata == 'function') {
						var scriptName = GM_getMetadata('name');
						data.title = scriptName + ' Configuration';
					}
				else data.title = 'Configuration';
			}
			var safeTitle = data && data.scriptname ? data.scriptname.replace(/[^a-zA-Z0-9]/g, '_') : '';
			storageKey = 'ScriptSettings_' + safeTitle + '_cfg';
			var storedValues;
			if (GM_getValue(storageKey)) storedValues = JSON.parse(GM_getValue(storageKey));
			for (var name in params) {
				if (params[name]['value'] !== undefined) set(name, params[name].value);
				else if (storedValues && storedValues[name] !== undefined) set(name, storedValues[name]);
				else if (params[name]['default'] !== undefined) set(name, params[name]['default']);
				else set(name, '');
			}
			if (data.menuCommand) {
				var caption = data.menuCommand !== true ? data.menuCommand : data.title;
				GM_registerMenuCommand(caption, function() {
					cfg.open();
				});
			}
			cfg.open = open;
			cfg.close = close;
			cfg.get = get;
			cfg.set = function(name, value) {
				set(name, value);
				update();
			};
		}

		function get(name) {
			return values[name];
		}

		function set(name, value) {
			values[name] = value;
		}

		function setDefaults() {
			for (var name in params) {
				if (typeof params[name]['default'] !== 'undefined') {
					set(name, params[name]['default']);
				}
			}
		}

		function render() {
			var html = '<div class="ScriptSettingsContainer"><h1 class="swal-settings-maintitle">' + data.title + '</h1><table style="width: 100%;" cellspacing="0" cellpadding="0">';
			for (var name in params) {
				html += MonkeyConfig.formatters['tr'](name, params[name]);
			}
			html += '<tr><th colspan="2" class="swal-settings-buttons">';
			for (var button in data.buttons) {
				switch (data.buttons[button]) {
					case 'cancel':
						html += '<button type="button" class="btn_normal btn_cred MT6" id="ScriptSettingsButton_cancel">Отмена</button>';
						break;
					case 'defaults':
						html += '<button type="button" class="btn_normal btn_cblue MT6" id="ScriptSettingsButton_defaults">Ст. Наст.</button>';
						break;
					case 'save':
						html += '<button type="button" class="btn_normal btn_cblue MT6" id="ScriptSettingsButton_save">Сохранить</button>';
						break;
				}
			}
			html += "</th></tr></table><div>";
			return html;
		}

		function update() {
			if (!displayed) return;
			for (var name in params) {
				var value = values[name];
				switch (params[name].type) {
					case 'checkbox':
						var elem = container.querySelector('[name="' + name + '"]');
						elem.checked = !!value;
						break;
					case 'custom':
						params[name].set(value, container.querySelector('#ScriptSettingsParent_' + name));
						break;
					case 'number':
					case 'text':
					case 'color':
						var elem = container.querySelector('[name="' + name + '"]');
						elem.value = value;
						break;
					case 'select':
						var elem = container.querySelector('[name="' + name + '"]');
						if (elem.tagName.toLowerCase() == 'input') {
							if (elem.type && elem.type == 'radio') {
								elem = container.querySelector('[name="' + name + '"][value="' + value + '"]');
								elem.checked = true;
							} else if (elem.type && elem.type == 'checkbox') {
								var checkboxes = container.querySelectorAll('input[name="' + name + '"]');
								for (var i = 0; i < checkboxes.length; i++) checkboxes[i].checked = (value.indexOf(checkboxes[i].value) > -1);
							}
						} else if (elem.tagName.toLowerCase() == 'select')
							if (elem.multiple) {
								var options = container.querySelectorAll('select[name="' + name + '"] option');
								for (var i = 0; i < options.length; i++) options[i].selected = (value.indexOf(options[i].value) > -1);
							}
						else elem.value = value;
						break;
				}
			}
		}

		function saveClick() {
			for (var name in params) {
				switch (params[name].type) {
					case 'checkbox':
						var elem = container.querySelector('[name="' + name + '"]');
						values[name] = elem.checked;
						break;
					case 'custom':
						values[name] = params[name].get(container.querySelector('#ScriptSettingsParent_' + name));
						break;
					case 'number':
					case 'text':
					case 'color':
						var elem = container.querySelector('[name="' + name + '"]');
						values[name] = elem.value;
						break;
					case 'select':
						var elem = container.querySelector('[name="' + name + '"]');
						if (elem.tagName.toLowerCase() == 'input') {
							if (elem.type && elem.type == 'radio') values[name] = container.querySelector('[name="' + name + '"]:checked').value;
							else if (elem.type && elem.type == 'checkbox') {
								values[name] = [];
								var inputs = container.querySelectorAll('input[name="' + name + '"]');
								for (var i = 0; i < inputs.length; i++)
									if (inputs[i].checked) values[name].push(inputs[i].value);
							}
						} else if (elem.tagName.toLowerCase() == 'select' && elem.multiple) {
							values[name] = [];
							var options = container.querySelectorAll('select[name="' + name + '"] option');
							for (var i = 0; i < options.length; i++)
								if (options[i].selected) values[name].push(options[i].value);
						} else values[name] = elem.value;
						break;
				}
			}
			GM_setValue(storageKey, JSON.stringify(values));
			close();
			if (data.onSave) data.onSave(values);
		}

		function cancelClick() {
			Swal.close();
		}

		function defaultsClick() {
			setDefaults();
			update();
		}

		function open(mode, options) {
			function openDone() {
				var button;
				if (button = container.querySelector('#ScriptSettingsButton_save')) button.addEventListener('click', saveClick, true);
				if (button = container.querySelector('#ScriptSettingsButton_cancel')) button.addEventListener('click', cancelClick, true);
				if (button = container.querySelector('#ScriptSettingsButton_defaults')) button.addEventListener('click', defaultsClick, true);
				displayed = true;
				update();
			}
			switch (mode) {
				default:
					Swal.fire({
						width: data.width,
						html: render(),
						showCancelButton: false,
						showConfirmButton: false,
						didOpen: () => {
							Swal.getHtmlContainer().querySelector('button#ScriptSettingsButton_save').focus();
						}
					});
					container = document.querySelector('.ScriptSettingsContainer');
					openDone();
					break;
			}
		}

		function close() {
			if (openWin) {
				openWin.close();
				openWin = undefined;
			} else if (openLayer) {
				openLayer.parentNode.removeChild(openLayer);
				openLayer = undefined;
				if (overlay) {
					overlay.parentNode.removeChild(overlay);
					overlay = undefined;
				}
			}
			displayed = false;
		}
		init(arguments[0]);
	}
	MonkeyConfig.esc = function(string) {
		return string.replace(/"/g, '&quot;');
	};
	MonkeyConfig.HTML = {
		'_field': function(name, options, data) {
			var html;
			if (options.type && MonkeyConfig.HTML[options.type]) html = MonkeyConfig.HTML[options.type](name, options, data);
			else return;
			if (/\[FIELD\]/.test(options.html)) {
				html = options.html.replace(/\[FIELD\]/, html);
			}
			return html;
		},
		'_label': function(name, options, data) {
			var label = options['label'] || name.substring(0, 1).toUpperCase() + name.substring(1).replace(/_/g, '&nbsp;');
			return '<label for="ScriptSettings_field_' + name + '" class="swal-settings-label">' + label + '</label>';
		},
		'_title': function(name, options) {
			var title = (options['title'] != undefined ? '<th colspan="2" class="swal-settings-title">' + options['title'] + '</th></tr><tr>' : '');
			return title;
		},
		'custom': function(name, options, data) {
			return options.html;
		},
		'checkbox': function(name, options, data) {
			return '<label class="checkboxToggle"><input id="ScriptSettings_field_' + name + '" name="' + name + '" type="checkbox"><b></b></label>';
		},
		'number': function(name, options, data) {
			return '<input id="ScriptSettings_field_' + name + '" type="text" class="ScriptSettings_field_number" name="' + name + '" />';
		},
		'select': function(name, options, data) {
			var choices = {},
				html = '',
				value = '';
			if (options.choices.constructor == Array) {
				for (var i = 0; i < options.choices.length; i++) choices[options.choices[i]] = options.choices[i];
			} else choices = options.choices;
			if (!options.multiple) {
				if (!/^radio/.test(options.variant)) {
					html += '<select id="ScriptSettings_field_' + name + '" class="swal-settings-select" name="' + name + '">';
					for (value in choices) html += '<option value="' + MonkeyConfig.esc(value) + '">' + choices[value] + '</option>';
					html += '</select>';
				} else {
					for (value in choices) {
						html += '<label><input type="radio" name="' + name + '" value="' + MonkeyConfig.esc(value) + '" />&nbsp;' + choices[value] + '</label>' + (/ column/.test(options.variant) ? '<br />' : '');
					}
				}
			} else {
				if (!/^checkbox/.test(options.variant)) {
					html += '<select id="ScriptSettings_field_' + name + '" class="ScriptSettings_field_select" multiple="multiple" name="' + name + '">';
					for (value in choices) html += '<option value="' + MonkeyConfig.esc(value) + '">' + choices[value] + '</option>';
					html += '</select>';
				} else {
					for (value in choices) {
						html += '<label class="checkboxToggle"><input type="checkbox" name="' + name + '" value="' + MonkeyConfig.esc(value) + '">&nbsp;' + choices[value] + '<b></b></label>' + (/ column/.test(options.variant) ? '<br />' : '');
					}
				}
			}
			return html;
		},
		'text': function (name, options, data) {
			if (options.long) return '<textarea id="ScriptSettings_field_' + name + '" class="swal-settings-textarea" ' + (!isNaN(options.rows) ? 'rows="' + options.rows + '" ' : '') + '' + (!isNaN(options.cols) ? 'cols="' + options.cols + '" ' : '') + 'name="' + name + '"></textarea>';
			else return '<input id="ScriptSettings_field_' + name + '" type="text" class="swal-settings-input" name="' + name + '" />';
		},
		'color': function(name, options, data) {
			return '<input id="ScriptSettings_field_' + name + '" type="color" class="swal-settings-color" name="' + name + '" />';
		}
	};
	MonkeyConfig.formatters = {
		'tr': function(name, options, data) {
			var html = '<tr>';
			switch (options.type) {
				default:
					html += MonkeyConfig.HTML['_title'](name, options, data);
					html += '<td>';
					html += MonkeyConfig.HTML['_label'](name, options, data);
					html += '</td><td id="ScriptSettingsParent_' + name + '">';
					html += MonkeyConfig.HTML['_field'](name, options, data);
					html += '</td>';
					break;
			}
			html += '</tr>';
			return html;
		}
	};

	function copy(str) {
		var tmp = document.createElement('textarea'),
			focus = document.activeElement;
		tmp.value = str;
		document.body.appendChild(tmp);
		tmp.select();
		document.execCommand('copy');
		document.body.removeChild(tmp);
		focus.focus();
	}

	function truncString(str, max, add) {
		add = add || '...';
		return (typeof str === 'string' && str.length > max ? str.substring(0, max) + add : str);
	};

	function declOfNum(n, text_forms) {
		var get_number = n;
		n = Math.abs(n) % 100;
		var n1 = n % 10;
		if (n > 10 && n < 20) {
			return get_number + " " + text_forms[2];
		}
		if (n1 > 1 && n1 < 5) {
			return get_number + " " + text_forms[1];
		}
		if (n1 == 1) {
			return get_number + " " + text_forms[0];
		}
		return get_number + " " + text_forms[2];
	}

	function SwallAutoCloseMsg(GetTitle, GetTimer) {
		let timerInterval;
		Swal.fire({
			timer: GetTimer * 1000,
			html: "<center><h2 class=\"swal2-title\" style=\"font-size: 18px;\">" + GetTitle + "</h2><br>Окно автоматически закроется через <b></b> сек</center>",
			position: "center",
			showConfirmButton: false,
			timerProgressBar: true,
			didOpen: () => {
				timerInterval = setInterval(() => {
					const content = Swal.getHtmlContainer()
					if (content) {
						const b = content.querySelector('b')
						if (b) {
							b.textContent = Math.ceil(swal.getTimerLeft() / 1000);
						}
					}
				}, 100)
			},
			willClose: () => {
				clearInterval(timerInterval)
			}
		})
	}

	function fixedEncodeURIComponent(str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	}

	function spoilerblock(title = null, content, show = "close", titlecolor = "royalblue") {
		var display = "",
			hint = "";
		if (show == "close") {
			display = 'style="display: none;"';
			hint = 'Открыть';
		} else if (show == "open") {
			display = 'style="display: block;"';
			hint = 'Закрыть';
		}
		return ('<div class="spoilerButton ' + show + '"><div class="block-title"><span style="color:' + titlecolor + '">' + title.toUpperCase() + '</span></div></div><div ' + display + '><div class="spoiler-body">' + content + '</div></div>');
	}
	async function windows1251ResponseToUTF8Response(response) {
		return new Response(new TextDecoder("windows-1251").decode(await response.arrayBuffer()));
	}
	var reg_kinozal_search = new RegExp('kinozal(.me|.tv|.guru|.website|tv.life)\/(details.php|browse.php|persons.php.*torr$|persons.php.*torr&page=.*|groupexreleaselist.php|groupex.php|groupextorrentlist.php)', 'i'),
		reg_kinozal_detailed = new RegExp('kinozal(.me|.tv|.guru|.website|tv.life)\/(details|comment).php', 'i'),
		reg_kinozal_top = new RegExp('kinozal(.me|.tv|.guru|.website|tv.life)\/(top.php|personsearch.php|novinki.php|persons.php.*torrtop$)', 'i'),
		reg_rutor_list = new RegExp('rutor(.info|.is)\/', 'i'),
		reg_kinopoisk_like = new RegExp('kinopoisk.ru\/(film|series)\/[0-9]+\/like', 'i'),
		reg_kinopoisk_main = new RegExp('kinopoisk.ru\/(film|series)\/[0-9]+\/', 'i'),
		reg_rutracker = new RegExp('rutracker(.org|.net|.lib)\/forum\/', 'i'),
		TorrServerCFG = new MonkeyConfig({
			width: "auto",
			scriptname: "torrserver",
			title: "Настройка TorrServer (" + script_version + ")",
			menuCommand: false,
			params: {
				TorrServerVersion: {
					title: "TorrServer",
					label: "Версия",
					type: 'select',
					choices: {
						"new": '1.2.xx / Matrix',
						"old": '< 1.1.xx',
					},
					default: 'new'
				},
				TorrServerIP: {
					label: "IP сервера<p>В параметрах расширения необходимо указать сетевой адрес вашего торрсервера<br>( Например <b>http://192.168.0.122:8090/</b>, <b>http://localhost:8090/</b>.)<br><b>Примечание!</b> Возможна блокировка запросов со стороны<br>(uBlock, adblock и т.п. програм) при добавлении раздачи.<br>смотрите в описании скрипта</p>",
					type: 'text',
					default: "http://127.0.0.1:8090/"
				},
				TorrServerAuth: {
					title: "Авторизация",
					label: "<p><b>ВКЛ</b> Обязательно укажите логин и пароль<br><b>ВЫКЛ</b> Можете ничего не вписывать</p>",
					type: 'checkbox',
					default: false
				},
				TorrServerLogin: {
					label: "<b>Логин</b>",
					type: 'text',
					default: ""
				},
				TorrServerPass: {
					label: "<b>Пароль</b>",
					type: 'text',
					default: ""
				},
			},
			onSave: function(values) {
				location.reload();
			}
		}),
		KinozalCFG = new MonkeyConfig({
			width: "auto",
			scriptname: "kinozal",
			title: "Настройка скрипта (" + script_version + ")",
			menuCommand: false,
			params: {
				ADSY_TextValue: {
					title: "ПОИСК РЕКЛАМЫ В РАЗДАЧЕ",
					label: "<b>ПОИСК ПО ТЕКСТУ \"С РЕКЛАМОЙ\"</b><p style=\"color:red\">добавлять мелким шрифтом</p>",
					type: 'text',
					long: {},
					rows: "8",
					cols: "40",
					default: "содержит.*?реклам|реклам.*?вставк|есть реклама|присутствуе.*?реклам|реклама.*?присутствует|реклам.*?есть|kerob|softbox|animaunt"
				},
				ADSN_TextValue: {
					label: "<b>ПОИСК ПО ТЕКСТУ \"БЕЗ РЕКЛАМЫ\"</b><p style=\"color:red\">добавлять мелким шрифтом</p>",
					type: 'text',
					long: {},
					rows: "8",
					cols: "40",
					default: "раздача без рекламы|реклама.*?удалена|без.*?реклам|реклам.*?нет|нет.*?реклам|реклам.*?отсутствует|дублированный|лицензия|полное дублирование|netflix|itunes|hdrezka|ironclub|appletv"
				},
				DetailedInfoButtons: {
					title: "Кнопки<p>( Внутри раздачи )</p>",
					label: "Сделать простыми кнопки скачивания?",
					type: 'checkbox',
					default: false
				},
				ShowConfirmDownload: {
					title: "Кнопки<p>( Поиск / Раздачи персоны / Внутри раздачи )</p>",
					label: "<b>Подтверждение действия кнопок при нажатии</b><p style=\"color:red\">ТОРРЕНТ, MAGNET, TORRSERVER</p>",
					type: 'checkbox',
					default: true
				},
				ShowTorrentButton: {
					label: "Кнопка \"<b>СКАЧАТЬ ТОРРЕНТ ФАЙЛ</b>\"<p>Данный метод может повлиять на ваш рейтинг</p>",
					type: 'checkbox',
					default: true
				},
				ShowMagnetButton: {
					label: "Кнопка \"<b>СКАЧАТЬ ЧЕРЕЗ MAGNET</b>\"<p>Данный метод скачивания не затрагивает ваш профиль</p>",
					type: 'checkbox',
					default: true
				},
				ShowYoutubeButton: {
					label: "Кнопка \"<b>ИСКАТЬ В YOUTUBE</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowCopyMagnetButton: {
					label: "Кнопка \"<b>СКОПИРОВАТЬ MAGNET ССЫЛКУ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowCopyYoutubeButton: {
					label: "Кнопка \"<b>СКОПИРОВАТЬ YOUTUBE ПОИСК</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowTorrServerButton: {
					label: "Кнопка \"<b>ДОБАВИТЬ РАЗДАЧУ В TORRSERVER</b>\"",
					type: 'checkbox',
					default: false
				},
				ShowSearchKinopoiskButton: {
					label: "Кнопка \"<b>ПОИСК В КИНОПОИСКЕ</b>\"",
					type: 'checkbox',
					default: false
				},
				KinopoiskLinkSearch: {
					title: "КиноПоиск<p>( Похожие фильмы\\сериалы )</p>",
					label: "Кнопка в кинопоиске<p>Выберите каким кинозалом вы пользуетесь,<br>что бы при нажатии на кнопку, открывался ваш кинозал</p>",
					type: 'select',
					choices: {
						kinozal1: 'kinozal.tv',
						kinozal2: 'kinozal.me',
						kinozal3: 'kinozal.guru',
						kinozal4: 'kinozaltv.life',
					},
					default: 'kinozal1'
				},
			},
			onSave: function(values) {
				location.reload();
			}
		}),
		KinozalCFG_CSS = new MonkeyConfig({
			width: "auto",
			scriptname: "kinozal_css",
			title: "Настройка стиля (" + script_version + ")",
			menuCommand: false,
			params: {
				selStyleRazdacha: {
					title: "Настройка раздач</p>",
					label: "<b>Включить стиль раздач?</b>",
					type: 'checkbox',
					default: false
				},
				selFontSize: {
					label: "<b>Размер шрифта для раздач</b>",
					type: 'select',
					choices: {
						"14px": "14px",
						"16px": "16px",
						"18px": "18px",
						"20px": "20px",
						"22px": "22px",
						"24px": "24px",
						"26px": "26px",
					},
					default: '16px'
				},
				selFix: {
					title: "Настройка сайта</p>",
					label: "<b>Фиксировать блоки?</b>",
					type: 'checkbox',
					default: true
				},
				selStyleListalka: {
					label: "<b>Сделать красивый стиль листалки?</b>",
					type: 'checkbox',
					default: false
				},
				selBeautyHeaderMenu: {
					label: "<b>Сделать красивое меню?</b>",
					type: 'checkbox',
					default: false
				},
				selBeautySearchForm: {
					label: "<b>Сделать красивую Форму поиска?</b>",
					type: 'checkbox',
					default: false
				},
				ChangeButtonToLink: {
					title: "Настройка ссылок<p>( Поиск / Раздачи персоны )</p>",
					label: "Выберите вариант:<p><b>ВКЛ</b> При нажатии главной ссылки, откроется окошко с кнопками скачивания<br><b>ВЫКЛ</b> Создаст отдельные кнопки для скачивания</p>",
					type: 'checkbox',
					default: false
				},
				ChangeSettingsLinks: {
					label: "Место настроек (ссылки)<p><b>ВКЛ</b> На верху в конце<br><b>ВЫКЛ</b> С лева, под профилем</p>",
					type: 'checkbox',
					default: false
				},
				SeedGraphSettings: {
					title: "Настройка популярности раздач",
					label: "Полоса популярности раздач",
					type: 'checkbox',
					default: true
				},
				SeedGraphColor: {
					label: "Цвет полосы",
					type: 'color',
					default: "#ff0000"
				},
				SeedGraphHeight: {
					label: "Высота полосы",
					type: 'select',
					choices: {
						"1": " 1px ",
						"2": " 2px ",
						"3": " 3px ",
						"4": " 4px ",
						"5": " 5px ",
						"6": " 6px ",
					},
					default: 3
				},
				ShowMarkTorrents: {
					title: "Метки<p>( Поиск / Раздачи персоны )</p>",
					label: "Помечать раздачи",
					type: 'checkbox',
					default: true
				},
				MarkColor: {
					label: "Главный Цвет",
					type: 'color',
					default: "#ff6666"
				},
				MarkBolder: {
					label: "Обводка текста<p style=\"font-size:11px;\">Делает чуть жирнее текст</p>",
					type: 'checkbox',
					default: false
				},
				MarkBoldColor: {
					label: "Цвет обводки",
					type: 'color',
					default: "#750000"
				},
				MarkTextValue: {
					label: "Текст метки <b>через пробел</b>",
					type: 'text',
					default: "4K 2160P 1080P BDRIP"
				},
				SwalDetailedInfoWidth: {
					title: "Главное окно информации",
					label: "Ширина окна (<b>%</b> или <b>px</b>)<p style=\"font-size:11px;\">Пример <b>1000px</b> или <b>100%</b></p>",
					type: 'text',
					default: "1100px"
				},
				SwalDefaultStyle: {
					label: "Выберите стиль главного окна информации",
					type: 'select',
					choices: {
						"1": "Bootstrap-4",
						"2": "Borderless",
						"3": "Bulma",
						"4": "Default",
						"5": "Material UI",
						"6": "Minimal",
					},
					default: 4
				},
			},
			onSave: function(values) {
				location.reload();
			}
		}),
		RutorCFG = new MonkeyConfig({
			width: "auto",
			scriptname: "rutor",
			title: "Настройка скрипта (" + script_version + ")",
			menuCommand: false,
			params: {
				ShowConfirmDownload: {
					label: "<b>Подтверждение действия кнопок</b><p style=\"color:red\">ТОРРЕНТ, MAGNET, TORRSERVER</p>",
					type: 'checkbox',
					default: true
				},
				ShowTorrentButton: {
					label: "Кнопка \"<b>СКАЧАТЬ ТОРРЕНТ ФАЙЛ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowMagnetButton: {
					label: "Кнопка \"<b>СКАЧАТЬ ЧЕРЕЗ MAGNET</b>\"",
					type: 'checkbox',
					default: false
				},
				ShowYoutubeButton: {
					label: "Кнопка \"<b>ИСКАТЬ В YOUTUBE</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowCopyMagnetButton: {
					label: "Кнопка \"<b>СКОПИРОВАТЬ MAGNET ССЫЛКУ</b>\"",
					type: 'checkbox',
					default: false
				},
				ShowCopyYoutubeButton: {
					label: "Кнопка \"<b>СКОПИРОВАТЬ YOUTUBE ПОИСК</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowTorrServerButton: {
					label: "Кнопка \"<b>ДОБАВИТЬ РАЗДАЧУ В TORRSERVER</b>\"",
					type: 'checkbox',
					default: false
				},
				ShowSearchKinopoiskButton: {
					label: "Кнопка \"<b>ПОИСК В КИНОПОИСКЕ</b>\"",
					type: 'checkbox',
					default: false
				},
				FontSize: {
					title: "Настройка шрифта",
					label: "Размер шрифта раздач",
					type: 'select',
					choices: {
						"12": "12px",
						"14": "14px",
						"16": "16px",
						"18": "18px",
						"20": "20px",
						"22": "22px",
					},
					default: 12
				},
				ShowPostImg: {
					title: "Обложка",
					label: "<b>Обложка раздач</b>",
					type: 'checkbox',
					default: true
				},
				ShowPostImgWH: {
					label: "<b>Размер обложки</b>",
					type: 'custom',
					html: '<b>Ширина:</b> <input type="text" class="swal-settings-input" style="width: 50px;margin: 4px 0px;"><br><b>Высота:</b> <input type="text" class="swal-settings-input" style="width: 50px;margin: 4px 0px;">',
					set: function(value, parent) {
						parent.querySelectorAll('input')[0].value = value[0];
						parent.querySelectorAll('input')[1].value = value[1];
					},
					get: function(parent) {
						return [parent.querySelectorAll('input')[0].value, parent.querySelectorAll('input')[1].value];
					},
					default: ["90px", "125px"]
				},
				MinimizedStyle: {
					title: "Раздачи",
					label: "Упрощённый стиль раздач",
					type: 'checkbox',
					default: false
				},
				ShowMarkTorrents: {
					title: "Метки",
					label: "Помечать раздачи",
					type: 'checkbox',
					default: true
				},
				MarkColor: {
					label: "Главный Цвет",
					type: 'color',
					default: "#ff6666"
				},
				MarkBolder: {
					label: "Обводка текста<p style=\"font-size:11px;\">Делает чуть жирнее текст</p>",
					type: 'checkbox',
					default: false
				},
				MarkBoldColor: {
					label: "Цвет обводки",
					type: 'color',
					default: "#750000"
				},
				MarkTextValue: {
					label: "Текст метки <b>через пробел</b>",
					type: 'text',
					default: "4K 2160P 1080P BDRIP"
				},
				ADSY_Color: {
					title: "ПОИСК РЕКЛАМЫ В РАЗДАЧЕ",
					label: "<b>ЦВЕТ \"С РЕКЛАМОЙ\"</b>",
					type: 'color',
					default: "#f1bdbd"
				},
				ADSY_TextValue: {
					label: "<b>ПОИСК ПО ТЕКСТУ \"С РЕКЛАМОЙ\"</b><p style=\"color:red\">добавлять мелким шрифтом</p>",
					type: 'text',
					long: {},
					rows: "8",
					cols: "40",
					default: "содержит.*?реклам|реклам.*?вставк|есть реклама|присутствуе.*?реклам|реклама.*?присутствует|реклам.*?есть|kerob|softbox|animaunt"
				},
				ADSN_Color: {
					label: "<b>ЦВЕТ \"БЕЗ РЕКЛАМЫ\"</b>",
					type: 'color',
					default: "#bdf1bf"
				},
				ADSN_TextValue: {
					label: "<b>ПОИСК ПО ТЕКСТУ \"БЕЗ РЕКЛАМЫ\"</b><p style=\"color:red\">добавлять мелким шрифтом</p>",
					type: 'text',
					long: {},
					rows: "8",
					cols: "40",
					default: "раздача без рекламы|реклама.*?удалена|без.*?реклам|реклам.*?нет|нет.*?реклам|реклам.*?отсутствует|дублированный|лицензия|полное дублирование|netflix|itunes|hdrezka|ironclub|appletv"
				},
				SwalDetailedInfoWidth: {
					title: "Настройка главного окна информации",
					label: "Ширина окна (<b>%</b> или <b>px</b>)<p style=\"font-size:11px;\">Пример <b>1000px</b> или <b>100%</b></p>",
					type: 'text',
					default: "1100px"
				},
				SwalDefaultStyle: {
					label: "Выберите стиль главного окна информации",
					type: 'select',
					choices: {
						"1": "Bootstrap-4",
						"2": "Borderless",
						"3": "Bulma",
						"4": "Default",
						"5": "Material UI",
						"6": "Minimal",
					},
					default: 4
				},
				SeedGraphSettings: {
					title: "Настройка популярности раздач",
					label: "Полоса популярности раздач",
					type: 'checkbox',
					default: true
				},
				SeedGraphColor: {
					label: "Цвет полосы",
					type: 'color',
					default: "#ff0000"
				},
				SeedGraphHeight: {
					label: "Высота полосы",
					type: 'select',
					choices: {
						"1": " 1px ",
						"2": " 2px ",
						"3": " 3px ",
						"4": " 4px ",
						"5": " 5px ",
						"6": " 6px ",
					},
					default: 3
				}
			},
			onSave: function(values) {
				location.reload();
			}
		}),
		RuTrackerCFG = new MonkeyConfig({
			width: "auto",
			scriptname: "rutracker",
			title: "Настройка скрипта (" + script_version + ")",
			menuCommand: false,
			params: {
				ADSY_TextValue: {
					title: "ПОИСК РЕКЛАМЫ В РАЗДАЧЕ",
					label: "<b>ПОИСК ПО ТЕКСТУ \"С РЕКЛАМОЙ\"</b><p style=\"color:red\">добавлять мелким шрифтом</p>",
					type: 'text',
					long: {},
					rows: "8",
					cols: "40",
					default: "содержит.*?реклам|реклам.*?вставк|есть реклама|присутствуе.*?реклам|реклама.*?присутствует|реклам.*?есть|kerob|softbox|animaunt"
				},
				ADSN_TextValue: {
					label: "<b>ПОИСК ПО ТЕКСТУ \"БЕЗ РЕКЛАМЫ\"</b><p style=\"color:red\">добавлять мелким шрифтом</p>",
					type: 'text',
					long: {},
					rows: "8",
					cols: "40",
					default: "раздача без рекламы|реклама.*?удалена|без.*?реклам|реклам.*?нет|нет.*?реклам|реклам.*?отсутствует|дублированный|лицензия|полное дублирование|netflix|itunes|hdrezka|ironclub|appletv"
				},
				ShowConfirmDownload: {
					title: "Кнопки",
					label: "<b>Подтверждение действия кнопок</b><p style=\"color:red\">ТОРРЕНТ, MAGNET, TORRSERVER</p>",
					type: 'checkbox',
					default: true
				},
				ShowInfoButton: {
					label: "Кнопка \"<b>ИНФО КНОПКА</b>",
					type: 'checkbox',
					default: true
				},
				ShowTorrentButton: {
					label: "Кнопка \"<b>СКАЧАТЬ ТОРРЕНТ ФАЙЛ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowMagnetButton: {
					label: "Кнопка \"<b>СКАЧАТЬ ЧЕРЕЗ MAGNET</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowYoutubeButton: {
					label: "Кнопка \"<b>ИСКАТЬ В YOUTUBE</b>",
					type: 'checkbox',
					default: true
				},
				ShowCopyMagnetButton: {
					label: "Кнопка \"<b>СКОПИРОВАТЬ MAGNET ССЫЛКУ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowCopyYoutubeButton: {
					label: "Кнопка \"<b>СКОПИРОВАТЬ YOUTUBE ПОИСК</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowTorrServerButton: {
					label: "Кнопка \"<b>ДОБАВИТЬ РАЗДАЧУ В TORRSERVER</b>\"<p style=\"color:red\"><b>При нажатии кнопки, смотрите что вы добавляете</b></p>",
					type: 'checkbox',
					default: false
				},
				ShowPostImg: {
					title: "Обложка",
					label: "<b>Обложка раздач</b>",
					type: 'checkbox',
					default: true
				},
				ShowPostImgWH: {
					label: "<b>Размер обложки</b>",
					type: 'custom',
					html: '<b>Ширина:</b> <input type="text" class="swal-settings-input" style="width: 50px;margin: 4px 0px;"><br><b>Высота:</b> <input type="text" class="swal-settings-input" style="width: 50px;margin: 4px 0px;">',
					set: function(value, parent) {
						parent.querySelectorAll('input')[0].value = value[0];
						parent.querySelectorAll('input')[1].value = value[1];
					},
					get: function(parent) {
						return [parent.querySelectorAll('input')[0].value, parent.querySelectorAll('input')[1].value];
					},
					default: ["75px", "75px"]
				},
				SwalDetailedInfoWidth: {
					title: "Настройка главного окна информации",
					label: "Ширина окна (<b>%</b> или <b>px</b>)<p style=\"font-size:11px;\">Пример <b>1000px</b> или <b>100%</b></p>",
					type: 'text',
					default: "1100px"
				},
				SwalDefaultStyle: {
					label: "Выберите стиль главного окна информации",
					type: 'select',
					choices: {
						"1": "Bootstrap-4",
						"2": "Borderless",
						"3": "Bulma",
						"4": "Default",
						"5": "Material UI",
						"6": "Minimal",
					},
					default: 4
				},
			},
			onSave: function(values) {
				location.reload();
			}
		});
	var TorrServerIP = TorrServerCFG.get('TorrServerIP'),
		TSAuth = TorrServerCFG.get('TorrServerAuth'),
		TSLogin = TorrServerCFG.get('TorrServerLogin'),
		TSPass = TorrServerCFG.get('TorrServerPass'),
		TSVersion = TorrServerCFG.get('TorrServerVersion'),
		get_url = location.href,
		get_full_url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''),
		KZ_SwalDefaultStyle = KinozalCFG_CSS.get('SwalDefaultStyle'),
		RUTOR_SwalDefaultStyle = RutorCFG.get('SwalDefaultStyle'),
		RT_SwalDefaultStyle = RuTrackerCFG.get('SwalDefaultStyle');

	function TS_POST(page, Data, getresponse) {
		if (TSAuth && TSLogin !== null && TSPass !== null) {
			GM.xmlHttpRequest({
				method: "POST",
				url: TorrServerIP + page,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
					"Authorization": "Basic " + btoa(TSLogin + ":" + TSPass)
				},
				data: Data,
				onload: function(response) {
					if (response.status === 200) {
						SwallAutoCloseMsg(getresponse, "5");
					} else if (response.status === 401) {
						SwallAutoCloseMsg("Авторизация не удалась! Проверьте ( соединение / логин / пароль )", "5");
					} else {
						SwallAutoCloseMsg("Не удалось отправить запрос на " + TorrServerIP, "5");
					}
				}
			});
		} else {
			GM.xmlHttpRequest({
				method: "POST",
				url: TorrServerIP + page,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
				},
				data: Data,
				onload: function(response) {
					if (response.status === 200) {
						SwallAutoCloseMsg(getresponse, "5");
					} else if (response.status === 401) {
						SwallAutoCloseMsg("Авторизация не удалась! Проверьте ( соединение / логин / пароль )", "5");
					} else {
						SwallAutoCloseMsg("Не удалось отправить запрос на " + TorrServerIP, "5");
					}
				}
			});
		}
	}
	if (/kinozal(.me|.tv|.guru|.website|tv.life)\//.test(get_url) && !/kinozal(.me|.tv|.guru|.website|tv.life)\/get_srv_details.php/.test(get_url)) {
		var get_acc_login_check = $("#main")[0].innerText;
		if (get_acc_login_check.match(/\( Выход \)/) !== null) {
			var KZ_ADSY_TextValue = new RegExp(KinozalCFG.get('ADSY_TextValue'), 'g');
			var KZ_ADSN_TextValue = new RegExp(KinozalCFG.get('ADSN_TextValue'), 'g');
			var KZ_ShowTorrentButton = KinozalCFG.get('ShowTorrentButton');
			var KZ_ShowTorrServerButton = KinozalCFG.get('ShowTorrServerButton');
			var KZ_ShowMagnetButton = KinozalCFG.get('ShowMagnetButton');
			var KZ_ShowYoutubeButton = KinozalCFG.get('ShowYoutubeButton');
			var KZ_ShowCopyMagnetButton = KinozalCFG.get('ShowCopyMagnetButton');
			var KZ_ShowCopyYoutubeButton = KinozalCFG.get('ShowCopyYoutubeButton');
			var KZ_ShowSearchKinopoiskButton = KinozalCFG.get('ShowSearchKinopoiskButton');
			var KZ_ShowConfirmDownload = KinozalCFG.get('ShowConfirmDownload');
			var KZ_DetailedInfoButtons = KinozalCFG.get('DetailedInfoButtons');
			var KZ_ChangeButtonToLink = KinozalCFG_CSS.get('ChangeButtonToLink');
			var KZ_ChangeSettingsLinks = KinozalCFG_CSS.get('ChangeSettingsLinks');
			var KZ_SeedGraphSettings = KinozalCFG_CSS.get('SeedGraphSettings');
			var KZ_SeedGraphColor = KinozalCFG_CSS.get('SeedGraphColor');
			var KZ_SeedGraphHeight = KinozalCFG_CSS.get('SeedGraphHeight');
			var KZ_selFontSize = KinozalCFG_CSS.get('selFontSize');
			var KZ_selFix = KinozalCFG_CSS.get('selFix');
			var KZ_selStyleRazdacha = KinozalCFG_CSS.get('selStyleRazdacha');
			var KZ_selStyleListalka = KinozalCFG_CSS.get('selStyleListalka');
			var KZ_selBeautyHeaderMenu = KinozalCFG_CSS.get('selBeautyHeaderMenu');
			var KZ_selBeautySearchForm = KinozalCFG_CSS.get('selBeautySearchForm');
			var KZ_ShowMarkTorrents = KinozalCFG_CSS.get('ShowMarkTorrents');
			var KZ_MarkTextValue = KinozalCFG_CSS.get('MarkTextValue');
			var KZ_MarkBolder = KinozalCFG_CSS.get('MarkBolder');
			var KZ_MarkColorValue = KinozalCFG_CSS.get('MarkColor');
			var KZ_MarkBoldColorValue = KinozalCFG_CSS.get('MarkBoldColor');
			var KZ_SwalDetailedInfoWidth = KinozalCFG_CSS.get('SwalDetailedInfoWidth');
			var BeautySearchForm = "",
				StyleFixCss = "body {background-color: #fffff4;}",
				styleListalka = "",
				StyleRazdacha = "";
			if (!KZ_selStyleRazdacha) {
				StyleRazdacha += '#footer,#header>DIV.logo,#header>DIV.menu>form,#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(2),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(7),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(8),#header>SPAN.zan_l,#header>SPAN.zan_r,#header>div.menu_cont>div.search,#header>table,#main>DIV.content>DIV[class="pad0x0x5x0 center"],#main>DIV.menu>DIV:nth-child(2),#main>DIV.menu>DIV:nth-child(5),#main > div.content > form > div > table > tbody > tr:nth-child(1),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(3),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(5){display:none;}td a.r0,td a.r1,td a.r2,td a.r3,td a.r4,td a.r5,td a.r6{font-family:"Open Sans";text-transform:uppercase;font-size:' + KZ_selFontSize + ';padding:4px 0px 4px 5px;display:block}.t_peer td,.t_peer td.bt,.t_peer td.nam,.t_peer td.s,.t_peer td.sl,.t_peer td.sl_p,.t_peer td.sl_s,.t_peer td.z,.t_peer td.zl,.t_peer tr,.t_peer tr.bgn,.t_peer tr.first td,.tables3 td,.tables3 td.bt,.tables3 td.nam,.tables3 td.s,.tables3 td.sl,.tables3 td.sl_p,.tables3 td.sl_s,.tables3 td.z,.tables3 td.zl,.tables3 tr,.tables3 tr.bgn,.tables3 tr.first td{padding:0px;border-top:0px;}DIV.bx2_0 TABLE.t_peer.w100p tbody tr.mn{background:0 0;border:#000 0}DIV.justify.mn2 DIV.bx2_0 tr.mn,DIV.mn1_content DIV.bx2_0{border:0 solid #f1d29c00;padding:3px;background:0 0;font-size:12px}DIV.bx2_0 TABLE.t_peer.w100p tr.mn td.sbl,DIV.bx2_0 TABLE.t_peer.w100p tr.mn td.z,DIV.bx2_0 TABLE.t_peer.w100p tr.mn td.zl,DIV.bx2_0 TABLE.tables3.w100p tr.mn td.s,DIV.bx2_0 TABLE.tables3.w100p tr.mn td.sbl{background:0 0;font-weight:bold;font-size:12px;}TABLE.t_peer.w100p tr.bg td.s,TABLE.t_peer.w100p tr.bg td.sl_p,TABLE.t_peer.w100p tr.bg td.sl_s,TABLE.t_peer.w100p tr.first td.s,TABLE.t_peer.w100p tr.first td.sl_p,TABLE.t_peer.w100p tr.first td.sl_s,TABLE.tables3.w100p tr.first td.s,TABLE.tables3.w100p tr.first td.sbl{font-size:12px;}td a.r0:hover,td a.r1:hover,td a.r2:hover,td a.r3:hover,td a.r4:hover,td a.r5:hover,td a.r6:hover,td a.r7:hover{text-decoration:none !important;}.r0,td a.r0,td a.r0:active,td a.r0:link,td a.r0:visited{font-weight:bold;color:#000}.r1,td a.r1,td a.r1:active,td a.r1:link,td a.r1:visited{font-weight:bold;color:#dcaf35}.r2,td a.r2,td a.r2:active,td a.r2:link,td a.r2:visited{font-weight:bold;color:#a0a7ad}.r3,td a.r3,td a.r3:active,td a.r3:link,td a.r3:visited{font-weight:bold;color:#c13600}.r4,td a.r4,td a.r4:active,td a.r4:link,td a.r4:visited{font-weight:bold;color:#0096c1}.r5,td a.r5,td a.r5:active,td a.r5:link,td a.r5:visited{font-weight:bold;color:#a83838}.r6,td a.r6,td a.r6:active,td a.r6:link,td a.r6:visited{font-weight:bold;color:tomato}.r7,td a.r7,td a.r7:active,td a.r7:link,td a.r7:visited{font-weight:bold;color:#00cd66}';
			} else {
				StyleRazdacha += '.t_peer td,.t_peer td.bt,.t_peer td.nam,.t_peer td.s,.t_peer td.sl,.t_peer td.sl_p,.t_peer td.sl_s,.t_peer td.z,.t_peer td.zl,.t_peer tr,.t_peer tr.bgn,.t_peer tr.first td,.tables3 td,.tables3 td.bt,.tables3 td.nam,.tables3 td.s,.tables3 td.sl,.tables3 td.sl_p,.tables3 td.sl_s,.tables3 td.z,.tables3 td.zl,.tables3 tr,.tables3 tr.bgn,.tables3 tr.first td{padding:1px 4px 1px 0px;transition: .1s;}DIV.bx2_0 TABLE.t_peer.w100p tbody tr.mn{background:0 0;border:#000 0 }DIV.justify.mn2 DIV.bx2_0 tr.mn,DIV.mn1_content DIV.bx2_0{border:0 solid #f1d29c00;padding:3px;background:0 0;font-size:12px;}DIV.bx2_0 TABLE.t_peer.w100p tr.mn td.sbl,DIV.bx2_0 TABLE.t_peer.w100p tr.mn td.z,DIV.bx2_0 TABLE.t_peer.w100p tr.mn td.zl,DIV.bx2_0 TABLE.tables3.w100p tr.mn td.s,DIV.bx2_0 TABLE.tables3.w100p tr.mn td.sbl{background:none;font-weight:bold;font-size:12px }TABLE.t_peer.w100p tr.bg td.s,TABLE.t_peer.w100p tr.bg td.sl_p,TABLE.t_peer.w100p tr.bg td.sl_s,TABLE.t_peer.w100p tr.first td.s,TABLE.t_peer.w100p tr.first td.sl_p,TABLE.t_peer.w100p tr.first td.sl_s,TABLE.tables3.w100p tr.first td.s,TABLE.tables3.w100p tr.first td.sbl{font-size:12px }h1 a.r1,.s3.w100p a.r0,.s3.w100p a.r1,.s3.w100p a.r2,.s3.w100p a.r3,.s3.w100p a.r4,.s3.w100p a.r5,.s3.w100p a.r6,.t_peer.w100p a.r0,.t_peer.w100p a.r1,.t_peer.w100p a.r2,.t_peer.w100p a.r3,.t_peer.w100p a.r4,.t_peer.w100p a.r5,.t_peer.w100p a.r6, .tables3.w100p a.r0, .tables3.w100p .r0 a, .tables3.w100p a.r1, .tables3.w100p .r1 a, .tables3.w100p a.r2, .tables3.w100p .r2 a, .tables3.w100p a.r3, .tables3.w100p .r3 a, .tables3.w100p a.r4, .tables3.w100p .r4 a, .tables3.w100p a.r5, .tables3.w100p .r5 a, .tables3.w100p a.r6, .tables3.w100p .r6 a, .tables3.w100p a.r7, .tables3.w100p .r7 a, .tables3.w100p a.r8, .tables3.w100p .r8 a, .tables3.w100p a.r9, .tables3.w100p .r9 a{font-family:"Open Sans";text-transform:uppercase;font-size:' + KZ_selFontSize + ';padding:1px 4px;font-weight:bold;border-radius:6px;text-decoration:none;text-align:left;user-select:none;display:block;transition: .1s;}td a.r4,td a.r4:link{color:#198a8a;background:#bbf7f7;border:1px solid #76dbdb }td a.r4:hover,td a.r4:visited{border:1px solid #46a3a3;background:#6ec4c4;color:#145757 }td a.r4:active{border:1px solid #3b8f8f;background:#50a1a1;color:#0e4545 }td a.r0,td a.r0:link{color:#19628a;background:#bbe2f7;border:1px solid #76b7db }td a.r0:hover,td a.r0:visited{border:1px solid #4683a4;background:#6ea6c4;color:#144057 }td a.r0:active{border:1px solid #3b7391;background:#5085a1;color:#0e3245 }td a.r1,td a.r1:link{color:#8a7019;background:#f7e9bb;border:1px solid #dbc376 }td a.r1:hover,td a.r1:visited{border:1px solid #a48e46;background:#c4b06e;color:#574814 }td a.r1:active{border:1px solid #917d3b;background:#a18e4f;color:#44370e }td a.r2,td a.r2:link{color:#525252;background:#d9d9d9;border:1px solid #a8a8a8 }td a.r2:hover,td a.r2:visited{border:1px solid #757575;background:#999;color:#363636 }td a.r2:active{border:1px solid #666;background:#787878;color:#292929 }td a.r5,td a.r5:link{color:#238a19;background:#c0f7bb;border:1px solid #7edb76 }td a.r5:hover,td a.r5:visited{border:1px solid #4ea446;background:#75c46e;color:#195714 }td a.r5:active{border:1px solid #42913b;background:#56a14f;color:#12440e }td a.r3,td a.r3:link,td a.r6,td a.r6:link{color:#8a1919;background:#f7bbbb;border:1px solid #db7676 }td a.r3:hover,td a.r3:visited,td a.r6:hover,td a.r6:visited{border:1px solid #a34646;background:#c46e6e;color:#571414 }td a.r3:active,td a.r6:active{border:1px solid #8f3b3b;background:#a15050;color:#450e0e }h1 {font-size: 20px;padding: 0px;margin: 4px 0px 4px 7px;text-decoration: none;font-weight: normal;font-style: normal;max-height: fit-content;font-family: "Open Sans";text-transform: uppercase;text-align: left;user-select: none;}h1 a.r1:hover,a.r1:hover,a.sba:hover, a.sbab:hover {color: #BC2A4D;text-decoration: none !important;}DIV.content DIV.mn_wrap .bulet ,DIV.content DIV.bx2 .bulet,#footer,#header>DIV.logo,#header>DIV.menu>form,#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(2),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(7),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(8),#header>SPAN.zan_l,#header>SPAN.zan_r,#header>div.menu_cont>div.search,#header>table,#main>DIV.content>DIV[class="pad0x0x5x0 center"],#main>DIV.menu>DIV:nth-child(2),#main>DIV.menu>DIV:nth-child(5),#main > div.content > form > div > table > tbody > tr:nth-child(1),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(3),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(5){display:none;} {display:none;}a.r0,a.r1, a.r2, a.r3, a.r4, a.r5, a.r6{font-family:"Open Sans";text-transform:uppercase;font-size:' + KZ_selFontSize + ';}';
			}
			if (KZ_selFix) {
				if (KZ_selBeautyHeaderMenu) {
					if (KZ_selStyleListalka) {
						styleListalka += '#main .content{padding: 59px 4px 10px 240px;}table.t_peer.w100p {margin-top: 0px;}DIV.content DIV.bx2{border:0 solid #f1d29c00;padding:3px;font-size:12px}DIV.content DIV.mn1_content DIV.bx1.stable,DIV.content DIV.mn_wrap DIV.mn1_content DIV.bx2_0{padding:0;background:0 0;font-size:12px;box-shadow:0 0 0 1px transparent;border:none}.content .mn1_content{margin-top:0}.mn1_menu{display:none;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;position:fixed;z-index:1059;top:66px;margin-left:-1px;background:#fafafa repeat-x scroll top;border:1px solid rgba(0,0,0,.6);padding:10px;overflow:hidden;border-radius:0px 0px 5px 5px}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
					} else {
						styleListalka += '#main .content{padding: 39px 4px 10px 240px;}table.t_peer.w100p {margin-top: 0px;}DIV.content DIV.bx2{border:0 solid #f1d29c00;padding:3px;font-size:12px}DIV.content DIV.mn1_content DIV.bx1.stable,DIV.content DIV.mn_wrap DIV.mn1_content DIV.bx2_0{padding:0;background:0 0;font-size:12px;box-shadow:0 0 0 1px transparent;border:none}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.mn1_menu{display:none;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;position:fixed;z-index:1059;top:66px;margin-left:0px;background:#fafafa repeat-x scroll top;border:1px solid rgba(0,0,0,.6);padding:10px;overflow:hidden;border-radius:0px 0px 5px 5px}';
					}
					StyleFixCss += '#footer,#header>DIV.logo,#header>DIV.menu>form,#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(2),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(7),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(8),#header>SPAN.zan_l,#header>SPAN.zan_r,#header>div.menu_cont>div.search,#header>table,#main>DIV.content>DIV[class="pad0x0x5x0 center"],#main>DIV.menu>DIV:nth-child(2),#main>DIV.menu>DIV:nth-child(5),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(3),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(5){display:none;}#header .menu_cont{height:0;padding:0 }#main>div.content>form {position: fixed;z-index: 1059;top: 67px;margin-left: 0px;width: 100%;border-bottom-left-radius: 7px;}#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;position:fixed;top:10px;z-index:1058;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li a,#header .menu_cont .menu ul li a{display:block;float:left;height:auto;color:#4c4c4c;font-size:20px;font-weight:400;text-align:center;border:1px solid #bbb;border-radius:8px;padding:10px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#efefef),color-stop(100%,#fff)) }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }.mn_wrap{padding: 0px 2px 0px 2px;}.bx1,.bx1_0,.bx2,.bx2_0,.mn_wrap,.tp1_border{background:-webkit-linear-gradient(top,#fff 0,#efefef 100%);border-radius:5px;border:3px solid #f9f9f9;padding:2px;margin-bottom:6px;overflow:hidden;box-shadow:0 0 0 1px #000 }.mn_wrap{padding: 0px 2px 0px 2px;}#main{margin-top:74px;margin-bottom:0 }#main .menu{width:230px;position:fixed;z-index:1058;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
				} else {
					if (KZ_selStyleListalka) {
						styleListalka += '#main .content{padding: 42px 4px 10px 200px;}table.t_peer.w100p {margin-top: 0px;}DIV.content DIV.bx2{border:0 solid #f1d29c00;padding:3px;font-size:12px}DIV.content DIV.mn1_content DIV.bx1.stable,DIV.content DIV.mn_wrap DIV.mn1_content DIV.bx2_0{padding:0;background:0 0;font-size:12px;box-shadow:0 0 0 1px transparent;border:none}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.mn1_menu{display:none;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;position:fixed;z-index:1059;top:50px;margin-left:-1px;background:#fafafa repeat-x scroll top;border:1px solid rgba(0,0,0,.6);padding:10px;overflow:hidden;border-radius:0px 0px 5px 5px}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
					} else {
						styleListalka += '#main .content{padding: 22px 5px 10px 200px;}table.t_peer.w100p {margin-top: 0px;}DIV.content DIV.bx2{border:0 solid #f1d29c00;padding:3px;font-size:12px}DIV.content DIV.mn1_content DIV.bx1.stable,DIV.content DIV.mn_wrap DIV.mn1_content DIV.bx2_0{padding:0;background:0 0;font-size:12px;box-shadow:0 0 0 1px transparent;border:none}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.mn1_menu{display:none;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;position:fixed;z-index:1059;top:50px;margin-left:0px;background:#fafafa repeat-x scroll top;border:1px solid rgba(0,0,0,.6);padding:10px;overflow:hidden;border-radius:0px 0px 5px 5px}';
					}
					StyleFixCss += '#footer,#header>DIV.logo,#header>DIV.menu>form,#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(2),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(7),#header>DIV.menu_cont>DIV.menu>ul>li:nth-child(8),#header>SPAN.zan_l,#header>SPAN.zan_r,#header>div.menu_cont>div.search,#header>table,#main>DIV.content>DIV[class="pad0x0x5x0 center"],#main>DIV.menu>DIV:nth-child(2),#main>DIV.menu>DIV:nth-child(5),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(3),FORM DIV.bx1_0 .tables1 tbody tr:nth-of-type(5){display:none;}#main>div.content>form{position:fixed;z-index:1059;top:48px;margin-left: 1px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }.bx1,.bx1_0,.bx2,.bx2_0,.mn_wrap,.tp1_border{background:-webkit-linear-gradient(top,#fff 0,#efefef 100%);border-radius:5px;border:3px solid #f9f9f9;padding:2px;margin-bottom:6px;overflow:hidden;box-shadow:0 0 0 1px #000 }.mn_wrap{padding: 0px 2px 0px 2px;}#main{margin-top:74px;margin-bottom:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
				}
			} else {
				if (KZ_selStyleListalka) {
					styleListalka += '.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;overflow:hidden;padding:0px 0px 8px 0px;margin:0}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
				} else {
					styleListalka += '.paginator{padding: 3px 0px 3px 0px;margin: 0px 0px 5px 0px;}.paginator ul{list-style:none}.paginator ul li{list-style:none}.paginator ul li.dots{cursor:not-allowed;user-select:none}.paginator ul li a{text-decoration:none;user-select:none}.paginator ul li.current a{text-decoration:none;user-select:none}';
				}
				if (KZ_selBeautySearchForm) {
					BeautySearchForm += 'TABLE.tables1 INPUT[type=submit]{text-transform:uppercase;cursor:pointer;outline:0;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;border-radius:.25rem;transition:.1s;color:#fff;background-color:#dc3545;border-color:#dc3545;text-shadow:0 0 1px #000,1px 1px 1px #000}TABLE.tables1 INPUT[type=submit]:hover{color:#fff;background-color:#c82333}TABLE.tables1 INPUT[type=submit]:active,TABLE.tables1 INPUT[type=submit]:focus{color:#fff;background-color:#bd2130;border-color:#b21f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}TABLE.tables1 INPUT[type=submit]{width:210px;height:34px;padding:0;font-size:24px}TABLE.tables1 tr{margin:0;padding:0;border:0}TABLE.tables1 td{margin:0;padding:6px 0 0 0;border:0}TABLE.tables1 INPUT[name="s"]{padding:0 0 2px 5px;margin:0 0 0 3px;font-size:20px;font-weight:400;height:34px;color:#000;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT{text-transform:uppercase;padding:0;margin:0 2px;font-size:16px;font-weight:400;height:34px;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT[name="g"]{width:134px}TABLE.tables1 SELECT[name="c"]{width:258px}TABLE.tables1 SELECT[name="v"]{width:242px}TABLE.tables1 SELECT[name="d"]{width:100px}TABLE.tables1 SELECT[name="w"]{width:134px}TABLE.tables1 SELECT[name="t"]{width:126px}TABLE.tables1 SELECT[name="f"]{width:80px}TABLE.tables1 INPUT::-ms-expand,TABLE.tables1 SELECT::-ms-expand{background-color:transparent;border:0}TABLE.tables1 INPUT:hover,TABLE.tables1 SELECT:hover{color:#495057;background-color:#fff;border-color:#0000008C;outline:0}TABLE.tables1 INPUT:active,TABLE.tables1 INPUT:focus,TABLE.tables1 SELECT:active,TABLE.tables1 SELECT:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}';
				}
				if (KZ_selBeautyHeaderMenu) {
					if (KZ_selBeautySearchForm) {
						if (KZ_selStyleListalka) {
							styleListalka += '#main .content{padding: 0px 4px 10px 240px;}.paginator{top:163px;margin-left:10px}div.bx1_0 {-webkit-border-radius: inherit;}';
						} else {
							styleListalka += '#main .content{padding: 0px 4px 10px 240px;}.paginator{top:189px;margin-left:9px}div.bx1_0 {-webkit-border-radius: inherit;}';
						}
					} else {
						if (KZ_selStyleListalka) {
							styleListalka += '#main .content{padding: 0px 4px 10px 240px;}.paginator{top:130px;margin-left:7px}div.bx1_0 {-webkit-border-radius: inherit;}';
						} else {
							styleListalka += '#main .content{padding: 0px 4px 10px 240px;}.paginator{top:124px;margin-left:7px}div.bx1_0 {-webkit-border-radius: inherit;}';
						}
					}
					StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {top: 67px;margin-left: 0px;width: 100%;border-radius: 5px;}#header{margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;top:10px;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li a,#header .menu_cont .menu ul li a{display:block;float:left;height:auto;color:#4c4c4c;font-size:20px;font-weight:400;text-align:center;border:1px solid #bbb;border-radius:8px;padding:10px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#efefef),color-stop(100%,#fff)) }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }.bx1,.bx1_0,.bx2,.bx2_0,.mn_wrap,.tp1_border{background:-webkit-linear-gradient(top,#fff 0,#efefef 100%);border-radius:5px;border:3px solid #f9f9f9;padding:2px;margin-bottom:6px;overflow:hidden;box-shadow:0 0 0 1px #000 }.mn_wrap{padding: 0px 2px 0px 2px;}#main{margin-top:8px;margin-bottom:0 }#main .menu{width:230px;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
				} else {
					StyleFixCss += '#header .menu_cont{height:0;padding:0 }#header{-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }.mn_wrap{padding: 0px 2px 0px 2px;}.bx1,.bx1_0,.bx2,.bx2_0,.mn_wrap,.tp1_border{background: #fafafa url(/pic/sbg.gif) repeat-x scroll top;border: 3px solid #f1d29c;padding: 0;margin-bottom: 5px;overflow: hidden;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
				}
			}
			if (/kinozal(.me|.tv|.guru|.website|tv.life)\/(browse.php.*)/.test(get_url)) {
				if (KZ_selBeautySearchForm) {
					BeautySearchForm += 'TABLE.tables1 INPUT[type=submit]{text-transform:uppercase;cursor:pointer;outline:0;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;border-radius:.25rem;transition:.1s;color:#fff;background-color:#dc3545;border-color:#dc3545;text-shadow:0 0 1px #000,1px 1px 1px #000}TABLE.tables1 INPUT[type=submit]:hover{color:#fff;background-color:#c82333}TABLE.tables1 INPUT[type=submit]:active,TABLE.tables1 INPUT[type=submit]:focus{color:#fff;background-color:#bd2130;border-color:#b21f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}TABLE.tables1 INPUT[type=submit]{width:210px;height:34px;padding:0;font-size:24px}TABLE.tables1 tr{margin:0;padding:0;border:0}TABLE.tables1 td{margin:0;padding:6px 0 0 0;border:0}TABLE.tables1 INPUT[name="s"]{text-transform: uppercase;padding:0 0 2px 5px;margin:0 0 0 3px;font-size:20px;font-weight:400;height:34px;color:#000;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT{text-transform:uppercase;padding:0;margin:0 2px;font-size:16px;font-weight:400;height:34px;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT[name="g"]{width:134px}TABLE.tables1 SELECT[name="c"]{width:258px}TABLE.tables1 SELECT[name="v"]{width:242px}TABLE.tables1 SELECT[name="d"]{width:100px}TABLE.tables1 SELECT[name="w"]{width:134px}TABLE.tables1 SELECT[name="t"]{width:126px}TABLE.tables1 SELECT[name="f"]{width:80px}TABLE.tables1 INPUT::-ms-expand,TABLE.tables1 SELECT::-ms-expand{background-color:transparent;border:0}TABLE.tables1 INPUT:hover,TABLE.tables1 SELECT:hover{color:#495057;background-color:#fff;border-color:#0000008C;outline:0}TABLE.tables1 INPUT:active,TABLE.tables1 INPUT:focus,TABLE.tables1 SELECT:active,TABLE.tables1 SELECT:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}';
				}
				if (KZ_selFix) {
					if (KZ_selBeautySearchForm) {
						if (KZ_selBeautyHeaderMenu) {
							StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {position: fixed;z-index: 1059;top: 67px;margin-left: 0px;width: 100%;border-bottom-left-radius: 7px;}#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;position:fixed;top:10px;z-index:1058;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:74px;margin-bottom:0 }#main .menu{width:230px;position:fixed;z-index:1058;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
							if (KZ_selStyleListalka) {
								styleListalka += '#main .content{padding: 141px 5px 10px 240px;}div.bx1_0 {height: 136px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}.paginator{top: 160px;margin-left: 7px;background: none;border: none;padding: 0px;border-radius: unset;}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
							} else {
								styleListalka += '#main .content{padding: 116px 5px 10px 240px;}div.bx1_0 {height: 112px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}.paginator{top: 158px;margin-left: 7px;background: none;border: none;padding: 0px;border-radius: unset;}.paginator ul{list-style:none}.paginator ul li{list-style:none}.paginator ul li.dots{cursor:not-allowed;user-select:none}.paginator ul li a{text-decoration:none;user-select:none}.paginator ul li.current a{text-decoration:none;user-select:none}';
							}
						} else {
							StyleFixCss += '#main>div.content>form{position:fixed;z-index:1059;top:51px;margin-left: 0px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#main{margin-top:74px;margin-bottom:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
							if (KZ_selStyleListalka) {
								styleListalka += '#main .content{padding: 125px 5px 10px 200px;}div.bx1_0 {height: 136px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}.paginator{top: 144px;margin-left: 7px;background: none;border: none;padding: 0px;border-radius: unset;}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
							} else {
								styleListalka += '#main .content{padding: 100px 5px 10px 200px;}div.bx1_0 {height: 112px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}.paginator{top: 140px;margin-left: 7px;background: none;border: none;padding: 0px;border-radius: unset;}.paginator ul{list-style:none}.paginator ul li{list-style:none}.paginator ul li.dots{cursor:not-allowed;user-select:none}.paginator ul li a{text-decoration:none;user-select:none}.paginator ul li.current a{text-decoration:none;user-select:none}';
							}
						}
					} else {
						if (KZ_selBeautyHeaderMenu) {
							StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {position: fixed;z-index: 1059;top: 67px;margin-left: 0px;width: 100%;border-bottom-left-radius: 7px;}#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;position:fixed;top:10px;z-index:1058;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:74px;margin-bottom:0 }#main .menu{width:230px;position:fixed;z-index:1058;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
							if (KZ_selStyleListalka) {
								styleListalka += '#main .content{padding: 105px 5px 10px 240px;}div.bx1_0 {height: 100px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}.paginator{position:fixed;z-index:1059;top:128px;margin-left:5px;display: block;font-family: "Open Sans";text-transform: uppercase;background: 0;border: 0;padding: 0px;overflow: hidden;border-radius: 0;}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
							} else {
								styleListalka += '#main .content{padding: 82px 5px 10px 240px;}.paginator{display: block;font-family: "Open Sans";text-transform: uppercase;position:fixed;z-index:1059;top:124px;margin-left:5px;background: none;border: none;padding: 0px;overflow: hidden;border-radius: unset;}div.bx1_0 {height: 77px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}';
							}
						} else {
							StyleFixCss += '#main>div.content>form{position:fixed;z-index:1059;top:51px;margin-left: 0px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#main{margin-top:74px;margin-bottom:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
							if (KZ_selStyleListalka) {
								styleListalka += '#main .content{padding: 89px 5px 10px 200px;}div.bx1_0 {height: 100px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}.paginator{position:fixed;z-index:1059;top:110px;margin-left:5px;display: block;font-family: "Open Sans";text-transform: uppercase;background: 0;border: 0;padding: 0px;overflow: hidden;border-radius: 0;}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
							} else {
								styleListalka += '#main .content{padding: 66px 5px 10px 200px;}.paginator{display: block;font-family: "Open Sans";text-transform: uppercase;position:fixed;z-index:1059;top:108px;margin-left:5px;background: none;border: none;padding: 0px;overflow: hidden;border-radius: unset;}div.bx1_0 {height: 77px;border:1px solid #000;position:relative;top:-1px;margin-left:-1px;-webkit-border-radius:0px 0px 5px 5px;-webkit-box-shadow:0 0 0 0 #000}';
							}
						}
					}
				} else {
					if (KZ_selBeautyHeaderMenu) {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {top: 67px;margin-left: 0px;width: 100%;border-radius: 5px;}#header{margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;top:10px;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:8px;margin-bottom:0 }#main .menu{width:230px;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
						styleListalka += '#main .content{padding: 0px 4px 10px 200px;}.paginator{top:163px;margin-left:10px}';
					} else {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#header{-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }';
						styleListalka += '#main .content{padding: 0px 4px 10px 200px;}.paginator{top:163px;margin-left:10px}';
					}
					if (KZ_selBeautySearchForm) {
						if (KZ_selStyleListalka) {
							styleListalka += 'div.bx1_0 {-webkit-border-radius: inherit;}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;overflow:hidden;padding:0 0 2px 0;margin:0}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
						} else {
							styleListalka += 'div.bx1_0 {padding: 3px 5px 10px 5px !important;-webkit-border-radius: inherit;}.paginator{padding: 3px 0px 3px 0px;margin: 0px 0px 5px 0px;}.paginator ul{list-style:none}.paginator ul li{list-style:none}.paginator ul li.dots{cursor:not-allowed;user-select:none}.paginator ul li a{text-decoration:none;user-select:none}.paginator ul li.current a{text-decoration:none;user-select:none}';
						}
					} else {
						if (KZ_selStyleListalka) {
							styleListalka += 'div.bx1_0 {-webkit-border-radius: inherit;}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;overflow:hidden;padding:0 0 2px 0;margin:0}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
						} else {
							styleListalka += 'div.bx1_0 {-webkit-border-radius: inherit;}.paginator{padding: 3px 0px 3px 0px;margin: 0px 0px 5px 0px;}.paginator ul{list-style:none}.paginator ul li{list-style:none}.paginator ul li.dots{cursor:not-allowed;user-select:none}.paginator ul li a{text-decoration:none;user-select:none}.paginator ul li.current a{text-decoration:none;user-select:none}';
						}
					}
				}
			}

			if (/kinozal(.me|.tv|.guru|.website|tv.life)\/(top.php.*)/.test(get_url)) {
				if (KZ_selFix) {
					if (KZ_selBeautyHeaderMenu) {
						if (KZ_selStyleListalka) {
							styleListalka += '.paginator{top:66px !important;}#main .content{padding: 60px 5px 10px 240px !important;}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator{margin-left:-4px;}';
						} else {
							styleListalka += '.paginator{top:66px !important;}#main .content{padding: 40px 5px 10px 240px !important;}table.t_peer.w100p {margin-top: 0px;}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.mn1_menu{display:none;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;position:fixed;z-index:1059;top:50px;margin-left:-4px;background:#fafafa repeat-x scroll top;border:1px solid rgba(0,0,0,.6);padding:10px;overflow:hidden;border-radius:0px 0px 5px 5px}';
						}
					} else {
						if (KZ_selStyleListalka) {
							styleListalka += '.paginator{top:51px !important;}#main .content{padding: 62px 5px 10px 200px !important;}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator{margin-left:-4px;}';
						} else {
							styleListalka += '.paginator{top:51px !important;}#main .content{padding: 42px 5px 10px 200px !important;}table.t_peer.w100p {margin-top: 0px;}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.mn1_menu{display:none;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;position:fixed;z-index:1059;top:50px;margin-left:-4px;background:#fafafa repeat-x scroll top;border:1px solid rgba(0,0,0,.6);padding:10px;overflow:hidden;border-radius:0px 0px 5px 5px}';
						}
						StyleFixCss += '#main>div.content>form{position:fixed;z-index:1059;top:48px;margin-left: 1px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px;display:block;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }#main{margin-top:56px;margin-bottom:0 }#header{margin-top:-55px;}';
					}
					GM_addStyle('DIV.content DIV.mn1_content DIV.bx1.stable,DIV.content DIV.mn_wrap DIV.mn1_content DIV.bx2_0{padding:4px;background:0 0;font-size:12px;box-shadow:0 0 0 1px transparent;border:none}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px;position:relative;border:0 solid silver;display:block;border-radius:7px}');
				}
			}
			if (/kinozal(.me|.tv|.guru|.website|tv.life)\/(novinki.php)/.test(get_url)) {
				if (KZ_selFix) {
					if (KZ_selBeautyHeaderMenu) {
						StyleFixCss += '#main .content{padding: 0px 5px 10px 240px !important;}#header .menu_cont{height:0;padding:0 }#main>div.content>form {position: fixed;z-index: 1059;top: 67px;margin-left: 0px;width: 100%;border-bottom-left-radius: 7px;}#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;position:fixed;top:10px;z-index:1058;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:74px;margin-bottom:0 }#main .menu{width:230px;position:fixed;z-index:1058;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px;padding: 0 5px 0 0px; }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					} else {
						StyleFixCss += '#main .content{padding: 0px 5px 10px 200px !important;}#main>div.content>form{position:fixed;z-index:1059;top:48px;margin-left: 1px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#main{margin-top:74px;margin-bottom:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }#main{margin-top:56px;margin-bottom:0 }#header{margin-top:-55px;}';
					}
				} else {
					if (KZ_selBeautySearchForm) {
						BeautySearchForm += 'TABLE.tables1 INPUT[type=submit]{text-transform:uppercase;cursor:pointer;outline:0;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;border-radius:.25rem;transition:.1s;color:#fff;background-color:#dc3545;border-color:#dc3545;text-shadow:0 0 1px #000,1px 1px 1px #000}TABLE.tables1 INPUT[type=submit]:hover{color:#fff;background-color:#c82333}TABLE.tables1 INPUT[type=submit]:active,TABLE.tables1 INPUT[type=submit]:focus{color:#fff;background-color:#bd2130;border-color:#b21f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}TABLE.tables1 INPUT[type=submit]{width:210px;height:34px;padding:0;font-size:24px}TABLE.tables1 tr{margin:0;padding:0;border:0}TABLE.tables1 td{margin:0;padding:6px 0 0 0;border:0}TABLE.tables1 INPUT[name="s"]{padding:0 0 2px 5px;margin:0 0 0 3px;font-size:20px;font-weight:400;height:34px;color:#000;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT{text-transform:uppercase;padding:0;margin:0 2px;font-size:16px;font-weight:400;height:34px;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT[name="g"]{width:134px}TABLE.tables1 SELECT[name="c"]{width:258px}TABLE.tables1 SELECT[name="v"]{width:242px}TABLE.tables1 SELECT[name="d"]{width:100px}TABLE.tables1 SELECT[name="w"]{width:134px}TABLE.tables1 SELECT[name="t"]{width:126px}TABLE.tables1 SELECT[name="f"]{width:80px}TABLE.tables1 INPUT::-ms-expand,TABLE.tables1 SELECT::-ms-expand{background-color:transparent;border:0}TABLE.tables1 INPUT:hover,TABLE.tables1 SELECT:hover{color:#495057;background-color:#fff;border-color:#0000008C;outline:0}TABLE.tables1 INPUT:active,TABLE.tables1 INPUT:focus,TABLE.tables1 SELECT:active,TABLE.tables1 SELECT:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}';
					}
					if (KZ_selBeautyHeaderMenu) {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {top: 67px;margin-left: 0px;width: 100%;border-radius: 5px;}#header{margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;top:10px;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:8px;margin-bottom:0 }#main .menu{width:230px;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content{margin-top:0px;padding:1px;}.content .mn1_menu{margin-top:5px;display:none;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					} else {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#header{-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }';
					}
				}
				GM_addStyle('.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}');
			}
			if (/kinozal(.me|.tv|.guru|.website|tv.life)\/((persons|my|inbox|friends|userdetails).php)/.test(get_url)) {
				if (KZ_selFix) {
					if (KZ_selBeautyHeaderMenu) {
						StyleFixCss += '#main .content{padding: 0px 5px 10px 240px;}#header .menu_cont{height:0;padding:0 }#main>div.content>form {position: fixed;z-index: 1059;top: 67px;margin-left: 0px;width: 100%;border-bottom-left-radius: 7px;}#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;position:fixed;top:10px;z-index:1058;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:74px;margin-bottom:0 }#main .menu{width:230px;position:fixed;z-index:1058;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px;display:block;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					} else {
						StyleFixCss += '#main .content{padding: 0px 5px 10px 200px !important;}#main>div.content>form{position:fixed;z-index:1059;top:48px;margin-left: 1px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px;display:block;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }#main{margin-top:56px;margin-bottom:0 }#header{margin-top:-55px;}';
					}
				} else {
					if (KZ_selBeautySearchForm) {
						BeautySearchForm += 'TABLE.tables1 INPUT[type=submit]{text-transform:uppercase;cursor:pointer;outline:0;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;border-radius:.25rem;transition:.1s;color:#fff;background-color:#dc3545;border-color:#dc3545;text-shadow:0 0 1px #000,1px 1px 1px #000}TABLE.tables1 INPUT[type=submit]:hover{color:#fff;background-color:#c82333}TABLE.tables1 INPUT[type=submit]:active,TABLE.tables1 INPUT[type=submit]:focus{color:#fff;background-color:#bd2130;border-color:#b21f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}TABLE.tables1 INPUT[type=submit]{width:210px;height:34px;padding:0;font-size:24px}TABLE.tables1 tr{margin:0;padding:0;border:0}TABLE.tables1 td{margin:0;padding:6px 0 0 0;border:0}TABLE.tables1 INPUT[name="s"]{padding:0 0 2px 5px;margin:0 0 0 3px;font-size:20px;font-weight:400;height:34px;color:#000;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT{text-transform:uppercase;padding:0;margin:0 2px;font-size:16px;font-weight:400;height:34px;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT[name="g"]{width:134px}TABLE.tables1 SELECT[name="c"]{width:258px}TABLE.tables1 SELECT[name="v"]{width:242px}TABLE.tables1 SELECT[name="d"]{width:100px}TABLE.tables1 SELECT[name="w"]{width:134px}TABLE.tables1 SELECT[name="t"]{width:126px}TABLE.tables1 SELECT[name="f"]{width:80px}TABLE.tables1 INPUT::-ms-expand,TABLE.tables1 SELECT::-ms-expand{background-color:transparent;border:0}TABLE.tables1 INPUT:hover,TABLE.tables1 SELECT:hover{color:#495057;background-color:#fff;border-color:#0000008C;outline:0}TABLE.tables1 INPUT:active,TABLE.tables1 INPUT:focus,TABLE.tables1 SELECT:active,TABLE.tables1 SELECT:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}';
					}
					if (KZ_selBeautyHeaderMenu) {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {top: 67px;margin-left: 0px;width: 100%;border-radius: 5px;}#header{margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;top:10px;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:8px;margin-bottom:0 }#main .menu{width:230px;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content{margin-top:0px;padding:1px;}.content .mn1_menu{margin-top:5px;display:none;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					} else {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#header{-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }';
					}
				}
				if (/(torr|torr&page=.*)$/.test(get_url)) {
					if (KZ_selFix) {
						if (KZ_selStyleListalka) {
							styleListalka += '#main .content{padding: 59px 5px 10px 240px;}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}';
						} else {
							styleListalka += '#main .content{padding: 42px 5px 10px 200px !important;}table.t_peer.w100p {margin-top: 0px;}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.mn1_menu{display:block}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;position:fixed;z-index:1059;top:51px;margin-left:-6px;background:#fafafa repeat-x scroll top;border:1px solid rgba(0,0,0,.6);padding:10px;overflow:hidden;border-radius:0px 0px 5px 5px}';
						}
					}
				} else if (/torrtop$/.test(get_url)) {
					if (KZ_selFix) {
						styleListalka += '#main .content{padding: 0px 5px 10px 200px !important;}table.t_peer.w100p {margin-top: 0px;}.mn1_content{padding:0}.content .mn1_content{margin-top:0}.mn1_menu{display:block}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}';
					}
				}
			}
			if (/kinozal(.me|.tv|.guru|.website|tv.life)\/(personsearch.php)/.test(get_url)) {
				if (KZ_selFix) {
					if (KZ_selBeautyHeaderMenu) {
						StyleFixCss += '#main .content{padding: 0px 5px 10px 240px !important;}#header .menu_cont{height:0;padding:0 }#main>div.content>form {position: fixed;z-index: 1059;top: 67px;margin-left: 0px;width: 100%;border-bottom-left-radius: 7px;}#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;position:fixed;top:10px;z-index:1058;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:74px;margin-bottom:0 }#main .menu{width:230px;position:fixed;z-index:1058;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px;display:block;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					} else {
						StyleFixCss += '#main .content{padding: 0px 5px 10px 200px !important;}#main>div.content>form{position:fixed;z-index:1059;top:48px;margin-left: 1px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px;display:block;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }#main{margin-top:56px;margin-bottom:0 }#header{margin-top:-55px;}';
					}
				} else {
					if (KZ_selBeautySearchForm) {
						BeautySearchForm += 'TABLE.tables1 INPUT[type=submit]{text-transform:uppercase;cursor:pointer;outline:0;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;border-radius:.25rem;transition:.1s;color:#fff;background-color:#dc3545;border-color:#dc3545;text-shadow:0 0 1px #000,1px 1px 1px #000}TABLE.tables1 INPUT[type=submit]:hover{color:#fff;background-color:#c82333}TABLE.tables1 INPUT[type=submit]:active,TABLE.tables1 INPUT[type=submit]:focus{color:#fff;background-color:#bd2130;border-color:#b21f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}TABLE.tables1 INPUT[type=submit]{width:210px;height:34px;padding:0;font-size:24px}TABLE.tables1 tr{margin:0;padding:0;border:0}TABLE.tables1 td{margin:0;padding:6px 0 0 0;border:0}TABLE.tables1 INPUT[name="s"]{padding:0 0 2px 5px;margin:0 0 0 3px;font-size:20px;font-weight:400;height:34px;color:#000;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT{text-transform:uppercase;padding:0;margin:0 2px;font-size:16px;font-weight:400;height:34px;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT[name="g"]{width:134px}TABLE.tables1 SELECT[name="c"]{width:258px}TABLE.tables1 SELECT[name="v"]{width:242px}TABLE.tables1 SELECT[name="d"]{width:100px}TABLE.tables1 SELECT[name="w"]{width:134px}TABLE.tables1 SELECT[name="t"]{width:126px}TABLE.tables1 SELECT[name="f"]{width:80px}TABLE.tables1 INPUT::-ms-expand,TABLE.tables1 SELECT::-ms-expand{background-color:transparent;border:0}TABLE.tables1 INPUT:hover,TABLE.tables1 SELECT:hover{color:#495057;background-color:#fff;border-color:#0000008C;outline:0}TABLE.tables1 INPUT:active,TABLE.tables1 INPUT:focus,TABLE.tables1 SELECT:active,TABLE.tables1 SELECT:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}';
					}
					if (KZ_selBeautyHeaderMenu) {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {top: 67px;margin-left: 0px;width: 100%;border-radius: 5px;}#header{margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;top:10px;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:8px;margin-bottom:0 }#main .menu{width:230px;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content{margin-top:0px;padding:1px;}.content .mn1_menu{margin-top:5px;display:none;}.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					} else {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#header{-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }';
					}
				}
				GM_addStyle('.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}');
			}
			if (/kinozal(.me|.tv|.guru|.website|tv.life)\/((details|comment).php.*)/.test(get_url)) {
				if (KZ_selFix) {
					if (KZ_selBeautyHeaderMenu) {
						if (KZ_selStyleListalka) {
							styleListalka += '#main .content{padding: 0px 4px 10px 240px;}table.t_peer.w100p {margin-top: 0px;}.mn1_menu{display:block}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}';
						} else {
							styleListalka += '#main .content{padding: 0px 4px 10px 240px;}table.t_peer.w100p {margin-top: 0px;}.mn1_menu{display:block;float: left;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}';
						}
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {position: fixed;z-index: 1059;top: 67px;margin-left: 0px;width: 100%;border-bottom-left-radius: 7px;}#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;position:fixed;top:10px;z-index:1058;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:74px;margin-bottom:0 }#main .menu{width:230px;position:fixed;z-index:1058;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content{margin-top:0px;padding:0 5px 0 205px; }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }.paginator{position:unset !important;border-radius: 5px !important;}div.bx1_0{height:136px;border:1px solid #000;position:relative;top:2px;margin-left:-1px;border-radius:0;-webkit-border-radius:0;-webkit-box-shadow:0 0 0 0 #000}';
					} else {
						if (KZ_selStyleListalka) {
							styleListalka += '.paginator{position:fixed;z-index:1059;top:144px;margin-left:8px;}div.bx1_0{height:136px;border:1px solid #000;position:relative;top:2px;margin-left:-1px;border-radius:0;-webkit-border-radius:0;-webkit-box-shadow:0 0 0 0 #000}';
						} else {
							styleListalka += 'table.t_peer.w100p {margin-top: 116px;}.paginator{position:fixed;z-index:1059;top:158px;margin-left:5px}div.bx1_0{height:115px;border:1px solid #000;position:relative;top:2px;margin-left:-1px;border-radius:0;-webkit-border-radius:0;-webkit-box-shadow:0 0 0 0 #000}';
						}
						StyleFixCss += '#main .content{padding: 124px 0px 0px 199px;}#main>div.content>form{position:fixed;z-index:1059;top:48px;margin-left: 1px;width:100% }#header .menu_cont{height:0;padding:0 }#header{position:fixed;z-index:1059;margin-top:-74px;margin-bottom:0;margin-left:0;width:100%;height:50px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#main{margin-top:74px;margin-bottom:0 }#main .menu{position:fixed;z-index:1058;margin-top:0;top: 56px;}.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_content,.content .mn1_menu{margin-top:5px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					}
				} else {
					if (KZ_selStyleListalka) {
						styleListalka += '.paginator{display:block;font-family:"Open Sans";text-transform:uppercase;overflow:hidden;padding:0 0 2px 0;margin:0}.paginator ul{list-style:none;padding:0;margin:0}.paginator ul li{list-style:none;padding:0;margin:0 10px 0 0;float:left}.paginator ul li a{user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:10px 16px;margin:0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.paginator ul li.current a{padding:10px 16px;margin:0;background:#868686;color:#fff;border-color:#444;cursor:pointer}.paginator ul li.current:hover a{background:#868686;color:#fff}.paginator ul li:hover a{color:#393939;text-decoration:none;background:#fcfcfc}.paginator ul li.dots{cursor:not-allowed;user-select:none;float:left;color:#666;font-weight:700;text-align:center;border:1px solid #bbb;font-size:16px;padding:8px 14px;margin:0 10px 0 0;border-radius:3px;background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef))}.mn1_menu{display:block;}';
					} else {
						styleListalka += '.paginator{padding: 3px 0px 3px 0px;margin: 0px 0px 5px 0px;}.paginator ul{list-style:none}.paginator ul li{list-style:none}.paginator ul li.dots{cursor:not-allowed;user-select:none}.paginator ul li a{text-decoration:none;user-select:none}.paginator ul li.current a{text-decoration:none;user-select:none}.mn1_menu{display:block;}';
					}
					if (KZ_selBeautySearchForm) {
						BeautySearchForm += 'TABLE.tables1 INPUT[type=submit]{text-transform:uppercase;cursor:pointer;outline:0;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;border-radius:.25rem;transition:.1s;color:#fff;background-color:#dc3545;border-color:#dc3545;text-shadow:0 0 1px #000,1px 1px 1px #000}TABLE.tables1 INPUT[type=submit]:hover{color:#fff;background-color:#c82333}TABLE.tables1 INPUT[type=submit]:active,TABLE.tables1 INPUT[type=submit]:focus{color:#fff;background-color:#bd2130;border-color:#b21f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}TABLE.tables1 INPUT[type=submit]{width:210px;height:34px;padding:0;font-size:24px}TABLE.tables1 tr{margin:0;padding:0;border:0}TABLE.tables1 td{margin:0;padding:6px 0 0 0;border:0}TABLE.tables1 INPUT[name="s"]{padding:0 0 2px 5px;margin:0 0 0 3px;font-size:20px;font-weight:400;height:34px;color:#000;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT{text-transform:uppercase;padding:0;margin:0 2px;font-size:16px;font-weight:400;height:34px;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:.1s}TABLE.tables1 SELECT[name="g"]{width:134px}TABLE.tables1 SELECT[name="c"]{width:258px}TABLE.tables1 SELECT[name="v"]{width:242px}TABLE.tables1 SELECT[name="d"]{width:100px}TABLE.tables1 SELECT[name="w"]{width:134px}TABLE.tables1 SELECT[name="t"]{width:126px}TABLE.tables1 SELECT[name="f"]{width:80px}TABLE.tables1 INPUT::-ms-expand,TABLE.tables1 SELECT::-ms-expand{background-color:transparent;border:0}TABLE.tables1 INPUT:hover,TABLE.tables1 SELECT:hover{color:#495057;background-color:#fff;border-color:#0000008C;outline:0}TABLE.tables1 INPUT:active,TABLE.tables1 INPUT:focus,TABLE.tables1 SELECT:active,TABLE.tables1 SELECT:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}';
					}
					if (KZ_selBeautyHeaderMenu) {
						if (KZ_selBeautySearchForm) {
							if (KZ_selStyleListalka) {
								styleListalka += '.paginator{top:163px;margin-left:10px}div.bx1_0 {-webkit-border-radius: inherit;}';
							} else {
								styleListalka += '#main .content{padding: 0px 4px 10px 240px;}.paginator{top:189px;margin-left:9px}div.bx1_0 {-webkit-border-radius: inherit;}';
							}
						} else {
							if (KZ_selStyleListalka) {
								styleListalka += '#main .content{padding: 0px 4px 10px 240px;}.paginator{top:130px;margin-left:7px}div.bx1_0 {-webkit-border-radius: inherit;}';
							} else {
								styleListalka += '#main .content{padding: 0px 4px 10px 240px;}.paginator{top:124px;margin-left:7px}div.bx1_0 {-webkit-border-radius: inherit;}';
							}
						}
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#main>div.content>form {top: 67px;margin-left: 0px;width: 100%;border-radius: 5px;}#header{margin-bottom:0;margin-left:0;width:100%;height:66px;-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }#header DIV.menu_cont DIV.menu ul{float:left;margin:0;padding:0 0 5px 10px;top:10px;max-height:fit-content;font-family:"Open Sans";text-transform:uppercase }#header .menu ul li,#header .menu_cont .menu ul li{float:left;list-style:none;position:relative;margin:0 8px 0 0;padding:0 }#header .menu ul li:hover a,#header .menu_cont .menu ul li:hover a{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(100%,#efefef));color:#000 }#main{margin-top:8px;margin-bottom:0 }#main .menu{width:230px;font-size:12px;margin-top:0 }.u2,.u2 a,a.u2,a.u2:active,a.u2:link,a.u2:visited{font-weight:700;color:#c30000;text-decoration:none }ul.men li.tp2{padding:4px;background-color:#f1d29c;margin:0 0 4px 0;border-radius:5px;font-size:14px;font-weight:700 }ul.men li{padding-left:14px;padding:0 14px 2px;margin:0 0 2px 0 }.pad5x5{margin:0;padding:5px 5px;overflow:hidden }.mn2{background:0 0;border:#000 6px }.content .mn1_menu .floatright.green.n{font-weight:700;color:#000 }';
					} else {
						StyleFixCss += '#header .menu_cont{height:0;padding:0 }#header{-webkit-box-shadow:0 0 0 1px #000 }#header .menu,#header .menu_cont .menu{margin:0;margin-right:0;padding:0;position:relative;height:auto;top:0 }';
					}
				}
				GM_addStyle('.mn1_menu{display:none;}.stable img{height:296px;width:202px;cursor:pointer;float:left;margin:2px 2px 0 0;position:relative;border:1px solid #000;display:block;border-radius:16px}');
			}
			GM_addStyle(StyleFixCss + BeautySearchForm + styleListalka + StyleRazdacha);
			if (KZ_SwalDefaultStyle == 1) {
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css";');
			} else if (KZ_SwalDefaultStyle == 2) {
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-borderless/borderless.min.css";.swal2-container.swal2-backdrop-show, .swal2-container.swal2-noanimation {background: rgb(255 255 255);}.swal2-title {color: #000;}');
			} else if (KZ_SwalDefaultStyle == 3) {
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma/bulma.min.css";');
			} else if (KZ_SwalDefaultStyle == 4) {
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-default/default.min.css";');
			} else if (KZ_SwalDefaultStyle == 5) {
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui/material-ui.min.css";');
			} else if (KZ_SwalDefaultStyle == 6) {
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-minimal/minimal.min.css";');
			}
			$('div#header .menu ul').append(`
<li><a href="javascript:void(0);" id="kinozal_settings" title="Настройка скрипта"><i class="fa fa-cogs"></i> Настройки</a></li>
<li><a href="javascript:void(0);" id="kinozal_style_settings" title="Настройка скрипта"><i class="fa fa-cogs"></i> Стиль</a></li>
${(KZ_ShowTorrServerButton === true ? '<li><a href="javascript:void(0);" id="torrserver_settings" title="Настройка TorrServer"><i class="fa fa-cogs"></i> TorrServer</a></li>' : "")}
`);
			$("div#header .menu ul li a#kinozal_settings").click(function() {
				GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}");
				KinozalCFG.open();
			});
			$("div#header .menu ul li a#torrserver_settings").click(function() {
				GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}");
				TorrServerCFG.open();
			});
			$("div#header .menu ul li a#kinozal_style_settings").click(function() {
				GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}");
				KinozalCFG_CSS.open();
			});
			var get_kinozal_link = KinozalCFG.get('KinopoiskLinkSearch'),
				set_kinozal_link = "";
		}
	} else if (/rutor.(info|is)\//.test(get_url)) {
		if (RUTOR_SwalDefaultStyle == 1) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4@5/bootstrap-4.min.css";');
		} else if (RUTOR_SwalDefaultStyle == 2) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-borderless@5/borderless.min.css";.swal2-container.swal2-backdrop-show, .swal2-container.swal2-noanimation {background: rgb(255 255 255);}.swal2-title {color: #000;}');
		} else if (RUTOR_SwalDefaultStyle == 3) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma@5/bulma.min.css";');
		} else if (RUTOR_SwalDefaultStyle == 4) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-default@5/default.min.css";');
		} else if (RUTOR_SwalDefaultStyle == 5) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui@5/material-ui.min.css";');
		} else if (RUTOR_SwalDefaultStyle == 6) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-minimal@5/minimal.min.css";');
		}
	} else if (/rutracker(.org|.net|.lib)\//.test(get_url)) {
		if (RT_SwalDefaultStyle == 1) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4@5/bootstrap-4.min.css";');
		} else if (RT_SwalDefaultStyle == 2) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-borderless@5/borderless.min.css";.swal2-container.swal2-backdrop-show, .swal2-container.swal2-noanimation {background: rgb(255 255 255);}.swal2-title {color: #000;}');
		} else if (RT_SwalDefaultStyle == 3) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma@5/bulma.min.css";');
		} else if (RT_SwalDefaultStyle == 4) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-default@5/default.min.css";');
		} else if (RT_SwalDefaultStyle == 5) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui@5/material-ui.min.css";');
		} else if (RT_SwalDefaultStyle == 6) {
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-minimal@5/minimal.min.css";');
		}
	}
	GM_addStyle('@import url(https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css);@font-face{font-family:"Open Sans";font-style:normal;font-weight:400;src:local("Open Sans"),local(OpenSans),url(https://themes.googleusercontent.com/static/fonts/opensans/v6/K88pR3goAWT7BTt32Z01mz8E0i7KZn-EPnyo3HZu7kw.woff) format("woff")}.fa{font-family:FontAwesome}.checkboxToggle b{cursor:pointer;position:relative;display:inline-block;width:40px;height:23px;background:#f2f2f2;border:1px solid #b4b4b4;border-radius:23px;vertical-align:middle;transition:all .2s linear;margin-block:0}.checkboxToggle b::after{content:"";position:absolute;left:0;width:18px;height:19px;background-color:#fff;border-radius:30px;box-shadow:0 0 1px 1px rgb(0 0 0 / 60%);transform:translate3d(2px,2px,0);transition:all .2s ease-in-out}.checkboxToggle:active b::after{width:25px;transform:translate3d(2px,2px,0)}.checkboxToggle:active input:checked+b::after{transform:translate3d(7px,2px,0)}.checkboxToggle input{display:none;}.checkboxToggle input:checked+b{background-color:#4bd763;border-color:#3aa24c;box-shadow:0 0 1px 0 rgb(0 0 0 / 100%)}.checkboxToggle input:checked+b::after{transform:translate3d(20px,2px,0)}.ScriptSettingsContainer table{border-collapse:unset;border-spacing:0}.ScriptSettingsContainer tbody>tr:hover td:nth-child(1){background-color:#f5f5f58c;border-radius:10px 0 0 10px;border-top-color:#d0d0d0;border-top-style:solid;border-top-width:1px;border-right-color:#f5f5f58c;border-bottom-color:#d0d0d0;border-bottom-style:solid;border-bottom-width:1px;border-left-color:#d0d0d0;border-left-style:solid;border-left-width:1px}.ScriptSettingsContainer tbody>tr:hover td:nth-child(2){background-color:#f5f5f58c;border-radius:0 10px 10px 0;border-top-color:#d0d0d0;border-top-style:solid;border-top-width:1px;border-right-color:#d0d0d0;border-right-style:solid;border-right-width:1px;border-bottom-color:#d0d0d0;border-bottom-style:solid;border-bottom-width:1px;border-left-color:#f5f5f58c}.ScriptSettingsContainer tbody>tr td:nth-child(1){border:1px solid #fff}.ScriptSettingsContainer tbody>tr td:nth-child(2){border:1px solid #fff;padding:4px 0}.swal2-styled.swal2-cancel,.swal2-styled.swal2-confirm,.swal2-styled.swal2-deny{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000}.swal2-html-container{font-style:normal;text-align:left !important;color:#000;overflow: unset;}.fnm-title{margin:auto;font-weight:bold;font-family:Open Sans;text-transform:uppercase;font-size:32px;margin:0 0 4px 0;padding: 0px;color:rgb(221 60 60);text-shadow:1px 1px 1px rgb(92 0 0)}.fnm-ads-title{font-weight:bold;font-family:Open Sans;text-transform:uppercase;font-size:22px;text-align:center;padding:0 0 4px 0}.fnm-no-ads{color:rgb(0 153 0);text-shadow:1px 1px 1px rgb(0 78 0)}.fnm-with-ads{color:rgb(255 0 0);text-shadow:1px 1px 1px rgb(78 0 0)}.btn_tiny{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:14px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_small{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:18px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_normal{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:24px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_big{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:30px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_cred{color:#fff;background-color:#d92638}.btn_cred:hover{color:#fff;background-color:#c32232;box-shadow:0 0 0 .1rem rgba(225,83,97,.5)}.btn_cred:active,.btn_cred:focus{color:#fff;background-color:#ad1f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn_cblue{color:#fff;background-color:#2778c4}.btn_cblue:hover{color:#fff;background-color:#236cb0;box-shadow:0 0 0 .1rem rgba(35,108,176,.5)}.btn_cblue:active,.btn_cblue:focus{color:#fff;background-color:#1f609d;box-shadow:0 0 0 .2rem rgba(35,108,176,.5)}.btn_cgreen{color:#fff;background-color:#4fc823}.btn_cgreen:hover{color:#fff;background-color:#47b41f;box-shadow:0 0 0 .1rem rgba(79,200,35,.5)}.btn_cgreen:active,.btn_cgreen:focus{color:#fff;background-color:#3fa01c;box-shadow:0 0 0 .2rem rgba(79,200,35,.5)}.btn_corange{color:#fff;background-color:#d99d26}.btn_corange:hover{color:#fff;background-color:#c38d22;box-shadow:0 0 0 .1rem rgba(199,144,35,.5)}.btn_corange:active,.btn_corange:focus{color:#fff;background-color:#a0741c;box-shadow:0 0 0 .2rem rgba(199,144,35,.5)}.btn_corange{color:#fff;background-color:#d99d26}.btn_corange:hover{color:#fff;background-color:#c38d22;box-shadow:0 0 0 .1rem rgba(199,144,35,.5)}.btn_corange:active,.btn_corange:focus{color:#fff;background-color:#a0741c;box-shadow:0 0 0 .2rem rgba(199,144,35,.5)}.MT2{margin:2px}.MT4{margin:4px}.MT6{margin:6px}.MT8{margin:8px}.MT10{margin:10px}');
	async function ShowSweetAlertInfo(GetID, GetPage) {
		var GetCAT = "",
			get_name_first, GetFullName, get_maininfo, get_maininfo_full, maininfo, get_maininfo_name, get_maininfo_year, grelscr_id, grel_id, gscr_id, show_filelist = "",
			show_release = "",
			show_screenshoot = "",
			get_menu_info, set_menu_info, razdajut, skacivajut, skaciali, spisokfailov, komentarijev, kinopoisk_link, get_main_img, get_main_img_url, show_aboutfile, get_aboutfile, similarfiles_link, get_aboutmovie, ads_result = "",
			matchaboutfile, replaceaboutfile, full_name_youtube, youtube_link, check_movie;

		function DetailsInfo(GetID) {
			return fetch(get_full_url + '/details.php?id=' + GetID, {
				method: "GET",
			}).then(windows1251ResponseToUTF8Response).then(function(response) {
				return response.text();
			}).then(async function(data) {
				GM_addStyle(".menuinfo .floatright{float:right;color:#f00}.menuinfo{font-weight:bold}");
				const parser = new DOMParser();
				const doc = parser.parseFromString(data, "text/html");
				if (!doc.querySelector("#main > div").innerText.match(/Нет раздачи с таким ID/)) {
					GetFullName = doc.querySelector(".mn_wrap h1 a").innerText.toUpperCase();
					get_name_first = GetFullName.split(" / ")[0];
					get_aboutfile = doc.querySelector("div.bx1.justify p").innerHTML;
					matchaboutfile = get_aboutfile.match(/<b>.*<\/b>/)[0].replace(/(<([^>]+)>)/ig, '').replace(':', '');
					replaceaboutfile = get_aboutfile.replace(/<([^>]+)>.*<([^>]+)> /, '');
					show_aboutfile = spoilerblock(matchaboutfile, replaceaboutfile);
					grelscr_id = doc.querySelector("ul.lis").innerHTML;
					maininfo = doc.querySelector('#tabs');
					get_maininfo = doc.querySelector("div.bx1.justify h2").innerHTML;
					GetCAT = doc.querySelector("img.cat_img_r").getAttribute('onclick').match(/[0-9]+/)[0];
					get_maininfo_name = doc.querySelector("div.bx1.justify h2").innerText.match(/(Исполнитель:|Оригинальное название:|Название:|Альбом:)(.*)/)[2];
					get_maininfo_year = doc.querySelector("div.bx1.justify h2").innerText.match(/Год выпуска: ([\d+]{4})/)[1];
					get_menu_info = doc.querySelector(".mn1_menu ul.men").innerText;
					razdajut = get_menu_info.match(/Раздают(\d+)/);
					skacivajut = get_menu_info.match(/Скачивают(\d+)/);
					skaciali = get_menu_info.match(/Скачали(\d+)/);
					spisokfailov = get_menu_info.match(/Список файлов(\d+)/);
					komentarijev = get_menu_info.match(/Комментариев(\d+)/);
					get_aboutmovie = get_aboutfile.indexOf("О фильме:") !== -1;
					full_name_youtube = get_maininfo_name + " " + get_maininfo_year;
					check_movie = 0;
					if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null) {
						check_movie = 1;
					}
					grel_id = (grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Релиз<\/a>/) !== null ? grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Релиз<\/a>/)[1] : null);
					gscr_id = (grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Скриншоты<\/a>/) !== null ? grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Скриншоты<\/a>/)[1] : null);
					get_main_img = (doc.querySelector("ul.men.w200 li.img") !== null ? '<img src="' + doc.querySelector("ul.men.w200 li.img a img").src + '" style="display: block;margin-left: auto;margin-right: auto;padding:0px 0px 10px 0px;width: 250px;" alt="">' : '');
					get_main_img_url = (doc.querySelector("ul.men.w200 li.img") !== null ? doc.querySelector("ul.men.w200 li.img a img").src : "");
					set_menu_info = (razdajut !== null ? '<span class="menuinfo">Раздают<span class="floatright">' + razdajut[1] + '</span></span><br>' : '') + (skacivajut !== null ? '<span class="menuinfo">Скачивают<span class="floatright">' + skacivajut[1] + '</span></span><br>' : '') + (skaciali !== null ? '<span class="menuinfo">Скачали<span class="floatright">' + skaciali[1] + '</span></span><br>' : '') + (spisokfailov !== null ? '<span class="menuinfo">Список файлов<span class="floatright">' + spisokfailov[1] + '</span></span><br>' : '') + (komentarijev !== null ? '<span class="menuinfo">Комментариев<span class="floatright">' + komentarijev[1] + '</span></span><br>' : '');
					similarfiles_link = (doc.querySelector('#tabs2').innerText.match(/Подобные раздачи найдено (\d+) раздач/) !== null ? '<p style="font-size:12px;text-align:center;padding:0px 0px 10px 0px;font-weight:bold;"><a href="javascript:void(0);" onclick="window.open(\'browse.php?s=' + doc.querySelector('#tabs2 td.w90p').innerHTML.split('?s=')[1].split('&')[0] + '&d=' + (get_maininfo_year !== null ? get_maininfo_year : '0') + '&t=1\',\'_self\')" style="color:red;margin-left: auto;margin-right: auto;">НАЙДЕНО ' + declOfNum(doc.querySelector('#tabs2').innerText.match(/Подобные раздачи найдено (\d+) раздач/)[1], ['ПОДОБНАЯ РАЗДАЧА', 'ПОДОБНЫЕ РАЗДАЧИ', 'ПОДОБНЫХ РАЗДАЧ']) + ' </a></p>' : '');
					youtube_link = (KZ_ShowYoutubeButton ? (get_aboutmovie ? '<button type="button" class="btn_small btn_cred MT4" onclick="window.open(\'https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(full_name_youtube + ' русский трейлер') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '') : '');
					kinopoisk_link = (get_aboutmovie ? '<button type="button" class="btn_small btn_cblue MT4" onclick="window.open(\'https://www.kinopoisk.ru/index.php?kp_query=' + fixedEncodeURIComponent(full_name_youtube) + '\')" style="display: block;margin-left: auto;margin-right: auto;">КИНОПОИСК</button>' + ($(data).find("a:contains(Кинопоиск)").length == 1 ? '<button type="button" class="btn_small btn_cblue MT4" onclick="window.open(\'' + $(data).find("a:contains(Кинопоиск)").attr('href') + '/like\')" style="display: block;margin-left: auto;margin-right: auto;">КИНОПОИСК ПОХОЖИЕ</button>' : '') : '');
					if (grel_id !== null) {
						function release_fetch() {
							return fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&pagesd=' + grel_id, {
								method: "GET",
							}).then(function(response) {
								if (!response.ok) {
									throw Error(response.statusText)
								}
								return response.text();
							}).then(function(data) {
								const parser = new DOMParser();
								const doc = parser.parseFromString(data, "text/html").querySelector("body");
								const ads = doc.innerText.toLowerCase();
								if (ads.match(KZ_ADSN_TextValue)) {
									ads_result = '<p class="fnm-ads-title fnm-no-ads">РАЗДАЧА БЕЗ РЕКЛАМЫ</p>';
								} else if (ads.match(KZ_ADSY_TextValue)) {
									ads_result = '<p class="fnm-ads-title fnm-with-ads">ПРИСУТСТВУЕТ РЕКЛАМА</p>';
								}
								return spoilerblock("Релиз", data);
							})
						}
						show_release = await release_fetch();
					}
					if (gscr_id !== null) {
						function screen_fetch() {
							return fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&pagesd=' + gscr_id, {
								method: "GET",
							}).then(function(response) {
								if (!response.ok) {
									throw Error(response.statusText)
								}
								return response.text();
							}).then(function(data) {
								return spoilerblock("Скриншоты", data, "open", "red");
							})
						}
						show_screenshoot = await screen_fetch();
					}
					return get_maininfo_name;
				} else {
					return "Торрент файл не найден";
				}
			});
		}

		function SrvDetailsHash(GetID) {
			return fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2', {
				method: "GET",
			}).then(function(response) {
				return response.text();
			}).then(async function(data) {
				if (!data.match(/Торрент файл не найден/)) {
					GM_addStyle(".treeview li {background: url('data:image/gif;base64,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') 0 0 no-repeat;padding: 1px 0px 0px 16px;}.treeview li i, .ing i { color: green; font-style:normal;}");
					show_filelist = ($(data)[0].querySelector(".treeview") !== null ? spoilerblock("Список файлов", "<div class=\"treeview\">" + $(data)[0].querySelector(".treeview").innerHTML + "</div>") : "");
					return $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
				} else {
					return "Торрент файл не найден";
				}
			}).catch(function(e) {
				SwallAutoCloseMsg("get_srv_details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
			});
		}
		let GetDetailsInfo = await DetailsInfo(GetID);
		let GetSrvDetailsHash = await SrvDetailsHash(GetID);
		if ((GetDetailsInfo || GetSrvDetailsHash) == "Торрент файл не найден") {
			SwallAutoCloseMsg("ShowSweetAlertInfo отклонил запрос<br>Ошибка:<br><i style=\"color:red\">Торрент файл не найден</i>", "5");
		} else {
			var Gethash = await GetSrvDetailsHash,
				cat_name = "",
				KZ_ShowButtons = "",
				KZ_TorrentButton = "",
				KZ_MagnetButton = "",
				KZ_CopyMagnetButton = "",
				KZ_CopyYoutubeButton = "",
				KZ_TorrServerButton = "";
			if (KZ_ShowTorrentButton && check_movie == 1) {
				KZ_TorrentButton = '<button id="download_torrent_file" type="button" class="btn_small btn_cgreen MT4"><i class="fa fa-download"></i> TORRENT</button>';
			}
			if (KZ_ShowMagnetButton) {
				KZ_MagnetButton = '<button id="download_with_magnet" type="button" class="btn_small btn_cblue MT4"><i class="fa fa-download"></i> MAGNET</button>';
			}
			if (KZ_ShowCopyMagnetButton) {
				KZ_CopyMagnetButton = '<button id="copy_with_magnet" type="button" class="btn_small btn_cblue MT4"><i class="fa fa-copy"></i> MAGNET</button>';
			}
			if (KZ_ShowCopyYoutubeButton && check_movie == 1) {
				KZ_CopyYoutubeButton = '<button id="copy_with_youtube" type="button" class="btn_small btn_cred MT4"><i class="fa fa-copy"></i> YOUTUBE</button>';
			}
			if (KZ_ShowTorrServerButton && check_movie == 1) {
				KZ_TorrServerButton = '<button id="add_to_torrserver" type="button" class="btn_small btn_cred MT4"><i class="fa fa-plus-square"></i> TORRSERVER</button>';
			}
			KZ_ShowButtons = KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_CopyYoutubeButton + KZ_TorrServerButton + ((KZ_ShowTorrentButton || KZ_ShowMagnetButton || KZ_ShowTorrServerButton || KZ_ShowCopyMagnetButton || KZ_ShowCopyYoutubeButton) === true ? '<br>' : '');
			Swal.fire({
				width: KZ_SwalDetailedInfoWidth,
				html: `
<h2 class="swal2-title fnm-title">${get_name_first} / ${get_maininfo_year}</h2>
${ads_result}
<table>
<tr>
<td style="vertical-align:top;padding: 0px 10px 0px 0px;font-size: 12px;">
<div style="width: 250px;">
${get_main_img}
${similarfiles_link}
${set_menu_info}
<br>
${maininfo.innerHTML}
${youtube_link}
${kinopoisk_link}
</div></td>
<td style="vertical-align:top;padding: 0px 0px 5px 0px;font-size: 12px;width:100%;">
${get_maininfo}
${show_aboutfile}
${show_release}
${show_screenshoot}
${show_filelist}
</td>
</tr>
</table>`,
				showCancelButton: false,
				showConfirmButton: false,
				footer: '<center>' + KZ_ShowButtons + '<button type="button" onclick="window.open(\'details.php?id=' + GetID + '\',\'_self\')" class="btn_small btn_cblue MT4">ОТКРЫТЬ РАЗДАЧУ</button><button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button></center>',
				didOpen: () => {
					Swal.getFooter().querySelector('button#cancel').focus();
				}
			});
			$("#download_torrent_file").click(function() {
				if (KZ_ShowConfirmDownload) {
					Swal.fire({
						title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
						html: "<b style='color:#FF0000;'>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!</b>",
						icon: 'question',
						showCancelButton: false,
						showDenyButton: true,
						confirmButtonColor: '#4fc823',
						cancelButtonColor: '#d33',
						denyButtonText: "НЕТ",
						confirmButtonText: "ДА",
					}).then(function(result) {
						if (result.isConfirmed) {
							window.location.href = get_full_url + "/download.php?id=" + GetID;
							SwallAutoCloseMsg("Скачивается торрент файл!", "2");
						}
					});
				} else {
					window.location.href = get_full_url + "/download.php?id=" + GetID;
					SwallAutoCloseMsg("Скачивается торрент файл!", "2");
				}
			});
			$("#download_with_magnet").click(function() {
				if (KZ_ShowConfirmDownload) {
					Swal.fire({
						title: "СКАЧАТЬ ЧЕРЕЗ MAGNET?",
						html: "<b style='color:#009900;'>Ваш рейтинг не упадёт, можете скачивать бесконечно!</b>",
						icon: 'question',
						showCancelButton: false,
						showDenyButton: true,
						confirmButtonColor: '#4fc823',
						cancelButtonColor: '#d33',
						denyButtonText: "НЕТ",
						confirmButtonText: "ДА",
					}).then(function(result) {
						if (result.isConfirmed) {
							window.location.href = "magnet:?xt=urn:btih:" + Gethash;
							SwallAutoCloseMsg("Скачивается через Magnet!", "2");
						}
					});
				} else {
					window.location.href = "magnet:?xt=urn:btih:" + Gethash;
					SwallAutoCloseMsg("Скачивается через Magnet!", "2");
				}
			});
			$("#copy_with_magnet").click(function() {
				copy("magnet:?xt=urn:btih:" + Gethash);
				SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
			});
			$("#copy_with_youtube").click(function() {
				copy(get_name_first + " " + get_maininfo_year + ' русский трейлер');
				SwallAutoCloseMsg("YOUTUBE текст скопирован!", "2");
			});
			$("#add_to_torrserver").click(function() {
				if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null) {
					if (KZ_ShowConfirmDownload) {
						Swal.fire({
							title: "ДОБАВИТЬ РАЗДАЧУ В TORRSERVER?",
							icon: 'question',
							showCancelButton: false,
							showDenyButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							denyButtonText: "НЕТ",
							confirmButtonText: "ДА",
						}).then(function(result) {
							if (result.isConfirmed) {
								if (TSVersion === "old") {
									let Data = {
										'Link': Gethash,
										'DontSave': !true,
										'Info': JSON.stringify({
											'poster_path': get_main_img_url
										})
									};
									TS_POST("torrent/add", JSON.stringify(Data), (response) => {
										if (/^[0-9a-f]{40}$/i.test(response)) {
											"Раздача добавлена в TorrServer!"
										} else {
											"TorrServer отклонил запрос"
										}
									});
								} else {
									let Data = {
										'action': 'add',
										'link': Gethash,
										'title': GetFullName,
										'poster': get_main_img_url,
										'save_to_db': true
									};
									TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
								}
							}
						});
					} else {
						if (TSVersion === "old") {
							let Data = {
								'Link': Gethash,
								'DontSave': !true,
								'Info': JSON.stringify({
									'poster_path': get_main_img_url
								})
							};
							TS_POST("torrent/add", JSON.stringify(Data), (response) => {
								if (/^[0-9a-f]{40}$/i.test(response)) {
									"Раздача добавлена в TorrServer!"
								} else {
									"TorrServer отклонил запрос"
								}
							});
						} else {
							let Data = {
								'action': 'add',
								'link': Gethash,
								'title': GetFullName,
								'poster': get_main_img_url,
								'save_to_db': true
							};
							TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
						}
					}
				} else {
					SwallAutoCloseMsg("Данная раздача не является фильмом или сериалом, поэтому не может быть добавлена в TorrServer!", "3");
				}
			});
			$("#cancel").click(function() {
				Swal.close();
			});
		}
	}
	if (reg_kinopoisk_like.test(get_url)) {
		get_kinozal_link = KinozalCFG.get('KinopoiskLinkSearch');
		GM_addStyle(`.search_like_button{font-family: arial,sans-serif;text-transform: uppercase;display: block;color: #666;font-size: 14px;font-weight: bold;text-align: center;border: 1px solid #bbb;border-radius: 4px;box-shadow: 0 1px 2px rgb(0 0 0 / 20%);background: -webkit-linear-gradient(top, #fff 0%, #efefef 100%);width: fit-content;margin-top: 5px;padding: 6px;user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;cursor: pointer;}.search_like_button:hover{text-decoration: none;background: -webkit-linear-gradient(top, #efefef 0%, #fff 100%);}`);
		if (get_kinozal_link == "kinozal1") {
			set_kinozal_link = "kinozal.tv";
		} else if (get_kinozal_link == "kinozal2") {
			set_kinozal_link = "kinozal.me";
		} else if (get_kinozal_link == "kinozal3") {
			set_kinozal_link = "kinozal.guru";
		} else if (get_kinozal_link == "kinozal4") {
			set_kinozal_link = "kinozaltv.life";
		}
		$('#block_left_pad > ul > li:nth-child(3)').each(function(i, e) {
			var get_name_first = $(e).find("h1 > a").text();
			var get_years = $(e).find("div").text().match(/([\d+]{4})/);
			$(e).append('<div class="search_like_button" onclick="window.open(\'//' + set_kinozal_link + '/browse.php?s=' + fixedEncodeURIComponent(get_name_first) + '&d=' + (get_years !== null ? get_years[1] : '0') + '&t=1\')">Кинозал</div>\n<div class="search_like_button" onclick="window.open(\'http://rutor.is/search/0/0/100/2/' + fixedEncodeURIComponent(get_name_first) + (get_years !== null ? "%20" + get_years[1] : '0') + '\')">RUTOR</div>\n<div class="search_like_button" onclick="window.open(\'https://rutracker.org/forum/tracker.php?nm=' + fixedEncodeURIComponent(get_name_first) + (get_years !== null ? "%20" + get_years[1] : '0') + '\')">RUTRACKER</div>');
		});
		$('table.ten_items tbody').find("tr").each(function(i, e) {
			var get_url = $(e).find("td.news > div > div:nth-child(1) > a").attr("href");
			var get_name_first = $(e).find("td.news > div > div:nth-child(1) > a").text().replace(/ \(сериал\)/, "");
			var get_years = $(e).find("td.news > div > div:nth-child(1) > span").text().match(/([\d+]{4})/);
			$(e).find("td.news > div").append('<div class="search_like_button" onclick="window.open(\'' + get_full_url + get_url + 'like/\',\'_self\')">Похожие</div>\n<div class="search_like_button" onclick="window.open(\'//' + set_kinozal_link + '/browse.php?s=' + fixedEncodeURIComponent(get_name_first) + '&d=' + (get_years !== null ? get_years[1] : '0') + '&t=1\')">Кинозал</div>\n<div class="search_like_button" onclick="window.open(\'http://rutor.is/search/0/0/100/2/' + fixedEncodeURIComponent(get_name_first) + (get_years !== null ? "%20" + get_years[1] : '0') + '\')">RUTOR</div>\n<div class="search_like_button" onclick="window.open(\'https://rutracker.org/forum/tracker.php?nm=' + fixedEncodeURIComponent(get_name_first) + (get_years !== null ? "%20" + get_years[1] : '0') + '\')">RUTRACKER</div>');
		});
	}
	if (reg_kinopoisk_main.test(get_url)) {
		const QUERY_DATA = {};
		const querystring = (str) => (str.replace(/(?:%(\w+)?)/g, (str, word) => {
			if (word === undefined) return '';
			word = word.toLowerCase();
			return word in QUERY_DATA ? encodeURIComponent(QUERY_DATA[word]) : str;
		}));
		const extractQueryData = () => {
			try {
				const script = document.querySelector('#__NEXT_DATA__');
				const {
					props,
					query
				} = JSON.parse(script.textContent);
				const {
					apolloState: {
						data
					}
				} = props;
				const {
					id
				} = query;
				const {
					releaseYears,
					productionYear,
					title
				} = (data[`TvSeries:${id}`] || data[`Film:${id}`]);
				const [year] = Array.isArray(releaseYears) ? releaseYears : [productionYear];
				const {
					start,
					end
				} = typeof year === 'object' ? year : {
					start: year,
					end: year
				};
				Object.assign(QUERY_DATA, {
					year: start,
					endyear: end,
					engtext: title.original || title.russian,
					text: title.russian
				});
			} catch {}
		};
		extractQueryData();
		get_kinozal_link = KinozalCFG.get('KinopoiskLinkSearch');
		if (get_kinozal_link == "kinozal1") {
			set_kinozal_link = "kinozal.tv";
		} else if (get_kinozal_link == "kinozal2") {
			set_kinozal_link = "kinozal.me";
		} else if (get_kinozal_link == "kinozal3") {
			set_kinozal_link = "kinozal.guru";
		} else if (get_kinozal_link == "kinozal4") {
			set_kinozal_link = "kinozaltv.life";
		}
		GM_addStyle(".resources{padding: 10px 0px;}.search_main_button{font-family: arial,sans-serif;text-transform: uppercase;text-decoration: none;display: block;color: #666;font-size: 24px;font-weight: bold;text-align: center;margin-top: 5px;border: 1px solid #bbb;border-radius: 4px;box-shadow: 0 1px 2px rgb(0 0 0 / 20%);background: -webkit-linear-gradient(top, #fff 0%, #efefef 100%);padding: 10px;user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;cursor: pointer;}.search_main_button:hover{text-decoration: none;background: -webkit-linear-gradient(top, #efefef 0%, #fff 100%);}");
		var element = document.createElement("div");
		element.className = 'resources';
		element.innerHTML = "<a href=\"" + querystring('http://' + set_kinozal_link + '/browse.php?s=%text&d=%year&t=1') + "\" target=\"_blank\" class=\"search_main_button\"><span class=\"styles_defaultText__PgVb9\">Кинозал</span></a>\n<a href=\"" + querystring('http://rutor.is/search/0/0/100/2/%text%20%year') + "\" target=\"_blank\" class=\"search_main_button\"><span class=\"styles_defaultText__PgVb9\">RUTOR</span></a>\n<a href=\"" + querystring('https://rutracker.org/forum/tracker.php?nm=%text%20%year') + "\" target=\"_blank\" class=\"search_main_button\"><span class=\"styles_defaultText__PgVb9\">RUTRACKER</span></a>";
		var k = document.querySelector(".styles_posterContainer__F02wH");
		var retry = 0;
		if (k != null) {
			if (retry < 1) {
				retry++;
				setTimeout(function() {
					k.appendChild(element);
				}, 1000);
			}
		};
	}
	if (reg_kinozal_top.test(get_url)) {
		GM_addStyle(`div.spoilerButton {display: block;max-width: 100%;border: 1px solid #8394b2ad;border-left: 4px solid #8394b2ad;margin: 8px 0 0;font-family: Verdana, Tahoma, Arial, 'Trebuchet MS', sans-serif, Georgia, Courier, 'Times New Roman', serif;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;}div.spoilerButton>.block-title{display: block;cursor: pointer;color: #000;max-width: 100%;margin: 0px;padding: 7px 7px;background: #E4EAF2;font-weight: bold;font-size: 11px;user-select: none;}div.spoilerButton.open>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQeAOLt+ff8//z+/4CRxo2by7vF6a254X6PxICQw87a74CQxuXo84CQxM/b7/H6/v7+/oGRxouayoGSxv7+/8LN7IqZyv7//4KSxur0/MrV74OTx9Ld8trl9gwMDP///wAAACH5BAEAAB4ALAAAAAAJAAkAAAU4oFcpwzFAkWgUVLZxCQGxLgdgGtS+t6NJmY5QOEFcNo/kZGLRXGwYR0DQjDSiU8uCIJJIGJdLKgQAOw==) " (";}div.spoilerButton.close>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQfAIqZyoGSxv3+/trl84CQxYCRxn6PxMXQ7efq9H+Pwtnk8oKTxoCQxKy44QAAANvl9rvG6fD5/o2by4GRxvb8//v9//7+/ubw+v39/ouayoKSxoOTx/7+/wwMDP///////yH5BAEAAB8ALAAAAAAJAAkAAAU84AdoGkNmX4Z4HldRirSxXMdF1zK7nXU9mk2t4+h0BIlNhWPpYTCBDQXXwRwggczgJ8BAGhLRZGIoEFAhADs=) " (";}div.spoilerButton>.block-title:after{content: ")";}div.spoiler-body {border: 1px solid #8394b2ad;border-left-width: 4px;clear: both;display: block;margin: -1px 0px;background: #F5F5F5;padding: 6px;font-family: Verdana, Tahoma, Arial, 'Trebuchet MS', sans-serif, Georgia, Courier, 'Times New Roman', serif;}`);
		$(document).on('click', ".spoilerButton", function() {
			var $this = $(this);
			var $isExpanded = $this.hasClass("open");
			$this.toggleClass("open").toggleClass("close");
			if ($isExpanded) {
				$this.next().slideUp(200);
			} else {
				$this.next().slideDown(200);
			}
		});
		if (get_acc_login_check.match(/\( Выход \)/) !== null) {
			GM_addStyle(`.prs, .stable {padding: 1px;}.prs a, .stable a{height:285px;width:199px;cursor:pointer;float:left;margin:2px;position:relative;border:none}.prs a img, .stable a img{border:none;display:block;height:283px;width:200px;border-radius:7px}.prs a:hover span, .stable a:hover span{background:#fdcf75e3}.prs span, .stable span{font-family: "Open Sans";text-transform: uppercase;position: absolute;font-weight: bold;bottom: 0px;left: 0px;width: 197px;background: rgba(255,255,255,.878) repeat-x scroll top;margin: 0px 0px 2px 0px;text-align: center;padding: 2px 2px;border-radius: 0 0 7px 7px;font-size: 16px;color: #000;}`);
			$('div.bx1.stable').find("a").each(function(i, e) {
				var url = $(e).attr('href');
				var uArgs = url.split('?')[1].split('&');
				var GetID = null;
				uArgs.forEach(function(el) {
					if (el.startsWith('id=')) {
						GetID = el.split('=')[1];
					}
				});
				if (GetID !== null) {
					$(e).replaceWith("<a href=\"javascript:void(0);\" id=\"get_info_" + GetID + "\"><img src=\"" + $(e).find("img").prop('src') + "\"><span>" + $(e).attr("title") + "</span></a>");
					$("#get_info_" + GetID).click(async function() {
						await ShowSweetAlertInfo(GetID, "top");
					});
				}
			});
		}
	}
	if (reg_kinozal_search.test(get_url)) {
		GM_addStyle('div.spoilerButton {display: block;max-width: 100%;border: 1px solid #8394b2ad;border-left: 4px solid #8394b2ad;margin: 8px 0 0;font-family: Verdana, Tahoma, Arial, "Trebuchet MS", sans-serif, Georgia, Courier, "Times New Roman", serif;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;}div.spoilerButton>.block-title{display: block;cursor: pointer;color: #000;max-width: 100%;margin: 0px;padding: 7px 7px;background: #E4EAF2;font-weight: bold;font-size: 11px;user-select: none;}div.spoilerButton.open>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQeAOLt+ff8//z+/4CRxo2by7vF6a254X6PxICQw87a74CQxuXo84CQxM/b7/H6/v7+/oGRxouayoGSxv7+/8LN7IqZyv7//4KSxur0/MrV74OTx9Ld8trl9gwMDP///wAAACH5BAEAAB4ALAAAAAAJAAkAAAU4oFcpwzFAkWgUVLZxCQGxLgdgGtS+t6NJmY5QOEFcNo/kZGLRXGwYR0DQjDSiU8uCIJJIGJdLKgQAOw==) " (";}div.spoilerButton.close>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQfAIqZyoGSxv3+/trl84CQxYCRxn6PxMXQ7efq9H+Pwtnk8oKTxoCQxKy44QAAANvl9rvG6fD5/o2by4GRxvb8//v9//7+/ubw+v39/ouayoKSxoOTx/7+/wwMDP///////yH5BAEAAB8ALAAAAAAJAAkAAAU84AdoGkNmX4Z4HldRirSxXMdF1zK7nXU9mk2t4+h0BIlNhWPpYTCBDQXXwRwggczgJ8BAGhLRZGIoEFAhADs=) " (";}div.spoilerButton>.block-title:after{content: ")";}div.spoiler-body {border: 1px solid #8394b2ad;border-left-width: 4px;clear: both;display: block;margin: -1px 0px;background: #F5F5F5;padding: 6px;font-family: Verdana, Tahoma, Arial, "Trebuchet MS", sans-serif, Georgia, Courier, "Times New Roman", serif;}.seed-line { height: ' + KZ_SeedGraphHeight + 'px; background-color: ' + KZ_SeedGraphColor + ';}');
		$(document).on('click', ".spoilerButton", function() {
			var $this = $(this);
			var $isExpanded = $this.hasClass("open");
			$this.toggleClass("open").toggleClass("close");
			if ($isExpanded) {
				$this.next().slideUp(200);
			} else {
				$this.next().slideDown(200);
			}
		});
		if (get_acc_login_check.match(/\( Выход \)/) !== null) {
			GM_addStyle(".t_peer td.swalbtn{width:45px;text-align:center}");
			if (KZ_ShowMarkTorrents) {
				GM_addStyle("mark{" + (KZ_MarkBolder ? "text-shadow: -1px -1px 0px " + KZ_MarkBoldColorValue + ",0px -1px 0px " + KZ_MarkBoldColorValue + ",1px -1px 0px " + KZ_MarkBoldColorValue + ",1px 0px 0px " + KZ_MarkBoldColorValue + ",1px 1px 0px " + KZ_MarkBoldColorValue + ",0px 1px 0px " + KZ_MarkBoldColorValue + ",-1px 1px 0px " + KZ_MarkBoldColorValue + ",-1px 0px 0px " + KZ_MarkBoldColorValue + ";" : "") + "background: none;color: " + KZ_MarkColorValue + ";}");
				var mark_instance = new Mark(document.querySelectorAll("a.r0,a.r1,a.r2,a.r3,a.r4,a.r5,a.r6"));
				mark_instance.mark(KZ_MarkTextValue);
			}
			var table = $('.t_peer');
			var h = table.find('.mn');
			if (KZ_ChangeButtonToLink) {
				if (!/(persons.php.*torr$|groupexreleaselist.php|groupex.php|groupextorrentlist.php|details.php)/i.test(get_url)) {
					GM_addStyle("#main > div.content > div.bx2_0 > table > tbody > tr >td:nth-child(8) {display:none;}");
				}
			} else {
				GM_addStyle("div.kz_buttons{width: max-content;}.main_button_search {font-family: FontAwesome;margin: 0px 4px 0px 4px;cursor: pointer;outline: 0;padding: 6px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;line-height: 0;font-size: 30px;border-radius: .25rem;color: #fff;background-color: #2778c4;border: 0;width: 44px;}.main_button_search:hover{color:#fff;background-color:#236cb0}.main_button_search:focus,.main_button_search:active{color:#fff;background-color:#1f609d}#main > div.content > div.bx2_0 > table > tbody > tr >td:nth-child(9) {display:none;}");
				h.prepend('<td class="z" style="width: 1px;"></td>');
			}
			table.find("tr").not(h).each(async function(i, e) {
				var get_seed = $(e).find('.sl_s').text(),
					get_peer = $(e).find('.sl_p').text(),
					count = Number(get_seed) + Number(get_peer);
				count = Math.min(maxWidth, Math.round(parseInt(count / 10)));
				var GetURL = $(e).find('.nam a').attr('href');
				var GetCAT = $(e).find('td.bt > img')[0].src.match(/cat\/([0-9]+)\.gif/)[1];
				var GetFullName = $(e).find('.nam a').text();
				var GetID = GetURL.match('id=([0-9]+)')[1];
				var check_movie = 0;
				if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null) {
					check_movie = 1;
				}
				if (KZ_ChangeButtonToLink) {
					$(e).find('.nam a').prop('id', 'get_info_' + GetID).prop('href', 'javascript:void(0);');
				} else {
					var KZ_ShowButtons = "",
						KZ_OpenLink = '<button id="open_link_' + GetID + '" type="button" class="btn_tiny btn_corange MT2" style="padding: 5px 6px 5px 6px;font-size: 24px;line-height: 0;"><i class="fa fa-link"></i></button>',
						KZ_SearchLike = '<button id="search_like_' + GetID + '" type="button" class="btn_tiny btn_corange MT2" style="padding: 4px 6px 5px 6px;font-size: 25px;line-height: 0;"><i class="fa fa-search"></i></button>',
						KZ_TorrentButton = "",
						KZ_MagnetButton = "",
						KZ_SearchYoutube = "",
						KZ_CopyMagnetButton = "",
						KZ_CopyYoutubeButton = "",
						KZ_TorrServerButton = "",
						KZ_SearchKinopoiskButton = "";
					if (KZ_ShowSearchKinopoiskButton && check_movie == 1) {
						KZ_SearchKinopoiskButton = '<button id="search_kinopoisk_' + GetID + '" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 4px 6px 5px 6px;font-size: 25px;line-height: 0;"><i class="fa fa-search"></i></button>';
					}
					if (KZ_ShowTorrentButton) {
						KZ_TorrentButton = '<button id="download_torrent_file_' + GetID + '" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 5px 6px 3px 6px;font-size: 26px;line-height: 0;"><i class="fa fa-download"></i></button>';
					}
					if (KZ_ShowMagnetButton) {
						KZ_MagnetButton = '<button id="download_magnet_' + GetID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 7px 3px 7px;font-size: 26px;line-height: 0;"><i class="fa fa-magnet"></i></button>';
					}
					if (KZ_ShowYoutubeButton && check_movie == 1) {
						KZ_SearchYoutube = '<button id="search_youtube_' + GetID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 4px 5px 4px 6px;font-size: 26px;line-height: 0;"><i class="fa fa-youtube-play"></i></button>';
					}
					if (KZ_ShowCopyMagnetButton) {
						KZ_CopyMagnetButton = '<button id="copy_magnet_' + GetID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 4px 7px 6px 5px;font-size: 24px;line-height: 0;"><i class="fa fa-copy"></i></button>';
					}
					if (KZ_ShowCopyYoutubeButton && check_movie == 1) {
						KZ_CopyYoutubeButton = '<button id="copy_youtube_' + GetID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 4px 7px 6px 5px;font-size: 24px;line-height: 0;"><i class="fa fa-copy"></i></button>';
					}
					if (KZ_ShowTorrServerButton && check_movie == 1) {
						KZ_TorrServerButton = '<button id="add_torrserver_' + GetID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 4px 6px 4px 6px;font-size: 26px;line-height: 0;"><i class="fa fa-plus-square"></i></button>';
					}
					KZ_ShowButtons = KZ_OpenLink + KZ_SearchLike + KZ_SearchKinopoiskButton + KZ_SearchYoutube + KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_CopyYoutubeButton + KZ_TorrServerButton;
					if (KZ_SeedGraphSettings) {
						$(e).find('.nam a').prop('id', 'get_info_' + GetID).prop('href', 'javascript:void(0);').after('<div class="seed-line" style="width: ' + count + 'px;margin: 2px 0px -1px 0px;"></div>');
					} else {
						$(e).find('.nam a').prop('id', 'get_info_' + GetID).prop('href', 'javascript:void(0);');
					}
					$(e).prepend(document.createElement('td'));
					$(e).children('td').eq(0).prepend('<div class="kz_buttons">' + KZ_ShowButtons + '</div>');
				}
				$("#search_kinopoisk_" + GetID).click(function() {
					if (check_movie == 1) {
						fetch(get_full_url + '/details.php?id=' + GetID, {
							method: "GET",
						}).then(windows1251ResponseToUTF8Response).then(function(response) {
							return response.text();
						}).then(function(data) {
							const parser = new DOMParser();
							const doc = parser.parseFromString(data, "text/html");
							if (!doc.querySelector("#main > div").innerText.match(/Нет раздачи с таким ID/)) {
								var get_maininfo_name = doc.querySelector("div.bx1.justify h2").innerText.match(/(Исполнитель:|Оригинальное название:|Название:|Альбом:)(.*)/)[2];
								var get_maininfo_year = doc.querySelector("div.bx1.justify h2").innerText.match(/Год выпуска: ([\d+]{4})/)[1];
								window.open('https://www.kinopoisk.ru/index.php?kp_query=' + fixedEncodeURIComponent(get_maininfo_name + " " + get_maininfo_year));
							} else {
								return SwallAutoCloseMsg("Торрент файл не найден!", "2");
							}
						});
					} else {
						SwallAutoCloseMsg("Данная раздача не является фильмом, сериалом, поэтому нет возможности найти такую раздачу в кинопоиске!", "3");
					}
				});
				$("#open_link_" + GetID).click(function() {
					window.open(get_full_url + '/details.php?id=' + GetID);
				});
				$("#search_youtube_" + GetID).click(function() {
					fetch(get_full_url + '/details.php?id=' + GetID, {
						method: "GET",
					}).then(windows1251ResponseToUTF8Response).then(function(response) {
						return response.text();
					}).then(function(data) {
						const parser = new DOMParser();
						const doc = parser.parseFromString(data, "text/html");
						if (!doc.querySelector("#main > div").innerText.match(/Нет раздачи с таким ID/)) {
							var get_maininfo_name = doc.querySelector("div.bx1.justify h2").innerText.match(/(Исполнитель:|Оригинальное название:|Название:|Альбом:)(.*)/)[2];
							var get_maininfo_year = doc.querySelector("div.bx1.justify h2").innerText.match(/Год выпуска: ([\d+]{4})/)[1];
							var full_name_youtube = get_maininfo_name + " " + get_maininfo_year;
							window.open('https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(full_name_youtube + ' русский трейлер'));
						} else {
							return SwallAutoCloseMsg("Торрент файл не найден!", "2");
						}
					});
				});
				$("#search_like_" + GetID).click(function() {
					fetch(get_full_url + '/details.php?id=' + GetID, {
						method: "GET",
					}).then(windows1251ResponseToUTF8Response).then(function(response) {
						return response.text();
					}).then(function(data) {
						const parser = new DOMParser();
						const doc = parser.parseFromString(data, "text/html");
						if (!doc.querySelector("#main > div").innerText.match(/Нет раздачи с таким ID/)) {
							var get_maininfo_year = doc.querySelector("div.bx1.justify h2").innerText.match(/Год выпуска: ([\d+]{4})/)[1];
							var similarfiles_link = (doc.querySelector('#tabs2').innerText.match(/Подобные раздачи найдено (\d+) раздач/) !== null ? window.open('browse.php?s=' + doc.querySelector('#tabs2 td.w90p').innerHTML.split('?s=')[1].split('&')[0] + '&d=' + (get_maininfo_year !== null ? get_maininfo_year : '0') + '&t=1', '_self') : SwallAutoCloseMsg("Подобных раздач ненайдено!", "2"));
						} else {
							return SwallAutoCloseMsg("Торрент файл не найден!", "2");
						}
					});
				});
				$("button#get_info_" + GetID + ",a#get_info_" + GetID).click(async function() {
					await ShowSweetAlertInfo(GetID, "search");
				});
				$("#download_torrent_file_" + GetID).click(function() {
					if (KZ_ShowConfirmDownload) {
						Swal.fire({
							title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
							html: "<b style='color:#FF0000;'>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!</b>",
							icon: 'question',
							showCancelButton: false,
							showDenyButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							denyButtonText: "НЕТ",
							confirmButtonText: "ДА",
						}).then(function(result) {
							if (result.isConfirmed) {
								window.location.href = get_full_url + "/download.php?id=" + GetID;
								SwallAutoCloseMsg("Скачивается торрент файл!", "2");
							}
						});
					} else {
						window.location.href = get_full_url + "/download.php?id=" + GetID;
						SwallAutoCloseMsg("Скачивается торрент файл!", "2");
					}
				});
				$("#download_magnet_" + GetID).click(function() {
					fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2', {
						method: "GET",
					}).then(function(response) {
						return response.text();
					}).then(function(data) {
						if (KZ_ShowConfirmDownload) {
							Swal.fire({
								title: "СКАЧАТЬ ЧЕРЕЗ MAGNET?",
								html: "<b style='color:#009900;'>Ваш рейтинг не упадёт, можете скачивать бесконечно!</b>",
								icon: 'question',
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function(result) {
								if (result.isConfirmed) {
									window.location.href = hash;
									SwallAutoCloseMsg("Скачивается через Magnet!", "2");
								}
							});
						} else {
							window.location.href = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
							SwallAutoCloseMsg("Скачивается через Magnet!", "2");
						}
					}).catch(function(e) {
						SwallAutoCloseMsg("get_srv_details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
					});
				});
				$("#copy_magnet_" + GetID).click(function() {
					fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2', {
						method: "GET",
					}).then(function(response) {
						return response.text();
					}).then(function(data) {
						copy("magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0]);
						SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
					});
				});
				$("#copy_youtube_" + GetID).click(function() {
					fetch(get_full_url + '/details.php?id=' + GetID, {
						method: "GET",
					}).then(windows1251ResponseToUTF8Response).then(function(response) {
						return response.text();
					}).then(function(data) {
						const parser = new DOMParser();
						const doc = parser.parseFromString(data, "text/html");
						if (!doc.querySelector("#main > div").innerText.match(/Нет раздачи с таким ID/)) {
							var get_maininfo_name = doc.querySelector("div.bx1.justify h2").innerText.match(/(Исполнитель:|Оригинальное название:|Название:|Альбом:)(.*)/)[2];
							var get_maininfo_year = doc.querySelector("div.bx1.justify h2").innerText.match(/Год выпуска: ([\d+]{4})/)[1];
							var full_name_youtube = get_maininfo_name + " " + get_maininfo_year;
							copy(full_name_youtube + ' русский трейлер');
							SwallAutoCloseMsg("Youtube текст скопирован!", "2");
						} else {
							return SwallAutoCloseMsg("Торрент файл не найден!", "2");
						}
					});
				});
				$("#add_torrserver_" + GetID).click(function() {
					if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null) {
						var GetHash = "",
							GetImageSrc = "",
							GetFullName = "";
						fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2', {
							method: "GET",
						}).then(function(response) {
							return response.text();
						}).then(function(data) {
							return GetHash = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
						}).catch(function(e) {
							SwallAutoCloseMsg("get_srv_details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
						});
						fetch(get_full_url + '/details.php?id=' + GetID, {
							method: "GET",
						}).then(windows1251ResponseToUTF8Response).then(function(response) {
							return response.text();
						}).then(function(data) {
							const parser = new DOMParser();
							const doc = parser.parseFromString(data, "text/html");
							GetImageSrc = doc.querySelector('.p200').src;
							GetFullName = doc.querySelector(".mn_wrap h1 a").innerText.toUpperCase();
							if (TSVersion === "old") {
								let Data = {
									'Link': GetHash,
									'DontSave': !true,
									'Info': JSON.stringify({
										'poster_path': GetImageSrc
									})
								};
								TS_POST("torrent/add", JSON.stringify(Data), (response) => {
									if (/^[0-9a-f]{40}$/i.test(response)) {
										"Раздача добавлена в TorrServer!"
									} else {
										"TorrServer отклонил запрос"
									}
								});
							} else {
								let Data = {
									'action': 'add',
									'link': GetHash,
									'title': GetFullName,
									'poster': GetImageSrc,
									'save_to_db': true
								};
								TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
							}
						}).catch(function(e) {
							SwallAutoCloseMsg("details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
						});
					} else {
						SwallAutoCloseMsg("Данная раздача не является фильмом, сериалом, поэтому не может быть добавлена в TorrServer!", "3");
					}
				});
			});
		}
	}
	if (reg_kinozal_detailed.test(get_url)) {
		var GetCAT
		$(document).on('click', ".spoilerButton", function() {
			var $this = $(this);
			var $isExpanded = $this.hasClass("open");
			$this.toggleClass("open").toggleClass("close");
			if ($isExpanded) {
				$this.next().slideUp(200);
			} else {
				$this.next().slideDown(200);
			}
		});
		if (get_acc_login_check.match(/\( Выход \)/) !== null) {
			if (KZ_ShowTorrentButton || KZ_ShowMagnetButton || KZ_ShowTorrServerButton) {
				var GetID = get_url.match('id=([0-9]+)')[1];
				if (new RegExp('kinozal(.me|.tv|.guru|.website|tv.life)\/details.php', 'i').test(get_url)) {
					GetCAT = document.querySelector("img.cat_img_r").getAttribute('onclick').match(/[0-9]+/)[0];
				} else {
					GetCAT = "";
				}
				var GetFullName = $('.mn_wrap h1 a').text();
				var gfname = $('.mn_wrap h1 a').text().split(" / ");
				var getfname = gfname[0].toUpperCase();
				var GetImageSrc = document.querySelector('.p200').src;
				var set_buttons = document.querySelector("table.w100p");
				set_buttons.classList.add('bx1');
				var check_movie = 0;
				if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null) {
					check_movie = 1;
				}
				var KZ_ShowButtons = "",
					KZ_TorrentButton = "",
					KZ_MagnetButton = "",
					KZ_CopyMagnetButton = "",
					KZ_TorrServerButton = "";
				if (KZ_DetailedInfoButtons) {
					if (KZ_ShowTorrentButton && check_movie == 1) {
						KZ_TorrentButton = '<button id="DownloadTorrentFile" type="button" class="btn_normal btn_cgreen MT4"><i class="fa fa-download"></i> TORRENT</button>';
					}
					if (KZ_ShowMagnetButton) {
						KZ_MagnetButton = '<button id="DownloadMagnet" type="button" class="btn_normal btn_cblue MT4"><i class="fa fa-download"></i> MAGNET</button>';
					}
					if (KZ_ShowCopyMagnetButton) {
						KZ_CopyMagnetButton = '<button id="CopyMagnet" type="button" class="btn_normal btn_cblue MT4"><i class="fa fa-copy"></i> MAGNET</button>';
					}
					if (KZ_ShowTorrServerButton) {
						KZ_TorrServerButton = '<button id="AddTorrServer" type="button" class="btn_normal btn_cred MT4"><i class="fa fa-plus-square"></i> TORRSERVER</button>';
					}
					KZ_ShowButtons = KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_TorrServerButton;
					set_buttons.innerHTML = `<tbody id="copy_form">
	<tr>
		<td class="nw">${KZ_ShowButtons}</td>
	</tr>
</tbody>`;
				} else {
					if (KZ_ShowTorrentButton && check_movie == 1) {
						KZ_TorrentButton = '<tr><td style="width: 260px;" class="nw"><button id="DownloadTorrentFile" type="button" class="btn_normal btn_cgreen MT2"><i class="fa fa-download"></i> ТОРРЕНТ ФАЙЛ</button></td><td><b><font color="#00cc00">СКАЧАТЬ ТОРРЕНТ ФАЙЛ</font></b><br>Для того, чтобы скачать эту раздачу - скачайте торрент-файл и запустите его при помощи клиента.</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					if (KZ_ShowMagnetButton) {
						KZ_MagnetButton = '<tr><td style="width: 260px;" class="nw"><button id="DownloadMagnet" type="button" class="btn_normal btn_cblue MT2"><i class="fa fa-download"></i> MAGNET</button></td><td><b><font color="#0000cc">СКАЧАТЬ ЧЕРЕЗ MAGNET</font></b><br>Скачивайте сколько угодно, ваш рейтинг не изменится, так как данный метод не затрагивает ваш профиль!</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					if (KZ_ShowCopyMagnetButton) {
						KZ_CopyMagnetButton = '<tr><td style="width: 260px;" class="nw"><button id="CopyMagnet" type="button" class="btn_normal btn_cblue MT2"><i class="fa fa-copy"></i> MAGNET</button></td><td><b><font color="#0000cc">СКОПИРОВАТЬ MAGNET</font></b><br>Копирование MAGNET ссылки</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					if (KZ_ShowTorrServerButton) {
						KZ_TorrServerButton = '<tr><td style="width: 260px;" class="nw"><button id="AddTorrServer" type="button" class="btn_normal btn_cred MT2"><i class="fa fa-plus-square"></i> TORRSERVER</button></td><td><b><font color="#cc0000">ДОБАВИТЬ В TORRSERVER</font></b><br>Добавление данной раздачи в TorrServer</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					KZ_ShowButtons = KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_TorrServerButton;
					set_buttons.innerHTML = `<tbody id="copy_form">${KZ_ShowButtons}</tbody>`;
				}
				document.getElementById('copy_form').addEventListener('click', async function(evt) {
					var target = evt.target;
					if (target.id === 'CopyMagnet') {
						fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2", {
							method: "GET",
						}).then(function(response) {
							if (!response.ok) {
								throw Error(response.statusText)
							}
							return response.text();
						}).then(function(data) {
							copy("magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0]);
							SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
						});
					} else if (target.id === 'DownloadMagnet') {
						fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2", {
							method: "GET",
						}).then(function(response) {
							if (!response.ok) {
								throw Error(response.statusText)
							}
							return response.text();
						}).then(function(data) {
							var hash = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
							if (KZ_ShowConfirmDownload) {
								Swal.fire({
									title: "СКАЧАТЬ ЧЕРЕЗ MAGNET?",
									html: "<b style='color:#009900;'>Ваш рейтинг не упадёт, можете скачивать бесконечно!</b>",
									icon: 'question',
									showCancelButton: false,
									showDenyButton: true,
									confirmButtonColor: '#4fc823',
									cancelButtonColor: '#d33',
									denyButtonText: "НЕТ",
									confirmButtonText: "ДА",
								}).then(function(result) {
									if (result.isConfirmed) {
										window.location.href = hash;
										SwallAutoCloseMsg("Скачивается через Magnet!", "2");
									}
								});
							} else {
								window.location.href = hash;
								SwallAutoCloseMsg("Скачивается через Magnet!", "2");
							}
						});
					} else if (target.id === 'DownloadTorrentFile') {
						fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2", {
							method: "GET",
						}).then(function(response) {
							if (!response.ok) {
								throw Error(response.statusText)
							}
							return response.text();
						}).then(function(data) {
							if (KZ_ShowConfirmDownload) {
								Swal.fire({
									title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
									html: "<b style='color:#FF0000;'>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!</b>",
									icon: 'question',
									showCancelButton: false,
									showDenyButton: true,
									confirmButtonColor: '#4fc823',
									cancelButtonColor: '#d33',
									denyButtonText: "НЕТ",
									confirmButtonText: "ДА",
								}).then(function(result) {
									if (result.isConfirmed) {
										window.location.href = get_full_url + "/download.php?id=" + GetID;
										SwallAutoCloseMsg("Скачивается торрент файл!", "2");
									}
								});
							} else {
								window.location.href = get_full_url + "/download.php?id=" + GetID;
								SwallAutoCloseMsg("Скачивается торрент файл!", "2");
							}
						});
					} else if (target.id === 'AddTorrServer') {
						if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null) {
							fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2", {
								method: "GET",
							}).then(function(response) {
								if (!response.ok) {
									throw Error(response.statusText)
								}
								return response.text();
							}).then(function(data) {
								var GetHash = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
								if (KZ_ShowConfirmDownload) {
									Swal.fire({
										title: "ДОБАВИТЬ РАЗДАЧУ В TORRSERVER?",
										icon: 'question',
										showCancelButton: false,
										showDenyButton: true,
										confirmButtonColor: '#4fc823',
										cancelButtonColor: '#d33',
										denyButtonText: "НЕТ",
										confirmButtonText: "ДА",
									}).then(function(result) {
										if (result.isConfirmed) {
											if (TSVersion === "old") {
												let Data = {
													'Link': GetHash,
													'DontSave': !true,
													'Info': JSON.stringify({
														'poster_path': GetImageSrc
													})
												};
												TS_POST("torrent/add", JSON.stringify(Data), (response) => {
													if (/^[0-9a-f]{40}$/i.test(response)) {
														"Раздача добавлена в TorrServer!"
													} else {
														"TorrServer отклонил запрос"
													}
												});
											} else {
												let Data = {
													'action': 'add',
													'link': GetHash,
													'title': GetFullName,
													'poster': GetImageSrc,
													'save_to_db': true
												};
												TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
											}
										}
									});
								} else {
									if (TSVersion === "old") {
										let Data = {
											'Link': GetHash,
											'DontSave': !true,
											'Info': JSON.stringify({
												'poster_path': GetImageSrc
											})
										};
										TS_POST("torrent/add", JSON.stringify(Data), (response) => {
											if (/^[0-9a-f]{40}$/i.test(response)) {
												"Раздача добавлена в TorrServer!"
											} else {
												"TorrServer отклонил запрос"
											}
										});
									} else {
										let Data = {
											'action': 'add',
											'link': GetHash,
											'title': GetFullName,
											'poster': GetImageSrc,
											'save_to_db': true
										};
										TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
									}
								}
							});
						} else {
							SwallAutoCloseMsg("Данная раздача не является фильмом, сериалом, поэтому не может быть добавлена в TorrServer!", "3");
						}
					}
				}, false);
			}
		}
	}
	if (reg_rutor_list.test(get_url)) {
		GM_addStyle(`html, body {padding: 0;margin: 0;font-size: 12px;font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;}table#details {width: 98%;}h1 {font-size: 20px;color: #4F4F4F;font-weight: normal;padding-left: 10px;}h2 {font-size: 18px;color: #5F5F5F;font-weight: normal;padding-left: 10px;}h2 a {color: #019F00;text-decoration: none;}h2 a:hover {text-decoration: underline;}h3 {text-align: center;font-size: 16px;font-weight: normal;line-height: 1.7em;}h3 a {padding: 3px;color: #3599B3;text-decoration: none;}h3 a:hover {background-color: #FFFF88;text-decoration: underline;}a {color: #0040EF;}tr.backgr {height: 41px;background-image: url('data:image/png;base64,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');background-repeat: repeat-x;color: #000000;font-weight: bold;}tr.backgr td {padding-left: 2px;}#fforum {text-decoration: none;font-size: 30px;color: #4C89C2;}#all {margin: 0px;padding: 0;}#up {width: 100%;height: 110px;}#menu {width: 100%;height: 30px;background-image: url('data:image/png;base64,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');}#download {font-size: 26px;padding: 3px;margin: 5px;border: solid 1px #8BA7CD;background-color: #EFF3FB;}#send_torrent {font-size: 18px;padding: 3px;margin: 3px;border: solid 1px #8BA7CD;background-color: #EFF3FB;}.d_small {font-size: 12px;}input, textarea {border: 1px solid #4C89C2;}td.up {text-align: right;}#rss {float: right;margin: 3px;}img {border: 0 none black;}#menu .logout {float: right;}#menu a{float: left;text-decoration: none;color: #FFFFFF;font-size: 14px;padding-right: 4px;padding-left: 4px;}#menu a:hover {text-decoration: underline;}#menu span {color: #BFCBE0;float: left;font-size: 16px;}td {font-size: 12px;}div#index tr.dark{background-color: #D5DAE0;font-weight: bold;}div#index tr a:hover {text-decoration: none;}div#index tr a {text-transform: uppercase;display: block;font-weight: bold;text-decoration: none;font-size: 18px;vertical-align: bottom;text-align: left;cursor: pointer;}div#index tr.tum {background-color: #EEF3F5;}div#index tr:hover {background-color: #ffffff;}#downgif {margin: 5px;}.blue {color: blue;}.green {color: #008000;}.red {color: #8B0000;}table#files {border-collapse: collapse;}table#files td {padding: 1px;border: 1px dashed black;}div.comment {width: 70%;margin: 5px;padding: 5px;border: 1px dotted black;background-color: #EFF3FF;}span.x {float: right;cursor: pointer;}span.beforex {float: left;}div#ws {width: 100%;}div#ws div#sidebar {width: 250px;position: absolute;right: 15px;top: 30px;}div#ws div#sidebar div.sideblock {width: 100%;text-align: center;border: 3px double #FFA302;border-style: double;margin-top: 5px;}.sideblock2 {width: 100%;text-align: center;margin-top: 2px;}div#ws div#sidebar div.sideblock a {text-decoration: none;}div#ws div#sidebar div.sideblock a:hover {text-decoration: underline;}div#search input#in {font-size: 13px;color: #000;background-color: #fff;border: 1px solid #000;}div#search input#sub {font-size: 16px;background-color: #e3eeff;border: 1px solid #000;}div#down {width: 100%;padding-top: 1%;font-size: 12px;color: #7F7F7F;text-align: justify;}div#down a {color: #4F4F4F;text-decoration: none;}div#redpeers {border: 1px solid red;padding: 5px;background-color: #FFDFDF;margin-top: 5px;text-align: justify;font-size: 12px;}#warning {font-weight: bold;border: 1px solid #F16C25;margin: 5px;padding: 5px;background-color: #FDD99C;}div.emule {margin: 5px;border: solid 1px #01AF00;padding: 3px;background-color: #EFFFEF;}div.emule a {color: #187F17;font-size: 25px;}div#logo {float: left;margin: 0px;margin-left: 0px;}div#vote4us {float: left;margin-left: 5px;margin-top: 1px;}div#bannerh {float: right;margin: 5px;}td.header {font-weight: bold;margin: 5px;}span.button {cursor: pointer;}#torrentproblems {border: 3px double red;padding: 5px;background-color: #FFEFEF;margin-top: 5px;text-align: justify;font-size: 20px;}#our_future {border: 3px solid red;padding: 5px;background-color: #FFEFEF;margin-top: 5px;text-align: justify;font-size: 22px;}.c_h {background-color: #BFD0FF;}.c_t {background-color: #DFE8FF;}.c_h_tech {background-color: #BFFFC3;}.c_t_tech {background-color: #DFFFE1;}.c_h_a {background-color: #FF6F75;}.c_t_a {background-color: #FFCFD1;}.code {width: 90%;padding: 5px;margin: 5px;border: 1px solid gray;background-color: #EBEBEB;}#sddm {margin: 0;padding: 0;z-index: 30;}#sddm li {margin: 0;padding: 0;list-style: none;float: left;font: bold 11px arial;}#sddm li a {display: block;margin: 0 1px 0 0;padding: 4px 10px;width: 60px;background: #5970B2;color: #FFF;text-align: center;text-decoration: none;}#sddm li a:hover {background: #49A3FF;}#sddm div {position: absolute;visibility: hidden;margin: 0;padding: 0;background: #EAEBD8;border: 1px solid #5970B2;}#sddm div a {position: relative;display: block;margin: 0;padding: 5px 10px;width: auto;white-space: nowrap;text-align: left;text-decoration: none;background: #EAEBD8;color: #2875DE;font: 11px arial;}#sddm div a:hover {background: #49A3FF;color: #FFF;}.hidewrap {margin-left: 10px;border: 1px solid #C3CBD1;margin: 5px;z-index: 100;}.hidehead {background-color: #E9E9E6;font-weight: bold;padding: 3px;padding-left: 20px;background-image: url('data:image/gif;base64,R0lGODlhCQAJAMQfAIqZyoGSxv3+/trl84CQxYCRxn6PxMXQ7efq9H+Pwtnk8oKTxoCQxKy44QAAANvl9rvG6fD5/o2by4GRxvb8//v9//7+/ubw+v39/ouayoKSxoOTx/7+/wwMDP///////yH5BAEAAB8ALAAAAAAJAAkAAAU84AdoGkNmX4Z4HldRirSxXMdF1zK7nXU9mk2t4+h0BIlNhWPpYTCBDQXXwRwggczgJ8BAGhLRZGIoEFAhADs=');background-repeat: no-repeat;background-position: 6px 6px;cursor: pointer;}.hidebody {border-top: 1px solid #C3CBD1;padding: 3px;display: none;background-color: #F5F5F5;}.hidearea {display:none;}#news_table {padding-left: 5px;border-spacing: 2px;}.news_date {background-color: #F2F2F2;text-align: center;border: 1px solid #B4B4B4;}.news_title {background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAAQGQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A7UUtFFADhS0UUAOFLRRQA4UtFFADhS0UUAOFLRRQA4UtFFADhS0UUAOFLRRQA4UtFFADhS0UUAOFLRRQA4UtFFADhS0UUAOFLRRQA4UtFFADhS0UUAOFLRRQA4UtFFADhS0UUAOFLRRQA4UtFFADhS0UUAOFLRRQA4UtFFAH/9k=');background-repeat: no-repeat;background-attachment: scroll;background-position: left top;background-color: transparent;width: 500px;}.news_title a {color: black;text-decoration: none;}.news_title a:hover {text-decoration: underline;}#news_table td {padding: 7px;padding-top: 2px;padding-bottom: 2px;}#news_table tr {border-top: 1px solid #B4B4B4;}.fake_link {color: #0040EF;cursor: pointer;}span.fake_link:hover {text-decoration: underline;}.menu_b {text-decoration: none !important;}.menu_b div {background-image: url('data:image/gif;base64,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');width: 81px;height: 30px;text-align: center;vertical-align: middle;line-height: 30px;color: #FFCC00;cursor: pointer;}.menu_b div:hover {background-image: url('data:image/gif;base64,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');} #swal2-html-container > table > tbody > tr > td {font-size: 18px;}`);
		var RUTOR_ShowConfirmDownload = RutorCFG.get('ShowConfirmDownload');
		var RUTOR_ShowTorrentButton = RutorCFG.get('ShowTorrentButton');
		var RUTOR_ShowMagnetButton = RutorCFG.get('ShowMagnetButton');
		var RUTOR_ShowYoutubeButton = RutorCFG.get('ShowYoutubeButton');
		var RUTOR_ShowCopyMagnetButton = RutorCFG.get('ShowCopyMagnetButton');
		var RUTOR_ShowCopyYoutubeButton = RutorCFG.get('ShowCopyYoutubeButton');
		var RUTOR_ShowTorrServerButton = RutorCFG.get('ShowTorrServerButton');
		var RUTOR_ShowSearchKinopoiskButton = RutorCFG.get('ShowSearchKinopoiskButton');
		var RUTOR_ShowPostImg = RutorCFG.get('ShowPostImg');
		var RUTOR_ShowPostImgWH = RutorCFG.get('ShowPostImgWH');
		var RUTOR_SwalDetailedInfoWidth = RutorCFG.get('SwalDetailedInfoWidth');
		var RUTOR_FontSize = RutorCFG.get('FontSize') + 'px';
		var RUTOR_MinimizedStyle = RutorCFG.get('MinimizedStyle');
		var RUTOR_ShowMarkTorrents = RutorCFG.get('ShowMarkTorrents');
		var RUTOR_MarkTextValue = RutorCFG.get('MarkTextValue');
		var RUTOR_MarkBolder = RutorCFG.get('MarkBolder');
		var RUTOR_MarkColorValue = RutorCFG.get('MarkColor');
		var RUTOR_MarkBoldColorValue = RutorCFG.get('MarkBoldColor');
		var RUTOR_ADSY_TextValue = new RegExp(RutorCFG.get('ADSY_TextValue'), 'g');
		var RUTOR_ADSN_TextValue = new RegExp(RutorCFG.get('ADSN_TextValue'), 'g');
		var RUTOR_ADSY_ColorValue = RutorCFG.get('ADSY_Color');
		var RUTOR_ADSN_ColorValue = RutorCFG.get('ADSN_Color');
		var RUTOR_SeedGraphSettings = RutorCFG.get('SeedGraphSettings');
		var RUTOR_SeedGraphColor = RutorCFG.get('SeedGraphColor');
		var RUTOR_SeedGraphHeight = RutorCFG.get('SeedGraphHeight');
		var RUTOR_SeedGraphHeight2 = RutorCFG.get('SeedGraphHeight2');
		$('div.sideblock:nth-of-type(1),div.sideblock2:nth-of-type(3),div.sideblock2:nth-of-type(4)').remove();

		if ($("#sidebar > div:nth-child(1)")[0].outerHTML.match(/viti.gif/im) !== null) {
			$("#menu > #menu_right_side")[0].innerHTML = '<span style="float: right;"><button onclick="location.href=\'/profile.php\';" type="button" class="btn_small btn_cred"><i class="fa fa fa-user"></i> ПРОФИЛЬ</button><button onclick="location.href=\'/users.php?logout\';" type="button" class="btn_small btn_cred MT6"><i class="fa fa-sign-out"></i> ВЫХОД</button><span>';
		}
		GM_addStyle("tr.backgr {height: 41px;background-image: none;background-repeat: unset;color: #000000;font-weight: bold;}div#ws div#content {position: absolute;left: 0px;right: 0px;}tr.gai td:nth-child(1),tr.tum td:nth-child(1) {width: 90px;text-align: center;}tr.gai td:nth-child(5), tr.tum td:nth-child(5) {width: 110px;}div#index table {border-collapse: collapse;}div#index tr {border-bottom: 1px solid #b1adad;}div#index td {font-size: 16px;padding: 2px 0px;}div#index tr.tum{background-color: #ffffff;}.btn_tiny {vertical-align: unset;}#menu {width: auto;height: 40px;background-image: none;background: #ffde02;border: 1px solid #464646;}#menu a {float: left;text-decoration: none;color: #FFFFFF;font-size: 18px;padding: 0px;margin: 4px 4px;}.menu_b div:hover {background-image: unset;color: #333333;text-decoration: none;background: #fff;}.menu_b div {display: block;float: left;color: #666;font-weight: normal;text-align: center;border: 1px solid #bbb;border-radius: 4px;background: #efefef;background: -moz-linear-gradient(top, #fff 0%, #efefef 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fff), color-stop(100%, #efefef));background: -webkit-linear-gradient(top, #fff 0%, #efefef 100%);background: -o-linear-gradient(top, #fff 0%, #efefef 100%);padding: 4px 8px;width: auto;height: auto;cursor: pointer;vertical-align: middle;line-height: normal;}.seed-line { height: " + RUTOR_SeedGraphHeight + "px; background-color: " + RUTOR_SeedGraphColor + ";}.fa {display: inline-block;font: normal normal normal 20px/1 FontAwesome;font-size: 22px;text-rendering: auto;-webkit-font-smoothing: unset;-moz-osx-font-smoothing: unset;}");
		$('#menu').append('<a href="javascript:void(0);" id="rutor_settings" class="menu_b"><div><i class="fa fa-cogs"></i> Настройки</div></a>' + (RUTOR_ShowTorrServerButton === true ? '<a href="javascript:void(0);" id="torrserver_settings" class="menu_b"><div><i class="fa fa-cogs"></i> TorrServer</div></a>' : ''));
		$("#menu a#rutor_settings").click(function() {
			GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}*, *::before, *::after {box-sizing: unset;}");
			RutorCFG.open();
		});
		$("#menu a#rutor_settings").click(function() {
			GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}*, *::before, *::after {box-sizing: unset;}");
			RutorCFG.open();
		});
		$("#menu a#torrserver_settings").click(function() {
			GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}*, *::before, *::after {box-sizing: unset;}");
			TorrServerCFG.open();
		});
		if ($("#menu > #menu_right_side")[0].outerHTML.match(/zaiti.gif/im) !== null) {
			$("#menu > #menu_right_side")[0].innerHTML = '<span style="float: right;"><button onclick="location.href=\'/users.php\';" type="button" class="btn_small btn_cred MT6"><i class="fa fa-sign-in"></i> ВХОД</button><span>';
		} else if ($("#menu > #menu_right_side")[0].outerHTML.match(/viti.gif/im) !== null) {
			$("#menu > #menu_right_side")[0].innerHTML = '<span style="float: right;"><button onclick="location.href=\'/profile.php\';" type="button" class="btn_small btn_cred"><i class="fa fa fa-user"></i> ПРОФИЛЬ</button><button onclick="location.href=\'/users.php?logout\';" type="button" class="btn_small btn_cred MT6"><i class="fa fa-sign-out"></i> ВЫХОД</button><span>';
		}
		if (RUTOR_ShowMarkTorrents) {
			GM_addStyle("mark{" + (RUTOR_MarkBolder ? "text-shadow: -1px -1px 0px " + RUTOR_MarkBoldColorValue + ",0px -1px 0px " + RUTOR_MarkBoldColorValue + ",1px -1px 0px " + RUTOR_MarkBoldColorValue + ",1px 0px 0px " + RUTOR_MarkBoldColorValue + ",1px 1px 0px " + RUTOR_MarkBoldColorValue + ",0px 1px 0px " + RUTOR_MarkBoldColorValue + ",-1px 1px 0px " + RUTOR_MarkBoldColorValue + ",-1px 0px 0px " + RUTOR_MarkBoldColorValue + ";" : "") + "background: none;color: " + RUTOR_MarkColorValue + ";}");
		}
		var links = "",
			get_full_info = "",
			get_info = "",
			ads_result = "",
			ads_color = "",
			sort_cat_movie_result = "",
			search_like = "",
			search_like_button = "0",
			sort_cat_movie = "";
		$('tr.gai, tr.tum').each(function(i, el) {
			var $trs = $(this).find('td'),
				$spans4 = $($trs.get().pop()).find('span'),
				count = parseInt($.trim($($spans4.get(0)).text())) + parseInt($.trim($($spans4.get(1)).text()));
			count = Math.min(maxWidth, Math.round(parseInt(count / 10)));
			var GetURLID = $(el).find("a:nth-child(3)")[0].href.match(/torrent\/([0-9]+)\//)[1];
			var GetTitle = $(el).find("a:nth-child(3)")[0].innerText.toUpperCase();
			var GetHash = $(el).find("a:nth-child(2)")[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];

			function getInfo(GetURLID) {
				return fetch(get_full_url + "/torrent/" + GetURLID).then(response => {
					if (response.ok === true) {
						return response.text()
					} else {
						throw new error("HTTP status code" + response.status);
					}
				}).then(data => {
					var get_data = $(data),
						get_comment_info = get_data.find("#content > table").last()[0],
						get_img_url = get_data.find("#details img")[0],
						first_tr = get_data.find('#details > tbody > tr:nth-child(1)')[0],
						full_table = get_data.find('#details > tbody')[0],
						get_info = first_tr.innerHTML,
						get_name = first_tr.innerText.toUpperCase().match(/НАЗВАНИЕ: (.*)\nОРИГИНАЛЬНОЕ НАЗВАНИЕ: (.*)/),
						get_cat = full_table.innerText.toUpperCase().match(/КАТЕГОРИЯ(.*)/),
						search_ads = first_tr.innerText.trim().toLowerCase(),
						get_file_name = "",
						check_movie = "";
					get_data.find("#details > tbody").each(function() {
						search_like += this.innerHTML;
						sort_cat_movie += this.innerText;
					});
					if (search_like.match(/<a href="\/search\/.*\/.*\/.*\/.*\/.*" target="_blank">Искать ещё похожие раздачи<\/a>/)) {
						search_like_button = "1";
						var gsr = search_like.match(/<a href="\/search\/.*\/(.*)\/.*\/.*\/(.*)" target="_blank">Искать ещё похожие раздачи<\/a>/);
						search_like = "/search/0/" + gsr[1] + "/0/2/" + gsr[2] + "";
					}
					if (get_cat[0].match(/(ЗАРУБЕЖНЫЕ ФИЛЬМЫ|НАШИ ФИЛЬМЫ|НАУЧНО-ПОПУЛЯРНЫЕ ФИЛЬМЫ|ТЕЛЕВИЗОР|ЗАРУБЕЖНЫЕ СЕРИАЛЫ|НАШИ СЕРИАЛЫ|АНИМЕ|МУЛЬТИПЛИКАЦИЯ|СПОРТ И ЗДОРОВЬЕ|ЮМОР|ИНОСТРАННЫЕ РЕЛИЗЫ)/)) {
						check_movie = "1";
						if (RUTOR_MinimizedStyle) {
							if (search_ads.match(RUTOR_ADSN_TextValue)) {
								ads_result = '<b style="color: rgb(0 153 0);">БЕЗ РЕКЛАМЫ</b>';
								ads_color = RUTOR_ADSN_ColorValue;
							} else if (search_ads.match(RUTOR_ADSY_TextValue)) {
								ads_result = '<b style="color: rgb(255 0 0);">ЕСТЬ РЕКЛАМА</b>';
								ads_color = RUTOR_ADSY_ColorValue;
							} else if (search_ads.match(RUTOR_ADSN_TextValue) == null) {
								ads_result = "";
								ads_color = "";
							}
						} else {
							if (search_ads.match(RUTOR_ADSN_TextValue)) {
								ads_result = ' <b style="color: rgb(0 153 0);text-transform: uppercase;padding: 0 0 4px 0;font-size: 26px;">БЕЗ РЕКЛАМЫ</b>';
							} else if (search_ads.match(RUTOR_ADSY_TextValue)) {
								ads_result = ' <b style="color: rgb(255 0 0);text-transform: uppercase;padding: 0 0 4px 0;font-size: 26px;">ЕСТЬ РЕКЛАМА!</b>';
							}
						}
					} else {
						ads_result = "";
						ads_color = "";
						check_movie = "0";
					}
					if (get_name !== null) {
						if (typeof get_name[3] === "undefined") //НАЗВАНИЕ + ОРИГИНАЛЬНОЕ НАЗВАНИЕ
						{
							get_file_name = get_name[1] + " " + get_name[2] + " " + GetTitle.match(/\((.*)\)/)[1];
						} else if (typeof get_name[1] === "undefined" && typeof get_name[2] === "undefined") //НАЗВАНИЕ
						{
							get_file_name = get_name[3] + " " + GetTitle.match(/\((.*)\)/)[1];
						}
					} else {
						get_file_name = GetTitle.match(/.*\(.*\)/)[0];
					}
					return {
						ads: ads_result,
						ads_color: ads_color,
						sort: sort_cat_movie_result,
						search_like: search_like,
						youtube: get_file_name,
						get_info: get_info,
						get_comment_info: get_comment_info,
						img: get_img_url,
						check_movie: check_movie
					};
				}).catch(error => {
					console.error("Rutor Ошибка #" + i + "\nfunction getInfo(GetURLID)\n" + error)
				});
			}
			getInfo(GetURLID).then(result => {
				const show_info = result.get_info,
					show_ads_res = result.ads,
					show_comment_info = result.get_comment_info,
					show_search_like = result.search_like,
					youtube_link = result.youtube,
					get_img_url = result.img,
					check_movie = result.check_movie;
				var Normal_ID = GetURLID + '-' + i,
					colspan = $(el).find("td:nth-child(2)")[0].colSpan;
				if (RUTOR_MinimizedStyle) {
					links = '<div style="display:table;"><div style="width: max-content;text-align: left;padding: 0px;"><button id="open_link_' + Normal_ID + '" type="button" class="btn_tiny btn_corange MT2" style="padding: 5px 6px 5px 6px;font-size: 24px;line-height: 0;"><i class="fa fa-link"></i></button>' + ($trs.length !== 4 ? '<button id="get_comment_' + Normal_ID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 6px 5px 6px;font-size: 24px;line-height: 0;"><i class="fa fa-comments"></i></button>' : "") + (search_like_button == 1 ? '<button id="search_like_' + Normal_ID + '" type="button" class="btn_tiny btn_corange MT2" style="padding: 5px 6px 5px 6px;font-size: 25px;line-height: 0;" title="ИСКАТЬ"><i class="fa fa-search"></i></button>' : '') + (RUTOR_ShowSearchKinopoiskButton && check_movie == 1 ? '<button id="search_kinopoisk_' + Normal_ID + '" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 5px 6px 5px 6px;font-size: 25px;line-height: 0;" title="ИСКАТЬ В КИНОПОИСК"><i class="fa fa-search"></i></button>' : '') + (RUTOR_ShowYoutubeButton ? (check_movie == 1 ? '<button id="search_youtube_' + Normal_ID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 5px 6px;"><i class="fa fa-youtube-play"></i></button>' : "") : "") + (RUTOR_ShowTorrentButton ? '<button id="download_torrent_' + Normal_ID + '" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 5px 6px;"><i class="fa fa-download"></i></button>' : "") + (RUTOR_ShowMagnetButton ? '<button id="download_magnet_' + Normal_ID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 7px;"><i class="fa fa-magnet"></i></button>' : "") + (RUTOR_ShowCopyMagnetButton ? '<button id="copy_magnet_' + Normal_ID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 6px;"><i class="fa fa-copy"></i></button>' : "") + (RUTOR_ShowCopyYoutubeButton ? (check_movie == 1 ? '<button id="copy_youtube_' + Normal_ID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 5px 6px;"><i class="fa fa-copy"></i></button>' : "") : "") + (RUTOR_ShowTorrServerButton && check_movie == 1 ? '<button id="add_torrserver_' + Normal_ID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 5px 7px;"><i class="fa fa-plus-square"></i></button>' : "") + '</div><div style="display:table-cell;width:100%;vertical-align: middle;padding-left: 6px;"><a href="javascript:void(0);" id="get_info_' + Normal_ID + '" class="mark-' + i + '" style="padding: 5px;font-size: ' + RUTOR_FontSize + ';">' + GetTitle + '</a>' + (RUTOR_SeedGraphSettings ? '<div class="seed-line" style="width: ' + count + 'px;margin: 2px 0px 1px 0px;"></div>' : '') + '</td></div></div>';
				} else {
					links = '<button id="open_link_' + Normal_ID + '" type="button" class="btn_tiny btn_corange MT2" style="padding: 5px 6px 5px 6px;font-size: 24px;line-height: 0;"><i class="fa fa-link"></i></button>' + ($trs.length !== 4 ? '<button id="get_comment_' + Normal_ID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 6px 5px 6px;font-size: 24px;line-height: 0;"><i class="fa fa-comments"></i></button>' : "") + (search_like_button == 1 ? '<button id="search_like_' + Normal_ID + '" type="button" class="btn_tiny btn_corange MT2" style="padding: 5px 6px 5px 6px;font-size: 25px;line-height: 0;"><i class="fa fa-search"></i></button>' : '') + (RUTOR_ShowSearchKinopoiskButton && check_movie == 1 ? '<button id="search_kinopoisk_' + Normal_ID + '" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 5px 6px 5px 6px;font-size: 25px;line-height: 0;"><i class="fa fa-search"></i></button>' : '') + (RUTOR_ShowYoutubeButton ? (check_movie == 1 ? '<button id="search_youtube_' + Normal_ID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 5px 6px;"><i class="fa fa-youtube-play"></i></button>' : "") : "") + (RUTOR_ShowTorrentButton ? '<button id="download_torrent_' + Normal_ID + '" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 5px 6px;"><i class="fa fa-download"></i></button>' : "") + (RUTOR_ShowMagnetButton ? '<button id="download_magnet_' + Normal_ID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 7px;"><i class="fa fa-magnet"></i></button>' : "") + (RUTOR_ShowCopyMagnetButton ? '<button id="copy_magnet_' + Normal_ID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 6px;"><i class="fa fa-copy"></i></button>' : "") + (RUTOR_ShowCopyYoutubeButton ? (check_movie == 1 ? '<button id="copy_youtube_' + Normal_ID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 5px 6px;"><i class="fa fa-copy"></i></button>' : "") : "") + (RUTOR_ShowTorrServerButton && check_movie == 1 ? '<button id="add_torrserver_' + Normal_ID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 5px 7px;"><i class="fa fa-plus-square"></i></button>' : "") + show_ads_res + '<br><a href="javascript:void(0);" id="get_info_' + Normal_ID + '" class="mark-' + i + '" style="padding: 5px;font-size: ' + RUTOR_FontSize + ';">' + GetTitle + '</a>' + (RUTOR_SeedGraphSettings ? '<div class="seed-line" style="width: ' + count + 'px;margin: 2px 0px 1px 0px;"></div>' : '') + '</div>';
				}
				if (RUTOR_ShowPostImg && get_img_url !== null) {
					$(el).find("tr").prevObject[0].style.background = result.ads_color;
					$(el).find("td:nth-child(2)")[0].innerHTML = `<div style="display:table;">
<div style="display:table-cell;">${"<img id=\"img_get_info_"+Normal_ID+"\" style=\"width:" + RUTOR_ShowPostImgWH[0] + ";height:" + RUTOR_ShowPostImgWH[1] + ";cursor: pointer;float: left;margin: 2px;position: relative;border: 1px solid #7d7d7d;display: block;border-radius: 7px;\" src=\""+get_img_url.src+"\" alt=\"\">"}</div>
<div style="display:table-cell;width:100%;vertical-align: middle;padding: 0px 0px 3px 3px;">
${links}
</div>
</div>`;
				} else {
					$(el).find("tr").prevObject[0].style.background = result.ads_color;
					$(el).find("td:nth-child(2)")[0].innerHTML = `${links}`;
				}
				if (RUTOR_ShowMarkTorrents) {
					var mark_instance2 = new Mark(document.querySelectorAll(".mark-" + i + "")).mark(RUTOR_MarkTextValue);
				}
				$("#search_kinopoisk_" + Normal_ID).click(function() {
					if (check_movie == 1) {
						window.open('https://www.kinopoisk.ru/index.php?kp_query=' + fixedEncodeURIComponent(youtube_link.trim()));
					} else {
						SwallAutoCloseMsg("Данная раздача не является фильмом, сериалом, поэтому нет возможности найти такую раздачу в кинопоиске!", "3");
					}
				});
				$("#search_like_" + Normal_ID).click(function() {
					window.location.href = get_full_url + show_search_like;
				});
				$("#open_link_" + Normal_ID).click(function() {
					window.open(get_full_url + '/torrent/' + GetURLID);
				});
				$("#search_youtube_" + Normal_ID).click(function() {
					window.open('https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(youtube_link.trim() + ' РУССКИЙ ТРЕЙЛЕР'));
				});
				$("#get_comment_" + Normal_ID + "").click(function() {
					Swal.fire({
						width: RUTOR_SwalDetailedInfoWidth,
						html: show_comment_info,
						showConfirmButton: false,
						showCancelButton: false,
						footer: '<center><button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button></center>',
						didOpen: () => {
							Swal.getFooter().querySelector('button#cancel').focus();
						}
					});
					$("#cancel").click(function() {
						Swal.close();
					});
				});
				$("#get_info_" + Normal_ID + ",#img_get_info_" + Normal_ID + "").click(function() {
					Swal.fire({
						width: RUTOR_SwalDetailedInfoWidth,
						html: show_info,
						showConfirmButton: false,
						showCancelButton: false,
						footer: '<center><button type="button" onclick="window.open(\'' + get_full_url + '/torrent/' + GetURLID + '\',\'_self\')" class="btn_small btn_cblue MT4">ОТКРЫТЬ РАЗДАЧУ</button> <button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button></center>',
						didOpen: () => {
							Swal.getFooter().querySelector('button#cancel').focus();
						}
					});
					$("#cancel").click(function() {
						Swal.close();
					});
				});
				$("#download_torrent_" + Normal_ID).click(function() {
					if (RUTOR_ShowConfirmDownload) {
						Swal.fire({
							title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
							icon: 'question',
							showCancelButton: false,
							showDenyButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							denyButtonText: "НЕТ",
							confirmButtonText: "ДА",
						}).then(function(result) {
							if (result.isConfirmed) {
								window.location.href = get_full_url + "/download/" + GetURLID;
								SwallAutoCloseMsg("Скачивается торрент файл!", "2");
							}
						});
					} else {
						window.location.href = get_full_url + "/download/" + GetURLID;
						SwallAutoCloseMsg("Скачивается торрент файл!", "2");
					}
				});
				$("#download_magnet_" + Normal_ID).click(function() {
					if (RUTOR_ShowConfirmDownload) {
						Swal.fire({
							title: "СКАЧАТЬ ЧЕРЕЗ MAGNET?",
							icon: 'question',
							showCancelButton: false,
							showDenyButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							denyButtonText: "НЕТ",
							confirmButtonText: "ДА",
						}).then(function(result) {
							if (result.isConfirmed) {
								window.location.href = GetHash;
								SwallAutoCloseMsg("Скачивается через Magnet!", "2");
							}
						});
					} else {
						window.location.href = GetHash;
						SwallAutoCloseMsg("Скачивается через Magnet!", "2");
					}
				});
				$("#copy_magnet_" + Normal_ID).click(function() {
					copy(GetHash);
					SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
				});
				$("#copy_youtube_" + Normal_ID).click(function() {
					copy(youtube_link.trim() + ' РУССКИЙ ТРЕЙЛЕР');
					SwallAutoCloseMsg("Youtube текст скопирован!", "2");
				});
				$("#add_torrserver_" + Normal_ID).click(function() {
					if (check_movie == 1) {
						if (RUTOR_ShowConfirmDownload) {
							Swal.fire({
								title: "ДОБАВИТЬ В TORRSERVER?",
								icon: 'question',
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function(result) {
								if (result.isConfirmed) {
									if (TSVersion === "old") {
										let Data = {
											'Link': GetHash,
											'DontSave': !true,
											'Info': JSON.stringify({
												'poster_path': get_img_url.src
											})
										};
										TS_POST("torrent/add", JSON.stringify(Data), (response) => {
											if (/^[0-9a-f]{40}$/i.test(response)) {
												"Раздача добавлена в TorrServer!"
											} else {
												"TorrServer отклонил запрос"
											}
										});
									} else {
										let Data = {
											'action': 'add',
											'link': GetHash,
											'title': GetTitle,
											'poster': get_img_url.src,
											'save_to_db': true
										};
										TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
									}
								}
							});
						} else {
							if (TSVersion === "old") {
								let Data = {
									'Link': GetHash,
									'DontSave': !true,
									'Info': JSON.stringify({
										'poster_path': get_img_url.src
									})
								};
								TS_POST("torrent/add", JSON.stringify(Data), (response) => {
									if (/^[0-9a-f]{40}$/i.test(response)) {
										"Раздача добавлена в TorrServer!"
									} else {
										"TorrServer отклонил запрос"
									}
								});
							} else {
								let Data = {
									'action': 'add',
									'link': GetHash,
									'title': GetTitle,
									'poster': get_img_url.src,
									'save_to_db': true
								};
								TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
							}
						}
					} else {
						SwallAutoCloseMsg("Данная раздача не является фильмом или сериалом, поэтому не может быть добавлена в TorrServer!", "3");
					}
				});
			});
		});
	}
	if (/rutracker(.org|.net|.lib)\/forum\/tracker.php/.test(get_url)) {
		let el = document.querySelector(".seed-leech");
		el.dispatchEvent(new MouseEvent('mousedown'));
		el.dispatchEvent(new MouseEvent('mouseup'));
	}
	if (reg_rutracker.test(get_url)) {
		GM_addStyle(".checkboxToggle {padding: 0px;}.btn_tiny {vertical-align: unset;}.wbr {padding: 8px 0px 0px 0px;}");
		var RT_ADSY_TextValue = new RegExp(RuTrackerCFG.get('ADSY_TextValue'), 'g');
		var RT_ADSN_TextValue = new RegExp(RuTrackerCFG.get('ADSN_TextValue'), 'g');
		var RT_ShowPostImg = RuTrackerCFG.get('ShowPostImg');
		var RT_ShowPostImgWH = RuTrackerCFG.get('ShowPostImgWH');
		var RT_ShowConfirmDownload = RuTrackerCFG.get('ShowConfirmDownload');
		var RT_ShowInfoButton = RuTrackerCFG.get('ShowInfoButton');
		var RT_ShowTorrentButton = RuTrackerCFG.get('ShowTorrentButton');
		var RT_ShowMagnetButton = RuTrackerCFG.get('ShowMagnetButton');
		var RT_ShowYoutubeButton = RuTrackerCFG.get('ShowYoutubeButton');
		var RT_ShowCopyMagnetButton = RuTrackerCFG.get('ShowCopyMagnetButton');
		var RT_ShowCopyYoutubeButton = RuTrackerCFG.get('ShowCopyYoutubeButton');
		var RT_ShowTorrServerButton = RuTrackerCFG.get('ShowTorrServerButton');
		var RT_SwalDetailedInfoWidth = RuTrackerCFG.get('SwalDetailedInfoWidth');
		$('#top-login-box,#logged-in-username').parent().append('<button id="rutracker_settings" class="bold" style="margin-left: 10px;height: auto;border: 1px solid gray;border-radius: 4px;font-size: 12px;padding: 3px 8px;"><i class="fa fa-cogs"></i> Настройки</button>' + (RT_ShowTorrServerButton === true ? '<button id="torrserver_settings" class="bold" style="margin-left: 10px;height: auto;border: 1px solid gray;border-radius: 4px;font-size: 12px;padding: 3px 8px;"><i class="fa fa-cogs"></i> TorrServer</button>' : ''));
		$("#rutracker_settings").click(function() {
			GM_addStyle("*, *::before, *::after {box-sizing: unset;}.swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}");
			RuTrackerCFG.open();
		});
		$("#torrserver_settings").click(function() {
			GM_addStyle("*, *::before, *::after {box-sizing: unset;}.swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}");
			TorrServerCFG.open();
		});
		GM_addStyle("a.tt-text:hover, a.tt-text:active, a.tt-text:focus {color: #004276 !important;text-decoration: none !important;background: #e6e6e6 !important;border: 1px solid #404040 !important;}a.tt-text:hover .brackets-pair {color: #0067b9 !important;}");
		$('tr.hl-tr').each(function(i, el) {
			var url = $(el).find('.tt-text,.tLink').attr('href');
			var GetURLID = url.match(/[0-9]+/g)[0];
			if (RT_ShowPostImg) {
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID, {
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function(response) {
					if (!response.ok) {
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function(data) {
					var get_img_url = "",
						get_data = $(data);
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1) {
						if (GetURLID, get_data.find('.postImg,.postImg.postImgAligned.img-right')[0]) {
							get_img_url = get_data.find('.postImg,.postImg.postImgAligned.img-right')[0].title;
						}
						$(el).find('.topic_id, .vf-col-icon.vf-topic-icon-cell, .u-name').eq(0).html('<a href="' + url + '"><img style="width:' + RT_ShowPostImgWH[0] + ';height:' + RT_ShowPostImgWH[1] + '" src="' + get_img_url + '" alt="" /></a>');
					}
				});
			}
			if ($(el).find('td.vf-col-tor.tCenter.med.nowrap > div > div.small > a,td.row4.small.nowrap.tor-size > a').length == 1) {
				$(el).find('.tt-text,.tLink').prop('id', 'get_info_' + GetURLID).prop('href', 'javascript:void(0);').attr('style', 'font-family: \'Open Sans\';text-transform: uppercase;font-size: 16px;padding: 5px;font-weight: bold;text-decoration: none;background: #efefef;border: 1px solid #5e5e5e;border-radius: 6px;vertical-align: bottom;text-align: left;cursor: pointer;display: flow-root;');
				$(el).find('.tt,.t-title-col').prepend(`<div style="float:left;margin: 8px 9px 0px 0px">${(RT_ShowInfoButton ? '<button id="open_link_'+GetURLID+'" type="button" class="btn_tiny btn_corange MT2" style="padding: 0px 6px;font-size:18px;"><i class="fa fa-link"></i></button>':"")}${(RT_ShowTorrentButton ? '<button id="download_torrent_'+GetURLID+'" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 0px 6px;font-size:18px;"><i class="fa fa-download"></i></button>':"")}${(RT_ShowMagnetButton ? '<button id="download_magnet_'+GetURLID+'" type="button" class="btn_tiny btn_cblue MT2" style="padding: 0px 6px;font-size:18px;"><i class="fa fa-magnet"></i></button>':"")}${(RT_ShowCopyMagnetButton ? '<button id="copy_magnet_'+GetURLID+'" type="button" class="btn_tiny btn_cblue MT2" style="padding: 0px 6px;font-size:18px;"><i class="fa fa-copy"></i></button>':"")}${(RT_ShowTorrServerButton ? '<button id="add_torrserver_'+GetURLID+'" type="button" class="btn_tiny btn_cred MT2" style="padding: 0px 6px;font-size:18px;"><i class="fa fa-plus-square"></i></button>':"")}</div> `);
			}
			$("#open_link_" + GetURLID).click(function() {
				window.open(get_full_url + "/forum/viewtopic.php?t=" + GetURLID);
			});
			$("#get_info_" + GetURLID).click(function() {
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID, {
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function(response) {
					if (!response.ok) {
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function(data) {
					var get_info = "",
						get_data = $(data),
						check_movie = "",
						youtube_link = "",
						ads = "",
						ads_result = "",
						GetTitle = get_data.find('#soc-container').attr('data-share_title');
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1) {
						get_info = get_data.find('.post_body')[0].outerHTML.replace(/(<var)(.+)(title=")(.*?)">/g, '<img$2src="$4">').replace(/<\/var>/g, '');
						ads = get_data.find('.post_body')[0].textContent.trim().toLowerCase();
						if (ads.match(RT_ADSN_TextValue)) {
							ads_result = '<div class="fnm-ads-title fnm-no-ads">РАЗДАЧА БЕЗ РЕКЛАМЫ</div>';
						} else if (ads.match(RT_ADSY_TextValue)) {
							ads_result = '<div class="fnm-ads-title fnm-with-ads">ПРИСУТСТВУЕТ РЕКЛАМА</div>';
						}
						check_movie = get_data.find('.post_body')[0].textContent.trim().toLowerCase().match(/(арт-хаус|биография|боевик|вестерн|военный|детектив|детский|драма|исторический|комедия|короткометражка|криминал|мелодрама|мистика|мюзикл|нуар|пародия|приключения|романтика|семейный|сказка|советское|кино|спорт|триллер|ужасы|фантастика|фэнтези|эротика)/);
						youtube_link = (check_movie ? '<button type="button" class="btn_small btn_cred MT4" onclick="window.open(\'https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(GetTitle + ' русский трейлер') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
					}
					Swal.fire({
						width: RT_SwalDetailedInfoWidth,
						html: `<h2 class="swal2-title fnm-title">ИНФОРМАЦИЯ</h2>${ads_result}` + get_info,
						showConfirmButton: false,
						showCancelButton: false,
						footer: '<center>' + youtube_link + '<button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button></center>',
						didOpen: () => {
							Swal.getFooter().querySelector('button#cancel').focus();
							$('div.post_body, div.signature').each(function() {
								BB.initPost(this);
							});
							BB.initPost = function(e) {
								var t = $(e);
								BB.initSpoilers(t);
							};
							BB.initSpoilers = function(e) {
								if (e.hasClass('signature')) {
									return;
								}
								e.off('.spoiler');
								e.on('click.spoiler', 'div.sp-head', function(e) {
									var t = $(this);
									var n = t.next('div.sp-body');
									var i = t.parent('div.sp-wrap');
									if (!n.hasClass('inited')) {
										BB.initPostImages(n);
										var r = $('<div class="sp-fold clickable">[свернуть]</div>').on('click', function() {
											$.scrollTo(t, {
												duration: 200,
												axis: 'y',
												offset: -200
											});
											t.click().animate({
												opacity: .1
											}, 500).animate({
												opacity: 1
											}, 700);
										});
										n.append(r).addClass('clearfix inited');
										n.parent().addClass('clearfix');
									}
									if (e.shiftKey) {
										t.css('user-select', 'none');
										e.stopPropagation();
										e.shiftKey = false;
										var s = t.hasClass('unfolded');
										$('div.sp-head', $(n.parents('td')[0])).not('.sp-no-auto-open').filter(function() {
											return $(this).hasClass('unfolded') ? s : !s;
										}).click();
									} else {
										t.toggleClass('unfolded');
										i.toggleClass('sp-opened');
										n.slideToggle('fast');
									}
								});
							};
						}
					});
					$("#cancel").click(function() {
						Swal.close();
					});
				});
			});
			$("#download_torrent_" + GetURLID).click(function() {
				if (RT_ShowConfirmDownload) {
					Swal.fire({
						title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
						icon: 'question',
						showCancelButton: false,
						showDenyButton: true,
						confirmButtonColor: '#4fc823',
						cancelButtonColor: '#d33',
						denyButtonText: "НЕТ",
						confirmButtonText: "ДА",
					}).then(function(result) {
						if (result.isConfirmed) {
							window.location.href = get_full_url + "/download.php?id=" + GetID;
							SwallAutoCloseMsg("Скачивается торрент файл!", "2");
						}
					});
				} else {
					window.location.href = get_full_url + "/forum/dl.php?t=" + GetURLID;
					SwallAutoCloseMsg("Скачивается торрент файл!", "2");
				}
			});
			$("#download_magnet_" + GetURLID).click(function() {
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID, {
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function(response) {
					if (!response.ok) {
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function(data) {
					var GetHash = "",
						GetTitle = "",
						GetImageSrc = "",
						get_data = $(data);
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1) {
						if (get_data.find('.postImgAligned')[0]) {
							GetImageSrc = get_data.find('.postImgAligned')[0].title;
						}
						GetTitle = get_data.find('#soc-container')[0].attributes[2].value;
						GetHash = get_data.find('[data-topic_id="' + GetURLID + '"]')[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];
						if (RT_ShowConfirmDownload) {
							Swal.fire({
								html: `
<h2 class="swal2-title fnm-title">СКАЧАТЬ ЧЕРЕЗ MAGNET?</h2>
<table>
<tr>
<td style="vertical-align:top;padding: 0px 10px 0px 0px;font-size: 12px;">
<div>
<h2>${GetTitle}</h2>
<img src="${GetImageSrc}" style="display: block;margin-left: auto;margin-right: auto;width: 200px;" alt=""></center></td>
</tr>
</table>`,
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function(result) {
								if (result.isConfirmed) {
									window.location.href = GetHash;
									SwallAutoCloseMsg("Скачивается через Magnet!", "2");
								}
							});
						} else {
							window.location.href = GetHash;
							SwallAutoCloseMsg("Скачивается через Magnet!", "2");
						}
					}
				});
			});
			$("#copy_magnet_" + GetURLID).click(function() {
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID, {
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function(response) {
					if (!response.ok) {
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function(data) {
					var GetHash = "",
						GetTitle = "",
						get_data = $(data);
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1) {
						GetTitle = get_data.find('#soc-container')[0].attributes[2].value;
						GetHash = get_data.find('[data-topic_id="' + GetURLID + '"]')[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];
						copy(GetHash);
						SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
					}
				});
			});
			$("#add_torrserver_" + GetURLID).click(function() {
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID, {
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function(response) {
					if (!response.ok) {
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function(data) {
					var GetHash = "",
						GetTitle = "",
						GetImageSrc = "",
						get_data = $(data);
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1) {
						if (get_data.find('.postImgAligned')[0]) {
							GetImageSrc = get_data.find('.postImgAligned')[0].title;
						}
						GetTitle = get_data.find('#soc-container')[0].attributes[2].value;
						GetHash = get_data.find('[data-topic_id="' + GetURLID + '"]')[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];
						if (RT_ShowConfirmDownload) {
							Swal.fire({
								html: `
<h2 class="swal2-title fnm-title">ДОБАВИТЬ В TORRSERVER?</h2>
<table>
<tr>
<td style="vertical-align:top;padding: 0px 10px 0px 0px;font-size: 12px;">
<div>
<h2>${GetTitle}</h2>
<img src="${GetImageSrc}" style="display: block;margin-left: auto;margin-right: auto;width: 200px;" alt=""></center></td>
</tr>
</table>`,
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function(result) {
								if (result.isConfirmed) {
									if (TSVersion === "old") {
										let Data = {
											'Link': GetHash,
											'DontSave': !true,
											'Info': JSON.stringify({
												'poster_path': GetImageSrc
											})
										};
										TS_POST("torrent/add", JSON.stringify(Data), (response) => {
											if (/^[0-9a-f]{40}$/i.test(response)) {
												"Раздача добавлена в TorrServer!"
											} else {
												"TorrServer отклонил запрос"
											}
										});
									} else {
										let Data = {
											'action': 'add',
											'link': GetHash,
											'title': GetTitle,
											'poster': GetImageSrc,
											'save_to_db': true
										};
										TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
									}
								}
							});
						} else {
							if (TSVersion === "old") {
								let Data = {
									'Link': GetHash,
									'DontSave': !true,
									'Info': JSON.stringify({
										'poster_path': GetImageSrc
									})
								};
								TS_POST("torrent/add", JSON.stringify(Data), (response) => {
									if (/^[0-9a-f]{40}$/i.test(response)) {
										"Раздача добавлена в TorrServer!"
									} else {
										"TorrServer отклонил запрос"
									}
								});
							} else {
								let Data = {
									'action': 'add',
									'link': GetHash,
									'title': GetTitle,
									'poster': GetImageSrc,
									'save_to_db': true
								};
								TS_POST("torrents", JSON.stringify(Data), "Раздача добавлена в TorrServer!");
							}
						}
					}
				});
			});
		});
	}
})();