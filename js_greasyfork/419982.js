// ==UserScript==
// @name            Netflix - Extended Titles
// @description     Adds the title name to the head.title property (tab display name)
// @author          Archangel1C
// @version         0.1
// @match           http*://www.netflix.com/title/*
// @run-at          document-start
// @grant           none
// @compatible      chrome
// @license         GPL-3.0-only
// @namespace       https://github.com/Archangel1C
// @contributionURL https://flattr.com/@Archangel1C
// @downloadURL https://update.greasyfork.org/scripts/419982/Netflix%20-%20Extended%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/419982/Netflix%20-%20Extended%20Titles.meta.js
// ==/UserScript==
//
// Sources/Influences:

(function extendTitles() {
    'use strict';

    function domListener(e) {
//      console.log(`[${GM_info.script.name}] DOMNodeInserted: relatedNode=${e.relatedNode}`);
//      console.log(e.relatedNode);
        if (e.relatedNode.classList.contains("previewModal--player-titleTreatment")) {
//          console.log(`[${GM_info.script.name}] DOMNodeInserted: relatedNode=${e.relatedNode}`);
//          console.log(e);
            this.titleNameNodeAdded = true;
            var titleTreatmentLogo = e.relatedNode.querySelector("img.previewModal--player-titleTreatment-logo");
            if (titleTreatmentLogo == null) {
                console.log(`[${GM_info.script.name}] could not find title element`);
                return;
            }
            console.log(`[${GM_info.script.name}] extending title with name "${titleTreatmentLogo.title}"`);
            document.title = document.title + ": " + titleTreatmentLogo.title;
        } else if (e.relatedNode.classList.contains("detail-modal-container")) {
//          console.log(`[${GM_info.script.name}] DOMNodeInserted: relatedNode=${e.relatedNode}`);
//          console.log(e);
            this.titleTypeNodeAdded = true;
            var titleType = e.relatedNode.querySelector("div.videoMetadata--second-line > span.duration")
            if (titleType == null) {
                console.log(`[${GM_info.script.name}] could not find title type`);
            } else {
                console.log(`[${GM_info.script.name}] extending title with type "${titleType.textContent}"`);
                document.title = document.title + " (" + titleType.textContent + ")";
            }
        }

        if (this.titleNameNodeAdded && this.titleTypeNodeAdded) {
            console.log(`[${GM_info.script.name}] removing DOMNodeInserted listener ${domListener.name}`);
            document.removeEventListener("DOMNodeInserted", domListener);
        }
    }
    domListener.titleNameNodeAdded = false;
    domListener.titleTypeNodeAdded = false;

    console.log(`[${GM_info.script.name}] adding DOMNodeInserted listener ${domListener.name}`);
    document.addEventListener("DOMNodeInserted", domListener);
})();
