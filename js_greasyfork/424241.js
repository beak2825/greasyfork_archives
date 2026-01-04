// ==UserScript==
// @name         DragonHaxx
// @namespace    none
// @version      3.0
// @description  DragonHaxx 3.0 by suiciThink. Discord server: https://www.discord.gg/invite/DnZD7xN4Zd
// @author       suicidalThink.
// @match        http://ourworldoftext.com/*
// @grant        http://ourworldoftext.com/*
// @downloadURL https://update.greasyfork.org/scripts/424241/DragonHaxx.user.js
// @updateURL https://update.greasyfork.org/scripts/424241/DragonHaxx.meta.js
// ==/UserScript==

//spam raid basic char list
// █

//copied 4m web lol
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
//

function chatSpam(tospam){
	api_chat_send(tospam)
	api_chat_send(tospam)
	sleep(0.3)
	api_chat_send(tospam)
	api_chat_send(tospam)
	sleep(0.3)
	api_chat_send(tospam)
	api_chat_send(tospam)
	sleep(0.3)
	api_chat_send(tospam)
	api_chat_send(tospam)
	sleep(0.3)
	api_chat_send(tospam)
	api_chat_send(tospam)
	sleep(0.3)
	api_chat_send(tospam)
	api_chat_send(tospam)
}
function ezhud(){
	resizeChat(450,450)
	Permissions.can_paste = function() {return true;};
	Permissions.can_admin = function() {return true;};
}
function dgh(){
	console.log("1) Mass Chat Spamming >>> chatSpam(tospam)")
	console.log("2) Circle around spawn >>> ras(char)")
	console.log("3) Bigger n~ ez hud >>> ezhud()")
	console.log("4) get X,Y >>> getpos()")
	console.log("5) Mass RAID >>> massraid()")
}
function ras(char){
	// bottom
	writeCharToXY(char,"10881023","15","8")
	writeCharToXY(char,"10881023","14","8")
	writeCharToXY(char,"10881023","13","8")
	writeCharToXY(char,"10881023","12","8")
	writeCharToXY(char,"10881023","11","8")
	writeCharToXY(char,"10881023","10","8")
	writeCharToXY(char,"10881023","9","8")
	writeCharToXY(char,"10881023","8","8")
	writeCharToXY(char,"10881023","7","8")
	writeCharToXY(char,"10881023","6","8")
	writeCharToXY(char,"10881023","5","8")
	writeCharToXY(char,"10881023","4","8")
	writeCharToXY(char,"10881023","3","8")
	writeCharToXY(char,"10881023","2","8")
	writeCharToXY(char,"10881023","1","8")
	writeCharToXY(char,"10881023","0","8")
	writeCharToXY(char,"10881023","-1","8")
	writeCharToXY(char,"10881023","-2","8")
	writeCharToXY(char,"10881023","-3","8")
	writeCharToXY(char,"10881023","-4","8")
	writeCharToXY(char,"10881023","-5","8")
	writeCharToXY(char,"10881023","-6","8")
	writeCharToXY(char,"10881023","-7","8")
	writeCharToXY(char,"10881023","-8","8")
	writeCharToXY(char,"10881023","-9","8")
	writeCharToXY(char,"10881023","-10","8")
	writeCharToXY(char,"10881023","-11","8")
	writeCharToXY(char,"10881023","-12","8")
	writeCharToXY(char,"10881023","-13","8")
	writeCharToXY(char,"10881023","-14","8")
	writeCharToXY(char,"10881023","-15","8")
	writeCharToXY(char,"10881023","-16","8")
	// left
	writeCharToXY(char,"10881023","-17","7")
	writeCharToXY(char,"10881023","-17","6")
	writeCharToXY(char,"10881023","-17","5")
	writeCharToXY(char,"10881023","-17","4")
	writeCharToXY(char,"10881023","-17","3")
	writeCharToXY(char,"10881023","-17","2")
	writeCharToXY(char,"10881023","-17","1")
	writeCharToXY(char,"10881023","-17","0")
	writeCharToXY(char,"10881023","-17","-1")
	writeCharToXY(char,"10881023","-17","-2")
	writeCharToXY(char,"10881023","-17","-3")
	writeCharToXY(char,"10881023","-17","-4")
	writeCharToXY(char,"10881023","-17","-5")
	writeCharToXY(char,"10881023","-17","-6")
	writeCharToXY(char,"10881023","-17","-7")
	writeCharToXY(char,"10881023","-17","-8")
	writeCharToXY(char,"10881023","-17","-9")
	writeCharToXY(char,"10881023","-17","6")
	// top
	writeCharToXY(char,"10881023","16","-9")
	writeCharToXY(char,"10881023","15","-9")
	writeCharToXY(char,"10881023","14","-9")
	writeCharToXY(char,"10881023","13","-9")
	writeCharToXY(char,"10881023","12","-9")
	writeCharToXY(char,"10881023","11","-9")
	writeCharToXY(char,"10881023","10","-9")
	writeCharToXY(char,"10881023","9","-9")
	writeCharToXY(char,"10881023","8","-9")
	writeCharToXY(char,"10881023","7","-9")
	writeCharToXY(char,"10881023","6","-9")
	writeCharToXY(char,"10881023","5","-9")
	writeCharToXY(char,"10881023","4","-9")
	writeCharToXY(char,"10881023","3","-9")
	writeCharToXY(char,"10881023","2","-9")
	writeCharToXY(char,"10881023","1","-9")
	writeCharToXY(char,"10881023","0","-9")
	writeCharToXY(char,"10881023","-1","-9")
	writeCharToXY(char,"10881023","-2","-9")
	writeCharToXY(char,"10881023","-3","-9")
	writeCharToXY(char,"10881023","-4","-9")
	writeCharToXY(char,"10881023","-5","-9")
	writeCharToXY(char,"10881023","-6","-9")
	writeCharToXY(char,"10881023","-7","-9")
	writeCharToXY(char,"10881023","-8","-9")
	writeCharToXY(char,"10881023","-9","-9")
	writeCharToXY(char,"10881023","-10","-9")
	writeCharToXY(char,"10881023","-11","-9")
	writeCharToXY(char,"10881023","-12","-9")
	writeCharToXY(char,"10881023","-13","-9")
	writeCharToXY(char,"10881023","-14","-9")
	writeCharToXY(char,"10881023","-15","-9")
	writeCharToXY(char,"10881023","-16","-9")
	// right
	writeCharToXY(char,"10881023","16","7")
	writeCharToXY(char,"10881023","16","6")
	writeCharToXY(char,"10881023","16","5")
	writeCharToXY(char,"10881023","16","4")
	writeCharToXY(char,"10881023","16","3")
	writeCharToXY(char,"10881023","16","2")
	writeCharToXY(char,"10881023","16","1")
	writeCharToXY(char,"10881023","16","0")
	writeCharToXY(char,"10881023","16","-1")
	writeCharToXY(char,"10881023","16","-2")
	writeCharToXY(char,"10881023","16","-3")
	writeCharToXY(char,"10881023","16","-4")
	writeCharToXY(char,"10881023","16","-5")
	writeCharToXY(char,"10881023","16","-6")
	writeCharToXY(char,"10881023","16","-7")
	writeCharToXY(char,"10881023","16","-8")
	writeCharToXY(char,"10881023","16","-9")
	writeCharToXY(char,"10881023","16","6")
}
function getpos(){
	console.log(positionX,positionY)
}
function massraid(char) { // in dev
	writeCharToXY(char,"10881023","-25","-25")
}