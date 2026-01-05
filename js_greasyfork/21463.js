// ==UserScript==
// @name         QcTorrent - Shoutbox notifications
// @version		 1.0
// @namespace    qctorrent.io
// @description  Affiche une notification de bureau lors de la réception d'un message
// @author       M1st3rN0b0d7
// @match        https://www.qctorrent.io/chat
// @match		 https://www.qctorrent.io/chat.php
// @match        http://www.qctorrent.io/chat
// @match		 http://www.qctorrent.io/chat.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21463/QcTorrent%20-%20Shoutbox%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/21463/QcTorrent%20-%20Shoutbox%20notifications.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

var me = prompt("Veuillez entrer votre nom d'utilisateur QcTorrent.");
// var me = "M1st3rN0b0d7";

var msg2 = "";

function loop(){

	var msg_all = document.getElementsByClassName("shout-msg");
	var msg_last = msg_all.length - 1;
	var msg = msg_all[msg_last];

	var reply = msg.getElementsByTagName("b")[0];

	if(reply !== undefined){

		var replyTo = reply.innerText;

	}

	var replyTo_2 = replyTo + " - ";

	var user = msg.getElementsByTagName("strong");
	user = user[0].innerText.trim();

	var time = msg.getElementsByTagName("em");
	time = time[0].innerText;

	msg = msg.innerText.replace(user, "").replace(time, "").replace(replyTo_2, "").trim();

	if(replyTo !== undefined){

		var test = replyTo.search(me);

	}

	if(test !== -1 && test !== undefined && msg !== msg2) {

		msg2 = msg;

		notifyMe();

	}

	console.log("User : " + user + "\n" + "Reply To : " + replyTo + "\n" + "Test : " + test + "\n" + "Msg : " + msg);

 	function notifyMe() {

    	if (!Notification) {

      	alert('Notifications de bureau non supportées.');
    	return;

   		}

    	if (Notification.permission !== "granted")
     		Notification.requestPermission();

   	 	else {

      	var notification = new Notification('Shoutbox QcTorrent', {

       	 icon: 'https://i.goopics.net/6Y9R.png',
         body: "Message de " + user + "\n" + msg,

    	});

      	var audio = new Audio("http://mobilering.net/ringtones/mp3/sound-effects/facebook_pop.mp3");
      	audio.volume = 0.3;
      	audio.play();

  	  }

  	}

  	function highlightMe(){

  		var strong_me = "strong#" + me;

 		var user_me = document.querySelectorAll(strong_me);

		for (var i = 0; i < user_me.length; i++) {

    		user_me[i].setAttribute('style', 'background-color: #3498db!important; border: 3px solid red;');

		}

  	}

  	highlightMe();

}

var loopFunction = window.setInterval(loop, 100);