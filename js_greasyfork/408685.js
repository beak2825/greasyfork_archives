// ==UserScript==
// @name         Timvision Enhanced - Parte 2
// @name:en      Timvision Enhanced - Part 2
// @namespace    http://cosoleto.free.fr
// @version      0.4
// @description  Modifiche varie per migliorare l'interazione su timvision.it
// @description:en  Miscellaneous improvements for timvision.it
// @author       Francesco Cosoleto
// @match        http*://www.timvision.it/*
// @exclude      http*://www.timvision.it/profile
// @exclude      http*://www.timvision.it/promo
// @exclude      http*://www.timvision.it/support
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408685/Timvision%20Enhanced%20-%20Parte%202.user.js
// @updateURL https://update.greasyfork.org/scripts/408685/Timvision%20Enhanced%20-%20Parte%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer_target = document.querySelector("body");
    const observer_opts = {childList: true, subtree: true};

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                let node = mutation.addedNodes[i];
                if (node.nodeName === "TIM-GRID-VIEW-ITEM") {
                    observer.disconnect();
                    let items = node.parentNode.querySelectorAll(".content-item-badge,.content-timbundle-badge");
                    items.forEach(function(e) {e = e.parentNode.parentNode.parentNode; node.parentNode.insertBefore(e, null) });
                    observer.observe(observer_target, observer_opts);
                    break;
                } else {
                    switch (node.nodeName) {
                        case "TIM-HEADER": {
                            let btn = document.createElement("li");
                            let dest = document.querySelector(".user-profile-link");
                            btn.innerText = "(+)";
                            btn.onclick = showOptions;
                            dest.parentNode.appendChild(btn);
                        }
                            break;
                        case "TIM-BOOKMARK-DIALOG":
                        case "TIM-CONTINUE-WATCHING-DIALOG":
                            node.querySelector("div.buttons-panel").firstElementChild.click();
                            break;
                        case "TIM-ADVANCED-INFO-MESSAGE-DIALOG":
                            if (node.innerText.startsWith("IL SIMBOLO VIOLA")) {
                                document.getElementsByClassName("cdk-overlay-container")[0].textContent = '';
                                document.firstElementChild.removeAttribute("class");
                                document.body.removeAttribute("class");
                            }
                    }
                }
            }
        }
                         );
    });
    observer.observe(observer_target, observer_opts);

function showOptions()
{
    alert("opzioni estensione presto disponibili");
}

})();