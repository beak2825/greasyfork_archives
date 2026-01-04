// ==UserScript==
// @name            ComfortableLinksForFarm
// @namespace       https://github.com/MyRequiem/comfortablePlayingInGW
// @description     Удобные ссылки для полива, сбора, вскапывания, посадки на ферме.
// @id              comfortablePlayingInGW@MyRequiem
// @include         http://www.ganjawars.ru/ferma.php*
// @grant           none
// @license         MIT
// @version         2.11-090117
// @author          MyRequiem [http://www.ganjawars.ru/info.php?id=2095458]
// @downloadURL https://update.greasyfork.org/scripts/35184/ComfortableLinksForFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/35184/ComfortableLinksForFarm.meta.js
// ==/UserScript==

/*global unsafeWindow */
/*jslint browser: true, maxlen: 80, vars: true, nomen: true */

/*eslint-env browser */
/*eslint indent: ['error', 4], linebreak-style: ['error', 'unix'],
    quotes: ['error', 'single'], semi: ['error', 'always'],
    eqeqeq: 'error', curly: 'error'
*/

/*jscs:disable requireMultipleVarDecl, requireVarDeclFirst */
/*jscs:disable disallowKeywords, disallowDanglingUnderscores */
/*jscs:disable validateIndentation */

(function () {
    'use strict';

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
        }
    };

    var general = new General();

    /**
     * @class GetPos
     * @constructor
     */
    var GetPos = function () {
        /**
         * @method init
         * @param   {HTMLElement}   obj
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
    };

    /**
     * @class ComfortableLinksForFarm
     * @constructor
     */
    var ComfortableLinksForFarm = function () {
        /**
         * @method setLink
         * @param   {HTMLLinkElement}   a
         * @param   {String|null}       txt
         */
        this.setLink = function (a, txt) {
            var target = general.doc.
                    querySelector('center>b>font[color="#990000"]').parentNode;

            if (txt && (/\(через \d+/.test(a.parentNode.innerHTML))) {
                return;
            }

            var link = a.cloneNode(true);

            if (!txt) {
                a.setAttribute('style', 'display: none;');
            } else {
                link.innerHTML = txt;
            }

            link.setAttribute('style', 'margin-left: 10px;');
            target.appendChild(link);
        };

        /**
         * @method init
         */
        this.init = function () {
                // ссылка Собрать, Вскопать, Полить
            var a1 = general.doc.querySelector('td[bgcolor="#f0fff0"]' +
                    ':not([align="right"])>a[href^="/ferma.php?"]'),
                // ссылка ближайшее действие
                a2 = general.doc.querySelector('td[bgcolor="#e0eee0"]>a' +
                        '[href^="/ferma.php?"]'),
                // кнопка посадить
                but = general.doc.querySelector('input[value="Посадить"]'),
                // клетка, на которой находимся
                pos = general.doc.querySelector('img[src$="ru/i/point2.gif"]');

            if (a1) {
                this.setLink(a1, null);
            } else if (a2) {
                this.setLink(a2, 'Далее');
            }

            pos = but && pos ? new GetPos().init(pos.parentNode) : null;
            if (pos) {
                but.setAttribute('style', 'position: absolute; ' +
                        'background: #F4F3F1; ' +
                        'border-radius: 7px; ' +
                        'padding: 1px; ' +
                        'top: ' + (pos.y + 15) + 'px; ' +
                        'left: ' + (pos.x - 7) + 'px;');

                but.focus();
            }
        };
    };

    new ComfortableLinksForFarm().init();

}());

