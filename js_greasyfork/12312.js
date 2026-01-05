// ==UserScript==
// @name        isnichwahr HTML5 player
// @namespace   nick.FirebirdDE
// @description Use HTML5 JW/youtube player instead of Flash ones; works with new design as of September 2015
// @include     http://www.isnichwahr.de/r*.html
// @version     1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/12312/isnichwahr%20HTML5%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/12312/isnichwahr%20HTML5%20player.meta.js
// ==/UserScript==

var jwplayer_match          = /^(?:\r?\n|\s)*jwplayer\(/;
var jwplayer_primary_match  = /primary:\s+'flash'/;
var youtube_match           = /^(?:\r?\n|\s)*SFYouTubePlayer\.embedPlayer\("([^"]+)",\s+([0-9]+),\s+([0-9]+),\s+"([^"]+)"/;

function node_replace(e, new_code) {
  // Replace the script pointed to by beforescriptexecute event e with the code
  // from new_code
  e.preventDefault();
  var new_script = document.createElement("script");
  new_script.textContent = new_code;
  e.target.parentNode.insertBefore(new_script, e.target);  
  e.target.parentNode.removeChild(e.target);
  e.stopProgagation();
}

window.addEventListener("beforescriptexecute", function(e) {
  // jwPlayer
  if(e.target.textContent.match(jwplayer_match) && e.target.textContent.match(jwplayer_primary_match)) {
    var new_code = e.target.textContent.replace(jwplayer_primary_match, "primary: 'html5'");
    node_replace(e, new_code);   
  }
  
  // youtube
  var yt_match = e.target.textContent.match(youtube_match);
  if(yt_match) {
    var new_code = "document.getElementById('" + yt_match[4] + "').innerHTML = '<iframe allowfullscreen width=\"" + yt_match[2] +
      "\" height=\"" + yt_match[3] + "\" frameborder=0 src=\"http://www.youtube.com/embed/" + yt_match[1] + "\"></iframe>';";
    console.log(new_code);
    node_replace(e, new_code);
  }
}, true);