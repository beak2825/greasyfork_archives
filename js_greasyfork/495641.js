// ==UserScript==
// @name        kiwifarms gallery
// @namespace   Violentmonkey Scripts
// @match       https://kiwifarms.st/threads/*
// @grant       none
// @version     1.1
// @author      -
// @description 5/20/2024, 7:04:08 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/495641/kiwifarms%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/495641/kiwifarms%20gallery.meta.js
// ==/UserScript==

// this script sucks balls, sorry

document.body.onload = addElement;

// =======================
// GALLERY BUTTON
// =======================
const modal = document.createElement('div');
modal.className = 'k-galleryModal';
const modalContent = document.createElement('div');
modalContent.className = 'k-modalContent';
const openGallery = document.createElement('button');
openGallery.className = 'k-galleryButton';
const closeModal = document.createElement('button');
closeModal.className = 'k-closeGalleryButton';

function addElement() {
  openGallery.textContent = 'Open Gallery';
  openGallery.style.cssText = `
    background-color: #161616;
    color: white;
    border: rgba(255,255,255,0.5) 1px solid;
    border-radius: 3px;
    z-index: 99999;
    position: fixed;
    bottom: 10px;
    right: 10px;
    -webkit-box-shadow: 0px 0px 27px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 27px 0px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 27px 0px rgba(0,0,0,0.75);
  `;

  document.body.appendChild(openGallery);

  // show modal
  openGallery.onclick = () => {
    openModal();
  };
}

// =======================
// MODAL FUNCTIONALITY
// =======================
function openModal() {
  // create the modal
  modal.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100000;
  `;

  modalContent.style.cssText = `
    position: relative;
    width: 80%;
    height: 80%;
    background-color: #161616;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 3px;
    overflow-y: auto;
    padding: 20px;
    -webkit-box-shadow: 0px 0px 92px 50px rgba(0,0,0,0.55);
    -moz-box-shadow: 0px 0px 92px 50px rgba(0,0,0,0.55);
    box-shadow: 0px 0px 92px 50px rgba(0,0,0,0.55);
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    max-width: 100%;
    max-height: 100%;
    justify-content: center;
    align-items: center;
    justify-items: center;
  `;

  // create the close button inside modalContent
  closeModal.textContent = 'Close Gallery';
  closeModal.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #161616;
    color: white;
    border: rgba(255,255,255,0.5) 1px solid;
    border-radius: 3px;
    z-index: 1000000;
  `;

  closeModal.onclick = () => {
    closeModalFunc();
  };

  modalContent.appendChild(closeModal);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // =======================
  // GET IMAGES
  // =======================
  const imgElements = [];
  const imgSrcSet = new Set(); // Keep track of unique image sources
  let messageBody = document.querySelectorAll('article.message-body');
  messageBody.forEach(message => {
    if (message) {
      let messageImgElements = message.querySelectorAll('img');
      messageImgElements.forEach(imgElement => {
        if (imgElement.classList.contains('bbImage')) {
          const imgSrc = imgElement.src;
          if (!imgSrcSet.has(imgSrc)) {
            imgSrcSet.add(imgSrc); // Add image source to the set
            imgElements.push({ imgElement, message });
          }
        }
      });
    }
  });

  // Populate the gallery with the collected img elements
  populateGallery(imgElements);
}

// =======================
// POPULATE GALLERY - fill modal with detected images
// =======================
function populateGallery(imgElements) {
  imgElements.forEach(({ imgElement, message }) => {
    // Create a new image element for high-resolution images
    const highResImgElement = document.createElement('img');
    highResImgElement.src = imgElement.src.replace('/thumb/', '/full/');

    // Set styles for the high-res image
    highResImgElement.style.cssText = `
      width: 100%;
      height: auto;
    `;

    // Append the high-res image to the modalContent
    modalContent.appendChild(highResImgElement);

    highResImgElement.onclick = () => {
      console.log('Image clicked:', highResImgElement.src);
      // Scroll to the original message
      message.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Simulate a click on the original image
      imgElement.click();
      // Close the modal
      closeModalFunc();
    };
  });
}

// =======================
// CLOSE MODAL
// =======================
function closeModalFunc() {
  modal.style.display = 'none';
  modalContent.innerHTML = ''; // Clear the modal content
}

// Close modal when clicking outside the inner modalContent
modal.onclick = (event) => {
  if (event.target === modal) {
    closeModalFunc();
  }
};

// Prevent modal from closing when clicking inside the modalContent
modalContent.onclick = (event) => {
  event.stopPropagation();
};
