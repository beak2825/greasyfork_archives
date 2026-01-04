// ==UserScript==
// @name         Hellcase Free Daily Collector
// @match        https://hellcase.com/en/dailyfree
// @grant        none
// @version		   0.2
// @description	 This Script triggers the "Free Daily" button automatically
// @author       Katzenbiber
// @namespace https://greasyfork.org/users/554508
// @downloadURL https://update.greasyfork.org/scripts/402851/Hellcase%20Free%20Daily%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/402851/Hellcase%20Free%20Daily%20Collector.meta.js
// ==/UserScript==

(function() {
  Button = document.getElementById("btn_open_daily_free"); //get Button Element if available
  if (Button === null){ //check if available
    time = document.getElementsByClassName("hellcase-btn-success big disabled notavailable"); //get time out of button when not clickable
    time = time[0].innerText;
    time = time.split(" "); //splitting into array of words
    if (time[4] === undefined){ //if no [4] there are only minutes left
      hours = 0;
      minutes = parseInt(time[2]);
    }else{ //else hours and minutes
      hours = parseInt(time[2]);
      minutes = parseInt(time[4]);
    }
    wait_time = (hours*60+minutes+1)*60000; //wait time + 1 minute
    setTimeout(function () {window.location.reload();},wait_time); //reload page after wait time
    //alert("set timeout for " + hours + " hours and "+ minutes +" minutes");
  }else{
    if(Button){
      setTimeout(function () {Button.click();},10000); //click with 10s delay
      //alert("clicked");
    }
  }
})();