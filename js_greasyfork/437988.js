// ==UserScript==
// @name         Bundle для проверок СТС
// @version      1.0.3
// @description  Общий бандл для проверок в очереди СТС
// @author       L
// @include	https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @grant none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/437988/Bundle%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%A1%D0%A2%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/437988/Bundle%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%A1%D0%A2%D0%A1.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 598:
/***/ (() => {

let fontSizeOnScreen = 0;
let stsNumber;
let typeOfCheck;
function writeCounter() {
    $('#dkk-report').text(`Замечания: ${reportSts.Block} Успешно: ${reportSts.Success} Всего: ${+reportSts.Block + +reportSts.Remarks + +reportSts.Success}`);
}
window.screen.availWidth < 1400 ? (fontSizeOnScreen = 10) : (fontSizeOnScreen = 14);
let reportSts = JSON.parse(localStorage.getItem('reportSts'));
if (reportSts) {
    writeCounter();
}
else {
    reportSts = {
        BlackList: 0,
        Block: 0,
        Remarks: 0,
        Success: 0,
        history: []
    };
}
reportSts.load = function () {
    const localReportSts = JSON.parse(localStorage.getItem('reportSts'));
    for (const prop in localReportSts) {
        reportSts[prop] = localReportSts[prop];
    }
};
function SaveStsInput() {
    stsNumber = $('#sts-number').val().replace(/\s+/g, '');
    console.log(stsNumber);
}
function SaveStsItem(e, a) {
    stsNumber = a.car_number;
    console.log(stsNumber);
}
$('#sts-number').on('change', SaveStsInput);
$(document).on('item_info', SaveStsItem);
reportSts.add = function (p) {
    reportSts.load();
    reportSts.history.push({ stsNumber, p });
    reportSts[p] += 1;
    console.log(reportSts);
    localStorage.setItem('reportSts', JSON.stringify(reportSts));
    writeCounter();
};
reportSts.reset = function () {
    const agree = window.confirm('Сбросить счетчик проверок?');
    if (agree) {
        reportSts.BlackList = 0;
        reportSts.Block = 0;
        reportSts.Remarks = 0;
        reportSts.Success = 0;
        reportSts.history = [];
        localStorage.setItem('reportSts', JSON.stringify(reportSts));
        writeCounter();
    }
};
$('<div/>', {
    css: { display: 'inline-block' },
    append: $('<span/>', {
        text: `Замечания: ${reportSts.Block} Успешно: ${reportSts.Success} Всего: ${+reportSts.Block + +reportSts.Remarks + +reportSts.Success}`,
        css: { color: 'white', margin: '0 0 0 5px', fontSize: `${fontSizeOnScreen}px` },
        id: 'dkk-report'
    }).add($('<i/>', {
        id: 'report-close',
        text: '❌',
        css: { color: '#5bc0de', font: '18px bold sans-serif', display: 'none', cursor: 'pointer' },
        click: reportSts.reset
    }))
})
    .insertBefore($('.container-filters>.pull-right'))
    .hover(function () {
    $('#report-close').css('display', 'inline');
}, function () {
    $('#report-close').css('display', 'none');
});
$('div.pull-right').append($('<button/>', {
    class: 'rotate btn btn-info',
    text: 'Кейсы',
    id: 'historySts',
    css: {
        backgroundColor: '#646f9a'
    }
}));
document.querySelector('#historySts').addEventListener('click', () => {
    const container = $('.tab-content');
    if ($('#check_history').length > 0) {
        $(container).find('.active.in').removeClass('active in');
        $('#check_history').toggleClass('active in');
        $('#items-tabs>li').removeClass('active');
    }
    else {
        $(container).find('.active.in').removeClass('active in');
        $('<div/>', {
            id: 'check_history',
            class: 'tab-pane fade active in',
            append: $('<div/>', {
                class: 'datagrid datagrid-striped datagrid-vertical-top datagrid-disable-scroll-h font12',
                append: $('<div/>', {
                    class: 'datagrid-body nonbounce',
                    append: $('<div/>', {
                        class: 'datagrid-content',
                        append: $('<table/>', {
                            id: 'history_container',
                            append: $('<tbody/>', {
                                class: 'history_table'
                            })
                        })
                    })
                })
            })
        }).prependTo(container);
        $('#items-tabs>li').removeClass('active');
    }
    const historyTable = $('.history_table');
    reportSts.load();
    historyTable.empty();
    reportSts.history.forEach(function (item) {
        $(historyTable).append($('<tr/>', {
            append: $('<td/>', {
                text: item.stsNumber
            }).add($('<td/>', {
                text: item.p
            }))
        }));
    });
});
$('#btn-ok').bind('click', function () {
    if ($('div.check-thumb-view-dkk.cover>span.mark-bad:visible').length === 0) {
        reportSts.add('Success');
    }
    else {
        typeOfCheck = 'Remarks';
    }
});
$('#btn-block').bind('click', function () {
    typeOfCheck = 'Block';
});
$('#btn-error').bind('click', function () {
    reportSts.add(typeOfCheck);
});


/***/ }),

/***/ 541:
/***/ (() => {

const parent = document.querySelector('.nav-tabs');
const li = document.createElement('li');
const button = document.createElement('a');

button.textContent = '🛠️';
button.setAttribute(
  'style',
  `border-radius: 4px; background-color: #267fb1; color: #fff; cursor: pointer;`
);
// button.style.borderRadius = '4px';
// button.style.backgroundColor = '#267fb1';
// button.style.color = '#fff';
// button.style.cursor = 'pointer';
li.appendChild(button);
parent.appendChild(li);

const url = document.location.href;

function checkLicenseDkvu() {
  const src = document.getElementById('info').innerHTML;
  if (
    src.includes('Рига') ||
    src.includes('Даугавпилс') ||
    src.includes('Лиепая') ||
    src.includes('Валмиера') ||
    src.includes('Вентспился') ||
    src.includes('Елгава')
  ) {
    const license = document.getElementById('dkvu-middle-name').value.trim();
    // http://www.atd.lv/ru/taxi?fname=&lname=&regnr=TV-03160&op=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA&form_build_id=form-zg3bEJEJVstzQVEyC7eBCo0dQw8_q0O6d6UGVJqJFnM&form_id=atd_taxi_form
    // http://www.atd.lv/ru/taxi/TV-03160
    const linkLat = `http://www.atd.lv/ru/taxi/${license}`;
    // linkLat = `http://www.atd.lv/ru/taxi?fname=&lname=&regnr=${license}`

    window.open(
      linkLat,
      '_blank',
      'toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=300,width=800,height=1000'
    );
  } else {
    const number = document.querySelector('#dkvu-license-number').value;
    const date = document
      .querySelector('#dkvu-license-issue-date')
      .value.split('-')
      .reverse()
      .join('.');
    const link = `https://гибдд.рф/check/driver#${number}+${date}`;

    window.open(
      link,
      '_blank',
      'toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=300,width=300,height=1000'
    );
  }
}

function checkLicenseDkk() {
  const src = document.getElementById('info').textContent;
  if (
    src.includes('Рига') ||
    src.includes('Даугавпилс') ||
    src.includes('Лиепая') ||
    src.includes('Валмиера') ||
    src.includes('Вентспился') ||
    src.includes('Елгава')
  ) {
    const patternLat = /\([\s\S]*\)/;
    const numberLat = src.match(patternLat).join().toUpperCase();
    if (numberLat.includes('TX') || numberLat.includes('TQ') || numberLat.includes('EX')) {
      alert(`Проверке подлежат госномера на белом фоне(кроме TX*, TQ*, EX*)`);
    } else {
      const number = numberLat.slice(numberLat.indexOf('(') + 1, numberLat.indexOf(')'));
      const linkLat = `http://www.atd.lv/ru/licences?fname=&lname=&doknr=${number}`;
      // http://www.atd.lv/ru/licences
      // edit-doknr
      // http://www.atd.lv/ru/licences?fname=&lname=&doknr=${number}
      window.open(
        linkLat,
        '_blank',
        'toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=300,width=1000,height=800'
      );
      console.log(number);
    }
  } else {
    alert(`Только для Латвии`);
  }
}

url.includes('qc?exam=dkvu')
  ? (button.onclick = checkLicenseDkvu)
  : (button.onclick = checkLicenseDkk);


/***/ }),

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

