// ==UserScript==
// @name         Starve.io Show Servers
// @namespace    https://greasyfork.org/ja/users/320131-heart-starve
// @version      0.1.8
// @description  Show servers while playing
// @author       heart_starve#9771
// @match        https://starve.io/
// @downloadURL https://update.greasyfork.org/scripts/387919/Starveio%20Show%20Servers.user.js
// @updateURL https://update.greasyfork.org/scripts/387919/Starveio%20Show%20Servers.meta.js
// ==/UserScript==

var servername = document.createElement('div');
   document.getElementById('ad_content_market').appendChild(servername);

function servercheck(){
   var server = document.getElementsByClassName('ng-binding');
   if(servername.innerHTML != server[0].innerHTML){
      servername.innerHTML = server[0].innerHTML;
   }
}
setInterval(servercheck,1000);