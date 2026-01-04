// ==UserScript==
// @name         omegle chatbot
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  getting people to add hannjohnson
// @author       sum fag
// @match        https://www.omegle.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403180/omegle%20chatbot.user.js
// @updateURL https://update.greasyfork.org/scripts/403180/omegle%20chatbot.meta.js
// ==/UserScript==

var msgs;
var mReplies = ["f", "f", "hey f lol", "omg hi i'm f", "f hii :)", "f heyy", "f here", "f", "f wspp", "f how old r u :)"];
var ageReplies = ["16","17","18","19","20","21","22","23","24", "25"];
var hiTriggers = ["hi", "hey", "heyy", "hola", "hello"];
var hiReplies = ["hi", "hey", "heyy", "hola", "hello", "hi", "hey", "heyy", "hola", "hello"];
var replyNumber;
var wUReplies = ["not much, just chillin", "doing ok", "nm hbu", "im good", "im ok", "im g hbu", "im alright", "not much", "im good", "im ok", "im alright"]
var fReplies = ["lol f too what's up?", "f too hey", "f too wsp", "f too", "hey f too", "lol f too what's up?", "f too hey", "f too wsp", "f too", "hey f too"];
var currentMsg;
var currentMsgText;
var allMsg;
var currentAllMsg;
var chatbox;
var sendButton;
var secondsToGo;
var secondsToGoz;
var x;
var y;
var z;
function disconnect() {
			document.getElementsByClassName("disconnectbtn")[0].click();
			setTimeout(function() {
				document.getElementsByClassName("disconnectbtn")[0].click();
			}, 200);
			y = 0;
			z = 0;
		}
setInterval(function() {
	allMsg = document.getElementsByClassName("logitem");
	if(allMsg.length > 16 && allMsg[currentAllMsg].childNodes[0].className != "youmsg") {
		chatbox.value = "you should add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		setTimeout(disconnect(), 5000);
	}
}, 100);
setInterval(function() {
	if(document.getElementById("textbtn")) {
		document.getElementById("textbtn").src = "https://www.gannett-cdn.com/presto/2019/08/16/USAT/bd6538e4-5535-41ce-857b-518451c3a958-Snapchat_Logo_H.png?crop=2499,1406,x1,y56&width=2499&height=1406&format=pjpg&auto=webp";
	}
		if(allMsg.length == 1 || allMsg[1].childNodes[0].innerHTML != "Stranger is typing...") {
			if(z < 20) {
			z = z + 1;
			secondsToGoz = 20 - (z - 1);
			if(isNaN(secondsToGoz) == false) {
			document.getElementsByClassName("statuslog")[0].innerHTML = "Time until re-roll: "+(secondsToGoz);
		}
			}
			if(secondsToGoz == 1) {
			disconnect();
			z = 0;
	}
		}
	}, 1000);