;// CONCATENATED MODULE: ./src/Templates/TranslateTemplates/TranslateTemplates.service.ts
class TranslateTemplatesService {
    constructor(_templates) {
        this._templates = _templates;
        this.formatTemplates = (templates) => {
            return Object.values(templates)
                .reduce((prev, next) => {
                if (!Array.isArray(next)) {
                    return [...prev, ...this.formatTemplates(next)];
                }
                prev.push(next);
                return prev;
            }, [])
                .flat()
                .filter((el) => el.type !== 'label' && el.type !== 'only');
        };
        this.formatDictionary = (dictionaries) => {
            return dictionaries.map((dict) => this.formatTemplates(dict)).flat();
        };
    }
    translate(resolutionsTaximetr) {
        const dictionary = this.formatDictionary(this._templates);
        return resolutionsTaximetr
            .map((resolution) => {
            return dictionary
                .filter((el) => {
                return (Object.keys(el)
                    .filter((i) => i !== 'text' && i !== 'type')
                    .some((key) => el[key] === resolution && key !== 'rus') && el);
            })
                .map((el) => 'text' in el && el.text);
        })
            .flat();
    }
}

;// CONCATENATED MODULE: ./src/Templates/TranslateTemplates/TranslateTemplates.controller.ts

class TranslateTemplatesController {
    constructor(_service) {
        this._service = _service;
        this.htmlElements = {
            resolutions: [],
            icons: []
        };
        this.ColorTreeResolution = () => {
            [...this.htmlElements.icons].forEach((icon) => {
                const parentElementIcon = icon.closest('.padding-s');
                switch (icon.className) {
                    case 'status-icon status-icon-cancel': {
                        parentElementIcon.style.backgroundColor = '#d9534f';
                        break;
                    }
                    case 'status-icon status-icon-fake': {
                        parentElementIcon.style.backgroundColor = '#f0ad4e';
                        break;
                    }
                    default: {
                        parentElementIcon.style.backgroundColor = '#5cb85c';
                        break;
                    }
                }
            });
        };
        this.translateResolution = () => {
            [...this.htmlElements.resolutions]
                .map((resolution) => {
                const result = resolution.textContent.split('\n').map((item) => item.replace(/,$/, ''));
                if (resolution.className) {
                    resolution.setAttribute('style', 'color: black;');
                }
                return {
                    node: resolution,
                    resultTranslate: this._service.translate(result)
                };
            })
                .forEach((el) => {
                el.resultTranslate
                    .map((r) => {
                    const fragment = document.createDocumentFragment();
                    const br = document.createElement('br');
                    const b = document.createElement('b');
                    const span = document.createElement('span');
                    span.setAttribute('style', `background-color: black; color: white;`);
                    b.textContent = `перевод: ${r}`;
                    span.append(b);
                    fragment.append(br);
                    fragment.append(span);
                    return fragment;
                })
                    .forEach((r) => {
                    el.node.setAttribute('style', 'color: rgb(162, 162, 162);');
                    el.node.append(r);
                });
            });
        };
    }
    init(html) {
        this.htmlElements = html;
        this.ColorTreeResolution();
        this.translateResolution();
    }
}
const setConfig = (config) => {
    return new TranslateTemplatesController(new TranslateTemplatesService(config));
};

;// CONCATENATED MODULE: ./src/Templates/TranslateTemplates/TranslateTemplates.ts

const TranslateTemplates = (config) => {
    let html = {
        resolutions: [],
        icons: []
    };
    const translateTemplates = setConfig(config);
    const start = () => {
        setTimeout(() => {
            html = {
                resolutions: document
                    .querySelector('#table-mkk-driver')
                    .querySelector('tbody')
                    ?.querySelectorAll('.gray.clearfix') || [],
                icons: document
                    .querySelector('#table-mkk-driver')
                    .querySelector('tbody')
                    ?.querySelectorAll('.status-icon') || []
            };
            translateTemplates.init(html);
        }, 500);
    };
    $(document).bind('item_info', start);
    document
        .querySelectorAll('#items-tabs>li>a')
        .forEach((li) => li.addEventListener('click', start));
};

;// CONCATENATED MODULE: ./src/Configs/sts/ColorTree.config.ts
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

;// CONCATENATED MODULE: ./src/Configs/sts/Templates.config.ts

