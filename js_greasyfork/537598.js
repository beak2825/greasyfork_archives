// ==UserScript==
// @name         Salesforce Data Architect Roadmap
// @namespace    https://yourdomain.com/
// @version      1.0
// @description  Display a roadmap to becoming a Salesforce Certified Data Architect directly on any webpage
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537598/Salesforce%20Data%20Architect%20Roadmap.user.js
// @updateURL https://update.greasyfork.org/scripts/537598/Salesforce%20Data%20Architect%20Roadmap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container div
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.width = '400px';
    container.style.height = '90vh';
    container.style.overflowY = 'auto';
    container.style.background = '#fff';
    container.style.border = '2px solid #005fbf';
    container.style.padding = '15px';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    container.style.borderRadius = '8px';

    // Add heading
    container.innerHTML = `
        <h2 style="color: #005fbf;">Salesforce Data Architect Roadmap</h2>
        <h3>Phase 1: Foundation</h3>
        <ul>
          <li><strong>Step 1:</strong> Learn Salesforce ecosystem and CRM basics</li>
          <li><strong>Step 2:</strong> Get Salesforce Admin Certified</li>
          <li><strong>Step 3:</strong> Earn Platform App Builder Certification</li>
        </ul>
        <h3>Phase 2: Core Architect Skills</h3>
        <ul>
          <li><strong>Step 4:</strong> Study data modeling & large data volumes</li>
          <li><strong>Step 5:</strong> Learn data integration tools and patterns</li>
          <li><strong>Step 6:</strong> Understand data security and governance</li>
        </ul>
        <h3>Phase 3: Specialized Certifications</h3>
        <ul>
          <li><strong>Step 7:</strong> Sharing & Visibility Designer</li>
          <li><strong>Step 8:</strong> Data Architecture & Management Designer</li>
          <li><strong>Step 9:</strong> Integration Architecture Designer</li>
        </ul>
        <h3>Phase 4: Final Prep</h3>
        <ul>
          <li><strong>Step 10:</strong> Review with real-world scenarios</li>
          <li><strong>Step 11:</strong> Join Salesforce Architect community</li>
          <li><strong>Step 12:</strong> Apply for certification & prepare portfolio</li>
        </ul>
        <p><strong>🎉 Congratulations! You're ready to be certified!</strong></p>
    `;

    // Append to body
    document.body.appendChild(container);
})();
