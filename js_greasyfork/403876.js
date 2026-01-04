// ==UserScript==
// @name         captcha
// @namespace    c
// @version      0.2
// @description  press j to show hide/show captcha - when you solve captcha but it glitches and won't go away
// @author       Recruiter6061#8864 
// @match        *://*.agar.io/*
// 

// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403876/captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/403876/captcha.meta.js
// ==/UserScript==


  document.addEventListener("keydown", function(){
   if (event.which === 74)
   {myFunction();}
  })

function myFunction() {
    var x = document.getElementById("captchaWindow");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

  };