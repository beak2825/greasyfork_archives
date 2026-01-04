// ==UserScript==
// @license MIT
// @name         Seldon Basis интеграция
// @namespace    http://tampermonkey.net/
// @version      2025-03-07
// @description  добавляет кнопку открытия компании Seldon Basis в карточке сделки Битрикс24
// @author       mikhail
// @match        https://fopart.bitrix24.ru/crm/deal/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529089/Seldon%20Basis%20%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529089/Seldon%20Basis%20%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D1%8F.meta.js
// ==/UserScript==


function main(){
    let doc = document.getElementsByClassName("pagetitle crm-pagetitle");
    let res;
    for (let item of doc){
        res = item;
    }
    let inn = res.children.pagetitle_btn_wrapper.innerText;
    let basisString = "https://basis.myseldon.com/ru/search?f[searchString]=" + inn;
    let openBasis = document.createElement("BUTTON");
    openBasis.innerHTML = '<img src="https://basis.myseldon.com/content/img/actions/seldon.png" width="30" heigth="30"/>';
    openBasis.onclick=function(){window.open(basisString)};
    res.appendChild(openBasis);
}

main();