// ==UserScript==
// @name        Kleinanzeigen.de Grid Viewer
// @namespace   Violentmonkey Scripts
// @match       https://www.kleinanzeigen.de/*
// @grant       none
// @version     1.1
// @author      -
// @description 04/08/2023, 21:46:24
// @run-at      Document-Start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473049/Kleinanzeigende%20Grid%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/473049/Kleinanzeigende%20Grid%20Viewer.meta.js
// ==/UserScript==

var modalStyle = document.createElement('style');
modalStyle.innerHTML = `
  /* Styles for the modal overlay */
  .modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%; /* Make the overlay width 100% of the viewport */
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Adjust the z-index to ensure the overlay is on top */
  }

  /* Styles for the modal content */
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    width: 90%; /* Set the width of the content within the overlay */
    max-width: 1200px; /* Optionally, set a maximum width for the content */
    max-height: 90%;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    align-items: end;
  }
`;
document.head.appendChild(modalStyle);

// Define a function to extract the product information from a listing element
function getProductInfo(listing) {
  var imageBox = listing.querySelector(".imagebox.srpimagebox"); // Updated selector
  var image = imageBox.querySelector("img"); // Select the img element inside the imagebox
  var imageSrc = image ? image.getAttribute("src") : "";
  // Get the link element
  var link = listing.querySelector(".ellipsis");
  // Get the link href
  var linkHref = link ? link.href : "";
  // Get the link text
  var linkText = link ? link.textContent : "";
  // Get the price element
  var priceElement = listing.querySelector(".aditem-main--middle--price-shipping--price");
  // Get the price text
  var priceText = priceElement ? priceElement.textContent : "";
  // Return an object with the product information
  return {
    image: imageSrc,
    url: linkHref,
    title: linkText,
    price: priceText
  };
}

// Define a function to loop through all the listings on the page and add them to the products array
function getProducts() {
  // Create a local products array
  var products = [];
  // Get all the listing elements
  var listings = document.querySelectorAll(".ad-listitem .aditem");
  // Loop through each listing element
  for (var i = 0; i < listings.length; i++) {
    // Get the current listing element
    var listing = listings[i];
    // Get the product information from the listing element
    var productInfo = getProductInfo(listing);
    // Add the product information to the products array
    products.push(productInfo);
  }
  // Return the products array
  return products;
}

// Define a function to create the modal overlay
function createModalOverlay() {
  var modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  var modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  var closeButton = document.createElement('button');
  closeButton.innerHTML = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.right = '10px';
  closeButton.style.top = '10px';
  closeButton.onclick = function () {
    modalOverlay.style.display = 'none';
  };

  modalContent.appendChild(closeButton);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  return modalOverlay;
}

// Define a function to add products to the modal content
function addProductsToModal(products, modalContent) {
  for (var i = 0; i < products.length; i++) {
    var product = products[i];

    var productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <a href="${product.url}" target="_blank">
        <img src="${product.image}" alt="Product Image"><br/>
        ${product.title}<br/>
        <span>${product.price}</span>
      </a>
    `;

    modalContent.appendChild(productCard);
  }
}

var isFetching = false;
var currentPageURL = window.location.href;

function loadNextPageProducts() {
  // If a fetch is already in progress, return early
  if (isFetching) {
    return;
  }

  isFetching = true;

  var currentPage = currentPageURL.includes('seite:') ? parseInt(currentPageURL.split('seite:')[1]) : 1;
  var nextPage = currentPage + 1;
  var nextPageURL;

  if (currentPageURL.includes('seite:')) {
    nextPageURL = currentPageURL.replace(/(seite:)\d+/, 'seite:' + nextPage);
  } else {
    var urlParts = currentPageURL.split('/');
    urlParts.splice(-1, 0, 'seite:' + nextPage);
    nextPageURL = urlParts.join('/');
  }

  fetch(nextPageURL)
    .then(response => response.text())
    .then(html => {
      var parser = new DOMParser();
      var nextPageDocument = parser.parseFromString(html, 'text/html');
      var nextPageListings = nextPageDocument.querySelectorAll(".ad-listitem .aditem");

      var products = [];
      nextPageListings.forEach(listing => {
        var productInfo = getProductInfo(listing);
        products.push(productInfo);
      });

      var modalContent = document.querySelector('.modal-content');
      addProductsToModal(products, modalContent);
      // When the fetch is complete, set isFetching back to false
      isFetching = false;
      // Update currentPageURL to the URL of the next page
      currentPageURL = nextPageURL;
    }).catch(error => {
      console.error('Error:', error);

      // If an error occurs, set isFetching back to false
      isFetching = false;
    });
}

function showModal() {
  var modalOverlay = document.querySelector('.modal-overlay');
  var modalContent;

  if (!modalOverlay) {
    modalOverlay = createModalOverlay();
  }

  modalContent = modalOverlay.querySelector('.modal-content');

  var products = getProducts();
  addProductsToModal(products, modalContent);

  function loadNextPageIfNearBottom() {
    var buffer = 100; // Number of pixels from the bottom to start loading next page
    if (
      modalContent.scrollTop + modalContent.clientHeight >=
      modalContent.scrollHeight - buffer
    ) {
      loadNextPageProducts();
    }
  }

  // Add a scroll event listener to the modal overlay
  modalContent.addEventListener('scroll', loadNextPageIfNearBottom);

  // Show the modal overlay
  modalOverlay.style.display = 'flex';
}

var targetDiv = document.querySelector('.l-container-row.contentbox-unpadded.no-bg');

if (targetDiv !== null) {
  var triggerButton = document.createElement('button');
  triggerButton.innerHTML = 'Show Grid';
  triggerButton.style.display = 'block';
  triggerButton.style.margin = '0 auto';
  triggerButton.onclick = showModal;
  targetDiv.insertBefore(triggerButton, targetDiv.firstChild);
}