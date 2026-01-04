// ==UserScript==
// @name Yui star collection
// @description  Auto star collection for 10 rooms
// @icon         http://stage48.net/wiki/images/thumb/f/f1/YokoyamaYui8Dec2016.jpg/600px-YokoyamaYui8Dec2016.jpg
// @author       yokoB
// @match https://www.showroom-live.com/*
// @grant none
// @namespace 
// @version 0.0.1.20190517084526
// @downloadURL https://update.greasyfork.org/scripts/383157/Yui%20star%20collection.user.js
// @updateURL https://update.greasyfork.org/scripts/383157/Yui%20star%20collection.meta.js
// ==/UserScript==
// 
// 

//show room count
var xtime = 0;
var timeout = 32000;

$(".label-official").after( " <div id='count' type='button' class='label-room is-start-time' style='display: inline-block;'>Click to collect 10times</div> <div id='retweet' type='button' class='label-room is-start-time' style='display: inline-block;'>Click to retweet 10times</div>"); 


setTimeout(function(){
  //idol room only
  $("#js-onlivelist-select").val("102"); 
}, 1000);

var method = true;

$("#count").click(function() {
  a();
  $("#count").html("Counting"); 
  $("#retweet").remove();
});

$("#retweet").click(function() {
  timeout = 2000;
  a();
  $("#retweet").html("Retweeting"); 
  $("#count").remove();
  method = false;
});

function a(){ 
  setTimeout(function(){
    action();
    b();
  },timeout);
}
                  
function action(){
  xtime++;
  if (method == true) {
    $("#js-onlivelist-list .js-room-link").eq(xtime).click();
    $("#count").html("Counted: " + xtime); 
  }else{
    $("#icon-room-twitter-post").click();
    $("#retweet").html("Retweeted: " + xtime); 
    $("#twitter-post-button").click();
    $("#js-onlivelist-list .js-room-link").eq(xtime).click();
  }       
}


function b(){
  setTimeout(function(){
    action();
    c();
  },timeout);
}

function c(){
  setTimeout(function(){
    action();
    d();
  },timeout);
}

function d(){
  setTimeout(function(){
    action();
    e();
  },timeout);
}

function e(){
  setTimeout(function(){
    action();
    f();
  },timeout);
}
function f(){
  setTimeout(function(){
    action();
    g();
  },timeout);
}
function g(){
  setTimeout(function(){
    action();
    h();
  },timeout);
}

function h(){
  setTimeout(function(){
    action();
    i();
  },timeout);
}

function i(){
  setTimeout(function(){
    action();
  },timeout);
}

