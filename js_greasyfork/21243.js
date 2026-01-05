// ==UserScript==
// @author Elf__X
// @name WoTExtendedStat
// @namespace http://forum.worldoftanks.ru/index.php?/topic/717208-
// @version 0.9.15.12
// @description Adds some usable fields for MMO game World of Tanks user's page 
// @match http://worldoftanks.ru/*/accounts/*
// @match http://worldoftanks.eu/*/accounts/*
// @match http://worldoftanks.com/*/accounts/*
// @match http://worldoftanks.asia/*/accounts/*
// @match http://worldoftanks.kr/*/accounts/*
// @include http://worldoftanks.ru/*/accounts/*
// @include http://worldoftanks.eu/*/accounts/*
// @include http://worldoftanks.com/*/accounts/*
// @include http://worldoftanks.asia/*/accounts/*
// @include http://worldoftanks.kr/*/accounts/*
// @require http://code.jquery.com/jquery-1.11.1.min.js
// @connect wnefficiency.net
// @connect armor.kiev.ua
// @connect noobmeter.com
// @connect wot-noobs.ru
// @connect bitbucket.org
// @connect worldoftanks.ru
// @connect worldoftanks.eu
// @connect worldoftanks.com
// @connect worldoftanks.asia
// @connect worldoftanks.kr
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/21243/WoTExtendedStat.user.js
// @updateURL https://update.greasyfork.org/scripts/21243/WoTExtendedStat.meta.js
// ==/UserScript==

