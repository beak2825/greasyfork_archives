// ==UserScript==
// @name        Download video button
// @namespace   Violentmonkey Scripts
// @match       https://*.reddit.com/*
// @license     MIT
// @grant       none
// @version     1.0.2
// @author      Krulvis
// @description 28/04/2022, 23:09:42
// @downloadURL https://update.greasyfork.org/scripts/468093/Download%20video%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/468093/Download%20video%20button.meta.js
// ==/UserScript==

window.addEventListener('neverEndingLoad', function(){
  var startLength = $(".expando-button.video.collapsed").length;
  console.log("New page loading!!");
  var timer = setInterval(function(){
    if ($(".expando-button.video.collapsed").length > startLength) {
      console.log("New page LOADED!");
      addDLButton();
      clearInterval(timer);
    }
  }, 200);
});
window.addEventListener('load', function() {
  addDLButton();
}, false);

function addDLButton(){
  $(".expando-button.video.collapsed").on("click", function(e){
      var entry = $(this).closest(".entry");
      var postLink = entry.find("a.title").attr("href");
      var controls = entry.find(".res-media-controls.res-media-controls-left.res-media-controls-top");
      console.log(controls);
      if(controls.find(".res-media-controls-download").length == 0){
        var downloadButton = $("<button class='res-media-controls-download res-icon'>");
        var videoLink = controls.parent().parent().find(".res-video-link.res-video-source").attr("href");
        downloadButton.on("click", function(){
          openLink(postLink, videoLink);
        });
        controls.append(downloadButton);
      }
    });
}

function openLink(post, video){
  var link = 'https://sd.redditsave.com/download.php?permalink=https://reddit.com'+post+'&video_url='+video+'/DASH_720.mp4'+'?source=fallback&audio_url='+video+'/DASH_audio.mp4?source=fallback';
  console.log("Opening: " + link);
  var linkToSaveReddit = 'https://redditsave.com/info?url='+video //Use this if you want to click the download button manually
  var win = window.open(link, '_blank');
  if (win) {
      //Browser has allowed it to be opened
      win.focus();
  } else {
      //Browser has blocked it
      alert('Please allow popups for this website');
  }
}