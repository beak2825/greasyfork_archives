// ==UserScript==
// @name             Literotica Reader Dark
// @namespace   tuktuk3103@gmail.com
// @description   Typographical elements used to achieve an attractive, distinctive appearance that indicates finesse, elegance and sophistication
// @include          https://www.literotica.com/s/*
// @version          1
// @run-at            document-start
// @grant              none
// @icon                https://speedy.literotica.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/407312/Literotica%20Reader%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/407312/Literotica%20Reader%20Dark.meta.js
// ==/UserScript==

//Removes Ads

var head = document.getElementsByTagName('HEAD')[0];
var script1 = document.createElement('script');
script1.type = 'text/javascript';
script1.YETT_BLACKLIST = '[/ekplixi\.literotica\.com/]';
head.insertBefore(script1, head.childNodes[0]);
var script2 = document.createElement('script');
script2.type = 'text/javascript';
script2.src = 'https://unpkg.com/yett';
head.insertBefore(script2, head.childNodes[1]);

function PageLoaded () {

setTimeout(function(){

document.getElementById("b-top").remove();

//Whitespace margin provides visual breathing room for the eye that makes it look more approachable
document.querySelector('.x-r15.b-story-body-x').setAttribute('style', 'max-width:80%;');
document.querySelector('.x-r15.b-story-body-x').style.marginLeft = "5%";

document.getElementById("w").setAttribute('style', 'min-width:80%;');
document.getElementById("w").style.marginLeft = "5%";

document.getElementById("root").setAttribute('style', 'min-width:80%;');
document.getElementById("root").style.marginLeft = "5%";

//Generous vertical space separates lines of text that improves readability by almost 20%
document.querySelector('p').setAttribute('style', 'line-height:1.6;');

//Dark Mode for situations where you don't want to destroy your night vision
document.querySelector('p').insertAdjacentHTML('beforebegin', '<button id="bulb" class="i-button" type="button" name="dark" style="filter: drop-shadow(4px 6px 2px #808080);" aria-hidden="true"><span id="grey" style="filter: grayscale(0%);">&#x1F4A1</span></button><br><br>');

function dark() {
  var var1 = document.getElementById("w");
  var compStyles = window.getComputedStyle(var1);
  var bgcolor = compStyles.getPropertyValue('background-color').toString();
  var check = "rgb(47, 47, 47)";
  var grey = document.getElementById("grey");
  if(bgcolor == check) {
    document.getElementById("w").style.removeProperty('background-color');
    document.getElementById("root").style.removeProperty('background-color');
    document.querySelector('p').style.removeProperty('color');
    grey.style.removeProperty('filter');
  }else{
    document.getElementById("w").style.backgroundColor = "#2f2f2f";
    document.getElementById("root").style.backgroundColor = "#2f4f4f";
    document.querySelector('p').style.color = "#ffc200";
    grey.style.filter = "grayscale(100%)";
  }
};

document.getElementById("bulb").addEventListener('click', dark, false);

}, 1000);

};

window.addEventListener ('load', PageLoaded);