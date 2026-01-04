// ==UserScript==
// @name        Mangasee123 Auto Scroll
// @namespace   http://tampermonkey.net/
// @version     0.7
// @description Auto scroll on mangasee123.com with smooth scrolling, toggle key, and notifications. Defaults are for 67% zoomed mangasee.
// @author      https://github.com/sanjeed5
// @match       https://mangasee123.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/499158/Mangasee123%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/499158/Mangasee123%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let scrollInterval;
  let isScrolling = false;
  let scrollDistance = 300; // Default scroll distance
  let scrollIntervalTime = 2000; // Default interval time in ms
  let controlPanelVisible = true;

  function smoothScroll(duration, distance) {
    let start = null;

    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - ((t - 1) * (t - 1) * 2);

    requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easedProgress = easeInOutQuad(Math.min(progress / duration, 1));
      window.scrollBy(0, distance * easedProgress);
      if (easedProgress < 1) {
        requestAnimationFrame(step);
      }
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.fontSize = '20px';
    toast.style.padding = '15px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    // Fade out and remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  function startScrolling() {
    if (!isScrolling) {
      scrollInterval = setInterval(() => smoothScroll(500, scrollDistance), scrollIntervalTime); // Increased duration for smoother scroll
      isScrolling = true;
      showToast('Scrolling mode activated');
    }
  }

  function stopScrolling() {
    if (isScrolling) {
      clearInterval(scrollInterval);
      isScrolling = false;
      showToast('Scrolling mode deactivated');
    }
  }

  function toggleScrolling() {
    if (isScrolling) {
      stopScrolling();
    } else {
      startScrolling();
    }
  }

  function createControlPanel() {
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = '#fff';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    panel.style.zIndex = '10000';
    panel.style.display = 'block';

    const message = document.createElement('p');
    message.innerText = 'Press "s" to toggle scrolling; "c" to hide this panel';
    message.style.marginBottom = '10px';
    panel.appendChild(message);

    const distanceLabel = document.createElement('label');
    distanceLabel.innerText = 'Scroll Distance:';
    distanceLabel.style.marginRight = '10px';
    panel.appendChild(distanceLabel);

    const distanceInput = document.createElement('input');
    distanceInput.type = 'number';
    distanceInput.value = scrollDistance;
    distanceInput.style.width = '60px';
    distanceInput.addEventListener('change', (e) => {
      scrollDistance = parseInt(e.target.value, 10);
    });
    panel.appendChild(distanceInput);

    const intervalLabel = document.createElement('label');
    intervalLabel.innerText = 'Interval (ms):';
    intervalLabel.style.margin = '0 10px';
    panel.appendChild(intervalLabel);

    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = scrollIntervalTime;
    intervalInput.style.width = '60px';
    intervalInput.addEventListener('change', (e) => {
      scrollIntervalTime = parseInt(e.target.value, 10);
    });
    panel.appendChild(intervalInput);

    document.body.appendChild(panel);

    return panel;
  }

  const controlPanel = createControlPanel();

  function toggleControlPanel() {
    if (controlPanelVisible) {
      controlPanel.style.display = 'none';
      controlPanelVisible = false;
    } else {
      controlPanel.style.display = 'block';
      controlPanelVisible = true;
    }
  }

  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 40 && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      smoothScroll(500, scrollDistance); // Increased duration for smoother scroll
    }
    if (event.key === 's' || event.key === 'S') {
      event.preventDefault();
      toggleScrolling();
    }
    if (event.key === 'c' || event.key === 'C') {
      event.preventDefault();
      toggleControlPanel();
    }
  });
})();
