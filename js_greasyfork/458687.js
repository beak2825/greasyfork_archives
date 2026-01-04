// ==UserScript==
// @name         AutoScav
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       NotweR
// @match        https://*.divokekmeny.cz/game.php?village=*&screen=place&mode=scavenge_mass
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divokekmeny.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458687/AutoScav.user.js
// @updateURL https://update.greasyfork.org/scripts/458687/AutoScav.meta.js
// ==/UserScript==

const DelayInMinutes = 10;
var delay = DelayInMinutes * 60000;
delay += getRandomInt(20000) + 10000;

(function() {
    $("#scavenge_mass_screen").append( "<p id=\"updateTime\"> Next Update: </p>" );
    Scav();
    setInterval(reload,delay);
})();

function Scav(){
    var premiumBtnEnabled=false;
    $.getScript('https://shinko-to-kuma.com/scripts/massScavenge.js');
    setTimeout(function(){
    var time_off = $(".runTime_off").val();
    var time_def = $(".runTime_def").val();
    var date = new Date(Date.now() + delay);
    $("#updateTime").text(date.toString());
    $("#sendMass").click();
        setTimeout(function(){
        $("#sendMass").each(function(){
          this.click();
        })
        },1000);
    }, 1000);
    console.log(delay);
}

function reload()
{
window.location.reload();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
