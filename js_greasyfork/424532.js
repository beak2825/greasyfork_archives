// ==UserScript==
// @name        Lichess Display Country Flag
// @namespace   http://example.com
// @description Display username + rating + country flag in game ( if user registered his country in 'bio')
// @include     https://lichess.org/*
// @version     2
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/424532/Lichess%20Display%20Country%20Flag.user.js
// @updateURL https://update.greasyfork.org/scripts/424532/Lichess%20Display%20Country%20Flag.meta.js
// ==/UserScript==

setTimeout(function(){
 var $ = window.jQuery;

  var utop = window.document.getElementsByClassName('ruser-top')[0].innerText.split('\n')[0]
if(utop.indexOf(' ') > -1){utop = utop.substring(3);}
var url = 'https://lichess.org/api/user/'+utop;
var xhr = new XMLHttpRequest();
xhr.open("GET", url);

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
       var newsArr = JSON.parse(xhr.responseText);
       console.log(newsArr.profile.country);
	  if(xhr.responseText.indexOf('country') > -1){
	  var urlflag = 'https://lichess1.org/assets/_1FzRvx/images/flags/'+newsArr.profile.country+'.png'
	  var im = new Image (20,20);
	  im.src = urlflag;
	  document.getElementsByTagName('rating')[0].after(im);
      im.style.marginLeft = '10px';}
   }};

xhr.send();

var ubottom = window.document.getElementsByClassName('ruser-bottom')[0].innerText.split('\n')[0]
if(ubottom.indexOf(' ') > -1){ubottom = ubottom.substring(3);}
var url = 'https://lichess.org/api/user/'+ubottom;
var xhr2 = new XMLHttpRequest();
xhr2.open("GET", url);

xhr2.onreadystatechange = function () {
   if (xhr2.readyState === 4) {
      var newsArr2 = JSON.parse(xhr2.responseText);
	  if(xhr2.responseText.indexOf('country') > -1){
	  var urlflag = 'https://lichess1.org/assets/_1FzRvx/images/flags/'+newsArr2.profile.country+'.png'
	  var im = new Image (20,20);
	  im.src = urlflag;
	  document.getElementsByTagName('rating')[1].after(im);
      im.style.marginLeft = '10px';
	  }
   }};

xhr2.send() }, 100);