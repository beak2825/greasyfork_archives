// ==UserScript==
// @name Text to URL
// @namespace https://github.com/T1mL3arn
// @author T1mL3arn
// @description:ru Конвертирует текст в виде ссылок в реальные ссылки, на которые можно кликнуть.
// @description:en Converts url-like text into clickable url.
// @match *://*/*
// @version 1.1.1
// @run-at document-end
// @license GPLv3
// @supportURL https://greasyfork.org/en/scripts/367955-text-to-url/feedback
// @homepageURL https://greasyfork.org/en/scripts/367955-text-to-url
// @description Конвертирует текст в виде ссылок в реальные ссылки, на которые можно кликнуть.
// @downloadURL https://update.greasyfork.org/scripts/367955/Text%20to%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/367955/Text%20to%20URL.meta.js
// ==/UserScript==

///TODO improve ereg to match URI syntax (https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Generic_syntax) ?
let linkEreg = /(?:https|http|ftp|file):\/\/.+?(?=[,.]?(?:\s|$))/gi;
let linkEregLocal = /(?:https|http|ftp|file):\/\/.+?(?=[,.]?(?:\s|$))/i;
let obsOptions = { childList: true, subtree: true };
let wrappedCount = 0;

function printWrappedCount() { 
  if (wrappedCount > 0) {
    console.info(`[ ${GM_info.script.name} ] wrapped links count: ${wrappedCount}`);
  } 
}

let obs = new MutationObserver((changes, obs) => {
  wrappedCount = 0;
  obs.disconnect();
  changes.forEach((change) => change.addedNodes.forEach((node) => fixLinks(node)) );
  obs.observe(document.body, obsOptions);
  printWrappedCount();
});

function fixLinks(node) {
  ///TODO consider not to run script for form and input elements!
  ///TODO also search syntax-highlith libraries and also exclude them 
  if (node.tagName != 'A' && node.tagName != 'SCRIPT') {
    // this is a text node
    if (node.nodeType === 3) {
      let content = node.textContent;
      if (content && content != '') {
        if (linkEregLocal.test(content)) {
          wrapTextNode(node);
        }
      }
    } else if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(fixLinks);
    }
  }
}

function wrapTextNode(node) {
  let match;
  let sibling = node;
  let content = node.textContent;
  linkEreg.lastIndex = 0;
  while ((match = linkEreg.exec(content)) != null) {
    let fullMatch = match[0];
    let anchor = document.createElement('a');

    let range = document.createRange();
    range.setStart(sibling, linkEreg.lastIndex - match[0].length);
    range.setEnd(sibling, linkEreg.lastIndex);
    range.surroundContents(anchor);

    wrappedCount++;

    anchor.href = fullMatch;
    anchor.textContent = fullMatch;
    anchor.target = '_blank';
    anchor.title = 'open link in a new tab';
    anchor.setAttribute('ttu-wrapped', '1');
    linkEreg.lastIndex = 0;
    
    sibling = getNextTextSibling(anchor);
    if (sibling == null)
      break;
    else
      content = sibling.textContent;
  }
}

function getNextTextSibling(node) {
  let next = node.nextSibling;
  while (next != null) {
    if (next.nodeType == 3)
      return next;
    else
      next = node.nextSibling;
  }
  return null;
}

fixLinks(document.body);
printWrappedCount();
obs.observe(document.body, obsOptions);