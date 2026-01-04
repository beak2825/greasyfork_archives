// ==UserScript==
// @name             Literotica Reader Dark (for Beta)
// @namespace   tuktuk3103@gmail.com
// @description   Dark Mode for situations where you don't want to destroy your night vision
// @include          https://www.literotica.com/beta/s/*
// @version          1
// @grant              none
// @icon                https://speedy.literotica.com/authenticate/favicon-9238b3a65e563edb3cf7906ccfdc81bb.ico
// @downloadURL https://update.greasyfork.org/scripts/407313/Literotica%20Reader%20Dark%20%28for%20Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407313/Literotica%20Reader%20Dark%20%28for%20Beta%29.meta.js
// ==/UserScript==

function pageFullyLoaded () {

setTimeout(function(){

//Removes Ads
document.querySelector(".w_ew").remove();

//Dark Mode for situations where you don't want to destroy your night vision
document.querySelector('.aa_eQ.panel').insertAdjacentHTML('afterbegin', '<div id="dark" class="button button--brand" title="Dark Mode"><i class="icon icon-font undefined" style="color:black"></i>&nbsp;&nbsp;&nbsp;<i class="icon icon-arrow-right undefined" style="color:black"></i>&nbsp;&nbsp;&nbsp;<i class="icon icon-font undefined" style="color:#ffc200"></i></div><br><br>');

function toggledark() {
  var menu = document.getElementById("dark").getElementsByTagName('i')[1];
  var bg = document.querySelector(".page__main.page__main-wrapper.clearfix");
  var div1 = document.querySelector(".aa_eQ.panel");
  var var1 = div1.getElementsByTagName('p');
  var compStyles = window.getComputedStyle(div1);
  var bgcolor = compStyles.getPropertyValue('background-color').toString();
  var check = "rgb(47, 79, 79)";
  if(bgcolor == check) {
    menu.className = "icon icon-arrow-right undefined";
    bg.style.removeProperty('background-color');
    div1.style.removeProperty('background-color');
    for(var i = var1.length; i--;) {
      var1[i].style.removeProperty('color');
      var1[i].style.removeProperty('margin-left');
    }
  } else {
    menu.className = "icon icon-arrow-left undefined";
    bg.style.backgroundColor = "#2f2f2f";
    div1.style.backgroundColor = "#2f4f4f";
    for(var i = var1.length; i--;) {
      var1[i].style.color = "#ffc200";
      var1[i].style.marginLeft = "2%";
    }
  }
};

document.getElementById("dark").addEventListener('click', toggledark, false);

}, 1000);

};

window.addEventListener ("load", pageFullyLoaded);