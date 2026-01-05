// ==UserScript==
// @name        Amazon Instant Next Episode Button
// @namespace   greasyfork.org
// @description Provides links to the previous and next episodes just below the video area to easily load the next episode's page when watching a TV show on Amazon Instant View. A Greasemonkey script by Stephen Herr.
// @include     *www.amazon.com/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1815/Amazon%20Instant%20Next%20Episode%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/1815/Amazon%20Instant%20Next%20Episode%20Button.meta.js
// ==/UserScript==

var episodeList = false;
var divs = document.getElementsByTagName('div');
for (var i = 0; i < divs.length; i++) {
    if (divs[i].className.indexOf('episode-list') > -1) {
        episodeList = divs[i];
        break;
    }
}

// if we're watching a show
if (episodeList) {
    // find the next episode element
    var nextEpisode = false;
    var prevEpisode = false;
    var prevPrevEpisode = false;
    var episodes = episodeList.getElementsByTagName('li');
    for (var i = 0; i < episodes.length; i++) {
        var episode = episodes[i];
        if (prevEpisode && prevEpisode.className.indexOf('selected-episode') > -1) {
            // prevEpisode is actually current, so set the two variables we care about
            nextEpisode = episode;
            prevEpisode = prevPrevEpisode;
            break;
        } 
        prevPrevEpisode = prevEpisode;
        prevEpisode = episode;
    }
    
    var parent = episodeList.parentNode;
    var containerDiv = document.createElement('div');
    containerDiv.setAttribute('class', 'aiv-container-limited');
    if (prevEpisode) {
        var prevA = prevEpisode.getElementsByTagName('a')[0];
        var prevHref = prevA.getAttribute('href');
        var prevTitle = prevEpisode.getElementsByClassName('episode-title')[0].innerHTML.trim();
        var prevH2 = document.createElement('h2');
        prevH2.setAttribute('style', 'float:left');
        var prevLink = document.createElement('a');
        prevLink.setAttribute('href', prevHref);
        var prevText = document.createTextNode('<< ' + prevTitle);
        prevLink.appendChild(prevText);
        prevH2.appendChild(prevLink);
        containerDiv.appendChild(prevH2);
    }
    if (nextEpisode) {
        var nextA = nextEpisode.getElementsByTagName('a')[0];
        var nextHref = nextA.getAttribute('href');
        var nextTitle = nextA.getElementsByClassName('episode-title')[0].innerHTML.trim();
        var nextH2 = document.createElement('h2');
        nextH2.setAttribute('style', 'float:right');
        var nextLink = document.createElement('a');
        nextLink.setAttribute('href', nextHref);
        var nextText = document.createTextNode(nextTitle + ' >>');
        nextLink.appendChild(nextText);
        nextH2.appendChild(nextLink);
        containerDiv.appendChild(nextH2);
    }
    var wrapperDiv = document.createElement('div');
    wrapperDiv.setAttribute('class', 'aiv-wrapper');
    wrapperDiv.appendChild(containerDiv);
    parent.parentNode.insertBefore(wrapperDiv, parent);
}