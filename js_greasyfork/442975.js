// ==UserScript==
// @name        PTP freeleech highlight & Button
// @description highlights freeleech torrents and add a button to list them
// @match       https://passthepopcorn.me/*
// @version     1.2.1
// @run-at      document-idle
// @license	    GPL3
// @author      SH3LL
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/442975/PTP%20freeleech%20highlight%20%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/442975/PTP%20freeleech%20highlight%20%20Button.meta.js
// ==/UserScript==

function main(){
  // add button
  let top_menu = document.getElementsByClassName("main-menu__list");
  let li = document.createElement("li"); li.className="main-menu__item";
  let a = document.createElement("a"); a.href="https://passthepopcorn.me/torrents.php?action=advanced&freetorrent=1"; a.innerText="FL"; a.style.color="yellow";
  li.append(a); top_menu[0].append(li);
  
  
  // color lines
  if(window.location.href.includes("https://passthepopcorn.me/torrents.php?id")){
    
    let rows = document.getElementsByClassName("group_torrent group_torrent_header")
    for(let row of rows){
      if(row.innerText.includes("Freeleech")) {row.children[0].children[2].style.color = "yellow";continue}
      if(row.innerText.includes("Neutral Leech")) {row.children[0].children[2].style.color = "cyan";continue}
    }
    
  }else{
    
    let rows = document.getElementsByClassName("basic-movie-list__torrent-row")
    for(let row of rows){
      if(row.innerText.includes("Freeleech") && row.innerText.includes("✿")) {row.children[0].children[1].children[1].style.color = "yellow"; continue;}
      if(row.innerText.includes("Freeleech")) {row.children[0].children[1].children[0].style.color = "yellow"; continue;}
      if(row.innerText.includes("Neutral Leech") && row.innerText.includes("✿")) {row.children[0].children[1].children[1].style.color = "cyan"; continue;}
      if(row.innerText.includes("Neutral Leech")) {row.children[0].children[1].children[0].style.color = "cyan"; continue;}
    }
  }
  
  return 0
}

main();