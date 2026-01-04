// ==UserScript==
// @name           Fotostrana Sports
// @namespace      scriptomatika
// @author         mouse-karaganda
// @description    Интерфейс на страницах Surf Rider
// @version        1.67
// @grant          none
// ==/UserScript==


var paramWindow = (typeof unsafeWindow == 'object') ? unsafeWindow : window;

(function(unsafeWindow) {
    if (unsafeWindow.self != unsafeWindow.top)
        return;

    var console = unsafeWindow.console;
    var $$ = unsafeWindow.__krokodil;
    var $ = unsafeWindow.jQuery;

    console.log('💬  Фотострана пришла! sports');

    if (!unsafeWindow.$fotostrana) {
        unsafeWindow.$fotostrana = {};
    }

    // Всплывающая подсказка для допингов в Сёрфере
    var surfDetailsTemplate = $$.join([
        '<div class="surfItemDetails">',
            '<div class="surfTooltipTitle">{title}</div>',
            '<p class="surfItemSlotName">{slotName}</p>',
            '<div class="surfItemWrap">',
                '<div class="surfItemImg"><img src="{img}"></div>',
                '<div class="surfItemBonuses">{bonuses}</div>',
            '</div>',
        '</div>'
    ], '\r\n');

    var surfSimpleTemplate = ('<div class="surfTooltipTitle">{title}</div>{simple}');

    var surfBonusTemplate = $$.join([
        '<p class="surfItemBonus">',
            '<span class="surfProfileIco {kind}"></span> {name}: <span class="value">{value}</span>',
        '</p>'
    ], '\r\n');

    var surfVolcanoRunTable = $$.join([
        '<div class="building__content_wrapper">',
            '<div class="building__content building__content-text">',
                '<div class="surfQuestPerson nq_surf person_volcano"></div>',
                '<div class="surf_rascally_battle__help_text">',
                    '<table class="volcanoRunTable">',
                        '<tr class="th"><td>{before}</td></tr>',
                        '{message}',
                    '</table>',
                '</div>',
            '</div>',
        '</div>',
    ], '\r\n');

    var surfMinigameCard = $$.join([
        '<div class="surfMinigame stop-{stop}">',
            '<div class="surfMinigameTitle">{title}<br /><br />{date}</div>',
            '<div class="surfMinigameIcon"><i class="{iconCls}"></i></div>',
            '<div class="sButton surfMinigamePlay" onclick="surf.minigames.gamePopup({gameId})">',
                '<strong>Выполнить</strong>',
            '</div>',
        '</div>'
    ], '\r\n');

    var extraCupList = [
        { gameId: 145, iconCls: 'person_february2020',  date: 'Февраль 20',  stop: false, title: 'Зимняя рыбалка' },
        { gameId: 133, iconCls: 'person_february2019',  date: 'Февраль 19',  stop: false, title: 'Зимняя рыбалка' },
        { gameId: 121, iconCls: 'person_february2018',  date: 'Февраль 18',  stop: false, title: 'Зимняя рыбалка' },
        { gameId: 109, iconCls: 'person_february2017',  date: 'Февраль 17',  stop: false, title: 'Зимняя рыбалка' },
        { gameId:  97, iconCls: 'person_february2016',  date: 'Февраль 16',  stop: false, title: 'Волшебный остров' },
        { gameId:  59, iconCls: 'person_vip',           date: 'VIP',         stop: true,  title: 'Орешки' },
        { gameId: 144, iconCls: 'person_january2020',   date: 'Январь 20',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 132, iconCls: 'person_january2019',   date: 'Январь 19',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 120, iconCls: 'person_january2018',   date: 'Январь 18',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 108, iconCls: 'person_january2017',   date: 'Январь 17',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  96, iconCls: 'person_january2016',   date: 'Январь 16',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 143, iconCls: 'person_december2019',  date: 'Декабрь 19',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 131, iconCls: 'person_december2018',  date: 'Декабрь 18',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 119, iconCls: 'person_december2017',  date: 'Декабрь 17',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 107, iconCls: 'person_december2016',  date: 'Декабрь 16',  stop: true,  title: 'Новогодняя змейка' },
        { gameId:  95, iconCls: 'person_december2015',  date: 'Декабрь 15',  stop: true,  title: 'Крутой спуск' },
        { gameId: 142, iconCls: 'person_november2019',  date: 'Ноябрь 19',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 130, iconCls: 'person_november2018',  date: 'Ноябрь 18',   stop: true,  title: 'Спасение урожая' },
        { gameId: 118, iconCls: 'person_november2017',  date: 'Ноябрь 17',   stop: true,  title: 'Месть злых сил' },
        { gameId: 106, iconCls: 'person_november2016',  date: 'Ноябрь 16',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  94, iconCls: 'person_november15',    date: 'Ноябрь 15',   stop: true,  title: 'Подстрели шляпу' },
        { gameId: 141, iconCls: 'person_october2019',   date: 'Октябрь 19',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 129, iconCls: 'person_october2018',   date: 'Октябрь 18',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 117, iconCls: 'person_october2017',   date: 'Октябрь 17',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 105, iconCls: 'person_october2016',   date: 'Октябрь 16',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  93, iconCls: 'person_october15',     date: 'Октябрь 15',  stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 140, iconCls: 'person_september2019', date: 'Сентябрь 19', stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 128, iconCls: 'person_september2018', date: 'Сентябрь 18', stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 116, iconCls: 'person_september2017', date: 'Сентябрь 17', stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 104, iconCls: 'person_september2016', date: 'Сентябрь 16', stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  92, iconCls: 'person_september15',   date: 'Сентябрь 15', stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 139, iconCls: 'person_august2019',    date: 'Август 19',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 127, iconCls: 'person_august2018',    date: 'Август 18',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 115, iconCls: 'person_august2017',    date: 'Август 17',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 103, iconCls: 'person_august2016',    date: 'Август 16',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  91, iconCls: 'person_dacha',         date: 'Август 15',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 138, iconCls: 'person_july2019',      date: 'Июль 19',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 126, iconCls: 'person_july2018',      date: 'Июль 18',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 114, iconCls: 'person_july2017',      date: 'Июль 17',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 102, iconCls: 'person_july2016',      date: 'Июль 16',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  90, iconCls: 'person_turkish',       date: 'Июль 15',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 137, iconCls: 'person_june2019',      date: 'Июнь 19',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 125, iconCls: 'person_june2018',      date: 'Июнь 18',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 113, iconCls: 'person_june2017',      date: 'Июнь 17',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 101, iconCls: 'person_june2016',      date: 'Июнь 16',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  89, iconCls: 'person_super',         date: 'Июнь 15',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 136, iconCls: 'person_may2019',       date: 'Май 19',      stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 124, iconCls: 'person_may2018',       date: 'Май 18',      stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 112, iconCls: 'person_may2017',       date: 'Май 17',      stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 100, iconCls: 'person_may2016',       date: 'Май 16',      stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  88, iconCls: 'person_driada',        date: 'Май 15',      stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 135, iconCls: 'person_april2019',     date: 'Апрель 19',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 123, iconCls: 'person_april2018',     date: 'Апрель 18',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 111, iconCls: 'person_april2017',     date: 'Апрель 17',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  99, iconCls: 'person_april2016',     date: 'Апрель 16',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  87, iconCls: 'person_volcano',       date: 'Апрель 15',   stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 134, iconCls: 'person_march2019',     date: 'Март 19',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 122, iconCls: 'person_march2018',     date: 'Март 18',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId: 110, iconCls: 'person_march2017',     date: 'Март 17',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  98, iconCls: 'person_march2016',     date: 'Март 16',     stop: true,  title: 'Зимняя рыбалка' },
        { gameId:  86, iconCls: 'person_cuba2015',      date: 'Март 15',     stop: true,  title: 'Зимняя рыбалка' },
    ];

    $$.extend(unsafeWindow.$fotostrana, {
        /**
         * Период ожидания для скриптов (в секундах)
         */
        missingPeriod: 180,
        missingPause: 2000,
        volcanoMaxStep: 30

        /**
         * Действие для кнопки сундука - лучший комплект или снять всё
         */
        , chestAction: 'undress' // 'dress'

        /**
         * Большой размер кнопок в окне мини-игр
         */
        , bigMinigameButtons: true

        /**
         * Определяет, что мы находимся на страничке питомца
         */
        , isPetPage: function() {
            return /\.ru\/pet/i.test(location.href);
        }

        /**
         * Определяет, что мы находимся на страничке финансов
         */
        , isFinancePage: function() {
            return /\.ru\/finance/i.test(location.href);
        }

        /**
         * Определяет, что мы находимся на страничке серфинга
         */
        , isSportsPage: function() {
            return /\.ru\/sports/i.test(location.href);
        }

        /**
         * Определяет, что мы находимся на страничке заплыва по серфингу
         */
        , isSportsRunPage: function() {
            var result = /\.ru\/sports\/index\/run/i.test(location.href);
            return result || /\.ru\/sports\/fairMiniPets\/run/i.test(location.href);
        }

        /**
         * Определяет, что мы находимся на страничке кубка по серфингу
         */
        , isCupPage: function() {
            return /\.ru\/sports\/index\/cup/i.test(location.href);
        }

        /**
         * Определяет, что мы находимся на страничке школы серферов
         */
        , isSchoolPage: function() {
            var result = /\.ru\/sports\/school/i.test(location.href);
            return result && !/\.ru\/sports\/school\/\w+/i.test(location.href);
        }

        /**
         * Определяет, что мы находимся на страничке вулкана
         */
        , isVolcanoPage: function() {
            return /\.ru\/sports\/volcano/i.test(location.href);
        }

        /**
         * Стили для новых объектов
         */
        , styleSurf: function() {
            $$.renderStyle(
                '.miniAward { position: absolute; border: 1px solid black; border-radius: 5px; background-position: -68px 0; width: 18px; height: 18px; z-index: 1; }',
                '.miniAward.top { background-position: -50px 0; }',
                '.miniAward:hover { border-color: red; }',
                '.surfScrollWrap .miniAward { left: auto !important; right: -20px; bottom: -7px !important; }',
                '.surfShopMinigame .miniAward { right: 148px; bottom: 27px; }',
                '#volcano-prize .miniAward { right: 36px; bottom: 21px; }',
                '#volcano-app .awards .content .miniAward { left: 20px; top: 10px; }',
                '#volcano-app .awards .content .miniAward.top { left: auto; top: auto; right: 20px; bottom: 10px; }',
                '#surfSchoolBonus .surfSchoolBonusItem { display: inline-block; color: #ffeaa3; font-size: 12px; font-weight: bold; line-height: 16px; margin: 0 5px; margin: 10px 40px; text-align: center; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.35); vertical-align: top; cursor: pointer; }',
                '#surfSchoolBonus .surfSchoolBonusItem:hover { color: white; font-weight: bold; }',
                '#surfSchoolBonus .surfSchoolBonusImageWrap { background: #5b2700; border-radius: 5px; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset, 0 1px 0 rgba(235, 199, 76, 0.15); margin-bottom: 4px; padding: 2px; text-align: center; }',
                '#surfSchoolBonus .surfSchoolBonusImageWrap img { width: 100px; height: auto; vertical-align: middle; }',
                '.sFriend:not(.hover) .surfProfileIco.chest { background-position: -64px -31px; background-size: 288px 123px; }',
                '.surfFriendsBlock .sFriendTooltip .links.small { font-size: 10px; }',
                '.sQuestIco { vertical-align: top; }',
                '.surfInvChestContent .surfInvItem .upgrade, .surfProfile .slot .upgrade, .fsSurfRiderNotify.notifySaleIcoParent { display: none; }',
                '.daylyGamesArrow { position: relative; width: 48px; height: 48px; margin: 9px auto 0; border-radius: 30px; cursor: pointer; background: no-repeat center center; background-image: url(//st.fotocdn.net/app/sports/newsurf/img/common/fastRoundIco.png); }',
                '.sQuestIco:hover .daylyGamesArrow { background-color: #ff2d05; }',
                '.daylyGamesPerson { position: absolute; width: 51px; height: 51px; left: 7px; bottom: 2px; border-radius: 30px; cursor: pointer; }',
                '.daylyGamesPerson:after { content: " "; display: block; position: absolute; width: 65px; left: -7px; bottom: -2px; background: no-repeat; background-size: contain; }',
                '.daylyGamesPerson.atlantis:after { transform: scaleX(-1); height: 73px; background-image: url(//st.fotocdn.net/app/sports/newsurf/img/persons/atlantis.png); }',
                '.daylyGamesPerson.extreme:after { height: 82px; background-image: url(//st.fotocdn.net/app/sports/newsurf/img/sunday/help_image.png); }',
                '.daylyGamesPerson.rascally:after { height: 76px; background-image: url(//st.fotocdn.net/app/sports/newsurf/img/rascally/hero.png); }',
                '.sQuestIco:hover .daylyGamesPerson { background-color: #c78720; }',
                '.surfMinigamesPopup .building__content:first-child .surf_personal_prizes { margin-bottom: 50px; }','.surfPopup.surfMinigamesPopup .surfScrollWrap.minigameDoubleWrap { margin: -70px auto 120px; }',
                '.miniBumper { width: 15px; }',
                '.miniBumper.left { margin-right: 10px; }',
                '.minigameDoubleContainer { position: absolute; left: 0; right: 0; top: 20px; }',
                '.minigameDoubleContainer .emptyTitle { padding-left: 20px; font-size: 15px; }',
                '.minigameDoubleContainer > div { display: inline-block; vertical-align: top; }',
                '.minigameDoubleCell { position: relative;  width: 25px; height: 25px; margin: 0 10px 10px 0; border-radius: 5px; border: 1px solid #d79d00; background: #ffde6c no-repeat top center; background-size: cover; }',
                '.surfScrollWrap .minigameDoubleCell .miniAward { right: -5px; bottom: -5px !important; opacity: 0.5; }',
                '.surfScrollWrap .minigameDoubleCell .miniAward:hover { opacity: 1; }',
                '.minigameDoubleCell.giftZaplyv.original { width: 55px; height: 54px; background-size: 766px 309px; background-position: -73px -255px; }',
                '.minigameDoubleCell.giftZaplyv { background-size: 348px 140px; background-position: -33px -115px; background-image: url(//st.fotocdn.net/app/sports/newsurf/img/cup/sprite.png); }',
                '.minigameDoubleCell.icePop { background-image: url(//st.fotocdn.net/z/images/sports/equip/2313_b.png); }',
                '.surfInvButtons .autoDressBtn { width: auto; }',
                '.surfInvButtons .sButton { padding-left: 10px; padding-right: 10px; margin-left: 10px; }',
                '.surfInvIco-removePack { width: 26px; height: 27px; background-position: -141px -129px; margin: -1px 0 -7px 0; transform: scaleY(-1); }',
                '#surfPopup.volcanoRunCount .surfQuestPerson { left: -32px; top: 20px; z-index: 1; transform: scaleX(-1); }',
                '.surf_rascally_battle__help_text { margin-left: 90px; background: #ffeba5; border-radius: 5px; padding: 10px 30px; position: relative; }',
                '.surf_rascally_baxttle__help_text:before { position: absolute; left: -10px; top: 70px; content: ""; width: 20px; height: 20px; background: #ffeba5; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg); }',
                'table.volcanoRunTable_ { width: auto; margin: 0 auto 20px; }',
                '.volcanoRunTable .th td { font-weight: bold; }',
                '.volcanoRunTable .tleft { text-align: left; }',
                '.auto-buttons .b_grd-button { min-width: 0; }',
                '#volcano-app .auto-buttons .content { width: 230px; top: -1px; }',
                '#volcano-app .auto-buttons header { margin-right: 274px; }',
                '.volcanoRunCalc { transform: scale(0.625); position: absolute; left: 14px; bottom: 3px; width: 32px; height: 34px; cursor: pointer; background-position: -78px -187px; background-image: url(//st.fotocdn.net/app/sports/newsurf/img/inventory/design_sprite.png); }',
                '.volcanoRunCalc:hover { transform: scale(1); }',
                '.skill-box.blue .skill-info .title, .skill-box.blue .footer { color: white; }',
                '#topper-block { bottom: auto !important; }',
                '.surfCollectionsPopup .item.full .buyIco, .surfCollectionsPopup .item.full .askIco { display: block; }'
            );

            // Большие кнопки
            if (!!this.bigMinigameButtons) {
                $$.renderStyle(
                    '.minigameDoubleCell { width: 49px; height: 49px; }',
                    '.surfScrollWrap .minigameDoubleCell .miniAward { opacity: 1; }',
                    '.surfMinigamesPopup .building__content:first-child .surf_personal_prizes { margin-bottom: 75px; }',
                    '.surfPopup.surfMinigamesPopup .surfScrollWrap.minigameDoubleWrap { margin: -95px auto 170px; }',
                    '.minigameDoubleCell.giftZaplyv {  background-size: 682px 275px; background-position: -65px -227px; }'
                );
            }
        }

        /**
         * Быстрые настройки питомца
         */
        , quickPetSettings: function() {
            $fotostrana.missingElement('#surfSchool .surfTabs', function(exists) {
                ////a1.s.fsimg.ru/app/fs2pet/img/icons-20.png
            });
        }

        /**
         * Взять ежедневный бонус в школе серферов
         */
        , schoolBonus: function() {
            if (!this.isSchoolPage())
                return;

            var self = this;
            $fotostrana.missingElement('#surfSchoolBase_ .surfTabs', function(exists) {
                if (!exists) return;
                // Создадим новую вкладку со списком бонусов
                $('<div class="surfTab" />')
                    .appendTo($(this).eq(0))
                    .html('<span>Взять все бонусы</span>')
                    .attr({
                        'onclick': 'surf.tabs.tabClick(this, event);',
                        'data-tab-content': '#surfSchoolBonus'
                    });

                var bonusTab = $('<div id="surfSchoolBonus" />')
                    .addClass('surfTabContent surfDarkBlock flatTop')
                    .append('<em class="blockBg"></em>')
                    .appendTo('#surfSchool .surfTabContentWrap');

                // Список зданий
                var base = ('//st.fotocdn.net/app/sports/newsurf/school/');
                var tipBase = ('//st.fotocdn.net/z/images/sports/equip/');

                var buildings = [{
                    id: 8, img: 'img/buildings/o_8_3.png', getBonus: true,
                    tooltip: {
                        title: 'Шоколадный массаж',
                        slotName: 'Допинг',
                        img: tipBase + '691_b.png',
                        value: '+6000',
                        kind: 'doping'
                    }
                }, {
                    id: 1, img: 'img/buildings/o_1_3.png', getBonus: false, // false
                    tooltip: {
                        title: 'Магазин',
                        simple: 'Уникальное снаряжение школы'
                    }
                }, {
                    id: 5, img: 'img/buildings/o_5_3.png', getBonus: true,
                    tooltip: {
                        title: 'Хороший тонус',
                        slotName: 'Воодушевление',
                        img: tipBase + '247_b.png',
                        value: '+15%',
                        kind: 'doping'
                    }
                }, {
                    id: 4, img: 'img/buildings/o_4_3.png', getBonus: true,
                    tooltip: {
                        title: 'Школьный воск Deluxe',
                        slotName: 'Допинг',
                        img: tipBase + '619_b.png',
                        value: '+4200',
                        kind: 'doping'
                    }
                }, {
                    id: 2, img: 'img/buildings/o_2_5.png', getBonus: true,
                    tooltip: {
                        title: 'Братство серферов',
                        slotName: 'Допинг',
                        img: tipBase + '122_b.png',
                        value: '+3000',
                        kind: 'doping'
                    }
                }, {
                    id: 6, img: 'img/buildings/o_6_2.png', getBonus: true,
                    tooltip: {
                        title: 'Бонус',
                        simple: 'Элемент коллекции в подарок'
                    }
                }, {
                    id: 7, img: 'img/buildings/o_7_1.png', getBonus: false, // false
                    tooltip: {
                        title: 'Тяжелая травма',
                        simple: 'Лечение тяжёлых травм'
                    }
                }, {
                    id: 3, img: 'img/buildings/o_3_3.png', getBonus: true,
                    tooltip: {
                        title: 'Тайная злость',
                        slotName: 'Навык',
                        img: tipBase + '418_b.png',
                        value: '+15000',
                        kind: 'perk'
                    }
                }];

                // Просто открыть здание
                var onlyOpen = function(e) {
                    e.preventDefault();
                    var buildingId = $(this).data('buildingId');
                    surf.school.openBuilding(buildingId);
                };

                // Стандартная функция для бонуса
                var defaultBonus = function(e) {
                    e.preventDefault();
                    var buildingId = $(this).data('buildingId');
                    surf.school.openBuilding(buildingId);
                    var popup = ('#surfPopup.questPopup');
                    $fotostrana.missingElement(popup, function(exists) {
                        if (!exists) return;
                        // Забираем бонус
                        surf.school.getBuildingBonus(buildingId);
                        // Сразу закроем окно
                        $fotostrana.missingElement(popup + ' .popupClose', popup + ' .equipItem .tooltip', function(exists) {
                            if (!exists) return;
                            $(this).trigger('click');
                        });
                    });
                };

                // Бонусы братства
                var brothershipBonus = function(e) {
                    e.preventDefault();
                    var buildingId = $(this).data('buildingId');
                    surf.school.openBuilding(buildingId);
                    $fotostrana.missingElement('#surfPopup.questPopup', function(exists) {
                        if (!exists) return;
                        // Забираем все бонусы
                        var bonusIndex = 0;
                        var bonusList = [ 2001, 2002, 2003, 2005 ];
                        var bonusTimer = setInterval(function() {
                            surf.school.getSchoolBonus(bonusList[bonusIndex]);
                            if (++bonusIndex >= bonusList.length) {
                                clearInterval(bonusTimer);
                            }
                        }, self.missingPause / 2);
                        // Сразу закроем окно
                        setTimeout($$.createDelegate(function() {
                            $(this).find('.popupClose').trigger('click');
                        }, this), self.missingPause * 5 / 2);
                    });
                };

                // Подсказка для допингов и навыков
                var profile = {
                    doping: {
                        slide: 'Скольжение',
                        turn: 'Поворот',
                        balance: 'Баланс'
                    },
                    perk: {
                        boost: 'Ускорение'
                    }
                };

                var dopingTooltip = function(value, type) {
                    var current = profile[type];
                    if (!current)
                        return '';

                    var ttip = [];
                    for (var kind in current) {
                        var row = {
                            kind: kind, value: value, name: current[kind]
                        };
                        ttip.push($$.template(surfBonusTemplate, row));
                    }
                    return ttip.join('\r\n')
                };

                // Создать всплывающую подсказку
                var bonusTooltip = function(index, elem) {
                    var tooltip = buildings[index].tooltip;
                    if (!tooltip)
                        return;

                    var content = $$.template(surfSimpleTemplate, tooltip);
                    if (!tooltip.simple) {
                        tooltip.bonuses = dopingTooltip(tooltip.value, tooltip.kind);
                        content = $$.template(surfDetailsTemplate, tooltip);
                    }
                    elem.tooltip({
                        tooltipExt: false, extraClass: 'simpleTooltip', content: content
                    });
                };

                // Вкладываем дивы по порядку
                var table = $('<div class="surfSchoolBonusList" />')
                    .appendTo(bonusTab);

                for (var bIndex = 0, bLen = buildings.length; bIndex < bLen; bIndex++) {
                    var building = buildings[bIndex];
                    var item = $('<div class="surfSchoolBonusItem" />')
                        .attr({ href: '?building=' + building.id })
                        .data('buildingId', building.id)
                        .appendTo(table);

                    bonusTooltip(bIndex, item);

                    $('<div class="surfSchoolBonusImageWrap" />')
                        .append($$.format('<img src="{0}" />', base + building.img))
                        .appendTo(item);

                    var linkText = (building.getBonus) ? ('Взять бонус') : ('Открыть здание');
                    item.append(linkText);

                    // События
                    var handler = null;
                    if (building.getBonus && building.id != 2) {
                        // Стандартное взятие бонуса
                        handler = defaultBonus;
                    } else if (!building.getBonus) {
                        // Просто откроем
                        handler = onlyOpen;
                    } else if (building.id == 2) {
                        // Бонусы братства
                        handler = brothershipBonus;
                    }
                    item.unbind('click').click(handler);
                }
            });
        }

        /**
         * Взять ежедневный бонус во всех играх по серфингу
         */
        , minigameBonus: function() {
            if (!this.isSportsPage())
                return;

            var self = this;

            // Кнопка для битвы на равных
            $('<div class="daylyGamesPerson rascally" />')
                .prependTo('.surfScrollWrap.questsWrap .surfScroll')
                .wrap('<div class="sQuestIco" />')
                .attr({ title: 'Битва на равных' })
                .tooltip()
                .click(function(e) {
                    location.href = ('//fotostrana.ru/sports/honestEvent/');
                });

            // Кнопка для задир
            $('<div class="daylyGamesPerson extreme" />')
                .prependTo('.surfScrollWrap.questsWrap .surfScroll')
                .wrap('<div class="sQuestIco" />')
                .attr({ title: 'Экстремальные задиры' })
                .tooltip()
                .click(function(e) {
                    location.href = ('//fotostrana.ru/sports/extremeEvent/');
                });

            // Кнопка для мини-игр
            $('<div class="daylyGamesPerson atlantis" />')
                .prependTo('.surfScrollWrap.questsWrap .surfScroll')
                .wrap('<div class="sQuestIco" />')
                .attr({ title: 'Мини-игры' })
                .tooltip()
                .click(function(e) {
                    $('#surfFriendsWrap .dailyGames').trigger('mouseenter').trigger('click');
                });

            setTimeout($$.createDelegate(function() {
                this.surfRescroll('.questsWrap.surfScrollWrap');
            }, self), self.missingPause);

            // Быстрые кнопки в открытом окне
            $fotostrana.missingElement('#surfFriendsWrap .dailyGames, #surfFriendsWrap .dailyGames + .sFriendTooltip', function(exists) {
                if (!exists) return;
                $(this).click(function(e) {
                    // Задержка, потому что на момент клика старый #surfPopup ещё не уничтожен
                    setTimeout($$.createDelegate(self.openMinigames, self), self.missingPause);
                });
            });
        }

        /**
         * Создает кнопки в окне мини-игр
         */
        , openMinigames: function() {
            var self = this;

            $fotostrana.missingElement('#surfPopup.surfMinigamesPopup', function(exists) {
                if (!exists) return;
                var popup = $(this);

                popup.addClass('minigameCustom');

                // Подготовим контейнер для дублей
                var minigameWrap = $('<div class="surfScrollWrap ta-l minigameDoubleWrap" />')
                    .insertBefore(popup.find('.surfScrollWrap'));

                var selContainer = 'minigameDoubleContainer';
                var elemContainer = $('<div class="surfScroll" />').addClass(selContainer)
                    .appendTo(minigameWrap);

                // Добавляем игры из кубка
                self.extraCupBonus(popup);

                // Добавляем к каждой игре кнопку бонуса
                popup.find('.surfMinigame').each(self.minigameWindowClick);

                // Если все игры пройдены
                var container = popup.find('.' + selContainer);
                if (container.children().length == 0) {
                    $('<div class="emptyTitle" />').text('Ты прошел все мини-игры и собрал все бонусы.')
                        .appendTo(container);
                }

                // Добавим кнопку для мороженого
                $('<div class="miniAward surfArrow bottom" />')
                    .prependTo(container)
                    .wrap('<div class="minigameDoubleCell icePop" />')
                    .attr({ title: 'Фруктовый экстра-лед' })
                    .tooltip()
                    .click(function(e) {
                        location.href = ('//fotostrana.ru/sports/dailyGift/petpromo/');
                    });

                // Добавим кнопку для подарочных заплывов
                $('<div class="miniAward surfArrow bottom" />')
                    .prependTo(container)
                    .wrap('<div class="minigameDoubleCell giftZaplyv" />')
                    .attr({ title: 'Бесплатные заплывы' })
                    .tooltip()
                    .click(function(e) {
                        surf.index.addRounds();
                        var after = function() {
                            $('#surfPopup .popupClose').trigger('click');
                            location.replace(location.href);
                        };
                        setTimeout(after, self.missingPause);
                    });

                // Добавляем бампер слева и справа
                $('<div class="miniBumper left" />').prependTo(elemContainer);
                $('<div class="miniBumper right" />').appendTo(elemContainer);
                self.surfRescroll(minigameWrap);
            });
        }

        /**
         * Дополнительные бонусы из кубка
         */
        , extraCupBonus: function(popup) {
            var extraWrap = $('<div class="surfScrollWrap ta-l" />')
                .insertAfter(popup.find('.building__content').eq(0))
                .wrap('<div class="building__content nclear minigameMonthContainer" />');

            $('<div class="surfPagination" />')
                .appendTo(extraWrap);

            var monthBonus = $('<ul class="surfScroll" />')
                .appendTo(extraWrap);

            // Делим по столбцам
            var even = true, index = 0, grid = [], len = extraCupList.length;
            while (index < len) {
                even = !even;
                var column = [];
                column.push(extraCupList[index]);
                index++;
                if (!even && (index < len)) {
                    column.push(extraCupList[index]);
                    index++;
                }
                grid.push(column);
            }

            grid.forEach(function(column, colIndex) {
                var litem = $('<li class="surfMinigamesCol" />')
                    .appendTo(monthBonus);
                if (colIndex % 2 == 1) {
                    litem.addClass('even');
                }
                column.forEach(function(elem) {
                    $($$.template(surfMinigameCard, elem)).appendTo(litem);
                });
            });

            surf.scroll(extraWrap);
        }

        /**
         * Заново рассчитывает прокрутку
         */
        , surfRescroll: function(selector) {
            var scrollWrap = $(selector);
            scrollWrap.find('.surfArrow.left, .surfArrow.right').remove();
            surf.scroll(scrollWrap);
        }

        /**
         * Покинуть заплыв автоматически
         */
        , leaveSportsRound: function() {
            if (!this.isSportsRunPage())
                return;

            $fotostrana.missingElement('#mainTracks', function(exists) {
                if (!exists) return;

                // Скроем flash-ролик
                $(this).softHide();

                $fotostrana.missingElement('#surfRound .surfTab.user5.active', function(exists) {
                    if (!exists) return;
                    console.info('Пятый пошёл! %o', this);
                    $('#mainTracks').hide();
                    // Сигналим
                    $(document).data({ roundState: false });
                    setInterval(function() {
                        var roundState = !$(document).data('roundState');
                        document.title = roundState ? ('+') : ('Спортсмены выходят на старт!');
                        $(document).data({ roundState: roundState });
                    }, 1000);
                    // Покинем заплыв через 10 секунд
                    setTimeout(function() {
                        var toLeave = ('/sports/index/leave/');
                        if (/fairMiniPets/.test(location.href)) {
                            toLeave = ('/sports/fairMiniPets/leave/');
                        }
                        location.href = toLeave;
                    }, 10000);
                });
            });
        }

        /**
         * Добавляем к отдельно взятой игре кнопку бонуса
         */
        , minigameWindowClick: function() {
            // Отыщем, есть ли ссылка на прохождение игры
            var findGameId = $(this).html().match(/gamePopup\((\d+)\)/);
            var gameId = -1;
            try {
                gameId = findGameId[1];
            } catch (ex) { }

            console.info('minigameWindowClick: id == %o', gameId);
            if (gameId < 0) return;

            var miniAward = function() {
                var button = $('<div class="miniAward surfArrow bottom" />')
                    .data({ 'gameId': gameId })
                    .click(function(e) {
                        var gameId = $(this).data('gameId');
                        //console.log('click: gameId == %o', gameId);
                        surf.minigames.awardPopup(gameId);
                        // Закроем последующие окна
                        $fotostrana.missingElement('#surfPopup.surfMinigameAward .sButton', '#surfPopup .surfQuestPrize .image', function(exists) {
                            if (!exists) return;
                            $(this).trigger('click');
                            $fotostrana.missingElement('#surfPopup.surfMinigameMarket .popupClose', function(exists) {
                                if (!exists) return;
                                $(this).trigger('click');
                            });
                        });
                    });
                return button;
            };

            miniAward()
                .attr({ title: 'Взять без игры' })
                .tooltip()
                .appendTo(this);

            // Если есть возможность, то дублируем кнопку
            var container = $('#surfPopup .minigameDoubleContainer');
            if ((container.length > 0) && !$(this).is('.stop-true')) {
                var cell = $('<div class="minigameDoubleCell" />')
                    .appendTo(container)
                    .css({ backgroundImage: $(this).find('.surfMinigameIcon i').css('backgroundImage') });

                miniAward()
                    .attr({ title: $(this).find('.surfMinigameTitle').html() })
                    .tooltip()
                    .appendTo(cell);
            }
        }

        /**
         * Добавляем кнопку бонуса в вулкане
         */
        , volcanoPrizeClick: function() {
            // Отыщем, есть ли ссылка на прохождение игры
            var findGame = $(this).find('.js_get-prize');
            if (findGame.length == 0) return;

            var button = $('<div class="miniAward surfArrow bottom" />')
                .attr({ title: 'Взять без игры' })
                .tooltip()
                .appendTo(this)
                .click(function(e) {
                    var app = window.surf.Volcano;
                    var prizeGame = new app.PrizeGameView();
                    prizeGame.showPrize();
                });
        }

        /**
         * Кнопки для перемещения навыков в вулкане
         */
        , volcanoImpMove: function() {
            var self = $fotostrana;

            $('<div class="miniAward surfArrow bottom" />')
                .attr({ title: 'Вниз' })
                .tooltip()
                .appendTo(this)
                .click(function(e) {
                    $('#impruvements-block .imp .img').unbind('mouseenter').click(function(e) {
                        var app = window.surf.Volcano;
                        var impruvementId = $(this).data('impruvementId');

                        var square = app.improvementsView.collection.get(impruvementId);
                        app.improvementsView.onDragStart(square);
                        var result = app.activeImprovementsView.onDrop(square);
                        app.improvementsView.onDragEnd(result, square);

                        setTimeout(function() {
                            location.replace(location.href);
                        }, self.missingPause);
                    });
                });

            $('<div class="miniAward surfArrow top" />')
                .attr({ title: 'Вверх' })
                .tooltip()
                .appendTo(this)
                .click(function(e) {
                    $('#active-impruvements-block .imp .img').unbind('mouseenter').click(function(e) {
                        var app = window.surf.Volcano;
                        var impruvementId = $(this).data('impruvementId');

                        var square = app.activeImprovementsView.collection.get(impruvementId);
                        app.activeImprovementsView.onDragStart(square);
                        var result = app.improvementsView.onDrop(square);
                        app.activeImprovementsView.onDragEnd(result, square);

                        setTimeout(function() {
                            location.replace(location.href);
                        }, self.missingPause);
                    });
                });

            $('<div class="volcanoRunCalc" />')
                .attr({ title: 'Посчитать количество заплывов' })
                .tooltip()
                .appendTo(this)
                .click(function(e) {
                    self.volcanoRunShow();
                });
        }

        /**
         * Показать количество заплывов
         */
        , volcanoRunShow: function() {
            var self = this;

            $fotostrana.missingElement('.auto-buttons button', function(exists) {
                if (!exists) return;

                $('.auto-buttons .volcanoRunBtn').remove();

                var modeList = [ 'reliably', 'riskily' ];
                modeList.forEach(function(mode) {
                    var data = self.volcanoRunCount(mode);
                    var button = $('.auto-buttons .js_on-' + mode);
                    var color = button.attr('class').match(/b_grd-button--\w+/);
                    if (color) {
                        color = color[0];
                    }
                    var opener = $('<button />')
                        .appendTo('.auto-buttons .content')
                        .addClass('volcanoRunBtn b_grd-button ' + color)
                        .attr({ title: data.title })
                        .tooltip()
                        .text(data.step)
                        .data('popup', data)
                        .click(function(e) {
                            var data = $(this).data('popup');
                            surf.popup.show(data.html, data.css_class, data.title);
                        });
                });

                //surf.popup.show(data.html, data.css_class, data.title);
            });
        }

        /**
         * Посчитать количество заплывов
         */
        , volcanoRunCount: function(mode) {
            var app = window.surf.Volcano;
            var step = 0;
            var runCount = 0;
            var runMemory = false;
            var message = [];

            var countWithCase = function(value) {
                return $$.numberWithCase(value, 'навык', 'навыка', 'навыков').replace(' ', '</td><td class="tleft">');
            };

            // points - рискованно, possibility - надежно
            var sortBy = (mode == 'riskily') ? 'points' : 'possibility';
            var titleBy = (mode == 'riskily') ? 'Рискованно' : 'Надежно';

            // Берем навыки и сортируем "рискованно"
            var prepareSkills = new app.SkillsCollection(app.skillsView.collection.toJSON());
            var beforeCount = countWithCase(prepareSkills.length);
            var before = ('На старте</td><td></td><td>—</td><td>' + beforeCount);
            if (prepareSkills.length < 10) {
                runMemory = true;
            }

            while ((step < this.volcanoMaxStep) && (prepareSkills.length > 0)) {
                // удаляем по одному лучшему навыку
                var best = prepareSkills.getBestSkills(sortBy);
                best.forEach(function(item, index) {
                    var prepareItem = prepareSkills.get(item.id);
                    var newCount = (prepareItem.attributes.count * 1 - 1);
                    //console.log('%o)  %s item [%o] from %o to %o  --  %o', (index + 1), mode, item.id * 1, prepareItem.attributes.count * 1, newCount, prepareItem.attributes.title);
                    if (newCount > 0) {
                        prepareItem.attributes.count = newCount;
                    } else {
                        prepareSkills.remove(item.id);
                    }
                });

                step++;
                var className = '';
                if (!runMemory && (prepareSkills.length < 10 || step == this.volcanoMaxStep)) {
                    runCount = step;
                    runMemory = true;
                    className = 'th';
                }
                //var info = [];
                //prepareSkills.models.forEach(function(elem) {
                //    info.push({ id: elem.attributes.id * 1, count: elem.attributes.count * 1, title: elem.attributes.title });
                //});
                //console.log('после заплыва [%o] %s = %o', step, mode, info);
                var row = {
                    step: step,
                    className: className,
                    count: countWithCase(prepareSkills.length)
                };
                message.push($$.template('<tr class="{className}"><td>После заплыва</td><td>{step}</td><td>—</td><td>{count}</td></tr>', row));
            }
            //console.log(message);

            var html = { before: before, message: $$.join(message, '') };
            var data = {
                html: $$.template(surfVolcanoRunTable, html),
                css_class: 'volcanoRunCount surfPopup questPopup surfPopup-blueTitle surfPopup-dark surfPopup-w670',
                title: ('Количество заплывов. ' + titleBy),
                step: runCount
            };
            return data;
        }

        /**
         * Взять лучший комплект в сундуке
         */
        , icoChest: ('.surfProfile .profExtras .surfProfileIco.chest')

        , chestInventory: function() {
            if (!this.isSportsPage())
                return;

            var self = this;

            // Кнопка, чтобы снять все
            var createRemoveButton = function() {
                console.log('createRemoveButton');
                $(self.icoChest).click(function(e) {
                    // Задержка, потому что на момент клика старый #surfPopup ещё не уничтожен
                    setTimeout($$.createDelegate(self.removePack, self), self.missingPause * 3 / 4);
                });
            };

            // При создании кнопки заново навесим обработчик
            surf.profile.updateInfoOLD = surf.profile.updateInfo;
            surf.profile.updateInfo = function() {
                this.updateInfoOLD.apply(this, arguments);
                setTimeout(createRemoveButton, self.missingPause);
            };

            createRemoveButton();

            var actionList = {
                dress: {
                    selector: '#surfPopup #dressTopBtn',
                    title: 'При нажатии будет автоматически надет комплект вещей, который дает максимальное значение параметров.',
                    button: 'Лучший комплект'
                },
                undress: {
                    selector: '#surfPopup #undressTopBtn',
                    title: 'Снимает комплект вещей, надетых в данный момент.',
                    button: 'Снять всё'
                }
            };

            var action = actionList[self.chestAction];

            var handler = function(e) {
                $fotostrana.missingElement(self.icoChest, function(exists) {
                    if (!exists) return;
                    $(this).trigger('click');
                    var pressButton = function() {
                        $fotostrana.missingElement(action.selector, function(exists) {
                            if (!exists) return;
                            //surf.inventory.popup.dressTopClick();
                            //surf.inventory.dressTopEquip(true);
                            $(this).trigger('click');
                            //$('#surfPopup .popupClose').trigger('click');
                        });
                    };
                    // Задержка, потому что на момент клика старый #surfPopup ещё не уничтожен
                    setTimeout(pressButton, self.missingPause);
                });
            };

            // Кнопка лучшего комплекта
            var chestButton = $('<div class="sFriend" />')
                .appendTo('#surfIndex .surf_topContent_left .surfFriendsBlock .surfScroll')
                .hover(
                    function(e) { $(this).addClass('hover'); },
                    function(e) { $(this).removeClass('hover'); }
                );

            var btnContent = $('<div class="sFriend__c">')
                .appendTo(chestButton);

            $('<div class="autoDress">')
                .append('<em class="surfProfileIco chest image">')
                .appendTo(btnContent)
                .attr({ title: action.title })
                .tooltip()
                .click(handler);

            $('<div class="sFriendTooltip">')
                .append('<div class="name">Снаряжение</div>')
                .append($$.template('<div class="links small">{button}</div>', action))
                .appendTo(btnContent)
                .click(handler);
        }

        /**
         * Создает кнопку, которая снимает всё снаряжение в сундуке
         */
        , removePack: function() {
            var self = this;

            $fotostrana.missingElement('#surfPopup.surfInventoryPopup #dressTopBtn', function(exists) {
                if (!exists) return;
                // Предотвращаем дублирование
                if ($(this).parent().find('.surfInvIco-removePack').length > 0)
                    return;

                $('<div id="undressTopBtn" class="sButton big type3" />')
                    .insertAfter(this)
                    .text(' Снять всё ')
                    .prepend('<div class="surfInvIco surfInvIco-removePack" />')
                    .click(function(e) {
                        var inventories = $$.join([
                            '.surfInvChestContent .surfInvClothes .surfInvItem.isOn',
                            '.surfInvChestContent .surfInvArtefacts .surfInvItem.isOn',
                            '.surfInvChestContent .surfInvAddons .surfInvItem.isOn'
                        ], ', ');

                        // Снимаем снаряжение по одному слоту за раз
                        var removeTimer = setInterval(function() {
                            var nodes = $(inventories);
                            if (nodes.length > 0) {
                                nodes.eq(0).trigger('click');
                            } else {
                                clearInterval(removeTimer);

                                // Если вкладка не успела обновиться
                                var slotIsEmpty = function() {
                                    $('#surfPopup .popupClose').trigger('click');
                                    var profEquip = $('#profTab1 .profEquip .slot:not(.empty)');
                                    var profExtraEquip = $('#profTab1 .profExtraEquip .slot:not(.empty)');
                                    if (profEquip.length > 0 || profExtraEquip.length > 0) {
                                        location.replace(location.href);
                                    }
                                };
                                setTimeout(slotIsEmpty, self.missingPause / 2);
                            }
                        }, self.missingPause / 2);
                    });
            });
        }

        /**
         * Взять ежедневный бонус в кубке по серфингу
         */
        , cupBonus: function() {
            if (!this.isCupPage())
                return;

            $fotostrana.missingElement('#surfCup .surfShopMinigame', this.minigameWindowClick);
        }

        /**
         * Взять ежедневный бонус в вулкане
         */
        , volcanoBonus: function() {
            if (!this.isVolcanoPage())
                return;

            // Ежедневный бесплатный бонус
            $fotostrana.missingElement('#volcano-prize .get-prize-block', this.volcanoPrizeClick);

            $fotostrana.missingElement('#volcano-app .awards .content', this.volcanoImpMove);
        }

        /**
         * Ждём, пока отрисуется элемент, и выполняем действия
         */
        , missingElement: function(selector, mouseOver, callback) {
            // Аргумент mouseOver может отсутствовать, сразу callback
            var method;
            var self = this;

            if ($$.isFunction(mouseOver)) {
                method = mouseOver;
            } else {
                $(mouseOver).trigger('mouseenter');
                method = function(exists) {
                    setTimeout($$.createDelegate(function() {
                        $(mouseOver).trigger('mouseleave');
                        callback.call(this, exists);
                    }, this), self.missingPause);
                };
            }
            $$.missingElement(selector, method, self.missingPeriod);
        }

        /**
         * Запустим систему в работу
         */
        , startSports: function() {
            this.styleSurf();
            this.chestInventory();
            this.schoolBonus();
            this.minigameBonus();
            this.cupBonus();
            this.volcanoBonus();
            this.volcanoRunShow();
            this.leaveSportsRound();
        }
    });
    unsafeWindow.$fotostrana.startSports();
})(paramWindow);