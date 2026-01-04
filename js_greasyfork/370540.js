// ==UserScript==
// @name         Bitradio listener recapcha
// @namespace    http://bitrad.io/
// @version      0.01
// @author       lxgn
// @description  BitradIO  listener recapcha
// @match        https://bitrad.io/radio/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370540/Bitradio%20listener%20recapcha.user.js
// @updateURL https://update.greasyfork.org/scripts/370540/Bitradio%20listener%20recapcha.meta.js
// ==/UserScript==
var x = '';
var y = '';
var len = '';
var i = '';
var al_capcha_found = 0;
var al_capcha_start = 0;

window.onload = function()
{
//    alert('al_start');
console.log('[al loginer start]');
    //get_login_btn();
    //al_login_btn.click();
    //al_insert_button();

    //al_create_task();
    setInterval(check_captcha, 5000);
}

//var CAPTCHA_SOUND = "https://namobilu.com/u/ring/f/565/061/samsung_galaxy_s3_notify.mp3";
var CAPTCHA_SOUND = "https://bitradio.liksagen.com/samsung_galaxy_s3_notify.mp3";

function play_sound(sound_url) {
    var player = document.createElement('audio');
    player.src = sound_url;
    player.play();
}


function log (msg)
{
    console.log("[BRO_TOOLS] " + msg);
}

function check_captcha()
{
    log("captcha check");
    var captcha_style = document.getElementById("recaptcha-modal").getAttribute("style");
    if (captcha_style) {
        if (captcha_style.includes("display: block")) {
            log("CAPTCHA!");
            play_sound(CAPTCHA_SOUND);
            al_capcha_found = 1;
            if(al_capcha_start == 0)
            {
                al_create_task();
            }
        }
        else
        {
            al_capcha_found = 0;
            al_capcha_start = 0;
        }
    }
}





var task_id = 0;
var al_hash = '';
var t = '';
var t2 = '';
var al_res = '';

function postResult(kuda,whats,cs)
{
        var xhr = new XMLHttpRequest();
    xhr.open("POST",kuda, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(whats);
    xhr.onreadystatechange = function (){
    if(xhr.readyState == 4)
    {
    t = xhr.responseText;
console.log(t);
    t2 = JSON.parse(t);
    if(cs == "create")
    {
        if(t2.errorId=="0")
        {
        task_id = t2.taskId;
        console.log('set task_id '+task_id);
        setTimeout(al_get_task_timer,5000);
        }
        else
        setTimeout(al_create_task,3000);
    }
    if(cs == "res")
    {
        al_res = t2;
        console.log(t2.status);
        if(t2.status=='ready')
        {
            al_hash = t2.solution.gRecaptchaResponse;
            console.log('set al_hash '+al_hash);
        }
    }

    }
    }
}

function al_create_task()
{
    var kuda = "https://api.anti-captcha.com/createTask";
    var whats = '{"clientKey":"15e8f8e8f5971df93b286ad0ce861960","task":{"websiteURL":"https://bitrad.io/","websiteKey":"6LeNKV4UAAAAADCGxAbimdaF8IYnmjHRx7MIx0gW","websiteSToken":null,"type":"NoCaptchaTaskProxyless"},"softId":802}'
    var cs = 'create';

    postResult(kuda,whats,cs);
}
function al_get_task()
{
    if(task_id==0)return false;

    var kuda = "https://api.anti-captcha.com/getTaskResult";
    var whats = '{"clientKey":"15e8f8e8f5971df93b286ad0ce861960","taskId":'+task_id+'}';
    var cs = 'res';
    postResult(kuda,whats,cs);
}
function al_get_task_timer()
{
    if(al_hash=='')
    {
    al_get_task();
    setTimeout(al_get_task_timer,5000);
    }
    else
    {
        //supercode
        confirmRecaptchaRadio(al_hash);
    }


}
