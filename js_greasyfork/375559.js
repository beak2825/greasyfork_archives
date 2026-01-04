// ==UserScript==
// @name         SouthernMinn News Premium
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  allows for viewing of SouthernMinn News articles without a subscription
// @author       ParkerCM
// @match        http*://www.southernminn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375559/SouthernMinn%20News%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/375559/SouthernMinn%20News%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function makeHttpObject() {
        try {return new XMLHttpRequest();}
        catch (error) {}

        throw new Error("Could not create HTTP request object.");
    }

    function showParagraphs() {
        // Make paragraphs not hidden
        var num = 0;
        var done = false;

        var nodes = document.getElementsByClassName('subscriber-only hide');
        while (!done) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].className.includes('hide')) {
                    nodes[i].className = 'subscriber-only';
                } else {
                    num++;
                }
            }
            if (num == nodes.length) {
                done = true;
            }
        }
    }

    function removeOverlayAndSubscriptionBox() {
        // Remove overlay at start of article
        var overlay = document.getElementsByClassName('redacted-overlay');
        overlay[0].parentNode.removeChild(overlay[0]);

        // Remove subscription box
        var box = document.getElementsByClassName('subscription-required');
        box[0].parentNode.removeChild(box[0]);
    }

    function showImageCarousel() {
        // Get the parent of all carousel elements
        var imageContainer = document.getElementById('asset-photo-carousel');

        // If page doesn't have a carousel then exit this method
        if (imageContainer == null) {
            console.log('leaving');
            return;
        }

        // Get all the images which will appear on the page
        var allImages = imageContainer.children[0].children[1].children[0].children[0].children;

        // Change CSS classes associated with the elements and change their style
        imageContainer.firstChild.className = 'card photo-carousel subscriber-hide';
        imageContainer.children[0].children[1].className = 'carousel-inner owl-carousel owl-theme owl-loaded';
        imageContainer.children[0].children[1].children[0].style.height = '100%';

        // Calculate the width of the carousel
        var widthOfCarousel = allImages.length * 720;
        imageContainer.children[0].children[1].children[0].children[0].style.width = widthOfCarousel.toString() + 'px';

        // Resize each image
        for (var j = 0; j < allImages.length; j++) {
            allImages[j].style.width = '720px';
        }

        var fullscreenImages = new enableFullScreenImages();

        // Trigger window resize event to refesh DOM and allow the image carousel to work as expected
        window.dispatchEvent(new Event('resize'));
    }

    function enableFullScreenImages() {
        var fullScreenModal = document.getElementsByClassName('modal fullscreen')[0];
        fullScreenModal.children[0].children[0].children[0].children[1].className = 'card photo-carousel has-ad-unit subscriber-hide';
    }

    function showSidePanel() {
        // JQuery is used to delete the left column containing the image upon execution
        // The below lines get an unmodifed page and extract the column which gets deleted
        // The column is then readded to the DOM and a few CSS values are modified to get the correct formatting

        // Get URL for page and send request for the HTML
        var request = new makeHttpObject();
        request.open("GET", window.location.href, true);
        request.send(null);

        // If page was successfully received, proceed
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                // CSS CLASSES
                // Article text: col-lg-8 col-md-12 col-sm-8 col-lg-push-4 col-md-push-0 col-sm-push-4
                // Side panel: col-lg-4 col-md-12 col-sm-4 col-md-pull-0 col-sm-pull-8 col-lg-pull-8

                // Set up parsing object to make parsing the HTML possible
                var parser = new DOMParser();
                var xml = parser.parseFromString(request.responseText, 'text/html');

                // Get the node for the one which gets deleted by JQuery from the requested HTML document
                var nodeToAppend = xml.getElementsByClassName('col-lg-4 col-md-12 col-sm-4 col-md-pull-0 col-sm-pull-8 col-lg-pull-8')[0];

                // If there is no side panel to add then leave this method
                if (nodeToAppend == null) {
                    console.log('leaving');
                    return;
                }

                // Get the parent node which the above node will be appended to from the viewed document
                var parent = document.getElementsByClassName('col-xs-12')[0].parentNode;

                // Insert the node
                parent.insertBefore(nodeToAppend, parent.firstChild);

                // Modify the right CSS property so the image displays on the page
                var addedNode = parent.firstChild;
                addedNode.style.right = 'auto';

                // Get the main text node and rename it. Then reset the left CSS property so it displays properly
                var siblingNode = document.getElementsByClassName('col-xs-12')[0];
                siblingNode.className = 'col-lg-8 col-md-12 col-sm-8 col-lg-push-4 col-md-push-0 col-sm-push-4'
                siblingNode.style.left = 'auto';
            }};
    }

    showParagraphs();
    removeOverlayAndSubscriptionBox();
    showImageCarousel();
    showSidePanel();

})();