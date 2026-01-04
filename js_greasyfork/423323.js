// ==UserScript==
// @name         WBAntiExcise
// @namespace    https://greasyfork.org/
// @version      1.1.1
// @description  Автоматически ставит галку "Акциз отсутствует" при приёмке и продаже.
// @author       Mr. Anderson
// @match        https://npos.wildberries.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423323/WBAntiExcise.user.js
// @updateURL https://update.greasyfork.org/scripts/423323/WBAntiExcise.meta.js
// ==/UserScript==
 
setInterval(() => {
const modal = document.querySelector('.modal-container');
if(modal && modal.querySelector('.title')?.textContent == "Внимание!") {
modal.querySelector('input[type=checkbox]').click()
setTimeout(() => {
modal.querySelector('.button').click();
},100)
}
}, 500)
