// ==UserScript==
// @name        The Tale Extended
// @description Расширение базового функционала в браузерной игре Сказка
// @author      standy <mostovoyav@gmail.com>
// @version     0.5.4
// @include     /^https?://the-tale.org/game/
// @run-at      document-end
// @license     MIT License
// @namespace   the-tale-extended
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4016/The%20Tale%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/4016/The%20Tale%20Extended.meta.js
// ==/UserScript==


var ext =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/EventEmitter.ts
///<reference path="../typings.d.ts"/>
function EventEmitter() {
    const callbacks = [];
    const emitter = (callback => {
        callbacks.push(callback);
    });
    emitter.emit = arg => {
        for (let i = 0; i < callbacks.length; i++) {
            const callback = callbacks[i];
            callback(arg);
        }
    };
    return emitter;
}
/* harmony default export */ var EventEmitter_defaultExport = (EventEmitter);

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tabs/tabs.ts

const tabs_$root = $('#pgf-diary-container').parent().parent();
const $navTabs = tabs_$root.children('.nav-tabs');
const $tabContent = tabs_$root.children('.tab-content');
const tabs_$tab = $(`<li><a href="#pgf-ext-container" class="pgf-ext-tab-button" data-toggle="tab">e</a></li>`).prependTo($navTabs);
const $container = $(`<div class="tab-pane log-block ext-container" id="pgf-ext-container">
		<div class="ext-tabs"></div>
	</div>`).appendTo($tabContent);
tabs_$tab.addClass('active').siblings().removeClass('active');
$container.addClass('active').siblings().removeClass('active');
const $extTabs = $container.find('.ext-tabs');
const tabs = [];
function createTab(title) {
    const $tab = $(`<span class="ext-tab">${title}</span>`).appendTo($extTabs);
    const $content = $(`<div class="ext-content"></div>`).appendTo($container);
    const tab = {
        $tab: $tab,
        $content: $content,
        onTabChange: EventEmitter_defaultExport(),
    };
    tabs.push(tab);
    $tab.on('click', () => {
        toggleTab(tab);
    });
    if (tabs.length === 1)
        toggleTab(tab);
    return tab;
}
function toggleTab(tab) {
    tabs.forEach(t => {
        const isActive = t === tab;
        t.onTabChange.emit(isActive);
        t.$content.toggleClass('active', isActive);
        t.$tab.toggleClass('active', isActive);
    });
}


// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/clientStorage.ts
///<reference path="../typings.d.ts"/>
function set(name, messages) {
    try {
        pgf.base.settings.set(name, JSON.stringify(messages));
    }
    catch (e) {
        console.warn('setLog', name, e);
    }
}
function get(name) {
    const g = pgf.base.settings.get(name);
    return g ? JSON.parse(g) : null;
}
function remove(name) {
    if (!window.localStorage)
        return;
    localStorage.removeItem(pgf.base.settings._prefix + '_' + name);
}
function size() {
    let t = 0;
    for (const x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
            t += localStorage[x].length * 2;
        }
    }
    return t;
}
/* harmony default export */ var clientStorage_defaultExport = ({
    remove,
    set,
    get,
    size,
});

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tabs/settings/sets-auto.ts
const setsAuto = [{
        title: 'Помощь герою (<span class="link-ajax" data-auto="rest">миролюбие</span>/<span class="link-ajax" data-auto="fight">агрессия</span>)',
        fields: [{
                label: 'Автоматическая помощь',
                note: 'Внимание! Настройки применяются в момент нажатия',
                name: 'autohelp',
                isToggle: true,
                value: false,
                subs: [{
                        label: 'Уведомлять о помощи',
                        name: 'autohelpNotify',
                        isToggle: true,
                        value: false,
                    }, {
                        label: 'Использовать бонусную энергию, оставить',
                        note: 'Указанный запас энергии тратиться не будет',
                        name: 'autohelpEnergyBonus',
                        isToggle: true,
                        value: false,
                        inputs: [{
                                name: 'autohelpEnergyBonusMax',
                                type: 'num',
                                value: 0,
                            }],
                    }, {
                        label: 'Герой бездействует',
                        name: 'autohelpIdle',
                        isToggle: true,
                        value: true,
                    }, {
                        label: 'Герой воскресает',
                        name: 'autohelpDead',
                        isToggle: true,
                        value: true,
                    }, {
                        label: 'Здоровье в бою ниже ',
                        name: 'autohelpHp',
                        isToggle: true,
                        value: true,
                        inputs: [{
                                type: 'num',
                                name: 'autohelpHpLowerValue',
                                value: 200,
                            }],
                        subs: [{
                                label: 'только против босса',
                                name: 'autohelpHpBoss',
                                isToggle: true,
                                isInline: true,
                                value: true,
                            }],
                    }, {
                        label: 'Лечение спутника, если его здоровье меньше',
                        name: 'autohelpCompanion',
                        isToggle: true,
                        isInline: true,
                        value: true,
                        inputs: [{
                                type: 'num',
                                name: 'autohelpCompanionHp',
                                isInline: true,
                                value: 20,
                            }],
                    }, {
                        label: 'Энергия выше ',
                        name: 'autohelpEnergy',
                        isToggle: true,
                        value: true,
                        inputs: [{
                                type: 'num',
                                name: 'autohelpEnergyGreaterValue',
                                value: 10,
                            }],
                        subs: [{
                                label: 'в бою',
                                name: 'autohelpEnergyFight',
                                isToggle: true,
                                isInline: true,
                                value: false,
                            }, {
                                label: 'вне боя',
                                name: 'autohelpEnergyRest',
                                isToggle: true,
                                isInline: true,
                                value: false,
                            }, {
                                label: 'в пути',
                                name: 'autohelpEnergyWalk',
                                isToggle: true,
                                isInline: true,
                                value: true,
                            }, {
                                label: 'торг/медитация',
                                name: 'autohelpEnergyTradeMed',
                                isToggle: true,
                                isInline: true,
                                value: true,
                            },
                        ],
                    }],
            }, {
                label: 'Автоматический выбор в задании',
                name: 'autoquest',
                isToggle: true,
                value: false,
                subs: [{
                        label: 'Уведомлять о выборе',
                        name: 'autoquestNotify',
                        isToggle: true,
                        value: false,
                    }, {
                        label: 'Задания, влияющие на честь',
                        // note: 'Доставка, сопроводить караван, пошпионить',
                        name: 'autoquestHonor',
                        isToggle: true,
                        value: true,
                        subs: [{
                                label: 'честно',
                                name: 'autoquestHonorPlus',
                                isToggle: true,
                                isInline: true,
                                value: true,
                            }, {
                                label: 'бесчестно',
                                name: 'autoquestHonorMinus',
                                isToggle: true,
                                isInline: true,
                                value: false,
                            }],
                    }, {
                        label: 'Задания, влияющие на миролюбие',
                        // note: 'Выбить долг',
                        name: 'autoquestPeace',
                        isToggle: true,
                        value: true,
                        subs: [{
                                label: 'миролюбиво',
                                name: 'autoquestPeacePlus',
                                isToggle: true,
                                isInline: true,
                                value: true,
                            }, {
                                label: 'воинственно',
                                name: 'autoquestPeaceMinus',
                                isToggle: true,
                                isInline: true,
                                value: false,
                            }],
                    }],
            }, {
                label: 'Брать карты',
                name: 'autocard',
                isToggle: true,
                value: false,
            }],
    }];

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tabs/settings/sets-game.ts
const MAX_LOG_LENGTH = 100000;
const setsGame = [
    {
        title: 'Уведомления',
        fields: [{
                label: 'Отправлять уведомления (<span class="link-ajax" id="test-notifications">тест</span>)',
                name: 'notify',
                isToggle: true,
                value: true,
                subs: [{
                        label: 'Выбор в задании',
                        name: 'notifyQuestChoose',
                        isToggle: true,
                        value: true,
                    }, {
                        label: 'Герой бездействует',
                        name: 'notifyHeroIdle',
                        isToggle: true,
                        value: true,
                    }, {
                        label: 'Здоровье ниже ',
                        name: 'notifyHeroHp',
                        isToggle: true,
                        value: true,
                        inputs: [{
                                type: 'num',
                                name: 'notifyHeroHpLowerValue',
                                value: 200,
                            }],
                    }, {
                        label: 'Энергия выше ',
                        name: 'notifyHeroEnergy',
                        isToggle: true,
                        value: true,
                        inputs: [{
                                type: 'num',
                                name: 'notifyHeroEnergyGreaterValue',
                                value: 9,
                            }],
                    }],
            }],
    },
    {
        title: 'Отображение',
        fields: [{
                label: 'Использовать глобальные стили расширения',
                name: 'extHtml',
                isToggle: true,
                value: true,
            }],
    },
    {
        title: 'Хранилище <span id="storage-size"></span>',
        fields: [{
                label: 'Сохранять последние сообщения:',
                name: '',
                inputs: [{
                        name: 'maxLogLength',
                        type: 'num',
                        value: MAX_LOG_LENGTH,
                    }],
            }, {
                name: '',
                label: '<span class="link-ajax" id="reset-stats">Очистить хранилище</span>',
            }],
    },
];

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/notifications/sendNotify.ts
$('body').one('click', request);
function request() {
    const Notify = Notification;
    if (Notify.permission.toLowerCase() !== 'granted') {
        Notify.requestPermission().then((permission) => {
            if (permission !== 'granted')
                return;
            Notify('Thanks for letting notify you');
        });
    }
}
function generateRandomString() {
    return Math.random().toString(36).slice(2);
}
let rndStr = generateRandomString();
function sendNotify(name, options) {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const time = `${h}:${m < 10 ? '0' + m : m}`;
    const nt = new Notification(name, {
        tag: options.tag + rndStr,
        body: options.body + (options.addTime ? '\n' + time : ''),
        icon: options.icon || (`${window.extPath}img/128.png`),
    });
    nt.onclick = nt.onclose = () => {
        rndStr = generateRandomString();
    };
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tabs/settings/Settings.ts






clientStorage_defaultExport.remove('settings');
class Settings_Settings {
    constructor() {
        this.tab = createTab(`настройки`);
        this.$root = this.tab.$content;
        this.settingsValues = clientStorage_defaultExport.get('ext_settings') || {};
        this.deps = {};
        this.onCleanup = EventEmitter_defaultExport();
        this._onNamedSettingChange = EventEmitter_defaultExport();
        this.onNamedSettingChange = (settingName, callback) => {
            this._onNamedSettingChange(({ name, value }) => {
                if (name === settingName) {
                    callback(value);
                }
            });
        };
        this.drawInput = (st) => {
            const settingsValues = this.settingsValues;
            let html = '';
            if (st.isToggle || st.type === 'checkbox') {
                html = `<input type="checkbox" data-name="${st.name}" ${settingsValues[st.name] ? 'checked' : ''}> `;
            }
            else if (st.type === 'text' || st.type === 'num') {
                html =
                    `<input type="text"
				   class="input-tiny input-tiny-${st.type}"
				   data-name="${st.name}"
				   data-type="${st.type}"
				   ${settingsValues[st.name]
                        ? ' value="' + settingsValues[st.name] + '"'
                        : ''}>`;
                if (st.addOn) {
                    html =
                        `<div class="input-wrap input-append">${html}<span class="add-on">${st.addOn}</span></div>`;
                }
                else {
                    html = `<div class="input-wrap input-wrap-inline">${html}</div>`;
                }
            }
            return html;
        };
        this.addSets(setsGame);
        this.addSets(setsAuto);
        console.log('settingsValues>', this.settingsValues);
        this.handlersGame();
        this.handlersAuto();
    }
    static getData($input) {
        const name = $input.data('name');
        const isDisabled = $input.closest('.input-wrap').hasClass('disabled');
        let value;
        if (isDisabled) {
            value = null;
        }
        if ($input.is('[type="checkbox"]')) {
            value = $input.prop('checked');
        }
        else if ($input.data('type') === 'num') {
            value = +$input.val();
        }
        else {
            value = $input.val();
        }
        return { name, value };
    }
    handlersGame() {
        $('#test-notifications').on('click', e => {
            e.preventDefault();
            sendNotify('Проверка уведомлений', {
                body: 'Проверка уведомлений',
                tag: 'test',
            });
        });
        $('#reset-stats').on('click', e => {
            if (!confirm('Очистить историю сообщений?')) {
                return;
            }
            this.onCleanup.emit(undefined);
        });
    }
    handlersAuto() {
        this.$root.find('[data-auto]')
            .on('click', function (e) {
            e.preventDefault();
            const type = $(this).data('auto');
            const types = {
                rest: {
                    autohelpIdle: 1,
                    autohelpDead: 1,
                    autohelpHp: 1,
                    autohelpHpBoss: 1,
                    autohelpEnergy: 1,
                    autohelpEnergyFight: 0,
                    autohelpEnergyRest: 0,
                    autohelpEnergyWalk: 1,
                    autohelpEnergyTradeMed: 1,
                },
                fight: {
                    autohelpIdle: 0,
                    autohelpDead: 0,
                    autohelpHp: 1,
                    autohelpHpBoss: 0,
                    autohelpEnergy: 1,
                    autohelpEnergyFight: 1,
                    autohelpEnergyRest: 0,
                    autohelpEnergyWalk: 0,
                    autohelpEnergyTradeMed: 0,
                },
            };
            const conf = types[type];
            for (const key in conf) {
                if (conf.hasOwnProperty(key)) {
                    const value = !!conf[key];
                    const $input = getSettingInput(key);
                    $input.prop('checked', value).trigger('change');
                }
            }
        });
    }
    addSets(sets) {
        let html = '';
        for (let i = 0; i < sets.length; i++) {
            const st = sets[i];
            this.settingsDefaults(st.fields);
            html +=
                `<div class="">
					<div class="sets-header">${st.title || ''}</div>
					${this.drawSetsGroup(st.fields)}
				</div>`;
        }
        const $sets = $(`<div class="settings-form form-horizontal">${html}</div>`).appendTo(this.$root);
        $sets.find('input')
            .each((i, input) => {
            const $input = $(input);
            const data = Settings_Settings.getData($input);
            this.checkDependencies(data);
        })
            .on('change', e => {
            const $input = $(e.target);
            const data = Settings_Settings.getData($input);
            this.checkDependencies(data);
            this.settingsValues[data.name] = data.value;
            this._onNamedSettingChange.emit(data);
            clientStorage_defaultExport.set('ext_settings', this.settingsValues);
            console.log('settings: ', this.settingsValues);
        });
    }
    drawSetsGroup(fields) {
        let html = '';
        for (let i = 0; i < fields.length; i++) {
            const st = fields[i];
            const label = `<div class="input-wrap ${st.isToggle ? 'checkbox' : ''}">
					<label>${this.drawInput(st)}${st.label}</label>
					${st.inputs
                ? st.inputs.map(this.drawInput).join('')
                : ''}
				</div>`;
            html +=
                `<div class="sets${st.isInline ? ' sets-inline' : ''}">
					<div class="sets-title">
						${label}
						${st.note
                    ? '<div class="note-block">' + st.note + '</div>'
                    : ''}
					</div>
					${st.subs ? this.drawSetsGroup(st.subs) : ''}
				</div>`;
        }
        clientStorage_defaultExport.set('ext_settings', this.settingsValues);
        return html;
    }
    checkDependencies(settingsData) {
        const key = settingsData.name;
        const value = settingsData.value;
        if (!this.deps[key])
            return;
        this.deps[key].forEach(keyName => {
            getSettingInput(keyName).closest('.input-wrap').toggleClass('disabled', !value); // .prop('disabled', !value);
        });
    }
    /**
     * Проставляет дефолтные значения и заполняет зависимости
     */
    settingsDefaults(fields) {
        if (!fields)
            return [];
        let childs = [];
        for (let i = 0; i < fields.length; i++) {
            const st = fields[i];
            const name = st.name;
            if (name) {
                childs.push(name);
                const storedValue = this.settingsValues[name];
                this.settingsValues[name] = typeof storedValue === 'undefined' ? st.value : storedValue;
            }
            const subsChilds = [
                ...this.settingsDefaults(st.inputs),
                ...this.settingsDefaults(st.subs),
            ];
            if (subsChilds.length && name) {
                this.deps[name] = subsChilds.filter(x => x);
                childs = subsChilds.concat(childs);
            }
        }
        return childs;
    }
}
function getSettingInput(key) {
    return $(`input[data-name="${key}"]`);
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tables.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);


//console.log('tables.js')
window.tables = ((_tables => {
	'use strict';

	function makeSortable($table) {
		const $head = $table.find('thead tr').first();
		const $rows = $table.find('tbody tr');

		$head.children('th')
			.wrapInner('<span class="sort" />')
			.each(function() {
				const $th = __WEBPACK_IMPORTED_MODULE_0_jquery___default.a(this);
				const thIndex = $th.index();

				$th.children('.sort').click(function() {
					$th.siblings('th').children('.sort').attr('class', 'sort');
					const inverse = __WEBPACK_IMPORTED_MODULE_0_jquery___default.a(this).hasClass('sort-up');
					__WEBPACK_IMPORTED_MODULE_0_jquery___default.a(this).attr('class', `sort sort-${inverse ? 'down' : 'up'}`);
					const arr = [];
					$rows.each(function() {
						const valueText = __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.trim(__WEBPACK_IMPORTED_MODULE_0_jquery___default.a(this).children('td').eq(thIndex).text());
						const value = (-valueText) || parseDate(valueText) || valueText;

						arr.push({
							$item: this,
							value,
						});
					});
					arr.sort((a, b) => {
						if (a.value === b.value) {
							return 0;
						}
						return a.value > b.value
							? inverse ? 1 : -1
							: inverse ? -1 : 1;
					});
					arr.forEach(item => {
						$table.append(item.$item);
					});
				});
			});
	}


	__WEBPACK_IMPORTED_MODULE_0_jquery___default.a('.table').each(function() {
		makeSortable(__WEBPACK_IMPORTED_MODULE_0_jquery___default.a(this));
	});

	__WEBPACK_IMPORTED_MODULE_0_jquery___default.a.extend(_tables, {
		makeSortable,
	});

	function parseDate(str) { //02.04.2014 10:50
		const p = /(\d{2})\.(\d{2})\.(\d{4})\s(\d{1,2}):(\d{2})/.exec(str);
		if (!p) {
			return 0;
		}
		return +new Date(p[3], p[2] - 1, p[1], p[4], p[5]);
	}

	return _tables;
}))({});

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/const/vars.ts
///<reference path="../../typings.d.ts"/>
///<reference path="../../typings.d.ts"/>
const PHRASE_NUMBER_KEYS = ['damage', 'health', 'coins', 'sell_price'];

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/storage/storage.ts
/* harmony default export */ var storage_defaultExport = ({
    heroName: '',
    companionName: '',
});

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tracking/Tracking.ts
///<reference path="../typings.d.ts"/>




const NEGATIVE_PHRASE_ID = [
    1,
    11,
    12,
    280001,
    280004,
    280010,
    280014,
    280016,
    280019,
];
const COMPANION_PHRASE_ID = [
    580003,
    580004,
];
clientStorage_defaultExport.remove('messagesLog');
/**
 * Позволяет подписаться на обновление данных
 */
class Tracking_Tracking {
    constructor() {
        this.messagesLog = clientStorage_defaultExport.get('ext_log') || [];
        this.onNewTurn = EventEmitter_defaultExport();
        this.onNewMessages = EventEmitter_defaultExport();
        this.onLoad = EventEmitter_defaultExport();
        this.onLoadDone = false;
        this.setMaxLogLength = (value) => {
            this.maxLogLength = value;
        };
        this.emitLoad();
    }
    static convertMessageFromRaw(messageRaw) {
        return [
            messageRaw[0 /* TimeStamp */],
            messageRaw[1 /* TimeSting */],
            messageRaw[2 /* PhraseSting */],
            messageRaw[3 /* PhraseId */],
            Tracking_Tracking.convertPhraseDataFromRaw(messageRaw[4 /* PhraseData */]),
            Tracking_Tracking.getMeta(messageRaw),
        ];
    }
    static convertPhraseDataFromRaw(phraseDataRaw) {
        const phraseData = Object.assign({}, phraseDataRaw);
        for (let i = 0; i < PHRASE_NUMBER_KEYS.length; i++) {
            const key = PHRASE_NUMBER_KEYS[i];
            const value = phraseDataRaw[key];
            if (typeof value === 'string')
                phraseData[key] = +value;
        }
        return phraseData;
    }
    static getMeta(message) {
        const phraseId = message[3 /* PhraseId */];
        const phraseDataRaw = message[4 /* PhraseData */];
        const actor = phraseDataRaw.attacker || phraseDataRaw.actor;
        const isMyName = actor === storage_defaultExport.heroName;
        const isMe = isMyName !== NEGATIVE_PHRASE_ID.includes(phraseId);
        const isCompanion = !isMyName && actor === storage_defaultExport.companionName || COMPANION_PHRASE_ID.includes(phraseId);
        const owner = isMe
            ? 0 /* me */
            : isCompanion
                ? 2 /* companion */
                : 1 /* mob */;
        return { owner: owner };
    }
    getMessagesLog() {
        return this.messagesLog.map(Tracking_Tracking.convertMessageFromRaw);
    }
    clear() {
        clientStorage_defaultExport.remove('ext_log');
        this.messagesLog = [];
    }
    track(game_data) {
        if (!this.onLoadDone)
            return;
        const hero = game_data.account.hero;
        if (!hero)
            return;
        const messagesLog = this.messagesLog;
        const lastLog = messagesLog[messagesLog.length - 1] || [];
        const lastTimestamp = lastLog[0 /* TimeStamp */];
        const messages = hero.messages;
        const messagesNew = [];
        for (let i = 0; i < messages.length; i++) {
            const messageRaw = messages[i];
            const message = Tracking_Tracking.convertMessageFromRaw(messageRaw);
            // console.log('time>', lastTimestamp, message[0], message[0] > lastTimestamp, lastLog[1], message[1]);
            if (!lastTimestamp || message[0 /* TimeStamp */] > lastTimestamp) {
                messagesLog.push(messageRaw);
                messagesNew.push(message);
            }
        }
        this.messagesLog = messagesLog.slice(this.maxLogLength ? messagesLog.length - this.maxLogLength : 0);
        clientStorage_defaultExport.set('ext_log', this.messagesLog);
        this.onNewTurn.emit(hero);
        if (messagesNew.length) {
            this.onNewMessages.emit(messagesNew);
        }
    }
    emitMessages() {
        $(document).on(`${pgf.game.events.DATA_REFRESHED}.ext-tracking`, (e, game_data) => {
            this.track(game_data);
        });
    }
    emitLoad() {
        this.onLoadDone = false;
        $(document).on('ajaxSuccess.ext', (event, XMLHttpRequest, setting, result) => {
            if (this.onLoadDone || setting.url.indexOf('/game/api/info') !== 0) {
                return;
            }
            const game_data = result.data;
            if (game_data.account.is_old) {
                return;
            }
            this.onLoadDone = true;
            const hero = game_data.account.hero;
            storage_defaultExport.heroName = hero.base.name;
            storage_defaultExport.companionName = hero.companion && hero.companion.name.toLowerCase();
            this.onLoad.emit(game_data);
            this.track(game_data);
            this.emitMessages();
            $(document).off('ajaxSuccess.ext');
        });
    }
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/const/icons.ts
/* harmony default export */ var icons_defaultExport = ({
    fight: __webpack_require__(2),
    peace: __webpack_require__(3),
    hit: __webpack_require__(4),
    might: __webpack_require__(5),
    fire: __webpack_require__(6),
    flame: __webpack_require__(7),
    poisoncloud: __webpack_require__(8),
    poison: __webpack_require__(9),
    vampire: __webpack_require__(10),
    reckless: __webpack_require__(11),
    disorientation: __webpack_require__(12),
    miss: __webpack_require__(13),
    slow: __webpack_require__(14),
    strength: __webpack_require__(15),
    speed: __webpack_require__(16),
    stunHit: __webpack_require__(17),
    stun: __webpack_require__(18),
    heal: __webpack_require__(19),
    companion: `<span class="companion">${__webpack_require__(20)}</span>`,
    god: `<span class="god-icon">${__webpack_require__(21)}</span>`,
    trade: __webpack_require__(22),
    rest: __webpack_require__(23),
    loot: __webpack_require__(24),
    death: __webpack_require__(25),
    travel: __webpack_require__(26),
    travelWagon: __webpack_require__(27),
});

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/act/act.ts


function act_act(modificator, shortMsg) {
    return `<span class="act ${modificator}">${shortMsg}</span>`;
}
function actPositive(actor, shortMsg) {
    const isCompanion = actor === storage_defaultExport.companionName;
    const isPositive = isCompanion || actor === storage_defaultExport.heroName;
    return `<span class="act ${isPositive ? 'positive' : 'negative'}">${isCompanion ? icons_defaultExport.companion : ''}${shortMsg}</span>`;
}
function actNegative(actor, shortMsg) {
    const isCompanion = actor === storage_defaultExport.companionName;
    const isPositive = !isCompanion && actor !== storage_defaultExport.heroName;
    return `<span class="act ${isPositive ? 'positive' : 'negative'}">${isCompanion ? icons_defaultExport.companion : ''}${shortMsg}</span>`;
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/act/act-fight.ts
///<reference path="../../typings.d.ts"/>


/* harmony default export */ var act_fight_defaultExport = ({
    1: { fn: debuff(icons_defaultExport.stun), type: 'inline' },
    11: { fn: dot(icons_defaultExport.flame), type: 'inline' },
    12: { fn: dot(icons_defaultExport.poisoncloud), type: 'inline' },
    280000: { fn: damage(icons_defaultExport.fire), type: 'inline' },
    280001: { fn: miss(icons_defaultExport.fire), type: 'inline' },
    280002: { fn: cast(icons_defaultExport.slow), type: 'inline' },
    280003: { fn: damage(''), type: 'inline' },
    280004: { fn: miss(icons_defaultExport.hit), type: 'inline' },
    280005: { fn: buff(icons_defaultExport.miss), type: 'inline' },
    280006: { fn: buff(icons_defaultExport.strength), type: 'inline' },
    280007: { fn: cast(icons_defaultExport.poison), type: 'inline' },
    280008: { fn: heal(icons_defaultExport.heal), type: 'inline' },
    280009: { fn: damage(icons_defaultExport.stunHit), type: 'inline' },
    280010: { fn: miss(icons_defaultExport.stunHit), type: 'inline' },
    280011: { fn: cast(icons_defaultExport.disorientation), type: 'inline' },
    280012: { fn: cast(icons_defaultExport.speed), type: 'inline' },
    280013: { fn: damage(icons_defaultExport.might), type: 'inline' },
    280014: { fn: miss(icons_defaultExport.might), type: 'inline' },
    280015: { fn: vampire(icons_defaultExport.vampire), type: 'inline' },
    280016: { fn: miss(icons_defaultExport.vampire), type: 'inline' },
    280017: { fn: companionHeal(icons_defaultExport.heal), type: 'inline' },
    280018: { fn: reckless(icons_defaultExport.reckless), type: 'inline' },
    280019: { fn: miss(icons_defaultExport.reckless), type: 'inline' },
    580003: { fn: companionDefended(icons_defaultExport.miss), type: 'inline' },
    580004: { fn: companionInjured(), type: 'inline' },
});
function damage(icon) {
    // attacker	атакующий
    // damage	количество урона
    // defender	защищающийся
    return (phraseData) => actPositive(phraseData.attacker, `<span class="damage">${phraseData.damage}</span>${icon}`);
}
function miss(icon) {
    // attacker	атакующий
    // defender	защищающийся
    return (phraseData) => actNegative(phraseData.attacker, `${icon}<span class="sub-icon">${icons_defaultExport.miss}</span>`);
}
function cast(icon) {
    // attacker	атакующий
    // defender	защищающийся
    return (phraseData) => actPositive(phraseData.attacker, `${icon}`);
}
function buff(icon) {
    // actor	герой или монстр
    return (phraseData) => actPositive(phraseData.actor, `${icon}`);
}
function debuff(icon) {
    // actor	герой или монстр
    return (phraseData) => actNegative(phraseData.actor, `${icon}`);
}
function reckless(icon) {
    // attacker	атакующий
    // defender	защищающийся
    // damage	количество урона
    // attacker_damage	количество урона по атакующему
    return (phraseData) => actPositive(phraseData.attacker, `<span class="damage">${phraseData.damage}</span>${icon}<span class="damage-reverse">${phraseData.attacker_damage}</span>`);
}
function vampire(icon) {
    // attacker	атакующий
    // health	количество вылеченного здоровья
    // damage	количество урона
    // defender	защищающийся
    return (phraseData) => actPositive(phraseData.attacker, `<span class="damage">${phraseData.damage}</span>${icon}<span class="vamp">${phraseData.health}</span>`);
}
function dot(icon) {
    // damage	количество урона
    // actor	герой или монстр
    return (phraseData) => actNegative(phraseData.actor, `<span class="damage">${phraseData.damage}</span>${icon}`);
}
function heal(icon) {
    // health	количество вылеченного здоровья
    // actor	герой или монстр
    return (phraseData) => actPositive(phraseData.actor, `<span class="heal">${phraseData.health}</span>${icon}`);
}
function companionHeal(icon) {
    // actor	герой или монстр
    // companion	спутник
    // health	количество вылеченного здоровья
    return (phraseData) => actPositive(phraseData.actor, `${icons_defaultExport.companion}<span class="heal">${phraseData.health}</span>${icon}`);
}
function companionDefended(icon) {
    // companion_owner	владелец спутника
    // companion	спутник
    // attacker	атакущий спутника
    return (phraseData) => actPositive(phraseData.companion_owner, `${icons_defaultExport.companion}${icon}`);
}
function companionInjured() {
    // companion_owner	владелец спутника
    // companion	спутник
    // attacker	атакущий спутника
    // damage	урон
    return (phraseData) => actPositive(phraseData.attacker, `${icons_defaultExport.companion}${phraseData.damage}`);
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/const/mobs.ts
/*
$('table tbody tr').map((i, tr) => ({
    name: $(tr).children().eq(1).text().trim(),
    id: +$(tr).children().eq(1).find('a').attr('href').replace('/guide/mobs/', ''),
    level: +$(tr).children().eq(0).text().trim(),
})).get()
    .sort((a, b) => a.id - b.id);
 */
/* harmony default export */ var mobs_defaultExport = ([
    { name: 'букавац', id: 1, level: 1 },
    { name: 'призрачная одежда', id: 2, level: 2 },
    { name: 'зазовка', id: 3, level: 4 },
    { name: 'хищный кустик', id: 4, level: 5 },
    { name: 'нук-секач', id: 5, level: 7 },
    { name: 'бродячий дуб', id: 6, level: 8 },
    { name: 'волк', id: 7, level: 10 },
    { name: 'дух леса', id: 8, level: 11 },
    { name: 'эльриада', id: 9, level: 13 },
    { name: 'блюститель природы', id: 10, level: 14 },
    { name: 'медведь', id: 11, level: 15 },
    { name: 'аристократ', id: 12, level: 17 },
    { name: 'единорог', id: 13, level: 18 },
    { name: 'призрачный волк', id: 14, level: 19 },
    { name: 'астральный охотник', id: 15, level: 21 },
    { name: 'головоног', id: 16, level: 1 },
    { name: 'домашний поползень', id: 17, level: 1 },
    { name: 'гнилушь', id: 18, level: 3 },
    { name: 'ползун', id: 19, level: 4 },
    { name: 'сушилец', id: 20, level: 6 },
    { name: 'гигантская росянка', id: 21, level: 7 },
    { name: 'сбежавший эксперимент', id: 22, level: 9 },
    { name: 'слизь', id: 23, level: 10 },
    { name: 'гидра', id: 24, level: 12 },
    { name: 'щупальце', id: 25, level: 13 },
    { name: 'химический мусорник', id: 26, level: 15 },
    { name: 'упырь', id: 27, level: 16 },
    { name: 'кикимора', id: 28, level: 17 },
    { name: 'бесхозный голем', id: 29, level: 19 },
    { name: 'охотник за реагентами', id: 30, level: 20 },
    { name: 'мутировавший гоблин', id: 31, level: 21 },
    { name: 'василиск', id: 32, level: 21 },
    { name: 'ожившее пугало', id: 33, level: 1 },
    { name: 'хищный хомяк', id: 34, level: 2 },
    { name: 'борец за справедливость', id: 35, level: 4 },
    { name: 'клешнец', id: 36, level: 5 },
    { name: 'маньяк', id: 37, level: 7 },
    { name: 'карточный шулер', id: 38, level: 8 },
    { name: 'богомол', id: 39, level: 10 },
    { name: 'благородный разбойник', id: 40, level: 11 },
    { name: 'одержимый колдун', id: 41, level: 13 },
    { name: 'механический дракончик', id: 42, level: 14 },
    { name: 'дварф-изгнанник', id: 43, level: 15 },
    { name: 'неистовый сектант', id: 44, level: 17 },
    { name: 'механический голем', id: 45, level: 18 },
    { name: 'убийца', id: 46, level: 19 },
    { name: 'полоумный маг', id: 47, level: 21 },
    { name: 'шакал', id: 48, level: 1 },
    { name: 'скорпион', id: 49, level: 1 },
    { name: 'налётчик', id: 50, level: 3 },
    { name: 'огненная лиса', id: 51, level: 4 },
    { name: 'орк-изгнанник', id: 52, level: 6 },
    { name: 'белый скарабей', id: 53, level: 7 },
    { name: 'гремучая змея', id: 54, level: 9 },
    { name: 'саламандра', id: 55, level: 10 },
    { name: 'пустынный дракончик', id: 56, level: 12 },
    { name: 'джинн', id: 57, level: 13 },
    { name: 'берсерк', id: 58, level: 15 },
    { name: 'смерч', id: 59, level: 16 },
    { name: 'заблудший шаман', id: 60, level: 17 },
    { name: 'шайтан', id: 61, level: 19 },
    { name: 'крыса', id: 62, level: 1 },
    { name: 'бандит', id: 63, level: 1 },
    { name: 'призрак', id: 64, level: 7 },
    { name: 'неупокоенный', id: 65, level: 15 },
    { name: 'гремлин', id: 66, level: 1 },
    { name: 'подыльник', id: 67, level: 3 },
    { name: 'странствующий рыцарь', id: 68, level: 24 },
    { name: 'нага', id: 69, level: 18 },
    { name: 'охотник за головами', id: 70, level: 24 },
    { name: 'суккуб', id: 71, level: 25 },
    { name: 'вирика', id: 72, level: 1 },
    { name: 'див', id: 73, level: 1 },
    { name: 'додо', id: 74, level: 1 },
    { name: 'ангиак', id: 75, level: 1 },
    { name: 'бхут', id: 76, level: 1 },
    { name: 'гвиллион', id: 77, level: 1 },
    { name: 'вилах', id: 78, level: 1 },
    { name: 'вендиго', id: 79, level: 1 },
    { name: 'галд', id: 80, level: 1 },
    { name: 'ачери', id: 81, level: 1 },
    { name: 'земляная даппи', id: 82, level: 3 },
    { name: 'огненная даппи', id: 83, level: 3 },
    { name: 'анчутка', id: 84, level: 1 },
    { name: 'жихарь', id: 85, level: 2 },
    { name: 'йиена', id: 86, level: 10 },
    { name: 'мара', id: 87, level: 19 },
    { name: 'боец Серого Ордена', id: 88, level: 43 },
    { name: 'спятивший лорд', id: 89, level: 21 },
    { name: 'волколак', id: 90, level: 24 },
    { name: 'медвелак', id: 91, level: 41 },
    { name: 'аколит огня', id: 92, level: 28 },
    { name: 'ламия', id: 93, level: 43 },
    { name: 'баргест', id: 94, level: 22 },
    { name: 'вий', id: 95, level: 42 },
    { name: 'гьюнальский паук', id: 96, level: 42 },
    { name: 'дэра', id: 97, level: 23 },
    { name: 'гриндель', id: 98, level: 22 },
    { name: 'грим', id: 99, level: 40 },
    { name: 'кагир', id: 100, level: 37 },
    { name: 'друджи', id: 101, level: 30 },
    { name: 'даса', id: 102, level: 36 },
    { name: 'ичетик', id: 103, level: 28 },
    { name: 'кера', id: 104, level: 24 },
    { name: 'куд', id: 105, level: 37 },
    { name: 'ларва', id: 106, level: 29 },
    { name: 'егви', id: 107, level: 27 },
    { name: 'каменный великан', id: 108, level: 38 },
    { name: 'каннибал', id: 109, level: 35 },
    { name: 'ламашту', id: 110, level: 40 },
    { name: 'лахама', id: 111, level: 26 },
    { name: 'наркоман', id: 112, level: 22 },
    { name: 'бывший палач', id: 113, level: 32 },
    { name: 'мародёр', id: 114, level: 26 },
    { name: 'страхолев', id: 115, level: 27 },
    { name: 'злоцвет', id: 116, level: 32 },
    { name: 'варвар', id: 117, level: 30 },
    { name: 'ночная хныка', id: 118, level: 31 },
    { name: 'омерзень', id: 119, level: 39 },
    { name: 'смрадень', id: 120, level: 36 },
    { name: 'глыдень', id: 121, level: 38 },
    { name: 'песчаный холерник', id: 122, level: 39 },
    { name: 'мать анаконд', id: 123, level: 31 },
    { name: 'белая гиена', id: 124, level: 44 },
    { name: 'мраморный бык', id: 125, level: 33 },
    { name: 'язвомор', id: 126, level: 41 },
    { name: 'лишайница', id: 127, level: 33 },
    { name: 'жирница', id: 128, level: 35 },
    { name: 'бульг', id: 129, level: 41 },
    { name: 'костогрыз', id: 130, level: 34 },
    { name: 'каменник', id: 131, level: 26 },
    { name: 'вирница', id: 132, level: 9 },
    { name: 'тигр', id: 133, level: 9 },
    { name: 'барбегаз', id: 134, level: 12 },
    { name: 'бродячий огонек', id: 135, level: 2 },
    { name: 'скальник', id: 136, level: 23 },
    { name: 'пупырник', id: 137, level: 24 },
    { name: 'стогница', id: 138, level: 9 },
    { name: 'гунила', id: 139, level: 18 },
    { name: 'пёстробородый', id: 140, level: 28 },
    { name: 'капитан Серых Плащей', id: 141, level: 45 },
    { name: 'аколит льда', id: 142, level: 41 },
    { name: 'семиглаз', id: 143, level: 12 },
    { name: 'гюрза', id: 144, level: 8 },
    { name: 'медвежук', id: 145, level: 15 },
    { name: 'снежная росомаха', id: 146, level: 30 },
    { name: 'койот', id: 147, level: 2 },
    { name: 'горный манул', id: 148, level: 13 },
    { name: 'мастер огня', id: 149, level: 33 },
    { name: 'мастер льда', id: 150, level: 43 },
    { name: 'кобольд', id: 151, level: 1 },
    { name: 'пожиратель плоти', id: 152, level: 44 },
    { name: 'главарь пёстробородых', id: 153, level: 38 },
    { name: 'ученик Силы', id: 154, level: 11 },
    { name: 'гомункул', id: 155, level: 10 },
    { name: 'некромант', id: 156, level: 46 },
    { name: 'тагар', id: 157, level: 52 },
    { name: 'стрига', id: 158, level: 50 },
    { name: 'приземник', id: 159, level: 48 },
    { name: 'лесной тролль', id: 160, level: 50 },
    { name: 'вурдалак', id: 161, level: 56 },
    { name: 'болотный тролль', id: 162, level: 55 },
    { name: 'бескуд', id: 163, level: 45 },
    { name: 'атач', id: 164, level: 51 },
    { name: 'камелопард', id: 165, level: 50 },
    { name: 'невиданная тварь', id: 166, level: 1 },
    { name: 'ырка', id: 167, level: 61 },
    { name: 'шоток', id: 168, level: 58 },
    { name: 'хрустальный барс', id: 169, level: 56 },
    { name: 'галлу', id: 170, level: 48 },
    { name: 'джудцгу', id: 171, level: 65 },
    { name: 'изг', id: 172, level: 61 },
    { name: 'ведомый', id: 182, level: 40 },
    { name: 'комол', id: 189, level: 47 },
    { name: 'ледяной тур', id: 190, level: 53 },
    { name: 'нахцерер', id: 191, level: 54 },
    { name: 'склеповник', id: 192, level: 60 },
    { name: 'хала', id: 193, level: 45 },
    { name: 'кумо', id: 194, level: 35 },
    { name: 'мботата', id: 195, level: 33 },
    { name: 'ракопаук', id: 196, level: 25 },
    { name: 'иеля', id: 197, level: 20 }
]);

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/const/artifacts.ts
/*
 NOTE со страницы: http://the-tale.org/guide/artifacts/
$('table').eq(1)
    .find('tbody tr')
    .filter((i, tr) => $(tr).children().eq(3).text().trim() !== 'хлам')
    .map((i, tr) => ({
        name: $(tr).children().eq(1).text().trim(),
        id: +$(tr).children().eq(1).find('a').attr('href').replace('/guide/artifacts/', ''),
        level: +$(tr).children().eq(0).text().trim(),
    }))
    .get()
    .sort((a, b) => a.id - b.id);
 */
/* harmony default export */ var artifacts_defaultExport = ([
    { name: 'портки', id: 1, level: 1 },
    { name: 'лапти', id: 2, level: 1 },
    { name: 'роба', id: 3, level: 1 },
    { name: 'рукавицы', id: 4, level: 1 },
    { name: 'дубинка', id: 5, level: 1 },
    { name: 'оленьи рога', id: 6, level: 1 },
    { name: 'волшебные штаны', id: 7, level: 2 },
    { name: 'осиное жало', id: 8, level: 4 },
    { name: 'живой корень', id: 9, level: 5 },
    { name: 'пятачок', id: 10, level: 7 },
    { name: 'дубина', id: 11, level: 8 },
    { name: 'волчьи клыки', id: 12, level: 10 },
    { name: 'сердце леса', id: 13, level: 11 },
    { name: 'боевая помада', id: 14, level: 13 },
    { name: 'короткое копьё', id: 15, level: 14 },
    { name: 'медвежья лапа', id: 16, level: 15 },
    { name: 'тонкие перчатки', id: 17, level: 17 },
    { name: 'налобный рог', id: 18, level: 18 },
    { name: 'призрачные наплечники', id: 19, level: 19 },
    { name: 'магическая броня', id: 20, level: 21 },
    { name: 'мёртвый головастик', id: 21, level: 1 },
    { name: 'тулуп поползня', id: 22, level: 1 },
    { name: 'звёздный венок', id: 23, level: 3 },
    { name: 'склизкие сапоги', id: 24, level: 4 },
    { name: 'болотные сапоги', id: 25, level: 6 },
    { name: 'пасть росянки', id: 26, level: 7 },
    { name: 'химический доспех', id: 27, level: 9 },
    { name: 'мозговой слизень', id: 28, level: 10 },
    { name: 'кожаные штаны', id: 29, level: 12 },
    { name: 'галстук из щупальца', id: 30, level: 13 },
    { name: 'пропитанный химией плащ', id: 31, level: 15 },
    { name: 'рваные перчатки', id: 32, level: 16 },
    { name: 'рваньё', id: 33, level: 17 },
    { name: 'глиняные штаны', id: 34, level: 19 },
    { name: 'белый халат', id: 35, level: 20 },
    { name: 'узкие штаны', id: 36, level: 21 },
    { name: 'сверкающий плащ', id: 37, level: 21 },
    { name: 'метла', id: 38, level: 1 },
    { name: 'волшебное зёрнышко', id: 39, level: 2 },
    { name: 'меч справедливости', id: 40, level: 4 },
    { name: 'выеденный плащ', id: 41, level: 5 },
    { name: 'резиновые перчатки', id: 42, level: 7 },
    { name: 'джокер', id: 43, level: 8 },
    { name: 'лапа богомола', id: 44, level: 10 },
    { name: 'отравленный кинжал', id: 45, level: 11 },
    { name: 'одержалка', id: 46, level: 13 },
    { name: 'шипованный хвост', id: 47, level: 14 },
    { name: 'рунный топор', id: 48, level: 15 },
    { name: 'молот атеистов', id: 49, level: 17 },
    { name: 'стальные трусы', id: 50, level: 18 },
    { name: 'убивалка', id: 51, level: 19 },
    { name: 'разумный обруч', id: 52, level: 21 },
    { name: 'шкура шакала', id: 53, level: 1 },
    { name: 'жало скорпиона', id: 54, level: 1 },
    { name: 'добротные штаны', id: 55, level: 3 },
    { name: 'пламенный воротник', id: 56, level: 4 },
    { name: 'большой-большой меч', id: 57, level: 6 },
    { name: 'высушенный скарабей', id: 58, level: 7 },
    { name: 'погремушка', id: 59, level: 9 },
    { name: 'огненный плащ', id: 60, level: 10 },
    { name: 'доспех из чешуек дракона', id: 61, level: 12 },
    { name: 'волшебная лампа', id: 62, level: 13 },
    { name: 'концентрированная ярость', id: 63, level: 15 },
    { name: 'ветреные сапоги', id: 64, level: 16 },
    { name: 'волшебный посох', id: 65, level: 17 },
    { name: 'пергамент', id: 66, level: 19 },
    { name: 'корона', id: 67, level: 1 },
    { name: 'дряхлый доспех', id: 68, level: 1 },
    { name: 'цепи', id: 69, level: 7 },
    { name: 'каска', id: 70, level: 15 },
    { name: 'разбитый щит', id: 138, level: 1 },
    { name: 'старое кольцо', id: 139, level: 1 },
    { name: 'мех подыльника', id: 140, level: 3 },
    { name: 'гербовый щит', id: 142, level: 24 },
    { name: 'перчатки из кожи наги', id: 144, level: 18 },
    { name: 'боевая плеть', id: 146, level: 24 },
    { name: 'катар', id: 149, level: 25 },
    { name: 'каменный нож', id: 150, level: 1 },
    { name: 'кусочек янтаря', id: 152, level: 1 },
    { name: 'лопатки додо', id: 155, level: 1 },
    { name: 'перепончатые крылья', id: 157, level: 1 },
    { name: 'бхулава', id: 158, level: 1 },
    { name: 'маска гвиллиона', id: 161, level: 1 },
    { name: 'ухо вилаха', id: 162, level: 1 },
    { name: 'туманные наплечники', id: 164, level: 1 },
    { name: 'боевой цеп', id: 167, level: 1 },
    { name: 'колечко с камушком', id: 168, level: 1 },
    { name: 'песчаное кольцо', id: 170, level: 3 },
    { name: 'угольное кольцо', id: 172, level: 3 },
    { name: 'медное кольцо', id: 174, level: 1 },
    { name: 'печатка жихаря', id: 176, level: 2 },
    { name: 'могильный перстень', id: 178, level: 10 },
    { name: 'солидное кольцо', id: 180, level: 19 },
    { name: 'чистый щит', id: 182, level: 43 },
    { name: 'фамильный перстень', id: 184, level: 21 },
    { name: 'кольцо зверя', id: 186, level: 24 },
    { name: 'плащ зверя', id: 188, level: 41 },
    { name: 'горячее кольцо', id: 190, level: 28 },
    { name: 'хрустальный коготь', id: 192, level: 43 },
    { name: 'чёрный волос', id: 194, level: 22 },
    { name: 'кольцо первородного', id: 196, level: 42 },
    { name: 'паучий щит', id: 199, level: 42 },
    { name: 'доспех из дэры', id: 201, level: 23 },
    { name: 'гринделевые ботинки', id: 203, level: 22 },
    { name: 'гримовый хопеш', id: 204, level: 40 },
    { name: 'кагирские перчатки', id: 206, level: 37 },
    { name: 'друджийская сабля', id: 208, level: 30 },
    { name: 'дасийские наплечники', id: 210, level: 36 },
    { name: 'слёзы ичетики', id: 212, level: 28 },
    { name: 'теневой плащ', id: 215, level: 24 },
    { name: 'кудово кольцо', id: 217, level: 37 },
    { name: 'топор ларвы', id: 218, level: 29 },
    { name: 'белая туника', id: 220, level: 27 },
    { name: 'скалистая накидка', id: 222, level: 38 },
    { name: 'мясорез', id: 224, level: 35 },
    { name: 'голова ламашту', id: 226, level: 40 },
    { name: 'лахамовый плащ', id: 228, level: 26 },
    { name: 'лезвие', id: 231, level: 22 },
    { name: 'поцелуй смерти', id: 232, level: 32 },
    { name: 'обувь мертвеца', id: 234, level: 26 },
    { name: 'седые чикчиры', id: 236, level: 27 },
    { name: 'плетёнки', id: 239, level: 32 },
    { name: 'зубастая кожа', id: 240, level: 30 },
    { name: 'холодные наручи', id: 242, level: 31 },
    { name: 'червивы', id: 244, level: 39 },
    { name: 'тёплые сандалии', id: 247, level: 36 },
    { name: 'шнурок-лекарь', id: 249, level: 38 },
    { name: 'холерные наплечники', id: 250, level: 39 },
    { name: 'буро-зелёные штаны', id: 252, level: 31 },
    { name: 'крылья гиены', id: 254, level: 44 },
    { name: 'мраморный мантлет', id: 256, level: 33 },
    { name: 'язвенный гиматий', id: 258, level: 41 },
    { name: 'цветик', id: 260, level: 33 },
    { name: 'жирник', id: 263, level: 35 },
    { name: 'бульгово зеркало', id: 265, level: 41 },
    { name: 'белокостник', id: 267, level: 34 },
    { name: 'базальтовый шар', id: 268, level: 26 },
    { name: 'виринки', id: 271, level: 9 },
    { name: 'тигриная шкура', id: 272, level: 9 },
    { name: 'пятки барбегаза', id: 275, level: 12 },
    { name: 'болотная искра', id: 277, level: 2 },
    { name: 'диадема зрячего', id: 278, level: 23 },
    { name: 'лягушачья кожа', id: 281, level: 24 },
    { name: 'луговые наплечники', id: 282, level: 9 },
    { name: 'роуч', id: 284, level: 18 },
    { name: 'братец-топор', id: 287, level: 28 },
    { name: 'золочёная шпага', id: 288, level: 45 },
    { name: 'морозная пика', id: 290, level: 41 },
    { name: 'тараканий щит', id: 292, level: 12 },
    { name: 'гюрзовые ботинки', id: 294, level: 8 },
    { name: 'костяной щит', id: 296, level: 15 },
    { name: 'снежные наплечники', id: 299, level: 30 },
    { name: 'лёгкий коготь', id: 300, level: 2 },
    { name: 'горная мантия', id: 303, level: 13 },
    { name: 'красный капюшон', id: 304, level: 33 },
    { name: 'белая кираса', id: 306, level: 43 },
    { name: 'костяной нож', id: 308, level: 1 },
    { name: 'мясник', id: 310, level: 44 },
    { name: 'ониксовый марион', id: 313, level: 38 },
    { name: 'радужная кольчуга', id: 314, level: 38 },
    { name: 'крылатое манто', id: 315, level: 11 },
    { name: 'гомункуловые перчатки', id: 317, level: 10 },
    { name: 'печатка праха', id: 319, level: 46 },
    { name: 'амулет смерти', id: 320, level: 46 },
    { name: 'тагарин', id: 322, level: 52 },
    { name: 'кольцо очарования', id: 324, level: 50 },
    { name: 'пушистая шкура', id: 327, level: 48 },
    { name: 'лесной оберег', id: 328, level: 50 },
    { name: 'глаза мёртвого', id: 330, level: 56 },
    { name: 'болотный оберег', id: 333, level: 55 },
    { name: 'чёрный плащ', id: 335, level: 45 },
    { name: 'шрам атача', id: 336, level: 51 },
    { name: 'кисы', id: 338, level: 50 },
    { name: 'светящийся глаз', id: 345, level: 61 },
    { name: 'шотоковая капелина', id: 347, level: 58 },
    { name: 'хрустальная шкура', id: 349, level: 56 },
    { name: 'шипованная плеть', id: 351, level: 48 },
    { name: 'сапоги мертвеца', id: 354, level: 65 },
    { name: 'изгилии', id: 356, level: 61 },
    { name: 'кеньги', id: 357, level: 47 },
    { name: 'железные копыта', id: 359, level: 53 },
    { name: 'каменные чётки', id: 361, level: 54 },
    { name: 'костяной цеп', id: 363, level: 60 },
    { name: 'чешуйчатые руки', id: 366, level: 45 },
    { name: 'сверкающий хлыст', id: 367, level: 40 },
    { name: 'заговорённый балахон', id: 370, level: 35 },
    { name: 'зоркий камень', id: 372, level: 33 },
    { name: 'баклеранер', id: 373, level: 25 }
]);

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/act/group-fight.ts
///<reference path="../../typings.d.ts"/>




/* harmony default export */ var group_fight_defaultExport = ({
    // 3: {fn: fn, type: 'block'}, // Дневник: Герой убит'
    // 4: {fn: fn, type: 'block'}, // Дневник: Получить опыт за убийство монстра'
    // 5: {fn: fn, type: 'block'}, // Журнал: Герой убит'
    6: { fn: flightStart(icons_defaultExport.fight, icons_defaultExport.death), type: 'block' },
    7: { fn: flightStart(icons_defaultExport.fight, icons_defaultExport.travel), type: 'block' },
    8: { fn: mobAct(icons_defaultExport.death), type: 'inline' },
    9: { fn: lootEmpty, type: 'block' },
    10: { fn: flightStart(icons_defaultExport.peace), type: 'block' },
    13: { fn: loot(''), type: 'block' },
    14: { fn: loot('drop', ' (нет места)'), type: 'block' },
    15: { fn: flightStart(icons_defaultExport.fight), type: 'block' },
    16: { fn: flightStart(icons_defaultExport.fight, icons_defaultExport.companion), type: 'block' },
});
function flightStart(icon, icon2 = '') {
    // mob	монстр
    // hero	герой
    // companion?	спутник
    return (phraseData) => {
        const mob = mobs_defaultExport.filter(m => m.name === phraseData.mob)[0] ||
            ({ level: 'неизвестен', id: 'неизвестен' });
        return act_act('', `${icon} ${icon2} ${phraseData.mob} (уровень ${mob.level}) <a href="/guide/mobs/${mob.id}">#</a>`);
    };
}
function mobAct(icon) {
    // mob	монстр
    // hero	герой
    return (phraseData) => {
        return act_act('', `${icon} ${phraseData.mob}`);
    };
}
function lootEmpty(phraseData) {
    // mob	монстр
    // hero	герой
    return act_act('loot empty', `нет добычи`);
}
function loot(modificator, msg = '') {
    // mob	монстр
    // hero	герой
    // artifact	предмет
    return (phraseData) => {
        const artifact = artifacts_defaultExport.filter(m => m.name === phraseData.artifact)[0];
        const artifactHtml = artifact
            ? `<a href="/guide/artifacts/${artifact.id}">${phraseData.artifact}</a>`
            : phraseData.artifact;
        return act_act(`loot ${modificator}`, `${icons_defaultExport.loot} <span class="artifact">${artifactHtml}</span>${msg}`);
    };
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/act/act-travel.ts
///<reference path="../../typings.d.ts"/>


/* harmony default export */ var act_travel_defaultExport = ({
    120001: { fn: travel(icons_defaultExport.travel), type: 'block' },
    120002: { fn: travel(icons_defaultExport.travel), type: 'block' },
    120003: { fn: travel(icons_defaultExport.travelWagon), type: 'block' },
    180001: { fn: rest(icons_defaultExport.rest), type: 'inline' },
    220001: { fn: tradeSell, type: 'inline' },
    80001: { fn: tradeBuy, type: 'inline' },
    80002: { fn: tradeChange, type: 'inline' },
    80003: { fn: tradeChange, type: 'inline' },
});
function tradeSell(phraseData) {
    // coins	количество монет
    // hero	герой
    // artifact	предмет
    return act_act('trade', `<span class="artifact">${phraseData.artifact}</span>→<span class="coins">${phraseData.coins}${icons_defaultExport.trade}</span>`);
}
function tradeBuy(phraseData) {
    // coins	количество монет
    // hero	герой
    // artifact	предмет
    return act_act('trade', `<span class="coins">${phraseData.coins}${icons_defaultExport.trade}→<span class="artifact">${phraseData.artifact}</span></span>`);
}
function tradeChange(phraseData) {
    // sell_price	цена продажи
    // hero	герой
    // old_artifact?	старый артефакт
    // coins	количество монет
    // artifact	предмет
    return (tradeSell({
        artifact: phraseData.old_artifact || phraseData.artifact,
        hero: phraseData.hero,
        coins: phraseData.sell_price,
    }) +
        '|' +
        tradeBuy({
            artifact: phraseData.artifact,
            hero: phraseData.hero,
            coins: phraseData.coins,
        }));
}
function rest(icon) {
    // hero	герой
    // health	количество здоровья
    return (phraseData) => act_act('positive', `${icon}<span class="heal">${phraseData.health}</span>`);
}
function travel(icon) {
    // destination	конечное место назначения
    // hero	герой
    // current_destination	текущее место назначения
    return (phraseData) => act_act('', `${icon} ${phraseData.destination}`);
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/act/act-god-abilities.ts
///<reference path="../../typings.d.ts"/>


const CRIT = '!';
/* harmony default export */ var act_god_abilities_defaultExport = ({
    // 240002: {fn: test, type: 'block'}, // Журнал: Вызов ремонтника
    // 240003: {fn: test, type: 'block'}, // Журнал: Вызов ремонтника (критический эффект)
    // 240004: {fn: test, type: 'block'}, // Журнал: Выкинуть самый дешёвый предмет из рюкзака
    // 240005: {fn: test, type: 'block'}, // Журнал: Выкинуть самый дешёвый предмет из рюкзака (критическое срабатывание)
    240006: { fn: abilityExp(), type: 'block' },
    240008: { fn: abilityHeal(''), type: 'inline' },
    240009: { fn: abilityHeal('', CRIT), type: 'inline' },
    240010: { fn: abilityDamage(), type: 'inline' },
    240011: { fn: abilityDamage(CRIT), type: 'inline' },
    240012: { fn: abilityCoins(), type: 'inline' },
    240013: { fn: abilityCoins(CRIT), type: 'inline' },
    240014: { fn: abilityText('воскрешение'), type: 'block' },
    240015: { fn: abilityMove('телепорт'), type: 'block' },
    240016: { fn: abilityMove('телепорт', CRIT), type: 'block' },
    240017: { fn: abilityMove('начало задания'), type: 'block' },
    240018: { fn: abilityText('запасение энергии'), type: 'block' },
    240019: { fn: abilityText('запасение энергии', CRIT), type: 'block' },
    240020: { fn: abilityHeal(icons_defaultExport.companion), type: 'inline' },
    240021: { fn: abilityHeal(icons_defaultExport.companion, CRIT), type: 'inline' },
    300006: { fn: abilityGiftReturn(), type: 'block' },
});
function abilityText(text, crit = '') {
    return (phraseData) => act_act('god', `${icons_defaultExport.god}${text}${crit}`);
}
function abilityGiftReturn() {
    // hero	герой
    // artifact	артефакт
    return (phraseData) => act_act('god', `${icons_defaultExport.god}${phraseData.artifact}→вернулся ребёнку`);
}
function abilityMove(text, crit = '') {
    // hero	герой
    return (phraseData) => act_act('god', `${icons_defaultExport.god}${icons_defaultExport.travel}${text}${crit}`);
}
function abilityExp(crit = '') {
    // hero	герой
    // experience	количество опыта
    return (phraseData) => act_act('god', `${icons_defaultExport.god}+${phraseData.experience}${crit} опыта`);
}
function abilityCoins(crit = '') {
    // coins	количество монет
    // hero	герой
    return (phraseData) => act_act('god', `${icons_defaultExport.god}${phraseData.coins}${crit}${icons_defaultExport.trade}`);
}
function abilityHeal(icon, crit = '') {
    // hero	герой
    // health	количество здоровья
    // companion?	спутник
    return (phraseData) => act_act('god', `${icons_defaultExport.god}${phraseData.health}${crit}${icons_defaultExport.heal}${icon}`);
}
function abilityDamage(crit = '') {
    // attacker	атакующий
    // damage	количество урона
    // defender	защищающийся
    return (phraseData) => act_act('god', `${icons_defaultExport.god}<span class="damage">${phraseData.damage}${crit}</span>${icons_defaultExport.hit}`);
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/phraseToHtml.ts
///<reference path="../typings.d.ts"/>




const actsByIds = Object.assign({}, group_fight_defaultExport, act_fight_defaultExport, act_travel_defaultExport, act_god_abilities_defaultExport);
function actToHtmlShort(act, message) {
    return `<span title="${details(message)}">${act.fn(message[4 /* PhraseData */])}</span>`;
}
function actToHtmlDefault(message) {
    return `<span title="${details(message)}">${message[2 /* PhraseSting */]}</span>`;
}
function details(message) {
    const timeSting = message[1 /* TimeSting */];
    const phraseSting = message[2 /* PhraseSting */];
    const phraseId = message[3 /* PhraseId */];
    const phraseData = message[4 /* PhraseData */];
    return `[${timeSting}] ${phraseSting}\n${phraseId}: ${JSON.stringify(phraseData).replace(/"/g, '&quot;')}`;
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tabs/short/ShortMessages.ts


/**
 * @typedef {[number, string, string, number, object]} Message - сообщения журнала из API
 */
class ShortMessages_ShortMessages {
    constructor() {
        this.tab = createTab('кратко');
        this.$root = this.tab.$content;
        this.$list = $(`<ul class="unstyled pgf-log-list"></ul>`).appendTo(this.$root);
        this.$prevGroup = null;
    }
    addMessages(messages) {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            this.addMessage(message);
        }
    }
    addMessage(message) {
        const act = actsByIds[message[3 /* PhraseId */]];
        const html = act
            ? actToHtmlShort(act, message)
            : actToHtmlDefault(message);
        const type = act && act.type || 'block';
        if (type === 'inline') {
            if (!this.$prevGroup) {
                this.$prevGroup = this.createRecord(html, true);
            }
            else {
                this.addToRecord(html, this.$prevGroup);
            }
        }
        else {
            this.createRecord(html, false);
            this.$prevGroup = null;
        }
    }
    clear() {
        this.$list.html('');
    }
    createRecord(html, isShort) {
        return $(`<li class="log-record ${isShort ? 'ext' : ''}">` +
            `<div class="time">↓</div>` +
            `<div class="pgf-message message">` +
            `<span class="submessage">` +
            `${html}` +
            `</span>` +
            `</div>` +
            `</li>`).prependTo(this.$list);
    }
    addToRecord(html, $record) {
        $record.find('.submessage').prepend(html);
    }
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/const/texts.ts
///<reference path="../../typings.d.ts"/>
///<reference path="../../typings.d.ts"/>
const PHRASE_ID_TO_TEXT = {
    1: 'Стан',
    11: 'Горение',
    12: 'Яд',
    280000: 'Пиромания',
    280001: 'Пиромания',
    280002: 'Контроль',
    280003: 'Удар',
    280004: 'Удар',
    280005: 'Последний шанс',
    280006: 'Ярость',
    280007: 'Ядовитость',
    280008: 'Регенерация',
    280009: 'Ошеломление',
    280010: 'Ошеломление',
    280011: 'Дезориентация',
    280012: 'Ускорение',
    280013: 'Сильный удар',
    280014: 'Сильный удар',
    280015: 'Вампиризм',
    280016: 'Вампиризм',
    280017: 'Лечение',
    280018: 'Безрассудная атака',
    280019: 'Безрассудная атака',
    580003: 'Спутник увернулся',
    580004: 'Спутник ранен',
};
const ACTION_TYPE_TEXTS = {
    [0 /* idle */]: 'безделие',
    [1 /* quest */]: 'задание',
    [2 /* walk */]: 'путешествие между городами',
    [3 /* fight */]: 'сражение 1x1 с монстром',
    [4 /* dead */]: 'воскрешение',
    [5 /* city */]: 'действия в городе',
    [6 /* rest */]: 'отдых',
    [7 /* equip */]: 'экипировка',
    [8 /* trade */]: 'торговля',
    [9 /* nearcity */]: 'путешествие около города',
    [10 /* energy */]: 'восстановление энергии',
    [11 /* noeffect */]: 'действие без эффекта на игру',
    [12 /* proxy */]: 'прокси-действия для взаимодействия героев',
    [13 /* pvp */]: 'PvP 1x1',
    [15 /* companionHeal */]: 'уход за спутником',
};

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/tabs/stats/Stats.ts
///<reference path="../../typings.d.ts"/>





const statsList = [
    1,
    11,
    12,
    280000,
    280001,
    280002,
    280003,
    280004,
    280005,
    280006,
    280007,
    280008,
    280009,
    280010,
    280011,
    280012,
    280013,
    280014,
    280015,
    280016,
    280017,
    280018,
    280019,
    580003,
    580004,
];
class Stats_Stats {
    constructor() {
        this.tab = createTab('статистика');
        this.statistics = [];
    }
    static drawCellByStat(stat) {
        if (!stat)
            return '';
        const phraseId = stat.phraseId;
        const averagePhraseData = {};
        Object.keys(stat.phraseData).forEach((key) => {
            const value = stat.phraseData[key];
            if (PHRASE_NUMBER_KEYS.includes(key)) {
                if (value) {
                    averagePhraseData[key] = Math.round(value / stat.count);
                }
            }
            else {
                averagePhraseData[key] = value;
            }
        });
        const cell = `<span title="${stat.example}\n${JSON.stringify(averagePhraseData).replace(/"/g, '&quot;')}">` +
            `${act_fight_defaultExport[phraseId].fn(averagePhraseData)}x${stat.count}` +
            `</span>`;
        return cell;
    }
    static drawTotalCount(count, icon = '') {
        return `<span class="act">${icon}x${count}</span>`;
    }
    addToStats(messages) {
        this.addPhrases(messages);
        this.drawStats();
    }
    clear() {
        this.statistics = [];
        this.tab.$content.html('');
    }
    addPhrases(messages) {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const phraseId = message[3 /* PhraseId */];
            if (statsList.includes(phraseId)) {
                this.addPhrase(message);
            }
        }
    }
    addPhrase(message) {
        const phraseSting = message[2 /* PhraseSting */];
        const phraseId = message[3 /* PhraseId */];
        const phraseData = message[4 /* PhraseData */];
        const phraseMeta = message[5 /* PhraseMeta */];
        const owner = phraseMeta.owner;
        const statInList = this.statistics.find(s => s.owner === owner && s.phraseId === phraseId);
        if (!statInList) {
            this.statistics.push({
                owner: owner,
                phraseId: phraseId,
                count: 1,
                example: phraseSting,
                phraseData: phraseData,
            });
        }
        else {
            statInList.count++;
            for (let i = 0; i < PHRASE_NUMBER_KEYS.length; i++) {
                const numberKey = PHRASE_NUMBER_KEYS[i];
                const value = phraseData[numberKey];
                if (value) {
                    statInList.phraseData[numberKey] = (statInList.phraseData[numberKey] || 0) + value;
                }
            }
        }
    }
    drawStats() {
        const phraseIds = [];
        for (let i = 0; i < this.statistics.length; i++) {
            const stat = this.statistics[i];
            if (!phraseIds.includes(stat.phraseId))
                phraseIds.push(stat.phraseId);
        }
        phraseIds.sort((a, b) => a - b);
        let html = ``;
        let countMe = 0;
        let countCompanion = 0;
        let countMob = 0;
        for (let i = 0; i < phraseIds.length; i++) {
            const phraseId = phraseIds[i];
            const text = PHRASE_ID_TO_TEXT[phraseId];
            const statsMe = this.statistics.find(s => s.owner === 0 /* me */ && s.phraseId === phraseId);
            const statsCompanion = this.statistics.find(s => s.owner === 2 /* companion */ && s.phraseId === phraseId);
            const statsMob = this.statistics.find(s => s.owner === 1 /* mob */ && s.phraseId === phraseId);
            if (statsMe)
                countMe += statsMe.count;
            if (statsCompanion)
                countCompanion += statsCompanion.count;
            if (statsMob)
                countMob += statsMob.count;
            html +=
                `<tr>` +
                    `<th>${text}</th>` +
                    `<td>${Stats_Stats.drawCellByStat(statsMe) +
                        (statsMe && statsCompanion ? `<br>` : '') +
                        Stats_Stats.drawCellByStat(statsCompanion)}</td>` +
                    `<td>${Stats_Stats.drawCellByStat(statsMob)}</td>` +
                    `</tr>`;
        }
        html +=
            `<tr>` +
                `<th>Всего кол-во</th>` +
                `<td>${Stats_Stats.drawTotalCount(countMe) +
                    (countCompanion
                        ? `<br>${Stats_Stats.drawTotalCount(countCompanion, icons_defaultExport.companion)}`
                        : '')}</td>` +
                `<td>${Stats_Stats.drawTotalCount(countMob)}</td>` +
                `</tr>`;
        const $root = this.tab.$content;
        $root.html(`<table class="table-stats">` +
            `<thead>` +
            `<tr>` +
            `<td></td>` +
            `<td>Герой</td>` +
            `<td>Моб</td>` +
            `</tr>` +
            `</thead>` +
            `<tbody>` +
            html +
            `</tbody>` +
            `</table>`
        // `<pre>${JSON.stringify(this.statistics, null, 2)}</pre>`
        );
    }
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/notifications/Notifications.ts
///<reference path="../typings.d.ts"/>


class Notifications_Notifications {
    constructor() {
        this.lastNotifyMessagesText = '';
    }
    static isSameQuest(q1, q2) {
        return Notifications_Notifications.questTests.every(key => q1[key] === q2[key]);
    }
    check(hero, settingsValues) {
        if (!settingsValues.notify)
            return;
        this.checkHero(hero, settingsValues);
        this.checkQuests(hero.quests.quests, settingsValues);
    }
    checkHero(hero, settingsValues) {
        if (!settingsValues.notify)
            return;
        const notifyMessages = [];
        const minHp = settingsValues.notifyHeroHpLowerValue;
        if (settingsValues.notifyHeroHp && minHp) {
            const health = hero.base.health;
            if (health < minHp) {
                notifyMessages.push(`Низкое здоровье: ${health} HP`);
            }
        }
        const maxEnergy = settingsValues.notifyHeroEnergyGreaterValue;
        if (settingsValues.notifyHeroEnergy && maxEnergy) {
            const energy = hero.energy.value;
            if (energy > maxEnergy) {
                notifyMessages.push(`Энергия накопилась: ${energy}`);
            }
        }
        if (settingsValues.notifyHeroIdle) {
            const actionType = hero.action.type;
            if (actionType === 0) {
                notifyMessages.push('Герой бездействует');
            }
        }
        if (notifyMessages.length) {
            const notifyMessagesText = notifyMessages.join('\n');
            if (notifyMessagesText !== this.lastNotifyMessagesText) {
                sendNotify(`The Tale Extended - ${storage_defaultExport.heroName}`, {
                    tag: 'send',
                    body: notifyMessagesText,
                });
            }
            this.lastNotifyMessagesText = notifyMessagesText;
        }
    }
    checkQuests(quests, settingsValues) {
        const line = quests[1].line;
        const lineOld = this.lastQuests && this.lastQuests[1] && this.lastQuests[1].line || [];
        const newLines = [];
        for (let i = 0; i < line.length; i++) {
            const q = line[i];
            const qOld = lineOld[i];
            if (!qOld || !Notifications_Notifications.isSameQuest(q, qOld)) {
                if (settingsValues.notify &&
                    settingsValues.notifyQuestChoose &&
                    q.choice_alternatives &&
                    q.choice_alternatives.length) {
                    sendNotify(q.name, {
                        tag: 'quest',
                        body: `${storage_defaultExport.heroName} ${q.action}!`,
                        icon: `${window.extPath}img/quest/caravan.png`,
                        addTime: true,
                    });
                }
                newLines.push(q);
            }
        }
        this.lastQuests = quests;
    }
}
Notifications_Notifications.questTests = ['action', 'choice', 'name', 'type', 'uid'];

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/auto/Auto.ts
///<reference path="../typings.d.ts"/>



class Auto_Auto {
    constructor() {
        this.lastquest = '';
    }
    check(hero, settingsValues) {
        setTimeout(() => {
            this.checkHero(hero, settingsValues);
            this.checkQuest(hero, settingsValues);
        }, 1000);
    }
    checkHero(hero, settingsValues) {
        const actionType = hero.action.type;
        const actionPercent = hero.action.percents;
        const energy = hero.energy.value;
        let energyBonus = settingsValues.autohelpEnergyBonus ? hero.energy.bonus - settingsValues.autohelpEnergyBonusMax : 0;
        if (energyBonus < 0)
            energyBonus = 0;
        if (energy + energyBonus < 4)
            return;
        const isFight = actionType === 3 /* fight */;
        const isRest = actionType < 10 && actionType !== 3 /* fight */;
        const isBoss = !!hero.action.is_boss;
        if (settingsValues.autohelpHp &&
            hero.base.health < settingsValues.autohelpHpLowerValue &&
            isFight &&
            (!settingsValues.autohelpHpBoss || isBoss)) {
            godHelp(`Низкое здоровье: ${hero.base.health}`);
            return;
        }
        const isHeplingCompanion = actionType === 15 /* companionHeal */;
        if (settingsValues.autohelpCompanion && isHeplingCompanion && hero.companion.health < settingsValues.autohelpCompanionHp) {
            godHelp(`Низкое здоровье спутника: ${hero.companion.health}`);
            return;
        }
        if (settingsValues.autohelpEnergy && energy > settingsValues.autohelpEnergyGreaterValue && ((settingsValues.autohelpEnergyFight && isFight) ||
            (settingsValues.autohelpEnergyRest && isRest) ||
            (settingsValues.autohelpEnergyWalk && actionType === 2 /* walk */) ||
            (settingsValues.autohelpEnergyTradeMed && (actionType === 8 /* trade */ || actionType === 10 /* energy */)))) {
            godHelp(`Накопилась энергия: ${energy}`);
            return;
        }
        if (settingsValues.autohelpIdle && actionType === 0 && !isFight && actionPercent > 0 && actionPercent < 0.8) {
            godHelp('Герой бездействует');
            return;
        }
        if (settingsValues.autohelpDead && actionType === 4 && !isFight && actionPercent > 0 && actionPercent < 0.8) {
            godHelp('Герой умер');
            return;
        }
        const hasCard = !$('.pgf-get-card-button').hasClass('pgf-hidden');
        if (settingsValues.autocard && hasCard) {
            $('.pgf-get-card-button a').trigger('click');
            return;
        }
        const hasModal = $('.modal-header') && ($('.pgf-dialog-title').text() === 'Вы получаете новую карту!');
        if (hasModal) {
            $('.pgf-dialog-button-0').trigger('click');
            return;
        }
        return;
        function godHelp(msg) {
            const ability = 'help';
            console.log(`god ${ability}!`, actionType, msg, Object.assign({}, hero));
            if (settingsValues.autohelpNotify) {
                sendNotify(`The Tale Extended - ${storage_defaultExport.heroName}`, {
                    tag: 'autohelp',
                    body: `Сработала автоматическая помощь
						${msg}
						Текущее действие: ${ACTION_TYPE_TEXTS[actionType]}`,
                    addTime: true,
                });
            }
            if (!settingsValues.autohelp) {
                return;
            }
            // return;
            const url = `/game/abilities/${ability}/api/use?api_version=1.0&api_client=${window.API_CLIENT}`;
            hero.energy.value -= 4;
            // const csrf = document.head.innerHTML.match(/"X-CSRFToken"[^"]*(".*")/)[1].replace(/"/g, '');
            $.ajax({
                url,
                dataType: 'json',
                type: 'post',
                // beforeSend: function(xhr) {
                // 	xhr.setRequestHeader('X-CSRFToken', csrf);
                // },
                data: {},
            });
        }
    }
    checkQuest(hero, settingsValues) {
        const selectChoices = {
            peacePlus: settingsValues.autoquestPeacePlus,
            peaceMinus: settingsValues.autoquestPeaceMinus,
            honorPlus: settingsValues.autoquestHonorPlus,
            honorMinus: settingsValues.autoquestHonorMinus,
        };
        const quests = hero.quests.quests;
        const line = quests[1].line;
        for (let i = 0; i < line.length; i++) {
            const q = line[i];
            for (let choiceIndex = 0; choiceIndex < q.choice_alternatives.length; choiceIndex++) {
                const choiceName = q.choice_alternatives[choiceIndex][1];
                const option_uid = q.choice_alternatives[choiceIndex][0];
                for (const reward in Auto_Auto.CHOICES) {
                    if (selectChoices[reward] &&
                        Auto_Auto.CHOICES.hasOwnProperty(reward) &&
                        Auto_Auto.CHOICES[reward].includes(choiceName)) {
                        this.chooseQuest(option_uid, choiceName, settingsValues);
                    }
                }
            }
        }
    }
    chooseQuest(uid, name, settingsValues) {
        if (settingsValues.autoquestNotify && this.lastquest !== name) {
            this.lastquest = name;
            sendNotify(`The Tale Extended - ${storage_defaultExport.heroName}`, {
                tag: 'autoquest',
                body: `Сделан выбор! \n— ${name}`,
                addTime: true,
                icon: `${window.extPath}img/quest/caravan.png`,
            });
        }
        if (!settingsValues.autoquest) {
            return;
        }
        // const csrf = document.head.innerHTML.match(/("X-CSRFToken")(.*)(".*")/, 'g')[3].replace(/"/g, '');
        $.ajax({
            url: `/game/quests/api/choose?api_version=1.0&api_client=${window.API_CLIENT}&option_uid=${encodeURIComponent(uid)}`,
            dataType: 'json',
            type: 'post',
            // beforeSend: function(xhr) {
            // 	xhr.setRequestHeader('X-CSRFToken', csrf);
            // },
            data: {},
        });
    }
}
Auto_Auto.CHOICES = {
    /* peacefullnes */
    peacePlus: [
        'прибегнуть к дипломатии',
    ],
    peaceMinus: [
        'задействовать грубую силу',
    ],
    honorPlus: [
        'довести дело до конца',
        'защищать торговца',
        'честно выполнить свои обязательства',
    ],
    honorMinus: [
        'поддаться укорам совести и раскрыться',
        'шантажировать самостоятельно',
        'присвоить письмо и продать',
        'украсть-украсть-украсть',
        'подделать письмо',
    ],
};

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/js/utils/fixHtml.ts
function fixHtml(isFix) {
    $('html').toggleClass('ext-html', isFix);
}

// CONCATENATED MODULE: D:/dev/github/the-tale-ext/source/ext.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ext_css__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ext_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__ext_css__);










const tracking = new Tracking_Tracking();
const shortMessages = new ShortMessages_ShortMessages();
const stats = new Stats_Stats();
const settings = new Settings_Settings();
const notifications = new Notifications_Notifications();
const auto = new Auto_Auto();
tracking.onLoad(() => {
    const pastMessages = tracking.getMessagesLog();
    shortMessages.addMessages(pastMessages.slice(pastMessages.length - 1000));
    stats.addToStats(pastMessages);
});
tracking.onNewMessages(messages => {
    shortMessages.addMessages(messages);
    stats.addToStats(messages);
});
tracking.onNewTurn(hero => {
    notifications.check(hero, settings.settingsValues);
    auto.check(hero, settings.settingsValues);
});
settings.onCleanup(() => {
    tracking.clear();
    stats.clear();
    shortMessages.clear();
});
fixHtml(settings.settingsValues.extHtml);
settings.onNamedSettingChange('extHtml', fixHtml);
tracking.setMaxLogLength(settings.settingsValues.maxLogLength);
settings.onNamedSettingChange('maxLogLength', tracking.setMaxLogLength);
window.ext = {
    tracking,
    shortMessages,
    stats,
    settings,
    notifications,
};

// CONCATENATED MODULE: ./the-tale-extension.user.js



/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 486.991 486.991\">\r\n  <path d=\"M415.143 58.34c3.685-3.79 9.73-3.863 13.516-.178 3.778 3.666 3.86 9.72.177 13.507-.048.046-.13.13-.188.176L303.493 193.588l24.31 26.475L452.25 105.82c12.09-11.092 20.316-25.765 23.478-41.866l11.148-56.81c.382-1.958-.233-3.973-1.643-5.39C483.817.344 481.8-.27 479.843.112L423.035 11.26c-16.1 3.16-30.775 11.39-41.865 23.478L269.426 156.47l24.414 26.596L415.143 58.34zM161.5 274.043l-51.735 56.37c-17.35-12.004-37.024-20.932-58.507-25.38-10.344-2.166-20.437 4.486-22.573 14.83-2.146 10.327 4.495 20.44 14.83 22.574 15.803 3.275 30.29 9.787 43.172 18.45l-71.397 55.42C6.335 423.258.803 433.718.084 445.03c-.71 11.305 3.48 22.377 11.493 30.392 7.424 7.433 17.48 11.566 27.92 11.566.82 0 1.64-.018 2.472-.074 11.313-.71 21.77-6.24 28.72-15.196l54.177-69.793c6.12 10.83 10.746 22.622 13.36 35.223 1.864 9.03 9.81 15.233 18.682 15.233 1.287 0 2.582-.13 3.89-.4 10.335-2.136 16.977-12.248 14.832-22.574-3.805-18.405-11.037-35.4-20.476-50.857l60.092-55.168-53.75-49.34z\"/>\r\n  <path d=\"M471.7 416.308l-54.935-42.64-16.464-12.78c12.147-8.17 32.236-15.34 43.174-18.45 10.944-3.114 16.977-12.248 14.832-22.574-2.146-10.345-12.324-17.014-22.575-14.832-8.135 1.688-16.007 4.03-23.618 6.876-12.51 4.672-24.103 11.043-34.888 18.506L105.82 34.738c-11.092-12.09-25.766-20.316-41.864-23.48L7.146.113C6.763.038 6.38 0 5.998 0 4.422 0 2.89.625 1.753 1.754.346 3.17-.27 5.187.114 7.146L11.26 63.954c3.162 16.1 11.39 30.774 23.48 41.865l297.09 272.728c-6.956 11.39-12.47 23.684-16.453 36.753-1.418 4.665-3.022 9.265-4.02 14.106-2.145 10.326 4.496 20.438 14.83 22.574 1.308.27 2.605.4 3.89.4 6.57 0 12.595-3.422 16.056-8.852 1.213-1.902 2.145-4.028 2.63-6.38 2.612-12.6 7.24-24.392 13.358-35.223l11.53 14.85 42.648 54.943c6.95 8.957 17.408 14.487 28.722 15.196 11.305.708 22.38-3.47 30.393-11.492 8.013-8.015 12.2-19.087 11.49-30.393-.717-11.314-6.247-21.772-15.204-28.722zM266.664 266.562c-2.18 2.24-5.772 2.297-8.02.113L58.338 71.845c-.057-.046-.14-.13-.188-.176-3.685-3.79-3.6-9.842.176-13.508 3.79-3.685 9.834-3.61 13.52.177l194.817 200.313c2.127 2.19 2.146 5.7 0 7.91z\"/>\r\n</svg>"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 492.904 492.904\">\r\n  <path d=\"M246.452.002C110.342.002 0 110.342 0 246.452c0 136.11 110.342 246.45 246.452 246.45s246.452-110.34 246.452-246.45c0-136.11-110.34-246.45-246.452-246.45zm197.16 246.45c0 44.22-14.81 84.942-39.488 117.867L271.097 231.264V51.002C368.2 63.195 443.61 146.108 443.61 246.452zM221.808 441.906c-37.144-4.66-71.115-19.607-98.89-42.022l98.89-98.885v140.907zm49.287-140.923l98.9 98.9c-27.788 22.415-61.757 37.362-98.9 42.022V300.982zM221.81 51.002v180.28L88.774 364.32C64.1 331.395 49.29 290.673 49.29 246.454c0-100.346 75.414-183.26 172.52-195.452z\"/>\r\n</svg>"

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 290.226 290.226\">\r\n  <path d=\"M63.95 243.575c-1.944-3.578-4.4-6.907-7.362-9.87-3.106-3.1-6.626-5.632-10.4-7.63-4.51-2.386-.945-7.5-.945-7.5 4.616-7.022 8.825-14.078 12.305-20.225l-23.363-23.344h-22.68c-4.363 0-7.9-3.54-7.9-7.902 0-4.36 3.537-7.9 7.9-7.9H37.45c2.1 0 4.108.832 5.59 2.312l85.378 85.29c1.483 1.484 2.315 3.496 2.315 5.59v26.073c0 4.364-3.537 7.896-7.9 7.896-4.367 0-7.904-3.53-7.904-7.897v-22.8l-23.27-23.24c-6.282 3.708-13.583 8.253-20.817 13.25 0 0-4.145 2.95-6.892-2.105zM26.61 237.102c-7.106 0-13.784 2.764-18.812 7.784C2.778 249.9.016 256.572.016 263.664c0 7.097 2.764 13.762 7.782 18.776 5.027 5.016 11.706 7.783 18.812 7.785 7.102 0 13.78-2.77 18.804-7.785 5.023-5.015 7.79-11.682 7.79-18.776 0-7.093-2.768-13.764-7.79-18.778-5.022-5.02-11.702-7.784-18.804-7.784zM100.985 182.318c-3.502 3.5-9.232 3.5-12.734 0l-8.81-8.8c-3.5-3.498-3.5-9.223 0-12.72L229.833 10.563c3.502-3.498 10.4-6.727 15.33-7.175L282.024.036c4.93-.448 8.596 3.218 8.148 8.148l-3.346 36.79c-.448 4.93-3.68 11.826-7.182 15.325l-150.4 150.25c-3.502 3.5-9.232 3.5-12.734 0l-8.822-8.812c-3.502-3.498-3.502-9.223 0-12.722l125.92-125.803c1.854-1.848 1.856-4.852.003-6.702-1.847-1.852-4.852-1.852-6.708 0L100.985 182.317z\"/>\r\n</svg>"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512.012 512.012\">\r\n  <path d=\"M505.756 475.587l-225.26-225.26 14.145-14.143c8.32-8.34 8.32-21.845 0-30.165l-7.636-7.638c13.035-6.656 46.293-8.384 90.453 7.7 5.952 2.156 12.63 1.558 18.112-1.663s9.258-8.726 10.24-15.02c.554-3.307 12.394-81.94-46.892-141.205C299.698-11.048 221.04.792 217.734 1.305c-6.293 1.002-11.797 4.778-15.02 10.26-3.22 5.483-3.84 12.117-1.642 18.09 16.98 46.72 18.54 82.69 13.312 96.108l-7.424-7.424c-3.99-4.012-9.408-6.252-15.083-6.252s-11.072 2.24-15.083 6.25l-58.453 58.454c-4.01 4.01-6.25 9.43-6.25 15.083s2.24 11.093 6.25 15.083l7.425 7.424c-13.42 5.227-49.344 3.67-96.085-13.333-5.952-2.177-12.63-1.558-18.112 1.642-5.483 3.243-9.26 8.747-10.26 15.02-.534 3.306-12.374 81.94 46.91 141.204 41.708 41.728 92.993 48.213 120.897 48.213 11.733 0 19.307-1.153 20.288-1.324 6.293-1.003 11.797-4.757 15.02-10.24 3.22-5.483 3.84-12.117 1.642-18.112-16.043-44.16-14.336-77.44-7.68-90.453l7.637 7.638c4.18 4.16 9.62 6.25 15.083 6.25 5.46 0 10.923-2.09 15.083-6.25l14.144-14.144L475.59 505.752c4.16 4.16 9.62 6.25 15.083 6.25s10.923-2.09 15.083-6.25c8.34-8.34 8.34-21.824 0-30.165z\"/>\r\n</svg>"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 533.333 533.333\">\r\n  <path d=\"M165.494 533.333C129.95 459.37 148.878 416.99 176.197 377.06c29.917-43.727 37.627-87.012 37.627-87.012s23.518 30.573 14.11 78.39c41.548-46.25 49.39-119.938 43.115-148.16 93.913 65.63 134.05 207.738 79.96 313.055 287.694-162.776 71.56-406.34 33.933-433.775 12.543 27.435 14.922 73.88-10.416 96.42C331.635 33.333 225.583 0 225.583 0c12.543 83.877-45.466 175.596-101.404 244.13-1.966-33.446-4.054-56.525-21.642-88.53-3.948 60.757-50.38 110.284-62.955 171.16C22.55 409.2 52.34 469.562 165.493 533.333z\"/>\r\n</svg>"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 611.999 611.999\">\r\n  <path d=\"M216.02 611.195c5.978 3.178 12.284-3.704 8.624-9.4-19.866-30.92-38.678-82.947-8.706-149.952 49.982-111.737 80.396-169.61 80.396-169.61s16.177 67.537 60.03 127.586c42.204 57.792 65.305 130.477 28.063 191.028-3.495 5.683 2.668 12.388 8.607 9.35 46.1-23.583 97.806-70.886 103.64-165.018 2.15-28.764-1.075-69.034-17.206-119.85-20.74-64.407-46.24-94.46-60.992-107.366-4.413-3.86-11.276-.44-10.914 5.413 4.3 69.494-21.845 87.13-36.726 47.386-5.943-15.874-9.41-43.33-9.41-76.766 0-55.665-16.15-112.967-51.754-159.53-9.26-12.11-20.093-23.425-32.523-33.074-4.5-3.494-11.024.018-10.612 5.7 2.734 37.736.257 145.885-94.624 275.09-86.03 119.85-52.693 211.895-40.864 236.825 22.616 47.76 54.162 75.806 84.97 92.187z\"/>\r\n</svg>"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 383.344 383.345\">\r\n  <path d=\"M273.217 106.9C246.037 62.034 215.804 23.205 200.2 4.052 198.114 1.488 194.98 0 191.674 0c-3.308 0-6.44 1.49-8.53 4.054-15.6 19.16-45.833 58-73.014 102.87-35.03 57.822-52.79 105.63-52.79 142.09 0 74.07 60.26 134.33 134.332 134.33s134.332-60.26 134.332-134.33c0-36.485-17.758-84.3-52.787-142.115zm-63.11 226.968c-7.845 2.006-15.987 3.022-24.206 3.022-50.185 0-91.014-37.93-91.014-84.55 0-11.255 2.97-24.405 8.825-39.083.99-2.48 3.808-3.895 6.586-3.295 2.776.598 4.64 3.018 4.354 5.65-.342 3.148-.516 6.223-.516 9.136 0 50.735 40.88 93.22 95.093 98.82 2.698.28 4.803 2.298 5.018 4.813.216 2.516-1.522 4.818-4.14 5.488z\"/>\r\n</svg>"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 264.695 264.695\">\r\n  <path d=\"M219.17 216.785c-4.76 0-10.32 2.3-16.67 6.88L167.287 210.7l35.734-12.978c6.003 3.888 11.558 5.833 16.682 5.833 5.64 0 9.347-2.917 11.117-8.733.352-1.235.528-2.57.528-3.98 0-7.398-4.766-11.38-14.295-11.9 3.876-3.883 5.828-7.688 5.828-11.393 0-3.87-2.038-7.15-6.09-9.797-2.12-1.05-4.326-1.584-6.616-1.584-7.77 0-13.064 6.258-15.887 18.797l-61.94 23.04-61.94-22.505c-2.824-12.885-8.126-19.332-15.886-19.332-2.292 0-4.5.535-6.62 1.584-3.875 2.647-5.82 5.926-5.82 9.797 0 3.705 1.945 7.51 5.82 11.392-9.7.52-14.554 4.502-14.554 11.9 0 1.41.18 2.746.526 3.98 1.946 5.816 5.65 8.733 11.122 8.733 5.113 0 10.67-1.945 16.677-5.832l36 12.978-35.477 12.698c-6.175-4.406-11.637-6.61-16.402-6.61-5.653 0-9.622 2.917-11.918 8.732-.348 1.235-.526 2.553-.526 3.975 0 7.405 4.853 11.385 14.555 11.907-3.875 3.883-5.82 7.688-5.82 11.393 0 3.87 1.945 7.134 5.82 9.797 2.478 1.412 4.855 2.105 7.154 2.105 7.227 0 12.443-6.176 15.62-18.525l61.672-22.504 61.678 22.504c3.178 12.35 8.475 18.525 15.882 18.525 2.12 0 4.407-.693 6.884-2.105 4.052-2.663 6.092-5.928 6.092-9.797 0-3.705-1.953-7.51-5.828-11.393 9.528-.522 14.295-4.502 14.295-11.907 0-1.422-.178-2.74-.528-3.975-2.12-5.816-6.002-8.733-11.65-8.733z\"/>\r\n  <path d=\"M48.436 128.904c9.703 11.114 23.38 19.242 41.035 24.346v3.986c0 4.936 1.673 9.086 5.026 12.433 3.35 3.357 7.498 5.21 12.44 5.562 5.117.357 8.906-.528 11.38-2.646 3.878 2.817 8.203 4.23 12.973 4.23 4.41 0 8.473-1.317 12.174-3.964 2.47 1.934 6.087 2.738 10.856 2.38 4.937-.527 9.09-2.425 12.44-5.688 3.35-3.28 5.025-7.37 5.025-12.307v-2.91c19.057-4.945 33.795-13.237 44.21-24.898 10.06-11.11 15.087-24.254 15.087-39.436 0-3.36-.355-6.886-1.063-10.597-3.526-22.57-13.94-41.2-31.23-55.844C180.612 7.856 158.464 0 132.347 0c-26.123 0-48.27 7.767-66.44 23.282C48.61 38.118 38.29 56.825 34.937 79.396c-.71 3.71-1.064 7.238-1.064 10.597 0 14.824 4.85 27.785 14.563 38.91zm104.43-68.155c5.205-6.086 11.513-9.13 18.92-9.13 7.593 0 13.987 3.044 19.195 9.13 5.2 6.075 7.81 13.445 7.81 22.086 0 8.65-2.608 16.02-7.81 22.108-5.207 6.097-11.602 9.13-19.193 9.13-7.408 0-13.716-3.033-18.922-9.13-5.21-6.087-7.814-13.46-7.814-22.108 0-8.64 2.604-16.01 7.815-22.087zm-28.06 60.678c2.555-3.307 5.064-4.968 7.54-4.968 2.47 0 4.803 1.83 7.013 5.51 2.204 3.66 3.316 7.144 3.316 10.468 0 5.062-3.36 7.58-10.067 7.58-4.415 0-7.678-1.135-9.793-3.395-1.237-1.41-1.85-3.147-1.85-5.25.002-3.308 1.278-6.62 3.838-9.945zm-53.34-60.68c5.294-6.084 11.65-9.13 19.058-9.13 7.406 0 13.762 3.046 19.06 9.13 5.296 6.077 7.948 13.447 7.948 22.088 0 8.65-2.65 16.02-7.948 22.108-5.297 6.097-11.654 9.13-19.06 9.13-7.41 0-13.764-3.033-19.06-9.13-5.29-6.087-7.943-13.46-7.943-22.108 0-8.64 2.653-16.01 7.945-22.087z\"/>\r\n</svg>"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 297.288 297.288\">\r\n  <path d=\"M.207 83.397c8.326 37.91 36.12 147.72 36.12 147.72 1.455 5.892 6.74 9.964 12.743 9.964.262 0 .524-.017.79-.032 6.322-.377 11.475-5.22 12.25-11.505l9.982-80.853 13.583 9.816c4.592 3.32 10.793 3.32 15.388 0l20.256-14.643 20.255 14.642c2.297 1.66 4.995 2.49 7.693 2.49 2.697 0 5.396-.83 7.692-2.49l20.26-14.644 20.26 14.646c4.593 3.318 10.796 3.318 15.387 0l12.602-9.107 9.9 80.28c.774 6.286 5.93 11.124 12.252 11.5.265.017.526.024.787.024 6.003 0 11.29-4.093 12.743-9.986 0 0 27.42-110.076 35.896-146.174 1.657-7.062-5.69-14.236-12.943-14.236H13.374c-7.252 0-14.722 5.506-13.167 12.59zm44.56 72.635L30.142 96.807h21.934l-7.31 59.224zm160.41-24.374l-20.264-14.644c-4.593-3.32-10.795-3.32-15.386 0l-20.26 14.643-20.255-14.642c-4.594-3.32-10.795-3.32-15.388 0L93.37 131.658l-17.606-12.545 2.776-22.306h140.4l2.86 23.017-16.624 11.836zm47.54 24.448l-7.313-59.3h21.94l-14.628 59.3zM78.41 271.02c-3.456 0-6.84 1.394-9.286 3.84-2.444 2.444-3.848 5.83-3.848 9.294 0 3.455 1.403 6.84 3.848 9.284 2.445 2.445 5.83 3.85 9.285 3.85 3.452 0 6.836-1.404 9.28-3.85 2.445-2.444 3.85-5.83 3.85-9.283 0-3.464-1.404-6.85-3.85-9.294-2.444-2.444-5.83-3.837-9.282-3.837z\"/>\r\n  <path d=\"M100.046 179.227c-3.454 0-6.84 1.405-9.284 3.85-2.444 2.445-3.85 5.828-3.85 9.283 0 3.456 1.405 6.84 3.85 9.284 2.445 2.444 5.83 3.85 9.284 3.85 3.455 0 6.84-1.405 9.283-3.85 2.444-2.444 3.85-5.828 3.85-9.284 0-3.455-1.405-6.838-3.85-9.283-2.446-2.445-5.83-3.85-9.285-3.85zm96.294-41.205c-3.455 0-6.84 1.404-9.285 3.85-2.444 2.443-3.85 5.827-3.85 9.283 0 3.455 1.405 6.84 3.85 9.283 2.445 2.445 5.83 3.85 9.284 3.85 3.453 0 6.837-1.404 9.28-3.85 2.446-2.444 3.85-5.828 3.85-9.283 0-3.456-1.403-6.84-3.85-9.284-2.443-2.443-5.827-3.847-9.282-3.847zm43.277 93.252c-3.455 0-6.84 1.403-9.284 3.848-2.444 2.445-3.85 5.83-3.85 9.285s1.405 6.838 3.85 9.284c2.444 2.446 5.84 3.85 9.284 3.85 3.455 0 6.84-1.403 9.283-3.85 2.455-2.444 3.85-5.827 3.85-9.282s-1.405-6.84-3.85-9.285c-2.444-2.445-5.828-3.848-9.283-3.848z\"/>\r\n</svg>"

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n    <path d=\"M231.97 25.5c-82.09.7-162.87 37.735-213.314 103.625 26.08-22.208 57.052-38.305 90.063-47.5-62.24 53.704-94.583 139.09-79.626 225.28 1.09-28.258 7.8-55.66 19.28-80.655 1.154 51.488 18.492 102.143 52.22 143.344-38.003-76.004-22.756-193.02 39.844-240.313 11.657-5.955 24.047-10.833 37.093-14.436C284.597 85.27 394.467 151.13 423.157 261.5c16.562 63.723 2.315 128.343-33.25 177.313-4.68 4.68-9.852 8.942-15.47 12.875-5.947-1.8-11.324-4.187-16.03-7.22-12.01-7.737-19.51-19.947-20.656-33.624-2.096-24.99 14.13-53.014 46.53-80.53l-29.717-22.095c-16.038 39.73-38.954 61.946-64.188 65.186-13.836 1.777-27.648-2.677-39.03-11.844-8.41-6.77-15.634-16.017-21.5-27.406-16.69 19.306-20.72 43.155-16 67.28 5.483 28.04 23.502 55.683 47.28 72.252 21.973 15.312 49.595 21.202 74.813 16.375 9.043-1.732 17.75-4.832 25.843-9.344 18.055-8.925 34.396-20.126 47.25-35 65.17-57.975 96.26-151.12 72.47-242.658C453.52 95.415 358.743 24.782 255.47 25.875c-1.612.017-3.23.042-4.845.094-6.22-.368-12.44-.523-18.656-.47zm-90.657 145.125c-12.53-.06-18.07 15.934-6.063 23.656l188.688 133.032c4.29-6.45 8.42-14.145 12.25-23.187L150.968 173.53c-3.503-2.022-6.764-2.89-9.655-2.905z\"/>\r\n</svg>"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n    <path d=\"M221.313 16a23.682 23.695 0 0 0-23.688 23.688v106.406a23.682 23.695 0 0 0 2.156 9.72 23.682 23.695 0 0 0 3.157 13.81l41.75 71.626-79 55.438 6.094-48.625a23.682 23.695 0 0 0-8.186-20.97l-66.28-81.937a23.682 23.695 0 0 0-33.314-3.5l-9.188 7.438a23.682 23.695 0 0 0-3.53 33.344l59.78 73.906-11.25 89.937a23.682 23.695 0 0 0 12.47 23.876l37.468 53.47a23.695 23.682 1.57 0 0 2.344 2.812 23.682 23.695 0 0 0 13.594 20.062L262 491.53a23.682 23.695 0 0 0 9.97 2.22 23.682 23.695 0 0 0 23.53-2.063l87.156-60.937a23.682 23.695 0 0 0 5.844-33l-6.78-9.688a23.682 23.695 0 0 0-32.97-5.875l-72.406 50.657-59.063-27.625 120.595-84.626a23.695 23.682 1.57 0 0 5.53-5.5 23.682 23.695 0 0 0 14.626-13.594l37.22-91.53 87.813-44.845a23.694 23.682 1.18 0 0 10.312-31.875L488 122.687a23.694 23.682 1.18 0 0-31.875-10.343l-94.688 48.375a23.694 23.682 1.18 0 0-9.843 9.436 23.682 23.695 0 0 0-8.344 10.47l-27.375 67.31-5.22-7.436a23.682 23.695 0 0 0-3-8.844l-50.81-87.094V39.688A23.682 23.695 0 0 0 233.154 16h-11.843zM77.75 376A59.994 60 0 0 0 16 436a59.994 60 0 1 0 120 0 59.994 60 0 0 0-58.25-60z\"/>\r\n</svg>"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 265.2 459\">\r\n  <path d=\"M265.2 423.3L71.4 229.5 214.2 86.7V204h51V0h-204v51h117.3L0 229.5 229.5 459\"/>\r\n</svg>"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n  <path d=\"M495.664 318.553l-17.338-31.233-67.478 37.458-24.212-13.98 24.58-12.152-15.833-32.02-45.925 22.71-29.963-17.3c1.298-5.134 1.993-10.504 1.993-16.036s-.695-10.902-1.993-16.035l29.963-17.3 45.925 22.71 15.833-32.02-24.58-12.155 24.212-13.98 67.478 37.46 17.338-31.232-48.74-27.056 39.708-22.924-17.86-30.934-39.707 22.924.938-55.737-35.716-.6-1.298 77.168-24.213 13.98 1.765-27.363-35.647-2.3-3.297 51.127-30.004 17.323c-7.675-7.455-17.163-13.044-27.733-16.046v-34.612l42.63-28.42-19.815-29.723-22.814 15.21V87.507L340.04 47.8l-18.38-30.63-47.8 28.68V0h-35.72v45.85l-47.8-28.68-18.38 30.63 66.18 39.708v27.956l-22.814-15.21-19.814 29.722 42.628 28.42v34.61c-10.57 3.003-20.057 8.592-27.733 16.047l-30.004-17.323-3.297-51.126-35.647 2.3 1.764 27.36-24.212-13.978-1.298-77.167-35.716.6.938 55.736-39.707-22.923-17.86 30.934 39.706 22.924-48.74 27.058 17.34 31.23 67.477-37.457 24.212 13.98-24.58 12.154 15.833 32.02 45.925-22.71 29.963 17.3c-1.298 5.134-1.993 10.504-1.993 16.036s.695 10.902 1.993 16.035l-29.963 17.3-45.925-22.71-15.833 32.02 24.58 12.154-24.212 13.978-67.48-37.458-17.337 31.23 48.74 27.057-39.708 22.926 17.86 30.934 39.707-22.924-.938 55.737 35.716.6 1.298-77.167 24.213-13.98-1.765 27.363 35.647 2.3 3.297-51.127 30.004-17.324c7.675 7.455 17.163 13.044 27.733 16.046v34.61l-42.63 28.42 19.815 29.722 22.814-15.208v27.956L171.96 464.2l18.378 30.63 47.8-28.68V512h35.722v-45.85l47.8 28.68 18.38-30.63-66.18-39.708v-27.956l22.814 15.21 19.814-29.722-42.628-28.42v-34.61c10.57-3.003 20.057-8.592 27.733-16.047l30.004 17.323 3.297 51.126 35.647-2.3-1.764-27.36 24.212 13.978 1.298 77.167 35.716-.6-.938-55.736 39.707 22.924 17.86-30.934-39.706-22.924 48.74-27.057z\"/>\r\n</svg>"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n    <path d=\"M164.188 40.375c-168.48 35.59-220.94 167.97-17 187.47-13.147 35.014-21.172 74.948-22.22 114.218-35.694 33.01-59.593 66.343-59.593 66.343l47.72 47.72-39.345 26.218h113.28c-73.368-73.383-21.278-104.5 65.626-104.5 88.096 0 134.175 35.905 65.594 104.5h114.5l-40.563-26.22 47.72-47.718s-22.25-31.027-55.844-62.844c-.65-40.39-8.807-81.663-22.344-117.718 203.953-19.496 151.482-151.878-17-187.47-40.813 30.863 6.55 79.75 43.717 44.626 36.908 54.048 8.752 99.845-71.937 65.594-.02-.022-.042-.04-.063-.063-9.66 28.054-33.333 48.47-61.968 48.47-28.637 0-52.332-20.416-62-48.47l-.064.064C111.736 184.826 83.596 139.042 120.5 85c37.168 35.125 84.5-13.763 43.688-44.625zm90.28 24.063c-25.736 0-48 25.088-48 57.937 0 32.85 22.264 57.938 48 57.938 25.738 0 47.97-25.086 47.97-57.938 0-32.852-22.232-57.938-47.97-57.938z\"/>\r\n</svg>"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n  <path d=\"M169.53 16.344L259.345 88 337 92.28l-1.03 18.657-161.376-8.906-118.78-4.904 227.28 68.03-197.72 246.75-14.53-17.655-49.22 96.626 248.69-202.78 51.81 11.592-38.78 40.594L270.5 329.5l-57.28 84.125L444.843 273.47 328 241.06l100.22-81.718c1.132.46 2.3.898 3.5 1.22 23.324 6.248 49.764-16.835 59.06-51.533 9.298-34.696-2.08-67.875-25.405-74.125-23.325-6.25-49.765 16.802-59.063 51.5-1.467 5.476-2.403 10.918-2.875 16.22L169.53 16.343z\"/>\r\n</svg>"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 209.841 209.841\">\r\n  <path d=\"M209.572 57.2c2.77-26.837-16.525-41.194-27.115-45.036-2.348-.854-5.24-.063-6.402 2.15-1.134 2.16-.8 4.6 1.106 6.065.552.878 3.11 5.73 2.414 19.116-.13 2.48-.472 9.068-13.93 9.07-1.47 0-2.824-.09-3.93-.2-.957-2-2.527-4.618-4.926-8.26-3.986-6.054-10.233-9.253-18.067-9.253-4.53 0-9.62 1.157-13.967 3.175-4.647 2.158-15.527 3.447-19.834 3.81-4.308-.362-15.187-1.65-19.834-3.81-4.346-2.018-9.437-3.175-13.968-3.175-7.834 0-14.08 3.2-18.067 9.252-2.397 3.643-3.968 6.262-4.926 8.26-1.105.11-2.46.2-3.93.2-13.457 0-13.8-6.59-13.93-9.07C29.57 26.11 32.128 21.26 32.68 20.38c1.907-1.466 2.24-3.906 1.106-6.065-1.162-2.213-4.052-3.005-6.402-2.15C16.794 16.004-2.5 30.364.27 57.2 2.185 75.776 10.485 83.244 17.58 86.198c-5.747 5.5-11.913 12.858-12.09 19.237-.123 4.396 1.027 7.87 3.417 10.328 2.53 2.602 6.18 3.866 11.16 3.866 2.266 0 4.866-.256 7.95-.78 7.076-1.204 14.068-2.94 18.456-4.112 2.317 6.3 6.745 17.98 10.533 25.902 4.03 8.428 5.998 16.358 6.57 18.91-.758 4.618-2.663 20.932 6.328 29.922 7.06 7.06 20.983 8.542 31.42 8.542 1.763 0 3.045-.05 3.592-.075.548.025 1.83.075 3.59.075 10.44 0 24.364-1.482 31.423-8.542 8.99-8.99 7.086-25.303 6.328-29.92.574-2.56 2.542-10.486 6.572-18.912 3.788-7.922 8.216-19.602 10.533-25.902 4.388 1.173 11.38 2.907 18.456 4.11 3.085.526 5.686.782 7.95.782 4.98 0 8.632-1.265 11.162-3.866 2.39-2.457 3.54-5.932 3.418-10.33-.178-6.377-6.344-13.735-12.09-19.235 7.096-2.954 15.395-10.42 17.312-28.997zM59.048 101.576c0-4.13 1.86-7.97 5.106-10.54 1.89-1.5 4.578-1.433 6.396.153l12.5 10.927c1.816 1.588 2.24 4.245 1.01 6.318-2.417 4.065-6.847 6.59-11.562 6.59-7.416.002-13.45-6.033-13.45-13.45zm25.42 82.566c-.9.35-1.843.527-2.804.527-4.59 0-8.6-3.99-9.976-9.93-1.582-6.825.796-13.148 5.654-15.035.9-.35 1.845-.527 2.804-.527 4.59 0 8.6 3.99 9.976 9.93 1.582 6.824-.796 13.147-5.654 15.034zm53.83-9.402c-1.377 5.938-5.386 9.93-9.976 9.93-.96 0-1.904-.178-2.805-.528-4.857-1.886-7.235-8.21-5.653-15.034 1.377-5.938 5.386-9.93 9.976-9.93.96 0 1.902.178 2.803.527 4.86 1.887 7.237 8.21 5.655 15.035zm-.955-59.713c-4.715 0-9.145-2.525-11.56-6.59-1.232-2.074-.81-4.73 1.007-6.32l12.5-10.927c1.818-1.586 4.507-1.652 6.397-.154 3.245 2.57 5.106 6.412 5.106 10.54 0 7.416-6.034 13.45-13.45 13.45z\"/>\r\n</svg>"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 69.406 69.407\">\r\n  <path d=\"M32.95 34.21H3.84c-1.138 0-2.163-.686-2.597-1.74-.43-1.053-.178-2.25.63-3.054L26.1 5.604H3.84c-1.55 0-2.8-1.267-2.8-2.802C1.04 1.248 2.29 0 3.84 0h29.11c1.136 0 2.163.69 2.592 1.743.432 1.053.18 2.252-.627 3.053L10.687 28.61H32.95c1.545 0 2.802 1.26 2.802 2.802 0 1.55-1.262 2.8-2.803 2.8zm32.612 5.757H51.85l15.687-15.42c.812-.807 1.05-2 .63-3.053-.43-1.053-1.466-1.747-2.604-1.747H44.995c-1.538 0-2.802 1.255-2.802 2.8 0 1.536 1.264 2.803 2.802 2.803h13.72L43.028 40.766c-.818.81-1.058 1.998-.627 3.054.434 1.062 1.456 1.75 2.595 1.75H65.56c1.55 0 2.803-1.258 2.803-2.8 0-1.545-1.253-2.803-2.8-2.803zM33.935 63.804H24.37L35.9 52.477c.814-.8 1.06-2.01.63-3.063-.432-1.052-1.46-1.74-2.596-1.74h-16.41c-1.547 0-2.803 1.257-2.803 2.8s1.257 2.803 2.804 2.803h9.565L15.556 64.602c-.812.81-1.06 1.998-.627 3.054.43 1.056 1.456 1.75 2.595 1.75h16.41c1.548 0 2.802-1.258 2.802-2.8s-1.243-2.802-2.802-2.802z\"/>\r\n</svg>"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 329.928 329.928\">\r\n  <path d=\"M232.478 13.406c-24.56 0-48.827 9.248-67.51 25.28-18.69-16.033-42.957-25.28-67.517-25.28C42.807 13.406 0 56.212 0 110.856c0 66.056 45.99 106.43 115.604 167.544 5.95 5.224 12.09 10.614 18.41 16.202l.13.115 21.02 18.155c2.815 2.433 6.31 3.65 9.805 3.65s6.99-1.218 9.806-3.65l21.014-18.155.13-.114c41.606-36.796 72.8-64.966 95.37-92.44 26.36-32.088 38.638-61.1 38.638-91.305 0-54.646-42.805-97.452-97.45-97.452zM176.113 272.07l-11.146 9.63-11.143-9.626c-6.325-5.593-12.472-10.99-18.43-16.22C69.672 198.157 30 163.33 30 110.858c0-38.454 28.998-67.45 67.45-67.45 20.926 0 42.408 10.03 56.066 26.175 2.85 3.37 7.04 5.313 11.454 5.313 4.414 0 8.603-1.944 11.453-5.315 13.652-16.145 35.13-26.174 56.056-26.174 38.45 0 67.448 28.997 67.448 67.45 0 49.296-44.74 91.28-123.815 161.214z\"/>\r\n  <path d=\"M184.964 94.964h-40v40h-40v40h40v40h40v-40h40v-40h-40\"/>\r\n</svg>"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n    <path d=\"M494 20L304.887 143.357c16.494 14.608 32.743 22.57 44.963 36.97zM298.346 93.594c-12.58.436-26.59 4.984-38.047 11.77-7.64 4.523-14.115 9.97-18.304 15.142-4.19 5.173-5.79 9.832-5.648 12.668l.283 5.73-5.075 2.676C133.713 193.16 80.945 250.727 18 310.594V494h166.047c6.145-15.424 12.724-33.898 15.086-47.535 1.728-9.977-2.783-21.807-8.23-35.244-5.444-13.436-11.85-28.706-7.63-45.423 3.49-13.827 14.375-25.752 24.096-35.656 4.45-4.534 8.71-8.463 12.075-11.445-6.558-8.577-14.065-20.315-16.51-34.894l17.75-2.978c2.68 15.976 15.203 28.533 22.8 39.24l-.323.23c10.54 14.634 18.892 28.395 30.72 37.546 13.358 10.337 31.484 16.39 66.526 11.49l6.658-.932 2.782 6.124c6.96 15.322 14.372 23.89 21.015 28.423 6.643 4.535 12.63 5.46 18.692 4.79 12.125-1.34 24.29-10.974 27.76-14.264 4.13-3.92 9.657-9.476 13.32-16.124 3.347-6.076 5.073-12.687 3.48-20.744-42.68-37.562-69.592-108.75-90.256-152.6-9.245-19.62-35.786-34.492-52.967-47.95-2.427-1.4-2.675-2.582-3.24-5.154-4.215-19.167 3.188-40.257 10.974-57.298-.096.002-.186-.01-.28-.006zM59.352 136.55c17.863 4.925 37.775 9.665 57.406 14.815 14.803 3.883 29.26 7.935 42.406 12.766 17.914-12.178 37.407-24.123 59.072-35.77-51.62-13.3-109.928-3.148-158.884 8.19zm28.738 26.126c-23.002 4.133-45.974 10.254-67.147 16.662 18.133 3.813 38.298 7.314 58.207 11.242 11.774 2.323 23.337 4.766 34.256 7.643a686.475 686.475 0 0 1 27.403-21.15c-9.044-2.932-18.71-5.698-28.62-8.298-7.952-2.086-16.043-4.098-24.1-6.1zM47.44 202.94c-9.875 2.096-19.728 4.582-29.44 7.29v18.04a2251.165 2251.165 0 0 1 20.172 3.146c10.505 1.7 20.847 3.498 30.734 5.625 8.836-8.185 17.887-16.322 27.268-24.397-6.64-1.56-13.52-3.024-20.508-4.403-9.32-1.838-18.81-3.566-28.227-5.3zM304 224c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16zM18 246.512v26.58c4.16.195 8.28.425 12.342.71 7.44-7.2 14.878-14.384 22.387-21.538a604.747 604.747 0 0 0-17.433-3.078A1501.67 1501.67 0 0 0 18 246.512z\"/>\r\n</svg>"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n\t<path d=\"M18.465 20.182v192.9c38.45 80.782 55.772 134.822 150.726 221.098l.167.15.16.158c3.06 3.06 5.89 3.828 10.14 3.455 4.247-.373 9.65-2.494 14.738-5.912 9.313-6.256 16.457-17.503 17.67-22.266l-56.06-56.065 13.214-13.216 62.94 62.944c1.316 1.316 2.67 1.804 6.508 1.115 3.838-.69 9.267-3.1 14.61-6.78 10.098-6.954 19.75-18.663 22.835-26.454l-56.02-56.02 13.216-13.216 63.667 63.67c19.495-3.225 35.412-16.64 41.65-32.52l.756.296-71.514-71.516 13.214-13.215L447.81 415.52c7.58 7.58 14.7 9.95 21.032 9.853 6.33-.096 12.216-2.88 16.62-7.41 8.805-9.06 12.096-23.49-2.255-37.84L259.97 156.88l13.214-13.214 33.08 33.08c46.988-3.724 84.773-17.932 102.148-33.6 8.914-8.04 12.147-15.414 11.424-22.306-.644-6.142-5.172-13.675-15.865-21.79-52.33 22.22-109.035 19.23-162.685 2.538-54.338-16.908-105.852-47.735-148.47-81.406h-74.35z\"/>\r\n</svg>"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\r\n  <path d=\"M8 2.313c3.15 0 5.688 2.537 5.688 5.687 0 3.15-2.538 5.688-5.688 5.688S2.312 11.15 2.312 8 4.85 2.312 8 2.312zM8 1C4.15 1 1 4.15 1 8s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7z\"/>\r\n  <path d=\"M9.662 10.012c-.437.35-1.05.613-1.662.613-1.487 0-2.625-1.137-2.625-2.625 0-1.487 1.138-2.625 2.625-2.625.7 0 1.4.263 1.837.787L10.8 5.2c-.7-.7-1.75-1.138-2.8-1.138-2.188 0-3.938 1.75-3.938 3.938S5.813 11.938 8 11.938c.963 0 1.75-.35 2.45-.876z\"/>\r\n</svg>"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 488.683 488.683\">\r\n  <path d=\"M478.467 376.122l-58.143-58.19c-14.212-14.218-27.14-29.663-38.648-46.16L253.872 88.378c-2.153-3.087-5.68-4.93-9.45-4.93-3.765 0-7.292 1.842-9.444 4.93l-127.81 183.36c-11.518 16.513-24.463 31.982-38.706 46.216l-58.08 58.087c-8.526 8.53-12.058 20.86-9.32 32.6l15.92 68.343c1.22 5.213 5.857 8.9 11.204 8.9h173.7l42.553-220.375 42.54 220.377h173.665c5.35 0 9.985-3.688 11.205-8.9l15.92-68.272c2.74-11.743-.776-24.063-9.303-32.593zM60.264 120.473c18.454 0 34.895-8.325 45.94-21.39.812-.956.966-2.31.398-3.425-.568-1.116-1.756-1.78-3.023-1.684-1.363.11-2.753.165-4.147.165-33.28 0-60.264-26.983-60.264-60.263 0-9.56 2.28-18.57 6.25-26.587.554-1.124.398-2.468-.428-3.41-.822-.952-2.117-1.315-3.305-.936C17.505 10.78 0 33.426 0 60.21c0 33.28 26.982 60.263 60.264 60.263zM155.23 45.522c.398.38.588.936.493 1.472l-2.185 12.692c-.11.626.143 1.26.663 1.63.51.372 1.19.42 1.76.128l11.393-5.997c.492-.254 1.06-.254 1.553 0l11.393 5.997c.57.292 1.25.244 1.758-.127.52-.372.774-1.005.663-1.63l-2.183-12.693c-.096-.536.095-1.09.492-1.472l9.206-8.99c.445-.434.62-1.097.413-1.7-.192-.6-.712-1.044-1.348-1.13L176.58 31.85c-.552-.08-1.013-.42-1.25-.91l-5.713-11.544c-.27-.57-.854-.927-1.485-.927-.636 0-1.22.357-1.49.926l-5.71 11.545c-.24.49-.7.83-1.252.91l-12.723 1.85c-.636.088-1.156.53-1.347 1.133-.206.602-.03 1.265.413 1.7l9.207 8.99zM333.158 56.348c.392.38.567.934.488 1.472l-2.185 12.69c-.106.626.144 1.26.668 1.63.505.372 1.188.42 1.756.128l11.395-5.998c.488-.254 1.06-.254 1.55 0l11.395 5.998c.567.292 1.247.244 1.755-.127.52-.37.775-1.004.664-1.63l-2.186-12.69c-.075-.538.096-1.092.493-1.472l9.212-8.99c.44-.434.6-1.1.41-1.7-.188-.603-.712-1.046-1.344-1.133l-12.725-1.85c-.553-.08-1.014-.42-1.248-.91L347.54 30.22c-.267-.57-.854-.925-1.486-.925-.635 0-1.22.355-1.49.925l-5.71 11.545c-.24.49-.696.83-1.252.91l-12.723 1.85c-.633.087-1.156.53-1.348 1.132-.187.602-.03 1.267.413 1.702l9.213 8.988zM411.48 203.222c.392.38.583.936.487 1.472l-2.185 12.693c-.11.625.143 1.26.667 1.63.504.372 1.183.42 1.755.127l11.392-5.998c.493-.254 1.06-.254 1.554 0l11.393 5.998c.57.292 1.25.245 1.76-.127.52-.37.774-1.005.663-1.63l-2.185-12.693c-.095-.536.096-1.09.493-1.472l9.21-8.988c.442-.435.617-1.1.41-1.7-.19-.602-.71-1.045-1.346-1.132l-12.723-1.85c-.553-.08-1.014-.42-1.252-.91l-5.71-11.546c-.272-.57-.855-.927-1.487-.927-.635 0-1.22.356-1.49.926l-5.71 11.545c-.24.492-.696.83-1.252.91l-12.723 1.852c-.636.087-1.155.53-1.347 1.132-.206.602-.03 1.265.414 1.7l9.212 8.988z\"/>\r\n</svg>"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 485.202 485.202\">\r\n  <path d=\"M318.416 106.132c8.378 0 15.163 6.784 15.163 15.166 0 8.38-6.786 15.16-15.164 15.16H166.788c-8.384 0-15.166-6.78-15.166-15.16 0-8.382 6.782-15.166 15.166-15.166h151.628zm8.765 45.488H158.005C82.887 206.41 30.32 322.526 30.32 396.27c0 99.182 95.036 88.605 212.28 88.605 117.24 0 212.282 10.576 212.282-88.604 0-73.744-52.566-189.86-127.7-244.65zM158.005 90.97H327.18s67.05-58.49 36.722-84.076C333.58-18.693 266.294 35.324 242.6 33.43c-23.692 1.894-90.978-52.123-121.302-26.536C90.97 32.48 158.004 90.97 158.004 90.97z\"/>\r\n</svg>"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 226.5 226.501\">\r\n  <path d=\"M78.892 91.198h-3.888v17.826h2.965c2.64 0 5.085-.706 5.085-5.824v-6.363c0-5.203-2.057-5.64-4.163-5.64zM155.518 91.198h-3.795v19.854h3.795c2.098 0 3.98-.39 3.98-5.086v-9.682c0-4.697-1.884-5.086-3.98-5.086z\"/>\r\n  <path d=\"M202 181.67h-8.902c.147-1.294.23-2.605.23-3.938V54.242c0-13.33-7.607-24.876-18.715-30.556C169.006 9.8 155.41 0 139.518 0H86.984C71.09 0 57.494 9.8 51.887 23.686 40.78 29.366 33.172 40.91 33.172 54.243v123.49c0 1.33.084 2.643.23 3.936H24.5c-5.522 0-10 4.477-10 10v24.83c0 5.523 4.478 10 10 10H202c5.523 0 10-4.477 10-10v-24.83c0-5.524-4.476-10-10-10zM94.528 145.16c-.76.867-1.856 1.363-3.01 1.363h-4.14c-1.977 0-3.656-1.44-3.955-3.396-.194-1.272-.277-2.927-.277-5.534v-10.145c0-6.648-2.786-7.205-5.64-7.205h-2.504v22.28c0 2.208-1.79 4-4 4H66.86c-2.21 0-4-1.792-4-4V83.977c0-2.21 1.79-4 4-4h12.307c10.937 0 16.03 5.035 16.03 15.846v5.072c0 6.264-1.815 10.556-5.538 13.054 3.83 2.397 5.63 6.835 5.63 13.778v9.96c0 1.75.032 3.08.195 4.31.153 1.145-.197 2.296-.957 3.162zm28.61-2.637c0 2.21-1.79 4-4 4h-4.143c-2.21 0-4-1.79-4-4V83.978c0-2.21 1.79-4 4-4h4.144c2.208 0 4 1.79 4 4v58.545zm48.503-37.202c0 14.012-8.768 16.952-16.122 16.952h-3.795v20.252c0 2.21-1.79 4-4 4h-4.143c-2.21 0-4-1.79-4-4V83.978c0-2.21 1.79-4 4-4h11.938c7.354 0 16.123 2.94 16.123 16.953v8.39z\"/>\r\n</svg>"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 105.144 105.144\">\r\n  <path d=\"M98.126 30.812c-9.885-11.406-33.412-10.61-35.012-1.417-1.328 7.66 6.71 11.943 10.554 15.915 4.445 4.592 5.2 12.01 1.535 17.07-1.528 2.102-10.65 11.332-7.938 20.447 1.378 4.624 4.48 6.696 8.54 7.537 13.495 2.81 14.92-7.9 15.06-12.65.124-4.46.79-8.794 2.626-12.878 4.507-10.246 11.34-26.286 4.636-34.024zM63.99.045c3.054-.49 6.167 3.114 6.958 8.045.79 4.932-1.034 9.33-4.083 9.82-3.053.49-6.163-3.114-6.957-8.045-.788-4.932 1.037-9.33 4.083-9.82zM81.83 9.37c.186 3.455-1.39 6.346-3.522 6.464-2.137.115-4.015-2.59-4.205-6.045s1.393-6.346 3.523-6.464c2.133-.114 4.015 2.592 4.205 6.045zm8.96 2.492c.155 2.802-1.126 5.154-2.862 5.247-1.736.092-3.257-2.102-3.41-4.908-.155-2.806 1.123-5.154 2.86-5.25 1.735-.097 3.263 2.104 3.413 4.91zm5.527 4.144c-.147 2.072-1.306 3.68-2.588 3.586-1.28-.09-2.2-1.843-2.054-3.915s1.303-3.68 2.588-3.586c1.278.09 2.202 1.844 2.055 3.916zm3.915 4.89c-.115 1.652-1.04 2.934-2.065 2.862-1.02-.075-1.757-1.474-1.643-3.128.118-1.653 1.045-2.935 2.07-2.863 1.023.075 1.756 1.478 1.638 3.128zM42.027 43.71c-1.6-9.194-25.127-9.985-35.008 1.417-6.704 7.737.12 23.78 4.634 34.024 1.836 4.088 2.498 8.415 2.627 12.874.14 4.753 1.57 15.46 15.06 12.658 4.06-.845 7.162-2.913 8.537-7.54 2.713-9.116-6.406-18.346-7.934-20.447-3.668-5.06-2.913-12.476 1.532-17.07 3.842-3.972 11.88-8.256 10.552-15.915zM34.186 22.41c.795-4.933 3.908-8.537 6.954-8.046 3.046.49 4.874 4.885 4.083 9.82-.795 4.932-3.908 8.536-6.954 8.045-3.05-.49-4.875-4.886-4.084-9.82zm-3.14 1.692c-.185 3.454-2.07 6.16-4.204 6.04-2.137-.114-3.715-3.01-3.525-6.462.19-3.454 2.072-6.16 4.205-6.04 2.133.116 3.715 3.012 3.525 6.462zm-10.42 2.42c-.154 2.805-1.678 5-3.41 4.906-1.73-.093-3.01-2.444-2.857-5.247.15-2.805 1.677-5.002 3.41-4.91 1.73.097 3.006 2.45 2.856 5.25zm-7.158 3.47c.147 2.072-.773 3.826-2.05 3.915s-2.438-1.517-2.585-3.59.773-3.826 2.05-3.915c1.282-.09 2.438 1.518 2.585 3.59zm-4.86 4.96c.118 1.654-.616 3.057-1.64 3.13-1.02.07-1.942-1.21-2.06-2.864-.118-1.653.616-3.056 1.636-3.128 1.023-.075 1.946 1.206 2.064 2.863z\"/>\r\n</svg>"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\r\n  <path d=\"M437.034 437.002C483.352 390.676 512 326.682 512 256c0-70.6-28.583-134.526-74.806-180.84-.06-.06-.11-.126-.17-.187-.06-.06-.126-.11-.187-.17C390.523 28.583 326.6 0 256 0S121.477 28.582 75.164 74.804c-.06.06-.128.11-.188.17-.06.06-.11.127-.17.188C28.584 121.474 0 185.4 0 256c0 70.683 28.648 134.676 74.966 181.002l.014.015c.005.005.01.01.015.013C121.32 483.35 185.315 512 256 512s134.68-28.65 181.005-74.97l.015-.012.014-.016zM43.726 277.332H151.47c2.765 13.618 8.127 26.29 15.542 37.484l-76.188 76.188c-25.865-31.606-42.838-70.767-47.098-113.67zm47.1-156.34l76.187 76.19c-7.415 11.195-12.78 23.867-15.544 37.485H43.725c4.26-42.905 21.234-82.067 47.1-113.674zm377.448 113.675H360.53c-2.764-13.618-8.127-26.29-15.543-37.486l76.188-76.186c25.865 31.606 42.84 70.768 47.1 113.673zm-167.024 66.58c-.022.023-.04.047-.062.07C289.61 312.86 273.638 320 256 320s-33.61-7.14-45.188-18.684c-.022-.022-.04-.046-.062-.068-.022-.022-.046-.04-.067-.06C199.14 289.61 192 273.637 192 256c0-35.343 28.657-64 64-64s64 28.657 64 64c0 17.638-7.14 33.61-18.683 45.187-.02.022-.045.04-.067.06zm13.567-134.236c-11.195-7.413-23.867-12.776-37.483-15.54V43.725c42.904 4.26 82.065 21.234 113.67 47.098l-76.187 76.187zm-80.15-15.54c-13.617 2.764-26.288 8.126-37.483 15.54l-76.188-76.187c31.606-25.864 70.767-42.838 113.67-47.098V151.47zM197.18 344.986c11.197 7.415 23.87 12.78 37.487 15.544v107.745c-42.905-4.26-82.067-21.235-113.674-47.1l76.188-76.188zm80.153 15.544c13.618-2.764 26.29-8.127 37.486-15.543l76.187 76.188c-31.607 25.865-70.77 42.84-113.674 47.1V360.53zm67.656-45.713c7.413-11.195 12.776-23.867 15.54-37.483h107.745c-4.26 42.904-21.234 82.065-47.098 113.67l-76.188-76.187z\"/>\r\n</svg>"

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(32)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--2-1!../node_modules/postcss-loader/lib/index.js!./ext.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--2-1!../node_modules/postcss-loader/lib/index.js!./ext.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(30)(undefined);
// imports


// module
exports.push([module.i, "html.ext-html {\r\n\theight: 100%;\r\n}\r\n\r\n\thtml.ext-html body {\r\n\t\tbox-sizing: border-box;\r\n\t}\r\n\r\n\thtml.ext-html body footer {\r\n\t\t\tmargin-top: 0;\r\n\t\t\tdisplay: none;\r\n\t\t}\r\n\r\n\thtml.ext-html body #main-container {\r\n\t\t\theight: 100%;\r\n\t\t\tbox-sizing: border-box;\r\n\t\t}\r\n\r\n\thtml.ext-html body #main-container #content {\r\n\t\t\t\tpadding: 0;\r\n\t\t\t\theight: 100%;\r\n\t\t\t}\r\n\r\n\thtml.ext-html .pgf-game-data {\r\n\t\theight: 100%;\r\n\t\tmin-height: 740px;\r\n\t}\r\n\r\n\thtml.ext-html .pgf-hero-column,\r\n\thtml.ext-html .pgf-info-column {\r\n\t\tdisplay: flex;\r\n\t\tflex-direction: column;\r\n\t\theight: 100%;\r\n\t}\r\n\r\n\thtml.ext-html .pgf-hero-column .first-row-block, html.ext-html .pgf-info-column .first-row-block {\r\n\t\t\tmin-height: 240px;\r\n\t\t\tflex: 0 0 auto;\r\n\t\t}\r\n\r\n\thtml.ext-html .pgf-hero-column.pgf-info-column .second-row-block, html.ext-html .pgf-info-column.pgf-info-column .second-row-block {\r\n\t\t\tflex: 1 1 auto;\r\n\t\t\tdisplay: flex;\r\n\t\t\tflex-direction: column;\r\n\t\t\tmargin-bottom: 25px;\r\n\t\t}\r\n\r\n\thtml.ext-html .pgf-hero-column.pgf-info-column .second-row-block .tab-content, html.ext-html .pgf-info-column.pgf-info-column .second-row-block .tab-content {\r\n\t\t\t\tflex: 1 1 auto;\r\n\r\n\t\t\t\tmargin-right: -5px;\r\n\t\t\t\tpadding-right: 5px;\r\n\t\t\t\toverflow-y: scroll;\r\n\t\t\t}\r\n\r\n\thtml.ext-html .pgf-hero-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar, html.ext-html .pgf-info-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar {\r\n\t\t\t\t\twidth: 5px;\r\n\t\t\t\t}\r\n\r\n\thtml.ext-html .pgf-hero-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar-track, html.ext-html .pgf-info-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar-track {\r\n\t\t\t\t\tbackground-color: rgba(0, 0, 0, .05);\r\n\t\t\t\t}\r\n\r\n\thtml.ext-html .pgf-hero-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar-thumb, html.ext-html .pgf-info-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar-thumb {\r\n\t\t\t\t\tbackground-color: rgba(0, 0, 0, .2);\r\n\t\t\t\t\tborder-radius: 2px;\r\n\t\t\t\t}\r\n\r\n\thtml.ext-html .pgf-hero-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar-thumb:hover, html.ext-html .pgf-info-column.pgf-info-column .second-row-block .tab-content::-webkit-scrollbar-thumb:hover {\r\n\t\t\t\t\t\tbackground-color: rgba(0, 0, 0, .3);\r\n\t\t\t\t\t}\r\n\r\n\thtml.ext-html .pgf-hero-column.pgf-info-column .second-row-block .tab-content .log-block, html.ext-html .pgf-info-column.pgf-info-column .second-row-block .tab-content .log-block {\r\n\t\t\t\t\toverflow: visible;\r\n\t\t\t\t\theight: auto;\r\n\t\t\t\t}\r\n\r\n.link-ajax {\r\n\tcolor: #0088cc;\r\n\tcursor: default;\r\n\tbackground-image: linear-gradient(to right, #0088cc, #0088cc 50%, transparent 50%);\r\n\tbackground-size: 2px 1px;\r\n\tbackground-position: 0 95%;\r\n\tbackground-repeat: repeat-x;\r\n}\r\n.link-ajax:hover {\r\n\tcolor: #005580;\r\n\tbackground-image: linear-gradient(to right, #005580, #005580 50%, transparent 50%);\r\n}\r\n\r\nbody .nav-tabs > li > a {\r\n\tpadding-left: 9px;\r\n\tpadding-right: 9px;\r\n}\r\n\r\n.pgf-ext-tab-button {\r\n\tbackground: url(" + __webpack_require__(31) + ") center center no-repeat;\r\n\tbackground-size: 16px 16px;\r\n\tcolor: transparent !important;\r\n\ttext-indent: -500px;\r\n\toverflow: hidden;\r\n}\r\n\r\n.ext-container .ext-tabs {\r\n\t\tmargin-bottom: 10px;\r\n\t\ttext-align: right;\r\n\t}\r\n\r\n.ext-container .ext-tabs .ext-tab {\r\n\t\t\ttext-decoration: dotted;\r\n\t\t\tcolor: #0088cc;\r\n\t\t\tbackground-image: linear-gradient(to right, #0088cc, #0088cc 50%, transparent 50%);\r\n\t\t\tbackground-size: 2px 1px;\r\n\t\t\tbackground-position: 0 95%;\r\n\t\t\tbackground-repeat: repeat-x;\r\n\t\t\tcursor: pointer;\r\n\t\t\tmargin-left: 10px;\r\n\r\n\t\t}\r\n\r\n.ext-container .ext-tabs .ext-tab.active {\r\n\t\t\t\tbackground-image: none;\r\n\t\t\t\tcolor: #333;\r\n\t\t\t\tfont-weight: bold;\r\n\t\t\t}\r\n\r\n.ext-container .ext-content {\r\n\t\tdisplay: none;\r\n\t}\r\n\r\n.ext-container .ext-content.active {\r\n\t\t\tdisplay: block;\r\n\t\t}\r\n\r\n\r\n#abilities-block .angel-ability { width: auto !important; display: inline-block; }\r\n#abilities-block .angel-ability.pgf-ability-help { margin: 0 50px; }\r\n#abilities-block .dropdown { width: auto !important; }\r\n\r\n\r\n\r\n.ext-controls { font-size: 12px; }\r\n.ext-control { margin-right: 10px; }\r\n.ext-control.link-ajax { background: none; }\r\n\r\n\r\n.table-stats {\r\n\twidth: 100%;\r\n}\r\n\r\n\r\n.table-stats thead td {\r\n\t\t\ttext-align: right;\r\n\t\t\tfont-weight: bold;\r\n\t\t\tborder-bottom: 2px solid #ddd;\r\n\t\t}\r\n\r\n\r\n.table-stats tbody th,\r\n\t\t.table-stats tbody td {\r\n\t\t\tvertical-align: top;\r\n\t\t\tborder-top: 1px solid #ddd;\r\n\t\t\tpadding: 5px;\r\n\t\t\twhite-space: nowrap;\r\n\t\t}\r\n\r\n\r\n.table-stats tbody tr:hover {\r\n\t\t\tbackground-color: #e1e6e6;\r\n\t\t}\r\n\r\n\r\n.table-stats tbody th {\r\n\t\t\ttext-align: left;\r\n\t\t}\r\n\r\n\r\n.table-stats tbody td {\r\n\t\t\ttext-align: right;\r\n\t\t}\r\n\r\n\r\n/* short */\r\n.log-record.ext:hover {\r\n\tbackground: none;\r\n}\r\n\r\n.act {\r\n\twhite-space: nowrap;\r\n\tpadding: 1px 5px;\r\n\tmargin: -1px 0;\r\n\tdisplay: inline-block;\r\n}\r\n\r\n.act:hover {\r\n\t\tbackground: #e1e6e6;\r\n\t}\r\n\r\n.act svg {\r\n\t\theight: 13px;\r\n\t\t/*width: 13px;*/\r\n\t\tvertical-align: -1px;\r\n\t\tdisplay: inline-block;\r\n\t}\r\n\r\n.act.positive { color: black; }\r\n\r\n.act.positive svg { fill: #005000; }\r\n\r\n.act.negative { color: #B90000; }\r\n\r\n.act.negative svg { fill: darkred; }\r\n\r\n.act.god{ color: #007b7b; text-decoration: underline; }\r\n\r\n.act.god svg { fill: #007b7b; }\r\n\r\n.act .companion svg {\r\n\t\tfill: #002000;\r\n\t}\r\n\r\n.act .god-icon svg {\r\n\t\tfill: #004F4F;\r\n\t}\r\n\r\n.act.loot { color: darkgoldenrod; }\r\n\r\n.act.loot svg { fill: darkgoldenrod; }\r\n\r\n.act.loot.drop .artifact{ text-decoration: line-through; }\r\n\r\n\r\n\r\n\r\n.act-rest.positive { color: #005000; }\r\n.act-heal.positive { color: #005000; }\r\n.act-heal.negative { color: darkred; }\r\n.act-godheal.act { color: darkmagenta; text-decoration: underline; }\r\n\r\n.act.positive .vamp { color: #005000; }\r\n.act.negative .vamp { color: darkred; }\r\n\r\n.act-slow.positive { color: #00008B; }\r\n\r\n.act-coins.positive { color: darkgoldenrod; }\r\n.act-coins.negative { color: darkgoldenrod; text-decoration: line-through; }\r\n.act-godcoins.act { color: darkmagenta; text-decoration: underline; }\r\n\r\n.act-pvpeff.positive { color: dodgerblue; }\r\n.act-pvpeff.negative { color: dodgerblue; text-decoration: line-through; }\r\n.act-pvpice.positive,\r\n.act-pvpflame.negative,\r\n.act-pvpfail.negative { color: darkgreen; }\r\n.act-pvpice.negative,\r\n.act-pvpflame.positive,\r\n.act-pvpfail.positive { color: darkred; }\r\n/* eo short */\r\n\r\n/* highlight */\r\n.positive .value { color: darkred; }\r\n.negative .value { color: red; }\r\n\r\n.msg-dmg.positive .value { color: darkred; }\r\n.msg-dmg.negative .value { color: red; }\r\n\r\n.msg-godhit { color: darkmagenta; }\r\n.msg-pickup .item { color: darkgoldenrod; }\r\n.msg-empty { color: darkgoldenrod; text-decoration: line-through; }\r\n.msg-drop { color: darkgoldenrod; text-decoration: line-through; }\r\n.msg-death { color: darkred; text-decoration: line-through; }\r\n\r\n.submessage .energy { color: dodgerblue; }\r\n.submessage .coins { color: darkgoldenrod; }\r\n.submessage .coins svg { fill: darkgoldenrod; }\r\n.submessage .godcoins { color: darkmagenta; }\r\n\r\n.submessage .level,\r\n.submessage .exp { color: darkviolet; text-decoration: underline; }\r\n/* eo highlight */\r\n\r\n\r\n/* group */\r\n.archive-content .level { color: darkviolet; text-decoration: underline; }\r\n.group { position: relative; margin-bottom: 2px; }\r\n.group .group-toggle { cursor: default; }\r\n.group .on-open { display: none; }\r\n.group.open .on-open { display: block; }\r\n.group.open .on-close { display: none; }\r\n\r\n.group.open { margin: 0; }\r\n\r\n.group-time {  }\r\n.group-time.average { color: #8a6d3b; text-decoration: underline; }\r\n.group-time.bad { color: #a94442; text-decoration: underline; }\r\n\r\n.group-title {\r\n\tcursor: default;\r\n\tmargin-right: 0;\r\n\twhite-space: nowrap;\r\n\toverflow: hidden;\r\n\ttext-overflow: ellipsis;\r\n}\r\n.group-title:hover { background: #ddd; }\r\n\r\n.action-icon.fight { color: darkred; }\r\n.action-icon.fight-god { color: darkviolet; }\r\n\r\n.action-icon.equip,\r\n.action-icon.trade { color: darkgoldenrod; }\r\n.action-icon.quest,\r\n.action-icon.noeffect { color: dodgerblue; }\r\n.action-icon.idle { color: dodgerblue; }\r\n.action-icon.energy { color: dodgerblue; }\r\n.action-icon.rest { color: #005000; }\r\n.action-icon.dead { color: darkred; }\r\n.action-icon.companionHeal { color: #008000; }\r\n.action-icon.broken { color: red; }\r\n\r\n.action-icon {\r\n\tdisplay: inline-block;\r\n\tvertical-align: text-bottom;\r\n\twidth: 15px;\r\n}\r\n.group-title.god .group-time { color: darkviolet; text-decoration: underline; }\r\n.group-time { margin-right: 3px; }\r\n\r\n.group-controls { position: absolute; right: 0; top: 1px; }\r\n.group-stats { margin-bottom: 2px; }\r\n.group-stats .stat { margin: 0 0 0 4px;}\r\n.group-stats .stat-me + .stat-enemy { margin-left: 8px;}\r\n\r\n.group-stats .stat-me { color: #005000; }\r\n.group-stats .stat-enemy { color: darkred; }\r\n\r\n.group-stats .stat-against {\r\n\tdisplay: inline-block;\r\n\twidth: 35px;\r\n\twhite-space: nowrap;\r\n}\r\n/*.group .pgf-log-list { margin: 0; }*/\r\n/* eo group */\r\n\r\n\r\n.text-muted { color: #999; }\r\n.text-primary { color: #428bca; }\r\n.text-success { color: #3c763d; }\r\n.text-info { color: #31708f; }\r\n.text-warning { color: #8a6d3b; }\r\n.text-danger { color: #a94442; }\r\n\r\n\r\n.quest-icon-mini {\r\n\tfloat: none;\r\n\tdisplay: inline-block;\r\n\tmargin: 0;\r\n\tvertical-align: bottom;\r\n\twidth: 16px;\r\n\theight: 16px;\r\n\tbackground-size: 32px 192px;\r\n\tbackground-image: url('http://static.the-tale.org/static/168/game/images/quests.png');\r\n}\r\n.quest-icon-mini.caravan { background-position: 0 0; }\r\n.quest-icon-mini.delivery { background-position: 0 -16px; }\r\n.quest-icon-mini.help { background-position: 0 -32px; }\r\n.quest-icon-mini.help_friend { background-position: 0 -48px; }\r\n.quest-icon-mini.hometown { background-position: 0 -64px; }\r\n.quest-icon-mini.hunt { background-position: 0 -80px; }\r\n.quest-icon-mini.interfere_enemy { background-position: 0 -96px; }\r\n.quest-icon-mini.collect_debt { background-position: 0 -112px; }\r\n.quest-icon-mini.spying { background-position: 0 -128px; }\r\n.quest-icon-mini.search_smith { background-position: 0 -144px; }\r\n.quest-icon-mini.no-quest { background-position: 0 -160px; }\r\n.quest-icon-mini.next-spending { background-position: 0 -176px; }\r\n.quest-icon-mini.pilgrimage { background-position: -16px -80px; }\r\n\r\n\r\n\r\n/*#pgf-towns-container { background: #fff; }*/\r\n#pgf-towns-container .reload {\r\n\tfont-size: 12px;\r\n}\r\n\r\n\r\n\r\n/* settings */\r\n#log-block-sets { height: auto; }\r\n.sets-header { margin: 10px 0 5px;}\r\n.sets { margin: 5px 0 0 20px; }\r\n.sets-inline { display: inline-block; }\r\n\r\n.note-block { color: #999; }\r\ninput.input-tiny { height: 11px; width: 60px; font-size: 12px; margin: -2px 0 -3px; vertical-align: 0; }\r\ninput.input-tiny-num { width: 45px; }\r\n.input-append .add-on { height: 11px; line-height: 11px; margin-top: -2px; margin-bottom: -3px; vertical-align: -1px; }\r\n\r\n\r\n.sets label {\r\n\tdisplay: inline;\r\n\tfont-weight: normal;\r\n\tmargin-bottom: 0;\r\n}\r\n.sets .input-wrap-inline {\r\n\tdisplay: inline-block;\r\n}\r\n.sets .input-wrap {\r\n\ttransition: opacity .2s;\r\n}\r\n.sets .input-wrap.disabled { opacity: .7; }\r\n/* eo sets */\r\n\r\n\r\ndiv.easy-block {\r\n\tclear: right;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(33);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 33 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);