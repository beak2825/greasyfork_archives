// ==UserScript==
// @name         Add mail count for "All Mails"
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world...and add the mail count to the title
// @author       Csabinho
// @include      https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34303/Add%20mail%20count%20for%20%22All%20Mails%22.user.js
// @updateURL https://update.greasyfork.org/scripts/34303/Add%20mail%20count%20for%20%22All%20Mails%22.meta.js
// ==/UserScript==

/***********************************
* Use case: if you are using the "All Mails"-view you don't see the overall mail count, this is fixed by this script.
* Additionally if you have pinned the Gmail-Tab you will get a "notification" via the dot in the favicon
***********************************/
function addMailCountToTitle() {
    var mailCountIterator/* = document.evaluate('//*[@id=":wy"]/span/span[2]', document.body, null, XPathResult.ANY_TYPE, null)*/;
    var mailCount/* = mailCountIterator.iterateNext()*/;
    var debug = false;

    const re =/(.*) - (.*)@(.*) - Gmail/;  //If you want to use it for "Gmail for business" at the moment you'll have to change this title regex manually, maybe one day there is gonna be a GM_config frontend
    var m=re.exec(document.title);

    if(m)
    {
        mailCountIterator = document.evaluate('//*[@id=":wy"]/span/span[2]', document.body, null, XPathResult.ANY_TYPE, null);
        mailCount = mailCountIterator.iterateNext();

        if(mailCount)
        {
            document.title = m[0]+" ("+mailCount.innerHTML+")";
            if(debug)console.log(mailCount.innerHTML);
        }
        else
        {
            if(debug)console.log("null, ffs");
        }

        return mailCount !== null;
    }
    else
    {
        if(debug)console.log("wrong title, ffs");
        return false;
    }
}

if((window.location.href) == "https://mail.google.com/mail/u/0/#all") //workaround for not working # in @include
{
    var t=setInterval(addMailCountToTitle,1000);
}