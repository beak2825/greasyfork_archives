// ==UserScript==
// @name        Reddit - always link to comments
// @version     2018.05.28.2307
// @description Always link titles to comments section on Reddit, to have consistent behavior.
// @namespace   https://greasyfork.org/en/users/30-opsomh
// @match       https://www.reddit.com/*
// @exclude     https://www.reddit.com/r/*/comments/*
// @match       https://old.reddit.com/*
// @exclude     https://old.reddit.com/r/*/comments/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34556/Reddit%20-%20always%20link%20to%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/34556/Reddit%20-%20always%20link%20to%20comments.meta.js
// ==/UserScript==
/* jshint esversion: 6, browser: true */

let thing = document.querySelectorAll('.thing:not(.self)');
if (thing && thing.length)
{
    let ts = 'a.may-blank:not(.author):not(.reddit-link-title):not(.thumbnail):not(.title):not(.subreddit)';
    let cs = 'a.title, a.reddit-link-title';
    for(let i=0,l=thing.length; i<l; i++)
    {
        /*
        $(ts, '.thing').css('border',  '2px solid red');
        $(cs, '.thing').css('border',  '2px solid green');
        */
        let h = thing[i].querySelector(ts);
        let a = thing[i].querySelector(cs);
      
        if(h && a)
        {
            a.href = h.href;
        }
    }
}