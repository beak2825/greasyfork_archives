// ==UserScript==
// @name         CSSBuy Suite
// @namespace    https://www.reddit.com/user/DeliciousLysergic/
// @version      0.66
// @description  Automatically upload QC images from CSSBuy to Imgur
// @author       https://www.reddit.com/user/DeliciousLysergic/
// @match        https://www.cssbuy.com/?go=m&name=orderlist*
// @match        https://www.cssbuy.com/m.php?name=orderlist
// @connect      self
// @connect      imgur.com
// @connect      fashionreps.tools
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js
// @require      https://greasyfork.org/scripts/401399-gm-xhr/code/GM%20XHR.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0/spark-md5.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/379417/CSSBuy%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/379417/CSSBuy%20Suite.meta.js
// ==/UserScript==
'use strict';
/* globals $:false, SparkMD5:false, GM_XHR: false */

let CSSBuySuite = {}

// Stores each order's information
let orderInfo = {}

// Used to store each item's data
var items = {};

// Select random application ID for imgur
const clientIds = ["1ffdbfe5699ecec", "447a420679198a0", "956dd191d8320c9", "efb0b998924ef3c", "6f8eb75873d5f89", "9af4f2c84a12716"];
const clientId = clientIds[Math.floor(Math.random()*clientIds.length)]
// Time it takes for the image URLs to load in the iFrame in milliseconds
const imageLoadingTime = 5000; 

// Stores the MD5 of the user's username (used for fashiontools)
let usernameMD5 = "";

/*
    Imgur uploads are all stored within localStorage, in the form:
    cssbuy_suite_uploads: {
        "version": 1,
        "orders": {
            "528320": {
                "imageHashes": [],
                "imageIds": [],
                "albumHash": "",
                "albumId": ""
            }
        }
    }

    If version is different from what is currently expected, the object should be updated to the new format
*/
// Setup easy functions for writing/reading from local storage
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
// Check whether local storage is currently initialised
if(localStorage.getObject("cssbuy_suite_uploads") == null)
{
    localStorage.setObject("cssbuy_suite_uploads", {
        "version": 1,
        "orders": {}
    })
}

const shipPromptHTML = `<div style="
z-index: 1000000;
position: fixed;
bottom: 0;
width: 60%;
left: 20%;
right: 20%;
height: 45px;
background-color: white;
border: 2px solid #72c02c;
border-bottom: 0;
display: flex;
justify-content: space-around;
font-size: 18px;
align-items: center;
visibility: hidden;
" id="ship-prompt"><div style="
">Items Selected: <span id="ship-prompt-items"></span></div><div>Weight: <span id="ship-prompt-weight"></span>g</div>
<div>Total Price: <span id="ship-prompt-price"></span>¥</div><div style="
background-color: #95a5a5;
color: white;
padding: 8px;
cursor: pointer;
" id="ship-prompt-cost-estimate">Cost Estimate</div><div style="
background-color: #72c02c;
color: white;
padding: 8px;
cursor: pointer;
" id="ship-prompt-submit-to-ship">Submit To Ship</div></div>`;

// Add the prompt to the body
$("body").append(shipPromptHTML);
const shipPrompt = $("#ship-prompt");
const shipPromptItems = $("#ship-prompt-items");
const shipPromptWeight = $("#ship-prompt-weight");
const shipPromptPrice = $("#ship-prompt-price");
const shipPromptCostEstimate = $("#ship-prompt-cost-estimate");
const shipPromptSubmit = $("#ship-prompt-submit-to-ship");

// Setup GM_XHR
$.ajaxSetup({ xhr: function() {return new GM_XHR; } });

