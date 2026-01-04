// ==UserScript==
// @name         Holotower Soundposts
// @namespace    http://tampermonkey.net/
// @version      1.5
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

  const SITE_VOLUME_KEY = 'videovolume';
  const VOLUME_FALLBACK = 1.0;

  const soundMap = new Map(); // filePath → sound URL
  const active   = new Map(); // media element → { audio, visibilityObserver, listeners }

  const NATIVE_EXPANDED_IMAGE_SELECTOR = 'img.full-image';
  const NATIVE_HOVER_IMAGE_SELECTOR = '#chx_hoverImage';
  const IQ_HOVER_IMAGE_SELECTOR = 'img[style*="position: fixed"][style*="pointer-events: none"]';
  const ALL_IMAGE_SELECTORS = `${NATIVE_EXPANDED_IMAGE_SELECTOR}, ${NATIVE_HOVER_IMAGE_SELECTOR}, ${IQ_HOVER_IMAGE_SELECTOR}`;


  const siteVolume = () => {
    let v = localStorage.getItem(SITE_VOLUME_KEY);
    if (typeof v === "string" && v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1);
    }
    v = parseFloat(v);
    if (!isFinite(v) || v < 0 || v > 1) v = VOLUME_FALLBACK;
    return v;
  };

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

  function validateSoundLink(url, filePath, linkElement) {
    const audio = new Audio();
    audio.preload = 'metadata'; // We only need to know if it's playable, not download the whole thing.

    // --- Define our event handlers ---

    // SUCCESS HANDLER: The browser confirmed it can play this file.
    const onSuccess = () => {
      cleanup(); // Important: Stop listening to prevent memory leaks.
      // The link is valid, so we do nothing and let the sound play later.
    };

    // ERROR HANDLER: The browser failed to load the media.
    const onError = () => {
      cleanup();
      // This is where we mark the link as broken.
      soundMap.delete(filePath);
      const brokenMark = document.createElement('span');
      brokenMark.textContent = ' [broken]';
      brokenMark.style.color = 'red';
      linkElement.after(brokenMark);
    };
    
    // --- Cleanup function to remove event listeners ---
    const cleanup = () => {
      audio.removeEventListener('canplaythrough', onSuccess);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('abort', onError);
      audio.src = ''; // Stop any potential network activity.
    };
    
    // --- Attach listeners and start the loading process ---
    audio.addEventListener('canplaythrough', onSuccess, { once: true });
    audio.addEventListener('error', onError, { once: true });
    audio.addEventListener('abort', onError, { once: true }); // Also catch if the download is aborted.
    
    audio.src = url;
  }

  function scan(root = document) {
    root.querySelectorAll('p.fileinfo a[download]').forEach(a => {
      const span = a.closest('span.unimportant');
      if (!span) return;
      const m = a.download.match(/\[sound=([^\]]+)]/i);
      if (!m) return;
      try {
        const url = decodeURIComponent(decodeURIComponent(m[1]));
        const fullURL = url.startsWith('http') ? url : `https://${url}`;
        const filePath = new URL(a.getAttribute('href'), location.href).pathname;

        const linkElement = tagIcon(span, fullURL);
        if (!linkElement) return;

        soundMap.set(filePath, fullURL);

        validateSoundLink(fullURL, filePath, linkElement);
      } catch {}
    });
  }

  function isDisplayVisible(el) {
    if (!el) return false;
    const style = el.style.display || window.getComputedStyle(el).display;
    return style === "block" || style === "inline" || style === "";
  }

  // SOUNDPOST VIDEO HANDLER
  function bind(video) {
    const path = new URL(video.src, location.href).pathname;
    const soundURL = soundMap.get(path);
    if (!soundURL || active.has(video)) return;

    let container = video.parentElement;
    for (let i = 0; i < 2; ++i) {
      if (!container) break;
      if (container.style && (container.style.display !== undefined)) break;
      container = container.parentElement;
    }
    if (!container || container === document.body) container = video;

    const audio = new Audio(soundURL);
    audio.preload = 'auto';
    audio.loop    = true;
    audio.volume  = video.volume ?? siteVolume();
    audio.muted   = video.muted;
    video.loop = true;

    const listeners = {};

    listeners.tighten = () => {
      const d = video.duration || 1;
      const target = audio.currentTime % d;
      if (Math.abs(video.currentTime - target) > 0.25) {
        video.currentTime = target;
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
      audio.muted  = video.muted;
    };

    audio.addEventListener('timeupdate', listeners.tighten);
    video.addEventListener('play', listeners.tryPlayAudio);
    video.addEventListener('pause', listeners.onVideoPause);
    video.addEventListener('volumechange', listeners.onVolumeChange);

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

  // SOUNDPOST IMAGE HANDLER
  function bindImage(img) {
    const path = new URL(img.src, location.href).pathname;
    const soundURL = soundMap.get(path);
    if (!soundURL || active.has(img)) return;

    let container = img.parentElement;
    if (img.matches(ALL_IMAGE_SELECTORS)) {
        container = img;
    } else {
      for (let i = 0; i < 2; ++i) {
        if (!container) break;
        if (container.style && (container.style.display !== undefined)) break;
        container = container.parentElement;
      }
      if (!container || container === document.body) container = img;
    }

    const audio = new Audio(soundURL);
    audio.preload = 'auto';
    audio.loop    = true;

    const listeners = {};

    listeners.tryPlayAudio = () => {
      if (!audio.paused && isDisplayVisible(container)) return;
      if (isDisplayVisible(container)) {
        audio.volume = siteVolume();
        audio.currentTime = 0;
        audio.play().catch(()=>{});
      }
    };

    listeners.tryPauseAudio = () => {
      if (!isDisplayVisible(container) && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

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

  function scanImages(root=document) {
    root.querySelectorAll(ALL_IMAGE_SELECTORS).forEach(bindImage);
  }

  // CENTRALIZED OBSERVER FOR ADDING AND REMOVING NODES

  const mainObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      // Handle newly added nodes
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches('.post, .reply')) scan(node);
        node.querySelectorAll?.('.post, .reply').forEach(scan);
        if (node.matches('video')) bind(node);
        node.querySelectorAll?.('video').forEach(bind);
        if (node.matches(ALL_IMAGE_SELECTORS)) bindImage(node);
        node.querySelectorAll?.(ALL_IMAGE_SELECTORS).forEach(bindImage);
      }

      // Handle removed nodes (GARBAGE COLLECTION)
      for (const removedNode of mutation.removedNodes) {
        if (removedNode.nodeType !== 1) continue;
        active.forEach((value, key) => {
          if (removedNode === key || removedNode.contains(key)) {
            // Full teardown to prevent zombie listeners
            value.audio.pause();
            value.visibilityObserver.disconnect();

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

  // BOOTSTRAP
  scan();
  document.querySelectorAll('video').forEach(bind);
  scanImages();
  mainObserver.observe(document.body, { childList: true, subtree: true });

  function patchPostCloning() {
    const postProto = window.g?.Post?.prototype;
    if (typeof postProto?.addClone !== 'function') {
      if ((patchPostCloning.attempts || 0) < 5) {
        setTimeout(patchPostCloning, 500);
        patchPostCloning.attempts = (patchPostCloning.attempts || 0) + 1;
      }
      return;
    }

    const originalAddClone = postProto.addClone;
    if (originalAddClone.isPatchedBySoundposts) return;

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