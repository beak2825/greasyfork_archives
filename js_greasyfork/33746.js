// ==UserScript==
// @name            FarmTimer
// @namespace       https://github.com/MyRequiem/comfortablePlayingInGW
// @description     Выводит таймер для фермы рядом с "Об игре | Форум". Звуковое оповещение когда пора полить/собрать.
// @id              comfortablePlayingInGW@MyRequiem
// @include         http://www.ganjawars.ru/*
// @grant           none
// @license         MIT
// @version         2.10-290717
// @author          MyRequiem [http://www.ganjawars.ru/info.php?id=2095458]
// @downloadURL https://update.greasyfork.org/scripts/33746/FarmTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/33746/FarmTimer.meta.js
// ==/UserScript==

/*global unsafeWindow */
/*jslint browser: true, maxlen: 80, vars: true, regexp: true, nomen: true
    devel: true
*/

/*eslint-env browser */
/*eslint no-useless-escape: 'warn', linebreak-style: ['error', 'unix'],
    quotes: ['error', 'single'], semi: ['error', 'always'],
    eqeqeq: 'error', curly: 'error'
*/

/*jscs:disable requireMultipleVarDecl, requireVarDeclFirst */
/*jscs:disable disallowKeywords, disallowDanglingUnderscores */
/*jscs:disable validateIndentation */

