// ==UserScript==
// @name        Facebook Volume
// @namespace   https://www.facebook.com/
// @version     0.1
// @description Video Volume default to 0.10 every 2 seconds
// @match       https://www.facebook.com/*
// @copyright   2012+, Me
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368767/Facebook%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/368767/Facebook%20Volume.meta.js
// ==/UserScript==

var VolumeIDList = [];
var VolumeDefault = 0.30;    // 這裏設定音量大小

setTimeout(FindAndSetVolumes, 2000);

function FindAndSetVolumes() {
var VideoPlayerList = document.getElementsByTagName("video");
var Len = VideoPlayerList.length;
var def_this_run = 0;
for(var i=0;i<Len;i++) {
if( VolumeIDList[VideoPlayerList[i].id] === undefined ) {
VolumeIDList[VideoPlayerList[i].id] = true;
VideoPlayerList[i].volume = VolumeDefault;
def_this_run++;
}
}
var d = new Date();
console.log(d+" - Defaulted: "+def_this_run);

setTimeout(FindAndSetVolumes, 2000);
}