// ==UserScript==
// @name         coingecko candy
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  thaieibvn
// @author       You
// @match        https://*.coingecko.com/account/candy?*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/424835/coingecko%20candy.user.js
// @updateURL https://update.greasyfork.org/scripts/424835/coingecko%20candy.meta.js
// ==/UserScript==
// "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
// https://www.coingecko.com/account/candy?locale=en -args --profile-directory="ngoducchi2017"
console.clear()
//let autoBuy = document.location.href.indexOf('autobuy')>=0;
submitGoogleForm();
//setTimeout(function(){submitGoogleForm();}, 10000);

setTimeout(function(){window.close();}, 30000);

//-------------------------------------------------------------------------
function submitGoogleForm(form) {
 let alreadyLoad=false;
  console.log('submitGoogleForm');
  
  let butt = xp('/html/body/div[3]/div[3]/div[3]/div[3]/div/form/input[1]',9);
  //console.log('avalable',avalable);

  if ( butt!=null && butt.value.indexOf('Collect')>=0){
      console.log('butt', butt.value);
      //Collect 20 Candies
    butt.click();
    setTimeout(function(){
        window.close();
    }, 10000);
  }else{
    setTimeout(function(){submitGoogleForm();}, 10000);
  }
}
//-------------------------------------------------------------------------
function setValue(buyVol, avalable){
 let lastValue = buyVol.value;
 buyVol.value = avalable;
 let event = new Event('input', { bubbles: true });
 event.simulated = true;
 let tracker = buyVol._valueTracker;
 if (tracker) {
   tracker.setValue(lastValue);
 }
 buyVol.dispatchEvent(event);
}
//-------------------------------------------------------------------------
function openTab_Discord(path, mess){
  discord_message(mess)
  window.open(path, '_blank');
}
//-------------------------------------------------------------------------
function xp(exp, t, n) {
  var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
  if(t && t>-1 && t<10) switch(t) {
    case 1: r=r.numberValue; break;
    case 2: r=r.stringValue; break;
    case 3: r=r.booleanValue; break;
    case 8: case 9: r=r.singleNodeValue; break;
  } return r;
}
//-------------------------------------------------------------------------
 function discord_message( message) {
  let webHookURL = 'https://discord.com/api/webhooks/772657570263203861/jv49ZAAfCfnb-Ljxan8P0U_ehuIoi2_fffPjVuYyXymFal32cKe_XT2CBOeTeIabEHYX'
    var xhr = new XMLHttpRequest();
    xhr.open("POST", webHookURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      'content': message,
      'username':'AI',
    }));
  }
//-------------------------------------------------------------------------
function sendTele(text, coin){
 var tele='https://api.telegram.org/bot229788679:AAH0BCJ6mBFrhFhDUaTEx9HHHAjQGlVfO2o/sendmessage?chat_id=-1001391459769&text='+text ;
 var xhr = new XMLHttpRequest();
 xhr.open("GET", tele, true);
 xhr.send();
 console.log('sendTele:',text)
}