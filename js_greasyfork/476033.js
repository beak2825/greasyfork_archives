// ==UserScript==
// @name         DeepL - Auto VN Translation Extension Helper
// @version      1.2.9
// @grant        GM.setClipboard
// @match        https://www.deepl.com/translator
// @match        https://www.deepl.com/en/translator
// @description  Watch for target language element class change, copy new value of textarea to clipboard each time change has been detected.
// @author       Zero_G
// @icon         https://www.deepl.com/img/logo/deepl-logo-blue.svg
// @namespace Zero_G.autovntranslation
// @downloadURL https://update.greasyfork.org/scripts/476033/DeepL%20-%20Auto%20VN%20Translation%20Extension%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/476033/DeepL%20-%20Auto%20VN%20Translation%20Extension%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Filters to apply to translated text
    // These were originally here, so leaving them as is for compatibility to previous caches (as filtering should be done in setClipboardText)
    const filters = {
//      '' : /\"+|\'\'+/g,        // Remove " or ''
//      '...' : /\.\.\.\.+/g      // Change multiple dots (when there are more than 3 to '...' only)
    }

    var mutationObserver;
    // DeepL added a disconnect to all MutationObservers, as there is no way to check if a mutation was
    // disconnected, it will be checked if there was an active event every 10 seconds, if not, recreate the mutation
    var lastMutationTime = Date.now(); // Track last mutation event

    function startObserver() {
        // Observe the text div that contain the translation
        // But as the translated text appears in a <p> in a ::before css we need to watch
        // for added nodes
        const target = document.querySelector('#translation-target-heading')?.parentNode;
        if (!target){
          console.log("Auto VN script failed, can't attach ovserver because DeepL page changed");
          return;
        }

        mutationObserver = new MutationObserver(callback);
        mutationObserver.observe(target, {
            childList: true,
            subtree: true,
            attributes: true
        });

        //console.log("MutationObserver started!");
    }

    // Initial observer setup
    setTimeout(startObserver, 3000);

    // Check if the observer is still working
    function checkObserver() {
        if (Date.now() - lastMutationTime > 10000) { // No events for 10 seconds?
            //console.log("MutationObserver is inactive, restarting...");
            mutationObserver.disconnect(); // Clean up old observer
            startObserver();
        } else {
            //console.log("MutationObserver is still active");
        }

        setTimeout(checkObserver, 10000); // Run again in 10 seconds
    }

    // Start checking
    setTimeout(checkObserver, 13000);


    function callback(mutationsList) {
        lastMutationTime = Date.now(); // Update timestamp when a mutation happens
        //console.log("Mutation detected!", mutationsList);

        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && // Irrelevant as we are already watching for childList only but meh
                mutation.addedNodes.length !== 0 && // Looking for a mutation with an added node
                mutation.removedNodes.length !== 0 && // This condition is to prevent a repeat
                !mutation.addedNodes[0].innerHTML.includes('<br')
               ) { // Filter out garbage while translating
              	console.log(mutation)
                // Get text from <p> (get as value doesn't work)
              	let text = '';
              	// Check for added elments/mutations of element type <p>
                for(let i in mutation.addedNodes){
                  let child = mutation.addedNodes[i]
                  if(child.tagName == 'P'){
                    //console.log(child);
                    text = child.textContent;
                  } else if(child.tagName == 'DIV'){
                    text = child.textContent;
                  }
                }

                // Apply filters
                for (const [key, value] of Object.entries(filters)) {
                  text = text.replace(value, key);
                }

                // Copy to memory with GreaseMonkey special function (needs @grant)
                if(text) GM.setClipboard(text);
            }
        })
    }
})();