// ==UserScript==
// @name         Facebook Feed Expander
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Expand the feed size of the new Facebook UI
// @author       kaalpurush
// @match        *.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404027/Facebook%20Feed%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/404027/Facebook%20Feed%20Expander.meta.js
// ==/UserScript==

;(() => {
    var mo, timer,elRemoved=0;
    let expand=()=>{
        let els = document.querySelectorAll(".x193iq5w");
        els.forEach((el)=>{
            ++elRemoved;
            el.style.width='100%';
        });

        // elRemoved && ((timer && clearTimeout(timer) || (mo && mo.disconnect())));
    }

    timer=setTimeout(()=>{
        mo=new MutationObserver(function(el){
            expand();
        });
        mo.observe(document.querySelector(".xxzkxad"), { childList:true, subtree: true });
    },3000);

    expand();
})();