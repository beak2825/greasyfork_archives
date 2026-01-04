// ==UserScript==
// @name         Vapeshoplugo Tools
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Añade un botón de edición y muestra el stock disponible en los productos de WooCommerce
// @author       Aitor
// @match        https://vapeshoplugo.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514720/Vapeshoplugo%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/514720/Vapeshoplugo%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const consumerKey = 'ck_32a0a9bb6db1510c19a935daf726f89c36f6584e'; 
    const consumerSecret = 'cs_2d7fa8e03c5a3c031debbbe102e5b3318881bab9';
    const apiBaseUrl = 'https://vapeshoplugo.es/wp-json/wc/v3/products/';

    const credentials = btoa(`${consumerKey}:${consumerSecret}`);

    const stockCache = {};

    function addEditButton(li, productId) {
        if (li.querySelector('.edit-button')) return;

        let button = document.createElement('a');
        button.textContent = '✏️ Editar';
        button.href = `https://vapeshoplugo.es/wp-admin/post.php?post=${productId}&action=edit`;
        button.className = 'edit-button';
        Object.assign(button.style, {
            position: 'absolute',
            top: '5px',
            left: '5px',
            padding: '3px 6px',
            backgroundColor: '#81358d',
            color: '#fff',
            textDecoration: 'none',
            zIndex: '1000',
            borderRadius: '3px',
            fontSize: '10px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s, transform 0.3s',
            whiteSpace: 'nowrap'
        });

        button.setAttribute('target', '_blank');
        button.setAttribute('rel', 'noopener noreferrer');

        button.onmouseover = () => {
            button.style.backgroundColor = '#6a287b';
            button.style.transform = 'scale(1.1)';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '#81358d';
            button.style.transform = 'scale(1)';
        };

        li.style.position = 'relative';
        li.appendChild(button);
    }

    async function addStockBadge(li, productId) {
        if (li.querySelector('.stock-badge')) return;

        try {
            let stockQuantity;

            if (stockCache[productId] !== undefined) {
                stockQuantity = stockCache[productId];
            } else {
                const response = await fetch(`${apiBaseUrl}${productId}`, {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });

                if (!response.ok) {
                    console.error(`Error al obtener stock para el producto ID ${productId}:`, response.statusText);
                    stockQuantity = 'N/A';
                } else {
                    const productData = await response.json();
                    stockQuantity = productData.stock_quantity;
                    stockCache[productId] = stockQuantity;
                }
            }

            const stockBadge = document.createElement('div');
            stockBadge.className = 'stock-badge';
            stockBadge.textContent = `Stock: ${stockQuantity !== null ? stockQuantity : 'N/A'}`;

            Object.assign(stockBadge.style, {
                position: 'absolute',
                top: '5px',
                right: '5px',
                padding: '3px 6px',
                backgroundColor: '#28a745',
                color: '#fff',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
                zIndex: '1000',
                transition: 'background-color 0.3s, transform 0.3s',
                whiteSpace: 'nowrap'
            });

            if (stockQuantity !== null && stockQuantity !== 'N/A') {
                if (stockQuantity < 10) {
                    stockBadge.style.backgroundColor = '#dc3545'; 
                } else if (stockQuantity < 20) {
                    stockBadge.style.backgroundColor = '#ffc107';
                }
            } else {
                stockBadge.style.backgroundColor = '#808080'
            }

            stockBadge.onmouseover = () => {
                stockBadge.style.transform = 'scale(1.1)';
            };
            stockBadge.onmouseout = () => {
                stockBadge.style.transform = 'scale(1)';
            };

            li.appendChild(stockBadge);
        } catch (error) {
            console.error(`Error al obtener stock para el producto ID ${productId}:`, error);
        }
    }

    function processProduct(li) {
        let classes = li.className.split(/\s+/);
        let productId = null;

        for (let cls of classes) {
            let match = cls.match(/^post-(\d+)$/);
            if (match) {
                productId = match[1];
                break;
            }
        }

        if (!productId) return;

        addEditButton(li, productId);

        addStockBadge(li, productId);
    }

    function processAll() {
        let lis = document.querySelectorAll('li.product.type-product');
        lis.forEach(processProduct);
    }

    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Elemento
                            if (node.matches('li.product.type-product')) {
                                processProduct(node);
                            } else {
                                let products = node.querySelectorAll('li.product.type-product');
                                products.forEach(processProduct);
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