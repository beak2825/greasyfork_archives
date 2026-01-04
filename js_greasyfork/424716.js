// ==UserScript==
// @name         RR Mugger
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Notifies when Big RR Games Start
// @author       sher_khan[2578388]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/424716/RR%20Mugger.user.js
// @updateURL https://update.greasyfork.org/scripts/424716/RR%20Mugger.meta.js
// ==/UserScript==

const API_KEY = "";
const MIN_BET = 1000;
const ALERT_TIME_IN_SECONDS = 10;
const RR_Bot = "https://discord.com/api/webhooks/833936906391126016/A_E4FDnMGj8473_Yjqp8j01jywIkAlt5y8YU5gethpHtkppxvyJsdKvEWh-4WuDVMapa";

var audioPlayer = document.createElement('audio');
audioPlayer.src = 'https://www.torn.com/casino/russianRoulette/audio/bang.ogg';
var volume = 25;
audioPlayer.volume = volume/100;
audioPlayer.preload = 'auto';


function game_removed(id) {
    console.log(id);

  GM_xmlhttpRequest ( {
                method:     'GET',
                url:        'https://api.torn.com/user/'+id.split("=")[1]+'?selections=basic&key='+API_KEY,
                onload:     function (responseDetails) {
                    let responseText = responseDetails.responseText;
                  //  console.log(responseText);
                    let user = JSON.parse(responseText);
                    alert_max(user.name+" Started an RR match",id);
                    setTimeout(function() {
  GM_xmlhttpRequest ( {
                method:     'GET',
                url:        'https://api.torn.com/user/'+id.split("=")[1]+'?selections=basic&key='+API_KEY,
                onload:     function (responseDetails) {
                    let responseText = responseDetails.responseText;
                //    console.log(responseText);
                    let user = JSON.parse(responseText);
                    alert_max(user.name+" Finshied RR match and is "+user.status.description,id);
                    }
            });
                    },ALERT_TIME_IN_SECONDS*1000);
                }
            });

}




function alert_max(message,id) {
//audioPlayer.play();
     GM_xmlhttpRequest({
               method: "POST",
                 url: RR_Bot,
                 data: JSON.stringify({
                      "username" : "RR Bot",
                      "embeds": [{"title":"RR Game Update",
                                   "url": id,
                                   "description": "<@&835442976590397450>"+message
                                                   }]}),
                  headers: {
                      "Content-Type": "application/json"
                  },
                  onload: function (e) {
                      //alert(e.responseText);
                  },
                  onerror: function (e) {
                      //alert(e);
                  }
              });


}


function afterRRLoaded () {

    var joinSel = document.getElementsByClassName("joinWrap___vNCIw");

  //  console.log(joinSel);
    var joinWrap = joinSel[0];
  //  console.log(joinWrap);
    var joinBox = "";
    for (var i = 0; i < joinWrap.children.length; i++) {
        if(joinWrap.children[i].className == "cont-gray bottom-round") { joinBox = joinWrap.children[i] };
    }

    const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
           mutation.removedNodes.forEach(function(node) {

               if(node.className.includes("row___30MWo")) {

                   var bet_amount = parseInt(node.firstChild.children[2].attributes["aria-label"].value.split(" ")[2]);
                   if (bet_amount>MIN_BET) {
                  game_removed(node.firstChild.firstChild.firstChild.children[2].firstChild.href);
                   }
               }
           });
        }
        else if (mutation.type === 'attributes') {
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(joinBox, config);


}

function isRRLoaded () {
    var joinWrap = document.getElementsByClassName("joinWrap___vNCIw")[0];
    if(joinWrap) {
        console.log(" RR Loaded");
        afterRRLoaded();
    } else {
        console.log("Not Yet");
            setTimeout(isRRLoaded,3000);
    };

}

(function() {
    'use strict';
         isRRLoaded();

})();