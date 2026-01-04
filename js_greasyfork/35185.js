// ==UserScript==
// @name            ComfortablePlayingInGW
// @namespace       https://github.com/MyRequiem/comfortablePlayingInGW
// @description     Веселые плюшки для Gwars
// @id              comfortablePlayingInGW@MyRequiem
// @include         https://*gwars*
// @include         https://*ganjafoto*
// @include         http*://*ganjafile*
// @grant           none
// @license         MIT
// @version         1.176-200424
// @author          MyRequiem [https://www.gwars.io/info.php?id=2095458]
// @downloadURL https://update.greasyfork.org/scripts/35185/ComfortablePlayingInGW.user.js
// @updateURL https://update.greasyfork.org/scripts/35185/ComfortablePlayingInGW.meta.js
// ==/UserScript==

//     ______                ____           __        __    __
//    / ____/___  ____ ___  / __/___  _____/ /_____ _/ /_  / /__
//   / /   / __ \/ __ `__ \/ /_/ __ \/ ___/ __/ __ `/ __ \/ / _ \
//  / /___/ /_/ / / / / / / __/ /_/ / /  / /_/ /_/ / /_/ / /  __/
//  \____/\____/_/ /_/ /_/_/  \____/_/   \__/\__,_/_.___/_/\___/
//
//      ____  __            _                ____         _______       __
//     / __ \/ /___ ___  __(_)___  ____ _   /  _/___     / ____/ |     / /
//    / /_/ / / __ `/ / / / / __ \/ __ `/   / // __ \   / / __ | | /| / /
//   / ____/ / /_/ / /_/ / / / / / /_/ /  _/ // / / /  / /_/ / | |/ |/ /
//  /_/   /_/\__,_/\__, /_/_/ /_/\__, /  /___/_/ /_/   \____/  |__/|__/
//                /____/        /____/

// lint {{{1
/*global unsafeWindow */
/*jslint browser: true, maxlen: 80, regexp: true, vars: true, plusplus: true,
    continue: true, devel: true, nomen: true
*/

/*eslint-env browser */
/*eslint no-useless-escape: 'warn', linebreak-style: ['error', 'unix'],
    quotes: ['error', 'single'], semi: ['error', 'always'],
    eqeqeq: 'error', curly: 'error'
*/

/*jscs:disable requireMultipleVarDecl, requireVarDeclFirst */
/*jscs:disable disallowKeywords, disallowDanglingUnderscores */
/*jscs:disable validateIndentation */
// 1}}}

(function () {
    'use strict';

    /**
     * @class General {{{1
     * @constructor
     */
    var General = function () {
        /**
         * @property root
         * @type {Object}
         */
        this.root = this.getRoot();
        /**
         * @property doc
         * @type {Object}
         */
        this.doc = this.root.document;
        /**
         * @property loc
         * @type {String}
         */
        this.loc = this.root.location.href;
        /**
         * @property st
         * @type {Object}
         */
        this.st = this.root.localStorage;
        /**
         * @property cons
         * @type {Object}
         */
        this.cons = this.root.console;
        /**
         * @property version
         * @type {String}
         */
        this.version = '1.176-200424';
        /**
         * @property stString {{{2
         * @type {String}
         */
        this.stString = this.version +  // [0] - script version
                    /*
                    [1]  - initScript
                        [0]  - NotGiveCannabisLeaf
                        [1]  - AdditionForNavigationBar
                        [2]  - AdsFilter (удален)
                        [3]  - AdvBattleAll
                        [4]  - BlacklistHighlighting
                        [5]  - WorkPostGrenadesBroken
                        [6]  - ResourcesAndBonuses
                        [7]  - CritShotsAndLinksBtlLog
                        [8]  - DeleteSms
                        [9]  - FarmExperience
                        [10] - FarmTimer
                        [11] - ComfortableLinksForFarm (удален)
                        [12] - TimeNpc
                        [13] - AllPlantsOnFarm
                        [14] - GwMenu
                        [15] - InventoryPlus
                        [16] - CountBattles
                        [17] - GbCounter
                        [18] - BonusInfo (удален)
                        [19] - BuyHightech
                        [20] - NewsAndInvit
                        [21] - DoFilter (удален)
                        [22] - FilterResOnStat
                        [23] - FilterWarlistOne2One
                        [24] - FixSkills
                        [25] - FuckTheFarm
                        [26] - HistorySms
                        [27] - LinksToHighTech
                        [28] - GameMania
                        [29] - GosEnergoAtomFilter
                        [30] - SortSyndOnline
                        [31] - HousHealth
                        [32] - SortSyndWars (удален)
                        [33] - LinksInOne2One
                        [34] - One2OneCallerInfo
                        [35] - PersonalNPCNotifications
                        [36] - PortTimer
                        [37] - PortsAndTerminals
                        [38] - RangeWeapon
                        [39] - RentAndSale
                        [40] - ScanKarma
                        [41] - ScanPers
                        [42] - ShowInitMessOnForum
                        [43] - SearchUser
                        [44] - SkillCounters
                        [45] - SyndPtsAnalyser
                        [46] - SyndAnalyser
                        [47] - ShowMyAchievements
                        [48] - SyndPersInfo (удален)
                        [49] - SyndOnlineOnMainPage
                        [50] - TimeKarma
                        [51] - ImgPokemonsOnBattle
                        [52] - SoundSyndBattle
                        [53] - AdvForum
                        [54] - DelAndAddBlackSms
                        [55] - FilterGeneralFighting (удален)
                        [56] - Regeneration
                        [57] - ProfColor
                        [58] - CurrentQuestOnInfo
                        [59] - CommonBattleFilter
                        [60] - CalculateSyndLvl (удален)
                        [61] - PortsSyndLinks
                        [62] - BbCodeInMessages
                        [63] - ProfessionLevels */
                        '@||||||||||' +
                        '||||||||||' +
                        '||||||||||' +
                        '||||||||||' +
                        '||||||||||' +
                        '||||||||||' +
                        '|||' +
                    /*
                    [2]  - AdditionForNavigationBar
                        [0] - '{"linkName": ["href", "style"], ...}' */
                        '@' +
                    /*
                    [3]  - AdsFilter (удален)
                        [0] - остров (нет,Z,G: '', 1, 2)
                        [1] - фильтр по онлайну */
                        '@|' +
                    /*
                    [4]  - AdvBattleAll
                        # настройки
                        [0]  - таймаут обновления данных в бою
                        [1]  - таймаут обновления страницы, когда висим в заявке
                        # основные данные скрипта
                        [2]  - метод сортировки списка врагов (0 - 5)
                        [3]  - чекбокс "запомнить ход"
                        [4]  - чекбокс "не дублировать цель" (для двуруких)
                        # последний сделаный ход (если включено "запомнить ход")
                        [5]  - левая
                        [6]  - правая
                        [7]  - куда отходим
                        [8]  - кидаем грену или нет
                        [9]  - подходим или нет
                        [10] - чекбокс <Сказать своей команде>
                        # запоминаем ход в хранилище перед тем как сказать ход
                        [11] - номер в кого стреляем
                        [12] - направление левой руки
                        [13] - направление правой руки
                        [14] - куда отходим
                        [15] - кидаем грену или нет
                        [16] - подходим или нет
                        [17] - список выбора врагов (хэш: имя --> номер)
                        [18] - чекбокс "Говорить только левую руку"
                        [19] - общий навык
                        [20] - навык специалиста
                        [21] - звук при начале боя
                        [22] - звук при начале хода
                        [23] - чекбокс "Говорить только правую руку"
                        [24] - подствольник
                        [25] - показывать чекбокс "Сказать как координатор"
                        [26] - чекбокс "Сказать как координатор" отмечен
                        ### при нажатии на кнопку "Сказать ход":
                        [27] - не выводить имя противника
                        [28] - не выводить применяемые навыки */
                        '@||||||||||||||||||||||||||||' +
                    /*
                    [5]  - BlacklistHighlighting
                        [0]  - ID персов из ЧС ('id1,id2,...')
                        [1]  - блокировать ссылку принятия боя в одиночках? */
                        '@|' +
                    /*
                    [6]  - WorkPostGrenadesBroken
                        [0]  - звук при получении почты/посылки (проигран, нет)
                        [1]  - звук по окончании работы (проигран или нет)
                        [2]  - отображать время работы
                        [3]  - отображать почту/посылку
                        [4]  - отображать слом
                        [5]  - отображать грену
                        [6]  - звук при получении почты/посылки
                        [7]  - звук "Пора работать" */
                        '@|||||||' +
                    /*
                    [7]  - CritShotsAndLinksBtlLog
                        [0]  - показывать/не показывать критические выстрелы */
                        '@' +
                    /*
                    [8]  - DeleteSms
                        [0]  - отмечать синдовые рассылки
                        [1]  - отмечать рассылки от робота
                        [2]  - НЕ отмечать письма с пометкой "важное" */
                        '@||' +
                    /*
                    [9]  - FarmTimer
                        [0]  - время полива/сбора
                        [1]  - действие (Полить|Собрать)
                        [2]  - время последнего проигрывания звука
                        [3]  - звук проигран?
                        [4]  - номер звука когда пора поливать/собирать
                        [5]  - интервал повторения звука */
                        '@|||||' +
                    /*
                    [10] - TimeNpc
                        [0]  - звук вкл/выкл
                        [1]  - ID NPC, у которого последний раз брали квест
                        [2]  - время
                        [3]  - номер звука */
                        '@|||' +
                    /*
                    [11] - AllPlantsOnFarm
                        [0]  - номер первого недоступного растения
                                (не используется с версии 1.82)
                        [1]  - время сброса счетчика
                        [2]  - количество гб
                        [3]  - количество производа
                        [4]  - показывать счетчик ГБ?
                        [5]  - показывать счетчик производа? */
                        '@|||||' +
                    /*
                    [12] - GwMenu
                        [0] - чекбокс "Показывать всегда" */
                        '@' +
                    /*
                    [13] - GbCounter
                        [0] - количество Гб */
                        '@' +
                    /*
                    [14] - NewsAndInvit
                        [0] - {'newsId': 0|1, ...} */
                        '@' +
                    /*
                    [15] - FilterResOnStat
                        [0] - список отображаемых ресурсов через запятую */
                        '@' +
                    /*
                     [16] - FilterWarlistOne2One
                        [0] - название оружия */
                        '@' +
                    /*
                     [17] - GosEnergoAtomFilter
                        [0] - остров ('' - любой, 'Z', 'G')
                        [1] - тип объекта ('' - любой, '1' - эски, '2' - уранки,
                                '3' - уранки [2], '4' - уранки [3])
                        [2] - синдикат ('', '0' - ничейки, 'xxx' - ID синда) */
                        '@' +
                    /*
                     [18] - PersonalNPCNotifications
                        [0] - звук,когда NPC ожидает распоряжений
                        [1] - звук, когда NPC находится на Аутленде и его
                                здоровье менее 30%
                        [2] - null (осталось от SortSyndOnline) */
                        '@||' +
                    /*
                     [19] - HousHealth
                        [0] - вышел из боя */
                        '@' +
                    /*
                     [20] - CommonBattleFilter
                        [0] - максимальный уровень
                        [1] - чекбокс "без именных"
                        [2] - чекбокс "по  мощности" */
                        '@0|1|1' +
                    /*
                     [21] - One2OneCallerInfo
                        [0] - звук при вызове */
                        '@' +
                    /*
                     [22] - PortTimer
                        [0] - '{
                            date: "",
                            syndid: "",
                            time: [],
                            current: ""}' */
                        '@' +
                    /*
                     [23] - ScanKarma
                        [0] - текущая карма 'xx/xx' */
                        '@' +
                    /*
                     [24] - ScanPers
                        [0] - id персонажа
                        [1] - id синда персонажа
                        [2] - чекбокс звук
                        [3] - чекбокс сообщение
                        [4] - id звука при входе
                        [5] - id звука при выходе
                        [6] - звук(сообщение) проигран или нет
                        [7] - ник персонажа
                        [8] - timestamp последнего сканирования */
                        '@||||||||' +
                    /*
                     [25] - SkillCounters
                        [0] - боевой
                        [1] - эконом
                        [2] - производ
                        [3] - пистолеты
                        [4] - гранаты
                        [5] - автоматы
                        [6] - пулеметы
                        [7] - дробовики
                        [8] - снайперки
                        [9] - синдикатный уровень
                        [10] - время последнего сброса */
                        '@||||||||||' +
                    /*
                     [26] - ShowMyAchievements
                        [0] - номера ачивок '1,14,35...' */
                        '@' +
                    /*
                     [27] - TimeKarma
                        [0] - время, когда выставили карму */
                        '@' +
                    /*
                     [28] - SoundSyndBattle
                        [0] - время до боя, когда будет проигран второй звук
                        [1] - звук №1
                        [2] - звук №2
                        [3] - флаги проигрывани звука ('', '1', '2') */
                        '@|||' +
                    /*
                     [29] - AdvForum
                        [0] - отмечать закрытые темы
                        [1] - звук при появлении новой темы
                        [2] - интервал перезагрузки страниц с темами форума
                        [3] - не показывать закрытые темы
                        [4] - не показывать прикрепленки
                        [5] - ветки, где скрипт работать не будет
                        [6] - список включения/отключения показа форумов
                        [7] - данные веток форума:
                          {
                              'fid': {
                                  'tid': {
                                      d: str  // дата первого просмотра темы
                                      l: str  // id последнего сообщения
                                      с: str  // номер последнего сообщения
                                  },
                                  ...
                              },
                              ...
                          }
                        [8] - {'fid': id_последней темы, ...} */
                        '@1|||||1,5,7,11,15,24,34,35,36,37,41,42,44,46,47,' +
                        '48,54|1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,' +
                        '1|{}|{}' +
                    /*
                     [30] - FilterGeneralFighting (удален)
                        [0]  - минимальный уровень
                        [1]  - максимальный уровень
                        [2]  - командные
                        [3]  - случайные
                        [4]  - DM
                        [5]  - без DM
                        [6]  - без синдовых
                        [7]  - только синдовые
                        [8]  - показывать умения
                        [9]  - показывать дальность
                        [10] - нужная дальность
                        [11] - время до боя (сек) */
                        '@5|50||||||||||' +
                    /*
                    [31] - Regeneration
                        [0] - номер звука при 80%
                        [1] - номер звука при 100%
                        [2] - текущее состояние:
                                '' : пустое
                                '1': получили 80%
                                '2': получили 100%
                                '3': получили 80%, но еще не получили 100%
                                '4': финиш
                    */
                        '@||'; // 2}}}
        /**
         * @property myID
         * @type {RegExpExecArray}
         */
        this.myID = /(^|;) ?uid=([^;]*)(;|$)/.exec(this.doc.cookie);
        /**
         * @property DESIGN_VERSION
         * @type {RegExpExecArray}
         */
        this.DESIGN_VERSION = /(^|;) ?version=([^;]*)(;|$)/.
                exec(this.doc.cookie);
        /**
         * @property selfName
         * @type {String}
         */
        this.selfName = 'comfortablePlayingInGW';
        /**
         * @property STORAGENAME
         * @type {String}
         */
        this.STORAGENAME = (this.myID ? this.myID[2] : '') + '_' +
            this.selfName;
        /**
         * @property mainPath
         * @type {String}
         */
        this.mainPath = 'https://raw.githubusercontent.com/MyRequiem/' +
            this.selfName + '/master/';
        /**
         * @property imgPath
         * @type {String}
         */
        this.imgPath = this.myID && this.myID[2] === '2095458' ?
                'http://127.0.0.1/imgs/gwScripts/' : this.mainPath + 'imgs/';
        /**
         * @property viewMode
         * @type {Boolean}
         */
        this.viewMode = /\/(warlog|battlelog)\.php/.test(this.loc);
        /**
         * @property domain
         * @type {String}
         */
        this.domain = this.doc.domain;
        /**
         * @property mainDomain
         * @type {Boolean}
         */
        this.mainDomain = /gwars/.test(this.loc);
    }; // 1}}}

    /**
     * @lends General.prototype {{{1
     */
    General.prototype = {
        /**
         * @method getRoot {{{2
         * @return  {Object}
         */
        getRoot: function () {
            var rt = typeof unsafeWindow;
            return rt !== 'undefined' ? unsafeWindow : window;
        }, // 2}}}

        /**
         * @method setNewStorage {{{2
         */
        setNewStorage: function () {
            var oldSt = this.st.getItem(this.STORAGENAME);
            if (!oldSt) {
                this.st.setItem(this.STORAGENAME, this.stString);
                return;
            }

            // если были старые данные, переносим их в новую storage-строку
            var newSt = this.stString.split('@');
            oldSt = oldSt.split('@');
            var nSt, oSt, i, j;
            for (i = 1; i < oldSt.length; i++) {
                nSt = newSt[i].split('|');
                if (nSt.length === 1) {
                    newSt[i] = oldSt[i];
                    continue;
                }

                oSt = oldSt[i].split('|');
                for (j = 0; j < oSt.length; j++) {
                    nSt[j] = oSt[j];
                }

                newSt[i] = nSt.join('|');
            }

            this.st.setItem(this.STORAGENAME, newSt.join('@'));
        }, // 2}}}

        /**
         * @method getData {{{2
         * @param   {int}   ind
         * @return  {Array}
         */
        getData: function (ind) {
            return this.st.getItem(this.STORAGENAME).
                split('@')[ind].split('|');
        }, // 2}}}

        /**
         * @method setData {{{2
         * @param   {String|Array}  data
         * @param   {int}           ind
         */
        setData: function (data, ind) {
            var dt = this.st.getItem(this.STORAGENAME).split('@');
            dt[ind] = typeof data !== 'string' ? data.join('|') : data;
            this.st.setItem(this.STORAGENAME, dt.join('@'));
        }, // 2}}}

        /**
         * @method getInitScript {{{2
         * @return  {Array}
         */
        getInitScript: function () {
            if (this.mainDomain) {
                return this.getData(1);
            }

            return [];
        }, // 2}}}

        /**
         * @method $ {{{2
         * @param   {String}    id
         * @return  {HTMLElement|null}
         */
        $: function (id) {
            return this.doc.querySelector('#' + id);
        }, // 2}}}

        /**
         * @method checkMainData {{{2
         * @return  {Boolean}
         */
        checkMainData: function () {
            if (!this.st) {
                alert('Ваш браузер не поддерживает технологию localStorage');
                return false;
            }

            if (this.mainDomain) {
                if (!this.myID || !this.DESIGN_VERSION) {
                    this.cons.log('!this.myID || !this.DESIGN_VERSION');
                    return false;
                }

                if (!this.st.getItem(this.STORAGENAME) ||
                        this.getData(0)[0] !== this.version) {
                    this.setNewStorage();
                }

                this.myID = this.myID[2];
                this.DESIGN_VERSION = this.DESIGN_VERSION[2];
            }

            return true;
        } // 2}}}
    }; // 1}}}

    var general, initScript;

    /**
     * @class GetStrDate {{{1
     * @constructor
     */
    var GetStrDate = function () {
        /**
         * @method init
         * @param   {int|String}    time
         * @return  {String}
         */
        this.init = function (time) {
            var date = time === 'now' ? new Date() : new Date(time),
                month = date.getMonth() + 1,
                day = date.getDate();

            return (day < 10 ? '0' + day : day) +  '.' +
                        (month < 10 ? '0' + month : month) + '.' +
                            /20(\d+)/.exec(date.getFullYear().toString())[1];
        };
    }; // 1}}}

    /**
     * @class GetTimestamp {{{1
     * @constructor
     */
    var GetTimestamp = function () {
        /**
         * @method init
         * @param   {String}    val
         * @return  {int}
         */
        this.init = function (val) {
            var date = /(\d\d)\.(\d\d)\.(\d\d)/.exec(val);

            if (!date) {
                return 0;
            }

            var d = +date[1],
                m = +date[2],
                y = +date[3];

            if (!d || d > 31 || !m || m > 12 || !y) {
                return 0;
            }

            return new Date(2000 + y, m - 1, d).getTime();
        };
    }; // 1}}}

    /**
     * @class UrlEncode {{{1
     * @constructor
     */
    var UrlEncode = function () {
        /**
         * @method init
         * @param   {String}    str
         * @return  {String}
         */
        this.init = function (str) {
            var mass = {1040: 192, 1041: 193, 1042: 194, 1043: 195, 1044: 196,
                    1045: 197, 1046: 198, 1047: 199, 1048: 200, 1049: 201,
                    1050: 202, 1051: 203, 1052: 204, 1053: 205, 1054: 206,
                    1055: 207, 1056: 208, 1057: 209, 1058: 210, 1059: 211,
                    1060: 212, 1061: 213, 1062: 214, 1063: 215, 1064: 216,
                    1065: 217, 1066: 218, 1067: 219, 1068: 220, 1069: 221,
                    1070: 222, 1071: 223, 1072: 224, 1073: 225, 1074: 226,
                    1075: 227, 1076: 228, 1077: 229, 1078: 230, 1079: 231,
                    1080: 232, 1081: 233, 1082: 234, 1083: 235, 1084: 236,
                    1085: 237, 1086: 238, 1087: 239, 1088: 240, 1089: 241,
                    1090: 242, 1091: 243, 1092: 244, 1093: 245, 1094: 246,
                    1095: 247, 1096: 248, 1097: 249, 1098: 250, 1099: 251,
                    1100: 252, 1101: 253, 1102: 254, 1103: 255, 1025: 168,
                    1105: 184, 8470: 185},
                result = '',
                code,
                i;

            for (i = 0; i < str.length; i++) {
                code = str.charCodeAt(i);
                code = mass[code] || code;

                if (code < 16) {
                    result += '%0' + code.toString(16);
                } else {
                    result += '%' + code.toString(16);
                }
            }

            return result;
        };
    }; // 1}}}

    /**
     * @class PlaySound {{{1
     * @constructor
     */
    var PlaySound = function () {
        /**
         * @method init
         * @param   {int|String}    sound
         */
        this.init = function (sound) {
            if (sound && sound !== '0') {
                var audio = general.$('cpingw_audio');
                if (!audio) {
                    audio = general.doc.createElement('audio');
                    audio.setAttribute('id', 'cpingw_audio');
                    var divAudio = general.doc.createElement('div');
                    divAudio.setAttribute('style', 'display: none;');
                    divAudio.appendChild(audio);
                    general.doc.body.appendChild(divAudio);
                }

                audio.volume = 0.2;
                audio.src = (general.myID === '2095458' ?
                        'http://127.0.0.1/' : general.mainPath) + 'sounds/' +
                            sound + '.ogg';
                // noinspection JSIgnoredPromiseFromCall
                audio.play();
            }
        };
    }; // 1}}}

    /**
     * @class GetRandom {{{1
     * @constructor
     */
    var GetRandom = function () {
        /**
         * @method init
         * @param   {int}   a
         * @param   {int}   b
         * @return  {int}
         */
        this.init = function (a, b) {
            return Math.round(a + (b - a) * Math.random());
        };
    }; // 1}}}

    /**
     * @class GetTopPanel {{{1
     * @constructor
     */
    var GetTopPanel = function () {
        /**
         * @method init
         * @return  {HTMLElement|null}
         */
        this.init = function () {
            // ищем верхнюю панель "MyRequiem [603/603] ... 21:01, 3095 онлайн"
            var topPanel;

            if (general.DESIGN_VERSION === 'v2') {  // новый дизайн
                topPanel = general.doc.querySelector('td.gw-header-col2 ' +
                        'td[width="50%"][valign="middle"]');
                if (topPanel) {
                    topPanel.setAttribute('style', 'width: 70%;');
                }
            } else {
                topPanel = general.doc.
                    querySelector('td.txt[align="left"] nobr:first-child');
                if (topPanel) {
                    // noinspection JSUnresolvedFunction
                    topPanel.parentNode.setAttribute('style', 'width: 70%;');
                }
            }

            return topPanel;
        };
    }; // 1}}}

    /**
     * @class SetSettingsButton {{{1
     * @constructor
     */
    var SetSettingsButton = function () {
        /**
         * @method init
         */
        this.init = function () {
            var topPanel = new GetTopPanel().init();

            if (topPanel) {
                // noinspection JSUnresolvedVariable
                var settingsButton = general.doc.createElement('a'),
                    target = topPanel.nextElementSibling ||
                        topPanel.parentNode.nextElementSibling;

                settingsButton.innerHTML = '<img src="' + general.imgPath +
                    'NotGiveCannabisLeaf/on.gif" width="15" height="15" ' +
                    'title="Настройки" alt="Настройки" />';
                settingsButton.setAttribute('href',
                        'https://' + general.domain + '/news.php?set=1');
                settingsButton.setAttribute('style', 'margin-left: 7px;');
                target.querySelector('table td:last-child>nobr').
                    appendChild(settingsButton);
            }
        };
    }; // 1}}}

    /**
     * @class AjaxQuery {{{1
     * @constructor
     */
    var AjaxQuery = function () {
        /**
         * @method init
         * @param   {String}        url
         * @param   {String}        rmethod
         * @param   {String|null}   param
         * @param   {Boolean}       async
         * @param   {Function}      onsuccess
         * @param   {Function|null} onfailure
         */
        this.init = function (url, rmethod, param, async, onsuccess,
                onfailure) {
            var xmlHttpRequest = new XMLHttpRequest();

            if (!xmlHttpRequest) {
                general.cons.log('Error create xmlHttpRequest !!!');
                return;
            }

            xmlHttpRequest.open(rmethod, url, async);

            if (rmethod === 'POST') {
                xmlHttpRequest.setRequestHeader('Content-Type',
                    'application/x-www-form-urlencoded');
                xmlHttpRequest.setRequestHeader('Content-length',
                    param.length.toString());
                xmlHttpRequest.setRequestHeader('Connection', 'close');
            }

            xmlHttpRequest.send(param);

            if (async) {
                var timeout = general.root.setTimeout(function () {
                    xmlHttpRequest.abort();
                }, 10000);

                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState === 4) {
                        clearTimeout(timeout);
                        if (xmlHttpRequest.status === 200) {
                            onsuccess(xmlHttpRequest);
                        } else if (onfailure) {
                            onfailure();
                        }
                    }
                };
            } else {
                if (xmlHttpRequest.status === 200) {
                    onsuccess(xmlHttpRequest);
                } else {
                    onfailure(xmlHttpRequest);
                }
            }
        };
    }; // 1}}}

    /**
     * @class CheckInputText {{{1
     * @constructor
     */
    var CheckInputText = function () {
        /**
         * @method init
         * @param   {Object}    inp
         * @param   {int}       limit
         * @return  {Boolean}
         */
        this.init = function (inp, limit) {
            var _inp = inp,
                val = _inp.value,
                lim = limit || 0;

            return !(!val || isNaN(+val) || +val < lim);
        };
    }; // 1}}}

    /**
     * @class GetSelectSound {{{1
     * @constructor
     */
    var GetSelectSound = function () {
        /**
         * @method init
         * @param   {String}    id
         * @return  {String}
         */
        this.init = function (id) {
            var sounds = [
                    'Без звука', 'Перезарядка', 'Выстрел дробовика',
                    'Открытие двери', 'Взрыв бочки', 'Выстрел BFG',
                    'Радио-зуммер', 'Подтверждение цели', 'Ion Cannon Ready!',
                    'Select target!', 'Звук тревоги', 'I`m alive!',
                    'Орки смеются', 'Unholy Armor', 'We`ve been attacked!',
                    'Кот мяукает', 'Кот мяукает #2', 'Take cover!', 'Stupid!',
                    'Hello!', 'hehehehe!', 'Chimes', 'Ding', 'Ошибка',
                    'Отказ оборудования', 'А, вот эти ребята', 'Не-не-не-не!',
                    'нет, Девид Блейн, нет!',
                    'Я делаю особую магию&nbsp;&nbsp;', 'Prepare for battle!',
                    'Pick up your weapons'
                ],
                str = '<select id="' + id + '" disabled>',
                i;

            for (i = 0; i < sounds.length; i++) {
                str += '<option value="' + i + '">' + sounds[i] + '</option>';
            }

            return str + '</select> ' +
                '<input type="button" id="l' + id + '" ' +
                'value="»" disabled>';
        };
    }; // 1}}}

    /**
     * @class ShowMainSettings {{{1
     * @constructor
     */
    var ShowMainSettings = function () {
        /**
         * @property getSelectSound
         * @type {Function}
         */
        this.getSelectSound = new GetSelectSound().init;
        // noinspection HtmlUnknownAttribute
        /**
         * @property infoScripts {{{2
         * @type {Object}
         */
        this.infoScripts = {
            'Персонаж': [
                ['Gw-Меню', 'Панель с множеством полезных ссылок для игры.' +
                    this.getGitHubLink('gwMenu'), '14'],
                ['Логотип игры', 'На всех страницах заменяет логотип игры ' +
                    '&nbsp;&nbsp;<img style="box-shadow: 2px 3px 3px ' +
                    'rgba(122,122,122, 0.5);" src="https://images.' +
                    general.domain.replace('www.', '') +
                    '/i/gon.gif" alt="img" /> &nbsp;&nbsp;на зеленый ' +
                    'листик &nbsp;&nbsp;<img style="box-shadow: 2px 3px 3px ' +
                    'rgba(122,122,122,0.5);" src="' + general.imgPath +
                    'NotGiveCannabisLeaf/on.gif" alt="img" />' +
                    this.getGitHubLink('notGiveCannabisLeaf'), '0'],
                ['Таймер выздоровления', 'Таймер выздоровления персонажа ' +
                    'на главной странице.<br>' +
                    this.getSelectSound('sound80HP') +
                    ' звук при достижении 80% HP<br>' +
                    this.getSelectSound('sound100HP') +
                    ' звук при достижении 100% HP' +
                    this.getGitHubLink('regeneration') +
                    '<span style="margin-left: 15px;">идея: ' +
                    '<a href="https://' + general.domain +
                    '/info.php?id=73295" style="font-weight: bold;" ' +
                    'target="_blank">W_or_M</a></span>', '56'],
                ['Дополнение для панели навигации',
                    'Добавляет возможность установить дополнительные ссылки ' +
                    'в панель навигации.' +
                    this.getGitHubLink('additionForNavigationBar'), '1'],
                ['Подсветка персонажей из ЧС', 'Подсвечивает ссылки на ' +
                    'персонажей, входящих в черный список на всех страницах ' +
                    'игры. Делает неактивной ссылку принятия боя c ' +
                    'персонажем из черного списка в одиночных боях.<br><br>' +
                    '&nbsp;&nbsp;<a target="_blank" href=' +
                    '"https://' + general.domain + '/home.friends.php">' +
                    'Запомнить черный список</a> (скрипт должен быть включен)' +
                    '<br><input type="checkbox" id="blockBLOne2One" ' +
                    'disabled> блокировать ссылку принятия боя с персонажем ' +
                    'из ЧС в одиночных заявках' +
                    this.getGitHubLink('blacklistHighlighting'), '4'],
                ['Работа, письмо, посылка, граната, слом', 'Окончание ' +
                    'работы, осталось времени работать, почта, посылка, ' +
                    'присутствие гранаты на поясе, проверка сломанных вещей. ' +
                    'На все события оповещения звуковые и визуальные.<br><b>' +
                    'P.S.</b> Гранатомет в руках расценивается как ' +
                    'присутствие гранаты.<br><br><input type="checkbox" ' +
                    'id="showwork" disabled /> отображать время работы<br>' +
                    '<input type="checkbox" id="showsms" disabled /> ' +
                    'отображать получение почты/посылки<br><input ' +
                    'type="checkbox" id="showbroken" disabled /> отображать ' +
                    'наличие сломанных предметов<br><input type="checkbox" ' +
                    'id="showgren" disabled /> отображать отсутствие гранаты ' +
                    'на поясе<br>Звук при получении почты: ' +
                    this.getSelectSound('soundSms') + '<br>Звук ' +
                    '"Пора работать": &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '&nbsp;&nbsp;&nbsp;' + this.getSelectSound('soundWork') +
                    this.getGitHubLink('workPostGrenadesBroken'), '5'],
                ['Ресурсы и бонусы', 'Создает ссылки "Ресурсы" и "Бонусы" ' +
                    'вверху страницы. При клике выводятся соответствующие ' +
                    'данные.' + this.getGitHubLink('resourcesAndBonuses'), '6'],
                ['Удаление личных сообщений', 'Добавляет сылку "Удалить ' +
                    'отмеченные" вверху страниц входящих и исходящих ' +
                    'сообщений. Отметка синдикатных рассылок и сообщений от ' +
                    'робота.<br><br><input id="syndmail" type="checkbox" ' +
                    'disabled /> отмечать синдовые рассылки<br>' +
                    '<input id="robotmail" type="checkbox" disabled /> ' +
                    'отмечать рассылки от робота<br>' +
                    '<input id="importantmail" type="checkbox" disabled /> ' +
                    'НЕ отмечать письма с пометкой "важное"' +
                    this.getGitHubLink('deleteSms'), '8'],
                ['Подтверждение нажатия "Удалить и забанить"', 'Красит ' +
                    'кнопку "Удалить и забанить" при просмотре личных ' +
                    'сообщений в розовый цвет. При нажатии требует ' +
                    'подтверждения операции.' +
                    this.getGitHubLink('delAndAddBlackSms'), '54'],
                ['Таймер для выполнения квестов NPC', 'На главной странице ' +
                    'выводит время, оставшееся до взятия квеста и сcылку на ' +
                    'NPC, у которого в последний раз брали квест. Звуковое ' +
                    'оповещение. Умеет выводить список NPC с информацией ' +
                    'о них для каждого острова.<br>Звук "Пора делать ' +
                    'квест": ' + this.getSelectSound('soundTimerNPC') +
                    this.getGitHubLink('timeNpc'), '12'],
                ['Упаковка одинаковых предметов в инвентаре', 'Упаковка ' +
                    'одинаковых предметов в инвентаре.' +
                    this.getGitHubLink('inventoryPlus'), '15'],
                ['Счетчик Гб', 'Показывает измененние количества Гб на ' +
                    'главной странице персонажа.' +
                    this.getGitHubLink('gbCounter'), '17'],
                ['Новости и приглашения в синдикаты', 'Выделение и мигание ' +
                    'приглашений в синдикаты, новых и не прочитанных ' +
                    'новостей на главной странице персонажа.' +
                    this.getGitHubLink('newsAndInvit'), '20'],
                ['Исправление умелок вида +-xxx', 'Исправляет умелки вида ' +
                    '+-xxx, полученные при выполнении квестов на странице ' +
                    'информации персонажа и на главной странице.' +
                    this.getGitHubLink('fixSkills'), '24'],
                ['Просмотр истории личных сообщений', 'При просмотре ' +
                    'входящего/исходящего сообщения устанавливает ссылку ' +
                    'для вывода предыдущей переписки с персонажем. Так же ' +
                    '"умеет" выводить ссылки на тексты сообщений, доступные ' +
                    'для официальных синдикатов в хронологическом порядке.' +
                    this.getGitHubLink('historySms'), '26'],
                ['Результативность игры в рулетку, покер, тотализатор',
                    'Анализ результативности игры в рулетку, тотализатор, ' +
                    'покер и заработанных денег в боях на странице ' +
                    'информации персонажа.' +
                    this.getGitHubLink('gameMania'), '28'],
                ['Порты и терминалы', 'Показывает на карте местонахождение ' +
                    'терминалов и портов.' +
                    this.getGitHubLink('portsAndTerminals'), '37'],
                ['Дальность оружия', 'Добавляет дальность оружия на странице ' +
                    'информации любого персонажа.' +
                    this.getGitHubLink('rangeWeapon'), '38'],
                ['Изменение Вашей кармы', 'При изменении Вашей кармы выводит ' +
                    'сообщение на странице информации персонажа.' +
                    this.getGitHubLink('scanKarma'), '40'],
                ['Извещения о входе персонажа в игру', 'Выдает сообщение ' +
                    'и/или звуковой сигнал при появлении (или выходе) в ' +
                    'онлайне определенного персонажа.' +
                    this.getGitHubLink('scanPers'), '41'],
                ['Поиск персонажа', 'Добавляет форму поиска персонажа.' +
                    this.getGitHubLink('searchUser'), '43'],
                ['Счетчики опыта и умений', 'Счетчики опыта и умений на ' +
                    'главной странице персонажа.' +
                    this.getGitHubLink('skillCounters'), '44'],
                ['Быстрый просмотр Ваших достижений', 'Добавляет ссылку ' +
                    '"Достижения" в верхней части страниц игры при нажатии ' +
                    'на которую выводятся Ваши ачивки, но только те, ' +
                    'которые были отмечены на <a target="_blank" ' +
                    'href="https://' + general.domain + '/info.ach.php?id=' +
                    general.myID + '">странице достижений</a>.' +
                    this.getGitHubLink('showMyAchievements') +
                    '<span style="margin-left: 15px;">идея: ' +
                    '<a href="https://' + general.domain + '/info.php?' +
                    'id=134292" style="font-weight: bold;" target="_blank">' +
                    'Горыныч</a></span>', '47'],
                ['Время до возможности выставить карму', 'На странице ' +
                    'информации персонажа показывает динамический счетчик ' +
                    'времени до возможности поставить карму.' +
                    this.getGitHubLink('timeKarma'), '50'],
                ['Подсветка профессий', 'При наличии у персонажа лицензии ' +
                    'киллера, боевика или наемника название профессии на его ' +
                    'странице информации окрашивается в красный цвет.' +
                    this.getGitHubLink('profColor'), '57'],
                ['Текущий мини-квест на странице информации персонажа',
                    'Вывод текущего ужедневного мини-квеста на странице ' +
                    'информации персонажа.' +
                    this.getGitHubLink('currentQuestOnInfo') +
                    '<span style="margin-left: 15px;">идея: ' +
                    '<a href="https://' + general.domain + '/info.php?' +
                    'id=54662" style="font-weight: bold;" target="_blank">' +
                    'kaa</a></span>', '58'],
                ['Кнопки для вставки bb-кодов цитирования и наклонного шрифта',
                    'В формах для отправки личных сообщений и сообщений на ' +
                    'форуме добавляет кнопки для вставки в позиции курсора ' +
                    'bb-кодов для цитирования [q][/q] и наклонного шрифта ' +
                    '[i][/i]' +
                    this.getGitHubLink('bbCodeInMessages'), '62'],
                ['Счетчик опыта профессий',
                    'На странице информации персонажа отображает оставшееся ' +
                    'количество очков до следующего уровня професии.' +
                    this.getGitHubLink('professionLevels') +
                    '<span style="margin-left: 15px;">идея: ' +
                    '<a href="https://' + general.domain + '/info.php?' +
                    'id=285394" style="font-weight: bold;" target="_blank">' +
                    'Bodyarm</a></span>', '63']],

            'Персональный NPC': [
                ['Оповещения', 'Если личный NPC ожидает распоряжений и его ' +
                    'здоровье более 79%, то на главной странице персонажа ' +
                    'ссылка на NPC начинает "пульсировать". Если NPC ' +
                    'находится на Аутленде и его здоровье менее 30%, то фон ' +
                    'ссылки становится розовый. Звуковые оповещения. Статус ' +
                    'NPC проверяется один раз в 10 секунд, перезагрузки ' +
                    'главной страницы персонажа не требуется.<br><br>' +
                    'Звук при ожидании распоряжений: ' +
                    this.getSelectSound('soundPersNPC1') +
                    '<br>Звук, если здоровье на Ауте < 30%: ' +
                    this.getSelectSound('soundPersNPC2') +
                    this.getGitHubLink('personalNPCNotifications'), '35']],

            'Бои': [
                ['Дополнение для боев', 'Расширенная информация в списке ' +
                    'выбора противника + сортировка списка по номеру, ' +
                    'дальности, уровню, видимости и т.д. Динамический центр, ' +
                    'продвинутое расположение бойцов на поле боя в бою и в ' +
                    'режиме наблюдения за боем, кнопка "Сказать ход", ' +
                    'чекбоксы "Говорить только правую руку", "Говорить ' +
                    'только левую руку", "Сказать своей команде", "Сказать ' +
                    'как координатор". Быстрая вставка ника в поле чата (при ' +
                    'клике на "конвертике" рядом с никами бойцов или при ' +
                    'двойном клике на изображении бойца на схеме поле боя). ' +
                    'Информация вверху страницы о набитом HP, вашем ' +
                    'здоровье, видимости и т.д. При одиночном клике по ' +
                    'противнику на схеме поля боя происходит его выбор в ' +
                    'качестве цели. Кнопка "Обновить". Подсвечивает зеленым ' +
                    'цветом тех персонажей, которые уже сделали ход. Выводит ' +
                    'общее количество персонажей и количество персонажей ' +
                    'сделавших ход. Таймаут обновления заявки после входа в ' +
                    'нее и таймаут обновления данных в бою.<br>' +
                    '<span style="color: #0000FF;">Параметры в настройках ' +
                    'персонажа для правильной работы скрипта</span>: ' +
                    '(<a href="' + general.mainPath + 'imgs/AdvBattleAll/' +
                    'screen1.png" target="_blank">скриншот</a>)<br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '- оформление боя в desktop-версии игры: упрощенное<br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '- расположение в бою: примитивное<br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '- JavaScript-версия: использовать.<br><br>' +
                    'Показывать чекбокс "Сказать как координатор" ' +
                    '(вставка \'!*\' в поле чата боя): ' +
                    '<input type="checkbox" id="showCoordButton" disabled />' +
                    '<br><br>При нажатии на кнопку "Сказать ход":<br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<input type="checkbox" ' +
                        'id="notWriteEnemyNameWhenSayMove" disabled /> ' +
                    'не выводить имя противника<br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<input type="checkbox" ' +
                        'id="notWriteSkillsWhenSayMove" disabled /> ' +
                    'не выводить применяемые навыки' +
                    '<br><br>Таймаут обновления данных в бою:' +
                    '<span style="margin-left: 54px;"> </span>' +
                    '<input id="refreshBattle" maxlength="2" style="width: ' +
                    '30px;" value="' + (general.getData(4)[0] || '0') +
                    '" disabled /> сек (0 - настройки игры по умолчанию)<br>' +
                    'Таймаут обновления заявки при входе в нее: ' +
                    '<input id="refreshAppl" maxlength="2" style="width: ' +
                    '30px;" value="' + (general.getData(4)[1] || '0') +
                    '" disabled /> сек (0 - настройки игры по умолчанию)<br>' +
                    'Звук при начале боя:&nbsp;&nbsp;&nbsp;&nbsp;' +
                    this.getSelectSound('advBattleSound1') + '<br>' +
                    'Звук при начале хода:&nbsp;&nbsp;' +
                    this.getSelectSound('advBattleSound2') +
                    this.getGitHubLink('advBattleAll'), '3'],
                ['Ссылки в логе боя, критические выстрелы', 'В бою и на ' +
                    'страницax логов боев делает все ники персонажей ' +
                    'ссылками. Показывает критические выстрелы вашего ' +
                    'персонажа и их общее количество (опционально).<br><br>' +
                    '<input type="checkbox" id="showcrits" disabled /> ' +
                    'показывать критические выстрелы' +
                    this.getGitHubLink('critShotsAndLinksBtlLog'), '7'],
                ['Счетчик боев', 'Показывает общее количество боев, побед и ' +
                    'поражений за текущие сутки на страницax протоколов ' +
                    'боев.' + this.getGitHubLink('countBattles'), '16'],
                ['Счетчик времени до начала синдикатного боя', 'Динамический ' +
                    'счетчик времени до начала синдикатного боя, звуковое ' +
                    'оповещение.<br><br><input id="timeSyndSoundLimit" ' +
                    'value="' + (general.getData(28)[0] || '90') +
                    '" maxlength="3" style="width: 35px;" /> - время до боя ' +
                    '(сек), когда будет проигран второй звук ' +
                    '<span style="color: #FF0000;">(не менее 15)</span><br>' +
                    this.getSelectSound('syndSoundBattle1') + ' - звук, если ' +
                    'осталось более <span name="sptssl"></span> сек<br>' +
                    this.getSelectSound('syndSoundBattle2') + ' - звук, если ' +
                    'осталось менее <span name="sptssl"></span> сек' +
                    this.getGitHubLink('soundSyndBattle'), '52'],
                ['Фильтр общих боев', 'Фильтр общих боев по уровню бойцов.' +
                    this.getGitHubLink('commonBattleFilter'), 59],
                ['Фильтр по оружию в одиночных заявках', 'Фильтр по оружию в ' +
                    'одиночых заявках. Фильтр по уровням и типу оружия, ' +
                    'встроенный в игре, переносится вверх страницы. Все ' +
                    'настройки находятся на <a target="_blank" ' +
                    'href="https://' + general.domain + '/warlist.php?' +
                    'war=armed">странице одиночных заявок</a>' +
                    this.getGitHubLink('filterWarlistOne2One'), '23'],
                ['Ссылки на странице одиночных заявок', 'На странице ' +
                    'заявок одиночных боев делает ники вызывающих на бой ' +
                    'персонажей ссылками на них.' +
                    this.getGitHubLink('linksInOne2One'), '33'],
                ['Информация о вызывающем Вас на бой персонаже в одиночных ' +
                    'боях', 'Выводит информацию о  вызывающем Вас на бой ' +
                    'персонаже в одиночных боях (HP, дальность оружия, ' +
                    'умения, ссылки-изображения на экипировку, бонусы). ' +
                    'Звуковое оповещение при вызове.<br><br>Звук при вызове: ' +
                    this.getSelectSound('soundOne2One') +
                    this.getGitHubLink('one2OneCallerInfo'), '34'],
                ['Контроль Уранa и ЭC', 'Сортировка объектов по типу, ' +
                    'островам и контролирующим синдикатам на странице ' +
                    '<a target="_blank" href="https://' + general.domain +
                    '/info.realty.php?id=2">ГосЭнегоАтом</a>' +
                    this.getGitHubLink('gosEnergoAtomFilter'), '29'],
                ['Проверка сектора после боя', 'Выводит сообщение после боя, ' +
                    'если персонаж находится не в секторе со своим домом и ' +
                    'его здоровье менее 80%.' +
                    this.getGitHubLink('housHealth'), '31'],
                ['Изображения покемонов', 'В боях с покемонами и в режиме ' +
                    'наблюдения за боем (Ejection Point, Overlord Point, ' +
                    'прибрежная зона) показывает изображения для каждого ' +
                    'пока.' + this.getGitHubLink('imgPokemonsOnBattle') +
                    '<span style="margin-left: 15px;">идея: ' +
                    '<a href="https://' + general.domain + '/info.php?' +
                    'id=436429" style="font-weight: bold;" target="_blank">' +
                    'Buger_man</a></span>', '51'],
                ['Таймер для боев за порты', 'Вывод точного/оставшегося ' +
                    'времени до боя за порт в верхней части страницы.' +
                    this.getGitHubLink('portTimer') +
                    '<span style="margin-left: 15px;">идея: ' +
                    '<a href="https://' + general.domain + '/info.php?' +
                    'id=205482" style="font-weight: bold;" target="_blank">' +
                    'Enemy333</a></span>', '36'],
                ['Знаки синдикатов на страницах списков ближайших/прошедших ' +
                    'боев за порты', 'На страницах списков ближайших/' +
                    'прошедших боев за порты добавляет знаки синдикатов, ' +
                    'являющиеся ссылками на их онлайн.' +
                    this.getGitHubLink('portsSyndLinks'), '61']],

            'Синдикаты': [
                ['Сортировка на странице онлайна синдиката', 'Сортировка ' +
                    'онлайна синдиката и союза по идущим боям. Выделение ' +
                    'синдикатных боев.' +
                    this.getGitHubLink('sortSyndOnline'), '30'],
                ['Анализ активности синдиката', 'Анализ активности ' +
                    'синдиката. Рейтинг нападающих, баланс Гб и PTS ' +
                    'контролируемой недвижимости, кто и сколько взял/положил ' +
                    'Гб на счет синдиката, изменения состава.' +
                    this.getGitHubLink('syndAnalyser'), '46'],
                ['Анализ расхода PTS', 'Анализ расхода PTS синдиката. ' +
                    'Сортировка данных по купленным гранатам, чипам, ' +
                    'выданным званиям и знакам, общему количеству PTS.' +
                    this.getGitHubLink('syndPtsAnalyser'), '45'],
                ['Онлайн основного синдиката и союза на главной странице',
                    'На главной странице персонажа добавляет ссылки на его ' +
                    'основной синдикат и союз (если есть), при нажатии на ' +
                    'которые выводится онлайн синдиката со ссылками отправки ' +
                    'сообщения каждому бойцу. Если персонаж в бою, то ссылка ' +
                    'красного цвета. Так же добавляются конвертики для ' +
                    'отправки сообщений в разделах "Мои друзья" и "Гости".' +
                    this.getGitHubLink('syndOnlineOnMainPage'), '49']],

            'Форум': [
                ['Отображение сообщения, на которое отвечают', 'В ответе на ' +
                    'сообщение показывает то сообщение, на которое ' +
                    'отвечают.' + this.getGitHubLink('showInitMessOnForum'),
                    '42'],
                ['Отметки сообщений на форуме и другое.', 'Звуковые и ' +
                    'визуальные оповещения при появлении новых тем или смене ' +
                    'верхней темы, новых сообщений в темах, скрытие закрытых ' +
                    'тем и прикрепленок, отметка закрытых тем, скрытие ' +
                    'ненужных веток форума.' +
                    this.getGitHubLink('advForum'), '53']],

            'Торговля': [
                ['Ссылки в HighTech магазине для подачи объявлений',  'В ' +
                    'HighTech магазине добавляет ссылки "Продать" и "Купить" ' +
                    'для каждого предмета, при нажатии на которые, выводится ' +
                    'форма подачи объявления на ДО для данного предмета.' +
                    this.getGitHubLink('buyHightech'), '19'],
                ['Фильтр ресурсов на странице экономической статистики',
                    'Фильтр ресурсов на <a target="_blank" ' +
                    'href="https://' + general.domain + '/stats.php">' +
                    'странице экономической статистики</a><br><br>Введите ' +
                    'названия ресурсов через запятую, которые будут ' +
                    'отображаться на вышеуказанной странице. Например: ' +
                    'Уран,Водоросли,Маковая соломка,Трава,Батареи<br>' +
                    '<input id="filter_res" style="width: 350px;" disabled />' +
                    this.getGitHubLink('filterResOnStat'), '22'],
                ['Ссылки на High-tech вооружение в государственном магазине',
                    'В государственном магазине рядом со ссылками на типы ' +
                    'вооружения добавляет ссылки на вооружение High-tech' +
                    this.getGitHubLink('linksToHighTech') +
                    '<span style="margin-left: 15px;">идея: ' +
                    '<a href="https://' + general.domain + '/info.php?' +
                    'id=436429" style="font-weight: bold;" target="_blank">' +
                    'Buger_man</a></span>', '27'],
                ['Форма аренды и продажи', 'При передаче предмета в аренду ' +
                    'форма передачи выделяется голубым цветом. Если предмет ' +
                    'продается или передается в постоянное пользование, то ' +
                    'красным. Если указана нулевая цена, выводится сообщение ' +
                    'с подтверждением продолжения операции.' +
                    this.getGitHubLink('rentAndSale'), '39']],

            'Ферма': [
                ['Производственный опыт и прибыль', 'Отображение ' +
                    'производственного опыта и прибыли в Гб за один час для ' +
                    'каждого растения.' +
                    this.getGitHubLink('farmExperience'), '9'],
                ['Таймер', 'Таймер для фермы. Звуковое оповещение когда ' +
                    'пора полить/собрать.<br><br>' +
                    this.getSelectSound('farmTmSound') + ' - звук когда пора ' +
                    'поливать/собирать (0 - без звука)<br>' +
                    '<input id="farmtmSndIntrvl" maxlength="3" ' +
                    'style="width: 40px;" disabled /> - интервал повторения ' +
                    'звука в секундах (0 - не повторять)' +
                    this.getGitHubLink('farmTimer'), '10'],
                ['Все растения на одной странице, счетчики', 'Счетчик гб и ' +
                    'производственного опыта на ферме. Для каждого растения ' +
                    'присутствует изображение, производственный опыт и ' +
                    'прибыль (общие и в 1 час), цена, время созревания в ' +
                    'минутах и часах.<br><br>' +
                    '<input id="showGbFarmCounter" type="checkbox" ' +
                    'disabled /> показывать счетчик Гб<br>' +
                    '<input id="showExpFarmCounter" type="checkbox" ' +
                    'disabled /> показывать счетчик производственног опыта' +
                    this.getGitHubLink('allPlantsOnFarm'), '13'],
                ['Играем без фермы', 'Убирает ссылку на ферму на главной ' +
                    'странице и на странице информации персонажа.' +
                    this.getGitHubLink('fuckTheFarm'), '25']]
        }; // 2}}}

        /**
         * @method showHideScriptInfo // {{{2
         */
        this.showHideScriptInfo = function () {
            var _this = this,
                info = _this.parentNode.lastElementChild;

            if (info.style.display) {
                info.style.display = '';
                _this.innerHTML = '[&minus;]';
            } else {
                info.style.display = 'none';
                _this.innerHTML = '[+]';
            }
        }; // 2}}}

        /**
         * @method onOffScript // {{{2
         */
        this.onOffScript = function () {
            var _this = this,
                ind = /chk(\d+)/.exec(_this.id)[1],
                hiddenDiv = _this.nextElementSibling,
                inp = hiddenDiv.querySelectorAll('input'),
                sel = hiddenDiv.querySelectorAll('select'),
                i;

            initScript[ind] = _this.checked ? '1' : '';
            general.setData(initScript, 1);

            // выкл/вкл элементы управления настройками
            for (i = 0; i < inp.length; i++) {
                inp[i].disabled = !_this.checked;
            }

            for (i = 0; i < sel.length; i++) {
                sel[i].disabled = !_this.checked;
            }
        }; // 2}}}

        /**
         * @method checkScriptUpdate // {{{2
         */
        this.checkScriptUpdate = function () {
            var url = 'https://' + general.domain + '/info.php?id=2095458';
            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var ver = /cpingw:(\d+\.\d+-\d+)/.exec(xml.responseText);
                if (ver && ver[1] !== general.version) {
                    general.$('linkNewVerScript').style.
                        visibility = 'visible';
                    general.$('refreshVer').innerHTML = '(' + ver[1] + ')';
                }
            }, null);
        }; // 2}}}

        /**
         * @method setSettingsForAdvBattleAll // {{{2
         */
        this.setSettingsForAdvBattleAll = function () {
            var _this = this,
                ind = _this.id === 'refreshBattle' ? 0 : 1,
                data = general.getData(4);

            data[ind] = new CheckInputText().init(_this, 0) ?
                    _this.value : '';
            general.setData(data, 4);
        }; // 2}}}

        /**
         * @method testSound // {{{2
         */
        this.testSound = function () {
            var _this = this;
            new PlaySound().init(_this.previousElementSibling.value);
        }; // 2}}}

        /**
         * @method modifyData // {{{2
         * @param   {int}       ind
         * @param   {int}       ind1
         * @param   {String}    val
         */
        this.modifyData = function (ind, ind1, val) {
            var tmp = general.getData(ind);
            tmp[ind1] = val;
            general.setData(tmp, ind);
        }; // 2}}}

        /**
         * @method init // {{{2
         */
        this.init = function () {
            general.doc.title = 'CPIGW :: Настройки';
            // noinspection HtmlUnknownAttribute
            var tdStyle = ' style="background-color: #E0FFE0;">',
                gwImgUrl = 'https://images.' +
                    general.domain.replace('www.', '') + '/i/home/',
                str = '<table style="width: 100%; box-shadow: 8px 10px 7px ' +
                    'rgba(122,122,122,0.5);"><tr><td ' + tdStyle +
                    '<table style="width: 100%;"><tr><td style="width: 23%;">' +
                    '<span style="color: #8C5B07; font-weight: bold;">' +
                    'Настройки:</span><img id="imgSaveSettings" ' +
                    'style="margin-left: 5px; cursor: pointer;" ' +
                    'src="' + gwImgUrl + 'ganjafile.gif" title="Сохранить" ' +
                    'alt="Сохранить" /><img id="imgRestoreSettings" ' +
                    'style="cursor: pointer; margin-left: 5px;" ' +
                    'src="' + gwImgUrl + 'cashlog.gif" title="Восстановить" ' +
                    'alt="Восстановить" /><img id="imgResetSettings" ' +
                    'style="cursor: pointer; margin-left: 5px;" ' +
                    'src="' + gwImgUrl + 'questlog.gif" title="Сбросить" ' +
                    'alt="Сбросить"  /></td>' +
                    '<td style="font-size: 8pt; text-align: center;">' +
                    '<a id="linkNewVerScript" target="_blank" ' +
                    'style="color: #FF0000; visibility: hidden;" href="' +
                    general.mainPath + '_' + general.selfName + '.user.js">' +
                    'Доступна новая версия</a> ' +
                    '<span id="refreshVer"></span></td>' +
                    '<td style="font-size: 7pt; width: 35%; text-align: ' +
                    'right;"><a target="_blank" style="opacity: 0.5; ' +
                    'text-decoration: none; font-size: 7pt;" ' +
                    'href="https://' + general.domain + '/info.php?' +
                    'id=2095458"><span style="color: #F90332;">developed by' +
                    '</span> <span style="color: #014305; font-weight: 700;">' +
                    'MyRequiem©</span></a> ' + general.version +
                    '<a target="_blank" title="История изменений" ' +
                    'href="' + general.mainPath + 'ChangeLog.txt" ' +
                    'style="text-decoration: none; margin: 0 5px 0 3px;">' +
                    '<img src="' + gwImgUrl + 'wlog.gif" border="0" ' +
                    'width="12" height="10" tile="Лог" alt="Лог" /></a></td>' +
                    '</tr><tr id="trRestoreSettings" style="display: none;">' +
                    '<td colspan="3"><span style="color: #C00000;">' +
                    'Восстановление настроек. Вставьте ранее сохраненную ' +
                    'строку настроек и нажмите "Восстановить"</span>:' +
                    '<br><input id="inpRestoreSettings" ' +
                    'style="width: 97%;" /><br>' +
                    '<input id="butRestoreSettings" type="button" ' +
                    'value="Восстановить" /></td></tr>' +
                    '<tr id="trSaveSettings" style="display: none;">' +
                    '<td colspan="3"><span style="color: #C00000;">' +
                    'Выделите &lt;Ctrl+A&gt; и сохраните &lt;Ctrl+C&gt; ' +
                    'содержимое поля для последующего восстановления ' +
                    'настроек</span>:<textarea id="textAreaSaveSettings" ' +
                    'cols="90" rows="7" readonly="true" style="resize: none; ' +
                    'width: 100%;"></textarea></td></tr></table></td></tr>',
                groupStyle = ' style="background-color: #D0EED0; text-align: ' +
                    'center; color: #990000;"><b>',
                spanStyle = ' style="cursor: pointer;">',
                hiddenDivStyle = ' style="display: none; padding: 0 10px ' +
                    '0 50px; background-color: #E7E7E7">',
                prop,
                i;

            // формирование таблицы настроек
            for (prop in this.infoScripts) {
                if (this.infoScripts.hasOwnProperty(prop)) {
                    str += '<tr><td' + groupStyle + prop + '</b></td></tr>';

                    for (i = 0; i < this.infoScripts[prop].length; i++) {
                        str += '<tr><td' + tdStyle + '<span' + spanStyle +
                            '[+]</span> ' + '<input id="chk' +
                            this.infoScripts[prop][i][2] +
                            '" type="checkbox" /> ' +
                            this.infoScripts[prop][i][0] + '<div' +
                            hiddenDivStyle + this.infoScripts[prop][i][1] +
                            '</div></td></tr>';
                    }
                }
            }

            str += '</table>';
            var settingsContainer = general.doc.querySelector('tr>td.txt' +
                    '[valign="top"]');
            settingsContainer.innerHTML = '<div></div>';
            settingsContainer = settingsContainer.firstElementChild;
            settingsContainer.setAttribute('style', 'margin: 10px 0 20px 0');
            settingsContainer.innerHTML = str;

            // проверка обновлений
            this.checkScriptUpdate();

            // обрабочики открытия/закрытия скрытых контейнеров описания
            // скрипта, обработчики чекбоксов и установка значений чекбоксов
            var spans = settingsContainer.
                    querySelectorAll('span[style="cursor: pointer;"]'),
                chkid,
                chk;

            for (i = 0; i < spans.length; i++) {
                spans[i].addEventListener('click',
                        this.showHideScriptInfo, false);
                chk = spans[i].nextElementSibling;
                chk.addEventListener('click', this.onOffScript, false);
                chkid = +(/chk(\d+)/.exec(chk.getAttribute('id')))[1];
                if (initScript[chkid]) {
                    chk.click();
                }
            }

            general.$('imgRestoreSettings').addEventListener('click',
                function () {
                    var trRestoreSettings = general.$('trRestoreSettings'),
                        trSaveSettings = general.$('trSaveSettings');

                    if (!trSaveSettings.style.display) {
                        trSaveSettings.style.display = 'none';
                    }

                    trRestoreSettings.style.display = trRestoreSettings.
                        style.display ? '' : 'none';
                }, false);

            general.$('imgSaveSettings').addEventListener('click', function () {
                var trSaveSettings = general.$('trSaveSettings'),
                    trRestoreSettings = general.$('trRestoreSettings');

                if (trSaveSettings.style.display) {
                    trRestoreSettings.style.display = 'none';
                    trSaveSettings.style.display = '';
                    general.$('textAreaSaveSettings').value = general.st.
                        getItem(general.STORAGENAME);
                } else {
                    trSaveSettings.style.display = 'none';
                }
            }, false);

            var butRestoreSettings = general.$('butRestoreSettings'),
                inpRestoreSettings = general.$('inpRestoreSettings');

            butRestoreSettings.addEventListener('click', function () {
                var val = inpRestoreSettings.value;
                if (!val) {
                    alert('Введите строку настроек');
                    return;
                }

                general.st.setItem(general.STORAGENAME, val);
                general.root.location.reload();
            }, false);

            inpRestoreSettings.addEventListener('keypress', function (e) {
                var ev = e || general.root.event;
                if (ev.keyCode === 13 || ev.keyCode === 10) {
                    butRestoreSettings.click();
                }
            }, false);

            general.$('imgResetSettings').addEventListener('click',
                function () {
                    if (confirm('Сброс настроек !!!\nВы уверены ???')) {
                        general.st.removeItem(general.STORAGENAME);
                        general.root.location.reload();
                    }
                }, false);

            // AdvBattleAll
            // обработчики текстовых полей модуля дополнений для боев
            general.$('refreshBattle').
                addEventListener('input',
                        this.setSettingsForAdvBattleAll, false);
            general.$('refreshAppl').
                addEventListener('input',
                        this.setSettingsForAdvBattleAll, false);

            var checkInputText = new CheckInputText().init,
                _this = this;

            // Показывать чекбокс "Сказать как координатор"
            // (вставка '!*' в поле чата боя)
            var showCoordButton = general.$('showCoordButton');
            showCoordButton.checked = general.getData(4)[25] === '1';
            showCoordButton.addEventListener('click', function () {
                _this.modifyData(4, 25, showCoordButton.checked ? '1' : '');
            }, false);

            // ###
            // # При нажатии на кнопку "Сказать ход"
            // ###
            // чекбокc "не выводить имя противника"
            var notWriteEnemyName = general.$('notWriteEnemyNameWhenSayMove');
            notWriteEnemyName.checked = general.getData(4)[27] === '1';
            notWriteEnemyName.addEventListener('click', function () {
                _this.modifyData(4, 27, notWriteEnemyName.checked ? '1' : '');
            }, false);
            // чекбокc "не выводить применяемые навыки"
            var notWriteSkills = general.$('notWriteSkillsWhenSayMove');
            notWriteSkills.checked = general.getData(4)[28] === '1';
            notWriteSkills.addEventListener('click', function () {
                _this.modifyData(4, 28, notWriteSkills.checked ? '1' : '');
            }, false);

            // выбор звука начала боя и начала хода
            var advBattleSound1 = general.$('advBattleSound1'),
                advBattleSound2 = general.$('advBattleSound2');
            advBattleSound1.value = general.getData(4)[21] || '0';
            advBattleSound1.addEventListener('change', function () {
                _this.modifyData(4, 21, advBattleSound1.value === '0' ?
                        '' : advBattleSound1.value);
            }, false);
            advBattleSound2.value = general.getData(4)[22] || '0';
            advBattleSound2.addEventListener('change', function () {
                _this.modifyData(4, 22, advBattleSound2.value === '0' ?
                        '' : advBattleSound2.value);
            }, false);
            general.$('ladvBattleSound1').
                addEventListener('click', this.testSound, false);
            general.$('ladvBattleSound2').
                addEventListener('click', this.testSound, false);

            // чекбокс настроек подсветки персонажей из черного списка
            // (блокировать или нет ссылку принятия боя в одиночках)
            var chkBL = general.$('blockBLOne2One');
            chkBL.checked = general.getData(5)[1] === '1';
            chkBL.addEventListener('click', function () {
                _this.modifyData(5, 1, chkBL.checked ? '1' : '');
            }, false);

            // работа, слом, грена, почта/посылка
            // кнопки прослушать звук
            general.$('lsoundSms').
                addEventListener('click', this.testSound, false);
            general.$('lsoundWork').
                addEventListener('click', this.testSound, false);

            // установка списка выбора звуков sms и "Пора работать"
            var soundSms = general.$('soundSms');
            soundSms.value = general.getData(6)[6] || '0';
            // обработчики списков выбора звука
            soundSms.addEventListener('change', function () {
                _this.modifyData(6, 6, soundSms.value === '0' ?
                        '' : soundSms.value);
            }, false);
            var soundWork = general.$('soundWork');
            soundWork.value = general.getData(6)[7] || '0';
            soundWork.addEventListener('change', function () {
                _this.modifyData(6, 7, soundWork.value === '0' ?
                        '' : soundWork.value);
            }, false);
            // чекбоксы настроек
            var showWork = general.$('showwork');
            showWork.checked = general.getData(6)[2];
            showWork.addEventListener('click', function () {
                _this.modifyData(6, 2, showWork.checked ? '1' : '');
            }, false);
            var showSms = general.$('showsms');
            showSms.checked = general.getData(6)[3];
            showSms.addEventListener('click', function () {
                _this.modifyData(6, 3, showSms.checked ? '1' : '');
            }, false);
            var showBroken = general.$('showbroken');
            showBroken.checked = general.getData(6)[4];
            showBroken.addEventListener('click', function () {
                _this.modifyData(6, 4, showBroken.checked ? '1' : '');
            }, false);
            var showGren = general.$('showgren');
            showGren.checked = general.getData(6)[5];
            showGren.addEventListener('click', function () {
                _this.modifyData(6, 5, showGren.checked ? '1' : '');
            }, false);

            // ссылки в логе боя, критические выстрелы
            var showCrits = general.$('showcrits');
            showCrits.checked = general.getData(7)[0];
            showCrits.addEventListener('click', function () {
                general.setData(showCrits.checked ? '1' : '', 7);
            }, false);

            // удаление личных сообщений
            var syndMail = general.$('syndmail');
            syndMail.checked = general.getData(8)[0];
            syndMail.addEventListener('click', function () {
                _this.modifyData(8, 0, syndMail.checked ? '1' : '');
            }, false);
            var robotMail = general.$('robotmail');
            robotMail.checked = general.getData(8)[1];
            robotMail.addEventListener('click', function () {
                _this.modifyData(8, 1, robotMail.checked ? '1' : '');
            }, false);
            var importantMail = general.$('importantmail');
            importantMail.checked = general.getData(8)[2];
            importantMail.addEventListener('click', function () {
                _this.modifyData(8, 2, importantMail.checked ? '1' : '');
            }, false);

            // FarmTimer
            general.$('lfarmTmSound').
                addEventListener('click', this.testSound, false);
            var farmTmSound = general.$('farmTmSound');
            farmTmSound.value = general.getData(9)[4] || '0';
            farmTmSound.addEventListener('change', function () {
                _this.modifyData(9, 4, farmTmSound.value === '0' ?
                        '' : farmTmSound.value);
            }, false);
            var farmTmSoundInterval = general.$('farmtmSndIntrvl');
            farmTmSoundInterval.value = general.getData(9)[5] || '0';
            farmTmSoundInterval.addEventListener('input', function () {
                _this.modifyData(9, 5, checkInputText(farmTmSoundInterval, 0) ?
                        farmTmSoundInterval.value : '60');
            }, false);

            // TimeNpc
            general.$('lsoundTimerNPC').
                addEventListener('click', this.testSound, false);
            var soundTimerNPC = general.$('soundTimerNPC');
            soundTimerNPC.value = general.getData(10)[3] || '0';
            soundTimerNPC.addEventListener('change', function () {
                _this.modifyData(10, 3, soundTimerNPC.value === '0' ?
                        '' : soundTimerNPC.value);
            }, false);

            // PersonalNPCNotifications
            general.$('lsoundPersNPC1').
                addEventListener('click', this.testSound, false);
            var soundPersNPC1 = general.$('soundPersNPC1');
            soundPersNPC1.value = general.getData(18)[0] || '0';
            soundPersNPC1.addEventListener('change', function () {
                _this.modifyData(18, 0, soundPersNPC1.value === '0' ?
                        '' : soundPersNPC1.value);
            }, false);

            general.$('lsoundPersNPC2').
                addEventListener('click', this.testSound, false);
            var soundPersNPC2 = general.$('soundPersNPC2');
            soundPersNPC2.value = general.getData(18)[1] || '0';
            soundPersNPC2.addEventListener('change', function () {
                _this.modifyData(18, 1, soundPersNPC2.value === '0' ?
                        '' : soundPersNPC2.value);
            }, false);

            // AllPlantsOnFarm
            var showGbFarmCounter = general.$('showGbFarmCounter');
            showGbFarmCounter.checked = general.getData(11)[4];
            showGbFarmCounter.addEventListener('click', function () {
                _this.modifyData(11, 4, showGbFarmCounter.checked ?
                        '1' : '');
            }, false);
            var showExpFarmCounter = general.$('showExpFarmCounter');
            showExpFarmCounter.checked = general.getData(11)[5];
            showExpFarmCounter.addEventListener('click', function () {
                _this.modifyData(11, 5, showExpFarmCounter.checked ?
                        '1' : '');
            }, false);

            // FilterResOnStat
            var filtRes = general.$('filter_res');
            filtRes.value = general.getData(15)[0];
            filtRes.addEventListener('input', function () {
                general.setData(filtRes.value, 15);
            }, false);

            // One2OneCallerInfo
            general.$('lsoundOne2One').
                addEventListener('click', this.testSound, false);
            var soundOne2One = general.$('soundOne2One');
            soundOne2One.value = general.getData(21)[0] || '0';
            soundOne2One.addEventListener('change', function () {
                _this.modifyData(21, 0, soundOne2One.value === '0' ?
                        '' : soundOne2One.value);
            }, false);

            // SoundSyndBattle
            if (!general.getData(28)[0]) {
                this.modifyData(28, 0, '90');
            }
            var timeSyndSoundLimit = general.$('timeSyndSoundLimit'),
                sptssl = general.doc.querySelectorAll('span[name="sptssl"]');
            sptssl[0].innerHTML = general.getData(28)[0];
            sptssl[1].innerHTML = general.getData(28)[0];
            timeSyndSoundLimit.addEventListener('input', function () {
                _this.modifyData(28, 0, checkInputText(timeSyndSoundLimit, 15) ?
                        timeSyndSoundLimit.value : '90');
                sptssl[0].innerHTML = general.getData(28)[0];
                sptssl[1].innerHTML = general.getData(28)[0];
            }, false);

            var syndSoundBattle1 = general.$('syndSoundBattle1'),
                syndSoundBattle2 = general.$('syndSoundBattle2');
            syndSoundBattle1.value = general.getData(28)[1] || '0';
            syndSoundBattle1.addEventListener('change', function () {
                _this.modifyData(28, 1, syndSoundBattle1.value === '0' ?
                        '' : syndSoundBattle1.value);
            }, false);
            syndSoundBattle2.value = general.getData(28)[2] || '0';
            syndSoundBattle2.addEventListener('change', function () {
                _this.modifyData(28, 2, syndSoundBattle2.value === '0' ?
                        '' : syndSoundBattle2.value);
            }, false);
            general.$('lsyndSoundBattle1').
                addEventListener('click', this.testSound, false);
            general.$('lsyndSoundBattle2').
                addEventListener('click', this.testSound, false);

            // Regeneration
            var sound80HP = general.$('sound80HP'),
                sound100HP = general.$('sound100HP');
            sound80HP.value = general.getData(31)[0] || '0';
            sound80HP.addEventListener('change', function () {
                _this.modifyData(31, 0, sound80HP.value === '0' ?
                        '' : sound80HP.value);
            }, false);
            sound100HP.value = general.getData(31)[1] || '0';
            sound100HP.addEventListener('change', function () {
                _this.modifyData(31, 1, sound100HP.value === '0' ?
                        '' : sound100HP.value);
            }, false);
            general.$('lsound80HP').
                addEventListener('click', this.testSound, false);
            general.$('lsound100HP').
                addEventListener('click', this.testSound, false);
        }; // 2}}}
    }; // 1}}}

    /**
     * @lends ShowMainSettings.prototype {{{1
     */
    ShowMainSettings.prototype = {
        /**
         * @method getGitHubLink
         * @param   {String}    scriptName
         * @return  {String}
         */
        getGitHubLink: function (scriptName) {
            var gitHubPage = 'https://github.com/MyRequiem/' +
                    general.selfName + '/tree/master/separatedScripts/';

            return '<br><a target="_blank" href="' + gitHubPage +
                scriptName[0].toUpperCase() + scriptName.substr(1) +
                '" style="color: #0000FF;">' + scriptName + '.user.js</a>';
        }
    }; // 1}}}

    /**
     * @class SetPoints {{{1
     * @constructor
     */
    var SetPoints = function () {
        /**
         * @method init
         * @param   {String|int}    num
         * @param   {String}        separator
         * @param   {Boolean}       flagSign
         * @return  {String}
         */
        this.init = function (num, separator, flagSign) {
            var x = +num,
                sign = x > 0 && flagSign ? '+' : '',
                i;

            if (isNaN(x)) {
                return 'NaN';
            }

            x = x.toString().split('').reverse();
            for (i = 2; i < x.length; i += 3) {
                if (x[i] === '-' || !x[i + 1] || x[i + 1] === '-') {
                    break;
                }

                x[i] = separator + x[i];
            }

            return sign + x.reverse().join('');
        };
    }; // 1}}}

    /**
     * @class GetPos {{{1
     * @constructor
     */
    var GetPos = function () {
        /**
         * @method init
         * @param   {Object}   obj
         * @return  {Object}
         */
        this.init = function (obj) {
            var _obj = obj,
                x = 0,
                y = 0;

            while (_obj) {
                x += _obj.offsetLeft;
                y += _obj.offsetTop;
                _obj = _obj.offsetParent;
            }

            return {x: x, y: y};
        };
    }; // 1}}}

    /**
     * @class NotGiveCannabisLeaf {{{1
     * @constructor
     */
    var NotGiveCannabisLeaf = function () {
        /**
         * @method  changeFavicon
         */
        this.changeFavicon = function () { // {{{2
            var head = general.doc.querySelector('head');

            if (head) {
                var linkTags = head.querySelectorAll('link[rel*="icon"]'),
                    i;

                for (i = 0; i < linkTags.length; i++) {
                    head.removeChild(linkTags[i]);
                }

                var link = general.doc.createElement('link');
                link.setAttribute('type', 'image/x-icon');
                link.setAttribute('rel', 'shortcut icon');
                link.setAttribute('href', 'https://raw.githubusercontent.' +
                    'com/MyRequiem/comfortablePlayingInGW/master/imgs/' +
                    'NotGiveCannabisLeaf/favicon.ico');
                head.appendChild(link);
            }
        }; // 2}}}

        /**
         * @method  changeIcons {{{2
         */
        this.changeIcons = function () {
            var imgPath = general.imgPath + 'NotGiveCannabisLeaf/',
                imgOn = imgPath + 'on.gif',
                imgOff = imgPath + 'off.gif',
                imgs = general.doc.querySelectorAll('img'),
                src,
                i;

            for (i = 0; i < imgs.length; i++) {
                src = imgs[i].getAttribute('src');
                if (/\/i\/gon\.gif|\/info\.online\.php\?id=/.test(src)) {
                    imgs[i].setAttribute('src', imgOn);
                } else if (/\/i\/goff\.gif/.test(src)) {
                    imgs[i].setAttribute('src', imgOff);
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            this.changeFavicon();
            // noinspection JSUnresolvedVariable
            if (!/\/news\.php\?set=1/.test(general.loc)) {
                this.changeIcons();
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class AdditionForNavigationBar {{{1
     * @constructor
     */
    var AdditionForNavigationBar = function () {
        /**
         * @property navigPanel
         * @type {HTMLElement|null}
         */
        this.navigPanel = null;
        /**
         * @property divMain
         * @type {HTMLDivElement|null}
         */
        this.divMain = null;

        /**
         * @method addLink {{{2
         * @param   {Node}  link
         */
        this.addLink = function (link) {
            // добавление в панель
            var target = this.navigPanel.
                    lastElementChild.previousSibling;
            this.navigPanel.insertBefore(general.doc.createTextNode(' | '),
                    target);
            this.navigPanel.insertBefore(link, target);

            // добавление ссылки и кнопы ее удаления в основной div
            var divLink = general.doc.createElement('div');

            var linkClone = link.cloneNode(true);
            linkClone.style.fontSize = '9pt';
            divLink.appendChild(linkClone);

            var delLinkButton = general.doc.createElement('span');
            delLinkButton.setAttribute('style', 'margin-left: 2px; ' +
                    'cursor: pointer; font-size: 7pt;');
            delLinkButton.innerHTML = '[x]';
            divLink.appendChild(delLinkButton);

            this.divMain.insertBefore(divLink,
                    this.divMain.lastElementChild);

            // обработчик кнопы удаления ссылки
            var _this = this;
            delLinkButton.addEventListener('click', function () {
                var thisLink = this,
                    linkName = thisLink.previousElementSibling.innerHTML,
                    allPanelLinks = _this.navigPanel.querySelectorAll('a'),
                    i;

                // удаляем ссылку из панели
                for (i = 0; i < allPanelLinks.length; i++) {
                    if (allPanelLinks[i].innerHTML === linkName) {
                        _this.navigPanel.removeChild(allPanelLinks[i].
                            previousSibling);
                        _this.navigPanel.removeChild(allPanelLinks[i]);
                        break;
                    }
                }

                // удаляем ссылку из div'а
                _this.divMain.removeChild(thisLink.parentNode);

                // удаляем запись из хранилища
                var dataSt = JSON.parse(general.getData(2)[0]),
                    temp = {},
                    name;

                for (name in dataSt) {
                    if (dataSt.hasOwnProperty(name)) {
                        if (name === linkName) {
                            continue;
                        }

                        temp[name] = dataSt[name];
                    }
                }

                general.setData(JSON.stringify(temp), 2);
            }, false);
        }; // 2}}};

        /**
         * @method createLink {{{2
         * @param   {String}    name
         * @param   {Array}     attr    href, style
         * @return  {HTMLElement}
         */
        this.createLink = function (name, attr) {
            var link = general.doc.createElement('a');
            link.setAttribute('style', 'color: #669966; text-decoration: ' +
                    'none; font-size: 7pt;' + attr[1]);
            link.innerHTML = name;
            link.href = attr[0];
            return link;
        }; // 2}}}

        /**
         * @method clearFields {{{2
         */
        this.clearFields = function () {
            general.$('lname').value = '';
            general.$('lhref').value = '';
            general.$('lstyle').value = '';
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            this.navigPanel = general.DESIGN_VERSION === 'v2' ?
                    general.doc.querySelector('div[style="position: ' +
                        'relative; left: 0; top: 0; width:100%; ' +
                        'font-size:7pt;color:#669966;"] ' +
                        'center:first-child') :
                    general.doc.querySelector('td[style="font-size:7pt;' +
                        'color:#669966;"]');

            if (!this.navigPanel) {
                return;
            }

            var dataSt = general.getData(2)[0];
            if (!dataSt) {
                dataSt = '{}';
                general.setData(dataSt, 2);
            }

            dataSt = JSON.parse(dataSt);

            // добавляем в панель кнопу для создания ссылки
            var addLinkButton = general.doc.createElement('span');
            addLinkButton.setAttribute('style', 'cursor: pointer;');
            addLinkButton.innerHTML = '+';
            this.navigPanel.appendChild(general.doc.createTextNode(' | '));
            this.navigPanel.appendChild(addLinkButton);

            var _this = this;
            // обработчик открытия/закрытия div'а
            addLinkButton.addEventListener('click', function () {
                _this.divMain.style.display = _this.divMain.style.display ?
                        '' : 'none';
                _this.clearFields();
            }, false);

            // div для добавления ссылок
            var divAddLink = general.doc.createElement('div');
            divAddLink.setAttribute('style', 'margin-top: 5px;');
            divAddLink.innerHTML = 'Название:<br><input id="lname" ' +
                'maxlength="20" style="width: 237px;" /><br>' +
                'Ссылка:<br><input id="lhref" style="width: 237px;" />' +
                '<br>Стиль, например: "color: blue;"<br>' +
                '<input id="lstyle" style="width: 237px;" />' +
                '<br><span id="set_link" style="cursor: pointer; color: ' +
                '#0000FF;">Добавить</span><span id="hide_nav_div" ' +
                'style="cursor: pointer; margin-left: 20px; color: ' +
                '#FF0000;">Закрыть</span>';
            this.divMain = general.doc.createElement('div');
            this.divMain.appendChild(divAddLink);

            var pos = new GetPos().init(addLinkButton);
            this.divMain.setAttribute('style', 'position: absolute; ' +
                'display: none; border: 1px #339933 solid; background: ' +
                '#F0FFF0; width: 240px; font-size: 8pt; padding: 3px; ' +
                'left: ' + (pos.x - 260) + '; top: ' + (pos.y + 12) + ';');
            general.doc.body.appendChild(this.divMain);

            // добавляем ссылки из хранилища в панель и в div
            var linkName, lnk;
            for (linkName in dataSt) {
                // noinspection JSUnresolvedVariable
                if (dataSt.hasOwnProperty(linkName)) {
                    lnk = this.createLink(linkName, dataSt[linkName]);
                    this.addLink(lnk);
                }
            }

            // кнопа закрытия div'а
            general.$('hide_nav_div').addEventListener('click',
                function () {
                    _this.clearFields();
                    _this.divMain.style.display = 'none';
                }, false);

            // обработчик кнопы добавления ссылки
            general.$('set_link').addEventListener('click', function () {
                var name = general.$('lname').value,
                    href = general.$('lhref').value,
                    style = general.$('lstyle').value;

                if (!name || !href) {
                    alert('Не верно введены данные');
                    return;
                }

                var allPanelLinks = _this.navigPanel.querySelectorAll('a'),
                    i;

                for (i = 0; i < allPanelLinks.length; i++) {
                    if (allPanelLinks[i].innerHTML === name) {
                        alert('Ссылка с таким названием уже существует');
                        return;
                    }
                }

                // создаем ссылку и втыкаем ее в панель и в div
                var newLink = _this.createLink(name, [href, style]);
                _this.addLink(newLink);

                // добавляем данные в хранилище
                var dtSt = JSON.parse(general.getData(2)[0]);
                dtSt[name] = [href, style];
                general.setData(JSON.stringify(dtSt), 2);

                _this.clearFields();
            }, false);
        }; // 2}}};
    }; // 1}}}

    /**
     * @class AdvBattleAll {{{1
     * @constructor
     */
    var AdvBattleAll = function () {
        /**
         * @property inpTextChat
         * @type {HTMLInputElement|null}
         */
        this.inpTextChat = null;
        /**
         * @property myInfoTopPanel
         * @type {HTMLTableCellElement|null}
         */
        this.myInfoTopPanel = null;
        /**
         * @property tooltip
         * @type {HTMLDivElement|null}
         */
        this.tooltip = null;
        // noinspection JSUnusedGlobalSymbols
        /**
         * @property intervalUpdateInpTextChat
         * @type {int}
         */
        this.intervalUpdateInpTextChat = 0;
        /**
         * @property sayMoveButton
         * @type {HTMLInputElement|null}
         */
        this.sayMoveButton = null;
        /**
         * @property enemies
         * @type {Object|null}
         */
        this.enemies = null;
        /**
         * @property leftRightCommands
         * @type {Array}
         */
        this.leftRightCommands = [];
        /**
         * @property allFighters
         * @type {Object}
         */
        // объекты всех бойцов на поле
        // {"name": {"hp": x, ...}, "name": {...}, ... }
        this.allFighters = {};
        /**
         * @property leftPers
         * @type {Array|null}
         */
        this.leftPers = null;
        /**
         * @property rightPers
         * @type {Array|null}
         */
        this.rightPers = null;
        /**
         * @property myPers
         * @type {Object|null}
         */
        this.myPers = null;
        /**
         * @property imgPath
         * @type {String}
         */
        this.imgPath = general.imgPath + 'AdvBattleAll/';
        // noinspection JSUnusedGlobalSymbols
        /**
         * @property tmRefreshBattle
         * @type {int}
         */
        this.tmRefreshBattle = 0;
        // noinspection JSUnusedGlobalSymbols
        /**
         * @property tmHighlightPers
         * @type {int}
         */
        this.tmHighlightPers = 0;
        // noinspection JSUnusedGlobalSymbols
        /**
         * @property graphTable
         * @type {HTMLTableElement|null}
         */
        this.graphTable = null;
        // noinspection JSUnusedGlobalSymbols
        /**
         * @property checkSound
         * @type {Boolean}
         */
        this.checkSound = true;
        /**
         * @property weapon {{{2
         * @type {Object}
         */
        this.rangeWeapon = {
            // Пистолеты
            'magnum': '1',
            'pm': '0',
            'rbcat': '0',
            'ttgun': '0',
            'eagle': '0',
            // Штурмовые винтовки гос
            'ak47': '2',
            'schmeisser': '2',
            'm16': '2',
            'ak_74': '2',
            'l1a1': '4',
            'aks': '0',
            'hk53': '4',
            'sg541': '6',
            'xm8': '6',
            'steyr': '7',
            'trw': '8',
            'sig': '10',
            'stg44': '8',
            'm14': '10',
            'sar': '12',
            'cz_sa': '12',
            'g3': '10',
            'fara83': '12',
            'g3aa': '10',
            'arx160': '12',
            'sr88': '12',
            'fnfal': '12',
            'm82': '13',
            'fs2000': '14',
            'fnscar': '15',
            'aps95': '16',
            'bofors': '16',
            'm17s': '18',
            'hk417': '20',
            'vektor': '22',
            'sw_m203': '20/1',
            'tiger': '24',
            'soar': '28',
            'sw_gl1': '26/2',
            'hk762': '21',
            'enfield80': '26',
            'cz805': '28',
            'm468': '29',
            // Штурмовые винтовки арт
            'g11': '4',
            'oicw': '6',
            'an94': '10',
            'f2000': '12',
            'fnfnc': '13',
            'hk_416': '14',
            'groza': '14',
            'ka90': '15',
            'taiga': '16',
            'xcr': '17',
            'tkb517': '18',
            'steyr_a3': '20',
            'ak103': '20',
            'g36': '22',
            'g41': '24',
            'sig552': '26',
            'sw_gp34': '24/1',
            'ace': '28',
            'sc2010': '32',
            'sw_m6': '28/3',
            'colt692': '24',
            'thales': '30',
            // встроенный подствол:
            // дальность оружия, подствола и радиус поражения подствола
            'thales_grl': '30/28/1',
            'rec7': '32',
            'sigmcx': '34',
            // Штурмовые винтовки аренда
            'colt_extreme': '26',
            'lr300': '30',
            'sig750': '34',
            // Снайперское оружие гос
            'svdmini': '4',
            'l96': '8',
            '149s': '8',
            'cz527': '10',
            'm40': '12',
            'police': '14',
            'mauser': '12',
            'remington700': '14',
            'psg': '15',
            'ssg': '14',
            'm76': '16',
            'svd': '16',
            'om50': '16',
            'ssg2000': '16',
            'b94': '15',
            'ssg3000': '18',
            'falcon': '16',
            'f2': '18',
            'm24': '20',
            'savage10fp': '18',
            'steyr_iws': '20',
            'ulr338': '20',
            'savage100fp': '22',
            'tikka': '24',
            'cz700': '26',
            'bora': '26',
            'ksv': '28',
            'amr2': '30',
            'fd308': '25',
            'r11': '28',
            'bor762': '30',
            'ultima': '30',
            'gepard': '31',
            // Снайперское оружие арт
            'barret': '18',
            'bfg': '20',
            'tactical600': '20',
            'pgm': '18',
            'm89sr': '20',
            'm107': '20',
            'vssk': '22',
            'rt20': '22',
            'cs5': '22',
            'barret_xm500': '24',
            'm85': '26',
            'steyr_ste': '28',
            'rangemaster': '28',
            'mauser93': '30',
            'sateravi': '34',
            'ar10': '28',
            'thor': '32',
            'awm': '34',
            'm110': '34',
            'msr': '35',
            // Снайперское оружие аренда
            'blaser_93': '30',
            'blaser-t': '32',
            'sharpshooter': '36',
            // Пистолеты-пулемёты гос
            'uzi': '0',
            'calico': '0',
            'lf57': '1',
            'ump': '0',
            'gg95': '3',
            'm4': '4',
            'mas38': '4',
            'kashtan': '8',
            'suomi': '8',
            'ingram': '8',
            'colt': '8',
            'walther': '10',
            'fmk3': '10',
            'vihr': '10',
            'saf': '7',
            'mpi81': '10',
            'agram': '12',
            'bizon': '14',
            'kedr': '16',
            'colt636': '20',
            'scorpionevo': '22',
            'berettamx4': '24',
            'fmg9': '26',
            'gilboa': '28',
            'pmx': '30',
            // Пистолеты-пулемёты арт
            'mp5': '4',
            'berettam12': '10',
            'scorpion': '12',
            'stkinetics': '10',
            'p90': '12',
            '90m1': '13',
            'mp7': '15',
            'kriss2': '22',
            'mtar21': '24',
            'pm06': '26',
            'uzipro': '28',
            'apc9': '30',
            'mpx': '32',
            // Пулемёты гос
            'fn_min': '1',
            'lewis': '2',
            'type95': '2',
            'fnmag': '4',
            'bren': '6',
            'l86': '4',
            'm16a2': '6',
            'mg3': '6',
            'type62': '6',
            'ar70': '6',
            'p41': '6',
            'saw': '6',
            'zb53': '7',
            'nsv': '6',
            'type67': '7',
            'galil': '7',
            'sig710': '8',
            'm60': '8',
            'vickers': '10',
            'vz59': '12',
            'mg4': '12',
            'mg36': '12',
            'm61': '14',
            'aat': '14',
            'xm312': '16',
            'sturm': '18',
            'sw_ubl37': '20/1',
            'venom': '20',
            'zastava': '24',
            'fort401': '16',
            'vektorss77': '22',
            'xm806': '24',
            'kord': '26',
            // Пулемёты арт
            'pkp': '6',
            'ameli': '8',
            'hk21': '8',
            'rpk74': '10',
            'pkm': '9',
            'm16lmg': '10',
            'aa52': '11',
            'mg43': '13',
            'pssg': '14',
            'ares16': '14',
            'spitfire': '15',
            'pkms': '16',
            'minigun762': '18',
            'mg50': '20',
            'ultimax': '22',
            'sw_agc': '25/1',
            'shrike': '24',
            'mg5': '28',
            'ng7': '20',
            'lwmmg': '26',
            'hk121': '28',
            'ukm': '30',
            // Пулемёты аренда
            'minigun_heavy': '24',
            'sigmg': '28',
            'hk221': '32',
            // Дробовики гос
            'winchester1200': '0',
            'hunter': '0',
            'remington': '2',
            'sgun2': '3',
            'm37': '4',
            'toz': '7',
            'jackhammer': '1',
            'spas12': '0',
            'striker': '2',
            'saiga': '10',
            'rmb93': '4',
            'neostead': '6',
            'xm26': '20',
            'hawk': '2',
            'benelli': '12',
            'liberator': '16',
            'spas15': '18',
            'r8': '22',
            'sw_gl1_sg': '26/2',
            'versamax': '22',
            'fnslp': '24',
            'srm1216': '26',
            // Дробовики арт
            'mossberg': '12',
            'vepr': '12',
            'mag7': '7',
            'usas12': '14',
            'sw_xgl40_sg': '22/1',
            'ksg': '18',
            'usas15': '22',
            'uts15': '26',
            'sw_m6_sg': '28/3',
            'fabarm': '28',
            'origin12s': '30',
            'xtr12': '32',
            // Гранатометы гос
            'rpg': '5/1',
            'ptrk': '12/2',
            'glauncher': '8/1',
            'grg': '10/1',
            'paw20': '12/2',
            'rpgu': '14/3',
            'grom2': '10/1',
            'ags30': '16/1',
            'gm94': '8/2',
            'gl06': '8/2',
            'gmg': '17/2',
            'balkan': '20/2',
            'rg6': '24/2',
            'm202': '20/5',
            'mm1': '24/4',
            // Гранатометы арт
            'mk47': '27/3',
            'm32': '28/4',
            // Гранаты гос
            'r10': '20/2',
            'emp_irs': '10/0',
            'emp_a': '20/0',
            'rgd5': '5/1',
            'grenade_f1': '3/2',
            'rgd2': '10/0',
            'lightst': '10/0',
            'lights': '10/0',
            'rkg3': '6/0',
            'mdn': '5/3',
            'rgd2m': '10/0',
            'rgo': '6/2',
            'm84': '16/0',
            'rgn': '8/0',
            'emp_ir': '10/0',
            'fg3l': '6/2',
            'l83a1': '20/0',
            'emp_s': '10/0',
            'm67': '8/0',
            'm3': '8/2',
            'hg78': '10/1',
            'hg84': '12/1',
            'fg6': '10/1',
            'anm14': '8/1',
            'm34ph': '8/2',
            'fg7': '12/1',
            'fg8bd': '16/2',
            // Гранаты синдовые
            'lightsm': '20/0',
            'grenade_dg1': '20/0',
            'ghtb': '12/1',
            'lightss': '12/0',
            'rgd2s': '15/0',
            'fg5': '6/2',
            'molotov': '6/1',
            'hellsbreath': '10/1',
            'napalm': '10/2',
            'me85': '17/2',
            // Гранаты лут
            'old_rgd5': '5/1',
            // Специальное оружие
            'rogatka': '0',
            'saw_airsoft': '0',
            'pb_marker': '2',
            'potato2': '0',
            // Турели
            'heavysg': '60',
            'tavor': '60',
            'larue': '60',
            'ga2gl': '60',
            // другое
            '11y_revolver': '0'
        }; // 2}}};
        /**
         * @property art {{{2
         * @type {Array}
         */
        this.art = [
            'g11', 'oicw', 'an94', 'f2000', 'fnfnc', 'hk_416', 'groza', 'ka90',
            'taiga', 'xcr', 'tkb517', 'steyr_a3', 'ak103', 'g36', 'g41',
            'sig552', 'sw_gp34', 'ace', 'sc2010', 'sw_m6', 'colt692', 'thales',
            'thales_grl', 'rec7', 'sigmcx', 'pkp', 'ameli', 'hk21', 'rpk74',
            'pkm', 'm16lmg', 'aa52', 'mg43', 'pssg', 'ares16', 'spitfire',
            'pkms', 'minigun762', 'mg50', 'ultimax', 'sw_agc', 'shrike',
            'mg5', 'ng7', 'lwmmg', 'hk121', 'ukm', 'barret', 'bfg',
            'tactical600', 'pgm', 'm89sr', 'm107', 'vssk', 'rt20', 'cs5',
            'barret_xm500', 'm85', 'steyr_ste', 'rangemaster', 'mauser93',
            'sateravi', 'ar10', 'thor', 'awm', 'm110', 'msr', 'mp5',
            'berettam12', 'scorpion', 'stkinetics', 'p90', '90m1', 'mp7',
            'kriss2', 'mtar21', 'pm06', 'uzipro', 'apc9', 'mpx', 'mossberg',
            'vepr', 'mag7', 'usas12', 'ksg', 'usas15', 'uts15', 'sw_m6_sg',
            'fabarm', 'origin12s', 'xtr12', 'mk47', 'm32', 'bronik3c',
            'bronik4c', 'bronik5c', 'bronik6c', 'blackhawk', 'armour_p300',
            'blackcell', 'rbr', 'armour_patrol', 'delta5', 'mr1_armour',
            'delta7', 'fav', 'protector', 'sandsarmour', 'ar500', 'lwhelmet',
            'empires', 'sas_helmet', 'chelmet', 'spectra', 'arhelmet',
            'fasthelmet', 'helmetmk6', 'mpas', 'g15helmet', 'ksfhelmet',
            'predatorhelmet', 'mwshelmet', 'lowshieldc', 'cboots', 'shields_la',
            'hboots', 'dboots', 'swatboots', 'cobraboots', 'officerboots',
            'bootspec', 'spiderboots', 'dwboots', 'sandsboots', 'maskl',
            'rockycamo', 'predator', 'mesh', 'forester', 'jackpyke', 'swatcamo',
            'deltamask', 'woodsman', 'ilight', 'deye', 'nighthawk', 'atn14',
            'edge', 'nvg1', 'pvs21', 'irgs1', 'nyx7', 'nokia9500', 'fieldcomp',
            'attackbelt', 'ammobelt', 'bomberbelt', 'mealpack', 'eaglebag',
            'cbelt', 'commandobelt', 'loadbelt', 'armybag', 'fan', 'brelok',
            'cigar', 'clocks', 'gift_wallet', 'gift_watch', 'lighter',
            'saperka3', 'watch_ganjarmani', 'armyknife', 'uniknife', 'nrs2',
            'gt_multitool', 'ctactical', 'flask_gt', 'nokia9500', 'n81', 'n95',
            'armygps', 'gwatch', 'ganjapad', 'radio_srx', 'gwsat45',
            'tacticalgps', 'oldcompass', 'bottleopener', 'ganjacup', 'pendant',
            'flashlight', 'heartglasses', 'radio_gw148', 'bors', 'ganjacola2',
            'mentats2', 'minimedikit', 'medikit', 'bigmedikit', 'slr', 'apache',
            'mi8', 'cadillac', 'chinook', 'harley', 'ch148', 'irvs12', 'jscamo',
            'tactilight', 'gwtab7', 'triforce_xb', 'gcombatflask'
        ]; // 2}}}
        /**
         * @property rent {{{2
         * @type {Array}
         */
        this.rent = [
            'minigun_heavy', 'sigmg', 'hk221', 'colt_extreme', 'lr300',
            'sig750', 'blaser_93', 'blaser-t', 'sharpshooter', 'irlights',
            'mask_hawster', 'mask_hawster1', 'nokia8800', 'nokia8800_se',
            'tesla_armour'
        ]; // 2}}}

        /**
         * @metod getRandom1to3 {{{2
         * @return  {int}
         */
        this.getRandom1to3 = function () {
            return Math.round(Math.random() * 1000) % 3 + 1;
        }; // 2}}}

        /**
         * @method clearSavedStrokeAfterSay {{{2
         */
        this.clearSavedStrokeAfterSay = function () {
            var dataSt = general.getData(4);
            dataSt[11] = '';
            dataSt[12] = '';
            dataSt[13] = '';
            dataSt[14] = '';
            dataSt[15] = '';
            dataSt[16] = '';
            dataSt[19] = '';
            dataSt[20] = '';
            dataSt[24] = '';
            general.setData(dataSt, 4);
        }; // 2}}}

        /**
         * @metod sayMove {{{2
         * @param   {Object}    _this
         * @param   {Boolean}   fake
         */
        this.sayMove = function (_this, fake) {
            /**
             * fake - если нажали <Enter> в поле ввода или кнопку "Написать",
             *  (т.е. отправляем обычное сообщение), то реально не говорим ход,
             *  а просто сохраняем его для восстановления после отправки
             *  сооощения.
             */

            // ход сделан
            if (/Ждём ход противника/i.test(general.$('bf').innerHTML)) {
                return;
            }

            // куда отходим
            var def = general.doc.querySelector('input[type="radio"]' +
                    '[name="defence"]:checked'),
                dataSt = general.getData(4);

            dataSt[14] = def ? /\d/.exec(def.id)[0] : _this.getRandom1to3();

            // подходим или нет
            dataSt[16] = general.doc.querySelector('input[type="checkbox"]' +
                    '[name="walk"]:checked') ? '1' : '';

            // номер противника
            var enemyList = general.$('euids').querySelectorAll('option'),
                reg = /^(\d+)\. .*\[\d+ \/ \d+\] ([^:]+):/,
                enemy,
                tmps,
                i;

            for (i = 0; i < enemyList.length; i++) {
                if (enemyList[i].selected) {
                    tmps = enemyList[i].innerHTML;
                    // ecли пок то будет
                    // 1. Electrode [Major][20] 182 HP - 13!
                    enemy = reg.exec(tmps) || /^(\d+)\. ([^\s]+)/.exec(tmps);

                    break;
                }
            }

            dataSt[11] = enemy[1];

            // общий навык
            var generalSkill = '';
            if (general.doc.querySelector('input[type="checkbox"]' +
                    '[name="apm_activate"]:checked')) {
                dataSt[19] = general.doc.querySelector('label[for="apmid"]').
                    innerHTML;
                if (!dataSt[28]) {
                    generalSkill = ' + ' + dataSt[19];
                }
            }

            // навык специалиста
            var specialSkill = '';
            if (general.doc.querySelector('input[type="checkbox"]' +
                    '[name="aps_activate"]:checked')) {
                dataSt[20] = general.doc.querySelector('label[for="apsid"]').
                    innerHTML;
                if (!dataSt[28]) {
                    specialSkill = ' + ' + dataSt[20];
                }
            }

            var str = '~';

            // граната
            var isGren = false;
            if (general.doc.querySelector('input[type="checkbox"]' +
                    '[name="use_grenade"]:checked')) {
                str += general.doc.querySelector('label[for="bagaboom"]').
                    innerHTML.replace(/: бросить/, '');
                dataSt[15] = '1';

                if (!fake) {
                    _this.inpTextChat.value = str + ' в ' + enemy[1] +
                        (!dataSt[27] ? ' [' + enemy[2] + ']' : '') +
                            generalSkill + specialSkill;
                }

                isGren = true;
            }

            // подствол
            var isLauncher = false;
            if (general.doc.querySelector('input[type="checkbox"]' +
                    '[name="subweapon_shot"]:checked')) {
                str += 'Подствол в ';
                dataSt[24] = '1';
                isLauncher = true;
            }

            var leftAttack = general.doc.querySelector('input[type="radio"]' +
                '[name^="left_attack"]:checked'),
                rightAttack = general.doc.querySelector('input[type="radio"]' +
                    '[name^="right_attack"]:checked');

            dataSt[12] = leftAttack ? /\d/.exec(leftAttack.id)[0] : '';
            dataSt[13] = rightAttack ? /\d/.exec(rightAttack.id)[0] : '';

            general.setData(dataSt, 4);

            if (!isGren) {
                str += enemy[1];

                // правая рука
                // (если не установлен чекбокс "Говорить только левую руку")
                if (!isLauncher && dataSt[13] && !dataSt[18]) {
                    str += dataSt[13] === '1' ? ' ле' :
                            dataSt[13] === '2' ? ' ц' : ' пр';
                }

                // левая рука
                // (если не установлен чекбокс "Говорить только правую руку")
                if (!isLauncher && dataSt[12] && !dataSt[23]) {
                    str += dataSt[12] === '1' ? ' ле' :
                            dataSt[12] === '2' ? ' ц' : ' пр';
                }

                if (!fake) {
                    _this.inpTextChat.value = str +
                        (!dataSt[27] ? ' [' + enemy[2] + ']' : '') +
                            generalSkill + specialSkill;
                }
            }

            // отправляем сообщение в чат
            general.doc.querySelector('input[type="submit"]' +
                '[value="Написать"]').click();
        }; // 2}}};

        /**
         * @method getLeftRightCommands {{{2
         */
        this.getLeftRightCommands = function () {
            if (this.leftRightCommands.length) {
                return;
            }

            if (general.viewMode) {
                this.leftRightCommands.push(general.doc.
                        querySelector('tr>td[valign="top"][width="15%"]' +
                            ':first-child'));
                this.leftRightCommands.push(general.doc.
                        querySelector('tr>td[valign="top"][width="15%"]' +
                            ':last-child'));
                return;
            }

            // в бою ищем DIV'ы с бойцами явно, т.к.они меняются местами по ID
            this.leftRightCommands.push(general.doc.
                    querySelector('#listleft,#listright'));
            this.leftRightCommands[1] =
                this.leftRightCommands[0].id === 'listleft' ?
                        general.$('listright') : general.$('listleft');
        }; // 2}}}

        /**
         * @method getPers {{{2
         * @param   {HTMLElement}   obj
         * @return  {NodeList}
         */
        this.getPers = function (obj) {
            var pers = obj.querySelectorAll('a[href*="/info.php?id="]');
            // поки
            if (!pers.length) {
                pers = [];
                var divs = obj.querySelectorAll('div.customscroll'),
                    i;
                for (i = 0; i < divs.length; i++) {
                    pers.push(divs[i].querySelector('b'));
                }
            }

            return pers;
        }; // 2}}}

        /**
         * @method getDataFighters {{{2
         * @param   {HTMLLinkElement}   persLink
         */
        this.getDataFighters = function (persLink) {
            var prnt = persLink.parentNode.parentNode.lastElementChild,
                objPers = {};

            objPers.lvl = '';
            if (persLink.nextSibling && persLink.nextSibling.textContent) {
                objPers.lvl = persLink.nextSibling.textContent;
            }

            var allText = prnt.textContent;
            objPers.hp = /HP: \d+\/\d+/.test(allText) ?
                    /HP: (\d+)\/(\d+)/.exec(allText) : '';
            objPers.dist = /расстояние: \d+/i.test(allText) ?
                    /расстояние: (\d+)/i.exec(allText)[1] : '';
            objPers.visib = /видимость: \d+%/i.test(allText) ?
                    /видимость: (\d+%)/i.exec(allText)[1] : '';
            objPers.skill = '';

            // номера противников в режиме наблюдения за боем
            if (general.viewMode) {
                var persNum = persLink.parentNode.previousElementSibling;
                objPers.num = persNum ? persNum.innerHTML : null;
            }

            // добавляем умелку
            var skill = prnt.querySelectorAll('img[src*="/skill_"]'),
                skillValue,
                i;

            if (skill.length) {
                objPers.skill = '<br>' +
                    '<span style="color: #0087FF; font-size:9px;">';

                for (i = 0; i < skill.length; i++) {
                    skillValue = skill[i].parentNode &&
                        skill[i].parentNode.nextElementSibling;
                    if (skillValue) {
                        objPers.skill += skillValue.innerHTML +
                            (i !== skill.length - 1 ? ', ' : '');
                    }
                }

                objPers.skill += '</span>';
            }

            // оружие (для заполнения списка выбора врагов)
            objPers.weapon = '';
            // оружие и амуниция
            objPers.allWeapon = '';
            var allAmmunition = prnt.
                    querySelectorAll('a[href*="/item.php?item_id="]'),
                indent = '<span style="font-weight: bold; ' +
                            'margin: 0 3px 0 3px;">&bull;</span>',
                getSw = function (range) {
                    return '<span style="color: #FF0000; font-size: 7pt; ' +
                        'margin-left: 7px; float: right;">(' + range + ')' +
                        '</span>' + indent + '<span style="color: #FF5555;">' +
                        'Подствол</span><br>';
                },
                // для некоторых предметов установка модуля дальности
                // увеличивает дальность больше чем на 1
                modeUpgRange = {
                    'hk762': 3,
                    'colt692': 3,
                    'fd308': 2,
                    'ar10': 2,
                    'saf': 2,
                    'fort401': 3,
                    'ng7': 2,
                    'grom2': 2
                },
                builtinSw = '',
                baseUpgRange,
                isGrenade,
                itemLink,
                itemId,
                range,
                color,
                splt,
                sw;

            // у поков ссылок на амуницию нет
            if (allAmmunition.length) {
                objPers.weapon = allAmmunition[0].innerHTML;
                for (i = 0; i < allAmmunition.length; i++) {
                    itemLink = allAmmunition[i];
                    itemId = /\?item_id=([^&$]+)/.exec(itemLink.href)[1];
                    range = this.rangeWeapon[itemId];
                    color = this.art.indexOf(itemId) !== -1 ? '#009900' :
                                this.rent.indexOf(itemId) !== -1 ? '#870000' :
                                    '#000000';

                    // красим ссылки на странице,
                    // открываем их в отдельной вкладке
                    itemLink.style.color = color;
                    itemLink.setAttribute('target', '_blank');

                    if (range) {
                        // наличие встроенного подствола, например thales_grl
                        builtinSw = '';
                        splt = range.split('/');
                        if (splt.length > 2) {
                            builtinSw = splt[1] + '/' + splt[2];
                        }

                        splt[0] = +splt[0];
                        // установленные модули на дальность
                        baseUpgRange = modeUpgRange[itemId] || 1;
                        if (/&upg=1(&|$)/.test(itemLink.href)) {
                            splt[0] += baseUpgRange;
                        } else if (/&upg=11(&|$)/.test(itemLink.href)) {
                            splt[0] += baseUpgRange + 1;
                        } else if (/&upg=(12|13)(&|$)/.test(itemLink.href)) {
                            splt[0] += 1;
                        }

                        // модификаторы на дальность
                        if (/&m=(27|43)(&|$)/.test(itemLink.href)) {
                            splt[0] += 1;
                        } else if (/&m=(8|16|34)(&|$)/.test(itemLink.href)) {
                            splt[0] += 2;
                        }

                        range = builtinSw ? splt[0] : splt[0] +
                            (splt[1] ? '/' + splt[1] : '');

                        // граната или гранатомет
                        isGrenade = /\//.test(range);
                        objPers.allWeapon += '<span style="color: ' +
                            (isGrenade ? '#870000' : '#0000FF') + '; ' +
                            'font-size: 7pt; margin-left: 7px; ' +
                            'float: right;">(' + range + ')' +
                            '</span>' + indent + '<span style="color: ' +
                            color + ';">' + itemLink.innerHTML + '</span><br>';

                        // подствол (или встроенный, или установленный)
                        if (builtinSw) {
                            objPers.allWeapon += getSw(builtinSw);
                        } else {
                            sw = /&sw=([^&$]+)/.exec(itemLink.href);
                            range = sw ? this.rangeWeapon[sw[1]] : '';
                            if (range) {
                                objPers.allWeapon += getSw(range);
                            }
                        }
                    } else {
                        objPers.allWeapon += indent + '<span style="color: ' +
                            color + ';">' + itemLink.innerHTML + '</span><br>';
                    }
                }
            }

            var name = persLink.textContent.replace(/&amp;/, '&');

            // личные NPC персонажей
            if (/\[NPC\]$/.test(name)) {
                objPers.npc = true;
            }

            this.allFighters[name] = objPers;

            // в бою и если это мой перс, то запоминаем его
            if (!general.viewMode && persLink.href &&
                    persLink.href.indexOf('?id=' + general.myID) !== -1) {
                this.myPers = objPers;
                this.myPers.name = name;
                this.myPers.damage = ['?', '?', '?'];
                var myDamage = prnt.querySelector('img[src$="skull.svg"]');
                if (myDamage && myDamage.parentNode &&
                        myDamage.parentNode.nextElementSibling) {
                    var damage = myDamage.parentNode.nextElementSibling;
                    if (/>(\d+.*(\+\d+)?)\(.*>(\d+)</.test(damage.innerHTML)) {
                        this.myPers.damage = />(\d+.*(\+\d+)?)\(.*>(\d+)</.
                            exec(damage.innerHTML);
                    }
                }
            }
        }; // 2}}}

        /**
         * @method  setPersNikInChat {{{2
         * @param   {Object}    _this
         * @param   {String}    pName
         * @return  {Function}
         */
        this.setPersNikInChat = function (_this, pName) {
            return function () {
                _this.inpTextChat.value = _this.inpTextChat.value + ' ' +
                    pName + ' ';
                _this.inpTextChat.focus();
            };
        }; // 2}}}

        /**
         * @method setNameInChat {{{2
         * @return  {Function}
         */
        this.setNameInChat = function (persName) {
            var _this = this;
            return function () {
                _this.inpTextChat.value += persName + ': ';
                _this.inpTextChat.focus();
            };
        }; // 2}}}

        /**
         * @method  createEnvelopSpan
         * @return  {Element}
         */
        this.createEnvelopSpan = function () {
            var span = general.doc.createElement('span');
            span.setAttribute('name', 'sendmessenv');
            span.innerHTML = ' <img src="' + this.imgPath +
                'envelope.gif" style="width: 15px; cursor: pointer; ' +
                'margin-right: 5px;" alt="img" />';

            return span;
        };

        /**
         * @method setEnvelope {{{2
         */
        this.setEnvelope = function () {
            var mass = [this.leftPers, this.rightPers],
                before,
                span,
                j,
                i;

            for (i = 0; i < 2; i++) {
                for (j = 0; j < mass[i].length; j++) {
                    this.getDataFighters(mass[i][j]);

                    // конвертики покам не нужны
                    if (mass[i][j].nodeName === 'B') {
                        continue;
                    }

                    span = this.createEnvelopSpan();
                    if (!i) {
                        // левая команда
                        mass[i][j].parentNode.appendChild(span);
                    } else {
                        // правая команда
                        before = mass[i][j].parentNode;
                        before.parentNode.
                            insertBefore(span, before.previousElementSibling);
                    }

                    span.querySelector('img').addEventListener('click',
                        this.setNameInChat(mass[i][j].textContent), false);
                }
            }

            // ставим конвертики для наблюдающих за боем
            if (general.viewMode) {
                var observersPanel = general.doc.
                        querySelector('td[align="left"][class="greengraybg"]');

                if (!observersPanel) {
                    return;
                }

                var observers = observersPanel.querySelectorAll('nobr'),
                    observer;

                for (i = 0; i < observers.length; i++) {
                    observer = observers[i].
                        querySelector('a[href*="/info.php?id="]');

                    if (observer) {
                        span = this.createEnvelopSpan();
                        observers[i].appendChild(span);
                        span.querySelector('img').addEventListener('click',
                            this.setNameInChat(observer.textContent),
                                false);
                    }
                }
            }
        }; // 2}}}

        /**
         * @method setMyInfo {{{2
         * @param   {int}   count   количество персонажей сделавших ход
         */
        this.setMyInfo = function (count) {
            // если здоровье меньше максимального, то меняем цвет
            var color = this.myPers.hp[1] === this.myPers.hp[2] ?
                        '#008000' : '#B84906',
                str = '<span style="color: ' + color + ';">' +
                    // HP
                    this.myPers.hp[1] + '</span>/' +
                    '<span style="color: #008000; font-weight: bold;">' +
                    this.myPers.hp[2] + '</span>' +
                    // урон
                    '<span style="margin-left: 15px;">' +
                    this.myPers.damage[1] +
                    '(<span style="color: #009900; font-weight: bold;">' +
                    this.myPers.damage[3] + '</span>)' +
                    // видимость
                    '<span style="margin-left: 15px; font-weight: bold;">' +
                    this.myPers.visib + '</span>' +
                    // количество бойцов
                    '<span style="margin-left: 15px; font-weight: bold;">' +
                    '<span style="color: #FF0000;">' + this.leftPers.length +
                    '</span> / <span style="color: #0000FF;">' +
                    this.rightPers.length + '</span></span>' +
                    // ссылка "Наблюдение"
                    '<a href="https://' + general.domain + '/warlog.php?bid=' +
                    /\?bid=(\d+)/.exec(general.loc)[1] + '&rev=1" ' +
                    'target="_blank" style="margin-left: 15px;"><img src="' +
                    general.imgPath + 'AdvBattleAll/eyes.png" width="16" ' +
                    'height="9" title="Режим наблюдения за боем" alt="img" />' +
                    '</a>';

            // счетчик количества бойцов сделавших ход
            if (count) {
                str += '<span style="margin-left: 15px;">' + count + '/' +
                    (this.leftPers.length + this.rightPers.length) + '</span>';
            }

            this.myInfoTopPanel.innerHTML = str;
        }; // 2}}}

        /**
         * @method sortEnemyList {{{2
         */
        this.sortEnemyList = function () {
            var _this = this;
            // если кнопка уже нажата (выделена жирным)
            if (/bold/.test(_this.getAttribute('style'))) {
                return;
            }

            var id = +/\d/.exec(_this.id)[0],
                i;
            // выделяем жирным на что нажали, остальные обычным шрифтом
            _this.setAttribute('style', 'font-weight: bold;');
            for (i = 0; i < 6; i++) {
                if (i !== id) {
                    general.$('s' + i).setAttribute('style',
                            'cursor: pointer;');
                }
            }

            // записываем данные в хранилище
            var dataSt = general.getData(4);
            dataSt[2] = id.toString();
            general.setData(dataSt, 4);

            // сортируем список по возрастающей
            var regstr = '(\\d+)\\. \\[(\\d+)\\][^\\d]*(\\d+)!? ' +
                    '\\((\\d+)%\\) \\[(\\d+) \\/ (\\d+)\\]',
                reg = new RegExp(regstr),
                select = general.$('euids'),
                countOpt = select.options.length,
                buff,
                opts,
                rez1,
                rez2,
                j;

            for (i = 0; i < countOpt - 1; i++) {
                for (j = 0; j < countOpt - 1; j++) {
                    opts = select.options;
                    rez1 = reg.exec(opts[j].innerHTML);
                    rez2 = reg.exec(opts[j + 1].innerHTML);
                    if (rez1 && rez2) {
                        rez1 = +rez1[id + 1];
                        rez2 = +rez2[id + 1];
                        if (rez1 > rez2) {
                            buff = select.removeChild(opts[j + 1]);
                            select.insertBefore(buff, opts[j]);
                        }
                    }
                }
            }

            // выбираем первого противника в списке
            select.options[0].selected = true;
        }; // 2}}}

        /**
         * @method setSortListEnemy {{{2
         */
        this.setSortListEnemy = function () {
            var walk = general.$('walk'),
                target = general.$('euids').parentNode.parentNode.parentNode,
                tr;

            // если есть чекбокс "Подойти ближе"
            if (walk) {
                walk.parentNode.insertBefore(general.doc.createElement('br'),
                        walk);
            } else {
                tr = general.doc.createElement('tr');
                tr.innerHTML = '<td colspan="2" style="padding-bottom:5px;">' +
                    '<br></td>';
                target.parentNode.insertBefore(tr, target);
            }

            var spanSortButtons = general.doc.createElement('span');
            spanSortButtons.setAttribute('style', 'font-size: 8pt; ' +
                    'margin-left: 20px;');
            spanSortButtons.innerHTML = '<span id="s0">[номер]</span> ' +
                '<span id="s1">[лвл]</span> <span id="s2">[дальность]</span> ' +
                '<span id="s3">[видимость]</span> <span id="s4">[HP ост.]' +
                '</span> <span id="s5">[HP всего]</span>';

            target = walk ? walk.parentNode : tr.firstElementChild;
            target.appendChild(spanSortButtons);

            var button, i;
            for (i = 0; i < 6; i++) {
                button = general.$('s' + i);
                button.addEventListener('click', this.sortEnemyList, false);
            }

            general.$('s' + (general.getData(4)[2] || '0')).click();
        }; // 2}}}

        /**
         * @method clickElem {{{2
         * @param   {HTMLElement}   elem
         */
        this.clickElem = function (elem) {
            var _elem = elem;
            if (_elem) {
                _elem.click();
            }
        }; // 2}}}

        /*
         * @method setWalk {{{2
         * @param   {int}   ind
         */
        this.setWalk = function (ind) {
            var dataSt = general.getData(4),
                walk = general.$('walk');

            if (walk) {
                // noinspection JSRemoveUnnecessaryParentheses
                if ((!walk.checked && dataSt[ind]) ||
                        (walk.checked && !dataSt[ind])) {
                    walk.click();
                }
            }
        }; // 2}}}

        /**
         * @method setStroke {{{2
         */
        this.setStroke = function () {
            var dataSt = general.getData(4);

            // Дуэли - отходить можно только в центр (чекбоксы лево и
            // право не активны). Стрелям тоже всегда в центр.
            if (general.doc.querySelector('#defence1:disabled')) {
                this.clickElem(general.$('defence2'));
                this.clickElem(general.$('left_attack2'));
                this.clickElem(general.$('right_attack2'));

                return;
            }

            // если в хранилище есть запись в кого стреляли
            // (сказали ход), то устанавливаем именно его
            if (dataSt[11]) {
                var options = general.$('euids').querySelectorAll('option'),
                    i;

                for (i = 0; i < options.length; i++) {
                    if (new RegExp('^' + dataSt[11] + '\\.').
                            test(options[i].innerHTML)) {
                        options[i].selected = true;
                        break;
                    }
                }

                // левая рука
                if (dataSt[12]) {
                    this.clickElem(general.$('left_attack' + dataSt[12]));
                }

                // правая рука
                if (dataSt[13]) {
                    this.clickElem(general.$('right_attack' + dataSt[13]));
                }

                // куда отходим
                if (dataSt[14]) {
                    this.clickElem(general.$('defence' + dataSt[14]));
                }

                // если грена
                if (dataSt[15]) {
                    this.clickElem(general.$('bagaboom'));
                }

                // подходим или нет
                this.setWalk(16);

                // общий навык
                if (dataSt[19]) {
                    this.clickElem(general.$('apmid'));
                }

                // навык специалиста
                if (dataSt[20]) {
                    this.clickElem(general.$('apsid'));
                }

                // подствол
                if (dataSt[24]) {
                    this.clickElem(general.$('sbw'));
                }

                this.clearSavedStrokeAfterSay();

                return;
            }

            // отмечен чекбокс "запомнить ход"
            if (dataSt[3]) {
                // левая рука
                if (dataSt[5]) {
                    this.clickElem(general.$('left_attack' + dataSt[5]));
                }

                // правая рука
                if (dataSt[6]) {
                    this.clickElem(general.$('right_attack' + dataSt[6]));
                }

                // куда отходим
                if (dataSt[7]) {
                    this.clickElem(general.$('defence' + dataSt[7]));
                }

                // граната
                if (dataSt[8] && general.$('bagaboom')) {
                    this.clickElem(general.$('bagaboom'));
                }

                // подствол
                if (dataSt[24]) {
                    this.clickElem(general.$('sbw'));
                }

                // подходим или нет
                this.setWalk(9);

            // отмечен чебокс "не дублировать цель" и две руки
            } else if (dataSt[4] && !general.$('span_two_hand').style.display) {
                var rightAttack = general.doc.querySelector('input' +
                        '[type="radio"][name^="right_attack"]:checked'),
                    leftAttack = general.doc.querySelector('input' +
                        '[type="radio"][name^="left_attack"]:checked'),
                    x = /\d/.exec(rightAttack.id)[0],
                    y = /\d/.exec(leftAttack.id)[0];

                // если ход дублируется
                if (x === y) {
                    while (x === y) {
                        x = this.getRandom1to3();
                        y = this.getRandom1to3();
                    }

                    this.clickElem(general.$('right_attack' + x));
                    this.clickElem(general.$('left_attack' + y));
                }
            }
        }; // 2}}}

        /**
         * @method setHandlerSubmit {{{2
         */
        this.setHandlerSubmit = function () {
            var s = general.doc.createElement('script');
            s.innerHTML = 'function fight_mod() {' +
                    'var dataStAll = localStorage.getItem(\'' +
                            general.STORAGENAME + '\').split(\'@\'),' +
                        'dataSt = dataStAll[4].split(\'|\'),' +
                    'elem;' +

                    'dataSt[5] = \'\';' +   // левая
                    'dataSt[6] = \'\';' +   // правая
                    'dataSt[7] = \'\';' +   // куда отходим
                    'dataSt[8] = \'\';' +   // граната
                    'dataSt[9] = \'\';' +   // подходим или нет

                    // левая рука
                    'if (elem = document.' +
                            // eslint-disable-next-line no-useless-escape
                            'querySelector(\'input[type=\"radio\"]' +
                                // eslint-disable-next-line no-useless-escape
                                '[id^=\"left_attack\"]:checked\')) {' +
                        'dataSt[5] = /left_attack(\\d)/.exec(elem.id)[1];' +
                    '}' +

                    // правая рука
                    'if (elem = document.' +
                            // eslint-disable-next-line no-useless-escape
                            'querySelector(\'input[type=\"radio\"]' +
                                // eslint-disable-next-line no-useless-escape
                                '[id^=\"right_attack\"]:checked\')) {' +
                        'dataSt[6] = /right_attack(\\d)/.exec(elem.id)[1];' +
                    '}' +

                    // куда отходим
                    'if (elem = document.' +
                            // eslint-disable-next-line no-useless-escape
                            'querySelector(\'input[type=\"radio\"]' +
                                // eslint-disable-next-line no-useless-escape
                                '[id^=\"defence\"]:checked\')) {' +
                        'dataSt[7] = /defence(\\d)/.exec(elem.id)[1];' +
                    '}' +

                    // граната
                    'if (elem = document.' +
                            'querySelector(\'#bagaboom:checked\')) {' +
                        'dataSt[8] = \'1\';' +
                    '}' +

                    // подходим или нет
                    'if (elem = document.querySelector(\'#walk:checked\')) {' +
                        'dataSt[9] = \'1\';' +
                    '}' +

                    'dataStAll[4] = dataSt.join(\'|\');' +
                    'localStorage.setItem(\'' + general.STORAGENAME +
                        '\', dataStAll.join(\'@\'));' +
                    'fight();' +
                '}';

            general.doc.body.appendChild(s);
        }; // 2}}}

        /**
         * @method setControlOfShooting {{{2
         */
        this.setControlOfShooting = function () {
            var divGenerator = general.doc.createElement('div'),
                bf = general.$('bf'),
                coord = new GetPos().init(bf);

            divGenerator.setAttribute('style', 'position: absolute; top: ' +
                    coord.y + 'px; left: ' + coord.x + 'px; ' +
                    'margin: 5px 0 0 5px;');

            // если две руки, то "не дублировать цель" делаем видимым
            var vis = general.$('left_attack1') && general.$('right_attack1') ?
                        '' : 'none';

            // если одна рука, то сбрасываем чекбоксы
            // "Говорить только левую руку" и "Говорить только правую руку"
            if (vis) {
                var stData = general.getData(4);
                stData[18] = '';
                stData[23] = '';
                general.setData(stData, 4);
            }

            divGenerator.innerHTML = '<input type="checkbox" ' +
                'id="save_stroke">  <label for="save_stroke" ' +
                'style="vertical-align: top;">запомнить ход</label><br>' +
                '<span id="span_two_hand" style="display: ' + vis +
                ';"><input type="checkbox" id="repeat_two_hand"> <label ' +
                'for="repeat_two_hand" style="vertical-align: top;">не ' +
                'дублировать цель</label></span>';
            bf.appendChild(divGenerator);

            var chkRememberStroke = general.$('save_stroke'),
                chkNoDuplicateTarget = general.$('repeat_two_hand'),
                goButton = general.doc.
                    querySelector('a[href^="javascript:void(fight"]');

            var _this = this;
            chkRememberStroke.addEventListener('click', function () {
                var dataSt = general.getData(4),
                    thischk = this;

                if (thischk.checked) {
                    chkNoDuplicateTarget.checked = false;
                    dataSt[4] = '';

                    goButton.setAttribute('href',
                            ['javascript', ':', 'void(fight_mod())'].join(''));
                    dataSt[3] = '1';
                    general.setData(dataSt, 4);
                    _this.setStroke();
                } else {
                    goButton.setAttribute('href',
                            ['javascript', ':', 'void(fight())'].join(''));
                    dataSt[3] = '';
                    general.setData(dataSt, 4);
                }
            }, false);

            chkNoDuplicateTarget.addEventListener('click', function () {
                var dataSt = general.getData(4),
                    thischk = this;

                if (thischk.checked) {
                    chkRememberStroke.checked = false;
                    dataSt[3] = '';
                }

                dataSt[4] = thischk.checked ? '1' : '';
                general.setData(dataSt, 4);
                _this.setStroke();
            }, false);

            // установим свой обработчик нажатия кнопки "Сделать ход"
            // (если установлен чекбокс "запомнить ход", то отправленный
            // ход будет запоминаться в localStorage)
            this.setHandlerSubmit();

            var dataSt = general.getData(4);
            if (dataSt[3]) {                    // чекбокс "запомнить ход"
                chkRememberStroke.click();
            } else if (dataSt[4]) {             // чекбокс "не дублировать цель"
                chkNoDuplicateTarget.click();
            } else {                            // все чекбоксы сброшены
                this.setStroke();
            }
        }; // 2}}}

        /**
         * @method changeSelectEnemies {{{2
         */
        this.changeSelectEnemies = function () {
            var select = general.$('euids'),
                span = general.$('spanCheckRange'),
                i;

            for (i = 0; i < select.options.length; i++) {
                if (select.options[i].selected) {
                    span.setAttribute('style', /!/.
                        test(select.options[i].innerHTML) ?
                                'color: #FF0000;' : '');
                    break;
                }
            }
        }; // 2}}}

        /**
         * @method clickImageFighters {{{2
         * @param   {Object}   opt
         * @param   {Object}    _this
         * @return  {Function}
         */
        this.clickImageFighters = function (opt, _this) {
            return function () {
                opt.selected = true;
                _this.changeSelectEnemies();
            };
        }; // 2}}}

        /**
         * @method showTooltip {{{2
         * @param   {String}    ttl
         * @param   {Object}    _this
         * @return  {Function}
         */
        this.showTooltip = function (ttl, _this) {
            return function () {
                var getPos = new GetPos(),
                    obj;

                // относительно чего будем выравнивать тултип
                if (general.viewMode) {
                    obj = {
                        x: general.doc.querySelector('table[background$=' +
                            '"/battleField.gif"]').nextElementSibling.
                                nextElementSibling,
                        y: 14
                    };
                } else {
                    obj = {x: _this.inpTextChat, y: 20};
                }

                _this.tooltip.innerHTML = ttl;
                _this.tooltip.style.top = String(getPos.init(obj.x).y - obj.y);
                _this.tooltip.style.left = String(getPos.init(this).x - 50);
                _this.tooltip.style.display = '';
            };
        }; // 2}}}

        /**
         * @method hideTooltip {{{2
         * @param   {Object}    _this
         * @return  {Function}
         */
        this.hideTooltip = function (_this) {
            return function () {
                _this.tooltip.style.display = 'none';
            };
        }; // 2}}}

        /**
         * @method setTooltipsFighters {{{2
         * @param   {HTMLTableElement}  table
         */
        this.setTooltipsFighters = function (table) {
            var selectEnemy = general.$('euids'),
                _this = this;
            // помещаем "Противник:" (слева от селекта) в span
            // если не достаем до выбранного противника,
            // то эта надпись будет красной
            if (selectEnemy) {
                selectEnemy.parentNode.removeChild(selectEnemy.previousSibling);
                var spanCheckRange = general.doc.createElement('span');
                spanCheckRange.setAttribute('id', 'spanCheckRange');
                spanCheckRange.innerHTML = 'Противник: ';
                selectEnemy.parentNode.
                    insertBefore(spanCheckRange, selectEnemy);
                selectEnemy.addEventListener('change', function () {
                    _this.changeSelectEnemies();
                }, false);
                this.changeSelectEnemies();
            }

            var options = selectEnemy ?
                    selectEnemy.querySelectorAll('option') : false,
                img = table.querySelectorAll('img'),
                txtOptions,
                ttlName,
                visib,
                pers,
                name,
                ttl,
                i,
                j;

            for (i = 0; i < img.length; i++) {
                ttl = img[i].getAttribute('title');
                if (!ttl || !/(.*) \[\d+/.test(ttl)) {
                    continue;
                }

                ttlName = /(.*) \[\d+/.exec(ttl)[1].replace(/&amp;/, '&');
                // если есть список выбора врага (ход не сделан)
                if (options) {
                    // noinspection JSUnresolvedVariable
                    for (j = 0; j < options.length; j++) {
                        txtOptions = options[j].innerHTML.replace(/&amp;/, '&');
                        if (txtOptions.indexOf(ttlName) !== -1) {
                            // кликаем по картинке, выбираем цель
                            img[i].setAttribute('style', 'cursor: pointer;');
                            img[i].addEventListener('click',
                                    this.clickImageFighters(options[j], this),
                                        false);
                            break;
                        }
                    }
                }

                for (name in this.allFighters) {
                    if (this.allFighters.hasOwnProperty(name) &&
                            name === ttlName) {
                        pers = this.allFighters[name];
                        ttl = '<span style="font-weight: bold;">' +
                            (general.viewMode ?
                                    (pers.num ? pers.num + '. ' : '') :
                                        this.enemies[name] ?
                                            this.enemies[name] + '. ' : '') +
                            '<span style="color: #0000FF;">' + pers.lvl +
                            '</span> ' +
                            '<span' +
                            (pers.npc ? ' style="opacity:0.6;"' : '') + '>' +
                            name + '</span> ' +
                            '<span>[' + pers.hp[1] + '/' + pers.hp[2] + ']' +
                            '</span>' +
                            '</span>' +
                            '<div style="color: #B85006; ' +
                            'margin-left: 10px;">Видимость: ' + pers.visib +
                            pers.skill + '</div>' +
                            '<div>' + pers.allWeapon + '</div>';

                        // прозрачность перса в зависимости от его видимости
                        visib = +/\d+/.exec(pers.visib)[0];
                        visib = (visib / 100).toFixed(1);
                        if (visib < 0.3) {
                            visib = 0.3;
                        }

                        img[i].style.opacity = visib.toString();
                        img[i].style.marginLeft = '6px';
                        break;
                    }
                }

                // показываем тултип
                img[i].addEventListener('mouseover',
                    this.showTooltip(ttl, this), false);
                // скрываем тултип
                img[i].addEventListener('mouseout',
                        this.hideTooltip(this), false);
                // по двойному клику вставляем ник персонажа в поле ввода чата
                img[i].addEventListener('dblclick',
                    _this.setPersNikInChat(_this, ttlName), false);

                // удаляем оригинальный title
                img[i].removeAttribute('title');
            }
        }; // 2}}}

        /**
         * @method isEven {{{2
         * @param   {int}   x
         */
        this.isEven = function (x) {
            return x % 2 === 0;
        }; // 2}}}

        /**
         * @method changeLocationFighters {{{2
         */
        this.changeLocationFighters = function () {
            var table;
            // в бою
            if (!general.viewMode) {
                var bf = general.$('bf');
                // ход сделан, вставляем сохраненную таблицу
                if (/Ждём ход противника/i.test(bf.innerHTML)) {
                    if (this.graphTable) {
                        var target = bf.querySelector('a').parentNode;
                        target.appendChild(general.doc.createElement('br'));
                        target.appendChild(general.doc.createElement('br'));
                        target.appendChild(this.graphTable);
                        target.appendChild(general.doc.createElement('br'));
                        this.setTooltipsFighters(this.graphTable);
                        return;
                    }
                } else {    // ход еще не сделан
                    table = bf.querySelector('div>table:last-child');
                }
            } else {    // режим наблюдения за боем
                table = this.leftRightCommands[0].nextElementSibling.
                    lastElementChild.previousElementSibling;

                if (/Наблюдатели/.test(table.innerHTML)) {
                    table = table.previousElementSibling;
                }
            }

            table.setAttribute('style', 'border-collapse: collapse;');
            table.setAttribute('background', this.imgPath + 'battleField.gif');

            // вставим пустую строку после таблицы
            if (!general.viewMode) {    // в бою
                table.parentNode.appendChild(general.doc.createElement('br'));
            } else {    // режим наблюдения за боем
                table.parentNode.insertBefore(general.doc.createElement('br'),
                    table.nextElementSibling);
            }

            var reg = /\/(left|right)_.*\.gif/,
                td = table.querySelectorAll('td'),
                prBarWidth = 27,
                rightDC = -1,
                leftDC = -1,
                divBattleField,
                diffCommand,
                pTitleName,
                trNumbers,
                divHealth,
                tdNumber,
                cloneTd,
                myInd,
                title,
                hpClr,
                even,
                divL,
                divR,
                flag,
                img,
                DC,
                hp,
                i,
                j;

            for (i = 0; i < td.length; i++) {
                td[i].setAttribute('style', 'border: 1px dotted #FFFFFF; ' +
                        'vertical-align: center;');
                // если в "TD" нет картинки перса
                if (!td[i].querySelector('img').getAttribute('title')) {
                    continue;
                }

                cloneTd = td[i].cloneNode(true);
                td[i].innerHTML = '';
                img = cloneTd.querySelectorAll('img');

                // узнаем есть ли в ячейке бойцы из разных команд
                diffCommand = false;
                for (j = 0; j < img.length - 1; j++) {
                    // берем из атрибута srs 'left' или 'right'
                    if (reg.exec(img[j].src)[1] !==
                            reg.exec(img[j + 1].src)[1]) {
                        diffCommand = true;
                        break;
                    }
                }

                flag = false;
                for (j = 0; j < img.length; j++) {
                    title = img[j].getAttribute('title');
                    pTitleName = /^(.*)\s\[\d+/.exec(title);

                    // ячейка где находится мой перс
                    if (!general.viewMode && pTitleName &&
                            pTitleName[1] === this.myPers.name) {
                        myInd = -1 * i;
                    }

                    // крайний левый и крайний правый персонаж от центра
                    if (reg.exec(img[j].src)[1] === 'left') {
                        leftDC = i;
                    } else if (rightDC === -1) {
                        rightDC = i;
                    }

                    divBattleField = general.doc.createElement('div');

                    // формируем прогресс бар здоровья
                    hp = /\[(\d+)\/(\d+)\]/.exec(title);
                    if (hp) {
                        divHealth = general.doc.createElement('div');
                        divHealth.setAttribute('style',
                            'width: ' + prBarWidth + 'px; ' +
                            'background-color: #FFEFDD; ' +
                            'margin: 7px 1px 3px 1px;');

                        // вычисляем процент оставшегося здоровья
                        hp = Math.ceil(+hp[1] * 100 / +hp[2]);
                        hpClr = hp < 30 ? '#FF0000' :
                                    hp < 80 ? '#C44A00' : '#339933';

                        divHealth.innerHTML = '<div style="' +
                            'height: 2px; width: ' +
                                Math.ceil(prBarWidth / 100 * hp) + 'px; ' +
                            'background-color: ' + hpClr + ';"></div>';
                        divBattleField.appendChild(divHealth);
                    }

                    if (!diffCommand) {
                        td[i].appendChild(divBattleField);
                        td[i].lastElementChild.
                                appendChild(img[j].cloneNode(true));
                    } else {
                        if (!flag) {
                            divL = general.doc.createElement('div');
                            divL.setAttribute('style',
                                    'display: inline-block;');
                            td[i].appendChild(divL);
                            divR = general.doc.createElement('div');
                            divR.setAttribute('style',
                                    'display: inline-block;');
                            td[i].appendChild(divR);
                            flag = true;
                        }

                        divBattleField.appendChild(img[j].cloneNode(true));
                        if (reg.exec(img[j].src)[1] === 'left') {
                            td[i].firstElementChild.appendChild(divBattleField);
                        } else {
                            td[i].lastElementChild.appendChild(divBattleField);
                        }
                    }
                }
            }

            DC = Math.abs(leftDC - rightDC);
            even = this.isEven(DC);
            DC = even ? leftDC + DC / 2 : leftDC + Math.floor(DC / 2);

            // если нет изображения моего перса на поле боя (бывает такой глюк)
            // будем отсчитывать от динамического центра
            if (isNaN(myInd)) {
                myInd = -1 * DC;
            }

            // расставляем дальность и ДЦ
            trNumbers = general.doc.createElement('tr');
            table.firstElementChild.insertBefore(trNumbers,
                    table.firstElementChild.firstElementChild);

            for (i = 0; i < td.length; i++) {
                tdNumber = general.doc.createElement('td');
                trNumbers.appendChild(tdNumber);

                tdNumber.innerHTML = String(Math.abs(myInd));
                // если индекс нулевой (там где я стою) то цвет синий
                if (myInd) {
                    tdNumber.setAttribute('style',
                        'text-align: center; font-size: 7pt; border: 1px ' +
                        'dotted #FFFFFF;');
                } else {
                    tdNumber.setAttribute('style', 'text-align: center; ' +
                        'font-size: 8pt; color :#0000FF; font-weight: bold; ' +
                        'border: 1px dotted #FFFFFF;');
                }

                myInd++;

                if (i !== DC) {
                    continue;
                }

                tdNumber.setAttribute('style', 'text-align: center; ' +
                    'font-size: 8pt; color: #FF0000; font-weight: bold; ' +
                    'border: 1px dotted #FFFFFF;');

                if (!even) {
                    DC++;
                    even = true;
                }
            }

            if (!general.viewMode) {
                this.graphTable = table.cloneNode(true);
            }

            this.setTooltipsFighters(table);
        }; // 2}}}

        /**
         * @method setCountStroke {{{2
         * @param   {object}    obj
         */
        this.setCountStroke = function (obj) {
            // персы, которые сделали ход (зеленые)
            var greenPersLinks = obj.
                    querySelectorAll('a[href*="/info.php?id="]' +
                            '[style*="#008800"]');

            if (greenPersLinks.length) {
                var persLinkInBattle, greenPersId, i;
                for (i = 0; i < greenPersLinks.length; i++) {
                    greenPersId = /\/info\.php\?id=(\d+)/.
                        exec(greenPersLinks[i].href)[1];
                    persLinkInBattle = general.doc.
                        querySelector('a[href$="/info.php?id=' + greenPersId +
                            '"]');

                    if (persLinkInBattle) {
                        persLinkInBattle.style.color = '#008800';
                    }
                }

                this.setMyInfo(greenPersLinks.length);
            }
        }; // 2}}}

        /**
         * @method setColorFighters {{{2
         * @param   {Object}    _this
         * @return  {Function}
         */
        this.setColorFighters = function (_this) {
            return function () {
                // ход сделан
                if (/Ждём ход противника/i.test(general.$('bf').innerHTML)) {
                    // ссылка на страницу НЕ JS-версии боя
                    var url = general.loc.replace('btl.php', 'b.php'),
                        ajax = new AjaxQuery();

                    ajax.init(url, 'GET', null, true, function (xhr) {
                        var span = general.doc.createElement('span');
                        span.innerHTML = xhr.responseText;
                        _this.setCountStroke(span);
                    }, function () {
                        general.root.console.log('Error XHR to: ' + url);
                    });
                }
            };
        }; // 2}}}

        /**
         * @method start {{{2
         */
        this.start = function () {
            // сразу скрываем тултип (на всякий случай, если остался)
            this.tooltip.style.display = 'none';

            var selectEnemies = general.$('euids'),
                dataSt = general.getData(4),
                options,
                i;

            // в бою
            // noinspection JSUnresolvedVariable
            if (!general.viewMode) {
                // если есть список выбора врага (ход не сделан)
                if (selectEnemies) {
                    // играем звук о начале хода
                    if (!this.checkSound) {
                        new PlaySound().init(dataSt[22]);
                        this.checkSound = true;
                    }

                    var tmp;
                    // обнуляем хэш из выпадающего списка врагов (имя --> номер)
                    this.enemies = {};
                    options = selectEnemies.querySelectorAll('option');
                    for (i = 0; i < options.length; i++) {
                        tmp = /^(\d+)\. (.+)\[\d+\]/.exec(options[i].innerHTML);
                        if (tmp) {
                            this.enemies[tmp[2].replace(/&amp;/, '&')] = tmp[1];
                        }
                    }
                } else {    // ход сделан
                    this.checkSound = false;
                    if (!this.enemies) {
                        return;
                    }
                }
            } else {    // в режиме наблюдения за боем
                dataSt[17] = '';    // удаляем данные из списка врагов
                general.setData(dataSt, 4);
            }

            this.getLeftRightCommands();

            // ссылки на персов слева и справа
            this.leftPers = this.getPers(this.leftRightCommands[0]);
            this.rightPers = this.getPers(this.leftRightCommands[1]);

            // бой закончился, режим наблюдения за боем,
            // форма для отправки сообщений присутствует
            if (!this.leftPers.length || !this.rightPers.length) {
                return;
            }

            // расстановка конвертиков и сбор дополнительной
            // информации (если они еще не были установлены)
            if (this.leftPers[0] &&
                    !this.leftPers[0].parentNode.
                        querySelector('span[name="sendmessenv"]')) {
                this.allFighters = {};
                this.setEnvelope();
            }

            // в бою
            if (!general.viewMode) {
                // в бою установим свои данные вверху
                this.setMyInfo(0);

                // расширяем данные в списке выбора
                var enemyName, tmpObj;
                if (selectEnemies) {
                    for (i = 0; i < options.length; i++) {
                        // eslint-disable-next-line no-useless-escape
                        enemyName = /^\d+\. ([^\[]+)\[/.
                            exec(options[i].innerHTML);

                        if (!enemyName) {
                            continue;
                        }

                        enemyName = enemyName[1].replace(/&amp;/, '&');
                        tmpObj = this.allFighters[enemyName];

                        if (!tmpObj) {
                            continue;
                        }

                        options[i].innerHTML = this.enemies[enemyName] + '. ' +
                            tmpObj.lvl + ' - ' + tmpObj.dist +
                            // если до цели не достаем, ставим '!'
                            (/#ffe0e0/.test(options[i].getAttribute('style')) ?
                                    '!' : '') +
                            ' (' + tmpObj.visib + ') [' + tmpObj.hp[1] +
                            ' / ' + tmpObj.hp[2] +  '] ' + enemyName +
                            ': ' + tmpObj.weapon + ' &nbsp;';
                    }

                    // сортируем список выбора
                    this.setSortListEnemy();

                    // установка чекбоксов "запомнить ход" и
                    // "не дублировать цель"
                    this.setControlOfShooting();

                    // показываем кнопку "Сказать ход"
                    this.sayMoveButton.style.display = '';
                } else {    //уже сходили
                    // прячем кнопку "Сказать ход"
                    this.sayMoveButton.style.display = 'none';
                }

                // обновление данных в бою
                var refreshBattle = general.getData(4)[0];
                if (refreshBattle && !this.tmRefreshBattle) {
                    this.tmRefreshBattle = general.root.
                        setInterval(function () {
                            var updLink = general.doc.
                                    querySelector('a[href*="updatedata()"], ' +
                                        'input[onclick$="void(updatedata())"]');

                            if (updLink) {
                                updLink.click();
                            }
                        }, +refreshBattle * 1000);
                }

                // подсвечиваем персонажей, которые уже сделали ход,
                // устанавливаем количество персонажей, сделавших ход
                if (!this.tmHighlightPers) {
                    this.setColorFighters(this);
                    this.tmHighlightPers = general.root.
                        setInterval(this.setColorFighters(this), 3000);
                }
            }

            // изменяем расположение бойцов, ставим тултипы...
            this.changeLocationFighters();
        }; // 2}}}

        /**
         * @method setChatInterface {{{2
         */
        this.setChatInterface = function () {
            // чекбокс "Сказать своей команде"
            var sayOnlyMyCommand = general.doc.createElement('input');
            sayOnlyMyCommand.type = 'checkbox';
            sayOnlyMyCommand.setAttribute('title', 'Сказать своей команде');
            this.inpTextChat.parentNode.insertBefore(sayOnlyMyCommand,
                    this.inpTextChat);

            // чекбокс "Сказать как координатор"
            var sayAsCoord = general.doc.createElement('input');
            sayAsCoord.type = 'checkbox';
            sayAsCoord.setAttribute('style', 'margin-right: 10px;');
            sayAsCoord.setAttribute('title', 'Сказать как координатор');
            this.inpTextChat.parentNode.insertBefore(sayAsCoord,
                    this.inpTextChat);

            var stData = general.getData(4);
            if (!stData[25]) {
                sayAsCoord.style.display = 'none';
                sayOnlyMyCommand.setAttribute('style', 'margin-right: 10px;');
            }

            if (general.viewMode) {
                sayOnlyMyCommand.style.display = 'none';
            }

            var _this = this;
            sayOnlyMyCommand.addEventListener('click', function () {
                var dataSt = general.getData(4),
                    thisChk = this;

                if (thisChk.checked) {
                    if (sayAsCoord.checked) {
                        dataSt[26] = '';
                        sayAsCoord.checked = false;
                        _this.inpTextChat.value = _this.inpTextChat.value.
                            replace(/^\s*!\*\s*/, '');
                    }

                    dataSt[10] = '1';
                    var chatMessage = _this.inpTextChat.value;
                    // noinspection RegExpSingleCharAlternation
                    if (!general.viewMode &&
                            !/^\s*(~|\*|@)/.test(chatMessage)) {
                        _this.inpTextChat.value = '~' + chatMessage;
                    }

                    if (_this.intervalUpdateInpTextChat) {
                        general.root.clearInterval(_this.
                            intervalUpdateInpTextChat);
                    }

                    // костыль после отправки сообщения в чат
                    if (!general.viewMode) {
                        _this.intervalUpdateInpTextChat = general.root.
                            setInterval(function () {
                                if (!_this.inpTextChat.value) {
                                    _this.inpTextChat.value = '~';
                                }
                            }, 1000);
                    }
                } else {
                    dataSt[10] = '';
                    // noinspection RegExpSingleCharAlternation
                    _this.inpTextChat.value = _this.inpTextChat.value.
                        replace(/^\s*(~|\*|@)\s*/, '');

                    if (_this.intervalUpdateInpTextChat) {
                        general.root.clearInterval(_this.
                            intervalUpdateInpTextChat);
                    }
                }

                general.setData(dataSt, 4);
                _this.inpTextChat.focus();
            }, false);

            sayAsCoord.addEventListener('click', function () {
                var dataSt = general.getData(4),
                    thisChk = this;

                if (thisChk.checked) {
                    if (sayOnlyMyCommand.checked) {
                        dataSt[10] = '';
                        sayOnlyMyCommand.checked = false;
                        _this.inpTextChat.value = _this.inpTextChat.value.
                            replace(/^\s*~\s*/, '');
                    }

                    dataSt[26] = '1';
                    var chatMessage = _this.inpTextChat.value;
                    // noinspection RegExpSingleCharAlternation
                    if (!/^!\*/.test(chatMessage)) {
                        _this.inpTextChat.value = '!*' + chatMessage;
                    }

                    if (_this.intervalUpdateInpTextChat) {
                        general.root.clearInterval(_this.
                            intervalUpdateInpTextChat);
                    }

                    // костыль после отправки сообщения в чат
                    _this.intervalUpdateInpTextChat = general.root.
                        setInterval(function () {
                            if (!_this.inpTextChat.value) {
                                _this.inpTextChat.value = '!*';
                            }
                        }, 1000);
                } else {
                    dataSt[26] = '';
                    // noinspection RegExpSingleCharAlternation
                    _this.inpTextChat.value = _this.inpTextChat.value.
                        replace(/^\s*!\*\s*/, '');

                    if (_this.intervalUpdateInpTextChat) {
                        general.root.clearInterval(_this.
                            intervalUpdateInpTextChat);
                    }
                }

                general.setData(dataSt, 4);
                _this.inpTextChat.focus();
            }, false);

            if (stData[10]) {
                sayOnlyMyCommand.click();
            } else if (stData[26]) {
                sayAsCoord.click();
            }

            if (general.viewMode) {
                return;
            }

            // если отмечен чекбокс "Сказать своей команде", символ '~' стереть
            // будет нельзя
            // если отмечен чекбокс "Сказать как координатор", символы '!*'
            // стереть будет нельзя
            this.inpTextChat.addEventListener('input', function (e) {
                var thisInp = this;
                if (sayOnlyMyCommand.checked && !thisInp.value) {
                    thisInp.value = '~';
                }

                if (sayAsCoord.checked &&
                        (!thisInp.value || thisInp.value === '!')) {
                    thisInp.value = '!*';
                }

                // при нажатии <Enter> сохраняем установленный ход
                var ev = e || general.root.event,
                    key = ev.keyCode;

                if (key === 13 || key === 10) {
                    _this.sayMove(_this, true);
                }
            }, false);

            // при клике на "Написать" сохраняем установленный ход
            var writeButton = general.doc.querySelector('input[type="submit"]' +
                '[value="Написать"]');
            writeButton.addEventListener('click', function () {
                _this.sayMove(_this, true);
            }, false);

            // кнопа "Сказать ход"
            this.sayMoveButton = general.doc.createElement('input');
            this.sayMoveButton.type = 'button';
            this.sayMoveButton.setAttribute('class', 'mainbutton');
            this.sayMoveButton.setAttribute('style', 'background: #F5FFF5; ' +
                'border-radius: 3px; cursor: pointer; box-shadow: ' +
                '1px 1px 2px rgba(122,122,122,0.5);');
            this.sayMoveButton.value = 'Сказать ход';
            this.sayMoveButton.addEventListener('click', function () {
                _this.sayMove(_this, false);
            }, false);
            sayOnlyMyCommand.parentNode.insertBefore(this.sayMoveButton,
                    sayOnlyMyCommand);

            // если двурукий, устанавливаем чекбоксы:
            // "Говорить только правую руку" и "Говорить только левую руку"
            if (general.$('left_attack1') && general.$('right_attack1')) {
                // "Говорить только левую руку"
                var sayOnlyLeftHand = general.doc.createElement('input');
                sayOnlyLeftHand.setAttribute('id', 'sayOnlyLeftHand');
                sayOnlyLeftHand.type = 'checkbox';
                sayOnlyLeftHand.setAttribute('title',
                    'Говорить только левую руку');
                sayOnlyLeftHand.checked = !!stData[18];
                sayOnlyMyCommand.parentNode.
                    insertBefore(sayOnlyLeftHand, sayOnlyMyCommand);

                sayOnlyLeftHand.addEventListener('click', function () {
                    var data = general.getData(4),
                        this_checked = sayOnlyLeftHand.checked;

                    data[18] = this_checked ? '1' : '';
                    general.setData(data, 4);

                    // если отмечен, сбрасываем чекбокс для правой руки
                    var onlyRightHand = general.$('sayOnlyRightHand');
                    if (this_checked && onlyRightHand.checked) {
                        onlyRightHand.click();
                    }
                }, false);

                // "Говорить только правую руку"
                var sayOnlyRightHand = general.doc.createElement('input');
                sayOnlyRightHand.setAttribute('id', 'sayOnlyRightHand');
                sayOnlyRightHand.type = 'checkbox';
                sayOnlyRightHand.setAttribute('title',
                    'Говорить только правую руку');
                sayOnlyRightHand.checked = !!stData[23];
                sayOnlyMyCommand.parentNode.
                    insertBefore(sayOnlyRightHand, sayOnlyLeftHand);

                sayOnlyRightHand.addEventListener('click', function () {
                    var data = general.getData(4),
                        this_checked = sayOnlyRightHand.checked;

                    data[23] =  this_checked ? '1' : '';
                    general.setData(data, 4);

                    // если отмечен, сбрасываем чекбокс для левой руки
                    var onlyLeftHand = general.$('sayOnlyLeftHand');
                    if (this_checked && onlyLeftHand.checked) {
                        onlyLeftHand.click();
                    }
                }, false);
            }

            // добавляем кнопку "Обновить"
            var buttonUpdate = general.doc.createElement('input');
            buttonUpdate.type = 'button';
            buttonUpdate.setAttribute('class', 'mainbutton');
            buttonUpdate.setAttribute('style', 'background: #F5FFF5; ' +
                'border-radius: 3px; cursor: pointer; box-shadow: ' +
                '1px 1px 2px rgba(122,122,122,0.5);');
            buttonUpdate.value = 'Обновить';
            buttonUpdate.setAttribute('onclick',
                    ['javascript', ':', 'void(updatedata())'].join(''));

            this.inpTextChat.parentNode.appendChild(buttonUpdate);
        }; // 2}}}

        /**
         * @method changeMakebf {{{2
         */
        this.changeMakebf = function () {
            var _this = this;
            general.root.makebf = function () {
                /** @namespace general.root.waitforturn */
                /** @namespace general.root.bf1 */
                /** @namespace general.root.bf2 */
                /** @namespace general.root.bf3 */
                /** @namespace general.root.bfndl */
                general.$('bf').innerHTML = !general.root.waitforturn ?
                        general.root.bf1 : general.root.bf2 + general.root.bf3;
                general.$('bfndl').innerHTML = general.root.bfndl;
                _this.start();
            };
        }; // 2}}}

        /**
         * @method tryStart {{{2
         */
        this.tryStart = function () {
            if (general.viewMode) {
                this.setChatInterface();
                this.start();
                return;
            }

            this.inpTextChat = general.doc.querySelector('input[name="oldm"]');
            // основное поле боя
            var bf = general.$('bf');

            if (this.inpTextChat && bf &&
                    !/Загружаются данные/.test(bf.innerHTML)) {
                this.changeMakebf();
                this.setChatInterface();
                this.start();
            } else {
                // ждем загрузки фрейма с данными
                var _this = this;
                general.root.setTimeout(function () {
                    _this.tryStart();
                }, 100);
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // графическое оформление боев или НЕ JS-версия боя
            if (general.doc.querySelector('table[style*="battleground"]') ||
                    /\/b0\/b\.php/.test(general.loc) ||
                    general.root.self !== general.root.top) {
                return;
            }

            // обновление страницы, когда висим в заявке
            if (/(\/wargroup|\/warlist)\.php/.test(general.loc)) {
                var refreshAppl = general.getData(4)[1];
                if (refreshAppl && (general.doc.
                        querySelector('center>b>font[color="#990000"]') ||
                            general.doc.querySelector('td[width="70%"]>b>' +
                                    'font[color="#990000"]'))) {

                    var updateLink = general.$('updatetimer2') ||
                            general.$('updatetimer');
                    if (updateLink) {
                        general.root.setTimeout(function () {
                            general.root.location = updateLink.parentNode.href;
                        }, +refreshAppl * 1000);
                    }
                }

                return;
            }

            if (general.viewMode) {
                this.inpTextChat = general.doc.
                    querySelector('input[name="msg"]');
                // бой закончился
                if (!this.inpTextChat) {
                    return;
                }
            }

            // в бою
            if (!general.viewMode) {
                new PlaySound().init(general.getData(4)[21]);
                // ячейка для вывода информации своего перса
                var tdTop = general.doc.querySelector('td[class="txt"]' +
                        '[width="50%"][align="right"]');
                tdTop.setAttribute('width', '30%');
                tdTop.previousElementSibling.setAttribute('width', '30%');
                this.myInfoTopPanel = general.doc.createElement('td');
                this.myInfoTopPanel.setAttribute('width', '40%');
                this.myInfoTopPanel.setAttribute('style',
                        'text-align: center;');
                tdTop.parentNode.insertBefore(this.myInfoTopPanel, tdTop);
            }

            // tooltip с информацией о бойцах при наведении на них мыши
            this.tooltip = general.doc.createElement('div');
            this.tooltip.setAttribute('id', 'div_tooltip');
            this.tooltip.setAttribute('style', 'display: none; position: ' +
                'absolute; font-size: 8pt; background-color: #F5FFF5; ' +
                'padding: 3px; border: 1px solid #339933; border-radius: ' +
                '7px; box-shadow: 2px 3px 5px rgba(122,122,122,0.5);');

            general.doc.body.appendChild(this.tooltip);
            // на всякий случай, если останется виден
            this.tooltip.addEventListener('click', function () {
                var _this = this;
                _this.style.display = 'none';
            }, false);

            this.tryStart();
        }; // 2}}}
    }; // 1}}}

    /**
     * @class BlacklistHighlighting {{{1
     * @constructor
     */
    var BlacklistHighlighting = function () {
        /**
         * @property blTable
         * @type {HTMLTableElement|null}
         */
        this.blTable = null;

        /**
         * @method rememberClick {{{2
         * @param   {Object}    _this
         */
        this.rememberClick = function (_this) {
            var a = _this.blTable.querySelectorAll('a[href*="/info.php?id="]'),
                stData = general.getData(5),
                mass,
                i;

            //в ЧС никого нет
            if (!a.length) {
                stData[0] = '';
                general.setData(stData, 5);
                alert('Ваш ЧС пуст. Сначала нужно добавить персонажей.');
                return;
            }

            mass = [];
            for (i = 0; i < a.length; i++) {
                mass.push(/info\.php\?id=(\d+)/.exec(a[i].href)[1]);
            }

            stData[0] = mass.join(',');
            general.setData(stData, 5);
            _this.setHighlighting();
        }; // 2}}}

        /**
         * @method clearClick {{{2
         * @param   {Object}    _this
         */
        this.clearClick = function (_this) {
            var stData = general.getData(5);

            if (stData[0]) {
                stData[0] = '';
                general.setData(stData, 5);
                _this.setHighlighting();
            } else {
                alert('В памяти скрипта нет ЧС');
            }
        }; // 2}}}

        /**
         * @method setHighlighting {{{2
         */
        this.setHighlighting = function () {
            var a = general.doc.querySelectorAll('a[href*="/info.php?id="]'),
                stData = general.getData(5),
                link,
                id,
                i;

            for (i = 0; i < a.length; i++) {
                a[i].style.background = '';
                id = /\?id=(\d+)$/.exec(a[i].href);
                id = id && id[1].length > 3 ? id[1] : null;
                // noinspection JSUnresolvedVariable
                if (id && stData[0].indexOf(id) !== -1) {
                    a[i].style.background = '#B6B5B5';
                    // блокировка ссылки принятия боя в одиночных заявках
                    // noinspection JSUnresolvedVariable
                    if (stData[1] && /Подтверждаете бой с/.
                            test(a[i].parentNode.innerHTML)) {
                        link = general.doc.
                            querySelector('a[class="mainbutton"]' +
                                '[href*="/warlist.php?war=armed&do=5&cu="]');
                        link.removeAttribute('class');
                        link.setAttribute('style', 'text-decoration: ' +
                            'line-through; color: #808080;');
                        link.href = '#';
                    }
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (/home\.friends\.php/.test(general.loc)) {
                this.blTable = general.doc.querySelectorAll('table' +
                        '[border="0"][cellspacing="0"][cellpadding="3"]' +
                        '[class="wb"][align="center"][width="100%"]');

                if (!this.blTable[1]) {
                    return;
                }

                this.blTable = this.blTable[1];
                var buttonStyle = 'margin-left: 5px; border: solid 1px; ' +
                    'border-radius: 3px; background: #D0EED0; cursor: pointer;',
                    butRemember = general.doc.createElement('input'),
                    butClear = general.doc.createElement('input'),
                    _this = this;

                butRemember.type = 'button';
                butRemember.value = 'Запомнить ЧС';
                butRemember.setAttribute('style', buttonStyle);
                butRemember.addEventListener('click', function () {
                    _this.rememberClick(_this);
                }, false);

                butClear.title = 'Забыть';
                butClear.type = 'button';
                butClear.value = 'X';
                butClear.setAttribute('style', buttonStyle);
                butClear.addEventListener('click', function () {
                    _this.clearClick(_this);
                }, false);

                var target = this.blTable.querySelector('td');
                target.appendChild(butRemember);
                target.appendChild(butClear);
            }

            if (general.getData(5)[0]) {
                if (/gwars.*\/b0\//.test(general.loc)) {
                    general.root.setInterval(this.setHighlighting, 1000);
                } else if (/\/usertransfers\.php/.test(general.loc)) {
                    general.root.setTimeout(this.setHighlighting, 300);
                } else {
                    this.setHighlighting();
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class WorkPostGrenadesBroken {{{1
     * @constructor
     */
    var WorkPostGrenadesBroken = function () {
        /**
         * @property wpgbContainer
         * @type {HTMLElement}
         */
        this.wpgbContainer = general.doc.createElement('span');
        /**
         * @property redFactory
         * @type {String}
         */
        this.redFactory = general.imgPath + 'WorkPostGrenadesBroken/' +
                'redFactory.gif';
        /**
         * @property blueFactory
         * @type {String}
         */
        this.blueFactory = general.imgPath + 'WorkPostGrenadesBroken/' +
                'blueFactory.gif';
        /**
         * @property grenades {{{2
         * @type {Array}
         */
        this.grenades = [
            // гос
            'emp_irs', 'emp_a', 'rgd5', 'grenade_f1', 'rgd2', 'lightst',
            'lights', 'rkg3', 'mdn', 'rgd2m', 'rgo', 'm84', 'rgn', 'emp_ir',
            'fg3l', 'l83a1', 'emp_s', 'm67', 'm3', 'hg78', 'hg84', 'fg6',
            'anm14', 'm34ph', 'fg7', 'fg8bd', 'r10',
            //синдовые
            'lightss', 'lightsm', 'rgd2s', 'grenade_dg1', 'fg5', 'molotov',
            'hellsbreath', 'napalm', 'ghtb', 'me85',
            //ржавка
            'old_rgd5',
            //гранатометы
            /* гос */
            'rpg', 'ptrk', 'glauncher', 'grg', 'paw20', 'rpgu', 'grom2',
            'ags30', 'gm94', 'gl06', 'gmg', 'balkan', 'rg6', 'm202', 'mm1',
            /* арт */
            'milkor', 'm32', 'mk47',
            /* пасхальные яйца */
            'pegg1', 'pegg2', 'pegg3', 'egg1', 'egg2', 'egg3'
        ]; // 2}}}

        /**
         * @method addContent {{{2
         * @param   {Array}     sms
         * @param   {Boolean}   gren
         * @param   {Boolean}   broken
         * @return  {String}
         */
        this.addContent = function (sms, gren, broken) {
            var host = ' [<a href="https://' + general.domain + '/',
                stData = general.getData(6),
                str = '';

            if (sms[0] && stData[3]) {    // письмо
                str += host + 'sms.php">' +
                    '<img src="https://images.' +
                    general.domain.replace('www.', '') +
                    '/img/letter-pc.png" title="' +
                    sms[0].getAttribute('title') +
                    '" alt="Вам письмо"></a> <span style="color: #005F00">' +
                    sms[2] + '</span>]';
            }

            if (sms[1] && stData[3]) {    // посылка
                str += host + 'items.php"><img src="https://' + general.domain +
                    '/i/woodbox.gif" title="Пришла посылка!" ' +
                    'alt="посылка"></a>]';
            }

            if (!gren && stData[5]) { // граната
                str += host + 'items.php"><span style="color: #FF0000; ' +
                    'font-weight: bold;">Грена</span></a>]';
            }

            if (broken && stData[4]) { // слом
                str += host + 'workshop.php"><span style="color: #FF0000; ' +
                    'font-weight: bold;">Слом</span></a>]';
            }

            return str;
        }; // 2}}}

        /**
         * @method startWorkPostGrenadesBroken {{{2
         * @param   {Object}    _this
         */
        this.startWorkPostGrenadesBroken = function (_this) {
            var ajaxQuery = new AjaxQuery(),
                url = 'https://' + general.domain + '/me.php';

            _this = _this || this;
            ajaxQuery.init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;
                _this.wpgbContainer.innerHTML = '';
                // персонаж в пути
                if (/Вы находитесь в пути/.test(spanContent.innerHTML)) {
                    _this.wpgbContainer.innerHTML = '<span style="color: ' +
                            '#0000FF;">[в пути]</span>';
                    return;
                }

                // персонаж в бою
                if (/Идёт бой/.test(spanContent.
                        querySelector('title').innerHTML)) {
                    _this.wpgbContainer.innerHTML = '<span style="color: ' +
                        '#0000FF;">[бой]</span>';
                    return;
                }

                // проверка на новое письмо и/или посылку
                // [письмо, посылка, количество новых писем]
                var testSms = [
                    spanContent.querySelector('img[src$="/img/letter-pc.png"]'),
                    spanContent.querySelector('a>img[src$="/i/woodbox.gif"]'),
                    ''
                ];

                // если есть письмо, смотрим количество новых/не прочитанных
                if (testSms[0]) {
                    var countSmsLink = spanContent.
                            querySelector('a[href$="/sms.php"]' +
                                '[class="graybutton"]');

                    if (countSmsLink) {
                        var countSms = /В почте (\d+)/.
                                exec(countSmsLink.innerHTML);
                        testSms[2] = countSms ? countSms[1] : '';
                    }
                }

                var stData = general.getData(6),
                    playSound = new PlaySound();

                if ((testSms[0] || testSms[1]) && !stData[0]) {
                    stData[0] = '1';
                    playSound.init(stData[6]);
                    general.setData(stData, 6);
                } else if (!testSms[0] && !testSms[1] && stData[0]) {
                    stData[0] = '';
                    general.setData(stData, 6);
                }

                // ищем ссылку на объект где работаем/работали
                var cssSelector = 'td.font8pt[align="center"]',
                    linkObj = spanContent.querySelector(cssSelector);

                // видимо что-то случилось
                if (!linkObj) {
                    return;
                }

                var content = linkObj.innerHTML;
                linkObj = linkObj.querySelector('a[href^="/object.php?id="]');
                if (!linkObj) {
                    return;
                }

                // поиск ссылок на экипировку
                cssSelector = 'td[valign="bottom"][bgcolor="#e9ffe9"]' +
                    '[colspan="2"]';
                var items = spanContent.querySelector(cssSelector);
                items = items ? items.querySelectorAll('a') : false;

                // время до окончания работы
                var time;
                if (/(Вы сможете устроиться на|осталось)[^\d]*\d+ минут/i.
                        test(content)) {
                    time = +/(\d+) минут/i.exec(content)[1];
                    time = !time ? 1 : time;
                } else if (/Последний раз вы работали/i.test(content)) {
                    time = 0;
                } else if (/Вы работаете на/i.test(content)) {
                    time = 1;
                }

                // проверка на наличие грены
                var testGrenades = false;
                if (items && items.length) {
                    var itemId, i;
                    for (i = 0; i < items.length; i++) {
                        itemId = /\/item\.php\?item_id=(.*)$/.
                            exec(items[i].href);
                        if (itemId &&
                                _this.grenades.indexOf(itemId[1]) !== -1) {
                            testGrenades = true;
                            break;
                        }
                    }
                }

                var ttl = '" title="Объект #' +
                        /object\.php\?id=(\d+)/.exec(linkObj.href)[1] +
                        '" alt="GW объект" /></a>]';

                if (time) {
                    if (stData[2]) {
                        _this.wpgbContainer.innerHTML = '[<span style=' +
                            '"color: #0000FF;">' + time + '</span> мин ' +
                            '<a href="' + linkObj.href + '"><img alt="img" ' +
                            'src="' + _this.blueFactory + ttl;
                    }

                    stData[1] = '';
                    general.setData(stData, 6);
                } else {
                    if (stData[2]) {
                        _this.wpgbContainer.innerHTML = '[<a href="' +
                            linkObj.href + '"><img alt="img" src="' +
                            _this.redFactory + ttl;
                    }

                    if (!stData[1]) {
                        stData[1] = '1';
                        playSound.init(stData[7]);
                        general.setData(stData, 6);
                    }
                }

                cssSelector = 'a[href="/workshop.php"][style$="#990000;"]';
                var testBroken = spanContent.querySelector(cssSelector) ||
                        false;
                _this.wpgbContainer.innerHTML += _this.addContent(testSms,
                    testGrenades, testBroken);

            }, function () {
                general.root.setTimeout(function () {
                    _this.startWorkPostGrenadesBroken(_this);
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var topPanel = new GetTopPanel().init();
            // noinspection JSUnresolvedVariable
            if (topPanel) {
                topPanel.appendChild(general.doc.createTextNode(' | '));
                topPanel.appendChild(this.wpgbContainer);

                this.startWorkPostGrenadesBroken(null);
                var _this = this;
                general.root.setInterval(function () {
                    _this.startWorkPostGrenadesBroken(_this);
                }, new GetRandom().init(20, 40) * 1000);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ResourcesAndBonuses {{{1
     * @constructor
     */
    var ResourcesAndBonuses = function () {
        /**
         * @property divResult
         * @type {HTMLElement}
         */
        this.divResult = general.doc.createElement('div');

        /**
         * @method fillData {{{2
         * @param   {String}    data
         */
        this.fillData = function (data) {
            this.divResult.innerHTML = data + '<div style="margin-top: 5px;">' +
                '<img id="divres_close" style="cursor: pointer;" ' +
                'src="' + general.imgPath + 'close.gif" alt="img" /></div>';

            var _this = this;
            general.$('divres_close').addEventListener('click', function () {
                _this.divResult.style.visibility = 'hidden';
            }, false);
        }; // 2}}}

        /**
         * @method showData {{{2
         * @param   {Object}    _this
         */
        this.showData = function (_this) {
            var pos = new GetPos().init(_this);

            this.divResult.style.left = pos.x;
            this.divResult.style.top = pos.y + 25;
            this.divResult.style.visibility = 'visible';
            this.divResult.innerHTML = '<img src="' + general.imgPath +
                'preloader.gif' + '" alt="img" />';

            var url = 'https://' + general.domain + '/info.php?id=' +
                    general.myID,
                idElem = _this.id,
                ths = this;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;
                var cssSelector = 'td[class="greenbrightbg"][align="center"]' +
                        '[valign="top"]',
                    tables = spanContent.querySelectorAll(cssSelector),
                    data;

                data = idElem === 'res' ?
                        tables[0].innerHTML : tables[2].innerHTML;

                if (/Ресурсов в наличии нет/i.test(data)) {
                    data = '<span style="color: #0000FF;">Ресурсов в наличии ' +
                        'нет</span>';
                }

                ths.fillData(data);
            }, function () {
                ths.fillData('<span style="color: #FF0000;">' +
                    'Ошибка ответа сервера...</span>');
            });
        }; // 2}}}

        /**
         * @method createButton {{{2
         * @param   {String}    value
         * @param   {String}    id
         * @return  {HTMLElement}
         */
        this.createButton = function (value, id) {
            var span = general.doc.createElement('span'),
                _this = this;

            span.innerHTML = value;
            span.id = id;
            span.setAttribute('style', 'cursor: pointer;');
            span.addEventListener('click', function () {
                var ths = this;
                _this.showData(ths);
            }, false);
            return span;
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var topPanel = new GetTopPanel().init();
            // noinspection JSUnresolvedVariable
            if (topPanel) {
                this.divResult.setAttribute('style', 'visibility: hidden; ' +
                        'position: absolute; padding: 3px; background-color: ' +
                        '#E7FFE7; border: solid 1px #339933; ' +
                        'border-radius:5px; top:0; left:0; box-shadow: ' +
                        '5px 6px 6px rgba(122,122,122,0.5); z-index: 999;');
                general.doc.body.appendChild(this.divResult);

                topPanel.appendChild(general.doc.createTextNode(' | '));
                topPanel.appendChild(this.createButton('Ресурсы', 'res'));
                topPanel.appendChild(general.doc.createTextNode(' | '));
                topPanel.appendChild(this.createButton('Бонусы', 'bonus'));
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class CritShotsAndLinksBtlLog {{{1
     * @constructor
     */
    var CritShotsAndLinksBtlLog = function () {
        /**
         * @property showCritShots
         * @type {String}
         */
        this.showCritShots = general.getData(7)[0];

        /**
         * @class CriticalShots {{{2
         * @constructor
         */
        this.CriticalShots = function () {
            /**
             * @property groin
             * @type {int}
             */
            this.groin = 0;     //пах
            /**
             * @property neck
             * @type {int}
             */
            this.neck = 0;      //шея
            /**
             * @property ear
             * @type {int}
             */
            this.ear = 0;       //ухо
            /**
             * @property temple
             * @type {int}
             */
            this.temple = 0;    //висок

            /**
             * @method getAllCrits
             * @return  {int}
             */
            this.getAllCrits = function () {
                return this.groin + this.neck + this.ear + this.temple;
            };
        }; // 2}}}

        /**
         * @method getCrits {{{2
         * @param   {NodeList}  b
         * @return  {Object|null}
         */
        this.getCrits = function (b) {
            var criticalShots = new this.CriticalShots(),
                myNik = general.doc.querySelector('a[href$="/info.php?id=' +
                    general.myID + '"]>b'),
                linkStyle,
                nik,
                font,
                str,
                node,
                next,
                prev,
                i;

            for (i = 0; i < b.length; i++) {
                // если это урон (-XX), 'vs', пок с '['
                if ((/^-\d+$|vs|\[|,/.test(b[i].innerHTML) &&
                        !/\[NPC\]/.test(b[i].innerHTML)) ||
                            /может взять предметы/.test(b[i].innerHTML)) {
                    continue;
                }

                // делаем ссылки на персов, если ссылка еще не установлена
                if (!b[i].querySelector('a:first-child') &&
                        !b[i].getAttribute('style')) {
                    linkStyle = 'text-decoration: none; font-weight: 700; ' +
                        'font-size: ' + (general.viewMode ? '12px;' : '11px;');

                    // Победа за ...
                    font = b[i].parentNode;
                    if (font.nodeName === 'FONT') {
                        linkStyle += ' color: ' + font.color + ';';
                    }

                    // если это окрашенный ник, то внутри будет <font>
                    font = b[i].querySelector('font:first-child');
                    if (font) {
                        linkStyle += ' color: ' + font.color + ';';
                        nik = font.innerHTML;
                    } else {
                        nik = b[i].innerHTML;
                    }

                    // личный NPC
                    if (/\[NPC\]/.test(b[i].innerHTML)) {
                        nik = b[i].innerText;
                        linkStyle += ' opacity: 0.6;';
                    }

                    // noinspection JSUndefinedPropertyAssignment
                    b[i].innerHTML = '<a target="_blank" style="' + linkStyle +
                        '"  href="https://' + general.domain +
                        '/search.php?key=' + nik + '">' + nik + '</a>';
                }

                // наш ник не найден или в настройках не установлен checkbox
                // "показывать критические выстрелы" или это не наш ник
                if (!myNik || !this.showCritShots ||
                        b[i].innerHTML.indexOf(myNik.innerHTML) === -1) {
                    continue;
                }

                // проверяем и считаем криты
                prev = b[i].previousSibling || b[i].parentNode.previousSibling;
                if (prev && prev.nodeValue &&
                        /\d+:\d+, #\d+ :/.test(prev.nodeValue)) {

                    // получаем запись своего хода
                    str = '';
                    node = b[i].previousSibling ? b[i] : b[i].parentNode;
                    while (node && node.nodeName !== 'BR') {
                        next = node.nextElementSibling;
                        if (next.nodeName === 'I') {
                            str += next.innerHTML;
                        }

                        node = next;
                    }

                    if (str) {
                        // считаем криты
                        if (/в пах/.test(str)) {
                            if (/\d+ в пах/.test(str)) {
                                criticalShots.groin += +/(\d+) в пах/.
                                            exec(str)[1];
                            } else {
                                criticalShots.groin++;
                            }
                        }

                        if (/в шею/.test(str)) {
                            if (/\d+ в шею/.test(str)) {
                                criticalShots.neck += +/(\d+) в шею/.
                                            exec(str)[1];
                            } else {
                                criticalShots.neck++;
                            }
                        }

                        if (/в ухо/.test(str)) {
                            if (/\d+ в ухо/.test(str)) {
                                criticalShots.ear += +/(\d+) в ухо/.
                                            exec(str)[1];
                            } else {
                                criticalShots.ear++;
                            }
                        }

                        if (/в висок/.test(str)) {
                            if (/\d+ в висок/.test(str)) {
                                criticalShots.temple += +/(\d+) в висок/.
                                            exec(str)[1];
                            } else {
                                criticalShots.temple++;
                            }
                        }
                    }
                }
            }

            return this.showCritShots ? criticalShots : null;
        }; // 2}}}

        /**
         * @method showCrits {{{2
         * @param   {Object}    result
         */
        this.showCrits = function (result) {
            if (result && result.getAllCrits()) {
                general.$('count_all_crits').innerHTML = result.getAllCrits();
                general.$('crits_groin').innerHTML = result.groin;
                general.$('crits_neck').innerHTML = result.neck;
                general.$('crits_ear').innerHTML = result.ear;
                general.$('crits_temple').innerHTML = result.temple;
            }
        }; // 2}}}

        /**
         * @method change_updatechatlines {{{2
         */
        this.change_updatechatlines = function () {
            var _this = this;

            general.root.updatechatlines = function () {
                /** @namespace general.root.frames.bsrc */
                var logDiv = general.root.frames.bsrc.document.
                        querySelector('#log'),
                    battleLog;

                if (logDiv && logDiv.childNodes.length) {
                    battleLog = general.doc.querySelector('#log');
                    battleLog.innerHTML = logDiv.innerHTML +
                        battleLog.innerHTML;
                    logDiv.innerHTML = '';
                    _this.showCrits(_this.getCrits(general.doc.
                            querySelector('#log').querySelectorAll('b')));
                }
            };
        }; // 2}}}

        /**
         * @method setDataDiv {{{2
         * @param   {Object}    target
         * @param   {Boolean}   mode
         */
        this.setDataDiv = function (target, mode) {
            // noinspection JSUnresolvedVariable
            if (this.showCritShots) {
                var d = general.doc.createElement('div');
                d.innerHTML = '<span style="color: #008000; font-weight: ' +
                    'bold;">Криты:</span> <span id="count_all_crits" ' +
                    'style="color: #FF0000; font-weight: bold;">0</span> ' +
                    '[ <span style="text-decoration: underline;">в пах:' +
                    '</span> <span id="crits_groin" style="color: ' +
                    '#FF0000;">0</span> <span style="text-decoration: ' +
                    'underline;">в шею:</span> <span id="crits_neck" ' +
                    'style="color: #FF0000;">0</span> <span style=' +
                    '"text-decoration: underline;">в ухо:</span> ' +
                    '<span id="crits_ear" style="color: #FF0000;">0</span> ' +
                    '<span style="text-decoration: underline;">в висок:' +
                    '</span> <span id="crits_temple" style="color: ' +
                    '#FF0000;">0</span> ]';
                target.appendChild(d);

                if (!mode) {    // в бою
                    target.appendChild(general.doc.createElement('br'));
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // НЕ JS-версия боя
            if (/\/b0\/b\.php/.test(general.loc)) {
                return;
            }

            var chat = general.doc.querySelector('form[name="battlechat"]'),
                _this = this,
                log;

            if (!general.viewMode) {    // в бою
                // ждем загрузки данных на странице
                var lPers = general.$('listleft');
                log = general.$('log');
                if (!lPers || /загружаются данные/i.test(lPers.innerHTML) ||
                        !log || !chat) {
                    general.root.setTimeout(function () {
                        _this.init();
                    }, 200);
                    return;
                }

                this.setDataDiv(chat.parentNode, false);
                // изменяем функцию обновления чата на странице
                this.change_updatechatlines();
            } else {    // режим наблюдения за боем
                var center = general.doc.querySelector('td[valign="top"]' +
                        '[width="70%"]>center');
                center.appendChild(general.doc.createElement('br'));
                center.appendChild(general.doc.createElement('br'));
                this.setDataDiv(center, true);
                this.showCrits(this.getCrits(general.doc.
                        querySelector('td>span[class="txt"]').
                    querySelectorAll('b')));
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class DeleteSms {{{1
     * @constructor
     */
    var DeleteSms = function () {
        /**
         * @method testSubject {{{2
         * @param   {HTMLInputElement}  chk
         * @param   {Object}            reg
         * @return  {Boolean}
         */
        this.testSubject = function (chk, reg) {
            // noinspection JSUnresolvedVariable
            return reg.test(chk.parentNode.nextElementSibling.innerHTML);
        }; // 2}}}

        /**
         * @method checkSms {{{2
         * @param   {HTMLElement}   chk
         * @param   {Boolean}       is_check
         * @param   {Boolean}       load
         */
        this.checkSms = function (chk, is_check, load) {
            var stData = general.getData(8);
            // [0]  - отмечать синдовые рассылки
            // [1]  - отмечать рассылки от робота
            // [2]  - НЕ отмечать письма с пометкой "важное"

            if (is_check) {
                chk.checked = false;
                return;
            }

            var markSyndSms = stData[0],
                markRobotSms = stData[1],
                noMarkImportantSms = stData[2],
                no_check_important = this.testSubject(chk, /\[важное\]/) &&
                    noMarkImportantSms;

            if (this.testSubject(chk, /<b>#\d+<\/b>/)) {
                // синдрассылка
                if (!no_check_important) {
                    chk.checked = !!markSyndSms;
                } else {
                    chk.checked = false;
                }
            } else if (chk.parentNode.parentNode.
                    querySelector('a[href="/info.php?id=1"]')) {
                // сообщение от робота
                if (!no_check_important) {
                    chk.checked = !!markRobotSms;
                } else {
                    chk.checked = false;
                }
            } else {
                // все остальные сообщения (только при нажатии [+])
                if (!no_check_important) {
                    chk.checked = !load;
                } else {
                    chk.checked = false;
                }
            }
        }; // 2}}}

        /**
         * @method get_checkbox_checked {{{2
         * @return  {HTMLElement|null}
         */
        this.get_checkbox_checked = function () {
            return general.doc.querySelector('input[type="checkbox"]' +
                '[name^="kill"]:checked');
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var target = general.doc.querySelector('tr>td>a:last-child' +
                        '[href="/sms.php?page=2"]'),
                del = general.doc.querySelector('input[class="mainbutton"]' +
                    '[type="submit"][value="Удалить отмеченные"]'),
                smsChk = general.doc.querySelectorAll('input[type="checkbox"]' +
                    '[name^="kill"]'),
                i;

            if (!target || !del) {
                return;
            }

            // отмечаем сообщения в соответствии с настройками скрипта
            for (i = 0; i < smsChk.length; i++) {
                this.checkSms(smsChk[i], false, true);
            }

            target = target.parentNode.parentNode;
            target.innerHTML += '<td valign="top" class="greengreenbg" ' +
                'align="center" style="width: 150px;"></td>';
            target = target.lastElementChild;

            // кнопка удаления
            var delButton = general.doc.createElement('span');
            delButton.innerHTML = 'Удалить отмеченные';
            delButton.setAttribute('style', 'cursor: pointer; ' +
                    'text-decoration: underline;');
            delButton.addEventListener('click', function () {
                del.click();
            }, false);

            target.appendChild(delButton);

            // кнопка "Отметить все/Снять все"
            var markAll = general.doc.createElement('span'),
                checkbox_checked = this.get_checkbox_checked(),
                check_all = 'Отметить все',
                clear_all = 'Снять все',
                minus = '[&minus;]',
                plus = '[+]';

            markAll.setAttribute('style', 'margin-left: 5px; ' +
                    'cursor: pointer; color: #990000');
            markAll.innerHTML = checkbox_checked ? minus : plus;
            markAll.title = checkbox_checked ? clear_all : check_all;
            target.appendChild(markAll);
            var _this = this;
            markAll.addEventListener('click', function () {
                var but = this,
                    is_check = _this.get_checkbox_checked();

                but.innerHTML = is_check ? plus : minus;
                but.title = is_check ? check_all : clear_all;

                var l;
                for (l = 0; l < smsChk.length; l++) {
                    _this.checkSms(smsChk[l], is_check, false);
                }
            }, false);
        }; // 2}}}
    }; // 1}}}

    /**
     * @class FarmExperience {{{1
     * @constructor
     */
    var FarmExperience = function () {
        /**
         * @method calculateFarm {{{2
         * @param   {int}       p1
         * @param   {int}       p2
         * @param   {int}       time
         * @param   {Number}    exp
         * @return  {String}
         */
        this.calculateFarm = function (p1, p2, time, exp) {
            var money = ((p2 - p1) / time * 60).toFixed(2),
                experience = (exp / time * 60).toFixed(3);

            return ' <span style="color: #FF0000;">[$' + money + ']</span>' +
                    '<span style="color: #0000FF;">[' + experience + ']</span>';
        }; // 2}}}

        /**
         * @method runInit {{{2
         */
        this.runInit = function () {
            var _this = this;
            return function () {
                general.root.setTimeout(function () {
                    _this.init();
                }, 700);
            };
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var a = general.doc.querySelectorAll('*[onclick*="gotourl("],' +
                        '*[onclick*="openurl("],*[onclick*="plantit("]'),
                l;

            for (l = 0; l < a.length; l++) {
                a[l].addEventListener('click', this.runInit(), false);
            }

            // не на пустрой грядке
            if (!general.doc.querySelector('input[value="Посадить"]')) {
                return;
            }

            var plants = general.doc.querySelectorAll('table[cellspacing="0"]' +
                    '[cellpadding="0"]  td[valign="top"][onclick*="btn_"]'),
                price1,
                price2,
                target,
                time,
                span,
                exp,
                i;

            for (i = 0; i < plants.length; i++) {
                span = general.doc.createElement('span');
                span.setAttribute('style', 'font-size: 9px;');
                price1 = +/\$(\d+)/.exec(plants[i].querySelector('font' +
                    '[color="#006600"]>b:last-child').innerHTML)[1];
                price2 = +/\$(\d+)/.exec(plants[i].querySelector('font' +
                    '[color="#990000"]>b').innerHTML)[1];
                time = +/созревания:\s(\d+)/.exec(plants[i].innerHTML)[1];
                exp = parseFloat(/(\d+\.?\d*) опыта/.
                                    exec(plants[i].innerHTML)[1]);
                span.innerHTML = this.calculateFarm(price1, price2, time, exp);
                target = plants[i].querySelector('br');
                target.parentNode.insertBefore(span, target);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class FarmTimer {{{1
     * @constructor
     */
    var FarmTimer = function () {
        /**
         * @property farmLink
         * @type {HTMLLinkElement|null}
         */
        this.farmLink = null;
        /**
         * @property checkInterval
         * @type {int}
         */
        this.checkInterval = 0;

        /**
         * @method setRedLink {{{2
         * @param   {String}    str
         */
        this.setRedLink = function (str) {
            var action = str === '2' ? 'Собрать' : 'Полить';
            this.farmLink.setAttribute('style', 'color: #FF0000; ' +
                    'font-weight: bold; text-decoration: none;');
            this.farmLink.innerHTML = '[' + action + ']';
        }; // 2}}}

        /**
         * @method checkState {{{2
         */
        this.checkState = function () {
            if (!/bold/.test(this.farmLink.getAttribute('style'))) {
                if (this.checkInterval) {
                    general.root.clearInterval(this.checkInterval);
                }

                return;
            }

            var stData = general.getData(9);
            if (!stData[0]) {
                this.farmLink.innerHTML = '';
                return;
            }

            var timeNow = new Date().getTime(),
                time = +stData[0];

            if (timeNow <= time) {
                this.farmLink.setAttribute('style', 'color: #0000FF; ' +
                        'text-decoration: none;');
                stData[3] = '';
                general.setData(stData, 9);
                this.showTimer(+((time - timeNow) / 1000).toFixed(0));
            }
        }; // 2}}}

        /**
         * @method setReminder {{{2
         */
        this.setReminder = function () {
            var stData = general.getData(9);
            if (!stData[0]) {
                this.farmLink.innerHTML = '';
                return;
            }

            this.setRedLink(stData[1]);

            var _this = this;
            this.checkInterval = general.root.setInterval(function () {
                _this.checkState();
            }, 2000);

            if (!stData[4]) {
                return;
            }

            var timeNow = new Date().getTime();
            if (timeNow < +stData[0]) {
                return;
            }

            var soundTime = +stData[2],
                intrvl = stData[5] ? +stData[5] * 1000 : 0,
                random = new GetRandom();

            // пора проигрывать звук
            if (timeNow - soundTime >= intrvl) {
                // в настройках указано не повторять звук
                if (!intrvl) {
                    // если звук еще не был проигран
                    if (!stData[3]) {
                        stData[3] = '1';
                        general.setData(stData, 9);
                        new PlaySound().init(stData[4]);
                    }

                    return;
                }

                stData[2] = timeNow;
                general.setData(stData, 9);
                general.root.setTimeout(function () {
                    _this.setReminder();
                }, intrvl + random.init(1000, 10000));

                new PlaySound().init(stData[4]);
            } else if (intrvl) {
                general.root.setTimeout(function () {
                    _this.setReminder();
                }, intrvl - (timeNow - soundTime) + random.init(1000, 10000));
            }
        }; // 2}}}

        /**
         * @method showTimer {{{2
         * @param   {int}   sec
         */
        this.showTimer = function (sec) {
            var min,
                s,
                h;

            if (!sec) {
                this.setReminder();
                return;
            }

            s = sec;
            h = Math.floor(s / 3600);
            s -= h * 3600;
            min = Math.floor(s / 60);
            s -= min * 60;

            this.farmLink.innerHTML = '[' + (h < 10 ? '0' + h : h) + ':' +
                (min < 10 ? '0' + min : min) + ':' +
                (s < 10 ? '0' + s : s) + ']';

            sec -= 1;
            if (sec > -1) {
                var _this = this;
                general.root.setTimeout(function () {
                    _this.showTimer(sec);
                }, 1000);
            } else {
                general.root.setTimeout(this.setReminder,
                                new GetRandom().init(1000, 3000));
            }
        }; // 2}}}

        /**
         * @method runInit {{{2
         */
        this.runInit = function () {
            var _this = this;
            return function () {
                general.root.setTimeout(function () {
                    _this.init();
                }, 700);
            };
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            /** localStorage:
             * [0] - время полива/сбора
             * [1] - действие (Полить|Собрать)
             * [2] - время последнего проигрывания звука
             * [3] - звук проигран?
             */
            var stData = general.getData(9),
                timeNow = new Date().getTime();

            // на ферме запоминаем данные, выходим
            if (/\/ferma\.php/.test(general.loc)) {
                // не на своей ферме
                if (/id=\d+/.test(general.loc) &&
                        /id=(\d+)/.exec(general.loc)[1] !== general.myID) {
                    return;
                }

                var a = general.doc.querySelectorAll('*[onclick*="gotourl("],' +
                            '*[onclick*="openurl("],*[onclick*="plantit("]'),
                    l;

                for (l = 0; l < a.length; l++) {
                    a[l].addEventListener('click', this.runInit(), false);
                }

                var actionStr = /Ближайшее действие:.*(собрать|полить).*\(.*\)/.
                        exec(general.doc.querySelector('td[width="400"]' +
                                '[valign="top"]').innerHTML);

                if (!actionStr) {
                    stData[0] = '';
                    general.setData(stData, 9);
                    return;
                }

                var aStr = actionStr[0];
                var action = /собрать/.test(aStr) ? '2' : '1';

                if (/уже пора/.test(aStr)) {
                    general.setData([timeNow, action, timeNow, '1',
                        stData[4], stData[5]], 9);
                    return;
                }

                var timeLeft = +/через (\d+) мин/.exec(aStr)[1];
                general.setData([timeNow + timeLeft * 60 * 1000,
                    action, timeNow, '', stData[4], stData[5]], 9);

                return;
            }

            var topPanel = new GetTopPanel().init();
            if (topPanel && stData[0]) {
                this.farmLink = general.doc.createElement('a');
                this.farmLink.setAttribute('style', 'color: #0000FF; ' +
                        'text-decoration: none;');
                this.farmLink.href = 'https://' + general.domain +
                    '/ferma.php?id=' + general.myID;
                this.farmLink.setAttribute('target', '_blank');
                topPanel.appendChild(general.doc.createTextNode(' | '));
                topPanel.appendChild(this.farmLink);

                if (timeNow >= +stData[0]) {
                    this.setRedLink(stData[1]);
                    var _this = this;
                    general.root.setTimeout(function () {
                        _this.showTimer(0);
                    }, new GetRandom().init(1000, 3000));

                    return;
                }

                this.showTimer(+((+stData[0] - timeNow) / 1000).toFixed(0));
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class TimeNpc {{{1
     * @constructor
     */
    var TimeNpc = function () {
        /**
         * @property imgPath
         * @type {String}
         */
        this.imgPath = general.imgPath + 'TimeNpc/';
        /**
         * @property npc {{{2
         * @type {Object}
         */
        this.npc = {
            g: ['2', '3', '6', '8', '10', '12'],
            z: ['1', '4', '5', '7', '9', '11'],
            p: ['16', '17', '18', '19', '20']
        }; // 2}}}
        /**
         * @property tm
         * @type {int}
         */
        this.tm = 1000;

        /**
         * @method clearNPCData {{{2
         */
        this.clearNPCData = function () {
            general.$('dataNPC').innerHTML = '';
        }; // 2}}}

        /**
         * @method setCloseButton {{{2
         */
        this.setCloseButton = function () {
            general.$('dataNPC').innerHTML += '<tr><td colspan="3" ' +
                'style="text-align: right;"><img id="npsDataClose" ' +
                'style="cursor: pointer; padding-top: 5px;" src="' +
                general.imgPath + 'close.gif" title="Очистить данные NPC" ' +
                'alt="Очистить данные NPC" /></td></tr>';

            general.$('npsDataClose').
                addEventListener('click', this.clearNPCData, false);
            general.$('imgSoundNPC').removeAttribute('checkscan');
        }; // 2}}}

        /**
         * @method  scanNPC {{{2
         * @param   {int}       ind
         * @param   {Array}     npcs
         */
        this.scanNPC = function (ind, npcs) {
            if (!ind) {
                if (general.$('imgSoundNPC').getAttribute('checkscan')) {
                    return;
                }

                this.clearNPCData();
                general.$('imgSoundNPC').setAttribute('checkscan', 'yes');
            }

            var url = 'https://' + general.domain + '/npc.php?id=' + npcs[ind],
                _this = this,
                tr,
                td;

            tr = general.doc.createElement('tr');
            td = general.doc.createElement('td');
            td.setAttribute('style', 'text-align: center;');
            td.setAttribute('colspan', '3');
            td.innerHTML = '<img src="' + general.imgPath + 'preloader.gif" ' +
                'title="Загрузка..." alt="Загрузка..." />';
            tr.appendChild(td);
            general.$('dataNPC').appendChild(tr);

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;
                if (/Вы находитесь в пути/.test(spanContent.innerHTML)) {
                    general.$('dataNPC').lastElementChild.innerHTML = '<td ' +
                        'style="color: #990000;">Вы в пути. Данные NPC не ' +
                        'доступны.</td>';
                    _this.setCloseButton();
                    return;
                }

                var cssSelector1 = 'td[class="wb"][colspan="3"]' +
                        '[bgcolor="#f0fff0"]',
                    cssSelector2 = 'a[href*="/syndicate.php?id="]',
                    cssSelector3 = 'td[class="wb"][align="left" ]' +
                        '[width="100%"]>b',
                    syndLink = spanContent.querySelector(cssSelector1).
                                querySelector(cssSelector2),
                    nameNPC = spanContent.querySelector(cssSelector3).innerHTML;

                general.$('dataNPC').lastElementChild.innerHTML = '<td>' +
                    '<a target="_blank" href="' + syndLink.href +
                    '"><img src="https://images.' +
                    general.domain.replace('www.', '') + '/img/synds/' +
                    /\?id=(\d+)/.exec(syndLink.href)[1] + '.gif" ' +
                    'alt="img" />' +
                    '</a></td><td><a target="_blank" href="' + url +
                    '" style="font-size: 8pt;">' + nameNPC + '</a></td>' +
                    '<td style="font-size: 8pt;">' +
                    syndLink.nextSibling.nodeValue.replace(/^\s*/, '') +
                    '</td>';

                ind++;
                if (npcs[ind]) {
                    general.root.setTimeout(function () {
                        _this.scanNPC(ind, npcs);
                    }, _this.tm);
                    return;
                }

                _this.setCloseButton();
            }, function () {
                general.root.setTimeout(function () {
                    if (!ind) {
                        general.$('imgSoundNPC').removeAttribute('checkscan');
                    }
                    _this.scanNPC(ind, npcs);
                }, _this.tm);
            });
        }; // 2}}}

        /**
         * @method getTimeNow {{{2
         * @return  {int}
         */
        this.getTimeNow = function () {
            return new Date().getTime();
        }; // 2}}}

        /**
         * @method goQuest {{{2
         */
        this.goQuest = function () {
            var stData = general.getData(10);
            general.$('timerNPC').innerHTML = '<a href="/npc.php?id=' +
                stData[1] + '" style="color: #1C9C03; font-weight: bold;">' +
                'Взять квест</a>';

            if (stData[0]) {
                new PlaySound().init(stData[3]);
            }
        }; // 2}}}

        /**
         * @method showTimerNPC {{{2
         * @param   {int}   sec
         */
        this.showTimerNPC = function (sec) {
            var timer = general.$('spanTimer');
            // при переходе на личного NPC таймера не будет
            if (timer) {
                var s = sec,
                    h = Math.floor(s / 3600);

                s -= h * 3600;
                var min = Math.floor(s / 60);
                s -= min * 60;

                h = h < 10 ? '0' + h : h;
                min = min < 10 ? '0' + min : min;
                s = s < 10 ? '0' + s : s;
                timer.innerHTML = h + ':' + min + ':' + s;

                sec -= 1;
                var _this = this;
                if (sec > -1) {
                    general.root.setTimeout(function () {
                        _this.showTimerNPC(sec);
                    }, 1000);
                } else {
                    this.goQuest();
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // на главной странице личного NPC
            if (/\?nid=\d+/.test(general.loc)) {
                return;
            }

            var stData = general.getData(10);

            if (/gwars.*\/me(\/|\.php)/.test(general.loc)) {
                var mainDiv = general.doc.createElement('div'),
                    target = general.doc.querySelector('td[rowspan="3"]' +
                        '[valign="top"][bgcolor="#e9ffe9"]>' +
                        'div[style="padding-left:5px"]>' +
                        'a[href$="/home.friends.php"]').previousElementSibling,
                    onoff = stData[0] ? 'On' : 'Off';

                mainDiv.setAttribute('style', 'font-size: 8pt; ' +
                        'padding-left: 16px;');
                target.parentNode.insertBefore(mainDiv, target);
                mainDiv.innerHTML = '<span id="buttonNPC_Z" style="cursor: ' +
                    'pointer;">[Z]</span><span id="buttonNPC_G" style="' +
                    'cursor: pointer;">[G]</span><span id="buttonNPC_P" ' +
                    'style="cursor: pointer;">[P]</span> <img ' +
                    'id="imgSoundNPC" src="' + this.imgPath + 'sound' + onoff +
                    '.png" style="cursor: pointer; vertical-align: middle;" ' +
                    'title="Sound  ' + onoff + '" alt="Sound ' + onoff +
                    '"  /><span id="timerNPC" style="margin-left: 5px;">' +
                    '</span><table id="dataNPC" style="width: 100%;"></table>';

                var _this = this;
                general.$('imgSoundNPC').addEventListener('click', function () {
                    var data = general.getData(10),
                        d = data[0],
                        s = d ? 'Sound Off' : 'Sound On',
                        img = this;

                    img.src = _this.imgPath +
                            (d ? 'soundOff.png' : 'soundOn.png');
                    img.setAttribute('title', s);
                    img.setAttribute('alt', s);
                    data[0] = d ? '' : '1';
                    general.setData(data, 10);
                }, false);

                general.$('buttonNPC_Z').addEventListener('click', function () {
                    _this.scanNPC(0, _this.npc.z);
                }, false);
                general.$('buttonNPC_G').addEventListener('click', function () {
                    _this.scanNPC(0, _this.npc.g);
                }, false);
                general.$('buttonNPC_P').addEventListener('click', function () {
                    _this.scanNPC(0, _this.npc.p);
                }, false);

                if (!stData[2]) {   // время не установлено
                    general.$('timerNPC').innerHTML = '<a href="' +
                        (!stData[1] ? '#' : '/npc.php?id=' + stData[1]) +
                        '" style="color: #8C7B02; font-size: 8pt;">' +
                        'Поговорите с NPC</a>';
                } else {
                    if (this.getTimeNow() >= stData[2]) {   // пора делать квест
                        this.goQuest();
                    } else {    // ждем
                        general.$('timerNPC').innerHTML = '<a href="' +
                            '/npc.php?id=' + stData[1] + '" style="color: ' +
                            'red; font-size: 8pt;">NPC</a>: ' +
                            '[<span id="spanTimer"></span>]';
                        var sec = Math.
                                ceil((+stData[2] - this.getTimeNow()) / 1000);
                        this.showTimerNPC(sec);
                    }
                }

                return;
            }

            var talkNPC = general.doc.
                    querySelector('td[class="wb"][valign="top"]'),
                talk = /\?id=(\d+)&talk=1/.exec(general.loc);

            // если id у NPC больше 20, то это не наш NPC
            if (talkNPC && talk && +talk[1] < 21) {

                stData[1] = talk[1];
                // говорим с NPC, но время квеста еще не пришло
                var timer = /\[подождите (\d+) мин/.exec(talkNPC.innerHTML);
                if (timer) {
                    stData[2] = +timer[1] * 60 * 1000 + this.getTimeNow();
                    general.setData(stData, 10);
                    return;
                }

                // если берем или отказываемся от квеста,
                // то стираем время из хранилища
                if (/Ваш ответ:/.test(talkNPC.innerHTML)) {
                    stData[2] = '';
                    general.setData(stData, 10);
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class AllPlantsOnFarm {{{1
     * @constructor
     */
    var AllPlantsOnFarm = function () {
        /**
         * @property target
         * @type {Object|null}
         */
        this.target = null;
        /**
         * @property plant {{{2
         * @type {Object}
         */
        this.plant = {
            'ukrop': {name: 'Укроп', price: 5, time: 12, bonus: 6, exp: 0.007},
            'opyata': {name: 'Странные опята', price: 10, time: 376, bonus: 40,
                exp: 0.204},
            'tulips': {name: 'Тюльпаны', price: 20, time: 67, bonus: 26,
                exp: 0.04},
            'mak': {name: 'Полевой мак', price: 12, time: 27, bonus: 15,
                exp: 0.02},
            'muhomor': {name: 'Мухомор', price: 150, time: 150, bonus: 165,
                exp: 0.098},
            'podsolnuh': {name: 'Подсолнух', price: 50, time: 126, bonus: 62,
                exp: 0.082},
            'kaktus': {name: 'Коричневый кактус', price: 160, time: 376,
                bonus: 197, exp: 0.245},
            'geran': {name: 'Герань', price: 10, time: 57, bonus: 17,
                exp: 0.048},
            'tabak': {name: 'Веселый табак', price: 20, time: 150, bonus: 37,
                exp: 0.114},
            'korica': {name: 'Корица забористая', price: 16, time: 68,
                bonus: 25, exp: 0.057},
            'hren': {name: 'Хрен', price: 210, time: 300, bonus: 244,
                exp: 0.229},
            'baklajan': {name: 'Баклажан', price: 150, time: 226, bonus: 176,
                exp: 0.171},
            'chai': {name: 'Зеленый чай', price: 50, time: 90, bonus: 63,
                exp: 0.087},
            'aloe': {name: 'Алоэ', price: 120, time: 45, bonus: 127,
                exp: 0.044},
            'ogurets': {name: 'Огурцы', price: 350, time: 68, bonus: 360,
                exp: 0.065},
            'klubnika': {name: 'Клубника', price: 100, time: 450, bonus: 159,
                exp: 0.392},
            'malina': {name: 'Малина', price: 190, time: 90, bonus: 203,
                exp: 0.087},
            'shalfei': {name: 'Задумчивый шалфей&nbsp;', price: 800, time: 715,
                bonus: 885, exp: 0.566},
            'mint': {name: 'Мята', price: 50, time: 34, bonus: 56, exp: 0.037},
            'kokos': {name: 'Кокосовая пальма', price: 200, time: 176,
                bonus: 226, exp: 0.171},
            'vinograd': {name: 'Виноград', price: 140, time: 90, bonus: 155,
                exp: 0.098},
            'tabak2': {name: 'Жевательный табак', price: 170, time: 29,
                bonus: 175, exp: 0.031},
            'whitemush': {name: 'Белые грибы', price: 120, time: 126,
                bonus: 138, exp: 0.122},
            'kapusta': {name: 'Капуста', price: 150, time: 79, bonus: 164,
                exp: 0.095},
            'kust': {name: 'Хвойный куст', price: 600, time: 350, bonus: 657,
                exp: 0.381},
            'kabachok': {name: 'Кабачок', price: 140, time: 95, bonus: 155,
                exp: 0.102},
            'kukuruza': {name: 'Кукуруза', price: 170, time: 68, bonus: 182,
                exp: 0.082},
            'jahntak': {name: 'Джантак', price: 130, time: 164, bonus: 157,
                exp: 0.177},
            'kaktusi': {name: 'Кактусы пушистые ', price: 1100, time: 634,
                bonus: 1194, exp: 0.626},
            'perets': {name: 'Красный перец', price: 180, time: 51, bonus: 191,
                exp: 0.073},
            'petrushka': {name: 'Петрушка курчавая ', price: 145, time: 29,
                bonus: 151, exp: 0.041},
            'tomat': {name: 'Говорящий томат', price: 500, time: 276,
                bonus: 554, exp: 0.359},
            'arbuz': {name: 'Арбуз', price: 100, time: 45, bonus: 111,
                exp: 0.071},
            'hmel': {name: 'Душистый хмель', price: 130, time: 23, bonus: 135,
                exp: 0.035},
            'bambuk': {name: 'Ростки Бамбука', price: 10, time: 17, bonus: 14,
                exp: 0.029},
            'tikva': {name: 'Тыква', price: 200, time: 57, bonus: 214,
                exp: 0.095},
            'shishki': {name: 'Еловые шишки', price: 250, time: 45, bonus: 262,
                exp: 0.082},
            'dinya': {name: 'Дыня', price: 120, time: 88, bonus: 141,
                exp: 0.143},
            'podsolnuh2': {name: 'Подсолнух-мутант', price: 200, time: 50,
                bonus: 213, exp: 0.087},
            'poganka': {name: 'Бледная поганка', price: 1500, time: 338,
                bonus: 1604, exp: 0.694}
        }; // 2}}}

        /**
         * @method getHourTime {{{2
         * @param   {int}       min
         * @param   {Boolean}   mode
         * @return  {String}
         */
        this.getHourTime = function (min, mode) {
            if (min < 60) {
                return '';
            }

            var h = Math.floor(min / 60),
                m = min - h * 60;

            m = m < 10 ? '0' + m : m;
            return mode ? '(' + h + ' ч ' + m + ' мин)' :
                            '[' + h + ':' + m + ']';
        }; // 2}}}

        /**
         * @method calculatePerHour {{{2
         * @param   {int}   val1
         * @param   {int}   val2
         * @param   {int}   fix
         * @return  {String}
         */
        this.calculatePerHour = function (val1, val2, fix) {
            return (60 * val2 / val1).toFixed(fix);
        }; // 2}}}

        /**
         * @method setPlantData {{{2
         */
        this.setPlantData = function () {
            var cont = general.$('checkBoxContainer'),
                val = general.$('selPlant').value,
                id = 'btn_' + val,
                pl = this.plant[val],
                str = '';

            cont.innerHTML = '';
            // noinspection JSUnresolvedVariable
            if (val !== '0') {
                var i;
                for (i = 3; i < 7; i++) {
                    str += '<img src="https://images.' +
                        general.domain.replace('www.', '') +
                        '/img/ferma_hd/' + val + i + '.png" ' +
                        'style="width: 50px; height: 50px;" alt="img" />';
                }

                str += '<br><label for="' + id + '">' +
                    '<b style="color: #006600;">' + pl.name + ', ' + pl.price +
                    '$</b></label><br><li>Время созревания: ' +
                    '<b style="color: #990000;">' + pl.time + ' мин</b> ' +
                    this.getHourTime(pl.time, true) + '<li>Премия за урожай: ' +
                    '<b style="color: #990000;">' + pl.bonus + '$</b> ' +
                    '(<span style="color: #0000FF;">' +
                    this.calculatePerHour(pl.time, pl.bonus - pl.price, 2) +
                    '$</span> в час)<li>Производственный опыт: ' +
                    '<b style="color: #990000;">' + pl.exp + '</b> (' +
                    '<span style="color: #0000FF;">' +
                    this.calculatePerHour(pl.time, pl.exp, 3) +
                    '</span> в час)';

                cont.innerHTML = str;
            }
        }; // 2}}}

        /**
         * @method createSelectList {{{2
         * @return  {HTMLElement}
         */
        this.createSelectList = function () {
            var sel = general.doc.createElement('select'),
                str = '',
                val;

            for (val in this.plant) {
                if (this.plant.hasOwnProperty(val)) {
                    str += '<option value="' + val + '">' +
                        this.plant[val].name + '</option>';
                }
            }

            sel.id = 'selPlant';
            sel.innerHTML = '<option value="0"> </option>' + str;
            var _this = this;
            sel.addEventListener('change', function () {
                _this.setPlantData();
            }, false);

            return sel;
        }; // 2}}}

        /**
         * @method setMainPanel {{{2
         */
        this.setMainPanel = function () {
            // основной контейнер
            var div = this.target.querySelector('#allPlantContainer');
            if (!div) {
                div = general.doc.createElement('div');
                div.id = 'allPlantContainer';
                div.setAttribute('style', 'margin-top: 7px');
                if (this.target.nodeName === 'FORM') {
                    this.target.parentNode.lastElementChild.
                            firstElementChild.appendChild(div);
                } else {
                    this.target.appendChild(div);
                }
            }

            div.appendChild(this.createSelectList());

            var chkContainer = general.doc.createElement('div');
            chkContainer.setAttribute('align', 'left');
            chkContainer.id = 'checkBoxContainer';
            div.appendChild(chkContainer);
        }; // 2}}}

        /**
         * @method clearCounter {{{2
         * @param   {String}    gb
         * @param   {String}    exp
         */
        this.clearCounter = function (gb, exp) {
            var stData = general.getData(11);

            stData[1] = new Date().getTime();
            stData[2] = gb;
            stData[3] = exp;
            general.setData(stData, 11);
        }; // 2}}}

        /**
         * @method setCounter {{{2
         */
        this.setCounter = function () {
            var table = general.doc.querySelector('table[cellpadding="3"]' +
                    '[cellspacing="0"][border="0"][align="center"]'),
                prod = /получен опыт (\d+(\.\d+)?) ед/.exec(table.innerHTML);

            // опыт виден (на пустой вскопанной клетке)
            if (prod) {
                var target = table.querySelector('a[name="pf"]').parentNode,
                    gb = target.querySelectorAll('b'),
                    exp = prod[1],
                    stData = general.getData(11);

                // количесво Гб на ферме с учетом схрона
                // Счет: $85 + урожай на $6.6 в схроне, 1 шт.
                // noinspection RegExpSingleCharAlternation
                gb = +gb[0].innerHTML.replace(/\$|,/g, '') + (gb[1] ?
                        Math.round(parseFloat(gb[1].innerHTML.
                            replace(/\$|,/g, ''))) : 0);

                // время сброса не установлено
                if (!stData[1]) {
                    this.clearCounter(gb.toString(), exp);
                }

                // установка счетчиков
                var t = new Date(+stData[1]),
                    day = t.getDate(),
                    time = day < 10 ? '0' + day : day;

                time += '.';
                var month = t.getMonth() + 1;
                time += month < 10 ? '0' + month : month;
                time += '.';
                var year = /20(\d+)/.exec(t.getFullYear().toString())[1];
                time += year + ' ';
                var hours = t.getHours();
                time += hours < 10 ? '0' + hours : hours;
                time += ':';
                var min = t.getMinutes();
                time += min < 10 ? '0' + min : min;

                // noinspection JSRemoveUnnecessaryParentheses
                var setPoint = new SetPoints().init,
                    diffGb = gb - (+stData[2]),
                    diffExp = (+exp - (+stData[3])).toFixed(3).split('.');

                var str = '';
                if (stData[4]) {
                    str += '<span style="color: #' +
                        (diffGb < 0 ? '0000FF' : 'FF0000') + ';">' +
                        setPoint(diffGb, '\'', true) + '$</span>';
                }

                if (stData[5]) {
                    str += '<span' +
                        (str ? ' style="margin-left: 5px;"' : '') + '>' +
                        setPoint(diffExp[0], '\'', false) +
                        (diffExp[1] ? ',' + diffExp[1] : '') + '</span>';

                }

                str += '<span style="font-size: 7pt; margin-left: 5px;">' +
                            '<span id="clearFarmCounter" ' +
                                'style="cursor: pointer; color: #008000; ' +
                                'text-decoration: underline;">Сброс</span> ' +
                            '<span style="color: #0000FF;">(' + time + ')' +
                            '</span>' +
                        '</span>';

                var spanCounters = general.doc.createElement('span');
                spanCounters.setAttribute('style', 'font-size: 8pt; ' +
                    'margin-right: 5px;');
                spanCounters.innerHTML = str;
                target.insertBefore(spanCounters, target.firstElementChild);

                // кнопа сброса счетчиков
                var _this = this;
                general.$('clearFarmCounter').
                    addEventListener('click', function () {
                        if (confirm('Сбросить счетчики ?')) {
                            _this.clearCounter(gb.toString(), exp);
                            target.removeChild(spanCounters);
                            _this.setCounter();
                        }
                    }, false);
            }
        }; // 2}}}

        /**
         * @method runInit {{{2
         */
        this.runInit = function () {
            var _this = this;
            return function () {
                general.root.setTimeout(function () {
                    _this.init();
                }, 700);
            };
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // noinspection RegExpSingleCharAlternation
            var farmId = /(\?|&)id=(\d+)/.exec(general.loc),
                capcha = general.doc.querySelector('input[type="hidden"]' +
                    '[name="captcha_question"]');

            this.target = general.doc.querySelector('td[width="400"]' +
                    '[valign="top"]');

            // нет капчи, на своей ферме
            if (!capcha && !(farmId && farmId[2] !== general.myID) &&
                    this.target) {

                var canPlant = general.doc.
                        querySelector('input[type="button"][value="Посадить"]');

                // счетчики Гб и производа
                var stData = general.getData(11);
                if (canPlant && (stData[4] || stData[5])) {
                    this.setCounter();
                }

                // перевод дохрена минут в чч:мм
                if (!canPlant) {
                    var tbl = general.doc.querySelector('table[width="100%"]' +
                            '[cellpadding="4"][cellspacing="2"][border="0"]');

                    if (tbl) {
                        var tds = tbl.querySelectorAll('td'),
                            span,
                            min,
                            i;

                        for (i = 1; i < tds.length; i++) {
                            min = /(через|осталось) (\d+) мин/.
                                exec(tds[i].innerHTML);

                            min = min && +min[2] > 59 ? +min[2] : null;
                            if (min) {
                                span = general.doc.createElement('span');
                                span.setAttribute('style', 'color: #0000FF; ' +
                                        'font-size: 7pt; margin-left: 2px;');
                                span.innerHTML = this.getHourTime(min, false);
                                tds[i].appendChild(span);
                            }
                        }
                    }

                    this.setMainPanel();
                }

                var a = general.doc.querySelectorAll('*[onclick*="gotourl("],' +
                            '*[onclick*="openurl("],*[onclick*="plantit("]'),
                    l;

                for (l = 0; l < a.length; l++) {
                    a[l].addEventListener('click', this.runInit(), false);
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class GwMenu {{{1
     * @constructor
     */
    var GwMenu = function () {
        /**
         * @property imgPath
         * @type {String}
         */
        this.imgPath = general.imgPath + 'GwMenu/';
        /**
         * @property correctXGwMenu
         * @type {int}
         */
        this.correctXGwMenu = /Opera/i.
                test(general.root.navigator.userAgent) ?  -1 : 0;
        /**
         * @property correctYGwMenu
         * @type {int}
         */
        this.correctYGwMenu = /Firefox/i.
                test(general.root.navigator.userAgent) ? -1 : 0;

        /**
         * @method setCSSGwMenu {{{2
         */
        this.setCSSGwMenu = function () {
            var cssStyle = general.doc.createElement('style');
            cssStyle.innerHTML = '#c1 {color: #F90332;}' +
                '#c2 {color: #014305; font-weight: bold;}' +
                '#c3 {color: #04830C; font-style: italic;}' +
                '#op {font-size: 7pt; opacity: 0.5;}' +
                '.gwm {position: absolute; cursor: default; z-index: 999;}' +
                '.gwm table {border-collapse: collapse; background-color: ' +
                    '#DBF5E0; min-width: 100px; ' +
                    // тень для таблиц
                    // сдвиг по горизонтали, вертикали, радиус размытия, цвет
                    'box-shadow: 5px 6px 6px rgba(122,122,122,0.5);}' +
                '.gwm table.main {background-image: url(' + this.imgPath +
                        'background.gif' + '); width: 210px;}' +
                '.gwm tr {height: 15px;}' +
                '.gwm td {border: 1px #339933 solid; ' +
                    'padding: 0px 5px 0px 5px; white-space: nowrap;}' +
                '.gwm td.center {text-align: center;}' +
                '.gwm td.zag {text-align: center; background: #C4F8D1; ' +
                    'font-weight: bold; font-size: 11px;}' +
                '.gwm td.arrow {width: 20px; min-width: 20px; ' +
                    'text-align: center; background: #C4F8D1;}' +
                '.gwm td.bold {font-size: 8pt; font-weight: bold;}' +
                '.gwm td.bold span.norm {color: #087105;}' +
                '.gwm td.bold span.darkgray {color: #303030;}' +
                '.gwm td.bold span.crimson {color: #990000;}' +
                '.gwm td.bold span.brown {color: #935805;}' +
                '.gwm td.bold span.blue {color: #0000FF;}' +
                '.gwm td.bold span.bluegray {color: #008080;}' +
                '.gwm td.bold span.darkorange {color: #A44B00;}' +
                '.gwm a {text-decoration: none; color: #0000FF; ' +
                    'font-size: 8pt;}';

            general.doc.querySelector('head').appendChild(cssStyle);
        }; // 2}}}

        /**
         * @method createGwMenuDiv {{{2
         * @param   {String}    id
         * @return  {Object}
         */
        this.createGwMenuDiv = function (id) {
            var div = general.doc.createElement('div');

            if (id) {
                div.setAttribute('id', id);
                if (id === 'gw_menu') {
                    div.style.top = '83';
                    div.style.left = '0';
                    general.doc.body.appendChild(div);
                }
            }

            div.setAttribute('class', 'gwm');
            div.style.display = 'none';
            return div;
        }; // 2}}}

        /**
         * @method getLineMenu {{{2
         * @param   {String}    name
         * @param   {String}    id
         * @param   {String}    color
         * @param   {String}    colspn
         * @return  {String}
         */
        this.getLineMenu = function (name, id, color, colspn) {
            var link = /\//.test(id),
                _colspn,
                _color,
                blank;

            if (id === 'gw_menu') {
                return name;
            }

            // ссылка
            if (link) {
                blank = /https?:/.test(id) ? ' target="_blank"' : '';
                _color = color ? ' style="color: ' + color + '"' : '';
                _colspn = colspn ? ' colspan="2"' : '';
                return '<td' + _colspn + '><a' + blank + _color + ' href="' +
                    id + '">' + name + '</a></td>';
            }

            // пункты меню
            if (color === 'zag') {
                _colspn = colspn ? ' colspan="2"' : '';
                return '<td class="zag"' + _colspn + '>' + name + '</td>';
            }

            _color = color || 'norm';
            return '<td class="bold"><span class="' + _color + '">' + name +
                '</span></td><td class="arrow" id="' + id + '">&#187;</td>';
        }; // 2}}}

        /**
         * @method fOver {{{2
         * @param   {Object}    div
         * @param   {Object}    arrow
         * @param   {int}       offsettop
         */
        this.fOver = function (div, arrow, offsettop) {
            var tm = arrow.getAttribute('tm'),
                _offsettop = offsettop || 0;

            if (tm) {
                general.root.clearTimeout(+tm);
                arrow.removeAttribute('tm');
            }

            div.style.left = String(arrow.parentNode.offsetWidth +
                this.correctXGwMenu);
            div.style.top = String(arrow.offsetTop + _offsettop +
                this.correctYGwMenu);
            arrow.style.background = '#7FF89E';
            div.style.display = '';
        }; // 2}}}

        /**
         * @method fOut {{{2
         * @param   {Object}    div
         * @param   {Object}    arrow
         */
        this.fOut = function (div, arrow) {
            arrow.setAttribute('tm', general.root.setTimeout(function () {
                div.style.display = 'none';
                arrow.style.background = '#C4F8D1';
                arrow.removeAttribute('tm');
            }, 100).toString());
        }; // 2}}}

        /**
         * @method setHandlersGWMenu {{{2
         * @param   {Object}    arrow
         * @param   {Object}    div
         * @param   {int}       offset
         */
        this.setHandlersGWMenu = function (arrow, div, offset) {
            var _this = this;

            arrow.addEventListener('mouseover', function () {
                arrow.style.boxShadow = '1px 1px 1px inset';
                _this.fOver(div, arrow, offset);
            }, false);

            arrow.addEventListener('mouseout', function () {
                arrow.style.boxShadow = '';
                _this.fOut(div, arrow);
            }, false);

            div.addEventListener('mouseover', function () {
                arrow.style.boxShadow = '1px 1px 1px inset';
                _this.fOver(div, arrow, offset);
            }, false);

            div.addEventListener('mouseout', function () {
                arrow.style.boxShadow = '';
                _this.fOut(div, arrow);
            }, false);
        }; // 2}}}

        /**
         * @method createGWMenuItems {{{2
         * @param   {Array}    gwM
         */
        this.createGWMenuItems = function (gwM) {
            var item,
                main,
                tr,
                i,
                j;

            for (i = 0; i < gwM.length; i++) {
                gwM[i].divm = this.createGwMenuDiv(gwM[i].divm);
                gwM[i].divm.appendChild(general.doc.createElement('table'));

                main = gwM[i].divm.id === 'gw_menu';
                if (main) {
                    gwM[i].divm.firstElementChild.setAttribute('class', 'main');
                }

                for (j = 0; j < gwM[i].lines.length; j++) {
                    item = gwM[i].lines[j];
                    tr = general.doc.createElement('tr');
                    tr.innerHTML = this.
                        getLineMenu(item[0], item[1], item[2], item[3]);
                    gwM[i].divm.firstElementChild.appendChild(tr);
                }

                if (!main) {
                    general.$(gwM[i].prnt).appendChild(gwM[i].divm);
                    this.setHandlersGWMenu(general.$(gwM[i].arrow), gwM[i].divm,
                            gwM[i].offsetY);
                }
            }
        }; // 2}}}

        /**
         * @method gwMenuInit {{{2
         */
        this.gwMenuInit = function () {
            var gw_menu = general.$('gw_menu'),
                gwM;

            if (gw_menu) {
                gw_menu.style.display = gw_menu.style.display === '' ?
                        'none' : '';
                return;
            }

            this.setCSSGwMenu();

            gwM = [
                {divm: 'gw_menu', lines: [
                    // шапка
                    ['<td class="center"><a target="_blank" id="op" ' +
                        'href="/info.php?id=2095458"><span id="c1">' +
                        'developed by</span> <span id="c2">MyRequiem&#169;' +
                        '</span><br><span id="c3">for GWars fighters' +
                        '</span></a></td><td class="center" id="exit" ' +
                        'style="cursor: pointer;"><img src="' + this.imgPath +
                        'hide.gif" alt="Закрыть" title="Закрыть"></td>',
                        'gw_menu'],
                    // основные разделы
                    ['Ресурсы', 'resourses', 'brown'],
                    ['Бои', 'battles', 'crimson'],
                    ['ЭС, Уран', 'real_estate'],
                    ['Скрипты', 'scripts', 'darkorange'],
                    ['Синдикаты', 'syndicates'],
                    ['Острова', 'islands'],
                    ['NPC', 'npc'],
                    ['Доска объявлений', 'doska', 'bluegray'],
                    ['Почта', 'post', 'blue'],
                    ['Форумы', 'forums'],
                    ['Магазины', 'shop', 'brown'],
                    ['Покупка гранат', 'pay_grenades', 'brown'],
                    ['Покупка лута', 'pay_lut', 'brown'],
                    ['Переодевалка', 'changeclothing'],
                    ['Настройки', 'settings', 'darkgray'],
                    // ссылки
                    ['Мои фото', 'https://www.ganjafoto.io/albums.php?id=' +
                        general.myID, 0, 1],
                    ['Мои файлы', 'http://www.ganjafile.io/login.php', 0, 1],
                    ['Мои Друзья', '/home.friends.php', 0, 1],
                    ['Мои синдикаты', '/syndicates.php', 0, 1],
                    ['Мои достижения', '/info.ach.php?id=' +
                        general.myID, 0, 1],
                    ['Мои квесты', '/questlog.php?id=' + general.myID, 0, 1],
                    ['Mои навыки', '/home.skills.php?page=perks', 0, 1],
                    ['Протокол передач', '/usertransfers.php?id=' +
                        general.myID, 0, 1],
                    ['Протокол боев', '/info.warstats.php?id=' +
                        general.myID, 0, 1],
                    ['Моя карма', '/info.vote.php?id=' + general.myID, 0, 1],
                    ['Ферма', '/ferma.php?id=' + general.myID, 0, 1],
                    ['Суперсеты', '/sets.php', 0, 1],
                    ['GanjaWiki.ru: Энциклопедия игры',
                        'http://www.ganjawiki.ru/', 0, 1],
                    ['Выход из игры', '/logoff.php', 'red', 1],
                    ['<td colspan="2"><input type="checkbox" id="showt" ' +
                        'title="Показывать всегда" />', 'gw_menu']
                ]},
                {divm: 0, lines: [
                    ['Все ресурсы', '/stats.php', '#935805'],
                    ['Батареи', '/statlist.php?r=battery'],
                    ['Водоросли', '/statlist.php?r=seaweed'],
                    ['Нефть', '/statlist.php?r=oil'],
                    ['Уран', '/statlist.php?r=uran'],
                    ['Ганджиум', '/statlist.php?r=ganjium'],
                    ['Маковая соломка', '/statlist.php?r=solomka'],
                    ['Трава', '/statlist.php?r=weed'],
                    ['Бокситы', '/statlist.php?r=bauxite'],
                    ['Алюминий', '/statlist.php?r=aluminium']
                ], prnt: 'gw_menu', arrow: 'resourses', offsetY: -15},
                {divm: 'battles_1', lines: [
                    ['Одиночные', 'battles_1_single'],
                    ['Групповые', 'battles_1_group'],
                    ['Идущие бои', '/war.php', 0, 1]
                ], prnt: 'gw_menu', arrow: 'battles', offsetY: -15},
                {divm: 0, lines: [
                    ['Общие', '/warlist.php?war=armed'],
                    ['Стрельба из спецоружия', '/warlist.php?war=rogatki'],
                    ['Дуэли', '/warlist.php?war=duels']
                ], prnt: 'battles_1', arrow: 'battles_1_single'},
                {divm: 0, lines: [
                    ['Общие', '/wargroup.php?war=armed'],
                    ['Уличные', '/wargroup.php?war=street'],
                    ['Дуэли на спецоружии', '/wargroup.php?war=duels'],
                    ['Нападения', '/wargroup.php?war=attacks']
                ], prnt: 'battles_1', arrow: 'battles_1_group', offsetY: -15},
                {divm: 0, lines: [
                    ['ГосЭнергоАтом', '/info.realty.php?id=2'],
                    ['Статистика GWars.io от vasena',
                        'http://gw-utils.ru/'],
                    ['GWTools от Bas', 'https://www.gwtools.ru/']
                ], prnt: 'gw_menu', arrow: 'real_estate'},
                {divm: 0, lines: [
                    ['Синдикат "Скрипты для GW"', '/syndicate.php?id=3579'],
                    ['Скрипты на ganjascript.ucoz.com',
                        'http://ganjascript.ucoz.com/'],
                    ['Скрипты на gwscripts.ucoz.net',
                        'http://gwscripts.ucoz.net/'],
                    ['ComfortablePlayingInGW',
                        'https://github.com/MyRequiem/comfortablePlayingInGW'],
                    ['Скрипты на born2kill.clan.su',
                        'http://born2kill.clan.su/load/9'],
                    ['Скрипты от W_or_M',
                        'https://www.ganjafoto.io/image.php?aid=435039'],
                    ['Скрипты от Bick',
                        'https://www.ganjafoto.io/image.php?aid=331880'],
                    ['Скрипты от Jimmy Banditto',
                        'https://www.ganjafoto.io/image.php?aid=334909'],
                    ['Скрипты от VSOP_juDGe',
                        'https://www.ganjafoto.io/image.php?aid=260018'],
                    ['Скрипты от z0man',
                        'https://www.ganjafoto.io/image.php?aid=285332'],
                    ['Скрипты от гном убийца',
                        'https://www.ganjafoto.io/image.php?aid=256649']
                ], prnt: 'gw_menu', arrow: 'scripts', offsetY: -45},
                {divm: 'syndicates_1', lines: [
                    ['Официальные синдикаты', 'offic_synd'],
                    ['Рейтинг синдикатов', '/srating.php', 0, 1],
                    ['Поиск синдиката',
                        'http://www.cccp-gw.su/listsynd/listsynd_search.php',
                        0, 1]
                ], prnt: 'gw_menu', arrow: 'syndicates', offsetY: -15},
                {divm: 'offic_synd_1', lines: [
                    ['Администраторы игры', '/syndicate.php?id=3'],
                    ['GW - Редакторы описания игры', '/syndicate.php?id=1323'],
                    ['GW - Помощники администраторов',
                        '/syndicate.php?id=2076'],
                    ['GW - Почетный легион', '/syndicate.php?id=1320'],
                    ['GW - Технические персонажи', '/syndicate.php?id=445'],
                    ['GW - Bugtesters', '/syndicate.php?id=1949'],
                    ['GW - Суд', '/syndicate.php?id=1318'],
                    ['GW - Суд по взломам', '/syndicate.php?id=4409'],
                    ['GW - Суд // Common', '/syndicate.php?id=1953'],
                    ['GW - Суд - Ветераны', '/syndicate.php?id=1914'],
                    ['GW - Мировой Суд', '/syndicate.php?id=3060'],
                    ['GW - Судебные приставы', '/syndicate.php?id=1920'],
                    ['GW - Следователи', '/syndicate.php?id=2309'],
                    ['GW - Коллегия адвокатов', '/syndicate.php?id=1948'],
                    ['GW - Полиция', '/syndicate.php?id=1321'],
                    ['GW - Загс', '/syndicate.php?id=1354'],
                    ['GW - 911', '/syndicate.php?id=911'],
                    ['GW - GanjaWiki', '/syndicate.php?id=6949'],
                    ['GW - Модераторы GanjaFoto.io', '/syndicate.php?id=3516'],
                    ['GW - Модераторы рейтинга сайтов',
                        '/syndicate.php?id=3516'],
                    ['GW - Модераторы чата', '/syndicate.php?id=274'],
                    ['GW - Модераторы форума', '/syndicate.php?id=1262'],
                    ['GW - Модераторы торговых форумов',
                        '/syndicate.php?id=3405'],
                    ['ЗАО "Букмекерская контора №1"', '/syndicate.php?id=909'],
                    ['GW - Маркетинговая служба игры', '/syndicate.php?id=2324']
                ], prnt: 'syndicates_1', arrow: 'offic_synd', offsetY: -45},
                {divm: 0, lines: [
                    ['Z', '/map.php?sx=150&sy=150'],
                    ['G', '/map.php?sx=50&sy=50'],
                    ['P', '/map.php?sx=123&sy=77'],
                    ['S', '/map.php?sx=100&sy=100'],
                    ['Аут', 'http://born2kill.clan.su/index/0-55']
                ], prnt: 'gw_menu', arrow: 'islands', offsetY: -15},
                {divm: 'npc_1', lines: [
                    ['Z', 'npcz'],
                    ['G', 'npcg'],
                    ['P', 'npcp'],
                    ['NPC-синдикаты', 'npcsynd']
                ], prnt: 'gw_menu', arrow: 'npc', offsetY: -15},
                {divm: 0, lines: [
                    ['Smokie Canablez', '/npc.php?id=1'],
                    ['Kenny Buzz', '/npc.php?id=4'],
                    ['Yoshinori Watanabe', '/npc.php?id=5'],
                    ['Rony James', '/npc.php?id=7'],
                    ['Tommy Morales', '/npc.php?id=9'],
                    ['Tony Brandino', '/npc.php?id=11']
                ], prnt: 'npc_1', arrow: 'npcz', offsetY: -15},
                {divm: 0, lines: [
                    ['Hempy Trown', '/npc.php?id=2'],
                    ['Rusty Reefer', '/npc.php?id=3'],
                    ['Donnie Ray', '/npc.php?id=6'],
                    ['Ricardo Gonzalez', '/npc.php?id=8'],
                    ['Inamoto Kanushi', '/npc.php?id=10'],
                    ['John Moretti', '/npc.php?id=12']
                ], prnt: 'npc_1', arrow: 'npcg', offsetY: -30},
                {divm: 0, lines: [
                    ['Takeshi Yamagata', '/npc.php?id=16'],
                    ['Michael Doyle', '/npc.php?id=17'],
                    ['Alfonso Morales', '/npc.php?id=18'],
                    ['Roy Fatico', '/npc.php?id=19'],
                    ['Giovanni Greco', '/npc.php?id=20']
                ], prnt: 'npc_1', arrow: 'npcp', offsetY: -30},
                {divm: 0, lines: [
                    ['Yakuza', '/syndicate.php?id=5862'],
                    ['Black Guerillaz', '/syndicate.php?id=5865'],
                    ['Colombian Cartel', '/syndicate.php?id=5863'],
                    ['Camorra', '/syndicate.php?id=5866'],
                    ['Rastafaras', '/syndicate.php?id=5867']
                ], prnt: 'npc_1', arrow: 'npcsynd', offsetY: -45},
                {divm: 0, lines: [
                    ['ДО', '/market.php'],
                    ['Разместить объявление', '/market-p.php'],
                    ['Мгновенная продажа', '/market-i.php'],
                    ['Мои объявления', '/market-l.php'],
                    ['Предметы в аренде', '/info.rent.php?id=' + general.myID]
                ], prnt: 'gw_menu', arrow: 'doska', offsetY: -30},
                {divm: 0, lines: [
                    ['Чаты', '/sms.php'],
                    ['Новое сообщение', '/sms-create.php'],
                    ['Удаление', '/sms.php?page=2']
                ], prnt: 'gw_menu', arrow: 'post', offsetY: -15},
                {divm: 'forums_1', lines: [
                    ['Основные форумы', '', 'zag', 1],
                    ['Официальные объявления', '/threads.php?fid=1', 0, 1],
                    ['Вопросы и помощь в игре', '/threads.php?fid=49', 0, 1],
                    ['Общий форум', '/threads.php?fid=27', 0, 1],
                    ['Идеи и предложения', '/threads.php?fid=2', 0, 1],
                    ['Форум для неигровых тем', '/threads.php?fid=22', 0, 1],
                    ['Клуб Нытиков', '/threads.php?fid=55', 0, 1],
                    ['Объявления синдикатов', '/threads.php?fid=38', 0, 1],
                    ['Вступлю в синдикат', '/threads.php?fid=56', 0, 1],
                    ['Тотализатор', '/threads.php?fid=5', 0, 1],
                    ['Конкурсы', '/threads.php?fid=3', 0, 1],
                    ['Благодарности и поздравления',
                        '/threads.php?fid=4', 0, 1],
                    ['Offline встречи', '/threads.php?fid=6', 0, 1],
                    ['Креатив', '/threads.php?fid=23', 0, 1],
                    ['Официальные объявления<br>налоговой инспекции',
                        '/threads.php?fid=24', 0, 1],
                    ['Торговые форумы', 'trade_forums', 'brown'],
                    ['Суд', '', 'zag', 1],
                    ['Официальные объявления суда',
                        '/threads.php?fid=11', 0, 1],
                    ['Зал суда', '/threads.php?fid=12', 0, 1],
                    ['Зал бракосочетаний', '/threads.php?fid=29', 0, 1],
                    ['Дворец Бракосочетания', '/threads.php?fid=50', 0, 1],
                    ['Технические вопросы', '', 'zag', 1],
                    ['Техническая поддержка', '/threads.php?fid=17', 0, 1],
                    ['Баги и глюки (общее)', '/threads.php?fid=18', 0, 1],
                    ['Баги и глюки (финансовые вопросы)',
                        '/threads.php?fid=19', 0, 1],
                    ['Проблемы с боями', '/threads.php?fid=20', 0, 1],
                    ['Проблемы с персонажами', '/threads.php?fid=33', 0, 1],
                    ['Автономные районы', '', 'zag', 1],
                    ['Respect Hill', '/threads.php?fid=25', 0, 1]
                ], prnt: 'gw_menu', arrow: 'forums', offsetY: -158},
                {divm: 0, lines: [
                    ['Торговля предметами : Оружие', '/threads.php?fid=7'],
                    ['Торговля предметами : Броня', '/threads.php?fid=36'],
                    ['Торговля предметами : Аксессуары', '/threads.php?fid=37'],
                    ['Торговля high-tech предметами', '/threads.php?fid=35'],
                    ['Торговля недвижимостью', '/threads.php?fid=34'],
                    ['Торговля предметами : Редкие вещи',
                        '/threads.php?fid=44'],
                    ['Торговля модифицированными предметами',
                        '/threads.php?fid=47'],
                    ['Торговля сломанными вещами', '/threads.php?fid=48'],
                    ['Аренда предметов', '/threads.php?fid=46'],
                    ['Аренда недвижимости', '/threads.php?fid=54'],
                    ['Торговля синдикатами', '/threads.php?fid=41'],
                    ['Поиск исполнителей', '/threads.php?fid=42']
                ], prnt: 'forums_1', arrow: 'trade_forums', offsetY: -90},
                {divm: 'shop_1', lines: [
                    ['Гос. магазин', 'shop_gos'],
                    ['HighTech магазин', 'shop_hightech'],
                    ['Магазин аренды', 'shop_rent'],
                    ['Магазин синдиката', 'shop_synd'],
                    ['Магазин лицензий', '/shopl.php', 0, 1]
                ], prnt: 'gw_menu', arrow: 'shop', offsetY: -15},
                {divm: 0, lines: [
                    ['Огнестрельное оружие', '', 'zag'],
                    ['Пистолеты', '/shop.php?shop=shop_pistols'],
                    ['Автоматы', '/shop.php?shop=shop_auto'],
                    ['Снайперское оружие', '/shop.php?shop=shop_sniper'],
                    ['ПП', '/shop.php?shop=shop_ppguns'],
                    ['Пулемёты', '/shop.php?shop=shop_heavy'],
                    ['Дробовики', '/shop.php?shop=shop_shotguns'],
                    ['Гранатометы', '/shop.php?shop=shop_grl'],
                    ['Гранаты', '/shop.php?shop=shop_grenades'],
                    ['Специальное оружие', '/shop.php?shop=shop_misc'],
                    ['Полезные предметы', '', 'zag'],
                    ['Броня', '/shop.php?shop=shop_armour'],
                    ['Шлемы', '/shop.php?shop=shop_helmets'],
                    ['Броня ног', '/shop.php?shop=shop_boots'],
                    ['Маскировка', '/shop.php?shop=shop_masks'],
                    ['Тепловизоры', '/shop.php?shop=shop_wear'],
                    ['Пояса', '/shop.php?shop=shop_belts'],
                    ['Правый карман', '/shop.php?shop=shop_rightpocket'],
                    ['Левый карман', '/shop.php?shop=shop_leftpocket'],
                    ['Доп.карманы', '/shop.php?shop=shop_epockets'],
                    ['Транспорт', '/shop.php?shop=shop_transport'],
                    ['Цветы', '/shop.php?shop=shop_flowers'],
                    ['Аптека', '/shop.php?shop=shop_drugs'],
                    ['Сувениры', '/shop.php?shop=shop_gifts']
                ], prnt: 'shop_1', arrow: 'shop_gos', offsetY: -75},
                {divm: 0, lines: [
                    ['Огнестрельное оружие', '', 'zag'],
                    ['Автоматы', '/shopc.php?shop=shop_auto_c'],
                    ['Пулемёты', '/shopc.php?shop=shop_heavy_c'],
                    ['Снайперское оружие', '/shopc.php?shop=shop_snipe_c'],
                    ['ПП', '/shopc.php?shop=shop_ppguns_c'],
                    ['Дробовики', '/shopc.php?shop=shop_shotguns_c'],
                    ['Гранатометы', '/shopc.php?shop=shop_grl_c'],
                    ['Полезные предметы', '', 'zag'],
                    ['Броня', '/shopc.php?shop=shop_armour_c'],
                    ['Шлемы', '/shopc.php?shop=shop_helmets_c'],
                    ['Броня ног', '/shopc.php?shop=shop_boots_c'],
                    ['Маскировка', '/shopc.php?shop=shop_masks_c'],
                    ['Тепловизоры', '/shopc.php?shop=shop_wear_c'],
                    ['Пояса', '/shopc.php?shop=shop_belts_c'],
                    ['Правый карман', '/shopc.php?shop=shop_rightpocket_c'],
                    ['Левый карман', '/shopc.php?shop=shop_leftpocket_c'],
                    ['Доп.карманы', '/shopc.php?shop=shop_epockets_c'],
                    ['Аптека', '/shopc.php?shop=shop_drugs_c'],
                    ['Транспорт', '/shopc.php?shop=shop_transport_c']
                ], prnt: 'shop_1', arrow: 'shop_hightech', offsetY: -75},
                {divm: 0, lines: [
                    ['Rent-A-Gun', '', 'zag'],
                    ['Пулеметы', '/rent-a-gun.php?shop=shop_heavy_cr'],
                    ['Автоматы', '/rent-a-gun.php?shop=shop_auto_cr'],
                    ['Снайперское оружие',
                        '/rent-a-gun.php?shop=shop_snipe_cr'],
                    ['Экипировка', '/rent-a-gun.php?shop=shop_armour_cr']
                ], prnt: 'shop_1', arrow: 'shop_rent', offsetY: -30},
                {divm: 0, lines: [
                    ['Гранаты', '/sshop.php?tshop=grenades'],
                    ['Чипы на урон', '/sshop.php?tshop=chipsets'],
                    ['Чипы защитные', '/sshop.php?tshop=chipsets1'],
                    ['Чипы специальные', '/sshop.php?tshop=chipsets2'],
                    ['Турели', '/sshop.php?tshop=turrels'],
                    ['Звания', '/sshop.php?tshop=ranks']
                ], prnt: 'shop_1', arrow: 'shop_synd', offsetY: -15},
                {divm: 'pay_grenades_1', lines: [
                    ['Свет', 'ligntgr'],
                    ['Дым', 'smokegr'],
                    ['Электромагнитные', 'em_gr'],
                    ['Боевые', 'fightinggr']
                ], prnt: 'gw_menu', arrow: 'pay_grenades', offsetY: -15},
                {divm: 0, lines: [
                    ['ОР-1Т', '/market.php?buy=1&item_id=lightst'],
                    ['ОР-1', '/market.php?buy=1&item_id=lights'],
                    ['M84', '/market.php?buy=1&item_id=m84'],
                    ['Синдовые', '', 'zag'],
                    ['ОР-1С', '/statlist.php?r=lightss&type=i'],
                    ['ОР-2C', '/statlist.php?r=lightsm&type=i']
                ], prnt: 'pay_grenades_1', arrow: 'ligntgr', offsetY: -15},
                {divm: 0, lines: [
                    ['РГД-2', '/market.php?buy=1&item_id=rgd2'],
                    ['РГД-2М', '/market.php?buy=1&item_id=rgd2m'],
                    ['L83 A1 HG', '/market.php?buy=1&item_id=l83a1'],
                    ['Синдовые', '', 'zag'],
                    ['РГД-2С', '/statlist.php?r=rgd2s&type=i'],
                    ['ДГ-1', '/statlist.php?r=grenade_dg1&type=i']
                ], prnt: 'pay_grenades_1', arrow: 'smokegr', offsetY: -30},
                {divm: 0, lines: [
                    ['EMP-IR', '/market.php?buy=1&item_id=emp_ir'],
                    ['EMP-IRS', '/market.php?buy=1&item_id=emp_irs'],
                    ['EMP-A', '/market.php?buy=1&item_id=emp_a'],
                    ['EMP-S', '/market.php?buy=1&item_id=emp_s']
                ], prnt: 'pay_grenades_1', arrow: 'em_gr'},
                {divm: 0, lines: [
                    ['РГД-5', '/market.php?buy=1&item_id=rgd5'],
                    ['Граната F-1', '/market.php?buy=1&item_id=grenade_f1'],
                    ['РКГ-3', '/market.php?buy=1&item_id=rkg3'],
                    ['MDN', '/market.php?buy=1&item_id=mdn'],
                    ['РГО-1', '/market.php?buy=1&item_id=rgo'],
                    ['РГН', '/market.php?buy=1&item_id=rgn'],
                    ['Frag Grenade MK-3', '/market.php?buy=1&item_id=fg3l'],
                    ['M67', '/market.php?buy=1&item_id=m67'],
                    ['M3', '/market.php?buy=1&item_id=m3'],
                    ['HG-78', '/market.php?buy=1&item_id=hg78'],
                    ['HG-84', '/market.php?buy=1&item_id=hg84'],
                    ['Mk-6 Frag Grenade', '/market.php?buy=1&item_id=fg6'],
                    ['M14 Thermite', '/market.php?buy=1&item_id=anm14'],
                    ['M34 Ph', '/market.php?buy=1&item_id=m34ph'],
                    ['Mk-7 Frag Grenade', '/market.php?buy=1&item_id=fg7'],
                    ['Mk-8 Black Dust', '/market.php?buy=1&item_id=fg8bd'],
                    ['Синдовые', '', 'zag'],
                    ['GHTB', '/sshop.php?tshop=grenades'],
                    ['Mk-5 Frag Grenade', '/statlist.php?r=fg5&type=i'],
                    ['Коктейль Молотова', '/statlist.php?r=molotov&type=i'],
                    ['HellsBreath', '/statlist.php?r=hellsbreath&type=i'],
                    ['Напалм', '/statlist.php?r=napalm&type=i'],
                    ['ME-85 Frag Grenade', '/statlist.php?r=me85&type=i']
                ], prnt: 'pay_grenades_1', arrow: 'fightinggr', offsetY: -195},
                {divm: 'pay_lut_1', lines: [
                    ['Оружие и броня', 'weapon_armour_lut'],
                    ['Медикаменты', 'drugs_lut'],
                    ['Предметы', 'items_lut']
                ], prnt: 'gw_menu', arrow: 'pay_lut', offsetY: -15},
                {divm: 0, lines: [
                    ['Ржавая граната RGD-5',
                        '/market.php?buy=1&item_id=old_rgd5'],
                    ['Маскировочный плащ', '/market.php?buy=1&item_id=maskp'],
                    ['Тяжелые ботинки', '/market.php?buy=1&item_id=heavyboots'],
                    ['Шлем 2-го класса', '/market.php?buy=1&item_id=helmet2'],
                    ['Титановый пояс', '/market.php?buy=1&item_id=tbelt'],
                    ['HK-53', '/market.php?buy=1&item_id=hk53'],
                    ['L83 A1 HG', '/market.php?buy=1&item_id=l83a1'],
                    ['M84', '/market.php?buy=1&item_id=m84']
                ], prnt: 'pay_lut_1', arrow: 'weapon_armour_lut', offsetY: -45},
                {divm: 0, lines: [
                    ['Травяной сбор', '/market.php?buy=1&item_id=weedset'],
                    ['Вяленая рыба', '/market.php?buy=1&item_id=perch'],
                    ['Родниковая вода', '/market.php?buy=1&item_id=water'],
                    ['Грибы', '/market.php?buy=1&item_id=mushroom'],
                    ['Медицинский бинт', '/market.php?buy=1&item_id=bandage'],
                    ['Походная аптечка', '/market.php?buy=1&item_id=travelkit'],
                    ['Кофейные зерна', '/market.php?buy=1&item_id=coffee'],
                    ['Стимпак бессмертия',
                        '/market.php?buy=1&item_id=stimpack_iddqd'],
                    ['Стимпак бессмертия XL',
                        '/market.php?buy=1&item_id=stimpack_iddqd_xl'],
                    ['Стимпак брони',
                        '/market.php?buy=1&item_id=stimpack_armour'],
                    ['Стимпак брони XL',
                        '/market.php?buy=1&item_id=stimpack_armour_xl'],
                    ['Стимпак урона', '/market.php?buy=1&item_id=stimpack_dmg'],
                    ['Стимпак урона XL',
                        '/market.php?buy=1&item_id=stimpack_dmg_xl'],
                    ['Стимпак скорости',
                        '/market.php?buy=1&item_id=stimpack_spd']
                ], prnt: 'pay_lut_1', arrow: 'drugs_lut', offsetY: -90},
                {divm: 0, lines: [
                    ['Динамит', '/market.php?buy=1&item_id=dinamit'],
                    ['Книга опыта', '/market.php?buy=1&item_id=expbook'],
                    ['Журнал «Современное оружие»',
                        '/market.php?buy=1&item_id=magazine']
                ], prnt: 'pay_lut_1', arrow: 'items_lut', offsetY: -15},
                {divm: 0, lines: [
                    ['от Yeni', 'http://help.yeni.name/gan/'],
                    ['www.cccp-gw.su', 'http://www.cccp-gw.su/dress/']
                ], prnt: 'gw_menu', arrow: 'changeclothing'},
                {divm: 0, lines: [
                    ['Настройки', '/info.edit.php?type=main'],
                    ['Настройки боя', '/info.edit.php?type=battles'],
                    ['О себе', '/info.edit.php?type=pinfo'],
                    ['Анкета', '/info.anketa.php'],
                    ['E-mail и пароли', '/info.edit.php?type=security'],
                    ['Привязка к телефону', '/info.sms.php'],
                    ['Секретный ключ', '/info.edit.php?type=pkey'],
                    ['Аватар', '/info.edit.php?type=avatar'],
                    ['Приглашения', '/info.edit.php?type=invites'],
                    ['PDA', '/info.edit.php?type=pda'],
                    ['Навигация', '/info.edit.php?type=navy']
                ], prnt: 'gw_menu', arrow: 'settings', offsetY: -45}
            ];

            this.createGWMenuItems(gwM);

            var _this = this;
            //кнопка закрытия меню
            general.$('exit').addEventListener('click', function () {
                _this.gwMenuInit();
            }, false);

            //чекбокс "Показывать всегда"
            general.$('showt').addEventListener('click', function () {
                var showt = this;
                general.setData(showt.checked ? ['1'] : [], 12);
            }, false);

            this.gwMenuInit();
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // ссылка в главном меню игры
            var target = general.doc.querySelector('a[href$="/ratings.php"]');
            if (target) {
                var mainLink = general.doc.createElement('span');
                mainLink.setAttribute('style', 'font-weight: bold; ' +
                    'cursor: pointer;');
                mainLink.innerHTML = 'GW-Меню';
                target.parentNode.insertBefore(mainLink, target);
                target.parentNode.
                    insertBefore(general.doc.createTextNode(' | '), target);

                var _this = this;
                mainLink.addEventListener('click', function () {
                    _this.gwMenuInit(_this);
                }, false);

                // если есть запись в хранилище "Показывать всегда"
                if (general.getData(12)[0]) {
                    this.gwMenuInit();
                    general.$('showt').checked = true;
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class InventoryPlus {{{1
     * @constructor
     */
    var InventoryPlus = function () {
        /**
         * @method openCloseItem {{{2
         * @param   {String}    id
         */
        this.openCloseItem = function (id) {
            return function () {
                var tb = general.doc.getElementById('tr_' + id),
                    _this = this;

                if (tb.style.display === '') {
                    tb.style.display = 'none';
                    _this.innerHTML = _this.innerHTML.replace('-', '+');
                } else {
                    tb.style.display = '';
                    _this.innerHTML = _this.innerHTML.replace('+', '-');
                }
            };
        }; // 2}}}

        /**
         * @method compareLines {{{2
         * @param   {Object}        line
         * @param   {Array}         linesObj
         * @return  {Object|null}
         */
        this.compareLines = function (line, linesObj) {
            var i;

            line.link = line.line_1.querySelectorAll('a')[1];
            line.id = /id=(.*)$/.exec(line.link.href)[1];
            for (i = 0; i < linesObj.length; i++) {
                if (linesObj[i].line.id === line.id) {
                    return linesObj[i];
                }
            }

            return null;
        }; // 2}}}

        /**
         * @method startInventoryPlus {{{2
         * @param   {Object}    _this
         */
        this.startInventoryPlus = function (_this) {
            // ищем таблицу с инвентарем
            var tbody = general.doc.querySelector('table[border="0"]' +
                    '[cellspacing="1"][cellpadding="5"][align="center"]' +
                    '[width="700"] tr[id^="item_tr"]');

            if (!tbody) {
                return;
            }

            tbody = tbody.parentNode;
            if (!tbody.firstElementChild) {
                return;
            }

            var node = tbody.firstElementChild.nextElementSibling;
            if (/предметов нет/.test(node.innerHTML)) {
                return;
            }

            var allLines = [], // все узлы <tr> из инвентаря
                next,
                i;

            while (node) {
                i = allLines.length;
                allLines[i] = {'line_1': node.cloneNode(true), 'line_2': 0};
                next = node.nextSibling;
                if (next.nodeType === 1) {
                    allLines[i].line_2 = next.cloneNode(true);
                    node = next.nextElementSibling;
                } else {
                    node = node.nextElementSibling;
                }
            }

            // удаляем все предметы из инвентаря
            var trs = tbody.querySelectorAll('tr[id^="item_tr"]');
            for (i = 0; i < trs.length; i++) {
                tbody.removeChild(trs[i]);
            }

            // массив "уникальных" вещей (каждая вешь по одной и количество)
            var linesObj = [],
                obj;

            for (i = 0; i < allLines.length; i++) {
                obj = _this.compareLines(allLines[i], linesObj);
                if (!obj) {
                    linesObj[linesObj.length] = {line: allLines[i], count: 1};
                } else {
                    obj.count++;
                }
            }

            // вставляем вещи обратно в инвентарь
            var tblTarget,
                trHide,
                divn,
                id,
                td,
                j;

            for (i = 0; i < linesObj.length; i++) {
                tbody.appendChild(linesObj[i].line.line_1);
                if (linesObj[i].line.line_2) {
                    tbody.appendChild(linesObj[i].line.line_2);
                }

                // показываем количество только если оно больше 1
                if (linesObj[i].count !== 1) {
                    id = linesObj[i].line.id;
                    // вставим скрытые вещи
                    trHide = general.doc.createElement('tr');
                    trHide.id = 'tr_' + id;
                    trHide.setAttribute('style', 'display: none');
                    td = general.doc.createElement('td');
                    td.setAttribute('colspan', '5');
                    tblTarget = general.doc.createElement('table');
                    tblTarget.setAttribute('style',
                            'width: 100%; margin-left: 30px;');
                    td.appendChild(tblTarget);
                    trHide.appendChild(td);
                    tbody.appendChild(trHide);

                    for (j = 0; j < allLines.length; j++) {
                        if (allLines[j].id === id &&
                                linesObj[i].line.line_1.innerHTML !==
                                allLines[j].line_1.innerHTML) {
                            allLines[j].line_1.firstElementChild.
                                setAttribute('width', '400px');
                            tblTarget.appendChild(allLines[j].line_1);
                            if (allLines[j].line_2) {
                                tblTarget.appendChild(allLines[j].line_2);
                            }
                        }
                    }

                    //показываем количество и кнопу раскрытия списка
                    divn = general.doc.createElement('div');
                    divn.setAttribute('style', 'color: #606060; ' +
                            'margin-right: 300px; margin-left: 10px; ' +
                            'font-weight: bold; cursor: pointer;');
                    divn.innerHTML = '[' + linesObj[i].count + '+]';
                    divn.addEventListener('click',
                            _this.openCloseItem(id), false);
                    linesObj[i].line.link.parentNode.appendChild(divn);
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var _this = this;
            /*global $, filteritems, def_filter */
            general.root.postdo = function (url) {
                /*jslint unparam: true */
                $('#itemsbody').
                    load(url, function (responseTxt, statusTxt) {
                        if (statusTxt === 'success') {
                            filteritems(def_filter);
                        }

                        _this.startInventoryPlus(_this);
                    });

                return false;
            };

            this.startInventoryPlus(this);
        }; // 2}}}
    }; // 1}}}

    /**
     * @class CountBattles {{{1
     * @constructor
     */
    var CountBattles = function () {
        /**
         * @property rez
         * @type {Object}
         */
        this.rez = {win: 0, draw: 0, loss: 0, btls: []};
        /**
         * @property divContainer
         * @type {HTMLDivElement|null}
         */
        this.divContainer = null;
        /**
         * @property reg
         * @type {Object|null}
         */
        this.reg = null;
        /**
         * @property persId
         * @type {String}
         */
        this.persId = /\?id=(\d+)/.exec(general.loc)[1];
        /**
         * @property tm
         * @type {int}
         */
        this.tm = 1000;

        /**
         * @method getBattles {{{2
         * @param   {Object}    obj
         * @return  {Boolean}
         */
        this.getBattles = function (obj) {
            var btlLogs = obj.querySelectorAll('nobr>a[href*=' +
                    '"/warlog.php?bid="]>font.greenfont'),
                i;

            for (i = 0; i < btlLogs.length; i++) {
                if (this.reg.test(btlLogs[i].innerHTML)) {
                    this.rez.btls.push(btlLogs[i].parentNode.parentNode.
                            nextElementSibling);
                } else {
                    return false;
                }
            }

            return !!btlLogs.length;
        }; // 2}}}

        /**
         * @method showResult {{{2
         */
        this.showResult = function () {
            var persLink, cls, i;

            for (i = 0; i < this.rez.btls.length; i++) {
                persLink = this.rez.btls[i].
                    querySelector('a[href$="?id=' + this.persId + '"]');

                if (persLink) {
                    // noinspection JSUnresolvedFunction
                    cls = persLink.getAttribute('class');
                    if (/red/.test(cls)) {
                        this.rez.win++;
                    } else if (/blue/.test(cls)) {
                        this.rez.loss++;
                    } else {
                        this.rez.draw++;
                    }
                }
            }

            this.divContainer.innerHTML = 'Проведено боев за текущие ' +
                'сутки: <span style="font-weight: bold;">' +
                this.rez.btls.length + ' (<span style="color: #FF0000;">' +
                this.rez.win + '</span>/<span style="color: #0000FF;">' +
                this.rez.loss + '</span>/<span style="color :#008000;">' +
                this.rez.draw + '</span>)</span>';
        }; // 2}}}

        /**
         * @method startCountBattles {{{2
         * @param   {int}   ind
         */
        this.startCountBattles = function (ind) {
            if (!ind) {
                if (this.getBattles(general.doc)) {
                    this.divContainer.innerHTML = '<span style="margin-left: ' +
                        '100px;">Загрузка <img src="' + general.imgPath +
                        'preloader.gif" alt="Загрузка" ' +
                        'title="Загрузка"></span>';
                    ind++;
                    this.startCountBattles(ind);
                } else {
                    this.showResult();
                }
            } else {
                var url = 'https://' + general.domain + '/info.warstats.php?' +
                    'id=' + this.persId + '&page_id=' + ind,
                    _this = this;

                new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                    var span = general.doc.createElement('span');
                    span.innerHTML = xml.responseText;
                    // если перс в это время зашел в заявку/бой, то просто
                    // перезагрузим страницу
                    if (/игрок находится в бою/.test(span.innerHTML)) {
                        general.root.location.reload();
                        return;
                    }

                    if (_this.getBattles(span)) {
                        ind++;
                        general.root.setTimeout(function () {
                            _this.startCountBattles(ind);
                        }, _this.tm);
                    } else {
                        _this.showResult();
                    }
                }, function () {
                    general.root.setTimeout(function () {
                        _this.startCountBattles(ind);
                    }, _this.tm);
                });
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var target = general.doc.querySelector('center+br+br'),
                inBattle = /игрок находится в бою/.
                    test(general.doc.body.innerHTML),
                pageId = /page_id=(\d+)/.exec(general.loc);

            // если перс НЕ в заявке/бою и мы на первой странице протоколов
            if (target && !inBattle && !(pageId && pageId[1] !== '0') &&
                    !/\(0 всего\)/.test(general.doc.body.innerHTML)) {
                this.divContainer = general.doc.createElement('div');
                this.divContainer.setAttribute('style', 'margin-left: 10px;');
                target.parentNode.insertBefore(this.divContainer, target);

                var date = new Date(),
                    year = /20(\d+)/.exec(' ' + date.getFullYear())[1],
                    month = date.getMonth() + 1,
                    day = date.getDate();

                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;
                this.reg  = new RegExp(day + '\\.' + month + '\\.' + year);

                this.startCountBattles(0);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class GbCounter {{{1
     * @constructor
     */
    var GbCounter = function () {
        /**
         * @property spanCountGB
         * @type {HTMLElement|null}
         */
        this.spanCountGB = null;
        /**
         * @property countGbNow
         * @type {int}
         */
        this.countGbNow = 0;

        /**
         * @method resetGBCounter {{{2
         */
        this.resetGBCounter = function () {
            general.setData([this.countGbNow.toString()], 13);
            this.setGBCounter();
        }; // 2}}}

        /**
         *  @method setGBCounter {{{2
         */
        this.setGBCounter = function () {
            var countGbOld = general.getData(13)[0];
            if (!countGbOld) {
                this.resetGBCounter();
                return;
            }

            // noinspection JSRemoveUnnecessaryParentheses
            var diff = this.countGbNow - (+countGbOld);
            this.spanCountGB.innerHTML = '[' +
                new SetPoints().init(diff, '.', true) + ']';
            this.spanCountGB.style.color = diff >= 0 ?
                    '#FF0000' : '#0000FF';
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // на главной странице личного NPC
            if (/\?nid=\d+/.test(general.loc)) {
                return;
            }

            var divGB = general.doc.querySelector('td>b>div[id="cdiv"]');
            if (divGB) {
                this.countGbNow = +divGB.innerHTML.replace(/,/g, '');
                this.spanCountGB = general.doc.createElement('span');
                this.spanCountGB.setAttribute('style', 'margin-left: 5px; ' +
                        'font-weight: normal; font-size: 7pt; ' +
                        'cursor: pointer;');
                divGB.appendChild(this.spanCountGB);

                this.setGBCounter();

                var _this = this;
                this.spanCountGB.addEventListener('click', function () {
                    if (confirm('Сбросить счетчик?')) {
                        _this.resetGBCounter();
                    }
                }, false);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class BuyHightech {{{1
     * @constructor
     */
    var BuyHightech = function () {
        /**
         * @method init {{{2
         */
        this.init = function () {
            if (/\/shopc\.php/.test(general.loc)) {
                var descrTd = general.doc.querySelectorAll('td[class$=' +
                         '"lightbg"][valign="top"][align="left"]' +
                             '[width="100%"]'),
                    strength,
                    price,
                    id,
                    i;

                for (i = 0; i < descrTd.length; i++) {
                    id = /id=(.+)$/.exec(descrTd[i].parentNode.
                            querySelector('a').href)[1];
                    price = /(\d+) EUN/.exec(descrTd[i].innerHTML)[1];
                    strength = /Прочность:<\/b> (\d+)/i.
                                    exec(descrTd[i].innerHTML)[1];

                    descrTd[i].removeChild(descrTd[i].lastElementChild);
                    descrTd[i].innerHTML += ' <span style="font-weight: ' +
                        'bold; margin-left: 7px;"> Создать объявление: ' +
                        '</span><a target="_blank" style="color: #0000FF;" ' +
                        'href="https://' + general.domain + '/market-p.php?' +
                        'stage=2&item_id=' + id + '&action_id=2&p=' + price +
                        '&s=' + strength + '">[Купить]' + '</a> ' +
                        '<a target="_blank" style="color: #990000;" href=' +
                        '"https://' + general.domain + '/market-p.php?' +
                        'stage=2&item_id=' + id + '&action_id=1&p=' + price +
                        '&s=' + strength + '">[Продать]</a>';
                }

                return;
            }

            // на странице подачи объявлений
            var param = /&p=(\d+)&s=(\d+)$/.exec(general.loc);
            if (param) {
                general.doc.querySelector('td[colspan="3"]' +
                    '[class="greenlightbg"]').innerHTML += ' <span ' +
                    'style="color: #990000;">[Стоимость в магазине: ' +
                    param[1] + ' EUN]</span>';

                //остров любой
                general.doc.querySelector('select[name="island"]').value = '-1';

                var dur1 = general.doc.
                            querySelector('input[name="durability1"]'),
                    dur2 = general.doc.
                            querySelector('input[name="durability2"]');

                //если продаем, то прочность максимальная,
                //если покупаем, то минимальная
                if (/action_id=1/.test(general.loc)) {
                    dur1.value = param[2];
                    dur2.value = param[2];
                } else {
                    dur1.value = '0';
                    dur2.value = '1';
                }

                // срок размещения 7 дней
                general.doc.
                    querySelector('select[name="date_len"]').value = '7';
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class NewsAndInvit {{{1
     * @constructor
     */
    var NewsAndInvit = function () {
        /**
         * @method isForumPage {{{2
         * @return   {Boolean}
         */
        this.isForumPage = function () {
            // noinspection JSRemoveUnnecessaryParentheses
            return (/fid=1&tid=\d+/.test(general.loc));
        }; // 2}}}

        /**
         * @method blink {{{2
         * @param   {Object}    link
         */
        this.blink = function (link) {
            link.style.color = '#FF0000';
            general.root.setInterval(function () {
                link.style.color = link.style.color ? '' : '#FF0000';
            }, 700);
        }; // 2}}}

        /**
         * @method getNewsId {{{2
         * @param    {String}   link
         * @return   {String}
         */
        this.getNewsId = function (link) {
            return (/&tid=(\d+)/.exec(link))[1];
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var stData = general.getData(14)[0];
            stData = stData ? JSON.parse(stData) : null;

            var newsId;
            // на форуме новостей
            if (this.isForumPage() && stData) {
                newsId = this.getNewsId(general.loc);
                if (stData[newsId] === '0') {
                    stData[newsId] = '1';
                    general.setData(JSON.stringify(stData), 14);
                }

                return;
            }

            // на главной
            // приглосы
            var invit = general.doc.querySelector('a[href*="/me.php?nb=synd"]');
            if (invit) {
                invit.setAttribute('style', 'color: #FF0000; ' +
                        'font-weight: bold;');
            }

            // новости
            var newsLinks = general.doc.querySelectorAll('nobr>' +
                    'a[href*="/messages.php?fid=1&tid="]');

            // noinspection JSUnresolvedVariable
            if (newsLinks.length) {
                var newData = {},
                    i;

                for (i = 0; i < newsLinks.length; i++) {
                    newsId = this.getNewsId(newsLinks[i].href);
                    // storage пустой... записываем все темы как прочитанные
                    if (!stData) {
                        newData[newsId] = '1';
                        continue;
                    }

                    if (!stData[newsId]) {
                        stData[newsId] = '0';
                    }

                    if (stData[newsId] === '0') {
                        this.blink(newsLinks[i]);
                    }

                    newData[newsId] = stData[newsId];
                }

                general.setData(JSON.stringify(newData), 14);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class FilterResOnStat {{{1
     * @constructor
     */
    var FilterResOnStat = function () {
        /**
         * @method delSpaces {{{2
         * @param   {String}    str
         * @return  {String}
         */
        this.delSpaces = function (str) {
            return str.replace(/^\s*/, '').replace(/\s*$/, '').
                replace(/\s,/g, ',').replace(/,\s/g, ',').
                replace(/&nbsp;/g, '').replace(/&amp;/g, '&');
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var tbl = general.doc.querySelector('table[border="0"]' +
                    '[class="wb"]');

            if (tbl) {
                var res = this.delSpaces(general.getData(15)[0]).split(','),
                    trs = tbl.querySelectorAll('tr'),
                    nameRes,
                    i;

                for (i = 1; i < trs.length; i++) {
                    nameRes = this.delSpaces(/[^(]+/.exec(trs[i].
                                    firstElementChild.innerHTML)[0]);
                    if (res.indexOf(nameRes) === -1) {
                        trs[i].style.display = 'none';
                    }
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class FilterWarlistOne2One {{{1
     * @constructor
     */
    var FilterWarlistOne2One = function () {
        /**
         * @property table
         * @type {HTMLTableElement}
         */
        this.table = general.doc.querySelector('table[cellpadding="5"]');

        /**
         * @method sortWeapon {{{2
         */
        this.sortWeapon = function () {
            var weapon = general.$('w_name').value.toLowerCase(),
                tr = this.table.querySelectorAll('tr'),
                text,
                i;

            for (i = 0; i < tr.length; i++) {
                /*eslint-disable no-useless-escape */
                if (tr[i].firstElementChild &&
                        /<b>[^\[]*\[\d+\]/.test(tr[i].innerHTML)) {
                    /*eslint-enable no-useless-escape */
                    tr[i].style.display = '';
                    if (weapon) {
                        text = tr[i].firstElementChild.nextElementSibling.
                            innerHTML.toLowerCase();
                        if (text.indexOf(weapon) === -1) {
                            tr[i].style.display = 'none';
                        }
                    }
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (/Подтверждаете бой с/.test(general.doc.body.innerHTML)) {
                return;
            }

            var filtForm = general.doc.
                    querySelector('form[action$="/warlist.php"]');

            if (filtForm && this.table) {
                filtForm = filtForm.cloneNode(false);
                filtForm.setAttribute('style', 'display: inline-block; ' +
                    'margin: 0 10px 0 10px;');

                var hidden1 = general.
                        doc.querySelector('input[name="levelset"]').
                            cloneNode(false),
                    hidden2 = general.doc.
                        querySelector('input[name="war"]').cloneNode(false),
                    s_lmin = general.doc.
                        querySelector('select[name="s_lmin"]').cloneNode(true),
                    s_lmax = general.doc.
                        querySelector('select[name="s_lmax"]').cloneNode(true),
                    s_ltype = general.doc.
                        querySelector('select[name="s_ltype"]').cloneNode(true);

                filtForm.appendChild(hidden1);
                filtForm.appendChild(hidden2);
                filtForm.appendChild(general.doc.createTextNode('от '));
                filtForm.appendChild(s_lmin);
                filtForm.appendChild(general.doc.createTextNode(' до '));
                filtForm.appendChild(s_lmax);
                filtForm.appendChild(general.doc.createTextNode(' тип '));
                filtForm.appendChild(s_ltype);
                var subm = general.doc.createElement('input');
                subm.type = 'submit';
                subm.value = '»';
                filtForm.appendChild(subm);

                var target = general.$('updatetimer').nextElementSibling;
                target.parentNode.
                    insertBefore(filtForm, target.nextElementSibling);

                s_lmin.setAttribute('style', 'width: 40px;');
                s_lmax.setAttribute('style', 'width: 40px;');

                var span = general.doc.createElement('span');
                span.innerHTML = 'Название: <input id="w_name" ' +
                    'style="width: 150px;" value="' + general.getData(16)[0] +
                    '" />';
                target.parentNode.insertBefore(span, filtForm.nextSibling);

                var _this = this;
                general.$('w_name').addEventListener('input', function () {
                    var weapName = this;
                    general.setData(weapName.value, 16);
                    _this.sortWeapon();
                }, false);

                //удаляем нижнюю форму
                this.table.firstElementChild.
                    removeChild(this.table.firstElementChild.lastElementChild);

                this.sortWeapon();
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class FixSkills {{{1
     * @constructor
     */
    var FixSkills = function () {
        /**
         * @property skills {{{2
         * @type {Array}
         */
        this.skills = [
            ['0', 4], ['1', 8], ['2', 13], ['3', 23], ['4', 36], ['5', 56],
            ['6', 84], ['7', 123], ['8', 176], ['9', 248], ['10', 344],
            ['11', 471], ['12', 637], ['13', 852], ['14', 1128], ['15', 1480],
            ['16', 1926], ['17', 2489], ['18', 3193], ['19', 4070],
            ['20', 5500], ['20/1', 7140], ['20/2', 9270], ['20/3', 12050],
            ['20/4', 15600], ['20/5', 20000], ['20/6', 26300], ['20/7', 34200],
            ['20/8', 45000], ['20/9', 58000]
        ]; // 2}}}

        /**
         * @method fixSkills {{{2
         * @param   {NodeList}  nbrs
         */
        this.fixSkills = function (nbrs) {
            var residue,
                font,
                rez,
                x,
                i,
                j;

            for (i = 0; i < nbrs.length; i++) {
                x = /\([^>]+>(\d+.?\d*)<\/span>\s?\)\s*.*\+-\d+.?\d*<\/font>/.
                    exec(nbrs[i].innerHTML);

                if (x) {
                    x = parseFloat(x[1]);

                    rez = 0;
                    for (j = 0; j < this.skills.length; j++) {
                        if (x < this.skills[j][1]) {
                            rez = this.skills[j];
                            break;
                        }
                    }

                    if (!rez) {
                        rez = ['20/10'];
                    }

                    font = nbrs[i].querySelectorAll('font');
                    font[0].innerHTML = rez[0];

                    if (rez[1]) {
                        residue = rez[1] - x;
                        //если есть знаки после запятой, то оставляем один
                        residue = residue - Math.floor(residue) ?
                                residue.toFixed(1) : residue.toFixed(0);
                        font[1].innerHTML = '+' + residue;
                    }
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var nobrs, css;
            if (/\/info\.php\?id=/.test(general.loc)) {
                css = 'td[class="greenbrightbg"][align="right"]' +
                    '[valign="top"]>table:not([align="center"])';
                nobrs = general.doc.querySelector(css).querySelectorAll('nobr');
            } else {
                css = 'td[valign="top"][align="center"]>' +
                    'table[cellspacing="0"][cellpadding="0"][border="0"]';
                nobrs = general.doc.querySelector(css).querySelectorAll('nobr');
            }

            this.fixSkills(nobrs);
        }; // 2}}}
    }; // 1}}}

    /**
     * @class FuckTheFarm {{{1
     * @constructor
     */
    var FuckTheFarm = function () {
        /**
         * @method init {{{2
         */
        this.init = function () {
            var link;

            if (/\/me(\/|\.php)/.test(general.loc)) {
                link = general.doc.querySelector('[src$="images.' +
                    general.domain.replace('www.', '') +
                    '/i/home/farm.gif"]').parentNode;
                var lparent = link.parentNode;
                lparent.removeChild(link.previousElementSibling);
                lparent.removeChild(link.nextElementSibling);
                lparent.removeChild(link);
                return;
            }

            link = general.doc.
                querySelector('a[href*="/info.ach.php?id="]+' +
                    'a[href*="/info.ach.php?id="]').nextSibling;
            while (link.nextSibling) {
                link.parentNode.removeChild(link.nextSibling);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class HistorySms {{{1
     * @constructor
     */
    var HistorySms = function () {
        /**
         * @property nik
         * @type {String|null}
         */
        this.nik = null;
        /**
         * @property uncodeNik
         * @type {String|null}
         */
        this.uncodeNik = null;

        /**
         * @property spanContent
         * @type {Object}
         */
        this.spanContent = general.doc.createElement('span');
        /**
         * @property sms
         * @type {Array}
         */
        this.sms = [];
        /**
         * @property numberSms
         * @type {int}
         */
        this.numberSms = 3;

        // noinspection FunctionWithInconsistentReturnsJS
        /**
         * @method sortMess {{{2
         * @return   {int}
         */
        this.sortMess = function () {
            this.sms.sort(function (a, b) {
                var ret;

                if (a.id < b.id) {
                    ret = 1;
                } else if (a.id > b.id) {
                    ret = -1;
                } else {
                    ret = 0;
                }

                return ret;
            });
        }; // 2}}}

        /**
         * @method createDivSms {{{2
         * @return   {Object}
         */
        this.createDivSms = function () {
            var target = general.doc.
                    querySelector('div[style*="overflow:auto"]'),
                divSms = general.doc.createElement('div');

            divSms.setAttribute('name', 'historySms');
            divSms.setAttribute('style', 'font-size: 8pt; margin-bottom: 7px;');
            target.insertBefore(divSms, target.firstChild);

            return divSms;
        }; // 2}}}

        /**
         * @method showOfSyndLinks {{{2
         */
        this.showOfSyndLinks = function () {
            var mass = [],
                i;

            for (i = 0; i < this.sms.length; i++) {
                mass.push(this.sms[i].ofSyndLink);
            }

            this.createDivSms().innerHTML = '<span style="color: #FF0000;">' +
                'Ссылки на сообщения, доступные для официальных синдикатов:' +
                '</span><div style="color: #000000;">' +
                mass.reverse().join('<br>') + '</div><hr>';
            general.$('showOfSyndLinks').style.display = 'none';
        }; // 2}}}

        /**
         * @method showSms {{{2
         */
        this.showSms = function () {
            var i;

            for (i = 0; i < this.sms.length; i++) {
                this.createDivSms().innerHTML = this.sms[i].mess +
                    (!i ? '<hr>' : '');
            }

            general.$('showOfSyndLinks').style.display = '';
            general.$('counter').innerHTML = '';
            general.$('preloader').style.display = 'none';
            general.$('showHistory').removeAttribute('on');
        }; // 2}}}

        /**
         * @method nextAjaxQuery {{{2
         * @param    {Boolean}  outbox
         */
        this.nextAjaxQuery = function (outbox) {
            var _this = this;

            general.root.setTimeout(function () {
                _this.showHistory(outbox ? 0 : 1, 0, outbox ? null : 1);
            }, 1000);
        }; // 2}}}

        /**
         * @method showHistory {{{2
         * @param   {int}       id
         * @param   {int}       id1
         * @param   {int|null}  id2
         */
        this.showHistory = function (id, id1, id2) {
            var counter = general.$('counter'),
                url;

            // noinspection JSIncompatibleTypesComparison
            if (id2 !== null) {
                counter.innerHTML = !id ? 'входящие...' : 'исходящие...';
                url = 'https://' + general.domain + '/sms.php?page=' + id +
                    '&page_id1=' + (!id ? id1 : 0) + '&page_id2=' +
                    (id ? id1 : 0) + '&search=' + this.uncodeNik;
            } else {
                if (!id) {
                    this.sortMess();
                }

                counter.innerHTML = (id + 1).toString() + '/' + this.sms.length;
                url = this.sms[id].href;
            }

            var _this = this;
            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                _this.spanContent.innerHTML = xml.responseText;

                // noinspection JSIncompatibleTypesComparison
                if (id2 !== null) {
                    var linksSms = _this.spanContent.
                            querySelectorAll('td[width="100%"]>' +
                                'a[href*="/sms-read.php?type="]'),
                        outbox = id2 === 1;

                    if (!linksSms.length) {
                        _this.nextAjaxQuery(outbox);
                        return;
                    }

                    var color = '<span style="font-weight: bold; color: #' +
                                    (outbox ? '008000' : 'AC4311') + ';">',
                        allCountSms = !outbox ?
                                _this.numberSms : _this.numberSms * 2,
                        i;

                    for (i = 0; i < linksSms.length; i++) {
                        _this.sms.push({
                            id: +/&id=(\d+)/.exec(linksSms[i].href)[1],
                            href: linksSms[i].href,
                            mess: color + (outbox ? 'Я' : _this.nik),
                            ofSyndLink: ''
                        });

                        // noinspection JSRemoveUnnecessaryParentheses
                        if (allCountSms === _this.sms.length ||
                                // последняя ссылка на странице,
                                // но ссылок меньше 30 => больше страниц нет
                                // (по 30 сообщений на одной странице)
                                (i === linksSms.length - 1 &&
                                    linksSms.length < 30)) {
                            _this.nextAjaxQuery(outbox);

                            return;
                        }
                    }

                    general.root.setTimeout(function () {
                        id1++;
                        _this.showHistory(id, id1, id2);
                    }, 1000);
                } else {
                    var time = _this.spanContent.querySelector('td[width=' +
                            '"100%"]>a[href*="/info.php?id="]:first-child').
                                nextSibling.nodeValue;

                    _this.sms[id].mess += time + ':</span><br>' +
                        _this.spanContent.querySelector('div[style*=' +
                                '"overflow:auto"]').innerHTML.
                                    replace(/^(\s|<br>)*|(\s|<br>)*$/g, '');
                    _this.sms[id].ofSyndLink = _this.spanContent.
                        querySelector('#attndiv+center>' +
                            'a[href*="/sms-pub.php?type="]').href;

                    id++;
                    if (!_this.sms[id]) {
                        _this.showSms();
                        return;
                    }

                    general.root.setTimeout(function () {
                        _this.showHistory(id, 0, null);
                    }, 1000);
                }
            }, function () {
                general.root.setTimeout(function () {
                    _this.showHistory(id, id1, id2);
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var target = general.doc.querySelector('td[width="100%"]>' +
                    'a[href*="/info.php?id="]:first-child'),
                _this = this;

            target.parentNode.innerHTML += '<span id="showHistory" ' +
                'style="color: #008000; cursor: pointer; margin-left: 10px;">' +
                'История</span> <input id="countSms" maxlength="5" ' +
                'style="width: 45px;" value="' + this.numberSms +
                '" title="Количество исходящих сообщений" /> ' +
                '<span id="preloader" style="margin: 0 10px 0 10px; ' +
                'display: none;"><img src="' + general.imgPath +
                'preloader.gif" alt="img" /></span><span id="counter"></span>' +
                '<span id="showOfSyndLinks" style="cursor: pointer; ' +
                'display: none; text-decoration: underline;">ссылки</span>';

            general.$('showOfSyndLinks').addEventListener('click', function () {
                _this.showOfSyndLinks();
            }, false);

            general.$('countSms').addEventListener('keypress', function (e) {
                var ev = e || general.root.event;
                if (ev.keyCode === 13) {
                    general.$('showHistory').click();
                }
            }, false);

            this.nik = target.querySelector('b').innerHTML;
            this.uncodeNik = new UrlEncode().init(this.nik);

            general.$('showHistory').addEventListener('click', function () {
                var lnk = this;
                if (lnk.getAttribute('on')) {
                    return;
                }

                _this.numberSms = +general.$('countSms').value;
                if (isNaN(_this.numberSms) || _this.numberSms < 1) {
                    alert('Не верно введено количество исходящих сообщений');
                    return;
                }

                lnk.setAttribute('on', '1');
                // удаляем уже выведенные сообщения
                var divHistory = general.doc.
                        querySelectorAll('div[name="historySms"]'),
                    i;

                for (i = 0; i < divHistory.length; i++) {
                    divHistory[i].parentNode.removeChild(divHistory[i]);
                }

                _this.sms = [];
                general.$('preloader').style.display = '';
                general.$('showOfSyndLinks').style.display = 'none';
                _this.showHistory(0, 0, 0);
            }, false);
        }; // 2}}}
    }; // 1}}}

    /**
     * @class LinksToHighTech {{{1
     * @constructor
     */
    var LinksToHighTech = function () {
        /**
         * @property highTechItems {{{2
         * @type {Object}
         */
        this.highTechItems = {
            'htGroup': ['auto', 'heavy', 'sniper', 'ppguns', 'shotguns',
                'grl', 'armour', 'helmets', 'boots', 'masks', 'wear',
                'belts', 'rightpocket', 'leftpocket', 'epockets', 'drugs',
                'transport'],
            'sniper': 'snipe'
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var links = general.doc.
                    querySelector('td[valign="top"][width="200"]').
                        querySelectorAll('a[href*="/shop.php?shop=shop_"]'),
                group,
                i;

            for (i = 0; i < links.length; i++) {
                if (links[i].innerHTML) {
                    group = /\?shop=shop_(.*)$/.exec(links[i].href)[1];
                    if (this.highTechItems.htGroup.indexOf(group) !== -1) {
                        // noinspection JSUnresolvedVariable
                        links[i].parentNode.innerHTML = '<a ' +
                            'href="/shopc.php?shop=shop_' +
                            (this.highTechItems[group] || group) +
                            '_c" style="color: #AC4311; margin-right: 5px;">' +
                            '[Ht]</a>' + links[i].parentNode.innerHTML;
                    }
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class GameMania {{{1
     * @constructor
     */
    var GameMania = function () {
        /**
         * @property target
         * @type {HTMLTableCellElement}
         */
        this.target = general.doc.querySelector('td[class="greenbrightbg"]' +
            '[valign="top"][align="left"]');
        // noinspection JSUnusedGlobalSymbols
        /**
         * @property total
         * @type {int}
         */
        this.total = 0;

        /**
         * @method calc {{{2
         * @param   {Object}    reg1
         * @param   {Object}    reg2
         * @return  {int}
         */
        this.calc = function (reg1, reg2) {
            var spent = reg1.test(this.target.innerHTML) ?
                        +reg1.exec(this.target.innerHTML)[1].
                            replace(/,/g, '') : 0,
                prize = reg2.test(this.target.innerHTML) ?
                        +reg2.exec(this.target.innerHTML)[1].
                            replace(/,/g, '') : 0,
                rez = prize - spent;

            if (!rez) {
                return 0;
            }

            // noinspection JSUnusedGlobalSymbols
            this.total += rez;
            return rez;
        }; // 2}}}

        /**
         * @method getStrGameRez {{{2
         * @param   {int}       rez
         * @param   {String}    game
         * @param   {Boolean}   ttl
         * @return  {String}
         */
        this.getStrGameRez = function (rez, game, ttl) {
            return '<tr><td style="' +
                (!ttl ? 'color: #008000' : 'font-weight: bold') + ';">' +
                game + ':</td>' + '<td style="color: ' +
                (rez < 0 ? '#0000FF' : '#FF0000') + ';">$' +
                new SetPoints().init(rez, ',', false) + '</td></tr>';
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (!this.target ||
                    !/Отработано часов/.test(this.target.innerHTML)) {
                return;
            }

            var roul = this.calc(/Потрачено в казино: <b>\$([^<]*)/i,
                    /Выигрыш в казино: <b>\$([^<]*)/i),
                tot = this.calc(/Потрачено в тотализаторе: <b>\$([^<]*)/i,
                    /Выигрыш в тотализаторе: <b>\$([^<]*)/i),
                fight = /Выигрыш в боях/i.test(this.target.innerHTML);

            if ((roul || tot || fight)) {
                if (fight) {
                    this.total += +/Выигрыш в боях: <b>\$([^<]*)/i.
                            exec(this.target.innerHTML)[1].replace(/,/g, '');
                }

                var str = '<hr><table>';
                if (roul) {
                    str += this.getStrGameRez(roul, 'Рулетка', false);
                }

                if (tot) {
                    str += this.getStrGameRez(tot, 'Тотализатор', false);
                }

                str += this.getStrGameRez(this.total, 'Всего', true);

                if (fight) {
                    str += '<tr><td colspan="2" style="font-size: 10px;">' +
                        '(с учетом выигрыша в боях)</td></tr>';
                }

                str += '</table>';

                var div = general.doc.createElement('div');
                div.innerHTML = str;
                this.target.appendChild(div);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class GosEnergoAtomFilter {{{1
     * @constructor
     */
    var GosEnergoAtomFilter = function () {
        /**
         * @property trs
         * @type {NodeList|null}
         */
        this.trs = null;

        /**
         * @method sortGosEnergoAtomBySynd {{{2
         */
        this.sortGosEnergoAtomBySynd = function () {
            var prnt = this.trs[0].parentNode,
                objs = {},
                syndID,
                i;

            for (i = 1; i < this.trs.length; i++) {
                syndID = /\/syndicate\.php\?id=(\d+)/.
                    exec(this.trs[i].innerHTML);
                syndID = syndID ? syndID[1] : 0;
                if (!objs[syndID]) {
                    objs[syndID] = [];
                }

                objs[syndID].push(this.trs[i].cloneNode(true));
                prnt.removeChild(this.trs[i]);
            }

            var synd, opt;
            for (synd in objs) {
                if (objs.hasOwnProperty(synd)) {
                    for (i = 0; i < objs[synd].length; i++) {
                        prnt.appendChild(objs[synd][i]);
                    }

                    opt = general.doc.createElement('option');
                    opt.value = synd;
                    opt.innerHTML = +synd ? '#' + synd : 'Ничейки';
                    general.$('selectSynd').appendChild(opt);
                }
            }

            this.getTrsTable();
        }; // 2}}}

        /**
         * @method resetGosEnergoAtom {{{2
         */
        this.resetGosEnergoAtom = function () {
            var i;

            for (i = 1; i < this.trs.length; i++) {
                this.trs[i].style.display = '';
            }
        }; // 2}}}

        /**
         * @method sortGosEnergoAtom {{{2
         */
        this.sortGosEnergoAtom = function () {
            var stData = general.getData(17),
                val1 = stData[0],
                val2 = stData[1],
                val3 = stData[2],
                i;

            this.resetGosEnergoAtom();
            if (!val1 && !val2 && !val3) {
                return;
            }

            switch (val2) {
            case '1':
                val2 = 'Электростанция';
                break;

            case '2':
                val2 = 'Урановый рудник';
                break;

            case '3':
                val2 = 'Урановый рудник [2]';
                break;

            case '4':
                val2 = 'Урановый рудник [3]';
                break;

            default:
                val2 = false;
                break;
            }

            for (i = 1; i < this.trs.length; i++) {
                if (val1 && this.trs[i].innerHTML.
                        indexOf('[' + val1 + ']') === -1) {
                    this.trs[i].style.display = 'none';
                }

                if (val2 && this.trs[i].innerText.indexOf(val2) === -1) {
                    this.trs[i].style.display = 'none';
                }

                if (val3) {
                    // noinspection JSRemoveUnnecessaryParentheses
                    if ((val3 === '0' && /\/syndicate\.php\?id=\d+/.
                            test(this.trs[i].innerHTML)) ||
                                (+val3 && this.trs[i].innerHTML.
                                    indexOf('/img/synds/' + val3 +
                                        '.gif') === -1)) {
                        this.trs[i].style.display = 'none';
                    }
                }
            }
        }; // 2}}}

        /**
         * @method selectChangeHandler {{{2
         * @param    {Object}   sel
         */
        this.selectChangeHandler = function (sel) {
            var stData = general.getData(17),
                stInd = sel.id === 'selectIsland' ? 0 :
                            (sel.id === 'selectObject' ? 1 : 2),
                val = sel.value;

            stData[stInd] = stInd !== 2 ? (val === '0' ? '' : val) :
                    (val === 'all' ? '' : val);
            general.setData(stData, 17);
            this.sortGosEnergoAtom();
        }; // 2}}}

        // noinspection FunctionWithInconsistentReturnsJS
        /**
         * @method getTrsTable {{{2
         * @return  {Array}
         */
        this.getTrsTable = function () {
            this.trs = general.doc.querySelector('table.withborders' +
                    '[cellpadding="5"][cellspacing="1"]').
                            querySelectorAll('tr');
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var divSort = general.doc.createElement('div');
            divSort.setAttribute('style', 'position: absolute; top: 100px; ' +
                    'left: 20px;');
            divSort.innerHTML = '<table><tr><td>Остров:</td>' +
                '<td><select id="selectIsland"><option value="0">Все</option>' +
                '<option value="Z">[Z]</option><option value="G">[G]</option>' +
                '<option value="S">[S]</option></select></td></tr>' +
                '<tr><td>Объект:</td><td><select id="selectObject" ' +
                'style="margin-top: 5px;"><option value="0">Все</option>' +
                '<option value="1">ЭС</option><option value="2">Уран</option>' +
                '<option value="3">Уран [2]</option><option value="4">' +
                'Уран [3]</option></select></td></tr><tr><td>Синдикат:</td>' +
                '<td><select id="selectSynd" style="margin-top: 5px;">' +
                '<option value="all">Все</option></select></td></tr></table>';
            general.doc.body.appendChild(divSort);

            var stData = general.getData(17),
                _this = this;

            var isl = general.$('selectIsland');
            isl.addEventListener('change', function () {
                _this.selectChangeHandler(this);
            }, false);

            var obj = general.$('selectObject');
            obj.addEventListener('change', function () {
                _this.selectChangeHandler(this);
            }, false);

            var synd = general.$('selectSynd');
            synd.addEventListener('change', function () {
                _this.selectChangeHandler(this);
            }, false);

            this.getTrsTable();
            this.sortGosEnergoAtomBySynd();

            isl.value = stData[0] || '0';
            obj.value = stData[1] || '0';
            synd.value = stData[2] || 'all';
            this.sortGosEnergoAtom();
        }; // 2}}}
    }; // 1}}}

    /**
     * @class SortSyndOnline {{{1
     * @constructor
     */
    var SortSyndOnline = function () {
        /**
         * @property mainTable
         * @type {Object|null}
         */
        this.mainTable = general.doc.querySelector('table[width="600"]' +
                '[align="center"][cellspacing="0"][cellpadding="0"]');

        /**
         * @method sortBattles {{{2
         */
        this.sortBattles = function () {
            var trs = this.mainTable.querySelectorAll('tr'),
                reg = /\/warlog\.php\?bid=(\d+)/,
                battles = {},
                bid,
                i;

            for (i = 1; i < trs.length; i++) {
                bid = reg.exec(trs[i].innerHTML);
                // alert(trs[i].innerHTML);
                if (/<b>(\s?|&nbsp;)?\d+(\s?|&nbsp;)?<\/b>$/.
                        test(trs[i].firstElementChild.innerHTML) &&
                            bid) {
                    if (!battles[bid[1]]) {
                        battles[bid[1]] = [];
                    }

                    battles[bid[1]].push(trs[i].cloneNode(true));
                    trs[i].parentNode.removeChild(trs[i]);
                }
            }

            var target = this.mainTable.querySelector('tr'),
                tr = general.doc.createElement('tr');

            tr.innerHTML = '<td><table class="bordersupdown" width="100%" ' +
                'cellspacing="1" cellpadding="4" align="center" ' +
                'style="margin-bottom: 15px;"><tbody></tbody></table></td>';
            target.parentNode.insertBefore(tr, target);
            target = tr.querySelector('tbody');

            // ссылки на идущие синдикатные бои (таблица внизу страницы)
            var syndBattles = general.doc.
                    querySelectorAll('td[class="greengreenbg"][valign="top"]>' +
                        'a[href*="/warlog.php?bid="]'),
                countBattles = 1,
                color,
                btl;

            for (btl in battles) {
                if (battles.hasOwnProperty(btl)) {
                    color = '';
                    for (i = 0; i < syndBattles.length; i++) {
                        // если бой синдикатный, выделяем зеленым цветом
                        if (btl === reg.exec(syndBattles[i].href)[1]) {
                            color = ' style="color: #00AA00;"';
                            break;
                        }
                    }

                    tr = general.doc.createElement('tr');
                    tr.innerHTML = '<td colspan="8" class="greenbg" ' +
                        'style="text-align: center; font-weight: bold;">' +
                        '<span' + color + '>Бой: ' + countBattles +
                        '</span></td>';
                    target.appendChild(tr);

                    for (i = 0; i < battles[btl].length; i++) {
                        target.appendChild(battles[btl][i]);
                    }

                    countBattles++;
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (/&page=online$/.test(general.loc) && this.mainTable &&
                    this.mainTable.
                        querySelector('td>a[href*="/warlog.php?bid="]>' +
                            'img[src*="/i/icons/"]')) {
                this.sortBattles();
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class HousHealth {{{1
     * @constructor
     */
    var HousHealth = function () {
        /**
         * @method showSector {{{2
         * @param   {String}    url
         * @param   {string}    sector
         */
        this.showSector = function (url, sector) {
            var _this = this;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span'),
                    cssSelector;

                spanContent.innerHTML = xml.responseText;

                if (!sector) {    // ищем сектор перса
                    cssSelector = 'b+a[href*="/map.php?s"]';
                    sector = spanContent.querySelector(cssSelector).innerHTML;
                    general.root.setTimeout(function () {
                        // на недвижимость перса
                        _this.showSector('https://' + general.domain +
                            '/info.realty.php?id=' + general.myID, sector);
                    }, 1000);
                } else {
                    cssSelector = 'table.withborders';
                    var table = spanContent.querySelector(cssSelector);

                    if (table) {
                        var trs = table.querySelectorAll('tr'),
                            td,
                            i;

                        for (i = 1; i < trs.length; i++) {
                            td = trs[i].firstElementChild;
                            if (/Частный дом/.test(td.innerHTML) &&
                                    td.nextElementSibling.innerHTML.
                                        indexOf(sector) !== -1) {
                                return;
                            }
                        }
                    }

                    alert('Вы находитесь не в секторе с домиком !');
                }
            }, function () {
                general.root.setTimeout(function () {
                    _this.showSector(url, sector);
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (/b0/.test(general.loc)) {
                general.setData('1', 19);
                return;
            }

            if (general.getData(19)[0]) {
                general.setData('', 19);

                // если здоровье менее 80%
                if (general.doc.querySelector('#hpheader>font')) {
                    this.showSector('https://' + general.domain +
                        '/info.php?id=' + general.myID, '');
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class LinksInOne2One {{{1
     * @constructor
     */
    var LinksInOne2One = function () {
        /**
         * @method init {{{2
         */
        this.init = function () {
            var table = general.doc.querySelector('td[class="txt"]>' +
                    'table[border="0"][cellpadding="5"][cellspacing="1"]');

            if (table) {
                var trs = table.querySelectorAll('tr'),
                    last,
                    name,
                    i;

                for (i = 0; i < trs.length; i++) {
                    last = trs[i].lastElementChild;
                    name = /вызван (.*)( \[\d+\])/.exec(last.innerHTML);
                    if (name) {
                        last.innerHTML = 'вызван <a target="_blank" ' +
                            'href="https://' + general.domain +
                            '/search.php?key=' + name[1] +
                            '" style="text-decoration: none; ' +
                            'font-weight: bold;">' + name[1] + '</a>' + name[2];
                    }
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class One2OneCallerInfo {{{1
     * @constructor
     */
    var One2OneCallerInfo = function () {
        /**
         * @property weapon
         * @type {Node|null}
         */
        this.weapon = null;
        /**
         * @property twoHand
         * @type {Boolean}
         */
        this.twoHand = false;

        /**
         * @method getRange {{{2
         * @param   {int}       ind
         * @param   {string}    str
         */
        this.getRange = function (ind, str) {
            var _this = this,
                a = _this.weapon.querySelectorAll('a'),
                url = a[ind].href,
                range;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                range = /стрельбы: (\d+) ходов/i.exec(xml.responseText);
                str += range ? range[1] : 'не найдена';

                if (!_this.twoHand || ind || a[1].href === url) {
                    var div = general.doc.createElement('div');
                    div.setAttribute('style', 'color: #0000FF; ' +
                        'font-weight: bold;');
                    div.innerHTML = str;
                    _this.weapon.appendChild(div);
                } else {
                    str += ', ';
                    general.root.setTimeout(function () {
                        _this.getRange(1, str);
                    }, 1000);
                }
            }, function () {
                general.root.setTimeout(function () {
                    _this.getRange(ind, str);
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var called = general.doc.querySelector('td[class="greengreenbg"]' +
                    '[colspan="2"]>center>b>a[href*="/info.php?id="]');

            if (!called) {
                return;
            }

            general.doc.title = 'БОЙ !!!';
            new PlaySound().init(general.getData(21)[0]);

            var url = called.href,
                _this = this;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span'),
                    spanHp = general.doc.createElement('span');

                spanContent.innerHTML = xml.responseText;
                // здоровье
                spanHp.innerHTML = /\[(\d+) \/ (\d+)\]/.exec(spanContent.
                    querySelector('td[style="padding-top:3px;"]').innerHTML)[0];
                spanHp.setAttribute('style', 'color: #990000; ' +
                    'margin-left: 5px;');
                called.parentNode.appendChild(spanHp);

                // узел td с изображениями на оружие
                _this.weapon = spanContent.
                    querySelector('table[style="margin-right:1px;"]').
                        parentNode;
                general.doc.querySelector('table[style="padding-top:10px;"]' +
                    '[border="0"][cellspacing="1"][cellpadding="5"]' +
                        '[width="450"]').removeAttribute('width');
                _this.weapon.removeAttribute('rowspan');
                _this.weapon.firstElementChild.removeAttribute('align');
                var target = general.doc.
                        querySelector('td[class="greengreenbg"][colspan="2"]');
                target.parentNode.appendChild(_this.weapon);

                // раскрашиваем умелку
                target.innerHTML = target.innerHTML.replace(/(\(\d+\))/g,
                    '<span style="color: #00C000;">$1</span>');

                // две руки
                _this.twoHand = /Левая/.test(target.innerHTML) &&
                    /Правая/.test(target.innerHTML);

                // узел td со списком умелок
                var cssSelector = 'tr>td+td[align="right"][valign="top"]',
                    skills = spanContent.querySelectorAll(cssSelector)[2];
                skills.setAttribute('colspan', '2');
                var tr = general.doc.createElement('tr');
                tr.appendChild(skills);
                target = target.parentNode.parentNode;
                target.insertBefore(tr, target.lastElementChild);

                // узел td со списком бонусов
                var bonuses = spanContent.
                        querySelectorAll('td[align="center"][valign="top"]')[2];
                tr.appendChild(bonuses);

                // дальность оружия
                general.root.setTimeout(function () {
                    _this.getRange(0, 'Дальность оружия: ');
                }, 1000);
            }, function () {
                general.cons.log('Error xhr on One2OneCallerInfo');
            });
        }; // 2}}}
    }; // 1}}}

    /**
     * @class PortsAndTerminals {{{1
     * @constructor
     */
    var PortsAndTerminals = function () {
        /**
         * @property sectors {{{2
         * @type {Array}
         */
        this.sectors = [
            '50&sy=47|', '47&sy=49|', '49&sy=49|1', '51&sy=49|1',
            '53&sy=49|1', '48&sy=50|1', '50&sy=50|1', '52&sy=50|2',
            '49&sy=51|1', '53&sy=51|1', '47&sy=52|', '50&sy=52|1',
            '48&sy=53|1', '49&sy=53|', '53&sy=53|', '152&sy=148|',
            '149&sy=149|', '152&sy=149|1', '150&sy=150|1', '151&sy=150|',
            '149&sy=152|', '151&sy=152|2'
        ]; // 2}}}
        /**
         * @property imgPath
         * @type {String}
         */
        this.imgPath = general.imgPath + 'PortsAndTerminals/';

        /**
         * @method  createDiv
         * @param   {Object}   pos
         * @param   {String}   img
         * @param   {int}      shiftX
         */
        this.createDiv = function (pos, img, shiftX) {
            var div = general.doc.createElement('div');
            div.setAttribute('style', 'position: absolute; z-index: 999;');
            div.style.left = pos.x + shiftX;
            div.style.top = pos.y + 3;
            div.innerHTML = '<img src="' + this.imgPath + img +
                '" alt="img" />';
            general.doc.body.appendChild(div);
        };

        /**
         * @method init {{{2
         */
        this.init = function () {
            var cells = general.doc.
                    querySelectorAll('a[href*="/map.php?sx="]>img'),
                getPos = new GetPos().init,
                coord,
                tmp,
                j,
                i;

            for (i = 0; i < cells.length; i++) {
                // noinspection JSUnresolvedVariable
                coord = /\d+&sy=\d+/.exec(cells[i].parentNode.href)[0];
                for (j = 0; j < this.sectors.length; j++) {
                    tmp = this.sectors[j].split('|');
                    if (coord === tmp[0]) {
                        if (!tmp[1]) {
                            // порт
                            this.createDiv(getPos(cells[i]), 'anchor.png', 3);
                        } else if (tmp[1] === '1') {
                            // терминал
                            this.createDiv(getPos(cells[i]), 'coins.png', 3);
                        } else {
                            // порт + терминал
                            this.createDiv(getPos(cells[i]), 'anchor.png', 3);
                            this.createDiv(getPos(cells[i]), 'coins.png', 22);
                        }
                    }
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class RangeWeapon {{{1
     * @constructor
     */
    var RangeWeapon = function () {
        /**
         * @property equipment
         * @type {HTMLTableElement}
         */
        this.equipment = general.doc.querySelector('td[colspan="2"]>' +
                'table[border="0"][cellspacing="0"][cellpadding="0"]');
        /**
         * @property weapon
         * @type {Array|null}
         */
        this.weapon = null;
        /**
         * @property range
         * @type {Array}
         */
        this.range = [];

        /**
         * @method setRange {{{2
         * @param   {Object}    target
         * @param   {int}       ind
         */
        this.setRange = function (target, ind) {
            var targt = target[ind].nodeName === 'B' ?
                            target[ind] : target[ind].parentNode;
            targt.innerHTML += '<span style="color: #0000FF; ' +
                    'margin-left: 5px; font-weight: bold;">[' +
                    this.range[ind] + ']</span>';
        }; // 2}}}

        /**
         * @method showRange {{{2
         */
        this.showRange = function () {
            var a  = this.equipment.
                        querySelectorAll('a[style*="font-weight:bold;"]'),
                b = this.equipment.querySelectorAll('b'),
                target = a.length ? a : b,
                i;

            for (i = 0; i < this.range.length; i++) {
                this.setRange(target, i);
            }
        }; // 2}}}

        /**
         * @method getRange {{{2
         * @param   {int}   ind
         */
        this.getRange = function (ind) {
            var url = this.weapon[ind],
                _this = this;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var reg = /Дальность стрельбы: (\d+) ход/i;

                _this.range.push(reg.test(xml.responseText) ?
                                    reg.exec(xml.responseText)[1] : '-');

                ind++;
                if (_this.weapon[ind] &&
                        // в правой и левой руке разное оружие
                        _this.weapon[ind - 1] !== _this.weapon[ind]) {
                    general.root.setTimeout(function () {
                        _this.getRange(ind);
                    }, 1000);
                } else {
                    if (_this.weapon[ind]) {
                        _this.range.push(_this.range[0]);
                    }
                    _this.showRange();
                }

            }, function () {
                general.root.setTimeout(function () {
                    _this.getRange(ind);
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (this.equipment &&
                    /(Левая|Правая) рука/.test(this.equipment.innerHTML)) {
                var css = 'td[valign="top"]>a[href*="/item.php?item_id="]',
                    txt = this.equipment.innerHTML;

                this.weapon = this.equipment.querySelectorAll(css);
                if (/Левая/.test(txt) && /Правая/.test(txt)) {
                    this.weapon = [this.weapon[0].href, this.weapon[1].href];
                } else {
                    this.weapon = [this.weapon[0].href];
                }

                this.getRange(0);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class RentAndSale {{{1
     * @constructor
     */
    var RentAndSale = function () {
        /**
         * @method changeColor {{{2
         */
        this.changeColor = function () {
            var td = general.doc.querySelector('td[valign="top"]+' +
                    'td.greengraybg[align="left"]');

            if (td) {
                var _this = this,
                    color = _this.id === 'donotsend' ? '#E0EEE0' :
                                _this.id === 'send1' ? '#FB8F8F' : '#95CCF6';

                td.style.background = color;
                td.previousElementSibling.style.background = color;
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var radio = general.doc.querySelectorAll('input[name="sendtype"]');

            if (radio.length) {
                var scrpt = general.doc.createElement('script');
                scrpt.innerHTML = 'function checkPrice(){if(document.' +
                        'getElementById("for_money_id").value=="0"){' +
                        'if(!confirm("Указана цена 0 Гб !!! Продолжить?"))' +
                        'return false;}return true;}';
                general.doc.querySelector('head').appendChild(scrpt);

                general.doc.querySelector('form[action="/home.senditem.php"]').
                    setAttribute('onsubmit', 'return checkPrice();');

                var i;
                for (i = 0; i < radio.length; i++) {
                    radio[i].addEventListener('click', this.changeColor, false);
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ScanKarma {{{1
     * @constructor
     */
    var ScanKarma = function () {
        /**
         * @method init {{{2
         */
        this.init = function () {
            if (/\?id=(\d+)/.exec(general.loc)[1] === general.myID) {
                var karma = /Карма:\s\d+\.?\d*\s\((\d+\/\d+)\)/i.
                        exec(general.doc.body.textContent);

                if (karma) {
                    karma = karma[1];
                    if (!general.getData(23)[0]) {
                        general.setData(karma, 23);
                        return;
                    }

                    var oldKarma = general.getData(23)[0];
                    if (karma === oldKarma) {
                        return;
                    }

                    general.setData(karma, 23);

                    oldKarma = oldKarma.split('/');
                    oldKarma[0] = +oldKarma[0];
                    oldKarma[1] = +oldKarma[1];

                    karma = karma.split('/');
                    karma[0] = +karma[0];
                    karma[1] = +karma[1];

                    var str = 'Ваша карма была изменена \n\n';
                    if (karma[0] > oldKarma[0]) {
                        str += 'Отрицательная карма увеличилась на ' +
                            (karma[0] - oldKarma[0]) + ' (' + oldKarma[0] +
                            ' ---> ' + karma[0] + ')\n';
                    } else if (karma[0] < oldKarma[0]) {
                        str += 'Отрицательная карма уменьшилась на ' +
                            (oldKarma[0] - karma[0]) + ' (' + oldKarma[0] +
                            ' ---> ' + karma[0] + ')\n';
                    }

                    if (karma[1] > oldKarma[1]) {
                        str += 'Положительная карма увеличилась на ' +
                            (karma[1] - oldKarma[1]) +  ' (' + oldKarma[1] +
                            ' ---> ' + karma[1] + ')';
                    } else if (karma[1] < oldKarma[1]) {
                        str += 'Положительная карма уменьшилась на ' +
                            (oldKarma[1] - karma[1]) +  ' (' + oldKarma[1] +
                            ' ---> ' + karma[1] + ')';
                    }

                    alert(str);
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ScanPers {{{1
     * @constructor
     */
    var ScanPers = function () {
        /**
         * @property interval
         * @type {int}
         */
        this.interval = 7;
        /**
         * @property spanContent
         * @type {Element|null}
         */
        this.spanContent = general.doc.createElement('span');
        /**
         * @property ajax
         * @type {Function}
         */
        this.ajax = new AjaxQuery().init;
        /**
         * @property playSound
         * @type {Function}
         */
        this.playSound = new PlaySound().init;

        /**
         * @method showSettings {{{2
         */
        this.showSettings = function () {
            return function () {
                var settings = general.$('spSettings'),
                    vis = settings.style.visibility,
                    pos = new GetPos().init(this);

                settings.style.top = (pos.y + 25).toString();
                settings.style.left = (pos.x - 80).toString();
                settings.style.visibility = vis === 'hidden' ?
                        'visible' : 'hidden';
            };
        }; // 2}}}

        /**
         * @method changeSelect {{{2
         * @param   {int}   ind
         */
        this.changeSelect = function (ind) {
            return function () {
                var stData = general.getData(24);
                stData[ind] = this.value !== '0' ? this.value : '';
                general.setData(stData, 24);
            };
        }; // 2}}}

        /**
         * @method listenSound {{{2
         */
        this.listenSound = function () {
            var _this = this;
            return function () {
                _this.playSound(this.previousElementSibling.value);
            };
        }; // 2}}}

        /**
         * @method showHideLink {{{2
         */
        this.showHideLink = function () {
            var stData = general.getData(24),
                persID = stData[0],
                tdLink = general.$('spPersLink'),
                butReset = general.$('spReset'),
                butSave = general.$('spSave');

            if (persID) {
                tdLink.innerHTML = '<a target="_blank" ' +
                    'style="color: #008000;" href="https://' + general.domain +
                    '/info.php?id=' + persID + '">' + stData[7] + '</a>';
                tdLink.style.display = '';
                butReset.disabled = false;
                butSave.disabled = true;
            } else {
                tdLink.style.display = 'none';
                butReset.disabled = true;
                butSave.disabled = false;
            }
        }; // 2}}}

        /**
         * @method scan {{{2
         */
        this.scan = function () {
            var stData = general.getData(24),
                url = 'https://' + general.domain + '/syndicate.php?id=' +
                    stData[1] + '&page=online',
                _this = this;

            this.ajax(url, 'GET', null, true, function (xml) {
                _this.spanContent.innerHTML = xml.responseText;
                var pers = _this.getPers(stData[0]);

                // в игре
                if (pers && !stData[6]) {
                    _this.playSound(stData[4]);
                    stData[6] = '1';
                    general.setData(stData, 24);

                    if (stData[3]) {
                        alert('Персонаж ' + stData[7] + ' в игре');
                    }
                }

                // вышел
                if (!pers && stData[6]) {
                    _this.playSound(stData[5]);
                    stData[6] = '';
                    general.setData(stData, 24);

                    if (stData[3]) {
                        alert('Персонаж ' + stData[7] + ' вышел из игры');
                    }
                }
            }, function () {
                general.root.setTimeout(function () {
                    _this.scan();
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method start {{{2
         */
        this.start = function () {
            var _this = this;
            general.root.setInterval(function () {
                var stData = general.getData(24),
                    lastQuery = +stData[8],
                    now = new Date().getTime();
                if (stData[0] && now - lastQuery > _this.interval * 1000) {
                    stData[8] = now;
                    general.setData(stData, 24);
                    _this.scan();
                }
            }, Math.round(this.interval * 1000 + 3000 * Math.random()));
        }; // 2}}}

        /**
         * @method getPers {{{2
         * @param   {String}    id
         * @return  {Element|null}
         */
        this.getPers = function (id) {
            var css1 = 'center+br+table[align="center"]',
                css2 = 'center+br+script+table[align="center"]',
                table = this.spanContent.querySelector(css1) ||
                            this.spanContent.querySelector(css2);

            css1 = 'a[href$="/info.php?id=' + id + '"]>b';
            return table ? table.querySelector(css1) : null;
        }; // 2}}}

        /**
         * @method saveData {{{2
         */
        this.saveData = function () {
            var reg = /^\d+$/,
                persID = general.$('spID').value,
                syndID = general.$('spSyndID').value,
                str;

            if (!reg.test(persID)) {
                str = 'персонажа';
            } else if (!reg.test(syndID)) {
                str = 'синдиката';
            }

            if (str) {
                alert('Не верно введен ID ' + str);
                return;
            }

            var preloader = general.$('spPreloader'),
                url = 'https://' + general.domain + '/syndicate.php?id=' +
                    syndID + '&page=members',
                _this = this;

            preloader.style.visibility = 'visible';
            this.ajax(url, 'GET', null, true, function (xml) {
                _this.spanContent.innerHTML = xml.responseText;
                var pers = _this.getPers(persID);

                if (!pers) {
                    alert('Персонаж с ID ' + persID + ' в синдикате #' +
                        syndID + ' не найден');
                    preloader.style.visibility = 'hidden';
                    return;
                }

                var stData = general.getData(24);
                stData[0] = persID;
                stData[1] = syndID;
                stData[7] = pers.innerHTML;
                stData[8] = '';
                general.setData(stData, 24);

                _this.showHideLink();
                preloader.style.visibility = 'hidden';

                _this.start();
            }, function () {
                general.root.setTimeout(function () {
                    _this.saveData();
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var topPanel = new GetTopPanel().init();
            if (!topPanel) {
                return;
            }

            var stData = general.getData(24);
            // совместимость с прошлыми версиями
            if (stData[0] && !/^\d+$/.test(stData[0])) {
                stData = ['', '', '', '', '', '', '', '', ''];
                general.setData(stData, 24);
            }

            // кнопка настроек
            var scanPersBut = general.doc.createElement('span');
            scanPersBut.setAttribute('style', 'cursor: pointer;');
            scanPersBut.innerHTML = 'ScanPers';
            topPanel.appendChild(general.doc.createTextNode(' | '));
            topPanel.appendChild(scanPersBut);
            scanPersBut.addEventListener('click', this.showSettings(), false);

            // окно настроек
            var scanPersSettings = general.doc.createElement('div');
            scanPersSettings.setAttribute('id', 'spSettings');
            scanPersSettings.setAttribute('style', 'visibility: hidden; ' +
                'position: absolute; padding: 3px; border: solid 1px #339933;' +
                ' background: #D7F4D8; border-radius: 4px; box-shadow: ' +
                '5px 6px 6px rgba(122,122,122,0.5); z-index: 999;');

            var getSelectSound = new GetSelectSound().init;
            scanPersSettings.innerHTML = '<table>' +
                '<tr>' +
                    '<td>ID персонажа:</td>' +
                    '<td><input id="spID" value="" size="10" maxlength="7" ' +
                    'style="border: solid 1px #339933;"></td></tr>' +
                '<tr>' +
                    '<td>ID синдиката:</td>' +
                    '<td><input id="spSyndID" size="10" maxlength="5" ' +
                        'value="" style="border: solid 1px #339933;">' +
                    '</td></tr>' +
                '<tr>' +
                    '<td colspan="2">' +
                        '<input id="spChkSound" type="checkbox">' +
                        '<label for="spChkSound"> Проигрывать звук при:' +
                        '</label></td></tr>' +
                '<tr>' +
                    '<td colspan="2">входе&nbsp;&nbsp;&nbsp;&nbsp;' +
                        getSelectSound('spSound1') + '<br>' +
                    'выходе ' + getSelectSound('spSound2') + '</td></tr>' +
                '<tr>' +
                    '<td colspan="2">' +
                        '<input id="spChkAllert" type="checkbox">' +
                        '<label for="spChkAllert"> Выдавать сообщение' +
                        '</label></td></tr>' +
                '<tr>' +
                    '<td colspan="2" style="text-align: center;">' +
                        '<input type="button" id="spSave" value="Сохранить">' +
                        '<img id="spPreloader" src="' + general.imgPath +
                        'preloader.gif" style="margin-left: 10px; ' +
                        'visibility: hidden;" alt="img" />' +
                        '<input type="button" id="spReset" value="Сброс" ' +
                        'style="margin-left: 20px;"></td></tr>' +
                '<tr>' +
                    '<td id="spPersLink" colspan="2" style="text-align: ' +
                        'center; display: none;"></td></tr>' +
                '</table>';
            general.doc.body.appendChild(scanPersSettings);

            // ID перса и синда
            var inpPersID = general.$('spID'),
                inpSyndID = general.$('spSyndID');

            if (stData[0]) {
                inpPersID.value = stData[0];
                inpSyndID.value = stData[1];
            }

            // звук
            var chkSound = general.$('spChkSound'),
                sel1 = general.$('spSound1'),
                sel2 = general.$('spSound2'),
                listen1 = general.$('lspSound1'),
                listen2 = general.$('lspSound2');

            if (stData[2]) {
                sel1.disabled = false;
                sel2.disabled = false;
                listen1.disabled = false;
                listen2.disabled = false;
            }

            chkSound.checked = !!stData[2];
            chkSound.addEventListener('click', function () {
                var data = general.getData(24),
                    _this = this;

                sel1.disabled = !_this.checked;
                sel2.disabled = !_this.checked;
                listen1.disabled = !_this.checked;
                listen2.disabled = !_this.checked;
                data[2] = _this.checked ? '1' : '';
                general.setData(data, 24);
            }, false);

            sel1.value = stData[4] || '0';
            sel2.value = stData[5] || '0';
            sel1.addEventListener('change', this.changeSelect(4), false);
            sel2.addEventListener('change', this.changeSelect(5), false);

            // кнопки проигрывания звука
            listen1.addEventListener('click', this.listenSound(listen1), false);
            listen2.addEventListener('click', this.listenSound(listen2), false);

            // чекбокс "Выдавать сообщение"
            var chkAllert = general.$('spChkAllert');
            chkAllert.checked = !!stData[3];
            chkAllert.addEventListener('click', function () {
                var data = general.getData(24),
                    _this = this;
                data[3] = _this.checked ? '1' : '';
                general.setData(data, 24);
            });

            // кнопка сброса
            var _this = this;
            general.$('spReset').addEventListener('click', function () {
                if (confirm('Сбросить данные?')) {
                    var data = general.getData(24);
                    data[0] = '';
                    data[1] = '';
                    data[6] = '';
                    data[7] = '';
                    data[8] = '';
                    general.setData(data, 24);
                    inpPersID.value = '';
                    inpSyndID.value = '';
                    _this.showHideLink();
                }
            }, false);

            // кнопка сохранения данных
            var spSave = general.$('spSave');
            spSave.addEventListener('click', function () {
                _this.saveData();
            }, false);

            // нажатие <Enter> в полях ввода
            inpPersID.addEventListener('keypress', function (e) {
                var ev = e || general.root.event;
                if (ev.keyCode === 13 || ev.keyCode === 10) {
                    spSave.click();
                }
            }, false);

            inpSyndID.addEventListener('keypress', function (e) {
                var ev = e || general.root.event;
                if (ev.keyCode === 13 || ev.keyCode === 10) {
                    spSave.click();
                }
            }, false);

            this.showHideLink();
            this.start();
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ShowInitMessOnForum {{{1
     * @constructor
     */
    var ShowInitMessOnForum = function () {
        /**
         * @property pageNum
         * @type {int}
         */
        this.pageNum = 0;
        /**
         * @property messages
         * @type {Array|null}
         */
        this.messages = null;

        /**
         * @method getMessagesOnPages {{{2
         * @param   {Object}    obj
         * @return  {NodeList}
         */
        this.getMessagesOnPages = function (obj) {
            return obj.querySelectorAll('td>table[cellpadding="5"]' +
                    '[cellspacing="0"][border="0"]');
        }; // 2}}}

        /**
         * @method insertMess {{{2
         * @param   {Element}  target
         * @param   {Element}  last
         */
        this.insertMess = function (target, last) {
            target = target.querySelector('tr');
            target.firstElementChild.
                setAttribute('style', 'padding-left: 20px;');

            // noinspection JSUnresolvedVariable
            var author = last.parentNode.previousElementSibling.
                    querySelector('b').innerHTML,
                lastLink = last.previousElementSibling.querySelector('a').href,
                tr = last.querySelector('tr:last-child').cloneNode(true),
                divMess = tr.querySelector('td>div[style$="overflow:hidden;"]'),
                messComplete = divMess.innerHTML,
                // если длина сообщения более 400 символов или в сообщении
                // более 3 переносов строк ('<br>'), то выводим половину
                // сообщения если его длина менее 400 или только первые 200
                // символов если его длина более 400 символов
                longMess = messComplete.length > 400 ||
                    divMess.querySelectorAll('br').length > 3,
                messHeader = author + '&nbsp;&nbsp;&nbsp;<a href="' + lastLink +
                    '">[&#8593;]</a><br>';

            // noinspection JSUnresolvedFunction
            divMess.parentNode.setAttribute('style', 'border: 1px dashed ' +
                '#339933; background: #C2EDC1;');
            // noinspection HtmlUnknownAttribute
            divMess.innerHTML = messHeader +
                (!longMess ? messComplete :
                        (messComplete.length > 400 ?
                                messComplete.substring(0, 200) : messComplete.
                            substring(0, Math.round(messComplete.length / 2))).
                            // убираем тэги <br> в конце сокращенного сообщения
                            replace(/\s*(<b?r?\s*\/?>?\s*)*$/, '').
                            // убираем незавершенную ссылку
                            replace(/<a href=[^>]+(>(https?|ftp):\/\/.*)?$/,
                                '') +
                        ' ...[<span style="text-decoration: underline; ' +
                        'color: #007700; cursor: pointer;" name="openMess">' +
                        'развернуть</span>]');
            target.parentNode.insertBefore(tr, target);

            if (longMess) {
                var openLink = divMess.querySelector('span[name="openMess"]');
                if (openLink) {
                    openLink.addEventListener('click', function () {
                        divMess.innerHTML = messHeader + messComplete;
                    }, false);
                }
            }
        }; // 2}}}

        /**
         * @method parseMessages {{{2
         * @param   {int}   ind
         */
        this.parseMessages = function (ind) {
            if (!this.messages[ind]) {
                return;
            }

            var messDiv = this.messages[ind].querySelector('div');
            if (!messDiv) {
                ind++;
                this.parseMessages(ind);
                return;
            }

            var reg = /^\s*\+?\s*(\d+)(,\D+|\.\D+|\)|\s|:|\+\D+)/,
                numReply = reg.exec(messDiv.innerHTML);

            numReply = numReply ? +numReply[1] : 0;

            // нет номера/номер === 0 или число > текущего сообщения
            if (numReply < 1 || numReply >= this.pageNum * 20 + ind + 1) {
                ind++;
                this.parseMessages(ind);
                return;
            }

            // порядковый номер сообщения на странице, на которое отвечаем
            var sequenceNum = numReply < 21 ? numReply - 1 :
                    numReply % 20 !== 0 ? numReply % 20 - 1 : 19,
                // страница, где находится сообщение, на которое отвечаем
                // (на каждой странице 20 сообщений)
                pageReply = Math.floor((numReply - 1) / 20);

            // если сообщение, на которое отвечаем,
            // находится на текущей странице
            if (pageReply === this.pageNum) {
                this.insertMess(this.messages[ind], this.messages[sequenceNum]);
                ind++;
                this.parseMessages(ind);
            } else {
                var url = general.loc.replace(/&page_id=\d+(#\d+)?#?/g, '') +
                        '&page_id=' + pageReply,
                    _this = this;

                new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                    var spanContent = general.doc.createElement('span');
                    spanContent.innerHTML = xml.responseText;

                    var mess = _this.getMessagesOnPages(spanContent);
                    _this.insertMess(_this.messages[ind], mess[sequenceNum]);
                    ind++;
                    general.root.setTimeout(function () {
                        _this.parseMessages(ind);
                    }, 1000);
                }, function () {
                    general.root.setTimeout(function () {
                        _this.parseMessages(ind);
                    }, 1000);
                });
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (/&page_id=\d+/.exec(general.loc)) {
                this.pageNum = +/&page_id=(\d+)/.exec(general.loc)[1];
            } else if (/page_id=last/.test(general.loc)) {
                var num = general.doc.querySelector('td[style="cursor:' +
                        'pointer;"][class="greenlightbg"]');
                if (num) {
                    this.pageNum = +num.firstElementChild.innerHTML;
                }
            }

            this.messages = this.getMessagesOnPages(general.doc);
            this.parseMessages(0);
        }; // 2}}}
    }; // 1}}}

    /**
     * @class SearchUser {{{1
     * @constructor
     */
    var SearchUser = function () {
        /**
         * @method init {{{2
         */
        this.init = function () {
            var topPanel = new GetTopPanel().init();
            if (topPanel) {
                var td = general.doc.createElement('td');
                td.setAttribute('style', 'width: 130px;');
                td.innerHTML = '<form name="fsearch" id="fsearch" ' +
                    'method="GET" action="/search.php">' +
                    '<input id="skey" name="key" value="" ' +
                    'style="width: 130px;" ' +
                    'title="Введите ник и нажмите Enter" /></form>';
                topPanel = general.DESIGN_VERSION === 'v2' ?
                        topPanel.parentNode : topPanel.parentNode.parentNode;
                topPanel.appendChild(td);

                general.$('skey').addEventListener('keypress', function (e) {
                    var ev = e || general.root.event;
                    if (ev.keyCode === 13) {
                        general.$('fsearch').submit();
                    }
                }, false);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class SkillCounters {{{1
     * @constructor
     */
    var SkillCounters = function () {
        /**
         * @property counters
         * @type {NodeList}
         */
        this.counters = general.doc.querySelectorAll('td[valign="top"]' +
                '[bgcolor="#e9ffe9"]>div>table[border="0"] tr>td+td>nobr');
        /**
         * @property ids {{{2
         * @type {Array}
         */
        this.ids = [
            'cFighting', 'cEconomic', 'cProduction', 'cGuns', 'cGrenades',
            'cAuto', 'cHeavy', 'cShotguns', 'cSnipers'
        ]; // 2}}}
        /**
         * @property dataNow
         * @type {Array|null}
         */
        this.dataNow = null;

        /**
         * @method getHtime {{{2
         * @param   {int}   time
         * @return  {String}
         */
        this.getHtime = function (time) {
            var date = new Date(time),
                day = date.getDate(),
                str = '';

            str  += day < 10 ? '0' + day : day;
            str += '.';
            var month = date.getMonth() + 1;
            str += month < 10 ? '0' + month : month;
            str += '.';
            var year = /20(\d+)/.exec(date.getFullYear().toString())[1];
            str += year + ' ' + /(\d+:\d+):\d+/.exec(date.toString())[1];

            return str;
        }; // 2}}}

        /**
         * @method getValue {{{2
         * @param   {Element}   obj
         * @param   {int}       fix
         * @return  {String}
         */
        this.getValue = function (obj, fix) {
            return parseFloat(/\((\s?<span [^>]+>)?(\d+.?\d*)(\s?<\/span>)?\)/.
                exec(obj.innerHTML)[2]).toFixed(fix);
        }; // 2}}}

        /**
         * @method getDataNow {{{2
         * @param   {Boolean}   loadPage
         */
        this.getDataNow = function (loadPage) {
            var i;
            this.dataNow = [];
            for (i = 0; i < this.counters.length; i++) {
                this.dataNow.
                    push(this.getValue(this.counters[i], i < 3 ? 0 : 2));

                if (loadPage) {
                    this.counters[i].parentNode.parentNode.lastElementChild.
                        innerHTML = '<span id="' + this.ids[i] +
                        '" style="color: #FF0000; font-size: 9px;"></span>';
                }
            }

            var syndExp = general.doc.querySelector('span>b+nobr+nobr');
            if (syndExp && loadPage) {
                syndExp.innerHTML += '<span id="cSyndExp" ' +
                    'style="color: #FF0000; font-size: 9px;"></span> ' +
                    '<span id="syndLeftToLevel" style="font-size: 8px; ' +
                    'color: #696156;"></span>';
            }

            this.dataNow.push(syndExp ? this.getValue(syndExp, 0) : '');
            this.dataNow.push(new Date().getTime());
        }; // 2}}}

        /**
         * @method setLeftToLevel {{{2
         * @param   {int}   val
         */
        this.setLeftToLevel = function (val) {
            var syndLevels = [5, 15, 37, 76, 143, 200, 280, 500, 750, 1000,
                1250, 1600, 2200, 3000, 4500, 6000, 9000, 15000, 26394,
                34353, 44377, 56931, 72568, 91947, 115853, 145214, 181127,
                224882, 277996, 342247, 419713, 512821, 624395, 757716, 916591,
                1105426, 1329313, 1594124, 1906627, 2274598, 2723523, 3293658,
                4046236, 5077268, 6541333, 8693509, 11964817, 17100771,
                25421016, 40000000];

            var i;
            for (i = 0; i < syndLevels.length; i++) {
                if (val < syndLevels[i]) {
                    general.$('syndLeftToLevel').innerHTML = '[+' +
                        (syndLevels[i] - val) + ']';
                    break;
                }
            }
        }; // 2}}}

        /**
         * @method setCounters {{{2
         */
        this.setCounters = function () {
            var stData = general.getData(25),
                i;

            for (i = 0; i < this.counters.length; i++) {
                general.$(this.ids[i]).innerHTML = '[' +
                    (parseFloat(this.dataNow[i]) - parseFloat(stData[i])).
                        toFixed(i < 3 ? 0 : 2) + ']';
            }

            // синдовый уровень
            if (this.dataNow[9]) {
                // основной синдикат есть, а прошлого значения синдового нет
                if (!stData[9]) {
                    stData[9] = this.dataNow[9];
                    general.setData(stData, 25);
                }

                // noinspection JSRemoveUnnecessaryParentheses
                general.$('cSyndExp').innerHTML = '[' +
                    (+this.dataNow[9] - (+stData[9])) + ']';
                this.setLeftToLevel(+this.dataNow[9]);
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // на главной странице личного NPC
            if (/\?nid=\d+/.test(general.loc)) {
                return;
            }

            this.getDataNow(true);
            var stData = general.getData(25);

            if (!stData[0]) {
                stData = this.dataNow;
                general.setData(stData, 25);
            }

            // кнопа сброса счетчиков
            var tr = general.doc.createElement('tr');
            tr.innerHTML = '<td></td><td colspan="2" style="font-weight: ' +
                'bold; font-size: 9px;"><span id="resetCounters" ' +
                'style="cursor: pointer; color: #008000; text-decoration: ' +
                'underline;">Сбросить счетчики</span><br>' +
                '<span id="timeLastReset" style="cursor: default; color: ' +
                '#0000FF;">(' + this.getHtime(+stData[10]) + ')</span></td>';
            general.$('cSnipers').parentNode.parentNode.parentNode.
                appendChild(tr);

            var _this = this;
            general.$('resetCounters').addEventListener('click', function () {
                if (confirm('Сбросить счетчики?')) {
                    _this.getDataNow(false);
                    general.setData(_this.dataNow, 25);
                    general.$('timeLastReset').innerHTML = _this.
                        getHtime(_this.dataNow[10]);
                    _this.setCounters();
                }
            }, false);

            this.setCounters();
        }; // 2}}}
    }; // 1}}}

    /**
     * @class SyndPtsAnalyser {{{1
     * @constructor
     */
    var SyndPtsAnalyser = function () {
        /**
         * @property syndId
         * @type {String}
         */
        this.syndId = /\?id=(\d+)/.exec(general.loc)[1];
        /**
         * @property tm
         * @type {int}
         */
        this.tm = 1500;
        /**
         * @property mainTable
         * @type {Element}
         */
        this.mainTable = general.doc.querySelector('center+br+table') ||
            general.doc.querySelector('center+br+script+table');
        /**
         * @property lastDate
         * @type {String}
         */
        this.lastDate = '';
        /**
         * @property pers
         * @type {Array|null}
         */
        this.pers = null;
        /**
         * @property soExpForPTS
         * @type {Array|null}
         */
        this.soExpForPTS = null;
        /**
         * @property from
         * @type {int}
         */
        this.from = 0;
        /**
         * @property to
         * @type {int}
         */
        this.to = 0;
        /**
         * @property summ
         * @type {Array|null}
         */
        this.summ = null;
        /**
         * @property all
         * @type {int}
         */
        this.all = 0;
        /**
         * @property control
         * @type {int}
         */
        this.control = 0;
        /**
         * @property imgPath
         * @type {String}
         */
        this.imgPath = general.imgPath + 'SyndPtsAnalyser/';

        /**
         * @method getLastDate {{{2
         * @param   {String}    url
         */
        this.getLastDate = function (url) {
            var _url = url || 'https://' + general.domain +
                    '/syndicate.log.php?id=' + this.syndId +
                    '&ptslog=1&page_id=100500',
                counter = general.$('analizePTSCounter'),
                _this = this;

            if (!url) {
                counter.innerHTML = '2/1';
            }

            new AjaxQuery().init(_url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;

                if (!url) {
                    counter.innerHTML = '2/2';
                    general.root.setTimeout(function () {
                        _this.getLastDate(spanContent.
                            querySelector('tr>td[class="greenbg"]' +
                                '[onclick*="window.location=\'' +
                                '/syndicate.log.php?"]:last-child>' +
                                'a[href*="/syndicate.log.php?id="]').href);
                    }, _this.tm);
                } else {
                    var fonts = spanContent.
                            querySelectorAll('nobr>font[color="green"]');
                    _this.lastDate = /\d+.\d+.\d+/.
                            exec(fonts[fonts.length - 1].innerHTML)[0];

                    var inpFrom = general.$('inpDateFrom');
                    inpFrom.value = _this.lastDate;
                    inpFrom.disabled = false;
                    general.$('inpDateTo').disabled = false;
                    general.$('goPTS').disabled = false;
                    general.$('ptsPreloader').style.display = 'none';
                }
            }, function () {
                var preloader = general.$('ptsPreloader');
                preloader.style.display = 'none';
                preloader.parentNode.innerHTML += '<br><span style="color: ' +
                    '#FF0000;">Ошибка ответа сервера...</span>';
            });
        }; // 2}}}

        /**
         * @method enterPress {{{2
         * @param   {Object}    e
         */
        this.enterPress = function (e) {
            var ev = e || general.root.event;
            if (ev.keyCode === 13) {
                general.$('goPTS').click();
            }
        }; // 2}}}

        /**
         * @method showRezult {{{2
         * @param   {String}    id
         */
        this.showRezult = function (id) {
            this.mainTable.removeAttribute('class');
            this.mainTable.setAttribute('style', 'border-collapse: ' +
                    'collapse; background: #D0EED0;');

            var str = '<tr style="font-weight: bold;"><td class="wb1">' +
                    'Персонаж</td><td class="wb1"><img id="gren" ' +
                    'style="cursor: pointer; margin: 2px;" src="' +
                    this.imgPath + 'gren.png" title="Покупка гранат" ' +
                    'alt="Гранаты"></td><td class="wb1"><img id="chip" ' +
                    'style="cursor: pointer; margin: 2px;" src="' +
                    this.imgPath + 'chip.png" title="Покупка чипов" ' +
                    'alt="Чипы"></td><td class="wb1"><img id="rank" ' +
                    'style="cursor: pointer; margin: 2px;" src="' +
                    this.imgPath + 'rank.png" title="Выдача званий" ' +
                    'alt="Звания"></td><td class="wb1"><img id="sign" ' +
                    'style="cursor: pointer; margin: 2px;" ' +
                    'src="https://images.' +
                    general.domain.replace('www.', '') + '/img/synds/' +
                    this.syndId + '.gif" title="Выдача знаков" alt="Знаки">' +
                    '</td><td class="wb1"><span id="all" ' +
                    'style="color: #008000; cursor: pointer;">Всего</span>' +
                    '</td></tr>',
                setPoints = new SetPoints().init;

            var getStrDate = new GetStrDate().init,
                txtAreaStr = 'Период анализа: ' +
                    getStrDate(this.from) + ' - ' + getStrDate(this.to) + '\n' +
                        '----------------------------------------------------' +
                            '---------\n\n',
                name,
                gren,
                chip,
                rank,
                sign,
                all,
                i;

            for (i = 0; i < this.pers.length; i++) {
                name = this.pers[i].name;
                gren = setPoints(this.pers[i].gren, '\'', false);
                chip = setPoints(this.pers[i].chip, '\'', false);
                rank = setPoints(this.pers[i].rank, '\'', false);
                sign = setPoints(this.pers[i].sign, '\'', false);
                all = setPoints(this.pers[i].all, '\'', false);

                str += '<tr><td class="wb2"><a target="_blank" ' +
                    'href="https://' + general.domain + '/search.php?key=' +
                    name + '" style="text-decoration: none; ' +
                    'font-weight: bold; color: #004400;">' + name +
                    '</a></td><td class="wb1">' + gren + '</td>' +
                    '<td class="wb1">' + chip + '</td><td class="wb1">' + rank +
                    '</td><td class="wb1">' + sign + '</td><td class="wb1" ' +
                    'style="color: #008000;">' + all + '</td></tr>';

                txtAreaStr += name + ':\nГранаты: ' + gren + ', Чипы: ' + chip +
                    ', Звания: ' + rank + ', Знак: ' + sign + ', Всего: ' +
                    all + '\n\n';
            }

            var s0 = setPoints(this.summ[0], '\'', false),
                s1 = setPoints(this.summ[1], '\'', false),
                s2 = setPoints(this.summ[2], '\'', false),
                s3 = setPoints(this.summ[3], '\'', false),
                control = setPoints(this.control, '\'', false);

            all = setPoints(this.all, '\'', false);
            str += '<tr style="font-weight: bold;"><td class="wb1" ' +
                'style="color: #0000FF;">Всего</td><td class="wb1" ' +
                'style="color: #0000FF;">' + s0 + '</td>' +
                '<td class="wb1" style="color: #0000FF;">' + s1 +
                '</td><td class="wb1" style="color: #0000FF;">' + s2 +
                '</td><td class="wb1" style="color: #0000FF;">' + s3 +
                '</td><td class="wb1" style="color: #FF0000;">' + all +
                '</td></tr><tr><td class="wb1" colspan="6"><b>Начислено за ' +
                'контроль</b>: <span style="color: #FF0000;">' + control +
                '</span> <b>PTS</b></td></tr>';

            var separator = '------------------------------------------------' +
                '--------------------------------------------------\n';
            txtAreaStr += separator + 'Всего:\n Гранаты: ' + s0 + ', Чипы: ' +
                s1 + ', Звания: ' + s2 + ', Знаки: ' + s3 + ', Всего: ' + all +
                '\n' + separator + 'Начислено за контроль: ' + control +
                ' PTS' + '\n' + separator;

            this.mainTable.innerHTML = str;

            if (!general.$('txtArea')) {
                var center = general.doc.createElement('center'),
                    tArea = general.doc.createElement('textarea');

                tArea.id = 'txtArea';
                tArea.setAttribute('cols', '90');
                tArea.setAttribute('rows', '10');
                tArea.setAttribute('readonly', 'true');
                center.appendChild(tArea);
                var table = this.mainTable,
                    prnt = table.parentNode,
                    br = general.doc.createElement('br');
                prnt.insertBefore(br, table);
                prnt.insertBefore(center, br);
            }

            var txtArea = general.$('txtArea');
            txtArea.value = txtAreaStr;

            // если есть переводы синдового опыта за PTS выводим их
            var len = this.soExpForPTS.length;
            if (len) {
                var div = general.doc.createElement('div');
                div.setAttribute('style', 'margin-top: 15px; width: 650px; ' +
                        'text-align: left;');
                txtArea.parentNode.appendChild(div);
                for (i = 0; i < len; i++) {
                    div.appendChild(this.soExpForPTS[i]);
                }
            }

            var titleSort = general.$(id);
            titleSort.parentNode.style.background = '#A0EEA0';

            general.$('gren').
                addEventListener('click', this.titleClick('gren'), false);
            general.$('chip').
                addEventListener('click', this.titleClick('chip'), false);
            general.$('rank').
                addEventListener('click', this.titleClick('rank'), false);
            general.$('sign').
                addEventListener('click', this.titleClick('sign'), false);
            general.$('all').
                addEventListener('click', this.titleClick('all'), false);
        }; // 2}}}

        /**
         * @method titleClick {{{2
         * @param   {String}    id
         */
        this.titleClick = function (id) {
            var _this = this;
            return function () {
                _this.sortPers(id);
            };
        }; // 2}}}

        /**
         * @method sortPers {{{2
         * @param   {String}    prop
         */
        this.sortPers = function (prop) {
            this.pers.sort(function (a, b) {
                var ret;

                if (a[prop] < b[prop]) {
                    ret = 1;
                } else if (a[prop] > b[prop]) {
                    ret = -1;
                } else {
                    ret = 0;
                }

                return ret;
            });

            this.showRezult(prop);
        }; // 2}}}

        /**
         * @method addData {{{2
         * @param   {Object}    pers
         * @param   {String}    prop
         * @param   {int}       val
         */
        this.addData = function (pers, prop, val) {
            pers[prop] += val;
            pers.all += val;

            var ind;
            switch (prop) {
            case 'gren':
                ind = 0;
                break;
            case 'chip':
                ind = 1;
                break;
            case 'rank':
                ind = 2;
                break;
            case 'sign':
                ind = 3;
                break;
            default:
                break;
            }

            this.summ[ind] += val;
            this.all += val;
        }; // 2}}}

        /**
         * @method parsePTSProtocols {{{2
         * @param   {int}   ind
         */
        this.parsePTSProtocols = function (ind) {
            general.$('analizePTSCounter').innerHTML = ind;
            var url = 'https://' + general.domain + '/syndicate.log.php?id=' +
                    this.syndId + '&ptslog=1&page_id=' + ind,
                _this = this;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;

                var lines = spanContent.
                        querySelectorAll('nobr>font[color="green"]');

                if (!lines.length) {
                    _this.sortPers('all');
                    return;
                }

                var getTimestamp = new GetTimestamp().init,
                    nobr1,
                    nobr2,
                    pers,
                    time,
                    rez,
                    str,
                    i;

                for (i = 0; i < lines.length; i++) {
                    time = getTimestamp(lines[i].innerHTML);
                    if (time > _this.to) {
                        continue;
                    }

                    if (time < _this.from) {
                        _this.sortPers('all');
                        return;
                    }

                    nobr1 = lines[i].parentNode;
                    nobr2 = nobr1.nextElementSibling;
                    str = nobr2.innerHTML;

                    rez = /(.*) получил звание .* \((\d+) PTS/.exec(str);
                    if (rez) {
                        pers = _this.getPers(rez[1]);
                        _this.addData(pers, 'rank', +rez[2]);
                        continue;
                    }

                    rez = /(.*) купил.* за (\d+) PTS/.exec(str);
                    if (rez) {
                        pers = _this.getPers(rez[1]);
                        _this.addData(pers, /чип/i.test(str) ? 'chip' : 'gren',
                            +rez[2]);
                        continue;
                    }

                    rez = /выдал значок персонажу (.*) \((\d+) PTS/.exec(str);
                    if (rez) {
                        pers = _this.getPers(rez[1]);
                        _this.addData(pers, 'sign', +rez[2]);
                        continue;
                    }

                    rez = /Продлено звание для (.*) за (\d+) PTS/.exec(str);
                    if (rez) {
                        pers = _this.getPers(rez[1]);
                        _this.addData(pers, 'rank', +rez[2]);
                        continue;
                    }

                    rez = /выдал звание .* персонажу (.*) \((\d+) PT/.exec(str);
                    // бывает так:
                    // LPRulez выдал звание Private персонажу shiftman (0 PTS)
                    if (rez && rez[2] !== '0') {
                        pers = _this.getPers(rez[1]);
                        _this.addData(pers, 'rank', +rez[2]);
                        continue;
                    }

                    rez = /Начислено \$.* и (\d+) PTS за контроль/.exec(str);
                    if (rez) {
                        _this.control += +rez[1];
                    }

                    // перевод синдового опыта за PTS
                    rez = /\d+ ед. синдикатного опыта за \d+ PTS/.exec(str);
                    if (rez) {
                        _this.soExpForPTS.push(nobr1);
                        _this.soExpForPTS.push(nobr2);
                        _this.soExpForPTS.push(general.doc.createElement('br'));
                    }
                }

                general.root.setTimeout(function () {
                    ind++;
                    _this.parsePTSProtocols(ind);
                }, _this.tm);
            }, function () {
                general.root.setTimeout(function () {
                    _this.parsePTSProtocols(ind);
                }, _this.tm);
            });
        }; // 2}}}

        /**
         * @method getPers {{{2
         * @param   {String}    nik
         * @return  {Object}
         */
        this.getPers = function (nik) {
            var i;
            for (i = 0; i < this.pers.length; i++) {
                if (this.pers[i].name === nik) {
                    return this.pers[i];
                }
            }

            var pers = {name: nik, gren: 0, chip: 0, sign: 0, rank: 0, all: 0};
            this.pers.push(pers);

            return pers;
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var target = general.doc.
                    querySelector('td[colspan="3"]>a[href*="&ptslog=1"]').
                        parentNode;

            //css-ботва
            var style = general.doc.createElement('style');
            style.innerHTML = '.wb1 {text-align:center; padding-left:3px; ' +
                'border: 1px #339933 solid;} .wb2 {padding-left:3px; ' +
                'padding-right:3px; border: 1px #339933 solid;}';
            general.doc.querySelector('head').appendChild(style);

            if (target.lastElementChild.nodeName === 'BR') {
                target.removeChild(target.lastElementChild);
            }

            var butShowPTSAnalizePanel = general.doc.createElement('a');
            butShowPTSAnalizePanel.innerHTML = 'Анализ PTS';
            butShowPTSAnalizePanel.setAttribute('style', 'cursor: pointer');
            target.appendChild(general.doc.createTextNode(' | '));
            target.appendChild(butShowPTSAnalizePanel);

            var _this = this;
            butShowPTSAnalizePanel.addEventListener('click', function () {
                if (general.$('inpDateFrom')) {
                    return;
                }

                var table = _this.mainTable,
                    tArea = general.$('txtArea');

                if (tArea) {
                    table.parentNode.
                        removeChild(table.previousElementSibling);
                    table.parentNode.
                        removeChild(table.previousElementSibling);
                }

                table.setAttribute('class', 'wb');
                table.setAttribute('width', '600');
                table.setAttribute('cellpadding', '0');
                table.setAttribute('cellspacing', '0');
                table.setAttribute('style', 'margin-bottom: 50px;');

                var getStrDate = new GetStrDate().init;
                table.innerHTML = '<tr><td>' +
                    'Введите даты в формате дд.мм.гг<br>' +
                    'с: <input id="inpDateFrom" maxlength="8" ' +
                    'value="" style="width: 70px;" disabled> до: ' +
                    '<input id="inpDateTo" maxlength="8" value="' +
                    getStrDate('now')  + '" style="width: 70px;" disabled> ' +
                    '<input type="button" id="goPTS" value=">>" disabled>' +
                    '<span id="ptsPreloader" style="margin-left: 10px;">' +
                    '<img src="' + general.imgPath + 'preloader.gif" ' +
                    'alt="img" /><span id="analizePTSCounter" ' +
                    'style="color: #0000FF; margin-left: 10px;">2/0</span>' +
                    '</span></td></tr>';

                _this.getLastDate('');

                general.$('inpDateFrom').
                    addEventListener('keypress', _this.enterPress, false);
                general.$('inpDateTo').
                    addEventListener('keypress', _this.enterPress, false);

                var getTimestamp = new GetTimestamp().init;
                general.$('goPTS').addEventListener('click', function () {
                    _this.from = getTimestamp(general.$('inpDateFrom').value);
                    _this.to = getTimestamp(general.$('inpDateTo').value);

                    var dateStrNow = getStrDate('now');
                    if (!_this.from || !_this.to ||
                            _this.from < getTimestamp(_this.lastDate) ||
                                _this.to > getTimestamp(dateStrNow) ||
                                    _this.from > _this.to) {
                        alert('Не верно введена дата !!!\n' +
                            'Первая запись в протоколе: ' + _this.lastDate +
                            '\nСегодня: ' + dateStrNow);
                        return;
                    }

                    general.$('ptsPreloader').style.display = '';
                    general.$('inpDateFrom').disabled = true;
                    general.$('inpDateTo').disabled = true;
                    general.$('goPTS').disabled = true;

                    _this.pers = [];
                    _this.soExpForPTS = [];
                    // гранаты, чипы, звания, знаки
                    _this.summ = [0, 0, 0, 0, 0];
                    _this.all = 0;
                    _this.control = 0;
                    _this.parsePTSProtocols(0);
                }, false);
            }, false);
        }; // 2}}}
    }; // 1}}}

    /**
     * @class SyndAnalyser {{{1
     * @constructor
     */
    var SyndAnalyser = function () {
        /**
         * @property syndId
         * @type {String}
         */
        this.syndId = /\?id=(\d+)/.exec(general.loc)[1];
        /**
         * @property mainTable
         * @type {Element}
         */
        this.mainTable = general.doc.querySelector('center+br+table') ||
            general.doc.querySelector('center+br+script+table');
        /**
         * @property tm
         * @type {int}
         */
        this.tm = 1500;
        /**
         * @property lastDate
         * @type {String}
         */
        this.lastDate = '';
        /**
         * @property from
         * @type {int}
         */
        this.from = 0;
        /**
         * @property to
         * @type {int}
         */
        this.to = 0;
        /**
         * @property mainData
         * @type {Object|null}
         */
        this.mainData = null;

        /**
         * @class MainData {{{2
         * @constructor
         */
        var MainData = function () {
            /**
             * @property pers
             * @type {Array}
             */
            this.pers = [];
            /**
             * @property allProtect
             * @type {int}
             */
            this.allProtect = 0;
            /**
             * @property allAttaks
             * @type {int}
             */
            this.allAttaks = 0;
            /**
             * @property allTake
             * @type {int}
             */
            this.allTake = 0;
            /**
             * @property allPut
             * @type {int}
             */
            this.allPut = 0;
            /**
             * @property takenSynd
             * @type {Array}
             */
            this.takenSynd = [];
            /**
             * @property dismissedSynd
             * @type {Array}
             */
            this.dismissedSynd = [];
            /**
             * @property realEstate
             * @type {Object}
             */
            this.realEstate = {
                es: {mMoney: 0, pMoney: 0, mPTS: 0, pPTS: 0},
                uran: {mMoney: 0, pMoney: 0, mPTS: 0, pPTS: 0},
                bars: {mMoney: 0, pMoney: 0, mPTS: 0, pPTS: 0},
                another: {mMoney: 0, pMoney: 0, mPTS: 0, pPTS: 0}
            };
        }; // 2}}}

        /**
         * @method getLastDate {{{2
         * @param   {String}    url
         */
        this.getLastDate = function (url) {
            var _url = url || 'https://' + general.domain +
                    '/syndicate.log.php?id=' + this.syndId + '&page_id=100500',
                counter = general.$('syndAnalyseCounter'),
                _this = this;

            if (!url) {
                counter.innerHTML = '2/1';
            }

            new AjaxQuery().init(_url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;

                if (!url) {
                    counter.innerHTML = '2/2';
                    general.root.setTimeout(function () {
                        _this.getLastDate(spanContent.
                            querySelector('tr>td[class="greenbg"]' +
                                '[onclick*="window.location=\'' +
                                '/syndicate.log.php?"]:last-child>' +
                                'a[href*="/syndicate.log.php?id="]').href);
                    }, _this.tm);
                } else {
                    var fonts = spanContent.
                            querySelectorAll('nobr>font[color="green"]');
                    _this.lastDate = /\d+.\d+.\d+/.
                            exec(fonts[fonts.length - 1].innerHTML)[0];

                    var inpFrom = general.$('inpDateFrom');
                    inpFrom.value = _this.lastDate;
                    inpFrom.disabled = false;
                    general.$('inpDateTo').disabled = false;
                    general.$('goSAnalyse').disabled = false;
                    general.$('syndAnalysePreloader').style.display = 'none';
                }
            }, function () {
                var preloader = general.$('syndAnalysePreloader');
                preloader.style.display = 'none';
                preloader.parentNode.innerHTML += '<br>' +
                    '<span style="color: #FF0000;">Ошибка ответа сервера...' +
                    '</span>';
            });
        }; // 2}}}

        /**
         * @method enterPress {{{2
         * @param   {Object}    e
         */
        this.enterPress = function (e) {
            var ev = e || general.root.event;
            if (ev.keyCode === 13) {
                general.$('goSAnalyse').click();
            }
        }; // 2}}}

        /**
         * @method getPers {{{2
         * @param   {Object}   link
         * @return  {Object}
         */
        this.getPers = function (link) {
            var i;
            for (i = 0; i < this.mainData.pers.length; i++) {
                if (this.mainData.pers[i].link === link.href) {
                    return this.mainData.pers[i];
                }
            }

            var pers = {
                link: link.href,
                name: link.firstElementChild.innerHTML,
                attaks: 0,
                putMoney: 0,
                takeMoney: 0
            };

            this.mainData.pers.push(pers);

            return pers;
        }; // 2}}}

        /**
         * @method getTypeLine {{{2
         * @param   {String}    str
         * @return  {int|Object}
         */
        this.getTypeLine = function (str) {
            if (/инициировал нападение/i.test(str)) {
                return 1;
            }

            if (/На контролируемый объект/i.test(str)) {
                return 2;
            }

            if (/снято со счета/i.test(str)) {
                return {takeOff: +/\$(\d+)/.exec(str)[1]};
            }

            if (/переведено на счет/i.test(str)) {
                return {takeOn: +/\$(\d+)/.exec(str)[1]};
            }

            if (/на нападения на электростанции/i.test(str)) {
                return 3;
            }

            if (/на нападения на рудники/i.test(str)) {
                return 4;
            }

            if (/нападениях на остальную/i.test(str)) {
                return 5;
            }

            if (/принят/i.test(str)) {
                return 6;
            }

            if (/вышел/i.test(str)) {
                return 7;
            }

            if (/в нападениях за контроль баров/i.test(str)) {
                return 8;
            }

            // выгнали
            if (/покинул синдикат/i.test(str)) {
                return 9;
            }

            return 0;
        }; // 2}}}

        /**
         * @method getPersLink {{{2
         * @param    {Element}  elem
         * @return   {Element}
         */
        this.getPersLink = function (elem) {
            // noinspection JSUnresolvedVariable
            return elem.parentNode.nextElementSibling.querySelector('a');
        }; // 2}}}

        /**
         * @method parseLine {{{2
         * @param   {String}    str
         * @param   {Object}    obj
         */
        this.parseLine = function (str, obj) {
            var rez = /\$(\d+).*и (\d+).*\$(\d+).*и (\d+)/.exec(str);

            if (rez) {
                obj.mMoney += +rez[1].replace(/,/g, '');
                obj.mPTS += +rez[2].replace(/,/g, '');
                obj.pMoney += +rez[3].replace(/,/g, '');
                obj.pPTS += +rez[4].replace(/,/g, '');
            }
        }; // 2}}}

        /**
         * @method getRealEstateStr {{{2
         * @param   {Object}    obj
         * @param   {String}    name
         * @param   {String}    title
         * @param   {String}    str1
         * @param   {String}    str2
         * @param   {String}    str3
         * @return  {String}
         */
        this.getRealEstateStr = function (obj, name, title, str1, str2, str3) {
            var setPoints = new SetPoints().init;

            return title + name + str3 +
                str1 + 'Потрачено гб' + str2 + '$' +
                setPoints(obj.mMoney, '\'', false) + str3 + str1 +
                'Заработано гб' + str2 + '$' +
                setPoints(obj.pMoney, '\'', false) + str3 +
                str1 + '<span style="font-weight: bold;">Итого:</span>' + str2 +
                '<span style="font-weight: bold;">$' +
                setPoints(obj.pMoney - obj.mMoney, '\'', true) + '</span>' +
                str3 + str1 + 'Потрачено PTS' + str2 +
                setPoints(obj.mPTS, '\'', false) + str3 +
                str1 + 'Заработано PTS' + str2 +
                setPoints(obj.pPTS, '\'', false) + str3 + str1 +
                '<span style="font-weight: bold;">Итого:</span>' + str2 +
                '<span style="font-weight: bold;">' +
                setPoints(obj.pPTS - obj.mPTS, '\'', true) + '</span>' +
                str3;
        }; // 2}}}

        /**
         * @method showRezult {{{2
         */
        this.showRezult = function () {
            this.sortPers();

            var setPoints = new SetPoints().init,
                main = this.mainData,
                str1 = '<tr><td class="wb">',
                str2 = '</td><td class="wb">',
                str3 = '</td></tr>',
                strTakeMoney = '',
                strPutMoney = '',
                strAttaks = '',
                persLink,
                pers,
                val,
                i;

            for (i = 0; i < main.pers.length; i++) {
                pers = main.pers[i];
                persLink = '<a target="_blank" style="font-weight: bold; ' +
                    'text-decoration: none; color: #004400;" ' +
                    'href="' + pers.link + '">' + pers.name + '</a>';

                if (pers.attaks) {
                    val = setPoints(pers.attaks, '\'', false);
                    strAttaks += str1 + persLink + str2 + val + str3;
                }

                if (pers.takeMoney) {
                    val = '$' + setPoints(pers.takeMoney, '\'', false);
                    strTakeMoney += str1 + persLink + str2 + val + str3;
                }

                if (pers.putMoney) {
                    val = '$' + setPoints(pers.putMoney, '\'', false);
                    strPutMoney += str1 + persLink + str2 + val + str3;
                }
            }

            var str4 = '<tr><td colspan="2" class="wb"><a target="_blank" ' +
                    'style="text-decoration: none; font-weight: bold; color: ' +
                    '#004400;" href="https://' + general.domain +
                    '/search.php?key=',
                strDismissedSynd = '',
                strTakenSynd = '';

            for (i = 0; i < main.dismissedSynd.length; i++) {
                pers = main.dismissedSynd[i][0];
                strDismissedSynd += str4 + pers + '">' + pers + '</a>, ' +
                    main.dismissedSynd[i][1] + str3;
            }

            for (i = 0; i < main.takenSynd.length; i++) {
                pers = main.takenSynd[i][0];
                strTakenSynd += str4 + pers + '">' + pers + '</a>, ' +
                    main.takenSynd[i][1] + str3;
            }

            var title = '<tr><td colspan="2" style="background: #D0EED0; ' +
                'text-align: center; font-weight: bold;">',
                r = main.realEstate;

            this.mainTable.innerHTML = title + 'Нападающие [' +
                'нападений: <span style="color: #FF0000;">' + main.allAttaks +
                '</span>, защит: <span style="color: #0000FF;">' +
                main.allProtect + '</span>, всего боев: <span style="color: ' +
                '#990000;">' + (main.allAttaks + main.allProtect) + '</span>]' +
                str3 + strAttaks +

                this.getRealEstateStr(r.es, 'Электростанции',
                        title, str1, str2, str3) +
                this.getRealEstateStr(r.uran, 'Урановые рудники',
                        title, str1, str2, str3) +
                this.getRealEstateStr(r.bars, 'Бары',
                        title, str1, str2, str3) +
                this.getRealEstateStr(r.another, 'Другая недвижимость',
                        title, str1, str2, str3) +

                title + 'Счет синдиката [$<span style="color: #990000;">' +
                setPoints(main.allPut - main.allTake, '\'', true) +
                '</span>]' + str3 + str1 + '<span style="font-weight: bold; ' +
                'color: #FF0000;">Взяли со счета</span> (всего)' + str2 +
                '<span style="font-weight: bold;">$' +
                setPoints(main.allTake, '\'', false) + '</span>' + str3 +
                strTakeMoney + str1 + '<span style="font-weight: bold; ' +
                'color: #0000FF;">Положили на счет</span> (всего)' + str2 +
                '<span style="font-weight: bold;">$' +
                setPoints(main.allPut, '\'', false) + '</span>' + str3 +
                strPutMoney + title + 'Состав' + str3 + '<tr><td colspan="2" ' +
                'class="wb"><span style="font-weight: bold; color: #FF0000;">' +
                'Вышли из синдиката</span> (всего ' +
                main.dismissedSynd.length + ')' + str3 + strDismissedSynd +
                '<tr><td colspan="2" class="wb"><span style="font-weight: ' +
                'bold; color: #0000FF;">Приняты в синдикат</span> (всего ' +
                main.takenSynd.length + ')' + str3 + strTakenSynd;
        }; // 2}}}

        /**
         * @method sortPers {{{2
         */
        this.sortPers = function () {
            this.mainData.pers.sort(function (a, b) {
                var ret;

                if (a.attaks < b.attaks) {
                    ret = 1;
                } else if (a.attaks > b.attaks) {
                    ret = -1;
                } else {
                    ret = 0;
                }

                return ret;
            });
        }; // 2}}}

        /**
         * @method parseSyndProtocols {{{2
         * @param   {int}   ind
         */
        this.parseSyndProtocols = function (ind) {
            general.$('syndAnalyseCounter').innerHTML = ind;
            var url = 'https://' + general.domain + '/syndicate.log.php?id=' +
                    this.syndId + '&page_id=' + ind,
                _this = this;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;

                var lines = spanContent.
                        querySelectorAll('nobr>font[color="green"]');

                if (!lines.length) {
                    _this.showRezult();
                    return;
                }

                var getTimestamp = new GetTimestamp().init,
                    typeLine,
                    take,
                    pers,
                    time,
                    tmp,
                    str,
                    i;

                for (i = 0; i < lines.length; i++) {
                    time = getTimestamp(lines[i].innerHTML);
                    if (time > _this.to) {
                        continue;
                    }

                    if (time < _this.from) {
                        _this.showRezult();
                        return;
                    }

                    // noinspection JSUnresolvedVariable
                    str = lines[i].parentNode.nextElementSibling.innerHTML;
                    typeLine = _this.getTypeLine(str);

                    if (!typeLine) {
                        continue;
                    }

                    //перс положил или взял со счета
                    take = typeLine.takeOff || typeLine.takeOn;
                    if (take) {
                        pers = _this.getPers(_this.getPersLink(lines[i]));
                        if (typeLine.takeOff) {
                            pers.takeMoney += take;
                            _this.mainData.allTake += take;
                        } else {
                            pers.putMoney += take;
                            _this.mainData.allPut += take;
                        }

                        continue;
                    }

                    str = str.replace(/,/g, '');
                    switch (typeLine) {
                    case 1:
                        _this.getPers(_this.getPersLink(lines[i])).attaks++;
                        _this.mainData.allAttaks++;
                        break;
                    case 2:
                        _this.mainData.allProtect++;
                        break;
                    case 3:
                        _this.parseLine(str, _this.mainData.realEstate.es);
                        break;
                    case 4:
                        _this.parseLine(str, _this.mainData.realEstate.uran);
                        break;
                    case 5:
                        _this.parseLine(str, _this.mainData.realEstate.another);
                        break;
                    case 6:
                        _this.mainData.takenSynd.
                            push([_this.getPersLink(lines[i]).
                                    firstElementChild.innerHTML,
                                lines[i].innerHTML]);
                        break;
                    case 7:
                        _this.mainData.dismissedSynd.
                            push([_this.getPersLink(lines[i]).
                                    firstElementChild.innerHTML,
                                lines[i].innerHTML]);
                        break;
                    case 8:
                        _this.parseLine(str, _this.mainData.realEstate.bars);
                        break;
                    case 9:
                        // выгнали
                        tmp = /^(.*) покинул синдикат( \(.*\))/.exec(str);
                        if (tmp) {
                            _this.mainData.dismissedSynd.push([tmp[1],
                                lines[i].innerHTML + tmp[2]]);
                        }

                        break;
                    default:
                        break;
                    }
                }

                general.root.setTimeout(function () {
                    ind++;
                    _this.parseSyndProtocols(ind);
                }, _this.tm);
            }, function () {
                general.root.setTimeout(function () {
                    _this.parseSyndProtocols(ind);
                }, _this.tm);
            });

        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var target = general.doc.
                    querySelector('td[colspan="3"]>a[href*="&ptslog=1"]').
                        parentNode;

            if (target.lastElementChild.nodeName === 'BR') {
                target.removeChild(target.lastElementChild);
            }

            var butShowAnalysePanel = general.doc.createElement('a');
            butShowAnalysePanel.innerHTML = 'Анализ активности';
            butShowAnalysePanel.setAttribute('style', 'cursor: pointer');
            target.appendChild(general.doc.createTextNode(' | '));
            target.appendChild(butShowAnalysePanel);

            var _this = this;
            butShowAnalysePanel.addEventListener('click', function () {
                if (general.$('inpDateFrom')) {
                    return;
                }

                _this.mainTable.setAttribute('class', 'wb');
                _this.mainTable.setAttribute('cellpadding', '0');
                _this.mainTable.setAttribute('cellspacing', '0');
                _this.mainTable.removeAttribute('style');

                var getStrDate = new GetStrDate().init;
                _this.mainTable.innerHTML = '<tr><td>' +
                    'Введите даты в формате дд.мм.гг<br>' +
                    'с: <input id="inpDateFrom" maxlength="8" ' +
                    'value="" style="width: 70px;" disabled> до: ' +
                    '<input id="inpDateTo" maxlength="8" value="' +
                    getStrDate('now')  + '" style="width: 70px;" disabled> ' +
                    '<input type="button" id="goSAnalyse" value=">>" ' +
                    'disabled><span id="syndAnalysePreloader" ' +
                    'style="margin-left: 10px;"><img src="' + general.imgPath +
                    'preloader.gif" alt="img" />' +
                    '<span id="syndAnalyseCounter" style="color: #0000FF; ' +
                    'margin-left: 10px;">2/0</span></span></td></tr>';

                _this.getLastDate('');

                general.$('inpDateFrom').
                    addEventListener('keypress', _this.enterPress, false);
                general.$('inpDateTo').
                    addEventListener('keypress', _this.enterPress, false);

                var getTimestamp = new GetTimestamp().init;
                general.$('goSAnalyse').addEventListener('click', function () {
                    _this.from = getTimestamp(general.$('inpDateFrom').value);
                    _this.to = getTimestamp(general.$('inpDateTo').value);

                    var dateStrNow = getStrDate('now');
                    if (!_this.from || !_this.to ||
                            _this.from < getTimestamp(_this.lastDate) ||
                                _this.to > getTimestamp(dateStrNow) ||
                                    _this.from > _this.to) {
                        alert('Не верно введена дата !!!\n' +
                            'Первая запись в протоколе: ' + _this.lastDate +
                            '\nСегодня: ' + dateStrNow);
                        return;
                    }

                    general.$('syndAnalysePreloader').style.display = '';
                    general.$('inpDateFrom').disabled = true;
                    general.$('inpDateTo').disabled = true;
                    general.$('goSAnalyse').disabled = true;

                    _this.mainData = new MainData();
                    _this.parseSyndProtocols(0);
                }, false);
            }, false);
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ShowMyAchievements {{{1
     * @constructor
     */
    var ShowMyAchievements = function () {
        /**
         * @property divResult
         * @type {HTMLElement|null}
         */
        this.divResult = null;

        /**
         * @method addCloseButton {{{2
         */
        this.addCloseButton = function () {
            this.divResult.innerHTML += '<img id="closemyachiev" ' +
                'src="' + general.imgPath + 'close.gif" style="cursor: ' +
                'pointer;" alt="img" />';

            var _this = this;
            general.$('closemyachiev').addEventListener('click', function () {
                _this.divResult.style.visibility = 'hidden';
            }, false);
        }; // 2}}}

        /**
         * @method getAchievNow {{{2
         * @param   {Object}    obj
         * @return  {Object|null}
         */
        this.getAchievNow = function (obj) {
            return obj.querySelectorAll('td.simplewhitebg>' +
                    'font[color="#336633"]');
        }; // 2}}}

        /**
         * @method showData {{{2
         * @param   {Object}    ths
         */
        this.showData = function (ths) {
            var pos = new GetPos().init(ths);
            this.divResult.style.left = pos.x;
            this.divResult.style.top = pos.y + 25;
            this.divResult.style.visibility = 'visible';
            this.divResult.innerHTML = '<img src="' + general.imgPath +
                'preloader.gif" alt="img" />';

            var stData = general.getData(26),
                url = 'https://' + general.domain + '/info.ach.php?id=' +
                    general.myID;

            if (!stData[0]) {
                this.divResult.innerHTML = 'Не выбрано ни одной ачивки на ' +
                    '<a target="_blank" href="' + url + '">этой</a> странице.';
                this.addCloseButton();
            } else {
                var _this = this;
                new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                    var spanContent = general.doc.createElement('span');
                    spanContent.innerHTML = xml.responseText;

                    var achievNow = _this.getAchievNow(spanContent),
                        str = '<table>',
                        i;

                    for (i = 0; i < achievNow.length; i++) {
                        if (new RegExp('(^|,)' + i + '(,|$)').test(stData[0])) {
                            // noinspection JSUnresolvedVariable
                            str += '<tr>' + achievNow[i].parentNode.parentNode.
                                innerHTML + '</tr>';
                        }
                    }

                    _this.divResult.innerHTML = str + '</table>';
                    _this.addCloseButton();
                }, function () {
                    _this.divResult.innerHTML = '<span style="color: ' +
                        '#FF0000;">Ошибка ответа сервера...</span>';
                    _this.addCloseButton();
                });
            }
        }; // 2}}}

        /**
         * @method setChkHandler {{{2
         */
        this.setChkHandler = function () {
            var chks = general.doc.querySelectorAll('input[id^="achiev"]'),
                str = '',
                i;

            for (i = 0; i < chks.length; i++) {
                if (chks[i].checked) {
                    str += /\d+/.exec(chks[i].id)[0] + ',';
                }
            }

            general.setData([str.replace(/,$/, '')], 26);
        }; // 2}}}

        /**
         * @method setCheckboxes {{{2
         */
        this.setCheckboxes = function () {
            var achievNow = this.getAchievNow(general.doc),
                stData = general.getData(26),
                target,
                prnt,
                chk,
                i;

            for (i = 0; i < achievNow.length; i++) {
                chk = general.doc.createElement('input');
                chk.type = 'checkbox';
                chk.id = 'achiev' + i;
                chk.checked = new RegExp('(^|,)' + i + '(,|$)').test(stData[0]);

                prnt = achievNow[i].parentNode;
                target = prnt.firstChild.nodeType === 3 ?
                            prnt.firstChild : prnt.firstChild.nextSibling;

                prnt.insertBefore(chk, target);
                chk.addEventListener('click', this.setChkHandler, false);
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var topPanel = new GetTopPanel().init();

            if (topPanel) {
                this.divResult = general.doc.createElement('div');
                this.divResult.setAttribute('style', 'visibility: hidden; ' +
                        'position: absolute; padding: 3px; background-color: ' +
                        '#E7FFE7; border: solid 1px #339933; ' +
                        'max-width: 300px; border-radius:5px; top:0; left:0; ' +
                        'box-shadow: 5px 6px 6px rgba(122,122,122,0.5);');
                general.doc.body.appendChild(this.divResult);

                var span = general.doc.createElement('span');
                span.innerHTML = 'Достижения';
                span.id = 'spanAchievements';
                span.setAttribute('style', 'cursor: pointer;');

                var _this = this;
                span.addEventListener('click', function () {
                    _this.showData(this);
                }, false);

                topPanel.appendChild(general.doc.createTextNode(' | '));
                topPanel.appendChild(span);

                // на странице своих ачивок
                if (general.loc.
                        indexOf('/info.ach.php?id=' + general.myID) !== -1) {
                    this.setCheckboxes();
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class SyndOnlineOnMainPage {{{1
     * @constructor
     */
    var SyndOnlineOnMainPage = function () {
        /**
         * @property syndUnion
         * @type {HTMLElement|null}
         */
        this.syndUnion = null;
        /**
         * @property syndMain
         * @type {HTMLElement|null}
         */
        this.syndMain = null;

        // noinspection FunctionWithInconsistentReturnsJS
        /**
         * @method setSms {{{2
         * @return  {Boolean}
         */
        this.setSms = function () {
            var nobrs = general.$('friendsbody').querySelectorAll('nobr');
            if (nobrs.length) {
                var pLink, i;
                for (i = 0; i < nobrs.length; i++) {
                    pLink = nobrs[i].querySelector('a[href*="/info.php?id="]');
                    if (pLink) {
                        nobrs[i].innerHTML += '<a target="_blank" ' +
                            'style="margin-left: 3px;" ' +
                            'href="/sms-chat.php?id=' +
                            /\d+$/.exec(pLink.href)[0] + '">' +
                            '<img src="https://images.' +
                            general.domain.replace('www.', '') + '/img/' +
                            'letter-pc.png" alt="img" /></a>';
                    }
                }

                return false;
            }
        }; // 2}}}

        /**
         * @method getOnline {{{2
         * @param   {Boolean}   type
         */
        this.getOnline = function (type) {
            var target = general.$('friendsbody');
            if (!target.querySelector('div')) {
                target.innerHTML = '<div></div>' + (this.syndUnion ?
                        '<hr style="color: #C3C3C3;" /><div></div>' : '');
            }

            target = type ? target.lastElementChild : target.firstElementChild;
            target.innerHTML = '<img src="' + general.imgPath +
                'preloader.gif" alt="img" />';

            var url = (type ? this.syndUnion.href : this.syndMain.href) +
                    '&page=online',
                _this = this;

            new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xml.responseText;

                target.innerHTML = '<a href="' + url + '">' +
                    '<img src="https://images.' +
                    general.domain.replace('www.', '') + '/img/synds/' +
                    /\?id=(\d+)/.exec(url)[1] + '.gif" alt="img" /></a> (' +
                    /<b>(\d+) бойцов онлайн<\/b>/.
                        exec(spanContent.innerHTML)[1] + ')<br>';

                var cssSelector = 'table[class="bordersupdown"][width="100%"]',
                    trs = spanContent.querySelector(cssSelector).
                        querySelectorAll('tr');

                if (trs.length > 1) {
                    var nobr, pers, syndImg, war, i;
                    for (i = 1; i < trs.length; i++) {
                        syndImg = trs[i].querySelector('a[href*=' +
                            '"/syndicate.php?id="]');
                        pers = trs[i].querySelector('a[href*="/info.php?id="]');
                        war = trs[i].
                            querySelector('a[href*="/warlog.php?bid="]');

                        nobr = general.doc.createElement('nobr');
                        if (syndImg) {
                            nobr.appendChild(syndImg);
                        }

                        if (war) {
                            pers.setAttribute('style', 'color: #FF0000;');
                        }

                        nobr.appendChild(pers);
                        nobr.innerHTML += ' <a target="_blank" ' +
                            'href="https://' + general.domain +
                            '/sms-create.php?mailto=' +
                            pers.firstElementChild.innerHTML +
                            '"><img src="https://images.' +
                            general.domain.replace('www.', '') +
                            '/img/letter-pc.png" alt="img" /></a>';

                        target.appendChild(nobr);
                        target.innerHTML += i < trs.length - 1 ? ',<wbr>' : '';
                    }
                }
            }, function () {
                general.root.setTimeout(function () {
                    _this.getOnline(type);
                }, 1000);
            });
        }; // 2}}}

        /**
         * @method createLink {{{2
         * @param   {String}    name
         * @param   {Boolean}   type
         * @return  {HTMLElement}
         */
        this.createLink = function (name, type) {
            var link = general.doc.createElement('a');
            link.setAttribute('style', 'text-decoration: underline; ' +
                    'cursor: pointer;');
            link.innerHTML = name;
            var _this = this;
            link.addEventListener('click', function () {
                _this.getOnline(type);
            }, false);

            return link;
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // гости, друзья - ставим конвертики для отправки письма
            var friends = general.doc.querySelector('a[onclick*="setfriends"]'),
                guests = general.doc.querySelector('a[onclick*="setvisitor"]');

            friends.addEventListener('click', this.setSms, false);
            guests.addEventListener('click', this.setSms, false);
            friends.click();

            // основной синдикат
            this.syndMain = general.doc.
                    querySelector('span>b+nobr>a[href*="/syndicate.php?id="]');

            if (this.syndMain) {
                var b = general.doc.createElement('b');
                b.appendChild(general.doc.createTextNode(' / '));
                b.appendChild(this.createLink('Основа', false));
                guests.parentNode.parentNode.appendChild(b);

                var url = this.syndMain.href + '&page=politics',
                    _this = this;

                new AjaxQuery().init(url, 'GET', null, true, function (xml) {
                    var spanContent = general.doc.createElement('span');
                    spanContent.innerHTML = xml.responseText;

                    var cssSelector = 'tr>td[colspan="3"]' +
                        '[class="greengreenbg"]>' +
                        'a[href*="/syndicate.php?id="]:last-child';
                    _this.syndUnion = spanContent.querySelector(cssSelector);

                    if (_this.syndUnion) {
                        b.appendChild(general.doc.createTextNode(' '));
                        b.appendChild(_this.createLink('Союз', true));
                    }
                }, function () {
                    general.cons.log('Error request to: ' + url);
                });
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class TimeKarma {{{1
     * @constructor
     */
    var TimeKarma = function () {
        /**
         * @method formatTime {{{2
         * @param   {int}   sec
         */
        this.formatTime = function (sec) {
            var m = Math.floor(sec / 60),
                s = sec % 60;

            if (!m && !s) {
                general.$('spanKarmaTimer').innerHTML = '&nbsp';
                general.setData('', 27);
                return;
            }

            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            general.$('karmaTimer').innerHTML = m + ':' + s;

            var _this = this;
            general.root.setTimeout(function () {
                _this.formatTime(sec - 1);
            }, 1000);
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // на странице личных NPC не работает
            if (general.$('npc_log_book')) {
                return;
            }

            // поставили карму, запоминаем время
            if (/vote/.test(general.loc) &&
                    /Спасибо, Ваше мнение учтено/.
                        test(general.doc.body.innerHTML)) {
                general.setData(new Date().getTime().toString(), 27);
                return;
            }

            var time = +general.getData(27)[0];
            if (time) {
                var difference = new Date().getTime() - time;
                if (general.doc.querySelector('a[href*="/info.vote.php?id="]' +
                        '[title^="Отправить Ваш голос"]') ||
                            difference > 1800000) {
                    general.setData('', 27);
                    return;
                }

                var span = general.doc.createElement('span');
                span.setAttribute('id', 'spanKarmaTimer');
                span.setAttribute('style', 'margin-left: 5px; color: #07A703;');
                span.innerHTML = '» Вы сможете выставить карму через ' +
                    '<span id="karmaTimer" style="color: #056802;"></span>';

                var css = 'td[colspan="3"][class="greenbrightbg"]>' +
                        'table[width="100%"]',
                    target = general.doc.querySelector(css);

                if (target) {
                    var prnt = target.parentNode;
                    prnt.removeChild(target.nextElementSibling);
                    prnt.insertBefore(span, target.nextElementSibling);

                    var tm = +((1800000 - difference) / 1000).toFixed(0);
                    this.formatTime(tm);
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ImgPokemonsOnBattle {{{1
     * @constructor
     */
    var ImgPokemonsOnBattle = function () {
        /**
         * @method deleteImagePoks {{{2
         */
        this.deleteImagePoks = function () {
            var divs = general.doc.querySelectorAll('div[name="imagepokemon"]'),
                i;

            for (i = 0; i < divs.length; i++) {
                divs[i].parentNode.removeChild(divs[i]);
            }
        }; // 2}}}

        /**
         * @method showImagePoks {{{2
         */
        this.showImagePoks = function () {
            var enemies = general.doc.
                    querySelectorAll('div[style*="font-size:8pt;"]>' +
                        'span[class="battletags"]+nobr>b'),
                getPos = new GetPos().init,
                name,
                size,
                txt,
                pos,
                div,
                i;

            for (i = 0; i < enemies.length; i++) {
                txt = enemies[i].innerHTML;
                name = null;
                if (txt === 'Боец ОМОН') {
                    name = 'omon';
                    size = [50, 60];
                } else if (/\s\[NPC\]$/.test(txt)) {
                    name = 'personalnpc';
                    size = [30, 30];
                } else if (/(^[^\s]+)\s\[/.test(txt)) {
                    name = /(^[^\s]+)\s\[/.exec(txt)[1];
                    size = [70, 80];
                }

                if (name) {
                    pos = getPos(enemies[i].parentNode);
                    div = general.doc.createElement('div');
                    general.doc.body.appendChild(div);
                    div.setAttribute('style', 'position: absolute;');
                    div.setAttribute('name', 'imagepokemon');
                    div.style.left = String(pos.x > 200 ?
                            pos.x - size[0] - 5 : pos.x + 140);
                    div.style.top = String(pos.y);
                    div.innerHTML = '<img src="' + general.imgPath +
                        'ImgPokemonsOnBattle/' + name + '.png" ' +
                        'style="width: ' + size[0] + 'px; height: ' + size[1] +
                        'px;" title="' + name + '" alt="' + name + '" />';
                }
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            this.showImagePoks();

            // JS-версия боя
            if (/\/b0\/btl\.php/.test(general.loc)) {
                var _this = this;
                general.root.setInterval(function () {
                    _this.deleteImagePoks();
                    _this.showImagePoks();
                }, 1000);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class SoundSyndBattle {{{1
     * @constructor
     */
    var SoundSyndBattle = function () {
        /**
         * @property redLink
         * @type {HTMLElement|null}
         */
        this.redLink = null;

        /**
         * @method setTimer {{{2
         * @param   {int}   sec
         */
        this.setTimer = function (sec) {
            var m = Math.floor(sec / 60),
                s = sec % 60;

            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            this.redLink.innerHTML = this.redLink.innerHTML.
                replace(/\d+:\d+/, m + ':' + s);

            var _this = this;
            s = sec - 1;
            if (s > -1) {
                general.root.setTimeout(function () {
                    _this.setTimer(s);
                }, 1000);
            }
        }; // 2}}}

        /**
         * @method syndAlert {{{2
         * @param   {String}    dataCheck
         * @param   {String}    data
         * @param   {int}       sound
         * @param   {int}       tm
         */
        this.syndAlert = function (dataCheck, data, sound, tm) {
            general.root.setTimeout(function () {
                var stData = general.getData(28);
                if (stData[3] === dataCheck) {
                    stData[3] = data;
                    general.setData(stData, 28);
                    new PlaySound().init(sound);
                }
            }, tm);
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var stData = general.getData(28);

            if (!general.doc.querySelector('a[href*="/me.php"]' +
                        '[title^="Наличность"]')) {
                return;
            }

            this.redLink = general.doc.
                    querySelector('a[style*="color:#ff0000;"]' +
                        '[title^="Ваш синдикат в нападении"]');

            if (!this.redLink) {
                stData[3] = '';
                general.setData(stData, 28);
                return;
            }

            // для нового оформления игры
            if (/\[(\d+):(\d+)\]/.
                    test(this.redLink.nextElementSibling.innerHTML)) {
                this.redLink = this.redLink.nextElementSibling;
            }

            var time = /\[(\d+):(\d+)\]/.exec(this.redLink.innerHTML),
                timeLimit = +stData[0],
                sound1 = +stData[1],
                sound2 = +stData[2];

            if (time && timeLimit > 14) {
                // noinspection JSRemoveUnnecessaryParentheses
                var t = +time[1] * 60 + (+time[2]);
                this.redLink.href = '/wargroup.php?war=attacks';
                this.setTimer(t);

                var getRandom = new GetRandom().init;
                if (!stData[3]) {
                    if (t > timeLimit) {
                        this.syndAlert('', '1', sound1, getRandom(0, 3000));
                        this.syndAlert('1', '2', sound2,
                                (t - timeLimit) * 1000 + getRandom(0, 3000));
                    } else {
                        this.syndAlert('', '2', sound2, getRandom(0, 3000));
                    }
                } else if (t > timeLimit && stData[3] === '2') {
                    this.syndAlert('2', '1', sound1, getRandom(0, 3000));
                    this.syndAlert('1', '2', sound2,
                            (t - timeLimit) * 1000 + getRandom(0, 3000));
                } else if (t <= timeLimit && stData[3] === '1') {
                    this.syndAlert('1', '2', sound2, getRandom(0, 3000));
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class AdvForum {{{1
     * @constructor
     */
    var AdvForum = function () {
        /**
         * @property lifeTime
         * @type {int}
         */
        this.lifeTime = 3 * 24 * 60 * 60 * 1000;
        /**
         * @property parseLoc
         * @type {Array|null}
         */
        this.parseLoc = /\?fid=(\d+)(&tid=(\d+))?/.exec(general.loc);

        /**
         * @method getForumTable {{{2
         * @return  {HTMLElement}
         */
        this.getForumTable = function () {
            return general.doc.querySelector('center+br+center+table');
        }; // 2}}}

        /**
         * @method processingThemesList {{{2
         */
        this.processingThemesList = function () {
            var table = this.getForumTable(),
                tableContent = table.innerHTML,
                fid = this.toHex(this.parseLoc[1]);

            // настройки
            this.setSettins(table, fid);

            var stData = general.getData(29),
                json = JSON.parse(stData[7]),
                json1 = JSON.parse(stData[8]),
                trs = table.querySelectorAll('tr'),
                lastTheme = true,
                themeDataStorage,
                themeLink,
                imgClosed,
                imgEyes,
                tid,
                i;

            for (i = 1; i < trs.length; i++) {
                trs[i].style.display = '';
                themeLink = trs[i].querySelector('td>a');

                // прикрепленки пропускаем или скрываем, не отслеживаем
                if (themeLink.firstElementChild) {
                    if (stData[4]) {
                        trs[i].style.display = 'none';
                    }

                    continue;
                }

                tid = this.toHex(+/&tid=(\d+)/.exec(themeLink.href)[1]);
                // верхняя тема на первой странице
                if (/\?fid=\d+(&page_id=0)?$/.test(general.loc) && lastTheme) {
                    lastTheme = false;
                    // id первой темы в хранилище не равен id первой
                    // темы на странице - играем звук, запоминаем тему
                    if (json1[fid] !== tid) {
                        // если не первый раз заходим в данную ветку
                        if (json1[fid]) {
                            new PlaySound().init(stData[1]);
                        }

                        json1[fid] = tid;
                        stData[8] = JSON.stringify(json1);
                        general.setData(stData, 29);
                    }
                }

                // закрытые темы
                if (/тема закрыта/.test(trs[i].
                        querySelector('td:last-child').innerHTML)) {
                    // скрытие закрытой темы
                    if (stData[3]) {
                        trs[i].style.display = 'none';
                        continue;
                    }

                    // отметка скрытой темы
                    if (stData[0]) {
                        imgClosed = general.doc.createElement('img');
                        imgClosed.setAttribute('style', 'height: 10px; ' +
                                'width: 10px; margin-right: 3px;');
                        imgClosed.title = 'Тема закрыта';
                        imgClosed.src = general.imgPath + 'AdvForum/closed.png';
                        themeLink.parentNode.insertBefore(imgClosed, themeLink);
                    }
                }

                // есть отслеживаемые темы в текущей ветке форума
                if (json[fid]) {
                    themeDataStorage = json[fid][tid];

                    // текущая тема отслеживается
                    if (themeDataStorage) {
                        imgEyes = general.doc.createElement('img');
                        imgEyes.setAttribute('style', 'margin-right: ' +
                            '3px; height: 12px; width: 12px; cursor: ' +
                            'pointer;');
                        imgEyes.setAttribute('title',
                                'Отменить отслеживание темы');
                        themeLink.parentNode.
                            insertBefore(imgEyes, themeLink);
                        imgEyes.src = general.imgPath + 'AdvForum/';
                        imgEyes.addEventListener('click',
                            this.cleanStorage(fid, tid, tableContent), false);

                        // появилось новое сообщение
                        if (themeDataStorage.c !== /\d+/.exec(trs[i].
                                querySelectorAll('td')[2].innerHTML)[0]) {
                            imgEyes.src += 'eyesPlus.png';
                        } else {
                            imgEyes.src += 'eyes.png';
                        }
                    }
                }
            }

            var tm = +stData[2];
            if (tm) {
                general.root.setTimeout(function () {
                    general.root.location.reload();
                }, tm * 1000);
            }
        }; // 2}}}

        /**
         * @method cleanStorage {{{2
         * @param   {String}    f
         * @param   {String}    t
         * @param   {String}    tableHTML
         * @return  {Function}
         */
        this.cleanStorage = function (f, t, tableHTML) {
            var _this = this;

            return function () {
                var stData = general.getData(29),
                    json = JSON.parse(stData[7]),
                    tmp = {},
                    fid,
                    tid;

                for (fid in json) {
                    if (json.hasOwnProperty(fid)) {
                        // удаляется ветка форума
                        if (f && !t && fid === f && general.root.
                                confirm('Удалить все данные ветки?')) {
                            continue;
                        }

                        for (tid in json[fid]) {
                            if (json[fid].hasOwnProperty(tid)) {
                                // удаляется тема форума
                                if (f && t && fid === f && t === tid &&
                                        general.root.
                                            confirm('Не отслеживать тему?')) {
                                    continue;
                                }

                                if (_this.toDec(json[fid][tid].d) +
                                        _this.lifeTime > new Date().getTime()) {

                                    if (!tmp[fid]) {
                                        tmp[fid] = {};
                                    }

                                    tmp[fid][tid] = json[fid][tid];
                                }
                            }
                        }
                    }
                }

                stData[7] = JSON.stringify(tmp);
                general.setData(stData, 29);

                if (tableHTML) {
                    _this.getForumTable().innerHTML = tableHTML;
                    _this.processingThemesList();
                }
            };
        }; // 2}}}

        /**
         * @method toDec {{{2
         * @param   {String} hex
         * @return  {int}
         */
        this.toDec = function (hex) {
            return parseInt(hex, 16);
        }; // 2}}}

        /**
         * @method toHex {{{2
         * @param   {int}       dec
         * @return  {String}
         */
        this.toHex = function (dec) {
            return Number(dec).toString(16);
        }; // 2}}}

        /**
         * @method showHideForum {{{2
         */
        this.showHideForum = function () {
            return function () {
                var stData = general.getData(29),
                    f = stData[6].split(','),
                    _this = this,
                    ind = /\d+/.exec(_this.id)[0];

                f[ind] = _this.checked ? '1' : '';
                stData[6] = f.join(',');
                general.setData(stData, 29);
            };
        }; // 2}}}

        /**
         * @method setSettins {{{2
         * @param   {HTMLElement}   table
         * @param   {String}        fid
         */
        this.setSettins = function (table, fid) {
            // кнопка настройки
            var tableContent = table.innerHTML,
                imgSettins = general.doc.createElement('img');

            imgSettins.src = 'https://images.' +
                general.domain.replace('www.', '') + '/i/home/properties.gif';
            imgSettins.setAttribute('style', 'cursor: pointer; ' +
                    'margin-left: 10px;');
            imgSettins.setAttribute('title', 'Настройки');

            // кнопка сброса всех данных ветки
            var imgReset = general.doc.createElement('img');
            imgReset.src = 'https://images.' +
                general.domain.replace('www.', '') + '/i/home/questlog.gif';
            imgReset.setAttribute('style', 'cursor: pointer; ' +
                    'margin-left: 10px;');
            imgReset.setAttribute('title', 'Сбросить все данные ветки');
            imgReset.addEventListener('click',
                        this.cleanStorage(fid, '', tableContent), false);

            var td = table.querySelector('td');
            td.appendChild(imgSettins);
            td.appendChild(imgReset);

            var _this = this;
            imgSettins.addEventListener('click', function () {
                var themes = [
                        ['Официальные объявления', '1'],
                        ['Вопросы и помощь в игре', '49'],
                        ['Общий Форум', '27'],
                        ['Идеи и предложения', '2'],
                        ['Форум для неигровых тем', '22'],
                        ['Клуб Нытиков', '55'],
                        ['Объявления синдикатов', '38'],
                        ['Вступлю в синдикат', '56'],
                        ['Конкурсы', '3'],
                        ['Благодарности и поздравления', '4'],
                        ['Offline встречи', '6'],
                        ['Креатив', '23'],
                        ['Официальные объявления налоговой инспекции', '24'],
                        ['Официальные объявления суда', '11'],
                        ['Зал суда', '12'],
                        ['Зал бракосочетаний', '29'],
                        ['Дворец Бракосочетания', '50'],
                        ['Техническая поддержка', '17'],
                        ['Баги и глюки (общее)', '18'],
                        ['Баги и глюки (финансовые вопросы)', '19'],
                        ['Проблемы с боями', '20'],
                        ['Проблемы с персонажами', '33'],
                        ['Respect Hill', '25']
                    ],
                    stData = general.getData(29),
                    f = stData[6].split(','),
                    str = '',
                    i;

                for (i = 0; i < themes.length; i++) {
                    str += '<tr><td><a target="_blank" ' +
                        'href="https://' + general.domain + '/threads.php?' +
                        'fid=' + themes[i][1] + '">' + themes[i][0] + '</a>' +
                        '</td><td><input id="showForum_' + i + '" ' +
                        'type="checkbox"' + (f[i] ? ' checked' : '') +
                        ' /></td></tr>';
                }

                table.innerHTML = '<tr><td><table><tr><td>Отмечать закрытые ' +
                    'темы</td><td><input id="markClosed" type="checkbox" />' +
                    '</td></tr><tr><td>Не показывать закрытые темы</td>' +
                    '<td><input id="showClosed" type="checkbox" /></td></tr>' +
                    '<tr><td>Не показывать прикрепленки</td><td>' +
                    '<input id="showAttached" type="checkbox" /></td></tr>' +
                    '<tr><td>Интервал перезагрузки страниц с темами форума ' +
                    '(> 4)</td><td><input id="reloadInterval" ' +
                    'maxlength="3" style="width: 40px;" /> сек (0 или пустое ' +
                    'поле - без перезагрузки)</td></tr><tr><td>Звук при ' +
                    'появлении новой темы</td><td>' +
                    new GetSelectSound().init('sound') +
                    '</td></tr><tr><td>Номера исключенных веток форума<br>' +
                    '(параметр fid=xxx в ссылке на форум)</td><td>' +
                    '<input id="exclusion" style="width: ' +
                    '400px;" /></td></tr><tr><td colspan="2" ' +
                    'style="padding-top: 10px;"><span id="return" ' +
                    'style="cursor: pointer; color: #990000; font-weight: ' +
                    'bold;"><< Назад</span></td></tr><tr><td colspan="2" ' +
                    'style="font-weight: bold; padding-top: 10px;">' +
                    'Показывать ветки форума на <a target="_blank" ' +
                    'href="https://' + general.domain + '/forum.php">' +
                    'этой странице</a>:</td></tr>' + str + '</table></td></tr>';

                // чекбокс "Отмечать закрытые"
                var markClosed = general.$('markClosed');
                markClosed.checked = stData[0];
                markClosed.addEventListener('click', function () {
                    var data = general.getData(29);
                    data[0] = markClosed.checked ? '1' : '';
                    general.setData(data, 29);
                }, false);

                // чекбокс "Не показывать закрытые темы"
                var showClosed = general.$('showClosed');
                showClosed.checked = stData[3];
                showClosed.addEventListener('click', function () {
                    var data = general.getData(29);
                    data[3] = showClosed.checked ? '1' : '';
                    general.setData(data, 29);
                }, false);

                // чекбокс "Не показывать прикрепленки"
                var showAttached = general.$('showAttached');
                showAttached.checked = stData[4];
                showAttached.addEventListener('click', function () {
                    var data = general.getData(29);
                    data[4] = showAttached.checked ? '1' : '';
                    general.setData(data, 29);
                }, false);

                // текстовое поле "Интервал перезагрузки страниц"
                var reloadInterval = general.$('reloadInterval');
                reloadInterval.value = stData[2] || '0';
                reloadInterval.addEventListener('input', function () {
                    var data = general.getData(29),
                        val = +reloadInterval.value;

                    data[2] = val && val > 4 ? val.toString() : '';
                    general.setData(data, 29);
                }, false);

                // выбор и прослушивание звука
                var selSound = general.$('sound'),
                    lSound = general.$('lsound');

                selSound.disabled = false;
                lSound.disabled = false;
                lSound.addEventListener('click', function () {
                    new PlaySound().init(selSound.value);
                }, false);

                selSound.value = stData[1] || '0';
                selSound.addEventListener('change', function () {
                    var data = general.getData(29),
                        val = selSound.value;

                    data[1] = val === '0' ? '' : val;
                    general.setData(data, 29);
                }, false);

                // поле с номерами форумов-исключений
                var exclusion = general.$('exclusion');
                exclusion.value = stData[5];
                exclusion.addEventListener('input', function () {
                    var data = general.getData(29);
                    data[5] = exclusion.value.replace(/\s+/g, '');
                    general.setData(data, 29);
                }, false);

                // кнопка "Назад"
                general.$('return').addEventListener('click', function () {
                    table.innerHTML = tableContent;
                    _this.processingThemesList();
                }, false);

                // обработчики чекбоксов скрытия/показа форумов
                var chks = table.querySelectorAll('input[id^="showForum_"]');
                for (i = 0; i < chks.length; i++) {
                    chks[i].
                        addEventListener('click', _this.showHideForum(), false);
                }
            }, false);
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            var stData = general.getData(29),
                i;

            // на странице списка форумов
            if (/\/forum\.php$/.test(general.loc)) {
                var allBranches = general.doc.querySelectorAll('tr>' +
                        'td[valign="top"][onclick*="/threads.php?fid="]'),
                    f = stData[6].split(','),
                    j = 0;

                for (i = 0; i < allBranches.length; i++) {
                    if (!/Форум синдиката #\d+/.
                            test(allBranches[i].innerHTML)) {

                        // noinspection JSUnresolvedVariable
                        allBranches[i].parentNode.style.display = f[j] ?
                                                            '' : 'none';
                        j++;
                    }
                }

                return;
            }

            var fid = this.parseLoc[1];
            // исключенные форумы
            if (new RegExp('(^|,)' + fid + '(,|$)').test(stData[5])) {
                return;
            }

            fid = this.toHex(fid);
            // на странице сообщений в теме
            if (/\/messages\.php\?/.test(general.loc)) {
                var json = JSON.parse(stData[7]),
                    tid = this.toHex(this.parseLoc[3]);

                // нет ветки форума в хранилище
                if (!json[fid]) {
                    json[fid] = {};
                }

                // нет темы в хранилище
                if (!json[fid][tid]) {
                    json[fid][tid] = {
                        d: this.toHex(new Date().getTime()),
                        l: '0', // id последнего сообщения на странице
                        c: ''   // номер последнего сообщения
                    };
                }

                // просматриваем сообщения на странице
                var allMess = general.doc.querySelectorAll('td[id^="cella_"]'),
                    lastSavedId,
                    currMessId;

                for (i = 0; i < allMess.length; i++) {
                    lastSavedId = this.toDec(json[fid][tid].l);
                    currMessId = +/\d+/.exec(allMess[i].id)[0];
                    // или сообщение новое или еще не заходили в тему
                    if (lastSavedId < currMessId) {
                        // если это сообщение не наше и уже заходили
                        // в тему, устанавливаем метку "New"
                        if (/\?id=(\d+)/.exec(allMess[i].querySelector('b>a').
                                href)[1] !== general.myID && lastSavedId) {

                            allMess[i].innerHTML = '<span style="color: ' +
                                '#339900; font-weight: bold; float: right;">' +
                                '[New]</span>' + allMess[i].innerHTML;
                        }

                        // если сообщение последнее на странице
                        // запоминаем его данные в хранилище
                        if (!allMess[i + 1]) {
                            json[fid][tid].l = this.toHex(currMessId);
                            json[fid][tid].c = allMess[i].nextElementSibling.
                                querySelector('a').innerHTML;
                            stData[7] = JSON.stringify(json);
                            general.setData(stData, 29);
                        }
                    }
                }

                return;
            }

            // на странице списка тем ветки форума
            if (/\/threads\.php\?/.test(general.loc)) {
                var spanClean = general.doc.createElement('span');
                general.doc.body.appendChild(spanClean);
                spanClean.addEventListener('click',
                            this.cleanStorage('', '', ''), false);
                // удаляем старые темы из хранилища
                spanClean.click();

                this.processingThemesList();
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class DelAndAddBlackSms {{{1
     * @constructor
     */
    var DelAndAddBlackSms = function () {
        /**
         * @method init {{{2
         */
        this.init = function () {
            var del = general.doc.querySelector('td>a[class="mainbutton"]' +
                    '[href*="&do_black=1&addblack="]');

            if (del) {
                del.setAttribute('style', 'background: #FDD8D8;');

                del.addEventListener('click', function (e) {
                    if (!general.
                            root.confirm('Удалить и забанить. Уверены ???')) {

                        var ev = e || general.root.event;
                        ev.preventDefault();
                    }
                }, false);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class Regeneration {{{1
     * @constructor
     */
    var Regeneration = function () {
        // noinspection JSUnusedGlobalSymbols
        /**
         * @property currentHp
         * @type {int}
         */
        this.currentHp = 0;
        /**
         * @property maxHp
         * @type {int}
         */
        this.maxHp = 0;
        /**
         * @property speedHpRecovery
         * @type {int}
         */
        this.speedHpRecovery = 0;
        /**
         * @property spanHP
         * @type {HTMLElement|null}
         */
        this.spanHP = null;
        /**
         * @property progressBar
         * @type {HTMLDivElement|null}
         */
        this.progressBar = null;
        /**
         * @property pbWidth
         * @type {int}
         */
        this.pbWidth = 230;
        /**
         * @property pbHeight
         * @type {int}
         */
        this.pbHeight = 4;

        /**
         * @method formatTime {{{2
         * @param   {int}   sec
         * @return  {String}
         */
        this.formatTime = function (sec) {
            var str = '';
            if (sec >= 3600) {
                var h = Math.floor(sec / 3600);
                str += '0' + h + ':';
                sec -= h * 3600;
            }

            var m = Math.floor(sec / 60);
            str += m ? (m < 10 ? '0' + m : m) : '00';
            str += ':';
            sec -= m * 60;

            str += sec < 10 ? '0' + sec : sec;
            return str;
        }; // 2}}}

        /**
         * @method hpupdate {{{2
         * @param   {Boolean}   first
         */
        this.hpupdate = function (first) {
            if (!first) {
                this.currentHp += this.speedHpRecovery;
            }

            if (this.currentHp > this.maxHp) {
                this.currentHp = this.maxHp;
            }

            // текущее HP в процентах
            var hpPercent = Math.floor((this.currentHp * 100) / this.maxHp);
            this.spanHP.innerHTML = '[' + hpPercent + '%]';

            // прогресс бар
            if (hpPercent >= 100) {
                // noinspection JSUnresolvedVariable
                this.progressBar.parentNode.style.display = 'none';
            } else if (hpPercent < 0) {
                // если кильнули
                this.progressBar.style.width = '0';
            } else {
                this.progressBar.style.width = String(Math.ceil(this.pbWidth *
                    hpPercent / 100) + 1);
            }

            //паказываем время
            var sec;
            if (hpPercent < 100) {
                sec = Math.floor((this.maxHp - this.currentHp) /
                        this.speedHpRecovery);
                this.spanHP.innerHTML += ' <span ' +
                    'style="font-weight: bold; color: #008000;">[' +
                    this.formatTime(sec) + ']</span>';
            }

            if (hpPercent < 80) {
                sec = Math.floor((this.maxHp * 0.8 - this.currentHp) /
                        this.speedHpRecovery);
                this.spanHP.innerHTML += ' <span ' +
                    'style="font-weight: bold; color: #FF0000;"> [' +
                    this.formatTime(sec)  + ']</span>';
            }

            var stData = general.getData(31),
                playSound = new PlaySound().init;

            if (hpPercent < 100 && hpPercent  >= 80 && !stData[2]) {
                stData[2] = '1';
            }

            if (hpPercent === 100 && stData[2] === '3') {
                stData[2] = '2';
            }

            if (stData[2] === '1') {
                playSound(stData[0]);
                stData[2] = '3';
            } else if (stData[2] === '2') {
                playSound(stData[1]);
                stData[2] = '4';
            } else if ((stData[2] === '3' || stData[2] === '4') &&
                    hpPercent < 100) {
                stData[2] = hpPercent < 80 ? '' : '3';
            }

            general.setData(stData, 31);

            var _this = this;
            if (stData[2] !== '4') {
                general.root.setTimeout(function () {
                    _this.hpupdate(false);
                }, 1000);
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // на главной странице личного NPC
            if (/\?nid=\d+/.test(general.loc)) {
                return;
            }

            var target = general.doc.querySelector('div#hpdiv');
            if (target) {
                var divHealth = general.doc.createElement('div');
                divHealth.setAttribute('style', 'color: #0000FF;');
                divHealth.innerHTML = '&nbsp;» ' +
                    '<span style="font-weight: bold;">Выздоровление:</span> ' +
                    '<span id="regenHpPercent"></span>' +
                    '<div style="width: 230px; border: 1px #BBCCBB solid; ' +
                            'margin: 2px 0 3px 3px; box-shadow: 1px 1px 3px ' +
                            'rgba(122,122,122,0.5);">' +
                        '<div id="progressBar" style="width: ' + this.pbWidth +
                            'px; height: ' + this.pbHeight + '; ' +
                            'background-image: url(' + general.imgPath +
                            'Regeneration/line.png);">' +
                        '</div>' +
                    '</div>';

                target = target.nextElementSibling;
                target.parentNode.insertBefore(divHealth, target.nextSibling);

                this.spanHP = general.$('regenHpPercent');
                this.progressBar = general.$('progressBar');

                // noinspection JSUnusedGlobalSymbols
                /** @namespace general.root.hp_start_h */
                this.currentHp = +general.root.hp_start_h;
                /** @namespace general.root.hp_max_h */
                this.maxHp = +general.root.hp_max_h;
                /** @namespace general.root.hp_speed_h */
                this.speedHpRecovery = parseFloat(general.root.hp_speed_h);

                this.hpupdate(true);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ProfColor {{{1
     * @constructor
     */
    var ProfColor = function () {
        /**
         * @property activeProfs
         * @type {NodeList}
         */
        this.activeProfs = general.doc.
                querySelectorAll('tr>td>font[color="#006600"]');

        /**
         * @method init {{{2
         */
        this.init = function () {
            var i;
            for (i = 0; i < this.activeProfs.length; i++) {
                this.activeProfs[i].setAttribute('color', '#FF0000');
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class CurrentQuestOnInfo {{{1
     * @constructor
     */
    var CurrentQuestOnInfo = function () {
        /**
         * @property persID
         * @type {String}
         */
        this.persID = /\?id=(\d+)/.exec(general.loc)[1];
        /**
         * @property tm
         * @type {int}
         */
        this.tm = 1200;
        /**
         * @property target
         * @type {Element|null}
         */
        this.target = general.doc.querySelector('#actiondivin');

        /**
         * @method showQuest {{{2
         * @param   {String}    url
         */
        this.showQuest = function (url) {
            var _this = this;
            new AjaxQuery().init(url, 'GET', null, true, function (xhr) {
                var spanContent = general.doc.createElement('span');
                spanContent.innerHTML = xhr.responseText;

                // noinspection JSUnresolvedVariable
                var cssSelector = 'td[valign="top"][align="right"]>' +
                        'a[href*="/help/index.php?sid="]',
                    td = spanContent.querySelector(cssSelector).parentNode.
                        previousElementSibling,
                    questDescr = td.firstElementChild.nextSibling.nodeValue,
                    reg = /^\s*(.*):\s*(\d+) из (\d+)/.exec(questDescr),
                    acQuests = />(\d+)</.exec(td.innerHTML),
                    bLevel = general.doc.
                        querySelector('span[onclick^="return pip_load("]').
                            previousElementSibling.firstElementChild.innerHTML;

                if (!reg || !acQuests || !bLevel) {
                    return;
                }

                var isDone = +reg[2] >= +reg[3],
                    span = general.doc.createElement('span');

                span.setAttribute('style', 'margin-left: 7px; font-size: 8pt;');
                span.innerHTML = '<span id="questDesc">' + reg[1] + ' [' +
                    '<a href="https://' + general.domain + '/questlog.php?id=' +
                    _this.persID + '" style="color: ' +
                    (isDone ? '#008700' : '#AA5500') + '; ' +
                    'text-decoration: none; font-size: 8pt;" target="_blank">' +
                    reg[2] + '</a>/' + reg[3] + ']</span> ' +
                    '(<a target="_blank" style="color:#007700; ' +
                    'font-weight: bold; text-decoration: none;" ' +
                    'href="https://' + general.domain + '/help/index.php?' +
                    'sid=102&pid=45">' + acQuests[1] + '</a>)' +
                    '<img src="https://images.' +
                    general.domain.replace('www.', '') + '/i/home/wlog.gif" ' +
                    'id="showHideQuestList" border="0" width="12" ' +
                    'height="10" style="margin-left: 3px; cursor: pointer;" ' +
                    'alt="img" />' +
                    '<div id="questList" style="display: none;">' +
                    '<ul>' +
                        '<li>Поймать рыбу 1 раз<br>' +
                            '<span style="color: #4E4E4E;">(ловить можно не ' +
                            'чаще, чем раз в 40 минут, с 8 до 11 и с 17 до ' +
                            '20 часов по серверу)</span>' +
                            '<li>Зайти на замену и выжить в 2 боях' +
                        '<li>Выжить в 5 боях на Outland<br>' +
                            '<span style="color: #4E4E4E;">(засчитывается и ' +
                            'в прибрежной зоне)</span>' +
                        '<li>Нанести в синдикатных боях суммарный урон в ' +
                            (bLevel * 20).toString() + ' HP' +
                        '<li>Убить хотя бы одного врага в 3 синдикатных ' +
                            'боях<br><span style="color: #4E4E4E;">(бои за ' +
                            'бункер не учитываются)</span>' +
                        '<li>Сделать 3 критических попадания из снайперской ' +
                            'винтовки или автомата<br>' +
                            '<span style="color: #4E4E4E;">(Если после боя ' +
                            'ломается оружие и персонаж оказывается с ' +
                            'пустыми руками, то все попадания, сделанные в ' +
                            'этом бою, не засчитаются. Для двуручного оружия ' +
                            'криты считаются с левой, при этом в правой ' +
                            'должен быть тип оружия, на которое в квесте ' +
                            'запрошены криты.)</span>' +
                        '<li>Сделать 30 критических попаданий из пулемета' +
                        '<li>На Outland нанести Z-Lands суммарный урон ' +
                            (bLevel * 20).toString() + ' HP' +
                        '<li>Убить гранатой 2 Z-Lands<br>' +
                            '<span style="color: #4E4E4E;">(горение идёт в ' +
                            'зачёт)</span>' +
                        '<li>Привезти 5 предметов с Outland' +
                        '<li>Сделать 4 критических попаданий из ' +
                            'пистолетов-пулеметов<br>' +
                            '<span style="color: #4E4E4E;">(для двуручного ' +
                            'оружия криты считаются с левой, при этом в ' +
                            'правой должен быть тип оружия, на которое в ' +
                            'квесте запрошены криты)</span>' +
                            '<li>Выполнить 2 задания NPC' +
                        '<li>Убить 3 врагов в уличных боях' +
                        '<li>Выжить в 5 общих групповых боях<br>' +
                            '<span style="color: #4E4E4E;">(в зачёт идут ' +
                            'нападения на бункер для всех)</span>' +
                        '<li>Убить 7 Z-Lands на Outland<br>' +
                            '<span style="color: #4E4E4E;">(Засчитывается и ' +
                            'в прибрежной зоне. Горение идёт в зачёт.)</span>' +
                        '<li>5 раз нанести врагу урон гранатой<br>' +
                            '<span style="color: #4E4E4E;">(Подразумевается, ' +
                            'что в пяти боях, туз в рукаве не засчитывается. ' +
                            'Горение идёт в зачёт.)</span>' +
                        '<li>Выжить в 4 синдикатных боях<br>' +
                            '<span style="color: #4E4E4E;">(бои за бункер ' +
                            'не учитываются)</span>' +
                    '</ul></div>';

                _this.target.parentNode.setAttribute('width', '100%');
                _this.target.parentNode.nextElementSibling.
                    removeAttribute('width');
                _this.target.appendChild(span);

                var desc = general.$('questDesc');
                if (/суммарный урон.* \d+ HP/.test(desc.innerHTML)) {
                    var val = bLevel * 20;
                    desc.innerHTML = desc.innerHTML.
                        replace(/\d+ HP/, val + ' HP');
                    desc.innerHTML = desc.innerHTML.
                        replace(/\/\d+\]/, '/' + val + ']');
                }

                var questList = general.$('questList'),
                    li = questList.querySelectorAll('li'),
                    i;

                desc = /^(.*) \[/.exec(desc.innerHTML)[1];
                for (i = 0; i < li.length; i++) {
                    if (li[i].innerHTML.indexOf(desc) !== -1) {
                        li[i].setAttribute('style', 'border: #000000 1px ' +
                            'dotted; background: ' +
                            (isDone ? '#D0EED0' : '#DADADA') + ';');

                        break;
                    }
                }

                general.$('showHideQuestList').
                    addEventListener('click', function () {
                        var display = questList.style.display;
                        questList.style.display = display ? '' : 'none';
                    }, false);
            }, function () {
                general.root.setTimeout(function () {
                    _this.showQuest(url);
                }, _this.tm);
            });
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (this.persID && this.target) {
                this.showQuest('https://' + general.domain +
                    '/questlog.php?id=' + this.persID);
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class CommonBattleFilter {{{1
     * @constructor
     */
    var CommonBattleFilter = function () {
        /**
         * @property battleTable
         * @type {Object|null}
         */
        this.battleTable = null;

        /**
         * @method getLvl {{{2
         * @param   {Object}    row
         * @return  {int}
         */
        this.getLvl = function (row) {
            return +row.querySelector('font[color="red"]').innerHTML.
                split('-')[1];
        }; // 2}}}

        /**
         * @method sortBattleTable {{{2
         */
        this.sortBattleTable = function () {
            var stData = general.getData(20),
                row,
                i;

            for (i = 1; i < this.battleTable.rows.length; i++) {
                row = this.battleTable.rows[i];
                row.style.display = '';

                stData[0] = +stData[0];
                if (stData[0] && this.getLvl(row) > stData[0]) {
                    row.style.display = 'none';
                }

                if (stData[1] && !/<s>именные<\/s>/.test(row.innerHTML)) {
                    row.style.display = 'none';
                }

                if (stData[2] && !/по мощности/.test(row.innerHTML)) {
                    row.style.display = 'none';
                }
            }
        }; // 2}}}

        /**
         * @method getSelect {{{2
         * @param   {String}    id
         * @return  {String}
         */
        this.getSelect = function (id) {
            return '<select id="' + id + '" style="margin-right: 3px;">' +
                '<option value="0">Любой&nbsp;</option>' +
                '<option value="5">5</option>' +
                '<option value="6">6</option>' +
                '<option value="7">7</option>' +
                '<option value="8">8</option>' +
                '<option value="9">9</option>' +
                '<option value="10">10</option>' +
                '<option value="11">11</option>' +
                '<option value="12">12</option>' +
                '<option value="13">13</option>' +
                '<option value="14">14</option>' +
                '<option value="15">15</option>' +
                '<option value="16">16</option>' +
                '<option value="17">17</option>' +
                '<option value="18">18</option>' +
                '<option value="19">19</option>' +
                '<option value="20">20</option>' +
                '<option value="21">21</option>' +
                '<option value="22">22</option>' +
                '<option value="23">23</option>' +
                '<option value="24">24</option>' +
                '<option value="25">25</option>' +
                '<option value="26">26</option>' +
                '<option value="27">27</option>' +
                '<option value="28">28</option>' +
                '<option value="29">29</option>' +
                '<option value="30">30</option>' +
                '<option value="31">31</option>' +
                '<option value="32">32</option>' +
                '<option value="33">33</option>' +
                '<option value="34">34</option>' +
                '<option value="35">35</option>' +
                '<option value="36">36</option>' +
                '<option value="37">37</option>' +
                '<option value="38">38</option>' +
                '<option value="39">39</option>' +
                '<option value="40">40</option>' +
                '<option value="41">41</option>' +
                '<option value="42">42</option>' +
                '<option value="43">43</option>' +
                '<option value="44">44</option>' +
                '<option value="45">45</option>' +
                '<option value="46">46</option>' +
                '<option value="47">47</option>' +
                '<option value="48">48</option>' +
                '<option value="49">49</option>' +
                '<option value="50">50</option>' +
                '</select>';
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // форма создания заявки
            if (/&form=\d+/.test(general.loc)) {
                return;
            }

            // основная таблица общих заявок
            this.battleTable = general.doc.querySelector('table[border="0"]' +
                '[cellpadding="5"][cellspacing="1"][style="padding-left:10px;' +
                'padding-right:10px;min-width:500px;"]');

            // сообщение о причине невозможности зайти в заявку
            // (нет оружия, недостаточно HP),  нет общих заявок или
            // таблица с заявками вообще не найдена
            if (general.doc.querySelector('table[class="panelfloat"]') ||
                    !this.battleTable ||
                    this.battleTable.rows.length === 1) {
                return;
            }

            // заявка на бой отклонена
            if (/Заявка на бой отклонена/i.test(general.doc.body.innerHTML)) {
                general.root.location.href = '/wargroup.php?war=armed';
            }

            // уже в заявке
            if (/Вы заявлены на бой/i.test(general.doc.body.innerHTML)) {
                return;
            }

            // интерфейс
            var span = general.doc.createElement('span');
            span.setAttribute('style', 'margin-left: 10px;');
            span.innerHTML = 'Максимальный уровeнь: ' +
                this.getSelect('blevel') +
                'без именных:<input type="checkbox" id="personalchk" /> ' +
                'по мощности:<input type="checkbox" id="powerchk" />';
            general.$('updatetimer2').parentNode.parentNode.appendChild(span);

            var stData = general.getData(20),
                _this = this;

            // максимальный уровень
            var blevel = general.$('blevel');
            blevel.value = stData[0];
            blevel.addEventListener('change', function () {
                var data = general.getData(20);
                data[0] = blevel.value;
                general.setData(data, 20);
                _this.sortBattleTable();
            }, false);

            // чекбокс "без именных"
            var personal = general.$('personalchk');
            personal.checked = !!stData[1];
            personal.addEventListener('click', function () {
                personal.checked = !!personal.checked;
                var data = general.getData(20);
                data[1] = personal.checked ? 1 : '';
                general.setData(data, 20);
                _this.sortBattleTable();
            }, false);

            // чекбокс "по мощности"
            var power = general.$('powerchk');
            power.checked = !!stData[2];
            power.addEventListener('click', function () {
                power.checked = !!power.checked;
                var data = general.getData(20);
                data[2] = power.checked ? 1 : '';
                general.setData(data, 20);
                _this.sortBattleTable();
            }, false);

            this.sortBattleTable();
        }; // 2}}}
    }; // 1}}}

    /**
     * @class PortTimer {{{1
     * @constructor
     */
    var PortTimer = function () {
        /**
         * @property tm
         * @type {int}
         */
        this.tm = 1200;
        /**
         * @property topPanel
         * @type {HTMLElement|null}
         */
        this.topPanel = null;
        /**
         * @property url
         * @type {String|null}
         */
        this.url = null;
        /**
         * @property date
         * @type {int}
         */
        this.date = 0;

        /**
         * @method getBattles {{{2
         */
        this.getBattles = function () {
            var _this = this;
            new AjaxQuery().init(_this.url, 'GET', null, true, function (xhr) {
                var spanContent = general.doc.createElement('span'),
                    cssSelector = 'table+table+table[cellspacing="1"]' +
                        '[cellpadding="5"][width="100%"]';

                spanContent.innerHTML = xhr.responseText;
                var table = spanContent.querySelector(cssSelector);

                if (table) {
                    var data = JSON.parse(general.getData(22)[0]),
                        trs = table.querySelectorAll('tr'),
                        nobr,
                        i;

                    data.time = [];
                    if (trs.length > 1 &&
                            !/<i>\(отсутствуют\)<\/i>/.test(trs[1].innerHTML)) {
                        for (i = 1; i < trs.length; i++) {
                            nobr = trs[i].querySelector('nobr');
                            if (nobr && /^\d+:\d+$/.test(nobr.innerHTML)) {
                                data.time.push(nobr.innerHTML);
                            }
                        }
                    }

                    data.date = _this.date;
                    data.time.reverse();
                    data.current = '';
                    general.setData(JSON.stringify(data), 22);
                    _this.setTime();
                }
            }, function () {
                general.root.setTimeout(function () {
                    _this.getBattles();
                }, _this.tm);
            });
        }; // 2}}}

        /**
         * @method resetStorage {{{2
         */
        this.resetStorage = function () {
            general.setData(JSON.stringify({
                'date': '',
                'syndid': '',
                'time': [],
                'current': ''
            }), 22);
        }; // 2}}}

        /**
         * @method getTimeDiff {{{2
         * @return  {int}
         */
        this.getTimeDiff = function () {
            var stData = JSON.parse(general.getData(22)[0]),
                now = new Date();

            stData.current = stData.current.split(':');
            // noinspection JSRemoveUnnecessaryParentheses
            return (+stData.current[0] * 60 + (+stData.current[1])) -
                ((now.getUTCHours() + 3) * 60 + now.getMinutes());
        }; // 2}}}

        /**
         * @method setTimer {{{2
         */
        this.setTimer = function () {
            var diff = this.getTimeDiff(),
                hours = parseInt((diff / 60).toString(), 10),
                min = diff - hours * 60;

            general.$('portTimer').innerHTML = (hours < 10 ? '0' + hours :
                    hours) + ':' + (min < 10 ? '0' + min : min);
        }; // 2}}}

        /**
         * @method changeCurrentTime {{{2
         */
        this.changeCurrentTime = function () {
            var stData = JSON.parse(general.getData(22)[0]);
            if (!stData.time.length) {
                stData.current = '';
                general.setData(JSON.stringify(stData), 22);
                return;
            }

            var time = stData.time.pop();
            stData.current = time;
            general.setData(JSON.stringify(stData), 22);
            if (this.getTimeDiff() <= 0) {
                this.changeCurrentTime();
                return;
            }

            this.setInterface();
            general.$('portTime').innerHTML = time;
            this.setTimer();
        }; // 2}}}

        /**
         * @method setInterface {{{2
         */
        this.setInterface = function () {
            var mainTimer = general.doc.createElement('span');
            mainTimer.innerHTML = '<a href="' + this.url +
                '" style="text-decoration: none;" target="_blank">' +
                'Порты</a> <span id="portTime" style="font-weight: ' +
                'bold;"></span> [<span id="portTimer" style=""></span>]';

            this.topPanel.appendChild(general.doc.createTextNode(' | '));
            this.topPanel.appendChild(mainTimer);
        }; // 2}}}

        /**
         * @method setTime {{{2
         */
        this.setTime = function () {
            var stData = JSON.parse(general.getData(22)[0]);
            if (!stData.current || this.getTimeDiff() <= 0) {
                this.changeCurrentTime();
            } else {
                this.setInterface();
                general.$('portTime').innerHTML = stData.current;
                this.setTimer();
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            // верхняя панель
            this.topPanel = new GetTopPanel().init();
            if (!this.topPanel) {
                return;
            }

            /* localStorage:
             * [0] - '{date: '', syndid: '', time: [], current: ''}'
             */
            var stData = general.getData(22)[0];
            if (!stData) {
                this.resetStorage();
            }

            stData = JSON.parse(general.getData(22)[0]);

            // на главной странице персонажа проверяем ID основного синдиката
            if (/\/me(\/|\.php)/.test(general.loc)) {
                var linkMainSynd = general.doc.querySelector('span>b+nobr>' +
                    'a[href*="/syndicate.php?id="]');
                var syndID = linkMainSynd ?
                        /\?id=(\d+)/.exec(linkMainSynd.href)[1] : null;

                // нет основного синдиката
                if (!syndID) {
                    this.resetStorage();
                    return;
                }

                // сменили синд
                if (stData.syndid !== syndID) {
                    stData.syndid = syndID;
                    stData.time = [];
                    general.setData(JSON.stringify(stData), 22);
                }
            }

            // нет основного синдиката
            if (!stData.syndid) {
                return;
            }

            this.url = 'https://' + general.domain + '/object.php?id=11712&' +
                'page=oncoming1&sid=' + stData.syndid;

            // сегодня запрос не делали, делаем не ранее 7 утра.
            var serverHour = new Date().getUTCHours() + 3,
                now = new Date();

            serverHour = serverHour > 23 ? serverHour - 24 : serverHour;

            this.date = new Date(now.setHours(now.getHours() +
                    now.getTimezoneOffset() / 60 + 3)).getDate();

            if (+stData.date !== this.date && serverHour >= 7) {
                this.getBattles();
            } else {
                this.setTime();
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class PortsSyndLinks {{{1
     * @constructor
     */
    var PortsSyndLinks = function () {
        /**
         * @method init {{{2
         */
        this.init = function () {
            var table = general.doc.querySelector('td>table.simplewhitebg');

            if (table) {
                var syndLinks = table.querySelectorAll('a[href*="&page="]'),
                    link,
                    sign,
                    reg,
                    i;

                for (i = 0; i < syndLinks.length; i++) {
                    link = syndLinks[i];
                    reg = /&sid=(\d+)$/.exec(link.href);

                    if (reg) {
                        sign = general.doc.createElement('a');
                        sign.setAttribute('href', 'https://' + general.domain +
                            '/syndicate.php?id=' + reg[1] + '&page=online');
                        sign.setAttribute('target', '_blank');
                        sign.setAttribute('style', 'margin-right: 2px;');
                        sign.innerHTML = '<img src="https://images.' +
                            general.domain.replace('www.', '') +
                            '/img/synds/' + reg[1] + '.gif" width="20" ' +
                            'height="14" border="0" alt="img" />';

                        link.parentNode.insertBefore(sign, link);
                    }
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class PersonalNPCNotifications {{{1
     * @constructor
     */
    var PersonalNPCNotifications = function () {
        /**
         * @property isCssSet
         * @type {Boolean}
         */
        this.isCssSet = false;
        /**
         * @property spanContent
         * @type {Element}
         */
        this.spanContent = general.doc.createElement('span');
        /**
         * @property ajax
         * @type {Function}
         */
        this.ajax = new AjaxQuery().init;
        /**
         * @property playSound
         * @type {Function}
         */
        this.playSound = new PlaySound().init;

        /**
         * @method setCss {{{2
         */
        this.setCss = function () {
            // css-ботва для ссылки на главную страницу NPC
            var npcLinkStyle = general.doc.createElement('style');
            npcLinkStyle.innerHTML = '@-webkit-keyframes npcBlink {' +
                    '100% { color: rgba(34, 34, 34, 0);}' +
                '}' +

                '@keyframes npcBlink {' +
                    '100% { color: rgba(34, 34, 34, 0); }' +
                '}' +

                '#npcBlink {' +
                    '-webkit-animation: npcBlink 1s linear infinite;' +
                    'animation: npcBlink 1s linear infinite;' +
                '}';

            general.doc.querySelector('head').appendChild(npcLinkStyle);
            this.isCssSet = true;
        }; // 2}}}

        /**
         * @method changepostdo {{{2
         */
        this.changepostdo = function () {
            var _this = this;
            general.root.postdo = function (url) {
                // noinspection JSUnresolvedFunction
                var url_loaded = url,
                    my_main_div = $('#my_main_div');

                // noinspection JSUnresolvedFunction
                my_main_div.css('opacity', '0.6');

                /*jslint unparam: true */
                /*eslint no-unused-vars: 0 */
                // noinspection JSUnusedLocalSymbols
                my_main_div.load(url,
                    function (responseTxt, statusTxt, xhr) {
                        if (statusTxt === 'success') {
                            // noinspection JSUnresolvedFunction
                            $('#my_main_div').css('opacity', '1');
                            window.history.
                                replaceState({}, null, url_loaded);
                            _this.init();
                        } else {
                            // noinspection JSUnresolvedFunction
                            $('#my_main_div').css('opacity', '0.3');
                            window.location.href = url_loaded;
                        }
                    });

                return false;
            };
        }; // 2}}}

        /**
         * @method start {{{2
         */
        this.start = function () {
            var npcLink = general.doc.querySelector('a[href*="/me.php?nid="]' +
                '[onclick^="dolink"]');

            if (npcLink) {
                var url = 'https://' + general.domain + '/info.php?id=' +
                        /\?nid=(\d+)/.exec(npcLink.href)[1],
                    _this = this;

                this.ajax(url, 'GET', null, true, function (xhr) {
                    _this.spanContent.innerHTML = xhr.responseText;
                    var link = _this.spanContent.
                            querySelector('a[onclick^="show_npc_control"]'),
                        div = _this.spanContent.
                            querySelector('#namespan').parentNode,
                        health = /\[(\d+) \/ (\d+)\]/.exec(div.innerHTML);

                    // noinspection JSRemoveUnnecessaryParentheses
                    health = Math.floor(+health[1] * 100 / (+health[2]));

                    if (link.innerHTML === 'Ожидает распоряжений' &&
                            health >= 80) {
                        npcLink.setAttribute('id', 'npcBlink');
                        _this.playSound(general.getData(18)[0]);
                    } else if (link.innerHTML === 'Путешествует по Аутленду'
                            && health < 30) {
                        npcLink.setAttribute('style', 'background: #FFE3E3');
                        _this.playSound(general.getData(18)[1]);
                    } else {
                        npcLink.removeAttribute('id');
                        npcLink.removeAttribute('style');
                    }

                    general.root.setTimeout(function () {
                        _this.start();
                    }, 10000);
                }, function () {
                    general.root.setTimeout(function () {
                        _this.start();
                    }, 3000);
                });
            }
        }; // 2}}}

        /**
         * @method init {{{2
         */
        this.init = function () {
            if (!this.isCssSet) {
                this.setCss();
            }

            this.changepostdo();
            this.start();
        }; // 2}}}
    }; // 1}}}

    /**
     * @class BbCodeInMessages {{{1
     * @constructor
     */
    var BbCodeInMessages = function () {
        /**
         * @property textArea
         * @type {Object|null}
         */
        this.textArea = general.doc.querySelector('textarea[name="msg"],' +
                'textarea[name="message"]') ||
                    general.doc.querySelector('textarea#newsms');

        /**
         * @method  setButton {{{2
         * @param   {String}    imgName
         * @param   {String}    title
         * @param   {Object}    target
         * @param   {String}    tag
         */
        this.setButton = function (imgName, title, target, tag) {
            var button = general.doc.createElement('span');
            button.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
            button.innerHTML = '<img src="' + general.imgPath +
                'BbCodeInMessages/' + imgName +
                '.png" width="14" height="14" title="' + title + '" ' +
                'alt="' + title + '">';
            target.appendChild(button);

            var _this = this;
            button.addEventListener('click', function () {
                var text = _this.textArea.value,
                    cursorPos = _this.textArea.selectionStart;

                _this.textArea.value = text.substring(0, cursorPos) + tag +
                    text.substring(cursorPos, text.length);
                _this.textArea.focus();
                _this.textArea.selectionEnd = cursorPos + 3;
            }, false);
        }; // 2}}}

        /**
         * @method  init {{{2
         */
        this.init = function () {
            var sendButton = general.doc.
                    querySelector('input[value="Отправить сообщение"]');

            if (this.textArea) {
                var target;
                if (sendButton) { // старая версия почты и форум
                    target = sendButton.parentNode.parentNode.parentNode.
                            parentNode.querySelectorAll('td');

                    target = /sms-create/.test(general.loc) ? target[4] :
                            target[0];
                } else {
                    target = general.doc.
                        querySelector('td>span[style="opacity:0.8;"]');
                }

                if (target) {
                    this.setButton('quote', 'Цитирование', target, '[q][/q]');
                    this.setButton('italic', 'Наклонный шрифт', target,
                        '[i][/i]');
                }
            }
        }; // 2}}}
    }; // 1}}}

    /**
     * @class ProfessionLevels {{{1
     * @constructor
     */
    var ProfessionLevels = function () {
        /**
         * @property profLevels
         * @type {Array}
         */
        this.profLevels = [51, 109, 184, 284, 422, 609, 856, 1176, 1581, 2085];

        /**
         * @method  setCounter {{{2
         * @param   {Object}    target
         * @param   {int}       value
         */
        this.setCounter = function (target, value) {
            var td = general.doc.createElement('td');
            td.setAttribute('style', 'padding-left: 5px; font-size: 10px; ' +
                'color: #809980;');
            td.innerHTML = '+' + value;
            target.appendChild(td);
        }; // 2}}}

        /**
         * @method  init {{{2
         */
        this.init = function () {
            var killer = general.doc.querySelector('table[border="0"] ' +
                    'td[style*="font-size:10px"]');

            if (!killer) {
                return;
            }

            var profsTrs = killer.parentNode.parentNode.querySelectorAll('tr'),
                currentVal,
                i,
                j;

            for (i = 0; i < 3; i++) {
                currentVal = /\((\d+(\.\d+)?)\)/.exec(profsTrs[i].innerHTML)[1];
                currentVal = Math.floor(currentVal);
                for (j = 0; j < this.profLevels.length; j++) {
                    if (currentVal < this.profLevels[j]) {
                        this.setCounter(profsTrs[i],
                            this.profLevels[j] - currentVal);
                        break;
                    }
                }
            }

            var tr = general.doc.createElement('tr');
            tr.innerHTML = '<td colspan="3"><a target="_blank" ' +
                'style=" font-size: 10px;" href="http://www.ganjawiki.ru/' +
                'Очки_опыта#Таблица_опыта_профессий">Таблица опыта ' +
                'профессий</a></td>';
            profsTrs[0].parentNode.appendChild(tr);
        }; // 2}}}
    }; // 1}}}

    general = new General();

    // не в игре
    if ((general.doc.querySelector('a[href$="/login.php"]') ||
            general.doc.querySelector('a[href$="/regform.php"]')) &&
                !/\/news\.php/.test(general.loc)) {
        return;
    }

    if (!general.checkMainData()) {
        return;
    }

    var head = general.doc.querySelector('head');
    if (!head) {
        return;
    }

    // main init {{{1
    initScript = general.getInitScript();

    // на ganjafoto, ganjafile или на ауте меняем фавикон
    if (/ganjafoto|ganjafile|photos|quest\.gwars/.test(general.loc)) {
        try {
            new NotGiveCannabisLeaf().init();
        } catch (e) {
            general.cons.log(e);
        }

        return;
    }

    // везде на www.gwars
    if (initScript[0]) {
        try {
            new NotGiveCannabisLeaf().init();
        } catch (e) {
            general.cons.log(e);
        }
    }

    if (initScript[36]) {
        try {
            new PortTimer().init();
        } catch (e) {
            general.cons.log(e);
        }
    }

    if (initScript[52]) {
        try {
            new SoundSyndBattle().init();
        } catch (e) {
            general.cons.log(e);
        }
    }

    // везде кроме фермы
    if (!/\/ferma\.php/.test(general.loc)) {
        if (initScript[41]) {
            try {
                new ScanPers().init();
            } catch (e) {
                general.cons.log(e);
            }
        }

        if (initScript[4]) {
            try {
                new BlacklistHighlighting().init();
            } catch (e) {
                general.cons.log(e);
            }
        }
    }

    // везде кроме боев
    if (!/\/b0\//.test(general.loc)) {
        try {
            new SetSettingsButton().init();
        } catch (e) {
            general.cons.log(e);
        }

        if (/\/news\.php\?set=1/.test(general.loc)) {
            try {
                new ShowMainSettings().init();
            } catch (e) {
                general.cons.log(e);
            }
        }

        if (/\/sms\.php/.test(general.loc)) {
            if (initScript[8]) {
                try {
                    new DeleteSms().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/sms-read\.php\?type=/.test(general.loc)) {
            if (initScript[26]) {
                try {
                    new HistorySms().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (/\?type=1&id=/.test(general.loc)) {
                if (initScript[54]) {
                    try {
                        new DelAndAddBlackSms().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }
            }
        }

        if (/\/ferma\.php/.test(general.loc)) {
            if (initScript[9]) {
                try {
                    new FarmExperience().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (initScript[13]) {
                try {
                    new AllPlantsOnFarm().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (initScript[10]) {
            try {
                new FarmTimer().init();
            } catch (e) {
                general.cons.log(e);
            }
        }

        if (initScript[14]) {
            try {
                new GwMenu().init();
            } catch (e) {
                general.cons.log(e);
            }
        }

        if (initScript[1]) {
            try {
                new AdditionForNavigationBar().init();
            } catch (e) {
                general.cons.log(e);
            }
        }

        if (initScript[6]) {
            try {
                new ResourcesAndBonuses().init();
            } catch (e) {
                general.cons.log(e);
            }
        }

        if (!/\/ferma\.php/.test(general.loc)) {
            if (initScript[47]) {
                try {
                    new ShowMyAchievements().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (/\/me(\/|\.php)|\/(warlog|warlist|wargroup)\.php\?/.
                    test(general.loc)) {
                if (initScript[5]) {
                    try {
                        new WorkPostGrenadesBroken().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }
            }

            if (initScript[43]) {
                try {
                    new SearchUser().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/me(\/|\.php)|\/npc\.php\?id=/.test(general.loc)) {
            if (initScript[12]) {
                try {
                    new TimeNpc().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (/\/me(\/|\.php)/.test(general.loc)) {
                if (initScript[17]) {
                    try {
                        new GbCounter().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[44]) {
                    try {
                        new SkillCounters().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[49]) {
                    try {
                        new SyndOnlineOnMainPage().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[56]) {
                    try {
                        new Regeneration().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[35]) {
                    try {
                        new PersonalNPCNotifications().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }
            }
        }

        if (/\/items\.php/.test(general.loc)) {
            if (initScript[15]) {
                try {
                    new InventoryPlus().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/info.warstats\.php\?id=/.test(general.loc)) {
            if (initScript[16]) {
                try {
                    new CountBattles().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/shopc\.php|\/market-p\.php\?stage=2&item_id=/.
                test(general.loc)) {
            if (initScript[19]) {
                try {
                    new BuyHightech().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/shop\.php/.test(general.loc)) {
            if (initScript[27]) {
                try {
                    new LinksToHighTech().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/(messages|sms-(create|read|chat)).php/.test(general.loc)) {
            if (initScript[62]) {
                try {
                    new BbCodeInMessages().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/me(\/|\.php)|\/messages\.php\?fid=1&tid=/.
                test(general.loc)) {
            if (initScript[20]) {
                try {
                    new NewsAndInvit().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/(messages|threads)\.php\?fid=/.test(general.loc) ||
                /\/forum.php$/.test(general.loc)) {
            if (initScript[53]) {
                try {
                    new AdvForum().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (/\/messages\.php/.test(general.loc)) {
                if (initScript[42]) {
                    try {
                        new ShowInitMessOnForum().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }
            }
        }

        if (/\/stats\.php$/.test(general.loc)) {
            if (initScript[22]) {
                try {
                    new FilterResOnStat().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/me(\/|\.php)|\/info\.php\?id=/.test(general.loc)) {
            if (initScript[24]) {
                try {
                    new FixSkills().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (initScript[25]) {
                try {
                    new FuckTheFarm().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (/\/info\.php\?id=/.test(general.loc)) {
                if (initScript[28]) {
                    try {
                        new GameMania().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[38]) {
                    try {
                        new RangeWeapon().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[40]) {
                    try {
                        new ScanKarma().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[57]) {
                    try {
                        new ProfColor().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[58]) {
                    try {
                        new CurrentQuestOnInfo().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }

                if (initScript[63]) {
                    try {
                        new ProfessionLevels().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }
            }
        }

        if (/\/info\.realty\.php\?id=2$/.test(general.loc)) {
            if (initScript[29]) {
                try {
                    new GosEnergoAtomFilter().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/syndicate\.php\?id=/.test(general.loc)) {
            if (initScript[30]) {
                try {
                    new SortSyndOnline().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (initScript[45]) {
                try {
                    new SyndPtsAnalyser().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (initScript[46]) {
                try {
                    new SyndAnalyser().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/map.php/.test(general.loc)) {
            if (initScript[37]) {
                try {
                    new PortsAndTerminals().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/home\.senditem\.php/.test(general.loc)) {
            if (initScript[39]) {
                try {
                    new RentAndSale().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/info\.php\?id=|\/info\.vote\.php\?id=/.test(general.loc)) {
            if (initScript[50]) {
                try {
                    new TimeKarma().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/object\.php\?id=/.test(general.loc)) {
            if (initScript[61]) {
                try {
                    new PortsSyndLinks().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }
    }

    // бои
    if (/(\/b0\/|\/(wargroup|warlist|warlog|battlelog|duels)\.php)/.
            test(general.loc)) {

        if (initScript[3]) {
            try {
                new AdvBattleAll().init();
            } catch (e) {
                general.cons.log(e);
            }
        }

        if (/(\/b0\/|\/(warlog|battlelog)\.php)/.test(general.loc)) {
            if (initScript[7]) {
                try {
                    new CritShotsAndLinksBtlLog().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (initScript[31]) {
                try {
                    new HousHealth().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (initScript[51]) {
                try {
                    new ImgPokemonsOnBattle().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }

        if (/\/warlist\.php/.test(general.loc)) {
            if (initScript[23]) {
                try {
                    new FilterWarlistOne2One().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (initScript[34]) {
                try {
                    new One2OneCallerInfo().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }

            if (/\?war=(armed|duels)/.test(general.loc)) {
                if (initScript[33]) {
                    try {
                        new LinksInOne2One().init();
                    } catch (e) {
                        general.cons.log(e);
                    }
                }
            }
        }

        if (/\/wargroup\.php\?war=armed/.test(general.loc)) {
            if (initScript[59]) {
                try {
                    new CommonBattleFilter().init();
                } catch (e) {
                    general.cons.log(e);
                }
            }
        }
    } // 1}}}

}());

// vim:fdm=marker
