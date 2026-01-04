// ==UserScript==
// @name         LOLZ_Delete Chat GPT
// @namespace    LOLZ_Delete Chat GPT
// @version      0.3
// @description  Delete Chat GPT from Threads
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @match        https://zelenka.guru
// @match        https://lolz.guru
// @match        https://lolz.live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/478957/LOLZ_Delete%20Chat%20GPT.user.js
// @updateURL https://update.greasyfork.org/scripts/478957/LOLZ_Delete%20Chat%20GPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const elements = document.querySelectorAll('[id^="post-"]');
    	elements.forEach(element => {
            const chatGPTElement = element.querySelector('a[href="members/6772870/"]');
    		if (chatGPTElement) element.remove();
    	});
    }

    async function ones(element) {
      const addedNodeClass = element.classList;
      if(addedNodeClass.contains("comment") || addedNodeClass.contains("post") || addedNodeClass.contains("message")) {
          const chatGPTElement = element.querySelector('a[href="members/6772870/"]');
          if (chatGPTElement) element.remove();
      }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(addedNode => {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              ones(addedNode);
            }
          });
        }
      }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    init();
})();