setInterval(function() {
	x = 0;
	allMsg = document.getElementsByClassName("logitem");
	chatbox = document.getElementsByClassName("chatmsgwrapper")[0].childNodes[0];
	sendButton = document.getElementsByClassName("sendbtn")[0];
	replyNumber = Math.floor(Math.random() * 10);
	msgs = document.getElementsByClassName("strangermsg");
	if(msgs.length > 1) {
		currentMsg = msgs.length - 1;
	}
	else {
		currentMsg = 0;
	}
	if(document.getElementsByClassName("newchatbtnwrapper")[0]) {
		document.getElementsByClassName("newchatbtnwrapper")[0].childNodes[0].click();
		y = 0;
		z = 0;
	}
	currentAllMsg = allMsg.length - 1;
	if(allMsg[currentAllMsg].childNodes[0].className == "youmsg" || allMsg[currentAllMsg].childNodes[0].innerHTML != "Stranger is typing..." || (allMsg[currentAllMsg].childNodes[0].className == "statuslog" && allMsg[currentAllMsg].childNodes[0].innerHTML != "Stranger is typing...")) {
		if(y < 20) {
			y = y + 1;
			secondsToGo = 20 - (y - 1);
			if(isNaN(secondsToGo) == false) {
			document.getElementsByClassName("statuslog")[0].innerHTML = "Time until re-roll: "+(secondsToGo);
		}
			}
			if(secondsToGo == 1) {
			disconnect();
			y = 0;
		}
	}
	document.getElementById("onlinecount").innerHTML = currentMsgText;
	currentMsgText = msgs[currentMsg].childNodes[2].innerHTML.toLowerCase();
	if(currentAllMsg == "Stranger is typing...") {
	setTimeout(function() {
		disconnect();
	}, 12000)
}
	if(allMsg[currentAllMsg].childNodes[0].className != "youmsg" && allMsg[currentAllMsg].childNodes[0].innerHTML != "Stranger is typing...") {
	if(currentMsgText.includes("M") == true || currentMsgText.includes("m") == true || currentMsgText == "f?" || currentMsgText.includes("f or m") == true || currentMsgText.includes("asl") == true || currentMsgText.includes("m or f") == true) {
		if(currentMsgText.length < 6) {
		chatbox.value = mReplies[replyNumber];
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	}
	if(currentMsgText.includes("age") == true || currentMsgText.includes("Age") == true || currentMsgText.includes("how old") == true || currentMsgText == "how old are you" || currentMsgText == "how old are you?" || currentMsgText == "how old r u" || currentMsgText.includes("old") == true) {
		chatbox.value = ageReplies[replyNumber] + " hbu";
		setTimeout(function() {
			sendButton.click();
		}, 3500);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("hi") == true || currentMsgText == "hello" || currentMsgText.includes("hey") == true || currentMsgText == "hey there" || currentMsgText == "yo" || currentMsgText == "elo") {
		chatbox.value = hiReplies[replyNumber];
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("f") == true || currentMsgText.includes("F") == true) {
		if(currentMsgText.includes("m or f") == true || currentMsgText.includes("f or m") == true) {
			chatbox.value = mReplies[replyNumber];
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
		}
		else {
		chatbox.value = fReplies[replyNumber];
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	}
	if(currentMsgText.includes("bye") == true || currentMsgText.includes("Bye") == true || currentMsgText.includes("Goodbye") ) {
        disconnect();
        x = 1;
        y = 0;
        z = 0;
    }
	if(currentMsgText.includes("f?") == true) {
		if(currentMsgText.includes("m")) {
			chatbox.value = mReplies[replyNumber];
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		}
		else {
		chatbox.value = "yes";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
	}
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("what") == true || currentMsgText.includes("up") == true || currentMsgText.includes("how") == true || currentMsgText.includes("are") == true || (currentMsgText.includes("r") == true && currentMsgText.includes("u") == true)) {
		if(currentMsgText.includes("where") != true && currentMsgText.includes("old") != true) {
		chatbox.value = wUReplies[replyNumber];
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	}
	if(currentMsgText.includes("horny") == true || currentMsgText.includes("Horny") == true || currentMsgText.includes("dick") == true) {
		chatbox.value = "yes add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
			setTimeout(disconnect(), 1000);
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("snap") == true) {
		chatbox.value = "yes add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
			setTimeout(disconnect(), 1000);
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("kik") == true || currentMsgText.includes("skype") == true) {
		chatbox.value = "no but add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
			setTimeout(disconnect(), 1000);
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("hbu") == true || currentMsgText.includes("bored") == true) {
		chatbox.value = "nm im not gonna waste ur time add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
			setTimeout(disconnect(), 1000);
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(parseInt(currentMsgText, 10) > 12) {
		chatbox.value = "im not gonna waste ur time add my snap @hannjohnson69 ;)";
		setTimeout(function() {
			sendButton.click();
			setTimeout(disconnect(), 1000);
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(parseInt(currentMsgText, 10) < 12) {
		chatbox.value = "go tell mommy its not bedtime yet XD";
		setTimeout(function() {
			sendButton.click();
			setTimeout(disconnect(), 1000);
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("wyd") == true) {
		chatbox.value = "not much hbu";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("location") == true || currentMsgText.includes("where") == true || currentMsgText.includes("from") == true) {
		chatbox.value = "cali";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("bot") == true) {
		chatbox.value = "no im real lol";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("can i ask you something") == true || currentMsgText.includes("can i ask") == true) {
		chatbox.value = "sure";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("wearing") == true) {
		chatbox.value = "nothing lol";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("same") == true || currentMsgText.includes("good") == true || currentMsgText.includes("nudes") == true) {
		chatbox.value = "you should add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
			disconnect();
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("looking") == true || currentMsgText.includes("brings") == true) {
		chatbox.value = "for dudes lmao add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
		}, 3000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("you?") == true || currentMsgText == "u?") {
		chatbox.value = "wym";
		setTimeout(function() {
			sendButton.click();
		}, 3000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(x == 0) {
		if(allMsg[currentAllMsg].childNodes[0].className != "youmsg" && allMsg[currentAllMsg].childNodes[0].innerHTML != "Stranger is typing...") {
		chatbox.value = "ya";
		setTimeout(function() {
			sendButton.click();
		}, 2000);
		y = 0;
		z = 0;
	}
	}
	if(currentMsgText.includes("name") == true) {
		chatbox.value = "hannah";
		setTimeout(function() {
			sendButton.click();
		}, 3000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("trade") == true) {
		chatbox.value = "yes add my snap @hannjohnson69";
		setTimeout(function() {
			sendButton.click();
			setTimeout(disconnect(), 1000);
		}, 2000);
		x = 1;
		y = 0;
		z = 0;
	}
	if(currentMsgText.includes("lie") == true) {
		chatbox.value = "im not";
		setTimeout(function() {
			sendButton.click();
		}, 3000);
		x = 1;
		y = 0;
		z = 0;
	}
}
}, 1000);