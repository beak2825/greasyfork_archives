// ==UserScript==
// @name         Bundle для истории проверок
// @version      1.1.32
// @description  Общий бандл для истории проверок в очередей ДКВУ/СТС/ДКП
// @author       L
// @include		 https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkvu*
// @include		 https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=sts*
// @include		 https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=identity*
// @grant none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/437909/Bundle%20%D0%B4%D0%BB%D1%8F%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437909/Bundle%20%D0%B4%D0%BB%D1%8F%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

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

;// CONCATENATED MODULE: ./src/Templates/TranslateTemplatesHistory/TranslateTemplatesHistory.ts

const TranslateTemplatesHistory = (config) => {
    let html = {
        resolutions: [],
        icons: []
    };
    const translateTemplatesHistory = setConfig(config);
    $(document).bind('item_info', function (e, params) {
        html = {
            resolutions: document.querySelectorAll('#info>small') || [],
            icons: document.querySelector('#table').querySelectorAll('.status-icon') || []
        };
        translateTemplatesHistory.init(html);
    });
};

;// CONCATENATED MODULE: ./src/Configs/GlobalConstants/constatns.ts
const cities = {
    az: ['Баку'],
    kgz: ['Бишкек', 'Ош', 'Абад', 'Джалал-Абад', 'Каракол'],
    geo: ['Батуми', 'Кутаиси', 'Рустави', 'Тбилиси'],
    cro: ['Загреб', 'Сплит', 'Риека', 'Осиек'],
    uzb: ['Ташкент', 'Наманган', 'Фергана', 'Андижан', 'Самарканд', 'Коканд', 'Бухара'],
    ltu: ['Вильнюс'],
    est: ['Таллин', 'Тарту'],
    mda: ['Кишинёв', 'Бухарест', 'Бельцы', 'Бэлць'],
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
    srb: ['Белград', 'Нови-Сад'],
    lta: ['Рига', 'Даугавпилс', 'Лиепая', 'Валмиера', 'Вентспился', 'Елгава'],
    isr: ['Тель-Авив', 'Яффо', 'Раана', 'Герцлия', 'Нетания', 'Хайфа', 'Ашкелон', 'Ашдод'],
    fin: ['Хельсинки', 'Вантаа', 'Эспоо', 'Турку', 'Тампере'],
    nor: ['Осло'],
    kot: ['Абиджан', 'Сан-Педро', 'Ман', 'Далоа', 'Дакар', 'Буаке', 'Касабланка'],
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
    zam: ['Лусака', 'Ндола', 'Китве-Нкана', 'Китве_Нкана'],
    bol: ['Ла-Пас', 'Эль-Альто', 'Санта-Крус-де-ла-Сьерра'],
    kongo: ['Браззавиль', 'Киншаса', 'Дакар'],
    uae: ['Дубай'],
    ang: ['Луанда']
};

;// CONCATENATED MODULE: ./src/Configs/dkvu/Templates.config.ts

