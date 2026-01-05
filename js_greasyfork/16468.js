// ==UserScript== 
// @name          Xhamster Quick Links v.2.8
// @date          2016.01
// @version       2.8.1

// @description	  Adds handy links to the top/right of the Xhamster page (inculde USERSTYLE for HOVER)
// @icon       https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @namespace     https://greasyfork.org/users/7434
// @author        Andreas Schaefer it.mensch@gmail.com
// @author        janvier57

// @include       *xhamster.com*



// @exclude	  http*://services.addons.mozilla.org/*
// @exclude	  https://www.bing.com/*

// @grant       none
// @grant       GM_getValue
// @grant       GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/16468/Xhamster%20Quick%20Links%20v28.user.js
// @updateURL https://update.greasyfork.org/scripts/16468/Xhamster%20Quick%20Links%20v28.meta.js
// ==/UserScript==

// (Credit Andreas Schaefer)



if (window.top != window.self)  //don't run on frames or iframes
{
    return;
}

// TWEAK FOR MY STYLE :	
//var customhtml = "<div style=\"position: absolute !important; top: -2px; left: 0px;  margin-left: 180px !important; px;height: 15px; color: #999999; z-index: 99; width: auto !important; font-size:10px; text-align: center; white-space: nowrap !important; outline: 1px solid gray;  \">" +

// TWEAK FOR NO STYLE :	
var customhtml = "<div style=\"border: 1px solid gray; \">" +


// USAGE: You can put whatever links or html you want in .

// Simply Add/Edit your own links to the following variable:
// EXAMPLE:
//   "<a href=YOUR LINK>ITS LABEL</a> | " +


// MY FAVORITES

" <a href=http://xhamster.com/user/video/janvier57/favorite-1.html>My Favs</a>" +
"►" +  
"<a href=http://xhamster.com/favorites/videos-200.html>My Favs200</a> " +	
"<a href=http://xhamster.com/favorites/videos-400.html>My Favs400</a> " +	
"<a href=http://xhamster.com/favorites/videos-600.html>My Favs600</a> " +	
"<a href=http://xhamster.com/favorites/videos-800.html>My Favs800</a> " +
"<a href=http://xhamster.com/favorites/videos-900.html>My Favs900</a> " +

"►" + 

// My BLOG - Xhamster Tools
  "<a href=http://xhamster.com/user/janvier57/posts/479976.html>Xham Tools</a>" +
  
// Xhamster Forum
  "<a href=http://suggestions.xhamster.com/forums/59059-general>Xhamster Forum</a>" +
// ✉ Xhamster CONTACT Support
  "<a href=https://xhamster.com/info/contact> ✉ Xhamster Support</a>" +
// How to get around blocking xHamster.com
  "<a href=https://xhamster.net/>How to get around blocking xHamster.com</a>" +

"►" +
//  FIND A PORNSTAR
    "<a href=https://xhamster.com/posts/624414>Find a Pornstar (Initial)</a>" +
    "<a href=https://xhamster.com/posts/333371>Model Index (by Sick my Duck) (Initial)</a>" +
	
// Verified Porns Stars (DuckDuckGo: Xhamster video with IAFD links )
  " <a href=https://duckduckgo.com/?q=http%3A%2F%2Fwww.iafd.com%2F+site%3Axhamster.com&t=ffsb&ia=web>DuckDuckGo Search: Xhamster video with IAFD links</a>" +
// Verified Porns Stars (DuckDuckGo: Xhamster video with NudeVita links ) 
  " <a href=https://duckduckgo.com/?q=http%3A%2F%2Fwww.nudevista.com+site%3Axhamster.com&t=ffsb&ia=web>DuckDuckGo Search: Xhamster video with NudeVista links</a>" +
 
// PornMD - Real-Time List of  to PornHub's Searches : Straight
"<a href=http://www.pornmd.com/live-search>PornMD : Real-Time List of  to PornHub's Searches (Straight) </a> " +
  "</div>";


var allspans = new Array();
//JANVIER57 TWEAK 2016
allspans = document.getElementsByClassName('menu');
if (allspans.length == 0) {
	allspans = document.getElementsByClassName('global-nav-content');
}
allspans[0].innerHTML += customhtml;



// ADD MY CSS / USERSTYLE for the Script :
// Test addGlolStyle STYLE technique for Chrome compatibility

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
// NEW DESIGN 2021 (new - XHAM LOGO)
addGlobalStyle('.logo-container>div { position:fixed !important;   height:14px !important;  width:9px !important;  left: 95px !important;  top: 3px !important;  color: #999999; font-size:10px;  text-align:left;  overflow:hidden !important;  z-index:5000000 !important;  outline:1px solid gray; background:red;} .logo-section>div a {color:white !important; text-shadow:none !important; }');
  addGlobalStyle('.logo-container>div:hover {  position: fixed !important;   display:inline-block !important;    height:auto !important;   width:100% !important;   min-width:430px !important;  max-width:430px !important; padding: 5px 20px 5px 10px !important;   color:#999999;  font-size:15px !important;  text-align:left;    white-space: pre-wrap !important;   overflow:hidden; z-index:500 !important;  outline:1px solid gray;  background: blue !important; z-index: 5000000 !important; }');
  addGlobalStyle('.logo-container>div>a { display: inline-block !important; height: 15px !important; line-height: 15px !important; min-width:435px !important;  max-width:435px !important; color: white !important; text-shadow: none !important; overflow:hidden; text-overflow: ellipsis ; white-space: nowrap ; }');
  addGlobalStyle('.logo-container>div a:hover { display: inline-block !important; width:435px !important; color: gold !important; background: black ; text-shadow: none !important; }');
