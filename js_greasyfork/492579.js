// ==UserScript==
// @name         Twitter hide unreplyable posts
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  hide all tweets that cant be replied to
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492579/Twitter%20hide%20unreplyable%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/492579/Twitter%20hide%20unreplyable%20posts.meta.js
// ==/UserScript==




setInterval(()=>{
    const tweets=document.querySelectorAll("main section [aria-label*='Timeline'] [data-testid='cellInnerDiv']")
    for(const tweet of [...tweets]){
        let replyIcon=tweet.querySelector("[role='group'] [data-testid='reply'] svg");
        if(replyIcon){
            const replyIconStyle=getComputedStyle(replyIcon)
            const opacity=+replyIconStyle.opacity;
            if(opacity===0.4){
                tweet.style.display="none"
            }
        }
    }
},50)
