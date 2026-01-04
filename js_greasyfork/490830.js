// ==UserScript==
// @name         Udemy batch downloader
// @version      1
// @description Simple batch downloader for Udemy Course Resources 
// @author       GZT028
// @match    https://*.udemy.com/course/*
// @icon       https://cdn-icons-png.flaticon.com/512/4241/4241580.png
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1279191
// @downloadURL https://update.greasyfork.org/scripts/490830/Udemy%20batch%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/490830/Udemy%20batch%20downloader.meta.js
// ==/UserScript==



window.addEventListener("keydown", checkKeyPressed, false);



function Start (){


    Array.from(document.getElementsByClassName("ud-btn ud-btn-large ud-btn-link ud-heading-md ud-accordion-panel-toggler accordion-panel-module--panel-toggler--WUiNu accordion-panel-module--outer-panel-toggler--Pxwxc")).forEach((y)=>{
y.click()})



var names = Array.from(document.getElementsByClassName("resource--ellipsis--5f0S7"))

names.forEach((x, i) => {
  setTimeout(() => {
    x.click();
  }, i * 3000);
});

}
function checkKeyPressed(evt) {

    if (evt.keyCode == "106" ) {
        Start ();
    }
}