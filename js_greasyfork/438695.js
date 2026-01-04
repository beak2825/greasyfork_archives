// ==UserScript==
// @name         Bundle для проверок Бренд
// @version      1.0.1
// @description  Общий бандл для проверок в очереди Бренд
// @author       L
// @include	https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @grant none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/438695/Bundle%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%91%D1%80%D0%B5%D0%BD%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/438695/Bundle%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%91%D1%80%D0%B5%D0%BD%D0%B4.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 797:
/***/ (() => {

const paramsInfo = {
    carInfo: '',
    carYear: '',
    carNumber: ''
};
function updateInfo(e, params) {
    if (params.car_number) {
        paramsInfo.carNumber = params.car_number;
    }
    paramsInfo.carInfo = params.car.match(/([\s\S]+)\s\[[\s\S]*/)[1];
    paramsInfo.carYear = params.car_year;
}
$(document).bind('item_info', updateInfo);
function openUrl(url = '') {
    window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=300,width=900,height=400');
}
function searchModel(info) {
    const modelSplit = info.split(' ');
    const { carYear: year } = paramsInfo;
    const model = modelSplit[1].replace('-', '_').replace("'", '');
    if (modelSplit.includes('Mercedes-Benz')) {
        return openUrl(`https://auto.ru/catalog/cars/mercedes/${model}/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.includes('ЗАЗ')) {
        return openUrl(`https://auto.ru/catalog/cars/zaz/${model}/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.includes(`Symbol`)) {
        return openUrl(`https://auto.ru/catalog/cars/renault/clio_symbol/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.includes('H-1')) {
        return openUrl(`https://auto.ru/catalog/cars/hyundai/h_1_starex/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.includes('Chery')) {
        return openUrl(`https://auto.ru/catalog/cars/chery/${model}/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.includes('C4') && modelSplit.includes('Grand')) {
        return openUrl(`https://auto.ru/catalog/cars/citroen/c4_picasso/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.includes('LADA')) {
        if (model.includes('Priora')) {
            return openUrl(`https://auto.ru/catalog/cars/vaz/2170/?year_from=${year}&year_to=${year}`);
        }
        return openUrl(`https://auto.ru/catalog/cars/vaz/${model}/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.includes('ГАЗ') && modelSplit.includes('Volga')) {
        return openUrl(`https://auto.ru/catalog/cars/gaz/volga_siber/?year_from=${year}&year_to=${year}`);
    }
    if (modelSplit.length > 2) {
        return openUrl(`https://auto.ru/catalog/cars/${modelSplit[0]}/${modelSplit.join('_')}/?year_from=${year}&year_to=${year}`);
    }
    return openUrl(`https://auto.ru/catalog/cars/${modelSplit[0]}/${model}/?year_from=${year}&year_to=${year}`);
}
function handlerBtn(id) {
    const { carNumber: number, carInfo } = paramsInfo;
    console.log(paramsInfo);
    switch (id) {
        case 'av-c':
            return openUrl(`https://avtocod.ru/proverkaavto/${number}`);
        case 'av-r':
            return openUrl(`https://avtoraport.ru/avtoproverka/${number}`);
        case 'av-b':
            return openUrl(`https://b2b.avtocod.ru/reports?limit=5&search=${number}&dateStart=&dateEnd=&status=`);
        case 'dk-k':
            return openUrl(`https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkk&limit=100&number=${number}`);
        case 'dk-b':
            return openUrl(`https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=branding&limit=100&number=${number}`);
        case 'mos':
            return openUrl(`https://mtdi.mosreg.ru/deyatelnost/celevye-programmy/taksi1/proverka-razresheniya-na-rabotu-taksi?number=${number}&name=&id=&region=ALL`);
        case 'au-r':
            return searchModel(carInfo);
        default:
            return new Error('error in btns');
    }
}
function createBtnInInfo({ color, id, title }) {
    const btn = document.createElement('button');
    btn.setAttribute('style', `display: inline-block; margin: 0 10px 0 0; padding: 0 3px; border-radius: 3px; cursor: pointer; background-color: ${color}`);
    btn.setAttribute('id', id);
    btn.textContent = title;
    btn.addEventListener('click', () => handlerBtn(id));
    return btn;
}
function createContainerBtns(root, btns) {
    const wrapper = document.createElement('div');
    const br = document.createElement('br');
    wrapper.append(br);
    wrapper.setAttribute('style', `display: inline-block';`);
    btns.forEach((btn) => {
        wrapper.append(createBtnInInfo(btn));
    });
    root.append(wrapper);
}
const btnsInInfo = [
    {
        id: 'av-r',
        title: 'рапорт',
        color: 'rgba(255, 188, 0, 0.71)'
    },
    {
        id: 'mos',
        title: 'mosreg',
        color: 'rgba(205, 54, 51, 0.71)'
    },
    {
        id: 'au-r',
        title: 'авто.ру',
        color: 'rgba(219, 55, 39, 0.71)'
    },
    {
        id: 'dk-k',
        title: 'в дкк',
        color: 'rgba(100, 100, 255, 0.71)'
    },
    {
        id: 'dk-b',
        title: 'в дкб',
        color: 'rgba(150, 100, 50, 0.71)'
    },
    {
        id: 'av-b',
        title: 'автокод b2b',
        color: 'rgba(47, 117, 181, 0.71)'
    },
    {
        id: 'av-c',
        title: 'Поиск г/н',
        color: 'rgba(43, 190, 226, 0.71)'
    }
];
createContainerBtns(document.querySelector('.check-thumb-number'), btnsInInfo);


/***/ }),

/***/ 435:
/***/ (() => {

// eslint-disable-next-line no-undef
$(document).bind('select_item', function (e, params) {
  const btnOK = document.querySelector('#btn-ok');
  setTimeout(() => {
    btnOK.disabled = true;
  }, 10);
  setTimeout(() => {
    btnOK.disabled = false;
  }, 2000);
});


/***/ }),

/***/ 893:
/***/ (() => {

const labelAllStockers = document.getElementById('btn-lightbox').closest('.check-thumb-number');
const info = document.getElementById('info').closest('.check-thumb-number');

info.append(labelAllStockers);
labelAllStockers.style.position = 'static';


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

;// CONCATENATED MODULE: ./src/other/ColorTree/colorTree.ts
const startColorTree = (configColor) => {
    const { exam } = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    console.log(`Загружена подсветка очереди ${exam}`);
    const categoryLine = document.getElementById('category');
    const value = localStorage.getItem(`${exam}.localLine`);
    if (value) {
        categoryLine.value = JSON.parse(value);
        setTimeout(() => window.update(), 1000);
    }
    categoryLine.addEventListener('change', () => localStorage.setItem(`${exam}.localLine`, JSON.stringify(categoryLine.value)));
    let cssStyle = `background: -webkit-gradient(linear, left top, left bottom,`;
    configColor.forEach((el, idx) => {
        if (idx + 1 !== configColor.length) {
            cssStyle += `color-stop(${el.percent}%, ${el.color}), color-stop(${el.percent}%, ${el.color}), color-stop(${el.percent}%, ${configColor[idx + 1].color}),`;
            return;
        }
        cssStyle += `color-stop(${el.percent}%, ${el.color}),color-stop(${el.percent}%, ${el.color}),color-stop(${el.percent}%, ${el.color}),`;
    });
    const updateColorTree = () => {
        const dataGridContent = document.querySelector('.datagrid-content');
        dataGridContent.setAttribute('style', `${cssStyle.slice(0, -1)})`);
    };
    setInterval(() => {
        updateColorTree();
    }, 1000);
};

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

;// CONCATENATED MODULE: ./src/other/PulloutPanelTags/PulloutPanelTags.ts
class PulloutPanelTags {
    constructor(_config) {
        this._config = _config;
        this.createdHtmlElements = {
            style: document.createElement('style'),
            container: this.createContainer(),
            wrapper: document.createElement('div'),
            list: this._config.map((el) => this.createSpanElement(el))
        };
    }
    createSpanElement(element) {
        const { text, value, color } = element;
        const span = document.createElement('span');
        span.className = `js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-${color}`;
        span.setAttribute('value', value);
        span.textContent = text;
        span.addEventListener('click', function () {
            document.querySelector(`input[value="${this.getAttribute('value')}"]`)
                .closest('a')
                .click();
            this.classList.toggle('selected');
        });
        return span;
    }
    pressTags(value) {
        document.querySelector(`input[value="${value}"]`).closest('a').click();
        this.updateSelectedTags();
    }
    createContainer() {
        const container = document.createElement('div');
        container.classList.add('fast_marks_panel', 'opened');
        container.addEventListener('click', (e) => {
            const { target } = e;
            if (target.classList.contains('fast_marks_panel')) {
                container.classList.toggle('opened');
                this.createdHtmlElements.wrapper.classList.toggle('opened');
            }
        });
        return container;
    }
    updateSelectedTags() {
        this.createdHtmlElements.list.map((el) => el.classList.remove('selected'));
        document.querySelectorAll('ul.dropdown-menu.dropdown-menu-tags>li>a>input:checked').forEach((el) => {
            this.createdHtmlElements.list.map((span) => {
                if (span.getAttribute('value') === el.value) {
                    span.classList.add('selected');
                    return span;
                }
                return span;
            });
        });
    }
    init() {
        this.createdHtmlElements.style.innerHTML = `div.fast_marks_panel{position: absolute; top: 0px; right: 0; background: #ff0000b0; width: 15px; height: 15px; font: 14px Arial; color: #fff; text-align: center; padding: 5px; cursor: pointer; -webkit-transition-duration: 0.3s; -moz-transition-duration: 0.3s; -o-transition-duration: 0.3s; transition-duration: 0.3s; -webkit-border-radius: 5px 0 0 5px; -moz-border-radius: 5px 0 0 5px; border-radius: 5px 0 0 5px;}
.fast_marks_container{position: absolute;top: 15px;right: -180px;background-color: #2b2d307a;color: #000;width: 160px;padding: 10px;text-align: center;-webkit-transition-duration: 0.3s;-moz-transition-duration: 0.3s;-o-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-border-radius: 0 5px 5px 0;-moz-border-radius: 0 5px 5px 0;border-radius: 0 5px 5px 0;}
.fast_marks_panel.opened {right: 0px; background: #ef707045;}
.fast_marks_container.opened {right: 0; opacity: 0.3;}
.fast_marks_container.opened:hover{opacity: 0.8;}
.fast_marks_container>span{margin: 0 0 10px 0}
.fast_marks_container>.js-tag-label.dkk-tag.dkk-tag-gray{display: block; min-height: 35px; opacity: 0.8; }
.fast-tag{cursor: pointer}
.fast-tag-green.selected{background-color: #29d227;}
.fast-tag-red.selected{background-color: #ff1919;}
.check-thumb-number>input{width: 30px; height: 30px; margin: 0;}
div.check-thumb-number{width: 250px; font-size: 21px}`;
        document.head.append(this.createdHtmlElements.style);
        this.createdHtmlElements.wrapper.classList.add('fast_marks_container', 'opened');
        document.querySelector('div#content').append(this.createdHtmlElements.container);
        this.createdHtmlElements.container.append(this.createdHtmlElements.wrapper);
        this.createdHtmlElements.list.forEach((el) => this.createdHtmlElements.wrapper.append(el));
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName !== 'TEXTAREA' &&
                document.activeElement.tagName !== 'INPUT' &&
                !document.activeElement.matches('div.modal')) {
                switch (e.code) {
                    case 'Semicolon':
                        return document.querySelector('#btn-lightbox').click();
                    case 'Backquote':
                        return document.querySelector('#btn-sticker').click();
                }
                if (e.shiftKey) {
                    switch (e.code) {
                        case 'KeyA':
                            return this.pressTags('magnity');
                        case 'KeyS':
                            return this.pressTags('poddelnoe_brandirovanie');
                        case 'KeyQ':
                            return this.pressTags('phone');
                        case 'KeyW':
                            return this.pressTags('phone_karlash');
                    }
                }
                if (e.ctrlKey) {
                    switch (e.code) {
                        case 'keyZ':
                            return this.pressTags('yandex');
                        case 'keyX':
                            return this.pressTags('uber');
                        case 'KeyB':
                            return this.pressTags('yandex_go');
                        case 'KeyM':
                            return this.pressTags('brand_vezet');
                        case 'Period':
                            return document.getElementById('btn-block').click();
                        case 'Slash':
                            return document.getElementById('btn-dkb-minor-remarks').click();
                    }
                }
            }
        });
    }
}
const startPulloutPanelTags = (config) => {
    const pulloutPanelTags = new PulloutPanelTags(config);
    pulloutPanelTags.init();
    $(document).bind('item_info', () => pulloutPanelTags.updateSelectedTags());
};

;// CONCATENATED MODULE: ./src/Configs/brand/ColorTree.config.ts
const colorTreeConfig = [
    { color: '#e6399b', percent: 4 },
    { color: '#00ffff', percent: 8 },
    { color: '#ff5640', percent: 13.75 },
    { color: '#effd49', percent: 19.5 },
    { color: '#ff7f50', percent: 25.25 },
    { color: '#9b30ff', percent: 31 },
    { color: '#35d699', percent: 36.75 },
    { color: '#f6b26b', percent: 42.5 },
    { color: '#4813f2', percent: 48.25 },
    { color: '#f7d6b4', percent: 54 },
    { color: '#e262fa', percent: 59.75 },
    { color: '#b0c4de', percent: 65.5 },
    { color: '#18ff26', percent: 71.25 },
    { color: '#ff80d2', percent: 77 },
    { color: '#8498ff', percent: 82.75 },
    { color: '#6b8e23', percent: 88.5 },
    { color: '#fff', percent: 100 }
];

;// CONCATENATED MODULE: ./src/Configs/brand/ColorInfo.config.ts
const colorInfoConfig = {
    vin: false,
    brand: true,
    color: true,
    carNumber: {
        type: 'all',
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
    cities: []
};

;// CONCATENATED MODULE: ./src/Configs/brand/PulloutPanelTags.config.ts
const pulloutPanelTagsConfig = [
    {
        color: 'green',
        text: 'Шашечки на кузове',
        value: 'checkers_car'
    },
    {
        color: 'green',
        text: 'Шашечки на крыше',
        value: 'checkers_roof'
    },
    {
        color: 'red',
        text: 'Год выпуска ТС',
        value: 'god_vypuska'
    },
    {
        color: 'red',
        text: 'Магниты',
        value: 'magnity'
    },
    {
        color: 'red',
        text: 'Недопуск — классификатор',
        value: 'ne_prohodyat_po_classifikatoru'
    },
    {
        color: 'green',
        text: 'Убер',
        value: 'uber'
    },
    {
        color: 'green',
        text: 'Старый Убер',
        value: 'oldbrand_uber'
    },
    {
        color: 'green',
        text: 'Яндекс',
        value: 'yandex'
    },
    {
        color: 'green',
        text: 'Яндекс GO',
        value: 'yandex_go'
    },
    {
        color: 'red',
        text: 'Везет',
        value: 'brand_vezet'
    },
    {
        color: 'red',
        text: 'Старый брендинг',
        value: 'oldbrand'
    },
    {
        color: 'green',
        text: 'Телефон для вызова',
        value: 'phone'
    },
    {
        color: 'red',
        text: 'Поддельное брендирование',
        value: 'poddelnoe_brandirovanie'
    },
    {
        color: 'green',
        text: 'Lightbox: Новый',
        value: 'lightbox_new'
    },
    {
        color: 'green',
        text: 'Lightbox: Цветной',
        value: 'lightbox_new_color'
    }
];

;// CONCATENATED MODULE: ./src/Marks/CountCase/CountCaseHistory.ts
class CountCaseHistory {
    constructor(_direction) {
        this._direction = _direction;
        this.history = this.loadHistoryFromLocalStorage() || [];
        this.props = {
            overlayWrap: this.createOverlayWrap(),
            wrap: this.createWrapper(),
            table: this.createTable(),
            buttonHistory: this.createButtonHistory(),
            visibleWrap: false,
            dataFromParams: ''
        };
    }
    saveHistoryToLocalStorage() {
        window.localStorage.setItem(`history-${this._direction}`, JSON.stringify(this.history));
    }
    loadHistoryFromLocalStorage() {
        return JSON.parse(window.localStorage.getItem(`history-${this._direction}`));
    }
    createOverlayWrap() {
        const overlay = document.createElement('div');
        overlay.setAttribute('style', `position: fixed; display: none; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 99998; cursor: pointer;`);
        overlay.addEventListener('click', () => this.props.wrap.dispatchEvent(new Event('toggleVisibility')));
        return overlay;
    }
    createWrapper() {
        const wrap = document.createElement('div');
        wrap.setAttribute('style', `display: flex;
        flex-direction: column;
        position: absolute;
        top: 10px;
        right: 10px;
        width: 250px;
        height: 98vh;
        background-color: #fff;
        z-index: 99999;
        border-radius: 20px;
        box-shadow: 0px 0px 13px 4px black;
        transform: translateX(calc(100% + 10px));
        transition: all .8s;`);
        wrap.addEventListener('toggleVisibility', () => {
            if (this.props.visibleWrap) {
                this.props.visibleWrap = false;
                wrap.style.transform = 'translateX(calc(100% + 10px))';
                this.props.overlayWrap.style.display = 'none';
                this.props.table.remove();
            }
            else {
                this.props.visibleWrap = true;
                wrap.style.transform = 'translateX(0)';
                this.props.overlayWrap.style.display = 'block';
                const newTable = this.createTable();
                this.props.table = newTable;
                this.props.wrap.append(newTable);
            }
        });
        return wrap;
    }
    createTable() {
        const wrap = document.createElement('div');
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        thead.append(this.createHeadTable());
        tbody.append(...this.createBodyTable());
        table.append(thead, tbody);
        thead.setAttribute('style', `background-color: #000; color: #fff;`);
        wrap.className = 'datagrid datagrid-striped datagrid-vertical-top font12';
        wrap.setAttribute('style', `position: relative!important; margin: 5px; overflow-x: scroll;`);
        wrap.append(table);
        return wrap;
    }
    createHeadTable() {
        const tr = document.createElement('tr');
        const tHead = ['value', 'resolution'].map((item) => {
            const th = document.createElement('th');
            th.textContent = item;
            return th;
        });
        tr.append(...tHead);
        return tr;
    }
    createBodyTable() {
        return this.history.map((h) => {
            const tr = document.createElement('tr');
            tr.append(...Object.values(h).map((i) => {
                const td = document.createElement('td');
                td.textContent = i;
                return td;
            }));
            return tr;
        });
    }
    createButtonHistory() {
        const btn = document.createElement('span');
        btn.setAttribute('style', `cursor: pointer; padding: 5px; margin: 5px; display: inline-block;`);
        btn.textContent = '🧰';
        btn.addEventListener('click', () => this.props.wrap.dispatchEvent(new Event('toggleVisibility')));
        return btn;
    }
    createAvatar(avatar) {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.setAttribute('src', avatar.getAttribute('src'));
        div.setAttribute('style', `border-radius: 50%; border: 1px solid #000; width: fit-content; align-self: center; margin-top: 20px;`);
        img.setAttribute('style', `border-radius: 50%; `);
        div.append(img);
        return div;
    }
    initHistory(rootBtn, rootAvatar = document.querySelector('img.avatar')) {
        const avatar = this.createAvatar(rootAvatar);
        const h2 = document.createElement('h2');
        h2.textContent = this._direction;
        h2.setAttribute('style', `align-self: center;`);
        this.props.wrap.append(avatar, h2);
        rootBtn.append(this.props.buttonHistory);
        document.body.append(this.props.wrap, this.props.overlayWrap);
    }
    _setDataFromParams(data) {
        this.props.dataFromParams = data;
    }
    _updateHistory(key) {
        this.history.push({
            value: this.props.dataFromParams,
            resolution: key
        });
        this.saveHistoryToLocalStorage();
    }
    resetHistory() {
        this.history = [];
        this.saveHistoryToLocalStorage();
    }
}

;// CONCATENATED MODULE: ./src/Marks/CountCase/CountCaseNew.ts

class CountCase {
    constructor(btnsResolutions, direction) {
        this.btnsResolutions = btnsResolutions;
        this.direction = direction;
        this.initialState = {
            block: 0,
            ok: 0,
            blacklist: 0,
            remarks: 0
        };
        this._state = this.loadDataCountCaseFromLocalStorage() || this.initialState;
        this._counts = {
            total: null,
            spans: null
        };
        this._history = new CountCaseHistory(this.direction);
        this.createWrapperCountCase = () => {
            const wrap = document.createElement('div');
            wrap.setAttribute('style', `display: flex; flex-direction: row; justify-content: center;`);
            return wrap;
        };
    }
    loadDataCountCaseFromLocalStorage() {
        return JSON.parse(window.localStorage.getItem(`report-branding`));
    }
    saveDataCountCaseInLocalStorage() {
        window.localStorage.setItem('report-branding', JSON.stringify(this._state));
    }
    calcIdButton(button) {
        return button.getAttribute('id').split('-').at(-1);
    }
    createSpanCountCase(color, ...arg) {
        const span = document.createElement('span');
        span.textContent = '0';
        span.setAttribute('style', `border: 1px solid #000; padding: 0 3px; margin: 0; background-color: ${color}; ${arg.join('; ')}`);
        return span;
    }
    createResetBtnCountCase() {
        const span = document.createElement('span');
        span.textContent = '❌';
        span.setAttribute('style', `margin: 0 3px; align-self: center; cursor: pointer; display: none;`);
        span.addEventListener('click', () => this.resetState());
        return span;
    }
    createList() {
        const li = document.createElement('li');
        const totalCount = this.createWrapperCountCase();
        const spanCount = this.createWrapperCountCase();
        const btnResetCountCase = this.createResetBtnCountCase();
        const total = this.createSpanCountCase('#000', 'color: #fff', 'width: 100%', 'text-align: center');
        const spans = this.createSpansFromButtonTaxiResolution(this.btnsResolutions);
        li.setAttribute('style', 'margin: 3px 0');
        li.addEventListener('mouseover', () => {
            btnResetCountCase.style.display = 'block';
        });
        li.addEventListener('mouseout', () => {
            btnResetCountCase.style.display = 'none';
        });
        li.append(spanCount, totalCount);
        totalCount.append(total, btnResetCountCase);
        Object.values(spans).forEach((span) => spanCount.append(span));
        Object.assign(this._counts, {
            total,
            spans
        });
        return li;
    }
    resetState() {
        if (window.confirm('Очистить счетчик?')) {
            this._state = this.initialState;
            this.saveDataCountCaseInLocalStorage();
            this._history.resetHistory();
            this.updateHtml();
        }
    }
    initCountCase(root) {
        const { nav, avatar } = root;
        const li = this.createList();
        nav.append(li);
        this._history.initHistory(nav, avatar);
        this.updateHtml();
    }
    createSpansFromButtonTaxiResolution(buttons) {
        return buttons.reduce((x, y) => {
            return {
                ...x,
                [this.calcIdButton(y)]: this.createSpanCountCase(getComputedStyle(y).backgroundColor)
            };
        }, {});
    }
    updateHtml() {
        Object.keys(this._counts.spans).forEach((key) => {
            this._counts.spans[key].textContent = String(this._state[key]);
        });
        this._counts.total.textContent = Object.values(this._state)
            .reduce((x, y) => x + y)
            .toString();
    }
    updateState() {
        this._state[this._keyButton] += 1;
        this.saveDataCountCaseInLocalStorage();
    }
    update() {
        this.updateState();
        this._history._updateHistory(this._keyButton);
        this.updateHtml();
    }
    _setKey(key) {
        this._keyButton = this.calcIdButton(key);
    }
    _setDataFromParams(data) {
        this._history._setDataFromParams(data);
    }
}
function startCountCase(key) {
    const htmlElementsCountCase = {
        btnsResolution: [
            ...document.querySelectorAll('.container-filters>button')
        ],
        btnSendResolution: document.querySelector('#btn-error'),
        nav: document.querySelector('.nav.navbar-nav'),
        avatar: document.querySelector('img.avatar')
    };
    const { exam } = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const countCase = new CountCase(htmlElementsCountCase.btnsResolution, exam);
    countCase.initCountCase(htmlElementsCountCase);
    htmlElementsCountCase.btnsResolution.forEach((button) => {
        button.addEventListener('click', () => countCase._setKey(button));
        if (button.getAttribute('id') === 'btn-ok') {
            button.addEventListener('click', () => countCase.update());
        }
    });
    htmlElementsCountCase.btnSendResolution.addEventListener('click', () => countCase.update());
    $(document).on('item_info', function (e, params) {
        if (key === 'car') {
            const car = params[key]
                .match(/\((((?!\]).)*)\)$/)[1]
                .replace(/\s+/g, '')
                .toUpperCase();
            countCase._setDataFromParams(car);
        }
        else {
            countCase._setDataFromParams(params[key]);
        }
    });
}

;// CONCATENATED MODULE: ./src/Configs/GlobalUsefulLinks/GlobalUsefulLinks.config.ts
const GlobalConfigMainLinks = [
    { type: 'separator', divider: true },
    {
        type: 'link',
        link: 'https://docs.google.com/spreadsheets/d/1CqAV47t4APx-qKv310w4TKYJfU9Ki7zUClHWougfvQ0',
        name: '🏋️‍Кто? Где? Когда?'
    },
    {
        type: 'link',
        link: 'https://docs.google.com/spreadsheets/d/1UHhY-6axL1TPqpHrB29_qC-eIt2jt2iCbVarpNzVXQ4/edit#gid=2023740064',
        name: '🏋️‍Кто? Где? Когда? АНТИФРОД'
    },
    { type: 'separator', divider: true },
    {
        type: 'link',
        link: 'https://docs.google.com/spreadsheets/d/1OD0EUxIzN2e9bcIIy3s2ZhGHAKeqlunGIS3X4Du2V50/edit#gid=2000876873',
        name: '🚴‍График группы'
    },
    {
        type: 'link',
        link: 'https://docs.google.com/spreadsheets/d/1UHhY-6axL1TPqpHrB29_qC-eIt2jt2iCbVarpNzVXQ4/edit#gid=2023740064',
        name: '🚴‍График группы АНТИФРОД'
    },
    { type: 'separator', divider: true },
    {
        type: 'link',
        link: 'https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Dobro-pozhalovat-v-komandu-DK-JaT/',
        name: '🎉Команда Я.Такси'
    },
    {
        type: 'link',
        link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/',
        name: '🎉Команда Я.Такси АНТИФРОД'
    },
    { type: 'separator', divider: true },
    {
        type: 'link',
        link: 'https://wiki.yandex-team.ru/HR/KadrovyjjUchet/Otpusk/#raspredelenieotpuskapovyxodnymdnjam',
        name: '✈️Как пойти в отпуск'
    },
    {
        type: 'link',
        link: 'https://forms.yandex-team.ru/surveys/20940/',
        name: '📋Форма оформления отпуска'
    },
    {
        type: 'link',
        link: 'https://forms.yandex-team.ru/surveys/21689/',
        name: '📋Форма монетизации отпуска'
    },
    { type: 'separator', divider: true },
    {
        type: 'link',
        link: 'https://wiki.yandex-team.ru/HR/Spravka/',
        name: '📬Заказ справок(2НДФЛ и пр.)'
    },
    { type: 'link', link: 'https://mail.yandex-team.ru/', name: '💌Я.team Почта' },
    { type: 'separator', divider: true },
    {
        type: 'link',
        link: 'https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Ustanovka-rasshirenijj/',
        name: '🚀Установка скриптов'
    },
    { type: 'separator', divider: true },
    {
        type: 'link',
        link: 'https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/index.html',
        name: '🔐Иструкции по установке'
    },
    {
        type: 'link',
        link: 'https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/change-password-outstaff.html',
        name: '🔐Смена пароля Ниагара'
    },
    {
        type: 'link',
        link: 'https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/vpn-rutoken.html',
        name: '🔐Установка Рутокен'
    },
    {
        type: 'link',
        link: 'https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/catalinavpnrutoken.htm',
        name: '🔐Установка Рутокен: MacOS Catalina'
    }
];
const GlobalConfigUsefulLinks = {
    dkk: {
        direction: 'ДКК',
        links: [
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/newpajaDKK/',
                name: 'ДКК.📜Инструкция'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1be3SlWKLG3bJvaqVa05W5nfb9lpWQm39VPwWK3S11fY/edit#gid=0',
                name: 'ДКК.🚘Стороннее брендирование'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/105n_r5-vZNYPEnj6aZN6hlaPDhtCyjcIFqJekns-jns/edit#gid=1434986116',
                name: 'ДКК.📝Шаблоны'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1gmzDLI9Wpz_0THrukfRSEP-90JQBZkNkAIlpckZd2u4/edit#gid=588237143',
                name: 'ДКК.📝Шаблоны МО'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report',
                name: 'ДКК.🧐Статфэйс'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Rezultaty-moderacijj-gruppy-DK/#gruppadkk',
                name: 'ДКК.🔮Модерация'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1iDSP4fP3A1TB8vEZcUGrbNZktW6PzfhIt6g7VAGq8pw/edit#gid=4147072',
                name: 'ДКК.🤨Оспорь модератора'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1WUn-rB98h4B5APj4m5GmYXwX6-BmB4K8J7lxNKD7bVg/edit?userstoinvite=kristina.strom1991@gmail.com&ts=5d8b67c0#gid=0',
                name: 'ДКК.🤨Оспорь модератора МО'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1Iv9Vif-rT43mfErUprxev-0P84JW0mIoi54Uo2667y0/edit#gid=643648608',
                name: 'ДКК.🚧Сводная'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1lJcxEMXXLUIWX-vRU87q4fHK-393XFs7agFdWtUtf7s/edit#gid=1954777152',
                name: 'ДКК.🚧Сводная МО'
            },
            {
                type: 'separator',
                divider: true
            },
            { type: 'link', link: 'tg://resolve?domain=kigoshina', name: 'ДКК.✉️Игошина Ксения' }
        ]
    },
    dkvu: {
        direction: 'ДКВУ',
        links: [
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/ocheredi/%D0%A0%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-%D0%94%D0%9A%D0%92%D0%A3/',
                name: 'ДКВУ.📜Инструкция'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/Quality/%D0%93%D1%80%D1%83%D0%BF%D0%BF%D0%B0-%D0%B4%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8F-%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0-%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81.%D0%A2%D0%B0%D0%BA%D1%81%D0%B8/%D0%AD%D0%BD%D1%86%D0%B8%D0%BA%D0%BB%D0%BE%D0%BF%D0%B5%D0%B4%D0%B8%D1%8F-%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D1%85-%D1%83%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D0%B5%D1%80%D0%B5%D0%BD%D0%B8%D0%B9/',
                name: 'ДКВУ.🔖Энциклопедия ВУ'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/u/',
                name: 'ДКВУ.🗑️Поддельные ВУ'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/BUXAREST/',
                name: 'ДКВУ.💎Бухарес'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1fOELnScMSthfDX_8jfUiFOed-VsWfi2XKf3fvWRpack/edit?pli=1#gid=488560279',
                name: 'ДКВУ.📝Шаблоны'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1fOELnScMSthfDX_8jfUiFOed-VsWfi2XKf3fvWRpack/edit?pli=1#gid=1873057603',
                name: 'ДКВУ.📝Шаблоны Бухареста'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=DKVU&qc_type=_total_&qc_type=dkvu_block&qc_type=dkvu_invite&qc_type=dkvu_regular&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&_period_distance=1',
                name: 'ДКВУ.🧐Статфэйс'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/moderacija/',
                name: 'ДКВУ.🔮Модерация'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1RrjEs8oV0nu0gwvMCsgNxUeHMtkVth8xzPRl2VqCVgE/edit#gid=0',
                name: 'ДКВУ.🤨Оспорь модератора<'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1axLBjr_5sWMqvN7meanTprxHfzjo7o-65sdPP6CpxpY/edit#gid=0',
                name: 'ДКВУ.🍔🚽🛏️График обедов'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1vvFUumbEziG8vG02yYK6Byq3SRPAAJOnEAXPhrMHpJ4/edit#gid=1444237713',
                name: 'ДКВУ.🔧Подработка'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'tg://resolve?domain=rozaliyaja',
                name: 'ДКВУ.✉️Атласова Роза'
            }
        ]
    },
    sts: {
        direction: 'СТС',
        links: [
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/STS/',
                name: 'СТС.📜Инструкция'
            },
            {
                type: 'link',
                link: 'https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=sts&qc_type=sts_block&qc_type=sts_city&qc_type=sts_city_level&qc_type=sts_country&qc_type=sts_invite&qc_type=sts_regular&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&sort_field=assessor_login&sort_reverse=&_period_distance=1',
                name: 'СТС.🧐Статфэйс'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/moderacija/#gruppasts',
                name: 'СТС.🔮Модерация'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1Xr-tQBTUQ0Y5Jx6C3dD1ozmU3_IIPs6szqZuUO_oZyQ/',
                name: 'СТС.🤨Оспорь модератора'
            },
            {
                type: 'link',
                link: 'https://b2b.avtocod.ru/login',
                name: 'СТС.🚧Автокод В2В'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'tg://resolve?domain=Nayatsoy',
                name: 'СТС.✉️Анастасия Цой'
            }
        ]
    },
    branding: {
        direction: 'ДКБ',
        links: [
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/quality/gruppa-distancionnogo-kontrolja-kachestva-jandeks.taksi/dkb-2.0/proverka-stikerov/',
                name: 'ДКБ.📜Инструкция'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1CODtCRbptFqangR65boN3Hed7KVImWlVyCjsE5J3Ow0/edit?pli=1#gid=135251859',
                name: 'ДКБ.📝Шаблоны'
            },
            {
                type: 'link',
                link: 'https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=DKB+booster&qc_type=DKB+chair&qc_type=branding&qc_type=branding_country&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&sort_field=qc_ids&sort_reverse=1&ncrnd=7571&_period_distance=1',
                name: 'ДКБ.🧐Статфэйс'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Rezultaty-moderacijj-gruppy-DK/#gruppadkb',
                name: 'ДКБ.🔮Модерация'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'tg://resolve?domain=@Romanova_Dariya',
                name: 'ДКБ.✉️Дарья Романова'
            }
        ]
    },
    dkp: {
        direction: 'ДКП',
        links: [
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/ocheredi/dkp/',
                name: 'ДКП.📜Инструкция'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/1pDKj4AVsRBCWjjQuPVclC4AR_sOR_s35KhjPdsqPuw4/edit#gid=526847230',
                name: 'ДКП.📝Шаблоны'
            },
            {
                type: 'link',
                link: 'https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=_in_table_&qc_type=identity&qc_type=identity_block&qc_type=identity_country&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&sort_field=assessor_login&sort_reverse',
                name: 'ДКП.🧐Статфэйс'
            },
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/moderacija/',
                name: 'ДКП.🔮Модерация'
            },
            {
                type: 'link',
                link: 'https://docs.google.com/spreadsheets/d/16HD_c-suVbXhnLh1bhyQdTTxoYfZibtxY4uDk-YLY8U/edit#gid=0',
                name: 'ДКП.🤨Оспорь модератора'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'tg://resolve?domain=RoyalS94',
                name: 'ДКП.✉️Мария Ву'
            }
        ]
    },
    bio: {
        direction: 'Биометрия',
        links: [
            {
                type: 'link',
                link: 'https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/ocheredi/biometrija/',
                name: 'Биометрия.📜Инструкция'
            },
            {
                type: 'separator',
                divider: true
            },
            {
                type: 'link',
                link: 'https://yang.yandex-team.ru/signup',
                name: 'Янг.🚀Регистрация в Янге'
            },
            {
                type: 'link',
                link: 'https://yang.yandex-team.ru/tasks',
                name: 'Янг.⚙️Таски'
            }
        ]
    }
};

