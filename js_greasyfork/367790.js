// ==UserScript==
// @author	Eric Black
// @name VegTV JWPlayer Easy URLs
// @description Ready-to-share URLs
// @version	1.01
// @namespace http://greasyfork.org
// @include *://dashboard.jwplayer.com*
// @downloadURL https://update.greasyfork.org/scripts/367790/VegTV%20JWPlayer%20Easy%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/367790/VegTV%20JWPlayer%20Easy%20URLs.meta.js
// ==/UserScript==

function init() {
    if(window.location.href.indexOf("content/detail") > -1) {
        var test = document.getElementsByClassName("details-left-container")[0];
        if (typeof(test) != 'undefined' && test != null)
        {
            addCode();
        }
        else
        {
            setTimeout(function() { init(); }, 1000);
        }
    }
}

function addCode()
{
      var video_id = document.getElementsByClassName("summary")[0].getElementsByClassName("summary-row")[0].getElementsByTagName("input")[0].value;
       if(video_id!=null)
       {
           var insert_location = document.getElementsByClassName("details-left-container")[0].getElementsByTagName("h5")[0];
           var child_data = document.createElement("div");
           var vegtv_link = "http://vegtv.com/?media=" + video_id;
           child_data.className = "summary-row";
           child_data.innerHTML = '<input type="text" class="value form-control click-to-copy" ng-value="video.key" jw-click-to-select="" readonly="" value="' + vegtv_link +  '" style="background-repeat: repeat; background-image: none; background-position: 0% 0%;">';



           var child_data2 = document.createElement("div");
           child_data2.className = "summary-row";
           child_data2.innerHTML = '<a href="' + vegtv_link + '" target="_blank"><button class="embed button button-primary button-lg" type="button">VEGTV LINK »</button></a><br><br>';


           insertAfter(child_data2,insert_location);
           insertAfter(child_data,insert_location);
       }
       else
       {
           setTimeout(function() { init(); }, 1000);
       }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const pushUrl = (href) => {
  history.pushState({}, '', href);
  window.dispatchEvent(new Event('popstate'));
};

window.addEventListener('popstate', init, false);

