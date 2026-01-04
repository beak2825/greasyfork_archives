// ==UserScript==
// @name         submitTheApplication
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  BLS_moroccosubmitTheApplicationToTakeAppointment
// @author       MeGaBOuSsOl
// @match        https://morocco.blsspainvisa.com/book_appointment.php
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/392278/submitTheApplication.user.js
// @updateURL https://update.greasyfork.org/scripts/392278/submitTheApplication.meta.js
// ==/UserScript==

var chooseDate=setInterval(function(){
    if (document.getElementsByClassName('day activeClass').length !==0 )
{document.getElementsByClassName('day activeClass')[Math.floor(((document.getElementsByClassName('day activeClass').length))/3)].click();clearInterval(chooseDate);}
},
(13/11)*999); 