;// CONCATENATED MODULE: ./src/other/UsefulLinks/UsefulLinks.ts

const navBar = document.querySelector('.nav');
const newList = document.createElement('li');
const menuList = document.createElement('ul');
navBar.append(newList);
newList.classList.add('dropdown');
menuList.classList.add('dropdown-menu');
navBar.append(menuList);
const list = Object.keys(GlobalConfigUsefulLinks)
    .map((key) => `<li><a href="" target="_blank" id="${key}-dropright">${GlobalConfigUsefulLinks[key].direction}<span style = "float: right">▶</span></a></li>`)
    .join('');
newList.innerHTML = `<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">Полезные ссылки<span class="caret"></span></a>
<ul class="dropdown-menu">
${list}
${GlobalConfigMainLinks.map((el) => {
    if (el.type === 'link') {
        return `<li><a href="${el.link}" target="_blank">${el.name}</a></li>`;
    }
    return `<li role="separator" class="divider"></li>`;
}).join('')}
</ul>`;
const createMenu = (key) => {
    return GlobalConfigUsefulLinks[key].links
        .map((item) => {
        if (item.type === 'link') {
            return `<li><a href="${item.link}" target="_blank">${item.name}</a></li>`;
        }
        return `<li role="separator" class="divider"></li>`;
    })
        .join('');
};
function dropMenu(el, depart) {
    const positionDropRight = el.getBoundingClientRect();
    const positionList = newList.getBoundingClientRect();
    menuList.innerHTML = depart;
    menuList.setAttribute('style', `display: block; left: ${positionDropRight.left + positionDropRight.width}px; right: ${positionList.x - positionList.width}px; top: ${positionDropRight.y}px; width: 300px;`);
}
const offMenu = () => {
    menuList.style.display = 'none';
};
function blockEvent(el, html) {
    document.getElementById(el).addEventListener('click', (event) => event.preventDefault());
    document.getElementById(el).addEventListener('mouseover', function () {
        dropMenu(this, html);
    });
    document.getElementById(el).addEventListener('mouseout', offMenu);
}
Object.keys(GlobalConfigUsefulLinks).forEach((key) => blockEvent(`${key}-dropright`, createMenu(key)));
menuList.addEventListener('mouseover', () => {
    menuList.style.display = 'block';
});
menuList.addEventListener('mouseout', () => {
    menuList.style.display = 'none';
});

// EXTERNAL MODULE: ./src/other/brandShiftArrow/brandShiftArrow.js
var brandShiftArrow = __webpack_require__(893);
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

