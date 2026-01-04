// ==UserScript==
// @name         Edmentum Skip Tutorials
// @namespace    https://github.com/Kellenn
// @version      0.2
// @description  Automatically unlocks all sections in an Edmentum tutorial.
// @author       Kellen
// @match        https://f1.apps.elf.edmentum.com/courseware-delivery/*
// @downloadURL https://update.greasyfork.org/scripts/528667/Edmentum%20Skip%20Tutorials.user.js
// @updateURL https://update.greasyfork.org/scripts/528667/Edmentum%20Skip%20Tutorials.meta.js
// ==/UserScript==
 
const MAX_ATTEMPTS = 8;
 
function enableButtons(sections) {
    for (let child of sections.children) {
        let button = child.children[0];
 
        if (!button || button.className.includes("toc-current")) {
            continue;
        }
        
        button.className  = "toc-section toc-visited";
        button.removeAttribute("disabled");
	}
}
 
function findSections(delay, attempt) {
    if (attempt >= MAX_ATTEMPTS) {
      	console.log("[Edementum Skip Tutorials]: Failed to locate the '.tutorial-toc-sections' class after " + attempt + " attempts.")
        return;
    }
  
    const sections = document.querySelector(".tutorial-toc-sections");
 
		if (!sections) {
        setTimeout(() => findSections(delay * ++attempt, attempt), delay);
    } else {
        enableButtons(sections)
    }
}
 
findSections(500, 1);