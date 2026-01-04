// ==UserScript==
// @name     League Of Legends - LeagueOfGraphs.com - Get information of best players
// @version  8
// @grant    none
// @license MIT
// @match https://www.leagueofgraphs.com/rankings/summoners/*
// @description When you check the best players for a specific champion and click on their name you will redirected to their profile. With this extension you jump to their champion builds, which is often the reason you clicked on the player in the first place.
// @namespace https://greasyfork.org/users/858161
// @downloadURL https://update.greasyfork.org/scripts/448808/League%20Of%20Legends%20-%20LeagueOfGraphscom%20-%20Get%20information%20of%20best%20players.user.js
// @updateURL https://update.greasyfork.org/scripts/448808/League%20Of%20Legends%20-%20LeagueOfGraphscom%20-%20Get%20information%20of%20best%20players.meta.js
// ==/UserScript==
(()=>{
      var loc = window.location.toString().split("/").filter(cur => !cur.startsWith("page-") && !cur.startsWith("by-")); 
  var positionOfChamp = 5;
      var champ = loc[positionOfChamp]; 
      [...new Set(document.getElementById("mainContent").getElementsByTagName("a"))]
  								.filter(current => current.href.includes("/summoner/"))
  							  .forEach((current, idx) => {
                      var split = current.href.split("/");
      
                      current.href = `/${split[3]}/champions/${champ}/${split[4]}/${split[5]}`;
                      idx % 2 === 0 ? current.innerHTML += '<div style="color:red;font-size:20px;position: absolute;top: 0;right: 0;"; title="THIS LINK WAS CHANGED BY SCRIPT TO GO DIRECTLY TO CHAMPION OVERVIEW">*</div>' : null;
                  });
})();