const templates = {
    block: {
        default: [],
        rus: [
            { type: 'item', rus: 'нет фото автомобиля и СТС', text: 'нет фото автомобиля и СТС' },
            { type: 'label', label: 'Фото автомобиля', th: true },
            { type: 'item', rus: 'нет фото автомобиля', text: 'нет фото АВТОМОБИЛЯ' },
            {
                type: 'item',
                rus: 'нет фотографии передней части ТС',
                text: 'нет фотографии ПЕРЕДНЕЙ части ТС'
            },
            {
                type: 'item',
                rus: 'автомобиль не полностью попал в кадр',
                text: 'автомобиль не полностью попал в кадр'
            },
            { type: 'item', rus: 'изображение нечёткое', text: 'изображение нечёткое' },
            {
                type: 'item',
                rus: 'госномер плохо видно, или он не попал в кадр',
                text: 'госномер плохо видно, или он не попал в кадр'
            },
            {
                type: 'item',
                rus: 'нечёткое изображение автомобиля',
                text: 'нечёткое изображение автомобиля'
            },
            { type: 'item', rus: 'часть госномера скрыта', text: 'часть госномера скрыта' },
            { type: 'item', rus: 'на автомобиле нет госномера', text: 'на автомобиле нет госномера' },
            { type: 'label', label: 'Фото СТС', th: true },
            { type: 'item', rus: 'нет фото СТС', text: 'нет фото СТС' },
            {
                type: 'item',
                rus: 'нет фотографии одной из сторон СТС',
                text: 'нет фотографии одной из сторон СТС'
            },
            {
                type: 'item',
                rus: 'СТС не полностью попало в кадр',
                text: 'СТС не полностью попало в кадр'
            },
            {
                type: 'item',
                rus: 'изображение СТС нечёткое или сделано издалека',
                text: 'изображение СТС нечёткое или сделано издалека'
            },
            { type: 'label', label: 'Подозрение на фрод', th: true },
            {
                type: 'item',
                rus: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
                text: 'автомобиль на фото не соответствует тому, что указан в профиле'
            },
            {
                type: 'item',
                rus: 'марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк',
                text: 'марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк'
            },
            {
                type: 'item',
                rus: 'СТС принадлежит другому автомобилю',
                text: 'СТС принадлежит другому автомобилю'
            },
            {
                type: 'item',
                rus: 'мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства',
                text: 'мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства'
            },
            {
                type: 'item',
                rus: 'вы сфотографировали изображение СТС на экране компьютера. Для проверки сделайте фото самого документа',
                text: 'Фото с экрана СТС'
            },
            {
                type: 'item',
                rus: 'вы сфотографировали изображение СТС на экране компьютера. Для проверки сделайте фото самого документа',
                text: 'Ксерокопия СТС'
            },
            {
                type: 'item',
                rus: 'вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение',
                text: 'Фото с экрана ТС'
            },
            { type: 'label', label: 'Специальные', th: true },
            {
                type: 'item',
                rus: 'необходимо заполнить данные свидетельства о регистрации транспортного средства. Пожалуйста, обратитесь в ваш Таксопарк',
                text: 'Недоступно заполнение данных [СОГЛАСОВАТЬ С ТЛ]'
            },
            {
                type: 'item',
                rus: 'цвет автомобиля в СТС и настоящий цвет машины различаются. Исправьте, как указано в СТС',
                text: 'Цвет автомобиля в СТС и настоящий цвет машины различаются. Исправьте, как указано в СТС [СПЕЦПРОЕКТ]'
            }
        ],
        rou: [
            { type: 'label', label: 'Тех.паспорт', th: true },
            {
                type: 'item',
                rou: 'datele din cartea de identitate a vehiculului nu coincid cu datele din fișa șoferului',
                text: 'данные в техпаспорте не совпадают с данными в карточке водителя'
            },
            {
                type: 'item',
                rou: 'cartea de identitate a vehiculului lipsește din cadrul fotografiei',
                text: 'техпаспорт просрочен'
            },
            {
                type: 'item',
                rou: 'cartea de identitate vehiculului  de înmatriculare lipsește din cadrul fotografiei',
                text: 'в кадре нет фотографии вашего техпаспорта'
            },
            {
                type: 'item',
                rou: 'fotografia cărții de identitate a vehiculului este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit',
                text: 'фотография техпаспорта нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                rou: 'cartea de identitate a vehiculului nu a intrat complet în cadru sau fotografia ei a fost tăiată',
                text: 'техпаспорт не полностью попал в кадр или его фотография обрезана'
            },
            {
                type: 'item',
                rou: 'pe fotografie este o copie scanată sau xeroxată a cărții de identitate a vehiculului. Pentru verificare este necesară fotografia documentului original',
                text: 'на фотографии скан или копия техпаспорта. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'există suspiciuni cu privire la autenticitatea cărții de identitate a vehiculului',
                text: 'есть сомнения в подлинности техпаспорта'
            },
            { type: 'label', label: 'Страховка', th: true },
            {
                type: 'item',
                rou: 'datele din polița de asigurare nu coincid cu datele din fișa șoferului',
                text: 'данные страховки не совпадают с данными в карточке водителя'
            },
            { type: 'item', rou: 'Polița de asigurare este expirată', text: 'страховка просрочена' },
            {
                type: 'item',
                rou: 'polița de asigurare lipsește din cadrul fotografiei',
                text: 'в кадре нет фотографии вашей страховки'
            },
            {
                type: 'item',
                rou: 'fotografia poliței de asigurare este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit',
                text: 'фотография страховки нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                rou: 'polița de asigurare nu a intrat complet în cadru sau fotografia ei a fost tăiată',
                text: 'страховка не полностью попала в кадр или ее фотография обрезана'
            },
            {
                type: 'item',
                rou: 'pe fotografie este o copie scanată sau xeroxată a poliței de asigurare. Pentru verificare este necesară fotografia documentului original',
                text: 'на фотографии скан или копия страховки. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'există suspiciuni cu privire la autenticitatea poliței de asigurare',
                text: 'есть сомнения в подлинности страховки'
            },
            { type: 'label', label: 'Страховка грузов\\пассажиров', th: true },
            {
                type: 'item',
                rou: 'datele din polița de asigurare  pentru persoane și bagaje nu coincid cu datele din profilul șoferului',
                text: 'данные страховки для грузов и пассажиров не совпадают с данными в карточке водителя'
            },
            {
                type: 'item',
                rou: 'polița de asigurare pentru persoane și bagaje este expirată',
                text: 'страховка для грузов и пассажиров просрочена'
            },
            {
                type: 'item',
                rou: 'polița de asigurare pentru persoane și bagaje lipsește din cadrul fotografiei',
                text: 'в кадре нет фотографии страховки для грузов и пассажиров'
            },
            {
                type: 'item',
                rou: 'fotografia poliței de asigurare pentru persoane și bagaje este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit',
                text: 'фотография страховки для грузов и пассажиров нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                rou: 'polița de asigurare pentru persoane și bagaje nu a intrat complet în cadru sau fotografia ei a fost tăiată',
                text: 'страховка для грузов и пассажиров не полностью попала в кадр, либо фото обрезалось'
            },
            {
                type: 'item',
                rou: 'pe fotografie este o copie scanată sau xeroxată a poliței de asigurare pentru persoane și bagaje. Pentru verificare este necesară fotografia documentului original',
                text: 'на фотографии скан или копия страховки для грузов и пассажиров. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'există suspiciuni cu privire la autenticitatea poliței de asigurare pentru persoane și bagaje',
                text: 'есть сомнения в подлинности страховки для грузов и пассажиров'
            },
            { type: 'label', label: 'Доверенность', th: true },
            {
                type: 'item',
                rou: 'datele din copia conforma nu coincide cu datele din profilul șoferului',
                text: 'данные доверенности не совпадают с данными в карточке водителя'
            },
            { type: 'item', rou: 'copia conforma este expirată', text: 'доверенность просрочена' },
            {
                type: 'item',
                rou: 'copia conforma lipsește din cadrul fotografiei',
                text: 'в кадре нет фотографии вашей  доверенности '
            },
            {
                type: 'item',
                rou: 'fotografia copiei conforme este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit',
                text: 'фотография доверенности нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                rou: 'copia conforma nu a intrat complet în cadru sau fotografia ei a fost tăiată',
                text: 'доверенность не полностью попала в кадр, или ее фотография обрезана'
            },
            {
                type: 'item',
                rou: 'pe fotografie este o copie scanată sau xeroxată a copiei conforme. Pentru verificare este necesară fotografia documentului original',
                text: 'на фотографии скан или копия доверенности. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'fotografia a fost efectuată unui ecran. Pentru a verifica documentul, efectuați poza documentului original',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'există suspiciuni cu privire la autenticitatea copiei conforme și/sau a ecusonului',
                text: 'есть сомнения в подлинности доверенности'
            },
            { type: 'label', label: 'Бейдж Yango', th: true },
            {
                type: 'item',
                rou: 'datele din copia conformă și/sau ecuson nu coincid cu datele din profilul șoferului',
                text: 'данные бейджа не совпадают с данными в карточке водителя'
            },
            {
                type: 'item',
                rou: 'ecusonul nu indică platforma Yango',
                text: 'на бейдже не указано «Yango»'
            },
            {
                type: 'item',
                rou: 'copia conformă și/sau ecusonul sunt expirate',
                text: 'бейдж просрочен'
            },
            {
                type: 'item',
                rou: 'copia conformă și/sau ecusonul lipsesc din cadrul fotografiei',
                text: 'в кадре нет фотографии вашего бейджа'
            },
            {
                type: 'item',
                rou: 'copia conformă si ecusonul nu pot fi citite corect din cauza reflexiei luminii. Alege un unghi adecvat fotografierii',
                text: 'фотография бейджа нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                rou: 'copia conforma și ecusonul nu au intrat complet în cadru, sau fotografia a fost tăiată',
                text: 'бейдж не полностью попал в кадр, или его фотография обрезана'
            },
            {
                type: 'item',
                rou: 'pe fotografie este o copie scanată sau xeroxată a copiei conforme și/sau a ecusonului. Pentru verificare este necesară fotografia documentului original',
                text: 'на фотографии скан или копия бейджа. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'fotografia a fost efectuată unui ecran. Pentru a verifica documentul, efectuați poza documentului original',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                rou: 'este posibil ca ecusonul să nu fie autentic',
                text: 'есть сомнения в подлинности бейджа'
            }
        ],
        srb: [
            { type: 'label', label: 'Подтверждение о пригодности и классификации автомобиля', th: true },
            {
                type: 'item',
                srb: 'tuđa potvrda, za proveru je potreban vaš dokument',
                text: 'чужая справка, для проверки нужен ваш документ'
            },
            {
                type: 'item',
                srb: 'u kadru ne postiji fotografija vašeg sertifikata',
                text: 'в кадре нет фотографии вашего сертификата'
            },
            {
                type: 'item',
                srb: 'fotografija sertifikata nije čitka. Izaberite dobar ugao i osvetljenje.',
                text: 'фотография сертификата нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                srb: 'fotografija sertifikata nije stala u kadar u potpunosti ili je fotografija isečena',
                text: 'сертификат не полностью попал в кадр, или его фотография обрезана'
            },
            {
                type: 'item',
                srb: 'na fotografiji je skeniran ili kopiran sertifikat. Za proveru je potrebna fotografija originala',
                text: 'на фотографии скан или копия сертификата. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                srb: 'rok važenja potvrde je istekao, za proveru je potreban validan dokument',
                text: 'истёк срок действия справки, для проверки нужен действующий документ'
            },
            {
                type: 'item',
                srb: 'broj tablice/model/marka vozila u dokumentu i na vašem profilu taksi udruženja se ne poklapaju. Taksi udruženje može da ažurira vaš profil',
                text: 'госномер/модель/марка ТС на документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк'
            },
            {
                type: 'item',
                srb: 'fotografija je napravljena s ekrana uređaja. Za proveru je potrebna fotografija originala',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                srb: 'ne postoji nijedna fotografija licence. Za rad u servisu pošaljite fotografiju licence',
                text: 'нет ни одной фотографии лицензии. Для работы в сервисе пришлите фото лицензии'
            },
            {
                type: 'item',
                srb: 'postoje sumnje u autentičnost sertifikata',
                text: 'есть сомнения в подлинности сертификата'
            },
            { type: 'label', label: 'Регистрационная карточка', th: true },
            { type: 'item', srb: 'vaš sertifikat je istekao', text: 'ваш сертификат просрочен' },
            {
                type: 'item',
                srb: 'u kadru nema fotografije vašeg sertifikata',
                text: 'в кадре нет фотографии вашего сертификата'
            },
            {
                type: 'item',
                srb: 'fotografija sertifikata nije čitka. Izaberite dobar ugao i osvetljenje.',
                text: 'фотография сертификата нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                srb: 'sertifikat nije stao u kadar u potpunosti ili je fotografija isečena',
                text: 'сертификат не полностью попал в кадр, или его фотография обрезана'
            },
            {
                type: 'item',
                srb: 'broj tablice vozila u dokumentu i na vašem profilu taksi udruženja se ne poklapaju. Taksi udruženje može da ažurira vaš profil',
                text: 'госномер ТС на документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк'
            },
            {
                type: 'item',
                srb: 'na fotografiji je skeniran ili kopiran sertifikat. Za proveru je potrebna fotografija originala',
                text: 'на фотографии скан или копия сертификата. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                srb: 'fotografija je napravljena s ekrana uređaja. Za proveru je potrebna fotografija originala ',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                srb: 'postoje sumnje u autentičnost sertifikata',
                text: 'есть сомнения в подлинности сертификата'
            }
        ],
        lta: [
            { type: 'label', label: 'Auto tehniskā pase(СТС)', th: true },
            {
                type: 'item',
                lta: 'automašīnas modelis/ražotājs norādīts nepareizi. Atjaunot datus var tikai taksometru parks',
                text: 'марка/модель автомобиля указаны неверно. Обновить данные может таксопарк'
            },
            {
                type: 'item',
                lta: 'Transportlīdzekļa reģistrācijas apliecība izsniegta citai automašīnai',
                text: 'СТС принадлежит другому автомобилю'
            },
            {
                type: 'item',
                lta: 'kadrā nav redzama jūsu transportlīdzekļa reģistrācijas apliecība',
                text: 'в кадре нет фотографии вашего СТС'
            },
            {
                type: 'item',
                lta: 'transportlīdzekļa reģistrācijas apliecības attēls nav skaidrs vai ir uzņemts no liela attāluma',
                text: 'изображение СТС нечёткое или сделано издалека'
            },
            {
                type: 'item',
                lta: 'transportlīdzekļa reģistrācijas apliecība kadrā nav redzama pilnībā',
                text: 'СТС  не полностью попал в кадр или его фотография обрезана'
            },
            {
                type: 'item',
                lta: 'mēs nevaram pārliecināties par to, vai transportlīdzekļa reģistrācijas apliecība ir īsta',
                text: 'мы не можем подтвердить подлинность СТС'
            },
            { type: 'label', label: 'Госномер ТС', th: true },
            {
                type: 'item',
                lta: 'nav automašīnas vai transportlīdzekļa reģistrācijas apliecības fotogrāfijas',
                text: 'нет фото автомобиля и СТС'
            },
            { type: 'item', lta: 'nav automašīnas fotogrāfijas', text: 'нет фото автомобиля' },
            {
                type: 'item',
                lta: 'automašīna kadrā nav redzama pilnībā',
                text: 'автомобиль не полностью попал в кадр'
            },
            { type: 'item', lta: 'attēls nav skaidri saskatāms', text: 'изображение нечёткое' },
            {
                type: 'item',
                lta: 'daļa automašīnas numura zīmes nav redzama',
                text: 'часть госномера скрыта'
            },
            {
                type: 'item',
                lta: 'automašīnas numura zīme ir slikti saskatāma vai nav redzama kadrā',
                text: 'госномер плохо видно, или он не попал в кадр'
            },
            { type: 'item', lta: 'automašīnai nav numura zīmes', text: 'на автомобиле нет госномера' },
            {
                type: 'item',
                lta: 'fotoattēlā redzamā automašīna atšķiras no profilā norādītās. Atjaunot datus var tikai taksometru parks',
                text: 'автомобиль на фото отличается от указанного в профиле. Обновить данные может ваш таксопарк'
            },
            { type: 'label', label: 'Разрешение ATD', th: true },
            { type: 'item', lta: 'atļaujas derīguma termiņš ir beidzies', text: 'разрешение просрочено' },
            {
                type: 'item',
                lta: 'atļaujā norādītie dati nesakrīt ar vadītāja profilā noradīto informāciju',
                text: 'данные в разрешении не совпадают с данными в карточке водителя'
            },
            {
                type: 'item',
                lta: 'Lai strādātu servisā, automašīnai nepieciešama derīga atļauja',
                text: 'Для работы в сервисе необходимо  действующее  разрешение на автомобиль'
            }
        ],
        isr: [
            {
                type: 'item',
                isr: 'אין תמונה של המונית או של רישיון הרכב',
                text: 'нет фото автомобиля и СТС'
            },
            { type: 'label', label: 'Фото автомобиля', th: true },
            { type: 'item', isr: 'אין תמונה של המונית', text: 'нет фото АВТОМОБИЛЯ' },
            {
                type: 'item',
                isr: 'אין תמונה של המונית או של תעודת הביטוח',
                text: 'нет фото автомобиля и страховки'
            },
            {
                type: 'item',
                isr: 'אין תמונה של המונית או של המסמכים',
                text: 'нет фото автомобиля и документов'
            },
            {
                type: 'item',
                isr: 'המונית שבתמונה שונה מהמונית שבפרופיל. נציג מרכז השירות יכול לעדכן את המידע.',
                text: 'автомобиль на фото отличается от указанного в профиле. Обновить данные может ваш таксопарк'
            },
            {
                type: 'item',
                isr: 'אין תמונה של המונית מצד שמאל',
                text: 'нет фото ПРАВОЙ стороны автомобиля'
            },
            {
                type: 'item',
                isr: 'אין תמונה של המונית מצד ימין',
                text: 'нет фото ЛЕВОЙ стороны автомобиля'
            },
            {
                type: 'item',
                isr: 'לא רואים את כל המונית בתמונה',
                text: 'автомобиль не полностью попал в кадр'
            },
            { type: 'item', isr: 'התמונה לא בפוקוס', text: 'изображение нечёткое' },
            {
                type: 'item',
                isr: 'לא רואים טוב את לוחית הרישוי או שהיא לא בתמונה',
                text: 'госномер плохо видно, или он не попал в кадр'
            },
            { type: 'item', isr: 'לוחית הרישוי מוסתרת', text: 'часть госномера скрыта' },
            { type: 'item', isr: 'למונית אין לוחית רישוי', text: 'на автомобиле нет госномера' },
            { type: 'label', label: 'Фото СТС', th: true },
            { type: 'item', isr: 'אין תמונה של רישיון הרכב עם הבעלות', text: 'нет фото СТС' },
            {
                type: 'item',
                isr: 'לא רואים את כל רישיון הרכב או שהתמונה חתוכה',
                text: 'СТС не полностью попало в кадр'
            },
            {
                type: 'item',
                isr: 'התמונה של רישיון הרכב לא בפוקוס או צולמה יותר מדי מרחוק',
                text: 'изображение СТС нечёткое или сделано издалека'
            },
            { type: 'label', label: 'Подозрение на фрод', th: true },
            {
                type: 'item',
                isr: 'היצרן/הדגם של המונית שגוי. ניתן לעדכן את הפרטים במרכז הנהגים.',
                text: 'марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк'
            },
            {
                type: 'item',
                isr: 'ברישיון הרכב רשומה בעלות אחרת על המונית',
                text: 'ПТС принадлежит другому автомобилю'
            },
            {
                type: 'item',
                isr: 'לא הצלחנו לבדוק אם רישיון הרכב מזויף או לא',
                text: 'мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства'
            },
            {
                type: 'item',
                isr: 'השם ברישיון הרכב שונה מהשם שברישיון הנהיגה',
                text: 'имя водителя, указанное в ПТС не совпадает с именем, указанным в в/у'
            },
            {
                type: 'item',
                isr: 'השם ברישיון הרכב שונה מהשם שבתעודת הביטוח',
                text: 'имя водителя, указанное в ПТС не совпадает с именем, указанным в страховке'
            },
            { type: 'label', label: 'Лицензия', th: true },
            {
                type: 'item',
                isr: 'מספר הרישיון ברישיון הרכב שונה מהמספר שעל הדלתות האחוריות של המונית',
                text: 'номер лицензии в ПТС отличается от номера на задних дверях ТС'
            },
            { type: 'item', isr: 'פג התוקף של הרישיון', text: 'лицензия недействительна' },
            { type: 'item', isr: 'לא רואים רישיון הסעה בתמונה', text: 'на фото нет лицензии' }
        ],
        fin: [
            { type: 'label', label: 'Автомобиль', th: true },
            { type: 'item', fin: 'merkittävä ulkoinen vaurio', text: 'сильные повреждения на кузове' },
            {
                type: 'item',
                fin: 'ei kuvaa ajoneuvosi ___ puolesta (oikeasta/vasemmasta)',
                text: 'нет фото ___ стороны автомобиля (правая/левая)'
            },
            { type: 'item', fin: 'ei valokuvaa ajoneuvosta', text: 'нет фото автомобиля' },
            {
                type: 'item',
                fin: 'valokuvassa oleva ajoneuvo ei vastaa profiiliisi merkittyä ajoneuvoa. Voit päivittää profiilisi täällä',
                text: 'автомобиль на фото отличается от указанного в профиле. Обновить данные вы сможет по адресу:'
            },
            {
                type: 'item',
                fin: 'ajoneuvon rekisterikilpi ei ole näkyvissä',
                text: 'на автомобиле нет госномера'
            },
            {
                type: 'item',
                fin: 'ajoneuvon rekisterikilpi on osittain peitetty',
                text: 'часть госномера скрыта'
            },
            { type: 'item', fin: 'epätarkka valokuva', text: 'изображение нечёткое' },
            {
                type: 'item',
                fin: 'ajoneuvon rekisterikilpi ei näy kunnolla tai on rajattu kuvan ulkopuolelle',
                text: 'госномер плохо видно, или он не попал в кадр'
            },
            { type: 'label', label: 'Car registration | Регистрация а/м', th: true },
            { type: 'item', fin: 'Rekisteriote ei näy kuvassa', text: 'Нет фото Car registration' },
            {
                type: 'item',
                fin: 'ajoneuvon merkki/malli ilmoitettu virheellisesti. Voit päivittää profiilisi täällä',
                text: 'марка/модель автомобиля указаны неверно. Обновить данные вы сможет по адресу:'
            },
            { type: 'item', fin: 'Taksivakuutus puuttuu', text: 'Отсутствует страховка такси' },
            {
                type: 'item',
                fin: 'Rekisteriote kuuluu toiselle ajoneuvolle',
                text: 'Регистрация принадлежит другому автомобилю'
            },
            {
                type: 'item',
                fin: 'rekisteriotekuva on epätarkka tai otettu liian kaukaa',
                text: 'изображение регистрации нечёткое или сделано издалека'
            },
            {
                type: 'item',
                fin: 'Rekisteriote ei näy kuvassa kokonaan tai kuva on rajattu',
                text: 'Регистрация не полностью попала в кадр или  фотография обрезана'
            },
            {
                type: 'item',
                fin: 'ajoneuvon rekisteriotteen aitoutta ei voitu vahvistaa',
                text: 'мы не можем подтвердить подлинность регистрации авто'
            },
            { type: 'label', label: 'Taxi permit | Разрешение на такси', th: true },
            { type: 'item', fin: 'Taksiliikennelupa ei näy kuvassa', text: 'Нет фото Taxi permit' },
            {
                type: 'item',
                fin: 'lupakuva on epätarkka tai otettu liian kaukaa',
                text: 'изображение разрешения нечёткое или сделано издалека'
            },
            {
                type: 'item',
                fin: 'Taksiliikennelupa ei näy kuvassa kokonaan tai kuva on rajattu',
                text: 'Разрешение на такси  не полностью попало в кадр или  фотография обрезана'
            },
            {
                type: 'item',
                fin: 'taksiliikenneluvat aitoutta ei voitu vahvistaa',
                text: 'мы не можем подтвердить подлинность разрешения на такси'
            },
            {
                type: 'item',
                fin: 'Taksiliikennelupa on vanhentunut',
                text: 'Разрешение на такси просрочено'
            }
        ],
        kz: [
            { type: 'label', label: 'Автомобиль', th: true },
            {
                type: 'item',
                kz: 'нет фото автомобиля и техпаспорта',
                text: 'Нет ни одной фотографии ТС и техпаспорта'
            },
            { type: 'item', kz: 'нет фото автомобиля', text: 'Нет ни одной фотографии ТС' },
            { type: 'label', label: 'Госномер', th: true },
            {
                type: 'item',
                kz: 'автомобиль не полностью попал в кадр',
                text: 'Госномер не полностью в кадре'
            },
            { type: 'item', kz: 'изображение нечёткое', text: 'Нечеткий госномер' },
            {
                type: 'item',
                kz: 'часть госномера скрыта',
                text: 'Госномер просматривается неполностью (залпелен грязью или снегом)'
            },
            {
                type: 'item',
                kz: 'госномер плохо видно, или он не попал в кадр',
                text: 'Госномер сфотографирован слишком далеко'
            },
            {
                type: 'item',
                kz: 'на автомобиле нет госномера',
                text: 'На автомобиле отсутствует госномер'
            },
            { type: 'label', label: 'Стс', th: true },
            { type: 'item', kz: 'нет фото техпаспорта', text: 'Нет фото техпаспорта' },
            {
                type: 'item',
                kz: 'нет фотографии одной из сторон техпаспорта',
                text: 'Нет фото лицевой или оборотной стороны техпаспорта'
            },
            {
                type: 'item',
                kz: 'техпаспорт не полностью попал в кадр',
                text: 'техпаспорт не полностью попало в кадр'
            },
            {
                type: 'item',
                kz: 'изображение техпаспорта нечёткое или сделано издалека',
                text: 'Нечеткое изображение техпаспорта'
            },
            {
                type: 'item',
                kz: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
                text: 'На фото стороннее ТС'
            },
            {
                type: 'item',
                kz: 'марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк',
                text: 'Указаны другие марка и/или модель'
            },
            {
                type: 'item',
                kz: 'техпаспорт принадлежит другому автомобилю',
                text: 'техпаспорт от стороннего ТС'
            },
            { type: 'label', label: 'Подлинность', th: true },
            {
                type: 'item',
                kz: 'мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства',
                text: 'Поддельный техпаспорт'
            },
            {
                type: 'item',
                kz: 'мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства',
                text: 'Эмуляция'
            },
            {
                type: 'item',
                kz: 'вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа',
                text: 'Фото с экрана СТС'
            },
            {
                type: 'item',
                kz: 'вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение',
                text: 'Фото с экрана ТС'
            },
            {
                type: 'item',
                kz: 'вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа',
                text: 'Ксерокопия СТС'
            },
            {
                type: 'item',
                kz: 'несоответствие госномера требованиям сервиса',
                text: 'Любой техпаспорт, кроме Казахского (для города Шымкент)'
            }
        ],
        kgz: [
            { type: 'label', label: 'Автомобиль', th: true },
            {
                type: 'item',
                kgz: 'нет фото автомобиля и техпаспорта',
                text: 'Нет ни одной фотографии ТС и техпаспорта'
            },
            { type: 'item', kgz: 'нет фото автомобиля', text: 'Нет ни одной фотографии ТС' },
            { type: 'label', label: 'Госномер', th: true },
            {
                type: 'item',
                kgz: 'автомобиль не полностью попал в кадр',
                text: 'Госномер не полностью в кадре'
            },
            { type: 'item', kgz: 'изображение нечёткое', text: 'Нечеткий госномер' },
            {
                type: 'item',
                kgz: 'часть госномера скрыта',
                text: 'Госномер просматривается неполностью (залпелен грязью или снегом)'
            },
            {
                type: 'item',
                kgz: 'госномер плохо видно, или он не попал в кадр',
                text: 'Госномер сфотографирован слишком далеко'
            },
            {
                type: 'item',
                kgz: 'на автомобиле нет госномера',
                text: 'На автомобиле отсутствует госномер'
            },
            { type: 'label', label: 'Стс', th: true },
            { type: 'item', kgz: 'нет фото техпаспорта', text: 'Нет фото техпаспорта' },
            {
                type: 'item',
                kgz: 'нет фотографии одной из сторон техпаспорта',
                text: 'Нет фото лицевой или оборотной стороны техпаспорта'
            },
            {
                type: 'item',
                kgz: 'техпаспорт не полностью попал в кадр',
                text: 'техпаспорт не полностью попало в кадр'
            },
            {
                type: 'item',
                kgz: 'изображение техпаспорта нечёткое или сделано издалека',
                text: 'Нечеткое изображение техпаспорта'
            },
            {
                type: 'item',
                kgz: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
                text: 'На фото стороннее ТС'
            },
            {
                type: 'item',
                kgz: 'марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк',
                text: 'Указаны другие марка и/или модель'
            },
            {
                type: 'item',
                kgz: 'техпаспорт принадлежит другому автомобилю',
                text: 'техпаспорт от стороннего ТС'
            },
            { type: 'label', label: 'Подлинность', th: true },
            {
                type: 'item',
                kgz: 'мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства',
                text: 'Поддельный техпаспорт'
            },
            {
                type: 'item',
                kgz: 'мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства',
                text: 'Эмуляция'
            },
            {
                type: 'item',
                kgz: 'вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа',
                text: 'Фото с экрана СТС'
            },
            {
                type: 'item',
                kgz: 'вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение',
                text: 'Фото с экрана ТС'
            },
            {
                type: 'item',
                kgz: 'вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа',
                text: 'Ксерокопия СТС'
            }
        ],
        mda: [
            { type: 'label', label: 'Автомобиль', th: true },
            { type: 'item', mda: 'fotografia automobilului lipsește', text: 'нет фото ТС' },
            {
                type: 'item',
                mda: 'automobilul din fotografie nu coincide cu cel menționat în profil. Datele de profil pot fi actualizate de compania ta de taximetrie',
                text: 'На фото стороннее ТС'
            },
            {
                type: 'item',
                mda: 'automobilul nu are număr de înmatriculare',
                text: 'На автомобиле отсутствует госномер'
            },
            {
                type: 'item',
                mda: 'o parte din numărul de înmatriculare nu este vizibilă',
                text: 'Госномер просматривается неполностью'
            },
            {
                type: 'item',
                mda: 'numărul de înmatriculare nu se vede bine sau nu a intrat complet în cadru',
                text: 'Госномер нечеткий или сфотографирован слишком далеко'
            },
            {
                type: 'item',
                mda: 'ai fotografiat imaginea automobilului pe ecranul computerului. Aceasta este o încălcare gravă',
                text: 'Фото с экрана/с фото'
            },
            { type: 'label', label: 'Техпаспорт', th: true },
            {
                type: 'item',
                mda: 'fotografia certificatului de înmatriculare lipsește',
                text: 'Нет фото техпаспорта'
            },
            {
                type: 'item',
                mda: 'certificatul de înmatriculare este al altui automobil',
                text: 'Техпаспорт от стороннего ТС'
            },
            {
                type: 'item',
                mda: 'marca sau modelul sunt indicate greșit. Datele tale de profil pot fi actualizate de compania de taximetrie',
                text: 'Указаны другие марка и/или модель'
            },
            {
                type: 'item',
                mda: 'lipsește fotografia unei părți a certificatului de înmatriculare',
                text: 'Нет фото лицевой или оборотной стороны техпаспорта'
            },
            {
                type: 'item',
                mda: 'certificatul de înmatriculare nu a intrat complet în cadru',
                text: 'техпаспорт не полностью попало в кадр'
            },
            {
                type: 'item',
                mda: 'fotografia certificatului de înmatriculare este neclară sau a fost făcută de la o distanță prea mare',
                text: 'Нечеткое изображение техпаспорта'
            },
            {
                type: 'item',
                mda: 'nu putem confirma autenticitatea certificatului de înmatriculare',
                text: 'Поддельный техпаспорт'
            },
            {
                type: 'item',
                mda: 'ai fotografiat imaginea certificatului de înmatriculare pe ecranul computerului. Pentru verificare fotografiază documentul propriu-zis',
                text: 'Фото техпаспорта с экрана/с фото/ксерокопия'
            },
            {
                type: 'item',
                mda: 'Automobilul tău nu a fost găsit în baza de date',
                text: 'Автомобиля нет в базе ANTA'
            },
            { type: 'label', label: 'Extras din "Registrul operatorilor de transport rutier"', th: true },
            {
                type: 'item',
                mda: 'Este necesar să transmiteți o poza a Extrasului din "Registrul operatorilor de transport rutier"',
                text: 'База не работает'
            },
            {
                type: 'item',
                mda: 'Lipseste fotografia a extrasului din "Registrul operatorilor de transport rutier"',
                text: 'Нет фото документа'
            },
            {
                type: 'item',
                mda: 'Extras din "Registrul operatorilor de transport rutier" apartine altui automobil',
                text: 'Документ от другого ТС'
            },
            { type: 'item', mda: 'Pe documentul dat lipsește ștampila', text: 'На документе нет печати' },
            {
                type: 'item',
                mda: 'In documentul dat nu este indicat "Transport rutier contra cost"',
                text: 'Не указано Transport rutier contra cost'
            }
        ],
        zam: [
            { type: 'label', label: 'Автомобиль', th: true },
            { type: 'item', zam: 'no photo of the vehicle', text: 'нет фото автомобиля' },
            {
                type: 'item',
                zam: 'vehicle in the photo different from the vehicle in your profile. You can update your profile at',
                text: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк'
            },
            {
                type: 'item',
                zam: 'no license plate number on the vehicle',
                text: 'на автомобиле нет госномера'
            },
            {
                type: 'item',
                zam: 'license plate number partially covered',
                text: 'часть госномера скрыта'
            },
            {
                type: 'item',
                zam: 'license plate number poorly visible or not in frame',
                text: 'госномер плохо видно, или он не попал в кадр'
            },
            {
                type: 'item',
                zam: 'you took a picture of the vehicle displayed on a computer screen. This is a serious violation',
                text: 'вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение'
            },
            { type: 'label', label: 'Страховка', th: true },
            { type: 'item', zam: 'your insurance is expired', text: 'ваша страховка просрочена' },
            {
                type: 'item',
                zam: "your insurance isn't visible in the photo",
                text: 'в кадре нет фотографии вашей страховки'
            },
            {
                type: 'item',
                zam: 'blurry picture of insurance. Please take the picture with a clear angle in a well-lit area',
                text: 'фотография страховки нечёткая. Выберите хороший ракурс и освещение'
            },
            {
                type: 'item',
                zam: 'insurance not fully in frame, or the photo is cropped',
                text: 'страховка не полностью попала в кадр, или ее фотография обрезана'
            },
            {
                type: 'item',
                zam: 'the license plate of the vehicle on your insurance and in your taxi company profile are different. Only your taxi company can update your profile',
                text: 'госномер ТС на страховке и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк'
            },
            {
                type: 'item',
                zam: '"the photo is of a scan or copy of your insurance A photo of the original document is required for verification',
                text: 'на фотографии скан или копия страховки. Для проверки нужно фото оригинала'
            },
            {
                type: 'item',
                zam: '"the photo is of a screen. A photo of the original insurance document is required for verification',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала страховки'
            },
            {
                type: 'item',
                zam: 'questionable authenticity of insurance',
                text: 'есть сомнения в подлинности страховки'
            }
        ]
    },
    blacklist: {
        default: []
    },
    injection: {
        block: {},
        blacklist: {}
    }
};
const countries = {
    rus: 'РФ',
    rou: 'Румыния',
    srb: 'Сербия',
    lta: 'Латвия',
    isr: 'Израиль',
    fin: 'Финляндия',
    kz: 'Казахстан',
    kgz: 'Киргизия',
    mda: 'Молдавия',
    zam: 'Замбия'
};
const citiesSts = {
    ...cities,
    mda: ['Кишинёв'],
    rou: ['Бухарест']
};
const config = {
    templates,
    countries,
    cities: citiesSts
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

;// CONCATENATED MODULE: ./src/Templates/ModelTemplates/Service/Templates.service.ts
class TemplateService {
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
            if (title === 'kz') {
                return 'rus';
            }
            return title;
        }
        return 'rus';
    }
    switchTemplateFromCountry(type, country) {
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
    filterAndFillTemplateInHTML(type, country, isRusOnly) {
        const res = this.switchTemplateFromCountry(type, country);
        const stringTemplates = res
            .filter((t) => {
            if (!isRusOnly && t.type === 'only') {
                return !t.only;
            }
            return t;
        })
            .map((t) => {
            switch (t.type) {
                case 'item': {
                    const newTemplate = { type: 'item', text: t.text, [country]: t[country] };
                    return newTemplate;
                }
                default:
                    return t;
            }
        })
            .filter((t) => (t.type === 'item' ? t[country] !== '' : t))
            .map((t) => {
            switch (t.type) {
                case 'only':
                    return this.createListItem(t.only, t.only, ['template-item'], t.only);
                case 'label':
                    return this.createListItem(null, null, ['template-head'], t.label);
                default: {
                    const [text, translate] = Object.keys(t).filter((i) => i !== 'type');
                    return this.createListItem(t[translate], t[text], ['template-item'], t[text]);
                }
            }
        })
            .join('');
        return `<ul class="list-group">${stringTemplates}</ul>`;
    }
}

