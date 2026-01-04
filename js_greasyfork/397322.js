// ==UserScript==
// @name         Карточки в ЛК
// @namespace    https://github.com/AndreyYolkin
// @version      0.91
// @description  Не прям огонь, но ты уже привык
// @author       Yolkin
// @match        https://codabra.org/profile/groups
// @grant        none
// @run-at       idle
// @downloadURL https://update.greasyfork.org/scripts/397322/%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B8%20%D0%B2%20%D0%9B%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/397322/%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B8%20%D0%B2%20%D0%9B%D0%9A.meta.js
// ==/UserScript==
let marked = []
try {
    marked = JSON.parse(localStorage.getItem('test'));
}
catch (e) {
    console.log()
}
if (!Array.isArray(marked)) marked = [];

(function() {
    let stl = document.createElement("style")
    stl.innerText = "div.groups-blocks .groups-blocks__block .groups-blocks__confirm button.confirmed {background:#56a97b} div.groups-blocks .groups-blocks__block .groups-blocks__confirm button._hidden {background:#b9b9b9}"
    document.head.appendChild(stl)
    setTimeout(()=>{
        mark();
    document.querySelectorAll("button.confirmed").forEach(button=>button.addEventListener("click",inout))
    }
    , 2250)
})();

function mark() {
    let cards = Array.from(document.querySelectorAll("button.confirmed")).map(button=>button.closest(".groups-blocks__block"))
    cards.map(card=>{
        if (marked.indexOf(card.firstChild.innerText) >= 0) {
            card.querySelector("button").classList.add("_hidden")
            card.__yhidden = true
            card.querySelector("button span").innerText = "Завершено"
        }
    })
    _sort()
}

function inout(e) {
    let card = e.target.closest(".groups-blocks__block")
    if (marked.indexOf(card.firstChild.innerText) >= 0) {
        card.querySelector("button").classList.remove("_hidden")
            card.querySelector("button span").innerText = "Подтверждено"
        marked = marked.filter(a => a!=card.firstChild.innerText)
        card.__yhidden = false
    }
    else {
        card.querySelector("button").classList.add("_hidden")
        card.querySelector("button span").innerText = "Завершено"
        marked.push(card.firstChild.innerText)
        card.__yhidden = true
    }
localStorage.setItem('test', JSON.stringify(marked));
    _sort()
}

function _sort() {
    let cards = document.querySelector(".groups-blocks").childNodes;
    cards = Array.from(cards).sort((a, b) => {
        if (a.__yhidden == true && b.__yhidden == true) {
            return 0
        }
        else if (a.__yhidden == true) {
            return 1
        }
        else if (b.__yhidden == true) {
            return -1
        }
        else return 0
    })
    let board = document.querySelector(".groups-blocks")
    board.innerHTML = ""
    cards.map(card => board.appendChild(card))
}