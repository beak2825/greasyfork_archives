// ==UserScript==
// @name         CleanTwitterPosts
// @namespace    http://tampermonkey.net/
// @version      0.9
// @author       You
// @description  Auto-remove useless twitter replies with "@SaveToNotion"
// @match        https://twitter.com/*
// @icon         https://twitter.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464598/CleanTwitterPosts.user.js
// @updateURL https://update.greasyfork.org/scripts/464598/CleanTwitterPosts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BLOCKED_AT = ['@SaveToNotion']

    const clean_once = () => {
        const posts = document.querySelectorAll('.css-1dbjc4n.r-1ila09b.r-qklmqi.r-1adg3ll.r-1ny4l3l')
        for(let i = 0 ; i < posts.length ; i++){
            const post = posts[i];
            const links = post.querySelectorAll('a')
            for(let j = 0 ; j < links.length ; j++){
                const text = links[j].text
                if(BLOCKED_AT.indexOf(text) !== -1){
                    post.remove()
                    break
                }
            }
        }
    }
    window.onload = () => {
        setInterval(clean_once, 3000)
    }

})();