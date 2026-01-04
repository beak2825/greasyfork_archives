// ==UserScript==
// @name         המדגישה של ניב
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  מדגיש אשכולות פתוחים במשוב ותמיכה
// @author       RemixN1V - Niv
// @match        https://www.fxp.co.il/forumdisplay.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484431/%D7%94%D7%9E%D7%93%D7%92%D7%99%D7%A9%D7%94%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/484431/%D7%94%D7%9E%D7%93%D7%92%D7%99%D7%A9%D7%94%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==

(function() {
    const forums = ["18", "1510", "1511", "4723", "1514", "19", "994", "6852"];
    if (!forums.includes(FORUM_ID_FXP)) return;

    $('.threadbit').filter((i, t) => !$(t).attr('class').includes('lock')).css("background", "dodgerblue").children().css("background-color", "transparent");
})();