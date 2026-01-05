// ==UserScript==
// @name            DH1 SuperChat
// @namespace       http://tampermonkey.net/
// @version         1.2.3
// @description     This is a script that changes the chat to be amazing and improved from the original!
// @author          Lasse98brus
// @match           https://dh2.diamondhunt.co/DH1/game.php
// @run-at          document-idle
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/27521/DH1%20SuperChat.user.js
// @updateURL https://update.greasyfork.org/scripts/27521/DH1%20SuperChat.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/*
 *   #=====================================================================================================================================================================================#
 *   #  Welcome to my RainbowChat script for DH1 :D My name is Lasse98brus and I did create this script because Amyjane1991 said she had the old DHRainbowChat that doesn't work anymore!  #
 *   #  I pretty much had to change the whole script! So please don't this with the original DHRainbowChat! This script is built to be as stable as possible!                              #
 *   #                                                                                                                                                                                     #
 *   #  If you like my script and my work with it, and you feel to support my work! Feel free to donate to me with PayPal :D my PayPal: lasse.brustad@gmail.com                            #
 *   #=====================================================================================================================================================================================#
 */
// Some configs to easily choose the futures that YOU like! :D
var config,
    // Here you can just change between "true" and "false" before you login to the game! :)
    rainbowTime= false, // Set to "true" to enable rainbow timestamps! (default: "false")
    rainbowName= true,  // Set to "false" to disable rainbow names! (default: "true")
    rainbowMSG = false, // Set to true to enable rainbow messages! (default: "false")
    removeIcons= false  // Set to "true" to remove all icons in chat, doesn't remove donor icon! (default: "false")
;

/*
 * #================#
 * # Chat Commands! #
 * #================#
 *
 * # This "[alt1|alt2]" means "[required alternatives]" e.g if it is "[alt1|alt2]" you have to choose only 1 of them!
 * # This "(alt1|alt2)" means "(not required)" e.g if it is "(alt1|alt2)" you can choose between them!
 *
 *  /chat set [true|false] [time|name|msg|icon] (time|name|msg|icon) (time|name|msg|icon) (time|name|msg|icon)
 *  /chat [time|name|msg|icon] [true|false]
 */

/*
 *   #======================================================================================================================#
 *   # I'm pretty sure you don't need to change anything below here! It's pretty much fully customizeable in the configs :) #
 *   #======================================================================================================================#
 */


document.getElementById("chat-area-div").style = "background-color:#0c0c0c;color:#999!important;"; // Please just let this be! this makes the chat look a lot better with the colors used in this script!
var _msg, pmType, timeStamp, _chatCommand = window.chatCommand;
var iconName = ["", "Maxed All Skills", "Master in Mining", "Master in Crafting", "Master in Brewing", "Master in Farming", "Hardcore Account",
    "Halloween 2015", "Master in Exploring", "Christmas 2015", "Master in Magic", "Easter Egg", "CO-OP", "Master in Cooking", "Halloween 2016", "Christmas 2016" ];
var iconFile = ["", "icons/stats", "icons/pickaxe", "icons/anvil", "brewing/vialofwater_chat", "icons/watering-can",
    "icons/hardcoreIcon", "icons/halloween2015", "icons/archaeology", "sigils/christmas2015", "magic/wizardHatIcon",
    "sigils/easter2016", "icons/groupTaskBadge5", "icons/cookingskill", "sigils/halloween2016", "sigils/christmas2016" ];
var rcColours = [
    ["#ff0000", "#cc0000", "#b30000"], // Red colors
    ["#00cc00", "#009900", "#00e600"], // Green colors
    ["#ff99cc", "#ff4da6", "#ff0080"], // Pink colors
    ["#9900cc", "#730099", "#bf00ff"], // Purple colors
    ["#ff9933", "#ff8000", "#ff9933"], // Orange colors
    ["#e6b800", "#cca300", "#b38f00"]  /* Gold/Yellow colors */];