const templates = {
    block: {
        default: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                eng: 'Photos are blurry or taken from far away. Full name and number must be visible and distinct',
                gana: 'Photos are blurry or taken from far away. Full name and number must be visible and distinct',
                kot: 'la photo est floue ou prise de loin. Le nom, le prénom et le patronyme, et le numéro doivent être lisibles',
                kam: 'la photo est floue ou prise de loin. Le nom, le prénom et le patronyme, et le numéro doivent être lisibles',
                zam: 'photo blurry or taken from far away. Full name and number should be legible'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                eng: 'No photos of driver`s license',
                gana: 'No photos of driver`s license',
                kot: 'aucune photographie du permis de conduire',
                kam: 'aucune photographie du permis de conduire',
                zam: "no photo of driver's license"
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                eng: 'The photo does not contain either side of the license. Both sides need to be checked: front and back',
                gana: 'The photo does not contain either side of the license. Both sides need to be checked: front and back',
                kot: 'la photo ne représente aucune des faces du permis de conduire. Pour la vérification, les deux faces sont obligatoires: le recto et le verso',
                kam: 'la photo ne représente aucune des faces du permis de conduire. Pour la vérification, les deux faces sont obligatoires: le recto et le verso',
                zam: 'photo does not show either side of the license. Both sides need to be checked: front and back'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                eng: 'The license must be fully in the shot',
                gana: 'The license must be fully in the shot',
                kot: "le permis de conduire n'était pas complètement dans le cadre",
                kam: "le permis de conduire n'était pas complètement dans le cadre",
                zam: "driver's license not completely captured in frame"
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                eng: 'no photo of yourself with license',
                gana: 'no photo of yourself with license',
                kot: 'aucune photo de vous avec votre permis de conduire',
                kam: 'aucune photo de vous avec votre permis de conduire',
                zam: 'no photo of yourself with license'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                eng: 'your license photo and photo of yourself holding it are blurry',
                gana: 'your license photo and photo of yourself holding it are blurry',
                kot: 'la photo du permis de conduire et votre photo avec celui-ci sont floues',
                kam: 'la photo du permis de conduire et votre photo avec celui-ci sont floues',
                zam: 'your license photo and photo of yourself holding it are blurry'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                eng: 'your selfie with the driver`s license is not fully in the frame. Verification requires your face and the driver`s license to be fully in frame',
                gana: 'your selfie with the driver`s license is not fully in the frame. Verification requires your face and the driver`s license to be fully in frame',
                kot: 'votre photo avec le permis de conduire est rognée. Pour la vérification, le visage et le permis de conduire doivent intégralement se trouver dans le cadre',
                kam: 'votre photo avec le permis de conduire est rognée. Pour la vérification, le visage et le permis de conduire doivent intégralement se trouver dans le cadre',
                zam: 'your photo with your license is cut off. Your must completely capture your face and license in the frame so we can check them'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                eng: 'driver`s license photographed without removing cover (making it difficult to verify)',
                gana: 'driver`s license photographed without removing cover (making it difficult to verify)',
                kot: 'le permis de conduire a été photographié dans la couverture, ce qui rend la vérification difficile',
                kam: 'le permis de conduire a été photographié dans la couverture, ce qui rend la vérification difficile',
                zam: "driver's license photographed without removing cover (making it difficult to verify)."
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                eng: 'no photos of either side of license or photo with it',
                gana: 'no photos of either side of license or photo with it',
                kot: 'aucune face du permis de conduire, ni de votre photo avec celui-ci',
                kam: 'aucune face du permis de conduire, ni de votre photo avec celui-ci',
                zam: 'no photos of either side of license or photo with it'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                eng: 'license photo and your picture with it are cut off. Everything must be completely captured in the frame so we can check them',
                gana: 'license photo and your picture with it are cut off. Everything must be completely captured in the frame so we can check them',
                kot: 'la photo du permis de conduire et votre photo avec celui-ci sont rognées. Pour la vérification, tout le document doit être dans le cadre',
                kam: 'la photo du permis de conduire et votre photo avec celui-ci sont rognées. Pour la vérification, tout le document doit être dans le cadre',
                zam: 'license photo and your picture with it are cut off. Everything must be completely captured in the frame so we can check them'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                eng: 'in addition to your selfie with the driver`s license, the driver`s license must also be photographed separately (front and back sides)',
                gana: 'in addition to your selfie with the driver`s license, the driver`s license must also be photographed separately (front and back sides)',
                kot: 'hormis votre photo de vous-même avec le permis de conduire, vous devez photographier le permis de conduire séparément (recto et verso)',
                kam: 'hormis votre photo de vous-même avec le permis de conduire, vous devez photographier le permis de conduire séparément (recto et verso)',
                zam: 'in addition to your photo with the license, you must photograph the license separately (both sides)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                eng: "information in the photo is illegible. We need a photo of the official printed translation along with your driver's license",
                gana: "information in the photo is illegible. We need a photo of the official printed translation along with your driver's license",
                kot: 'les données de la photo sont illisibles. Pour la vérification, une photo de la photocopie de la traduction officielle est nécessaire avec le permis de conduire',
                kam: 'Une photo de la copie',
                zam: "information in the photo is illegible. We need a photo of the official printed translation along with your driver's license"
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                eng: 'difficult to read info in photo because license is worn out',
                gana: 'difficult to read info in photo because license is worn out',
                kot: 'les données de la photo sont difficilement lisibles, car le permis de conduire est devenu inutilisable',
                kam: 'les données de la photo sont difficilement lisibles, car le permis de conduire est devenu inutilisable',
                zam: 'difficult to read info in photo because license is worn out'
            }
        ],
        rus: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                rus: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                rus: 'нет фотографий водительского удостоверения'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                rus: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                rus: 'водительское удостоверение не полностью попало в кадр'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                rus: 'нет вашей фотографии с водительским удостоверением'
            },
            { type: 'only', only: 'фотографировать себя нужно вместе с удостоверением' },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                rus: 'фотография с водительским удостоверением получилась нечёткой'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                rus: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                rus: 'водительское удостоверение сфотографировано в обложке, его сложно проверить'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                rus: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                rus: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                rus: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                rus: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                rus: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии'
            },
            { type: 'label', label: 'КАЗАХСТАН', th: true },
            {
                type: 'item',
                text: 'на фотоконтроле документов вы прислали обрезанный снимок экрана. Пожалуйста, отправьте полное изображение с интерфейсом приложения. Обратите внимание: текст на фото должен легко читаться',
                rus: 'на фотоконтроле документов вы прислали обрезанный снимок экрана. Пожалуйста, отправьте полное изображение с интерфейсом приложения. Обратите внимание: текст на фото должен легко читаться'
            }
        ],
        az: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                az: 'foto ya yuyulub, ya da uzaqdan çəkilib. SAA və nömrə oxunmalıdır'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                az: 'heç bir vəsiqə fotoşəkili yoxdur'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                az: 'fotoda vəsiqənin bir hissəsi yoxdur. Yoxlamaq üçün hər iki - üz və arxa tərəf lazımdır'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                az: 'vəsiqə tam şəkildə kadra düşməyib'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                az: 'sürücülük vəsiqəsi ilə fotonuz yoxdur'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                az: 'vəsiqədəki foto ilə sizin onunla fotonuz aydın deyil'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                az: 'vəsiqə ilə fotonuz kəsilib. Yoxlanış üçün sifət və vəsiqə kadra tam düşməlidir'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                az: 'vəsiqənin şəkli üzlükdə çəkilib, bu isə yoxlanışı çətinləşdirir'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                az: 'vəsiqənin tərəflərindən biri və sizin onunla fotonuz yoxdur'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                az: 'vəsiqənin fotosu ilə sizin fotonuz kəsilib. Yoxlanış üçün hər şey tam şəkildə kadra düşməlidir'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                az: 'vəsiqə ilə fotonuzdan savayı vəsiqənin şəklini ayrıca (üz və arxa tərəfini) çəkmək lazımdır'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                az: 'fotodakı məlumatları oxumaq olmur. Yoxlanış üçün vəsiqə ilə birgə rəsmi şəkildə tərcümənin çap fotoşəkli lazımdır'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                az: 'fotodakı məlumatları oxumaq çətindir, çünki vəsiqə yararsız hala düşüb'
            }
        ],
        geo: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                geo: 'ფოტო ბუნდოვანია ან შორიდანაა გადაღებული. სახელი, გვარი და ნომერი უნდა იკითხებოდეს'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                geo: 'არ არის მოწმობის არცერთი სურათი'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                geo: 'ფოტოზე არ არის მოწმობის ერთ-ერთი მხარე. შემოწმებისთვის საჭიროა ორივე მხარე: წინა და უკანა'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                geo: 'მოწმობა სრულად არ არის კადრში მოხვედრილი'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                geo: 'არ არის თქვენი ფოტო მოწმობით'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                geo: 'მოწმობის ფოტო და თქვენი ფოტო მასთან ერთად გამოვიდა ბუნდოვანი'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                geo: 'თქვენი მოწმის ფოტო მოჭრილია. შემოწმებისთვის საჭიროა, რომ სახე და მოწმობა სრულად მოხვდეს კადრში'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                geo: 'მოწმობის სურათი გადაღებულია ყდაში, რაც ართულებს შემოწმებას'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                geo: 'არ არის მოწმობის ერთ-ერთი მხარე და თქვენი ფოტო მასთან ერთად'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                geo: 'მოწმობის ფოტო და თქვენი ფოტო მასთან ერთად მოჭრილია. შემოწმებისთვის საჭიროა, რომ ყველაფერი სრულად მოხვდეს კადრში'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                geo: 'გარდა თქვენი ფოტოსი მოწმობასთან ერთად, საჭიროა ცალკე მოწმობისთვის სურათის გადაღება (წინა და უკანა მხარეების)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                geo: 'მონაცემები ფოტოზე არ იკითხება. შემოწმებისთვის მოწმობასთან ერთად საჭიროა ამობეჭდილი ოფიციალური თარგმანის ფოტოსურათი'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                geo: 'ფოტოზე მონაცემების წაკითხვა რთულია, რადგან მოწმობა უვარგის მდგომარეობაშია'
            }
        ],
        kgz: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                kgz: 'фото так эмес же алыстан тартылган. ФАА жана номер окулушу керек'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                kgz: 'күбөлүктүн бир дагы фотосүрөтү жок'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                kgz: 'фотодо күбөлүктүн бир тарабы жок. Текшерүү үчүн эки тарабы тең керек: алдыңкы жана арткы'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                kgz: 'күбөлүк кадрга толук түшпөй калган'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                kgz: 'күбөлүк менен сиздин фото жок'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                kgz: 'күбөлүктүн фотосу жана аны менен сиздин фото даана эмес'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                kgz: 'күбөлүк менен сиздин фото кесилген. Жүзүңүз жана күбөлүк толук кадрга түшкөндөй сүрөткө тартыңыз'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                kgz: 'күбөлүк кабы менен сүрөткө тартылгандыгынан, текшерүү татал болуп жатат'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                kgz: 'күбөлүктүн бир тарабы жана аны менен фотоңуз жок'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                kgz: 'күбөлүктүн фотосу жана аны кармаган сиздин фото кесилген. Текшерүү үчүн, баары толук кадрга түшкөндөй сүрөткө тартыңыз'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                kgz: 'күбөлүк кармаган өзүңүздүн фотодон тышкары күбөлүктү өзүнчө сүрөткө тартуу керек (алдыңкы жана арткы тарабын)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                kgz: 'фотодогу дайындар окулбайт. Текшерүү үчүн күбөлүк менен кошо анын расмий котормосунун басып чыгарылган сүрөтү керек'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                kgz: 'күбөлүк жарабай калгандыктан, фотодогу маалыматтарды окуу татаал'
            }
        ],
        uzb: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                uzb: 'surat chaplangan yoki uzoqdan olingan. FISH va raqam o‘qilishi kerak'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                uzb: 'birorta ham haydovchilik guvohnomasi rasmi yo‘q'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                uzb: 'fotosuratda haydovchilik guvohnomasining birorta ham tomoni yo‘q. Tekshiruv uchun har ikkala tarafi kerak: old va orqa tomoni'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                uzb: 'haydovchilik guvohnomasi kadrga to‘liq tushmagan'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                uzb: 'guvohnoma bilan birga tushgan suratingiz yo‘q'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                uzb: 'guvohnoma surativa u bilan birga tushgan suratingiz tiniq chiqmadi'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                uzb: 'guvohnoma bilan tushgan suratingiz qirqilgan. Tekshiruv uchun shunday suratga olingki, yuzingiz va guvohnomangiz kadrga to‘liq tushsin'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                uzb: 'guvohnoma g‘ilofda suratga olingan, bu esa tekshiruvni qiyinlashtiradi'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                uzb: 'guvohnomaning bir tomoni suratga olinmagan va u bilan tushgan suratingiz yo‘q'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                uzb: 'guvohnoma surativa u bilan birga tushgan suratingiz qirqib olingan. Tekshiruv uchun shunday suratga olingki, hammasi kadrga to‘liq tushsin'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                uzb: 'o‘zingizni guvohnoma bilan suratga olish bilan birga guvohnomani alohida ham suratga olishingiz zarur (old va orqa tomonini)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                uzb: 'fotosuratdagi ma’lumotlarni o‘qib bo‘lmayapti. Tekshiruv uchun guvohnoma birga bilan rasmiy tasdiqlangan tarjima surati taqdim etilishi lozim'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                uzb: 'fotosuratdagi ma’lumotlarni o‘qish qiyin bo‘lyapti, chunki guvohnoma yaroqsiz holatga kelib qolgan'
            }
        ],
        est: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                est: 'foto on udune või pildistatud kaugelt perekonna-, ees- ja isanimi ja number peavad olema loetavad'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                est: 'juhiloast ei ole ühtki fotot'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                est: 'juhiloa ühe poole foto puudub Kontrollimiseks on vajalikud mõlemad pooled: esi- ja tagapool'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                est: 'juhiluba ei ole täielikult kaadris'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                est: 'juhiloal puudub Teie foto'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                est: 'juhiloa foto ja Teie foto juhiloal ei ole terav'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                est: 'Teie fotot koos juhiloaga on kärbitud. Kinnituseks on vajalik, et nägu ja juhiluba on tervenisti kaadris'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                est: 'juhiluba on pildistatud varjus, mis raskendab kinnitamist'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                est: 'juhiloal ei ole ühtegi külge ja puudub Teie foto juhiloal'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                est: 'juhiloa fotot ja Teie poolt esitatud fotot juhiloal on kärbitud. Kinnituseks on vajalik, et kõik jääb tervikuna kaadrisse'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                est: 'Lisaks oma fotole juhiloal peate pildistama ka juhiluba tervikuna (eestpoolt ja tagantpoolt)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                est: 'foto andmed ei ole loetavad Kinnituseks on teil vaja fotot ametlikust tõlkest koos juhiloaga'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                est: 'fotol olevaid andmeid on raske lugeda, kuna juhiluba on kulunud'
            }
        ],
        mda: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                mda: 'fotografia este neclară sau făcută de la distanță. Numele complet și numărul trebuie să fie lizibile'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                mda: 'nu există nicio fotografie a permisului'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                mda: 'pe fotografie nu există una din fețele permisului. Pentru verificare sunt necesare ambele fețe: cea din față și cea din spate'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                mda: 'permisul nu a intrat complet în cadru'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                mda: 'pe permis nu este fotografia dumneavoastră'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                mda: 'fotografia permisului și fotografia dumneavoastră cu permisul nu sunt clare'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                mda: 'fotografia dumneavoastră cu permisul este trunchiată. Pentru verificare este necesar ca persoana și permisul să intre complet în cadru'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                mda: 'permisul este fotografiat în copertă, iar verificarea este dificilă din acest motiv'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                mda: 'nu există una din fețele permisului și fotografia dumneavoastră cu permisul'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                mda: 'fotografia de pe permis și fotografia dumneavoastră cu permisul sunt trunchiate. Pentru verificare este necesar ca totul să intre complet în cadru'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                mda: 'în afara de fotografia dumneavoastră cu permisul; trebuie să fotografiați și permisul separat (față și spate)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                mda: 'datele de pe fotografie nu sunt lizibile. Pentru verificare este necesară o fotografie a traducerii oficiale imprimate împreună cu permisul'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                mda: 'datele fotografiei sunt greu de citit, deoarece permisul a devenit inutilizabil'
            }
        ],
        arm: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                arm: 'լուսանկարը լղոզված է կամ հեռվից է արվել: ԱԱՀ-ն և համարը պետք է ընթեռնելի լինեն'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                arm: 'վկայականի ոչ մի լուսանկար չկա'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                arm: 'լուսանկարի վրա բացակայում է վկայականի կողմերից մեկը: Ստուգման համար անհրաժեշտ են երկու կողմերը՝ առջևի և հետևի'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                arm: 'վկայականը կադրի մեջ ամբողջությամբ չի տեղավորվել'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                arm: 'վկայականով Ձեր լուսանկարը բացակայում է'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                arm: 'վկայականի լուսանկարը և դրա հետ Ձեր լուսանկարը պարզ չեն ստացվել'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                arm: 'վկայականի հետ Ձեր լուսանկարը եզրատված է: Ստուգման համար անհրաժեշտ է, որ դեմքը և վկայականը ամբողջությամբ տեղավորվեն կադրի մեջ'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                arm: 'վկայականը լուսանկարվել է կազմի մեջ, ինչը դժվարացնում է ստուգումը'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                arm: 'բացակայում է վկայականի կողմերից մեկը և դրա հետ Ձեր լուսանկարը'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                arm: 'վկայականի լուսանկարը և դրա հետ Ձեր լուսանկարը եզրատված են: Ստուգման համար անհրաժեշտ է, որ ամենը ամբողջությամբ տեղավորվի կադրի մեջ'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                arm: 'վկայականի հետ ձեր լուսանկարից բացի, անհրաժեշտ է լուսանկարել վկայականն առանձին (առջևի և հետևի կողմերը)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                arm: 'լուսանկարի տվյալները ընթեռնելի չեն: Ստուգման համար անհրաժեշտ է պաշտոնական թարգմանության տպագիր օրինակի լուսանկարը՝ վկայականի հետ մեկտեղ'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                arm: 'լուսանկարի վրա պատկերված տվյալները դժվար է կարդալ, քանի որ վկայականը վնասվել է'
            }
        ],
        fin: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                fin: 'valokuva on epätarkka tai otettu liian kaukaa. Koko nimen ja numeron tulee olla luettavissa'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                fin: 'valokuvassa tulee olla pelkkä ajokortti'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                fin: 'valokuvassa ei näy ajokortti edestä tai takaa. Vahvistuksen suorittamiseksi tarvitsemme kuvan ajokortista sekä edestä että takaa'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                fin: 'ajokortti ei ole kuvassa täysin'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                fin: 'et ole lähettänyt selfietä ajokortin kanssa'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                fin: 'ajokortillinen selfiesi on epätarkka'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                fin: 'ajokortillinen selfiesi ei näy kuvassa kokonaan. Vahvistuksen suorittamiseksi sekä kasvojesi että ajokorttisi tulee näkyä kuvassa kokonaan'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                fin: 'vahvistuksen suorittaminen ei onnistu, sillä ajokortti ei näy kuvassa kokonaan'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                fin: 'yksi ajokortin puolista ja selfie ajokortin kanssa puuttuvat'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                fin: 'ajokortillinen selfiesi ja kuvat ajokortistasi on rajattu huonosti. Vahvistuksen suorittamiseksi kaiken tulee näkyä kuvassa kokonaan'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                fin: 'ajokortillisen selfien lisäksi sinun tulee myös kuvata ajokorttisi erillään (sekä edestä että takaa)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                fin: ''
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                fin: 'tietojen lukeminen ajokortista on hankalaa sen vaurioitumisen takia'
            }
        ],
        slo: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                slo: 'Photos are blurry or taken from far away. Full name and number must be visible and distinct'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                slo: 'Brez fotografij vozniškega dovoljenja'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                slo: 'The photo does not contain either side of the license. Both sides need to be checked: front and back'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                slo: 'The license must be fully in the shot'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                slo: 'Missing your photo with license'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                slo: 'Photo of your license and your photo with the license are blurry'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                slo: 'Your photo with your license is cut off. Photograph yourself so that your face and license are both completely in the frame'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                slo: 'License photographed inside protective cover. We need to check a photo taken without the cover'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                slo: 'Missing one of the sides of your license, as well as your photo with the license'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                slo: 'The license photo and your picture with it are cut off. Take new photos, with everything completely in the frame'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                slo: 'In addition to your photo with the license, you must photograph the license separately (both sides)'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                slo: 'Podatki na fotografiji niso čitljivi. Pridobiti morate uradni prevod, ga natisniti ter fotografirati skupaj z licenco'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                slo: 'Your driver`s license is in poor condition; information is illegible. Please replace your license'
            }
        ],
        rou: [
            { type: 'label', label: 'Айди Карта', th: true },
            {
                type: 'item',
                text: 'данные айди-карты не совпадают с данными в карточке водителя',
                rou: 'datele din cartea de identitate nu coincid cu datele din fișa șoferului'
            },
            {
                type: 'item',
                text: 'истёк срок действия вашей айди-карты',
                rou: 'termenul de valabilitate al cărții dvs. de identitate a expirat'
            },
            {
                type: 'item',
                text: 'в кадре нет фотографии вашей айди-карты',
                rou: 'cartea dvs. de identitate lipsește din cadrul fotografiei'
            },
            {
                type: 'item',
                text: 'фотография айди-карты нечёткая. Выберите хороший раскурс и освещение',
                rou: 'fotografia cărții dvs. de identitate este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit'
            },
            {
                type: 'item',
                text: 'айди-карта не полностью попала в кадр или её фотография обрезана',
                rou: 'cartea de identitate nu a intrat complet în cadru sau fotografia ei a fost tăiată'
            },
            {
                type: 'item',
                text: 'на фотографии скан или ксерокс айди-карты. Для проверки нужно фото оригинала',
                rou: 'pe fotografie este o copie scanată sau xeroxată a cărții de identitate. Pentru verificare este necesară fotografia documentului original'
            },
            {
                type: 'item',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
                rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original'
            },
            { type: 'label', label: 'Водительское удостоверение', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                rou: 'fotografia este neclară sau a fost făcută de la o distanță prea mare. Numele deplin și numărul trebuie să fie lizibile'
            },
            {
                type: 'item',
                text: 'нет ни одной фотографии удостоверения',
                rou: 'lipsește fotografia permisului de conducere'
            },
            {
                type: 'item',
                text: 'на фото нет одной из сторон удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                rou: 'pe fotografie lipsește una din părțile permisului de conducere. Pentru verificare sunt necesare ambele părți: față și verso'
            },
            {
                type: 'item',
                text: 'удостоверение не полностью попало в кадр',
                rou: 'permisul de conducere nu a intrat complet în cadru'
            },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
                rou: 'fotografia conține o imagine afișată pe ecranul calculatorului. Pentru verificare este nevoie de permisul de conducere original'
            },
            {
                type: 'item',
                text: 'на фото копия удостоверения, а для проверки нужен оригинал',
                rou: 'în fotografie este o copie a permisului de conducere, iar pentru verificare este nevoie de fotografia documentului original'
            },
            {
                type: 'item',
                text: 'нет вашего фото с удостоверением',
                rou: 'lipsește fotografia dvs. împreună cu permisul dvs. de conducere'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением получилось нечётким',
                rou: 'fotografia dvs. împreună cu permisul de conducere este neclară'
            },
            {
                type: 'item',
                text: 'отсутствует отметка о категории Б в вашем удостоверении',
                rou: 'în permisul dvs. de conducere nu este bifată categoria B'
            },
            {
                type: 'item',
                text: 'срок действия удостоверения истёк',
                rou: 'termenul de valabilitate al permisului dvs. de conducere a expirat'
            },
            {
                type: 'item',
                text: 'фото в удостоверении не соответствует вашей фотографии себя',
                rou: 'între fotografia din permisul de conducere și fotografia dvs. există o diferență prea mare'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность',
                rou: 'datele din fotografie sunt practic ilizibile, deoarece permisul de conducere este prea uzat'
            },
            { type: 'label', label: 'Справка о судимости', th: true },
            {
                type: 'item',
                text: 'чужая справка, для проверки нужен ваш документ',
                rou: 'a fost prezentat un certificat de cazier judiciar străin; pentru verificare este necesar să prezentați propriul dvs. certificat'
            },
            {
                type: 'item',
                text: 'истёк срок действия справки, для проверки нужен действующий документ',
                rou: 'termenul de valabilitate al certificatului de cazier judiciar a expirat; pentru verificare este necesar un certificat valid'
            },
            {
                type: 'item',
                text: 'в справке нет информации об отстутвии судимости. Пришлите справку, которая это подтверждает',
                rou: 'în certificat nu se confirmă faptul că solicitantul nu este înscris în cazierul judiciar. Vă rugăm să trimiteți un certificat de cazier judiciar în care se confirmă acest fapt'
            },
            {
                type: 'item',
                text: 'в кадре нет фотографии справки',
                rou: 'certificatul de cazier judiciar lipsește din cadrul fotografiei'
            },
            {
                type: 'item',
                text: 'фотография справки нечёткая. Выберите хороший ракурс и освещение',
                rou: 'fotografia certificatului de cazier este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit'
            },
            {
                type: 'item',
                text: 'справка не полностью попала в кадр или её фотография обрезана',
                rou: 'certificatul de cazier judiciar nu a intrat complet în cadru sau fotografia lui a fost tăiată'
            },
            {
                type: 'item',
                text: 'на фотографии скан или ксерокс справки. Для проверки нужна фотография оригинала',
                rou: 'pe fotografie este o copie scanată sau xeroxată a certificatului de cazier judiciar. Pentru verificare este necesară fotografia documentului original'
            },
            {
                type: 'item',
                text: 'фотография сделана с экрана устройства. Для проверки нужна фотография оригинала справки',
                rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia certificatului original'
            },
            { type: 'label', label: 'История штрафов', th: true },
            {
                type: 'item',
                text: 'справка принадлежит другому водителю, данные не совпали',
                rou: 'a fost prezentat istoricul de sanctiuni al altui sofer; pentru verificare este necesar să prezentați propriul dvs. certificat'
            },
            {
                type: 'item',
                text: 'история штрафов должна содержать информацию за 5 лет',
                rou: 'Istoricul sancțiunilor ar trebui să conțină informații pe parcursul ultimilor 5 ani'
            },
            {
                type: 'item',
                text: 'документ должден быть не старше 6 месяцев',
                rou: 'istoricul sancțiunilor trebuie să fi fost emis în ultimele 6 luni'
            },
            {
                type: 'item',
                text: 'в документе не должно быть записей о influența băuturilor alcoolice',
                rou: 'istoricul nu trebuie să conțină sancțiuni de natură penală'
            },
            {
                type: 'item',
                text: 'в кадре нет фотографии истории штрафов',
                rou: 'istoricul de sancțiuni nu a fost fotografiat'
            },
            {
                type: 'item',
                text: 'фотография истории штрафов нечёткая. Выберите хороший ракурс и освещение',
                rou: 'fotografia istoricului de sancțiuni este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit'
            },
            {
                type: 'item',
                text: 'история штрафов не полностью попала в кадр, или её фотография обрезана',
                rou: 'istoricul de sancțiuni nu a intrat complet în cadru sau fotografia lui a fost tăiată'
            },
            {
                type: 'item',
                text: 'на фотографии скан или ксерокс истории штрафов. Для проверки нужна фотография оригинала',
                rou: 'pe fotografie este o copie scanată sau xeroxată a istoricului de sancțiuni. Pentru verificare este necesară fotografia documentului original'
            },
            {
                type: 'item',
                text: 'фотография сделана с экрана устройства. Для проверки нужна фотография оригинала истории штрафов',
                rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia originală a istoricului de sancțiuni'
            },
            { type: 'label', label: 'Профессиональный сертификат водителя', th: true },
            {
                type: 'item',
                text: 'данные в сертификате не совпадают с данными в карточке водителя',
                rou: 'datele din certificatul de înmatriculare nu coincid cu datele din fișa șoferului'
            },
            {
                type: 'item',
                text: 'в кадре нет фотографии вашего сертификата',
                rou: 'certificatul de înmatriculare lipsește din cadrul fotografiei'
            },
            {
                type: 'item',
                text: 'фотография сертификата нечёткая. Выберите хороший ракурс и освещение',
                rou: 'fotografia certificatului de înmatriculare este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit'
            },
            {
                type: 'item',
                text: 'сертификат не полностью попал в кадр или его фотография обрезана',
                rou: 'certificatul de înmatriculare nu a intrat complet în cadru sau fotografia lui a fost tăiată'
            },
            {
                type: 'item',
                text: 'на фотографии скан или копия сертификата. Для проверки нужно фото оригинала',
                rou: 'pe fotografie este o copie scanată sau xeroxată a certificatului de înmatriculare. Pentru verificare este necesară fotografia documentului original'
            },
            {
                type: 'item',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
                rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original'
            },
            {
                type: 'item',
                text: 'ваш сертификат просрочен',
                rou: 'certificatul dvs. de înmatriculare este expirat'
            }
        ],
        srb: [
            { type: 'label', label: 'Водительское удостоверение', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                srb: 'fotografija je zamućena ili napravljena iz daljine. Prezime, ime, ime po ocu i broj moraju biti čitki'
            },
            {
                type: 'item',
                text: 'нет ни одной фотографии удостоверения',
                srb: 'nema nijedne fotografije dozvole'
            },
            {
                type: 'item',
                text: 'на фото нет одной из сторон удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                srb: 'na fotografiji nema jedne od strana dozvole. Za proveru su potrebne obe strane: prednja i poleđina'
            },
            {
                type: 'item',
                text: 'удостоверение не полностью попало в кадр',
                srb: 'sedište nije potpuno u kadru'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашего фото с удостоверением',
                srb: 'nema vaše fotografije sa dozvolom'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним получились нечёткими',
                srb: 'fotografija dozvole i vaša fotografija sa dozvolom su mutne'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением получилось нечётким',
                srb: 'vaša fotografija sa dozvolom je mutna'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением обрезано. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                srb: 'vaša fotografija sa dozvolom je odsečena. Za proveru je potrebo da lice i dozvola budu u potpunosti u kadru'
            },
            {
                type: 'item',
                text: 'нет одной из сторон удостоверения и вашего фото с ним',
                srb: 'nema jedne od strana dozvole i vaše fotografije sa njom'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                srb: 'fotografija dozvole i vaša fotografija sa dozvolom su odsečene. Za proveru je potrebno da se fotografišete tako da sve bude u potpunosti u kadru'
            },
            {
                type: 'item',
                text: 'кроме вашего фото себя с удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                srb: 'osim vaše lične fotografije sa dozvolom potrebno je posebno fotografisati dozvolu (prednju stranu i poleđinu)'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'удостоверение сфотографировано в обложке, что затрудняет проверку',
                srb: 'dozvola je fotografisana u koricama što otežava proveru'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                srb: 'podaci na fotografiji su nečitljivi. Za proveru je potrebna fotografija odštampanog zvaničnog prevoda zajedno sa dozvolom'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность',
                srb: 'podatke na fotografiji je teško pročitati pošto je dozvola postala neupotrebljiva'
            },
            { type: 'label', label: 'Лицензия', th: true },
            {
                type: 'item',
                text: 'данные в лицензии не совпадают с данными в карточке водителя',
                srb: 'podaci u taksi dozvoli se ne poklapaju sa podacima na stranici vozača'
            },
            {
                type: 'item',
                text: 'фотография лицензии нечёткая. Выберите хороший ракурс и освещение',
                srb: 'fotografija taksi dozvole je mutna. Izaberite dobar ugao i osvetljenje'
            },
            {
                type: 'item',
                text: 'лицензия не полностью попала в кадр или ее фотография обрезана',
                srb: 'taksi dozvola nije u potpunosti u kadru ili je fotografija isečena'
            },
            {
                type: 'item',
                text: 'в кадре нет фотографии вашей лицензии',
                srb: 'u kadru nema fotografije vaše taksi dozvole'
            },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон лицензии',
                srb: 'nema fotografije jedne strane taksi dozvole'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как лицензия пришла в негодность',
                srb: 'podaci na fotografiji su teško čitljivi, pošto je taksi dozvola pohabana'
            }
        ],
        lta: [
            { type: 'label', label: 'Водительское удостоверение', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                lta: 'fotogrāfija ir izplūdusi vai uzņemta no tālienes. vārdam, uzvārdam un numuram ir jābūt salasāmiem'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                lta: 'nav nevienas apliecības fotogrāfijas'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                lta: 'fotogrāfijā nav vienas no apliecības pusēm. Pārbaudei ir nepieciešamas abas puses: priekšējā un aizmugurējā puse'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                lta: 'apliecība nav pilnībā iekļuvusi kadrā'
            },
            { type: 'label', label: 'Селфи', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                lta: 'nav jūsu fotogrāfijas ar apliecību'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                lta: 'apliecības fotogrāfija un jūsu fotogrāfija ar apliecību ir sanākušas neskaidras'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                lta: 'jūsu fotogrāfija ar apliecību ir apgriezta. Pārbaudei ir nepieciešams, lai seja un apliecība pilnībā iekļūtu kadrā'
            },
            { type: 'label', label: 'Разное', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                lta: 'apliecība ir nofotografēta vāciņā, kas apgrūtina pārbaudi'
            },
            { type: 'label', label: 'Общее', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                lta: 'nav vienas no apliecības pusēm un jūsu fotogrāfijas ar to'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                lta: 'apliecības fotogrāfija un jūsu fotogrāfija ar apliecību ir apgrieztas. Pārbaudei ir nepieciešams, lai viss pilnībā iekļūtu kadrā'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                lta: 'neskaitot jūsu fotogrāfiju ar apliecību, ir nepieciešams atsevišķi nofotografēt apliecību (priekšpusi un mugurpusi)'
            },
            { type: 'label', label: 'Лицензия на такси (вторая фиксация ЧС)', th: true },
            {
                type: 'item',
                text: 'номер на водительком удостоверении и в вашем разрешения ATD не совпадают',
                lta: 'jūsu norādītais vadītāja apliecības numurs nesakrīt ar to, kas norādīts ATD atļaujā'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем разрешении ATD не совпадают',
                lta: 'dati, kas norādīti jūsu vadītāja apliecībā un ATD atļaujā, nesakrīt'
            },
            {
                type: 'item',
                text: 'нет ни одной фотографии разрешения ATD',
                lta: 'nav pievienotas ATD atļaujas fotogrāfijas'
            },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон разрешения ATD',
                lta: 'nav pievienota fotogrāfija, kurā redzama viena no abām ATD atļaujas pusēm'
            },
            {
                type: 'item',
                text: 'необходимо сфотографировать лицевую сторону разрешения ATD',
                lta: 'nepieciešama ATD atļaujas priekšpuses fotogrāfija'
            },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                lta: 'fotogrāfija ir izplūdusi vai uzņemta no pārāk liela attāluma. Datiem un numuram ir jābūt labi salasāmam'
            },
            {
                type: 'item',
                text: 'разрешение ATD не полностью попало в кадр',
                lta: 'ATD atļauja kadrā nav redzama pilnībā'
            },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал разрешения ATD',
                lta: 'fotogrāfija uzņemta no datora ekrāna. Lai veiktu pārbaudi, nepieciešama ATD atļaujas oriģināla fotogrāfija'
            },
            {
                type: 'item',
                text: 'на фото копия разрешения ATD, а для проверки нужен оригинал',
                lta: 'attēlā redzama ATD atļaujas kopija; lai veiktu pārbaudi, jāiesniedz oriģināla fotogrāfija'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                lta: 'dati fotogrāfijā ir grūti salasāmi, jo apliecība ir kļuvusi nederīga'
            }
        ],
        isr: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                isr: 'התמונה מטושטשת או צולמה יותר מדי מרחוק. השם המלא והמספר צריכים להיות קריאים'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                isr: 'חסרה תמונה של רישיון נהיגה'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                isr: 'בתמונה לא מופיע הצד הקדמי או האחורי של רישיון הנהיגה. צריך לאמת את שני הצדדים: מלפנים ומאחור'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                isr: 'לא רואים את כל רישיון הנהיגה בתמונה'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                isr: 'אין תמונה שלך יחד עם רישיון הנהיגה'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                isr: 'התמונות של רישיון הנהיגה ושלך יחד עם הרישיון מטושטשות'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                isr: 'התמונה שלך יחד עם רישיון הנהיגה חתוכה. כדי לאמת את הרישיון צריך לראות את הפנים שלך ואת רישיון הנהיגה במלואו'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                isr: 'האימות הושהה כי רישיון הנהיגה צולם בתוך כיסוי'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность',
                isr: 'קשה לקרוא את הפרטים בתמונה כי רישיון הנהיגה פגום'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                isr: 'לא קיבלנו תמונה של אחד מהצדדים של רישיון הנהיגה ותמונה שלך יחד עם הרישיון'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним получились нечёткими',
                isr: 'התמונה שלך עם רישיון הנהיגה יצאה מטושטשת. עליך לוודא שפרטי הרישיון שבתמונה ברורים וקריאים'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                isr: 'התמונות של רישיון הנהיגה ושלך יחד עם הרישיון חתוכות. כדי לאמת את הרישיון צריך לראות את כל הרישיון ואותך'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                isr: 'מלבד התמונה שלך עם רישיון הנהיגה, צריך לצלם גם תמונה נפרדת של רישיון הנהיגה משני הצדדים'
            },
            { type: 'label', label: 'ОБЩИЕ ПОЛОЖЕНИЯ', th: true },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                isr: 'הפרטים האישיים בתמונה לא קריאים. כדי לאמת את הרישיון צריך את רישיון הנהיגה המקורי יחד עם גרסה מודפסת, רשמית ומתורגמת'
            },
            { type: 'label', label: 'СТРАХОВКА', th: true },
            { type: 'item', text: 'нет ни одной фотографии страховки', isr: 'חסרה תמונה של מסמך הביטוח' },
            {
                type: 'item',
                text: 'необходимо сфотографировать лицевую сторону страховки',
                isr: 'צריך לצלם את הצד הקדמי של הביטוח'
            },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                isr: 'התמונה מטושטשת או צולמה יותר מדי מרחוק. השם הפרטי ושם המשפחה צריכים להיות קריאים'
            },
            {
                type: 'item',
                text: 'страховка не полностью попала в кадр',
                isr: 'לא רואים את כל הביטוח בתמונה'
            },
            {
                type: 'item',
                text: 'данные, указанные в страховке, должны соответствовать данным, указанным на ВУ',
                isr: 'הפרטים בביטוח צריכים להתאים לפרטים ברישיון הנהיגה'
            },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал страховки',
                isr: 'זו תמונה של מסך מחשב. כדי לאמת את הביטוח צריך תמונה של התעודה המקורית'
            },
            {
                type: 'item',
                text: 'на фото копия страховки, а для проверки нужен оригинал',
                isr: 'בתמונה רואים עותק של תעודת הביטוח. אנחנו צריכים את התעודה המקורית'
            }
        ],
        ltu: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                ltu: 'Nuotrauka neryški arba padaryta iš toli. Vardas, pavardė ir numeris turi būti įskaitomi'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                ltu: 'Nėra nė vienos pažymėjimo nuotraukos'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                ltu: 'Nuotraukoje nėra vienos iš pažymėjimo pusių. Patikrai atlikti reikia abiejų pusių: priekinės ir galinės'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                ltu: 'Visas pažymėjimas netilpo į kadrą'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                ltu: 'Nėra jūsų nuotraukos su pažymėjimu'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                ltu: 'Pažymėjimo nuotrauka ir jūsų nuotrauka su pažymėjimu yra neryškios'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                ltu: 'Jūsų nuotrauka su pažymėjimu yra apkirpta. Patikrai atlikti būtina, kad į kadrą tilptų visas veidas ir visas pažymėjimas'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                ltu: 'Pažymėjimas nufotografuotas aplanke, todėl jį sudėtinga patikrinti'
            },
            { type: 'label', label: 'ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                ltu: 'Nėra vienos iš pažymėjimo pusių ir jūsų nuotraukos su juo'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                ltu: 'Pažymėjimo nuotrauka ir jūsų nuotrauka su juo yra apkirptos. Patikrai atlikti būtina, kad viskas tilptų į kadrą'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                ltu: 'Be savo nuotraukos su pažymėjimu turite atskirai nufotografuoti pažymėjimą (priekinę ir galinę puses)'
            },
            { type: 'label', label: 'Сертификат', th: true },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем сертификате не совпадают',
                ltu: 'Nesutampa vairuotojo pažymėjime ir jūsų individualios veiklos pažymoje nurodyti vardas ir pavardė'
            },
            {
                type: 'item',
                text: 'нет данных вашего сертификата',
                ltu: 'nėra jūsų individualios veiklos pažymos duomenų'
            },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                ltu: 'nuotrauka neryški arba padaryta iš toli. vardas, pavardė ir numeris turi būti įskaitomi'
            },
            {
                type: 'item',
                text: 'сертификат не полностью попал в кадр',
                ltu: 'nuotraukoje yra ne visa individualios veiklos pažyma'
            },
            {
                type: 'item',
                text: 'сертификат недействителен',
                ltu: 'individualios veiklos pažyma negalioja'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                ltu: 'Duomenys nuotraukoje sunkiai įskaitomi, nes pažymėjimas yra netinkamas naudoti'
            }
        ],
        nor: [
            { type: 'label', label: 'Водительское удостоверение', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
                nor: 'Bildet er uklart eller er tatt på for lang avstand. Hele navnet og førerkortnummer må være lesbart'
            },
            {
                type: 'item',
                text: 'нет фотографий водительского удостоверения',
                nor: 'mangler foto av førkort'
            },
            {
                type: 'item',
                text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                nor: 'mangler foto av begge sidene på førerkortet. Vi trenger foto av kortet forran og bak for å kunne kontrollere det'
            },
            {
                type: 'item',
                text: 'водительское удостоверение не полностью попало в кадр',
                nor: 'førerkortet er ikke plassert i rammen'
            },
            { type: 'label', label: 'Селфи', th: true },
            {
                type: 'item',
                text: 'нет вашей фотографии с водительским удостоверением',
                nor: 'mangler bilde deg selv med førerkortet'
            },
            {
                type: 'item',
                text: 'фотография с водительским удостоверением получилась нечёткой',
                nor: 'bildet av deg med føerkortet er uskarpt'
            },
            {
                type: 'item',
                text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                nor: 'bildet av deg med førerkort er ikke innenfor rammene. Ta på nytt sånn at vi får sjekket dem'
            },
            { type: 'label', label: 'Разное', th: true },
            {
                type: 'item',
                text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
                nor: 'Ta førerkort ut av mappe eller deksel'
            },
            { type: 'label', label: 'Общее', th: true },
            {
                type: 'item',
                text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
                nor: 'mangler bilde av begge sidne på førerkortet'
            },
            {
                type: 'item',
                text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                nor: 'bildet av deg sammen med førerkortet er ikke fullstendig. Alt må være med innenfor rammen. Ta på nytt sånn at vi kan sjekke det'
            },
            {
                type: 'item',
                text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                nor: 'i tillegg til bilde av deg selv med førerkortet, trenger vi bilder av selve førerkortet (begge sider)'
            },
            { type: 'label', label: 'Лицензия на такси (вторая фиксация ЧС)', th: true },
            {
                type: 'item',
                text: 'лицензия принадлежит другому водителю, предоставьте пожалуйста вашу лицензнию',
                nor: 'Denne kjøreseddelen tilhører en annen sjåfør, vennligst registrer ditt eget førerkort.'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как лицензия пришла в негодность',
                nor: 'vi kan ikke bekrefte bildet siden kjøreseddel eller løyvedokument er for slitt'
            },
            {
                type: 'item',
                text: 'в кадре нет фотографии вашей лицензии такси',
                nor: 'mangler foto av løyvedokument'
            },
            {
                type: 'item',
                text: 'в кадре нет фотографии вашего разрешения на работу в такси',
                nor: 'mangler foto av kjøreseddel'
            },
            {
                type: 'item',
                text: 'фотография лицензии нечёткая. Выберите хороший ракурс и освещение',
                nor: 'Bildet er for uskarpt eller for langt unna'
            },
            {
                type: 'item',
                text: 'лицензия не полностью попала в кадр или ее фотография обрезана',
                nor: 'Kjøreseddel eller løyvedokument er ikke helt inne i rammen'
            },
            {
                type: 'item',
                text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
                nor: 'vi kan ikke kontrollere bildet fordi førerkortet er for slitt'
            }
        ],
        bol: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                bol: 'la foto está borrosa o se tomó a una distancia muy grande. El nombre completo y el número deben ser legibles'
            },
            {
                type: 'item',
                text: 'нет ни одной фотографии удостоверения',
                bol: 'no hay fotos de la licencia de conducir'
            },
            {
                type: 'item',
                text: 'на фото нет одной из сторон удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                bol: 'la foto no muestra ni el anverso ni el reverso de la licencia de conducir. La verificación requiere ambos lados: anverso y reverso'
            },
            {
                type: 'item',
                text: 'удостоверение не полностью попало в кадр',
                bol: 'no aparece la licencia de conducir completa en el marco de la foto'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет одной из сторон удостоверения и вашего фото с ним',
                bol: 'uno de los lados de la licencia de conducir y tu foto con la licencia en mano no están'
            },
            {
                type: 'item',
                text: 'нет вашего фото с удостоверением',
                bol: 'no está tu foto con la licencia de conducir en mano'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением получилось нечётким',
                bol: '"tu foto con la licencia de conducir en mano está borrosa'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением обрезано. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                bol: 'tu foto con la licencia de conducir en mano está cortada. La verificación requiere que tu rostro y la licencia de conducir aparezcan por completo en el cuadro de la foto'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'удостоверение сфотографировано в обложке, что затрудняет проверку',
                bol: 'es difícil verificar la licencia de conducir porque la fotografía está en una funda'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                bol: 'los datos en la foto no son legibles. La verificación requiere una traducción oficial impresa junto a la licencia de conducir original'
            },
            {
                type: 'item',
                text: 'кроме вашего фото себя с удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                bol: 'tienes que tomarte una foto con la licencia de conducir además de tu foto con la licencia de conducir en mano, tendrás que tomar una foto de ambos lados de la licencia (anverso y reverso)'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним получились нечёткими',
                bol: 'las fotos de tu licencia de conducir y tu foto con la licencia en mano están borrosas'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                bol: 'las fotos de tu licencia de conducir y tu foto con la licencia en mano están cortadas. La verificación requiere que todo aparezca por completo en el marco de la foto'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность',
                bol: 'los datos no se muestran bien en la foto porque la licencia de conducir está dañada'
            }
        ],
        kongo: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                kongo: 'la photo est floue ou prise de loin. Le nom, le prénom et le patronyme, et le numéro doivent être lisibles'
            },
            {
                type: 'item',
                text: 'нет ни одной фотографии удостоверения',
                kongo: 'aucune photographie du permis de conduire'
            },
            {
                type: 'item',
                text: 'на фото нет одной из сторон удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                kongo: 'la photo ne représente aucune des faces du permis de conduire. Pour la vérification, les deux faces sont obligatoires: le recto et le verso'
            },
            {
                type: 'item',
                text: 'удостоверение не полностью попало в кадр',
                kongo: "le permis de conduire n'était pas complètement dans le cadre"
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашего фото с удостоверением',
                kongo: 'aucune photo de vous avec votre permis de conduire'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним получились нечёткими',
                kongo: 'la photo du permis de conduire et votre photo avec celui-ci sont floues'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением получилось нечётким',
                kongo: 'votre photo avec le permis de conduire est floue'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением обрезано. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                kongo: 'votre photo avec le permis de conduire est rognée. Pour la vérification, le visage et le permis de conduire doivent intégralement se trouver dans le cadre.'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'удостоверение сфотографировано в обложке, что затрудняет проверку',
                kongo: 'le permis de conduire a été photographié dans la couverture, ce qui rend la vérification difficile.'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                kongo: 'les données de la photo sont illisibles. Pour la vérification, une photo de la photocopie de la traduction officielle est nécessaire avec le permis de conduire'
            },
            {
                type: 'item',
                text: 'кроме вашего фото себя с удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                kongo: 'hormis votre photo de vous-même avec le permis de conduire, vous devez photographier le permis de conduire séparément (recto et verso)'
            },
            {
                type: 'item',
                text: 'нет одной из сторон удостоверения и вашего фото с ним',
                kongo: 'aucune face du permis de conduire, ni de votre photo avec celui-ci'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                kongo: 'la photo du permis de conduire et votre photo avec celui-ci sont rognées. Pour la vérification, tout le document doit être dans le cadre'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность',
                kongo: 'les données de la photo sont difficilement lisibles, car le permis de conduire est devenu inutilisable'
            }
        ],
        ang: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
                ang: 'a foto está desfocada ou foi tirada de muito longe. O nome completo e o número devem estar legíveis'
            },
            {
                type: 'item',
                text: 'нет ни одной фотографии удостоверения',
                ang: 'não há fotografias da carta de condução'
            },
            {
                type: 'item',
                text: 'на фото нет одной из сторон удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
                ang: 'não há nenhuma foto da frente nem verso da carta de condução. A verificação exige ambos os lados: frente e verso'
            },
            {
                type: 'item',
                text: 'удостоверение не полностью попало в кадр',
                ang: 'a carta de condução não está totalmente enquadrada na imagem'
            },
            { type: 'label', label: 'СЕЛФИ', th: true },
            {
                type: 'item',
                text: 'нет вашего фото с удостоверением',
                ang: 'não há nenhuma foto tua com a carta de condução'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним получились нечёткими',
                ang: 'as fotografias da carta de condução e a tua fotografia com a carta de condução estão desfocadas'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением получилось нечётким',
                ang: 'a tua foto com a carta de condução está desfocada'
            },
            {
                type: 'item',
                text: 'ваше фото с удостоверением обрезано. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
                ang: 'a tua fotografia com a carta de condução está cortada. A verificação exige que a tua cara e a carta de condução estejam completamente enquadradas na imagem'
            },
            { type: 'label', label: 'РАЗНОЕ', th: true },
            {
                type: 'item',
                text: 'удостоверение сфотографировано в обложке, что затрудняет проверку',
                ang: 'é difícil verificar a carta de condução porque foi fotografa com uma capa'
            },
            {
                type: 'item',
                text: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
                ang: 'as informações na fotografia não são legíveis. A verificação exige uma tradução oficial impressa juntamente com a carta de condução original'
            },
            {
                type: 'item',
                text: 'кроме вашего фото себя с удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
                ang: 'para além da tua fotografia com a carta de condução, também deves fotografar ambos os lados da tua carta de condução (frente e verso)'
            },
            {
                type: 'item',
                text: 'нет одной из сторон удостоверения и вашего фото с ним',
                ang: 'um dos lados da carta de condução e a tua foto com a carta de condução estão em falta'
            },
            {
                type: 'item',
                text: 'фото удостоверения и ваше фото с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
                ang: 'as fotografias da carta de condução e a tua fotografia com a carta de condução estão cortadas. A verificação exige que tudo esteja totalmente enquadrado na imagem'
            },
            {
                type: 'item',
                text: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность',
                ang: 'é difícil ler as credenciais na fotografia porque a carta de condução está danificada'
            }
        ]
    },
    blacklist: {
        default: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                eng: 'doubt authenticity of license',
                gana: 'doubt authenticity of license',
                kot: "un doute subsiste quant à l'authenticité du permis de conduire",
                kam: "un doute subsiste quant à l'authenticité du permis de conduire",
                zam: 'doubt authenticity of license'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                eng: 'doubts concerning your right to drive a car using this license',
                gana: 'doubts concerning your right to drive a car using this license',
                kot: 'un doute subsiste quant à votre droit de conduire un véhicule avec ce permis de conduire',
                kam: 'un doute subsiste quant à votre droit de conduire un véhicule avec ce permis de conduire',
                zam: 'doubts concerning your right to drive a car using this license'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                eng: 'no category B indication on your license',
                gana: 'no category B indication on your license',
                kot: 'il n’existe aucune indication de la catégorie B sur votre permis de conduire',
                kam: 'il n’existe aucune indication de la catégorie B sur votre permis de conduire',
                zam: 'no category B indication on your license'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                eng: 'unacceptable photo content',
                gana: 'unacceptable photo content',
                kot: 'contenu invalide des photos',
                kam: 'contenu invalide des photos',
                zam: 'unacceptable photo content'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                eng: "The number and full name on the driver's license and in your profile in the taxi company do not match. The taxi company can update your profile",
                gana: "The number and full name on the driver's license and in your profile in the taxi company do not match. The taxi company can update your profile",
                kot: 'Le numéro et le nom complet figurant sur le permis de conduire sont différents de ceux enregistrés dans votre profil de la compagnie de taxis. La compagnie de taxi peut mettre à jour votre profil.',
                kam: 'Le numéro et le nom complet figurant sur le permis de conduire sont différents de ceux enregistrés dans votre profil de la compagnie de taxis. La compagnie de taxi peut mettre à jour votre profil.',
                zam: "The number and full name on the driver's license and in your profile in the taxi company do not match. The taxi company can update your profile"
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                eng: 'Your full name on your driver`s license doesn`t match the one in your taxi company profile. The taxi company can update your profile',
                gana: 'Your full name on your driver`s license doesn`t match the one in your taxi company profile. The taxi company can update your profile',
                kot: 'Le nom, le prénom et le patronyme du permis de conduire et ceux de votre profil du gestionnaire de taxi ne coïncident pas. Le gestionnaire de taxi peut actualiser le profil',
                kam: 'Le nom, le prénom et le patronyme du permis de conduire et ceux de votre profil du gestionnaire de taxi ne coïncident pas. Le gestionnaire de taxi peut actualiser le profil',
                zam: "Your full name on your driver's license doesn't match the one in your taxi company profile. The taxi company can update your profile"
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                eng: 'Your license is expired',
                gana: 'Your license is expired',
                kot: 'la date de validité du permis de conduire a expiré',
                kam: 'la date de validité du permis de conduire a expiré',
                zam: 'license is expired'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                eng: 'photo taken of license copy; we need to check the original license',
                gana: 'photo taken of license copy; we need to check the original license',
                kot: 'la photo représente la copie du permis de conduire, mais pour la vérification, l’original est nécessaire',
                kam: 'la photo représente la copie du permis de conduire, mais pour la vérification, l’original est nécessaire',
                zam: 'photo taken of license copy; we need to check the original license'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                eng: 'photo in license doesn`t match your photo of yourself',
                gana: 'photo in license doesn`t match your photo of yourself',
                kot: 'la photo sur le permis de conduire ne coïncide pas à votre photo de vous',
                kam: 'la photo sur le permis de conduire ne coïncide pas à votre photo de vous',
                zam: "photo in license doesn't match your photo of yourself"
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                eng: 'photo taken from computer screen. We need to check the original driver`s license',
                gana: 'photo taken from computer screen. We need to check the original driver`s license',
                kot: "la photo a été prise à partir de l'écran de l'ordinateur. Pour la vérification, l’original du permis de conduire est nécessaire",
                kam: "la photo a été prise à partir de l'écran de l'ordinateur. Pour la vérification, l’original du permis de conduire est nécessaire",
                zam: "photo taken from computer screen. We need to check the original driver's license"
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                eng: "your access to the service has already been limited earlier, so we can't restore your access now",
                gana: "your access to the service has already been limited earlier, so we can't restore your access now",
                kot: 'votre accès au service a déjà été limité auparavant, nous ne pouvons donc pas à présent restaurer votre accès',
                kam: 'votre accès au service a déjà été limité auparavant, nous ne pouvons donc pas à présent restaurer votre accès',
                zam: "your access to the service has already been limited earlier, so we can't restore your access now"
            },
            {
                type: 'item',
                text: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                eng: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it",
                gana: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it",
                kot: "sur ce permis de conduire, ne figurent ni la signature d'un fonctionnaire ni le cachet de la préfecture de délivrance",
                kam: "sur ce permis de conduire, ne figurent ni la signature d'un fonctionnaire ni le cachet de la préfecture de délivrance",
                zam: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it"
            }
        ],
        rus: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                rus: 'есть сомнения в подлинности удостоверения'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                rus: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                rus: 'нет отметки о категории Б в вашем водительском удостоверении'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                rus: 'недопустимое содержание фотографий'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                rus: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле'
            },
            {
                type: 'only',
                only: 'номер и ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                rus: 'срок действия водительского удостоверения истёк'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                rus: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                rus: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                rus: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения'
            },
            {
                type: 'only',
                only: 'ваше водительское удостоверение не соответствует <a href="https://taxi.yandex.ru/rabota/?utm_medium=driver.yandex#faqq">правилам сервиса</a>'
            },
            { type: 'only', only: 'это водительское удостоверение не зарегистрировано в ГИБДД' },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                rus: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                az: 'daha əvvəl xidmətə çıxış imkanınız məhdudlaşdırıldığı üçün hazırda gedişlər yerinə yetirə bilməzsiniz',
                geo: 'ადრე თქვენთვის შეზღუდული იყო სერვისთან წვდომა, ამიტომაც არ შეგვიძლია თქვენი მგზავრობასთან დაშვება',
                kgz: 'буга чейин сизге сервистин жеткиликтүүлүгү чектелген болчу, ошондуктан биз сизге сапарларга чыгууга уруксат бере албайбыз',
                uzb: 'avvalroq sizga xizmatdan foydalanish imkoniyati cheklangan edi, shuning uchun sizning buyurtmalar olishingizga ruxsat bera olmaymiz',
                est: 'sinu juurdepääs teenusele oli juba varem keelatud, mistõttu ei saa me su juurdepääsu praegu taastada',
                mda: 'anterior ți-a fost limitat accesul la serviciu, prin urmare nu îți mai putem încredința efectuarea curselor',
                slo: '',
                eng: "your access to the service has already been limited earlier, so we can't restore your access now",
                gana: "your access to the service has already been limited earlier, so we can't restore your access now",
                arm: 'նախկինում ծառայության հասանելիությունը սահմանափակվել էր ձեզ համար, ուստի հիմա չեք կարող ուղևորություններ կատարել',
                fin: 'käyttöoikeuttasi on rajoitettu jo aikaisemmin, joten emme voi palauttaa käyttöoikeuttasi nyt',
                kot: 'votre accès au service a déjà été limité auparavant, nous ne pouvons donc pas à présent restaurer votre accès',
                kam: 'votre accès au service a déjà été limité auparavant, nous ne pouvons donc pas à présent restaurer votre accès',
                zam: "your access to the service has already been limited earlier, so we can't restore your access now"
            },
            {
                type: 'item',
                text: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                rus: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                az: '',
                geo: '',
                kgz: 'бул айдоочулук күбөлүктө жооптуу кызматкердин колу же документти берген мекеменин мөөрү жок',
                uzb: '',
                est: '',
                mda: 'pe acest permis de conducere lipsește semnătura funcționarului sau ștampila instituției care a emis documentul',
                slo: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it",
                eng: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it",
                gana: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it",
                arm: 'այս վարորդական վկայականի վրա չկա փաստաթուղթը տված պաշտոնյայի ստորագրությունը կամ կնիքը',
                fin: '',
                kot: "sur ce permis de conduire, ne figurent ni la signature d'un fonctionnaire ni le cachet de la préfecture de délivrance",
                kam: "sur ce permis de conduire, ne figurent ni la signature d'un fonctionnaire ni le cachet de la préfecture de délivrance",
                zam: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it"
            }
        ],
        az: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                az: 'vəsiqənin orijinallığı ilə bağlı şübhə var'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                az: 'bu vəsiqə ilə sizin avtomobili idarə etmək hüququnuzda şübhə var'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                az: 'vəsiqənizdə B kateqoriyası ilə bağlı qeyd yoxdur'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                az: 'fotoşəklin məzmunu yolverilməzdir'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                az: 'Şəxsiyyət vəsiqəsində qeyd olunan nömrə və ad, soyad, ata adı taksi parkındakı profilinizdə qeyd edilənlərdən fərqlidir. Profili yeniləmək üçün taksi parkına müraciət edin'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                az: 'Vəsiqədəki SAA və taksi parkı üzrə profilinizdəki nömrə üst-üstə düşmür. Profili taksi parkı yeniləyə bilər'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                az: 'vəsiqənin etibarlılıq müddəti bitib'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                az: 'fotoda vəsiqənin surəti verilib, yoxlanış üçün isə orijinal lazımdır'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                az: 'vəsiqədəki foto sizin öz fotonuza uyğun gəlmir'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                az: 'foto kompüter ekranından edilib. Yoxlamaq üçün orijinal vəsiqə lazımdır'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                az: 'daha əvvəl xidmətə çıxış imkanınız məhdudlaşdırıldığı üçün hazırda gedişlər yerinə yetirə bilməzsiniz'
            }
        ],
        geo: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                geo: 'მოწმობის ნამდვილობა საეჭვოა'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                geo: 'თქვენი უფლება ატაროთ ავტომანქანა ამ მოწმობით საეჭვოა'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                geo: 'თქვენს მოწმობაში არ არის მონიშვნა ბ კატეგორიის შესახებ'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                geo: 'ფოტოსურათების დაუშვებელი შინაარსი'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                geo: 'ნომერი, სახელი, გვარი და მამის სახელი პირადობის მოწმობასა და თქვენს ტაქსოპარკის პროფილში ერთმანეთს არ ემთხვევა. პროფილის განახლება მხოლოდ ტაქსოპარკს შეუძლია.'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                geo: 'სახელი და გვარი მოწმობასა და თქვენს ტაქსოპარკის პროფილში განსხვავებულია. პროფილის განახლებას შეძლებს ტაქსოპარკი'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                geo: 'მოწმობის მოქმედების ვადა ამოიწურა'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                geo: 'ფოტოზე მოწმობის ასლია, შემოწმებისთვის კი საჭიროა დედანი'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                geo: 'ფოტო მოწმობაზე არ შეესაბამება თქვენს მიერ გადაღებულ ფოტოსურათს'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                geo: 'ფოტო გადაღებულია კომპიუტერის ეკრანიდან. შემოწმებისთვის საჭიროა მოწმობის დედანი'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                geo: 'ადრე თქვენთვის შეზღუდული იყო სერვისთან წვდომა, ამიტომაც არ შეგვიძლია თქვენი მგზავრობასთან დაშვება'
            }
        ],
        kgz: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                kgz: 'күбөлүктүн дааналыгында шек бар'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                kgz: 'бул күбөлүк менен автомобилди айдоо укугуңуздун болгону шектүү'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                kgz: 'күбөлүгүңүздөгү Б категориясынын белгиси жок'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                kgz: 'фотосүрөттөрдүн жол берилгис мазмуну'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                kgz: 'Күбөлүктөгү номериңиз менен аты-жөнүңүз таксопарктагы профилиңиздегиге дал келбейт. Профилди таксопарк жаңырта алат'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                kgz: 'Күбөлүктөгү жана таксопарктагы сиздин профилдеги ФАА дал келбейт. Профилди таскопарк жаңырта алат'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                kgz: 'күбөлүктүн колдонуу мөөнөтү аяктаган'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                kgz: 'фотого күбөлүктүн көчүрмөсү тартылган, бирок текшерүүгө түп нускасы керек'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                kgz: 'күбөлүктөгү түшкөн фотоңузга өзүңүздүн сүрөтүңүз дал келбейт'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                kgz: 'фото компьютердин экранынан жасалган. Текшерүү үчүн күбөлүктүн түп нускасы керек'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                kgz: 'буга чейин сизге сервистин жеткиликтүүлүгү чектелген болчу, ошондуктан биз сизге сапарларга чыгууга уруксат бере албайбыз'
            },
            {
                type: 'item',
                text: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                kgz: 'бул айдоочулук күбөлүктө жооптуу кызматкердин колу же документти берген мекеменин мөөрү жок'
            }
        ],
        uzb: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                uzb: 'guvohnomaning qalbaki ekanligiga shubha bor'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                uzb: 'bu guvohnoma bilan avtomobilni boshqarish huquqiga ega ekanligingiz bo‘yicha shubha mavjud'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                uzb: 'guvohnomangizda B toifasi belgilanmagan'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                uzb: 'fotosuratlarda berilishi mumkin bo‘lgan narsalar'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                uzb: 'Haydovchilik guvohnomasidagi raqam va ism-familiya taksoparkdagi profilingizga mos kelmayapti. Profilingizni taksopark yangilashi mumkin.'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                uzb: 'haydovchilik guvohnomangizdagi FISH taksi saroyidagi profilingizda berilgan raqamdan farq qilmoqda. Profilni taksi saroyi yangilashi mumkin'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                uzb: 'guvohnomaning amal qilish muddati tugagan'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                uzb: 'fotosuratda guvohnoma nusxasi berilgan, tekshiruv uchun uning asl nusxasi zarur'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                uzb: 'guvohnomadagi surat bilan sizning fotosuratingiz mos kelmayapti'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                uzb: 'fotosurat ekran kompyuteridan qilingan. Tekshirish uchun guvohnomaning asl nusxasi kerak'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                uzb: 'avvalroq sizga xizmatdan foydalanish imkoniyati cheklangan edi, shuning uchun sizning buyurtmalar olishingizga ruxsat bera olmaymiz'
            }
        ],
        est: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                est: 'juhiloa ehtsuse suhtes on kahtlusi'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                est: 'teie õiguse suhtes autot juhtida selle juhiloaga on kahtlusi'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                est: 'teie juhiloal pole märget B-kategooria kohta'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                est: 'fotode sisu on sobimatu'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные',
                est: 'juhiloal esitatud number ja Teie taksofirma profiili number on erinevad. Profiili saab uuendada taksofirma'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                est: 'juhiloal esitatud perekonna-, ees- ja isanimi ja Teie taksofirma profiili andmed on erinevad. Profiili saab uuendada taksofirma'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                est: 'juhiloa kehtivusaeg on lõppenud'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                est: 'fotol on juhiloa koopia, aga kinnitamiseks on nõutav originaal'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                est: 'juhiloal olev foto ei vasta teist tehtud fotole'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                est: 'foto on kopeeritud arvutiekraanilt. Kinnitamiseks on nõutav juhiloa originaal'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                est: 'sinu juurdepääs teenusele oli juba varem keelatud, mistõttu ei saa me su juurdepääsu praegu taastada'
            }
        ],
        mda: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                mda: 'există îndoieli cu privire la autenticitatea permisului'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                mda: 'există îndoieli privind dreptul dumneavoastră de a conduce automobilul cu acest permis'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                mda: 'în permisul dumneavoastră de conducere nu există categoria B'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                mda: "conținutul fotografiilor este nevalid'"
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные',
                mda: 'numărul de pe permis și din profilul dumneavoastră de la compania de taxiuri nu se potrivesc. Compania de taxiuri poate actualiza profilul'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                mda: 'Numele complet de pe permis și din profilul dumneavoastră de la compania de taxiuri nu se potrivesc. Compania de taxiuri poate actualiza profilul'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                mda: 'termenul de valabilitate al permisului este depășit'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                mda: 'în fotografie este o copie a permisului, iar pentru verificare este nevoie de original'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                mda: 'fotografia din permis nu se potrivește cu fotografia dumneavoastră'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                mda: 'fotografie realizată de pe ecranul computerului. Pentru verificare este nevoie de permisul original'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                mda: 'anterior ți-a fost limitat accesul la serviciu, prin urmare nu îți mai putem încredința efectuarea curselor'
            },
            {
                type: 'item',
                text: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                mda: 'pe acest permis de conducere lipsește semnătura funcționarului sau ștampila instituției care a emis documentul'
            }
        ],
        slo: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                slo: 'There are doubts about the authenticity of this driver`s license'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                slo: 'There are doubts about whether this license gives you the right to drive a car'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                slo: 'Your license does not have a Category B mark'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                slo: 'Unacceptable photo content'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные',
                slo: 'The number of your license and the one entered in your profile are not the same. The taxi company can edit your profile'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                slo: 'Name on the license and in your taxi company profile are not the same. The taxi company can edit your profile'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                slo: 'Your license is expired'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                slo: 'Photo taken of a copy of the license. We need to check the original'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                slo: 'The photo on the license does not match your photo'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                slo: 'Photo taken from computer screen. We need to check the original'
            },
            {
                type: 'item',
                text: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                slo: "this driver's license doesn't have the signature of an official or the seal of the agency that issued it"
            }
        ],
        arm: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                arm: 'կան կասկածներ վկայականի իսկության վերաբերյալ'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                arm: 'կան կասկածներ այս վկայականով մեքենա վարելու Ձեր իրավունքի վերաբերյալ'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                arm: 'Ձեր վկայականում բացակայում է B կարգի վերաբերյալ նշումը'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                arm: 'լուսանկարների անթույլատրելի բովանդակություն'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                arm: 'Վարորդական վկայականի վրա նշված համարն ու ազգանուն-անուն-հայրանունը չեն համընկնում տաքսոպարկի ձեր անձնական էջում նշված տվյալների հետ։ Թարմացնել ձեր անձնական էջը կարող է տաքսոպարկը'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                arm: 'վկայականի վրա և տաքսոպարկի Ձեր նկարագրում նշված ԱԱՀ-ները չեն համընկնում: Պրոֆիլը կկարողանա թարմացնել տաքսոպարկը'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                arm: 'վկայականի վավերականության ժամկետը սպառվել է'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                arm: 'լուսանկարի վրա վկայականի պատճենն է, իսկ ստուգման համար անհրաժեշտ է բնօրինակը'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                arm: 'վկայականի լուսանկարը չի համապատասխանում Ձեր լուսանկարին'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                arm: 'լուսանկարը ստացվել է համակարգչի էկրանից: Ստուգման համար անհրաժեշտ է վկայականի բնօրինակը'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                arm: 'նախկինում ծառայության հասանելիությունը սահմանափակվել էր ձեզ համար, ուստի հիմա չեք կարող ուղևորություններ կատարել'
            },
            {
                type: 'item',
                text: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                arm: 'այս վարորդական վկայականի վրա չկա փաստաթուղթը տված պաշտոնյայի ստորագրությունը կամ կնիքը'
            }
        ],
        fin: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                fin: 'ajokorttia epäillään väärennökseksi'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                fin: 'ajokortistasi puuttuu B-ajoneuvoluokan kuljettamisoikeus'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                fin: 'virheellinen kuvasisältö'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                fin: 'Ajokortissasi ja yhtiösi profiilissa olevat koko nimi ja numero eivät täsmää. Taksiyhtiö voi päivittää profiilisi.'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                fin: 'Ajokortissa ilmoitettu nimi ja profiilissasi ilmoitettu nimi eivät vastaa toisiaan. Voit päivittää profiilisi täällä:Gyldenintie 9, 00200 Helsinki'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                fin: 'ajokortti vanhentunut'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                fin: 'valokuvassa näkyy kopio ajokortista, mutta vahvistuksen suorittamiseksi kuvassa tulee näkyä alkuperäinen ajokortti'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                fin: 'ajokortissasi oleva valokuva ei vastaa omaa valokuvaasi'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                fin: 'valokuva on otettu tietokoneen näytöstä. Vahvistuksen suorittamiseksi kuva tulee ottaa suoraan ajokortista'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                fin: 'käyttöoikeuttasi on rajoitettu jo aikaisemmin, joten emme voi palauttaa käyttöoikeuttasi nyt'
            }
        ],
        rou: [
            { type: 'label', label: 'Айди Карта', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности айди-карты',
                rou: 'există suspiciuni cu privire la autenticitatea cărții de identitate'
            },
            { type: 'label', label: 'Водительское удостоверение', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                rou: 'există suspiciuni cu privire la autenticitatea permisului de conducere'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению',
                rou: 'există suspiciuni cu privire la dreptul dvs. de a conduce un automobil în baza acestui permis de conducere'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                rou: 'conținutul fotografiilor este inacceptabil'
            },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                rou: 'Numărul și numele din permisul de conducere nu coincid cu cele din profilul tău la compania de taximetrie. Datele din profil pot fi actualizate de compania de taximetrie'
            },
            { type: 'label', label: 'Справка о судимости', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности справки',
                rou: 'există suspiciuni cu privire la autenticitatea certificatului de cazier judiciar'
            },
            { type: 'label', label: 'История штрафов', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности истории штрафов',
                rou: 'există suspiciuni cu privire la autenticitatea istoricului de sancțiuni'
            },
            { type: 'label', label: 'Профессиональный сертификат водителя', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности сертификата',
                rou: 'există suspiciuni cu privire la autenticitatea certificatului de înmatriculare'
            }
        ],
        srb: [
            { type: 'label', label: 'ВУ', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                srb: 'postoje sumnje u autentičnost dozvole'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                srb: 'nedozvoljeni sadržaj fotografija'
            },
            {
                type: 'item',
                text: 'срок действия удостоверения истёк',
                srb: 'rok važenja dozvole je istekao'
            },
            {
                type: 'item',
                text: 'фото в удостоверении не соответствует вашей фотографии себя',
                srb: 'fotografija u dozvoli ne odgovara vašoj ličnoj fotografiji'
            },
            {
                type: 'item',
                text: 'отсутствует отметка о категории Б в вашем удостоверении',
                srb: 'ne postoji oznaka kategorije B u vašoj dozvoli'
            },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
                srb: 'fotografija je napravljena sa ekrana kompjutera. Za proveru je potreban original dozvole'
            },
            {
                type: 'item',
                text: 'на фото копия удостоверения, а для проверки нужен оригинал',
                srb: 'na fotografiji je kopija dozvole, a za proveru je potreban original'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению',
                srb: 'postoje sumnje u vaše pravo da vozite automobil sa ovom dozvolom'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                srb: 'vaš pristup usluzi je ranije već ograničen i zato sada ne možemo da vam ga vratimo'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                srb: 'Ime i prezime i broj u vašoj vozačkoj dozvoli i na vašem profilu u taksi udruženju se ne poklapaju. Taksi udruženje može da ažurira vaš profil'
            },
            {
                type: 'item',
                text: 'ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                srb: 'Prezime, ime, ime po ocu na dozvoli i u vašem profilu kod taksi parka se ne poklapaju. Taksi park može da ažurira stari profil'
            },
            { type: 'label', label: 'Лицензия', th: true },
            {
                type: 'item',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
                srb: 'fotografija je snimljena sa ekrana uređaja. Za proveru je potrebna fotografija originala'
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности сертификата',
                srb: 'postoje sumnje u autentičnost potvrde'
            },
            { type: 'item', text: 'срок действия лицензии истек', srb: 'taksi dozvola je istekla' },
            {
                type: 'item',
                text: 'на фотографии скан или копия лицензии. Для проверки нужно фото оригинала',
                srb: 'na fotografiji je sken ili kopija taksi dozvole. Za proveru je potrebna fotografija originala'
            }
        ],
        lta: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                lta: 'ir šaubas par apliecības autentiskumu'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                lta: 'ir šaubas par jūsu tiesībām vadīt automobili, spriežot pēc šīs apliecības'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                lta: 'jūsu apliecībā trūkst atzīmes par “B” kategoriju'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                lta: 'nepieņemams fotogrāfiju saturs'
            },
            { type: 'label', label: 'Несовпадение данных', th: true },
            {
                type: 'item',
                text: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные',
                lta: 'numurs apliecībā un jūsu profilā taksometru uzņēmumā nesakrīt. Taksometru uzņēmums varēs atjaunināt profilu'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                lta: 'Vārds, uzvārds apliecībā un jūsu profilā taksometru uzņēmumā nesakrīt. Taksometru uzņēmums varēs atjaunināt profilu'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                lta: 'apliecības derīguma termiņš ir beidzies'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                lta: 'fotogrāfijā ir apliecības kopija, bet pārbaudei ir nepieciešams oriģināls'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                lta: 'fotogrāfija apliecībā neatbilst jūsu fotogrāfijai'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                lta: 'fotogrāfija ir uzņemta no datora ekrāna. Pārbaudei ir nepieciešams apliecības oriģināls'
            },
            { type: 'label', label: 'Лицензия на такси', th: true },
            {
                type: 'item',
                text: 'срок действия разрешения ATD истек',
                lta: 'ATD atļaujas derīguma termiņš ir beidzies'
            },
            {
                type: 'item',
                text: 'разрешение ATD недействительно или отсутствует на сайте проверки',
                lta: 'ATD atļauja nav derīga'
            },
            {
                type: 'item',
                text: 'данные на разрешении ATD должны соответствовать данным, указанным на ВУ',
                lta: 'datiem, kas norādīti ATD atļaujā, jāsakrīt ar vadītāja apliecībā norādītajiem'
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности разрешения ATD',
                lta: 'ir aizdomas par to, ka ATD atļauja varētu būt viltota'
            }
        ],
        isr: [
            { type: 'label', label: 'ОБЩИЕ', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                isr: 'לא הצלחנו לבדוק אם רישיון הנהיגה מזויף או לא'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению',
                isr: 'אנחנו לא בטוחים אם מותר לך לנהוג במונית עם רישיון הנהיגה הזה'
            },
            { type: 'item', text: 'недопустимое содержание фотографий', isr: 'תוכן התמונות לא חוקי' },
            {
                type: 'item',
                text: 'отсутствует отметка о категории В в вашем удостоверении',
                isr: 'ברישיון הנהיגה שלך חסרה דרגה B'
            },
            { type: 'item', text: 'срок действия удостоверения истёк', isr: 'פג התוקף של רישיון הנהיגה' },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                isr: 'אין התאמה בין המספר והשם המלא ברישיון הנהיגה למספר ולשם המלא בפרופיל שלך בתחנת המוניות. תחנת המוניות יכולה לעדכן את הפרטים בפרופיל שלך.'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                isr: 'השם המלא ברישיון הנהיגה שונה מהשם שבפרופיל בתחנת המוניות. נציג של מרכז הנהגים יכול לעדכן את הפרופיל שלך'
            },
            { type: 'label', label: 'ФРОД', th: true },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
                isr: 'זו תמונה של מסך מחשב. כדי לאמת את הרישיון צריך תמונה של רישיון הנהיגה המקורי'
            },
            {
                type: 'item',
                text: 'на фото копия удостоверения, а для проверки нужен оригинал',
                isr: 'בתמונה רואים עותק של רישיון הנהיגה. אנחנו צריכים את הרישיון המקורי'
            },
            {
                type: 'item',
                text: 'фото в удостоверении не соответствует вашей фотографии себя',
                isr: 'התמונה ברישיון הנהיגה שונה מהתמונה שלך'
            },
            { type: 'label', label: 'СТРАХОВКА', th: true },
            { type: 'item', text: 'срок действия страховки истек', isr: 'פג התוקף של הביטוח' },
            {
                type: 'item',
                text: 'есть сомнения в подлинности страховки',
                isr: 'לא הצלחנו לבדוק אם הביטוח מזויף או לא'
            }
        ],
        ltu: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                ltu: 'Yra abejonių dėl pažymėjimo tikrumų'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению',
                ltu: 'Abejojama jūsų teise vairuoti automobilį pagal šį pažymėjimą'
            },
            {
                type: 'item',
                text: 'нет отметки о категории Б в вашем водительском удостоверении',
                ltu: 'Jūsų pažymėjime nėra žymos apie „B“ kategoriją'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                ltu: 'Neleistinas nuotraukų turinys'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные',
                ltu: 'Numeris pažymėjime ir jūsų profilis automobilių parke nesutampa. Atnaujinti profilį galės automobilių parkas'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                ltu: 'Vardas ir pavardė pažymėjime ir jūsų automobilių parko profilyje nesutampa. Atnaujinti profilį galės automobilių parkas'
            },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                ltu: 'Jūsų pažymėjimo galiojimo terminas baigėsi'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                ltu: 'Nuotraukoje – pažymėjimo kopija, o patikrai atlikti būtinas originalas'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                ltu: 'Nuotrauka pažymėjime neatitinka jūsų asmeninės nuotraukos'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                ltu: 'Nuotrauka padaryta iš kompiuterio ekrano. Patikrai atlikti būtinas pažymėjimo originalas'
            },
            { type: 'label', label: 'Сертификат', th: true },
            {
                type: 'item',
                text: 'срок действия сертификата истек',
                ltu: 'baigėsi individualios veiklos pažymos galiojimo terminas'
            },
            {
                type: 'item',
                text: 'данные на сертификате должны соответствовать данным, указанным на ВУ',
                ltu: 'individualios veiklos pažymoje pateikti duomenys turi sutapti su duomenimis vairuotojo pažymėjime'
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности сертификата',
                ltu: 'yra abejonių dėl individualios veiklos pažymos tikrumo'
            },
            {
                type: 'item',
                text: 'данные сертификата невозможно проверить',
                ltu: 'Neįmanoma patikrinti individualios veiklos pažymoje pateiktų duomenų'
            }
        ],
        nor: [
            { type: 'label', label: 'СТАРЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                nor: 'kan ikke godkjenne om kortet er korrekt'
            },
            { type: 'item', text: 'недопустимое содержание фотографий', nor: 'Ikke gyldg foto-innhold' },
            { type: 'label', label: 'НОВЫЕ ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия водительского удостоверения истёк',
                nor: 'førerkortet har gått ut på dato'
            },
            {
                type: 'item',
                text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
                nor: 'foto er tatt av en kopi av førerkortet. Vi trenger å sjekke det originale kortet'
            },
            {
                type: 'item',
                text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
                nor: 'foto på førerkortet stemmer ikke med foto av deg selv'
            },
            {
                type: 'item',
                text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
                nor: 'bildet er tatt av en skjerm. Vi trenger bilde av det originale førerkortet ditt'
            },
            {
                type: 'item',
                text: 'у вас не хватает водительского стажа. Для выполнения заказов общий стаж должен быть не менее двух лет',
                nor: 'du har ikke lang nok erfaring. Du trenger minst 3 års erfaring for å motta oppdrag'
            },
            { type: 'label', label: 'Несовпадение данных', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                nor: 'Nummeret og det fullstendige navnet samsvarer ikke på førerkortet og profilen din i taxiselskapet. Taxiselskapet kan oppdatere profilen din.'
            },
            {
                type: 'item',
                text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
                nor: 'ditt fulle navn på førerkortet stemmer ikke med det som er lagt inn i taxi-profilen din. Vennligst send forespørselen din på e-post:'
            },
            { type: 'label', label: 'Лицензия на такси', th: true },
            {
                type: 'item',
                text: 'на фотографии скан или копия лицензии . Для проверки нужно фото оригинала',
                nor: 'bildet er tatt av en kopi. Vi du må ta bildet av den originale'
            },
            {
                type: 'item',
                text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
                nor: 'bildet er tatt av en skjerm, vi må se bilde av den originale'
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности сертификата',
                nor: 'kan ikke godkjenne om løyvedokument er ekte'
            },
            {
                type: 'item',
                text: 'срок действия лицензии истек',
                nor: 'løyvedokument har gått ut på dato'
            }
        ],
        bol: [
            { type: 'label', label: 'ЧС', th: true },
            {
                type: 'item',
                text: 'фото в удостоверении не соответствует вашей фотографии себя',
                bol: 'la foto que aparece en la licencia de conducir no coincide con tu foto'
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                bol: 'pensamos que la licencia de conducir puede no ser auténtica'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                bol: 'el contenido de la foto no es válido'
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению',
                bol: 'pensamos que quizás no tengas permiso para conducir con esta licencia'
            },
            {
                type: 'item',
                text: 'срок действия удостоверения истёк',
                bol: 'la licencia de conducir está vencida'
            },
            {
                type: 'item',
                text: 'отсутствует отметка о категории P,A,B,C в вашем удостоверении',
                bol: 'la licencia de conducir no indica categoría P, A, B o C'
            },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
                bol: 'la foto se tomó de la pantalla de una computadora.. La verificación requiere la licencia de conducir original'
            },
            {
                type: 'item',
                text: 'на фото копия удостоверения, а для проверки нужен оригинал',
                bol: 'la foto muestra una copia de la licencia de conducir, pero la verificación requiere la original'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                bol: 'restringimos tu acceso al servicio con anterioridad, así que ahora no puedes completar pedidos'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                bol: 'El número y el nombre completo que aparecen en la licencia de conducir y en tu perfil de la empresa de taxis no coinciden. La empresa de taxis puede actualizar tu perfil.'
            },
            {
                type: 'item',
                text: 'ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                bol: 'el nombre completo en tu licencia de conducir no coincide con el que aparece en tu perfil de la empresa de taxis. La empresa de taxis puede actualizar tu perfil'
            }
        ],
        kongo: [
            { type: 'label', label: 'ЧС', th: true },
            {
                type: 'item',
                text: 'срок действия удостоверения истёк',
                kongo: 'la date de validité du permis de conduire a expiré'
            },
            {
                type: 'item',
                text: 'фото в удостоверении не соответствует вашей фотографии себя',
                kongo: 'la photo sur le permis de conduire ne coïncide pas à votre photo de vous'
            },
            {
                type: 'item',
                text: 'отсутствует отметка о категории Б в вашем удостоверении',
                kongo: 'il n’existe aucune indication de la catégorie B sur votre permis de conduire'
            },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
                kongo: "la photo a été prise à partir de l'écran de l'ordinateur. Pour la vérification, l’original du permis de conduire est nécessaire"
            },
            {
                type: 'item',
                text: 'на фото копия удостоверения, а для проверки нужен оригинал',
                kongo: 'la photo représente la copie du permis de conduire, mais pour la vérification, l’original est nécessaire'
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                kongo: "un doute subsiste quant à l'authenticité du permis de conduire"
            },
            {
                type: 'item',
                text: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению',
                kongo: 'un doute subsiste quant à votre droit de conduire un véhicule avec ce permis de conduire'
            },
            {
                type: 'item',
                text: 'на этом водительском удостоверении нет подписи должностного лица или печати ведомства, выдавшего документ',
                kongo: "sur ce permis de conduire, ne figurent ni la signature d'un fonctionnaire ni le cachet de la préfecture de délivrance"
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                kongo: 'contenu invalide des photos'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                kongo: 'votre accès au service a déjà été limité auparavant, nous ne pouvons donc pas à présent restaurer votre accès'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                kongo: 'Le numéro et le nom complet figurant sur le permis de conduire sont différents de ceux enregistrés dans votre profil de la compagnie de taxis. La compagnie de taxi peut mettre à jour votre profil.'
            },
            {
                type: 'item',
                text: 'ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                kongo: 'Le nom, le prénom et le patronyme du permis de conduire et ceux de votre profil du gestionnaire de taxi ne coïncident pas. Le gestionnaire de taxi peut actualiser le profil'
            }
        ],
        ang: [
            { type: 'label', label: 'ЧС', th: true },
            {
                type: 'item',
                text: 'фото в удостоверении не соответствует вашей фотографии себя',
                ang: 'a fotografia da carta de condução não corresponde à tua fotografia'
            },
            {
                type: 'item',
                text: 'есть сомнения в подлинности удостоверения',
                ang: 'há dúvidas sobre a autenticidade da carta de condução'
            },
            {
                type: 'item',
                text: 'недопустимое содержание фотографий',
                ang: 'conteúdo da fotografia inválido'
            },
            {
                type: 'item',
                text: 'срок действия удостоверения истёк',
                ang: 'a carta de condução expirou'
            },
            {
                type: 'item',
                text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
                ang: 'a fotografia foi tirada a partir de um ecrã de computador. A verificação exige a carta de condução original'
            },
            {
                type: 'item',
                text: 'на фото копия удостоверения, а для проверки нужен оригинал',
                ang: 'a fotografia apresenta uma cópia da carta de condução, mas a verificação exige a original'
            },
            {
                type: 'item',
                text: 'ранее вам был ограничен доступ к сервису, поэтому сейчас вы не можете выполнять заказы',
                ang: 'o teu acesso ao serviço foi restringido, por isso não podes completar pedidos agora'
            },
            { type: 'label', label: 'НЕСОВПАДЕНИЕ ОБЩЕЕ', th: true },
            {
                type: 'item',
                text: 'Номер и ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                ang: 'O número e o nome completo apresentados na carta de condução e no seu perfil na empresa de táxis não correspondem. A empresa de táxis pode actualizar o seu perfil'
            },
            {
                type: 'item',
                text: 'ФИО на удостоверении и в вашем профиле в таксопарке не совпадают. Обновить профиль сможет таксопарк',
                ang: 'o nome completo na carta de condução não corresponde ao nome completo no teu perfil na empresa de táxis. A empresa de táxis pode actualizar o teu perfil'
            }
        ]
    },
    injection: {
        block: {
            mda: [
                { type: 'label', label: 'Лицензия', th: true },
                {
                    type: 'item',
                    text: 'данные в лицензии не совпадают с данными в карточке водителя',
                    mda: 'datele din certificatul de competență profesională nu coincid cu datele din fișa șoferului'
                },
                {
                    type: 'item',
                    text: 'данные на фото сложно прочитать, так как лицензия пришла в негодность',
                    mda: 'datele din fotografie nu sunt lizibile, deoarece certificatul de competență profesională este deteriorat'
                },
                {
                    type: 'item',
                    text: 'в кадре нет фотографии вашей лицензии',
                    mda: 'fotografia certificatului tău de competență profesională lipsește din cadru'
                },
                {
                    type: 'item',
                    text: 'нет фотографии одной из сторон лицензии',
                    mda: 'lipsește fotografia unei părți a certificatului de competență profesională'
                },
                {
                    type: 'item',
                    text: 'фотография лицензии нечёткая. Выберите хороший ракурс и освещение',
                    mda: 'fotografia certificatului de competență profesională nu este clară. Găsește un loc bine iluminat și alege un unghi potrivit'
                },
                {
                    type: 'item',
                    text: 'лицензия не полностью попала в кадр или ее фотография обрезана',
                    mda: 'certificatul de competență profesională nu a intrat complet în cadru sau fotografia a fost trunchiată'
                }
            ],
            zam: [
                {
                    type: 'item',
                    text: 'ваше фото с удостоверением получилось нечётким',
                    zam: 'your photo with your license is blurry'
                }
            ],
            eng: [
                { type: 'label', label: 'Сертификаты ОАЭ', th: true },
                {
                    type: 'item',
                    text: 'данные на фото сложно прочитать, так как лицензия пришла в негодность',
                    eng: 'Details in the photo are hard to read because the license is in poor condition'
                },
                {
                    type: 'item',
                    text: 'данные в лицензии не совпадают с данными в карточке водителя',
                    eng: "The license information does not match the driver's card info"
                },
                {
                    type: 'item',
                    text: 'в кадре нет фотографии вашей лицензии',
                    eng: 'The photo of your license is not in frame'
                },
                {
                    type: 'item',
                    text: 'нет фотографии одной из сторон лицензии',
                    eng: 'No photo of one side of the license'
                },
                {
                    type: 'item',
                    text: 'фотография лицензии нечёткая. Выберите хороший ракурс и освещение',
                    eng: 'The photo of the license is not clear. Select a better angle and lighting'
                },
                {
                    type: 'item',
                    text: 'лицензия не полностью попала в кадр или ее фотография обрезана',
                    eng: 'The license is not fully in frame, or the photo of it is cropped'
                }
            ],
            kgz: [
                {
                    type: 'item',
                    text: 'Данные на фотографии сложно прочитать — водительское удостоверение в плохом состоянии. Сделайте другое фото с двумя документами — ВУ, паспортом или ID-картой.',
                    kgz: 'Сүрөттөгү маалыматтарды окуу татаал болуп жатат — айдоочулук күбөлүктүн абалы начар. Эки документти чогуу кармап — айдоочулук күбөлүктү, паспорт же ID-картаны бет жагын камерага каратып сүрөткө түшүңүз.'
                }
            ]
        },
        blacklist: {
            mda: [
                { type: 'label', label: 'Лицензия', th: true },
                {
                    type: 'item',
                    text: 'на фотографии скан или копия лицензии . Для проверки нужно фото оригинала',
                    mda: 'pe fotografie este o copie scanată sau xeroxată a certificatului de competență profesională. Pentru verificare este necesară fotografia documentului original'
                },
                {
                    type: 'item',
                    text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
                    mda: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original'
                },
                {
                    type: 'item',
                    text: 'есть сомнения в подлинности сертификата',
                    mda: 'există suspiciuni cu privire la autenticitatea certificatului'
                },
                {
                    type: 'item',
                    text: 'срок действия лицензии истек',
                    mda: 'termenul de valabilitate a certificatului de competență profesională a expirat'
                }
            ],
            eng: [
                { type: 'label', label: 'Сертификаты ОАЭ', th: true },
                {
                    type: 'item',
                    text: 'на фотографии скан или копия лицензии . Для проверки нужно фото оригинала',
                    eng: 'The photo is of a scan or copy of the license. A photo of the original license is needed for verification'
                },
                {
                    type: 'item',
                    text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
                    eng: 'The photo was taken from a screenshot. A photo of the original license is needed for verification'
                },
                {
                    type: 'item',
                    text: 'есть сомнения в подлинности сертификата',
                    eng: "The certificate's authenticity is in doubt"
                },
                {
                    type: 'item',
                    text: 'срок действия лицензии истек',
                    eng: 'The license has expired'
                }
            ],
            kongo: [
                { type: 'label', label: 'СЕНЕГАЛ', th: true },
                {
                    type: 'item',
                    text: 'у вас не хватает водительского стажа. Для выполнения заказов общий стаж должен быть не менее трёх лет',
                    kongo: "vous n'avez pas assez d'expérience de conduite. Pour exécuter des commandes, la durée totale de conduite doit être d'au moins trois ans"
                }
            ]
        }
    }
};
const countries = {
    rus: 'РФ',
    az: 'Азербайджан',
    geo: 'Грузия',
    kgz: 'Киргизия',
    uzb: 'Узбекистан',
    ltu: 'Литва',
    est: 'Эстония',
    mda: 'Румыния/Молдова',
    slo: 'Словения',
    eng: 'Англия/ОАЭ',
    arm: 'Армения',
    rou: 'Бухарест',
    srb: 'Сербия',
    lta: 'Латвия',
    isr: 'Израиль',
    fin: 'Финляндия',
    nor: 'Норвегия',
    kot: "Кот-д'Ивуар",
    kam: 'Камерун',
    gana: 'Гана',
    zam: 'Замбия',
    bol: 'Боливия',
    kongo: 'Конго/СЕНЕГАЛ',
    ang: 'Ангола'
};
const citiesDkvu = {
    ...cities,
    mda: ['Кишинёв'],
    rou: ['Бухарест'],
    uae: [],
    eng: ['Дубай', 'Кейптаун', 'Йоханнесбург', 'Дурбан']
};
const config = {
    templates,
    countries,
    cities: citiesDkvu
};

