// ==UserScript==
// @name         유튜브 끊김방지
// @description  유튜브 일시중지 문제 해결용
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @version 0.0.1.20181105104407
// @namespace https://greasyfork.org/users/201299
// @downloadURL https://update.greasyfork.org/scripts/395527/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%81%8A%EA%B9%80%EB%B0%A9%EC%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/395527/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%81%8A%EA%B9%80%EB%B0%A9%EC%A7%80.meta.js
// ==/UserScript==

var ynsTag = "[Youtube NonStop] ";
var clickTimeThreshold = 3000;
var lastClickTime = new Date().getTime();
var fakeClick = false;
var confirmActed = 0;
var videoActed = 0;
var isPausedManually = false;

$(document).click(function() {
  if(!fakeClick){
    lastClickTime = new Date().getTime();
    setTimeout(checkIfPaused, 1000);
  }
  else{
    fakeClick = false;
  }
});

$(document).keydown(function() {
  lastClickTime = new Date().getTime();
  setTimeout(checkIfPaused, 1000);
});

function checkIfPaused(){
  if($('.html5-video-player').hasClass("paused-mode")){
    isPausedManually = true;
  }
  else{
    isPausedManually = false;
  }
}

function hasPoppedAfterTimeThreshold(){
  var currTime = new Date().getTime();
  if(currTime - lastClickTime <= clickTimeThreshold || isPausedManually){
    lastClickTime = new Date().getTime();
    return false;
  }
  return true;
}

function tryClickPaperDialog(){
  var paperDialog = $('ytd-popup-container').find('paper-dialog');
  if(paperDialog.length){
    if(paperDialog.css('display') != 'none'){
      if(!hasPoppedAfterTimeThreshold()){
        return;
      }
      if(paperDialog.find('#confirm-button').length){
        fakeClick = true;
        paperDialog.find('#confirm-button').click();
        confirmActed = new Date().getTime();
        console.debug(ynsTag + "Confirmed watching in dialog!");
      }
    }
  }
}

function tryClickPausedVideo(){
  if($('.html5-video-player').hasClass("paused-mode")){
    if(!hasPoppedAfterTimeThreshold()){
      return;
    }
    fakeClick = true;
    $("video").click();
    videoActed = new Date().getTime();
    console.debug(ynsTag + "Detected paused video and clicked it to continue!");
  }
}

if (typeof(Worker) !== "undefined") {

  var response = `var ynsIntervalTimer = 500;

  setInterval(whipWorker, ynsIntervalTimer);
  postMessage("Monitoring YouTube for 'Confirm watching?' action...");

  function whipWorker(){
    postMessage("whip");
  }`;

  var blob;
  try {
      blob = new Blob([response], {type: 'application/javascript'});
  } catch (e) { // Backwards-compatibility
      blob = new BlobBuilder();
      blob.append(response);
      blob = blob.getBlob();
  }

  var worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = function(e){
      if(e.data === "whip"){
        if(new Date().getTime() - confirmActed >= 2000){
          tryClickPaperDialog();
        }
        if(new Date().getTime() - videoActed >= 2000 && new Date().getTime() - confirmActed >= 2000){
          tryClickPausedVideo();
        }
      }
      else{
        console.log(ynsTag + e.data);
      }
    };
}
else {
    console.error(ynsTag + "Sorry, your browser doesn't support Web Workers! :/");
}