//try {
    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) == 0;
        };
    }

    if (typeof String.prototype.capitalize != 'function') {
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
    }
    
    //Общие переменные
    var wesGeneral, 
        wesAccount, 
        wesSettings, 
        wesApiKey,
        wesScriptVersion = '0.9.15.12',
        stTypeKeys = ['clan', 'company', 'stronghold_skirmish', 'stronghold_defense', 'team'],
        stStatKeys = ['battles', 'wins', 'damage_dealt', 'spotted', 'frags', 'capture_points', 'dropped_capture_points'];

    //Локализация
    String.toLocaleString({
        'en': {
            'confirmDelete': 'Are you sure you want to delete the saved statistics of this player?',
            'scriptVersion': " <a href='http://forum.worldoftanks.ru/index.php?/topic/717208-' " +
                "target='_blank'>Script</a> version " + wesScriptVersion,
            'scriptName': 'WOT extended statistic script',
            'localStorageIsFull': 'The localStorage is crowded. Deleting the saved data of one of the players, ' +
                'or reduce the amount saved in the settings.',
            'settings': 'Script settings',
            'settingsText': 'Extended statistic script settings',
            'error': 'Error',
            'errorText': 'An error has occurred',
            'save': 'Save',
            'general': 'General',
            'blocks': 'Blocks',
            'players': 'Players',
            'lsSize': 'In localStorage occupied',
            'saveCount': 'Save count',
            'graphs': 'Graphs',
            'date': 'Date',
            'battles': 'Battles',
            'dntshow': "Don't show",
            'player': "Player",
            'me': "Me",
            'saveStat': "Save statistic",
            'delStat': "Delete statistic",
            'lastBattle': "Last Battle:",
            'lastUpdate': "Last Update:",
            'maxDamage': 'Max. damage',
            'maxFrags': 'Max. frags',
            'maxXp': 'Max. Xp',
            'treesCut': 'Trees Cut',
            'wins': "Wins",
            'saved': "Saved",
            'showBlock': 'Show block',
            'hideBlock': 'Hide block',
            'deleteBlock': 'Delete block',
            'blockEfRat': 'Eff. ratings',
            'blockNewBat': 'New battles',
            'blockCompStat': 'Compare stats',
            'blockClan': 'Clans history',
            'blockPers': 'Personal',
            'blockSpeed': 'Speedometers',
            'blockAchiev': 'Achievements',
            'blockCommon': 'Common',
            'blockDiagr': 'Diargams',
            'blockRat': 'Ratings',
            'blockVeh': 'Vehicles',
            'blockHall': 'Hall of fame',
            'efficiency': 'Efficiency',
            'rEffXvm': 'Eff. rating xwm',
            'rWn6Xvm': 'WN6 Rating xwm',
            'rWn8Xvm': 'WN8 Rating xwm',
            'rNagXvm': 'PR rating xvm',
            'rNoobrating': 'Wot-noobs rating',
            'rBattles': 'Battles',
            'rExp': 'Exp. per battle',
            'rDamage': 'Damage per battle',
            'rFrag': 'Frags per battle',
            'rSpot': 'Spotted per battle',
            'rDeff': 'Deffs per battle',
            'rCap': 'Caps per battle',
            'rEff': 'Eff. rating',
            'rWn6': 'WN6 Rating',
            'rWn8': 'WN8 Rating',
            'rNag': 'PR rating',
            'rArmor': 'Eff. rating of BS',
            'rKwg': 'Personal rating',
            'rBatteDay': 'Battles per day',
            'rMedLvl': 'Average level of tanks',
            'rWin': 'Win %',
            'rLoose': 'Defeat %',
            'rSurv': 'Survived %',
            'rHit': 'Hit ratio',
            'globalMap': 'Clan battles',
            'rota': 'Company battles',
            'rGWin': 'Win',
            'sWaitText': 'Please wait.',
            'about': 'About',
            'nWin': 'Win',
            'new': 'New',
            'hsaved': 'Saved',
            'current': 'Current',
            'historic': 'Historical battles',
            'other': 'Other',
            'graph': 'Graphs',
            'rating': 'Ratings',
            'statFrom': 'Statistic from',
            'language': 'Language',
            'donate': 'Please, give some money to support the author',
            'noNewBattles': 'No new battles',
            'medals': 'Medals'
        },
        'ru': {
            'confirmDelete': 'Вы действительно хотите удалить сохраненную статистику данного игрока?',
            'scriptVersion': "Версия <a href='http://forum.worldoftanks.ru/index.php?/topic/717208-' " +
                "target='_blank'>скрипта </a> " + wesScriptVersion,
            'scriptName': 'Скрипт расширенной статистики WOT',
            'localStorageIsFull': 'Локальное хранилище переполнено. Пожалуйста, удалите сохраненные данные одного ' +
                'из игроков, или уменьшите количество сохранений в настройках.',
            'settings': 'Настройки скрипта',
            'settingsText': 'Настройки скрипта расширенной статистики',
            'error': 'Ошибка',
            'errorText': 'Произошла ошибка:',
            'save': 'Сохранить',
            'general': 'Общие',
            'blocks': 'Блоки',
            'players': 'Игроки',
            'lsSize': 'В локальном хранилище занято',
            'saveCount': 'Количество сохранений',
            'graphs': 'Графики',
            'date': 'Дата',
            'battles': 'Бои',
            'dntshow': 'Не отображать',
            'player': "Игрок",
            'me': "Я",
            'saveStat': "Сохранить статистику",
            'delStat': "Удалить статистику",
            'lastBattle': "Был в бою:",
            'lastUpdate': "Обновлено:",
            'maxDamage': 'Макс. урон',
            'maxFrags': 'Макс. фрагов',
            'maxXp': 'Макс. опыт',
            'treesCut': 'Повалено деревьев',
            'wins': "Победы",
            'saved': "Сохранено",
            'showBlock': 'Показать блок',
            'hideBlock': 'Скрыть блок',
            'deleteBlock': 'Удалить блок',
            'blockEfRat': 'Рейтинги эффективности',
            'blockNewBat': 'Новые бои',
            'blockCompStat': 'Сравнение статистики',
            'blockClan': 'История кланов',
            'blockPers': 'Личные данные',
            'blockSpeed': 'Спидометры',
            'blockAchiev': 'Достижения',
            'blockCommon': 'Общее',
            'blockDiagr': 'Диаграммы',
            'blockRat': 'Рейтинги',
            'blockVeh': 'Техника',
            'blockHall': 'Аллея славы',
            'efficiency': 'Эффективность',
            'rEffXvm': 'Эффективность xvm',
            'rWn6Xvm': 'WN6 Рейтинг xvm',
            'rWn8Xvm': 'WN8 Рейтинг xwm',
            'rNagXvm': 'Рейтинг нагиба xvm',
            'rNoobrating': 'Нубо-Рейтинг',
            'rBattles': 'Боев',
            'rExp': 'Опыт за бой',
            'rDamage': 'Повреждений за бой',
            'rFrag': 'Фрагов за бой',
            'rSpot': 'Обнаружено за бой',
            'rDeff': 'Очков защиты за бой',
            'rCap': 'Очков захвата за бой',
            'rEff': 'Эффективность',
            'rWn6': 'WN6 Рейтинг',
            'rWn8': 'WN8 Рейтинг',
            'rNag': 'Рейтинг нагиба',
            'rArmor': 'Эффективность БС',
            'rKwg': 'Личный рейтинг',
            'rBatteDay': 'Боев в день',
            'rMedLvl': 'Средний уровень танков',
            'rWin': '% побед',
            'rLoose': '% поражений',
            'rSurv': '% выживания',
            'rHit': '% попадания',
            'globalMap': 'Глобальная карта',
            'rota': 'Ротные бои',
            'rGWin': 'Побед',
            'sWaitText': 'Пожалуйста подождите.',
            'about': 'О скрипте',
            'nWin': 'Побед',
            'new': 'Новые',
            'hsaved': 'Сохр. данные',
            'current': 'Тек. данные',
            'historic': 'Исторические бои',
            'other': 'Прочее',
            'graph': 'Графики',
            'rating': 'Рейтинги',
            'statFrom': 'Статистика с',
            'language': 'Язык',
            'donate': 'Поддержать автора скрипта',
            'noNewBattles': 'Нет новых боев',
            'medals': 'Медали'
        }
    });
    
    String.defaultLocale = 'en';
    
    var _ = function (str) {
        return str.toLocaleString();
    };
    
    //Тут общие методы и функции которые нужны на нескольких страницах сайта
    wesGeneral = {
      apiKey: {
        'ru': '895d3dafdd87af03e1e515befcd83882',
        'en': 'd0a293dc77667c9328783d489c8cef73',
        'com': '16924c431c705523aae25b6f638c54dd',
        '': ''
      },
      defaultSettings: {
          locale: window.location.host.endsWith(".ru") ? 'ru' : 'en',
          version: 0,
          blocks: {
              'efRat': 0, 
              'newBat': 0,
              'compStat': 0,
              'compStat1': 0,
              'pers': 0, 
              'speed': 0, 
              'hall': 0, 
              'achiev': 0, 
              'common': 0, 
              'diagr': 0, 
              'rat': 0,
              'veh': 0
          },
          myID: 0,
          graphs: 1,
          scount: 7,
          ncount: 2, // Кол-во символов для округления
          players: {}
      },
      styles: {
        'default': '\
  .wes-progressbar {background-color: black; border-radius: 4px; padding: 2px;}\
  .wes-progressbar > div {width: 0%; height: 4px; border-radius: 2px;}\
  .wes-settings {display: none; z-index: 1005; width: 800px; height: 500px; max-height: 100%; margin: auto;\
  overflow: auto; position: fixed; top: 50px; left: 0; bottom: 0; right: 0; }\
  .wes-error {display: none; z-index: 1005; width: 500px; height: 500px; max-height: 100%; margin: auto;\
  overflow: auto; position: fixed; top: 50px; left: 0; bottom: 0; right: 0;}\
  .wes-wait {display: none; background: rgb(31, 31, 31); z-index: 1006; width: 500px; height: 300px; margin: auto;\
  overflow: auto; position: fixed; top: 50px; left: 0; bottom: 0; right: 0; text-align: center;}\
  .wes-title {color: #ffffff; border-radius: 2px 2px 0 0; font-family: "WarHeliosCondCBold",arial,sans-serif;\
  background: url("/static/3.20.0.2/portal/js/plugins/jquery-ui/css/images/bg-popup-title.jpg") no-repeat scroll 50% 0 #313134;\
  font-size: 21px; height: 49px;}\
  .wes-title-span {display: inline-block; padding: 12px 38px 0 19px;}\
  .wes-overlay {display: none; position: fixed; top: 0; left: 0; height: 100%; width: 100%; z-index: 1004;\
  background-color: rgba(0,0,0,0.5);}\
  .wes-close-titlebar {right: 8px; position: absolute; top: 50%; width: 33px; margin: -242px 0 0 0;\
  height: 32px;}\
  .wes-close-titlebar > span {background: url(/static/3.20.0.2/common/img/btn-popup-close.png) 0 0 no-repeat !important;\
  width: 33px !important; height: 33px !important; display: block; text-indent: -99999px; overflow: hidden;\
  background-repeat: no-repeat;}\
  .wes-error-text {background: rgb(31, 31, 31); height: 450px; margin-top: 15px;}\
  .wes-error-icon {display: block; width: 450px !important; height: 43px !important; text-indent: 42px;\
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAWgSURBVFiFrZdLiGRXGcd/331U1a1Hv2p6uoZ+6PRkxEeiSQghTnAhtgSF6Co4WlkZXIhkk42CBnQnuHLjRlEClooPGBGUgewUJApxYJoZodsZOulM9XR3dXdVz626t+6953NRt7qru6sfM5MDH/f1nfP/ne+c851zRVV52FITyQDTQAVoAatV1eZDNwTIWQBqIi6wIHAVeFltu5QtFoNsoWDiMJTQ9zNJEIgF/zLwa+BaVfX+hwJQE3lF4KelSqVwfn6+ODY3Z2VHRqDbxXS7iG0j2SzGGFqrq2yurLQ37txRjaKfK/yoqrrzSAA1kUsWXCtOTX10/oUXil6pRLy+TtxooO12Wlt6V1XEdbEnJnDKZbRQ4N6NG8Hq4mKkxrxeVX3roQBqIp8XkWuXr1wpnJuft8O7d4k3NpC+oMi+eL/021FF8nmyFy8SWxY3r1/3u63WLxTeqKqaUwFqIl+0MplrTy4s5L1cjuDWLTAGRHoAwyAGxFGl36ZbqeDMzfHft9/2m/X6X76h+vXDANYh8Y+JyJ+eWljI54whuHkTkmRI3OTE536konqd8PZtPrGwUPDGx1+uiXzvWICaiC3wt8svvljIuS7h8vJwsdNgDhXTbBIuLfGpl14qOJ73Zk3ks0MBgG+OTU+fL8/OWsGtW/tvT1umadhPKsnmJmxucvn55z0LfnYEoCaSF5EfX3zuuWK4vNwb89NED4sPQOgQqO7KCmMzM5KfmHiiJvLVAwDAKxOzs27GcYgbjaNCx4mf9O7wszFEKyt85Omnixa8eQDAglcnZ2dL0dra8eIDs3toBPbcjofo3r9P6cIFsO2naiITAFZNJGNEPjcyM0O8uXliIwoYVTT1OWKpz4H7weckQX2fsQsXIuBL/QjMZDwvsgDT7R5b2QyAHfE5DHQMBEDUajFSLheATwI4wHQml0tMEPScRJC00qeXlnjcsvjssySt1j54EODk81jwRD8C01nPs5J2e4/WDI73Y5bDkYiDANfzAOb6AO2429XDoTplIZ4dIG2zP3ewLEwUAbShNwQfdDsdsO29IdAeOu9eurSX6WQw452U/QbmyeB175vjED54gMLdPYAwDN3E94maTcRxENsG296/tyxUdR/ilOE5Ip4uV9NuI80mHd83Cv8DcKqqa78R8f2tLc9EEWZnyPnBsnoHD9ftQbnuvvUhB1dIf1dMEkwQoEFA0ulAHOPOzLDz3ntt4J/9CAD8sbW19a3R0VE78f2jAMagxkBv7E7u/QnfJJcjBkLfF+DvkGZChdr21lZbRkdRyzq6xs9gJrWTfNypKZrr67HAn6uqyR5AVfUfcRgutppN45TLjyR+mg/ZLFIqsVGvdxV+0I/K3nas8J2N9fUOIyOQy31ovVZARchMT7NZr4eaJG9VVe8eAaiq/sfE8e/W6vUHztQUOM5j93ov9JUKfhjqdqPR0oGd8ABAGoVvt9vt243t7dCZmgLXffRepz13zp8ncl3W7t3rrMNXqqqNQc0DAK+CU4PXtlqttfs7O4E9OYl43iP1GsfBrVToiOjq++8H76p+/w2oi0hhUPPAqVh6e/TEDMx8F35yLpN5cnJ0NOcYQ9xqoWdYhlgWTqmEVSyyvbubbLdanT/AD/8K7wANYFNVN44DGAUmgLIF5dfha8/A1YLnOWP5vOuIYMIQjaJeXkiP61gW4jjYuRzquvidjm7t7kYfGLP4S/jVci/tNoAtYFVV20MBUogR4BwwDoxPQuU1uPpx+IJt21Y+k3GyjmPZloWVpmijSpwk7Ha73SSK7A3VO7+H374Dt4EdYDsFuDcoPhQghbCAElAGRoGSBcUvw2eegSvjMOdBOQulGMIObO/CxhLcuA7/XuuJ+fT+nDeAhqoOSbFn+DlNYTKAB+RSy6bm0pubERAOWBvoqOqpk+b/JDuHWUtrBlIAAAAASUVORK5CYII=") 0 0 no-repeat !important;\
  overflow: hidden; margin-left: 30px;}\
  #wes-error-text {height: 350px; overflow: auto; padding-left: 25px; width: 90%;}\
  .wes-colored-button {background-position: 0 0; display: inline-block; height: 30px; margin-right: 35px;\
  background: url(/static/3.20.0.2/common/css/scss/form_elements/buttons/img/btn-bg.png) 0 -60px no-repeat;}\
  .wes-button-right {background-position: 100% 0; \
  background: url(/static/3.20.0.2/common/css/scss/form_elements/buttons/img/btn-bg.png) no-repeat 100% -60px;}\
  .wes-button-right input {background: none; border: medium none; color: #fff; cursor: pointer; float: left;\
  font: bold 13px Arial,"Helvetica CY",Helvetica,sans-serif; height: 31px; padding: 0 22px 1px; \
  text-align: center;}\
  .wes-tabs {padding-left: 10px; padding-top: 7px; width: 775px;} \
  .wes-tabs span { padding: 5px; border: 1px solid #aaa; line-height: 28px; cursor: pointer; \
  position: relative; bottom: 1px; z-index: 1007; background: rgb(31, 31, 31);}\
  .wes-tab-content {display: block; border: 1px solid #aaa; height: 370px; z-index: 1006; \
  margin: 3px 10px 7px 10px; overflow: auto; background: rgb(31, 31, 31);}\
  .wes-tab-content > div {margin: 10px; height: 90%; text-align: center; font-size: 12pt;}\
  .wes-active-tab {border-bottom: 1px solid rgb(31, 31, 31) !important;}\
  .wes-setting-half {width: 33%; text-align: center; float:left; padding-top: 20px;}\
  .wes-s-expander {clear: both; text-align: right;margin-bottom: 15px;}\
  .wes-s-expander a.b-vertical-arrow__open {margin-bottom: 0;}\
  .wes-s-expander.wes-s-expander__extra {margin-top: 20px;}\
  .wes-h-header {display: inline-block; width: 33%; text-align: right;}\
  .wes-h-header:first-child {width: 66%; text-align: left;}\
  .t-profile th.wes-r-header {cursor: pointer;cursor: hand;}\
  .t-profile th.wes-r-header__active {background-color: rgba(0, 0, 0, 0.5);color: #fefefe;text-shadow: 0 0 13px rgba(255, 255, 255, 0.13);}\
  .wes-sb-new {position: relative;}\
  .pluso-box {z-index: 2000 !important;}\
  span.wes-s-newcounter {vertical-align: super; font-size: 0.8em;}\
  .us-ratings {width: 109%; text-align: center;}\
  .us-ratings td {border: 1px solid #212123; padding: 3px 5px;}\
  .us-ratings-head {background-color: rgba(0, 0, 0, 0.5);}'
      },
      defaultValues: {
        'wn8': '{"1":{"dmg":511.21,"def":1.06,"frag":1.04,"spot":1.46,"wRate":55.71},"17":{"dmg":544.32,"def":0.96,"frag":1.12,"spot":1.33,"wRate":55.45},"33":{"dmg":600.51,"def":1.17,"frag":1.26,"spot":1.59,"wRate":55.62},"49":{"dmg":1059.93,"def":0.89,"frag":0.87,"spot":1.69,"wRate":51.18},"81":{"dmg":232.98,"def":1.16,"frag":1.83,"spot":0.91,"wRate":58.3},"113":{"dmg":204.01,"def":0.97,"frag":1.55,"spot":0.81,"wRate":59.05},"257":{"dmg":577.37,"def":1.16,"frag":1.12,"spot":0.58,"wRate":54.46},"273":{"dmg":914.41,"def":1.17,"frag":1.03,"spot":0.08,"wRate":52.18},"289":{"dmg":249.1,"def":1.26,"frag":1.03,"spot":2.34,"wRate":56.56},"305":{"dmg":626.29,"def":0.63,"frag":0.57,"spot":2.29,"wRate":50.2},"321":{"dmg":285.38,"def":1.47,"frag":1.2,"spot":0.8,"wRate":57.96},"337":{"dmg":257.67,"def":1.17,"frag":1.5,"spot":0.92,"wRate":57.43},"353":{"dmg":231.07,"def":1.35,"frag":1.39,"spot":1.18,"wRate":57.43},"369":{"dmg":242.99,"def":1.56,"frag":1.32,"spot":1.43,"wRate":58.5},"513":{"dmg":1065.87,"def":0.78,"frag":1,"spot":1.05,"wRate":53.68},"529":{"dmg":1092.65,"def":0.98,"frag":0.96,"spot":1,"wRate":53.06},"545":{"dmg":196.48,"def":1.12,"frag":1.53,"spot":1.86,"wRate":57.13},"561":{"dmg":1056.54,"def":0.91,"frag":0.88,"spot":1.7,"wRate":50.94},"577":{"dmg":197.72,"def":1.49,"frag":1.45,"spot":1.15,"wRate":56.83},"593":{"dmg":251.27,"def":1.48,"frag":1.41,"spot":2.12,"wRate":58.86},"609":{"dmg":198.09,"def":1.57,"frag":1.58,"spot":1.08,"wRate":57.36},"625":{"dmg":313.45,"def":1.5,"frag":1.08,"spot":1.15,"wRate":58.63},"769":{"dmg":208.34,"def":0.98,"frag":0.81,"spot":2,"wRate":54.05},"785":{"dmg":261.29,"def":1.69,"frag":1.52,"spot":1.65,"wRate":58.69},"801":{"dmg":824.92,"def":0.85,"frag":1,"spot":1.07,"wRate":53.75},"817":{"dmg":1318.19,"def":0.76,"frag":0.99,"spot":1.33,"wRate":52.38},"833":{"dmg":244.88,"def":1.53,"frag":1.54,"spot":0.13,"wRate":57.79},"849":{"dmg":494.79,"def":1.64,"frag":1.27,"spot":0.86,"wRate":57.68},"865":{"dmg":257.68,"def":1.4,"frag":1.5,"spot":1.53,"wRate":58.56},"881":{"dmg":397.16,"def":1.31,"frag":1.05,"spot":1.19,"wRate":56.9},"1025":{"dmg":251.4,"def":1.29,"frag":1.43,"spot":1.93,"wRate":58.11},"1041":{"dmg":587.5,"def":1.26,"frag":1.13,"spot":0.76,"wRate":53.93},"1057":{"dmg":595.6,"def":1.05,"frag":1.24,"spot":1.51,"wRate":56.91},"1073":{"dmg":946.6,"def":0.94,"frag":0.94,"spot":1.51,"wRate":53.98},"1089":{"dmg":326.95,"def":1.27,"frag":0.99,"spot":1.03,"wRate":54.04},"1105":{"dmg":732.15,"def":0.95,"frag":1.05,"spot":2,"wRate":54.69},"1121":{"dmg":914.22,"def":1,"frag":0.89,"spot":1.04,"wRate":50.9},"1137":{"dmg":513.5,"def":1.03,"frag":0.91,"spot":1.51,"wRate":53.88},"1297":{"dmg":900.4,"def":1.13,"frag":0.87,"spot":1.25,"wRate":53.22},"1313":{"dmg":698.18,"def":1.02,"frag":0.99,"spot":1.49,"wRate":55.22},"1329":{"dmg":244.08,"def":1.56,"frag":1.85,"spot":1.26,"wRate":57.64},"1345":{"dmg":235.06,"def":1.98,"frag":1.39,"spot":1.21,"wRate":58.59},"1361":{"dmg":289.16,"def":1.35,"frag":1.14,"spot":1.79,"wRate":57.27},"1377":{"dmg":484.73,"def":0.99,"frag":0.92,"spot":1.21,"wRate":53.75},"1393":{"dmg":769.67,"def":1.03,"frag":0.99,"spot":1.51,"wRate":53.07},"1537":{"dmg":418.75,"def":0.97,"frag":1.09,"spot":1.29,"wRate":56.75},"1553":{"dmg":729.44,"def":1.11,"frag":1.02,"spot":0.77,"wRate":52.51},"1569":{"dmg":971.2,"def":1.01,"frag":0.95,"spot":1.65,"wRate":54.57},"1585":{"dmg":1011.45,"def":0.84,"frag":0.8,"spot":1.57,"wRate":50.34},"1601":{"dmg":226.85,"def":2.02,"frag":1.34,"spot":0.97,"wRate":57.26},"1617":{"dmg":358.25,"def":0.92,"frag":0.96,"spot":0.9,"wRate":53.53},"1633":{"dmg":367.67,"def":1.04,"frag":0.99,"spot":1.24,"wRate":55.59},"1649":{"dmg":1007.57,"def":0.94,"frag":0.97,"spot":1.28,"wRate":53.17},"1793":{"dmg":1197.46,"def":0.78,"frag":0.93,"spot":0.05,"wRate":52.01},"1809":{"dmg":444.65,"def":1.12,"frag":1.38,"spot":0.62,"wRate":56.09},"1825":{"dmg":251.59,"def":1.45,"frag":1.47,"spot":2.41,"wRate":59.08},"1841":{"dmg":1421.28,"def":0.69,"frag":0.88,"spot":1.43,"wRate":50.32},"1889":{"dmg":735.95,"def":1.04,"frag":0.96,"spot":1.09,"wRate":51.83},"1905":{"dmg":1114.15,"def":0.85,"frag":0.82,"spot":1.1,"wRate":50.72},"2049":{"dmg":299.25,"def":0.94,"frag":0.82,"spot":2.17,"wRate":55.96},"2065":{"dmg":249.58,"def":1.55,"frag":1.46,"spot":1.81,"wRate":58.25},"2081":{"dmg":252.88,"def":1.78,"frag":1.47,"spot":0.32,"wRate":57.01},"2097":{"dmg":1603.37,"def":0.63,"frag":0.89,"spot":1.26,"wRate":51.37},"2113":{"dmg":717.22,"def":1.6,"frag":1.4,"spot":0.12,"wRate":55.96},"2129":{"dmg":436.2,"def":1.03,"frag":0.91,"spot":1.72,"wRate":54.54},"2145":{"dmg":347.64,"def":1.32,"frag":1.39,"spot":1.21,"wRate":58.63},"2161":{"dmg":1804.9,"def":0.86,"frag":1.14,"spot":1.17,"wRate":52.66},"2305":{"dmg":1020.49,"def":0.78,"frag":1.02,"spot":0.53,"wRate":52.7},"2321":{"dmg":762.91,"def":1.02,"frag":1.01,"spot":1.15,"wRate":53.91},"2353":{"dmg":265.96,"def":1.4,"frag":1.57,"spot":1.35,"wRate":59.26},"2369":{"dmg":434.32,"def":1.64,"frag":1.73,"spot":1.23,"wRate":58.97},"2385":{"dmg":287.3,"def":1.15,"frag":1.13,"spot":0.95,"wRate":56.63},"2401":{"dmg":306.28,"def":1.36,"frag":1.25,"spot":1.65,"wRate":57.97},"2417":{"dmg":2119.58,"def":0.85,"frag":1.23,"spot":1.38,"wRate":50.39},"2561":{"dmg":734.12,"def":0.93,"frag":0.98,"spot":1.41,"wRate":54.8},"2577":{"dmg":645.63,"def":1.04,"frag":1.02,"spot":1.2,"wRate":53.75},"2593":{"dmg":1741.94,"def":0.62,"frag":0.98,"spot":0.72,"wRate":50.74},"2625":{"dmg":787.38,"def":0.79,"frag":0.9,"spot":0.92,"wRate":52.19},"2657":{"dmg":1151.44,"def":0.98,"frag":0.85,"spot":1.24,"wRate":51.05},"2817":{"dmg":855.53,"def":0.74,"frag":1.09,"spot":1.11,"wRate":54.17},"2833":{"dmg":372.32,"def":1.44,"frag":1.2,"spot":0.17,"wRate":56.55},"2849":{"dmg":1280.24,"def":0.69,"frag":0.82,"spot":0.83,"wRate":50.95},"2865":{"dmg":1273.22,"def":0.78,"frag":0.89,"spot":1.13,"wRate":52.26},"2881":{"dmg":225.92,"def":0.96,"frag":0.66,"spot":0.75,"wRate":52.79},"2897":{"dmg":611.27,"def":1.24,"frag":1.1,"spot":0.87,"wRate":54.76},"2913":{"dmg":416.67,"def":1.25,"frag":1.15,"spot":1.74,"wRate":57.48},"3073":{"dmg":253.74,"def":1.02,"frag":1.02,"spot":1.32,"wRate":55.64},"3089":{"dmg":252,"def":1.5,"frag":1.86,"spot":1.96,"wRate":59.11},"3105":{"dmg":327.52,"def":0.84,"frag":0.93,"spot":0.84,"wRate":54.22},"3121":{"dmg":329,"def":1.01,"frag":0.88,"spot":2.22,"wRate":54.97},"3137":{"dmg":1375.67,"def":0.93,"frag":1.07,"spot":0.96,"wRate":51.14},"3153":{"dmg":983.52,"def":1.11,"frag":0.89,"spot":0.85,"wRate":53.92},"3169":{"dmg":225.13,"def":1.4,"frag":1.27,"spot":1.23,"wRate":56.79},"3329":{"dmg":241.91,"def":1.51,"frag":1.85,"spot":1.28,"wRate":58.96},"3345":{"dmg":350.18,"def":1.41,"frag":1.45,"spot":1.42,"wRate":59.28},"3361":{"dmg":623.57,"def":1.13,"frag":1.16,"spot":1.15,"wRate":55.26},"3377":{"dmg":688.39,"def":0.62,"frag":0.6,"spot":2.25,"wRate":50.9},"3393":{"dmg":418.61,"def":1.48,"frag":1.26,"spot":0.16,"wRate":58.16},"3409":{"dmg":234.83,"def":1.31,"frag":0.91,"spot":0.14,"wRate":53.87},"3425":{"dmg":1557.06,"def":0.8,"frag":0.93,"spot":1.17,"wRate":50.36},"3585":{"dmg":852.84,"def":1.04,"frag":1.17,"spot":0.79,"wRate":54.65},"3601":{"dmg":326.16,"def":1.62,"frag":1.96,"spot":1.01,"wRate":59.88},"3617":{"dmg":463.35,"def":1.53,"frag":1.11,"spot":0.16,"wRate":55.35},"3633":{"dmg":1113.73,"def":0.8,"frag":1.03,"spot":1.11,"wRate":53.78},"3649":{"dmg":1869.91,"def":0.86,"frag":1.16,"spot":1.79,"wRate":48.73},"3665":{"dmg":806.94,"def":1.08,"frag":1.03,"spot":1.07,"wRate":53.13},"3681":{"dmg":1898.81,"def":0.81,"frag":1.03,"spot":1.39,"wRate":49.05},"3841":{"dmg":233.52,"def":1.32,"frag":1.44,"spot":0.11,"wRate":56.78},"3857":{"dmg":1068.76,"def":0.97,"frag":1.01,"spot":0.73,"wRate":52.61},"3873":{"dmg":1210.85,"def":0.97,"frag":1.06,"spot":1.11,"wRate":54.76},"3889":{"dmg":786.26,"def":0.58,"frag":0.58,"spot":2.38,"wRate":49.97},"3905":{"dmg":1610.8,"def":0.78,"frag":0.98,"spot":0.88,"wRate":49.66},"3921":{"dmg":1184.95,"def":0.89,"frag":0.78,"spot":1.08,"wRate":51.53},"3937":{"dmg":1864.25,"def":0.48,"frag":0.9,"spot":0.83,"wRate":50.42},"4097":{"dmg":1346.67,"def":0.66,"frag":0.92,"spot":0.03,"wRate":51.69},"4113":{"dmg":860.38,"def":0.97,"frag":0.92,"spot":1.54,"wRate":52.19},"4129":{"dmg":798.29,"def":1.35,"frag":1.07,"spot":0.09,"wRate":53.44},"4145":{"dmg":1762.87,"def":0.66,"frag":0.93,"spot":1.33,"wRate":48.14},"4161":{"dmg":597.94,"def":1.89,"frag":1.1,"spot":0.1,"wRate":52.9},"4193":{"dmg":1535.07,"def":0.54,"frag":0.85,"spot":0.64,"wRate":52.46},"4353":{"dmg":1011.77,"def":0.81,"frag":0.81,"spot":1.55,"wRate":52.6},"4369":{"dmg":328.24,"def":0.94,"frag":0.96,"spot":1.89,"wRate":56.07},"4385":{"dmg":1270.33,"def":0.88,"frag":0.89,"spot":1.19,"wRate":52.6},"4401":{"dmg":352.17,"def":1.41,"frag":1.42,"spot":1.27,"wRate":59.21},"4417":{"dmg":487.15,"def":0.89,"frag":1,"spot":1.23,"wRate":53.5},"4433":{"dmg":1604.13,"def":0.69,"frag":0.87,"spot":1.02,"wRate":50.86},"4449":{"dmg":378.51,"def":1.07,"frag":1.06,"spot":0.73,"wRate":53.91},"4609":{"dmg":269.68,"def":1.63,"frag":1.57,"spot":1.19,"wRate":59.05},"4625":{"dmg":432.25,"def":1.62,"frag":1.05,"spot":0.15,"wRate":55.13},"4641":{"dmg":384.14,"def":1.44,"frag":0.97,"spot":0.12,"wRate":53.8},"4657":{"dmg":494.15,"def":1.08,"frag":1.03,"spot":1.45,"wRate":53.77},"4673":{"dmg":961.32,"def":1.42,"frag":1.09,"spot":0.09,"wRate":53.15},"4689":{"dmg":740.41,"def":1.07,"frag":0.94,"spot":0.74,"wRate":53.03},"4705":{"dmg":345.7,"def":0.89,"frag":1.17,"spot":0.84,"wRate":56.3},"4865":{"dmg":619.79,"def":1.53,"frag":1.22,"spot":0.1,"wRate":55.75},"4881":{"dmg":271.37,"def":1.03,"frag":1.14,"spot":1.73,"wRate":57.43},"4897":{"dmg":302.61,"def":1.11,"frag":1.34,"spot":1.46,"wRate":57.22},"4913":{"dmg":433.93,"def":0.57,"frag":0.59,"spot":2.39,"wRate":51.55},"4929":{"dmg":840.62,"def":0.59,"frag":0.7,"spot":2.22,"wRate":50.73},"4945":{"dmg":325.57,"def":1.2,"frag":0.83,"spot":0.8,"wRate":54.54},"4961":{"dmg":1390.21,"def":0.73,"frag":0.94,"spot":0.86,"wRate":54.53},"5121":{"dmg":291.76,"def":1.43,"frag":1.71,"spot":0.42,"wRate":58.53},"5137":{"dmg":1227.7,"def":0.83,"frag":0.84,"spot":0.96,"wRate":51.04},"5153":{"dmg":260.36,"def":0.84,"frag":0.74,"spot":2.26,"wRate":55.44},"5169":{"dmg":687.24,"def":0.96,"frag":0.95,"spot":1.53,"wRate":52.85},"5185":{"dmg":613.95,"def":0.62,"frag":0.62,"spot":1.96,"wRate":51.12},"5201":{"dmg":308.33,"def":1.53,"frag":1.76,"spot":1.41,"wRate":59.41},"5217":{"dmg":1235.09,"def":0.78,"frag":1.08,"spot":1.07,"wRate":56.45},"5377":{"dmg":1339.67,"def":0.77,"frag":0.94,"spot":1.05,"wRate":52.37},"5393":{"dmg":365.9,"def":0.62,"frag":0.58,"spot":2.34,"wRate":52.96},"5409":{"dmg":421.86,"def":0.97,"frag":0.9,"spot":2.05,"wRate":55.37},"5425":{"dmg":1771.78,"def":0.63,"frag":0.86,"spot":1.32,"wRate":48.35},"5457":{"dmg":909.31,"def":1.04,"frag":0.97,"spot":1.69,"wRate":52.99},"5473":{"dmg":961.79,"def":0.75,"frag":1.2,"spot":0.9,"wRate":55.51},"5633":{"dmg":1016.01,"def":1.25,"frag":1.1,"spot":0.08,"wRate":53.76},"5649":{"dmg":640.53,"def":1.4,"frag":1.09,"spot":0.11,"wRate":53.4},"5665":{"dmg":251.53,"def":1.38,"frag":1.42,"spot":1.59,"wRate":58.15},"5697":{"dmg":1421.89,"def":0.79,"frag":0.96,"spot":1.3,"wRate":49.46},"5713":{"dmg":1561.71,"def":0.82,"frag":0.9,"spot":1.2,"wRate":50.94},"5729":{"dmg":837.47,"def":0.93,"frag":1.51,"spot":1.28,"wRate":56.4},"5889":{"dmg":1107.99,"def":0.79,"frag":1.02,"spot":0.83,"wRate":54.38},"5905":{"dmg":368.71,"def":1.48,"frag":1.13,"spot":0.14,"wRate":54.99},"5921":{"dmg":1124.96,"def":0.98,"frag":0.85,"spot":1.48,"wRate":52.02},"5953":{"dmg":214.75,"def":1.36,"frag":0.94,"spot":0.93,"wRate":57.2},"5969":{"dmg":1114.04,"def":0.87,"frag":0.79,"spot":1.26,"wRate":52.64},"5985":{"dmg":265.52,"def":1.19,"frag":1.61,"spot":1.23,"wRate":58.13},"6145":{"dmg":1898.6,"def":0.69,"frag":0.92,"spot":1.11,"wRate":49.61},"6161":{"dmg":339.51,"def":1,"frag":0.84,"spot":2.49,"wRate":56.62},"6177":{"dmg":288.84,"def":1.48,"frag":1.91,"spot":1.16,"wRate":57.44},"6209":{"dmg":1991.45,"def":0.78,"frag":1.07,"spot":0.99,"wRate":48.08},"6225":{"dmg":1913.65,"def":0.68,"frag":0.92,"spot":1.12,"wRate":48.71},"6401":{"dmg":398.05,"def":1.56,"frag":1.58,"spot":0.87,"wRate":58},"6417":{"dmg":413.68,"def":0.87,"frag":0.84,"spot":1.53,"wRate":53},"6433":{"dmg":345.82,"def":1.21,"frag":1.44,"spot":1.15,"wRate":57.3},"6465":{"dmg":526.59,"def":0.61,"frag":0.63,"spot":1.84,"wRate":52.02},"6481":{"dmg":351.25,"def":1.05,"frag":0.98,"spot":1.79,"wRate":56.7},"6657":{"dmg":872.72,"def":0.98,"frag":0.92,"spot":1.51,"wRate":54.23},"6673":{"dmg":398.69,"def":1.39,"frag":1.4,"spot":0.94,"wRate":58.89},"6721":{"dmg":629.89,"def":0.97,"frag":1.14,"spot":0.88,"wRate":54.02},"6913":{"dmg":564.02,"def":1.42,"frag":1.49,"spot":0.96,"wRate":58.41},"6929":{"dmg":1775.7,"def":0.61,"frag":0.86,"spot":0.86,"wRate":49.65},"6945":{"dmg":604.12,"def":1.31,"frag":1.19,"spot":1,"wRate":55.61},"6977":{"dmg":993.17,"def":0.9,"frag":0.84,"spot":0.94,"wRate":51.66},"6993":{"dmg":299.39,"def":1.02,"frag":1.32,"spot":0.96,"wRate":56.45},"7169":{"dmg":1794.19,"def":0.59,"frag":0.87,"spot":1.22,"wRate":49.14},"7185":{"dmg":685.21,"def":0.84,"frag":0.9,"spot":1.24,"wRate":53.01},"7201":{"dmg":834.35,"def":1.07,"frag":1.06,"spot":0.9,"wRate":54.82},"7233":{"dmg":1132.9,"def":1.22,"frag":0.94,"spot":0.07,"wRate":51.78},"7249":{"dmg":1874.93,"def":0.72,"frag":0.96,"spot":1.36,"wRate":50.17},"7425":{"dmg":1514.89,"def":0.77,"frag":1.12,"spot":0.54,"wRate":51.46},"7441":{"dmg":1561.36,"def":0.64,"frag":0.87,"spot":0.93,"wRate":51.35},"7457":{"dmg":1412.4,"def":0.8,"frag":0.97,"spot":0.05,"wRate":52.03},"7489":{"dmg":1324.46,"def":1.04,"frag":0.93,"spot":0.06,"wRate":50.83},"7505":{"dmg":344.99,"def":1.09,"frag":1.38,"spot":1.77,"wRate":58.87},"7681":{"dmg":427.1,"def":1.81,"frag":1.33,"spot":0.15,"wRate":54.94},"7697":{"dmg":1461.46,"def":0.94,"frag":1.05,"spot":0.6,"wRate":50.96},"7713":{"dmg":567.52,"def":1.5,"frag":1.48,"spot":1.1,"wRate":58.96},"7745":{"dmg":326.57,"def":1.69,"frag":1.95,"spot":0.76,"wRate":59.96},"7761":{"dmg":296.43,"def":1.32,"frag":1.69,"spot":1.99,"wRate":60.28},"7937":{"dmg":1416.7,"def":0.78,"frag":0.92,"spot":1.64,"wRate":51.19},"7953":{"dmg":1803.93,"def":0.8,"frag":1.04,"spot":0.63,"wRate":50.47},"7969":{"dmg":1157.11,"def":0.99,"frag":0.98,"spot":0.06,"wRate":52.57},"8017":{"dmg":367.96,"def":1.59,"frag":1.58,"spot":0.77,"wRate":57.88},"8193":{"dmg":1988.33,"def":0.81,"frag":1.18,"spot":0.65,"wRate":51.96},"8209":{"dmg":276.46,"def":0.98,"frag":0.76,"spot":1.85,"wRate":54.9},"8225":{"dmg":1352.42,"def":0.92,"frag":0.97,"spot":0.49,"wRate":51.22},"8257":{"dmg":357.41,"def":1.62,"frag":1.4,"spot":0.94,"wRate":59.02},"8273":{"dmg":282.41,"def":1.42,"frag":1.69,"spot":1.14,"wRate":58.03},"8449":{"dmg":1560.03,"def":0.69,"frag":0.92,"spot":0.03,"wRate":50.31},"8465":{"dmg":1079.15,"def":0.87,"frag":0.8,"spot":1.27,"wRate":52.13},"8481":{"dmg":1702.96,"def":0.6,"frag":0.86,"spot":0.04,"wRate":49.11},"8529":{"dmg":1388.37,"def":1.17,"frag":1,"spot":0.64,"wRate":52.62},"8705":{"dmg":1792.43,"def":0.74,"frag":0.96,"spot":0.04,"wRate":49.55},"8721":{"dmg":1473.02,"def":0.61,"frag":0.86,"spot":0.04,"wRate":49.3},"8737":{"dmg":1760.06,"def":0.68,"frag":1.04,"spot":0.46,"wRate":52.2},"8785":{"dmg":549.87,"def":1.58,"frag":1.11,"spot":0.76,"wRate":56.98},"8961":{"dmg":788.67,"def":0.91,"frag":0.85,"spot":1.47,"wRate":53.86},"8977":{"dmg":1179.13,"def":0.95,"frag":1,"spot":0.05,"wRate":51.68},"8993":{"dmg":1486.2,"def":0.75,"frag":0.91,"spot":1.46,"wRate":50.79},"9041":{"dmg":448.8,"def":1.37,"frag":1.23,"spot":1.27,"wRate":57.18},"9217":{"dmg":1403.32,"def":0.82,"frag":1.08,"spot":1.15,"wRate":53.63},"9233":{"dmg":1701.21,"def":0.55,"frag":0.89,"spot":0.04,"wRate":48.82},"9249":{"dmg":1062.78,"def":1.05,"frag":1.02,"spot":0.78,"wRate":53.42},"9297":{"dmg":2113.51,"def":0.53,"frag":1.1,"spot":0.55,"wRate":48.38},"9473":{"dmg":240.17,"def":0.66,"frag":0.62,"spot":2.54,"wRate":54.74},"9489":{"dmg":1931.54,"def":0.52,"frag":0.93,"spot":0.99,"wRate":49.73},"9505":{"dmg":1534.64,"def":0.67,"frag":0.85,"spot":1.08,"wRate":50.5},"9553":{"dmg":788.29,"def":1.36,"frag":1.04,"spot":0.67,"wRate":55.87},"9745":{"dmg":1566.14,"def":0.7,"frag":0.89,"spot":1.02,"wRate":51.05},"9761":{"dmg":456.21,"def":0.71,"frag":0.68,"spot":2.65,"wRate":54.61},"9793":{"dmg":384.76,"def":1.04,"frag":1.11,"spot":0.53,"wRate":55.04},"9809":{"dmg":677.77,"def":0.98,"frag":0.84,"spot":0.42,"wRate":51.48},"9985":{"dmg":1225.21,"def":0.94,"frag":0.95,"spot":0.87,"wRate":50.94},"10001":{"dmg":497.77,"def":0.56,"frag":0.6,"spot":2.34,"wRate":52.55},"10017":{"dmg":709.74,"def":1.05,"frag":0.98,"spot":1.19,"wRate":53.96},"10049":{"dmg":676.29,"def":1.35,"frag":1.3,"spot":0.79,"wRate":55.03},"10065":{"dmg":1190.78,"def":1.3,"frag":1.11,"spot":0.67,"wRate":56.19},"10241":{"dmg":1027.09,"def":1.11,"frag":1.01,"spot":0.82,"wRate":53.54},"10257":{"dmg":1528.52,"def":0.75,"frag":0.91,"spot":1.34,"wRate":50.48},"10273":{"dmg":473,"def":1.46,"frag":1.24,"spot":1.38,"wRate":57.91},"10497":{"dmg":862.17,"def":0.7,"frag":1.09,"spot":0.73,"wRate":54.5},"10513":{"dmg":1216.9,"def":0.84,"frag":0.86,"spot":1.19,"wRate":51.33},"10529":{"dmg":654.97,"def":1.41,"frag":1.3,"spot":1.63,"wRate":56.69},"10577":{"dmg":194.78,"def":1.21,"frag":1.3,"spot":0.23,"wRate":56.31},"10753":{"dmg":1645.19,"def":0.7,"frag":0.92,"spot":0.92,"wRate":52.72},"10769":{"dmg":1080.19,"def":1.01,"frag":0.93,"spot":0.95,"wRate":53.51},"10785":{"dmg":1888.88,"def":0.69,"frag":0.91,"spot":1.27,"wRate":48.75},"10817":{"dmg":951.66,"def":0.95,"frag":0.85,"spot":0.67,"wRate":51.47},"10833":{"dmg":331.15,"def":1.59,"frag":0.86,"spot":0.1,"wRate":52.84},"11009":{"dmg":1179.34,"def":0.73,"frag":0.81,"spot":0.81,"wRate":52.5},"11025":{"dmg":1016.32,"def":0.89,"frag":0.97,"spot":0.49,"wRate":49.87},"11041":{"dmg":969.7,"def":1.04,"frag":0.9,"spot":0.95,"wRate":52.63},"11073":{"dmg":1580.26,"def":0.84,"frag":0.93,"spot":0.94,"wRate":50.26},"11089":{"dmg":622.07,"def":1.51,"frag":1.15,"spot":0.11,"wRate":55.52},"11265":{"dmg":832.77,"def":0.82,"frag":1.04,"spot":0.91,"wRate":55.06},"11281":{"dmg":539.26,"def":1.47,"frag":1.4,"spot":0.9,"wRate":57.54},"11297":{"dmg":1379.16,"def":0.93,"frag":0.97,"spot":0.5,"wRate":51.3},"11345":{"dmg":917.59,"def":1.4,"frag":0.86,"spot":0.07,"wRate":51.5},"11521":{"dmg":1520.74,"def":0.66,"frag":0.86,"spot":1.14,"wRate":50.72},"11537":{"dmg":1487.92,"def":0.91,"frag":1.08,"spot":0.77,"wRate":51.31},"11553":{"dmg":850.23,"def":1.14,"frag":1.09,"spot":1.39,"wRate":54.38},"11585":{"dmg":709.44,"def":0.95,"frag":0.89,"spot":0.63,"wRate":50.86},"11601":{"dmg":1532.96,"def":0.71,"frag":0.9,"spot":0.03,"wRate":50.73},"11777":{"dmg":614.49,"def":1.08,"frag":1.15,"spot":0.84,"wRate":54.41},"11793":{"dmg":898.29,"def":1.15,"frag":1.11,"spot":0.62,"wRate":51.39},"11809":{"dmg":941.13,"def":1.28,"frag":1.1,"spot":1.74,"wRate":52.97},"11841":{"dmg":1760.24,"def":1.07,"frag":1.04,"spot":0.07,"wRate":49.98},"11857":{"dmg":776.46,"def":1.8,"frag":1,"spot":0.17,"wRate":53.78},"12033":{"dmg":1521.63,"def":0.83,"frag":0.96,"spot":0.83,"wRate":49.95},"12049":{"dmg":2092.41,"def":0.5,"frag":1.04,"spot":0.64,"wRate":49.36},"12097":{"dmg":1270.6,"def":0.91,"frag":0.91,"spot":0.78,"wRate":49.89},"12113":{"dmg":1197.01,"def":0.76,"frag":0.86,"spot":0.03,"wRate":50.8},"12289":{"dmg":678.69,"def":0.98,"frag":1,"spot":1.92,"wRate":54.07},"12305":{"dmg":1857.67,"def":0.73,"frag":0.94,"spot":1.38,"wRate":48.52},"12369":{"dmg":1895.91,"def":0.77,"frag":0.89,"spot":0.03,"wRate":50.98},"12545":{"dmg":933.04,"def":0.81,"frag":0.96,"spot":1.66,"wRate":53.35},"12561":{"dmg":238.12,"def":1.09,"frag":1.07,"spot":2.86,"wRate":55.76},"12577":{"dmg":553.07,"def":1.07,"frag":1.13,"spot":1.88,"wRate":56.94},"12817":{"dmg":184.55,"def":1.12,"frag":1.14,"spot":1.97,"wRate":56.56},"12881":{"dmg":558.52,"def":1.01,"frag":1.13,"spot":1.47,"wRate":56.49},"13073":{"dmg":270.46,"def":1.26,"frag":1,"spot":1.67,"wRate":58.44},"13089":{"dmg":2095.69,"def":0.57,"frag":1.01,"spot":0.81,"wRate":48.96},"13121":{"dmg":325.09,"def":1.44,"frag":1.26,"spot":1.09,"wRate":58.74},"13137":{"dmg":1691.6,"def":0.89,"frag":1.02,"spot":0.6,"wRate":50.44},"13313":{"dmg":1234.31,"def":0.91,"frag":0.98,"spot":1.35,"wRate":52.46},"13329":{"dmg":413.44,"def":1.18,"frag":1.18,"spot":1.03,"wRate":56.54},"13345":{"dmg":1149.19,"def":0.98,"frag":0.87,"spot":1.02,"wRate":51.54},"13393":{"dmg":621.19,"def":1.47,"frag":1.12,"spot":0.54,"wRate":54.56},"13569":{"dmg":2159.69,"def":0.7,"frag":1.08,"spot":0.8,"wRate":48.71},"13585":{"dmg":379.1,"def":1.16,"frag":1.11,"spot":1.62,"wRate":57.29},"13825":{"dmg":1770.76,"def":0.75,"frag":0.97,"spot":1.5,"wRate":48.56},"13841":{"dmg":1134.78,"def":0.95,"frag":0.83,"spot":1.21,"wRate":50.4},"13857":{"dmg":2214.02,"def":0.56,"frag":1.07,"spot":0.75,"wRate":51.04},"13889":{"dmg":2217.84,"def":0.7,"frag":1.17,"spot":0.86,"wRate":49.16},"13905":{"dmg":2052.2,"def":0.53,"frag":1.04,"spot":0.48,"wRate":47.26},"14097":{"dmg":717.8,"def":1.06,"frag":0.98,"spot":1.6,"wRate":54.17},"14113":{"dmg":1771.8,"def":0.7,"frag":0.92,"spot":1.42,"wRate":48.15},"14145":{"dmg":481.96,"def":0.77,"frag":0.68,"spot":2.43,"wRate":53.84},"14161":{"dmg":932.64,"def":1.21,"frag":0.93,"spot":0.92,"wRate":51.21},"14337":{"dmg":2095.36,"def":0.74,"frag":1.07,"spot":0.95,"wRate":50.18},"14353":{"dmg":673.84,"def":0.62,"frag":0.61,"spot":1.97,"wRate":51.02},"14401":{"dmg":1474.08,"def":0.9,"frag":0.9,"spot":0.04,"wRate":50.05},"14417":{"dmg":826.84,"def":1.25,"frag":1.05,"spot":0.94,"wRate":52.86},"14609":{"dmg":1841.88,"def":0.9,"frag":0.98,"spot":1.46,"wRate":47.86},"14625":{"dmg":1209.15,"def":0.99,"frag":0.97,"spot":1.31,"wRate":51.97},"14657":{"dmg":397.33,"def":1.44,"frag":1,"spot":0.11,"wRate":54.01},"14673":{"dmg":1464.99,"def":1.12,"frag":1.08,"spot":0.83,"wRate":52.32},"14865":{"dmg":1446.73,"def":0.84,"frag":0.86,"spot":1.28,"wRate":49.44},"14881":{"dmg":2067.63,"def":0.66,"frag":1.09,"spot":0.87,"wRate":48.77},"14913":{"dmg":400.29,"def":1.09,"frag":0.98,"spot":0.93,"wRate":55.39},"15105":{"dmg":323.79,"def":1.55,"frag":1.34,"spot":1.39,"wRate":57.65},"15121":{"dmg":157.11,"def":0.89,"frag":1.09,"spot":0.18,"wRate":53.57},"15137":{"dmg":480.16,"def":0.58,"frag":0.55,"spot":2.12,"wRate":52.61},"15169":{"dmg":215.47,"def":2.05,"frag":1.29,"spot":0.86,"wRate":58},"15185":{"dmg":1913.65,"def":0.68,"frag":0.92,"spot":1.12,"wRate":48.71},"15361":{"dmg":249.15,"def":1.73,"frag":1.45,"spot":1.37,"wRate":60.05},"15377":{"dmg":1198.98,"def":0.61,"frag":0.82,"spot":0.04,"wRate":50.11},"15393":{"dmg":1661.32,"def":0.78,"frag":1.1,"spot":1.01,"wRate":51.35},"15425":{"dmg":1854.8,"def":0.9,"frag":0.98,"spot":1.36,"wRate":48.47},"15441":{"dmg":1184.95,"def":0.89,"frag":0.78,"spot":1.08,"wRate":51.53},"15617":{"dmg":1988.35,"def":0.97,"frag":1.17,"spot":1.52,"wRate":51.95},"15633":{"dmg":438.98,"def":1.54,"frag":1.11,"spot":0.1,"wRate":55.31},"15649":{"dmg":716.35,"def":0.63,"frag":0.66,"spot":2.29,"wRate":51.7},"15681":{"dmg":1565.11,"def":0.82,"frag":0.95,"spot":1.32,"wRate":50.11},"15873":{"dmg":366.27,"def":1.29,"frag":1.04,"spot":1.5,"wRate":57.37},"15889":{"dmg":721.04,"def":0.99,"frag":0.95,"spot":1.38,"wRate":51.94},"15905":{"dmg":1821.91,"def":0.81,"frag":0.95,"spot":1.3,"wRate":48.56},"15937":{"dmg":235.06,"def":1.98,"frag":1.39,"spot":1.21,"wRate":58.59},"16129":{"dmg":982.98,"def":0.78,"frag":0.86,"spot":0.05,"wRate":51.95},"16145":{"dmg":615.04,"def":1.03,"frag":1.11,"spot":0.71,"wRate":52.5},"16161":{"dmg":1588.82,"def":0.79,"frag":0.92,"spot":0.04,"wRate":51.26},"16385":{"dmg":543.52,"def":1.09,"frag":0.95,"spot":0.09,"wRate":52.88},"16401":{"dmg":1840.85,"def":0.89,"frag":1.08,"spot":0.6,"wRate":50.49},"16417":{"dmg":795.97,"def":1.14,"frag":0.97,"spot":0.07,"wRate":53},"16641":{"dmg":427.11,"def":0.63,"frag":0.54,"spot":2.61,"wRate":52.59},"16657":{"dmg":1617.19,"def":1.02,"frag":1.19,"spot":0.54,"wRate":51.6},"16673":{"dmg":630.77,"def":0.82,"frag":0.71,"spot":2.25,"wRate":54.05},"16897":{"dmg":1873.31,"def":0.84,"frag":1.04,"spot":1.54,"wRate":49.19},"16913":{"dmg":2275.67,"def":0.75,"frag":1.33,"spot":0.49,"wRate":49.09},"17153":{"dmg":1817.73,"def":0.79,"frag":1.05,"spot":1.52,"wRate":50.23},"17169":{"dmg":312.16,"def":1.01,"frag":1.36,"spot":1.31,"wRate":58.51},"17425":{"dmg":427.76,"def":0.93,"frag":1.1,"spot":1.35,"wRate":56.78},"17665":{"dmg":1534.38,"def":0.83,"frag":1.02,"spot":1.45,"wRate":53.12},"17937":{"dmg":465.28,"def":1.18,"frag":1.34,"spot":0.84,"wRate":56.76},"17953":{"dmg":848.42,"def":0.8,"frag":0.81,"spot":2.46,"wRate":52.9},"18177":{"dmg":999.92,"def":0.68,"frag":0.73,"spot":2.22,"wRate":52.37},"18193":{"dmg":544.32,"def":0.96,"frag":1.12,"spot":1.33,"wRate":55.45},"18209":{"dmg":911.07,"def":0.57,"frag":0.62,"spot":1.87,"wRate":50.86},"18433":{"dmg":813.2,"def":0.82,"frag":0.76,"spot":2.56,"wRate":53.95},"18449":{"dmg":926.37,"def":0.67,"frag":0.68,"spot":2.29,"wRate":51.13},"18465":{"dmg":255.35,"def":1.64,"frag":0.91,"spot":0.1,"wRate":55.71},"18689":{"dmg":692.22,"def":1.06,"frag":1.3,"spot":1.34,"wRate":57.66},"18721":{"dmg":383.63,"def":1.19,"frag":0.95,"spot":0.13,"wRate":54.48},"18961":{"dmg":902.72,"def":0.75,"frag":0.78,"spot":1.89,"wRate":52.39},"19217":{"dmg":2275.67,"def":0.75,"frag":1.33,"spot":0.49,"wRate":49.09},"50689":{"dmg":2095.69,"def":0.57,"frag":1.01,"spot":0.81,"wRate":48.96},"50945":{"dmg":249.15,"def":1.73,"frag":1.45,"spot":1.37,"wRate":60.05},"50961":{"dmg":926.37,"def":0.67,"frag":0.68,"spot":2.29,"wRate":51.13},"51201":{"dmg":693.27,"def":1.3,"frag":1.43,"spot":1.41,"wRate":59.7},"51457":{"dmg":582.79,"def":1.38,"frag":1.31,"spot":1.19,"wRate":57.51},"51473":{"dmg":473.49,"def":0.78,"frag":0.68,"spot":1.57,"wRate":49.86},"51489":{"dmg":191.01,"def":0.96,"frag":1.06,"spot":2.55,"wRate":55.4},"51553":{"dmg":545.15,"def":1.1,"frag":1,"spot":1.13,"wRate":53.37},"51569":{"dmg":774.4,"def":0.84,"frag":1,"spot":1.42,"wRate":51.89},"51713":{"dmg":611.11,"def":1.3,"frag":1.22,"spot":1.22,"wRate":54.83},"51729":{"dmg":383.7,"def":2.32,"frag":1.95,"spot":1.66,"wRate":66.14},"51745":{"dmg":549.03,"def":1.13,"frag":1.16,"spot":1.51,"wRate":57.4},"51809":{"dmg":306.28,"def":1.36,"frag":1.25,"spot":1.65,"wRate":57.97},"51985":{"dmg":381.63,"def":1.62,"frag":1.61,"spot":1.5,"wRate":60.42},"52001":{"dmg":277.13,"def":1.33,"frag":1.12,"spot":2.65,"wRate":57.29},"52065":{"dmg":1166.66,"def":0.98,"frag":0.89,"spot":1.15,"wRate":50.69},"52225":{"dmg":355.63,"def":1.4,"frag":1.57,"spot":2.16,"wRate":57.95},"52241":{"dmg":535.42,"def":1.78,"frag":1.76,"spot":1.73,"wRate":60.82},"52257":{"dmg":445.44,"def":1.02,"frag":0.99,"spot":1.5,"wRate":53.99},"52321":{"dmg":832.49,"def":0.87,"frag":1.03,"spot":1.06,"wRate":54.12},"52481":{"dmg":431.56,"def":1.73,"frag":1.46,"spot":1.63,"wRate":57.68},"52497":{"dmg":343.02,"def":2.78,"frag":2.05,"spot":1.75,"wRate":56.35},"52513":{"dmg":1133.63,"def":0.82,"frag":0.86,"spot":1.15,"wRate":47.99},"52561":{"dmg":1748.14,"def":0.89,"frag":1.03,"spot":0.6,"wRate":51.7},"52737":{"dmg":230.42,"def":1.28,"frag":0.98,"spot":1.72,"wRate":53.42},"52769":{"dmg":277.13,"def":1.33,"frag":1.12,"spot":2.65,"wRate":57.29},"52817":{"dmg":416.67,"def":1.25,"frag":1.15,"spot":1.74,"wRate":57.48},"52993":{"dmg":288.58,"def":0.66,"frag":0.88,"spot":2.68,"wRate":53.31},"53249":{"dmg":1265.86,"def":0.88,"frag":0.99,"spot":1.08,"wRate":52.52},"53505":{"dmg":369.01,"def":1.69,"frag":1.68,"spot":1.78,"wRate":57.83},"53537":{"dmg":182.92,"def":0.89,"frag":1.01,"spot":1.56,"wRate":55.84},"53585":{"dmg":575.8,"def":1.51,"frag":1.2,"spot":0.84,"wRate":55.87},"53761":{"dmg":640.29,"def":1.4,"frag":1.34,"spot":0.89,"wRate":53.96},"53793":{"dmg":1142.92,"def":0.97,"frag":0.9,"spot":1.33,"wRate":53.42},"53841":{"dmg":862.59,"def":1.24,"frag":1.09,"spot":0.6,"wRate":52.83},"54017":{"dmg":693.27,"def":1.3,"frag":1.43,"spot":1.41,"wRate":59.7},"54033":{"dmg":473.49,"def":0.78,"frag":0.68,"spot":1.57,"wRate":49.86},"54097":{"dmg":1040.76,"def":1.21,"frag":1.04,"spot":0.77,"wRate":53.58},"54273":{"dmg":456.96,"def":1.62,"frag":2.15,"spot":1.01,"wRate":60.42},"54289":{"dmg":1241.5,"def":0.83,"frag":0.81,"spot":0.85,"wRate":50.08},"54353":{"dmg":635.75,"def":1.25,"frag":1.34,"spot":1.64,"wRate":56.69},"54529":{"dmg":267.5,"def":1.42,"frag":1.52,"spot":1.49,"wRate":58},"54545":{"dmg":569.96,"def":1.17,"frag":1.11,"spot":1.64,"wRate":55.53},"54609":{"dmg":288.88,"def":1.48,"frag":1.1,"spot":0.13,"wRate":55.36},"54785":{"dmg":882.34,"def":0.8,"frag":1.17,"spot":0.62,"wRate":54.83},"54801":{"dmg":263.73,"def":1.39,"frag":1.12,"spot":2.89,"wRate":59.12},"54865":{"dmg":187.09,"def":1.09,"frag":1.23,"spot":1.55,"wRate":55.94},"55057":{"dmg":588.01,"def":1.42,"frag":1.2,"spot":1.31,"wRate":53.54},"55073":{"dmg":173.77,"def":0.96,"frag":1.13,"spot":1.61,"wRate":56.76},"55121":{"dmg":1063.31,"def":1.06,"frag":1,"spot":1.17,"wRate":55.15},"55297":{"dmg":1143.08,"def":0.9,"frag":1.21,"spot":0.83,"wRate":54.51},"55313":{"dmg":1262.93,"def":1.06,"frag":0.92,"spot":0.76,"wRate":50.15},"55569":{"dmg":1045.28,"def":1.6,"frag":1.28,"spot":1.52,"wRate":51.3},"55633":{"dmg":1248.25,"def":0.96,"frag":0.88,"spot":1.05,"wRate":51.92},"55841":{"dmg":1816.67,"def":0.75,"frag":0.94,"spot":1.09,"wRate":48.85},"55889":{"dmg":859.33,"def":1.09,"frag":1.24,"spot":2.31,"wRate":57.46},"56097":{"dmg":717.98,"def":1.01,"frag":0.98,"spot":1.37,"wRate":54.45},"56145":{"dmg":806.94,"def":1.08,"frag":1.03,"spot":1.07,"wRate":53.13},"56353":{"dmg":1090.9,"def":1.27,"frag":1,"spot":0.78,"wRate":51.43},"56577":{"dmg":281.18,"def":1.42,"frag":1.25,"spot":1.36,"wRate":56.35},"56609":{"dmg":1117.47,"def":0.88,"frag":1.03,"spot":0.83,"wRate":54.49},"56833":{"dmg":1253.57,"def":0.83,"frag":1.2,"spot":1.19,"wRate":56.95},"56865":{"dmg":1771.8,"def":0.7,"frag":0.92,"spot":1.42,"wRate":48.15},"57089":{"dmg":788.67,"def":0.91,"frag":0.85,"spot":1.47,"wRate":53.86},"57105":{"dmg":854.09,"def":1.03,"frag":1.09,"spot":0.75,"wRate":52.29},"57121":{"dmg":1242.69,"def":0.93,"frag":0.91,"spot":1.31,"wRate":53.57},"57361":{"dmg":714.75,"def":1.15,"frag":0.92,"spot":1.06,"wRate":51.98},"57377":{"dmg":1220.02,"def":1.04,"frag":0.92,"spot":1.52,"wRate":50.97},"57617":{"dmg":863.49,"def":1.12,"frag":0.91,"spot":1.28,"wRate":52.21},"57633":{"dmg":716.35,"def":0.63,"frag":0.66,"spot":2.29,"wRate":51.7},"58113":{"dmg":723.55,"def":0.93,"frag":1,"spot":1.28,"wRate":56.04},"58369":{"dmg":2084.91,"def":0.74,"frag":1.02,"spot":1.42,"wRate":51.61},"58625":{"dmg":997.34,"def":0.78,"frag":0.78,"spot":0.71,"wRate":50.77},"58641":{"dmg":1972.39,"def":0.53,"frag":0.94,"spot":1.1,"wRate":50.48},"58881":{"dmg":1410.89,"def":0.75,"frag":1.01,"spot":1.11,"wRate":56.44},"59137":{"dmg":1253.57,"def":0.83,"frag":1.2,"spot":1.19,"wRate":56.95},"59393":{"dmg":872.73,"def":1.01,"frag":1.15,"spot":1.59,"wRate":56.8},"59649":{"dmg":1166.52,"def":0.89,"frag":1.22,"spot":0.66,"wRate":54.79},"59665":{"dmg":309.61,"def":1.09,"frag":1.29,"spot":1.47,"wRate":58.28},"59905":{"dmg":1176.25,"def":0.84,"frag":0.91,"spot":1.21,"wRate":52.72},"60161":{"dmg":832.49,"def":0.87,"frag":1.03,"spot":1.06,"wRate":54.12},"60177":{"dmg":1167.77,"def":0.94,"frag":0.87,"spot":1.13,"wRate":50.47},"60417":{"dmg":1390.42,"def":0.68,"frag":0.97,"spot":0.98,"wRate":54.5},"60433":{"dmg":201.57,"def":1.3,"frag":1.11,"spot":1.88,"wRate":57.79},"60673":{"dmg":1988.35,"def":0.97,"frag":1.17,"spot":1.52,"wRate":51.95},"60689":{"dmg":555.26,"def":1.46,"frag":1.15,"spot":0.69,"wRate":52.78},"60929":{"dmg":237.26,"def":0.78,"frag":0.95,"spot":1.88,"wRate":54.45},"60945":{"dmg":1617.78,"def":0.92,"frag":1.08,"spot":1.37,"wRate":52.23},"61185":{"dmg":1888.88,"def":0.69,"frag":0.91,"spot":1.27,"wRate":48.75},"61441":{"dmg":563.84,"def":1.16,"frag":1.43,"spot":1.2,"wRate":58.65},"61457":{"dmg":413.68,"def":0.87,"frag":0.84,"spot":1.53,"wRate":53},"61697":{"dmg":2294.69,"def":0.91,"frag":1.29,"spot":1.66,"wRate":58.27},"61713":{"dmg":1045.28,"def":1.6,"frag":1.28,"spot":1.52,"wRate":51.3},"61953":{"dmg":1011.77,"def":0.81,"frag":0.81,"spot":1.55,"wRate":52.6},"61969":{"dmg":1166.73,"def":1.28,"frag":0.94,"spot":0.94,"wRate":49.41},"62209":{"dmg":1225.21,"def":0.94,"frag":0.95,"spot":0.87,"wRate":50.94},"62225":{"dmg":1080.19,"def":1.01,"frag":0.93,"spot":0.95,"wRate":53.51},"62481":{"dmg":1617.19,"def":1.02,"frag":1.19,"spot":0.54,"wRate":51.6},"62529":{"dmg":1421.89,"def":0.79,"frag":0.96,"spot":1.3,"wRate":49.46},"62721":{"dmg":1410.89,"def":0.75,"frag":1.01,"spot":1.11,"wRate":56.44},"62737":{"dmg":1265.86,"def":0.88,"frag":0.99,"spot":1.08,"wRate":52.52},"62785":{"dmg":1184.95,"def":0.89,"frag":0.78,"spot":1.08,"wRate":51.53},"62977":{"dmg":1011.77,"def":0.81,"frag":0.81,"spot":1.55,"wRate":52.6},"62993":{"dmg":1080.19,"def":1.01,"frag":0.93,"spot":0.95,"wRate":53.51},"63041":{"dmg":1302.41,"def":0.85,"frag":0.93,"spot":0.85,"wRate":50.47},"63233":{"dmg":1179.34,"def":0.73,"frag":0.81,"spot":0.81,"wRate":52.5},"63249":{"dmg":484.73,"def":0.99,"frag":0.92,"spot":1.21,"wRate":53.75},"63297":{"dmg":693.2,"def":0.76,"frag":0.67,"spot":1.97,"wRate":50.71},"63505":{"dmg":231.11,"def":1.23,"frag":0.82,"spot":1.08,"wRate":59.82},"63537":{"dmg":1762.87,"def":0.66,"frag":0.93,"spot":1.33,"wRate":48.14},"63553":{"dmg":1220.02,"def":1.04,"frag":0.92,"spot":1.52,"wRate":50.97},"63761":{"dmg":1220.02,"def":1.04,"frag":0.92,"spot":1.52,"wRate":50.97},"63793":{"dmg":1105.73,"def":0.89,"frag":0.86,"spot":1.27,"wRate":50.76},"63809":{"dmg":693.2,"def":0.76,"frag":0.67,"spot":1.97,"wRate":50.71},"64017":{"dmg":926.37,"def":0.67,"frag":0.68,"spot":2.29,"wRate":51.13},"64049":{"dmg":1159.15,"def":0.77,"frag":0.93,"spot":1.45,"wRate":50.16},"64065":{"dmg":1254.74,"def":1.05,"frag":0.95,"spot":1.46,"wRate":50.46},"64273":{"dmg":1262.45,"def":1,"frag":0.93,"spot":1.38,"wRate":52.8},"64561":{"dmg":1219.52,"def":0.7,"frag":0.89,"spot":1.31,"wRate":51.45},"64817":{"dmg":584.05,"def":0.76,"frag":0.67,"spot":2.39,"wRate":52.2}}',
        'bs' : '{"cv":8770.36,"cm":6378.85,"c1":4182.23,"c2":2811.21,"c3":2024.96,"d3":1289.15,"d2":797.98,"d1":253.94,"dm":0.03}',
        'pr' : '{"1":550,"33":550,"49":1350,"81":100,"113":120,"257":550,"273":750,"289":350,"305":700,"321":350,"337":135,"353":200,"369":200,"513":1000,"529":1000,"545":120,"577":120,"593":175,"609":120,"625":350,"769":350,"785":200,"801":750,"817":1400,"833":200,"849":300,"865":200,"881":450,"1025":200,"1041":550,"1057":550,"1073":1050,"1089":450,"1105":750,"1121":1000,"1137":550,"1297":1000,"1313":750,"1329":125,"1345":200,"1361":200,"1377":550,"1393":750,"1537":450,"1553":750,"1569":1000,"1585":1350,"1601":200,"1617":450,"1633":450,"1649":1000,"1793":1000,"1809":450,"1825":200,"1841":1900,"1889":750,"1905":1400,"2049":450,"2065":200,"2081":170,"2097":2000,"2113":550,"2129":350,"2145":350,"2161":2000,"2305":1000,"2321":750,"2353":200,"2369":350,"2385":150,"2401":350,"2417":2300,"2561":750,"2577":550,"2593":2000,"2625":750,"2657":1400,"2817":800,"2833":350,"2849":1400,"2865":1600,"2881":450,"2897":525,"2913":450,"3073":350,"3089":120,"3105":450,"3121":250,"3137":1400,"3153":1300,"3169":200,"3329":120,"3345":350,"3361":550,"3377":725,"3393":350,"3409":250,"3425":2000,"3585":750,"3601":200,"3617":350,"3633":1300,"3649":2300,"3665":750,"3681":2300,"3841":200,"3857":1000,"3873":1000,"3889":900,"3905":2000,"3921":1500,"3937":2800,"4097":1400,"4113":1000,"4129":550,"4145":2200,"4161":550,"4193":2050,"4353":1400,"4369":450,"4385":1400,"4401":250,"4417":550,"4433":2000,"4449":430,"4609":200,"4625":450,"4641":450,"4657":500,"4673":750,"4689":800,"4705":250,"4865":450,"4881":350,"4897":350,"4913":350,"4929":1400,"4945":260,"4961":1700,"5121":200,"5137":1400,"5153":450,"5169":750,"5185":1000,"5201":145,"5217":1550,"5377":1400,"5393":550,"5409":550,"5425":2200,"5457":1000,"5473":970,"5633":750,"5649":550,"5665":200,"5697":2000,"5713":1900,"5729":700,"5889":1000,"5905":350,"5921":1400,"5953":350,"5969":1400,"5985":175,"6145":2300,"6161":450,"6177":200,"6209":2450,"6225":2300,"6401":350,"6417":550,"6433":400,"6465":750,"6481":220,"6657":1000,"6673":350,"6721":550,"6913":450,"6929":2300,"6945":550,"6977":1000,"6993":175,"7169":2300,"7185":750,"7201":750,"7233":1000,"7249":2300,"7425":1400,"7441":1000,"7457":1400,"7489":1400,"7505":165,"7681":350,"7697":1400,"7713":450,"7745":200,"7761":200,"7937":2000,"7953":2000,"7969":1000,"8017":300,"8193":2400,"8209":450,"8225":1400,"8257":350,"8273":180,"8449":2000,"8465":1400,"8481":2300,"8529":1850,"8705":2300,"8721":2000,"8737":2000,"8785":600,"8961":1000,"8977":1000,"8993":2000,"9041":350,"9217":1400,"9233":2300,"9249":1000,"9297":2500,"9473":450,"9489":2300,"9505":2000,"9553":950,"9745":2000,"9761":550,"9793":450,"9809":825,"9985":1400,"10001":750,"10017":750,"10049":550,"10065":1500,"10241":1000,"10257":2000,"10273":450,"10497":750,"10513":1400,"10529":550,"10577":200,"10753":2000,"10769":1000,"10785":2300,"10817":1000,"10833":400,"11009":1400,"11025":1000,"11041":1000,"11073":2000,"11089":750,"11265":750,"11281":450,"11297":1400,"11345":1500,"11521":2000,"11537":1400,"11553":750,"11585":750,"11601":1900,"11777":550,"11793":750,"11809":1000,"11841":2300,"11857":1200,"12033":2000,"12049":2300,"12097":1400,"12113":1750,"12289":750,"12305":2300,"12369":2200,"12545":1000,"12561":350,"12577":550,"12817":200,"12881":550,"13073":350,"13089":2300,"13121":350,"13137":2200,"13313":1400,"13329":450,"13345":1400,"13393":550,"13569":2300,"13585":450,"13825":2300,"13841":1400,"13857":2300,"13889":2300,"13905":2650,"14097":750,"14113":2300,"14145":550,"14161":1300,"14337":2300,"14353":1000,"14401":2000,"14417":850,"14609":2300,"14625":1400,"14657":450,"14673":1800,"14865":2000,"14881":2300,"14913":450,"15105":350,"15121":200,"15137":750,"15169":200,"15361":200,"15377":1400,"15393":2000,"15425":2200,"15441":1300,"15617":2300,"15633":450,"15649":1000,"15681":2000,"15873":450,"15889":750,"15905":2300,"15937":200,"16129":1000,"16145":550,"16161":2000,"16385":550,"16401":2000,"16417":750,"16641":750,"16657":1400,"16673":750,"16897":2300,"16913":2300,"17153":2300,"17169":350,"17425":450,"17665":2000,"17937":400,"17953":1000,"18177":900,"18193":550,"18209":1400,"18433":725,"18449":900,"18465":400,"18689":550,"18721":500,"18961":700,"19217":2300,"50193":1400,"50945":200,"50961":1000,"51201":550,"51457":550,"51473":550,"51489":200,"51553":550,"51569":700,"51713":550,"51729":350,"51745":550,"51985":350,"52065":1400,"52225":350,"52241":450,"52257":550,"52321":800,"52481":450,"52497":200,"52513":1400,"52561":2250,"52737":350,"52769":350,"52817":450,"52993":450,"53249":1400,"53505":350,"53537":200,"53585":575,"53761":550,"53793":1400,"53841":875,"54017":550,"54033":550,"54097":1200,"54273":350,"54289":1400,"54353":550,"54529":200,"54545":550,"54609":500,"54785":750,"54801":350,"54865":150,"55057":550,"55073":200,"55121":1300,"55297":1000,"55313":1400,"55569":1000,"55633":1300,"55841":2300,"55889":750,"56097":625,"56145":750,"56353":1300,"56577":350,"56609":1500,"56833":1000,"56865":2300,"57105":750,"57361":750,"57617":1000,"57633":1000,"58113":775,"58369":2500,"58625":1550,"58641":2300,"58881":1400,"59137":1300,"59393":775,"59649":1350,"59665":220,"59905":1350,"60161":750,"60177":1350,"60417":1400,"60433":175,"60689":700,"60929":150,"60945":1900,"61185":2300,"61441":450,"61457":550,"61697":2300,"61713":1000,"61953":1400,"61969":1800,"62209":1400,"62481":1400,"62737":1400,"62785":1400,"62977":1250,"63041":1400,"63249":550,"63297":725,"63505":230,"63553":1350,"63761":1400,"63793":1350,"63809":700,"64049":1300,"64065":1400,"64273":1300,"64561":1400,"64817":450}'
      },
      showError: function (erText) {
          $('.wes-overlay').show();
          $('#wes-error-text').html(erText);
          $('#wes-error').show();
      },
      getServ: function () {
          if (document.location.host.endsWith(".ru"))
              return 'ru';
          else if (document.location.host.endsWith(".eu"))
              return 'eu';
          else if (document.location.host.endsWith(".com"))
              return "com";
          else
              return '';
      },
      getApiKey: function () {
          return this.apiKey[this.getServ()];
      },
      lzw_encode: function (s) {
          var dict = {}, data = (s + "").split(""), out = [], currChar, phrase = data[0], code = 256, i;
          for (i = 1; i < data.length; i++) {
              currChar = data[i];
              if (dict[phrase + currChar] != null) {
                  phrase += currChar;
              }
              else {
                  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                  dict[phrase + currChar] = code;
                  code++;
                  phrase = currChar;
              }
          }
          out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
          for (i = 0; i < out.length; i++) {
              out[i] = String.fromCharCode(out[i]);
          }
          return out.join("");
      },
      lzw_decode: function (s) {
          var dict = {}, data = (s + "").split(""), currChar = data[0], oldPhrase = currChar, out = [currChar],
              code = 256, phrase, i;
          for (i = 1; i < data.length; i++) {
              var currCode = data[i].charCodeAt(0);
              if (currCode < 256) {
                  phrase = data[i];
              }
              else {
                  phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
              }
              out.push(phrase);
              currChar = phrase.charAt(0);
              dict[code] = oldPhrase + currChar;
              code++;
              oldPhrase = phrase;
          }
          return out.join("");
      },
      newLSData: {
          'wes-wn8': {
              'get': function () {
                  $.get("http://www.wnefficiency.net/exp/expected_tank_values_latest.json", this.set, "json");
              },
              'set': function (resp) {
                  var wn8Data = {}, i;
                  for (i = 0; i < resp['data'].length; i++) {
                      if (!wn8Data[resp['data'][i].IDNum]) {
                          wn8Data[resp['data'][i].IDNum] = {
                              'dmg': resp['data'][i].expDamage,
                              'def': resp['data'][i].expDef,
                              'frag': resp['data'][i].expFrag,
                              'spot': resp['data'][i].expSpot,
                              'wRate': resp['data'][i].expWinRate
                          };
                      }
                  }
                  wesGeneral.setLSData('wes-wn8', wn8Data, (new Date().getTime() + 86400000));
              }
          },
          'wes-bs': {
              'get': function () {
                  $.get("http://armor.kiev.ua/wot/api.php", this.set, "json");
              },
              'set': function (resp) {
                  wesGeneral.setLSData('wes-bs', resp['classRatings'], (new Date().getTime() + 86400000));
              }
          },
          'wes-tanks': {
              'get': function () {
                  $.get("http://api." + document.location.host + "/wot/encyclopedia/vehicles/",
                      {
                          'application_id': wesApiKey,
                          'fields': 'tier, is_premium, tag'
                      }, this.set, "json");
              },
              'set': function (resp) {
                  var tanksArr = [], allTanks = {}, key, i, oKeys;
                  if (resp.status == "ok") {
                      oKeys = Object.keys(resp.data);
                      for (i = 0; i < oKeys.length; i++) {
                          key = oKeys[i];
                          allTanks[key] = {'l': resp.data[key]["tier"]};
                          if (resp.data[key]["is_premium"]) allTanks[key]['p'] = 1;
                          allTanks[key]['tag'] = resp.data[key]['tag'];
                          tanksArr.push(key)
                      }
                  }
                  wesGeneral.setLSData('wes-tanks', allTanks, (new Date().getTime() + 86400000));
              }
          },
          'wes-pr': {
              'get': function () {
                  $.get("http://www.noobmeter.com/tankListJson/elfx_133054", this.set, "json");
              },
              'set': function (resp) {
                  var tanksArr = wesGeneral.getLSData('wes-tanks'), i, prData = {}, tName;
                  for (i = 0; i < resp.length; i++) {
                      tName = resp[i]['id'];
                      for (var tank in tanksArr) {							  
                        if (typeof(tanksArr[tank]) !== 'undefined' && tName === tanksArr[tank]['tag']) {
                          prData[tank] = resp[i]['nominalDamage'];
                        }
                      }
                  }
                  wesGeneral.setLSData('wes-pr', prData, (new Date().getTime() + 86400000));
              }
          }
      },
      getLSData: function (name, onRemoveFunction) {
        var stVal = localStorage.getItem(name);
        onRemoveFunction = onRemoveFunction || false;
        if (stVal) {
          if (name !== 'wesSettings') {
            stVal = decodeURIComponent(escape(this.lzw_decode(stVal)));
          }
          stVal = JSON.parse(stVal);
          if (parseInt(stVal['expireDate']) >= new Date().getTime()) {
            return stVal['data'];
          } else {
            if (onRemoveFunction) {
              onRemoveFunction();
            }
            else if (this.newLSData[name]){
              this.newLSData[name].get();
            }
            return stVal['data'];
          }
        } else {
          if (this.newLSData[name]) {
            this.newLSData[name].get();
          }
          return null;
        }
      },
      setLSData: function (name, value, expire) {
          expire = expire || new Date(2100, 0, 1).getTime();          
          var stVal = JSON.stringify({
              'expireDate': expire,
              'data': value
          });
          if (name !== 'wesSettings') {
            stVal = this.lzw_encode(unescape(encodeURIComponent(stVal)));
          }
          try {
            localStorage.setItem(name, stVal);
          } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
              this.showError(_('localStorageIsFull'));
            }
          }
      },
      deleteLSData: function (name) {
          localStorage.removeItem(name);
      },
      setStyles: function () {
          var styleEl = document.createElement("style");
          styleEl.innerHTML = this.styles['default'];
          document.head.appendChild(styleEl);
      },
      setScripts: function () {
          var cnScr = document.createElement("script");
          cnScr.innerHTML = '(function() {   if (window.pluso)if (typeof window.pluso.start == "function") return; ' +
              'if (window.ifpluso==undefined) { window.ifpluso = 1; ' +
              'var d = document, s = d.createElement("script"), g = "getElementsByTagName"; ' +
              's.type = "text/javascript"; s.charset="UTF-8"; s.async = true; s.src = ("https:" == ' +
              'window.location.protocol ? "https" : "http")  + "://share.pluso.ru/pluso-like.js"; ' +
              'var h=d[g]("body")[0]; h.appendChild(s);}})();';
          document.head.appendChild(cnScr);
      },
      createProgressBar: function (pId, color) {
          var pDiv1 = document.createElement("div"),
              pDiv2 = document.createElement("div");
          color = color || 'green';
          pDiv2.style.backgroundColor = color;
          pDiv1.setAttribute("id", "wes-" + pId);
          pDiv1.setAttribute("class", "wes-progressbar");
          pDiv1.appendChild(pDiv2);
          return pDiv1;
      },
      updateProgressBar: function (pId, curCount, allCount) {
          $('#wes-' + pId + ' > div').width(String(Math.round(curCount / allCount * 100)) + '%');
      },
      calculateCurrentLocalStorageSize: function () {
          var size = 0, i;
          for (i = 0; i < localStorage.length; i++)
              size += (localStorage[localStorage.key(i)].length * 2) / 1024;
          return Math.round(size);
      },
      createSettingsWindow: function () {
          var settingsDiv = document.createElement("div"),
              overlayDiv = document.createElement("div"), sHtml, key;
          settingsDiv.setAttribute("id", "wes-settings");
          settingsDiv.setAttribute("class", "wes-settings");
          overlayDiv.setAttribute("class", "wes-overlay");
          sHtml = '<div class="wes-title">' +
              '<span class="wes-title-span">' + _('settingsText') + '</span>' +
              '<a href="#" class="wes-close-titlebar" id="wes-close-settings"><span>close</span></a>' +
              '<div class="wes-error-text"><div class="wes-tabs">' +
              '<span class="wes-active-tab" tabId="1">' + _('general') + '</span>' +
              '<span tabId="2">' + _('blocks') + '</span>' +
              '<span tabId="3">' + _('players') + '</span>' +
              '<span tabId="4">' + _('about') + '</span></div>' +

              '<div id="wes-tab-content-1" class="wes-tab-content"><div>' +
              '<p id="wes-ls-size-text">' + _('lsSize') + ' 0%</p>' +
              '<div class="wes-progressbar" id="wes-ls-size"><div style="background-color: orange;"></div></div>' +
              '<div class="wes-setting-half">' + _('saveCount') +
              ': <input style="width: 40px;" type="number" id="wes-settings-save-count" value="7" min="1" max="100" step="1"></div>' +
              '<div class="wes-setting-half">' + _('graphs') + ': <select id="wes-settings-graphs">' +
              '<option value="0">' + _('dntshow') + '</option>' +
              '<option value="1">' + _('battles') + '</option>' +
              '<option value="2">' + _('date') + '</option></select></div>' +
              '<div class="wes-setting-half">' + _('language') + ': <select id="wes-settings-lang">' +
              '<option value="ru">Русский</option>' +
              '<option value="en">English</option></select></div>' +
              '</div></div>' +
              '<div id="wes-tab-content-2" class="wes-tab-content" style="display: none;"><div><table>';

          for (key in wesSettings.blocks) {
              sHtml += '<tr><td style="width: 70%;">' + _('block' + key.capitalize()) + ':</td><td><select style="margin-top: 2px;" id="wes-settings-block-' + key + '">' +
                  '<option value="0">' + _('showBlock') + '</option>' +
                  '<option value="1">' + _('hideBlock') + '</option>' +
                  '<option value="2">' + _('deleteBlock') + '</option>' +
                  '</select></td></tr>'
          }

          sHtml += '</table></div></div>' +
              '<div id="wes-tab-content-3" class="wes-tab-content" style="display: none;"><div></div></div>' +

              '<div id="wes-tab-content-4" class="wes-tab-content" style="display: none;"><div><div style="clear:both"></div>' +
              '<div data-description="' + _("scriptName") + '" data-title="' + _("scriptName") + '" ' +
              'data-url="http://forum.worldoftanks.ru/index.php?/topic/717208-" class="pluso" data-background="none;" ' +
              'data-options="medium,square,line,horizontal,counter,sepcounter=1,theme=14" ' +
              'data-services="vkontakte,odnoklassniki,facebook,twitter,google,livejournal,moimir"></div>' +
              '<p>' + _('scriptVersion') + '<br></p>' +
              '<p>' + _('donate') + ': </p><p>' +
              '<span style="color: green;">WebMoney:</span><br>'
              + '         WMR: R135164502303<br>'
              + '         WMZ: Z127526962810<br>'
              + '         WME: E419926987074<br><br>'
              + '<span style="color: green;">Yandex:</span><br>'
              + '         41001870448136<br></p>' +
              '</div></div>' +

              '<fieldset><div>' +
              '<span class="wes-colored-button" style="margin-left: 320px;"><span class="wes-button-right">' +
              '<input type="button" value="' + _('save') + '" id="wes-settings-save"></span></span>' +
              '</div></fieldset></div>' +
              '</div>';
          settingsDiv.innerHTML = sHtml;
          document.body.appendChild(settingsDiv);
          document.body.appendChild(overlayDiv);
      },
      createErrorWindow: function () {
          var errorDiv = document.createElement("div");
          errorDiv.setAttribute("id", "wes-error");
          errorDiv.setAttribute("class", "wes-error");
          errorDiv.innerHTML = '<div class="wes-title">' +
              '<span class="wes-title-span">' + _('error') + '</span>' +
              '<a href="#" class="wes-close-titlebar" id="wes-close-error"><span>close</span></a>' +
              '<div class="wes-error-text"><div style="height:20px;"></div>' +
              '<span class="wes-error-icon">' + _('errorText') + '</span>' +
              '<div id="wes-error-text"></div><fieldset><div>' +
              '<span class="wes-colored-button" style="margin-left: 222px;"><span class="wes-button-right">' +
              '<input type="button" value="OK" id="wes-error-close"></span></span>' +
              '</div></fieldset></div>' +
              '</div>';
          document.body.appendChild(errorDiv);
      },
      createWaitWindow: function () {
          var waitDiv = document.createElement("div");
          waitDiv.setAttribute("id", "wes-wait");
          waitDiv.setAttribute("class", 'wes-wait');
          waitDiv.innerHTML = '<img src="/static/3.26.0.2/common/css/scss/content/spinners/img/death-wheel.gif"><br><span></span>';
          document.body.appendChild(waitDiv);
      },
      showWait: function (wText) {
          $('.wes-overlay').show();
          $('#wes-wait > span').html(wText);
          $('#wes-wait').show();
      },
      hideWait: function () {
          $('.wes-overlay').hide();
          $('#wes-wait').hide();
      },
      getCookie: function (check_name) {
          var a_all_cookies = document.cookie.split(';'), a_temp_cookie = '', cookie_name = '', cookie_value = '';
          for (var i = 0; i < a_all_cookies.length; i++) {
              a_temp_cookie = a_all_cookies[i].split('=');
              cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
              if (cookie_name == check_name) {
                  if (a_temp_cookie.length > 1) {
                      cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                  }
                  return cookie_value;
              }
          }
          return null;
      },
      toFl: function (s) {
          var a = ("" + s).split("(")[0];
          a = a.indexOf(">") > 0 ? a.substr(0, a.indexOf(">")) : a;
          return (parseFloat(a.replace(/[\D\.]/g, "")));
      },
      getUserLastStat: function (uId) {
          var stat = this.getLSData('wes_' + uId);
          if (stat) return stat[stat.length - 1]; else return null;
      },
      formattedDate: function (ndate, isoFormat) {
          isoFormat = isoFormat || false;
          var day, month, year, hour, minutes, seconds;
          day = String(ndate.getDate());
          if (day.length == 1) day = '0' + day;
          month = String(ndate.getMonth() + 1);
          if (month.length == 1) month = '0' + month;
          year = String(ndate.getFullYear());
          hour = String(ndate.getHours());
          if (hour.length == 1) hour = '0' + hour;
          minutes = String(ndate.getMinutes());
          if (minutes.length == 1) minutes = '0' + minutes;
          seconds = String(ndate.getSeconds());
          if (seconds.length == 1) seconds = '0' + seconds;
          if (isoFormat)
              return year + '-' + month + '-' + day + 'T' + hour + ':' + minutes + ':' + seconds;
          else
              return day + '.' + month + '.' + year + ' ' + hour + ':' + minutes + ':' + seconds;

      },
      migrateToNewVersion: {
          'v1': function () {
              var steps = {
                  step1: function () {
                    var locFuncs = {
                      'setAllTanksInfo': function (resp) {
                          var tanksArr = [], allTanks = {}, key, i, oKeys;
                          if (resp.status == "ok") {
                              oKeys = Object.keys(resp.data);
                              for (i = 0; i < oKeys.length; i++) {
                                  key = oKeys[i];
                                  allTanks[key] = {'l': resp.data[key]["tier"]};
                                  if (resp.data[key]["is_premium"]) allTanks[key]['p'] = 1;
                                  allTanks[key]['tag'] = resp.data[key]["tag"];
                                  tanksArr.push(key)
                              }
                          }
                          
                          wesGeneral.setLSData('wes-tanks', allTanks, (new Date().getTime() + 86400000));
                      }
                    };
                    wesGeneral.setLSData('wes-wn8', JSON.parse(wesGeneral.defaultValues['wn8']), (new Date().getTime() + 86400000));
                    wesGeneral.setLSData('wes-bs', JSON.parse(wesGeneral.defaultValues['bs']), (new Date().getTime() + 86400000));
                    $.when($.get("http://api." + document.location.host + "/wot/encyclopedia/vehicles/",
                                 {
                                    'fields': "is_premium, tier, name, tank_id, tag, nation",
                                    'language': 'ru',
                                    'application_id': wesApiKey
                                 }
                          , locFuncs.setAllTanksInfo, "json")
                          ).done (function() {
                                    wesGeneral.setLSData('wes-pr', JSON.parse(wesGeneral.defaultValues['pr']), (new Date().getTime() + 86400000));
                                    steps.step2();
                                    wesGeneral.hideWait();
                                    $('#wes-wait').trigger('wesGeneralReady');
                                  });
                  },
                  step2: function () {
                      var oldSettings = wesGeneral.getCookie('usSettings'), bsVals, i, key, pId, j,
                          tanksArr = wesGeneral.getLSData('wes-tankId');
                      if (oldSettings) {
                          var setArr = oldSettings.split("|"),
                              blSetArr = setArr[0].split("/"), bKey;
                          for (i = 0; i < blSetArr.length; i++) {
                              bsVals = blSetArr[i].split(';');
                              if (wesGeneral.toFl(bsVals[2]) === 1)
                                  bKey = 2;
                              else if (wesGeneral.toFl(bsVals[1]) === 1)
                                  bKey = 1;
                              else
                                  bKey = 0;
                              if (bsVals[0] in wesSettings.blocks) wesSettings.blocks[bsVals[0]] = bKey;
                          }
                          bsVals = setArr[1].split(';');
                          if (wesGeneral.toFl(bsVals[0]) === 1)
                              wesSettings.myID = parseInt(bsVals[1].match(/\/(\d+)/)[1]);
                          if (setArr.length > 2) {
                              if (setArr[2] === 'no') wesSettings.graphs = 0;
                              else if (setArr[2] === 'date') wesSettings.graphs = 2;
                          }
                          if (setArr.length > 3) {
                              var us_strs = setArr[3].split("/");
                              for (i = 0; i < us_strs.length; i++) {
                                  var us_vals = us_strs[i].split(";");
                                  if (us_vals.length > 1) {
                                      wesSettings.players[us_vals[0]] = us_vals[1];
                                  }
                              }
                          }
                      }
                      for (i = 0; i < localStorage.length; i++) {
                          key = localStorage.key(i);
                          if (key.startsWith('daystat')) {
                              pId = parseInt(key.split('_')[1]);
                              if (!wesSettings.players[pId])
                                  wesSettings.players[pId] = _("player") + ' ' + String(pId);
                          }
                      }
                      //localStorage.removeItem("flot");
                      //localStorage.removeItem("flot_time");
                      //localStorage.removeItem("AllTanksArr");
                      //localStorage.removeItem("UsBsRangs");
                      //localStorage.removeItem("UsStatData");
                      //localStorage.removeItem("UsUnOfStat");
                      //localStorage.removeItem("WN8Data");
                      //localStorage.removeItem("compareStat");
                      //localStorage.removeItem("nominalDamage");
                      wesSettings.version = 1;
                      wesSettings.ncount = 2;
                      var uIds = Object.keys(wesSettings.players), statArr, stat, lsData;
                      for (i = 0; i < uIds.length; i++) {
                          statArr = [];
                          for (j = 0; j < 7; j++) {
                              lsData = localStorage.getItem('daystat_' + uIds[i] + '_' + j);
                              if (lsData) {
                                  stat = {};
                                  var dsArr = lsData.split("||")[1].split("|"),
                                      strArray = dsArr[0].split("/"),
                                      str = strArray[0].split(";");
                                  stat['time'] = (new Date(str[0])).getTime();
                                  stat['battles'] = wesGeneral.toFl(str[12]);
                                  stat['wins'] = wesGeneral.toFl(str[10]);
                                  stat['xp'] = wesGeneral.toFl(str[24]);
                                  stat['damage_dealt'] = wesGeneral.toFl(str[16]);
                                  stat['frags'] = wesGeneral.toFl(str[20]);
                                  stat['spotted'] = wesGeneral.toFl(str[22]);
                                  stat['capture_points'] = wesGeneral.toFl(str[14]);
                                  stat['dropped_capture_points'] = wesGeneral.toFl(str[18]);
                                  stat['gold'] = wesGeneral.toFl(str[1]);
                                  stat['credit'] = wesGeneral.toFl(str[2]);
                                  stat['exp'] = wesGeneral.toFl(str[3]);
                                  stat['damage_received'] = 0;
                                  stat['draws'] = 0;
                                  stat['hits'] = 0;
                                  stat['shots'] = 0;
                                  stat['survived_battles'] = 0;
                                  stat['clan'] = {
                                      'battles': 0,
                                      'capture_points': 0,
                                      'damage_dealt': 0,
                                      'damage_received': 0,
                                      'draws': 0,
                                      'dropped_capture_points': 0,
                                      'frags': 0,
                                      'hits': 0,
                                      'shots': 0,
                                      'spotted': 0,
                                      'wins': 0,
                                      'survived_battles': 0,
                                      'xp': 0,
                                      'tanks': []
                                  };
                                  stat['company'] = {
                                      'battles': 0,
                                      'capture_points': 0,
                                      'damage_dealt': 0,
                                      'damage_received': 0,
                                      'draws': 0,
                                      'dropped_capture_points': 0,
                                      'frags': 0,
                                      'hits': 0,
                                      'shots': 0,
                                      'spotted': 0,
                                      'wins': 0,
                                      'survived_battles': 0,
                                      'xp': 0,
                                      'tanks': []
                                  };
                                  if (dsArr.length > 2) {
                                      var sData = JSON.parse(dsArr[2]);
                                      stat['damage_received'] = sData['all']['damage_received'];
                                      stat['draws'] = sData['all']['draws'];
                                      stat['hits'] = sData['all']['hits'];
                                      stat['shots'] = sData['all']['shots'];
                                      stat['survived_battles'] = sData['all']['survived_battles'];

                                      stat['clan']['battles'] = sData['clan']['battles'];
                                      stat['clan']['capture_points'] = sData['clan']['capture_points'];
                                      stat['clan']['damage_dealt'] = sData['clan']['damage_dealt'];
                                      stat['clan']['damage_received'] = sData['clan']['damage_received'];
                                      stat['clan']['draws'] = sData['clan']['draws'];
                                      stat['clan']['dropped_capture_points'] = sData['clan']['dropped_capture_points'];
                                      stat['clan']['frags'] = sData['clan']['frags'];
                                      stat['clan']['hits'] = sData['clan']['hits'];
                                      stat['clan']['shots'] = sData['clan']['shots'];
                                      stat['clan']['spotted'] = sData['clan']['spotted'];
                                      stat['clan']['wins'] = sData['clan']['wins'];
                                      stat['clan']['survived_battles'] = sData['clan']['survived_battles'];
                                      stat['clan']['xp'] = sData['clan']['xp'];

                                      stat['company']['battles'] = sData['company']['battles'];
                                      stat['company']['capture_points'] = sData['company']['capture_points'];
                                      stat['company']['damage_dealt'] = sData['company']['damage_dealt'];
                                      stat['company']['damage_received'] = sData['company']['damage_received'];
                                      stat['company']['draws'] = sData['company']['draws'];
                                      stat['company']['dropped_capture_points'] = sData['company']['dropped_capture_points'];
                                      stat['company']['frags'] = sData['company']['frags'];
                                      stat['company']['hits'] = sData['company']['hits'];
                                      stat['company']['shots'] = sData['company']['shots'];
                                      stat['company']['spotted'] = sData['company']['spotted'];
                                      stat['company']['wins'] = sData['company']['wins'];
                                      stat['company']['survived_battles'] = sData['company']['survived_battles'];
                                      stat['company']['xp'] = sData['company']['xp'];
                                  }
                                  if (dsArr.length > 3)
                                      stat['wgRating'] = wesGeneral.toFl(dsArr[3]);
                                  else
                                      stat['wgRating'] = 0;
                                  stat['medals'] = {};
                                  if (dsArr.length > 1) {
                                      var MedArr = dsArr[1].split("/");
                                      for (var k = 0; k < MedArr.length; k++) {
                                          var MedStr = MedArr[k].split(";");
                                          if (wesGeneral.toFl(MedStr[1]))
                                              stat['medals'][MedStr[0]] = wesGeneral.toFl(MedStr[1]);
                                      }
                                  }
                                  stat['tanks'] = {};
                                  for (k = 1; k < strArray.length; k++) {
                                      var tStr = strArray[k].split(";");
                                      var tName = tStr[0].toLowerCase();
                                      for (var tank in tanksArr) {							  
                    if (typeof(tanksArr[tank]) !== 'undefined' && tName === tanksArr[tank]['tag']) {
                      stat['tanks'][tanksArr[tank]] = {};
                      stat['tanks'][tanksArr[tank]]["b"] = wesGeneral.toFl(tStr[1]);
                      stat['tanks'][tanksArr[tank]]["w"] = tStr.length > 3 ? tStr[3] : 0;
                    }
                                      }
                                  }
                                  statArr.push(stat);
                                  //localStorage.removeItem('daystat_' + uIds[i] + '_' + j);
                              }
                          }
                          wesGeneral.setLSData('wes_' + uIds[i], statArr);
                      }
                      wesGeneral.setLSData('wesSettings', wesSettings);
                      document.cookie = 'usSettings=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                  }
              };
              wesGeneral.showWait(_("sWaitText"));
              steps.step1();
          }
      },
      ratings: function (stats) {
          var xvmColors = ['FE0E00', 'FE7903', 'F8F400', '60FF00', '02C9B3', 'D042F3'];
          var effStep = [0, 615,  870,  1175, 1525, 1850 ]; //рейтинг эффективности
          var wn6Step = [0, 460,  850,  1215, 1620, 1960 ]; //рейтинг WN6
          var wn8Step = [0, 380,  860,  1420, 2105, 2770 ]; //рейтинг WN8
          var bsStep =  [0, 720,  1920, 3905, 6700, 9600 ]; //рейтинг бронесайта
          var prStep =  [0, 1000, 1215, 1445, 1685, 1990 ]; //рейтинг нагиба
          var wgStep =  [0, 2495, 4345, 6425, 8625, 10040]; //рейтинг Wargaming
          var nbStep =  [0, 69,   102,  135,  172,  203  ]; //Нубо-Рейтинг
          
          var avgLev, i;
          
          var tanksStat = wesGeneral.getLSData('wes-tanks'),
              wn8data = wesGeneral.getLSData('wes-wn8'),
              prData = wesGeneral.getLSData('wes-pr');
              
          function calcStep(rVal, steps) {
              var l = steps.length;
              if (rVal >= steps[l - 1]) {
                  return 0;
              }
              for (var i = l - 1; i >= 0; i--) {
                  if (rVal >= steps[i]) {
                      return (steps[i + 1] - rVal).toFixed(2);
                  }
              }
              return 0;
          }

          function getColor(rVal, steps) {
              var l = steps.length;
              if (rVal <= steps[0]) {
                  return xvmColors[0];
              }
              if (rVal >= steps[l - 1]) {
                  return xvmColors[xvmColors.length - 1];
              }
              for (var i = l - 1; i >= 0; i--) {
                  if (rVal >= steps[i]) {
                      return xvmColors[i];
                  }
              }
              return '000';
          }

          function getAvgTanksLvl() {

              var tanks = stats['tanks'];
              if (stats['battles'] == 0) {
                  return 0;
              }
              var avg = 0,
                  btl = 0;
              for (var id in tanks) {
                if (typeof(tanksStat[id]) !== 'undefined') {
                  avg += tanksStat[id]['l'] * tanks[id]['b'];
                  btl += tanks[id]['b'];
                } else {
                  console.log('Unexpected tank: ' + id);
                }
                  
              }
              return btl ? avg / btl : 0;
          }

          avgLev = getAvgTanksLvl();
          
          for (i = 0; i < stTypeKeys.length; i++) {
            if (typeof stats[stTypeKeys[i]] == 'undefined') {
              stats[stTypeKeys[i]] = [];
            for (j = 0; j < stStatKeys.length; j++) {
              if (stats[stTypeKeys[i]][stStatKeys[j]] == undefined) {
                stats[stTypeKeys[i]][stStatKeys[j]] = 0;
              }
            }
            };
            
            
          }
          
          var effRat = function () {
                  var retList = {};

                  function calculate() {
                      var damag = stats['damage_dealt'],
                          battles = stats['battles'],
                          frags = stats['frags'],
                          spotted = stats['spotted'],
                          caps = stats['capture_points'],
                          defs = stats['dropped_capture_points'];
                      if (battles == 0) {
                          return 0;
                      }
                      var value = (damag / battles * (10 / (avgLev + 2)) * (0.23 + 2 * avgLev / 100) +
                          frags / battles * 250 +
                          spotted / battles * 150 +
                          Math.log((caps / battles) + 1) / Math.log(1.732) * 150 +
                          defs / battles * 150).toFixed(2);
                      return (value > 0) ? value : 0;
                  }

                  function stepToNextLvl(rVal) {
                      return calcStep(rVal, effStep);
                  }

                  function getXvm(rVal) {
                      if (rVal > 2250) {
                          return 100;
                      }
                      return  Math.max(0, Math.min(100,
                              rVal * (rVal * (rVal * (rVal * (rVal * 
                              (rVal * 0.000000000000000013172 - 0.000000000000092286)
                              + 0.00000000023692)
                              - 0.00000027377)
                              + 0.00012983)
                              + 0.05935)
                              - 31.684, 100), 0).toFixed(2);
                  }

                  function xvmStepToNextLvl(rVal) {
                      var steps = effStep.map(getXvm);
                      return calcStep(rVal, steps);
                  }

                  retList['value'] = calculate();
                  retList['stepToNL'] = stepToNextLvl(retList['value']);
                  retList['xvm'] = getXvm(retList['value']);
                  retList['xvmStepToNL'] = xvmStepToNextLvl(retList['xvm']);
                  retList['color'] = getColor(retList['value'], effStep);
                  return retList;
              },
              wn6Rat = function () {
                  var retList = {};

                  function calculate() {
                      var damag = stats['damage_dealt'],
                          battles = stats['battles'],
                          frags = stats['frags'],
                          spotted = stats['spotted'],
                          defs = stats['dropped_capture_points'],
                          wins = stats['wins'];
                      var value = ((1240 - 1040 / Math.pow(Math.min(avgLev, 6), 0.164)) * frags / battles +
                          damag / battles * 530 / (184 * Math.pow(Math.E, 0.24 * avgLev) + 130) +
                          spotted / battles * 125 +
                          Math.min(defs / battles, 2.2) * 100 +
                          ((185 / (0.17 + Math.pow(Math.E, (wins / battles * 100 - 35) * -0.134))) - 500) * 0.45 +
                          (6 - Math.min(avgLev, 6)) * -60).toFixed(2);
                      return (value > 0) ? value : 0;
                  }

                  function stepToNextLvl(rVal) {
                      return calcStep(rVal, wn6Step);
                  }

                  function getXvm(rVal) {
                      if (rVal > 2350) {
                          return 100;
                      }
                      return Math.max(0, Math.min(100,
                              rVal * (rVal * (rVal * (rVal * (rVal * (rVal *
                              0.000000000000000001225
                              - 0.000000000000007167)
                              + 0.000000000005501)
                              + 0.00000002368)
                              - 0.00003668)
                              + 0.05965)
                              - 5.297, 100), 0).toFixed(2);
                  }

                  function xvmStepToNextLvl(rVal) {
                      var steps = wn6Step.map(getXvm);
                      return calcStep(rVal, steps);
                  }

                  retList['value'] = calculate();
                  retList['stepToNL'] = stepToNextLvl(retList['value']);
                  retList['xvm'] = getXvm(retList['value']);
                  retList['xvmStepToNL'] = xvmStepToNextLvl(retList['xvm']);
                  retList['color'] = getColor(retList['value'], wn6Step);
                  return retList;
              },
              wn8Rat = function () {
                  var retList = {};

                  function calculate() {
                      
                      var tanks = stats['tanks'], tbcount;
                      if (stats['battles'] == 0) {
                          return 0;
                      }
                      var expDmg = 0.0,
                          expSpot = 0.0,
                          expFrag = 0.0,
                          expDef = 0.0,
                          alltb = 0,
                          expWinRate = 0.0;
                      for (var id in tanks) {
                          if (wn8data[id]) {
                              tbcount = parseInt(tanks[id]['b']);
                              alltb += tbcount;
                              expDmg += parseFloat(wn8data[id]['dmg']) * tbcount;
                              expSpot += parseFloat(wn8data[id]['spot']) * tbcount;
                              expFrag += parseFloat(wn8data[id]['frag']) * tbcount;
                              expDef += parseFloat(wn8data[id]['def']) * tbcount;
                              expWinRate += parseFloat(wn8data[id]['wRate']) * tbcount / 100.0;
                          }
                      }
                      var rDAMAGE = stats['damage_dealt'] / stats['battles'] * alltb / expDmg,
                          rSPOT = stats['spotted'] / stats['battles'] * alltb / expSpot,
                          rFRAG = stats['frags'] / stats['battles'] * alltb / expFrag,
                          rDEF = stats['dropped_capture_points'] / stats['battles'] * alltb / expDef,
                          rWIN = stats['wins'] / stats['battles'] * alltb / expWinRate,
                          rWINc = Math.max(0, (rWIN - 0.71) / (1 - 0.71)),
                          rDAMAGEc = Math.max(0, (rDAMAGE - 0.22) / (1 - 0.22)),
                          rFRAGc = Math.max(0, Math.min(rDAMAGEc + 0.2, (rFRAG - 0.12) / (1 - 0.12))),
                          rSPOTc = Math.max(0, Math.min(rDAMAGEc + 0.1, (rSPOT - 0.38) / (1 - 0.38))),
                          rDEFc = Math.max(0, Math.min(rDAMAGEc + 0.1, (rDEF - 0.10) / (1 - 0.10)));
                      var value = 980.0 * rDAMAGEc + 210.0 * rDAMAGEc * rFRAGc + 155.0 * rFRAGc * rSPOTc + 75.0 * rDEFc * rFRAGc + 145.0 * Math.min(1.8, rWINc);
                      return (value > 0) ? value.toFixed(2) : 0;
                  }

                  function stepToNextLvl(rVal) {
                      return calcStep(rVal, wn8Step);
                  }

                  function getXvm(rVal) {
                      if (rVal > 3650) {
                          return 100;
                      }
                      return Math.max(0, Math.min(100,
                              rVal * (rVal * (rVal * (rVal * (rVal * (-rVal *
                              0.00000000000000000007656
                              + 0.0000000000000014848)
                              - 0.0000000000099633)
                              + 0.00000002858)
                              - 0.00003836)
                              + 0.0575)
                              - 0.99, 100), 0).toFixed(2);
                  }

                  function xvmStepToNextLvl(rVal) {
                      var steps = wn8Step.map(getXvm);
                      return calcStep(rVal, steps);
                  }

                  retList['value'] = calculate();
                  retList['stepToNL'] = stepToNextLvl(retList['value']);
                  retList['xvm'] = getXvm(retList['value']);
                  retList['xvmStepToNL'] = xvmStepToNextLvl(retList['xvm']);
                  retList['color'] = getColor(retList['value'], wn8Step);
                  return retList;
              },
              prRat = function () {
                  var retList = {};

                  function calculate() {
          
                    var tanks = stats['tanks'], prD;
                    if (stats['battles'] == 0) {
                        return 0;
                    }
                    var expDmg = 0;
                    for (var id in tanks) {
                        if (id in prData) {
                            prD = parseFloat(prData[id]);
                        } else {
                            prD = 0;
                        }
                        expDmg += prD * tanks[id]['b'];
                    }
                    var clearedFromPenalties1 = 1500.0,
                        expectedMinBattles1 = 500.0,
                        expectedMinAvgTier1 = 6.0,
                        clearedFromPenalties2 = 1900.0,
                        expectedMinBattles2 = 2000.0,
                        expectedMinAvgTier2 = 7.0;

                    var damage = stats['damage_dealt'],
                        battles = stats['battles'],
                        wins = stats['wins'],
                        avgLev = getAvgTanksLvl();
                    var value = (500 * (wins / battles) / 0.4856) + (1000 * damage / (expDmg * 0.975));
                    if (value > clearedFromPenalties1)
                        value = value - (value - clearedFromPenalties1) * Math.pow(Math.max(0, 1 - (avgLev / expectedMinAvgTier1), 1 - (battles / expectedMinBattles1)), 0.5);
                    if (value > clearedFromPenalties2)
                        value = value - (value - clearedFromPenalties2) * Math.pow(Math.max(0, 1 - (avgLev / expectedMinAvgTier2), 1 - (battles / expectedMinBattles2)), 0.5);
                    return (value > 0) ? value.toFixed(2) : 0;
                  }

                  function stepToNextLvl(rVal) {
                      return calcStep(rVal, prStep);
                  }

                  function getXvm(rVal) {
                      if (rVal >= 2175) {
                        return 100;
                      }
                      if (rVal >= 1500 && rVal < 2175) {
                        return Math.max(rVal * (rVal * (rVal * 
                                (0.00000000074489 * rVal - 0.0000051431) 
                                + 0.01313866) 
                                - 14.65) + 6057.52
                                , rVal*(rVal*(0.000000081703*rVal - 0.000699026) + 1.88722) - 1538.59).toFixed(2);
                      }
                      return Math.max(rVal*(0.00001717*rVal + 0.03825) - 38.45, 0).toFixed(2);
                  }

                  function xvmStepToNextLvl(rVal) {
                      var steps = prStep.map(getXvm);
                      return calcStep(rVal, steps);
                  }

                  retList['value'] = calculate();
                  retList['stepToNL'] = stepToNextLvl(retList['value']);
                  retList['xvm'] = getXvm(retList['value']);
                  retList['xvmStepToNL'] = xvmStepToNextLvl(retList['xvm']);
                  retList['color'] = getColor(retList['value'], prStep);
                  return retList;
              },
              bsRat = function () {
                  var retList = {};

                  function calculate() {
                      var battles = stats['battles'] - stats['company']['battles'] - stats['clan']['battles'],
                          wins = stats['wins'] - stats['company']['wins'] - stats['clan']['wins'],
                          damage = stats['damage_dealt'] - stats['company']['damage_dealt'] - stats['clan']['damage_dealt'],
                          frags = stats['frags'] - stats['company']['frags'] - stats['clan']['frags'],
                          defs = stats['dropped_capture_points'] - stats['company']['dropped_capture_points'] - stats['clan']['dropped_capture_points'],
                          spotted = stats['spotted'] - stats['company']['spotted'] - stats['clan']['spotted'],
                          caps = stats['capture_points'] - stats['company']['capture_points'] - stats['clan']['capture_points'],
                          xp = stats['xp'] - stats['company']['xp'] - stats['clan']['xp'];
                      var value = Math.log(battles) / 10 * (xp / battles + damage / battles * (wins / battles * 2.0 + frags / battles * 0.9 + spotted / battles * 0.5 + caps / battles * 0.5 + defs / battles * 0.5));
                      return value.toFixed(2);
                  }

                  function stepToNextLvl(rVal) {
                      return calcStep(rVal, bsStep);
                  }

                  function getXvm(rVal) {
                    if (rVal > 13200) {
                      return 100;
                    }
                    return Math.max(Math.min(rVal * (rVal * (rVal * (rVal * (rVal * 
                                (-0.00000000000000000000024883*rVal + 0.0000000000000000117935) 
                                - 0.00000000000021706) 
                                + 0.00000000193685) 
                                - 0.0000089711)
                                + 0.02948) 
                                - 0.78, 100), 0).toFixed(2);
                  }

                  function xvmStepToNextLvl(rVal) {
                      var steps = bsStep.map(getXvm);
                      return calcStep(rVal, steps);
                  }
                  
                  retList['value'] = calculate();
                  retList['stepToNL'] = stepToNextLvl(retList['value']);
                  retList['xvm'] = getXvm(retList['value']);
                  retList['xvmStepToNL'] = xvmStepToNextLvl(retList['xvm']);
                  retList['color'] = getColor(retList['value'], bsStep);
                  return retList;
              },
              noobRat = function () {
                  var retList = {};

                  function calculate() {
                    return stats['noobRat'] ? stats['noobRat'] : 0;
                  }
                  
                  function stepToNextLvl(rVal) {
                      return calcStep(rVal, nbStep);
                  }

                  function getXvm(rVal) {
                      if (rVal > 240) {
                          return 100;
                      }
                      return Math.max(Math.min(rVal*(rVal*(rVal*(rVal*(rVal*
                                  (0.0000000000060542*rVal - 0.0000000047258) 
                                  + 0.00000132876) 
                                  - 0.00016789) 
                                  + 0.009921) 
                                  + 0.2677) 
                                  - 17.3, 100), 0).toFixed(2);
                  }

                  function xvmStepToNextLvl(rVal) {
                      var steps = nbStep.map(getXvm);
                      return calcStep(rVal, steps);
                  }
                  
                  retList['value'] = calculate();
                  retList['stepToNL'] = stepToNextLvl(retList['value']);
                  retList['xvm'] = getXvm(retList['value']);
                  retList['xvmStepToNL'] = xvmStepToNextLvl(retList['xvm']);
                  retList['color'] = getColor(retList['value'], nbStep);
                  return retList;
              },
              wgRat = function () {
                  var retList = {};

                  function calculate() {
                      return stats['wgRating'];
                  }

                  function stepToNextLvl(rVal) {
                      return calcStep(rVal, wgStep);
                  }

                  function getXvm(rVal) {
                      if (rVal > 11100) {
                          return 100;
                      }
                      return Math.max(0, Math.min(100,
                              rVal * (rVal * (rVal * (rVal * (rVal * (-rVal *
                              0.0000000000000000000013018
                              + 0.00000000000000004812)
                              - 0.00000000000071831)
                              + 0.0000000055583)
                              - 0.000023362)
                              + 0.059054)
                              - 47.85, 100), 0).toFixed(2);
                  }

                  function xvmStepToNextLvl(rVal) {
                      var steps = wgStep.map(getXvm);
                      return calcStep(rVal, steps);
                  }

                  retList['value'] = calculate();
                  retList['stepToNL'] = stepToNextLvl(retList['value']);
                  retList['xvm'] = getXvm(retList['value']);
                  retList['xvmStepToNL'] = xvmStepToNextLvl(retList['xvm']);
                  retList['color'] = getColor(retList['value'], wgStep);
                  return retList;
              },
              wn8tankRat = function (tank) {
                var retList = {};
                
                if (wn8data[tank] != undefined) {
                  var expDmg = stats['tanks'][tank]['b'] * wn8data[tank]['dmg'],
                      expSpot = stats['tanks'][tank]['b'] * wn8data[tank]['spot'],
                      expFrag = stats['tanks'][tank]['b'] * wn8data[tank]['frag'],
                      expDef = stats['tanks'][tank]['b'] * wn8data[tank]['def'],
                      expWinRate = stats['tanks'][tank]['b'] * wn8data[tank]['wRate'],
                      rDAMAGE = stats['tanks'][tank]['d'] / expDmg,
                      rSPOT = stats['tanks'][tank]['s'] / expSpot,
                      rFRAG = stats['tanks'][tank]['f'] / expFrag,
                      rDEF = stats['tanks'][tank]['p'] / expDef,
                      rWIN = stats['tanks'][tank]['w'] / expWinRate,
                      rWINc = Math.max(0, (rWIN - 0.71) / (1 - 0.71)),
                      rDAMAGEc = Math.max(0, (rDAMAGE - 0.22) / (1 - 0.22)),
                      rFRAGc = Math.max(0, Math.min(rDAMAGEc + 0.2, (rFRAG - 0.12) / (1 - 0.12))),
                      rSPOTc = Math.max(0, Math.min(rDAMAGEc + 0.1, (rSPOT - 0.38) / (1 - 0.38))),
                      rDEFc = Math.max(0, Math.min(rDAMAGEc + 0.1, (rDEF - 0.10) / (1 - 0.10)));
                  retList['value'] = 980 * rDAMAGEc + 210 * rDAMAGEc * rFRAGc + 155 * rFRAGc * rSPOTc + 75 * rDEFc * rFRAGc + 145 * Math.min(1.8, rWINc);
                  retList['stepToNL'] = calcStep(retList['value'], wn8Step);
                  retList['color'] = getColor(retList['value'], wn8Step);
                  return retList;
                } else {
                  return 0;
                }
              },
              prtankRat = function (tank) {
                var retList = {};
                var tPR = (500 * (stats['tanks'][tank]['w'] / stats['tanks'][tank]['b']) / 0.4856) + (1000 * stats['tanks'][tank]['d'] / ((stats['tanks'][tank]['b'] * prData[tank]) * 0.975)),
                    clearedFromPenalties1 = 1500,
                    expectedMinBattles1 = 500,
                    expectedMinAvgTier1 = 6,
                    clearedFromPenalties2 = 1900,
                    expectedMinBattles2 = 2000,
                    expectedMinAvgTier2 = 7;
                if (tPR > clearedFromPenalties1)
                  tPR = tPR - (tPR - clearedFromPenalties1) * Math.pow(Math.max(0, 1 - (tanksStat[tank]['l'] / expectedMinAvgTier1), 1 - (stats['tanks'][tank]['b'] / expectedMinBattles1)), 0.5);
                if (tPR > clearedFromPenalties2)
                  tPR = tPR - (tPR - clearedFromPenalties2) * Math.pow(Math.max(0, 1 - (tanksStat[tank]['l'] / expectedMinAvgTier2), 1 - (stats['tanks'][tank]['b'] / expectedMinBattles2)), 0.5);
                retList['value'] = tPR;
                retList['stepToNL'] = calcStep(retList['value'], prStep);
                retList['color'] = getColor(retList['value'], prStep);
                return retList;
                
              },
              tanksRat = function() {
               var tanks = {};
               for (var tank in stats['tanks']) {
                 tanks[tank] = {};
                 tanks[tank]['wn8'] = wn8tankRat(tank);
                 tanks[tank]['pr'] = prtankRat(tank);
               }
               return tanks;
              };
          return {
              'eff': effRat(),
              'wn6': wn6Rat(),
              'wn8': wn8Rat(),
              'pr': prRat(),
              'bs': bsRat(),
              'wg': wgRat(),
              'noob': noobRat(),
              'avg': avgLev,
              'tanks': tanksRat()
          }
      },
      main: function () {
          this.setStyles();
          this.setScripts();
          wesSettings = this.getLSData('wesSettings');
          if (!wesSettings) wesSettings = this.defaultSettings;
          
          if (wesSettings.blocks['compStat'] == undefined) {
            
            var blocks = jQuery.extend({}, wesSettings.blocks);
            
            wesSettings.blocks['compStat'] = this.defaultSettings.blocks['compStat'];
            
            delete wesSettings.blocks['pers']; 
            delete wesSettings.blocks['speed'];
            delete wesSettings.blocks['hall'];
            delete wesSettings.blocks['achiev'];
            delete wesSettings.blocks['common'];
            delete wesSettings.blocks['diagr'];
            delete wesSettings.blocks['rat'];
            delete wesSettings.blocks['veh'];
            
            wesSettings.blocks['pers'] = blocks['pers']; 
            wesSettings.blocks['speed'] = blocks['speed'];
            wesSettings.blocks['hall'] = blocks['hall'];
            wesSettings.blocks['achiev'] = blocks['achiev'];
            wesSettings.blocks['common'] = blocks['common'];
            wesSettings.blocks['diagr'] = blocks['diagr'];
            wesSettings.blocks['rat'] = blocks['rat'];
            wesSettings.blocks['veh'] = blocks['veh'];
            
            wesGeneral.setLSData('wesSettings', wesSettings);
          }
          
          String.locale = wesSettings.locale;
          wesApiKey = this.getApiKey();
          this.createSettingsWindow();
          this.createErrorWindow();
          this.createWaitWindow();
          if (wesSettings.version < 1) this.migrateToNewVersion.v1(); else $('#wes-wait').trigger('wesGeneralReady');
      }
    };

    function extend(Child, Parent) {
        var F = function () {
        };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype
    }

    function WrappableBlock(name, options) {
        var me = this;

        me.name = name;
        me.options = options || {};

        me.wrap();
    }

    WrappableBlock.prototype.getCaption = function (showBlock) {
        var me = this,
            hasTranslate = _('block' + me.name.capitalize()) != 'block' + me.name.capitalize();

        return (showBlock ? _('hideBlock') : _('showBlock')) +
            ' ' +
            (hasTranslate ? '&laquo;' + _('block' + me.name.capitalize()) + '&raquo;' : '')
    };

    WrappableBlock.prototype.wrap = function () {
        var me = this,
            $wrp;

        var showBlock = me.name in wesSettings.blocks && wesSettings.blocks[me.name] == 0,
            deleteBlock = me.name in wesSettings.blocks && wesSettings.blocks[me.name] == 2,
            expander = '<div class="wes-s-expander' +
                (me.options.extraMargin ? ' wes-s-expander__extra' : '') + '" data-expand="' + me.name + '">' +
                '<a class="b-vertical-arrow' +
                (showBlock ? ' b-vertical-arrow__open' : '') +
                '" href="">' +
                '<span class="b-link-fake">' + me.getCaption(showBlock) + '</span></a></div>',
            blockWrap = '<div class="wes-b-expander" data-expand="' + me.name + '" style="' +
                (showBlock ? '' : 'display: none;') +
                '">';
        if (!me.options.end) {
            $wrp = $(me.options.start);
            if (!deleteBlock) {
                $wrp.wrap(blockWrap);
            } else {
                $wrp.remove();
            }
        } else {
            $wrp = $(me.options.start).nextUntil(me.options.end).andSelf().next().andSelf();
            if (!deleteBlock) {
                $wrp.wrapAll(blockWrap);
            } else {
                $wrp.remove();
            }
        }
        if (!deleteBlock) {
            $('div.wes-b-expander[data-expand=' + me.name + ']').before(expander);
            $('div.wes-s-expander[data-expand=' + me.name + '] a').click(me.toggle(me));
        }
    };
    
    WrappableBlock.prototype.toggle = function (thisArg) {
        var me = thisArg;
        return function (e) {
            e.preventDefault();
            var $this = $(e.currentTarget),
                $block = $('div.wes-b-expander[data-expand=' + me.name + ']'),
                showBlock = !$block.is(':visible');
            $block.slideToggle();
            $this.children('span').html(me.getCaption(showBlock));
            $this.toggleClass('b-vertical-arrow__open', showBlock);
        }
    };
    
    WrappableBlock.prototype.draw = function () {
    };

    WBEff = function () {
        var me = this;

        me.name = 'efRat';
        me.options = {
            start: 'div.wes-b-efrat'
        };

        me.draw();
        me.wrap();
    };
    
    extend(WBEff, WrappableBlock);
    
    WBEff.prototype.draw = function () {
        var emptyRow = function (label, wesRatingType) {
            wesRatingType = wesRatingType || label;
            wesRatingType = wesRatingType.toLocaleLowerCase();
            return '<tr><td>' + _(label) + '</td><td class="t-dotted_number t-dotted_number__nowidth">' +
                '<span class="wes-eff-' + wesRatingType + '" id="wes-eff-' + wesRatingType + '"></span></td></tr>';
        };

        var tpl = '<div class="b-user-block wes-b-efrat">' +
            '<div class="b-head-block"><h3>' + _('rating') + '</h3></div>' +
            //'<table cellspacing="0" cellpadding="0" class="t-profile"><thead><tr>' +
            //'<th class="wes-r-header wes-r-header__active" tabindex="0" unselectable="on" style="-moz-user-select: none;" data-rating-tab="eff">&nbsp;</th>' +
//            '<th class="wes-r-header" tabindex="0" unselectable="on" style="-moz-user-select: none;" data-rating-tab="global">' + _('globalMap') + '</th>' +
//            '<th class="wes-r-header" tabindex="0" unselectable="on" style="-moz-user-select: none;" data-rating-tab="rota">' + _('rota') + '</th>' +
//            '<th class="wes-r-header" tabindex="0" unselectable="on" style="-moz-user-select: none;" data-rating-tab="historic">' + _('historic') + '</th>' +
//            '<th class="wes-r-header" tabindex="0" unselectable="on" style="-moz-user-select: none;" data-rating-tab="graph">' + _('graph') + '</th>' +
            //'</tr></thead></table>' +
            '<div class="b-user-block_info clearfix" style="padding-top: 0;" data-rating-tab="eff">' +
            '<div class="b-user-block_right-column">' +
            '<table class="us-ratings">' +
            '<tr>' +
            '<td class="us-ratings-head" width="33%"><a href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '" target="_blank">XWN8</a></td>' +
            '<td class="us-ratings-head" width="33%"><a href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '" target="_blank">XWN6</a></td>' +
            '<td class="us-ratings-head"><a href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '" target="_blank">XRE</a></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="33%"><span class="wes-eff-xrwn8" id="wes-eff-xrwn8"></span></td>' +
            '<td width="33%"><span class="wes-eff-xrwn6" id="wes-eff-xrwn6"></span></td>' +
            '<td><span class="wes-eff-xreff" id="wes-eff-xreff"></span></td>' +
            '</tr>' +
            '</table>' +
            '<table class="us-ratings">' +
            '<tr>' +
            '<td class="us-ratings-head" width="33%"><a href="#" target="_blank">XWG</a></td>' +
            '<td class="us-ratings-head" width="33%"><a href="http://www.noobmeter.com/player/ru/' + wesAccount.userName + '/' + wesAccount.userId + '/" target="_blank">XPR</a></td>' +
            '<td class="us-ratings-head"><a href="http://armor.kiev.ua/wot/gamerstat/' + wesAccount.userName + '" target="_blank">XBS</a></td>' +
            '' +
            '</tr>' +
            '<tr>' +
            '<td width="33%"><span class="wes-eff-xrkwg" id="wes-eff-xrkwg"></span></td>' +
            '<td width="33%"><span class="wes-eff-xrnag" id="wes-eff-xrnag"></span></td>' +
            '<td><span class="wes-eff-xrarmor" id="wes-eff-xrarmor"></span></td>' +
            '</tr>' +
            '<tr>' +
            '<td class="us-ratings-head" width="33%"></td>' +
            '<td class="us-ratings-head" width="33%"><a href="http://wot-noobs.ru/nubomer/?nick=' + wesAccount.userName + '" target="_blank">XNR</a></td>' +
            '<td class="us-ratings-head"></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="33%">&nbsp;</td>' +
            '<td width="33%"><span class="wes-eff-xrnoob" id="wes-eff-xrnoob"></span></td>' +
            '<td></td>' +
            '</tr>' +
            '</table>' +
            '<table class="t-dotted"><tbody>' +
            emptyRow('rExp') + emptyRow('rDamage') + emptyRow('rFrag') +
            emptyRow('rSpot') + emptyRow('rCap') + emptyRow('rDeff') +
            emptyRow('treesCut') + emptyRow('lastBattle') + emptyRow('lastUpdate') +
            '</tbody></table></div>' +
            '<div class="b-user-block_left-column">' +
            '<table class="us-ratings">' +
            '<tr>' +
            '<td class="us-ratings-head" width="33%"><a href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '" target="_blank">WN8</a></td>' +
            '<td class="us-ratings-head" width="33%"><a href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '" target="_blank">WN6</a></td>' +
            '<td class="us-ratings-head"><a href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '" target="_blank">RE</a></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="33%"><span class="wes-eff-rwn8" id="wes-eff-rwn8"></span></td>' +
            '<td width="33%"><span class="wes-eff-rwn6" id="wes-eff-rwn6"></span></td>' +
            '<td><span class="wes-eff-reff" id="wes-eff-reff"></span></td>' +
            '</tr>' +
            '</table>' +
            '<table class="us-ratings">' +
            '<tr>' +
            '<td class="us-ratings-head" width="33%"><a href="#" target="_blank">WG</a></td>' +
            '<td class="us-ratings-head" width="33%"><a href="http://www.noobmeter.com/player/ru/' + wesAccount.userName + '/' + wesAccount.userId + '/" target="_blank">PR</a></td>' +
            '<td class="us-ratings-head"><a href="http://armor.kiev.ua/wot/gamerstat/' + wesAccount.userName + '" target="_blank">BS</a></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="33%"><span class="wes-eff-rkwg" id="wes-eff-rkwg"></span></td>' +
            '<td width="33%"><span class="wes-eff-rnag" id="wes-eff-rnag"></span></td>' +
            '<td><span class="wes-eff-rarmor" id="wes-eff-rarmor"></span></td>' +
            '</tr>' +
            '<tr>' +
            '<td class="us-ratings-head" width="33%"></td>' +
            '<td class="us-ratings-head" width="33%"><a href="http://wot-noobs.ru/nubomer/?nick=' + wesAccount.userName + '" target="_blank">NR</a></td>' +
            '<td class="us-ratings-head"></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="33%"></td>' +
            '<td width="33%"><span class="wes-eff-rnoob" id="wes-eff-rnoob"></span></td>' +
            '<td></td>' +
            '</tr>' +
            '</table>' +
            '<table class="t-dotted"><tbody>' +
            emptyRow('rBattles') +
            emptyRow('rBatteDay') + emptyRow('rMedLvl') + emptyRow('rWin') +
            emptyRow('rLoose') + emptyRow('rSurv') + emptyRow('rHit') +
            emptyRow('maxDamage') + emptyRow('maxFrags') + emptyRow('maxXp') +
            '</tbody></table></div>' +
            '</div>' +
            '<div class="b-user-block_info clearfix" style="padding-top: 0; display: none;" data-rating-tab="global">' +
            '<table class="t-dotted"><tbody>' +
            emptyRow('rBattles', 'rGBattles') + emptyRow('rGWin') + emptyRow('rDamage', 'rGDamage') +
            emptyRow('rFrag', 'rGFrag') + emptyRow('rSpot', 'rGSpot') + emptyRow('rCap', 'rGCap') +
            emptyRow('rDeff', 'rGDeff') + emptyRow('rExp', 'rGExp') + emptyRow('rWin', 'rGWin') +
            emptyRow('rSurv', 'rGSurv') + emptyRow('rHit', 'rGHit') +
            '</tbody></table>' +
            '</div>' +
            '<div class="b-user-block_info clearfix" style="padding-top: 0; display: none;" data-rating-tab="rota">' +
            '<table class="t-dotted"><tbody>' +
            emptyRow('rBattles', 'rRBattles') + emptyRow('rGWin', 'rRWin') + emptyRow('rDamage', 'rRDamage') +
            emptyRow('rFrag', 'rRFrag') + emptyRow('rSpot', 'rRSpot') + emptyRow('rCap', 'rRCap') +
            emptyRow('rDeff', 'rRDeff') + emptyRow('rExp', 'rRExp') + emptyRow('rWin', 'rRWin') +
            emptyRow('rSurv', 'rRSurv') + emptyRow('rHit', 'rRHit') +
            '</tbody></table>' +
            '</div>' +
            '<div class="b-user-block_info clearfix" style="padding-top: 0; display: none;" data-rating-tab="historic">' +
            '<table class="t-dotted"><tbody>' +
            emptyRow('rBattles', 'rHBattles') + emptyRow('rGWin', 'rHWin') + emptyRow('rDamage', 'rHDamage') +
            emptyRow('rFrag', 'rHFrag') + emptyRow('rSpot', 'rHSpot') + emptyRow('rCap', 'rHCap') +
            emptyRow('rDeff', 'rHDeff') + emptyRow('rExp', 'rHExp') + emptyRow('rWin', 'rHWin') +
            emptyRow('rSurv', 'rHSurv') + emptyRow('rHit', 'rHHit') +
            '</tbody></table>' +
            '</div>' +
            '<div class="b-user-block_info clearfix" style="padding-top: 0; display: none;" data-rating-tab="graph">' +
            'ГРАФФФФОН' +
            '</div>' +
            '</div>';

        var $after = $('div.wes-b-expander[data-expand=newBat]');
        if ($after.length) {
            $after.after(tpl);
        } else {
            $('div.b-user-block:first').before(tpl);
        }
        $('th[data-rating-tab]').click(function (e) {
            e.preventDefault();
            var $this = $(e.currentTarget);
            $('div[data-rating-tab]').hide();
            $('div[data-rating-tab=' + $this.data('rating-tab') + ']').show();
            $('th.wes-r-header__active').removeClass('wes-r-header__active');
            $this.addClass('wes-r-header__active');
        });
    };
    
    WBNew = function () {
        var me = this;

        me.name = 'newBat';
        me.options = {
            start: 'div.wes-b-newbat'
        };

        me.draw();
        me.wrap();
    };
    
    extend(WBNew, WrappableBlock);
    
    WBNew.prototype.draw = function () {
        var emptyRow = function (label, wesRatingType) {
            wesRatingType = wesRatingType || label;
            wesRatingType = wesRatingType.toLocaleLowerCase();
            return '<tr><td>' + _(label) + '</td>' +
                '<td class="t-dotted_number t-dotted_number__nowidth">' +
                '<span class="wes-eff-' + wesRatingType + '__new" id="wes-eff-' + wesRatingType + '__new"></span></td>' +
                '<td class="t-dotted_number t-dotted_number__nowidth">' +
                '<span class="wes-eff-' + wesRatingType + '__old" id="wes-eff-' + wesRatingType + '__old"></span></td>' +
                '<td class="t-dotted_number t-dotted_number__nowidth">' +
                '<span class="wes-eff-' + wesRatingType + '__cur" id="wes-eff-' + wesRatingType + '__cur"></span></td>' +
                '</tr>';
        };

        var tpl = '<div class="b-user-block wes-b-newbat">' +
                  '<div class="b-head-block"><h3>' + _('blockNewBat') + '</h3></div>' +
                  '<div class="b-user-block_info clearfix" style="padding-top: 0;">' +
                  '<table class="t-dotted"><tbody>' +
                  '<th style="width: 31%;"></th>' + 
                  '<th style="width: 23%; text-align: right;"><h4 class="wes-h-header">' + _('new') + '</h4></th>' +
                  '<th style="width: 23%; text-align: right;"><h4 class="wes-h-header">' + _('hsaved') + '</h4></th>' +
                  '<th style="width: 23%; text-align: right;"><h4 class="wes-h-header">' + _('current') + '</h4></th>' +
                  emptyRow('rBattles', 'nBattles') + emptyRow('nWin') + emptyRow('rWin', 'nWinRatio') +
                  emptyRow('rExp', 'nExp') + emptyRow('rMedLvl', 'nMedLvl') + emptyRow('rDamage', 'nDamage') +
                  emptyRow('rFrag', 'nFrag') + emptyRow('rSpot', 'nSpot') + emptyRow('rCap', 'nCap') +
                  emptyRow('rDeff', 'nDeff') + emptyRow('rEff', 'nEff') + emptyRow('rWn6', 'nWn6') +
                  emptyRow('rWn8', 'nWn8') +
                  '</tbody></table>' +
                  '</div></div>';

        var $before = $('div.wes-s-expander[data-expand=efRat]');
        if ($before.length) {
            $before.before(tpl);
        } else {
            $('div.b-user-block:first').before(tpl);
        }
        
    };

    WBCompStat = function() {
      var me = this;
      
      me.name = 'compStat';
      me.options = {
        start: 'div.wes-b-compstat'
      };
      
      me.draw();
      me.wrap();
    };
    
    extend(WBCompStat, WrappableBlock);
    
    WBCompStat.prototype.draw = function () {
      
      var emptyRow = function (label, wesRatingType) {
        wesRatingType = wesRatingType || label;
        wesRatingType = wesRatingType.toLocaleLowerCase();
        return  '<tr><td>' + _(label) + '</td>' +
                '<td class="t-dotted_number t-dotted_number__nowidth">' +
                '<span class="wes-eff-' + wesRatingType + '__cur" id="wes-eff-' + wesRatingType + '__cur"></span></td>' +
                '<td class="t-dotted_number t-dotted_number__nowidth">' +
                '<span class="wes-eff-' + wesRatingType + '__my" id="wes-eff-' + wesRatingType + '__me"></span></td>' +
                '</tr>';
        };
        
      var tpl = '<div class="b-user-block wes-b-compstat">' + '<div class="b-head-block"><h3>' + _('blockCompStat') + '</h3></div>' +
                '<div class="b-user-block_info clearfix" style="padding-top: 0;">' +
                '<table class="t-dotted"><tbody>' +
                '<th style="width: 33%;"></th>' + 
                '<th style="width: 33%; text-align: right;"><h4 class="wes-h-header">' + _('player') + '</h4></th>' +
                '<th style="width: 33%; text-align: right;"><h4 class="wes-h-header">' + _('me') + '</h4></th>' +
                emptyRow('rBattles', 'nBattles') + emptyRow('nWin') + emptyRow('rWin', 'nWinRatio') +
                emptyRow('rExp', 'nExp') + emptyRow('rMedLvl', 'nMedLvl') + emptyRow('rDamage', 'nDamage') +
                emptyRow('rFrag', 'nFrag') + emptyRow('rSpot', 'nSpot') + emptyRow('rCap', 'nCap') +
                emptyRow('rDeff', 'nDeff') + emptyRow('rEff', 'nEff') + emptyRow('rWn6', 'nWn6') +
                emptyRow('rWn8', 'nWn8') +
                '</tbody></table>' +
                '</div></div>';
      
      var $before = $('div.wes-s-expander[data-expand=pers]');
      if (!$before.length) {
        var $before = $('div.wes-s-expander[data-expand=speed]');
      }
      if ($before.length) {
        $before.before(tpl);
      } else {
        $('div.b-user-block:first').before(tpl);
      }
      
    }
    
    function SBNewBattles(saveDate) {
        var me = this;

        me.saveDate = saveDate || wesGeneral.formattedDate(new Date());
        me.cssSet = false;

        if (me.saveDate) {
            me.draw();
        }
    }

    SBNewBattles.prototype.draw = function () {
        var me = this,
            tpl = '<div class="wes-sb-new"><div class="b-sidebar-widget clearfix">' +
                '<div class="b-sidebar-widget_inner" style="text-align: center; padding: 15px;">' +
                '<h2 class="b-sidebar-widget_title" id="sb-nb-title">' + _('blockNewBat') + '</h2>' +
                '<div><span id="sb-rb"></span>' +
                '<span id="sb-nw" style="padding-left: 10px;"></span>' +
                '<span id="sb-rw"></span></div><br>' +
                '<div class="currency-all" style="display:none;"><span class="currency-gold" id="sb-gold" style="margin: 10px; display: none;"></span>' +
                '<span class="currency-credit" id="sb-credit" style="margin: 10px; display: none;"></span>' +
                '<span class="currency-experience" id="sb-experience" style="margin: 10px; display: none;"></span></div><br>' +
                '<table class="us-ratings" style="width: 100%;"><tr>' +
                '<td width="20%" class="us-ratings-head"><a target="_blank" ' +
                'href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '">WN8</a></td>' +
                '<td width="20%" class="us-ratings-head"><a target="_blank" ' +
                'href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '">WN6</a></td>' +
                '<td width="20%" class="us-ratings-head"><a target="_blank" ' +
                'href="http://wot-news.com/index.php/stat/calc/ru/ru/' + wesAccount.userName + '">RE</a></td>' +
                '<td width="20%" class="us-ratings-head"><a target="_blank" ' +
                'href="http://www.noobmeter.com/player/ru/' + wesAccount.userName + '/' + wesAccount.userId + '/">PR</a></td>' +
                '</tr><tr>' +
                '<td width="20%" id="sb-wn8"></td><td width="20%" id="sb-wn6"></td><td width="20%" id="sb-re"></td><td width="20%" id="sb-pr"></td>' +
                '</tr><tr>' +
                '<td width="20%" id="sb-xwn8"></td><td width="20%" id="sb-xwn6"></td><td width="20%" id="sb-xre"></td><td width="20%" id="sb-xpr"></td>' +
                '</tr></table><br><span>' + _('medals') + ':</span><br>' +
                '<span id="sb-medals"></span><br>' +
//                '<span>' + _('blockVeh') + ':</span><br>' +
//                '<span id="sb-tanks"></span>' +
                '</div></div></div>';

        $('div.l-sidebar').append(tpl);

        var $elem = $('div.wes-sb-new');
        me.positionTop = $elem.offset().top;
        me.$elem = $elem;
        me.width = $elem.innerWidth();
        $(window).scroll(function (e) {
            me.onScroll(e);
        });
    };
    
    SBNewBattles.prototype.onScroll = function (e) {
        var me = this,
            offY = $(window).scrollTop();
		
        if (offY > me.positionTop) {
            if (!me.cssSet) {
                me.$elem.css({
                    'position': 'fixed',
                    'top': '10px',
                    'width': me.width
                });
                me.cssSet = true;
            }
        } else {
            if (me.cssSet) {
                me.$elem.css({
                    'position': 'relative',
                    'top': 0
                });
                me.cssSet = false;
            }
        }
    };

    //Тут функции и методы для отрисовки на странице профиля
    wesAccount = {
        'userId': parseInt(window.location.href.match(/\/(\d+)/)[1]),
        'userName': document.getElementById("js-profile-name").innerHTML,
        'curApiStat': false,
        'curApiTanks': false,
        'curStat': {},
        addScriptInfo: function () {
            var sInfoDiv = document.createElement("div"), timeDiv = $('.b-profile-name')[0];
            sInfoDiv.innerHTML = '<p>' + _('scriptVersion') + ' <br></p><p>' +
                '<a href="#" id="wes-show-settings">' + _('settings') + '</a></p>';
            timeDiv.appendChild(sInfoDiv);
        },
        paintUsersNewBattles: function (resp) {
            if (resp['status'] === 'ok') {
                var keys = Object.keys(resp['data']), key, i, lastStat, oldBat,
                    newBat, oldWin, newWin, newB, newW, nDate, mText = '', saveStat = false;
                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    if (parseInt(key) !== wesSettings.myID) {
                        mText = '';
                        lastStat = wesGeneral.getUserLastStat(key);
                        if (lastStat) {
                            oldBat = parseInt(lastStat['battles']);
                            newBat = parseInt(resp['data'][key]['statistics']['all']['battles']);
                            oldWin = parseInt(lastStat['wins']);
                            newWin = parseInt(resp['data'][key]['statistics']['all']['wins']);
                            newB = newBat - oldBat;
                            newW = newWin - oldWin;
                            if (oldBat !== newBat) {
                                $('#wes-menu-' + key).css({
                                    'background-position': '0 10px'
                                });
                                $('#wes-menu-' + key + ' > span').append(' <span class="wes-s-newcounter">+' + newB + '</span>');
                            }
                            mText += '<p>' + _("player") + ': ' + resp['data'][key]['nickname'] + '</p>';
                            if (wesSettings['players'][key].startsWith(_("player"))) {
                                wesSettings['players'][key] = resp['data'][key]['nickname'];
                                saveStat = true;
                            }
                            nDate = new Date(parseInt(lastStat['time']));
                            mText += '<p>' + _("saved") + ': ' + wesGeneral.formattedDate(nDate) + '</p>';
                            nDate = new Date(parseInt(resp['data'][key]['updated_at']) * 1000);
                            mText += '<p>' + _("lastUpdate") + ' ' + wesGeneral.formattedDate(nDate) + '</p>';
                            nDate = new Date(parseInt(resp['data'][key]['last_battle_time']) * 1000);
                            mText += '<p>' + _("lastBattle") + ' ' + wesGeneral.formattedDate(nDate) + '</p>';
                            if (newB > 0) {
                                mText += '<p>' + _("battles") + ': ' + newB + '</p>';
                                mText += '<p>' + _("wins") + ': ' + newW + ' (' + (newW / newB * 100).toFixed(2) + '%)</p>';
                            }
                            $('#wes-menu-' + key + '_tooltip').html(mText);
                        }
                    }
                }
                if (saveStat) wesGeneral.setLSData('wesSettings', wesSettings);
            }
        },
        getUsersNewBattles: function () {
            var uIds = Object.keys(wesSettings.players).join(",");
            if (uIds !== '')
                $.get("http://api." + document.location.host + "/wot/account/info/",
                    {
                        'application_id': wesApiKey,
                        'type': "jsonp",
                        'callback': "?",
                        "account_id": uIds
                    }, this.paintUsersNewBattles, "json");
        },
        createUserMenu: function () {
            var mtext = "<li><a id='wes-save-stat' href='#'>" + _("saveStat") + "</a></li>",
                uIds = Object.keys(wesSettings.players),
                serv = wesGeneral.getServ(),
                key, i, fake_div;
            if (uIds.length > 0) {
              mtext += "<br>";
              for (i = 0; i < uIds.length; i++) {
                key = parseInt(uIds[i]);
                mtext += '<li><a id="wes-menu-' + key + '" class="js-tooltip" href="http://worldoftanks.' +
                         serv + '/community/accounts/' + key + '/">' +
                         (key === this.userId ? '<span style="color:green;">' : '<span>') + wesSettings.players[key] +
                         '</span></a><div class="b-tooltip-main" id="wes-menu-' + key + '_tooltip"></div></li>';
              }
            }
            mtext += "<br>";
            if (wesSettings.players[this.userId])
              mtext += '<li><a id="wes-remove-stat" href="#">' + _("delStat") + '</a></li>';
            fake_div = document.createElement("div");
            fake_div.innerHTML = mtext;
            $(".b-context-menu-list__bottomindent")[0].appendChild(fake_div);
            this.getUsersNewBattles();
        },
        createChangeStat: function (statArr) {
            var tpl = '<p>' + _('statFrom') + ':  <a data-wshowed="0" href="#" class="b-link-fake b-link-fake__gray" id="show-wes-select">' +
                wesGeneral.formattedDate(new Date(statArr[statArr.length - 1]['time'])) + '</a>', i;
            tpl += '</p><div class="l-choose-dropdown js-date-popup" id="wes-select" style="display: none; left: 62.5px; top: 141.1667px;">' +
                '<ul class="b-choose-dropdown">';
            for (i = statArr.length - 1; i >= 0; i--) {
                tpl +=
                    '<li class="js-ch-li b-choose-dropdown_item js-date-popup-li' + ((i == statArr.length - 1) ? ' b-choose-dropdown_item__active' : '') + '">' +
                        '<a data-stind="' + i + '" class="b-choose-dropdown_link wes-ch-date" href="#">' +
                        '<span class="js-date-format-utc">' + wesGeneral.formattedDate(new Date(statArr[i]['time'])) + '</span></a></li>';
            }
            tpl += '</ul><div class="b-choose-dropdown_arrow"></div></div>';
            $('#wes-show-settings').parent().parent().after(tpl);
            $('#show-wes-select').click(function (e) {
                e.preventDefault();
                if ($(this).attr('data-wshowed') == 0) {
                    $('#wes-select').show("fast");
                    $(this).attr('data-wshowed', 1);
                } else {
                    $('#wes-select').hide("fast");
                    $(this).attr('data-wshowed', 0);
                }
            });
            $(document).click(function (event) {
                if ($(event.target).closest("#show-wes-select").length) return;
                $('#wes-select').hide("fast");
                $("#show-wes-select").attr('data-wshowed', 0);
                event.stopPropagation();
            });
            $('.wes-ch-date').click(function (e) {
                e.preventDefault();
                $('.js-ch-li').removeClass('b-choose-dropdown_item__active');
                $(this).parent().addClass('b-choose-dropdown_item__active');
                $('#show-wes-select').html($(this).find("span:first").html());
                wesAccount.paintCurPage(parseInt($(this).attr('data-stind')));
            });
        },
        fillCurStat: function () {
            function addData1(resp) {
                if (resp['status'] === 'ok') {
                    var keys = Object.keys(resp['data']), key, i, j;
                    for (i = 0; i < keys.length; i++) {
                        key = keys[i];
                        wesAccount.curApiStat = resp['data'][key];
                        var apikeys = Object.keys(resp['data'][key]['statistics']['all']), apikey;
                        for (j = 0; j < apikeys.length; j++) {
                            apikey = apikeys[j];
                            wesAccount.curStat[apikey] = resp['data'][key]['statistics']['all'][apikey];
                        }
                        for (j = 0; j < stTypeKeys.length; j++) {
                            apikey = stTypeKeys[j];
                            wesAccount.curStat[apikey] = resp['data'][key]['statistics'][apikey];
                            wesAccount.curStat[apikey]['tanks'] = {};
                        }
                        var cEl = document.getElementsByClassName("b-userblock-wrpr")[0].getElementsByClassName("currency-credit")[0];
                        cEl = cEl ? cEl.innerHTML : NaN;
                        wesAccount.curStat['credit'] = wesGeneral.toFl(cEl);
                        cEl = document.getElementsByClassName("b-userblock-wrpr")[0].getElementsByClassName("currency-experience")[0];
                        cEl = cEl ? cEl.innerHTML : NaN;
                        wesAccount.curStat['exp'] = wesGeneral.toFl(cEl);
                        cEl = document.getElementsByClassName("b-userblock-wrpr")[0].getElementsByClassName("currency-gold")[0];
                        cEl = cEl ? cEl.innerHTML : NaN;
                        wesAccount.curStat['gold'] = wesGeneral.toFl(cEl);
                        wesAccount.curStat['medals'] = {};
                        wesAccount.curStat['tanks'] = {};
                        wesAccount.curStat['time'] = (new Date()).getTime();
                        wesAccount.curStat['wgRating'] = parseInt(resp['data'][key]['global_rating']);
                    }
                    $.get("http://api." + document.location.host + "/wot/account/achievements/",
                        {
                            'application_id': wesApiKey,
                            'type': "jsonp",
                            'callback': "?",
                            "account_id": wesAccount.userId
                        }, addData2, "json");
                }
            }

            function addData2(resp) {
                if (resp['status'] === 'ok') {
                    var keys = Object.keys(resp['data']), key, i;
                    for (i = 0; i < keys.length; i++) {
                        key = keys[i];
                        for (var mkey in resp['data'][key]['achievements'])
                            wesAccount.curStat['medals'][mkey] = parseInt(resp['data'][key]['achievements'][mkey]);
                        for (mkey in resp['data'][key]['max_series'])
                            wesAccount.curStat['medals'][mkey] = parseInt(resp['data'][key]['max_series'][mkey]);
                    }
                    
                    $.get("http://api." + document.location.host + "/wot/tanks/stats/",
                        {
                            'application_id': wesApiKey,
                            'type': "jsonp",
                            'callback': "?",
                            "account_id": wesAccount.userId,
                            "fields": "tank_id, all.battles, all.wins, all.damage_dealt, all.spotted, all.frags, all.capture_points, all.dropped_capture_points," + 
                                      "clan.battles, clan.wins, clan.damage_dealt, clan.spotted, clan.frags, clan.capture_points, clan.dropped_capture_points," + 
                                      "company.battles, company.wins, company.damage_dealt, company.spotted, company.frags, company.capture_points, company.dropped_capture_points," + 
                                      "stronghold_skirmish.battles, stronghold_skirmish.wins, stronghold_skirmish.damage_dealt, stronghold_skirmish.spotted, stronghold_skirmish.frags, stronghold_skirmish.capture_points, stronghold_skirmish.dropped_capture_points," + 
                                      "stronghold_defense.battles, stronghold_defense.wins, stronghold_defense.damage_dealt, stronghold_defense.spotted, stronghold_defense.frags, stronghold_defense.capture_points, stronghold_defense.dropped_capture_points," + 
                                      "team.battles, team.wins, team.damage_dealt, team.spotted, team.frags, team.capture_points, team.dropped_capture_points",
                        }, addData3, "json");
                }
            }

            function addData3(resp) {
                if (resp['status'] === 'ok') {
                    wesAccount.curApiTanks = resp;
                    var keys = Object.keys(resp['data']), key, i, j, k, tank, apikey;
                    for (i = 0; i < keys.length; i++) {
                        key = keys[i];
                        for (j = 0; j < resp['data'][key].length; j++) {
                          tank = resp['data'][key][j];
                          if (parseInt(tank['all']['battles']) > 0) {
                            wesAccount.curStat['tanks'][parseInt(tank['tank_id'])] = {
                              'b': tank['all']['battles'],
                              'w': tank['all']['wins'],
                              'd': tank['all']['damage_dealt'],
                              's': tank['all']['spotted'],
                              'f': tank['all']['frags'],
                              'c': tank['all']['capture_points'],
                              'p': tank['all']['dropped_capture_points']
                            };
                          };
                          for (k = 0; k < stTypeKeys.length; k++) {
                            apikey = stTypeKeys[k];
                            if (parseInt(tank[apikey]['battles']) > 0) {
                              wesAccount.curStat[apikey]['tanks'][parseInt(tank['tank_id'])] = {
                                'b': tank[apikey]['battles'],
                                'w': tank[apikey]['wins'],
                                'd': tank[apikey]['damage_dealt'],
                                's': tank[apikey]['spotted'],
                                'f': tank[apikey]['frags'],
                                'c': tank[apikey]['capture_points'],
                                'p': tank[apikey]['dropped_capture_points']
                              };
                            }
                          }
                        }
                    }
                    $.get('http://wot-noobs.ru/nubomer/?nick=' + wesAccount.userName
                        ,function (data) {
                          var regexp = /<div class="kpd">(\d*\.*\d*)+<\/div>/gi,
                          res = regexp.exec(data);
                          if (res && res.length > 0) {
                          wesAccount.curStat['noobRat'] = Number(res[1]);
                          wesAccount.main();
                          }
                         }
                        , "html");
                }
            }

            $.get("http://api." + document.location.host + "/wot/account/info/",
                {
                    'application_id': wesApiKey,
                    'type': "jsonp",
                    'callback': "?",
                    "account_id": wesAccount.userId
                }, addData1, "json");
        },
        FoundProc: function (Wins, Battles, digit, inv) {
            var curPerc = (Wins / Battles * 100.0),
                color = "90ffff",
                nextD3 = Math.ceil(Wins / Battles * 100 + 0.5) - 0.5,
                nextD1 = nextD3 - 1,
                nextD2 = nextD3 - 0.5,
                need_b1 = Math.floor(Battles - Wins * 100 / nextD1);
            if (100 * Wins / Battles > nextD2)
                var need_b2 = Math.floor(Battles - Wins * 100 / nextD2);
            else
                need_b2 = Math.ceil((nextD2 * Battles - Wins * 100) / (100 - nextD2));
            var need_b3 = Math.ceil((nextD3 * Battles - Wins * 100) / (100 - nextD3));
            if (inv) {
                var v = 100 - curPerc;
            } else {
                v = curPerc;
            }
            if (digit)
                curPerc = curPerc.toFixed(digit);
            if (v < 101)
                color = "D042F3";
            if (v < 64.9)
                color = "02C9B3";
            if (v < 56.9)
                color = "60FF00";
            if (v < 51.9)
                color = "F8F400";
            if (v < 48.9)
                color = "FE7903";
            if (v < 46.9)
                color = "FE0E00";
            return ["<font color='" + color + "'>" + curPerc + "%</font>", Wins + "<font color='red'>/</font> <font color='green'>" + Battles + "</font><br>" + nextD1 + "% (" + need_b1 + ")<br>" + nextD2 + "% (" + need_b2 + ")<br>" + nextD3 + "% (" + need_b3 + ")"];
        },
        diffText: function (newVal, oldVal, fcol, withNewVal, inv) {
            var diff = parseFloat(newVal) - parseFloat(oldVal), tcol1, tcol2;
            if (fcol == undefined) {
                fcol = 2;
            }
            if (withNewVal == undefined) {
                withNewVal = true;
            }
            if (inv == undefined) {
                inv = false;
            }
            if (!diff || parseFloat(diff.toFixed(fcol)) == 0) {
                return (withNewVal ? newVal : '');
            }
            tcol1 = inv ? 'red' : 'green';
            tcol2 = inv ? 'green' : 'red';
            if (diff > 0) {
                return (withNewVal ? newVal : '') + '<span class="wes-s-newcounter" style="color:' + tcol1 + ';">+' + diff.toFixed(fcol) + '</span>';
            } else {
                return (withNewVal ? newVal : '') + '<span class="wes-s-newcounter" style="color: ' + tcol2 + ';">' + diff.toFixed(fcol) + '</span>';
            }
        },
        setRatingValue: function (wesRatingType, value, color, tooltip) {
          wesRatingType = wesRatingType.toLocaleLowerCase();
          color = color || 'default';
          var $span = $('span.wes-eff-' + wesRatingType);
          $span.html(value);
          if (color && color != 'default') {
            $span.css({'color': color});
          }
          if (tooltip) {
            this.createTooltip($span, tooltip);
          }
        },
        createTooltip: function (elem, tooltip) {
          var $elem = $(elem),
              hintName = $elem.attr('id') + '_tooltip';
          if (typeof tooltip === 'boolean' && !tooltip) {
            $('div.' + hintName).remove();
            $elem.removeClass('js-tooltip');
          } else if (typeof tooltip === 'string') {
            $elem.after('<div id="' + hintName + '" class="b-tooltip-main"><span>' +
                        tooltip + '</span></div>'
                       ).addClass('js-tooltip');
          }
        },
        paintCurPage: function (statIndex) {
            
            var curRating = wesGeneral.ratings(wesAccount.curStat),
                oldStat, 
                oldRating, 
                oldDaypassed, 
                savedStat = wesGeneral.getLSData('wes_' + this.userId),
                newStat = false,
                daypassed = (new Date() - new Date(document.getElementsByClassName("js-date-format")[0].getAttribute("data-timestamp") * 1000)) / 1000 / 60 / 60 / 24,
                myStat = wesGeneral.getLSData('wes_' + wesSettings.myID),
                myLastStat = myStat ? myStat[myStat.length - 1] : false;
                myRating = myLastStat? wesGeneral.ratings(myLastStat) : false;
             
            if (statIndex >= 0) {
                oldStat = savedStat[statIndex];
            } else {
                oldStat = savedStat ? savedStat[savedStat.length - 1] : false;
            }
            
            oldDaypassed = oldStat ? (oldStat['time'] - new Date(document.getElementsByClassName("js-date-format")[0].getAttribute("data-timestamp") * 1000)) / 1000 / 60 / 60 / 24 : false;
            oldRating = (oldStat && (wesAccount.curStat.battles > oldStat.battles)) ? wesGeneral.ratings(oldStat) : curRating;
            
            if (wesAccount.curStat.battles == oldStat.battles) {
              $('div.wes-sb-new').css({'display': 'none'});
              $('div.wes-s-expander[data-expand=newBat]').css({'display': 'none'});
              $('div.wes-b-newbat').parent().css({'display': 'none'});
            } else {
              $('div.wes-sb-new').css({'display': 'block'});
              $('div.wes-s-expander[data-expand=newBat]').css({'display': 'block'});
              $('div.wes-b-newbat').parent().css({'display': 'block'});
            }
            
            if (this.userId == wesSettings.myID || myStat == undefined) {
              $('div.wes-s-expander[data-expand=compStat]').css({'display': 'none'});
              $('div.wes-b-compstat').parent().css({'display': 'none'});
            } else {
              $('div.wes-s-expander[data-expand=compStat]').css({'display': 'block'});
              $('div.wes-b-compstat').parent().css({'display': 'block'});
            }
            
            if (oldStat) {
                $('#sb-nb-title').html(_('blockNewBat'));
                $('#sb-rb').html(_('rBattles') + ': ' + (wesAccount.curStat.battles - oldStat.battles));
                $('#sb-nw').html(_('nWin') + ': ' + (wesAccount.curStat.wins - oldStat.wins));
                if (wesAccount.curStat.wins - oldStat.wins != 0) {
                    newStat = {'tanks': {}, 'wgRating': 0,
                        'clan': {
                            'battles': 0, 'capture_points': 0, 'damage_dealt': 0, 'dropped_capture_points': 0, 'draws': 0, 'frags': 0, 'spotted': 0,
                            'wins': 0, 'xp': 0
                        }, 'company': {
                            'battles': 0, 'capture_points': 0, 'damage_dealt': 0, 'dropped_capture_points': 0, 'draws': 0, 'frags': 0, 'spotted': 0,
                            'wins': 0, 'xp': 0
                        }};
                    newStat['wins'] = parseInt(wesAccount.curStat.wins) - parseInt(oldStat.wins);
                    newStat['battles'] = parseInt(wesAccount.curStat.battles) - parseInt(oldStat.battles);
                    newStat['capture_points'] = parseInt(wesAccount.curStat.capture_points) - parseInt(oldStat.capture_points);
                    newStat['damage_dealt'] = parseInt(wesAccount.curStat.damage_dealt) - parseInt(oldStat.damage_dealt);
                    newStat['dropped_capture_points'] = parseInt(wesAccount.curStat.dropped_capture_points) - parseInt(oldStat.dropped_capture_points);
                    newStat['frags'] = parseInt(wesAccount.curStat.frags) - parseInt(oldStat.frags);
                    newStat['spotted'] = parseInt(wesAccount.curStat.spotted) - parseInt(oldStat.spotted);
                    newStat['xp'] = parseInt(wesAccount.curStat.xp) - parseInt(oldStat.xp);
                    var newWinVal = this.FoundProc(newStat['wins'], newStat['battles'], 2, false);
                    $('#sb-rw').html(' (' + newWinVal[0] + ')');
                    var medalsText = '<ul class="b-achivements clearfix" style="background: none; margin: 0 -10px 0 0; padding: 0;">',
                        tanksText = '<ul class="b-achivements clearfix" style="background: none; margin: 0 -10px 0 0; padding: 0;">';
                    if (wesAccount.curStat.medals) {
                      
                      for (var medal in wesAccount.curStat.medals) {
                        var medLi = $('#js-achivement-' + medal),
                            medToolip = $('#js-achivement-' + medal + '_tooltip');
                        if (medLi && medToolip) {
                          var cMCount = 0;
                          
                          if (oldStat.medals && medal in oldStat.medals && wesAccount.curStat.medals[medal] != oldStat.medals[medal]) {
                            cMCount = parseInt(wesAccount.curStat.medals[medal]) - parseInt(oldStat.medals[medal]);
                          } else if (oldStat.medals == undefined || !(medal in oldStat.medals)){
                            cMCount = parseInt(wesAccount.curStat.medals[medal]);
                          }
                          if (cMCount > 0) {
                            medalsText += '<li id="wes-sb-' + medal + '" class="b-achivements_item js-tooltip" style="margin: 10px 10px 0 0;">' +
                                          '<img width="34" height="36" src="' + medLi.find('img:first').attr('src') + '">' +
                                          '<div class="b-achivements_wrpr"><span class="b-achivements_num">' +
                                          ((cMCount > 1) ? '<span style="font-size: 60%;">' + cMCount + '</span>' : '') + 
                                          '</span></div>' +
                                          '</li><div class="b-tooltip-main" id="wes-sb-' + medal + '_tooltip">' + medToolip.html() + '</div>';
                          }
                        }
                      }
                    }
                    if (oldStat.tanks != undefined) {
                      for (var tank in wesAccount.curStat.tanks) {
                        var tankTd = $('tr[data-vehicle-cd=' + tank + ']').prev(), newBattles = 0, newWins = 0;
                        if (tank in oldStat.tanks) {
                          newBattles = parseInt(wesAccount.curStat.tanks[tank].b) - parseInt(oldStat.tanks[tank].b);
                          newWins = parseInt(wesAccount.curStat.tanks[tank].w) - parseInt(oldStat.tanks[tank].w);
                        } else {
                          newBattles = parseInt(wesAccount.curStat.tanks[tank].b);
                          newWins = parseInt(wesAccount.curStat.tanks[tank].w)
                        }
                        if (tankTd && newBattles > 0) {
                          newStat['tanks'][tank] = {
                            'b': parseInt(wesAccount.curStat.tanks[tank].b) - ((tank in oldStat.tanks) ? parseInt(oldStat.tanks[tank].b) : 0),
                            'w': parseInt(wesAccount.curStat.tanks[tank].w) - ((tank in oldStat.tanks) ? parseInt(oldStat.tanks[tank].w) : 0),
                            'd': parseInt(wesAccount.curStat.tanks[tank].d) - ((tank in oldStat.tanks) ? parseInt(oldStat.tanks[tank].d) : 0),
                            's': parseInt(wesAccount.curStat.tanks[tank].s) - ((tank in oldStat.tanks) ? parseInt(oldStat.tanks[tank].s) : 0),
                            'f': parseInt(wesAccount.curStat.tanks[tank].f) - ((tank in oldStat.tanks) ? parseInt(oldStat.tanks[tank].f) : 0),
                            'c': parseInt(wesAccount.curStat.tanks[tank].c) - ((tank in oldStat.tanks) ? parseInt(oldStat.tanks[tank].c) : 0),
                            'p': parseInt(wesAccount.curStat.tanks[tank].p) - ((tank in oldStat.tanks) ? parseInt(oldStat.tanks[tank].p) : 0)
                            
                          };
                          var winVal = this.FoundProc(newWins, newBattles, 2, false);
                          tanksText +=  '<li id="wes-sb-tank-' + tank + '" class="b-achivements_item js-tooltip" style="margin: 10px 10px 4px 0; padding-bottom: 12px;">' +
                                        '<img width="61" height="17" src="' + tankTd.find('td:first').find('img:first').attr('src') + '">' +
                                        '<div class="b-achivements_wrpr" style="bottom: -2px;"><span class="b-achivements_num">' +
                                        '<span style="font-size: 60%;">' + newWins + '/' + newBattles + ' (' + winVal[0] + ')</span></span></div>' +
                                        '</li><div class="b-tooltip-main" id="wes-sb-tank-' + tank + '_tooltip">' + tankTd.find('td:first').find('.b-name-vehicle').html() + '</div>';
                        }
                      }
                    }
                    medalsText += '</ul>';
                    tanksText += '</ul>';
                    $('#sb-medals').html(medalsText);
//                    $('#sb-tanks').html(tanksText);
                    var newRating = wesGeneral.ratings(newStat);
                    $('#sb-wn8').html('<span style="color: #' + newRating['wn8']['color'] + '">' + newRating['wn8']['value'] + '</span>');
                    $('#sb-wn6').html('<span style="color: #' + newRating['wn6']['color'] + '">' + newRating['wn6']['value'] + '</span>');
                    $('#sb-re').html('<span style="color: #' + newRating['eff']['color'] + '">' + newRating['eff']['value'] + '</span>');
                    $('#sb-pr').html('<span style="color: #' + newRating['pr']['color'] + '">' + newRating['pr']['value'] + '</span>');
                    $('#sb-xwn8').html('<span style="color: #' + newRating['wn8']['color'] + '">' + newRating['wn8']['xvm'] + '</span>');
                    $('#sb-xwn6').html('<span style="color: #' + newRating['wn6']['color'] + '">' + newRating['wn6']['xvm'] + '</span>');
                    $('#sb-xre').html('<span style="color: #' + newRating['eff']['color'] + '">' + newRating['eff']['xvm'] + '</span>');
                    $('#sb-xpr').html('<span style="color: #' + newRating['pr']['color'] + '">' + newRating['pr']['xvm'] + '</span>');
                }
                if (oldStat['gold'] && wesAccount.curStat['gold']) {
                    var curVal = parseInt(wesAccount.curStat['gold']) - parseInt(oldStat['gold']);
                    if (curVal) {
                        curVal = curVal > 0 ? '+' + curVal : '' + curVal;
                        $('#sb-gold').html(curVal).show();
                    }
                }
                if (oldStat['credit'] && wesAccount.curStat['credit']) {
                    curVal = parseInt(wesAccount.curStat['credit']) - parseInt(oldStat['credit']);
                    if (curVal) {
                        curVal = curVal > 0 ? '+' + curVal : '' + curVal;
                        $('#sb-credit').html(curVal).show();
                    }
                }
                if (oldStat['exp'] && wesAccount.curStat['exp']) {
                    curVal = parseInt(wesAccount.curStat['exp']) - parseInt(oldStat['exp']);
                    if (curVal) {
                        curVal = curVal > 0 ? '+' + curVal : '' + curVal;
                        $('#sb-experience').html(curVal).show();
                    }
                }
                if ((oldStat['gold'] && wesAccount.curStat['gold']) ||
                    (oldStat['credit'] && wesAccount.curStat['credit']) ||
                    (oldStat['exp'] && wesAccount.curStat['exp'])) {
                    $('div.currency-all').show();
                }
            }
            
            this.setRatingValue('rWn8',
                oldRating ? this.diffText(curRating['wn8']['value'], oldRating['wn8']['value']) : curRating['wn8']['value'],
                '#' + curRating['wn8']['color'], curRating['wn8']['stepToNL']);
            this.setRatingValue('rWn6',
                oldRating ? this.diffText(curRating['wn6']['value'], oldRating['wn6']['value']) : curRating['wn6']['value'],
                '#' + curRating['wn6']['color'], curRating['wn6']['stepToNL']);
            this.setRatingValue('rEff',
                oldRating ? this.diffText(curRating['eff']['value'], oldRating['eff']['value']) : curRating['eff']['value'],
                '#' + curRating['eff']['color'], curRating['eff']['stepToNL']);
            
            this.setRatingValue('rKwg',
                oldRating ? this.diffText(curRating['wg']['value'], oldRating['wg']['value'], 0) : curRating['wg']['value'],
                '#' + curRating['wg']['color'], curRating['wg']['stepToNL']);
            this.setRatingValue('rNag',
                oldRating ? this.diffText(curRating['pr']['value'], oldRating['pr']['value']) : curRating['pr']['value'],
                '#' + curRating['pr']['color'], curRating['pr']['stepToNL']);
            this.setRatingValue('rArmor',
                oldRating ? this.diffText(curRating['bs']['value'], oldRating['bs']['value']) : curRating['bs']['value'],
                '#' + curRating['bs']['color'], curRating['bs']['stepToNL']);
            
            this.setRatingValue('rNoob',
                oldRating ? this.diffText(curRating['noob']['value'], oldRating['noob']['value']) : curRating['noob']['value'],
                '#' + curRating['noob']['color'], curRating['noob']['stepToNL']);

            this.setRatingValue('xrWn8',
                oldRating ? this.diffText(curRating['wn8']['xvm'], oldRating['wn8']['xvm']) : curRating['wn8']['xvm'],
                '#' + curRating['wn8']['color'], curRating['wn8']['xvmStepToNL']);
            this.setRatingValue('xrWn6',
                oldRating ? this.diffText(curRating['wn6']['xvm'], oldRating['wn6']['xvm']) : curRating['wn6']['xvm'],
                '#' + curRating['wn6']['color'], curRating['wn6']['xvmStepToNL']);
            this.setRatingValue('xrEff',
                oldRating ? this.diffText(curRating['eff']['xvm'], oldRating['eff']['xvm']) : curRating['eff']['xvm'],
                '#' + curRating['eff']['color'], curRating['eff']['xvmStepToNL']);
            
            this.setRatingValue('xrKwg',
                oldRating ? this.diffText(curRating['wg']['xvm'], oldRating['wg']['xvm']) : curRating['wg']['xvm'],
                '#' + curRating['wg']['color'], curRating['wg']['xvmStepToNL']);
            this.setRatingValue('xrNag',
                oldRating ? this.diffText(curRating['pr']['xvm'], oldRating['pr']['xvm']) : curRating['pr']['xvm'],
                '#' + curRating['pr']['color'], curRating['pr']['xvmStepToNL']);
            this.setRatingValue('xrArmor',
                oldRating ? this.diffText(curRating['bs']['xvm'], oldRating['bs']['xvm']) : curRating['bs']['xvm'],
                '#' + curRating['bs']['color'], curRating['bs']['xvmStepToNL']);

            this.setRatingValue('xrNoob',
                oldRating ? this.diffText(curRating['noob']['xvm'], oldRating['noob']['xvm']) : curRating['noob']['xvm'],
                '#' + curRating['noob']['color'], curRating['noob']['xvmStepToNL']);
                
            this.setRatingValue('rBattles',
                oldStat ? this.diffText(wesAccount.curStat.battles, oldStat.battles, 0) : wesAccount.curStat.battles);
            this.setRatingValue('rBatteDay',
                oldStat ? this.diffText((wesAccount.curStat.battles / daypassed).toFixed(2), (oldStat.battles / oldDaypassed).toFixed(2)) : (wesAccount.curStat.battles / daypassed).toFixed(2),
                '', 'Дней: ' + daypassed.toFixed());
            this.setRatingValue('rMedLvl',
                oldRating ? this.diffText(curRating.avg.toFixed(2), oldRating.avg.toFixed(2)) : curRating.avg.toFixed(2));
            winVal = this.FoundProc(wesAccount.curStat.wins, wesAccount.curStat.battles, 2, false);
            this.setRatingValue('rWin',
                winVal[0] + (oldStat ?
                    this.diffText(wesAccount.curStat.wins / wesAccount.curStat.battles * 100.0, oldStat.wins / oldStat.battles * 100.0, 2, false) : ''),
                '', winVal[1]);
            var losB = wesAccount.curStat.battles - wesAccount.curStat.wins - wesAccount.curStat.draws,
                looseVal = this.FoundProc(losB, wesAccount.curStat.battles, 2, true),
                oldLosB = oldStat ? oldStat.battles - oldStat.wins - oldStat.draws : 0;
            this.setRatingValue('rLoose',
                looseVal[0] + (oldStat ?
                    this.diffText(losB / wesAccount.curStat.battles * 100.0, oldLosB / oldStat.battles * 100.0, 2, false, true) : ''),
                '', looseVal[1]);
            this.setRatingValue('rSurv',
                (wesAccount.curStat.survived_battles / wesAccount.curStat.battles * 100.0).toFixed(2) + '%' + (oldStat ? this.diffText((wesAccount.curStat.survived_battles / wesAccount.curStat.battles * 100.0).toFixed(2), (oldStat.survived_battles / oldStat.battles * 100.0).toFixed(2), 2, false) : ''),
                '', wesAccount.curStat.survived_battles + '/' + wesAccount.curStat.battles);
            var hitsVal = this.FoundProc(wesAccount.curStat.hits, wesAccount.curStat.shots, 2, false);
            this.setRatingValue('rHit',
                hitsVal[0] + (oldStat ?
                    this.diffText(wesAccount.curStat.hits / wesAccount.curStat.shots * 100.0, oldStat.hits / oldStat.shots * 100.0, 2, false) : ''),
                '', hitsVal[1]);

            this.setRatingValue('rExp',
                oldStat ? this.diffText((wesAccount.curStat.xp / wesAccount.curStat.battles).toFixed(2), (oldStat.xp / oldStat.battles).toFixed(2)) : (wesAccount.curStat.xp / wesAccount.curStat.battles).toFixed(2),
                '', wesAccount.curStat.xp + '/' + wesAccount.curStat.battles);
            this.setRatingValue('rDamage',
                oldStat ? this.diffText((wesAccount.curStat.damage_dealt / wesAccount.curStat.battles).toFixed(2), (oldStat.damage_dealt / oldStat.battles).toFixed(2)) : (wesAccount.curStat.damage_dealt / wesAccount.curStat.battles).toFixed(2),
                '', wesAccount.curStat.damage_dealt + '/' + wesAccount.curStat.battles);
            this.setRatingValue('rFrag',
                oldStat ? this.diffText((wesAccount.curStat.frags / wesAccount.curStat.battles).toFixed(2), (oldStat.frags / oldStat.battles).toFixed(2)) : (wesAccount.curStat.frags / wesAccount.curStat.battles).toFixed(2),
                '', wesAccount.curStat.frags + '/' + wesAccount.curStat.battles);
            this.setRatingValue('rSpot',
                oldStat ? this.diffText((wesAccount.curStat.spotted / wesAccount.curStat.battles).toFixed(2), (oldStat.spotted / oldStat.battles).toFixed(2)) : (wesAccount.curStat.spotted / wesAccount.curStat.battles).toFixed(2),
                '', wesAccount.curStat.spotted + '/' + wesAccount.curStat.battles);
            this.setRatingValue('rCap',
                oldStat ? this.diffText((wesAccount.curStat.capture_points / wesAccount.curStat.battles).toFixed(2), (oldStat.capture_points / oldStat.battles).toFixed(2)) : (wesAccount.curStat.capture_points / wesAccount.curStat.battles).toFixed(2),
                '', wesAccount.curStat.capture_points + '/' + wesAccount.curStat.battles);
            this.setRatingValue('rDeff',
                oldStat ? this.diffText((wesAccount.curStat.dropped_capture_points / wesAccount.curStat.battles).toFixed(2), (oldStat.dropped_capture_points / oldStat.battles).toFixed(2)) : (wesAccount.curStat.dropped_capture_points / wesAccount.curStat.battles).toFixed(2),
                '', wesAccount.curStat.dropped_capture_points + '/' + wesAccount.curStat.battles);
            var nDate = wesGeneral.formattedDate(new Date(parseInt(wesAccount.curApiStat['last_battle_time']) * 1000));
            this.setRatingValue('lastBattle', nDate);
            nDate = wesGeneral.formattedDate(new Date(parseInt(wesAccount.curApiStat['updated_at']) * 1000));
            this.setRatingValue('lastUpdate', nDate);
            
            this.setRatingValue('maxDamage', wesAccount.curApiStat['statistics']['all']['max_damage']);
            this.setRatingValue('maxFrags', wesAccount.curApiStat['statistics']['all']['max_frags']);
            this.setRatingValue('maxXp', wesAccount.curApiStat['statistics']['all']['max_xp']);
            this.setRatingValue('treesCut', wesAccount.curApiStat['statistics']['trees_cut']);
            
            this.setRatingValue('nBattles__old', oldStat.battles);
            this.setRatingValue('nBattles__cur', wesAccount.curStat.battles);
            
            this.setRatingValue('nWin__old', oldStat.wins);
            this.setRatingValue('nWin__cur', wesAccount.curStat.wins);
            
            this.setRatingValue('nWinRatio__old', this.FoundProc(oldStat.wins, oldStat.battles, 2, false)[0]);
            this.setRatingValue('nWinRatio__cur', this.FoundProc(wesAccount.curStat.wins, wesAccount.curStat.battles, 2, false)[0]);
            
            this.setRatingValue('nExp__old', (oldStat.xp / oldStat.battles).toFixed(2));
            this.setRatingValue('nExp__cur', (wesAccount.curStat.xp / wesAccount.curStat.battles).toFixed(2));
            
            this.setRatingValue('nMedLvl__old', oldRating.avg.toFixed(2));
            this.setRatingValue('nMedLvl__cur', curRating.avg.toFixed(2));
            
            this.setRatingValue('nDamage__old', (oldStat.damage_dealt / oldStat.battles).toFixed(2));
            this.setRatingValue('nDamage__cur', (wesAccount.curStat.damage_dealt / wesAccount.curStat.battles).toFixed(2));
            
            this.setRatingValue('nFrag__old', (oldStat.frags / oldStat.battles).toFixed(2));
            this.setRatingValue('nFrag__cur', (wesAccount.curStat.frags / wesAccount.curStat.battles).toFixed(2));
            
            this.setRatingValue('nSpot__old', (oldStat.spotted / oldStat.battles).toFixed(2));
            this.setRatingValue('nSpot__cur', (wesAccount.curStat.spotted / wesAccount.curStat.battles).toFixed(2));
            
            this.setRatingValue('nCap__old', (oldStat.capture_points / oldStat.battles).toFixed(2));
            this.setRatingValue('nCap__cur', (wesAccount.curStat.capture_points / wesAccount.curStat.battles).toFixed(2));
            
            this.setRatingValue('nDeff__old', (oldStat.dropped_capture_points / oldStat.battles).toFixed(2));
            this.setRatingValue('nDeff__cur', (wesAccount.curStat.dropped_capture_points / wesAccount.curStat.battles).toFixed(2));
            
            if (newRating) {
              
              this.setRatingValue('nBattles__new', (wesAccount.curStat.battles - oldStat.battles));
              this.setRatingValue('nWin__new', (wesAccount.curStat.wins - oldStat.wins));
              this.setRatingValue('nWinRatio__new', this.FoundProc((wesAccount.curStat.wins - oldStat.wins), (wesAccount.curStat.battles - oldStat.battles), 2, false)[0] + this.diffText((wesAccount.curStat.wins - oldStat.wins) / (wesAccount.curStat.battles - oldStat.battles) * 100.0, oldStat.wins / oldStat.battles * 100.0, 2, false));
              this.setRatingValue('nExp__new', ((wesAccount.curStat.xp - oldStat.xp) / (wesAccount.curStat.battles - oldStat.battles)).toFixed(2) + this.diffText(((wesAccount.curStat.xp - oldStat.xp) / (wesAccount.curStat.battles - oldStat.battles)), (oldStat.xp / oldStat.battles), 2, false));
              this.setRatingValue('nMedLvl__new', newRating.avg.toFixed(2) + this.diffText(newRating.avg, oldRating.avg, 2, false));
              this.setRatingValue('nDamage__new', ((wesAccount.curStat.damage_dealt - oldStat.damage_dealt) / (wesAccount.curStat.battles - oldStat.battles)).toFixed(2) + this.diffText(((wesAccount.curStat.damage_dealt - oldStat.damage_dealt) / (wesAccount.curStat.battles - oldStat.battles)), (oldStat.damage_dealt / oldStat.battles), 2, false));
              this.setRatingValue('nFrag__new', ((wesAccount.curStat.frags - oldStat.frags) / (wesAccount.curStat.battles - oldStat.battles)).toFixed(2) + this.diffText(((wesAccount.curStat.frags - oldStat.frags) / (wesAccount.curStat.battles - oldStat.battles)), (oldStat.frags / oldStat.battles), 2, false));
              this.setRatingValue('nSpot__new', ((wesAccount.curStat.spotted - oldStat.spotted) / (wesAccount.curStat.battles - oldStat.battles)).toFixed(2) + this.diffText(((wesAccount.curStat.spotted - oldStat.spotted) / (wesAccount.curStat.battles - oldStat.battles)), (oldStat.spotted / oldStat.battles), 2, false));
              this.setRatingValue('nCap__new', ((wesAccount.curStat.capture_points - oldStat.capture_points) / (wesAccount.curStat.battles - oldStat.battles)).toFixed(2) + this.diffText(((wesAccount.curStat.capture_points - oldStat.capture_points) / (wesAccount.curStat.battles - oldStat.battles)), (oldStat.capture_points / oldStat.battles), 2, false));
              this.setRatingValue('nDeff__new', ((wesAccount.curStat.dropped_capture_points - oldStat.dropped_capture_points) / (wesAccount.curStat.battles - oldStat.battles)).toFixed(2) + this.diffText(((wesAccount.curStat.dropped_capture_points - oldStat.dropped_capture_points) / (wesAccount.curStat.battles - oldStat.battles)), (oldStat.dropped_capture_points / oldStat.battles), 2, false));
              this.setRatingValue('nEff__new', newRating['eff']['value'] + this.diffText(newRating['eff']['value'], oldRating['eff']['value'], 2, false), '#' + newRating['eff']['color'], newRating['eff']['stepToNL']); 
              this.setRatingValue('nWn6__new', newRating['wn6']['value'] + this.diffText(newRating['wn6']['value'], oldRating['wn6']['value'], 2, false), '#' + newRating['wn6']['color'], newRating['wn6']['stepToNL']);
              this.setRatingValue('nWn8__new', newRating['wn8']['value'] + this.diffText(newRating['wn8']['value'], oldRating['wn8']['value'], 2, false), '#' + newRating['wn8']['color'], newRating['wn8']['stepToNL']);
            };
            
            this.setRatingValue('nEff__old', oldRating['eff']['value'], '#' + oldRating['eff']['color'], oldRating['eff']['stepToNL']);
            this.setRatingValue('nEff__cur', curRating['eff']['value'], '#' + curRating['eff']['color'], curRating['eff']['stepToNL']);
            
            this.setRatingValue('nWn6__old', oldRating['wn6']['value'], '#' + oldRating['wn6']['color'], oldRating['wn6']['stepToNL']);
            this.setRatingValue('nWn6__cur', curRating['wn6']['value'], '#' + curRating['wn6']['color'], curRating['wn6']['stepToNL']);
            
            this.setRatingValue('nWn8__old', oldRating['wn8']['value'], '#' + oldRating['wn8']['color'], oldRating['wn8']['stepToNL']);
            this.setRatingValue('nWn8__cur', curRating['wn8']['value'], '#' + curRating['wn8']['color'], curRating['wn8']['stepToNL']);
            
            if (myLastStat) {
              this.setRatingValue('nBattles__my', myLastStat.battles + this.diffText(myLastStat.battles, wesAccount.curStat.battles, 0, false));
              this.setRatingValue('nWin__my', myLastStat.wins + this.diffText(myLastStat.wins, wesAccount.curStat.wins, 0, false));
              this.setRatingValue('nWinRatio__my', this.FoundProc(myLastStat.wins, myLastStat.battles, 2, false)[0] + this.diffText(myLastStat.wins / myLastStat.battles * 100.0, wesAccount.curStat.wins / wesAccount.curStat.battles * 100.0, 2, false));
              this.setRatingValue('nExp__my', (myLastStat.xp / myLastStat.battles).toFixed(2) + this.diffText((myLastStat.xp / myLastStat.battles), (wesAccount.curStat.xp / wesAccount.curStat.battles), 2, false));
              this.setRatingValue('nMedLvl__my', myRating.avg.toFixed(2) + this.diffText(myRating.avg, curRating.avg, 2, false));
              this.setRatingValue('nDamage__my', (myLastStat.damage_dealt / myLastStat.battles).toFixed(2) + this.diffText((myLastStat.damage_dealt / myLastStat.battles), (wesAccount.curStat.damage_dealt / wesAccount.curStat.battles), 2, false));
              this.setRatingValue('nFrag__my', (myLastStat.frags / myLastStat.battles).toFixed(2) + this.diffText((myLastStat.frags / myLastStat.battles), (wesAccount.curStat.frags / wesAccount.curStat.battles), 2, false));
              this.setRatingValue('nSpot__my', (myLastStat.spotted / myLastStat.battles).toFixed(2) + this.diffText((myLastStat.spotted / myLastStat.battles), (wesAccount.curStat.spotted / wesAccount.curStat.battles), 2, false));
              this.setRatingValue('nCap__my', (myLastStat.capture_points / myLastStat.battles).toFixed(2) + this.diffText((myLastStat.capture_points / myLastStat.battles), (wesAccount.curStat.capture_points / wesAccount.curStat.battles), 2, false));
              this.setRatingValue('nDeff__my', (myLastStat.dropped_capture_points / myLastStat.battles).toFixed(2) + this.diffText((myLastStat.dropped_capture_points / myLastStat.battles), (wesAccount.curStat.dropped_capture_points / wesAccount.curStat.battles), 2, false));
              this.setRatingValue('nEff__my', myRating['eff']['value'] + this.diffText(myRating['eff']['value'], curRating['eff']['value'], 2, false), '#' + myRating['eff']['color']);
              this.setRatingValue('nWn6__my', myRating['wn6']['value'] + this.diffText(myRating['wn6']['value'], curRating['wn6']['value'], 2, false), '#' + myRating['wn6']['color']);
              this.setRatingValue('nWn8__my', myRating['wn8']['value'] + this.diffText(myRating['wn8']['value'], curRating['wn8']['value'], 2, false), '#' + myRating['wn8']['color']);
            }
        },
        main: function () {
            var savedStat;
            if (wesSettings.myID === 0 && $('.current-page').length) {
              wesSettings.myID = this.userId;
              wesGeneral.setLSData('wesSettings', wesSettings);
            }
            wesAccount.wbeff = new WBEff();
            savedStat = wesGeneral.getLSData('wes_' + this.userId);
            
            if (savedStat && wesSettings.players[this.userId] == undefined) {
              wesSettings.players[this.userId] = this.userName;
              wesGeneral.setLSData('wesSettings', wesSettings);
            }
            
            this.addScriptInfo();
            this.createUserMenu();
            
            document.getElementsByClassName('b-userblock-wrpr')[0].style.marginBottom = '0px';
            
            new WrappableBlock('pers', {
              start: $('div.b-personal-link').parent().parent()
            });
            
            new WrappableBlock('speed', {
              start: 'div.b-user-block.b-user-block__sparks'
            });
            
            if ($('#js-knockout-fame-points').length) {
              new WrappableBlock('hall', {
                start: $('#js-knockout-fame-points').prev(),
                end: $('#js-knockout-fame-points').next().next().next()
              });
            } else if ($('p.b-fame-message').length){
              new WrappableBlock('hall', {
                start: $('p.b-fame-message').parent(),
                end: $('p.b-fame-message').parent().next()
              });
            }
            
            new WrappableBlock('achiev', {
              start: 'div.js-all-achievements',
              end: $('div.js-all-achievements').next()
            });
            
            new WrappableBlock('common', {
              start: $('div.b-result-classes').parent(),
              end: $('div.b-result-classes').parent().next()
            });
            
            new WrappableBlock('diagr', {
                start: 'div.b-diagrams-sector',
                end: $('div.b-diagrams-sector').next()
            });
            
            new WrappableBlock('rat', {
                start: '#js-knockout-ratings',
                end: $('#js-knockout-ratings').next()
            });
            
            new WrappableBlock('veh', {
                start: $('#js-vehicle-details-template').prev(),
                end: $('#js-vehicle-details-template').next().next().next()
            });
            
            if (savedStat) {
              wesAccount.sbnew = new SBNewBattles();
              wesAccount.wbnew = new WBNew();
            }
            
            wesAccount.compStat = new WBCompStat();
            
            if (savedStat) {
              this.createChangeStat(savedStat);
   
              var isChangedStat = false;
              for (i = savedStat.length - 1; i >= 0; i--) {
              
                for (j = 0; j < stTypeKeys.length; j++) {
                  var apikey;
                  apikey = stTypeKeys[j];
                  if (savedStat[i][apikey] != undefined && Array.isArray(savedStat[i][apikey]['tanks'])) {
                    if (savedStat[i][apikey]['tanks'].length > 0) {
                      savedStat[i][apikey]['tanks'] = savedStat[i][apikey]['tanks'].reduce(function(o, v, i) {
                        if (v) {
                          o[i] = v;
                        }
                        return o;
                      }, {});
                    } else {
                      savedStat[i][apikey]['tanks'] = {};
                    }
                    isChangedStat = true;
                  }
                  
                }
                
              }
              
              if (isChangedStat) {
                wesGeneral.setLSData('wes_' + wesAccount.userId, savedStat);
              }
   
            }
            
            this.paintCurPage(-1);
        }
    };
    
    //Основное тело скрипта
    $(document).ready(function () {
        $(document).on("click", "#wes-remove-stat", function (event) {
            event.preventDefault();
            if (confirm(_('confirmDelete'))) {
                wesGeneral.showWait(_("sWaitText"));
                wesGeneral.deleteLSData('wes_' + wesAccount.userId);
                for (var key in wesSettings.players) {
                    if (key == wesAccount.userId) {
                        delete  wesSettings.players[key];
                    }
                }
                wesGeneral.setLSData('wesSettings', wesSettings);
                window.location.reload();
            }
        });
        $(document).on("click", "#wes-save-stat", function (event) {
            event.preventDefault();
            wesGeneral.showWait(_("sWaitText"));
            var savedStat = wesGeneral.getLSData('wes_' + wesAccount.userId),
                lastStat = savedStat ? savedStat[savedStat.length - 1] : false;
            if (lastStat) {
              if (lastStat.battles == wesAccount.curStat.battles) {
                wesGeneral.hideWait();
                wesGeneral.showError(_('noNewBattles'));
              } else {
                savedStat.push(wesAccount.curStat);
                console.log(wesAccount.curStat);
                if (wesSettings.scount > 0 && savedStat.length > wesSettings.scount) {
                  savedStat.splice(0, savedStat.length - wesSettings.scount);
                }
                wesGeneral.setLSData('wes_' + wesAccount.userId, savedStat);
                window.location.reload();
              }
            } else {
              wesGeneral.setLSData('wes_' + wesAccount.userId, [wesAccount.curStat]);
              wesSettings.players[wesAccount.userId] = wesAccount.userName;
              wesGeneral.setLSData('wesSettings', wesSettings);
              window.location.reload();
            }
        });
        $(document).on("click", "#wes-close-error", function (event) {
            event.preventDefault();
            $('.wes-overlay').hide();
            $('#wes-error').hide();
        });
        $(document).on("click", "#wes-error-close", function (event) {
            event.preventDefault();
            $('.wes-overlay').hide();
            $('#wes-error').hide();
        });
        $(document).on("click", "#wes-show-settings", function (event) {
            event.preventDefault();
            var lsSize = wesGeneral.calculateCurrentLocalStorageSize(), uIds = Object.keys(wesSettings.players), i,
                key, sCount, serv = wesGeneral.getServ();
            wesGeneral.updateProgressBar('ls-size', lsSize, 5000);
            $('#wes-ls-size-text').html(_('lsSize') + ' ' +
                String(Math.round(lsSize / 5000 * 100)) + '% (' + String(lsSize) + 'Kb)');
            $("#wes-tab-content-3 > div")[0].innerHTML = '';
            for (i = 0; i < uIds.length; i++) {
                key = parseInt(uIds[i]);
                sCount = wesGeneral.getLSData('wes_' + key);
                if (sCount) sCount = sCount.length; else sCount = 0;
                //if (key !== wesSettings.myID)
                    $("#wes-tab-content-3 > div")[0].innerHTML += '<p>' +
                        '<a href="http://worldoftanks.' + serv + '/community/accounts/' + key +
                        '/" target="_blank">' + wesSettings.players[key] + '</a>' +
                        '<span style="padding-left: 5px;">(' + _("saveCount") + ': ' + sCount + '):</span>' +
                        '<input style="margin-left: 5px;width: 200px;" type="text" id="wes-settitngs-player-' + key + '" value="' + wesSettings.players[key] + '"></p>';
            }

            $('#wes-settings-save-count').val(wesSettings.scount);
            $('#wes-settings-graphs').val(wesSettings.graphs);
            $('#wes-settings-lang').val(wesSettings.locale);

            for (key in wesSettings.blocks) $('#wes-settings-block-' + key).val(wesSettings.blocks[key]);

            $('.wes-overlay').show();
            $('#wes-settings').show();
        });
        $(document).on("click", "#wes-close-settings", function (event) {
            event.preventDefault();
            $('.wes-overlay').hide();
            $('#wes-settings').hide();
        });
        $(document).on("click", ".wes-tabs span", function (event) {
            event.preventDefault();
            $('.wes-active-tab').removeClass('wes-active-tab');
            $(this).addClass('wes-active-tab');
            $('.wes-tab-content').hide();
            $('#wes-tab-content-' + $(this).attr('tabId')).show();
        });
        $(document).on("click", "#wes-settings-save", function (event) {
            event.preventDefault();
            wesGeneral.showWait(_("sWaitText"));

            var scount = $('#wes-settings-save-count').val(), key, stat;
            if (scount > 0 && scount < wesSettings.scount) {
                for (key in wesSettings.players) {
                    stat = wesGeneral.getLSData('wes_' + key);
                    if (stat && stat.length > scount) {
                        stat.splice(0, stat.length - scount);
                        wesGeneral.setLSData('wes_' + key, stat);
                    }
                }
            }
            wesSettings.scount = scount;
            wesSettings.locale = $('#wes-settings-lang').val();
            wesSettings.graphs = $('#wes-settings-graphs').val();
            for (key in wesSettings.players) {
                wesSettings.players[key] = $('#wes-settitngs-player-' + key).val();
            }
            for (key in wesSettings.blocks) {
                wesSettings.blocks[key] = $('#wes-settings-block-' + key).val();
            }

            wesGeneral.setLSData('wesSettings', wesSettings);
            window.location.reload();
        });
        $(document).on("wesGeneralReady", "#wes-wait", function (event) {
            event.preventDefault();
            if (!$(this).attr('wesGeneralReady')) {
                $(this).attr('wesGeneralReady', 1);
                if (window.location.href.indexOf("accounts") !== -1) {
                    //try {
                        wesAccount.fillCurStat();
                    //} catch (e) {
                    //    wesGeneral.showError(e.message + ': ' + e.lineNumber);
                    //}
                }
            }
        });
        if (window.location.host.startsWith("worldoftanks")) {
            //try {
                wesGeneral.main();
            //} catch (e) {
            //    wesGeneral.showError(e.message + ': ' + e.lineNumber);
            //}
        }
    });
    
//} catch (e) {
//    console.log(e.message + ': ' + e.lineNumber);
//}