;// CONCATENATED MODULE: ./src/Configs/passport/Templates.config.ts

const Templates_config_templates = {
    block: {
        default: [],
        rus: [
            { type: 'label', label: 'Разворот фото', th: true },
            {
                type: 'item',
                rus: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться',
                text: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                rus: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться',
                text: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                rus: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать',
                text: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать'
            },
            {
                type: 'item',
                rus: 'паспорт не полностью попал в кадр',
                text: 'паспорт не полностью попал в кадр'
            },
            { type: 'item', rus: 'на фото нет нужного документа', text: 'на фото нет нужного документа' },
            {
                type: 'item',
                rus: 'нет фотографий документа из запрашиваемого списка',
                text: 'нет фотографий документа из запрашиваемого списка'
            },
            {
                type: 'item',
                rus: 'нужны фото открытого документа с нужными страницами',
                text: 'нужны фото открытого документа с нужными страницами'
            },
            {
                type: 'item',
                rus: 'нужны фото титульной страницы (на ней ваше фото) и регистрации',
                text: 'нужны фото титульной страницы (на ней ваше фото) и регистрации'
            },
            {
                type: 'item',
                rus: 'на фото не все страницы паспорта. Для проверки нужны фото титульной страницы и регистрации',
                text: 'на фото не все страницы паспорта. Для проверки нужны фото титульной страницы и регистрации'
            },
            {
                type: 'item',
                rus: 'данные на фото сложно прочитать — документ пришёл в негодность',
                text: 'данные на фото сложно прочитать — документ пришёл в негодность'
            },
            {
                type: 'item',
                rus: 'ФИО в документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может таксопарк',
                text: 'ФИО в документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может таксопарк'
            },
            { type: 'item', rus: 'нет фотографий паспорта', text: 'нет фотографий паспорта' },
            { type: 'item', rus: 'срок действия документа истёк', text: 'срок действия документа истёк' },
            { type: 'label', label: 'Селфи', th: true },
            {
                type: 'item',
                rus: 'сфотографируйте себя с главным разворотом паспорта (страница с вашим фото)',
                text: 'сфотографируйте себя с главным разворотом паспорта (страница с вашим фото)'
            },
            { type: 'item', rus: 'нужно ваше фото с документом', text: 'нужно ваше фото с документом' },
            { type: 'item', rus: 'нет вашего фото с документом', text: 'нет вашего фото с документом' },
            {
                type: 'item',
                rus: 'ваше фото с паспортом плохого качества. Нужно, чтобы на фото было всё чётко видно',
                text: 'ваше фото с паспортом плохого качества. Нужно, чтобы на фото было всё чётко видно'
            },
            {
                type: 'item',
                rus: 'мы не смогли определить, совпадает ли ваше фото себя с фото в паспорте',
                text: 'мы не смогли определить, совпадает ли ваше фото себя с фото в паспорте'
            },
            {
                type: 'item',
                rus: 'ваше фото с паспортом обрезано. Нужно, чтобы лицо полностью попало в кадр',
                text: 'ваше фото с паспортом обрезано. Нужно, чтобы лицо полностью попало в кадр'
            },
            {
                type: 'item',
                rus: 'фото паспорта и ваше фото с ним обрезаны. Нужно, чтобы всё полностью попало в кадр',
                text: 'фото паспорта и ваше фото с ним обрезаны. Нужно, чтобы всё полностью попало в кадр'
            },
            {
                type: 'item',
                rus: 'фото в документе не совпадает с вашей фотографией себя',
                text: 'фото в документе не совпадает с вашей фотографией себя'
            },
            {
                type: 'item',
                rus: 'нужны фото без головных уборов и солнцезащитных очков',
                text: 'нужны фото без головных уборов и солнцезащитных очков'
            },
            {
                type: 'item',
                rus: 'на селфи с раскрытым паспортом ваше лицо должно быть видно полностью',
                text: 'на селфи с раскрытым паспортом ваше лицо должно быть видно полностью'
            },
            { type: 'label', label: 'Регистрация', th: true },
            {
                type: 'item',
                rus: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться',
                text: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                rus: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться',
                text: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                rus: 'нет фотографии регистрации/прописки',
                text: 'нет фотографии регистрации/прописки'
            },
            {
                type: 'item',
                rus: 'на фото чужая регистрация. Для проверки нужны ваши документы',
                text: 'на фото чужая регистрация. Для проверки нужны ваши документы'
            },
            {
                type: 'item',
                rus: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать',
                text: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать'
            },
            {
                type: 'item',
                rus: 'у регистрации истёк срок действия',
                text: 'у регистрации истёк срок действия'
            },
            {
                type: 'item',
                rus: 'для проверки нужна другая сторона регистрации',
                text: 'для проверки нужна другая сторона регистрации'
            },
            {
                type: 'item',
                rus: 'регистрация видна не полностью, возможно, она обрезана',
                text: 'регистрация видна не полностью, возможно, она обрезана'
            },
            { type: 'label', label: 'Общие замечания', th: true },
            { type: 'item', rus: 'нет фотографий паспорта', text: 'нет фотографий паспорта' },
            {
                type: 'item',
                rus: 'кроме вашего фото с паспортом, нужны фото титульной страницы и регистрации',
                text: 'кроме вашего фото с паспортом, нужны фото титульной страницы и регистрации'
            },
            {
                type: 'item',
                rus: 'нужны фото титульной страницы (на ней ваше фото) и регистрации',
                text: 'нужны фото титульной страницы (на ней ваше фото) и регистрации'
            },
            {
                type: 'item',
                rus: 'нет фото одной из сторон документа, а также вашего фото с документом',
                text: 'нет фото одной из сторон документа, а также вашего фото с документом'
            },
            {
                type: 'item',
                rus: 'сфотографирован экран. Для проверки нужно фото оригинала документа',
                text: 'сфотографирован экран. Для проверки нужно фото оригинала документа'
            },
            {
                type: 'item',
                rus: 'сфотографирована копия паспорта или другого документа. Для проверки нужно фото оригинала документа',
                text: 'сфотографирована копия паспорта или другого документа. Для проверки нужно фото оригинала документа'
            },
            {
                type: 'item',
                rus: 'есть сомнения в подлинности паспорта',
                text: 'есть сомнения в подлинности паспорта'
            },
            { type: 'label', label: 'РОССИЯ', th: true },
            {
                type: 'item',
                rus: 'вам нет 16 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 16',
                text: 'вам нет 16 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 16'
            },
            { type: 'label', label: 'КАЗАХСТАН', th: true },
            {
                type: 'item',
                rus: 'вам нет 18 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 18',
                text: 'вам нет 18 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 18'
            }
        ],
        uzb: [
            { type: 'label', label: 'Разворот Фото', th: true },
            {
                type: 'item',
                uzb: 'hujjat fotosurati xira yoki uzoqdan olingan. Tekshirish uchun maʼlumotlar oson oʻqiladigan boʻlishi kerak',
                text: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                uzb: 'hujjat fotosurati qorongʻi yoki haddan tashqari yorqin. Tekshirish uchun maʼlumotlar oson oʻqiladigan boʻlishi kerak',
                text: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                uzb: 'fotosuratda hujjat va uning barcha maʼlumotlari koʻrinishi kerak. Tekshiruv uchun xalal berishi mumkin boʻlgan buyumlarni olib tashlang.',
                text: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать'
            },
            {
                type: 'item',
                uzb: 'pasport kadrga toʻliq tushmagan',
                text: 'паспорт не полностью попал в кадр'
            },
            {
                type: 'item',
                uzb: 'suratdagi maʼlumotlarni oʻqish qiyin – hujjat yaroqsiz holga kelgan',
                text: 'данные на фото сложно прочитать — документ пришёл в негодность'
            },
            {
                type: 'item',
                uzb: 'Hujjatda va taksoparkdagi profilingizda koʻrsatilgan FIO bir-biriga toʻgʻri kelmayapti. Profilni taksopark yangilashi mumkin.',
                text: 'ФИО в документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может таксопарк'
            },
            { type: 'label', label: 'Селфи', th: true },
            {
                type: 'item',
                uzb: 'Oʻzingizni pasportning asosiy ichki beti (fotosuratingiz joylashgan sahifa) bilan suratga oling',
                text: 'сфотографируйте себя с главным разворотом паспорта (страница с вашим фото)'
            },
            {
                type: 'item',
                uzb: 'hujjat bilan tushgan fotosuratingiz yoʻq',
                text: 'нет вашего фото с документом'
            },
            {
                type: 'item',
                uzb: 'pasport bilan tushgan suratingizning sifati yomon. Fotosuratda hammasi aniq koʻrinishi kerak.',
                text: 'ваше фото с паспортом плохого качества. Нужно, чтобы на фото было всё чётко видно'
            },
            {
                type: 'item',
                uzb: 'suratingiz pasportingizdagi foto bilan mos kelishini tekshira olmadik',
                text: 'мы не смогли определить, совпадает ли ваше фото себя с фото в паспорте'
            },
            {
                type: 'item',
                uzb: 'pasport fotosi va u bilan tushgan suratingiz qirqilgan. Kadrga hammasi toʻliq tushgan boʻlishi kerak.',
                text: 'фото паспорта и ваше фото с ним обрезаны. Нужно, чтобы всё полностью попало в кадр'
            },
            {
                type: 'item',
                uzb: 'hujjatdagi foto oʻzingiz tushgan surat bilan mos kelmayapti',
                text: 'фото в документе не совпадает с вашей фотографией себя'
            },
            {
                type: 'item',
                uzb: 'bosh kiyimlarsiz va quyoshdan himolaydigan koʻzoynaklarsiz tushilgan surat kerak',
                text: 'нужны фото без головных уборов и солнцезащитных очков'
            },
            { type: 'label', label: 'Общие замечания', th: true },
            { type: 'item', uzb: 'pasport fosurati yoʻq', text: 'нет фотографий паспорта' },
            {
                type: 'item',
                uzb: 'roʻyxatdagi soʻralgan hujjatning surati yoʻq',
                text: 'нет фотографий документа из запрашиваемого списка'
            },
            {
                type: 'item',
                uzb: 'pasport bilan tushgan suratingizdan tashqari, bosh va roʻyxatga olinganlik sahifalarining fotosuratlari ham kerak',
                text: 'кроме вашего фото с паспортом, нужны фото титульной страницы и регистрации'
            },
            {
                type: 'item',
                uzb: 'hujjatning bir tarafi surati, shuningdek, hujjat bilan tushgan fotosuratingiz yoʻq',
                text: 'нет фото одной из сторон документа, а также вашего фото с документом'
            },
            {
                type: 'item',
                uzb: 'ekran suratga olingan. Tekshirish uchun hujjat aslining fotosi kerak',
                text: 'сфотографирован экран. Для проверки нужно фото оригинала документа'
            },
            {
                type: 'item',
                uzb: 'Pasport yoki boshqa hujjatning nusxasi suratga olingan. Tekshirish uchun hujjat aslining fotosi kerak',
                text: 'сфотографирована копия паспорта или другого документа. Для проверки нужно фото оригинала документа'
            },
            {
                type: 'item',
                uzb: 'pasportning haqiqiyligiga shubha bor',
                text: 'есть сомнения в подлинности паспорта'
            },
            {
                type: 'item',
                uzb: 'Siz 18 yoshga toʻlmagansiz – hamkorlik mumkin emas. Yetkazishlar vaqtidagi jismoniy yuklanma sizga zarar qilishi mumkin. Hechqisi yoʻq – 18 yoshga toʻlganingizda murojaat qiling',
                text: 'вам нет 18 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 18'
            }
        ],
        kgz: [
            { type: 'label', label: 'Разворот фото', th: true },
            {
                type: 'item',
                kgz: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться',
                text: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                kgz: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться',
                text: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                kgz: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать',
                text: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать'
            },
            {
                type: 'item',
                kgz: 'паспорт не полностью попал в кадр',
                text: 'паспорт не полностью попал в кадр'
            },
            { type: 'item', kgz: 'на фото нет нужного документа', text: 'на фото нет нужного документа' },
            {
                type: 'item',
                kgz: 'нет фотографий документа из запрашиваемого списка',
                text: 'нет фотографий документа из запрашиваемого списка'
            },
            {
                type: 'item',
                kgz: 'нужны фото открытого документа с нужными страницами',
                text: 'нужны фото открытого документа с нужными страницами'
            },
            {
                type: 'item',
                kgz: 'нужны фото титульной страницы (на ней ваше фото) и регистрации',
                text: 'нужны фото титульной страницы (на ней ваше фото) и регистрации'
            },
            {
                type: 'item',
                kgz: 'на фото не все страницы паспорта. Для проверки нужны фото титульной страницы и регистрации',
                text: 'на фото не все страницы паспорта. Для проверки нужны фото титульной страницы и регистрации'
            },
            {
                type: 'item',
                kgz: 'данные на фото сложно прочитать — документ пришёл в негодность',
                text: 'данные на фото сложно прочитать — документ пришёл в негодность'
            },
            {
                type: 'item',
                kgz: 'ФИО в документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может таксопарк',
                text: 'ФИО в документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может таксопарк'
            },
            { type: 'item', kgz: 'нет фотографий паспорта', text: 'нет фотографий паспорта' },
            { type: 'item', kgz: 'срок действия документа истёк', text: 'срок действия документа истёк' },
            { type: 'label', label: 'Селфи', th: true },
            {
                type: 'item',
                kgz: 'сфотографируйте себя с главным разворотом паспорта (страница с вашим фото)',
                text: 'сфотографируйте себя с главным разворотом паспорта (страница с вашим фото)'
            },
            { type: 'item', kgz: 'нужно ваше фото с документом', text: 'нужно ваше фото с документом' },
            { type: 'item', kgz: 'нет вашего фото с документом', text: 'нет вашего фото с документом' },
            {
                type: 'item',
                kgz: 'ваше фото с паспортом плохого качества. Нужно, чтобы на фото было всё чётко видно',
                text: 'ваше фото с паспортом плохого качества. Нужно, чтобы на фото было всё чётко видно'
            },
            {
                type: 'item',
                kgz: 'мы не смогли определить, совпадает ли ваше фото себя с фото в паспорте',
                text: 'мы не смогли определить, совпадает ли ваше фото себя с фото в паспорте'
            },
            {
                type: 'item',
                kgz: 'ваше фото с паспортом обрезано. Нужно, чтобы лицо полностью попало в кадр',
                text: 'ваше фото с паспортом обрезано. Нужно, чтобы лицо полностью попало в кадр'
            },
            {
                type: 'item',
                kgz: 'фото паспорта и ваше фото с ним обрезаны. Нужно, чтобы всё полностью попало в кадр',
                text: 'фото паспорта и ваше фото с ним обрезаны. Нужно, чтобы всё полностью попало в кадр'
            },
            {
                type: 'item',
                kgz: 'фото в документе не совпадает с вашей фотографией себя',
                text: 'фото в документе не совпадает с вашей фотографией себя'
            },
            {
                type: 'item',
                kgz: 'нужны фото без головных уборов и солнцезащитных очков',
                text: 'нужны фото без головных уборов и солнцезащитных очков'
            },
            {
                type: 'item',
                kgz: 'на селфи с раскрытым паспортом ваше лицо должно быть видно полностью',
                text: 'на селфи с раскрытым паспортом ваше лицо должно быть видно полностью'
            },
            { type: 'label', label: 'Регистрация', th: true },
            {
                type: 'item',
                kgz: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться',
                text: 'фото документа размыто или сделано издалека. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                kgz: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться',
                text: 'фото документа тёмное или засвечено. Для проверки данные должны хорошо читаться'
            },
            {
                type: 'item',
                kgz: 'нет фотографии регистрации/прописки',
                text: 'нет фотографии регистрации/прописки'
            },
            {
                type: 'item',
                kgz: 'на фото чужая регистрация. Для проверки нужны ваши документы',
                text: 'на фото чужая регистрация. Для проверки нужны ваши документы'
            },
            {
                type: 'item',
                kgz: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать',
                text: 'документ и все его данные должны быть полностью видны на фото. Для проверки уберите предметы, которые могут мешать'
            },
            {
                type: 'item',
                kgz: 'у регистрации истёк срок действия',
                text: 'у регистрации истёк срок действия'
            },
            {
                type: 'item',
                kgz: 'для проверки нужна другая сторона регистрации',
                text: 'для проверки нужна другая сторона регистрации'
            },
            {
                type: 'item',
                kgz: 'регистрация видна не полностью, возможно, она обрезана',
                text: 'регистрация видна не полностью, возможно, она обрезана'
            },
            { type: 'label', label: 'Общие замечания', th: true },
            { type: 'item', kgz: 'нет фотографий паспорта', text: 'нет фотографий паспорта' },
            {
                type: 'item',
                kgz: 'кроме вашего фото с паспортом, нужны фото титульной страницы и регистрации',
                text: 'кроме вашего фото с паспортом, нужны фото титульной страницы и регистрации'
            },
            {
                type: 'item',
                kgz: 'нужны фото титульной страницы (на ней ваше фото) и регистрации',
                text: 'нужны фото титульной страницы (на ней ваше фото) и регистрации'
            },
            {
                type: 'item',
                kgz: 'нет фото одной из сторон документа, а также вашего фото с документом',
                text: 'нет фото одной из сторон документа, а также вашего фото с документом'
            },
            {
                type: 'item',
                kgz: 'сфотографирован экран. Для проверки нужно фото оригинала документа',
                text: 'сфотографирован экран. Для проверки нужно фото оригинала документа'
            },
            {
                type: 'item',
                kgz: 'сфотографирована копия паспорта или другого документа. Для проверки нужно фото оригинала документа',
                text: 'сфотографирована копия паспорта или другого документа. Для проверки нужно фото оригинала документа'
            },
            {
                type: 'item',
                kgz: 'есть сомнения в подлинности паспорта',
                text: 'есть сомнения в подлинности паспорта'
            },
            { type: 'label', label: 'РОССИЯ', th: true },
            {
                type: 'item',
                kgz: 'вам нет 16 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 16',
                text: 'вам нет 16 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 16'
            },
            { type: 'label', label: 'КАЗАХСТАН', th: true },
            {
                type: 'item',
                kgz: 'вам нет 18 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 18',
                text: 'вам нет 18 лет — сотрудничества не получится. Физическая нагрузка на доставках может навредить вам. Ничего страшного — возвращайтесь, когда исполнится 18'
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
const Templates_config_countries = {
    rus: 'РФ',
    uzb: 'Узбекистан',
    kgz: 'Киргизия Шаттл'
};
const Templates_config_config = {
    templates: Templates_config_templates,
    countries: Templates_config_countries,
    cities: cities
};

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

;// CONCATENATED MODULE: ./src/other/RotateScaleBrightHistory/RotateScaleBrightHistory.logic.ts

class RotateScaleBrightHistory extends RotateScaleBrightLogic {
    constructor() {
        super(...arguments);
        this.rotateBtns = {
            rotateAfter90: this.createBtnRotate(-90),
            rotate180: this.createBtnRotate(180),
            rotate90: this.createBtnRotate(90)
        };
    }
    createBtnRotate(value) {
        const button = document.createElement('button');
        button.className = `rotate btn btn-info`;
        button.style.marginRight = '5px';
        button.style.marginBottom = '10px';
        button.setAttribute('title', `Поворот изображения ${String(value)} градусов`);
        button.textContent = String(value);
        button.value = String(value);
        button.addEventListener('click', () => this.rotateContent(value));
        return button;
    }
    initHistory(html) {
        this.init(html);
        Object.values(this.rotateBtns).forEach((btn) => this.createdHtmlElements.wrapper.prepend(btn));
    }
}
const rotateScaleBrightHistory = new RotateScaleBrightHistory();

;// CONCATENATED MODULE: ./src/other/RotateScaleBrightHistory/RotateScaleBrightHistory.ts

const html = {
    content: document.querySelector('#content'),
    photos: document.querySelector('#photos'),
    btns: document.querySelectorAll('.pull-right>button')
};
const checkThumbNumber = document.querySelector('i.check-thumb-number');
const marksParent = document.querySelector('#mkk-invite').parentElement;
const mkkInvite = document.querySelector('#mkk-invite');
const user = document.querySelector('#user').closest('.container-filters');
html.photos.before(checkThumbNumber);
html.photos.before(marksParent);
checkThumbNumber.style.bottom = '80px';
marksParent.style.top = '40px';
marksParent.style.zIndex = '99999';
user.style.zIndex = '99999';
mkkInvite.style.maxWidth = '600px';
rotateScaleBrightHistory.initHistory(html);
$(document).bind('content', function (e, params) {
    rotateScaleBrightHistory.resetContent();
});

;// CONCATENATED MODULE: ./src/Directions/history/index.ts





TranslateTemplatesHistory([config.templates, Templates_config_config.templates]);

/******/ })()
;