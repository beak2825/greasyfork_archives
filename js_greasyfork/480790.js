// ==UserScript==
// @name         Reddit - Auto Upvote
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Upvote posts automatically as you scroll, mainly to hide already seen posts
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480790/Reddit%20-%20Auto%20Upvote.user.js
// @updateURL https://update.greasyfork.org/scripts/480790/Reddit%20-%20Auto%20Upvote.meta.js
// ==/UserScript==


// Observe when posts become visible
const intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
          post = entry.target
          if(!post.postVoteType){
            post.handleUpvote()
          }

          // Remove observer
          intersectionObserver.unobserve(entry.target)
        }
    })
}, {
    rootMargin: '0px 0px -100% 0px',
})



// Find posts
const observer = new MutationObserver(async (mutations, observer) => {
    for(let mutation of mutations){
        if(mutation.addedNodes.length > 0) {
            const posts = mutation.target.querySelectorAll('shreddit-post')

            posts.forEach(post => {
                intersectionObserver.observe(post)
            })
        }
    }
})

observer.observe(document, {childList:true, subtree:true})



// Observe when posts become visible
const intersectionObserver2 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            // Upvote
            const upvote = entry.target.querySelector('.icon-upvote')
            upvote.click()

            // Remove observer
            intersectionObserver.unobserve(entry.target)
        }
    })
}, {
    threshold: 0.5
})



// Find posts
const observer2 = new MutationObserver(async (mutations, observer) => {
    for(let mutation of mutations){
        if(mutation.addedNodes.length > 0) {
            const posts = mutation.target.querySelectorAll('.Post')

            posts.forEach(post => {
                intersectionObserver2.observe(post)
            })
        }
    }
})

observer2.observe(document, {childList:true, subtree:true})