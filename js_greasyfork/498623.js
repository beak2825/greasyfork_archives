// ==UserScript==
// @name     old reddit sidebar hider
// @description hides the sidebar of old reddit when you scroll down
// @version  1
// @grant    none
// @match    https://old.reddit.com/*
// @namespace https://greasyfork.org/users/1322440
// @downloadURL https://update.greasyfork.org/scripts/498623/old%20reddit%20sidebar%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/498623/old%20reddit%20sidebar%20hider.meta.js
// ==/UserScript==


let lastScrollTop = 0;
const targetElement = document.querySelector('.side');
const content = document.querySelector('body > .content');

function checkScrollDirection() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > 10){
    targetElement.style.display = 'none';
    content.style.margin = '16px 16px 64px 16px';
  } else {
    targetElement.style.display = 'block';
    content.style.margin = '16px 352px 64px 16px';
  }
  lastScrollTop = scrollTop <= 0? 0 : scrollTop; // For Mobile or negative scrolling
}

window.addEventListener('scroll', checkScrollDirection);