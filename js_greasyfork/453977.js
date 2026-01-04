// ==UserScript==
// @name         UTC Reload
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Excute a prgrm at specifque minute and seconde
// @author       MeGaBOuSsOl
// @match        *.blsspainvisa.com/*appointment.php
// @match        https://algeria.blsspainvisa.com/*
// @match        https://algeria.blsspainvisa.com/appointment_family.php
// @match        https://algeria.blsspainvisa.com/appointment.php
// @match        https://algeria.blsspainvisa.com/appointment_family.php
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/453977/UTC%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/453977/UTC%20Reload.meta.js
// ==/UserScript==


var MyDecalage= 0;
var Blsdecalage= 13;
var ATminut1= 0;
var ATminut2= 30;

var checkminutes = setInterval(function() {var d = new Date();
var minutes = d.getMinutes(); if((minutes == ATminut1 )||(minutes == ATminut2 )) {

var checkSec = setInterval(function() {var d = new Date();
var Seconds = d.getSeconds(); if(Seconds == (Blsdecalage+MyDecalage) ) {window.location.reload();clearInterval(checkSec)}
},401);
    ;clearInterval(checkminutes);
}
},401);



    /*Button Calcule decalage*/
    let btnClient = document.createElement("decalage");
    btnClient.innerHTML = 'Get Decalage';
    btnClient.setAttribute('id','decalage');
    btnClient.setAttribute("title", "Cliquez quand Utc est a 00 afin d'avoir votre décalage par rapport a UTC Time");
    btnClient.style.cursor = "pointer";
    btnClient.style.position = 'absolute';
    btnClient.style.width = (btnClient.innerHTML.length * 15) + 'px'; // setting the width to 200px
    btnClient.style.height = '30px'; // setting the height to 200px
    btnClient.style.left = '10px';
    btnClient.style.top = '100px';
    btnClient.style.background = 'Crimson'; // setting the background color to teal
    btnClient.style.borderRadius= '25px';
    btnClient.style.border = '3px solid lightblue';
    btnClient.style.color = 'white'; // setting the color to white
    btnClient.style.fontSize = '20px'; // setting the font size to 20px
    btnClient.style.fontWeight = "bold";
    btnClient.style.textAlign = ('center');
    btnClient.style.verticalAlign="bottom";
    btnClient.onclick = function() {var da= new Date();
var SecondsDecalage = da.getSeconds(); alert(SecondsDecalage) ;

};document.body.appendChild(btnClient);
