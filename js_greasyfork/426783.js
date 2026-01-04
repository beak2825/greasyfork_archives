// ==UserScript==
// @name        Better SGS
// @namespace   Better SGS by C4illin
// @match       https://marknad.sgs.se/pgSearchResult.aspx*
// @grant       none
// @version     1.2
// @author      C4illin
// @run-at      document-idle
// @description Visar avstånd till Chalmers på SGS hemsida
// @downloadURL https://update.greasyfork.org/scripts/426783/Better%20SGS.user.js
// @updateURL https://update.greasyfork.org/scripts/426783/Better%20SGS.meta.js
// ==/UserScript==


let refresh = setInterval(() => {
  let hash = window.location.hash.split("&take")
  if (hash[1] != "=1000000") {
    hash[1] = "=1000000"
    let newlink = "https://marknad.sgs.se"+ window.location.pathname + window.location.search + hash.join("&take")
    window.location.replace(newlink)
  }
  let value = document.querySelector("#selected-take").value
  if (value != null){
    clearInterval(refresh)

    let distance = {
      "Kustgatan":5,
      "Birger Jarl":4.5,
      "Brahegatan":6.3,
      "Ekbacka":8.2,
      "Fridhemsgatan":5.6,
      "Gibraltar":1.1,
      "Guldhedstornet":1.4,
      "Gårda Fabriker":2.9,
      "Husaren":2,
      "Högsbohöjd":5.5,
      "Kaverös":5.5,
      "Kjellmansgatan":3.4,
      "Kronhusgatan":2.7,
      "Kungsladugård":5.2,
      "Helmotsrogatan":2.2,
      "Dr Forselius Backe":2,
      "Centrala Hisingen":6.5,
      "Nya Varvet":7.2,
      "Ostkupan":3.0,
      "Pennygången":5.0,
      "Plejaden":6.9,
      "Postgatan":2.8,
      "Rosendal":6,
      "Selma":9.1,
      "Rotary":1,
      "Tredje Långgatan":2.6,
      "Norra Ågatan":3.6,
      "Östra Kålltorp":5.6,
      "Olofshöjd":1.7,
      "Mandolingatan":7,
      "Lindholmsallén":6.4,
      "Kviberg":7.6,
      "Ceres":6.6,
      "Volrat Tham":1.1,
      "Viktor Rydberg":0.8,
      "Odin":3.1,
      "Medicinareberget":1.5,
      "Lilla Torp":4.4,
      "Hökegårdsgatan":2.4,
      "Dr Lindhs Gata":1.9,
    }

    let table = document.querySelector("table.table.table-striped")
    let tableH = document.createElement("th")
    tableH.innerHTML = "till Chalmers"
    table.children[0].children[0].appendChild(tableH)

    table.children[0].children[0].children[8].style.display = "none" // hide where it is from torget etc

    let tr = table.children[1].children

    for (let i = 0; i < tr.length; i++) {
      tr[i].children[8].style.display = "none"
      let address = tr[i].children[1].innerHTML
      let distelem = document.createElement("td")
      if (distance[address]) {
        distelem.innerHTML = (distance[address] + " km").replace(".",",")
      } else {
        distelem.innerHTML = ""
      }
      tr[i].appendChild(distelem)
    }
  }
}, 1000)

// table tr > *:nth-child(2) {
//   display: none;
// }