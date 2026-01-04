// ==UserScript==
// @name         Jojo's Fatal Error Remover
// @namespace    http://tampermonkey.net/
// @license      “Commons Clause” License Condition v1.0
// @version      1.1
// @description  Adds a red Close button in the left top corner to any overlays on Tinychat (profile and fatal error popups)
// @author       Jojoooooo
// @match        https://tinychat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tinychat.com
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/458761/Jojo%27s%20Fatal%20Error%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/458761/Jojo%27s%20Fatal%20Error%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loadingInterval = setInterval(() => {
        if(document.querySelector("tinychat-webrtc-app") === null || document.querySelector("tinychat-webrtc-app") === undefined) {
            return;
        }
        initialize();
        clearInterval(loadingInterval);
    }, 200);
})();


function initialize() {
    var mutationObserver = new MutationObserver(m => {
        if(m.length < 0) return;
        let modal = m[0];
        if(modal.type !== "attributes") return;
        if(modal.target.className == "modal-show"){
            console.log("Showing modal");
            let button = document.createElement("button");
            button.onclick = () => {
                modal.target.querySelector("#force-close-modal").remove();
                document.querySelector("tinychat-webrtc-app").shadowRoot.querySelector("#modal").dialogs = {}
                document?.querySelector("tinychat-webrtc-app")?.shadowRoot?.querySelector("#modal")?.shadowRoot?.querySelector("#modal-window")?.removeAttribute("class")
                document?.querySelector("tinychat-webrtc-app")?.shadowRoot?.querySelector("#modal")?.querySelector("#fatal")?.remove()
            };
            button.style.width="100px";
            button.style.height="100px;"
            button.style.position="absolute";
            button.style.left="10px";
            button.style.top="10px";
            button.style.borderRadius="12px";
            button.style.backgroundColor="red";
            button.style.zIndex="100000";
            button.style.cursor="pointer";
            button.style.color="black";
            button.style.fontWeight="700";
            button.style.fontSize="16px";
            button.textContent="CLOSE";
            button.id="force-close-modal";
            modal.target.append(button);
        } else {
            console.log("Hiding modal");
            modal.target.querySelector("#force-close-modal").remove();
        }
    });
    mutationObserver.observe(document.querySelector("tinychat-webrtc-app").shadowRoot.querySelector("#modal").shadowRoot
                             .querySelector("#modal-window"), {childList:true, subtree: true, attributes: true});
}