// ==UserScript==
// @name         BetterFark
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  I miss FarkAnalReverteresque and smiths
// @author       LesserEvil
// @match        http://*.fark.com
// @match        http://*.fark.com/*
// @match        http://fark.com/*
// @match        https://*.fark.com/*
// @match        https://*.fark.com
// @match        https://fark.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18314/BetterFark.user.js
// @updateURL https://update.greasyfork.org/scripts/18314/BetterFark.meta.js
// ==/UserScript==

'use strict';

function scrollIntoView(eleID) {
   var e = document.getElementById(eleID);
   if (!!e && e.scrollIntoView) {
       e.scrollIntoView();
   }
}

function appendElementToBody(elem)
{
    document.getElementsByTagName('body')[0].appendChild(elem);
}
function injectStyles(rule) {
    var elem = document.createElement("DIV");
    elem.innerHTML = '<style>' + rule + '</style>';
    appendElementToBody(elem);
}

function removeSponsored()
{
    var sponsorRows = document.getElementsByClassName("spau");
    var i, rowCount=0;
    for( i in sponsorRows )
    {
        if ( typeof(sponsorRows[i]) == "object" )
        {
            if ( sponsorRows[i].className !== null )
            {
                rowCount++;
                // sponsorRows[i].className = "better_comment";
                sponsorRows[i].innerHTML = "<td></td><td></td><td></td><td></td>";
            }
            
        }
    }
    console.log("Removed Sponsored");
    
}

function doRemoveBubbles()
{
    var commentIcons = document.getElementsByClassName("icon_comment");
    var i, bubbleCount=0;
    for( i in commentIcons )
    {
        if ( typeof(commentIcons[i]) == "object" )
        {
            if ( commentIcons[i].className !== null )
            {
                bubbleCount++;
                commentIcons[i].className = "better_comment";
            }
            
        }
    }
    console.log("scrubbing "+bubbleCount+" bubbles away");
    removeSponsored();

}

function displayFarkNew()
{
    var jumpTo = "new";
    
    var hash = window.location.hash;
    
    if ( hash !== '' )
    {
        jumpTo = hash;
        scrollIntoView(jumpTo);
    }
    
    
}

function doBetterFark()
{
    console.log("Making Fark a better place for you and me");
    var newsContainer = document.querySelectorAll('div#newsContainer')[0];
    var mainContainer = document.querySelectorAll('div#container')[0];
    
    if ( newsContainer !== null )
    {
        newsContainer.style.width = '100%';
    }
    else
    {
        console.log("Unable to find div.newsContainer");
    }
    
    try
    {
        if ( mainContainer !== null )
        {
            if ( mainContainer.style !== null )
            {
                mainContainer.style.width = '100%';
            }
        }
        else
        {
            console.log("Unable to find div.container");
        }
    }
    catch(err) {
    }
    injectStyles('a.icon_comment { border-width: 0px; }');
    injectStyles('a.better_comment { font-size: 120%; }');
    doRemoveBubbles();
    doRemoveBubbles();
    doRemoveBubbles();
    doRemoveBubbles();
    setTimeout(displayFarkNew(),100);
    setTimeout(doRemoveBubbles(), 100);
    setTimeout(doRemoveBubbles(), 200);
    setTimeout(doRemoveBubbles(), 2000);
    setTimeout(doRemoveBubbles(), 3000);
    setTimeout(doRemoveBubbles(), 4000);
    setTimeout(displayFarkNew(),1000);
}

// <input type="submit" value="NoSpam" class="searchSubmButtonx" onclick="doRemoveBubbles();">
// div = "searchBar"

function doStuff()
{
    console.log("Cleaning Time");
    removeSponsored();
    doRemoveBubbles();
}


setTimeout(doBetterFark(),100);

    // var searchBar = document.querySelectorAll('div#searchBar')[0];
    var searchBar = document.getElementById("searchBar");
    if ( searchBar !== null )
    {
        var btnDoIt = document.createElement("input");
        btnDoIt.type="button";
        btnDoIt.value="Better Fark";
        btnDoIt.onclick = doRemoveBubbles;
        searchBar.insertBefore(btnDoIt, searchBar.childNodes[0]);
        // searchBar.appendChild(btnDoIt);
    }