;// CONCATENATED MODULE: ./src/Configs/brand/BrandMarks.config.ts
const uberOld = [
    'Н947НА790',
    'Т656НВ790',
    'У231НВ790',
    'Т673НВ790',
    'Т660НВ790',
    'А715НЕ790',
    'А735НВ790',
    'М134ЕН790',
    'ХХ52977',
    'Х559ЕН790',
    'Х258ЕВ790',
    'Е263ЕТ790',
    'Х723ЕК790',
    'К783ЕУ790',
    'ТР14277',
    'Е081ОР750',
    'ОН80077',
    'К865АО750',
    'Е178ЕК123',
    'К421ТУ161',
    'О217УВ750',
    'Н761ОВ777',
    'В510ТУ750',
    'Р485ТУ750',
    'СА22777',
    'М591УА750',
    'Е756АН761',
    'С948МУ799',
    'В517ОТ750',
    'К641УВ750',
    'СА11777',
    'КО91377',
    'С790ЕТ39',
    'Е827ТУ750',
    'В132ОЕ750',
    'Е360ТУ750',
    'М842КР799',
    'Р062СК197',
    'ХХ73877',
    'У123НУ161',
    'Т751МА125',
    'ТР57077',
    'Х444ЕО750',
    'Х842ТА178',
    'ОН36077',
    'РС39277',
    'Х444ЕО750',
    'Т713ТО750',
    'К328ЕС750',
    'Н886МА799',
    'А557НА799',
    'Н349КЕ777',
    'У729ОВ750',
    'М115СН750',
    'В261УВ750',
    'В680МН154',
    'ХХ86277',
    'ХХ52877',
    'О306УН777',
    'Е980НУ134',
    'А829НХ190',
    'Т275ВН799',
    'Х705ХУ777',
    'Т759СТ777',
    'В253ВВ750',
    'ОС38877',
    'Н997УВ40',
    'ОР18977',
    'А573КО799',
    'СА11977',
    'А356КА799',
    'М540УА152',
    'К647ТУ197',
    'Е281НА154',
    'КМ19977',
    'Р169ТТ161',
    'У478МС799',
    'Х839ОС102',
    'Х428ТО750',
    'О203МТ799',
    'Е277УХ196',
    'М195ТЕ750',
    'О015ТР750',
    'НЕ58077',
    'К207ТР13',
    'К169СТ750',
    'Н081ТА750',
    'У344ТА750',
    'Х136КТ178',
    'Р061НВ58',
    'А613УВ750',
    'С165УУ178',
    'Е368ВТ799',
    'ХХ73777',
    'О417НУ40',
    'В088РО198',
    'Р764ХК777',
    'УО46077',
    'Х035СА174',
    'Р960АР750',
    'В151ММ150',
    'А290МУ134',
    'М698АТ799',
    'ТС30477',
    'ТС33577',
    'ТС36177',
    'ТС38577',
    'ХК44077',
    'ХК47977',
    'ХК50477',
    'ХК58177',
    'ХК74377',
    'ХК85677',
    'ХК86977',
    'ХК88177',
    'ХК88377',
    'ХК91677',
    'ХК92077',
    'ХК92577',
    'ХК92677',
    'ХК92877',
    'ХХ00377',
    'ХХ02177',
    'ХХ02377',
    'ХХ03977',
    'ХХ16877',
    'ХХ16977',
    'ХХ17477',
    'ХХ17777',
    'ХХ19277',
    'ХХ19777',
    'ХХ25077',
    'ХХ25477',
    'ХХ52277',
    'ХХ52677',
    'М868ТЕ750',
    'М751РК750',
    'ХХ66677',
    'Н169ВХ799',
    'МН73277',
    'М293ВК799',
    'Е887НЕ799',
    'Е111АЕ150',
    'Р800КЕ799',
    'АХ72699',
    'М125АО799',
    'Е111АЕ150',
    'ТР13677',
    'ТР17777',
    'ТР32477',
    'ТР55277',
    'ТР55377',
    'ТР56577',
    'ТР56877',
    'СА11777',
    'СА11877',
    'СА12277',
    'СА12377',
    'СА12777',
    'СА13377',
    'СА13777',
    'СА14277',
    'СА13177',
    'СА13277',
    'СА13877',
    'ОК41777',
    'Н761ОВ777',
    'У782ТО777',
    'У275ВХ799',
    'ММ83777',
    'А132СО777',
    'У008ТР750',
    'НЕ56777',
    'ОО18077',
    'О093МА799',
    'ТР13677',
    'ТР17777',
    'ТР32477',
    'ТР55277',
    'ТР55377',
    'ТР56577',
    'ТР56877',
    'СА11777',
    'СА11877',
    'СА12277',
    'СА12377',
    'СА12777',
    'СА13377',
    'СА13777',
    'СА14277',
    'ОЕ91977',
    'Е624УК777',
    'А132СО777',
    'С857ХО102',
    'В188МК716',
    'Х460ТО750',
    'М587АС799',
    'АО31699',
    'ХО17977',
    'С135ВМ39',
    'В790ТН750',
    'К549СН750',
    'В388АО750',
    'Е355ОВ124',
    'Е262СА777',
    'А428АА147',
    'М250ОМ777',
    'О915СН750',
    'Т897АУ799',
    'Т560МВ799',
    'Т897АУ799',
    'Т941ТК750',
    'Р061ОМ777',
    'О687ТЕ750',
    'Н794ТО750',
    'ОЕ87377',
    'Р061ОМ777',
    'М270ХА777',
    'ОО17677',
    'Р119МС799',
    'Т083ТА750',
    'А428АА147',
    'Н979ТМ750',
    'Т550ЕВ799',
    'ХХ40777',
    'О442УВ750',
    'АМ11699',
    'О963КУ750',
    'В857МУ197',
    'С914МУ799',
    'К491МВ799',
    'Р061ОМ777',
    'Н020НЕ799',
    'А425ОА177',
    'У206ОК799',
    'А068ОА799',
    'А122ОА799',
    'С334НУ799',
    'А735РК750',
    'НЕ56877',
    'Р404ТУ750',
    'Т120ОК750',
    'О442УВ750',
    'О830КУ799',
    'МО05377',
    'Е131УК750',
    'МО36377',
    'О671СХ750',
    'В149ТА62',
    'МТ73577',
    'Х798МВ750',
    'О210УВ750',
    'С446ЕЕ39',
    'К339АО799',
    'А612ВМ799',
    'О268КТ799',
    'УВ85877',
    'УО46077',
    'АУ79199',
    'Р212ВО799',
    'Н358НК154',
    'А367РН750',
    'Н802КН750',
    'В986ТР750',
    'О250НХ750',
    'НЕ58677',
    'НЕ76177',
    'АН82177',
    'НВ01277',
    'ОС38377',
    'ХХ67377',
    'ХХ74677',
    'ХХ85877',
    'ХХ86377',
    'ТС30477',
    'ТС30977',
    'ТС33577',
    'ТС33977',
    'ТС36177',
    'ТС38577',
    'ХК47977',
    'ХК50477',
    'ХК58177',
    'ХК74377',
    'ХК85677',
    'ХК86977',
    'ХК88177',
    'ХК91677',
    'ХК92077',
    'ХК92577',
    'ХК92677',
    'ХК92877',
    'ХХ00377',
    'ХХ00577',
    'ХХ02377',
    'ХХ16877',
    'ХХ16977',
    'ХХ17477',
    'ХХ17777',
    'ХХ19777',
    'ХХ25077',
    'ХХ25477',
    'ХХ52177',
    'ХХ52277',
    'ХХ52677',
    'М155НТ750',
    'О686ТС750',
    'А001ТХ750',
    'А015ТХ750',
    'А064ТМ198',
    'А068РН198',
    'А155ТР763',
    'А163ЕЕ763',
    'А169КН161',
    'А169СР161',
    'А190ВТ198',
    'А210УК750',
    'А212ТТ161',
    'А256МР67',
    'А285СМ164',
    'А298АХ750',
    'А349РХ777',
    'А405УВ750',
    'А422ВХ799',
    'А460ВТ799',
    'А469МВ750',
    'А473УА750',
    'А487АС136',
    'А531НМ198',
    'А551КВ198',
    'А576ХН763',
    'А582КЕ799',
    'А584ТМ750',
    'А585НУ123',
    'А592МС198',
    'А606КХ799',
    'А613СВ750',
    'А686СУ750',
    'А743ЕР19',
    'А766РМ198',
    'А832АЕ799',
    'А856ХМ161',
    'А886АХ799',
    'А924ТЕ777',
    'А937ХВ198',
    'А939ХВ198',
    'А957АХ763',
    'А961УА174',
    'А982РР178',
    'АА2582ТЕ',
    'АМ11299',
    'АМ11699',
    'АМ12799',
    'АР32299',
    'В057КЕ60',
    'В137НТ198',
    'В143КА799',
    'В144НТ750',
    'В151НС161',
    'В178ХР77',
    'В180АМ126',
    'В185ТТ750',
    'В236ЕХ750',
    'В236КВ198',
    'В250НТ198',
    'В253УВ750',
    'В255УВ750',
    'В263РУ15',
    'В265УВ750',
    'В308ХР777',
    'В351МХ198',
    'В372УР777',
    'В421МК799',
    'В441СС750',
    'В461ХА82',
    'В462НТ198',
    'В522ВВ90',
    'В539НА198',
    'В542МС198',
    'В550АУ799',
    'В559УВ777',
    'В560ЕС799',
    'В587ХН161',
    'В599КР799',
    'В611КЕ50',
    'В636НТ198',
    'В651ВК777',
    'В756ТХ777',
    'В787НТ198',
    'В791РЕ198',
    'В793КР799',
    'В802СВ750',
    'В845КУ750',
    'В846КУ750',
    'В867УВ750',
    'В877ВН164',
    'В881ХМ174',
    'В885АТ750',
    'В891АН750',
    'В969ТВ77',
    'В972УК750',
    'В992ТТ750',
    'В999ХМ174',
    'Е065СВ750',
    'Е067РУ82',
    'Е069МС134',
    'Е077РУ82',
    'Е133РР134',
    'Е134ТР750',
    'Е149РР134',
    'Е151РР134',
    'Е159РР134',
    'Е165РР134',
    'Е168ТС750',
    'Е172РР134',
    'Е178РР134',
    'Е189МЕ45',
    'Е191УК161',
    'Е203ХМ777',
    'Е296НС43',
    'Е307ХА777',
    'Е333ТХ750',
    'Е336ВТ799',
    'Е360ТУ750',
    'Е377ТС750',
    'Е389УС154',
    'Е391АТ154',
    'Е397СК196',
    'Е419СР154',
    'Е438НХ750',
    'Е475УА750',
    'Е489ВТ777',
    'Е492КУ799',
    'Е504МК799',
    'Е505ХУ777',
    'Е510ТУ777',
    'Е518ТХ190',
    'Е525АХ799',
    'Е541ВН50',
    'Е561НТ154',
    'Е569ТУ750',
    'Е601ТУ750',
    'Е603АС154',
    'Е628ЕХ799',
    'Е634ТУ750',
    'Е648АК799',
    'Е677НК154',
    'Е681ТЕ161',
    'Е681ХУ154',
    'Е686НК154',
    'Е695АТ750',
    'Е704УА161',
    'Е714ТС196',
    'Е733УВ750',
    'Е749ХК178',
    'Е775РР750',
    'Е781ВН777',
    'Е782ВК154',
    'Е789ХМ174',
    'Е792СР154',
    'Е818РА197',
    'Е850ВН154',
    'Е872НУ177',
    'Е906ЕУ154',
    'Е907ЕУ154',
    'Е928ТС750',
    'Е942НМ750',
    'Е964ТВ750',
    'Е971НМ154',
    'Е974АТ136',
    'Е980ХХ154',
    'К036ХН777',
    'К058СХ750',
    'К076ВН799',
    'К119ХХ82',
    'К212УВ174',
    'К214ЕВ799',
    'К228НН196',
    'К231МУ750',
    'К238СС13',
    'К243ВУ750',
    'К265СР161',
    'К274ТМ13',
    'К285ЕЕ750',
    'К291НК77',
    'К295ЕТ750',
    'К300ТА777',
    'К323УВ174',
    'К328ЕС750',
    'К368ТА750',
    'К380КВ196',
    'К395ТК13',
    'К400УА750',
    'К403УВ750',
    'К421СТ750',
    'К446УС196',
    'К514СК750',
    'К519СВ77',
    'К549СН750',
    'К550УХ196',
    'К553РТ750',
    'К559ХР174',
    'К571СМ123',
    'К574ТЕ750',
    'К601СМ123',
    'К609НТ750',
    'К620СМ123',
    'К640ММ196',
    'К647ВУ799',
    'К682ХР18',
    'К702МС799',
    'К766ЕК799',
    'К786ХМ70',
    'К796РУ190',
    'К797НА799',
    'К805КХ750',
    'К812ХС199',
    'К820ТУ750',
    'К835КУ123',
    'К904АЕ799',
    'К940НТ777',
    'К965УВ174',
    'К976СР750',
    'К977ТХ750',
    'К982РН750',
    'К984МУ750',
    'КМ29466',
    'КМ40466',
    'КН66977',
    'КС10377',
    'КС31877',
    'М009АР73',
    'М018ВК50',
    'М026ВУ799',
    'М049НХ777',
    'М102МЕ799',
    'М112ЕР799',
    'М132МУ152',
    'М142РЕ750',
    'М181СК777',
    'М198АЕ799',
    'М283АА159',
    'М304ТУ750',
    'М311АА82',
    'М317АХ750',
    'М337ХА190',
    'М390СА48',
    'М432КУ799',
    'М443УВ777',
    'М455КН799',
    'М461НН190',
    'М511УН190',
    'М574ТС71',
    'М586ЕН799',
    'М591УА750',
    'М605СТ190',
    'М620НЕ750',
    'М689КХ750',
    'М697ТС161',
    'М718ХТ161',
    'М725ТЕ77',
    'М732ТС777',
    'М762ВС152',
    'М781ХТ174',
    'М843УВ174',
    'М848УВ174',
    'М932АН750',
    'М974РН750',
    'М976АТ136',
    'М987ЕЕ777',
    'МВ67477',
    'МН54277',
    'МТ09477',
    'МТ52777',
    'МТ71477',
    'МТ73677',
    'Н019ХХ154',
    'Н020ЕА178',
    'Н040АУ154',
    'Н064СУ750',
    'Н079ХХ154',
    'Н105УВ174',
    'Н128ХК174',
    'Н144НВ154',
    'Н147ЕХ124',
    'Н189ТМ750',
    'Н190КТ154',
    'Н197ТН750',
    'Н208ХХ154',
    'Н215КТ154',
    'Н215ТК777',
    'Н216ЕЕ154',
    'Н218КТ154',
    'Н232РР777',
    'Н247НХ154',
    'Н252УВ154',
    'Н255ЕХ154',
    'Н256ТС197',
    'Н260ВХ154',
    'Н261НХ154',
    'Н303КН154',
    'Н317АХ799',
    'Н319НМ154',
    'Н323ТУ174',
    'Н325КН154',
    'Н332КН154',
    'Н350УВ154',
    'Н366УМ777',
    'Н374КТ154',
    'Н376ТН31',
    'Н386КЕ154',
    'Н390ТН750',
    'Н396НХ154',
    'Н421ТН750',
    'Н438ХХ174',
    'Н447ХН174',
    'Н467ХХ174',
    'Н478ТМ750',
    'Н531НВ154',
    'Н549ХА77',
    'Н554СК178',
    'Н576ХХ154',
    'Н592ЕТ154',
    'Н593ВК154',
    'Н608СУ161',
    'Н609СВ05',
    'Н636КН154',
    'Н655ТР750',
    'Н663МС750',
    'Н676ХТ199',
    'Н677ХМ161',
    'Н726МУ799',
    'Н745НМ178',
    'Н747КУ178',
    'Н751ТР161',
    'Н753ТВ750',
    'Н763ВТ154',
    'Н777ТВ750',
    'Н812ТМ750',
    'Н830АМ154',
    'Н840КТ190',
    'Н841АК154',
    'Н841НК154',
    'Н842КН154',
    'Н860СС161',
    'Н889ХВ777',
    'Н893ХУ161',
    'Н900НУ123',
    'Н925УЕ161',
    'Н956РВ197',
    'Н959АМ154',
    'Н977ХХ174',
    'НВ24877',
    'НВ41077',
    'НЕ50477',
    'НЕ57977',
    'НЕ59377',
    'НК37277',
    'НК65877',
    'НК80477',
    'НМ64677',
    'НМ65777',
    'НН77677',
    'НР31777',
    'НР32477',
    'НР94377',
    'НС15577',
    'НС95777',
    'НУ76677',
    'НХ99177',
    'ОР11077',
    'Р005ВР750',
    'Р033ХВ178',
    'Р041ХУ174',
    'Р060МЕ799',
    'Р065УК152',
    'Р066УТ190',
    'Р069ТУ777',
    'Р078ТТ750',
    'Р101УА152',
    'Р106РК39',
    'Р135РС39',
    'Р143УА750',
    'Р148ХВ161',
    'Р169ТТ161',
    'Р230ТК39',
    'Р235ЕМ799',
    'Р241КН799',
    'Р261ХВ152',
    'Р286СЕ152',
    'Р322УТ39',
    'Р367РН777',
    'Р381ВА152',
    'Р384КР39',
    'Р400СН152',
    'Р415ТТ750',
    'Р416АУ799',
    'Р435МВ154',
    'Р455УТ39',
    'Р469НР750',
    'Р493УК777',
    'Р497ЕТ152',
    'Р503ВН777',
    'Р505ЕМ39',
    'Р516СС152',
    'Р550СС152',
    'Р568ВН799',
    'Р594ВС799',
    'Р614ХТ39',
    'Р629ВС152',
    'Р711МК152',
    'Р728ХА39',
    'Р739ХТ174',
    'Р787УХ39',
    'Р788УС152',
    'Р804УН152',
    'Р818ХУ174',
    'Р831УА190',
    'Р838ХР190',
    'Р843ТУ750',
    'Р845ХК197',
    'Р858СН152',
    'Р859АВ39',
    'Р860СН152',
    'Р863МТ152',
    'Р938РМ39',
    'Р945ТМ750',
    'Р946ТУ39',
    'Р967ХР190',
    'Р975УТ197',
    'Р980УВ750',
    'Р986ХУ174',
    'Р995СМ750',
    'Р995ТВ152',
    'РР26377',
    'РС09177',
    'РС09677',
    'РС09977',
    'РС84877',
    'РХ37977',
    'РХ48277',
    'РХ53777',
    'РХ94877',
    'С001УА174',
    'С002ВС77',
    'С024НС190',
    'С026АН750',
    'С062МУ750',
    'С063КЕ799',
    'С077НМ799',
    'С104ЕС39',
    'С124КА39',
    'С130ТС161',
    'С135МУ750',
    'С137ТЕ750',
    'С137ТУ154',
    'С140СЕ750',
    'С142СТ190',
    'С165УУ178',
    'С167ВС39',
    'С211ЕН39',
    'С223ВР39',
    'С236КВ799',
    'С271КУ799',
    'С302ХН174',
    'С303УТ161',
    'С304ЕУ750',
    'С330ХТ174',
    'С374ХХ161',
    'С375ВУ799',
    'С377АС39',
    'С439ВС39',
    'С482ВХ39',
    'С492ММ750',
    'С502РХ190',
    'С505ВТ39',
    'С538ВН39',
    'С551УТ154',
    'С552СР750',
    'С552ТС750',
    'С568КА39',
    'С572ТТ750',
    'С590ТР777',
    'С606МК750',
    'С633ТР190',
    'С652ХС777',
    'С675УВ750',
    'С693ЕК39',
    'С706ХМ174',
    'С714СК750',
    'С723ВХ39',
    'С727НН98',
    'С755ЕК799',
    'С781ВМ799',
    'С791ЕЕ39',
    'С815УА174',
    'С835ЕЕ39',
    'С844ТК750',
    'С856УВ750',
    'С862ВУ799',
    'С864УВ750',
    'С870УТ154',
    'С912УВ750',
    'С913КС154',
    'С938АУ39',
    'С943УХ150',
    'С956АС50',
    'С993РТ777',
    'СА12177',
    'СА12577',
    'СА13677',
    'СА14077',
    'СА21477',
    'СА22877',
    'СА22977',
    'Т023ХН174',
    'Т171РС750',
    'Т232СУ750',
    'Т245ВР799',
    'Т260СЕ750',
    'Т269СТ750',
    'Т292СН750',
    'Т308СК750',
    'Т343УА174',
    'Т366ВЕ55',
    'Т379РВ750',
    'Т401ТМ750',
    'Т409УТ777',
    'Т418НА750',
    'Т442УА174',
    'Т481МС799',
    'Т510АТ799',
    'Т513МХ799',
    'Т745АН777',
    'Т748ТР750',
    'Т805ХХ161',
    'Т890МТ178',
    'Т897ВМ55',
    'Т903УТ77',
    'Т952УР116',
    'ТР13777',
    'ТР15277',
    'ТР15677',
    'ТР16077',
    'ТР16577',
    'ТР17677',
    'ТР18477',
    'ТР18777',
    'ТР31777',
    'ТР36277',
    'ТР55277',
    'ТР55677',
    'ТР56977',
    'ТР63077',
    'ТР65477',
    'ТР67777',
    'ТР68977',
    'ТР69377',
    'ТР69977',
    'ТР70477',
    'ТР70577',
    'ТС02477',
    'ТС04377',
    'ТС04877',
    'ТС22377',
    'ТТ47877',
    'ТТ49177',
    'ТУ30777',
    'ТУ33877',
    'ТУ48777',
    'У103ТЕ77',
    'У113РР190',
    'У192РС750',
    'У203ТН750',
    'У218ВХ799',
    'У221СР197',
    'У231СА750',
    'У289ВМ799',
    'У298ТН190',
    'У302АС799',
    'У354КМ799',
    'У361РА777',
    'У395НТ750',
    'У426ХМ174',
    'У441ЕЕ55',
    'У462ТС750',
    'У466РН750',
    'У471МЕ799',
    'У502ХУ174',
    'У524ТР750',
    'У537НВ750',
    'У543ТУ750',
    'У564СТ750',
    'У565СТ750',
    'У660УВ750',
    'У719МВ750',
    'У738УУ154',
    'У751УН178',
    'У775НК154',
    'У826ТА750',
    'У883ВУ96',
    'У926ХР163',
    'У935КР799',
    'У948ММ777',
    'У980ТА750',
    'У981ХТ174',
    'УВ03277',
    'УВ88777',
    'УЕ80477',
    'УЕ81777',
    'УМ06477',
    'УМ86677',
    'Х017ТК750',
    'Х033НХ750',
    'Х046РВ750',
    'Х106ВХ199',
    'Х115ТС750',
    'Х120РВ750',
    'Х133СК178',
    'Х134СК178',
    'Х138ТЕ750',
    'Х142КУ777',
    'Х191ЕК163',
    'Х230АУ799',
    'Х272АК750',
    'Х309РС750',
    'Х336ТР178',
    'Х423ХА777',
    'Х456ЕК163',
    'Х482ТС750',
    'Х511ЕВ102',
    'Х514НК96',
    'Х521АВ98',
    'Х532ХТ777',
    'Х579ТР750',
    'Х600СС750',
    'Х705НН750',
    'Х721ВК799',
    'Х725ВМ777',
    'Х740ЕЕ102',
    'Х742МУ178',
    'Х800МТ777',
    'Х812АМ750',
    'Х831ЕТ96',
    'Х831РЕ190',
    'Х937ХР178',
    'ХА37777',
    'ХА39877',
    'ХА95077',
    'ХЕ54477',
    'ХК46677',
    'ХК85677',
    'ХК92577',
    'ХН77477',
    'ХН84377',
    'ХН98877',
    'ХР14477',
    'ХР80777',
    'ХУ45977',
    'ХХ16977',
    'ХХ52177',
    'А037КЕ777',
    'А052АХ763',
    'А059АУ763',
    'А088КМ799',
    'А096ЕР750',
    'А157РУ763',
    'А165ТВ777',
    'А211АН198',
    'А237УМ750',
    'А275ХР163',
    'А365СТ777',
    'А369КХ124',
    'А472СХ750',
    'А498СА763',
    'А526НТ716',
    'А551ВУ799',
    'А563СА161',
    'А621ВЕ50',
    'А626АВ761',
    'А664НХ198',
    'А669ТМ750',
    'А688ЕТ750',
    'А689ХН763',
    'А701АЕ799',
    'А708МТ198',
    'А711СЕ750',
    'А736КМ799',
    'А742СУ750',
    'А743ТМ750',
    'А852УА22',
    'А858ВУ799',
    'А875КУ123',
    'А889ТМ750',
    'А905СА750',
    'А913ТМ750',
    'А930УВ161',
    'А956АХ198',
    'А978УА186',
    'А987ТМ750',
    'АР93199',
    'АУ04599',
    'В028УУ161',
    'В031ХУ77',
    'В064МЕ161',
    'В067РЕ198',
    'В097ВН763',
    'В109КВ799',
    'В109СХ750',
    'В127АА761',
    'В211НТ198',
    'В222ВВ154',
    'В235УК750',
    'В263УВ750',
    'В268КВ198',
    'В276УК750',
    'В282НХ199',
    'В300КУ799',
    'В321УА777',
    'В372ТТ750',
    'В379ХК161',
    'В394УС777',
    'В409ТТ750',
    'В440ВМ799',
    'В474ЕВ799',
    'В491ВР799',
    'В518АУ50',
    'В519ХР95',
    'В538МС198',
    'В540КМ750',
    'В553ВУ799',
    'В606УК750',
    'В622НТ198',
    'В692СТ750',
    'В714НТ799',
    'В749ХЕ174',
    'В768ТН750',
    'В842НХ750',
    'В875КЕ95',
    'В878НС95',
    'В914НМ124',
    'В925КЕ190',
    'В962МК190',
    'В968ТТ750',
    'Е021АХ799',
    'Е049ВМ799',
    'Е065РС190',
    'Е074УК750',
    'Е106РН154',
    'Е125ЕР799',
    'Е138РР134',
    'Е158РР134',
    'Е160РР134',
    'Е161ВН799',
    'Е207РР134',
    'Е220РР134',
    'Е234ТР750',
    'Е269ВУ799',
    'Е278ХТ777',
    'Е288АР750',
    'Е315МУ777',
    'Е348ХС21',
    'Е358РР750',
    'Е392ЕА154',
    'Е406ТХ154',
    'Е409УК750',
    'Е420ЕН799',
    'Е440РР750',
    'Е449КМ196',
    'Е525ЕУ799',
    'Е531АУ154',
    'Е542СВ62',
    'Е547ЕС126',
    'Е549УН36',
    'Е556АН154',
    'Е563ТХ777',
    'Е591КМ799',
    'Е614ЕР142',
    'Е620ТУ750',
    'Е624УК777',
    'Е662РХ82',
    'Е731ТК154',
    'Е748ХН174',
    'Е782СА750',
    'Е834МВ799',
    'Е851АВ116',
    'Е862ЕВ154',
    'Е868ВМ799',
    'Е876ТР161',
    'Е882СС750',
    'Е887НЕ799',
    'Е904ЕХ154',
    'Е912УМ161',
    'Е939НР82',
    'Е943ММ154',
    'Е950ХЕ154',
    'Е972ХК154',
    'Е980НУ134',
    'Е995ХР777',
    'К015СТ750',
    'К020МВ196',
    'К106ЕТ70',
    'К161СЕ61',
    'К210ТН750',
    'К273ХТ174',
    'К320СВ159',
    'К351УУ161',
    'К359УА750',
    'К378КУ799',
    'К394ХХ799',
    'К408СТ196',
    'К408СТ750',
    'К443ВМ799',
    'К492ХВ161',
    'К500УН161',
    'К527ЕУ21',
    'К538УУ196',
    'К556ТК750',
    'К558СМ123',
    'К567ХМ190',
    'К578ВР750',
    'К585МЕ777',
    'К595УУ196',
    'К598СМ123',
    'К613ХМ196',
    'К627ММ196',
    'К636СМ123',
    'К638ЕЕ196',
    'К643СМ123',
    'К670МС150',
    'К673КН750',
    'К678УВ750',
    'К713УВ159',
    'К719СТ750',
    'К720ТР750',
    'К732СК750',
    'К745ТР750',
    'К750ВК29',
    'К757ВХ196',
    'К761СХ190',
    'К884ТК750',
    'К900ТР750',
    'К903ХА196',
    'К934ТК750',
    'К939ВА152',
    'К949УХ196',
    'К983МС178',
    'КМ95666',
    'КМ96166',
    'КС62177',
    'КТ15977',
    'М030ЕВ124',
    'М060МЕ750',
    'М113ВА750',
    'М135МУ152',
    'М150РВ750',
    'М151ВЕ799',
    'М151УВ174',
    'М197ХТ174',
    'М221РК750',
    'М267НМ750',
    'М318ТВ777',
    'М376СА750',
    'М399ТХ161',
    'М412СУ750',
    'М424СТ750',
    'М454ТУ777',
    'М474ЕУ178',
    'М480СН750',
    'М496УА174',
    'М500ТУ750',
    'М522СК750',
    'М529ТВ750',
    'М590РР150',
    'М604РЕ152',
    'М617РХ777',
    'М642УН777',
    'М685АК799',
    'М742ХУ77',
    'М794ВЕ178',
    'М811РК750',
    'М821УА174',
    'М864ВР799',
    'М894ВЕ152',
    'М898СХ750',
    'М932КТ799',
    'М960МХ799',
    'М964ВУ154',
    'М971ХЕ161',
    'М972СВ750',
    'М973ТХ161',
    'МВ47577',
    'МВ51877',
    'МВ58577',
    'МВ67677',
    'МК18777',
    'МК99777',
    'ММ19077',
    'МН04677',
    'МН10677',
    'МН13877',
    'МН73277',
    'МТ09677',
    'МТ71077',
    'МТ74377',
    'МТ81777',
    'Н001НХ154',
    'Н006ХХ154',
    'Н024ЕВ799',
    'Н029ТХ161',
    'Н045СУ750',
    'Н057ХХ154',
    'Н079СУ750',
    'Н103СУ750',
    'Н128УХ161',
    'Н134КТ154',
    'Н157МА799',
    'Н160КТ154',
    'Н165НЕ123',
    'Н181РХ33',
    'Н190ЕН154',
    'Н194НЕ154',
    'Н212ТУ161',
    'Н216НА799',
    'Н222КТ154',
    'Н235СА750',
    'Н236НХ154',
    'Н248КР154',
    'Н249МВ178',
    'Н264СН154',
    'Н269НВ154',
    'Н278АУ154',
    'Н278КВ154',
    'Н295НХ154',
    'Н299КВ799',
    'Н302КН154',
    'Н317УВ750',
    'Н322КВ154',
    'Н338АВ777',
    'Н358НК154',
    'Н366НХ154',
    'Н375ХР777',
    'Н385АВ154',
    'Н387СЕ39',
    'Н390УН161',
    'Н440КЕ123',
    'Н465ТТ152',
    'Н473МВ777',
    'Н481ЕУ799',
    'Н482НК154',
    'Н494ХН174',
    'Н495КА154',
    'Н501ТС750',
    'Н503НА750',
    'Н511ТС161',
    'Н521РУ750',
    'Н529РР750',
    'Н535НВ154',
    'Н587УХ161',
    'Н632УУ46',
    'Н666КР154',
    'Н710СУ777',
    'Н730УС154',
    'Н732ТУ22',
    'Н734КР154',
    'Н766ЕУ142',
    'Н770КР154',
    'Н796АС154',
    'Н821НХ174',
    'Н834КН154',
    'Н866НК154',
    'Н886СР152',
    'Н924УВ174',
    'Н929ВЕ799',
    'Н940КЕ154',
    'Н948КЕ45',
    'НЕ50577',
    'НЕ56277',
    'НК14577',
    'НК55777',
    'НН08277',
    'НН10877',
    'НН77077',
    'НН91177',
    'НС56777',
    'НС57077',
    'НС99877',
    'НХ57677',
    'НХ74077',
    'Р005ТС777',
    'Р066ВА136',
    'Р079КУ77',
    'Р119МС799',
    'Р168КХ799',
    'Р173АК799',
    'Р181УА750',
    'Р186ЕА799',
    'Р202ХУ22',
    'Р234УА750',
    'Р242ХК178',
    'Р246ТА62',
    'Р258ТУ777',
    'Р298КР178',
    'Р307ЕК799',
    'Р355ХХ197',
    'Р371ЕВ799',
    'Р375АЕ39',
    'Р386ТМ750',
    'Р397СУ777',
    'Р398ВА152',
    'Р407ТМ750',
    'Р415УА174',
    'Р416УА750',
    'Р480ЕВ750',
    'Р480ХС161',
    'Р485ХУ174',
    'Р500ТХ750',
    'Р502ХК174',
    'Р504НТ39',
    'Р521СУ750',
    'Р526ХХ39',
    'Р533ТН777',
    'Р578НР750',
    'Р579АВ152',
    'Р602МС750',
    'Р633ВХ178',
    'Р714ТЕ750',
    'Р733ТС750',
    'Р754ТУ152',
    'Р798ТН152',
    'Р813ХН39',
    'Р841ТУ750',
    'Р871НС750',
    'Р915СТ178',
    'Р920УР777',
    'Р924КА178',
    'Р929УК777',
    'Р953КХ799',
    'Р989ТУ152',
    'РС09277',
    'РС11377',
    'РС84977',
    'РС90077',
    'РХ52477',
    'РХ53377',
    'С033ВА799',
    'С035ТУ777',
    'С046ЕН799',
    'С049НН70',
    'С058МУ750',
    'С075ТТ750',
    'С080ВМ136',
    'С174ВА50',
    'С268ЕК750',
    'С303КС777',
    'С352МВ799',
    'С357АЕ750',
    'С381ВН799',
    'С446МС799',
    'С462ЕК39',
    'С463УА750',
    'С554УТ154',
    'С578НТ750',
    'С588АА39',
    'С603НТ750',
    'С607АХ39',
    'С647ТК95',
    'С682ТВ178',
    'С709ВВ39',
    'С723ЕК799',
    'С739ВХ39',
    'С747ТМ750',
    'С753ВХ799',
    'С799ВУ799',
    'С811ЕР39',
    'С811ТТ161',
    'С858АН136',
    'С859КН799',
    'С869ТН154',
    'С891ХУ36',
    'С899ВМ39',
    'С902ВН76',
    'С903ВТ39',
    'С913ВХ39',
    'С925МТ178',
    'С926МТ799',
    'С947ВА39',
    'С990СР190',
    'СА12677',
    'СА12877',
    'СА13177',
    'СА20777',
    'СА20877',
    'СА21077',
    'СА22777',
    'СА23177',
    'Т031ЕМ161',
    'Т055МК45',
    'Т083МН750',
    'Т099РМ750',
    'Т142НК750',
    'Т161ЕС197',
    'Т180УР190',
    'Т189СТ777',
    'Т189УВ750',
    'Т190НН750',
    'Т231СК750',
    'Т232ВР150',
    'Т256МУ163',
    'Т264КХ750',
    'Т311СТ77',
    'Т351КХ59',
    'Т392АН50',
    'Т401НТ163',
    'Т428СУ190',
    'Т439РР750',
    'Т442РВ750',
    'Т449НХ55',
    'Т487РР197',
    'Т492РР777',
    'Т511РК777',
    'Т550ЕВ799',
    'Т575ВК777',
    'Т659РУ777',
    'Т695ВР799',
    'Т716ТС161',
    'Т777ВВ177',
    'Т853РХ777',
    'Т883РН190',
    'Т911ЕУ799',
    'ТР13477',
    'ТР13677',
    'ТР13977',
    'ТР14677',
    'ТР15177',
    'ТР15477',
    'ТР15877',
    'ТР16877',
    'ТР17577',
    'ТР18277',
    'ТР54877',
    'ТР55077',
    'ТР55777',
    'ТР56277',
    'ТР63177',
    'ТР64777',
    'ТР65577',
    'ТР67277',
    'ТР69577',
    'ТР70377',
    'ТР70677',
    'ТР71077',
    'ТС03877',
    'ТС04177',
    'ТС21877',
    'ТС30077',
    'ТС31877',
    'ТС33077',
    'ТУ33677',
    'У008ТР750',
    'У075ТХ750',
    'У077РА178',
    'У148ЕХ163',
    'У165РК47',
    'У218ХТ777',
    'У260АМ154',
    'У289КН55',
    'У331ХУ174',
    'У341ТМ178',
    'У341ХХ163',
    'У377КА799',
    'У396КМ799',
    'У486НУ750',
    'У527КН799',
    'У569ВХ799',
    'У595ТК750',
    'У678КС55',
    'У720РВ161',
    'У849НТ750',
    'У870ВМ799',
    'У873ЕУ799',
    'У953КЕ799',
    'У990ТА750',
    'УА23477',
    'УВ63077',
    'УЕ81077',
    'УМ05777',
    'УМ11877',
    'УМ13877',
    'УМ30577',
    'УМ79377',
    'Х036ТХ96',
    'Х067РС163',
    'Х089МС163',
    'Х091ТС750',
    'Х133ВЕ178',
    'Х136КТ178',
    'Х138СМ750',
    'Х145СК178',
    'Х161АК777',
    'Х173АК750',
    'Х177ЕВ750',
    'Х206АТ750',
    'Х210ВС799',
    'Х217ТХ750',
    'Х365ХУ777',
    'Х400СХ750',
    'Х437РН777',
    'Х441ЕВ777',
    'Х441НН102',
    'Х452ТС750',
    'Х464УУ163',
    'Х487РМ750',
    'Х530КТ161',
    'Х556ТУ161',
    'Х558ТА750',
    'Х592ХТ777',
    'Х627ТА750',
    'Х636ТР750',
    'Х689АХ799',
    'Х720АХ799',
    'Х761АВ750',
    'Х774ХС174',
    'Х798МВ750',
    'Х804АК750',
    'Х811ТХ174',
    'Х826ЕЕ178',
    'Х871АС178',
    'Х924ТК750',
    'Х936ТН750',
    'Х958ТМ178',
    'Х969НН116',
    'ХА39277',
    'ХА58077',
    'ХН64277',
    'ХН83977',
    'ХР70977',
    'ХР89177',
    'ХУ49077',
    'ХХ00377',
    'ХХ00577',
    'А027НС198',
    'А030ВС777',
    'А079АК178',
    'А095ТТ37',
    'А105ВТ50',
    'А136НВ777',
    'А173РТ750',
    'А187КР799',
    'А242АА147',
    'А249МУ799',
    'А254НЕ750',
    'А355ВН799',
    'А369УМ750',
    'А424РР763',
    'А502НВ799',
    'А543КР799',
    'А571СТ750',
    'А579НН777',
    'А604ХХ174',
    'А624МС30',
    'А649СУ750',
    'А699НХ198',
    'А719УА750',
    'А725РН763',
    'А739МА799',
    'А766СУ750',
    'А804АТ198',
    'А808ЕТ799',
    'А842РВ763',
    'А871ХС161',
    'А947РЕ750',
    'А958АА147',
    'А997СС750',
    'АМ11399',
    'АМ11899',
    'АМ65799',
    'В030МК799',
    'В045СМ777',
    'В049АВ761',
    'В055ТК750',
    'В090УХ82',
    'В092ВА750',
    'В135НР750',
    'В140УВ750',
    'В141ВМ799',
    'В151ММ150',
    'В181ХА22',
    'В187ВТ198',
    'В230ТУ750',
    'В235ЕТ124',
    'В237КА750',
    'В258ТЕ161',
    'В279КВ198',
    'В319ХВ190',
    'В356ТТ750',
    'В410МВ799',
    'В424НВ198',
    'В495КУ198',
    'В510ВМ750',
    'В516ЕУ799',
    'В518КУ198',
    'В520СС95',
    'В547РА178',
    'В577ТМ750',
    'В634ТВ750',
    'В694СТ750',
    'В739ХХ161',
    'В753ММ198',
    'В755НТ198',
    'В770АР799',
    'В774СУ196',
    'В786НК750',
    'В793ЕТ799',
    'В798ХМ161',
    'В800АН95',
    'В806ХЕ777',
    'В857ТХ174',
    'В866РТ750',
    'В900ВС198',
    'В969МН716',
    'В980ЕК799',
    'Е084РУ82',
    'Е099ХС24',
    'Е167РР134',
    'Е188НС777',
    'Е214РР134',
    'Е226ТМ750',
    'Е247ТХ190',
    'Е257РТ750',
    'Е265УА750',
    'Е277УХ196',
    'Е304РЕ134',
    'Е322РЕ134',
    'Е335УМ777',
    'Е342ЕС154',
    'Е361АВ761',
    'Е392КК750',
    'Е394МТ799',
    'Е444СЕ750',
    'Е487ЕА154',
    'Е541ХУ154',
    'Е612МЕ799',
    'Е615ТУ750',
    'Е654ХК777',
    'Е675КУ799',
    'Е697ЕУ799',
    'Е700ТЕ154',
    'Е702МК799',
    'Е714ММ750',
    'Е714УР150',
    'Е724УМ161',
    'Е727КМ799',
    'Е727УВ190',
    'Е763ТР161',
    'Е793ХМ174',
    'Е841КЕ190',
    'Е842ХА154',
    'Е858УВ174',
    'Е919КУ54',
    'Е925МН799',
    'Е927РР750',
    'Е940АМ799',
    'Е968УТ77',
    'К015НК161',
    'К039ТР161',
    'К049НР799',
    'К062АВ154',
    'К088УК777',
    'К096СТ777',
    'К113МУ750',
    'К126ТВ161',
    'К135КС150',
    'К136ТС13',
    'К138КР196',
    'К140МВ750',
    'К149МЕ196',
    'К217СА777',
    'К225МТ750',
    'К226НС750',
    'К286КР799',
    'К302ВН50',
    'К359КН77',
    'К418ХМ777',
    'К487УМ196',
    'К500УВ750',
    'К554УА750',
    'К575МХ750',
    'К639ХТ161',
    'К641УВ750',
    'К658ВВЕ174',
    'К664КК154',
    'К664МА799',
    'К737ТА750',
    'К739УЕ190',
    'К744АЕ799',
    'К756РА159',
    'К822КН799',
    'К896СР196',
    'К909ЕТ750',
    'К929МС161',
    'К930РМ777',
    'К981МК13',
    'КМ29566',
    'КМ30666',
    'КМ97766',
    'КР30177',
    'КУ75677',
    'М058ХТ777',
    'М131АУ799',
    'М180РМ750',
    'М261МС799',
    'М270ХА777',
    'М322АН777',
    'М323ЕН159',
    'М358ТВ777',
    'М367ВЕ799',
    'М384НТ799',
    'М445ТЕ750',
    'М457КУ750',
    'М490КР159',
    'М503ВУ799',
    'М530ВА124',
    'М588РН750',
    'М652МК152',
    'М656УК178',
    'М779ТС750',
    'М801МА750',
    'М878СА777',
    'М893МУ799',
    'М898НН46',
    'М915КР33',
    'М921АТ799',
    'М933АР750',
    'М948КТ33',
    'М952АЕ777',
    'МВ99977',
    'МС02177',
    'МС02677',
    'МТ00977',
    'Н020КН154',
    'Н029АС750',
    'Н052ЕК799',
    'Н079ТУ161',
    'Н093АН154',
    'Н094СУ750',
    'Н105ЕН154',
    'Н108КХ750',
    'Н135ТА750',
    'Н142НМ154',
    'Н148ТУ161',
    'Н166ЕН154',
    'Н171КТ154',
    'Н174СУ750',
    'Н178ХВ174',
    'Н206ХТ154',
    'Н207УН77',
    'Н219ХТ102',
    'Н260СС750',
    'Н282УЕ152',
    'Н294НВ154',
    'Н302НХ154',
    'Н306КН154',
    'Н307СР154',
    'Н310КН154',
    'Н329ЕК154',
    'Н337КН154',
    'Н361ЕВ154',
    'Н458ХТ154',
    'Н488ВК154',
    'Н489АТ154',
    'Н490АТ154',
    'Н515УК152',
    'Н579ВУ154',
    'Н629ВН799',
    'Н652КУ750',
    'Н656КН154',
    'Н674КН154',
    'Н675НА154',
    'Н679НК154',
    'Н690ЕВ154',
    'Н705ТР777',
    'Н737НА154',
    'Н742МЕ799',
    'Н819ХА174',
    'Н826ХХ174',
    'Н831КН154',
    'Н876ХУ154',
    'Н887УВ199',
    'Н895УВ174',
    'Н928ТР750',
    'Н931АС154',
    'Н945СТ154',
    'Н949СХ154',
    'Н984АК799',
    'НЕ50777',
    'НЕ51277',
    'НЕ56977',
    'НЕ57077',
    'НЕ58477',
    'НЕ58777',
    'НК37377',
    'НМ27577',
    'НМ61877',
    'НМ62377',
    'НН51677',
    'НН63277',
    'НР06377',
    'НС33377',
    'НС61977',
    'НС91777',
    'НС95477',
    'НТ02077',
    'НУ40377',
    'НУ62577',
    'Р012КМ50',
    'Р034ХТ199',
    'Р052РН152',
    'Р055ХУ174',
    'Р090УК777',
    'Р128ВМ136',
    'Р165УК777',
    'Р214ХВ174',
    'Р245ВХ799',
    'Р272РВ750',
    'Р294УЕ102',
    'Р312ТС750',
    'Р327ХЕ39',
    'Р337ТН750',
    'Р443ТВ750',
    'Р446ВЕ750',
    'Р470ТН161',
    'Р497ТУ152',
    'Р514ЕМ799',
    'Р549ВХ799',
    'Р592РХ33',
    'Р603МС750',
    'Р604МС750',
    'Р637НР750',
    'Р663РМ750',
    'Р727ТК777',
    'Р756НС152',
    'Р772УС152',
    'Р780МВ39',
    'Р781НУ152',
    'Р800ВХ142',
    'Р867ТУ152',
    'Р960АР750',
    'Р960РТ750',
    'Р963ТВ152',
    'Р992КР799',
    'Р993ТВ152',
    'РР05577',
    'РР37577',
    'РР50377',
    'РС08277',
    'РС42877',
    'РХ48877',
    'С014УА174',
    'С023ВС39',
    'С025РР750',
    'С040АХ39',
    'С042УУ161',
    'С065НК799',
    'С066АС799',
    'С089ЕЕ39',
    'С101РН116',
    'С138ХВ777',
    'С151ЕР39',
    'С187ЕК39',
    'С199ТР178',
    'С211МВ39',
    'С241ВВ39',
    'С264УХ777',
    'С291КС799',
    'С375ХК154',
    'С381ВХ39',
    'С385АТ190',
    'С445СА750',
    'С456ВХ39',
    'С517ВВ39',
    'С518ТВ750',
    'С520ХН174',
    'С562ТС750',
    'С590ТЕ750',
    'С619АА39',
    'С619ЕК39',
    'С626РР750',
    'С633ВТ39',
    'С661АМ39',
    'С681МХ154',
    'С691ВУ799',
    'С763РТ750',
    'С777ЕЕ39',
    'С827ХМ174',
    'С828УА174',
    'С867ВН799',
    'С882СР777',
    'С903ЕЕ39',
    'С918ТТ161',
    'С935УХ777',
    'С974ЕТ190',
    'С976ТК750',
    'СА11877',
    'СА11977',
    'СА12077',
    'СА12977',
    'СА13877',
    'СА14177',
    'СА20477',
    'СА23077',
    'Т052УА174',
    'Т082МС64',
    'Т085ТТ154',
    'Т129ХТ174',
    'Т192СХ777',
    'Т224СН750',
    'Т363РВ777',
    'Т376ХС161',
    'Т485КВ799',
    'Т509АТ136',
    'Т552ХР163',
    'Т561ХМ174',
    'Т594ВР799',
    'Т679ВР799',
    'Т701АВ799',
    'Т745УЕ47',
    'Т816СМ750',
    'Т927МР178',
    'Т934ЕВ799',
    'Т989ТК750',
    'ТР14977',
    'ТР15977',
    'ТР16377',
    'ТР16977',
    'ТР17377',
    'ТР36377',
    'ТР36477',
    'ТР50477',
    'ТР64277',
    'ТР64477',
    'ТР67177',
    'ТР67377',
    'ТР67477',
    'ТР69877',
    'ТР70777',
    'У018ЕУ163',
    'У112МС799',
    'У134ВХ116',
    'У149ВУ799',
    'У172РК102',
    'У176УУ154',
    'У208РТ123',
    'У232КУ750',
    'У252УМ61',
    'У258СТ123',
    'У281СХ777',
    'У285ТС750',
    'У319АМ154',
    'У323ЕХ799',
    'У342ХЕ199',
    'У347ТА750',
    'У425МУ190',
    'У452ТЕ750',
    'У602ЕВ799',
    'У651ТА52',
    'У651УВ750',
    'У652ЕВ55',
    'У712ВМ750',
    'У729МТ750',
    'У742СМ178',
    'У798ХМ174',
    'У814РН750',
    'У832ТА750',
    'У835РТ190',
    'У840УХ161',
    'У855ТК750',
    'У870НА799',
    'У922УМ777',
    'У933СН777',
    'У950ХА777',
    'У975ВС799',
    'У994УХ161',
    'УВ05277',
    'УВ65677',
    'УВ70277',
    'УМ32277',
    'Х035МТ750',
    'Х108РТ750',
    'Х169СМ750',
    'Х202МС799',
    'Х286АМ50',
    'Х450МХ750',
    'Х499ТК750',
    'Х506ХЕ190',
    'Х607КК123',
    'Х619ТУ98',
    'Х690УХ777',
    'Х838КА799',
    'Х895МУ178',
    'Х929АЕ178',
    'Х998РМ750',
    'ХА28077',
    'ХА40377',
    'ХА41377',
    'ХА96477',
    'ХН19177',
    'ХН57377',
    'ХН77677',
    'ХН92077',
    'ХР78577',
    'ХУ50677',
    'ХХ12277',
    'ХХ21777',
    'А044ЕТ198',
    'А049УК750',
    'А221ХА777',
    'А259ХН174',
    'А306ЕВ750',
    'А309РВ777',
    'А328ЕВ750',
    'А346ХМ174',
    'А367РН750',
    'А401ТВ750',
    'А427УА750',
    'А494ТМ750',
    'А569ВН763',
    'А608СЕ750',
    'А613УВ750',
    'А654РЕ750',
    'А656ХТ174',
    'А688МЕ196',
    'А716СН750',
    'А758СС750',
    'А839МК799',
    'А846НВ198',
    'А884ТУ750',
    'А905ТУ750',
    'А931МТ799',
    'А937ТК750',
    'А942АА147',
    'А954МХ763',
    'А977СТ777',
    'А983СА750',
    'АМ12199',
    'АМ44099',
    'АС24316',
    'АУ06299',
    'В054ХК',
    'В081НЕ197',
    'В124ВН763',
    'В169УТ777',
    'В213ТЕ750',
    'В273АТ750',
    'В278ТР750',
    'В284ТН777',
    'В349АМ799',
    'В368ТВ77',
    'В413УК750',
    'В420ВН763',
    'В428ВУ750',
    'В493ВС799',
    'В521СУ750',
    'В595КМ164',
    'В610ЕХ799',
    'В613ЕК799',
    'В647ВА799',
    'В669ВЕ154',
    'В719ВА799',
    'В782СА89',
    'В793АТ799',
    'В825КР716',
    'В833ТН750',
    'В850СА190',
    'В863ТУ750',
    'В918НХ15',
    'Е045СУ96',
    'Е064АЕ750',
    'Е073РУ82',
    'Е075ХА178',
    'Е122ХС174',
    'Е164РР134',
    'Е168РР134',
    'Е196РР134',
    'Е199ММ750',
    'Е259МК799',
    'Е281ТМ750',
    'Е284ТР750',
    'Е287УА750',
    'Е327ХТ154',
    'Е427УУ154',
    'Е435ХС777',
    'Е442СМ190',
    'Е465ЕЕ196',
    'Е488ТЕ750',
    'Е494УК750',
    'Е515СУ750',
    'Е560УХ154',
    'Е564ХК174',
    'Е588ТУ750',
    'Е593СК161',
    'Е607РЕ13',
    'Е622ТУ750',
    'Е640РК777',
    'Е730ХТ154',
    'Е739МТ777',
    'Е758НС190',
    'Е782ТС154',
    'Е812НХ82',
    'Е827МК799',
    'Е873СМ154',
    'Е879УА21',
    'Е936СУ750',
    'Е971УА750',
    'Е975ХМ777',
    'К006СТ13',
    'К027ХУ161',
    'К030УА750',
    'К121ЕТ750',
    'К124ХР174',
    'К139ХР174',
    'К146ХЕ196',
    'К162СТ750',
    'К209ЕХ799',
    'К215УТ196',
    'К220ХН777',
    'К232РС777',
    'К233ТА750',
    'К242ХК196',
    'К276АР799',
    'К285ТА777',
    'К305РН777',
    'К312РР196',
    'К480ЕМ196',
    'К491ВС799',
    'К517СМ750',
    'К522ХУ199',
    'К543ХР174',
    'К583РМ750',
    'К666ТВ13',
    'К670ТУ750',
    'К708НК777',
    'К720КН196',
    'К722ВХ799',
    'К759УХ196',
    'К782РК750',
    'К806ТУ750',
    'К839ЕХ799',
    'К879ЕЕ750',
    'К882КЕ750',
    'К917ВХ799',
    'КМ29666',
    'КМ30766',
    'КМ95166',
    'КМ95466',
    'КМ97066',
    'КС96477',
    'М108АС799',
    'М130МУ152',
    'М168УВ174',
    'М170РУ777',
    'М250ЕН152',
    'М293ВК799',
    'М303КУ159',
    'М314РК199',
    'М342СН777',
    'М455КК750',
    'М579ХЕ161',
    'М594МТ124',
    'М608РК750',
    'М623ТТ190',
    'М646МС799',
    'М655УВ174',
    'М700ЕА124',
    'М734ЕР799',
    'М751РК750',
    'М795СА777',
    'М840ВА799',
    'М853ВН48',
    'М906АР750',
    'М941ХМ174',
    'М952ТТ750',
    'М963ЕС799',
    'М968ВТ178',
    'МВ64177',
    'МК63777',
    'ММ18677',
    'ММ18777',
    'МН16777',
    'МТ09777',
    'МТ14277',
    'МТ70877',
    'МТ73477',
    'МТ74177',
    'Н013МС77',
    'Н020НЕ799',
    'Н032КР799',
    'Н044МХ178',
    'Н044ХЕ174',
    'Н066ХХ154',
    'Н078ЕХ154',
    'Н102УВ174',
    'Н128ХХ174',
    'Н133ХХ40',
    'Н147НХ154',
    'Н157ТА750',
    'Н159НМ154',
    'Н163ТА750',
    'Н169ВХ799',
    'Н175НЕ154',
    'Н176УС154',
    'Н203ХМ178',
    'Н216УС154',
    'Н219МВ750',
    'Н224ХК777',
    'Н277ЕК154',
    'Н289АЕ154',
    'Н291РН750',
    'Н346АУ154',
    'Н358КН154',
    'Н415НК750',
    'Н419ХТ154',
    'Н435КТ154',
    'Н439УВ174',
    'Н502ТВ750',
    'Н526КА154',
    'Н533НЕ154',
    'Н576НЕ154',
    'Н590ВВ154',
    'Н632СР154',
    'Н635ВХ799',
    'Н656АА750',
    'Н657СТ750',
    'Н677ТУ190',
    'Н679КН154',
    'Н700ТС750',
    'Н708КР799',
    'Н709ХХ154',
    'Н718НМ33',
    'Н719ХХ154',
    'Н745УМ161',
    'Н750НК799',
    'Н763СМ163',
    'Н764КМ154',
    'Н773МВ102',
    'Н802КН750',
    'Н815УС154',
    'Н818ХТ174',
    'Н822КР154',
    'Н834НК154',
    'Н835УВ174',
    'Н849УВ174',
    'Н861АМ154',
    'Н871КВ154',
    'Н889УВ174',
    'Н948СЕ750',
    'Н959КА154',
    'Н972НК154',
    'НЕ56577',
    'НЕ57877',
    'НК65777',
    'НК66277',
    'НН04377',
    'НС93477',
    'НС95077',
    'НТ00577',
    'НУ74277',
    'Р089МХ777',
    'Р105НЕ152',
    'Р115ХЕ161',
    'Р173РК750',
    'Р193ХУ39',
    'Р198УС161',
    'Р275СС750',
    'Р292АК152',
    'Р295ХР190',
    'Р337СА77',
    'Р347ХЕ777',
    'Р373ХЕ36',
    'Р386ТН750',
    'Р395ВС799',
    'Р424ВА152',
    'Р436ТУ750',
    'Р446НС777',
    'Р463ВН750',
    'Р480УВ777',
    'Р524ТК777',
    'Р556УА152',
    'Р577РХ152',
    'Р579КУ799',
    'Р585СВ750',
    'Р605МС750',
    'Р626УН152',
    'Р661ТУ152',
    'Р665ТУ152',
    'Р679МН47',
    'Р679НС152',
    'Р694КН750',
    'Р734РМ750',
    'Р787НУ152',
    'Р817СМ777',
    'Р825НС777',
    'Р827КК152',
    'Р906АК50',
    'Р924ТМ750',
    'Р959Х190',
    'Р972МЕ799',
    'Р986ТВ152',
    'Р994ТВ152',
    'Р998ХУ174',
    'РР05977',
    'РС10277',
    'РС39277',
    'С063МУ750',
    'С066ХН174',
    'С078ВС799',
    'С108ХР161',
    'С191АТ39',
    'С222РС777',
    'С229ХН174',
    'С253СЕ197',
    'С278АВ77',
    'С297МХ190',
    'С308РУ777',
    'С374ТА123',
    'С381ВВ39',
    'С418АА55',
    'С549ТМ750',
    'С566ТТ750',
    'С591АУ799',
    'С654АТ136',
    'С655УК123',
    'С675ВХ39',
    'С699ЕЕ39',
    'С708ХМ174',
    'С725УР190',
    'С729АУ799',
    'С763ЕК799',
    'С765АУ136',
    'С786РА55',
    'С798ЕЕ39',
    'С802ВУ39',
    'С818РК77',
    'С833УА174',
    'С847УА174',
    'С894ВР39',
    'С926АВ799',
    'С932КА750',
    'С950МН799',
    'С955РР750',
    'С985РМ190',
    'С993ХМ174',
    'СА11477',
    'СА11677',
    'СА20677',
    'СА21777',
    'СА22377',
    'Т012НН777',
    'Т213СН161',
    'Т216СУ750',
    'Т333КК190',
    'Т364ВМ799',
    'Т432РТ55',
    'Т456УУ161',
    'Т525СТ750',
    'Т541РР750',
    'Т563ХХ55',
    'Т580НН55',
    'Т655СТ750',
    'Т996УА750',
    'ТР14077',
    'ТР17277',
    'ТР27877',
    'ТР32177',
    'ТР32677',
    'ТР40977',
    'ТР55477',
    'ТР56177',
    'ТР56377',
    'ТР56477',
    'ТР56577',
    'ТР56677',
    'ТР65377',
    'ТР67077',
    'ТР67677',
    'ТР67977',
    'ТР68077',
    'ТР68377',
    'ТР71277',
    'ТС03777',
    'ТС04777',
    'ТС21577',
    'ТС43677',
    'ТТ68177',
    'ТУ82977',
    'У116ТЕ750',
    'У118НМ197',
    'У128УУ154',
    'У177УА750',
    'У201ЕС750',
    'У340КУ750',
    'У376АР799',
    'У408ХМ161',
    'У427НС750',
    'У517ХТ174',
    'У563СТ777',
    'У586ВМ750',
    'У711ХВ174',
    'У712ВТ55',
    'У726КУ77',
    'У733РМ750',
    'У769УВ750',
    'У778ХХ21',
    'У791ТР750',
    'У801ТР174',
    'У854ТА750',
    'У879ТХ750',
    'У913НТ777',
    'У915ВХ55',
    'У947РЕ750',
    'У954ВР799',
    'У979ВК750',
    'УА20777',
    'УА23177',
    'УВ10777',
    'УМ31977',
    'УН37677',
    'Х051СВ163',
    'Х055ВС163',
    'Х164СЕ777',
    'Х169ХТ161',
    'Х170ТР750',
    'Х186ТС750',
    'Х230НХ777',
    'Х308ТС750',
    'Х409СН750',
    'Х559РМ777',
    'Х795СА750',
    'Х940СМ750',
    'Х948ЕМ163',
    'Х976АМ750',
    'Х976ХС174',
    'Х987ХА178',
    'ХА45677',
    'ХА52177',
    'ХК50477',
    'ХР69377',
    'ХТ86677',
    'ХХ58277',
    'ХХ59577',
    'А010ТХ750',
    'А018ВР799',
    'А072РК161',
    'А152УТ196',
    'А183АА174',
    'А186ХН174',
    'А198РМ750',
    'А230АА147',
    'А230НР750',
    'А298КМ799',
    'А362ТЕ186',
    'А441ВС799',
    'А477НЕ716',
    'А479ВУ799',
    'А507ВХ196',
    'А557РР763',
    'А567ХК174',
    'А660УВ750',
    'А680ТН750',
    'А682ТН750',
    'А768УА750',
    'А780ХА777',
    'А790ТМ750',
    'А839ВЕ799',
    'А958ТУ750',
    'А989ХТ190',
    'АМ36799',
    'АМ68699',
    'АМ75199',
    'АР60899',
    'АУ02999',
    'В009УН77',
    'В055ЕУ799',
    'В074ВТ799',
    'В129ТХ750',
    'В156УР777',
    'В158ТУ750',
    'В166КХ95',
    'В168ХЕ174',
    'В196ХА174',
    'В203ТК750',
    'В228ХХ196',
    'В388АТ198',
    'В474ЕВ79',
    'В566ЕР750',
    'В580ТС134',
    'В622РН123',
    'В627НМ777',
    'В655МТ799',
    'В729ТК750',
    'В740ТХ95',
    'В775НТ198',
    'В826АВ50',
    'В864ЕХ799',
    'В889ТР750',
    'В945УК750',
    'Е018АМ196',
    'Е028МА154',
    'Е066КУ196',
    'Е078ЕМ750',
    'Е118РК750',
    'Е156ХУ777',
    'Е159УВ154',
    'Е178ЕК123',
    'Е221ВУ750',
    'Е267УР21',
    'Е317ХР174',
    'Е322КТ750',
    'Е323УС777',
    'Е379ХТ154',
    'Е415УВ174',
    'Е446СС750',
    'Е507СТ77',
    'Е511ХЕ21',
    'Е546ТУ750',
    'Е551СА750',
    'Е567РВ750',
    'Е583ТМ750',
    'Е599УК750',
    'Е603МУ799',
    'Е797ТУ750',
    'Е812ВМ197',
    'Е827ТУ750',
    'Е837УЕ154',
    'Е865ТУ750',
    'Е926ХТ154',
    'Е928СА178',
    'Е933УА750',
    'Е969УМ777',
    'Е975УК750',
    'Е988СС750',
    'Е993ВК799',
    'К006КМ750',
    'К016НЕ799',
    'К045АВ154',
    'К046ХХ161',
    'К049ХТ174',
    'К060АН196',
    'К081СМ750',
    'К096РН777',
    'К100ВУ39',
    'К112ТХ174',
    'К126НК196',
    'К195АМ154',
    'К206УК123',
    'К209ТН13',
    'К221ЕМ190',
    'К239РТ196',
    'К317РХ159',
    'К407ТС13',
    'К512ТЕ750',
    'К574КР799',
    'К593УК196',
    'К595АН196',
    'К637ММ196',
    'К651РК13',
    'К672УС36',
    'К674АР196',
    'К726СТ750',
    'К760СТ750',
    'К795ВУ799',
    'К814ЕА799',
    'К815МЕ196',
    'К822ЕУ196',
    'К974МТ799',
    'КА42077',
    'КВ73277',
    'КК75166',
    'КМ29766',
    'КМ29866',
    'КМ40366',
    'КМ97266',
    'М030АЕ799',
    'М040КК124',
    'М049ВМ199',
    'М095ТС95',
    'М112УК750',
    'М205ТР750',
    'М228ХК190',
    'М250ТТ750',
    'М318ХТ174',
    'М345ТА750',
    'М477ТН750',
    'М562УВ174',
    'М587АС799',
    'М673УВ174',
    'М781УВ174',
    'М856АМ799',
    'М863НА190',
    'М890ВА799',
    'МВ67777',
    'МК56677',
    'МК73477',
    'МН03677',
    'МН21177',
    'МТ13577',
    'МТ70977',
    'МТ73977',
    'Н013НТ154',
    'Н041СМ750',
    'Н043ТА750',
    'Н051НА777',
    'Н088ХХ174',
    'Н139УВ174',
    'Н143УС154',
    'Н159ЕК190',
    'Н182НМ154',
    'Н281ХХ154',
    'Н327РН750',
    'Н337ХС161',
    'Н352МВ799',
    'Н400НН154',
    'Н402ХС178',
    'Н423ЕК50',
    'Н429ТН750',
    'Н431ТН750',
    'Н463УВ174',
    'Н534АТ799',
    'Н545КР154',
    'Н589НН174',
    'Н644АВ750',
    'Н655ЕК72',
    'Н691МВ799',
    'Н730ВХ799',
    'Н732УС154',
    'Н740НМ154',
    'Н756ЕЕ750',
    'Н804КР154',
    'Н804НК154',
    'Н835КМ190',
    'Н844НК154',
    'Н851АХ750',
    'Н907АС799',
    'Н926СР750',
    'Н930КК154',
    'Н950РС750',
    'Н953ТХ750',
    'НЕ51077',
    'НК44977',
    'НН62377',
    'НУ38777',
    'НХ42777',
    'НХ98677',
    'Р062ТТ750',
    'Р107УС39',
    'Р112УА152',
    'Р138ТТ750',
    'Р167ХА39',
    'Р209АХ152',
    'Р250УТ777',
    'Р260ХК174',
    'Р286ТА750',
    'Р294ТС750',
    'Р306РА161',
    'Р317СТ750',
    'Р320ТС750',
    'Р326ВХ50',
    'Р330УН152',
    'Р332ХТ39',
    'Р345ТА152',
    'Р349АТ799',
    'Р374АК152',
    'Р417УА750',
    'Р475ТА152',
    'Р478МС36',
    'Р571ЕС799',
    'Р589ЕС799',
    'Р612КМ799',
    'Р615КВ799',
    'Р621СК777',
    'Р647УК777',
    'Р678МВ799',
    'Р682НЕ47',
    'Р690ТС750',
    'Р692ВН777',
    'Р695ТС750',
    'Р716НН174',
    'Р737АЕ799',
    'Р749СТ777',
    'Р779УС152',
    'Р803ТС39',
    'Р805СУ96',
    'Р820МВ39',
    'Р928КУ799',
    'Р951ХУ174',
    'Р978ТМ777',
    'Р990РВ39',
    'РР05777',
    'РР05877',
    'РР25277',
    'РР28177',
    'РС09877',
    'РХ34077',
    'С053НС190',
    'С067ТХ116',
    'С109УА750',
    'С113ЕР39',
    'С113РН777',
    'С185ЕР163',
    'С312НМ799',
    'С326ТЕ750',
    'С332ВС799',
    'С459ВН799',
    'С509ЕЕ39',
    'С575АС163',
    'С581НР799',
    'С628АС39',
    'С684ЕТ799',
    'С692ХУ174',
    'С728ТВ750',
    'С733АР50',
    'С815ВУ39',
    'С816МТ799',
    'С817УС777',
    'С828НУ750',
    'С833ЕЕ39',
    'С842УА174',
    'С849УА174',
    'С851ЕЕ39',
    'С910АС178',
    'С921МН799',
    'СА13277',
    'СА13777',
    'Т008ТН750',
    'Т069АУ799',
    'Т083ТА750',
    'Т135ХХ161',
    'Т170ХХ161',
    'Т309КТ799',
    'Т338СУ750',
    'Т417СУ77',
    'Т488КН178',
    'Т544СТ750',
    'Т570ТР750',
    'Т604СХ750',
    'Т629СТ777',
    'Т672ХМ174',
    'Т681ЕК55',
    'Т699СУ36',
    'Т715АВ50',
    'Т740ЕВ799',
    'Т763АХ799',
    'Т817ХК174',
    'Т988РУ55',
    'ТР13877',
    'ТР15577',
    'ТР16277',
    'ТР16777',
    'ТР17977',
    'ТР18677',
    'ТР31977',
    'ТР36977',
    'ТР54377',
    'ТР54677',
    'ТР63777',
    'ТР66877',
    'ТР67877',
    'ТР68677',
    'ТР68777',
    'ТР71177',
    'ТС21477',
    'ТУ30977',
    'ТУ31877',
    'У004УВ750',
    'У060УТ47',
    'У147ТС750',
    'У229ТХ777',
    'У248ХУ174',
    'У340НК750',
    'У400ХС174',
    'У408КР799',
    'У516РВ750',
    'У533МУ799',
    'У674ТУ161',
    'У701МЕ799',
    'У734МВ178',
    'У785ТУ174',
    'У792ЕА799',
    'У951ТК750',
    'У970ТР750',
    'У992ВР799',
    'УА42377',
    'УМ12677',
    'Х129ТН777',
    'Х141ВР161',
    'Х173КУ799',
    'Х177УХ163',
    'Х240АХ136',
    'Х256РТ750',
    'Х347РХ777',
    'Х359АК799',
    'Х408КЕ750',
    'Х460АС799',
    'Х594ХУ174',
    'Х595ВТ799',
    'Х626ХС174',
    'Х649ВХ142',
    'Х669АВ750',
    'Х742ЕА799',
    'Х769ЕТ799',
    'Х812ХУ174',
    'Х816ТХ174',
    'Х835МЕ163',
    'Х871КЕ163',
    'ХА39477',
    'ХА60277',
    'ХК92677',
    'ХН76977',
    'ХН93777',
    'ХН96877',
    'ХР53477',
    'ХР77177',
    'ХР88777',
    'ХХ22077',
    'ХХ28977',
    '0213РВ40',
    'А127КЕ198',
    'А285МК763',
    'А385УВ750',
    'А398КХ763',
    'А433ТС716',
    'А478ВН750',
    'А522КВ763',
    'А592ТК750',
    'А698УА174',
    'А745РТ763',
    'А758ТУ777',
    'А771НУ750',
    'А879ХК763',
    'А962СВ777',
    'А972ТМ750',
    'А980УК750',
    'АК51077',
    'АМ11199',
    'АР57299',
    'АР82399',
    'АУ01799',
    'АУ03499',
    'В054ХК174',
    'В064УК750',
    'В078СК750',
    'В116СР750',
    'В148АА761',
    'В226ХВ174',
    'В259СУ777',
    'В310МР154',
    'В316НМ95',
    'В342ЕР799',
    'В413СН95',
    'В435СТ161',
    'В447СУ777',
    'В522КУ198',
    'В590ВК136',
    'В591АР799',
    'В611МЕ750',
    'В617КР77',
    'В686ВН750',
    'В691ЕА190',
    'В705МХ799',
    'В752ТХ750',
    'В765ХУ161',
    'В775ТС777',
    'В807МУ154',
    'В808ТН750',
    'В811ЕХ750',
    'В835УС77',
    'В869НА799',
    'В877АА198',
    'В910ТУ750',
    'В912ВС126',
    'В917РУ750',
    'В933ЕУ750',
    'В933ТА750',
    'В941НА161',
    'Е063АК750',
    'Е136РР134',
    'Е147РР134',
    'Е192РР134',
    'Е204РР134',
    'Е206ЕВ82',
    'Е218ЕА799',
    'Е220ЕС196',
    'Е283ВЕ799',
    'Е308АА154',
    'Е494РК161',
    'Е527РР750',
    'Е566ВС799',
    'Е574ВН76',
    'Е577ТТ196',
    'Е577ТУ750',
    'Е604ТУ750',
    'Е609ТУ750',
    'Е661УС154',
    'Е695ВХ134',
    'Е703ХР174',
    'Е760ВС799',
    'Е796ТТ750',
    'Е849УВ174',
    'Е888НА174',
    'Е911СН750',
    'Е917РА82',
    'К004СХ159',
    'К030АУ799',
    'К040НТ190',
    'К093АН196',
    'К137МН196',
    'К169ТХ174',
    'К202АН196',
    'К210ВМ777',
    'К218НЕ750',
    'К287УТ196',
    'К317КМ799',
    'К333ХЕ54',
    'К350РН750',
    'К422ТВ13',
    'К500РВ777',
    'К566АТ799',
    'К572СМ123',
    'К578КК154',
    'К578СК750',
    'К588МР39',
    'К618КМ196',
    'К626ТС13',
    'К637СТ750',
    'К732НЕ799',
    'К740ХК196',
    'К746УВ777',
    'К812ЕХ799',
    'К846ТУ750',
    'К871ХК196',
    'К882НУ13',
    'К883СТ750',
    'К900МН32',
    'К908НВ152',
    'К975РУ70',
    'К986УМ196',
    'К992УМ777',
    'КМ96266',
    'КМ96866',
    'М009ХТ174',
    'М125ХТ777',
    'М153РС777',
    'М176МХ750',
    'М232КУ159',
    'М261КМ750',
    'М321ТВ777',
    'М327ТТ750',
    'М397АТ799',
    'М408ВС159',
    'М449ТС750',
    'М462ХТ174',
    'М470ТЕ750',
    'М492ХТ174',
    'М540УА152',
    'М547СН750',
    'М632ТМ750',
    'М649АТ799',
    'М774ЕР799',
    'М866ВА799',
    'М897УВ174',
    'М903СК750',
    'М923УВ174',
    'М925НВ77',
    'М982СН750',
    'МН10377',
    'МН13577',
    'МС02377',
    'МТ07877',
    'МТ09877',
    'МТ12377',
    'МТ73877',
    'Н010ЕЕ154',
    'Н016НХ154',
    'Н016СУ750',
    'Н036МУ750',
    'Н081УВ174',
    'Н164СА777',
    'Н182МА799',
    'Н255ТА750',
    'Н283ВМ154',
    'Н330ВС777',
    'Н381МК750',
    'Н387ТН750',
    'Н398УР46',
    'Н423ЕС50',
    'Н446МХ40',
    'Н478ХХ154',
    'Н485УВ174',
    'Н510СХ750',
    'Н515АМ799',
    'Н631СР750',
    'Н634ВК154',
    'Н655ТС777',
    'Н668ВЕ154',
    'Н681УТ36',
    'Н729СН154',
    'Н764СТ154',
    'Н824МТ178',
    'Н837КН154',
    'Н900УС154',
    'Н904ТА750',
    'Н947НК154',
    'Н976РА750',
    'НВ65777',
    'НЕ56677',
    'НЕ57177',
    'НЕ57677',
    'НЕ58377',
    'НЕ58877',
    'НЕ87477',
    'НК17277',
    'НК45077',
    'НМ64977',
    'НН06677',
    'НР31277',
    'НС24777',
    'НС42077',
    'НХ59877',
    'НХ98477',
    'Р033ХА777',
    'Р328АМ799',
    'Р364СН152',
    'Р395СТ750',
    'Р492КУ39',
    'Р534УУ71',
    'Р610УН777',
    'Р620ЕС799',
    'Р635РМ750',
    'Р719ТС750',
    'Р765УС152',
    'Р809УС152',
    'Р930НУ124',
    'Р989СУ750',
    'Р994СК750',
    'РР05677',
    'РР28077',
    'РР50277',
    'РХ42377',
    'РХ49477',
    'РХ59677',
    'С005УА174',
    'С040ХМ174',
    'С198ЕК39',
    'С216ТМ750',
    'С224АН799',
    'С273ВВ39',
    'С285ТН750',
    'С332МН799',
    'С349РА50',
    'С401УА174',
    'С431НВ102',
    'С484АМ799',
    'С512ВУ116',
    'С512УН777',
    'С539ТС750',
    'С569ЕЕ39',
    'С658ВР39',
    'С659МЕ799',
    'С702ЕТ799',
    'С711ХМ174',
    'С736НТ750',
    'С770СЕ750',
    'С868НТ750',
    'С974КС799',
    'СА11577',
    'СА13477',
    'СА21377',
    'Т033УА750',
    'Т156ХВ55',
    'Т223ВУ116',
    'Т255СТ750',
    'Т338ХМ777',
    'Т461УА174',
    'Т463РА163',
    'Т526СТ750',
    'Т543СН55',
    'Т558ЕК99',
    'Т558ТН750',
    'Т629СВ102',
    'Т647ВУ71',
    'Т654УА55',
    'Т690ХМ55',
    'Т811ТА750',
    'Т813НМ55',
    'Т839АМ799',
    'Т847АН799',
    'Т966ХН59',
    'Т979УМ777',
    'ТР14377',
    'ТР14777',
    'ТР14877',
    'ТР15077',
    'ТР18377',
    'ТР18577',
    'ТР31477',
    'ТР31677',
    'ТР32477',
    'ТР54477',
    'ТР55377',
    'ТР55577',
    'ТР57177',
    'ТР57377',
    'ТР67577',
    'ТР68277',
    'ТР68577',
    'ТР71477',
    'ТР71577',
    'ТС49977',
    'ТС73777',
    'ТУ24577',
    'У126ВР98',
    'У181ЕТ750',
    'У244ТВ750',
    'У329СУ190',
    'У396МУ750',
    'У399ЕА799',
    'У43400163',
    'У464ТХ750',
    'У488ЕА799',
    'У519КК750',
    'У565УХ777',
    'У778УА750',
    'У824ТЕ750',
    'У867ЕР55',
    'У917ТХ161',
    'У943КС799',
    'УА80977',
    'УА92577',
    'УЕ80977',
    'УМ10477',
    'УМ11977',
    'УМ13077',
    'Х019ЕМ190',
    'Х108ЕУ116',
    'Х136СН174',
    'Х227НС777',
    'Х235РХ777',
    'Х265ТР777',
    'Х345СК750',
    'Х350ТК750',
    'Х421ВК96',
    'Х422НЕ161',
    'Х440КУ102',
    'Х500НР54',
    'Х504АВ163',
    'Х536КС799',
    'Х560НВ163',
    'Х686НА750',
    'Х701РК750',
    'Х735АА750',
    'Х810АА761',
    'Х896ТТ123',
    'Х977СУ750',
    'Х993РН161',
    'ХА40077',
    'ХА55277',
    'ХЕ79377',
    'ХК88177',
    'ХР81177',
    'ХУ49177',
    'ХУ51877',
    'ХХ33777',
    'ХХ40677',
    'ХХ40777',
    'ХХ49277',
    '0389ТТ152',
    'А045УК750',
    'А079УН190',
    'А107ВН198',
    'А211НС750',
    'А256ХН174',
    'А263ХН174',
    'А293УС154',
    'А412УА777',
    'А423ХЕ777',
    'А529ТТ190',
    'А548РМ763',
    'А604ХК174',
    'А607КР799',
    'А623СА763',
    'А707ТН750',
    'А822АХ763',
    'А901СУ750',
    'А934ЕХ799',
    'А935УН763',
    'А961ХС777',
    'АМ61499',
    'АХ78899',
    'В033УМ47',
    'В107РН750',
    'В128ЕС154',
    'В218УА174',
    'В312АВ777',
    'В403ТК750',
    'В440НУ95',
    'В558АХ82',
    'В648ТР750',
    'В649УТ777',
    'В769ВЕ50',
    'В779НК799',
    'В793ВВ750',
    'В832ХЕ95',
    'В862ЕТ799',
    'В918ХС174',
    'Е074ТВ73',
    'Е091ЕТ50',
    'Е122РР178',
    'Е185ТР750',
    'Е208ТР750',
    'Е223РР134',
    'Е270ВН799',
    'Е301КР154',
    'Е320ТР190',
    'Е341СТ750',
    'Е346ХТ154',
    'Е425УМ777',
    'Е570ХР174',
    'Е592ВС799',
    'Е637РХ82',
    'Е641АН799',
    'Е695КВ154',
    'Е708ЕР799',
    'Е714ЕР154',
    'Е738ЕТ196',
    'Е763РУ777',
    'Е771ЕМ154',
    'Е774ТВ154',
    'Е778ТХ190',
    'Е794НМ199',
    'Е818ТХ174',
    'Е833ХЕ21',
    'Е892ЕА799',
    'Е960ХУ777',
    'ЕР32377',
    'К105ХХ190',
    'К192ХК196',
    'К340ХЕ196',
    'К363ХВ777',
    'К429НЕ750',
    'К457ХТ161',
    'К505УЕ777',
    'К533РН152',
    'К585ХЕ196',
    'К586ТУ750',
    'К589АУ777',
    'К613АН154',
    'К620УУ196',
    'К637СА196',
    'К712ХМ196',
    'К801СК13',
    'К836РВ196',
    'К868ТК123',
    'К892КУ196',
    'КМ96366',
    'КМ96766',
    'КУ00277',
    'М030ХТ777',
    'М132АХ799',
    'М152ХМ777',
    'М153ВУ799',
    'М161РВ750',
    'М259ЕК750',
    'М275НР799',
    'М311ТТ161',
    'М341ХН777',
    'М394ТС161',
    'М514ТЕ750',
    'М528ТЕ750',
    'М553ЕН799',
    'М597МХ750',
    'М654МК152',
    'М655МК152',
    'М762МТ750',
    'М796ХМ161',
    'М843АМ799',
    'М845СВ750',
    'М848АН799',
    'М868ТЕ750',
    'М952СК777',
    'МВ51977',
    'МК98877',
    'ММ06577',
    'ММ18977',
    'МН10177',
    'МН10777',
    'МН11077',
    'МО92377',
    'МТ09377',
    'МТ13677',
    'МТ19677',
    'МТ19777',
    'МТ50377',
    'МТ71377',
    'Н076УВ750',
    'Н113РР161',
    'Н137НЕ750',
    'Н156НМ154',
    'Н158ТА750',
    'Н161МК799',
    'Н269УН46',
    'Н347СА750',
    'Н367НМ154',
    'Н380ЕУ154',
    'Н440УВ174',
    'Н462ТА750',
    'Н508КР799',
    'Н527ЕТ154',
    'Н541КТ154',
    'Н572УХ40',
    'Н674ХХ190',
    'Н706ВЕ154',
    'Н709УВ174',
    'Н757СТ154',
    'Н769ЕР154',
    'Н808ХХ154',
    'Н812УВ174',
    'Н842РА750',
    'Н920СТ154',
    'НЕ56777',
    'НР09977',
    'НС58177',
    'Р102СЕ152',
    'Р130ХУ174',
    'Р193ЕТ152',
    'Р260АУ799',
    'Р320КЕ799',
    'Р408ХЕ777',
    'Р425СА750',
    'Р437СН152',
    'Р452ТМ750',
    'Р485ТУ750',
    'Р485ХТ174',
    'Р580ХЕ39',
    'Р588ВА750',
    'Р607СМ152',
    'Р693ВЕ799',
    'Р701РК152',
    'Р708ХХ39',
    'Р736ВТ152',
    'Р746СА39',
    'Р767ТК750',
    'Р779НН750',
    'Р784ТХ161',
    'Р790МК39',
    'Р838СЕ750',
    'Р839ВА705',
    'Р861КР799',
    'Р899ТУ152',
    'Р919РС116',
    'Р920ТУ39',
    'РР68977',
    'РС08777',
    'РС10077',
    'РХ48377',
    'С041ТС750',
    'С127КЕ799',
    'С128РС750',
    'С146ТХ161',
    'С180УК777',
    'С193КВ799',
    'С194ХА197',
    'С202ТУ750',
    'С332УВ750',
    'С345УМ72',
    'С423СХ750',
    'С643МС750',
    'С781УА777',
    'С845ЕХ163',
    'С852АУ39',
    'С911МУ799',
    'С930МУ799',
    'С934ТР777',
    'С961НВ799',
    'С983ХМ55',
    'СА14277',
    'Т009СТ750',
    'Т177КМ799',
    'Т183КМ77',
    'Т321ВЕ55',
    'Т322ВН799',
    'Т336УУ55',
    'Т470СТ750',
    'Т471НВ33',
    'Т480СУ750',
    'Т562СК750',
    'Т574СК750',
    'Т605УА174',
    'Т695ТР750',
    'Т741МЕ71',
    'Т785АВ799',
    'Т801МК799',
    'Т835ТК161',
    'ТР17477',
    'ТР18877',
    'ТР28077',
    'ТР31577',
    'ТР31877',
    'ТР54777',
    'ТР54977',
    'ТР55877',
    'ТР62777',
    'ТР66677',
    'ТС21977',
    'ТУ30877',
    'У078СР777',
    'У105УА96',
    'У174УА161',
    'У254СН750',
    'У301ХС174',
    'У553КТ799',
    'У641АР186',
    'У643АМ799',
    'У681УТ163',
    'У765СА777',
    'У869РС777',
    'У886ЕХ777',
    'У900ХУ777',
    'У953ТР750',
    'УВ11077',
    'УВ72477',
    'УВ85477',
    'УН80877',
    'Х076ЕХ163',
    'Х083АР136',
    'Х0930С96',
    'Х154МС799',
    'Х171ЕК163',
    'Х365ЕК96',
    'Х513ТВ750',
    'Х563РА47',
    'Х606СК777',
    'Х694ТК777',
    'Х695АХ136',
    'Х859ХМ174',
    'Х868АР750',
    'Х879АУ799',
    'Х904СМ163',
    'Х918РТ750',
    'Х969КТ777',
    'Х974МВ799',
    'Х987ТЕ750',
    'ХА24477',
    'ХЕ32977',
    'ХК86977',
    'ХР70077',
    'ХР97877',
    'ХХ02377',
    'ХХ38577',
    'ХХ70977',
    '7024СВ7',
    'А156МХ763',
    'А172НВ750',
    'А196РМ763',
    'А2180Х716',
    'А270НВ799',
    'А307ТЕ750',
    'А311НН750',
    'А329ТС777',
    'А375НА196',
    'А409КМ45',
    'А487МС750',
    'А559СР750',
    'А563УВ174',
    'А582УР777',
    'А690НР799',
    'А710ЕВ799',
    'А727КУ152',
    'А763ТТ161',
    'А816РХ763',
    'А892ХВ126',
    'А990ТЕ763',
    'А995НК799',
    'АК54277',
    'АМ11099',
    'АХ2920АС',
    'В073ЕР799',
    'В074ТУ750',
    'В138ТУ777',
    'В261УВ750',
    'В301АХ136',
    'В310ЕС799',
    'В318КУ799',
    'В369АУ126',
    'В434НВ82',
    'В463СТ750',
    'В510НЕ799',
    'В660КХ799',
    'В766ВА750',
    'В801ТТ750',
    'В838ХК53',
    'В843ТХ95',
    'В893ТУ750',
    'Е126РР134',
    'Е152СК197',
    'Е168ВТ799',
    'Е200РР134',
    'Е214РА154',
    'Е237АУ799',
    'Е382УК750',
    'Е392АТ154',
    'Е433МЕ53',
    'Е467ТТ196',
    'Е520ХР161',
    'Е587НУ777',
    'Е640КУ154',
    'Е658РХ82',
    'Е666ТЕ750',
    'Е667УВ154',
    'Е847ТС750',
    'Е880УУ196',
    'Е882РР750',
    'Е915ЕХ154',
    'ЕР32477',
    'ЕТ99350',
    'К026ВР750',
    'К369МВ190',
    'К579УА750',
    'К595НЕ190',
    'К597РР750',
    'К768НУ750',
    'К830ТК777',
    'К850СЕ159',
    'КМ95266',
    'КМ95366',
    'КМ97366',
    'КМ97466',
    'КН79777',
    'КН94777',
    'КТ96377',
    'М018АВ196',
    'М059НС799',
    'М103СМ123',
    'М104ХТ777',
    'М117РН750',
    'М170УВ174',
    'М239РК178',
    'М249УВ174',
    'М262ТЕ197',
    'М270ТЕ750',
    'М355ЕЕ178',
    'М397УМ777',
    'М406ХС777',
    'М491ЕК799',
    'М558ТА750',
    'М600КВ799',
    'М671ТХ750',
    'М704ВМ799',
    'М721УВ174',
    'М838ВА799',
    'М977ТТ44',
    'ММ83777',
    'МТ12577',
    'Н101АХ799',
    'Н184УХ777',
    'Н293ХН174',
    'Н363ТН750',
    'Н382ТС750',
    'Н402МВ750',
    'Н416СС154',
    'Н455СС154',
    'Н460НТ93',
    'Н552УЕ777',
    'Н582УА152',
    'Н625ТС750',
    'Н633ТВ46',
    'Н642ТА750',
    'Н662НК799',
    'Н683ХХ174',
    'Н703ВН750',
    'Н808СМ777',
    'Н814МА152',
    'Н856КВ799',
    'Н925УВ190',
    'Н967РУ174',
    'Н970ЕК178',
    'НВ73077',
    'НЕ51477',
    'НЕ56377',
    'НЕ58177',
    'НН80277',
    'НР00777',
    'НС85777',
    'НТ00977',
    'НТ01077',
    'НУ20177',
    'НУ36477',
    'ОС19377',
    'Р034РТ190',
    'Р085КЕ799',
    'Р105УМ39',
    'Р225ВТ799',
    'Р243ХН39',
    'Р285ВУ799',
    'Р286РХ777',
    'Р381ЕН750',
    'Р472ТС777',
    'Р474АХ152',
    'Р530РС750',
    'Р532ВС799',
    'Р561СА152',
    'Р601МК799',
    'Р611МР116',
    'Р745ТК197',
    'Р766УС152',
    'Р858КВ799',
    'Р865ВМ750',
    'РХ91777',
    'С001ВЕ78',
    'С015УА174',
    'С031ВМ799',
    'С040ХН174',
    'С049ХН174',
    'С106МУ799',
    'С203ХУ197',
    'С258ХН161',
    'С287ТА750',
    'С311РХ777',
    'С545УА750',
    'С591УВ750',
    'С670УК55',
    'С787УТ161',
    'С793СЕ750',
    'С892ТС161',
    'С898ВА39',
    'С902АА39',
    'С914МУ799',
    'СА13077',
    'Т002УВ190',
    'Т027СТ750',
    'Т040РВ750',
    'Т043ХС66',
    'Т141УМ777',
    'Т275МЕ163',
    'Т369ТР777',
    'Т443ХК55',
    'Т485ТМ750',
    'Т504КР163',
    'Т535РР750',
    'Т673ХР777',
    'Т690НМ124',
    'Т789АР17',
    'Т847ВХ163',
    'Т912ТА750',
    'Т921ХА190',
    'ТР18177',
    'ТР32277',
    'ТР55977',
    'ТР62677',
    'ТР63477',
    'ТР65177',
    'ТР66777',
    'ТР68177',
    'ТР70077',
    'ТР70977',
    'ТС01977',
    'ТС33777',
    'ТТ51077',
    'ТУ14177',
    'ТУ29977',
    'ТУ33577',
    'У046ХМ102',
    'У054ТН777',
    'У064УУ154',
    'У079АС799',
    'У151МК55',
    'У342ТЕ750',
    'У419МС799',
    'У434ТЕ750',
    'У468ВР102',
    'У485МС799',
    'У648РМ777',
    'У653ХЕ190',
    'У700КС799',
    'У822ТХ190',
    'У854СЕ750',
    'У858ВС55',
    'У862УН777',
    'У892ТА750',
    'У969СС190',
    'УА97077',
    'УВ36377',
    'УВ42077',
    'УВ76577',
    'УМ05977',
    'УМ06277',
    'УМ30477',
    'УМ32077',
    'УУ42477',
    'УУ42577',
    'Х021НК750',
    'Х168СР47',
    'Х476ХР174',
    'Х492УА96',
    'Х596ТЕ777',
    'Х616МР124',
    'Х639НЕ102',
    'Х695ХН190',
    'Х716НЕ799',
    'Х779ХТ161',
    'Х788РЕ750',
    'Х888ТХ174',
    'Х898РК750',
    'Х900РС150',
    'Х904ВМ163',
    'Х906ВХ163',
    'Х917ВУ799',
    'Х947УТ777',
    'Х952ХС777',
    'ХН98377',
    'ХР74377',
    'ХР88277',
    'ХХ46577',
    'ХХ49077',
    'ХХ85877',
    'А003ТВ750',
    'А020УК750',
    'А235УК161',
    'А270ТТ716',
    'А324НК750',
    'А475ХР161',
    'А500НС799',
    'А503АК799',
    'А607ВУ799',
    'А707МВ763',
    'А943УА174',
    'А955НХ186',
    'В054ЕР97',
    'В072КС799',
    'В109АУ750',
    'В336ЕА159',
    'В437СА750',
    'В439СУ750',
    'В456АХ196',
    'В546РВ196',
    'В567КХ799',
    'В601КР174',
    'В606ТХ161',
    'В654АХ799',
    'В708РС95',
    'В709УК750',
    'В710АА750',
    'В755ХЕ174',
    'В810НА799',
    'В864УВ777',
    'Е011ХВ154',
    'Е026ТЕ777',
    'Е085РУ82',
    'Е127ВУ08',
    'Е130РР134',
    'Е139РР134',
    'Е142РР134',
    'Е145РР134',
    'Е161РР134',
    'Е193ЕН196',
    'Е225АУ799',
    'Е297ХР174',
    'Е329ВТ799',
    'Е366КС799',
    'Е387ТС750',
    'Е464УК777',
    'Е515ХУ174',
    'Е526МТ799',
    'Е656РК777',
    'Е722УА750',
    'Е866ТА750',
    'Е867РН750',
    'Е989ЕУ799',
    'К001СХ159',
    'К114УЕ777',
    'К146ХЕ96',
    'К203ХН190',
    'К300УТ196',
    'К325ТЕ750',
    'К353НК750',
    'К358ХК196',
    'К442МЕ196',
    'К484СР159',
    'К599ММ196',
    'К669ХЕ196',
    'К697ТМ777',
    'К731МУ196',
    'К733ТР750',
    'К745ХУ777',
    'К776ХТ161',
    'К818КС77',
    'К933КР13',
    'КМ94866',
    'КМ94966',
    'КМ95066',
    'КМ95566',
    'КМ95766',
    'КС95977',
    'КТ02377',
    'М165РС159',
    'М292СР750',
    'М314МС750',
    'М328ТЕ55',
    'М339МЕ32',
    'М472ХТ174',
    'М545АМ159',
    'М617АУ136',
    'М619КН799',
    'М675СР161',
    'М767УА750',
    'М784ТА750',
    'М843АВ136',
    'М889ЕХ799',
    'М945ТН161',
    'М975СР750',
    'М984ВМ799',
    'М986АС799',
    'МВ48077',
    'МВ48177',
    'ММ18877',
    'МН11477',
    'МН54377',
    'МТ74277',
    'МТ81277',
    'Н029МВ799',
    'Н086МА799',
    'Н142ТА750',
    'Н185КТ154',
    'Н185НН174',
    'Н234СТ154',
    'Н237ЕУ799',
    'Н363МВ799',
    'Н470НА799',
    'Н587КМ154',
    'Н587УВ154',
    'Н639ТУ777',
    'Н707УВ174',
    'Н827КН799',
    'Н916АН154',
    'НЕ73577',
    'НС75077',
    'НХ99477',
    'Р051СХ750',
    'Р152ХМ161',
    'Р164ТС750',
    'Р210ТС161',
    'Р259ХХ86',
    'Р265ТУ39',
    'Р300КН750',
    'Р364ТТ161',
    'Р401УМ39',
    'Р610НЕ750',
    'Р621СВ777',
    'Р640СТ777',
    'Р692СМ777',
    'Р736ЕВ799',
    'Р737СУ750',
    'Р783МН152',
    'Р788СТ777',
    'Р847НР777',
    'Р871ТХ71',
    'РР37677',
    'РР51377',
    'РС06577',
    'РС49477',
    'С004РН163',
    'С062ХМ161',
    'С085ХС777',
    'С256ЕК750',
    'С291СР190',
    'С452УА174',
    'С480РУ55',
    'С481ХН174',
    'С637АУ799',
    'С667МЕ799',
    'С699ХУ174',
    'С719СЕ750',
    'С914КА39',
    'С982КМ799',
    'С991КЕ777',
    'СА21177',
    'Т197УС777',
    'Т230МА750',
    'Т235КМ19',
    'Т244ТН96',
    'Т393АТ799',
    'Т541СК750',
    'Т588КУ799',
    'Т671КН50',
    'Т732АВ799',
    'Т781ХВ',
    'Т794СЕ71',
    'Т980ВХ750',
    'ТР16177',
    'ТР17877',
    'ТР18077',
    'ТР54577',
    'ТР62877',
    'ТР64077',
    'ТР64577',
    'ТР69077',
    'ТР70177',
    'ТС55277',
    'ТУ49677',
    'У170СА190',
    'У205НН750',
    'У268АУ799',
    'У407АА178',
    'У500РТ777',
    'У517ТТ163',
    'У544ТУ750',
    'У575НХ124',
    'У655НР799',
    'У989АМ799',
    'УК81677',
    'УМ10377',
    'УМ10677',
    'Х022ХХ190',
    'Х048РВ750',
    'Х117ВМ50',
    'Х120ХС777',
    'Х153КЕ777',
    'Х241АК750',
    'Х308ТН750',
    'Х488ВМ799',
    'Х608ТС777',
    'Х640ХС163',
    'Х798ХМ174',
    'Х848ВС799',
    'Х854ВР163',
    'Х887СУ777',
    'ХК58177',
    'ХН93677',
    'ХР68677',
    'ХР74677',
    'ХУ37777',
    'ХХ53277',
    'А178РР763',
    'А205ХВ763',
    'А255ХХ190',
    'А256АМ116',
    'А263УУ24',
    'А392НА750',
    'А446МЕ799',
    'А450ЕР763',
    'А467ЕР799',
    'А471СХ196',
    'А539ХС174',
    'А573РХ777',
    'А614МУ60',
    'А645ЕА799',
    'А705ТН750',
    'А713КЕ174',
    'А718СУ750',
    'А724КК50',
    'А920СУ199',
    'А925СА69',
    'А946ЕА716',
    'АМ12399',
    'АУ00699',
    'АУ05499',
    'В080РС198',
    'В093ТУ750',
    'В315СТ95',
    'В354ТВ750',
    'В355КМ799',
    'В569АН123',
    'В732ХВ161',
    'В748ТЕ750',
    'В773СУ750',
    'В789ТУ750',
    'В794МЕ799',
    'В884ТХ161',
    'В895ЕУ124',
    'В932ВХ799',
    'В957УА123',
    'В963ТМ777',
    'В975ТТ750',
    'В987ТХ750',
    'Е128ТС77',
    'Е177АВ777',
    'Е185ХМ196',
    'Е257МС799',
    'Е304ТР197',
    'Е447ЕХ799',
    'Е524ТУ750',
    'Е550ТА777',
    'Е593КМ799',
    'Е633ТУ750',
    'Е670ХЕ190',
    'Е738ТТ196',
    'Е845ХЕ777',
    'Е911АУ196',
    'Е967НМ154',
    'К017ХА196',
    'К148ХМ174',
    'К219ТЕ777',
    'К297ТМ13',
    'К443ХР161',
    'К510ТК13',
    'К511ТТ13',
    'К563ВВ136',
    'К626АМ154',
    'К632ЕТ142',
    'К650КН799',
    'К659ХР161',
    'К663МЕ799',
    'К668РС159',
    'К733НУ750',
    'К775МУ196',
    'К810ТК750',
    'КМ95966',
    'КМ97166',
    'КТ13977',
    'М153РХ777',
    'М195ТЕ750',
    'М254НА799',
    'М263УН777',
    'М436ХТ777',
    'М511РХ197',
    'М583АР799',
    'М588АС750',
    'М698СВ750',
    'М725ТР152',
    'М731АР750',
    'М799ХМ197',
    'М822МК799',
    'М847ТР777',
    'М928МВ799',
    'МВ67177',
    'ММ05577',
    'МТ10377',
    'МТ11477',
    'Н030СР750',
    'Н075УВ174',
    'Н098КН197',
    'Н177ХЕ174',
    'Н186КТ154',
    'Н257СН154',
    'Н287КС799',
    'Н287МТ799',
    'Н291ТЕ750',
    'Н301УВ174',
    'Н334УС154',
    'Н545ХВ161',
    'Н568ВМ799',
    'Н622УТ152',
    'Н709КС799',
    'Н788НУ190',
    'Н822ЕХ777',
    'Н878МЕ799',
    'НЕ56477',
    'НЕ58977',
    'НЕ59177',
    'НМ64477',
    'НТ01377',
    'НХ98777',
    'Р051ТХ152',
    'Р125РН777',
    'Р399ЕЕ09',
    'Р468ХУ174',
    'Р574ВУ163',
    'Р604МН799',
    'Р734СВ777',
    'Р806НУ124',
    'Р835СК777',
    'Р837МС799',
    'Р974ХУ174',
    'Р998СС750',
    'РР11377',
    'РР50177',
    'РС10177',
    'РХ72877',
    'С112ХН174',
    'С220ХХ174',
    'С227ТА750',
    'С251ЕК750',
    'С337ТВ750',
    'С574НС799',
    'С611НТ190',
    'С639МК799',
    'С660ХХ161',
    'С709АС39',
    'С814УК750',
    'С853ХМ777',
    'С895ТС98',
    'С909ХВ190',
    'С933КА39',
    'С960МВ55',
    'СА12377',
    'СА12477',
    'СА13377',
    'СА13977',
    'СА22277',
    'Т033СТ750',
    'Т160ВН799',
    'Т299АК799',
    'Т304УА174',
    'Т378ХР777',
    'Т436ТС116',
    'Т457ЕУ799',
    'Т517СУ750',
    'Т552МК190',
    'Т596АМ799',
    'Т639НМ197',
    'Т735УА750',
    'Т816НЕ750',
    'Т941ТК750',
    'ТР14177',
    'ТР14477',
    'ТР63677',
    'ТР65277',
    'ТР68877',
    'ТР69477',
    'ТС02277',
    'ТС49777',
    'ТУ24777',
    'ТУ25177',
    'ТУ81877',
    'У093ТХ161',
    'У331УХ161',
    'У411ТХ777',
    'У418КВ154',
    'У457ЕВ99',
    'У461УА750',
    'У499ВК55',
    'У509ТР750',
    'У515ЕК799',
    'У562КУ799',
    'У565ВА116',
    'У660ТР750',
    'У732ВТ55',
    'У747ВК55',
    'У758ЕН142',
    'У852НР750',
    'У875ТХ750',
    'У892ВУ799',
    'У963НХ161',
    'УВ85577',
    'УН42477',
    'УУ59377',
    'УУ59577',
    'Х142АТ799',
    'Х250РУ777',
    'Х382ТС777',
    'Х398СН777',
    'Х406МУ750',
    'Х486АР799',
    'Х509ТХ174',
    'Х527ХВ190',
    'Х713ВС799',
    'Х756НХ777',
    'Х779УН163',
    'Х827НВ799',
    'Х909НУ96',
    'ХА32377',
    'ХР01577',
    'ХР59277',
    'ХХ21877',
    'А153УВ777',
    'А192НР799',
    'А276УА186',
    'А317ВЕ124',
    'А402СА763',
    'А407ХР777',
    'А472СЕ750',
    'А635РН763',
    'А726ХК174',
    'А781СК197',
    'А849ЕВ124',
    'В038ВТ799',
    'В095ТУ750',
    'В148ТК777',
    'В167СУ750',
    'В204НС716',
    'В284УВ750',
    'В425СХ750',
    'В495ВР196',
    'В567СХ750',
    'В647КЕ799',
    'В658УА174',
    'В668ЕР196',
    'В747АР799',
    'В840ВА799',
    'В851НК123',
    'В986ТР750',
    'Е255НР82',
    'Е264НМ154',
    'Е273ТН150',
    'Е448СС77',
    'Е520ТВ154',
    'Е635РХ82',
    'Е746СМ196',
    'Е776РМ54',
    'Е970НМ96',
    'Е978УУ161',
    'К022ТА750',
    'К117ТМ750',
    'К169СТ750',
    'К249ВА799',
    'К255ХН161',
    'К289УА174',
    'К453ЕА799',
    'К612ТК750',
    'К666АТ13',
    'К700ТУ750',
    'К716СТ750',
    'К744РА159',
    'К750ВХ196',
    'К856ТР13',
    'К888МК150',
    'К927ВТ799',
    'КВ39566',
    'КМ96066',
    'КМ96666',
    'М181НВ152',
    'М236НМ750',
    'М250ЕР799',
    'М263ТЕ750',
    'М283ТМ750',
    'М381ЕЕ777',
    'М399АХ799',
    'М438МН799',
    'М447АТ799',
    'М483ТС161',
    'М541ТВ197',
    'М775ТС161',
    'М827ЕС799',
    'М858АЕ799',
    'М880УВ174',
    'М883ХТ174',
    'М891ЕЕ777',
    'М966ХТ174',
    'М979РН152',
    'МВ47877',
    'МВ67277',
    'МС03177',
    'МТ71277',
    'МТ73777',
    'МТ81377',
    'Н050ТУ750',
    'Н052ТА750',
    'Н094КХ125',
    'Н106ТН750',
    'Н169АУ799',
    'Н169НН161',
    'Н179СА154',
    'Н219ТУ178',
    'Н220РА777',
    'Н441ТС750',
    'Н442ХН174',
    'Н467ЕК152',
    'Н836ХУ154',
    'Н905ТР750',
    'Н998НР750',
    'НЕ51977',
    'НК61677',
    'НН51777',
    'НТ01877',
    'НХ92177',
    'Р061НВ58',
    'Р062СК197',
    'Р104РС750',
    'Р143ЕМ799',
    'Р181АУ152',
    'Р257ТН161',
    'Р257УР39',
    'Р292ТК750',
    'Р333СХ197',
    'Р436СН152',
    'Р450ТС161',
    'Р488УВ777',
    'Р515ХВ777',
    'Р519УА152',
    'Р564МК124',
    'Р576НР799',
    'Р659УВ750',
    'Р660КР799',
    'Р719РС750',
    'Р734ВТ777',
    'Р746НВ152',
    'Р845СЕ750',
    'РС09577',
    'РС11277',
    'РС12077',
    'С058ХМ161',
    'С059ХН197',
    'С111УА174',
    'С112АВ750',
    'С319МВ799',
    'С421УА174',
    'С446ЕЕ39',
    'С452КР196',
    'С468МА799',
    'С511СВ750',
    'С758НУ750',
    'С804ТМ777',
    'С827ТА750',
    'С835ТА43',
    'С869ЕТ750',
    'С965СТ750',
    'СА11377',
    'Т007СК90',
    'Т052МВ799',
    'Т164СА163',
    'Т240ТВ777',
    'Т296ХА777',
    'Т365УВ42',
    'Т378ХУ161',
    'Т394МА777',
    'Т472АХ96',
    'Т472СА777',
    'Т476НК72',
    'Т478РА55',
    'Т629РР96',
    'Т637КУ799',
    'Т660УТ57',
    'Т942МК799',
    'Т977ТХ55',
    'ТР15777',
    'ТР32577',
    'ТР41377',
    'ТР55177',
    'ТР56877',
    'ТР64377',
    'ТР68477',
    'ТР69677',
    'ТР70877',
    'ТС02577',
    'ТС29577',
    'ТС51077',
    'ТУ20377',
    'ТУ30277',
    'ТУ31377',
    'У075ЕК55',
    'У151КМ55',
    'У174ХМ174',
    'У239ХТ174',
    'У344ТА750',
    'У380КТ55',
    'У451АТ799',
    'У454КУ799',
    'У526УК750',
    'У527КТ55',
    'У673КМ750',
    'У924УЕ161',
    'УВ78177',
    'УВ85377',
    'УЕ68377',
    'УМ12777',
    'Х053АК799',
    'Х172АТ799',
    'Х176ЕК163',
    'Х212ЕК163',
    'Х331РК777',
    'Х335АК163',
    'Х350ВК750',
    'Х405ХМ174',
    'Х419МТ799',
    'Х429МВ799',
    'Х848УК777',
    'Х857КУ750',
    'Х905ТЕ750',
    'Х959ХА777',
    'ХА63577',
    'ХК74377',
    'ХР75677',
    'ХР77877',
    'ХХ28877',
    'ХХ53177',
    'ОР15477',
    'ОР15377',
    'ОР15277',
    'ОР15177',
    'ОР15077',
    'ОР14977',
    'ОР14677',
    'ОР14777',
    'ОР14877',
    'ОР15577',
    'ОР15677',
    'ОР15777',
    'ОР15877',
    'ОР15977',
    'ОР16077',
    'ОС19477',
    'ОС17977',
    'ОС18377',
    'ОС18277',
    'ОС18077',
    'ОС18177',
    'ОС19577',
    'ОС19677',
    'ОС18477',
    'ОС18977',
    'ОС18777',
    'ОС18877',
    'ОР11277',
    'ОР10977',
    'ОР10677',
    'ОС19977',
    'ОС20077',
    'ОР10777',
    'ОС19077',
    'ОС18677',
    'ОС19777',
    'ОС19877',
    'ОР10577',
    'ОС18577',
    'ОС19177',
    'ОР10177',
    'ОР10277',
    'ОР10377',
    'ОР10477',
    'ОС19277',
    'ОР11177',
    'ОР10877',
    'ОР11777',
    'ОР11877',
    'ОР11677',
    'ОР11577',
    'ОР11477',
    'ОР11377',
    'ОР11977',
    'ОР16877',
    'ОР16677',
    'ОР16177',
    'ОР16277',
    'ОР16477',
    'ОР16577',
    'ОР16777',
    'ОР18477',
    'ОР18277',
    'ОР17477',
    'ОР17977',
    'ОР18577',
    'ОР18377',
    'ОР18177',
    'ОР17777',
    'ОР17077',
    'ОР16977',
    'ОР18077',
    'ОР17877',
    'ОР17677',
    'ОР17577',
    'ОР16377',
    'ОР17177',
    'ОР17277',
    'ОР17377',
    'ОР21077',
    'ОР20977',
    'ОР20877',
    'ОР20777',
    'ОР20677',
    'ОР20577',
    'ОР20477',
    'ОР20377',
    'ОР20277',
    'ОР19877',
    'ОР20177',
    'ОР19977',
    'ОР20077',
    'ОР19577',
    'ОР19777',
    'ОР19677',
    'ОР19477',
    'ОР19377',
    'ОР19277',
    'ОР19177',
    'ОР19077',
    'ОР18977',
    'ОР18877',
    'ОР18777',
    'ОР18677',
    'ОР21277',
    'ОР21377',
    'ОР21477',
    'ОР21777',
    'ОР21177',
    'ОР21877',
    'ОР21977',
    'ОР21577',
    'ОР21677',
    'ТР66977',
    'ТР71377',
    'ТР69277',
    'ТР69177',
    'ТР69777',
    'ТР70277',
    'СА21677',
    'СА22077',
    'СА22677',
    'СА20577'
];
const brandMarksConfig = [
    {
        mark: 'Старый UBER подтвердить',
        color: 'rgba(39, 255, 0, 0.83)',
        cities: ['Москва', 'Казань'],
        carNumber: uberOld,
        direction: 'branding'
    },
    {
        mark: 'Номер телефона на бортах',
        color: 'rgb(51, 158, 234, 0.85)',
        cities: [
            'Санкт-Петербург',
            'Сочи',
            'Краснодар',
            'Майкоп',
            'Анапа',
            'Армавир',
            'Новороссийск',
            'Елец',
            'Ставрополь',
            'Казань',
            'Белгород',
            'Пенза',
            'Старый Оскол',
            'Кемерово',
            'Новосибирск',
            'Бердск',
            'Барнаул',
            'Екатеринбург',
            'Нижний Новгород',
            'Челябинск',
            'Омск',
            'Томск',
            'Хабаровск',
            'Самара',
            'Ростов-на-Дону',
            'Уфа',
            'Красноярск',
            'Пермь',
            'Воронеж',
            'Волгоград',
            'Липецк',
            'Владимир',
            'Киров',
            'Рязань',
            'Ярославль',
            'Курск',
            'Брянск',
            'Набережные Челны',
            'Альметьевск',
            'Чебоксары',
            'Йошкар-Ола',
            'Калининград',
            'Артем',
            'Владивосток',
            'Находка',
            'Уссурийск',
            'Якутск',
            'Бийск',
            'Горно-Алтайск',
            'Кызыл',
            'Рубцовск',
            'Юрга',
            'Светлоград',
            'Михайловск',
            'Новомосковск',
            'Смоленск',
            'Тверь',
            'Тула',
            'Волгодонск',
            'Саранск',
            'Абакан',
            'Сургут',
            'Тюмень',
            'Благовещенск',
            'Ангарск',
            'Комсомольск-на-Амуре',
            'Южно-Сахалинск',
            'Арзамас',
            'Архангельск',
            'Балаково',
            'Березники',
            'Буденновск',
            'Владикавказ',
            'Вологда',
            'Георгиевск',
            'Димитровград',
            'Ессентуки',
            'Иваново',
            'Ижевск',
            'Иркутск',
            'Калуга',
            'Каспийск',
            'Кисловодск',
            'Ковров',
            'Кострома',
            'Магнитогорск',
            'Махачкала',
            'Миасс',
            'Муром',
            'Минеральные воды',
            'Невинномысск',
            'Новый Уренгой',
            'Ноябрьск',
            'Октябрьский',
            'Орел',
            'Оренбург',
            'Псков',
            'Пятигорск',
            'Рыбинск',
            'Салават',
            'Стерлитамак',
            'Тамбов',
            'Тольятти',
            'Ульяновск',
            'Череповец',
            'Энгельс',
            'Нефтекамск',
            'Новокузнецк',
            'Грозный',
            'Мурманск',
            'Каменск-Уральский',
            'Нижний Тагил',
            'Петрозаводск',
            'Сыктывкар',
            'Шадринск',
            'Курган',
            'Нефтеюганск',
            'Нижневартовск',
            'Выкса',
            'Саратов',
            'Астрахань',
            'Нальчик',
            'Братск',
            'Петропавловск-Камчатский',
            'Новочеркасск',
            'Таганрог',
            'Великие Луки',
            'Великий Новгород',
            'Обнинск',
            'Новотроицк',
            'Кунгур',
            'Можга',
            'Сарапул',
            'Соликамск',
            'Чайковский',
            'Изобильный',
            'Нефтекумск',
            'Элиста',
            'Шахты',
            'Норильск',
            'Волжский',
            'Камышин',
            'Улан-Удэ',
            'Чита',
            'Нягань',
            'Советский',
            'Тобольск',
            'Урай',
            'Ханты-Мансийск',
            'Югорск',
            'Северодвинск'
        ],
        direction: 'branding'
    },
    {
        mark: 'Шашки на переднем/заднем крыле',
        color: 'rgb(51, 158, 234, 0.85)',
        cities: ['Москва', 'Пенза'],
        direction: 'branding'
    },
    {
        mark: 'Старый UBER только черные двери',
        color: 'rgba(39, 255, 0, 0.83)',
        cities: ['Санкт-Петербург'],
        direction: 'branding'
    },
    {
        mark: 'Шашечный пояс',
        color: 'rgb(51, 158, 234, 0.85)',
        cities: [
            'Сочи',
            'Краснодар',
            'Анапа',
            'Армавир',
            'Белореченск',
            'Геленджик',
            'Туапсе',
            'Новороссийск'
        ],
        direction: 'branding'
    },
    {
        mark: 'Желтые/белые авто',
        color: 'rgba(241, 194, 50, 1)',
        cities: [
            'Сочи',
            'Краснодар',
            'Анапа',
            'Армавир',
            'Белореченск',
            'Геленджик',
            'Туапсе',
            'Новороссийск',
            'Казань',
            'Набережные Челны',
            'Нижнекамск',
            'Альметьевск'
        ],
        direction: 'branding'
    },
    {
        mark: 'Желтые/белые/серебристые авто',
        color: 'rgba(241, 194, 50, 1)',
        cities: ['Майкоп'],
        direction: 'branding'
    },
    {
        mark: 'только новый UBER',
        color: 'rgba(39, 255, 0, 0.83)',
        cities: [
            'Елец',
            'Казань',
            'Набережные Челны',
            'Нижнекамск',
            'Альметьевск',
            'Чебоксары',
            'Йошкар-Ола'
        ],
        direction: 'branding'
    },
    {
        mark: 'Подтверждать все автомобили',
        color: 'rgba(224, 102, 102, 1)',
        cities: ['Анжеро-Судженск', 'Лесной', 'Москаленки', 'Борисоглебск', 'Чусовой', 'Ставрополь'],
        direction: 'branding'
    },
    {
        mark: 'Новый бренд',
        color: 'rgb(51, 158, 234, 0.85)',
        cities: [
            'Витебск',
            'Гомель',
            'Гродно',
            'Жлобин',
            'Брест',
            'Могилев',
            'Бобруйск',
            'Жодино',
            'Мозырь',
            'Барановичи',
            'Лида',
            'Минск',
            'Речица',
            'Солигорск'
        ],
        direction: 'branding'
    },
    {
        mark: 'UBER только черные двери',
        color: 'rgba(39, 255, 0, 0.83)',
        cities: [
            'Витебск',
            'Гомель',
            'Гродно',
            'Жлобин',
            'Брест',
            'Могилев',
            'Бобруйск',
            'Жодино',
            'Мозырь',
            'Барановичи',
            'Лида',
            'Минск',
            'Речица',
            'Солигорск'
        ],
        direction: 'branding'
    },
    {
        mark: 'UBER - отключить',
        color: 'rgba(224, 102, 102, 1)',
        cities: [
            'Актобе',
            'Тараз',
            'Павлодар',
            'Костанай',
            'Караганда',
            'Уральск',
            'Кызылорда',
            'Семей',
            'Талдыкорган',
            'Атырау',
            'Петропавловск',
            'Кокшетау',
            'Актау',
            'Туркестан',
            'Жезказган',
            'Усть-Каменогорск',
            'Экибастуз'
        ],
        direction: 'branding'
    },
    {
        mark: 'Автомобиль старше 2008 года - ОТКЛЮЧИТЬ',
        color: 'rgba(224, 102, 102, 1)',
        cities: ['Гомель'],
        direction: 'branding'
    },
    {
        mark: 'Оклейка заднего стекла',
        color: 'rgb(51, 158, 234, 0.85)',
        cities: ['Батуми', 'Кутаиси', 'Рустави', 'Тбилиси'],
        direction: 'branding'
    },
    {
        mark: 'Бренд Go или Visa',
        color: 'rgb(51, 158, 234, 0.85)',
        cities: ['Кишинёв'],
        direction: 'branding'
    },
    {
        mark: 'Стикеры = наклейки Yango + флажок',
        color: 'rgb(51, 158, 234, 0.85)',
        cities: ['Тель-Авив'],
        direction: 'branding'
    },
    {
        mark: 'кресло Мишутка, Teddy Bear, Zlatek: при наличии подтверждать два одинаковых',
        color: 'rgba(39, 255, 0, 0.83)',
        cities: [
            'Волгоград',
            'Воронеж',
            'Нижний Новгород',
            'Пермь',
            'Новосибирск',
            'Казань',
            'Уфа',
            'Саратов'
        ],
        direction: 'chair'
    }
];

