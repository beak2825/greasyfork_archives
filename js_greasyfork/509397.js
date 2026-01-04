// ==UserScript==
// @name         Event placement on achievement icons
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Место в рейтинге отображается на ачивках
// @author       Something begins
// @match        https://www.heroeswm.ru/pl_info.php*
// @match        https://my.lordswm.com/pl_info.php*
// @match        https://lordswm.com/pl_info.php*
// @license      trust me bro
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509397/Event%20placement%20on%20achievement%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/509397/Event%20placement%20on%20achievement%20icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

for (const achievement of document.querySelectorAll(".t_noselect")){
    const text = achievement.getAttribute("hint");
    if (!text) continue;
    let placement = text.replace(/,/g, "").match(/есто в рейтинге - (\d+)/);
    if (!placement) continue;
    placement = placement[1];
    achievement.insertAdjacentHTML("beforeend", `<div align="center" valign="middle" style="font-weight: bold; color: white; margin:0px; background-repeat: no-repeat; width: 20px; height:15px; left:15px; top:35px; position:absolute; text-shadow: 4px 4px 8px blue;">
  ${placement}
</div>
`)
}

})();