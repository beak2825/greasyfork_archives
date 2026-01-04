// ==UserScript==
// @name         CSGO500 Color Spoilor
// @namespace    http://tampermonkey.net/
// @version      1
// @description  (THIS DOES NOT GIVE YOU ANY FORM OF ADVANTAGES)
// @author       You
// @match        https://csgo500.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388108/CSGO500%20Color%20Spoilor.user.js
// @updateURL https://update.greasyfork.org/scripts/388108/CSGO500%20Color%20Spoilor.meta.js
// ==/UserScript==

//CSGO500 Color Spoilor
// By FutureG
// https://steamcommunity.com/id/FutureGamer13/
// Donate BUX to me <3 - 76561198286212803

//Supporting Functions
function countOccurences(array_raw, item){
	var occurences = 0
	for(var i = 0; i < array_raw.length; i++) {
	    if(array_raw[i] == item){
				occurences += 1
			}
	}
	return occurences
}
//Get key with highest value in dict
function dictMax(o){
    var vals = [];
    for(var i in o){
       vals.push(o[i]);
    }

    var max = Math.max.apply(null, vals);

     for(var i in o){
        if(o[i] == max){
            return i;
        }
    }
}

//Color list
var color_list = ["black","red","blue","gold"]

//Get raw node list
var node_list = $("#past-queue-wrapper").children()
var roll_history = []
node_list.each(function(){
	//Convert Nodes to Color String
	var style_text = $(this).attr("class")
	var color_int = Number(style_text.charAt(5))
	//Append to history list
	roll_history.push(color_list[color_int])
})

//Get current roll
function getRoll(){
	return color_list[winner.choice]
}


//==================================================================
//GUI
//================================================
	var color_codes = ["rgb(80, 80, 80)","rgb(200, 53, 78)","rgb(69, 181, 218)","rgb(219, 192, 127)"];
	var color_codes_dict = {"black":"rgb(80, 80, 80)","red":"rgb(200, 53, 78)","blue":"rgb(69, 181, 218)","gold":"rgb(219, 192, 127)"};

	//Append Styles
	$("head").append("<style></style>")
	//Create Box
	$("#balance-wrapper").parent().prepend('<div id="assistant" style="width:105px;height:100px;/*background: #2C2C32;border-radius:5px;margin:auto;margin-bottom:20px;"><div id="spoiler" style="background: 0px center; width: 105px; height: 100px; float: right; border-radius: 5px; position: absolute;"><div id="accuracy-container" style="padding-top: 63px;"></div><div id="credits" style="position:absolute;height:50px;width:125px;margin-top:0px;"><p style="position:absolute;height:50px;width:125px;margin-top:0px;">Script by<a href="https://steamcommunity.com/id/FutureGamer13/" target="_blank"> FutureG </a><a style="padding-left: 25px;" href="https://steamcommunity.com/tradeoffer/new/?partner=325947075&amp;token=kEsx1kPc" target="_blank"> $Donate$ </a></p></div></div></div>')

	var correct = 1
	var rolls = 1

	var highest = {}
	var lowest = {}

	function update(){
		var winner_temp = winner.choice
		var time = Number($("#wheel-timer").text())



		if(time > 0){
			winner = ""
			$("#spoiler").css("background",winner_temp)

		}else{
			//Update spoiler
			winner_temp = winner.choice
			$("#spoiler").css("background",color_codes[winner_temp])
		}

		//Update Ball Colors
		$("#prediction-large-ball").css("background",color_codes_dict[highest.color])
		$("#prediction-small-ball").css("background",color_codes_dict[lowest.color])
	}
	setInterval(update,1000);