;// CONCATENATED MODULE: ./src/Marks/BrandMarks/BrandMarks.ts

const createMark = (text, bgColor) => {
    const span = document.createElement('span');
    span.classList.add('level_notation');
    span.setAttribute('style', `display: block; width: fit-content; padding: 2px 4px; margin-left: -4px; border: 1px solid rgb(128,128,128);`);
    span.style.backgroundColor = bgColor;
    span.textContent = text;
    return span;
};
$(document).bind('item_info', function (e, params) {
    document.querySelectorAll('span.level_notation').forEach((el) => el.remove());
    const { city, car } = params;
    const url = document.location.href;
    const carNumber = car
        .match(/\((((?!\]).)*)\)$/)[1]
        .replace(/\s+/g, '')
        .toUpperCase();
    brandMarksConfig.filter((m) => url.includes(m.direction))
        .filter((mark) => {
        if (Object.prototype.hasOwnProperty.call(mark, 'carNumber')) {
            return mark.carNumber.includes(carNumber);
        }
        return mark.cities.includes(city);
    })
        .map(({ mark, color }) => createMark(mark, color))
        .forEach((el) => {
        const info = document.querySelector('i.check-thumb-number') ||
            document.querySelector('span.check-thumb-number');
        info.prepend(el);
    });
});

