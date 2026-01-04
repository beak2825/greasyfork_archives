// ==UserScript==
// @name         Pinterest Slideshow (dvirzxc's fork)
// @namespace    https://greasyfork.org/users/1257389
// @version      1.0.05
// @description  Fork from French Bond's Pinterest Slideshow script (ver. 1.5.1) with a bunch of my amateur copilot assisted code. - Start a slideshow on any Pinterest page where there's pins.
// @author       dvirzxc
// @match        https://*.pinterest.com/*
// @match        https://*.pinterest.at/*
// @match        https://*.pinterest.ca/*
// @match        https://*.pinterest.ch/*
// @match        https://*.pinterest.cl/*
// @match        https://*.pinterest.co.kr/*
// @match        https://*.pinterest.co.uk/*
// @match        https://*.pinterest.com.au/*
// @match        https://*.pinterest.com.mx/*
// @match        https://*.pinterest.de/*
// @match        https://*.pinterest.dk/*
// @match        https://*.pinterest.es/*
// @match        https://*.pinterest.fr/*
// @match        https://*.pinterest.ie/*
// @match        https://*.pinterest.info/*
// @match        https://*.pinterest.it/*
// @match        https://*.pinterest.jp/*
// @match        https://*.pinterest.nz/*
// @match        https://*.pinterest.ph/*
// @match        https://*.pinterest.pt/*
// @match        https://*.pinterest.se/*
// @license MIT
// @grant        GM_registerMenuCommand
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/486595/Pinterest%20Slideshow%20%28dvirzxc%27s%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486595/Pinterest%20Slideshow%20%28dvirzxc%27s%20fork%29.meta.js
// ==/UserScript==

/* globals jQuery, $ */

