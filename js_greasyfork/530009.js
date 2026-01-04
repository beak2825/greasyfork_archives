// ==UserScript==
// @name        Keyboard Navigation
// @namespace   Violentmonkey Scripts
// @match       https://divisare.com/*
// @author      tjia.work
// @grant       none
// @version     1.1
// @license     MIT
// @description This script adds keyboard navigation to divisare.com
// @downloadURL https://update.greasyfork.org/scripts/530009/Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/530009/Keyboard%20Navigation.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Select all images in #gallery
  const query = "#gallery .image, .projects .project";
  const images = Array.from(document.querySelectorAll(query));

  if (images.length === 0) return; // Exit if no images found

  const options = {
    behavior: "instant", // smooth | instant | auto
    block: "start", // start | center | end | nearest
    inline: "start", // start | center | end | nearest
  };

  let index = 0; // Track current image index

  // Set up Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        index = images.indexOf(entry.target);
      }
    });
  }, { threshold: 0.5 });

  images.forEach(img => observer.observe(img));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()){
      case "arrowright":
      case "d":
      case "j":
        index = Math.min(index + 1, images.length - 1);
        break;
      case "arrowleft":
      case "a":
      case "k":
        index = Math.max(index - 1, 0);
        break;
      default:
        return;
        break;
    }
    console.log(`Going to ${index+1} of ${images.length}…`)
    images[index].scrollIntoView(options);

  });

})();
