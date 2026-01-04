// ==UserScript==
// @name         Patreon: Load and show all comments
// @namespace    http://tampermonkey.net/
// @version      2024.08.12
// @description  On a post's page, this automates loading all the comments instead of requiring the user to click for each batch
// @author       You
// @match        https://www.patreon.com/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484278/Patreon%3A%20Load%20and%20show%20all%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/484278/Patreon%3A%20Load%20and%20show%20all%20comments.meta.js
// ==/UserScript==

(function() {
    function loaded(){
        let lmc = Array.from(document.querySelectorAll("div[data-tag='post-card'] button")).find(x=>x.innerText == "Load more comments");
        if(lmc){
            lmc.innerHTML = "Load ALL comments";
            let obs = new MutationObserver(mut => { if(mut[0].addedNodes.length>0 && lmc){lmc.click();} }); //auto click button after a batch of comments added
            obs.observe(lmc.parentElement.parentElement, { childList: true, subtree: true }); //each comment is a sibling of the parent div of the lmc button
        }
    }
    window.addEventListener('load', function() {
        setTimeout(loaded, 2000);
    })
})();