// EXTERNAL MODULE: ./src/other/ProtectMissclicks/ProtectMissclicks.js
var ProtectMissclicks = __webpack_require__(435);
;// CONCATENATED MODULE: ./src/Templates/BrandTemplatesWithDetails/BrandTemplatesWithDetails.service.ts
class BrandTemplatesWithDetailsService {
    constructor(config) {
        this.createListItem = (itemvalue, template, cls, content) => {
            const li = document.createElement('li');
            if (itemvalue !== null) {
                li.setAttribute('itemvalue', itemvalue);
            }
            if (template !== null) {
                li.dataset.template = template;
            }
            li.classList.add(cls.join(','));
            li.textContent = content;
            return li.outerHTML;
        };
        this._conf = config;
    }
    checkCity(city) {
        const res = Object.entries(this._conf.cities).filter(([_, arrayCities]) => arrayCities.includes(city));
        if (res.length > 0) {
            const [[title]] = res;
            return title;
        }
        return 'rus';
    }
    switchTemplateFromCountry(type, country) {
        if (type === 'uber' || type === 'lightbox' || type === 'remarks') {
            return this._conf.templates[type];
        }
        const typeTemplates = this._conf.templates[type];
        const keysType = Object.keys(typeTemplates);
        const keysInjection = Object.keys(this._conf.templates.injection[type]);
        if (keysType.includes(country) && !keysInjection.includes(country)) {
            return typeTemplates[country];
        }
        if (keysType.includes(country) && keysInjection.includes(country)) {
            return [...typeTemplates[country], ...this._conf.templates.injection[type][country]];
        }
        if (keysInjection.includes(country)) {
            return [...typeTemplates.default, ...this._conf.templates.injection[type][country]];
        }
        return typeTemplates.default;
    }
    fillCountriesInHTML() {
        return Object.entries(this._conf.countries)
            .map(([key, country]) => `<option value="${key}">${country}</option>`)
            .join('');
    }
    filterTemplates(country, isRusOnly, data) {
        return data
            .filter((t) => {
            if (!isRusOnly && t.type === 'only') {
                return !t.only;
            }
            return t;
        })
            .map((t) => {
            switch (t.type) {
                case 'item': {
                    const newTemplate = {
                        type: 'item',
                        text: t.text,
                        [country]: t[country]
                    };
                    return newTemplate;
                }
                case 'details': {
                    const newTemplate = {
                        type: 'details',
                        text: t.text,
                        details: this.filterTemplates(country, isRusOnly, t.details)
                    };
                    return newTemplate;
                }
                default:
                    return t;
            }
        })
            .filter((t) => (t.type === 'item' ? t[country] !== '' : t));
    }
    createDetailsHTML(name, list) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.addEventListener('click', () => { });
        details.setAttribute('style', 'margin: 10px 20px; cursor: pointer;');
        ul.setAttribute('style', 'list-style: none; padding: 0;');
        const listHTML = this.renderTemplates(list);
        ul.innerHTML = listHTML;
        li.append(details);
        details.append(summary, ul);
        summary.textContent = `ᐅ ${name}`;
        summary.style.backgroundColor = '#b6d7a8';
        return li.outerHTML;
    }
    renderTemplates(templates) {
        return templates
            .map((t) => {
            switch (t.type) {
                case 'only':
                    return this.createListItem(t.only, t.only, ['template-item'], t.only);
                case 'label':
                    return this.createListItem(null, null, ['template-head'], t.label);
                case 'details':
                    return this.createDetailsHTML(t.text, t.details);
                default: {
                    const [text, translate] = Object.keys(t).filter((i) => i !== 'type');
                    return this.createListItem(t[translate], t[text], ['template-item'], t[text]);
                }
            }
        })
            .join('');
    }
    filterAndFillTemplateBrandInHTML(type, country, isRusOnly) {
        const res = this.switchTemplateFromCountry(type, country);
        const filteredTemplates = this.filterTemplates(country, isRusOnly, res);
        const stringTemplates = this.renderTemplates(filteredTemplates);
        return `<ul class="list-group">${stringTemplates}</ul>`;
    }
}

