// ==UserScript==
// @name         战舰世界莱服网页汉化-资源-账号档案翻译
// @namespace    https://github.com/windofxy
// @version      202503051039
// @description  战舰世界莱服网页汉化-资源
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT
// ==/UserScript==

if (!window.__localizer_profile_loaded__ && window.location.host === "profile.korabli.su") {
    window.__localizer_profile_loaded__ = true;
    let detect_elements = window.__localizer__.detect_elements;
    let translation = window.__localizer__.translation;
    let Localizer_Init = window.__localizer__.Localizer_Init;
        
    detect_elements.add([".Menu_menu_3auv3 .Nav__navItem__3QZwE span", {}]);
    detect_elements.add([".bulma_container_1IpcG .bulma_columns_2vXB1 .Select_wrapper_VGRie .Select_dropPanelWrapper_2NZQu .DropPanel_item_37VUa div", {}]);
    detect_elements.add([".bulma_container_1IpcG .bulma_columns_2vXB1 .SearchTable_loadMoreButtonWrapper_Wdrw4 .Button__inner__14JXG span", {}]);
    detect_elements.add([".bulma_container_1IpcG .ProfileHeader_wrapper_PCQFT .ProfilePrivacy_privacyTitle_1g7Q0", {}]);
    detect_elements.add([".bulma_container_1IpcG .bulma_column_9RDkL .Select_wrapper_VGRie .Select_dropPanelWrapper_2NZQu .DropPanel_item_37VUa div", {}]);
    detect_elements.add([".bulma_container_1IpcG .Spoiler_wrapper_2Dtzc .Spoiler_title_3aIFt", {}]);
    detect_elements.add([".bulma_container_1IpcG .Spoiler_wrapper_2Dtzc .Spoiler_content_9KDFJ .AchievementSubGroup_achievementSubGroupTitle_3GGRa .LabelStyles__label__wYtWC", {}]);
    detect_elements.add(["#modal-root .ProfilePrivacy_wrapper_Y3RxL .ProfilePrivacy_title_2CwCV", {}]);
    detect_elements.add(["#modal-root .Dialog__dialog__5wwEi .Dialog__close__3evXF", {}]);
    detect_elements.add(["#modal-root .ProfilePrivacy_wrapper_Y3RxL .ProfilePrivacy_radioGroup_2o1xa .Radio__label__2TQcN .Radio__caption__1fM1X span", {}]);
    detect_elements.add(["#modal-root .ProfilePrivacy_wrapper_Y3RxL .ProfilePrivacy_availability_35hD5 .CheckboxWithLabel__checkboxLabel__fiwS5 span", {}]);
    detect_elements.add(["#modal-root .ProfilePrivacy_wrapper_Y3RxL .ProfilePrivacy_link_3GKIC .ProfilePrivacy_copyLink_10e7J", {}]);
    detect_elements.add(["#modal-root .ProfilePrivacy_wrapper_Y3RxL .Dialog__footer__2K9Xb .Button__button__3OKxI .Button__inner__14JXG span", {}]);
    detect_elements.add([".bulma_container_1IpcG .Profile_headerWrapper_2_lPv .ProfilePrivacy_privacyTitle_1g7Q0", {}]);
    detect_elements.add([".bulma_container_1IpcG .Profile_pickerRow_fk1U- .Select_wrapper_VGRie .Select_dropPanelWrapper_2NZQu .DropPanel_item_37VUa div", {}]);
    detect_elements.add([".bulma_container_1IpcG .bulma_columns_2vXB1 .bulma_column_9RDkL .StatisticsHeader_label_1XBDB", {}]);
    detect_elements.add([".bulma_container_1IpcG .bulma_columns_2vXB1 .bulma_column_9RDkL .Statistics_row_1IT0x .Statistics_label_1stEX", {}]);
    detect_elements.add([".bulma_container_1IpcG .bulma_columns_2vXB1 .bulma_column_9RDkL .Charts_title_1USZK", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .ShipsTable_title_qvutk", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .ShipsTable_filters_1Isss .Filter_showFilterButton_36Z09", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .ShipsTable_filters_1Isss .Filter_filterHolderInner_Vulp1 .Filter_filterTitle_nyOcX", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .ShipsTable_filters_1Isss .Filter_filterHolderInner_Vulp1 .Filter_filterItemLabel_2mEkv", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .Table_table_1s4GY .Table_header_DsqfS .ShipsTable_shipName_3qsnC", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .Table_table_1s4GY .Table_header_DsqfS .ShipsTable_battlesCount_3H0wm span", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .Table_table_1s4GY .Table_header_DsqfS .ShipsTable_winsCount_3ADiN span", {}]);
    detect_elements.add([".bulma_container_1IpcG .ShipsTable_wrapper_cCmDL .Table_table_1s4GY .Table_header_DsqfS .ShipsTable_xpCount_1CoIi span", {}]);

    detect_elements.add([
        ".bulma_container_1IpcG .bulma_columns_2vXB1 .Table_table_1s4GY .Table_header_DsqfS .Table_headerCell_1DkLU div",
        {
            isReplace: true,
            translation: [
                ['№', "序号"],
                ['Имя пользователя', "用户名"],
                ['Бои', "战斗数"],
                ['Победы', "胜率"],
            ]
        }
    ])
    detect_elements.add([
        ".bulma_container_1IpcG .ProfileHeader_wrapper_PCQFT .ProfileHeader_registration_20_Ss div",
        {
            isReplace: true,
            translation: [
                ['Дата регистрации: ', "注册日期："],
            ],
        }
    ]);
    detect_elements.add([
        ".bulma_container_1IpcG .Profile_headerWrapper_2_lPv .ProfileHeader_registration_20_Ss div",
        {
            isReplace: true,
            translation: [
                ['Дата регистрации: ', "注册日期："],
            ],
        }
    ]);
    detect_elements.add([
        ".bulma_container_1IpcG .Profile_headerWrapper_2_lPv .MemberName__name__LX73r",
        {
            isReplace: true,
            translation: [
                ["Командующий", "军团长"],
                ["Заместитель командующего", "副军团长"],
                ["Военком", "招募官"],
                ["Курсант", "海军少尉"],
            ]
        }
    ]);
    detect_elements.add([
        ".bulma_container_1IpcG .ProfileHeader_wrapper_PCQFT .MemberName__name__LX73r",
        {
            isReplace: true,
            translation: [
                ["Командующий", "军团长"],
                ["Заместитель командующего", "副军团长"],
                ["Военком", "招募官"],
                ["Курсант", "海军少尉"],
            ]
        }
    ]);
    detect_elements.add([
        ".bulma_container_1IpcG .ProfileHeader_wrapper_PCQFT .ProfilePrivacy_publicProfile_Lj8TT",
        {
            isReplace: true,
            translation: [
                ['Открытый', "公开"],
            ]
        }
    ]);
    detect_elements.add([
        ".bulma_container_1IpcG .ProfileHeader_wrapper_PCQFT .ProfilePrivacy_privacyProfile_1_Pf5",
        {
            isReplace: true,
            translation: [
                ['Скрытый (виден клану)', "隐藏（军团内可见）"],
                ['Скрытый', "隐藏"],
            ]
        }
    ]);
    detect_elements.add([
        ".bulma_container_1IpcG .ProfileHeader_wrapper_PCQFT .ProfilePrivacy_linkProfile_1p__n",
        {
            isReplace: true,
            translation: [
                ['По ссылке (виден клану)', "通过链接（军团内可见）"],
                ['По ссылке', "通过链接"],
            ]
        }
    ]);

    translation.set('ПОИСК ИГРОКА', "搜索玩家");
    translation.set('ДОСТИЖЕНИЯ', "成就");
    translation.set('СВОДКА', "汇总");
    translation.set('Случайные бои', "随机战");
    translation.set('Ранговые бои', "排位战");
    translation.set('Старые ранговые бои', "排位战（旧）");
    translation.set('Кооперативные бои', "联合作战");
    translation.set('ЗАГРУЗИТЬ ЕЩЁ', "加载更多");
    translation.set('Видимость профиля:', "可见性设定：");
    translation.set('По умолчанию', "默认");
    translation.set('По времени получения', "按日期");
    translation.set('По количеству', "按数量");
    translation.set('Боевые достижения', "战斗成就");
    translation.set('Ордена', "勋奖");
    translation.set('Стандартные достижения', "标准成就");
    translation.set('Памятные достижения', "纪念成就");
    translation.set('Случайные и Ранговые бои', "随机战和排位战");
    translation.set('Групповые', "小队");
    translation.set('Операции', "行动");
    translation.set('Кланы', "军团战");
    translation.set('Ранги', "排位战");
    translation.set('Общие', "普通");
    translation.set('Операции', "行动");
    translation.set('Кампании', "战役");
    translation.set('Особые', "特殊");
    translation.set('НАСТРОЙКИ ВИДИМОСТИ ПРОФИЛЯ', "个人资料可见性设置");
    translation.set('ЗАКРЫТЬ', "关闭");
    translation.set('Профиль открыт.', "公开");
    translation.set('Профиль скрыт.', "私密");
    translation.set('Профиль доступен только по ссылке.', "只能通过链接访问");
    translation.set('Открыт для соклановцев', "向军团成员公开");
    translation.set('Скопировать ссылку', "复制链接");
    translation.set('Ссылка скопирована', "链接已复制");
    translation.set('СОХРАНИТЬ', "保存");
    translation.set('Все', "所有");
    translation.set('В одиночку', "单人");
    translation.set('В отряде из двух', "组队");
    translation.set('Проведено боёв', "战斗场次");
    translation.set('Победы', "胜率");
    translation.set('Опыт', "获得的经验");
    translation.set('Кораблей за бой', "摧毁战舰数");
    translation.set('Уничтожил/уничтожен', "摧毁率");
    translation.set('Поражения', "败率");
    translation.set('Ничьи', "平局");
    translation.set('Выжил в боях', "存活");
    translation.set('Процент попаданий главным калибром', "主炮命中率");
    translation.set('Процент попаданий торпедами', "鱼雷命中率");
    translation.set('Участие в захвате', "占领贡献");
    translation.set('Участие в защите', "防御贡献");
    translation.set('Нанесено урона', "造成的伤害");
    translation.set('Уничтожено кораблей', "摧毁敌舰数");
    translation.set('Главным калибром', "通过主炮摧毁");
    translation.set('Вспомогательным калибром', "通过副炮摧毁");
    translation.set('Торпедами', "通过鱼雷摧毁");
    translation.set('Авиацией', "通过飞机摧毁");
    translation.set('Пожарами и затоплениями', "通过进水或火灾摧毁");
    translation.set('Тараном', "通过冲撞摧毁");
    translation.set('Глубинными бомбами', "通过深水炸弹摧毁");
    translation.set('Минами', "通过水雷摧毁");
    translation.set('Уничтожено самолётов', "击落敌机数");
    translation.set('Обнаружено кораблей', "侦察战舰数");
    translation.set('Урон по обнаружению', "侦察协助队友造成的伤害");
    translation.set('Потенциальный урон', "潜在伤害");
    translation.set('Средние показатели за бой', "场均数据");
    translation.set('Уничтожено кораблей', "摧毁战舰数");
    translation.set('Уничтожено самолётов', "击落敌机数");
    translation.set('Максимум за бой', "最高记录");
    translation.set('Нации', "国家");
    translation.set('Классы', "类型");
    translation.set('Уровни', "等级");
    translation.set('Корабли', "战舰");
    translation.set('Показать фильтры', "显示过滤器");
    translation.set('Скрыть фильтры', "隐藏过滤器");
    translation.set('Нация', "国家");
    translation.set('Класс', "类型");
    translation.set('Уровень', "等级");
    translation.set('Категория', "类别");
    translation.set('Премиум', "加值");
    translation.set('Особый', "特别");
    translation.set('Название корабля', "战舰名");
    translation.set('Бои', "战斗数");
    translation.set('Победы', "胜利");
    translation.set('Опыт', "经验");

    
    Localizer_Init();
}