// ==UserScript==
// @name        Load 720p magent links. - horriblesubs.info
// @namespace   Violentmonkey Scripts
// @match       https://horriblesubs.info/shows/*/
// @grant       none
// @version     1.1
// @author      Joshua Cline
// @description 12/15/2019, 11:16:20 AM
// @downloadURL https://update.greasyfork.org/scripts/393775/Load%20720p%20magent%20links%20-%20horriblesubsinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/393775/Load%20720p%20magent%20links%20-%20horriblesubsinfo.meta.js
// ==/UserScript==

function sleep(time){
  return new Promise(res => setTimeout(res, time));
}

async function loadFullAnime() {
  while(document.querySelector(".more-button")){
    document.querySelector(".more-button").click();
    await sleep(750);
  }
}

async function load720magnets(){
  await loadFullAnime()
  let links = document.querySelectorAll(".rls-link.link-720p .dl-type.hs-magnet-link a")
  for(let link of links){
    location.assign(link.href);
  }
}

window.loadFullAnime = loadFullAnime;
window.load720magnets = load720magnets;

document.querySelector(".episode-container h3").innerHTML += " - <span id='load720links'>Load All 720p Links</span>";
document.querySelector(".episode-container h3 #load720links").addEventListener("click", load720magnets);