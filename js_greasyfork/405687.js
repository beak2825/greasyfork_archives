// ==UserScript==
// @name         OmertaClickerMac
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include      https://barafranca.com/*
// @downloadURL https://update.greasyfork.org/scripts/405687/OmertaClickerMac.user.js
// @updateURL https://update.greasyfork.org/scripts/405687/OmertaClickerMac.meta.js
// ==/UserScript==

var timeout = false;

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

        return 0;
    }
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


