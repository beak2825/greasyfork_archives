// ==UserScript==
// @name        IMSLP - remove notices
// @namespace   *
// @description Remove the IMSLP contribution ad and disclaimer.
// @include     http://*imslp.org/*
// @include     https://*imslp.org/*
// @version     .11
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/18142/IMSLP%20-%20remove%20notices.user.js
// @updateURL https://update.greasyfork.org/scripts/18142/IMSLP%20-%20remove%20notices.meta.js
// ==/UserScript==

// By downloading and installing this script, you acknowledge that each time you 
// use this script you have read, understood and accepted the terms of the IMSLP
// general disclaimer found at
// http://imslp.org/wiki/IMSLP:General_disclaimer .


//
// Replace the contribution ad with a link to the score.
//

// Ensure page is fully loaded.
$(window).load(function(){ 

  // Grab the URL to the score.
  scoreURL = document.getElementById("sm_dl_wait").getAttribute('data-id');

  // Replace the content area with a link to the URL.
  document.getElementById("wiki-body").innerHTML = "<a href=" + scoreURL + " target = '_blank'>Link to score</a>"
  
  // Navigate to score. If this fails, the above link will serve as a backup.
  window.location.href = scoreURL

})

//
// Acknowledge the IMSLP disclaimer.
//

setDisclaimer();

function setDisclaimer()
{
var cookieName = "imslpdisclaimeraccepted";
var cookieValue = "yes";

var currentCookieValue = getCookie(cookieName);
var domain = document.domain.replace (/^www\./, "");
if (currentCookieValue != cookieValue) {
	document.cookie = cookieName + "=" + cookieValue + ";path=/;domain=" + domain + ";expires=;";
	location.reload(true);
	}
}

// Thanks to http://www.w3schools.com/js/js_cookies.asp
function getCookie(cname)
{
var name = cname + "=";
var cookieArr = document.cookie.split(';');
for(var i=0; i<cookieArr.length; i++)
  {
  var c = cookieArr[i].trim();
  if (c.indexOf(name)===0) return c.substring(name.length,c.length);
  }
  return "";
} 