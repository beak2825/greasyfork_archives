// ==UserScript==
// @name        google photos slower slideshow
// @description google photos slideshow
// @namespace   piframe
// @include     https://photos.google.com/album/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38764/google%20photos%20slower%20slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/38764/google%20photos%20slower%20slideshow.meta.js
// ==/UserScript==

// CHANGE first_photo TO USE THE URL OF THE FIRST PHOTO IN YOUR ALBUM
var first_photo = 'https://photos.google.com/album/AF1QipN58FWYKAHuxyqjUc-FeaZDOsQVJYc9SfmsVCwt/photo/AF1QipOO2dDxQxJ7pFTemvVnkt2R6oGHeTEV5_7yvqem';
function pressKey() {
  var key = 39; // right arrow keycode
  var body = document.getElementsByTagName('body')[0];
  if(document.createEventObject) {
    var eventObj = document.createEventObject();
    eventObj.keyCode = key;
    body.fireEvent("onkeydown", eventObj);
  } else if (document.createEvent) {
    var eventObj = document.createEvent("Events");
    eventObj.initEvent("keydown", true, true);
    eventObj.which = key;
    body.dispatchEvent(eventObj);
  }
}
function next_or_prev() {
  var current_url = window.location.href;
  pressKey();
  if (current_url == window.location.href) {
    // page didnt change, must be at last photo
    // load the first photo
    window.location.href = first_photo;
  }
}
window.setInterval(function(){next_or_prev()}, 600000);