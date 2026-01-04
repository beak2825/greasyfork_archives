// ==UserScript==
// @name         Snay.io Public Skins Lib
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Snay.io Public Lib
// @author       GravityG
// @match        https://www.snay.io/*
// @grant        GM_openInTab
// @grant        GM_info
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524066/Snayio%20Public%20Skins%20Lib.user.js
// @updateURL https://update.greasyfork.org/scripts/524066/Snayio%20Public%20Skins%20Lib.meta.js
// ==/UserScript==

/* global bootstrap */

(async function () {
    'use strict';

    // Add Bootstrap CSS to the document head
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCSS);

    console.log('Bootstrap:', typeof bootstrap);

    // Add custom CSS for styling, animations, and the navbar button
    const customCSS = document.createElement('style');
    customCSS.innerHTML = `
    nav.navbar {
        background-color: rgb(43, 48, 53) !important;
        color: white;
        position: relative;
    }
    .btn-shine {
        position: absolute;
        top: 50%;
        left: 14.25rem; /* 9.5rem x 1.5 */
        transform: translate(-50%, -50%);
        padding: 18px 72px; /* 12px 48px x 1.5 */
        color: #fff;
        background: linear-gradient(to right, #bed7f7 10%, #79aef2 10%, #868686 20%);
        background-position: 0;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 3s infinite linear;
        animation-fill-mode: forwards;
        font-weight: 600;
        font-size: 24px; /* 16px x 1.5 */
        text-decoration: none;
        white-space: nowrap;
        font-family: "Poppins", sans-serif;
    }
    @keyframes shine {
        0% {
            background-position: 0;
        }
        60% {
            background-position: 215px;
        }
        100% {
            background-position: 215px;
        }
    }
    .search-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding-right: 22.5px;
    }
    .skinurl-container {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        justify-content: center;
        flex-grow: 1;
        padding-right: 22.5px;
        align-items: flex-start;
        align-content: flex-start;
        height: auto;
    }
    .search-container .input {
        border: 3px solid transparent;
        width: 24.5em;
        height: 3.25em;
        padding-left: 1.2em;
        outline: none;
        overflow: hidden;
        background-color: #1d2024;
        color: white;
        border-radius: 15px;
        transition: all 0.5s;
        font-size: 1.56rem;
        font-weight: bold;
    }
    .search-container .input:hover,
    .search-container .input:focus {
        border: 3px solid #4A9DEC !important; /* 2px x 1.5 */
        box-shadow: 0px 0px 0px 10.5px rgb(74, 157, 236, 20%) !important; /* 7px x 1.5 */
        background-color: #1d2024 !important;
    }
    #mySkinsContainer, #favoritesContainer, #skinsContainer {
        display: flex;
        grid-template-columns: repeat(auto-fill, minmax(225px, 1fr)); /* 150px x 1.5 */
        gap: 30px; /* 20px x 1.5 */
        padding: 30px; /* 20px x 1.5 */
        width: 100%;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 0 auto;
        align-content: flex-start;
    }
    #skinsContainer::-webkit-scrollbar {
        width: 12px; /* 8px x 1.5 */
    }
    #skinsContainer::-webkit-scrollbar-thumb {
        background-color: #6c757d !important;
        border-radius: 15px !important; /* 10px x 1.5 */
    }
    #skinsContainer::-webkit-scrollbar-track {
        background-color: #1d2024 !important;
    }
    .skinItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: scale(0.9);
        filter: blur(10px);
        transition: all 0.5s ease-in-out;
    }
    .skinItem::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    width: 213px;
    height: 213px;
    background-image: var(--bg);
    background-size: cover;
    background-position: center;
    filter: contrast(1.2) brightness(0.6) saturate(1.75) url(#gaussianBlur);
    border-radius: 50%;
    z-index: -1;
    opacity: 0.9;
    mask: radial-gradient(circle, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100%);
    }
    .skinItem.loaded {
        opacity: 1;
        transform: scale(1);
        filter: blur(0);
    }
    .skinItem > img {
        width: 195px; /* 130px x 1.5 */
        height: 195px; /* 130px x 1.5 */
        border-radius: 75%; /* 50% x 1.5 */
        object-fit: cover !important;
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .skinItem img:hover {
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    }
    .badge {
        margin-top: 15px; /* 10px x 1.5 */
        font-size: 1.35rem; /* 0.9rem x 1.5 */
        text-align: center;
        background-color: #0d6efd !important;
        color: white !important;
        padding: 7.5px 15px; /* 5px 10px x 1.5 */
        border-radius: 5px; /* 10px x 1.5 */
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .profile-image {
        margin-left: 30px; /* 20px x 1.5 */
        width: 50px; /* 40px x 1.5 */
        height: 50px; /* 40px x 1.5 */
        border-radius: 75%; /* 50% x 1.5 */
        cursor: pointer;
        border: 3px solid white; /* 2px x 1.5 */
    }
    .dropdown-menu.custom-dropdown-menu {
        min-width: 15rem;
        padding: 0.75rem 0;
        font-size: 2.25rem;
        color: var(--bs-body-color);
        background-color: #1d202496 !important;
        border-radius: 15px !important;
        box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15) !important;
        filter: drop-shadow(2px 9px 9px black);
    }
    .dropdown-menu.custom-dropdown-menu>li>a {
        display: block;
        padding: 4.5px 30px !important; /* 3px 20px x 1.5 */
        clear: both;
        font-weight: 400 !important;
        color: #fafafa !important;
        white-space: nowrap !important;
    }
    .dropdown-menu.custom-dropdown-menu>li>a:hover {
        background-color: #4A9DEC !important;
        color: white !important;
    }
    .dropdown-menu.custom-dropdown-menu .dropdown-item.disabled {
        color: #6c757d !important;
        cursor: not-allowed !important;
    }
    .multi-button {
        display: flex;
        justify-content: center;
        margin: 1.5rem auto; /* 1rem x 1.5 */
        width: fit-content;
    }
    .multi-button > button {
        font-size: 1.8rem; /* 1.2rem x 1.5 */
        padding: 0.75em 1.5em; /* 0.5em 1em x 1.5 */
        background: #fff;
        color: #4A5568;
        border: 0px solid #A0AEC0;
        margin: 0.15em; /* 0.1em x 1.5 */
        transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        box-shadow: 0 0 0 #BEE3F8;
        transform: translateY(0);
        cursor: pointer;
        font-weight: bold;
    }
    .multi-button > button:first-of-type {
        border-radius: 0.75em 0 0 0.75em; /* 0.5em x 1.5 */
    }
    .multi-button > button:last-of-type {
        border-radius: 0 0.75em 0.75em 0; /* 0.5em x 1.5 */
    }
    .multi-button > button:hover {
        background: #D53F8C;
        color: #fff;
        box-shadow: 0 0 1.2em 0 rgba(213, 63, 140, 0.8); /* 0 0 0.8em x 1.5 */
        transform: translateY(-0.3em); /* -0.2em x 1.5 */
    }
    .multi-button > button.active {
        background: #D53F8C !important;
        color: white !important;
        box-shadow: 0 0 1.2em 0 rgba(213, 63, 140, 0.8) !important; /* 0 0 0.8em x 1.5 */
        transform: translateY(-0.3em); /* -0.2em x 1.5 */
    }

    .button1 {
  position: absolute; /* Positions the button relative to its container */
  right: 10px;          /* Pushes the button to the far right */
  width: 4em;
  height: 4em;
  border: none;
  background: rgba(180, 83, 107, 0.11);
  border-radius: 5px;
  transition: background 0.5s;
  display: flex;      /* Flexbox ensures centering */
  justify-content: center;
  align-items: center;
}

.X, .Y {
  content: "";
  position: absolute;
  width: 2em;
  height: 2px; /* Adjust thickness for better visibility */
  background-color: #fff;
}

.X {
  transform: rotate(45deg);
}

.Y {
  transform: rotate(-45deg);
}

.button1:hover {
  background-color: rgb(211, 21, 21);
}

`;
document.head.appendChild(customCSS);


    const customMySkinsCSS = document.createElement('style');
    customMySkinsCSS.innerHTML = `
           .profile-upload {
            width: 150px;
            height: 150px;
            border-radius: 75%;
            cursor: pointer;
            border: 3px solid #add8e6;
           }
          .form-container {
            display: flex;
            margin-top: 10px !important;
            justify-content: center;
            align-items: flex-start; !important;
            gap: 5px; /* Add space between elements */
            margin-top: 0; /* Adjust as needed for spacing from the top */
          }
          .skin-name-input {
            position: relative;
            margin: 20px 0;
            width: 190px;
          }
          .skin-name-input input {
            background-color: transparent;
            border: 0;
            border-bottom: 2px #fff solid;
            display: block;
            width: 100%;
            padding: 15px 0;
            font-size: 18px;
            color: #fff;
          }
          .skin-name-input input:focus,
          .skin-name-input input:valid {
            outline: 0;
            border-bottom-color: lightblue;
          }
          .skin-name-input label {
            position: absolute;
            top: 15px;
            left: 0;
            pointer-events: none;
          }
          .skin-name-input label span {
            display: inline-block;
            font-size: 18px;
            min-width: 5px;
            color: #fff;
            transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          .skin-name-input input:focus + label span,
          .skin-name-input input:valid + label span {
            color: lightblue;
            transform: translateY(-30px);
          }
          .submit-btn {
            background-color: lightblue;
            border: none;
            border-radius: 5px;
            color: #000;
            font-size: 18px;
            padding: 10px 15px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .submit-btn:hover {
            background-color: #007acc;
            color: #fff;
          }
          .submit-btn:active {
            transform: scale(0.95);
          }
          .dot-spinner {
            --uib-size: 2.8rem;
            --uib-speed: .9s;
            --uib-color: #183153;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: var(--uib-size);
            width: var(--uib-size);
          }

          .dot-spinner__dot {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 100%;
            width: 100%;
          }

          .dot-spinner__dot::before {
            content: '';
            height: 20%;
            width: 20%;
            border-radius: 50%;
            background-color: #ffffff;
            transform: scale(0);
            opacity: 0.5;
            animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
            box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
          }

                    .dot-spinner__dot:nth-child(2) {
                      transform: rotate(45deg);
                    }

          .dot-spinner__dot:nth-child(2)::before {
            animation-delay: calc(var(--uib-speed) * -0.875);
          }

          .dot-spinner__dot:nth-child(3) {
            transform: rotate(90deg);
          }

          .dot-spinner__dot:nth-child(3)::before {
            animation-delay: calc(var(--uib-speed) * -0.75);
          }

          .dot-spinner__dot:nth-child(4) {
            transform: rotate(135deg);
          }

          .dot-spinner__dot:nth-child(4)::before {
            animation-delay: calc(var(--uib-speed) * -0.625);
          }

          .dot-spinner__dot:nth-child(5) {
            transform: rotate(180deg);
          }

          .dot-spinner__dot:nth-child(5)::before {
            animation-delay: calc(var(--uib-speed) * -0.5);
          }

          .dot-spinner__dot:nth-child(6) {
            transform: rotate(225deg);
          }

          .dot-spinner__dot:nth-child(6)::before {
            animation-delay: calc(var(--uib-speed) * -0.375);
          }

          .dot-spinner__dot:nth-child(7) {
            transform: rotate(270deg);
          }

          .dot-spinner__dot:nth-child(7)::before {
            animation-delay: calc(var(--uib-speed) * -0.25);
          }

          .dot-spinner__dot:nth-child(8) {
            transform: rotate(315deg);
          }

          .dot-spinner__dot:nth-child(8)::before {
            animation-delay: calc(var(--uib-speed) * -0.125);
          }

          @keyframes pulse0112 {
            0%,
            100% {
              transform: scale(0);
              opacity: 0.5;
            }

            50% {
              transform: scale(1);
              opacity: 1;
            }
          }
          #shine2 {
          display: none;
          }
    @media (max-width: 939px) {
    .container-fluid {
        flex-direction: column; /* Stack items vertically */
        align-items: flex-start; /* Align content to the left */
    }
    .btn-shine {
        display: none;
    }
    .dropdown-menu.custom-dropdown-menu {
        right: -15rem;
    }
    #shine2 {
    display: block;
    top: auto;
    left: 50%;
    }
    @media (max-width: 560px) {
    .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding-right: 22.5px;
    height: 10px;
    }
    .search-container .input {
    height: 2.25em;
    }
    .profile-image {
    margin-left: 30px;
    width: 35px;
    height: 35px;
    border-radius: 75%;
    cursor: pointer;
    border: 3px solid white;
    }
    .multi-button {
    display: flex;
    justify-content: center;
    margin: 1.5rem auto;
    width: fit-content;
    height: 30px;
    align-items: center;
    }
    .dropdown-menu.custom-dropdown-menu {
        right: -5rem;
    }
    .skinItem > img {
    width: 155px;
    height: 155px;
    border-radius: 75%;
    object-fit: cover !important;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    #mySkinsContainer, #favoritesContainer, #skinsContainer {
    display: flex;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
    padding: 30px;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 auto;
    align-content: flex-start;
    }
    .skinItem::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -63%);
    width: 166px;
    height: 166px;
    background-image: var(--bg);
    background-size: cover;
    background-position: center;
    filter: contrast(1.2) brightness(0.6) saturate(1.75) url(#gaussianBlur);
    border-radius: 50%;
    z-index: -1;
    opacity: 0.9;
    mask: radial-gradient(circle, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100%);
    }
}
`;
document.head.appendChild(customMySkinsCSS);

    (function () {
    // Append CSS to the document for notifications
    const notificationCSS = `
.notification {
  display: flex;
  flex-direction: column;
  isolation: isolate;
  position: fixed;
  bottom: 5%; /* Spawns in the bottom-left corner */
  left: 2%;
  z-index: 9999;
  width: 18rem;
  height: auto;
  background: #29292c;
  border-radius: 1rem;
  overflow: hidden;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 16px;
  --gradient: linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff);
  --color: #32a6ff;
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.notification.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.notification:before {
  position: absolute;
  content: "";
  inset: 0.0625rem;
  border-radius: 0.9375rem;
  background: #18181b;
  z-index: 2;
}

.notification:after {
  position: absolute;
  content: "";
  width: 0.25rem;
  inset: 0.65rem auto 0.65rem 0.5rem;
  border-radius: 0.125rem;
  background: var(--gradient);
  transition: transform 300ms ease;
  z-index: 4;
}

.notification:hover:after {
  transform: translateX(0.15rem);
}

.notititle {
  color: var(--color);
  padding: 0.65rem 0.25rem 0.4rem 1.25rem;
  font-weight: 500;
  font-size: 1.1rem;
  visibility: visible; /* Ensure visibility */
}

.notibody {
  color: #99999d;
  padding: 0 1.25rem;
  font-size: 0.9rem;
  visibility: visible; /* Ensure visibility */
}

.notification.success {
  --gradient: linear-gradient(to bottom, #28a745, #218838);
  --color: #28a745;
}

.notification.error {
  --gradient: linear-gradient(to bottom, #dc3545, #c82333);
  --color: #dc3545;
}

.notification.info {
  --gradient: linear-gradient(to bottom, #2eadff, #3d83ff);
  --color: #32a6ff;
}
`;

    // Append the CSS to the document
    const style = document.createElement("style");
    style.innerHTML = notificationCSS;
    document.head.appendChild(style);

    // Define the notification system as a window property
    window.showNotification = function (type, title = "Title", body = "Body", duration = 3000) {
        if (!title || !body) {
            console.error("Notification requires a title and body.");
            return;
        }

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notititle">${title}</div>
            <div class="notibody">${body}</div>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add("show");
        });

        // Auto-remove after duration
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => notification.remove(), 300); // Allow transition to finish
        }, duration);
    };

    // Example usage message in the console
    console.log("Notification system loaded. Test it by calling showNotification(type, title, body, duration) from the console.");
})();



    // JavaScript for Tab Switching
