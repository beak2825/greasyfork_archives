// ==UserScript==
// @name         Kbin Remove Reputation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove reputation points from user's profile. Navigate Kbin unbiased.
// @author       minnieo
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://karab.in/*
// @match        https://www.kbin.cafe/*
// @match        https://karab.in/*
// @match        https://readit.buzz/*
// @match        https://forum.fail/*
// @match        https://fedi196.gay/*
// @match        https://feddit.online/*
// @match        https://kbin.run/*
// @match        https://nadajnik.org/*
// @match        https://kbin.cafe/*
// @match        https://kbin.lol/*
// @match        https://nerdbin.social/*
// @match        https://kbin.lgbt/*
// @match        https://kbin.place/*
// @match        https://kopnij.in/*
// @match        https://kbin.sh/*
// @match        https://kayb.ee/*
// @match        https://wiku.hu/*
// @match        https://kbin.chat/*
// @match        https://fediverse.boo/*
// @match        https://tuna.cat/*
// @match        https://kbin.dk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470155/Kbin%20Remove%20Reputation.user.js
// @updateURL https://update.greasyfork.org/scripts/470155/Kbin%20Remove%20Reputation.meta.js
// ==/UserScript==


// check if reputation removal is enabled
let repEnabled = localStorage.getItem('repEnabled') === 'true';


function reputation() {
  const currentURL = window.location.href;
  

  if (!repEnabled) {
    return;
  }

  const popover = document.getElementById('popover')
  if (popover) {
    popover.addEventListener('openPopover', (e) => {
    const element = e.target;
    const liElement = element.querySelector('li:nth-child(2)');
    if (liElement)  {
      liElement.remove();
   
    }
  });
  if (currentURL.startsWith('https://kbin.social/u/')) {
    document.querySelector('.section.user-info .info li:nth-child(2)').remove();
  } else {
    return;
  }
  
}
 
}



reputation();



// checkbox (toggle on and off)
const headerMenu = document.querySelectorAll('#header.header menu')[1];
const profileDropdown = headerMenu.querySelectorAll('li.dropdown')[2];
const repToggleCont = document.createElement('li');
const repToggle = document.createElement('a');
repToggle.className = repEnabled ? 'fa-solid fa-square-check' : 'fa-solid fa-square';
repToggle.title = repEnabled ? 'Show reputation (reloads page)' : 'Hide reputation';
repToggleCont.appendChild(repToggle)
headerMenu.appendChild(repToggleCont);

repToggle.addEventListener('click', () => {
  repEnabled = !repEnabled;
  localStorage.setItem('repEnabled', repEnabled);

  if (repEnabled) {
    repToggle.classList.replace('fa-square', 'fa-square-check');
    reputation();
  } else {
    repToggle.classList.replace('fa-square-check', 'fa-square');
    location.reload();
  }

  
});




