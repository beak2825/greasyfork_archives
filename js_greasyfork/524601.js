// ==UserScript==
// @name         Next Image/Previous Image with Alignment and Large Image Support
// @author       cdr-x
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Scroll down/up by aligning images with proper large image section handling
// @include      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/524601/Next%20ImagePrevious%20Image%20with%20Alignment%20and%20Large%20Image%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/524601/Next%20ImagePrevious%20Image%20with%20Alignment%20and%20Large%20Image%20Support.meta.js
// ==/UserScript==

(function() {
  const KEY_W = "w";
  const KEY_S = "s";
  const SCROLL_PERCENTAGE = 0.85; // Scroll 85% of viewport to ensure overlap

  let positions = [];
  let positionsCache = [];
  let lastCacheTime = 0;
  const CACHE_DURATION = 100; // Cache positions for 100ms to avoid recalculating too often
  let lastScrollPosition = 0;
  let stuckCount = 0;

  // Create toast notification system
  function createToast(message, duration = 3000) {
    // Remove any existing toast
    const existingToast = document.getElementById('scroll-debug-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'scroll-debug-toast';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 12px 16px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 12px;
      z-index: 999999;
      max-width: 400px;
      line-height: 1.4;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      white-space: pre-wrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, duration);
  }

  function getAbsoluteTop(element) {
    // Get absolute position from top of document, handling iframes correctly
    let top = 0;
    let currentElement = element;

    // Walk up the element tree to calculate offset
    while (currentElement) {
      top += currentElement.offsetTop || 0;

      // If we hit the body/html of an iframe document, we need to add the iframe's position
      if (currentElement.offsetParent === null && currentElement.ownerDocument !== document) {
        // We're at the top of an iframe document, find the iframe element in parent
        const frames = window.document.querySelectorAll('iframe');
        for (const frame of frames) {
          try {
            if (frame.contentDocument === currentElement.ownerDocument ||
                frame.contentWindow.document === currentElement.ownerDocument) {
              // Found the iframe, now add its position and continue from there
              currentElement = frame;
              break;
            }
          } catch (e) {
            // Cross-origin iframe, skip
          }
        }
        // If we didn't find the iframe, break to avoid infinite loop
        if (currentElement === element || currentElement.nodeName !== 'IFRAME') {
          break;
        }
      } else {
        currentElement = currentElement.offsetParent;
      }
    }

    return Math.round(top);
  }

  function getAllImages() {
    // Get all images from main document and all iframes
    let allImages = [];

    // Get images from main document
    allImages.push(...document.querySelectorAll('img'));

    // Get images from all iframes
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        // Try to access iframe content (will fail for cross-origin)
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          allImages.push(...iframeDoc.querySelectorAll('img'));
        }
      } catch (e) {
        // Cross-origin iframe, skip it
        console.debug('Cannot access iframe:', e);
      }
    }

    return allImages;
  }

  function updateImagePositions(forceUpdate = false) {
    const now = Date.now();

    // Use cache if available and recent, unless forced
    if (!forceUpdate && positionsCache.length > 0 && now - lastCacheTime < CACHE_DURATION) {
      positions = positionsCache;
      return;
    }

    positions = [];
    // Get all images including those in iframes
    const allImages = getAllImages();

    for (let idx = 0; idx < allImages.length; idx++) {
      const img = allImages[idx];

      // Skip tiny images
      if (img.width * img.height < 80 * 80) continue;

      // Skip images that haven't loaded yet or are hidden
      if (!img.complete || img.naturalHeight === 0) continue;

      const computedStyle = img.ownerDocument.defaultView.getComputedStyle(img);
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') continue;

      const ytop = getAbsoluteTop(img);
      const ybottom = ytop + img.height;

      // Sanity check - skip images with invalid positions
      if (ytop < 0 || isNaN(ytop) || isNaN(ybottom)) continue;

      positions.push([idx, ytop, ybottom, img]); // Store img reference too
    }

    positions.sort((a, b) => a[1] - b[1]);

    // Update cache
    positionsCache = positions;
    lastCacheTime = now;
  }

  function findNonTruncatedPosition(initialPosition, viewportHeight) {
    let currentPosition = initialPosition;
    let found = false;
    let iterations = 0;
    const maxIterations = 100; // Prevent infinite loops

    while (!found && iterations < maxIterations) {
      found = true;
      iterations++;

      for (let i = 0; i < positions.length; i++) {
        const [, imgTop, imgBottom] = positions[i];
        // If position would land in middle of a small image, snap to its top
        if (imgTop < currentPosition && imgBottom > currentPosition && imgBottom - imgTop < viewportHeight * 0.8) {
          currentPosition = imgTop;
          found = false;
          break;
        }
      }
    }
    return currentPosition;
  }

  function scrollToNextImage(currentScroll, viewportHeight) {
    const currentBottomEdge = currentScroll + viewportHeight;
    const scrollIncrement = viewportHeight * SCROLL_PERCENTAGE;

    // First check: Is there an image that's truncated at the bottom of the viewport?
    // (partially visible, with its top above the bottom edge but below current scroll)
    // This should take priority for alignment UNLESS it's a large image
    for (let i = 0; i < positions.length; i++) {
      const [, imgTop, imgBottom] = positions[i];
      const imgHeight = imgBottom - imgTop;
      const isLargeImage = imgHeight > viewportHeight;

      // Check if image is truncated at bottom (top is visible but bottom is cut off)
      const isTruncatedAtBottom = imgTop >= currentScroll && imgTop < currentBottomEdge && imgBottom > currentBottomEdge;

      if (isTruncatedAtBottom && !isLargeImage) {
        // Small/medium image truncated at bottom - align to its top
        // But only if we'd actually move (not already aligned)
        if (imgTop > currentScroll + 10) {
          return {
            position: findNonTruncatedPosition(imgTop, viewportHeight),
            reason: `S: Truncated img[${i}] at bottom\n→ Align to top @ ${imgTop}px\nCurrent: ${currentScroll}px\nImgHeight: ${imgHeight}px (not large)`
          };
        }
      }
    }

    // Second check: Are we viewing a large image?
    let currentLargeImageIndex = -1;
    for (let i = 0; i < positions.length; i++) {
      const [, imgTop, imgBottom] = positions[i];
      const imgHeight = imgBottom - imgTop;

      // Check if this is a large image (taller than viewport)
      if (imgHeight > viewportHeight) {
        const viewingTop = currentScroll;
        const viewingBottom = currentBottomEdge;

        // Are we currently viewing any part of this large image?
        const isViewingThisImage = imgBottom > viewingTop && imgTop < viewingBottom;

        if (isViewingThisImage) {
          currentLargeImageIndex = i;
          break;
        }
      }
    }

    // If we found a large image we're viewing, handle scrolling within it
    if (currentLargeImageIndex >= 0) {
      const [, imgTop, imgBottom] = positions[currentLargeImageIndex];

      // Calculate how much of the image is below our current view
      const remainingImageBelow = imgBottom - currentBottomEdge;

      // If there's significant image content below (more than 10% of viewport), scroll within the image
      if (remainingImageBelow > viewportHeight * 0.1) {
        const nextPosition = currentScroll + scrollIncrement;
        // Make sure we don't scroll past the bottom of the image
        const maxScroll = imgBottom - viewportHeight;
        return {
          position: Math.min(nextPosition, maxScroll),
          reason: `S: Inside large img[${currentLargeImageIndex}]\n→ Scroll within image\nCurrent: ${currentScroll}px → ${Math.min(nextPosition, maxScroll)}px\nRemaining below: ${remainingImageBelow}px`
        };
      } else {
        // We're near the bottom of this large image, move to next image
        for (let j = currentLargeImageIndex + 1; j < positions.length; j++) {
          const nextImgTop = positions[j][1];
          // Find next image that starts at or after this one's bottom
          if (nextImgTop >= imgBottom - 50) {
            return {
              position: findNonTruncatedPosition(nextImgTop, viewportHeight),
              reason: `S: At bottom of large img[${currentLargeImageIndex}]\n→ Jump to next img[${j}] @ ${nextImgTop}px\nCurrent: ${currentScroll}px`
            };
          }
        }
        // No next image found, just scroll down
        const newPos = Math.min(currentScroll + scrollIncrement, document.documentElement.scrollHeight - viewportHeight);
        return {
          position: newPos,
          reason: `S: At bottom of large img[${currentLargeImageIndex}]\n→ No next img, scroll down\nCurrent: ${currentScroll}px → ${newPos}px`
        };
      }
    }

    // Normal navigation: find next image below current view
    for (let i = 0; i < positions.length; i++) {
      const [, imgTop, imgBottom] = positions[i];

      // Find next image that starts at or below current bottom edge
      if (imgTop >= currentBottomEdge - 10) {
        return {
          position: findNonTruncatedPosition(imgTop, viewportHeight),
          reason: `S: Normal nav\n→ Jump to next img[${i}] @ ${imgTop}px\nCurrent: ${currentScroll}px`
        };
      }
    }

    // No images found, scroll by viewport
    const newPos = Math.min(currentScroll + scrollIncrement, document.documentElement.scrollHeight - viewportHeight);
    return {
      position: newPos,
      reason: `S: No images below\n→ Scroll down by viewport\nCurrent: ${currentScroll}px → ${newPos}px`
    };
  }

  function scrollToPreviousImage(currentScroll, viewportHeight) {
    const currentBottomEdge = currentScroll + viewportHeight;
    const scrollIncrement = viewportHeight * SCROLL_PERCENTAGE;

    // First, find if we're currently viewing any large image
    let currentLargeImageIndex = -1;
    for (let i = 0; i < positions.length; i++) {
      const [, imgTop, imgBottom] = positions[i];
      const imgHeight = imgBottom - imgTop;

      // Check if this is a large image (taller than viewport)
      if (imgHeight > viewportHeight) {
        const viewingTop = currentScroll;
        const viewingBottom = currentBottomEdge;

        // Are we currently viewing any part of this large image?
        const isViewingThisImage = imgBottom > viewingTop && imgTop < viewingBottom;

        if (isViewingThisImage) {
          currentLargeImageIndex = i;
          break; // Found it, stop searching
        }
      }
    }

    // If we found a large image we're viewing, handle scrolling within it
    if (currentLargeImageIndex >= 0) {
      const [, imgTop, imgBottom] = positions[currentLargeImageIndex];
      const remainingImageAbove = currentScroll - imgTop;

      // Check if we're already at or very close to the top of this image (within 50px)
      if (remainingImageAbove <= 50) {
        // Already at top of this large image, go to previous image
        // IMPORTANT: Only look for images whose TOP is significantly ABOVE current scroll
        for (let j = currentLargeImageIndex - 1; j >= 0; j--) {
          const prevImgTop = positions[j][1];
          const prevImgBottom = positions[j][2];

          // Skip if this image's top is at or below where we are
          if (prevImgTop >= currentScroll - 50) continue;

          // Find previous image that ends before this one starts
          if (prevImgBottom < imgTop - 10) {
            return {
              position: findNonTruncatedPosition(prevImgTop, viewportHeight),
              reason: `W: At top of large img[${currentLargeImageIndex}]\n→ Jump to prev img[${j}] @ ${prevImgTop}px\nCurrent: ${currentScroll}px, ImgTop: ${imgTop}px\nPrevImgTop: ${prevImgTop}px (${currentScroll - prevImgTop}px above)`
            };
          }
        }
        // No previous image, scroll up by viewport or to top
        const newPos = Math.max(0, currentScroll - scrollIncrement);
        return {
          position: newPos,
          reason: `W: At top of large img[${currentLargeImageIndex}]\n→ No prev img found, scroll up by viewport\nCurrent: ${currentScroll}px → ${newPos}px`
        };
      }

      // We're somewhere in the middle of the large image, scroll up within it
      const prevPosition = currentScroll - scrollIncrement;
      const newPos = Math.max(prevPosition, imgTop);
      return {
        position: newPos,
        reason: `W: Inside large img[${currentLargeImageIndex}]\n→ Scroll within image\nCurrent: ${currentScroll}px → ${newPos}px\nRemaining above: ${remainingImageAbove}px\nImgTop: ${imgTop}px, ImgBottom: ${imgBottom}px`
      };
    }

    // Normal navigation - find previous image ABOVE current position
    // Search backwards to find the closest image above us
    for (let i = positions.length - 1; i >= 0; i--) {
      const [, imgTop, imgBottom] = positions[i];

      // Skip images at or below current scroll position (with 50px tolerance)
      if (imgTop >= currentScroll - 50) continue;

      // Found the first image above us - use it
      return {
        position: findNonTruncatedPosition(imgTop, viewportHeight),
        reason: `W: Normal nav\n→ Jump to prev img[${i}] @ ${imgTop}px\nCurrent: ${currentScroll}px (${currentScroll - imgTop}px below)`
      };
    }

    // No images found above, scroll up by viewport
    const newPos = Math.max(0, currentScroll - scrollIncrement);
    return {
      position: newPos,
      reason: `W: No images above\n→ Scroll up by viewport\nCurrent: ${currentScroll}px → ${newPos}px`
    };
  }

  function scrollShiftUp(currentScroll, viewportHeight) {
    // Shift+W should scroll up by one viewport and align to nearest image
    // It should ONLY look at images that are above or near the NEW scroll position
    const targetScrollTop = Math.max(currentScroll - viewportHeight, 0);

    // Find images that would be visible or near the top after scrolling up
    let bestImageTop = targetScrollTop; // Default to just scrolling up one viewport

    // Look through images in reverse order (bottom to top)
    for (let i = positions.length - 1; i >= 0; i--) {
      const [, imgTop, imgBottom] = positions[i];

      // Only consider images that are above our current position
      // This prevents jumping back to earlier pages
      if (imgTop >= currentScroll) continue;

      // Find images near where we want to scroll to
      // We want the image closest to targetScrollTop that's above current position
      if (imgTop <= targetScrollTop + viewportHeight * 0.3 && imgTop >= targetScrollTop - viewportHeight * 0.1) {
        bestImageTop = imgTop;
        break; // Found the best match
      }

      // If image is just above target area, use it
      if (imgTop < targetScrollTop && imgTop >= targetScrollTop - 100) {
        bestImageTop = imgTop;
        break;
      }
    }

    return findNonTruncatedPosition(bestImageTop, viewportHeight);
  }

  // Set up MutationObserver to detect dynamic content changes
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;

    for (const mutation of mutations) {
      // Check if images or iframes were added
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeName === 'IMG' ||
              node.nodeName === 'IFRAME' ||
              node.nodeName === 'HTML' ||
              node.nodeName === 'BODY' ||
              (node.querySelectorAll && node.querySelectorAll('img').length > 0)) {
            shouldUpdate = true;
            break;
          }
        }
      }

      // Check if attributes changed (like src, width, height)
      if (mutation.type === 'attributes' &&
          (mutation.target.nodeName === 'IMG' || mutation.target.nodeName === 'IFRAME')) {
        shouldUpdate = true;
      }

      if (shouldUpdate) break;
    }

    if (shouldUpdate) {
      // Invalidate cache when DOM changes
      lastCacheTime = 0;
    }
  });

  // Start observing the document for changes
  observer.observe(document.documentElement, { // Watch from documentElement to catch nested html tags
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'width', 'height', 'style', 'class']
  });

  // Also listen for image load events in main document and iframes
  document.addEventListener('load', (event) => {
    if (event.target.nodeName === 'IMG' || event.target.nodeName === 'IFRAME') {
      lastCacheTime = 0; // Invalidate cache

      // If iframe loaded, observe it too
      if (event.target.nodeName === 'IFRAME') {
        try {
          const iframeDoc = event.target.contentDocument || event.target.contentWindow.document;
          if (iframeDoc) {
            iframeDoc.addEventListener('load', (e) => {
              if (e.target.nodeName === 'IMG') {
                lastCacheTime = 0;
              }
            }, true);
          }
        } catch (e) {
          // Cross-origin iframe
        }
      }
    }
  }, true);

  document.addEventListener("keydown", function(event) {
    if (event.ctrlKey || event.altKey) return;

    const tagName = event.target.tagName;
    const contentEditable = event.target.getAttribute("contenteditable");
    if ((tagName && tagName.match(/input|select|textarea/i)) || contentEditable === "true") {
      return;
    }

    // Update image positions (will use cache if recent)
    updateImagePositions();

    const currentScroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    const viewportHeight = window.innerHeight;

    let result = null;

    const key = event.key;
    const lowerKey = key.toLowerCase();

    if (lowerKey === KEY_S && !event.shiftKey) {
      result = scrollToNextImage(currentScroll, viewportHeight);
    } else if (lowerKey === KEY_W && !event.shiftKey) {
      result = scrollToPreviousImage(currentScroll, viewportHeight);
    } else if (lowerKey === KEY_W && event.shiftKey) {
      result = {
        position: scrollShiftUp(currentScroll, viewportHeight),
        reason: `Shift+W: Scroll up one viewport\nCurrent: ${currentScroll}px`
      };
    } else {
      return;
    }

    const newScrollPosition = result.position;
    const scrollDelta = Math.abs(newScrollPosition - currentScroll);

    // Check if scroll is stuck (position didn't change or changed very little)
    if (scrollDelta < 5) {
      stuckCount++;
      createToast(`⚠️ STUCK (${stuckCount}x)\n${result.reason}\n\nScroll delta: ${scrollDelta.toFixed(1)}px\nPositions found: ${positions.length}`, 5000);
    } else {
      stuckCount = 0; // Reset stuck counter on successful scroll
      // Show normal navigation toast (optional, comment out if too noisy)
      // createToast(result.reason, 2000);
    }

    if (newScrollPosition !== currentScroll) {
      event.preventDefault();
      window.scrollTo({
        top: newScrollPosition,
        behavior: 'instant'
      });

      lastScrollPosition = newScrollPosition;

      // After scrolling, wait a moment for any lazy-loaded images to appear
      setTimeout(() => {
        lastCacheTime = 0; // Invalidate cache after scroll
      }, 150);
    }
  });
})();