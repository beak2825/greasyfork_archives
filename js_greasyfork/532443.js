// ==UserScript==
// @name         Image & Video Hover Preview
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Preview images and videos on hover with delay.
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532443/Image%20%20Video%20Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/532443/Image%20%20Video%20Hover%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('test 222');

    const style = document.createElement("style");
    style.innerHTML = `
        #hover-preview {
            position: fixed;
            top: 0px;
            right: 0px;
            width: 600px;
            max-height: 100vh;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            display: none;
        }
        #hover-preview img, #hover-preview video {
            max-width: 100%;
            display: block;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    const previewBox = document.createElement("div");
    previewBox.id = "hover-preview";
    document.body.appendChild(previewBox);

    let hoverTimeout;

    async function fetchPageContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");
            return await response.text();
        } catch (error) {
            console.error("Fetch error:", error);
            return "";
        }
    }
    const links = document.querySelectorAll('a.image-hover');
    console.log('links', links);
    links.forEach(link => {
        link.addEventListener("mouseenter", (event) => {
            console.log('link', link);
            if (!link) return;

            hoverTimeout = setTimeout(async () => {
                const url = link.href;
                previewBox.innerHTML = "Loading...";
                previewBox.style.display = "block";

                const pageContent = await fetchPageContent(url);
                if (!pageContent) {
                    previewBox.innerHTML = "Failed to load content";
                    return;
                }

                previewBox.innerHTML = "";
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = pageContent;

                // Extract videos
                tempDiv.querySelectorAll(".item-link:not(.fancybox-trigger)").forEach((videoSrc, index) => {
                    console.log('video', videoSrc);
                    const video = document.createElement("video");
                    if (videoSrc.href.includes('javascript')) {
                        video.src = videoSrc.getAttribute('data-trigger-href');
                    } else {
                        video.src = videoSrc.href;
                    }

                    video.controls = true;
                    video.autoPlay = true;
                    video.style.width = '100%';
                    previewBox.appendChild(video);
                    if (index ===0) {
                      video.play();
                    } else {
                      video.addEventListener('mouseenter', () => {
                         video.play();
                      })
                    }
                });

                // Extract images
                tempDiv.querySelectorAll("a.image-hover").forEach(imgLink => {
                    console.log('jg-entry', imgLink);
                    const imgSrc = imgLink.href;
                    if (imgSrc.match(/(jpg|jpeg|png|gif|webp)$/)) {
                        const img = document.createElement("img");
                        img.src = imgSrc;
                        previewBox.appendChild(img);
                    }
                });
            }, 300); // 300ms delay before loading content
        });

        link.addEventListener("mouseout", (event) => {
            if (!link) return;
            clearTimeout(hoverTimeout);
            //previewBox.style.display = "none";
        });
    });


    // call number
    setTimeout(() => {
      const isProfilePage = document.querySelectorAll('#profile-content').length > 0;
        console.log('is profile page', isProfilePage);
        if (!isProfilePage) {
           return;
        }
        const button = document.querySelector('button[data-target="#modal-ajax"]');
        console.log('call button', button);

        button.addEventListener('click', function() {
            console.log('Button clicked!');
        });
    }, 2000);

})();
