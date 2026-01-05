// ==UserScript==
// @name         T411 - Shoutbox notifications
// @version      1.0
// @namespace    https://www.t411.li
// @description  Affiche une notification de bureau lors de la réception d'un message
// @author       M1st3rN0b0d7
// @match        http://www.t411.ch/chati/*
// @match        https://www.t411.ch/chati/*
// @match        http://www.t411.li/chati/*
// @match        https://www.t411.li/chati/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21132/T411%20-%20Shoutbox%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/21132/T411%20-%20Shoutbox%20notifications.meta.js
// ==/UserScript==

var me = prompt("Veuillez entrer votre nom d'utilisateur T411.");
// var me = "M1st3rN0b0d7";

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

var me_2 = "@" + me + " : ";
var me_3 = "@" + me + " | ";
var me_4 = "@" + me + " ";
var me_mp = "» " + me;

var msg_backup = "";

function loop() {

  var element = document.getElementsByClassName("message")[0];
  var user    = element.getElementsByTagName("strong")[0];
  var user_mp = element.getElementsByTagName("strong")[1];
  var msg     = element.getElementsByTagName("p")[0];
  var msg2    = msg.innerText.replace(me_2, "");
  var msg3    = msg2.replace(me_3, "");
  var msg4    = msg3.replace(me_4, "");
  var test    = msg.innerText.search(me);

  if(user_mp !== undefined){

    var test2   = user_mp.innerText.search(me_mp);

  }

  if(test !== -1 && msg.innerText !== msg_backup) {

      msg_backup = msg.innerText;

      notifyMe();

  }

  if(test2 !== -1 && test2 !== undefined && msg.innerText !== msg_backup) {

    var user_mp2 = user.innerText.replace(me_mp, "");

    msg_backup = msg.innerText;

    notifyMe_mp();

  }

  function notifyMe() {

    if (!Notification) {

      alert('Notifications de bureau non supportées.');
     return;

    }

    if (Notification.permission !== "granted")
      Notification.requestPermission();

    else {

      var notification = new Notification('Shoutbox T411', {

        icon: 'https://www.t411.ch/themes/blue/images/logo.png',
        body: "Message de " + user.innerText + "\n" + msg4,

     });

      var audio = new Audio("https://cdn.rawgit.com/M1st3rN0b0d7/t411-ShoutboxNotifications/master/facebook_pop.mp3");
      audio.volume = 0.3;
      audio.play();

    }

  }

  function notifyMe_mp() {

    if (!Notification) {

      alert('Notifications de bureau non supportées.');
     return;

    }

    if (Notification.permission !== "granted")
      Notification.requestPermission();

    else {

      var notification = new Notification('Shoutbox T411', {

        icon: 'https://www.t411.ch/themes/blue/images/logo.png',
        body: "Message privé de " + user_mp2 + "\n" + msg4,

     });

      var audio = new Audio("https://cdn.rawgit.com/M1st3rN0b0d7/t411-ShoutboxNotifications/master/facebook_pop.mp3");
      audio.volume = 0.3;
      audio.play();

    }

  }

}

var loopFunction = window.setInterval(loop, 100);
