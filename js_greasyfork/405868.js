// ==UserScript==
// @name         Цветовая подсветка в данных СТС 
// @version      0.2.0
// @description  ...
// @author       ya
// @include       https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/405868/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D0%A1%D0%A2%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/405868/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D0%A1%D0%A2%D0%A1.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 523:
/***/ (() => {

const fields = {
  fieldColor: document.getElementById('sts-color'),
  fieldYear: document.getElementById('sts-year'),
  fieldNumber: document.getElementById('sts-number'),
  fieldSts: document.getElementById('sts-value'),
  fieldVin: document.getElementById('sts-vin'),
  fieldBody: document.getElementById('sts-body-number')
};

const btns = {
  btnBlock: document.getElementById('btn-block'),
  btnOk: document.getElementById('btn-ok')
};

const saveClick = () =>
  fields.fieldNumber.value.length > 0 &&
  fields.fieldSts.value.length > 0 &&
  fields.fieldVin.value.length > 0
    ? document.getElementById('sts-data-form-ok').click()
    : undefined;

Object.values(fields).forEach((field) => field.addEventListener('change', saveClick));
Object.values(btns).forEach((btn) => btn.addEventListener('mouseover', saveClick));

const label = fields.fieldVin.previousElementSibling;
label.style.cursor = 'pointer';

label.addEventListener('dblclick', () => {
  fields.fieldVin.value = '00000000000000000';
  saveClick();
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./src/Marks/ColorInfo/ColorInfo.Service.ts
class ColorInfoService {
    constructor(_config) {
        this._config = _config;
        this.checkVin = (vinHTML) => {
            return [...vinHTML].map((char) => {
                return {
                    char,
                    style: {
                        backgroundColor: char === 'Z' ||
                            char === '2' ||
                            char === 'B' ||
                            char === '8' ||
                            char === 'D' ||
                            char === '0' ||
                            char === 'L' ||
                            char === 'C'
                            ? 'red'
                            : '#797979'
                    }
                };
            });
        };
        this.transformInfo = (infoHTML, city) => {
            return {
                info: infoHTML,
                ...this.transformVin(infoHTML),
                ...this.transformColor(infoHTML),
                ...this.transformCarNumber(infoHTML, city),
                ...this.transformCities(city),
                ...this.transformBrand(infoHTML)
            };
        };
    }
    checkColor(color) {
        switch (color) {
            case 'Белый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#ffffff'
                        }
                    }
                ];
            case 'Черный':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#000'
                        }
                    }
                ];
            case 'Красный':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#f00'
                        }
                    }
                ];
            case 'Зеленый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#09a90e'
                        }
                    }
                ];
            case 'Желтый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#ffe000'
                        }
                    }
                ];
            case 'Темно-синий':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#042da0'
                        }
                    }
                ];
            case 'Синий':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#214be4'
                        }
                    }
                ];
            case 'Голубой':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#4abcff'
                        }
                    }
                ];
            case 'Оранжевый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#ff9900'
                        }
                    }
                ];
            case 'Бежевый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#fff5d6'
                        }
                    }
                ];
            case 'Серый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#797979'
                        }
                    }
                ];
            case 'Фиолетовый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#8e07b1'
                        }
                    }
                ];
            case 'Коричневый':
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: '#753d2c'
                        }
                    }
                ];
            default:
                return [
                    {
                        char: color,
                        style: {
                            backgroundColor: 'transparent'
                        }
                    }
                ];
        }
    }
    checkNumberCar(resultMatch) {
        const [number, region] = resultMatch;
        if (this._config.carNumber.regions.indexOf(region) < 0) {
            return [
                {
                    char: number,
                    style: {
                        backgroundColor: 'red'
                    }
                }
            ];
        }
        return [
            {
                char: number,
                style: {
                    backgroundColor: 'transparent'
                }
            }
        ];
    }
    transformColor(html) {
        if (this._config.color) {
            const patternColor = /[\s\S]*\d{4,4}\s(.+?)(&nbsp;)?\(/;
            const color = html.match(patternColor);
            return color !== null
                ? {
                    color: {
                        text: color[1].trim(),
                        result: this.checkColor(color[1].trim())
                    }
                }
                : null;
        }
        return null;
    }
    transformVin(html) {
        if (this._config.vin) {
            const patternVin = /Н:\s(\S{0,17}?)</;
            const vin = html.match(patternVin);
            return vin !== null
                ? {
                    vin: {
                        text: vin[1],
                        result: this.checkVin(vin[1])
                    }
                }
                : null;
        }
        return null;
    }
    transformBrand(html) {
        if (this._config.brand) {
            const patternBrand = /^\W*<br>+(.+?)\s\[/;
            const brand = html.match(patternBrand);
            return brand !== null
                ? {
                    brand: {
                        text: brand[1],
                        result: [
                            {
                                char: brand[1],
                                style: {
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    fontSize: '25px'
                                }
                            }
                        ]
                    }
                }
                : null;
        }
        return null;
    }
    transformCities(city) {
        if (this._config.cities.length > 0) {
            return this._config.cities.includes(city)
                ? {
                    city: {
                        text: city,
                        result: [
                            {
                                char: city,
                                style: {
                                    backgroundColor: 'orange'
                                }
                            }
                        ]
                    }
                }
                : null;
        }
        return null;
    }
    transformCarNumber(html, city) {
        const numberCar = /\(((\W\W)\S*)\)&nbsp;/.test(html)
            ? html.match(/\((\S*?(\d{0,2}?))\)&nbsp;/)
            : html.match(/\((\S*?(\d{0,3}?))\)&nbsp;/);
        if (this._config.carNumber.type === 'all') {
            if (numberCar !== null && !this._config.carNumber.cities.includes(city)) {
                const result = this.checkNumberCar([numberCar[1], numberCar[2]]);
                return {
                    numberCar: {
                        text: numberCar[0],
                        result: result.map((res) => ({
                            ...res,
                            style: {
                                ...res.style,
                                fontSize: '25px',
                                color: res.style.backgroundColor === 'red' ? '#fff' : '#000',
                                backgroundColor: res.style.backgroundColor === 'red' ? 'red' : '#fff'
                            }
                        }))
                    }
                };
            }
            return (numberCar !== null && {
                numberCar: {
                    text: numberCar[0],
                    result: [
                        {
                            char: numberCar[1],
                            style: {
                                backgroundColor: '#fff',
                                color: '#000',
                                fontSize: '25px'
                            }
                        }
                    ]
                }
            });
        }
        if (this._config.carNumber.type === 'check') {
            return numberCar !== null && !this._config.carNumber.cities.includes(city)
                ? {
                    numberCar: {
                        text: numberCar[0],
                        result: this.checkNumberCar([numberCar[1], numberCar[2]])
                    }
                }
                : null;
        }
        return null;
    }
}

;// CONCATENATED MODULE: ./src/Marks/ColorInfo/ColorInfo.Controller.ts

class ColorInfoController {
    constructor(_service) {
        this._service = _service;
        this.HTMLElements = {
            info: null
        };
    }
    createSpan(text, styles) {
        const span = document.createElement('span');
        span.setAttribute('style', `display: inline-block; padding: 0 10px; border: 1px solid rgb(128,128,128); border-radius: 5px;`);
        span.classList.add('colorInfo');
        span.textContent = text;
        Object.keys(styles).forEach((cssName) => {
            span.style[cssName] = styles[cssName];
        });
        return span.outerHTML;
    }
    formatToHTML(res) {
        const values = Object.values(res);
        const { info } = res;
        return values
            .filter((item) => item !== null && typeof item !== 'string')
            .map((value) => {
            const { text, result } = value;
            return {
                text,
                result: result.map((r) => this.createSpan(r.char, r.style))
            };
        })
            .reduce((prev, next) => {
            return prev.replace(next.text, next.result.join(''));
        }, info);
    }
    init(htmlElements, city) {
        this.HTMLElements = htmlElements;
        const resultInfo = this._service.transformInfo(this.HTMLElements.info.innerHTML, city);
        this.HTMLElements.info.innerHTML = this.formatToHTML(resultInfo);
    }
}
const setConfigColorInfo = (config) => {
    return new ColorInfoController(new ColorInfoService(config));
};

;// CONCATENATED MODULE: ./src/Marks/ColorInfo/ColorInfo.ts

const startColorInfo = (config) => {
    const colorInfo = setConfigColorInfo(config);
    $(document).bind('item_info', function (e, params) {
        const html = {
            info: document.querySelector('#info')
        };
        const { city } = params;
        colorInfo.init(html, city);
    });
};

;// CONCATENATED MODULE: ./src/Configs/sts/ColorInfo.config.ts
const colorInfoConfig = {
    vin: true,
    brand: false,
    color: true,
    carNumber: {
        type: 'check',
        cities: [
            'Хельсинки',
            'Белград',
            'Таллин',
            'Тарту',
            'Вильнюс',
            'Бухарест',
            'Ташкент',
            'Наманган',
            'Баку',
            'Минск',
            'Гомель',
            'Гродно',
            'Жодино',
            'Речица',
            'Борисов',
            'Могилев',
            'Витебск',
            'Бобруйск',
            'Брест',
            'Барановичи',
            'Орша',
            'Беларусь',
            'Солигорск',
            'Мозырь',
            'Слуцк',
            'Лида',
            'Кишинёв',
            'Рига',
            'Даугавпилс',
            'Лиепая',
            'Валмиера',
            'Вентспился',
            'Елгава',
            'Днепр',
            'Запорожье',
            'Киев',
            'Кривой Рог',
            'Львов',
            'Николаев',
            'Одесса',
            'Харьков',
            'Армавирская область',
            'Араратская область',
            'Ванадзор',
            'Горис',
            'Гюмри',
            'Ереван',
            'Капан',
            'Котайкская область',
            'Батуми',
            'Кутаиси',
            'Рустави',
            'Тбилиси',
            'Бишкек',
            'Ош',
            'Актау',
            'Актобе',
            'Алматы',
            'Астана',
            'Атырау',
            'Караганда',
            'Кокшетау',
            'Костанай',
            'Кызылорда',
            'Павлодар',
            'Петропавловск',
            'Семей',
            'Темиртау',
            'Тараз',
            'Туркестан',
            'Уральск',
            'Усть-Каменогорск',
            'Шымкент',
            'Экибастуз',
            'Жезказган',
            'Талдыкорган',
            'Тель-Авив'
        ],
        regions: [
            '01',
            '02',
            '102',
            '702',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '113',
            '14',
            '15',
            '16',
            '116',
            '716',
            '17',
            '18',
            '19',
            '20',
            '21',
            '121',
            '22',
            '122',
            '23',
            '93',
            '123',
            '193',
            '24',
            '124',
            '84',
            '88',
            '25',
            '125',
            '26',
            '126',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '134',
            '35',
            '36',
            '136',
            '37',
            '38',
            '138',
            '85',
            '39',
            '40',
            '41',
            '42',
            '142',
            '43',
            '44',
            '45',
            '46',
            '47',
            '147',
            '48',
            '49',
            '50',
            '90',
            '150',
            '190',
            '750',
            '790',
            '51',
            '52',
            '152',
            '53',
            '54',
            '154',
            '55',
            '155',
            '56',
            '156',
            '57',
            '58',
            '59',
            '159',
            '81',
            '60',
            '61',
            '161',
            '761',
            '62',
            '63',
            '163',
            '763',
            '64',
            '164',
            '65',
            '66',
            '96',
            '196',
            '67',
            '68',
            '69',
            '70',
            '71',
            '72',
            '73',
            '173',
            '74',
            '174',
            '774',
            '75',
            '80',
            '76',
            '77',
            '97',
            '99',
            '177',
            '197',
            '777',
            '799',
            '797',
            '199',
            '78',
            '178',
            '98',
            '198',
            '79',
            '82',
            '83',
            '86',
            '186',
            '87',
            '89',
            '92',
            '94',
            '95',
            '80',
            '81',
            '84',
            '88'
        ]
    },
    cities: ['Шымкент']
};

;// CONCATENATED MODULE: ./src/Marks/Sla/Sla.service.ts
class SlaService {
    constructor() {
        this.normalizeDateCase = (str) => {
            const [date, time] = str.split(' ');
            if (date.includes('Сегодня')) {
                const normalizedDateArray = new Date()
                    .toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })
                    .split('.')
                    .reverse()
                    .join('-');
                return new Date(`${normalizedDateArray} ${time}`);
            }
            const normalizedDatePad = date.split('.').reverse().join('-').padStart(10, '20');
            return new Date(`${normalizedDatePad} ${time}`);
        };
        this.normalizeDateNow = () => {
            const date = new Date()
                .toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })
                .split('.')
                .reverse()
                .join('-');
            const time = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' });
            return new Date(`${date} ${time}`);
        };
        this.calcSla = (str) => {
            const dateNow = this.normalizeDateNow().getTime();
            const dateCase = this.normalizeDateCase(str).getTime();
            const day = Math.floor(Math.floor(dateNow - dateCase) / 86400000);
            const hour = Math.floor(((dateNow - (dateCase % 31536000000)) % 86400000) / 3600000);
            const min = Math.floor((((dateNow - (dateCase % 31536000000)) % 86400000) % 3600000) / 60000);
            const sec = Math.floor(((((dateNow - (dateCase % 31536000000)) % 86400000) % 3600000) % 60000) / 1000);
            return [day, hour, min, sec];
        };
    }
}

