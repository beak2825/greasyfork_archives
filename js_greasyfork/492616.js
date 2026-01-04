// ==UserScript==
// @name         FWAGS Search Query Generator
// @description  Checks for Product Stock Status at selected locations
// @version      0.5
// @author       BovBrew
// @license      MIT
// @namespace    BovBrew
// @icon         https://www.finewineandgoodspirits.com/file/v3990053292507217215/general/&-favicon-16x16.png
// @match        https://www.finewineandgoodspirits.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492616/FWAGS%20Search%20Query%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/492616/FWAGS%20Search%20Query%20Generator.meta.js
// ==/UserScript==

const preAddedProducts = ['6015','31380','6017','6946'];
const preAddedLocations = ['3627','3625','3622'];

// Create a dropdown button
var dropdownButton = document.createElement("button");
dropdownButton.textContent = "Search Menu";
dropdownButton.classList.add("dropdown-button");
dropdownButton.style.backgroundColor = "black";
dropdownButton.style.color = 'white'
dropdownButton.style.zIndex = "999";

// Create a dropdown content container
var dropdownContent = document.createElement("div");
dropdownContent.classList.add("dropdown-content");
dropdownContent.setAttribute("id", "dropdownMenu");
dropdownContent.style.display = "none";

// Create a square box to display Menu
var menuBox = document.createElement("div");
menuBox.classList.add("menu-box");
menuBox.style.display = "none";

// Style the display Menu
menuBox.style.width = "auto";
menuBox.style.height = "auto";
menuBox.style.backgroundColor = "orange";
menuBox.style.position = "fixed";
menuBox.style.top = "30px";
menuBox.style.left = "0px";
menuBox.style.zIndex = "999";


var productListHeader = document.createElement("div");
productListHeader.textContent = "Product Ids";
productListHeader.style.color = "black";

var productInputField = document.createElement("input");
productInputField.setAttribute("type", "text");
productInputField.setAttribute("id", "productId-input");

// ADD PRODUCT IDS
// Create an "Add" button
var productAddButton = document.createElement("button");
productAddButton.textContent = "Add";
productAddButton.setAttribute("id", "product-add-button");

// Create a list to hold the items
var productList = document.createElement("ul");
productList.setAttribute("id", "product-list");

if (preAddedProducts.length > 0) {
    preAddedProducts.forEach(function(itemText) {
        var listItem = document.createElement("li");
        listItem.textContent = itemText;
    
        var deleteButton = document.createElement("span");
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-button");
    
        // Add click event to delete button
        deleteButton.addEventListener("click", function() {
            listItem.remove();
        });
    
        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });
}
// Function to add an item to the list
function productAddItem() {
    var inputValue = productInputField.value.trim();
    if (inputValue === "") return;

    var productListItem = document.createElement("li");
    productListItem.textContent = inputValue;

    var deleteButton = document.createElement("span");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-button");

    // Add click event to delete button
    deleteButton.addEventListener("click", function() {
        productListItem.remove();
    });

    productListItem.appendChild(deleteButton);
    productList.appendChild(productListItem);

    // Clear input field
    productInputField.value = "";
}

// Add event listener to the "Add" button
productAddButton.addEventListener("click", productAddItem);

// Add event listener to the input field for "Enter" key
productInputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        productAddItem();
    }
});


// ADD Store Locations
var locationListHeader = document.createElement("div");
locationListHeader.textContent = "Location Ids";
locationListHeader.style.color = "black";

var locationInputField = document.createElement("input");
locationInputField.setAttribute("type", "text");
locationInputField.setAttribute("id", "location-input");

// Create an "Add" button
var locationAddButton = document.createElement("button");
locationAddButton.textContent = "Add";
locationAddButton.setAttribute("id", "location-add-button");

// Create a list to hold the items
var locationList = document.createElement("ul");
locationList.setAttribute("id", "location-list");

// Pre-add items to the list
if (preAddedLocations.length > 0) {
    preAddedLocations.forEach(function(itemText) {
        var listItem = document.createElement("li");
        listItem.textContent = itemText;
    
        var deleteButton = document.createElement("span");
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-button");
    
        // Add click event to delete button
        deleteButton.addEventListener("click", function() {
            listItem.remove();
        });
    
        listItem.appendChild(deleteButton);
        locationList.appendChild(listItem);
    });
}

// Function to add an item to the list
function addItem() {
    var inputValue = locationInputField.value.trim();
    if (inputValue === "") return;

    var locationlistItem = document.createElement("li");
    locationlistItem.textContent = inputValue;

    var deleteButton = document.createElement("span");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-button");

    // Add click event to delete button
    deleteButton.addEventListener("click", function() {
        locationlistItem.remove();
    });

    locationlistItem.appendChild(deleteButton);
    locationList.appendChild(locationlistItem);

    // Clear input field
    locationInputField.value = "";
}

// Add event listener to the "Add" button
locationAddButton.addEventListener("click", addItem);

// Add event listener to the input field for "Enter" key
locationInputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addItem();
    }
});

