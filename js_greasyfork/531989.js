// ==UserScript==
// @name Qwant Image Size Highlighter
// @name:it Evidenzia la dimensione delle immagini su Qwant
// @namespace StephenP
// @version 1.0.2
// @description Highlights images with different borders depending on their size (>3Mpx: green, >2Mpx: yellow, >1Mpx: orange, <=1Mpx: red)
// @description:it Evidenzia le immagini usando bordi differenti a seconda della loro dimensione (>3Mpx: verde, >2Mpx: giallo, >1Mpx: arancio, <=1Mpx: rosso)
// @author      StephenP
// @match https://www.qwant.com/*
// @license AGPL-3.0-or-later
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/531989/Qwant%20Image%20Size%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/531989/Qwant%20Image%20Size%20Highlighter.meta.js
// ==/UserScript==

(() => {
    const XXL = 3000000; // Minimum width * height to highlight
    const XL = 2000000; // Minimum width * height to highlight
    const L = 1000000; // Minimum width * height to highlight
    var pageURL="";

    function checkReload(){
        if(document.location.href!=pageURL){
          if((document.location.href.includes("t=images"))&&(!pageURL.includes("t=images"))){
            checkImageSizes(document.body);
            // Create mutation observer
            const observer = new MutationObserver(observerCallback);

            // Start observing the document for changes in images
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
          }
          pageURL=document.location.href;
        }
    }

    function checkImageSizes() {
        const images = document.querySelectorAll('[data-testid="imageResult"]');

        images.forEach(image => {
            const sizeContainer = image.querySelector('.LNTPh.pYTdK.QgZL1');

            if (sizeContainer) {
                const dimensions = sizeContainer.textContent.split('×');
                const width = parseInt(dimensions[0]);
                const height = parseInt(dimensions[1]);

                if (width * height > XXL) {
                    image.style.borderColor = 'green';
                    image.style.borderWidth = '5px';
                    image.style.borderStyle = 'solid';
                    image.style.borderRadius = 'var(--border-radius-150)';
                }
                else if (width * height > XL) {
                    image.style.borderColor = 'yellow';
                    image.style.borderWidth = '4px';
                    image.style.borderStyle = 'solid';
                    image.style.borderRadius = 'var(--border-radius-150)';
                }
                else if (width * height > L) {
                    image.style.borderColor = 'orange';
                    image.style.borderWidth = '3px';
                    image.style.borderStyle = 'solid';
                    image.style.borderRadius = 'var(--border-radius-150)';
                }
                else{
                    image.style.borderColor = 'red';
                    image.style.borderWidth = '2px';
                    image.style.borderStyle = 'solid';
                    image.style.borderRadius = 'var(--border-radius-150)';
                }
            }
        });
    }

    function observerCallback(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                checkImageSizes(mutation.addedNodes);
            }
        });
    }



    // Check initial image sizes
    checkReload();
    setInterval(checkReload,1000);

})();
