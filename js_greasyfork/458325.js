// ==UserScript==
// @name        SimpleMMO auto step
// @namespace   Violentmonkey Scripts
// @match       https://web.simple-mmo.com/*
// @grant       none
// @version     1.9.2
// @author      -
// @license MIT
// @description 15/01/2023 15:40:04
// @downloadURL https://update.greasyfork.org/scripts/458325/SimpleMMO%20auto%20step.user.js
// @updateURL https://update.greasyfork.org/scripts/458325/SimpleMMO%20auto%20step.meta.js
// ==/UserScript==

window.onclick=window.onclick = function () {};
var currentPath = window.location.pathname;


if (location.href.includes("?new_page=true") && !location.href.includes("/leaderboards/view/")){location.href = location.href.replace("?new_page=true","")}

var tabPressed = false;//press tab to stop the step process
document.addEventListener("keydown", function(event) {
  if (event.code === "Tab") {
    event.preventDefault();
    tabPressed = !tabPressed;
    if (typeof notyf == "undefined") {
      notyf = console
      notyf.success = notyf.info
    }
    if(tabPressed){
      notyf.success("mise en pause")
    }
    else{
      notyf.success("reprise")
    }
  }
});

//functions that click
function clickTravel() {
  var button = document.querySelector("#step_button");
  if(button && tabPressed==false){
    if (!document.body.innerText.includes("Perform Verification")){
      if (!document.body.innerText.includes("I'm not a pesky machine")){
        button.click();
        setTimeout(function() {
              var link = document.querySelector("a[href^='/npcs/attack/']");
              if(link){
                  window.location.href = link.href;
              }
          }, 1000);
        setTimeout(function() {
              var link = document.querySelector("a[href^='/crafting/material/gather/']");
              if(link){
                  window.location.href = link.href;
              }
          }, 1000);
        setTimeout(function() {
          let buttons = document.getElementsByTagName("button");
          for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            if ((button.innerText.includes("Mine") || button.innerText.includes("Salvage") || button.innerText.includes("Chop") || button.innerText.includes("Catch")) && SkillLevel()===true) {
              button.click();
              break;
            }
          }
        }, 1000);
      }
    }
  }
  var link = document.querySelector("a[href^='/i-am-not-a-bot']");
            if(link){
                window.location.href = link.href;
            }
}

function clickAttack() {
  if(tabPressed==false){
    var buttons = document.querySelectorAll("button");
    for(var i = 0; i < buttons.length; i++) {
      if (ChickenDinner()) {
        if(document.referrer==="https://web.simple-mmo.com/battle/arena"){
          setTimeout(window.history.back(),300);
        }
        else{
            window.location.href="https://web.simple-mmo.com/travel"
        }
        break;
      }
      if(buttons[i].textContent.trim() === "Attack" && tabPressed==false) {
         buttons[i].click();
         break;
      }
    }
    var link = document.querySelector("a[href^='/i-am-not-a-bot']");
            if(link){
                window.location.href = link.href;
            }
  }
}

function clickGather() {
  if(tabPressed==false){
    let buttons = document.getElementsByTagName("button");
          for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            if (button.innerText.includes("Gather") || button.innerText.includes("Press here to gather")) {
              button.click();
              break;
            }
            if (button.innerText.includes("Press here to close")) {
              button.click();
              break;
            }
          }
    var link = document.querySelector("a[href^='/i-am-not-a-bot']");
            if(link){
                window.location.href = link.href;
            }
  }

}

function ConfirmationDone() {
  if(tabPressed==false){
    if(document.querySelector("[class='swal2-success-ring']")!=null)
      {
        window.location.href ="https://web.simple-mmo.com/travel"
      }
  }
}

//if it's on the correct page execute the correct function
if(currentPath.startsWith("/travel")){
    setInterval(clickTravel, 1000);
}

if(currentPath.startsWith("/npcs/attack/")){
  if (!location.href.includes("?new_page=true")){
  setInterval(clickAttack, 400);
  }
}

if(currentPath.startsWith("/crafting/material/gather/")){
  if (!location.href.includes("?new_page=true")){    setInterval(clickGather, 500);
  }
}

if(currentPath.startsWith("/i-am-not-a-bot")){
  var test2 = new Date();
  console.log(test2.getHours())
  console.log(test2.getMinutes())
  setInterval(ConfirmationDone, 2000);;
}


function ChickenDinner(){
  if(tabPressed==false){
    const pageText = document.body.innerText;
    if (pageText.includes("chicken dinner")) {
      return(true);
    } else {
      return(false);
    }
  }
}

function SkillLevel() {
  const element = document.querySelector("[x-html='travel.text']");
  const text = element.innerHTML;
  if (text.includes("Your skill level isn't high enough")) {
    return(false)
  }
  else{
    return (true)
  }
}

if(window.location.href==="https://web.simple-mmo.com/travel")
{
  var originalFetch = window.fetch;
  window.fetch = function(...args) {
      const requestBody = args[1] && args[1].body;
    if (!requestBody) {return originalFetch.apply(this, args)}
      var modifiableArgs = args
      for (const [key, value] of requestBody) {
               if (value == "true" && key=="s") {
                  modifiableArgs[1].body.set("s","false")
              }
              if (value == "0") {
                var d_1 = document.querySelector("#step_button");
                modifiableArgs[1].body.set("d_1",Math.round(d_1.getBoundingClientRect().y+1+Math.random()*35))
              }
              if (value == "0") {
                var d_2 = document.querySelector("#step_button");
                modifiableArgs[1].body.set("d_2",Math.round(d_2.getBoundingClientRect().y+1+Math.random()*6))
              }
      }
      // Call the original fetch function for all other requests
      return originalFetch.apply(this, modifiableArgs)
  .catch(() => {
    location.reload();
  });
  }
}
