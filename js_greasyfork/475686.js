// ==UserScript==
// @name        Youtube pour mon frère
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.6
// @license     MIT
// @run-at       document-start
// @author      Loliprane
// @description 19/09/2023 10:37:18
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/475686/Youtube%20pour%20mon%20fr%C3%A8re.user.js
// @updateURL https://update.greasyfork.org/scripts/475686/Youtube%20pour%20mon%20fr%C3%A8re.meta.js
// ==/UserScript==



/*let Remove_sec_link=setInterval(function(){
  document.querySelectorAll('[href*="/watch?v="]'+'[href*="&t="]').forEach(function(UwU){
    UwU.href=UwU.href.replace(UwU.href.match(/&t=[0-9]+s/)[0],"")
  })
}, 30)*/
let Expand_Subscription=setInterval(function(){
  if(document.querySelector("#endpoint"+'[role]'+'[title*="éléments supplémentaires"]')){
    document.querySelector("#endpoint"+'[role]'+'[title*="éléments supplémentaires"]').click()
    clearInterval(Expand_Subscription)
  }
}, 30)

var observer_Explorer = new MutationObserver(function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Check if added nodes match the criteria
      for (var node of mutation.addedNodes) {
        if(node.nodeType === Node.ELEMENT_NODE && node.matches('[title*="Tendances"]')){
          node.parentNode.parentElement.parentElement.remove()
          observer_Explorer.disconnect();
        }
      }
    }
  }
});
observer_Explorer.observe(document, { childList: true, subtree: true });

var observer_Videos = new MutationObserver(function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Check if added nodes match the criteria
      for (var node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('[href*="/@"]:not([href*="/videos"]):not([href*="/about"])')) {//redirect to /videos of a channel
          node.className=node.className.replace("yt-simple-endpoint","")
          node.href+="/videos"
          node.style.color='red';
          node.style.textDecoration = "none";
        }
        else if(node.nodeType === Node.ELEMENT_NODE && node.matches('[href*="/watch?v="]'+'[href*="&t="]')){//removes the seconds from the link
          node.href=node.href.replace(node.href.match(/&t=[0-9]+s/)[0],"")
        }
      }
    }
  }
});
observer_Videos.observe(document, { childList: true, subtree: true });

let Remove_Shorts= setInterval(function(){
  if(document.querySelector("#endpoint"+'[role]'+'[title="Shorts"]')){
    document.querySelector("#endpoint"+'[role]'+'[title="Shorts"]').remove()
    document.querySelector('[role="tab"]'+'[aria-label="Shorts"]').remove()
    clearInterval(Remove_Shorts)
  }
}, 30)
let Remove_Shorts2= setInterval(function(){
  if(document.querySelector('[role="tab"]'+'[aria-label="Shorts"]')){
    document.querySelector('[role="tab"]'+'[aria-label="Shorts"]').remove()
    clearInterval(Remove_Shorts2)
  }
}, 30)

let Remove_Others= setInterval(function(){
  if(document.querySelector("#endpoint"+'[role]'+'[title="YouTube Premium"]')){
    document.querySelector("#endpoint"+'[role]'+'[title="YouTube Premium"]').parentElement.parentElement.parentElement.remove()
    clearInterval(Remove_Others)
  }
}, 30)

let Remove_Notif= setInterval(function(){
  console.log("hello")
  if(document.querySelector(".yt-spec-icon-badge-shape__badge")){
    document.querySelector(".yt-spec-icon-badge-shape__badge").remove()
    clearInterval(Remove_Notif)
  }
}, 100)

let Remove_Notif_Title= setInterval(function(){
  if(document.title.match(/\([0-9]+\)\s/)){
    document.title=document.title.replace(document.title.match(/\([0-9]+\)\s/)[0],"")
    //clearInterval(Remove_Notif_Title)
  }
}, 100)