// We only need to display the reddit review button on the confirmed page
if(window.location.href.includes("confirmed"))
{
    const tabContainer = $("#submit_form").parent().parent();
    // Create reddit review button
    const redditReviewButton = $("<button>", {
        id: "createRedditReview",
        type: "button",
        class: "btn-u btn-u-xs",
        style: "background-color: red; margin-left: 4px;",
        text: "Create Reddit Review"
    });
    tabContainer.prepend(redditReviewButton);

    // Now go through all the checkboxes and re-enable them
    $("input.products").each(function() { 
        $(this).removeAttr("disabled");
        $(this).parent().removeClass("state-disabled");
    });
    redditReviewButton.on("click", function() {
        // Get all the ticked orders
        let tickedOrderIDs = [];

        $(".products:checked").each(function() {
            // "value" contains the order ID
            tickedOrderIDs.push(parseInt($(this).attr("value")));
        });

        if(!tickedOrderIDs.length)
        {
            alertify.error("Please select some items!");
            return;
        }
        
        let redditReview = "";

        tickedOrderIDs.forEach(orderId => {
            redditReview += `
    **${orderInfo[orderId].name}**

    * ${orderInfo[orderId].price} Yuan - ${orderInfo[orderId].weight}g
    * W2C: ${orderInfo[orderId].url}
    * 10/10: Insert a comment about this item here!
    ${orderInfo[orderId].albumId == "" ? "" : "* QC: https://imgur.com/a/" + orderInfo[orderId].albumId}
    `;
        });

        redditReview += "\n\nReview format made by CSSBuySuite - read more here: " + redditLink;
        
        // Copy to clipboard
        copyToClipboard(redditReview);
        alertify.success("Copied the review to your clipboard!");
    });
}

// Setup combining multiple albums
const multipleOrderUploadHTML = `
<div class="overflow-h" style="padding: 5px 0 5px 8px;">
    <button id="multipleOrderUpload" class="btn-u btn-u-default btn-u-xs" style="background-color: #1bb76e;" type="button">Combine Imgur Albums</button>
    <span style="margin-left: 4px;" id="multipleOrderUploadLabel">Select multiple items to combine their QC pictures into one album.</span>
    <a style="padding: 3px; font-size: 1em; cursor: pointer; display: none;" id="multipleOrderUploadCopy">Copy to Clipboard</a>
</div>
`;

if($("#createRedditReview").length)
{
    $("#createRedditReview").after(multipleOrderUploadHTML);
}
else
{
    $("#submit_form > div").after(multipleOrderUploadHTML);
}
const multipleOrderUpload = $("#multipleOrderUpload");
const multipleOrderUploadLabel = $("#multipleOrderUploadLabel");
const multipleOrderUploadCopy = $("#multipleOrderUploadCopy");
let multipleOrderUploading = false;

multipleOrderUploadCopy.on("click", () => {
    copyToClipboard(multipleOrderUploadCopy.attr("data-album-link"));
    alertify.success("Copied the album to your clipboard!")
});

// Configure alertify
alertify.set('notifier', 'position', 'bottom-left');
// Add styling for alertify
$("head").append(`
<!-- CSS -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css"/>
<!-- Bootstrap theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/bootstrap.min.css"/>
`);

const redditLink = "https://www.reddit.com/r/FashionReps/comments/gx5xdg/";

// Used for setting buttons as disabled
CSSBuySuite.setDisabledButton = function(button, disabled) {
    if (disabled) 
    {
        button.attr("disabled", "disabled");
        button.text("Uploading...");
    }
    else
    {
        button.attr("disabled", null);
        // Ugly fix
        if(button == multipleOrderUpload)
        {
            button.text("Combine Imgur Albums");
        }
        else
        {
            button.text("Upload to Imgur");
        }
    }
}

