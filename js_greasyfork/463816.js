// ==UserScript==
// @name         Youtube: Sort Subscriptions
// @description  Puts youtube subscriptions with new videos first in the list
// @version      1.0.2
// @license      MIT
// @include      *youtube.com*
// @grant        none
// @namespace Squornshellous Beta
// @downloadURL https://update.greasyfork.org/scripts/463816/Youtube%3A%20Sort%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/463816/Youtube%3A%20Sort%20Subscriptions.meta.js
// ==/UserScript==

//Remember to update the uploaded version!

function sortSubs() {
    if (!document.hidden) {
        var moreChannelsButton=document.querySelector("#expander-item");
        if (moreChannelsButton) moreChannelsButton.click();

        var channelList=document.querySelector("#items:has(#expander-item):not(.sorted)");
        var channelsRaw=document.querySelectorAll("#items:has(#expander-item) ytd-guide-entry-renderer");
        if (channelsRaw) if (channelsRaw.length>10) {
            var channels=[];
            for (var i=0;i<channelsRaw.length;i++) {
                var text=channelsRaw[i].innerText;
                if (text.search(/Browse channels|Show[ 0-9]* more|Show less|All subscriptions/)==-1) channels.push([channelsRaw[i].innerText,channelsRaw[i]]);
                else channelsRaw[i].remove();
            }
            channels=channels.sort(function(a,b) {
                var aEnd=a[1].getAttribute("line-end-style");
                var bEnd=b[1].getAttribute("line-end-style");
                if (aEnd==bEnd) return a[0].localeCompare(b[0]);
                if (aEnd=="dot") return -1;
                return 1;
            });
            channels.forEach(function(channel) {channelList.appendChild(channel[1])});
            channelList.classList.add("sorted");
        }

        var link=document.querySelector("a#logo:not([href='https://www.youtube.com'])");
        if (link) link.href="https://www.youtube.com";

        if (window.location.href.search(/https\:\/\/www.youtube.com\/\?bp=/)!=-1) window.location.assign("https://www.youtube.com/");
        else if (window.location.href.search("/shorts/")!=-1) window.location=window.location.href.replace("/shorts/","/watch?v=");
    }
}

var yt=setInterval(function() {sortSubs();},1000);