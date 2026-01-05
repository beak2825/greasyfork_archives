// ==UserScript==
// @name           Littlewargames running room hider
// @description    Hides full rooms from the game list
// @include        http://littlewargame.com/play/
// @version        0.3
// @namespace https://greasyfork.org/users/3341
// @downloadURL https://update.greasyfork.org/scripts/3207/Littlewargames%20running%20room%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/3207/Littlewargames%20running%20room%20hider.meta.js
// ==/UserScript==

window.setInterval(function() 
 {
     var container = document.getElementById('gamesWindowTextArea');
     var allGames = container.getElementsByTagName('P');
     if(allGames.length>0){
         for (var i = 0; i < allGames.length; i++)
         {
             var text = allGames[i].innerHTML;
             if(text.indexOf("] running") > -1 ){
                   if(allGames[i].style.color != "rgb(173, 216, 230)"){
                       allGames[i].style.color="lightblue";
                      allGames[i].parentNode.appendChild(allGames[i]);
             	   }
             }
         }
     }
 },100);