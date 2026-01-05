// ==UserScript==
// @name        Replace "viewed" with "download" button
// @namespace   nikolay.merinov@member.fsf.org
// @description Add download button to new lostfilm.tv interface
// @include     http://www.lostfilm.tv/new/*
// @include     https://www.lostfilm.tv/new/*
// @include     http://www.lostfilm.tv/new
// @include     https://www.lostfilm.tv/new
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26988/Replace%20%22viewed%22%20with%20%22download%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/26988/Replace%20%22viewed%22%20with%20%22download%22%20button.meta.js
// ==/UserScript==
var serials = document.getElementsByClassName("text-block serials-list")[0];
var episodes_list = serials.getElementsByClassName("row");

for (var i in episodes_list) {
  var series = episodes_list[i].getElementsByClassName("thumb")[0].src.match(/\/(\d+)\//)[1];
  var season_episode = episodes_list[i].getElementsByClassName("comment-blue-box")[0].href.match(/season_(\d+)\/episode_(\d+)/);
  var season = season_episode[1];
  var episode = season_episode[2];
  
  // <div title="" class="external-btn" onClick="PlayEpisode('299','1','6')"></div>
  var button = document.createElement("div");
  button.setAttribute("class", "haveseen-btn");
  button.setAttribute("title", "Download episode");
  button.setAttribute("style", "border: 2px solid #ff3c2d; top: 39px; background: #ff3c2d url(\"/vision/external-link-btn3.png\") repeat scroll center center;")
  button.setAttribute("onClick", "PlayEpisode('" + series + ("00" + season).slice(-3) + ("00" + episode).slice(-3) + "')");
  episodes_list[i].appendChild(button);
}