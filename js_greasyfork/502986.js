// ==UserScript==
// @name         LaTeX Copier
// @namespace    http://tampermonkey.net/
// @version      1.9.7
// @description  Copy selected text with equations in LaTeX format (Short cut: Ctrl+Alt+Shift+C).
// @author       Jie-Qiao
// @match        *://*.wikipedia.org/*
// @match        *://*.stackexchange.com/*
// @match        *://alejandroschuler.github.io/*
// @match        *://*.zhihu.com/*
// @match        *://*.arxiv.org/*
// @match        *://*.ar5iv.org/*
// @match        *://*.csdn.net/*
// @match        *://chatgpt.com/*
// @match        *://chat.deepseek.com/*
// @match        *://amreis.github.io/*
// @match        *://gemini.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502986/LaTeX%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/502986/LaTeX%20Copier.meta.js
// ==/UserScript==

function decodeHTMLEntities(text) {
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(text, 'text/html').documentElement.textContent;
  return decodedString;
}


function getTextContentWithReplacements(url,node) {
    let text = '';
    if (node && node.childNodes) {
        node.childNodes.forEach(child => {
        let breakout=false;
        const nodeType = child.nodeType;
        const nodeName = child.nodeName.toLowerCase();
            // Default behavior for text nodes
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent;
            }
            if (nodeType === Node.ELEMENT_NODE){
                // URL-specific processing rules
                if (url.includes('wikipedia.org')) {
                    if (nodeName === 'span') {
                        if (child.querySelectorAll('math').length > 0) {
                            breakout=true;
                            text += '$' + child.getElementsByTagName('math')[0].getAttribute('alttext') + '$';
                        } else if (child.querySelectorAll('img').length > 0) {
                            breakout=true;
                            text += '$' + child.querySelectorAll('img')[0].getAttribute('alt') + '$';
                        }
                    }
                } else if (url.includes('stackexchange.com') || url.includes('zhihu.com') || url.includes('amreis.github.io')) {
                    if (nodeName === 'span') {
                        breakout=true;
                        if (child.getElementsByTagName('script').length > 0) {
                            text += '$' + child.getElementsByTagName('script')[0].textContent + '$';
                        }
                    }
                    else if (nodeName === 'script') {
                        text += '$' + child.textContent + '$';
                    }
                } else if (url.includes('chatgpt.com')||url.includes('alejandroschuler.github.io')||url.includes('chat.deepseek.com')) {
                    if (nodeName === 'span') {
                        if (child.getElementsByTagName('annotation').length > 0) {
                            breakout=true;
                            text += '$' + child.getElementsByTagName('annotation')[0].textContent + '$';
                        }
                    }
                } else if (url.includes('arxiv.org')|| url.includes('ar5iv.org')){
                    if (nodeName === 'math'){
                        text += '$' + child.getAttribute('alttext') + '$'
                    }
                } else if (url.includes('csdn.net')){
                    if (nodeName === 'span' && (child.getAttribute('class')==="katex--display" || child.getAttribute('class')==="katex--inline")){
                        const temp=child.getElementsByClassName("katex-mathml")[0].textContent
                        const terms = temp.split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0);
                        // Return the last non-empty term, or empty string if none found
                        if (terms.length>0){
                            text += '$' + terms[terms.length - 1] + '$'
                        }
                        }
                    }
                else if (url.includes('gemini.google.com')){
                    if (nodeName === 'div' && child.getAttribute('class')==="math-block"){
                        text += '\n$$' + child.getAttribute('data-math')+ '$$\n';
                        breakout=true;
                        }
                     if (nodeName === 'span' && child.getAttribute('class')==="math-inline"){
                        text += '$' + child.getAttribute('data-math')+ '$';
                         breakout=true;
                        }
                    }
                }
            // For other elements, recurse into their children
            if (!breakout && child.nodeType === Node.ELEMENT_NODE && !['script', 'math', 'img'].includes(child.nodeName.toLowerCase())) {
                text += getTextContentWithReplacements(url,child);
            }
        });
    }
    text = text.replace(/\n+/g, '\n').trim();
    text = text.replace(/\\bm\{([^}]+)\}/g, "\\mathbf{$1}");
    text = text.replace(/\\bigg\{\|\}/g, "\\Bigl|");
    text = text.replace(/\\big\{\|\}/g, "\\big|");
    text = decodeHTMLEntities(text);
    return text
}

(function() {
    'use strict';

    // Create the button element
    const button = document.createElement('button');
    button.textContent = 'Copy';
    button.style.position = 'absolute';
    button.style.zIndex = '2147483647';  // High z-index
    button.style.display = 'none'; // Initially hidden
    button.style.border = '1px solid black'; // For visibility
    button.style.padding = '5px 10px'; // For better appearance
    button.style.fontSize = '14px'; // For better appearance
    button.style.cursor = 'pointer'; // Visual feedback
    button.style.visibility = 'visible'; // Ensure visibility
    button.style.opacity = '1'; // Ensure opacity

    // Append the button to the body
    document.body.appendChild(button);

    // Function to handle button click
    button.addEventListener('click', function() {
        const selectedText = window.getSelection();
        if (selectedText) {
            myfunction(selectedText);
        }
        button.style.display = 'none'; // Hide the button after click
    });

let previousSelectedText = '';

document.addEventListener('mouseup', function(event) {
    const selectedText = window.getSelection().toString().trim();

    // Only show the button if the selected text has changed
    if (selectedText && selectedText !== previousSelectedText) {
        const x = event.pageX + 5;
        const y = event.pageY + 5;
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.style.display = 'block';
        previousSelectedText = selectedText; // Update the previous selection
        //console.log(button)
    } else {
        button.style.display = 'none';
        previousSelectedText = ''; // Reset previous selection if no text is selected
    }
});


    // Custom function to process the selected text
    function myfunction(selection) {
        let url = window.location.href
        let range = selection.getRangeAt(0);
        //console.log('Text selected:', selection.toString()); // Log selected text
        let c=range.cloneContents();
        let text = getTextContentWithReplacements(url,c);
        navigator.clipboard.writeText(text);
    }

document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.ctrlKey && event.altKey && event.key === 'C') {
        //event.preventDefault(); // Prevent default browser behavior (like copying)
        const selectedText = window.getSelection();
        if (selectedText) {
            myfunction(selectedText);
        }
    }
})


})();