var searchButton = document.createElement("button");
searchButton.id = 'advancedSearchButton';
searchButton.textContent = "Search";
searchButton.style.backgroundColor = "black";
searchButton.style.color = 'white'
// Toggle dropdown menu visibility when button is clicked
searchButton.addEventListener("click", function() {
    console.log('Search Button Clicked!');
    let productIDs = getListItemsText('product-list');
    console.log('productIDs:', productIDs);
    let locationIDs = getListItemsText('location-list');
    console.log('locationIDs:', locationIDs);
    if (productIDs.length <= 0) {
        alert('Must enter at least 1 Product ID to search');
        return;
    };
    if (locationIDs.length <= 0) {
        alert('Must enter at least 1 Location ID to search');
        return;
    };
    submitSearchRequest(productIDs,locationIDs);
});

menuBox.appendChild(productListHeader);
menuBox.appendChild(productInputField);
menuBox.appendChild(productAddButton);
menuBox.appendChild(productList);
menuBox.appendChild(locationListHeader);
menuBox.appendChild(locationInputField);
menuBox.appendChild(locationAddButton);
menuBox.appendChild(locationList);
menuBox.appendChild(searchButton);



// Append dropdown button and content to the body
var firstElement = document.body.firstChild;
document.body.insertBefore(dropdownButton, firstElement);
document.body.appendChild(dropdownContent);

// Append link box to the dropdown content
dropdownContent.appendChild(menuBox);

// Toggle dropdown menu visibility when button is clicked
dropdownButton.addEventListener("click", function() {
    var menu = document.getElementById("dropdownMenu");
    var box = document.querySelector(".menu-box");
    if (menu.style.display === "block") {
        menu.style.display = "none";
        box.style.display = "none";
    } else {
        menu.style.display = "block";
        box.style.display = "block";
    }
});

var styleElement = document.createElement("style");
styleElement.textContent = `
    /* Style the list items */
    ul#product-list li {
        display: flex;
        justify-content: space-between;
    }
    ul#location-list li {
        display: flex;
        justify-content: space-between;
    }

    /* Style the delete button */
    .delete-button {
        margin-right: 10px;
    }
`;

document.head.appendChild(styleElement);


function getListItemsText(listName) {
    var listItems = document.querySelectorAll(`#${listName} li`);
    var texts = [];
    listItems.forEach(function(item) {
        // Exclude the last character (which is the delete button text "x")
        var textWithoutDeleteButton = item.textContent.slice(0, -1);
        texts.push(textWithoutDeleteButton);
    });
    return texts;
}

function submitSearchRequest(productIDs,locationIDs){
    let productsString = 'repositoryid'
    // repositoryid%2C000006015%3A000006015%2C000031380%3A000031380%2C000006017%3A000006017%2C000006946%3A000006946
    // 3627%2C3625%2C3622
    for (i = 0; i < productIDs.length; i++) {
        let productID = productIDs[i].padStart(9, "0")
        productsString += `,${productID}:${productID}`
    }
    productsString = encodeURIComponent(productsString)
    let locationsString = locationIDs.join(",");
    locationsString = encodeURIComponent(locationsString)
    console.log(productsString)
    console.log(locationsString)
    const searchURL = `https://www.finewineandgoodspirits.com/ccstore/v1/stockStatus?actualStockStatus=true&expandStockDetails=true&products=${productsString}&locationIds=${locationsString}`
    console.log(searchURL);
    fetch(searchURL)
        .then(response => response.text())
        .then(data => {
            // console.log("Response:", data); // Log the response
            // Process the response data here if needed
            processSearchResults(JSON.parse(data));
        })
        .catch(error => {
            console.log(`Error: ${error}`);
        });
}

function processSearchResults (data){
    let items = data.items;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (Object.keys(item).length > 0) {
            if ('productId' in item && 'locationId' in item) {
                console.log(`Item Start ---------------------------------`);
                let id                    = item.productId,
                    catalogId             = item.catalogId,
                    catRefId              = item.catRefId,
                    location              = item.locationId,
                    stockStatus           = item.stockStatus;
                console.log(`Product ID:             ${id}`);
                console.log(`Catalog ID:             ${catalogId}`);
                console.log(`Catalog Ref ID:         ${catRefId}`);
                console.log(`Location:               ${location}`);
                console.log(`Stock Status:           ${stockStatus}`);
                if (stockStatus === "IN_STOCK") {
                    let preOrderableQuantity  = item.preOrderableQuantity,
                        orderableQuantity     = item.orderableQuantity,
                        availabilityDate      = item.availabilityDate,
                        backOrderableQuantity = item.backOrderableQuantity,
                        inStockQuantity       = item.inStockQuantity;
                    console.log(`Pre Orderable Quantity: ${preOrderableQuantity}`);
                    console.log(`Orderable Quantity:     ${orderableQuantity}`);
                    console.log(`Availability Date:      ${availabilityDate}`);
                    console.log(`Backorderable Quantity: ${backOrderableQuantity}`);
                    console.log(`In-Stock Quantity:      ${inStockQuantity}`);
                }
                console.log(`--------------------------------------------`);
            }
        }
    }
}