// ==UserScript==
// @name         Dudemaus's Bitsler Seed Changer
// @namespace    seedbotforbitslerbydudemaus
// @version      2018.0103a
// @description  This script will reset your bitlser seed automatically every 5 minutes.
// @author       Dudemaus
// @match        *://www.bitsler.com/play/dice/*
// @match        https://www.bitsler.com/play
// @match        https://www.bitsler.com/play/dice*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant		GM_xmlhttpRequest
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/28193/Dudemaus%27s%20Bitsler%20Seed%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/28193/Dudemaus%27s%20Bitsler%20Seed%20Changer.meta.js
// ==/UserScript==
//////JQuery Compatibility statement//////
this.$ = this.jQuery = jQuery.noConflict(true);
//////JQuery Compatibility statement//////

    //wait for the page to load.
  window.onload = function() {
document.getElementById('game-row').insertAdjacentHTML('beforebegin',
    '<br><div id="dicebot-container" class="tab-content tab-content-xs" style="border-style: solid;width: 625px;border-color: #D1D1D1;border-radius: 4px;border-style: solid;border-width: 1px; padding-bottom: 9px;padding-left: 9px;padding-right: 9px; margin-left: 118px; padding-top: 9px;display:block"><center><div><img src="http://i.imgur.com/NZnZW6G.png" /><div id="tipDude" style="Display:inline-block;">Tip Dude</div></center><font color="red"><b>If you like this seed changer please donate to any of these addresses or tip dudemaus:</b></font><font size="1"><br><b>Ethereum:</b> 0xfe460f08c4eaf98a234b2f1230f86971012a70a1<br><b>Bitcoin:</b> 1AtKgtemWiT93h4YGBXF9WKvaEpkQaKmmr<br><b>Doge:</b> DG4hZEVGBt6kws6dFZ2eCBh4HQAsVrvpbH<br><b>Litecoin:</b> LZEL3oEWEM1vsonfTjz11Vvw37zjDd2EQA<br><b>Burst: </b>BURST-HU3D-67VZ-L4X4-HW6PF</font></div></div></div>');
  
      
//change seeds every 5 mins
setInterval(function(){ change_seeds(); }, 301000);
      
            
document.getElementById('tipDude').addEventListener("click", function() {     
    document.getElementById('message').innerText = "/tip Dudemaus";
    document.getElementById('message').focus();
    add_message();});$(document).keypress(function(e){if((e.which==13)&&($("#message").is(":focus"))){add_message();
}
});  

 
  };