CSSBuySuite.createAlbumForOrder = function(orderId)
{
    let albumHash = "";
    let albumId = "";

    orderInfo[orderId].infoLabel.text("Creating Imgur album...");

    $.ajax({
        url: "https://api.imgur.com/3/album",
        method: "POST",
        headers: {"Authorization": "Client-ID " + clientId},
        data: {
            description: "Auto uploaded using CSSBuySuite. More info here: " + redditLink,
            privacy: "hidden"
        },
        success: function(response) {
            // Retrieve the delete hash and the ID of the album from the response
            albumHash = response.data.deletehash;
            albumId = response.data.id;
            orderInfo[orderId].albumHash = albumHash;
            orderInfo[orderId].albumId = albumId;
            
            // An album has been created for this, now we can upload the images
            console.log("Album has been created for " + orderId + ". Now uploading images...");
            CSSBuySuite.uploadImagesToAlbum(orderId);
        },
        error: function(response) {
            result = $.parseJSON(result.responseText)
            // Update text
            orderInfo[orderId].infoLabel.text("Failed to create album! Imgur Error: " + result.data.error.message);
            orderInfo[orderId].uploading = false;
            // Display alert
            alertify.error("Failed to create an album for order " + orderId + ". Error: " + result.data.error.message);
            // Re-enable the upload button
            setDisabled(orderInfo[orderId].uploadButton, false)
            console.log("Failed to create album:");
            console.log(result.data.error)
        }
    });
}

CSSBuySuite.uploadMultipleOrders = function() 
{
    if(multipleOrderUploading)
    {
        return;
    }

    let orderIds = [];
    let invalidIds = [];

    // Check whether they've selected multiple orders 
    $(".products:checked").each(function() {
        let orderId = $(this).attr("value");
        if(orderId in orderInfo)
        {
            if(orderInfo[orderId]["albumId"] == "")
            {
                invalidIds.push(orderId);
            }
            else
            {
                orderIds.push(orderId);
            }
        }
    });

    // Check they have no invalid orders
    if(invalidIds.length != 0)
    {
        alertify.error("Please upload orders " + invalidIds.join(", ") + " before trying to combine them.");
        return;
    }
    // Check they've selected some valid orders
    if(orderIds.length == 0 || orderIds.length == 1)
    {
        alertify.error("Please select at least 2 orders to combine into one album!");
        return;
    }
    
    // Create album
    CSSBuySuite.createMultipleOrderAlbum(orderIds);
}

CSSBuySuite.createMultipleOrderAlbum = function(orderIds)
{
    multipleOrderUploadLabel.text("Creating Imgur album...");

    multipleOrderUploading = true;
    
    // Get all the image IDs
    let imageIds = [];

    orderIds.forEach(orderId => {
        imageIds = imageIds.concat(orderInfo[orderId].imageIds);
    });

    $.ajax({
        url: "https://api.imgur.com/3/album",
        method: "POST",
        headers: {"Authorization": "Client-ID " + clientId},
        data: {
            description: "Auto uploaded using CSSBuySuite. More info here: " + redditLink,
            privacy: "hidden",
            // We can submit IDs with the album creation, making this easy!
            ids: imageIds
        },
        success: function(response) {
            // Retrieve the delete hash and the ID of the album from the response
            let albumLink = "https://imgur.com/a/" + response.data.id;
            
            // An album has been created for this, now we can upload the images
            console.log("Album has been created for multi-order.");
            multipleOrderUploadLabel.html(`<strong>Uploaded to</strong> <a href="${albumLink}" target="_blank">${albumLink}</a>`);
            // Show Copy to clipboard
            multipleOrderUploadCopy.attr("data-album-link", albumLink);
            multipleOrderUploadCopy.css("display", "unset");
        },
        error: function(response) {
            result = $.parseJSON(result.responseText)
            // Update text
            multipleOrderUploadLabel.text("Failed to create album! Imgur Error: " + result.data.error.message);
            multipleOrderUploading = false;
            // Display alert
            alertify.error("Failed to create an album. Error: " + result.data.error.message);
            // Re-enable the upload button
            setDisabled(multipleOrderUpload, false)
            console.log("Failed to create album:");
            console.log(result.data.error)
        }
    });
}

