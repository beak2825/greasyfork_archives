// ==UserScript==
// @name         "view replies" auto expander
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  click on "view replies (500)" and it will click on the same button until all replies open.
// @author       goodwin64
// @match        *://instagram.com/*
// @match        *://www.instagram.com/*
// @namespace    instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409169/%22view%20replies%22%20auto%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/409169/%22view%20replies%22%20auto%20expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const markedElements = new Set();

    function listenToExpandClicks() {
      [...document.getElementsByTagName('span')]
        .filter(el => el.innerText.toLowerCase().includes('view'))
        .forEach(el => {
          if (!markedElements.has(el)) {
            el.addEventListener('click', handleViewRepliesClick);
            markedElements.add(el);
          }
        });
    }
    
    function howMuchRepliesLeft(str) {
      const repliesCountMatch = str.match(/.*\((\d*)\)/)
      return repliesCountMatch ? Number(repliesCountMatch[1]) : 0;
    }
    
    function handleViewRepliesClick() {
      clickIfExpandable(this);
    }
    
    function clickIfExpandable(el) {
      const repliesLeft = howMuchRepliesLeft(el.innerText);
      if (repliesLeft > 0) {
        el.click();
        setTimeout(() => {
          clickIfExpandable(el);
        }, 1000);
      } else {
        el.removeEventListener('click', handleViewRepliesClick);
        markedElements.delete(el);
      }
    }
    
    setInterval(listenToExpandClicks, 3000);
})();
