// ==UserScript==
// @name         Youtube
// @namespace    kenkwok
// @version      0.5
// @description  Just a simple script
// @author       Ken Kwok
// @match        *://www.youtube.com/*
// @match        *://hk.youtube.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445566/Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/445566/Youtube.meta.js
// ==/UserScript==

let titleContent = '';

$(document).ready(function(){
    domChangeObserver();
});

function findChannelId(refresh = false)
{
    let currentLocation = window.location.href;
    var matches = currentLocation.match(/\/c\/+(.*)(?!=videos)|\/user\/+(.*)(?!=videos)|\/c\/+(.*)(?!=search)/);
    if(matches != null && !matches[0].includes('videos') && !matches[0].includes('search'))
    {
        var channelIdMeta = $('meta[itemprop="channelId"]');
        if(channelIdMeta.length <= 0 || refresh)
        {
            refreshPage();
        }
        else
        {
            currentLocation = window.location.href;
            let channelId = channelIdMeta[0].content;
            matches = currentLocation.match(/\/channel\//);
            if(matches == null)
            {
                window.location = "http://hk.youtube.com/channel/"+channelId;
            }
        }
    }
}

function refreshPage()
{
    location.reload();
}

function domChangeObserver()
{
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        mutations.map(function(items){
            var localName = items.target.localName;
            if(localName.includes('title'))
            {
                if(titleContent != '' && titleContent != items.target.outerText)
                {
                    findChannelId(true);
                }
                else
                {
                    titleContent = items.target.outerText;
                    findChannelId();
                }
            }
        });
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        subtree: true,
        childList: true
    });
}