// ==UserScript==
// @name         Mivaperstore Tools
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Crea un atajo directo para editar productos en WordPress en mivaperstore.com
// @author       Aitor
// @match        https://mivaperstore.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514938/Mivaperstore%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/514938/Mivaperstore%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addEditButton(productDiv) {
        if (productDiv.querySelector('.edit-button')) return;

        let classes = productDiv.className.split(/\s+/);
        let postId = null;

        for (let cls of classes) {
            let match = cls.match(/^post-(\d+)$/);
            if (match) {
                postId = match[1];
                break;
            }
        }

        if (!postId) return;

        let button = document.createElement('a');
        button.textContent = '✏️ Editar';
        button.href = `https://mivaperstore.com/wp-admin/post.php?post=${postId}&action=edit`;
        button.className = 'edit-button';

        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#fbc817';
        button.style.color = '#fff';
        button.style.textDecoration = 'none';
        button.style.zIndex = '1000';
        button.style.borderRadius = '4px';
        button.style.fontSize = '12px';
        button.style.fontWeight = 'bold';
        button.style.transition = 'background-color 0.3s, transform 0.3s';

        button.setAttribute('target', '_blank');
        button.setAttribute('rel', 'noopener noreferrer');

        button.onmouseover = () => {
            button.style.backgroundColor = '#d4a10f';
            button.style.transform = 'scale(1.05)';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '#fbc817';
            button.style.transform = 'scale(1)';
        };

        productDiv.style.position = 'relative';

        let boxImage = productDiv.querySelector('.box-image');
        if (boxImage) {
            boxImage.appendChild(button);
        } else {
            productDiv.appendChild(button);
        }
    }

    function processAll() {
        let products = document.querySelectorAll('div.product-small.col.has-hover.product.type-product');
        products.forEach(addEditButton);
    }

    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.matches('div.product-small.col.has-hover.product.type-product')) {
                                addEditButton(node);
                            } else {
                                let products = node.querySelectorAll('div.product-small.col.has-hover.product.type-product');
                                products.forEach(addEditButton);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        processAll();
        setupObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
