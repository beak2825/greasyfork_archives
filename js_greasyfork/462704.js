// ==UserScript==
// @name         clan mail blacklist
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Добавить новый ник в ЧС в коде скрипта на 14 строке. Инструкция по добавлению ника на 15 строке. Редактировать код можно в расширении (Tampermonkey).
// @author       You
// @match       https://www.heroeswm.ru/sms_clans.php?clan_id=*
// @match       https://my.lordswm.com/sms_clans.php?clan_id=*
// @match       https://www.lordswm.com/sms_clans.php?clan_id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license     GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462704/clan%20mail%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/462704/clan%20mail%20blacklist.meta.js
// ==/UserScript==
let blacklist = ["ник1_!", "ник_2!"]
// добавление ника в ЧС дожно выглядеть так: ["ник1_!", "ник_2!", "новый ник"]
let ele_to_remove = []
let div_table = document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody")
blacklist.forEach((nick, index) => {
  blacklist[index] = nick.toLowerCase().trim();
});
for (let i = 1; i<=div_table.children.length; i++){
    let nickname = document.querySelector(`body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(${i}) > td:nth-child(1) > a > b`)
    try{
        nickname = nickname.textContent.toLowerCase().trim()
    }
    catch{
        continue
    }
    let child = document.querySelector(`body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(${i})`)
    if (blacklist.includes(nickname)){
        ele_to_remove.push(child)
    }
}
ele_to_remove.forEach(ele=>{
    ele.remove()
})