// ==UserScript==
// @name        The Bouncer
// @match       https://app.hey.com/
// @version     1.0
// @author      caffo
// @description 1/21/2021, 10:05:44 AM
// @namespace https://greasyfork.org/users/745671
// @downloadURL https://update.greasyfork.org/scripts/423007/The%20Bouncer.user.js
// @updateURL https://update.greasyfork.org/scripts/423007/The%20Bouncer.meta.js
// ==/UserScript==


  window.caffoTotal =  caffoCalc();
  window.blocker = document.createElement('div');
  window.blocker.classList="caffoBlocker";
  window.blocker.style.cssText="position: fixed;top: 0;left: 0;width: 100%;background: var(--color-bg--main);height: 100%;z-index: 1000; color: #fff;"


  window.blocker.style.cssText="position: fixed;top: 0;left: 0;width: 100%;background: var(--color-bg--main);height: 100%; z-index: 1000; color: #fff; display: flex; justify-content: center;"
  window.blocker.innerHTML="<div class='caffoInner popup-menu' style='margin: 10% auto; text-align: center; overflow: hidden; height: 300px;'><h1 style='font-size: 10rem;' id='caffoCount'>0</h1><h3  id='caffoCloseTR' style='font-weight: 100;'>&nbsp;&nbsp;&nbsp;&nbsp;</h3></div>"
  
  document.body.style.overflow="hidden";
      
  document.body.appendChild(window.blocker); 

  // compute counter
  counterElement = document.getElementById('caffoCount');
  counterElement.innerText = window.caffoTotal;

  // trigger 
  closeTR = document.getElementById('caffoCloseTR');
  closeTR.addEventListener("click", caffoClose);

function caffoClose(){
  if (window.caffoTotal == 0) {
  const first  =  Math.floor(Math.random() * 9) + 1;
  const second =  Math.floor(Math.random() * 9) + 1;
  const third  =  Math.floor(Math.random() * 9) + 1;
  
  const answer = (first * second) + third;
  
  const user = prompt(`(${first} * ${second}) + ${third}`);
  if (user == answer){
    document.body.removeChild(window.blocker);
    document.body.style.overflow="";
  }  
  } else {
    document.body.removeChild(window.blocker);
    document.body.style.overflow="";    
  }
}

function caffoCalc(){
  // email in inbox
  // return document.getElementsByClassName('posting__status--unseen').length;
  // VIP emails
  vips = document.querySelectorAll('[aria-label=", Filed in VIP,"]');
  return Array.from(vips).filter(x => x.closest('article').attributes['data-list-unseen-target'] !== undefined).length;
}

function caffUpdate(){
  window.caffoTotal =  caffoCalc();
  counterElement = document.getElementById('caffoCount');
  counterElement.innerText = window.caffoTotal;
}

setInterval(function(){ caffoUpdate() }, 60000);