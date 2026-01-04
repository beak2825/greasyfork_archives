// ==UserScript==
// @name         הסופר של ניב
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  סופר אוטומטי באשכולות ספירה
// @author       You
// @match        https://www.fxp.co.il/showthread.php?t=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fxp.co.il
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467493/%D7%94%D7%A1%D7%95%D7%A4%D7%A8%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/467493/%D7%94%D7%A1%D7%95%D7%A4%D7%A8%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==
let timer;
const element = document.querySelector('#open-thread-controls');
const link = document.createElement("a");
link.innerText = 'התחל לספור';
link.onclick = click;
link.className = "newcontent_textcontrol";
link.style.width = "136px";

if (document.contains(element)) {
    element.after(link);
}

function newReplay(message) {
    const body = new FormData();
    body.append("do", "postreply");
    body.append("message", message);
    body.append("message_backup", message);
    body.append("wysiwyg", 1);
    body.append("loggedinuser", window.USER_ID_FXP);
    body.append("securitytoken", window.SECURITYTOKEN);
    body.append("parseurl", 1);
    body.append("signature", 1);
    body.append("ajax", 1);
    body.append("p", "who cares")
    fetch("https://www.fxp.co.il/newreply.php?t=" + window.THREAD_ID_FXP, { method: 'POST', body }).catch(error => console.log('error', error));
}

function click() {
    const p = prompt('מאיזה מספר להתחיל לספור?');
    let number = /\d+/.test(p) ? parseInt(p) : 1;

    this.innerText = "הפסק לספור";

    timer = setInterval(function () {
        number += 1;
        console.log(number);
        newReplay(number);
    }, 6000);

    this.onclick = function() {
        clearInterval(timer)
        this.innerText = 'התחל לספור';
        this.onclick = click
    }
}