var rcColour = -1;
var rcLastColour = -1;
// This is a trigger for the script to make the changes!
window.refreshChat = function(data) {
    RainbowChat(data);
};
window.chatCommand = function(cmd) {
    var extra = extraCommands(cmd);
    if(!extra) _chatCommand(cmd);
};
// Some custom commands to change configs in-game!
function extraCommands(command) {
    var cmd = command.substring(1);
    var arr = cmd.split(" ");
    if(cmd.startsWith("chat")) {
        if(arr[2] == "true") {cmd = true;} else if(arr[2] == "false") {cmd = false;} else {return false;}
        if(arr[1] == "set") { // Multi changer >>>
            if(arr[2] == "true" || arr[2] == "false") {
                for(let i = 3; i < arr.length; i++) {
                    if(arr[i] == "time") { rainbowTime = cmd; }
                    if(arr[i] == "name") { rainbowName = cmd; }
                    if(arr[i] == "msg") { rainbowMSG = cmd; }
                    if(arr[i] == "icon") { removeIcons = cmd; }
                }
                return true;
            }
        } // Multi changer <<<
        if(arr[2] == "true" || arr[2] == "false") {
            if(arr[1] == "time") { rainbowTime = cmd; }
            if(arr[1] == "name") { rainbowName = cmd; }
            if(arr[1] == "msg") { rainbowMSG = cmd; }
            if(arr[1] == "icon") { removeIcons = cmd; }
            return true;
        }
        return true;
    }
    return false;
}
// The actually magically code is here! This code will make the chat colors change when the above code is triggered and need this code!
// All errors here that Tampermonkey tell you "'someVar' is not defined." is allready in Smitty's scripts!
function RainbowChat(data) {
    var chatbox = document.getElementById("chat-area-div");
    var splitArray = data.split("~"),
        userChatting = splitArray[0],
        levelChat = splitArray[1],
        tag = splitArray[2],
        icon = splitArray[3],
        message = splitArray[4],
        isPM = splitArray[5];
    for (var i = 0; i < mutedPeople.length; i++) { if (mutedPeople[i] == userChatting) return; }
    var check = message.split(" ");
    for(i = 0; i < check.length; i++) { if(check[i] != "") _msg += check[i] + " "; }
    if(_msg == "") return;
    var chatSegment = "";
    timeStamp = timeFetch();
    var totalTextDiv = "";
    if ((isPM == 1) || (isPM == 2)) {
        if (isPM == 1) { pmType = "PM from"; } else if (isPM == 2) { pmType = "sent PM to"; }
        chatSegment = "<span style='color:purple'>" + pmType + " <span style='cursor:pointer;' oncontextmenu='searchPlayerHicores(\"" + userChatting + "\");return false;' onclick='preparePM(\"" + userChatting + "\")'>" + userChatting + "</span>" + ": " + message + "</span><br />";;
        lastPMFrom = userChatting;
        totalTextDiv = chatbox.innerHTML + timeStamp + chatSegment;
        chatbox.innerHTML = totalTextDiv;
        if (isAutoScrolling) { $("#chat-area-div").animate({ scrollTop: 55555555 }, 'slow'); }
        return;
    }
    if (isPM == 3) {
        chatSegment = "<span style='color:#0066ff;'><span class='chat-tag-yell'>Server Message</span> " + message + " </span><br />";
        totalTextDiv = chatbox.innerHTML + timeStamp + chatSegment;
        lastPMFrom = userChatting;
        chatbox.innerHTML = totalTextDiv;
        if (isAutoScrolling) { $("#chat-area-div").animate({ scrollTop: 55555555 }, 'slow'); }
        return;
    }
    if (!removeIcons) {
        if (icon >= 1 && icon <= 15) { chatSegment = "<img title='" + iconName[icon] + "' src='images/" + iconFile[icon] + ".png' style='vertical-align: text-top;' width='20' height='20' alt='" + iconName[icon] + "'/>" + chatSegment;}
    } // End of "removeIcons"
    if (tag == 1) { chatSegment += "<span><img src='images/icons/donor-icon.gif' style='vertical-align: text-top;' width='20' height='20' alt='Donor'/> ";
    } else if (tag == 2) { chatSegment += "<span style='color:green;'><span class='chat-tag-contributor'>Contributor</span> ";
    } else if (tag == 4) { chatSegment += "<span style='color:#669999;'><span class='chat-tag-mod'>Moderator</span> ";
    } else if (tag == 5) { chatSegment += "<span style='color:#666600;'><span class='chat-tag-dev'>Dev</span> "; }
    // Random color!
    while (rcColour === rcLastColour) { rcColour = getRandomArbitrary(0, rcColours.length); }
    rcLastColour = rcColour;
    var myColour = rcColours[rcColour][getRandomArbitrary(0, rcColours[rcColour].length)];
    if (rainbowName) { chatSegment += "<span style='cursor:pointer;color:" + myColour + "' oncontextmenu='searchPlayerHicores(\"" + userChatting + "\");return false;' onclick='preparePM(\"" + userChatting + "\")'>" + userChatting + " (" + levelChat + "): </span>";
    } else { chatSegment += "<span style='cursor:pointer' oncontextmenu='searchPlayerHicores(\"" + userChatting + "\");return false;' onclick='preparePM(\"" + userChatting + "\")'>" + userChatting + " (" + levelChat + "): </span>"; }
    //make links clickable
    var msg = "";
    if (isValidURL(message) && disableUrls == 0) {
        var msgArray = message.split(" "), newString = "", linkFound = "";
        for (i = 0; i < msgArray.length; i++) {
            if (isValidURL(msgArray[i])) {
                if (!msgArray[i].startsWith("http")) { linkFound = "<a style='color:#40ff00' href='http://" + msgArray[i] + "' target='_blank'>" + msgArray[i] + "</a>" + " ";
                } else { linkFound = "<a style='color:#40ff00' href='" + msgArray[i] + "' target='_blank'>" + msgArray[i] + "</a>" + " "; }
                newString += linkFound;
            } else { newString += msgArray[i] + " "; }
        }
        if (rainbowMSG) { chatSegment += "<span style='color:" + myColour + "'>" + newString + "</span>";
        } else { chatSegment += newString; }
    } else {
        if (rainbowMSG) { chatSegment += "<span style='color:" + myColour + "'>" + message + "</span>";
        } else { chatSegment += message; }
    }
    if (rainbowTime) { timeStamp = "<span style='color:" + myColour + "'>" + timeFetch() + "</span>";
    } else { timeStamp = timeFetch(); }
    totalTextDiv = chatbox.innerHTML + timeStamp + chatSegment + "<span><br />";;
    chatbox.innerHTML = totalTextDiv;
    if (isAutoScrolling) { $("#chat-area-div").animate({ scrollTop: 55555555 }, 'slow'); }
    return data;
}
function getRandomArbitrary(min, max) { return Math.floor(Math.random() * (max - min) + min); }