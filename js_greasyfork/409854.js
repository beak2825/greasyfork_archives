// ==UserScript==
// @name         Clickable Usernames in chat
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  allows the usernames to be clickable like the playerlist
// @author       Two
// @match        https://sketchful.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409854/Clickable%20Usernames%20in%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/409854/Clickable%20Usernames%20in%20chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

document.head.insertAdjacentHTML("beforeend", `<style>
  .hoverTextt:hover{
      transform: scale(1.03);
  }

</style>`)

  $('#gameChatList').on('DOMNodeInserted', 'li', function (event) {
      var x = document.querySelectorAll(".gameAvatarName")
      var f = document.querySelectorAll(".hoverTextt")
    if (event.target = 'li' && event.originalEvent.path[0].nodeName.toLowerCase() == 'li' && event.originalEvent.path[0].className != "chatAdmin") {
      //console.log(event.originalEvent.path[0])
      var i;
      var res;
      for (i = 0; i < x.length; i++) {
          if(!event.originalEvent.path[0].firstChild.firstChild.children.length){
        if (x[i].innerHTML + ": " == event.originalEvent.path[0].firstChild.firstChild.textContent) { res = x[i]; break; }
          }else{
        if (" "+x[i].innerHTML + ": " == event.originalEvent.path[0].firstChild.firstChild.textContent) { res = x[i]; break; }
          }
      }      event.originalEvent.path[0].className = "hoverTextt"
      event.originalEvent.path[0].setAttribute("onclick", res.parentElement.parentElement.getAttribute('onclick'))
    }else{
             if(event.target = 'li' && event.originalEvent.path[0].nodeName.toLowerCase() == 'li'&& event.originalEvent.path[0].firstChild.innerText.endsWith("left!") && event.originalEvent.path[0].className == "chatAdmin" &&  event.originalEvent.path[0].firstChild.getAttribute("color") == "red"){
           //console.log(event.originalEvent.path[0])
           //console.log(event.originalEvent.path[0].firstChild.innerText.replace(/\w+[.!?]?$/, '') +" has left!")
      var e;
      for (e = 0; e < f.length; e++) {
          //console.log(f[e].firstChild.firstChild.textContent.slice(0, -2) + " ")
          //console.log(event.originalEvent.path[0].firstChild.innerText.replace(/\w+[.!?]?$/, ''))
           if(f[e].firstChild.firstChild.textContent.slice(0, -2) + " " == event.originalEvent.path[0].firstChild.innerText.replace(/\w+[.!?]?$/, '')){
           f[e].classList.remove("hoverTextt")
           f[e].removeAttribute("onclick")
           }
      }
        }
    }
  });
})();