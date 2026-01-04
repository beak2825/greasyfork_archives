// ==UserScript==
// @name         EyesOfTLS
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  AutoEyesAndAlertToPickTLSrdv
// @author       MegaBouSs
// @match      https://visa-fr.tlscontact.com/dz/ORN/myapp.php*
// @match      https://visa-fr.tlscontact.com/dz/ORN/index.php*
// @match        https://visa-fr.tlscontact.com/dz/ORN/login.php*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/376106/EyesOfTLS.user.js
// @updateURL https://update.greasyfork.org/scripts/376106/EyesOfTLS.meta.js
// ==/UserScript==



/*IndexToLogin*/
 if (
  (window.location.href).indexOf("index") > -1
) {window.location.href="https://visa-fr.tlscontact.com/dz/ORN/login.php" || document.querySelector("#navbarCollapse > ul > li:nth-child(5) > a").click();}else
      if (
  (window.location.href).indexOf("login") > -1
) {
/*Please anser your password*/
  var standartPassword="Iphone643g$";
  document.getElementById("pwd").value = standartPassword ;
/*Please insert your pathfinder emails*/
  var email_1="yourFakeEmail1@expl.fr",
      email_2="yourFakeEmail2@expl.fr",
      email_3="yourFakeEmail3@expl.fr",
      email_4="yourFakeEmail4@expl.fr",
      email_5="yourFakeEmail5@expl.fr",
      email_6="yourFakeEmail6@expl.fr",
      email_7="yourFakeEmail7@expl.fr",
      email_8="yourFakeEmail8@expl.fr",
      email_9="yourFakeEmail9@expl.fr",
      email_10="yourFakeEmail10@expl.fr",
      email_11="yourFakeEmail11@expl.fr",
      email_12="yourFakeEmail12@expl.fr",
      email_13="yourFakeEmail13@expl.fr",
      email_14="email_1@expl.com",
      email_15="email_2@expl.com",
      email_16="yourFakeEmail14@expl.fr",
      email_17="yourFakeEmail15@expl.fr",
      email_18="yourFakeEmail16@expl.fr",
      email_19="email_14@expl.com",
      email_20="email_15@expl.com",
      email_21="yourFakeEmail21@expl.fr",
      email_22="yourFakeEmail22@expl.fr",
      email_23="yourFakeEmail23@expl.fr",
      email_24="email_24@expl.com",
      email_25="email_25@expl.com",
      email_26="yourFakeEmail26@expl.fr",
      email_27="yourFakeEmail27@expl.fr",
      email_28="yourFakeEmail28@expl.fr",
      email_29="email_29@expl.com",
      email_30="email_30@expl.com",
      email_31="yourFakeEmail31@expl.fr",
      email_32="yourFakeEmail32@expl.fr",
      email_33="yourFakeEmail33@expl.fr",
      email_34="email_34@expl.com",
      email_35="email_35@expl.com";
/*check time*/

 // hour, minute, second, millisecond
var tmp = new Date().getTime();
var TimeBegin = new Date().setHours(0,0,0,0);
var GetEmail= document.getElementById("email");
  /*Choose email*/
   if ((tmp-TimeBegin)/1800000 <= 1){GetEmail.value=(email_1);} else
   if ((tmp-TimeBegin)/1800000 <= 2){GetEmail.value=(email_2);} else
   if ((tmp-TimeBegin)/1800000 <= 3){GetEmail.value=(email_3);} else
   if ((tmp-TimeBegin)/1800000 <= 4){GetEmail.value=(email_4);} else
   if ((tmp-TimeBegin)/1800000 <= 5){GetEmail.value=(email_5);} else
   if ((tmp-TimeBegin)/1800000 <= 6){GetEmail.value=(email_6);} else
   if ((tmp-TimeBegin)/1800000 <= 7){GetEmail.value=(email_7);} else
   if ((tmp-TimeBegin)/1800000 <= 8){GetEmail.value=(email_8);} else
   if ((tmp-TimeBegin)/1800000 <= 9){GetEmail.value=(email_9);} else
   if ((tmp-TimeBegin)/1800000 <= 10){GetEmail.value=(email_10);} else
   if ((tmp-TimeBegin)/1800000 <= 11){GetEmail.value=(email_11);} else
   if ((tmp-TimeBegin)/1800000 <= 12){GetEmail.value=(email_12);} else
   if ((tmp-TimeBegin)/1800000 <= 13){GetEmail.value=(email_13);} else
   if ((tmp-TimeBegin)/1800000 <= 14){GetEmail.value=(email_14);} else
   if ((tmp-TimeBegin)/1800000 <= 15){GetEmail.value=(email_15);} else
   if ((tmp-TimeBegin)/1800000 <= 16){GetEmail.value=(email_16);} else
   if ((tmp-TimeBegin)/1800000 <= 17){GetEmail.value=(email_17);} else
   if ((tmp-TimeBegin)/1800000 <= 18){GetEmail.value=(email_18);} else
   if ((tmp-TimeBegin)/1800000 <= 19){GetEmail.value=(email_19);} else
   if ((tmp-TimeBegin)/1800000 <= 20){GetEmail.value=(email_20);}else
   if ((tmp-TimeBegin)/1800000 <= 21){GetEmail.value=(email_21);} else
   if ((tmp-TimeBegin)/1800000 <= 22){GetEmail.value=(email_22);} else
   if ((tmp-TimeBegin)/1800000 <= 23){GetEmail.value=(email_23);} else
   if ((tmp-TimeBegin)/1800000 <= 24){GetEmail.value=(email_24);} else
   if ((tmp-TimeBegin)/1800000 <= 25){GetEmail.value=(email_25);} else
   if ((tmp-TimeBegin)/1800000 <= 26){GetEmail.value=(email_26);}else
   if ((tmp-TimeBegin)/1800000 <= 27){GetEmail.value=(email_27);} else
   if ((tmp-TimeBegin)/1800000 <= 28){GetEmail.value=(email_28);} else
   if ((tmp-TimeBegin)/1800000 <= 29){GetEmail.value=(email_29);} else
   if ((tmp-TimeBegin)/1800000 <= 30){GetEmail.value=(email_30);} else
   if ((tmp-TimeBegin)/1800000 <= 31){GetEmail.value=(email_31);} else
   if ((tmp-TimeBegin)/1800000 <= 32){GetEmail.value=(email_32);}

   /*Conect*/
setTimeout(function(){ if (
  (
   document.location.href
  ).indexOf("login") > -1
) { document.querySelector("#btn > input").click();}}, 1000);

  } else
      if (
  (window.location.href).indexOf("myapp") > -1
) {
/*TimeRefresh*/
var refreshTime=31;

/*GunShootIfOpenAndopenfb*/
var gun=setInterval(function(){
    if (0!=document.getElementsByClassName("dispo").length) { new Audio('https://www.soundjay.com/mechanical/sounds/machine-gun-02.mp3').play();window.open("https://www.messenger.com/groupcall/ROOM:2348241225282175/?call_id=2774503067&users_to_ring%5B0%5D=1093504183&users_to_ring%5B1%5D=1435063033&users_to_ring%5B2%5D=100000090022803&users_to_ring%5B3%5D=100001466821244&users_to_ring%5B4%5D=100002566820279&users_to_ring%5B5%5D=100012037933732&users_to_ring%5B6%5D=100072554192097&has_video=false&initialize_video=false&nonce=admk7k0dmydj&thread_type=2",'_blank');clearInterval(gun);}
},
1000);

/*Refresh*/
setTimeout(function(){
    if (0 ==document.getElementsByClassName("dispo").length) {location.reload();

    }
},
refreshTime*1000);

  }





 
