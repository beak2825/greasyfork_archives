// ==UserScript==
// @name             Sankaku Paginator Posts Replacer
// @namespace   tuktuk3103@gmail.com
// @description   Removes older posts when newer posts are added by the paginator so your page remains short
// @include          https://chan.sankakucomplex.com/*
// @include          https://idol.sankakucomplex.com/*
// @version          1
// @grant              none
// @icon                https://chan.sankakucomplex.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/416032/Sankaku%20Paginator%20Posts%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/416032/Sankaku%20Paginator%20Posts%20Replacer.meta.js
// ==/UserScript==

// Select the node that will be observed for mutations
const targetNode = document.getElementById('content');

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          var page = document.getElementById('content').querySelectorAll('.content-page');
          page.length++;
          page[page.length-3].remove();
          break;
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
