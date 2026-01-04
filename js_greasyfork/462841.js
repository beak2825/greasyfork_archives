// ==UserScript==
// @name           Misc 18+ Auto Confirm
// @license        GNU GPLv3
// @description    Auto clicks 'I'm 18+' dialogue at landing.
// @match          https://www.pornoxo.com/*
// @match          https://www.fetishpapa.com/*
// @match          https://www.boyfriendtv.com/*
// @version        1.1
// @grant          GM_getValue
// @grant          GM_setValue
// @namespace
// @namespace https://greasyfork.org/users/9946
// @downloadURL https://update.greasyfork.org/scripts/462841/Misc%2018%2B%20Auto%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/462841/Misc%2018%2B%20Auto%20Confirm.meta.js
// ==/UserScript==


/* defines PopUp Button button */
const pB1=document.getElementsByClassName("swal2-confirm");



setTimeout(init,0.2*1000)

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
            setTimeout(init,1000);
        }
	}
    else
    {
        setTimeout(init,2*1000);
    }
}