// ==UserScript==
// @name         RTF Clipboard Intercept for GoodDay
// @version      1.2
// @description  Intercept clipboard copy for GoodDay tickets
// @author       Daniił Marcić
// @match        *://*.goodday.work/*
// @license      MIT
// @namespace https://greasyfork.org/users/1200385
// @downloadURL https://update.greasyfork.org/scripts/477861/RTF%20Clipboard%20Intercept%20for%20GoodDay.user.js
// @updateURL https://update.greasyfork.org/scripts/477861/RTF%20Clipboard%20Intercept%20for%20GoodDay.meta.js
// ==/UserScript==


const selectors = {
    number: 'div.title-line > div.right-controls.ui5-app-controls.in-header > div.ui5-property.txt-truncate.not-selectable',
    name: 'div.title-line > div.view-name > div.ui5-title-app-name'
}

async function copyToClipBoard(rich, plain) {
  if (typeof ClipboardItem !== "undefined") {
    // Shiny new Clipboard API, not fully supported in Firefox.
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility
    const html = new Blob([rich], { type: "text/html" });
    const text = new Blob([plain], { type: "text/plain" });
    const data = new ClipboardItem({ "text/html": html, "text/plain": text });
    await navigator.clipboard.write([data]).then();
  } else {
    // Fallback using the deprecated `document.execCommand`.
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#browser_compatibility
    const cb = e => {
      e.clipboardData.setData("text/html", rich);
      e.clipboardData.setData("text/plain", plain);
      e.preventDefault();
    };
    document.addEventListener("copy", cb);
    document.execCommand("copy");
    document.removeEventListener("copy", cb);
  }
}


function getMarkdownText(event, copiedUrl) {
    let titleParts = []
    Object.entries(selectors).forEach(([key, value]) => {
        const match = document.querySelector(value).textContent
        titleParts.push(match)
    })
    const plainText = titleParts.join(' | ')
    const richText = '<a href="' + copiedUrl + '">' + plainText + '</a>'
    copyToClipBoard(richText, copiedUrl)
}

function addEventListener(targetElement) {
    targetElement.addEventListener('click', function(event) {
        let clipBoardURL = ''
        navigator.clipboard.readText().then(function(clipBoardText){
            setTimeout(function(){
                console.log("RTF copying")
                getMarkdownText(event, clipBoardText)
            }, 500) // Timeout is needed so it would be executed after the
        })


    });
}


function waitForContent() {
    // Define a function to check for the presence of the content or element
    function checkForContent() {
        const targetElement = document.querySelector('div.title-line > div.right-controls.ui5-app-controls.in-header > div.ui5-property.txt-truncate.not-selectable')
        if (targetElement) {
            // Content is present, you can now work with it
            console.log("Adding event listener to the ticket number item")
            addEventListener(targetElement);
        } else {
            console.log("No target content found");
            // Content not found, recheck after a short delay
            setTimeout(checkForContent, 500); // Adjust the delay as needed (1 second in this example)
        }
    }

    // Start checking for content
    checkForContent();
}


(function() {
    'use strict';
    console.log("Custom copy interceptor script for tasks was initiated")
    waitForContent()

})();
