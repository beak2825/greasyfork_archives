// ==UserScript==
// @name         Super Duolingo VIP 3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  A tool for Duolingo with various functionalities.
// @author       You
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502003/Super%20Duolingo%20VIP%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/502003/Super%20Duolingo%20VIP%2030.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // CSS animation for rainbow effect
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes rainbowBlink {
            34% { color: red; }
            14% { color: orange; }
            28% { color: yellow; }
            49% { color: green; }
            97% { color: blue; }
            71% { color: indigo; }
            85% { color: violet; }
            100% { color: red; }
            10% { color: Black
        }
        @keyframes blink {
            50% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }
        @keyframes buttonBlink {
            50% { background-color: #FF69B4; }
            50% { background-color: #0000CD; }
            100% { background-color: #FF69B4; }
        }
        @keyframes colorChange {
            50% { background-color: #FF69B4; }
            50% { background-color: #0000CD; }
            100% { background-color: #FF69B4; }
        }
        .rainbow-text {
            font-weight: bold;
            animation: rainbowBlink 2s infinite;
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
 
    // Create the frame
    let frame = document.createElement('div');
    frame.style.position = 'fixed';
    frame.style.bottom = '10px';
    frame.style.right = '10px';
    frame.style.width = '300px';
    frame.style.border = '3px solid';
    frame.style.borderRadius = '10px';
    frame.style.zIndex = '1000';
    frame.style.padding = '10px';
    frame.style.backgroundColor = 'white';
    frame.style.display = 'flex';
    frame.style.flexDirection = 'column';
    frame.style.alignItems = 'center';
    frame.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
    frame.style.animation = 'rainbowBlink 1s infinite';
 
    // Hide/Show button
    let hideShowButton = document.createElement('button');
    hideShowButton.textContent = 'Hide';
    hideShowButton.style.position = 'fixed';
    hideShowButton.style.bottom = '5px';
    hideShowButton.style.right = '5px';
    hideShowButton.style.backgroundColor = '#FF69B4';
    hideShowButton.style.padding = '5px';
    hideShowButton.style.border = 'none';
    hideShowButton.style.cursor = 'pointer';
    hideShowButton.style.borderRadius = '5px';
    hideShowButton.style.zIndex = '1001';
    document.body.appendChild(hideShowButton);
 
    hideShowButton.addEventListener('click', function() {
        if (frame.style.display === 'none') {
            frame.style.display = 'flex';
            hideShowButton.textContent = 'Hide';
        } else {
            frame.style.display = 'none';
            hideShowButton.textContent = 'Show';
        }
    });
 
    // Create title
    let title = document.createElement('h1');
    title.textContent = 'Super Duolingo VIP 3.0';
    title.style.fontFamily = 'cursive';
    title.style.animation = 'rainbowBlink 1s infinite';
    title.style.textAlign = 'center'; // Center align
    frame.appendChild(title);
 
    // Create the help text
    let helpText = document.createElement('p');
    helpText.innerHTML = 'Nếu bạn có vấn đề về Super Duolingo. Nhớ liên hệ <br><strong class="rainbow-text"><br>Facebook: PhoeniX - Super Duolingo</strong>';
    helpText.style.fontFamily = 'cursive';
    helpText.style.animation = 'rainbowBlink 2s infinite';
    helpText.style.textAlign = 'center'; // Center align
    frame.appendChild(helpText);
 
    // Create the icon container
    let iconContainer = document.createElement('div');
    iconContainer.style.display = 'flex';
    iconContainer.style.justifyContent = 'center';
    iconContainer.style.marginTop = '10px';
 
    let discordIcon = document.createElement('img');
    discordIcon.src = 'https://img.icons8.com/color/24/000000/discord-logo.png';
    discordIcon.style.cursor = 'pointer';
    discordIcon.style.borderRadius = '50%';
    discordIcon.style.margin = '0 5px';
    discordIcon.style.width = '24px';
    discordIcon.style.height = '24px';
 
    let zaloIcon = document.createElement('img');
    zaloIcon.src = 'https://img.icons8.com/color/24/000000/zalo.png';
    zaloIcon.style.cursor = 'pointer';
    zaloIcon.style.borderRadius = '50%';
    zaloIcon.style.margin = '0 5px';
    zaloIcon.style.width = '24px';
    zaloIcon.style.height = '24px';
 
    iconContainer.appendChild(discordIcon);
    iconContainer.appendChild(zaloIcon);
    frame.appendChild(iconContainer);
 
    discordIcon.addEventListener('click', function() {
        window.location.href = 'https://discord.com/';
    });
 
    zaloIcon.addEventListener('click', function() {
        window.location.href = 'https://zalo.me/';
    });
 
    // Create subtitle
    let subTitle = document.createElement('p');
    subTitle.textContent = 'Phiên bản mới';
    subTitle.style.color = '#7FFF00';
    subTitle.style.fontFamily = 'cursive';
    subTitle.style.fontWeight = 'bold';
    subTitle.style.animation = 'blink 1s infinite';
    subTitle.style.marginBottom = '5px';
    subTitle.style.textAlign = 'center'; // Center align
    frame.appendChild(subTitle);
 
    // Create Get Super button
    let getSuperButton = document.createElement('button');
    getSuperButton.textContent = 'Nhận Super Duolingo';
    getSuperButton.style.backgroundColor = '#0000CD';
    getSuperButton.style.padding = '10px';
    getSuperButton.style.border = 'none';
    getSuperButton.style.cursor = 'pointer';
    getSuperButton.style.animation = 'buttonBlink 1s infinite';
    getSuperButton.style.borderRadius = '5px';
    getSuperButton.style.margin = '5px 0';
    getSuperButton.style.width = '100%';
    frame.appendChild(getSuperButton);
 
    getSuperButton.addEventListener('click', function() {
        let urls = [
            'https://link4m.com/53ZwcR',
            'https://link4m.com/ACDIW',
            'https://link4m.com/freYbOIU',
            'https://link4m.com/d5j8heS'
        ];
        let randomIndex = Math.floor(Math.random() * urls.length);
        window.location.href = urls[randomIndex];
    });
 
    // Create Login button
    let loginButton = document.createElement('button');
    loginButton.textContent = 'Đăng Nhập Tài Khoản';
    loginButton.style.backgroundColor = '#FF69B4';
    loginButton.style.padding = '10px';
    loginButton.style.border = 'none';
    loginButton.style.cursor = 'pointer';
    loginButton.style.animation = 'colorChange 1s infinite';
    loginButton.style.borderRadius = '5px';
    loginButton.style.margin = '5px 0';
    loginButton.style.width = '100%';
    frame.appendChild(loginButton);
 
    loginButton.addEventListener('click', function() {
        window.location.href = 'https://www.duolingo.com/?isLoggingIn=true';
    });
 
    // Create Register button
    let registerButton = document.createElement('button');
    registerButton.textContent = 'Đăng Kí Tài Khoản';
    registerButton.style.backgroundColor = '#0000CD';
    registerButton.style.padding = '10px';
    registerButton.style.border = 'none';
    registerButton.style.cursor = 'pointer';
    registerButton.style.animation = 'buttonBlink 1s infinite';
    registerButton.style.borderRadius = '5px';
    registerButton.style.margin = '5px 0';
    registerButton.style.width = '100%';
    frame.appendChild(registerButton);
 
    registerButton.addEventListener('click', function() {
        window.location.href = 'https://www.duolingo.com/register';
    });
 
    // Create Post button
    let postButton = document.createElement('button');
    postButton.textContent = 'Bài Viết';
    postButton.style.backgroundColor = '#FFA500';
    postButton.style.padding = '10px';
      postButton.style.border = 'none';
    postButton.style.cursor = 'pointer';
    postButton.style.borderRadius = '5px';
    postButton.style.margin = '5px 0';
    postButton.style.width = '100%';
    frame.appendChild(postButton);
 
    // Create Connected button
    let connectedButton = document.createElement('button');
    connectedButton.textContent = 'Connected';
    connectedButton.style.backgroundColor = '#228B22';
    connectedButton.style.color = 'white';
    connectedButton.style.padding = '10px';
    connectedButton.style.border = 'none';
    connectedButton.style.cursor = 'default';
    connectedButton.style.borderRadius = '5px';
    connectedButton.style.margin = '5px 0';
    connectedButton.style.width = '100%';
    connectedButton.style.textAlign = 'center';
    frame.appendChild(connectedButton);
 
    // Append frame to the body
    document.body.appendChild(frame);
})();
 
 