// ==UserScript==
// @name			YouTube Speeder
// @namespace		https://greasyfork.org/users/953995
// @description		Proper show of the YouTube video speed and remaining time.
// @version			blic-2.1
// @date			2022-09-19
// @author			blic
// @match			https://www.youtube.com/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/459729/YouTube%20Speeder.user.js
// @updateURL https://update.greasyfork.org/scripts/459729/YouTube%20Speeder.meta.js
// ==/UserScript==

// Ползунок
// https://codepen.io/lavary/pen/OJbQPXe
// https://freefrontend.com/javascript-range-sliders/

'use strict';

const {floor} = Math

setTimeout(function(){
	const player = document.getElementById("movie_player");
	if (!player) return;
	const video = document.getElementsByTagName("video")[0];
	const text = document.getElementsByClassName("ytp-time-duration")[0]

  function fancyTimeFormat(time){
    const hrs = floor(time / 3600);
    const mins = floor((time % 3600) / 60);
    const secs = floor(time % 60);
    let str = "";
    if (hrs > 0) str = hrs + ":" + (mins < 10 ? "0" : "");
    str += mins + ":" + (secs < 10 ? "0" : "");
    str += secs;
    return str;
  }

  setInterval(function(){
	if (+video.playbackRate.toFixed(2) == 1) return void (text.innerHTML = text.innerHTML.split(" ")[0])
	const duration = fancyTimeFormat(player.getDuration() / video.playbackRate)
	const rate = fancyTimeFormat(player.getCurrentTime() / video.playbackRate)
	text.innerHTML = text.innerHTML.split(" ")[0] + " (" + rate + " / " + duration + ") ×" + +video.playbackRate.toFixed(2)
  },100)
},2000)