;// CONCATENATED MODULE: ./src/Marks/Sla/Sla.controller.ts

class SlaController {
    constructor(_sla, sec) {
        this._sla = _sla;
        this.sec = sec;
        this.htmlElements = {
            table: null,
            firstCase: null,
            category: null,
            order: null,
            tree: null
        };
        this.createdHtmlElements = {
            mark: document.createElement('div')
        };
        this.updateHTML = () => {
            const pattern = `SLA в очереди ${this.htmlElements.category.selectedOptions[0].dataset.text}<br>`;
            if (this.htmlElements.order.value === 'descending') {
                const error = `установи "сначала старые`;
                return `${pattern}${error}`;
            }
            if (this.htmlElements.table === null) {
                const error = `нет анкет`;
                return `${pattern}${error}`;
            }
            const [day, hour, min, sec] = this._sla.calcSla(this.htmlElements.firstCase.textContent);
            const sla = `${day} ${this.declOfNum(day, ['день', 'дня', 'дней'])}, ${hour} ${this.declOfNum(hour, ['час', 'часа', 'часов'])}, ${min} ${this.declOfNum(min, ['минута', 'минуты', 'минут'])}, ${sec} ${this.declOfNum(sec, [
                'секунда',
                'секунды',
                'секунд'
            ])}`;
            return `${pattern}${sla}`;
        };
        this.init = (html) => {
            this.htmlElements = html;
            this.createdHtmlElements.mark.setAttribute('style', `color: #fff; background-color: #d9534f; padding: 0 10px; border-radius: 4px; margin-bottom: 10px; cursor: pointer;`);
            this.createdHtmlElements.mark.classList.add('markSla');
            this.htmlElements.tree.before(this.createdHtmlElements.mark);
            this.htmlElements.order.addEventListener('change', () => this.update());
            this.htmlElements.category.addEventListener('change', () => this.update());
            this.createdHtmlElements.mark.addEventListener('click', () => {
                const g = document.getElementById('category').selectedOptions[0];
                const url = document.location.href;
                const t = this._sla.calcSla(this.htmlElements.firstCase.textContent);
                let res = g.textContent;
                let tr = 'ДКК';
                if (url.includes('priority')) {
                    tr = 'ДКК1';
                }
                if (url.includes('branding')) {
                    tr = 'Брендинг';
                }
                if (url.includes('chair')) {
                    tr = 'Кресла';
                }
                if (url.includes('booster')) {
                    tr = 'Бустеры';
                }
                if (g.value === 'DkkTariffsBlock' || g.value === 'DkkPriorityTariffsBlock') {
                    res = `Тариф ${g.textContent}`;
                }
                if (t.length < 1) {
                    return navigator.clipboard.writeText(`${tr} ${res} 0h0m\n`);
                }
                if (t[0] > 0) {
                    return navigator.clipboard.writeText(`${tr} ${res} ${t[0]}d${t[1]}h${t[2]}m\n`);
                }
                if (t[2] < 1) {
                    return navigator.clipboard.writeText(`${tr} ${res} <${t[1]}h1m\n`);
                }
                return navigator.clipboard.writeText(`${tr} ${res} ${t[1]}h${t[2]}m\n`);
            });
            this.update();
        };
        this.update = () => {
            this.createdHtmlElements.mark.innerHTML = ``;
            if (this.timer || this.interval) {
                clearTimeout(this.timer);
                clearInterval(this.interval);
            }
            this.timer = setTimeout(() => {
                this.htmlElements.table = document.querySelector('tr[data-status="0"]');
                this.htmlElements.firstCase =
                    this.htmlElements.table !== null
                        ? document.querySelector('tr[data-status="0"]').querySelector('.content')
                        : null;
                this.createdHtmlElements.mark.innerHTML = this.updateHTML();
            }, 1000);
            this.interval = setInterval(() => {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.htmlElements.table = document.querySelector('tr[data-status="0"]');
                this.htmlElements.firstCase =
                    this.htmlElements.table !== null
                        ? document.querySelector('tr[data-status="0"]').querySelector('.content')
                        : null;
                this.createdHtmlElements.mark.innerHTML = this.updateHTML();
            }, this.sec * 1000);
        };
    }
    declOfNum(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
    }
}
const Sla = new SlaController(new SlaService(), 30);

;// CONCATENATED MODULE: ./src/Marks/Sla/Sla.ts

const htmlElements = {
    table: null,
    firstCase: null,
    tree: document.querySelector('.vspan0'),
    order: document.querySelector('#pool-order'),
    category: document.querySelector('#category')
};
Sla.init(htmlElements);

// EXTERNAL MODULE: ./src/other/autoSaveSts/autoSaveSts.js
var autoSaveSts = __webpack_require__(523);
;// CONCATENATED MODULE: ./src/Directions/sts/index.ts




startColorInfo(colorInfoConfig);

})();

/******/ })()
;