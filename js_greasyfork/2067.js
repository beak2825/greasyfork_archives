// ==UserScript==
// @name        Youtube Related Video Ratings
// @description Shows ratings of related videos on Youtube, and changes ratings bar back to green/red.
// @namespace   https://greasyfork.org/users/2329-killerbadger
// @version     0.1.2
// @match       http://www.youtube.com/*
// @match       https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/2067/Youtube%20Related%20Video%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/2067/Youtube%20Related%20Video%20Ratings.meta.js
// ==/UserScript==

/* Borrowed/adapted code from YouTube Link Cleaner by tfr
 * "Dieses Skript steht unter CC0 / This script is licensed under CC0:
 * http://creativecommons.org/publicdomain/zero/1.0/deed.de
 * http://creativecommons.org/publicdomain/zero/1.0/deed.en" */
LinkCount = 0;
function ChangeLinks() {
  if(LinkCount != window.document.links.length) {
    for (var i = 0; i < window.document.links.length; i++) {
      /* Do not use redirect pages, disable AJAX on links */
      window.document.links[i].className = window.document.links[i].className.replace(/(yt-uix-redirect-link|spf-link)/g, "");
    }
    LinkCount = window.document.links.length;
  }
}
ChangeLinks();
window.setInterval(ChangeLinks, 1000);
/* End of borrowed/adapted code */

GM_addStyle(".video-time { margin-bottom: 4px;} .yt-uix-simple-thumb-related > img {margin-bottom: -27px !important;} a.related-video { padding-bottom: 11px !important; margin-bottom: -11px !important; } .lsLines { opacity: 0; } .lsLines:hover { opacity: .6; } .channels-browse-content-grid .channels-content-item { height: 167px } .yt-thumb-default-288 + span + button + div > .lsLines { background-size: 288px 4px; } .yt-thumb-default-194 + span + button + div > .lsLines { background-size: 194px 4px; } .yt-thumb-default-185 + span + button + div > .lsLines, .yt-thumb-feed-185 + span + span + div .lsLines { background-size: 185px 4px; } .yt-thumb-default-160 + img + span + div > .lsLines { background-size: 160px 4px; } .yt-thumb-default-40 + span + span + span + span + div .lsLines { background-size: 157px 4px; } .yt-thumb-default-106 + span + button + div > .lsLines { background-size: 106px 4px; } .yt-thumb-default-138 + span + button + div > .lsLines { background-size: 138px 4px; } .yt-thumb-default-120 + span + button + div > .lsLines, .yt-thumb-default-224 + span + div > .lsLines { background-size: 120px 4px; } .yt-thumb-default-76 + span + span + span + div .lsLines { background-size: 76px 4px; } .yt-thumb-default-64 + div > .lsLines { background-size: 64px 4px; } .feed-item-thumb.watched .ux-thumb-wrap {opacity: 1 !important;} .ux-thumb {background-color: white !important;} .feed-item-thumb.watched .ux-thumb-wrap img {opacity: .4 !important;} .feed-item-thumb.watched .ux-thumb-wrap img:hover {opacity: 1 !important;} .feed-thumb-watched {opacity: .5 !important;} .video-response .video-extras-sparkbarks {width: 26% !important;} .video-extras-sparkbar-likes {border-right: 0px !important}");

if (document.getElementById("watch7-views-info")) {
document.getElementsByClassName("video-extras-sparkbar-likes")[0].style.background = "#0b2";
document.getElementsByClassName("video-extras-sparkbar-dislikes")[0].style.background = "#C00";
}
var loaded = {};
var containerName="yt-thumb-default";
var containerName2="video-time";
loaded[""] = true;
window.addEventListener (
    'scroll',
    function (e) {
      iterateClips(document.getElementsByClassName(containerName));
      iterateClips(document.getElementsByClassName(containerName2));
    },
    false);
var wm = document.getElementById("watch-more-related");
if (wm) {
  // On "Load More Suggestions" button click
  wm.addEventListener (
    'DOMNodeInserted',
    function (e) {
      iterateClips(e.target.getElementsByClassName(containerName));
      iterateClips(e.target.getElementsByClassName(containerName2));
    },
    false);
}

// starts here 
iterateClips(document.getElementsByClassName(containerName));
iterateClips(document.getElementsByClassName(containerName2));

function iterateClips(clips)
{
  if (clips)
  {
    for (var i=0; i<clips.length; ++i) 
      if (isVisible(clips[i])) 
        requestRating(clips[i]);
  } 
}

function requestRating(box)
{ 
  var id = getVideoId(box);

  if (loaded[id])
    return;

  loaded[id] = true;
  setTimeout( function() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: "http://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=json&fields=yt:rating",
      onload: function(response) 
      {
        if (response.status == 200) 
        {
          var rsp = eval( '(' + response.responseText + ')' );
          if (rsp && rsp.entry && rsp.entry.yt$rating)
            attachBar(box, parseInt(rsp.entry.yt$rating.numLikes),
                           parseInt(rsp.entry.yt$rating.numDislikes));
        } 
        else
          delete loaded[id]; // give it a chance to reload while scrolling 
      }
    });
  }, 0);
}

function getVideoId(box)
{
  var anchor=box.parentNode.parentNode;
  var isAnchorFound = 2;
  while (anchor && anchor.tagName != undefined) 
  {
    if (anchor.tagName.toLowerCase()=="a")
      break;
    anchor = anchor.parentNode; 
    --isAnchorFound;
    if (0==isAnchorFound)
      break;
  }
  if ( isAnchorFound>0 )
  {
    var href = anchor.getAttribute("href");
    if (href)
    {
      var id = href.replace(/.*v=([^&]*).*/, "$1");
      if (id.length<href.length) 
        return id;
    }
  }
  return "";
}
function attachBar(videoThumb, likes, dislikes) 
{
  var total = likes + dislikes;

  if (total > 0)
  {
    var ratingDiv = document.createElement("div");
    ratingDiv.setAttribute("class", "video-extras-sparkbarks");
    ratingDiv.setAttribute("style", "position: relative; top: 1px;" );
    ratingDiv.setAttribute("title",  likes + " likes, " + dislikes + " dislikes");

    var likesDiv = document.createElement("div");
    likesDiv.setAttribute("class", "video-extras-sparkbar-likes"); 
    likesDiv.setAttribute("style", "height: 4px; width: "+(100*likes)/total+"%; background: #0b2;"); 

    var dislikesDiv = document.createElement("div");
    dislikesDiv.setAttribute("class", "video-extras-sparkbar-dislikes"); 
    dislikesDiv.setAttribute("style", "height: 4px; width: "+(100*dislikes)/total+"%;"+"background: #C00;"); 

    ratingDiv.appendChild(likesDiv);
    ratingDiv.appendChild(dislikesDiv);
    videoThumb.parentNode.parentNode.appendChild(ratingDiv);
    videoThumb.parentNode.appendChild(ratingDiv);
      //videoThumb.appendChild(ratingDiv);

    // fixing time element position to be inside of the thumb image
    var spans = videoThumb.parentNode.parentNode.getElementsByTagName("span");
    for (var i=0; i<spans.length; ++i )
      if (spans[i].getAttribute("class")=="video-time")
      {
        spans[i].style.bottom = "6px";
        break;
      }
  }
}

function isVisible ( el )
{
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }
  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}