function setupTabSwitching() {
    const publicSkinsTab = document.getElementById('publicSkinsTab');
    const mySkinsTab = document.getElementById('mySkinsTab');
    const favoritesTab = document.getElementById('favoritesTab');
    const skinsContainer = document.getElementById('skinsContainer');
    const mySkinsContainer = document.getElementById('mySkinsContainer');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const title = document.getElementById('shine2');
    const title2 = document.getElementById('shine1');

    // Function to update tab content
    function switchTab(tabKey) {
        // Hide all containers by default
        skinsContainer.style.display = 'none';
        mySkinsContainer.style.display = 'none';
        favoritesContainer.style.display = 'none';

        if (tabKey === 'public') {
            // Show the skins container for PUBLIC SKINS
            title.innerText = 'Public Skins';
            title2.innerText = 'Public Skins';
            skinsContainer.style.display = 'grid';
            skinsContainer.innerHTML = `
                <div class="dot-spinner">
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
                </div>`;
            // Fetch and refresh skins when switching to PUBLIC SKINS
            fetchImages()
                .then((images) => {
                    renderImagesLazy(images, skinsContainer);
                    console.log("Public skins refreshed successfully!");
                })
                .catch((error) => {
                    skinsContainer.innerHTML = '<p style="color: red;">Failed to refresh skins. Please try again later.</p>';
                    console.error("Failed to refresh skins:", error);
                });
        } else if (tabKey === 'mySkins') {
            // Display custom content for MY SKINS tab
    title.innerText = 'My Skins';
title2.innerText = 'My Skins';
mySkinsContainer.style.display = 'flex';
mySkinsContainer.style.flexDirection = 'column';
mySkinsContainer.style.justifyContent = 'flex-start';
mySkinsContainer.style.alignItems = 'center';
mySkinsContainer.style.marginTop = '10px';
mySkinsContainer.innerHTML = `
    <img src="https://i.imghippo.com/files/IFso7215PtQ.png" alt="Preview" class="profile-upload" id="preview" aria-expanded="false">
    <div class="search-container skinurl-container">
        <input id="skinName" class="input" style="background-color: #454444;" placeholder="Skin name...">
        <input id="skinurl" class="input" style="background-color: #454444;" placeholder="Skin url...">
        <button id="submitSkin" class="submit-btn"><span>Confirm</span> <span>Skin</span></button>
    </div>
`;

// Get the preview image element
const previewImg = document.getElementById('preview');
const urlInput = document.getElementById('skinurl');
const nameInput = document.getElementById('skinName');

// Create a hidden file input element
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.png, .jpeg, .jpg, .gif'; // Restrict to specific file types
fileInput.style.display = 'none'; // Hide the input

// Append the file input to the body
document.body.appendChild(fileInput);

// Add a click event to the preview image
previewImg.addEventListener('click', () => {
    fileInput.click(); // Trigger the file input's click
});

// Enable or disable the URL input based on the preview image state
const toggleUrlInput = () => {
    if (previewImg.src.startsWith('data:image')) {
        urlInput.value = '';
        urlInput.disabled = true;
    } else {
        urlInput.disabled = false;
    }
};
previewImg.addEventListener('load', toggleUrlInput);

// Handle file input change
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const validExtensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']; // Allowed MIME types
        if (validExtensions.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result; // Update the image src
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (PNG, JPEG, or GIF).');
        }
    }
});

