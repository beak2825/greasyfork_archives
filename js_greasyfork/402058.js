// ==UserScript==
// @name         TORN: Call Your Hits
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Warns you when you are close to taking a bonus hit during a chain
// @author       Fuzzyketchup [2206068]
// @match        https://www.torn.com/loader.php?sid=attack&user*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/402058/TORN%3A%20Call%20Your%20Hits.user.js
// @updateURL https://update.greasyfork.org/scripts/402058/TORN%3A%20Call%20Your%20Hits.meta.js
// ==/UserScript==

//debug varibles
var debug = false; //when true enables debugging output to console
var cValue = 9999;
var customValue = false; //when true uses cValue for current chain instead of the value returned from Torn's API

//First time setup, check for API key
var key = GM_getValue("tornApiKey");
if(key == null || key == ""){
    var apiPrompt = prompt("Call Your Hits | First Time Setup | Please enter your API Key (located on the preferences page under API Key.)");
    GM_setValue("tornApiKey", apiPrompt); //Saves API Key
}

//First time setup, checks for variance (variance is the number of hits that are to be called out by your faction)
var variance = GM_getValue("varianceValue");
if(variance == null || variance == ""){
    GM_setValue("varianceValue", 5); //Saves variance
    variance = 5;
}

//Add UI Elements
//Css variables
var variantCss = "#variance{width:30px; margin: 5px; padding: 2px; border: 2px solid #555;}";
var cyhCss = ".cyhCss{-webkit-box-direction: normal; height: 24px; padding: 0 10px; font-size: 14px; font-weight: 700; text-shadow: 0 1px 0 hsla(0,0%,100%,.4); border-radius: 3px; border: none; cursor: pointer; white-space: nowrap; margin: 8px 0; width: 120px; text-transform: uppercase; user-select: none; color: #333; background-image: linear-gradient(#d7d7d7,#767676 78%,#767676 82%,#888); box-shadow: inset 2px 0 3px hsla(0,0%,96.9%,.3),inset -2px 0 3px hsla(0,0%,96.9%,.3);}";

//Create callYourHitsDiv div
$('.titleContainer___3FbI9').append('<div id="callYourHitsDiv">');


//Create CSS Styles
$('#callYourHitsDiv').append('<style>'+variantCss+'</style>'); //apply css for id variance
$('#callYourHitsDiv').append('<style>'+cyhCss+'</style>'); //apply css for class cyhCss

//Create chainChecker div
$('.titleContainer___3FbI9').append('<div id="chainChecker">');

//Create UI Elements
$('#chainChecker').append('Number of called hits: <input type="number" id="variance" min=0 value='+variance+'>'); //input for number of hits to warn the player about
$('#chainChecker').append('<input type="button" value="Save" class="cyhCss" id="saveBtn"/> '); //Save Settings Button
$('#chainChecker').append('<input type="button" value="Reset API Key" class="cyhCss" id="resetKeyBtn">'); //Reset API Key Button

//Close divs
$('.titleContainer___3FbI9').append('</div>'); //close chainChecker div
$('.titleContainer___3FbI9').append('</div>'); //close callYourHitsDiv div


//Save UI Button
$('#saveBtn').click(function(){
    var vv = $('#variance').val();
    GM_setValue("varianceValue", vv);
    alert("Settings Saved");
    location.reload(); //Reloads the page
});

//Reset API Key Button
$('#resetKeyBtn').click(function(){
    GM_setValue("tornApiKey", null);
    alert("API key reset");
    location.reload(); //Reloads the page
});

//Checks the current chain count and warns the user if they are going to take a hit they should call
function checkChain(key){
    var bonusHits = [ 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000 ]; //Array of bonus hits
    var bonusHitStrings = [ "10", "25", "50", "100", "250", "500", "1K", "2.5K", "5K", "10K", "25K", "50K", "100K" ]; //Array of bonus hit output strings
    var chainJsonURL = "https://api.torn.com/faction/?selections=chain&key=" + key; //URL for Torn's faction chaining API

    //Declare local variables
    var value = 0;
    var arrValue = null;
    var chainBool = true;
    var hitNumber = 0;

    //Get json data from Torn API
    $.getJSON(chainJsonURL, function(json){
        try{
            value = json.chain.current; //Current chain count
        } catch (err) {
            alert("Call Your Hits | There has been an error while fetching your chain data. Try resetting your API Key.");
            console.log("err | " + err);
        }

        if(debug) {
            if(customValue){ //when true uses cValue for current chain
                value = cValue;
            }
            console.log("Value from json | " + value);
        }

        //vv = value + variance
        var vv = value + parseInt(variance);

        for(var i = 0; i < bonusHits.length; i++){ //Begin for loop through bonusHits
            if(value < bonusHits[i]){ //filters values that are greater than current chain value
                if(vv >= bonusHits[i]) { //checks that our value and variance on that value is not >= the bonus hit
                    chainBool = false; //when false tells script to display warnings
                    arrValue = i; //used in display warnings
                    hitNumber = bonusHits[i]; //used in display warnings


                    if(debug){
                        console.log("Should not chain");
                        console.log("value | " + value);
                        console.log("variance | " + variance);
                        console.log("vv | " + vv);
                        console.log("bonusHits["+i+"] | " + bonusHits[i]);
                    }


                } else { //our value is currently greater than or equal to bonusHits[i] //currently no function besides debug logs
                    if(debug){
                        console.log("Chain OK");
                        console.log("value | " + value);
                        console.log("variance | " + variance);
                        console.log("vv | " + vv);
                        console.log("bonusHits["+i+"] | " + bonusHits[i]);
                    }
                }
            }
        }

        if(!chainBool){ //Display warnings if bonus hit is close
            var chainData = (hitNumber - value);

            //Grammar
            var hits = " HITS";
            if(chainData == 1) {
                hits = " HIT" ;
            }
            var warn = "WARNING, YOU ARE " + chainData + hits + " AWAY FROM THE " + bonusHitStrings[arrValue] + " BONUS HIT.";
            $(".dialogButtons___3xN5A").append('</br>' + warn);
            alert(warn);
        }
    });
}

//Wait for the page to finished loading then run checkChain()
$(window).load(function(){
    var key = GM_getValue("tornApiKey");
    checkChain(key);
});
