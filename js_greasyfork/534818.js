// ==UserScript==
// @name         Pure Text Copy
// @namespace    Pure Text Copy
// @version      1.0.0
// @description  This script disables the automatic source insertion function when copying text.
// @author       DumbGPT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534818/Pure%20Text%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/534818/Pure%20Text%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('copy', function(event) {
        const selection = window.getSelection();
        
        if (selection && selection.toString().length > 0) {
            event.preventDefault();
            
            const pureText = selection.toString();
            
            event.clipboardData.setData('text/plain', pureText);
        }
    }, true);
    
    function showCopyNotification() {
        const notification = document.createElement('div');
        
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; align-items: center;';
        
        const icon = document.createElement('span');
        icon.innerHTML = '✓';
        icon.style.cssText = 'display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background-color: #4CAF50; border-radius: 50%; margin-right: 10px; font-size: 12px; color: white;';
        
        const text = document.createElement('span');
        text.textContent = 'Text Copied';
        text.style.cssText = 'font-family: "Segoe UI", Arial, sans-serif; font-weight: 500;';
        
        container.appendChild(icon);
        container.appendChild(text);
        notification.appendChild(container);
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    document.addEventListener('copy', () => showCopyNotification(), false);
})();
