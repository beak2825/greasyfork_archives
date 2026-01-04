// ==UserScript==
// @name        Amazon Cart for quotation
// @name:es     Carro de Amazon para cotización
// @namespace   https://greasyfork.org/es/users/1435102-fcord
// @author      fcord
// @version     0.2.2
// @license     MIT
// @description Save time and improve the presentation of your Amazon quotes. This script eliminates clutter and ads from the cart, allowing you to generate clean and professional quotes in seconds.
// @description:es Ahorra tiempo y mejora la presentación de tus cotizaciones de Amazon. Este script elimina la publicidad y el desorden del carrito, permitiéndote generar cotizaciones limpias y profesionales en segundos.
// @include     http*://www.amazon.cn/*
// @include     http*://www.amazon.in/*
// @include     http*://www.amazon.co.jp/*
// @include     http*://www.amazon.com.sg/*
// @include     http*://www.amazon.com.tr/*
// @include     http*://www.amazon.ae/*
// @include     http*://www.amazon.fr/*
// @include     http*://www.amazon.de/*
// @include     http*://www.amazon.it/*
// @include     http*://www.amazon.nl/*
// @include     http*://www.amazon.es/*
// @include     http*://www.amazon.co.uk/*
// @include     http*://www.amazon.ca/*
// @include     http*://www.amazon.com.mx/*
// @include     http*://www.amazon.com/*
// @include     http*://www.amazon.com.au/*
// @include     http*://www.amazon.com.br/*
// @include     http*://smile.amazon.com/*
// @run-at      document-body
// @match        https://www.amazon.*/cart/view.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526905/Amazon%20Cart%20for%20quotation.user.js
// @updateURL https://update.greasyfork.org/scripts/526905/Amazon%20Cart%20for%20quotation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para ocultar o mostrar elementos
    function toggleElements(hide) {
        const elements = [
            "#amzn-ss-wrap",
            "#sc-secondary-list",
            "#rhf",
            "#navFooter",
            "#sc-new-upsell",
            "#sc-rec-bottom",
            "#sc-rec-right",
            "#proceed-to-checkout-desktop-container",
            "#cart-important-message-box",
            "#sc-new-upsell",
            "#nav-AssociateStripe"
        ];

        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = hide ? "none" : "";
            }
        });

        // Cambiar el texto del H2
        const header = document.querySelector("div#sc-active-items-header h2");
        if (header) {
            header.textContent = hide ? "Modo Cotización" : "Carrito de compras"; // Texto original
        }
    }

    // Crea el botón
    const button = document.createElement("button");
    button.textContent = "Ocultar elementos";
    button.style.cssText = `
        background-color: #4CAF50; /* Verde moderno */
        border: none;
        color: white;
        padding: 10px 20px;
        margin-right: 10px;
        cursor: pointer;
        border-radius: 5px;
        font-family: sans-serif;
        font-size: 16px;
        transition: background-color 0.3s ease;
    `;

    button.addEventListener("click", function() {
        const isHidden = this.textContent === "Ocultar elementos";
        toggleElements(isHidden);
        this.textContent = isHidden ? "Mostrar elementos" : "Ocultar elementos";
        // Cambiar el color del botón al hacer clic
        this.style.backgroundColor = isHidden ? "#007bff" : "#4CAF50"; // Azul/Verde
    });

    // Encuentra el elemento div#sc-active-cart y añade el botón antes de él
    const activeCartDiv = document.querySelector("div#sc-active-cart");
    if (activeCartDiv) {
        activeCartDiv.parentNode.insertBefore(button, activeCartDiv);
    }

})();