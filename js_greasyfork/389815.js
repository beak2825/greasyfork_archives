// ==UserScript==
// @name        Fotostrana Pet Interface
// @namespace   scriptomatika
// @description Делает интерфейс Фотостраны более удобным
// @include     http*://*fotostrana.ru/pet*
// @include     http*://*fotostrana.ru/app*
// @include     http*://*fotostrana.ru/finance*
// @include     http*://*fotostrana.ru/sports*
// @require     https://greasyfork.org/scripts/379902-include-tools/code/Include%20Tools.js
// @require     https://greasyfork.org/scripts/389814-fotostrana-sports/code/Fotostrana%20Sports.js
// @noframes
// @icon        http://userscripts.scriptomatika.ru/icon/favicon-389815.png
// @author      mouse-karaganda
// @version     1.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/389815/Fotostrana%20Pet%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/389815/Fotostrana%20Pet%20Interface.meta.js
// ==/UserScript==

(function(unsafeWindow) {
    if (unsafeWindow.self != unsafeWindow.top)
        return;

    var console = unsafeWindow.console;
    var $$ = unsafeWindow.__krokodil;
    var $ = unsafeWindow.jQuery;

    console.log('💬  Фотострана пришла! pet');

    if (!unsafeWindow.$fotostrana) {
        unsafeWindow.$fotostrana = {};
    }

    $$.extend(unsafeWindow.$fotostrana, {
        /**
         * Определим, что мы находимся на страничке питомца
         */
          isPetPage: function() {
            return /\.ru\/pet/i.test(location.href);
        }
        /**
         * Определим, что мы находимся на страничке финансов
         */
        , isFinancePage: function() {
            return /\.ru\/finance/i.test(location.href);
        }
        /**
         * Стили для новых объектов
         */
        , style: function() {
            $$.renderStyle(
                '.finroom-balance-bonus { margin-left: 16px; }',
                //'.petBubble.petBottomNavBubble .bubbleIco.icoFant { background-position: -7px -7px; background-image: url(//a1.s.fsimg.ru/app/fs2pet/img/ru_fant48.png); }',
                '.petBubble.petBottomNavBubble .bubbleIco.miscIco { background-image: url(//a1.s7.fsimg.ru/app/fs2pet/img/misc.png); }',
                '.petBubble.petBottomNavBubble .miscIco.icoGift { background-position: -89px -2px; }',
                '.petBubble.petBottomNavBubble .miscIco.icoFant { background-position: -65px 0px; }',
                '.icoSize24 { width: 24px; height: 24px; }',
                '.icoSize35 { width: 35px; height: 35px; }',
                '#petGuestFriend .ownerContestLink { display: none; }',
                '#petGuestFriend:hover .ownerContestLink { display: inline; }',
                '.ownerContestLink { position: absolute; top: 36px; right: -14px; }',
                '.ownerContestLink img { border-radius: 3px; border: 1px solid #21A0D1; background-color: #FFFDFF; padding: 1px; }',
                '.ownerContestLink:hover img { border-color: #F1592B; }'
            );
        }
        /**
         * Взять ежедневный бонус в комнате финансов
         */
        , financeDailyBonus: function() {
            if (!this.isFinancePage())
                return;
            // Создадим кнопку для однокликовой комбинации
            var moreButton = ('#finroom-promos .finroom-block-more');
            $('<a class="finroom-balance-bonus" />')
                .text('Бонус за посещение')
                .attr({ href: '#' })
                .insertAfter(moreButton)
                .click(function(e) {
                    e.preventDefault();
                    $(moreButton).trigger('click');
                    $fotostrana.missingElement('.iPopup .finroom-promo-daily-btn', function(exists) {
                        if (exists) {
                            // Появилась кнопка с бонусом — кликаем
                            $(this).trigger('click');
                            $fotostrana.missingElement('.iPopup .finroom-daily-bonus-prize-btn', function(exists) {
                                if (!exists) return;
                                $(this).trigger('click');
                                $fotostrana.missingElement('.iPopup .finroom-daily-bonus-popup-close', function(exists) {
                                    if (!exists) return;
                                    $(this).trigger('click');
                                    $fotostrana.missingElement('.iPopup .popup-header .icn-cross', function(exists) {
                                        if (!exists) return;
                                        $(this).trigger('click');
                                    });
                                });
                            });
                        } else {
                            // Кнопка с бонусом не появилась
                            $('.iPopup .popup-header .icn-cross').trigger('click');
                        }
                    });
                });
        }
        /**
         * Взять ежедневный бонус в доме питомца
         */
        , petDailyBonus: function() {
            if (!this.isPetPage())
                return;
            // В течение 3 минут проверяем, что есть значок бонуса
            $fotostrana.missingElement('#dailyBonusIco', function(exists) {
                if (!exists) return;
                $(this).trigger('click');
                // ждем окно с кнопкой
                $fotostrana.missingElement('#bonusDayButton', function(exists) {
                    if (!exists) return;
                    // Появилась кнопка с бонусом — кликаем и сразу закрываем
                    $(this).trigger('click');
                    $fotostrana.missingElement('#popup.bonusDay .popupClose', function(exists) {
                        $(this).trigger('click');
                    });
                });
            });
        }
        /**
         * Имя питомца и его владельца
         */
        , petOwnerName: function() {
            if (!this.isPetPage())
                return;
            // Извлечем имя питомца и его владельца
            var extractNames = function() {
                if (!APP.currentPet)
                    return;
                // Имя питомца
                var petName = APP.currentPet.name;
                // Имя владельца
                var ownerName = APP.currentPet.ownerName;
                if (!petName || !ownerName)
                    return;
                petName = $$.format('{0} и {1}', ownerName, petName);
                document.title = $$.format('{0} - {1} - @', petName, document.title);
            };
            // Ссылка на голосование для владельца
            var contestLink = function() {
                if (!APP.currentPet)
                    return;
                // ID владельца
                var ownerId = APP.currentPet.ownerId;
                if (!ownerId)
                    return;
                // Ищем блок владельца
                var petUserImg = $('#petGuestFriend').find('.petUserImg');
                if (petUserImg.length == 0)
                    return;
                // Ищем ссылку на голосование
                var ownerContestLink = $('#petGuestFriend').find('.ownerContestLink');
                // Предотвращаем дублирование
                if (ownerContestLink.length > 0)
                    return;
                // Создаем ссылку на голосование
                $('<a />').insertAfter(petUserImg)
                    .addClass('ownerContestLink')
                    .bindHelpTooltip('Голосование')
                    .attr({ href: ('/contest/' + ownerId), target: '_blank' })
                    .each(function(index, elem) {
                        $('<img />').appendTo(this)
                            .attr({
                                alt: 'vote',
                                src: ('//i02.fotocdn.net/6/app_favicon/6/6805.jpg')
                            })
                    });
            };
            var getNames = function() {
                // Проверим, не было ли изменено заглавие ранее
                if (!/- @$/.test(document.title)) {
                    extractNames();
                }
                // Ссылка на голосование для владельца
                contestLink();
            };
            getNames();
            setInterval(getNames, 1000);
        }
        /**
         * Скрыть все периферийные элементы
         */
        , hideBackground: function() {
        /*
            $fotostrana.missingElement('#header a.link-text[href*="/rating/"]', function() {
                var link = $(this);
                var showState = !link.data('showState');
                link.data('showState', showState);
                if (showState) 
                    link.text('Выключить фон')
                    .unbind('click').bind('click', function() {
                        $('#logo-wrap')
                            .add('#photocontest-link')
                            .add('#header .link-text')
                            .add('#header .link-ico')
                            .add('#header .profile-link')
                            .add('#season-centered-box')
                            .add('#header-add-pin')
                            .add('#activity-rating-counter')
                            .add('#inviteUserBlock')
                            .add('#notifiers-wrap')
                            .add('#tickersHomeWrap')
                            .add('.petFriendsListWrap .petUserImg img')

                            .add('#flPetHome')
                            .add('#petToSeasonHomeIco') // вопрос
                            .add('#homeDoorHalloween')
                            .add('#petHome #homeScrollPrev')
                            .add('#petHome #homeScrollNext')
                            .add('#petNewHomeBottomBanner')
                            .add('#questIconsList')
                            .add('#petBlock .phrase')
                            .add('#petBlock .thinkBalloon')
                            .softHide()
                            //.css('visibility', 'visible')
                        $('#footer.pet_footer')
                            .add('#petTopNavigationContainer')
                            .add('#bottomPanelEvents')
                            .hide();
                        $('#petAreaWrap')
                            .css({ marginTop: 0 })
                        $('#header a.link-text[href*="people"]')
                            .css('visibility', 'visible');
                        $('#petBlock .image')
                            .show();
                    });
                }
            }*/
        }
        /**
         * Автокликер для дома (набираем опыт на бесплатных действиях)
         */
        , autoActions: function() {
            if (!this.isPetPage())
                return;
            $fotostrana.missingElement('#petActionsPanel .petActionsList', function(exists) {
                if (!exists) return;
                // Определим максимум шагов таймера на этот раз
                var appendStep = Math.trunc(Math.random() * 20) + 1;
                // Назначим кнопку для включения таймера
                var petActionsList = $(this);
                var itemTimer = $fotostrana.itemTimer();
                itemTimer.text('Таймер')
                    .data({
                        timerState: false, 
                        title: 'Включить таймер', 
                        ico: -1, 
                        step: 0,
                        maxStep: 40 + appendStep
                    })
                    //.bindHelpTooltip($(this).data('title'))
                    .hover(function(e) {
                        delete this.tooltip;
                        helpTooltip.show(this, $(this).data('title'));
                    }, function(e) {
                        helpTooltip.hide(this);
                    })
                    .unbind('click').bind('click', function(e) {
                        e.preventDefault();
                        $fotostrana.toggleAutoTimer(petActionsList);
                    });
                // Проверим, задано ли автоматическое включение таймера
                var storageKey = ('autoActionsRestart.' + itemTimer.data('petId'));
                if ($$.isString(localStorage[storageKey])) {
                    localStorage.removeItem(storageKey);
                    setTimeout(function() {
                        $fotostrana.toggleAutoTimer(petActionsList);
                    }, 5000);
                }
            });
        }
        /**
         * Пункт меню, содержащий таймер
         */
        , itemTimer: function() {
            var petId = location.href.match(/\/pet\/(\d+)/)[1];
            return $('#header .link-text[href*="people"]')
                .data({ petId: petId });
        }
        /**
         * Включим или выключим таймер для автоматических действий
         */
        , toggleAutoTimer: function(petActionsList) {
            // Распределим группы параметров
            var setGroupData = function() {
                petActionsList.find('li.petActionsItem')
                .each(function() {
                    // Найдем вид параметра
                    var groupId = '#' + $(this).attr('id');
                    // Найдем идентификатор группы внутри модуля
                    var home = APP.module('home').home;
                    var groupIndex = $$.each(home.operationGroups, function(elem, index, source) {
                        if (elem.selector == groupId)
                            return true;
                    });
                    $(this).data({ groupId: groupId, groupIndex: groupIndex });
                });
            };
            // Манипулируем состоянием пункта меню
            var itemTimer = $fotostrana.itemTimer();
            var timerState = !itemTimer.data('timerState');
            itemTimer.data('timerState', timerState);
            if (timerState) {
                // Включим таймер автоклика
                itemTimer.text('Таймер').data({ title: 'Выключить таймер' })
                    .css({ color: 'yellow' });
                // Скроем flash-ролик дома
                $('#flPetHome').softHide();
                // Скроем баннеры в доме
                $('div[id$="Banner"], div[class$="Banner"]')
                    // Скроем навигацию по приложениям
                    .add('#petTopNavigationContainer')
                    .hide();
                setGroupData();
                $fotostrana.findAvailableAction();
                $fotostrana.autoActionsTimer = setInterval($fotostrana.findAvailableAction, 10000);
            } else {
                // остановим таймер
                itemTimer.text('Таймер').data({ title: 'Включить таймер'})
                    .css({ color: '' });
                // Вновь покажем flash-ролик дома
                $('#flPetHome').css({ visibility: '' });
                // Покажем баннеры в доме
                $('div[id$="Banner"], div[class$="Banner"]')
                    // Скроем навигацию по приложениям
                    .add('#petTopNavigationContainer')
                    .show();
                clearInterval($fotostrana.autoActionsTimer);
                console.warn('Таймер выключен');
            }
            // Сменим подсказку
            helpTooltip.hide(itemTimer.get(0));
            //itemTimer.trigger('mouseover');
        }
        /**
         * Ищем доступные бесплатные действия
         */
        , findAvailableAction: function() {
            // Проведем мышкой над упавшими бонусами
            $('#homeInterface .paramsVisual').trigger('mouseover');
            // Откроем действия, если мы в гостевом домике
            $('#petActionsPanel .petActionsTabs').find('.petActions.off')
                .trigger('click');
            // Закроем всплывающее окно, если открыто
            $('#popup:visible').find('.popupClose')
                .trigger('click');
            // Закроем вспомогательные окошки
            $('#petBlock .thinkBalloon')
                .add('#petBlock .phrase')
                .softHide();
            // Подключаемся к модулю
            var home = APP.module('home').home;
            // Критерии поиска
            var search = {
                // Берем только бесплатные
                notPrice: function(index, elem) {
                    // Берем только бесплатные
                    //var price = $(this).children('.price.coins');
                    var price = $(this).children('.price');
                    return price.length == 0;
                },
                // Запомним данные об операции
                setOperationData: function(groupIndex) {
                    return function() {
                        var opNode = $(this).find('.ico');
                        // Отыскиваем текущую операцию в модуле
                        var homeOp = null;
                        try {
                            homeOp = home.operations[groupIndex];
                        } catch (ex) { }
                        if (!homeOp) {
                            // Выключим таймер (и перезагрузим ?)
                            return;
                        }
                        var opIndex = $$.each(homeOp, function(elem, index, source) {
                            if (opNode.hasClass(elem.css_class))
                                return true;
                        });
                        var oneOp = null;
                        try {
                            oneOp = homeOp[opIndex];
                        } catch (ex) { }
                        if (!oneOp) return;
                        //console.log('oneOp RESULT: %o', oneOp);
                        // Переписываем некоторые сведения об отдельной операции из модуля
                        $(this).data({
                            selector: home.operationGroups[groupIndex].selector,
                            name: oneOp.name,
                            title: oneOp.title,
                            time: oneOp.time,
                            exp: oneOp.opt_general, // опыт
                            health: oneOp.opt_health,
                            happy: oneOp.opt_joy,
                            satiety: oneOp.opt_hunger,
                            clean: oneOp.opt_clear
                        });
                        //console.log('oneOp DATA: %o', $(this).data());
                    };
                },
                // Определим, даст ли действие максимальную продуктивность
                findMaxCapacity: function() {
                    var data = $(this).data();
                    // 1) Найдем все плюсовые и минусовые действия
                    var plusOp = [],
                        minusOp = [],
                        groups = ['health', 'happy', 'satiety', 'clean'],
                        values = {};
                    $$.each(groups, function(elem) {
                        if (data[elem] > 0) {
                            plusOp.push(elem);
                        } else if (data[elem] < 0) {
                            minusOp.push(elem);
                        }
                    });
                    //console.info('findMaxCapacity [%o / %o]: plusOp == %o, minusOp == %o', data.selector, data.name, plusOp, minusOp);
                    // 2) Найдем текущие значения всех параметров
                    $('#petHealth, #petHappy, #petSatiety, #petClean')
                        .each(function() {
                            var groupNode = $(this);
                            // Сначала определим название группы
                            var groupIndex = $$.each(groups, function(elem, index, source) {
                                if (groupNode.hasClass(elem))
                                    return true;
                            });
                            // Извлечем и запомним значение
                            var groupValue = groupNode.find('.petActionsGroupValue').text();
                            groupValue = parseInt($.trim(groupValue));
                            var paramName = groups[groupIndex];
                            var plusVal;
                            values[paramName] = {
                                val: groupValue, 
                                plus: (plusVal = data[paramName]) > 0 ? plusVal : 0
                            };
                        });
                    //console.info('findMax [%s/%s]: %o, values == %o', data.selector, data.name, data.title, values);
                    // 3) Разрешим действие, если хотя бы один из плюсовых параметров меньше локального максимума
                    var maximum = 100,
                        plusResult = false,
                        minusResult = false;
                    $$.each(plusOp, function(elem, index, source) {
                        // Локальный максимум - это шаг, который нужно сделать данным действием,
                        // чтобы в следующую (а не в текущую) итерацию получить максимум
                        var localMaximum = (maximum - values[elem].plus);
                        plusResult = plusResult || (values[elem].val <= localMaximum);
                    });
                    // 4) Если все плюсовые параметры на максимуме, то
                    //    запретим действие, если хотя бы один из минусовых параметров меньше максимума
                    if (!plusResult) {
                        $$.each(minusOp, function(elem, index, source) {
                            minusResult = minusResult || (values[elem].val < maximum);
                        });
                    }
                    var result = plusResult || !minusResult;
                    console.info('findMax [%s/%s]: %o, values == %o, result == %o', data.selector, data.name, data.title, values, {plus: plusResult, minus: minusResult, res: result});
                    return result;
                },
                // Автоматическая перезагрузка
                cronAutomaticRestart: function() {
                    var itemTimer = $fotostrana.itemTimer();
                    var nextStep = itemTimer.data('step') + 1;
                    var maxStep = itemTimer.data('maxStep');
                    itemTimer.data('step', nextStep);
                    // Остановим таймер и перезагрузим
                    if (nextStep >= maxStep) {
                        $fotostrana.toggleAutoTimer();
                        var storageKey = ('autoActionsRestart.' + itemTimer.data('petId'));
                        localStorage.setItem(storageKey, true);
                        location.replace(location.href);
                    };
                },
                // Логи и надпись в зависимости от того, есть ли доступные действия
                renderTimerInfo: function(actionCount) {
                    var doConsole = (actionCount > 0) ? 'info' : 'log';
                    console[doConsole]('Доступно действий: %o', actionCount);
                    // Определим, какую картинку показать
                    var icoChar = '|/-\\|/-\\';
                    var itemTimer = $fotostrana.itemTimer();
                    var nextIco = itemTimer.data('ico') + 1;
                    if (nextIco >= icoChar.length) {
                        nextIco = 0;
                    }
                    var maxStep = itemTimer.data('maxStep');
                    var timerText = $$.template('Таймер {ico} {current} из {max}', {
                        ico: icoChar[nextIco],
                        current: maxStep - itemTimer.data('step') + 1,
                        max: maxStep
                    });
                    itemTimer.text(timerText).data('ico', nextIco);
                    // Выделим цветом, если есть действие
                    var timerColor = (actionCount > 0) ? 'lime' : 'yellow';
                    itemTimer.css({ color: timerColor });
                }
            };
            
            var actionCount = 0;

            // Найдем виды параметров
            var actions = $('#petActionsPanel .petActionsList')
                .find('li.petActionsItem')
                .reverse()
                .each(function() {
                    // Найдем вид параметра
                    var groupId = $(this).data('groupId');
                    // Найдем значение параметра
                    var groupValue = $(this).find('.petActionsGroupValue').text();
                    groupValue = parseInt($.trim(groupValue));
                    // Найдеи индекс группы внутри модуля
                    var groupIndex = $(this).data('groupIndex');
                    // Найдем доступные бесплатные действия
                    var operations = $(this).find('div[id^="operationGroup"] li:not(.unavailable)')
                        .filter(search.notPrice)
                        // Для каждого действия находим, какие параметры и как оно изменяет
                        .each(search.setOperationData(groupIndex))
                        // Выберем только те из них, которые дадут максимальную продуктивность
                        .filter(search.findMaxCapacity);
                    //console.log('Действие %o == %o, группа == %o, бесплатные == %o', groupId, groupValue, groupIndex, operations);
                    // Выполняем первое действие из найденных (бесплатное, доступное, продуктивное)
                    if (operations.length > 0) {
                        actionCount = 1;
                        operations.eq(0).trigger('click');
                        return false;
                    }
                });
            search.cronAutomaticRestart();
            search.renderTimerInfo(actionCount);
            //APP.animation.config - все возможные действия
        }
        /**
         * Быстрые настройки в доме питомца
         */
        , petQuickSettings: function() {
            if (!this.isPetPage())
                return;
            $fotostrana.missingElement('#petMoneyAndOptions', function(exists) {
                if (!exists) return;
                // Создадим кнопку для быстрых настроек
                var quickSettings = $('<div />').prependTo(this)
                    .attr({ id: 'petQuickSettings' })
                    .addClass('fl-l');
                var btnSettings = $('<div />').appendTo(quickSettings)
                    .addClass('petNavigationButton small')
                    .click(function(e) {
                        // Кликаем по кнопке настроек
                        $('#petOptionsToggle').toggle('mouseenter');
                        // Ждём появления кнопки настроек
                        $fotostrana.missingElement('.petOptionsWrap #settingsLink', function(exists) {
                            if (!exists) return;
                            //$(this).toggle('click');
                            // Ждем появления окна с настройками
                            $fotostrana.missingElement('#popup.popupSettings', function(exists) {
                                if (!exists) return;
                                // Если сервисные зоны включены, отключим их
                                $('#petServiceZonesCheckbox:not(:checked)').parent('label').toggle('click');
                            });
                        });
                    });
                var icoSettings = $('<i />').appendTo(btnSettings)
                    .addClass('petButtonSmallIco petOptionsItem icoSize20 icoPos9');
            });
        }
        /**
         * Подарки друзьям в доме питомца
         */
        , giftsInPetWorld: function() {
            if (!this.isPetPage())
                return;
            $fotostrana.missingElement('.petBubble.petWorld', function(exists) {
                if (!exists) return;
                var list = $(this).find('.content ul');
                // Добавим кнопку для раздачи ключей в подарках
                $('<a href="?gifts=key" />').prependTo(list)
                    .wrap('<li class="item fl-l" />')
                    .append('<em class="bubbleIco icoSize28 miscIco icoGift" />')
                    .tooltip({
                        tooltipExt: false, extraClass: 'simpleTooltip', content: 'Подарить ключи друзьям'
                    })
                    .click($fotostrana.sendKeyGift);
                // Добавим кнопку для ежедневного бонуса
                var bonusBtn = $('#dailyBonusIco');
                if (bonusBtn.length > 0) {
                    $('<a href="?bonus=daily" />').prependTo(list)
                        .wrap('<li class="item fl-l" />')
                        .append('<em class="bubbleIco icoSize24 miscIco icoFant" />')
                        //.append('<em class="bubbleIco icoSize35 icoFant" />')
                        .tooltip({
                            tooltipExt: false, extraClass: 'simpleTooltip', content: 'Ежедневный бонус'
                        })
                        .click(function(e) {
                            e.preventDefault();
                            $fotostrana.petDailyBonus();
                        });
                        // Скроем вип-клуб
                        list.find('li#vip').hide();
                }
            });
            
        }
        /**
         * Отослать ключ в подарок через интерфейс
         */
        , sendKeyGift: function(e) {
            if (!!e && e.preventDefault) {
                e.preventDefault();
            }
            // Отыщем первого друга, у кого есть значок подарка
            var friendWithGift = $('.petFriendsListWrap .petFriendsItem .giftBlock');
            if (friendWithGift.length == 0) {
                // Прокрутим и вернемся позже
                console.warn('Нет друга с подарком');
                $('.petFriendsContainer .scrollArrow.right').trigger('click');
                setTimeout($fotostrana.sendKeyGift, 2000);
                return;
            }
            console.warn('Есть друг с подарком');
            friendWithGift.eq(0).trigger('click');
            $fotostrana.missingElement('#popup.notActivePetsGifts', function(exists) {
                if (!exists) return;
                // Если нет подарков - сразу отключаемся
                if ($(this).is('.noGift')) return;
                            console.log('Найдено окно notActivePetsGifts');
                // Найдем пункт с ключиком
                var keyItem = $(this).find('.giftList li')
                    .filter(function(index, elem) {
                        var span = $(this).find('span').css('backgroundImage');
                        return /gifts\/key/i.test(span);
                    });
                            console.log('Найден ключ giftList li == %o', keyItem.find('span').eq(0));
                setTimeout($$.createDelegate($fotostrana.doKeyGift, keyItem), 200);
            });
        }
        /**
         * Непосредственно отправка ключа в подарок
         */
        , doKeyGift: function() {
            $(this).eq(0).trigger('click');
            // Отправим ключ другу
            $('#popup.notActivePetsGifts').find('.giftsWrap .buttons .btnSend')
                .trigger('click');
            $fotostrana.missingElement('#popup.friendsGiftRequest', function(exists) {
                if (!exists) return;
                // Определим, где располагается ключ
                var keyItem = $(this).find('.requestObjectScrollContainer img[src*="gifts/key"]').parent('div');
                var keyPosition = $(this).find('.requestObjectScrollContainer div').index(keyItem);
                // Найдем ширину, на которую нужно подвинуть ленту
                var keyWidth = keyItem.width() * keyPosition;
                // Жмем на кнопку, пока не отмотаем нужную ширину
                var _this = this;
                var keyTimer = -1;
                var keyHandler = function() {
                    var currentLeft = $(_this).find('.requestObjectScrollContainer').css('left');
                    currentLeft = Math.abs(parseInt(currentLeft));
                    if (currentLeft >= keyWidth) {
                        // Отодвинулись на нужную ширину - больше не надо кликать
                        clearInterval(keyTimer);
                        // Отправляем ключ дальше
                        setTimeout($$.createDelegate(function() {
                            $(this).find('.requestsSendButton .button.sendAll').trigger('click');
                        }, _this), 200);
                    } else {
                        // Если ключ ещё не показался, кликаем дальше
                        $(_this).find('.scrollArrow.right').trigger('click');
                    }
                };
                keyHandler();
                keyTimer = setInterval(keyHandler, 800);
            });
        }
        /**
         * Запустим систему в работу
         */
        , startPet: function() {
            this.style();
            this.financeDailyBonus();
            this.petOwnerName();
            this.petQuickSettings();
            this.autoActions();
            this.giftsInPetWorld();
        }
    });
    unsafeWindow.$fotostrana.startPet();
})(paramWindow);
