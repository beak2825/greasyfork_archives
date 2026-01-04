// ==UserScript==
// @name         Beurrem Bove!
// @include      https://mail.google.com/mail/u/0/
// @include      https://www.facebook.com/*
// @include      https://twitter.com/*
// @include      https://www.bornem.be/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @namespace    http://tampermonkey.net/
// @description  Keert jouw maag, trots toevend in een fiere Bornemmenaar, zich ook telkens bij het zien van de verwerpelijke hashtag #Beurm en afgeleiden? Dan is dit je kans om er iets aan te doen. Beurrem Bove!
// @author       PiPauwels
// @version 0.0.1.20200418093732
// @downloadURL https://update.greasyfork.org/scripts/401308/Beurrem%20Bove%21.user.js
// @updateURL https://update.greasyfork.org/scripts/401308/Beurrem%20Bove%21.meta.js
// ==/UserScript==

function replace(dom)
{
    if ((website == GOOGLE) || (website == FACEBOOK) || (website == BORNEM) || (website == TWITTER))
    {
        var htmlOrig = dom.innerHTML;
        var htmlNew = dom.innerHTML;
        htmlNew = htmlNew.replace(/Beurmen(eir|eer|aar)/gi, 'Beurremeneir');
        htmlNew = htmlNew.replace(/Bornemn(eir|eer|aar)/gi, 'Bornemmenaar');
        htmlNew = htmlNew.replace(/Beurm/gi, 'Beurrem');
        htmlNew = htmlNew.replace(/bornem/g, 'Bornem');

        if (htmlOrig != htmlNew)
        {
            dom.innerHTML = htmlNew;
            replacedFlag = true;
        }
    }
}
const GOOGLE = 0;
const FACEBOOK = 1;
const TWITTER = 2;
const BORNEM = 3;
let website = -1;
let selectors = [];
let replacedFlag = false;
const url = window.location.href;
if (url.indexOf('mail.google.com') != -1) website = GOOGLE;
if (url.indexOf('facebook.com') != -1) website = FACEBOOK;
if (url.indexOf('twitter.com') != -1) website = TWITTER;
if (url.indexOf('bornem.be') != -1) website = BORNEM;
setWebsite();

function parse()
{
    let dom = '';
    selectors.forEach(selector =>
    {
        dom = document.querySelectorAll(selector);
        for (let i = 0; i < dom.length; i++) replace(dom[i]);
    });
}

function setWebsite()
{
    switch (website)
    {
        case GOOGLE:
            selectors.push('div[class="gs"]');
            selectors.push('.y6 > span > span');
            selectors.push('div.nH > .ha > h2');
            break;
        case FACEBOOK:
            selectors.push('.fb_content');
            selectors.push('.navigationFocus');
            break;
        case TWITTER:
            selectors.push('#react-root > div > div > div > main > div > div > div > div > div section');
            selectors.push('#react-root > div > div > div > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div');
            break;
        case BORNEM:
            selectors.push('.content');
            selectors.push('.heading');
            selectors.push('.row');
            break;
    }
}

(function()
{
    const send = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function()
    {
        if (website == GOOGLE) this.addEventListener('load', parse);
        return send.apply(this, arguments);
    }
})()

function waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector)
{
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else targetNodes = $(iframeSelector).contents().find (selectorTxt);
    if (targetNodes && targetNodes.length > 0)
    {
        btargetsFound = true;
        targetNodes.each ( function ()
        {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;
            if (!alreadyFound)
            {
                var cancelFound = actionFunction (jThis);
                if (cancelFound) btargetsFound = false;
                else jThis.data ('alreadyFound', true);
            }
        } );
    }
    else
    {
        btargetsFound = false;
    }

    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    if (btargetsFound && bWaitOnce && timeControl)
    {
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else
    {
        if (!timeControl)
        {
            timeControl = setInterval (function()
            {
                 waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector);
            }, 1000);
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

function next() {waitForKeyElements ('img', parse);}
if ((website == FACEBOOK) || (website == BORNEM)) window.addEventListener('load', parse);
if ((website == TWITTER) && (replacedFlag == false)) waitForKeyElements ('.r-wgs6xk', next);