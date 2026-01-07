// ==UserScript==
// @name         Holotower Soundposts
// @namespace    http://tampermonkey.net/
// @version      1.6
// @author       grem
// @license      MIT
// @description  Play sound for soundposts (video and image) on Holotower.
// @match        https://boards.holotower.org/*
// @match        https://holotower.org/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhIAAgAHAAACH5BAEAAPsALAAAAAAgACAAh2x+yAc0uCFFvQo5vgI5wwY7wjpexwo8wQQ8xAU/xgVAyAxEyVh60w0/wwZAyAhCzAhEzghGzwhH0hRNz3eV3YnB7kin7E+v8VCz8VC571G88VHC8UzF9HrP7g1EyAdDzQlI0QpJ1AtL1gpO1w1P2ihf2Wiy8Rub+R6i+R6p+iKv+iO2/CK8/SvB+g9GzAhH0QpJ0wxN1wtP2Q1R2w5S3w1V3xFX4UJ142u28B6f+SKl9yKs+ySz+yS6/CXA/XHS9w1KzwpK1QtN1QtP1w1Q2w1S3Q9U3xBX4BBY5BBb5Q5d6BVf5laI5mu68R+i+CKq+iOw+yS3/CS9/jPC+XKO2nST3nSU3nOV4HSV4nWX5XaY43Sb5nib5nad6Hed6nWd7W6b64Ck6mu88R+m+iOt+iS0+yS7/SfB/ZDb9my88iCr+iSx+yS4/CS//kfH92y/8CKu+SS1+yS8/SrB/GzA8yGz+iS5/STA/mHN92rD8yO2+yS9/S7C+o6s3mzF8yO6/CbA/X/V9pGy7l2O5m3G8yK+/TvE+CNz7GOX6mzJ8yjA/J/f9nap7hR18mie7GbK9EvH9iB+7xV99Wmi7mnK8Fif8BmE8xiE9Wqn8CGL8huL9xqL9myr8EGe7xuT9xyT9xqT92yx8Y3H8iGa9h+b+B6b+B2b+Gy38S2k9B+i+SCi+G67827C8CCp+iGp+h+p+m/A83bT82nR93HQ9nHM9nDK9m3J9W7G9W/E83DA9G6/82y982258mu183u58Cqw9yOx+iSw+yKw+3LF9FnK9CvB/CO//SS7/CS3+yO0+iOw+SGs+iCo+iGk+B+h+B6d+iub71PC9CO4/SS5/CW4/CO4/HHL9UjH9ijB/SO+/iS6/SS2/CSy+yOu+yKr+iKn+B+j+TKm9Jzd9Si/+yPA/m3N9pbc9jfD+SOt+yCq+zSr9ZPX8IHW94LX9n7V9nnU9SS0/COw+jey81/N9ji29kjH9zm+9pTc9jPC+DTB94jW8QAAAAAAAAAAAAAAAAAAAAj/APcJFAhgoMGDCBMiDCBAocOHAwcQKGAAosWDBxAkULCAwcWLDRw8gBBBwgQKDytYuIAhg4YNHDoc9PAhAogQIkaQKOHQxAkUKVSsYNECoYsXMETEkDGDRg0bNxLiyKFjB48ePn4gBBJEyBAiRYwcQZJEyRImB5s4eQIlipQpCalUsXIFSxYtW7h08fIFTBiDYsaQKWPmDJqPENOoWcOmjRvEEN/AiSNnDmSIdOrYuYPn8sM8evbwudjno58/gAJZFDToI6FChi4eQvQxkaJFFhk1cvTxEaSLkSRN+kjpYiVLlzB5fphJ0yZOyxV28vQJVKjoCEWNIlXK1CnsB1GlnFKlCsUq8ANZtXLF/hUsg7FkzaJVy9YtXLl07eLVy1fCX8AEI6AwwxxETDHGHINMMsosw0wzzjwDDULRSDMNNRhWY01C12CTjTbbcNONN9+AE85B4ozjw4orklOOQuac48Me08SxBjrpqHPQOuy046OP7kD0Dh93yEENPPHIg95A88zRhhlR0LOkQfWckY09Uxp0Dz75ZHmQPgcFBAA7
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539175/Holotower%20Soundposts.user.js
// @updateURL https://update.greasyfork.org/scripts/539175/Holotower%20Soundposts.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Storage key for user's volume preference
  const SITE_VOLUME_KEY = 'videovolume';
  const VOLUME_FALLBACK = 1.0;

  // Maps file paths to their associated sound URLs
  const soundMap = new Map(); // filePath → sound URL
  // Tracks active media elements with bound audio
  const active = new Map(); // media element → { audio, visibilityObserver, listeners }

  // CSS selectors for different image viewer types
  const NATIVE_EXPANDED_IMAGE_SELECTOR = 'img.full-image';
  const NATIVE_HOVER_IMAGE_SELECTOR = '#chx_hoverImage';
  const IQ_HOVER_IMAGE_SELECTOR = 'img[style*="position: fixed"][style*="pointer-events: none"]';
  const ALL_IMAGE_SELECTORS = `${NATIVE_EXPANDED_IMAGE_SELECTOR}, ${NATIVE_HOVER_IMAGE_SELECTOR}, ${IQ_HOVER_IMAGE_SELECTOR}`;

  // Get user's saved volume preference, with validation
  const siteVolume = () => {
    let v = localStorage.getItem(SITE_VOLUME_KEY);
    if (typeof v === "string" && v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1); // Remove JSON string quotes if present
    }
    v = parseFloat(v);
    if (!isFinite(v) || v < 0 || v > 1) v = VOLUME_FALLBACK;
    return v;
  };

  // Whitelist of allowed domains for sound file URLs
  const ALLOWED_SOUND_DOMAINS = [
    'files.catbox.moe',
    'litterbox.catbox.moe'
    // Add more domains here as needed
  ];

  // Whitelist check for sound file URLs
  const isAllowedSoundURL = (url) => {
    try {
      const urlObj = new URL(url);
      return ALLOWED_SOUND_DOMAINS.includes(urlObj.hostname);
    } catch {
      return false;
    }
  };

  // Add sound icon link next to file info (prevents duplicates)
  const tagIcon = (span, fullURL) => {
    if (span.dataset.soundControlsAdded) return;
    span.dataset.soundControlsAdded = 'true';
    const link = document.createElement('a');
    link.href = fullURL;
    link.target = '_blank';
    link.textContent = ' 🔊';
    link.title = 'This file has sound. Click to open sound source.';
    span.after(link);
    return link;
  };

  // Validate that a sound URL is actually playable (checks file exists and format is valid)
  function validateSoundLink(url, filePath, linkElement) {
    const audio = new Audio();
    audio.preload = 'metadata'; // Only check metadata, don't download entire file

    const onSuccess = () => {
      cleanup(); // Valid file - cleanup and let it play later
    };

    const onError = () => {
      cleanup();
      soundMap.delete(filePath); // Remove from map since it's broken
      const brokenMark = document.createElement('span');
      brokenMark.textContent = ' [broken]';
      brokenMark.style.color = 'red';
      linkElement.after(brokenMark);
    };

    const cleanup = () => {
      audio.removeEventListener('canplaythrough', onSuccess);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('abort', onError);
      audio.src = ''; // Stop network activity
    };

    audio.addEventListener('canplaythrough', onSuccess, { once: true });
    audio.addEventListener('error', onError, { once: true });
    audio.addEventListener('abort', onError, { once: true });

    audio.src = url; // Start validation
  }

  // Scan DOM for file download links with [sound=...] annotations
  function scan(root = document) {
    root.querySelectorAll('p.fileinfo a[download]').forEach(a => {
      const span = a.closest('span.unimportant');
      if (!span) return;
      const m = a.download.match(/\[sound=([^\]]+)]/i);
      if (!m) return;
      try {
        const url = decodeURIComponent(decodeURIComponent(m[1])); // May be double-encoded
        const fullURL = url.startsWith('http') ? url : `https://${url}`;
        const filePath = new URL(a.getAttribute('href'), location.href).pathname;

        // Security: reject URLs not from whitelisted domains
        if (!isAllowedSoundURL(fullURL)) {
          const rejectedMark = document.createElement('span');
          rejectedMark.textContent = ' [blocked]';
          rejectedMark.style.color = 'orange';
          span.after(rejectedMark);
          return;
        }

        const linkElement = tagIcon(span, fullURL);
        if (!linkElement) return;

        soundMap.set(filePath, fullURL); // Register this file with its sound
        validateSoundLink(fullURL, filePath, linkElement);
      } catch {}
    });
  }

  // Check if element is visible (not hidden by display:none)
  function isDisplayVisible(el) {
    if (!el) return false;
    const style = el.style.display || window.getComputedStyle(el).display;
    return style === "block" || style === "inline" || style === "";
  }

  // Bind sound playback to a video element (syncs audio with video)
  function bind(video) {
    const path = new URL(video.src, location.href).pathname;
    const soundURL = soundMap.get(path);
    if (!soundURL || active.has(video)) return;
    if (!isAllowedSoundURL(soundURL)) return; // Security check

    // Find container element that controls visibility (for image viewer)
    let container = video.parentElement;
    for (let i = 0; i < 2; ++i) {
      if (!container) break;
      if (container.style && (container.style.display !== undefined)) break;
      container = container.parentElement;
    }
    if (!container || container === document.body) container = video;

    const audio = new Audio(soundURL);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = video.volume ?? siteVolume();
    audio.muted = video.muted;
    video.loop = true;

    const listeners = {};

    // Keep video synchronized with audio loop
    listeners.tighten = () => {
      const d = video.duration || 1;
      const target = audio.currentTime % d;
      if (Math.abs(video.currentTime - target) > 0.25) {
        video.currentTime = target; // Sync if more than 0.25s off
      }
      if (video.paused) video.play().catch(()=>{});
    };

    listeners.tryPlayAudio = () => {
      if (!audio.paused && !video.paused) return;
      if (isDisplayVisible(container) && !video.paused) {
        listeners.tighten();
        audio.play().catch(()=>{});
      }
    };

    listeners.tryPauseAudio = () => {
      if (!isDisplayVisible(container) && !audio.paused) {
        audio.pause();
      }
    };

    listeners.onVideoPause = () => { if (!audio.paused) audio.pause(); };
    listeners.onVolumeChange = () => {
      audio.volume = video.volume;
      audio.muted = video.muted;
    };

    audio.addEventListener('timeupdate', listeners.tighten);
    video.addEventListener('play', listeners.tryPlayAudio);
    video.addEventListener('pause', listeners.onVideoPause);
    video.addEventListener('volumechange', listeners.onVolumeChange);

    // Watch for visibility changes (e.g., when image viewer opens/closes)
    const visibilityObserver = new MutationObserver(() => {
      const visible = isDisplayVisible(container);
      if (visible) {
        listeners.tryPlayAudio();
      } else {
        listeners.tryPauseAudio();
      }
    });
    visibilityObserver.observe(container, { attributes: true, attributeFilter: ["style"] });

    if (isDisplayVisible(container) && !video.paused) {
      listeners.tryPlayAudio();
    }
    active.set(video, { audio, visibilityObserver, listeners });
  }

  // Bind sound playback to an image element (plays when image is visible)
  function bindImage(img) {
    const path = new URL(img.src, location.href).pathname;
    const soundURL = soundMap.get(path);
    if (!soundURL || active.has(img)) return;
    if (!isAllowedSoundURL(soundURL)) return; // Security check

    // For expanded/hover images, use image itself as container
    let container = img.parentElement;
    if (img.matches(ALL_IMAGE_SELECTORS)) {
        container = img;
    } else {
      // Otherwise find parent container that controls visibility
      for (let i = 0; i < 2; ++i) {
        if (!container) break;
        if (container.style && (container.style.display !== undefined)) break;
        container = container.parentElement;
      }
      if (!container || container === document.body) container = img;
    }

    const audio = new Audio(soundURL);
    audio.preload = 'auto';
    audio.loop = true;

    const listeners = {};

    // Play from beginning when image becomes visible
    listeners.tryPlayAudio = () => {
      if (!audio.paused && isDisplayVisible(container)) return;
      if (isDisplayVisible(container)) {
        audio.volume = siteVolume();
        audio.currentTime = 0; // Always restart from beginning
        audio.play().catch(()=>{});
      }
    };

    // Pause and reset when image is hidden
    listeners.tryPauseAudio = () => {
      if (!isDisplayVisible(container) && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    // Watch for visibility changes
    const visibilityObserver = new MutationObserver(() => {
      const visible = isDisplayVisible(container);
      if (visible) {
        listeners.tryPlayAudio();
      } else {
        listeners.tryPauseAudio();
      }
    });
    visibilityObserver.observe(container, { attributes: true, attributeFilter: ["style"] });

    if (isDisplayVisible(container)) {
      listeners.tryPlayAudio();
    }
    active.set(img, { audio, visibilityObserver, listeners: {} });
  }

  // Scan for image elements that should have sound bound
  function scanImages(root=document) {
    root.querySelectorAll(ALL_IMAGE_SELECTORS).forEach(bindImage);
  }

  // Watch for DOM changes to handle dynamically loaded content
  const mainObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      // Handle newly added nodes (new posts, videos, images)
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue; // Skip non-element nodes
        if (node.matches('.post, .reply')) scan(node);
        node.querySelectorAll?.('.post, .reply').forEach(scan);
        if (node.matches('video')) bind(node);
        node.querySelectorAll?.('video').forEach(bind);
        if (node.matches(ALL_IMAGE_SELECTORS)) bindImage(node);
        node.querySelectorAll?.(ALL_IMAGE_SELECTORS).forEach(bindImage);
      }

      // Clean up removed nodes to prevent memory leaks
      for (const removedNode of mutation.removedNodes) {
        if (removedNode.nodeType !== 1) continue;
        active.forEach((value, key) => {
          if (removedNode === key || removedNode.contains(key)) {
            value.audio.pause();
            value.visibilityObserver.disconnect();

            // Remove video-specific listeners if present
            if (value.listeners.tighten) {
              value.audio.removeEventListener('timeupdate', value.listeners.tighten);
              key.removeEventListener('play', value.listeners.tryPlayAudio);
              key.removeEventListener('pause', value.listeners.onVideoPause);
              key.removeEventListener('volumechange', value.listeners.onVolumeChange);
            }

            active.delete(key);
          }
        });
      }
    }
  });

  // Initialize: scan existing content and start watching for changes
  scan();
  document.querySelectorAll('video').forEach(bind);
  scanImages();
  mainObserver.observe(document.body, { childList: true, subtree: true });

  // Patch Post.addClone to ensure soundposts work with cloned posts (previews, etc.)
  function patchPostCloning() {
    const postProto = window.g?.Post?.prototype;
    if (typeof postProto?.addClone !== 'function') {
      // Retry if Post prototype not available yet (up to 5 attempts)
      if ((patchPostCloning.attempts || 0) < 5) {
        setTimeout(patchPostCloning, 500);
        patchPostCloning.attempts = (patchPostCloning.attempts || 0) + 1;
      }
      return;
    }

    const originalAddClone = postProto.addClone;
    if (originalAddClone.isPatchedBySoundposts) return; // Already patched

    // Wrap addClone to scan and bind sound to cloned posts
    postProto.addClone = function(...args) {
      const cloneObj = originalAddClone.apply(this, args);
      if (cloneObj?.nodes?.root) {
        const clonedPost = cloneObj.nodes.root;
        scan(clonedPost);
        clonedPost.querySelectorAll('video').forEach(bind);
        scanImages(clonedPost);
      }
      return cloneObj;
    };
    postProto.addClone.isPatchedBySoundposts = true;
  }

  patchPostCloning();

})();