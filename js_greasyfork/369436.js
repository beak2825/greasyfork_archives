// ==UserScript==
// @name         Fetch Old Reddit Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a link to copy old reddit link to clipboard
// @author       MingW
// @match        www.reddit.com/r/*
// @require      https://unpkg.com/tippy.js@2.5.2/dist/tippy.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369436/Fetch%20Old%20Reddit%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/369436/Fetch%20Old%20Reddit%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Activate clipboard
    new ClipboardJS('.oldLink')

    // Attach copy reddit link anchor element to all relevant ul
    function addCopyLink(ulArr) {
     for(let ul of ulArr) {
         attachAnchor(ul)
     }
    }

    // Attaches anchor to ul parameter
    function attachAnchor(ul) {
     // Set up anchor
     const link = document.createElement('a')
     link.classList.add('oldLink')
     link.innerHTML = 'copy old reddit link'
     link.setAttribute('data-clipboard-text', getPermalink(ul))
     link.style.cursor = 'pointer'
     link.title = 'copied'
     tippy(link, { trigger: 'click' })
     ul.append(link)
    }

    // Grabs the permalink within the data attribute
    function getPermalink(element) {
     // Finds the relevant div from the ul element
     let div = element.parentNode.parentNode.parentNode
     // Checks if it is a subreddit page or a comments page
     // Relevant div is one level higher in comments
     div = isComments ? div.parentNode : div
     // Grab the raw string for element
     const html = div.outerHTML
     // Split the string by spaces and find the one that is the permalink data attribute
     const string = html.split(' ').filter(string => string.startsWith('data-permalink'))[0]
     // Construct the link using the relevant parts
     // 16 is the starting place not counting the length of 'data-permalink="'
     // string.length - 1 to avoid the '"' at the end
     return 'https://old.reddit.com' + string.substring(16, string.length - 1)
    }

    // Fetch all the ul elements
    const ulArray = document.getElementsByClassName('flat-list buttons')
    const url = window.location.href
    // Check if the page is a comments section or a subreddit posts list
    const isComments = url.indexOf('/comments/') > -1

    // Checks to see if it's a comment section, if it is only attach link to first ul element.
    // The other ul elements would just be for comments
    addCopyLink(isComments ? [ulArray[0]] : ulArray)
})();