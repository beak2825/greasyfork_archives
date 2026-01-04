// ==UserScript==
// @name        Better czarnolisto
// @namespace   bczlst
// @match       https://www.wykop.pl/*
// @grant       none
// @version     1.1
// @author      janekhe
// @description Hardkorowa wersja czarnej listy
// @downloadURL https://update.greasyfork.org/scripts/457013/Better%20czarnolisto.user.js
// @updateURL https://update.greasyfork.org/scripts/457013/Better%20czarnolisto.meta.js
// ==/UserScript==

let cwele = []

const ukryte = document.querySelectorAll(".wblock.lcontrast.dC.hidden-comment")
const wszystkie = document.querySelectorAll(".sub .wblock.lcontrast.dC")

ukryte.forEach((e) => {
    zapiszCwela(e.innerHTML)
    e.style.display = 'none'
});

function zapiszCwela(inner) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(inner.toString(), 'text/html');

   const cwel = doc.querySelector('div > .showProfileSummary > b')

    if(!cwele.includes(cwel.innerHTML)) {
         cwele.push(cwel.innerHTML)
    }
}

wszystkie.forEach((e) => {
  cwele.forEach((cwel)=> {
      if (e.innerHTML.includes(`>${cwel}`)) {
        e.style.display = 'none'
      }
  })
});

