// ==UserScript==
// @name        Omnivox Auto Login
// @namespace   why
// @description Save password and automatically log in on omnivox.ca
// @author      WengH
// @version     1.5
// @icon        https://marianopolis.omnivox.ca/intr/UI/Themes/Omnivox_Defaut/images/header-logo-omnivox.svg
// @match       *://*.omnivox.ca/*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.xmlHttpRequest
// @run-at      document-idle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/410932/Omnivox%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/410932/Omnivox%20Auto%20Login.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

this.$ = this.jQuery = jQuery.noConflict(true);

async function loginPage() {
  let content = GM.getValue("content", {});
  let hostname = GM.getValue("hostname", "");
  content = await content;
  hostname = await hostname;
  
  // automatically fill login info and submit
  if (content !== {} && hostname === location.hostname) {
    let now = Date.now();
    let lastAttempt = await GM.getValue("lastAttempt", 0);
    
    console.log(now - lastAttempt);
    
    if (now - lastAttempt < 5000) {
      // less than 10 seconds between 2 login attempts
      // probably the wrong password, clear everything
      
      alert("Login timeout, perhaps your password is wrong?\nCleared all saved information.");
      
      GM.deleteValue("content");
      GM.deleteValue("hostname");
      GM.deleteValue("lastAttempt");
    }
    else {
      GM.setValue("lastAttempt", now);
  
      console.log("Logging in...");
      content.k = getK();
      deserializeForm($('form'), content)
      console.log(content);
      $('form').submit();
      return;
    }
  }
  
  // capture login info otherwise
  document.forms[0].onsubmit = async function(){
    console.log("We're on login page, record login info");
    let content = serializeForm($("form"));
    delete content['k'];
    GM.setValue("content", content);
    GM.setValue("hostname", location.hostname);
  };
}

async function autoLogin() {
  let content = GM.getValue("content", "");
  let hostname = GM.getValue("hostname", "");
  content = await content;
  hostname = await hostname;
  
  if (content === "" || hostname === "") {
    console.log("Login info not registered, please log out and log in again");
    return;
  }
  
  console.log("Logged in at " + getDateString());
  
  //deleteCookies();
  
  content.k = getK();
  
  GM.xmlHttpRequest({
    method: "POST",
    url: 'https://' + hostname + '/intr/Module/Identification/Login/Login.aspx',
    data: $.param(content),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}

(async function() {
  // we don't want to run in iframe
  if (window.top !== window.self)
    return;
  
  console.log("Omnivox Auto Login started");
  // save username and password if we are in login form
  if (location.pathname === "/Login/Account/Login") {
    loginPage();
  }
  
  else {
    console.log("Automatic login activated");
    
    setIntervalRealTime(autoLogin, 600000);
  }
})();


function setIntervalRealTime(func, interval) {
  let last = 0;
  setInterval(function() {
    let now = Date.now();
    if (now - last > interval) {
      last = now;
      func();
    }
  }, 1000);
}


function deleteCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++)
    createCookie(cookies[i].split("=")[0], "", -1);
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}


function getDateString(date = new Date()) {
  // sv-SE seems to be similar to ISO 8601
  return date.toLocaleString('sv-SE');
}


function getK() {
  
  //t1=1599507598.515297, k1=637350917992510779
  
  const m = 10000;
  const k = 621355842007357696;
  return Date.now() * m + k;
}


function serializeForm(f) {
  let array = f.serializeArray();
  let map = {};
  array.forEach(function(item) {
    map[item.name] = item.value;
  })
  return map;
}


function deserializeForm(f, map) {
  for (var key in map) {
    if (!map.hasOwnProperty(key)) continue;
    $('[name="' + key + '"]').val(map[key]);
  }
}
