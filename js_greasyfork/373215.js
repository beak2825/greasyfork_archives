// ==UserScript==
// @name         Pluspora Large Lightbox
// @namespace    http://aperturized.com
// @version      0.5.1
// @description  Opens full sized images in the lightbox on pluspora.
// @author       carsten.schlipf(at)aperturized.com
// @match        https://pluspora.com/*
// @match        https://*.pluspora.com/**
// @match        https://joindiaspora.org/*
// @match        https://*.joindiaspora.org/**
// @match        https://deko.cloud/**
// @match        https://despora.de/*
// @match        https://*.despora.de/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373215/Pluspora%20Large%20Lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/373215/Pluspora%20Large%20Lightbox.meta.js
// ==/UserScript==

// Set to true to enable login on the browser console.
var LOG_ENABLED=false;

function logMsg(message) {
    if (! LOG_ENABLED)
    {
        return;
    }
    console.log ("[Pluspora Large Lightbox] " + message);
}

function transformPhotoLinks(parentElement) {
    if (!parentElement)
    {
        logMsg("parentElement is not defined");
        return;
    }
    if (parentElement.getElementsByClassName == undefined)
    {
        logMsg("parentElement.getElementsByClassName is not defined");
        return;
    }
    var photoAttachments = parentElement.getElementsByClassName("photo-attachments")
    if (!photoAttachments)
    {
        logMsg ("No photo attachments found");
        return;
    }

    for (var i = 0; i < photoAttachments.length; i++) {
        var photoLinkElement = photoAttachments[i].getElementsByTagName('a')[0];
        var imageUrl = photoLinkElement.getAttribute("href");
        logMsg ("Photo URL before transformation: " + imageUrl);
        var newImageUrl = imageUrl.replace("scaled_full_","");
        logMsg ("Photo URL after transformation: " + newImageUrl);
        photoLinkElement.setAttribute("href", newImageUrl);
    }
}


function extendLightbox() {
    var galleryElement = document.getElementById("blueimp-gallery");
    if (!galleryElement) {
        logMsg("Gallery element blueimp-gallery not found. Cannot add details link.")
    }
    var slidesElement = galleryElement.firstElementChild;
    logMsg("slidesElement " + slidesElement);

    // Add details link
    var detailsLink = document.createElement("a");
    detailsLink.setAttribute("target", "diaspora-exif");
    detailsLink.setAttribute("style", "padding:4px; background-color:white; color:black; opacity:0.3; font-weight: bold; font-size:10px;");
    detailsLink.setAttribute("id", "pll-details-link");
    var node = document.createTextNode("DETAILS");
    detailsLink.appendChild(node);
    galleryElement.appendChild(detailsLink);

    // Observe slides element to update link URL, when slides are added
    // Limitation: Only works for the first image of a slide show.
    var slidesMutationObserver = new MutationObserver(function(mutations) {
        logMsg("DOM changes in slides detected. Updating details link");
        var slides = slidesElement.getElementsByClassName("slide");
        if (slides.length == 0 ) {
            logMsg("No slide element found");
        } else {
            var imgElements = slides[0].getElementsByTagName("img");
            if (imgElements.length == 0 ) {
                logMsg("No img found within the slide")
            } else {
                var imgUrl = imgElements[0].getAttribute("src");
                logMsg("Updating details link for image with URL " + imgUrl);
                detailsLink.setAttribute("href", "https://exifinfo.org/url?url=" + imgUrl);
            }
        }
    });
    slidesMutationObserver.observe(slidesElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree:true,
        characterDataOldValue: false
    });
    logMsg ("MutationObserver registered for slides");
}

function transformMainStream() {
    var mainStream = document.getElementById("main-stream");
    if (! mainStream) {
        logMsg("Element main-stream not found");
        return;
    }
    var streamMutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.type == "childList")
            {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode=mutation.addedNodes[i];
                    if (addedNode.nodeName == "DIV"){
                        logMsg("New div added to main-stream. Scanning for photo attachments.");
                        transformPhotoLinks(addedNode);
                    }
                }
            }
        });
    });
    streamMutationObserver.observe(mainStream, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree:true,
        characterDataOldValue: false
    });
    logMsg ("MutationObserver registered for main-stream");
}


(function() {
    'use strict';
    logMsg ("Running Pluspora Large Lightbox Tampermonkey script.");

    logMsg(document.location.href.indexOf("/posts/"));
    if (document.location.href.indexOf("/posts/") >= 0) {
        logMsg ("We are on a posts page");
        transformPhotoLinks(document);
    } else if (document.getElementById("main-stream")) {
        logMsg ("We are on a page featuring a main-stream.");
        transformMainStream();
    } else {
        logMsg ("Unknown page type. Cannot transform picture links. URL: " + document.location.href);
    }
    extendLightbox("");

})();