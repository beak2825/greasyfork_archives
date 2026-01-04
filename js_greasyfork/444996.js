// ==UserScript==
// @name         The Hindu AdBlocker Wall
// @description  Remove AdBlocker backdrop.
// @version      1.0
// @author       chellachellachellachellachella
// @match        https://www.thehindu.com/*
// @icon         https://www.thehindu.com/favicon.ico

// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/914445
// @downloadURL https://update.greasyfork.org/scripts/444996/The%20Hindu%20AdBlocker%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/444996/The%20Hindu%20AdBlocker%20Wall.meta.js
// ==/UserScript==

var targetNode = document.querySelector('body');
var config = { subtree: false, childList: true };
var flag = []
var callback = function(mutationsList) {
    if(flag.length == 2 || ((flag[0] == "tp-modal") && (flag.length == 1))){
        console.clear()
        console.info("Removed backdrop.")
        observer.disconnect()
    }

    for(var mutation of mutationsList) {
        try {
            if(mutation.previousSibling)
                if(mutation.previousSibling.classList.contains("tp-modal")){
                    mutation.previousSibling.remove()
                    flag.push("tp-modal")
                }

            if(mutation.previousSibling)
                if(mutation.previousSibling.nextSibling)
                    if(mutation.previousSibling.nextSibling.classList.contains("tp-backdrop")){
                        mutation.previousSibling.nextSibling.remove()
                        flag.push("tp-backdrop")
                    }
        } catch { }
    }
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);