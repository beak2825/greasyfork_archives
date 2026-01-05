// ==UserScript==
// @name        Youtube Video Ratings TEST
// @description Shows the rating as well as the ratio of likes per views (Like Strength) below each video's thumbnail.
// @version     1.0.15
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @namespace http://userscripts.org/scripts/show/154285
// @downloadURL https://update.greasyfork.org/scripts/468/Youtube%20Video%20Ratings%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/468/Youtube%20Video%20Ratings%20TEST.meta.js
// ==/UserScript==
GM_addStyle(".video-actions, .video-time {bottom:6px !important;}");

var lastScanTime = new Date().getTime();;

scanVideos();
document.onload = function() {
    scanVideos();
};
window.onscroll = function() {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastScanTime
    if (timeDiff >= 1000) {
        scanVideos();
    }
};

function scanVideos() {
    var videoList = document.querySelectorAll('a.ux-thumb-wrap[href^="/watch"] > span.video-thumb:not(.processed), a.related-video[href^="/watch"] > span:first-child:not(.processed), a.playlist-video[href^="/watch"] > span.yt-thumb-64:first-child:not(.processed)');
    for ( var i = 0; i < videoList.length; i++ ) {
        var videoId = videoList[i].parentNode.getAttribute("href").replace(/.*[v|s]=([^&%]*).*/, "$1");
        getGdata(videoList[i],videoId);
    }
    lastScanTime = new Date().getTime();
};

function bluePurple(views, likes) {
    if (views < 2000) {
        var viewLikeRatio2k = Math.round( (views + views * ((3000-views)/2000)) / (likes) );
        if (views < 255) {
            var viewLikeRatio = Math.round( viewLikeRatio2k / (views/255) );
        } 
        else {
            var viewLikeRatio = viewLikeRatio2k;
        }
    }
    else {
        var viewLikeRatio = Math.round( (views+7000) / 3 / (likes) );
    }
    if ((viewLikeRatio < 1) || (viewLikeRatio > 255)) {
        return 0;
    }
    var likeStrength = ((255-viewLikeRatio)/2.55);
    var likeStrengthLog = Math.round(Math.pow(likeStrength, 3)) / 10000;
    return likeStrengthLog;
}

function makeBar(node, daysAgo, views, likes, dislikes) {
    var barMsg = ""
    var totalVotes = likes + dislikes;
    if (dislikes > 0) {
        var redBar = document.createElement('div');
        redBar.setAttribute("style","position:absolute; bottom:0px; right:0px; width:100%; height:4px; background-color:#c00;");
        node.appendChild(redBar);
    }
    if (((views > 300) && (views < 320) && (daysAgo <= 0.5)) || (totalVotes > views)) {
        if (likes > 0) {
            var pauseBar = document.createElement('div');
            pauseBar.setAttribute("style","position:absolute; bottom:0px; background-color:#bbb; border-top: 4px dotted #0b2; height:0px; width:"+ (100 * likes / totalVotes) +"%;");
            node.appendChild(pauseBar);
        }
        barMsg = "  View Count Incorrect";
    }
    else {
        likeStrengthLog = bluePurple(views, likes);
        if (likes > 0) {
            var middleBar = document.createElement('div');
            middleBar.setAttribute("style","position:absolute; bottom:0px; height:4px;");
            if ((100 * likes / totalVotes) >= likeStrengthLog) {
                middleBar.style.backgroundColor = "#0b2";
                middleBar.style.width = (100 * likes / totalVotes)+"%";
            }
            else {
                middleBar.style.backgroundColor = "#84d";
                middleBar.style.width = likeStrengthLog+"%";
            } 
            node.appendChild(middleBar);
        }
        if (likeStrengthLog > 0) {
            var blueBar = document.createElement('div');
            blueBar.setAttribute("style","position:absolute; bottom:0px; height:4px; background-color:#04d;");
            if ((100 * likes / totalVotes) > likeStrengthLog) {
                blueBar.style.width = likeStrengthLog+"%";
            }
            else {
                blueBar.style.width = ((100 * likes / totalVotes))+"%";
            }
            barMsg = "  Power: "+ Math.round(likeStrengthLog*100)/100 +"%";
            node.appendChild(blueBar);
        }
    }
    node.setAttribute("title","Likes: "+ likes +"  Dislikes: "+ dislikes + barMsg);
    node.classList.add('processed');
}

function getGdata(node,id) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: "http://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=json&fields=yt:rating,yt:statistics,published",
        onload: function(response) {
            if (response.status == 200) {
                var rsp = eval( '(' + response.responseText + ')' );
                if (rsp && rsp.entry && rsp.entry.published && rsp.entry.yt$statistics && rsp.entry.yt$rating) {
                    var daysAgo = (lastScanTime - new Date(rsp.entry.published.$t).getTime())/1000/60/60/24;
                    var views = parseInt(rsp.entry.yt$statistics.viewCount);
                    var likes = parseInt(rsp.entry.yt$rating.numLikes);
                    var dislikes = parseInt(rsp.entry.yt$rating.numDislikes);
                    makeBar(node, daysAgo, views, likes, dislikes);
                }
                else {
                    node.classList.add('processed');
                }
            }
        }
    });
}