CSSBuySuite.uploadImagesToAlbum = function(orderId)
{
    // Stores how many images have been uploaded
    let imageCount = 0;
    // Stores total amount of images we have to upload
    let totalImages = orderInfo[orderId].qcImages.length;

    // Update label
    orderInfo[orderId].infoLabel.text("Uploading images to Imgur... (0/" + totalImages + ")");

    // Create the description for the item (inserted into each image)
    let description = "";
    description = description + (orderInfo[orderId].itemUrl != "" ? "W2C: " + orderInfo[orderId].url + "\n": "");
    description = description + (orderInfo[orderId].weight != "" ? "Weight: " + orderInfo[orderId].weight + " grams\n": "");
    description = description + (orderInfo[orderId].price != "" ? "Price: ¥" + toFixed(orderInfo[orderId].price, 2) + "\n": "");
    description = description + (orderInfo[orderId].sizing != "" ? "Item Info: " + orderInfo[orderId].sizing + "\n": "");

    // Form data for the uploading of each image
    let imageFormData = {
        album: orderInfo[orderId].albumHash,
        description: description
    }

    // For each image ID
    orderInfo[orderId].qcImages.forEach(function(image) {
        // Update the form data with this image's URL
        // While we can't access another user's CSSBuy QC page, the images themselves have no access control
        // That's why we can use the image URLs
        imageFormData.image = image;
        
        // Now we can upload the image
        $.ajax({
            url: "https://api.imgur.com/3/image",
            method: "POST",
            headers: {"Authorization": "Client-ID " + clientId},
            data: imageFormData,
            success: function(result) {
                // Add the image's delete hash to imageHashes
                orderInfo[orderId].imageHashes.push(result.data.deletehash);
                orderInfo[orderId].imageIds.push(result.data.id);
                imageCount += 1;

                // Update the label
                orderInfo[orderId].infoLabel.text("Uploading images to Imgur... (" + imageCount + "/" + totalImages + ")");
                
                // Now check whether we've uploaded everything
                if(imageCount == totalImages)
                {
                    // We have, so call uploadFinished
                    CSSBuySuite.uploadFinished(orderId);
                }
            },
            error: function(result) {
                result = $.parseJSON(result.responseText)
                // Update text
                orderInfo[orderId].infoLabel.text("Failed to create album! Imgur Error: " + result.data.error.message);
                orderInfo[orderId].uploading = false;
                // Display alert
                alertify.error("Failed to create an album for order " + orderId + ". Error: " + result.data.error.message);
                // Re-enable the upload button
                CSSBuySuite.setDisabledButton(orderInfo[orderId].uploadButton, false);
            }
        });
    });
}

CSSBuySuite.uploadFinished = function(orderId)
{
    const albumUrl = "https://imgur.com/a/" + orderInfo[orderId].albumId;

    console.log("All images uploaded for " + orderId + ": " + albumUrl);

    // Save the URL
    try
    {
        window.localStorage.setItem("orderalbum_" + orderId, orderInfo[orderId].albumId);
    }
    catch(error)
    {
        console.log("Failed to save order album into local storage.");
        console.log(error);
    }
    
    orderInfo[orderId].uploading = false;
    CSSBuySuite.setDisabledButton(orderInfo[orderId].uploadButton, false);

    // Update local storage
    let uploadObject = localStorage.getObject("cssbuy_suite_uploads");
    uploadObject["orders"][orderId] = {
        "imageHashes": orderInfo[orderId].imageHashes,
        "imageIds": orderInfo[orderId].imageIds,
        "albumId": orderInfo[orderId].albumId,
        "albumHash": orderInfo[orderId].albumHash
    };
    localStorage.setObject("cssbuy_suite_uploads", uploadObject)

    // Show the new album ID
    CSSBuySuite.updateOrderAlbumDisplay(orderId);

    // Now attempt to upload to Fashiontools
    CSSBuySuite.checkForFashiontoolsUpload(orderId);
}

