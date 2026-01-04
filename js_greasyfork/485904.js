// ==UserScript==
// @name         Shikimori: Rating Bar Upgrade
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a new rating bar based on site-specific votes
// @author       rostikowb
// @license      MIT
// @match        https://shikimori.org/animes/*
// @match        https://shikimori.one/animes/*
// @match        https://shikimori.me/animes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @grant        none
// @run-at       document-end
// @supportURL   https://github.com/ваш_репозиторій/issues
// @downloadURL https://update.greasyfork.org/scripts/485904/Shikimori%3A%20Rating%20Bar%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/485904/Shikimori%3A%20Rating%20Bar%20Upgrade.meta.js
// ==/UserScript==


class ShikimoriRate{
  #overallRating = 0;
  #voteSum = 0;

  constructor() {
    const observer = new MutationObserver(() => {
      const ratesScoresStats = document.querySelector("#rates_scores_stats");
      if (ratesScoresStats) {
        observer.disconnect();
        if (document.querySelector(".newBarFromRostikowb")) return;
        this.#overallRating = this.#countRating();
        this.#changeNativeBar();
        this.#setNewRateBar();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  #setNewRateBar(){
    const html = `<div class="scores newBarFromRostikowb"><meta content="10" itemprop="bestRating"><meta content="${this.#overallRating}" itemprop="ratingValue"><meta content="${this.#voteSum}" itemprop="ratingCount"><div class="b-rate"><div class="stars-container"><div class="hoverable-trigger"></div><div class="stars score score-${Math.round(this.#overallRating)}"></div><div class="stars hover"></div><div class="stars background"></div></div><div class="text-score"><div class="score-value score-${Math.round(this.#overallRating)}">${this.#overallRating}</div><div class="score-notice">${this.#voteSum} - shiki votes</div></div></div></div>`
    const rateParent = document.querySelector('[itemprop="aggregateRating"]');
    const newRateBar = document.createElement("div");
    newRateBar.innerHTML = html
    rateParent.appendChild(newRateBar)
  }

  #countRating(){
    const scoreArr = JSON.parse(document.querySelector("#rates_scores_stats").getAttribute("data-stats"))

    let rateSum = 0;
    let voteSum = 0;
    for(let oneLine of scoreArr){
      const rate = oneLine[0];
      const voteCount = oneLine[1];

      rateSum += (Number(rate) * Number(voteCount));
      voteSum += Number(voteCount);
    }
    this.#voteSum = voteSum;
    return (rateSum/voteSum).toFixed(2);
  }

  #changeNativeBar(){
    const barElem = document.querySelector(".scores");
    const ratingCount = barElem.querySelector('[itemprop="ratingCount"]').content;
    barElem.querySelector(".score-notice").innerText = `${ratingCount} - MAL votes`
  }

}

function onload(fn) {
  document.addEventListener('page:load', fn);
  document.addEventListener('turbolinks:load', fn);

  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
onload(()=>new ShikimoriRate())

