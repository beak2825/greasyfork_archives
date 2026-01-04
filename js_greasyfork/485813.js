// ==UserScript==
// @name         Mail spam timeout countdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Отсчитывает секунды после в `Сообщение может быть отправлено через N секунд.`
// @author       Something begins
// @license      None
// @match       https://www.heroeswm.ru/sms-create.php*
// @match       https://my.lordswm.com/sms-create.php*
// @match       https://www.lordswm.com/sms-create.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485813/Mail%20spam%20timeout%20countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/485813/Mail%20spam%20timeout%20countdown.meta.js
// ==/UserScript==

const allFonts = document.querySelectorAll("font");
const warningMessageFontArr = Array.from(allFonts).filter(font => {return font.textContent.includes("Сообщение может быть отправлено")});
const warningMessageFont = warningMessageFontArr.length !== 0 ? warningMessageFontArr[0] : false;
const seconds = parseInt(warningMessageFont.textContent.match(/\d+/)[0]);
console.log(seconds);
function getNthParent(ele, N){
    if (N <= 1) return ele;
    else{
        return getNthParent(ele.parentElement, N-1);
    }
}
function tickTock(seconds){
    if (seconds <= 0) {
        warningMessageFont.textContent = "Сообщение можно отправлять.";
        warningMessageFont.style.color = "green";
    }
    else {
        setTimeout(()=>{
            const nextSeconds = seconds - 1;
            warningMessageFont.textContent = warningMessageFont.textContent.replace(seconds.toString(), nextSeconds.toString());
            tickTock(nextSeconds);
        }, 1000);
    }
}
warningMessageFont && tickTock(seconds);

