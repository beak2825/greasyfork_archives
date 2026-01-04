// ==UserScript==
// @name         KissLink
// @namespace    http://pyroglyph.co.uk/
// @version      1.2
// @description  Gets direct video links from Kissanime.ru.
// @author       Pyroglyph
// @match        *kissanime.ru/Anime/*
// @match        *openload.co/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31270/KissLink.user.js
// @updateURL https://update.greasyfork.org/scripts/31270/KissLink.meta.js
// ==/UserScript==

window.onload = function()
{
    'use strict';

    // If we are on a KissAnime page,
    if (~window.location.href.indexOf('kissanime.ru'))
    {
        cleanup();

        // Get the currently selected Kiss server from the URL
        var currentServer = new URL(window.location.href).searchParams.get("s");
        // If the current server is not OpenLoad,
        if (currentServer !== null && currentServer !== 'openload')
        {
            // remove the server parameter and reload the page for the OpenLoad server.
            window.location = removeURLParameter(window.location, 's') + '&s=openload';
        }

        // Create the 'Get Link' button and add it to the page.
        addButton();
    }

    // If we are on the OpenLoad embed page,
    if (~window.location.href.indexOf('openload.co/embed'))
    {
        // click() the page so videojs loads the direct url,
        document.elementFromPoint(0, 0).click();
        // and alert() the user of the direct link.
        alert('http://www.openload.co' + document.getElementById('olvideo_html5_api').getAttribute('src'));
    }
};

// For some reason the left and right floating divs (the ones that hold adverts) will unhide
//  and move themselves below the video area creating a large blank space at the bottom
//  of the page. This line fixes that problem.
window.onresize = function() { cleanup(); };

function cleanup()
{
    // Remove all clear2s
    var clears = document.getElementsByClassName('clear2');
    for (var i = 0; i < clears.length; i++)
    {
        clears[i].style = 'display: none;';
    }

    // Remove all ads (I think)
    for (var i = 0; i <= 10; i++)
    {
        var elem = document.getElementById('adsIfrme' + i);
        if (elem !== null) elem.style = 'display: none;';
    }

    // Remove weird Firefox advert
    var barChildren = document.getElementsByClassName('barContent')[0].getElementsByTagName('div')[0].getElementsByTagName('div');
    for (var i = 0; i < barChildren.length; i++)
    {
        var style = window.getComputedStyle(barChildren[i]).getPropertyValue('font-weight');
        if (style == 'bold') barChildren[i].style = 'display: none;';
    }

    // Remove useless UI elements
    document.getElementById('divFloatLeft').style = 'display: none;';
    document.getElementById('divFloatRight').style = 'display: none;';
    document.getElementById('divDownload').style = 'display: none;';
    document.getElementById('divFileName').style = 'display: none;';
    document.getElementById('btnShowComments').parentNode.style = 'display: none;';

    document.getElementById('footer').style = 'display: none;';

    // Remove scrollbars
    document.style = document.style + 'overflow: hidden;';
}

function addButton()
{
    var btn = document.createElement("a");
    var node = document.createTextNode("Get Link");
    btn.onclick = getLink;
    btn.style.cursor = 'pointer';
    btn.appendChild(node);
    document.getElementById('divQuality').parentNode.appendChild(btn);
}

function getLink()
{
    window.location = document.getElementById('divContentVideo').firstChild.getAttribute('src');
}

// I swear I totally didn't just kang (and slightly improve) this from http://stackoverflow.com/questions/1634748
function removeURLParameter(url, parameter)
{
    //prefer to use l.search if you have a location/link object
    var urlparts = (url + '').split('?');
    if (urlparts.length >= 2)
    {
        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;)
        {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1)
            {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
        return url;
    }
    else return url;
}