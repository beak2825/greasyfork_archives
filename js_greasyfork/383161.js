// ==UserScript==
// @name Yui retweet
// @description  Auto retweet
// @icon         http://stage48.net/wiki/images/thumb/f/f1/YokoyamaYui8Dec2016.jpg/600px-YokoyamaYui8Dec2016.jpg
// @author       yokoB
// @match https://www.showroom-live.com/*
// @grant none
// @namespace 
// @version 0.0.1.20190517082716
// @downloadURL https://update.greasyfork.org/scripts/383161/Yui%20retweet.user.js
// @updateURL https://update.greasyfork.org/scripts/383161/Yui%20retweet.meta.js
// ==/UserScript==
// 
// 

//show room count
var xtime = 0;
var timeout = 2500;
$(".label-official").after( " <div id='count' type='button' class='label-room is-start-time' style='display: inline-block;'>Click to start</div>"); 


$("#count").click(function() {
  a();
  $("#count").html("Retweeting"); 
});


function a(){ 
  setTimeout(function(){
    action();
    b();
  },timeout);
}
                  
function action(){
    xtime++;
    $("#icon-room-twitter-post").click();
    $("#count").html("Retweeted: " + xtime); 
    $("#twitter-post-button").click();
    $("#js-onlivelist-list .js-room-link").eq(xtime + 1).click();
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