// This updates a order with the new link for their album
CSSBuySuite.updateOrderAlbumDisplay = function(orderId)
{
    const albumUrl = "https://imgur.com/a/" + orderInfo[orderId].albumId;
    orderInfo[orderId].infoLabel.text("Uploaded to ");
    orderInfo[orderId].infoLink.text(albumUrl);
    orderInfo[orderId].infoLink.attr("href", albumUrl);
    orderInfo[orderId].copyButton.show();
    // orderInfo[orderId].copyButton.attr("onclick", "copyToClipboard('" + albumUrl + "')");
}

CSSBuySuite.clearLink = function(orderId)
{
    orderInfo[orderId].copyButton.hide()
    orderInfo[orderId].infoLink.text("")
}

// This checks whether the URL + sizing is valid and that we have a username to upload with
CSSBuySuite.checkForFashiontoolsUpload = function(orderId)
{
    // Firstly check whether we have a sizing parameter for this order
    if(orderInfo[orderId].sizing == "")
        return;
    
    // Check whether our url is from taobao
    if(orderInfo[orderId].url.indexOf('item.taobao.com') == -1)
        return;
    
    // Check whether we have a username stored, if not, retrieve it then upload
    if(usernameMD5 == "")
    {
        // Go to the cssbuy homepage and get the username
        usernameiFrame = $("<iframe>", {
            style: "display: none;",
            src: "https://www.cssbuy.com/?go=m&"
        });
        usernameiFrame.on("load", () => CSSBuySuite.collectUsername());
        usernameiFrame.insertAfter($("form[name='search-form']"));
        setTimeout(function() {
            CSSBuySuite.uploadToFashiontools(orderId);
        }, 3500);
    }
    else
    {
        // We already have a username, let's upload!
        CSSBuySuite.uploadToFashiontools(orderId);
    }
}

CSSBuySuite.uploadToFashiontools = function(orderId)
{
    console.log("Attemping to upload to fashiontools.");
    // Get the search query parameters
    const urlParams = new URLSearchParams(orderInfo[orderId].url.split("?").pop());
    const itemID = urlParams.get('id');

    $.post('https://fashionreps.tools/qcdb/qcdb.php', {
            'userhash': usernameMD5,
            'imgur': orderInfo[orderId].albumId,
            'w2c': 'https://item.taobao.com/item.htm?id=' + itemID,
            'sizing': orderInfo[orderId].sizing,
            'source': "cssbuyUploader"
    });
}

// iFrame helpers
CSSBuySuite.collectUsername = function()
{
    // Get the username from the homepage
    const username = $("a[href='https://www.cssbuy.com/?go=m&name=edituserinfo']", usernameiFrame.contents()).parent().find("span").text()
    console.log("Found username: " + username);
    usernameMD5 = SparkMD5.hash(username);
    console.log("Username MD5: " + usernameMD5);
}

CSSBuySuite.collectPictures = function(orderId) {
    // Check that we are uploading this order atm
    // onload is called when iFrame is initialised
    if(!(orderId in orderInfo) || !orderInfo[orderId].uploading)
        return;

    // Wait a few seconds to ensure all the images have loaded...
    setTimeout(function() {
        // Check iFrame for all images
        // Add images to a list in form [url, base64]
        let urls = [];
        
        // Retrieve all the images
        orderInfo[orderId].iFrame.contents().find("#photolist").find("img").each(function() {
            let url = $(this).attr("src");
            // Remove the resizing  url parameter
            url = url.replace("/resize,w_1000", "");
            urls.push(url);
        });

        orderInfo[orderId].qcImages = urls

        if(!urls.length)
        {
            orderInfo[orderId].infoLabel.text("Found no QC images!")
        }
        else
        {
            orderInfo[orderId].infoLabel.text("Found " + urls.length + " QC pictures...")

            CSSBuySuite.createAlbumForOrder(orderId);
        }
    }, imageLoadingTime);
};

