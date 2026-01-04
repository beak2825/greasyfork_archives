// ==UserScript==
// @name         TQC города
// @version      0.1
// @author       You
// @match        https://taxiqc.ru/*
// @description что-то
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/425039/TQC%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/425039/TQC%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0.meta.js
// ==/UserScript==

const region = ['Москва','Санкт-Петербург', 'Екатеринбург', 'Казань', 'Краснодар', 'Красноярск', 'Новосибирск', 'Пермь', 'Ростов-на-Дону', 'Челябинск', 'Сочи', 'Нижний Новгород', 'Пермь', 'Минск', 'Ереван', 'Алматы']

setTimeout(()=> {
    const tqcRegion = document.querySelector('div[default-caption="Регионы"]').querySelectorAll('label.ng-binding');
    [...tqcRegion].map(reg => {
        reg.parentElement.style.display = 'none'
        if (region.indexOf(reg.textContent) > -1){
            reg.parentElement.style.display = ''
        }
    })
},5000)