// ==UserScript==
// @name         Bitradio autoplay and inform
// @namespace    http://bitrad.io/
// @version      0.36
// @author       lxgn
// @description  BitradIO informer
// @match        https://bitrad.io/radio/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370239/Bitradio%20autoplay%20and%20inform.user.js
// @updateURL https://update.greasyfork.org/scripts/370239/Bitradio%20autoplay%20and%20inform.meta.js
// ==/UserScript==

var x = '';
var len = 0;
var y = '';
var txt = '';
var val = '';
var pic = '';
var t = '';
var pos = '';
var pos2 = '';
var rid = '';
var al_email = '';





window.onload = function()
{
    //alert('loaded');
    console.log('loaded');
    x = document.getElementById('play');
    x.click();
    al_get_rid();
    radio_captcha_time_title = true;
    al_get_email();
}
function check_connection_state() {
    //log("check for connection_state");
    var connection_state = document.getElementById("connectionState").innerText.trim();
    if (connection_state != "You are Connected to Node. Reconnect-Counter: 1")
    {
        //log("Bad connection state " + connection_state);
        //play_sound(WARNING_SOUND);
        location.reload();
    }
    else
        console.log('[al] connection ok');
}
setInterval(check_connection_state, 5000);


function al_get_email()
{
    x = document.getElementById('form_email');
    al_email = x.value;

}


function al_get_rid()
{
    t = document.location;
    t += '';
    pos = t.indexOf('/radio/');
    pos += 7;
    pos2 = t.indexOf('/',pos);
    rid = t.substr(pos,pos2-pos);
//    alert(rid);
    console.log('rid = '+rid);

return rid;
}

var al_img=document.createElement("img");
al_img.setAttribute("id","al_img2");



function informator()
{
txt = 'e='+al_email+'&';
    x = document.getElementById('connectionState');
    //alert(x);
    //txt += x.innerHTML;
    x = document.getElementById('captchaNext');
    txt += 't='+x.innerHTML;
//    alert(txt);
    txt += '&rid='+rid;
    txt += '&u='+window.location;

//    var x = document.getElementsById('connectionState');
//    var txt = x.innerHTML;
//    alert(txt);
    x = document.getElementsByTagName("h2");
    //len = x.length;
    y = x[0];
    y.innerHTML = txt;


pic = "http://bitradio.liksagen.com/gif?"+txt;
y.appendChild(al_img);

    x = document.getElementById('al_img2');
    x.src = 'http://bitradio.liksagen.com/gif/a?'+txt;
}
setInterval(informator,5000);
