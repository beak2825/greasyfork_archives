// ==UserScript==
// @name        Ynet expand all talkbacks
// @namespace   http://tampermonkey.net/
// @match       http*://*.ynet.co.il/*article*/*
// @grant       none
// @version     1.1
// @author      elig0n
// @description  expand all talkbacks
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/418978/Ynet%20expand%20all%20talkbacks.user.js
// @updateURL https://update.greasyfork.org/scripts/418978/Ynet%20expand%20all%20talkbacks.meta.js
// ==/UserScript==

console.log("Ynet open : starting");

window.toggle_all_talkbacks = function () {
  console.log("Ynet open : inner function running");

    var y = document.querySelector(".showMoreCommentsButton")
    if (y != null) y.click()
    setTimeout(() => { 
        var x = document.querySelectorAll(".commentTitle") ;
        x.forEach((el) => { el.click() ; }); 
    } , 300);
  };

window.addEventListener("load", function(event) {
    console.log("Ynet open : event listener running");

    var section = document.querySelector("#SiteArticleComments > div:nth-child(1) > div > div.topPanel > div")
    var ourspan = document.createElement("span")
    ourspan.setAttribute("class", "selectLabel")
    var ourbutton = document.createElement("button")
    ourbutton.setAttribute("title", "open all")
    ourbutton.setAttribute("onclick", "javascript:toggle_all_talkbacks()")
    ourbutton.innerText = "פתח הכל"

    ourspan.appendChild(ourbutton)
    section.insertBefore(ourspan, section.childNodes[0])
});