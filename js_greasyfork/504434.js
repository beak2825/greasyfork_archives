// ==UserScript==
// @name        F-Droid QR code generator
// @namespace   Xenokore
// @match       https://f-droid.org/*/packages/*
// @grant       none
// @version     1.0
// @author      Yani
// @description Generate QR codes for F-Droid packages
// @require     https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/504434/F-Droid%20QR%20code%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/504434/F-Droid%20QR%20code%20generator.meta.js
// ==/UserScript==

(function () {

    // Find the existing sidebar element
    var sidebar = document.querySelector('.sidebar');

    // Check if the sidebar exists before appending
    if (sidebar) {

        // Create a new sidebar widget for the QR code
        var qrWidget = document.createElement('div');
        qrWidget.className = 'sidebar-widget';
        qrWidget.id = 'qr-code';
        sidebar.appendChild(qrWidget);

        // Create the QR Code
        new QRCode(qrWidget, document.location.href);
    }
}());