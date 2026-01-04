// ==UserScript==
// @name         Image Gallery Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extracts images over 100 px and displays them in a gallery
// @author       Ovinomaster
// @match        *://*/*
// @grant        none
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode|
// @downloadURL https://update.greasyfork.org/scripts/502598/Image%20Gallery%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/502598/Image%20Gallery%20Extractor.meta.js
// ==/UserScript==

(function() {
'use strict';

// Create and style the button
const button = document.createElement('button');
button.textContent = 'Open Gallery';
button.style.position = 'fixed';
button.style.bottom = '20px';
button.style.right = '20px';
button.style.padding = '10px 20px';
button.style.backgroundColor = '#007BFF';
button.style.color = '#fff';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
button.style.fontFamily = 'Red Hat Text, sans-serif';
//button.style.fontSize = '.688rem';
button.style.fontWeight = '500';
button.style.lineHeight = 'normal';
button.addEventListener('mouseover', () => {
button.style.backgroundColor = '#0072FF';
});
button.addEventListener('mouseout', () => {
button.style.backgroundColor = '#007BFF';
});
document.body.appendChild(button);

// Create and style the modal
const modal = document.createElement('div');
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.top = '5%';
modal.style.left = '5%';
modal.style.width = '90%';
modal.style.height = '90%';
modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
modal.style.justifyContent = 'center';
modal.style.alignItems = 'center';
modal.style.zIndex = '1000000';
document.body.appendChild(modal);

// Create and style the close button
const closeButton = document.createElement('span');
closeButton.textContent = '×';
closeButton.style.position = 'absolute';
closeButton.style.top = '20px';
closeButton.style.right = '20px';
closeButton.style.fontSize = '30px';
closeButton.style.color = '#fff';
closeButton.style.cursor = 'pointer';
modal.appendChild(closeButton);

// Create and style the main image container
const mainImageContainer = document.createElement('div');
mainImageContainer.style.maxWidth = '90%';
mainImageContainer.style.maxHeight = '90%';
mainImageContainer.style.height = '80%';
mainImageContainer.style.position = 'relative';
mainImageContainer.style.textAlign = 'center';
modal.appendChild(mainImageContainer);

// Create and style the main image
const mainImage = document.createElement('img');
mainImage.style.maxWidth = '100%';
mainImage.style.maxHeight = '100%';
mainImage.style.height = '80%';
mainImage.style.align = 'center';
mainImage.style.objectFit = 'contain';
mainImageContainer.appendChild(mainImage);

// Create and style the thumbnail container
const thumbnailContainer = document.createElement('div');
thumbnailContainer.style.display = 'flex';
thumbnailContainer.style.overflowX = 'auto';
thumbnailContainer.style.marginTop = '10px';
mainImageContainer.appendChild(thumbnailContainer);

let images = [];
let currentIndex = 0;

// Function to open the modal
function openModal() {
modal.style.display = 'flex';
displayImage(currentIndex);
}

// Function to close the modal
function closeModal() {
modal.style.display = 'none';
}

// Function to display an image
function displayImage(index) {
mainImage.src = images[index].src;
currentIndex = index;
thumbnailContainer.scrollLeft = thumbnailContainer.children[index].offsetLeft - thumbnailContainer.offsetWidth / 2 + thumbnailContainer.children[index].offsetWidth / 2;
}

// Function to handle key presses
function handleKeyPress(event) {
if (event.key === 'Escape') {
closeModal();
} else if (event.key === 'ArrowRight') {
currentIndex = (currentIndex + 1) % images.length;
displayImage(currentIndex);
} else if (event.key === 'ArrowLeft') {
currentIndex = (currentIndex - 1 + images.length) % images.length;
displayImage(currentIndex);
}
}

// Function to handle thumbnail clicks
function handleThumbnailClick(event) {
const index = Array.from(thumbnailContainer.children).indexOf(event.target);
displayImage(index);
}

// Function to extract images
function extractImages() {
const allImages = document.querySelectorAll('img');
images = Array.from(allImages).filter(img => img.naturalWidth > 100 && img.naturalHeight > 100);
images.forEach((img, index) => {
const thumbnail = document.createElement('img');
thumbnail.src = img.src;
thumbnail.style.width = '100px';
thumbnail.style.height = '66px';
thumbnail.style.margin = '5px';
thumbnail.style.cursor = 'pointer';
thumbnail.style.objectFit = 'contain';
thumbnail.addEventListener('click', handleThumbnailClick);
thumbnailContainer.appendChild(thumbnail);
});
}

// Event listeners
button.addEventListener('click', () => {
extractImages();
openModal();
});

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
if (event.target === modal) {
closeModal();
}
});
 
document.addEventListener('keydown', handleKeyPress);
mainImage.addEventListener('click', () => {
currentIndex = (currentIndex + 1) % images.length;
displayImage(currentIndex);
});

// Touch event listeners for swiping
let touchStartX = 0;
let touchEndX = 0;

mainImage.addEventListener('touchstart', (event) => {
touchStartX = event.changedTouches[0].screenX;
});

mainImage.addEventListener('touchend', (event) => {
touchEndX = event.changedTouches[0].screenX;
handleSwipe();
});

function handleSwipe() {
if (touchEndX < touchStartX) {
currentIndex = (currentIndex + 1) % images.length;
} else if (touchEndX > touchStartX) {
currentIndex = (currentIndex - 1 + images.length) % images.length;
}
displayImage(currentIndex);
}
})();