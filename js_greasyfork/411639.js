// ==UserScript==
// @name         BS zu MAL Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Besacker
// @match        *//bs.to//serie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411639/BS%20zu%20MAL%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/411639/BS%20zu%20MAL%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

let url = (window.location.pathname);
let urllist = url.split("/");
let namewithminus= urllist[2];
let name = namewithminus.split("-").join(" ");

 let myBtn = document.createElement('Button');
    myBtn.innerHTML = "Goto MAL";
    myBtn.addEventListener('click', function(event) {
            window.open("https://myanimelist.net/search/all?q="+name);
      });
    document.querySelector("#sp_left h2").appendChild(myBtn);
})();