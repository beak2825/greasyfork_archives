// ==UserScript==
// @name        Unreal Engine Wiki Link Fixer
// @description Changes links from wiki.unrealengine.com/ to ue4community.wiki/Legacy/
// @version     1
// @author      Dominic Canare
// @include     *
// @namespace   https://greenlightgo.org/gmscripts
// @downloadURL https://update.greasyfork.org/scripts/404509/Unreal%20Engine%20Wiki%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/404509/Unreal%20Engine%20Wiki%20Link%20Fixer.meta.js
// ==/UserScript==

var oldURLs = ['http://wiki.unrealengine.com/', 'https://wiki.unrealengine.com/'];
var newURL = 'https://www.ue4community.wiki/Legacy/';

var anchors = document.getElementsByTagName('a');
for(var i=0; i<anchors.length; i++){
  var anchor = anchors[i];
  for(var j=0; j<oldURLs.length; j++){
    var oldURL = oldURLs[j];
  	if(anchor.href.startsWith(oldURL)){
	    anchor.href = newURL + anchor.href.substring(oldURL.length);
	  }
  }
}
