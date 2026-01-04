// ==UserScript==
// @name         Pez.at utilities
// @namespace    http://tampermonkey.net/
// @version      2024-01-11
// @description  Pez.at sort items and remove out-of-stock
// @author       Martin Bernth Pedersen
// @match        https://shop.pez.at/en/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pez.at
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484697/Pezat%20utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/484697/Pezat%20utilities.meta.js
// ==/UserScript==

// Create a div for the controls
var controlswrapper = document.createElement("div");
controlswrapper.id = "controlswrapper";


// Create a div for the controls
var oosControls = document.createElement("div");
oosControls.id = "oosControls";

// Create a checkbox for showing out-of-stock items
var showOutOfStock = document.createElement("input");
showOutOfStock.type = "checkbox";
showOutOfStock.id = "showOutOfStock";
showOutOfStock.style.position = "relative"
showOutOfStock.style.left = 0;
showOutOfStock.style.marginLeft = "10px";

// Create a label for the checkbox
var label = document.createElement("label");
label.for = "showOutOfStock";
label.textContent = "Show out-of-stock items";
oosControls.appendChild(label);

// Add the checkbox to the sortControls div
oosControls.appendChild(showOutOfStock);

showOutOfStock.addEventListener("change", function() {
  var productElements = document.querySelectorAll("#products_list>div>.RedxGridColumn");

  for(var i = 0; i < productElements.length; i++){
    var stockElement = productElements[i].querySelector(".inStockIndicator.red");

    if(stockElement) {
      if(showOutOfStock.checked) {
        productElements[i].classList.remove("fade");
        productElements[i].classList.add("show");
        productElements[i].style.display = "";
     } else {
        productElements[i].classList.remove("show");
        productElements[i].classList.add("fade");
        setTimeout(function() {
          productElements[i].style.display = "none";
        }, 2000); // Match this with the duration of your transition
      }
    }
  }
});

// By default, out-of-stock items will be shown
showOutOfStock.checked = true;

// Create a div for the sorting controls
var sortControls = document.createElement("div");
sortControls.id = "sortControls";

// Create a label for the dropdown
label = document.createElement("label");
label.for = "sortPrice";
label.textContent = "Sort by price: ";
sortControls.appendChild(label);

// Create a dropdown for sorting by price
var sortPrice = document.createElement("select");
sortPrice.id = "sortPrice";

var option1 = document.createElement("option");
option1.value = "true";
option1.text = "Low to High";
sortPrice.appendChild(option1);

var option2 = document.createElement("option");
option2.value = "false";
option2.text = "High to Low";
sortPrice.appendChild(option2);


// Add the dropdown to the sortControls div
sortControls.appendChild(sortPrice);

sortControls.style.float = "right";
sortControls.style.padding = "10px 10px 10px 10px";
oosControls.style.float = "right";
oosControls.style.padding = "10px 10px 10px 10px";

controlswrapper.appendChild(sortControls);
controlswrapper.appendChild(oosControls);

var cls = document.createElement("div");
cls.style.clear = "both";
controlswrapper.appendChild(cls);

function sortProducts(sortAscending = true) {
  var productElements = document.querySelectorAll("#products_list>div>*");
  var productData = [];

  for(var i = 0; i < productElements.length; i++){
    var priceElement = productElements[i].querySelector(".current-price .price");

    if(priceElement) {
      var price = priceElement.getAttribute("data-price");
      if(price) {
        productData.push({
          price: parseFloat(price), // Convert the price to a number
          element: productElements[i]
        });
      }
    }
  }

  // Sort the productData array in ascending or descending order of price
  productData.sort(function(a, b) {
    return sortAscending ? a.price - b.price : b.price - a.price;
  });

  // Reorder the elements in the DOM
  for(let i = 0; i < productData.length; i++) {
    productData[i].element.parentNode.appendChild(productData[i].element);
  }
}

window.addEventListener("load", function() {
    // Prepend the sortControls div to #product_list
    var product_list = document.querySelector("#products_list");
    product_list.insertBefore(controlswrapper, product_list.firstChild);

    // Add an event listener for the change event
  sortPrice.addEventListener("change", function() {
    // Call the sortProducts function with the selected option
    sortProducts(sortPrice.value === "true");
  });

  // Sort the products in ascending order by default
  sortProducts();

});
var style = document.createElement('style');
style.innerHTML = `
  #products_list {
    transition: all 0.5s ease;
  }
  .fade {
    opacity: 0;
    visibility: hidden;
    transition: visibility 0s, opacity 2s linear;
  }
  .fade.show {
    opacity: 1;
    transition: visibility 0s, opacity 2s linear;
    visibility: visible;
  }
`;
document.head.appendChild(style);