// ==UserScript==
// @name         quick_faction_change
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Сменить фракцию на установленную в коде. Действует на складе, рынке в магазине. Название кнопки поменять на 13 строке, порядковый номер фракции на 14, сигн на 15. Свой сигн можно получить в магазине артефактов после покупки любого лота в конце URL будет sign=.....
// @author       Something begins
// @license      none
// @include     /^https?:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com))\/(sklad_info|shop|auction).*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480703/quick_faction_change.user.js
// @updateURL https://update.greasyfork.org/scripts/480703/quick_faction_change.meta.js
// ==/UserScript==
const _ajaxTimeout = 5000;
const fraktsiya = "Демон";
const fr = 7;
const sign = "m4o4t5o345";
function postRequest(target, params, ajaxCallback, timeoutHandler) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            location.reload();
        }
    }
    xmlhttp.open('GET', target + params, true);
    xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlhttp.timeout = _ajaxTimeout;
    xmlhttp.ontimeout = function () {
        alert("Таймаут исчерпан, попробуйте заново");
    }
    xmlhttp.send(params);
}
 
function changeToDemon(){
    const cl = 0;
    postRequest("/castle.php", '?change_clr_to=' + (cl ? cl + '0' + fr : fr) + '&sign=' + sign);
}
document.body.insertAdjacentHTML("afterbegin", `<button id = "change_to_demon" style = "position: fixed; top: 30px">${fraktsiya}</button>`);
 
document.querySelector("#change_to_demon").addEventListener("click", event => {
    event.preventDefault();
    changeToDemon();
})