;// CONCATENATED MODULE: ./src/Configs/GlobalConstants/constatns.ts
const cities = {
    az: ['Баку'],
    kgz: ['Бишкек', 'Ош'],
    geo: ['Батуми', 'Кутаиси', 'Рустави', 'Тбилиси'],
    cro: ['Загреб', 'Сплит', 'Риека', 'Осиек'],
    uzb: ['Ташкент', 'Наманган', 'Фергана', 'Андижан', 'Самарканд', 'Коканд', 'Бухара'],
    ltu: ['Вильнюс'],
    est: ['Таллин', 'Тарту'],
    mda: ['Кишинёв', 'Бухарест'],
    gana: ['Аккра', 'Кумаси'],
    arm: [
        'Араратская область',
        'Ванадзор',
        'Горис',
        'Гюмри',
        'Ереван',
        'Капан',
        'Котайкская область',
        'Армавирская область'
    ],
    srb: ['Белград'],
    lta: ['Рига', 'Даугавпилс', 'Лиепая', 'Валмиера', 'Вентспился', 'Елгава'],
    isr: ['Тель-Авив', 'Яффо', 'Раана', 'Герцлия', 'Нетания', 'Хайфа', 'Ашкелон', 'Ашдод'],
    fin: ['Хельсинки', 'Вантаа', 'Эспоо', 'Турку', 'Тампере'],
    nor: ['Осло'],
    kot: ['Абиджан', 'Сан-Педро', 'Ман', 'Далоа', 'Дакар'],
    kam: ['Дуала', 'Яунде'],
    kz: [
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
        'Талдыкорган'
    ],
    zam: ['Лусака']
};

;// CONCATENATED MODULE: ./src/Configs/brand/TemplatesWithDetails.config.ts