(function () {
    'use strict';

        // =============== НАСТРОЙКИ ====================
        // звук когда пора поливать/собирать(0 - без звука)
    var farmSound = 8,
        // повторять звук не чаще чем один раз в X секунд (0 - не повторять)
        soundInterval = 120;
        // ============ КОНЕЦ НАСТРОЕК ==================

    /**
     * @class General
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
         * @property STNAME
         * @type {String}
         */
        this.STNAME = 'farmTimer';
        /**
         * @property myID
         * @type {String}
         */
        this.myID = /(^|;) ?uid=([^;]*)(;|$)/.exec(this.doc.cookie)[2];
        /**
         * @property DESIGN_VERSION
         * @type {String}
         */
        this.DESIGN_VERSION = /(^|;) ?version=([^;]*)(;|$)/.
                exec(this.doc.cookie)[2];
    };

    /**
     * @lends General.prototype
     */
    General.prototype = {
        /**
         * @method getRoot
         * @return  {Object}
         */
        getRoot: function () {
            var rt = typeof unsafeWindow;
            return rt !== 'undefined' ? unsafeWindow : window;
        },

        /**
         * @method setData
         * @param   {Array} data
         */
        setData: function (data) {
            this.st.setItem(this.STNAME, data.join('|'));
        },

        /**
         * @method getData
         * @return  {Array}
         */
        getData: function () {
            var stData = this.st.getItem(this.STNAME);
            if (stData) {
                return stData.split('|');
            }

            stData = ['', '', '', ''];
            this.setData(stData);
            return stData;
        }
    };

    var general = new General();

    /**
     * @class GetTopPanel
     * @constructor
     */
    var GetTopPanel = function () {
        /**
         * @method init
         * @return  {HTMLElement|null}
         */
        this.init = function () {
            // ищем верхнюю панель "Новости | Об игре | Форум"
            if (general.DESIGN_VERSION === 'v2') {  // новый дизайн
                return general.doc.querySelector('td.gw-header-col2 ' +
                        'div:first-child nobr:first-child');
            }

            return general.doc.
                querySelector('td.txt[align="left"] nobr:first-child');
        };
    };

    /**
     * @class PlaySound
     * @constructor
     */
    var PlaySound = function () {
        /**
         * @method init
         * @param   {int|String}    sound
         */
        this.init = function (sound) {
            if (sound && sound !== '0') {
                var audio = general.doc.querySelector('#cpingw_audio');
                if (!audio) {
                    audio = general.doc.createElement('audio');
                    audio.setAttribute('id', 'cpingw_audio');
                    var divAudio = general.doc.createElement('div');
                    divAudio.setAttribute('style', 'display: none;');
                    divAudio.appendChild(audio);
                    general.doc.body.appendChild(divAudio);
                }

                audio.volume = 0.3;
                audio.src = '/sounds/' + sound + '.ogg';
                audio.play();
            }
        };
    };

    /**
     * @class GetRandom
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
    };

    /**
     * @class FarmTimer
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
         * @type {int|null}
         */
        this.checkInterval = null;

        /**
         * @method setRedLink
         * @param   {String}    str
         */
        this.setRedLink = function (str) {
            var action = str === '2' ? 'Собрать' : 'Полить';
            this.farmLink.setAttribute('style', 'color: #FF0000; ' +
                    'font-weight: bold; text-decoration: none;');
            this.farmLink.innerHTML = '[' + action + ']';
        };

        /**
         * @method checkState
         */
        this.checkState = function () {
            if (!(/bold/.test(this.farmLink.getAttribute('style')))) {
                if (this.checkInterval) {
                    general.root.clearInterval(this.checkInterval);
                }

                return;
            }

            var stData = general.getData();
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
                general.setData(stData);
                this.showTimer(+((time - timeNow) / 1000).toFixed(0));
            }
        };

        /**
         * @method setReminder
         */
        this.setReminder = function () {
            var stData = general.getData();
            if (!stData[0]) {
                this.farmLink.innerHTML = '';
                return;
            }

            this.setRedLink(stData[1]);

            var _this = this;
            this.checkInterval = general.root.setInterval(function () {
                _this.checkState();
            }, 2000);

            if (!farmSound) {
                return;
            }

            var timeNow = new Date().getTime();
            if (timeNow < +stData[0]) {
                return;
            }

            var soundTime = +stData[2],
                intrvl = soundInterval * 1000,
                random = new GetRandom();

            // пора проигрывать звук
            if (timeNow - soundTime >= intrvl) {
                // в настройках указано не повторять звук
                if (!intrvl) {
                    // если звук еще не был проигран
                    if (!stData[3]) {
                        stData[3] = '1';
                        general.setData(stData);
                        new PlaySound().init(farmSound);
                    }

                    return;
                }

                stData[2] = timeNow;
                general.setData(stData);
                general.root.setTimeout(function () {
                    _this.setReminder();
                }, intrvl + random.init(1000, 10000));

                new PlaySound().init(farmSound);
            } else if (intrvl) {
                general.root.setTimeout(function () {
                    _this.setReminder();
                }, intrvl - (timeNow - soundTime) + random.init(1000, 10000));
            }
        };

        /**
         * @method showTimer
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
        };

        /**
         * @method init
         */
        this.init = function () {
            if (!general.st) {
                alert('Ваш браузер не поддерживает технологию localStorage.' +
                    '\nMyRequiеm рекомендует вам установить один из\n' +
                    'ниже перечисленных браузеров или удалите скрипт\n' +
                    'FarmTimer\n\nFireFox 4+\nOpera 11+\n' +
                    'Chrome 12+');

                return;
            }

            /** localStorage:
             * [0] - время полива/сбора
             * [1] - действие (Полить|Собрать)
             * [2] - время последнего проигрывания звука
             * [3] - звук проигран?
             */
            var stData = general.getData(),
                timeNow = new Date().getTime();

            // на ферме запоминаем данные, выходим
            if (/\/ferma\.php/.test(general.loc)) {
                // не на своей ферме
                if ((/id=\d+/.test(general.loc)) &&
                        (/id=(\d+)/.exec(general.loc)[1]) !== general.myID) {
                    return;
                }

                var actionStr = /Ближайшее действие:.*[собрать|полить].*\(.*\)/.
                        exec(general.doc.querySelector('td[width="400"]' +
                                '[valign="top"]').innerHTML);

                if (!actionStr) {
                    stData[0] = '';
                    general.setData(stData);
                    return;
                }

                var aStr = actionStr[0];
                var action = /собрать/.test(aStr) ? '2' : '1';

                if (/уже пора/.test(aStr)) {
                    general.setData([timeNow, action, timeNow, '1']);
                    return;
                }

                var timeLeft = +(/через (\d+) мин/.exec(aStr)[1]);
                general.setData([timeNow + timeLeft * 60 * 1000,
                    action, timeNow, '']);

                return;
            }

            var topPanel = new GetTopPanel().init();
            if (!topPanel || !stData[0]) {
                return;
            }

            this.farmLink = general.doc.createElement('a');
            this.farmLink.setAttribute('style', 'color: #0000FF; ' +
                    'text-decoration: none;');
            this.farmLink.href = 'http://www.ganjawars.ru/ferma.php?id=' +
                general.myID;
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
        };
    };

    new FarmTimer().init();

}());

