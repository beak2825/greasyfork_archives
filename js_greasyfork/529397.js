// ==UserScript==
// @name         战舰世界莱服网页汉化-资源-军团翻译
// @namespace    https://github.com/windofxy
// @version      202503051039
// @description  战舰世界莱服网页汉化-资源
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT
// ==/UserScript==

if (!window.__localizer_clan_loaded__ && window.location.host === "clans.korabli.su") {
    window.__localizer_clan_loaded__ = true;
    let detect_elements = window.__localizer__.detect_elements;
    let translation = window.__localizer__.translation;
    let Localizer_Init = window.__localizer__.Localizer_Init;
    

    detect_elements.add([
        ".Nav_nav_343Az.Nav_blurable_3EDU3 a",
        {
            isReplace: true,
            translation: [
                ["ВОЕННАЯ БАЗА", "海军基地"],
                ["ЗАДАЧИ КЛАНА", "军团任务"],
                ["ЗВЕЗДА ОТРЯДА", "逐星之队"],
                ["СОСТАВ КЛАНА", "军团成员"],
                ["ПОИСК КЛАНОВ", "军团搜寻"],
                ["РЕКОМЕНДАЦИИ", "建议"],
                ["КАЗНА КЛАНА", "军团金库"],
                ["МОРСКОЕ СРАЖЕНИЕ", "海军大战"],
                ['ЗАПРОСЫ', "军团请求"],
                ["КЛАНОВЫЕ БОИ", "军团战"],
            ],
        },
    ]);

    

    

    detect_elements.add([".Tooltip_body_2dtFl.Tooltip_withMouseClick_1s0X-", {}]);
    detect_elements.add([".Tooltip_body_2dtFl p", {}]);

    

    

    detect_elements.add([".ViewClanTasks_pageTitle_1Umm_", {}]);
    detect_elements.add([".TaskRow_wrapper_1Fnxk .TaskRow_title_Xocrg", {}]);
    detect_elements.add([".TaskRow_title_Xocrg", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__header", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__body", {}]);

    detect_elements.add([
        ".ViewClanTasks_syncMessageWrapper_1aLFI .wru__Message__message",
        {
            isReplace: true,
            translation: [
                [
                    "  Информация о прогрессе выполнения задач обновляется ежедневно в",
                    "有关任务进度的信息每天在服务器时间",
                ],
                ["по серверному времени.", "更新"],
            ],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .TaskRow_active_3Oq04 span span",
        {
            isReplace: true,
            translation: [
                ['Задача выполнена до ', "任务完成于 "],
            ]
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__header strong",
        {
            isReplace: true,
            translation: [
                ['Прогресс выполнения задач', "任务进度"],
            ],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body",
        {
            isReplace: true,
            translation: [
                [
                    "Информация о прогрессе выполнения задач обновляется ежедневно в",
                    "有关任务进度的信息每天在服务器时间",
                ],
                ["по серверному времени", "更新"],
            ],
        },
    ]);

    translation.set("ЗАДАЧИ КЛАНА", "军团任务");
    translation.set('Измените требования клана', "更改军团招募要求");
    translation.set('Измените описание клана', "更改军团描述");
    translation.set('Отправьте приглашение в клан', "发出一封军团邀请");
    translation.set('Назначьте военкома', "任命一位招募官");
    translation.set('Получите 1000 нефти', "获得 1,000 石油");
    translation.set('Получите 50 000 нефти', "获得 50,000 石油");
    translation.set('Примите игрока в клан', "接受一位玩家加入军团");
    translation.set('Приобретите улучшение на Военной базе клана', "升级军团海军基地的建筑");
    translation.set('Соберите в клане не менее 10 игроков', "您的军团拥有至少10名玩家");
    translation.set('Соберите в клане не менее 7 активных игроков', "您的军团拥有至少7名活跃玩家");
    translation.set('Пройдите любую Операцию отрядом из 4 или более игроков из вашего клана, выполнив 5 дополнительных задач', "4名或以上的军团成员组队完成任意行动以及完成其5个次要目标");
    translation.set('Примите участие в Морском сражении', "参与海军大战");
    translation.set('Пройдите этап Подготовки в Морском сражении', "完成海军大战中的准备阶段");
    translation.set('Победите в Морском сражении', "在海军大战中取得胜利");
    translation.set('Наберите 500 очков рейтинга в Морском сражении', "在海军大战中获得500评价点数");
    translation.set('Сыграйте бой в Клановых боях', "参加一场军团战");
    translation.set('Выиграйте бой в Клановых боях', "在军团战中取得胜利");
    translation.set('Сыграйте бой в Клановых боях в лиге Бури', "参加一场在狂风联盟的军团战");
    translation.set('Выполните все задачи клана', "完成全部军团任务");
    translation.set('Изменить требования можно в контекстном меню названия клана на Военной базе клана.', "军团招募要求可以在海军基地中的“军团名称操作菜单”中进行更改");
    translation.set('Изменить описание клана можно в контекстном меню названия клана на Военной базе клана.', "军团描述可以在海军基地中的“军团名称操作菜单”中进行更改");
    translation.set('Пригласить игрока можно из контекстного меню имени игрока либо в профиле игрока на официальном портале.', "可以通过“玩家名称操作菜单”或官方网站上的“玩家资料”邀请玩家进入战队");
    translation.set('Изменить должность можно в контекстном меню имени игрока либо в разделе «Состав клана».', "玩家职位可以在“玩家名称操作菜单”或“军团成员”部分中进行修改");
    translation.set(
        'Нефть начисляется на счёт клана при получении игроками клана контейнеров, за участие в овых боях и Морском сражении, а также за выполнение специальных боевых задач.Учитывается общее количество полученной нефти, в том числе и нефть, потраченная на приобретение улучшений Военной базы клана.',
        "当玩家收到补给箱或者参加军团战、海军大战以及完成特殊战斗任务时，石油会被添加至军团的帐户中。收到的石油总量会被计数，包含任何用于海军基地扩建的石油。"
    )
    translation.set(
        'Принять игрока можно, подтвердив заявку на вступление в разделе «Запросы».',
        "通过在“请求”界面中确认其申请，可以接受该玩家"
    );
    translation.set(
        'Учитываются игроки, которые провели не менее 20 боёв за последний месяц.',
        "仅计算在过去一个月中至少参与了20场战斗的玩家"
    );
    translation.set(
        'Активным считается игрок, который провёл хотя бы один бой за последний день.',
        "活跃玩家是指在前一天完成至少一场战斗的玩家"
    );
    translation.set(
        'Операции — это особый тип боя, один из видов сценарных боёв. Для участия в них необходимо выбрать соответствующий тип боя в Порту.',
        "行动模式是特殊类型的剧情。若要参与，您需要在港口中选择相应的战斗模式"
    );
    translation.set(
        'Получить дополнительную информацию о Морском сражении и зарегистрировать клан для участия в нём можно в разделе «Морское сражение».',
        "您可以找到有关海军大战的更多信息，并在“海军大战”部分下注册军团参加"
    );
    translation.set(
        'овые бои — это особый тип боя, в котором команда игроков клана сражается против команды из другого клана. Для участия в овых боях необходимо выбрать соответствующий тип боя в Порту. Правила и рейтинг кланов доступны в разделе «овые бои».',
        "军团战是一种特殊的战斗类型，您可以与军团队友组队对抗其他军团。 要参加军团战，您需要在港口中选择此模式。 规则和军团评分可在“军团战”部分中找到。"
    );
    translation.set(
        'Выполните все задачи клана и соберите награды',
        "完成全部军团任务",
    );
    translation.set('Задача не выполнена', "任务仍未完成");

    

    
    detect_elements.add([".wru__Tabs__tabContent", {}]);
    detect_elements.add([".DescriptionClanstars_descriptionTitle_3zNm1", {}]);
    detect_elements.add([".DescriptionClanstars_descriptionText_IdiW7", {}]);
    detect_elements.add([".ViewClanStarsPersonal_title_2vxsD", {}]);
    detect_elements.add([".ViewClanStarsPersonal_text_3kx9n span", {}]);
    detect_elements.add([".ClanStarsRules_title_1IAOR", {}]);
    detect_elements.add([".ClanStarsRules_description_37x4U", {}]);
    detect_elements.add([
        "#wows-react-tooltip-body .Reward_header_2bykr span span",
        {},
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .Reward_tooltipDescriptionWrapper_2NEal div",
        {},
    ]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__header", {}]);

    detect_elements.add([
        "#wows-react-tooltip-body .Reward_tooltipFooter_MJe4g",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [["Не хватает:", "需要："]],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .ClanMember_task_3dKtn div",
        {
            isReplace: true,
            translation: [
                ["Победить в бою", "战斗胜利"],
                ["Получить достижение", "获得成就"],
                ["«Слаженная атака»", "“协同攻击”"],
                ["«Плечом к плечу»", "“并肩奋战”"],
            ],
        },
    ]);
    detect_elements.add([
        ".ViewClanStarsClanResults_wrapper_1oHYE .wru__Table__th",
        {
            isReplace: true,
            translation: [
                ["Игрок", "玩家"],
                ["Результат", "结果"],
            ],
        },
    ]);
    detect_elements.add([
        ".ClanStarsRules_description_37x4U",
        {
            isReplace: true,
            translation: [
                [
                    "В рамках события «Звезда отряда» вы можете получать награды, сражаясь в одном отряде с участниками вашего клана. Награды выдаются за заработанные звёзды. Все награды можно получить до конца обновления ",
                    "军团星活动中，您可以和军团战友通过组队作战来获取奖励。赢取星星获得奖励。您可以获得所有的奖励直到版本更新后结束。结束版本号：",
                ],
            ],
        },
    ]);

    translation.set("ЗВЕЗДА ОТРЯДА", "逐星之队");
    translation.set("РЕЗУЛЬТАТЫ КЛАНА", "军团成果");
    translation.set("ПРАВИЛА", "规则");
    translation.set("Собирайте друзей", "招集您的好友");
    translation.set("Играйте в отряде", "组建小队进行游戏");
    translation.set("Получайте награды", "获取奖励");
    translation.set(
        "Создавайте отряды и играйте с друзьями из клана.",
        "建立小队并和您的军团成员一同战斗"
    );
    translation.set(
        "Выполняйте задачи в составе отряда и получайте звёзды.",
        "作为小队的一员完成战斗获取星星"
    );
    translation.set(
        "Получите награду, набрав определённое количество звёзд.",
        "获取一定数量的星星来获取奖励"
    );
    translation.set("Награды", "奖励");
    translation.set("Получайте звёзды и соответствующие награды.", "获得星星和相应奖励。");
    translation.set("Всего получено:", "总共收到：");
    translation.set("Получение звёзд", "如何获取星星");
    translation.set(
        "Чтобы получить звёзды, вам необходимо выполнять определённые задачи в составе отряда со следующими участниками клана:",
        "如果想要获取星星，您需要和以下的军团战友们一起组建小队完成任务"
    );
    translation.set("Награда за получение", "获取星星得到的奖励");
    translation.set("Кредиты", "银币");
    translation.set("Малый контейнер", "小型补给箱");
    translation.set("Sierra", "Sierra信号旗");
    translation.set("Стандартный сигнал", "普通信号旗");
    translation.set("Элитный опыт командиров", "精英指挥官经验");
    translation.set("Контейнер «Дальние странствия»", "遥远之旅补给箱");
    translation.set("Сталь", "钢铁");
    translation.set("Нефть", "石油");
    translation.set("Уголь", "煤炭");
    translation.set("Дублоны", "金币");
    translation.set(
        "За выполнение задач в отряде с этим игроком можно получить звёзды.",
        "您可以和该玩家通过完成小队任务来获取星星"
    );
    translation.set("О событии «Звезда отряда»", "关于逐星之队活动"),
        translation.set("Как зарабатывать звёзды?", "如何获取星星");
    translation.set(
        "Соберите отряд и отправляйтесь в бой!",
        "组建小队然后进入战斗！"
    );
    translation.set("Смена клана", "变更军团");
    translation.set(
        "Зарабатывайте звёзды за выполнение задач, сражаясь в отряде с участниками вашего клана. Чтобы посмотреть список задач, доступных для выполнения с каждым участником клана, наведите курсор на его имя. За бой можно выполнить несколько задач с несколькими участниками клана в одном отряде.",
        "和军团战友们组队完成任务获取星星。将鼠标移动到战友的名字上就可以查看和该战友可完成的任务列表。您可以和多个军团战友组队，在一场战斗中完成多个任务。"
    );
    translation.set(
        "На странице события отображаются имена участников вашего клана. Выберите любого участника из списка и начните с ним чат, чтобы пригласить в отряд.",
        "活动页面中显示了您的军团战友名单。从列表中任意选择战友开启对话，然后邀请他们加入小队。"
    );
    translation.set(
        "При смене клана ранее полученные звёзды и награды сохраняются. Вы можете продолжить зарабатывать звёзды и получать награды, сражаясь в отряде вместе с участниками нового клана.",
        "变更军团后，您之前获取的星星和奖励也将继续保留。您可以继续和新的军团战友一起参与战斗获取奖励。"
    );

    

    

    detect_elements.add([
        ".BattleSelector_container_3lgyI .BattleSelector_battleSelector_1Lpum",
        {},
    ]);
    detect_elements.add([".BattleSelector_container_3lgyI .wru__Menu__item", {}]);
    detect_elements.add([".Ratings_item_3MIs9 dt", {}]);
    detect_elements.add([
        "#members-table-control-block-sticky-container .wru__Toggle__toggle",
        {},
    ]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__header", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__body", {}]);
    detect_elements.add([".Tooltip_tooltip_1s2X5 .Tooltip_body_2dtFl p", {}]);
    detect_elements.add([".Members_membersControlBlock_LDipS .wru__ButtonGroup__group .wru__Button__inner span", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__header", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .MembersOperationDialog_center_sbmXV .MembersOperationDialog_title_2M14r", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__header", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__body div p dt", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__body div p dd", {}]);
    detect_elements.add([".wru__Table__table .wru__Table__tbody .wru__Table__tr .wru__ContextMenu__menu .wru__ContextMenu__inner .wru__ContextMenu__item", {}]);

    detect_elements.add([
        "#members-table-control-block-sticky-container .MembersTableHead_itemText_1SHKR",
        {
            isReplace: true,
            translation: [
                ["Игрок", "玩家"],
                ["Дни", "天"],
            ],
        },
    ]);
    detect_elements.add([
        "#members-table-control-block-sticky-container .wru__Table__value",
        {
            isReplace: true,
            translation: [
                ["Командующий", "军团长"],
                ["Заместитель командующего", "副军团长"],
                ["Военком", "招募官"],
                ["Курсант", "海军少尉"],
                ["Сегодня", "今天"],
                ["Вчера", "昨天"],
                ["д", "天"],
            ],
        },
    ]);
    detect_elements.add([
        ".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .MembersOperationDialog_center_sbmXV .MembersOperationDialog_select_fP_cT .wru__Menu__item div",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["Командующий", "军团长"],
                ["Заместитель командующего", "副军团长"],
                ["Военком", "招募官"],
                ['Кадровый офицер', "现役军官"],
                ['Офицер', "前线军官"],
                ['Курсант', "海军少尉"],
            ]
        }
    ])

    translation.set("Случайный бой", "随机战");
    translation.set("Кооперативный бой", "联合作战");
    translation.set("Ранговый бой", "排位战");
    translation.set("Ранговый бой [old]", "排位战（旧）");
    translation.set("Клановые бои", "军团战");
    translation.set("Клановый блиц", "军团对决");
    translation.set("Количество боёв", "战斗场次");
    translation.set("Победы", "胜率");
    translation.set("Игроков в клане", "军团中的玩家");
    translation.set("Опыт за бой", "场均经验");
    translation.set("Урон за бой", "场均伤害");
    translation.set("Рекорд сезона", "赛季纪录");
    translation.set("Серия побед", "连胜");
    translation.set("Перейти к моей позиции", "前往我的排名");
    translation.set("Статистика клана", "军团统计");
    translation.set(
        "Статистические показатели клана расcчитываются как среднее арифметическое показателей игроков клана.\n\nКогда статистика игрока скрыта, количество заработанных им баррелей нефти остаётся доступным для просмотра командующему и заместителям командующего.\n\nВ статистике клана не учитывается скрытая статистика игрока, если только он один скрыл свою статистику в этом клане.\n\nЕсли в клане только один игрок, и он скрыл свою статистику, то статистика этого клана тоже будет скрыта.",
        "军团参数会以所有军团成员的平均数据来计算。\n\n如果玩家隐藏他们的统计，军团长和副军团长仍然可以看到他们获得的石油桶数。\n\n如果只有这一名军团成员隐藏了他的统计数据，则该玩家的数据不会被列入军团统计。\n\n如果军团只有一位成员且这位成员隐藏了他的统计数据，军团统计数据也会被隐藏。"
    );
    translation.set(
        "Выбрать тип боя для отображения статистики",
        "选择要显示统计数据的战斗类型"
    );
    translation.set(
        "Среднее количество боёв на игрока клана в выбранном типе боёв за всё время",
        "平均每位军团成员在所选战斗类型中的战斗场次"
    );
    translation.set(
        "Средний процент побед на игрока клана в выбранном типе боёв за всё время",
        "平均每位军团成员在所选战斗类型中的平均胜率"
    );
    translation.set(
        "Средний опыт за бой на игрока клана в выбранном типе боёв за всё время",
        "平均每位军团成员在所选战斗类型中的每场战斗经验"
    );
    translation.set(
        "Количество игроков в клане / Максимальная численность клана",
        "军团成员数 / 军团最大成员数"
    );
    translation.set(
        "Средний урон за бой на игрока клана в выбранном типе боёв за всё время",
        "平均每位军团成员在所选战斗类型中的场均伤害"
    );
    translation.set("Должность", "职务");
    translation.set(
        "Количество баррелей нефти, заработанной в составе клана",
        "在此军团中获得的石油桶数"
    );
    translation.set(
        "Количество боёв в выбранном типе боёв за всё время",
        "在全部时间内，所选战斗模式的战斗场次"
    );
    translation.set(
        "Процент побед в выбранном типе боёв за всё время",
        "在全部时间内，所选战斗类型的平均胜场/战斗场次比率"
    );
    translation.set(
        "Средний опыт за бой в выбранном типе боёв за всё время",
        "在全部时间内，所选战斗类型的场均经验"
    );
    translation.set(
        "Средний урон за бой в выбранном типе боёв за всё время",
        "在全部时间内，所选战斗类型的场均伤害"
    );
    translation.set(
        "Среднее количество уничтоженных кораблей за бой в выбранном типе боёв за всё время",
        "在全部时间内，所选战斗类型的场均敌舰击毁数"
    );
    translation.set("Количество дней в клане", "在军团中的天数");
    translation.set("Время последнего боя", "上次参与战斗的时间");
    translation.set('ИЗМЕНИТЬ ДОЛЖНОСТЬ', "更改职位");
    translation.set('ИСКЛЮЧИТЬ', "踢出军团");
    translation.set('Исключить игроков из клана:', "将以下玩家踢出军团：");
    translation.set('СМЕНА ДОЛЖНОСТИ', "更改职位");
    translation.set('Изменить должность игроков:', "要更改职位的玩家：");
    translation.set('Назначить на должность:', "更改为该职位：");
    translation.set('Должности и полномочия', "职务与权限");
    translation.set('Командующий', "军团长");
    translation.set('Заместитель командующего', "副军团长");
    translation.set('Военком', "招募官");
    translation.set('Кадровый офицер', "现役军官");
    translation.set('Офицер', "前线军官");
    translation.set('Курсант', "海军少尉");
    translation.set(
        'Полный набор полномочий. Управление кланом, его ресурсами и составом, постройка зданий на клановой базе.',
        "全面的权限，包括军团本身、资源、人员的管理以及在海军基地中的建筑设施。"
    );
    translation.set(
        'Те же полномочия, что и у командующего, за исключением роспуска клана.',
        "除了解散军团外，其他权限等同于军团长。"
    );
    translation.set(
        'Приглашение и принятие в клан.',
        "可以发送军团邀请或接受军团申请。"
    );
    translation.set(
        'Без полномочий.',
        "没有权限。"
    );
    translation.set('ИЗМЕНИТЬ', "更改");
    translation.set('Отправить сообщение', "发送消息");
    translation.set('Профиль', "账号信息");
    translation.set('Копировать никнейм', "复制昵称");
    translation.set('Изменить должность', "更改职位");
    translation.set('Исключить из клана', "踢出军团");
    translation.set('ИСКЛЮЧЕНИЕ ИЗ КЛАНА', "踢出军团");


    

    

    detect_elements.add([".ViewPromo_title_3BwR7", {}]);
    detect_elements.add([".ViewPromo_secondTitle_Zjs-J", {}]);
    detect_elements.add([".ViewPromo_bonusDescription_3v7A7", {}]);
    detect_elements.add([".ViewPromo_descriptionText_fB5IN", {}]);
    detect_elements.add([".ViewPromo_bonusCategoryTitle_BozTA", {}]);
    detect_elements.add([".wru__Button__inner span", {}]);
    detect_elements.add([".ViewPromo_descriptionBlockTitle_coroH", {}]);
    detect_elements.add([".ViewPromo_descriptionBlockText_1oq16", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__header", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__body", {}]);

    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body .ViewPromo_topWrapper_17OD9",
        {
            isReplace: true,
            translation: [
                ["Позволяет распределять ресурсы клана и регулярные награды.", "允许您分配军团资源和奖励"],
                ["Максимальная численность клана: ", "军团最大成员数："],
                [
                    ". Есть возможность играть в овых боях, используя второй рейтинг",
                    "。可以参加更高一级军团战",
                ],
                ["от стоимости обслуживания кораблей I–X уровней", "I-X级战舰的维护费用"],
                ["от стоимости исследуемых кораблей I–X уровней", "I-X级可研发战舰的购买价格"],
                ["к опыту за бой на кораблях I–X уровней", "I-X级战舰参加战斗获得的经验"],
                ["к свободному опыту за бой на кораблях I–X уровней", "I-X级战舰参加战斗所得的全局经验收益"],
                ["к опыту командира за бой", "参加战斗所得的指挥官经验收益"],
                ["к количеству получаемого угля", "军团成员获得的煤炭量"],
                ["Символизирует успех и достижения вашего клана.", "象征着您所在军团的战功与成就。"],
                [
                    "Отображает активность клана в Случайных, Ранговых и Кооперативных боях за последний месяц",
                    "显示您军团成员上个月在随机战、排位战和联合作战中的活跃水平",
                ],
            ],
        },
    ]);

    translation.set("ЗАЧЕМ НУЖЕН КЛАН?", "为什么要加入军团");
    translation.set("Скидки и бонусы", "折扣和加成");
    translation.set("Командная игра", "团队合作");
    translation.set("Уникальные награды", "独特的奖励");
    translation.set(
        "Просто играйте в ваши любимые типы боя и получайте дополнительный опыт за бой, скидки на исследуемые корабли и многие другие бонусы!",
        "无论进行什么类型的战斗都可以获得额外的经验值，还有可研发战舰购买价格的折扣，以及更多加成！"
    );
    translation.set(
        "С помощью клана вы не только найдёте себе товарищей для игры в отряде, но и получите доступ к особому типу боя ― Клановые бои.",
        "军团不仅能帮助您找到小队模式的队友，还能让您参与军团战这一特别的战斗类型。"
    );
    translation.set(
        "Играйте в клане, получайте ресурсы и обменивайте их на уникальные корабли и другое полезное имущество!",
        "加入军团，获得资源，并兑换为独特战舰和其他有用道具！"
    );
    translation.set("ХОЧУ В КЛАН", "加入军团");
    translation.set("ПОДБОР КЛАНА", "军团搜寻");
    translation.set("Рекомендательная система", "推荐系统");
    translation.set(
        "Хотите вступить в клан, который регулярно участвует в Клановых боях, или просто найти товарищей для игры в отряде?",
        "想要加入经常参与军团战的军团吗？或者想寻找能一起进行小队模式的队友？"
    );
    translation.set(
        "Тогда смело нажимайте кнопку «Xочу в клан», и вам подберут несколько наиболее подходящих вам кланов на основе ваших игровых предпочтений и личной статистики.",
        "不要犹豫，马上点击“加入军团”按钮。我们会根据您的游戏偏好和个人统计数据，为您推荐几个最适合您的军团。"
    );
    translation.set("Корабли", "战舰");
    translation.set("Опыт", "经验");
    translation.set("Ресурсы", "资源");
    translation.set("Достижения", "成就");
    translation.set("Активные бонусы вашего клана", "所在军团的活跃奖励");
    translation.set("О КЛАНОВОЙ БАЗЕ", "关于军团基地");
    translation.set("ОБНОВЛЁННАЯ КЛАНОВАЯ БАЗА", "升级后的军团基地");
    translation.set("С друзьями к победе", "与好友组队向胜利进发");
    translation.set(
        "Новые строения, новые возможности!",
        "新的建筑会带来新的能力！"
    );
    translation.set("Ресурсы и награды", "资源与奖励");
    translation.set(
        "Хотите быть в курсе достижений товарищей по клану? На вкладке «Состав клана» вы можете посмотреть не только имена и должности всех соклановцев, но также их статистику по каждому типу боя и количество заработанной нефти.",
        "想时刻关注军团战友获得的成就吗？在“军团成员”页面中，您不仅可以查看全部军团成员的名字和职务，还可以查看他们每种战斗类型的统计数据和获得的石油数量。"
    );
    translation.set(
        "Ещё больше бонусов! Дополнительный опыт для командира, а также увеличенная добыча стали и угля. Строения теперь компактно отображены справа, и вы легко сможете следить за состоянием базы.",
        "还有更多加成！指挥官获得额外经验值，钢铁和煤炭的产量也会得到提升。建筑现在显示在右侧的紧凑视图中，您可以轻松追踪基地的状态。"
    );
    translation.set(
        "В игре «Мир кораблей» есть различные ресурсы, которые можно обменять на уникальное или просто полезное имущество. А с помощью клана вы можете заработать их существенно больше, приняв участие в Клановых боях или построив определённые здания в Военно-морской базе.",
        "《战舰世界》中有各种可以用于兑换独特奖励和实用道具的资源。加入军团并参与军团战，或在海军基地中建造特定建筑，即可获得大量额外物品。"
    );
    translation.set(
        "Нефть — Клановый ресурс для возведения строений на Военно-морской базе. Зарабатывается при получении контейнеров, а также за некоторые боевые задачи.",
        "石油——用于在海军基地建造建筑的军团资源。可通过收到补给箱和执行某些作战任务获得。"
    );
    translation.set(
        "Уголь — Персональный ресурс, который обменивается на большинство предметов в Адмиралтействе. Его можно получить из контейнеров, а также за различные боевые задачи.",
        "煤炭——一种个人资源，可在兵工厂兑换数量众多的物品。它可以从补给箱以及各种作战任务中获得。"
    );
    translation.set(
        "Сталь — Персональный ресурс, который обменивается на некоторые корабли в Адмиралтействе, а также может быть конвертирован в значительное количество угля. Его можно получить в Клановых и Ранговых боях, а также в суперконтейнерах.",
        "钢铁——一种个人资源，可在兵工厂兑换一些战舰，也可转化为大量煤炭。它可以在军团战、排位战以及超级补给箱中获得。"
    );
    translation.set(
        "Чемпионские жетоны — Персональный ресурс, который обменивается на постоянные камуфляжи для определённых кораблей в Адмиралтействе. Его можно получить за высокие результаты в Ранговых и Клановых боях.",
        "冠军代币——一种个人资源，可在兵工厂为某些战舰换取永久涂装。在排位战和军团战中取得优异成绩即可获得。"
    );
    translation.set("Казначейство", "库房");
    translation.set("Дом офицеров", "军官宿舍");
    translation.set("Сухой док", "干船坞");
    translation.set("Судостроительный завод", "造船厂");
    translation.set("Военно-морское училище", "海军学院");
    translation.set("Конструкторское бюро", "研发局");
    translation.set("Академия", "指挥官学院");
    translation.set("Угольный порт", "煤炭港");
    translation.set("Ростральная колонна", "海战纪念柱");
    translation.set("Флот снабжения и поддержки", "辅助舰队");

    

    

    detect_elements.add([".ViewRecommendations_pageTitle_cAiCW", {}]);
    detect_elements.add([".ViewRecommendations_pageSubTitle_1BL_A", {}]);
    detect_elements.add([".wru__ErrorLoad__message", {}]);
    detect_elements.add([".wru__Button__inner span", {}]);
    detect_elements.add([".wru__Toggle__toggle", {}]);
    detect_elements.add([".wru__CheckboxWithLabel__checkboxLabel", {}]);
    detect_elements.add([".wru__Dialog__header", {}]);
    detect_elements.add([".ViewRecommendations_sectionTitle_2klzs", {}]);
    detect_elements.add([".CategoryCard_title_1zCHL", {}]);
    detect_elements.add([".CategoryCard_text_Fb1Wp", {}]);
    detect_elements.add([".CategoryCard_settingsTitle_1rAhD", {}]);
    detect_elements.add([".RecommendationsTable_tableTitle_3QLJr", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__footer", {}]);

    detect_elements.add([
        ".RecommendationsTable_header_1AUSO",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["Рекомендуемые кланы", "推荐军团"],
                ["Изменить условия подбора", "更改搜索条件"],
                ["Оставшееся количество заявок в кланы на сегодня:", "您今天还有"],
                [".", "次军团申请机会。"],
            ],
        },
    ]);

    detect_elements.add([
        ".RecommendationsTable_wrapper_3T9-m .wru__Table__th div",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["Название", "军团名称及标签"],
                ["Совпадение", "匹配度"],
                ["Игроки", "玩家数"],
                ["Общение", "交流"],
                ["Отправить запрос", "发送请求"],
            ],
        },
    ]);

    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["Клан", ""],
                ["идеально подходит.", "军团的匹配程度完美。"],
                ["отлично подходит.", "军团的匹配程度极好。"],
                ["будет очень хорошим выбором.", "军团的匹配程度良好。"],
                ["подходит.", "军团的匹配程度一般。"],
                ["не&nbsp;очень подходит.", "军团的匹配程度不佳。"],
                [
                    "не&nbsp;лучший вариант. Рекомендуем изменить условия подбора.",
                    "军团不是您最好的选择。我们推荐您更改搜索条件。",
                ],
            ],
        },
    ]);

    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body .wru__Message__message",
        {
            isReplace: true,
            translation: [["Вы уже состоите в клане", "您已经是军团成员"]],
        },
    ]);

    translation.set("ВСТУПАЙТЕ В КЛАН", "加入军团");
    translation.set(
        "Вступайте в кланы, сражайтесь за ресурсы и получайте уникальные награды, а также клановые бонусы!",
        "加入军团，为争夺资源而战，获得独特的奖励和军团加成！"
    );
    translation.set(
        "Чтобы просматривать рекомендации, войдите на сайт",
        "请先在网站登录，再查看推荐信息"
    );
    translation.set("ВОЙТИ", "登录");
    translation.set("ДРУГИЕ КЛАНЫ", "其他军团");
    translation.set(
        "Если ваши игровые предпочтения изменились или вы просто хотите сменить клан, воспользуйтесь Рекомендательной системой и подберите себе новый клан.",
        "如果您的喜好发生了改变或者想更换军团，请在推荐系统中选择一个新的军团"
    );
    translation.set("МОИ ПРЕДПОЧТЕНИЯ", "我的偏好");
    translation.set("НИКАКИХ ОБЯЗАТЕЛЬСТВ", "不强制");
    translation.set("ИГРА В ОТРЯДЕ", "组队战斗");
    translation.set("КЛАНОВЫЕ БОИ", "军团战");
    translation.set(
        "Вступайте в клан и получайте экономические бонусы.",
        "加入军团获得经济收益加成。"
    );
    translation.set(
        "Сражайтесь вместе с боевыми товарищами, которые готовы в любой момент поддержать огнём и советом.",
        "与队友并肩作战，他们会随时为您提供建议和火力支援。"
    );
    translation.set(
        "Побеждайте в клановых событиях и получайте награды — от ценных ресурсов до уникальных кораблей.",
        "在军团活动中取得胜利，获得珍贵资源和独特战舰等奖励。"
    );
    translation.set("ПОДОБРАТЬ КЛАН", "找到军团");
    translation.set("Подобрать клан", "找到军团");
    translation.set("Общение", "交流");
    translation.set("Изменить", "编辑");
    translation.set("Готов использовать голосовой чат", "准备使用语音聊天");
    translation.set("ЯЗЫК ОБЩЕНИЯ", "交流语言");
    translation.set("СОХРАНИТЬ", "保存");
    translation.set("ЗАКРЫТЬ", "关闭");
    translation.set("Перейти к клановой базе", "前往军团基地");

    

    

    detect_elements.add([".ViewTreasury_pageTitle_1LZzi", {}]);
    detect_elements.add([".ClanBalance_label_A1e-z", {}]);
    detect_elements.add([".wru__Tabs__tabContent", {}]);
    detect_elements.add([".ViewTreasury_regularRewards_OoEXg span", {}]);
    detect_elements.add([".History_noTransactionsTitle_1nuXy", {}]);
    detect_elements.add([".History_spendLabel_3h2jD", {}]);
    detect_elements.add([".History_opacityTitle_QD_Yi", {}]);
    detect_elements.add([".History_rowTextDark_1OXzv", {}]);
    detect_elements.add([".RegularReward_title_2QYsB", {}]);
    detect_elements.add([".RegularReward_descr_29YWP", { isReplaceHTML: true }]);
    detect_elements.add([".RegularReward_wrapper_14wkt .wru__Message__message", {}]);

    detect_elements.add([
        ".RegularReward_interval_6FOs9",
        {
            isReplace: true,
            translation: [
                ["Доступно 1 раз в ", ""],
                ["дней", "天可用一次"],
                ["Доступно любое количество", "您可以购买任意数量"],
            ],
        },
    ]);
    detect_elements.add([
        ".RegularReward_price_2t_gJ",
        {
            isReplace: true,
            translation: [["Стоимость", "费用"]],
        },
    ]);

    translation.set("Ресурсы клана", "军团资源");
    translation.set("У ВАС ЕЩЁ НЕТ НИ ОДНОЙ ТРАНЗАКЦИИ", "您还没有任何交易");
    translation.set("Расходы за период:", "周期花费：");
    translation.set("Доходы за период:", "周期收入：");
    translation.set("РАСХОДЫ", "费用");
    translation.set("ДОХОД", "收入");
    translation.set("Поступления", "应收款项");
    translation.set("Награда за выполнение задач клана", "完成军团任务的奖励");
    translation.set("НАБОРЫ ДЛЯ КЛАНА", "军团礼包");
    translation.set("Больше угля для всех", "为每位军团成员发放煤炭");
    translation.set(
        "Контейнеры «Малый» для всех",
        "为每位军团成员发放“试试手气”补给箱"
    );
    translation.set("Суперконтейнеры для всех", "为每位军团成员发放超级补给箱");
    translation.set("Дополнительный уголь для всех", "为每位军团成员发放煤炭");
    translation.set(
        "Дополнительные контейнеры «Малый» для всех",
        "为每位军团成员发放一个“试试手气”补给箱"
    );
    translation.set(
        "Дополнительные суперконтейнеры для всех",
        "为每位军团成员发放一个超级补给箱"
    );
    translation.set(
        "1&nbsp;контейнер «Больше угля» каждому участнику клана.",
        "为每位军团成员发放一个煤炭补给箱"
    );
    translation.set(
        "5&nbsp;контейнеров «Малый» с&nbsp;вероятностью выпадения суперконтейнера каждому участнику клана.",
        "为每位军团成员发放一个小型补给箱"
    );
    translation.set(
        "1 суперконтейнер каждому участнику клана.",
        "为每位军团成员发放一个超级补给箱"
    );
    translation.set(
        "Приобрести наборы могут только командующий и его заместители.",
        "礼包只能由军团长或者副军团长购买。"
    );

    

    

    detect_elements.add([".Layout_section_33WpB .Requests_tablesMenuWrap_A5R5_ .wru__Tabs__container .wru__Tabs__tabContent", {}]);
    detect_elements.add([".Layout_section_33WpB .Requests_tablesMenuWrap_A5R5_ .wru__Link__link", {}]);
    detect_elements.add([".Layout_section_33WpB .wru__MessageWrap__container .wru__MessageWrap__title", {}]);
    detect_elements.add([".Layout_section_33WpB .wru__MessageWrap__container .wru__MessageWrap__message", {}]);
    detect_elements.add([".Table_sorter_1il51", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__close", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__header", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .ParameterGroup_parameterGroupTitle_1ep-d", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__footer .wru__CheckboxWithLabel__checkboxLabel", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .wru__Dialog__content .ClanSettingsDialog_purposeParameterGroup_1ZBO7 .wru__Radio__caption", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .wru__Dialog__content .wru__CheckboxWithLabel__container .wru__CheckboxWithLabel__checkboxLabel", {}]);
    detect_elements.add(["#wows-react-tooltip-body .Tooltip_body_2dtFl p span", {}]);

    detect_elements.add([
        ".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .wru__Dialog__content .ClanSettingsDialog_terms_1A8x9 p span",
        {
            isReplace: true,
            translation: [
                [
                    'В целях безопасности не указывайте здесь личную информацию о себе или о ком-либо другом, так как мы не сможем защитить её в соответствии с ',
                    "出于安全考虑，请不要在此输入有关您或其他人的个人信息，因为我们无法按照 "
                ],
                ['Политикой конфиденциальности', "隐私政策"],
                ['.', " 保护这些信息。"],
            ]
        }
    ]);
    detect_elements.add([
        ".Tooltip_tooltip_1s2X5 .Tooltip_body_2dtFl div p",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['отправил приглашение', "发送邀请于"],
                ['Время для принятия решения по приглашению истекает', "对邀请作出决定的时间将截止于"],
                ['Приглашение одобрено', "接受邀请于"],
                ['Время для принятия решения истекло', "邀请到期于"],
                ['в', "的"],
            ]
        }
    ]);
    detect_elements.add([
        ".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .wru__Dialog__content span",
        {
            isReplace: true,
            translation: [
                [
                    'Вы уверены, что хотите отозвать приглашение в клан для игрока ',
                    "您确定要撤回对下面玩家的军团邀请吗："
                ],
            ]
        }
    ]);
    detect_elements.add([
        ".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__ButtonGroup__wrapper .wru__Button__inner span",
        {
            isReplace: true,
            translation: [
                ['ДА', "是"],
                ['НЕТ', "否"],
            ]
        }
    ])

    translation.set('Заявки игроков', "玩家申请");
    translation.set('Приглашения', "发出的邀请");
    translation.set('Изменить требования клана', "更改军团要求");
    translation.set('НЕТ АКТУАЛЬНЫХ ЗАЯВОК', "目前没有申请");
    translation.set('Заявок на вступление в ваш клан пока нет.', "还没有人申请加入您的军团");
    translation.set('Статус', "状态");
    translation.set('ТРЕБОВАНИЯ КЛАНА', "军团要求");
    translation.set('Нам интересны:', "军团偏好："); 
    translation.set('Языки общения:', "交流语言：");
    translation.set('Голосовая связь:', "语音聊天：");
    translation.set('Описание клана:', "军团描述：");
    translation.set('Предлагать клан для вступления в Рекомендательной системе', "在军团推荐系统中推荐该军团");
    translation.set('Никаких обязательств', "不强制");
    translation.set('Игра в отряде', "组队战斗");
    translation.set('Клановые бои', "军团战");
    translation.set('Голосовая связь обязательна', "必须使用语音聊天");
    translation.set('Отозвать приглашение', "撤回邀请");
    translation.set('ОТМЕНА ПРИГЛАШЕНИЯ', "撤回邀请");


    

    

    detect_elements.add([".wru__Tabs__tabContent", {}]);
    detect_elements.add([".ResultsHeader_headerParamLabel_3QXST", {}]);
    detect_elements.add([".MyWarTab_historyButton_1G1uG", {}]);
    detect_elements.add([".MyWarTab_calendarButton_3Wpbd", {}]);
    detect_elements.add([".MyWarTab_navTab_3XBy6", {}]);
    detect_elements.add([".ProgressBar_title_2M0sD", {}]);
    detect_elements.add([".ProgressBar_topSign_cgakR", {}]);
    detect_elements.add([".ProgressBar_breakpointAttempts_2eUXV span", {}]);
    detect_elements.add([".ClanRatingTab_menuLeagueTitle_2bUNG", {}]);
    detect_elements.add([".wru__Link__link", {}]);
    detect_elements.add([".wru__Table__thead .wru__Table__value div", {}]);
    detect_elements.add([".RulesTab_bigTitle_3nwUZ", {}]);
    detect_elements.add([".RulesTab_paragraphTitle_2uH4p", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__body span", {}]);
    detect_elements.add([".wru__Dialog__header span span", {}]);
    detect_elements.add([".Round_roundTitle_1gkAk", {}]);
    detect_elements.add([".VersusHeader_description_MW1Ko", {}]);
    detect_elements.add([".Result_resultsHeader_W5D1W", {}]);
    detect_elements.add([".Result_resultLabel_13ySa", {}]);
    detect_elements.add([
        ".Round_ratingTable_115kz .wru__Table__thead .wru__Table__th",
        {},
    ]);
    detect_elements.add([
        ".Round_ratingTable_115kz .wru__Table__thead .wru__Table__th div",
        {},
    ]);
    detect_elements.add([
        ".Round_ratingTable_115kz .Round_ratingTableHeader_2qJeV",
        {},
    ]);
    detect_elements.add([".wru__Dialog__close", {}]);
    detect_elements.add([".MyWarTab_countdownDescription_29jdH", {}]);
    detect_elements.add([".wru__CountDown__daysLabel", {}]);
    detect_elements.add([".MyWarTab_countdownLabel_3SJiK", {}]);
    detect_elements.add([".Calendar_seasonTitle_2FeGz span", {}]);
    detect_elements.add([".Calendar_dayTitle_1CAx6", {}]);
    detect_elements.add([".Calendar_stageName_3kA3z", {}]);
    detect_elements.add([".Calendar_legendDescription_2Te1T", {}]);

    detect_elements.add([
        ".MyWarTab_date_1H-Me span",
        {
            isReplace: true,
            translation: [["МОРСКОЕ СРАЖЕНИЕ: ", "海军大战："]],
        },
    ]);
    detect_elements.add([
        ".ProgressBar_target_zCB2K span",
        {
            isReplace: true,
            translation: [
                ["Нанесите", "造成"],
                ["урона.", "点伤害"],
                ["Заработайте", "获得"],
                ["чистого опыта.", "点基础经验"],
            ],
        },
    ]);
    detect_elements.add([
        ".ClanRatingTab_leaguePickerRow_u9ZGX .wru__Menu__item",
        {
            isReplace: true,
            translation: [
                ["Лучший экипаж", "最佳乘员"],
                ["Морские волки", "海狗"],
                ["Ветераны", "老兵"],
                ["Старая гвардия", "保守势力"],
                ["Последний рубеж", "背水一战"],
            ],
        },
    ]);
    detect_elements.add([
        ".RulesTab_paragraphText_1ffRU",
        {
            isReplace: true,
            translation: [
                ["В первые", "在海军大战的前"],
                [
                    "дня Морского сражения вы участвуете в привычных боях. Выполните клановую задачу, чтобы получить доступ к Битве и",
                    "天里，您仅需简单地参加常规战斗。完成军团任务以参与交战并获得"
                ],
                [
                    ". При этом можно также увеличить количество попыток для этапа Битвы.",
                    "。在此期间，您同样也可以增加您参与交战阶段的尝试次数。"
                ],
                ["В следующие", "在接下来的"],
                [
                    "дня вы можете соревноваться с другим кланом в нанесении урона на кораблях разных классов и наций. Для этого у каждого игрока есть не менее",
                    "天，使用不同类型和国家的战舰与其他军团进行伤害输出竞赛。为了这个目标，每名玩家可进行"
                ],
                [
                    "попыток.",
                    "次尝试。进入战斗前，您需要开启尝试计数器，它位于军团战果表格的上方。"
                ],
                [
                    "Все кланы, участвующие в Морском сражении, получают нефть в качестве награды и продвигаются в рейтинге.",
                    "所有参加海军大战的军团根据进度和评级获得相应数量的石油。"
                ],
            ],
        },
    ]);
    detect_elements.add([
        ".RulesTab_step_s7SFD p",
        {
            isReplace: true,
            translation: [
                [
                    "дня вы можете соревноваться с другим кланом в получении чистого опыта на кораблях разных классов и наций. Для этого у каждого игрока есть не менее",
                    "天，使用不同类型和国家的战舰与其他军团进行勋带获取竞赛。为了这个目标，每名玩家可进行"
                ],
                [
                    "Вы можете увеличить количество попыток на этапе Подготовки. ",
                    "您可以在准备阶段增加可用的尝试次数。"
                ],
                [
                    "Часть израсходованных попыток обновляется и может быть снова использована во время Битвы. Таким образом, играя в течение всех дней Битвы, вы можете использовать больше попыток.",
                    "您在交战阶段用掉的一些尝试次数可能会被刷新，并可以再次使用。在交战阶段每日进行游戏，也会为您提供更多尝试次数。"
                ],
            ],
        },
    ]);
    detect_elements.add([
        ".RulesTab_step_s7SFD p strong",
        {
            isReplace: true,
            translation: [
                [
                    "Перед выходом в бой необходимо включить счётчик использования попыток, расположенный над таблицей с результатами клана.",
                    "进入战斗前，您需要开启尝试计数器，它位于军团战斗结果表的上方。",
                ],
            ],
        },
    ]);
    detect_elements.add([
        ".we-tooltip__description",
        {
            isReplace: true,
            translation: [
                ["Количество: ", "数量："],
                [
                    "Награда, полученная кланом за все Морские сражения",
                    "军团收到的所有海军大战奖励",
                ],
            ],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body",
        {
            isReplace: true,
            translation: [
                ["Рейтинг клана в режиме «Морское сражение»", "海军大战模式的军团评级"],
                [
                    "Количество Битв, в которых клан принял участие",
                    "军团参加角逐的次数",
                ],
                [
                    "Максимальное количество планок, взятых кланом в течение одной Битвы",
                    "单次角逐中，军团清除的最高进度条数量",
                ],
                ["История прошедших раундов", "前一轮的历史"],
                ["Расписание этапов Морского сражения", "海军大战各阶段时间表"],
                ["Попытки: ", "尝试："],
                [
                    "Полученные попытки можно использовать на этапе Битвы.",
                    "您可以在交战阶段使用获取的尝试次数。",
                ],
                [
                    "Выбрать лигу для отображения статистики",
                    "选择一个联盟段位来查看统计",
                ],
            ],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__header.wru__Tooltip__isBold span",
        {
            isReplace: true,
            translation: [
                ["Этап", "阶段"],
                ["урона", "伤害"],
                ["опыта", "经验"],
            ],
        },
    ]);

    translation.set("Морское сражение", "海军大战");
    translation.set("МОРСКОЕ СРАЖЕНИЕ", "海军大战");
    translation.set("Морское сражение: ", "海军大战：");
    translation.set("МОРСКОЕ СРАЖЕНИЕ: ", "海军大战：");
    translation.set("Рейтинг кланов", "军团评级");
    translation.set("РЕЙТИНГ КЛАНОВ", "军团评级");
    translation.set("Правила", "规则");
    translation.set("ПРАВИЛА", "规则");
    translation.set("Рейтинг", "评级");
    translation.set("РЕЙТИНГ", "评级");
    translation.set("Рекорд", "纪录");
    translation.set("Награда", "奖励");
    translation.set("НАГРАДА", "奖励");
    translation.set("Задача клана", "军团任务");
    translation.set("Попытки", "尝试");
    translation.set("ИСТОРИЯ", "历史");
    translation.set("КАЛЕНДАРЬ", "日程表");
    translation.set("ПОДГОТОВКА", "准备");
    translation.set("БИТВА", "角逐");
    translation.set("Нанесённый урон", "造成伤害");
    translation.set("Ваш вклад", "您的贡献");
    translation.set("Морские сражения", "海军大战");
    translation.set(
        "Ваш клан успешно выполнил задачу клана на этапе Подготовки.",
        "您的军团成功在准备阶段完成了军团任务。"
    );
    translation.set("дня", "天");
    translation.set("до начала Битвы", "角逐开始前");
    translation.set("Лучший экипаж", "最佳乘员");
    translation.set("Морские волки", "海狗");
    translation.set("Ветераны", "老兵");
    translation.set("Старая гвардия", "保守势力");
    translation.set("Последний рубеж", "背水一战");
    translation.set("Лидеры сезона", "赛季领先玩家");
    translation.set("Перейти к позиции моего клана", "前往我所在军团的排名");
    translation.set("КАК ИГРАТЬ В МОРСКОЕ СРАЖЕНИЕ", "我该如何参加海军大战？");
    translation.set("Подготовка", "准备");
    translation.set("НАГРАДЫ И РЕЙТИНГ", "奖励和评级");
    translation.set("Расширенный вариант правил", "完整版规则");
    translation.set("Награда за этап:", "该阶段奖励：");
    translation.set("ГРУППОВОЙ ЭТАП", "小组阶段");
    translation.set("Победа", "胜利");
    translation.set("ПОБЕДА", "胜利");
    translation.set("МЕСТО\nВ ГРУППЕ", "组内\n排行");
    translation.set("ПОЛУЧЕНО ЗА МОРСКОЕ СРАЖЕНИЕ", "通过海军大战获得");
    translation.set("УЧАСТНИКИ СРАЖЕНИЯ", "海军大战参与者");
    translation.set("ГРУППОВЫЕ РЕЗУЛЬТАТЫ", "小组结果");
    translation.set("Игрок", "玩家");
    translation.set("Результат", "结果");
    translation.set("Лучшая планка", "最佳进度条");
    translation.set("Сражения", "角逐");
    translation.set("Дата боя", "战斗日期");
    translation.set("КАЛЕНДАРЬ МОРСКИХ СРАЖЕНИЙ ЗА", "海战日程表");
    translation.set("Текущий раунд: ", "当前回合：");
    translation.set("Понедельник", "星期一");
    translation.set("Вторник", "星期二");
    translation.set("Среда", "星期三");
    translation.set("Четверг", "星期四");
    translation.set("Пятница", "星期五");
    translation.set("Суббота", "星期六");
    translation.set("Воскресенье", "星期日");
    translation.set("ПОДГОТОВКА", "准备");
    translation.set("БИТВА", "角逐");
    translation.set("ПОДБОР СОПЕРНИКОВ", "选择对手");
    translation.set("ПОДВЕДЕНИЕ ИТОГОВ", "结果统计");
    translation.set(
        "Все временные интервалы в календаре указаны исходя из вашего часового пояса.",
        "日历中的所有时间均以您所在时区为准。"
    );

    

    

    detect_elements.add([".Title_title_cp_rY", {}]);
    detect_elements.add([".DotList_li_Kr284", {}]);
    detect_elements.add([
        ".Title_title_cp_rY.ClansBattlesHallFame_title_3gYhE",
        {},
    ]);
    detect_elements.add([".TopWinners_clanPosition_2hgku", {}]);
    detect_elements.add([".ClansRating_clanRegularBadge_TCd8h span", {}]);
    detect_elements.add([".LeagueSelector_leagueText_2R-PA", {}]);
    detect_elements.add([".DivisionTabs_smallText_epTvY", {}]);
    detect_elements.add([".ClansRating_clanAbsent_2zeMS", {}]);
    detect_elements.add([".Table_sorter_1il51", {}]);
    detect_elements.add([".wru__Page__header", {}]);
    detect_elements.add([".wru__Page__title", {}]);
    detect_elements.add([".wru__Page__description li", {}]);
    detect_elements.add([".TopWinners_ownClan_10Gv9 div", {}]);

    detect_elements.add([
        ".ProgressBar_rewardDescriptionRow_2iYN_",
        {
            isReplace: true,
            translation: [["Прогресс задачи: ", "任务进度："]],
        },
    ]);
    detect_elements.add([
        ".LadderSeasonsDropdown_container_2Io_a .wru__Menu__item span span",
        {
            isReplace: true,
            translation: [
                ["Сезон", "第"],
                [": ", " 赛季："],
            ],
        },
    ]);
    detect_elements.add([
        ".LeagueSelector_container_1YIGE .wru__Menu__item",
        {
            isReplace: true,
            translation: [
                ["Лига Урагана", "龙卷风联盟"],
                ["Лига Тайфуна", "飓风联盟"],
                ["Лига Шторма", "暴风联盟"],
                ["Лига Бури", "狂风联盟"],
                ["Лига Шквала", "烈风联盟"],
            ],
        },
    ]);
    detect_elements.add([
        ".TopWinners_title_kevDG",
        {
            isReplace: true,
            translation: [
                ["Сезон", "第"],
                [": «", " 赛季：«"],
            ],
        },
    ]);

    translation.set("Игроки", "玩家");
    translation.set("Клановые бои", "军团战");
    translation.set("КЛАНОВЫЕ БОИ", "军团战");
    translation.set("Зал славы", "名人堂");
    translation.set("ЗАЛ СЛАВЫ", "名人堂");
    translation.set("Награды", "奖励");
    translation.set("НАГРАДЫ", "奖励");
    translation.set("Лиги и группы", "联盟及分组");
    translation.set("ЛИГИ И ГРУППЫ", "联盟及分组");
    translation.set(
        "Клановый бой проводится между двумя отрядами.",
        "两个小队使用相同等级的战舰彼此对抗。"
    );
    translation.set(
        "В течение сезона Клановые бои проводятся в среду, четверг, субботу и воскресенье в определённое время.",
        "赛季进行期间，军团战于星期三，星期四，星期六和星期日的特定时间段开放。"
    );
    translation.set(
        "Существует 5 лиг: Шквала, Бури, Шторма, Тайфуна и Урагана. Кланы распределены в лигах по рейтингу.",
        "总共五个联盟段位：烈风、狂风、暴风、飓风、龙卷风。军团将依照各自的评级点数分到不同的联盟段位。"
    );
    translation.set(
        "Побеждая в Клановых боях, вы повышаете рейтинг вашего клана, проигрывая — понижаете.",
        "获得军团战胜利后，您所在军团的评级会提升，反之则会下降。"
    );
    translation.set(
        "За победы в Клановых боях вы будете получать сталь и другие ценные награды.",
        "在军团战中获得胜利可以获得钢铁和其他珍贵奖励。"
    );
    translation.set(
        "С завершением сезона, кланы, занявшие определённые места в рейтинге региона, получат соответствующие награды в клановую казну.",
        "赛季结束时，在地区评级中达到指定排名的军团可以在军团金库中获得对应的奖励。"
    );
    translation.set(
        "За победу в Клановом бою вы получите нефть для развития Военно-морской базы.",
        "取得军团战胜利后，您会获得建设海军基地所必须的石油资源。"
    );
    translation.set(
        "Заработав достаточное количество очков, клан переходит в более высокие группы и лиги.",
        "获得足够的评级点数后，军团可以提升到更高的分组及联盟。"
    );
    translation.set(
        "При потере очков рейтинга клан может быть понижен в группе и лиге.",
        "如果一支军团损失了评级点数，可能会导致降级至低一级的分组或联盟段位。"
    );
    translation.set(
        "Побеждайте в Клановых боях и зарабатывайте очки рейтинга.",
        "赢得军团战斗就会获得评级点数。"
    );
    translation.set(
        "Вас ждут награды в соответствии с достигнутой лигой и активностью в боях.",
        "奖励发放数目基于您的当前联盟段位和战斗中的表现。"
    );
    translation.set(
        "Выполняя специальные боевые задачи в Клановых боях, вы получите больше наград.",
        "只要完成军团战的特殊战斗任务，您就会得到更多的奖励。"
    );
    translation.set(
        "Каждая лига состоит из трёх групп (кроме лиги Урагана, в которой только одна группа). Для перехода в новую группу необходимо заработать более 100 очков рейтинга.",
        "每个联盟都分成三个组，仅有一组的龙卷风联盟除外。若想要前往更高级分组，军团必须获得超过100点评级点数。"
    );
    translation.set(
        "Набрав 100 очков рейтинга в группе I, клан начинает борьбу за переход в следующую лигу. Для перехода необходимо одержать 3 победы в серии из 5 боёв.",
        "在获得 100 点评级点数后，军团就能开始努力晋级到下一个联盟段位。若要晋级，军团需要赢得5场战斗中的3场。"
    );
    translation.set(
        "При снижение рейтинга в группе III ниже 0, клан начинает борьбу за сохранение лиги. Для сохранения лиги необходимо одержать 3 победы в серии из 5 боёв.",
        "当军团的评级点数降至第III组0分时，军团将开始保级赛。需要在5场中战胜3场才能保留联盟段位。"
    );
    translation.set(
        "За успешную борьбу за сохранение лиги вы получите дополнительные очки рейтинга, а при неудаче они отнимутся.",
        "只要成功留在该联盟中，您就会获得额外的评级点数。若是战斗失败，您将会损失评级点数。"
    );
    translation.set("Лига Урагана", "龙卷风联盟");
    translation.set("Лига Тайфуна", "飓风联盟");
    translation.set("Лига Шторма", "暴风联盟");
    translation.set("Лига Бури", "狂风联盟");
    translation.set("Лига Шквала", "烈风联盟");
    translation.set("Группа", "分组");

    translation.set(
        "В выбранном регионе ваш клан отсутствует в рейтинге",
        "您的军团不在所选地区的评级中"
    );
    translation.set(
        "Выбрать лигу для отображения статистики",
        "选择一个联盟段位来查看统计"
    );
    translation.set("Клан", "军团");
    translation.set(
        "Место клана в выбранном рейтинге и сезоне",
        "所选赛季评级中的军团位置"
    );
    translation.set("Рейтинг клана в выбранной группе", "所选分组的军团评级");
    translation.set(
        "Количество боёв в выбранном сезоне Клановых боёв",
        "特定军团战赛季的战斗场次"
    );
    translation.set("Время последнего боя в Клановых боях", "上次军团战的时间");
    translation.set("Количество побед", "胜场数");
    translation.set(
        "Выигрывает клан, набравший больше всех побед. Поражения не учитываются.",
        "胜场数较多的军团获胜。不统计失败场次。"
    );
    translation.set(
        "Время последней победы в режиме Клановых боёв",
        "上次获得军团战胜利的时间"
    );
    translation.set(
        "Если несколько кланов набрали одинаковое количество побед, то учитывается время выигрышей. Первое место в рейтинге получает клан, победивший раньше остальных.",
        "如果几个军团的胜场数相同，则计算取得胜利所用的时间。第一名给予第一个完成最后胜场的军团。"
    );
    translation.set("Количество игроков в клане", "军团成员数");
    translation.set("ПОЗДРАВЛЯЕМ ЛИДЕРОВ СЕЗОНА!", "恭喜赛季领袖！");
    translation.set("Позиция моего клана:", "我的军团排名：");
    translation.set(
        "Ваш клан отсутствует в&nbsp;рейтинге",
        "您的军团未进入评级。"
    );

    

    

    detect_elements.add([".ClanWallet_header_2XVrO", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__footer", {}]);
    detect_elements.add(["#wows-react-tooltip-body .Tooltip_body_2dtFl", {}]);
    detect_elements.add([".we-tooltip__description .we-tooltip__description-title", {}]);
    detect_elements.add(["#wows-react-tooltip-body .ViewSupply_buildingTooltipModifierTitle_nOOgS", {}]);
    detect_elements.add(["#wows-react-tooltip-body .wru__Tooltip__body", {}]);
    detect_elements.add([".ViewSupply_closeDialogButtonText_26nSG", {}]);
    detect_elements.add([".ViewSupply_headerTitleWrapper_guNnv div", {}]);
    detect_elements.add([".ViewSupply_buildingBottomInfo_1DVyX .wru__Message__message div span span", {}]);
    detect_elements.add([".ViewSupply_buildingBottomInfo_1DVyX .wru__Dialog__headerNoUnderline", {}]);
    detect_elements.add([".ViewSupply_buildingBottomInfo_1DVyX .ViewSupply_notBuiltFooterStatus_1xs1u", {}]);
    detect_elements.add([".ViewSupply_sidebarBuilding_2rWtq .Building_title_3qiR8", {}]);
    detect_elements.add([".ViewSupply_sidebarBuilding_2rWtq .Building_description_3cVri", {}]);
    detect_elements.add([".ViewSupply_sidebarBuilding_2rWtq .Building_bonus_gIuCK", {}]);
    detect_elements.add([".ViewSupply_sidebarBuilding_2rWtq .Building_bonus_gIuCK span", {}]);
    detect_elements.add([".wru__Button__inner span", {}]);
    detect_elements.add([".MonumentAchievementsDialog_headerText_1iqXN", {}]);
    detect_elements.add([".MonumentAchievementsDialog_achievementsContainer_1uvis .wru__MessageWrap__title", {}]);
    detect_elements.add([".MonumentAchievementsDialog_achievementsContainer_1uvis .wru__MessageWrap__message", {}]);
    detect_elements.add(["#wows-react-tooltip-body .LevelTooltip_subTitle_HY-cg", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__header", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__footer .wru__ButtonGroup__group .wru__Button__inner span", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .ClanEditDialogs_clanRename_1DXRB .wru__Input__info", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .ClanLeaveDialog_confirmation_2Ms94", {}]);
    detect_elements.add([".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .ClanLeaveDialog_info_2S5gs .wru__Message__message", {}]);

    detect_elements.add([
        ".we-tooltip__description",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ["В наличии:&nbsp;", "可用："],
                ["Всего получено:&nbsp;", "总共收到："],
                ["Возведение строений на&nbsp;Военно-морской базе клана.", "在军团海军基地搭建建筑"],
                [
                    "За&nbsp;участие в&nbsp;Клановых боях и&nbsp;различных активностях. Каждый раз, когда участник клана получает любой контейнер, в&nbsp;казну его клана начисляется 10&nbsp;ед. нефти.",
                    "用于参加军团战和各种活动。每当军团成员获得任何补给箱时，军团库房都会获得10个单位的石油。"
                ],
            ],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .ViewSupply_buildingTooltipHeaderText_3jRX7 div p",
        {
            isReplace: true,
            translation: [
                ['Улучшений: ', "扩建："],
                ['из', "/"],
            ],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body.wru__Tooltip__dark span span",
        {
            isReplace: true,
            translation: [
                ["Позволяет распределять ресурсы клана и регулярные награды.", "允许您分配军团资源和奖励"],
                ["Максимальная численность клана: ", "军团最大成员数："],
                [
                    ". Есть возможность играть в овых боях, используя второй рейтинг",
                    "。可以参加更高一级军团战",
                ],
                ["от стоимости обслуживания кораблей I–X уровней", "I-X级战舰的维护费用"],
                ["от стоимости исследуемых кораблей I–X уровней", "I-X级可研发战舰的购买价格"],
                ["к опыту за бой на кораблях I–X уровней", "I-X级战舰参加战斗获得的经验"],
                ["к свободному опыту за бой на кораблях I–X уровней", "I-X级战舰参加战斗所得的全局经验收益"],
                ["к опыту командира за бой", "参加战斗获得的指挥官经验"],
                ["к количеству получаемого угля", "军团成员获得的煤炭量"],
                ["Символизирует успех и достижения вашего клана.", "象征着您所在军团的战功与成就。"],
                [
                    "Отображает активность клана в Случайных, Ранговых и Кооперативных боях за последний месяц",
                    "显示您军团成员上个月在随机战、排位战和联合作战中的活跃水平",
                ],
            ],
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body .ViewSupply_tooltipProgressRow_1H1lk",
        {
            isReplace: true,
            translation: [
                ["Общее количество боёв:", "战斗场次："],
            ]
        }
    ]);
    detect_elements.add([
        ".ViewSupply_sidebarBuilding_2rWtq .Building_buildInfo_23BtJ span p",
        {
            isReplace: true,
            translation: [
                ['Улучшений: ', "扩建："],
                ['из', "/"],
            ]
        }
    ]);
    detect_elements.add([
        ".ViewSupply_sidebarBuilding_2rWtq .Building_bonus_gIuCK span span",
        {
            isReplace: true,
            translation: [
                ['Максимальная численность клана: ', "军团最大成员数："],
                ['. Есть возможность играть в Клановых боях, используя второй рейтинг', "。可以参加更高一级军团战"]
            ]
        }
    ]);
    detect_elements.add([
        ".ViewSupply_sidebarBuilding_2rWtq .Building_description_3cVri",
        {
            isReplace: true,
            translation: [
                ['Отображает активность клана в Клановых боях за последние', "显示过去"],
                ['дней', "天的军团活动"]
            ]
        }
    ]);
    detect_elements.add([
        ".ViewSupply_buildingBottomInfo_1DVyX .wru__Message__message div span span",
        {
            isReplace: true,
            translation: [
                ['Максимальная численность клана: ', "军团最大成员数："],
                ['. Есть возможность играть в Клановых боях, используя второй рейтинг', "。可以参加更高一级军团战"],
                ['Отображает активность клана в Клановых боях за последние', "显示过去"],
                ['дней', "天的军团活动"],
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .LevelTooltip_title_38cBs span",
        {
            isReplace: true,
            translation: [
                ['Улучшение ', "扩建 "]
            ]
        }
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body .wru__Message__message",
        {
            isReplace: true,
            translation: [
                ['Не построено', "未建成"],
                ['Построено', "已建成"],
                ['Не достигнуто', "未获得"],
                ['Достигнуто', "已获得"],
                ['Только командный состав может улучшить строение.', "只有军团指挥可以扩建建筑"],
                ['Приобретение улучшения нового уровня возможно только после постройки предыдущих.', "只有完成前一个等级的升级才能继续升级建筑。"],
                ['Появляется автоматически при достижении определённого количества боёв', "经过一定数量的战斗后自动出现"]
            ]
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body .LevelTooltip_price_2VpkA",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Стоимость постройки:', "建造费用："],
                ['Не хватает:', "需要："]
            ]
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body .LevelTooltip_tooltipProgressRow_35My-",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['Общее количество боёв:', "战斗场次："]
            ]
        },
    ]);
    detect_elements.add([
        "#wows-react-tooltip-body .wru__Tooltip__body span span",
        {
            isReplace: true,
            translation: [
                ['к максимальной численности клана', "最大军团成员数"],
                [' от стоимости исследуемых кораблей I–VI уровней', "I-VI级可研发战舰的购买价格"],
                [' от стоимости исследуемых кораблей VII–VIII уровней', "VII–VIII级可研发战舰的购买价格"],
                [' от стоимости исследуемых кораблей IX–X уровней', "IX–X级可研发战舰的购买价格"],
                [' к опыту за бой на кораблях I–VI уровней', "I–VI级战舰参加战斗获得的经验"],
                [' к опыту за бой на кораблях VII–VIII уровней', "VII–VIII级战舰参加战斗获得的经验"],
                [' к опыту за бой на кораблях IX–X уровней', "IX–X级战舰参加战斗获得的经验"],
                [' к свободному опыту за бой на кораблях I–VI уровней', "I-VI级战舰参加战斗所得的全局经验收益"],
                [' к свободному опыту за бой на кораблях VII–VIII уровней', "VII–VIII级战舰参加战斗所得的全局经验收益"],
                [' к свободному опыту за бой на кораблях IX–X уровней', "IX–X级战舰参加战斗所得的全局经验收益"],
                ['Дополнительно ', "另外"],
                [' от стоимости обслуживания кораблей I–VI уровней', "I–VI级战舰的维护费用"],
                [' от стоимости обслуживания кораблей VII–VIII уровней', "VII–VIII级战舰的维护费用"],
                [' от стоимости обслуживания кораблей IX–X уровней', "IX–X级战舰的维护费用"],
                [' от стоимости обслуживания кораблей I–X уровней', "I-X级战舰的维护费用"],
            ]
        },
    ]);
    detect_elements.add([
        ".ViewClanProfile_ownClanTitleWrap_3ujHe .wru__Menu__menuWrapper .wru__Menu__inner .wru__Menu__item",
        {
            isReplace: true,
            translation: [
                ['Изменить тег и название', "更改军团标签和名称"],
                ['Изменить требования клана', "更改军团要求"],
                ['Изменить описание', "更改军团描述"],
                ['Правила кланов', "军团规则"],
                ['Покинуть клан', "退出军团"],
            ]
        },
    ]);
    detect_elements.add([
        ".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__body .ClanEditDialogs_clanRename_1DXRB .wru__LabelStyles__label",
        {
            isReplace: true,
            translation: [
                ['Тeг', "标签"],
                ['Название', "名称"],
            ]
        }
    ]);
    detect_elements.add([
        ".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__footer .ClanEditDialogs_rules_1Wwnk span",
        {
            isReplace: true,
            isReplaceHTML: true,
            translation: [
                ['При изменении тега и названия соблюдайте', "更改军团标签和名称时，请遵守"],
                ['При создании и изменении описания соблюдайте', "在创建和更改军团描述时，请遵守"],
                ['Правила кланов', "军团规则"],
            ]
        }
    ]);
    detect_elements.add([
        ".wru__Dialog__dialogWrapper .wru__Dialog__container .wru__Dialog__footer .ClanEditDialogs_info_1yJjz",
        {
            isReplace: true,
            translation: [
                ['Изменение названия клана может занять некоторое время.', "更改军团名称可能需要等待一些时间才会生效"],
            ]
        }
    ]);

    translation.set("Клановый ресурс", "军团资源");
    translation.set('Выбрать действие с кланом', "选择操作");
    translation.set('Нажмите, чтобы открыть описание клана', "点击打开军团描述");
    translation.set('На что потратить', "如何花费");
    translation.set('Как получить', "如何获取");
    translation.set('Перейти к строению', "前往建筑");
    translation.set('Секретный пункт базирования', "秘密基地");
    translation.set('Стальной порт', "钢铁港");
    translation.set('Угольный порт', "煤炭港");
    translation.set('Сухой док', "干船坞");
    translation.set('Судостроительный завод', "造船厂");
    translation.set('Казначейство', "库房");
    translation.set('Конструкторское бюро', "研发局");
    translation.set('Военно-морское училище', "海军学院");
    translation.set('Научно-исследовательский институт', "研究所");
    translation.set('Ростральная колонна', "海战纪念柱");
    translation.set('Академия', "指挥官学院");
    translation.set('Дом офицеров', "军官宿舍");
    translation.set('Боевой флот на рейде', "舰队锚地");
    translation.set('Флот снабжения и поддержки', "辅助舰队");
    translation.set('СЕКРЕТНЫЙ ПУНКТ БАЗИРОВАНИЯ', "秘密基地");
    translation.set('СТАЛЬНОЙ ПОРТ', "钢铁港");
    translation.set('УГОЛЬНЫЙ ПОРТ', "煤炭港");
    translation.set('СУХОЙ ДОК', "干船坞");
    translation.set('СУДОСТРОИТЕЛЬНЫЙ ЗАВОД', "造船厂");
    translation.set('КАЗНАЧЕЙСТВО', "库房");
    translation.set('КОНСТРУКТОРСКОЕ БЮРО', "研发局");
    translation.set('ВОЕННО-МОРСКОЕ УЧИЛИЩЕ', "海军学院");
    translation.set('НАУЧНО-ИССЛЕДОВАТЕЛЬСКИЙ ИНСТИТУТ', "研究所");
    translation.set('РОСТРАЛЬНАЯ КОЛОННА', "海战纪念柱");
    translation.set('АКАДЕМИЯ', "指挥官学院");
    translation.set('ДОМ ОФИЦЕРОВ', "军官宿舍");
    translation.set('БОЕВОЙ ФЛОТ НА РЕЙДЕ', "舰队锚地");
    translation.set('ФЛОТ СНАБЖЕНИЯ И ПОДДЕРЖКИ', "辅助舰队");
    translation.set('Боевой флот на рейде', "舰队锚地");
    translation.set(
        'Даёт экономические бонусы для суперкораблей. Список бонусов увеличивается в зависимости от количества улучшений: увеличение опыта корабля за бой, уменьшение стоимости в дереве развития, увеличение свободного опыта за бой.',
        "为超级战舰提供经济加成。加成列表会根据建筑等级的提升而增加：增加战舰战斗获得的经验、降低科技树中可研发战舰的购买价格、增加战舰战斗获得的全局经验。"
    );
    translation.set(
        'Увеличивает количество получаемой стали.',
        "增加军团成员获得的钢铁量。"
    );
    translation.set(
        'Увеличивает количество получаемого угля.',
        "增加军团成员获得的煤炭量。"
    );
    translation.set(
        'Уменьшает стоимость обслуживания кораблей определённых уровней.',
        "降低特定等级战舰的维护费用。"
    );
    translation.set(
        'Уменьшает стоимость исследуемых кораблей определённых уровней.',
        "降低特定等级可研发战舰的购买价格。"
    );
    translation.set(
        'Позволяет распределять ресурсы клана и регулярные награды.',
        "允许您分配军团资源和奖励"
    );
    translation.set(
        'Увеличивает свободный опыт, получаемый за бой на кораблях определённых уровней.',
        "增加在特定等级的战舰上作战获得的全局经验。"
    );
    translation.set(
        'Увеличивает опыт корабля, получаемый за бой на кораблях определённых уровней.',
        "增加在特定等级的战舰上作战获得的经验。"
    );
    translation.set(
        'Увеличивает количество получаемых очков исследования.',
        "增加军团成员获得的研究点量。"
    );
    translation.set(
        'Символизирует успех и достижения вашего клана.',
        "象征着您所在军团的战功与成就。"
    )
    translation.set(
        'Увеличивает опыт командира, получаемый за бой.',
        "增加战斗获得的指挥官经验。",
    );
    translation.set(
        'Увеличивает максимальное количество участников клана и даёт возможность участвовать в овых боях, используя второй рейтинг.',
        "扩增军团能容纳成员的最大数量，并允许军团参加更高一级的军团战。"
    );
    translation.set(
        'Отображает активность клана в овых боях за последние 90 дней',
        "显示该军团在过去90天内的军团战活跃情况"
    );
    translation.set(
        'Отображает активность клана в Случайных, Ранговых и Кооперативных боях за последний месяц',
        "显示您军团成员上个月在随机战、排位战和联合作战中的活跃水平"
    );
    translation.set('ЗАКРЫТЬ', "关闭");
    translation.set('СТРОЕНИЕ НЕ ВОЗВЕДЕНО', "建筑未建成");
    translation.set('ВЕРНУТЬСЯ НА БАЗУ', "回到基地");
    translation.set('ПЕРЕЙТИ В КАЗНУ', "前往军团库房");
    translation.set('ДОСТИЖЕНИЯ КЛАНА', "军团成就");
    translation.set('ДОСТИЖЕНИЯ ОТСУТСТВУЮТ', "没有成就");
    translation.set('В настоящее время у клана нет достижений', "军团还未获得任何成就");
    translation.set('УЛУЧШЕНИЕ ДАЁТ СЛЕДУЮЩИЙ БОНУС', "升级后的加成如下");
    translation.set('УЛУЧШЕНИЕ ДАЁТ СЛЕДУЮЩИЕ БОНУСЫ', "升级后可获得以下加成");
    translation.set('АКТИВНЫЕ БОНУСЫ СТРОЕНИЯ', "已获得的加成");
    translation.set('Строение не возведено', "建筑未建成");
    translation.set(' к опыту за бой на суперкораблях', "超级战舰参加战斗获得的经验");
    translation.set(' от стоимости суперкораблей', "超级战舰的购买价格");
    translation.set(' к свободному опыту за бой на суперкораблях', "超级战舰参加战斗所得的全局经验收益");
    translation.set(' к количеству получаемой стали', "军团成员获得的钢铁量");
    translation.set(' к количеству получаемого угля', "军团成员获得的煤炭量");
    translation.set(' от стоимости обслуживания кораблей I–VI уровней', "I–VI级战舰的维护费用");
    translation.set(' от стоимости обслуживания кораблей I–VIII уровней', "I–VIII级战舰的维护费用");
    translation.set(' от стоимости обслуживания кораблей I–X уровней', "I-X级战舰的维护费用");
    translation.set(' от стоимости исследуемых кораблей I–VI уровней', "I–VI级可研发战舰的购买价格");
    translation.set(' от стоимости исследуемых кораблей I–VIII уровней', "I–VIII级可研发战舰的购买价格");
    translation.set(' от стоимости исследуемых кораблей I–X уровней', "I-X级可研发战舰的购买价格");
    translation.set(' к свободному опыту за бой на кораблях I–VI уровней', "I–VI级战舰参加战斗所得的全局经验收益");
    translation.set(' к свободному опыту за бой на кораблях I–VIII уровней', "I–VIII级战舰参加战斗所得的全局经验收益");
    translation.set(' к свободному опыту за бой на кораблях I–X уровней', "I-X级战舰参加战斗所得的全局经验收益");
    translation.set(' к опыту за бой на кораблях I–VI уровней', "I–VI级战舰参加战斗获得的经验");
    translation.set(' к опыту за бой на кораблях I–VIII уровней', "I–VIII级战舰参加战斗获得的经验");
    translation.set(' к опыту за бой на кораблях I–X уровней', "I-X级战舰参加战斗获得的经验");
    translation.set(' к количеству получаемых очков исследования', "军团成员获得的研究点量");
    translation.set(' к опыту командира за бой', "参加战斗所得的指挥官经验收益");
    translation.set('Заработанный чистый опыт', "获得的基础经验");
    translation.set('ТЕГ И НАЗВАНИЕ', "军团标签和名称");
    translation.set('ОПИСАНИЕ', "军团描述");
    translation.set('ПРАВИЛА КЛАНОВ', "军团规则");
    translation.set('ПОКИНУТЬ КЛАН', "退出军团");
    translation.set('ОТМЕНИТЬ', "取消");
    translation.set(
        'Сокращённое название клана (от 2 до 5 символов: цифр, латинских букв, «_» или «-»), которое вы будете видеть в игре.',
        "您将在游戏中看到的军团名称缩写（2至5个字符，支持数字、英文字母、'_' 或 '-'）"
    );
    translation.set('ОТМЕНА', "取消");
    translation.set('Вы уверены, что хотите покинуть клан?', "您确定要离开军团吗？");
    translation.set(
        'Добытые в этом клане баррели нефти обнуляются. В новом клане вы начнёте зарабатывать их заново.',
        "在该军团中获得的石油计数将重置为零。在新军团中，您将重新开始计数。"
    );
    translation.set(
        'После ухода из клана в течение 3 дней вы не сможете вступить в клан или создать новый.',
        "一旦离开军团，您将在3天内无法加入军团或创建新军团。"
    );

    

    Localizer_Init();
}

