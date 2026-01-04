// ==UserScript==
// @name         MH - Sky Palace Slot Machine Tracker
// @version      1.2
// @description  Tracks Sky Palace Rolls
// @author       Chromatical
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @connect      self
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @namespace    https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/430939/MH%20-%20Sky%20Palace%20Slot%20Machine%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/430939/MH%20-%20Sky%20Palace%20Slot%20Machine%20Tracker.meta.js
// ==/UserScript==

var debug = localStorage.getItem("Chro.sproll.debug") == 1? true : false;

$(document).ajaxComplete(function(event, jqxhr, settings){
    var form = settings.data
    success:{
        if (form.includes("reroll_sky_palace")){
            checkname();
            parse(jqxhr.responseText);
        }
    }
})

function checkname(){
    var randomName = localStorage.getItem("chro-sp-track");
    if (randomName){
        return;
    } else {
        randomName = makeid(6);
        localStorage.setItem("chro-sp-track",randomName);
    }
}

function parse(data){
    var response = JSON.parse(data);
    if (response.success == 1){
        var board = response.adventure_board.sky_palace.island_mod_wheels;
        var locked = Object.values(board.locked);
        var values = Object.values(board.values);
        var powerType = response.adventure_board.sky_palace.power_type.value;
        var powerLock = response.adventure_board.sky_palace.power_type.is_locked;
        var oculus = response.user.quests.QuestFloatingIslands.airship.oculus_level;
        var randomName = localStorage.getItem("chro-sp-track");
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbx253Ma8UhqOgZi6DhkZQL1XVzAkn1abwhFPG72g9nuqzUN4YVA558w8WraKtGaGPrwbA/exec';
               if (webAppUrl){
                   GM_xmlhttpRequest({
                       method: "POST",
                       url: webAppUrl,
                       data: JSON.stringify({
                           name : randomName,
                           oculus : oculus,
                           locked : locked,
                           values : values,
                           powertype : powerType,
                           powerlock : powerLock
                       }),
                       onload: function(response){
                           var div = document.createElement("div");
                           div.id = "sproll";
                           div.style.position = "fixed";
                           div.innerText = "Roll Data Submitted";
                           div.style.top = "10vh";
                           div.style.left = "35vw";
                           div.style.width = "140px";
                           div.style.height = "15px";
                           div.style.fontWeight = "bold";
                           div.style.backgroundColor = "lightgreen";
                           div.style.textAlign = "center";
                           div.style.padding = "13px 0";
                           div.style.border = "1px solid";
                           div.style.borderRadius = "10px";
                           div.style.zIndex = "9999";
                           document.body.appendChild(div);
                           $(div).fadeOut("slow");
                           if (debug) console.log("Sky Palace Rolls Data Submitted")
                       },
                       onerror: function(response){
                           if (debug) console.log("Sky Palace Rolls Data Submission Failed")
                       }
                   })
               }
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}