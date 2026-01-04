// ==UserScript==
// @name         Super Duolingo 1.0
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Add custom buttons to Duolingo with a vertical colorful border positioned at the center-left and adjusted length with flashing text above the button and rainbow flashing border, and buttons with flashing effects
// @match        *://*.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501724/Super%20Duolingo%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/501724/Super%20Duolingo%2010.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the tool with a vertical colorful border
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '10px'; // Align to the left
    container.style.top = '50%'; // Center vertically
    container.style.transform = 'translateY(-50%)'; // Adjust for centering
    container.style.backgroundColor = 'white';
    container.style.border = '5px solid'; // Define border
    container.style.borderImage = 'linear-gradient(to bottom, red, orange, yellow, green, cyan, blue, violet, red)';
    container.style.borderImageSlice = 1;
    container.style.padding = '15px'; // Increase padding for a larger tool
    container.style.zIndex = '9999';
    container.style.display = 'block'; // Start with tool visible
    container.style.width = '250px'; // Increased width for a larger tool
    container.style.height = '350px'; // Adjusted height for a more reasonable length
    container.style.boxSizing = 'border-box'; // Include border in element's width and height
    container.style.animation = 'flash-rainbow 5s linear infinite'; // Add rainbow flashing effect

    // Create a toggle button that will always be visible
    var toggleContainer = document.createElement('div');
    toggleContainer.style.position = 'fixed';
    toggleContainer.style.left = '10px'; // Align to the left
    toggleContainer.style.top = '10px'; // Position toggle button at the top-left corner
    toggleContainer.style.zIndex = '10000'; // Make sure it's above the tool

    var btnToggleVisibility = document.createElement('button');
    btnToggleVisibility.textContent = 'Ẩn/Hiện Công Cụ';
    btnToggleVisibility.style.backgroundColor = '#555'; // Màu xám đậm
    btnToggleVisibility.style.color = 'white';
    btnToggleVisibility.onclick = function() {
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    };
    toggleContainer.appendChild(btnToggleVisibility);

    // Function to create buttons with consistent size and flashing effect
    function createButton(text, backgroundColor, flashColor, onClickAction) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.backgroundColor = backgroundColor;
        button.style.color = 'white';
        button.style.width = '100%'; // Make button full width of the container
        button.style.padding = '10px'; // Add padding inside button
        button.style.marginBottom = '10px'; // Add spacing between buttons
        button.style.border = 'none'; // Remove default border
        button.style.borderRadius = '5px'; // Rounded corners for better look
        button.style.cursor = 'pointer'; // Change cursor to pointer
        button.style.boxSizing = 'border-box'; // Include padding and border in element's width and height
        button.style.animation = `flash-${flashColor} 1.5s infinite`; // Add flashing effect
        button.onclick = onClickAction;
        return button;
    }

    // Add header text above the button
    var header = document.createElement('div');
    header.style.textAlign = 'center'; // Center-align the text
    header.style.marginBottom = '10px'; // Add margin below the header
    header.style.fontFamily = "'Comic Sans MS', cursive, sans-serif"; // Special font for header
    header.style.fontSize = '16px'; // Font size for header
    header.style.fontWeight = 'bold'; // Make header bold
    header.innerHTML = `
        <div style="color: gold; font-size: 18px;">Super Duolingo 1.0</div>
        <div id="flashing-bottom" style="color: lightblue;">Contact Zalo if you have problem: 0794451906</div>
        <div id="flashing-link" style="color: #8A2BE2; font-size: 14px; margin-top: 10px; animation: flash-purple 1.5s infinite;">
            Link Zalo: <a href="https://zalo.me/g/ihpofq496" style="color: #8A2BE2;">https://zalo.me/g/ihpofq496</a>
        </div>
        <style>
            @keyframes flash-yellow {
                0% { opacity: 1; color: gold; }
                50% { opacity: 0.3; color: darkgoldenrod; }
                100% { opacity: 1; color: gold; }
            }
            @keyframes flash-rainbow {
                0% { border-color: red; }
                14% { border-color: orange; }
                28% { border-color: yellow; }
                42% { border-color: green; }
                57% { border-color: cyan; }
                71% { border-color: blue; }
                85% { border-color: violet; }
                100% { border-color: red; }
            }
            @keyframes flash-purple {
                0% { color: #8A2BE2; }
                50% { color: #6A0D91; }
                100% { color: #8A2BE2; }
            }
            @keyframes flash-green {
                0% { background-color: green; }
                50% { background-color: darkgreen; }
                100% { background-color: green; }
            }
            @keyframes flash-blue {
                0% { background-color: blue; }
                50% { background-color: darkblue; }
                100% { background-color: blue; }
            }
            @keyframes flash-yellow {
                0% { background-color: yellow; }
                50% { background-color: gold; }
                100% { background-color: yellow; }
            }
        </style>
    `;
    container.appendChild(header);

    // Button 1: Nhận Super Duolingo
    var btnSuperDuolingo = createButton('Nhận Super Duolingo', '#800080', 'purple', function() {
        alert('Link Super Duolingo: https://invite.duolingo.com/family-plan/2-X35B-65HZ-34NS-22AL')
    });
    btnSuperDuolingo.style.animation = 'none'; // Remove flashing effect
    container.appendChild(btnSuperDuolingo);

    // Button 2: Đăng Kí Tài Khoản
    var btnRegister = createButton('Đăng Kí Tài Khoản', 'green', 'green', function() {
        window.open('https://www.duolingo.com/register', '_blank');
    });
    container.appendChild(btnRegister);

    // Button 3: Đăng Nhập Tài Khoản
    var btnLogin = createButton('Đăng Nhập Tài Khoản', 'blue', 'blue', function() {
        window.open('https://www.duolingo.com/?isLoggingIn=true', '_blank');
    });
    container.appendChild(btnLogin);

    // Button 4: CẬP NHẬT LÊN TOOL VIP
    var btnUpdateVIP = createButton('CẬP NHẬT LÊN TOOL VIP', 'yellow', 'yellow', function() {
        alert('Tool VIP: https://greasyfork.org/vi/scripts/501747-super-duolingo-cho-b%E1%BA%A1n');
    });
    btnUpdateVIP.style.color = 'black'; // Override color for VIP update button
    container.appendChild(btnUpdateVIP);

    // Append the container and toggle button to the body
    document.body.appendChild(container);
    document.body.appendChild(toggleContainer);
})();
