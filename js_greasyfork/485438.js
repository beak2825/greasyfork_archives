// ==UserScript==
// @name         1_checkInBattle
// @namespace    http://tampermonkey.net/
// @version      2025.1
// @description  try to take over the world!
// @author       Something begins
// @license    none
// @match       https://www.heroeswm.ru/bselect.php?all=1
// @match       https://my.lordswm.com/bselect.php?all=1
// @match       https://www.lordswm.com/bselect.php?all=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485438/1_checkInBattle.user.js
// @updateURL https://update.greasyfork.org/scripts/485438/1_checkInBattle.meta.js
// ==/UserScript==
const clanLink = location.origin + "/clan_info.php?id=928";
const _ajaxTimeout = 5000;
const secondNicks = ['осиновый кол', 'град', "_серый_волчара_", "_пряня_", "timoxxx", "слип_найт", "ayse", "Waitest", "Prud", "Tifosi","gott ausserkontrol", "yavlat"];
for (let i = 0; i< secondNicks.length; i++){
    secondNicks[i] = secondNicks[i].toLowerCase();
}
const parser = new DOMParser();
function send_get(url)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.send(null);

  if(xhr.status == 200)
    return xhr.responseText;

  return null;
};
function getRequest(target, ajaxCallback = ()=>{}) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            ajaxCallback(xmlhttp.responseText);
            return xmlhttp.responseText;
        }
    }
    xmlhttp.open('GET', target, true);
    xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlhttp.timeout = _ajaxTimeout;
    xmlhttp.ontimeout = function () {
        alert("Таймаут исчерпан, попробуйте заново");
    }
    xmlhttp.send(null);
}
function getOnlineChars(HTMLText){
    const doc = parser.parseFromString(HTMLText, "text/html");;
    console.log(doc.innerHTML);
    const tbody = doc.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody");
    const dict = {};
    for (const tr of tbody.children){
        const img = tr.querySelector("img");
        const online = img.src.includes("online") ? true : false;
        const name = tr.children[2].textContent.trim().toLowerCase();
        if (dict[name]) continue;
        dict[name] = {online: online, link: tr.children[2].querySelector("a").href};
    }
    console.log(dict);
    const onlineChars = [];
    for (const nickname of secondNicks){
        if (!dict[nickname] || !dict[nickname].online) continue;
        console.log(dict[nickname].link);
        onlineChars.push(nickname);
    }
    console.log("onlineChars", onlineChars);
    return onlineChars;
}
const div = document.querySelector("#hwm_no_zoom > div:nth-child(2) > div:nth-child(2)");
const trs = div.innerHTML.split(/<!--.+-->/);
let warningMessage = "";

const HTMLText = send_get(clanLink);
console.log(HTMLText);
const chars = getOnlineChars(HTMLText);
let charsString = "";
for (const char of chars){
    if (chars.indexOf(char) === chars.length -1) charsString += char;
    else charsString += (char +", ");
}
warningMessage += "Online: \n" + charsString + "\nВ бою:";
const temp = warningMessage;
let battleWarning = "\n";
for (const trText of trs){
    const trEle = parser.parseFromString(trText, "text/html");
    let nickname = trEle.querySelector("a.pi");
    if (!nickname) continue;
    nickname = nickname.textContent;
    const battleLink = Array.from(trEle.querySelectorAll("a")).filter(a => {return a.className !== "pi"})[0].href;
    if (secondNicks.filter(listNick => {return listNick.trim().toLowerCase() === nickname.trim().toLowerCase()}).length !== 0 ){
        console.log(nickname, battleLink);
        battleWarning += nickname + " || " + trEle.body.textContent + "\n";
    }
}
temp !== "" && alert(temp + battleWarning);
temp === "" && alert(temp + "\nНикого в бою нет");
//location.reload();

