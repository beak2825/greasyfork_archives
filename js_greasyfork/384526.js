// ==UserScript==
// @name         Make S**tposts Great Again!
// @namespace    LordBusiness.MSG
// @version      1.5
// @description  Take that, you s**tposters!
// @author       Me, you, and everybody else.
// @match        https://www.torn.com/forums.php*
// @match        https://www.torn.com/pc.php*
// @match        https://www.torn.com/laptop.php*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/randomcolor@0.5.4/randomColor.min.js
// @resource     font https://cdn.jsdelivr.net/gh/LBusiness/res@master/font.ttf
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/384526/Make%20S%2A%2Atposts%20Great%20Again%21.user.js
// @updateURL https://update.greasyfork.org/scripts/384526/Make%20S%2A%2Atposts%20Great%20Again%21.meta.js
// ==/UserScript==



// Add the IDs of your favorite shitposters here:
const shitPosters = [1028023, 1002535, 2052465]

// Set this to true if you'd like to see the effect on all users.
const allUsersAreShit = false

const userSelectors = shitPosters.map(user => `#forums-page-wrap > .forums-thread-wrap .thread-list [data-author${allUsersAreShit ? '' : '="'+ user + '"'}] .post.unreset`).join(),
      font = GM_getResourceURL('font');
GM_addStyle(`
    @font-face {
	    font-family: 'Comic-Sans';
   		src: url(data:font/tff;base64,${ font.substring(24) });
    }

    .verified-shitpost,
    ${userSelectors} {
        font-family: 'Comic-Sans';
        font-size: 2.5em;
        letter-spacing: 2px;
        line-height: 30px !important;
    }
`);

window.addEventListener('DOMContentLoaded', event => {
    'use strict';

    const checkQuote = quoteNode => {
        if(!quoteNode) return;
        const quoteAuthor = Number(quoteNode.querySelector(':scope > .author-quote a').href.replace(/[^0-9]/g, ''));

        if(allUsersAreShit || shitPosters.includes(quoteAuthor)) {
            quoteNode.querySelector(':scope > .quote-post').classList.add('verified-shitpost');
            quoteNode.querySelector(':scope > .quote-post').style.color = randomColor({ luminosity: 'dark' });
        }
        checkQuote(quoteNode.querySelector(':scope > .post-quote'));
    },

          checkThreadForShitPosts = thread => {
        const posts = thread.querySelectorAll('[data-author]');
        for(const post of posts) {
            const postAuthor = Number(post.getAttribute('data-author'))
            if(allUsersAreShit || shitPosters.includes(postAuthor)) {
                post.querySelector('.post.unreset').style.color = randomColor({ luminosity: 'dark' });
            }

            checkQuote(post.querySelector('.quote.unreset > .post-quote'));
        }
    },
          forumWrapObserver = new MutationObserver(mutationList => {
              for(const MutationRecord of mutationList) {
                  for(const addedNode of MutationRecord.addedNodes) {
                if(addedNode.classList && addedNode.classList.contains('forums-thread-wrap')) {
                    checkThreadForShitPosts(addedNode);
                    return;
                }
            }
        }
    });

    if(location.href.startsWith('https://www.torn.com/forums.php')) {
        forumWrapObserver.observe(document.getElementById('forums-page-wrap'), {childList: true })
    }
});