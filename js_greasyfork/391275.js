// ==UserScript==
// @name AdBlockblockblock4fe
// @namespace Violentmonkey Scripts
// @match https://www.ap-siken.com/apkakomon.php
// @match https://www.ap-siken.com/s/apkakomon.php
// @run-at document-end
// @grant none
// @description Script that corrects the bug that the explanation text cannot be read due to Javascript execution restriction
// @version 0.8
// @downloadURL https://update.greasyfork.org/scripts/391275/AdBlockblockblock4fe.user.js
// @updateURL https://update.greasyfork.org/scripts/391275/AdBlockblockblock4fe.meta.js
// ==/UserScript==


document.querySelectorAll(".selectBtn").forEach(
  function(e){
    e.addEventListener(
      "click",
      function(){
        console.log("style updated!");
        document.querySelector("div#kaisetsu .ansbg").setAttribute("style","");
      }
    );
  }
);

document.querySelectorAll(".selectBtn li a").forEach(
  function(e){
    e.addEventListener(
      "click",
      function(){
        console.log("button click");
        document.querySelectorAll(".aPage .roundBox .sentence").forEach(
          function(e){
            e.setAttribute("style","");
          }
        );
      },
      true
    );
  }
);
