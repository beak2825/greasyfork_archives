// ==UserScript==
// @name         Drawaria Store And Buy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Módulo completo de tienda usando la Fake Store API
// @author       Tú
// @match        *://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/543119/Drawaria%20Store%20And%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/543119/Drawaria%20Store%20And%20Buy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear botón para abrir la tienda
    const storeBtn = document.createElement('button');
    storeBtn.textContent = '🛒 Tienda Drawaria';
    storeBtn.style.position = 'fixed';
    storeBtn.style.top = '12px';
    storeBtn.style.right = '12px';
    storeBtn.style.zIndex = 10000;
    document.body.appendChild(storeBtn);

    // Crea el contenedor del modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.border = '2px solid #222';
    modal.style.zIndex = 10001;
    modal.style.display = 'none';
    modal.style.width = '480px';
    modal.style.maxHeight = '80vh';
    modal.style.overflowY = 'auto';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 8px 32px #000a';
    modal.style.borderRadius = '10px';
    document.body.appendChild(modal);

    // Botón de cerrar
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cerrar';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    modal.appendChild(closeBtn);

    // Mostrar/ocultar tienda
    storeBtn.onclick = () => { modal.style.display = 'block'; };
    closeBtn.onclick = () => { modal.style.display = 'none'; };

    // Carrito en memoria
    let cart = [];

    // Renderizar productos y carrito
    function renderStore(products) {
        modal.innerHTML = '<h2 style="margin-top:0">🛒 Drawaria Store</h2>';
        modal.appendChild(closeBtn);

        const prods = document.createElement('div');
        prods.style.display = 'grid';
        prods.style.gridTemplateColumns = 'repeat(2,1fr)';
        prods.style.gap = '18px';

        products.forEach(product => {
            const card = document.createElement('div');
            card.style.border = '1px solid #ccc';
            card.style.borderRadius = '8px';
            card.style.padding = '10px';
            card.style.background = '#fafafa';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" style="width:80px;height:80px;object-fit:contain;">
                <div style="font-weight:bold;margin:8px 0 4px 0;font-size:15px;text-align:center;">${product.title}</div>
                <div style="color:#09b;font-weight:bold;font-size:16px;">$${product.price}</div>
            `;

            const addBtn = document.createElement('button');
            addBtn.textContent = 'Agregar al carrito';
            addBtn.onclick = () => {
                cart.push(product);
                renderCart();
            };
            card.appendChild(addBtn);

            prods.appendChild(card);
        });

        modal.appendChild(prods);

        // Carrito
        const cartDiv = document.createElement('div');
        cartDiv.style.marginTop = '24px';
        renderCart(cartDiv);

        modal.appendChild(cartDiv);
    }

    function renderCart(cartDiv) {
        if (!cartDiv) {
            cartDiv = modal.querySelector('.drawaria-cart');
            if (!cartDiv) {
                cartDiv = document.createElement('div');
                cartDiv.className = 'drawaria-cart';
                modal.appendChild(cartDiv);
            }
        }
        cartDiv.innerHTML = `<h3 style="margin-bottom:6px;">👜 Carrito</h3>`;

        if (cart.length === 0) {
            cartDiv.innerHTML += '<div style="color:#888;">El carrito está vacío</div>';
        } else {
            cart.forEach((prod, idx) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.gap = '8px';
                row.style.marginBottom = '4px';

                row.innerHTML = `
                    <img src="${prod.image}" style="width:28px;height:28px;">
                    <span style="flex:1;font-size:14px;">${prod.title}</span>
                    <span style="color:#09b;font-weight:bold;font-size:15px;">$${prod.price}</span>
                `;

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Eliminar';
                delBtn.onclick = () => {
                    cart.splice(idx, 1);
                    renderCart(cartDiv);
                };
                row.appendChild(delBtn);
                cartDiv.appendChild(row);
            });

            const total = cart.reduce((a, b) => a + b.price, 0);
            cartDiv.innerHTML += `<div style="margin-top:6px;font-weight:bold;font-size:16px;">Total: $${total.toFixed(2)}</div>`;

            const buyBtn = document.createElement('button');
            buyBtn.textContent = 'Comprar';
            buyBtn.style.marginTop = '10px';
            buyBtn.onclick = () => {
                alert('¡Compra simulada con éxito! Gracias por comprar en Drawaria Store 😊');
                cart = [];
                renderCart(cartDiv);
            };
            cartDiv.appendChild(buyBtn);
        }
    }

    // Obtener productos
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => renderStore(products));

})();