;// CONCATENATED MODULE: ./src/Templates/ModelTemplates/stsController/Templates.controller.ts


class Templates {
    constructor(IC) {
        this.createdHtmlElements = {
            style: document.createElement('style'),
            areaInModalDialog: document.createElement('div'),
            selectCountryTranslate: document.createElement('select')
        };
        this.htmlElements = {
            modal: null,
            commentList: null,
            head: null,
            messageBox: null,
            modalFooter: null
        };
        this._template = '';
        this._config = IC;
    }
    init(htmlElements) {
        this.htmlElements = htmlElements;
        this.htmlElements.modal.style.width = '800px';
        this.htmlElements.commentList.style.height = '370px';
        this.createdHtmlElements.areaInModalDialog.setAttribute('style', `position: absolute; bottom: 20px; left: 15px`);
        this.createdHtmlElements.selectCountryTranslate.innerHTML = this._config.fillCountriesInHTML();
        this.createdHtmlElements.selectCountryTranslate.style.float = 'right';
        this.createdHtmlElements.style.innerHTML =
            '.template-item{border-bottom: 1px solid #cacaca; padding: 4px 8px;}.template-head{background-color:#d8e6ea;font-weight:bold;padding:2px 10px}.template-item:hover{background-color: #f3f3f3; cursor: pointer}';
        this.htmlElements.head.append(this.createdHtmlElements.style);
        this.htmlElements.modalFooter.before(this.createdHtmlElements.areaInModalDialog);
        this.createdHtmlElements.areaInModalDialog.append(this.createdHtmlElements.selectCountryTranslate);
        this.createdHtmlElements.selectCountryTranslate.addEventListener('change', () => {
            this.fillTemplates();
        });
        this.htmlElements.commentList.addEventListener('click', (e) => this.addCommentFromTemplate(e));
    }
    fillTemplates() {
        this.htmlElements.commentList.innerHTML = this._config.filterAndFillTemplateInHTML(this._template, this.createdHtmlElements.selectCountryTranslate.value, this.createdHtmlElements.selectCountryTranslate.value === 'rus');
    }
    freeze() {
        this.createdHtmlElements.selectCountryTranslate.disabled = true;
    }
    reset() {
        this.createdHtmlElements.selectCountryTranslate.disabled = false;
        this.htmlElements.commentList.innerHTML = '';
    }
    setCityInSelectAndFillTemplates(btn, city) {
        const country = this._config.checkCity(city);
        this._template = btn;
        this.reset();
        this.createdHtmlElements.selectCountryTranslate.value = country;
        this.htmlElements.commentList.innerHTML = this._config.filterAndFillTemplateInHTML(this._template, this.createdHtmlElements.selectCountryTranslate.value, country === 'rus');
    }
    addCommentFromTemplate(event) {
        const target = event.target;
        const { messageBox } = this.htmlElements;
        event.preventDefault();
        if (target.classList.contains('template-head')) {
            return;
        }
        this.freeze();
        if (messageBox.value) {
            messageBox.value = `${messageBox.value},\n${target.getAttribute('itemvalue')}`;
            return;
        }
        messageBox.value = target.getAttribute('itemvalue');
    }
}
const Templates_controller_templates = new Templates(new TemplateService(config));

