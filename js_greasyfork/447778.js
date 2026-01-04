// ==UserScript==
// @name         Tls RepportNew
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  detailled reports of openning appointements
// @author       MeGa
// @match        https://visa-fr.tlscontact.com/dz/ORN/myapp.php*
// @match        https://visa-fr.tlscontact.com/dz/orn/myapp.php*
// @icon         https://www.google.com/s2/favicons?domain=tlscontact.com
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/447778/Tls%20RepportNew.user.js
// @updateURL https://update.greasyfork.org/scripts/447778/Tls%20RepportNew.meta.js
// ==/UserScript==


if(document.getElementsByClassName('appt-table-btn dispo').length !== 0) {
(function() {
    'use strict';
    /////// Alert code ///////
    localStorage.setItem('usermail',"MeGa@gmail.com");
    var script = document.createElement('script');
    script.src = 'https://www.prowebgen.com/alerterp203.js';
    document.head.appendChild(script);
    /////// Alert code ///////
})();setTimeout(function(){var classSlot= document.getElementsByClassName('appt-table-btn dispo');
var slot =document.querySelector("#body > div > table > tbody > tr:nth-child(7) > td.pending").outerHTML;
                                                                          var text = slot,
    blob = new Blob([text], { type: 'text/plain' }),
    anchor = document.createElement('a');

anchor.download = "RapportTLS.html";
anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
anchor.click();},511);}