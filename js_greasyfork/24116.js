// ==UserScript==
// @name         Pinterest Slideshow
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Start a slideshow on any Pinterest page where there's pins. Clean and minimalist design. 5s interval between slides. Press ctrl+spacebar to start, left/right keys to navigate.
// @author       French Bond
// @include      https://*.pinterest.*/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/24116/Pinterest%20Slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/24116/Pinterest%20Slideshow.meta.js
// ==/UserScript==

/* globals jQuery, $ */

$(function () {
  'use strict';

  const slideInterval = 5000;
  let pins = [];
  let c = 0; // Current slide number
  let interval;
  let running = 0;

  function init() {
    addSlideShowButton();
    addSlideShowImageAndControls();
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
    $('html').append(
      '<div class="slideshow" style="display:none; position: fixed; width: 100%; height: 100%; background-color: #333; z-index: 10000000; left: 0; top: 0;">' +
        '<img style="object-fit: contain; width: 100%; height: 100%;">' +
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
      //.append('<div class="options-slideshow" style="cursor:pointer; background-color: #666; color: #fff; padding: 7px; float:left; border-radius: 4px; margin-left:3px;">Options</div>')
      .append('<div class="info-slideshow" style="color: #ccc; padding: 7px; float:left;">/</div>');

    // Handle Stop Button
    $('.stop-slideshow').click(function () {
      clearInterval(interval);
      running = 0;
      $('.slideshow').hide();
      console.log('Slideshow stopped');
    });
  }

  function getPinsInfo() {
    return $('[role="listitem"]')
      .map(function () {
        const a = $(this).find('a[aria-label*="pin"]').first();
        return {
          href: a.attr('href'),
          // Not always available
          src: a
            .find('img[srcset]')
            ?.attr('srcset')
            ?.match(/([^ ]*) 4x$/)[1],
        };
      })
      .get();
  }

  function startSlideshow() {
    $('.slideshow').show();

    pins = getPinsInfo();
    console.log(pins);

    console.log('Starting slideshow');
    console.log('Number of slides: ' + pins.length);
    console.log('Slide interval: ' + slideInterval / 1000 + 's');

    // Start from first slide
    c = 0;
    running = 1;

    // Reset interval
    clearInterval(interval);
    interval = setInterval(nextSlide, slideInterval);

    showSlide();
  }

  async function showSlide() {
    console.log('Current slide: ' + (c + 1));

    // Show slide
    const pin = pins[c];
    const imgSrc = pin.src || (await getImgSrc(pin));
    $('.slideshow img').attr('src', imgSrc);
    $('.info-slideshow').html(c + 1 + '/' + pins.length);

    preloadNextSlide();
  }

  async function preloadNextSlide() {
    const nextSlide = c + 1;
    if (nextSlide > pins.length - 1) return;
    const pin = pins[nextSlide];
    const imgSrc = pin.src || (await getImgSrc(pin));
    console.log('Preloading next slide: ' + imgSrc);
    preloadPictures([imgSrc]);
  }

  function preloadPictures(pictureUrls, callback) {
    var i,
      j,
      loaded = 0;

    for (i = 0, j = pictureUrls.length; i < j; i++) {
      (function (img, src) {
        img.onload = function () {
          if (++loaded == pictureUrls.length && callback) {
            callback();
          }
        };
        img.onerror = function () {};
        img.onabort = function () {};
        img.src = src;
      })(new Image(), pictureUrls[i]);
    }
  }

  async function getImgSrc(pin) {
    const url = pin.href;
    try {
      // Fetch the HTML content from the URL
      const response = await fetch(url);
      const html = await response.text();

      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Find the image with the specified alt text and return its src
      const img = doc.querySelector('img[alt="Story pin image"]');

      // Cache the src on the pin object
      pin.src = img ? img.src : null;

      return pin.src;
    } catch (error) {
      console.error('Error fetching or parsing:', error);
      return null;
    }
  }

  function nextSlide() {
    c++;
    if (c > pins.length - 1) c = 0;
    showSlide();
  }

  function previousSlide() {
    c--;
    if (c < 0) c = pins.length - 1;
    showSlide();
  }

  $('body').keydown(function (e) {
    if (running) {
      if (e.keyCode == 37) {
        // left
        clearInterval(interval);
        previousSlide();
        interval = setInterval(nextSlide, slideInterval);
      }
      if (e.keyCode == 39) {
        // right
        clearInterval(interval);
        nextSlide();
        interval = setInterval(nextSlide, slideInterval);
      }
    } else {
      if (e.ctrlKey && e.keyCode == 32) startSlideshow();
    }
  });

  init();
});
