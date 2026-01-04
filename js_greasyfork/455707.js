// ==UserScript==
// @name         Quizlet Search On Google 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds quizlet search to google search results
// @author       icycoldveins
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @license      MIT
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455707/Quizlet%20Search%20On%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/455707/Quizlet%20Search%20On%20Google.meta.js
// ==/UserScript==

// Change this to false if you don't want an icon
const useIcon = true;
// Change this to true if you want to add the button to the right of the 'Tools' button
const appendRight = false;

const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const QuizletUrl = '+site%3Aquizlet.com';
let quizicon = '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-3 9.5v4c0 .276-.224.5-.5.5h-4c-.276 0-.5-.224-.5-.5v-4c0-.276.224-.5.5-.5h4c.276 0 .5.224.5.5zm-10.061 1.99-1.218-1.218c-.281-.281-.282-.779 0-1.061s.78-.281 1.061 0l1.218 1.218 1.218-1.218c.281-.281.779-.282 1.061 0s.281.78 0 1.061l-1.218 1.218 1.218 1.218c.281.281.282.779 0 1.061s-.78.281-1.061 0l-1.218-1.218-1.218 1.218c-.281.281-.779.282-1.061 0s-.281-.78 0-1.061zm8.561-.99h-2v2h2zm-7.5-8.5c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm9 5.25c0 .399-.353.75-.75.75-1.153 0-2.347 0-3.5 0-.397 0-.75-.351-.75-.75s.353-.75.75-.75h3.5c.397 0 .75.351.75.75zm-9-3.75c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm9 1.5c0 .399-.353.75-.75.75-1.153 0-2.347 0-3.5 0-.397 0-.75-.351-.75-.75s.353-.75.75-.75h3.5c.397 0 .75.351.75.75zm0-2.25c0 .399-.353.75-.75.75-1.153 0-2.347 0-3.5 0-.397 0-.75-.351-.75-.75s.353-.75.75-.75h3.5c.397 0 .75.351.75.75z" fill-rule="nonzero"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

if (typeof trustedTypes !== 'undefined') {
    const policy = trustedTypes.createPolicy('html', { createHTML: input => input });
    quizicon = policy.createHTML(quizicon);
}

(function () {
    // Creating the element
    let el = document.createElement('div');
    el.className = 'hdtb-mitem';
    const link = document.createElement('a');

    // Adding the svg icon
    if (useIcon) {
        const span = document.createElement('span');
        span.className = isImageSearch ? 'm3kSL' : 'bmaJhd iJddsb';
        span.style.cssText = 'height:16px;width:16px';
        span.innerHTML = quizicon;
        link.appendChild(span);
    }

    link.appendChild(document.createTextNode('Quizlet'));
    link.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, QuizletUrl) : match + QuizletUrl;
    });
    if (isImageSearch) {
        link.classList.add('NZmxZe');
        el = link;
    } else {
        el.appendChild(link);
    }

    // Inserting the element into Google search
    if (appendRight) {
        const toolsBtn = document.querySelector(isImageSearch ? '.ssfWCe' : '.t2vtad');
        toolsBtn.parentNode.insertBefore(el, toolsBtn.nextSibling);
    } else {
        const menuBar = document.querySelector(isImageSearch ? '.T47uwc' : '.MUFPAc');
        if (isImageSearch) {
            menuBar.insertBefore(el, menuBar.children[menuBar.childElementCount - 1]);
        } else {
            menuBar.appendChild(el);
        }
    }
})();
