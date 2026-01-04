// ==UserScript==
// @name         战舰世界莱服网页汉化-资源-仓库翻译
// @namespace    https://github.com/windofxy
// @version      202503051039
// @description  战舰世界莱服网页汉化-资源
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT
// ==/UserScript==

if (!window.__localizer_warehouse_loaded__ && window.location.host === "warehouse.korabli.su") {
    window.__localizer_warehouse_loaded__ = true;
    let detect_elements = window.__localizer__.detect_elements;
    let translation = window.__localizer__.translation;
    let Localizer_Init = window.__localizer__.Localizer_Init;
    
    detect_elements.add(["#main-container .heading-row .heading-row__types", {}]);
    detect_elements.add(["#main-container .heading-row .heading-row__amount", {}]);
    detect_elements.add(["#main-container .heading-row .heading-row__price", {}]);
    detect_elements.add(["#main-container .items-table__wrap .absence-message__wrap .absence-message__title", {}]);
    detect_elements.add(["#main-container .items-table__wrap .items-table .item__inner .item__price", {}]);
    detect_elements.add(["#main-container .items-table__wrap .items-table .item__inner .item__sell .button", {}]);
    detect_elements.add([".vue-popup__content .popup_content-wrap ._header", {}]);
    detect_elements.add([".vue-popup__content .popup_content-wrap .popup-sale-item__info ._heading", {}]);
    detect_elements.add([".vue-popup__content .popup_content-wrap .popup-sale-item__count ._heading", {}]);
    detect_elements.add([".vue-popup__content .popup_content-wrap ._price ._heading", {}]);
    detect_elements.add([".vue-popup__content .popup_content-wrap .popup-sale-item__total span", {}]);
    detect_elements.add([".vue-popup__content .popup_content-wrap .popup-sale-item__cant-buy p", {}]);
    detect_elements.add([".vue-popup__content .popup_content-wrap .popup-sale-item__controls .button", {}]);

    detect_elements.add([
        "#main-container .heading-row .heading-row__info span",
        {
            isReplace: true,
            translation: [
                ['Найдено: ', "找到物品："],
            ]
        }
    ]);
    detect_elements.add([
        "#main-container .main-menu .main-menu__group .group-block div",
        {
            isReplace: true,
            translation: [
                ['ВСЕ', "全部"],
                ['МОДУЛИ', "配件"],
                ['МОДЕРНИЗАЦИИ', "升级品"],
                ['СИГНАЛЫ', "信号旗"],
                ['ФЛАГИ', "旗帜"],
                ['КАМУФЛЯЖИ', "涂装"],
                ['ЭКОНОМИЧЕСКИЕ БОНУСЫ', "经济加成"],
            ]
        }
    ]);
    detect_elements.add([
        "#main-container .main-menu .main-menu__group .main-menu__group-filter .filter-title",
        {
            isReplace: true,
            translation: [
                ['Класс', "类型"],
                ['Нация', "国家"],
            ]
        }
    ]);
    detect_elements.add([
        "#main-container .main-menu .main-menu__group .main-menu__group-filter .checkbox .checkbox__text",
        {
            isReplace: true,
            translation: [
                ['Не подходит к моим кораблям', "不适用于我的战舰"],
            ]
        }
    ]);
        detect_elements.add([
        "#main-container .items-table__wrap .absence-message__wrap .absence-message__text",
        {
            isReplace: true,
            translation: [
                ['У вас', "您拥有"],
                ['модуль, но он не подходит под заданные критерии поиска.', "个配件，但均不符合搜索条件。"],
                ['модулей, но ни один из них не подходит под заданные критерии поиска.', "个配件，但均不符合搜索条件。"],
                ['модуля, но ни один из них не подходит под заданные критерии поиска.', "个配件，但均不符合搜索条件。"],
            ]
        }
    ]);

    translation.set('ТИПЫ ИМУЩЕСТВА', "物品类型");
    translation.set('В наличии', "库存");
    translation.set('Стоимость за шт.', "出售价");
    translation.set('Ничего не найдено', "未找到");
    translation.set('Модули не найдены', "未找到配件");
    translation.set('Модернизации не найдены', "未找到升级品");
    translation.set('Сигналы не найдены', "未找到信号旗");
    translation.set('Флаги не найдены', "未找到旗帜");
    translation.set('Камуфляжи не найдены', "未找到涂装");
    translation.set('Не найдено бонусов', "未找到经济加成");
    translation.set('Не может быть продано', "不可出售");
    translation.set('Продать', "出售");
    translation.set('ПРОДАТЬ', "出售");
    translation.set('ПОДТВЕРЖДЕНИЕ ПРОДАЖИ', "出售确认");
    translation.set('Тип имущества', "物品");
    translation.set('Количество', "数量");
    translation.set('Стоимость за шт.', "出售价");
    translation.set('Итого:', "合计：");
    translation.set('Редкое имущество. Может быть недоступно для покупки.', "稀有物品，可能无法再次购买。");
    translation.set('ЗАКРЫТЬ', "关闭");

    
    Localizer_Init();
}