// Handle skin submission
document.getElementById('submitSkin').addEventListener('click', async () => {
    const name = nameInput.value.trim(); // Get and trim the skin name
    const owner = protoService?.userInfo?.id || 'defaultOwner'; // Ensure owner ID exists

    // Check if an image is selected
    const isImageSelected = previewImg.src.startsWith('data:image');

    // Validate inputs
    if (!name) {
        alert('Please provide a skin name.');
        return;
    }

    if (!isImageSelected && !urlInput.value) {
        alert('Please provide a URL or select an image.');
        return;
    }

    if (!isImageSelected && !urlInput.value.startsWith('https://i.imgur.com')) {
        alert('URL must start with https://i.imgur.com.');
        return;
    }

    try {
        let url;

        if (isImageSelected) {
            console.log('Uploading image to Imgur...');
            const base64Image = previewImg.src.split(',')[1]; // Extract Base64 data

            // Upload image to Imgur
            const imgurResponse = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: 'Client-ID 8b2cd28516b0976', // Replace with your Imgur Client ID
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image, type: 'base64' }),
            });

            if (!imgurResponse.ok) {
                const error = await imgurResponse.json();
                console.error('Imgur upload failed:', error);
                throw new Error('Failed to upload image to Imgur.');
            }

            const imgurData = await imgurResponse.json();
            url = imgurData.data.link; // Get the Imgur URL
            console.log('Image uploaded to Imgur:', url);
        } else {
            url = urlInput.value.trim(); // Get the user-provided URL
        }

        // Send POST request to the new API endpoint
        const response = await fetch('https://snay.vercel.app/api/addSkin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, url, owner }), // JSON-encoded body
        });

        // Check response status
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error details:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.error || 'Unknown error occurred'}`);
        }

        const result = await response.json();
        console.log('Skin added successfully. Server response:', result);

        // Notify the user of success
        showNotification("success", "Success!", "Skin uploaded successfully!.");
        if (isImageSelected) {
            previewImg.src = result.url; // Update the preview image to the uploaded Imgur URL
        }
    } catch (error) {
        console.error('Error during skin submission:', error);
        alert(`An error occurred: ${error.message}`);
    }
});

        } else if (tabKey === 'favorites') {
            // Display custom content for FAVORITES tab
            title.innerText = 'Favorites';
            title2.innerText = 'Favorites';
            favoritesContainer.style.display = 'flex';
            favoritesContainer.style.justifyContent = 'center';
            favoritesContainer.style.alignItems = 'center';
            favoritesContainer.innerHTML = `
                <div style="text-align: center;">
                    <img src="https://media.tenor.com/hB9OTbewrikAAAAi/work-work-in-progress.gif"
                         alt="Work in Progress"
                         style="max-width: 100%; height: auto; border-radius: 10px;">
                </div>`;
        }

        // Update the active tab button styles
        publicSkinsTab.classList.remove('active');
        mySkinsTab.classList.remove('active');
        favoritesTab.classList.remove('active');

        if (tabKey === 'public') publicSkinsTab.classList.add('active');
        else if (tabKey === 'mySkins') mySkinsTab.classList.add('active');
        else if (tabKey === 'favorites') favoritesTab.classList.add('active');
    }

    // Add event listeners to each tab button
    publicSkinsTab.addEventListener('click', () => switchTab('public'));
    mySkinsTab.addEventListener('click', () => switchTab('mySkins'));
    favoritesTab.addEventListener('click', () => switchTab('favorites'));

    // Set PUBLIC SKINS as the default tab
    switchTab('public');
}


    // URL of the API endpoint
const API_URL = "https://snay.vercel.app/api/skins";

// Fetch images from the API
async function fetchImages() {
    try {
        console.log("Starting fetch for skins...");
        const response = await fetch(API_URL, {
            method: 'GET', // Explicitly specify GET method
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const { data } = await response.json(); // Extract `data` property from API response
        console.log("Fetched skins data:", data);
        return data;
    } catch (error) {
        console.error("Error in fetchImages:", error);
        throw error;
    }
}
    const svgFilter = `
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <filter id="gaussianBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
    </svg>
