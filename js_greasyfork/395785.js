// ==UserScript==
// @name         nHentai SauceBot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically converts every 5-6 digit number it finds into a link to nHentai
// @author       ProgrammingandPorn
// @match        *://*.reddit.com/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABKpJREFUWIXFl09oVFcUxn/3vjfzZjqNE20Qg6YDSdFCmkhLdBVEgsZaQZFYXWgp1BYE20WzcFMXXWbRYhcN+UMWLbalNaVQYimEEl2UYiFIQyQYY2owOtXmzTROMpk/7717u5g4ScwYX2ywBx68e+ae833z3XMO7wrmzTTNqrKysvdDoVCzaZrVUsrnAcnamKuUmnNddzybzfbPzMy0u647CSAAwuHw6xUVFd9JKdetEeCKppR6YNv20Uwm0y9M06yqrKy89qzAF5GYjsfjdUY0Gv0oFAo1PUtwACFESGudM0OhUDOA1ho084cCQog1BdRaz78UMIQQhMPhvaZhGNVW3uMN+QKt4WqkgD/dNJedJJfdJONGHkzj6VBdjxovyG5zA7sDG6g2IygNn2bG+Vkl8QzjJRGLxRzABDAcj/bgNhqs9cUcjvLoyUzypXcPN+iPiJn3eNvYxLvhKgJyIeb3XJIP8jdQAeOhKo6IxWL6UdY/WHW8GIgsceeUx5GZq/xlrQxemYPvy17DkkvJTjhpjuSGH1VTLe9z0+D03Mgy9+dzt4gH1MroQDyg6MhMLPF5ShVyljjKkoMmHtQM51PF9aXsFN/IBEI+eS4JKTkvbC5lp4q+YXeGe0Fdcn/JjEIIurK3i+u23C1f4ItJtOVuFdfd2duP7arHZh3Vc8X3pPR8g5eKWZzLN4GMWDjvTcpcNYHFMRlRWv4VCazTCwXTE6mjLFcgJITg4MGD9Pb2Mjo6ytDQEB0dHTQ2NhaHzbqcoidSV4yP6se37/I2pDC1tuVN6o0y3gptYbMZxlOKTu5x+rcfqaioIJlMMjIygmVZ1NfXY1kWN2/e5Nu9x3kvsAVDSu64Gb7K3uEPb4axoFuqDlRJAkt2eB4fis0cD28h8dlptjbv4tSpU/T39xcTCiHo7Oxk3759/PpJFy/3/ML5uUnO6TjSWLF4S8yBR0waBud0nJ+yf7O1eRfAEvCHirW2tjI+Ps7d9RYDGdsPeIH8kxR4aJ7ncf36dSKRCC0tLQwODi4jAQU1lFJIf22rjPLy8o/97JRSkkqlaGpq4tixY+zfv598Po9t28zOziKEWHIkPk37VgBAKcXJkyc5e/YshrFQ2Y7jcOHCBbq7u5mYmFgNgScXYSkTQlBbW8vhw4dpaWmhvLy8+FtHRwdtbW1+STwdgcWmtSYajXLixAnOnDkDQENDA7Zt+yLge8AbhsGOHTvYuXPnEr8QglQqRXt7OwMDAwDU1NT4/gO+Z6xlWfT29pJOp6mtrS25JxgMApBIJHwT8K1AOp2mr6+PSCRCV1cXoVAIrXXxOXToEI2Njdy/f5+xsTHfBEQsFnMBX99aUkr6+vqKCqRSKdLpNBs3bsQwDGzbZs+ePUxPT/sC11rnRVVV1YPV3Am01mzfvp0DBw5QV1dHIBBgdHSUixcvcuXKFb9pgMLdQFRWVl4NBoOvripyjSyfzw/KbDbb/3+AAyy+mg1LKaPPEnz+avaKdF130rbto0opf5WzNuD/TE1Nvel53l0DwHXd8XQ6/bXWOielDAshngOkKMxT/V8frbWrtZ5xHOfa7OzsF4lE4h3HcYYA/gUeRwxt5UumGgAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/395785/nHentai%20SauceBot.user.js
// @updateURL https://update.greasyfork.org/scripts/395785/nHentai%20SauceBot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    // Create a new MutationObserver object that will call its function on DOM modifications
    var observer = new MutationObserver(function(mutations, observer) {
        findNodes();
    });

    // Define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true
    });

    // Call the initial findNodes function
    findNodes();

    // Parse each node individually, searching for either 5 or 6 consecutive digits.
    function handleNode(node) {
        let splits = node.textContent.split(/(\d{6}|\d{5})/g);

        // If at least one match is found, create a span element to replace the text
        if (splits.length > 1) {
            let newSpan = document.createElement('span');

            // Loop through all matches
            splits.forEach(function(el) {
                let match = el.match(/\d{6}|\d{5}/g);

                // If it's a sauce, replace it with a link, otherwise, add the text as normal
                if (match && match.length == 1 && match[0] == el) {
                    let link = document.createElement('a');
                    link.textContent = el;
                    link.setAttribute('href', `https://nhentai.net/g/${el}/`);
                    link.setAttribute('target', '_blank');
                    link.classList.add('sauced');
                    link.style.color = "var(--newCommunityTheme-linkText)";
                    link.style.textDecoration = "underline";
                    newSpan.appendChild(link);
                } else {
                    newSpan.appendChild(document.createTextNode(el));
                }
            });

            // Finally replace the original child
            node.parentNode.replaceChild(newSpan, node);
        }
    }

    // Walk the DOM of the <body> handling all non-empty text nodes
    function findNodes() {
        //Create the TreeWalker
        let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (node.textContent.length === 0 ||
                    node.nodeName !== '#text' ||
                    node.parentNode.nodeName == 'SCRIPT' ||
                    node.parentNode.nodeName == 'STYLE' ||
                    node.parentNode.nodeName == 'NOSCRIPT' ||
                    node.parentNode.className == 'sauced' ||
                    node.parentNode.closest('a') != null ||
		    node.parentNode.closest('[role="textbox"]') != null
                ) {
                    return NodeFilter.FILTER_SKIP; //Skip empty text nodes
                } else {
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        }, false);

        let nodes = [];

        // Push all nodes into a list as the DOMwalker becomes invalid after completion
        while (treeWalker.nextNode()) {
            nodes.push(treeWalker.currentNode);
        }

        //Iterate over all text nodes, calling handleTextNode on each node in the list
        nodes.forEach(function(el) {
            handleNode(el);
        });
    }
})();