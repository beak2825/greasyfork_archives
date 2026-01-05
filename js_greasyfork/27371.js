// ==UserScript==
// @name		  newDHRainbowChat Jacob's version
// @namespace	  http://tampermonkey.net/
// @version		  2.0.2
// @description	  Diamond Hunt Online Rainbow Chat
// @author		  jacob713
// @match		  http://*.diamondhunt.co/game.php
// @match		  https://*.diamondhunt.co/game.php
// @run-at        document-idle
// @grant		  none
// @downloadURL https://update.greasyfork.org/scripts/27371/newDHRainbowChat%20Jacob%27s%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/27371/newDHRainbowChat%20Jacob%27s%20version.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';



/*
 *  What this script does:
 *    1. Make the chat rainbow colored! - Credits to John and WhoIsYou for creating the original old version!
 *    2. Change the background color for the chat to be dark!
 */



  // Just to make the chatbox look better with this script's colors, I have to style the element with the ID "chat-area-div"
document.getElementById("chat-area-div").style = "background-color:#e4e4e4;color:999!important;";

/*
	This script is a complete rebuild of John and WhoIsYou's original version named "DHRainbowChat" found here: https://greasyfork.org/en/scripts/17596-dhrainbowchat
    I am NOT the guy who came with this idea! But I rebuilt it because the original is not working and the creators have not fixed it! give the credits to them, NOT me!
    Even if I don't want the credits for creating this, I would be SO happy if you donate to support what I have done! :D My PayPal account: Lasse.brustad@gmail.com
*/

  // Colors is not edited! They are just copied from the original version!
// Reds, Greens, Pinks, Purples, Oranges, Golds/Yellows
var rcColours = [
    ["#ff0000", "#cc0000", "#b30000"],
    ["#00cc00", "#009900", "#00e600"],
    ["#ff99cc", "#ff4da6", "#ff0080"],
    ["#9900cc", "#730099", "#bf00ff"],
    ["#ff9933", "#ff8000", "#ff9933"],
    ["#e6b800", "#cca300", "#b38f00"]];
var rcColour = -1;
var rcLastColour = -1;


  // This is a trigger for the script to make the changes!
window.refreshChat = function(data) {
	data = newRainbowChat(data);
};


  // The actually magically code is here! This code will make the chat colors change when the above code is triggered and need this code!
  // All errors here that Tampermonkey tell you "'someVar' is not defined." is allready in Smitty's scripts!
