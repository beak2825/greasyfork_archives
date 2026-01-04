// ==UserScript==
// @name         Comment Expander for Reddit
// @version      1.2
// @description  Expands Reddit comments because I'm a big boy and can handle it
// @author       xdpirate
// @match        https://*.reddit.com/r/*/comments/*
// @namespace    ur mom
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433321/Comment%20Expander%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/433321/Comment%20Expander%20for%20Reddit.meta.js
// ==/UserScript==

window.setTimeout(function() {
    let collapsedPosts = document.querySelectorAll("div.collapsed");

    for(let i = 0; i < collapsedPosts.length; i++) {
        let expand = false;
        let userTag = collapsedPosts[i].querySelector("span.RESUserTag > a.userTagLink");
        
        if(userTag) {
            if(!userTag.innerHTML.includes("ignored")) {
                expand = true;
            }
        } else {
            expand = true;
        }
        
        if(expand) {
            collapsedPosts[i].querySelector("a.expand").click();
        }
    }        
}, 1500);
