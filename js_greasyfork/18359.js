// ==UserScript==
// @name        Play QuickTime MOV in Plugin (for stand-alone .mov)
// @description For Firefox 45+, replaces the HTML5 video player with a plugin for a .mov file opened stand-alone
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @include     http*://*/*.mov
// @include     http*://*/*.mov?*
// @include     http*://*/*.mov#*
// @include     file:///*/*.mov
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18359/Play%20QuickTime%20MOV%20in%20Plugin%20%28for%20stand-alone%20mov%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18359/Play%20QuickTime%20MOV%20in%20Plugin%20%28for%20stand-alone%20mov%29.meta.js
// ==/UserScript==

/*
  To enable this script for local file:/// URLs you need to use about:config to switch the following
  preference from false to true: extensions.greasemonkey.fileIsGreaseable
*/

// Check for video/quicktime plugin support
if (!navigator.mimeTypes['video/quicktime']){
  window.alert("Sorry, no plugin found to play QuickTime video!");
} else {
  // Create object
  var obj = document.createElement('object');
  obj.setAttribute('type', "video/quicktime");
  obj.setAttribute('data', window.location.href);
  obj.setAttribute('autoplay', 'true');
  obj.setAttribute('style', 'width:90%; height:90%; display:block; margin-left:auto; margin-right:auto;');
  // Replace body with object
  document.body.innerHTML = '<p style="color:#3dd">Inserting QuickTime player below...</p>';
  document.body.appendChild(obj);
}
