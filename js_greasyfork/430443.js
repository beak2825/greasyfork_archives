// ==UserScript==
// @name         Transavia fr auto check
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Keep an eye in transavia specific date
// @author       MegaBOuSsOl
// @match        https://www.transavia.com/fr-FR/reservez-un-vol/vols/rechercher/
// @match        https://www.transavia.com/fr-FR/accueil/
// @icon         https://www.google.com/s2/favicons?domain=transavia.com
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/430443/Transavia%20fr%20auto%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/430443/Transavia%20fr%20auto%20check.meta.js
// ==/UserScript==

/*here we took an exempl from paris to Oran the the following dates*/
/*Depart*/
var depart ="Paris (Orly 3), France"
var Root="ORY"
var arrivee="Oran, Algérie"
var DateDepart="22 août 2021"
var DateArrive ="30 août 2021"


/*Alert*/
if (document.getElementsByClassName('HV-gs--bp0 HV-gs--bp10 HV-gs--bp22')[1].innerHTML.indexOf('price') == -1 )
{setTimeout(function(){window.location.reload();}, 10* 1000)} else {new Audio('https://www.soundjay.com/misc/sounds/dream-harp-07.mp3').play();}

document.getElementById('flyingBlueSearch_FlyingBlueSearch').value='true'
/*Depart*/
var routeSelection_DepartureStation=setInterval(function(){
    if (true) {document.getElementById('routeSelection_DepartureStation-input').value=depart ;clearInterval(routeSelection_DepartureStation);}
},
1000);

/*DateArrivé*/
var root=setInterval(function(){
    if (true) {document.querySelector("#root > div > div > input[type=hidden]:nth-child(2)").value=Root;clearInterval(root);}
},
1000);

/*Arrivé*/
var routeSelection_ArrivalStation=setInterval(function(){
    if (true) {document.getElementById('routeSelection_ArrivalStation-input').value=arrivee ;clearInterval(routeSelection_ArrivalStation);}
},
1000);


/*DateDepart*/
var dateSelection_OutboundDate=setInterval(function(){
    if (true) {document.getElementById('dateSelection_OutboundDate-datepicker').value=DateDepart;clearInterval(dateSelection_OutboundDate);}
},
1000);

/*DateArrivé*/
var dateSelection_IsReturnFlight=setInterval(function(){
    if (true) {document.getElementById('dateSelection_IsReturnFlight-datepicker').value=DateArrive;clearInterval(dateSelection_IsReturnFlight);}
},
1000);


setTimeout(function(){document.getElementsByClassName("button button-primary")[3].click();}, (330*1000))