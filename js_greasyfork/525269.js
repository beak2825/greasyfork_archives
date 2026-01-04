// ==UserScript==
// @name         MarvelRivalsEloSummarizer
// @namespace    http://tampermonkey.net/
// @version      2025-09-24
// @description  Marvel Rivals Elo Summarizer for day for Tracker.gg
// @license      GPL
// @author       DarkestRain
// @match        https://tracker.gg/marvel-rivals/profile/ign/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tracker.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525269/MarvelRivalsEloSummarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/525269/MarvelRivalsEloSummarizer.meta.js
// ==/UserScript==

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}


let btn = document.createElement('button');
btn.className = "v3-button px-3 text-14 h-10 font-medium leading-4/4 cursor-pointer transition-all duration-150 ease-in whitespace-nowrap hover:bg-mix-action/85 hover:bg-mix-white text-action-contrast bg-action shadow-control shadow-action/25";
btn.id = "summarize-button"
btn.style = "max-width: 100px;min-width: 50px;gap: 8px; position: absolute; right: 10px;top: 60px;"
btn.textContent = "Summarize";
btn.addEventListener("click", summarize);


waitForElm('.updater').then((elm) => {
  if (!window.location.href.includes("mode=competitive")) {
    btn.style.visibility = "hidden"
  }
  elm.parentNode.insertBefore(btn, elm.nextSibling)
});


let currentUrl = location.href;
setInterval(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    if (!window.location.href.includes("mode=competitive")) {
      document.querySelector("#summarize-button").style.visibility = "hidden"
    } else {
      document.querySelector("#summarize-button").style.visibility = "visible"
    }
  }
}, 500);


function summarize() {
  if (window.location.href.includes("mode=competitive")) {
    let days = document.querySelectorAll(".col-span-full.grid.grid-cols-subgrid.gap-5")
    document.querySelectorAll(".elo_sum").forEach(el => {
      el.remove()
    })
    days.forEach(el => {
      let sum = 0;
      let matches = el.querySelectorAll(".v3-match-row")
      matches.forEach(match => {
        let elo = match.querySelector("div > div.grid > div.stat-ver").querySelector(".v3-chip")

        sum += elo == null ? 0 : parseInt(elo.innerHTML)
      })

      let stat_list = el.querySelector(".stat-list")
      let elo_sum = document.createElement('span')
      if (sum >= 0) {
        elo_sum.className = "elo_sum value text-green"
        sum = "+" + sum
      } else elo_sum.className = "elo_sum value text-red"
      elo_sum.textContent = sum
      stat_list.querySelectorAll("span")[1].parentNode.insertBefore(elo_sum, stat_list.querySelectorAll("span")[1].nextSibling)
    })
  }
}