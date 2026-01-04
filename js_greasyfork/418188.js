// ==UserScript==
// @name         Youtube Playlist Total Duration
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add the total duration of a YouTube Playlist
// @author       Benoit Durand
// @match        *://www.youtube.com/playlist?list=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418188/Youtube%20Playlist%20Total%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/418188/Youtube%20Playlist%20Total%20Duration.meta.js
// ==/UserScript==

function addPlaylistDuration() {

  var el = document.getElementsByClassName("style-scope ytd-thumbnail-overlay-time-status-renderer");
  var nb_video = document.getElementById("stats").getElementsByClassName("style-scope yt-formatted-string")[0].innerHTML;

  if (el.length == 2*nb_video) {

    var s = 0;
    var eq_sec = [3600, 60, 1];

    for (var i = 0; i < el.length; i++) {

      if (el[i].tagName == "SPAN") {

        var time = el[i].innerHTML.replace(/\n/gi, "").split(":");
        var selec = eq_sec.slice(-time.length);

        for (var j = 0; j < time.length; j++){
            s = s + Number(time[j]) * selec[j];
        }
      }
    }

    var nb_hour = Math.trunc(s / 3600);
    s = s%3600;
    var nb_min = Math.trunc(s / 60);
    s = s%60;
    var nb_sec = s;

    var final_string = "\n Total Duration : " + nb_hour + ":" + nb_min.toString().padStart(2, '0') + ":" + nb_sec.toString().padStart(2, '0') ;

    document.getElementById("description").appendChild(document.createTextNode(final_string));

  } 

}


var targetNode = document.querySelectorAll('div#overlays.style-scope.ytd-thumbnail')[0];
var config = {childList: true};

var callback = function(mutationsList){
     mutationsList.forEach(function(mutation) {
         addPlaylistDuration();
         observer.disconnect();
    });
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);
