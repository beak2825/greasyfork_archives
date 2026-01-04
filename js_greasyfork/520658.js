// ==UserScript==
// @name        4chan post image grid
// @namespace   Violentmonkey Scripts
// @match       https://boards.4chan.org/*
// @grant       none
// @version     1.0
// @author      Anon
// @description 13/12/2024, 21:55:28
// @downloadURL https://update.greasyfork.org/scripts/520658/4chan%20post%20image%20grid.user.js
// @updateURL https://update.greasyfork.org/scripts/520658/4chan%20post%20image%20grid.meta.js
// ==/UserScript==


let imageGrid = null;
let imageGridContent = null;
let imageModal = null;
let modalImage = null;
const thread = document.querySelector('.thread');
if (!thread) return;


// Image modal
const openImageModal = (thumb) => {
  if (!modalImage) {
    imageModal = document.createElement('div');
    imageModal.classList = 'image-grid__modal';
    document.body.appendChild(imageModal);

    modalImage = document.createElement('img');
    imageModal.appendChild(modalImage);

    imageModal.addEventListener('click', () => imageModal.classList.remove('open'));
  }

  modalImage.src = thumb.href;
  imageModal.classList.add('open');
};


// Image grid
const populateImageGrid = () => {
  imageGridContent.innerHTML = '';

  const thumbs = [...thread.querySelectorAll('.fileThumb')].map(thumb => {
    return thumb.cloneNode(true);
  });

  thumbs.forEach(thumb => {
    imageGridContent.appendChild(thumb);
    thumb.addEventListener('click', (event) => {
      event.preventDefault();
      openImageModal(thumb)
    });
  });
};

const buildImageGrid = () => {
  imageGrid = document.createElement('div');
  imageGrid.classList = 'image-grid open';
  document.body.appendChild(imageGrid);
  imageGrid.addEventListener('click', event => {
    if (event.target.closest('.image-grid__content')) return;
    imageGrid.classList.remove('open');
  })

  imageGridContent = document.createElement('div');
  imageGridContent.classList = 'image-grid__content';
  imageGrid.appendChild(imageGridContent);
  populateImageGrid();
}


// Image grid button
const gridButton = document.createElement('button');
gridButton.textContent = 'Image Grid';
gridButton.id = 'image-grid-button';
document.body.appendChild(gridButton);

gridButton.addEventListener('click', (event) => {
  if (!imageGrid) {
    buildImageGrid();
  } else {
    imageGrid.classList.add('open');
    populateImageGrid();
  }
});


// Styles
const style = document.createElement('style');
style.innerHTML = `
  .thread {
    flex-direction: column;
  }

  .thread .opContainer {
    order: 1;
  }

  #image-grid-button {
    position: fixed;
    top: 4.5rem;
    right: 2rem;
    opacity: 0.5;
    padding: 0.4rem 0.6rem;
    background: white !important;
    border: none !important;
    border-radius: 0.2rem;
    transition: all ease 150ms;
    cursor: pointer;
    color: inherit;
  }

  #image-grid-button:hover {
    opacity: 1;
  }

  .image-grid {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0,0,0,0.8);
    display: none;
  }

  .image-grid.open {
    display: flex;
  }

  .image-grid__content {
    height: auto;
    width: auto;
    overflow: auto;
    background: rgba(255,255,255,0.1);
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .image-grid__modal {
    position: fixed;
    z-index: 101;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
  }

  .image-grid__modal.open {
    display: block;
  }

  .image-grid__modal img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

document.head.appendChild(style);