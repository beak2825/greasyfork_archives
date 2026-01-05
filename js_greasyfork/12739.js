// ==UserScript==
// @name           HWM_Battle_Announce
// @namespace      Рианти
// @description    Звуковое оповещение о начавшемся бое
// @version        1
// @include        http://www.heroeswm.ru/war.php*
// @downloadURL https://update.greasyfork.org/scripts/12739/HWM_Battle_Announce.user.js
// @updateURL https://update.greasyfork.org/scripts/12739/HWM_Battle_Announce.meta.js
// ==/UserScript==

if(document.URL.toString().indexOf('lt=-1') == -1) new Audio("http://www.soundjay.com/button/beep-1.wav").play();