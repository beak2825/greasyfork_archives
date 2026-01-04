// ==UserScript==
// @name         Fight Mode
// @namespace    http://tampermonkey.net/
// @version      v0.1.1_BETA
// @description  Изменение Игровой под активный бой
// @author       You
// @copyright    2024, kindasignum (https://openuserjs.org/users/kindasignum)
// @match        https://catwar.su/cw3/*
// @match        https://catwar.su/settings
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.su
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487317/Fight%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/487317/Fight%20Mode.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var customStyles = document.createElement('style');
	const fightLogDiv = document.getElementById('fightLog');
	const currentUrl = GM_info.scriptHandler == "Tampermonkey" ? document.location.href : document.location.toString();
	const default_settings = {
		loc_borders: true, // показывать границы клеток +
		never_night: true, // всегда день +
		static_bg: false, // статичный фон
		static_img: 'https://catwar.su/cw3/spacoj/0.jpg', // картинка статичного фона
		center_field: false, // центрировать поле +
		show_crit: false, // показывать критические удары +
		show_outgoing: false, // показывать исходящие критические удары +
		outgoing_color: '08c3d4e8', // цвет исходящих критических ударов +
		incoming_color: 'ff1616d4', // цвет входящих критических ударов +
		change_block: false, // пользовательский размер значка блока +
		block_size: 16, // размер значка блока +
		change_text: false, // пользовательский размер текста в логе +
		text_size: 14, // размер текста в логе +
		high_dream: false, // выделять высокий сон
		low_health: false, // выделять низкое здоровье
		notif_health: false, // уведомлять о низком здоровье
		show_energy: false, // показывать энергию
		notif_energy: false, // уведомлять о низкой энергии
		hide_menu: true, // скрыть всплывающее окошко об игроках +
		only_body: false, // скрыть костюмы и болезни
		show_wounds: false, // исключить раны из скрытых болезней
		show_deads: false, // убрать прозрачность мертвых
		recolor_wounds: false, // перекрасить раны
		crit_wounds: false, // выделять тяжело раненых
		fm_active: false // активность боевого режима
	};
	function setDefaultValues() {
		for (var key in default_settings) {
			if (!localStorage.hasOwnProperty(key)) {
				localStorage.setItem(key, JSON.stringify(default_settings[key]));
			}
		}
	}
	setDefaultValues();

	const param = Object.fromEntries(
		Object.entries(default_settings).map(([key, defaultValue]) => [key, JSON.parse(localStorage.getItem(key)) ?? defaultValue])
	);

	if (currentUrl.startsWith('https://catwar.su/cw3/')) {
		if (param.fm_active == false) {
			var entry = document.createElement('input');
			entry.type = 'button';
			entry.value = 'Включить боевой режим';
			entry.addEventListener('click', fm_on);

			var table = document.querySelector('#tr_tos table');
			var tableRows = table.querySelectorAll('tr');
			tableRows.forEach(function(row) {
				var tos_td = document.createElement('td');
				tos_td.appendChild(entry);
				row.appendChild(tos_td);
			});
		} else if (param.fm_active == true) {
			var exit = document.createElement('input');
			exit.type = 'button';
			exit.value = 'Выйти из боевого режима';
			exit.classList.add('exit');
			exit.addEventListener('click', fm_off);
			var app = document.getElementById('app');
			app.appendChild(exit);

			// удаление лишних элементов
			var elementsToRemove = document.querySelectorAll('.other_cats_list, .small, #tr_chat, #tr_tos, #tr_mouth, #family, #history, br, #parameter h2, [data-id^="hunt"], #achievement');
			elementsToRemove.forEach(function (element) {
				element.remove();
			});
			var black_scores = document.querySelector('#black');
			var black_scoresText = black_scores.parentNode;
			if (black_scoresText) {
				black_scoresText.remove();
			}

			// границы поля
			var mainTable = document.getElementById('main_table');
			mainTable.style.borderSpacing = '0';

			// выделение крит ударов
			if (param.show_crit == true) {
				function setCritClass() {
					var spanElements = document.querySelectorAll('span.log_paws, span.log_claws, span.log_tooth');
					spanElements.forEach(function (element) {
						if (param.show_outgoing) {
							if ((element.textContent.includes('(шея)') && element.textContent.includes('Я => ')) || (element.textContent.includes('горло') && element.textContent.includes('Я => '))) {
								element.classList.add('my_crit');
							}
						}
						if ((element.textContent.includes('(шея)') && element.textContent.includes(' => я')) || (element.textContent.includes('горло') && element.textContent.includes(' => я'))) {
							element.classList.add('enemy_crit');
						}
					});
				}

				function checkAndSetCritClass() {
					var observer = new MutationObserver(function (mutationsList) {
						mutationsList.forEach(function (mutation) {
							if (mutation.target === fightLogDiv) {
								setCritClass();
							}
						});
					});
					var config = {
						childList: true,
						subtree: true
					};
					observer.observe(fightLogDiv, config);
				}

				checkAndSetCritClass();

				// стили выделения крит ударов
				customStyles.textContent += `
                    .my_crit {
                        background-color: #${param.outgoing_color};
                    }

                    .enemy_crit {
                        background-color: #${param.incoming_color};
                    }
                    `
			}

			// скрыть меню
			if (param.hide_menu) {
				customStyles.textContent += `
				    .cat_tooltip {
                        display: none !important;
                    }
				`
			}

			// изменить размер значка блока
			if (param.change_block) {
				customStyles.textContent += `
				    img[src="symbole/unlock.png"], img[src="symbole/lock.png"] {
                        width: ${param.block_size}px;
                        height: ${param.block_size}px;
                    }
				`
			}

			// изменить размер текста лога
			if (param.change_text) {
				customStyles.textContent += `
				span.log_paws, span.log_claws, span.log_tooth {
                    font-size: ${param.text_size}px;
                }
				`
			}

			// центрировать поле
			if (param.center_field) {
				var app = document.getElementById('app');
				app.style.display = 'flex';
				customStyles.textContent += `
                #app {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                }

				#main_table {
				    border-top: 2px solid black;
				}
				`
			}

			// визуальная настройка игровой
			customStyles.textContent += `
    #main_table /* границы поля */ {
        margin-top: 0;
        border-left: 2px solid black;
        border-right: 2px solid black;
        border-bottom: 2px solid black;
    }

    #sky /* скрыть небо */ {
        display: none;
    }

    #tr_actions /* скрыть действия */ {
        position: absolute;
        top: -1000%;
    }

    #hunger_table, #thirst_table, #need_table, #clean_table, #smell_table, #dig_table, #swim_table, #might_table, #tree_table, #observ_table, #parameters_block hr /* параметры и навыки */ {
        display: none;
    }

    #health_table, #dream_table /* сон и здоровье */ {
        position: fixed;
        right: 170px;
        top: 0;
    }

    #dream_table /* положение сна */ {
        margin-top: 14px;
    }

    #health_table /* положение здоровья */ {
        margin-top: 34px;
    }

    #fightPanel /* положение панели бр */ {
        margin-top: 50px;
    }

    a[data-id="27"], a[data-id="28"] {
        position: fixed;
        right: 40px;
        top: 5px;
    }

    img[src="actions/28.png"], img[src="actions/27.png"] {
        width: 60px;
        height: 60px;
    }

    #sek {
        position: fixed;
        top: 22px;
        right: 40px;
        font-size: 18px;
    }

    .exit {
        position: fixed;
		top: 0;
		left: 0;
        font-size: 18px;
    }
            `
		}

		// границы клеток
		if (param.loc_borders) {
			customStyles.textContent += `
				    .cage {
                        box-shadow: inset 0px 0.1px 0px 0.1px #ffffff;
                    }
				    `
		}

		// всегда день
		if (param.never_night) {
			customStyles.textContent += `
				    #cages_div {
                        opacity: 1 !important;
                    }
				`
		}

	} else if (currentUrl === 'https://catwar.su/settings') {
		// настройки мода

		var branch = document.querySelector('#branch');
		var fm_settings =
			`
			<div id='settingsForm'>
            <hr><h2>Настройки боевого режима</h2> <span style='color: darkred; font-weight: bold;'>Часами помечены функции, которые ещё не готовы</span>
            <h3 style='margin: 5px'>Оформление Игровой</h3>
            <label><input type='checkbox' id='loc_borders' ${param.loc_borders == true?"checked":""}> Показывать границы клеток</label>
            <br>
            <label><input type='checkbox' id='never_night' ${param.never_night == true?"checked":""}> Всегда день</label>
            <br>
            <label><input type='checkbox' id='static_bg' ${param.static_bg == true?"checked":""}> Использовать статичный фон 🕐</label>

            <div class='fm_config'>Задать статичный фон: <input type='text' id='static_img' placeholder='${param.static_img}' value='${param.static_img}'> <input type='button' value='OK' disabled> 🕐
            <br><small>Рекомендуемые параметры: размер 1000x1000, формат .jpg, вес < 500 КБ</small></div>

            <label><input type='checkbox' id='center_field' ${param.center_field == true?"checked":""}> Игровое поле в центре страницы</label>

            <h3 style='margin: 5px'>Панель боережима</h3>
            <label><input type='checkbox' id='show_crit' ${param.show_crit == true?"checked":""}> Выделять критические удары</label>
            <div class='fm_config'><label><input type='checkbox' id='show_outgoing' ${param.show_outgoing == true?"checked":""}>Выделять исходящие удары</label>
            <br>
            <table><tr><td>Цвет исходящих ударов:</td><td>#<input type='text' id='outgoing_color' placeholder='000000' maxlength="8" style="width: 7em" value='${param.outgoing_color}'></td></tr>
            <tr><td>Цвет входящих ударов:</td><td>#<input type='text' id='incoming_color' placeholder='FFFFFF' maxlength="8" style="width: 7em" value='${param.incoming_color}'></td></tr></table>

			<br>
			<div style='background-color: RGBA(204, 204, 204, 0.9); padding: 3px; width: 320px; border-radius: 10px;'>
			<img src="https://catwar.su/cw3/symbole/unlock.png" id="block">
			<input type="button" value="I" class="hotkey" disabled><input type="button" value="O" class="hotkey" disabled><input type="button" value="L" class="hotkey" disabled><input type="button" value="J" class="hotkey" disabled><input type="button" value="K" class="hotkey" disabled><input type="button" value="T+1" class="hotkey" disabled><input type="button" value="T+2" class="hotkey" disabled><input type="button" value="T+3" class="hotkey" disabled>
			<div style='margin-top: 4px; margin-left: 4px; height: 70px; overflow-y: scroll; margin-top: 4px; margin-left: 4px;'>
			<span id='outgoing_crit' style='background-color: #${param.outgoing_color}'>Я => Признание (горло)</span>
			<br>
			<span id='incoming_crit' style='background-color: #${param.incoming_color}'>Признание => я (шея)</span>
			<br>
			<span>Признание => я (хвост)</span>
			</div>
			</div>
			<br>
            <input type='button' value='Сохранить'></div>

            <label><input type='checkbox' id='change_block' ${param.change_block == true?"checked":""}> Изменить размер значка блокировки</label>
            <div class='fm_config'>Размер значка блокировки (px): <input type='number' id='block_size' placeholder='16' value=${param.block_size} max='30' min='0'}> <input type='button' value='OK'></div>

            <label><input type='checkbox' id='change_text' ${param.change_text == true?"checked":""}> Изменить размер текста в логе ударов</label>
            <div class='fm_config'>Размер текста в логе ударов (px): <input type='number' id='text_size' max='30' min='0' placeholder='14' value='${param.text_size}'> <input type='button' value='OK'></div>

            <h3 style='margin: 5px'>Параметры</h3>
            <label><input type='checkbox' id='high_dream' ${param.high_dream == true?"checked":""}> Выделить высокий сон 🕐</label>
            <br><small>Сон выше 3 минут будет считаться высоким (влияющим на бой)</small>
            <br>
            <label><input type='checkbox' id='low_health' ${param.low_health == true?"checked":""}> Выделить низкое здоровье 🕐</label>
            <br><small>Здоровье ниже 50% будет считаться низким</small>
            <div class='fm_config'><label><input type='checkbox' id='notif_health' ${param.notif_health == true?"checked":""}> Уведомлять о низком здоровье 🕐</label></div>

            <label><input type='checkbox' id='show_energy' ${param.show_energy == true?"checked":""}> Показывать свою энергию 🕐</label>
            <div class='fm_config'>
            Отслеживать ID: <input type='text' id='cat_check' style='width: 7em;' maxlength='7'> <input type='button' value='OK' disabled> 🕐
            <br>
            <label><input type='checkbox' id='notif_energy' ${param.notif_energy == true?"checked":""}> Уведомлять о низкой энергии 🕐</label></div>

            <h3 style='margin: 5px'>Игроки</h3>
            <label><input type='checkbox' id='hide_menu' ${param.hide_menu == true?"checked":""}> Скрыть всплывающее окно при наведении на игрока</label>
            <br>
            <label><input type='checkbox' id='only_body' ${param.only_body == true?"checked":""}> Отключить костюмы и болезни 🕐</label>
            <div class='fm_config'><label><input type='checkbox' id='show_wounds' ${param.show_wounds == true?"checked":""}> Не отключать раны 🕐</label></div>
            <label><input type='checkbox' id='show_deads' ${param.show_deads == true?"checked":""}> Отключить прозрачность мёртвых 🕐</label>
            <br>
            <label><input type='checkbox' id='recolor_wounds' ${param.recolor_wounds == true?"checked":""}> Перекрасить раны 🕐</label>
            <br>
            <label><input type='checkbox' id='crit_wounds' ${param.crit_wounds == true?"checked":""}> Выделить тяжело раненых 🕐</label>
            <br>
			<br>
			</div>
            `;
		branch.innerHTML += fm_settings;

		var reset_button = document.createElement('input');
		reset_button.type = 'button';
		reset_button.value = 'Сбросить настройки';
		reset_button.addEventListener("click", resetSettings);
		branch.appendChild(reset_button);

		customStyles.textContent += `
		.hotkey {
            background: white;
            width: 32px;
            padding: 1px;
            outline: none;

			margin: 0em;
			-webkit-rtl-ordering: logical;
			letter-spacing: normal;
            word-spacing: normal;
            line-height: normal;
            display: inline-block;
            text-rendering: auto;

            appearance: auto;
            user-select: none;
            align-items: flex-start;
            text-align: center;
            cursor: default;
            box-sizing: border-box;
            background-color: buttonface;
            color: buttontext;
            white-space: pre;
            padding-block: 1px;
            border-width: 2px;
            border-style: outset;
            border-color: buttonborder;

            font-family: Arial;
            font-size: 13.3333px;
            font-weight: 400;
        }

		.fm_config {
            margin: 5px 25px
        }
		`

		// сброс настроек
		function resetSettings() {
			if (confirm("Сбросить настройки боевого режима до установленных по умолчанию?")) {
				for (var key in default_settings) {
					localStorage.removeItem(key);
				}
				location.reload();
			}
		}

		// получение нажатия кнопки сохранения вводимых настроек
		var forms = document.querySelectorAll('.fm_config');
		forms.forEach(function(form) {
			form.addEventListener('click', function(event) {
				if (event.target.tagName === 'INPUT' && event.target.type === 'button') {
					handleClick(event);
				}
			});
		});

		// получение вводимых настроек
		function handleClick(event) {
			var form = event.target.closest('.fm_config');
			if (!form) return;

			var inputs = form.querySelectorAll('input[type="text"], input[type="number"]');
			inputs.forEach(function(input) {
				var parameter = input.id;
				var value = input.value;
				save(parameter, value);
			});
		}

		// сохранение вводимых настроек
		function save(parameter, value) {
			localStorage.setItem(parameter, '"' + String(value) + '"');
			alert('Настройки сохранены!');
		}

		// обновление настроек по чекбоксам
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener('change', function() {
				localStorage.setItem(this.id, this.checked);
				console.log('Установлено значение ' + this.id + ': ' + this.checked + '. Параметр теперь: ' + localStorage.getItem(this.id));
			});
		});

		// обновление предпросмотра выделения критических ударов
		const colors = document.querySelectorAll('input[id="outgoing_color"], input[id="incoming_color"]');
		const incoming_preview = document.querySelector('#incoming_crit');
		const outgoing_preview = document.querySelector('#outgoing_crit');

		colors.forEach(color => {
			color.addEventListener('change', function() {
				const incoming = '#' + document.querySelector('input[id="incoming_color"]').value;
				const outgoing = '#' + document.querySelector('input[id="outgoing_color"]').value;

				if (/^#[0-9A-F]{6,8}$/i.test(incoming)) {
					incoming_preview.style.backgroundColor = incoming;
				} else {
					incoming_preview.style.backgroundColor = '';
					console.error('Недопустимое значение цвета входящего потока: ' + incoming);
				}

				if (/^#[0-9A-F]{6,8}$/i.test(outgoing)) {
					outgoing_preview.style.backgroundColor = outgoing;
				} else {
					outgoing_preview.style.backgroundColor = '';
					console.error('Недопустимое значение цвета исходящего потока: ' + outgoing);
				}

				console.log('Изменено значение ' + this.id + ' на ' + this.value);
			});
		});
	}

	// включение боевого режиме
	function fm_on() {
		if (confirm("Страница будет перезагружена. Продолжить?")) {
			localStorage.setItem("fm_active", true);
			location.reload();
		}
	}

	// выключение боевого режима
	function fm_off() {
		if (confirm("Страница будет перезагружена. Продолжить?")) {
			localStorage.setItem("fm_active", false);
			location.reload();
		}
	}

	document.head.appendChild(customStyles);
})();