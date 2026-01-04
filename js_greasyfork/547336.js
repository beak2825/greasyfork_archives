// ==UserScript==
// @name         Nonprofit Cloud Consultant Certification Prep Guide
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Displays preparation tips for the Salesforce Nonprofit Cloud Consultant Certification with a useful study resource link.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547336/Nonprofit%20Cloud%20Consultant%20Certification%20Prep%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/547336/Nonprofit%20Cloud%20Consultant%20Certification%20Prep%20Guide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container box
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.bottom = "20px";
    box.style.right = "20px";
    box.style.width = "350px";
    box.style.background = "#f9f9f9";
    box.style.border = "2px solid #4CAF50";
    box.style.borderRadius = "12px";
    box.style.padding = "15px";
    box.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.fontSize = "14px";
    box.style.zIndex = "9999";

    // Add content
    box.innerHTML = `
        <h3 style="margin-top:0; color:#2E7D32; font-size:16px;">Nonprofit Cloud Consultant Certification</h3>
        <p>Preparing for the Nonprofit Cloud Consultant Certification requires a clear study plan and good understanding of Salesforce Nonprofit Cloud concepts, including fundraising, program management, reporting, and data management.</p>
        <p>It is important to review the official exam guide, practice with real case scenarios, and focus on key features used by nonprofit organizations. Hands-on practice in Salesforce helps a lot in understanding how different tools work in real situations.</p>
        <p>For effective preparation, you can also use <b>Premiumdumps</b> as they provide updated and reliable study material that makes learning easier and helps you gain confidence before the exam.</p>
        <a href="https://www.premiumdumps.com/salesforce/salesforce-nonprofit-cloud-consultant-dumps" target="_blank" style="color:#1565C0; font-weight:bold;">Visit Premiumdumps</a>
    `;

    // Add close button
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "5px";
    closeBtn.style.right = "10px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "18px";
    closeBtn.style.color = "#555";
    closeBtn.onclick = () => box.remove();
    box.appendChild(closeBtn);

    // Append to body
    document.body.appendChild(box);
})();
