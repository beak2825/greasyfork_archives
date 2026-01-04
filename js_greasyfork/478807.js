// ==UserScript==
// @name            mmdm.ru login fixer
// @namespace       github.com/a2kolbasov
// @version         1.0.1
// @description     Fixes a bug with inability to login / register on the website of the Moscow International House of Music if an ad blocker blocks Yandex Metrica
// @description:ru  Исправляет ошибку с невозможностью входа / регистрации на сайте Московского международного Дома музыки, если блокировщик рекламы блокирует Яндекс Метрику
// @author          Aleksandr Kolbasov
// @license         MIT
// @icon            https://ipfs.io/ipfs/bafybeifivfk5tsc2wgq6v4ytaus5fn5ixegzxymlytwukudil34mnit35i
// @match           https://www.mmdm.ru/*
// @match           https://mmdm.ru/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/478807/mmdmru%20login%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/478807/mmdmru%20login%20fixer.meta.js
// ==/UserScript==

/*
 * Copyright © 2023 Aleksandr Kolbasov
 *
 * Licensed under the MIT License
 * (https://opensource.org/license/mit/)
 */

(() => {
    'use strict';
    const missingObj = 'yaCounter28510826';

    if (!window[missingObj]) window[missingObj] = new Proxy({}, {
	    get(obj, prop) {
		    return () => undefined;
	    }
    });
})();
