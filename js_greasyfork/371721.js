// ==UserScript==
// @name 60 Second Rule
// @version 1.0
// @description  Spams the submit button every 1 seconds until the forum post submits
// @match *://scratch.mit.edu/*
// @namespace https://greasyfork.org/users/208839
// @downloadURL https://update.greasyfork.org/scripts/371721/60%20Second%20Rule.user.js
// @updateURL https://update.greasyfork.org/scripts/371721/60%20Second%20Rule.meta.js
// ==/UserScript==
if(document.getElementsByClassName("errorlist").length == 1){
  if(document.getElementsByClassName("errorlist")[0].children[0].innerHTML == "Sorry, you have to wait 60 seconds between posts."){
    window.n = window.setInterval(function(){document.getElementsByName("AddPostForm")[0].click();}, 1000);
    var g = document.createElement("BUTTON");
    g.innerHTML = "Cancel Userscript";
    g.addEventListener("click", function(){
      g.width = 0;
      g.height = 0;
      window.clearInterval(window.n);

    });
    document.getElementsByClassName("errorlist")[0].children[0].appendChild(g);
  }
}