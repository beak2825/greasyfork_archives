// ==UserScript==
// @name     Arrow-command-JVC
// @version  1
// @grant    none
// @description:fr Naviguation avec les fleches sur jvc
// @match          https://*.jeuxvideo.com/forums/*
// @match          http://*.jeuxvideo.com/forums/*
// @namespace Arrow-command-JVC
// @description Naviguation avec les fleches sur jvc
// @downloadURL https://update.greasyfork.org/scripts/395556/Arrow-command-JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/395556/Arrow-command-JVC.meta.js
// ==/UserScript==


body = document.getElementsByTagName("body")[0].addEventListener("keydown", myFunction);

function myFunction(keypress) {
  console.log(keypress);
  if(keypress.keyCode == 39) //right
    document.getElementsByClassName("pagi-suivant-actif")[0].click()
  if(keypress.keyCode == 37) //left
    document.getElementsByClassName("pagi-precedent-actif")[0].click()
  if(keypress.altKey === true && keypress.keyCode == 38) //up
    document.getElementsByClassName("btn-actu-new-list-forum")[0].click()
}


