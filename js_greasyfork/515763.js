// ==UserScript==
// @name         Alpine Modular Interiors
// @namespace    http://your-unique-namespace.com
// @version      1.0
// @description  Displays information about Alpine Modular Interiors, a modular office furniture manufacturer.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515763/Alpine%20Modular%20Interiors.user.js
// @updateURL https://update.greasyfork.org/scripts/515763/Alpine%20Modular%20Interiors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // HTML content
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px;">
            <h1>Welcome to Alpine Modular Interiors</h1>
            <p>
                Alpine Modular Interiors, known as Ubalpine, is one of the leading 
                <a href="https://www.ub alpine.com/office-furniture-manufacturers" target="_blank">modular office furniture manufacturers</a> 
                and suppliers in Noida, Delhi, and Mumbai, as well as in India. Our vision is to service our clients with quality products, committed deliveries, and satisfactory service at competitive prices.
            </p>
            <p>We specialize in:</p>
            <ul>
                <li>Office Phone Booths and Meeting Booths</li>
                <li>Aluminum Demountable Partitions</li>
                <li>Office Seating and Soft Seating</li>
                <li>Desking Workstations</li>
                <li>Panel Based Workstations</li>
                <li>Height Adjustable Desks</li>
                <li>Executive Desks</li>
                <li>Case Goods - Wood Veneer</li>
                <li>Meeting Tables</li>
                <li>Cafeteria & Training</li>
                <li>Storage Solutions</li>
            </ul>
        </div>
    `;

    // Create a new div element and insert the HTML content
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
})();