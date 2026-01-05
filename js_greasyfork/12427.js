// ==UserScript==
// @name        Twitter HTML5 Video Error to Link
// @description Replaces error message with a link to load the media in a new tab where hopefully a plugin will play it
// @namespace   JeffersonScher
// @include     https://amp.twimg.com/*
// @include     https://video.twimg.com/*
// @include     https://twitter.com/*
// @include     https://mobile.twitter.com/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12427/Twitter%20HTML5%20Video%20Error%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/12427/Twitter%20HTML5%20Video%20Error%20to%20Link.meta.js
// ==/UserScript==

var t_errcheck;
t_errcheck = window.setInterval(function (){errCheck()}, 500);
function errCheck(){
  var errdiv = document.querySelector('div.error-msg');
  if (errdiv){
    if (errdiv.textContent.indexOf("does not support video playback") > -1){
      window.clearInterval(t_errcheck);
      gotoLink();
    }
  }
}
var t_mp4check;
t_mp4check = window.setInterval(function (){mp4Check()}, 500);
function mp4Check(){
  var mp4v = document.querySelector('video[src*=".mp4"]');
  if (mp4v){
    window.clearInterval(t_mp4check);
    gotoLink();
  }
}
function gotoLink(){
  var vsrc = document.querySelector('video source');
  if (!vsrc) vsrc = document.querySelector('video[src]');
  if (vsrc){
    var t = vsrc.getAttribute("type");
    if (t){
      var mt = navigator.mimeTypes[t];
      if (mt === undefined || mt.enabledPlugin === null) var p = "the applicable plugin (NOT DETECTED)";
      else {
        var pn = mt.enabledPlugin.name;
        if (pn.toLowerCase().indexOf("plugin") < 0 && pn.toLowerCase().indexOf("plug-in") < 0) pn += " plugin";
        var p = "the " +  pn;
      }
    } else {
      var p = "the applicable plugin (if any)";
    }
    var ih = 'Link to launch the media in a new tab where it should be handled by ' + p + ': <a href="' + vsrc.getAttribute("src") + '" target="_blank" style="text-decoration:underline">' + vsrc.getAttribute("src") + '</a>';
  } else {
    var ih = "SORRY! Cannot read video source.";
  }
  var pw = document.querySelector('div#playerContainer');
  if (!pw) pw = document.querySelector('div.MediaDetail-itemWrapper');
  pw.innerHTML = '<p style="color:#00f;background:#ffc">' + ih + '</p>';
  /* This is fail 
  if (vsrc.getAttribute("src").indexOf('.m3u8') > -1){
    pw.querySelector('a').addEventListener('click', makeVLC, false);
  }
  */
}
/*
function makeVLC(evt){
  // Derive target element
  var m3uLink = evt.target;
  // Create object
  var obj = document.createElement('object');
  obj.setAttribute('type', "application/x-vlc-plugin"); // not working with M3U8 content type
  obj.setAttribute('data', m3uLink.href);
  obj.setAttribute('autoplay', 'true');
  obj.setAttribute('style', 'width:100%; height:100%; display:block; margin-left:auto; margin-right:auto;');
  // Replace container
  document.body.innerHTML = "";
  document.body.appendChild(obj);
  // Cancel link navigation
  evt.preventDefault();
  evt.stopPropagation();
  return false;
}
*/