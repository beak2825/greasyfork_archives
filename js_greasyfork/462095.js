// ==UserScript==
// @name           PornTubes 18+ Auto Confirm
// @license        GNU GPLv3
// @description    Auto clicks 'I'm 18+' dialogue at every page.
// @match          https://www.tubebdsm.com/*
// @match          https://www.forhertube.com/*
// @match          https://www.ixxx.com/*
// @match          https://www.porzo.com/*
// @match          https://www.gaymaletube.com/*
// @match          https://www.gotporn.com/*
// @match          https://www.tgtube.com/*
// @match          https://www.fucd.com/*
// @match          https://www.ghettotube.com/*
// @match          https://www.ebonygalore.com/*
// @match          https://www.assoass.com/*
// @match          https://www.porntv.com/*
// @match          https://www.lesbianpornvideos.com/*
// @match          https://www.melonstube.com/*
// @match          https://www.tubepornstars.com/*
// @match          https://www.tubeporn.com/*
// @match          https://www.tubegalore.com/*
// @match          https://www.toroporno.com/*
// @match          https://www.tiava.com/*
// @match          https://www.stocking-tease.com/*
// @match          https://www.sambaporno.com/*
// @match          https://www.qorno.com/*
// @match          https://www.pornhd.com/*
// @match          https://www.metaporn.com/*
// @match          https://www.maturetube.com/*
// @match          https://www.lupoporno.com/*
// @match          https://www.lobstertube.com/*
// @match          https://www.homemadegalore.com/*
// @match          https://www.hdporzo.com/*
// @match          https://www.findtubes.com/*
// @match          https://www.el-ladies.com/*
// @match          https://www.dinotube.com/*
// @match          https://www.cartoonpornvideos.com/*
// @match          https://www.analgalore.com/*
// @match          https://www.asiangalore.com/*
// @version        1.0.2
// @grant          GM_getValue
// @grant          GM_setValue
// @namespace
// @namespace https://greasyfork.org/users/9946
// @downloadURL https://update.greasyfork.org/scripts/462095/PornTubes%2018%2B%20Auto%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/462095/PornTubes%2018%2B%20Auto%20Confirm.meta.js
// ==/UserScript==


/* defines PopUp Button button */


const pB1=document.getElementsByClassName("bg-green-700");

setTimeout(init,4000)

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
        setTimeout(init,100);
    }
}