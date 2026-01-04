// ==UserScript==
// @name         recaptcha timeout on bitradio
// @namespace    https://www.google.com/
// @version      0.07
// @author       lxgn
// @description  recaptcha on bitradio
// @match        https://www.google.com/recaptcha/api2/anchor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370330/recaptcha%20timeout%20on%20bitradio.user.js
// @updateURL https://update.greasyfork.org/scripts/370330/recaptcha%20timeout%20on%20bitradio.meta.js
// ==/UserScript==

var capcha_click_timeout = -1;

window.onload = function()
{
//var y = window.parent.location;
//var y = window.top.location;
    //alert('a');
//alert(y);
    window.addEventListener("message", listener);
}
function listener(event)
{
    //console.log("We've got a message!");
  //console.log("* Message:", event.data);
  //console.log("* Origin:", event.origin);
  //console.log("* Source:", event.source);
  //if (event.origin != 'http://javascript.ru')
 // {
    // что-то прислали с неизвестного домена - проигнорируем..
  //  return;
  //}
    //alert( "получено: " + event.data );
    var mess = event.data;
    //mess = JSON.parse(mess);
    //var v = mess.message;
    var txt = mess.substr(0,7);
    //alert(txt);
    if(txt == 'al_bit:')
    {
        var cmd = mess.substr(8);

        eval(cmd);
        //alert(cmd);
        //alert(mess);
    }

}
//var capcha_click_timeout=parent.bit_capcha_timeout;
//if(isNaN(capcha_click_timeout))
//{


//}
function al_start_countdown(v)
{
//alert(v+' '+capcha_click_timeout);
    //var capcha_click_timeout=Math.random()*12+3;
    //capcha_click_timeout = Math.ceil(capcha_click_timeout);
    if(capcha_click_timeout == -1)
    {
//alert('kuku');
    capcha_click_timeout = v;
        //setInterval(al_change_text,1000);
    }

}

var x = document.getElementById('recaptcha-anchor-label');
var al_text = x.innerText;
//alert(x.innerHTML);
//alert(al_text);

function al_change_text()
{
    if(capcha_click_timeout>0)
    {
    capcha_click_timeout--;
    var x = document.getElementById('recaptcha-anchor-label');
    var txt = al_text+'('+capcha_click_timeout+')';
    //alert(txt);
    x.innerHTML = txt;
    }
    if(capcha_click_timeout<1)x.click();
}
//if(capcha_click_timeout>0)
setInterval(al_change_text,1000);
