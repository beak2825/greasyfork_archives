// ==UserScript==
// @name         EyesOfTLS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  AutoEyesAndAlertToPickTLSrdv
// @author       MegaBouSs
// @include      https://visa-fr.tlscontact.com/ma/RAK/myapp.php*
// @include      https://visa-fr.tlscontact.com/ma/RAK/index.php**
// @match        https://visa-fr.tlscontact.com/ma/RAK/login.php***
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/390130/EyesOfTLS.user.js
// @updateURL https://update.greasyfork.org/scripts/390130/EyesOfTLS.meta.js
// ==/UserScript==

/*RandomEmail*/
/*Please anser your password*/
  var standartPassword="your_password";
  document.getElementById("pwd").value= standartPassword ;
/*Please insert your pathfinder emails*/
  var email_1="email_1@expl.com",
      email_2="email_2@expl.com",
      email_3="email_3@expl.com",
      email_4="email_4@expl.com",
      email_5="email_5@expl.com";
  var x = Math.floor((Math.random() * 5) + 1);
  var GetEmail= document.getElementById("email");
  /*Choose random email*/
  if(x==1){GetEmail.value=(email_1);} else
  if(x==2){GetEmail.value=(email_2);} else
  if(x==3){GetEmail.value=(email_3);} else
  if(x==4){GetEmail.value=(email_4);} else
  if(x==5){GetEmail.value=(email_5);} ;
  /*Alert*/
/*GunShootIf*/
var gun=setInterval(function(){
    if (0!=document.getElementsByClassName("dispo").length) { new Audio('https://www.soundjay.com/mechanical/sounds/machine-gun-02.mp3').play();clearInterval(gun);}
},
1000);

/*Refresh*/
setInterval(function(){
    if (0 ==document.getElementsByClassName("dispo").length) {location.reload();

    }
},
900000);
 /*IndexToLogin*/
 if (
  (window.location.href).indexOf("index") > -1
) {window.location.href="https://visa-fr.tlscontact.com/ma/RAK/login.php"};

/*Conect*/
setTimeout(function(){  if (
  (
   document.location.href
  ).indexOf("login") > -1
) { document.querySelector("#login_form > div:nth-child(5) > input").click();}}, 1000);