CSSBuySuite.uploadOrder = function(orderId) {
    // If we are already uploading this order, return
    if(orderInfo[orderId].uploading)
        return;

    // Update label
    CSSBuySuite.clearLink(orderId);
    orderInfo[orderId].infoLabel.text("Getting QC pictures...");
    orderInfo[orderId].uploading = true;

    // Disable button
    orderInfo[orderId].uploading = true;
    CSSBuySuite.setDisabledButton(orderInfo[orderId].uploadButton, true)

    // Update iFrame to get pictures
    orderInfo[orderId].iFrame.attr("src", orderInfo[orderId].qcUrl);
}

// URL = https://item.taobao.com...
// orderContainer =  container to add View other QC button to
CSSBuySuite.checkQCExists = function(itemID, orderContainer)
{
    // Thank you to FR:ES (https://greasyfork.org/en/scripts/387421-fr-es-basetao-extension/code)
    $.getJSON({
        url: "https://fashionreps.tools/qcdb/qcExists.php",
        data: {
            "w2c": 'https://item.taobao.com/item.htm?id=' + itemID,
        },
        method: "GET",
        success: function(data) {
            if(data.exists == "1")
            {
                const compareQC = $("<a>", {
                    class: "btn btn-sm btn-default margin-bottom-5", 
                    text: "View Other QC",
                    style: "background: #1b8bb7; border: 1px solid #1b8bb7; color: white;",
                    href: "https://fashionreps.tools/qcdb/qcview.php?id=" + itemID,
                    target: "_blank"
                });
                compareQC.appendTo(orderContainer);
            }
        }
    })
}

// Add buttons for each of the orders
var buttonSelector = ".oss-photo-view-button > a:contains('QC PIC')";

$(buttonSelector).each(function() {
    const orderId = $(this).parent().attr("data-id");

    // Create the "Upload to Imgur" button
    const qcUrl = $(this).attr("href");
    const uploadButton = $("<a>", {
        class: "btn btn-sm btn-default margin-bottom-5", 
        text: "Upload to Imgur",
        orderId: orderId, 
        style: "background: #1bb76e; border: 1px solid #1bb76e; color: white;"
    });
    uploadButton.appendTo($(this).parent());
    // Add click handler
    uploadButton.on("click", () => CSSBuySuite.uploadOrder(orderId));

    // Get parent TR element to retrieve item name & URL & create progress label
    const parentTableEntry = $(this).parentsUntil("tbody");
    const header = $("td div div:nth-child(2)", parentTableEntry.prev())

    // Create progress label
    const label = $("<span>", {
        text: "", 
        style: "font-weight: bold; margin-left: 40px;"
    });
    label.appendTo(header);

    // Create album link
    const link = $("<a>", {style:"margin-right: 10px;", target: "_blank"});
    link.appendTo(header);

    // Create copy butotn
    const copyButton = $("<a>", {
        text: "Copy to Clipboard", 
        style: "padding: 3px; font-size: 1em; cursor: pointer;",
    })
    copyButton.hide()
    copyButton.appendTo(header)
    copyButton.on("click", () => {
        // Generate the imgur link and copy to clipboard
        copyToClipboard("https://imgur.com/a/" + orderInfo[orderId].albumId);
        alertify.success("Copied the album to your clipboard!")
    });

    // Get item name/URL
    const itemLink = parentTableEntry.find("td:nth-child(2) a");
    const itemURL = itemLink.attr("href");
    const price = parentTableEntry.find("td:nth-child(3) span");
    const weight = parentTableEntry.find("td:nth-child(6) span");
    let sizing = "";

    const innerText = parentTableEntry.find("td:nth-child(2)").find("span:eq(1)").html();
    const splitText = innerText.toString().split("<br>");
    if (splitText.length == 1)
    {
        const colour = splitText[0].split(" : ")[1];
        sizing = "Color Classification:"+colour;
    }
    else if(splitText.length == 2)
    {
        const size = splitText[0].split(" : ")[1];
        const colour = splitText[1].split(" : ")[1];
        sizing = "size:" + size + " Colour:"+colour;
    }
    else
    {
        sizing = "";
    }
        
    // Create iframe
    const iFrame = $("<iframe>", {
        style: "display: none;"
    });
    // Add onload listener
    iFrame.on("load", () => CSSBuySuite.collectPictures(orderId));
    iFrame.insertAfter($("form[name='search-form']"));
    
    // Create new item entry
    orderInfo[orderId] = {
        orderId: orderId,
        name: itemLink.text(),
        url: itemURL,
        price: toFixed(price.text(), 2),
        weight: weight.text(),
        sizing: sizing,
        qcUrl: qcUrl,
        qcImages: [],
        copyButton: copyButton,
        infoLink: link,
        infoLabel: label,
        iFrame: iFrame,
        uploading: false,
        uploadButton: uploadButton,
        albumHash: "",
        albumId: "",
        imageHashes: [],
        imageIds: []
    }

    // Check whether they already have a album saved for this id
    let storage = localStorage.getObject("cssbuy_suite_uploads");
    if(storage !== null)
    {
        if(orderId in storage.orders)
        {
            orderInfo[orderId] = Object.assign(orderInfo[orderId], storage.orders[orderId]);
            CSSBuySuite.updateOrderAlbumDisplay(orderId);
        }
    }

    // Create Compare QC button
    // URL is in form: https://fashionreps.tools/qcdb/qcview.php?id=616820737680
    if(itemURL.indexOf('item.taobao.com') !== -1)
    {
        // Get the search query parameters
        const urlParams = new URLSearchParams(itemURL.split("?").pop());
        const itemID = urlParams.get('id');
        if(itemID !== null)
        {
            CSSBuySuite.checkQCExists(itemID, $(this).parent());
        }
    }
    
});