$(function () {
    'use strict';

    let customSlideInterval = 1000; // Default slide interval in milliseconds
    let pins = [];
    let c = 0; // Current slide number
    let interval;
    let running = 0;
    let observer;

    function init() {
        addSlideShowButton();
        addSlideShowImageAndControls();
        collectPinsInfo();
        observeDynamicChanges();
        addKeyboardShortcuts();
        addContextMenuOptions();
    }

    function addSlideShowButton() {
        $('body').append(
            '<div style="position: fixed; bottom: 20px; left: 10px;">' +
            '<div>' +
            '<span class="slideshow-button" style="cursor:pointer; background-color: #C92228; color: #fff; padding: 8px; font-weight: bold; font-size: 14px; border-radius: 4px;">Slideshow</span>' +
            '</div>' +
            '</div>'
        );

        $('.slideshow-button').click(startSlideshow);
    }

    function addSlideShowImageAndControls() {
        // Add slideshow div
        $('body').append(
            '<div class="slideshow" style="display:none; position: fixed; width: 100%; height: 100%; background-color: #333; z-index: 10000000; left: 0; top: 0;">' +
            '<a id="slideshow-link" target="_blank"><img id="slideshow-img" style="object-fit: contain; width: 100%; height: 100%;"></a>' +
            '</div>'
        );

        // Add the slideshow menu
        $('.slideshow').append(
            '<div class="menu-slideshow" style="position: absolute; left:3px; top:3px; font-size:14px;"></div>'
        );

        $('.menu-slideshow')
            .append(
                '<div class="stop-slideshow" style="cursor:pointer; background-color: #C92228; color: #fff; padding: 7px; float:left; font-weight: bold; border-radius: 4px;">Stop</div>'
            )
            .append('<div class="info-slideshow" style="color: #ccc; padding: 7px; float:left;">/</div>');

        // Handle Stop Button
        $('.stop-slideshow').click(stopSlideshow);
    }

    function collectPinsInfo() {
        const newPins = getPinsInfo();
        newPins.forEach(newPin => {
            if (!pins.some(pin => pin.href === newPin.href)) {
                pins.push(newPin);
            }
        });
        console.log(pins);
    }

    function observeDynamicChanges() {
        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length) {
                    collectPinsInfo();
                }
            });
        });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(document.body, config);
    }

    function getPinsInfo() {
        return Array.from(document.querySelectorAll('[data-test-id="pinWrapper"]')).map(function (pinWrapper) {
            const a = pinWrapper.querySelector('a');
            const imageContainerLink = a.getAttribute('href');
            const img = a.querySelector('img');
            return {
                href: a.getAttribute('href'),
                src: findBestQualityImage(a),
                imageContainerLink: imageContainerLink
            };
        });
    }

    function findBestQualityImage(a) {
        const img = a.querySelector('img');
        if (img) {
            const imgSrcSet = img.getAttribute('srcset');
            if (imgSrcSet) {
                const srcSetArray = imgSrcSet.split(',').map(function (s) {
                    return s.trim().split(' ');
                });
                srcSetArray.sort(function (a, b) {
                    return parseInt(b[1]) - parseInt(a[1]);
                });
                return srcSetArray[0][0];
            } else {
                return img.getAttribute('src');
            }
        }
        return null;
    }

    function startSlideshow() {
        $('.slideshow').show();

        console.log('Starting slideshow');
        console.log('Number of slides: ' + pins.length);
        console.log('Slide interval: ' + customSlideInterval / 1000 + 's');

        c = 0;
        running = 1;
        clearInterval(interval);
        interval = setInterval(nextSlide, customSlideInterval);
        showSlide();
    }

    function showSlide() {
        console.log('Current slide: ' + (c + 1));
        const pin = pins[c];
        $('#slideshow-img').attr('src', pin.src);
        $('#slideshow-link').attr('href', pin.imageContainerLink);
        $('.info-slideshow').html(c + 1 + '/' + pins.length);
        preloadNextSlide();
    }

    async function preloadNextSlide() {
        const nextSlide = c + 1;
        if (nextSlide > pins.length - 1) return;
        const pin = pins[nextSlide];
        console.log('Preloading next slide: ' + pin.src);
        preloadPictures([pin.src]);
    }

    function preloadPictures(pictureUrls) {
        let loaded = 0;
        pictureUrls.forEach(function (url) {
            const img = new Image();
            img.onload = function () {
                loaded++;
                if (loaded === pictureUrls.length) {
                    console.log('All images preloaded');
                }
            };
            img.onerror = function () {
                loaded++;
                console.error('Failed to load image:', url);
            };
            img.src = url;
        });
    }

    function stopSlideshow() {
        clearInterval(interval);
        running = 0;
        $('.slideshow').hide();
        console.log('Slideshow stopped');
    }

    function pauseSlideshow() {
        clearInterval(interval);
        running = 0;
        console.log('Slideshow paused');
    }

    function resumeSlideshow() {
        if (!running) {
            clearInterval(interval);
            interval = setInterval(nextSlide, customSlideInterval);
            running = 1;
            console.log('Slideshow resumed');
        }
    }

    function previousSlide() {
        c--;
        if (c < 0) c = pins.length - 1;
        showSlide();
    }

    function nextSlide() {
        c++;
        if (c > pins.length - 1) c = 0;
        showSlide();
    }

    function addKeyboardShortcuts() {
        $(document).on('keydown', function (e) {
            if (e.key === 'p') {
                pauseSlideshow();
            } else if (e.key === 'l') {
                resumeSlideshow();
            } else if (e.key === 'ArrowLeft') {
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
    }

    function addContextMenuOptions() {
        GM_registerMenuCommand("Set slide interval to 0.5s", function() {
            customSlideInterval = 500;
            console.log("Slide interval set to 0.5s");
        });

        GM_registerMenuCommand("Set slide interval to 1s", function() {
            customSlideInterval = 1000;
            console.log("Slide interval set to 1s");
        });

        GM_registerMenuCommand("Set slide interval to 3s", function() {
            customSlideInterval = 3000;
            console.log("Slide interval set to 3s");
        });

        GM_registerMenuCommand("Set slide interval to 5s", function() {
            customSlideInterval = 5000;
            console.log("Slide interval set to 5s");
        });

        GM_registerMenuCommand("Set slide interval to 10s", function() {
            customSlideInterval = 10000;
            console.log("Slide interval set to 10s");
        });
    }

    init();
});
