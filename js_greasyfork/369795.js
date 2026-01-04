// ==UserScript==
// @name        youtube thumbnail video pin
// @namespace   localhost
// @description You can easly pin youtube thumbnail movie to section in the main page
// @author       Paweł Kolubka
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @match        https://youtube.com/*
// @match        http://youtube.com/*
// @version      1.1.1
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369795/youtube%20thumbnail%20video%20pin.user.js
// @updateURL https://update.greasyfork.org/scripts/369795/youtube%20thumbnail%20video%20pin.meta.js
// ==/UserScript==

window.addEventListener("spfdone", process); // old youtube design
window.addEventListener("yt-navigate-start", process); // new youtube design

document.addEventListener("DOMContentLoaded", process); // one-time early processing
//window.addEventListener("load", postProcess); // one-time late postprocessing

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

var automat = {
  init: function(){
  	this.vmData = {};
  },
	madeBtn: function(){
  	this.btn = document.createElement("span");
    this.btn.className = "yt-subscription-button-subscriber-count-branded-horizontal yt-subscriber-count";
    this.btn.innerHTML = "Pin it";
    this.btn.setAttribute("style","display: inline-block;width: 50px;border-radius: 2px;margin-left: 5px;cursor: pointer;");
    this.setNotPinedDataAtr();
    if(this.videoIsStorage()){
    	this.setPinedStyle();
      this.setPinedDataAtr();
    }
  },
  setPinedDataAtr: function(){
  	this.btn.dataset.action = "pined";
  },
  setNotPinedDataAtr: function(){
  	this.btn.dataset.action = "notPined";
  },
  videoIsStorage: function(){
  	return this.vmData.hasOwnProperty(this.videoId);
  },
  setPined: function(){
  	this.setPinedStyle();
    this.setPinedDataAtr();
    this.addVideoMetaToStorage();
  },
  setUnPined: function(){
  	this.setUnPinedStyle();
    this.setNotPinedDataAtr();
    this.removeVideoMetaFromStorage();
  },
  setPinedStyle: function(){
  	this.btn.innerHTML = "Pined";
    this.btn.style["border-color"] = "#4CAF50";
    this.btn.style.color = "#388E3C";
  },
  setUnPinedStyle: function(){
  	this.btn.innerHTML = "Pin it";
    this.btn.style["border-color"] = "#ccc";
    this.btn.style.color = "#737373";
  },
  getStorage: function(){
  	var vmData = localStorage.getItem('videoMetaData');
    if (vmData === null) {
      return;
    }
    this.vmData = JSON.parse(vmData);
  },
  setStorage: function(){
  	var vmData = JSON.stringify(this.vmData);
		localStorage.setItem('videoMetaData', vmData);
  },
  addVideoMetaToStorage: function(){
    let videoTitle = document.querySelector(".watch-title-container > #eow-title").innerHTML.trim();
    let videoAuthor = document.querySelector("#watch7-user-header > .yt-user-info > a");
    let videoAuthorVal = videoAuthor.innerHTML.trim();
    let authorLink = videoAuthor.getAttribute("href").split("/")[2];
    let duration = document.querySelector("#movie_player .ytp-time-duration").innerHTML;
  	this.vmData[this.videoId] = [videoTitle,videoAuthorVal,authorLink,duration];
    this.setStorage();
  },
  removeVideoMetaFromStorage: function(){
    delete this.vmData[this.videoId];
    this.setStorage();
  },
  generatePinSection: function(){
  	var feed = document.querySelector("#feed > #feed-main-what_to_watch > .section-list");
    var pinContent = document.createElement("li");
    pinContent.innerHTML = '<ol class="item-section"><li><div class="feed-item-container browse-list-item-container yt-section-hover-container compact-shelf shelf-item branded-page-box clearfix"><div class="feed-item-dismissable"><div class="shelf-title-table"><div class="shelf-title-row"><h2 class="branded-page-module-title shelf-title-cell"><span class="branded-page-module-title-text">Pined</span></h2><div class="menu-container shelf-title-cell"></div></div></div><div class="multirow-shelf"><div class="yt-uix-expander yt-uix-expander-collapsed"><ul id="pinedWrapper" class="shelf-content yt-uix-expander-body"></ul></div></div></div></div></li></ol>';
    var pinWrapper = pinContent.querySelector("#pinedWrapper");
    for (var key in this.vmData) {
      let videoUrl = "https://www.youtube.com/watch?v="+key;
      let videoTitle = this.vmData[key][0];
      let videoAuthor = this.vmData[key][1];
      let authorLink = this.vmData[key][2];
      let duration = this.vmData[key][3];
      var li = document.createElement("li");
      li.classList.add("yt-shelf-grid-item");
      li.setAttribute("style", "display: inline-block;");
      li.innerHTML = '<div class="yt-lockup yt-lockup-grid yt-lockup-video clearfix"><div class="yt-lockup-dismissable"><div class="yt-lockup-thumbnail contains-addto"><a aria-hidden="true" href="/watch?v='+key+'" class="yt-uix-sessionlink spf-link"><div class="yt-thumb video-thumb" style="height: 108px;"><span class="yt-thumb-simple"><img  src="https://i.ytimg.com/vi/'+key+'/hqdefault.jpg" style="width: 100%;position: relative;top: 50%;transform: translateY(-50%);" data-ytimg="1" alt="thumbnail"><span class="video-time" aria-hidden="true">'+duration+'</span></span></div></a></div><div class="yt-lockup-content"><h3 class="yt-lockup-title "><a href="/watch?v='+key+'" class="yt-ui-ellipsis yt-ui-ellipsis-2 yt-uix-sessionlink spf-link" title="'+videoTitle+'" dir="ltr">'+videoTitle+'</a><span class="accessible-description"> - Czas trwania: '+duration+'.</span></h3><div class="yt-lockup-byline yt-ui-ellipsis yt-ui-ellipsis-2"><a href="/channel/'+authorLink+'" class="yt-uix-sessionlink spf-link">'+videoAuthor+'</a></div></div></div></div>';
      pinWrapper.appendChild(li);
    }
    feed.insertBefore(pinContent, feed.firstChild);
  },
};

automat.init();
automat.getStorage();

function process() {
    if (location.pathname == "/") {
      if(Object.keys(automat.vmData).length === 0 && automat.vmData.constructor === Object) return;
      automat.generatePinSection();
    }else if(location.pathname == "/watch"){
      automat.videoId = youtube_parser(window.location.toString());
      automat.madeBtn();
      document.querySelector("#watch7-subscription-container").appendChild(automat.btn);
      automat.btn.addEventListener("click",function(e){
        let actionAttr = e.target.dataset.action;
        if(actionAttr == "notPined"){
        	automat.setPined();
        }else if(actionAttr == "pined"){
           automat.setUnPined();
        }
      });
    }
}

/*
This script requires old youtube design site. Only in older version youtube this script would be works.
The author is not responsible for any damages resulting from the use of the script. By using this script you agree with this.

Script uses browser's localStorage, so if you pin a lot of videos there may be no available space and then script would be not working.

The author reserves that if the structure of the youtube pages or the class of particular elements changes, the script will stop working properly.
In such a case, the author is not obliged to update the script. You use the script at your own risk.

LICENSE:
This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
The full license text can be found here: http://creativecommons.org/licenses/by-nc-sa/4.0/
*/