`;
document.body.insertAdjacentHTML('afterbegin', svgFilter);

// Render skins in a lazy-loaded manner
function renderImagesLazy(images, container) {
    container.innerHTML = ""; // Clear previous content

    if (!images || images.length === 0) {
        container.innerHTML = '<p style="color: white;">No skins found.</p>';
        return;
    }

    // Keep track of the currently open dropdown
    let openDropdown = null;

    images.forEach((image, index) => {
        // Create the main skin container
        const skinDiv = document.createElement("div");
        skinDiv.className = "skinItem";
        skinDiv.style.position = "relative";

        skinDiv.style.setProperty("--bg", `url(${image.url})`);

        // Create the image element
        const img = document.createElement("img");
        img.src = image.url;
        img.alt = `Owner: ${image.owner}`; // Set the alt attribute to include _id
        img.title = image.name; // Set the title to the skin's name

        // Create a badge for the skin name
        const badge = document.createElement("span");
        badge.className = "badge text-bg-secondary";
        badge.textContent = image.name;

        // Badge click event to call userInfoRequest with owner ID
        badge.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent other click handlers from triggering
            if (image.owner) {
                userInfoRequest(image.owner); // Call userInfoRequest with the owner ID
            } else {
                console.warn("Owner ID is missing for this skin.");
            }
        });

        // Create the dropdown container
        const dropdownContainer = document.createElement("ul");
        dropdownContainer.className = "dropdown-menu custom-dropdown-menu dropdown-menu-end";
        dropdownContainer.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, -200%);
            z-index: 1000;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            `;
        // Create dropdown item for "Vip Skin"
        const vipDropdownItem = document.createElement("li");
        const vipDropdownLink = document.createElement("a");
        vipDropdownLink.className = "dropdown-item";
        vipDropdownLink.href = "#";

        // Create dropdown item for "Custom Skin"
        const customSkinDropdownItem = document.createElement("li");
        const customSkinDropdownLink = document.createElement("a");
        customSkinDropdownLink.className = "dropdown-item";
        customSkinDropdownLink.href = "#";

        // Add an image badge next to the dropdown link
        const vipBadgeImage = document.createElement("img");
        vipBadgeImage.src = "./assets/badges/badge4.png";
        vipBadgeImage.alt = "Badge";
        vipBadgeImage.className = "badge-image";
        vipBadgeImage.style.cssText = `
           width: 20px;
           height: 20px;
           margin-right: 8px;
           vertical-align: middle;
       `;

        // Add an image badge next to the dropdown link
        const customBadgeImage = document.createElement("img");
        customBadgeImage.src = "./assets/img/SkinsCustom.png";
        customBadgeImage.alt = "Custom Skin";
        customBadgeImage.className = "badge-image";
        customBadgeImage.style.cssText = `
           width: 20px;
           height: 20px;
           margin-right: 8px;
           vertical-align: middle;
       `;

        vipDropdownLink.appendChild(vipBadgeImage);
        vipDropdownLink.appendChild(document.createTextNode("Vip Skin"));
        customSkinDropdownLink.appendChild(customBadgeImage);
        customSkinDropdownLink.appendChild(document.createTextNode("Custom Skin"));

        // Dropdown link click handler
        vipDropdownLink.addEventListener("click", (event) => {
            event.preventDefault();
            const vipSkinInput = document.getElementById("addVipSkin");
            if (vipSkinInput) {
                vipSkinInput.value = image.url; // Set the skin URL
            } else {
                console.warn("Input element with id='addVipSkin' not found.");
            }
            const vipButton = document.querySelector("#gallery-body > div.vip-div > ul > li:nth-child(1) > button");
            if (vipButton) {
                vipButton.click();
            }
        });

        customSkinDropdownLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default link behavior
            changeSkin(image.url); // Dynamically pass the URL of the skin
        });


        vipDropdownItem.appendChild(vipDropdownLink);
        dropdownContainer.appendChild(vipDropdownItem);
        customSkinDropdownItem.appendChild(customSkinDropdownLink);
        dropdownContainer.appendChild(customSkinDropdownItem);

        // Dropdown toggle logic
        skinDiv.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent click event propagation
            if (openDropdown && openDropdown !== dropdownContainer) {
                openDropdown.style.display = "none"; // Close other dropdownsF
            }
            dropdownContainer.style.display =
                dropdownContainer.style.display === "block" ? "none" : "block";
            openDropdown = dropdownContainer.style.display === "block" ? dropdownContainer : null;
        });

        // Append elements to the skin container
        skinDiv.appendChild(img);
        skinDiv.appendChild(badge);
        skinDiv.appendChild(dropdownContainer);

        // Append skin container to the main container
        container.appendChild(skinDiv);

        // Apply lazy-loading animation with delay
        setTimeout(() => {
            skinDiv.classList.add("loaded");
        }, index * 100); // 100ms delay per skin
    });

    // Global click listener to close dropdowns when clicking outside
    document.addEventListener("click", () => {
        if (openDropdown) {
            openDropdown.style.display = "none";
            openDropdown = null; // Reset the tracker
        }
    });
}

