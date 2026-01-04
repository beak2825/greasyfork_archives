// ==UserScript==
// @name         forum_blacklist
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  Добавить новый ник в ЧС в коде скрипта: var blacklist = ["Злая Киса", "ThoR"]. Готовая строчка с новым ником: var blacklist = ["Злая Киса", "Thor", "новый_ник"]. Редактировать код можно в расширении Tampermonkey.
// @author       You
// @license     GNU GPLv3
// @match       https://www.heroeswm.ru/forum*
// @match       https://my.lordswm.com/forum*
// @match       https://www.lordswm.com/forum*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459278/forum_blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/459278/forum_blacklist.meta.js
// ==/UserScript==
let blacklist = ["Злая Киса", "ThoR"]
let msg_table = document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody")
let elements_to_remove_arr = []
for (let i = 2; i<=msg_table.children.length; i+=2){
    let msg_nickname= document.querySelector(`body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(${i}) > td:nth-child(1) > nobr > b`).lastChild.innerText
    if (blacklist.includes(msg_nickname)){
        let msg_footer = document.querySelector(`body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(${i})`)
        let msg = document.querySelector(`body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(${i+1})`)
        console.log(msg_footer.innerText); console.log(msg.innerText)
        elements_to_remove_arr.push(msg_footer); elements_to_remove_arr.push(msg)
    }
}
elements_to_remove_arr.forEach(element => {
    element.remove()
})