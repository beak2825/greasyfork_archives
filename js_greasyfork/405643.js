// ==UserScript==
// @name         OmertaClicker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @include                  http://*.barafranca.com/*
// @include                  https://*.barafranca.com/*
// @include                  http://barafranca.com/*
// @include                  https://barafranca.com/*
// @include                  http://*.barafranca.nl/*
// @include                  https://*.barafranca.nl/*
// @include                  http://barafranca.nl/*
// @include                  https://barafranca.nl/*
// @include                  http://*.barafranca.us/*
// @include                  https://*.barafranca.us/*
// @include                  http://barafranca.us/*
// @include                  https://barafranca.us/*
// @include                  http://*.barafranca.gen.tr/*
// @include                  https://*.barafranca.gen.tr/*
// @include                  http://barafranca.gen.tr/*
// @include                  https://barafranca.gen.tr/*
// @include                  http://omerta.com.tr/*
// @include                  https://omerta.com.tr/*
// @include                  http://*.omerta.com.tr/*
// @include                  https://*.omerta.com.tr/*
// @include                  http://*.omerta.dm/*
// @include                  https://*.omerta.dm/*
// @include                  http://omerta.dm/*
// @include                  https://omerta.dm/*
// @include                  http://*.omerta.pt/*
// @include                  https://*.omerta.pt/*
// @include                  http://omerta.pt/*
// @include                  https://omerta.pt/*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/405643/OmertaClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/405643/OmertaClicker.meta.js
// ==/UserScript==

console.log("Deneme deneme");

var timeout = false;
var notif = false;
function refresh()
{
    if($("#recaptcha-popup").length > 0)
    {
        return 0;
    }
    timeout = false;
    location.reload();
}


function check()
{

    if($("#recaptcha-popup").length > 0)
    {
        if(notif)
        {
            GM_notification ( {title: 'Captcha', text: 'Captcha', silent: true} );
            notif = false;
        }
        return 0;
    }
    notif = true;
    if($("#game_container").text().includes("10 per minute") && timeout == false)
    {
        console.log("Timeout");
        timeout = true;
        setTimeout(refresh, 15000);

    }
    console.log($("#game_container").text())

    if($("[name='Check']").length > 0)
    {
        $("[name='Check']").click()
        return 0
    }
    else
    {
        //if($("[name='Check']") == undefined)

        if($("[name='scratch']").length > 0)
        {
            $("[name='scratch']").click()
            return 0
        }

        if($('[href="scratch.php"]')[0] != undefined)
        {
            $('[href="scratch.php"]')[0].click()
            return 0
        }
    }





}


setInterval(check, 600);


