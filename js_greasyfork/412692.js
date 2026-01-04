// ==UserScript==
// @name         Auto-downvote Medium.com on Reddit
// @description  Automatically downvotes all seen Medium articles
// @lastupdated  2020-10-08
// @version      1.0.1
// @namespace    skeeto
// @license      Public Domain
// @include      https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412692/Auto-downvote%20Mediumcom%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/412692/Auto-downvote%20Mediumcom%20on%20Reddit.meta.js
// ==/UserScript==

const BANNED = new Set([
    'blog.softwaremill.com',
    'freecodecamp.org',
    'medium.com',
    'thenextweb.com'
])

function banned(domain) {
    return BANNED.has(domain) || 
        /\.medium\.com$/.exec(domain) || 
        /^medium\./.exec(domain);
}

for (let link of document.querySelectorAll('.thing.link')) {
    let domain = link.querySelector('.domain > a').textContent
    if (banned(domain)) {
        let downvote = link.querySelector('.down')
        if (downvote) {
            setTimeout(function() {
              downvote.click()
            }, 250)
        }
    }
}
