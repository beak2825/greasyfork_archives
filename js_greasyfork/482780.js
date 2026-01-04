// ==UserScript==
// @name        Highlight Sentence on triple click
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @author     https://github.com/b-y-f
// @grant       none
// @version     1.4
// @license     MIT
// @description Highlights sentence when mouse hovers over it
// @downloadURL https://update.greasyfork.org/scripts/482780/Highlight%20Sentence%20on%20triple%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/482780/Highlight%20Sentence%20on%20triple%20click.meta.js
// ==/UserScript==
let isStarted = false;
let clickCount = 0;
let clickTime = Date.now();

function getSentences(node) {
    return node.innerText.split(/(?<=[\.!\?])\s/);
}

function wrapSentences(node) {
    let html = node.innerHTML;
    html = html.replace(/(?<=[\.!\?])\s/g, '</span> <span>');
    if (window.trustedTypes && trustedTypes.createPolicy) { // Check if Trusted Types is enabled
        var policy = trustedTypes.createPolicy('myPolicy', {
            createHTML: (string) => string, // Policy that allows any string
        });
        node.innerHTML = policy.createHTML('<span>' + html + '</span>');
    } else {
        node.innerHTML = '<span>' + html + '</span>';
    }
}

function highlightSentence(e) {
    const target = e.target;
    if (target.tagName === 'SPAN') {
        target.style.backgroundColor = e.type === 'mouseover' ? '#B4D5FE' : '';
    }
}

function start(){
    document.body.addEventListener('mouseover', highlightSentence);
    document.body.addEventListener('mouseout', highlightSentence);
    const allParagraphs = document.querySelectorAll('p, li');
    allParagraphs.forEach(node => wrapSentences(node));
    console.log("start!")
}

window.addEventListener('click', function() {
    let currentTime = Date.now();
    if (currentTime - clickTime < 200) {
        clickCount++;
    } else {
        clickCount = 1;
    }
    clickTime = currentTime;

    if (clickCount === 3) {
        if (!isStarted) {
            start();
            isStarted = true;
        } else {
        }
        clickCount = 0;
    }
});
