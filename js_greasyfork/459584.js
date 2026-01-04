// ==UserScript==
// @name GeoGuessr Streak Unique Counter
// @namespace   ggsuc
// @description Count the number of unique countries/regions in an ongoing streak
// @version 0.5
// @match https://www.geoguessr.com/*
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459584/GeoGuessr%20Streak%20Unique%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/459584/GeoGuessr%20Streak%20Unique%20Counter.meta.js
// ==/UserScript==

var etat_precedant = 0

window.addEventListener("locationchange", () => { etat_precedant = 0 })

window.addEventListener("load", (event) => {
    let bodyList = document.querySelector("body")

    let observer = new MutationObserver(function (mutations) {
      	if (location.pathname.includes("/challenge/") || location.pathname.includes("/results/") || location.pathname.includes("/game/")) {
            checkPage();
        }
    });

    let config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
});

function checkPage() {
    let id = location.pathname.split("/").pop()

  	if (etat_precedant != 1) {
      let divs = document.querySelectorAll("div[class*=streak-round-result_answerLabel]")
      if (divs.length == 1) {
        etat_precedant = 1
        let liste = JSON.parse(localStorage["ggsuc-"+id] || "[]")

        let pays = divs[0].querySelector("span").innerText
        if (!liste.includes(pays)) {
          	liste.push(pays)
          	localStorage["ggsuc-"+id] = JSON.stringify(liste)
        }
      }
    }

  	if (etat_precedant != 2) {
      let div = document.querySelector("div[class*=status_streaksValue]")
      if (div != null) {
        	etat_precedant = 2
          let liste = JSON.parse(localStorage["ggsuc-"+id] || "[]")

          let div2 = div.parentElement.nextElementSibling
          if (div2 == null) {
              div2 = document.createElement("div")
              div2.className = "status_section__8uP8o"
              div.parentElement.after(div2)
          }

        	let div3 = div2.querySelector("div[class*=status_streaksValue]")
          if (div3 == null) {
              div3 = document.createElement("div")
              div3.className = div.className
            	div3.addEventListener("click", (ev) => { navigator.clipboard.writeText(ev.target.parentElement.title) })
              div2.appendChild(div3)
          }

          if (div3.innerText.length == 0 || div3.innerText != "🚩" + liste.length) {
              div3.innerText = "🚩" + liste.length
            	div2.title = liste.join(", ")
          }
      }
    }
}
