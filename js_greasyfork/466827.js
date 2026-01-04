// ==UserScript==
// @name         מקריא אשכולות
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  מוסיף כפתור שמקריא את האשכולות
// @author       You
// @match        https://www.fxp.co.il/show*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fxp.co.il
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466827/%D7%9E%D7%A7%D7%A8%D7%99%D7%90%20%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/466827/%D7%9E%D7%A7%D7%A8%D7%99%D7%90%20%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA.meta.js
// ==/UserScript==

if (!('speechSynthesis' in window)) {
    return console.log('הדפדפן לא תומך בהקראה')
}
const ismobile = typeof ISMOBILEFXP !== 'undefined';
function stop() {
    speechSynthesis.cancel();
}
function play() {
    const text = [...document.querySelectorAll('.postbit')].map(element => {
        const author = ismobile ? '.xsaid' : '.username';
        const start = 'המשתמש ' + element.querySelector(author).textContent + ' כתב'
        return start + '\n' + element.querySelector(ismobile ? '.content' : '.postcontent').textContent;
    }).join('\n');
    console.log(text);
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'he';
    speech.onstart = function() {
        link.innerText = 'עצור הקראה';
        link.onclick = stop;
    }
    speech.onend = function() {
        link.innerText = 'הקרא אשכול';
        link.onclick = play;
    }
    speech.onerror = function() {
        link.innerText = 'הקרא אשכול';
        link.onclick = play;
    }
    speechSynthesis.speak(speech);
}
window.onunload = stop;
const link = document.createElement("a");
link.innerText = 'הקרא אשכול';
link.onclick = play;
link.className = "newcontent_textcontrol";
link.style.width = "136px";
if (ismobile) {
    document.querySelector('.page_title_fxp').after(link);
    return;
}
document.querySelector(window.LOGGEDIN ? '#open-thread-controls' : '#above_postlist').after(link);
