// ==UserScript==
// @name         Old Reddit show image in comments
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  This script displays images in the comments of old Reddit. It also allows you to expand the image by clicking on it and set image size through a custom GUI!
// @author       minnie
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491898/Old%20Reddit%20show%20image%20in%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/491898/Old%20Reddit%20show%20image%20in%20comments.meta.js
// ==/UserScript==

(function() {
    // Default pixel size and storage key
    const STORAGE_KEY = 'imagePixelSize';
    let pixelSize = localStorage.getItem(STORAGE_KEY) || '300'; // Default to 300 if no value in localStorage

    function replaceLinks() {
        // Select all <a> tags that are children of <p> elements
        const links = document.querySelectorAll('p > a');
        links.forEach(link => {
            // Check if the link's inner HTML matches '&lt;image&gt;'
            if (link.innerHTML === '&lt;image&gt;') {
                // Create a new <img> element
                const img = document.createElement('img');
                // Set the src attribute of the <img> to the href of the <a>
                img.src = link.href;
                // Apply any styles from the <a> to the <img>
                img.style = link.style.cssText;
                img.style.height = `${pixelSize}px`; // Set height to user-defined pixel size
                img.style.width = 'auto'; // Set width to auto

                // Replace the <a> with the <img> in the DOM
                link.parentNode.replaceChild(img, link);

                // Add click event listener to expand the image
                img.addEventListener('click', () => {
                    expandImage(img);
                });
            }
        });
    }

    function observeDynamicContent() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Check if there are added nodes and if any is an element node
                if (mutation.addedNodes.length && Array.from(mutation.addedNodes).some(node => node.nodeType === 1)) {
                    replaceLinks();
                }
            });
        });

        // Start observing the document body for added nodes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function expandImage(image) {
        // Create a new div element for the overlay
        const overlay = document.createElement('div');
        const expandedImage = document.createElement('img');

        expandedImage.src = image.src;
        overlay.id = 'expandedImage';

        // Apply CSS styles to the overlay
        overlay.classList.add("expandedImage");
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        // Apply CSS to the expanded image
        expandedImage.style.width = 'auto'; // Maintain aspect ratio
        expandedImage.style.height = '90%'; // Maintain aspect ratio
        expandedImage.style.borderRadius = '3px';

        // Append the expanded image to the overlay
        overlay.appendChild(expandedImage);

        // Add custom CSS
        const expandedImageCSS = document.createElement('style');
        const css = `
            div#expandedImage {
                background-color: rgba(0, 0, 0, 0.7) !important;
                backdrop-filter: blur(4px) grayscale(50%);
            }
        `;
        expandedImageCSS.textContent = css;
        document.head.appendChild(expandedImageCSS);

        // Append the overlay to the body
        document.body.appendChild(overlay);

        // Add click event listener to remove the overlay
        overlay.addEventListener('click', () => {
            overlay.remove();
        });
    }

    function createSettingsGUI() {
        // Create and style the overlay
        const overlay = document.createElement('div');
        overlay.id = 'settingsOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backdropFilter = 'blur(3px)';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1001';

        // Create and style the settings box
        const settingsBox = document.createElement('div');
        settingsBox.style.cssText = `
          font-size: 1.3rem;
          background-color: white;
          padding: 20px 30px;
          border-radius: 5px;
          text-align: center;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        `;
        settingsBox.innerHTML = `
            <h3 style="margin-bottom: 10px;">Image Settings</h3>
            <p style="opacity: 70%">Change the size of the images. <span style="color: red; font-weight: bold;">THIS WILL RELOAD THE TAB!</span></p>
            <label for="pixel-size">Pixel Size:</label>
            <input style="font-size: 1.3rem;" type="number" id="pixel-size" value="${pixelSize}" style="width: 100px;"/>
            <button id="apply-settings" style="margin-top: 10px;">Apply</button>
        `;

        overlay.appendChild(settingsBox);
        document.body.appendChild(overlay);

        // Apply settings
        document.getElementById('apply-settings').addEventListener('click', () => {
            pixelSize = document.getElementById('pixel-size').value;
            localStorage.setItem(STORAGE_KEY, pixelSize);
            document.body.removeChild(overlay);
            window.location.reload();
            replaceLinks(); // Apply the new pixel size to all images
        });
    }

    function initialize() {
        // Add button to open settings
        window.addEventListener('load', () => {
            const openBtn = document.createElement("button");
            openBtn.innerText = "Image Settings";
            openBtn.style.border = '1px white solid';
            openBtn.onclick = () => {
                createSettingsGUI();
            };

            const targetElement = document.querySelector("div.panestack-title span.title");
            if (targetElement) {
                targetElement.appendChild(openBtn);
            } else {
                console.error('Target element not found');
            }
        });

        replaceLinks();
        observeDynamicContent();
    }

    initialize();
})();
