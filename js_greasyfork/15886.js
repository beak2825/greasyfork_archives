// ==UserScript==
// @name        SpeedHandicaps
// @namespace   HPrivakosScripts
// @description Show handicaps on FarmSatoshi and SpeedTraining
// @include     *://farmsatoshi.com/account/*
// @include     *://speedtraining.ddns.net/runrace/
// @version     1.01
// @grant       none
// @author      HPrivakos
// @downloadURL https://update.greasyfork.org/scripts/15886/SpeedHandicaps.user.js
// @updateURL https://update.greasyfork.org/scripts/15886/SpeedHandicaps.meta.js
// ==/UserScript==


document.getElementsByTagName('head')[0].innerHTML += ' \
<style> \
.place.dispo .coeur { \
background-size: 16px 16px \
} \
</style>'


var price = document.getElementById('bul01');

ChangeTitle();

function ChangeTitle(){
  var handicaps = price.value / 10000 - 10;
  if(document.domain == "speedtraining.ddns.net"){
    document.title = handicaps + " handicaps - SpeedTraining";
    setTimeout(function(){ ChangeTitle(); }, 5000); //Refresh title every 5 seconds if Speedtraining
  }
  else{
    document.title = handicaps + " handicaps - FarmSatoshi";
  }
}