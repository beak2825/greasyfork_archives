// ==UserScript==
// @name         My Reading Manga Gallery View
// @namespace    https://myreadingmanga.info/
// @version      2024-07-26rev2
// @description  Provides a simple gallery view for My Reading Manga posts. G to toggle gallery, left/right arrows to cycle images.
// @author       Klewka
// @license      MIT
// @match        https://myreadingmanga.info/*
// @match        http://myreadingmanga.info/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/501851/My%20Reading%20Manga%20Gallery%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/501851/My%20Reading%20Manga%20Gallery%20View.meta.js
// ==/UserScript==

/*
MIT License
Copyright (c) 2024 Klewka
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Gallery layout also shamelessly stolen from 4chan X, also licensed under MIT.
*/

(function() {
    'use strict';

    var galleryWrapper, galImage;
    let currentImage = 0;
    let galleryOpen = false;

    // Only run on single-post pages
    let post = document.getElementsByClassName("post");
    if (post == null || post.length != 1)
    {
        return;
    }

    let content = document.querySelector("div.entry-content");
    const contentParent = content.parentNode;

    // 'View Gallery' Banner
    let viewGalleryBanner = document.createElement("p");
    viewGalleryBanner.classList.add("top-info");
    viewGalleryBanner.innerHTML = "<a href=\"javascript:;\" class=\"gallery-button\"><i>Open Gallery (g)</i></a>";
    contentParent.insertBefore(viewGalleryBanner, content);
    let galleryLink = viewGalleryBanner.getElementsByClassName("gallery-button")[0];
    galleryLink.onclick = function() { createGallery() };

    let images = document.querySelectorAll("div.entry-content img");

    // Create gallery
    var createGallery = (function() {
        if (galleryOpen == true) {
            return;
        }

        galleryWrapper = document.createElement("div");
        galleryWrapper.style = "position: fixed; top: 0; bottom: 0; left: 0; right: 0; display: flex; flex-direction: row; background: rgba(0,0,0,0.7); z-index:130;"
        content.appendChild(galleryWrapper);

        let galButtons = document.createElement("div");
        galButtons.style = "position: fixed; top: 5px; right: 178px !important; font-size: 2em;"

        let galButtonClose = document.createElement("a");
        galButtonClose.style = "text-decoration-line: none; cursor: pointer;";
        galButtonClose.innerText = "x";
        galButtonClose.onclick = function() { closeGallery(); };
        galButtons.appendChild(galButtonClose);

        let gallerySideStyle = "-webkit-flex: 0 0 20px; flex: 0 0 20px; position: relative; cursor: pointer; opacity: 0.7; background-color: rgba(0, 0, 0, 0.3); top: 50%; text-align: center;";

        let galPrev = document.createElement("div");
        galPrev.style = gallerySideStyle
        galPrev.innerText = "<";
        galPrev.onclick = function() { currentImage = currentImage - 1; updateImage(); };

        let galImageWrapper = document.createElement("div");
        galImageWrapper.style = "-webkit-flex: 1 0 auto; flex: 1 0 auto; display: -webkit-flex; display: flex; -webkit-align-items: flex-start; align-items: flex-start; -webkit-justify-content: space-around; justify-content: space-around; overflow:hidden; width:1%;"

        galImage = document.createElement("img");
        galImageWrapper.appendChild(galImage);

        let galNext = document.createElement("div");
        galNext.style = gallerySideStyle;
        galNext.innerText = ">";
        galNext.onclick = function() { currentImage = currentImage + 1; updateImage(); };

        galleryWrapper.appendChild(galButtons);
        galleryWrapper.appendChild(galPrev);
        galleryWrapper.appendChild(galImageWrapper);
        galleryWrapper.appendChild(galNext);

        galleryOpen = true;
        currentImage = 0;
        updateImage();
    });

    // Close gallery
    var closeGallery = (function() {
        content.removeChild(galleryWrapper);
        galleryOpen = false;
    });

    // Update Image
    var updateImage = (function() {
        if (galleryOpen == false) {
            return;
        }
        if (currentImage < 0) {
            currentImage = images.length-1;
        }
        else if (currentImage >= images.length) {
            currentImage = 0;
        }

        while(galImage.attributes.length > 0) {
            galImage.removeAttribute(galImage.attributes[0].name);
        }

        var width, height;
        for (const attr of images[currentImage].attributes) {
            if (attr.name == "width") {
                width = attr.value;
                continue;
            } else if (attr.name == "height") {
                height = attr.value;
                continue;
            }

            galImage.setAttribute(attr.name, attr.value);
        }

        let newStyle = "object-fit: contain; overflow: hidden; padding: 0; margin: auto;";
        newStyle +=
            width > galleryWrapper.clientWidth
            ? "width: 100%;"
            : "height: 100%;";
        galImage.style = newStyle;
    });

    // Add Keybinds
    var keybindHandler = (function(e) {
        switch (e.keyCode) {
            case 37:
                if (galleryOpen) {
                    currentImage = currentImage - 1;
                    updateImage();
                }
                break;
            case 39:
                if (galleryOpen) {
                    currentImage = currentImage + 1;
                    updateImage();
                }
                break;
            case 71:
                if (galleryOpen) {
                    closeGallery();
                }
                else {
                    createGallery()
                }
                break;
        }
    });
    window.addEventListener("keydown", keybindHandler);
})();