// Add combine order button handler
multipleOrderUpload.on("click", CSSBuySuite.uploadMultipleOrders);

function handleCheckboxInputOnArriveTab()
{
    // Count all selected products
    let selectedInputs = $("input.products:checked");
    // Check if we need to hide the prompt
    if(!selectedInputs.length)
    {
        shipPrompt.css("visibility", "hidden");
        return;
    }
    
    // Update labels
    let price = 0;
    let weight = 0;

    selectedInputs.each(function() {
        price += parseInt($(this).attr("data-total-price"));
        weight += parseInt($(this).attr("data-weight"));
    })

    shipPromptItems.text(selectedInputs.length.toString());
    shipPromptPrice.text(price.toString());
    shipPromptWeight.text(weight.toString());
    shipPromptCostEstimate.attr("data-weight", weight);
    shipPromptCostEstimate.attr("data-total-price", price);

    // Show prompt
    shipPrompt.css("visibility", "unset");
}

if(window.location.href.includes("orderlist") && (!window.location.href.includes("type") || window.location.href.includes("arrived")))
{
    $("input.products").on("input", handleCheckboxInputOnArriveTab);
    $(".selectall").on("input", handleCheckboxInputOnArriveTab);
    shipPromptSubmit.on("click", () => $("#submitToShip").click());
    shipPromptCostEstimate.on("click", () => {
        window.open(`https://www.cssbuy.com/?go=page&w=${shipPromptCostEstimate.attr("data-weight")}&m=${shipPromptCostEstimate.attr("data-total-price")}`);
    });
    // If you submit to ship then go back on browser tab, the prompt doesn't display
    // Wait until it's loaded, then check if some are already pressed
    setTimeout(handleCheckboxInputOnArriveTab, 1500);
}

// Helper functions
// https://stackoverflow.com/a/11818658
function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

window.copyToClipboard = function(text) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}