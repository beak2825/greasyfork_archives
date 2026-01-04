// ==UserScript==
// @name          Ticket_Barcode_Generator
// @namespace     https://yournamespace.com
// @description   Generates a scannable QR code for the ticket number and displays it at a specific location.
// @include       https://t.corp.amazon.com/*
// @version       1.0
// @grant         none
// @author        Ribarrer (Rich)
// @downloadURL https://update.greasyfork.org/scripts/493484/Ticket_Barcode_Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/493484/Ticket_Barcode_Generator.meta.js
// ==/UserScript==

(function() {
    // Function to extract ticket number from URL
    function getTicketNumber() {
        var url = window.location.href;
        var match = url.match(/\/([A-Za-z0-9]+)$/); // Match ticket number at the end of the URL
        if (match) {
            return match[1];
        }
        return null; // Return null if no ticket number found
    }

    // Function to generate base64-encoded QR code image
    function generateQRCodeImage(ticketNumber) {
        if (!ticketNumber) return; // Exit if no ticket number found
        if (window.location.href.includes('/create')) return; // Exit if URL contains '/create'

        // Construct the URL for the QR code image using an online QR code generation API
        var qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" + ticketNumber + "&size=60x60"; // Adjusted size

        // Convert the image to base64
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = qrCodeUrl;
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            var base64Data = canvas.toDataURL().split(',')[1];
            displayQRCode(base64Data);
        };
    }

    // Function to display QR code
    function displayQRCode(base64Data) {
        var qrCodeContainer = document.createElement('div');
        qrCodeContainer.style.position = 'absolute'; // Position the container absolutely
        qrCodeContainer.style.top = '525px'; // Adjusted distance from top (increase this value)
        qrCodeContainer.style.left = 'calc(20% + 500px)'; // Shifted right by 8 pixels (as per your previous adjustment)
        qrCodeContainer.style.transform = 'translateX(-50%)'; // Center horizontally
        qrCodeContainer.style.textAlign = 'center'; // Center align the content
        qrCodeContainer.style.zIndex = '9999'; // Set a high z-index value
        var qrCodeImage = document.createElement('img');
        qrCodeImage.src = "data:image/png;base64," + base64Data;
        qrCodeImage.alt = "QR Code";
        qrCodeImage.style.maxWidth = "200px"; // Adjusted max-width
        qrCodeImage.style.maxHeight = "200px"; // Adjusted max-height
        qrCodeContainer.appendChild(qrCodeImage);
        document.body.appendChild(qrCodeContainer); // Append to the body
    }

    // Get ticket number from URL
    var ticketNumber = getTicketNumber();

    // Generate QR code image and display it
    generateQRCodeImage(ticketNumber);
})();
