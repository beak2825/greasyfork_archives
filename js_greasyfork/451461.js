// ==UserScript==
// @name        Steam工坊操作调整
// @namespace   1e873e3b-62d4-49da-9ccf-74be3b7df85c
// @match       *://*steamcommunity.com/app/*/workshop/
// @match       *://*steamcommunity.com/sharedfiles/filedetails/?id=*
// @grant       none
// @version     1.3
// @author      朋也
// @license     AGPL
// @description 9/16/2022, 2:39:41 PM
// @downloadURL https://update.greasyfork.org/scripts/451461/Steam%E5%B7%A5%E5%9D%8A%E6%93%8D%E4%BD%9C%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/451461/Steam%E5%B7%A5%E5%9D%8A%E6%93%8D%E4%BD%9C%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function(){
  let current_player_workshop_link = document.querySelector(".current_player_workshop_link a");
  if (current_player_workshop_link) {
    let astr = current_player_workshop_link.getAttribute("data-dropdown-html");
    
    document.querySelector(".current_player_workshop_link").innerHTML = astr;
    current_player_workshop_link.style.display = "none";
    
    let head = document.querySelector("head");
    let styledom = document.createElement("style");
    styledom.innerHTML = ".current_player_workshop_link a{display:block;margin-top:5px;}";
    head.appendChild(styledom);
  }
  
  let sectionTabs_states = document.querySelector(".sectionTabs>.stats");
  if (sectionTabs_states) {
    let state_href = sectionTabs_states.getAttribute("href");
    console.log(state_href);
    
    fetch(state_href)
      .then(resp => resp.text())
      .then(data => {
        let divdom = document.createElement("div");
        divdom.innerHTML = data;
        let trs = divdom.querySelectorAll("table:first-child tr");
        let totalscore = trs[trs.length-3].querySelector("td:last-child").innerHTML;
        let upscoredom = trs[trs.length-2].querySelector("td:last-child");
        let downscoredom = trs[trs.length-1].querySelector("td:last-child");
        upscoredom.querySelector("span").remove();
        downscoredom.querySelector("span").remove();
        let upscore = upscoredom.innerText.trim();
        let downscore = downscoredom.innerText.trim();
        let subscribecount = document.querySelectorAll(".stats_table tr")[1].querySelector("td:first-child").innerText.trim().replaceAll(",", "");
        
        let numRatingsdom = document.querySelector(".numRatings");
        if (numRatingsdom) {
          numRatingsdom.innerText += ` (${upscore}/${downscore}/${totalscore}/${subscribecount})`;
        } else {
          let ratingSectiondom = document.querySelector(".ratingSection");
          if (ratingSectiondom) {
            ratingSectiondom.innerHTML += ` (${upscore}/${downscore}/${totalscore}/${subscribecount})`;
          }
        }
        
        
      })
  }
})();