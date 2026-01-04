// ==UserScript==
// @name     CS170 Leaderboard data download
// @description download leaderboard data
// @version  1
// @match             *://berkeley-cs170.github.io/project-leaderboard/*
// @grant none
// @namespace https://greasyfork.org/users/248188
// @downloadURL https://update.greasyfork.org/scripts/402559/CS170%20Leaderboard%20data%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/402559/CS170%20Leaderboard%20data%20download.meta.js
// ==/UserScript==


    let button = document.createElement("a");
  document.getElementById("navbarSupportedContent").appendChild(button);
   button.className = "btn btn-outline-success my-2 my-sm-0";
   button.addEventListener("click", ()=>{
     button.style = "display:none;"
   let download = async () => {
     console.log("requested");
  
   
   let data = await unsafeWindow.pullFullLeaderboard(unsafeWindow.firebase); 
   let dataStr = JSON.stringify(data);
   
   let blob = new Blob([dataStr], {type : 'application/json'})
   let url = URL.createObjectURL(blob);
    let button = document.createElement("a");
     console.log("got");
  document.getElementById("navbarSupportedContent").appendChild(button);
   button.className = "btn btn-outline-success my-2 my-sm-0";
   button.setAttribute("href",     url     );
   button.setAttribute("download", "rank.json");   
   button.innerHTML = "Get JSON";

  
} 
   download();
   
   
   });  
   button.innerHTML = "Request Download";


