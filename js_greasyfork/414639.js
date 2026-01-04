// ==UserScript==
// @name         flashscore_add_on
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  red cards finder
// @author       botclimber
// @match        https://www.flashscore.pt/
// @match        https://www.flashscore.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414639/flashscore_add_on.user.js
// @updateURL https://update.greasyfork.org/scripts/414639/flashscore_add_on.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var trAudio = new Audio();
    trAudio.src = "/res/sound/_fs/ogg/common-cheers.ogg";

    document.getElementsByClassName("container__content content")[0].style.width = "1150px";
    var space = document.getElementById('rc-top');

    var found = '-';

    space.style.width = "400px";
    setInterval(function(){

        var foundAux = 0;
        var lGames = document.getElementsByClassName("event__match event__match--live event__match--oneLine");

        space.innerHTML = "<h2>Found: "+found+"</h2>";

        for (var i = 0; i < lGames.length; i++){

        var score = lGames[i].getElementsByClassName("event__scores")[0].textContent;
        var time = lGames[i].getElementsByClassName("event__stage--block")[0].textContent;

        var hTeam = lGames[i].getElementsByClassName("event__participant event__participant--home")[0];
        var aTeam = lGames[i].getElementsByClassName("event__participant event__participant--away")[0];

        var hCardTeam = hTeam.getElementsByClassName("card___2ip_DLm icon--redCard").length;
        var aCardTeam = aTeam.getElementsByClassName("card___2ip_DLm icon--redCard").length;

            if(hCardTeam > 0 || aCardTeam > 0){
                foundAux++;

                var newGame = localStorage.getItem(lGames[i].id);

                if(newGame == undefined){
                    trAudio.play();
                    localStorage.setItem(lGames[i].id, "Game nr: "+i);
                }

                hTeam = (hCardTeam > 0)? "<span style='color:orange;'>"+hTeam.textContent+"</span>" : hTeam.textContent ;
                aTeam = (aCardTeam > 0)? "<span style='color:orange;'>"+aTeam.textContent+"</span>" : aTeam.textContent ;

                if(hCardTeam > 0 && aCardTeam == 0){
                    space.innerHTML += "<a href='#"+lGames[i].id+"'><p style='padding:2px;font-size:10pt;'><font style='border-radius:10%;width:15px;height:10px;background-color:red;color:white;'><b>"+hCardTeam+"</b></font> "+hTeam+" "+score+" "+aTeam+" - '"+time+"</p></a>";

                }else if(hCardTeam == 0 && aCardTeam > 0){
                    space.innerHTML += "<a href='#"+lGames[i].id+"'><p style='padding:2px;font-size:10pt;'>"+hTeam+" "+score+" "+aTeam+" <font style='border-radius:10%;width:15px;height:10px;background-color:red;color:white;'><b>"+aCardTeam+"</b></font> - '"+time+"</p></a>";

                }else{
                    space.innerHTML += "<a href='#"+lGames[i].id+"'><p style='padding:2px;font-size:10pt;'><font style='border-radius:10%;width:15px;height:10px;background-color:red;color:white;'><b>"+hCardTeam+"</b></font> "+hTeam+" "+score+" "+aTeam+" <font style='border-radius:10%;width:10px;height:10px;background-color:red;color:white;'><b>"+aCardTeam+"</b></font> - '"+time+"</p></a>";
                }
            }
        }

        found = foundAux;

   }, 3000);

})();
