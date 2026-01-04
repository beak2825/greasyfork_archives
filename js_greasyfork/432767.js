// ==UserScript==
// @name         Tls Report
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  detailled report of openning appointements tls contact visa france in Algeria
// @author       MeGa
// @match        https://visa-fr.tlscontact.com/dz/ORN/myapp.php*
// @icon         https://www.google.com/s2/favicons?domain=tlscontact.com
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/432767/Tls%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/432767/Tls%20Report.meta.js
// ==/UserScript==


if(document.getElementsByClassName('appt-table-btn dispo').length !== 0) {var debMot= document.getElementsByClassName('overable  initialised')[0].innerHTML.indexOf('</b>')+14;
var finMot= document.getElementsByClassName('overable  initialised')[0].innerHTML.indexOf('</div>');
var motif= document.getElementsByClassName('overable  initialised')[0].innerHTML.substring(debMot,finMot);
                                                                          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; var currentdate = new Date();
var datetime =days[currentdate.getDay()] + " le :" + currentdate.getUTCDate() + "/" + (currentdate.getMonth() +1)
+ "/" + currentdate.getFullYear() + " @ "
+ currentdate.getHours() + ":"
+ currentdate.getMinutes() + " min";
var classSlot= document.getElementsByClassName('appt-table-btn dispo');
var slot = (datetime + '\nLes rdv ouverts pour le type de Visa '+ motif +":");
  for (let i = 0; i < classSlot.length; i++) { slot += ('\n') + classSlot[i].parentElement.innerText.substring('4','14')+ (' ')+classSlot[i].parentElement.innerText.substring('15','18')+ (' ') + classSlot[i].innerHTML + (' ');
  ;};
var text = slot,
blob = new Blob([text], { type: 'text/plain' }),
anchor = document.createElement('a');
anchor.download = "RapportTLS.txt";
anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
anchor.click();}