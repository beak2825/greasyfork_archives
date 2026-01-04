// ==UserScript==
// @name            View Image
// @namespace       https://github.com/bijij/ViewImage
// @version         3.0.0
// @description     This userscript re-implements the "View Image" and "Search by image" buttons into google images.
// @author          Joshua B
// @run-at          document-end
// @include         http*://*.google.tld/search*tbm=isch*
// @include         http*://*.google.tld/imgres*
// @downloadURL https://update.greasyfork.org/scripts/388472/View%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/388472/View%20Image.meta.js
// ==/UserScript==
'use strict';

// Determines wether using the redesign or not.
function isRedesign() {
    return document.querySelector('.irc_ifr') != null;
}


// Finds the div which contains all required elements
function getContainer(node) {
    return node.closest('.irc_c[style*="visibility: visible;"][style*="transform: translate3d(0px, 0px, 0px);"], .irc_c[data-ved]');
}


// Finds and deletes all extension related elements.
function clearExtElements(container) {
    // Remove previously generated elements
    var oldExtensionElements = container.querySelectorAll('.vi_ext_addon');
    for (var element of oldExtensionElements) {
        element.remove();
    }
}


// Returns the image URL
function findImage(container, redesign) {

    var image = null;

    if (!redesign) {
        image = container.querySelector('img[src]#irc_mi, img[alt^="Image result"][src]:not([src^="https://encrypted-tbn"]).irc_mut, img[src].irc_mi');
    } else {
        var iframe = container.querySelector('iframe.irc_ifr');
        image = iframe.contentDocument.querySelector('img#irc_mi');
    }


    // Override url for images using base64 embeds
    if (image === null || image.src === '' || image.src.startsWith('data')) {
        var thumbnail = document.querySelector('img[name="' + container.dataset.itemId + '"]');
        if (thumbnail === null) {
            // If no thumbnail found, try getting image from URL
            var url = new URL(window.location);
            var imgLink = url.searchParams.get('imgurl');
            if (imgLink) {
                image = new Object();
                image.src = imgLink;
            }
        } else {
            var meta = thumbnail.closest('.rg_bx').querySelector('.rg_meta');

            var metadata = JSON.parse(meta.innerHTML);

            image = new Object();
            image.src = metadata.ou;
        }
    }

    // If the above doesn't work, use the link in related images to find it
    if (image === null || image.src === '' || image.src.startsWith('data')) {
        var target_image = container.querySelector('img.target_image');
        if (target_image) {
            var link = target_image.closest('a');
            if (link) {
                // Some extensions replace google image links with their original links
                if (link.href.match(/^[a-z]+:\/\/(?:www\.)?google\.[^/]*\/imgres\?/)) {
                    var link_url = new URL(link.href);
                    var new_imgLink = link_url.searchParams.get('imgurl');
                    if (new_imgLink) {
                        image = new Object();
                        image.src = new_imgLink;
                    }
                } else {
                    image = new Object();
                    image.src = link.href;
                }
            }
        }
    }
    return image;
}


function addViewImageButton(container, image, redesign) {
    // get the visit buttonm
    var visitButton = redesign ? container.querySelector('a.irc_hol[href]') : container.querySelector('td > a.irc_vpl[href]').parentElement;

    // Create the view image button
    var viewImgButton = visitButton.cloneNode(true);
    viewImgButton.classList.add('vi_ext_addon');

    // Set the view image button url
    var viewImageLink = redesign ? viewImgButton : viewImgButton.querySelector('a');
    viewImageLink.href = image.src;
    viewImageLink.setAttribute('target', '_blank');

    // Set the view image button text
    var viewImageButtonText = viewImgButton.querySelector(redesign ? '.irc_ho' : '.Tl8XHc');
    viewImageButtonText.innerText = 'View Image';

    // Place the view image button
    visitButton.parentElement.insertBefore(viewImgButton, visitButton);
    visitButton.parentElement.insertBefore(visitButton, viewImgButton);
}


function addSearchImgButton(container, image, redesign) {

    var link = redesign ? container.querySelector('.irc_ft > a.irc_help') : container.querySelector('.irc_dsh > a.irc_hol');

    // Create the search by image button
    var searchImgButton = link.cloneNode(true);
    searchImgButton.classList.add('vi_ext_addon');

    // Set the more sizes button text
    var searchImgButtonText = searchImgButton.querySelector(redesign ? 'span' : '.irc_ho');
    searchImgButtonText.innerText = 'Search by image';


    // Set the search by image button url
    searchImgButton.href = '/searchbyimage?image_url=' + image.src;
    searchImgButton.setAttribute('target', '_blank');

    // Place the more sizes button
    link.parentElement.insertBefore(searchImgButton, link);
    link.parentElement.insertBefore(link, searchImgButton);

}


// Adds links to an object
function addLinks(node) {

    // Determine wether redesign or not
    var redesign = isRedesign();

    // Find the container
    var container = getContainer(node);

    // Return if no container was found
    if (!container)
        return;

    // Clear any old extension elements
    clearExtElements(container);

    // Find the image url
    var image = findImage(container, redesign);

    // Return if image was not found
    if (!image)
        return;

    addViewImageButton(container, image, redesign);
    addSearchImgButton(container, image, redesign);
}

// Define the mutation observers
var observer = new MutationObserver(function (mutations) {
    for (var mutation of mutations) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            for (var node of mutation.addedNodes) {
                if (node.classList) {
                    // Check for new image nodes
                    if (node.classList.contains('irc_mi') | node.classList.contains('irc_mut') | node.classList.contains('irc_ris')) {
                        addLinks(node);
                    }
                }
            }
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// inject CSS into document
var customStyle = document.createElement('style');
customStyle.innerText = '.irc_dsh>.irc_hol.vi_ext_addon,.irc_ft>.irc_help.vi_ext_addon{margin: 0 4pt!important}.irc_hol.vi_ext_addon{flex-grow:0!important}';
document.head.appendChild(customStyle);


