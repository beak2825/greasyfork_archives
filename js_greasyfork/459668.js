// ==UserScript==
// @name         אשכולות ללא מענה
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  מוסיף אפשרות לראות אשכולות ללא מענה בקלות ובנוחות
// @author       You
// @match        https://www.fxp.co.il/forumdisplay.php?f=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fxp.co.il
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/459668/%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA%20%D7%9C%D7%9C%D7%90%20%D7%9E%D7%A2%D7%A0%D7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/459668/%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA%20%D7%9C%D7%9C%D7%90%20%D7%9E%D7%A2%D7%A0%D7%94.meta.js
// ==/UserScript==
if (typeof ISMOBILEFXP !== 'undefined' || forumname === categoryname) {
    return;
}
const doIt = location.href.includes("clean");

if (doIt) {
    createLink("כל האשכולות", "forumdisplay.php?f="+ window.FORUM_ID_FXP);
    const threads = document.querySelectorAll("#threads .threadbit");
    const pages = document.querySelectorAll('.threadpagenav span a[title]');

    for (const thread of threads) {
        const element = thread.querySelector(".arreplycount");
        const count = parseInt(element.innerText.trim())
        if (count > 0) {
            thread.style.display = "none";
        }
    }
    for (const page of pages) {
        page.href += "&clean";
    }

    return;
}

createLink("אשכולות ללא מענה", "forumdisplay.php?f="+ window.FORUM_ID_FXP +"&pp=200&daysprune=7&clean");

function createLink(text, url) {
    const link = document.createElement("a");
    link.innerText = text;
    link.href = url;
    link.className = "newcontent_textcontrol";
    link.style.width = "136px";

    document.querySelector(window.LOGGEDIN ? '.above_threadlist' : '.threadpagenav').after(link);
}