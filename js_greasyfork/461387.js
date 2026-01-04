// ==UserScript==
// @name         Hotel Sort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sorts hotel
// @author       You
// @match        https://waifugame.com/hotel*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waifugame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461387/Hotel%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/461387/Hotel%20Sort.meta.js
// ==/UserScript==

let btn = document.getElementById("toggleMulti");

function createButton(name, buttonText, func) {
    let btn2 = btn.cloneNode();
    btn.before(btn2);
    btn2.id = name;
    btn2.innerHTML = '<i class="fas fa-sort-amount-down"></i> ' + buttonText;
    console.log(btn2.innerHTML);
    btn2.style.marginRight = "20px";
    btn2.onclick = function () {
        sortBy(func);
    }
}

function getPCL(hotelCard) {
    //let reg = /(?:[a-zA-Z]:\s)(\d+)/g;
    //let specialStats = [...(hotelCard.children[1].children[1].innerText).matchAll(reg)].map(item => parseInt(item[1]));
    let reg = /([a-zA-Z]:\s\d+)/g;
    let specialStats = {};
    [...(hotelCard.children[1].children[1].innerText).match(reg)].forEach(function (statLine) {
        let stat = statLine.split(": ")
        specialStats[stat[0]] = parseInt(stat[1]);
    })

    return specialStats["P"] + specialStats["C"] + specialStats["L"];
}

function sortBy(func) {
    let hotelCards = [...document.querySelectorAll('div[class="row hotelListing"]')]
    let hotel = document.getElementsByClassName("content mt-3")[0]
    hotelCards.sort(function(a, b) {
        return func(b) - func(a);
    });
    for (let card of hotelCards) {
        hotel.appendChild(card);
    }
}

createButton('sortByPCL', "Sort by PCL", getPCL)