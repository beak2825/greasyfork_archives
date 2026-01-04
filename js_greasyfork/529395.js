// ==UserScript==
// @name         战舰世界莱服网页汉化-资源-兵工厂翻译
// @namespace    https://github.com/windofxy
// @version      202503051039
// @description  战舰世界莱服网页汉化-资源-兵工厂翻译
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT
// ==/UserScript==

if (!window.__localizer_armory_loaded__ && window.location.host === "armory.korabli.su") {
    window.__localizer_armory_loaded__ = true;
    let detect_elements = window.__localizer__.detect_elements;
    let translation = window.__localizer__.translation;
    let Localizer_Init = window.__localizer__.Localizer_Init;

    detect_elements.add([".PageHeader_headerWrapper .PageHeader_delimiter .PageHeader_couponText", {}]);
    detect_elements.add([".PageHeader_headerWrapper .PageHeader_delimiter .PageHeader_goldText", {}]);
    detect_elements.add([".View_contentWrapper .TopPanel_topPanel .TopPanel_topPanelHeader .TopPanel_titleCategory", {}]);
    detect_elements.add([".View_contentWrapper .TopPanel_topPanel .TopPanel_topPanelHeader .GuideWrapper_aboutWrapper .HelperIcon_aboutLabel span", {}]);
    detect_elements.add([".View_contentWrapper .Accordion_item .Accordion_header .Accordion_title", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundle_content .RandomBundle_preTitle", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundle_content .RandomBundle_periodicBundleTitle", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundle_content .RandomBundle_contains .Contains_item span", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundle_content .RandomBundle_purchase .Price_priceFree", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundle_content .RandomBundle_purchase .Button_label", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundle_content .RandomBundle_purchase .RandomBundle_footer .Purchased_alreadyPurchasedText", {}]);
    detect_elements.add([".View_contentWrapper .CategoryFilter_presetsItems .Tag_label", {}]);
    detect_elements.add([".View_contentWrapper .TopPanel_topPanelHeader .TopPanel_title .TopPanel_subCategoryTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .Layouts_offerItem .Layouts_buttonWrapper .Button_label", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .Layouts_offerItem .Layouts_itemHeaderTitle .Layouts_entityWrapper", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .Layouts_offerItem .Layouts_itemHeaderTitle .Ship_container .ShipComplexity_text", {}]);
    detect_elements.add([".View_contentWrapper .View_layoutHeader .Dropdown_wrapper .Dropdown_label", {}]);
    detect_elements.add([".View_contentWrapper .View_layoutHeader .Dropdown_wrapper .Dropdown_popup .SortDisplay_sortItem", {}]);
    detect_elements.add([".View_contentWrapper .CategoryFilter_filterContainer .CategoryFilter_filtersHeader__title", {}]);
    detect_elements.add([".View_contentWrapper .CategoryFilter_filterContainer .CategoryFilter_filtersHeader .CategoryFilter_buttonApplyWrapper .Tag_label", {}]);
    detect_elements.add([".View_contentWrapper .CategoryFilter_filterContainer .CategoryFilter_filterContainerWrapper .Checkbox_label", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .Layouts_layoutHeader .Layouts_layoutTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .Layouts_layoutColumns .Layouts_buttonShowMoreWrapper .Button_label", {}]);
    detect_elements.add([".View_contentWrapper .View_topPanel .SubCategoryMenu_wrapper .SubCategoryMenu_categoryTitle span", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .PossibleOptionsRandomBundle_content .PossibleOptionsRandomBundle_contentTitle", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .PossibleOptionsRandomBundle_content .PossibleOptionsRandomBundle_chance", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .RandomBundleView_content .RandomBundleView_activeBundleTitle", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .SpoilerContent_content .SpoilerContent_title", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .RandomBundleView_purchase .RandomBundleView_purchasePriceTitle", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .RandomBundleView_purchase .RandomBundleView_purchaseButton .Button_label", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .RandomBundleView_purchasedWrapper .Purchased_alreadyPurchasedText", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePageHeader_headerWrapper .BundlePageHeader_preBundleTitle .ShipComplexity_text", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePageDescription_containsBlock .Contains_item .BundlePageDescription_containsTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .common_mainFeatures .common_contentBlockTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .common_contentBlock .common_contentBlockTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .common_contentBlock .common_contentBlockSubTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .common_contentBlock .FeaturesLayout_feature .FeaturesLayout_featureTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .ShipWeapons_wrapper .ShipWeapons_title", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .ShipConsumables_content .ShipConsumables_title", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePage_purchaseContent .BundlePage_purchaseBlockTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePage_purchaseContent .BundlePage_purchaseButtons .CurrencyShortageBlock_wrapper span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePage_purchaseContent .BundlePage_purchaseButtons .Button_label", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .Layouts_offerItem .Layouts_itemHeaderContent .BundleType_wrapper", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePageHeader_headerWrapper .common_preBundleTitle .Commanders_title span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePage_purchaseContent .BundlePage_purchaseButtons .FastGoldLink_link span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .BundlePageHeader_headerWrapper .BundlePageHeader_flex .BundlePageHeader_preBundleTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .CommonLayout_wrapper .CommonLayout_containsAboutTitle", {}]);
    detect_elements.add([".View_contentWrapper .RandomBundleView_container .RandomBundleView_purchase .CurrencyShortageBlock_wrapper span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .CommonLayout_wrapper .SlotLayout_rewardsContent .CommonRewardsLayout_title", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .CommonLayout_wrapper .SlotLayout_rewardsContent .CommonRewardsLayout_openPopupLink", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchasePriceTitle span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchasePriceTitle", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .Price_priceFree", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .Button_label", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .CurrencyShortageBlock_wrapper span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .Purchased_alreadyPurchasedWrapper", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .Attention_wrapper .Attention_label", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .FastGoldLink_link span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .Link_link", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_header .BundleType_wrapper", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_header .Contains_item span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_footer .SerialBundleCarouselItem_buttons .Button_label", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_footer .Price_priceFree", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_footer .Purchased_alreadyPurchasedText", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_footer .SerialBundleCarouselItem_buttonsWrapper .Attention_wrapper .Attention_label", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_footer .SerialBundleCarouselItem_buttonsWrapper .Attention_wrapper .Attention_span", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .SerialBundle_content .SerialBundleCarouselItem_content .SerialBundleCarouselItem_footer .SerialBundleCarouselItem_previewBundleNext .Link_link", {}]);
    detect_elements.add([".View_contentWrapper .View_mainContent .Layouts_offerItem .Layouts_itemsContent .Contains_item span", {}]);
    detect_elements.add(["#wows-react-tooltip-body .Tooltip_defaultTooltip .Tooltip_defaultTooltipBody .Contains_wrapper .Contains_item span", {}]);
    detect_elements.add(["#wows-react-tooltip-body .Tooltip_defaultTooltip .Tooltip_defaultTooltipBody", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_header", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .purchase_popup_buttons .Button_label", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_body .popups_purchasePopupHeader .popups_purchasePopupName", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_body .popups_purchasePopupHeader .BundleType_wrapper", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_body .SerialSequencePurchasePopup_priceTitle", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_body .popups_purchasePopupPriceTitle", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_body .SerialSequencePurchasePopup_ageRestrictionLabel", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_body .popups_ageRestrictionLabel", {}]);
    detect_elements.add([".View_popupWrapper .View_popupItemWrapper .Popup_footer .Button_label", {}]);

    detect_elements.add([
        ".PageHeader_headerWrapper .PageHeader_delimiter .PremiumAccountLink_accountPremiumText",
        {
            isReplace: true,
            translation: [
                [/(.*) д (.*) ч/g, "$1 天 $2 小时"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .CategoryFilter_filterContainer .CategoryFilter_filterContainerWrapper .CategoryFilter_filterColumnTitle",
        {
            isReplace: true,
            translation: [
                ['Уровень', "等级"],
                ['Класс', "类型"],
                ['Нация', "国家"],
                ['Сложность', "上手难度"],
                ['Ресурс', "资源"],
                ['Скидка', "折扣"],
                ['Редкость', "稀有度"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .CategoryFilter_filterContainer .CategoryFilter_filterContainerWrapper .CategoryFilter_rarityWrapper div",
        {
            isReplace: true,
            translation: [
                ['Особые', "特别"],
                ['Редкие', "稀有"],
                ['Легендарные', "传奇"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .RandomBundleView_container .RandomBundleTitle_title",
        {
            isReplace: true,
            translation: [
                ['Периодичный случайный набор', "周期随机礼包链"],
                ['Случайный набор', "随机礼包链"],
                ['Получено: ', "已获得："],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .RandomBundleView_container .RandomBundleView_periodicInfo span",
        {
            isReplace: true,
            translation: [
                ['Период обновления: ', "更新周期："],
                ['день', "天"],
                [/Доступен до: (.*)\.(.*)\.(.*), (.*)\./g, "有效期至：$3.$2.$1 $4"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .BundlePageHeader_headerWrapper .BundlePageHeader_preBundleTitle .BundlePageHeader_shipInfo",
        {
            isReplace: true,
            translation: [
                [/Эсминец (.*) уровня/g, "$1级驱逐舰"],
                [/Крейсер (.*) уровня/g, "$1级巡洋舰"],
                [/Линкор (.*) уровня/g, "$1级战列舰"],
                [/Авианосец (.*) уровня/g, "$1级航空母舰"],
                [/Подводная лодка (.*) уровня/g, "$1级潜艇"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .BundlePageDescription_containsBlock .Contains_item .we-asset__text",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Слот в Порту x', "船位 x"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .BundlePageHeader_headerWrapper .BundlePageHeader_flex .BundlePageHeader_preBundleTitle",
        {
            isReplace: true,
            translation: [
                [/Количество:\n(.*)/g, "数量：$1"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .BundlePageHeader_headerWrapper .BundlePageHeader_flex .BundlePageHeader_preBundleTitle .ContainerPityTimer_wrapper",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                [/До гарантированного выпадения: (.*)/g, "保底次数：$1"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .BundlePageHeader_headerWrapper .BundlePageHeader_serialChainWidget .SerialBundleTitle_title",
        {
            isReplace: true,
            translation: [
                [/Набор (.*) из (.*)/g, "第$1个礼包，共$2个"],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .Tooltip_defaultTooltip .Tooltip_defaultTooltipBody",
        {
            isReplace: true,
            translation: [
                [
                    /При открытии (.*)-го контейнера вы гарантированно найдёте награду из группы уникальных предметов, если этого не произошло после открытия (.*) контейнеров «(.*)»\./g,
                    "当开启第$1个 $3 补给箱时，若前$2个补给箱都没有获得独特物品，则保证本次一定会获得一个独特物品。"
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .CommonLayout_wrapper .CommonLayout_containsAboutSubTitle",
        {
            isReplace: true,
            translation: [
                [/Каждый контейнер «(.*)» содержит:/g, "每个 $1 集装箱都包含物品"],
                [/Каждый контейнер «(.*)» содержит один предмет\./g, "每个 $1 集装箱包含一个物品"],
                [/Каждый контейнер «(.*)» содержит один предмет из списка:/g, "每个 $1 集装箱包含列表中的一个物品"],
                [/Каждый контейнер «(.*)» содержит три предмета\./g, '每个 $1 集装箱包含三个物品'],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .CommonLayout_wrapper .SlotLayout_rewardsContent .SlotLayout_slotTitle",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["Корабль", "战舰"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .CommonLayout_wrapper .SlotLayout_rewardsContent .ValuableRewardsLayout_group .ValuableRewardsLayout_groupTitle",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                [/Корабль (.*)&nbsp;уровня/g, "$1级战舰"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .SerialBundlePage_or",
        {
            isReplace: true,
            translation: [
                ['или', "或"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .SerialBundlePage_footerContent .SerialBundlePage_purchaseColumn .SerialBundlePage_purchaseButtonWrapper .SerialBundlePurchaseButtonWrapper_or",
        {
            isReplace: true,
            translation: [
                ['или', "或"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_contentWrapper .View_mainContent .Layouts_offerItem .Layouts_itemsCount",
        {
            isReplace: true,
            translation: [
                [/(.*) В НАБОРЕ/g, "$1个物品"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_popupWrapper .View_popupItemWrapper .Popup_body .SerialSequencePurchasePopup_title",
        {
            isReplace: true,
            translation: [
                [/Наборы с (.*)-го по (.*)-й/g, "礼包$1到礼包$2"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_popupWrapper .View_popupItemWrapper .Popup_body .popups_purchasePopupHeader .popups_purchaseBundleQuantity",
        {
            isReplace: true,
            translation: [
                [/Количество: (.*)/g, "数量：$1"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_popupWrapper .View_popupItemWrapper .Popup_body .popups_purchasePopupHeader .SerialBundleTitle_title",
        {
            isReplace: true,
            translation: [
                [/Набор (.*) из (.*)/g, "第$1个礼包，共$2个"],
            ]
        }
    ]);
    detect_elements.add([
        ".View_popupWrapper .View_popupItemWrapper .Popup_body .popups_randomBundleContent .RandomBundleTitle_title",
        {
            isReplace: true,
            translation: [
                ['Периодичный случайный набор', "周期随机礼包链"],
                ['Случайный набор', "随机礼包链"],
                ['Получено: ', "已获得："],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .Tooltip_defaultTooltip .Tooltip_accountPremiumsWrapper .Tooltip_accountPremium",
        {
            isReplace: true,
            translation: [
                [
                    /Корабельный премиум аккаунт: \n(.*) дня (.*) часов/g,
                    "战舰世界高级账号：$1 天 $2 小时"
                ],
            ]
        }
    ]);
        
    translation.set('Купоны', "优惠券");
    translation.set('Купить дублоны', "购买金币");
    translation.set('РЕКОМЕНДОВАННОЕ', "推荐");
    translation.set('КОРАБЛИ', "战舰");
    translation.set('КОМАНДИРЫ', "指挥官");
    translation.set('КОНТЕЙНЕРЫ', "补给箱");
    translation.set('РАЗНОЕ', "杂项");
    translation.set('МОРСКОЕ ЕДИНСТВО', "海军社区");
    translation.set('ДУБЛОНЫ И ПРЕМИУМ', "金币与加值物品");
    translation.set('Периодичный случайный набор', "周期随机礼包链");
    translation.set('Будет доступен через:', "在以下时间后刷新：");
    translation.set('Состав набора', "礼包内容");
    translation.set('БЕСПЛАТНО', "免费");
    translation.set('БЕСПЛАТНО', "免费");
    translation.set('КУПИТЬ', "购买");
    translation.set('ПОЛУЧИТЬ', "领取");
    translation.set('ОБРАБОТКА', "处理中");
    translation.set('Рекомендованные', "推荐");
    translation.set('Уголь', "煤炭");
    translation.set('Дублоны', "金币");
    translation.set('Сталь', "钢铁");
    translation.set('Повышенная доходность', "更高收益");
    translation.set('Все корабли', "所有战舰");
    translation.set('Слоты в Порту', "船位");
    translation.set('РЕКОМЕНДОВАННЫЕ', "推荐");
    translation.set('УГОЛЬ', "煤炭");
    translation.set('ДУБЛОНЫ', "金币");
    translation.set('СТАЛЬ', "钢铁");
    translation.set('ПОВЫШЕННАЯ ДОХОДНОСТЬ', "更高收益");
    translation.set('ВСЕ КОРАБЛИ', "所有战舰");
    translation.set('СЛОТЫ В ПОРТУ', "船位");
    translation.set('Слот в Порту', "船位");
    translation.set('По умолчанию', "默认");
    translation.set('По названию', "名字");
    translation.set('По стоимости', "价格");
    translation.set('Фильтры', "筛选器");
    translation.set('Есть купон', "可用优惠券");
    translation.set('Сложность:', "上手难度：");
    translation.set('Получено', "已获得");
    translation.set('ПОЛУЧЕНО', "已获得");
    translation.set('ПОКАЗАТЬ ПОДБОРКУ', "显示更多");
    translation.set('ПОЗДРАВЛЯЕМ, ВЫ ПОЛУЧИЛИ НАБОР!', "恭喜您，您获得了一个礼包");
    translation.set('ЗАКРЫТЬ', "关闭");
    translation.set('Сбросить все', "重置所有");
    translation.set('Контейнер', "补给箱");
    translation.set('ПРЕМИУМ КОНТЕЙНЕРЫ', "高级补给箱");
    translation.set('Премиум контейнер', "高级补给箱");
    translation.set('ПЕРЕЙТИ В КАТЕГОРИЮ', "前往分类");
    translation.set('ЭКОНОМИЧЕСКИЕ БОНУСЫ', "经济加成");
    translation.set('СИГНАЛЫ', "信号旗");
    translation.set('МОДЕРНИЗАЦИИ', "升级品");
    translation.set('КАМУФЛЯЖИ', "涂装");
    translation.set('ЗНАКИ РАЗЛИЧИЯ', "个性标志");
    translation.set('Случайный набор', "随机礼包链");
    translation.set('Возможные варианты случайных наборов', "随机礼包链可能出现的内容");
    translation.set('Доступный набор', "经济型礼包");
    translation.set('Вероятность выпадения каждого отдельного набора одинаковая.', "所有内容出现的概率是相同的。");
    translation.set('Что такое периодичный случайный набор', "什么是周期随机礼包链");
    translation.set('Стоимость:', "价格：");
    translation.set('Имущество получено', "已经获得该物品");
    translation.set('Ключевые особенности корабля', "该战舰的主要特点");
    translation.set('Расширенный список особенностей', "拓展功能列表");
    translation.set('Основные отличия от кораблей того же класса и уровня', "与同级战舰的主要区别");
    translation.set('Торпеды', "鱼雷");
    translation.set('Движение', "机动性");
    translation.set('Живучесть', "生存性");
    translation.set('Главный калибр', "主炮");
    translation.set('Вспомогательный калибр', "副炮");
    translation.set('ПВО', "防空炮");
    translation.set('Маскировка и обнаружение', "隐蔽性和侦察性");
    translation.set('Вооружение', "武器");
    translation.set('Снаряжение', "消耗品");
    translation.set('Особое', "特殊");
    translation.set('Примените купон для получения скидки:', "使用优惠券以获取折扣：");
    translation.set('Не хватает:  ', "需要：")
    translation.set('Бомбардировщики', "轰炸机");
    translation.set('Штурмовики', "攻击机");
    translation.set('Торпедоносцы', "鱼雷轰炸机");
    translation.set('Топмачтовые бомбардировщики', "弹跳轰炸机");
    translation.set('Особый командир', "特别指挥官");
    translation.set('Элитный командир', "精英指挥官");
    translation.set('Редкий командир', "稀有指挥官");
    translation.set('Легендарный командир', "传奇指挥官");
    translation.set('Особый командир с 10 очками навыков', "拥有10个技能点的特别指挥官");
    translation.set('Редкий командир с 10 очками навыков', "拥有10个技能点的稀有指挥官");
    translation.set('Легендарный командир с 10 очками навыков', "拥有10个技能点的传奇指挥官");
    translation.set('Состав контейнера', "补给箱内容");
    translation.set('Количество:', "数量：");
    translation.set('Либо один предмет из списка:', "或列表中的一个物品：");
    translation.set('Полный список', "显示完整列表");
    translation.set('Перейти к доступному набору', "前往最后可购买的礼包");
    translation.set('Стоимость всех наборов:', "所有礼包的价格：");
    translation.set('Стоимость с предыдущими наборами:', "到该礼包为止所有礼包的价格：");
    translation.set('Необходимо купить предыдущий набор.', "您需要先购买前面的礼包");
    translation.set('Необходимо купить предыдущие наборы.', "您需要先购买前面的礼包");
    translation.set('О CОБЫТИИ', "关于物品");
    translation.set('Читайте подробности о текущих предложениях и другую полезную информацию', "阅读更多关于当前物品和其他有用的信息");
    translation.set('У вас уже есть этот корабль', "您已经拥有这艘战舰");
    translation.set('Корабль получен', "战舰已拥有");
    translation.set('Включить звук', "打开音乐");
    translation.set('Выключить звук', "关闭音乐");
    translation.set('Включить анимацию', "打开背景动画");
    translation.set('Выключить анимацию', "关闭背景动画");
    translation.set('Дублоны, дни Корабельного премиум аккаунта,\nкредиты и другие наборы.', "金币，战舰世界高级账号和其他组合包");
    translation.set('Купить дни Корабельного премиум аккаунта', "购买战舰世界高级账号");
    translation.set('ПОДТВЕРЖДЕНИЕ ПОКУПКИ', "购买信息");
    translation.set('СПАСИБО ЗА ПОКУПКУ!', "感谢您的购买！")
    translation.set('Я подтверждаю, что мне исполнилось 18 лет.', "我已年满18岁");

    

    

    translation.set('ЛИНКОРЫ ПАН-АЗИИ', "泛亚战列舰");
    translation.set('Линкоры Пан-Азии', "泛亚战列舰");
    translation.set('НЕФРИТОВЫЙ СЕЗОН', "翡翠季");

    

    



    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    



    

    

    

    

    

    

    

    

    

    

    Localizer_Init();
}


