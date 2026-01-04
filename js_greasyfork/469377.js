// ==UserScript==
// @name         Turbowarp for Scratch
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Converts the project page & editor to Turbowarp versions.
// @author       You
// @match        https://scratch.mit.edu/projects/*
// @match        https://turbowarp.org/*
// @icon         https://turbowarp.org/images/192.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469377/Turbowarp%20for%20Scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/469377/Turbowarp%20for%20Scratch.meta.js
// ==/UserScript==

if (document.location.href.includes('turbowarp') && document.referrer == 'https://scratch.mit.edu/') {
  console.log('Came from Turbowarp for Scratch');
} else {
  // Function to be executed when the conditions are met
  function replacePlayer() {
    // Your code logic here
    setInterval(function() {
      if (document.location.href == 'https://scratch.mit.edu/projects/editor/') {
        window.onbeforeunload = null;
        document.location.href = 'https://turbowarp.org/editor';
      } else {
        if (document.location.href.includes('editor') && document.location.href != 'https://scratch.mit.edu/projects/editor/') {
          function extractProjectId(url) {
            url = url.replace(/\/+$/, '');

            var segments = url.split('/');
            var projectId = segments[segments.length - 2];

            return projectId;
          }

          var projectId = extractProjectId(document.location.href);
          const state = { page_id: 1, user_id: 5 };
          const url = document.location.href.replace(/(https:\/\/scratch\.mit\.edu\/projects\/\d+\/).*/, "$1");
          history.pushState(state, "", url);
          window.onbeforeunload = null;
          document.location.href = `https://turbowarp.org/${projectId}/editor`;
        }
      }
    }, 100);

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const targetElement = document.querySelector("#view > div > div.inner > div:nth-child(2) > div.guiPlayer");

          if (targetElement) {
            function extractProjectId(url) {
              url = url.replace(/\/+$/, '');
              var segments = url.split('/');
              var projectId = segments[segments.length - 1];

              return projectId;
            }

            var projectId = extractProjectId(document.location.href);

            document.querySelector("#view > div > div.inner > div:nth-child(2) > div.guiPlayer").innerHTML = `<iframe src="https://turbowarp.org/${projectId}/embed?addons=pause&settings-button" width="490" height="414" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen></iframe>`

            observer.disconnect();
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Callback function for the MutationObserver
  function callback(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Check if the target element is created
        if (
          document.querySelector(
            "#view > div > div.inner > div.flex-row.preview-row.force-row > div.project-buttons"
          )
        ) {
          // Check if the span element does not exist
          if (
            !document.querySelector(
              "#view > div > div.banner-outer > div > span > span"
            )
          ) {
            // Call your function when both conditions are met
            replacePlayer();
            // Disconnect the observer as the conditions are met
            observer.disconnect();
          }
        }
      }
    }
  }

  // Create a new observer instance
  const observer = new MutationObserver(callback);

  // Configuration options for the observer
  const config = {
    childList: true, // Watch for changes in the child nodes of the target element
    subtree: true, // Watch for changes in the whole subtree of the target element
  };

  // Start observing the target element
  observer.observe(
    document.documentElement, // The root of the DOM
    config
  );

}