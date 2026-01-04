// ==UserScript==
// @name         战舰世界莱服网页汉化-资源-征募站翻译
// @namespace    https://github.com/windofxy
// @version      202503051039
// @description  战舰世界莱服网页汉化-资源
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT
// ==/UserScript==

if (!window.__localizer_friends_loaded__ && window.location.host === "friends.korabli.su") {
    window.__localizer_dockyard_loaded__ = true;
    let detect_elements = window.__localizer__.detect_elements;
    let translation = window.__localizer__.translation;
    let Localizer_Init = window.__localizer__.Localizer_Init;
    

    detect_elements.add([".navigation .navigation__links .navigation__link", {}]);
    detect_elements.add([".base-layout__container .header .header-info__title", {}]);
    detect_elements.add([".base-layout__container .header .header-info__button .button", {}]);
    detect_elements.add([".base-layout__container .rewards__balance .rewards__balance_title", {}]);
    detect_elements.add([".base-layout__container .rewards .shop-card__container .shop-card__title div span span", {}]);
    detect_elements.add([".base-layout__container .modal.about__modal .modal__header .modal__title", {}]);
    detect_elements.add([".base-layout__container .modal.about__modal .modal-content .modal__subtitle", {}]);
    detect_elements.add([".base-layout__container .shop-modal__container .shop-modal__label .shop-modal__label__text", {}]);
    detect_elements.add([".base-layout__container .shop-modal__container .shop-modal__content .shop-modal__text.shop-modal__text_title div span span", {}]);
    detect_elements.add([".base-layout__container .shop-modal__container .shop-modal__content .shop-modal__text.shop-modal__text_short-desc ul li", {}]);
    detect_elements.add([".base-layout__container .shop-modal__container .shop-modal__content .shop-modal__text.shop-modal__text_short-desc", {}]);
    detect_elements.add([".base-layout__container .shop-modal__container .shop-modal__content .shop-modal__content__footer .shop-modal__text.shop-modal__text_total.shop-modal__text_price span", {}]);
    detect_elements.add([".base-layout__container .shop-modal__container .shop-modal__content .footer__button .button", {}]);
    detect_elements.add([".base-layout__container .rewards__wrapper .tooltip p", {}]);
    detect_elements.add([".base-layout__container .rewards .tooltip .tooltip-content .tooltip-content__title", {}]);
    detect_elements.add([".base-layout__container .rewards .tooltip .tooltip-content .tooltip-content__subtitle", {}]);
    detect_elements.add([".base-layout__container .friends-page .exp-progress .header-progress__text", {}]);
    detect_elements.add([".base-layout__container .friends-page .exp-progress .header-progress__subtext", {}]);
    detect_elements.add([".base-layout__container .friends-page .exp-progress .tooltip .tooltip__text", {}]);
    detect_elements.add([".base-layout__container .friends-page .players-list .tooltip p", {}]);
    detect_elements.add([".base-layout__container .slider__content .slide__content .slide__text", {}]);
    detect_elements.add([".base-layout__container .slider__content .slide__content .slide__buttons .button", {}]);
    detect_elements.add([".base-layout__container .modal.about__modal .modal-content .modal__text", {}]);
    detect_elements.add([".base-layout__container .modal.about__modal .modal-content .button", {}]);
    detect_elements.add([".base-layout__container .modal.about__modal .content-block .modal__text.footnote", {}]);
    detect_elements.add([".base-layout__container .modal.about__modal .modal-content .orange", {}]);
    detect_elements.add([".base-layout__container .modal.about__modal .modal-content-rewards p", {}]);
    detect_elements.add([".base-layout__container .invite .invite__title", {}]);
    detect_elements.add([".base-layout__container .action .title", {}]);
    detect_elements.add([".base-layout__container .action .description", {}]);
    
    detect_elements.add([
        ".base-layout__container .modal.about__modal .modal__header .modal__close",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Закрыть', "关闭"],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .modal.about__modal .modal__list li span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Наставник получает', "征募人可获得："],
                ['за&nbsp;первого соратника.', "。条件：首次成功邀请战友。"],
                ['контейнер братства', "个初级征募站补给箱"],
                ['в&nbsp;награду за&nbsp;отправку трёх приглашений через любую соцсеть или&nbsp;мессенджер.', "。条件：首次通过任意社交平台或即时通讯软件发出3份邀请。"],
                [
                    'за&nbsp;каждый бой своего соратника. Заработанные жетоны накапливаются и&nbsp;отображаются на&nbsp;шкале прогресса. В&nbsp;начале каждой недели их&nbsp;можно забрать на&nbsp;свой счёт.  В неделю можно заработать до&nbsp;',
                    "。条件：战友每完成一次战斗。获得的代币会累积并显示在进度条上。每周开始时，您可以将它们收集到自己的账户中。您最多可以获得："
                ],
                [
                    'за&nbsp;каждый бой, сыгранный в&nbsp;отряде с&nbsp;соратником. Бонус за&nbsp;победу: ещё',
                    "。条件：和1名战友组成小队每完成一次战斗。若战斗胜利则额外获得："
                ],
                [
                    'за&nbsp;каждый бой, сыгранный в&nbsp;отряде с&nbsp;двумя соратниками. Бонус за&nbsp;победу: ещё',
                    "。条件：和2名战友组成小队每完成一次战斗。若战斗胜利则额外获得："
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .modal.about__modal .content-block .modal__list li span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                [
                    'за&nbsp;каждый бой, сыгранный в&nbsp;отряде с&nbsp;соратником. Бонус за&nbsp;победу: ещё',
                    "。条件：和1名战友组成小队每完成一次战斗。若战斗胜利则额外获得："
                ],
                [
                    'за&nbsp;каждый бой, сыгранный в&nbsp;отряде с&nbsp;двумя соратниками. Бонус за&nbsp;победу: ещё',
                    "。条件：和2名战友组成小队每完成一次战斗。若战斗胜利则额外获得："
                ],
                [
                    'за&nbsp;каждый бой, сыгранный в&nbsp;отряде с&nbsp;наставником. Бонус за&nbsp;победу: ещё',
                    "。条件：和征募人组成小队每完成一次战斗。若战斗胜利则额外获得："
                ],
                ['Соратник получает', "战友可获得："],
                [
                    'Наставником может быть любой игрок «Мир&nbsp;кораблей», имеющий не&nbsp;менее 15&nbsp;боёв за&nbsp;плечами.',
                    "所有参与了15次以上战斗的玩家都可以成为征募人。"
                ],
                [
                    'Тех, кто никогда не играл в «Мир кораблей».',
                    "从来没有玩过本游戏的人。"
                ],
                [
                    'Игроков, чей последний бой в&nbsp;«Мир&nbsp;кораблей» был более 90&nbsp;дней назад.',
                    "上次战斗距今已有90天或更久的玩家。"
                ],
                [
                    'Игроков, которые ещё не&nbsp;приняли приглашения от&nbsp;других наставников и&nbsp;сыграли менее 15&nbsp;боёв.',
                    "总战斗次数少于15且未被征募的玩家。"
                ],
                [
                    'Кешбэк может получать только наставник, у&nbsp;которого 2&nbsp;соратника и&nbsp;более.',
                    "只有征募了2名或更多战友时，征募人才会收到返金。"
                ],
                [
                    'Кешбэк начисляется только в&nbsp;дублонах в&nbsp;сумме, эквивалентной 10% от&nbsp;совокупной стоимости покупок всех соратников в&nbsp;Премиум магазине.',
                    "当您征募了2名或更多战友时，每个月您将收到一次以金币形式发放的返现，即返金。其数额等同于您所有战友于一段时间内在高级商店消费金额的10%。"
                ],
                [
                    'Кешбэк начисляется в&nbsp;первый день каждого месяца.',
                    "返金在每个月的第一天发放。"
                ],
                [
                    'С момента покупки должно пройти не&nbsp;менее 30&nbsp;дней.*',
                    "当一次购买发生后，至少需要过30天才能被纳入返金计算。*"
                ],
                ['Соратник', "战友"],
                ['Наставник', "征募人"],
                
                ['получает', "获得"],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .modal.about__modal .content-block.orange .modal__list li span",
        {
            isReplace: true,
            translation: [
                ['сыграть в любом режиме, кроме тренировочного;', "加入除训练模式以外的任意战斗模式"],
                ['заработать не менее 150 ед. базового опыта, если вы вышли в бой на корабле I–V уровня (для каждого участника отряда);', "组成小队加入战斗时，每个使用I-V级战舰的小队成员都至少获得150点基础经验"],
                ['заработать не менее 300 ед. базового опыта, если вы вышли в бой на корабле VI–X уровня (для каждого участника отряда).', "组成小队加入战斗时，每个使用VI-XI级战舰的小队成员都至少获得300点基础经验"],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .shop-modal__container .shop-modal__content .shop-modal__text.shop-modal__text_short-desc .MsoNormal",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Контейнер\nсодержит один предмет из списка:', "每个补给箱都包含下列物品中其一："],
            ]
        }
    ])
    detect_elements.add([
        ".base-layout__container .shop-modal__container .shop-modal__content .footer__button .button.button_disable .button__text.button__text_warning",
        {
            isReplace: true,
            translation: [
                ['Не хватает: ', "需要："],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .friends-page .friends-page__title",
        {
            isReplace: true,
            translation: [
                ['СОРАТНИКИ', "战友"],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .friends-page .players-list .players-list__row.players-list__row_header .players-list__text",
        {
            isReplace: true,
            translation: [
                ['Игрок', "玩家"],
                ['Статус в сети', "在线状态"],
                ['Заработано жетонов за всё время', "为您赚取的社区代币"],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .friends-page .players-list .players-list__collapsible .players-list__row._head .players-list__text",
        {
            isReplace: true,
            translation: [
                ['Новые соратники', "新战友"],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .friends-page .players-list .players-list__collapsible .palyers-list__block .players-list__item.players-list__item_status .players-list__text",
        {
            isReplace: true,
            translation: [
                ['Не в сети', "离线"],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .modal.about__modal .modal-content .modal__list li span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                [
                    'c камуфляжем «Национальный», слотом в Порту и командиром с 9 очками навыков',
                    "，附带永久涂装“国家”、港口船位以及9技能点的指挥官"
                ],
                [
                    '7 дней Корабельного премиум аккаунта',
                    "7天高级账号"
                ],
                [
                    'со слотом в Порту и командиром с 10 очками навыков',
                    "，附带港口船位以及10技能点的指挥官"
                ],
                [
                    '5&nbsp;000&nbsp;000 кредитов',
                    "5000000银币"
                ],
                [
                    'по 30 стандартных расходуемых экономических бонусов каждого типа',
                    "每种普通消耗型加成各30个"
                ],
                [
                    'по 25 особых расходуемых экономических бонусов каждого типа',
                    "每种特殊消耗型加成各25个"
                ],
                [
                    'по 20 редких расходуемых экономических бонусов каждого типа',
                    "每种稀有消耗型加成各20个"
                ],
                [
                    '15 контейнеров «Больше сигналов»',
                    "15个“更多信号旗”补给箱"
                ],
                [
                    '15 контейнеров «Больше угля»',
                    "15个“更多煤炭”补给箱"
                ],
                [
                    '3 дня Корабельного премиум аккаунта',
                    "3天高级账号"
                ],
                [
                    'контейнер «Премиум корабль&nbsp;V»',
                    "“V级加值战舰”补给箱"
                ],
                [
                    '14 дней Корабельного премиум аккаунта',
                    "14天高级账号"
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .invite .invite__subtitle span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                [
                    'Получите 1 контейнер Морского братства в&nbsp;награду за&nbsp;отправку трёх приглашений через любую соцсеть или&nbsp;мессенджер.',
                    "通过任意社交平台或即时通讯软件发出3份邀请可获得1个初级征募站补给箱。"
                ],
                [
                    'Также получите',
                    "您成功征募第一名战友后，还能获得"
                ],
                [
                    'за&nbsp;своего первого соратника!',
                    ""
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".base-layout__container .action .invite",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['У вас пока нет новых соратников.', "您还没有新战友。"],
                ['Пригласить друга', "邀请新战友"],
            ]
        }
    ]);

    translation.set('НАГРАДЫ', "奖励");
    translation.set('МОИ СОРАТНИКИ', "我的战友");
    translation.set('ИНФОРМАЦИЯ', "信息");
    translation.set('ПРИГЛАШЕНИЕ В БРАТСТВО', "邀请战友");
    translation.set('КОНКИСТАДОРЫ, ОБЩИЙ СБОР!', "是兄弟就一起西征！");
    translation.set('Меняйте жетоны единства на контейнеры с ценными наградами!', "用社区代币换取包含珍贵奖励的补给箱！");
    translation.set('КАК ПОЛУЧИТЬ ЖЕТОНЫ?', "如何获得代币？");
    translation.set('Жетоны единства:', "社区代币：");
    translation.set('Контейнер Морского братства', "初级征募站补给箱");
    translation.set('КОНТЕЙНЕР МОРСКОГО БРАТСТВА', "初级征募站补给箱");
    translation.set('Набор Морского братства', "初级征募站组合包");
    translation.set('НАБОР МОРСКОГО БРАТСТВА', "初级征募站组合包");
    translation.set('Большой контейнер Морского братства', "中级征募站补给箱");
    translation.set('БОЛЬШОЙ КОНТЕЙНЕР МОРСКОГО БРАТСТВА', "中级征募站补给箱");
    translation.set('Большой набор Морского братства', "中级征募站组合包");
    translation.set('БОЛЬШОЙ НАБОР МОРСКОГО БРАТСТВА', "中级征募站组合包");
    translation.set('Гигантский контейнер Морского братства', "老兵征募站补给箱");
    translation.set('ГИГАНТСКИЙ КОНТЕЙНЕР МОРСКОГО БРАТСТВА', "老兵征募站补给箱");
    translation.set('Гигантский набор Морского братства', "老兵征募站组合包");
    translation.set('ГИГАНТСКИЙ НАБОР МОРСКОГО БРАТСТВА', "老兵征募站组合包");
    translation.set('КАК ПОЛУЧИТЬ ЖЕТОНЫ ЕДИНСТВА?', "如何获得社区代币？");
    translation.set('Чтобы за бой начислялись жетоны единства, необходимо:', "要在战斗中获得社区代币，必须满足以下条件：");
    translation.set('ОДИН — СЕБЕ, ВТОРОЙ — СОРАТНИКУ', "一个给战友，一个给您自己");
    translation.set('СТОИМОСТЬ:', "费用：");
    translation.set('КУПИТЬ', "购买");
    translation.set('Жетоны единства', "社区代币");
    translation.set(
        'В состав одного набора Морского братства входят два контейнера Морского братства. Один контейнер тебе, другой твоему соратнику или наставнику.',
        "一个初级征募站组合包内含两个初级征募站补给箱——一个给您自己，另一个给您的战友。"
    );
    translation.set(
        'В состав набора входят два больших контейнера братства. Один контейнер тебе, другой твоему соратнику или наставнику.',
        "一个中级征募站组合包内含两个中级征募站补给箱——一个给您自己，另一个给您的战友。"
    );
    translation.set(
        'В состав набора входят два гигантских контейнера морского братства. Один контейнер тебе, другой твоему соратнику или наставнику.',
        "一个老兵征募站组合包内含两个老兵征募站补给箱——一个给您自己，另一个给您的战友。"
    );
    translation.set('НАГРАДА НЕДЕЛИ ЗА ИГРУ ВАШИХ СОРАТНИКОВ', "在最近一周的战斗中，您的战友为您赚取了以下奖励：");
    translation.set(
        'Жетоны единства, накопленные за игру ваших соратников. Забрать эти жетоны можно только в начале следующей недели.',
        "与您的战友一起战斗所积累的社区代币。这些代币在下一周开始时可被领取。"
    );
    translation.set(
        'Максимальное количество жетонов единства, которое можно накопить в неделю за игру ваших соратников.',
        "每周通过与您的战友一起战斗积累代币的最大数量。"
    );
    translation.set(
        'Накопленные жетоны можно забрать в начале следующей недели.',
        "累积的代币可在下周开始时领取。"
    );
    translation.set(
        'Соратник',
        "战友"
    );
    translation.set(
        'Жетоны единства, заработанные за игру ваших соратников за всё время',
        "通过与战友一起战斗所积累的代币总数"
    );
    translation.set(
        'Контейнеры Морского братства ― уникальная награда для соратников и наставников Морского братства. Получить контейнеры можно только в обмен на символы братства. Чем больше контейнер, тем богаче и разнообразнее его состав.',
        "征募站补给箱是一种独特奖励，是为在征募站加入我们行列的征募人和战友准备的。这些补给箱只能通过社区代币来兑换，补给箱级别越高，所包含的奖励就越丰厚。"
    );
    translation.set(
        'Контейнеры братства ― уникальная награда для соратников и наставников Морского братства. Получить контейнеры можно только в обмен на символы братства. Чем больше контейнер, тем богаче и разнообразнее его состав.',
        "征募站补给箱是一种独特奖励，是为在征募站加入我们行列的征募人和战友准备的。这些补给箱只能通过社区代币来兑换，补给箱级别越高，所包含的奖励就越丰厚。"
    );
    translation.set(
        'Приглашайте друзей вступить в Морское братство. Зовите тех, кто ещё не играл в «Мир кораблей», и тех, кто давно не был в игре!',
        "邀请好友加入征募站。召集还没玩过本游戏的朋友，以及很久没登录过的老玩家们!"
    );
    translation.set(
        'Друг принял приглашение и играет? Отлично! Теперь он ваш соратник, и вы оба будете получать награду — жетоны единства.',
        "您的好友是否已接受您的邀请并开始游戏？干得漂亮！他们成为了您的战友，你们都可以获得——社区代币。"
    );
    translation.set(
        'Жетоны единства можно накапливать и менять на уникальные контейнеры с премиум кораблями, дублонами и другими наградами.',
        "获得的社区代币可用来兑换包含加值战舰的独特补给箱、金币，以及其他奖励。"
    );
    translation.set(
        'Если у вас два соратника и более, раз в месяц вы будете получать кешбэк в дублонах, равный 10% от суммарной стоимости покупок ваших соратников в Премиум магазине.',
        "如果您有2名或更多战友，每月您将获得一次以金币形式发放的返现，即返金。其数额等同于您所有战友于一段时间内在高级商店消费金额的10%。"
    );
    translation.set(
        'Вас и ваших соратников ждёт бонус: линкор VI уровня REPULSE, крейсер II уровня EMDEN, Корабельный премиум аккаунт и многое другое.',
        "我们为您和您的战友准备了一份奖励:VI级战列舰反击、II级巡洋舰埃姆登、战舰高级账号，以及更多资源！"
    );
    translation.set(
        '\n            Отправить приглашение\n          ',
        "发送邀请"
    );
    translation.set(
        '\n            Подробные правила\n          ',
        "详细规则"
    );
    translation.set(
        'ПОДРОБНЕЕ О НАГРАДАХ',
        "详细奖励"
    );
    translation.set(
        'ПРАВИЛА МОРСКОГО БРАТСТВА',
        "征募站规则"
    );
    translation.set(
        'КАК НАСТАВНИКУ ЗАРАБОТАТЬ ЖЕТОНЫ ЕДИНСТВА?',
        "征募人如何获得社区代币？"
    );
    translation.set(
        'КАК СОРАТНИКУ ЗАРАБОТАТЬ ЖЕТОНЫ ЕДИНСТВА?',
        "战友如何获得社区代币？"
    );
    translation.set(
        'КАК СТАТЬ НАСТАВНИКОМ?',
        "如何成为征募人？"
    );
    translation.set(
        'КОГО МОЖНО ПРИГЛАШАТЬ В СОРАТНИКИ?',
        "谁可以被邀请成为战友？"
    );
    translation.set(
        'КАК ПОЛУЧИТЬ КЕШБЭК ЗА ПОКУПКИ СОРАТНИКОВ?',
        "如何获得战友的返金？"
    );
    translation.set(
        'Наставник — это тот, кто приглашает в братство других.',
        "征募人是指通过征募站邀请其他人加入我们游戏的玩家。"
    );
    translation.set('ПРИГЛАСИТЬ В БРАТСТВО', "发送邀请");
    translation.set(
        'Соратник — это тот, кто вступил в братство по приглашению наставника.',
        "战友是指通过征募站接受征募人邀请加入我们游戏的玩家。"
    );
    translation.set(
        '* Если покупка была совершена 2 июня, кешбэк за неё будет начислен 1 августа в соответствии с правилами начисления кешбэка.',
        "* 例如：若消费发生于6月2日，根据规则，返金将于8月1日发放。"
    );
    translation.set(
        'БОЛЬШЕ ПОДРОБНОСТЕЙ',
        "更多信息"
    );
    translation.set(
        'КАК ПОЛУЧИТЬ НАГРАДЫ?',
        "如何获得奖励？"
    );
    translation.set(
        'ПОСЛЕ ПРИНЯТИЯ ПРИГЛАШЕНИЯ ОТ НАСТАВНИКА СОРАТНИК СМОЖЕТ ПОЛУЧИТЬ НАГРАДЫ, ВЫПОЛНИВ СЛЕДУЮЩИЕ ЗАДАЧИ:',
        "战友接受征募人的邀请后，可以获得以下奖励:"
    );
    translation.set(
        'Сыграть один бой в «Мир кораблей»',
        "在本游戏中参加一场战斗"
    );
    translation.set(
        'Сыграть один бой на корабле VI уровня',
        "驾驶VI级战舰参加一场战斗"
    );
    translation.set(
        'БОНУСНАЯ ЗАДАЧА ДЛЯ ТЕХ, КТО ВЕРНУЛСЯ В ИГРУ ПОСЛЕ ПЕРЕРЫВА В 90 ДНЕЙ ИЛИ БОЛЕЕ:',
        "离开90天或更久之后回归的玩家还可以获得以下奖励:"
    );
    translation.set(
        'Одержать 25 побед в боях на кораблях IV-X уровней',
        "驾驶IV-X级战舰获得25场胜利"
    );
    translation.set(
        'Наставник также получит награду после выполнения этой задачи соратником',
        "当战友驾驶VI级战舰赢得首场战斗时，征募人也会获得以下奖励:"
    );
    translation.set(
        'Задачи можно выполнить только один раз. В зачёт идут бои во всех режимах, кроме тренировочных.',
        "任务只能完成一次，并且不能在战斗训练模式中完成。"
    );
    translation.set(
        'ОТПРАВЬТЕ ПРИГЛАШЕНИЕ В БРАТСТВО',
        "通过征募站发送一份邀请"
    );
    translation.set(
        'КОНКИСТАДОРЫ, ОБЩИЙ СБОР!',
        "是兄弟就一起西征！"
    );
    translation.set(
        'Легенда о Conquistador продолжается — этот испанский линкор X уровня может присоединиться к вашему флоту за дружбу. Одержите 30 побед до 12 марта в отряде с новым соратником, который ранее не играл в игру, и «десятка» ваша! Если у вас уже есть этот особый корабль, вы получите по 20 элитных сигналов каждого вида. На этой странице вы можете отследить свой прогресс по количеству побед со всеми новыми соратниками, приглашёнными в период акции.',
        "西班牙征服者号的传奇仍在继续——您有机会将这艘X级西班牙战舰纳入您的舰队。在3月12日之前，邀请一位从未玩过本游戏的朋友加入您的征募站。与TA组成一个小队，在随机战中取得30场胜利，这艘X级船就归您了！如果您已经拥有了这艘战舰，作为补偿，您将获得每种精英信号旗各20面。在本页面中，您可以根据活动期间邀请的所有新战友的胜利次数来跟踪自己的进度。"
    );

    

    

    translation.set(
        'премиум корабль (Yūbari, Marblehead, Marblehead Lima, Siroco или «Аврора») со слотом в Порту и командиром с 10 очками навыков;',
        "一艘加值战舰(夕张、马布尔黑德、马布尔黑德L、热风或阿芙乐尔)，附带港口船位和10技能点的指挥官；"
    );
    translation.set(
        '100 дублонов;',
        "100达布隆；"
    );
    translation.set(
        '1500 ед. угля;',
        "1500单位煤炭；"
    );
    translation.set(
        '3 дня Корабельного премиум аккаунта;',
        "3天高级账号"
    );
    translation.set(
        '10 стандартных расходуемых экономических бонусов одного типа («Кредиты +20%», «Опыт корабля +100%», «Опыт командира +100%» или «Свободный опыт +300%»);',
        "10x 同一种普通消耗型经济加成（“银币+20%”、“战舰经验+100%”、“指挥官经验+100%”或“全局经验+300%”）",
    );
    translation.set(
        '5 особых расходуемых экономических бонусов одного типа («Кредиты +40%», «Опыт корабля +200%», «Опыт командира +200%» или «Свободный опыт +600%»);',
        "5x 同一种特殊消耗型经济加成（“银币+40%”、“战舰经验+200%”、“指挥官经验+200%”或“全局经验+600%”）"
    );
    translation.set(
        '5000 ед. свободного опыта;',
        "5000点全局经验"
    );
    translation.set(
        '150 000 кредитов.',
        "150000银币"
    );
    translation.set(
        'премиум корабль (Huanghe, Genova, «Красный Крым», Mutsu или Monaghan) со слотом в Порту и командиром с 10 очками навыков;',
        "一艘加值战舰（黄河、热那亚、红色克里米亚、陆奥或莫纳汉），附带港口船位和10技能点的指挥官"
    );
    translation.set(
        '500 дублонов;',
        "500达布隆"
    );
    translation.set(
        '5000 ед. угля;',
        "5000单位煤炭"
    );
    translation.set(
        '7 дней Корабельного премиум аккаунта;',
        "7天高级账号"
    );
    translation.set(
        '50 стандартных расходуемых экономических бонусов одного типа («Кредиты +20%», «Опыт корабля +100%», «Опыт командира +100%» или «Свободный опыт +300%»);',
        "50x 同一种普通消耗型经济加成（“银币+20%”、“战舰经验+100%”、“指挥官经验+100%”或“全局经验+300%”）"
    );
    translation.set(
        '10 редких расходуемых экономических бонусов одного типа («Кредиты +160%», «Опыт корабля +800%», «Опыт командира +800%» или «Свободный опыт +2400%»);',
        "10x 同一种稀有消耗型经济加成（“银币+160%”、“战舰经验+800%”、“指挥官经验+800%”或“全局经验+2400%”）"
    );
    translation.set(
        '15 000 ед. свободного опыта;',
        "15000点全局经验"
    );
    translation.set(
        '750 000 кредитов.',
        "750000银币"
    );
    translation.set(
        "премиум корабль (Duca d'Aosta, Ashitaka, Juruá, Prinz Eugen или Kidd) со слотом в Порту и командиром с 10 очками навыков;",
        "一艘加值战舰（奥斯塔公爵、爱鹰、茹鲁阿、欧根亲王或基德），附带港口船位和10技能点的指挥官"
    );
    translation.set(
        '1000 дублонов;',
        "1000达布隆"
    );
    translation.set(
        '10 000 ед. угля;',
        "10000单位煤炭"
    );
    translation.set(
        '30 дней Корабельного премиум аккаунта;',
        "30天高级账号"
    );
    translation.set(
        '14 редких расходуемых экономических бонусов одного типа («Кредиты +160%», «Опыт корабля +800%», «Опыт командира +800%» или «Свободный опыт +2400%»);',
        "14x 同一种稀有消耗型经济加成（“银币+160%”、“战舰经验+800%”、“指挥官经验+800%”或“全局经验+2400%”）"
    );
    translation.set(
        '30 000 ед. свободного опыта;',
        "30000点全局经验"
    );
    translation.set(
        '1 500 000 кредитов.',
        "1500000银币"
    );

    

    Localizer_Init();
}

