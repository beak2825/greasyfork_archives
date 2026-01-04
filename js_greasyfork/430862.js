// ==UserScript==
// @name         Transavia Auto book appointment
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto Reservation Billet Transavia
// @author       MegaBOuSsOl
// @match        https://www.transavia.com/fr-FR/reservez-un-vol/vols/rechercher/
// @match        https://www.transavia.com/fr-FR/accueil/
// @match        https://www.transavia.com/fr-FR/*
// @match        https://www.transavia.com/booking/fr*
// @icon         https://www.google.com/s2/favicons?domain=transavia.com
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/430862/Transavia%20Auto%20book%20appointment.user.js
// @updateURL https://update.greasyfork.org/scripts/430862/Transavia%20Auto%20book%20appointment.meta.js
// ==/UserScript==

/*here we took an exempl from paris to Oran the the following dates*/
/*Depart*/
var depart ="Paris (Orly 3), France"
var Root="ORY"
var arrivee="Oran, Algérie"
var DateDepart="19 août 2021"
var DateArrive =""


/*Alert*/
var AlertOrSearch=setInterval(function(){if (document.getElementsByClassName('HV-gs--bp0 HV-gs--bp10 HV-gs--bp22')[1].innerHTML.indexOf('price') == -1 )
{setTimeout(function(){document.getElementsByClassName("button button-primary")[1].click();}, (330));}
                       else {new Audio('https://www.soundjay.com/misc/sounds/dream-harp-01.mp3').play(); clearInterval(AlertOrSearch);}}, 5*1000);

/*refresh if lost connection*/
setInterval(function(){if ((document.body.innerHTML).indexOf(" pas passé comme prévu"))
{ document.querySelector("body > div.page-takeover.page-takeover-server-error.is-hidden.is-visible > div.HV-gw--bp10 > div > aside > div > div.panel_section.panel_section--button > div > a").click();}}, 7*1000);


/*selectionner le vole*/
var SelectVole=setInterval(function(){if (document.getElementsByClassName('flight-result-button') !== null )
{document.querySelector("#top > div > div > div:nth-child(3) > section > section > div > div.panel_section.panel_section--content.results.c-flight-results-panel > div.resultsPanelWrapper > div > div.margin-bottom-2rem.margin-bottom-1d5rem--bp10 > div > form > div > button").click();

 ;
 clearInterval(SelectVole);}}, 2300);


/*NextPage1*/
var NextPage1=setInterval(function(){
   if (document.getElementsByClassName('actions')[0].outerText.indexOf('Sélectionné') !== -1 ) {document.getElementsByClassName('button button-primary button-desktop')[0].click(); clearInterval(NextPage1);}
},
2000);


/*NextPage2*/
var NextPage2=setTimeout(function(){
   if (document.location.href.indexOf('choisir-un-tarif/selectionner') !== -1) {document.getElementsByClassName('button button-primary button-desktop')[0].click();}
},
2000);

/*NextPage3*/
var NextPage3=setTimeout(function(){
   if (document.location.href.indexOf('details-des-passagers') !== -1) {document.getElementsByClassName('button button-primary button-desktop')[0].click();}
},
2000);

/*NextPage4*/
var NextPage4=setTimeout(function(){
   if (document.location.href.indexOf('hand-luggage') !== -1) {document.getElementsByClassName('tt-button__icon is-right')[0].click();}
},
2000);
var NextPage4_2=setTimeout(function(){
   if (document.location.href.indexOf('hand-luggage') !== -1) {document.getElementsByClassName('tt-button__icon is-right')[0].click();}
},
3000);

/*NextPage5*/
var NextPage5=setTimeout(function(){
   if (document.location.href.indexOf('bagage-de-soute') !== -1) {document.getElementsByClassName('button button-primary button-desktop')[0].click(); }
},
2000);

/*NextPage6*/
var NextPage6=setTimeout(function(){
   if (document.location.href.indexOf('reserver-des-sieges') !== -1) {document.getElementsByClassName('button button-primary button-desktop')[0].click();}
},
2000);

/*NextPage7*/
var NextPage7=setTimeout(function(){
   if (document.location.href.indexOf('personne-de-contact') !== -1) {document.getElementsByClassName('button button-primary button-desktop')[0].click(); }
},
2000);

/*NextPage8*/
var NextPage8=setTimeout(function(){
   if (document.location.href.indexOf('vols/verifie') !== -1) {document.getElementsByClassName('button button-primary button-desktop')[0].click();}
},
2000);


/*Alert Payement*/

   if (document.location.href.indexOf('/paiements/payer') !== -1) {new Audio('https://www.soundjay.com/misc/sounds/dream-harp-07.mp3').play();};


/*Depart*/
var routeSelection_DepartureStation=setInterval(function(){
    if (true) {document.getElementById('routeSelection_DepartureStation-input').value=depart ;clearInterval(routeSelection_DepartureStation);}
},
100);






/*Partie formulaire*/

/*DateArrivé*/
/*var root=setInterval(function(){
    if (true) {document.querySelector("#root > div > div > input[type=hidden]:nth-child(2)").value=Root;clearInterval(root);}
},
1000);

/*Arrivé*/
/*
var routeSelection_ArrivalStation=setInterval(function(){
    if (true) {document.getElementById('routeSelection_ArrivalStation-input').value=arrivee ;clearInterval(routeSelection_ArrivalStation);}
},
1000);

*/
/*DateDepart*/
/*var dateSelection_OutboundDate=setInterval(function(){
    if (true) {document.getElementById('dateSelection_OutboundDate-datepicker').value=DateDepart;clearInterval(dateSelection_OutboundDate);}
},
1000);
*/
/*DateArrivé*/
/*var dateSelection_IsReturnFlight=setInterval(function(){
    if (true) {document.getElementById('dateSelection_IsReturnFlight-datepicker').value=DateArrive;clearInterval(dateSelection_IsReturnFlight);}
},
1000);
*/



