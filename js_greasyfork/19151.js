// ==UserScript==
// @name            Get YouTube Thumbnail
// @version         0.9
// @description     Adds button to view largest thumbnail image for any video
// @author          Drazen Bjelovuk
// @match           *://www.youtube.com/*
// @grant           none
// @run-at          document-end
// @namespace       https://greasyfork.org/users/11679
// @contributionURL https://goo.gl/dYIygm
// @downloadURL https://update.greasyfork.org/scripts/19151/Get%20YouTube%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/19151/Get%20YouTube%20Thumbnail.meta.js
// ==/UserScript==

document.addEventListener('spfdone', addThumbnailButton);
document.addEventListener('yt-navigate-start', addThumbnailButton);

addThumbnailButton();

const sizes = ['/maxresdefault.jpg', '/hqdefault.jpg', '/mqdefault.jpg', '/sddefault.jpg'];
var vidId;

function tryLoad(index) {
    var image = new Image();
    image.onload = function(img) {
        if (img.path[0].naturalWidth > 120) {
            spinner.querySelector('#spinnerContainer').classList.remove('active');
            window.open(img.path[0].src);
        }
        else if (index < sizes.length - 1) {
            tryLoad(index + 1);
        }
    };
    image.src = 'https://img.youtube.com/vi/'+ vidId + sizes[index];
}

var interval;
var spinnerTemplate = document.createElement('template');
spinnerTemplate.innerHTML = '<paper-spinner id="thumbnailSpinner" class="style-scope yt-next-continuation"><div id="spinnerContainer" class="style-scope paper-spinner"><div class="spinner-layer layer-1 style-scope paper-spinner"><div class="circle-clipper left style-scope paper-spinner"></div><div class="circle-clipper right style-scope paper-spinner"></div></div><div class="spinner-layer layer-2 style-scope paper-spinner"><div class="circle-clipper left style-scope paper-spinner"></div><div class="circle-clipper right style-scope paper-spinner"></div></div><div class="spinner-layer layer-3 style-scope paper-spinner"><div class="circle-clipper left style-scope paper-spinner"></div><div class="circle-clipper right style-scope paper-spinner"></div></div><div class="spinner-layer layer-4 style-scope paper-spinner"><div class="circle-clipper left style-scope paper-spinner"></div><div class="circle-clipper right style-scope paper-spinner"></div></div></div></paper-spinner>';
var spinner = spinnerTemplate.content.firstChild;

function addThumbnailButton() {
    var button = document.getElementById('viewThumbnailBtn');
    if (button) button.remove();

    var subscribeButton = document.querySelector('ytd-video-secondary-info-renderer #subscribe-button');
    if (subscribeButton) {
        button = document.createElement('tp-yt-paper-button');
        button.id = 'viewThumbnailBtn';
        button.className = 'style-scope ytd-subscribe-button-renderer';
        button.style.cssText = 'margin-left: 10px';
        button.textContent = 'View Thumbnail';
        button.onclick = function() {
            spinner.querySelector('#spinnerContainer').classList.add('active');
            vidId = document.querySelector('[video-id]').getAttribute('video-id');
            tryLoad(0);
        };
        subscribeButton.parentNode.insertBefore(button, subscribeButton);
        subscribeButton.parentNode.insertBefore(spinner, button);

        clearInterval(interval);
    }
    else if (~window.location.href.indexOf('v=')) {
        clearInterval(interval);
        interval = setInterval(addThumbnailButton, 500);
    }
}
