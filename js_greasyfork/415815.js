// ==UserScript==
// @name         DTF comment spoiler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Сворачивает раздел комментариев
// @author       Fenrir
// @match        https://dtf.ru/*
// @run-at         document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415815/DTF%20comment%20spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/415815/DTF%20comment%20spoiler.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function headlapse() {
    if (document.getElementsByClassName('comments') !== null) {
        this.removeEventListener('DOMContentLoaded', headlapse);
        const comments = document.getElementsByClassName('comments')[0]
        comments.hidden = true;
        const dummyNode = comments.parentNode.insertBefore(document.createElement('div'), comments),
              show = '\u25BA Показать комментарии',
              hide = '\u25BC Скрыть комментарии';
        dummyNode.outerHTML = '<table width="95%" cellspacing="1" cellpadding="3" bgcolor="#999999" align="center" border="0"><tbody><tr><td valign="middle" bgcolor="#ffffff" align="left"></td></tr></tbody></table>';
        const spoilerHead = comments.previousElementSibling,
              spTitle = spoilerHead.getElementsByTagName('td')[0];
        spoilerHead.style.cssText = '-moz-user-select: none !important;-webkit-user-select: none !important; -ms-user-select: none !important; user-select: none !important; cursor: pointer !important';
        spTitle.textContent = show;
        spoilerHead.onclick = e => {
            if (e.button != 0) return;
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            comments.hidden = !comments.hidden;
            spTitle.textContent = comments.hidden ? show : hide;
        }
        console.log("test comments spoiler");
    };
});