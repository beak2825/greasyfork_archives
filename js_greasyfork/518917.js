// ==UserScript==
// @name         Mocro 自定义按钮
// @namespace    http://tampermonkey.net/
// @version      2024-11-26
// @description  Shimo Mocro custom button
// @author       Jack
// @match        https://m.shimodev.com/app?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shimodev.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518917/Mocro%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/518917/Mocro%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration array for buttons
    const buttonConfigs = [
        {
            text: 'saas-release office-gateway',
            left: 170,
            link: "https://m.shimodev.com/app?aid=364&enterpriseId=1&envId=2&releaseId=98812&tab=config&zoneId=2"
        },
        {
            text: 'co-1.1 office-gateway',
            left: 360,
            link: "https://m.shimodev.com/app?aid=364&enterpriseId=-3&envId=177&releaseId=98812&tab=config&zoneId=2"
        }
    ];

    // Common button styles
    const baseButtonStyle = {
        position: 'fixed',
        top: '8px',
        zIndex: '9999',
        padding: '4px 8px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    };

    // Function to create and style a button
    function createButton(config) {
        const btn = document.createElement('button');

        // Set button text
        btn.innerHTML = config.text;

        // Apply base styles
        Object.assign(btn.style, baseButtonStyle);

        // Set specific left position
        btn.style.left = `${config.left}px`;

        // Add hover effects
        btn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#45a049';
        });

        btn.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4CAF50';
        });

        // Add click event
        btn.addEventListener('click', ()=>{
            window.location.href = config.link
        });

        return btn;
    }

    // Create and append buttons
    buttonConfigs.forEach(config => {
        const button = createButton(config);
        document.body.appendChild(button);
    });

    const styles = `
        ul.ant-menu-overflow.ant-menu {
            width: 20px!important;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
})();