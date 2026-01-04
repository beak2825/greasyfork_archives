// ==UserScript==
// @name           xHamster 18+ Auto Confirm
// @license        GNU GPLv3
// @description    Auto clicks 'I'm 18+' dialogue at landing.
// @match          http*://*.xhamster.com/*
// @version        1.2
// @grant          GM_getValue
// @grant          GM_setValue
// @namespace      https://greasyfork.org/en/scripts/475589-xhamster-18-auto-confirm
// @downloadURL https://update.greasyfork.org/scripts/475589/xHamster%2018%2B%20Auto%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/475589/xHamster%2018%2B%20Auto%20Confirm.meta.js
// ==/UserScript==


/* defines PopUp Button button */
const pB1=document.getElementsByClassName("xh-icon cross dialog__close-icon dlg-close-icon hover to-red white");


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
