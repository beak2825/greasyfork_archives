// ==UserScript==
// @name         Redirect Bing Search Videos to source video
// @namespace    https://github.com/jeryjs/
// @version      2.1
// @description  Redirect Bing Video search results (From Bing Search) directly to the source video
// @icon         https://www.bing.com/favicon.ico
// @match        https://www.bing.com/*/search?*
// @match        https://www.bing.com/search?*
// @grant        none
// @license      MIT
// @author       jery
// @downloadURL https://update.greasyfork.org/scripts/480825/Redirect%20Bing%20Search%20Videos%20to%20source%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/480825/Redirect%20Bing%20Search%20Videos%20to%20source%20video.meta.js
// ==/UserScript==

    document.body.addEventListener('mouseover', function(event) {
      let targetElement = event.target;
      // Check if the target element or any of its parents have the class 'mc_vtvc_link'
      while (targetElement && !targetElement.classList.contains('mc_vtvc_link')) {
        targetElement = targetElement.parentElement;
      }
      console.log(targetElement)
      const html = targetElement.querySelector('.vrhdata')?.getAttribute('vrhm');

      if (html) {
        const videoData = JSON.parse(html);
        const sourceLink = videoData.murl;

        if (targetElement.tagName === 'A') {
          targetElement.href = sourceLink;
        }
      }
    });


    // Select the element you want to observe
    const targetNode = document.querySelector('.dg_b');
  console.log(targetNode)

    // Options for the observer
    const observerOptions = {
      childList: true, // Observe for changes in the child nodes
      subtree: true // Observe for changes in the whole subtree
    };

    // Callback function for the observer
    const observerCallback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
        if(mutation.type === 'childList') {
          // Get all the updated video_elems
          const updatedVideoElems = document.querySelectorAll(".mc_vtvc_link");

          // Loop through each updated video_elem
          updatedVideoElems.forEach(updatedVideoElem => {
            const html = updatedVideoElem.querySelector('.vrhdata').getAttribute('vrhm');
            const videoData = JSON.parse(html);
            const ytLink = videoData.murl;
            console.log(ytLink);
            updatedVideoElem.href = ytLink;
          });
        }
      }
    };

    // Create a new instance of the observer
    const observer = new MutationObserver(observerCallback);

    // Start observing the target node
    observer.observe(targetNode, observerOptions);
