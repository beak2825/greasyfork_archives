// ==UserScript==
// @name       Simple YouTube Channel Subscriptions Filter-IN
// @version    0.1 alpha
// @description You have like 200 channel subscriptions but only really follow a few? put them on the 'matchList' variable and other channels will not be visible on the quick list.
// @match      http://www.youtube.com/*
// @match      http://youtube.com/*
// @match      https://www.youtube.com/*
// @match      https://youtube.com/*
// @license    GPLv3 - http://www.gnu.org/licenses/gpl-3.0.en.html
// @copyright  teken
// @namespace https://greasyfork.org/users/17433
// @downloadURL https://update.greasyfork.org/scripts/12926/Simple%20YouTube%20Channel%20Subscriptions%20Filter-IN.user.js
// @updateURL https://update.greasyfork.org/scripts/12926/Simple%20YouTube%20Channel%20Subscriptions%20Filter-IN.meta.js
// ==/UserScript==

var funcFilter = function() {
    var aElementList = [];
    
    var hideAllChannelsFirst = document.getElementsByClassName("video-thumb  yt-thumb yt-thumb-20");
    for (var iHide = 0; iHide < hideAllChannelsFirst.length; iHide++) {
        hideAllChannelsFirst[iHide].parentElement.parentElement.parentElement.parentElement.style.display = "none";
    }
    
    var bestChannels;
    var matchList = [ //it is CASE SENSITIVE, simply change and add new entries as shown below.
        "Channel Name 1", 
        "chaNNel naME 2",
    ];
    for (var iMatch = 0; iMatch < matchList.length; iMatch++) {
        bestChannels = document.evaluate("//span[contains(text(),'"+matchList[iMatch]+"')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var iFillFinal = 0; iFillFinal < bestChannels.snapshotLength; iFillFinal++) {var temp1 = bestChannels.snapshotItem(iFillFinal);aElementList.push(temp1);}
    }
    
    //console.log("DEBUG2: "+aElementList.length);
    
    for (var iUnhideBest = 0; iUnhideBest < aElementList.length; iUnhideBest++) {
        var temp2 = aElementList[iUnhideBest];
        temp2.parentElement.parentElement.parentElement.parentElement.style.display = ""; //clear the "none" value
        //temp2.style.color = "#FFFF00";
        //temp2.style.backgroundColor = "#0000A0";
    }
};

document.addEventListener("DOMSubtreeModified", function() { funcFilter(); } , false);