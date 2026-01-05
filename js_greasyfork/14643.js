// ==UserScript==
// @name        Addic7ed Favourites
// @description Create shortcuts for your favourite shows on addic7ed.com
// @namespace   cuzi
// @oujs:author cuzi
// @include     http://www.addic7ed.com/*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/14643/Addic7ed%20Favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/14643/Addic7ed%20Favourites.meta.js
// ==/UserScript==
"use strict";


var LIKE_IMG = "http://cdn.addic7ed.com/images/icons/favorite.png";
var DELETE_IMG = "http://www.addic7ed.com/images/delete.png";
var SETTINGS_IMG = "http://www.addic7ed.com/images/user_comment.png";

var SHOW_URL = "http://www.addic7ed.com/show/";

var loc = document.location.href;

function setFavs(arr) {
  var str = JSON.stringify(arr);
  GM_setValue("favs",str);
}
function getFavs() {
  var str = GM_getValue("favs","[]");
  var arr = JSON.parse(str);
  arr.sort(function(a,b) {
    return a.name.replace(/^(the|a)\s+/i,'').localeCompare(b.name.replace(/^(the|a)\s+/i,''));
  });
  return arr;
}
function addFav(id,name) {
  var favs = getFavs();
  favs.push({'id': id, 'name': name});
  setFavs(favs);
}
function delFav(id) {
  var oldfavs = getFavs();
  var newfavs = [];
  for(var i = 0; i < oldfavs.length; i++) {
    if(oldfavs[i].id != id) {
      newfavs.push(oldfavs[i]);
    }
  }
  setFavs(newfavs);
}

function likeShow() {
  var showid = parseInt(loc.match(/\/show\/(\d+)/)[1]);
  var showname = document.title.match(/Download (.+) subtitles/)[1];
  addFav(showid,showname);
  alert("Added!");
}


function showHomeButton() {
  var div = document.createElement("div");
  div.setAttribute("id","addhis_homebutton");
  div.setAttribute("style","position:absolute; top:0px; left:0px; background: White; border-radius:10px; padding: 5px;");
  var span = document.createElement("span");
  span.appendChild(document.createTextNode("Favs"));
  div.appendChild(span);
  document.body.appendChild(div);
  div.addEventListener("mouseover",addHomeMenu,false);
}
function addLikeButton() {
  if(document.getElementById("addhis_likebutton"))
    return;
    
  var div = document.getElementById("addhis_homebutton");
  var div2 = document.createElement("div");
  div2.setAttribute("id","addhis_likebutton");
  
  // Like button
  var img = document.createElement("img");
  img.setAttribute("src",LIKE_IMG);
  img.setAttribute("alt","Follow show");
  img.setAttribute("style","width:20px;");
  div2.appendChild(img);
  div.appendChild(div2);
  div2.addEventListener("click",likeShow,false);
  div2.setAttribute("title","Add this show to favourites");  
}


function addHomeMenu() {
  if(document.getElementById("addhis_homemenu"))
    return;
  
  // List of favourite shows
  var div = document.getElementById("addhis_homebutton");
  
  var menu = document.createElement("ul");
  menu.setAttribute("id","addhis_homemenu");
  var favs = getFavs();
  for(var i = 0; i < favs.length; i++) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("class","gris");
    a.innerHTML = favs[i].name.replace(/^(the\s+|a\s+)?(\w)/i,'$1<b>$2</b>')
    a.setAttribute("href",SHOW_URL+favs[i].id);
    var img = document.createElement("img");
    img.setAttribute("src",DELETE_IMG);
    img.setAttribute("alt","Delete from favourites");
    img.setAttribute("style","width:17px;");
    img.addEventListener("click",function(id,name) {
      return function() { 
        if(confirm("Really delete "+name+"?")) {
          delFav(id);
          alert("Deleted!");
          }
        } 
      }(favs[i].id,favs[i].name),false);
    li.appendChild(a);
    li.appendChild(img);
    menu.appendChild(li);
  }
  
  div.appendChild(menu);
  
}

showHomeButton();

if(loc.match(/\/show\/\d+/)) {
  addLikeButton();
}
