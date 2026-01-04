// ==UserScript==
// @name                 Yandex.Metrika | Blocker
// @description          Disables the 𝗬𝗮𝗻𝗱𝗲𝘅.𝗠𝗲𝘁𝗿𝗶𝗸𝗮 tracking counter.

// @name:en              Yandex.Metrika | Blocker
// @description:en       Disables the 𝗬𝗮𝗻𝗱𝗲𝘅.𝗠𝗲𝘁𝗿𝗶𝗸𝗮 tracking counter.

// @name:ru              Яндекс.Метрика | Блокировщик
// @description:ru       Отключает счетчик отслеживания 𝗬𝗮𝗻𝗱𝗲𝘅.𝗠𝗲𝘁𝗿𝗶𝗸𝗮.

// @name:uk              Яндекс.Метрика | Блокувальник
// @description:uk       Відключає лічильник відстеження 𝗬𝗮𝗻𝗱𝗲𝘅.𝗠𝗲𝘁𝗿𝗶𝗸𝗮.

// @name:bg              Yandex.Metrika | Блокер
// @description:bg       Деактивира брояча за проследяване на 𝗬𝗮𝗻𝗱𝗲𝘅.𝗠𝗲𝘁𝗿𝗶𝗸𝗮.

// @iconURL              https://yastatic.net/s3/metrika/_/BQoTNR-tROww0upHOLDbSqFzfYE.ico
// @version              1.1
// @match                http://*/*
// @match                https://*/*
// @run-at               document-start
// @grant                unsafeWindow
// @noframes
// @namespace            https://stomaks.me
// @supportURL           https://stomaks.me?feedback
// @contributionURL      https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=stomaks@gmail.com&item_name=Greasy+Fork+donation
// @author               Maxim Stoyanov (stomaks)
// @developer            Maxim Stoyanov (stomaks)
// @license              MIT
// @compatible           chrome
// @compatible           firefox
// @compatible           opera
// @compatible           safari
// @downloadURL https://update.greasyfork.org/scripts/403035/%11YandexMetrika%20%7C%20Blocker%11.user.js
// @updateURL https://update.greasyfork.org/scripts/403035/%11YandexMetrika%20%7C%20Blocker%11.meta.js
// ==/UserScript==

(function() {
  'use strict';

  unsafeWindow.Ya = unsafeWindow.Ya || window.Ya || {};
  Ya._metrika = Ya._metrika || {};
  Ya._metrika.oo = true;
})();