const lightbox = [
    { type: 'label', label: 'Лайтбоксы', th: true },
    {
        type: 'item',
        text: 'отсутствует световой короб. Для получения статуса и приоритета, пожалуйста, установите его',
        rus: 'отсутствует световой короб. Для получения статуса и приоритета, пожалуйста, установите его',
        arm: 'Բացակայում է լայթբոքսը։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք տեղադրել այն:',
        az: 'laytboks yoxdur. Status və prioritet əldə etmək üçün onu quraşdırın',
        est: 'puudub plafoon. Sotsiaalse seisundi ja esimuse saamiseks palun paigaldage see',
        geo: 'არ არის ლაითბოქსი. სტატუსისა და პრიორიტეტის მისაღებად დააყენეთ ის',
        kz: 'лайтбокс жоқ. Мәртебе мен басымдық алу үшін оны орнатуды өтінеміз',
        kgz: 'лайтбокс жок. Статус жана артыкчылыкты алуу үчүн аны орнотуңүз',
        lta: 'nav gaismas pazīšanas zīmes. Lai iegūtu statusu un prioritāti, lūdzu, uzstādiet to',
        ltu: 'nėra plafono. Uždėkite plafoną, kad gautumėte statusą ir prioritetą',
        mda: 'caseta luminoasă lipsește. Pentru a primi un statut și prioritate, vă rugăm să o instalați',
        cro: 'nedostaje svetleća tabla. Kako biste dobili status i prioritet, molimo vas da je stavite.',
        uzb: 'chiroqli laytboks mavjud emas. Maqom va ustuvorlikka erishish uchun, iltimos, uni oʻrnating',
        fin: 'Yangon kattokyltti puuttuu kokonaan. Prioriteettiä ei voida antaa, ennen kuin asennat sen katolle.'
    },
    {
        type: 'item',
        text: 'брендирование такого типа устарело. Об актуальном брендировании вы можете узнать по ссылке: (https://driver.yandex/branding_rules_2/)',
        rus: 'брендирование такого типа устарело. Об актуальном брендировании вы можете узнать по ссылке: (https://driver.yandex/branding_rules_2/)',
        arm: 'Նմանատիպ բրենդավորումը հնացել է։ Արդիական բրենդավորման մասին կարող եք իմանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
        az: 'bu növ brendləmə köhnəlib. Zəruri brendləmə haqqında öyrənmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
        est: 'see kaubamärgistamise tüüp on vananenud. Päevakohase kaubamärgistamise kohta võite teada saada lingi kaudu: (https://driver.yandex/branding_rules_2/)',
        geo: 'ასეთი ტიპის ბრენდირება მოძველებულია. აქტუალური ბრენდირების შესახებ შეგიძლიათ გაიგოთ ბმულზე: (https://driver.yandex/branding_rules_2/)',
        kz: 'мұндай түрдегі брендинг ескірген. Өзекті брендинг туралы мына сілтеме арқылы білуге болады: (https://driver.yandex/branding_rules_2/)',
        kgz: 'мындай түрдөгү брендинг эскирип кеткен. Актуалдуу брендинг тууралуу шилтеме аркылуу биле аласыз: (https://driver.yandex/branding_rules_2/)',
        lta: 'šāda veida brendings ir novecojis. Par aktuālo brendingu jūs varat uzzināt, sekojot saitei: (https://driver.yandex/branding_rules_2/)',
        ltu: 'šio tipo prekės ženklai yra pasenę. Apie dabar naudojamus prekės ženklus galite sužinoti apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
        mda: 'branding-ul de acest tip este învechit. Informații despre branding-ul actual pot fi găsite la adresa: (https://driver.yandex/branding_rules_2/)',
        cro: 'ovaj tip brendiranja je zastareo. O aktuelnom brendiranju se možete informisati na linku: (https://driver.yandex/branding_rules_2/)',
        uzb: 'bunday turdagi brending eskirgan. Hozirgi kunda ahamiyatga ega brending toʻgʻrisida havola oraqli bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)'
    },
    {
        type: 'item',
        text: 'световой короб не закреплен. Для получения статуса и приоритета, пожалуйста, закрепите короб',
        rus: 'световой короб не закреплен. Для получения статуса и приоритета, пожалуйста, закрепите короб',
        arm: 'Լայթբոքսն ամրացված չէ։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք ամրացնել լայթբոքսը:',
        az: 'laytboks bərkidilməyib. Status və prioritet əldə etmək üçün laytboksu bərkidin',
        est: 'plafoon pole kinnitatud. Brändingu ja prioriteedi saamiseks palun kinnitage plafoon',
        geo: 'ლაითბოქსი არ არის დამაგრებული. სტატუსისა და პრიორიტეტის მისაღებად, გთხოვთ, დაამაგროთ ლაითბოქსი',
        kz: 'лайтбокс бекітілмеген. Мәртебе мен басымдық алу үшін лайтбоксты бекітуіңізді өтінеміз',
        kgz: 'лайтбокс карматылган эмес. Статус жана артыкчылык алуу үчүн лайтбоксту карматыңыз.',
        lta: 'gaismas pazīšanas zīme nav nostiprināta. Lai iegūtu statusu un prioritāti, lūdzu, nostipriniet gaismas pazīšanas zīmi',
        ltu: 'plafonas nepritvirtintas. Pritvirtinkite plafoną, kad gautumėte statusą ir prioritetą',
        mda: 'caseta luminoasă nu este fixată. Pentru a primi un statut și prioritate, vă rugăm să fixați caseta',
        cro: 'svetleća tabla nije pričvršćena. Kako biste dobili status i prioritet, molimo vas da pričvrstite svetleću tablu',
        uzb: 'chiroqli laytboks mahkamlab qoʻyilmagan. Maqom va ustuvorlikka erishish uchun, iltimos, chiroqli laytboksni mahkamlab qoʻying',
        fin: 'Kattokyltti ei ole kiinnitetty kattoon.'
    },
    {
        type: 'only',
        only: 'на световом коробе отсутствует наклейка. Для получения статуса и приоритета, пожалуйста, обновите световой короб'
    },
    {
        type: 'only',
        only: 'световой короб не соответствует стандартам сервиса. Для получения статуса и приоритета, пожалуйста, обновите его'
    },
    {
        type: 'only',
        only: 'световой короб не соответствует стандартам сервиса. Для получения статуса и приоритета, пожалуйста, обновите его'
    },
    {
        type: 'only',
        only: 'наклейка на световом коробе повреждена. Для получения статуса и приоритета, пожалуйста, обновите световой короб'
    },
    {
        type: 'only',
        only: 'световой короб поврежден. Для получения статуса и приоритета, пожалуйста, обновите его'
    },
    { type: 'only', only: 'cветовой короб попал в кадр не полностью' },
    { type: 'only', only: 'брендированная наклейка на световом коробе не просматривается' },
    {
        type: 'only',
        only: 'световой короб засвечен. Во время проверки рекомендуем выключать подсветку короба, чтобы этого избежать'
    }
];
const templates = {
    block: {
        default: [
            { type: 'label', label: 'Стикеры', th: true },
            {
                type: 'item',
                text: 'отсутствует брендирование. Для получения статуса и приоритета, пожалуйста, оклейте машину. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                rus: 'отсутствует брендирование. Для получения статуса и приоритета, пожалуйста, оклейте машину. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                arm: 'բացակայում է բրենդավորումը։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք ավտոմեքենային բրենդային ձևավորում ավելացնել',
                az: 'brendləmə yoxdur. Status və prioritet əldə etmək üçün maşına brend nişanı yapışdırın.',
                est: 'kaubamärgistamine puudub. Staatuse ja prioriteedi saamiseks varusta auto palun kaubamärgikleebisega',
                geo: 'არ არის ბრენდირება. სტატუსისა და პრიორიტეტის მისაღებად გადააკარით ფირი მანქანას',
                kz: 'брендинг жоқ. Мәртебе мен басымдық алу үшін машинаға жапсырма жапсырыңыз.',
                kgz: 'брендинг жок. Статус менен приоритетти алыш үчүн машинага чаптамаларды чаптатыңыз.',
                lta: 'nav brendinga. Lai iegūtu statusu un prioritāti, lūdzu, aplīmējiet automašīnu',
                ltu: 'nėra prekės ženklo. Apklijuokite automobilį, kad gautumėte statusą ir prioritetą',
                cro: 'nema brendinga. Kako biste dobili status i prioritet, molimo vas da brendirate svoj automobil. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
                uzb: 'brendlash mavjud emas. Status va ustuvorlikka erishish uchun mashinaga brend yorliqlarini yopishtiring',
                gana: 'branding missing. Please apply a branded wrap to obtain this status and priority',
                mda: 'lipsește brandingul. Pentru a primi un statut și prioritate, te rugăm să aplici autocolante pe mașină',
                srb: 'nema brendinga. Kako biste dobili status i prioritet, molimo vas da brendirate automobil',
                kot: 'absence de branding. Veuillez appliquer un marquage pour obtenir ce statut et cette priorité',
                isr: 'חסר מיתוג. כדי להשיג את הסטטוס והקדימות האלה עליך להדביק מדבקת מיתוג על המונית',
                fin: 'brändäys puuttuu. Suorita ajoneuvon teippaus saadaksesi tämän tilan ja proriteetin',
                nor: 'Den mangler merking. Legg til en Yango-merket varemerkefolie for å få denne statusen og prioriteringen.'
            },
            {
                type: 'details',
                text: 'САМОДЕЛЫ',
                details: [
                    { type: 'label', label: 'Самодел', th: true },
                    {
                        type: 'item',
                        text: 'оклейка не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                        rus: 'оклейка не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                        arm: 'բրենդային ձևավորումը չի համապատասխանում ստանդարտներին',
                        az: 'yapışdırılan brend nişanı standartlara uyğun deyil',
                        est: 'kleebis ei vasta standardile',
                        geo: 'გადაკვრა არ შეესაბამება სტანდარტებს',
                        kz: 'жапсырма стандарттарға сай емес',
                        kgz: 'машинанын чаптамасы стандарттарга жооп бербейт',
                        lta: 'virsmas marķējums neatbilst standartiem',
                        ltu: 'lipdukai su prekės ženklu neatitinka standartų',
                        cro: 'Brendirane nalepnice nisu u skladu sa standardima. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
                        uzb: 'yopishtirilgan material standartlarga mos emas',
                        gana: 'branded wrap in violation of standards',
                        mda: 'aplicarea autocolantelor nu corespunde standardelor',
                        srb: 'brendirane nalepnice nisu u skladu sa standardima',
                        kot: 'le marquage ne répond pas aux standards',
                        isr: 'המדבקה לא עומדת בסטנדרטים',
                        fin: 'teippaus ei vastaa sille asetettuja vaatimuksia',
                        nor: 'Yango-merket varemerkefolie bryter med standardene.'
                    },
                    {
                        type: 'only',
                        only: 'оклейка задних дверей не соответствует стандартам.  Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'шрифт надписи не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'item',
                        text: 'оклейка заднего стекла не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                        rus: 'оклейка заднего стекла не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                        arm: 'հետևի ապակու բրենդային ձևավորումը չի համապատասխանում ստանդարտներին',
                        az: 'arxa şüşəyə yapışdırılan brend nişanı standartlara uyğun deyil',
                        est: 'tagumise akna kleebis ei vasta standardile',
                        geo: 'გადაკვრა უკანა საქარე მინაზე არ შეესაბამება სტანდარტებს',
                        kz: 'артқы әйнектің жапсырмасы стандарттарға сай емес',
                        kgz: 'арткы айнектин чаптамасы стандарттарга жооп бербейт',
                        lta: 'aizmugurējā stikla virsmas marķējums neatbilst standartiem',
                        ltu: 'galinio lango lipdukas su prekės ženklu neatitinka standartų',
                        cro: 'brendirana nalepnica na zadnjem staklu nije u skladu sa standardima. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
                        uzb: 'orqa oynaga yopishtirilgan material standartlarga mos emas',
                        gana: 'rear window branded wrap in violation of standards',
                        mda: 'aplicarea autocolantelor pe parbrizul din spate nu corespunde standardelor',
                        srb: 'brendirana nalepnica na zadnjem staklu nije u skladu sa standardima',
                        kot: 'le marquage de la lunette arrière ne répond pas aux standards',
                        isr: 'המדבקה שעל השמשה האחורית לא עומדת בסטנדרטים',
                        fin: 'takaikkunan teippaus ei vastaa sille asetettuja vaatimuksia',
                        nor: 'Yango-merket varemerkefolie på bakvinduet bryter med standardene.'
                    },
                    {
                        type: 'item',
                        text: 'использованы магнитные наклейки. Пожалуйста, оклейте машину в соответствии со стандартами, которые можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                        rus: 'использованы магнитные наклейки. Пожалуйста, оклейте машину в соответствии со стандартами, которые можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
                        arm: 'օգտագործվել են մագնիսային նշաններ։ Խնդրում ենք ավտոմեքենայի բրենդային ձևավորումը կատարել ստանդարտներին համապատասխան',
                        az: 'maqnit yapışdırmalardan istifadə olunub. Brend nişanını standartlara uyğun şəkildə yapışdırın',
                        est: 'kasutatud on magnetkleebiseid. Palun varusta sõiduk standardikohase kleebisega',
                        geo: 'გამოყენებულია მაგნიტური სტიკერები. გთხოვთ გადააკრათ ფირი მანქანას სტანდარტების შესაბამისად',
                        kz: 'магнит жапсырмалар қолданылған. Машинаға жапсырманы стандарттарға сәйкес етіп жабыстырыңыз',
                        kgz: 'магниттик чаптамалар колдонулган. Өтүнүч, чаптамаларды машинага стандарттарга ылайык кылып чаптатыңыз',
                        lta: 'izmantotas magnētiskās uzlīmes. Lūdzu, aplīmējiet automašīnu atbilstoši standartiem',
                        ltu: 'panaudoti magnetiniai lipdukai. Apklijuokite automobilį pagal standartus',
                        cro: 'korišćene su magnetne nalepnice. Molimo vas da brendirate svoj automobil u skladu sa standardima o kojima se možete informisati na linku: (https://driver.yandex/branding_rules_2/)',
                        uzb: 'magnitli yorliqlar ishlatilgan. Mashinaga materialni standartlarga muvofiq yopishtiring',
                        gana: 'magnetic stickers used. Please brand your vehicle in accordance with the standards',
                        mda: 'au fost folosite autocolante magnetice. Te rugăm să aplici autocolante pe mașină în conformitate cu standardele',
                        srb: 'korišćene su magnetne nalepnice. Molimo vas da brendirate automobil u skladu sa standardima',
                        kot: 'des autocollants magnétiques ont été utilisés. Veuillez marquer votre véhicule conformément aux standards',
                        isr: 'נעשה שימוש במגנטים. עליך למתג את המונית בהתאם לסטנדרטים',
                        fin: 'käytetty magneettisia tarroja. Teippauta ajoneuvosi vaatimuksia vastaavalla tavalla',
                        nor: 'Magnetiske klistremerker er brukt. Du må merke kjøretøyet i henhold til standardene.'
                    },
                    {
                        type: 'only',
                        only: 'элементы брендирования расположены некорректно [надпись должна располагаться параллельно нижней кромки стекла]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'элементы брендирования расположены некорректно [расстояние между буквами и словами в 2 раза меньше положенного]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'элементы брендирования расположены некорректно [расстояние между буквами и словами в 2 раза больше положенного]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'item',
                        text: 'элементы брендирования расположены некорректно [УКАЗАТЬ]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        rus: 'элементы брендирования расположены некорректно [УКАЗАТЬ]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        arm: 'Բրենդավորման տարրերը սխալ են տեղադրված {УКАЗАТЬ}։ Ավելի մանրամասն տեղեկատվություն կարող եք ստանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
                        az: 'brendləmə elementləri yanlış yerləşdirilib {УКАЗАТЬ}. Daha ətraflı məlumat əldə etmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
                        est: 'Brändingu üksikosad pole veatult paigutatud {УКАЗАТЬ}. Täpsema teabe saamiseks klõpsake lingil: (https://driver.yandex/branding_rules_2/)',
                        geo: 'ბრენდირების ელემენტები არაკორექტულად არის განლაგებული {УКАЗАТЬ}. დეტალური ინფორმაციისთვის გადადით ბმულზე: (https://driver.yandex/branding_rules_2/)',
                        kz: 'брендинг элементтері қате орналасқан {УКАЗАТЬ}. Толығырақ ақпарат алу үшін мына сілтеме арқылы өтіңіз: (https://driver.yandex/branding_rules_2/)',
                        kgz: 'брендингдин элементтери туура эмес жайгашкан {УКАЗАТЬ}. Кеңири маалымат алүү үчүн шилтеме аркылуу өтүңүз: (https://driver.yandex/branding_rules_2/)',
                        lta: 'brendinga elementi izvietoti nepareizi {УКАЗАТЬ}. Lai iegūtu vairāk informācijas, sekojiet saitei: (https://driver.yandex/branding_rules_2/)',
                        ltu: 'prekės ženklo elementai išdėstyti netinkamai {УКАЗАТЬ}. Išsamią informaciją rasite apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
                        mda: 'elementele de branding sunt poziționate incorect {УКАЗАТЬ}. Pentru informații detaliate, accesați link-ul: (https://driver.yandex/branding_rules_2/)',
                        cro: 'elementi brendiranja nisu pravilno postavljeni{УКАЗАТЬ}. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
                        uzb: 'brendingning tarkibiy qismlari notoʻgʻri joylashgan {УКАЗАТЬ}. Batafsil maʼlumot uchun havola orqali oʻting: (https://driver.yandex/branding_rules_2/)',
                        nor: 'Merkingen er plassert feil.'
                    },
                    {
                        type: 'item',
                        text: 'бортовой номер и надпись размещены на разных уровнях. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        rus: 'бортовой номер и надпись размещены на разных уровнях. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        arm: 'կողային համարն ու գրվածքը տարբեր բարձրությունների վրա են',
                        az: 'bort nömrəsi və yazı fərqli səviyyələrdə yerləşdirilib',
                        est: 'pardanumber ja kiri on paigutatud eri kõrgusele',
                        geo: 'ბორტის ნომერი და წარწერა განთავსებულია სხვადასხვა დონეზე',
                        kz: 'борттық нөмірі мен жазба әр түрлі деңгейде орналасқан',
                        kgz: 'борт номери менен жазуу ар кандай деңгээлде жайгашып калган',
                        lta: 'borta numurs un uzraksts izvietoti dažādos līmeņos',
                        ltu: 'automobilio numeris ir užrašas yra skirtinguose lygiuose',
                        cro: 'broj taksi vozila i natpis nisu postavljeni u ravni. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
                        uzb: 'bort nomeri va yozuv har xil darajada joylashtirilgan',
                        gana: 'side number and inscription positioned at different levels',
                        mda: 'numărul și inscripția de pe caroserie sunt plasate la niveluri diferite',
                        srb: 'broj taksi vozila i natpis nisu postavljeni u ravni',
                        kot: 'le numéro de côté et l`inscription sont positionnés à des niveaux différents',
                        isr: 'המספר והכיתוב על צד המונית לא באותו גובה',
                        fin: 'sivunumero ja teksti on aseteltu eri korkeudelle',
                        nor: 'Sidenummer og inskripsjonen er plassert på forskjellige høydenivåer.'
                    },
                    {
                        type: 'item',
                        text: 'брендирование не соответствует требованиям сервиса. На сторонах одного транспортного средства наклейки разных форматов. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        rus: 'брендирование не соответствует требованиям сервиса. На сторонах одного транспортного средства наклейки разных форматов. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        arm: 'բրենդավորումը չի համապատասխանում ծառայության պահանջներին։ Տարբեր ձևաչափի բրենդային նշաններ մեկ տրանսպորտային միջոցի երկու կողմերում',
                        az: 'brendləmə xidmət tələblərinə uyğun deyil. Bir nəqliyyat vasitəsinin iki tərəfində olan yapışdırmalar müxtəlif formatdadır',
                        est: 'kaubamärgistamine ei vasta teenuse nõuetele. Ühe transpordivahendi külgedel on erineva suurusega kleebised',
                        geo: 'ბრენდირება არ შეესაბამება სერვისის მოთხოვნებს. ერთი სატრანსპორტო საშუალების გვერდებზე სხვადასხვა ფორმატის სტიკერებია',
                        kz: 'брендинг сервис талаптарына сай келмейді. Бір көлік құралының екі жағында әр түрлі форматтағы жапсырма',
                        kgz: 'брендинг сервистин талаптарына жооп бербейт. Бир транспорт каражатынын ар башка жактарында ар кандай форматтагы чаптамалар чапталган',
                        lta: 'brendings neatbilst servisa prasībām. Uz vieniem automašīnas sāniem izvietotas dažāda formāta uzlīmes',
                        ltu: 'žymėjimas prekės ženklu neatitinka paslaugos reikalavimų. Skirtingo formato lipdukai ant vienos transporto priemonės šonų',
                        cro: 'brendiranje nije u skladu sa zahtevima servisa. Postavljanje bilo kakvih reklama na brendiran automobil je moguće tek nakon dogovora sa Yandex.Taxi-jem. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
                        uzb: 'brendlash xizmatning talablariga mos kelmaydi. Bitta transport vositasining ikki tomonida har xil formatdagi yorliq joylashtirilgan',
                        gana: 'branding not in accordance with service requirements. Different sticker formats displayed on both sides of the same vehicle',
                        mda: 'brandingul nu îndeplinește cerințele serviciului. Pe părțile laterale ale aceluiași mijloc de transport sunt lipite autocolante cu formate diferite',
                        srb: 'brending nije u skladu sa zahtevima servisa. Nalepnice na stranama istog vozila su različitog formata',
                        kot: 'le branding ne correspond pas aux exigences du service. Des formats d`autocollants différents sont affichés sur les deux côtés du même véhicule',
                        isr: 'המיתוג לא עומד בדרישות השירות. מדבקות מסוגים שונים הודבקו על שני הצדדים של אותה מונית',
                        fin: 'brändäystä ei voida suorittaa palvelun vaatimusten mukaisesti. Saman ajoneuvon eri puolilla käytetään erilaista tarroitusta',
                        nor: 'Merkingen overholder ikke tjenestekravene. Forskjellige klistremerkeformat brukes på begge sidene av samme kjøretøy.'
                    }
                ]
            },
            {
                type: 'details',
                text: 'ОТСУТСТВУЕТ ЭЛЕМЕНТ',
                details: [
                    { type: 'label', label: 'ОТСУТСТВУЮТ ЭЛЕМЕНТЫ', th: true },
                    {
                        type: 'item',
                        text: 'отсутствует ___. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
                        rus: 'отсутствует ___. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
                        arm: 'բացակայում է՝ ___։ Բրենդավորման մասին ավելի մանրամասն կարող եք իմանալ կայքում՝ https://driver.yandex/branding_rules_2/)',
                        az: '___ yoxdur. Brendləmə haqqında daha ətraflı öyrənmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
                        est: 'puudub ___. Täpsemalt saab brändimisest teada veebilehel: (https://driver.yandex/branding_rules_2/)',
                        geo: 'არ არის ___. ბრენდირების შესახებ დაწვრილებით შეგიძლიათ გაიგოთ ვებსაიტზე: (https://driver.yandex/branding_rules_2/)',
                        kz: '___ жоқ. Брендинг туралы толығырақ мына сайттан білуге болады: (https://driver.yandex/branding_rules_2/)',
                        kgz: '___ жок. Брендинг тууралуу сайттан кеңири билүүгө болот: (https://driver.yandex/branding_rules_2/)',
                        lta: 'nav ___. Vairāk informācijas par brendingu var iegūt vietnē: (https://driver.yandex/branding_rules_2/)',
                        ltu: 'nėra ___. Išsamią informaciją apie prekės ženklų naudojimą galite rasti šiuo adresu: (https://driver.yandex/branding_rules_2/)',
                        mda: 'lipsește ___. Mai multe detalii despre branding pot fi găsite pe site-ul: (https://driver.yandex/branding_rules_2/)',
                        cro: 'nedostaje ___. Detaljnije o brendiranju možete saznati na sajtu: (https://driver.yandex/branding_rules_2/)',
                        uzb: '___ mavjud emas. Brending toʻgʻrisidagi batafsil maʼlumotlarni saytdan bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'отсутствует оклейка заднего стекла и номер телефона на бортах. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'отсутствует номер телефона на бортах. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'отсутствует оклейка заднего стекла. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'отсутствуют шашки на переднем/заднем правом/левом крыле. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'отсутствуют шашки на переднем/заднем крыле. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'отсутствует шашечный пояс. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'отсутствует бортовой номер. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)'
                    }
                ]
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности брендинга',
                rus: 'есть сомнения в подлинности брендинга',
                arm: 'կասկածներ կան բրենդինգի իսկության վերաբերյալ',
                az: 'brendinqin orijinallığı ilə bağlı şübhə var',
                est: 'kaubamärgistamise autentsuses on kahtlusi',
                geo: 'ბრენდინგის ნამდვილობა საეჭვოა',
                kz: 'брендингтің шынайылығына күмән бар',
                kgz: 'брендингдин аныктыгында күмөн бар',
                lta: 'ir aizdomas par to, ka brendings ir viltots',
                ltu: 'kyla abejonių dėl prekės ženklo autentiškumo',
                cro: '',
                uzb: 'brending haqiqiyligi shubha ostida',
                gana: 'uncertainty about branding authenticity',
                mda: 'există suspiciuni cu privire la autenticitatea brandingului',
                srb: 'postoje sumnje u autentičnost brendinga',
                kot: 'incertitude relative à l`authenticité du branding',
                isr: 'חשד שמדבקת המיתוג מזויפת',
                fin: 'epäselvyyksiä teippauksen oikeellisuudesta',
                nor: 'Det er usikkert om merkingen er ekte.'
            },
            {
                type: 'item',
                text: 'брендирование данного типа неактуально и не соответствует требованиям сервиса. Обновите брендирование в соответствии с новыми требованиями. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                rus: 'брендирование данного типа неактуально и не соответствует требованиям сервиса. Обновите брендирование в соответствии с новыми требованиями. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                arm: 'տվյալ տիպի բրենդավորումը արդիական չէ և չի համապատասխանում ծառայության պահանջներին։ Թարմացրեք բրենդավորումը նոր պահանջներին համապատասխան',
                az: 'bu növ brendləmə qeyri-aktualdır və xidmət tələblərinə uyğun deyil. Brendləməni yeni tələblərə uyğun olaraq yeniləyin',
                est: 'selline kaubamärgistamine pole ajakohane ega vasta teenuse nõuetele. Uuenda kaubamärgistus vastavalt ajakohastele nõuetele',
                geo: 'ამ ტიპის ბრენდირება არ არის აქტუალური და არ შეესაბამება სერვისის მოთხოვნებს. განაახლეთ ბრენდირება ახალი მოთხოვნების შესაბამისად',
                kz: 'берілген түрдегі брендинг өзекті емес және сервис талаптарына сай келмейді. Брендингті жаңа талаптарға сәйкес етіп жаңартыңыз',
                kgz: 'ушундай түрдөгү брендинг актуалдуу эмес жана сервистин талаптарына жооп бербейт. Брендингди жаңы талаптарга ылайык жаңыртыңыз',
                lta: 'šāda veida brendings nav aktuāls un neatbilst servisa prasībām. Atjaunojiet automašīnas brendingu atbilstoši jaunajām prasībām',
                ltu: 'šio tipo žymėjimas prekės ženklu neaktualus ir neatitinka paslaugos reikalavimų. Atnaujinkite žymėjimą prekės ženklu, atitinkančiu naujus reikalavimus',
                cro: 'brendiranje ovog tipa nije aktuelno i ne odgovara zahtevima servisa. Obnovite brendiranje u skladu sa novim zahtevima. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
                uzb: 'bunday turdagi brendlash hozirgi kunda eskirgan va xizmatning talablariga mos kelmaydi. Brendlashni joriy talablarga muvofiq yangilang.',
                gana: 'this branding type is invalid and in violation of service standards. Update your branding in accordance with the new requirements',
                mda: 'brandingul de acest tip nu este actual și nu îndeplinește cerințele serviciului. Actualizează brandingul în conformitate cu noile cerințe',
                srb: 'brendiranje ovog tipa nije aktuelno i ne odgovara zahtevima servisa. Obnovite brending u skladu sa novim zahtevima',
                kot: 'ce branding n`est pas conforme et ne répond pas aux standards de service. Veuillez modifier votre branding conformément aux nouvelles exigences',
                isr: 'סוג המיתוג הזה לא תקין ואינו עומד בסטנדרטים של השירות. עליך לעדכן את המיתוג בהתאם לדרישות החדשות',
                fin: 'tämä brändäystyyppi on virheellinen eikä se vastaa palvelun vaatimuksia. Päivitä brändäyksesi uusien vaatimusten mukaiseksi',
                nor: 'Denne typen merking er ugyldig og bryter med tjenestestandardene. Oppdater merkingen din i henhold til de nye kravene.'
            },
            {
                type: 'item',
                text: 'брендирование не соответствует требованиям сервиса. Размещать любую рекламу на брендированном автомобиле можно только по согласованию с Яндекс.Такси. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                rus: 'брендирование не соответствует требованиям сервиса. Размещать любую рекламу на брендированном автомобиле можно только по согласованию с Яндекс.Такси. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                arm: 'բրենդավորումը չի համապատասխանում ծառայության պահանջներին։ Բրենդավորված ավտոմեքենայի վրա ցանկացած գովազդի տեղադրումը հնարավոր է միայն համաձայնեցնելուց հետո',
                az: 'brendləmə xidmət tələblərinə uyğun deyil. Brendlənmiş avtomobildə hər hansı reklamın yerləşdirilməsi yalnız razılaşdırıldıqdan sonra mümkündür',
                est: 'kaubamärgistamine ei vasta teenuse nõuetele. Mistahes reklaami võib kaubamärgistatud sõidukile paigaldada ainult kokkuleppel',
                geo: 'ბრენდირება არ შეესაბამება სერვისის მოთხოვნებს. ნებისმიერი რეკლამის განთავსება ბრენდირებულ ავტომანქანაზე შესაძლებელია მხოლოდ შეთანხმებით',
                kz: 'брендинг сервис талаптарына сай келмейді. Брендинг жасалған автокөлікке тек келісім бойынша кез келген жарнама орналастыруға болады.',
                kgz: 'брендинг сервистин талаптарына жооп бербейт. Брендделген автоунаага макулдашуу боюнча гана жарнамаларды жайгаштырса болот',
                lta: 'brendings neatbilst servisa prasībām. Uz automašīnas, kuras virsbūvei veikts brendings, jebkādu reklāmu izvietot drīkst tikai saskaņojot',
                ltu: 'žymėjimas prekės ženklu neatitinka paslaugos reikalavimų. Bet kokią reklamą ant prekės ženklu pažymėto automobilio galima dėti tik susitarus',
                cro: 'brendiranje nije u skladu sa zahtevima servisa. Postavljanje bilo kakvih reklama na brendiran automobil je moguće tek nakon dogovora sa Yandex.Taxi-jem. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
                uzb: 'brendlash xizmatning talablariga mos kelmaydi. Brendlangan avtomobilga har qanday reklamani faqat kelishilgan tartibda joylashtirish mumkin',
                gana: 'branding not in accordance with service requirements. Other advertisements can only be displayed on branded vehicles with formal approval',
                mda: 'brandingul nu îndeplinește cerințele serviciului. Orice publicitate poate fi plasată pe un automobil branduit numai prin acord reciproc',
                srb: 'brending nije u skladu sa zahtevima servisa. Postavljanje bilo kakvih reklama na brendiran automobil je moguće tek nakon dogovora',
                kot: 'le branding ne correspond pas aux exigences du service. D`autres publicités peuvent uniquement être affichées sur des véhicules marqués à condition d`avoir reçu une autorisation officielle',
                isr: 'המיתוג לא עומד בדרישות השירות. כל פרסום אחר על מוניות ממותגות מותנה באישור רשמי',
                fin: 'brändäystä ei voida suorittaa palvelun vaatimusten mukaisesti. Muita mainoksia voidaan näyttää brändätyissä ajoneuvoissa vain virallisella suostumuksella',
                nor: 'Merkingen overholder ikke tjenestekravene. Annen reklame kan kun brukes på merkede biler dersom det er godkjent på forhånd.'
            },
            {
                type: 'item',
                text: 'брендирование не соответствует требованиям сервиса, потому что на лайтбоксе есть посторонняя реклама. Для получения статуса и приоритета, пожалуйста, обновите световой короб',
                rus: 'брендирование не соответствует требованиям сервиса, потому что на лайтбоксе есть посторонняя реклама. Для получения статуса и приоритета, пожалуйста, обновите световой короб',
                arm: 'բրենդավորումը չի համապատասխանում ծառայության պահանջներին, քանի որ լայթբոքսի վրա առկա է կողմնակի գովազդ։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք թարմացնել լայթբոքսը',
                az: 'brendləmə xidmətin tələblərinə uyğun deyil, belə ki, laytboksun üzərində kənar reklam var. Status və prioritet əldə etmək üçün laytboksu yeniləyin',
                est: 'kaubamärgistamine ei vasta teenuse nõuetele, kuna plafoonil on võõras reklaam. Staatuse ja prioriteedi saamiseks uuenda palun plafooni',
                geo: 'ბრენდირება არ შეესაბამება სერვისის მოთხოვნებს, რადგან ლაითბოქსზე გარეშე რეკლამაა. სტატუსისა და პრიორიტეტის მისაღებად განაახლეთ ლაითბოქსი',
                kz: 'брендинг сервис талаптарына сай келмейді, себебі лайтбокста бөгде жарнама бар. Мәртебе мен басымдық алу үшін лайтбоксты жаңартуды өтінеміз',
                kgz: 'брендинг сервистин талаптарына жооп бербейт, анткени лайтбоксто бөлөк жарнама бар. Өтүнүч, статус менен приоритетти алуу үчүн лайтбоксту жаңыртыңыз',
                lta: 'brendings neatbilst servisa prasībām, jo uz pazīšanas zīmes izvietota sveša reklāma. Lai iegūtu statusu un prioritāti, lūdzu, atjaunojiet gaismas pazīšanas zīmi',
                ltu: 'žymėjimas prekės ženklu neatitinka paslaugos reikalavimų, nes ant šviesdėžės yra pašalinė reklama. Norėdami gauti statusą ir prioritetą, atnaujinkite šviesdėžę',
                cro: '',
                uzb: 'Laytboksda boshqa reklama mavjudligi tufayli, brendlash xizmat talablariga mos kelmaydi. Status va ustuvorlikka erishish uchun chiroqli laytboksni yangilang',
                gana: 'branding in violation of service standards (third-party advertisements on the lightbox). Please update the lightbox to obtain this status and priority',
                mda: 'brandingul nu corespunde cerințelor serviciului, deoarece pe caseta luminoasă se află o publicitate străină. Pentru a primi un statut și prioritate, te rugăm să actualizezi caseta luminoasă',
                srb: 'brending nije u skladu sa zahtevima servisa, jer je na svetlećoj tabli tuđa reklama. Kako biste dobili status i prioritet, molimo vas da obnovite svetleću tablu',
                kot: 'le branding ne correspond pas aux standards de service (publicités de tiers sur le lumineux). Veuillez modifier le lumineux pour obtenir ce statut et cette priorité',
                isr: 'המיתוג מפר את דרישות השירות (פרסומות של צד שלישי מוצמדות לשלט המואר). עליך להסיר את הפרסומות מהשלט המואר כדי לקבל את הסטטוס הזה והקדימות',
                fin: 'teippaus ei vastaa palvelun vaatimuksia (kolmannen osapuolen mainoksia taksikuvussa). Korjaa taksikuvun ongelmat saadaksesi tämän tilan ja prioriteetin',
                nor: 'Merkingen bryter med tjenestestandardene (reklame fra tredjeparter på lysboksen). For å få denne statusen og prioriteringen må du oppdatere lysboksen.'
            },
            {
                type: 'details',
                text: 'АВТО',
                details: [
                    { type: 'label', label: 'АВТО', th: true },
                    {
                        type: 'item',
                        text: 'ваш автомобиль не подлежит брендированию',
                        rus: 'ваш автомобиль не подлежит брендированию',
                        arm: 'ձեր ավտոմեքենան բրենդավորման ենթակա չէ',
                        az: 'avtomobiliniz brendləmə üçün yararlı deyil',
                        est: 'sinu sõiduk ei kuulu kaubamärgistamisele',
                        geo: 'თქვენი ავტომანქანა არ ექვემდებარება ბრენდირებას',
                        kz: 'сіздің автокөлікке брендинг жасау мүмкін емес',
                        kgz: 'автоунааңыз брендингге ылайык келбейт',
                        lta: 'jūsu automašīnai brendings nevar tikt veikts',
                        ltu: 'ant jūsų automobilio negalima naudoti prekės ženklo',
                        mda: 'mașina ta nu poate fi branduită',
                        cro: 'vaš automobil nije pogodan za brendiranje',
                        uzb: 'sizning avtomobilingiz brendlash uchun mos kelmaydi',
                        gana: 'your vehicle is ineligible for branding',
                        srb: 'vaš automobil nije pogodan za brendiranje',
                        kot: 'votre véhicule n`est pas éligible au branding',
                        isr: 'המונית שלך לא עומדת בדרישות למיתוג',
                        fin: 'ajoneuvosi ei ole kelvollinen brändättäväksi',
                        nor: 'Kjøretøyet ditt kvalifiserer ikke for merking.'
                    },
                    {
                        type: 'item',
                        text: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
                        rus: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
                        arm: 'լուսանկարում պատկերված ավտոմեքենան չի համապատասխանում անձնական էջում նշվածին։ Անձնական էջի տվյալները կարող է նորացնել ձեր տաքսոպարկը',
                        az: 'fotoşəkildəki avtomobil profildə qeyd olunana uyğun gəlmir. Profildə olan məlumatları taksi parkınız yeniləyə bilər',
                        est: 'fotol olev sõiduk ei vasta profiilis märgitule. Profiilis saab andmeid uuendada sinu taksofirma',
                        geo: 'ფოტოზე არსებული ავტომანქანა არ შეესაბამება იმას, რაც პროფილშია მითითებული. პროფილში მონაცემების განახლება შეუძლია თქვენს ტაქსოპარკს',
                        kz: 'суреттегі автокөлік парақшада көрсетілген көлікке сай келмейді. Сіздің парақшаңыздағы мәліметтерді сіздің таксопарк жаңарта алады',
                        kgz: 'сүрөттөгү автоунаа профилде көрсөтүлгөн машинага туура келбейт. Профилдеги маалыматтарды сиздин таксопаркыңыз жаңырта алат',
                        lta: 'fotogrāfijā redzamā automašīna neatbilst profilā norādītajai. Jūsu taksometru parks var atjaunot profila informāciju',
                        ltu: 'automobilis nuotraukoje neatitinka nurodyto profilyje. Profilio duomenis gali atnaujinti Jūsų automobilių parkas',
                        mda: 'automobilul din fotografie nu coincide cu cel menționat în profil. Datele de profil pot fi actualizate de compania ta de taximetrie',
                        cro: 'vozilo na fotografijama ne odgovara podacima koji su navedeni na profilu. Vaše taksi udruženje može da ažurira podatke na profilu.',
                        uzb: 'fotosuratdagi avtomobil profilda koʻrsatilganga mos kelmaydi. Sizning taksoparkingiz profildagi maʼlumotlarni yangilashi mumkin',
                        gana: "vehicle in the photo doesn't match vehicle indicated in profile. The taxi company can update your profile",
                        srb: 'vozilo na fotografijama ne odgovara podacima koji su navedeni na profilu. Podatke na profilu može da ažurira vaše taksi udruženje',
                        kot: 'le véhicule sur la photo ne correspond pas au véhicule indiqué dans le profil. Le partenaire peut mettre à jour votre profil',
                        isr: 'המונית המופיעה בצילום אינה תואמת למונית שפרטיה מופיעים בפרופיל. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך',
                        fin: 'valokuvassa oleva ajoneuvo ei vastaa profiilissa ilmoitettua ajoneuvoa. Taksiyritys voi päivittää profiilisi',
                        nor: 'Kjøretøyet på bildet stemmer ikke overrens med kjøretøyet på profilen. Taxiselskapet kan oppdatere profilen din.'
                    },
                    {
                        type: 'item',
                        text: 'госномер автомобиля указан неверно. Обновить данные в вашем профиле может таксопарк',
                        rus: 'госномер автомобиля указан неверно. Обновить данные в вашем профиле может таксопарк',
                        arm: 'ավտոմեքենայի պետհամարանիշը սխալ է նշված։ Ձեր անձնական էջի տվյալները կարող է նորացնել տաքսոպարկը',
                        az: 'avtomobilin dövlət qeydiyyat nişanı düzgün qeyd edilməyib. Profilinizdə olan məlumatları taksi parkı yeniləyə bilər',
                        est: 'sõiduki registreerimismärk on vale. Profiilis saab andmeid uuendada sinu taksofirma',
                        geo: 'ავტომანქანის სახ. ნომერი არასწორადაა მითითებული. თქვენს პროფილში მონაცემების განახლება შეუძლია ტაქსოპარკს',
                        kz: 'автокөліктің мемлекеттік нөмірі қате көрсетілген. Сіздің парақшаңыздағы мәліметтерді таксопарк жаңарта алады',
                        kgz: 'автоунаанын мамлекеттик номери туура эмес көрсөтүлгөн. Сиздин профилиңиздеги маалыматтарды таксопарк жаңырта алат',
                        lta: 'automašīnas numura zīme ir norādīta kļūdaini. Jūsu profila informāciju var atjaunot taksometru parks',
                        ltu: 'nurodytas netikslus automobilio valstybinis registracijos numeris. Profilio duomenis gali atnaujinti Jūsų automobilių parkas',
                        mda: 'numărul de înmatriculare al automobilului este indicat greșit. Datele tale de profil pot fi actualizate de compania de taximetrie',
                        cro: 'Registarske tablice vozila nisu pravilno navedene. Taksi udruženje može da ažurira podatke na vašem profilu.',
                        uzb: 'avtomobilning davlat raqami notoʻgʻri koʻrsatilgan. Sizning profilingizdagi maʼlumotlarni taksopark yangilashi mumkin',
                        gana: 'license plate number indicated incorrectly. The taxi company can update your profile',
                        srb: 'registarske tablice vozila nisu pravilno navedene. Vaše podatke na profilu može da ažurira taksi udruženje',
                        kot: 'le numéro de plaque d`immatriculation est indiqué de manière incorrecte. Le partenaire peut mettre à jour votre profil',
                        isr: 'צוין מספר שגוי של לוחית רישוי. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך',
                        fin: 'rekisterinumero on ilmoitettu virheellisesti. Taksiyritys voi päivittää profiilisi',
                        nor: 'Registreringsnummeret er ugyldig. Taxiselskapet kan oppdatere profilen din.'
                    },
                    {
                        type: 'item',
                        text: 'фотографирование автомобиля с экрана компьютера является грубым нарушением',
                        rus: 'фотографирование автомобиля с экрана компьютера является грубым нарушением',
                        arm: 'ավտոմեքենայի լուսանկարումը համակարգչի էկրանից կոպիտ խախտում է',
                        az: 'avtomobilin fotoşəklinin kompüterin ekranından çəkilməsi kobud pozuntudur',
                        est: 'sõiduki pildistamine arvutiekraanilt on jäme reeglite rikkumine',
                        geo: 'კომპიუტერის ეკრანიდან გადაღებული ავტომანქანის ფოტოები წარმოადგენს უხეშ დარღვევას',
                        kz: 'автокөлікті компьютер экранынан суретке түсіру өрескел бұзушылық болып табылады',
                        kgz: 'автоунааны компьютердин экранынан сүрөткө тартуу эрежени одоно бузуу болуп саналат',
                        lta: 'automašīnas fotografēšana no datora ekrāna ir rupjš pārkāpums',
                        ltu: 'automobilio fotografavimas naudojant kompiuterio ekraną yra grubus pažeidimas',
                        cro: 'fotografisanje vozila sa ekrana kompjutera predstavlja grub prekršaj.',
                        uzb: 'avtomobilni kompyuterning ekranidan fotosuratga olish qoʻpol buzilish deb hisoblanadi',
                        gana: 'photographing a vehicle from a computer screen is a serious violation',
                        mda: 'fotografierea unei mașini de pe ecranul unui computer este o încălcare gravă',
                        srb: 'fotografisanje vozila sa ekrana kompjutera predstavlja težak prekršaj',
                        kot: 'photographier un véhicule à partir d`un écran d`ordinateur constitue une infraction grave',
                        isr: 'צילום מונית מתוך מסך מחשב נחשב להפרה חמורה',
                        fin: 'ajoneuvon kuvaaminen tietokoneen näytöltä on vakava sääntörikkomus.',
                        nor: 'Det er et alvorlig brudd på reglene å sende inn et skjermbilde av et kjøretøy i stedet for et faktisk bilde av kjøretøyet.'
                    },
                    {
                        type: 'item',
                        text: 'нет ни одной фотографии автомобиля',
                        rus: 'нет ни одной фотографии автомобиля',
                        arm: 'չկա ավտոմեքենայի որևէ լուսանկար',
                        az: 'avtomobilin heç bir fotoşəkli yoxdur',
                        est: 'sõidukist pole ühtegi fotot',
                        geo: 'ავტომანქანის არცერთი ფოტო არ არის',
                        kz: 'автокөліктің бірде бір фотосуреті жоқ',
                        kgz: 'автоунаанын бир дагы сүрөтү жок',
                        lta: 'nav nevienas automašīnas fotogrāfijas',
                        ltu: 'nėra nė vienos automobilio nuotraukos',
                        cro: 'ne postoji nijedna fotografija vozila',
                        uzb: 'avtomobilning bitta ham fotosurati mavjud emas',
                        gana: 'not a single vehicle photo',
                        mda: 'nu a fost încărcată nicio fotografie a automobilului',
                        srb: 'ne postoji nijedna fotografija vozila',
                        kot: 'aucune photo de véhicule',
                        isr: 'זו לא תמונה של מונית אחת',
                        fin: 'ei kuvia ajoneuvosta',
                        nor: 'Ikke et eneste bilde av kjøretøyet.'
                    },
                    {
                        type: 'item',
                        text: 'брендированная наклейка попала в кадр не полностью',
                        rus: 'брендированная наклейка попала в кадр не полностью',
                        arm: 'բրենդավորված նշանը կադրում լրիվ չի երևում',
                        az: 'brend nişanı kadra tam düşməyib',
                        est: 'kaubamärgikleebis ei ole tervenisti kaadris',
                        geo: 'ბრენდირებული სტიკერი კადრში არასრულად მოხვდა',
                        kz: 'брендинг жапсырмасы кадрға толық түспеген',
                        kgz: 'брендделген чаптама кадрга толук түшпөй калган',
                        lta: 'brendinga uzlīme kadrā nav redzama pilnīgi',
                        ltu: 'nuotraukoje matosi ne visas prekės ženklo lipdukas',
                        cro: 'brendirana nalepnica nije cela u kadru',
                        uzb: 'brending yopishqoq yorligʻi kadrga toʻliq tushmagan',
                        gana: 'branded wrap not fully in frame',
                        mda: 'autocolantul de branding nu a intrat complet în cadru',
                        srb: 'brendirana nalepnica nije cela u kadru',
                        kot: 'le marquage n`est pas entièrement encadré',
                        isr: 'המדבקה יוצאת מהמסגרת',
                        fin: 'teippaus ei näy kuvassa kokonaan',
                        nor: 'Varemerkefolien er ikke innenfor rammen.'
                    },
                    {
                        type: 'item',
                        text: 'нечеткое фото не позволяет подтвердить оклейку',
                        rus: 'нечеткое фото не позволяет подтвердить оклейку',
                        arm: 'ոչ հստակ լուսանկարը թույլ չի տալիս հաստատել բրենդային ձևավորումը',
                        az: 'bulanıq fotoşəkil brend nişanını təsdiqləməyə imkan vermir',
                        est: 'hägune foto ei võimalda kleebist kinnitada',
                        geo: 'ბუნდოვანი ფოტო არ იძლევა გადაკვრის დადასტურების საშუალებას',
                        kz: 'айқын емес фото арқылы жапсырманы растау мүмкін емес',
                        kgz: 'сүрөт даана тартылбаганы үчүн чаптаманы ырастоо мүмкүн эмес',
                        lta: 'neskaidra fotogrāfija neļauj apstiprināt virsmas marķējumu',
                        ltu: 'dėl neryškios nuotraukos negalima patvirtinti lipduko su prekės ženklu',
                        cro: 'zbog mutne fotografije ne može se potvrditi brendirana nalepnica',
                        uzb: 'fotosuratning xiraligi tufayli brending yopishtirma qismini tasdiqlashning imkoni yoʻq',
                        gana: 'photograph out of focus, impossible to confirm branded wrap',
                        mda: 'o fotografie neclară nu permite confirmarea brandingului cu autocolante',
                        srb: 'zbog mutne fotografije se ne može potvrditi brendirana nalepnica',
                        kot: 'la photo est floue, impossible de confirmer le marquage',
                        isr: 'הצילום לא בפוקוס ולכן לא ניתן לאמת את המדבקה',
                        fin: 'valokuva on epätarkka, teippauksen vahvistaminen ei onnistu',
                        nor: 'Bildet er ikke i fokus, varemerkefolien kan ikke bekreftes.'
                    },
                    {
                        type: 'item',
                        text: 'невозможно подтвердить наклейку. Сфотографируйте, пожалуйста, ближе',
                        rus: 'невозможно подтвердить наклейку. Сфотографируйте, пожалуйста, ближе',
                        arm: 'հնարավոր չէ հաստատել բրենդային ձևավորումը։ Խնդրում ենք ավելի մոտիկից լուսանկարել',
                        az: 'yapışdırmanı təsdiqləmək mümkün deyil. Fotoşəklini daha yaxından çəkin',
                        est: 'kleebist pole võimalik kinnitada. Palun pildista lähemalt',
                        geo: 'სტიკერის დადასტურება შეუძლებელია. უფრო ახლოს გადაუღეთ',
                        kz: 'жапсырманы растау мүмкін емес Суретке жақынырақ түсіруіңізді өтінеміз',
                        kgz: 'чаптаманы ырастоо мүмкүн эмес. Сүрөткө жакыныраактан тартыңыз',
                        lta: 'nav iespējams apstiprināt virsmas marķējumu. Lūdzu, nofotografējiet tuvāk',
                        ltu: 'neįmanoma patvirtinti lipduko. Nufotografuokite iš arčiau',
                        cro: 'nemoguće je potvrditi nalepnicu. Molimo vas, fotografišite bliže',
                        uzb: 'yopishqoq yorliqni tasdiqlashning iloji yoʻq. Yaqinroqdan fotosuratga oling',
                        gana: 'impossible to confirm sticker. Please take photographs closer to the vehicle',
                        mda: 'confirmarea aplicării autocolantului este imposibilă. Te rugăm să fotografiezi de mai aproape',
                        srb: 'nemoguće je potvrditi nalepnicu. Molimo vas, fotografišite bliže',
                        kot: 'impossible de confirmer l`autocollant. Veuillez prendre des photos plus près du véhicule',
                        isr: 'לא ניתן לאמת את המדבקה. צריך לעמוד קרוב יותר למונית כשמצלמים אותה',
                        fin: 'tarran vahvistaminen ei onnistu. Ota ajoneuvosta valokuvat lähempää',
                        nor: 'Klistremerket kan ikke bekreftes. Ta bilder nærmere kjøretøyet.'
                    },
                    {
                        type: 'item',
                        text: 'темное фото не позволяет подтвердить оклейку. Рекомендуем выбрать более освещенное место',
                        rus: 'темное фото не позволяет подтвердить оклейку. Рекомендуем выбрать более освещенное место',
                        arm: 'մուգ լուսանկարը թույլ չի տալիս հաստատել բրենդային ձևավորումը։ Խորհուրդ ենք տալիս ավելի լուսավորված տեղ ընտրել',
                        az: 'qaranlıq fotoşəkil brend nişanını təsdiqləməyə imkan vermir. Daha işıqlı yer seçməyi tövsiyə edirik',
                        est: 'tume foto ei võimalda kleebist kinnitada. Soovitame valida parema valgusega koha',
                        geo: 'ბნელი ფოტო არ იძლევა გადაკვრის დადასტურების საშუალებას. გირჩევთ აირჩიოთ უფრო განათებული ადგილი',
                        kz: 'бұлыңғыр фото арқылы жапсырманы растау мүмкін емес. Барынша жарық орын таңдауға кеңес береміз',
                        kgz: 'сүрөт караңгы болуп калганы үчүн чаптаманы ырастоо мүмкүн эмес. Жарыгыраак жерге барууну сунуштайбыз',
                        lta: 'tumša fotogrāfija neļauj apstiprināt virsmas marķējumu. Iesakām izvēlēties labāk apgaismotu vietu',
                        ltu: 'dėl tamsios nuotraukos negalima patvirtinti lipduko su prekės ženklu. Rekomenduojame pasirinkti geriau apšviestą vietą',
                        cro: 'fotografija je previše tamna da bi se potvrdila brendirana nalepnica Predlažemo da odaberete mesto sa boljim osvetljenjem.',
                        uzb: 'fotosurat qorongʻi joyda olinganligi sababli brending yopishtirma qismini tasdiqlashning imkoni yoʻq. Yorugʻroq joyni tanlashni tavsiya etamiz',
                        gana: 'photograph too dark, impossible to confirm branded wrap. Please choose a more well-lit area',
                        mda: 'o fotografie întunecată nu permite confirmarea brandingului cu autocolante. Îți recomandăm să alegi un loc mai luminos',
                        srb: 'fotografija je previše tamna da bi se potvrdila brendirana nalepnica. Predlažemo da odaberete mesto sa boljim osvetljenjem',
                        kot: 'la photo est trop sombre, impossible de confirmer le marquage. Veuillez choisir un endroit plus éclairé',
                        isr: 'הצילום חשוך מדי ולכן לא ניתן לאמת את המדבקה. צריך לצלם באזור מואר יותר',
                        fin: 'valokuva on liian hämärä, teippauksen vahvistaminen ei onnistu. Valitse paremmin valaistu alue valokuvan ottamiseen',
                        nor: 'Bildet er for mørkt, varemerkefolien kan ikke bekreftes. Velg et område med bedre belysning.'
                    }
                ]
            },
            {
                type: 'item',
                text: 'оклейка повреждена',
                rus: 'оклейка повреждена',
                arm: 'բրենդային ձևավորումը վնասված է',
                az: 'brend nişanı zədələnib',
                est: 'kleebis on kahjustatud',
                geo: 'გადაკვრა დაზიანებულია',
                kz: 'жапсырма бүлінген',
                kgz: 'чаптама сыйрылып калган',
                lta: 'virsmas marķējums ir bojāts',
                ltu: 'pažeistas lipdukas su prekės ženklu',
                cro: 'brendirane nalepnice su oštećene',
                uzb: 'yopishtirilgan material shikastlangan',
                gana: 'branded wrap damaged',
                mda: 'autocolantul este deteriorat',
                srb: 'brendirane nalepnice su oštećene',
                kot: 'le marquage est endommagé',
                isr: 'המדבקה פגומה',
                fin: 'teippaus vaurioitunut',
                nor: 'Varemerkefolien er skadet.'
            },
            {
                type: 'item',
                text: 'надпись повреждена',
                rus: 'надпись повреждена',
                arm: 'գրվածքը վնասված է',
                az: 'yazı zədələnib',
                est: 'kiri on kahjustatud',
                geo: 'წარწერა დაზიანებულია',
                kz: 'жазба бүлінген',
                kgz: 'жазуу сыйрылып калган',
                lta: 'uzraksts ir bojāts',
                ltu: 'pažeistas užrašas',
                cro: 'natpis je oštećen',
                uzb: 'yozuv zararlangan',
                gana: 'inscription damaged',
                mda: 'inscripția este deteriorată',
                srb: 'natpis je oštećen',
                kot: 'l`inscription est endommagée',
                isr: 'הכיתוב פגום',
                fin: 'teksti vaurioitunut',
                nor: 'Inskripsjonen er skadet.'
            },
            {
                type: 'item',
                text: 'повреждена оклейка зеркал',
                rus: 'повреждена оклейка зеркал',
                arm: 'ապակիների բրենդային ձևավորումը վնասված է',
                az: 'güzgülərin brend nişanı zədələnib',
                est: 'peeglikleebised on kahjustatud',
                geo: 'სარკეების გადაკვრა დაზიანებულია',
                kz: 'айналардың жапсырмасы бүлінген',
                kgz: 'күзгүлөрдүн чаптамасы сыйрылып калган',
                lta: 'bojāts spoguļu virsmas marķējums',
                ltu: 'pažeisti veidrodžių lipdukai su prekės ženklu',
                cro: 'oštećena je folija na retrovizorima',
                uzb: 'oynalarning brending yopishtirma qismi shikastlangan',
                gana: 'rear-view mirror branded wrap damaged',
                mda: 'autocolantele de pe oglinzi sunt deteriorate',
                srb: 'oštećena je folija na retrovizorima',
                kot: 'le marquage du rétroviseur est endommagé',
                isr: 'המדבקה שעל המראה האחורית פגומה',
                fin: 'taustapeilin teippaus vaurioitunut',
                nor: 'Varemerkefolien på bakvinduet er skadet.'
            },
            {
                type: 'only',
                only: 'опущены боковые стёкла. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)'
            },
            {
                type: 'only',
                only: 'кузов сильно повреждён. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)'
            },
            {
                type: 'details',
                text: 'ЦВЕТОВАЯ СХЕМА',
                details: [
                    { type: 'label', label: 'ЦВЕТОВАЯ СХЕМА', th: true },
                    {
                        type: 'item',
                        text: 'не соблюдена цветовая схема оклейки автомобиля (__УКАЗАТЬ__). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        rus: 'не соблюдена цветовая схема оклейки автомобиля (__УКАЗАТЬ__). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
                        arm: 'Չի պահպանվել ավտոմեքենայի բրենդային ձևավորման գունային սխեման ({УКАЗАТЬ}): Ավելի մանրամասն տեղեկատվություն կարող եք ստանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
                        az: 'avtomobilin brend nişanı yapışdırılarkən rəng sxeminə riayət olunmayıb ({УКАЗАТЬ}). Daha ətraflı məlumat əldə etmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
                        est: 'sõiduki kleebise värvikava pole järgitud ({УКАЗАТЬ}). Täpsema teabe saamiseks klõpsake lingil: (https://driver.yandex/branding_rules_2/)',
                        geo: 'არ არის დაცული ავტომობილის გადაკვრის ფერის სქემა ({УКАЗАТЬ}). დეტალური ინფორმაციისთვის გადადით ბმულზე: (https://driver.yandex/branding_rules_2/)',
                        kz: 'автокөлік жапсырмасының түс сұлбасы сақталмаған ({УКАЗАТЬ}). Толығырақ ақпарат алу үшін мына сілтеме арқылы өтіңіз: (https://driver.yandex/branding_rules_2/)',
                        kgz: 'автоунаанын чаптамасында түс боюнча схема сакталган эмес ({УКАЗАТЬ}). Кеңири маалымат алүү үчүн шилтеме аркылуу өтүңүз: (https://driver.yandex/branding_rules_2/)',
                        lta: 'nav ievērota automašīnas virsmas marķējuma krāsu shēma ({УКАЗАТЬ}). Lai iegūtu vairāk informācijas, sekojiet saitei: (https://driver.yandex/branding_rules_2/)',
                        ltu: 'neišlaikyta spalvinė automobilio lipdukų schema ({УКАЗАТЬ}). Išsamią informaciją rasite apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
                        mda: 'nu se respectă schema de culori a autocolantelor de pe automobil ({УКАЗАТЬ}). Pentru informații detaliate, accesați link-ul: (https://driver.yandex/branding_rules_2/)',
                        cro: 'nije ispoštovana kolor šema za brending automobila ({УКАЗАТЬ}). Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
                        uzb: 'avtomobilga brending yopishtirma qismini joylashtirishda rang sxemasiga amal qilinmagan ({УКАЗАТЬ}). Batafsil maʼlumot uchun havola orqali oʻting: (https://driver.yandex/branding_rules_2/)',
                        fin: 'Tarrojen väri on väärä.',
                        nor: 'Merkingen strider med fargeplanen for varemerkefolie for kjøretøy.'
                    },
                    {
                        type: 'only',
                        only: 'не соблюдена цветовая схема оклейки автомобиля (буква "Я" должна быть черного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'не соблюдена цветовая схема оклейки автомобиля (буква "Я" должна быть красного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'не соблюдена цветовая схема оклейки автомобиля (буква "Я" должна быть белого цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'не соблюдена цветовая схема оклейки автомобиля (ливрея должна быть бело-черного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'не соблюдена цветовая схема оклейки автомобиля (ливрея должна быть желто-черного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    },
                    {
                        type: 'only',
                        only: 'не соблюдена цветовая схема оклейки автомобиля (ливрея должна быть бело-желтого цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)'
                    }
                ]
            }
        ]
    },
    blacklist: {},
    injection: {
        block: {},
        blacklist: {}
    },
    lightbox,
    uber: [
        { type: 'label', label: 'УБЕР', th: true },
        {
            type: 'only',
            only: 'брендирование данного типа неактуально и не соответствует требованиям сервиса. Обновите брендирование в соответствии с новыми требованиями'
        },
        {
            type: 'only',
            only: 'брендирование не соответствует требованиям сервиса. Размещать любую рекламу на брендированном автомобиле можно только по согласованию'
        },
        { type: 'only', only: 'оклейка не соответствует стандартам' },
        { type: 'only', only: 'оклейка заднего стекла не соответствует стандартам' },
        {
            type: 'only',
            only: 'использованы магнитные наклейки. Пожалуйста, оклейте машину в соответствии со стандартами'
        },
        { type: 'only', only: 'отсутствует оклейка заднего стекла' },
        { type: 'only', only: 'отсутствует шашечный пояс' },
        { type: 'only', only: 'опущены боковые стёкла' },
        { type: 'only', only: 'кузов сильно повреждён' },
        { type: 'label', label: 'УБЕР КЗ', th: true },
        {
            type: 'item',
            text: 'оклейка Uber не даёт преимуществ в вашем городе. Посмотрите, в каких городах действует Uber KZ, здесь: https://support-uber.com/ru_kz/almaty/tariff',
            rus: '',
            az: '',
            kgz: '',
            geo: '',
            cro: '',
            uzb: '',
            ltu: '',
            est: '',
            mda: '',
            arm: '',
            gana: '',
            srb: '',
            lta: '',
            isr: '',
            fin: '',
            nor: '',
            kot: '',
            kz: 'Uber жапсырмасы сіздің қалаңызда артықшылықтар бермейді. Uber KZ қандай қалаларда артықшылықтар беретінін мына жерден қараңыз: https://support-uber.com/ru_kz/almaty/tariff'
        }
    ],
    remarks: lightbox
};
const countries = {
    rus: 'РФ',
    az: 'Азербайджан',
    kgz: 'Киргизия',
    geo: 'Грузия',
    cro: 'Хорватия',
    uzb: 'Узбекистан',
    ltu: 'Литва',
    est: 'Эстония',
    mda: 'Молдавия-Румыния',
    arm: 'Армения',
    gana: 'Гана',
    srb: 'Сербия',
    lta: 'Латвия',
    isr: 'Израиль',
    fin: 'Финляндия',
    nor: 'Норвегия',
    kot: "Кот-д'Ивуар",
    kz: 'Казахстан'
};
const config = {
    templates,
    countries,
    cities: cities
};

;// CONCATENATED MODULE: ./src/Templates/BrandTemplatesWithDetails/BrandTemplatesWithDetails.controller.ts


class BrandModelTemplatesController {
    constructor(_service) {
        this._service = _service;
        this.htmlElements = {
            modal: null,
            commentList: null,
            head: null,
            messageBox: null
        };
        this.createdBrandHtmlElements = {
            style: document.createElement('style'),
            areaInModalDialog: document.createElement('div'),
            selectCountryTranslate: document.createElement('select'),
            btns: {
                btnStickers: this.createBtnInModal('Стикеры', '#1dacd6', () => this.fillTemplates('block')),
                btnUber: this.createBtnInModal('UBER', '#000', () => this.fillTemplates('uber')),
                btnLightbox: this.createBtnInModal('Лайтбоксы', '#f0ad4e', () => this.fillTemplates('lightbox'))
            }
        };
        this._country = '';
    }
    createBtnInModal(title, color, callback) {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-modal');
        btn.setAttribute('style', `padding: 5px; cursor: pointer; color: #fff; background-color: ${color}; margin-right: 5px;`);
        btn.textContent = title;
        btn.addEventListener('click', callback);
        return btn;
    }
    reset() {
        this.createdBrandHtmlElements.selectCountryTranslate.disabled = false;
        Object.values(this.createdBrandHtmlElements.btns).forEach((btn) => {
            btn.disabled = false;
        });
        this.htmlElements.commentList.innerHTML = '';
    }
    fillTemplates(type) {
        this._template = type;
        this.htmlElements.commentList.innerHTML = this._service.filterAndFillTemplateBrandInHTML(type, this.createdBrandHtmlElements.selectCountryTranslate.value, this.createdBrandHtmlElements.selectCountryTranslate.value === 'rus');
    }
    setCityInSelectAndFillTemplatesWithDetails(type, city) {
        this._country = this._service.checkCity(city);
        this._template = type;
        this.reset();
        this.createdBrandHtmlElements.selectCountryTranslate.value = this._country;
        this.fillTemplates(this._template);
    }
    freeze() {
        this.createdBrandHtmlElements.selectCountryTranslate.disabled = true;
        Object.values(this.createdBrandHtmlElements.btns).forEach((btn) => {
            btn.disabled = true;
        });
    }
    addCommentFromTemplate(event) {
        const target = event.target;
        const { messageBox } = this.htmlElements;
        if (target.classList.contains('template-head')) {
            return;
        }
        if (target.tagName === 'SUMMARY') {
            const name = target.textContent.substring(2);
            if (!target.closest('details').open) {
                target.textContent = `ᐁ ${name}`;
                return;
            }
            target.textContent = `ᐅ ${name}`;
            return;
        }
        this.freeze();
        if (messageBox.value) {
            messageBox.value = `${messageBox.value},\n${target.getAttribute('itemvalue')}`;
            return;
        }
        messageBox.value = target.getAttribute('itemvalue');
    }
    init(htmlElements) {
        this.htmlElements = htmlElements;
        this.htmlElements.modal.style.width = '50%';
        this.htmlElements.commentList.style.height = '425px';
        this.createdBrandHtmlElements.areaInModalDialog.style.margin = '5px';
        this.createdBrandHtmlElements.selectCountryTranslate.innerHTML =
            this._service.fillCountriesInHTML();
        this.createdBrandHtmlElements.selectCountryTranslate.style.float = 'right';
        this.createdBrandHtmlElements.style.innerHTML = `.template-item{border-bottom: 1px solid #cacaca; padding: 4px 8px;}.template-head{background-color:#d8e6ea;font-weight:bold;padding:2px 10px}.template-item:hover{background-color: #f3f3f3; cursor: pointer} .template-menu{border-bottom: 1px solid #cacaca; padding: 4px 8px; background-color: #b6d7a8;} .template-menu:hover{cursor: pointer;}`;
        this.htmlElements.head.append(this.createdBrandHtmlElements.style);
        this.htmlElements.commentList.before(this.createdBrandHtmlElements.areaInModalDialog);
        this.createdBrandHtmlElements.areaInModalDialog.append(this.createdBrandHtmlElements.selectCountryTranslate);
        Object.values(this.createdBrandHtmlElements.btns).forEach((btn) => this.createdBrandHtmlElements.areaInModalDialog.append(btn));
        this.createdBrandHtmlElements.selectCountryTranslate.addEventListener('change', () => {
            this.fillTemplates(this._template);
        });
        this.htmlElements.commentList.addEventListener('click', (e) => this.addCommentFromTemplate(e));
    }
}
const BrandModelTemplates = new BrandModelTemplatesController(new BrandTemplatesWithDetailsService(config));

;// CONCATENATED MODULE: ./src/Templates/BrandTemplatesWithDetails/BrandTemplatesWithDetails.ts

let city;
$(document).bind('item_info', function (e, params) {
    city = params.city;
});
const BrandTemplatesWithDetails_htmlElements = {
    modal: document.querySelector('.modal-dialog'),
    commentList: document.querySelector('#comment-list'),
    head: document.querySelector('head'),
    messageBox: document.querySelector('#msg')
};
const html = {
    btnBlock: document.querySelector('#btn-block'),
    btnRemarks: document.querySelector('#btn-dkb-minor-remarks')
};
BrandModelTemplates.init(BrandTemplatesWithDetails_htmlElements);
Object.values(html).forEach((btn) => btn.addEventListener('click', () => {
    const names = btn.getAttribute('id').split('-');
    BrandTemplatesWithDetails_htmlElements.commentList.style.display = 'block';
    BrandModelTemplates.setCityInSelectAndFillTemplatesWithDetails(names[names.length - 1], city);
}));

;// CONCATENATED MODULE: ./src/other/RotateScaleBrightPhotos/RotateScaleBright.logic.ts
class RotateScaleBrightLogic {
    constructor() {
        this.htmlElements = {
            content: null,
            photos: null,
            btns: []
        };
        this.createdHtmlElements = {
            rangeScale: this.createRangeScaleBright('Изображение', 50, 250, this.scaleContent.bind(this)),
            rangeBright: this.createRangeScaleBright('Контраст', 80, 200, this.brightContent.bind(this)),
            wrapper: document.createElement('div')
        };
    }
    createRangeScaleBright(textModule, min, max, callback) {
        const wrapper = document.createElement('div');
        const labelRange = document.createElement('div');
        const range = document.createElement('input');
        const parentRange = document.createElement('div');
        const name = callback.name.replace('bound ', '');
        wrapper.classList.add('wrapper-range');
        wrapper.append(labelRange, parentRange);
        labelRange.textContent = `⯆ ${textModule}`;
        labelRange.setAttribute('style', `color: white; background-color: black; padding: 3px 8px; border: 1px solid rgb(128,128,128); border-radius: 3px; margin: 2px; opacity: 0.5; cursor: pointer;`);
        range.setAttribute('type', 'range');
        range.dataset.name = textModule;
        range.setAttribute('step', '10');
        range.setAttribute('min', String(min));
        range.setAttribute('value', '100');
        range.setAttribute('max', String(max));
        range.setAttribute('title', `Размер ${textModule} 100%`);
        parentRange.setAttribute('style', `padding: 5px; background-color: #fff; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 6px 12px rgba(0,0,0,0.175); display: ${localStorage.getItem(`dkvu.${name}`)};`);
        parentRange.append(range);
        labelRange.addEventListener('click', () => {
            localStorage.setItem(`dkvu.${name}`, parentRange.style.display === 'block' ? 'none' : 'block');
            parentRange.style.display = localStorage.getItem(`dkvu.${name}`);
        });
        range.addEventListener('change', () => callback(range));
        return {
            wrapper,
            parentRange,
            range
        };
    }
    rotateContent(value) {
        const deg = Number(this.htmlElements.content.dataset.rotate);
        this.htmlElements.content.style.transform = `rotate(${deg + value}deg) scale(${this.htmlElements.content.dataset.scale})`;
        this.htmlElements.content.dataset.rotate = String(deg + value);
    }
    scaleContent(rangeScale) {
        this.htmlElements.content.style.transform = `rotate(${this.htmlElements.content.dataset.rotate}deg) scale(${Number(rangeScale.value) / 100})`;
        rangeScale.setAttribute('title', `Размер изображения ${rangeScale.value}%`);
        this.htmlElements.content.dataset.scale = String(Number(rangeScale.value) / 100);
    }
    brightContent(rangeBright) {
        this.htmlElements.content.style.filter = `brightness(${Number(rangeBright.value) / 100})`;
        rangeBright.setAttribute('title', `Размер контраст ${rangeBright.value}%`);
    }
    resetContent() {
        this.htmlElements.content.style.transform = `rotate(0deg) scale(1.0)`;
        this.htmlElements.content.style.filter = `brightness(1)`;
        this.createdHtmlElements.rangeScale.range.value = '100';
        this.createdHtmlElements.rangeScale.range.setAttribute('title', `Размер изображения 100%`);
        this.createdHtmlElements.rangeBright.range.value = '100';
        this.createdHtmlElements.rangeBright.range.setAttribute('title', `Размер контраст 100%`);
        this.htmlElements.content.dataset.rotate = '0';
        this.htmlElements.content.dataset.scale = '1';
    }
    init(htmlElements) {
        this.htmlElements = htmlElements;
        this.createdHtmlElements.wrapper.setAttribute('style', `position: absolute; top: 40px; right: 0; min-width: 180px`);
        this.htmlElements.content.dataset.rotate = '0';
        this.htmlElements.content.dataset.scale = '1';
        this.createdHtmlElements.wrapper.append(this.createdHtmlElements.rangeScale.wrapper, this.createdHtmlElements.rangeBright.wrapper);
        this.htmlElements.photos.before(this.createdHtmlElements.wrapper);
        this.htmlElements.btns.forEach((btn) => btn.addEventListener('click', () => this.rotateContent(Number(btn.value))));
        this.htmlElements.content.addEventListener('wheel', (e) => {
            if (e.shiftKey) {
                if (e.deltaY < 0) {
                    return this.rotateContent(-90);
                }
                return this.rotateContent(90);
            }
            if (e.deltaY < 0) {
                this.createdHtmlElements.rangeScale.range.value = String(Number(this.createdHtmlElements.rangeScale.range.value) - 10);
                return this.scaleContent(this.createdHtmlElements.rangeScale.range);
            }
            this.createdHtmlElements.rangeScale.range.value = String(Number(this.createdHtmlElements.rangeScale.range.value) + 10);
            return this.scaleContent(this.createdHtmlElements.rangeScale.range);
        });
    }
}
const RotateScaleBright = new RotateScaleBrightLogic();

;// CONCATENATED MODULE: ./src/other/RotateScaleBrightPhotos/RotateScaleBright.ts

$('.rotate.btn.btn-info').each(function () {
    $(this).unbind('click');
});
const RotateScaleBright_html = {
    content: document.querySelector('#content'),
    photos: document.querySelector('#photos'),
    btns: document.querySelectorAll('.pull-right>button')
};
const checkThumbNumber = document.querySelector('.check-thumb-number');
const marksParent = document.querySelector('#mkk-invite').parentElement;
const btnsParent = document.querySelector('#btn-ok').parentElement;
const mkkInvite = document.querySelector('#mkk-invite');
RotateScaleBright_html.photos.before(checkThumbNumber);
RotateScaleBright_html.photos.before(marksParent);
checkThumbNumber.style.bottom = '80px';
marksParent.style.top = '40px';
marksParent.style.zIndex = '99999';
btnsParent.style.zIndex = '99999';
mkkInvite.style.maxWidth = '600px';
RotateScaleBright.init(RotateScaleBright_html);
$(document).bind('select_item', function (e, params) {
    RotateScaleBright.resetContent();
});
$(document).bind('content', function (e, params) {
    RotateScaleBright.resetContent();
    if (params.rotate === false) {
        RotateScaleBright_html.btns.forEach((btn) => {
            btn.disabled = false;
        });
    }
});

// EXTERNAL MODULE: ./src/other/BtnsInInfo/BtnsInInfo.ts
var BtnsInInfo = __webpack_require__(797);
;// CONCATENATED MODULE: ./src/Directions/brand/index.ts















startColorTree(colorTreeConfig);
startColorInfo(colorInfoConfig);
startPulloutPanelTags(pulloutPanelTagsConfig);
startCountCase('car');

})();

/******/ })()
;