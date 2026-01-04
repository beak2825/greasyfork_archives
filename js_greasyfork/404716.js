// ==UserScript==
// @name        Github confetti spray on check
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*/issues/*
// @grant       none
// @version     1.0.1
// @author      Alice Hendicott
// @description Spray confetti when checking an item in markdown comment on github
// @downloadURL https://update.greasyfork.org/scripts/404716/Github%20confetti%20spray%20on%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/404716/Github%20confetti%20spray%20on%20check.meta.js
// ==/UserScript==

const checkboxClick = (e) => {
  
  const element = e.target
  const targetClassName = element.className
  const checked = element.checked
  const body = document.getElementsByTagName("BODY")[0];
  
  if(targetClassName === "task-list-item-checkbox" && checked) {
    
    var position = element.getBoundingClientRect();
    console.log("top", position.top);
    console.log("window scroll", window.scrollY)
    
    
    //Create overlay for page with position relative
    const overlay = document.createElement("div");
    overlay.style.cssText = "position: fixed; width: 100%; height:100%; top: 0; left: 0; right: 0; bottom: 0; z-index: 10;"
    
    //Create img at position absolute with top, left, right, bottom in overlay
    const confettiImg = document.createElement("img");
    confettiImg.src = "https://media.giphy.com/media/2UxQjTgqlYRMsZG3al/giphy.gif";
    confettiImg.style.position = "absolute"
    confettiImg.style.width = "140px"
    confettiImg.style.height = "300px"
    confettiImg.style.objectFit = "cover"
    confettiImg.style.top = `calc(${Math.round(position.top)}px - 200px)`
    confettiImg.style.left = `calc(${Math.round(position.left)}px - 140px)`
    confettiImg.style.transform = "scaleX(-1)"

    //Add image to overlay
    overlay.appendChild(confettiImg)
    
    //Add overlay to dom
    body.appendChild(overlay)
    
    //Remove overlay from dom once animation over
    setTimeout(() => body.removeChild(overlay), 3500)
  }
}

const checkboxes = document.getElementById("discussion_bucket").addEventListener("click", checkboxClick)
