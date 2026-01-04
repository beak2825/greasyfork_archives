// ==UserScript==
// @name         nanopool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://eth.nanopool.org/account/0x788c9977A342e2343f30C8Eb941CCBFceF638518
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33259/nanopool.user.js
// @updateURL https://update.greasyfork.org/scripts/33259/nanopool.meta.js
// ==/UserScript==
var  c=0;

(function() {
    'use strict';
    TelgramAlert('nanopool started');
    var myInt = setInterval(function(){
     var may01 = xp('//*[@id="workersTab"]/table/tbody/tr[1]/td[5]', 2);
    
        
     var may02 = xp('//*[@id="workersTab"]/table/tbody/tr[2]/td[5]', 2);
     
     if (may01=='0 Mh/s' || may02=='0.0 Mh/s' ){
        if (c<5) notifyMe('May ETH bi loi, ktra gap');
         c++;
     }else c=0;
        
    }, 5000);
    // Your code here...
})();


function xp(exp, t, n) {
var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
if(t && t>-1 && t<10) switch(t) {
case 1: r=r.numberValue; break;
case 2: r=r.stringValue; break;
case 3: r=r.booleanValue; break;
case 8: case 9: r=r.singleNodeValue; break;
} return r;
}



function notifyMe(mess) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    
      var url = window.location.href;
      var coin = url.substr(url.indexOf("=")+1);
      mess = coin + ": " + mess;
 

      
    var notification = new Notification('Notification title', {
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body:mess,
    });

    notification.onclick = function () {
      window.open(url);      
    };

  }

}

function TelgramAlert(text) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "https://api.telegram.org/bot406104668:AAGkoICbROTOrk7un1TPhajyYSjVGsDcWXs/sendmessage?chat_id=159755908&text="+ text, true);
  xhttp.send();
    notifyMe(text);
}