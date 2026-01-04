// ==UserScript==
// @name         EUP Clean Release Test Issue
// @namespace    https://github.com/
// @version      1.0
// @description  Cleans EndoUniPump Release Test Issue on GitHub of any redundant elements
// @author       Mateusz
// @license      MIT
// @match        https://github.com/EndoUniPump/release-tests-20*/issues/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/455688/EUP%20Clean%20Release%20Test%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/455688/EUP%20Clean%20Release%20Test%20Issue.meta.js
// ==/UserScript==

(() => {
    "use strict";
    
    // Remove elements of those IDs
    const ids = [
        "repository-container-header"
    ];
    ids.forEach(id => {
        const e = document.getElementById(id);
        e && e.remove();
    });
    
    // Remove these tags
    const tags = [
        "nav",
        "button",
        "relative-time"
    ];
    tags.forEach(tag => {
        const es = document.getElementsByTagName(tag);
        for (let i = es.length - 1; i >= 0; --i) {
            es[i].remove();
        }
    });
    
    // Remove elements of these classes
    const classes = [
        "js-comment-edit-history",
        "avatar-user",
        "gh-header-actions",
        "State",
        "Layout-sidebar"
    ];
    classes.forEach(class_ => {
        const es = document.getElementsByClassName(class_);
        for (let i = es.length - 1; i >= 0; --i) {
            es[i].remove();
        }
    });
    
    const authors = [].slice.call(document.getElementsByClassName("author"));
    authors.forEach(author => {
        author.innerText = "ReleaseTestsBot";
        author.setAttribute("href", "#");
    });
    
    const timeline_items = [].slice.call(document.getElementsByClassName("TimelineItem"));
    timeline_items.filter(item => item.classList.length <= 1
    ).forEach(item => {
        item.remove();
    });
})();