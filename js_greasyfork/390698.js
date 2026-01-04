// ==UserScript==
// @name DART Mafia Collector
// @version 0.0
// @description This script counts mafia votes, messages to GM, and player read lists
// @author Perussi
// @match *://www.debateart.com/forum/topics/*
// @grant none
// @namespace https://greasyfork.org/users/128061
// @downloadURL https://update.greasyfork.org/scripts/390698/DART%20Mafia%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/390698/DART%20Mafia%20Collector.meta.js
// ==/UserScript==

function katelyn(){
  document.getElementsByClassName("forum-topic-show__forum-post__text")[0].children[0].innerHTML = "all good b0ss";
}

window.onload = function letThereBeLight(){
  if(window.location.href.substring(window.location.href.length-6,window.location.href.length) === "sendit"){
    katelyn();
  }
}