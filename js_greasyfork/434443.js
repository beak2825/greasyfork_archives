// ==UserScript==
// @name Bitrix24 - Определение региона и времени по телефону
// @version 1
// @author sale5
// @description Определение региона и времени по телефону
// @grant none
// @include https://*.bitrix24.ru/*
// @namespace https://greasyfork.org/users/828502
// @downloadURL https://update.greasyfork.org/scripts/434443/Bitrix24%20-%20%D0%9E%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B3%D0%B8%D0%BE%D0%BD%D0%B0%20%D0%B8%20%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8%20%D0%BF%D0%BE%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/434443/Bitrix24%20-%20%D0%9E%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B3%D0%B8%D0%BE%D0%BD%D0%B0%20%D0%B8%20%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8%20%D0%BF%D0%BE%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

var interval1 = setInterval(function(){
    var addressField = document.querySelector('.crm-entity-widget-client-address').innerHTML;
    if(addressField){
      return;
    }
    var phone = document.querySelector('.crm-entity-widget-client-contact-phone').innerText;
    var newXHR = new XMLHttpRequest();
    newXHR.addEventListener( 'load', reqListener );
    newXHR.open( 'GET', `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.regius.name/iface/phone-number.php?phone='+phone+'&token=fddf99243b1c9b523c906ec75d98e19908a02630')}` );
    newXHR.send();
    
}, 1500);

})();

function reqListener(){
   //console.info(this.response);
   var result = JSON.parse(this.response);
   result = JSON.parse(result.contents);
   //console.info(result);
   var date = new Date();
   if(result.utc.indexOf('+') > -1){
       time = (date.getUTCHours()+parseInt(result.utc));
   } else {
       time = (date.getUTCHours()-parseInt(result.utc));
   }
   //time = (date.getUTCHours()+result.utc);
   document.querySelector('.crm-entity-widget-client-address').innerHTML += '<div style="background: gray; width: 100%; color: white;">'+result.region+' | '+time+':'+date.getUTCMinutes()+'</div>';
}