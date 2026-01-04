// ==UserScript==
// @name         Bookie odds check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check odds on bookie for possible round bet
// @author       Jox
// @match        https://www.torn.com/bookie.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367991/Bookie%20odds%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/367991/Bookie%20odds%20check.meta.js
// ==/UserScript==



function displayMsg(text){
    //alert(text);

    var messageContainer = document.getElementsByClassName('info-msg-cont');

    var divMsg = document.createElement('div');
    divMsg.classList.add('info-msg', 'border-round');
    divMsg.innerHTML = '<i class="info-icon"></i><div class="delimiter"><div class="msg right-round">' + text + '</div></div>';

    messageContainer[0].appendChild(divMsg);
}

$(document).ajaxComplete(function(e,xhr,settings){

    var factionRegex = /^.*bookie\.php\?rfcv=(\d+).*$/;
    var sentData = (settings.data != undefined ? settings.data.split("&") : "");
    if (factionRegex.test(settings.url)) {
        if(sentData[0] == "step=view"){
            var response = xhr.responseText;
            //console.log(response);

            var div = document.createElement('div');
            div.innerHTML = response;

            var multiplyerElements = div.getElementsByClassName('multiplier');

            var parsingError = false;

            var multiplayers = []; //reseting multiplares array

            for(var i = 0; i < multiplyerElements.length; i++){
                //skip header row
                if(multiplyerElements[i].innerText != 'Multiplier'){
                    //console.log(multiplyerElements[i].innerText.replace('Multiplier:','').trim());
                    var multiplayer = Number(multiplyerElements[i].innerText.replace('Multiplier:','').trim());

                    if(isNaN(multiplayer)){
                        console.error('error parsing data');
                        parsingError = true;
                    }
                    else{
                        multiplayers.push(multiplayer);
                    }
                }
            }

            if(!parsingError){
                multiplayers.sort();

                var lowest = multiplayers[0];
                var sum = 0;

                for(var i = 1; i < multiplayers.length; i++){
                    sum += lowest / multiplayers[i];
                }

                displayMsg(lowest - 1 - sum);
            }
            else{
                displayMsg('have parsing errors');
            }
        }
    }

});