;// CONCATENATED MODULE: ./src/Templates/ModelTemplates/stsController/TemplatesSts.ts

let city;
$(document).bind('item_info', function (e, params) {
    city = params.city;
});
const htmlElements = {
    modal: document.querySelector('.modal-dialog'),
    commentList: document.querySelector('#comment-list'),
    head: document.querySelector('head'),
    messageBox: document.querySelector('#msg'),
    modalFooter: document.querySelector('.modal-footer')
};
Templates_controller_templates.init(htmlElements);
document.getElementById('btn-block').addEventListener('click', () => {
    htmlElements.commentList.style.display = 'block';
    Templates_controller_templates.setCityInSelectAndFillTemplates(document.getElementById('btn-block').id.split('-')[1], city);
});

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

const Sla_htmlElements = {
    table: null,
    firstCase: null,
    tree: document.querySelector('.vspan0'),
    order: document.querySelector('#pool-order'),
    category: document.querySelector('#category')
};
Sla.init(Sla_htmlElements);

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
const html = {
    content: document.querySelector('#content'),
    photos: document.querySelector('#photos'),
    btns: document.querySelectorAll('.pull-right>button')
};
const checkThumbNumber = document.querySelector('.check-thumb-number');
const marksParent = document.querySelector('#mkk-invite').parentElement;
const btnsParent = document.querySelector('#btn-ok').parentElement;
const mkkInvite = document.querySelector('#mkk-invite');
html.photos.before(checkThumbNumber);
html.photos.before(marksParent);
checkThumbNumber.style.bottom = '80px';
marksParent.style.top = '40px';
marksParent.style.zIndex = '99999';
btnsParent.style.zIndex = '99999';
mkkInvite.style.maxWidth = '600px';
RotateScaleBright.init(html);
$(document).bind('select_item', function (e, params) {
    RotateScaleBright.resetContent();
});
$(document).bind('content', function (e, params) {
    RotateScaleBright.resetContent();
    if (params.rotate === false) {
        html.btns.forEach((btn) => {
            btn.disabled = false;
        });
    }
});

// EXTERNAL MODULE: ./src/other/FindDataGIBDD/findDataGIBDD.js
var findDataGIBDD = __webpack_require__(541);
// EXTERNAL MODULE: ./src/other/autoSaveSts/autoSaveSts.js
var autoSaveSts = __webpack_require__(523);
// EXTERNAL MODULE: ./src/Marks/CountCase/CountCaseSts.ts
var CountCaseSts = __webpack_require__(598);
;// CONCATENATED MODULE: ./src/Directions/sts/index.ts













startColorTree(colorTreeConfig);
startColorInfo(colorInfoConfig);
TranslateTemplates([config.templates]);

})();

/******/ })()
;