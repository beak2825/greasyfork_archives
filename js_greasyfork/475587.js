// ==UserScript==
// @name           SiriusXM Auto Play
// @license        GNU GPLv3
// @description    Auto plays music on page load, checks & clears idle checks then refreshes page.
// @match          http*://player.siriusxm.com/*
// @version        2.2.1
// @grant          GM_getValue
// @grant          GM_setValue
// @namespace null
// @downloadURL https://update.greasyfork.org/scripts/475587/SiriusXM%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/475587/SiriusXM%20Auto%20Play.meta.js
// ==/UserScript==


function main()
{
    /* defines play/pause button */
    let pB1=document.getElementsByClassName("play-pause-btn");
    /* defines play/pause button status */
    let pB2=document.getElementsByClassName('play-pause-btn').item('title').getAttribute('title').toString();
    /* defines page load state */
    let rS1=document.readyState.toString();
    /* defines inactivity timeout keep listening button */
    let pU1=document.getElementsByClassName("modal-button-1");
    /* defines another pointless pop up 'Hope you are enjoying siriusXM' */
    let pU2=document.getElementsByClassName("overlay-button-1");
    /* defines Technical Issue pop up */
    let pU3=document.getElementsByClassName("modal--body modal--body--alert");
    /*defines times an attempt to play has occurred*/
    let rTcnt=0;


    /*console.log('Entry');*/
    setTimeout(() => {
        init1();
    }, 1*1000)

    function init1()
    {
        rS1=document.readyState.toString();
        if (rS1 === 'complete')
        {
            pB2=document.getElementsByClassName('play-pause-btn').item('title').getAttribute('title').toString();
            /*console.log('init1');*/
            cPlay();
        }
        else
        {
            /*console.log('init2');*/
            setTimeout(() => {
                init1();
            }, 5*1000)
        }
    }
    function cPlay()
    {
        pB2=document.getElementsByClassName('play-pause-btn').item('title').getAttribute('title').toString();
        if (pB2 === 'Play')
        {
            try
            {
                /*console.log('cPlay1');*/
                pB1[0].click();
                pCheck();
            }
            catch(err)
            {
                console.log('caught the error');
                console.log(err.message);
                setTimeout(() => {
                    init1();
                }, 30*1000)
            }
        }
        if (pB2 === 'Pause')
        {
            /*console.log('cPlay2');*/
            pCheck();
        }
        else
        {
            /*console.log('cPlay3');*/
            setTimeout(() => {
                init1();
            }, 5*1000)
        }
    }
    function pCheck()
    {
        pB2=document.getElementsByClassName('play-pause-btn').item('title').getAttribute('title').toString();

        if (pU1.length > 0)
        {
            /*console.log('pCheck1');*/
            pU1[0].click();
            wReload();
        }
        if (pU2.length > 0)
        {
            /*console.log('pCheck2');*/
            pU2[0].click();
            wReload();
        }
        if (pU3.length > 0)
        {
            /*console.log('pCheck3');*/
            pU3[0].click();
            wReload();
        }
        if (pB2 === 'Play')
        {
            /*console.log('pCheck4');*/
            rTry();
        }
        else
        {
            /*console.log('pCheck5');*/
            setTimeout(() => {
                pCheck();
            }, 10*1000)
        }
    }
    function rTry()
    {
        rTcnt ++;
        if (rTcnt > 25)
        {
            wReload();
        }
        else
        {
            /*console.log('rTry1');*/
            pB2;
            setTimeout(() => {
                cPlay();
            }, 10*1000)
        }
    }

    function wReload()
    {
       /*console.log('wReload1');*/
        setTimeout(() => {
            location.reload();
        }, 10*1000)
    }
}
/*console.log('OOB');*/
setTimeout(() => {
    main();
}, 3*1000)