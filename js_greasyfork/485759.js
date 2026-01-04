// ==UserScript==
// @name        Find External Requests
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Find all instances of "::external_request:[any url]::" on a page, send a request to "https://cors-anywhere.herokuapp.com/[URL]", retrieve the contents of that response, parse it, and return the contents of the "body" element
// @author      Seamus James and ChatGPT
// @match       *://chat.openai.com/chat*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/485759/Find%20External%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/485759/Find%20External%20Requests.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    const requestedUrls = [];
    const regex = /::external_request:(.+?)::/g;
    const corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
  
    // Function to run the search
    function runSearch(initializing) {
      // Get all text on page
      let text = document.body.textContent;
  
      let match;
      while ((match = regex.exec(text)) !== null) {
        const url = match[1];
        const fullUrl = corsAnywhereUrl + url;
  
        if ( ['[URL]', 'http://www.timeanddate.com'].includes(url) ) continue;
  
        if ( requestedUrls.includes(url) ) continue;
        requestedUrls.push(url);
  
        if ( initializing ) continue;
        console.log(`Matched: ${url}`);
  
        // Send request to cors-anywhere
        fetch(fullUrl)
          .then(response => response.text())
          .then(text => {
            // Parse response text as HTML
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(text, "text/html");
  
            // Get contents of "body" element
            const body = htmlDoc.body.innerText.slice(0,4192);
            const textArea = document.querySelector('textarea');
            const button = document.querySelector('textarea + button');
            textArea.value=body;
            button.click();
          })
          .catch(error => console.error(error));
      }
      if ( initializing ) {
          console.log("Initialized", requestedUrls);
      }
    }
  
    // Run the search initially
    runSearch(true);
  
    // Observe changes to the text content of the page
    const observer = new MutationObserver(() => runSearch(false));
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  })();