// ==UserScript==
// @name        Ночная читалка для Флибусты
// @namespace   Azazar's Scripts
// @match       *://flibusta.is/b/*/read
// @match       *://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion/b/*/read
// @match       *://flibusta.i2p/b/*/read
// @match       *://zmw2cyw2vj7f6obx3msmdvdepdhnw2ctc4okza2zjxlukkdfckhq.b32.i2p/b/*/read
// @grant       GM_addStyle
// @version     1.2
// @description Шрифт побольше в читалке, ограничение ширины текста и ночной режим
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496929/%D0%9D%D0%BE%D1%87%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B8%D1%82%D0%B0%D0%BB%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%A4%D0%BB%D0%B8%D0%B1%D1%83%D1%81%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496929/%D0%9D%D0%BE%D1%87%D0%BD%D0%B0%D1%8F%20%D1%87%D0%B8%D1%82%D0%B0%D0%BB%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%A4%D0%BB%D0%B8%D0%B1%D1%83%D1%81%D1%82%D1%8B.meta.js
// ==/UserScript==

GM_addStyle(`#main { line-height: 1.4em; background-color: black; color: #ffffff; font-size: 2em; padding: 0 calc((100% - 30em) / 2) 0 calc((100% - 30em) / 2) }`);
