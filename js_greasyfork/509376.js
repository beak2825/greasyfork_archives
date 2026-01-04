// ==UserScript==
// @name         flocabulary
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  hello
// @match        https://www.flocabulary.com/subjects/?sso_success=True&backend=google-oauth2
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509376/flocabulary.user.js
// @updateURL https://update.greasyfork.org/scripts/509376/flocabulary.meta.js
// ==/UserScript==

const images = [
    'https://th.bing.com/th/id/OIP.uPXrerYRv8zelqHt7mHVnQHaJQ?rs=1&pid=ImgDetMain',
    'https://th.bing.com/th/id/OIP.rNk35A83LujcEE_kh4owHwHaLU?rs=1&pid=ImgDetMain',
    'https://th.bing.com/th/id/OIP.jA4L_Dkca1P4hi6vWJ4JoQHaFm?rs=1&pid=ImgDetMain',
    'https://editors.dexerto.com/wp-content/uploads/2023/09/23/McDonalds-Japanese-Advert.jpg',
    'https://preview.redd.it/who-tf-is-the-designer-of-this-ad-v0-u2ovdsz1qbga1.jpg?width=640&crop=smart&auto=webp&s=b526d748dc2884c2986733a3951b9bc5e8af850b',
    'https://setupad.com/wp-content/uploads/2022/05/Screenshot-2022-05-20-at-10.13.10-1024x501.jpg'
];

function getRandomPosition() {
    const x = Math.floor(Math.random() * (window.innerWidth - 200)); // Adjust for width of popup
    const y = Math.floor(Math.random() * (window.innerHeight - 100)); // Adjust for height of popup
    return { x, y };
}

function createPopup() {
    const { x, y } = getRandomPosition();
    
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = `${y}px`;
    popup.style.left = `${x}px`;
    popup.style.border = '1px solid #000';
    popup.style.backgroundColor = '#fff';
    popup.style.zIndex = '1000';
    popup.style.padding = '20px';
    popup.style.cursor = 'move';
    popup.style.boxSizing = 'border-box';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.color = 'red';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px'; // Position to the right
    closeButton.style.cursor = 'pointer';

    closeButton.onclick = function() {
        popup.remove();
        createPopup(); // Create a new popup on close
    };

    popup.appendChild(closeButton);
    const img = document.createElement('img');
    img.src = images[Math.floor(Math.random() * images.length)];
    img.alt = "Ad";
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    popup.appendChild(img);

    document.body.appendChild(popup);

    // Drag functionality
    let isDragging = false;
    let offsetX, offsetY;

    popup.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
        document.body.style.cursor = 'move';
    };

    document.onmouseup = function() {
        isDragging = false;
        document.body.style.cursor = 'default';
    };

    document.onmousemove = function(e) {
        if (isDragging) {
            popup.style.left = `${e.clientX - offsetX}px`;
            popup.style.top = `${e.clientY - offsetY}px`;
        }
    };
}

// Start the first popup
createPopup();
