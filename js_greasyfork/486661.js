// ==UserScript==
// @name            Habr: Return the votes
// @name:ru         Хабр: Верни голоса
// @description     Returns votes under comments
// @description:ru  Возвращает голоса под комментариями
// @namespace       com.habr.askornot
// @license         WTFPL
// @author          askornot
// @match           https://habr.com/*
// @version         0.0.4
// @compatible      chrome     Violentmonkey 2.18.0
// @compatible      firefox    Violentmonkey 2.18.0
// @homepageURL     https://greasyfork.org/ru/scripts/486661-habr-return-the-votes/
// @supportURL      https://greasyfork.org/ru/scripts/486661-habr-return-the-votes/feedback
// @run-at          document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/486661/Habr%3A%20Return%20the%20votes.user.js
// @updateURL https://update.greasyfork.org/scripts/486661/Habr%3A%20Return%20the%20votes.meta.js
// ==/UserScript==

(function () {
  'use strict';

  Object.defineProperty = new Proxy(Object.defineProperty, {
    apply(target, thisArg, argumentsList) {
      if (argumentsList[1] !== 'isLoggedIn') return Reflect.apply(target, thisArg, argumentsList);
      return target(argumentsList[0], argumentsList[1], {
        get() {
          if (
            Object.prototype.hasOwnProperty.call(this, '_') &&
            Object.prototype.hasOwnProperty.call(this._, 'type') &&
            Object.prototype.hasOwnProperty.call(this._.type, 'name') &&
            this._.type.name === 'TMVotesLever'
          )
            return true;
        },
      });
    },
  });
})();