// Example usage
const skinsContainer = document.getElementById("skinsContainer");
fetchImages()
    .then((images) => renderImagesLazy(images, skinsContainer))
    .catch((error) => {
        skinsContainer.innerHTML = '<p style="color: red;">Failed to load skins.</p>';
    });


    // Main Function
async function main() {
    const sideButtons = document.querySelector('#main-menu .side-buttons') || await waitForElement('#main-menu .side-buttons');

    // Create the "Public Skins" button
    const button = document.createElement('button');
    button.className = 'btn side-btn';
    button.id = 'PublicSkins';
    button.style.cssText = `
        background-color: rgb(139 92 246 / 0%);
        color: white;
        border-radius: 0px;
        padding: 16px 40px;
        font-size: 1.2rem;
        background-image: url(https://i.postimg.cc/wBhr5Ftc/SlF1SEF.png);
    `;

    // Ensure the sideButtons container is set up
    sideButtons.style.display = 'flex';
    sideButtons.style.flexDirection = 'column';
    sideButtons.style.alignItems = 'center';
    sideButtons.prepend(button);

    // Create the drawer
    const drawer = document.createElement('div');
    drawer.className = 'offcanvas offcanvas-bottom';
    drawer.tabIndex = -1;
    drawer.id = 'publicSkinsDrawer';
    drawer.setAttribute('aria-labelledby', 'publicSkinsDrawerLabel');
    drawer.style.height = '100%';
    drawer.style.backgroundColor = '#1d2024';
    drawer.innerHTML = `
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <div class="search-container">
<button class="button1" id="closebtn"> <span class="X"></span><span class="Y"></span></button>
                    <input id="customInputField" class="input" placeholder="Search skins...">
                    <div class="dropdown profile-container">
                        <img src="https://i.imgur.com/V4RclNb.png" alt="Profile" class="profile-image dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <ul class="dropdown-menu custom-dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                            <li><a class="dropdown-item" href="#" id="discord-login-btn" data-action="login">Login</a></li>
                            <li><a class="dropdown-item" href="#" id="discord-logout-btn" data-action="logout" style="display: none;">Logout</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#" id="refreshSkins">Refresh Skins</a></li>
                        </ul>
                    </div>
                </div>
                <a href="#" id="shine1" class="btn-shine">Public Skins</a>
            </div>
        </nav>
        <div class="multi-button">
            <button id="publicSkinsTab">PUBLIC SKINS</button>
            <button id="mySkinsTab">MY SKINS</button>
            <button id="userPPP">hello</button>
            <button id="favoritesTab">❤️</button>
        </div>
        <div class="offcanvas-body">
            <a href="#" id="shine2" class="btn-shine">Public Skins</a>
            <div id="skinsContainer" style="display: none;"></div>
            <div id="mySkinsContainer" style="display: none;"></div>
            <div id="favoritesContainer" style="display: none;"></div>
        </div>
    `;

    // Add the drawer to the body
    document.body.appendChild(drawer);

    // Configure the Public Skins button to open the drawer
    button.setAttribute('data-bs-toggle', 'offcanvas');
    button.setAttribute('data-bs-target', '#publicSkinsDrawer');

    // Ensure Bootstrap initializes the drawer correctly
    //const drawerInstance = new bootstrap.Offcanvas(drawer);
    // Check if the close button and drawer elements exist before proceeding
    const closeButton = document.getElementById("closebtn");

    // Only attach the event listener if both elements exist
    if (closeButton && drawer) {
        closeButton.addEventListener("click", function () {
            const bsDrawer = bootstrap.Offcanvas.getInstance(drawer);
            if (bsDrawer) {
                bsDrawer.hide();
                console.log('Drawer closed.');
            } else {
                console.log('Bootstrap Offcanvas instance not found for the drawer.');
            }
        });
    } else {
        if (!closeButton) {
            console.log('Close button with ID "closebtn" not found.');
        }
        if (!drawer) {
            console.log('Drawer element with ID "publicSkinsDrawer" not found.');
        }
    }

    // Discord OAuth URL
    const DISCORD_OAUTH_URL = "https://discord.com/api/oauth2/authorize?client_id=1266230711690596455&redirect_uri=https://snay.vercel.app/api/discord&response_type=code&scope=identify";

   function updateButtons() {
    const storedUsername = localStorage.getItem("discordUsername");
    const storedToken = localStorage.getItem("discordToken");
    const username = new URLSearchParams(window.location.search).get("username") || storedUsername;
    const token = new URLSearchParams(window.location.search).get("token") || storedToken;

    const loginButton = document.getElementById("discord-login-btn");
    const logoutButton = document.getElementById("discord-logout-btn");
    const profileImage = document.getElementById("profileDropdown"); // Profile image element
    const userprofile = document.getElementById("userPPP");

    if (username && token) {
        loginButton.innerText = `Logged in as ${username}`;
        loginButton.disabled = true;
        userprofile.innerText = `${username}`;
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        userprofile.style.display = "block";

        if (!storedUsername || !storedToken) {
            // Store username and token if not already stored
            localStorage.setItem("discordUsername", username);
            localStorage.setItem("discordToken", token);
        }

        // Fetch Discord user information
        fetch('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user info: ${response.status}`);
                }
                return response.json();
            })
            .then(userData => {
                console.log("Fetched Discord user data:", userData);

                // Update profile picture
                const avatarURL = userData.avatar
                    ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`; // Default avatar
                profileImage.src = avatarURL;
            })
            .catch(error => {
                console.error("Error fetching Discord user info:", error);
                profileImage.src = "https://i.imgur.com/V4RclNb.png"; // Fallback profile image
            });

        // Remove query parameters from URL
        if (new URLSearchParams(window.location.search).has("username")) {
            history.replaceState(null, null, window.location.pathname);
        }
    } else {
        loginButton.style.display = "block";
        loginButton.innerText = "Login with Discord";
        loginButton.disabled = false;
        logoutButton.style.display = "none";
        userprofile.style.display = "none";

        // Reset to default profile picture
        if (profileImage) {
            profileImage.src = "https://i.imgur.com/V4RclNb.png";
        }
    }
}


    // Create Login Button Behavior
    function createLoginButton() {
        const loginButton = document.getElementById("discord-login-btn");
        loginButton.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = DISCORD_OAUTH_URL;
        });
    }

    // Create Logout Button Behavior
    function createLogoutButton() {
        const logoutButton = document.getElementById("discord-logout-btn");
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("discordUsername");
            localStorage.removeItem("discordToken");
            updateButtons();
        });
    }

    // Initialize Buttons
    if (document.readyState === "complete" || document.readyState === "interactive") {
        createLoginButton();
        createLogoutButton();
        updateButtons();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            createLoginButton();
            createLogoutButton();
            updateButtons();
        });
    }


        button.setAttribute('data-bs-toggle', 'offcanvas');
        button.setAttribute('data-bs-target', '#publicSkinsDrawer');

        const skinsContainer = document.getElementById('skinsContainer');
        const customInputField = document.getElementById('customInputField');

        // Tooltip Initialization
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        setupTabSwitching();

                // Refresh Skins Functionality
        document.getElementById('refreshSkins').addEventListener('click', async () => {
            window.showNotification("error", "Error", "Something went wrong.", 3000);

            skinsContainer.innerHTML = `
                <div class="dot-spinner">
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
                </div>`;
            try {
                const images = await fetchImages();
                renderImagesLazy(images, skinsContainer);
                console.log("Skins refreshed successfully!");

            } catch (error) {
                console.log("Failed to refresh skins.");
            }
        });

        try {
            const images = await fetchImages();
            renderImagesLazy(images, skinsContainer);

            // Add search functionality
            customInputField.addEventListener('input', () => {
                const searchTerm = customInputField.value.toLowerCase();
                const filteredImages = images.filter(image => image.name.toLowerCase().includes(searchTerm));
                renderImagesLazy(filteredImages, skinsContainer);
            });
        } catch (error) {
            skinsContainer.innerHTML = '<p style="color: white;">Failed to load skins. Please try again later.</p>';
        }

    }

    main();
})();