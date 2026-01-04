// ==UserScript==
// @name         Bluepanel 3.0 (BETA)
// @namespace    https://jy738.github.io/webxp/
// @version      3.0.1
// @description  Bluepanel 3.0 Client for BonziWORLD.org! some features will be broken cus its a beta
// @author       Jy
// @match        https://bonziworld.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonziworld.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502474/Bluepanel%2030%20%28BETA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502474/Bluepanel%2030%20%28BETA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
  //document.getElementById("logo_login").src = 'https://jy738.github.io/webxp/bluepanel/logo_login.png';
  function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function checkCookie() {
    let user = getCookie("theme");
    if (user != "") {
      return user;
    } else {
       user = prompt("Please enter your name:","");
       if (user != "" && user != null) {
         setCookie("theme", user, 30);
       }
    }
  }

  var urlhost = "https://jy738.github.io/webxp";

document.body.innerHTML+='<link id="theme" rel="stylesheet" href="'+urlhost+'/bluepanel/bluepanel.css">';

function Id(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';let result = '';
  for (let i = 0; i < length; i++) {  result += characters.charAt(Math.floor(Math.random() * characters.length));}
  return result;
}

  //<div class="titlebar"><p class="title">Bluepanel Menu</p><div class="x" id="bp_x"></div></div><div class="window_box"><div class="window_cont" id="bp_cont" style=""><div class="body">Bluepanel Javascript Debugger</div><div class="choice" id="bp_choice"><button id="jsrun">Run Script</button></div></div></div>

var defaultmenu = '<div class="titlebar"><p class="title">Bluepanel Menu</p><div class="x" id="bp_x"></div></div><div class="window_box"><div class="window_cont" id="bp_cont" style=""><img class="emblem" src="'+urlhost+'/bluepanel/info.png"></img><div class="body">Bluepanel Version 3.0</div><div class="choice" id="bp_choice"><button id="jsdebug">Javascript Debugger</button><button id="themes">Bluepanel Themes</button><button style="color:rgba(0,0,0,0.3)">Crosscolor manager</button><button style="color:rgba(0,0,0,0.3)">Friends list</button></div></div></div>';

  var jsmenu = '<div class="titlebar"><p class="title">Javascript Debugger</p><div class="x" id="bp_x"></div></div><div class="window_box"><div class="window_cont" id="bp_cont" style=""><div class="body">Bluepanel Javascript Debugger</div>Stats: {stats}<textarea type="text" style="width: 232px;height: 128px;position: relative;top: -20%;" id="jsexc" placeholder="enter javascript here..."></textarea><br><div class="choice" id="bp_choice"><button id="jsrun">Run Script</button></div></div></div>';

  var thememenu = '<div class="titlebar"><p class="title">Bluepanel Themes</p><div class="x" id="bp_x"></div></div><div class="window_box"><div class="window_cont" id="bp_cont" style=""><div class="body">Bluepanel CSS/Themes<br><input type="text" placeholder="custom background image URL (optional" id="themeurl"></div><br><div class="choice" id="bp_choice"><button id="themedefault">Default</button><button id="thememetal">Metal</button><button id="themecustom">Change background</button></div></div></div>';

document.getElementById("content").innerHTML+="<div id='start_cont'><div id='start'></div>";
document.body.innerHTML+="<div id='window_area'></div>";
document.getElementById("window_area").innerHTML+='<div class="window_main" style="width:450px;height:230px;top:40%;left:40%;" id="bpmenu">'+defaultmenu+'</div>';


var show = () => {document.getElementById("bpmenu").style.visibility = "visible";}
var hide = () => {document.getElementById("bpmenu").style.visibility = "hidden";}
var x = () => {document.getElementById("bp_x").onclick = () => {hide();document.getElementById("bpmenu").innerHTML = defaultmenu;}}
document.getElementById("window_area").innerHTML+="<div id='start'></div>";
document.getElementById("start").onclick = () => {
  show();
  document.getElementById("jsdebug").onclick = () => {
    document.getElementById("bpmenu").innerHTML = jsmenu;
    x();
    document.getElementById("jsrun").onclick = () => {
      eval(document.getElementById("jsexc").value);
    }
  }
  document.getElementById("themes").onclick = () => {
    document.getElementById("bpmenu").innerHTML = thememenu;
    x();
    document.getElementById("themedefault").onclick = () => {
      document.getElementById("theme").setAttribute('href', urlhost + "/bluepanel/bluepanel.css"); 
    }
    document.getElementById("thememetal").onclick = () => {
      document.getElementById("theme").setAttribute('href', urlhost + "/bluepanel/bluepanel2.css"); 
    }
    document.getElementById("themecustom").onclick = () => {
      if(document.getElementById("themeurl").value !== ""){
       document.getElementById("content").style.backgroundImage = "url("+document.getElementById("themeurl").value+")";
        document.getElementById("content").style.backgroundSize = "cover ";
      }
    }
  }
  x();
}

})();