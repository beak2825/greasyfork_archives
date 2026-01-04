// ==UserScript==
// @name         Trakt.tv Ninja
// @namespace    http://tampermonkey.net/
// @description  add aiosearch button to trakt.tv for movies and tv shows
// @author       Gorybloodfest
// @version      1.0
// @match      http*://trakt.tv/shows/*
// @match      http*://trakt.tv/movies/*
// @exclude    https://trakt.tv/shows/trending
// @exclude    https://trakt.tv/movies/trending
// @require    http://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/387391/Trakttv%20Ninja.user.js
// @updateURL https://update.greasyfork.org/scripts/387391/Trakttv%20Ninja.meta.js
// ==/UserScript==
if (window.top != window.self) // Don't run on frames or iframes
{
  return;
}

var sheet = document.createElement('style')
sheet.innerHTML = "#niceButton {background: black; color: white; border: solid 1px red; opacity: 0.3; font-size: large; transition-property: opacity; transition-duration: 1s; transition-timing-function: ease-out;} #niceButton:hover {opacity: 1.0; transition-property: opacity; transition-duration: 1s; transition-timing-function: ease-out;} }";
document.body.appendChild(sheet);

// <----Grabs meta info for tv show movie and episode/season number--------------------------------->
// alert(document.querySelector("meta[property='og:title']").getAttribute('content'));

// <----assigns dollar sign to jquery so it doesnt give error in editor----------------------------->
window.jQuery.noConflict();
var $ = window.jQuery;

// <-------Checks if DOM is ready Dont delete this------>
$(document).ready(function(){

// <------META Grabber------>
var metaInfo = document.querySelector("meta[property='og:title']").getAttribute('content').split('\"')[0];
var metaInfo2 = document.querySelector("meta[property='og:title']").getAttribute('content')

// <------Image------>
var img = document.createElement("img");
img.src = "https://lh3.googleusercontent.com/DfP4M6AmBTlmQcw7NpEy_Dj1OtbkfWbELxUdSl8Cv9RG8gdwJY7Vqd00YHfk06OyWvK8xQCFA-4MQ-GAhqdHwSfijAyMxVUOM4AzSWQprT8lxnYvSfd2Eu3Zuqzz6MplbOVz65qJ7uYVhtNDBxlIhRVMVe6w6-oiLswhc9zEPIfPqxyKEu5mO5KBXRs1w8gSPnDkmCadPRdQnBAU2Zm2PdfPYrWHQQzoxVBthQGS2rd_PCYhiVw5EfYbTqWwIqoHcELVDdduLr74j8WjBamJhNyfpdnssVxauG4_gDDCERPa7c77tbMoypbA4Iu1BgBe5mM1q3Ml_qbk5wnr9eU-_YYe9RV-02atcMH3Ij20a6g4zrpIQ6CmllA-BTBpB33GxJY6hnHurRL_oB1SwZnXYB3Zlwel9hTqx-ZSrWyrTIsTzD5JPH1cVyCYc__Tm9MfTZg7QqWYoGemOQ_PO1jSWIRNuBQhIKDDHRtnMkErrdSQPPHoGvi19LsKj5ZhjxWPiX7j4jCK7yBa-TJQZf6zq2YhqVd7SAHpo-9K1GN_4hOB-BZLsFXK-42JcaeCuScLJhKzLU_19j1kLFwDPdJSBzqI3ESNX8vaWLieA9Qqo8MWWtyFFJGhzpmCQIjIO0Z1nJIsQlvqdtdxik9U-BcWu0uIIXypd2ss-9VUiA7vTJ3SUmsBxp0FXItTa6SdR8ayJ0LeMLYjQtDkObWcNaX1XAjD=s480-no";
img.style.width = "96px";
img.style.height = "96px";
img.style.position = "fixed";
img.style.bottom = "0";

var src = document.getElementsByTagName("body")[0];
src.appendChild(img);
// <-------------AIOSEARCH-------------->
var button1 = document.createElement("button");
button1.setAttribute("id", "niceButton");
button1.innerHTML = "AioSearch";
button1.style.position = "fixed";
button1.style.bottom = "0";
button1.style.left = "85px";


var overview1 = document.getElementsByTagName("body")[0];
overview1.appendChild(button1);

var aioSearch = 'http://www.aiosearch.com/search/4/Torrents/';

button1.addEventListener ("click", function openInNewTab(){
  var win = window.open(aioSearch + metaInfo, '_blank');
}); // End Function 1

// <--------------snahpit---------------->
var button2 = document.createElement("button");
button2.setAttribute("id", "niceButton");
button2.innerHTML = "snahpit";
button2.style.position = "fixed";
button2.style.bottom = "0";
button2.style.left = "190px";



var overview2 = document.getElementsByTagName("body")[0];
overview2.appendChild(button2);

var snahpit = "https://snahp.it/?s=";

button2.addEventListener ("click", function openInNewTab2() {
  var win2 = window.open(snahpit + metaInfo);
}); // End Function openInNewTab2

// <------------ololo---------------->
var button3 = document.createElement("button");
button3.setAttribute("id", "niceButton");
button3.innerHTML = "ololo";
button3.style.position = "fixed";
button3.style.bottom = "0";
button3.style.left = "270px";



var overview3 = document.getElementsByTagName("body")[0];
overview3.appendChild(button3);

button3.addEventListener ("click", function openInNewTab3() {
  var win3 = window.open("https://ololo.to/s/" + metaInfo, + "_blank");
}); // End Function openInNewTab2


// <------------Torrents Csv---------------->
var button4 = document.createElement("button");
button4.setAttribute("id", "niceButton");
button4.innerHTML = "Torrents Csv";
button4.style.position = "fixed";
button4.style.bottom = "0";
button4.style.left = "329px";



var overview4 = document.getElementsByTagName("body")[0];
overview4.appendChild(button4);

metaInfo2 = metaInfo2.replace(/:/g, " ");
metaInfo2 = metaInfo2.replace(/-/g, " ");

button4.addEventListener ("click", function openInNewTab4() {
  var win4 = window.open("https://torrents-csv.ml/#/search/torrent/" + metaInfo2 + "/1", + "_blank");
}); // End Function openInNewTab2
console.log(metaInfo2);
}); // End Check if DOM is READY