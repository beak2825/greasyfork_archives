// ==UserScript==
// @name        Blow up Stream in Google Classroom
// @description Change out all the links that go to the Stream tab to the Classwork tab, except the Stream tab button
// @match https://classroom.google.com/*
// @namespace   test
// @version     1.2
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528056/Blow%20up%20Stream%20in%20Google%20Classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/528056/Blow%20up%20Stream%20in%20Google%20Classroom.meta.js
// ==/UserScript==

const target = document.body

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
        const links = document.getElementsByTagName('a');
       	const regexFull = /\/u\/1\/c\/(.*)$/i;
    
        for (var i = 0; i < links.length; i++) {
          if (links[i].href.includes("details")) {
            continue
          }
          
          if (links[i].getAttribute("tabindex") == "-1" || links[i].getAttribute("data-focus-id")?.length > -1) {
            links[i].href = links[i].href.replace(regexFull, '/u/1/w/$1/t/all');
          }
        }
  });
});

const config = {
  childList: true,
    subtree: true,
};

observer.observe(target, config);