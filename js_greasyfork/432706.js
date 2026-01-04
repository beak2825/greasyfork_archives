// ==UserScript==
// @name     YouTube Speeder
// @version  1
// @author   Thertzlor
// @description  Finer control of youtube playback speed.
// @grant    none
// @include  https://www.youtube.com/*
// @namespace https://greasyfork.org/users/817301
// @downloadURL https://update.greasyfork.org/scripts/432706/YouTube%20Speeder.user.js
// @updateURL https://update.greasyfork.org/scripts/432706/YouTube%20Speeder.meta.js
// ==/UserScript==

var wait = setInterval(function(){
  var player = document.getElementById("movie_player");
  if(!player) return;
  clearInterval(wait);
  var display = player.appendChild(document.createElement("div"));
  display.style.opacity="0";
  display.style.background="black";
  display.style.position= "absolute";
  display.style.right="2%";
  display.style.bottom ="10%";
  display.style.padding='5px';
  display.style.zIndex ="2999999999"
  display.style.transition="opacity 0.3s ease-in"
  var config = JSON.parse(localStorage.getItem('yt-speed')||"{}");
  var vid =  document.getElementsByTagName("video")[0];
  var currentTime = document.getElementsByClassName("ytp-time-current")[0]
  var duration = document.getElementsByClassName("ytp-time-duration")[0]
  var videoRate = config.rate||1
  var interval = config.interval || .05;
  var currentRate;
  var textTimer;
  var speeding= false;
  if (config.rate !== 1) speeder(0)

  setInterval(function(){
    if(vid.playbackRate !== config.rate) vid.playbackRate = config.rate;
  },300)


  function fancyTimeFormat(time){
    time = Math.round(time)
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var ret = "";
    if (hrs > 0) ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  function displayTime(){
    speeding = true;
    if(currentRate == 1) return void (duration.innerHTML=duration.innerHTML.split(" ")[0])
    var durationArray = duration.innerHTML.split(" ")[0].split(":");
    var originalDuration = (durationArray.length == 3)? ((parseInt(durationArray[0])*60*60) + (parseInt(durationArray[1])*60) + parseInt(durationArray[2])) : ((parseInt(durationArray[0])*60)+parseInt(durationArray[1])) ;
    var cur = currentTime.innerHTML.split(":");
    var originalRate = (cur.length == 3)? ((parseInt(cur[0])*60*60) + (parseInt(cur[1])*60) + parseInt(cur[2])) : ((parseInt(cur[0])*60)+parseInt(cur[1])) ;
    var newDuration = fancyTimeFormat(originalDuration/currentRate)
    var newRate = fancyTimeFormat(originalRate/currentRate)
    duration.innerHTML = duration.innerHTML.split(" ")[0]+" ("+newRate+" / "+newDuration+")";
  }

  function showText(text){
    display.innerHTML = text
    display.style.opacity=".8";
    clearInterval(textTimer);
    textTimer = window.setTimeout(function(){display.style.opacity="0";},800)
  }

  document.getElementsByClassName('ytp-settings-menu')[0].addEventListener('click', function(){
    if(vid.playbackRate !== currentRate){
      config.rate = vid.playbackRate;
      currentRate = vid.playbackRate;
      if(speeding === false) setInterval(function(){displayTime()},1000)
    }
  })

  function speeder(rate){
    videoRate += rate;
    currentRate = rate? Math.round(videoRate*1000)/1000 : videoRate;
    vid.playbackRate = currentRate
    config.rate = currentRate
    showText(currentRate.toString(10))
    localStorage.setItem('yt-speed', JSON.stringify(config));
    if(speeding === false) setInterval(function(){displayTime()},1000)
  }

  document.body.addEventListener("keydown",function(e){
    if((!e.altKey) || !(e.code === 'ArrowUp' || e.code === 'ArrowDown')) return
    if(e.shiftKey){
      interval += .05*(e.code === 'ArrowUp'?1:-1);
      interval = Math.max(Math.round(interval * 100)/100,0)
      config.interval = interval
      showText('set interval to '+interval)
      localStorage.setItem('yt-speed', JSON.stringify(config));
    } else speeder(interval * (e.code === 'ArrowUp'?1:-1));
  })

},20)