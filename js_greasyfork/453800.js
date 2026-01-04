// ==UserScript==
// @name        Highlight Revit
// @description Highlight revitalize weapons in your armory
// @namespace   m0tch.torn.HighlightRevit
// @match       https://www.torn.com/factions.php?step=your*
// @run-at      document-end
// @grant       GM_addStyle
// @version     0.4
// @author      m0tch
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/453800/Highlight%20Revit.user.js
// @updateURL https://update.greasyfork.org/scripts/453800/Highlight%20Revit.meta.js
// ==/UserScript==


GM_addStyle(`
.revitalize-highlight {
    background-color: #d7e2cc;
}

.dark-mode .revitalize-highlight {
    background-color: #3d4b28 !important
}
.warlord-highlight {
    background-color: #ffd2d2;
}

.dark-mode .warlord-highlight {
    background-color: #602525 !important
}
`);

function highlightPerk(){
    document.querySelectorAll(".bonus-attachment-revitalize").forEach(x => x.parentElement.parentElement.parentElement.classList.add("revitalize-highlight"));
    document.querySelectorAll(".bonus-attachment-warlord").forEach(x => x.parentElement.parentElement.parentElement.classList.add("warlord-highlight"));
}

new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		for (const node of mutation.addedNodes) {
            if(location.hash.indexOf("sub=weapons") > 0 && location.hash.indexOf("tab=armoury") > 0) {
                highlightPerk();
            }
        }
	});
}).observe(document.body, {childList: true, subtree: true});