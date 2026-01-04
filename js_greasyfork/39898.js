// ==UserScript==
// @namespace horoscripts
// @name fhws elearning autologin and redirect to dashboard
// @description for FHWS elearning - a Script that logs you in and redirect you to the dashboard site
// @match https://elearning.fhws.de/*
// @grant none
// @version 1.0.3
// @author horo
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/39898/fhws%20elearning%20autologin%20and%20redirect%20to%20dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/39898/fhws%20elearning%20autologin%20and%20redirect%20to%20dashboard.meta.js
// ==/UserScript==

//insert you credentials here! 
//watchout anyone who can access your pc could read your username and pwd
var username = "k*******";
var pwd = "*******";


//------------------ do not edit below this line! --------------------------

//sleep helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//coockie helper funktions
function setCookie(name,value,secs) {
    var expires = "";
    if (secs) {
        var date = new Date();
        date.setTime(date.getTime() + (secs*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
  //workaround for chrome...
  setCookie('redirectCookie','',-1);
  document.cookie = name+'=; Max-Age=-99999999;';  
}

//submits the form
async function rLogin(y) {
    
    await sleep(20);
    setCookie('redirectCookie','trueee',10);
    y.submit();
    console.log("submitting the login");
}

//check if after login and then redirects to dashboard
function redirectCheck(){
    
  var xx = getCookie('redirectCookie');
  if (xx === "trueee") {
    console.log("we are here after auto login -> redirecting now!");
    eraseCookie('redirectCookie');
    window.location = "https://elearning.fhws.de/my/";
    return;
  }
}

async function login() {
  redirectCheck();
  
  console.log("started autologin");
  var y = document.getElementById("login");
  
  if(y !== null)
  {
    if(document.getElementById("login_username") && document.getElementById("login_password"))
    {
      while (document.getElementById("login_username").value.trim()  
              && document.getElementById("login_password").value.trim())
      {
        console.log("waiting for login credential auto fill");
        await sleep(1);
      }
      document.getElementById("login_username").value = username;
      document.getElementById("login_password").value = pwd;
      rLogin(y);
    }
    else if (document.getElementById("username") && document.getElementById("password"))
    {
      while (document.getElementById("username").value  
              && document.getElementById("password").value)
      {
        console.log("waiting for login credential auto fill");
        await sleep(1);
      }
      document.getElementById("username").value = username;
      document.getElementById("password").value = pwd;
      rLogin(y);
    }
  }
  else {
    console.log("no login form - you probably allready logged in!");
  }
}

login();