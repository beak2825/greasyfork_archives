// ==UserScript==
// @name         Recurbate Confirm 18 Autoclicker
// @description  Autoclicks the 18 plus pop up when you first visit the site.
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @author       Labryn
// @match        https://recu.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=recu.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469034/Recurbate%20Confirm%2018%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/469034/Recurbate%20Confirm%2018%20Autoclicker.meta.js
// ==/UserScript==



/* defines PopUp Button button */
const pB1=document.getElementsByClassName("btn btn-secondary btn-recu-outline");



setTimeout(init,0.5*1000)

function init()
{
	if (pB1.length > 0)
	{
        try
        {
            pB1[0].click();
        }
        catch(err)
        {
            console.log('caught the error');
            console.log(err.message);
            setTimeout(init,30*1000);
        }
	}
    else
    {
        setTimeout(init,2*1000);
    }
}