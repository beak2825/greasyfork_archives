// ==UserScript==
// @name         Gats.io PRO V1.0.0
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Gats.io pro GUI & auto upgrade for pro!
// @author       NitroVesper
// @match        https://gats.io/
// @match        http://gats.io/
// @match        http://gats.io/index.html/
// @match        http://www.gats.io/
// @match        www.gats.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429960/Gatsio%20PRO%20V100.user.js
// @updateURL https://update.greasyfork.org/scripts/429960/Gatsio%20PRO%20V100.meta.js
// ==/UserScript==

 /*
Copyright NitroVesper 2021
Liscensed under the Apache 2.0 Liscence.
All rights reserved.
*/
 
(function() { setInterval(() => {
document.title = "Gats.io Pro V1.0.0";
document.getElementById("playButton").style.backgroundColor = "red";
document.getElementById("playButton").style.color = "white";
document.getElementById("playButton").innerHTML = "Deploy";
document.getElementById("playButton").style.borderRadius = "15px";
document.getElementById("playButton").style.borderColor = "black";
document.getElementById("pistol").style.borderRadius = "7px";
document.getElementById("pistol").style.backgroundColor = "red";
document.getElementById("smg").style.borderRadius = "7px";
document.getElementById("smg").style.backgroundColor = "red";
document.getElementById("shotgun").style.borderRadius = "7px";
document.getElementById("shotgun").style.backgroundColor = "red";
document.getElementById("assault").style.borderRadius = "7px";
document.getElementById("assault").style.backgroundColor = "red";
document.getElementById("sniper").style.borderRadius = "7px";
document.getElementById("sniper").style.backgroundColor = "red";
document.getElementById("lmg").style.borderRadius = "7px";
document.getElementById("lmg").style.backgroundColor = "red";
document.getElementById("slct").style.backgroundColor = "orange";
document.getElementById("slct").style.borderRadius = "25px";
document.getElementById("gametypeDropdown").style.borderRadius ="10px";
document.getElementById("serversBtn").style.borderRadius ="10px";
document.getElementById("red").style.borderRadius ="100px";
document.getElementById("orange").style.borderRadius ="100px";
document.getElementById("yellow").style.borderRadius ="100px";
document.getElementById("green").style.borderRadius ="100px";
document.getElementById("blue").style.borderRadius ="100px";
document.getElementById("purple").style.borderRadius ="100px";
document.getElementById("noArmor").style.borderRadius = "4px";
document.getElementById("lightArmor").style.borderRadius = "4px";
document.getElementById("mediumArmor").style.borderRadius = "4px";
document.getElementById("heavyArmor").style.borderRadius = "4px";
document.getElementById("armorBacking").style.borderRadius = "10px";
document.getElementById("colorBacking").style.borderRadius = "10px";
document.getElementById("weaponBacking").style.borderRadius = "10px";
document.getElementById("armorTitle").style.visibility = "hidden";
document.getElementById("colorTitle").style.visibility = "hidden";
document.getElementById("weaponTitle").style.visibility = "hidden";
document.getElementById("announcementMessage").innerHTML = "Custom servers now have even more settings! Host with hot girls, stats.gats.io/login";
document.getElementById("gameadsbannerpic").innerHTML = "add deleted (beta)";
document.getElementById("highScoresHeading").innerHTML = "Top hot girls today";
document.getElementById("infoFooter").style.borderRadius = "5px";
document.getElementById("loginButton").style.borderRadius = "20px";
document.getElementById("registerButton").style.borderRadius = "20px";
}, 1000);
})(); 

// Every second an action is performed that automatically upgrades your slot 1, 2, 3
setInterval(() => { RF.list[0].socket.send('u,10,1'); }, 1000);
setInterval(() => { RF.list[0].socket.send('u,7,2');  }, 1001);
setInterval(() => { RF.list[0].socket.send('u,8,3');  }, 1002);

(function() { // chatbox
  document.getElementById("chatbox").style.borderRadius = "25px";
  document.getElementById("chatbox").style.backgroundColor = "red";
  document.getElementById("chatbox").style.borderColor = "black";
  document.getElementById("chatbox").style.color = "whit";
})();