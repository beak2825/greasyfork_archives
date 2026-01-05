// ==UserScript==
// @name        Youtube show likes and dislikes!
// @namespace   Vamael
// @description When clicking like/dislike add data about them to localStorage, then color links.

// @include     https://www.youtube.com/*
// @include     https://youtube.com/*
// @include     http://www.youtube.com/*
// @include     http://youtube.com/*

// @version     1.03
// @grant       none
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/16044/Youtube%20show%20likes%20and%20dislikes%21.user.js
// @updateURL https://update.greasyfork.org/scripts/16044/Youtube%20show%20likes%20and%20dislikes%21.meta.js
// ==/UserScript==

if (window.top === window.self) {
  try{
    //var date = new Date;
    //console.log("Page loaded at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());

    var vidID = youtube_parser(window.location.href);

    addEventListeners();
    ifAlreadyLiked();
    applyColors();
  }
  catch(e){
    alert("Error!\n" + e);
  }
}

function addEventListeners(){
  $(document)
    .on('click', ".like-button-renderer-like-button-unclicked", function(){
      //console.log("Pressed like");
      setData('add','like');
    })
    .on('click', ".like-button-renderer-like-button-clicked", function(){
      //console.log("Pressed liked like");
      setData('remove');
    })
    .on('click', ".like-button-renderer-dislike-button-unclicked", function(){
      //console.log("Pressed dislike");
      setData('add','dislike');
    })
    .on('click', ".like-button-renderer-dislike-button-clicked", function(){
      //console.log("Pressed disliked dislike");
      setData('remove');
    });
}

function ifAlreadyLiked(){
  if(document.getElementsByClassName('like-button-renderer-like-button-clicked').length > 0){
    if(window.getComputedStyle(document.getElementsByClassName('like-button-renderer-like-button-clicked')[0]).getPropertyValue("display") != 'none'){
      setData('add','like');
    } else if(window.getComputedStyle(document.getElementsByClassName('like-button-renderer-dislike-button-clicked')[0]).getPropertyValue("display") != 'none'){
      setData('add','dislike');
    }
  }
}

function setData(whatDo, type){
  switch(whatDo){
    case "add":
      if(type == 'like'){
        localStorage[vidID] = 'like';
      } else{
        localStorage[vidID] = 'dislike';
      }
      break;
    case "remove":
      localStorage.removeItem(vidID);
      break;
  }
}

function applyColors(){
  $('#watch7-sidebar a, #player-playlist a, #browse-items-primary a, #results a').filter(function() {
    return this.href.match(/watch/);
  }).each(function(){
    var id = youtube_parser($(this).attr("href"));
    if(localStorage[id]){
      if(localStorage[id] == 'like'){
        $(this).attr("style","background-color:rgba(0,255,0,0.2) !important");
      } else{
        $(this).attr("style","background-color:rgba(255,0,0,0.2) !important");
      }
    } else{
      $(this).css("background-color",'');
    }
  });
}

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

var s_ajaxListener = new Object();
s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
s_ajaxListener.callback = function () {
  // this.method :the ajax method used
  // this.url    :the url of the requested script (including query string, if any) (urlencoded) 
  // this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)
  if(this.method == "POST"){
    applyColors();
  } else if(this.url.substring(0,12) == '/browse_ajax'){
    setTimeout(function(){
      applyColors();
    },5000);
  }
  
  
}

XMLHttpRequest.prototype.open = function(a,b) {
  if (!a) var a='';
  if (!b) var b='';
  s_ajaxListener.tempOpen.apply(this, arguments);
  s_ajaxListener.method = a;  
  s_ajaxListener.url = b;
  if (a.toLowerCase() == 'get') {
    s_ajaxListener.data = b.split('?');
    s_ajaxListener.data = s_ajaxListener.data[1];
  }
}

XMLHttpRequest.prototype.send = function(a,b) {
  if (!a) var a='';
  if (!b) var b='';
  s_ajaxListener.tempSend.apply(this, arguments);
  if(s_ajaxListener.method.toLowerCase() == 'post')s_ajaxListener.data = a;
  s_ajaxListener.callback();
}