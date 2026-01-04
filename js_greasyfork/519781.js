// ==UserScript==
// @name         P2P Trade on Telegram Web app PC unlocker
// @include *:*
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  include *:* is necessary because mini applications in Telegram are displayed within an IFRAME and have their own distinct addresses, separate from Telegram.This code bypasses the verification of these applications, making them believe you are using an Android device, thereby enabling their functionality on a PC.
// @author       Atamg
// @grant            GM_getResourceText
// @connect          *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519781/P2P%20Trade%20on%20Telegram%20Web%20app%20PC%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/519781/P2P%20Trade%20on%20Telegram%20Web%20app%20PC%20unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
// @include *:* is necessary because mini applications in Telegram are displayed within an IFRAME and have their own distinct addresses, separate from Telegram.
// This code bypasses the verification of these applications, making them believe you are using an Android device, thereby enabling their functionality on a PC.
// @license MIT
const customConsole = {
  log: function() {
    // Оставьте эту функцию пустой, чтобы отключить все логи
    // или замените её на оригинальную функцию console.log
    // console.log.apply(console, arguments);
  }
};
// Переназначаем console на нашу обертку

//unsafeWindow.console = customConsole;
//window.console = customConsole;
// bypass the platform through proxying to open via the telegram web version
if (unsafeWindow && unsafeWindow.Telegram && unsafeWindow.Telegram.WebApp) {
    unsafeWindow.Telegram.WebApp = new Proxy(unsafeWindow.Telegram.WebApp, {
        get(target, prop) {
            // Перехватываем обращение к свойству 'platform'

            if (prop === 'platform') {
                return 'android';
            }
            // Перехватываем вызовы методов
            if (typeof target[prop] === 'function') {
                return function(...args) {
                    console.log(`Method ${prop} called with arguments:`, args);

                    // Изменяем поведение метода 'exampleMethod'
                    if (prop === 'exampleMethod') {
                        // Модифицируем аргументы или выполняем другие действия
                        args[0] = 'modified argument';
                    }

                    // Вызываем оригинальный метод
                    return target[prop].apply(this, args);
                };
            }

            return target[prop];
        }
    });
}

    // bypass the platform through proxying to open via the telegram web version
if (unsafeWindow && unsafeWindow.Telegram && unsafeWindow.Telegram.WebView) {
    unsafeWindow.Telegram.WebView = new Proxy(unsafeWindow.Telegram.WebView, {
        get(target, prop) {
            // Перехватываем обращение к свойству 'platform'

            if (prop === 'initParams') {
                return 'android';
            }
            // Перехватываем вызовы методов
            if (typeof target[prop] === 'function') {
                return function(...args) {
                    console.log(`Method ${prop} called with arguments:`, args);

                    // Изменяем поведение метода 'exampleMethod'
                    if (prop === 'exampleMethod') {
                        // Модифицируем аргументы или выполняем другие действия
                        args[0] = 'modified argument';
                    }

                    // Вызываем оригинальный метод
                    return target[prop].apply(this, args);
                };
            }

            return target[prop];
        }
    });
}


})();