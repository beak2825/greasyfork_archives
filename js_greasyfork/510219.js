// ==UserScript==
// @name         Royal Road - Chapter Word Count
// @version      2024-09-26--3
// @description  Adds an element to a chapter that counts the total number of words in it.
// @author       Anon
// @match        https://www.royalroad.com/fiction/*/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/181166
// @downloadURL https://update.greasyfork.org/scripts/510219/Royal%20Road%20-%20Chapter%20Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/510219/Royal%20Road%20-%20Chapter%20Word%20Count.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

function removeChildrenWithInheritedStyle(parent, propertyName, inheritedValue) {
  const children = parent.children;

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    const computedStyle = getComputedStyle(child);

    if (computedStyle[propertyName] === inheritedValue) {
      parent.removeChild(child);
    }
  }
}

async function createWordCount()
{
    console.log("Adding word counter to the page...");
    const pageContainer = await waitForElm('.portlet-footer');
    const chapterContent = await waitForElm('.chapter-inner.chapter-content');

    // Royal road puts in shadow paragraphs in case people try to steal them, but it's literally marked to not be shown or spoken, so just trash those.
    removeChildrenWithInheritedStyle(chapterContent, 'speak', 'never');
    removeChildrenWithInheritedStyle(chapterContent, 'display', 'none');

    // Get and combine all the text into 1 element
    let contentSpans = chapterContent.querySelectorAll('p');
    let list = [].slice.call(contentSpans);
    let innertext = list.map(function(e) { return e.innerText; }).join("\n");

    let wordCount = innertext.match(/\b\S+\b/g).length;

    // Make the element to append
    let wordCountP = document.createElement('p');
    let wordCountSpan = document.createElement('span');
    wordCountP.appendChild(wordCountSpan);

    // Set the content
    wordCountSpan.innerText = "• Word Count: " + wordCount + " •";
    wordCountSpan.style.color = 'burlywood';
    wordCountSpan.style['font-size'] = 'medium';
    wordCountSpan.style['font-weight'] = '900';

    // Put the word counter before the first
    chapterContent.insertBefore(wordCountP, chapterContent.firstChild);
    console.log("Finished adding word counter to the page.");
}

(function() {
    'use strict';

    createWordCount();
})();