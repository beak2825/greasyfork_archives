// ==UserScript==
// @name         Plex auto-skip intro
// @namespace    https://greasyfork.org/en/users/555204-bcldvd
// @version      0.1
// @description  Automatically press the Plex "Skip intro" button when it appears.
// @author       Dustin Höfer
// @match        https://app.plex.tv/desktop
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409499/Plex%20auto-skip%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/409499/Plex%20auto-skip%20intro.meta.js
// ==/UserScript==

(function() {
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes.length > 0 && mutation.addedNodes[0]){
             var xpathResult = document.evaluate("(//text()[contains(., 'Skip Intro')])[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                var node=xpathResult.singleNodeValue;
                if (node!=null){
                    setTimeout(() => {
                        document.getElementsByClassName("AudioVideoFullPlayer-overlayButton-30Vz4v Button-button-2kT68l Link-link-2n0yJn Button-button-2kT68l Link-link-2n0yJn Button-default--yDCH5 Button-large-3S9UdJ Link-link-2n0yJn Link-default-2XA2bN     ")[0].click();
                }, 2000);
                }


            }
        });
    });
    observer.observe(element, { childList: true, subtree: true });
})();