function newRainbowChat(data) {
	var chatbox = document.getElementById("chat-area-div");
	var output = data;

	var splitArray = data.split("~");
	var userChatting = splitArray[0];
	var levelChat = splitArray[1];
	var tag = splitArray[2];
	var icon = splitArray[3];
	var msg = splitArray[4];
	var isPM = splitArray[5];

	for(var i = 0; i < mutedPeople.length; i++)
	{
			if(mutedPeople[i] == userChatting)
				return;
	}

      // Random color!
    while (rcColour === rcLastColour) {
		rcColour = getRandomArbitrary(0, rcColours.length);
	}

	rcLastColour = rcColour;
	var myColour = rcColours[rcColour][getRandomArbitrary(0, rcColours[rcColour].length)];


	var chatSegment = "";
	var timeStamp = timeFetch();
	if(isPM == 1)
	{

		chatSegment = "<span style='color:purple'>PM from " + "<span style='cursor:pointer;' oncontextmenu='searchPlayerHicores(\""+userChatting+"\");return false;' onclick='preparePM(\""+userChatting+"\")'>"+userChatting+"</span>" +": " + msg + "</span>";
		chatSegment += "<br />";
		lastPMFrom = userChatting;
		var totalTextDiv = chatbox.innerHTML + timeStamp  + chatSegment;
		chatbox.innerHTML = totalTextDiv;

		if(isAutoScrolling)
		$("#chat-area-div").animate({ scrollTop:  55555555 }, 'slow');

		return;
	}
	if(isPM == 2)
	{
		chatSegment = "<span style='color:purple'>sent PM to " + "<span style='cursor:pointer;' oncontextmenu='searchPlayerHicores(\""+userChatting+"\");return false;' onclick='preparePM(\""+userChatting+"\")'>"+userChatting+"</span>" +": " + msg + "</span>";
		chatSegment += "<br />";
		var totalTextDiv = chatbox.innerHTML + timeStamp  + chatSegment;
		lastPMFrom = userChatting;
		chatbox.innerHTML = totalTextDiv;

		if(isAutoScrolling)
		$("#chat-area-div").animate({ scrollTop:  55555555 }, 'slow');

		return;
	}
	if(isPM == 3) //yell message
	{
		chatSegment = "<span style='color:#0066ff;'><span class='chat-tag-yell'>Server Message</span> " + msg + " </span>";
		chatSegment += "<br />";
		var totalTextDiv = chatbox.innerHTML + timeStamp  + chatSegment;
		lastPMFrom = userChatting;
		chatbox.innerHTML = totalTextDiv;

		if(isAutoScrolling)
		$("#chat-area-div").animate({ scrollTop:  55555555 }, 'slow');

		return;
	}
	if(icon == 1)
		chatSegment = "<img title='Maxed Skills' src='images/icons/stats.png' style='vertical-align: text-top;' width='20' height='20' alt='Maxed Skills'/>" + chatSegment;

	else if(icon == 2)
		chatSegment = "<img title='Master in Mining' src='images/icons/pickaxe.png' style='vertical-align: text-top;' width='20' height='20' alt='Master in Mining'/>" + chatSegment;
	else if(icon == 3)
		chatSegment = "<img title='Master in Crafting' src='images/icons/anvil.png' style='vertical-align: text-top;' width='20' height='20' alt='Master in Crafting'/>" + chatSegment;
	else if(icon == 4)
		chatSegment = "<img title='Master in Brewing' src='images/brewing/vialofwater_chat.png' style='vertical-align: text-top;' width='20' height='20' alt='Master in Brewinghiscores'/>" + chatSegment;
	else if(icon == 5)
		chatSegment = "<img title='Master in Farming' src='images/icons/watering-can.png' style='vertical-align: text-top;' width='20' height='20' alt='Master in Farming'/>" + chatSegment;
	else if(icon == 6)
        chatSegment = "<img title='Hardcore Account' src='images/icons/hardcoreIcon.png' style='vertical-align: text-top;' width='20' height='20' alt='Hardcore Account'/>" + chatSegment;
	else if(icon == 7)
        chatSegment = "<img title='Halloween 2015' src='images/icons/halloween2015.png' style='vertical-align: text-top;' width='20' height='20' alt='Halloween 2015'/>" + chatSegment;
	else if(icon == 8)
		chatSegment = "<img title='Halloween 2015' src='images/icons/archaeology.png' style='vertical-align: text-top;' width='20' height='20' alt='Halloween 2015'/>" + chatSegment;
	else if(icon == 9)
        chatSegment = "<img title='Chirstmas 2015' src='images/sigils/christmas2015.png' style='vertical-align: text-top;' width='20' height='20' alt='Halloween 2015'/>" + chatSegment;
	else if(icon == 10)
		chatSegment = "<img title='Master in Farming' src='images/magic/wizardHatIcon.png' style='vertical-align: text-top;' width='20' height='20' alt='Master in Farming'/>" + chatSegment;     
	else if(icon == 11)
		chatSegment = "<img title='Holiday' src='images/sigils/easter2016.png' style='vertical-align: text-top;' width='20' height='20' alt='Holiday Sigil'/>" + chatSegment;
	else if(icon == 12)
		chatSegment = "<img title='COOP' src='images/icons/groupTaskBadge5.png' style='vertical-align: text-top;' width='20' height='20' alt='COOP'/>" + chatSegment;
	else if(icon == 13)
		chatSegment = "<img title='cooking master' src='images/icons/cookingskill.png' style='vertical-align: text-top;' width='20' height='20' alt='Cooking Master'/>" + chatSegment;
	else if(icon == 14)
		chatSegment = "<img title='Halloween 2016' src='images/sigils/halloween2016.png' style='vertical-align: text-top;' width='20' height='20' alt='Halloween 2016'/>" + chatSegment;
	else if(icon == 15)
		chatSegment = "<img title='Chirstmas 2016' src='images/sigils/christmas2016.png' style='vertical-align: text-top;' width='20' height='20' alt='Christmas 2016'/>" + chatSegment;

	if(tag == 1)
		chatSegment += "<span><img src='images/icons/donor-icon.gif' style='vertical-align: text-top;' width='20' height='20' alt='Donor'/> ";
	else if(tag == 2)
		chatSegment += "<span style='color:green;'><span class='chat-tag-contributor'>Contributor</span> ";
	else if(tag == 4)
		chatSegment += "<span style='color:#669999;'><span class='chat-tag-mod'>Moderator</span> ";
	else if(tag == 5)
		chatSegment += "<span style='color:#666600;'><span class='chat-tag-dev'>Dev</span> ";


	chatSegment += "<span style='cursor:pointer;color:" + myColour + "' oncontextmenu='searchPlayerHicores(\""+userChatting+"\");return false;' onclick='preparePM(\""+userChatting+"\")'>"+userChatting;
	chatSegment += " (" + levelChat +"): </span>";

	//make links clickable
	if(isValidURL(msg) && disableUrls == 0)
	{
		var msgArray = msg.split(" ");
		var newString = "";
		for(var i = 0; i < msgArray.length; i++)
		{
			if(isValidURL(msgArray[i]))
			{
				var linkFound = "";
				if(!msgArray[i].startsWith("http"))
					linkFound = "<a style='color:#0000D5' href='http://"+msgArray[i]+"' target='_blank'>"+msgArray[i]+"</a>" + " ";
				else
					linkFound = "<a style='color:#0000D5' href='"+msgArray[i]+"' target='_blank'>"+msgArray[i]+"</a>" + " ";
				newString += linkFound;
			}
			else
				newString += msgArray[i] + " ";
		}

		chatSegment += newString;
	}
	else
		chatSegment += msg;

	chatSegment += "<span>";
	chatSegment += "<br />";

	totalTextDiv = chatbox.innerHTML + timeStamp  + chatSegment;
	chatbox.innerHTML = totalTextDiv;

	if(isAutoScrolling)
	$("#chat-area-div").animate({ scrollTop:  55555555 }, 'slow');

    return data;

}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}