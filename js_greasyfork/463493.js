// ==UserScript==
// @name OpenAI Chat Copy Code Button
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Add a 'Copy Code' button to the bottom right hand of code blocks on chatgpt.com with animation
// @author Your Name
// @match https://chatgpt.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463493/OpenAI%20Chat%20Copy%20Code%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/463493/OpenAI%20Chat%20Copy%20Code%20Button.meta.js
// ==/UserScript==

(function () {
'use strict';

const copyToClipboard = (text, button) => {
navigator.clipboard.writeText(text).then(() => {
console.log('Copied code to clipboard');
button.innerHTML = 'Copied!';
setTimeout(() => {
button.innerHTML = ''; // Clear the text
const svgIcon = getSVGIcon(); // Re-add the SVG icon
button.appendChild(svgIcon);
}, 2000);
}, (err) => {
console.error('Failed to copy code: ', err);
});
};

const getSVGIcon = () => {
const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgIcon.setAttribute('width', '24');
svgIcon.setAttribute('height', '24');
svgIcon.setAttribute('fill', 'none');
svgIcon.setAttribute('viewBox', '0 0 24 24');
svgIcon.classList.add('icon-sm');

const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('fill', 'currentColor');
path.setAttribute('fill-rule', 'evenodd');
path.setAttribute('d', 'M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z');
path.setAttribute('clip-rule', 'evenodd');

svgIcon.appendChild(path);
return svgIcon;
};

const addButton = (elem) => {
const button = document.createElement('button');
const svgIcon = getSVGIcon();
button.appendChild(svgIcon);

button.style.position = 'absolute';
button.style.bottom = '8px';
button.style.right = '8px';
button.style.fontSize = '12px';
button.style.padding = '4px 8px';
button.style.border = '1px solid #ccc';
button.style.borderRadius = '3px';
button.style.background = 'rgba(0,0,0,0.1)';
button.style.color = 'white';
button.style.cursor = 'pointer';
button.style.zIndex = '10';
button.style.transition = 'background-color 0.3s ease';

button.addEventListener('click', (e) => {
e.stopPropagation();
copyToClipboard(elem.querySelector('code').textContent, button);
});

button.addEventListener('mouseover', () => {
button.style.backgroundColor = 'rgba(0,0,0,0.2)';
});

button.addEventListener('mouseout', () => {
button.style.backgroundColor = 'rgba(0,0,0,0.1)';
});

elem.style.position = 'relative';
elem.appendChild(button);
};

const observeCodeBlocks = () => {
const codeBlocks = document.querySelectorAll('pre:not(.copy-code-processed)');
if (codeBlocks.length) {
codeBlocks.forEach(block => {
addButton(block);
block.classList.add('copy-code-processed');
});
}
};

const observer = new MutationObserver(observeCodeBlocks);
observer.observe(document.body, { childList: true, subtree: true });

observeCodeBlocks();
})();