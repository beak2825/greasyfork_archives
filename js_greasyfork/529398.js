// ==UserScript==
// @name         战舰世界莱服网页汉化-资源-造船厂翻译
// @namespace    https://github.com/windofxy
// @version      202503051039
// @description  战舰世界莱服网页汉化-资源
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT
// ==/UserScript==

if (!window.__localizer_dockyard_loaded__ && window.location.host === "dockyard.korabli.su") {
    window.__localizer_dockyard_loaded__ = true;
    let detect_elements = window.__localizer__.detect_elements;
    let translation = window.__localizer__.translation;
    let Localizer_Init = window.__localizer__.Localizer_Init;
    

    detect_elements.add([".Header_headerContent_3SZ84 .Header_subtitle_vRwq2 .Stage_title_399UV", {}]);
    detect_elements.add([".Header_headerContent_3SZ84 .Header_subtitle_vRwq2 .Messages_headerMessageWrapper_ubx4q .Messages_mesageTitle_3snWq", {}]);
    detect_elements.add([".Header_actionButtons_3cYBz .Link_text_3UQiN", {}]);
    detect_elements.add([".TopCounter_rulesButtonWrapper_x5hi- .TopCounter_rulesButton_1f4XN", {}]);
    detect_elements.add([".StartBooster_groupWrapper_3KLGl .StartBooster_cardInfo_3gSJs .StartBooster_title_1kY9_", {}]);
    detect_elements.add([".StartBooster_groupWrapper_3KLGl .StartBooster_cardInfo_3gSJs .StartBooster_button_3W9SM .wru__Button__inner span", {}]);
    detect_elements.add([".Footer_content_3QvMa .Footer_subtitleText_1ddrY .Link_text_3UQiN", {}]);
    detect_elements.add([".ReplaySidebar_wrapper_3UFgX .ReplaySidebar_header_1-Fnq", {}]);
    detect_elements.add([".ReplaySidebar_wrapper_3UFgX .ReplayStep_wrapper_21Jm5 .ReplayStep_body_107n-", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .wru__Dialog__header", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .RulesDialog_paragraph_3EDf3 .RulesDialog_title_1KxcS", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .RulesDialog_portalLink__Zg77 a", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .Buttons_button_7LHEf .Buttons_label_3GjD9", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .MultipleBuyDialog_messageWrapper_3MabP .MultipleBuyDialog_message_28ndO", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .MultipleBuyDialog_footerHeight_m06hL .MultipleBuyDialog_levels_908JR", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .MultipleBuyDialog_footerHeight_m06hL .wru__Button__inner span", {}]);
    detect_elements.add([".ViewDialogs_multipleBuyDialog_39eJ- .MultipleBuyDialog_footerHeight_m06hL .BuyGoldButton_wrapper_2forz", {}]);
    detect_elements.add([".BuyGoldDialog_wrapper_2kVpY .fastgold-title.wcl-1579py1", {}]);
    detect_elements.add([".BuyGoldDialog_wrapper_2kVpY .fastgold-description.wcl-1579py1", {}]);
    detect_elements.add([".BuyGoldDialog_wrapper_2kVpY .tile-button__label", {}]);
    detect_elements.add([".BuyGoldDialog_wrapper_2kVpY .BuyGoldDialog_footer_a6PpP .Buttons_button_7LHEf .Buttons_label_3GjD9", {}]);
    detect_elements.add(["#wows-react-tooltip-body .Tooltips_padding_1xsqe", {}]);
    detect_elements.add(["#wows-react-tooltip-body .ReplayStep_tooltipHeader_dWdE7", {}]);
    detect_elements.add(["#wows-react-tooltip-body .ReplayStep_row_2laZ0 .wru__Message__message", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__footer", {}]);
    detect_elements.add(["#wows-react-tooltip-body .RewardTooltip_wrapper_2wZvC .RewardTooltip_row_yfI5h .wru__Message__message", {}]);
    detect_elements.add(["#wows-react-tooltip-body .RewardTooltip_wrapper_2wZvC .RewardTooltip_descriptionRow_wZN9m", {}]);
    detect_elements.add(["#wows-react-tooltip-body .RewardShipTooltip_wrapper_23SL2 .RewardShipTooltip_header_2K3A6", {}]);
    detect_elements.add([".we-tooltip__container .we-tooltip__header .we-tooltip__titles.we-tooltip__currency-title", {}]);
    detect_elements.add([".we-tooltip__container .we-tooltip__description .we-tooltip__description-title", {}]);

    detect_elements.add([
        ".Header_headerContent_3SZ84 .Header_subtitle_vRwq2 .Stage_title_399UV span",
        {
            isReplace: true,
            translation: [
                ['Этап', "阶段"],
            ]
        }
    ]);
    detect_elements.add([
        ".Header_headerContent_3SZ84 .CountDown_counter_1qxVv .CountDown_description_2Q43B",
        {
            isReplace: true,
            translation: [
                [/До окончания верфи:/g, "离造船厂结束还有："],
                [/Боевые задачи Верфи доступны до(.*)/g, "造船厂的任务将持续到：$1"],
                [/(\d)+ (.*) в (.*)/g, "$2$1日 $3"],
                [/январ/g, "1月"],
                [/феврал/g, "2月"],
                [/марта/g, "3月"],
                [/эйпр/g, "4月"],
                [/ма/g, "5月"],
                [/июн/g, "6月"],
                [/июл/g, "7月"],
                [/Август/g, "8月"],
                [/сентябр/g, "9月"],
                [/октябр/g, "10月"],
                [/Ноябрь/g, "11月"],
                [/Декабрь/g, "12月"],
            ]
        }
    ]);
    detect_elements.add([
        ".Header_headerContent_3SZ84 .CountDown_counter_1qxVv div span",
        {
            isReplace: true,
            translation: [
                [/(\d)+ (.*)/g, "$1 $2"],
                [/дней/g, "天"],
            ]
        }
    ]);
    detect_elements.add([
        ".Header_headerContent_3SZ84 .CountDown_counter_1qxVv div span",
        {
            isReplace: true,
            translation: [
                ['дня', "天"],
            ]
        }
    ]);
    detect_elements.add([
        ".ReplaySidebar_wrapper_3UFgX .ReplayStep_wrapper_21Jm5 .ReplayStep_header_3ft9- span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["Этап", "阶段"],
            ]
        }
    ]);
    detect_elements.add([
        ".ViewDialogs_multipleBuyDialog_39eJ- .RulesDialog_paragraph_3EDf3 .RulesDialog_text_3Ruqd span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                [
                    /На Верфи вы сможете увидеть все этапы кораблестроения и, завершив их, получить финальную награду —/g,
                    "在造船厂，您可以看到所有造船阶段，完成这些阶段后，您将获得最后的奖励 ——"
                ],
                [
                    /Строительство корабля разделено на(.*)этапов./g,
                    "战舰建造分为$1个阶段。"
                ],
                [
                    /Вы можете завершать этапы строительства, выполняя боевые задачи Верфи или за дублоны./g,
                    "您可以通过完成作战任务或使用金币推进造船阶段。"
                ],
                [
                    /Получить финальную награду можно, только завершив не менее (.*) любых этапов за дублоны. Если после получения финальной награды вы продолжите выполнять боевые задачи Верфи, то вместо каждого дополнительного этапа вы получите/g,
                    "您需要使用金币完成至少 $1 个阶段才有可能获得最终奖励。如果在获得最终奖励后继续完成造船厂的作战任务，那么每完成一个额外的造船阶段，您将获得以下奖励"
                ],
                [
                    /Стартовые наборы содержат этапы строительства со скидкой и доступны для приобретения в течение ограниченного времени. Любого Стартового набора достаточно для того, чтобы завершить остальные этапы строительства путём выполнения боевых задач./g,
                    "“入门包”包含了一些造船阶段，价格优惠，限时发售。无论您购买的是哪种入门包，其都足以让您仅通过完成作战任务来完成领取最终奖励所需的剩余造船阶段。"
                ],
                [
                    /Награды выдаются за каждый этап строительства. За завершение некоторых этапов вы получите особые награды:/g,
                    "每个造船阶段都有奖励。完成某些阶段还会获得特殊奖励："
                ],
                [
                    /<span style="display: inline-block" data-interpolate="ipl-firstSpecialRewardStage-2">(.*)<\/span>(.*)<\/span> этап,<span style="white-space: nowrap">/g,
                    '<span style="display: none" data-interpolate="ipl-firstSpecialRewardStage-2">$1</span></span>阶段 $1)，<span style="white-space: nowrap">'
                ],
                [
                    /<span style="display: inline-block" data-interpolate="ipl-secondSpecialRewardStage-4">(.*)<\/span>(.*)<\/span> этап. Вместе с<span style="white-space: nowrap">/g,
                    '<span style="display: none" data-interpolate="ipl-secondSpecialRewardStage-4">$1</span></span>阶段 $1)。对于<span style="white-space: nowrap">'
                ],
                [
                    /за<span style="white-space: nowrap">&nbsp;/g,
                    '(完成<span style="display: none">&nbsp;'
                ],
                [
                    / и<span style="white-space: nowrap">&nbsp;/g,
                    ' 和<span style="white-space: nowrap">&nbsp;'
                ],
                [
                    /вы получите специальные боевые задачи: каждый бой на этих кораблях будет приносить на 200% больше опыта корабля, опыта командира и свободного опыта. Задачи будут доступны в течение 30 дней с момента получения./g,
                    "您将收到特殊的作战任务：在这些战舰上的每场战斗都将带来额外200%的战舰经验、指挥官经验和全局经验收益。任务自领取之日起有效期为30天。"
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".ViewDialogs_multipleBuyDialog_39eJ- .MultipleBuyDialog_footerHeight_m06hL .MultipleBuyDialog_buyAll_gJl3T",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Все этапы,', "所有 "],
                ['шт.', "个阶段"],
            ]
        }
    ]);
    detect_elements.add([
        ".ViewDialogs_multipleBuyDialog_39eJ- .MultipleBuyDialog_footerHeight_m06hL .MultipleBuyDialog_needGoldWrapper_1ZnBP .MultipleBuyDialog_text_r_usC",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Не хватает:', "需要："],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .ReplayStep_tooltipHeader_dWdE7 span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["Этап", "阶段"],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .RewardTooltip_wrapper_2wZvC .RewardTooltip_header_2zig2 span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Награда за', "第"],
                ['Особая награда за', "特别第"],
                ['-й', ""],
                ['&nbsp;этап', " 阶段奖励"],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .RewardTooltip_wrapper_2wZvC .QuantityText_contentBlockSmallTitle_3ZcTI",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Количество: ', "数量："],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .RewardShipTooltip_wrapper_23SL2 .RewardShipTooltip_header_2K3A6 span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Особая награда за', "第"],
                ['-й', ""],
                ['&nbsp;этап', " 阶段特别奖励"],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .RewardTooltip_wrapper_2wZvC .RewardTooltip_premiumRow_cbaG3 span span",
        {
            isReplace: true,
            translation: [
                [
                    /Получить корабль можно, только завершив не менее (.*) любых этапов за дублоны\./g,
                    "您至少要使用金币推进 $1 个造船阶段，才能获得最后的战舰"
                ],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .RewardShipTooltip_bgWrapper_GGlA6 .RewardShipTooltip_premiumRow_24dlf span span",
        {
            isReplace: true,
            translation: [
                [
                    /Получить корабль можно, только завершив не менее (.*) любых этапов за дублоны\./g,
                    "您至少要使用金币推进 $1 个造船阶段，才能获得最后的战舰"
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".we-tooltip__container .we-tooltip__description",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Количество: ', "数量："],
                ['Премиум корабли и&nbsp;другое ценное имущество.', "加值战舰和其他珍贵资源。"],
                [
                    'Можно купить в&nbsp;Адмиралтействе и&nbsp;Премиум магазине, а&nbsp;также получить за&nbsp;участие в&nbsp;событиях.',
                    "可在兵工厂和高级商店购买，也可通过参加活动获得。"
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".Header_headerContent_3SZ84 .Header_subtitle_vRwq2 .Messages_headerMessageWrapper_ubx4q .Messages_mesageRow_2hoXt span",
        {
            isReplace: true,
            translation: [
                [
                    /До конца обновления (.*) вы можете завершить недостающие этапы за дублоны./g,
                    "在 $1 版本结束之前，您可以使用金币推进造船阶段"
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".Header_headerContent_3SZ84 .Header_subtitle_vRwq2 .Messages_headerMessageWrapper_ubx4q .Messages_mesageTitle_3snWq",
        {
            isReplace: true,
            translation: [
                [
                    /Вы завершили (.*) этапов строительства корабля\./g,
                    "您已完成 25 个造船阶段"
                ]
            ]
        }
    ]);

    translation.set('Подготовка', "准备");
    translation.set('Открыть список этапов', "打开阶段列表");
    translation.set('Закрыть список этапов', "关闭阶段列表");
    translation.set('О событии', "关于活动");
    translation.set('Этапы строительства', "造船阶段");
    translation.set('КУПИТЬ ЭТАПЫ', "购买阶段");
    translation.set('Посмотреть строительство с начала', "从头播放造船过程");
    translation.set('Остановить просмотр строительства', "停止播放造船过程");
    translation.set('Все этапы строительства корабля', "所有造船阶段");
    
    translation.set(
        'Общая проработка и согласование проекта.',
        "项目总体设计与方案论证。"
    );
    translation.set(
        'Создание теоретического чертежа корпуса и ограждения рубки. Составление графиков расчётов по гидростатике корабля (площади сечений шпангоутов в надводном и подводном положениях).',
        "绘制舰体与指挥塔围壳的理论线图。编制船舶静力学计算图表（计算水上水下状态肋骨截面面积）。"
    );
    translation.set(
        'Разработка чертежей общего и внутреннего расположения помещений и оборудования с сечениями по палубам и платформам.',
        "绘制包含甲板平台剖面的舱室设备总体布置图与内部布局图。"
    );
    translation.set(
        'Компоновка ангара, прочной рубки и верхнего ходового мостика.',
        "机库、耐压指挥室与上层航行舰桥的布局设计。"
    );
    translation.set(
        'Окончательное согласование внешнего облика лодки и её компоновки.',
        "潜艇外形与总体布局的最终确认。"
    );
    translation.set(
        'Создание рабочей конструкторской документации и отправка финальной версии чертежей на верфь.',
        "编制施工设计文件并向造船厂发送最终版图纸。"
    );
    translation.set(
        'Сборка силового набора двойного дна прочного корпуса. Укладка настила двойного дна.',
        "耐压壳体双层底框架组装。铺设双层底甲板。"
    );
    translation.set(
        'Монтаж основных поперечных переборок средней секции прочного корпуса. Монтаж внутренних шпангоутов прочного корпуса.',
        "耐压壳体中段主横舱壁安装。耐压壳体内肋骨装配。"
    );
    translation.set(
        'Установка аккумуляторных батарей. Сборка носовых и кормовых сферических переборок средней секции прочного корпуса.',
        "蓄电池组安装。耐压壳体中段首尾球面舱壁组装。"
    );
    translation.set(
        'Монтаж шпангоутов и обшивки лёгкого корпуса в кормовой части.',
        "轻型壳体尾部肋骨与外壳板安装。"
    );
    translation.set(
        'Сборка носовых шпангоутов и монтаж на них обшивки лёгкого корпуса в носовой части.',
        "首部轻型壳体肋骨组装及外壳板敷设。"
    );
    translation.set(
        'Сборка фундаментов под механизмы главной энергетической установки. Установка дизелей и электродвигателей. Монтаж шпангоутов прочного корпуса. Укладка второго яруса аккумуляторных батарей. Сборка основания под орудийную башню.',
        "主动力装置机械基座组装。柴油机与电动机安装。耐压壳体肋骨装配。第二层蓄电池组敷设。炮塔基座组装。"
    );
    translation.set(
        'Монтаж оборудования для управления главной энергетической установкой. Сборка и укладка бронепалубы погребов орудийной башни.',
        "主动力装置控制系统安装。炮塔弹药库装甲甲板组装与铺设。"
    );
    translation.set(
        'Начало сборки кормовой секции прочного корпуса. Монтаж шпангоутов лёгкого корпуса и укладка на них внешней обшивки.',
        "耐压壳体尾部段开始组装。轻型壳体肋骨安装及外壳板敷设。"
    );
    translation.set(
        'Установка носового силового набора корпуса, монтаж обшивки носовой секции прочного корпуса и сборка носовой сферической переборки.',
        "船首部结构框架安装，耐压壳体首段外壳板装配及首部球面舱壁组装。"
    );
    translation.set(
        'Окончательная сборка средней секции прочного корпуса. Установка шпангоутов, укладка палубных настилов и монтаж различного оборудования.',
        "耐压壳体中段最终组装。肋骨安装、甲板敷设及各类设备装配。"
    );
    translation.set(
        'Завершение сборки кормовой секции прочного корпуса. Монтаж перегородок балластных цистерн.',
        "耐压壳体尾部段完成组装。压载水舱隔板安装。"
    );
    translation.set(
        'Окончательная сборка носовой секции прочного корпуса. Монтаж носовых торпедных аппаратов.',
        "耐压壳体首部段最终组装。艏部鱼雷发射管安装。"
    );
    translation.set(
        'Укладка оставшихся листов обшивки прочного корпуса. Монтаж погона орудийной башни. Сборка шпангоутов и обшивки цистерн главного балласта.',
        "耐压壳体剩余外壳板铺设。炮塔座圈安装。主压载水舱肋骨与外壳组装。"
    );
    translation.set(
        'Монтаж валов гребных винтов. Сборка привода руля. Установка рулей глубины и руля направления. Завершение обшивки лёгкого корпуса в корме.',
        "螺旋桨轴安装。舵机传动装置组装。升降舵与方向舵装配。轻型壳体尾部外壳完成敷设。"
    );
    translation.set(
        'Монтаж бракет носовой обшивки лёгкого корпуса. Сборка форпика. Укладка обшивки лёгкого корпуса в носовой части.',
        "轻型壳体首部外壳支架安装。首尖舱组装。轻型壳体首部外壳板敷设。"
    );
    translation.set(
        'Сборка скуловых килей. Монтаж силового набора надстройки лёгкого корпуса. Монтаж носовых рулей глубины. Монтаж обшивки надстройки. Укладка палубного настила.',
        "舭龙骨组装。轻型壳体上层建筑框架安装。首部升降舵装配。上层建筑外壳安装。甲板敷设。"
    );
    translation.set(
        'Монтаж якорно-швартового оборудования. Покраска корпуса. Монтаж основания башни главного калибра и её орудий. Подготовка корабля к спуску.',
        "锚泊系泊设备安装。为舰体涂装。主炮塔基座与火炮装配。潜艇下水前准备。"
    );
    translation.set(
        'Спуск на воду.',
        "下水仪式。"
    );
    translation.set(
        'Сборка ангара, монтаж боевой рубки. Установка силового набора ограждения боевой рубки.',
        "机库组装，作战指挥塔安装。作战指挥塔围壳框架装配。"
    );
    translation.set(
        'Монтаж обшивки орудийной башни. Установка кормовых торпедных аппаратов, монтаж перископов, оборудования верхнего мостика, установка леерного ограждения. Подготовка корабля к вступлению в строй.',
        "炮塔装甲安装。艉部鱼雷发射管装配，潜望镜、上层舰桥设备安装，栏杆围栏装配。潜艇服役前整备。"
    );
    
    translation.set('ПРАВИЛА', "规则");
    translation.set('Что такое Верфь?', "关于造船厂");
    
    translation.set('Завершение этапов строительства', "完成造船阶段");
    translation.set('Стартовые наборы', "入门包");
    
    translation.set('Заслуженные награды', "奖励");
    translation.set('Узнайте больше о Верфи на портале игры', "在门户网站上了解更多");
    translation.set('ЗАКРЫТЬ', "关闭");
    translation.set(
        'Вы можете ускорить процесс строительства за дублоны, сразу получить награды и заполнить шкалу прогресса строительства.',
        "您可以用金币加快造船进程——推进造船进度条并立即获得奖励！"
    );
    translation.set('Количество:', "数量：");
    translation.set('Стоимость:', "费用：");
    translation.set('КУПИТЬ', "购买");
    translation.set('Купить дублоны', "购买金币");
    translation.set('ПРИОБРЕТЕНИЕ ДУБЛОНОВ', "购买金币");
    translation.set('Выберите желаемое количество дублонов:', "选择所需的金币数量：");
    translation.set('Подробные правила события', "活动规则");
    translation.set('Завершённый этап', "阶段已完成");
    translation.set('Посмотреть этап строительства', "查看造船阶段");
    translation.set('Получено', "已获得");
    translation.set('Финальная награда', "最终奖励");
    translation.set('Дублоны', "金币");
    translation.set('На что потратить', "如何花费");
    translation.set('Как получить', "如何获取");
    translation.set('Группы боевых задач для завершения этапов строительства больше не доступны.', "完成作战任务不再能推进造船阶段");

    

    

    detect_elements.add(["#wows-react-tooltip-body .RewardTooltip_rewardItem_1TvHa .we-widget__title", {}]);

    translation.set('Корабельный премиум аккаунт', "战舰世界高级账号");

    

    Localizer_Init();
}




