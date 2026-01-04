// ==UserScript==
// @name         IF picture fixer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  changes thumbnail href to full images, fixing option for those that don't fit pattern
// @author       You
// @match        https://www.imagefap.com/pictures/*
// @grant        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374383/IF%20picture%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374383/IF%20picture%20fixer.meta.js
// ==/UserScript==

/*
let cache = {};
Array.from(document.querySelectorAll("font")).filter(el => el.color==="#000000" && el.face==="verdana").forEach((el, i) => cache[i] = el.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].href);
*/

let uploaderText;
Array.prototype.forEach.call(document.querySelectorAll("b"), function(el) {if (el.innerText.includes("Uploaded by ")) uploaderText = el.innerText.slice(12, el.innerText.length);});


Array.from(document.querySelectorAll("a")).forEach(function(el) {
  if (el.href.split("/")[3] === "photo" && el.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText.slice(-3) !== "...") {
    el.href = "https://x.imagefapusercontent.com/u/" + uploaderText + "/" + window.location.href.split("/")[4] + "/" + el.href.split("/")[4] + "/" + el.parentNode.parentNode.parentNode.children[1].children[0].innerText;
  }
});

Array.from(document.querySelectorAll("font")).filter(el => el.color==="#000000" && el.face==="verdana").forEach(el => el.innerHTML += `<br><span class='fixImg'>${el.parentNode.children[1].innerText.slice(-3) === "..." ? "Click here to fix." : "Fixed!"}</span>`);


Array.from(document.getElementsByClassName("fixImg")).forEach((el, i) => el.addEventListener("click", function(e) {
  el.innerText = "Fixing...";
  //console.log("url", cache[i]);
  $.ajax({
    type: "GET",
    url: el.parentNode.parentNode.parentNode.parentNode.querySelector("a").href,
    success: function(data) {
      //let newURL = data.match(/https:\/\/x\.imagefapusercontent\.com\/u\/\w+\/\d+\/\d+\/w+\.\w+/);
      let newURL = data.match(/<noscript[\s\S]+<img id="mainPhoto".+src="([^"]+)"/)[1];
      if (newURL === null) el.innerText = "Sorry, error!";
      else {
        el.parentNode.parentNode.parentNode.parentNode.querySelector("a").href = newURL;
        el.innerText = "Fixed!";
      }
    },
    error: function(data) {
      el.innerText = "Error (hover for info).";
      el.title = data;
    }
  });
}));

