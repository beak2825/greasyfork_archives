// ==UserScript==
// @name           Headlapse
// @name:ru        Шапкозакрывательство
// @description    Hide topic head with spoiler on all pages except first
// @description:ru Каждой шапке по шапке! /Свернуть шапки тем под спойлер на всех страницах темы, кроме первой/
// @version        0.0.6
// @date           23.12.2017
// @author         Halibut
// @namespace      https://greasyfork.org/en/users/145947-halibut
// @homepageURL    https://greasyfork.org/en/scripts/36645-headlapse
// @supportURL     https://forum.ru-board.com/topic.cgi?forum=2&topic=56723&glp
// @license        HUG-WARE
// @include        http*://forum.ru-board.com/topic.cgi?forum=*&topic=*
// @exclude        /^https?:\/\/forum\.ru-board\.com\/topic\.cgi\?forum=\d+&topic=\d+(#\d+|#lt|&start=0)?$/
// @noframes
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/36645/Headlapse.user.js
// @updateURL https://update.greasyfork.org/scripts/36645/Headlapse.meta.js
// ==/UserScript==

/******************************************************************************
 * "THE HUG-WARE LICENSE" (Revision 2): As long as you retain this notice you *
 * can do whatever you want with this stuff. If we meet some day, and you     *
 * think this stuff is worth it, you can give me/us a hug.                    *
 *────────────────────────────────────────────────────────────────────────────*
 *────────────────────────────████────────────████────────────────────────────*
 *───────────────────────────█────██████████─█───██───────────────────────────*
 *──────────────────────────█───████────────███────█──────────────────────────*
 *──────────────────────────██─██─────────────███──█──────────────────────────*
 *───────────────────────────███────────────────███───────────────────────────*
 *───────────────────────────██──────────────────█────────────────────────────*
 *──────────────────────────██────███─────███────██───────────────────────────*
 *──────────────────────────█────██─██───██─██────█───────────────────────────*
 *──────────────────────────█─────███─────███─────█───────────────────────────*
 *───────────────────█████───█────────███────────█────█████───────────────────*
 *──────────────────██───███──█─────█──█──█─────██──███───██──────────────────*
 *──────────────────█───────██─█────███─███────██─██───────█──────────────────*
 *──────────────────██────────████───────────█████────────██──────────────────*
 *───────────────────███────────████████████████───────████───────────────────*
 *─────────────────────█████───██─────████─────██──█████──────────────────────*
 *─────────────────────────█████────────────────████──────────────────────────*
 *─────────────────────────────█─────────────────█────────────────────────────*
 *────────────────────────────██─────────────────██───────────────────────────*
 *────────────────────────────█───────────────────█───────────────────────────*
 *────────────────────────────█───────────────────█───────────────────────────*
 *────────────────────────────██─────────────────██───────────────────────────*
 *──────────────────────────████████─────────████████─────────────────────────*
 *─────────────────────────██──────██───────██──────██────────────────────────*
 *────────────────────────██────────█──────██────────██───────────────────────*
 *────────────────────────█─────────█──────█──────────█───────────────────────*
 *────────────────────────███─────████──█████──────███────────────────────────*
 *──────────────────────────████████──█████──████████─────────────────────────*
******************************************************************************/

window.addEventListener('DOMContentLoaded', function headlapse() {
    "use strict";
    this.removeEventListener('DOMContentLoaded', headlapse);
    const tpcHead = document.getElementsByClassName('tb')[0]
    if (!tpcHead || tpcHead && !tpcHead.querySelector('a.tpc[href$="&postno=1"]')) return;
    tpcHead.hidden = true;
    const dummyNode = tpcHead.parentNode.insertBefore(document.createElement('div'), tpcHead),
          show = '\u25BA Показать шапку темы',
          hide = '\u25BC Скрыть шапку темы';
    dummyNode.outerHTML = '<table width="95%" cellspacing="1" cellpadding="3" bgcolor="#999999" align="center" border="0"><tbody><tr><td valign="middle" bgcolor="#dddddd" align="left"></td></tr></tbody></table>';
    const spoilerHead = tpcHead.previousElementSibling,
          spTitle = spoilerHead.getElementsByTagName('td')[0];
    spoilerHead.style.cssText = '-moz-user-select: none !important;-webkit-user-select: none !important; -ms-user-select: none !important; user-select: none !important; cursor: pointer !important';
    spTitle.textContent = show;
    spoilerHead.onclick = e => {
        if (e.button != 0) return;
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        tpcHead.hidden = !tpcHead.hidden;
        spTitle.textContent = tpcHead.hidden ? show : hide;
    }
});