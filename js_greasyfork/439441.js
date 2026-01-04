// ==UserScript==
// @name         Vimium Standard
// @namespace    https://shaneduffy.io
// @version      0.1
// @description  Standard Notes changed their UI, and now it doesn't work with Vimium. This makes things work with Vimium again.
// @author       Shane Duffy
// @match        https://app.standardnotes.com
// @icon         https://shaneduffy.io/assets/img/logo-circle-64.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439441/Vimium%20Standard.user.js
// @updateURL https://update.greasyfork.org/scripts/439441/Vimium%20Standard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutationList => {
        var applyChanges = true;

        for (const mutation of mutationList) {
            switch (mutation.type) {
                case 'childList':
                    for (const node of mutation.addedNodes) {
                        var classString;
                        if (node instanceof Element) {
                            classString = node.getAttribute("class");
                            if (classString?.includes("name") || classString?.includes("tag-icon")) {
                                if (node.tagName == "DIV") {
                                    node.remove();
                                }
                            }

                            if (classString.includes("standard-vimium")) {
                                applyChanges = false;
                            }
                        }
                    }
                    for (const node of mutation.removedNodes) {
                        if (node instanceof Element) {
                            classString = node.getAttribute("class");
                            if (classString?.includes("standard-vimium")) {
                                applyChanges = false;
                            }
                        }
                    }
                    break;
                case 'attributes':
                    break;
            }
        }

        if (applyChanges) {
            var notes = document.getElementsByClassName("name");
            for (const note of notes) {
                if (note != undefined && note.tagName != "a") {
                    var newNote = document.createElement("a");
                    newNote.setAttribute("class", "name standard-vimium");
                    newNote.innerHTML = note.innerHTML;

                    if (note.parentNode != undefined) {
                        note.parentNode.replaceChild(newNote, note);
                    }
                }
            }

            var tags = document.getElementsByClassName("tag-icon");
            for (const tag of tags) {
                if (tag != undefined && tag.tagName != "a") {
                    var newTag = document.createElement("a");
                    newTag.setAttribute("class", "tag-icon standard-vimium");
                    newTag.innerHTML = tag.innerHTML;

                    if (tag.parentNode != undefined) {
                        tag.parentNode.replaceChild(newTag, tag);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true
    });

})();