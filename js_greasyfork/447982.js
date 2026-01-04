// ==UserScript==
// @name         Grundos.cafe - Snowager Tracker
// @namespace    https://greasyfork.org/users/748951
// @version      v2.0.4
// @description  pops up a notification when snowy is asleep
// @author       dani (Mousekat), ben (mushroom)
// @include      grundos.cafe*
// @include      https://www.grundos.cafe*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447982/Grundoscafe%20-%20Snowager%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/447982/Grundoscafe%20-%20Snowager%20Tracker.meta.js
// ==/UserScript==

//Storage Location
var storage;
localStorage.getItem("SWlogger==") != null ? storage = JSON.parse(localStorage.getItem("SWlogger==")) :
storage = {current_time: "N/A", sw_time: "N/A", ww_time: "N/A" };

var page_html = document.body.innerHTML;

//date checks

  // page reload
    if (page_html.indexOf("Welcome") !== -1){
        console.log("Welcome");
        storage.current_time = Date.now();
        console.log("Last reload " + storage.current_time);
        localStorage.setItem("SWlogger==", JSON.stringify(storage));
    }

    //snowy
    if (page_html.indexOf("The Snowager") !== -1){
        console.log("The Snowager");
        storage.sw_time = Date.now();
        console.log("Last sw " + storage.sw_time);
        localStorage.setItem("SWlogger==", JSON.stringify(storage));
    }
 

//Sidebar Check
    if (document.getElementsByName("a").length > 0) {


//Container - Snowy
        var swContainer = document.createElement("div");
        swContainer.id = "swContainer";
        document.body.appendChild(swContainer);
        swContainer.innerHTML = "<a href='https://www.grundos.cafe/winter/snowager/' style='font-size: 10px; font-weight:100;color:blue'><img src='https://i.imgur.com/k0Jt7xP.gif' width=50></a>";
        swContainer.style = "position:absolute;left:893;top:46;background:#ffffff;padding:-10px;text-align:center;";


    }
//START checkTime------------------------------------------------------------------------------------------------------------------------------------------------------
function checkTime() {
//-7 during DST
   var timeInt = storage.int_time; // last page reset<br>var "
   var inth = timeInt / (1000 * 60 * 60)
   var intnpc = inth - 8
   var int = Math.floor(intnpc / 24)
   var inttime = int


   var timeSw = storage.sw_time; // last page reset<br>var "
   var swh = timeSw / (1000 * 60 * 60)
   var swnpc = swh - 8
   var swtime = Math.floor(swnpc)


   var epochms = storage.current_time; // last page reset<br>var "
   var epochh = epochms / (1000 * 60 * 60)
   var epochnst = epochh - 8
   var epochd = Math.floor(epochnst / 24)
   var epochtime= epochd

   var epochs = Math.floor(epochnst)

   var d = new Date();
   var snow = d.getUTCHours();

//--------      END OF SECTION
   //snowy (5/21/13 during DST - 6/22/14 outside of DST)
        if (swtime == epochs) {
        swContainer.innerHTML = "";
        swContainer.style = "";
    }

      else if(snow == 5){
        swContainer.innerHTML = "<a href='https://www.grundos.cafe/winter/snowager/' style='font-size: 10px; font-weight:100;color:blue'><img src='https://i.imgur.com/k0Jt7xP.gif' width=50></a>";
        swContainer.style = "position:absolute;left:143;top:46;background:#ffffff;padding:-10px;text-align:center;";
      }

     else if(snow == 21){
        swContainer.innerHTML = "<a href='https://www.grundos.cafe/winter/snowager/' style='font-size: 10px; font-weight:100;color:blue'><img src='https://i.imgur.com/k0Jt7xP.gif' width=50></a>";
        swContainer.style = "position:absolute;left:143;top:46;background:#ffffff;padding:-10px;text-align:center;";
      }

     else if(snow == 13){
        swContainer.innerHTML = "<a href='https://www.grundos.cafe/winter/snowager/' style='font-size: 10px; font-weight:100;color:blue'><img src='https://i.imgur.com/k0Jt7xP.gif' width=50></a>";
        swContainer.style = "position:absolute;left:143;top:46;background:#ffffff;padding:-10px;text-align:center;";
      }

    else {
        swContainer.innerHTML = "";
        swContainer.style = "";
    }


}


//code footer

(function(){
    "use strict";

    //first check
    checkTime()

    //refresh every 5 seconds
    setInterval(checkTime, 5000);

})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();