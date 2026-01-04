// ==UserScript==
// @name         Diaspora Large Lightbox
// @namespace    diaspora-large-lightbox-anypod
// @version      0.3.1
// @description  Opens full sized images in the lightbox on any diaspora pod
// @author       kalipus@i-o.stream
// @match        https://*/posts/*
// @match        https://*/people/*
// @match        https://*/stream*
// @match        https://*/activity*
// @match        https://*/liked*
// @match        https://*/commented*
// @match        https://*/mentions*
// @match        https://*/aspects*
// @match        https://*/followed_tags*
// @match        https://*/public*
// @match        https://*/tags/*
// @match        https://*.*/posts/*
// @match        https://*.*/people/*
// @match        https://*.*/stream*
// @match        https://*.*/activity*
// @match        https://*.*/liked*
// @match        https://*.*/commented*
// @match        https://*.*/mentions*
// @match        https://*.*/aspects*
// @match        https://*.*/followed_tags*
// @match        https://*.*/public*
// @match        https://*.*/tags/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373330/Diaspora%20Large%20Lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/373330/Diaspora%20Large%20Lightbox.meta.js
// ==/UserScript==

// Set to false to disable login on the browser console.
var LOG_ENABLED=true

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
    logMsg ("Found photo attachments: " + photoAttachments.length);

    for (var i = 0; i < photoAttachments.length; i++) {
        var photoLinkElement = photoAttachments[i].getElementsByTagName('a')[0];
        var imageUrl = photoLinkElement.getAttribute("href");
        logMsg ("Photo URL before transformation: " + imageUrl);
        var newImageUrl = imageUrl.replace("scaled_full_","");
        logMsg ("Photo URL after transformation: " + newImageUrl);
        photoLinkElement.setAttribute("href", newImageUrl);
    }
}

function transformMainStream() {
    var mainStream = document.getElementById("main-stream");
    if (! mainStream) {
        logMsg("Element main-stream not found");
        return;
    }
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            logMsg("DOM changes in main-stream detected. Transforming photo links");
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                transformPhotoLinks(mutation.addedNodes[i]);
            }
        });
    });
    mutationObserver.observe(mainStream, {
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

})();