// ==UserScript==
// @name         hwm_price_for_one_battle
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Лосось
// @description  shows price for 1 battle from shop, market and map
// @match        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(art_info).php*/
// @include      /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(art_info).php*/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478950/hwm_price_for_one_battle.user.js
// @updateURL https://update.greasyfork.org/scripts/478950/hwm_price_for_one_battle.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let query = '&sort=204&type=0&'

    const createElement = (el, style, innerText) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        return element;
    }

    let tables = [...document.getElementsByTagName('table')];
    let amount = tables[tables.length - 1].innerText;
    let shopStrength = Number(document.getElementsByClassName('s_art_inside')[0].innerText.match(/прочность: \d+/gi)[0].match(/\d+/gi).join(''));
    amount = Number(amount.replace(',',''))*1.05;

    let infoBlockHtml = document.getElementById('set_mobile_max_width');

    let myInfoBlock = createElement('div');
    let amountInfoSpan = createElement('div', '', `Цена за бой в магазине ${Math.round(amount / shopStrength)}`);

    myInfoBlock.appendChild(amountInfoSpan);

    infoBlockHtml.insertBefore(myInfoBlock, infoBlockHtml.lastElementChild);

    let links = document.querySelectorAll('.art_info_left_block')[0].lastElementChild;
    links = [...links.getElementsByTagName('a')];
    let linkToMarket;
    let linkToMap;
    links.forEach(el => {
       if (el.innerText.trim() === 'На рынке') {
          linkToMarket = el.href;
       } else if (el.innerText.trim() === 'На карте') {
          linkToMap = el.href;
       }
    })
    linkToMarket = linkToMarket.split('&');
    linkToMarket.splice(1, 0, query);
    linkToMarket = linkToMarket.join('');

    const getMarket = (doc) => {
        let priceBlock = doc.getElementsByClassName('wbwhite')[0];
        let price = Number(priceBlock.getElementsByTagName('table')[3].getElementsByTagName('td')[1].innerText.replace(',', ''));
        let strength = Number(priceBlock.getElementsByTagName('table')[1].getElementsByTagName('td')[1].innerText.match(/Прочность: .+/gi)[0].match(/\d+/gi)[0]);
        let priceForOneBattle = createElement('div', '', `Цена за бой на рынке ${Math.round(price / strength)}`);
        myInfoBlock.appendChild(priceForOneBattle);
    }

    const getMap = (doc) => {
        let table = doc.getElementById('global_table_div');
        let amount = Number(table.getElementsByTagName('tbody')[0].firstChild.lastChild.innerText.trim().replace(',', ''));
        let priceForOneBattle = createElement('div', '', `Цена за бой на предприятии ${Math.round(amount / shopStrength)}`);
        myInfoBlock.appendChild(priceForOneBattle);
    }

    const fetchXml = (link, callback) => {
        if (!link) return;
        const xhr = new XMLHttpRequest();
        xhr.open('get', link);
        xhr.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/html; charset=windows-1251');
        }

        xhr.addEventListener('load', () => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(xhr.responseText, "text/html");
            callback(doc);
        })
        xhr.send();
    }
    fetchXml(linkToMarket, getMarket);
    fetchXml(linkToMap, getMap)

})();