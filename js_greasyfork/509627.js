// ==UserScript==
// @name         4chan - Vanilla+
// @namespace    http://tampermonkey.net/
// @version      2.42
// @description  This script enhances your 4chan browsing experience by removing redirect URLs from links (when the "Linkify URLs" option is enabled), automatically loading all media in a thread upon entry, and seamlessly displaying Catbox-hosted videos and images directly within the thread.
// @author       Airman
// @match        https://*.4chan.org/*
// @grant        none
// @run-at       document-end
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/509627/4chan%20-%20Vanilla%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/509627/4chan%20-%20Vanilla%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bypassRedirects() {
        // Select all links on the page
        let links = document.querySelectorAll('a');
        // Loop through each link
        links.forEach(link => {
            // Check if the link URL matches the 4chan redirect URL
            if (link.href.startsWith('https://sys.4chan.org/derefer?url=')) {
                // Extract the target URL from the redirect URL by removing the prefix
                let targetUrl = link.href.replace('https://sys.4chan.org/derefer?url=', '');
                // Decode the target URL to get the actual URL
                targetUrl = decodeURIComponent(targetUrl);
                // If the target URL is found, update the link href to it
                if (targetUrl) {
                    link.href = targetUrl;
                    console.log(`Updated link: ${link.href}`);
                }
            }
        });
    }

    function renderCatboxMedia() {
        // Render all Catbox images and videos inline
        let catboxLinks = document.querySelectorAll('a[href*="catbox.moe"]');
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const videoExtensions = ['.mp4', '.webm'];

        catboxLinks.forEach(link => {
            let mediaUrl = link.href;

            // Check if the media has already been rendered for this link
            if (link.classList.contains('media-rendered')) {
                return;
            }

            // Mark the link as processed to avoid duplicate rendering
            link.classList.add('media-rendered');

            // Check if the URL is an image file
            if (imageExtensions.some(ext => mediaUrl.endsWith(ext))) {
                let thumbImg = new Image();
                thumbImg.src = mediaUrl;
                thumbImg.style.maxWidth = '150px';
                thumbImg.style.display = 'block';
                thumbImg.style.marginTop = '10px';
                thumbImg.style.cursor = 'pointer';
                thumbImg.classList.add('rendered-media');

                let fullImg = new Image();
                fullImg.src = mediaUrl;
                fullImg.style.maxWidth = '100%';
                fullImg.style.display = 'none';
                fullImg.style.marginTop = '10px';
                fullImg.style.cursor = 'pointer';
                fullImg.classList.add('rendered-media');

                thumbImg.addEventListener('click', () => {
                    thumbImg.style.display = 'none';
                    fullImg.style.display = 'block';
                });

                fullImg.addEventListener('click', () => {
                    fullImg.style.display = 'none';
                    thumbImg.style.display = 'block';
                });

                // Insert the thumbnail image after the link
                link.parentNode.insertBefore(thumbImg, link.nextSibling);
                link.parentNode.insertBefore(fullImg, thumbImg.nextSibling);
                console.log(`Rendered Catbox image: ${mediaUrl}`);

            } else if (videoExtensions.some(ext => mediaUrl.endsWith(ext))) {
                // Fetch the video thumbnail
                fetchVideoThumbnail(mediaUrl).then(thumbnailUrl => {
                    let thumbDiv = document.createElement('div');
                    let fullVideo = document.createElement('video');
                    let closeWrapper = document.createElement('span');
                    let closeLink = document.createElement('a');

                    closeWrapper.textContent = ' - [';
                    closeLink.textContent = 'Close';
                    closeLink.style.cursor = 'pointer';
                    closeLink.style.textDecoration = 'underline';
                    closeWrapper.style.display = 'none';

                    closeWrapper.appendChild(closeLink);
                    closeWrapper.appendChild(document.createTextNode(']'));

                    fullVideo.src = mediaUrl;
                    fullVideo.controls = true;
                    fullVideo.style.maxWidth = '100%';
                    fullVideo.style.display = 'none';
                    fullVideo.style.marginTop = '10px';
                    fullVideo.classList.add('rendered-media');

                    if (thumbnailUrl) {
                        thumbDiv.style.backgroundImage = `url(${thumbnailUrl})`;
                    } else {
                        thumbDiv.textContent = 'Click to view video';
                    }

                    thumbDiv.style.width = '150px';
                    thumbDiv.style.height = '150px';
                    thumbDiv.style.display = 'flex';
                    thumbDiv.style.alignItems = 'center';
                    thumbDiv.style.justifyContent = 'center';
                    thumbDiv.style.marginTop = '10px';
                    thumbDiv.style.cursor = 'pointer';
                    thumbDiv.style.backgroundSize = 'cover';
                    thumbDiv.style.backgroundColor = '#000';
                    thumbDiv.style.color = '#fff';
                    thumbDiv.classList.add('rendered-media');

                    thumbDiv.addEventListener('click', () => {
                         fullVideo.play();
                        thumbDiv.style.display = 'none';
                        fullVideo.style.display = 'block';
                        closeWrapper.style.display = 'inline';
                    });

                    closeLink.addEventListener('click', () => {
                        fullVideo.pause();
                        fullVideo.style.display = 'none';
                        thumbDiv.style.display = 'flex';
                        closeWrapper.style.display = 'none';
                    });

                    // Insert the elements after the link
                    link.parentNode.insertBefore(closeWrapper, link.nextSibling);
                    link.parentNode.insertBefore(thumbDiv, closeWrapper.nextSibling);
                    link.parentNode.insertBefore(fullVideo, thumbDiv.nextSibling);
                    console.log(`Rendered Catbox video: ${mediaUrl}`);
                });
            }
        });
    }

    function fetchVideoThumbnail(videoUrl) {
        return new Promise((resolve, reject) => {
            let video = document.createElement('video');
            video.src = videoUrl;
            video.crossOrigin = 'anonymous';
            video.addEventListener('loadeddata', () => {
                video.currentTime = 1; // Set the time to 1 second to get a frame
            });

            video.addEventListener('seeked', () => {
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg'));
            });

            video.addEventListener('error', () => {
                reject('Error loading video thumbnail');
            });
        });
    }

    function preloadImages() {
        // Preload thread images (thumbnails and full-sized images)
        let thumbImages = document.querySelectorAll('.fileThumb img');
        thumbImages.forEach(imgElement => {
            if (imgElement.classList.contains('media-rendered')) {
                return;
            }

            imgElement.classList.add('media-rendered');
            let thumbUrl = imgElement.src;
            let fullUrl = imgElement.parentNode.href;

            if (thumbUrl) {
                let thumbImg = new Image();
                thumbImg.src = thumbUrl;
                console.log(`Preloading thumbnail image: ${thumbUrl}`);
            }
            if (fullUrl) {
                let fullImg = new Image();
                fullImg.src = fullUrl;
                console.log(`Preloading full-sized image: ${fullUrl}`);
            }
        });
    }

    // Run the functions initially to bypass redirects and render images and videos inline on the existing page content
    bypassRedirects();
    renderCatboxMedia();
    preloadImages();

    // Intercept Fetch API requests
    (function() {
        const originalFetch = window.fetch;
        window.fetch = function() {
            return originalFetch.apply(this, arguments).then(response => {
                // Check if the request URL matches the pattern for thread updates
                if (response.url.includes('.json')) {
                    response.clone().json().then(data => {
                        console.log('Update request completed:', response.url);
                        // Run the bypass and render functions after the update request completes
                        setTimeout(function() {
                            console.log('Now running functions after the update:');
                            bypassRedirects();
                            renderCatboxMedia();
                            preloadImages();
                        }, 1000);
                    });
                }
                return response;
            });
        };
    })();

    // Intercept XMLHttpRequest requests
    (function() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                // Check if the request URL matches the pattern for thread updates
                if (url.includes('.json')) {
                    console.log('Update request completed:', url);
                    // Run the bypass and render functions after the update request completes
                    setTimeout(function() {
                        console.log('Now running functions after the update:');
                        bypassRedirects();
                        renderCatboxMedia();
                        preloadImages();
                    }, 1000);
                }
            });
            originalOpen.apply(this, arguments);
        };
    })();
})();
